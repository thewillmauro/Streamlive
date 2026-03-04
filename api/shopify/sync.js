import { createClient } from "@supabase/supabase-js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = process.env;

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return res.status(500).json({ error: "Server misconfigured: missing Supabase env vars" });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  // ── Verify JWT ─────────────────────────────────────────────────────────────
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing authorization header" });
  }

  const token = authHeader.replace("Bearer ", "");
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser(token);

  if (authError || !user) {
    return res.status(401).json({ error: "Invalid token" });
  }

  // ── Get Shopify connection ─────────────────────────────────────────────────
  const { data: connection, error: connError } = await supabase
    .from("connections")
    .select("access_token_encrypted, handle")
    .eq("profile_id", user.id)
    .eq("platform", "shopify")
    .single();

  if (connError || !connection) {
    return res
      .status(404)
      .json({ error: "Shopify not connected. Please authorize first." });
  }

  const { access_token_encrypted: accessToken, handle: shop } = connection;

  // ── Paginate Shopify REST Admin API ────────────────────────────────────────
  let allProducts = [];
  let url = `https://${shop}/admin/api/2025-01/products.json?limit=250`;

  while (url) {
    const shopRes = await fetch(url, {
      headers: { "X-Shopify-Access-Token": accessToken },
    });

    if (!shopRes.ok) {
      const errBody = await shopRes.text();
      console.error("Shopify products fetch failed:", errBody);
      return res.status(502).json({ error: "Failed to fetch products from Shopify" });
    }

    const { products } = await shopRes.json();
    allProducts = allProducts.concat(products);

    // Follow Link header for next page
    const linkHeader = shopRes.headers.get("link");
    url = null;
    if (linkHeader) {
      const nextMatch = linkHeader.match(/<([^>]+)>;\s*rel="next"/);
      if (nextMatch) url = nextMatch[1];
    }
  }

  // ── Map & upsert into products table ───────────────────────────────────────
  const mapped = allProducts.map((p) => ({
    profile_id: user.id,
    name: p.title,
    sku: p.variants?.[0]?.sku || "",
    price: parseFloat(p.variants?.[0]?.price) || 0,
    inventory: (p.variants || []).reduce(
      (sum, v) => sum + (v.inventory_quantity || 0),
      0
    ),
    category: p.product_type || "",
    shopify_id: String(p.id),
    image_url: p.image?.src || null,
  }));

  if (mapped.length > 0) {
    const { error: upsertError } = await supabase
      .from("products")
      .upsert(mapped, { onConflict: "profile_id,shopify_id" });

    if (upsertError) {
      console.error("Product upsert error:", upsertError);
      return res
        .status(500)
        .json({ error: "Failed to save products", details: upsertError.message });
    }
  }

  return res.status(200).json({ success: true, synced: mapped.length });
}
