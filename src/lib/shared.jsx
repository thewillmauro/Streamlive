import { useEffect } from 'react'
import { trackPageView } from './analytics.js'

// ─── ROUTER ───────────────────────────────────────────────────────────────────
export function navigate(path) {
  window.scrollTo(0, 0)
  window.history.pushState({}, '', path)
  window.dispatchEvent(new PopStateEvent('popstate'))
  trackPageView(path)
}

// ─── INTERCOM ─────────────────────────────────────────────────────────────────
function intercomUpdate(attrs = {}) {
  if (typeof window.Intercom === 'function') {
    window.Intercom('update', attrs)
  }
}

export function useIntercom(attrs = {}) {
  useEffect(() => {
    intercomUpdate(attrs)
  }, [])
}

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
export const FONT = `@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:ital,wght@0,400;0,500;0,600;1,400&family=JetBrains+Mono:wght@400;600&display=swap');`

export const STRIPE_LINKS = {
  starter:    'https://buy.stripe.com/test_cNibJ377j60W9TS1rX0kE00',
  growth:     'https://buy.stripe.com/test_7sYbJ363fblgfec9Yt0kE01',
  pro:        'https://buy.stripe.com/test_00w5kF77j7504zyc6B0kE02',
}

export const PLANS = {
  starter: {
    id:'starter', name:'Starter', price:79, color:'#10b981', bg:'#0a1e16', border:'#10b98133',
    emoji:'🌱', tagline:'Get started with live selling',
    headline:"You're in. Let's import your buyers.",
    subline:"Your Streamlive account is active. Connect your first platform and we'll import your buyers immediately.",
    features:[
      'Buyer CRM across all platforms',
      'Show Planner + run order',
      'Loyalty program',
      'Opt-in pages & email campaigns',
      'Up to 2 platforms',
    ],
    nextLabel:'Connect your first platform →',
    nextHint:"Takes 2 minutes. We'll import your buyers immediately.",
    billing:'Billed monthly. Cancel anytime.',
  },
  growth: {
    id:'growth', name:'Growth', price:199, color:'#7c3aed', bg:'#2d1f5e22', border:'#7c3aed44', popular:true,
    emoji:'🚀', tagline:'Scale your live business',
    headline:'Growth unlocked. Time to go live.',
    subline:'You now have real-time Live Companion, Analytics, AI insights, and SMS campaigns.',
    features:[
      'Everything in Starter',
      'Live Companion: real-time GMV & buyer feed',
      'Analytics + 6 AI insights per show',
      'SMS campaigns & DM automations',
      'All 5 platforms simultaneously',
    ],
    nextLabel:'Set up your platforms →',
    nextHint:"Connect Whatnot and it activates automatically when you go live.",
    billing:'Billed monthly. Cancel anytime.',
  },
  pro: {
    id:'pro', name:'Pro', price:399, color:'#f59e0b', bg:'#2e1f0a22', border:'#f59e0b33',
    emoji:'⚡', tagline:'Full production control',
    headline:"Pro activated. You're operating at full power.",
    subline:'Every feature unlocked. Production suite, full AI, and multi-platform at scale.',
    features:[
      'Everything in Growth',
      'Production Suite: cameras, lights & OBS',
      'Host Briefing auto-advances with show clock',
      'Cross-platform buyer identity matching',
      'Priority support',
    ],
    nextLabel:'Set up your platforms →',
    nextHint:"Connect all 4 platforms and let Streamlive do the rest.",
    billing:'Billed monthly. Cancel anytime.',
  }
}

export const GLOBAL_CSS = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { background: #06060e; color: #e2e8f0; font-family: 'DM Sans', sans-serif; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-thumb { background: #1e1e3a; border-radius: 4px; }
  @keyframes float     { 0%,100% { transform:translateY(0) } 50% { transform:translateY(-12px) } }
  @keyframes fadeUp    { from { opacity:0; transform:translateY(20px) } to { opacity:1; transform:translateY(0) } }
  @keyframes pop       { 0% { transform:scale(.85);opacity:0 } 60% { transform:scale(1.06) } 100% { transform:scale(1);opacity:1 } }
  @keyframes pulse     { 0%,100% { opacity:1 } 50% { opacity:.35 } }
  @keyframes shimmer   { 0% { background-position:-200% 0 } 100% { background-position:200% 0 } }

  .fade-a0 { animation: fadeUp .55s ease both; }
  .fade-a1 { animation: fadeUp .55s .08s ease both; }
  .fade-a2 { animation: fadeUp .55s .16s ease both; }
  .fade-a3 { animation: fadeUp .55s .24s ease both; }
  .fade-a4 { animation: fadeUp .55s .34s ease both; }
  .fade-a5 { animation: fadeUp .55s .44s ease both; }
  .pop     { animation: pop .4s ease both; }
  .mobile-menu       { display:none; }
  .mobile-menu.open  { display:flex; flex-direction:column; }
  .feat-card:hover { border-color:#7c3aed88 !important; transform:translateY(-3px); box-shadow:0 12px 40px rgba(124,58,237,.12); }
  .feat-card       { transition:all .2s ease; }
  .plan-card:hover { transform:translateY(-3px); box-shadow:0 16px 48px rgba(0,0,0,.4); }
  .plan-card       { transition: all .2s ease; }
  .cta-btn:hover   { opacity:.9; transform:translateY(-1px); box-shadow: 0 8px 32px rgba(124,58,237,.35); }
  .cta-btn         { transition:all .15s ease; }
  .stat-num        { font-variant-numeric: tabular-nums; }
  .glow-line       { background: linear-gradient(90deg,transparent,#7c3aed44,#a78bfa44,transparent); height:1px; }
`

// ─── SHARED NAV ───────────────────────────────────────────────────────────────
export function Nav({ currentPlan }) {
  const p = currentPlan ? PLANS[currentPlan] : null
  return (
    <nav style={{ position:'sticky', top:0, zIndex:50, background:'#06060eee', backdropFilter:'blur(16px)', borderBottom:'1px solid #14142a', padding:'0 40px', height:58, display:'flex', alignItems:'center', gap:12 }}>
      <button onClick={()=>navigate('/')} style={{ display:'flex', alignItems:'center', gap:9, background:'none', border:'none', cursor:'pointer', padding:0 }}>
        <div style={{ width:30, height:30, borderRadius:9, background:'linear-gradient(135deg,#7c3aed,#4f46e5)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, fontWeight:900, color:'#fff', boxShadow:'0 2px 12px rgba(124,58,237,.4)' }}>S</div>
        <span style={{ fontFamily:"'Syne',sans-serif", fontSize:17, fontWeight:800, color:'#fff', letterSpacing:'-0.3px' }}>Streamlive</span>
      </button>
      <div style={{ flex:1 }} />
      <div style={{ display:'flex', alignItems:'center', gap:16 }}>
        <a href="#features"  style={{ fontSize:13, color:'#6b7280', textDecoration:'none', fontWeight:500 }} onClick={e=>{e.preventDefault();document.getElementById('features')?.scrollIntoView({behavior:'smooth'})}}>Features</a>
        <a href="#pricing"   style={{ fontSize:13, color:'#6b7280', textDecoration:'none', fontWeight:500 }} onClick={e=>{e.preventDefault();document.getElementById('pricing')?.scrollIntoView({behavior:'smooth'})}}>Pricing</a>
        {p && (
          <div style={{ display:'flex', alignItems:'center', gap:6, background:`${p.color}12`, border:`1px solid ${p.color}33`, borderRadius:6, padding:'4px 12px' }}>
            <div style={{ width:5, height:5, borderRadius:'50%', background:p.color, animation:'pulse 2s infinite' }} />
            <span style={{ fontSize:10, fontWeight:700, color:p.color, textTransform:'uppercase', letterSpacing:'0.07em' }}>{p.name} at ${p.price}/mo</span>
          </div>
        )}
        <button onClick={()=>navigate('/app')} className="cta-btn" style={{ background:'linear-gradient(135deg,#7c3aed,#4f46e5)', border:'none', color:'#fff', fontSize:12, fontWeight:700, padding:'7px 18px', borderRadius:8, cursor:'pointer' }}>
          Open App →
        </button>
      </div>
    </nav>
  )
}

// ─── SELLER DATA ──────────────────────────────────────────────────────────────
export const SELLER_PROFILES = {
  bananarepublic: {
    name: "Banana Republic",
    owner: "Jamie Ellis",
    bio: "Shop the latest collections live: seasonal drops, member exclusives, and styling sessions every week. Be the first to access new arrivals before they hit stores.",
    avatar: "BR",
    color: "#f59e0b",
    category: "Apparel & Fashion",
    platforms: ["TT", "IG", "AM"],
    badge: "🧥",
    followers: "38.2K",
    perks: [
      "🛍️ Member-early access to new collections",
      "💌 Exclusive live-only pricing and bundles",
      "🎁 Birthday discount + loyalty rewards",
      "📲 Show alerts before we go live",
    ],
  },
  kyliecosmetics: {
    name: "Kylie Cosmetics",
    owner: "Alyssa Kim",
    bio: "New shades, exclusive drops, and live tutorials with the Kylie Cosmetics team. Join the community and get first access to every launch before it sells out.",
    avatar: "KC",
    color: "#ec4899",
    category: "Beauty & Cosmetics",
    platforms: ["TT", "IG"],
    badge: "💄",
    followers: "58.9K",
    perks: [
      "💄 First access to new shade launches",
      "✨ Subscriber-only bundles and kits",
      "📲 Live drop alerts. Never miss a launch.",
      "🎁 VIP loyalty rewards on every order",
    ],
  },
  tropicfeel: {
    name: "Tropicfeel",
    owner: "Marc Pujol",
    bio: "Travel-ready footwear and gear built for every terrain. We're building our live community from the ground up. Join early and help shape what we do next.",
    avatar: "TF",
    color: "#10b981",
    category: "Travel Footwear & Gear",
    platforms: ["IG", "AM"],
    badge: "🌴",
    followers: "2.1K",
    perks: [
      "👟 Early access to new colorways and styles",
      "💸 Founding member discount on every drop",
      "📲 Live show alerts straight to your phone",
      "🌱 Shape our product roadmap directly",
    ],
  },
  walmartlive: {
    name: "Walmart Live",
    owner: "Rachel Nguyen",
    bio: "Your front-row seat to the best deals across every category: fashion, beauty, electronics, home, and more. Live shows daily across all your favorite brands.",
    avatar: "WM",
    color: "#3b82f6",
    category: "Multi-Category Retail",
    platforms: ["TT", "IG", "AM"],
    badge: "🛒",
    followers: "124K",
    perks: [
      "⚡ Flash deals before they go public",
      "💌 VIP early access across all brand shows",
      "🎁 Loyalty rewards on every live purchase",
      "📲 Alerts for your favorite brand drops",
    ],
  },
}

export const PLATFORM_META = {
  WN: { label: "Whatnot",      color: "#7c3aed", icon: "◈", placeholder: "@yourhandle",  manychat: false, dmNote: null },
  TT: { label: "TikTok",       color: "#f43f5e", icon: "♦", placeholder: "@yourhandle",  manychat: true,  dmNote: "DM us your keyword on TikTok to activate show alerts" },
  AM: { label: "Amazon Live",  color: "#f59e0b", icon: "◆", placeholder: null,            manychat: false, dmNote: null },
  IG: { label: "Instagram",    color: "#ec4899", icon: "●", placeholder: "@yourhandle",  manychat: true,  dmNote: "DM us your keyword on Instagram to activate show alerts" },
}

export const DM_PLATFORMS = ["WN", "TT", "IG"]

export const LIVE_SHOP_DATA = {
  bananarepublic: {
    defaultProducts: [
      { id:"p4",  name:"Silk Wrap Midi Dress",        image:"👗", price:268, inventory:22,  url:"/products/silk-wrap-midi-dress"     },
      { id:"p1",  name:"Merino Wool Blazer",          image:"🧥", price:228, inventory:48,  url:"/products/merino-wool-blazer"       },
      { id:"p8",  name:"Spring Style Bundle (3pc)",   image:"🎁", price:148, inventory:30,  url:"/products/spring-style-bundle-3pc"  },
      { id:"p10", name:"Linen Button-Down Shirt",     image:"👔", price:98,  inventory:96,  url:"/products/linen-button-down-shirt"  },
      { id:"p2",  name:"Italian Linen Trousers",      image:"👖", price:148, inventory:84,  url:"/products/italian-linen-trousers"   },
      { id:"p6",  name:"Slim Chino Shorts",           image:"🩳", price:80,  inventory:120, url:"/products/slim-chino-shorts"        },
      { id:"p3",  name:"Leather Crossbody Bag",       image:"👜", price:198, inventory:36,  url:"/products/leather-crossbody-bag"    },
    ],
    shows: {
      "friday-night-flash-sale": {
        name: "Friday Night Flash Sale",
        platforms: ["TT","IG","AM","YT"],
        products: [
          { id:"p4",  name:"Silk Wrap Midi Dress",        image:"👗", price:268, inventory:22, url:"/products/silk-wrap-midi-dress"     },
          { id:"p1",  name:"Merino Wool Blazer",          image:"🧥", price:228, inventory:48, url:"/products/merino-wool-blazer"       },
          { id:"p8",  name:"Spring Style Bundle (3pc)",   image:"🎁", price:148, inventory:30, url:"/products/spring-style-bundle-3pc"  },
          { id:"p10", name:"Linen Button-Down Shirt",     image:"👔", price:98,  inventory:96, url:"/products/linen-button-down-shirt"  },
          { id:"p2",  name:"Italian Linen Trousers",      image:"👖", price:148, inventory:84, url:"/products/italian-linen-trousers"   },
          { id:"p6",  name:"Slim Chino Shorts",           image:"🩳", price:80,  inventory:120,url:"/products/slim-chino-shorts"        },
        ],
      },
      "thursday-night-break-95": {
        name: "Thursday Night Break #95",
        platforms: ["TT","IG","AM"],
        products: [
          { id:"p8",  name:"Spring Style Bundle (3pc)",   image:"🎁", price:148, inventory:30, url:"/products/spring-style-bundle-3pc"  },
          { id:"p10", name:"Linen Button-Down Shirt",     image:"👔", price:98,  inventory:96, url:"/products/linen-button-down-shirt"  },
          { id:"p6",  name:"Slim Chino Shorts",           image:"🩳", price:80,  inventory:120,url:"/products/slim-chino-shorts"        },
          { id:"p1",  name:"Merino Wool Blazer",          image:"🧥", price:228, inventory:48, url:"/products/merino-wool-blazer"       },
          { id:"p3",  name:"Leather Crossbody Bag",       image:"👜", price:198, inventory:36, url:"/products/leather-crossbody-bag"    },
          { id:"p2",  name:"Italian Linen Trousers",      image:"👖", price:148, inventory:84, url:"/products/italian-linen-trousers"   },
          { id:"p4",  name:"Silk Wrap Midi Dress",        image:"👗", price:268, inventory:22, url:"/products/silk-wrap-midi-dress"     },
        ],
      },
    },
  },
  kyliecosmetics: {
    defaultProducts: [
      { id:"p11", name:"Matte Lip Kit Ruby",           image:"💄", price:29,  inventory:840,  url:"/products/matte-lip-kit-ruby"       },
      { id:"p15", name:"Holiday Collection Set (6pc)", image:"🎀", price:89,  inventory:180,  url:"/products/holiday-collection-set"   },
      { id:"p12", name:"Kyshadow Palette Bronze",      image:"✨", price:45,  inventory:420,  url:"/products/kyshadow-palette-bronze"  },
      { id:"p13", name:"Skin Tint SPF 30",             image:"🌟", price:38,  inventory:560,  url:"/products/skin-tint-spf-30"         },
      { id:"p14", name:"Gloss Drip Clear",             image:"💋", price:16,  inventory:1200, url:"/products/gloss-drip-clear"         },
      { id:"p17", name:"Kylighter Highlighter Stick",  image:"💫", price:21,  inventory:740,  url:"/products/kylighter-highlighter"    },
    ],
    shows: {
      "new-shade-drop-live": {
        name: "New Shade Drop: Live",
        platforms: ["TT","IG"],
        products: [
          { id:"p11", name:"Matte Lip Kit Ruby",          image:"💄", price:29,  inventory:840, url:"/products/matte-lip-kit-ruby"       },
          { id:"p15", name:"Holiday Collection Set (6pc)",image:"🎀", price:89,  inventory:180, url:"/products/holiday-collection-set"   },
          { id:"p12", name:"Kyshadow Palette Bronze",     image:"✨", price:45,  inventory:420, url:"/products/kyshadow-palette-bronze"  },
          { id:"p13", name:"Skin Tint SPF 30",            image:"🌟", price:38,  inventory:560, url:"/products/skin-tint-spf-30"         },
          { id:"p14", name:"Gloss Drip Clear",            image:"💋", price:16,  inventory:1200,url:"/products/gloss-drip-clear"         },
        ],
      },
    },
  },
  tropicfeel: {
    defaultProducts: [
      { id:"p18", name:"Canyon All-Terrain Sneaker",  image:"👟", price:148, inventory:84, url:"/products/canyon-all-terrain-sneaker" },
      { id:"p19", name:"Shell Travel Backpack 26L",   image:"🎒", price:178, inventory:42, url:"/products/shell-travel-backpack-26l"  },
      { id:"p20", name:"Nest 2-in-1 Sandal",          image:"🩴", price:118, inventory:62, url:"/products/nest-2-in-1-sandal"         },
      { id:"p21", name:"Tropicfeel Starter Bundle",   image:"🌴", price:228, inventory:24, url:"/products/tropicfeel-starter-bundle"  },
    ],
    shows: {},
  },
  walmartlive: {
    defaultProducts: [
      { id:"w1",  name:"Flash Deal Bundle",           image:"⚡", price:49,  inventory:200, url:"/products/flash-deal-bundle"    },
      { id:"w2",  name:"Home Essentials Kit",         image:"🏠", price:89,  inventory:150, url:"/products/home-essentials-kit"  },
      { id:"w3",  name:"Fashion Basics Set",          image:"👚", price:38,  inventory:300, url:"/products/fashion-basics-set"   },
      { id:"w4",  name:"Beauty Starter Pack",         image:"💅", price:34,  inventory:180, url:"/products/beauty-starter-pack"  },
    ],
    shows: {},
  },
}

export const PERSONA_PLATFORMS = {
  bananarepublic: ["TT", "IG", "AM"],
  kyliecosmetics: ["TT", "IG"],
  tropicfeel:     ["IG", "AM"],
  walmartlive:    ["WN", "TT", "AM", "IG"],
}
