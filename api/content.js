import { createClient } from "@supabase/supabase-js";

export default async function handler(req, res) {
  const origin = req.headers.origin || "";
  const allowed = ["https://www.strmlive.com", "https://strmlive.com", "http://localhost:5173", "http://localhost:4173"];
  if (allowed.includes(origin)) res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Cache-Control", "public, s-maxage=60, stale-while-revalidate=300");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "GET") return res.status(405).json({ error: "GET only" });

  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return res.status(500).json({ error: "Server misconfigured" });

  const supabase = createClient(url, key);
  const { data, error } = await supabase.from("site_content").select("section,key,value");
  if (error) return res.status(500).json({ error: error.message });

  // Group by section
  const content = {};
  for (const row of data || []) {
    if (!content[row.section]) content[row.section] = {};
    content[row.section][row.key] = row.value;
  }

  return res.json({ content });
}
