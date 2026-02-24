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

// ─── NAV ITEMS ────────────────────────────────────────────────────────────────
const NAV = [
  { id:"dashboard",   label:"Dashboard",  icon:"⬡",  route:"/dashboard" },
  { id:"buyers",      label:"Buyers",     icon:"◉",  route:"/buyers" },
  { id:"shows",       label:"Shows",      icon:"◈",  route:"/shows" },
  { id:"campaigns",   label:"Campaigns",  icon:"◆",  route:"/campaigns" },
  { id:"subscribers", label:"Subscribers",icon:"●",  route:"/subscribers" },
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
          <button onClick={()=>navigate("live")} style={{ background:`linear-gradient(135deg,${C.accent},${C.accent2})`, border:"none", color:"#fff", fontSize:12, fontWeight:700, padding:"8px 18px", borderRadius:9, cursor:"pointer", whiteSpace:"nowrap" }}>Start Live Show</button>
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
  const [liveBuyers, setLiveBuyers] = useState(buyers.slice(0,3));
  const [elapsed, setElapsed]       = useState(0);
  const [viewerCount, setViewerCount] = useState(234);
  const [gmv, setGmv]               = useState(1420);
  const [search, setSearch]         = useState("");

  useEffect(()=>{
    const t = setInterval(()=>{
      setElapsed(e=>e+1);
      setViewerCount(v=>Math.max(180, v + Math.floor((Math.random()-0.4)*8)));
      setGmv(g=>g + Math.floor(Math.random()*40));
      if (Math.random() > 0.7 && liveBuyers.length < buyers.length) {
        setLiveBuyers(prev => {
          const remaining = buyers.filter(b=>!prev.find(p=>p.id===b.id));
          if (!remaining.length) return prev;
          return [remaining[0], ...prev].slice(0,8);
        });
      }
    }, 2000);
    return ()=>clearInterval(t);
  }, [buyers, liveBuyers]);

  const fmt = (s) => `${String(Math.floor(s/3600)).padStart(2,"0")}:${String(Math.floor((s%3600)/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;

  const filtered = liveBuyers.filter(b=>b.name.toLowerCase().includes(search.toLowerCase())||b.handle.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100%", background:"#050510" }}>
      {/* LIVE HEADER */}
      <div style={{ background:"#090916", borderBottom:`1px solid ${C.border}`, padding:"12px 24px", display:"flex", alignItems:"center", gap:16, flexShrink:0 }}>
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
          <button onClick={()=>navigate("shows")} style={{ fontSize:11, color:"#ef4444", background:"#2d08081a", border:"1px solid #ef444433", padding:"6px 14px", borderRadius:7, cursor:"pointer" }}>End Show</button>
        </div>
      </div>

      {/* MAIN */}
      <div style={{ flex:1, display:"flex", overflow:"hidden" }}>
        {/* BUYER FEED */}
        <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
          <div style={{ padding:"12px 20px", borderBottom:`1px solid ${C.border}`, flexShrink:0 }}>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Quick lookup — search any buyer…"
              style={{ width:"100%", background:C.surface2, border:`1px solid ${C.border2}`, borderRadius:8, padding:"8px 12px", color:C.text, fontSize:12, outline:"none" }} />
          </div>
          <div style={{ overflowY:"auto", flex:1, padding:"8px 0" }}>
            {filtered.map((b,i)=>{
              const pl = PLATFORMS[b.platform];
              const st = STATUS_META[b.status];
              return (
                <div key={b.id} className={i===0?"pop-in":""} style={{ padding:"10px 20px", borderBottom:`1px solid #0d0d18`, display:"flex", alignItems:"center", gap:12 }}>
                  <Avatar initials={b.avatar} color={pl?.color} size={32} />
                  <div style={{ flex:1 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                      <span style={{ fontSize:13, fontWeight:600, color:C.text }}>{b.name}</span>
                      {b.status==="vip" && <Badge label="VIP" bg={st.bg} text={st.text} />}
                    </div>
                    <div style={{ fontSize:11, color:C.muted }}>{b.handle} · ${b.spend.toLocaleString()} lifetime · {b.orders} orders</div>
                  </div>
                  <PlatformPill code={b.platform} />
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div style={{ width:260, borderLeft:`1px solid ${C.border}`, display:"flex", flexDirection:"column", background:"#050508" }}>
          <div style={{ padding:"14px 16px", borderBottom:`1px solid ${C.border}` }}>
            <div style={{ fontSize:10, color:C.muted, textTransform:"uppercase", letterSpacing:"0.09em", fontWeight:700, marginBottom:12 }}>Segments Active</div>
            {[
              { label:"VIP Buyers",    count:liveBuyers.filter(b=>b.status==="vip").length,    color:"#a78bfa" },
              { label:"At-Risk",       count:liveBuyers.filter(b=>b.status==="risk").length,   color:C.amber },
              { label:"First-Timers",  count:liveBuyers.filter(b=>b.status==="new").length,    color:C.blue },
            ].map(s=>(
              <div key={s.label} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
                <span style={{ fontSize:12, color:"#9ca3af" }}>{s.label}</span>
                <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:13, fontWeight:700, color:s.color }}>{s.count}</span>
              </div>
            ))}
          </div>

          <div style={{ padding:"14px 16px" }}>
            <div style={{ fontSize:10, color:C.muted, textTransform:"uppercase", letterSpacing:"0.09em", fontWeight:700, marginBottom:12 }}>Quick Note</div>
            <textarea rows={4} placeholder="Note anything — hot lot, chat moment, VIP shoutout…" style={{ width:"100%", background:C.surface2, border:`1px solid ${C.border2}`, borderRadius:8, padding:"8px 10px", color:C.text, fontSize:11, outline:"none", resize:"none", fontFamily:"'DM Sans',sans-serif" }} />
            <button style={{ width:"100%", marginTop:8, background:`${C.accent}22`, border:`1px solid ${C.accent}44`, color:"#a78bfa", fontSize:11, fontWeight:700, padding:"7px", borderRadius:7, cursor:"pointer" }}>Save Note</button>
          </div>
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
  const activeNav = ["buyer-profile"].includes(view) ? "buyers" : ["show-report","live"].includes(view) ? "shows" : ["composer"].includes(view) ? "campaigns" : view;

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
          </div>
        </div>
      </div>
    </>
  );
}
