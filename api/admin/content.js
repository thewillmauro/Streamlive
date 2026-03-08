import { createClient } from "@supabase/supabase-js";

function getSupabase() {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return { error: "Server misconfigured" };
  return { client: createClient(url, key) };
}

async function verifyAdmin(req) {
  const { client, error: envErr } = getSupabase();
  if (envErr) return { error: envErr, status: 500 };
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer ")) return { error: "Missing authorization", status: 401 };
  const { data: { user }, error } = await client.auth.getUser(auth.replace("Bearer ", ""));
  if (error || !user) return { error: "Invalid token", status: 401 };
  const { data: profile } = await client.from("profiles").select("is_admin").eq("id", user.id).single();
  if (!profile?.is_admin) return { error: "Access denied", status: 403 };
  return { supabase: client, userId: user.id };
}

export default async function handler(req, res) {
  const origin = req.headers.origin || "";
  const allowed = ["https://www.strmlive.com", "https://strmlive.com", "http://localhost:5173", "http://localhost:4173"];
  if (allowed.includes(origin)) res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
  if (req.method === "OPTIONS") return res.status(200).end();

  const result = await verifyAdmin(req);
  if (result.error) return res.status(result.status).json({ error: result.error });
  const { supabase, userId } = result;
  const action = req.query.action || "list";

  // ── List all content grouped by section ─────────────────────────────────
  if (req.method === "GET" && action === "list") {
    const { data, error } = await supabase.from("site_content").select("*").order("section");
    if (error) return res.status(500).json({ error: error.message });
    const content = {};
    for (const row of data || []) {
      if (!content[row.section]) content[row.section] = {};
      content[row.section][row.key] = row.value;
    }
    return res.json({ content });
  }

  // ── Upsert a single key ─────────────────────────────────────────────────
  if (req.method === "POST" && action === "upsert") {
    const { section, key, value } = req.body || {};
    if (!section || !key || value === undefined) return res.status(400).json({ error: "Missing section, key, or value" });
    const { error } = await supabase.from("site_content").upsert(
      { section, key, value: typeof value === "string" ? JSON.stringify(value) : value, updated_at: new Date().toISOString(), updated_by: userId },
      { onConflict: "section,key" }
    );
    if (error) return res.status(500).json({ error: error.message });
    return res.json({ success: true });
  }

  // ── Upsert batch (save entire section) ──────────────────────────────────
  if (req.method === "POST" && action === "upsert-batch") {
    const { items } = req.body || {};
    if (!Array.isArray(items) || !items.length) return res.status(400).json({ error: "Missing items array" });
    const rows = items.map(i => ({
      section: i.section, key: i.key,
      value: typeof i.value === "string" ? JSON.stringify(i.value) : i.value,
      updated_at: new Date().toISOString(), updated_by: userId,
    }));
    const { error } = await supabase.from("site_content").upsert(rows, { onConflict: "section,key" });
    if (error) return res.status(500).json({ error: error.message });
    return res.json({ success: true });
  }

  // ── Delete section (reset to defaults) ──────────────────────────────────
  if (req.method === "DELETE" && action === "delete-section") {
    const section = req.query.section;
    if (!section) return res.status(400).json({ error: "Missing section" });
    const { error } = await supabase.from("site_content").delete().eq("section", section);
    if (error) return res.status(500).json({ error: error.message });
    return res.json({ success: true });
  }

  return res.status(400).json({ error: "Unknown action" });
}
