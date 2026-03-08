import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

export default async function handler(req, res) {
  const { token } = req.query;

  const {
    META_APP_ID,
    META_APP_SECRET,
    SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY,
    APP_URL,
  } = process.env;

  if (!META_APP_ID || !META_APP_SECRET || !APP_URL) {
    return res.status(500).json({ error: "Server misconfigured: missing Meta or APP_URL env vars" });
  }

  // Verify JWT via Supabase to extract userId
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
    `ig_oauth_nonce=${nonce}; HttpOnly; SameSite=Lax; Path=/; Max-Age=600; Secure`
  );

  // Instagram Graph API scopes for live selling
  const scopes = [
    "instagram_business_basic",
    "instagram_business_manage_comments",
    "instagram_business_manage_messages",
    "instagram_manage_insights",
    "pages_show_list",
    "pages_read_engagement",
  ].join(",");

  const redirectUri = `${APP_URL}/api/instagram/callback`;

  // Use Facebook Login OAuth (required for Instagram Business accounts)
  const authUrl =
    `https://www.facebook.com/v21.0/dialog/oauth` +
    `?client_id=${META_APP_ID}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&scope=${encodeURIComponent(scopes)}` +
    `&response_type=code` +
    `&state=${encodeURIComponent(state)}`;

  res.redirect(302, authUrl);
}
