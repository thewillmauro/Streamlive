import { useState, useEffect } from 'react'
import { SELLER_PROFILES, PERSONA_PLATFORMS, LIVE_SHOP_DATA } from '../lib/shared.jsx'

export default function LiveShopPage({ shopSlug, showSlug }) {
  const seller    = SELLER_PROFILES[shopSlug];

  // Resolve seller first: everything else depends on it
  const resolvedSeller = seller || (shopSlug && shopSlug !== "shop" ? {
    name: shopSlug.replace(/-/g," ").replace(/\b\w/g, c=>c.toUpperCase()),
    avatar: shopSlug.slice(0,2).toUpperCase(),
    color: "#7c3aed",
    category: "Live Commerce",
  } : null);

  const shopData  = LIVE_SHOP_DATA[shopSlug];
  const exactShow = shopData?.shows?.[showSlug];

  const fallbackShow = resolvedSeller ? {
    name: showSlug
      ? showSlug.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase())
      : "Live Show",
    platforms: PERSONA_PLATFORMS[shopSlug] || ["TT","IG"],
    products: (shopData?.defaultProducts || Object.values(LIVE_SHOP_DATA)
      .flatMap(s => Object.values(s.shows || {}))
      .find(s => true)?.products || []).slice(0, 8),
  } : null;

  const showData   = exactShow || fallbackShow;
  const shopDomain = `${shopSlug}.myshopify.com`;
  const accent     = resolvedSeller?.color || "#7c3aed";

  const FONT_CSS = `@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600;700&display=swap');`;

  const shopifyUrl = (p) =>
    `https://${shopDomain}${p.url}?ref=streamlive_live&show=${showSlug}&utm_source=streamlive&utm_medium=live_shop`;

  const [activeIdx, setActiveIdx]   = useState(0);
  const [pulsed,    setPulsed]      = useState(false);

  useEffect(() => {
    if (!showData?.products?.length) return;
    const t = setInterval(() => {
      setActiveIdx(i => (i + 1) % showData.products.length);
      setPulsed(true);
      setTimeout(() => setPulsed(false), 600);
    }, 45000);
    return () => clearInterval(t);
  }, [showData]);

  if (!resolvedSeller) {
    return (
      <div style={{ minHeight:"100vh", background:"#06060e", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", fontFamily:"'DM Sans',sans-serif", padding:24 }}>
        <style>{FONT_CSS}</style>
        <div style={{ textAlign:"center" }}>
          <div style={{ fontSize:56, marginBottom:20 }}>📭</div>
          <div style={{ fontFamily:"'Syne',sans-serif", fontSize:24, fontWeight:800, color:"#fff", marginBottom:8 }}>
            Link not found
          </div>
          <div style={{ fontSize:14, color:"#6b7280", marginBottom:28, maxWidth:300, lineHeight:1.6 }}>
            This live shop link appears to be invalid or has expired.
          </div>
          <div style={{ marginTop:16 }}>
            <a href="/" style={{ fontSize:12, color:"#374151", textDecoration:"none" }}>← Back to Streamlive</a>
          </div>
        </div>
      </div>
    );
  }

  const activeProduct = showData.products[activeIdx];
  const PC = { WN:"#7c3aed", TT:"#f43f5e", IG:"#ec4899", AM:"#f59e0b", YT:"#ff0000" };
  const PN = { WN:"Whatnot", TT:"TikTok", IG:"Instagram", AM:"Amazon", YT:"YouTube" };

  return (
    <div style={{ minHeight:"100vh", background:"#06060e", fontFamily:"'DM Sans',sans-serif", color:"#fff" }}>
      <style>{FONT_CSS + `
        * { box-sizing:border-box; margin:0; padding:0; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
        @keyframes slideIn { from{transform:translateY(8px);opacity:0} to{transform:translateY(0);opacity:1} }
        @keyframes heroPop { 0%{transform:scale(0.97);opacity:0.6} 100%{transform:scale(1);opacity:1} }
        .buy-btn:hover { filter:brightness(1.1); transform:translateY(-1px); }
        .buy-btn:active { transform:translateY(0px); }
        .buy-btn { transition:all .15s ease; }
        @media(max-width:600px) {
          .product-row { flex-direction:column !important; align-items:flex-start !important; gap:10px !important; }
          .product-price-btn { flex-direction:row; justify-content:space-between; width:100%; align-items:center; }
          .hero-card { padding:18px !important; }
          .page-pad { padding:0 16px !important; }
        }
      `}</style>

      {/* ── STICKY HEADER ── */}
      <div style={{ position:"sticky", top:0, zIndex:50, background:"#06060eee", backdropFilter:"blur(16px)", borderBottom:"1px solid #14142a", padding:"12px 20px", display:"flex", alignItems:"center", gap:12 }}>
        {/* Store identity */}
        <div style={{ width:32, height:32, borderRadius:9, background:`${accent}20`, border:`1px solid ${accent}44`, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Syne',sans-serif", fontSize:12, fontWeight:800, color:accent, flexShrink:0 }}>
          {resolvedSeller.avatar}
        </div>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontSize:13, fontWeight:700, color:"#fff", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{resolvedSeller.name}</div>
          <div style={{ fontSize:10, color:"#4b5563", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{showData.name}</div>
        </div>
        {/* Live pill */}
        <div style={{ display:"flex", alignItems:"center", gap:5, background:"#1a0808", border:"1px solid #ef444444", borderRadius:99, padding:"5px 10px", flexShrink:0 }}>
          <div style={{ width:6, height:6, borderRadius:"50%", background:"#ef4444", animation:"pulse 1.2s infinite" }}/>
          <span style={{ fontSize:10, fontWeight:800, color:"#ef4444", letterSpacing:"0.06em" }}>LIVE NOW</span>
        </div>
      </div>

      {/* ── HERO: NOW SELLING ── */}
      <div className="page-pad" style={{ padding:"0 20px", maxWidth:540, margin:"0 auto" }}>
        <div style={{ paddingTop:20, paddingBottom:8 }}>
          <div style={{ fontSize:9, fontWeight:800, color:"#ef4444", textTransform:"uppercase", letterSpacing:"0.14em", marginBottom:10, display:"flex", alignItems:"center", gap:6 }}>
            <div style={{ width:5, height:5, borderRadius:"50%", background:"#ef4444", animation:"pulse 1.2s infinite" }}/>
            Selling Right Now
          </div>
          <div
            className="hero-card"
            key={activeIdx}
            style={{ background:`linear-gradient(160deg,#0f1e0f,#060f06)`, border:`2px solid ${accent}55`, borderRadius:20, padding:"22px 22px 20px", animation: pulsed ? "heroPop .4s ease" : "slideIn .3s ease", position:"relative", overflow:"hidden" }}
          >
            {/* Glow */}
            <div style={{ position:"absolute", top:-40, right:-40, width:180, height:180, borderRadius:"50%", background:accent, opacity:0.04, filter:"blur(50px)", pointerEvents:"none" }}/>

            <div style={{ fontSize:44, marginBottom:10 }}>{activeProduct.image}</div>
            <div style={{ fontFamily:"'Syne',sans-serif", fontSize:22, fontWeight:800, color:"#fff", lineHeight:1.2, marginBottom:8 }}>{activeProduct.name}</div>
            <div style={{ display:"flex", alignItems:"baseline", gap:10, marginBottom:18 }}>
              <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:28, fontWeight:800, color:accent }}>${activeProduct.price}</span>
              <span style={{ fontSize:11, color:"#4b5563" }}>{activeProduct.inventory} in stock</span>
            </div>
            <a
              href={shopifyUrl(activeProduct)}
              target="_blank"
              rel="noopener noreferrer"
              className="buy-btn"
              style={{ display:"block", background:`linear-gradient(135deg,${accent},${accent}bb)`, borderRadius:14, padding:"16px", textAlign:"center", textDecoration:"none", boxShadow:`0 6px 24px ${accent}33` }}
            >
              <span style={{ fontSize:16, fontWeight:800, color:"#fff", letterSpacing:"0.01em" }}>Buy Now →</span>
            </a>
          </div>
        </div>

        {/* ── PLATFORM BADGES ── */}
        <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:20, marginTop:4 }}>
          {showData.platforms.map(pid => (
            <div key={pid} style={{ display:"flex", alignItems:"center", gap:4, background:`${PC[pid]}12`, border:`1px solid ${PC[pid]}33`, borderRadius:6, padding:"3px 9px" }}>
              <div style={{ width:4, height:4, borderRadius:"50%", background:PC[pid] }}/>
              <span style={{ fontSize:9, fontWeight:700, color:PC[pid] }}>{PN[pid]}</span>
            </div>
          ))}
          <div style={{ display:"flex", alignItems:"center", gap:4, background:"#0d0d1e", border:"1px solid #1e1e3a", borderRadius:6, padding:"3px 9px" }}>
            <span style={{ fontSize:9, color:"#4b5563" }}>{showData.products.length} products today</span>
          </div>
        </div>

        {/* ── FULL LINEUP ── */}
        <div style={{ marginBottom:4 }}>
          <div style={{ fontSize:10, fontWeight:800, color:"#374151", textTransform:"uppercase", letterSpacing:"0.12em", marginBottom:12 }}>Full Lineup</div>
          <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:32 }}>
            {showData.products.map((p, i) => {
              const isActive = i === activeIdx;
              const isSold   = i < activeIdx;
              return (
                <div
                  key={p.id}
                  className="product-row"
                  style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 14px", background:isActive?`${accent}0e`:isSold?"transparent":"#0a0a14", border:`1px solid ${isActive?accent+"44":isSold?"transparent":"#14142a"}`, borderRadius:14, opacity:isSold?0.4:1, transition:"all .25s" }}
                >
                  {/* Position badge */}
                  <div style={{ width:26, height:26, borderRadius:7, background:isActive?`${accent}20`:isSold?"transparent":"#111125", border:`1px solid ${isActive?accent+"44":isSold?"transparent":"#1e1e3a"}`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    {isSold
                      ? <span style={{ fontSize:10, color:"#374151" }}>✓</span>
                      : <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10, fontWeight:800, color:isActive?accent:"#374151" }}>{i+1}</span>
                    }
                  </div>

                  <span style={{ fontSize:22, flexShrink:0 }}>{p.image}</span>

                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:13, fontWeight:isActive?700:500, color:isSold?"#374151":"#e5e7eb", marginBottom:2, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{p.name}</div>
                    <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                      <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:13, fontWeight:700, color:isSold?"#374151":accent }}>${p.price}</span>
                      {isActive && <span style={{ fontSize:9, fontWeight:800, color:"#ef4444", background:"#1a0505", border:"1px solid #ef444433", padding:"1px 7px", borderRadius:99, letterSpacing:"0.06em" }}>NOW</span>}
                      <span style={{ fontSize:10, color:"#374151" }}>{p.inventory} left</span>
                    </div>
                  </div>

                  {/* Buy Now: full text on desktop, arrow-only on mobile handled via min-width */}
                  {!isSold && (
                    <a
                      href={shopifyUrl(p)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="buy-btn"
                      style={{ flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center", gap:4, padding: isActive ? "9px 18px" : "7px 14px", background: isActive ? `linear-gradient(135deg,${accent},${accent}bb)` : `${accent}14`, border:`1px solid ${isActive?"transparent":accent+"33"}`, borderRadius:10, textDecoration:"none", boxShadow: isActive ? `0 4px 14px ${accent}22` : "none" }}
                    >
                      <span style={{ fontSize: isActive ? 12 : 11, fontWeight:700, color: isActive ? "#fff" : accent, whiteSpace:"nowrap" }}>
                        {isActive ? "Buy Now →" : "Buy →"}
                      </span>
                    </a>
                  )}
                  {isSold && (
                    <span style={{ flexShrink:0, fontSize:10, color:"#374151", padding:"4px 10px", border:"1px solid #1a1a1a", borderRadius:8 }}>Sold</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── FOOTER ── */}
        <div style={{ borderTop:"1px solid #0d0d1e", paddingTop:20, paddingBottom:32, textAlign:"center" }}>
          <div style={{ fontSize:11, color:"#374151", marginBottom:6 }}>
            Purchases tracked to this show via Live Pixel
          </div>
          <div style={{ fontSize:11, color:"#252535" }}>
            Powered by <span style={{ color:"#4b3a7c", fontWeight:700 }}>Streamlive</span>
          </div>
        </div>
      </div>
    </div>
  );
}
