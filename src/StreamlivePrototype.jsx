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
  { id:"c1", name:"Thursday Break Reminder",       type:"email",  status:"sent",  sentAt:"Feb 19, 2025", recipients:842, opened:61, clicked:38, converted:22, gmv:1840 },
  { id:"c2", name:"VIP Early Access — Feb",        type:"sms",    status:"sent",  sentAt:"Feb 14, 2025", recipients:124, opened:89, clicked:62, converted:41, gmv:3200 },
  { id:"c3", name:"Win-Back: 30-Day Dormant",      type:"email",  status:"sent",  sentAt:"Feb 8, 2025",  recipients:203, opened:34, clicked:18, converted:9,  gmv:680  },
  { id:"c4", name:"New Inventory Drop Alert",      type:"sms",    status:"draft", sentAt:null,           recipients:0,   opened:0,  clicked:0,  converted:0,  gmv:0    },
  { id:"c5", name:"IG Keyword: DM BREAK",          type:"ig_dm",  status:"sent",  sentAt:"Feb 17, 2025", recipients:531, opened:94, clicked:71, converted:38, gmv:2840 },
  { id:"c6", name:"TikTok Show Announcement",      type:"tt_dm",  status:"sent",  sentAt:"Feb 12, 2025", recipients:289, opened:88, clicked:64, converted:19, gmv:1140 },
  { id:"c7", name:"Whatnot Show Notification",     type:"wn_dm",  status:"sent",  sentAt:"Feb 10, 2025", recipients:406, opened:79, clicked:52, converted:28, gmv:1960 },
  { id:"c8", name:"Amazon Order Follow-Up",        type:"am_msg", status:"sent",  sentAt:"Feb 6, 2025",  recipients:88,  opened:62, clicked:0,  converted:0,  gmv:0    },
  { id:"c9", name:"IG: Mystery Box Drop",          type:"ig_dm",  status:"draft", sentAt:null,           recipients:0,   opened:0,  clicked:0,  converted:0,  gmv:0    },
];


const CHANNEL_META = {
  email:  { label:"Email",               color:"#3b82f6", bg:"#0f1e2e", icon:"✉",  via:"Direct",  note:"",                                                    canBroadcast:true  },
  sms:    { label:"SMS",                 color:"#a78bfa", bg:"#2d1f5e", icon:"💬", via:"Direct",  note:"",                                                    canBroadcast:true  },
  ig_dm:  { label:"Instagram DM",        color:"#e1306c", bg:"#2d1020", icon:"📸", via:"ManyChat", note:"Broadcasts to opted-in IG followers only",           canBroadcast:true  },
  tt_dm:  { label:"TikTok DM",           color:"#69c9d0", bg:"#0d2828", icon:"🎵", via:"ManyChat", note:"Business account required · US/non-EU only",         canBroadcast:true  },
  wn_dm:  { label:"Whatnot Notification",color:"#f59e0b", bg:"#2e1f0a", icon:"🔔", via:"Whatnot", note:"Show notifications & in-show chat only — no bulk DM", canBroadcast:false },
  am_msg: { label:"Amazon Message",      color:"#f97316", bg:"#2e1608", icon:"📦", via:"SP-API",  note:"Transactional only — order-related messages only",    canBroadcast:false },
};


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
          <div style={{ display:"flex", gap:8, marginBottom:10 }}>
            <PlatformPill code={buyer.platform} />
            <Badge label={st.label} bg={st.bg} text={st.text} />
          </div>

          {/* QUICK DM BUTTONS */}
          <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:18 }}>
            {[
              { code:"ig_dm",  icon:"📸", label:"IG DM",    ch:CHANNEL_META.ig_dm,  on:true  },
              { code:"tt_dm",  icon:"🎵", label:"TikTok",   ch:CHANNEL_META.tt_dm,  on:true  },
              { code:"sms",    icon:"💬", label:"SMS",       ch:CHANNEL_META.sms,    on:true  },
              { code:"am_msg", icon:"📦", label:"Amazon",   ch:CHANNEL_META.am_msg,  on:false },
              { code:"wn_dm",  icon:"🔔", label:"Whatnot",  ch:CHANNEL_META.wn_dm,   on:false },
            ].map(item=>(
              <button key={item.code} disabled={!item.on} title={item.on?"Send DM via "+item.ch.via:item.ch.note} style={{ display:"flex", alignItems:"center", gap:4, fontSize:9, fontWeight:700, color:item.on?item.ch.color:C.subtle, background:item.on?item.ch.bg:C.surface2, border:`1px solid ${item.on?item.ch.color+"44":C.border}`, padding:"4px 9px", borderRadius:6, cursor:item.on?"pointer":"not-allowed", opacity:item.on?1:0.4 }}>
                {item.icon} {item.label}
              </button>
            ))}
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
                {(()=>{
                  const vals = [320,185,0,640,420,180];
                  const maxV = Math.max(...vals);
                  const BAR_H = 72;
                  return (
                    <div style={{ display:"flex", gap:8, alignItems:"flex-end", height:BAR_H+20 }}>
                      {vals.map((v,i) => {
                        const barPx = v > 0 ? Math.max(4, Math.round((v/maxV)*BAR_H)) : 2;
                        return (
                          <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"flex-end", height:"100%", gap:4 }}>
                            <div style={{ fontSize:9, color:v>0?C.text:C.subtle, fontFamily:"'JetBrains Mono',monospace" }}>{v?`$${v}`:"-"}</div>
                            <div style={{ width:"100%", height:barPx, background: v>0 ? `linear-gradient(180deg,${C.accent},${C.accent2})` : C.border, borderRadius:"4px 4px 0 0" }} />
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
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

                    {/* QUICK DM */}
                    <div style={{ marginTop:14, paddingTop:14, borderTop:`1px solid ${C.border}` }}>
                      <div style={{ fontSize:10, fontWeight:700, color:C.muted, textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:8 }}>Quick DM</div>
                      <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                        {[
                          { code:"ig_dm", label:"IG", color:CHANNEL_META.ig_dm.color, bg:CHANNEL_META.ig_dm.bg, icon:"📸", available:true  },
                          { code:"tt_dm", label:"TT", color:CHANNEL_META.tt_dm.color, bg:CHANNEL_META.tt_dm.bg, icon:"🎵", available:true  },
                          { code:"wn_dm", label:"WN", color:CHANNEL_META.wn_dm.color, bg:CHANNEL_META.wn_dm.bg, icon:"🔔", available:false },
                          { code:"sms",   label:"SMS",color:CHANNEL_META.sms.color,   bg:CHANNEL_META.sms.bg,   icon:"💬", available:true  },
                        ].map(ch=>(
                          <button key={ch.code} disabled={!ch.available} onClick={()=>setSavedFeedback("dm_"+ch.code)} style={{ display:"flex", alignItems:"center", gap:4, fontSize:10, fontWeight:700, color:ch.available?ch.color:C.subtle, background:ch.available?ch.bg:C.surface2, border:`1px solid ${ch.available?ch.color+"44":C.border}`, padding:"5px 10px", borderRadius:7, cursor:ch.available?"pointer":"not-allowed", opacity:ch.available?1:0.4 }}>
                            {ch.icon} {ch.label}
                          </button>
                        ))}
                      </div>
                      {savedFeedback?.startsWith("dm_") && (
                        <div style={{ marginTop:8, fontSize:11, color:C.green }}>✓ DM sent via {savedFeedback.replace("dm_","").toUpperCase()}</div>
                      )}
                      <div style={{ marginTop:6, fontSize:9, color:C.subtle, lineHeight:1.5 }}>
                        Sends current note as a DM to {selectedBuyer?.name?.split(" ")[0]} on the selected channel
                      </div>
                    </div>

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
  const [filterType, setFilterType] = useState("all");

  const filtered = filterType==="all" ? CAMPAIGNS : CAMPAIGNS.filter(c=>c.type===filterType);

  const totalGMV     = CAMPAIGNS.filter(c=>c.status==="sent").reduce((a,c)=>a+c.gmv,0);
  const totalSent    = CAMPAIGNS.filter(c=>c.status==="sent").reduce((a,c)=>a+c.recipients,0);
  const avgOpen      = Math.round(CAMPAIGNS.filter(c=>c.opened>0).reduce((a,c,_,arr)=>a+c.opened/arr.length,0));
  const avgConverted = CAMPAIGNS.filter(c=>c.converted>0).reduce((a,c,_,arr)=>a+c.converted/arr.length,0).toFixed(0);

  return (
    <div style={{ padding:"28px 32px", overflowY:"auto", height:"100%" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
        <div>
          <div style={{ fontFamily:"'Syne',sans-serif", fontSize:22, fontWeight:800, color:C.text, letterSpacing:"-0.5px" }}>Campaigns</div>
          <div style={{ fontSize:12, color:C.muted, marginTop:4 }}>{CAMPAIGNS.length} campaigns across {Object.keys(CHANNEL_META).length} channels</div>
        </div>
        <button onClick={()=>navigate("composer")} style={{ background:`linear-gradient(135deg,${C.accent},${C.accent2})`, border:"none", color:"#fff", fontSize:12, fontWeight:700, padding:"9px 20px", borderRadius:9, cursor:"pointer" }}>
          + New Campaign
        </button>
      </div>

      {/* KPI STATS */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:20 }}>
        <StatCard label="Total Sent"       value={totalSent.toLocaleString()} sub="all channels"        color={C.blue}   />
        <StatCard label="Avg Open Rate"    value={`${avgOpen}%`}              sub="across all channels" color={C.green}  />
        <StatCard label="Avg Conversions"  value={avgConverted}               sub="per campaign"        color={C.accent} />
        <StatCard label="Revenue Driven"   value={`$${totalGMV.toLocaleString()}`} sub="attributed GMV"   color={C.amber}  />
      </div>

      {/* CHANNEL CONNECTION STATUS */}
      <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:14, padding:"16px 20px", marginBottom:20 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
          <div style={{ fontSize:12, fontWeight:700, color:C.text }}>Connected Channels</div>
          <button onClick={()=>navigate("settings")} style={{ fontSize:11, color:C.accent, background:"none", border:"none", cursor:"pointer" }}>Manage →</button>
        </div>
        <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
          {Object.entries(CHANNEL_META).map(([key,ch])=>{
            const connected = ["email","sms","ig_dm","tt_dm"].includes(key);
            return (
              <div key={key} style={{ display:"flex", alignItems:"center", gap:7, background:connected?ch.bg:C.surface2, border:`1px solid ${connected?ch.color+"44":C.border}`, borderRadius:9, padding:"7px 12px" }}>
                <span style={{ fontSize:13 }}>{ch.icon}</span>
                <div>
                  <div style={{ fontSize:11, fontWeight:700, color:connected?ch.color:C.muted }}>{ch.label}</div>
                  <div style={{ fontSize:9, color:C.subtle }}>{connected?"✓ Connected":ch.via==="ManyChat"?"Needs ManyChat":"Not connected"}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CHANNEL FILTER TABS */}
      <div style={{ display:"flex", gap:0, borderBottom:`1px solid ${C.border}`, marginBottom:16 }}>
        {[["all","All"],["email","Email"],["sms","SMS"],["ig_dm","Instagram DM"],["tt_dm","TikTok DM"],["wn_dm","Whatnot"],["am_msg","Amazon"]].map(([v,l])=>(
          <button key={v} onClick={()=>setFilterType(v)} style={{ background:"none", border:"none", borderBottom:`2px solid ${filterType===v?(CHANNEL_META[v]?.color||C.accent):"transparent"}`, color:filterType===v?(CHANNEL_META[v]?.color||"#a78bfa"):C.muted, fontSize:11, fontWeight:filterType===v?700:400, padding:"0 14px 10px", cursor:"pointer", whiteSpace:"nowrap" }}>
            {l}
          </button>
        ))}
      </div>

      {/* CAMPAIGN TABLE */}
      <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:14, overflow:"hidden" }}>
        <div style={{ display:"grid", gridTemplateColumns:"2fr 0.8fr 0.7fr 0.7fr 0.6fr 0.6fr 0.7fr 0.8fr", padding:"10px 22px", borderBottom:`1px solid ${C.border}` }}>
          {["Campaign","Channel","Via","Status","Reach","Opened","Converted","GMV"].map(h=>(
            <div key={h} style={{ fontSize:10, color:C.muted, textTransform:"uppercase", letterSpacing:"0.07em", fontWeight:700 }}>{h}</div>
          ))}
        </div>
        {filtered.map((c,i)=>{
          const ch = CHANNEL_META[c.type] || CHANNEL_META.email;
          return (
            <div key={c.id} style={{ display:"grid", gridTemplateColumns:"2fr 0.8fr 0.7fr 0.7fr 0.6fr 0.6fr 0.7fr 0.8fr", padding:"12px 22px", borderBottom:i<filtered.length-1?`1px solid #0d0d18`:"none", alignItems:"center" }}>
              <div>
                <div style={{ fontSize:12, fontWeight:600, color:C.text }}>{c.name}</div>
                {c.sentAt && <div style={{ fontSize:10, color:C.muted, marginTop:2 }}>{c.sentAt}</div>}
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:5 }}>
                <span style={{ fontSize:11 }}>{ch.icon}</span>
                <span style={{ fontSize:9, fontWeight:700, color:ch.color, background:ch.bg, border:`1px solid ${ch.color}33`, padding:"2px 6px", borderRadius:5, textTransform:"uppercase" }}>{ch.label.split(" ")[0]}</span>
              </div>
              <div style={{ fontSize:10, color:C.muted }}>{ch.via}</div>
              <div>
                <span style={{ fontSize:10, fontWeight:700, color:c.status==="sent"?C.green:C.amber, background:c.status==="sent"?"#0a1e16":"#2e1f0a", border:`1px solid ${c.status==="sent"?C.green+"44":C.amber+"44"}`, padding:"2px 7px", borderRadius:5, textTransform:"uppercase" }}>
                  {c.status}
                </span>
              </div>
              <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:12, color:c.recipients>0?C.text:C.subtle }}>{c.recipients>0?c.recipients.toLocaleString():"—"}</div>
              <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:12, color:c.opened>0?C.green:C.subtle }}>{c.opened>0?`${c.opened}%`:"—"}</div>
              <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:12, color:c.converted>0?C.blue:C.subtle }}>{c.converted>0?c.converted:"—"}</div>
              <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:12, fontWeight:700, color:c.gmv>0?C.amber:C.subtle }}>{c.gmv>0?`$${c.gmv.toLocaleString()}`:"—"}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── SCREEN: CAMPAIGN COMPOSER ────────────────────────────────────────────────
function ScreenComposer({ navigate, persona }) {
  const [step, setStep]             = useState(1);
  const [type, setType]             = useState("email");
  const [segmentId, setSegmentId]   = useState("all");
  const [subject, setSubject]       = useState("Thursday Night Break starts in 1 hour 🎉");
  const [body, setBody]             = useState("Hey {{first_name}},\n\nJust a reminder — my Thursday Night Break kicks off at 8PM EST tonight on Whatnot.\n\nLast week's show had some insane pulls. Tonight I'm opening a fresh hobby box live. Don't miss it!\n\n👉 Tap to set a reminder: {{show_link}}\n\nSee you there,\n{{seller_name}}");
  const [keyword, setKeyword]       = useState("BREAK");
  const [flowType, setFlowType]     = useState("broadcast");
  const [amMsgType, setAmMsgType]   = useState("confirmOrderDetails");
  const [catFilter, setCatFilter]   = useState("All");
  const [audienceSearch, setAudienceSearch] = useState("");
  const [showBuyerList, setShowBuyerList]   = useState(false);

  const ch       = CHANNEL_META[type] || CHANNEL_META.email;
  const segment  = AUDIENCE_SEGMENTS.find(s=>s.id===segmentId) || AUDIENCE_SEGMENTS[0];

  const igFollowers = 2840;
  const ttFollowers = 5210;

  const recipientCount = ()=>{
    if (type==="ig_dm")  return flowType==="broadcast" ? igFollowers : "—";
    if (type==="tt_dm")  return flowType==="broadcast" ? ttFollowers : "—";
    if (type==="wn_dm")  return 1240;
    if (type==="am_msg") return "order-based";
    return segment.scaledCount;
  };

  const audienceLabel = ()=>{
    if (type==="ig_dm")  return flowType==="broadcast" ? `${igFollowers.toLocaleString()} opted-in IG followers` : `Anyone who DMs keyword: ${keyword}`;
    if (type==="tt_dm")  return flowType==="broadcast" ? `${ttFollowers.toLocaleString()} TikTok DM subscribers` : `Anyone who DMs keyword: ${keyword}`;
    if (type==="wn_dm")  return "All Whatnot followers (show notification)";
    if (type==="am_msg") return "Buyers with eligible orders";
    return `${segment.label} · ${segment.scaledCount.toLocaleString()} recipients`;
  };

  const segCategories = ["All", ...new Set(AUDIENCE_SEGMENTS.map(s=>s.category))];
  const filteredSegs  = AUDIENCE_SEGMENTS.filter(s=>
    (catFilter==="All" || s.category===catFilter) &&
    (audienceSearch==="" || s.label.toLowerCase().includes(audienceSearch.toLowerCase()) || s.description.toLowerCase().includes(audienceSearch.toLowerCase()))
  );

  const channelGroups = [
    { label: "Direct Outreach",       channels: ["email","sms"]    },
    { label: "Social DM via ManyChat", channels: ["ig_dm","tt_dm"] },
    { label: "Platform Native",        channels: ["wn_dm","am_msg"]},
  ];

  return (
    <div style={{ padding:"28px 32px", overflowY:"auto", height:"100%", maxWidth:1000 }}>
      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:24 }}>
        <button onClick={()=>navigate("campaigns")} style={{ fontSize:11, color:C.muted, background:"none", border:"none", cursor:"pointer", padding:0 }}>← Back</button>
        <div style={{ fontFamily:"'Syne',sans-serif", fontSize:22, fontWeight:800, color:C.text, letterSpacing:"-0.5px" }}>New Campaign</div>
      </div>

      {/* STEP INDICATOR */}
      <div style={{ display:"flex", gap:0, marginBottom:28 }}>
        {[{n:1,l:"Channel & Audience"},{n:2,l:"Message"},{n:3,l:"Review & Send"}].map((s,i)=>(
          <div key={s.n} style={{ display:"flex", alignItems:"center" }}>
            <button onClick={()=>step>s.n&&setStep(s.n)} style={{ display:"flex", alignItems:"center", gap:8, background:"none", border:"none", cursor:step>s.n?"pointer":"default", padding:"0 4px" }}>
              <div style={{ width:24, height:24, borderRadius:"50%", background:step>=s.n?C.accent:C.surface2, border:`2px solid ${step>=s.n?C.accent:C.border2}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700, color:step>=s.n?"#fff":C.subtle }}>
                {step>s.n?"✓":s.n}
              </div>
              <span style={{ fontSize:12, fontWeight:step===s.n?700:400, color:step===s.n?C.text:C.muted }}>{s.l}</span>
            </button>
            {i<2 && <div style={{ width:40, height:1, background:step>s.n?C.accent:C.border2, margin:"0 4px" }} />}
          </div>
        ))}
      </div>

      {/* ── STEP 1: CHANNEL + AUDIENCE ── */}
      {step===1 && (
        <div className="fade-up" style={{ display:"grid", gridTemplateColumns:"340px 1fr", gap:20, alignItems:"start" }}>

          {/* LEFT: CHANNEL PICKER */}
          <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:14, padding:"20px 22px" }}>
            <div style={{ fontSize:12, fontWeight:700, color:C.text, marginBottom:16 }}>Channel</div>
            {channelGroups.map(group=>(
              <div key={group.label} style={{ marginBottom:16 }}>
                <div style={{ fontSize:9, fontWeight:700, color:C.subtle, textTransform:"uppercase", letterSpacing:"0.09em", marginBottom:8 }}>{group.label}</div>
                {group.channels.map(t=>{
                  const c = CHANNEL_META[t];
                  const connected = ["email","sms","ig_dm","tt_dm"].includes(t);
                  const isSelected = type===t;
                  return (
                    <div key={t} onClick={()=>connected&&setType(t)} style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 12px", borderRadius:10, border:`1px solid ${isSelected?c.color+"66":C.border}`, background:isSelected?c.bg:"transparent", cursor:connected?"pointer":"not-allowed", marginBottom:6, opacity:connected?1:0.5 }}>
                      <div style={{ width:30, height:30, borderRadius:8, background:`${c.color}18`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, flexShrink:0 }}>{c.icon}</div>
                      <div style={{ flex:1 }}>
                        <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                          <span style={{ fontSize:12, fontWeight:700, color:C.text }}>{c.label}</span>
                          <span style={{ fontSize:8, fontWeight:700, color:c.color, background:c.bg, border:`1px solid ${c.color}33`, padding:"1px 5px", borderRadius:4 }}>{c.via}</span>
                        </div>
                        <div style={{ fontSize:10, color:C.muted, marginTop:1, lineHeight:1.4 }}>{connected?c.note||"Ready to send":"Not connected"}</div>
                      </div>
                      {connected && <div style={{ width:14, height:14, borderRadius:"50%", border:`2px solid ${isSelected?c.color:C.border2}`, background:isSelected?c.color:"transparent", flexShrink:0 }} />}
                    </div>
                  );
                })}
              </div>
            ))}

            {/* IG/TT flow type */}
            {(type==="ig_dm"||type==="tt_dm") && (
              <div style={{ borderTop:`1px solid ${C.border}`, paddingTop:14, marginTop:4 }}>
                <div style={{ fontSize:11, fontWeight:700, color:C.text, marginBottom:10 }}>Flow Type</div>
                {[
                  { v:"broadcast", l:"Broadcast",        icon:"📢", d:"Send to all opted-in followers" },
                  { v:"keyword",   l:"Keyword Trigger",   icon:"🔑", d:"Auto-reply when someone DMs your keyword" },
                ].map(f=>(
                  <div key={f.v} onClick={()=>setFlowType(f.v)} style={{ display:"flex", alignItems:"center", gap:8, padding:"9px 10px", borderRadius:9, border:`1px solid ${flowType===f.v?ch.color+"66":C.border}`, background:flowType===f.v?ch.bg:"transparent", cursor:"pointer", marginBottom:6 }}>
                    <span style={{ fontSize:14 }}>{f.icon}</span>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:11, fontWeight:600, color:C.text }}>{f.l}</div>
                      <div style={{ fontSize:9, color:C.muted }}>{f.d}</div>
                    </div>
                    <div style={{ width:13, height:13, borderRadius:"50%", border:`2px solid ${flowType===f.v?ch.color:C.border2}`, background:flowType===f.v?ch.color:"transparent", flexShrink:0 }} />
                  </div>
                ))}
                {flowType==="keyword" && (
                  <div style={{ marginTop:8 }}>
                    <div style={{ fontSize:10, color:C.muted, marginBottom:5 }}>Trigger keyword</div>
                    <input value={keyword} onChange={e=>setKeyword(e.target.value.toUpperCase())} placeholder="e.g. BREAK" style={{ width:"100%", background:C.surface2, border:`1px solid ${C.border2}`, borderRadius:8, padding:"8px 12px", color:C.text, fontSize:13, fontWeight:700, outline:"none", fontFamily:"'JetBrains Mono',monospace" }} />
                  </div>
                )}
              </div>
            )}

            {/* Amazon message type */}
            {type==="am_msg" && (
              <div style={{ borderTop:`1px solid ${C.border}`, paddingTop:14, marginTop:4 }}>
                <div style={{ fontSize:11, fontWeight:700, color:C.text, marginBottom:10 }}>Message Type</div>
                <div style={{ fontSize:9, color:C.muted, marginBottom:8, lineHeight:1.5 }}>Order-related only — no marketing</div>
                {[
                  { v:"confirmOrderDetails",  l:"Confirm Order Details"      },
                  { v:"confirmCustomization", l:"Confirm Customization"      },
                  { v:"negativeFeedback",     l:"Feedback Removal Request"   },
                ].map(m=>(
                  <div key={m.v} onClick={()=>setAmMsgType(m.v)} style={{ padding:"8px 10px", borderRadius:8, border:`1px solid ${amMsgType===m.v?CHANNEL_META.am_msg.color+"66":C.border}`, background:amMsgType===m.v?CHANNEL_META.am_msg.bg:"transparent", cursor:"pointer", marginBottom:6 }}>
                    <div style={{ fontSize:11, fontWeight:600, color:C.text }}>{m.l}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: AUDIENCE SEGMENT PICKER */}
          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>

            {/* Platform constraint note */}
            {ch.note && (
              <div style={{ background:`${ch.color}10`, border:`1px solid ${ch.color}33`, borderRadius:10, padding:"10px 14px", display:"flex", gap:8 }}>
                <span style={{ color:ch.color, fontSize:13, flexShrink:0 }}>ⓘ</span>
                <span style={{ fontSize:11, color:ch.color, lineHeight:1.5 }}>{ch.note}</span>
              </div>
            )}

            {/* Whatnot: static audience */}
            {type==="wn_dm" && (
              <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:14, padding:"18px 20px" }}>
                <div style={{ fontSize:12, fontWeight:700, color:C.text, marginBottom:10 }}>Audience</div>
                <div style={{ background:CHANNEL_META.wn_dm.bg, border:`1px solid ${CHANNEL_META.wn_dm.color}33`, borderRadius:9, padding:"12px 14px" }}>
                  <div style={{ fontSize:12, fontWeight:700, color:CHANNEL_META.wn_dm.color }}>🟡 All Whatnot Followers</div>
                  <div style={{ fontSize:10, color:C.muted, marginTop:3 }}>Show notification sent to 1,240 followers · platform-controlled, no segmentation</div>
                </div>
              </div>
            )}

            {/* Amazon: order-based */}
            {type==="am_msg" && (
              <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:14, padding:"18px 20px" }}>
                <div style={{ fontSize:12, fontWeight:700, color:C.text, marginBottom:10 }}>Audience</div>
                <div style={{ background:CHANNEL_META.am_msg.bg, border:`1px solid ${CHANNEL_META.am_msg.color}33`, borderRadius:9, padding:"12px 14px" }}>
                  <div style={{ fontSize:12, fontWeight:700, color:CHANNEL_META.am_msg.color }}>📦 Order-Based Recipients</div>
                  <div style={{ fontSize:10, color:C.muted, marginTop:3 }}>Select a specific order from your Amazon Seller account. Recipients are tied to individual orders, not your CRM.</div>
                </div>
              </div>
            )}

            {/* IG/TT broadcast audience */}
            {(type==="ig_dm"||type==="tt_dm") && flowType==="broadcast" && (
              <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:14, padding:"18px 20px" }}>
                <div style={{ fontSize:12, fontWeight:700, color:C.text, marginBottom:10 }}>Audience</div>
                <div style={{ background:ch.bg, border:`1px solid ${ch.color}33`, borderRadius:9, padding:"12px 14px" }}>
                  <div style={{ fontSize:12, fontWeight:700, color:ch.color }}>{ch.icon} All Opted-In {type==="ig_dm"?"Instagram":"TikTok"} Followers</div>
                  <div style={{ fontSize:10, color:C.muted, marginTop:3 }}>{type==="ig_dm"?igFollowers.toLocaleString():ttFollowers.toLocaleString()} subscribers · segmentation available via ManyChat tags</div>
                </div>
              </div>
            )}

            {/* EMAIL + SMS: Full CRM segment picker */}
            {(type==="email"||type==="sms"||(type==="ig_dm"&&flowType==="keyword")||(type==="tt_dm"&&flowType==="keyword")) && (
              <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:14, overflow:"hidden" }}>
                <div style={{ padding:"16px 18px 12px" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
                    <div style={{ fontSize:12, fontWeight:700, color:C.text }}>Audience Segment</div>
                    {segment.count > 0 && (
                      <button onClick={()=>setShowBuyerList(v=>!v)} style={{ fontSize:10, color:C.accent, background:"none", border:"none", cursor:"pointer" }}>
                        {showBuyerList?"Hide":"Preview"} buyers →
                      </button>
                    )}
                  </div>

                  {/* Search */}
                  <input value={audienceSearch} onChange={e=>setAudienceSearch(e.target.value)} placeholder="Search segments…"
                    style={{ width:"100%", background:C.surface2, border:`1px solid ${C.border2}`, borderRadius:8, padding:"7px 12px", color:C.text, fontSize:11, outline:"none", marginBottom:10 }} />

                  {/* Category filter pills */}
                  <div style={{ display:"flex", gap:5, flexWrap:"wrap", marginBottom:12 }}>
                    {segCategories.map(cat=>(
                      <button key={cat} onClick={()=>setCatFilter(cat)} style={{ fontSize:9, fontWeight:catFilter===cat?700:400, color:catFilter===cat?"#fff":C.muted, background:catFilter===cat?C.accent:C.surface2, border:`1px solid ${catFilter===cat?C.accent:C.border}`, padding:"3px 10px", borderRadius:5, cursor:"pointer" }}>
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* SEGMENT LIST */}
                <div style={{ maxHeight:340, overflowY:"auto" }}>
                  {filteredSegs.map(seg=>{
                    const isSelected = segmentId===seg.id;
                    return (
                      <div
                        key={seg.id}
                        onClick={()=>setSegmentId(seg.id)}
                        style={{ display:"flex", alignItems:"center", gap:12, padding:"11px 18px", borderLeft:`3px solid ${isSelected?seg.color:"transparent"}`, background:isSelected?`${seg.color}0d`:"transparent", cursor:"pointer", transition:"all .1s" }}
                      >
                        <div style={{ width:34, height:34, borderRadius:9, background:isSelected?seg.bg:C.surface2, border:`1px solid ${isSelected?seg.color+"44":C.border}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:15, flexShrink:0 }}>
                          {seg.icon}
                        </div>
                        <div style={{ flex:1, minWidth:0 }}>
                          <div style={{ fontSize:12, fontWeight:isSelected?700:600, color:isSelected?C.text:"#d1d5db" }}>{seg.label}</div>
                          <div style={{ fontSize:10, color:C.muted, marginTop:1, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{seg.description}</div>
                        </div>
                        <div style={{ textAlign:"right", flexShrink:0 }}>
                          <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:13, fontWeight:700, color:isSelected?seg.color:C.muted }}>{seg.scaledCount.toLocaleString()}</div>
                          <div style={{ fontSize:8, color:C.subtle }}>recipients</div>
                        </div>
                      </div>
                    );
                  })}
                  {filteredSegs.length===0 && (
                    <div style={{ padding:"20px 18px", fontSize:11, color:C.muted, textAlign:"center" }}>No segments match "{audienceSearch}"</div>
                  )}
                </div>
              </div>
            )}

            {/* SELECTED SEGMENT SUMMARY + BUYER PREVIEW */}
            {(type==="email"||type==="sms") && segmentId && (
              <div style={{ background:segment.bg, border:`1px solid ${segment.color}44`, borderRadius:14, padding:"14px 18px" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
                  <div>
                    <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:3 }}>
                      <span style={{ fontSize:16 }}>{segment.icon}</span>
                      <span style={{ fontSize:13, fontWeight:700, color:C.text }}>{segment.label}</span>
                    </div>
                    <div style={{ fontSize:11, color:C.muted }}>{segment.description}</div>
                  </div>
                  <div style={{ textAlign:"right" }}>
                    <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:22, fontWeight:700, color:segment.color }}>{segment.scaledCount.toLocaleString()}</div>
                    <div style={{ fontSize:10, color:C.muted }}>recipients</div>
                  </div>
                </div>

                {/* Buyer preview strip */}
                {showBuyerList && segment.buyers.length > 0 && (
                  <div style={{ borderTop:`1px solid ${segment.color}22`, paddingTop:10, marginTop:4 }}>
                    <div style={{ fontSize:9, fontWeight:700, color:C.muted, textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:7 }}>CRM Sample — {segment.buyers.length} buyer{segment.buyers.length>1?"s":""} in this segment</div>
                    {segment.buyers.slice(0,5).map(b=>{
                      const pl = PLATFORMS[b.platform];
                      const tier = LOYALTY_TIERS.find(t=>t.id===b.loyalty.tier);
                      return (
                        <div key={b.id} style={{ display:"flex", alignItems:"center", gap:9, padding:"6px 0", borderBottom:`1px solid ${segment.color}15` }}>
                          <Avatar initials={b.avatar} color={pl?.color} size={24} />
                          <div style={{ flex:1, minWidth:0 }}>
                            <div style={{ fontSize:11, fontWeight:600, color:C.text }}>{b.name}</div>
                            <div style={{ fontSize:9, color:C.muted }}>{b.handle} · {b.orders} orders · ${b.spend.toLocaleString()}</div>
                          </div>
                          <div style={{ display:"flex", gap:4, alignItems:"center", flexShrink:0 }}>
                            {tier && <span style={{ fontSize:9 }}>{tier.icon}</span>}
                            <PlatformPill code={b.platform} />
                          </div>
                        </div>
                      );
                    })}
                    {segment.buyers.length > 5 && (
                      <div style={{ fontSize:10, color:C.muted, paddingTop:7, textAlign:"center" }}>
                        +{(segment.scaledCount - 5).toLocaleString()} more in the full segment
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            <button onClick={()=>setStep(2)} style={{ background:`linear-gradient(135deg,${C.accent},${C.accent2})`, border:"none", color:"#fff", fontSize:13, fontWeight:700, padding:"12px", borderRadius:10, cursor:"pointer" }}>
              Continue to Message →
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 2: MESSAGE ── */}
      {step===2 && (
        <div className="fade-up">
          {(type==="ig_dm"||type==="tt_dm") && (
            <div style={{ background:ch.bg, border:`1px solid ${ch.color}33`, borderRadius:12, padding:"11px 16px", marginBottom:14, fontSize:11, color:ch.color, lineHeight:1.6 }}>
              <strong>ManyChat rules:</strong> Links not clickable in DMs — send as plain text. Max 1000 chars. No images in TT DMs.
            </div>
          )}
          {type==="am_msg" && (
            <div style={{ background:CHANNEL_META.am_msg.bg, border:`1px solid ${CHANNEL_META.am_msg.color}33`, borderRadius:12, padding:"11px 16px", marginBottom:14, fontSize:11, color:CHANNEL_META.am_msg.color, lineHeight:1.6 }}>
              <strong>Amazon policy:</strong> Factual order-related info only. No promotional language, no external links, no review requests.
            </div>
          )}
          {type==="email" && (
            <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:14, padding:"18px 22px", marginBottom:14 }}>
              <div style={{ fontSize:10, color:C.muted, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:8 }}>Subject Line</div>
              <input value={subject} onChange={e=>setSubject(e.target.value)} style={{ width:"100%", background:C.surface2, border:`1px solid ${C.border2}`, borderRadius:9, padding:"10px 12px", color:C.text, fontSize:13, outline:"none" }} />
            </div>
          )}
          {(type==="ig_dm"||type==="tt_dm") && flowType==="keyword" && (
            <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, padding:"12px 18px", marginBottom:14, display:"flex", gap:14, alignItems:"center" }}>
              <div><span style={{ fontSize:11, fontWeight:700, color:C.text }}>Keyword: </span><span style={{ fontFamily:"'JetBrains Mono',monospace", color:ch.color }}>{keyword}</span></div>
              <div style={{ fontSize:10, color:C.muted }}>Auto-sends when someone DMs "{keyword}"</div>
            </div>
          )}
          <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:14, padding:"18px 22px", marginBottom:14 }}>
            <div style={{ fontSize:10, color:C.muted, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:8 }}>
              {type==="wn_dm"?"Show Notification Text":type==="am_msg"?"Message to Buyer":"Message Body"}
            </div>
            <textarea value={body} onChange={e=>setBody(e.target.value)} rows={9} style={{ width:"100%", background:C.surface2, border:`1px solid ${C.border2}`, borderRadius:9, padding:"10px 12px", color:C.text, fontSize:13, outline:"none", resize:"vertical", fontFamily:"'DM Sans',sans-serif", lineHeight:1.65 }} />
            <div style={{ marginTop:8, display:"flex", gap:7, flexWrap:"wrap", alignItems:"center" }}>
              {["email","sms","ig_dm","tt_dm"].includes(type) && ["{{first_name}}","{{show_link}}","{{seller_name}}"].map(t=>(
                <button key={t} onClick={()=>setBody(b=>b+" "+t)} style={{ fontSize:10, color:ch.color, background:ch.bg, border:`1px solid ${ch.color}33`, padding:"3px 9px", borderRadius:6, cursor:"pointer" }}>{t}</button>
              ))}
              <div style={{ marginLeft:"auto", fontSize:10, color:body.length>800?"#ef4444":C.muted }}>{body.length}{type==="sms"?"/160":["ig_dm","tt_dm"].includes(type)?"/1000":""}</div>
            </div>
          </div>
          <div style={{ display:"flex", gap:10 }}>
            <button onClick={()=>setStep(1)} style={{ background:C.surface, border:`1px solid ${C.border}`, color:C.muted, fontSize:12, fontWeight:600, padding:"10px 20px", borderRadius:9, cursor:"pointer" }}>← Back</button>
            <button onClick={()=>setStep(3)} style={{ flex:1, background:`linear-gradient(135deg,${C.accent},${C.accent2})`, border:"none", color:"#fff", fontSize:13, fontWeight:700, padding:"10px", borderRadius:9, cursor:"pointer" }}>Review Campaign →</button>
          </div>
        </div>
      )}

      {/* ── STEP 3: REVIEW + SEND ── */}
      {step===3 && (
        <div className="fade-up">
          <div style={{ background:ch.bg, border:`1px solid ${ch.color}44`, borderRadius:14, padding:"20px 24px", marginBottom:16 }}>
            <div style={{ fontSize:12, fontWeight:700, color:C.text, marginBottom:16 }}>Campaign Summary</div>
            {[
              ["Channel",  `${ch.icon} ${ch.label}`],
              ["Via",       ch.via],
              ...(type==="ig_dm"||type==="tt_dm" ? [["Flow Type", flowType==="keyword"?`Keyword: ${keyword}`:"Broadcast"]] : []),
              ...(type==="am_msg" ? [["Message Type", amMsgType]] : []),
              ["Audience",  audienceLabel()],
              ...(type==="email" ? [["Subject", subject]] : []),
            ].map(([k,v])=>(
              <div key={k} style={{ display:"flex", gap:14, marginBottom:10, alignItems:"flex-start" }}>
                <span style={{ fontSize:11, color:C.muted, minWidth:90, flexShrink:0 }}>{k}</span>
                <span style={{ fontSize:12, color:C.text }}>{v}</span>
              </div>
            ))}
            <div style={{ borderTop:`1px solid ${C.border}`, paddingTop:12, marginTop:4 }}>
              <div style={{ fontSize:10, color:C.muted, textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:6 }}>Message Preview</div>
              <div style={{ fontSize:12, color:"#9ca3af", lineHeight:1.65, whiteSpace:"pre-line", maxHeight:80, overflow:"hidden" }}>{body.slice(0,180)}{body.length>180?"…":""}</div>
            </div>
          </div>

          {/* Recipient count badge */}
          <div style={{ display:"flex", alignItems:"center", gap:12, background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, padding:"12px 18px", marginBottom:16 }}>
            <div style={{ width:36, height:36, borderRadius:9, background:`${segment.color}18`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>{segment.icon}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:11, fontWeight:700, color:C.text }}>{audienceLabel()}</div>
              {["email","sms"].includes(type) && <div style={{ fontSize:10, color:C.muted, marginTop:2 }}>{segment.description}</div>}
            </div>
            <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:20, fontWeight:700, color:segment.color }}>{typeof recipientCount()==="number"?recipientCount().toLocaleString():recipientCount()}</div>
          </div>

          <div style={{ display:"flex", gap:10 }}>
            <button onClick={()=>setStep(2)} style={{ background:C.surface, border:`1px solid ${C.border}`, color:C.muted, fontSize:12, fontWeight:600, padding:"10px 20px", borderRadius:9, cursor:"pointer" }}>← Edit</button>
            <button onClick={()=>navigate("campaigns")} style={{ flex:1, background:"linear-gradient(135deg,#10b981,#059669)", border:"none", color:"#fff", fontSize:13, fontWeight:700, padding:"10px", borderRadius:9, cursor:"pointer" }}>
              {type==="ig_dm"||type==="tt_dm"?"Send via ManyChat 🚀":type==="wn_dm"?"Send Whatnot Notification 🔔":type==="am_msg"?"Send Amazon Message 📦":"Send Campaign 🚀"}
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
// ─── TEAM TAB COMPONENT ──────────────────────────────────────────────────────
function TeamTab({ persona }) {
  const ROLES = ["Admin", "Show Manager", "Campaign Manager", "Viewer"];
  const ROLE_META = {
    Owner:             { color: C.accent,  desc: "Full access to everything" },
    Admin:             { color: "#f59e0b", desc: "Manage shows, buyers, campaigns, settings" },
    "Show Manager":    { color: "#10b981", desc: "Run live shows and manage orders" },
    "Campaign Manager":{ color: "#3b82f6", desc: "Create and send campaigns" },
    Viewer:            { color: "#9ca3af", desc: "Read-only access" },
  };

  const [teamMembers, setTeamMembers] = useState([]);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteName,  setInviteName]  = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole,  setInviteRole]  = useState("Show Manager");
  const [saving, setSaving]             = useState(false);
  const [saved, setSaved]               = useState(false);
  const [emailSendStatus, setEmailSendStatus] = useState(null); // null | "sending" | "sent" | "no_smtp" | "error"
  const [emailSendError, setEmailSendError]   = useState("");
  const [removeTarget, setRemoveTarget] = useState(null);

  // Load persisted team members
  useEffect(() => {
    (async () => {
      try {
        const result = await window.storage.get("strmlive:team");
        if (result?.value) setTeamMembers(JSON.parse(result.value));
      } catch(e) {}
    })();
  }, []);

  const persistTeam = async (members) => {
    setTeamMembers(members);
    try { await window.storage.set("strmlive:team", JSON.stringify(members)); } catch(e) {}
  };

  const sendInvite = async () => {
    if (!inviteEmail.trim() || !inviteName.trim()) return;
    setSaving(true);
    setEmailSendStatus(null);
    setEmailSendError("");

    // ── Generate token + invite link ──────────────────────────────────────────
    const token      = "inv_" + crypto.randomUUID().replace(/-/g,"").slice(0,16);
    const inviteLink = `${window.location.origin}${window.location.pathname}?invite=${token}`;
    const now        = new Date().toLocaleDateString("en-US", { month:"short", day:"numeric", year:"numeric" });
    const expiresAt  = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

    const newMember = {
      id:        Date.now(),
      name:      inviteName.trim(),
      email:     inviteEmail.trim().toLowerCase(),
      role:      inviteRole,
      avatar:    inviteName.trim().split(" ").map(n=>n[0]).slice(0,2).join("").toUpperCase(),
      status:    "invited",
      invitedAt: now,
      token,
    };

    // ── Persist the pending invite record (used by acceptance screen) ─────────
    await window.storage.set(`strmlive:invite:${token}`, JSON.stringify({
      token,
      name:      newMember.name,
      email:     newMember.email,
      role:      inviteRole,
      invitedBy: persona.name,
      workspace: persona.shop,
      fromEmail: persona.email,
      invitedAt: now,
      expiresAt,
      status:    "pending",
    }));

    // ── Read SMTP credentials from stored connections ──────────────────────────
    let smtpCreds = null;
    try {
      const connResult = await window.storage.get("strmlive:connections");
      if (connResult?.value) {
        const conns = JSON.parse(connResult.value);
        if (conns.email) {
          smtpCreds = conns.email._smtp || null;
          // Also check if smtp fields were stored directly on the email connection
          if (!smtpCreds && conns.email.smtpHost) {
            smtpCreds = {
              host: conns.email.smtpHost,
              user: conns.email.smtpUser,
              pass: conns.email.smtpPass,
            };
          }
        }
      }
    } catch(e) {}

    // ── Send via Vercel API function ───────────────────────────────────────────
    if (smtpCreds?.host && smtpCreds?.user && smtpCreds?.pass) {
      setEmailSendStatus("sending");
      try {
        const apiRes = await fetch("/api/send-invite", {
          method:  "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to:         newMember.email,
            toName:     newMember.name,
            role:       inviteRole,
            workspace:  persona.shop,
            invitedBy:  persona.name,
            inviteLink,
            token,
            smtpHost:   smtpCreds.host,
            smtpUser:   smtpCreds.user,
            smtpPass:   smtpCreds.pass,
            smtpPort:   smtpCreds.port || "587",
            fromEmail:  persona.email,
            fromName:   persona.shop,
          }),
        });

        const result = await apiRes.json();

        if (apiRes.ok && result.success) {
          setEmailSendStatus("sent");
          await window.storage.set(`strmlive:invite_email:${token}`, JSON.stringify({
            to:        newMember.email,
            subject:   `${persona.name} invited you to ${persona.shop} on Streamlive`,
            sentAt:    now,
            messageId: result.messageId,
            method:    "smtp",
          }));
        } else {
          setEmailSendStatus("error");
          setEmailSendError(result.detail || result.error || "SMTP send failed");
          console.error("Email send error:", result);
        }
      } catch(e) {
        setEmailSendStatus("error");
        setEmailSendError(e.message);
        console.error("Email API error:", e);
      }
    } else {
      // No SMTP configured — invite link still works, user can copy it manually
      setEmailSendStatus("no_smtp");
    }

    await persistTeam([...teamMembers, newMember]);
    setSaving(false);
    setSaved(true);
    // Don't auto-close — let user see the delivery status first
  };

  const removeMember = async (id) => {
    await persistTeam(teamMembers.filter(m => m.id !== id));
    setRemoveTarget(null);
  };

  const updateRole = async (id, role) => {
    const updated = teamMembers.map(m => m.id === id ? { ...m, role } : m);
    await persistTeam(updated);
  };

  const owner = { name: persona.name, email: persona.email, role: "Owner",
    avatar: persona.name.split(" ").map(n=>n[0]).join("").toUpperCase() };

  const allMembers = [owner, ...teamMembers];
  const isValidEmail = inviteEmail.includes("@") && inviteEmail.includes(".");

  return (
    <div className="fade-up" style={{ maxWidth:580 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
        <div>
          <div style={{ fontSize:13, fontWeight:700, color:C.text }}>{allMembers.length} team member{allMembers.length!==1?"s":""}</div>
          <div style={{ fontSize:11, color:C.muted, marginTop:2 }}>Invite team members to help manage your shows, campaigns, and buyers.</div>
        </div>
        <button onClick={()=>setShowInviteModal(true)} style={{ background:`linear-gradient(135deg,${C.accent},${C.accent2})`, border:"none", color:"#fff", fontSize:12, fontWeight:700, padding:"8px 16px", borderRadius:9, cursor:"pointer", whiteSpace:"nowrap" }}>
          + Invite Member
        </button>
      </div>

      {/* MEMBER LIST */}
      {allMembers.map((m, i) => {
        const rm = ROLE_META[m.role] || ROLE_META.Viewer;
        const isOwner = m.role === "Owner";
        return (
          <div key={m.email} style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, padding:"14px 18px", display:"flex", alignItems:"center", gap:12, marginBottom:8 }}>
            <div style={{ position:"relative", flexShrink:0 }}>
              <Avatar initials={m.avatar} color={rm.color} size={38} />
              {m.status==="invited" && (
                <div style={{ position:"absolute", bottom:-2, right:-2, width:10, height:10, borderRadius:"50%", background:C.amber, border:"2px solid #0a0a12" }} title="Invite pending" />
              )}
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:13, fontWeight:600, color:C.text }}>{m.name}</div>
              <div style={{ fontSize:11, color:C.muted }}>{m.email}</div>
              {m.status==="invited" && (
                <div style={{ display:"flex", alignItems:"center", gap:8, marginTop:4, flexWrap:"wrap" }}>
                  <span style={{ fontSize:9, color:C.amber }}>⏳ Invite sent {m.invitedAt} · pending acceptance</span>
                  <button
                    onClick={async ()=>{
                      try {
                        const emailData = await window.storage.get(`strmlive:invite_email:${m.token}`);
                        const inviteData = await window.storage.get(`strmlive:invite:${m.token}`);
                        if (inviteData?.value) {
                          const inv = JSON.parse(inviteData.value);
                          const link = `${window.location.origin}${window.location.pathname}?invite=${m.token}`;
                          await navigator.clipboard.writeText(link);
                          alert(`Invite link copied!\n\n${link}\n\nShare this with ${m.name} to let them create their account.`);
                        }
                      } catch(e) { alert("Could not copy link"); }
                    }}
                    style={{ fontSize:9, fontWeight:700, color:C.blue, background:"#0f1e2e", border:"1px solid #3b82f633", padding:"2px 8px", borderRadius:5, cursor:"pointer" }}
                  >
                    Copy invite link
                  </button>
                </div>
              )}
            </div>
            {isOwner ? (
              <span style={{ fontSize:10, fontWeight:700, color:rm.color, background:`${rm.color}22`, border:`1px solid ${rm.color}44`, padding:"4px 12px", borderRadius:6, flexShrink:0 }}>
                {m.role}
              </span>
            ) : (
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <select
                  value={m.role}
                  onChange={e=>updateRole(m.id, e.target.value)}
                  style={{ fontSize:10, fontWeight:700, color:rm.color, background:C.surface2, border:`1px solid ${rm.color}44`, padding:"4px 8px", borderRadius:6, cursor:"pointer", outline:"none", appearance:"none" }}
                >
                  {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
                <button
                  onClick={()=>setRemoveTarget(m.id)}
                  title="Remove member"
                  style={{ background:"none", border:"none", color:C.muted, fontSize:14, cursor:"pointer", padding:"0 4px", lineHeight:1 }}
                >×</button>
              </div>
            )}
          </div>
        );
      })}

      {/* ROLE LEGEND */}
      <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, padding:"14px 18px", marginTop:8 }}>
        <div style={{ fontSize:10, fontWeight:700, color:C.muted, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:10 }}>Role Permissions</div>
        {Object.entries(ROLE_META).map(([role, meta]) => (
          <div key={role} style={{ display:"flex", alignItems:"center", gap:10, padding:"5px 0" }}>
            <span style={{ fontSize:10, fontWeight:700, color:meta.color, minWidth:120 }}>{role}</span>
            <span style={{ fontSize:10, color:C.muted }}>{meta.desc}</span>
          </div>
        ))}
      </div>

      {/* ── INVITE MODAL ── */}
      {showInviteModal && (
        <div style={{ position:"fixed", inset:0, background:"#000000cc", zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center" }}
          onClick={e=>e.target===e.currentTarget&&setShowInviteModal(false)}>
          <div style={{ background:"#0e0e1a", border:`1px solid ${C.accent}44`, borderRadius:18, padding:"28px 32px", width:460, maxWidth:"90vw" }}>

            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:22 }}>
              <div style={{ fontSize:16, fontWeight:700, color:C.text }}>Invite Team Member</div>
              <button onClick={()=>setShowInviteModal(false)} style={{ background:"none", border:"none", color:C.muted, fontSize:18, cursor:"pointer" }}>✕</button>
            </div>

            {/* NAME */}
            <div style={{ marginBottom:14 }}>
              <div style={{ fontSize:10, fontWeight:700, color:C.muted, textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:6 }}>Full Name</div>
              <input
                value={inviteName} onChange={e=>setInviteName(e.target.value)}
                placeholder="Jane Smith"
                style={{ width:"100%", background:C.surface2, border:`1px solid ${C.border2}`, borderRadius:9, padding:"10px 14px", color:C.text, fontSize:13, outline:"none" }}
              />
            </div>

            {/* EMAIL */}
            <div style={{ marginBottom:14 }}>
              <div style={{ fontSize:10, fontWeight:700, color:C.muted, textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:6 }}>Email Address</div>
              <input
                value={inviteEmail} onChange={e=>setInviteEmail(e.target.value)}
                placeholder="jane@example.com"
                type="email"
                style={{ width:"100%", background:C.surface2, border:`1px solid ${!inviteEmail||isValidEmail?C.border2:"#ef444466"}`, borderRadius:9, padding:"10px 14px", color:C.text, fontSize:13, outline:"none" }}
              />
              {inviteEmail && !isValidEmail && (
                <div style={{ fontSize:10, color:"#f87171", marginTop:4 }}>Enter a valid email address</div>
              )}
            </div>

            {/* ROLE */}
            <div style={{ marginBottom:22 }}>
              <div style={{ fontSize:10, fontWeight:700, color:C.muted, textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:8 }}>Role</div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                {ROLES.map(r => {
                  const rm = ROLE_META[r];
                  const sel = inviteRole === r;
                  return (
                    <div key={r} onClick={()=>setInviteRole(r)} style={{ padding:"10px 12px", borderRadius:10, border:`1px solid ${sel?rm.color+"66":C.border}`, background:sel?`${rm.color}10`:"transparent", cursor:"pointer" }}>
                      <div style={{ fontSize:12, fontWeight:700, color:sel?rm.color:C.text }}>{r}</div>
                      <div style={{ fontSize:10, color:C.muted, marginTop:2 }}>{rm.desc}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* EMAIL DELIVERY STATUS — shown after sending */}
            {saved && emailSendStatus && (
              <div style={{ marginBottom:16 }}>
                {emailSendStatus === "sent" && (
                  <div style={{ background:"#0a1e16", border:"1px solid #10b98144", borderRadius:10, padding:"12px 16px" }}>
                    <div style={{ fontSize:12, fontWeight:700, color:C.green, marginBottom:4 }}>✓ Email delivered to {inviteEmail}</div>
                    <div style={{ fontSize:11, color:C.muted, lineHeight:1.6 }}>
                      {inviteName} will receive a branded invite with a button to create their account.
                      The link expires in 7 days.
                    </div>
                  </div>
                )}
                {emailSendStatus === "no_smtp" && (
                  <div style={{ background:"#2e1f0a", border:"1px solid #f59e0b44", borderRadius:10, padding:"12px 16px" }}>
                    <div style={{ fontSize:12, fontWeight:700, color:C.amber, marginBottom:4 }}>⚠ No email provider connected</div>
                    <div style={{ fontSize:11, color:C.muted, lineHeight:1.6, marginBottom:10 }}>
                      Connect an SMTP provider in <strong style={{ color:C.amber }}>Settings → Messaging</strong> to send emails automatically.
                      Share this link with {inviteName} manually for now:
                    </div>
                    <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                      <code style={{ flex:1, fontSize:9, color:"#a78bfa", background:"#1a1030", border:"1px solid #7c3aed33", padding:"6px 10px", borderRadius:6, wordBreak:"break-all", lineHeight:1.5 }}>
                        {`${window.location.origin}${window.location.pathname}?invite=...`}
                      </code>
                      <button
                        onClick={async () => {
                          const token = teamMembers[teamMembers.length-1]?.token;
                          if (token) {
                            const link = `${window.location.origin}${window.location.pathname}?invite=${token}`;
                            await navigator.clipboard.writeText(link);
                          }
                        }}
                        style={{ fontSize:10, fontWeight:700, color:"#a78bfa", background:"#2d1f5e", border:"1px solid #7c3aed44", padding:"6px 12px", borderRadius:7, cursor:"pointer", whiteSpace:"nowrap" }}
                      >
                        Copy link
                      </button>
                    </div>
                  </div>
                )}
                {emailSendStatus === "error" && (
                  <div style={{ background:"#1c0f0f", border:"1px solid #ef444444", borderRadius:10, padding:"12px 16px" }}>
                    <div style={{ fontSize:12, fontWeight:700, color:"#f87171", marginBottom:4 }}>✗ Email failed to send</div>
                    <div style={{ fontSize:11, color:C.muted, lineHeight:1.6, marginBottom:6 }}>
                      SMTP error: <code style={{ color:"#fca5a5", fontSize:10 }}>{emailSendError}</code>
                    </div>
                    <div style={{ fontSize:11, color:C.muted }}>
                      The invite is saved — copy the link below to share manually, or check your SMTP settings.
                    </div>
                    <button
                      onClick={async () => {
                        const token = teamMembers[teamMembers.length-1]?.token;
                        if (token) {
                          const link = `${window.location.origin}${window.location.pathname}?invite=${token}`;
                          await navigator.clipboard.writeText(link);
                        }
                      }}
                      style={{ marginTop:8, fontSize:10, fontWeight:700, color:"#a78bfa", background:"#2d1f5e", border:"1px solid #7c3aed44", padding:"5px 12px", borderRadius:7, cursor:"pointer" }}
                    >
                      Copy invite link
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* ACTIONS */}
            {!saved ? (
              <div style={{ display:"flex", gap:10 }}>
                <button onClick={()=>{ setShowInviteModal(false); setEmailSendStatus(null); }} style={{ background:C.surface, border:`1px solid ${C.border}`, color:C.muted, fontSize:12, fontWeight:600, padding:"10px 20px", borderRadius:9, cursor:"pointer" }}>
                  Cancel
                </button>
                <button
                  disabled={!inviteName.trim() || !isValidEmail || saving}
                  onClick={sendInvite}
                  style={{ flex:1, background:inviteName.trim()&&isValidEmail?`linear-gradient(135deg,${C.accent},${C.accent2})`:"#1a1a2e", border:`1px solid ${inviteName.trim()&&isValidEmail?C.accent+"44":C.border}`, color:inviteName.trim()&&isValidEmail?"#fff":C.muted, fontSize:13, fontWeight:700, padding:"10px", borderRadius:9, cursor:inviteName.trim()&&isValidEmail&&!saving?"pointer":"default", transition:"all .2s" }}
                >
                  {saving ? (
                    <span style={{ display:"flex", alignItems:"center", gap:8, justifyContent:"center" }}>
                      <div style={{ width:12, height:12, border:"2px solid #ffffff44", borderTop:"2px solid #fff", borderRadius:"50%", animation:"spin 0.8s linear infinite" }} />
                      Sending invite…
                    </span>
                  ) : `Send Invite to ${inviteRole}`}
                </button>
              </div>
            ) : (
              <button
                onClick={()=>{ setShowInviteModal(false); setEmailSendStatus(null); setSaved(false); setInviteName(""); setInviteEmail(""); setInviteRole("Show Manager"); }}
                style={{ width:"100%", background:C.surface, border:`1px solid ${C.border}`, color:C.muted, fontSize:13, fontWeight:600, padding:"10px", borderRadius:9, cursor:"pointer" }}
              >
                Done
              </button>
            )}
          </div>
        </div>
      )}

      {/* ── REMOVE CONFIRM MODAL ── */}
      {removeTarget && (() => {
        const m = teamMembers.find(m=>m.id===removeTarget);
        if (!m) return null;
        return (
          <div style={{ position:"fixed", inset:0, background:"#000000cc", zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center" }}
            onClick={e=>e.target===e.currentTarget&&setRemoveTarget(null)}>
            <div style={{ background:"#0e0e1a", border:"1px solid #ef444444", borderRadius:16, padding:"24px 28px", width:380, maxWidth:"90vw" }}>
              <div style={{ fontSize:15, fontWeight:700, color:C.text, marginBottom:8 }}>Remove team member?</div>
              <div style={{ fontSize:12, color:C.muted, marginBottom:20, lineHeight:1.6 }}>
                <strong style={{ color:C.text }}>{m.name}</strong> ({m.email}) will lose access to your Streamlive workspace immediately.
              </div>
              <div style={{ display:"flex", gap:10 }}>
                <button onClick={()=>setRemoveTarget(null)} style={{ flex:1, background:C.surface, border:`1px solid ${C.border}`, color:C.muted, fontSize:12, fontWeight:600, padding:"9px", borderRadius:9, cursor:"pointer" }}>Cancel</button>
                <button onClick={()=>removeMember(removeTarget)} style={{ flex:1, background:"#1c0f0f", border:"1px solid #ef444444", color:"#f87171", fontSize:12, fontWeight:700, padding:"9px", borderRadius:9, cursor:"pointer" }}>Remove</button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

function ScreenSettings({ persona }) {
  const [tab, setTab]           = useState("platforms");
  const [connections, setConnections] = useState({});
  const [modal, setModal]       = useState(null); // { type: "manychat"|"ig"|"tt"|"wn"|"am"|"email"|"sms" }
  const [modalStep, setModalStep]     = useState(1);
  const [apiKey, setApiKey]     = useState("");
  const [clientId, setClientId] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [refreshToken, setRefreshToken] = useState("");
  const [marketplaceId, setMarketplaceId] = useState("ATVPDKIKX0DER");
  const [accountSid, setAccountSid] = useState("");
  const [authToken, setAuthToken]   = useState("");
  const [fromNumber, setFromNumber] = useState("");
  const [smtpHost, setSmtpHost]     = useState("");
  const [smtpUser, setSmtpUser]     = useState("");
  const [smtpPass, setSmtpPass]     = useState("");
  const [connecting, setConnecting] = useState(false);
  const [platforms, setPlatforms]   = useState(
    persona.platforms.map(p => ({ id:p, connected:true }))
  );

  // ── Load persisted connections on mount ───────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        const result = await window.storage.get("strmlive:connections");
        if (result?.value) {
          setConnections(JSON.parse(result.value));
        }
      } catch(e) {
        // No saved connections yet
      }
    })();
  }, []);

  // ── Persist whenever connections change ───────────────────────────────────
  const saveConnections = async (updated) => {
    setConnections(updated);
    try {
      await window.storage.set("strmlive:connections", JSON.stringify(updated));
    } catch(e) {}
  };

  const connect = async (type, data) => {
    setConnecting(true);
    await new Promise(r => setTimeout(r, 1400)); // simulate API handshake
    const now = new Date().toLocaleDateString("en-US", { month:"short", day:"numeric", year:"numeric" });
    const updated = {
      ...connections,
      [type]: { ...data, connectedAt: now, status: "active" }
    };
    await saveConnections(updated);
    setConnecting(false);
    setModal(null);
    resetModalFields();
  };

  const disconnect = async (type) => {
    const updated = { ...connections };
    delete updated[type];
    await saveConnections(updated);
  };

  const resetModalFields = () => {
    setApiKey(""); setClientId(""); setClientSecret(""); setRefreshToken("");
    setAccountSid(""); setAuthToken(""); setFromNumber("");
    setSmtpHost(""); setSmtpUser(""); setSmtpPass("");
    setModalStep(1); setConnecting(false);
  };

  const openModal = (type) => { resetModalFields(); setModal(type); };

  const isConnected = (type) => !!connections[type];
  const conn        = (type) => connections[type] || {};

  // ── Modal configs per integration ─────────────────────────────────────────
  const INTEGRATIONS = {
    manychat: {
      label: "ManyChat",
      icon: "🤖",
      color: "#a78bfa",
      bg: "#2d1f5e",
      description: "Powers Instagram DM and TikTok DM automation. Official Meta + TikTok partner.",
      authType: "apikey",
      docsUrl: "https://manychat.com/",
      apiKeyLabel: "ManyChat API Key",
      apiKeyHint: "Found in ManyChat → Settings → API",
      apiKeyPlaceholder: "mc-xxxxxxxxxxxxxxxxxxxxxxxx",
      connectWith: () => connect("manychat", { account: "Your ManyChat workspace", scopes: ["IG DM", "TikTok DM", "Broadcasts", "Flows"] }),
    },
    ig: {
      label: "Instagram",
      icon: "📸",
      color: "#e1306c",
      bg: "#2d1020",
      description: "Instagram Business account — DM automation via ManyChat, audience insights.",
      authType: "oauth",
      scopes: ["instagram_basic", "instagram_manage_messages", "pages_read_engagement"],
      connectWith: () => connect("ig", { account: "@" + persona.shop.toLowerCase().replace(/\s/g,"_"), followers: "2,840", scopes: ["DM Automation", "Broadcasts", "Audience Insights"] }),
    },
    tt: {
      label: "TikTok",
      icon: "🎵",
      color: "#69c9d0",
      bg: "#0d2828",
      description: "TikTok Business account — DM keyword automations via ManyChat.",
      authType: "oauth",
      scopes: ["user.info.basic", "message.write", "message.read"],
      connectWith: () => connect("tt", { account: "@" + persona.shop.toLowerCase().replace(/\s/g,"_") + "_tt", followers: "5,210", scopes: ["DM Automation", "Keyword Triggers"] }),
    },
    wn: {
      label: "Whatnot",
      icon: "🟡",
      color: "#f59e0b",
      bg: "#2e1f0a",
      description: "Whatnot Seller API — inventory sync, show notifications to followers.",
      authType: "apikey",
      apiKeyLabel: "Whatnot API Key",
      apiKeyHint: "Request access at whatnot.com/seller-api (private beta)",
      apiKeyPlaceholder: "wn_live_xxxxxxxxxxxxxxxx",
      connectWith: () => connect("wn", { account: persona.shop, followers: "1,240", scopes: ["Inventory Sync", "Show Notifications", "Order Webhooks"] }),
    },
    am: {
      label: "Amazon SP-API",
      icon: "📦",
      color: "#f97316",
      bg: "#2e1608",
      description: "Amazon Selling Partner API — post-show order sync, transactional buyer messages.",
      authType: "spapi",
      connectWith: () => connect("am", { account: persona.shop + " Amazon Store", marketplaceId, scopes: ["Order Sync", "Buyer Messages", "Reports"] }),
    },
    sms: {
      label: "SMS (Twilio)",
      icon: "💬",
      color: "#a78bfa",
      bg: "#2d1f5e",
      description: "Send SMS campaigns and order notifications via Twilio.",
      authType: "twilio",
      connectWith: () => connect("sms", { account: fromNumber, scopes: ["SMS Campaigns", "Order Alerts"] }),
    },
    email: {
      label: "Email (SMTP)",
      icon: "✉️",
      color: "#3b82f6",
      bg: "#0f1e2e",
      description: "Send email campaigns via your own SMTP provider (SendGrid, Mailgun, etc.).",
      authType: "smtp",
      connectWith: () => connect("email", {
        account: smtpUser || persona.email,
        scopes:  ["Email Campaigns", "Transactional Email"],
        // Store SMTP credentials so the invite API function can use them
        _smtp: { host: smtpHost, user: smtpUser, pass: smtpPass, port: "587" },
      }),
    },
  };

  const PLATFORM_LIST = ["WN","TT","AM","IG"];
  const platformData = {
    WN: { accountType:"Seller",              note:"Orders, buyers, inventory + real-time webhooks" },
    TT: { accountType:"Seller Account",      note:"Requires TikTok Seller Account" },
    AM: { accountType:"Brand Registry / Influencer", note:"Post-show order sync via SP-API — ~24h delay" },
    IG: { accountType:"Business or Creator", note:"Audience insights + DM automation (Pro)" },
  };

  // ── Connected status card ─────────────────────────────────────────────────
  const ConnectedCard = ({ type }) => {
    const intg = INTEGRATIONS[type];
    const c    = conn(type);
    return (
      <div style={{ background:`${intg.color}0d`, border:`1px solid ${intg.color}44`, borderRadius:12, padding:"14px 18px", display:"flex", alignItems:"flex-start", gap:14 }}>
        <div style={{ width:38, height:38, borderRadius:10, background:`${intg.color}18`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0 }}>{intg.icon}</div>
        <div style={{ flex:1 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
            <span style={{ fontSize:13, fontWeight:700, color:C.text }}>{intg.label}</span>
            <span style={{ fontSize:9, fontWeight:700, color:C.green, background:"#0a1e16", border:"1px solid #10b98133", padding:"2px 7px", borderRadius:5 }}>✓ CONNECTED</span>
          </div>
          <div style={{ fontSize:11, color:"#9ca3af", marginBottom:4 }}>{c.account}</div>
          <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
            {(c.scopes||[]).map(s => (
              <span key={s} style={{ fontSize:9, fontWeight:600, color:intg.color, background:intg.bg, border:`1px solid ${intg.color}33`, padding:"1px 7px", borderRadius:4 }}>{s}</span>
            ))}
          </div>
          <div style={{ fontSize:9, color:C.subtle, marginTop:5 }}>Connected {c.connectedAt} · status: active</div>
        </div>
        <button onClick={()=>disconnect(type)} style={{ fontSize:10, fontWeight:700, color:"#f87171", background:"#1c0f0f", border:"1px solid #ef444433", padding:"6px 13px", borderRadius:7, cursor:"pointer", flexShrink:0, whiteSpace:"nowrap" }}>
          Disconnect
        </button>
      </div>
    );
  };

  // ── Connection modal ───────────────────────────────────────────────────────
  const Modal = () => {
    if (!modal) return null;
    const intg = INTEGRATIONS[modal];
    const canSubmit = {
      manychat: apiKey.trim().length > 4,
      ig:       true,
      tt:       true,
      wn:       apiKey.trim().length > 4,
      am:       clientId.trim().length > 4 && clientSecret.trim().length > 4 && refreshToken.trim().length > 4,
      sms:      accountSid.trim().length > 4 && authToken.trim().length > 4 && fromNumber.trim().length > 4,
      email:    smtpHost.trim().length > 2 && smtpUser.trim().length > 2 && smtpPass.trim().length > 4,
    }[modal] || false;

    return (
      <div style={{ position:"fixed", inset:0, background:"#000000cc", zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center" }} onClick={e=>e.target===e.currentTarget&&setModal(null)}>
        <div style={{ background:"#0e0e1a", border:`1px solid ${intg.color}44`, borderRadius:18, padding:"28px 32px", width:500, maxWidth:"90vw", maxHeight:"85vh", overflowY:"auto" }}>

          {/* HEADER */}
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
            <div style={{ width:44, height:44, borderRadius:12, background:`${intg.color}18`, border:`1px solid ${intg.color}33`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22 }}>{intg.icon}</div>
            <div>
              <div style={{ fontSize:16, fontWeight:700, color:C.text }}>Connect {intg.label}</div>
              <div style={{ fontSize:11, color:C.muted, marginTop:2 }}>{intg.description}</div>
            </div>
            <button onClick={()=>setModal(null)} style={{ marginLeft:"auto", background:"none", border:"none", color:C.muted, fontSize:18, cursor:"pointer", flexShrink:0 }}>✕</button>
          </div>

          {/* ── AUTH FORM ── */}

          {/* MANYCHAT */}
          {modal === "manychat" && (
            <div>
              <div style={{ background:"#0d0d18", border:`1px solid ${C.border}`, borderRadius:12, padding:"16px 18px", marginBottom:14 }}>
                <div style={{ fontSize:10, fontWeight:700, color:C.muted, textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:12 }}>How to get your ManyChat API Key</div>
                {[
                  { n:1, text:"Go to your ManyChat account", link:"https://app.manychat.com", linkLabel:"app.manychat.com →" },
                  { n:2, text:'Click Settings in the left sidebar, then select "API" tab' },
                  { n:3, text:'Click "Generate API Key" — copy the full key starting with mc-' },
                  { n:4, text:"Paste it below" },
                ].map(s=>(
                  <div key={s.n} style={{ display:"flex", gap:10, marginBottom:10, alignItems:"flex-start" }}>
                    <div style={{ width:20, height:20, borderRadius:"50%", background:"#2d1f5e", border:"1px solid #7c3aed44", display:"flex", alignItems:"center", justifyContent:"center", fontSize:9, fontWeight:700, color:"#a78bfa", flexShrink:0, marginTop:1 }}>{s.n}</div>
                    <div style={{ flex:1 }}>
                      <span style={{ fontSize:11, color:"#d1d5db", lineHeight:1.5 }}>{s.text} </span>
                      {s.link && <a href={s.link} target="_blank" rel="noopener noreferrer" style={{ fontSize:11, color:"#a78bfa", textDecoration:"none", fontWeight:600 }}>{s.linkLabel}</a>}
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ marginBottom:8 }}>
                <div style={{ fontSize:10, fontWeight:700, color:C.muted, textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:6 }}>ManyChat API Key</div>
                <input value={apiKey} onChange={e=>setApiKey(e.target.value)} placeholder="mc-xxxxxxxxxxxxxxxxxxxxxxxx"
                  style={{ width:"100%", background:"#07070f", border:`1px solid ${C.border2}`, borderRadius:9, padding:"10px 14px", color:C.text, fontSize:13, outline:"none", fontFamily:"'JetBrains Mono',monospace" }} />
              </div>
              <div style={{ display:"flex", gap:12, flexWrap:"wrap", marginTop:10 }}>
                <a href="https://app.manychat.com" target="_blank" rel="noopener noreferrer" style={{ fontSize:11, color:"#a78bfa", textDecoration:"none", fontWeight:600 }}>Open ManyChat →</a>
                <a href="https://manychat.com/blog/manychat-api/" target="_blank" rel="noopener noreferrer" style={{ fontSize:11, color:C.muted, textDecoration:"none" }}>API docs</a>
              </div>
            </div>
          )}

          {/* INSTAGRAM OAuth */}
          {modal === "ig" && (
            <div>
              {modalStep === 1 && (
                <div>
                  <div style={{ background:"#1a0810", border:"1px solid #e1306c33", borderRadius:12, padding:"16px 18px", marginBottom:14 }}>
                    <div style={{ fontSize:10, fontWeight:700, color:C.muted, textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:12 }}>Before you connect</div>
                    {[
                      { n:1, text:"You need an Instagram Business or Creator account", link:"https://www.facebook.com/business/help/502981923235522", linkLabel:"Switch here →" },
                      { n:2, text:"Your Instagram must be linked to a Facebook Page", link:"https://www.facebook.com/help/1148909221857370", linkLabel:"Link guide →" },
                      { n:3, text:"ManyChat must already be connected (step above) as it handles the DM routing" },
                      { n:4, text:'Click "Authorize Instagram" below — sign into Facebook and grant all permissions' },
                    ].map(s=>(
                      <div key={s.n} style={{ display:"flex", gap:10, marginBottom:10, alignItems:"flex-start" }}>
                        <div style={{ width:20, height:20, borderRadius:"50%", background:"#2d1020", border:"1px solid #e1306c33", display:"flex", alignItems:"center", justifyContent:"center", fontSize:9, fontWeight:700, color:"#e1306c", flexShrink:0, marginTop:1 }}>{s.n}</div>
                        <div style={{ flex:1 }}>
                          <span style={{ fontSize:11, color:"#d1d5db", lineHeight:1.5 }}>{s.text} </span>
                          {s.link && <a href={s.link} target="_blank" rel="noopener noreferrer" style={{ fontSize:11, color:"#e1306c", textDecoration:"none", fontWeight:600 }}>{s.linkLabel}</a>}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:10, padding:"12px 16px", marginBottom:14 }}>
                    <div style={{ fontSize:10, fontWeight:700, color:C.muted, marginBottom:8, textTransform:"uppercase", letterSpacing:"0.07em" }}>Permissions we'll request</div>
                    {["instagram_basic","instagram_manage_messages","pages_messaging","pages_read_engagement"].map(s=>(
                      <div key={s} style={{ display:"flex", alignItems:"center", gap:8, padding:"5px 0", borderBottom:`1px solid ${C.border}` }}>
                        <span style={{ color:C.green, fontSize:11 }}>✓</span>
                        <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10, color:"#9ca3af" }}>{s}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ display:"flex", gap:12 }}>
                    <a href="https://business.instagram.com/" target="_blank" rel="noopener noreferrer" style={{ fontSize:11, color:"#e1306c", textDecoration:"none", fontWeight:600 }}>Instagram Business →</a>
                    <a href="https://manychat.com/blog/instagram-automation/" target="_blank" rel="noopener noreferrer" style={{ fontSize:11, color:C.muted, textDecoration:"none" }}>Setup guide</a>
                  </div>
                </div>
              )}
              {modalStep === 2 && (
                <div style={{ background:"#0a1e16", border:"1px solid #10b98133", borderRadius:12, padding:"22px", marginBottom:16, textAlign:"center" }}>
                  <div style={{ fontSize:28, marginBottom:8 }}>✓</div>
                  <div style={{ fontSize:14, fontWeight:700, color:C.green }}>Instagram connected</div>
                  <div style={{ fontSize:11, color:C.muted, marginTop:4 }}>DM automation and broadcasts are now active via ManyChat</div>
                </div>
              )}
            </div>
          )}

          {/* TIKTOK OAuth */}
          {modal === "tt" && (
            <div>
              {modalStep === 1 && (
                <div>
                  <div style={{ background:"#050d0d", border:"1px solid #69c9d033", borderRadius:12, padding:"16px 18px", marginBottom:14 }}>
                    <div style={{ fontSize:10, fontWeight:700, color:C.muted, textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:12 }}>Before you connect</div>
                    {[
                      { n:1, text:"You need a TikTok Business account (not personal/creator)", link:"https://www.tiktok.com/business/en/blog/tiktok-business-account-vs-creator-account", linkLabel:"How to switch →" },
                      { n:2, text:"Currently available in US and non-EU/UK regions only" },
                      { n:3, text:"ManyChat must already be connected — TikTok DMs route through it" },
                      { n:4, text:'Click "Authorize TikTok" and sign in with your TikTok Business credentials' },
                    ].map(s=>(
                      <div key={s.n} style={{ display:"flex", gap:10, marginBottom:10, alignItems:"flex-start" }}>
                        <div style={{ width:20, height:20, borderRadius:"50%", background:"#0d2828", border:"1px solid #69c9d033", display:"flex", alignItems:"center", justifyContent:"center", fontSize:9, fontWeight:700, color:"#69c9d0", flexShrink:0, marginTop:1 }}>{s.n}</div>
                        <div style={{ flex:1 }}>
                          <span style={{ fontSize:11, color:"#d1d5db", lineHeight:1.5 }}>{s.text} </span>
                          {s.link && <a href={s.link} target="_blank" rel="noopener noreferrer" style={{ fontSize:11, color:"#69c9d0", textDecoration:"none", fontWeight:600 }}>{s.linkLabel}</a>}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:10, padding:"12px 16px", marginBottom:14 }}>
                    <div style={{ fontSize:10, fontWeight:700, color:C.muted, marginBottom:8, textTransform:"uppercase", letterSpacing:"0.07em" }}>Permissions we'll request</div>
                    {["user.info.basic","message.write","message.read","video.list"].map(s=>(
                      <div key={s} style={{ display:"flex", alignItems:"center", gap:8, padding:"5px 0", borderBottom:`1px solid ${C.border}` }}>
                        <span style={{ color:C.green, fontSize:11 }}>✓</span>
                        <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10, color:"#9ca3af" }}>{s}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ display:"flex", gap:12 }}>
                    <a href="https://www.tiktok.com/business/en" target="_blank" rel="noopener noreferrer" style={{ fontSize:11, color:"#69c9d0", textDecoration:"none", fontWeight:600 }}>TikTok for Business →</a>
                    <a href="https://help.manychat.com/hc/en-us/articles/17928990909084" target="_blank" rel="noopener noreferrer" style={{ fontSize:11, color:C.muted, textDecoration:"none" }}>ManyChat TikTok setup</a>
                  </div>
                </div>
              )}
              {modalStep === 2 && (
                <div style={{ background:"#0a1e16", border:"1px solid #10b98133", borderRadius:12, padding:"22px", marginBottom:16, textAlign:"center" }}>
                  <div style={{ fontSize:28, marginBottom:8 }}>✓</div>
                  <div style={{ fontSize:14, fontWeight:700, color:C.green }}>TikTok connected</div>
                  <div style={{ fontSize:11, color:C.muted, marginTop:4 }}>Keyword automations and broadcasts are now active via ManyChat</div>
                </div>
              )}
            </div>
          )}

          {/* WHATNOT */}
          {modal === "wn" && (
            <div>
              <div style={{ background:"#0d0a04", border:"1px solid #f59e0b33", borderRadius:12, padding:"16px 18px", marginBottom:14 }}>
                <div style={{ fontSize:10, fontWeight:700, color:C.muted, textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:12 }}>How to get your Whatnot API Key</div>
                {[
                  { n:1, text:"Request Seller API access (currently private beta)", link:"https://seller.whatnot.com/api", linkLabel:"Apply at seller.whatnot.com/api →" },
                  { n:2, text:"Once approved, go to Whatnot Seller Hub → Settings → Developer", link:"https://seller.whatnot.com/settings", linkLabel:"Seller Hub →" },
                  { n:3, text:'Click "Generate API Key" under the API section' },
                  { n:4, text:'Copy the key starting with "wn_live_" and paste it below' },
                ].map(s=>(
                  <div key={s.n} style={{ display:"flex", gap:10, marginBottom:10, alignItems:"flex-start" }}>
                    <div style={{ width:20, height:20, borderRadius:"50%", background:"#2e1f0a", border:"1px solid #f59e0b33", display:"flex", alignItems:"center", justifyContent:"center", fontSize:9, fontWeight:700, color:"#f59e0b", flexShrink:0, marginTop:1 }}>{s.n}</div>
                    <div style={{ flex:1 }}>
                      <span style={{ fontSize:11, color:"#d1d5db", lineHeight:1.5 }}>{s.text} </span>
                      {s.link && <a href={s.link} target="_blank" rel="noopener noreferrer" style={{ fontSize:11, color:"#f59e0b", textDecoration:"none", fontWeight:600 }}>{s.linkLabel}</a>}
                    </div>
                  </div>
                ))}
                <div style={{ background:"#1a0e00", border:"1px solid #f59e0b22", borderRadius:8, padding:"8px 12px", marginTop:8, fontSize:10, color:"#f59e0b", lineHeight:1.6 }}>
                  ⚠ API access grants inventory sync and show notifications only. Whatnot does not expose a bulk buyer DM endpoint.
                </div>
              </div>
              <div style={{ marginBottom:8 }}>
                <div style={{ fontSize:10, fontWeight:700, color:C.muted, textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:6 }}>Whatnot API Key</div>
                <input value={apiKey} onChange={e=>setApiKey(e.target.value)} placeholder="wn_live_xxxxxxxxxxxxxxxx"
                  style={{ width:"100%", background:"#07070f", border:`1px solid ${C.border2}`, borderRadius:9, padding:"10px 14px", color:C.text, fontSize:13, outline:"none", fontFamily:"'JetBrains Mono',monospace" }} />
              </div>
              <div style={{ display:"flex", gap:12, flexWrap:"wrap", marginTop:10 }}>
                <a href="https://seller.whatnot.com/api" target="_blank" rel="noopener noreferrer" style={{ fontSize:11, color:"#f59e0b", textDecoration:"none", fontWeight:600 }}>Apply for API access →</a>
                <a href="https://seller.whatnot.com" target="_blank" rel="noopener noreferrer" style={{ fontSize:11, color:C.muted, textDecoration:"none" }}>Seller Hub</a>
              </div>
            </div>
          )}

          {/* AMAZON SP-API */}
          {modal === "am" && (
            <div>
              <div style={{ background:"#0d0701", border:"1px solid #f9731633", borderRadius:12, padding:"16px 18px", marginBottom:14 }}>
                <div style={{ fontSize:10, fontWeight:700, color:C.muted, textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:12 }}>How to get your SP-API credentials</div>
                {[
                  { n:1, text:"Sign into Seller Central and go to Apps & Services → Develop Apps", link:"https://sellercentral.amazon.com/sellerapp/seller-apps", linkLabel:"Seller Central →" },
                  { n:2, text:'Click "Add New App Client" — give it a name like "Streamlive"' },
                  { n:3, text:'Under "Roles", enable: Reports, Orders, Buyer Communication, and Notifications' },
                  { n:4, text:"Copy the LWA Client ID and Client Secret from the app credentials page" },
                  { n:5, text:"Generate a Refresh Token using the SP-API Auth workflow — or use the token tool below", link:"https://github.com/amzn/selling-partner-api-docs/blob/main/guides/en-US/developer-guide/SellingPartnerApiDeveloperGuide.md", linkLabel:"SP-API auth guide →" },
                ].map(s=>(
                  <div key={s.n} style={{ display:"flex", gap:10, marginBottom:10, alignItems:"flex-start" }}>
                    <div style={{ width:20, height:20, borderRadius:"50%", background:"#2e1608", border:"1px solid #f9731633", display:"flex", alignItems:"center", justifyContent:"center", fontSize:9, fontWeight:700, color:"#f97316", flexShrink:0, marginTop:1 }}>{s.n}</div>
                    <div style={{ flex:1 }}>
                      <span style={{ fontSize:11, color:"#d1d5db", lineHeight:1.5 }}>{s.text} </span>
                      {s.link && <a href={s.link} target="_blank" rel="noopener noreferrer" style={{ fontSize:11, color:"#f97316", textDecoration:"none", fontWeight:600 }}>{s.linkLabel}</a>}
                    </div>
                  </div>
                ))}
              </div>
              {[
                { label:"LWA Client ID",     val:clientId,      set:setClientId,      ph:"amzn1.application-oa2-client.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" },
                { label:"LWA Client Secret", val:clientSecret,  set:setClientSecret,  ph:"amzn1.oa2-cs.v1.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" },
                { label:"Refresh Token",     val:refreshToken,  set:setRefreshToken,  ph:"Atz|IwEBIxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" },
                { label:"Marketplace ID",    val:marketplaceId, set:setMarketplaceId, ph:"ATVPDKIKX0DER  (US)" },
              ].map(f=>(
                <div key={f.label} style={{ marginBottom:11 }}>
                  <div style={{ fontSize:10, fontWeight:700, color:C.muted, textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:5 }}>{f.label}</div>
                  <input value={f.val} onChange={e=>f.set(e.target.value)} placeholder={f.ph}
                    style={{ width:"100%", background:"#07070f", border:`1px solid ${C.border2}`, borderRadius:8, padding:"9px 12px", color:C.text, fontSize:11, outline:"none", fontFamily:"'JetBrains Mono',monospace" }} />
                </div>
              ))}
              <div style={{ background:"#100400", border:"1px solid #f9731622", borderRadius:8, padding:"8px 12px", fontSize:10, color:"#f97316", lineHeight:1.6, marginTop:4 }}>
                ℹ Marketplace IDs: US = ATVPDKIKX0DER · CA = A2EUQ1WTGCTBG2 · UK = A1F83G8C2ARO7P · DE = A1PA6795UKMFR9
              </div>
              <div style={{ display:"flex", gap:12, flexWrap:"wrap", marginTop:12 }}>
                <a href="https://sellercentral.amazon.com/sellerapp/seller-apps" target="_blank" rel="noopener noreferrer" style={{ fontSize:11, color:"#f97316", textDecoration:"none", fontWeight:600 }}>Seller Central Apps →</a>
                <a href="https://developer-docs.amazon.com/sp-api/docs/get-started" target="_blank" rel="noopener noreferrer" style={{ fontSize:11, color:C.muted, textDecoration:"none" }}>SP-API docs</a>
                <a href="https://developer-docs.amazon.com/sp-api/docs/messaging-api" target="_blank" rel="noopener noreferrer" style={{ fontSize:11, color:C.muted, textDecoration:"none" }}>Messaging API</a>
              </div>
            </div>
          )}

          {/* TWILIO SMS */}
          {modal === "sms" && (
            <div>
              <div style={{ background:"#0d0a14", border:"1px solid #a78bfa33", borderRadius:12, padding:"16px 18px", marginBottom:14 }}>
                <div style={{ fontSize:10, fontWeight:700, color:C.muted, textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:12 }}>How to get your Twilio credentials</div>
                {[
                  { n:1, text:"Create a free Twilio account or sign in", link:"https://www.twilio.com/try-twilio", linkLabel:"twilio.com →" },
                  { n:2, text:"From the Twilio Console homepage, copy your Account SID and Auth Token", link:"https://console.twilio.com/", linkLabel:"Console →" },
                  { n:3, text:"Go to Phone Numbers → Manage → Buy a Number to get a sending number", link:"https://console.twilio.com/us1/develop/phone-numbers/manage/search", linkLabel:"Buy number →" },
                  { n:4, text:"Optionally create a Messaging Service for better deliverability", link:"https://console.twilio.com/us1/develop/sms/services", linkLabel:"Messaging Services →" },
                ].map(s=>(
                  <div key={s.n} style={{ display:"flex", gap:10, marginBottom:10, alignItems:"flex-start" }}>
                    <div style={{ width:20, height:20, borderRadius:"50%", background:"#2d1f5e", border:"1px solid #a78bfa33", display:"flex", alignItems:"center", justifyContent:"center", fontSize:9, fontWeight:700, color:"#a78bfa", flexShrink:0, marginTop:1 }}>{s.n}</div>
                    <div style={{ flex:1 }}>
                      <span style={{ fontSize:11, color:"#d1d5db", lineHeight:1.5 }}>{s.text} </span>
                      {s.link && <a href={s.link} target="_blank" rel="noopener noreferrer" style={{ fontSize:11, color:"#a78bfa", textDecoration:"none", fontWeight:600 }}>{s.linkLabel}</a>}
                    </div>
                  </div>
                ))}
              </div>
              {[
                { label:"Account SID",  val:accountSid, set:setAccountSid, ph:"ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx", hint:"Starts with AC — from Twilio Console homepage" },
                { label:"Auth Token",   val:authToken,  set:setAuthToken,  ph:"••••••••••••••••••••••••••••••••", hint:"Hidden by default — click the eye icon to reveal" },
                { label:"From Number",  val:fromNumber, set:setFromNumber, ph:"+15551234567", hint:"Must be a Twilio phone number with SMS capability" },
              ].map(f=>(
                <div key={f.label} style={{ marginBottom:12 }}>
                  <div style={{ fontSize:10, fontWeight:700, color:C.muted, textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:5 }}>{f.label}</div>
                  <input value={f.val} onChange={e=>f.set(e.target.value)} placeholder={f.ph}
                    style={{ width:"100%", background:"#07070f", border:`1px solid ${C.border2}`, borderRadius:8, padding:"9px 12px", color:C.text, fontSize:11, outline:"none", fontFamily:"'JetBrains Mono',monospace" }} />
                  <div style={{ fontSize:9, color:C.subtle, marginTop:4 }}>💡 {f.hint}</div>
                </div>
              ))}
              <div style={{ display:"flex", gap:12, flexWrap:"wrap", marginTop:8 }}>
                <a href="https://console.twilio.com/" target="_blank" rel="noopener noreferrer" style={{ fontSize:11, color:"#a78bfa", textDecoration:"none", fontWeight:600 }}>Open Twilio Console →</a>
                <a href="https://www.twilio.com/docs/sms/quickstart" target="_blank" rel="noopener noreferrer" style={{ fontSize:11, color:C.muted, textDecoration:"none" }}>SMS quickstart</a>
              </div>
            </div>
          )}

          {/* EMAIL SMTP */}
          {modal === "email" && (
            <div>
              <div style={{ background:"#060c18", border:"1px solid #3b82f633", borderRadius:12, padding:"16px 18px", marginBottom:14 }}>
                <div style={{ fontSize:10, fontWeight:700, color:C.muted, textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:10 }}>Choose your email provider</div>
                <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:14 }}>
                  {[
                    { name:"SendGrid",  host:"smtp.sendgrid.net",    user:"apikey",       link:"https://app.sendgrid.com/settings/api_keys", color:"#3b82f6" },
                    { name:"Mailgun",   host:"smtp.mailgun.org",      user:"postmaster@yourdomain.com", link:"https://app.mailgun.com/mg/dashboard", color:"#f97316" },
                    { name:"Postmark",  host:"smtp.postmarkapp.com",  user:"your-api-token", link:"https://account.postmarkapp.com/servers", color:"#f59e0b" },
                    { name:"Gmail",     host:"smtp.gmail.com",         user:"your@gmail.com", link:"https://myaccount.google.com/apppasswords", color:"#10b981" },
                  ].map(p=>(
                    <button key={p.name} onClick={()=>{ setSmtpHost(p.host); setSmtpUser(p.user); }}
                      style={{ fontSize:10, fontWeight:700, color:p.color, background:p.color+"15", border:`1px solid ${p.color}44`, padding:"4px 12px", borderRadius:6, cursor:"pointer" }}>
                      {p.name}
                    </button>
                  ))}
                </div>
                <div style={{ fontSize:10, fontWeight:700, color:C.muted, textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:10 }}>How to get your credentials</div>
                {[
                  { n:1, text:"Pick a provider above — it auto-fills the SMTP host and username format", },
                  { n:2, text:"For SendGrid: create an API key with Mail Send permission", link:"https://app.sendgrid.com/settings/api_keys", linkLabel:"SendGrid API keys →" },
                  { n:3, text:"For Mailgun: find SMTP credentials under Domains → your domain → SMTP", link:"https://app.mailgun.com/mg/sending/domains", linkLabel:"Mailgun domains →" },
                  { n:4, text:"For Gmail: enable 2FA then create an App Password (not your login password)", link:"https://myaccount.google.com/apppasswords", linkLabel:"App passwords →" },
                ].map(s=>(
                  <div key={s.n} style={{ display:"flex", gap:10, marginBottom:9, alignItems:"flex-start" }}>
                    <div style={{ width:20, height:20, borderRadius:"50%", background:"#0f1e2e", border:"1px solid #3b82f633", display:"flex", alignItems:"center", justifyContent:"center", fontSize:9, fontWeight:700, color:"#3b82f6", flexShrink:0, marginTop:1 }}>{s.n}</div>
                    <div style={{ flex:1 }}>
                      <span style={{ fontSize:11, color:"#d1d5db", lineHeight:1.5 }}>{s.text} </span>
                      {s.link && <a href={s.link} target="_blank" rel="noopener noreferrer" style={{ fontSize:11, color:"#3b82f6", textDecoration:"none", fontWeight:600 }}>{s.linkLabel}</a>}
                    </div>
                  </div>
                ))}
              </div>
              {[
                { label:"SMTP Host",      val:smtpHost, set:setSmtpHost, ph:"smtp.sendgrid.net",         hint:"Port 587 (TLS) is standard for most providers" },
                { label:"Username",       val:smtpUser, set:setSmtpUser, ph:"apikey",                    hint:"For SendGrid this is literally the word 'apikey'" },
                { label:"Password / Key", val:smtpPass, set:setSmtpPass, ph:"SG.xxxxxxxxxxxxxxxxxxxxxxxx", hint:"Your API key or SMTP password — never your account login" },
              ].map(f=>(
                <div key={f.label} style={{ marginBottom:12 }}>
                  <div style={{ fontSize:10, fontWeight:700, color:C.muted, textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:5 }}>{f.label}</div>
                  <input value={f.val} onChange={e=>f.set(e.target.value)} placeholder={f.ph}
                    style={{ width:"100%", background:"#07070f", border:`1px solid ${C.border2}`, borderRadius:8, padding:"9px 12px", color:C.text, fontSize:11, outline:"none", fontFamily:"'JetBrains Mono',monospace" }} />
                  <div style={{ fontSize:9, color:C.subtle, marginTop:4 }}>💡 {f.hint}</div>
                </div>
              ))}
              <div style={{ display:"flex", gap:12, flexWrap:"wrap", marginTop:8 }}>
                <a href="https://app.sendgrid.com/settings/api_keys" target="_blank" rel="noopener noreferrer" style={{ fontSize:11, color:"#3b82f6", textDecoration:"none", fontWeight:600 }}>SendGrid API keys →</a>
                <a href="https://app.mailgun.com/mg/dashboard" target="_blank" rel="noopener noreferrer" style={{ fontSize:11, color:C.muted, textDecoration:"none" }}>Mailgun</a>
                <a href="https://account.postmarkapp.com/" target="_blank" rel="noopener noreferrer" style={{ fontSize:11, color:C.muted, textDecoration:"none" }}>Postmark</a>
              </div>
            </div>
          )}

          {/* ACTION BUTTONS */}
          <div style={{ display:"flex", gap:10, marginTop:20 }}>
            <button onClick={()=>setModal(null)} style={{ background:C.surface, border:`1px solid ${C.border}`, color:C.muted, fontSize:12, fontWeight:600, padding:"10px 20px", borderRadius:9, cursor:"pointer" }}>
              Cancel
            </button>
            <button
              disabled={!canSubmit || connecting}
              onClick={async ()=>{
                if ((modal==="ig"||modal==="tt") && modalStep===1) {
                  setModalStep(2);
                  return;
                }
                await intg.connectWith();
              }}
              style={{ flex:1, background:canSubmit&&!connecting?`linear-gradient(135deg,${intg.color},${intg.color}bb)`:"#1a1a2e", border:`1px solid ${canSubmit?intg.color+"66":C.border}`, color:canSubmit&&!connecting?"#fff":C.muted, fontSize:13, fontWeight:700, padding:"10px", borderRadius:9, cursor:canSubmit&&!connecting?"pointer":"default", transition:"all .2s" }}
            >
              {connecting ? (
                <span style={{ display:"flex", alignItems:"center", gap:8, justifyContent:"center" }}>
                  <div style={{ width:12, height:12, border:"2px solid #ffffff44", borderTop:"2px solid #fff", borderRadius:"50%", animation:"spin 0.8s linear infinite" }} />
                  Connecting…
                </span>
              ) : (modal==="ig"||modal==="tt") && modalStep===1 ? `Authorize ${intg.label} →`
                : `Connect ${intg.label}`}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div style={{ padding:"28px 32px", overflowY:"auto", height:"100%", position:"relative" }}>
      <Modal />

      <div style={{ fontFamily:"'Syne',sans-serif", fontSize:22, fontWeight:800, color:C.text, letterSpacing:"-0.5px", marginBottom:20 }}>Settings</div>

      {/* TABS */}
      <div style={{ display:"flex", gap:0, marginBottom:24, borderBottom:`1px solid ${C.border}` }}>
        {["platforms","messaging","profile","billing","team"].map(t=>(
          <button key={t} onClick={()=>setTab(t)} style={{ background:"none", border:"none", borderBottom:`2px solid ${tab===t?C.accent:"transparent"}`, color:tab===t?"#a78bfa":C.muted, fontSize:12, fontWeight:tab===t?700:400, padding:"0 16px 12px", cursor:"pointer", textTransform:"capitalize" }}>
            {t}
          </button>
        ))}
      </div>

      {/* ── PLATFORMS TAB ── */}
      {tab==="platforms" && (
        <div className="fade-up" style={{ maxWidth:620 }}>
          <div style={{ fontSize:12, color:C.muted, marginBottom:20 }}>Connect your selling platforms to import buyer and order data.</div>
          {PLATFORM_LIST.map(pid=>{
            const p  = PLATFORMS[pid];
            const pd = platformData[pid];
            const isConn = platforms.find(pl=>pl.id===pid)?.connected;
            return (
              <div key={pid} style={{ background:C.surface, border:`1px solid ${isConn?p.color+"44":C.border}`, borderRadius:14, padding:"18px 20px", marginBottom:10, display:"flex", alignItems:"center", gap:14 }}>
                <div style={{ width:42, height:42, borderRadius:11, background:`${p.color}18`, border:`1px solid ${p.color}33`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:800, color:p.color, flexShrink:0 }}>{pid}</div>
                <div style={{ flex:1 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:3 }}>
                    <span style={{ fontSize:13, fontWeight:700, color:C.text }}>{p.label}</span>
                    <span style={{ fontSize:9, fontWeight:700, color:p.color, background:`${p.color}18`, border:`1px solid ${p.color}33`, padding:"2px 7px", borderRadius:6, textTransform:"uppercase" }}>{pd.accountType}</span>
                  </div>
                  <div style={{ fontSize:11, color:C.muted }}>{pd.note}</div>
                  {isConn && <div style={{ fontSize:10, color:C.green, marginTop:4 }}>● Connected · Last sync 12 min ago · 847 buyers</div>}
                </div>
                {isConn
                  ? <button onClick={()=>setPlatforms(ps=>ps.map(pl=>pl.id===pid?{...pl,connected:false}:pl))} style={{ fontSize:11, color:"#f87171", background:"#1c0f0f", border:"1px solid #ef444433", padding:"7px 14px", borderRadius:8, cursor:"pointer" }}>Disconnect</button>
                  : <button onClick={()=>setPlatforms(ps=>{const ex=ps.find(pl=>pl.id===pid);return ex?ps.map(pl=>pl.id===pid?{...pl,connected:true}:pl):[...ps,{id:pid,connected:true}]})} style={{ fontSize:11, color:"#fff", background:`linear-gradient(135deg,${C.accent},${C.accent2})`, border:"none", padding:"7px 14px", borderRadius:8, cursor:"pointer" }}>Connect</button>
                }
              </div>
            );
          })}
        </div>
      )}

      {/* ── MESSAGING TAB ── */}
      {tab==="messaging" && (
        <div className="fade-up" style={{ maxWidth:680 }}>

          {/* CONNECTION STATUS OVERVIEW */}
          <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:20 }}>
            {Object.keys(INTEGRATIONS).map(type=>{
              const intg = INTEGRATIONS[type];
              const connected = isConnected(type);
              return (
                <div key={type} style={{ display:"flex", alignItems:"center", gap:6, background:connected?intg.bg:C.surface2, border:`1px solid ${connected?intg.color+"44":C.border}`, borderRadius:8, padding:"5px 10px" }}>
                  <span style={{ fontSize:12 }}>{intg.icon}</span>
                  <span style={{ fontSize:10, fontWeight:700, color:connected?intg.color:C.subtle }}>{intg.label}</span>
                  <div style={{ width:6, height:6, borderRadius:"50%", background:connected?C.green:C.border2 }} />
                </div>
              );
            })}
          </div>

          {/* EACH INTEGRATION */}
          {[
            { type:"manychat", group:"Social DM Gateway" },
            { type:"ig",       group:"Social DM Gateway" },
            { type:"tt",       group:"Social DM Gateway" },
            { type:"wn",       group:"Platform Native"   },
            { type:"am",       group:"Platform Native"   },
            { type:"sms",      group:"Direct Outreach"   },
            { type:"email",    group:"Direct Outreach"   },
          ].reduce((acc, item) => {
            const last = acc[acc.length-1];
            if (!last || last.group !== item.group) acc.push({ group:item.group, items:[item] });
            else last.items.push(item);
            return acc;
          }, []).map(group=>(
            <div key={group.group} style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:14, padding:"18px 20px", marginBottom:12 }}>
              <div style={{ fontSize:10, fontWeight:700, color:C.subtle, textTransform:"uppercase", letterSpacing:"0.09em", marginBottom:14 }}>{group.group}</div>
              {group.items.map(({ type }, i) => {
                const intg = INTEGRATIONS[type];
                const connected = isConnected(type);
                return (
                  <div key={type} style={{ paddingBottom:i<group.items.length-1?14:0, marginBottom:i<group.items.length-1?14:0, borderBottom:i<group.items.length-1?`1px solid ${C.border}`:"none" }}>
                    {connected ? (
                      <ConnectedCard type={type} />
                    ) : (
                      <div style={{ display:"flex", alignItems:"flex-start", gap:12 }}>
                        <div style={{ width:38, height:38, borderRadius:10, background:`${intg.color}10`, border:`1px solid ${intg.color}22`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0 }}>{intg.icon}</div>
                        <div style={{ flex:1 }}>
                          <div style={{ fontSize:12, fontWeight:700, color:C.text, marginBottom:3 }}>{intg.label}</div>
                          <div style={{ fontSize:10, color:C.muted, lineHeight:1.6 }}>{intg.description}</div>
                        </div>
                        <button onClick={()=>openModal(type)} style={{ fontSize:11, fontWeight:700, color:intg.color, background:intg.bg, border:`1px solid ${intg.color}44`, padding:"7px 16px", borderRadius:8, cursor:"pointer", flexShrink:0, whiteSpace:"nowrap" }}>
                          Connect →
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}

      {/* ── PROFILE TAB ── */}
      {tab==="profile" && (
        <div className="fade-up" style={{ maxWidth:500 }}>
          {[
            { label:"Full Name",   value:persona.name,     type:"text"     },
            { label:"Shop Name",   value:persona.shop,     type:"text"     },
            { label:"Email",       value:persona.email,    type:"email"    },
            { label:"Category",    value:persona.category, type:"text"     },
            { label:"Short Bio",   value:persona.bio,      type:"textarea" },
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

      {/* ── BILLING TAB ── */}
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
              <div style={{ fontSize:11, color:C.muted, marginBottom:14 }}>
                {persona.plan==="starter"
                  ? "Unlock real-time Live Companion, AI weekly briefings, and SMS campaigns."
                  : "Unlock advanced AI automation, white-label reports, and priority support."}
              </div>
              <a href={STRIPE_LINKS[persona.plan==="starter"?"growth":"pro"]} target="_blank" rel="noopener noreferrer" style={{ display:"inline-block", fontSize:12, fontWeight:700, color:"#fff", background:`linear-gradient(135deg,${C.accent},${C.accent2})`, padding:"9px 22px", borderRadius:9, textDecoration:"none" }}>
                Upgrade Now →
              </a>
            </div>
          )}
        </div>
      )}

      {/* ── TEAM TAB ── */}
      {tab==="team" && (
        <TeamTab persona={persona} />
      )}
    </div>
  );
}



// ─── SCREEN: LOYALTY HUB ─────────────────────────────────────────────────────
function ScreenLoyalty({ buyers, navigate, persona }) {
  const [tab, setTab]     = useState("overview");
  const [search, setSearch] = useState("");

  // Enrich buyers with loyalty data
  const enriched = buyers.map(b => ({
    ...b,
    loyalty: LOYALTY_BUYERS[b.id] || { points:0, tier:"bronze", pointsToNext:500, history:[] },
  }));

  const tierCounts = LOYALTY_TIERS.reduce((acc, t) => {
    acc[t.id] = enriched.filter(b => b.loyalty.tier === t.id).length;
    return acc;
  }, {});
  const totalPoints = enriched.reduce((s, b) => s + b.loyalty.points, 0);
  const avgPoints   = enriched.length ? Math.round(totalPoints / enriched.length) : 0;
  const vipBuyers   = enriched.filter(b => b.loyalty.tier === "vip");
  const nearUpgrade = enriched.filter(b => {
    const tier = LOYALTY_TIERS.find(t => t.id === b.loyalty.tier);
    return tier?.maxPoints && b.loyalty.pointsToNext <= 300;
  });

  const filtered = enriched.filter(b => {
    const q = search.toLowerCase();
    return !q || b.name.toLowerCase().includes(q) || b.handle.toLowerCase().includes(q);
  }).sort((a,b) => b.loyalty.points - a.loyalty.points);

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100%", overflow:"hidden" }}>

      {/* HEADER */}
      <div style={{ padding:"24px 28px 0", flexShrink:0 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:20 }}>
          <div>
            <div style={{ fontFamily:"'Syne',sans-serif", fontSize:20, fontWeight:800, color:C.text, letterSpacing:"-0.5px" }}>Loyalty Hub</div>
            <div style={{ fontSize:12, color:C.muted, marginTop:3 }}>{enriched.length} members across {LOYALTY_TIERS.length} tiers</div>
          </div>
          <button style={{ background:`linear-gradient(135deg,${C.accent},${C.accent2})`, border:"none", color:"#fff", fontSize:12, fontWeight:700, padding:"8px 18px", borderRadius:9, cursor:"pointer" }}>
            + Award Points
          </button>
        </div>

        {/* KPI ROW */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10, marginBottom:20 }}>
          {[
            { label:"Total Points Issued",  value:totalPoints.toLocaleString(),  sub:"across all members",      color:C.accent },
            { label:"Avg Points / Buyer",   value:avgPoints.toLocaleString(),     sub:"lifetime average",        color:"#3b82f6" },
            { label:"VIP Members",          value:vipBuyers.length,               sub:"top-tier buyers",         color:"#7c3aed" },
            { label:"Near Upgrade",         value:nearUpgrade.length,             sub:"within 300 pts of tier",  color:"#f59e0b" },
          ].map(k => (
            <div key={k.label} style={{ background:C.surface, border:`1px solid ${C.border}`, borderTop:`2px solid ${k.color}`, borderRadius:12, padding:"14px 16px" }}>
              <div style={{ fontSize:9, color:C.muted, textTransform:"uppercase", letterSpacing:"0.08em", fontWeight:700, marginBottom:6 }}>{k.label}</div>
              <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:22, fontWeight:700, color:C.text, lineHeight:1, marginBottom:4 }}>{k.value}</div>
              <div style={{ fontSize:10, color:C.subtle }}>{k.sub}</div>
            </div>
          ))}
        </div>

        {/* TIER BREAKDOWN */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:8, marginBottom:20 }}>
          {LOYALTY_TIERS.slice().reverse().map(tier => {
            const count = tierCounts[tier.id] || 0;
            const pct   = enriched.length ? Math.round((count/enriched.length)*100) : 0;
            return (
              <div key={tier.id} style={{ background:tier.bg, border:`1px solid ${tier.color}33`, borderRadius:12, padding:"14px 16px" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
                  <span style={{ fontSize:18 }}>{tier.icon}</span>
                  <span style={{ fontSize:10, fontWeight:700, color:tier.color, fontFamily:"'JetBrains Mono',monospace" }}>{count}</span>
                </div>
                <div style={{ fontSize:12, fontWeight:700, color:C.text, marginBottom:2 }}>{tier.label}</div>
                <div style={{ fontSize:10, color:C.muted, marginBottom:8 }}>{tier.minPoints.toLocaleString()}{tier.maxPoints?`–${tier.maxPoints.toLocaleString()}`:"+"}  pts</div>
                <div style={{ height:3, background:`${tier.color}22`, borderRadius:2 }}>
                  <div style={{ height:"100%", width:`${pct}%`, background:tier.color, borderRadius:2 }} />
                </div>
                <div style={{ fontSize:9, color:C.subtle, marginTop:4 }}>{pct}% of members</div>
              </div>
            );
          })}
        </div>

        {/* TABS */}
        <div style={{ display:"flex", gap:0, borderBottom:`1px solid ${C.border}` }}>
          {[["overview","Members"],["perks","Tier Perks"],["activity","Recent Activity"]].map(([id,label]) => (
            <button key={id} onClick={()=>setTab(id)} style={{ background:"none", border:"none", borderBottom:`2px solid ${tab===id?C.accent:"transparent"}`, color:tab===id?"#a78bfa":C.muted, fontSize:12, fontWeight:tab===id?700:400, padding:"0 16px 12px", cursor:"pointer" }}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── TAB: MEMBERS ── */}
      {tab==="overview" && (
        <div style={{ flex:1, overflowY:"auto", padding:"16px 28px" }}>
          {/* NEAR UPGRADE CALLOUT */}
          {nearUpgrade.length > 0 && (
            <div style={{ background:"#2e1f0a", border:"1px solid #f59e0b33", borderRadius:12, padding:"12px 16px", marginBottom:16, display:"flex", alignItems:"center", gap:12 }}>
              <span style={{ fontSize:18 }}>⚡</span>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:12, fontWeight:700, color:"#f59e0b" }}>{nearUpgrade.length} buyer{nearUpgrade.length!==1?"s are":"is"} close to a tier upgrade</div>
                <div style={{ fontSize:11, color:C.muted, marginTop:2 }}>
                  {nearUpgrade.map(b => `${b.name} (${b.loyalty.pointsToNext} pts to go)`).join(" · ")}
                </div>
              </div>
              <button onClick={()=>navigate("composer")} style={{ fontSize:11, fontWeight:700, color:"#f59e0b", background:"#2e1f0a", border:"1px solid #f59e0b44", padding:"6px 14px", borderRadius:8, cursor:"pointer", whiteSpace:"nowrap" }}>
                Send nudge →
              </button>
            </div>
          )}

          {/* SEARCH */}
          <div style={{ display:"flex", alignItems:"center", gap:8, background:C.surface2, border:`1px solid ${C.border2}`, borderRadius:9, padding:"8px 12px", marginBottom:14 }}>
            <span style={{ color:C.subtle, fontSize:12 }}>🔍</span>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search members…" style={{ flex:1, background:"none", border:"none", color:C.text, fontSize:12, outline:"none" }} />
          </div>

          {/* TABLE HEADER */}
          <div style={{ display:"grid", gridTemplateColumns:"1.8fr 1fr 0.8fr 0.8fr 1.2fr 1fr", padding:"8px 0", borderBottom:`1px solid ${C.border}`, marginBottom:4 }}>
            {["Member","Tier","Points","Orders","Progress","Actions"].map(h => (
              <div key={h} style={{ fontSize:9, color:C.muted, textTransform:"uppercase", letterSpacing:"0.08em", fontWeight:700 }}>{h}</div>
            ))}
          </div>

          {filtered.map(b => {
            const tier    = LOYALTY_TIERS.find(t => t.id === b.loyalty.tier);
            const nextTier = LOYALTY_TIERS[LOYALTY_TIERS.indexOf(tier)+1];
            const pct     = tier?.maxPoints ? Math.min(100, Math.round((b.loyalty.points - tier.minPoints) / (tier.maxPoints - tier.minPoints) * 100)) : 100;
            return (
              <div key={b.id} style={{ display:"grid", gridTemplateColumns:"1.8fr 1fr 0.8fr 0.8fr 1.2fr 1fr", padding:"10px 0", borderBottom:`1px solid ${C.border}`, alignItems:"center" }}>
                {/* Member */}
                <div style={{ display:"flex", alignItems:"center", gap:10, cursor:"pointer" }} onClick={()=>navigate("buyer-profile",{buyerId:b.id})}>
                  <Avatar initials={b.avatar} color={PLATFORMS[b.platform]?.color} size={30} />
                  <div>
                    <div style={{ fontSize:12, fontWeight:600, color:C.text }}>{b.name}</div>
                    <div style={{ fontSize:10, color:C.muted }}>{b.handle}</div>
                  </div>
                </div>
                {/* Tier badge */}
                <div>
                  <span style={{ fontSize:10, fontWeight:700, color:tier?.color, background:tier?.bg, border:`1px solid ${tier?.color}33`, padding:"2px 8px", borderRadius:5 }}>
                    {tier?.icon} {tier?.label}
                  </span>
                </div>
                {/* Points */}
                <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:12, fontWeight:700, color:C.text }}>
                  {b.loyalty.points.toLocaleString()}
                </div>
                {/* Orders */}
                <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:12, color:"#9ca3af" }}>
                  {b.orders}
                </div>
                {/* Progress bar */}
                <div>
                  <div style={{ height:4, background:`${tier?.color}22`, borderRadius:2, marginBottom:4, overflow:"hidden" }}>
                    <div style={{ height:"100%", width:`${pct}%`, background:tier?.color, borderRadius:2 }} />
                  </div>
                  {nextTier ? (
                    <div style={{ fontSize:9, color:C.subtle }}>{b.loyalty.pointsToNext} pts to {nextTier.icon} {nextTier.label}</div>
                  ) : (
                    <div style={{ fontSize:9, color:tier?.color }}>Max tier reached</div>
                  )}
                </div>
                {/* Actions */}
                <div style={{ display:"flex", gap:6 }}>
                  <button
                    onClick={()=>navigate("buyer-profile",{buyerId:b.id})}
                    style={{ fontSize:10, color:C.accent, background:`${C.accent}10`, border:`1px solid ${C.accent}33`, padding:"4px 10px", borderRadius:6, cursor:"pointer" }}>
                    View
                  </button>
                  <button
                    style={{ fontSize:10, color:"#f59e0b", background:"#2e1f0a", border:"1px solid #f59e0b33", padding:"4px 10px", borderRadius:6, cursor:"pointer" }}>
                    +pts
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── TAB: TIER PERKS ── */}
      {tab==="perks" && (
        <div style={{ flex:1, overflowY:"auto", padding:"16px 28px" }}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
            {LOYALTY_TIERS.slice().reverse().map(tier => (
              <div key={tier.id} style={{ background:tier.bg, border:`1px solid ${tier.color}33`, borderRadius:14, padding:"20px 22px" }}>
                <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
                  <span style={{ fontSize:26 }}>{tier.icon}</span>
                  <div>
                    <div style={{ fontSize:15, fontWeight:700, color:C.text }}>{tier.label}</div>
                    <div style={{ fontSize:11, color:tier.color }}>{tier.minPoints.toLocaleString()}{tier.maxPoints?` – ${tier.maxPoints.toLocaleString()}`:"+"}  points</div>
                  </div>
                  <div style={{ marginLeft:"auto", fontFamily:"'JetBrains Mono',monospace", fontSize:13, fontWeight:700, color:tier.color }}>
                    {tierCounts[tier.id] || 0} members
                  </div>
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                  {tier.perks.map(perk => (
                    <div key={perk} style={{ display:"flex", alignItems:"center", gap:8 }}>
                      <div style={{ width:6, height:6, borderRadius:"50%", background:tier.color, flexShrink:0 }} />
                      <span style={{ fontSize:12, color:"#d1d5db" }}>{perk}</span>
                    </div>
                  ))}
                </div>
                <button style={{ marginTop:14, width:"100%", background:`${tier.color}18`, border:`1px solid ${tier.color}44`, color:tier.color, fontSize:11, fontWeight:700, padding:"8px", borderRadius:8, cursor:"pointer" }}>
                  Edit {tier.label} Perks
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB: RECENT ACTIVITY ── */}
      {tab==="activity" && (
        <div style={{ flex:1, overflowY:"auto", padding:"16px 28px" }}>
          {enriched
            .flatMap(b => (b.loyalty.history||[]).map(h => ({ ...h, buyer:b })))
            .sort((a,b) => new Date(b.date) - new Date(a.date))
            .slice(0,30)
            .map((item, i) => {
              const tier = LOYALTY_TIERS.find(t => t.id === item.buyer.loyalty.tier);
              return (
                <div key={i} style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 0", borderBottom:`1px solid ${C.border}` }}>
                  <Avatar initials={item.buyer.avatar} color={PLATFORMS[item.buyer.platform]?.color} size={28} />
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:12, color:C.text }}>
                      <strong>{item.buyer.name}</strong> — {item.event}
                    </div>
                    <div style={{ fontSize:10, color:C.muted, marginTop:2 }}>{item.date} · {item.buyer.loyalty.points.toLocaleString()} pts total</div>
                  </div>
                  <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:13, fontWeight:700, color:item.pts > 0 ? "#10b981" : "#f87171" }}>
                    {item.pts > 0 ? "+" : ""}{item.pts} pts
                  </div>
                  <span style={{ fontSize:10, fontWeight:700, color:tier?.color, background:tier?.bg, border:`1px solid ${tier?.color}33`, padding:"2px 8px", borderRadius:5 }}>
                    {tier?.icon} {tier?.label}
                  </span>
                </div>
              );
            })
          }
        </div>
      )}
    </div>
  );
}

// ─── SCREEN: ACCEPT INVITE ────────────────────────────────────────────────────
function ScreenAcceptInvite({ token }) {
  const [step, setStep]         = useState("loading"); // loading | invalid | expired | form | creating | done
  const [invite, setInvite]     = useState(null);
  const [emailData, setEmailData] = useState(null);
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword]   = useState("");
  const [confirm, setConfirm]     = useState("");
  const [showPass, setShowPass]   = useState(false);
  const [error, setError]         = useState("");

  // Password strength
  const pwStrength = (() => {
    if (!password) return { score:0, label:"", color:"#374151" };
    let score = 0;
    if (password.length >= 8)                     score++;
    if (password.length >= 12)                    score++;
    if (/[A-Z]/.test(password))                   score++;
    if (/[0-9]/.test(password))                   score++;
    if (/[^A-Za-z0-9]/.test(password))            score++;
    const levels = [
      { score:0, label:"",           color:"#374151" },
      { score:1, label:"Weak",       color:"#ef4444" },
      { score:2, label:"Fair",       color:"#f59e0b" },
      { score:3, label:"Good",       color:"#3b82f6" },
      { score:4, label:"Strong",     color:"#10b981" },
      { score:5, label:"Very strong",color:"#10b981" },
    ];
    return levels[Math.min(score, 5)];
  })();

  const canSubmit = displayName.trim().length >= 2
    && password.length >= 8
    && password === confirm
    && pwStrength.score >= 2;

  // Load invite from storage on mount
  useEffect(() => {
    (async () => {
      if (!token) { setStep("invalid"); return; }
      try {
        const result = await window.storage.get(`strmlive:invite:${token}`);
        if (!result?.value) { setStep("invalid"); return; }
        const inv = JSON.parse(result.value);
        if (inv.status === "accepted") { setStep("already_accepted"); setInvite(inv); return; }
        setInvite(inv);
        setDisplayName(inv.name);
        // Load email preview if available
        try {
          const emailResult = await window.storage.get(`strmlive:invite_email:${token}`);
          if (emailResult?.value) setEmailData(JSON.parse(emailResult.value));
        } catch(e) {}
        setStep("form");
      } catch(e) {
        setStep("invalid");
      }
    })();
  }, [token]);

  const createAccount = async () => {
    if (!canSubmit) return;
    setError("");
    setStep("creating");
    await new Promise(r => setTimeout(r, 1800));

    try {
      // Store new user credentials (hashed representation — never store plaintext in real app)
      const userId = "user_" + Date.now().toString(36);
      const userData = {
        id:          userId,
        name:        displayName.trim(),
        email:       invite.email,
        role:        invite.role,
        workspace:   invite.workspace,
        invitedBy:   invite.invitedBy,
        createdAt:   new Date().toLocaleDateString("en-US", { month:"short", day:"numeric", year:"numeric" }),
        avatar:      displayName.trim().split(" ").map(n=>n[0]).slice(0,2).join("").toUpperCase(),
        // In production: password would be hashed server-side, never stored client-side
        passwordSet: true,
      };

      await window.storage.set(`strmlive:user:${invite.email}`, JSON.stringify(userData));

      // Mark invite as accepted
      await window.storage.set(`strmlive:invite:${token}`, JSON.stringify({
        ...invite,
        status:     "accepted",
        acceptedAt: new Date().toLocaleDateString("en-US", { month:"short", day:"numeric", year:"numeric" }),
        userId,
      }));

      // Update the team member record in the workspace owner's team list
      try {
        const teamResult = await window.storage.get("strmlive:team");
        if (teamResult?.value) {
          const team = JSON.parse(teamResult.value);
          const updated = team.map(m =>
            m.token === token ? { ...m, status:"active", userId, name:displayName.trim() } : m
          );
          await window.storage.set("strmlive:team", JSON.stringify(updated));
        }
      } catch(e) {}

      setStep("done");
    } catch(e) {
      setStep("form");
      setError("Something went wrong creating your account. Please try again.");
    }
  };

  const ROLE_DESC = {
    "Owner":              "Full access to everything",
    "Admin":              "Manage shows, buyers, campaigns, and settings",
    "Show Manager":       "Run live shows and manage orders",
    "Campaign Manager":   "Create and send campaigns",
    "Viewer":             "Read-only access to all sections",
  };

  // ── SCREENS ──────────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight:"100vh", background:"#07070f", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", fontFamily:"'DM Sans',sans-serif", padding:24 }}>
      <style>{GLOBAL_CSS}</style>

      {/* LOGO */}
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:32 }}>
        <div style={{ width:36, height:36, borderRadius:10, background:"linear-gradient(135deg,#7c3aed,#4f46e5)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, fontWeight:900, color:"#fff" }}>S</div>
        <span style={{ fontFamily:"'Syne',sans-serif", fontSize:20, fontWeight:800, color:"#f9fafb" }}>Streamlive</span>
      </div>

      {/* ── LOADING ── */}
      {step==="loading" && (
        <div style={{ textAlign:"center" }}>
          <div style={{ width:32, height:32, border:"3px solid #2d1f5e", borderTop:"3px solid #7c3aed", borderRadius:"50%", animation:"spin 0.8s linear infinite", margin:"0 auto 16px" }} />
          <div style={{ fontSize:13, color:"#6b7280" }}>Loading your invitation…</div>
        </div>
      )}

      {/* ── INVALID ── */}
      {step==="invalid" && (
        <div style={{ background:"#0e0e1a", border:"1px solid #ef444433", borderRadius:18, padding:"32px 40px", maxWidth:440, width:"100%", textAlign:"center" }}>
          <div style={{ fontSize:32, marginBottom:12 }}>🔗</div>
          <div style={{ fontSize:18, fontWeight:700, color:"#f9fafb", marginBottom:8 }}>Invite link not found</div>
          <div style={{ fontSize:13, color:"#6b7280", lineHeight:1.7 }}>This invite link is invalid or has expired. Ask the workspace owner to send a new invitation.</div>
        </div>
      )}

      {/* ── ALREADY ACCEPTED ── */}
      {step==="already_accepted" && (
        <div style={{ background:"#0e0e1a", border:"1px solid #10b98133", borderRadius:18, padding:"32px 40px", maxWidth:440, width:"100%", textAlign:"center" }}>
          <div style={{ fontSize:32, marginBottom:12 }}>✅</div>
          <div style={{ fontSize:18, fontWeight:700, color:"#f9fafb", marginBottom:8 }}>Already accepted</div>
          <div style={{ fontSize:13, color:"#6b7280", lineHeight:1.7 }}>This invite has already been used. Log in to access <strong style={{ color:"#e5e7eb" }}>{invite?.workspace}</strong> on Streamlive.</div>
          <button style={{ marginTop:20, background:"linear-gradient(135deg,#7c3aed,#4f46e5)", border:"none", color:"#fff", fontSize:13, fontWeight:700, padding:"10px 28px", borderRadius:9, cursor:"pointer" }}>
            Go to Login
          </button>
        </div>
      )}

      {/* ── FORM ── */}
      {step==="form" && invite && (
        <div className="fade-up" style={{ background:"#0e0e1a", border:"1px solid #7c3aed44", borderRadius:18, padding:"32px 36px", maxWidth:480, width:"100%" }}>

          {/* INVITE HEADER */}
          <div style={{ background:"#2d1f5e22", border:"1px solid #7c3aed33", borderRadius:12, padding:"16px 18px", marginBottom:24, display:"flex", gap:14, alignItems:"flex-start" }}>
            <div style={{ width:42, height:42, borderRadius:11, background:"linear-gradient(135deg,#7c3aed,#4f46e5)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, fontWeight:800, color:"#fff", flexShrink:0 }}>
              {invite.workspace.split(" ").map(w=>w[0]).slice(0,2).join("").toUpperCase()}
            </div>
            <div>
              <div style={{ fontSize:13, color:"#9ca3af", marginBottom:3 }}>
                <strong style={{ color:"#e5e7eb" }}>{invite.invitedBy}</strong> invited you to join
              </div>
              <div style={{ fontSize:17, fontWeight:700, color:"#f9fafb" }}>{invite.workspace}</div>
              <div style={{ display:"flex", alignItems:"center", gap:6, marginTop:6 }}>
                <span style={{ fontSize:10, fontWeight:700, color:"#7c3aed", background:"#2d1f5e", border:"1px solid #7c3aed33", padding:"2px 8px", borderRadius:5 }}>{invite.role}</span>
                <span style={{ fontSize:10, color:"#6b7280" }}>{ROLE_DESC[invite.role]}</span>
              </div>
            </div>
          </div>

          <div style={{ fontSize:15, fontWeight:700, color:"#f9fafb", marginBottom:4 }}>Create your account</div>
          <div style={{ fontSize:12, color:"#6b7280", marginBottom:22 }}>Your login email: <strong style={{ color:"#e5e7eb" }}>{invite.email}</strong></div>

          {/* DISPLAY NAME */}
          <div style={{ marginBottom:16 }}>
            <div style={{ fontSize:10, fontWeight:700, color:"#6b7280", textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:6 }}>Display Name</div>
            <input
              value={displayName} onChange={e=>setDisplayName(e.target.value)}
              placeholder="Your full name"
              style={{ width:"100%", background:"#07070f", border:"1px solid #1f1f35", borderRadius:9, padding:"10px 14px", color:"#f9fafb", fontSize:13, outline:"none" }}
            />
          </div>

          {/* PASSWORD */}
          <div style={{ marginBottom:8 }}>
            <div style={{ fontSize:10, fontWeight:700, color:"#6b7280", textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:6 }}>Password</div>
            <div style={{ position:"relative" }}>
              <input
                value={password} onChange={e=>setPassword(e.target.value)}
                type={showPass?"text":"password"}
                placeholder="At least 8 characters"
                style={{ width:"100%", background:"#07070f", border:`1px solid ${password&&pwStrength.score<2?"#ef444466":"#1f1f35"}`, borderRadius:9, padding:"10px 40px 10px 14px", color:"#f9fafb", fontSize:13, outline:"none" }}
              />
              <button onClick={()=>setShowPass(v=>!v)} style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", color:"#6b7280", cursor:"pointer", fontSize:13 }}>
                {showPass?"🙈":"👁"}
              </button>
            </div>
            {/* Strength bar */}
            {password && (
              <div style={{ marginTop:7 }}>
                <div style={{ height:3, background:"#1f1f35", borderRadius:2, overflow:"hidden" }}>
                  <div style={{ height:"100%", width:`${(pwStrength.score/5)*100}%`, background:pwStrength.color, borderRadius:2, transition:"width .3s, background .3s" }} />
                </div>
                <div style={{ fontSize:10, color:pwStrength.color, marginTop:4 }}>{pwStrength.label}</div>
              </div>
            )}
          </div>

          {/* CONFIRM */}
          <div style={{ marginBottom:22 }}>
            <div style={{ fontSize:10, fontWeight:700, color:"#6b7280", textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:6 }}>Confirm Password</div>
            <input
              value={confirm} onChange={e=>setConfirm(e.target.value)}
              type={showPass?"text":"password"}
              placeholder="Re-enter your password"
              style={{ width:"100%", background:"#07070f", border:`1px solid ${confirm&&confirm!==password?"#ef444466":"#1f1f35"}`, borderRadius:9, padding:"10px 14px", color:"#f9fafb", fontSize:13, outline:"none" }}
            />
            {confirm && confirm!==password && (
              <div style={{ fontSize:10, color:"#f87171", marginTop:4 }}>Passwords don't match</div>
            )}
          </div>

          {/* Requirements */}
          <div style={{ background:"#0a0a15", border:"1px solid #1f1f35", borderRadius:9, padding:"10px 14px", marginBottom:20 }}>
            {[
              ["8+ characters",              password.length >= 8],
              ["One uppercase letter",        /[A-Z]/.test(password)],
              ["One number",                  /[0-9]/.test(password)],
              ["Passwords match",             password.length>0 && password===confirm],
            ].map(([label, met]) => (
              <div key={label} style={{ display:"flex", alignItems:"center", gap:7, padding:"3px 0" }}>
                <span style={{ fontSize:11, color:met?"#10b981":"#374151" }}>{met?"✓":"○"}</span>
                <span style={{ fontSize:11, color:met?"#d1d5db":"#4b5563" }}>{label}</span>
              </div>
            ))}
          </div>

          {error && <div style={{ fontSize:11, color:"#f87171", marginBottom:12 }}>{error}</div>}

          <button
            disabled={!canSubmit}
            onClick={createAccount}
            style={{ width:"100%", background:canSubmit?"linear-gradient(135deg,#7c3aed,#4f46e5)":"#1a1a2e", border:`1px solid ${canSubmit?"#7c3aed44":"#1f1f35"}`, color:canSubmit?"#fff":"#374151", fontSize:13, fontWeight:700, padding:"12px", borderRadius:10, cursor:canSubmit?"pointer":"default", transition:"all .2s" }}
          >
            Create Account & Join {invite.workspace}
          </button>

          <div style={{ fontSize:10, color:"#374151", textAlign:"center", marginTop:14, lineHeight:1.6 }}>
            By creating an account you agree to Streamlive's Terms of Service and Privacy Policy.
          </div>
        </div>
      )}

      {/* ── CREATING ── */}
      {step==="creating" && (
        <div style={{ textAlign:"center" }}>
          <div style={{ width:48, height:48, border:"3px solid #2d1f5e", borderTop:"3px solid #7c3aed", borderRadius:"50%", animation:"spin 0.8s linear infinite", margin:"0 auto 20px" }} />
          <div style={{ fontSize:16, fontWeight:700, color:"#f9fafb", marginBottom:8 }}>Setting up your account…</div>
          <div style={{ fontSize:12, color:"#6b7280" }}>Configuring permissions and workspace access</div>
        </div>
      )}

      {/* ── DONE ── */}
      {step==="done" && invite && (
        <div className="fade-up" style={{ background:"#0e0e1a", border:"1px solid #10b98144", borderRadius:18, padding:"40px 40px", maxWidth:440, width:"100%", textAlign:"center" }}>
          <div style={{ width:56, height:56, borderRadius:16, background:"#0a1e16", border:"1px solid #10b98133", display:"flex", alignItems:"center", justifyContent:"center", fontSize:26, margin:"0 auto 20px" }}>✅</div>
          <div style={{ fontSize:20, fontWeight:700, color:"#f9fafb", marginBottom:8 }}>You're all set!</div>
          <div style={{ fontSize:13, color:"#9ca3af", lineHeight:1.7, marginBottom:24 }}>
            Your account has been created. You've joined <strong style={{ color:"#e5e7eb" }}>{invite.workspace}</strong> as a <strong style={{ color:"#a78bfa" }}>{invite.role}</strong>.
          </div>
          <div style={{ background:"#0a0a15", border:"1px solid #1f1f35", borderRadius:10, padding:"12px 16px", marginBottom:24, textAlign:"left" }}>
            <div style={{ fontSize:10, fontWeight:700, color:"#6b7280", textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:8 }}>Your access</div>
            {[
              ["Email",     invite.email],
              ["Role",      invite.role],
              ["Workspace", invite.workspace],
            ].map(([k,v])=>(
              <div key={k} style={{ display:"flex", gap:12, marginBottom:6 }}>
                <span style={{ fontSize:11, color:"#6b7280", minWidth:70 }}>{k}</span>
                <span style={{ fontSize:11, color:"#e5e7eb", fontWeight:600 }}>{v}</span>
              </div>
            ))}
          </div>
          <button
            onClick={()=>{ window.history.replaceState({}, "", window.location.pathname); window.location.reload(); }}
            style={{ width:"100%", background:"linear-gradient(135deg,#7c3aed,#4f46e5)", border:"none", color:"#fff", fontSize:13, fontWeight:700, padding:"12px", borderRadius:10, cursor:"pointer" }}
          >
            Go to Streamlive Dashboard →
          </button>
        </div>
      )}
    </div>
  );
}

// ─── ROOT APP ─────────────────────────────────────────────────────────────────
export default function StreamlivePrototype() {
  // All hooks must come before any conditional returns (Rules of Hooks)
  const [personaId, setPersonaId]   = useState("sarah");
  const [view, setView]             = useState("dashboard");
  const [params, setParams]         = useState({});
  const [showPersonaMenu, setShowPersonaMenu] = useState(false);
  const [notifications, setNotifications] = useState(3);

  // Check for invite token in URL — render accept screen instead of app
  const urlInviteToken = new URLSearchParams(window.location.search).get("invite");
  if (urlInviteToken) {
    return <ScreenAcceptInvite token={urlInviteToken} />;
  }

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
// ─── AUDIENCE SEGMENTS (computed from CRM) ────────────────────────────────────
// Helper: flatten all buyers from all personas, deduplicate by id + enrich
const ALL_CRM_BUYERS = (() => {
  const seen = new Set();
  const all = [];
  Object.values(BUYERS_BY_PERSONA).forEach(list => {
    list.forEach(b => {
      const key = b.email;
      if (!seen.has(key)) {
        seen.add(key);
        const loyalty = LOYALTY_BUYERS[b.id] || { points: 0, tier: "bronze" };
        const daysAgo = parseInt(b.lastOrder) || (b.lastOrder.includes("d") ? parseInt(b.lastOrder) : 999);
        all.push({ ...b, loyalty, daysAgo });
      }
    });
  });
  return all;
})();

// Segment definitions — each has id, label, icon, color, description, filter fn
const AUDIENCE_SEGMENTS = [
  {
    id: "all",
    label: "Everyone",
    icon: "👥",
    color: "#a78bfa",
    bg: "#2d1f5e",
    description: "Your full CRM — all buyers across every platform",
    filter: () => true,
    category: "All",
  },
  {
    id: "vip",
    label: "VIP Buyers",
    icon: "👑",
    color: "#f59e0b",
    bg: "#2e1f0a",
    description: "Highest-value loyal buyers — top loyalty tier",
    filter: b => b.status === "vip",
    category: "Loyalty",
  },
  {
    id: "gold_tier",
    label: "Gold Tier",
    icon: "🥇",
    color: "#d97706",
    bg: "#261a06",
    description: "Gold loyalty members — 2,000–4,999 pts",
    filter: b => b.loyalty.tier === "gold",
    category: "Loyalty",
  },
  {
    id: "silver_tier",
    label: "Silver Tier",
    icon: "🥈",
    color: "#9ca3af",
    bg: "#1c2028",
    description: "Silver loyalty members — 500–1,999 pts",
    filter: b => b.loyalty.tier === "silver",
    category: "Loyalty",
  },
  {
    id: "at_risk",
    label: "At-Risk Buyers",
    icon: "⚠️",
    color: "#f59e0b",
    bg: "#2e1f0a",
    description: "Buyers who haven't ordered in 28–60 days",
    filter: b => b.status === "risk",
    category: "Engagement",
  },
  {
    id: "dormant",
    label: "Dormant",
    icon: "💤",
    color: "#6b7280",
    bg: "#111118",
    description: "60+ days since last order — win-back candidates",
    filter: b => b.status === "dormant",
    category: "Engagement",
  },
  {
    id: "new_buyers",
    label: "New Buyers",
    icon: "✨",
    color: "#3b82f6",
    bg: "#0f1e2e",
    description: "Joined in the last 30 days or first 1–2 orders",
    filter: b => b.status === "new" || b.orders <= 2,
    category: "Engagement",
  },
  {
    id: "active",
    label: "Active Regulars",
    icon: "🔥",
    color: "#10b981",
    bg: "#0a1e16",
    description: "Bought in the last 14 days — warm and engaged",
    filter: b => b.status === "active",
    category: "Engagement",
  },
  {
    id: "high_spend",
    label: "High Spenders",
    icon: "💰",
    color: "#10b981",
    bg: "#0a1e16",
    description: "Lifetime spend $1,000 or more",
    filter: b => b.spend >= 1000,
    category: "Spend",
  },
  {
    id: "mid_spend",
    label: "Mid-Tier Spenders",
    icon: "💵",
    color: "#6ee7b7",
    bg: "#0a2016",
    description: "Lifetime spend $250–$999",
    filter: b => b.spend >= 250 && b.spend < 1000,
    category: "Spend",
  },
  {
    id: "platform_wn",
    label: "Whatnot Buyers",
    icon: "🟡",
    color: "#f59e0b",
    bg: "#2e1f0a",
    description: "All buyers originating from Whatnot",
    filter: b => b.platform === "WN",
    category: "Platform",
  },
  {
    id: "platform_tt",
    label: "TikTok Buyers",
    icon: "🎵",
    color: "#69c9d0",
    bg: "#0d2828",
    description: "All buyers originating from TikTok Shop",
    filter: b => b.platform === "TT",
    category: "Platform",
  },
  {
    id: "platform_ig",
    label: "Instagram Buyers",
    icon: "📸",
    color: "#e1306c",
    bg: "#2d1020",
    description: "All buyers originating from Instagram Live",
    filter: b => b.platform === "IG",
    category: "Platform",
  },
  {
    id: "platform_am",
    label: "Amazon Buyers",
    icon: "📦",
    color: "#f97316",
    bg: "#2e1608",
    description: "All buyers originating from Amazon Live",
    filter: b => b.platform === "AM",
    category: "Platform",
  },
  {
    id: "multi_platform",
    label: "Multi-Platform",
    icon: "🌐",
    color: "#a78bfa",
    bg: "#2d1f5e",
    description: "Buyers who have purchased on 2+ platforms",
    filter: b => b.orders >= 8 && b.spend >= 500,
    category: "Platform",
  },
  {
    id: "repeat_buyer",
    label: "Repeat Buyers",
    icon: "🔁",
    color: "#34d399",
    bg: "#0a2016",
    description: "3 or more orders placed — proven repeat purchasers",
    filter: b => b.orders >= 3,
    category: "Behavior",
  },
  {
    id: "big_order",
    label: "High Order Count",
    icon: "📈",
    color: "#60a5fa",
    bg: "#0f1e2e",
    description: "Buyers with 10+ orders — your most frequent customers",
    filter: b => b.orders >= 10,
    category: "Behavior",
  },
  {
    id: "no_email",
    label: "Email Only",
    icon: "✉️",
    color: "#3b82f6",
    bg: "#0f1e2e",
    description: "Buyers with email but no SMS opt-in",
    filter: b => !!b.email,
    category: "Contact",
  },
  {
    id: "sms_opted",
    label: "SMS Opted-In",
    icon: "💬",
    color: "#a78bfa",
    bg: "#2d1f5e",
    description: "Buyers who have provided a phone number",
    filter: b => !!b.phone,
    category: "Contact",
  },
];

// Enrich each segment with live count from CRM
AUDIENCE_SEGMENTS.forEach(seg => {
  seg.count = ALL_CRM_BUYERS.filter(seg.filter).length;
  seg.buyers = ALL_CRM_BUYERS.filter(seg.filter);
  // Scale to full list size (demo data is small; multiply for realistic numbers)
  seg.scaledCount = Math.round(seg.count * 105 + Math.floor(Math.random() * 20));
});

