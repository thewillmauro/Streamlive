import { createClient } from "@supabase/supabase-js";

const PLAN_PRICES = { starter: 79, growth: 199, pro: 399, enterprise: 999 };
const VALID_PLANS = ["starter", "growth", "pro", "enterprise"];

async function verifyAdmin(req) {
  const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = process.env;
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return { error: "Server misconfigured", status: 500 };
  }

  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer ")) {
    return { error: "Missing authorization", status: 401 };
  }

  const token = auth.replace("Bearer ", "");
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) {
    return { error: "Invalid token", status: 401 };
  }

  // Check is_admin on profile
  const { data: profile, error: profileErr } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  if (profileErr || !profile?.is_admin) {
    return { error: "Access denied", status: 403 };
  }

  return { supabase, userId: user.id };
}

export default async function handler(req, res) {
  // CORS
  const origin = req.headers.origin || "";
  const allowed = ["https://www.strmlive.com", "https://strmlive.com", "http://localhost:5173", "http://localhost:4173"];
  if (allowed.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Methods", "GET,PATCH,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");

  if (req.method === "OPTIONS") return res.status(200).end();

  const result = await verifyAdmin(req);
  if (result.error) {
    return res.status(result.status).json({ error: result.error });
  }

  const { supabase } = result;
  const action = req.query.action || "list";

  // ── GET: List all users ────────────────────────────────────────────────────
  if (req.method === "GET" && action === "list") {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) return res.status(500).json({ error: error.message });
    return res.json({ users: data || [] });
  }

  // ── GET: Stats ─────────────────────────────────────────────────────────────
  if (req.method === "GET" && action === "stats") {
    const { data, error } = await supabase
      .from("profiles")
      .select("plan,created_at");

    if (error) return res.status(500).json({ error: error.message });

    const users = data || [];
    const planCounts = {};
    let mrr = 0;
    const sevenDaysAgo = new Date(Date.now() - 7 * 86400000);
    let recentSignups = 0;

    for (const u of users) {
      const plan = u.plan || "starter";
      planCounts[plan] = (planCounts[plan] || 0) + 1;
      mrr += PLAN_PRICES[plan] || 0;
      if (u.created_at && new Date(u.created_at) > sevenDaysAgo) {
        recentSignups++;
      }
    }

    return res.json({
      total: users.length,
      planCounts,
      mrr,
      recentSignups,
    });
  }

  // ── PATCH: Update user plan ────────────────────────────────────────────────
  if (req.method === "PATCH" && action === "update-plan") {
    const { userId, plan } = req.body || {};

    if (!userId || !plan) {
      return res.status(400).json({ error: "Missing userId or plan" });
    }
    if (!VALID_PLANS.includes(plan)) {
      return res.status(400).json({ error: "Invalid plan. Must be: " + VALID_PLANS.join(", ") });
    }

    const { error } = await supabase
      .from("profiles")
      .update({ plan })
      .eq("id", userId);

    if (error) return res.status(500).json({ error: error.message });
    return res.json({ success: true, userId, plan });
  }

  return res.status(400).json({ error: "Unknown action" });
}
