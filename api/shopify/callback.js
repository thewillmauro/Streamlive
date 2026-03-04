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

export default async function handler(req, res) {
  const { code, shop, state, hmac, timestamp, ...restQuery } = req.query;
  const {
    SHOPIFY_API_KEY,
    SHOPIFY_API_SECRET,
    SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY,
    APP_URL,
  } = process.env;

  if (!SHOPIFY_API_SECRET || !APP_URL) {
    return res.status(500).json({ error: "Server misconfigured" });
  }

  if (!code || !shop || !state || !hmac) {
    return res.status(400).json({ error: "Missing required parameters" });
  }

  // ── HMAC validation (timing-safe) ──────────────────────────────────────────
  const params = { ...restQuery, code, shop, state, timestamp };
  // Remove hmac from the params used to compute the digest
  const sortedMessage = Object.keys(params)
    .filter((k) => k !== "hmac" && params[k] !== undefined)
    .sort()
    .map((k) => `${k}=${params[k]}`)
    .join("&");

  const digest = crypto
    .createHmac("sha256", SHOPIFY_API_SECRET)
    .update(sortedMessage)
    .digest("hex");

  try {
    if (
      digest.length !== hmac.length ||
      !crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(hmac))
    ) {
      return res.status(403).json({ error: "HMAC validation failed" });
    }
  } catch {
    return res.status(403).json({ error: "HMAC validation failed" });
  }

  // ── State / nonce validation (CSRF) ────────────────────────────────────────
  const cookies = parseCookies(req.headers.cookie);
  let stateData;
  try {
    stateData = JSON.parse(Buffer.from(state, "base64").toString());
  } catch {
    return res.status(400).json({ error: "Invalid state parameter" });
  }

  if (
    !cookies.shopify_oauth_nonce ||
    cookies.shopify_oauth_nonce !== stateData.nonce
  ) {
    return res.status(403).json({ error: "State validation failed (CSRF)" });
  }

  // ── Exchange code for permanent access token ───────────────────────────────
  const tokenRes = await fetch(`https://${shop}/admin/oauth/access_token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: SHOPIFY_API_KEY,
      client_secret: SHOPIFY_API_SECRET,
      code,
    }),
  });

  if (!tokenRes.ok) {
    const body = await tokenRes.text();
    console.error("Shopify token exchange failed:", body);
    return res.status(502).json({ error: "Failed to exchange code with Shopify" });
  }

  const { access_token, scope } = await tokenRes.json();

  // ── Persist connection in Supabase ─────────────────────────────────────────
  if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
    try {
      const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
      const { error: upsertError } = await supabase.from("connections").upsert(
        {
          profile_id: stateData.userId,
          platform: "shopify",
          access_token_encrypted: access_token,
          handle: shop,
          scope,
          connected_at: new Date().toISOString(),
        },
        { onConflict: "profile_id,platform" }
      );
      if (upsertError) {
        console.error("Connection upsert error:", upsertError);
      }
    } catch (err) {
      console.error("Supabase connection storage error:", err);
    }
  }

  // ── Clear nonce cookie & redirect back to app ──────────────────────────────
  res.setHeader(
    "Set-Cookie",
    "shopify_oauth_nonce=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0; Secure"
  );

  res.redirect(302, `${APP_URL}/app?shopify=connected`);
}
