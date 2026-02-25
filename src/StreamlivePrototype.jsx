import { useState, useEffect, useRef } from "react";

// ─── FONTS ────────────────────────────────────────────────────────────────────
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&family=JetBrains+Mono:wght@400;600&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #06060e; }
  ::-webkit-scrollbar { width: 4px; height: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: #1e1e3a; border-radius: 99px; }
  @keyframes fadeUp   { from { opacity:0; transform:translateY(8px)  } to { opacity:1; transform:translateY(0) } }
  @keyframes slideIn  { from { opacity:0; transform:translateX(14px) } to { opacity:1; transform:translateX(0) } }
  @keyframes pulse    { 0%,100% { opacity:1 } 50% { opacity:.4 } }
  @keyframes spin     { to { transform:rotate(360deg) } }
  @keyframes pop      { 0% { transform:scale(.92); opacity:0 } 100% { transform:scale(1); opacity:1 } }
  .fade-up  { animation: fadeUp  .3s ease both; }
  .slide-in { animation: slideIn .25s ease both; }
  .pop-in   { animation: pop     .2s ease both; }
  select option { background: #0d0d1e; }
`;

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const C = {
  bg:       "#06060e",
  surface:  "#0a0a15",
  surface2: "#0d0d1e",
  border:   "#14142a",
  border2:  "#1e1e38",
  text:     "#e2e8f0",
  muted:    "#6b7280",
  subtle:   "#3d3d6e",
  accent:   "#7c3aed",
  accent2:  "#4f46e5",
  green:    "#10b981",
  red:      "#ef4444",
  amber:    "#f59e0b",
  blue:     "#60a5fa",
  pink:     "#ec4899",
};

// ─── PLATFORM META ────────────────────────────────────────────────────────────
const PLATFORMS = {
  WN: { label:"Whatnot",     color:"#7c3aed", short:"WN" },
  TT: { label:"TikTok Shop", color:"#f43f5e", short:"TT" },
  AM: { label:"Amazon Live", color:"#f59e0b", short:"AM" },
  IG: { label:"Instagram",   color:"#ec4899", short:"IG" },
};

const STATUS_META = {
  vip:     { label:"VIP",      bg:"#2d1f5e", text:"#a78bfa", dot:"#7c3aed" },
  active:  { label:"Active",   bg:"#0a1e16", text:"#34d399", dot:"#10b981" },
  risk:    { label:"At Risk",  bg:"#2d1208", text:"#fca5a5", dot:"#ef4444" },
  new:     { label:"New",      bg:"#0f1e2e", text:"#93c5fd", dot:"#60a5fa" },
  dormant: { label:"Dormant",  bg:"#1a1a2e", text:"#6b7280", dot:"#4b5563" },
};

// ─── TEST PERSONAS ────────────────────────────────────────────────────────────
const PERSONAS = [
  {
    id: "sarah",
    name: "Sarah Chen",
    shop: "CardVaultSC",
    email: "sarah@cardvault.co",
    avatar: "SC",
    plan: "pro",
    planColor: "#f59e0b",
    category: "Trading Cards",
    platforms: ["WN","TT","AM","IG"],
    buyerCount: 847,
    showCount: 94,
    subscriberCount: 1204,
    slug: "cardvaultsc",
    bio: "Premier trading card seller on Whatnot. Weekly breaks every Thursday at 8PM EST.",
  },
  {
    id: "tyler",
    name: "Tyler Rhodes",
    shop: "SneakerDropTR",
    email: "tyler@snkr.haus",
    avatar: "TR",
    plan: "growth",
    planColor: "#7c3aed",
    category: "Sneakers",
    platforms: ["TT","AM"],
    buyerCount: 501,
    showCount: 58,
    subscriberCount: 612,
    slug: "sneakerdroptr",
    bio: "Authenticated sneakers. TikTok Live every Saturday + Amazon drops.",
  },
  {
    id: "devon",
    name: "Devon King",
    shop: "KingComics",
    email: "devon@kingcomics.shop",
    avatar: "DK",
    plan: "starter",
    planColor: "#10b981",
    category: "Comics",
    platforms: ["WN"],
    buyerCount: 44,
    showCount: 5,
    subscriberCount: 31,
    slug: "kingcomics",
    bio: "Silver age comics and key issues. New to live selling!",
  },
];

// ─── BUYER DATA (per persona) ─────────────────────────────────────────────────
const BUYERS_BY_PERSONA = {
  sarah: [
    { id:"b1",  name:"Marcus Webb",    handle:"@marcuswebb_cards", platform:"WN", spend:4820, orders:34, lastOrder:"2d ago",  category:"Trading Cards", status:"vip",     score:9.4, avatar:"MW", tags:["VIP","Cards Break"], email:"m.webb@example.com", phone:"+1-555-0101" },
    { id:"b2",  name:"Priya Nair",     handle:"@priyasfinds",      platform:"WN", spend:3210, orders:22, lastOrder:"1d ago",  category:"Vintage",       status:"vip",     score:8.9, avatar:"PN", tags:["VIP"],               email:"priya@example.com",  phone:"+1-555-0102" },
    { id:"b3",  name:"Devon Price",    handle:"@devonp",           platform:"TT", spend:2980, orders:19, lastOrder:"5d ago",  category:"Trading Cards", status:"vip",     score:8.1, avatar:"DP", tags:["VIP","Big Spender"], email:"dp@example.com",     phone:"+1-555-0103" },
    { id:"b4",  name:"Amy Chen",       handle:"@amyc_live",        platform:"AM", spend:1740, orders:12, lastOrder:"32d ago", category:"Cards",         status:"risk",    score:5.2, avatar:"AC", tags:[],                    email:"amyc@example.com",   phone:"+1-555-0104" },
    { id:"b5",  name:"Jordan Mills",   handle:"@jmills",           platform:"WN", spend:890,  orders:6,  lastOrder:"28d ago", category:"Trading Cards", status:"risk",    score:4.8, avatar:"JM", tags:[],                    email:"jm@example.com",     phone:"+1-555-0105" },
    { id:"b6",  name:"Chris Olsen",    handle:"@colsen_cards",     platform:"WN", spend:640,  orders:4,  lastOrder:"3d ago",  category:"Trading Cards", status:"active",  score:6.1, avatar:"CO", tags:["New"],               email:"co@example.com",     phone:"+1-555-0106" },
    { id:"b7",  name:"Leila Hassan",   handle:"@leilashop",        platform:"TT", spend:420,  orders:3,  lastOrder:"7d ago",  category:"Cards",         status:"active",  score:5.5, avatar:"LH", tags:[],                    email:"lh@example.com",     phone:"+1-555-0107" },
    { id:"b8",  name:"Omar Rashid",    handle:"@omar_collector",   platform:"IG", spend:210,  orders:2,  lastOrder:"91d ago", category:"Vintage",       status:"dormant", score:2.1, avatar:"OR", tags:[],                    email:"or@example.com",     phone:"+1-555-0108" },
  ],
  tyler: [
    { id:"b1",  name:"Jess Park",      handle:"@jesspark_kicks",   platform:"TT", spend:6400, orders:28, lastOrder:"1d ago",  category:"Jordan",        status:"vip",     score:9.7, avatar:"JP", tags:["VIP","Jordan Head"], email:"jp@example.com",     phone:"+1-555-0201" },
    { id:"b2",  name:"Leo Santos",     handle:"@leosneaks",        platform:"AM", spend:4100, orders:18, lastOrder:"3d ago",  category:"Yeezy",         status:"vip",     score:8.8, avatar:"LS", tags:["VIP"],               email:"ls@example.com",     phone:"+1-555-0202" },
    { id:"b3",  name:"Hana Kim",       handle:"@hanakick",         platform:"TT", spend:2200, orders:11, lastOrder:"6d ago",  category:"Nike SB",       status:"active",  score:7.2, avatar:"HK", tags:[],                    email:"hk@example.com",     phone:"+1-555-0203" },
    { id:"b4",  name:"Amara Osei",     handle:"@amara_kicks",      platform:"TT", spend:890,  orders:5,  lastOrder:"44d ago", category:"Jordan",        status:"risk",    score:4.1, avatar:"AO", tags:[],                    email:"ao@example.com",     phone:"+1-555-0204" },
    { id:"b5",  name:"Raj Patel",      handle:"@rajcops",          platform:"AM", spend:460,  orders:3,  lastOrder:"9d ago",  category:"Nike",          status:"new",     score:5.8, avatar:"RP", tags:["New"],               email:"rp@example.com",     phone:"+1-555-0205" },
  ],
  devon: [
    { id:"b1",  name:"Alice Fox",      handle:"@alicereads",       platform:"WN", spend:1120, orders:8,  lastOrder:"1d ago",  category:"Silver Age",    status:"vip",     score:8.2, avatar:"AF", tags:["VIP"],               email:"af@example.com",     phone:"+1-555-0301" },
    { id:"b2",  name:"Benny Cruz",     handle:"@bennybooks",       platform:"WN", spend:640,  orders:5,  lastOrder:"4d ago",  category:"Key Issues",    status:"active",  score:6.8, avatar:"BC", tags:[],                    email:"bc@example.com",     phone:"+1-555-0302" },
    { id:"b3",  name:"Tom Walsh",      handle:"@tomcollects",      platform:"WN", spend:280,  orders:2,  lastOrder:"60d ago", category:"Bronze Age",    status:"risk",    score:3.4, avatar:"TW", tags:[],                    email:"tw@example.com",     phone:"+1-555-0303" },
  ],
};

// ─── SHOWS DATA ───────────────────────────────────────────────────────────────
const SHOWS = [
  { id:"sh1", title:"Thursday Night Break #94",  date:"Feb 20, 2025", platform:"WN", gmv:4820, buyers:38, repeatRate:68, duration:"2h 14m", aiDebrief:"Strong show — your regulars showed up. Marcus Webb dropped $640 in the last 30 min. Consider scheduling a Jordan-focused show next week based on buyer category interest signals.", topItem:"2023 Topps Chrome Hobby Box", newBuyers:8 },
  { id:"sh2", title:"TikTok Weekend Drop #31",   date:"Feb 15, 2025", platform:"TT", gmv:3210, buyers:29, repeatRate:55, duration:"1h 48m", aiDebrief:"Good reach but lower repeat rate vs Whatnot. 14 first-time buyers. Your intro hook landed — 8 comments mentioning the packaging reveal.", topItem:"Refractor Lot x10", newBuyers:14 },
  { id:"sh3", title:"Amazon Prime Flash Sale",   date:"Feb 10, 2025", platform:"AM", gmv:2100, buyers:21, repeatRate:43, duration:"1h 02m", aiDebrief:"Amazon buyers skew more transactional. 21 orders placed, 18 shipped same-day. Consider bundling with a Whatnot opt-in push to capture these buyers long-term.", topItem:"Graded PSA 9 Lot", newBuyers:18 },
  { id:"sh4", title:"Thursday Night Break #93",  date:"Feb 13, 2025", platform:"WN", gmv:5100, buyers:42, repeatRate:72, duration:"2h 31m", aiDebrief:"Best show this month. 42 unique buyers, 72% repeat. VIP segment drove 61% of GMV.", topItem:"Vintage Wax Box", newBuyers:6 },
];

// ─── CAMPAIGNS DATA ───────────────────────────────────────────────────────────
const CAMPAIGNS = [
  { id:"c1", name:"Thursday Break Reminder",  type:"email", status:"sent",    sentAt:"Feb 19, 2025", recipients:842, opened:61, clicked:38, converted:22, gmv:1840 },
  { id:"c2", name:"VIP Early Access — Feb",   type:"sms",   status:"sent",    sentAt:"Feb 14, 2025", recipients:124, opened:89, clicked:62, converted:41, gmv:3200 },
  { id:"c3", name:"Win-Back: 30-Day Dormant", type:"email", status:"sent",    sentAt:"Feb 8,  2025",  recipients:203, opened:34, clicked:18, converted:9,  gmv:680  },
  { id:"c4", name:"New Inventory Drop Alert", type:"sms",   status:"draft",   sentAt:null,            recipients:0,   opened:0,  clicked:0,  converted:0,  gmv:0    },
];


// ─── STRIPE PAYMENT LINKS ─────────────────────────────────────────────────────
const STRIPE_LINKS = {
  starter: 'https://buy.stripe.com/test_cNibJ377j60W9TS1rX0kE00',
  growth:  'https://buy.stripe.com/test_7sYbJ363fblgfec9Yt0kE01',
  pro:     'https://buy.stripe.com/test_00w5kF77j7504zyc6B0kE02',
};
// Redirect URLs to set in Stripe Dashboard → Payment Links → After Payment:
// Starter: https://strmlive.com/welcome?plan=starter
// Growth:  https://strmlive.com/welcome?plan=growth
// Pro:     https://strmlive.com/welcome?plan=pro


// ─── SHOPIFY CATALOG DATA ─────────────────────────────────────────────────────
const PRODUCTS = [
  { id:"p1",  name:"2023 Topps Chrome Hobby Box",       sku:"TC23-HOB",  price:189, inventory:12, category:"Sealed Wax",     image:"📦", platforms:["WN","TT","AM"],    showReady:true,  shopifyId:"sh_001", aiScore:9.4, soldLast30:34, avgPerShow:3.2 },
  { id:"p2",  name:"Bowman Chrome Prospect Lot x10",    sku:"BC-PROS10", price:64,  inventory:28, category:"Lots",           image:"🃏", platforms:["WN","TT"],         showReady:true,  shopifyId:"sh_002", aiScore:8.8, soldLast30:28, avgPerShow:4.1 },
  { id:"p3",  name:"PSA 9 Graded Lot x3",               sku:"PSA9-L3",   price:220, inventory:6,  category:"Graded",         image:"🏆", platforms:["WN","AM"],         showReady:true,  shopifyId:"sh_003", aiScore:9.1, soldLast30:19, avgPerShow:2.8 },
  { id:"p4",  name:"Vintage Wax Box 1987 Topps",        sku:"VWB-87T",   price:340, inventory:3,  category:"Vintage",        image:"✨", platforms:["WN"],              showReady:true,  shopifyId:"sh_004", aiScore:7.6, soldLast30:8,  avgPerShow:1.2 },
  { id:"p5",  name:"Refractor Lot x25 Mixed",           sku:"REF-MX25",  price:49,  inventory:45, category:"Lots",           image:"💎", platforms:["WN","TT","AM","IG"],showReady:false, shopifyId:"sh_005", aiScore:8.2, soldLast30:41, avgPerShow:5.6 },
  { id:"p6",  name:"Jordan RC Reprint Set",             sku:"MJ-RC-SET",  price:89,  inventory:15, category:"Singles",        image:"🐐", platforms:["TT","IG"],         showReady:true,  shopifyId:"sh_006", aiScore:9.7, soldLast30:22, avgPerShow:3.8 },
  { id:"p7",  name:"2024 Prizm Draft Football Blaster", sku:"PZ24-BLT",  price:39,  inventory:30, category:"Sealed Wax",     image:"🏈", platforms:["WN","TT","AM"],    showReady:false, shopifyId:"sh_007", aiScore:7.1, soldLast30:15, avgPerShow:2.1 },
  { id:"p8",  name:"Mystery Box — Card Collector",      sku:"MYS-CC-01", price:29,  inventory:50, category:"Mystery",        image:"🎁", platforms:["WN","TT","IG"],    showReady:true,  shopifyId:"sh_008", aiScore:8.5, soldLast30:63, avgPerShow:7.2 },
  { id:"p9",  name:"1952 Topps Commons Lot",            sku:"52T-COM",   price:125, inventory:8,  category:"Vintage",        image:"📜", platforms:["WN","AM"],         showReady:false, shopifyId:"sh_009", aiScore:6.8, soldLast30:5,  avgPerShow:0.8 },
  { id:"p10", name:"Luka Doncic Rookie Lot x5",         sku:"LUKA-RC5",  price:149, inventory:10, category:"Singles",        image:"⭐", platforms:["WN","TT","AM","IG"],showReady:true,  shopifyId:"sh_010", aiScore:9.6, soldLast30:31, avgPerShow:4.4 },
];

// ─── LOYALTY TIERS ────────────────────────────────────────────────────────────
const LOYALTY_TIERS = [
  { id:"bronze", label:"Bronze",  minPoints:0,    maxPoints:499,  color:"#b45309", bg:"#2e1b09", icon:"🥉", perks:["Birthday discount 10%","Early show access 5min"] },
  { id:"silver", label:"Silver",  minPoints:500,  maxPoints:1999, color:"#6b7280", bg:"#1a1e2a", icon:"🥈", perks:["Birthday discount 15%","Early show access 15min","Free shipping on orders $50+"] },
  { id:"gold",   label:"Gold",    minPoints:2000, maxPoints:4999, color:"#d97706", bg:"#2e1f0a", icon:"🥇", perks:["Birthday discount 20%","Early show access 30min","Free shipping always","Monthly mystery bonus"] },
  { id:"vip",    label:"VIP",     minPoints:5000, maxPoints:null, color:"#7c3aed", bg:"#2d1f5e", icon:"👑", perks:["Birthday discount 25%","Private VIP-only shows","Free shipping always","Monthly mystery bonus","Direct seller DM access","First pick on limited items"] },
];

const LOYALTY_BUYERS = {
  b1: { points:4820, tier:"gold",   pointsToNext:180,  history:[{date:"Feb 20",event:"Order #34",pts:+64},{date:"Feb 15",event:"Order #33",pts:+43},{date:"Feb 1",event:"Order #32",pts:+89}] },
  b2: { points:3210, tier:"gold",   pointsToNext:1790, history:[{date:"Feb 20",event:"Order #22",pts:+48},{date:"Jan 14",event:"Order #21",pts:+36}] },
  b3: { points:2980, tier:"gold",   pointsToNext:2020, history:[{date:"Feb 15",event:"Order #19",pts:+72},{date:"Feb 1",event:"Order #18",pts:+55}] },
  b4: { points:740,  tier:"silver", pointsToNext:1260, history:[{date:"Jan 5",event:"Order #12",pts:+28}] },
  b5: { points:390,  tier:"bronze", pointsToNext:110,  history:[{date:"Dec 20",event:"Order #6",pts:+18}] },
  b6: { points:640,  tier:"silver", pointsToNext:1360, history:[{date:"Feb 20",event:"Order #4",pts:+32}] },
  b7: { points:420,  tier:"bronze", pointsToNext:80,   history:[{date:"Feb 10",event:"Order #3",pts:+24}] },
  b8: { points:50,   tier:"bronze", pointsToNext:450,  history:[{date:"Nov 1",event:"Order #2",pts:+12}] },
};

// ─── SHOW PLANNER DATA ────────────────────────────────────────────────────────
const UPCOMING_SHOW = {
  id:"sh5", title:"Thursday Night Break #95", date:"Feb 27, 2025", time:"8:00 PM EST", platform:"WN",
  aiSuggestedOrder: ["p8","p10","p6","p1","p3","p2","p4"],
  estimatedGMV: 5200, estimatedBuyers: 41,
};

// ─── NAV ITEMS ────────────────────────────────────────────────────────────────
const NAV = [
  { id:"dashboard",   label:"Dashboard",  icon:"⬡",  route:"/dashboard" },
  { id:"buyers",      label:"Buyers",     icon:"◉",  route:"/buyers" },
  { id:"shows",       label:"Shows",      icon:"◈",  route:"/shows" },
  { id:"catalog",     label:"Catalog",    icon:"◧",  route:"/catalog" },
  { id:"campaigns",   label:"Campaigns",  icon:"◆",  route:"/campaigns" },
  { id:"subscribers", label:"Subscribers",icon:"●",  route:"/subscribers" },
  { id:"loyalty",     label:"Loyalty",    icon:"♦",  route:"/loyalty" },
  { id:"settings",    label:"Settings",   icon:"◎",  route:"/settings" },
];

const PLAN_FEATURES = {
  starter: ["dashboard","buyers","shows","campaigns","subscribers","settings"],
  growth:  ["dashboard","buyers","shows","campaigns","subscribers","settings"],
  pro:     ["dashboard","buyers","shows","campaigns","subscribers","settings"],
};

// ─── MICRO COMPONENTS ─────────────────────────────────────────────────────────
function Avatar({ initials, color="#7c3aed", size=32 }) {
  return (
    <div style={{ width:size, height:size, borderRadius:size*0.28, background:`${color}22`, border:`1px solid ${color}44`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:size*0.32, fontWeight:700, color, flexShrink:0 }}>
      {initials}
    </div>
  );
}

function Badge({ label, bg, text }) {
  return (
    <span style={{ fontSize:10, fontWeight:700, color:text, background:bg, border:`1px solid ${text}33`, padding:"2px 8px", borderRadius:6, textTransform:"uppercase", letterSpacing:"0.05em", whiteSpace:"nowrap" }}>
      {label}
    </span>
  );
}

function PlatformPill({ code }) {
  const p = PLATFORMS[code];
  if (!p) return null;
  return (
    <div style={{ display:"flex", alignItems:"center", gap:4, background:`${p.color}12`, border:`1px solid ${p.color}2e`, borderRadius:6, padding:"2px 8px" }}>
      <div style={{ width:5, height:5, borderRadius:"50%", background:p.color }} />
      <span style={{ fontSize:10, fontWeight:700, color:p.color }}>{code}</span>
    </div>
  );
}

function StatCard({ label, value, sub, color="#7c3aed", mono=true }) {
  return (
    <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderTop:`2px solid ${color}`, borderRadius:12, padding:"16px 18px" }}>
      <div style={{ fontSize:10, color:C.muted, textTransform:"uppercase", letterSpacing:"0.08em", fontWeight:700, marginBottom:8 }}>{label}</div>
      <div style={{ fontFamily:mono?"'JetBrains Mono',monospace":"'Syne',sans-serif", fontSize:26, fontWeight:700, color:C.text, lineHeight:1, marginBottom:5 }}>{value}</div>
      {sub && <div style={{ fontSize:11, color:C.subtle }}>{sub}</div>}
    </div>
  );
}

// ─── SCREEN: DASHBOARD ────────────────────────────────────────────────────────
function ScreenDashboard({ persona, buyers, navigate }) {
  const vip     = buyers.filter(b=>b.status==="vip").length;
  const atRisk  = buyers.filter(b=>b.status==="risk").length;
  const dormant = buyers.filter(b=>b.status==="dormant").length;
  const totalGMV = SHOWS.reduce((a,s)=>a+s.gmv,0);

  const insights = [
    { icon:"↑", text:`Thursday shows drive 2.3× more repeat buyers than weekends`, type:"opportunity", color:C.green },
    { icon:"⚠", text:`${atRisk} buyers haven't ordered in 28+ days — a campaign now could recover ~$${(atRisk*320).toLocaleString()}`, type:"alert", color:C.amber },
    { icon:"★", text:`${vip} VIP buyers account for 61% of your total GMV`, type:"insight", color:"#a78bfa" },
  ];

  return (
    <div style={{ padding:"28px 32px", overflowY:"auto", height:"100%" }}>
      {/* GREETING */}
      <div style={{ marginBottom:24 }}>
        <div style={{ fontFamily:"'Syne',sans-serif", fontSize:22, fontWeight:800, color:C.text, letterSpacing:"-0.5px" }}>
          Good evening, {persona.name.split(" ")[0]} 👋
        </div>
        <div style={{ fontSize:12, color:C.muted, marginTop:4 }}>
          {persona.shop} · {persona.platforms.map(p=>PLATFORMS[p]?.label).join(", ")}
        </div>
      </div>

      {/* STATS GRID */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:24 }}>
        <StatCard label="Total Buyers"   value={buyers.length.toLocaleString()} sub="across all platforms" color={C.accent} />
        <StatCard label="VIP Buyers"     value={vip}             sub={`${Math.round(vip/buyers.length*100)}% of list`}  color="#a78bfa" />
        <StatCard label="At Risk"        value={atRisk}          sub="need a campaign now"                               color={C.amber} />
        <StatCard label="GMV (90 days)"  value={`$${totalGMV.toLocaleString()}`} sub="across all shows"                 color={C.green} />
      </div>

      {/* AI INSIGHTS + RECENT BUYERS */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1.4fr", gap:16, marginBottom:20 }}>
        {/* INSIGHTS */}
        <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:14, padding:"18px 20px" }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:16 }}>
            <div style={{ width:22, height:22, borderRadius:6, background:`${C.accent}22`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, color:C.accent }}>✦</div>
            <span style={{ fontSize:12, fontWeight:700, color:C.text }}>AI Briefing</span>
            <span style={{ fontSize:10, color:C.subtle, marginLeft:"auto" }}>This week</span>
          </div>
          {insights.map((ins,i)=>(
            <div key={i} style={{ display:"flex", gap:10, paddingBottom:12, marginBottom:12, borderBottom:i<insights.length-1?`1px solid ${C.border}`:"none" }}>
              <div style={{ width:24, height:24, borderRadius:6, background:`${ins.color}18`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, color:ins.color, flexShrink:0 }}>{ins.icon}</div>
              <div style={{ fontSize:12, color:"#9ca3af", lineHeight:1.55 }}>{ins.text}</div>
            </div>
          ))}
          {persona.plan==="starter" && (
            <div style={{ marginTop:8, padding:"10px 12px", background:"#2d1f5e22", border:`1px dashed ${C.accent}44`, borderRadius:9 }}>
              <span style={{ fontSize:11, color:"#a78bfa" }}>✦ Upgrade to Growth for AI-powered weekly briefings</span>
            </div>
          )}
        </div>

        {/* TOP BUYERS */}
        <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:14, padding:"18px 20px" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
            <span style={{ fontSize:12, fontWeight:700, color:C.text }}>Top Buyers</span>
            <button onClick={()=>navigate("buyers")} style={{ fontSize:11, color:C.accent, background:"none", border:"none", cursor:"pointer", padding:0 }}>View all →</button>
          </div>
          {buyers.slice(0,5).map((b,i)=>{
            const pl = PLATFORMS[b.platform];
            const st = STATUS_META[b.status];
            return (
              <div key={b.id} onClick={()=>navigate("buyer-profile", { buyerId:b.id })} style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 0", borderBottom:i<4?`1px solid ${C.border}`:"none", cursor:"pointer" }}>
                <Avatar initials={b.avatar} color={pl?.color} size={30} />
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:12, fontWeight:600, color:C.text }}>{b.name}</div>
                  <div style={{ fontSize:10, color:C.muted }}>{b.orders} orders · Last {b.lastOrder}</div>
                </div>
                <div style={{ textAlign:"right" }}>
                  <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:12, fontWeight:700, color:C.text }}>${b.spend.toLocaleString()}</div>
                  <Badge label={st.label} bg={st.bg} text={st.text} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* RECENT SHOWS */}
      <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:14, padding:"18px 20px" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
          <span style={{ fontSize:12, fontWeight:700, color:C.text }}>Recent Shows</span>
          <button onClick={()=>navigate("shows")} style={{ fontSize:11, color:C.accent, background:"none", border:"none", cursor:"pointer", padding:0 }}>View all →</button>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:10 }}>
          {SHOWS.slice(0,4).map(s=>{
            const pl = PLATFORMS[s.platform];
            return (
              <div key={s.id} onClick={()=>navigate("show-report", { showId:s.id })} style={{ background:C.surface2, border:`1px solid ${C.border}`, borderRadius:10, padding:"12px 14px", cursor:"pointer" }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
                  <PlatformPill code={s.platform} />
                  <span style={{ fontSize:10, color:C.muted, fontFamily:"'JetBrains Mono',monospace" }}>{s.date}</span>
                </div>
                <div style={{ fontSize:12, fontWeight:600, color:C.text, marginBottom:6 }}>{s.title}</div>
                <div style={{ display:"flex", gap:14 }}>
                  <div><span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:13, fontWeight:700, color:C.green }}>${s.gmv.toLocaleString()}</span><span style={{ fontSize:10, color:C.muted }}> GMV</span></div>
                  <div><span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:13, fontWeight:700, color:C.text }}>{s.buyers}</span><span style={{ fontSize:10, color:C.muted }}> buyers</span></div>
                  <div><span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:13, fontWeight:700, color:"#a78bfa" }}>{s.repeatRate}%</span><span style={{ fontSize:10, color:C.muted }}> repeat</span></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── SCREEN: BUYER LIBRARY ────────────────────────────────────────────────────
function ScreenBuyers({ buyers, navigate }) {
  const [search, setSearch] = useState("");
  const [seg, setSeg]       = useState("all");

  const filtered = buyers.filter(b => {
    const matchSearch = b.name.toLowerCase().includes(search.toLowerCase()) || b.handle.toLowerCase().includes(search.toLowerCase());
    const matchSeg    = seg === "all" || b.status === seg;
    return matchSearch && matchSeg;
  });

  const segs = [
    { id:"all",     label:`All (${buyers.length})` },
    { id:"vip",     label:`VIP (${buyers.filter(b=>b.status==="vip").length})` },
    { id:"risk",    label:`At Risk (${buyers.filter(b=>b.status==="risk").length})` },
    { id:"new",     label:`New (${buyers.filter(b=>b.status==="new").length})` },
    { id:"dormant", label:`Dormant (${buyers.filter(b=>b.status==="dormant").length})` },
  ];

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100%", overflow:"hidden" }}>
      {/* TOOLBAR */}
      <div style={{ padding:"16px 28px", borderBottom:`1px solid ${C.border}`, flexShrink:0, background:C.surface }}>
        <div style={{ display:"flex", gap:0, marginBottom:12 }}>
          {segs.map(s=>(
            <button key={s.id} onClick={()=>setSeg(s.id)} style={{ background:"none", border:"none", borderBottom:`2px solid ${seg===s.id?C.accent:"transparent"}`, color:seg===s.id?"#a78bfa":C.muted, fontSize:12, fontWeight:seg===s.id?700:400, padding:"0 14px 10px", cursor:"pointer", transition:"all .15s" }}>
              {s.label}
            </button>
          ))}
        </div>
        <div style={{ display:"flex", gap:10, alignItems:"center" }}>
          <div style={{ flex:1, display:"flex", alignItems:"center", gap:8, background:C.surface2, border:`1px solid ${C.border2}`, borderRadius:9, padding:"8px 12px" }}>
            <span style={{ color:C.subtle, fontSize:12 }}>🔍</span>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search buyers by name or handle…" style={{ flex:1, background:"none", border:"none", color:C.text, fontSize:12, outline:"none" }} />
          </div>
          <div style={{ fontSize:11, color:C.muted }}>{filtered.length} buyers</div>
        </div>
      </div>

      {/* TABLE HEADER */}
      <div style={{ display:"grid", gridTemplateColumns:"1.8fr 0.9fr 0.7fr 0.7fr 0.9fr 0.8fr", padding:"9px 28px", borderBottom:`1px solid ${C.border}`, flexShrink:0 }}>
        {["Buyer","Platform","Spend","Orders","Last Order","Status"].map(h=>(
          <div key={h} style={{ fontSize:10, color:C.muted, textTransform:"uppercase", letterSpacing:"0.08em", fontWeight:700 }}>{h}</div>
        ))}
      </div>

      {/* ROWS */}
      <div style={{ flex:1, overflowY:"auto" }}>
        {filtered.length === 0 ? (
          <div style={{ padding:"60px 28px", textAlign:"center", color:C.subtle, fontSize:13 }}>No buyers match your search.</div>
        ) : filtered.map((b,i) => {
          const pl = PLATFORMS[b.platform];
          const st = STATUS_META[b.status];
          return (
            <div key={b.id} onClick={()=>navigate("buyer-profile", { buyerId:b.id })} style={{ display:"grid", gridTemplateColumns:"1.8fr 0.9fr 0.7fr 0.7fr 0.9fr 0.8fr", padding:"11px 28px", borderBottom:`1px solid #0d0d18`, cursor:"pointer", transition:"background .1s" }}
              onMouseEnter={e=>e.currentTarget.style.background=C.surface2}
              onMouseLeave={e=>e.currentTarget.style.background="transparent"}
            >
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <Avatar initials={b.avatar} color={pl?.color} size={30} />
                <div>
                  <div style={{ fontSize:13, fontWeight:600, color:C.text }}>{b.name}</div>
                  <div style={{ fontSize:11, color:C.muted }}>{b.handle}</div>
                </div>
              </div>
              <div style={{ alignSelf:"center" }}><PlatformPill code={b.platform} /></div>
              <div style={{ alignSelf:"center", fontFamily:"'JetBrains Mono',monospace", fontSize:12, fontWeight:700, color:C.text }}>${b.spend.toLocaleString()}</div>
              <div style={{ alignSelf:"center", fontFamily:"'JetBrains Mono',monospace", fontSize:12, color:"#9ca3af" }}>{b.orders}</div>
              <div style={{ alignSelf:"center", fontSize:12, color:C.muted }}>{b.lastOrder}</div>
              <div style={{ alignSelf:"center" }}><Badge label={st.label} bg={st.bg} text={st.text} /></div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── SCREEN: BUYER PROFILE ────────────────────────────────────────────────────
function ScreenBuyerProfile({ buyer, persona, navigate }) {
  const [tab, setTab] = useState("overview");
  if (!buyer) return <div style={{ padding:40, color:C.muted }}>Buyer not found.</div>;
  const pl = PLATFORMS[buyer.platform];
  const st = STATUS_META[buyer.status];

  const timeline = [
    { date:"Feb 20, 2025", event:"Placed order #34 — 2023 Topps Chrome", amount:320 },
    { date:"Feb 15, 2025", event:"Placed order #33 — Bowman Chrome Prospect", amount:185 },
    { date:"Feb 10, 2025", event:"Subscribed to show reminders via SMS", amount:null },
    { date:"Feb 1,  2025", event:"Placed order #32 — Vintage Wax Box", amount:640 },
    { date:"Jan 24, 2025", event:"Placed order #31 — PSA 9 Lot x3", amount:420 },
  ];

  return (
    <div style={{ display:"flex", height:"100%", overflow:"hidden" }}>
      {/* LEFT PANEL */}
      <div style={{ width:300, borderRight:`1px solid ${C.border}`, overflowY:"auto", flexShrink:0, background:"#050508" }}>
        <div style={{ padding:"22px 20px" }}>
          <button onClick={()=>navigate("buyers")} style={{ fontSize:11, color:C.muted, background:"none", border:"none", cursor:"pointer", marginBottom:16, padding:0, display:"flex", alignItems:"center", gap:5 }}>
            ← Back to buyers
          </button>
          <Avatar initials={buyer.avatar} color={pl?.color} size={52} />
          <div style={{ marginTop:12, marginBottom:16 }}>
            <div style={{ fontSize:16, fontWeight:700, color:C.text }}>{buyer.name}</div>
            <div style={{ fontSize:12, color:C.muted }}>{buyer.handle}</div>
          </div>
          <div style={{ display:"flex", gap:8, marginBottom:18 }}>
            <PlatformPill code={buyer.platform} />
            <Badge label={st.label} bg={st.bg} text={st.text} />
          </div>

          {/* STATS */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:16 }}>
            {[
              { label:"Total Spend",  value:`$${buyer.spend.toLocaleString()}` },
              { label:"Orders",       value:buyer.orders },
              { label:"Avg Order",    value:`$${Math.round(buyer.spend/buyer.orders)}` },
              { label:"Engage Score", value:buyer.score },
            ].map(m=>(
              <div key={m.label} style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:9, padding:"10px 12px" }}>
                <div style={{ fontSize:9, color:C.muted, textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:4 }}>{m.label}</div>
                <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:18, fontWeight:700, color:C.text }}>{m.value}</div>
              </div>
            ))}
            {(() => {
              const bl = LOYALTY_BUYERS[buyer.id];
              if (!bl) return null;
              const tier = LOYALTY_TIERS.find(t=>t.id===bl.tier);
              return (
                <div style={{ background:tier.bg, border:`1px solid ${tier.color}44`, borderRadius:9, padding:"10px 12px", gridColumn:"span 2" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
                    <div style={{ fontSize:9, color:tier.color, textTransform:"uppercase", letterSpacing:"0.07em", fontWeight:700 }}>{tier.icon} {tier.label} Member</div>
                    <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:16, fontWeight:700, color:tier.color }}>{bl.points.toLocaleString()} pts</div>
                  </div>
                  <div style={{ height:5, background:C.border, borderRadius:3, overflow:"hidden" }}>
                    <div style={{ height:"100%", width:`${tier.maxPoints ? Math.round((bl.points-tier.minPoints)/(tier.maxPoints-tier.minPoints)*100) : 100}%`, background:tier.color, borderRadius:3 }} />
                  </div>
                  {tier.maxPoints && <div style={{ fontSize:9, color:C.muted, marginTop:4 }}>{bl.pointsToNext.toLocaleString()} pts to {LOYALTY_TIERS[LOYALTY_TIERS.findIndex(t=>t.id===tier.id)+1]?.label}</div>}
                </div>
              );
            })()}
          </div>

          {/* CONTACT */}
          <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:10, padding:"12px 14px", marginBottom:14 }}>
            <div style={{ fontSize:10, color:C.muted, textTransform:"uppercase", letterSpacing:"0.07em", fontWeight:700, marginBottom:10 }}>Contact</div>
            <div style={{ fontSize:11, color:"#9ca3af", marginBottom:5 }}>✉ {buyer.email}</div>
            <div style={{ fontSize:11, color:"#9ca3af" }}>📱 {buyer.phone}</div>
          </div>

          {/* TAGS */}
          {buyer.tags.length > 0 && (
            <div style={{ marginBottom:14 }}>
              <div style={{ fontSize:10, color:C.muted, textTransform:"uppercase", letterSpacing:"0.07em", fontWeight:700, marginBottom:8 }}>Tags</div>
              <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                {buyer.tags.map(t=><span key={t} style={{ fontSize:10, fontWeight:600, color:"#a78bfa", background:"#2d1f5e44", border:"1px solid #7c3aed33", padding:"3px 9px", borderRadius:6 }}>{t}</span>)}
              </div>
            </div>
          )}

          <button onClick={()=>navigate("composer", { prefilledBuyer:buyer.id })} style={{ width:"100%", background:`linear-gradient(135deg,${C.accent},${C.accent2})`, border:"none", color:"#fff", fontSize:12, fontWeight:700, padding:"10px", borderRadius:9, cursor:"pointer" }}>
            Send Campaign
          </button>
        </div>
      </div>

      {/* MAIN AREA */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
        {/* TABS */}
        <div style={{ display:"flex", borderBottom:`1px solid ${C.border}`, padding:"0 24px", flexShrink:0 }}>
          {["overview","timeline","notes"].map(t=>(
            <button key={t} onClick={()=>setTab(t)} style={{ background:"none", border:"none", borderBottom:`2px solid ${tab===t?C.accent:"transparent"}`, color:tab===t?"#a78bfa":C.muted, fontSize:12, fontWeight:tab===t?700:400, padding:"14px 16px 13px", cursor:"pointer", textTransform:"capitalize" }}>
              {t}
            </button>
          ))}
        </div>

        <div style={{ flex:1, overflowY:"auto", padding:"24px" }}>
          {tab==="overview" && (
            <div className="fade-up">
              {/* SPEND BARS */}
              <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:14, padding:"18px 20px", marginBottom:16 }}>
                <div style={{ fontSize:12, fontWeight:700, color:C.text, marginBottom:14 }}>Spend Over Time (last 6 shows)</div>
                <div style={{ display:"flex", gap:8, alignItems:"flex-end", height:80 }}>
                  {[320, 185, 0, 640, 420, 180].map((v,i)=>(
                    <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
                      <div style={{ width:"100%", height:`${Math.round(v/640*100)}%`, background: v>0 ? `${C.accent}cc` : C.border, borderRadius:"4px 4px 0 0", minHeight:v>0?4:2, transition:"height .3s ease" }} />
                      <div style={{ fontSize:9, color:C.muted, fontFamily:"'JetBrains Mono',monospace" }}>{v?`$${v}`:"-"}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI INSIGHT */}
              <div style={{ background:"#2d1f5e22", border:`1px solid ${C.accent}33`, borderRadius:12, padding:"14px 16px" }}>
                <div style={{ fontSize:10, color:"#a78bfa", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:8 }}>✦ AI Insight</div>
                <div style={{ fontSize:12, color:"#9ca3af", lineHeight:1.65 }}>
                  {buyer.name} is one of your top {buyer.status === "vip" ? "VIP buyers" : "customers"}, averaging ${Math.round(buyer.spend/buyer.orders)} per order. 
                  {buyer.status === "risk" ? " They haven't ordered in a while — a personalized win-back SMS referencing their favorite category could bring them back." : 
                   buyer.status === "vip" ? " Giving them early access to your next show or a private preview could increase their average order value further." : 
                   " They're showing healthy engagement patterns."}
                </div>
              </div>
            </div>
          )}

          {tab==="timeline" && (
            <div className="fade-up">
              {timeline.map((ev,i)=>(
                <div key={i} style={{ display:"flex", gap:14, paddingBottom:18, marginBottom:18, borderBottom:i<timeline.length-1?`1px solid ${C.border}`:"none" }}>
                  <div style={{ width:8, height:8, borderRadius:"50%", background:ev.amount?C.accent:C.subtle, marginTop:5, flexShrink:0 }} />
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:12, color:C.text, marginBottom:3 }}>{ev.event}</div>
                    <div style={{ fontSize:10, color:C.muted, fontFamily:"'JetBrains Mono',monospace" }}>{ev.date}</div>
                  </div>
                  {ev.amount && <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:13, fontWeight:700, color:C.green }}>${ev.amount}</div>}
                </div>
              ))}
            </div>
          )}

          {tab==="notes" && (
            <div className="fade-up">
              <textarea placeholder="Add a note about this buyer…" rows={5} style={{ width:"100%", background:C.surface2, border:`1px solid ${C.border2}`, borderRadius:10, padding:"12px 14px", color:C.text, fontSize:13, outline:"none", resize:"vertical", fontFamily:"'DM Sans',sans-serif" }} />
              <button style={{ marginTop:10, background:`linear-gradient(135deg,${C.accent},${C.accent2})`, border:"none", color:"#fff", fontSize:12, fontWeight:700, padding:"8px 20px", borderRadius:8, cursor:"pointer" }}>Save Note</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── SCREEN: SHOWS ────────────────────────────────────────────────────────────
function ScreenShows({ navigate, persona }) {
  return (
    <div style={{ padding:"28px 32px", overflowY:"auto", height:"100%" }}>
      <div style={{ marginBottom:24 }}>
        <div style={{ fontFamily:"'Syne',sans-serif", fontSize:22, fontWeight:800, color:C.text, letterSpacing:"-0.5px" }}>Shows</div>
        <div style={{ fontSize:12, color:C.muted, marginTop:4 }}>{SHOWS.length} shows recorded across all platforms</div>
      </div>

      {/* LIVE COMPANION CTA */}
      <div style={{ background:"linear-gradient(135deg,#2d1f5e,#1a1030)", border:`1px solid ${C.accent}44`, borderRadius:14, padding:"18px 22px", marginBottom:24, display:"flex", alignItems:"center", gap:16 }}>
        <div style={{ width:44, height:44, borderRadius:12, background:`${C.accent}22`, border:`1px solid ${C.accent}44`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>🔴</div>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:14, fontWeight:700, color:C.text, marginBottom:4 }}>Live Companion</div>
          <div style={{ fontSize:12, color:"#9ca3af" }}>Real-time buyer intelligence during your shows — instant lookups, VIP alerts, notes on the fly.</div>
        </div>
        {persona.plan === "starter" ? (
          <div style={{ fontSize:11, color:C.accent, background:`${C.accent}18`, border:`1px solid ${C.accent}33`, padding:"6px 14px", borderRadius:8, whiteSpace:"nowrap" }}>Growth+ feature</div>
        ) : (
          <button onClick={()=>navigate("show-planner")} style={{ background:`linear-gradient(135deg,${C.accent},${C.accent2})`, border:"none", color:"#fff", fontSize:12, fontWeight:700, padding:"8px 18px", borderRadius:9, cursor:"pointer", whiteSpace:"nowrap" }}>Start Live Show</button>
        )}
      </div>

      {/* SHOW CARDS */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:14 }}>
        {SHOWS.map(s=>{
          const pl = PLATFORMS[s.platform];
          return (
            <div key={s.id} onClick={()=>navigate("show-report", { showId:s.id })} style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:14, padding:"18px 20px", cursor:"pointer", transition:"border-color .15s" }}
              onMouseEnter={e=>e.currentTarget.style.borderColor=C.border2}
              onMouseLeave={e=>e.currentTarget.style.borderColor=C.border}
            >
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
                <div>
                  <PlatformPill code={s.platform} />
                  <div style={{ fontSize:13, fontWeight:700, color:C.text, marginTop:8 }}>{s.title}</div>
                  <div style={{ fontSize:11, color:C.muted, marginTop:3, fontFamily:"'JetBrains Mono',monospace" }}>{s.date} · {s.duration}</div>
                </div>
                <div style={{ fontSize:10, color:C.accent }}>View report →</div>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10 }}>
                {[
                  { label:"GMV",          value:`$${s.gmv.toLocaleString()}`, color:C.green },
                  { label:"Buyers",       value:s.buyers,                     color:C.text  },
                  { label:"Repeat Rate",  value:`${s.repeatRate}%`,           color:"#a78bfa" },
                ].map(m=>(
                  <div key={m.label}>
                    <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:18, fontWeight:700, color:m.color }}>{m.value}</div>
                    <div style={{ fontSize:10, color:C.muted, marginTop:2 }}>{m.label}</div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── SCREEN: SHOW REPORT ─────────────────────────────────────────────────────
function ScreenShowReport({ show, navigate }) {
  if (!show) return <div style={{ padding:40, color:C.muted }}>Show not found.</div>;
  const pl = PLATFORMS[show.platform];

  return (
    <div style={{ padding:"28px 32px", overflowY:"auto", height:"100%" }}>
      <button onClick={()=>navigate("shows")} style={{ fontSize:11, color:C.muted, background:"none", border:"none", cursor:"pointer", marginBottom:20, padding:0 }}>← Back to shows</button>

      <div style={{ display:"flex", alignItems:"flex-start", gap:16, marginBottom:24 }}>
        <div style={{ flex:1 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:6 }}>
            <PlatformPill code={show.platform} />
            <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:11, color:C.muted }}>{show.date} · {show.duration}</span>
          </div>
          <div style={{ fontFamily:"'Syne',sans-serif", fontSize:20, fontWeight:800, color:C.text, letterSpacing:"-0.4px" }}>{show.title}</div>
        </div>
      </div>

      {/* KPI ROW */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:24 }}>
        <StatCard label="GMV"            value={`$${show.gmv.toLocaleString()}`}  sub="gross merchandise value"  color={C.green}    />
        <StatCard label="Unique Buyers"  value={show.buyers}                       sub={`${show.newBuyers} first-time`}  color={pl?.color}  />
        <StatCard label="Repeat Rate"    value={`${show.repeatRate}%`}             sub="returned from past shows"  color="#a78bfa"    />
        <StatCard label="Top Item"       value={show.topItem}                      sub="most ordered"              color={C.amber} mono={false} />
      </div>

      {/* AI DEBRIEF */}
      <div style={{ background:"#2d1f5e18", border:`1px solid ${C.accent}33`, borderRadius:14, padding:"18px 22px", marginBottom:20 }}>
        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12 }}>
          <div style={{ width:22, height:22, borderRadius:6, background:`${C.accent}22`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, color:C.accent }}>✦</div>
          <span style={{ fontSize:12, fontWeight:700, color:C.text }}>AI Show Debrief</span>
        </div>
        <div style={{ fontSize:13, color:"#9ca3af", lineHeight:1.7 }}>{show.aiDebrief}</div>
      </div>

      {/* GMV BAR CHART */}
      <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:14, padding:"18px 22px" }}>
        <div style={{ fontSize:12, fontWeight:700, color:C.text, marginBottom:16 }}>GMV by Hour</div>
        <div style={{ display:"flex", gap:6, alignItems:"flex-end", height:100 }}>
          {[12,45,88,124,210,320,290,180,140,98,64,42,28].map((v,i)=>{
            const pct = Math.round(v/320*100);
            return (
              <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
                <div style={{ width:"100%", height:`${pct}%`, background:`${C.accent}99`, borderRadius:"3px 3px 0 0", minHeight:2 }} />
                <div style={{ fontSize:8, color:C.subtle, fontFamily:"'JetBrains Mono',monospace" }}>{i+1}h</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── SCREEN: LIVE COMPANION ───────────────────────────────────────────────────
function ScreenLive({ buyers, navigate }) {
  const [liveBuyers, setLiveBuyers]   = useState(buyers.slice(0,3));
  const [elapsed, setElapsed]         = useState(0);
  const [viewerCount, setViewerCount] = useState(234);
  const [gmv, setGmv]                 = useState(1420);
  const [search, setSearch]           = useState("");
  const [selectedId, setSelectedId]   = useState(buyers[0]?.id || null);
  const [rightTab, setRightTab]       = useState("notes");

  // Per-buyer state maps
  const [buyerNotes,    setBuyerNotes]    = useState({});
  const [buyerDiscounts,setBuyerDiscounts]= useState({});
  const [buyerPerks,    setBuyerPerks]    = useState({});
  const [buyerItems,    setBuyerItems]    = useState({});
  const [savedFeedback, setSavedFeedback] = useState(null);

  // Auto-select the newest buyer as they flash in
  useEffect(()=>{
    const t = setInterval(()=>{
      setElapsed(e=>e+1);
      setViewerCount(v=>Math.max(180, v + Math.floor((Math.random()-0.4)*8)));
      setGmv(g=>g + Math.floor(Math.random()*40));
      if (Math.random() > 0.7) {
        setLiveBuyers(prev => {
          const remaining = buyers.filter(b=>!prev.find(p=>p.id===b.id));
          if (!remaining.length) return prev;
          const newest = remaining[0];
          return [newest, ...prev].slice(0,10);
        });
      }
    }, 2000);
    return ()=>clearInterval(t);
  }, [buyers]);

  const fmt = (s) => `${String(Math.floor(s/3600)).padStart(2,"0")}:${String(Math.floor((s%3600)/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;

  const filtered     = liveBuyers.filter(b=>b.name.toLowerCase().includes(search.toLowerCase())||b.handle.toLowerCase().includes(search.toLowerCase()));
  const selectedBuyer= liveBuyers.find(b=>b.id===selectedId) || liveBuyers[0];
  const buyerLoyalty = selectedBuyer ? (LOYALTY_BUYERS[selectedBuyer.id] || { points:0, tier:"bronze", pointsToNext:500 }) : null;
  const loyaltyTier  = buyerLoyalty  ? LOYALTY_TIERS.find(t=>t.id===buyerLoyalty.tier) : null;

  const saveNote = () => {
    setSavedFeedback("note");
    setTimeout(()=>setSavedFeedback(null), 1800);
  };
  const applyDiscount = () => {
    setSavedFeedback("discount");
    setTimeout(()=>setSavedFeedback(null), 1800);
  };
  const addItem = (productId) => {
    setBuyerItems(prev=>({
      ...prev,
      [selectedBuyer.id]: [...(prev[selectedBuyer.id]||[]), productId]
    }));
    setSavedFeedback("item");
    setTimeout(()=>setSavedFeedback(null), 1800);
  };
  const removeItem = (productId) => {
    setBuyerItems(prev=>({
      ...prev,
      [selectedBuyer.id]: (prev[selectedBuyer.id]||[]).filter(id=>id!==productId)
    }));
  };

  const currentDiscount = selectedBuyer ? (buyerDiscounts[selectedBuyer.id] || 0) : 0;
  const currentPerks    = selectedBuyer ? (buyerPerks[selectedBuyer.id]    || {}) : {};
  const currentItems    = selectedBuyer ? (buyerItems[selectedBuyer.id]    || []) : [];
  const addedProducts   = PRODUCTS.filter(p=>currentItems.includes(p.id));

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100%", background:"#050510" }}>

      {/* ── LIVE HEADER ── */}
      <div style={{ background:"#090916", borderBottom:`1px solid ${C.border}`, padding:"10px 24px", display:"flex", alignItems:"center", gap:16, flexShrink:0 }}>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <div style={{ width:8, height:8, borderRadius:"50%", background:"#ef4444", animation:"pulse 1s infinite" }} />
          <span style={{ fontSize:12, fontWeight:700, color:"#ef4444" }}>LIVE</span>
          <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:12, color:C.muted }}>{fmt(elapsed)}</span>
        </div>
        <div style={{ display:"flex", gap:20 }}>
          <div><span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:14, fontWeight:700, color:C.text }}>{viewerCount}</span><span style={{ fontSize:11, color:C.muted }}> viewers</span></div>
          <div><span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:14, fontWeight:700, color:C.green }}>${gmv.toLocaleString()}</span><span style={{ fontSize:11, color:C.muted }}> GMV</span></div>
          <div><span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:14, fontWeight:700, color:"#a78bfa" }}>{liveBuyers.length}</span><span style={{ fontSize:11, color:C.muted }}> buyers</span></div>
        </div>
        <div style={{ marginLeft:"auto" }}>
          <button onClick={()=>navigate("order-review",{liveBuyers,buyerNotes,buyerDiscounts,buyerPerks,buyerItems,gmv,elapsed})} style={{ fontSize:11, color:"#ef4444", background:"#2d08081a", border:"1px solid #ef444433", padding:"6px 14px", borderRadius:7, cursor:"pointer" }}>■ End Show</button>
        </div>
      </div>

      {/* ── MAIN BODY ── */}
      <div style={{ flex:1, display:"flex", overflow:"hidden" }}>

        {/* ── BUYER FEED ── */}
        <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden", borderRight:`1px solid ${C.border}` }}>
          <div style={{ padding:"10px 16px", borderBottom:`1px solid ${C.border}`, flexShrink:0 }}>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Quick lookup — search any buyer…"
              style={{ width:"100%", background:C.surface2, border:`1px solid ${C.border2}`, borderRadius:8, padding:"7px 12px", color:C.text, fontSize:12, outline:"none" }} />
          </div>
          <div style={{ overflowY:"auto", flex:1 }}>
            {filtered.map((b,i)=>{
              const pl   = PLATFORMS[b.platform];
              const st   = STATUS_META[b.status];
              const bl   = LOYALTY_BUYERS[b.id];
              const tier = bl ? LOYALTY_TIERS.find(t=>t.id===bl.tier) : null;
              const isSelected = b.id === selectedId;
              const hasItems   = (buyerItems[b.id]||[]).length > 0;
              const hasDiscount= (buyerDiscounts[b.id]||0) > 0;
              const hasPerks   = Object.values(buyerPerks[b.id]||{}).some(Boolean);
              return (
                <div
                  key={b.id}
                  onClick={()=>setSelectedId(b.id)}
                  className={i===0?"pop-in":""}
                  style={{
                    padding:"10px 16px",
                    borderBottom:`1px solid #0d0d18`,
                    borderLeft:`3px solid ${isSelected?C.accent:"transparent"}`,
                    background:isSelected?`${C.accent}0d`:"transparent",
                    display:"flex", alignItems:"center", gap:10,
                    cursor:"pointer", transition:"all .12s"
                  }}
                >
                  <Avatar initials={b.avatar} color={pl?.color} size={30} />
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:2 }}>
                      <span style={{ fontSize:12, fontWeight:isSelected?700:600, color:isSelected?C.text:"#d1d5db" }}>{b.name}</span>
                      {b.status==="vip" && <Badge label="VIP" bg={st.bg} text={st.text} />}
                      {tier && <span style={{ fontSize:9 }}>{tier.icon}</span>}
                      {i===0 && <span style={{ fontSize:8, fontWeight:700, color:"#ef4444", background:"#2d080833", border:"1px solid #ef444433", padding:"1px 6px", borderRadius:4 }}>NEW ORDER</span>}
                    </div>
                    <div style={{ fontSize:10, color:C.muted, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
                      {b.handle} · ${b.spend.toLocaleString()} lifetime · {b.orders} orders
                    </div>
                  </div>
                  <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:3, flexShrink:0 }}>
                    <PlatformPill code={b.platform} />
                    <div style={{ display:"flex", gap:4 }}>
                      {hasDiscount && <span style={{ fontSize:8, fontWeight:700, color:C.green, background:"#0a1e1620", border:"1px solid #10b98133", padding:"1px 5px", borderRadius:4 }}>%OFF</span>}
                      {hasItems    && <span style={{ fontSize:8, fontWeight:700, color:C.amber, background:"#2e1f0a20", border:"1px solid #d9770633", padding:"1px 5px", borderRadius:4 }}>+ITEMS</span>}
                      {hasPerks    && <span style={{ fontSize:8, fontWeight:700, color:"#a78bfa", background:"#2d1f5e20", border:"1px solid #7c3aed33", padding:"1px 5px", borderRadius:4 }}>PERK</span>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── RIGHT PANEL — BUYER CONTEXT ── */}
        <div style={{ width:320, display:"flex", flexDirection:"column", background:"#050508", flexShrink:0 }}>

          {selectedBuyer ? (
            <>
              {/* BUYER MINI-CARD */}
              <div style={{ padding:"14px 16px", borderBottom:`1px solid ${C.border}`, background:"#080812", flexShrink:0 }}>
                <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
                  <Avatar initials={selectedBuyer.avatar} color={PLATFORMS[selectedBuyer.platform]?.color} size={36} />
                  <div style={{ flex:1 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:3 }}>
                      <span style={{ fontSize:13, fontWeight:700, color:C.text }}>{selectedBuyer.name}</span>
                      {loyaltyTier && <span style={{ fontSize:10 }}>{loyaltyTier.icon}</span>}
                    </div>
                    <div style={{ fontSize:10, color:C.muted }}>{selectedBuyer.handle} · {selectedBuyer.orders} orders</div>
                  </div>
                  <div style={{ textAlign:"right" }}>
                    <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:14, fontWeight:700, color:C.green }}>${selectedBuyer.spend.toLocaleString()}</div>
                    <div style={{ fontSize:9, color:C.muted }}>lifetime</div>
                  </div>
                </div>

                {/* LOYALTY PROGRESS */}
                {buyerLoyalty && loyaltyTier && (
                  <div style={{ background:loyaltyTier.bg, border:`1px solid ${loyaltyTier.color}33`, borderRadius:8, padding:"7px 10px" }}>
                    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
                      <span style={{ fontSize:10, fontWeight:700, color:loyaltyTier.color }}>{loyaltyTier.icon} {loyaltyTier.label}</span>
                      <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10, color:loyaltyTier.color }}>{buyerLoyalty.points.toLocaleString()} pts</span>
                    </div>
                    <div style={{ height:3, background:C.border, borderRadius:2, overflow:"hidden" }}>
                      <div style={{ height:"100%", width:`${loyaltyTier.maxPoints?Math.min(100,Math.round((buyerLoyalty.points-loyaltyTier.minPoints)/(loyaltyTier.maxPoints-loyaltyTier.minPoints)*100)):100}%`, background:loyaltyTier.color, borderRadius:2 }} />
                    </div>
                  </div>
                )}

                {/* ACTIVE ADDITIONS SUMMARY */}
                {(currentItems.length > 0 || currentDiscount > 0 || Object.values(currentPerks).some(Boolean)) && (
                  <div style={{ marginTop:8, display:"flex", gap:5, flexWrap:"wrap" }}>
                    {currentDiscount > 0 && <span style={{ fontSize:9, fontWeight:700, color:C.green, background:"#0a1e16", border:"1px solid #10b98133", padding:"2px 7px", borderRadius:5 }}>{currentDiscount}% OFF applied</span>}
                    {currentItems.length > 0 && <span style={{ fontSize:9, fontWeight:700, color:C.amber, background:"#1e1206", border:"1px solid #d9770633", padding:"2px 7px", borderRadius:5 }}>{currentItems.length} item{currentItems.length>1?"s":""} added</span>}
                    {currentPerks.bonusPoints && <span style={{ fontSize:9, fontWeight:700, color:"#a78bfa", background:"#1a0f2e", border:"1px solid #7c3aed33", padding:"2px 7px", borderRadius:5 }}>2× Points</span>}
                    {currentPerks.mysteryItem && <span style={{ fontSize:9, fontWeight:700, color:"#f43f5e", background:"#1e0810", border:"1px solid #f43f5e33", padding:"2px 7px", borderRadius:5 }}>Mystery Bonus</span>}
                  </div>
                )}
              </div>

              {/* TABS */}
              <div style={{ display:"flex", borderBottom:`1px solid ${C.border}`, flexShrink:0 }}>
                {[
                  { id:"notes",    label:"Notes"    },
                  { id:"perks",    label:"Perks"    },
                  { id:"items",    label:"Add Items" },
                  { id:"discount", label:"Discount"  },
                ].map(t=>(
                  <button key={t.id} onClick={()=>setRightTab(t.id)} style={{ flex:1, background:"none", border:"none", borderBottom:`2px solid ${rightTab===t.id?C.accent:"transparent"}`, color:rightTab===t.id?"#a78bfa":C.muted, fontSize:10, fontWeight:rightTab===t.id?700:400, padding:"10px 4px", cursor:"pointer", transition:"all .12s" }}>
                    {t.label}
                  </button>
                ))}
              </div>

              {/* TAB CONTENT */}
              <div style={{ flex:1, overflowY:"auto", padding:"14px 16px" }}>

                {/* NOTES */}
                {rightTab==="notes" && (
                  <div>
                    <div style={{ fontSize:10, color:C.muted, marginBottom:8 }}>Note for <strong style={{ color:C.text }}>{selectedBuyer.name}</strong> — saved to their buyer profile</div>
                    <textarea
                      rows={6}
                      value={buyerNotes[selectedBuyer.id] || ""}
                      onChange={e=>setBuyerNotes(prev=>({...prev,[selectedBuyer.id]:e.target.value}))}
                      placeholder={`Add a note about ${selectedBuyer.name}… hot lot interest, VIP shoutout, chat moment, follow up…`}
                      style={{ width:"100%", background:C.surface2, border:`1px solid ${C.border2}`, borderRadius:9, padding:"10px 12px", color:C.text, fontSize:12, outline:"none", resize:"none", fontFamily:"'DM Sans',sans-serif", lineHeight:1.6 }}
                    />
                    <button onClick={saveNote} style={{ width:"100%", marginTop:8, background:savedFeedback==="note"?C.green:`${C.accent}22`, border:`1px solid ${savedFeedback==="note"?C.green:C.accent+"44"}`, color:savedFeedback==="note"?"#fff":"#a78bfa", fontSize:12, fontWeight:700, padding:"9px", borderRadius:8, cursor:"pointer", transition:"all .2s" }}>
                      {savedFeedback==="note" ? "✓ Note Saved!" : "Save Note"}
                    </button>

                    {/* Past notes from buyer profile */}
                    {(LOYALTY_BUYERS[selectedBuyer.id]?.history||[]).length > 0 && (
                      <div style={{ marginTop:16 }}>
                        <div style={{ fontSize:10, fontWeight:700, color:C.muted, textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:8 }}>Order History</div>
                        {LOYALTY_BUYERS[selectedBuyer.id].history.map((h,i)=>(
                          <div key={i} style={{ display:"flex", justifyContent:"space-between", padding:"6px 0", borderBottom:i<LOYALTY_BUYERS[selectedBuyer.id].history.length-1?`1px solid ${C.border}`:"none" }}>
                            <span style={{ fontSize:11, color:C.muted }}>{h.date} · {h.event}</span>
                            <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:11, color:C.green }}>+{h.pts}pts</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* PERKS */}
                {rightTab==="perks" && (
                  <div>
                    <div style={{ fontSize:10, color:C.muted, marginBottom:12 }}>Apply one-time perks to <strong style={{ color:C.text }}>{selectedBuyer.name}</strong>'s current order</div>
                    {[
                      { key:"bonusPoints", icon:"⚡", label:"2× Loyalty Points",        desc:"Double points on this order" },
                      { key:"earlyAccess", icon:"⏰", label:"VIP Early Access – Next Show", desc:"DM them a private invite link" },
                      { key:"mysteryItem", icon:"🎁", label:"Mystery Bonus Item",         desc:"Add a surprise to their order" },
                      { key:"freeShipping",icon:"📦", label:"Free Shipping Override",     desc:"Waive shipping on this order" },
                      { key:"firstPick",   icon:"👑", label:"First Pick – Next Show",     desc:"Reserve first pick rights" },
                    ].map(perk=>(
                      <div
                        key={perk.key}
                        onClick={()=>setBuyerPerks(prev=>({...prev,[selectedBuyer.id]:{...(prev[selectedBuyer.id]||{}),[perk.key]:!(prev[selectedBuyer.id]||{})[perk.key]}}))}
                        style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 12px", background:currentPerks[perk.key]?`${C.accent}12`:C.surface, border:`1px solid ${currentPerks[perk.key]?C.accent+"44":C.border}`, borderRadius:10, marginBottom:7, cursor:"pointer", transition:"all .15s" }}
                      >
                        <div style={{ width:32, height:32, borderRadius:8, background:currentPerks[perk.key]?`${C.accent}22`:C.surface2, display:"flex", alignItems:"center", justifyContent:"center", fontSize:15, flexShrink:0 }}>{perk.icon}</div>
                        <div style={{ flex:1 }}>
                          <div style={{ fontSize:11, fontWeight:700, color:C.text }}>{perk.label}</div>
                          <div style={{ fontSize:10, color:C.muted }}>{perk.desc}</div>
                        </div>
                        <div style={{ width:36, height:20, borderRadius:10, background:currentPerks[perk.key]?C.accent:C.border2, position:"relative", flexShrink:0, transition:"background .2s" }}>
                          <div style={{ position:"absolute", top:2, left:currentPerks[perk.key]?17:2, width:16, height:16, borderRadius:"50%", background:"#fff", transition:"left .2s" }} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* ADD ITEMS */}
                {rightTab==="items" && (
                  <div>
                    <div style={{ fontSize:10, color:C.muted, marginBottom:12 }}>Add catalog items to <strong style={{ color:C.text }}>{selectedBuyer.name}</strong>'s order</div>

                    {/* Added items */}
                    {addedProducts.length > 0 && (
                      <div style={{ background:"#0a1206", border:"1px solid #10b98133", borderRadius:10, padding:"10px 12px", marginBottom:12 }}>
                        <div style={{ fontSize:10, fontWeight:700, color:C.green, marginBottom:8, textTransform:"uppercase", letterSpacing:"0.07em" }}>Added to Order</div>
                        {addedProducts.map(p=>(
                          <div key={p.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
                            <div style={{ display:"flex", gap:6, alignItems:"center" }}>
                              <span style={{ fontSize:14 }}>{p.image}</span>
                              <span style={{ fontSize:11, color:C.text }}>{p.name}</span>
                            </div>
                            <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                              <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:11, color:C.green }}>${p.price}</span>
                              <button onClick={()=>removeItem(p.id)} style={{ background:"none", border:"none", color:"#f87171", fontSize:12, cursor:"pointer", padding:"0 2px" }}>✕</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Catalog list */}
                    {PRODUCTS.filter(p=>p.showReady && !currentItems.includes(p.id)).map(p=>(
                      <div key={p.id} style={{ display:"flex", alignItems:"center", gap:9, padding:"9px 10px", background:C.surface, border:`1px solid ${C.border}`, borderRadius:9, marginBottom:6 }}>
                        <span style={{ fontSize:16, flexShrink:0 }}>{p.image}</span>
                        <div style={{ flex:1, minWidth:0 }}>
                          <div style={{ fontSize:11, fontWeight:600, color:C.text, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{p.name}</div>
                          <div style={{ fontSize:9, color:C.muted }}>{p.inventory} in stock · AI: {p.aiScore}</div>
                        </div>
                        <div style={{ textAlign:"right", flexShrink:0 }}>
                          <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:11, fontWeight:700, color:C.green }}>${p.price}</div>
                          <button
                            onClick={()=>addItem(p.id)}
                            style={{ fontSize:9, fontWeight:700, color:"#fff", background:savedFeedback==="item"?C.green:C.accent, border:"none", padding:"3px 8px", borderRadius:5, cursor:"pointer", marginTop:2 }}
                          >
                            + Add
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* DISCOUNT */}
                {rightTab==="discount" && (
                  <div>
                    <div style={{ fontSize:10, color:C.muted, marginBottom:16 }}>Apply a discount to <strong style={{ color:C.text }}>{selectedBuyer.name}</strong>'s current order</div>

                    {/* Quick select */}
                    <div style={{ fontSize:11, fontWeight:700, color:C.muted, textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:8 }}>Quick Select</div>
                    <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:7, marginBottom:16 }}>
                      {[5,10,15,20,25,30,40,50].map(pct=>(
                        <button
                          key={pct}
                          onClick={()=>setBuyerDiscounts(prev=>({...prev,[selectedBuyer.id]:pct}))}
                          style={{ background:currentDiscount===pct?C.green:C.surface, border:`1px solid ${currentDiscount===pct?C.green:C.border}`, color:currentDiscount===pct?"#fff":C.text, fontSize:12, fontWeight:700, padding:"9px 4px", borderRadius:8, cursor:"pointer", transition:"all .15s" }}
                        >
                          {pct}%
                        </button>
                      ))}
                    </div>

                    {/* Custom input */}
                    <div style={{ fontSize:11, fontWeight:700, color:C.muted, textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:8 }}>Custom Amount</div>
                    <div style={{ display:"flex", gap:8, marginBottom:16 }}>
                      <input
                        type="number" min={0} max={100}
                        value={currentDiscount||""}
                        onChange={e=>setBuyerDiscounts(prev=>({...prev,[selectedBuyer.id]:Number(e.target.value)}))}
                        placeholder="0"
                        style={{ flex:1, background:C.surface2, border:`1px solid ${C.border2}`, borderRadius:8, padding:"9px 12px", color:C.text, fontSize:14, fontWeight:700, outline:"none", textAlign:"center", fontFamily:"'JetBrains Mono',monospace" }}
                      />
                      <div style={{ display:"flex", alignItems:"center", justifyContent:"center", width:40, fontSize:18, color:C.muted }}>%</div>
                    </div>

                    {/* Reason tag */}
                    <div style={{ fontSize:11, fontWeight:700, color:C.muted, textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:8 }}>Reason</div>
                    <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:16 }}>
                      {["VIP loyalty","New buyer","At-risk win-back","Show special","Apology"].map(r=>{
                        const isActive = currentPerks["discountReason"]===r;
                        return (
                          <button key={r} onClick={()=>setBuyerPerks(prev=>({...prev,[selectedBuyer.id]:{...(prev[selectedBuyer.id]||{}),discountReason:r}}))}
                            style={{ fontSize:10, fontWeight:isActive?700:400, color:isActive?"#fff":C.muted, background:isActive?C.accent:C.surface, border:`1px solid ${isActive?C.accent:C.border}`, padding:"4px 10px", borderRadius:6, cursor:"pointer" }}>
                            {r}
                          </button>
                        );
                      })}
                    </div>

                    {currentDiscount > 0 && (
                      <div style={{ background:"#0a1e16", border:"1px solid #10b98133", borderRadius:10, padding:"12px 14px", marginBottom:12 }}>
                        <div style={{ fontSize:11, color:C.muted, marginBottom:4 }}>Order summary with discount</div>
                        <div style={{ display:"flex", justifyContent:"space-between" }}>
                          <span style={{ fontSize:12, color:C.muted }}>Lifetime avg order</span>
                          <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:12, color:C.muted, textDecoration:"line-through" }}>${Math.round(selectedBuyer.spend/selectedBuyer.orders)}</span>
                        </div>
                        <div style={{ display:"flex", justifyContent:"space-between", marginTop:4 }}>
                          <span style={{ fontSize:12, fontWeight:700, color:C.text }}>After {currentDiscount}% discount</span>
                          <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:14, fontWeight:700, color:C.green }}>${Math.round(selectedBuyer.spend/selectedBuyer.orders*(1-currentDiscount/100))}</span>
                        </div>
                      </div>
                    )}

                    <button onClick={applyDiscount} style={{ width:"100%", background:savedFeedback==="discount"?C.green:`linear-gradient(135deg,${C.accent},${C.accent2})`, border:"none", color:"#fff", fontSize:13, fontWeight:700, padding:"11px", borderRadius:9, cursor:"pointer", transition:"background .2s" }}>
                      {savedFeedback==="discount" ? "✓ Discount Applied!" : currentDiscount > 0 ? `Apply ${currentDiscount}% Discount` : "Set a Discount First"}
                    </button>

                    {currentDiscount > 0 && (
                      <button onClick={()=>setBuyerDiscounts(prev=>({...prev,[selectedBuyer.id]:0}))} style={{ width:"100%", marginTop:6, background:"none", border:`1px solid ${C.border}`, color:C.muted, fontSize:11, fontWeight:600, padding:"7px", borderRadius:8, cursor:"pointer" }}>
                        Clear Discount
                      </button>
                    )}
                  </div>
                )}

              </div>
            </>
          ) : (
            <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", color:C.subtle, fontSize:12 }}>
              Select a buyer from the feed
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── SCREEN: CAMPAIGNS ────────────────────────────────────────────────────────
function ScreenCampaigns({ navigate, persona }) {
  return (
    <div style={{ padding:"28px 32px", overflowY:"auto", height:"100%" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 }}>
        <div>
          <div style={{ fontFamily:"'Syne',sans-serif", fontSize:22, fontWeight:800, color:C.text, letterSpacing:"-0.5px" }}>Campaigns</div>
          <div style={{ fontSize:12, color:C.muted, marginTop:4 }}>{CAMPAIGNS.length} campaigns</div>
        </div>
        <button onClick={()=>navigate("composer")} style={{ background:`linear-gradient(135deg,${C.accent},${C.accent2})`, border:"none", color:"#fff", fontSize:12, fontWeight:700, padding:"9px 20px", borderRadius:9, cursor:"pointer" }}>
          + New Campaign
        </button>
      </div>

      {/* STATS */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:24 }}>
        <StatCard label="Emails Sent"    value="1,045"  sub="last 30 days"     color={C.blue}   />
        <StatCard label="Avg Open Rate"  value="61%"    sub="industry avg 22%" color={C.green}  />
        <StatCard label="Converted"      value="72"     sub="purchases tracked" color={C.accent} />
        <StatCard label="Revenue Driven" value="$5,720" sub="attributed GMV"   color={C.amber}  />
      </div>

      {/* TABLE */}
      <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:14, overflow:"hidden" }}>
        <div style={{ display:"grid", gridTemplateColumns:"1.8fr 0.7fr 0.8fr 0.7fr 0.7fr 0.7fr 0.8fr", padding:"10px 22px", borderBottom:`1px solid ${C.border}` }}>
          {["Campaign","Type","Status","Recipients","Opened","Clicked","GMV"].map(h=>(
            <div key={h} style={{ fontSize:10, color:C.muted, textTransform:"uppercase", letterSpacing:"0.08em", fontWeight:700 }}>{h}</div>
          ))}
        </div>
        {CAMPAIGNS.map((c,i)=>(
          <div key={c.id} style={{ display:"grid", gridTemplateColumns:"1.8fr 0.7fr 0.8fr 0.7fr 0.7fr 0.7fr 0.8fr", padding:"13px 22px", borderBottom:i<CAMPAIGNS.length-1?`1px solid #0d0d18`:"none", alignItems:"center" }}>
            <div style={{ fontSize:13, fontWeight:600, color:C.text }}>{c.name}</div>
            <div><span style={{ fontSize:10, fontWeight:700, color:c.type==="email"?C.blue:"#a78bfa", background:c.type==="email"?"#0f1e2e":"#2d1f5e", border:`1px solid ${c.type==="email"?C.blue+"44":"#7c3aed44"}`, padding:"2px 8px", borderRadius:6, textTransform:"uppercase" }}>{c.type}</span></div>
            <div><span style={{ fontSize:10, fontWeight:700, color:c.status==="sent"?C.green:C.amber, background:c.status==="sent"?"#0a1e16":"#2e1f0a", border:`1px solid ${c.status==="sent"?C.green+"44":C.amber+"44"}`, padding:"2px 8px", borderRadius:6, textTransform:"uppercase" }}>{c.status}</span></div>
            <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:12, color:"#9ca3af" }}>{c.recipients||"—"}</div>
            <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:12, color:C.green }}>{c.opened?`${c.opened}%`:"—"}</div>
            <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:12, color:C.blue }}>{c.clicked?`${c.clicked}%`:"—"}</div>
            <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:12, fontWeight:700, color:c.gmv?C.amber:C.subtle }}>{c.gmv?`$${c.gmv.toLocaleString()}`:"—"}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── SCREEN: CAMPAIGN COMPOSER ────────────────────────────────────────────────
function ScreenComposer({ navigate, persona }) {
  const [step, setStep] = useState(1);
  const [type, setType] = useState("email");
  const [segment, setSegment] = useState("all");
  const [subject, setSubject] = useState("Thursday Night Break starts in 1 hour 🎉");
  const [body, setBody] = useState("Hey {{first_name}},\n\nJust a reminder — my Thursday Night Break kicks off at 8PM EST tonight on Whatnot.\n\nLast week's show had some insane pulls. Tonight I'm opening a fresh hobby box live. Don't miss it!\n\n👉 Tap to set a reminder: {{show_link}}\n\nSee you there,\n{{seller_name}}");

  const segmentSizes = { all:847, vip:124, risk:68, new:89, dormant:203 };

  return (
    <div style={{ padding:"28px 32px", overflowY:"auto", height:"100%", maxWidth:860 }}>
      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:24 }}>
        <button onClick={()=>navigate("campaigns")} style={{ fontSize:11, color:C.muted, background:"none", border:"none", cursor:"pointer", padding:0 }}>← Back</button>
        <div style={{ fontFamily:"'Syne',sans-serif", fontSize:22, fontWeight:800, color:C.text, letterSpacing:"-0.5px" }}>New Campaign</div>
      </div>

      {/* STEPS */}
      <div style={{ display:"flex", gap:0, marginBottom:28 }}>
        {[{n:1,l:"Audience & Type"},{n:2,l:"Message"},{n:3,l:"Review & Send"}].map((s,i)=>(
          <div key={s.n} style={{ display:"flex", alignItems:"center" }}>
            <button onClick={()=>setStep(s.n)} style={{ display:"flex", alignItems:"center", gap:8, background:"none", border:"none", cursor:"pointer", padding:"0 4px" }}>
              <div style={{ width:24, height:24, borderRadius:"50%", background:step>=s.n?C.accent:C.surface2, border:`2px solid ${step>=s.n?C.accent:C.border2}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700, color:step>=s.n?"#fff":C.subtle }}>
                {step>s.n?"✓":s.n}
              </div>
              <span style={{ fontSize:12, fontWeight:step===s.n?700:400, color:step===s.n?C.text:C.muted }}>{s.l}</span>
            </button>
            {i<2 && <div style={{ width:40, height:1, background:step>s.n?C.accent:C.border2, margin:"0 4px" }} />}
          </div>
        ))}
      </div>

      {step===1 && (
        <div className="fade-up" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>
          {/* TYPE */}
          <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:14, padding:"20px 22px" }}>
            <div style={{ fontSize:12, fontWeight:700, color:C.text, marginBottom:14 }}>Channel</div>
            {["email","sms"].map(t=>(
              <div key={t} onClick={()=>setType(t)} style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 14px", borderRadius:10, border:`1px solid ${type===t?C.accent+"66":C.border}`, background:type===t?"#2d1f5e22":"transparent", cursor:"pointer", marginBottom:8 }}>
                <div style={{ width:32, height:32, borderRadius:8, background:`${type===t?C.accent:"#3d3d6e"}22`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:15 }}>{t==="email"?"✉":"💬"}</div>
                <div>
                  <div style={{ fontSize:13, fontWeight:600, color:C.text, textTransform:"capitalize" }}>{t}</div>
                  <div style={{ fontSize:11, color:C.muted }}>{t==="email"?"Up to 2,000 recipients":"Up to 500 recipients"}</div>
                </div>
                <div style={{ marginLeft:"auto", width:16, height:16, borderRadius:"50%", border:`2px solid ${type===t?C.accent:C.border2}`, background:type===t?C.accent:"transparent" }} />
              </div>
            ))}
          </div>

          {/* SEGMENT */}
          <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:14, padding:"20px 22px" }}>
            <div style={{ fontSize:12, fontWeight:700, color:C.text, marginBottom:14 }}>Audience</div>
            {[["all","Everyone",`${segmentSizes.all} subscribers`],["vip","VIP Buyers",`${segmentSizes.vip} subscribers`],["risk","At-Risk Buyers",`${segmentSizes.risk} subscribers`],["new","New Buyers",`${segmentSizes.new} subscribers`]].map(([v,l,d])=>(
              <div key={v} onClick={()=>setSegment(v)} style={{ display:"flex", alignItems:"center", gap:10, padding:"9px 12px", borderRadius:9, border:`1px solid ${segment===v?C.accent+"55":C.border}`, background:segment===v?"#2d1f5e1a":"transparent", cursor:"pointer", marginBottom:6 }}>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:12, fontWeight:600, color:C.text }}>{l}</div>
                  <div style={{ fontSize:10, color:C.muted }}>{d}</div>
                </div>
                <div style={{ width:14, height:14, borderRadius:"50%", border:`2px solid ${segment===v?C.accent:C.border2}`, background:segment===v?C.accent:"transparent" }} />
              </div>
            ))}
          </div>

          <button onClick={()=>setStep(2)} style={{ gridColumn:"1/-1", background:`linear-gradient(135deg,${C.accent},${C.accent2})`, border:"none", color:"#fff", fontSize:13, fontWeight:700, padding:"12px", borderRadius:10, cursor:"pointer" }}>
            Continue to Message →
          </button>
        </div>
      )}

      {step===2 && (
        <div className="fade-up">
          {type==="email" && (
            <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:14, padding:"20px 22px", marginBottom:16 }}>
              <div style={{ fontSize:10, color:C.muted, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:8 }}>Subject Line</div>
              <input value={subject} onChange={e=>setSubject(e.target.value)} style={{ width:"100%", background:C.surface2, border:`1px solid ${C.border2}`, borderRadius:9, padding:"10px 12px", color:C.text, fontSize:13, outline:"none" }} />
            </div>
          )}
          <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:14, padding:"20px 22px", marginBottom:16 }}>
            <div style={{ fontSize:10, color:C.muted, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:8 }}>Message Body</div>
            <textarea value={body} onChange={e=>setBody(e.target.value)} rows={10} style={{ width:"100%", background:C.surface2, border:`1px solid ${C.border2}`, borderRadius:9, padding:"10px 12px", color:C.text, fontSize:13, outline:"none", resize:"vertical", fontFamily:"'DM Sans',sans-serif", lineHeight:1.65 }} />
            <div style={{ marginTop:8, display:"flex", gap:8 }}>
              {["{{first_name}}","{{show_link}}","{{seller_name}}"].map(t=>(
                <button key={t} onClick={()=>setBody(b=>b+t)} style={{ fontSize:10, color:"#a78bfa", background:"#2d1f5e44", border:"1px solid #7c3aed33", padding:"3px 9px", borderRadius:6, cursor:"pointer" }}>{t}</button>
              ))}
            </div>
          </div>
          <div style={{ display:"flex", gap:10 }}>
            <button onClick={()=>setStep(1)} style={{ flex:0, background:C.surface, border:`1px solid ${C.border}`, color:C.muted, fontSize:12, fontWeight:600, padding:"10px 20px", borderRadius:9, cursor:"pointer" }}>← Back</button>
            <button onClick={()=>setStep(3)} style={{ flex:1, background:`linear-gradient(135deg,${C.accent},${C.accent2})`, border:"none", color:"#fff", fontSize:13, fontWeight:700, padding:"10px", borderRadius:9, cursor:"pointer" }}>Review Campaign →</button>
          </div>
        </div>
      )}

      {step===3 && (
        <div className="fade-up">
          <div style={{ background:"#2d1f5e22", border:`1px solid ${C.accent}44`, borderRadius:14, padding:"20px 22px", marginBottom:16 }}>
            <div style={{ fontSize:12, fontWeight:700, color:C.text, marginBottom:14 }}>Campaign Summary</div>
            {[
              ["Channel", type.toUpperCase()],
              ["Audience", `${segment==="all"?"Everyone":segment==="vip"?"VIP Buyers":segment==="risk"?"At-Risk Buyers":"New Buyers"} · ${segmentSizes[segment]} recipients`],
              ["Subject", subject],
            ].map(([k,v])=>(
              <div key={k} style={{ display:"flex", gap:14, marginBottom:10 }}>
                <span style={{ fontSize:11, color:C.muted, minWidth:80 }}>{k}</span>
                <span style={{ fontSize:12, color:C.text }}>{v}</span>
              </div>
            ))}
          </div>
          <div style={{ display:"flex", gap:10 }}>
            <button onClick={()=>setStep(2)} style={{ flex:0, background:C.surface, border:`1px solid ${C.border}`, color:C.muted, fontSize:12, fontWeight:600, padding:"10px 20px", borderRadius:9, cursor:"pointer" }}>← Edit</button>
            <button onClick={()=>{ alert(`Campaign sent to ${segmentSizes[segment]} ${type === "email" ? "email" : "SMS"} subscribers! ✉`); navigate("campaigns"); }} style={{ flex:1, background:"linear-gradient(135deg,#10b981,#059669)", border:"none", color:"#fff", fontSize:13, fontWeight:700, padding:"10px", borderRadius:9, cursor:"pointer" }}>
              Send Campaign 🚀
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── SCREEN: SUBSCRIBERS ─────────────────────────────────────────────────────
function ScreenSubscribers({ persona }) {
  const subs = [
    { name:"Marcus Webb", email:"m.webb@example.com", channel:"email+sms", joinedAt:"Jan 4, 2025",  opens:12 },
    { name:"Priya Nair",  email:"priya@example.com",  channel:"email",     joinedAt:"Jan 14, 2025", opens:8  },
    { name:"Devon Price", email:"dp@example.com",     channel:"sms",       joinedAt:"Feb 1, 2025",  opens:5  },
    { name:"Amy Chen",    email:"amyc@example.com",   channel:"email",     joinedAt:"Feb 8, 2025",  opens:2  },
    { name:"Jordan Mills",email:"jm@example.com",     channel:"email+sms", joinedAt:"Feb 12, 2025", opens:9  },
  ];

  return (
    <div style={{ padding:"28px 32px", overflowY:"auto", height:"100%" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 }}>
        <div>
          <div style={{ fontFamily:"'Syne',sans-serif", fontSize:22, fontWeight:800, color:C.text, letterSpacing:"-0.5px" }}>Subscribers</div>
          <div style={{ fontSize:12, color:C.muted, marginTop:4 }}>{persona.subscriberCount} total · Opt-in page at strmlive.com/s/{persona.slug}</div>
        </div>
        <div style={{ display:"flex", gap:8 }}>
          <button style={{ background:C.surface, border:`1px solid ${C.border}`, color:C.muted, fontSize:11, fontWeight:600, padding:"7px 14px", borderRadius:8, cursor:"pointer" }}>Copy opt-in link 🔗</button>
        </div>
      </div>

      {/* STATS */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, marginBottom:24 }}>
        <StatCard label="Total Subscribers" value={persona.subscriberCount} sub="opted in to messages"       color={C.green}  />
        <StatCard label="Email Only"         value={Math.round(persona.subscriberCount*0.48)} sub={`${48}% of list`}  color={C.blue}   />
        <StatCard label="SMS Only"           value={Math.round(persona.subscriberCount*0.31)} sub={`${31}% of list`}  color="#a78bfa" />
      </div>

      {/* OPT-IN LINK CARD */}
      <div style={{ background:"#0a1e16", border:`1px solid ${C.green}33`, borderRadius:14, padding:"16px 20px", marginBottom:20, display:"flex", alignItems:"center", gap:14 }}>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:12, fontWeight:700, color:C.green, marginBottom:4 }}>Your opt-in page is live</div>
          <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:12, color:"#34d399" }}>strmlive.com/s/{persona.slug}</div>
          <div style={{ fontSize:11, color:C.muted, marginTop:4 }}>Share this link in your show chat, bio, and story highlights</div>
        </div>
        <div style={{ fontSize:28 }}>🔗</div>
      </div>

      {/* SUBSCRIBER TABLE */}
      <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:14, overflow:"hidden" }}>
        <div style={{ display:"grid", gridTemplateColumns:"1.5fr 1.5fr 0.8fr 0.8fr 0.5fr", padding:"10px 22px", borderBottom:`1px solid ${C.border}` }}>
          {["Name","Email","Channel","Joined","Opens"].map(h=>(
            <div key={h} style={{ fontSize:10, color:C.muted, textTransform:"uppercase", letterSpacing:"0.08em", fontWeight:700 }}>{h}</div>
          ))}
        </div>
        {subs.map((s,i)=>(
          <div key={i} style={{ display:"grid", gridTemplateColumns:"1.5fr 1.5fr 0.8fr 0.8fr 0.5fr", padding:"12px 22px", borderBottom:i<subs.length-1?`1px solid #0d0d18`:"none", alignItems:"center" }}>
            <div style={{ fontSize:13, fontWeight:600, color:C.text }}>{s.name}</div>
            <div style={{ fontSize:11, color:C.muted, fontFamily:"'JetBrains Mono',monospace" }}>{s.email}</div>
            <div style={{ display:"flex", gap:5 }}>
              {s.channel.includes("email") && <span style={{ fontSize:9, fontWeight:700, color:C.blue, background:"#0f1e2e", border:`1px solid ${C.blue}44`, padding:"2px 6px", borderRadius:5 }}>EMAIL</span>}
              {s.channel.includes("sms") && <span style={{ fontSize:9, fontWeight:700, color:"#a78bfa", background:"#2d1f5e", border:"1px solid #7c3aed44", padding:"2px 6px", borderRadius:5 }}>SMS</span>}
            </div>
            <div style={{ fontSize:11, color:C.muted, fontFamily:"'JetBrains Mono',monospace" }}>{s.joinedAt}</div>
            <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:12, fontWeight:700, color:C.text }}>{s.opens}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── SCREEN: SETTINGS ────────────────────────────────────────────────────────
function ScreenSettings({ persona }) {
  const [tab, setTab] = useState("platforms");
  const [platforms, setPlatforms] = useState(
    persona.platforms.map(p => ({ id:p, connected:true }))
  );

  const PLATFORM_LIST = ["WN","TT","AM","IG"];
  const platformData = {
    WN: { accountType:"Seller",              note:"Orders, buyers, inventory + real-time webhooks" },
    TT: { accountType:"Seller Account",      note:"Requires TikTok Seller Account" },
    AM: { accountType:"Brand Registry / Influencer", note:"Post-show order sync via SP-API — ~24h delay" },
    IG: { accountType:"Business or Creator", note:"Audience insights + DM automation (Pro)" },
  };

  return (
    <div style={{ padding:"28px 32px", overflowY:"auto", height:"100%" }}>
      <div style={{ fontFamily:"'Syne',sans-serif", fontSize:22, fontWeight:800, color:C.text, letterSpacing:"-0.5px", marginBottom:20 }}>Settings</div>

      {/* TABS */}
      <div style={{ display:"flex", gap:0, marginBottom:24, borderBottom:`1px solid ${C.border}` }}>
        {["platforms","profile","billing","team"].map(t=>(
          <button key={t} onClick={()=>setTab(t)} style={{ background:"none", border:"none", borderBottom:`2px solid ${tab===t?C.accent:"transparent"}`, color:tab===t?"#a78bfa":C.muted, fontSize:12, fontWeight:tab===t?700:400, padding:"0 16px 12px", cursor:"pointer", textTransform:"capitalize" }}>
            {t}
          </button>
        ))}
      </div>

      {tab==="platforms" && (
        <div className="fade-up" style={{ maxWidth:600 }}>
          <div style={{ fontSize:12, color:C.muted, marginBottom:20 }}>Connect your selling platforms to import buyer and order data.</div>
          {PLATFORM_LIST.map(pid=>{
            const p = PLATFORMS[pid];
            const pd = platformData[pid];
            const isConnected = platforms.find(pl=>pl.id===pid)?.connected;
            return (
              <div key={pid} style={{ background:C.surface, border:`1px solid ${isConnected?p.color+"44":C.border}`, borderRadius:14, padding:"18px 20px", marginBottom:10, display:"flex", alignItems:"center", gap:14 }}>
                <div style={{ width:42, height:42, borderRadius:11, background:`${p.color}18`, border:`1px solid ${p.color}33`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:800, color:p.color, flexShrink:0 }}>{pid}</div>
                <div style={{ flex:1 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:3 }}>
                    <span style={{ fontSize:13, fontWeight:700, color:C.text }}>{p.label}</span>
                    <span style={{ fontSize:9, fontWeight:700, color:p.color, background:`${p.color}18`, border:`1px solid ${p.color}33`, padding:"2px 7px", borderRadius:6, textTransform:"uppercase" }}>{pd.accountType}</span>
                  </div>
                  <div style={{ fontSize:11, color:C.muted }}>{pd.note}</div>
                  {isConnected && <div style={{ fontSize:10, color:C.green, marginTop:4 }}>● Connected · Last sync 12 min ago · 847 buyers</div>}
                </div>
                {isConnected
                  ? <button onClick={()=>setPlatforms(ps=>ps.map(pl=>pl.id===pid?{...pl,connected:false}:pl))} style={{ fontSize:11, color:"#f87171", background:"#1c0f0f", border:"1px solid #ef444433", padding:"7px 14px", borderRadius:8, cursor:"pointer" }}>Disconnect</button>
                  : <button onClick={()=>setPlatforms(ps=>{const existing=ps.find(pl=>pl.id===pid);return existing?ps.map(pl=>pl.id===pid?{...pl,connected:true}:pl):[...ps,{id:pid,connected:true}]})} style={{ fontSize:11, color:"#fff", background:`linear-gradient(135deg,${C.accent},${C.accent2})`, border:"none", padding:"7px 14px", borderRadius:8, cursor:"pointer" }}>Connect</button>
                }
              </div>
            );
          })}
        </div>
      )}

      {tab==="profile" && (
        <div className="fade-up" style={{ maxWidth:500 }}>
          {[
            { label:"Full Name",   value:persona.name,  type:"text"  },
            { label:"Shop Name",   value:persona.shop,  type:"text"  },
            { label:"Email",       value:persona.email, type:"email" },
            { label:"Category",    value:persona.category, type:"text" },
            { label:"Short Bio",   value:persona.bio,   type:"textarea" },
          ].map(f=>(
            <div key={f.label} style={{ marginBottom:16 }}>
              <div style={{ fontSize:11, color:C.muted, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:8 }}>{f.label}</div>
              {f.type==="textarea"
                ? <textarea defaultValue={f.value} rows={3} style={{ width:"100%", background:C.surface2, border:`1px solid ${C.border2}`, borderRadius:9, padding:"9px 12px", color:C.text, fontSize:13, outline:"none", resize:"none", fontFamily:"'DM Sans',sans-serif" }} />
                : <input defaultValue={f.value} type={f.type} style={{ width:"100%", background:C.surface2, border:`1px solid ${C.border2}`, borderRadius:9, padding:"9px 12px", color:C.text, fontSize:13, outline:"none" }} />
              }
            </div>
          ))}
          <button style={{ background:`linear-gradient(135deg,${C.accent},${C.accent2})`, border:"none", color:"#fff", fontSize:13, fontWeight:700, padding:"10px 24px", borderRadius:9, cursor:"pointer" }}>Save Changes</button>
        </div>
      )}

      {tab==="billing" && (
        <div className="fade-up" style={{ maxWidth:560 }}>
          <div style={{ background:`${persona.planColor}18`, border:`1px solid ${persona.planColor}44`, borderRadius:14, padding:"20px 22px", marginBottom:20 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
              <div>
                <div style={{ fontSize:10, color:persona.planColor, textTransform:"uppercase", letterSpacing:"0.09em", fontWeight:700, marginBottom:4 }}>Current Plan</div>
                <div style={{ fontFamily:"'Syne',sans-serif", fontSize:22, fontWeight:800, color:C.text, textTransform:"capitalize" }}>{persona.plan}</div>
                <div style={{ fontSize:12, color:C.muted, marginTop:4 }}>${persona.plan==="starter"?49:persona.plan==="growth"?149:349}/month · Renews March 1</div>
              </div>
              <a href={STRIPE_LINKS[persona.plan]} target="_blank" rel="noopener noreferrer" style={{ fontSize:11, color:"#fff", background:`linear-gradient(135deg,${C.accent},${C.accent2})`, border:"none", padding:"8px 16px", borderRadius:8, cursor:"pointer", textDecoration:"none" }}>Manage Plan</a>
            </div>
          </div>
          {persona.plan !== "pro" && (
            <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:14, padding:"18px 20px" }}>
              <div style={{ fontSize:13, fontWeight:700, color:C.text, marginBottom:4 }}>Upgrade to {persona.plan==="starter"?"Growth":"Pro"}</div>
              <div style={{ fontSize:12, color:C.muted, marginBottom:14 }}>
                {persona.plan==="starter"
                  ? "Unlock real-time Live Companion, AI weekly briefings, and SMS campaigns."
                  : "Unlock Instagram DM automation, AI churn narratives, and multi-platform attribution."}
              </div>
              <a href={persona.plan==="starter" ? STRIPE_LINKS.growth : STRIPE_LINKS.pro} target="_blank" rel="noopener noreferrer" style={{ display:"inline-block", background:`linear-gradient(135deg,${C.accent},${C.accent2})`, border:"none", color:"#fff", fontSize:12, fontWeight:700, padding:"9px 20px", borderRadius:9, cursor:"pointer", textDecoration:"none" }}>
                Upgrade — ${persona.plan==="starter"?149:349}/mo
              </a>
            </div>
          )}
        </div>
      )}

      {tab==="team" && (
        <div className="fade-up" style={{ maxWidth:560 }}>
          <div style={{ fontSize:12, color:C.muted, marginBottom:20 }}>Invite your VA or co-host to access Streamlive with limited permissions.</div>
          <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, padding:"14px 18px", marginBottom:16, display:"flex", alignItems:"center", gap:12 }}>
            <Avatar initials={persona.avatar} color={persona.planColor} size={34} />
            <div style={{ flex:1 }}>
              <div style={{ fontSize:13, fontWeight:600, color:C.text }}>{persona.name} (you)</div>
              <div style={{ fontSize:11, color:C.muted }}>{persona.email}</div>
            </div>
            <span style={{ fontSize:10, color:C.green, background:"#0a1e16", border:`1px solid ${C.green}44`, padding:"3px 9px", borderRadius:6, fontWeight:700 }}>OWNER</span>
          </div>
          <div style={{ display:"flex", gap:10 }}>
            <input placeholder="Invite by email address…" style={{ flex:1, background:C.surface2, border:`1px solid ${C.border2}`, borderRadius:9, padding:"9px 12px", color:C.text, fontSize:12, outline:"none" }} />
            <button style={{ background:`linear-gradient(135deg,${C.accent},${C.accent2})`, border:"none", color:"#fff", fontSize:12, fontWeight:700, padding:"9px 18px", borderRadius:9, cursor:"pointer" }}>Invite</button>
          </div>
        </div>
      )}
    </div>
  );
}


// ─── SCREEN: CATALOG ──────────────────────────────────────────────────────────
function ScreenCatalog({ persona, navigate }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [products, setProducts] = useState(PRODUCTS);
  const [syncPulse, setSyncPulse] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState("all");

  const toggleShowReady = (id) => {
    setProducts(ps => ps.map(p => p.id===id ? {...p, showReady:!p.showReady} : p));
  };

  const filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter==="all" || (filter==="show-ready" && p.showReady) || (filter==="not-ready" && !p.showReady);
    const matchPlatform = selectedPlatform==="all" || p.platforms.includes(selectedPlatform);
    return matchSearch && matchFilter && matchPlatform;
  });

  const showReadyCount = products.filter(p=>p.showReady).length;

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100%", overflow:"hidden" }}>
      {/* HEADER */}
      <div style={{ padding:"16px 28px 12px", borderBottom:`1px solid ${C.border}`, flexShrink:0, background:C.surface }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
          <div>
            <div style={{ fontFamily:"'Syne',sans-serif", fontSize:18, fontWeight:800, color:C.text, letterSpacing:"-0.3px" }}>Shopify Catalog</div>
            <div style={{ fontSize:11, color:C.muted, marginTop:2 }}>{products.length} products synced · {showReadyCount} show-ready · Last sync 4 min ago</div>
          </div>
          <div style={{ display:"flex", gap:8 }}>
            <button onClick={()=>navigate("show-planner")} style={{ background:`linear-gradient(135deg,${C.accent},${C.accent2})`, border:"none", color:"#fff", fontSize:12, fontWeight:700, padding:"8px 18px", borderRadius:9, cursor:"pointer" }}>
              + Plan a Show
            </button>
            <button onClick={()=>{ setSyncPulse(true); setTimeout(()=>setSyncPulse(false),2000); }} style={{ background:C.surface2, border:`1px solid ${C.border2}`, color:syncPulse?C.green:C.muted, fontSize:12, fontWeight:600, padding:"8px 14px", borderRadius:9, cursor:"pointer" }}>
              {syncPulse ? "✓ Synced!" : "↻ Sync Shopify"}
            </button>
          </div>
        </div>

        {/* STATS ROW */}
        <div style={{ display:"flex", gap:16, marginBottom:12 }}>
          {[
            { label:"Total Products",  value:products.length,       color:C.accent },
            { label:"Show-Ready",       value:showReadyCount,         color:C.green  },
            { label:"Low Stock (<5)",   value:products.filter(p=>p.inventory<5).length, color:C.amber },
            { label:"Avg AI Score",     value:(products.reduce((a,p)=>a+p.aiScore,0)/products.length).toFixed(1), color:"#a78bfa" },
          ].map(s=>(
            <div key={s.label} style={{ background:C.surface2, border:`1px solid ${C.border}`, borderRadius:9, padding:"8px 14px", display:"flex", gap:10, alignItems:"center" }}>
              <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:16, fontWeight:700, color:s.color }}>{s.value}</span>
              <span style={{ fontSize:10, color:C.muted }}>{s.label}</span>
            </div>
          ))}
        </div>

        {/* FILTERS */}
        <div style={{ display:"flex", gap:10, alignItems:"center" }}>
          <div style={{ flex:1, display:"flex", alignItems:"center", gap:8, background:C.surface2, border:`1px solid ${C.border2}`, borderRadius:8, padding:"7px 12px" }}>
            <span style={{ color:C.subtle }}>🔍</span>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search products or SKU..." style={{ flex:1, background:"none", border:"none", color:C.text, fontSize:12, outline:"none" }} />
          </div>
          {["all","show-ready","not-ready"].map(f=>(
            <button key={f} onClick={()=>setFilter(f)} style={{ background:"none", border:"none", borderBottom:`2px solid ${filter===f?C.accent:"transparent"}`, color:filter===f?"#a78bfa":C.muted, fontSize:12, fontWeight:filter===f?700:400, padding:"4px 12px 8px", cursor:"pointer" }}>
              {f==="all"?"All":f==="show-ready"?"Show-Ready":"Not Ready"}
            </button>
          ))}
          <div style={{ width:1, height:20, background:C.border }} />
          {["all","WN","TT","AM","IG"].map(pl=>{
            const color = pl==="all"?C.muted:PLATFORMS[pl]?.color;
            return (
              <button key={pl} onClick={()=>setSelectedPlatform(pl)} style={{ fontSize:10, fontWeight:700, color:selectedPlatform===pl?color:"#4b5563", background:selectedPlatform===pl?`${color}18`:"transparent", border:`1px solid ${selectedPlatform===pl?color+"44":C.border}`, padding:"4px 10px", borderRadius:6, cursor:"pointer" }}>
                {pl==="all"?"All Platforms":pl}
              </button>
            );
          })}
        </div>
      </div>

      {/* PRODUCT GRID */}
      <div style={{ flex:1, overflowY:"auto", padding:"16px 28px" }}>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12 }}>
          {filtered.map(p=>(
            <div key={p.id} style={{ background:C.surface, border:`1px solid ${p.showReady?C.accent+"44":C.border}`, borderRadius:14, padding:"16px", transition:"border-color .15s" }}>
              {/* TOP */}
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
                <div style={{ width:42, height:42, borderRadius:10, background:`${C.accent}18`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22 }}>{p.image}</div>
                <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:4 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:5 }}>
                    <span style={{ fontSize:9, color:"#a78bfa" }}>AI Score</span>
                    <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:12, fontWeight:700, color:p.aiScore>=9?"#10b981":p.aiScore>=7.5?"#a78bfa":C.amber }}>{p.aiScore}</span>
                  </div>
                  <span style={{ fontSize:8, fontWeight:700, color:C.muted, background:C.surface2, padding:"2px 6px", borderRadius:4, textTransform:"uppercase" }}>{p.category}</span>
                </div>
              </div>

              {/* NAME + SKU */}
              <div style={{ fontSize:13, fontWeight:700, color:C.text, marginBottom:3, lineHeight:1.3 }}>{p.name}</div>
              <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10, color:C.subtle, marginBottom:10 }}>{p.sku}</div>

              {/* PRICE + INVENTORY */}
              <div style={{ display:"flex", gap:12, marginBottom:10 }}>
                <div>
                  <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:16, fontWeight:700, color:C.text }}>${p.price}</div>
                  <div style={{ fontSize:9, color:C.muted }}>price</div>
                </div>
                <div>
                  <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:16, fontWeight:700, color:p.inventory<5?C.amber:C.text }}>{p.inventory}</div>
                  <div style={{ fontSize:9, color:C.muted }}>in stock</div>
                </div>
                <div>
                  <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:16, fontWeight:700, color:C.green }}>{p.soldLast30}</div>
                  <div style={{ fontSize:9, color:C.muted }}>sold/30d</div>
                </div>
              </div>

              {/* PLATFORMS */}
              <div style={{ display:"flex", gap:4, marginBottom:12, flexWrap:"wrap" }}>
                {p.platforms.map(pl=><PlatformPill key={pl} code={pl} />)}
              </div>

              {/* SHOW-READY TOGGLE */}
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", paddingTop:10, borderTop:`1px solid ${C.border}` }}>
                <span style={{ fontSize:11, color:p.showReady?C.green:C.muted, fontWeight:600 }}>
                  {p.showReady ? "✓ Show-Ready" : "Not in rotation"}
                </span>
                <div onClick={()=>toggleShowReady(p.id)} style={{ width:40, height:22, borderRadius:11, background:p.showReady?C.accent:C.border2, cursor:"pointer", position:"relative", transition:"background .2s", flexShrink:0 }}>
                  <div style={{ position:"absolute", top:3, left:p.showReady?20:3, width:16, height:16, borderRadius:"50%", background:"#fff", transition:"left .2s", boxShadow:"0 1px 3px rgba(0,0,0,.3)" }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── SCREEN: SHOW PLANNER ─────────────────────────────────────────────────────
function ScreenShowPlanner({ navigate }) {
  const [step, setStep] = useState(1);
  const [selectedProducts, setSelectedProducts] = useState(
    UPCOMING_SHOW.aiSuggestedOrder.map(id=>PRODUCTS.find(p=>p.id===id)).filter(Boolean)
  );
  const [runOrder, setRunOrder] = useState(
    UPCOMING_SHOW.aiSuggestedOrder.map(id=>PRODUCTS.find(p=>p.id===id)).filter(Boolean)
  );
  const [perks, setPerks] = useState({
    earlyAccess: true, earlyMinutes: 15,
    newBuyerDiscount: true, newBuyerPct: 10,
    vipFirstPick: true,
    doublePoints: false,
    mysteryBonus: true, mysteryThreshold: 3,
  });
  const [dragIdx, setDragIdx] = useState(null);
  const [overIdx, setOverIdx] = useState(null);
  const [rules, setRules] = useState([
    { id:"r1", enabled:true,  trigger:"buyer_tier",     triggerVal:"vip",    action:"apply_discount", actionVal:"15", label:"If buyer is VIP → 15% discount" },
    { id:"r2", enabled:true,  trigger:"first_purchase", triggerVal:"true",   action:"apply_discount", actionVal:"10", label:"If first-time buyer → 10% discount" },
    { id:"r3", enabled:false, trigger:"order_count",    triggerVal:"3",      action:"add_perk",       actionVal:"mysteryItem", label:"If 3+ items ordered → Mystery Bonus" },
    { id:"r4", enabled:false, trigger:"buyer_tier",     triggerVal:"gold",   action:"add_perk",       actionVal:"bonusPoints", label:"If buyer is Gold → 2× Points" },
    { id:"r5", enabled:false, trigger:"spend_lifetime", triggerVal:"500",    action:"apply_discount", actionVal:"5",  label:"If lifetime spend $500+ → 5% off" },
  ]);
  const [showRuleBuilder, setShowRuleBuilder] = useState(false);
  const [newRule, setNewRule] = useState({ trigger:"buyer_tier", triggerVal:"vip", action:"apply_discount", actionVal:"10" });

  const TRIGGER_OPTIONS = [
    { value:"buyer_tier",     label:"Buyer tier is",          vals:[{v:"bronze",l:"Bronze"},{v:"silver",l:"Silver"},{v:"gold",l:"Gold"},{v:"vip",l:"VIP"}] },
    { value:"first_purchase", label:"First-time buyer",        vals:[{v:"true",l:"Yes"}] },
    { value:"order_count",    label:"Items ordered ≥",         vals:[{v:"2",l:"2"},{v:"3",l:"3"},{v:"5",l:"5"}] },
    { value:"spend_lifetime", label:"Lifetime spend ≥ $",      vals:[{v:"100",l:"$100"},{v:"250",l:"$250"},{v:"500",l:"$500"},{v:"1000",l:"$1,000"}] },
    { value:"platform",       label:"Platform is",             vals:[{v:"WN",l:"Whatnot"},{v:"TT",l:"TikTok"},{v:"AM",l:"Amazon"},{v:"IG",l:"Instagram"}] },
  ];
  const ACTION_OPTIONS = [
    { value:"apply_discount", label:"Apply discount",  vals:[{v:"5",l:"5%"},{v:"10",l:"10%"},{v:"15",l:"15%"},{v:"20",l:"20%"},{v:"25",l:"25%"}] },
    { value:"add_perk",       label:"Grant perk",      vals:[{v:"bonusPoints",l:"2× Points"},{v:"mysteryItem",l:"Mystery Bonus"},{v:"freeShipping",l:"Free Shipping"},{v:"firstPick",l:"First Pick"}] },
    { value:"add_item",       label:"Add catalog item", vals:PRODUCTS.filter(p=>p.showReady).map(p=>({v:p.id,l:p.name.slice(0,24)})) },
  ];

  const addRule = () => {
    const tOpt = TRIGGER_OPTIONS.find(t=>t.value===newRule.trigger);
    const aOpt = ACTION_OPTIONS.find(a=>a.value===newRule.action);
    const tLabel = tOpt?.label || newRule.trigger;
    const aLabel = aOpt?.label || newRule.action;
    const tValLabel = tOpt?.vals.find(v=>v.v===newRule.triggerVal)?.l || newRule.triggerVal;
    const aValLabel = aOpt?.vals.find(v=>v.v===newRule.actionVal)?.l  || newRule.actionVal;
    setRules(r=>[...r, { id:`r${Date.now()}`, enabled:true, ...newRule, label:`If ${tLabel} ${tValLabel} → ${aLabel} ${aValLabel}` }]);
    setShowRuleBuilder(false);
  };
  const toggleRule   = (id) => setRules(rs=>rs.map(r=>r.id===id?{...r,enabled:!r.enabled}:r));
  const deleteRule   = (id) => setRules(rs=>rs.filter(r=>r.id!==id));

  const moveUp   = (i) => { if(i===0) return; const a=[...runOrder]; [a[i-1],a[i]]=[a[i],a[i-1]]; setRunOrder(a); };
  const moveDown = (i) => { if(i===runOrder.length-1) return; const a=[...runOrder]; [a[i],a[i+1]]=[a[i+1],a[i]]; setRunOrder(a); };
  const remove   = (i) => setRunOrder(r=>r.filter((_,idx)=>idx!==i));

  const showReadyProducts = PRODUCTS.filter(p=>p.showReady);

  const steps = ["Select Products","Set Run Order","Show Perks","Automation Rules","Review & Go Live"];

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100%", overflow:"hidden" }}>
      {/* HEADER */}
      <div style={{ padding:"16px 28px", borderBottom:`1px solid ${C.border}`, flexShrink:0, background:C.surface }}>
        <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:14 }}>
          <button onClick={()=>navigate("shows")} style={{ fontSize:11, color:C.muted, background:"none", border:"none", cursor:"pointer", padding:0 }}>← Back</button>
          <div style={{ fontFamily:"'Syne',sans-serif", fontSize:18, fontWeight:800, color:C.text }}>Show Planner</div>
          <div style={{ marginLeft:"auto" }}>
            <PlatformPill code={UPCOMING_SHOW.platform} />
          </div>
        </div>
        <div style={{ fontSize:12, color:C.muted, marginBottom:14 }}>{UPCOMING_SHOW.title} · {UPCOMING_SHOW.date} at {UPCOMING_SHOW.time}</div>

        {/* STEP PROGRESS */}
        <div style={{ display:"flex", gap:0 }}>
          {steps.map((s,i)=>(
            <div key={s} style={{ display:"flex", alignItems:"center" }}>
              <button onClick={()=>setStep(i+1)} style={{ display:"flex", alignItems:"center", gap:7, background:"none", border:"none", cursor:"pointer", padding:"0 4px" }}>
                <div style={{ width:22, height:22, borderRadius:"50%", background:step>i+1?C.green:step===i+1?C.accent:C.surface2, border:`2px solid ${step>i+1?C.green:step===i+1?C.accent:C.border2}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:700, color:step>=i+1?"#fff":C.subtle, flexShrink:0 }}>
                  {step>i+1?"✓":i+1}
                </div>
                <span style={{ fontSize:11, fontWeight:step===i+1?700:400, color:step===i+1?C.text:C.muted, whiteSpace:"nowrap" }}>{s}</span>
              </button>
              {i<steps.length-1 && <div style={{ width:32, height:1, background:step>i+1?C.green:C.border, margin:"0 4px" }} />}
            </div>
          ))}
        </div>
      </div>

      {/* STEP CONTENT */}
      <div style={{ flex:1, overflowY:"auto", padding:"24px 28px" }}>

        {/* STEP 1: SELECT PRODUCTS */}
        {step===1 && (
          <div className="fade-up">
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
              <div>
                <div style={{ fontSize:14, fontWeight:700, color:C.text, marginBottom:4 }}>Choose products for this show</div>
                <div style={{ fontSize:12, color:C.muted }}>{selectedProducts.length} selected · AI recommends your show-ready items ranked by performance</div>
              </div>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
              {showReadyProducts.map(p=>{
                const sel = selectedProducts.find(s=>s.id===p.id);
                return (
                  <div key={p.id} onClick={()=>{ setSelectedProducts(prev=>sel?prev.filter(s=>s.id!==p.id):[...prev,p]); setRunOrder(prev=>sel?prev.filter(s=>s.id!==p.id):[...prev,p]); }} style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 14px", background:sel?`${C.accent}12`:C.surface, border:`1px solid ${sel?C.accent+"55":C.border}`, borderRadius:12, cursor:"pointer", transition:"all .15s" }}>
                    <div style={{ fontSize:20 }}>{p.image}</div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:12, fontWeight:600, color:C.text, marginBottom:2 }}>{p.name}</div>
                      <div style={{ display:"flex", gap:8 }}>
                        <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:11, color:C.green }}>${p.price}</span>
                        <span style={{ fontSize:10, color:C.muted }}>{p.inventory} in stock</span>
                        <span style={{ fontSize:10, color:"#a78bfa" }}>AI: {p.aiScore}</span>
                      </div>
                    </div>
                    <div style={{ width:20, height:20, borderRadius:"50%", background:sel?C.accent:C.surface2, border:`2px solid ${sel?C.accent:C.border2}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, color:"#fff", flexShrink:0 }}>
                      {sel?"✓":""}
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{ marginTop:20, display:"flex", justifyContent:"flex-end" }}>
              <button onClick={()=>setStep(2)} disabled={selectedProducts.length===0} style={{ background:`linear-gradient(135deg,${C.accent},${C.accent2})`, border:"none", color:"#fff", fontSize:13, fontWeight:700, padding:"10px 28px", borderRadius:10, cursor:"pointer", opacity:selectedProducts.length===0?0.4:1 }}>
                Set Run Order ({selectedProducts.length} products) →
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: RUN ORDER */}
        {step===2 && (
          <div className="fade-up">
            <div style={{ display:"grid", gridTemplateColumns:"1fr 340px", gap:20 }}>
              {/* ORDERED LIST */}
              <div>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
                  <div>
                    <div style={{ fontSize:14, fontWeight:700, color:C.text, marginBottom:3 }}>Drag to reorder your run-of-show</div>
                    <div style={{ fontSize:11, color:C.muted }}>AI sorted by predicted sales performance. Reorder as you like.</div>
                  </div>
                </div>
                {runOrder.map((p,i)=>(
                  <div key={p.id} style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 14px", background:C.surface, border:`1px solid ${C.border}`, borderRadius:11, marginBottom:8 }}>
                    <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:13, fontWeight:700, color:C.accent, width:24, textAlign:"center", flexShrink:0 }}>{i+1}</div>
                    <div style={{ fontSize:18, flexShrink:0 }}>{p.image}</div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:12, fontWeight:600, color:C.text }}>{p.name}</div>
                      <div style={{ fontSize:10, color:C.muted }}>${p.price} · {p.inventory} in stock · AI: {p.aiScore}</div>
                    </div>
                    <div style={{ display:"flex", gap:4 }}>
                      <button onClick={()=>moveUp(i)} style={{ background:C.surface2, border:`1px solid ${C.border}`, color:C.muted, fontSize:11, width:26, height:26, borderRadius:6, cursor:"pointer" }}>↑</button>
                      <button onClick={()=>moveDown(i)} style={{ background:C.surface2, border:`1px solid ${C.border}`, color:C.muted, fontSize:11, width:26, height:26, borderRadius:6, cursor:"pointer" }}>↓</button>
                      <button onClick={()=>remove(i)} style={{ background:"#1c0f0f", border:"1px solid #ef444433", color:"#f87171", fontSize:11, width:26, height:26, borderRadius:6, cursor:"pointer" }}>✕</button>
                    </div>
                  </div>
                ))}
              </div>

              {/* AI INSIGHT PANEL */}
              <div>
                <div style={{ background:"#2d1f5e18", border:`1px solid ${C.accent}33`, borderRadius:14, padding:"16px 18px", marginBottom:14 }}>
                  <div style={{ fontSize:10, fontWeight:700, color:"#a78bfa", textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:10 }}>✦ AI Show Strategy</div>
                  <div style={{ fontSize:12, color:"#9ca3af", lineHeight:1.65 }}>
                    Opening with the Mystery Box is your highest-converting cold opener — it drives 7.2 units/show on average. 
                    Following with Luka RC creates urgency early while buyers are most engaged. 
                    Save the Vintage Wax Box for the 90-min mark when your VIP core is still active.
                  </div>
                </div>
                <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:14, padding:"16px 18px" }}>
                  <div style={{ fontSize:10, fontWeight:700, color:C.muted, textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:10 }}>Projected Show Performance</div>
                  {[
                    { label:"Est. GMV",      value:`$${UPCOMING_SHOW.estimatedGMV.toLocaleString()}`, color:C.green },
                    { label:"Est. Buyers",   value:UPCOMING_SHOW.estimatedBuyers,                     color:C.text },
                    { label:"Products",      value:runOrder.length,                                   color:"#a78bfa" },
                    { label:"Est. Duration", value:`${Math.round(runOrder.length*12)} min`,           color:C.muted },
                  ].map(m=>(
                    <div key={m.label} style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
                      <span style={{ fontSize:12, color:C.muted }}>{m.label}</span>
                      <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:13, fontWeight:700, color:m.color }}>{m.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div style={{ marginTop:20, display:"flex", gap:10, justifyContent:"flex-end" }}>
              <button onClick={()=>setStep(1)} style={{ background:C.surface, border:`1px solid ${C.border}`, color:C.muted, fontSize:12, fontWeight:600, padding:"9px 20px", borderRadius:9, cursor:"pointer" }}>← Back</button>
              <button onClick={()=>setStep(3)} style={{ background:`linear-gradient(135deg,${C.accent},${C.accent2})`, border:"none", color:"#fff", fontSize:13, fontWeight:700, padding:"10px 28px", borderRadius:10, cursor:"pointer" }}>Set Show Perks →</button>
            </div>
          </div>
        )}

        {/* STEP 3: PERKS */}
        {step===3 && (
          <div className="fade-up" style={{ maxWidth:680 }}>
            <div style={{ fontSize:14, fontWeight:700, color:C.text, marginBottom:4 }}>Configure perks for this show</div>
            <div style={{ fontSize:12, color:C.muted, marginBottom:20 }}>These apply only to this show. Your default loyalty tiers always apply.</div>

            {[
              { key:"earlyAccess",     icon:"⏰", title:"VIP Early Access",           desc:"Let VIP buyers into the show early",          extra: perks.earlyAccess && <div style={{ display:"flex", alignItems:"center", gap:8, marginTop:8 }}><span style={{ fontSize:11, color:C.muted }}>Minutes early:</span>{[5,10,15,30].map(m=><button key={m} onClick={()=>setPerks(p=>({...p,earlyMinutes:m}))} style={{ fontSize:11, fontWeight:perks.earlyMinutes===m?700:400, color:perks.earlyMinutes===m?"#fff":C.muted, background:perks.earlyMinutes===m?C.accent:C.surface2, border:`1px solid ${perks.earlyMinutes===m?C.accent:C.border}`, padding:"3px 10px", borderRadius:6, cursor:"pointer" }}>{m}</button>)}</div> },
              { key:"newBuyerDiscount",icon:"🎁", title:"New Buyer Welcome Discount",  desc:"First-time buyers get an instant discount",  extra: perks.newBuyerDiscount && <div style={{ display:"flex", alignItems:"center", gap:8, marginTop:8 }}><span style={{ fontSize:11, color:C.muted }}>Discount:</span>{[5,10,15,20].map(p=><button key={p} onClick={()=>setPerks(pr=>({...pr,newBuyerPct:p}))} style={{ fontSize:11, fontWeight:perks.newBuyerPct===p?700:400, color:perks.newBuyerPct===p?"#fff":C.muted, background:perks.newBuyerPct===p?C.green:C.surface2, border:`1px solid ${perks.newBuyerPct===p?C.green:C.border}`, padding:"3px 10px", borderRadius:6, cursor:"pointer" }}>{p}%</button>)}</div> },
              { key:"vipFirstPick",    icon:"👑", title:"VIP First Pick",              desc:"VIP tier buyers get first pick on limited items", extra:null },
              { key:"doublePoints",    icon:"⚡", title:"Double Points Show",          desc:"All buyers earn 2× loyalty points tonight",   extra:null },
              { key:"mysteryBonus",    icon:"🎲", title:"Mystery Bonus at Threshold",  desc:"Buyers who purchase X+ items get a mystery bonus", extra: perks.mysteryBonus && <div style={{ display:"flex", alignItems:"center", gap:8, marginTop:8 }}><span style={{ fontSize:11, color:C.muted }}>Trigger at:</span>{[2,3,4,5].map(n=><button key={n} onClick={()=>setPerks(p=>({...p,mysteryThreshold:n}))} style={{ fontSize:11, fontWeight:perks.mysteryThreshold===n?700:400, color:perks.mysteryThreshold===n?"#fff":C.muted, background:perks.mysteryThreshold===n?C.amber:C.surface2, border:`1px solid ${perks.mysteryThreshold===n?C.amber:C.border}`, padding:"3px 10px", borderRadius:6, cursor:"pointer" }}>{n}+ items</button>)}</div> },
            ].map(perk=>(
              <div key={perk.key} style={{ background:perks[perk.key]?`${C.accent}08`:C.surface, border:`1px solid ${perks[perk.key]?C.accent+"44":C.border}`, borderRadius:13, padding:"14px 16px", marginBottom:10 }}>
                <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                  <div style={{ width:36, height:36, borderRadius:9, background:perks[perk.key]?`${C.accent}22`:C.surface2, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, flexShrink:0 }}>{perk.icon}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:13, fontWeight:700, color:C.text }}>{perk.title}</div>
                    <div style={{ fontSize:11, color:C.muted }}>{perk.desc}</div>
                  </div>
                  <div onClick={()=>setPerks(p=>({...p,[perk.key]:!p[perk.key]}))} style={{ width:40, height:22, borderRadius:11, background:perks[perk.key]?C.accent:C.border2, cursor:"pointer", position:"relative", transition:"background .2s", flexShrink:0 }}>
                    <div style={{ position:"absolute", top:3, left:perks[perk.key]?20:3, width:16, height:16, borderRadius:"50%", background:"#fff", transition:"left .2s", boxShadow:"0 1px 3px rgba(0,0,0,.3)" }} />
                  </div>
                </div>
                {perk.extra}
              </div>
            ))}

            <div style={{ marginTop:20, display:"flex", gap:10, justifyContent:"flex-end" }}>
              <button onClick={()=>setStep(2)} style={{ background:C.surface, border:`1px solid ${C.border}`, color:C.muted, fontSize:12, fontWeight:600, padding:"9px 20px", borderRadius:9, cursor:"pointer" }}>← Back</button>
              <button onClick={()=>setStep(4)} style={{ background:`linear-gradient(135deg,${C.accent},${C.accent2})`, border:"none", color:"#fff", fontSize:13, fontWeight:700, padding:"10px 28px", borderRadius:10, cursor:"pointer" }}>Review & Confirm →</button>
            </div>
          </div>
        )}

        {/* STEP 4: AUTOMATION RULES */}
        {step===4 && (
          <div className="fade-up" style={{ maxWidth:700 }}>
            <div style={{ fontSize:14, fontWeight:700, color:C.text, marginBottom:4 }}>Set automation rules for this show</div>
            <div style={{ fontSize:12, color:C.muted, marginBottom:20 }}>Rules run automatically as orders come in during the live. You can still override any buyer manually.</div>

            {/* ACTIVE RULES LIST */}
            {rules.map(r=>(
              <div key={r.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 16px", background:r.enabled?`${C.accent}08`:C.surface, border:`1px solid ${r.enabled?C.accent+"33":C.border}`, borderRadius:11, marginBottom:8 }}>
                <div style={{ width:10, height:10, borderRadius:"50%", background:r.enabled?C.green:C.border2, flexShrink:0 }} />
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:12, fontWeight:600, color:r.enabled?C.text:C.muted }}>{r.label}</div>
                  <div style={{ fontSize:10, color:C.subtle, marginTop:2 }}>
                    {r.action==="apply_discount"?`Discount: ${r.actionVal}%`:r.action==="add_perk"?`Perk: ${r.actionVal}`:`Item: ${PRODUCTS.find(p=>p.id===r.actionVal)?.name||r.actionVal}`}
                  </div>
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <div onClick={()=>toggleRule(r.id)} style={{ width:36, height:20, borderRadius:10, background:r.enabled?C.accent:C.border2, cursor:"pointer", position:"relative", transition:"background .2s", flexShrink:0 }}>
                    <div style={{ position:"absolute", top:2, left:r.enabled?17:2, width:16, height:16, borderRadius:"50%", background:"#fff", transition:"left .2s" }} />
                  </div>
                  <button onClick={()=>deleteRule(r.id)} style={{ background:"none", border:"none", color:"#4b5563", fontSize:14, cursor:"pointer", padding:"0 4px" }}>✕</button>
                </div>
              </div>
            ))}

            {/* ADD RULE BUTTON */}
            {!showRuleBuilder ? (
              <button onClick={()=>setShowRuleBuilder(true)} style={{ width:"100%", background:"none", border:`2px dashed ${C.border2}`, color:C.muted, fontSize:12, fontWeight:600, padding:"11px", borderRadius:11, cursor:"pointer", marginTop:4 }}>
                + Add Rule
              </button>
            ) : (
              <div style={{ background:C.surface, border:`1px solid ${C.accent}44`, borderRadius:13, padding:"16px 18px", marginTop:8 }}>
                <div style={{ fontSize:11, fontWeight:700, color:C.text, marginBottom:14, textTransform:"uppercase", letterSpacing:"0.06em" }}>New Rule</div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr auto 1fr", gap:10, alignItems:"center", marginBottom:14 }}>
                  {/* TRIGGER */}
                  <div>
                    <div style={{ fontSize:10, color:C.muted, marginBottom:5, fontWeight:700, textTransform:"uppercase" }}>If...</div>
                    <select value={newRule.trigger} onChange={e=>setNewRule(r=>({...r,trigger:e.target.value,triggerVal:TRIGGER_OPTIONS.find(t=>t.value===e.target.value)?.vals[0]?.v||""}))}
                      style={{ width:"100%", background:C.surface2, border:`1px solid ${C.border2}`, borderRadius:8, padding:"7px 10px", color:C.text, fontSize:11, outline:"none", marginBottom:6 }}>
                      {TRIGGER_OPTIONS.map(t=><option key={t.value} value={t.value}>{t.label}</option>)}
                    </select>
                    <select value={newRule.triggerVal} onChange={e=>setNewRule(r=>({...r,triggerVal:e.target.value}))}
                      style={{ width:"100%", background:C.surface2, border:`1px solid ${C.border2}`, borderRadius:8, padding:"7px 10px", color:C.text, fontSize:11, outline:"none" }}>
                      {(TRIGGER_OPTIONS.find(t=>t.value===newRule.trigger)?.vals||[]).map(v=><option key={v.v} value={v.v}>{v.l}</option>)}
                    </select>
                  </div>
                  <div style={{ fontSize:18, color:C.accent, fontWeight:700, paddingTop:20 }}>→</div>
                  {/* ACTION */}
                  <div>
                    <div style={{ fontSize:10, color:C.muted, marginBottom:5, fontWeight:700, textTransform:"uppercase" }}>Then...</div>
                    <select value={newRule.action} onChange={e=>setNewRule(r=>({...r,action:e.target.value,actionVal:ACTION_OPTIONS.find(a=>a.value===e.target.value)?.vals[0]?.v||""}))}
                      style={{ width:"100%", background:C.surface2, border:`1px solid ${C.border2}`, borderRadius:8, padding:"7px 10px", color:C.text, fontSize:11, outline:"none", marginBottom:6 }}>
                      {ACTION_OPTIONS.map(a=><option key={a.value} value={a.value}>{a.label}</option>)}
                    </select>
                    <select value={newRule.actionVal} onChange={e=>setNewRule(r=>({...r,actionVal:e.target.value}))}
                      style={{ width:"100%", background:C.surface2, border:`1px solid ${C.border2}`, borderRadius:8, padding:"7px 10px", color:C.text, fontSize:11, outline:"none" }}>
                      {(ACTION_OPTIONS.find(a=>a.value===newRule.action)?.vals||[]).map(v=><option key={v.v} value={v.v}>{v.l}</option>)}
                    </select>
                  </div>
                </div>
                <div style={{ display:"flex", gap:8 }}>
                  <button onClick={()=>setShowRuleBuilder(false)} style={{ flex:0, background:C.surface2, border:`1px solid ${C.border}`, color:C.muted, fontSize:12, fontWeight:600, padding:"8px 16px", borderRadius:8, cursor:"pointer" }}>Cancel</button>
                  <button onClick={addRule} style={{ flex:1, background:`linear-gradient(135deg,${C.accent},${C.accent2})`, border:"none", color:"#fff", fontSize:12, fontWeight:700, padding:"8px", borderRadius:8, cursor:"pointer" }}>Save Rule</button>
                </div>
              </div>
            )}

            <div style={{ marginTop:20, display:"flex", gap:10, justifyContent:"flex-end" }}>
              <button onClick={()=>setStep(3)} style={{ background:C.surface, border:`1px solid ${C.border}`, color:C.muted, fontSize:12, fontWeight:600, padding:"9px 20px", borderRadius:9, cursor:"pointer" }}>← Back</button>
              <button onClick={()=>setStep(5)} style={{ background:`linear-gradient(135deg,${C.accent},${C.accent2})`, border:"none", color:"#fff", fontSize:13, fontWeight:700, padding:"10px 28px", borderRadius:10, cursor:"pointer" }}>Review & Confirm →</button>
            </div>
          </div>
        )}

        {/* STEP 5: CONFIRM */}
        {step===5 && (
          <div className="fade-up" style={{ maxWidth:620 }}>
            <div style={{ background:"#2d1f5e18", border:`1px solid ${C.accent}44`, borderRadius:16, padding:"22px 24px", marginBottom:16 }}>
              <div style={{ fontSize:12, fontWeight:700, color:C.text, marginBottom:14 }}>Show Summary</div>
              <div style={{ display:"flex", gap:20, marginBottom:14 }}>
                {[
                  { label:"Products",   value:runOrder.length,   color:C.accent },
                  { label:"Est. GMV",   value:`$${UPCOMING_SHOW.estimatedGMV.toLocaleString()}`, color:C.green },
                  { label:"Perks Active", value:Object.values(perks).filter(v=>v===true).length, color:"#a78bfa" },
                ].map(m=>(
                  <div key={m.label} style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:10, padding:"10px 16px" }}>
                    <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:20, fontWeight:700, color:m.color }}>{m.value}</div>
                    <div style={{ fontSize:10, color:C.muted, marginTop:2 }}>{m.label}</div>
                  </div>
                ))}
              </div>
              <div style={{ fontSize:11, color:C.muted, marginBottom:8, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.06em" }}>Run Order</div>
              {runOrder.map((p,i)=>(
                <div key={p.id} style={{ display:"flex", gap:10, alignItems:"center", marginBottom:6 }}>
                  <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:11, color:C.accent, width:18 }}>{i+1}.</span>
                  <span style={{ fontSize:11 }}>{p.image}</span>
                  <span style={{ fontSize:12, color:C.text }}>{p.name}</span>
                  <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:11, color:C.green, marginLeft:"auto" }}>${p.price}</span>
                </div>
              ))}
            </div>
            <div style={{ display:"flex", gap:10 }}>
              <button onClick={()=>setStep(3)} style={{ flex:0, background:C.surface, border:`1px solid ${C.border}`, color:C.muted, fontSize:12, fontWeight:600, padding:"10px 20px", borderRadius:9, cursor:"pointer" }}>← Edit</button>
              <button onClick={()=>navigate("live")} style={{ flex:1, background:"linear-gradient(135deg,#10b981,#059669)", border:"none", color:"#fff", fontSize:14, fontWeight:700, padding:"12px", borderRadius:10, cursor:"pointer" }}>
                🔴 Go Live Now
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── SCREEN: LOYALTY HUB ─────────────────────────────────────────────────────
function ScreenLoyalty({ buyers, navigate, persona }) {
  const [tab, setTab] = useState("overview");

  const buyerLoyalty = buyers.map(b=>({ ...b, loyalty: LOYALTY_BUYERS[b.id] || { points:0, tier:"bronze", pointsToNext:500 } }));
  const tierCounts = LOYALTY_TIERS.map(t=>({ ...t, count: buyerLoyalty.filter(b=>b.loyalty.tier===t.id).length }));
  const totalPoints = buyerLoyalty.reduce((a,b)=>a+b.loyalty.points,0);

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100%", overflow:"hidden" }}>
      {/* HEADER */}
      <div style={{ padding:"16px 28px", borderBottom:`1px solid ${C.border}`, flexShrink:0, background:C.surface }}>
        <div style={{ fontFamily:"'Syne',sans-serif", fontSize:18, fontWeight:800, color:C.text, letterSpacing:"-0.3px", marginBottom:4 }}>Loyalty Hub</div>
        <div style={{ fontSize:11, color:C.muted, marginBottom:14 }}>Manage tiers, points, and perks across {buyers.length} buyers</div>
        <div style={{ display:"flex", gap:0, borderBottom:`1px solid ${C.border}` }}>
          {["overview","tiers","buyers","perks"].map(t=>(
            <button key={t} onClick={()=>setTab(t)} style={{ background:"none", border:"none", borderBottom:`2px solid ${tab===t?C.accent:"transparent"}`, color:tab===t?"#a78bfa":C.muted, fontSize:12, fontWeight:tab===t?700:400, padding:"0 16px 12px", cursor:"pointer", textTransform:"capitalize" }}>{t}</button>
          ))}
        </div>
      </div>

      <div style={{ flex:1, overflowY:"auto", padding:"24px 28px" }}>

        {/* OVERVIEW TAB */}
        {tab==="overview" && (
          <div className="fade-up">
            <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:24 }}>
              {tierCounts.map(t=>(
                <div key={t.id} style={{ background:t.bg, border:`1px solid ${t.color}44`, borderRadius:13, padding:"16px 18px" }}>
                  <div style={{ fontSize:22, marginBottom:8 }}>{t.icon}</div>
                  <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:24, fontWeight:700, color:t.color }}>{t.count}</div>
                  <div style={{ fontSize:11, color:t.color, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.06em" }}>{t.label}</div>
                  <div style={{ fontSize:10, color:C.muted, marginTop:4 }}>{t.id==="bronze"?`0–499`:t.id==="silver"?`500–1,999`:t.id==="gold"?`2,000–4,999`:`5,000+`} pts</div>
                </div>
              ))}
            </div>

            {/* TOP LOYALTY BUYERS */}
            <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:14, padding:"18px 20px", marginBottom:16 }}>
              <div style={{ fontSize:12, fontWeight:700, color:C.text, marginBottom:14 }}>Top Loyalty Buyers</div>
              {buyerLoyalty.sort((a,b)=>b.loyalty.points-a.loyalty.points).slice(0,5).map((b,i)=>{
                const tier = LOYALTY_TIERS.find(t=>t.id===b.loyalty.tier);
                const pl   = PLATFORMS[b.platform];
                const pct  = tier.maxPoints ? Math.round((b.loyalty.points-tier.minPoints)/(tier.maxPoints-tier.minPoints)*100) : 100;
                return (
                  <div key={b.id} onClick={()=>navigate("buyer-profile",{buyerId:b.id})} style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 0", borderBottom:i<4?`1px solid ${C.border}`:"none", cursor:"pointer" }}>
                    <Avatar initials={b.avatar} color={pl?.color} size={30} />
                    <div style={{ flex:1 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
                        <span style={{ fontSize:12, fontWeight:600, color:C.text }}>{b.name}</span>
                        <span style={{ fontSize:10 }}>{tier.icon}</span>
                        <span style={{ fontSize:9, fontWeight:700, color:tier.color, background:tier.bg, padding:"1px 7px", borderRadius:5, textTransform:"uppercase" }}>{tier.label}</span>
                      </div>
                      <div style={{ height:4, background:C.border, borderRadius:2, width:"60%", overflow:"hidden" }}>
                        <div style={{ height:"100%", width:`${pct}%`, background:tier.color, borderRadius:2, transition:"width .3s" }} />
                      </div>
                    </div>
                    <div style={{ textAlign:"right" }}>
                      <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:13, fontWeight:700, color:tier.color }}>{b.loyalty.points.toLocaleString()}</div>
                      <div style={{ fontSize:9, color:C.muted }}>points</div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* PROGRAM STATS */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
              <StatCard label="Total Points Issued" value={totalPoints.toLocaleString()} sub="across all buyers"         color="#a78bfa" />
              <StatCard label="Avg Points/Buyer"    value={Math.round(totalPoints/buyers.length).toLocaleString()} sub="per active buyer" color={C.amber} />
            </div>
          </div>
        )}

        {/* TIERS TAB */}
        {tab==="tiers" && (
          <div className="fade-up">
            <div style={{ fontSize:12, color:C.muted, marginBottom:20 }}>Buyers advance automatically as they accumulate points. 1 point = $1 spent.</div>
            {LOYALTY_TIERS.map(t=>(
              <div key={t.id} style={{ background:t.bg, border:`1px solid ${t.color}44`, borderRadius:14, padding:"18px 20px", marginBottom:12 }}>
                <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:14 }}>
                  <div style={{ fontSize:28 }}>{t.icon}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:15, fontWeight:700, color:t.color }}>{t.label}</div>
                    <div style={{ fontSize:11, color:C.muted }}>{t.minPoints.toLocaleString()}{t.maxPoints?`–${t.maxPoints.toLocaleString()}`:"+"} points · {buyerLoyalty.filter(b=>b.loyalty.tier===t.id).length} buyers</div>
                  </div>
                </div>
                <div style={{ fontSize:10, fontWeight:700, color:C.muted, textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:8 }}>Perks included</div>
                <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
                  {t.perks.map(p=>(
                    <div key={p} style={{ display:"flex", gap:8 }}>
                      <span style={{ color:t.color, fontSize:10, marginTop:1 }}>✓</span>
                      <span style={{ fontSize:12, color:"#9ca3af" }}>{p}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* BUYERS TAB */}
        {tab==="buyers" && (
          <div className="fade-up">
            <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:14, overflow:"hidden" }}>
              <div style={{ display:"grid", gridTemplateColumns:"1.6fr 0.8fr 0.8fr 0.8fr 0.8fr", padding:"10px 20px", borderBottom:`1px solid ${C.border}` }}>
                {["Buyer","Tier","Points","To Next","Last Order"].map(h=><div key={h} style={{ fontSize:10, color:C.muted, textTransform:"uppercase", letterSpacing:"0.07em", fontWeight:700 }}>{h}</div>)}
              </div>
              {buyerLoyalty.sort((a,b)=>b.loyalty.points-a.loyalty.points).map((b,i)=>{
                const tier = LOYALTY_TIERS.find(t=>t.id===b.loyalty.tier);
                const pl   = PLATFORMS[b.platform];
                return (
                  <div key={b.id} onClick={()=>navigate("buyer-profile",{buyerId:b.id})} style={{ display:"grid", gridTemplateColumns:"1.6fr 0.8fr 0.8fr 0.8fr 0.8fr", padding:"11px 20px", borderBottom:i<buyerLoyalty.length-1?`1px solid #0d0d18`:"none", cursor:"pointer", alignItems:"center" }}
                    onMouseEnter={e=>e.currentTarget.style.background=C.surface2}
                    onMouseLeave={e=>e.currentTarget.style.background="transparent"}
                  >
                    <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                      <Avatar initials={b.avatar} color={pl?.color} size={28} />
                      <span style={{ fontSize:12, fontWeight:600, color:C.text }}>{b.name}</span>
                    </div>
                    <div style={{ display:"flex", alignItems:"center", gap:5 }}>
                      <span style={{ fontSize:12 }}>{tier.icon}</span>
                      <span style={{ fontSize:10, fontWeight:700, color:tier.color }}>{tier.label}</span>
                    </div>
                    <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:12, fontWeight:700, color:tier.color }}>{b.loyalty.points.toLocaleString()}</div>
                    <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:11, color:C.muted }}>{tier.maxPoints?b.loyalty.pointsToNext.toLocaleString()+"pts":"MAX"}</div>
                    <div style={{ fontSize:11, color:C.muted }}>{b.lastOrder}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* PERKS TAB */}
        {tab==="perks" && (
          <div className="fade-up" style={{ maxWidth:600 }}>
            <div style={{ fontSize:12, color:C.muted, marginBottom:20 }}>These are your always-on perks. Show-specific perks are configured in the Show Planner.</div>
            {[
              { icon:"🎂", title:"Birthday Discount",       desc:"Auto-sends a discount code on buyer's birthday. Tier-based %.", enabled:true  },
              { icon:"⏰", title:"VIP Early Show Access",   desc:"VIP buyers get notified and admitted before the show opens.",   enabled:true  },
              { icon:"📦", title:"Free Shipping Threshold", desc:"Silver+ buyers get free shipping above their tier threshold.",   enabled:true  },
              { icon:"🎁", title:"New Buyer Welcome Perk",  desc:"First purchase gets a welcome discount + a bonus mystery card.", enabled:true  },
              { icon:"📈", title:"Points Multiplier Events",desc:"Run 2× or 3× points during special shows or holidays.",         enabled:false },
              { icon:"🔔", title:"Win-Back Bonus Points",   desc:"Dormant buyers get bonus points to come back after 45+ days.",  enabled:false },
            ].map(perk=>(
              <div key={perk.title} style={{ display:"flex", alignItems:"center", gap:12, padding:"14px 16px", background:perk.enabled?`${C.accent}08`:C.surface, border:`1px solid ${perk.enabled?C.accent+"33":C.border}`, borderRadius:12, marginBottom:8 }}>
                <div style={{ width:38, height:38, borderRadius:10, background:perk.enabled?`${C.accent}18`:C.surface2, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>{perk.icon}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13, fontWeight:700, color:C.text }}>{perk.title}</div>
                  <div style={{ fontSize:11, color:C.muted, lineHeight:1.5 }}>{perk.desc}</div>
                </div>
                <div style={{ width:40, height:22, borderRadius:11, background:perk.enabled?C.accent:C.border2, position:"relative", flexShrink:0, cursor:"pointer" }}>
                  <div style={{ position:"absolute", top:3, left:perk.enabled?20:3, width:16, height:16, borderRadius:"50%", background:"#fff", transition:"left .2s", boxShadow:"0 1px 3px rgba(0,0,0,.3)" }} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


// ─── SCREEN: ORDER REVIEW ─────────────────────────────────────────────────────
function ScreenOrderReview({ params, navigate }) {
  const { liveBuyers=[], buyerNotes={}, buyerDiscounts={}, buyerPerks={}, buyerItems={}, gmv=0, elapsed=0 } = params || {};

  const [processed, setProcessed] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [expandedId, setExpandedId] = useState(null);

  const fmt = (s) => `${String(Math.floor(s/3600)).padStart(2,"0")}:${String(Math.floor((s%3600)/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;

  // Build order summary per buyer
  const orders = liveBuyers.map(b=>{
    const discount  = buyerDiscounts[b.id] || 0;
    const perks     = buyerPerks[b.id]     || {};
    const itemIds   = buyerItems[b.id]     || [];
    const items     = PRODUCTS.filter(p=>itemIds.includes(p.id));
    const note      = buyerNotes[b.id]     || "";
    const loyalty   = LOYALTY_BUYERS[b.id] || { points:0, tier:"bronze" };
    const tier      = LOYALTY_TIERS.find(t=>t.id===loyalty.tier);
    const hasChanges= discount>0 || Object.values(perks).some(Boolean) || items.length>0 || note.length>0;
    const addedGMV  = items.reduce((a,p)=>a+p.price,0);
    return { buyer:b, discount, perks, items, note, loyalty, tier, hasChanges, addedGMV };
  });

  const totalChanges   = orders.filter(o=>o.hasChanges).length;
  const totalDiscounts = orders.filter(o=>o.discount>0).length;
  const totalPerks     = orders.filter(o=>Object.values(o.perks).some(Boolean)).length;
  const totalItems     = orders.filter(o=>o.items.length>0).length;
  const totalAddedGMV  = orders.reduce((a,o)=>a+o.addedGMV,0);

  const processAll = () => {
    setProcessing(true);
    setTimeout(()=>{ setProcessing(false); setProcessed(true); }, 2200);
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100%", overflow:"hidden", background:C.bg }}>

      {/* HEADER */}
      <div style={{ padding:"16px 28px", borderBottom:`1px solid ${C.border}`, flexShrink:0, background:C.surface }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:14 }}>
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:4 }}>
              <div style={{ width:8, height:8, borderRadius:"50%", background:"#4b5563" }} />
              <span style={{ fontSize:11, fontWeight:700, color:"#4b5563", textTransform:"uppercase", letterSpacing:"0.08em" }}>Show Ended</span>
              {elapsed>0 && <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:11, color:C.muted }}>Duration: {fmt(elapsed)}</span>}
            </div>
            <div style={{ fontFamily:"'Syne',sans-serif", fontSize:20, fontWeight:800, color:C.text, letterSpacing:"-0.4px" }}>Order Review</div>
            <div style={{ fontSize:12, color:C.muted, marginTop:2 }}>Review all changes before processing. Nothing is sent until you hit Process.</div>
          </div>
          {!processed && (
            <button
              onClick={processAll}
              disabled={processing || totalChanges===0}
              style={{ background:processing?"#1a1a2e":totalChanges>0?`linear-gradient(135deg,${C.green},#059669)`:"#1a1a2e", border:`1px solid ${totalChanges>0?C.green+"44":C.border}`, color:totalChanges>0?"#fff":C.muted, fontSize:13, fontWeight:700, padding:"11px 28px", borderRadius:10, cursor:totalChanges>0?"pointer":"default", minWidth:180, transition:"all .2s" }}
            >
              {processing ? (
                <span style={{ display:"flex", alignItems:"center", gap:8, justifyContent:"center" }}>
                  <div style={{ width:12, height:12, border:"2px solid #ffffff44", borderTop:"2px solid #fff", borderRadius:"50%", animation:"spin 0.8s linear infinite" }} />
                  Processing…
                </span>
              ) : `Process All Changes (${totalChanges})`}
            </button>
          )}
          {processed && (
            <div style={{ display:"flex", alignItems:"center", gap:8, background:"#0a1e16", border:"1px solid #10b98144", borderRadius:10, padding:"10px 18px" }}>
              <span style={{ fontSize:14, color:C.green }}>✓</span>
              <span style={{ fontSize:13, fontWeight:700, color:C.green }}>All changes processed!</span>
            </div>
          )}
        </div>

        {/* SHOW SUMMARY STATS */}
        <div style={{ display:"flex", gap:12 }}>
          {[
            { label:"Total Buyers",   value:liveBuyers.length,              color:C.accent  },
            { label:"Show GMV",       value:`$${gmv.toLocaleString()}`,     color:C.green   },
            { label:"Added GMV",      value:`+$${totalAddedGMV}`,           color:C.green   },
            { label:"With Changes",   value:totalChanges,                   color:"#a78bfa" },
            { label:"Discounts",      value:totalDiscounts,                 color:C.amber   },
            { label:"Perks Applied",  value:totalPerks,                     color:"#f43f5e" },
            { label:"Items Added",    value:totalItems,                     color:C.blue    },
          ].map(s=>(
            <div key={s.label} style={{ background:C.surface2, border:`1px solid ${C.border}`, borderRadius:9, padding:"8px 14px" }}>
              <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:16, fontWeight:700, color:s.color }}>{s.value}</div>
              <div style={{ fontSize:9, color:C.muted, marginTop:1 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ORDER LIST */}
      <div style={{ flex:1, overflowY:"auto", padding:"16px 28px" }}>

        {/* CHANGES FIRST, then no-changes buyers */}
        {[...orders.filter(o=>o.hasChanges), ...orders.filter(o=>!o.hasChanges)].map((order,i)=>{
          const { buyer:b, discount, perks, items, note, tier, hasChanges } = order;
          const pl        = PLATFORMS[b.platform];
          const isExpanded= expandedId===b.id;
          const activePerks = Object.entries(perks).filter(([k,v])=>v===true&&k!=="discountReason");
          const PERK_LABELS = { bonusPoints:"2× Points", earlyAccess:"VIP Early Access", mysteryItem:"Mystery Bonus", freeShipping:"Free Shipping", firstPick:"First Pick" };

          return (
            <div key={b.id} style={{ background:hasChanges?C.surface:"#070710", border:`1px solid ${hasChanges?C.border2:C.border}`, borderRadius:14, marginBottom:8, overflow:"hidden", opacity:!hasChanges?0.5:1 }}>
              {/* ROW HEADER */}
              <div
                onClick={()=>hasChanges&&setExpandedId(isExpanded?null:b.id)}
                style={{ display:"flex", alignItems:"center", gap:12, padding:"13px 18px", cursor:hasChanges?"pointer":"default" }}
              >
                <Avatar initials={b.avatar} color={pl?.color} size={32} />
                <div style={{ flex:1 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:3 }}>
                    <span style={{ fontSize:13, fontWeight:700, color:C.text }}>{b.name}</span>
                    {tier && <span style={{ fontSize:10 }}>{tier.icon}</span>}
                    <PlatformPill code={b.platform} />
                    {!hasChanges && <span style={{ fontSize:10, color:C.muted }}>— no changes</span>}
                  </div>
                  <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                    {discount>0     && <span style={{ fontSize:9, fontWeight:700, color:C.green,   background:"#0a1e16", border:"1px solid #10b98133", padding:"1px 7px", borderRadius:5 }}>{discount}% OFF</span>}
                    {items.length>0 && <span style={{ fontSize:9, fontWeight:700, color:C.amber,   background:"#1e1206", border:"1px solid #d9770633", padding:"1px 7px", borderRadius:5 }}>+{items.length} item{items.length>1?"s":""}</span>}
                    {activePerks.map(([k])=><span key={k} style={{ fontSize:9, fontWeight:700, color:"#a78bfa", background:"#1a0f2e", border:"1px solid #7c3aed33", padding:"1px 7px", borderRadius:5 }}>{PERK_LABELS[k]||k}</span>)}
                    {note && <span style={{ fontSize:9, fontWeight:700, color:C.blue, background:"#0f1e2e", border:"1px solid #3b82f633", padding:"1px 7px", borderRadius:5 }}>📝 Note</span>}
                  </div>
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                  {items.length>0 && <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:12, fontWeight:700, color:C.green }}>+${items.reduce((a,p)=>a+p.price,0)}</span>}
                  {processed && hasChanges && <span style={{ fontSize:11, fontWeight:700, color:C.green }}>✓ Processed</span>}
                  {hasChanges && <span style={{ fontSize:11, color:C.muted }}>{isExpanded?"▲":"▼"}</span>}
                </div>
              </div>

              {/* EXPANDED DETAIL */}
              {isExpanded && hasChanges && (
                <div style={{ borderTop:`1px solid ${C.border}`, padding:"14px 18px", background:"#080812" }}>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>

                    {/* LEFT: ORDER CHANGES */}
                    <div>
                      {discount>0 && (
                        <div style={{ marginBottom:12 }}>
                          <div style={{ fontSize:10, fontWeight:700, color:C.muted, textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:6 }}>Discount</div>
                          <div style={{ background:"#0a1e16", border:"1px solid #10b98133", borderRadius:9, padding:"9px 12px", display:"flex", justifyContent:"space-between" }}>
                            <span style={{ fontSize:12, color:"#9ca3af" }}>{discount}% off applied</span>
                            {perks.discountReason && <span style={{ fontSize:11, color:C.muted }}>Reason: {perks.discountReason}</span>}
                          </div>
                        </div>
                      )}
                      {items.length>0 && (
                        <div style={{ marginBottom:12 }}>
                          <div style={{ fontSize:10, fontWeight:700, color:C.muted, textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:6 }}>Items Added to Order</div>
                          {items.map(p=>(
                            <div key={p.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"7px 10px", background:C.surface, border:`1px solid ${C.border}`, borderRadius:8, marginBottom:5 }}>
                              <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                                <span style={{ fontSize:14 }}>{p.image}</span>
                                <span style={{ fontSize:11, color:C.text }}>{p.name}</span>
                              </div>
                              <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:11, fontWeight:700, color:C.green }}>${p.price}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      {activePerks.length>0 && (
                        <div style={{ marginBottom:12 }}>
                          <div style={{ fontSize:10, fontWeight:700, color:C.muted, textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:6 }}>Perks Granted</div>
                          {activePerks.map(([k])=>(
                            <div key={k} style={{ display:"flex", gap:8, alignItems:"center", padding:"6px 10px", background:"#1a0f2e", border:"1px solid #7c3aed33", borderRadius:8, marginBottom:5 }}>
                              <span style={{ fontSize:12, color:"#a78bfa" }}>✓</span>
                              <span style={{ fontSize:11, color:"#c4b5fd" }}>{PERK_LABELS[k]||k}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* RIGHT: NOTE */}
                    <div>
                      {note && (
                        <div>
                          <div style={{ fontSize:10, fontWeight:700, color:C.muted, textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:6 }}>Note</div>
                          <div style={{ background:C.surface2, border:`1px solid ${C.border2}`, borderRadius:9, padding:"10px 12px", fontSize:12, color:"#9ca3af", lineHeight:1.6, fontStyle:"italic" }}>
                            "{note}"
                          </div>
                        </div>
                      )}
                      <div style={{ marginTop:12 }}>
                        <div style={{ fontSize:10, fontWeight:700, color:C.muted, textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:6 }}>Buyer Stats</div>
                        <div style={{ fontSize:11, color:C.muted }}>Lifetime spend: <span style={{ color:C.text, fontWeight:600 }}>${b.spend.toLocaleString()}</span></div>
                        <div style={{ fontSize:11, color:C.muted, marginTop:3 }}>Total orders: <span style={{ color:C.text, fontWeight:600 }}>{b.orders}</span></div>
                        {tier && <div style={{ fontSize:11, color:C.muted, marginTop:3 }}>Loyalty: <span style={{ color:tier.color, fontWeight:600 }}>{tier.icon} {tier.label}</span></div>}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* POST-PROCESS CTA */}
        {processed && (
          <div style={{ background:"#0a1e16", border:"1px solid #10b98144", borderRadius:14, padding:"24px", textAlign:"center", marginTop:8 }}>
            <div style={{ fontSize:20, marginBottom:8 }}>🎉</div>
            <div style={{ fontFamily:"'Syne',sans-serif", fontSize:16, fontWeight:800, color:C.text, marginBottom:6 }}>All done!</div>
            <div style={{ fontSize:12, color:C.muted, marginBottom:18 }}>Discounts applied, perks granted, items added to orders, notes saved to buyer profiles.</div>
            <div style={{ display:"flex", gap:10, justifyContent:"center" }}>
              <button onClick={()=>navigate("shows")} style={{ background:C.surface, border:`1px solid ${C.border}`, color:C.muted, fontSize:12, fontWeight:600, padding:"9px 22px", borderRadius:9, cursor:"pointer" }}>← Back to Shows</button>
              <button onClick={()=>navigate("dashboard")} style={{ background:`linear-gradient(135deg,${C.accent},${C.accent2})`, border:"none", color:"#fff", fontSize:12, fontWeight:700, padding:"9px 22px", borderRadius:9, cursor:"pointer" }}>View Dashboard →</button>
            </div>
          </div>
        )}

        {liveBuyers.length===0 && (
          <div style={{ textAlign:"center", padding:"60px 0", color:C.muted }}>
            <div style={{ fontSize:32, marginBottom:12 }}>📋</div>
            <div style={{ fontSize:14, fontWeight:600, color:C.text, marginBottom:6 }}>No orders from this show</div>
            <div style={{ fontSize:12 }}>End a live show to see your order review here.</div>
            <button onClick={()=>navigate("shows")} style={{ marginTop:16, background:C.surface, border:`1px solid ${C.border}`, color:C.muted, fontSize:12, fontWeight:600, padding:"8px 20px", borderRadius:9, cursor:"pointer" }}>← Back to Shows</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── ROOT APP ─────────────────────────────────────────────────────────────────
export default function StreamlivePrototype() {
  const [personaId, setPersonaId]   = useState("sarah");
  const [view, setView]             = useState("dashboard");
  const [params, setParams]         = useState({});
  const [showPersonaMenu, setShowPersonaMenu] = useState(false);
  const [notifications, setNotifications] = useState(3);

  const persona  = PERSONAS.find(p=>p.id===personaId);
  const buyers   = BUYERS_BY_PERSONA[personaId] || [];

  const navigate = (screen, newParams={}) => {
    setView(screen);
    setParams(newParams);
    setShowPersonaMenu(false);
  };

  const activeBuyer = params.buyerId ? buyers.find(b=>b.id===params.buyerId) : null;
  const activeShow  = params.showId  ? SHOWS.find(s=>s.id===params.showId)    : null;

  // Map view to nav item for highlighting
  const activeNav = ["buyer-profile"].includes(view) ? "buyers" : ["show-report","live","show-planner","order-review"].includes(view) ? "shows" : ["composer"].includes(view) ? "campaigns" : view;

  return (
    <>
      <style>{GLOBAL_CSS}</style>
      <div style={{ display:"flex", flexDirection:"column", height:"100vh", maxHeight:"100vh", background:C.bg, color:C.text, fontFamily:"'DM Sans',sans-serif", overflow:"hidden" }}>

        {/* ── DEMO BANNER ── */}
        <div style={{ background:"linear-gradient(90deg,#1a0f2e,#2d1f5e,#1a0f2e)", borderBottom:"1px solid #7c3aed33", padding:"5px 20px", display:"flex", alignItems:"center", gap:12, flexShrink:0 }}>
          <div style={{ width:5, height:5, borderRadius:"50%", background:"#a78bfa", animation:"pulse 2s infinite" }} />
          <span style={{ fontSize:10, fontWeight:700, color:"#a78bfa", letterSpacing:"0.08em", textTransform:"uppercase" }}>Prototype Testing Environment</span>
          <span style={{ fontSize:10, color:"#4b5563" }}>— interactions are simulated, data is demo-only</span>
          <div style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:8 }}>
            <span style={{ fontSize:10, color:"#4b5563" }}>Testing as:</span>
            <span style={{ fontSize:10, fontWeight:700, color:"#a78bfa" }}>{persona.name}</span>
            <span style={{ fontSize:9, color:persona.planColor, background:`${persona.planColor}18`, border:`1px solid ${persona.planColor}33`, padding:"1px 7px", borderRadius:4, textTransform:"uppercase", fontWeight:700 }}>{persona.plan}</span>
          </div>
        </div>

        {/* ── TOP BAR ── */}
        <div style={{ height:50, background:"#050508", borderBottom:`1px solid ${C.border}`, display:"flex", alignItems:"center", padding:"0 20px", gap:12, flexShrink:0 }}>
          {/* LOGO */}
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <div style={{ width:26, height:26, borderRadius:7, background:`linear-gradient(135deg,${C.accent},${C.accent2})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:900, color:"#fff" }}>S</div>
            <span style={{ fontFamily:"'Syne',sans-serif", fontSize:14, fontWeight:800, color:C.text }}>Streamlive</span>
          </div>

          {/* BREADCRUMB */}
          <div style={{ fontSize:12, color:C.subtle, marginLeft:8 }}>/</div>
          <div style={{ fontSize:12, color:C.muted, textTransform:"capitalize" }}>
            {view==="buyer-profile" ? `Buyers / ${activeBuyer?.name||"Profile"}` :
             view==="show-report"   ? `Shows / ${activeShow?.title||"Report"}` :
             view==="composer"      ? "Campaigns / New" :
             view==="live"          ? "Shows / Live Companion" :
             view==="show-planner"  ? "Shows / Show Planner" :
             view==="order-review"   ? "Shows / Order Review" :
             view==="catalog"       ? "Catalog" :
             view==="loyalty"       ? "Loyalty Hub" :
             view}
          </div>

          <div style={{ flex:1 }} />

          {/* NOTIFICATIONS */}
          <button onClick={()=>{ setView("subscribers"); setNotifications(0); }} style={{ position:"relative", background:"none", border:"none", cursor:"pointer", color:C.muted, fontSize:14, padding:"4px 8px" }}>
            🔔
            {notifications > 0 && <div style={{ position:"absolute", top:0, right:0, width:16, height:16, borderRadius:"50%", background:"#ef4444", fontSize:9, fontWeight:700, color:"#fff", display:"flex", alignItems:"center", justifyContent:"center" }}>{notifications}</div>}
          </button>

          {/* PERSONA SWITCHER */}
          <div style={{ position:"relative" }}>
            <button onClick={()=>setShowPersonaMenu(m=>!m)} style={{ display:"flex", alignItems:"center", gap:8, background:C.surface2, border:`1px solid ${C.border2}`, borderRadius:9, padding:"5px 10px 5px 6px", cursor:"pointer" }}>
              <Avatar initials={persona.avatar} color={persona.planColor} size={24} />
              <span style={{ fontSize:12, fontWeight:600, color:C.text }}>{persona.name}</span>
              <span style={{ fontSize:9, color:persona.planColor, background:`${persona.planColor}18`, border:`1px solid ${persona.planColor}33`, padding:"1px 6px", borderRadius:4, textTransform:"uppercase", fontWeight:700 }}>{persona.plan}</span>
              <span style={{ fontSize:10, color:C.subtle }}>▼</span>
            </button>

            {showPersonaMenu && (
              <div className="pop-in" style={{ position:"absolute", right:0, top:"calc(100% + 6px)", background:"#0a0a15", border:`1px solid ${C.border2}`, borderRadius:12, padding:"8px", zIndex:100, minWidth:260, boxShadow:"0 8px 32px rgba(0,0,0,.5)" }}>
                <div style={{ fontSize:9, color:C.subtle, textTransform:"uppercase", letterSpacing:"0.1em", fontWeight:700, padding:"4px 8px 8px" }}>Switch Test Persona</div>
                {PERSONAS.map(p=>(
                  <button key={p.id} onClick={()=>{ setPersonaId(p.id); setView("dashboard"); setParams({}); setShowPersonaMenu(false); }} style={{ width:"100%", display:"flex", alignItems:"center", gap:10, padding:"9px 10px", borderRadius:8, border:"none", background:personaId===p.id?`${p.planColor}12`:"transparent", cursor:"pointer", textAlign:"left" }}>
                    <Avatar initials={p.avatar} color={p.planColor} size={30} />
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:12, fontWeight:700, color:C.text }}>{p.name}</div>
                      <div style={{ fontSize:10, color:C.muted }}>{p.shop} · {p.buyerCount} buyers</div>
                    </div>
                    <span style={{ fontSize:9, fontWeight:700, color:p.planColor, background:`${p.planColor}18`, border:`1px solid ${p.planColor}33`, padding:"2px 7px", borderRadius:5, textTransform:"uppercase" }}>{p.plan}</span>
                  </button>
                ))}
                <div style={{ borderTop:`1px solid ${C.border}`, marginTop:8, paddingTop:8, padding:"8px 10px 4px" }}>
                  <div style={{ fontSize:10, color:C.subtle }}>Switching persona resets the session to that seller's data.</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── BODY ── */}
        <div style={{ display:"flex", flex:1, overflow:"hidden" }}>
          {/* ── SIDEBAR ── */}
          <div style={{ width:216, borderRight:`1px solid ${C.border}`, display:"flex", flexDirection:"column", padding:"12px 10px", flexShrink:0, background:"#050508" }}>
            {NAV.map(n=>{
              const isActive = activeNav === n.id;
              return (
                <button key={n.id} onClick={()=>navigate(n.id)} style={{ display:"flex", alignItems:"center", gap:10, padding:"9px 12px", borderRadius:9, border:"none", cursor:"pointer", marginBottom:2, background:isActive?`${C.accent}18`:"transparent", transition:"background .12s" }}>
                  <span style={{ fontSize:13, color:isActive?C.accent:C.subtle, width:16, textAlign:"center" }}>{n.icon}</span>
                  <span style={{ fontSize:13, fontWeight:isActive?700:400, color:isActive?C.text:C.muted }}>{n.label}</span>
                  {n.id==="subscribers" && notifications>0 && <div style={{ marginLeft:"auto", width:16, height:16, borderRadius:"50%", background:"#ef4444", fontSize:9, fontWeight:700, color:"#fff", display:"flex", alignItems:"center", justifyContent:"center" }}>{notifications}</div>}
                </button>
              );
            })}

            <div style={{ flex:1 }} />

            {/* PLAN CTA */}
            {persona.plan !== "pro" && (
              <div style={{ background:`${persona.planColor}10`, border:`1px solid ${persona.planColor}28`, borderRadius:10, padding:"12px 12px", marginBottom:6 }}>
                <div style={{ fontSize:10, fontWeight:700, color:persona.planColor, textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:5 }}>
                  {persona.plan === "starter" ? "Starter" : "Growth"}
                </div>
                <div style={{ fontSize:11, color:C.muted, marginBottom:8, lineHeight:1.5 }}>
                  {persona.plan === "starter" ? "Upgrade for real-time shows + AI insights" : "Upgrade for DM automation + attribution"}
                </div>
                <a href={persona.plan==="starter" ? STRIPE_LINKS.growth : STRIPE_LINKS.pro} target="_blank" rel="noopener noreferrer" style={{ display:"block", textAlign:"center", width:"100%", background:`linear-gradient(135deg,${C.accent},${C.accent2})`, border:"none", color:"#fff", fontSize:11, fontWeight:700, padding:"7px", borderRadius:7, cursor:"pointer", textDecoration:"none" }}>
                  Upgrade Plan
                </a>
              </div>
            )}

            {/* USER */}
            <div style={{ display:"flex", alignItems:"center", gap:8, padding:"10px 10px 4px", borderTop:`1px solid ${C.border}`, marginTop:4 }}>
              <Avatar initials={persona.avatar} color={persona.planColor} size={28} />
              <div>
                <div style={{ fontSize:11, fontWeight:600, color:C.text }}>{persona.name}</div>
                <div style={{ fontSize:9, color:C.muted }}>{persona.shop}</div>
              </div>
            </div>
          </div>

          {/* ── MAIN CONTENT ── */}
          <div style={{ flex:1, overflow:"hidden", display:"flex", flexDirection:"column" }}>
            {view==="dashboard"    && <ScreenDashboard     persona={persona} buyers={buyers} navigate={navigate} />}
            {view==="buyers"       && <ScreenBuyers         buyers={buyers} navigate={navigate} />}
            {view==="buyer-profile"&& <ScreenBuyerProfile   buyer={activeBuyer} persona={persona} navigate={navigate} />}
            {view==="shows"        && <ScreenShows          navigate={navigate} persona={persona} />}
            {view==="show-report"  && <ScreenShowReport      show={activeShow} navigate={navigate} />}
            {view==="live"         && <ScreenLive            buyers={buyers} navigate={navigate} />}
            {view==="campaigns"    && <ScreenCampaigns       navigate={navigate} persona={persona} />}
            {view==="composer"     && <ScreenComposer        navigate={navigate} persona={persona} />}
            {view==="subscribers"  && <ScreenSubscribers     persona={persona} />}
            {view==="settings"     && <ScreenSettings        persona={persona} />}
            {view==="order-review" && <ScreenOrderReview      params={params} navigate={navigate} />}
            {view==="catalog"      && <ScreenCatalog         persona={persona} navigate={navigate} />}
            {view==="show-planner" && <ScreenShowPlanner      navigate={navigate} />}
            {view==="loyalty"      && <ScreenLoyalty          buyers={buyers} navigate={navigate} persona={persona} />}
          </div>
        </div>
      </div>
    </>
  );
}
