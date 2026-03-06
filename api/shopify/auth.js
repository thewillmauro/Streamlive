import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

export default async function handler(req, res) {
  const { shop, token, debug } = req.query;

  if (!shop) {
    return res.status(400).json({ error: "Missing shop parameter" });
  }

  const {
    SHOPIFY_API_KEY,
    SHOPIFY_API_SECRET,
    SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY,
    APP_URL,
  } = process.env;

  if (!SHOPIFY_API_KEY || !SHOPIFY_API_SECRET || !APP_URL) {
    return res.status(500).json({ error: "Server misconfigured: missing Shopify or APP_URL env vars" });
  }

  // ── Validate and normalize shop domain ────────────────────────────────────
  const shopDomain = shop.includes(".") ? shop : `${shop}.myshopify.com`;
  if (!/^[a-zA-Z0-9][a-zA-Z0-9\-]*\.myshopify\.com$/.test(shopDomain)) {
    return res.status(400).json({ error: "Invalid shop domain" });
  }

  // Verify JWT via Supabase to extract userId (optional — falls back to "anonymous")
  let userId = "anonymous";
  if (token && SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
    try {
      const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
      const { data: { user }, error } = await supabase.auth.getUser(token);
      if (error || !user) {
        return res.status(401).json({ error: "Invalid token" });
      }
      userId = user.id;
    } catch {
      return res.status(401).json({ error: "Token verification failed" });
    }
  }

  // Generate nonce for CSRF protection
  const nonce = crypto.randomBytes(16).toString("hex");
  const state = Buffer.from(JSON.stringify({ userId, nonce })).toString("base64");

  // Set nonce in httpOnly cookie
  res.setHeader(
    "Set-Cookie",
    `shopify_oauth_nonce=${nonce}; HttpOnly; SameSite=Lax; Path=/; Max-Age=600; Secure`
  );

  // 302 redirect to Shopify OAuth authorize
  const redirectUri = `${APP_URL}/api/shopify/callback`;
  const scopes = "read_products";
  const authUrl =
    `https://${shopDomain}/admin/oauth/authorize` +
    `?client_id=${SHOPIFY_API_KEY}` +
    `&scope=${scopes}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&state=${encodeURIComponent(state)}`;

  // Debug mode: show config instead of redirecting
  if (debug === "1") {
    return res.status(200).json({
      shopDomain,
      clientId: SHOPIFY_API_KEY,
      redirectUri,
      authUrl,
      appUrl: APP_URL,
    });
  }

  res.redirect(302, authUrl);
}
