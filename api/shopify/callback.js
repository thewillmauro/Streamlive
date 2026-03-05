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

function decryptToken(ciphertext, secret) {
  const key = crypto.createHash("sha256").update(secret).digest();
  const [ivHex, tagHex, encrypted] = ciphertext.split(":");
  const decipher = crypto.createDecipheriv(ALGO, key, Buffer.from(ivHex, "hex"));
  decipher.setAuthTag(Buffer.from(tagHex, "hex"));
  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

export default async function handler(req, res) {
  const { code, shop, state, hmac, timestamp, ...restQuery } = req.query;
  const {
    SHOPIFY_API_KEY,
    SHOPIFY_API_SECRET,
    SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY,
    APP_URL,
    COOKIE_ENCRYPTION_KEY,
  } = process.env;

  if (!SHOPIFY_API_SECRET || !APP_URL) {
    return res.status(500).json({ error: "Server misconfigured" });
  }

  if (!code || !shop || !state || !hmac) {
    return res.status(400).json({ error: "Missing required parameters" });
  }

  // ── Validate shop domain format ──────────────────────────────────────────
  if (!/^[a-zA-Z0-9][a-zA-Z0-9\-]*\.myshopify\.com$/.test(shop)) {
    return res.status(400).json({ error: "Invalid shop domain" });
  }

  // ── HMAC validation (timing-safe) ──────────────────────────────────────────
  const params = { ...restQuery, code, shop, state, timestamp };
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
    console.error("Shopify token exchange failed");
    return res.status(502).json({ error: "Failed to exchange code with Shopify" });
  }

  const { access_token, scope } = await tokenRes.json();

  // ── Persist connection in Supabase (optional — works without it) ───────────
  if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
    try {
      const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
      await supabase.from("connections").upsert(
        {
          profile_id: stateData.userId,
          platform: "shopify",
          access_token_encrypted: COOKIE_ENCRYPTION_KEY
            ? encryptToken(access_token, COOKIE_ENCRYPTION_KEY)
            : access_token,
          handle: shop,
          scope,
          connected_at: new Date().toISOString(),
        },
        { onConflict: "profile_id,platform" }
      );
    } catch (err) {
      console.error("Supabase connection storage error");
    }
  }

  // ── Store credentials in httpOnly cookies so /api/shopify/sync can use them ─
  const encryptionKey = COOKIE_ENCRYPTION_KEY || SHOPIFY_API_SECRET;
  const encryptedToken = encryptToken(access_token, encryptionKey);

  const cookieOpts = "HttpOnly; SameSite=Lax; Path=/; Max-Age=86400; Secure";
  res.setHeader("Set-Cookie", [
    `shopify_oauth_nonce=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0; Secure`,
    `shopify_token=${encryptedToken}; ${cookieOpts}`,
    `shopify_shop=${shop}; ${cookieOpts}`,
  ]);

  // ── Redirect back to app ──────────────────────────────────────────────────
  const redirectUrl = `${APP_URL}/app?shopify=connected&shop=${encodeURIComponent(shop)}`;
  res.redirect(302, redirectUrl);
}

// Export decrypt for use by sync endpoint
export { decryptToken };
