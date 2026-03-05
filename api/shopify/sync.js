import crypto from "crypto";

// ── Token decryption (mirrors callback.js) ──────────────────────────────────
const ALGO = "aes-256-gcm";

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
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // ── Read Shopify credentials from httpOnly cookies ─────────────────────────
  const cookies = {};
  (req.headers.cookie || "").split(";").forEach((c) => {
    const [key, ...rest] = c.trim().split("=");
    if (key) cookies[key] = rest.join("=");
  });

  const encryptedToken = cookies.shopify_token;
  const shop = cookies.shopify_shop;

  if (!encryptedToken || !shop) {
    return res
      .status(401)
      .json({ error: "Shopify not connected. Please authorize first." });
  }

  // ── Validate shop domain ──────────────────────────────────────────────────
  if (!/^[a-zA-Z0-9][a-zA-Z0-9\-]*\.myshopify\.com$/.test(shop)) {
    return res.status(400).json({ error: "Invalid shop domain" });
  }

  // ── Decrypt access token ──────────────────────────────────────────────────
  const { COOKIE_ENCRYPTION_KEY, SHOPIFY_API_SECRET } = process.env;
  const encryptionKey = COOKIE_ENCRYPTION_KEY || SHOPIFY_API_SECRET;

  let accessToken;
  try {
    accessToken = decryptToken(encryptedToken, encryptionKey);
  } catch {
    return res
      .status(401)
      .json({ error: "Invalid session. Please reconnect Shopify." });
  }

  // ── Paginate Shopify REST Admin API ────────────────────────────────────────
  let allProducts = [];
  let url = `https://${shop}/admin/api/2025-01/products.json?limit=250`;

  while (url) {
    const shopRes = await fetch(url, {
      headers: { "X-Shopify-Access-Token": accessToken },
    });

    if (!shopRes.ok) {
      console.error("Shopify products fetch failed");
      return res
        .status(502)
        .json({ error: "Failed to fetch products from Shopify" });
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

  // ── Map products to app format ─────────────────────────────────────────────
  const mapped = allProducts.map((p) => ({
    id: String(p.id),
    name: p.title,
    sku: p.variants?.[0]?.sku || "",
    price: parseFloat(p.variants?.[0]?.price) || 0,
    cost: 0,
    inventory: (p.variants || []).reduce(
      (sum, v) => sum + (v.inventory_quantity || 0),
      0
    ),
    category: p.product_type || "Uncategorized",
    image: p.image?.src || null,
    shopify_id: String(p.id),
    platforms: ["shopify"],
    showReady: false,
    aiScore: Math.floor(Math.random() * 30) + 70,
    soldLast30: 0,
    avgPerShow: 0,
  }));

  return res
    .status(200)
    .json({ success: true, synced: mapped.length, products: mapped });
}
