import { createClient } from "@supabase/supabase-js";

const PLAN_PRICES = { starter: 79, growth: 199, pro: 399, enterprise: 999 };
const VALID_PLANS = ["starter", "growth", "pro", "enterprise"];

function getSupabase() {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    const missing = [];
    if (!url) missing.push("SUPABASE_URL");
    if (!key) missing.push("SUPABASE_SERVICE_ROLE_KEY");
    return { error: `Missing env vars: ${missing.join(", ")}` };
  }
  return { client: createClient(url, key) };
}

async function verifyAdmin(req) {
  const { client, error: envErr } = getSupabase();
  if (envErr) return { error: envErr, status: 500 };

  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer ")) {
    return { error: "Missing authorization", status: 401 };
  }

  const token = auth.replace("Bearer ", "");
  const { data: { user }, error } = await client.auth.getUser(token);
  if (error || !user) return { error: "Invalid token", status: 401 };

  const { data: profile } = await client
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  if (!profile?.is_admin) return { error: "Access denied", status: 403 };

  return { supabase: client, userId: user.id };
}

export default async function handler(req, res) {
  const origin = req.headers.origin || "";
  const allowed = ["https://www.strmlive.com", "https://strmlive.com", "http://localhost:5173", "http://localhost:4173"];
  if (allowed.includes(origin)) res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
  if (req.method === "OPTIONS") return res.status(200).end();

  const result = await verifyAdmin(req);
  if (result.error) return res.status(result.status).json({ error: result.error });

  const { supabase } = result;
  const action = req.query.action || "list";

  // ── List all users with enriched data ─────────────────────────────────────
  if (req.method === "GET" && action === "list") {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) return res.status(500).json({ error: error.message });
    return res.json({ users: data || [] });
  }

  // ── Platform-wide stats ───────────────────────────────────────────────────
  if (req.method === "GET" && action === "stats") {
    const [profilesRes, buyersRes, showsRes, ordersRes, campaignsRes, connectionsRes] = await Promise.all([
      supabase.from("profiles").select("id,plan,created_at,platforms,category"),
      supabase.from("buyers").select("id,profile_id,spend,status,created_at"),
      supabase.from("shows").select("id,profile_id,gmv,buyers_count,status,platforms,duration_min,date,created_at"),
      supabase.from("orders").select("id,profile_id,total,status,platform,created_at"),
      supabase.from("campaigns").select("id,profile_id,status,recipients,opens,clicks,conversions,gmv,channel"),
      supabase.from("connections").select("id,profile_id,platform,connected_at"),
    ]);

    const users = profilesRes.data || [];
    const buyers = buyersRes.data || [];
    const shows = showsRes.data || [];
    const orders = ordersRes.data || [];
    const campaigns = campaignsRes.data || [];
    const connections = connectionsRes.data || [];

    const now = Date.now();
    const sevenDays = 7 * 86400000;
    const thirtyDays = 30 * 86400000;

    // Plan breakdown
    const planCounts = {};
    let mrr = 0;
    let recentSignups = 0;
    const categories = {};
    for (const u of users) {
      const plan = u.plan || "starter";
      planCounts[plan] = (planCounts[plan] || 0) + 1;
      mrr += PLAN_PRICES[plan] || 0;
      if (u.created_at && now - new Date(u.created_at).getTime() < sevenDays) recentSignups++;
      if (u.category) categories[u.category] = (categories[u.category] || 0) + 1;
    }

    // Buyer stats
    const totalBuyers = buyers.length;
    const buyersByStatus = {};
    let totalBuyerSpend = 0;
    for (const b of buyers) {
      buyersByStatus[b.status || "new"] = (buyersByStatus[b.status || "new"] || 0) + 1;
      totalBuyerSpend += Number(b.spend) || 0;
    }

    // Show stats
    const completedShows = shows.filter(s => s.status === "completed");
    const totalGMV = completedShows.reduce((sum, s) => sum + (Number(s.gmv) || 0), 0);
    const avgShowGMV = completedShows.length ? totalGMV / completedShows.length : 0;
    const totalShowMinutes = completedShows.reduce((sum, s) => sum + (s.duration_min || 0), 0);
    const recentShows = shows.filter(s => s.created_at && now - new Date(s.created_at).getTime() < thirtyDays);

    // Platform usage across shows
    const platformUsage = {};
    for (const s of shows) {
      for (const p of (s.platforms || [])) {
        platformUsage[p] = (platformUsage[p] || 0) + 1;
      }
    }

    // Order stats
    const totalOrders = orders.length;
    const totalOrderRevenue = orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
    const ordersByPlatform = {};
    for (const o of orders) {
      if (o.platform) ordersByPlatform[o.platform] = (ordersByPlatform[o.platform] || 0) + 1;
    }

    // Campaign stats
    const sentCampaigns = campaigns.filter(c => c.status === "sent");
    const totalRecipients = sentCampaigns.reduce((sum, c) => sum + (c.recipients || 0), 0);
    const totalOpens = sentCampaigns.reduce((sum, c) => sum + (c.opens || 0), 0);
    const totalClicks = sentCampaigns.reduce((sum, c) => sum + (c.clicks || 0), 0);
    const totalConversions = sentCampaigns.reduce((sum, c) => sum + (c.conversions || 0), 0);
    const campaignGMV = sentCampaigns.reduce((sum, c) => sum + (Number(c.gmv) || 0), 0);
    const channelBreakdown = {};
    for (const c of campaigns) {
      if (c.channel) channelBreakdown[c.channel] = (channelBreakdown[c.channel] || 0) + 1;
    }

    // Connection stats
    const connectionsByPlatform = {};
    for (const c of connections) {
      connectionsByPlatform[c.platform] = (connectionsByPlatform[c.platform] || 0) + 1;
    }

    // User activity (users with shows in last 30 days)
    const activeUserIds = new Set(recentShows.map(s => s.profile_id));

    return res.json({
      total: users.length,
      planCounts,
      mrr,
      recentSignups,
      categories,
      activeUsers: activeUserIds.size,
      buyers: { total: totalBuyers, byStatus: buyersByStatus, totalSpend: totalBuyerSpend },
      shows: { total: shows.length, completed: completedShows.length, totalGMV, avgShowGMV, totalMinutes: totalShowMinutes, recent: recentShows.length, platformUsage },
      orders: { total: totalOrders, totalRevenue: totalOrderRevenue, byPlatform: ordersByPlatform },
      campaigns: { total: campaigns.length, sent: sentCampaigns.length, totalRecipients, totalOpens, totalClicks, totalConversions, gmv: campaignGMV, byChannel: channelBreakdown },
      connections: { total: connections.length, byPlatform: connectionsByPlatform },
    });
  }

  // ── User detail ───────────────────────────────────────────────────────────
  if (req.method === "GET" && action === "user-detail") {
    const uid = req.query.userId;
    if (!uid) return res.status(400).json({ error: "Missing userId" });

    const [profileRes, buyersRes, showsRes, ordersRes, connectionsRes, productsRes] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", uid).single(),
      supabase.from("buyers").select("id,name,email,spend,orders,status,loyalty_tier,platform,created_at").eq("profile_id", uid).order("spend", { ascending: false }).limit(50),
      supabase.from("shows").select("id,title,date,gmv,buyers_count,status,platforms,duration_min").eq("profile_id", uid).order("date", { ascending: false }).limit(20),
      supabase.from("orders").select("id,total,status,platform,created_at").eq("profile_id", uid).order("created_at", { ascending: false }).limit(50),
      supabase.from("connections").select("platform,handle,connected_at").eq("profile_id", uid),
      supabase.from("products").select("id,name,price,inventory,show_ready").eq("profile_id", uid),
    ]);

    return res.json({
      profile: profileRes.data,
      buyers: buyersRes.data || [],
      shows: showsRes.data || [],
      orders: ordersRes.data || [],
      connections: connectionsRes.data || [],
      products: productsRes.data || [],
    });
  }

  // ── Update user plan ──────────────────────────────────────────────────────
  if (req.method === "PATCH" && action === "update-plan") {
    const { userId, plan } = req.body || {};
    if (!userId || !plan) return res.status(400).json({ error: "Missing userId or plan" });
    if (!VALID_PLANS.includes(plan)) return res.status(400).json({ error: "Invalid plan" });

    const { error } = await supabase.from("profiles").update({ plan }).eq("id", userId);
    if (error) return res.status(500).json({ error: error.message });
    return res.json({ success: true, userId, plan });
  }

  // ── Update user profile ───────────────────────────────────────────────────
  if (req.method === "PATCH" && action === "update-profile") {
    const { userId, updates } = req.body || {};
    if (!userId || !updates) return res.status(400).json({ error: "Missing userId or updates" });

    // Only allow safe fields
    const allowed = ["plan", "shop_name", "category", "bio", "is_admin", "account_type", "discount"];
    const safe = {};
    for (const [k, v] of Object.entries(updates)) {
      if (allowed.includes(k)) safe[k] = v;
    }

    const { error } = await supabase.from("profiles").update(safe).eq("id", userId);
    if (error) return res.status(500).json({ error: error.message });
    return res.json({ success: true });
  }

  // ── Create user and send invite email ────────────────────────────────────
  if (req.method === "POST" && action === "create-user") {
    const { email, name, first_name, shop_name, category, plan, account_type, discount } = req.body || {};
    if (!email) return res.status(400).json({ error: "Email is required" });

    // Check if email already exists
    const { data: existing } = await supabase.from("profiles").select("id").eq("email", email).maybeSingle();
    if (existing) return res.status(409).json({ error: "A user with this email already exists" });

    // Invite user by email — sends a magic-link welcome email automatically
    const { data: authData, error: authErr } = await supabase.auth.admin.inviteUserByEmail(email, {
      data: { full_name: name || first_name || "", admin_created: true },
      redirectTo: "https://www.strmlive.com/app",
    });

    if (authErr) return res.status(500).json({ error: "Failed to invite user: " + authErr.message });

    const userId = authData.user.id;
    const discountPct = Math.max(0, Math.min(100, parseInt(discount) || 0));

    // Create profile
    const { error: profileErr } = await supabase.from("profiles").upsert({
      id: userId,
      email,
      name: name || "",
      first_name: first_name || (name || "").split(" ")[0] || "",
      shop_name: shop_name || "",
      category: category || "",
      plan: plan || "starter",
      platforms: [],
      account_type: account_type || "business",
      discount: discountPct || null,
    }, { onConflict: "id" });

    if (profileErr) return res.status(500).json({ error: "Profile creation failed: " + profileErr.message });

    // Fetch the created profile to return
    const { data: profile } = await supabase.from("profiles").select("*").eq("id", userId).single();
    return res.status(201).json({ success: true, user: profile, invited: true });
  }

  return res.status(400).json({ error: "Unknown action" });
}
