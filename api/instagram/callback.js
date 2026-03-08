import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

function parseCookies(cookieHeader) {
  const cookies = {};
  if (!cookieHeader) return cookies;
  cookieHeader.split(";").forEach((c) => {
    const [key, ...rest] = c.trim().split("=");
    if (key) cookies[key] = rest.join("=");
  });
  return cookies;
}

// ── Token encryption helpers ────────────────────────────────────────────────
const ALGO = "aes-256-gcm";

function encryptToken(plaintext, secret) {
  const key = crypto.createHash("sha256").update(secret).digest();
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGO, key, iv);
  let encrypted = cipher.update(plaintext, "utf8", "hex");
  encrypted += cipher.final("hex");
  const tag = cipher.getAuthTag().toString("hex");
  return `${iv.toString("hex")}:${tag}:${encrypted}`;
}

export default async function handler(req, res) {
  const { code, state, error: fbError, error_description } = req.query;

  const {
    META_APP_ID,
    META_APP_SECRET,
    SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY,
    APP_URL,
    COOKIE_ENCRYPTION_KEY,
  } = process.env;

  if (!META_APP_SECRET || !APP_URL) {
    return res.status(500).json({ error: "Server misconfigured" });
  }

  // User denied permission
  if (fbError) {
    return res.redirect(302, `${APP_URL}/app?ig=error&reason=${encodeURIComponent(error_description || fbError)}`);
  }

  if (!code || !state) {
    return res.status(400).json({ error: "Missing required parameters" });
  }

  // ── State / nonce validation (CSRF) ────────────────────────────────────────
  const cookies = parseCookies(req.headers.cookie);
  let stateData;
  try {
    stateData = JSON.parse(Buffer.from(state, "base64").toString());
  } catch {
    return res.status(400).json({ error: "Invalid state parameter" });
  }

  if (!cookies.ig_oauth_nonce || cookies.ig_oauth_nonce !== stateData.nonce) {
    return res.status(403).json({ error: "State validation failed (CSRF)" });
  }

  // ── Exchange code for short-lived token ────────────────────────────────────
  const redirectUri = `${APP_URL}/api/instagram/callback`;
  const tokenUrl = `https://graph.facebook.com/v21.0/oauth/access_token` +
    `?client_id=${META_APP_ID}` +
    `&client_secret=${META_APP_SECRET}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&code=${code}`;

  const tokenRes = await fetch(tokenUrl);
  if (!tokenRes.ok) {
    const err = await tokenRes.text();
    console.error("Meta token exchange failed:", err);
    return res.redirect(302, `${APP_URL}/app?ig=error&reason=token_exchange_failed`);
  }

  const { access_token: shortToken } = await tokenRes.json();

  // ── Exchange for long-lived token (60 days) ────────────────────────────────
  const longUrl = `https://graph.facebook.com/v21.0/oauth/access_token` +
    `?grant_type=fb_exchange_token` +
    `&client_id=${META_APP_ID}` +
    `&client_secret=${META_APP_SECRET}` +
    `&fb_exchange_token=${shortToken}`;

  const longRes = await fetch(longUrl);
  let accessToken = shortToken;
  let expiresIn = 3600;
  if (longRes.ok) {
    const longData = await longRes.json();
    accessToken = longData.access_token;
    expiresIn = longData.expires_in || 5184000; // 60 days
  }

  // ── Fetch Instagram Business Account ID ────────────────────────────────────
  // Get Facebook Pages the user manages
  const pagesRes = await fetch(
    `https://graph.facebook.com/v21.0/me/accounts?fields=id,name,instagram_business_account&access_token=${accessToken}`
  );

  let igAccountId = null;
  let igUsername = null;
  let pageName = null;
  let pageAccessToken = null;

  if (pagesRes.ok) {
    const pagesData = await pagesRes.json();
    // Find the first page with an Instagram Business Account
    for (const page of pagesData.data || []) {
      if (page.instagram_business_account) {
        igAccountId = page.instagram_business_account.id;
        pageName = page.name;

        // Get a page-level access token (longer lived, better for webhooks)
        // Page tokens from long-lived user tokens are automatically long-lived
        pageAccessToken = page.access_token || accessToken;

        // Fetch Instagram username and profile info
        const igRes = await fetch(
          `https://graph.facebook.com/v21.0/${igAccountId}?fields=username,name,profile_picture_url,followers_count,media_count&access_token=${accessToken}`
        );
        if (igRes.ok) {
          const igData = await igRes.json();
          igUsername = igData.username;
        }
        break;
      }
    }
  }

  if (!igAccountId) {
    return res.redirect(302, `${APP_URL}/app?ig=error&reason=no_instagram_business_account`);
  }

  // ── Persist connection in Supabase ─────────────────────────────────────────
  if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
    try {
      const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
      const encryptionKey = COOKIE_ENCRYPTION_KEY || META_APP_SECRET;
      await supabase.from("connections").upsert(
        {
          profile_id: stateData.userId,
          platform: "instagram",
          access_token_encrypted: encryptToken(accessToken, encryptionKey),
          handle: igUsername || igAccountId,
          scope: "instagram_business_basic,instagram_business_manage_comments,instagram_business_manage_messages,instagram_manage_insights",
          meta: {
            ig_account_id: igAccountId,
            ig_username: igUsername,
            page_name: pageName,
            expires_in: expiresIn,
            connected_at: new Date().toISOString(),
          },
          connected_at: new Date().toISOString(),
        },
        { onConflict: "profile_id,platform" }
      );
    } catch (err) {
      console.error("Supabase connection storage error:", err);
    }
  }

  // ── Clear nonce cookie ─────────────────────────────────────────────────────
  res.setHeader("Set-Cookie", [
    `ig_oauth_nonce=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0; Secure`,
  ]);

  // ── Redirect back to app ───────────────────────────────────────────────────
  const redirectUrl = `${APP_URL}/app?ig=connected&handle=${encodeURIComponent(igUsername || "")}`;
  res.redirect(302, redirectUrl);
}
