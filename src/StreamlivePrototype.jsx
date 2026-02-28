import React, { useState, useEffect, useRef } from "react";

// ─── FONTS ────────────────────────────────────────────────────────────────────
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&family=JetBrains+Mono:wght@400;600&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #06060e; }
  *, *:focus, *:active { cursor: none !important; }
  ::-webkit-scrollbar { width: 4px; height: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: #1e1e3a; border-radius: 99px; }
  @keyframes fadeUp   { from { opacity:0; transform:translateY(8px)  } to { opacity:1; transform:translateY(0) } }
  @keyframes slideIn  { from { opacity:0; transform:translateX(14px) } to { opacity:1; transform:translateX(0) } }
  @keyframes pulse    { 0%,100% { opacity:1 } 50% { opacity:.4 } }
  @keyframes spin     { to { transform:rotate(360deg) } }
  @keyframes pop      { 0% { transform:scale(.92); opacity:0 } 100% { transform:scale(1); opacity:1 } }
  @keyframes soundBar0 { from { height:3px } to { height:10px } }
  @keyframes soundBar1 { from { height:5px } to { height:13px } }
  @keyframes soundBar2 { from { height:4px } to { height:8px  } }
  @keyframes livePulse {
    0%   { transform: translate(-50%,-50%) scale(1);   opacity: 0.7; }
    50%  { transform: translate(-50%,-50%) scale(2.4); opacity: 0; }
    100% { transform: translate(-50%,-50%) scale(1);   opacity: 0; }
  }
  .fade-up  { animation: fadeUp  .3s ease both; }
  .slide-in { animation: slideIn .25s ease both; }
  .pop-in   { animation: pop     .2s ease both; }
  select option { background: #0d0d1e; }
  .cta-btn { transition: opacity .15s; }
  .cta-btn:hover { opacity: .88; }
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
  WN: { label:"Whatnot",       color:"#7c3aed", short:"WN" },
  TT: { label:"TikTok Shop",   color:"#f43f5e", short:"TT" },
  AM: { label:"Amazon Live",   color:"#f59e0b", short:"AM" },
  IG: { label:"Instagram",     color:"#ec4899", short:"IG" },
  YT: { label:"YouTube Live",  color:"#ff0000", short:"YT", shopifyAttribution:true },
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
    name: "Jamie Ellis",
    shop: "Banana Republic",
    email: "jamie.ellis@bananarepublic.com",
    avatar: "BR",
    plan: "pro",
    planColor: "#f59e0b",
    category: "Apparel & Fashion",
    platforms: ["TT","IG","AM","YT"],
    buyerCount: 1840,
    showCount: 42,
    subscriberCount: 3820,
    manychat: { ttOptIns: 1240, igOptIns: 860, thisWeek: { tt: 94, ig: 61 }, topKeyword: "STYLE" },
    slug: "bananarepublic",
    bio: "Banana Republic Live — seasonal collections, member exclusives, and live styling every week.",
  },
  {
    id: "tyler",
    name: "Alyssa Kim",
    shop: "Kylie Cosmetics",
    email: "alyssa@kyliecosmetics.com",
    avatar: "KC",
    plan: "growth",
    planColor: "#7c3aed",
    category: "Beauty & Cosmetics",
    platforms: ["TT","IG"],
    buyerCount: 2140,
    showCount: 74,
    subscriberCount: 5890,
    manychat: { ttOptIns: 1840, igOptIns: 1210, thisWeek: { tt: 142, ig: 98 }, topKeyword: "GLAM" },
    slug: "kyliecosmetics",
    bio: "Kylie Cosmetics official live channel. New shades, exclusive drops, and tutorials with the team.",
  },
  {
    id: "devon",
    name: "Marc Pujol",
    shop: "Tropicfeel",
    email: "marc@tropicfeel.com",
    avatar: "TF",
    plan: "starter",
    planColor: "#10b981",
    category: "Travel Footwear & Gear",
    platforms: ["IG","AM"],
    buyerCount: 128,
    showCount: 9,
    subscriberCount: 214,
    manychat: { ttOptIns: 0, igOptIns: 88, thisWeek: { tt: 0, ig: 12 }, topKeyword: "EXPLORE" },
    slug: "tropicfeel",
    bio: "Travel-ready footwear for every terrain. Building our live community one drop at a time.",
  },
  {
    id: "mia",
    name: "Rachel Nguyen",
    shop: "Walmart Live",
    email: "rachel.nguyen@walmart.com",
    avatar: "WM",
    plan: "enterprise",
    planColor: "#a78bfa",
    category: "Multi-Category Retail",
    platforms: ["WN","TT","AM","IG"],
    buyerCount: 48200,
    showCount: 1840,
    subscriberCount: 124000,
    slug: "walmartlive",
    bio: "Walmart Live — powering live commerce for Walmart's brand partners across every category.",
    teamSize: 12,
    sellerCount: 12,
    whiteLabel: true,
    whiteLabelDomain: "live.walmart.com",
    managedSellers: [
      { id:"s1",  name:"Banana Republic",    owner:"Jamie Ellis",    avatar:"BR", category:"Apparel",         plan:"pro",     planColor:"#f59e0b", status:"active", platforms:["TT","IG","AM"],      gmv:184200, gmvPrev:162800, buyerCount:1840, showCount:11, lastShow:"Feb 22", subscriberCount:3820, manager:"tm2", monthlyFee:399, alerts:[{type:"opportunity",text:"Spring collection launch — schedule a live event this week"}] },
      { id:"s2",  name:"Kylie Cosmetics",    owner:"Alyssa Kim",     avatar:"KC", category:"Beauty",          plan:"growth",  planColor:"#7c3aed", status:"active", platforms:["TT","IG"],           gmv:98400,  gmvPrev:84100,  buyerCount:2140, showCount:8,  lastShow:"Feb 21", subscriberCount:5890, manager:"tm3", monthlyFee:199, alerts:[] },
      { id:"s3",  name:"Anker Electronics",  owner:"Dan Lv",         avatar:"AE", category:"Electronics",     plan:"pro",     planColor:"#f59e0b", status:"active", platforms:["AM","TT"],           gmv:142000, gmvPrev:138400, buyerCount:2880, showCount:14, lastShow:"Feb 23", subscriberCount:4210, manager:"tm5", monthlyFee:399, alerts:[] },
      { id:"s4",  name:"Tropicfeel",         owner:"Marc Pujol",     avatar:"TF", category:"Travel Footwear", plan:"starter", planColor:"#10b981", status:"active", platforms:["IG","AM"],           gmv:28400,  gmvPrev:21800,  buyerCount:128,  showCount:3,  lastShow:"Feb 18", subscriberCount:214,  manager:"tm2", monthlyFee:79,  alerts:[{type:"opportunity",text:"GMV up 30% — ready to upgrade to Growth"}] },
      { id:"s5",  name:"Better Homes",       owner:"Lisa Chen",      avatar:"BH", category:"Home & Garden",   plan:"growth",  planColor:"#7c3aed", status:"active", platforms:["TT","AM"],           gmv:76200,  gmvPrev:71400,  buyerCount:1240, showCount:9,  lastShow:"Feb 21", subscriberCount:2180, manager:"tm3", monthlyFee:199, alerts:[] },
      { id:"s6",  name:"Mainstays Home",     owner:"Retail Ops",     avatar:"MH", category:"Home Basics",     plan:"starter", planColor:"#10b981", status:"active", platforms:["AM"],                gmv:31800,  gmvPrev:29200,  buyerCount:620,  showCount:6,  lastShow:"Feb 19", subscriberCount:840,  manager:"tm2", monthlyFee:79,  alerts:[] },
      { id:"s7",  name:"Athletic Works",     owner:"Kevin Park",     avatar:"AW", category:"Activewear",      plan:"growth",  planColor:"#7c3aed", status:"active", platforms:["TT","IG"],           gmv:64400,  gmvPrev:68200,  buyerCount:980,  showCount:7,  lastShow:"Feb 20", subscriberCount:1640, manager:"tm5", monthlyFee:199, alerts:[{type:"warning",text:"GMV down 5.6% — review show content strategy"}] },
      { id:"s8",  name:"Time and Tru",       owner:"Style Team",     avatar:"TT", category:"Women's Fashion", plan:"pro",     planColor:"#f59e0b", status:"active", platforms:["TT","IG","AM"],      gmv:218400, gmvPrev:194800, buyerCount:3140, showCount:16, lastShow:"Feb 23", subscriberCount:6820, manager:"tm5", monthlyFee:399, alerts:[{type:"opportunity",text:"Top GMV account — strong candidate for featured placement"}] },
      { id:"s9",  name:"George Menswear",    owner:"Brand Ops",      avatar:"GM", category:"Men's Fashion",   plan:"growth",  planColor:"#7c3aed", status:"paused", platforms:["TT","AM"],           gmv:42100,  gmvPrev:51200,  buyerCount:640,  showCount:0,  lastShow:"Jan 31", subscriberCount:980,  manager:"tm3", monthlyFee:199, alerts:[{type:"alert",text:"Account paused 24 days — check in re: spring relaunch"}] },
      { id:"s10", name:"LEGO at Walmart",    owner:"Dan Soren",      avatar:"LG", category:"Toys & Games",    plan:"pro",     planColor:"#f59e0b", status:"active", platforms:["TT","AM"],           gmv:164000, gmvPrev:148200, buyerCount:2640, showCount:12, lastShow:"Feb 22", subscriberCount:5100, manager:"tm3", monthlyFee:399, alerts:[{type:"opportunity",text:"New set drops this month — schedule a build-along live"}] },
      { id:"s11", name:"Samsung at Walmart", owner:"Tech Commerce",  avatar:"SS", category:"Electronics",     plan:"pro",     planColor:"#f59e0b", status:"active", platforms:["TT","AM","IG"],      gmv:341000, gmvPrev:312400, buyerCount:4820, showCount:18, lastShow:"Feb 23", subscriberCount:9840, manager:"tm2", monthlyFee:399, alerts:[] },
      { id:"s12", name:"BetterGoods",        owner:"Food & Bev",     avatar:"BG", category:"Grocery & Food",  plan:"starter", planColor:"#10b981", status:"active", platforms:["TT","AM"],           gmv:22800,  gmvPrev:19400,  buyerCount:410,  showCount:5,  lastShow:"Feb 20", subscriberCount:620,  manager:"tm6", monthlyFee:79,  alerts:[] },
    ],
  },
];

// ─── BUYER DATA (per persona) ─────────────────────────────────────────────────
const BUYERS_BY_PERSONA = {
  sarah: [  // Banana Republic
    { id:"b1", name:"Olivia Bennett",   handle:"@oliviastyle",      platform:"IG", spend:6840, orders:48, lastOrder:"1d ago",  category:"Outerwear",    status:"vip",     score:9.6, avatar:"OB", tags:["VIP","Member"],      email:"o.bennett@example.com", phone:"+1-555-0101" },
    { id:"b2", name:"Claire Fontaine",  handle:"@clairef_fashion",  platform:"TT", spend:4210, orders:31, lastOrder:"2d ago",  category:"Dresses",      status:"vip",     score:9.1, avatar:"CF", tags:["VIP"],               email:"cf@example.com",        phone:"+1-555-0102" },
    { id:"b3", name:"Marcus Duval",     handle:"@marcusd",          platform:"AM", spend:3480, orders:24, lastOrder:"4d ago",  category:"Blazers",      status:"vip",     score:8.4, avatar:"MD", tags:["VIP","Big Spender"], email:"md@example.com",        phone:"+1-555-0103" },
    { id:"b4", name:"Natalie Rhodes",   handle:"@nat_styled",       platform:"IG", spend:1920, orders:14, lastOrder:"29d ago", category:"Accessories",  status:"risk",    score:5.1, avatar:"NR", tags:[],                    email:"nr@example.com",        phone:"+1-555-0104" },
    { id:"b5", name:"Tom Archer",       handle:"@tomarcher",        platform:"TT", spend:1240, orders:9,  lastOrder:"31d ago", category:"Trousers",     status:"risk",    score:4.6, avatar:"TA", tags:[],                    email:"ta@example.com",        phone:"+1-555-0105" },
    { id:"b6", name:"Zoe Kim",          handle:"@zoekim_looks",     platform:"IG", spend:980,  orders:7,  lastOrder:"3d ago",  category:"Knitwear",     status:"active",  score:6.8, avatar:"ZK", tags:["New"],               email:"zk@example.com",        phone:"+1-555-0106" },
    { id:"b7", name:"Ellie Hoffman",    handle:"@ellieh",           platform:"TT", spend:620,  orders:4,  lastOrder:"8d ago",  category:"Dresses",      status:"active",  score:5.9, avatar:"EH", tags:[],                    email:"eh@example.com",        phone:"+1-555-0107" },
    { id:"b8", name:"James Weston",     handle:"@jwestonshops",     platform:"AM", spend:290,  orders:2,  lastOrder:"88d ago", category:"Outerwear",    status:"dormant", score:2.3, avatar:"JW", tags:[],                    email:"jw@example.com",        phone:"+1-555-0108" },
    // YouTube buyers — sourced from Shopify, attributed to YouTube shows
    { id:"b9",  name:"Ryan Callahan",   handle:"youtube/ryancall",  platform:"YT", spend:456,  orders:2,  lastOrder:"18d ago", category:"Blazers",      status:"new",     score:6.2, avatar:"RC", tags:["New","YouTube"],     email:"rcallahan@gmail.com",   phone:"+1-555-0109", shopifyCustomerId:"cust_sh_4821", ytAttribution:"time-window" },
    { id:"b10", name:"Sarah Mitchell",  handle:"youtube/smitch",    platform:"YT", spend:228,  orders:1,  lastOrder:"18d ago", category:"Blazers",      status:"new",     score:5.8, avatar:"SM", tags:["New","YouTube"],     email:"sarah.m@gmail.com",     phone:"+1-555-0110", shopifyCustomerId:"cust_sh_4822", ytAttribution:"utm-link" },
    { id:"b11", name:"Derek Huang",     handle:"youtube/dhuang",    platform:"YT", spend:376,  orders:2,  lastOrder:"18d ago", category:"Trousers",     status:"new",     score:6.4, avatar:"DH", tags:["New","YouTube"],     email:"dhuang91@gmail.com",    phone:"+1-555-0111", shopifyCustomerId:"cust_sh_4823", ytAttribution:"utm-link" },
    { id:"b12", name:"Priya Sharma",    handle:"youtube/priya_s",   platform:"YT", spend:148,  orders:1,  lastOrder:"18d ago", category:"Trousers",     status:"new",     score:5.4, avatar:"PS", tags:["New","YouTube"],     email:"priya.s@gmail.com",     phone:"+1-555-0112", shopifyCustomerId:"cust_sh_4824", ytAttribution:"manual" },
  ],
  tyler: [  // Kylie Cosmetics
    { id:"b1", name:"Sienna Lopez",     handle:"@siennaglam",       platform:"TT", spend:4820, orders:62, lastOrder:"1d ago",  category:"Lip",          status:"vip",     score:9.8, avatar:"SL", tags:["VIP","Lip Obsessed"], email:"sl@example.com",       phone:"+1-555-0201" },
    { id:"b2", name:"Maya Patel",       handle:"@mayabeauty",       platform:"IG", spend:3640, orders:44, lastOrder:"2d ago",  category:"Face",         status:"vip",     score:9.2, avatar:"MP", tags:["VIP"],               email:"mp@example.com",       phone:"+1-555-0202" },
    { id:"b3", name:"Jade Wu",          handle:"@jadewumakeup",     platform:"TT", spend:2190, orders:28, lastOrder:"5d ago",  category:"Eye",          status:"active",  score:7.6, avatar:"JW", tags:[],                    email:"jw@example.com",       phone:"+1-555-0203" },
    { id:"b4", name:"Brianna Cole",     handle:"@bricole_beauty",   platform:"IG", spend:980,  orders:12, lastOrder:"41d ago", category:"Lip",          status:"risk",    score:4.4, avatar:"BC", tags:[],                    email:"bc@example.com",       phone:"+1-555-0204" },
    { id:"b5", name:"Ava Torres",       handle:"@avatorres",        platform:"TT", spend:540,  orders:7,  lastOrder:"6d ago",  category:"Sets",         status:"new",     score:6.1, avatar:"AT", tags:["New"],               email:"at@example.com",       phone:"+1-555-0205" },
  ],
  devon: [  // Tropicfeel
    { id:"b1", name:"Luca Martini",     handle:"@lucatravel",       platform:"IG", spend:1480, orders:6,  lastOrder:"2d ago",  category:"Shoes",        status:"vip",     score:8.8, avatar:"LM", tags:["VIP"],               email:"lm@example.com",       phone:"+1-555-0301" },
    { id:"b2", name:"Sofia Reyes",      handle:"@sofiawanders",     platform:"AM", spend:890,  orders:4,  lastOrder:"5d ago",  category:"Bags",         status:"active",  score:7.2, avatar:"SR", tags:[],                    email:"sr@example.com",       phone:"+1-555-0302" },
    { id:"b3", name:"Nils Bergman",     handle:"@nilsroams",        platform:"IG", spend:340,  orders:2,  lastOrder:"58d ago", category:"Accessories",  status:"risk",    score:3.8, avatar:"NB", tags:[],                    email:"nb@example.com",       phone:"+1-555-0303" },
  ],
  mia: [  // Walmart Live
    { id:"b1",  name:"Jennifer Walsh",  handle:"@jenwshops",        platform:"AM", spend:18400, orders:124, lastOrder:"1d ago",  category:"Electronics",  status:"vip",    score:9.8, avatar:"JW", tags:["VIP","Power Buyer"],  email:"jw@example.com",       phone:"+1-555-0401" },
    { id:"b2",  name:"Carlos Mendez",   handle:"@carlom",           platform:"TT", spend:12800, orders:98,  lastOrder:"2d ago",  category:"Fashion",      status:"vip",    score:9.4, avatar:"CM", tags:["VIP","Multi-Brand"],  email:"cm@example.com",       phone:"+1-555-0402" },
    { id:"b3",  name:"Rachel Kim",      handle:"@rachelklive",      platform:"IG", spend:9840,  orders:72,  lastOrder:"1d ago",  category:"Beauty",       status:"vip",    score:9.1, avatar:"RK", tags:["VIP"],               email:"rk@example.com",       phone:"+1-555-0403" },
    { id:"b4",  name:"David Park",      handle:"@dpark_deals",      platform:"AM", spend:7200,  orders:54,  lastOrder:"3d ago",  category:"Home",         status:"vip",    score:8.8, avatar:"DP", tags:["VIP","Deal Hunter"], email:"dp@example.com",       phone:"+1-555-0404" },
    { id:"b5",  name:"Amber Stone",     handle:"@amberstone",       platform:"TT", spend:5600,  orders:42,  lastOrder:"4d ago",  category:"Beauty",       status:"vip",    score:8.4, avatar:"AS", tags:["VIP"],               email:"as@example.com",       phone:"+1-555-0405" },
    { id:"b6",  name:"Mike Torres",     handle:"@miket_shop",       platform:"AM", spend:3800,  orders:28,  lastOrder:"7d ago",  category:"Electronics",  status:"active", score:8.0, avatar:"MT", tags:["Big Spender"],       email:"mt@example.com",       phone:"+1-555-0406" },
    { id:"b7",  name:"Lisa Chang",      handle:"@lisachang",        platform:"IG", spend:2640,  orders:20,  lastOrder:"9d ago",  category:"Fashion",      status:"active", score:7.3, avatar:"LC", tags:[],                    email:"lc@example.com",       phone:"+1-555-0407" },
    { id:"b8",  name:"Rob Martinez",    handle:"@robm",             platform:"TT", spend:1980,  orders:14,  lastOrder:"6d ago",  category:"Toys",         status:"active", score:7.0, avatar:"RM", tags:[],                    email:"rm@example.com",       phone:"+1-555-0408" },
    { id:"b9",  name:"Tanya Brown",     handle:"@tanyab",           platform:"AM", spend:1420,  orders:10,  lastOrder:"12d ago", category:"Home",         status:"active", score:6.6, avatar:"TB", tags:[],                    email:"tb@example.com",       phone:"+1-555-0409" },
    { id:"b10", name:"Kevin Liu",       handle:"@kliu_shop",        platform:"TT", spend:980,   orders:7,   lastOrder:"15d ago", category:"Electronics",  status:"active", score:6.1, avatar:"KL", tags:[],                    email:"kl@example.com",       phone:"+1-555-0410" },
    { id:"b11", name:"Sarah Odom",      handle:"@sarahodom",        platform:"AM", spend:640,   orders:4,   lastOrder:"36d ago", category:"Grocery",      status:"risk",   score:4.9, avatar:"SO", tags:[],                    email:"so@example.com",       phone:"+1-555-0411" },
    { id:"b12", name:"Paul Grant",      handle:"@pgrant",           platform:"TT", spend:420,   orders:3,   lastOrder:"44d ago", category:"Fashion",      status:"risk",   score:4.2, avatar:"PG", tags:[],                    email:"pg@example.com",       phone:"+1-555-0412" },
  ],
};

// ─── SHOWS DATA ───────────────────────────────────────────────────────────────
const SHOWS = [
  { id:"sh1", title:"Spring Collection Launch",         date:"Feb 22, 2025", platform:"IG", platforms:["IG","TT"],      gmv:18420, buyers:84,  repeatRate:72, duration:"1h 48m", aiDebrief:"Strong launch — the Silk Wrap Dress drove 40% of GMV in the first 20 minutes. Olivia and Claire both went straight to checkout during the try-on segment. Schedule a follow-up members-only show before the full spring drop goes public.", topItem:"Silk Wrap Midi Dress", newBuyers:22 },
  { id:"sh2", title:"TikTok Style Drop #18",            date:"Feb 17, 2025", platform:"TT", platforms:["TT"],           gmv:12840, buyers:61,  repeatRate:58, duration:"1h 12m", aiDebrief:"Good reach — 28 first-time buyers. The bundle reveal outperformed individual items 3:1 on TikTok. Lower repeat rate is expected for TT but worth an SMS follow-up to the 33 new subscribers captured.", topItem:"Spring Style Bundle (3pc)", newBuyers:28 },
  { id:"sh3", title:"Amazon Members Flash Sale",        date:"Feb 12, 2025", platform:"AM", platforms:["AM","IG"],      gmv:9210,  buyers:48,  repeatRate:44, duration:"58m",    aiDebrief:"Amazon buyers skewed transactional — high conversion but low dwell time. The Linen Shirt was the breakout hit. Consider a targeted win-back email for the 26 buyers who browsed the blazer but didn't purchase.", topItem:"Linen Button-Down Shirt", newBuyers:31 },
  { id:"sh4", title:"Winter Clearance Event",           date:"Feb 10, 2025", platform:"IG", platforms:["IG","TT","AM"], gmv:21800, buyers:96,  repeatRate:78, duration:"2h 06m", aiDebrief:"Best show this month. 78% repeat rate driven by member early-access. The Wool Overcoat sold out in 12 minutes. Restock and schedule a dedicated outerwear show before end of season.", topItem:"Tailored Wool Overcoat", newBuyers:14 },
  { id:"sh5", title:"YouTube: New Arrivals Haul",       date:"Feb 8, 2025",  platform:"YT", platforms:["YT"],           gmv:7640,  buyers:38,  repeatRate:52, duration:"1h 22m", aiDebrief:"First YouTube show — strong top-of-funnel with 4.2K peak concurrent viewers. 38 buyers confirmed via Shopify attribution. Live Pixel captured 14 buyers end-to-end. 12 orders matched via UTM link. 6 via time-window. 6 manually reconciled. Consider longer dwell on hero products — YouTube viewers research more before buying.", topItem:"Merino Wool Blazer", newBuyers:38,
    ytAttribution: { method:"mixed", pixel:{ orders:14, confidence:"verified", sessionsCaptured:284 }, timeWindow:{ orders:12, confidence:"high", windowMins:15 }, utm:{ orders:6, link:"strmlive.com/yt/br-2025-02-08", clicks:284 }, manual:{ orders:6, pending:2 }, shopifyOrders:38, unattributed:0 }
  },
];

// ─── CAMPAIGNS DATA ───────────────────────────────────────────────────────────
const CAMPAIGNS = [
  { id:"c1", name:"Spring Launch Reminder",          type:"email",  status:"sent",  sentAt:"Feb 21, 2025", recipients:3420, opened:64, clicked:41, converted:28, gmv:8840  },
  { id:"c2", name:"VIP Members Early Access",        type:"sms",    status:"sent",  sentAt:"Feb 19, 2025", recipients:480,  opened:91, clicked:68, converted:52, gmv:12600 },
  { id:"c3", name:"Win-Back: 30-Day Inactive",       type:"email",  status:"sent",  sentAt:"Feb 8, 2025",  recipients:820,  opened:36, clicked:19, converted:11, gmv:2140  },
  { id:"c4", name:"New Arrivals Drop Alert",         type:"sms",    status:"draft", sentAt:null,           recipients:0,    opened:0,  clicked:0,  converted:0,  gmv:0     },
  { id:"c5", name:"IG Keyword: DM STYLE",            type:"ig_dm",  status:"sent",  sentAt:"Feb 20, 2025", recipients:1840, opened:96, clicked:74, converted:44, gmv:9820  },
  { id:"c6", name:"TikTok Drop Announcement",        type:"tt_dm",  status:"sent",  sentAt:"Feb 15, 2025", recipients:1120, opened:89, clicked:66, converted:31, gmv:5640  },
  { id:"c7", name:"Amazon Deal Notification",        type:"am_msg", status:"sent",  sentAt:"Feb 11, 2025", recipients:640,  opened:71, clicked:48, converted:24, gmv:3980  },
  { id:"c8", name:"IG: Bundle Drop Teaser",          type:"ig_dm",  status:"draft", sentAt:null,           recipients:0,    opened:0,  clicked:0,  converted:0,  gmv:0     },
];


const KEYWORD_AUTOMATIONS = [
  {
    id: "ka1",
    name: "Main Opt-In",
    status: "active",
    platforms: ["TT", "IG"],
    keywords: [
      { word: "JOIN",      optIns: 312, thisWeek: 28 },
      { word: "SUBSCRIBE", optIns: 94,  thisWeek: 11 },
      { word: "IN",        optIns: 58,  thisWeek: 7  },
    ],
    reply: "Hey {first_name}! 🎉 You're officially on the {shop_name} insider list. You'll get first access to new collections, live drops, and member-only offers. Stay tuned!",
    goal: "list_growth",
    createdAt: "Jan 10, 2025",
    totalOptIns: 464,
    byPlatform: { TT: 268, IG: 196 },
  },
  {
    id: "ka2",
    name: "Spring Launch Hype",
    status: "active",
    platforms: ["TT", "IG"],
    keywords: [
      { word: "STYLE",  optIns: 284, thisWeek: 68 },
      { word: "SPRING", optIns: 142, thisWeek: 44 },
    ],
    reply: "You're in for the Spring Collection launch! 🌸 I'll DM you 1 hour before we go live with the direct link and a members-only discount. See you there!",
    goal: "event",
    createdAt: "Feb 1, 2025",
    totalOptIns: 426,
    byPlatform: { TT: 248, IG: 178 },
  },
  {
    id: "ka3",
    name: "VIP Member Access",
    status: "active",
    platforms: ["IG"],
    keywords: [
      { word: "VIP",    optIns: 198, thisWeek: 22 },
      { word: "MEMBER", optIns: 86,  thisWeek: 14 },
    ],
    reply: "Welcome to the VIP list 👑 You'll get member-early access to every collection drop before it goes public. Watch your DMs — your welcome offer lands tomorrow.",
    goal: "vip_access",
    createdAt: "Jan 28, 2025",
    totalOptIns: 284,
    byPlatform: { TT: 0, IG: 284 },
  },
  {
    id: "ka4",
    name: "Bundle Drop Campaign",
    status: "active",
    platforms: ["TT"],
    keywords: [
      { word: "BUNDLE",  optIns: 188, thisWeek: 58 },
      { word: "DEAL",    optIns: 94,  thisWeek: 32 },
      { word: "SET",     optIns: 62,  thisWeek: 18 },
    ],
    reply: "You're in for the bundle drop! 🎁 Limited stock goes live tonight — I'll DM you the direct link the moment it's live. First 50 orders get free shipping!",
    goal: "product_drop",
    createdAt: "Feb 10, 2025",
    totalOptIns: 344,
    byPlatform: { TT: 344, IG: 0 },
  },
];

const GOAL_META = {
  list_growth:  { label: "List Growth",   color: "#10b981", bg: "#0a1e16",  icon: "📈" },
  event:        { label: "Event Alert",   color: "#3b82f6", bg: "#0f1e2e",  icon: "🔔" },
  vip_access:   { label: "VIP Access",    color: "#a78bfa", bg: "#2d1f5e",  icon: "👑" },
  product_drop: { label: "Product Drop",  color: "#f59e0b", bg: "#2e1f0a",  icon: "🎁" },
  discount:     { label: "Discount",      color: "#f43f5e", bg: "#2d1020",  icon: "💸" },
  win_back:     { label: "Win-Back",      color: "#ec4899", bg: "#2d1028",  icon: "♻️"  },
};

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
  starter:    'https://buy.stripe.com/test_7sY14pgHT60W0ji7Ql0kE03',
  growth:     'https://buy.stripe.com/test_14AcN72R3ahc9TSdaF0kE04',
  pro:        'https://buy.stripe.com/test_9B628tcrDfBw9TS8Up0kE05',
  enterprise: 'https://buy.stripe.com/test_7sY8wRfDP7509TS1rX0kE06',
};
// Redirect URLs to set in Stripe Dashboard → Payment Links → After Payment:
// Starter:    https://strmlive.com/welcome?plan=starter
// Growth:     https://strmlive.com/welcome?plan=growth
// Pro:        https://strmlive.com/welcome?plan=pro
// Enterprise: https://strmlive.com/welcome?plan=enterprise

const PLAN_META = {
  starter:    { price:"$79",  color:"#10b981", features:["Up to 2 live shows/month","Buyers CRM","Catalog management","Campaign tools","Subscriber list"] },
  growth:     { price:"$199", color:"#7c3aed", features:["Everything in Starter","Analytics & AI insights","Loyalty program","Live Companion","SMS campaigns"] },
  pro:        { price:"$399", color:"#f59e0b", features:["Everything in Growth","Production Suite","Camera & gimbal control","White-label reports","Priority support"] },
  enterprise: { price:"$999", color:"#a78bfa", features:["Everything in Pro","Up to 12 seller accounts","Team management & roles","White-label branding","Dedicated account manager"] },
};

// ─── CHECKOUT MODAL ───────────────────────────────────────────────────────────
// Branded interstitial shown before redirecting to Stripe — keeps UX native.
function CheckoutModal({ plan, onClose }) {
  const [countdown, setCountdown] = useState(null);
  const meta = PLAN_META[plan] || {};
  const link = STRIPE_LINKS[plan];

  const handleCheckout = () => {
    setCountdown(3);
    let c = 3;
    const t = setInterval(() => {
      c--;
      setCountdown(c);
      if (c <= 0) {
        clearInterval(t);
        window.open(link, "_blank");
        onClose();
      }
    }, 1000);
  };

  if (!plan || !link) return null;
  const planName = plan.charAt(0).toUpperCase() + plan.slice(1);

  return (
    <div onClick={onClose}
      style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.75)", zIndex:300, display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}>
      <div onClick={e=>e.stopPropagation()} className="pop-in"
        style={{ background:"#09090f", border:`1px solid ${meta.color}44`, borderRadius:20, padding:"32px", width:420, maxWidth:"94vw", position:"relative", overflow:"hidden" }}>

        {/* Ambient glow */}
        <div style={{ position:"absolute", top:-60, right:-60, width:200, height:200, borderRadius:"50%", background:meta.color, opacity:0.07, filter:"blur(60px)", pointerEvents:"none" }}/>

        {/* Header */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:22 }}>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ width:40, height:40, borderRadius:11, background:`linear-gradient(135deg,${meta.color},${meta.color}99)`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, fontWeight:900, color:"#fff" }}>S</div>
            <div>
              <div style={{ fontFamily:"'Syne',sans-serif", fontSize:16, fontWeight:800, color:C.text }}>Streamlive {planName}</div>
              <div style={{ fontSize:11, color:meta.color, fontWeight:700 }}>{meta.price} / month</div>
            </div>
          </div>
          <button onClick={onClose} style={{ background:"none", border:"none", color:C.muted, fontSize:18, cursor:"pointer", lineHeight:1, padding:"4px 6px" }}>✕</button>
        </div>

        {/* Feature list */}
        <div style={{ background:`${meta.color}08`, border:`1px solid ${meta.color}22`, borderRadius:12, padding:"14px 16px", marginBottom:22 }}>
          {(meta.features||[]).map((f,i) => (
            <div key={i} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:i<meta.features.length-1?9:0 }}>
              <div style={{ width:16, height:16, borderRadius:4, background:`${meta.color}20`, border:`1px solid ${meta.color}44`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:8, color:meta.color, fontWeight:800, flexShrink:0 }}>✓</div>
              <span style={{ fontSize:12, color:"#d1d5db" }}>{f}</span>
            </div>
          ))}
        </div>

        {/* Secure badge row */}
        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:18 }}>
          <div style={{ display:"flex", alignItems:"center", gap:5, background:"#0f1a14", border:"1px solid #10b98133", borderRadius:6, padding:"4px 10px" }}>
            <span style={{ fontSize:10 }}>🔒</span>
            <span style={{ fontSize:9, fontWeight:700, color:"#10b981" }}>Secured by Stripe</span>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:5, background:C.surface2, border:`1px solid ${C.border2}`, borderRadius:6, padding:"4px 10px" }}>
            <span style={{ fontSize:9, fontWeight:700, color:C.muted }}>Cancel anytime</span>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:5, background:C.surface2, border:`1px solid ${C.border2}`, borderRadius:6, padding:"4px 10px" }}>
            <span style={{ fontSize:9, fontWeight:700, color:C.muted }}>No setup fee</span>
          </div>
        </div>

        {/* CTA */}
        {countdown === null ? (
          <button onClick={handleCheckout}
            style={{ width:"100%", background:`linear-gradient(135deg,${meta.color},${meta.color}bb)`, border:"none", color:"#fff", fontSize:14, fontWeight:800, padding:"14px", borderRadius:11, cursor:"pointer", letterSpacing:"0.01em" }}>
            Continue to Checkout →
          </button>
        ) : (
          <button disabled
            style={{ width:"100%", background:`${meta.color}33`, border:`1px solid ${meta.color}44`, color:meta.color, fontSize:14, fontWeight:800, padding:"14px", borderRadius:11, cursor:"default", display:"flex", alignItems:"center", justifyContent:"center", gap:10 }}>
            <div style={{ width:14, height:14, border:`2px solid ${meta.color}44`, borderTop:`2px solid ${meta.color}`, borderRadius:"50%", animation:"spin .7s linear infinite" }}/>
            Opening Stripe in {countdown}…
          </button>
        )}

        <div style={{ marginTop:10, textAlign:"center", fontSize:10, color:C.subtle }}>
          You'll be taken to Stripe's secure checkout page
        </div>
      </div>
    </div>
  );
}


// ─── SHOPIFY CATALOG DATA ─────────────────────────────────────────────────────
const PRODUCTS = [
  // ── Banana Republic (Pro) — Apparel & Fashion ───────────────────────────────
  { id:"p1",  name:"Merino Wool Blazer",               sku:"BR-BLZ-001", price:228, cost:82,  inventory:48,  category:"Blazers",      image:"🧥", platforms:["TT","IG","AM","YT"], showReady:true,  shopifyId:"sh_001", aiScore:9.4, soldLast30:62,  avgPerShow:5.8 },
  { id:"p2",  name:"Italian Linen Trousers",            sku:"BR-TRS-002", price:148, cost:51,  inventory:84,  category:"Bottoms",      image:"👖", platforms:["TT","IG","AM","YT"], showReady:true,  shopifyId:"sh_002", aiScore:8.9, soldLast30:88,  avgPerShow:7.2 },
  { id:"p3",  name:"Leather Crossbody Bag",             sku:"BR-BAG-003", price:198, cost:74,  inventory:36,  category:"Accessories",  image:"👜", platforms:["IG","AM"],         showReady:true,  shopifyId:"sh_003", aiScore:9.1, soldLast30:44,  avgPerShow:3.9 },
  { id:"p4",  name:"Silk Wrap Midi Dress",              sku:"BR-DRS-004", price:268, cost:96,  inventory:22,  category:"Dresses",      image:"👗", platforms:["TT","IG","YT"],    showReady:true,  shopifyId:"sh_004", aiScore:9.6, soldLast30:38,  avgPerShow:4.1 },
  { id:"p5",  name:"Cashmere Crewneck Sweater",         sku:"BR-KNT-005", price:188, cost:68,  inventory:60,  category:"Knitwear",     image:"🧶", platforms:["TT","IG","AM"],    showReady:false, shopifyId:"sh_005", aiScore:8.4, soldLast30:52,  avgPerShow:5.0 },
  { id:"p6",  name:"Slim Chino Shorts",                 sku:"BR-SHT-006", price:80,  cost:28,  inventory:120, category:"Bottoms",      image:"🩳", platforms:["TT","AM"],         showReady:true,  shopifyId:"sh_006", aiScore:7.8, soldLast30:94,  avgPerShow:8.4 },
  { id:"p7",  name:"Suede Chelsea Boots",               sku:"BR-BOO-007", price:298, cost:108, inventory:18,  category:"Footwear",     image:"👢", platforms:["IG","AM"],         showReady:false, shopifyId:"sh_007", aiScore:8.2, soldLast30:28,  avgPerShow:2.6 },
  { id:"p8",  name:"Spring Style Bundle (3pc)",         sku:"BR-BND-008", price:148, cost:48,  inventory:30,  category:"Bundles",      image:"🎁", platforms:["TT","IG","AM","YT"], showReady:true,  shopifyId:"sh_008", aiScore:9.2, soldLast30:71,  avgPerShow:6.8 },
  { id:"p9",  name:"Tailored Wool Overcoat",            sku:"BR-OVR-009", price:498, cost:182, inventory:12,  category:"Outerwear",    image:"🧣", platforms:["IG","AM"],         showReady:false, shopifyId:"sh_009", aiScore:7.4, soldLast30:14,  avgPerShow:1.4 },
  { id:"p10", name:"Linen Button-Down Shirt",           sku:"BR-SHR-010", price:98,  cost:34,  inventory:96,  category:"Tops",         image:"👔", platforms:["TT","IG","AM","YT"], showReady:true,  shopifyId:"sh_010", aiScore:8.7, soldLast30:108, avgPerShow:9.1 },

  // ── Kylie Cosmetics (Growth) — Beauty ──────────────────────────────────────
  { id:"p11", name:"Matte Lip Kit — Ruby",              sku:"KC-LIP-001", price:29,  cost:7,   inventory:840, category:"Lip",          image:"💄", platforms:["TT","IG"],         showReady:true,  shopifyId:"sh_011", aiScore:9.8, soldLast30:482, avgPerShow:48.2 },
  { id:"p12", name:"Kyshadow Palette — Bronze",         sku:"KC-EYE-002", price:45,  cost:11,  inventory:420, category:"Eye",          image:"✨", platforms:["TT","IG"],         showReady:true,  shopifyId:"sh_012", aiScore:9.4, soldLast30:314, avgPerShow:31.4 },
  { id:"p13", name:"Skin Tint SPF 30",                  sku:"KC-FAC-003", price:38,  cost:9,   inventory:560, category:"Face",         image:"🌟", platforms:["TT","IG"],         showReady:true,  shopifyId:"sh_013", aiScore:9.2, soldLast30:268, avgPerShow:26.8 },
  { id:"p14", name:"Gloss Drip — Clear",                sku:"KC-GLS-004", price:16,  cost:4,   inventory:1200,category:"Lip",          image:"💋", platforms:["TT","IG"],         showReady:true,  shopifyId:"sh_014", aiScore:8.8, soldLast30:620, avgPerShow:62.0 },
  { id:"p15", name:"Holiday Collection Set (6pc)",      sku:"KC-SET-005", price:89,  cost:22,  inventory:180, category:"Sets",         image:"🎀", platforms:["TT","IG"],         showReady:true,  shopifyId:"sh_015", aiScore:9.6, soldLast30:188, avgPerShow:18.8 },
  { id:"p16", name:"Pressed Blush — Peach Sorbet",      sku:"KC-BLH-006", price:24,  cost:6,   inventory:680, category:"Face",         image:"🍑", platforms:["TT","IG"],         showReady:false, shopifyId:"sh_016", aiScore:8.6, soldLast30:244, avgPerShow:24.4 },
  { id:"p17", name:"Kylighter Highlighter Stick",       sku:"KC-HGL-007", price:21,  cost:5,   inventory:740, category:"Face",         image:"💫", platforms:["TT","IG"],         showReady:true,  shopifyId:"sh_017", aiScore:8.4, soldLast30:312, avgPerShow:31.2 },

  // ── Tropicfeel (Starter) — Travel Footwear & Gear ──────────────────────────
  { id:"p18", name:"Canyon All-Terrain Sneaker",        sku:"TF-SNK-001", price:148, cost:58,  inventory:84,  category:"Shoes",        image:"👟", platforms:["IG","AM"],         showReady:true,  shopifyId:"sh_018", aiScore:8.4, soldLast30:24,  avgPerShow:3.2 },
  { id:"p19", name:"Shell Travel Backpack 26L",         sku:"TF-BAG-001", price:178, cost:68,  inventory:42,  category:"Bags",         image:"🎒", platforms:["IG","AM"],         showReady:true,  shopifyId:"sh_019", aiScore:8.0, soldLast30:14,  avgPerShow:2.4 },
  { id:"p20", name:"Nest 2-in-1 Sandal",                sku:"TF-SND-001", price:118, cost:44,  inventory:62,  category:"Shoes",        image:"🩴", platforms:["IG"],              showReady:true,  shopifyId:"sh_020", aiScore:7.6, soldLast30:18,  avgPerShow:2.8 },
  { id:"p21", name:"Tropicfeel Starter Bundle",         sku:"TF-BND-001", price:228, cost:82,  inventory:24,  category:"Bundles",      image:"🌴", platforms:["IG","AM"],         showReady:false, shopifyId:"sh_021", aiScore:7.2, soldLast30:8,   avgPerShow:1.4 },
];

// ─── PLATFORM FEES (from Shopify seller context) ─────────────────────────────
// Source: each platform's published seller fee schedule
const PLATFORM_FEES = {
  WN: 0.08,   // Whatnot: 8% transaction fee
  TT: 0.05,   // TikTok Shop: 5% referral fee
  AM: 0.15,   // Amazon: ~15% referral fee (varies by category)
  IG: 0.05,   // Instagram Shops: 5% selling fee
  YT: 0.00,   // YouTube Live: 0% — fulfilled via Shopify directly
};

// Default minimum acceptable margin (seller can override in Settings)
const DEFAULT_MIN_MARGIN = 0.15; // 15%

// ── Profit helpers ────────────────────────────────────────────────────────────
// All calculations from Shopify's inventory_item.cost + product.price
//   grossMargin    = (price - cost) / price
//   netRevenue     = price * (1 - discPct) * (1 - platformFee)
//   netProfit      = netRevenue - cost
//   netMargin      = netProfit / (price * (1-discPct))   ← on discounted price
//   maxSafeDisc    = 1 - cost / (price * (1-fee-minMargin))
const calcProfit = (price, cost, discPct, platformKey) => {
  const fee       = PLATFORM_FEES[platformKey] || 0;
  const discPrice = price * (1 - discPct / 100);
  const netRev    = discPrice * (1 - fee);
  const profit    = netRev - cost;
  const margin    = discPrice > 0 ? profit / discPrice : 0;
  return { discPrice, netRev, profit, margin, fee };
};

const calcMaxSafeDisc = (price, cost, platformKey, minMargin = DEFAULT_MIN_MARGIN) => {
  const fee = PLATFORM_FEES[platformKey] || 0;
  const denom = price * (1 - fee - minMargin);
  if (denom <= 0) return 0;
  return Math.max(0, Math.floor((1 - cost / denom) * 100));
};

const marginColor = (margin) => {
  if (margin >= 0.30) return "#10b981";  // green  — healthy
  if (margin >= 0.15) return "#f59e0b";  // amber  — caution
  if (margin >= 0)    return "#ef4444";  // red    — below min
  return "#7f1d1d";                       // dark   — selling at a loss
};

const marginLabel = (margin) => {
  if (margin >= 0.30) return "Healthy";
  if (margin >= 0.15) return "Caution";
  if (margin >= 0)    return "Below min";
  return "At a loss";
};

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
  { id:"dashboard",   label:"Dashboard",   icon:"⬡",  route:"/dashboard" },
  { id:"analytics",   label:"Analytics",   icon:"◑",  route:"/analytics" },
  { id:"buyers",      label:"Buyers",      icon:"◉",  route:"/buyers" },
  { id:"shows",       label:"Shows",       icon:"◈",  route:"/shows" },
  { id:"production",  label:"Production",  icon:"⬛",  route:"/production" },
  { id:"catalog",     label:"Catalog",     icon:"◧",  route:"/catalog" },
  { id:"campaigns",   label:"Campaigns",   icon:"◆",  route:"/campaigns" },
  { id:"subscribers", label:"Subscribers", icon:"●",  route:"/subscribers" },
  { id:"loyalty",     label:"Loyalty",     icon:"♦",  route:"/loyalty" },
  { id:"settings",    label:"Settings",    icon:"◎",  route:"/settings" },
];

// Producer role requires Pro+ plan — Production Suite is locked on Starter/Growth.
// Inviting a Producer on Starter or Growth shows an upgrade upsell instead.
const PRODUCER_NAV_ACCESS = ["dashboard","shows","production","catalog","settings"];

// Plan hierarchy: 0=starter, 1=growth, 2=pro, 3=enterprise
const PLAN_LEVEL = { starter:0, growth:1, pro:2, enterprise:3 };

// Which nav items each plan can access
const PLAN_FEATURES = {
  starter:    ["dashboard","buyers","shows","catalog","campaigns","subscribers","settings"],
  growth:     ["dashboard","analytics","buyers","shows","catalog","campaigns","subscribers","loyalty","settings"],
  pro:        ["dashboard","analytics","buyers","shows","production","catalog","campaigns","subscribers","loyalty","settings"],
  enterprise: ["dashboard","analytics","buyers","shows","production","catalog","campaigns","subscribers","loyalty","settings"],
};

// ─── ENTERPRISE TEAM ──────────────────────────────────────────────────────────
const ENTERPRISE_TEAM = [
  { id:"tm1",  name:"Rachel Nguyen",  role:"Owner",    email:"rachel@walmart.com",   avatar:"RN", color:"#a78bfa", lastActive:"Online now", assignedSellers:["all"],                         permissions:["all"] },
  { id:"tm2",  name:"Jake Chen",      role:"Manager",  email:"jake@walmart.com",     avatar:"JC", color:"#7c3aed", lastActive:"2h ago",      assignedSellers:["s1","s4","s6","s11"],          permissions:["view","edit","campaigns","buyers","shows"] },
  { id:"tm3",  name:"Priya Singh",    role:"Manager",  email:"priya@walmart.com",    avatar:"PS", color:"#10b981", lastActive:"1h ago",      assignedSellers:["s2","s5","s9","s10"],          permissions:["view","edit","campaigns","buyers","shows"] },
  { id:"tm4",  name:"Marcus Lee",     role:"Analyst",  email:"marcus@walmart.com",   avatar:"ML", color:"#f59e0b", lastActive:"4h ago",      assignedSellers:["all"],                         permissions:["view","analytics"] },
  { id:"tm5",  name:"Devon Walsh",    role:"Manager",  email:"devon@walmart.com",    avatar:"DW", color:"#ec4899", lastActive:"30m ago",     assignedSellers:["s3","s7","s8"],               permissions:["view","edit","campaigns","buyers","shows"] },
  { id:"tm6",  name:"Amy Torres",     role:"Support",  email:"amy@walmart.com",      avatar:"AT", color:"#3b82f6", lastActive:"Yesterday",   assignedSellers:["s1","s2","s3","s4","s5","s6"], permissions:["view","buyers"] },
  { id:"tm7",  name:"Chris Park",     role:"Support",  email:"chris@walmart.com",    avatar:"CP", color:"#f43f5e", lastActive:"3h ago",      assignedSellers:["s7","s8","s9","s10","s11","s12"], permissions:["view","buyers"] },
  { id:"tm8",  name:"Sam Rivera",     role:"Analyst",  email:"sam@walmart.com",      avatar:"SR", color:"#a78bfa", lastActive:"1d ago",      assignedSellers:["all"],                         permissions:["view","analytics"] },
  { id:"tm9",  name:"Jordan Reed",    role:"Producer", email:"jordan@walmart.com",   avatar:"JR", color:"#06b6d4", lastActive:"Online now",  assignedSellers:["s1","s2","s8","s10","s11"],   permissions:["shows","production","catalog","live"] },
];

// ─── ENTERPRISE NAV ───────────────────────────────────────────────────────────
const ENTERPRISE_NAV = [
  { id:"network",     label:"Network",     icon:"⬡",  desc:"Agency overview" },
  { id:"sellers",     label:"Sellers",     icon:"◉",  desc:"Manage accounts" },
  { id:"net-analytics",label:"Analytics",  icon:"◑",  desc:"Cross-network" },
  { id:"team",        label:"Team",        icon:"◈",  desc:"Members & roles" },
  { id:"billing",     label:"Billing",     icon:"◆",  desc:"Plans & invoices" },
  { id:"white-label", label:"White Label", icon:"✦",  desc:"Branding & domain" },
  { id:"settings",    label:"Settings",    icon:"◎",  desc:"Account settings" },
];

// Upgrade info shown on the locked screen
const UPGRADE_WALLS = {
  analytics: {
    icon:"◑", title:"Analytics", requiredPlan:"growth", requiredColor:"#7c3aed",
    headline:"Understand what's driving your revenue.",
    desc:"Unlock revenue trends, audience health scores, LTV distribution, platform comparison, and 6 weekly AI-generated recommendations — all built from your real show and buyer data.",
    features:["GMV trend charts & platform breakdown","Buyer health: VIP, at-risk, dormant segments","LTV distribution & purchase frequency","Show-by-show performance comparison","✦ AI Insights — 6 prioritized weekly recommendations"],
  },
  loyalty: {
    icon:"♦", title:"Loyalty Hub", requiredPlan:"growth", requiredColor:"#7c3aed",
    headline:"Turn one-time buyers into lifetime fans.",
    desc:"Activate all 4 loyalty tiers — Bronze, Silver, Gold, and VIP. Buyers earn points automatically, unlock perks, and get early show access. Starter includes Bronze and Silver only.",
    features:["Gold & VIP tier management","Points leaderboard & tier health dashboard","Birthday rewards & exclusive perks","VIP early access windows per show","Automated tier-up notifications"],
  },
  production: {
    icon:"⬛", title:"Production Suite", requiredPlan:"pro", requiredColor:"#f59e0b",
    headline:"Run a professional broadcast from one screen.",
    desc:"Connect and control your Sony cameras, DJI gimbals, and studio lighting alongside OBS scene switching — all from inside Streamlive. No more alt-tabbing mid-show.",
    features:["Sony FX3 / FX6 camera control via SDK","DJI RS4 Pro gimbal positioning over Bluetooth","Elgato, Aputure & Godox lighting API","OBS scene switcher via WebSocket v5","Production automation rules engine"],
  },
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
function ScreenDashboard({ persona, buyers, navigate, shows }) {
  const recentShows = shows || SHOWS;
  const vip     = buyers.filter(b=>b.status==="vip").length;
  const atRisk  = buyers.filter(b=>b.status==="risk").length;
  const dormant = buyers.filter(b=>b.status==="dormant").length;
  const totalGMV = recentShows.reduce((a,s)=>a+s.gmv,0);

  // ── ENTERPRISE DASHBOARD ───────────────────────────────────────────────────
  if (persona.plan === "enterprise") {
    const networkGMV   = persona.managedSellers.reduce((a,s)=>a+s.gmv, 0);
    const activeSellers = persona.managedSellers.filter(s=>s.status==="active").length;
    const planBreakdown = persona.managedSellers.reduce((acc, s) => { acc[s.plan]=(acc[s.plan]||0)+1; return acc; }, {});
    const topSellers    = [...persona.managedSellers].sort((a,b)=>b.gmv-a.gmv).slice(0,5);

    return (
      <div style={{ padding:"28px 32px", overflowY:"auto", height:"100%" }}>
        {/* GREETING */}
        <div style={{ marginBottom:24, display:"flex", alignItems:"flex-start", justifyContent:"space-between", flexWrap:"wrap", gap:12 }}>
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:6 }}>
              <div style={{ fontFamily:"'Syne',sans-serif", fontSize:22, fontWeight:800, color:C.text, letterSpacing:"-0.5px" }}>
                Good evening, {persona.name.split(" ")[0]} 👋
              </div>
              <span style={{ fontSize:9, fontWeight:800, color:"#a78bfa", background:"#a78bfa18", border:"1px solid #a78bfa44", padding:"3px 10px", borderRadius:99, textTransform:"uppercase", letterSpacing:"0.08em" }}>Enterprise</span>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:8, fontSize:12, color:C.muted }}>
              <span>LiveScale Agency</span>
              <span style={{ color:C.subtle }}>·</span>
              <span style={{ color:"#10b981", fontSize:10, fontWeight:600 }}>🌐 {persona.whiteLabelDomain}</span>
              <span style={{ color:C.subtle }}>·</span>
              <span>{persona.teamSize} team members</span>
            </div>
          </div>
          <div style={{ display:"flex", gap:8 }}>
            <div style={{ background:"#a78bfa10", border:"1px solid #a78bfa33", borderRadius:10, padding:"8px 14px", textAlign:"center" }}>
              <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:18, fontWeight:700, color:"#a78bfa" }}>{persona.sellerCount}</div>
              <div style={{ fontSize:9, color:C.subtle }}>Sellers</div>
            </div>
            <div style={{ background:"#10b98110", border:"1px solid #10b98133", borderRadius:10, padding:"8px 14px", textAlign:"center" }}>
              <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:18, fontWeight:700, color:"#10b981" }}>{activeSellers}</div>
              <div style={{ fontSize:9, color:C.subtle }}>Active</div>
            </div>
            <div style={{ background:"#7c3aed10", border:"1px solid #7c3aed33", borderRadius:10, padding:"8px 14px", textAlign:"center" }}>
              <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:18, fontWeight:700, color:"#7c3aed" }}>{persona.teamSize}</div>
              <div style={{ fontSize:9, color:C.subtle }}>Team</div>
            </div>
          </div>
        </div>

        {/* NETWORK STATS */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:24 }}>
          <StatCard label="Network GMV"    value={`$${(networkGMV/1000).toFixed(0)}k`}    sub="across all sellers"      color="#a78bfa" />
          <StatCard label="Total Buyers"   value={persona.buyerCount.toLocaleString()}       sub="managed network-wide"   color="#7c3aed" />
          <StatCard label="Subscribers"    value={persona.subscriberCount.toLocaleString()}  sub="across all opt-in pages" color="#10b981" />
          <StatCard label="Total Shows"    value={persona.showCount}                          sub="in managed accounts"    color="#f59e0b" />
        </div>

        {/* SELLER NETWORK TABLE + PLAN BREAKDOWN */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 300px", gap:16, marginBottom:20 }}>
          {/* Seller table */}
          <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:14, padding:"18px 20px" }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
              <span style={{ fontSize:12, fontWeight:700, color:C.text }}>Managed Seller Accounts</span>
              <span style={{ fontSize:10, color:C.subtle }}>{activeSellers} active · {persona.sellerCount - activeSellers} paused</span>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
              {persona.managedSellers.map((s,i)=>{
                const planCol = { starter:"#10b981", growth:"#7c3aed", pro:"#f59e0b" }[s.plan] || "#a78bfa";
                return (
                  <div key={i} style={{ display:"flex", alignItems:"center", gap:10, padding:"9px 12px", background:C.surface2, border:`1px solid ${C.border}`, borderRadius:9 }}>
                    <div style={{ width:28, height:28, borderRadius:8, background:`${planCol}18`, border:`1px solid ${planCol}33`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:9, fontWeight:800, color:planCol, flexShrink:0 }}>
                      {s.name.slice(0,2).toUpperCase()}
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:12, fontWeight:600, color:C.text }}>{s.name}</div>
                    </div>
                    <span style={{ fontSize:8, fontWeight:700, color:planCol, background:`${planCol}18`, border:`1px solid ${planCol}33`, padding:"1px 7px", borderRadius:4, textTransform:"uppercase" }}>{s.plan}</span>
                    <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:12, fontWeight:700, color:C.text, minWidth:58, textAlign:"right" }}>${(s.gmv/1000).toFixed(1)}k</div>
                    <div style={{ width:6, height:6, borderRadius:"50%", background:s.status==="active"?"#10b981":"#374151", flexShrink:0 }} />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right column */}
          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            {/* Plan breakdown */}
            <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:14, padding:"16px 18px" }}>
              <div style={{ fontSize:11, fontWeight:700, color:C.text, marginBottom:14 }}>Sellers by Plan</div>
              {Object.entries(planBreakdown).map(([plan, count])=>{
                const col = { starter:"#10b981", growth:"#7c3aed", pro:"#f59e0b" }[plan] || "#a78bfa";
                return (
                  <div key={plan} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
                    <span style={{ fontSize:9, fontWeight:700, color:col, background:`${col}18`, border:`1px solid ${col}33`, padding:"1px 7px", borderRadius:4, textTransform:"uppercase", minWidth:54, textAlign:"center" }}>{plan}</span>
                    <div style={{ flex:1, height:4, background:C.border2, borderRadius:2, overflow:"hidden" }}>
                      <div style={{ width:`${(count/persona.sellerCount)*100}%`, height:"100%", background:col, borderRadius:2 }} />
                    </div>
                    <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:11, fontWeight:700, color:C.text, minWidth:14, textAlign:"right" }}>{count}</span>
                  </div>
                );
              })}
            </div>
            {/* White label callout */}
            <div style={{ background:"linear-gradient(135deg,#1a0f2e,#12102a)", border:"1px solid #a78bfa33", borderRadius:14, padding:"16px 18px" }}>
              <div style={{ fontSize:10, fontWeight:800, color:"#a78bfa", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:8 }}>White Label Active</div>
              <div style={{ fontSize:12, color:C.text, fontWeight:600, marginBottom:4 }}>{persona.whiteLabelDomain}</div>
              <div style={{ fontSize:11, color:C.muted, lineHeight:1.5 }}>Your sellers see your branding, your domain. Streamlive is invisible.</div>
              <div style={{ marginTop:12, display:"flex", gap:6, flexWrap:"wrap" }}>
                {["Custom domain","Your logo","SSO ready","API access"].map(f=>(
                  <span key={f} style={{ fontSize:9, fontWeight:700, color:"#a78bfa", background:"#a78bfa12", border:"1px solid #a78bfa33", padding:"2px 8px", borderRadius:5 }}>{f}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  // ── END ENTERPRISE DASHBOARD ───────────────────────────────────────────────

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
          {recentShows.slice(0,4).map((s,idx)=>{
            const pl     = PLATFORMS[s.platform];
            const isJust = s.isNew && idx === 0;
            return (
              <div key={s.id} onClick={()=>navigate("show-report", { showId:s.id })}
                style={{ background: isJust ? `${C.green}0d` : C.surface2,
                  border: `1px solid ${isJust ? C.green+"55" : C.border}`,
                  borderRadius:10, padding:"12px 14px", cursor:"pointer",
                  position:"relative", overflow:"hidden",
                  transition:"border-color .2s" }}>
                {isJust && (
                  <div style={{ position:"absolute", top:-20, right:-20, width:80, height:80, borderRadius:"50%", background:C.green, opacity:0.07, filter:"blur(20px)", pointerEvents:"none" }}/>
                )}
                {/* Header row: platform pill + date + just ended badge */}
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:8, gap:8 }}>
                  <PlatformPill code={s.platform} />
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginLeft:"auto" }}>
                    <span style={{ fontSize:10, color:C.muted, fontFamily:"'JetBrains Mono',monospace" }}>{s.date}</span>
                    {isJust && (
                      <div style={{ display:"flex", alignItems:"center", gap:4, background:"#10b98120", border:"1px solid #10b98144", borderRadius:99, padding:"2px 8px", flexShrink:0 }}>
                        <div style={{ width:6, height:6, borderRadius:"50%", background:C.green, animation:"pulse 1.5s infinite" }}/>
                        <span style={{ fontSize:8, fontWeight:800, color:C.green, textTransform:"uppercase", letterSpacing:"0.07em" }}>Just Ended</span>
                      </div>
                    )}
                  </div>
                </div>
                <div style={{ fontSize:12, fontWeight:600, color:C.text, marginBottom:6 }}>{s.title}</div>
                <div style={{ display:"flex", gap:14 }}>
                  <div><span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:13, fontWeight:700, color:C.green }}>${s.gmv.toLocaleString()}</span><span style={{ fontSize:10, color:C.muted }}> GMV</span></div>
                  <div><span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:13, fontWeight:700, color:C.text }}>{s.buyers}</span><span style={{ fontSize:10, color:C.muted }}> buyers</span></div>
                  <div><span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:13, fontWeight:700, color:"#a78bfa" }}>{s.repeatRate}%</span><span style={{ fontSize:10, color:C.muted }}> repeat</span></div>
                </div>
                {isJust && s.duration && (
                  <div style={{ marginTop:8, fontSize:9, color:C.green, fontWeight:600 }}>⏱ {s.duration} · {s.newBuyers} new buyer{s.newBuyers!==1?"s":""}</div>
                )}
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
              <div style={{ alignSelf:"center", display:"flex" }}><PlatformPill code={b.platform} /></div>
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
    { date:"Feb 20, 2025", event:"Placed order #34 — Silk Wrap Midi Dress", amount:268 },
    { date:"Feb 15, 2025", event:"Placed order #33 — Bowman Chrome Prospect", amount:185 },
    { date:"Feb 10, 2025", event:"Subscribed to show reminders via SMS", amount:null },
    { date:"Feb 1,  2025", event:"Placed order #32 — Spring Style Bundle (3pc)", amount:148 },
    { date:"Jan 24, 2025", event:"Placed order #31 — Merino Wool Blazer", amount:228 },
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
          <div style={{ display:"flex", gap:8, marginBottom:10, flexWrap:"wrap" }}>
            <PlatformPill code={buyer.platform} />
            <Badge label={st.label} bg={st.bg} text={st.text} />
            {buyer.ytAttribution && (
              <span style={{ fontSize:9, fontWeight:700, color:"#ff6b6b", background:"#ff000018", border:"1px solid #ff000033", padding:"2px 8px", borderRadius:5, display:"flex", alignItems:"center", gap:4 }}>
                <span>▶</span>
                <span>Shopify · {buyer.ytAttribution === "utm-link" ? "UTM link" : buyer.ytAttribution === "time-window" ? "Time-window" : "Manual"}</span>
              </span>
            )}
            {buyer.shopifyCustomerId && (
              <span style={{ fontSize:9, color:C.subtle, background:C.surface2, border:`1px solid ${C.border}`, padding:"2px 8px", borderRadius:5, fontFamily:"'JetBrains Mono',monospace" }}>
                {buyer.shopifyCustomerId}
              </span>
            )}
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
function ScreenShows({ navigate, persona, shows }) {
  const allShows = shows || SHOWS;
  return (
    <div style={{ padding:"28px 32px", overflowY:"auto", height:"100%" }}>
      <div style={{ marginBottom:24 }}>
        <div style={{ fontFamily:"'Syne',sans-serif", fontSize:22, fontWeight:800, color:C.text, letterSpacing:"-0.5px" }}>Shows</div>
        <div style={{ fontSize:12, color:C.muted, marginTop:4 }}>{allShows.length} shows recorded across all platforms</div>
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
        {allShows.map(s=>{
          const showPlatforms = s.platforms || [s.platform];
          return (
            <div key={s.id} onClick={()=>navigate("show-report", { showId:s.id })} style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:14, padding:"18px 20px", cursor:"pointer", transition:"border-color .15s" }}
              onMouseEnter={e=>e.currentTarget.style.borderColor=C.border2}
              onMouseLeave={e=>e.currentTarget.style.borderColor=C.border}
            >
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
                <div>
                  <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                    {showPlatforms.map(p => <PlatformPill key={p} code={p} />)}
                  </div>
                  <div style={{ fontSize:13, fontWeight:700, color:C.text, marginTop:8 }}>{s.title}</div>
                  <div style={{ fontSize:11, color:C.muted, marginTop:3, fontFamily:"'JetBrains Mono',monospace" }}>{s.date} · {s.duration}</div>
                </div>
                <div style={{ fontSize:10, color:C.accent }}>View report →</div>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10 }}>
                {[
                  { label:"GMV",         value:`$${s.gmv.toLocaleString()}`, color:C.green },
                  { label:"Buyers",      value:s.buyers,                     color:C.text  },
                  { label:"Repeat Rate", value:`${s.repeatRate}%`,           color:"#a78bfa" },
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
function ScreenShowReport({ show, allShows, buyers, navigate }) {
  if (!show) return <div style={{ padding:40, color:C.muted }}>Show not found.</div>;

  const pl = PLATFORMS[show.platform];

  // ── AI debrief state ───────────────────────────────────────────────────────
  const [aiText,       setAiText]       = useState("");
  const [aiLoading,    setAiLoading]    = useState(false);
  const [aiGenerated,  setAiGenerated]  = useState(false);

  // ── Derived data ───────────────────────────────────────────────────────────
  const shows        = allShows || SHOWS;
  const showIdx      = shows.findIndex(s => s.id === show.id);
  const prevShow     = showIdx >= 0 ? shows[showIdx + 1] : null;
  const gmvChange    = prevShow ? Math.round((show.gmv - prevShow.gmv) / prevShow.gmv * 100) : null;
  const buyerChange  = prevShow ? Math.round((show.buyers - prevShow.buyers) / prevShow.buyers * 100) : null;
  const repeatChange = prevShow ? (show.repeatRate - prevShow.repeatRate) : null;

  // Buyer segments for this show
  const showBuyers   = buyers ? buyers.slice(0, show.buyers) : [];
  const vipCount     = showBuyers.filter(b => b.status === "vip").length;
  const newCount     = show.newBuyers || showBuyers.filter(b => b.status === "new").length;
  const repeatCount  = Math.max(0, show.buyers - newCount);
  const vipGMV       = Math.round(show.gmv * 0.61);
  const repeatGMV    = Math.round(show.gmv * 0.28);
  const newGMV       = Math.round(show.gmv * 0.11);

  // Simulated GMV by 30-min interval (scaled to show.gmv)
  const rawCurve     = [4,9,18,34,62,98,140,176,210,198,172,144,110,82,58,38,22,12,6];
  const curveSum     = rawCurve.reduce((a,v)=>a+v,0);
  const gmvCurve     = rawCurve.map(v => Math.round(v/curveSum * show.gmv));
  const peakIdx      = gmvCurve.indexOf(Math.max(...gmvCurve));
  const peakLabel    = `${30 * peakIdx}m`;

  // Product performance (seeded from PRODUCTS + show data)
  const topProducts  = PRODUCTS.filter(p => p.showReady).slice(0, 5).map((p, i) => ({
    ...p,
    unitsSold: [8, 5, 4, 3, 2][i] || 1,
    revenue:   Math.round([8,5,4,3,2][i] * p.price),
    margin:    p.cost ? Math.round((p.price - p.cost) / p.price * 100) : null,
  }));

  // Platform context
  const platformFee = PLATFORM_FEES[show.platform] || 0;
  const netRevenue  = Math.round(show.gmv * (1 - platformFee));
  const platformCut = Math.round(show.gmv * platformFee);

  // ── Generate AI debrief ────────────────────────────────────────────────────
  const generateAI = async () => {
    setAiLoading(true);
    setAiText("");
    const prompt = `You are a live commerce analyst for a trading card seller on ${show.platform === "WN" ? "Whatnot" : show.platform === "TT" ? "TikTok Shop" : show.platform === "AM" ? "Amazon Live" : show.platform === "YT" ? "YouTube Live" : "Instagram Shopping"}.

Analyze this show performance and write a sharp, specific debrief (4-6 sentences, no bullet points, conversational but data-driven):

Show: "${show.title}"
Date: ${show.date}  |  Duration: ${show.duration || "N/A"}
GMV: $${show.gmv.toLocaleString()}  |  Buyers: ${show.buyers}  |  New buyers: ${newCount}
Repeat rate: ${show.repeatRate}%  |  Top item: ${show.topItem}
Net revenue after ${Math.round(platformFee*100)}% platform fee: $${netRevenue.toLocaleString()}
${prevShow ? `vs. previous show: GMV ${gmvChange > 0 ? "+" : ""}${gmvChange}%, buyers ${buyerChange > 0 ? "+" : ""}${buyerChange}%, repeat rate ${repeatChange > 0 ? "+" : ""}${repeatChange}pp` : ""}
VIP buyers: ${vipCount} (drove ~61% of GMV)

Cover: what went well, any red flags, what to do differently next show. Be specific and direct. No fluff.`;

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      const data = await res.json();
      const text = (data.content || []).filter(b => b.type === "text").map(b => b.text).join("");
      setAiText(text);
      setAiGenerated(true);
    } catch (e) {
      setAiText("Unable to generate insights right now. Check your connection and try again.");
    }
    setAiLoading(false);
  };

  const ChangeChip = ({ val, suffix = "%" }) => {
    if (val === null) return null;
    const pos = val >= 0;
    return (
      <span style={{ fontSize:9, fontWeight:700, color: pos ? C.green : "#ef4444", background: pos ? "#10b98115" : "#ef444415", border:`1px solid ${pos ? "#10b98133" : "#ef444433"}`, padding:"2px 6px", borderRadius:99, marginLeft:6 }}>
        {pos ? "+" : ""}{val}{suffix}
      </span>
    );
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100%", overflow:"hidden" }}>

      {/* ── STICKY HEADER ── */}
      <div style={{ padding:"14px 28px 14px", borderBottom:`1px solid ${C.border}`, flexShrink:0, background:C.surface }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <button onClick={()=>navigate("shows")} style={{ fontSize:11, color:C.muted, background:"none", border:"none", cursor:"pointer", padding:0, display:"flex", alignItems:"center", gap:4 }}>← Shows</button>
            <div style={{ width:1, height:14, background:C.border }}/>
            <PlatformPill code={show.platform} />
            <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:11, color:C.muted }}>{show.date}{show.duration ? ` · ${show.duration}` : ""}</span>
            {show.isNew && (
              <span style={{ fontSize:8, fontWeight:800, color:C.green, background:"#10b98118", border:"1px solid #10b98133", padding:"2px 8px", borderRadius:99, textTransform:"uppercase", letterSpacing:"0.07em" }}>Latest Show</span>
            )}
          </div>
          <button onClick={()=>navigate("analytics")} style={{ fontSize:11, color:"#a78bfa", background:"#a78bfa10", border:"1px solid #a78bfa33", padding:"5px 12px", borderRadius:7, cursor:"pointer", fontWeight:600 }}>
            ✦ All Analytics →
          </button>
        </div>
        <div style={{ fontFamily:"'Syne',sans-serif", fontSize:19, fontWeight:800, color:C.text, letterSpacing:"-0.4px", marginTop:8 }}>{show.title}</div>
      </div>

      <div style={{ flex:1, overflowY:"auto", padding:"20px 28px" }}>

        {/* ── KPI ROW ── */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(6,1fr)", gap:10, marginBottom:20 }}>
          {[
            { label:"GMV",         value:`$${show.gmv.toLocaleString()}`, sub: gmvChange !== null ? <ChangeChip val={gmvChange} /> : "gross rev",   color:C.green   },
            { label:"Net Revenue", value:`$${netRevenue.toLocaleString()}`, sub:`after ${Math.round(platformFee*100)}% fee`, color:"#10b981"         },
            { label:"Buyers",      value:show.buyers,  sub: buyerChange !== null ? <ChangeChip val={buyerChange} /> : "unique",  color:pl?.color || C.accent },
            { label:"New Buyers",  value:newCount,     sub:`${Math.round(newCount/show.buyers*100)}% of show`,                   color:"#a78bfa"    },
            { label:"Repeat Rate", value:`${show.repeatRate}%`, sub: repeatChange !== null ? <ChangeChip val={repeatChange} suffix="pp" /> : "returned buyers", color:show.repeatRate >= 65 ? C.green : show.repeatRate >= 50 ? C.amber : "#ef4444" },
            { label:"Avg Order",   value:`$${Math.round(show.gmv / Math.max(1,show.buyers))}`, sub:"per buyer", color:C.text },
          ].map(k => (
            <div key={k.label} style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, padding:"12px 14px" }}>
              <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:18, fontWeight:800, color:k.color, marginBottom:3 }}>{k.value}</div>
              <div style={{ fontSize:9, color:C.muted, textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:2 }}>{k.label}</div>
              <div style={{ fontSize:9, color:C.subtle, display:"flex", alignItems:"center" }}>{k.sub}</div>
            </div>
          ))}
        </div>

        {/* ── YOUTUBE ATTRIBUTION BREAKDOWN ── */}
        {show.platform === "YT" && show.ytAttribution && (() => {
          const yta = show.ytAttribution;
          const total = yta.shopifyOrders;
          const methods = [
            { label:"Live Pixel",    color:"#f43f5e", orders:yta.pixel?.orders || 0,      pct:Math.round((yta.pixel?.orders||0)/total*100),      detail:`${yta.pixel?.sessionsCaptured||0} sessions tracked · verified`, icon:"●" },
            { label:"UTM Link",      color:"#3b82f6", orders:yta.utm.orders,              pct:Math.round(yta.utm.orders/total*100),              detail:`${yta.utm.clicks} link clicks · 100% confidence`, icon:"🔗" },
            { label:"Time-Window",   color:"#10b981", orders:yta.timeWindow.orders,       pct:Math.round(yta.timeWindow.orders/total*100),       detail:`±${yta.timeWindow.windowMins} min window · ${yta.timeWindow.confidence} confidence`, icon:"⏱" },
            { label:"Manual Review", color:"#f59e0b", orders:yta.manual.orders,           pct:Math.round(yta.manual.orders/total*100),           detail:`${yta.manual.pending > 0 ? yta.manual.pending + " still pending" : "All confirmed"}`, icon:"✓" },
          ].filter(m => m.orders > 0);
          return (
            <div style={{ background:"#0d0812", border:"1px solid #ff000033", borderRadius:14, padding:"18px 20px", marginBottom:16 }}>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
                <div style={{ width:28, height:28, borderRadius:8, background:"#ff000018", border:"1px solid #ff000033", display:"flex", alignItems:"center", justifyContent:"center", fontSize:13 }}>▶</div>
                <div>
                  <div style={{ fontSize:13, fontWeight:700, color:"#ff6b6b" }}>YouTube Attribution</div>
                  <div style={{ fontSize:10, color:C.muted }}>Shopify-powered · {total} orders attributed across 3 methods</div>
                </div>
                {yta.unattributed > 0 && (
                  <div style={{ marginLeft:"auto", fontSize:10, fontWeight:700, color:"#f59e0b", background:"#f59e0b18", border:"1px solid #f59e0b33", padding:"4px 10px", borderRadius:7 }}>
                    {"⚠"} {yta.unattributed} unattributed
                  </div>
                )}
              </div>

              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10, marginBottom:16 }}>
                {methods.map(m => (
                  <div key={m.label} style={{ background:C.surface, border:`1px solid ${m.color}33`, borderLeft:`3px solid ${m.color}`, borderRadius:10, padding:"12px 14px" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:6 }}>
                      <span style={{ fontSize:14 }}>{m.icon}</span>
                      <span style={{ fontSize:11, fontWeight:700, color:C.text }}>{m.label}</span>
                    </div>
                    <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:22, fontWeight:800, color:m.color, marginBottom:3 }}>{m.orders}</div>
                    <div style={{ fontSize:9, color:C.muted, marginBottom:8 }}>orders · {m.pct}% of total</div>
                    <div style={{ height:3, background:C.surface2, borderRadius:2, overflow:"hidden" }}>
                      <div style={{ width:`${m.pct}%`, height:"100%", background:m.color, borderRadius:2 }} />
                    </div>
                    <div style={{ fontSize:9, color:C.subtle, marginTop:6, fontStyle:"italic" }}>{m.detail}</div>
                  </div>
                ))}
              </div>

              <div style={{ display:"flex", gap:16, padding:"10px 14px", background:"#ffffff04", border:`1px solid ${C.border2}`, borderRadius:9 }}>
                <div style={{ fontSize:10, color:C.muted, flex:1 }}>
                  <span style={{ color:C.text, fontWeight:600 }}>How it works: </span>
                  All three methods run in parallel. UTM orders are attributed first (100% confidence), then time-window catches the rest, then you manually confirm any remainders in Order Review.
                </div>
                {yta.unattributed > 0 && (
                  <button style={{ fontSize:11, fontWeight:700, color:"#f59e0b", background:"#f59e0b18", border:"1px solid #f59e0b33", padding:"6px 14px", borderRadius:8, cursor:"pointer", flexShrink:0, whiteSpace:"nowrap" }}>
                    {"Review "}{yta.unattributed}{" Unattributed →"}
                  </button>
                )}
              </div>
            </div>
          );
        })()}

        {/* ── TWO COLUMNS: GMV curve + Buyer segments ── */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 340px", gap:16, marginBottom:16 }}>

          {/* GMV over time */}
          <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:14, padding:"18px 20px" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:14 }}>
              <div>
                <div style={{ fontSize:13, fontWeight:700, color:C.text }}>GMV Over Time</div>
                <div style={{ fontSize:10, color:C.muted, marginTop:2 }}>30-min intervals · peak at {peakLabel}</div>
              </div>
              <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:16, fontWeight:800, color:C.green }}>${show.gmv.toLocaleString()}</div>
            </div>
            <div style={{ display:"flex", gap:3, alignItems:"flex-end", height:90, marginBottom:6 }}>
              {gmvCurve.map((v, i) => {
                const maxV = Math.max(...gmvCurve);
                const h = Math.max(Math.round(v / maxV * 90), 3);
                const isPeak = i === peakIdx;
                return (
                  <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center" }}>
                    <div style={{ width:"100%", height:h, background: isPeak ? C.green : `${C.accent}88`, borderRadius:"3px 3px 0 0", boxShadow: isPeak ? `0 0 8px ${C.green}66` : "none" }} />
                  </div>
                );
              })}
            </div>
            <div style={{ display:"flex", justifyContent:"space-between", fontSize:8, color:C.subtle }}>
              <span>0m</span><span>30m</span><span>1h</span><span>1.5h</span><span>2h+</span>
            </div>
            {/* Platform fee callout */}
            <div style={{ marginTop:14, display:"flex", gap:8, padding:"8px 12px", background:"#ffffff05", border:`1px solid ${C.border2}`, borderRadius:8 }}>
              <div style={{ flex:1, textAlign:"center" }}>
                <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:13, fontWeight:700, color:C.green }}>${netRevenue.toLocaleString()}</div>
                <div style={{ fontSize:9, color:C.muted }}>Your net revenue</div>
              </div>
              <div style={{ width:1, background:C.border }}/>
              <div style={{ flex:1, textAlign:"center" }}>
                <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:13, fontWeight:700, color:"#ef444488" }}>${platformCut.toLocaleString()}</div>
                <div style={{ fontSize:9, color:C.muted }}>{show.platform} fee ({Math.round(platformFee*100)}%)</div>
              </div>
              <div style={{ width:1, background:C.border }}/>
              <div style={{ flex:1, textAlign:"center" }}>
                <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:13, fontWeight:700, color:C.text }}>${show.gmv.toLocaleString()}</div>
                <div style={{ fontSize:9, color:C.muted }}>Gross GMV</div>
              </div>
            </div>
          </div>

          {/* Buyer segments */}
          <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:14, padding:"18px 20px" }}>
            <div style={{ fontSize:13, fontWeight:700, color:C.text, marginBottom:4 }}>Buyer Segments</div>
            <div style={{ fontSize:10, color:C.muted, marginBottom:16 }}>{show.buyers} total · GMV attribution</div>

            {[
              { label:"VIP",        count:vipCount,    gmv:vipGMV,   color:"#7c3aed", icon:"👑" },
              { label:"Returning",  count:repeatCount-vipCount, gmv:repeatGMV, color:"#a78bfa", icon:"🔄" },
              { label:"New",        count:newCount,    gmv:newGMV,   color:C.green,   icon:"✨" },
            ].map(seg => (
              <div key={seg.label} style={{ marginBottom:12 }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                  <span style={{ fontSize:11, color:C.text, display:"flex", alignItems:"center", gap:5 }}>
                    <span>{seg.icon}</span>
                    <span style={{ fontWeight:600 }}>{seg.label}</span>
                    <span style={{ fontSize:9, color:C.muted }}>({Math.max(0,seg.count)})</span>
                  </span>
                  <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:11, fontWeight:700, color:seg.color }}>${seg.gmv.toLocaleString()}</span>
                </div>
                <div style={{ height:5, background:C.surface2, borderRadius:3, overflow:"hidden" }}>
                  <div style={{ width:`${Math.round(seg.gmv/show.gmv*100)}%`, height:"100%", background:seg.color, borderRadius:3 }} />
                </div>
                <div style={{ fontSize:8, color:C.subtle, marginTop:2 }}>{Math.round(seg.gmv/show.gmv*100)}% of GMV</div>
              </div>
            ))}

            {/* Comparison to prev show */}
            {prevShow && (
              <div style={{ marginTop:16, paddingTop:14, borderTop:`1px solid ${C.border}` }}>
                <div style={{ fontSize:10, fontWeight:700, color:C.muted, marginBottom:10, textTransform:"uppercase", letterSpacing:"0.06em" }}>vs. Previous Show</div>
                {[
                  { label:"GMV",         curr:`$${show.gmv.toLocaleString()}`,   prev:`$${prevShow.gmv.toLocaleString()}`,   chg:gmvChange },
                  { label:"Buyers",      curr:show.buyers,                        prev:prevShow.buyers,                       chg:buyerChange },
                  { label:"Repeat Rate", curr:`${show.repeatRate}%`,              prev:`${prevShow.repeatRate}%`,             chg:repeatChange, suffix:"pp" },
                ].map(row => (
                  <div key={row.label} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
                    <span style={{ fontSize:10, color:C.muted }}>{row.label}</span>
                    <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                      <span style={{ fontSize:9, color:C.subtle, textDecoration:"line-through", fontFamily:"'JetBrains Mono',monospace" }}>{row.prev}</span>
                      <span style={{ fontSize:10, fontWeight:700, color:C.text, fontFamily:"'JetBrains Mono',monospace" }}>{row.curr}</span>
                      <ChangeChip val={row.chg} suffix={row.suffix || "%"} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── TOP PRODUCTS ── */}
        <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:14, padding:"18px 20px", marginBottom:16 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
            <div>
              <div style={{ fontSize:13, fontWeight:700, color:C.text }}>Product Performance</div>
              <div style={{ fontSize:10, color:C.muted, marginTop:2 }}>Units sold · Revenue · Margin</div>
            </div>
            <span style={{ fontSize:10, color:C.muted }}>Top item: <span style={{ color:C.text, fontWeight:600 }}>{show.topItem}</span></span>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1.6fr 0.8fr 0.8fr 0.8fr 1fr", gap:0 }}>
            {["Product","Units","Revenue","Margin","Rev. bar"].map(h => (
              <div key={h} style={{ fontSize:9, fontWeight:700, color:C.muted, textTransform:"uppercase", letterSpacing:"0.07em", paddingBottom:10 }}>{h}</div>
            ))}
            {topProducts.map((p, i) => {
              const revPct = Math.round(p.revenue / topProducts[0].revenue * 100);
              const mc = p.margin ? marginColor(p.margin / 100) : C.muted;
              return [
                <div key={`n${i}`} style={{ display:"flex", alignItems:"center", gap:8, padding:"9px 0", borderTop:`1px solid ${C.border}` }}>
                  <span style={{ fontSize:15 }}>{p.image}</span>
                  <div>
                    <div style={{ fontSize:11, fontWeight:600, color:C.text }}>{p.name}</div>
                    <div style={{ fontSize:9, color:C.muted, fontFamily:"'JetBrains Mono',monospace" }}>{p.sku}</div>
                  </div>
                </div>,
                <div key={`u${i}`} style={{ padding:"9px 0", borderTop:`1px solid ${C.border}`, display:"flex", alignItems:"center" }}>
                  <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:13, fontWeight:700, color:C.text }}>{p.unitsSold}</span>
                </div>,
                <div key={`r${i}`} style={{ padding:"9px 0", borderTop:`1px solid ${C.border}`, display:"flex", alignItems:"center" }}>
                  <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:13, fontWeight:700, color:C.green }}>${p.revenue.toLocaleString()}</span>
                </div>,
                <div key={`m${i}`} style={{ padding:"9px 0", borderTop:`1px solid ${C.border}`, display:"flex", alignItems:"center" }}>
                  {p.margin ? <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:12, fontWeight:700, color:mc }}>{p.margin}%</span> : <span style={{ fontSize:9, color:C.subtle }}>—</span>}
                </div>,
                <div key={`b${i}`} style={{ padding:"9px 0", borderTop:`1px solid ${C.border}`, display:"flex", alignItems:"center", paddingRight:8 }}>
                  <div style={{ flex:1, height:5, background:C.surface2, borderRadius:3, overflow:"hidden" }}>
                    <div style={{ width:`${revPct}%`, height:"100%", background:C.accent, borderRadius:3 }} />
                  </div>
                </div>,
              ];
            })}
          </div>
        </div>

        {/* ── AI DEBRIEF ── */}
        <div style={{ background:"linear-gradient(135deg,#2d1f5e14,#1a103018)", border:`1px solid ${C.accent}44`, borderRadius:14, padding:"20px 22px" }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <div style={{ width:32, height:32, borderRadius:9, background:`${C.accent}22`, border:`1px solid ${C.accent}44`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14 }}>✦</div>
              <div>
                <div style={{ fontSize:13, fontWeight:700, color:C.text }}>AI Show Debrief</div>
                <div style={{ fontSize:10, color:C.muted }}>Powered by Claude · Generated from your real show data</div>
              </div>
            </div>
            {!aiGenerated && (
              <button onClick={generateAI} disabled={aiLoading}
                style={{ background: aiLoading ? C.surface2 : `linear-gradient(135deg,${C.accent},${C.accent2})`, border:"none", color: aiLoading ? C.muted : "#fff", fontSize:12, fontWeight:700, padding:"8px 18px", borderRadius:9, cursor: aiLoading ? "default" : "pointer", display:"flex", alignItems:"center", gap:8 }}>
                {aiLoading ? (
                  <><div style={{ width:12, height:12, border:"2px solid #ffffff33", borderTop:"2px solid #fff", borderRadius:"50%", animation:"spin .7s linear infinite" }}/> Generating…</>
                ) : "✦ Generate Insights"}
              </button>
            )}
            {aiGenerated && (
              <button onClick={generateAI} style={{ background:"none", border:`1px solid ${C.border2}`, color:C.muted, fontSize:11, padding:"6px 12px", borderRadius:7, cursor:"pointer" }}>↺ Regenerate</button>
            )}
          </div>

          {/* Static fallback debrief always visible */}
          {!aiGenerated && !aiLoading && (
            <div style={{ fontSize:13, color:"#9ca3af", lineHeight:1.75 }}>{show.aiDebrief || "Click 'Generate Insights' for a full AI-powered analysis of this show."}</div>
          )}

          {/* Loading shimmer */}
          {aiLoading && (
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              {[100,90,95,70].map((w,i) => (
                <div key={i} style={{ height:12, width:`${w}%`, background:`${C.accent}22`, borderRadius:6, animation:"pulse 1.5s ease-in-out infinite", animationDelay:`${i*0.15}s` }} />
              ))}
            </div>
          )}

          {/* AI response */}
          {aiGenerated && aiText && (
            <div style={{ fontSize:13, color:"#c4b5fd", lineHeight:1.8 }}>{aiText}</div>
          )}

          {/* Action prompts */}
          {aiGenerated && (
            <div style={{ marginTop:16, display:"flex", gap:8, flexWrap:"wrap" }}>
              {["What should I sell next show?","How do I improve repeat rate?","Which buyers need follow-up?","Suggest a campaign based on this show"].map(q => (
                <button key={q} onClick={async () => {
                  setAiLoading(true);
                  setAiText("");
                  setAiGenerated(false);
                  try {
                    const res = await fetch("https://api.anthropic.com/v1/messages", {
                      method:"POST", headers:{"Content-Type":"application/json"},
                      body: JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:1000,
                        messages:[{ role:"user", content:`Context: Show "${show.title}", GMV $${show.gmv}, ${show.buyers} buyers, ${show.repeatRate}% repeat rate, top item: ${show.topItem}.\n\nQuestion: ${q}` }] })
                    });
                    const d = await res.json();
                    const t = (d.content||[]).filter(b=>b.type==="text").map(b=>b.text).join("");
                    setAiText(t); setAiGenerated(true);
                  } catch(e) { setAiText("Error fetching response."); setAiGenerated(true); }
                  setAiLoading(false);
                }}
                  style={{ fontSize:10, fontWeight:600, color:"#a78bfa", background:"#a78bfa10", border:"1px solid #a78bfa33", padding:"5px 12px", borderRadius:99, cursor:"pointer" }}>
                  {q}
                </button>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}


// ─── SCREEN: LIVE SHOP LANDING PAGE (buyer-facing) ───────────────────────────
function ScreenLiveShop({ navigate, params, persona: personaProp }) {
  // Read from liveSession (params) — fall back to localStorage for new-tab opens
  const _lsStart   = (() => { try { return parseInt(localStorage.getItem("STRMLIVE_SHOW_START")||"0")||0; } catch(e){return 0;} })();
  const _lsTimings = (() => { try { return JSON.parse(localStorage.getItem("STRMLIVE_SHOW_TIMINGS")||"{}"); } catch(e){return {};} })();
  const _lsOrder   = (() => { try { return JSON.parse(localStorage.getItem("STRMLIVE_SHOW_ORDER")||"[]"); } catch(e){return [];} })();
  const _lsRunOrder = _lsOrder.length > 0 ? _lsOrder.map(id=>PRODUCTS.find(p=>p.id===id)).filter(Boolean) : null;

  const runOrder       = params?.runOrder      || _lsRunOrder || PRODUCTS.slice(0,5);
  const showName       = params?.showName      || "Live Show";
  const persona        = params?.persona       || personaProp || { shop:"Our Store", slug:"shop" };
  const shopDomain     = params?.shopDomain    || `${persona.slug || "shop"}.myshopify.com`;
  const productTimings = params?.productTimings || _lsTimings || {};
  const showStartTime  = params?.showStartTime  || _lsStart || Date.now();
  const [copied, setCopied] = useState(false);

  // Build cumulative breakpoints from current runOrder + timings
  const buildBreakpoints = (ro, pt) => {
    let cursor = 0;
    return ro.map((p, i) => {
      const dur = (pt[p.id] || 90) * 1000;
      const bp  = { idx: i, startMs: cursor, endMs: cursor + dur };
      cursor += dur;
      return bp;
    });
  };

  const breakpoints = buildBreakpoints(runOrder, productTimings);
  const totalDurMs  = breakpoints.length > 0 ? breakpoints[breakpoints.length - 1].endMs : 90000;

  // Compute active index deterministically from wall clock — always in sync
  const computeIdx = (bps, total) => {
    if (!bps.length) return 0;
    const elapsed = (Date.now() - showStartTime) % total;
    const bp = bps.find(b => elapsed >= b.startMs && elapsed < b.endMs);
    return bp ? bp.idx : 0;
  };

  const [activeIdx, setActiveIdx] = useState(() => computeIdx(breakpoints, totalDurMs));
  const [, setTick] = useState(0); // force re-render every second for countdown

  // Tick every second — recompute idx from clock, force re-render for countdowns
  useEffect(() => {
    const t = setInterval(() => {
      const freshBps   = buildBreakpoints(runOrder, productTimings);
      const freshTotal = freshBps.length > 0 ? freshBps[freshBps.length - 1].endMs : 90000;
      setActiveIdx(computeIdx(freshBps, freshTotal));
      setTick(n => n + 1); // trigger countdown re-render
    }, 1000);
    return () => clearInterval(t);
  }, [params]); // re-subscribe whenever params (liveSession) changes

  const showSlug   = showName.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
  const liveUrl    = `strmlive.com/live/${persona.slug || "shop"}/${showSlug}`;

  const copyLink = () => {
    navigator.clipboard?.writeText(`https://${liveUrl}`).catch(()=>{});
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const shopifyUrl = (p) =>
    `https://${shopDomain}/products/${p.name.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")}?ref=streamlive_live&show_id=sh5&utm_source=streamlive`;

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100%", overflow:"hidden", background:C.bg }}>

      {/* ── HEADER ── */}
      <div style={{ background:"#06060e", borderBottom:`1px solid ${C.border}`, padding:"12px 20px", display:"flex", alignItems:"center", gap:10, flexShrink:0 }}>
        <button onClick={()=>navigate("live", params)} style={{ background:"none", border:"none", color:C.muted, cursor:"pointer", fontSize:12, display:"flex", alignItems:"center", gap:4, padding:0, flexShrink:0 }}>
          ← Back to Live
        </button>
        <div style={{ flex:1 }}/>
        {/* Copy link widget — same style as opt-in link */}
        <div className="liveshop-header-url" style={{ alignItems:"center", background:"#07070f", border:`1px solid ${copied?"#10b98155":"#1e1e3a"}`, borderRadius:9, overflow:"hidden", transition:"border-color .2s" }}>
          <div style={{ display:"flex", alignItems:"center", gap:6, padding:"6px 10px 6px 10px", borderRight:`1px solid ${copied?"#10b98122":"#1a1a2e"}` }}>
            <div style={{ width:6, height:6, borderRadius:"50%", background:"#ef4444", animation:"pulse 1s infinite", flexShrink:0 }}/>
            <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10, color:"#4b5563" }}>{liveUrl}</span>
          </div>
          <button onClick={copyLink} style={{ padding:"6px 12px", background:copied?"#0a1e16":"transparent", border:"none", cursor:"pointer", transition:"background .15s" }}>
            <span style={{ fontSize:10, fontWeight:700, color:copied?"#10b981":"#a78bfa", whiteSpace:"nowrap" }}>
              {copied ? "✓ Copied!" : "Copy link 🔗"}
            </span>
          </button>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:6, background:"#1a0808", border:"1px solid #ef444433", borderRadius:7, padding:"5px 10px", flexShrink:0 }}>
          <div style={{ width:6, height:6, borderRadius:"50%", background:"#ef4444", animation:"pulse 1s infinite" }}/>
          <span style={{ fontSize:10, fontWeight:800, color:"#ef4444", letterSpacing:"0.06em" }}>LIVE</span>
        </div>
      </div>

      {/* ── BODY: two-column on desktop, stacked on narrow ── */}
      <style>{`
        .liveshop-grid { display:grid; grid-template-columns:300px 1fr; min-height:100%; }
        .liveshop-left { border-right:1px solid #14142a; }
        .liveshop-header-url { display:flex; }
        @media (max-width:700px) {
          .liveshop-grid { grid-template-columns:1fr; }
          .liveshop-left { border-right:none; border-bottom:1px solid #14142a; }
          .liveshop-header-url { display:none; }
        }
      `}</style>
      <div style={{ flex:1, overflowY:"auto" }}>
        <div className="liveshop-grid">

          {/* ── LEFT PANEL: phone mockup + copy link ── */}
          <div className="liveshop-left" style={{ padding:"24px 18px", background:"#07070f", display:"flex", flexDirection:"column" }}>
            <div style={{ fontSize:9, fontWeight:700, color:C.muted, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:14 }}>
              Buyer Preview
            </div>

            {/* Phone shell */}
            <div style={{ background:"#0d0d1a", borderRadius:26, border:"2px solid #252535", padding:"18px 14px 22px", boxShadow:"0 24px 64px rgba(0,0,0,.6)", position:"relative", overflow:"hidden" }}>
              {/* Notch */}
              <div style={{ width:60, height:6, background:"#252535", borderRadius:3, margin:"0 auto 14px" }}/>

              {/* Shop name + LIVE */}
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
                <span style={{ fontSize:12, fontWeight:800, color:"#fff" }}>{persona.shop}</span>
                <div style={{ display:"flex", alignItems:"center", gap:4, background:"#1a0808", border:"1px solid #ef444433", borderRadius:99, padding:"3px 8px" }}>
                  <div style={{ width:5, height:5, borderRadius:"50%", background:"#ef4444", animation:"pulse 1s infinite" }}/>
                  <span style={{ fontSize:8, fontWeight:800, color:"#ef4444", letterSpacing:"0.06em" }}>LIVE</span>
                </div>
              </div>

              <div style={{ fontSize:10, color:"#6b7280", marginBottom:10, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{showName}</div>

              {/* Now Selling hero card */}
              {runOrder[activeIdx] && (() => {
                const p = runOrder[activeIdx];
                return (
                  <div style={{ background:"linear-gradient(160deg,#0f2a1a,#061508)", border:"1px solid #10b98155", borderRadius:16, padding:"14px", marginBottom:12 }}>
                    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:8 }}>
                      <div style={{ fontSize:7, fontWeight:800, color:"#10b981", textTransform:"uppercase", letterSpacing:"0.1em", display:"flex", alignItems:"center", gap:4 }}>
                        <div style={{ width:5, height:5, borderRadius:"50%", background:"#ef4444", animation:"pulse 1s infinite" }}/> Now Selling
                      </div>
                      {(() => {
                        const elapsed = (Date.now() - showStartTime) % totalDurMs;
                        const bp = breakpoints[activeIdx];
                        const remaining = bp ? Math.max(0, Math.ceil((bp.endMs - elapsed) / 1000)) : 0;
                        const m = Math.floor(remaining/60), s = remaining%60;
                        return (
                          <div style={{ fontSize:7, fontWeight:800, color: remaining<=10?"#ef4444":remaining<=30?"#f59e0b":"#4b5563",
                            fontFamily:"monospace" }}>
                            {m>0?`${m}:`:"⏱ "}{s<10&&m>0?"0":""}{s}{m>0?"s":"s"}
                          </div>
                        );
                      })()}
                    </div>
                    <div style={{ fontSize:22, marginBottom:6 }}>{p.image}</div>
                    <div style={{ fontSize:12, fontWeight:800, color:"#fff", lineHeight:1.3, marginBottom:6 }}>{p.name}</div>
                    <div style={{ display:"flex", alignItems:"baseline", gap:6, marginBottom:10 }}>
                      <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:18, fontWeight:800, color:"#10b981" }}>${p.price}</span>
                      <span style={{ fontSize:9, color:"#4b5563" }}>{p.inventory} left</span>
                    </div>
                    {/* Buy Now CTA */}
                    <div style={{ background:"linear-gradient(135deg,#10b981,#059669)", borderRadius:10, padding:"10px 14px", textAlign:"center", cursor:"pointer", boxShadow:"0 4px 16px #10b98133" }}>
                      <span style={{ fontSize:13, fontWeight:800, color:"#fff", letterSpacing:"0.01em" }}>Buy Now →</span>
                    </div>
                  </div>
                );
              })()}

              {/* Product lineup */}
              <div style={{ fontSize:8, fontWeight:700, color:C.muted, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:7 }}>
                Show Lineup
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
                {runOrder.map((p, i) => {
                  const isActive = i === activeIdx;
                  const isSold   = i < activeIdx;
                  return (
                    <div key={p.id} style={{ display:"flex", alignItems:"center", gap:7, padding:"7px 9px", background:isActive?"#10b98112":isSold?"transparent":"#0d0d1e", border:`1px solid ${isActive?"#10b98144":isSold?"transparent":"#1a1a2e"}`, borderRadius:9, opacity:isSold?0.35:1, transition:"all .3s" }}>
                      <span style={{ fontSize:8, fontWeight:800, color:isActive?"#10b981":"#374151", width:12, textAlign:"center", flexShrink:0 }}>{i+1}</span>
                      <span style={{ fontSize:12, flexShrink:0 }}>{p.image}</span>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ fontSize:9, fontWeight:isActive?700:400, color:isActive?"#e5e7eb":"#6b7280", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{p.name}</div>
                        <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:8, color:isActive?"#10b981":"#374151" }}>${p.price}</div>
                      </div>
                      {isActive && <div style={{ width:20, height:20, borderRadius:5, background:"#10b981", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}><span style={{ fontSize:8, color:"#fff" }}>→</span></div>}
                      {isSold   && <span style={{ fontSize:8, color:"#374151", flexShrink:0 }}>✓</span>}
                    </div>
                  );
                })}
              </div>

              <div style={{ marginTop:12, textAlign:"center" }}>
                <span style={{ fontSize:8, color:"#2a2a3a" }}>Powered by </span>
                <span style={{ fontSize:8, fontWeight:700, color:"#4b3a7c" }}>Streamlive</span>
              </div>
            </div>

            {/* Copy link button below phone */}
            <button onClick={copyLink} style={{ marginTop:14, display:"flex", alignItems:"center", justifyContent:"center", gap:7, background:copied?"#0a1e16":C.surface, border:`1px solid ${copied?"#10b98166":C.border}`, borderRadius:10, padding:"10px 14px", cursor:"pointer", transition:"all .2s" }}>
              <span style={{ fontSize:13 }}>{copied ? "✓" : "🔗"}</span>
              <span style={{ fontSize:11, fontWeight:700, color:copied?"#10b981":C.text }}>
                {copied ? "Copied to clipboard!" : "Copy buyer link"}
              </span>
            </button>
            <div style={{ marginTop:6, textAlign:"center", fontSize:9, color:C.subtle, fontFamily:"'JetBrains Mono',monospace" }}>{liveUrl}</div>
          </div>

          {/* ── RIGHT PANEL: product list for this session ── */}
          <div style={{ padding:"24px 28px", overflowY:"auto" }}>
            <div style={{ fontFamily:"'Syne',sans-serif", fontSize:18, fontWeight:800, color:C.text, marginBottom:4 }}>Live Shop Page</div>
            <div style={{ fontSize:12, color:C.muted, marginBottom:20 }}>
              Products listed in show order. Each "Buy Now" button deeplinks directly to the Shopify product page for {persona.shop} — tracking the order back to this show.
            </div>

            {runOrder.map((p, i) => {
              const isActive = i === activeIdx;
              const isSold   = i < activeIdx;
              const url      = shopifyUrl(p);
              return (
                <div key={p.id} style={{ display:"flex", alignItems:"center", gap:14, padding:"14px 16px", background:isActive?`${C.green}0e`:isSold?"#07070f":C.surface, border:`1px solid ${isActive?C.green+"44":isSold?"#0d0d0d":C.border}`, borderRadius:14, marginBottom:10, opacity:isSold?0.45:1, transition:"all .3s" }}>

                  {/* Number */}
                  <div style={{ width:30, height:30, borderRadius:9, background:isActive?"#10b98118":isSold?"transparent":"#1a1a2e", border:`1px solid ${isActive?"#10b98144":isSold?"transparent":"#252535"}`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    {isSold
                      ? <span style={{ fontSize:10, color:"#374151" }}>✓</span>
                      : <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:11, fontWeight:800, color:isActive?C.green:C.muted }}>{i+1}</span>
                    }
                  </div>

                  {/* Emoji */}
                  <span style={{ fontSize:24, flexShrink:0 }}>{p.image}</span>

                  {/* Info */}
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap", marginBottom:3 }}>
                      <span style={{ fontSize:13, fontWeight:700, color:isSold?"#4b5563":C.text }}>{p.name}</span>
                      {isActive && (() => {
                          const bps    = buildBreakpoints(runOrder, productTimings);
                          const total  = bps.length > 0 ? bps[bps.length-1].endMs : 90000;
                          const elapsedMs = (Date.now() - showStartTime) % total;
                          const bp     = bps[activeIdx];
                          const remSec = bp ? Math.max(0, Math.ceil((bp.endMs - elapsedMs) / 1000)) : 0;
                          const rm = Math.floor(remSec/60), rs = remSec%60;
                          return (<>
                            <span style={{ fontSize:8, fontWeight:800, color:"#10b981", background:"#0a1e16", border:"1px solid #10b98133", padding:"2px 7px", borderRadius:99, letterSpacing:"0.06em" }}>SELLING NOW</span>
                            <span style={{ fontSize:8, fontWeight:800, fontFamily:"'JetBrains Mono',monospace",
                              color: remSec<=10?"#ef4444":remSec<=30?"#f59e0b":"#6b7280",
                              background: remSec<=10?"#1a0505":remSec<=30?"#1c1208":"#0a0a14",
                              border:`1px solid ${remSec<=10?"#ef444433":remSec<=30?"#f59e0b33":"#1e1e3a"}`,
                              padding:"2px 8px", borderRadius:99 }}>
                              ⏱ {rm>0?`${rm}m `:""}{rs}s
                            </span>
                          </>);
                        })()}
                      {isSold   && <span style={{ fontSize:8, fontWeight:700, color:"#374151", background:"#0d0d0d", border:"1px solid #1a1a1a", padding:"2px 7px", borderRadius:99 }}>SOLD</span>}
                    </div>
                    <div style={{ display:"flex", gap:12, alignItems:"center", flexWrap:"wrap" }}>
                      <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:13, fontWeight:700, color:isSold?"#374151":C.green }}>${p.price}</span>
                      <span style={{ fontSize:10, color:C.muted }}>{p.inventory} in stock</span>
                      <span style={{ fontSize:10, color:"#2a2a3a" }}>SKU: {p.sku}</span>
                    </div>
                    {/* Deeplink URL — subtle, desktop only */}
                    <div style={{ marginTop:4 }}>
                      <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:8, color:"#252535", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", display:"block", maxWidth:320 }}>
                        {url.replace("https://","")}
                      </span>
                    </div>
                  </div>

                  {/* Buy Now button */}
                  <button
                    onClick={()=> !isSold && window.open(url, "_blank")}
                    disabled={isSold}
                    style={{
                      flexShrink:0,
                      padding: isActive ? "10px 20px" : "8px 16px",
                      background: isSold ? "#0d0d0d" : isActive ? "linear-gradient(135deg,#10b981,#059669)" : "#10b98114",
                      border: `1px solid ${isSold?"#1a1a1a":isActive?"transparent":"#10b98133"}`,
                      borderRadius:10,
                      cursor: isSold ? "default" : "pointer",
                      transition:"all .2s",
                      boxShadow: isActive ? "0 4px 16px #10b98122" : "none",
                    }}
                  >
                    <span style={{ fontSize: isActive ? 12 : 11, fontWeight:700, color: isSold?"#374151":isActive?"#fff":"#10b981", whiteSpace:"nowrap" }}>
                      {isSold ? "Sold" : "Buy Now →"}
                    </span>
                  </button>
                </div>
              );
            })}

            {/* Tracking info footer */}
            <div style={{ marginTop:4, background:"#09090f", border:"1px solid #14142a", borderRadius:12, padding:"14px 18px" }}>
              <div style={{ fontSize:10, fontWeight:700, color:C.muted, marginBottom:8 }}>Every "Buy Now" tap is tracked back to this show</div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                {[
                  { param:"ref=streamlive_live", desc:"Live Pixel attribution" },
                  { param:"show_id=sh5",         desc:"Show-level reporting" },
                  { param:"utm_source=streamlive",desc:"Shopify Analytics" },
                ].map(row=>(
                  <div key={row.param} style={{ display:"flex", alignItems:"center", gap:6, background:"#0d0d1e", border:"1px solid #1e1e3a", borderRadius:6, padding:"4px 9px" }}>
                    <code style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:9, color:"#7c3aed" }}>{row.param}</code>
                    <span style={{ fontSize:9, color:"#374151" }}>{row.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}


// ─── SCREEN: LIVE COMPANION ───────────────────────────────────────────────────
// ── CatalogTab — live run order manager with per-product timers ───────────────
function CatalogTab({ liveRunOrder, setLiveRunOrder, productTimings, setProductTimings, catalogSearch, setCatalogSearch, persona }) {
  const [showAddPanel, setShowAddPanel] = useState(false);
  const [dragIdx, setDragIdx] = useState(null);
  const [dragOverIdx, setDragOverIdx] = useState(null);

  const personaId = persona?.id || "s1";
  const allProducts = PRODUCTS.filter(p =>
    !p.name.toLowerCase().includes("x") || true
  );
  const addableProducts = allProducts.filter(p =>
    !liveRunOrder.find(r => r.id === p.id) &&
    (p.name.toLowerCase().includes(catalogSearch.toLowerCase()) ||
     p.category.toLowerCase().includes(catalogSearch.toLowerCase()) ||
     p.sku.toLowerCase().includes(catalogSearch.toLowerCase()))
  );
  const inRunOrder = liveRunOrder.filter(p =>
    p.name.toLowerCase().includes(catalogSearch.toLowerCase()) ||
    p.category.toLowerCase().includes(catalogSearch.toLowerCase()) ||
    p.sku.toLowerCase().includes(catalogSearch.toLowerCase())
  );

  const setTiming = (id, val) => {
    const v = Math.max(30, Math.min(600, Number(val) || 90));
    setProductTimings(prev => ({ ...prev, [id]: v }));
  };

  const removeProduct = (id) => {
    setLiveRunOrder(prev => prev.filter(p => p.id !== id));
  };

  const addProduct = (p) => {
    setLiveRunOrder(prev => [...prev, p]);
    setProductTimings(prev => ({ ...prev, [p.id]: 90 }));
  };

  const moveUp = (i) => {
    if (i === 0) return;
    const a = [...liveRunOrder];
    [a[i-1], a[i]] = [a[i], a[i-1]];
    setLiveRunOrder(a);
  };

  const moveDown = (i) => {
    if (i === liveRunOrder.length - 1) return;
    const a = [...liveRunOrder];
    [a[i], a[i+1]] = [a[i+1], a[i]];
    setLiveRunOrder(a);
  };

  const totalSecs = liveRunOrder.reduce((acc, p) => acc + (productTimings[p.id] || 90), 0);
  const totalMins = Math.ceil(totalSecs / 60);

  const PRESET_TIMES = [
    { label:"30s", secs:30 },
    { label:"1m",  secs:60 },
    { label:"90s", secs:90 },
    { label:"2m",  secs:120 },
    { label:"3m",  secs:180 },
    { label:"5m",  secs:300 },
  ];

  return (
    <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>

      {/* ── HEADER ── */}
      <div style={{ padding:"12px 14px 10px", borderBottom:`1px solid ${C.border}`, flexShrink:0 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
          <div>
            <div style={{ fontSize:11, fontWeight:700, color:C.text }}>Live Catalog</div>
            <div style={{ fontSize:9, color:C.muted, marginTop:1 }}>
              {liveRunOrder.length} products · ~{totalMins} min show
            </div>
          </div>
          <div style={{ display:"flex", gap:6, alignItems:"center" }}>
            <div style={{ fontSize:9, color:C.muted, background:"#0a0a14", border:`1px solid ${C.border}`, borderRadius:6, padding:"4px 9px" }}>
              Total: {Math.floor(totalSecs/60)}m {totalSecs%60}s
            </div>
            <button onClick={() => setShowAddPanel(!showAddPanel)}
              style={{ display:"flex", alignItems:"center", gap:5, padding:"5px 10px",
                background: showAddPanel ? "#1a0f2e" : "#0a0a14",
                border:`1px solid ${showAddPanel ? "#a78bfa55" : C.border}`,
                borderRadius:7, cursor:"pointer", color: showAddPanel ? "#a78bfa" : C.muted,
                fontSize:9, fontWeight:700 }}>
              {showAddPanel ? "✕ Close" : "+ Add Product"}
            </button>
          </div>
        </div>

        {/* Search */}
        <input
          value={catalogSearch}
          onChange={e => setCatalogSearch(e.target.value)}
          placeholder="Search products…"
          style={{ width:"100%", background:"#0a0a14", border:`1px solid ${C.border}`, borderRadius:7,
            padding:"6px 10px", color:C.text, fontSize:11, outline:"none" }}
        />
      </div>

      <div style={{ flex:1, display:"flex", overflow:"hidden", minHeight:0 }}>

        {/* ── RUN ORDER ── */}
        <div style={{ flex:1, overflowY:"auto", padding:"10px 12px" }}>
          <div style={{ fontSize:9, fontWeight:700, color:C.muted, textTransform:"uppercase",
            letterSpacing:".08em", marginBottom:8 }}>Run Order</div>

          {liveRunOrder.length === 0 && (
            <div style={{ textAlign:"center", padding:"32px 16px", color:C.muted, fontSize:11 }}>
              No products in run order.<br/>
              <span style={{ color:"#a78bfa", cursor:"pointer" }} onClick={() => setShowAddPanel(true)}>+ Add products</span>
            </div>
          )}

          {liveRunOrder.map((p, i) => {
            const timing = productTimings[p.id] || 90;
            const mins = Math.floor(timing / 60);
            const secs = timing % 60;
            const invColor = p.inventory < 25 ? "#ef4444" : p.inventory < 60 ? "#f59e0b" : "#10b981";

            return (
              <div key={p.id}
                style={{ background:"#0a0a14", border:`1px solid ${C.border}`, borderRadius:10,
                  padding:"10px 12px", marginBottom:6, transition:"all .15s" }}>

                {/* Top row: drag handle, number, emoji, name, remove */}
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
                  <div style={{ display:"flex", flexDirection:"column", gap:2, flexShrink:0 }}>
                    <button onClick={() => moveUp(i)} disabled={i===0}
                      style={{ background:"none", border:"none", color: i===0 ? "#1e1e3a" : C.muted,
                        cursor: i===0 ? "default" : "pointer", fontSize:9, padding:"1px 3px", lineHeight:1 }}>▲</button>
                    <button onClick={() => moveDown(i)} disabled={i===liveRunOrder.length-1}
                      style={{ background:"none", border:"none", color: i===liveRunOrder.length-1 ? "#1e1e3a" : C.muted,
                        cursor: i===liveRunOrder.length-1 ? "default" : "pointer", fontSize:9, padding:"1px 3px", lineHeight:1 }}>▼</button>
                  </div>

                  <div style={{ width:20, height:20, borderRadius:6, background:"#a78bfa18",
                    border:"1px solid #a78bfa33", display:"flex", alignItems:"center",
                    justifyContent:"center", flexShrink:0 }}>
                    <span style={{ fontSize:9, fontWeight:800, color:"#a78bfa" }}>{i+1}</span>
                  </div>

                  <span style={{ fontSize:20, flexShrink:0 }}>{p.image}</span>

                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:11, fontWeight:700, color:C.text, whiteSpace:"nowrap",
                      overflow:"hidden", textOverflow:"ellipsis" }}>{p.name}</div>
                    <div style={{ display:"flex", gap:8, alignItems:"center", marginTop:2 }}>
                      <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:11,
                        fontWeight:700, color:"#10b981" }}>${p.price}</span>
                      <span style={{ fontSize:9, color:invColor }}>
                        {p.inventory} in stock
                      </span>
                    </div>
                  </div>

                  <button onClick={() => removeProduct(p.id)}
                    style={{ background:"none", border:"none", color:"#374151", cursor:"pointer",
                      fontSize:12, padding:"2px 4px", flexShrink:0, borderRadius:4 }}>✕</button>
                </div>

                {/* Time row */}
                <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                  <span style={{ fontSize:9, color:C.muted, flexShrink:0 }}>⏱ Time on screen:</span>

                  {/* Preset buttons */}
                  <div style={{ display:"flex", gap:4, flex:1, flexWrap:"wrap" }}>
                    {PRESET_TIMES.map(pt => (
                      <button key={pt.secs} onClick={() => setTiming(p.id, pt.secs)}
                        style={{ padding:"3px 8px", borderRadius:5, cursor:"pointer", fontSize:9, fontWeight:700,
                          background: timing === pt.secs ? "#1a0f2e" : "#07070f",
                          border:`1px solid ${timing === pt.secs ? "#a78bfa66" : "#1e1e3a"}`,
                          color: timing === pt.secs ? "#a78bfa" : C.muted }}>
                        {pt.label}
                      </button>
                    ))}
                  </div>

                  {/* Custom input */}
                  <div style={{ display:"flex", alignItems:"center", gap:3, flexShrink:0 }}>
                    <input
                      type="number" min={30} max={600} value={timing}
                      onChange={e => setTiming(p.id, e.target.value)}
                      style={{ width:46, background:"#07070f", border:`1px solid ${C.border}`,
                        borderRadius:5, padding:"3px 6px", color:C.text, fontSize:10,
                        fontFamily:"'JetBrains Mono',monospace", textAlign:"center", outline:"none" }}
                    />
                    <span style={{ fontSize:9, color:C.muted }}>s</span>
                  </div>

                  {/* Time display */}
                  <div style={{ fontSize:9, fontWeight:700, color:"#a78bfa", flexShrink:0,
                    background:"#1a0f2e", border:"1px solid #a78bfa33", borderRadius:5,
                    padding:"3px 7px", fontFamily:"'JetBrains Mono',monospace" }}>
                    {mins > 0 ? `${mins}m ` : ""}{secs}s
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── ADD PANEL ── */}
        {showAddPanel && (
          <div style={{ width:220, flexShrink:0, borderLeft:`1px solid ${C.border}`,
            display:"flex", flexDirection:"column", overflow:"hidden", background:"#07070f" }}>
            <div style={{ padding:"10px 12px 8px", borderBottom:`1px solid ${C.border}`, flexShrink:0 }}>
              <div style={{ fontSize:9, fontWeight:700, color:C.muted, textTransform:"uppercase",
                letterSpacing:".07em", marginBottom:6 }}>Add to Show</div>
              <input
                value={catalogSearch}
                onChange={e => setCatalogSearch(e.target.value)}
                placeholder="Search…"
                style={{ width:"100%", background:"#0a0a14", border:`1px solid ${C.border}`,
                  borderRadius:6, padding:"5px 8px", color:C.text, fontSize:10, outline:"none" }}
              />
            </div>
            <div style={{ flex:1, overflowY:"auto", padding:8 }}>
              {addableProducts.length === 0 && (
                <div style={{ fontSize:10, color:C.muted, textAlign:"center", padding:"16px 8px" }}>
                  All products added
                </div>
              )}
              {addableProducts.map(p => (
                <div key={p.id}
                  onClick={() => addProduct(p)}
                  style={{ display:"flex", alignItems:"center", gap:8, padding:"8px 10px",
                    background:"#0a0a14", border:`1px solid ${C.border}`, borderRadius:8,
                    marginBottom:5, cursor:"pointer" }}
                  onMouseEnter={e => e.currentTarget.style.borderColor="#a78bfa55"}
                  onMouseLeave={e => e.currentTarget.style.borderColor=C.border}>
                  <span style={{ fontSize:18, flexShrink:0 }}>{p.image}</span>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:10, fontWeight:600, color:C.text, whiteSpace:"nowrap",
                      overflow:"hidden", textOverflow:"ellipsis" }}>{p.name}</div>
                    <div style={{ fontSize:9, color:"#10b981", fontFamily:"'JetBrains Mono',monospace" }}>
                      ${p.price}
                      {p.inventory < 30 && <span style={{ color:"#ef4444", marginLeft:5 }}>● {p.inventory} left</span>}
                    </div>
                  </div>
                  <span style={{ fontSize:14, color:"#a78bfa", flexShrink:0 }}>+</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


// ── SceneTab — drag-and-drop set layout diagram ────────────────────────────────
function SceneTab({ activeScene, lightPattern, lightColor, lightTemp, micMuted, audioLevel }) {
  const lightGlow = lightPattern==="celebrate" ? "hsl(300,100%,60%)"
    : lightPattern==="fire"    ? "#f97316"
    : lightPattern==="police"  ? "#ef4444"
    : lightPattern==="pulse"   ? "#a78bfa"
    : lightPattern==="strobe"  ? "#e2e8f0"
    : lightPattern==="sunrise" ? "#fb923c"
    : lightColor!==null        ? `hsl(${lightColor},100%,55%)`
    : null;
  const fx3Active = activeScene.includes("FX3") || activeScene.includes("Wide");
  const fx6Active = activeScene.includes("FX6") || activeScene.includes("Close");

  const DEFAULT_POSITIONS = [
    { id:"fx3",     label:"📷 FX3",       color:"#7c3aed", x:12,  y:66, w:52, h:36 },
    { id:"fx6",     label:"🎥 FX6",       color:"#a78bfa", x:76,  y:66, w:52, h:36 },
    { id:"elgato",  label:"💡 Key Light",  color:"#10b981", x:12,  y:8,  w:58, h:32 },
    { id:"aputure", label:"🔆 Aputure",    color:"#4b5563", x:76,  y:8,  w:58, h:32 },
    { id:"host",    label:"🧑 Host",       color:"#f59e0b", x:62,  y:42, w:44, h:38 },
    { id:"products",label:"📦 Products",   color:"#38bdf8", x:108, y:43, w:46, h:32 },
    { id:"monitor", label:"📱 Monitor",    color:"#3b82f6", x:18,  y:43, w:40, h:30 },
  ];

  const [equipment, setEquipment] = useState(() => DEFAULT_POSITIONS.map(d=>({...d})));
  const [dragging, setDragging]   = useState(null);
  const [dragOffset, setDragOffset] = useState({x:0, y:0});
  const diagramRef = useRef(null);

  const onMouseDown = (e, id) => {
    e.preventDefault();
    const rect = diagramRef.current.getBoundingClientRect();
    const item = equipment.find(i=>i.id===id);
    setDragging(id);
    setDragOffset({
      x: e.clientX - rect.left  - (item.x / 100) * rect.width,
      y: e.clientY - rect.top   - (item.y / 100) * rect.height,
    });
  };

  useEffect(() => {
    if (!dragging) return;
    const onMove = (e) => {
      const rect = diagramRef.current?.getBoundingClientRect();
      if (!rect) return;
      const item = equipment.find(i=>i.id===dragging);
      const rawX = ((e.clientX - rect.left  - dragOffset.x) / rect.width)  * 100;
      const rawY = ((e.clientY - rect.top   - dragOffset.y) / rect.height) * 100;
      const clampX = Math.max(0, Math.min(100 - (item.w / rect.width)  * 100, rawX));
      const clampY = Math.max(0, Math.min(100 - (item.h / rect.height) * 100, rawY));
      setEquipment(prev => prev.map(i => i.id===dragging ? {...i, x:clampX, y:clampY} : i));
    };
    const onUp = () => setDragging(null);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup",   onUp);
    return () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
  }, [dragging, dragOffset, equipment]);

  const getStatus = (id) => {
    if (id==="fx3")     return fx3Active  ? "● WIDE"    : "Standby";
    if (id==="fx6")     return fx6Active  ? "● CLOSE"   : "Standby";
    if (id==="elgato")  return lightGlow  ? "● ON"      : `${lightTemp}K`;
    if (id==="aputure") return "✕ Offline";
    if (id==="host")    return micMuted   ? "🔇 Muted"  : "🎙 On";
    return "";
  };
  const isActive = (id) =>
    (id==="fx3"    && fx3Active) ||
    (id==="fx6"    && fx6Active) ||
    (id==="elgato" && (lightGlow || lightPattern || lightColor!==null)) ||
    (id==="host")  || (id==="products") || (id==="monitor");

  return (
    <div style={{ flex:1, overflowY:"auto", padding:"14px" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
        <div>
          <div style={{ fontSize:11, fontWeight:700, color:C.text }}>Set Layout</div>
          <div style={{ fontSize:9, color:C.muted, marginTop:1 }}>Drag equipment to match your real-world set</div>
        </div>
        <button onClick={()=>setEquipment(DEFAULT_POSITIONS.map(d=>({...d})))}
          style={{ fontSize:9, color:C.muted, background:"#0a0a14", border:"1px solid #1e1e3a", borderRadius:6, padding:"4px 10px", cursor:"pointer" }}>
          Reset
        </button>
      </div>

      {/* Diagram */}
      <div ref={diagramRef} style={{ position:"relative", width:"100%", height:244,
        background:"#07070f", border:"1px solid #1a1a2e", borderRadius:12,
        overflow:"hidden", marginBottom:12, userSelect:"none", cursor:dragging?"grabbing":"default" }}>

        {/* Grid lines */}
        {[1,2,3,4].map(i=><div key={"v"+i} style={{ position:"absolute", left:`${i*20}%`, top:0, bottom:0, width:1, background:"#0d0d1a" }}/>)}
        {[1,2,3,4].map(i=><div key={"h"+i} style={{ position:"absolute", top:`${i*20}%`, left:0, right:0, height:1, background:"#0d0d1a" }}/>)}
        <div style={{ position:"absolute", bottom:5, left:"50%", transform:"translateX(-50%)", fontSize:7, fontWeight:700, color:"#1a1a2e", textTransform:"uppercase", letterSpacing:".1em", whiteSpace:"nowrap" }}>← STAGE FLOOR · AUDIENCE ▼ →</div>

        {/* Active scene badge */}
        <div style={{ position:"absolute", top:6, left:"50%", transform:"translateX(-50%)", zIndex:10, whiteSpace:"nowrap" }}>
          <div style={{ background:"#0d0d1a", border:"1px solid #a78bfa33", borderRadius:5, padding:"2px 9px", display:"flex", alignItems:"center", gap:5 }}>
            <div style={{ width:5, height:5, borderRadius:"50%", background:"#ef4444", animation:"pulse 1s infinite" }}/>
            <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:8, fontWeight:700, color:"#a78bfa" }}>{activeScene}</span>
          </div>
        </div>

        {/* Light glow */}
        {lightGlow && (() => {
          const l = equipment.find(i=>i.id==="elgato");
          if (!l) return null;
          return <div style={{ position:"absolute", left:`${l.x + l.w/2}%`, top:`${l.y + l.h/2}%`,
            width:200, height:200, borderRadius:"50%", transform:"translate(-50%,-50%)",
            background:`radial-gradient(circle, ${lightGlow}22 0%, transparent 65%)`,
            pointerEvents:"none", transition:"all .4s" }}/>;
        })()}

        {/* Camera sight lines */}
        {[{id:"fx3",color:"#7c3aed",active:fx3Active},{id:"fx6",color:"#a78bfa",active:fx6Active}].map(cam=>{
          const c = equipment.find(i=>i.id===cam.id);
          const h = equipment.find(i=>i.id==="host");
          if (!c||!h) return null;
          const x1=c.x+c.w/2, y1=c.y+c.h/2, x2=h.x+h.w/2, y2=h.y+h.h/2;
          return (
            <svg key={cam.id} style={{ position:"absolute", inset:0, width:"100%", height:"100%", overflow:"visible", pointerEvents:"none" }}>
              <line x1={`${x1}%`} y1={`${y1}%`} x2={`${x2}%`} y2={`${y2}%`}
                stroke={cam.active?cam.color+"88":"#1e1e3a33"} strokeWidth={1.5} strokeDasharray="5 3"/>
            </svg>
          );
        })}

        {/* Draggable items */}
        {equipment.map(item=>{
          const isDrag  = dragging===item.id;
          const active  = isActive(item.id);
          const status  = getStatus(item.id);
          return (
            <div key={item.id} onMouseDown={e=>onMouseDown(e,item.id)}
              style={{ position:"absolute", left:`${item.x}%`, top:`${item.y}%`,
                width:item.w, height:item.h,
                background: isDrag?`${item.color}30`:active?`${item.color}18`:"#0a0a14",
                border:`1.5px solid ${isDrag?item.color:active?item.color+"77":"#1e1e3a"}`,
                borderRadius:8, cursor:isDrag?"grabbing":"grab",
                boxShadow:isDrag?`0 6px 20px ${item.color}55`:active?`0 0 12px ${item.color}33`:"none",
                transition:isDrag?"none":"box-shadow .2s, border-color .2s",
                zIndex:isDrag?20:5,
                display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
                padding:"2px", userSelect:"none" }}>
              <span style={{ fontSize:13, lineHeight:1, marginBottom:1 }}>{item.label.split(" ")[0]}</span>
              <span style={{ fontSize:7, fontWeight:700, color:active?item.color:"#374151",
                textAlign:"center", lineHeight:1.2, whiteSpace:"nowrap",
                maxWidth:item.w-6, overflow:"hidden", textOverflow:"ellipsis" }}>
                {item.label.replace(/^[^ ]+ /,"")}
              </span>
              {status && <span style={{ fontSize:6, color:status.includes("●")?"#10b981":status.includes("✕")?"#ef4444":"#6b7280",
                marginTop:1, textAlign:"center" }}>{status}</span>}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div style={{ background:"#07070f", border:"1px solid #1a1a2e", borderRadius:10, padding:"10px 12px" }}>
        <div style={{ fontSize:9, fontWeight:700, color:C.muted, textTransform:"uppercase", letterSpacing:".08em", marginBottom:8 }}>Status</div>
        <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
          {[
            { icon:"📷", color:"#7c3aed", label:"Sony FX3",  status:fx3Active?"● Wide — active":"Standby" },
            { icon:"🎥", color:"#a78bfa", label:"Sony FX6",  status:fx6Active?"● Close-up — active":"Standby" },
            { icon:"💡", color:lightGlow||"#10b981", label:"Key Light",
              status:lightPattern?`◉ Pattern: ${lightPattern}`:lightColor!==null?`◉ Color: ${Math.round(lightColor)}°`:`White · ${lightTemp}K` },
            { icon:"🎙", color:micMuted?"#ef4444":"#10b981", label:"Rode GO II",
              status:micMuted?"🔇 Muted":`● Live · ${audioLevel}%` },
          ].map((item,i)=>(
            <div key={i} style={{ display:"flex", alignItems:"center", gap:8 }}>
              <span style={{ fontSize:12, width:18, textAlign:"center", flexShrink:0 }}>{item.icon}</span>
              <span style={{ fontSize:10, fontWeight:600, color:item.color, width:96, flexShrink:0 }}>{item.label}</span>
              <span style={{ fontSize:9, color:C.muted }}>{item.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── BriefingTab ───────────────────────────────────────────────────────────────
function BriefingTab({ runOrder, showName, productTimings, showStartTime }) {
  const prods = (runOrder && runOrder.length > 0) ? runOrder : PRODUCTS.slice(0, 5);
  const _lsStart = (() => { try { return parseInt(localStorage.getItem("STRMLIVE_SHOW_START")||"0")||0; } catch(e){return 0;} })();
  const timings   = productTimings || {};
  const startTime = showStartTime || _lsStart || Date.now();

  // Build cumulative breakpoints (same logic as LiveShop for perfect sync)
  const buildBreakpoints = (ro, pt) => {
    let cursor = 0;
    return ro.map((p, i) => {
      const dur = (pt[p.id] || 90) * 1000;
      const bp  = { idx: i, id: p.id, startMs: cursor, endMs: cursor + dur };
      cursor += dur;
      return bp;
    });
  };
  const breakpoints = buildBreakpoints(prods, timings);
  const totalDurMs  = breakpoints.length > 0 ? breakpoints[breakpoints.length - 1].endMs : 90000;

  const computeIdx = () => {
    if (!breakpoints.length) return 0;
    const elapsed = (Date.now() - startTime) % totalDurMs;
    const found = breakpoints.find(b => elapsed >= b.startMs && elapsed < b.endMs);
    return found ? found.idx : 0;
  };

  const [activeIdx, setActiveIdx] = useState(() => computeIdx());
  const [manualIdx, setManualIdx] = useState(null); // non-null = user overrode
  const [manualExpiry, setManualExpiry] = useState(0);
  const [tick, setTick]   = useState(0);

  // Clock tick every second
  useEffect(() => {
    const t = setInterval(() => {
      // If manual override has expired, re-sync to clock
      if (manualIdx !== null && Date.now() > manualExpiry) {
        setManualIdx(null);
      }
      if (manualIdx === null) {
        setActiveIdx(computeIdx());
      }
      setTick(n => n + 1);
    }, 1000);
    return () => clearInterval(t);
  }, [prods.length, timings, manualIdx, manualExpiry]);

  const displayIdx = manualIdx !== null ? manualIdx : activeIdx;
  const bp = prods[displayIdx] || prods[0];

  // Manual override — stays on selected product for 2× its duration, then re-syncs
  const selectProduct = (i) => {
    setManualIdx(i);
    const dur = (timings[prods[i]?.id] || 90) * 2 * 1000;
    setManualExpiry(Date.now() + dur);
  };

  // Compute remaining seconds for current product
  const getRemaining = () => {
    const elapsed = (Date.now() - startTime) % totalDurMs;
    const activeBp = breakpoints[displayIdx];
    if (!activeBp) return 0;
    // If manual, show time from now relative to where clock actually is in this product
    const clockBp = breakpoints[activeIdx];
    if (manualIdx !== null) return timings[prods[displayIdx]?.id] || 90;
    return Math.max(0, Math.ceil((activeBp.endMs - elapsed) / 1000));
  };

  const remaining = getRemaining();
  const remMins = Math.floor(remaining / 60);
  const remSecs = remaining % 60;

  const openForHost = () => {
    const timings = productTimings || {};
    const prodsData = JSON.stringify(prods.map(function(p) {
      return {
        id:p.id, name:p.name, image:p.image||"\u{1F4E6}", price:p.price,
        timing: timings[p.id] || 90,
        sku:p.sku||"", category:p.category||"",
        inventory:p.inventory!==undefined?p.inventory:null,
        soldLast30:p.soldLast30||null, avgPerShow:p.avgPerShow||null,
        aiScore:p.aiScore!==undefined?p.aiScore:null,
        showReady:!!p.showReady, platforms:p.platforms||[],
        cost:p.cost||null,
      };
    }));

    const showTitle = (showName || "Live Show").replace(/</g,"&lt;").replace(/>/g,"&gt;");
    const showStartTimeMs = startTime || Date.now();

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Briefing \u2014 ${showName || "Live Show"}</title>
<meta name="viewport" content="width=device-width,initial-scale=1">
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #04040e; color: #e2e8f0; font-family: -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif; height: 100vh; overflow: hidden; display: flex; }
  #sidebar { width: 240px; flex-shrink: 0; background: #07070f; border-right: 1px solid #1a1a2e; display: flex; flex-direction: column; overflow: hidden; }
  #sidebar-header { padding: 16px 14px 12px; border-bottom: 1px solid #1a1a2e; flex-shrink: 0; }
  #sidebar-title { font-size: 11px; font-weight: 800; color: #a78bfa; text-transform: uppercase; letter-spacing: .1em; margin-bottom: 3px; }
  #sidebar-sub { font-size: 9px; color: #4b5563; }
  #sidebar-list { flex: 1; overflow-y: auto; padding: 8px; }
  .si { display: flex; align-items: center; gap: 9px; padding: 9px 10px; border-radius: 9px; margin-bottom: 4px; border: 1.5px solid transparent; cursor: pointer; transition: all .2s; background: #0a0a14; border-color: #1e1e3a; }
  .si.active { background: #a78bfa18; border-color: #a78bfa55; }
  .si.done { opacity: 0.35; }
  .si-num { font-size: 10px; font-weight: 800; color: #4b5563; width: 18px; text-align: center; flex-shrink: 0; }
  .si.active .si-num { color: #a78bfa; }
  .si-emoji { font-size: 18px; flex-shrink: 0; }
  .si-name { font-size: 11px; font-weight: 600; color: #9ca3af; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .si.active .si-name { color: #e2e8f0; font-weight: 700; }
  .si-price { font-size: 10px; color: #4b5563; font-family: monospace; margin-top: 1px; }
  .si.active .si-price { color: #10b981; }
  .si-check { font-size: 10px; color: #374151; flex-shrink: 0; }
  #main { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
  #top-bar { display: flex; align-items: center; gap: 12px; padding: 12px 24px; background: #06060e; border-bottom: 1px solid #1a1a2e; flex-shrink: 0; }
  #live-dot { width: 8px; height: 8px; border-radius: 50%; background: #ef4444; animation: blink 1s infinite; flex-shrink: 0; }
  #show-name { font-size: 12px; font-weight: 700; }
  #spacer { flex: 1; }
  #timer-label { font-size: 10px; color: #4b5563; font-weight: 700; text-transform: uppercase; letter-spacing: .07em; }
  #timer-display { font-family: monospace; font-size: 22px; font-weight: 800; color: #10b981; min-width: 52px; text-align: center; }
  #timer-display.low { color: #f59e0b; }
  #timer-display.urgent { color: #ef4444; animation: blink .5s infinite; }
  #btn-pause { background: #0d0d1a; border: 1px solid #1e1e3a; color: #9ca3af; font-size: 11px; font-weight: 700; padding: 5px 14px; border-radius: 7px; cursor: pointer; }
  #product-area { flex: 1; overflow: hidden; position: relative; }
  .slide { position: absolute; inset: 0; padding: 36px 48px; transition: opacity .45s ease, transform .45s ease; overflow-y: auto; }
  .slide.hidden  { opacity: 0; transform: translateY(20px); pointer-events: none; }
  .slide.visible { opacity: 1; transform: translateY(0); }
  .slide.done    { opacity: 0; transform: translateY(-20px); pointer-events: none; }
  .prod-counter { font-size: 11px; font-weight: 800; color: #a78bfa; text-transform: uppercase; letter-spacing: .12em; margin-bottom: 14px; }
  .prod-counter span { background: #a78bfa18; border: 1px solid #a78bfa44; border-radius: 6px; padding: 3px 12px; }
  .prod-hero { display: flex; align-items: flex-start; gap: 28px; margin-bottom: 28px; }
  .prod-emoji { font-size: 68px; line-height: 1; flex-shrink: 0; }
  .prod-name { font-size: 40px; font-weight: 800; color: #f0f0ff; line-height: 1.1; margin-bottom: 7px; }
  .prod-sku { font-size: 13px; color: #4b5563; font-family: monospace; margin-bottom: 14px; }
  .prod-price { font-size: 50px; font-weight: 800; color: #10b981; font-family: monospace; line-height: 1; margin-bottom: 10px; }
  .badges { display: flex; gap: 8px; flex-wrap: wrap; }
  .badge { font-size: 11px; font-weight: 700; padding: 4px 12px; border-radius: 6px; }
  .b-green  { background: #0a1e16; border: 1px solid #10b98133; color: #10b981; }
  .b-purple { background: #1a0f2e; border: 1px solid #a78bfa44; color: #a78bfa; }
  .b-red    { background: #1a0505; border: 1px solid #ef444444; color: #ef4444; }
  .b-amber  { background: #1c1208; border: 1px solid #f59e0b44; color: #f59e0b; }
  .stats-row { display: flex; gap: 14px; margin-bottom: 28px; flex-wrap: wrap; }
  .stat-box { background: #0a0a14; border: 1px solid #1e1e3a; border-radius: 10px; padding: 14px 18px; min-width: 100px; }
  .stat-val { font-size: 22px; font-weight: 800; font-family: monospace; margin-bottom: 4px; }
  .stat-lbl { font-size: 10px; color: #4b5563; text-transform: uppercase; letter-spacing: .08em; }
  .tp-card { background: #07070f; border: 1px solid #1e1e3a; border-radius: 12px; padding: 20px 24px; }
  .tp-title { font-size: 10px; font-weight: 800; color: #4b5563; text-transform: uppercase; letter-spacing: .1em; margin-bottom: 14px; }
  .tp-item { display: flex; align-items: flex-start; gap: 12px; padding: 8px 0; border-bottom: 1px solid #1a1a2e44; }
  .tp-item:last-child { border-bottom: none; }
  .tp-icon { font-size: 18px; flex-shrink: 0; line-height: 1.4; }
  .tp-text { font-size: 16px; color: #d1d5db; line-height: 1.55; }
  #bottom-bar { display: flex; align-items: center; padding: 14px 24px; background: #06060e; border-top: 1px solid #1a1a2e; flex-shrink: 0; gap: 16px; }
  #progress-track { flex: 1; height: 4px; background: #1a1a2e; border-radius: 2px; overflow: hidden; }
  #progress-fill { height: 100%; background: #a78bfa; border-radius: 2px; transition: width .3s; }
  .nav-btn { background: #0d0d1a; border: 1px solid #1e1e3a; color: #9ca3af; font-size: 13px; font-weight: 700; padding: 9px 22px; border-radius: 9px; cursor: pointer; white-space: nowrap; }
  .nav-btn.primary { background: linear-gradient(135deg,#a78bfa,#7c3aed); border-color: transparent; color: #fff; }
  .nav-btn:disabled { opacity: .3; cursor: default; }
  #hint { font-size: 9px; color: #2a2a3a; text-align: center; white-space: nowrap; }
  @keyframes blink { 0%,100%{opacity:1}50%{opacity:.4} }
</style>
</head>
<body>
<div id="sidebar">
  <div id="sidebar-header">
    <div id="sidebar-title">\u{1F4CB} Briefing</div>
    <div id="sidebar-sub">${showTitle}</div>
  </div>
  <div id="sidebar-list"></div>
</div>
<div id="main">
  <div id="top-bar">
    <div id="live-dot"></div>
    <div id="show-name">${showTitle}</div>
    <div id="spacer"></div>
    <span id="timer-label">Time</span>
    <div id="timer-display">1:30</div>
    <button id="btn-pause">\u27F3 Re-sync</button>
  </div>
  <div id="product-area"></div>
  <div id="bottom-bar">
    <button id="btn-prev" class="nav-btn" disabled>\u2190 Prev</button>
    <div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:5px">
      <div id="progress-track"><div id="progress-fill" style="width:0%"></div></div>
      <div id="hint">\u2190 \u2192 arrow keys or spacebar to advance \u00B7 R to re-sync to show clock</div>
    </div>
    <button id="btn-next" class="nav-btn primary">Next \u2192</button>
  </div>
</div>
<script>
(function(){
  // Re-read latest timings from localStorage (updated when Catalog tab changes)
  var prods = (function() {
    var base = ${prodsData};
    try {
      var t = JSON.parse(localStorage.getItem("STRMLIVE_SHOW_TIMINGS") || "{}");
      if (Object.keys(t).length > 0) {
        return base.map(function(p) { return Object.assign({}, p, { timing: t[p.id] || p.timing || 90 }); });
      }
    } catch(e) {}
    return base;
  })();
  // Shared clock: read from localStorage (written by app on Go Live),
  // fall back to baked-in timestamp if localStorage not accessible
  var SHOW_START = (function() {
    try {
      var ls = parseInt(localStorage.getItem("STRMLIVE_SHOW_START") || "0");
      if (ls > 0) return ls;
    } catch(e) {}
    return ${showStartTimeMs};
  })();

  // ── clock-based sync (same logic as LiveShop + BriefingTab) ──
  var breakpoints = (function() {
    var cursor = 0;
    return prods.map(function(p, i) {
      var dur = (p.timing || 90) * 1000;
      var bp  = { idx: i, startMs: cursor, endMs: cursor + dur };
      cursor += dur;
      return bp;
    });
  })();
  var totalDurMs = breakpoints.length ? breakpoints[breakpoints.length-1].endMs : 90000;

  function computeIdx() {
    var elapsed = (Date.now() - SHOW_START) % totalDurMs;
    for (var i = 0; i < breakpoints.length; i++) {
      if (elapsed >= breakpoints[i].startMs && elapsed < breakpoints[i].endMs) return i;
    }
    return 0;
  }
  function computeRemaining(idx) {
    var elapsed = (Date.now() - SHOW_START) % totalDurMs;
    var bp = breakpoints[idx];
    if (!bp) return prods[idx] ? (prods[idx].timing || 90) : 90;
    return Math.max(0, Math.ceil((bp.endMs - elapsed) / 1000));
  }

  var cur = computeIdx();
  var manualUntil = 0; // timestamp until which manual override is active
  var ticker = null;

  function el(tag,cls) { var e=document.createElement(tag); if(cls)e.className=cls; return e; }
  function txt(t) { return document.createTextNode(t); }

  function getPoints(p) {
    var pts = [];
    pts.push({icon:"💰", text:"Lead with the price — $"+p.price+" is your live-exclusive rate"});
    if (p.inventory !== null && p.inventory < 30)
      pts.push({icon:"⚠️", text:"Only "+p.inventory+" units left — say it now and keep repeating it"});
    else if (p.inventory !== null)
      pts.push({icon:"✅", text:p.inventory+" in stock — solid supply, lean into the value"});
    if (p.soldLast30) pts.push({icon:"📈", text:p.soldLast30+" units sold in the last 30 days — a proven bestseller"});
    if (p.avgPerShow) pts.push({icon:"🎬", text:"Typically sells "+p.avgPerShow+" per show — demo it live"});
    if (p.category==="Bundles"||p.category==="Sets")
      pts.push({icon:"🎁", text:"Bundle — break down what each piece costs separately"});
    else
      pts.push({icon:"🔍", text:"Hold it to camera. Describe the texture, weight, and finish"});
    if (p.platforms && p.platforms.length>1)
      pts.push({icon:"📡", text:"Shout out all "+p.platforms.length+" platforms by name"});
    if (p.cost && p.price) {
      var room = Math.max(0, Math.round((p.price-p.cost)/p.price*100)-15);
      pts.push({icon:"💡", text:"Up to "+room+"% discount room — hold it for a closing push"});
    }
    return pts;
  }

  function buildSlides() {
    var area = document.getElementById("product-area");
    prods.forEach(function(p,i) {
      var slide = el("div","slide hidden"); slide.id="slide-"+i;
      var inv = p.inventory;
      var margin = (p.cost&&p.price) ? Math.round((p.price-p.cost)/p.price*100) : null;
      var invColor = (inv!==null&&inv<25)?"#ef4444":(inv!==null&&inv<60)?"#f59e0b":"#10b981";

      // Counter
      var counter = el("div","prod-counter"); var cs=el("span"); cs.textContent=(i+1)+" of "+prods.length; counter.appendChild(cs);

      // Hero
      var hero=el("div","prod-hero");
      var emo=el("span","prod-emoji"); emo.textContent=p.image; hero.appendChild(emo);
      var info=el("div");
      var nm=el("div","prod-name"); nm.textContent=p.name; info.appendChild(nm);
      var sk=el("div","prod-sku"); sk.textContent=(p.sku?" "+p.sku+" · ":"")+p.category; info.appendChild(sk);
      var pr=el("div","prod-price"); pr.textContent="$"+p.price; info.appendChild(pr);
      var bdg=el("div","badges");
      if(p.showReady){var b=el("span","badge b-green");b.textContent="● Show Ready";bdg.appendChild(b);}
      if(p.aiScore){var b=el("span","badge b-purple");b.textContent="AI "+p.aiScore+"/10";bdg.appendChild(b);}
      if(inv!==null&&inv<30){var b=el("span","badge b-red");b.textContent="⚠ Low Stock";bdg.appendChild(b);}
      info.appendChild(bdg); hero.appendChild(info);

      // Stats
      var stats=el("div","stats-row");
      function addStat(val,lbl,color){var box=el("div","stat-box");var v=el("div","stat-val");v.style.color=color;v.textContent=val;var l=el("div","stat-lbl");l.textContent=lbl;box.appendChild(v);box.appendChild(l);stats.appendChild(box);}
      if(inv!==null) addStat(inv+" units","In Stock",invColor);
      if(p.soldLast30) addStat(p.soldLast30,"Sold 30d","#a78bfa");
      if(p.avgPerShow) addStat(p.avgPerShow,"Avg / Show","#38bdf8");
      if(margin!==null) addStat(margin+"%","Margin","#10b981");

      // Talking points
      var tpCard=el("div","tp-card");
      var tpTitle=el("div","tp-title"); tpTitle.textContent="Host Talking Points"; tpCard.appendChild(tpTitle);
      getPoints(p).forEach(function(pt){
        var item=el("div","tp-item");
        var icon=el("span","tp-icon"); icon.textContent=pt.icon;
        var text=el("span","tp-text"); text.textContent=pt.text;
        item.appendChild(icon); item.appendChild(text); tpCard.appendChild(item);
      });

      slide.appendChild(counter); slide.appendChild(hero); slide.appendChild(stats); slide.appendChild(tpCard);
      area.appendChild(slide);
    });
  }

  function buildSidebar() {
    var list = document.getElementById("sidebar-list");
    prods.forEach(function(p,i) {
      var item=el("div","si"); item.id="si-"+i;
      var num=el("span","si-num"); num.textContent=i+1;
      var emo=el("span","si-emoji"); emo.textContent=p.image;
      var info=el("div"); info.style.flex="1"; info.style.minWidth="0";
      var nm=el("div","si-name"); nm.textContent=p.name;
      var pr=el("div","si-price"); pr.textContent="$"+p.price;
      var chk=el("span","si-check"); chk.id="chk-"+i;
      info.appendChild(nm); info.appendChild(pr);
      item.appendChild(num); item.appendChild(emo); item.appendChild(info); item.appendChild(chk);
      item.addEventListener("click",function(){jumpTo(i);});
      list.appendChild(item);
    });
  }

  function updateSidebar() {
    prods.forEach(function(p,i){
      var s=document.getElementById("si-"+i);
      var c=document.getElementById("chk-"+i);
      s.className="si"+(i===cur?" active":i<cur?" done":"");
      c.textContent=i<cur?"✓":"";
    });
  }

  function showSlide(idx) {
    prods.forEach(function(p,i){
      var s=document.getElementById("slide-"+i);
      s.className="slide"+(i===idx?" visible":i<idx?" done":" hidden");
    });
    var pct=prods.length>1?Math.round(idx/(prods.length-1)*100):100;
    document.getElementById("progress-fill").style.width=pct+"%";
    document.getElementById("btn-prev").disabled=idx===0;
    document.getElementById("btn-next").disabled=idx===prods.length-1;
    updateSidebar();
    var si=document.getElementById("si-"+idx);
    if(si) si.scrollIntoView({behavior:"smooth",block:"nearest"});
  }

  function updateTimer() {
    var m=Math.floor(secs/60), s=secs%60;
    var d=document.getElementById("timer-display");
    d.textContent=m+":"+(s<10?"0":"")+s;
    d.className=secs<=10?"urgent":secs<=30?"low":"";
  }

  function startTimer() {
    if(timer) clearInterval(timer);
    timer=setInterval(function(){
    if(!paused&&secs>0){secs--;updateTimer();}
    else if(!paused&&secs===0&&cur<prods.length-1){
      // auto-advance to next product
      setTimeout(function(){ next(); }, 400);
    }
  },1000);
  }

  function jumpTo(idx) { cur=idx; showSlide(cur); secs=prods[idx].timing||90; updateTimer(); startTimer(); }
  function next() { if(cur<prods.length-1){cur++;showSlide(cur);secs=prods[cur].timing||90;updateTimer();startTimer();} }
  function prev() { if(cur>0){cur--;showSlide(cur);secs=prods[cur].timing||90;updateTimer();startTimer();} }

  document.getElementById("btn-next").addEventListener("click",next);
  document.getElementById("btn-prev").addEventListener("click",prev);
  document.getElementById("btn-pause").addEventListener("click",function(){
    paused=!paused;
    this.textContent=paused?"▶ Resume":"⏸ Pause";
  });
  document.addEventListener("keydown",function(e){
    if(e.key==="ArrowRight"||e.key===" "){e.preventDefault();next();}
    if(e.key==="ArrowLeft"){e.preventDefault();prev();}
    if(e.key==="p"||e.key==="P"){document.getElementById("btn-pause").click();}
  });

  buildSlides();
  buildSidebar();
  showSlide(0);
  secs = prods[0].timing || 90; updateTimer();
  startTimer();
})();
</script>
</body>
</html>`;

    const blob = new Blob([html], { type: "text/html" });
    window.open(URL.createObjectURL(blob), "_blank");
  };

  const margin = (bp && bp.cost && bp.price)
    ? Math.round((bp.price - bp.cost) / bp.price * 100) : null;

  return (
    <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>

      {/* ── HEADER ── */}
      <div style={{ padding:"12px 14px 10px", borderBottom:"1px solid " + C.border, flexShrink:0 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
          <div>
            <div style={{ fontSize:11, fontWeight:700, color:C.text }}>Show Briefing</div>
            <div style={{ fontSize:9, color:C.muted, marginTop:1 }}>{prods.length} products · synced with Live Shop</div>
          </div>
          <button onClick={openForHost}
            style={{ display:"flex", alignItems:"center", gap:5, padding:"5px 10px",
              background:"#1a0f2e", border:"1px solid #a78bfa55", borderRadius:7,
              cursor:"pointer", color:"#a78bfa", fontSize:9, fontWeight:700 }}>
            ↗ Open for Host
          </button>
        </div>

        {/* Live countdown bar */}
        <div style={{ marginBottom:8 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:4 }}>
            <div style={{ display:"flex", alignItems:"center", gap:6 }}>
              <div style={{ width:6, height:6, borderRadius:"50%", background:"#ef4444",
                animation:"pulse 1s infinite" }} />
              <span style={{ fontSize:9, fontWeight:700, color:C.muted, textTransform:"uppercase",
                letterSpacing:".07em" }}>
                {manualIdx !== null ? "Manual Override" : "Auto-Advancing"}
              </span>
              {manualIdx !== null && (
                <button onClick={() => setManualIdx(null)}
                  style={{ fontSize:8, color:"#a78bfa", background:"none", border:"none",
                    cursor:"pointer", padding:0, textDecoration:"underline" }}>
                  Re-sync
                </button>
              )}
            </div>
            <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:11, fontWeight:800,
              color: remaining<=10 ? "#ef4444" : remaining<=30 ? "#f59e0b" : "#10b981" }}>
              {remMins > 0 ? `${remMins}:${remSecs<10?"0":""}${remSecs}` : `${remSecs}s`}
            </div>
          </div>
          {/* Progress bar for current product */}
          <div style={{ height:3, background:"#1a1a2e", borderRadius:2, overflow:"hidden" }}>
            <div style={{ height:"100%", borderRadius:2, transition:"width .9s linear",
              background: remaining<=10 ? "#ef4444" : remaining<=30 ? "#f59e0b" : "#a78bfa",
              width: (() => {
                const total = timings[prods[displayIdx]?.id] || 90;
                return Math.round((remaining / total) * 100) + "%";
              })()
            }} />
          </div>
        </div>

        {/* Product picker tabs */}
        <div style={{ display:"flex", gap:5, overflowX:"auto", paddingBottom:2 }}>
          {prods.map(function(p, i) {
            const isActive = i === displayIdx;
            const isDone   = i < activeIdx && manualIdx === null;
            return (
              <button key={p.id} onClick={() => selectProduct(i)}
                style={{ display:"flex", alignItems:"center", gap:5, padding:"4px 9px",
                  flexShrink:0, whiteSpace:"nowrap", position:"relative",
                  background: isActive ? "#1a0f2e" : "transparent",
                  border: "1px solid " + (isActive ? "#a78bfa55" : "transparent"),
                  borderRadius:6, cursor:"pointer", opacity: isDone ? 0.4 : 1 }}>
                <span style={{ fontSize:9, color: isActive ? "#a78bfa" : "#374151", fontWeight:800 }}>{i + 1}</span>
                <span style={{ fontSize:9, fontWeight: isActive ? 700 : 400,
                  color: isActive ? C.text : C.muted }}>
                  {p.image} {p.name.split(" ").slice(0, 2).join(" ")}
                </span>
                {isDone && <span style={{ fontSize:7, color:"#374151" }}>✓</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── PRODUCT DETAIL ── */}
      {bp ? (
        <div style={{ flex:1, overflowY:"auto", padding:"14px" }}>

          {/* Hero */}
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:12,
            background:"#0a0a14", border:"1px solid #1e1e3a", borderRadius:12, padding:"14px" }}>
            <span style={{ fontSize:44, flexShrink:0 }}>{bp.image}</span>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:16, fontWeight:800, color:C.text, marginBottom:3 }}>{bp.name}</div>
              <div style={{ fontSize:10, color:C.muted, marginBottom:8 }}>{bp.sku} · {bp.category}</div>
              <div style={{ display:"flex", gap:7, flexWrap:"wrap", alignItems:"center" }}>
                <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:20, fontWeight:800, color:"#10b981" }}>
                  ${bp.price}
                </span>
                {bp.aiScore !== undefined && (
                  <span style={{ background:"#1a0f2e", border:"1px solid #a78bfa44", borderRadius:7,
                    padding:"3px 9px", fontSize:11, fontWeight:800, color:"#a78bfa" }}>
                    AI {bp.aiScore}/10
                  </span>
                )}
                {bp.showReady && (
                  <span style={{ background:"#0a1e16", border:"1px solid #10b98133", borderRadius:7,
                    padding:"3px 9px", fontSize:9, fontWeight:700, color:"#10b981" }}>
                    ● Show Ready
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Stats grid */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:7, marginBottom:12 }}>
            {[
              { label:"Inventory",
                value: bp.inventory !== undefined ? bp.inventory + " units" : "—",
                color: bp.inventory < 25 ? "#ef4444" : bp.inventory < 60 ? "#f59e0b" : "#10b981" },
              { label:"Sold last 30d", value: bp.soldLast30  || "—", color:"#a78bfa" },
              { label:"Avg per show",  value: bp.avgPerShow  || "—", color:"#38bdf8" },
              { label:"Margin",        value: margin !== null ? margin + "%" : "—", color:"#10b981" },
              { label:"Category",      value: bp.category    || "—", color:C.text },
              { label:"Platforms",     value: (bp.platforms  || []).join(", ") || "—", color:C.text },
            ].map(function(s, i) {
              return (
                <div key={i} style={{ background:"#0a0a14", border:"1px solid #1e1e3a", borderRadius:9, padding:"10px 12px" }}>
                  <div style={{ fontSize:9, color:C.muted, textTransform:"uppercase", letterSpacing:".07em", marginBottom:4 }}>
                    {s.label}
                  </div>
                  <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:13, fontWeight:700, color:s.color }}>
                    {s.value}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Stock bar */}
          {bp.inventory !== undefined && (
            <div style={{ marginBottom:12 }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                <span style={{ fontSize:9, color:C.muted, textTransform:"uppercase", letterSpacing:".07em" }}>Stock Level</span>
                <span style={{ fontSize:9, fontWeight:700,
                  color: bp.inventory < 25 ? "#ef4444" : bp.inventory < 60 ? "#f59e0b" : "#10b981" }}>
                  {bp.inventory < 25 ? "⚠ Low — create urgency" : bp.inventory < 60 ? "Moderate" : "Well stocked"}
                </span>
              </div>
              <div style={{ height:5, background:"#0d0d1a", borderRadius:3, overflow:"hidden" }}>
                <div style={{ height:"100%", borderRadius:3,
                  width: Math.min(100, Math.round(bp.inventory / 200 * 100)) + "%",
                  background: bp.inventory < 25 ? "#ef4444" : bp.inventory < 60 ? "#f59e0b" : "#10b981" }} />
              </div>
            </div>
          )}

          {/* Talking points */}
          <div style={{ background:"#07070f", border:"1px solid #1e1e3a", borderRadius:10, padding:"12px 14px" }}>
            <div style={{ fontSize:9, fontWeight:700, color:C.muted, textTransform:"uppercase",
              letterSpacing:".08em", marginBottom:10 }}>Host Talking Points</div>
            {[
              { icon:"💰", text:"Lead with the price — $" + bp.price + " is your live-exclusive rate" },
              bp.inventory !== undefined && bp.inventory < 30
                ? { icon:"⚠️", text:"Only " + bp.inventory + " units left — mention it early and often" }
                : { icon:"✅", text:(bp.inventory || "—") + " in stock — solid supply, focus on the value" },
              bp.soldLast30 ? { icon:"📈", text:bp.soldLast30 + " units sold in the last 30 days — a proven bestseller" } : null,
              bp.avgPerShow ? { icon:"🎬", text:"Typically sells " + bp.avgPerShow + " per show — pick it up and demo it live" } : null,
              (bp.category === "Bundles" || bp.category === "Sets")
                ? { icon:"🎁", text:"Bundle deal — break down what each piece costs separately" }
                : { icon:"🔍", text:"Hold it close to camera. Describe texture, weight, and finish" },
              bp.platforms && bp.platforms.length > 1
                ? { icon:"📡", text:"Shout out all " + bp.platforms.length + " platforms by name — everyone wants to feel seen" }
                : null,
              margin !== null
                ? { icon:"💡", text:"Up to " + Math.max(0, margin - 15) + "% discount room — use it as a closing push if needed" }
                : null,
            ].filter(Boolean).map(function(pt, i, arr) {
              return (
                <div key={i} style={{ display:"flex", gap:9, padding:"8px 0",
                  borderBottom: i < arr.length - 1 ? "1px solid " + C.border + "44" : "none" }}>
                  <span style={{ fontSize:14, flexShrink:0, marginTop:1 }}>{pt.icon}</span>
                  <span style={{ fontSize:11, color:"#d1d5db", lineHeight:1.55 }}>{pt.text}</span>
                </div>
              );
            })}
          </div>

        </div>
      ) : (
        <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center" }}>
          <span style={{ fontSize:12, color:C.muted }}>No products in run order</span>
        </div>
      )}
    </div>
  );
}


function ScreenLive({ buyers, navigate, params, persona: personaProp, updateLiveSession }) {
  const selectedPlatforms = params?.selectedPlatforms || ["WN"];
  // Per-platform viewer counts (seeded differently per platform)
  const [platformViewers, setPlatformViewers] = useState(() => {
    const seeds = { WN:234, TT:891, IG:312, AM:156, YT:4200 };
    return Object.fromEntries(selectedPlatforms.map(p=>[p, seeds[p]||200]));
  });
  const [liveBuyers, setLiveBuyers]   = useState([]);
  const [elapsed, setElapsed]         = useState(0);
  const showStartTime = useRef(params?.showStartTime || Date.now()); // stable for sync
  const [viewerCount, setViewerCount] = useState(
    selectedPlatforms.reduce((a,p)=>{const s={WN:234,TT:891,IG:312,AM:156,YT:4200}; return a+(s[p]||200);},0)
  );
  const [gmv, setGmv]                 = useState(0);
  const [orderCount, setOrderCount]   = useState(0);
  const [search, setSearch]           = useState("");
  const [selectedId, setSelectedId]   = useState(buyers[0]?.id || null);
  const [rightTab, setRightTab]       = useState("notes");

  // Per-buyer state maps
  const [buyerNotes,    setBuyerNotes]    = useState({});
  const [buyerDiscounts,setBuyerDiscounts]= useState({});
  const [buyerPerks,    setBuyerPerks]    = useState({});
  const [buyerItems,    setBuyerItems]    = useState({});
  const [savedFeedback, setSavedFeedback] = useState(null);
  const [msgChannel,    setMsgChannel]    = useState("sms");
  const [msgText,       setMsgText]       = useState("");
  const [msgSent,       setMsgSent]       = useState(false);

  // Live Catalog — mutable run order + per-product timings during show
  const [liveRunOrder,    setLiveRunOrder]    = useState(() => params?.runOrder || PRODUCTS.slice(0,5));
  const [productTimings,  setProductTimings]  = useState(() => {
    const base = params?.runOrder || PRODUCTS.slice(0,5);
    const fromParams = params?.productTimings || {};
    return Object.fromEntries(base.map(p => [p.id, fromParams[p.id] || 90]));
  });
  const [catalogSearch,   setCatalogSearch]   = useState("");

  // Keep liveSession in sync whenever run order or timings change in Catalog tab
  useEffect(() => {
    if (updateLiveSession) {
      updateLiveSession({
        runOrder: liveRunOrder,
        productTimings,
        showStartTime: showStartTime.current,
      });
    }
  }, [liveRunOrder, productTimings]);

  // Production tab state (inline production panel)
  const [liveTab,       setLiveTab]       = useState("orders");
  const [activeScene,   setActiveScene]   = useState("Wide — FX3");
  const [lightBrightness, setLightBrightness] = useState(80);
  const [lightTemp,     setLightTemp]     = useState(5500);
  const [lightColor,    setLightColor]    = useState(null);   // hue 0-360, null = white/temp mode
  const [lightPattern,  setLightPattern]  = useState(null);  // pattern id or null
  const [soundPlaying,  setSoundPlaying]  = useState(null);
  const [soundVolume,   setSoundVolume]   = useState(75);
  const [micMuted,      setMicMuted]      = useState(false);
  const [audioLevel,    setAudioLevel]    = useState(72);
  const [streamHealth,  setStreamHealth]  = useState({ WN:true, TT:true, IG:true, AM:true, YT:true });

  // Simulate fluctuating audio level
  useEffect(()=>{
    const t = setInterval(()=>{
      if (!micMuted) setAudioLevel(v => Math.max(20, Math.min(95, v + Math.floor((Math.random()-0.4)*14))));
    }, 400);
    return ()=>clearInterval(t);
  }, [micMuted]);

  const SCENES = [
    { id:"wide",    name:"Wide — FX3",     icon:"📷" },
    { id:"closeup", name:"Close-Up — FX6", icon:"🎥" },
    { id:"product", name:"Product Focus",  icon:"🎥" },
    { id:"pip",     name:"PiP",            icon:"📷" },
    { id:"screen",  name:"Screen Share",   icon:"💻" },
  ];

  const PLATFORM_META_LIVE = {
    WN:{ label:"Whatnot",   color:"#7c3aed", bitrate:"6 Mbps",  latency:"1.2s" },
    TT:{ label:"TikTok",    color:"#f43f5e", bitrate:"4 Mbps",  latency:"0.8s" },
    IG:{ label:"Instagram", color:"#ec4899", bitrate:"3.5 Mbps",latency:"1.4s" },
    AM:{ label:"Amazon",    color:"#f59e0b", bitrate:"4 Mbps",  latency:"2.1s" },
    YT:{ label:"YouTube",   color:"#ff0000", bitrate:"8 Mbps",  latency:"1.0s" },
  };

  // Build the live shop link whenever showName/persona changes
  const showName     = params?.showName   || "Live Show";
  const runOrder     = liveRunOrder;
  const personaSlug  = params?.persona?.slug || personaProp?.slug || "shop";
  const showSlug     = showName.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
  const liveShopUrl  = `strmlive.com/live/${personaSlug}/${showSlug}`;

  // Default message templates per channel
  const MSG_TEMPLATES = {
    sms:   `Hey! We're live right now selling ${runOrder[0]?.name || "new items"} and more. Shop the full lineup here: https://${liveShopUrl}`,
    ig_dm: `Hey! We're going live right now 🔴 Check out what we're selling: https://${liveShopUrl}`,
    tt_dm: `We're LIVE right now! Shop the full lineup at: https://${liveShopUrl} 🎵`,
  };

  const sendMessage = () => {
    setMsgSent(true);
    setTimeout(() => setMsgSent(false), 3000);
  };

  // Auto-select the newest buyer as they flash in
  useEffect(()=>{
    const t = setInterval(()=>{
      setElapsed(e=>e+1);
      setPlatformViewers(prev=>{
        const next={...prev};
        selectedPlatforms.forEach(p=>{ next[p]=Math.max(10,next[p]+Math.floor((Math.random()-0.38)*12)); });
        return next;
      });
      setViewerCount(v=>Math.max(180, v + Math.floor((Math.random()-0.4)*8)));
      // New order comes in ~30% of ticks
      if (Math.random() > 0.7) {
        setLiveBuyers(prev => {
          const remaining = buyers.filter(b=>!prev.find(p=>p.id===b.id));
          const pool = remaining.length > 0 ? remaining : buyers;
          const base = pool[Math.floor(Math.random()*pool.length)];
          const newest = { ...base, id: base.id + "_" + Date.now() };
          // Order value: realistic per-item amount based on buyer's avg order value
          const avgOrder = Math.round(base.spend / Math.max(base.orders, 1));
          const orderValue = Math.max(25, avgOrder + Math.floor((Math.random()-0.3)*avgOrder*0.5));
          setGmv(g => g + orderValue);
          setOrderCount(c => c + 1);
          return [newest, ...prev];
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
    setSavedFeedback("item_" + productId);
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
    <div style={{ display:"flex", flexDirection:"column", height:"100%", minHeight:0, background:"#050510" }}>

      {/* ── LIVE HEADER ── */}
      <div style={{ background:"#090916", borderBottom:`1px solid ${C.border}`, padding:"0 20px", flexShrink:0 }}>

        {/* ROW 1: show identity + actions */}
        <div style={{ display:"flex", alignItems:"center", gap:12, height:44, borderBottom:`1px solid ${C.border}44` }}>
          {/* LIVE pill + timer */}
          <div style={{ display:"flex", alignItems:"center", gap:7, flexShrink:0 }}>
            <div style={{ display:"flex", alignItems:"center", gap:5, background:"#1a050522", border:"1px solid #ef444444", borderRadius:20, padding:"3px 9px 3px 6px" }}>
              <div style={{ width:6, height:6, borderRadius:"50%", background:"#ef4444", animation:"pulse 1s infinite" }}/>
              <span style={{ fontSize:10, fontWeight:800, color:"#ef4444", letterSpacing:"0.08em" }}>LIVE</span>
            </div>
            <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:11, color:C.muted, flexShrink:0 }}>{fmt(elapsed)}</span>
          </div>

          {/* Show name */}
          <div style={{ height:18, width:1, background:C.border, flexShrink:0 }}/>
          <span style={{ fontSize:12, fontWeight:700, color:C.text, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", flex:"0 1 auto", maxWidth:220 }}>{showName}</span>

          {/* Spacer */}
          <div style={{ flex:1 }}/>

          {/* Live Shop link widget */}
          <div style={{ display:"flex", alignItems:"center", background:"#06060e", border:`1px solid ${savedFeedback==="link_copied"?"#10b98155":"#1e1e3a"}`, borderRadius:8, overflow:"hidden", transition:"border-color .2s", flexShrink:0 }}>
            <div style={{ display:"flex", alignItems:"center", gap:5, padding:"4px 9px", borderRight:"1px solid #1a1a2e" }}>
              <div style={{ width:5, height:5, borderRadius:"50%", background:"#ef4444", animation:"pulse 1s infinite", flexShrink:0 }}/>
              <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:9, color:"#4b5563", whiteSpace:"nowrap", maxWidth:200, overflow:"hidden", textOverflow:"ellipsis" }}>{liveShopUrl}</span>
            </div>
            <button
              onClick={()=>{ navigator.clipboard?.writeText(`https://${liveShopUrl}`).catch(()=>{}); setSavedFeedback("link_copied"); setTimeout(()=>setSavedFeedback(null),2200); }}
              style={{ padding:"4px 9px", background:savedFeedback==="link_copied"?"#0a1e16":"transparent", border:"none", cursor:"pointer", borderRight:"1px solid #1a1a2e", transition:"background .15s" }}
            >
              <span style={{ fontSize:9, fontWeight:700, color:savedFeedback==="link_copied"?"#10b981":"#a78bfa", whiteSpace:"nowrap" }}>
                {savedFeedback==="link_copied" ? "✓ Copied" : "Copy 🔗"}
              </span>
            </button>
            <button
              onClick={()=>navigate("live-shop",{...params, runOrder, showName, persona:params?.persona, productTimings, showStartTime:showStartTime.current})}
              style={{ padding:"4px 9px", background:"#10b98110", border:"none", cursor:"pointer" }}
            >
              <span style={{ fontSize:9, fontWeight:700, color:"#10b981", whiteSpace:"nowrap" }}>Shop ↗</span>
            </button>
          </div>

          {/* End Show */}
          <button onClick={()=>navigate("order-review",{liveBuyers,buyerNotes,buyerDiscounts,buyerPerks,buyerItems,gmv,elapsed,orderCount})} style={{ fontSize:10, color:"#ef4444", background:"transparent", border:"1px solid #ef444433", padding:"4px 12px", borderRadius:7, cursor:"pointer", whiteSpace:"nowrap", flexShrink:0 }}>■ End Show</button>
        </div>

        {/* ROW 2: stats strip */}
        <div style={{ display:"flex", alignItems:"center", gap:0, height:38 }}>

          {/* GMV */}
          <div style={{ display:"flex", alignItems:"baseline", gap:5, paddingRight:16, borderRight:`1px solid ${C.border}44`, height:"100%", alignItems:"center" }}>
            <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:15, fontWeight:800, color:C.green }}>${gmv.toLocaleString()}</span>
            <span style={{ fontSize:10, color:C.muted }}>GMV</span>
          </div>

          {/* Orders */}
          <div style={{ display:"flex", alignItems:"center", gap:5, padding:"0 16px", borderRight:`1px solid ${C.border}44`, height:"100%" }}>
            <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:15, fontWeight:800, color:"#a78bfa" }}>{orderCount}</span>
            <span style={{ fontSize:10, color:C.muted }}>orders</span>
          </div>

          {/* Total Viewers */}
          <div style={{ display:"flex", alignItems:"center", gap:5, padding:"0 16px", borderRight:`1px solid ${C.border}44`, height:"100%" }}>
            <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:15, fontWeight:800, color:"#38bdf8" }}>
              {Object.values(platformViewers).reduce((a,v)=>a+v,0).toLocaleString()}
            </span>
            <span style={{ fontSize:10, color:C.muted }}>viewers</span>
          </div>

          {/* Per-platform condensed badges */}
          <div style={{ display:"flex", alignItems:"center", gap:5, padding:"0 14px", flex:1, overflow:"hidden" }}>
            {selectedPlatforms.map(pid=>{
              const pc={WN:"#7c3aed",TT:"#f43f5e",IG:"#ec4899",AM:"#f59e0b",YT:"#ff0000"};
              const col=pc[pid]||"#7c3aed";
              const viewers=platformViewers[pid]||0;
              return (
                <div key={pid} style={{ display:"flex", alignItems:"center", gap:4, background:`${col}12`, border:`1px solid ${col}33`, borderRadius:6, padding:"3px 8px", flexShrink:0 }}>
                  <div style={{ width:4, height:4, borderRadius:"50%", background:col, animation:"pulse 1s infinite" }}/>
                  <span style={{ fontSize:9, fontWeight:800, color:col }}>{pid}</span>
                  <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:9, fontWeight:700, color:C.text }}>{viewers >= 1000 ? (viewers/1000).toFixed(1)+"k" : viewers}</span>
                </div>
              );
            })}
          </div>

        </div>
      </div>

      {/* ── MAIN BODY ── */}
      <div style={{ flex:1, display:"flex", overflow:"hidden", minHeight:0 }}>

        {/* ── LEFT PANEL — ORDERS or PRODUCTION ── */}
        <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden", borderRight:`1px solid ${C.border}`, minHeight:0 }}>

          {/* ── TAB SWITCHER ── */}
          <div style={{ display:"flex", borderBottom:`1px solid ${C.border}`, flexShrink:0, background:"#07070f" }}>
            {[
              { id:"orders",     label:"Orders" },
              { id:"production", label:"Production" },
              { id:"scene",      label:"Scene" },
              { id:"catalog",    label:"Catalog" },
              { id:"briefing",   label:"Briefing" },
              { id:"platforms",  label:"Platforms" },
            ].map(t=>(
              <button key={t.id} onClick={()=>setLiveTab(t.id)} style={{
                padding:"0 20px", height:38, background:"none", border:"none",
                borderBottom:`2px solid ${liveTab===t.id?"#a78bfa":"transparent"}`,
                color:liveTab===t.id?"#a78bfa":C.muted,
                fontSize:11, fontWeight:liveTab===t.id?700:400, cursor:"pointer", transition:"all .12s"
              }}>{t.label}</button>
            ))}
          </div>

          {/* ── ORDERS TAB ── */}
          {liveTab === "orders" && <>
          <div style={{ padding:"10px 16px", borderBottom:`1px solid ${C.border}`, flexShrink:0 }}>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Quick lookup — search any buyer…"
              style={{ width:"100%", background:C.surface2, border:`1px solid ${C.border2}`, borderRadius:8, padding:"7px 12px", color:C.text, fontSize:12, outline:"none" }} />
          </div>
          <div style={{ overflowY:"auto", flex:1, minHeight:0 }}>
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
          </>}

          {/* ── PRODUCTION TAB ── */}
          {liveTab === "production" && (
            <div style={{ flex:1, overflowY:"auto", padding:"16px" }}>

              {/* ── CAMERA FEEDS ── */}
              <div style={{ marginBottom:20 }}>
                <div style={{ fontSize:10, fontWeight:700, color:C.muted, textTransform:"uppercase", letterSpacing:".08em", marginBottom:10 }}>Camera Feeds</div>

                {/* Main feed - active scene */}
                <div style={{ position:"relative", borderRadius:12, overflow:"hidden", marginBottom:8, border:"2px solid #a78bfa55", background:"#0a0a14" }}>
                  {/* Simulated camera feed with gradient noise */}
                  <div style={{
                    height:140, background:"linear-gradient(135deg,#0d0820 0%,#141028 40%,#0a1a0a 70%,#100a0a 100%)",
                    position:"relative", overflow:"hidden"
                  }}>
                    {/* Scanline effect */}
                    <div style={{ position:"absolute", inset:0, backgroundImage:"repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.15) 2px,rgba(0,0,0,0.15) 4px)", pointerEvents:"none" }}/>
                    {/* Scene label overlay */}
                    <div style={{ position:"absolute", top:8, left:8, display:"flex", alignItems:"center", gap:6 }}>
                      <div style={{ width:6, height:6, borderRadius:"50%", background:"#ef4444", animation:"pulse 1s infinite" }}/>
                      <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:9, fontWeight:800, color:"#ef4444", letterSpacing:".08em" }}>LIVE</span>
                    </div>
                    <div style={{ position:"absolute", top:8, right:8 }}>
                      <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:8, color:"rgba(255,255,255,0.35)" }}>{new Date().toLocaleTimeString([], {hour:"2-digit",minute:"2-digit",second:"2-digit"})}</span>
                    </div>
                    {/* Center camera label */}
                    <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:6 }}>
                      <span style={{ fontSize:28 }}>{activeScene.includes("FX6") ? "🎥" : activeScene.includes("Screen") ? "💻" : "📷"}</span>
                      <span style={{ fontSize:11, fontWeight:700, color:"rgba(255,255,255,0.5)" }}>{activeScene}</span>
                    </div>
                    {/* Corner crosshairs */}
                    {[["0%","0%"],["0%","auto"],["auto","0%"],["auto","auto"]].map(([t,b],ci)=>(
                      <div key={ci} style={{ position:"absolute", top:t==="auto"?undefined:12, bottom:b==="auto"?undefined:12, left:ci%2===0?12:undefined, right:ci%2===1?12:undefined, width:12, height:12,
                        borderTop:t!=="auto"?"1.5px solid rgba(167,139,250,0.4)":undefined,
                        borderBottom:b!=="auto"?"1.5px solid rgba(167,139,250,0.4)":undefined,
                        borderLeft:ci%2===0?"1.5px solid rgba(167,139,250,0.4)":undefined,
                        borderRight:ci%2===1?"1.5px solid rgba(167,139,250,0.4)":undefined,
                      }}/>
                    ))}
                  </div>
                  {/* Feed label bar */}
                  <div style={{ padding:"6px 10px", display:"flex", alignItems:"center", justifyContent:"space-between", background:"#0d0d1a" }}>
                    <span style={{ fontSize:10, fontWeight:700, color:"#a78bfa" }}>Program Output</span>
                    <span style={{ fontSize:9, color:C.muted }}>1920×1080 · 60fps · H.264</span>
                  </div>
                </div>

                {/* Secondary feeds row — all connected cameras */}
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:7 }}>
                  {[
                    { id:"fx3",  name:"Sony FX3",  icon:"📷", color:"#7c3aed", status:"recording", iso:"ISO 800",  scene:"Wide" },
                    { id:"fx6",  name:"Sony FX6",  icon:"🎥", color:"#a78bfa", status:"standby",   iso:"ISO 1600", scene:"Close-Up" },
                  ].map(cam => {
                    const isActive = activeScene.toLowerCase().includes(cam.id === "fx3" ? "fx3" : "fx6");
                    return (
                      <div key={cam.id} onClick={()=>setActiveScene(cam.id==="fx3"?"Wide — FX3":"Close-Up — FX6")}
                        style={{ borderRadius:9, overflow:"hidden", border:`1.5px solid ${isActive?"#a78bfa55":"#1e1e3a"}`, cursor:"pointer", transition:"border-color .15s" }}>
                        <div style={{
                          height:72, position:"relative",
                          background:`linear-gradient(135deg,${cam.id==="fx3"?"#0d0820,#0a0a18":"#0a180d,#0a0a14"})`,
                          overflow:"hidden"
                        }}>
                          <div style={{ position:"absolute", inset:0, backgroundImage:"repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.12) 2px,rgba(0,0,0,0.12) 4px)" }}/>
                          {isActive && (
                            <div style={{ position:"absolute", top:5, left:6, display:"flex", alignItems:"center", gap:4 }}>
                              <div style={{ width:5, height:5, borderRadius:"50%", background:"#ef4444", animation:"pulse 1s infinite" }}/>
                              <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:7, fontWeight:800, color:"#ef4444" }}>LIVE</span>
                            </div>
                          )}
                          <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:2 }}>
                            <span style={{ fontSize:18 }}>{cam.icon}</span>
                          </div>
                        </div>
                        <div style={{ padding:"5px 8px", background:"#0a0a14" }}>
                          <div style={{ fontSize:9, fontWeight:700, color:isActive?"#a78bfa":C.text, marginBottom:1 }}>{cam.name}</div>
                          <div style={{ fontSize:8, color:C.muted }}>{cam.iso} · {cam.scene}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ── OBS SCENE SWITCHER ── */}
              <div style={{ marginBottom:20 }}>
                <div style={{ fontSize:10, fontWeight:700, color:C.muted, textTransform:"uppercase", letterSpacing:".08em", marginBottom:10 }}>OBS Scene</div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:7 }}>
                  {SCENES.map(s => (
                    <button key={s.id} onClick={()=>setActiveScene(s.name)}
                      style={{ display:"flex", alignItems:"center", gap:8, padding:"10px 12px", background:activeScene===s.name?"#1a0f2e":"#0a0a14", border:`1px solid ${activeScene===s.name?"#a78bfa55":"#1e1e3a"}`, borderRadius:9, cursor:"pointer", transition:"all .12s", textAlign:"left" }}>
                      <span style={{ fontSize:14, flexShrink:0 }}>{s.icon}</span>
                      <div>
                        <div style={{ fontSize:11, fontWeight:700, color:activeScene===s.name?"#a78bfa":C.text }}>{s.name}</div>
                        {activeScene===s.name && <div style={{ fontSize:9, color:"#a78bfa", marginTop:1 }}>● Active</div>}
                      </div>
                    </button>
                  ))}
                </div>
                <div style={{ marginTop:8, padding:"7px 12px", background:"#0a0a14", border:"1px solid #1e1e3a", borderRadius:8 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <span style={{ fontSize:10, color:C.muted }}>Active scene</span>
                    <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10, fontWeight:700, color:"#a78bfa" }}>{activeScene}</span>
                  </div>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:3 }}>
                    <span style={{ fontSize:10, color:C.muted }}>OBS WebSocket</span>
                    <span style={{ fontSize:9, fontWeight:700, color:"#10b981" }}>● Connected</span>
                  </div>
                </div>
              </div>

              {/* ── AUDIO ── */}
              <div style={{ marginBottom:20 }}>
                <div style={{ fontSize:10, fontWeight:700, color:C.muted, textTransform:"uppercase", letterSpacing:".08em", marginBottom:10 }}>Audio — Rode Wireless GO II</div>
                <div style={{ background:"#0a0a14", border:"1px solid #1e1e3a", borderRadius:10, padding:"12px 14px" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
                    <div style={{ flex:1, height:8, background:"#0d0d1a", borderRadius:4, overflow:"hidden" }}>
                      <div style={{
                        height:"100%", borderRadius:4, transition:"width .1s",
                        width:`${micMuted?0:audioLevel}%`,
                        background:audioLevel > 85 ? "#ef4444" : audioLevel > 70 ? "#f59e0b" : "#10b981"
                      }}/>
                    </div>
                    <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10, fontWeight:700, color:micMuted?"#374151":audioLevel>85?"#ef4444":audioLevel>70?"#f59e0b":"#10b981", width:28, textAlign:"right" }}>
                      {micMuted ? "MUTE" : `${audioLevel}%`}
                    </span>
                  </div>
                  <div style={{ display:"flex", gap:8 }}>
                    <button onClick={()=>setMicMuted(m=>!m)}
                      style={{ flex:1, padding:"6px", background:micMuted?"#2d0808":"#0a1e16", border:`1px solid ${micMuted?"#ef444433":"#10b98133"}`, borderRadius:7, cursor:"pointer", fontSize:10, fontWeight:700, color:micMuted?"#ef4444":"#10b981" }}>
                      {micMuted ? "🔇 Unmute" : "🎙 Mute"}
                    </button>
                    <div style={{ padding:"6px 10px", background:"#0a0a14", border:"1px solid #1e1e3a", borderRadius:7, fontSize:10, color:C.muted, display:"flex", alignItems:"center" }}>
                      Ch A+B · Gain +0dB
                    </div>
                  </div>
                </div>
              </div>

              {/* ── LIGHTING ── */}
              <div style={{ marginBottom:20 }}>
                <div style={{ fontSize:10, fontWeight:700, color:C.muted, textTransform:"uppercase", letterSpacing:".08em", marginBottom:10 }}>Lighting</div>
                <div style={{ background:"#0a0a14", border:"1px solid #1e1e3a", borderRadius:10, padding:"12px 14px" }}>

                  {/* Header */}
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
                    <span style={{ fontSize:11, fontWeight:600, color:C.text }}>💡 Elgato Key Light</span>
                    <span style={{ fontSize:9, fontWeight:700, color:"#10b981" }}>● Connected</span>
                  </div>

                  {/* Brightness */}
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
                    <span style={{ fontSize:9, color:C.muted, width:56 }}>Brightness</span>
                    <input type="range" min={0} max={100} value={lightBrightness} onChange={e=>setLightBrightness(+e.target.value)}
                      style={{ flex:1, accentColor:"#a78bfa" }}/>
                    <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:9, color:"#a78bfa", width:28, textAlign:"right" }}>{lightBrightness}%</span>
                  </div>

                  {/* Color temp */}
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12 }}>
                    <span style={{ fontSize:9, color:C.muted, width:56 }}>Temp</span>
                    <input type="range" min={2900} max={7000} step={100} value={lightTemp} onChange={e=>setLightTemp(+e.target.value)}
                      style={{ flex:1, accentColor:"#f59e0b" }}/>
                    <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:9, color:"#f59e0b", width:40, textAlign:"right" }}>{lightTemp}K</span>
                  </div>

                  {/* Temp presets */}
                  <div style={{ display:"flex", gap:6, marginBottom:14 }}>
                    {[
                      { label:"Warm",    bright:70, temp:3200 },
                      { label:"Daylight",bright:85, temp:5600 },
                      { label:"Cool",    bright:90, temp:7000 },
                    ].map(p=>(
                      <button key={p.label} onClick={()=>{ setLightBrightness(p.bright); setLightTemp(p.temp); setLightColor(null); setLightPattern(null); }}
                        style={{ flex:1, padding:"5px 0", background:"#0d0d1a", border:"1px solid #1e1e3a", borderRadius:7, cursor:"pointer", fontSize:9, fontWeight:600, color:C.muted }}>
                        {p.label}
                      </button>
                    ))}
                  </div>

                  {/* Divider */}
                  <div style={{ height:1, background:"#1e1e3a", marginBottom:14 }}/>

                  {/* Color label + swatch preview */}
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
                    <span style={{ fontSize:9, fontWeight:700, color:C.muted, textTransform:"uppercase", letterSpacing:".08em" }}>Color</span>
                    <div style={{ display:"flex", alignItems:"center", gap:7 }}>
                      {lightColor && (
                        <button onClick={()=>setLightColor(null)} style={{ fontSize:8, color:C.muted, background:"none", border:"none", cursor:"pointer" }}>✕ clear</button>
                      )}
                      <div style={{ width:22, height:22, borderRadius:6, border:"1.5px solid #2a2a3a",
                        background: lightColor ? `hsl(${lightColor},100%,55%)` : `linear-gradient(135deg,#3b1f6a,#4a3a00)`,
                        boxShadow: lightColor ? `0 0 10px hsl(${lightColor},100%,55%)66` : "none",
                        transition:"all .2s"
                      }}/>
                    </div>
                  </div>

                  {/* Rainbow hue slider */}
                  <div style={{ position:"relative", marginBottom:10 }}>
                    <div style={{ height:10, borderRadius:6, marginBottom:6,
                      background:"linear-gradient(to right,#ff0000,#ff8800,#ffff00,#00ff00,#00ffff,#0088ff,#8800ff,#ff00ff,#ff0000)"
                    }}/>
                    <input type="range" min={0} max={360} value={lightColor ?? 0}
                      onChange={e=>{ setLightColor(+e.target.value); setLightPattern(null); }}
                      style={{ position:"absolute", top:-2, left:0, width:"100%", opacity:0, cursor:"pointer", height:14 }}/>
                    {lightColor !== null && (
                      <div style={{
                        position:"absolute", top:-4, left:`calc(${(lightColor/360)*100}% - 9px)`,
                        width:18, height:18, borderRadius:"50%", border:"2.5px solid #fff",
                        background:`hsl(${lightColor},100%,55%)`,
                        boxShadow:`0 0 8px hsl(${lightColor},100%,55%)`,
                        pointerEvents:"none", transition:"left .05s"
                      }}/>
                    )}
                  </div>
                  <div style={{ display:"flex", gap:5, marginBottom:14 }}>
                    {[
                      { label:"Red",    hue:0   },
                      { label:"Orange", hue:25  },
                      { label:"Yellow", hue:55  },
                      { label:"Green",  hue:130 },
                      { label:"Cyan",   hue:190 },
                      { label:"Blue",   hue:220 },
                      { label:"Purple", hue:270 },
                      { label:"Pink",   hue:320 },
                    ].map(c=>(
                      <button key={c.label} onClick={()=>{ setLightColor(c.hue); setLightPattern(null); }}
                        style={{ flex:1, height:18, borderRadius:4, border: lightColor===c.hue ? "2px solid #fff" : "1.5px solid transparent",
                          background:`hsl(${c.hue},100%,55%)`,
                          boxShadow: lightColor===c.hue ? `0 0 8px hsl(${c.hue},100%,55%)` : "none",
                          cursor:"pointer", padding:0, transition:"all .12s"
                        }} title={c.label}/>
                    ))}
                  </div>

                  {/* Divider */}
                  <div style={{ height:1, background:"#1e1e3a", marginBottom:14 }}/>

                  {/* Patterns */}
                  <div style={{ fontSize:9, fontWeight:700, color:C.muted, textTransform:"uppercase", letterSpacing:".08em", marginBottom:8 }}>Patterns</div>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:6, marginBottom:14 }}>
                    {[
                      { id:"celebrate", emoji:"🎉", label:"Celebrate",  desc:"Rainbow cycle",  color:"#a78bfa" },
                      { id:"pulse",     emoji:"💜", label:"Pulse",       desc:"Breathe fade",   color:"#ec4899" },
                      { id:"strobe",    emoji:"⚡", label:"Strobe",      desc:"White flash",    color:"#e2e8f0" },
                      { id:"fire",      emoji:"🔥", label:"Fire",        desc:"Amber flicker",  color:"#f59e0b" },
                      { id:"police",    emoji:"🚨", label:"Alert",       desc:"Red/blue alt",   color:"#ef4444" },
                      { id:"sunrise",   emoji:"🌅", label:"Sunrise",     desc:"Warm fade-in",   color:"#fb923c" },
                    ].map(p=>{ const active=lightPattern===p.id; return (
                      <button key={p.id} onClick={()=>{ setLightPattern(active?null:p.id); setLightColor(null); }}
                        style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
                          padding:"10px 4px", gap:3,
                          background:active?`${p.color}18`:"#0d0d1a",
                          border:`1.5px solid ${active?p.color+"77":"#1e1e3a"}`,
                          borderRadius:10, cursor:"pointer", textAlign:"center", transition:"all .15s",
                          boxShadow:active?`0 0 12px ${p.color}44`:"none" }}>
                        <span style={{ fontSize:18, lineHeight:1 }}>{p.emoji}</span>
                        <span style={{ fontSize:10, fontWeight:700, color:active?p.color:C.text, lineHeight:1.2 }}>{p.label}</span>
                        <span style={{ fontSize:8, color:C.muted, lineHeight:1 }}>{p.desc}</span>
                        {active && <div style={{ display:"flex", gap:2, alignItems:"flex-end", height:8, marginTop:2 }}>
                          {[5,8,6].map((h,i)=><div key={i} style={{ width:2, height:h, background:p.color, borderRadius:1,
                            animation:`soundBar${i} .35s ease-in-out infinite alternate` }}/>)}
                        </div>}
                      </button>
                    );})}
                  </div>

                  {/* Aputure offline */}
                  <div style={{ padding:"7px 10px", background:"#0d0d1a", border:"1px solid #ef444422", borderRadius:7, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <span style={{ fontSize:10, color:"#4b5563" }}>🔆 Aputure 600d</span>
                    <span style={{ fontSize:9, fontWeight:700, color:"#ef4444" }}>● Disconnected</span>
                  </div>
                </div>
              </div>

              {/* ── SOUND ── */}
              <div style={{ marginBottom:8 }}>
                <div style={{ fontSize:10, fontWeight:700, color:C.muted, textTransform:"uppercase", letterSpacing:".08em", marginBottom:10 }}>Sound Effects</div>
                <div style={{ background:"#0a0a14", border:"1px solid #1e1e3a", borderRadius:10, padding:"12px 14px" }}>

                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:7 }}>
                    {[
                      { id:"airhorn",   emoji:"📯", label:"Air Horn",    desc:"Classic drop",       color:"#ef4444" },
                      { id:"ding",      emoji:"🔔", label:"Cha-Ching",   desc:"Sale bell",          color:"#10b981" },
                      { id:"crowd",     emoji:"🙌", label:"Crowd Cheer", desc:"Applause",           color:"#f59e0b" },
                      { id:"drumroll",  emoji:"🥁", label:"Drum Roll",   desc:"Build the hype",     color:"#a78bfa" },
                      { id:"confetti",  emoji:"🎊", label:"Party Horn",  desc:"Celebration blast",  color:"#ec4899" },
                      { id:"countdown", emoji:"⏱", label:"Countdown",   desc:"3-2-1 beeps",        color:"#38bdf8" },
                      { id:"vip",       emoji:"⭐", label:"VIP Arrival", desc:"Fanfare sting",      color:"#fbbf24" },
                      { id:"sold",      emoji:"🔨", label:"Sold!",        desc:"Auction gavel",      color:"#10b981" },
                    ].map(s=>{ const playing=soundPlaying===s.id; return (
                      <button key={s.id}
                        onClick={()=>{ setSoundPlaying(s.id); setTimeout(()=>setSoundPlaying(null),1800); }}
                        style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 12px",
                          background:playing?`${s.color}15`:"#0d0d1a",
                          border:`1.5px solid ${playing?s.color+"66":"#1e1e3a"}`,
                          borderRadius:10, cursor:"pointer", textAlign:"left", transition:"all .12s",
                          boxShadow:playing?`0 0 10px ${s.color}33`:"none",
                          transform:playing?"scale(0.97)":"scale(1)" }}>
                        <span style={{ fontSize:20, flexShrink:0 }}>{s.emoji}</span>
                        <div style={{ flex:1, minWidth:0 }}>
                          <div style={{ fontSize:11, fontWeight:700, color:playing?s.color:C.text, lineHeight:1, marginBottom:3 }}>{s.label}</div>
                          <div style={{ fontSize:9, color:C.muted, lineHeight:1 }}>{s.desc}</div>
                          {playing && <div style={{ display:"flex", gap:2, marginTop:5, alignItems:"flex-end", height:10 }}>
                            {[4,8,5,10,6,7].map((h,i)=><div key={i} style={{ width:2, height:h, background:s.color, borderRadius:1,
                              animation:`soundBar${i%3} .3s ease-in-out ${i*0.05}s infinite alternate` }}/>)}
                          </div>}
                        </div>
                      </button>
                    );})}
                  </div>

                  {/* Volume */}
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginTop:12, paddingTop:10, borderTop:`1px solid ${C.border}` }}>
                    <span style={{ fontSize:9, color:C.muted }}>🔊</span>
                    <input type="range" min={0} max={100} value={soundVolume} onChange={e=>setSoundVolume(+e.target.value)}
                      style={{ flex:1, accentColor:"#10b981" }}/>
                    <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:9, color:"#10b981", width:28, textAlign:"right" }}>{soundVolume}%</span>
                  </div>
                </div>
              </div>

            </div>
          )}


          {/* ── SCENE TAB ── */}
          {liveTab === "scene" && (
            <SceneTab
              activeScene={activeScene}
              lightPattern={lightPattern}
              lightColor={lightColor}
              lightTemp={lightTemp}
              micMuted={micMuted}
              audioLevel={audioLevel}
            />
          )}

          {/* ── CATALOG TAB ── */}
          {liveTab === "catalog" && (
            <CatalogTab
              liveRunOrder={liveRunOrder}
              setLiveRunOrder={setLiveRunOrder}
              productTimings={productTimings}
              setProductTimings={setProductTimings}
              catalogSearch={catalogSearch}
              setCatalogSearch={setCatalogSearch}
              persona={params?.persona || personaProp}
            />
          )}

          {/* ── BRIEFING TAB ── */}
          {liveTab === "briefing" && (
            <BriefingTab
              runOrder={runOrder}
              showName={showName}
              productTimings={productTimings}
              showStartTime={showStartTime.current}
            />
          )}

          {/* ── PLATFORMS TAB ── */}
          {liveTab === "platforms" && (
            <div style={{ flex:1, overflowY:"auto", padding:"16px" }}>
              <div style={{ marginBottom:8 }}>
                <div style={{ fontSize:10, fontWeight:700, color:C.muted, textTransform:"uppercase", letterSpacing:".08em", marginBottom:10 }}>Platform Connections</div>

                {/* Overall stream health summary */}
                <div style={{ display:"flex", gap:8, marginBottom:12 }}>
                  <div style={{ flex:1, background:"#0a1e16", border:"1px solid #10b98133", borderRadius:8, padding:"8px 12px", textAlign:"center" }}>
                    <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:16, fontWeight:800, color:"#10b981" }}>
                      {selectedPlatforms.filter(p=>streamHealth[p]!==false).length}
                    </div>
                    <div style={{ fontSize:9, color:"#10b981", marginTop:2 }}>Live</div>
                  </div>
                  <div style={{ flex:1, background:"#1e0808", border:"1px solid #ef444433", borderRadius:8, padding:"8px 12px", textAlign:"center" }}>
                    <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:16, fontWeight:800, color:"#ef4444" }}>
                      {selectedPlatforms.filter(p=>streamHealth[p]===false).length}
                    </div>
                    <div style={{ fontSize:9, color:"#ef4444", marginTop:2 }}>Offline</div>
                  </div>
                  <div style={{ flex:1, background:"#0a0a14", border:"1px solid #1e1e3a", borderRadius:8, padding:"8px 12px", textAlign:"center" }}>
                    <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:16, fontWeight:800, color:"#38bdf8" }}>
                      {Object.values(platformViewers).reduce((a,v)=>a+v,0).toLocaleString()}
                    </div>
                    <div style={{ fontSize:9, color:"#38bdf8", marginTop:2 }}>Viewers</div>
                  </div>
                </div>

                {/* Per-platform rows */}
                <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                  {selectedPlatforms.map(pid => {
                    const pm      = PLATFORM_META_LIVE[pid] || { label:pid, color:"#6b7280", bitrate:"4 Mbps", latency:"1.2s" };
                    const up      = streamHealth[pid] !== false;
                    const viewers = platformViewers[pid] || 0;
                    return (
                      <div key={pid} style={{ background:"#0a0a14", border:`1px solid ${up?"#10b98122":"#ef444422"}`, borderRadius:12, overflow:"hidden" }}>
                        {/* Header row */}
                        <div style={{ display:"flex", alignItems:"center", gap:10, padding:"11px 14px" }}>
                          <div style={{ width:9, height:9, borderRadius:"50%", background:up?"#10b981":"#ef4444", flexShrink:0, boxShadow:up?"0 0 8px #10b98199":"0 0 8px #ef444499" }}/>
                          <div style={{ flex:1 }}>
                            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                              <span style={{ fontSize:13, fontWeight:700, color:pm.color }}>{pm.label}</span>
                              <span style={{ fontSize:9, fontWeight:800, color:up?"#10b981":"#ef4444", background:up?"#0a1e16":"#1e0808", border:`1px solid ${up?"#10b98133":"#ef444433"}`, padding:"2px 8px", borderRadius:4 }}>{up?"● LIVE":"✕ OFFLINE"}</span>
                            </div>
                          </div>
                          <button onClick={()=>setStreamHealth(prev=>({...prev,[pid]:!prev[pid]}))}
                            style={{ fontSize:9, fontWeight:700, color:up?"#ef4444":"#10b981", background:"transparent", border:`1px solid ${up?"#ef444433":"#10b98133"}`, padding:"4px 10px", borderRadius:6, cursor:"pointer" }}>
                            {up?"Disconnect":"Reconnect"}
                          </button>
                        </div>
                        {/* Stats row */}
                        <div style={{ display:"flex", borderTop:`1px solid ${C.border}` }}>
                          {[
                            { label:"Bitrate", value:pm.bitrate },
                            { label:"Latency", value:pm.latency },
                            { label:"Viewers", value:viewers >= 1000 ? (viewers/1000).toFixed(1)+"k" : viewers },
                          ].map((s,i)=>(
                            <div key={i} style={{ flex:1, padding:"7px 12px", borderRight:i<2?`1px solid ${C.border}`:"none" }}>
                              <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:11, fontWeight:700, color:C.text }}>{s.value}</div>
                              <div style={{ fontSize:9, color:C.muted, marginTop:1 }}>{s.label}</div>
                            </div>
                          ))}
                        </div>
                        {/* Instagram capture card note */}
                        {pid === "IG" && (
                          <div style={{ display:"flex", gap:8, padding:"8px 14px", background:"#1a0f0a", borderTop:"1px solid #f59e0b22" }}>
                            <span style={{ fontSize:10, color:"#f59e0b" }}>⚠</span>
                            <span style={{ fontSize:10, color:"#92400e", lineHeight:1.5 }}>Capture card → iPhone. Verify Cam Link is connected and Instagram Live is active on the dedicated device.</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* RTMP endpoint reference */}
                <div style={{ marginTop:16, background:"#07070f", border:"1px solid #1e1e3a", borderRadius:10, padding:"12px 14px" }}>
                  <div style={{ fontSize:10, fontWeight:700, color:C.muted, textTransform:"uppercase", letterSpacing:".08em", marginBottom:10 }}>RTMP Endpoints</div>
                  {[
                    { pid:"WN", rtmp:"rtmp://live.whatnot.com/app/[key]" },
                    { pid:"TT", rtmp:"rtmp://push.tiktokcdn.com/rtmp/[key]" },
                    { pid:"IG", rtmp:"rtmp://live-api-s.facebook.com/rtmp/[key]" },
                    { pid:"AM", rtmp:"rtmp://live.amazon.com/app/[key]" },
                    { pid:"YT", rtmp:"rtmp://a.rtmp.youtube.com/live2/[key]" },
                  ].filter(r=>selectedPlatforms.includes(r.pid)).map(r=>{
                    const pm = PLATFORM_META_LIVE[r.pid] || { label:r.pid, color:"#6b7280" };
                    return (
                      <div key={r.pid} style={{ display:"flex", gap:8, marginBottom:7, alignItems:"flex-start" }}>
                        <span style={{ fontSize:9, fontWeight:700, color:pm.color, width:24, flexShrink:0, marginTop:1 }}>{r.pid}</span>
                        <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:9, color:"#4b5563", wordBreak:"break-all", lineHeight:1.5 }}>{r.rtmp}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* ── RIGHT PANEL — BUYER CONTEXT ── */}
        <div style={{ width:320, display:"flex", flexDirection:"column", background:"#050508", flexShrink:0, minHeight:0, overflow:"hidden" }}>

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
                  { id:"message",  label:"Message"  },
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

                {/* MESSAGE */}
                {rightTab==="message" && (
                  <div>
                    <div style={{ fontSize:11, color:C.muted, marginBottom:14 }}>
                      Send a direct message to <strong style={{ color:C.text }}>{selectedBuyer?.name?.split(" ")[0]}</strong> with a link to the live shop page
                    </div>

                    {/* Channel selector */}
                    <div style={{ fontSize:10, fontWeight:700, color:C.muted, textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:8 }}>Send Via</div>
                    <div style={{ display:"flex", gap:6, marginBottom:16 }}>
                      {[
                        { code:"sms",   label:"SMS",       icon:"💬", color:CHANNEL_META.sms.color,   bg:CHANNEL_META.sms.bg   },
                        { code:"ig_dm", label:"Instagram", icon:"📸", color:CHANNEL_META.ig_dm.color, bg:CHANNEL_META.ig_dm.bg },
                        { code:"tt_dm", label:"TikTok",    icon:"🎵", color:CHANNEL_META.tt_dm.color, bg:CHANNEL_META.tt_dm.bg },
                      ].map(ch=>(
                        <button
                          key={ch.code}
                          onClick={()=>{ setMsgChannel(ch.code); setMsgText(MSG_TEMPLATES[ch.code] || ""); setMsgSent(false); }}
                          style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:4, padding:"8px 4px", background:msgChannel===ch.code?ch.bg:C.surface, border:`1px solid ${msgChannel===ch.code?ch.color+"66":C.border}`, borderRadius:9, cursor:"pointer", transition:"all .12s" }}
                        >
                          <span style={{ fontSize:14 }}>{ch.icon}</span>
                          <span style={{ fontSize:9, fontWeight:700, color:msgChannel===ch.code?ch.color:C.muted }}>{ch.label}</span>
                        </button>
                      ))}
                    </div>

                    {/* Live shop link preview */}
                    <div style={{ background:"#0a0a18", border:"1px solid #10b98133", borderRadius:10, padding:"10px 12px", marginBottom:12 }}>
                      <div style={{ fontSize:9, fontWeight:700, color:"#10b981", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:4 }}>Live Shop Link</div>
                      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                        <div style={{ width:6, height:6, borderRadius:"50%", background:"#ef4444", animation:"pulse 1s infinite", flexShrink:0 }}/>
                        <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10, color:"#a78bfa" }}>{liveShopUrl}</span>
                        <button
                          onClick={()=>navigate("live-shop", {...params, persona:params?.persona, productTimings, showStartTime:showStartTime.current})}
                          style={{ marginLeft:"auto", fontSize:9, fontWeight:700, color:C.muted, background:"none", border:"none", cursor:"pointer", whiteSpace:"nowrap" }}
                        >
                          Preview ↗
                        </button>
                      </div>
                      {/* Mini product lineup */}
                      <div style={{ marginTop:8, display:"flex", flexDirection:"column", gap:4 }}>
                        {runOrder.slice(0,4).map((p,i)=>(
                          <div key={p.id} style={{ display:"flex", alignItems:"center", gap:7, padding:"5px 7px", background:"#0d0d1e", borderRadius:7 }}>
                            <span style={{ fontSize:9, fontWeight:700, color:"#374151", width:10 }}>{i+1}</span>
                            <span style={{ fontSize:11 }}>{p.image}</span>
                            <span style={{ fontSize:10, color:"#9ca3af", flex:1, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{p.name}</span>
                            <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:9, color:C.green }}>${p.price}</span>
                          </div>
                        ))}
                        {runOrder.length > 4 && (
                          <div style={{ fontSize:9, color:C.subtle, textAlign:"center", padding:"3px 0" }}>+{runOrder.length - 4} more products</div>
                        )}
                      </div>
                    </div>

                    {/* Message composer */}
                    <div style={{ fontSize:10, fontWeight:700, color:C.muted, textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:6 }}>Message</div>
                    <textarea
                      rows={5}
                      value={msgText || MSG_TEMPLATES[msgChannel] || ""}
                      onChange={e=>setMsgText(e.target.value)}
                      placeholder="Type your message..."
                      style={{ width:"100%", background:C.surface2, border:`1px solid ${C.border2}`, borderRadius:9, padding:"10px 12px", color:C.text, fontSize:11, outline:"none", resize:"none", fontFamily:"'DM Sans',sans-serif", lineHeight:1.6, boxSizing:"border-box" }}
                    />
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:4, marginBottom:10 }}>
                      <span style={{ fontSize:9, color:C.subtle }}>{(msgText || MSG_TEMPLATES[msgChannel] || "").length} chars</span>
                      <button
                        onClick={()=>setMsgText(MSG_TEMPLATES[msgChannel] || "")}
                        style={{ fontSize:9, color:C.muted, background:"none", border:"none", cursor:"pointer" }}
                      >
                        Reset template
                      </button>
                    </div>

                    {/* Send button */}
                    <button
                      onClick={sendMessage}
                      style={{ width:"100%", padding:"10px", background:msgSent?"#0a1e16":`linear-gradient(135deg,${CHANNEL_META[msgChannel]?.color || C.accent},${CHANNEL_META[msgChannel]?.color || C.accent}cc)`, border:`1px solid ${msgSent?"#10b98166":CHANNEL_META[msgChannel]?.color+"44" || C.border}`, borderRadius:9, color:msgSent?"#10b981":"#fff", fontSize:12, fontWeight:700, cursor:"pointer", transition:"all .2s" }}
                    >
                      {msgSent ? `✓ Message sent via ${CHANNEL_META[msgChannel]?.label}` : `Send via ${CHANNEL_META[msgChannel]?.label} →`}
                    </button>

                    <div style={{ marginTop:8, fontSize:9, color:C.subtle, lineHeight:1.5 }}>
                      {msgChannel==="sms" ? `Sends to ${selectedBuyer?.name?.split(" ")[0]}'s phone number on file` : `Sends to ${selectedBuyer?.name?.split(" ")[0]}'s ${CHANNEL_META[msgChannel]?.label} via ManyChat`}
                    </div>
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
                            style={{ fontSize:9, fontWeight:700, color:"#fff", background:savedFeedback===("item_"+p.id)?C.green:C.accent, border:"none", padding:"3px 8px", borderRadius:5, cursor:"pointer", marginTop:2 }}
                          >
                            + Add
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* DISCOUNT + PROFIT GUARD */}
                {rightTab==="discount" && (() => {
                  // ── Determine products in this buyer's cart ──────────────────
                  const cartProductIds = buyerItems[selectedBuyer.id] || [];
                  const cartProducts   = PRODUCTS.filter(p => cartProductIds.includes(p.id));
                  // If cart is empty, use the first show-ready product as a preview
                  const guardProducts  = cartProducts.length > 0 ? cartProducts : PRODUCTS.filter(p=>p.showReady).slice(0,1);
                  const activePlatform = selectedPlatforms[0] || "WN";
                  const fee            = PLATFORM_FEES[activePlatform] || 0;

                  // ── Per-order profit at current discount ─────────────────────
                  const orderStats = guardProducts.map(p => {
                    const cp = calcProfit(p.price, p.cost || 0, currentDiscount, activePlatform);
                    return { ...p, ...cp };
                  });
                  const hasCost    = guardProducts.every(p => p.cost && p.cost > 0);
                  const avgMargin  = hasCost && orderStats.length > 0
                    ? orderStats.reduce((a,p) => a + p.margin, 0) / orderStats.length : null;
                  const maxSafeDiscs = hasCost
                    ? guardProducts.map(p => calcMaxSafeDisc(p.price, p.cost||0, activePlatform))
                    : [];
                  const maxSafeDisc = maxSafeDiscs.length > 0 ? Math.min(...maxSafeDiscs) : 100;
                  const isSafe      = currentDiscount <= maxSafeDisc;
                  const isAtLoss    = avgMargin !== null && avgMargin < 0;
                  const isBelowMin  = avgMargin !== null && avgMargin >= 0 && avgMargin < DEFAULT_MIN_MARGIN;
                  const mc          = hasCost && avgMargin !== null ? marginColor(avgMargin) : C.muted;
                  const ml          = hasCost && avgMargin !== null ? marginLabel(avgMargin) : "—";

                  return (
                    <div>
                      {/* ── PROFIT GUARD PANEL ─────────────────────────────── */}
                      {hasCost ? (
                        <div style={{ background: isAtLoss?"#1a0808":isBelowMin?"#1a1100":"#071410", border:`1px solid ${mc}44`, borderRadius:12, padding:"12px 14px", marginBottom:14 }}>
                          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10 }}>
                            <div style={{ display:"flex", alignItems:"center", gap:7 }}>
                              <span style={{ fontSize:14 }}>{isAtLoss?"🚨":isBelowMin?"⚠️":"🛡️"}</span>
                              <div>
                                <div style={{ fontSize:11, fontWeight:700, color:mc }}>Profit Guard</div>
                                <div style={{ fontSize:9, color:C.muted }}>Via Shopify cost data · {activePlatform} {(fee*100).toFixed(0)}% fee</div>
                              </div>
                            </div>
                            <div style={{ textAlign:"right" }}>
                              <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:16, fontWeight:800, color:mc }}>
                                {avgMargin !== null ? `${(avgMargin*100).toFixed(1)}%` : "—"}
                              </div>
                              <div style={{ fontSize:8, fontWeight:700, color:mc, textTransform:"uppercase", letterSpacing:"0.06em" }}>{ml}</div>
                            </div>
                          </div>

                          {/* Margin bar */}
                          <div style={{ height:5, background:C.surface2, borderRadius:3, overflow:"hidden", marginBottom:6, position:"relative" }}>
                            {/* Min margin threshold marker */}
                            <div style={{ position:"absolute", left:`${DEFAULT_MIN_MARGIN*100}%`, top:0, bottom:0, width:2, background:"#f59e0b", zIndex:2, borderRadius:1 }}/>
                            {avgMargin !== null && (
                              <div style={{ height:"100%", width:`${Math.max(0,Math.min(100,avgMargin*100))}%`, background:mc, borderRadius:3, transition:"width .25s ease" }}/>
                            )}
                          </div>
                          <div style={{ display:"flex", justifyContent:"space-between", fontSize:8, color:C.subtle, marginBottom:10 }}>
                            <span>0% (loss)</span>
                            <span style={{ color:"#f59e0b" }}>▲ {(DEFAULT_MIN_MARGIN*100).toFixed(0)}% min</span>
                            <span>100%</span>
                          </div>

                          {/* Per-product breakdown */}
                          {orderStats.map(p => (
                            <div key={p.id} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:5, padding:"6px 8px", background:"#ffffff08", borderRadius:7 }}>
                              <span style={{ fontSize:12 }}>{p.image}</span>
                              <div style={{ flex:1, minWidth:0 }}>
                                <div style={{ fontSize:9, fontWeight:600, color:C.text, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{p.name}</div>
                                <div style={{ fontSize:8, color:C.muted }}>
                                  Cost <span style={{ fontFamily:"'JetBrains Mono',monospace", color:C.text }}>${p.cost}</span>
                                  {" · "}Net <span style={{ fontFamily:"'JetBrains Mono',monospace", color:marginColor(p.margin) }}>${p.profit.toFixed(0)}</span>
                                </div>
                              </div>
                              <div style={{ textAlign:"right", flexShrink:0 }}>
                                <div style={{ fontSize:10, fontFamily:"'JetBrains Mono',monospace", fontWeight:700, color:marginColor(p.margin) }}>
                                  {(p.margin*100).toFixed(1)}%
                                </div>
                                <div style={{ fontSize:8, color:C.muted, textDecoration:"line-through" }}>${p.price}</div>
                                <div style={{ fontSize:8, color:C.green }}>→ ${p.discPrice.toFixed(0)}</div>
                              </div>
                            </div>
                          ))}

                          {/* Safe discount callout */}
                          {currentDiscount === 0 && (
                            <div style={{ fontSize:9, color:C.muted, marginTop:6, padding:"5px 8px", background:"#ffffff06", borderRadius:6 }}>
                              Max safe discount: <span style={{ color:"#10b981", fontWeight:700, fontFamily:"'JetBrains Mono',monospace" }}>{maxSafeDisc}%</span>
                              <span style={{ color:C.subtle }}> (keeps {(DEFAULT_MIN_MARGIN*100).toFixed(0)}% margin after {activePlatform} fee)</span>
                            </div>
                          )}
                          {isAtLoss && (
                            <div style={{ fontSize:10, fontWeight:700, color:"#ef4444", background:"#ef444415", border:"1px solid #ef444433", borderRadius:7, padding:"7px 10px", marginTop:8 }}>
                              🚨 Selling at a loss — cost exceeds net revenue at this discount
                            </div>
                          )}
                          {isBelowMin && !isAtLoss && (
                            <div style={{ fontSize:10, fontWeight:700, color:"#f59e0b", background:"#f59e0b12", border:"1px solid #f59e0b33", borderRadius:7, padding:"7px 10px", marginTop:8 }}>
                              ⚠ Below minimum margin — consider max {maxSafeDisc}% discount instead
                            </div>
                          )}
                        </div>
                      ) : (
                        <div style={{ background:C.surface2, border:`1px solid ${C.border2}`, borderRadius:10, padding:"10px 12px", marginBottom:14, display:"flex", gap:8, alignItems:"center" }}>
                          <span style={{ fontSize:13 }}>📊</span>
                          <div style={{ fontSize:10, color:C.muted }}>Add products to cart to see <span style={{ color:C.text }}>profit guard</span> — connects to Shopify cost data</div>
                        </div>
                      )}

                      {/* ── DISCOUNT CONTROLS ──────────────────────────────── */}
                      <div style={{ fontSize:10, fontWeight:700, color:C.muted, textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:8 }}>
                        Quick Select
                        {hasCost && <span style={{ color:"#10b981", fontSize:8, fontWeight:700, marginLeft:6, textTransform:"none" }}>green = safe · amber = caution · red = below min</span>}
                      </div>
                      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:6, marginBottom:14 }}>
                        {[5,10,15,20,25,30,40,50].map(pct => {
                          const isSelected = currentDiscount === pct;
                          let btnColor = C.muted;
                          let btnBg    = C.surface;
                          let btnBorder= C.border;
                          if (hasCost) {
                            const testMargins = guardProducts.map(p => calcProfit(p.price, p.cost||0, pct, activePlatform).margin);
                            const worstMargin = Math.min(...testMargins);
                            btnColor  = marginColor(worstMargin);
                            btnBg     = isSelected ? btnColor : `${btnColor}12`;
                            btnBorder = `${btnColor}${isSelected?"":"55"}`;
                          }
                          return (
                            <button key={pct} onClick={()=>setBuyerDiscounts(prev=>({...prev,[selectedBuyer.id]:pct}))}
                              style={{ background:isSelected?btnColor:btnBg, border:`1px solid ${btnBorder}`, color:isSelected?"#fff":hasCost?btnColor:C.text, fontSize:12, fontWeight:700, padding:"8px 4px", borderRadius:8, cursor:"pointer", transition:"all .15s" }}>
                              {pct}%
                            </button>
                          );
                        })}
                      </div>

                      {/* Custom amount */}
                      <div style={{ fontSize:10, fontWeight:700, color:C.muted, textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:8 }}>Custom Amount</div>
                      <div style={{ display:"flex", gap:8, marginBottom:14 }}>
                        <input type="number" min={0} max={100}
                          value={currentDiscount||""}
                          onChange={e=>setBuyerDiscounts(prev=>({...prev,[selectedBuyer.id]:Math.min(100,Number(e.target.value))}))}
                          placeholder="0"
                          style={{ flex:1, background:C.surface2, border:`1px solid ${hasCost&&!isSafe?"#ef444466":C.border2}`, borderRadius:8, padding:"9px 12px", color:hasCost&&!isSafe?"#ef4444":C.text, fontSize:14, fontWeight:700, outline:"none", textAlign:"center", fontFamily:"'JetBrains Mono',monospace" }}
                        />
                        <div style={{ display:"flex", alignItems:"center", justifyContent:"center", width:36, fontSize:16, color:C.muted }}>%</div>
                      </div>

                      {/* Reason */}
                      <div style={{ fontSize:10, fontWeight:700, color:C.muted, textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:8 }}>Reason</div>
                      <div style={{ display:"flex", gap:5, flexWrap:"wrap", marginBottom:14 }}>
                        {["VIP loyalty","New buyer","At-risk win-back","Show special","Apology"].map(r => {
                          const isActive = currentPerks["discountReason"]===r;
                          return (
                            <button key={r} onClick={()=>setBuyerPerks(prev=>({...prev,[selectedBuyer.id]:{...(prev[selectedBuyer.id]||{}),discountReason:r}}))}
                              style={{ fontSize:10, fontWeight:isActive?700:400, color:isActive?"#fff":C.muted, background:isActive?C.accent:C.surface, border:`1px solid ${isActive?C.accent:C.border}`, padding:"4px 10px", borderRadius:6, cursor:"pointer" }}>
                              {r}
                            </button>
                          );
                        })}
                      </div>

                      {/* Apply button */}
                      <button onClick={applyDiscount}
                        style={{ width:"100%", background: savedFeedback==="discount" ? C.green : isAtLoss ? "#7f1d1d" : isBelowMin ? "#92400e" : `linear-gradient(135deg,${C.accent},${C.accent2})`,
                          border:"none", color:"#fff", fontSize:13, fontWeight:700, padding:"11px", borderRadius:9, cursor:"pointer", transition:"background .2s" }}>
                        {savedFeedback==="discount" ? "✓ Discount Applied!" : currentDiscount > 0 ? `Apply ${currentDiscount}% Discount` : "Set a Discount First"}
                      </button>

                      {currentDiscount > 0 && (
                        <button onClick={()=>setBuyerDiscounts(prev=>({...prev,[selectedBuyer.id]:0}))}
                          style={{ width:"100%", marginTop:6, background:"none", border:`1px solid ${C.border}`, color:C.muted, fontSize:11, fontWeight:600, padding:"7px", borderRadius:8, cursor:"pointer" }}>
                          Clear Discount
                        </button>
                      )}
                    </div>
                  );
                })()}

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
  const [mainTab, setMainTab] = useState("broadcasts");

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100%", overflow:"hidden" }}>
      <div style={{ padding:"20px 32px 0", borderBottom:`1px solid ${C.border}`, background:C.surface, flexShrink:0 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:16 }}>
          <div>
            <div style={{ fontFamily:"'Syne',sans-serif", fontSize:22, fontWeight:800, color:C.text, letterSpacing:"-0.5px" }}>Campaigns</div>
            <div style={{ fontSize:12, color:C.muted, marginTop:4 }}>Broadcast messages and keyword-triggered DM automations</div>
          </div>
          {mainTab === "broadcasts"
            ? <button onClick={()=>navigate("composer")} style={{ background:`linear-gradient(135deg,${C.accent},${C.accent2})`, border:"none", color:"#fff", fontSize:12, fontWeight:700, padding:"9px 20px", borderRadius:9, cursor:"pointer" }}>+ New Broadcast</button>
            : null
          }
        </div>
        <div style={{ display:"flex", gap:0 }}>
          {[["broadcasts","Broadcasts"],["automations","Keyword Automations"]].map(([v,l])=>(
            <button key={v} onClick={()=>setMainTab(v)} style={{ background:"none", border:"none", borderBottom:`2px solid ${mainTab===v?C.accent:"transparent"}`, color:mainTab===v?C.text:C.muted, fontSize:13, fontWeight:mainTab===v?700:400, padding:"0 20px 12px", cursor:"pointer" }}>{l}</button>
          ))}
        </div>
      </div>
      <div style={{ flex:1, overflowY:"auto" }}>
        {mainTab === "broadcasts" && <BroadcastsTab navigate={navigate} persona={persona} />}
        {mainTab === "automations" && <KeywordAutomationsTab persona={persona} />}
      </div>
    </div>
  );
}

function BroadcastsTab({ navigate, persona }) {
  const [filterType, setFilterType] = useState("all");
  const filtered = filterType==="all" ? CAMPAIGNS : CAMPAIGNS.filter(c=>c.type===filterType);
  const totalGMV     = CAMPAIGNS.filter(c=>c.status==="sent").reduce((a,c)=>a+c.gmv,0);
  const totalSent    = CAMPAIGNS.filter(c=>c.status==="sent").reduce((a,c)=>a+c.recipients,0);
  const avgOpen      = Math.round(CAMPAIGNS.filter(c=>c.opened>0).reduce((a,c,_,arr)=>a+c.opened/arr.length,0));
  const avgConverted = CAMPAIGNS.filter(c=>c.converted>0).reduce((a,c,_,arr)=>a+c.converted/arr.length,0).toFixed(0);

  return (
    <div style={{ padding:"24px 32px" }}>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:20 }}>
        <StatCard label="Total Sent"      value={totalSent.toLocaleString()} sub="all channels"        color={C.blue}   />
        <StatCard label="Avg Open Rate"   value={`${avgOpen}%`}              sub="across all channels" color={C.green}  />
        <StatCard label="Avg Conversions" value={avgConverted}               sub="per campaign"        color={C.accent} />
        <StatCard label="Revenue Driven"  value={`$${totalGMV.toLocaleString()}`} sub="attributed GMV" color={C.amber}  />
      </div>
      <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:14, padding:"16px 20px", marginBottom:20 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
          <div style={{ fontSize:12, fontWeight:700, color:C.text }}>Connected Channels</div>
          <button onClick={()=>navigate("settings")} style={{ fontSize:11, color:C.accent, background:"none", border:"none", cursor:"pointer" }}>Manage</button>
        </div>
        <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
          {Object.entries(CHANNEL_META).map(([key,ch])=>{
            const connected = ["email","sms","ig_dm","tt_dm"].includes(key);
            return (
              <div key={key} style={{ display:"flex", alignItems:"center", gap:7, background:connected?ch.bg:C.surface2, border:`1px solid ${connected?ch.color+"44":C.border}`, borderRadius:9, padding:"7px 12px" }}>
                <span style={{ fontSize:13 }}>{ch.icon}</span>
                <div>
                  <div style={{ fontSize:11, fontWeight:700, color:connected?ch.color:C.muted }}>{ch.label}</div>
                  <div style={{ fontSize:9, color:C.subtle }}>{connected?"Connected":ch.via==="ManyChat"?"Needs ManyChat":"Not connected"}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div style={{ display:"flex", gap:0, borderBottom:`1px solid ${C.border}`, marginBottom:16 }}>
        {[["all","All"],["email","Email"],["sms","SMS"],["ig_dm","Instagram DM"],["tt_dm","TikTok DM"],["wn_dm","Whatnot"],["am_msg","Amazon"]].map(([v,l])=>(
          <button key={v} onClick={()=>setFilterType(v)} style={{ background:"none", border:"none", borderBottom:`2px solid ${filterType===v?(CHANNEL_META[v]?.color||C.accent):"transparent"}`, color:filterType===v?(CHANNEL_META[v]?.color||"#a78bfa"):C.muted, fontSize:11, fontWeight:filterType===v?700:400, padding:"0 14px 10px", cursor:"pointer", whiteSpace:"nowrap" }}>{l}</button>
        ))}
      </div>
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
                <span style={{ fontSize:10, fontWeight:700, color:c.status==="sent"?C.green:C.amber, background:c.status==="sent"?"#0a1e16":"#2e1f0a", border:`1px solid ${c.status==="sent"?C.green+"44":C.amber+"44"}`, padding:"2px 7px", borderRadius:5, textTransform:"uppercase" }}>{c.status}</span>
              </div>
              <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:12, color:c.recipients>0?C.text:C.subtle }}>{c.recipients>0?c.recipients.toLocaleString():"--"}</div>
              <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:12, color:c.opened>0?C.green:C.subtle }}>{c.opened>0?`${c.opened}%`:"--"}</div>
              <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:12, color:c.converted>0?C.blue:C.subtle }}>{c.converted>0?c.converted:"--"}</div>
              <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:12, fontWeight:700, color:c.gmv>0?C.amber:C.subtle }}>{c.gmv>0?`$${c.gmv.toLocaleString()}`:"--"}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function KeywordAutomationsTab({ persona }) {
  const [automations, setAutomations] = useState(KEYWORD_AUTOMATIONS);
  const [selected, setSelected]       = useState(null);
  const [showBuilder, setShowBuilder] = useState(false);
  const [editTarget, setEditTarget]   = useState(null);

  const totalOptIns = automations.reduce((a,k)=>a+k.totalOptIns,0);
  const thisWeek    = automations.reduce((a,k)=>a+k.keywords.reduce((b,kw)=>b+kw.thisWeek,0),0);
  const activeCount = automations.filter(k=>k.status==="active").length;
  const totalKws    = automations.reduce((a,k)=>a+k.keywords.length,0);

  const openNew  = () => { setEditTarget(null); setShowBuilder(true); };
  const openEdit = (a) => { setEditTarget(a); setShowBuilder(true); setSelected(null); };

  const toggleStatus = (id) =>
    setAutomations(prev=>prev.map(a=>a.id===id?{...a,status:a.status==="active"?"paused":"active"}:a));

  const saveAutomation = (data) => {
    if (editTarget) {
      setAutomations(prev=>prev.map(a=>a.id===editTarget.id?{...a,...data,keywords:data.keywords.map(w=>{ const existing=editTarget.keywords.find(k=>k.word===w); return existing||{word:w,optIns:0,thisWeek:0}; })}:a));
    } else {
      const newA = { id:`ka${Date.now()}`, ...data, totalOptIns:0, byPlatform:{TT:0,IG:0}, createdAt:new Date().toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"}), keywords:data.keywords.map(w=>({word:w,optIns:0,thisWeek:0})) };
      setAutomations(prev=>[...prev,newA]);
    }
    setShowBuilder(false);
    setEditTarget(null);
  };

  return (
    <div style={{ padding:"24px 32px", position:"relative" }}>
      {/* HOW IT WORKS */}
      <div style={{ background:"linear-gradient(135deg,#0d2828,#2d1020)", border:"1px solid #1e3a3a", borderRadius:14, padding:"16px 20px", marginBottom:24, display:"flex", gap:20, alignItems:"center" }}>
        <div style={{ fontSize:28, flexShrink:0 }}>⚡</div>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:13, fontWeight:700, color:"#fff", marginBottom:4 }}>How keyword automations work</div>
          <div style={{ fontSize:12, color:"#9ca3af", lineHeight:1.6 }}>
            When someone DMs a trigger keyword to your TikTok or Instagram account, ManyChat instantly sends your auto-reply and adds them to your subscriber list.
            Multiple keywords per campaign lets you A/B test which words drive the most opt-ins.
          </div>
        </div>
        <div style={{ display:"flex", gap:8, flexShrink:0 }}>
          <div style={{ background:"#0d282820", border:"1px solid #69c9d033", borderRadius:8, padding:"8px 14px", textAlign:"center" }}>
            <div style={{ fontSize:11, fontWeight:700, color:"#69c9d0" }}>TikTok DM</div>
            <div style={{ fontSize:9, color:"#9ca3af", marginTop:2 }}>via ManyChat</div>
          </div>
          <div style={{ background:"#2d102018", border:"1px solid #e1306c33", borderRadius:8, padding:"8px 14px", textAlign:"center" }}>
            <div style={{ fontSize:11, fontWeight:700, color:"#e1306c" }}>Instagram DM</div>
            <div style={{ fontSize:9, color:"#9ca3af", marginTop:2 }}>via ManyChat</div>
          </div>
        </div>
      </div>

      {/* KPI */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:24 }}>
        <StatCard label="Total Opt-Ins"   value={totalOptIns.toLocaleString()} sub="across all automations"          color={C.green}  />
        <StatCard label="This Week"       value={thisWeek}                     sub="new opt-ins"                     color={C.blue}   />
        <StatCard label="Active"          value={activeCount}                  sub={`of ${automations.length} automations`} color={C.accent} />
        <StatCard label="Avg / Keyword"   value={totalKws>0?Math.round(totalOptIns/totalKws):0} sub="opt-ins per trigger word" color={C.amber} />
      </div>

      {/* LIST HEADER */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
        <div style={{ fontSize:13, fontWeight:700, color:C.text }}>Your Automations <span style={{ fontWeight:400, color:C.muted, fontSize:12 }}>({automations.length})</span></div>
        <button onClick={openNew} style={{ background:"linear-gradient(135deg,#f43f5e,#ec4899)", border:"none", color:"#fff", fontSize:12, fontWeight:700, padding:"8px 18px", borderRadius:9, cursor:"pointer" }}>+ New Automation</button>
      </div>

      {/* CARDS */}
      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {automations.map(a => {
          const goal  = GOAL_META[a.goal] || GOAL_META.list_growth;
          const isOpen = selected === a.id;
          const topKw  = [...a.keywords].sort((x,y)=>y.optIns-x.optIns)[0];
          const weekTotal = a.keywords.reduce((s,k)=>s+k.thisWeek,0);
          return (
            <div key={a.id} style={{ background:C.surface, border:`1px solid ${isOpen?C.accent+"55":C.border}`, borderRadius:14, overflow:"hidden", transition:"border-color .2s" }}>
              {/* HEADER ROW */}
              <div onClick={()=>setSelected(isOpen?null:a.id)} style={{ display:"flex", alignItems:"center", gap:16, padding:"16px 20px", cursor:"pointer" }}>
                {/* Goal icon */}
                <div style={{ width:40, height:40, borderRadius:10, background:goal.bg, border:`1px solid ${goal.color}33`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>{goal.icon}</div>

                {/* Name + meta */}
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
                    <span style={{ fontSize:13, fontWeight:700, color:C.text }}>{a.name}</span>
                    <span style={{ fontSize:9, fontWeight:700, color:goal.color, background:goal.bg, border:`1px solid ${goal.color}33`, padding:"2px 7px", borderRadius:5, textTransform:"uppercase", flexShrink:0 }}>{goal.label}</span>
                  </div>
                  <div style={{ display:"flex", gap:6, alignItems:"center", flexWrap:"wrap" }}>
                    {a.platforms.map(p=>(
                      <span key={p} style={{ fontSize:9, fontWeight:700, color:p==="TT"?"#69c9d0":"#e1306c", background:p==="TT"?"#0d282812":"#2d102012", border:`1px solid ${p==="TT"?"#69c9d033":"#e1306c33"}`, padding:"2px 7px", borderRadius:5 }}>{p==="TT"?"TikTok DM":"Instagram DM"}</span>
                    ))}
                    <span style={{ fontSize:10, color:C.subtle }}>·</span>
                    <div style={{ display:"flex", gap:4 }}>
                      {a.keywords.slice(0,4).map(kw=>(
                        <span key={kw.word} style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10, color:C.muted, background:C.surface2, border:`1px solid ${C.border}`, padding:"1px 6px", borderRadius:5 }}>{kw.word}</span>
                      ))}
                      {a.keywords.length>4 && <span style={{ fontSize:10, color:C.subtle }}>+{a.keywords.length-4}</span>}
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div style={{ textAlign:"center", minWidth:60 }}>
                  <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:18, fontWeight:700, color:C.green }}>{a.totalOptIns.toLocaleString()}</div>
                  <div style={{ fontSize:9, color:C.muted }}>total opt-ins</div>
                </div>
                <div style={{ textAlign:"center", minWidth:52 }}>
                  <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:18, fontWeight:700, color:weekTotal>0?C.blue:C.subtle }}>{weekTotal}</div>
                  <div style={{ fontSize:9, color:C.muted }}>this week</div>
                </div>

                {/* Status toggle */}
                <div onClick={e=>{e.stopPropagation();toggleStatus(a.id);}} style={{ display:"flex", alignItems:"center", gap:6, cursor:"pointer", flexShrink:0 }}>
                  <div style={{ width:36, height:20, borderRadius:10, background:a.status==="active"?C.green:C.border2, position:"relative", transition:"background .2s", flexShrink:0 }}>
                    <div style={{ position:"absolute", top:3, left:a.status==="active"?18:3, width:14, height:14, borderRadius:"50%", background:"#fff", transition:"left .2s" }} />
                  </div>
                  <span style={{ fontSize:10, fontWeight:700, color:a.status==="active"?C.green:C.muted, minWidth:36 }}>{a.status==="active"?"Live":"Off"}</span>
                </div>

                <div style={{ fontSize:11, color:C.muted, transform:isOpen?"rotate(180deg)":"none", transition:"transform .2s", flexShrink:0 }}>▼</div>
              </div>

              {/* EXPANDED */}
              {isOpen && (
                <div style={{ borderTop:`1px solid ${C.border}`, background:"#06060d" }}>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr" }}>

                    {/* LEFT: keyword breakdown */}
                    <div style={{ padding:"20px 24px", borderRight:`1px solid ${C.border}` }}>
                      <div style={{ fontSize:11, fontWeight:700, color:C.muted, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:14 }}>Keyword Performance</div>
                      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                        {[...a.keywords].sort((x,y)=>y.optIns-x.optIns).map((kw,i) => {
                          const pct    = a.totalOptIns>0?Math.round(kw.optIns/a.totalOptIns*100):0;
                          const maxOI  = Math.max(...a.keywords.map(k=>k.optIns), 1);
                          const barPct = (kw.optIns/maxOI)*100;
                          return (
                            <div key={kw.word}>
                              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:5 }}>
                                <div style={{ display:"flex", alignItems:"center", gap:7 }}>
                                  {i===0 && <span style={{ fontSize:10 }}>🏆</span>}
                                  <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:13, fontWeight:700, color:C.text, background:C.surface, border:`1px solid ${C.border2}`, padding:"3px 10px", borderRadius:7 }}>{kw.word}</span>
                                  {kw.thisWeek>0 && <span style={{ fontSize:10, color:C.green }}>+{kw.thisWeek} this week</span>}
                                </div>
                                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                                  <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:14, fontWeight:700, color:C.text }}>{kw.optIns.toLocaleString()}</span>
                                  <span style={{ fontSize:10, color:C.subtle, minWidth:30, textAlign:"right" }}>{pct}%</span>
                                </div>
                              </div>
                              <div style={{ height:5, background:C.surface2, borderRadius:3 }}>
                                <div style={{ height:"100%", width:`${barPct}%`, background:`linear-gradient(90deg,${C.accent},${C.accent2})`, borderRadius:3, transition:"width .5s" }} />
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Platform split */}
                      <div style={{ marginTop:20, paddingTop:16, borderTop:`1px solid ${C.border}` }}>
                        <div style={{ fontSize:11, fontWeight:700, color:C.muted, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:10 }}>Platform Split</div>
                        <div style={{ display:"flex", gap:10 }}>
                          {a.platforms.includes("TT") && (
                            <div style={{ flex:1, background:"#0d282814", border:"1px solid #69c9d033", borderRadius:10, padding:"12px", textAlign:"center" }}>
                              <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:20, fontWeight:700, color:"#69c9d0" }}>{a.byPlatform.TT}</div>
                              <div style={{ fontSize:10, color:"#9ca3af", marginTop:3 }}>TikTok DM</div>
                              <div style={{ fontSize:9, color:"#4b5563", marginTop:2 }}>{a.totalOptIns>0?Math.round((a.byPlatform.TT||0)/a.totalOptIns*100):0}%</div>
                            </div>
                          )}
                          {a.platforms.includes("IG") && (
                            <div style={{ flex:1, background:"#2d102014", border:"1px solid #e1306c33", borderRadius:10, padding:"12px", textAlign:"center" }}>
                              <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:20, fontWeight:700, color:"#e1306c" }}>{a.byPlatform.IG}</div>
                              <div style={{ fontSize:10, color:"#9ca3af", marginTop:3 }}>Instagram DM</div>
                              <div style={{ fontSize:9, color:"#4b5563", marginTop:2 }}>{a.totalOptIns>0?Math.round((a.byPlatform.IG||0)/a.totalOptIns*100):0}%</div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* RIGHT: preview + actions */}
                    <div style={{ padding:"20px 24px" }}>
                      <div style={{ fontSize:11, fontWeight:700, color:C.muted, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:12 }}>Auto-Reply Preview</div>
                      <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, padding:"14px 16px", marginBottom:16 }}>
                        <div style={{ fontSize:10, color:C.subtle, marginBottom:8 }}>Someone DMs: <span style={{ fontFamily:"'JetBrains Mono',monospace", color:C.text }}>"{topKw?.word}"</span></div>
                        <div style={{ width:1, height:10, background:C.border, margin:"0 0 8px 10px" }} />
                        <div style={{ display:"flex", gap:8, alignItems:"flex-start" }}>
                          <div style={{ width:26, height:26, borderRadius:"50%", background:`${C.accent}22`, border:`1px solid ${C.accent}44`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:700, color:C.accent, flexShrink:0, marginTop:1 }}>S</div>
                          <div style={{ background:C.surface2, borderRadius:"3px 10px 10px 10px", padding:"10px 13px", fontSize:12, color:C.text, lineHeight:1.6 }}>
                            {a.reply.replace("{first_name}","Alex").replace("{shop_name}","Banana Republic")}
                          </div>
                        </div>
                      </div>
                      <div style={{ fontSize:11, color:C.subtle, marginBottom:6, lineHeight:1.5 }}>
                        Created {a.createdAt}
                      </div>
                      <div style={{ display:"flex", gap:8, marginTop:16 }}>
                        <button onClick={()=>openEdit(a)} style={{ flex:1, background:C.surface2, border:`1px solid ${C.border2}`, color:C.text, fontSize:12, fontWeight:600, padding:"9px", borderRadius:9, cursor:"pointer" }}>Edit</button>
                        <button onClick={()=>toggleStatus(a.id)} style={{ flex:1, background:a.status==="active"?"#2d120814":"#0a1e1614", border:`1px solid ${a.status==="active"?"#ef444433":C.green+"33"}`, color:a.status==="active"?"#ef4444":C.green, fontSize:12, fontWeight:600, padding:"9px", borderRadius:9, cursor:"pointer" }}>
                          {a.status==="active"?"Pause":"Activate"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* BUILDER MODAL */}
      {showBuilder && (
        <AutomationBuilder
          initial={editTarget}
          onSave={saveAutomation}
          onClose={()=>{ setShowBuilder(false); setEditTarget(null); }}
        />
      )}
    </div>
  );
}

function AutomationBuilder({ initial, onSave, onClose }) {
  const [name, setName]           = useState(initial?.name || "");
  const [platforms, setPlatforms] = useState(initial?.platforms || ["TT","IG"]);
  const [keywordList, setKeywordList] = useState(initial ? initial.keywords.map(k=>k.word) : []);
  const [reply, setReply]         = useState(initial?.reply || "");
  const [goal, setGoal]           = useState(initial?.goal || "list_growth");
  const [newKw, setNewKw]         = useState("");
  const [errors, setErrors]       = useState({});

  const togglePlatform = (p) =>
    setPlatforms(prev=>prev.includes(p)?prev.filter(x=>x!==p):[...prev,p]);

  const addKeyword = () => {
    const word = newKw.trim().toUpperCase().replace(/\s+/g,"_");
    if (!word || keywordList.includes(word)) return;
    setKeywordList(prev=>[...prev,word]);
    setNewKw("");
    setErrors(e=>({...e,keywords:null}));
  };

  const removeKeyword = (i) => setKeywordList(prev=>prev.filter((_,idx)=>idx!==i));

  const handleKeyDown = (e) => { if(e.key==="Enter"){ e.preventDefault(); addKeyword(); } };

  const validate = () => {
    const e = {};
    if (!name.trim()) e.name = "Campaign name is required";
    if (platforms.length===0) e.platforms = "Select at least one platform";
    if (keywordList.length===0) e.keywords = "Add at least one trigger keyword";
    if (!reply.trim()) e.reply = "Auto-reply message is required";
    return e;
  };

  const handleSave = () => {
    const e = validate();
    if (Object.keys(e).length){ setErrors(e); return; }
    onSave({ name, platforms, keywords:keywordList, reply, goal, status:initial?.status||"active" });
  };

  const preview = reply.replace(/\{first_name\}/g,"Alex").replace(/\{shop_name\}/g,"Banana Republic");

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.8)", zIndex:300, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }} onClick={onClose}>
      <div style={{ background:"#0a0a15", border:`1px solid ${C.border2}`, borderRadius:18, width:"100%", maxWidth:800, maxHeight:"92vh", overflowY:"auto", boxShadow:"0 32px 80px rgba(0,0,0,.8)" }} onClick={e=>e.stopPropagation()}>

        {/* HEADER */}
        <div style={{ padding:"22px 28px 18px", borderBottom:`1px solid ${C.border}`, display:"flex", justifyContent:"space-between", alignItems:"center", position:"sticky", top:0, background:"#0a0a15", zIndex:10 }}>
          <div>
            <div style={{ fontFamily:"'Syne',sans-serif", fontSize:18, fontWeight:800, color:C.text }}>{initial?"Edit Automation":"New Keyword Automation"}</div>
            <div style={{ fontSize:12, color:C.muted, marginTop:3 }}>Set keywords, write your reply, choose platforms, and track every opt-in</div>
          </div>
          <button onClick={onClose} style={{ background:"none", border:"none", color:C.muted, fontSize:20, cursor:"pointer", padding:"2px 8px", lineHeight:1 }}>✕</button>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr" }}>
          {/* LEFT */}
          <div style={{ padding:"24px 28px", borderRight:`1px solid ${C.border}` }}>

            {/* Name */}
            <div style={{ marginBottom:22 }}>
              <label style={{ fontSize:12, fontWeight:600, color:C.muted, display:"block", marginBottom:6 }}>Campaign Name *</label>
              <input
                value={name}
                onChange={e=>{setName(e.target.value);setErrors(r=>({...r,name:null}));}}
                placeholder="e.g. Thursday Break Sign-Up"
                style={{ width:"100%", background:C.surface2, border:`1.5px solid ${errors.name?"#ef4444":C.border2}`, borderRadius:9, padding:"11px 14px", color:C.text, fontSize:13, outline:"none", fontFamily:"'DM Sans',sans-serif" }}
              />
              {errors.name && <div style={{ fontSize:11, color:"#ef4444", marginTop:4 }}>{errors.name}</div>}
            </div>

            {/* Platforms */}
            <div style={{ marginBottom:22 }}>
              <label style={{ fontSize:12, fontWeight:600, color:C.muted, display:"block", marginBottom:6 }}>Platforms *</label>
              <div style={{ display:"flex", gap:8 }}>
                {[["TT","TikTok DM","#69c9d0"],["IG","Instagram DM","#e1306c"]].map(([code,label,color])=>(
                  <button key={code} onClick={()=>{togglePlatform(code);setErrors(r=>({...r,platforms:null}));}} style={{ flex:1, padding:"11px 8px", borderRadius:10, border:`2px solid ${platforms.includes(code)?color:C.border2}`, background:platforms.includes(code)?`${color}12`:"transparent", color:platforms.includes(code)?color:C.muted, fontSize:12, fontWeight:700, cursor:"pointer", transition:"all .15s" }}>
                    {platforms.includes(code)?"✓ ":""}{label}
                  </button>
                ))}
              </div>
              {errors.platforms && <div style={{ fontSize:11, color:"#ef4444", marginTop:4 }}>{errors.platforms}</div>}
            </div>

            {/* Goal */}
            <div style={{ marginBottom:22 }}>
              <label style={{ fontSize:12, fontWeight:600, color:C.muted, display:"block", marginBottom:6 }}>Campaign Goal</label>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6 }}>
                {Object.entries(GOAL_META).map(([key,g])=>(
                  <button key={key} onClick={()=>setGoal(key)} style={{ display:"flex", alignItems:"center", gap:7, padding:"9px 11px", borderRadius:8, border:`1.5px solid ${goal===key?g.color:C.border}`, background:goal===key?g.bg:"transparent", cursor:"pointer", transition:"all .15s" }}>
                    <span style={{ fontSize:14 }}>{g.icon}</span>
                    <span style={{ fontSize:11, fontWeight:goal===key?700:400, color:goal===key?g.color:C.muted }}>{g.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Keywords */}
            <div>
              <label style={{ fontSize:12, fontWeight:600, color:C.muted, display:"block", marginBottom:4 }}>Trigger Keywords *</label>
              <div style={{ fontSize:11, color:C.subtle, marginBottom:8, lineHeight:1.5 }}>Each keyword is tracked separately — use multiple to A/B test</div>
              <div style={{ display:"flex", gap:7, marginBottom:8 }}>
                <input
                  value={newKw}
                  onChange={e=>setNewKw(e.target.value.toUpperCase().replace(/[^A-Z0-9_]/g,""))}
                  onKeyDown={handleKeyDown}
                  placeholder="KEYWORD"
                  style={{ flex:1, background:C.surface2, border:`1.5px solid ${errors.keywords?"#ef444488":C.border2}`, borderRadius:9, padding:"10px 13px", color:C.text, fontSize:13, fontFamily:"'JetBrains Mono',monospace", outline:"none", letterSpacing:"0.08em" }}
                />
                <button onClick={addKeyword} style={{ background:`${C.accent}cc`, border:"none", color:"#fff", fontSize:12, fontWeight:700, padding:"10px 18px", borderRadius:9, cursor:"pointer" }}>Add</button>
              </div>
              {errors.keywords && <div style={{ fontSize:11, color:"#ef4444", marginBottom:8 }}>{errors.keywords}</div>}
              <div style={{ display:"flex", flexWrap:"wrap", gap:6, minHeight:32 }}>
                {keywordList.map((kw,i)=>(
                  <div key={i} style={{ display:"flex", alignItems:"center", gap:6, background:C.surface, border:`1px solid ${C.border2}`, borderRadius:7, padding:"5px 8px 5px 12px" }}>
                    <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:12, fontWeight:700, color:C.text }}>{kw}</span>
                    <button onClick={()=>removeKeyword(i)} style={{ background:"none", border:"none", color:C.subtle, cursor:"pointer", fontSize:11, padding:0, lineHeight:1, display:"flex", alignItems:"center" }}>✕</button>
                  </div>
                ))}
                {keywordList.length===0 && <div style={{ fontSize:11, color:C.subtle, display:"flex", alignItems:"center" }}>No keywords yet</div>}
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div style={{ padding:"24px 28px" }}>
            {/* Reply */}
            <div style={{ marginBottom:18 }}>
              <label style={{ fontSize:12, fontWeight:600, color:C.muted, display:"block", marginBottom:4 }}>Auto-Reply Message *</label>
              <div style={{ fontSize:11, color:C.subtle, marginBottom:8, lineHeight:1.5 }}>
                Merge fields: <span style={{ fontFamily:"'JetBrains Mono',monospace", color:C.muted, cursor:"pointer" }} onClick={()=>setReply(r=>r+"{first_name}")}>{"  {first_name}  "}</span>
                <span style={{ fontFamily:"'JetBrains Mono',monospace", color:C.muted, cursor:"pointer" }} onClick={()=>setReply(r=>r+"{shop_name}")}>{"{shop_name}"}</span>
              </div>
              <textarea
                value={reply}
                onChange={e=>{setReply(e.target.value);setErrors(r=>({...r,reply:null}));}}
                placeholder={"Hey {first_name}! You're in 🎉 I'll DM you before every show with the link..."}
                rows={5}
                style={{ width:"100%", background:C.surface2, border:`1.5px solid ${errors.reply?"#ef4444":C.border2}`, borderRadius:9, padding:"11px 14px", color:C.text, fontSize:13, outline:"none", fontFamily:"'DM Sans',sans-serif", resize:"vertical", lineHeight:1.6 }}
              />
              <div style={{ display:"flex", justifyContent:"space-between", marginTop:4 }}>
                {errors.reply ? <div style={{ fontSize:11, color:"#ef4444" }}>{errors.reply}</div> : <div />}
                <div style={{ fontSize:10, color:reply.length>640?"#ef4444":reply.length>500?C.amber:C.subtle }}>{reply.length}/640</div>
              </div>
            </div>

            {/* PREVIEW */}
            <div style={{ marginBottom:18 }}>
              <div style={{ fontSize:11, fontWeight:700, color:C.muted, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:10 }}>Live Preview</div>
              <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, padding:"14px 16px" }}>
                <div style={{ fontSize:10, color:C.subtle, marginBottom:8 }}>
                  Someone DMs: <span style={{ fontFamily:"'JetBrains Mono',monospace", color:C.text }}>"{keywordList[0]||"KEYWORD"}"</span>
                </div>
                <div style={{ width:1, height:10, background:C.border, margin:"0 0 8px 10px" }} />
                <div style={{ display:"flex", gap:8 }}>
                  <div style={{ width:24, height:24, borderRadius:"50%", background:`${C.accent}22`, border:`1px solid ${C.accent}44`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:9, fontWeight:700, color:C.accent, flexShrink:0, marginTop:2 }}>S</div>
                  <div style={{ background:C.surface2, borderRadius:"3px 10px 10px 10px", padding:"10px 13px", fontSize:12, lineHeight:1.6, color:preview?C.text:C.subtle, fontStyle:preview?"normal":"italic", flex:1 }}>
                    {preview||"Your message will appear here…"}
                  </div>
                </div>
              </div>
            </div>

            {/* TIPS */}
            <div style={{ background:"#0c1a10", border:"1px solid #1a3320", borderRadius:10, padding:"12px 14px" }}>
              <div style={{ fontSize:11, fontWeight:700, color:C.green, marginBottom:8 }}>Tips for higher opt-ins</div>
              {[
                "Keep messages under 300 chars for best read rates",
                "Lead with the value — what does the subscriber get?",
                "Add urgency: 'I'll DM you 1 hour before we go live'",
                "Use {first_name} to feel personal, not broadcast-y",
                "Run 2-3 keywords and compare after 7 days",
              ].map((tip,i)=>(
                <div key={i} style={{ fontSize:11, color:"#6b7280", marginBottom:i<4?4:0, lineHeight:1.5 }}>→ {tip}</div>
              ))}
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div style={{ padding:"18px 28px", borderTop:`1px solid ${C.border}`, display:"flex", justifyContent:"flex-end", gap:10, position:"sticky", bottom:0, background:"#0a0a15" }}>
          <button onClick={onClose} style={{ background:"none", border:`1px solid ${C.border2}`, color:C.muted, fontSize:13, fontWeight:600, padding:"11px 24px", borderRadius:9, cursor:"pointer" }}>Cancel</button>
          <button onClick={handleSave} style={{ background:"linear-gradient(135deg,#f43f5e,#ec4899)", border:"none", color:"#fff", fontSize:13, fontWeight:700, padding:"11px 28px", borderRadius:9, cursor:"pointer" }}>
            {initial?"Save Changes":"Create Automation"}
          </button>
        </div>
      </div>
    </div>
  );
}


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

// ─── COPY LINK CARD ──────────────────────────────────────────────────────────
function CopyLinkCard({ slug }) {
  const [copied, setCopied] = useState(false);
  const url = `strmlive.com/s/${slug}`;
  const handleCopy = () => {
    navigator.clipboard.writeText(`https://${url}`).catch(()=>{});
    setCopied(true);
    setTimeout(()=>setCopied(false), 2000);
  };
  return (
    <div style={{ background:"#0a1e16", border:`1px solid ${C.green}33`, borderRadius:14, padding:"16px 20px", marginBottom:20 }}>
      <div style={{ fontSize:12, fontWeight:700, color:C.green, marginBottom:8 }}>Your opt-in page is live</div>
      <button
        onClick={handleCopy}
        style={{ display:"flex", alignItems:"center", gap:12, background:"#061410", border:`1px solid ${copied?"#34d39966":"#34d39933"}`, borderRadius:9, padding:"10px 16px", cursor:"pointer", transition:"all .15s", width:"100%", textAlign:"left" }}
      >
        <span style={{ fontSize:14 }}>🔗</span>
        <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:12, color:"#34d399", flex:1 }}>{url}</span>
        <span style={{ fontSize:11, fontWeight:700, color:copied?"#34d399":C.muted, background:copied?"#0a1e16":"transparent", border:`1px solid ${copied?"#34d39944":"transparent"}`, padding:"3px 10px", borderRadius:6, whiteSpace:"nowrap", transition:"all .2s" }}>
          {copied ? "✓ Copied!" : "Copy link"}
        </span>
      </button>
      <div style={{ fontSize:11, color:C.muted, marginTop:8 }}>Share in your show chat, bio, and story highlights to grow your subscriber list</div>
    </div>
  );
}

// ─── SCREEN: SUBSCRIBERS ─────────────────────────────────────────────────────
function ScreenSubscribers({ persona }) {
  const mc = persona.manychat || { ttOptIns:0, igOptIns:0, thisWeek:{tt:0,ig:0}, topKeyword:null };
  const totalMC = mc.ttOptIns + mc.igOptIns;
  const hasTT = persona.platforms?.includes("TT");
  const hasIG = persona.platforms?.includes("IG");

  const subs = [
    { name:"Marcus Webb",  email:"m.webb@example.com",  channels:["email","sms"],          joinedAt:"Jan 4, 2025",  opens:12 },
    { name:"Priya Nair",   email:"priya@example.com",   channels:["email","tt_dm"],        joinedAt:"Jan 14, 2025", opens:8  },
    { name:"Devon Price",  email:"dp@example.com",      channels:["sms"],                  joinedAt:"Feb 1, 2025",  opens:5  },
    { name:"Amy Chen",     email:"amyc@example.com",    channels:["email","ig_dm"],        joinedAt:"Feb 8, 2025",  opens:2  },
    { name:"Jordan Mills", email:"jm@example.com",      channels:["email","sms","tt_dm"],  joinedAt:"Feb 12, 2025", opens:9  },
  ];

  const CHANNEL_META = {
    email: { label:"EMAIL",  color:"#3b82f6", bg:"#0f1e2e" },
    sms:   { label:"SMS",    color:"#a78bfa", bg:"#2d1f5e" },
    tt_dm: { label:"TT DM",  color:"#69c9d0", bg:"#0d2828" },
    ig_dm: { label:"IG DM",  color:"#e1306c", bg:"#2d1020" },
  };

  return (
    <div style={{ padding:"28px 32px", overflowY:"auto", height:"100%" }}>

      {/* Header */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 }}>
        <div>
          <div style={{ fontFamily:"'Syne',sans-serif", fontSize:22, fontWeight:800, color:C.text, letterSpacing:"-0.5px" }}>Subscribers</div>
          <div style={{ fontSize:12, color:C.muted, marginTop:4 }}>
            {persona.subscriberCount} total · Opt-in page at strmlive.com/s/{persona.slug}
          </div>
        </div>
        <button onClick={()=>navigator.clipboard?.writeText(`https://strmlive.com/s/${persona.slug}`)}
          style={{ background:C.surface, border:`1px solid ${C.border}`, color:C.muted, fontSize:11, fontWeight:600, padding:"7px 14px", borderRadius:8, cursor:"pointer", display:"flex", alignItems:"center", gap:6 }}>
          Copy opt-in link 🔗
        </button>
      </div>

      {/* STAT CARDS — 4 cols */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:24 }}>
        <StatCard label="Total Subscribers" value={persona.subscriberCount.toLocaleString()} sub="opted in to messages" color={C.green} />
        <StatCard label="Email"             value={Math.round(persona.subscriberCount*0.48).toLocaleString()} sub="48% of list" color={C.blue} />
        <StatCard label="SMS"               value={Math.round(persona.subscriberCount*0.31).toLocaleString()} sub="31% of list" color="#a78bfa" />
        {/* ManyChat card */}
        <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:14, padding:"16px 18px", position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", top:-20, right:-20, width:80, height:80, borderRadius:"50%", background:"#69c9d0", opacity:0.06, filter:"blur(20px)", pointerEvents:"none" }}/>
          <div style={{ fontSize:10, fontWeight:700, color:C.muted, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:6 }}>ManyChat DMs</div>
          <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:22, fontWeight:800, color:C.text, marginBottom:6 }}>
            {totalMC > 0 ? totalMC.toLocaleString() : "—"}
          </div>
          {totalMC > 0 ? (
            <div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>
              {hasTT && mc.ttOptIns > 0 && (
                <span style={{ fontSize:8, fontWeight:700, color:"#69c9d0", background:"#0d2828", border:"1px solid #69c9d033", padding:"2px 7px", borderRadius:4 }}>🎵 TT {mc.ttOptIns.toLocaleString()}</span>
              )}
              {hasIG && mc.igOptIns > 0 && (
                <span style={{ fontSize:8, fontWeight:700, color:"#e1306c", background:"#2d1020", border:"1px solid #e1306c33", padding:"2px 7px", borderRadius:4 }}>📸 IG {mc.igOptIns.toLocaleString()}</span>
              )}
            </div>
          ) : (
            <div style={{ fontSize:9, color:C.subtle }}>Connect TT or IG</div>
          )}
        </div>
      </div>

      {/* MANYCHAT BREAKDOWN */}
      {totalMC > 0 && (
        <div style={{ background:C.surface, border:"1px solid #1e2a2a", borderRadius:14, padding:"18px 22px", marginBottom:20 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
            <div style={{ width:32, height:32, borderRadius:9, background:"#69c9d014", border:"1px solid #69c9d033", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14 }}>⚡</div>
            <div>
              <div style={{ fontSize:13, fontWeight:700, color:C.text }}>ManyChat DM Opt-ins</div>
              <div style={{ fontSize:10, color:C.muted }}>Keyword-triggered subscribers from TikTok & Instagram</div>
            </div>
            <div style={{ marginLeft:"auto", fontSize:10, color:C.muted }}>+{mc.thisWeek.tt + mc.thisWeek.ig} this week</div>
          </div>

          <div style={{ display:"grid", gridTemplateColumns:(hasTT && hasIG)?"1fr 1fr":"1fr", gap:12 }}>
            {hasTT && (
              <div style={{ background:"#0a1e1e", border:"1px solid #69c9d022", borderRadius:11, padding:"14px 16px" }}>
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
                  <span style={{ fontSize:15 }}>🎵</span>
                  <span style={{ fontSize:12, fontWeight:700, color:"#69c9d0" }}>TikTok DM</span>
                  <span style={{ marginLeft:"auto", fontSize:8, fontWeight:700, color:"#69c9d0", background:"#69c9d018", border:"1px solid #69c9d033", padding:"2px 7px", borderRadius:4 }}>+{mc.thisWeek.tt} this week</span>
                </div>
                <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:26, fontWeight:800, color:C.text, marginBottom:4 }}>{mc.ttOptIns.toLocaleString()}</div>
                <div style={{ fontSize:10, color:C.muted, marginBottom:mc.topKeyword?10:0 }}>opted-in via keyword DM</div>
                {mc.topKeyword && (
                  <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                    <span style={{ fontSize:9, color:C.subtle }}>Top keyword:</span>
                    <span style={{ fontSize:9, fontWeight:800, color:"#69c9d0", background:"#69c9d014", border:"1px solid #69c9d033", padding:"2px 8px", borderRadius:4, letterSpacing:"0.05em" }}>{mc.topKeyword}</span>
                  </div>
                )}
              </div>
            )}
            {hasIG && (
              <div style={{ background:"#1e0c16", border:"1px solid #e1306c22", borderRadius:11, padding:"14px 16px" }}>
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
                  <span style={{ fontSize:15 }}>📸</span>
                  <span style={{ fontSize:12, fontWeight:700, color:"#e1306c" }}>Instagram DM</span>
                  <span style={{ marginLeft:"auto", fontSize:8, fontWeight:700, color:"#e1306c", background:"#e1306c18", border:"1px solid #e1306c33", padding:"2px 7px", borderRadius:4 }}>+{mc.thisWeek.ig} this week</span>
                </div>
                <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:26, fontWeight:800, color:C.text, marginBottom:4 }}>{mc.igOptIns.toLocaleString()}</div>
                <div style={{ fontSize:10, color:C.muted, marginBottom:mc.topKeyword?10:0 }}>opted-in via keyword DM</div>
                {mc.topKeyword && (
                  <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                    <span style={{ fontSize:9, color:C.subtle }}>Top keyword:</span>
                    <span style={{ fontSize:9, fontWeight:800, color:"#e1306c", background:"#e1306c14", border:"1px solid #e1306c33", padding:"2px 8px", borderRadius:4, letterSpacing:"0.05em" }}>{mc.topKeyword}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          <div style={{ marginTop:12, fontSize:10, color:C.subtle }}>
            Powered by <span style={{ fontWeight:700, color:"#69c9d0" }}>ManyChat</span> · Manage keywords in <span style={{ color:"#a78bfa" }}>Campaigns → DM Automations</span>
          </div>
        </div>
      )}

      {/* OPT-IN LINK CARD */}
      <CopyLinkCard slug={persona.slug} />

      {/* SUBSCRIBER TABLE */}
      <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:14, overflow:"hidden", marginTop:20 }}>
        <div style={{ display:"grid", gridTemplateColumns:"1.5fr 1.5fr 1fr 0.8fr 0.5fr", padding:"10px 22px", borderBottom:`1px solid ${C.border}` }}>
          {["Name","Email","Channels","Joined","Opens"].map(h=>(
            <div key={h} style={{ fontSize:10, color:C.muted, textTransform:"uppercase", letterSpacing:"0.08em", fontWeight:700 }}>{h}</div>
          ))}
        </div>
        {subs.map((s,i)=>(
          <div key={i} style={{ display:"grid", gridTemplateColumns:"1.5fr 1.5fr 1fr 0.8fr 0.5fr", padding:"12px 22px", borderBottom:i<subs.length-1?`1px solid #0d0d18`:"none", alignItems:"center" }}>
            <div style={{ fontSize:13, fontWeight:600, color:C.text }}>{s.name}</div>
            <div style={{ fontSize:11, color:C.muted, fontFamily:"'JetBrains Mono',monospace" }}>{s.email}</div>
            <div style={{ display:"flex", gap:4, flexWrap:"wrap" }}>
              {s.channels.map(ch => {
                const cm = CHANNEL_META[ch];
                return cm ? (
                  <span key={ch} style={{ fontSize:8, fontWeight:700, color:cm.color, background:cm.bg, border:`1px solid ${cm.color}44`, padding:"2px 6px", borderRadius:4 }}>{cm.label}</span>
                ) : null;
              })}
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
function TeamTab({ persona, openCheckout }) {
  const ROLES = ["Admin", "Producer", "Show Manager", "Campaign Manager", "Viewer"];
  const ROLE_META = {
    Owner:             { color: C.accent,   desc: "Full access to everything" },
    Admin:             { color: "#f59e0b",  desc: "Manage shows, buyers, campaigns, settings" },
    Producer:          { color: "#06b6d4",  desc: "Production suite, shows & catalog — Pro+ only", badge: "Pro+", access: ["Shows", "Production", "Live Companion", "Catalog"] },
    "Show Manager":    { color: "#10b981",  desc: "Run live shows and manage orders" },
    "Campaign Manager":{ color: "#3b82f6",  desc: "Create and send campaigns" },
    Viewer:            { color: "#9ca3af",  desc: "Read-only access" },
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
            <div style={{ marginBottom:16 }}>
              <div style={{ fontSize:10, fontWeight:700, color:C.muted, textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:8 }}>Role</div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6 }}>
                {ROLES.map(r => {
                  const rm = ROLE_META[r];
                  const sel = inviteRole === r;
                  const producerLocked = r === "Producer" && PLAN_LEVEL[persona.plan] < 2;
                  return (
                    <div key={r}
                      onClick={()=>{ setInviteRole(r); }}
                      style={{ padding:"10px 12px", borderRadius:9, height:60,
                        border:`1px solid ${producerLocked?"#222230":sel?rm.color+"55":C.border}`,
                        background:producerLocked?"transparent":sel?`${rm.color}12`:"transparent",
                        cursor:"pointer", display:"flex", flexDirection:"column", justifyContent:"center",
                        opacity:producerLocked?0.45:1, transition:"border .12s, background .12s" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:5, marginBottom:3 }}>
                        <span style={{ fontSize:12, fontWeight:700, color:producerLocked?"#374151":sel?rm.color:C.text }}>{r}</span>
                        {producerLocked
                          ? <span style={{ fontSize:7, fontWeight:800, color:"#f59e0b", background:"#f59e0b14", border:"1px solid #f59e0b28", padding:"1px 5px", borderRadius:3, textTransform:"uppercase", letterSpacing:"0.05em" }}>Pro+</span>
                          : sel && rm.badge && <span style={{ fontSize:7, fontWeight:800, color:"#06b6d4", background:"#06b6d414", border:"1px solid #06b6d433", padding:"1px 5px", borderRadius:3, textTransform:"uppercase" }}>{rm.badge}</span>
                        }
                      </div>
                      <div style={{ fontSize:10, color:producerLocked?"#2e2e45":C.muted, lineHeight:1.3 }}>{rm.desc.split(" — ")[0]}</div>
                    </div>
                  );
                })}
              </div>

              {/* Below-grid contextual panel: upsell OR access chips */}
              {inviteRole === "Producer" && PLAN_LEVEL[persona.plan] < 2 ? (
                <div style={{ marginTop:8, background:"#130f08", border:"1px solid #f59e0b33", borderRadius:9, padding:"12px 14px", display:"flex", alignItems:"flex-start", gap:12 }}>
                  <span style={{ fontSize:18, flexShrink:0 }}>🎬</span>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:11, fontWeight:700, color:"#f59e0b", marginBottom:3 }}>Producer requires Pro</div>
                    <div style={{ fontSize:10, color:"#7a6040", lineHeight:1.5 }}>Unlock camera control, OBS scene switching, device automation & the full Production Suite.</div>
                    <button onClick={e=>{ e.stopPropagation(); setShowInviteModal(false); if(typeof openCheckout==="function") openCheckout("pro"); }}
                      style={{ marginTop:8, fontSize:10, fontWeight:700, color:"#f59e0b", background:"#f59e0b18", border:"1px solid #f59e0b44", padding:"5px 14px", borderRadius:6, cursor:"pointer" }}>
                      Upgrade to Pro →
                    </button>
                  </div>
                </div>
              ) : inviteRole && ROLE_META[inviteRole]?.access ? (
                <div style={{ marginTop:8, display:"flex", alignItems:"center", gap:6, flexWrap:"wrap" }}>
                  <span style={{ fontSize:9, color:C.subtle }}>Access:</span>
                  {ROLE_META[inviteRole].access.map(a=>(
                    <span key={a} style={{ fontSize:9, fontWeight:700, color:"#06b6d4", background:"#06b6d412", border:"1px solid #06b6d433", padding:"2px 7px", borderRadius:4 }}>{a}</span>
                  ))}
                </div>
              ) : null}
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

function ScreenSettings({ persona, initialTab, openCheckout }) {
  const [tab, setTab]           = useState(initialTab || "platforms");
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
    yt: {
      label: "YouTube Live",
      icon: "▶️",
      color: "#ff0000",
      bg: "#2a0a0a",
      description: "YouTube Data API — live stream management, chat, viewer metrics. Buyer purchase data sourced from your connected Shopify store using 3-method attribution.",
      authType: "oauth",
      scopes: ["youtube.readonly", "youtube.force-ssl"],
      connectWith: () => connect("yt", { account: persona.shop + " on YouTube", subscribers: "12.4K", scopes: ["Live Stream Mgmt", "Chat & Viewers", "Analytics", "Shopify Attribution"] }),
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

  const PLATFORM_LIST = ["WN","TT","AM","IG","YT"];
  const platformData = {
    WN: { accountType:"Seller",              note:"Orders, buyers, inventory + real-time webhooks" },
    TT: { accountType:"Seller Account",      note:"Requires TikTok Seller Account" },
    AM: { accountType:"Brand Registry / Influencer", note:"Post-show order sync via SP-API — ~24h delay" },
    IG: { accountType:"Business or Creator", note:"Audience insights + DM automation (Pro)" },
    YT: { accountType:"YouTube Channel",     note:"Live stream management via YouTube Data API · Buyer data via Shopify · 3 attribution methods" },
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
        {["platforms","messaging","profile","billing","team","pixel"].map(t=>(
          <button key={t} onClick={()=>setTab(t)} style={{ background:"none", border:"none", borderBottom:`2px solid ${tab===t?C.accent:"transparent"}`, color:tab===t?"#a78bfa":C.muted, fontSize:12, fontWeight:tab===t?700:400, padding:"0 16px 12px", cursor:"pointer", textTransform:"capitalize", display:"flex", alignItems:"center", gap:5 }}>
            {t === "pixel" ? <><span style={{ color:tab===t?"#f43f5e":C.muted, fontSize:10 }}>●</span> Live Pixel</> : t}
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

          {/* ── YOUTUBE ATTRIBUTION SETTINGS ─────────────────────────── */}
          {platforms.find(p=>p.id==="YT")?.connected && (
            <div style={{ marginTop:28 }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
                <div style={{ width:5, height:5, borderRadius:"50%", background:"#ff0000" }} />
                <span style={{ fontSize:11, fontWeight:800, color:"#ff0000", textTransform:"uppercase", letterSpacing:"0.1em" }}>YouTube Attribution</span>
              </div>
              <div style={{ fontSize:11, color:C.muted, marginBottom:16, lineHeight:1.6 }}>
                YouTube doesn't expose buyer purchase data via API. Streamlive uses three complementary methods to attribute Shopify orders to your YouTube shows. All three run automatically — they're layered so every order gets captured.
              </div>

              {[
                {
                  num:"01", label:"Time-Window Attribution", color:"#10b981",
                  desc:"Shopify orders placed within a configurable window around your stream are automatically tagged to the show. Confidence is highest when your audience isn't buying on other channels at the same time.",
                  badge:"Automatic",
                  detail:"Default window: ±15 min before/after stream. Adjust per show in Show Planner.",
                },
                {
                  num:"02", label:"UTM Link Attribution", color:"#3b82f6",
                  desc:"A unique tracking link is generated for every YouTube show. Pin it in your live chat — any Shopify order from that link is attributed with 100% confidence regardless of timing.",
                  badge:"100% Confidence",
                  detail:"Link format: strmlive.com/yt/[shop]-[date]. Generated automatically in Show Planner.",
                },
                {
                  num:"03", label:"Post-Show Reconciliation", color:"#f59e0b",
                  desc:"Unattributed Shopify orders from your stream window appear in Order Review after each show. Confirm or dismiss each one — your call gives the final attribution.",
                  badge:"Manual confirm",
                  detail:"Appears in Order Review tab after every YouTube show. Takes ~2 min.",
                },
              ].map(m => (
                <div key={m.num} style={{ background:C.surface, border:`1px solid ${m.color}33`, borderLeft:`3px solid ${m.color}`, borderRadius:10, padding:"14px 18px", marginBottom:10 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:6 }}>
                    <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10, color:m.color, fontWeight:700 }}>{m.num}</span>
                    <span style={{ fontSize:13, fontWeight:700, color:C.text }}>{m.label}</span>
                    <span style={{ fontSize:9, fontWeight:700, color:m.color, background:`${m.color}18`, border:`1px solid ${m.color}33`, padding:"2px 8px", borderRadius:5, marginLeft:"auto" }}>{m.badge}</span>
                  </div>
                  <div style={{ fontSize:11, color:"#9ca3af", lineHeight:1.6, marginBottom:6 }}>{m.desc}</div>
                  <div style={{ fontSize:10, color:C.subtle, fontStyle:"italic" }}>{m.detail}</div>
                </div>
              ))}

              <div style={{ background:"#0a1020", border:"1px solid #1e1e3a", borderRadius:10, padding:"12px 16px", marginTop:4 }}>
                <div style={{ fontSize:10, fontWeight:700, color:C.muted, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:8 }}>Attribution Window</div>
                <div style={{ display:"flex", gap:8 }}>
                  {["10 min","15 min","20 min","30 min"].map((w,i) => (
                    <button key={w} onClick={()=>{}} style={{ flex:1, background:i===1?"#1a1a3a":C.surface, border:`1px solid ${i===1?C.accent:C.border}`, color:i===1?"#a78bfa":C.muted, fontSize:11, fontWeight:i===1?700:400, padding:"7px 0", borderRadius:7, cursor:"pointer" }}>{w}</button>
                  ))}
                </div>
                <div style={{ fontSize:10, color:C.subtle, marginTop:8 }}>Orders placed within this window before/after your stream end time are eligible for time-window attribution.</div>
              </div>
            </div>
          )}
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
                <div style={{ fontSize:12, color:C.muted, marginTop:4 }}>${persona.plan==="starter"?"$79":persona.plan==="growth"?"$199":persona.plan==="pro"?"$399":"$999"}/month · Renews March 1</div>
              </div>
              <button onClick={()=>openCheckout&&openCheckout(persona.plan)} style={{ fontSize:11, color:"#fff", background:`linear-gradient(135deg,${C.accent},${C.accent2})`, border:"none", padding:"8px 16px", borderRadius:8, cursor:"pointer" }}>Manage Plan</button>
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
              <button onClick={()=>openCheckout&&openCheckout(persona.plan==="starter"?"growth":"pro")} style={{ display:"inline-block", fontSize:12, fontWeight:700, color:"#fff", background:`linear-gradient(135deg,${C.accent},${C.accent2})`, padding:"9px 22px", borderRadius:9, border:"none", cursor:"pointer" }}>
                Upgrade Now →
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── TEAM TAB ── */}
      {tab==="team" && (
        <TeamTab persona={persona} openCheckout={openCheckout} />
      )}

      {tab==="pixel" && <LivePixelTab persona={persona} />}
    </div>
  );
}

function LivePixelTab({ persona }) {
  const pixelId = `lp_${persona.slug || "br"}_${persona.id || "x"}4f2a`;
  const pixelSnippet =
`<!-- Live Pixel by Streamlive -->
<script>
(function(w,d,s,l,i){
  w[l]=w[l]||[];
  var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s);
  j.async=true;
  j.src='https://cdn.streamlive.com/pixel/v1.js';
  j.setAttribute('data-pixel-id',i);
  f.parentNode.insertBefore(j,f);
})(window,document,'script','_slq','${pixelId}');
</script>
<!-- End Live Pixel -->`;

  const shopifySnippet =
`{% comment %} Live Pixel — paste in theme.liquid before </head> {% endcomment %}
<script>
(function(w,d,s,l,i){
  w[l]=w[l]||[];
  var f=d.getElementsByTagName(s)[0],j=d.createElement(s);
  j.async=true;j.src='https://cdn.streamlive.com/pixel/v1.js';
  j.setAttribute('data-pixel-id',i);f.parentNode.insertBefore(j,f);
})(window,document,'script','_slq','${pixelId}');
</script>`;

  const features = [
    { icon:"🎯", label:"Session attribution",    desc:"Tracks the visitor from YouTube click → your site → checkout. No time-window guessing." },
    { icon:"🔗", label:"Cross-session tracking", desc:"Buyer leaves and comes back 3 days later? Still attributed to the show that sent them." },
    { icon:"👤", label:"Identity resolution",    desc:"Matches anonymous visitors to known Shopify customers when they check out." },
    { icon:"📺", label:"Show-level attribution", desc:"Each show gets a unique fingerprint. Pixel knows exactly which stream the buyer came from." },
    { icon:"⚡", label:"Real-time signals",      desc:"See live visitor counts on your site during a show — how many viewers clicked through." },
    { icon:"🛡️", label:"First-party data",       desc:"Runs on your domain. No third-party cookies. GDPR/CCPA compliant by design." },
  ];

  const [copied, setCopied] = useState(null);
  const copy = (text, key) => {
    navigator.clipboard?.writeText(text).catch(()=>{});
    setCopied(key);
    setTimeout(()=>setCopied(null), 2000);
  };
  const [pixelInstalled, setPixelInstalled] = useState(false);
  const [installTab, setInstallTab] = useState("shopify");

  return (
    <div className="fade-up" style={{ maxWidth:680 }}>

      {/* Header */}
      <div style={{ background:"linear-gradient(135deg,#1a0808,#0d0812)", border:"1px solid #f43f5e33", borderRadius:16, padding:"24px 28px", marginBottom:24, position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", right:24, top:24, width:80, height:80, borderRadius:"50%", background:"radial-gradient(circle,#f43f5e22,transparent 70%)", pointerEvents:"none" }} />
        <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:12 }}>
          <div style={{ width:38, height:38, borderRadius:11, background:"linear-gradient(135deg,#f43f5e,#7c3aed)", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <div style={{ width:10, height:10, borderRadius:"50%", background:"#fff", boxShadow:"0 0 8px #fff" }} />
          </div>
          <div>
            <div style={{ fontFamily:"'Syne',sans-serif", fontSize:18, fontWeight:800, color:"#fff", letterSpacing:"-0.3px" }}>Live Pixel</div>
            <div style={{ fontSize:11, color:"#f43f5e", fontWeight:600 }}>by Streamlive · First-party attribution</div>
          </div>
          {pixelInstalled
            ? <span style={{ marginLeft:"auto", fontSize:10, fontWeight:700, color:C.green, background:"#10b98118", border:"1px solid #10b98133", padding:"4px 12px", borderRadius:99 }}>● Active</span>
            : <span style={{ marginLeft:"auto", fontSize:10, fontWeight:700, color:"#f59e0b", background:"#f59e0b18", border:"1px solid #f59e0b33", padding:"4px 12px", borderRadius:99 }}>Not installed</span>
          }
        </div>
        <div style={{ fontSize:12, color:"#9ca3af", lineHeight:1.7, maxWidth:500 }}>
          A lightweight JavaScript snippet you install once on your website. Live Pixel tracks every visitor from the moment they arrive — whether from a YouTube chat link, a TikTok bio, or a DM campaign — and ties their purchase directly to the show that sent them. <span style={{ color:"#f43f5e", fontWeight:600 }}>No inference. No guessing. Direct attribution.</span>
        </div>
      </div>

      {/* Features grid */}
      <div style={{ marginBottom:24 }}>
        <div style={{ fontSize:11, fontWeight:800, color:C.muted, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:14 }}>What Live Pixel does</div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
          {features.map(f => (
            <div key={f.label} style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:11, padding:"12px 14px", display:"flex", gap:10 }}>
              <span style={{ fontSize:18, flexShrink:0, marginTop:1 }}>{f.icon}</span>
              <div>
                <div style={{ fontSize:12, fontWeight:700, color:C.text, marginBottom:3 }}>{f.label}</div>
                <div style={{ fontSize:11, color:C.muted, lineHeight:1.5 }}>{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Attribution comparison */}
      <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:14, padding:"18px 20px", marginBottom:24 }}>
        <div style={{ fontSize:12, fontWeight:700, color:C.text, marginBottom:14 }}>Attribution accuracy comparison</div>
        {[
          { method:"Live Pixel",    accuracy:99, color:"#f43f5e", note:"Direct session tracking. Buyer's path is recorded end-to-end." },
          { method:"UTM Link",      accuracy:82, color:"#3b82f6", note:"100% accurate — but only for buyers who click your link." },
          { method:"Time-Window",   accuracy:64, color:"#10b981", note:"Catches most buyers but also unrelated orders in the window." },
          { method:"Manual Review", accuracy:55, color:"#f59e0b", note:"Reliable for what you confirm — but slow and incomplete." },
        ].map(m => (
          <div key={m.method} style={{ marginBottom:12 }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
              <span style={{ fontSize:11, fontWeight:600, color:m.method==="Live Pixel"?m.color:C.text, display:"flex", alignItems:"center", gap:6 }}>
                {m.method==="Live Pixel" && <span style={{ width:7, height:7, borderRadius:"50%", background:m.color, display:"inline-block", boxShadow:`0 0 6px ${m.color}` }} />}
                {m.method}
              </span>
              <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:11, fontWeight:700, color:m.color }}>{m.accuracy}%</span>
            </div>
            <div style={{ height:6, background:C.surface2, borderRadius:3, overflow:"hidden", marginBottom:4 }}>
              <div style={{ width:`${m.accuracy}%`, height:"100%", background:m.color, borderRadius:3, boxShadow:m.method==="Live Pixel"?`0 0 8px ${m.color}66`:"none" }} />
            </div>
            <div style={{ fontSize:10, color:C.subtle, fontStyle:"italic" }}>{m.note}</div>
          </div>
        ))}
      </div>

      {/* Pixel ID */}
      <div style={{ background:C.surface, border:"1px solid #f43f5e33", borderRadius:14, padding:"18px 20px", marginBottom:24 }}>
        <div style={{ fontSize:11, fontWeight:700, color:"#f43f5e", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:10 }}>Your Pixel ID</div>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <code style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:14, fontWeight:700, color:C.text, background:C.surface2, border:`1px solid ${C.border}`, padding:"10px 16px", borderRadius:9, flex:1, letterSpacing:"0.05em" }}>
            {pixelId}
          </code>
          <button onClick={()=>copy(pixelId,"pid")} style={{ fontSize:11, fontWeight:700, color:copied==="pid"?C.green:"#a78bfa", background:copied==="pid"?"#10b98118":"#a78bfa18", border:`1px solid ${copied==="pid"?C.green+"44":"#a78bfa44"}`, padding:"10px 18px", borderRadius:9, cursor:"pointer", whiteSpace:"nowrap" }}>
            {copied==="pid" ? "✓ Copied" : "Copy ID"}
          </button>
        </div>
        <div style={{ fontSize:10, color:C.subtle, marginTop:8 }}>Unique to your Streamlive account. Keep it private.</div>
      </div>

      {/* Install instructions */}
      <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:14, padding:"18px 20px", marginBottom:24 }}>
        <div style={{ fontSize:12, fontWeight:700, color:C.text, marginBottom:16 }}>Install Live Pixel</div>
        <div style={{ display:"flex", gap:0, marginBottom:20, background:C.surface2, borderRadius:9, padding:3 }}>
          {[["shopify","🛍 Shopify"],["html","</> HTML"],["gtm","📦 GTM"],["wordpress","🔵 WordPress"]].map(([k,l])=>(
            <button key={k} onClick={()=>setInstallTab(k)} style={{ flex:1, background:installTab===k?"#a78bfa22":"transparent", border:`1px solid ${installTab===k?"#a78bfa44":"transparent"}`, color:installTab===k?"#a78bfa":C.muted, fontSize:11, fontWeight:installTab===k?700:400, padding:"7px 0", borderRadius:7, cursor:"pointer" }}>
              {l}
            </button>
          ))}
        </div>

        {installTab==="shopify" && (
          <div>
            <div style={{ fontSize:11, color:C.muted, marginBottom:14, lineHeight:1.6 }}>
              In Shopify admin go to <strong style={{ color:C.text }}>Online Store → Themes → Edit code</strong> and paste before the <code style={{ color:"#a78bfa" }}>&lt;/head&gt;</code> tag in <strong style={{ color:C.text }}>theme.liquid</strong>.
            </div>
            <div style={{ position:"relative" }}>
              <pre style={{ background:"#060610", border:`1px solid ${C.border}`, borderRadius:10, padding:"16px", fontSize:11, color:"#a78bfa", fontFamily:"'JetBrains Mono',monospace", overflowX:"auto", lineHeight:1.8, margin:0, whiteSpace:"pre-wrap" }}>{shopifySnippet}</pre>
              <button onClick={()=>copy(shopifySnippet,"shopify")} style={{ position:"absolute", top:10, right:10, fontSize:10, fontWeight:700, color:copied==="shopify"?C.green:"#a78bfa", background:copied==="shopify"?"#0a1e16":"#a78bfa18", border:`1px solid ${copied==="shopify"?C.green+"44":"#a78bfa44"}`, padding:"5px 12px", borderRadius:6, cursor:"pointer" }}>
                {copied==="shopify" ? "✓ Copied" : "Copy"}
              </button>
            </div>
          </div>
        )}
        {installTab==="html" && (
          <div>
            <div style={{ fontSize:11, color:C.muted, marginBottom:14, lineHeight:1.6 }}>Paste before the closing <code style={{ color:"#a78bfa" }}>&lt;/head&gt;</code> tag on every page.</div>
            <div style={{ position:"relative" }}>
              <pre style={{ background:"#060610", border:`1px solid ${C.border}`, borderRadius:10, padding:"16px", fontSize:11, color:"#a78bfa", fontFamily:"'JetBrains Mono',monospace", overflowX:"auto", lineHeight:1.8, margin:0, whiteSpace:"pre-wrap" }}>{pixelSnippet}</pre>
              <button onClick={()=>copy(pixelSnippet,"html")} style={{ position:"absolute", top:10, right:10, fontSize:10, fontWeight:700, color:copied==="html"?C.green:"#a78bfa", background:copied==="html"?"#0a1e16":"#a78bfa18", border:`1px solid ${copied==="html"?C.green+"44":"#a78bfa44"}`, padding:"5px 12px", borderRadius:6, cursor:"pointer" }}>
                {copied==="html" ? "✓ Copied" : "Copy"}
              </button>
            </div>
          </div>
        )}
        {installTab==="gtm" && (
          <div style={{ fontSize:11, color:C.muted, lineHeight:1.8 }}>
            <div style={{ marginBottom:10 }}>Create a <strong style={{ color:C.text }}>Custom HTML tag</strong> in GTM, paste the snippet, set trigger to <strong style={{ color:C.text }}>All Pages</strong>, then publish.</div>
            <div style={{ position:"relative", marginTop:14 }}>
              <pre style={{ background:"#060610", border:`1px solid ${C.border}`, borderRadius:10, padding:"16px", fontSize:11, color:"#a78bfa", fontFamily:"'JetBrains Mono',monospace", overflowX:"auto", lineHeight:1.8, margin:0, whiteSpace:"pre-wrap" }}>{pixelSnippet}</pre>
              <button onClick={()=>copy(pixelSnippet,"gtm")} style={{ position:"absolute", top:10, right:10, fontSize:10, fontWeight:700, color:copied==="gtm"?C.green:"#a78bfa", background:copied==="gtm"?"#0a1e16":"#a78bfa18", border:`1px solid ${copied==="gtm"?C.green+"44":"#a78bfa44"}`, padding:"5px 12px", borderRadius:6, cursor:"pointer" }}>
                {copied==="gtm" ? "✓ Copied" : "Copy"}
              </button>
            </div>
          </div>
        )}
        {installTab==="wordpress" && (
          <div style={{ fontSize:11, color:C.muted, lineHeight:1.8 }}>
            <div style={{ marginBottom:10 }}>Install the <strong style={{ color:C.text }}>Insert Headers and Footers</strong> plugin, paste the snippet in the Header section, then save.</div>
            <div style={{ position:"relative", marginTop:14 }}>
              <pre style={{ background:"#060610", border:`1px solid ${C.border}`, borderRadius:10, padding:"16px", fontSize:11, color:"#a78bfa", fontFamily:"'JetBrains Mono',monospace", overflowX:"auto", lineHeight:1.8, margin:0, whiteSpace:"pre-wrap" }}>{pixelSnippet}</pre>
              <button onClick={()=>copy(pixelSnippet,"wp")} style={{ position:"absolute", top:10, right:10, fontSize:10, fontWeight:700, color:copied==="wp"?C.green:"#a78bfa", background:copied==="wp"?"#0a1e16":"#a78bfa18", border:`1px solid ${copied==="wp"?C.green+"44":"#a78bfa44"}`, padding:"5px 12px", borderRadius:6, cursor:"pointer" }}>
                {copied==="wp" ? "✓ Copied" : "Copy"}
              </button>
            </div>
          </div>
        )}

        <div style={{ marginTop:20, display:"flex", alignItems:"center", gap:12 }}>
          <button onClick={()=>setPixelInstalled(true)} style={{ background:"linear-gradient(135deg,#f43f5e,#7c3aed)", border:"none", color:"#fff", fontSize:12, fontWeight:700, padding:"10px 24px", borderRadius:9, cursor:"pointer" }}>
            Verify Installation
          </button>
          {pixelInstalled && (
            <div style={{ display:"flex", alignItems:"center", gap:6 }}>
              <div style={{ width:8, height:8, borderRadius:"50%", background:C.green, animation:"livePulse 1.2s ease-out infinite" }} />
              <span style={{ fontSize:12, color:C.green, fontWeight:600 }}>Pixel detected — receiving data</span>
            </div>
          )}
        </div>
      </div>

      {/* Data collected */}
      <div style={{ background:"#0a1020", border:`1px solid ${C.border}`, borderRadius:12, padding:"16px 20px" }}>
        <div style={{ fontSize:11, fontWeight:700, color:C.muted, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:12 }}>Data collected</div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
          {[
            ["Session source","YouTube Live, TikTok, IG, DM campaigns, etc."],
            ["Show ID","Which specific stream sent the visitor"],
            ["Page views","Products viewed, time on site, scroll depth"],
            ["Cart events","Add to cart, remove, abandon"],
            ["Purchase event","Order ID, items, total — matched to Shopify"],
            ["Buyer identity","Matched to Streamlive CRM profile on checkout"],
          ].map(([k,v])=>(
            <div key={k} style={{ display:"flex", gap:6 }}>
              <div style={{ width:5, height:5, borderRadius:"50%", background:"#f43f5e", marginTop:5, flexShrink:0 }} />
              <div>
                <span style={{ fontSize:11, fontWeight:600, color:C.text }}>{k}</span>
                <span style={{ fontSize:11, color:C.muted }}> — {v}</span>
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop:14, fontSize:10, color:C.subtle, lineHeight:1.6, paddingTop:12, borderTop:`1px solid ${C.border}` }}>
          🛡️ Live Pixel is first-party only. No data is shared with third parties. Compliant with GDPR, CCPA, and ePrivacy Directive when paired with your site's consent banner.
        </div>
      </div>

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

  // ── Shopify connection state ──────────────────────────────────────────────
  const [shopifyConnected, setShopifyConnected] = useState(false);
  const [connectStep, setConnectStep]   = useState(1);   // 1 | 2 | 3 | 4
  const [storeUrl, setStoreUrl]         = useState("");
  const [storeUrlError, setStoreUrlError] = useState("");
  const [isAuthorizing, setIsAuthorizing] = useState(false);
  const [isSyncing, setIsSyncing]       = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);

  const validateStore = () => {
    const clean = storeUrl.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/\/$/, "");
    if (!clean) { setStoreUrlError("Please enter your Shopify store URL"); return; }
    if (!clean.includes(".")) { setStoreUrlError("Enter a valid URL, e.g. mystore.myshopify.com"); return; }
    setStoreUrlError("");
    setStoreUrl(clean);
    setConnectStep(2);
  };

  const handleAuthorize = () => {
    setIsAuthorizing(true);
    setTimeout(() => {
      setIsAuthorizing(false);
      setConnectStep(3);
    }, 2200);
  };

  const handleSync = () => {
    setIsSyncing(true);
    setSyncProgress(0);
    const steps = [12, 28, 45, 61, 74, 88, 100];
    steps.forEach((p, i) => setTimeout(() => {
      setSyncProgress(p);
      if (p === 100) setTimeout(() => { setIsSyncing(false); setShopifyConnected(true); }, 600);
    }, i * 380));
  };

  const toggleShowReady = (id) => {
    setProducts(ps => ps.map(p => p.id===id ? {...p, showReady:!p.showReady} : p));
  };

  // ── Pre-connection screen ─────────────────────────────────────────────────
  if (!shopifyConnected) {
    const STEPS = [
      { n:1, label:"Store URL",    icon:"🏪" },
      { n:2, label:"Install App",  icon:"📦" },
      { n:3, label:"Sync Catalog", icon:"⚡" },
    ];

    return (
      <div style={{ flex:1, overflowY:"auto", background:C.bg, display:"flex", alignItems:"center", justifyContent:"center", padding:"40px 24px", minHeight:0 }}>
        <div style={{ maxWidth:560, width:"100%" }}>

          {/* Header */}
          <div style={{ textAlign:"center", marginBottom:36 }}>
            <div style={{ width:64, height:64, borderRadius:18, background:"linear-gradient(135deg,#96BF48,#5A8E00)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:30, margin:"0 auto 16px", boxShadow:"0 8px 32px #96bf4840" }}>🛒</div>
            <div style={{ fontFamily:"'Syne',sans-serif", fontSize:24, fontWeight:800, color:C.text, letterSpacing:"-0.5px", marginBottom:6 }}>Connect your Shopify store</div>
            <div style={{ fontSize:13, color:C.muted, lineHeight:1.6 }}>Sync your products, inventory, and pricing to Streamlive. Takes about 60 seconds.</div>
          </div>

          {/* Step progress */}
          <div style={{ display:"flex", alignItems:"center", marginBottom:32 }}>
            {STEPS.map((s, i) => {
              const done    = connectStep > s.n;
              const current = connectStep === s.n;
              const sc      = "#96BF48";
              return (
                <React.Fragment key={s.n}>
                  <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:6, flex:1 }}>
                    <div style={{ width:36, height:36, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:done?13:13,
                      background:done?sc:current?`${sc}22`:C.surface2,
                      border:`2px solid ${done||current?sc:C.border2}`,
                      color:done?"#fff":current?sc:C.subtle, fontWeight:700, transition:"all .3s" }}>
                      {done ? "✓" : s.icon}
                    </div>
                    <div style={{ fontSize:9, fontWeight:700, color:current?sc:done?sc:C.subtle, textTransform:"uppercase", letterSpacing:"0.07em", whiteSpace:"nowrap" }}>{s.label}</div>
                  </div>
                  {i < STEPS.length-1 && (
                    <div style={{ flex:2, height:2, background:connectStep>s.n?sc:C.border2, transition:"background .4s", marginBottom:20, borderRadius:2 }}/>
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* STEP 1: Enter store URL */}
          {connectStep === 1 && (
            <div className="fade-up" style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:18, padding:28 }}>
              <div style={{ fontSize:15, fontWeight:700, color:C.text, marginBottom:4 }}>What's your Shopify store URL?</div>
              <div style={{ fontSize:11, color:C.muted, marginBottom:20, lineHeight:1.6 }}>Find it in your Shopify admin — it looks like <span style={{ fontFamily:"'JetBrains Mono',monospace", color:"#96BF48" }}>yourstore.myshopify.com</span></div>

              <div style={{ position:"relative", marginBottom:storeUrlError?8:20 }}>
                <div style={{ position:"absolute", left:14, top:"50%", transform:"translateY(-50%)", fontSize:11, color:C.muted, fontFamily:"'JetBrains Mono',monospace", pointerEvents:"none" }}>https://</div>
                <input value={storeUrl} onChange={e=>{ setStoreUrl(e.target.value); setStoreUrlError(""); }}
                  onKeyDown={e=>e.key==="Enter"&&validateStore()} placeholder="yourstore.myshopify.com"
                  style={{ width:"100%", background:"#07070f", border:`1px solid ${storeUrlError?"#ef4444":C.border2}`, borderRadius:10, padding:"11px 14px 11px 74px", color:C.text, fontSize:13, fontFamily:"'JetBrains Mono',monospace", outline:"none", boxSizing:"border-box" }} />
              </div>
              {storeUrlError && <div style={{ fontSize:10, color:"#ef4444", marginBottom:16 }}>⚠ {storeUrlError}</div>}

              <button onClick={validateStore}
                style={{ width:"100%", background:"linear-gradient(135deg,#96BF48,#5A8E00)", border:"none", color:"#fff", fontSize:14, fontWeight:700, padding:"13px", borderRadius:11, cursor:"pointer" }}>
                Continue →
              </button>
              <div style={{ marginTop:16, display:"flex", gap:16, justifyContent:"center" }}>
                {[["🔒","Secure OAuth"],["⚡","Read-only sync"],["🔄","Auto inventory updates"]].map(([icon,label])=>(
                  <div key={label} style={{ display:"flex", alignItems:"center", gap:5, fontSize:10, color:C.subtle }}><span>{icon}</span><span>{label}</span></div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: Install & authorize */}
          {connectStep === 2 && (
            <div className="fade-up" style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:18, padding:28 }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:16 }}>
                <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:11, color:"#96BF48", background:"#96BF4812", border:"1px solid #96BF4833", padding:"3px 10px", borderRadius:6 }}>{storeUrl}</div>
                <button onClick={()=>setConnectStep(1)} style={{ background:"none", border:"none", color:C.subtle, fontSize:11, cursor:"pointer" }}>✎ Edit</button>
              </div>
              <div style={{ fontSize:15, fontWeight:700, color:C.text, marginBottom:4 }}>Install the Streamlive app</div>
              <div style={{ fontSize:11, color:C.muted, marginBottom:20, lineHeight:1.6 }}>Install our Shopify app to authorize the connection. This grants read access to products, inventory, and orders.</div>

              <div style={{ background:"#07070f", border:`1px solid ${C.border2}`, borderRadius:12, padding:"16px 18px", marginBottom:20 }}>
                <div style={{ fontSize:10, fontWeight:700, color:C.muted, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:12 }}>Streamlive will request access to:</div>
                {[
                  ["📦","Products & variants",  "Read product titles, SKUs, prices, and images"],
                  ["📊","Inventory levels",      "Track real-time stock across all locations"],
                  ["📋","Orders (read-only)",    "Sync order status and fulfillment data"],
                  ["🏷️","Collections & tags",   "Mirror your Shopify catalog organization"],
                ].map(([icon,title,desc])=>(
                  <div key={title} style={{ display:"flex", gap:12, marginBottom:10, alignItems:"flex-start" }}>
                    <div style={{ width:30, height:30, borderRadius:8, background:"#96BF4812", border:"1px solid #96BF4822", display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, flexShrink:0 }}>{icon}</div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:12, fontWeight:600, color:C.text, marginBottom:1 }}>{title}</div>
                      <div style={{ fontSize:10, color:C.muted }}>{desc}</div>
                    </div>
                    <span style={{ color:"#96BF48", fontSize:12, flexShrink:0 }}>✓</span>
                  </div>
                ))}
                <div style={{ borderTop:`1px solid ${C.border}`, marginTop:4, paddingTop:10, fontSize:9, color:C.subtle }}>
                  🔒 Read-only · Streamlive will never modify, delete, or publish Shopify data without your approval
                </div>
              </div>

              {isAuthorizing ? (
                <button disabled style={{ width:"100%", background:"#96BF4822", border:"1px solid #96BF4433", color:"#96BF48", fontSize:14, fontWeight:700, padding:"13px", borderRadius:11, cursor:"default", display:"flex", alignItems:"center", justifyContent:"center", gap:10 }}>
                  <div style={{ width:14, height:14, border:"2px solid #96BF4444", borderTop:"2px solid #96BF48", borderRadius:"50%", animation:"spin .7s linear infinite" }}/>
                  Authorizing with Shopify…
                </button>
              ) : (
                <button onClick={handleAuthorize}
                  style={{ width:"100%", background:"linear-gradient(135deg,#96BF48,#5A8E00)", border:"none", color:"#fff", fontSize:14, fontWeight:700, padding:"13px", borderRadius:11, cursor:"pointer" }}>
                  Install & Authorize on Shopify →
                </button>
              )}
              <div style={{ marginTop:12, textAlign:"center", fontSize:10, color:C.subtle }}>You'll be briefly redirected to Shopify to confirm permissions</div>
            </div>
          )}

          {/* STEP 3: Sync */}
          {connectStep === 3 && (
            <div className="fade-up" style={{ background:C.surface, border:"1px solid #96BF4844", borderRadius:18, padding:28 }}>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:20 }}>
                <div style={{ width:36, height:36, borderRadius:10, background:"#96BF4818", border:"1px solid #96BF4844", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>✓</div>
                <div>
                  <div style={{ fontSize:13, fontWeight:700, color:"#96BF48" }}>Shopify authorized</div>
                  <div style={{ fontSize:10, color:C.muted }}>{storeUrl} · Connected as Store Owner</div>
                </div>
              </div>

              <div style={{ fontSize:15, fontWeight:700, color:C.text, marginBottom:4 }}>Import your catalog</div>
              <div style={{ fontSize:11, color:C.muted, marginBottom:20, lineHeight:1.6 }}>
                We found <span style={{ color:C.text, fontWeight:700 }}>247 products</span> across <span style={{ color:C.text, fontWeight:700 }}>12 collections</span> in your Shopify store.
              </div>

              <div style={{ background:"#07070f", border:`1px solid ${C.border2}`, borderRadius:12, padding:"12px 16px", marginBottom:20 }}>
                {[
                  { name:"Merino Wool Blazer",           sku:"BR-BLZ-001", price:"$228", inventory:48, img:"🧥" },
                  { name:"Silk Wrap Midi Dress",          sku:"BR-DRS-004", price:"$268", inventory:22, img:"👗" },
                  { name:"Spring Style Bundle (3pc)",     sku:"BR-BND-008", price:"$148", inventory:30, img:"🎁" },
                ].map((p, i, arr)=>(
                  <div key={p.sku} style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 0", borderBottom:i<arr.length-1?`1px solid #0d0d18`:"none" }}>
                    <span style={{ fontSize:18 }}>{p.img}</span>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:11, fontWeight:600, color:C.text, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{p.name}</div>
                      <div style={{ fontSize:9, fontFamily:"'JetBrains Mono',monospace", color:C.subtle }}>{p.sku}</div>
                    </div>
                    <div style={{ fontSize:11, fontFamily:"'JetBrains Mono',monospace", color:C.green, fontWeight:700 }}>{p.price}</div>
                    <div style={{ fontSize:9, color:C.muted }}>{p.inventory} in stock</div>
                  </div>
                ))}
                <div style={{ paddingTop:8, fontSize:9, color:C.subtle }}>+ 244 more products</div>
              </div>

              {isSyncing ? (
                <div>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
                    <span style={{ fontSize:11, color:C.muted }}>Importing products…</span>
                    <span style={{ fontSize:11, fontFamily:"'JetBrains Mono',monospace", color:"#96BF48", fontWeight:700 }}>{syncProgress}%</span>
                  </div>
                  <div style={{ height:6, background:C.surface2, borderRadius:3, overflow:"hidden", marginBottom:10 }}>
                    <div style={{ height:"100%", width:`${syncProgress}%`, background:"linear-gradient(90deg,#96BF48,#5A8E00)", borderRadius:3, transition:"width .35s ease" }}/>
                  </div>
                  <div style={{ fontSize:10, color:C.subtle, textAlign:"center" }}>
                    {syncProgress<30?"Reading product catalog…":syncProgress<60?"Importing inventory levels…":syncProgress<90?"Syncing images & metadata…":"Finalizing…"}
                  </div>
                </div>
              ) : (
                <button onClick={handleSync}
                  style={{ width:"100%", background:"linear-gradient(135deg,#96BF48,#5A8E00)", border:"none", color:"#fff", fontSize:14, fontWeight:700, padding:"13px", borderRadius:11, cursor:"pointer" }}>
                  ⚡ Import 247 Products
                </button>
              )}
            </div>
          )}

          <div style={{ textAlign:"center", marginTop:20, fontSize:10, color:C.subtle }}>
            Your Shopify data is never stored on third-party servers · <span style={{ color:"#96BF48" }}>Shopify Partner Program</span> certified
          </div>
        </div>
      </div>
    );
  }

  const filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter==="all" || (filter==="show-ready" && p.showReady) || (filter==="not-ready" && !p.showReady);
    const matchPlatform = selectedPlatform==="all" || p.platforms.includes(selectedPlatform);
    return matchSearch && matchFilter && matchPlatform;
  });

  const showReadyCount = products.filter(p=>p.showReady).length;

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100%", overflow:"hidden" }}>
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
      <div style={{ flex:1, overflowY:"auto", padding:"16px 28px" }}>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12 }}>
          {filtered.map(p=>(
            <div key={p.id} style={{ background:C.surface, border:`1px solid ${p.showReady?C.accent+"44":C.border}`, borderRadius:14, padding:"16px", transition:"border-color .15s" }}>
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
              <div style={{ fontSize:13, fontWeight:700, color:C.text, marginBottom:3, lineHeight:1.3 }}>{p.name}</div>
              <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10, color:C.subtle, marginBottom:10 }}>{p.sku}</div>
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
                {p.cost && (
                  <div>
                    <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:16, fontWeight:700, color:marginColor((p.price-p.cost)/p.price) }}>
                      {Math.round((p.price-p.cost)/p.price*100)}%
                    </div>
                    <div style={{ fontSize:9, color:C.muted }}>margin</div>
                  </div>
                )}
              </div>
              {/* Cost + max safe discount strip */}
              {p.cost && (
                <div style={{ display:"flex", gap:6, alignItems:"center", marginBottom:10, padding:"5px 8px", background:"#ffffff05", border:`1px solid ${C.border2}`, borderRadius:7 }}>
                  <span style={{ fontSize:9, color:C.subtle }}>Cost <span style={{ fontFamily:"'JetBrains Mono',monospace", color:C.muted }}>${p.cost}</span></span>
                  <div style={{ width:1, height:10, background:C.border }}/>
                  <span style={{ fontSize:9, color:C.subtle }}>Max safe disc <span style={{ fontFamily:"'JetBrains Mono',monospace", color:"#10b981", fontWeight:700 }}>{calcMaxSafeDisc(p.price,p.cost,"WN")}%</span></span>
                  <div style={{ width:1, height:10, background:C.border }}/>
                  <span style={{ fontSize:9, color:C.subtle }}>Break-even <span style={{ fontFamily:"'JetBrains Mono',monospace", color:C.muted }}>${p.cost}</span></span>
                </div>
              )}
              <div style={{ display:"flex", gap:4, marginBottom:12, flexWrap:"wrap" }}>
                {p.platforms.map(pl=><PlatformPill key={pl} code={pl} />)}
              </div>
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

// ─── SCREEN: SHOW PLANNER ──────────────────────────────────────────────────────
function ScreenShowPlanner({ navigate, persona }) {
  const [step, setStep] = useState(1);
  const [showName, setShowName] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState(["WN"]);
  const [selectedProducts, setSelectedProducts] = useState(
    UPCOMING_SHOW.aiSuggestedOrder.map(id=>PRODUCTS.find(p=>p.id===id)).filter(Boolean)
  );
  const [runOrder, setRunOrder] = useState(
    UPCOMING_SHOW.aiSuggestedOrder.map(id=>PRODUCTS.find(p=>p.id===id)).filter(Boolean)
  );
  const [perks, setPerks] = useState({
    earlyAccess: true, earlyMinutes: 15,
    newBuyerDiscount: true, newBuyerPct: 10,
    vipFirstPick: true, doublePoints: false,
    mysteryBonus: true, mysteryThreshold: 3,
  });

  const togglePlatform = (pid) => setSelectedPlatforms(prev =>
    prev.includes(pid) ? prev.filter(p=>p!==pid) : [...prev, pid]
  );

  const [productTimings, setProductTimings] = useState(() =>
    Object.fromEntries((UPCOMING_SHOW.aiSuggestedOrder.map(id=>PRODUCTS.find(p=>p.id===id)).filter(Boolean)).map(p=>[p.id, 90]))
  );
  const [globalTiming, setGlobalTiming] = useState(90);

  const setTimingForAll = (secs) => {
    const v = Math.max(30, Math.min(600, Number(secs)||90));
    setGlobalTiming(v);
    setProductTimings(prev => Object.fromEntries(Object.keys(prev).map(id=>[id, v])));
  };
  const setOneTiming = (id, secs) => {
    const v = Math.max(30, Math.min(600, Number(secs)||90));
    setProductTimings(prev => ({...prev, [id]: v}));
  };
  const moveUp   = (i) => { if(i===0) return; const a=[...runOrder]; [a[i-1],a[i]]=[a[i],a[i-1]]; setRunOrder(a); };
  const moveDown = (i) => { if(i===runOrder.length-1) return; const a=[...runOrder]; [a[i],a[i+1]]=[a[i+1],a[i]]; setRunOrder(a); };
  const remove   = (i) => { const p=runOrder[i]; setRunOrder(r=>r.filter((_,idx)=>idx!==i)); };
  const showReadyProducts = PRODUCTS.filter(p=>p.showReady);
  const PLANNER_PRESETS = [{label:"30s",secs:30},{label:"1m",secs:60},{label:"90s",secs:90},{label:"2m",secs:120},{label:"3m",secs:180},{label:"5m",secs:300}];
  const totalShowSecs = runOrder.reduce((a,p)=>a+(productTimings[p.id]||90),0);
  const steps = ["Choose Platforms","Select Products","Set Run Order","Show Perks","Go Live"];

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100%", overflow:"hidden" }}>
      <div style={{ padding:"16px 28px", borderBottom:`1px solid ${C.border}`, flexShrink:0, background:C.surface }}>
        <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:14 }}>
          <button onClick={()=>navigate("shows")} style={{ fontSize:11, color:C.muted, background:"none", border:"none", cursor:"pointer", padding:0 }}>← Back</button>
          <div style={{ fontFamily:"'Syne',sans-serif", fontSize:18, fontWeight:800, color:C.text }}>Show Planner</div>
          <div style={{ marginLeft:"auto" }}><PlatformPill code={UPCOMING_SHOW.platform} /></div>
        </div>
        <div style={{ fontSize:12, color:C.muted, marginBottom:14 }}>
          {showName
            ? <span><span style={{ color:C.text, fontWeight:600 }}>"{showName}"</span> · {UPCOMING_SHOW.date} at {UPCOMING_SHOW.time}</span>
            : `${UPCOMING_SHOW.title} · ${UPCOMING_SHOW.date} at ${UPCOMING_SHOW.time}`
          }
        </div>
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
      <div style={{ flex:1, overflowY:"auto", padding:"24px 28px" }}>
        {step===1 && (
          <div>
            {/* Show Name */}
            <div style={{ marginBottom:28 }}>
              <div style={{ fontSize:14, fontWeight:700, color:C.text, marginBottom:4 }}>What's the name of this show?</div>
              <div style={{ fontSize:12, color:C.muted, marginBottom:12 }}>Used in your analytics, show history, and marketing campaigns.</div>
              <input
                value={showName}
                onChange={e=>setShowName(e.target.value)}
                placeholder="e.g. Spring Drop #12, Friday Night Flash Sale, New Arrivals Haul…"
                style={{ width:"100%", maxWidth:520, background:C.surface, border:`1px solid ${showName?C.accent:C.border}`, borderRadius:10, padding:"12px 16px", fontSize:13, color:C.text, outline:"none", fontFamily:"inherit", boxSizing:"border-box", transition:"border-color .15s" }}
              />
              {showName && (
                <div style={{ marginTop:8, fontSize:11, color:C.green, display:"flex", alignItems:"center", gap:5 }}>
                  <span>✓</span><span style={{ fontWeight:600 }}>{showName}</span><span style={{ color:C.muted }}>— saved</span>
                </div>
              )}
            </div>

            <div style={{ fontSize:14, fontWeight:700, color:C.text, marginBottom:4 }}>Where are you streaming today?</div>
            <div style={{ fontSize:12, color:C.muted, marginBottom:20 }}>Select all platforms you'll go live on. You can multi-stream to multiple destinations at once.</div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, maxWidth:560 }}>
              {[
                { id:"WN", name:"Whatnot",       color:"#7c3aed", desc:"Live auction & buy-now",       icon:"◈" },
                { id:"TT", name:"TikTok Live",   color:"#f43f5e", desc:"Short-form + live shopping",   icon:"♦" },
                { id:"IG", name:"Instagram",     color:"#ec4899", desc:"Stories & live video",          icon:"●" },
                { id:"AM", name:"Amazon Live",   color:"#f59e0b", desc:"Product demos & shoppable",     icon:"◆" },
                { id:"YT", name:"YouTube Live",  color:"#ff0000", desc:"Long-form · Shopify attribution", icon:"▶" },
              ].map(pl => {
                const active = selectedPlatforms.includes(pl.id);
                return (
                  <div key={pl.id} onClick={()=>togglePlatform(pl.id)} style={{ display:"flex", alignItems:"center", gap:14, padding:"16px 18px", background:active?`${pl.color}12`:C.surface, border:`2px solid ${active?pl.color+"66":C.border}`, borderRadius:14, cursor:"pointer", transition:"all .15s" }}>
                    <div style={{ width:44, height:44, borderRadius:12, background:`${pl.color}22`, border:`1px solid ${pl.color}44`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, color:pl.color, flexShrink:0 }}>{pl.icon}</div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:13, fontWeight:700, color:C.text, marginBottom:2 }}>{pl.name}</div>
                      <div style={{ fontSize:11, color:C.muted }}>{pl.desc}</div>
                    </div>
                    <div style={{ width:22, height:22, borderRadius:"50%", background:active?pl.color:C.surface2, border:`2px solid ${active?pl.color:C.border2}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, color:"#fff", flexShrink:0 }}>{active?"✓":""}</div>
                  </div>
                );
              })}
            </div>
            {selectedPlatforms.length > 1 && (
              <div style={{ marginTop:16, display:"flex", alignItems:"center", gap:10, background:"#0a1e16", border:"1px solid #10b98133", borderRadius:10, padding:"10px 16px" }}>
                <span style={{ color:C.green, fontSize:13 }}>✦</span>
                <span style={{ fontSize:12, color:C.green, fontWeight:600 }}>Multi-stream enabled</span>
                <span style={{ fontSize:12, color:C.muted }}>— streaming to {selectedPlatforms.length} platforms simultaneously</span>
              </div>
            )}

            {/* YouTube Attribution Panel */}
            {selectedPlatforms.includes("YT") && (
              <div style={{ marginTop:16, background:"#1a0808", border:"1px solid #ff000033", borderRadius:12, padding:"16px 18px" }}>
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12 }}>
                  <span style={{ fontSize:13 }}>▶</span>
                  <span style={{ fontSize:12, fontWeight:700, color:"#ff6b6b" }}>YouTube Attribution Active</span>
                  <span style={{ fontSize:9, color:"#ff0000", background:"#ff000018", border:"1px solid #ff000033", padding:"2px 7px", borderRadius:5, marginLeft:"auto" }}>Shopify-powered</span>
                </div>
                <div style={{ fontSize:11, color:"#9ca3af", lineHeight:1.6, marginBottom:14 }}>
                  YouTube doesn't expose buyer data via API — Streamlive uses 3 methods to attribute your Shopify orders to this show.
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                  {[
                    { label:"Time-window (±15 min)", color:"#10b981", status:"Auto — on" },
                    { label:"UTM Link for live chat",  color:"#3b82f6", status:"Generated below" },
                    { label:"Post-show reconciliation", color:"#f59e0b", status:"In Order Review" },
                  ].map(m => (
                    <div key={m.label} style={{ display:"flex", alignItems:"center", gap:8 }}>
                      <div style={{ width:6, height:6, borderRadius:"50%", background:m.color, flexShrink:0 }} />
                      <span style={{ fontSize:11, color:C.text, flex:1 }}>{m.label}</span>
                      <span style={{ fontSize:10, color:m.color, fontWeight:600 }}>{m.status}</span>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop:14, background:"#0d0d1a", border:"1px solid #1e1e3a", borderRadius:8, padding:"10px 14px" }}>
                  <div style={{ fontSize:10, color:C.muted, marginBottom:6 }}>📌 Pin this link in your YouTube live chat</div>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <code style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:11, color:"#3b82f6", flex:1 }}>
                      strmlive.com/yt/br-{new Date().toISOString().slice(0,10)}
                    </code>
                    <button style={{ fontSize:10, fontWeight:700, color:"#3b82f6", background:"#0f1e2e", border:"1px solid #3b82f633", padding:"5px 12px", borderRadius:6, cursor:"pointer", flexShrink:0 }}>Copy</button>
                  </div>
                  <div style={{ fontSize:10, color:C.subtle, marginTop:6 }}>Orders from this link = 100% confidence attribution, no time window needed</div>
                </div>
              </div>
            )}
            <div style={{ marginTop:24, display:"flex", justifyContent:"flex-end", alignItems:"center", gap:12 }}>
              {!showName && <span style={{ fontSize:11, color:"#f59e0b" }}>⚠ Enter a show name to continue</span>}
              <button onClick={()=>setStep(2)} disabled={selectedPlatforms.length===0 || !showName.trim()} style={{ background:`linear-gradient(135deg,${C.accent},${C.accent2})`, border:"none", color:"#fff", fontSize:13, fontWeight:700, padding:"10px 28px", borderRadius:10, cursor:selectedPlatforms.length===0||!showName.trim()?"not-allowed":"pointer", opacity:selectedPlatforms.length===0||!showName.trim()?0.4:1 }}>
                Select Products →
              </button>
            </div>
          </div>
        )}
        {step===2 && (
          <div>
            <div style={{ fontSize:14, fontWeight:700, color:C.text, marginBottom:4 }}>Choose products for this show</div>
            <div style={{ fontSize:12, color:C.muted, marginBottom:16 }}>{selectedProducts.length} selected · AI recommends your show-ready items ranked by performance</div>
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
                    <div style={{ width:20, height:20, borderRadius:"50%", background:sel?C.accent:C.surface2, border:`2px solid ${sel?C.accent:C.border2}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, color:"#fff", flexShrink:0 }}>{sel?"✓":""}</div>
                  </div>
                );
              })}
            </div>
            <div style={{ marginTop:20, display:"flex", justifyContent:"flex-end" }}>
              <button onClick={()=>setStep(3)} disabled={selectedProducts.length===0} style={{ background:`linear-gradient(135deg,${C.accent},${C.accent2})`, border:"none", color:"#fff", fontSize:13, fontWeight:700, padding:"10px 28px", borderRadius:10, cursor:"pointer", opacity:selectedProducts.length===0?0.4:1 }}>
                Set Run Order ({selectedProducts.length} products) →
              </button>
            </div>
          </div>
        )}
        {step===3 && (
          <div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 340px", gap:20 }}>
              <div>
                <div style={{ fontSize:14, fontWeight:700, color:C.text, marginBottom:4 }}>Set your run order & timing</div>
                <div style={{ fontSize:11, color:C.muted, marginBottom:14 }}>AI sorted by predicted sales performance. Set how long to feature each product on the Live Shop and Host Briefing.</div>

                {/* ── Global timing control ── */}
                <div style={{ background:"#0a0a14", border:`1px solid ${C.accent}33`, borderRadius:12, padding:"14px 16px", marginBottom:14 }}>
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10 }}>
                    <div>
                      <div style={{ fontSize:12, fontWeight:700, color:C.text }}>⏱ Default time per product</div>
                      <div style={{ fontSize:10, color:C.muted, marginTop:1 }}>Applies to all products at once · override individually below</div>
                    </div>
                    <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:13, fontWeight:700, color:"#a78bfa" }}>
                      ~{Math.floor(totalShowSecs/60)}m {totalShowSecs%60}s total
                    </div>
                  </div>
                  <div style={{ display:"flex", gap:6, alignItems:"center", flexWrap:"wrap" }}>
                    {PLANNER_PRESETS.map(pt=>(
                      <button key={pt.secs} onClick={()=>setTimingForAll(pt.secs)}
                        style={{ padding:"6px 14px", borderRadius:7, cursor:"pointer", fontSize:11, fontWeight:700,
                          background: globalTiming===pt.secs ? "#1a0f2e" : C.surface2,
                          border:`1px solid ${globalTiming===pt.secs ? "#a78bfa66" : C.border}`,
                          color: globalTiming===pt.secs ? "#a78bfa" : C.muted }}>
                        {pt.label}
                      </button>
                    ))}
                    <div style={{ display:"flex", alignItems:"center", gap:5, marginLeft:"auto" }}>
                      <input type="number" min={30} max={600} value={globalTiming}
                        onChange={e=>setTimingForAll(e.target.value)}
                        style={{ width:56, background:C.surface, border:`1px solid ${C.border}`, borderRadius:7,
                          padding:"5px 8px", color:C.text, fontSize:11, fontFamily:"'JetBrains Mono',monospace",
                          textAlign:"center", outline:"none" }} />
                      <span style={{ fontSize:11, color:C.muted }}>sec</span>
                    </div>
                  </div>
                </div>

                {runOrder.map((p,i)=>{
                  const timing = productTimings[p.id] || 90;
                  const mins = Math.floor(timing/60), secs = timing%60;
                  const isCustom = timing !== globalTiming;
                  return (
                  <div key={p.id} style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:11, marginBottom:8, overflow:"hidden" }}>
                    {/* Product row */}
                    <div style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 14px" }}>
                      <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:13, fontWeight:700, color:C.accent, width:24, textAlign:"center", flexShrink:0 }}>{i+1}</div>
                      <div style={{ fontSize:18, flexShrink:0 }}>{p.image}</div>
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:12, fontWeight:600, color:C.text }}>{p.name}</div>
                        <div style={{ fontSize:10, color:C.muted }}>${p.price} · {p.inventory} in stock · AI: {p.aiScore}</div>
                      </div>
                      {/* Per-product timer badge */}
                      <div style={{ display:"flex", alignItems:"center", gap:5, background:"#1a0f2e", border:`1px solid ${isCustom?"#a78bfa55":"#a78bfa22"}`, borderRadius:7, padding:"4px 9px", flexShrink:0 }}>
                        <span style={{ fontSize:9, color: isCustom?"#a78bfa":"#6b7280" }}>⏱</span>
                        <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10, fontWeight:700, color: isCustom?"#a78bfa":"#6b7280" }}>
                          {mins>0?`${mins}m `:""}{secs}s
                        </span>
                      </div>
                      <div style={{ display:"flex", gap:4 }}>
                        <button onClick={()=>moveUp(i)} style={{ background:C.surface2, border:`1px solid ${C.border}`, color:C.muted, fontSize:11, width:26, height:26, borderRadius:6, cursor:"pointer" }}>↑</button>
                        <button onClick={()=>moveDown(i)} style={{ background:C.surface2, border:`1px solid ${C.border}`, color:C.muted, fontSize:11, width:26, height:26, borderRadius:6, cursor:"pointer" }}>↓</button>
                        <button onClick={()=>remove(i)} style={{ background:"#1c0f0f", border:"1px solid #ef444433", color:"#f87171", fontSize:11, width:26, height:26, borderRadius:6, cursor:"pointer" }}>✕</button>
                      </div>
                    </div>
                    {/* Per-product timing row */}
                    <div style={{ display:"flex", alignItems:"center", gap:5, padding:"6px 14px 10px", borderTop:`1px solid ${C.border}44` }}>
                      <span style={{ fontSize:9, color:C.muted, flexShrink:0 }}>Override:</span>
                      {PLANNER_PRESETS.map(pt=>(
                        <button key={pt.secs} onClick={()=>setOneTiming(p.id, pt.secs)}
                          style={{ padding:"2px 8px", borderRadius:5, cursor:"pointer", fontSize:9, fontWeight:700,
                            background: timing===pt.secs ? "#1a0f2e" : "#0a0a14",
                            border:`1px solid ${timing===pt.secs ? "#a78bfa55" : "#1e1e3a"}`,
                            color: timing===pt.secs ? "#a78bfa" : C.muted }}>
                          {pt.label}
                        </button>
                      ))}
                      <input type="number" min={30} max={600} value={timing}
                        onChange={e=>setOneTiming(p.id, e.target.value)}
                        style={{ width:46, background:"#0a0a14", border:`1px solid #1e1e3a`,
                          borderRadius:5, padding:"2px 6px", color:C.text, fontSize:9,
                          fontFamily:"'JetBrains Mono',monospace", textAlign:"center", outline:"none", marginLeft:"auto" }} />
                      <span style={{ fontSize:9, color:C.muted }}>s</span>
                    </div>
                  </div>
                  );
                })}
              </div>
              <div>
                <div style={{ background:"#2d1f5e18", border:`1px solid ${C.accent}33`, borderRadius:14, padding:"16px 18px", marginBottom:14 }}>
                  <div style={{ fontSize:10, fontWeight:700, color:"#a78bfa", textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:10 }}>✦ AI Show Strategy</div>
                  <div style={{ fontSize:12, color:"#9ca3af", lineHeight:1.65 }}>Opening with the Spring Style Bundle drives the highest bundle attachment — 6.8 units/show on average. Following with the Silk Wrap Dress creates urgency early while live viewers are most engaged.</div>
                </div>
                <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:14, padding:"16px 18px" }}>
                  <div style={{ fontSize:10, fontWeight:700, color:C.muted, textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:10 }}>Projected Performance</div>
                  {[
                    { label:"Est. GMV",      value:`$${UPCOMING_SHOW.estimatedGMV.toLocaleString()}`, color:C.green },
                    { label:"Est. Buyers",   value:UPCOMING_SHOW.estimatedBuyers,                     color:C.text },
                    { label:"Products",      value:runOrder.length,                                   color:"#a78bfa" },
                    { label:"Est. Duration", value:`${Math.floor(totalShowSecs/60)}m ${totalShowSecs%60}s`,  color:C.muted },
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
              <button onClick={()=>setStep(2)} style={{ background:C.surface, border:`1px solid ${C.border}`, color:C.muted, fontSize:12, fontWeight:600, padding:"9px 20px", borderRadius:9, cursor:"pointer" }}>← Back</button>
              <button onClick={()=>setStep(4)} style={{ background:`linear-gradient(135deg,${C.accent},${C.accent2})`, border:"none", color:"#fff", fontSize:13, fontWeight:700, padding:"10px 28px", borderRadius:10, cursor:"pointer" }}>Set Show Perks →</button>
            </div>
          </div>
        )}
        {step===4 && (
          <div style={{ maxWidth:680 }}>
            <div style={{ fontSize:14, fontWeight:700, color:C.text, marginBottom:4 }}>Configure perks for this show</div>
            <div style={{ fontSize:12, color:C.muted, marginBottom:20 }}>These apply only to this show. Your default loyalty tiers always apply.</div>
            {[
              { key:"earlyAccess",     icon:"⏰", title:"VIP Early Access",           desc:"Let VIP buyers into the show early" },
              { key:"newBuyerDiscount",icon:"🎁", title:"New Buyer Welcome Discount",  desc:"First-time buyers get an instant discount" },
              { key:"vipFirstPick",    icon:"👑", title:"VIP First Pick",              desc:"VIP tier buyers get first pick on limited items" },
              { key:"doublePoints",    icon:"⚡", title:"Double Points Show",          desc:"All buyers earn 2× loyalty points tonight" },
              { key:"mysteryBonus",    icon:"🎲", title:"Mystery Bonus at Threshold",  desc:"Buyers who purchase X+ items get a mystery bonus" },
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
              </div>
            ))}
            <div style={{ marginTop:20, display:"flex", gap:10, justifyContent:"flex-end" }}>
              <button onClick={()=>setStep(3)} style={{ background:C.surface, border:`1px solid ${C.border}`, color:C.muted, fontSize:12, fontWeight:600, padding:"9px 20px", borderRadius:9, cursor:"pointer" }}>← Back</button>
              <button onClick={()=>setStep(5)} style={{ background:`linear-gradient(135deg,${C.accent},${C.accent2})`, border:"none", color:"#fff", fontSize:13, fontWeight:700, padding:"10px 28px", borderRadius:10, cursor:"pointer" }}>Review & Confirm →</button>
            </div>
          </div>
        )}
        {step===5 && (
          <div style={{ maxWidth:620 }}>
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
              {runOrder.map((p,i)=>{
                const t=productTimings[p.id]||90;
                const tm=Math.floor(t/60), ts=t%60;
                return (
                <div key={p.id} style={{ display:"flex", gap:10, alignItems:"center", marginBottom:6 }}>
                  <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:11, color:C.accent, width:18 }}>{i+1}.</span>
                  <span style={{ fontSize:11 }}>{p.image}</span>
                  <span style={{ fontSize:12, color:C.text, flex:1 }}>{p.name}</span>
                  <span style={{ fontSize:9, color:"#a78bfa", background:"#1a0f2e", border:"1px solid #a78bfa33", borderRadius:5, padding:"2px 7px", fontFamily:"'JetBrains Mono',monospace" }}>⏱ {tm>0?`${tm}m `:""}{ts}s</span>
                  <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:11, color:C.green }}>${p.price}</span>
                </div>
                );
              })}
            </div>
            <div style={{ display:"flex", gap:10 }}>
              <button onClick={()=>setStep(4)} style={{ flex:0, background:C.surface, border:`1px solid ${C.border}`, color:C.muted, fontSize:12, fontWeight:600, padding:"10px 20px", borderRadius:9, cursor:"pointer" }}>← Edit</button>
              <button onClick={()=>navigate("live",{selectedPlatforms,runOrder,showName,persona,productTimings,showStartTime:Date.now()})} style={{ flex:1, background:"linear-gradient(135deg,#10b981,#059669)", border:"none", color:"#fff", fontSize:14, fontWeight:700, padding:"12px", borderRadius:10, cursor:"pointer" }}>
                🔴 Go Live Now
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── SCREEN: ORDER REVIEW ──────────────────────────────────────────────────────
function ScreenOrderReview({ params, navigate, onShowComplete }) {
  const { liveBuyers=[], buyerNotes={}, buyerDiscounts={}, buyerPerks={}, buyerItems={}, gmv=0, elapsed=0 } = params || {};
  const [processed, setProcessed] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [expandedId, setExpandedId] = useState(null);

  // YouTube post-show reconciliation state
  const isYTShow = params?.platform === "YT" || (liveBuyers.length > 0 && liveBuyers[0]?.platform === "YT");
  const [ytReconcile, setYtReconcile] = useState(isYTShow ? [
    { id:"ytord_1", name:"Sarah M.",    email:"sarah.m@gmail.com",    product:"Merino Wool Blazer",    amount:228, time:"2:14pm", confidence:"medium", status:"pending" },
    { id:"ytord_2", name:"James K.",    email:"jk2891@outlook.com",   product:"Italian Linen Trousers", amount:148, time:"2:31pm", confidence:"low",    status:"pending" },
  ] : []);
  const confirmYT  = (id) => setYtReconcile(r => r.map(o => o.id===id ? {...o, status:"confirmed"} : o));
  const dismissYT  = (id) => setYtReconcile(r => r.map(o => o.id===id ? {...o, status:"dismissed"} : o));
  const pendingYT  = ytReconcile.filter(o => o.status==="pending");


  const fmt = (s) => `${String(Math.floor(s/3600)).padStart(2,"0")}:${String(Math.floor((s%3600)/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;

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

  const totalChanges  = orders.filter(o=>o.hasChanges).length;
  const totalAddedGMV = orders.reduce((a,o)=>a+o.addedGMV,0);

  const buildCompletedShow = () => {
    const now      = new Date();
    const dateStr  = now.toLocaleDateString("en-US", { month:"short", day:"numeric", year:"numeric" });
    const platforms= [...new Set(liveBuyers.map(b=>b.platform).filter(Boolean))];
    const platform = platforms[0] || "WN";
    const newBuyers= liveBuyers.filter(b=>b.status==="new").length;
    const repeatBuyers = liveBuyers.filter(b=>b.status!=="new").length;
    const repeatRate = liveBuyers.length > 0 ? Math.round(repeatBuyers / liveBuyers.length * 100) : 0;
    const finalGMV = gmv + totalAddedGMV;
    const durationSecs = elapsed;
    const hrs  = Math.floor(durationSecs/3600);
    const mins = Math.floor((durationSecs%3600)/60);
    const durationStr = hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;
    const topItemId = (() => {
      const counts = {};
      Object.values(buyerItems).flat().forEach(id => { counts[id]=(counts[id]||0)+1; });
      const topId = Object.entries(counts).sort((a,b)=>b[1]-a[1])[0]?.[0];
      return PRODUCTS.find(p=>p.id===topId)?.name || (PRODUCTS.find(p=>p.showReady)?.name || "—");
    })();
    return {
      id:      `sh_live_${Date.now()}`,
      title:   params?.showName ? params.showName : `Live Show — ${dateStr}`,
      date:    dateStr,
      platform,
      platforms,
      gmv:     finalGMV,
      buyers:  params?.orderCount || liveBuyers.length,
      repeatRate,
      duration: durationStr,
      newBuyers,
      topItem: topItemId,
      aiDebrief: `Show completed — ${liveBuyers.length} buyers, $${finalGMV.toLocaleString()} GMV, ${totalChanges} order${totalChanges!==1?"s":""} processed.`,
      isNew:   true,
    };
  };

  const processAll = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setProcessed(true);
      if (onShowComplete) onShowComplete(buildCompletedShow());
    }, 2200);
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100%", overflow:"hidden", position:"relative" }}>

      {/* ── SUCCESS OVERLAY ── */}
      {processed && (
        <div style={{ position:"absolute", inset:0, zIndex:50, background:"rgba(6,6,14,0.85)", backdropFilter:"blur(6px)", display:"flex", alignItems:"center", justifyContent:"center" }}>
          <div className="pop-in" style={{ background:C.surface, border:"1px solid #10b98155", borderRadius:20, padding:"48px 56px", textAlign:"center", maxWidth:440, width:"90%" }}>
            <div style={{ fontSize:52, marginBottom:16 }}>🎉</div>
            <div style={{ fontFamily:"'Syne',sans-serif", fontSize:26, fontWeight:800, color:C.text, letterSpacing:"-0.5px", marginBottom:8 }}>All done!</div>
            <div style={{ fontSize:14, color:C.muted, lineHeight:1.6, marginBottom:8 }}>
              {totalChanges} order{totalChanges!==1?"s":""} processed · <span style={{ color:C.green, fontWeight:700 }}>+${totalAddedGMV}</span> added GMV
            </div>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:8, marginBottom:32 }}>
              <div style={{ width:8, height:8, borderRadius:"50%", background:C.green }} />
              <span style={{ fontSize:12, color:C.green, fontWeight:600 }}>All changes synced to Shopify</span>
            </div>
            <div style={{ display:"flex", gap:12, justifyContent:"center" }}>
              <button onClick={()=>{ if (onShowComplete) onShowComplete(buildCompletedShow()); navigate("shows"); }} style={{ background:C.surface2, border:`1px solid ${C.border2}`, color:C.muted, fontSize:13, fontWeight:600, padding:"11px 24px", borderRadius:10, cursor:"pointer" }}>← Back to Shows</button>
              <button onClick={()=>{ if (onShowComplete) onShowComplete(buildCompletedShow()); navigate("dashboard"); }} style={{ background:`linear-gradient(135deg,${C.accent},${C.accent2})`, border:"none", color:"#fff", fontSize:13, fontWeight:700, padding:"11px 28px", borderRadius:10, cursor:"pointer" }}>View Dashboard →</button>
            </div>
          </div>
        </div>
      )}

      <div style={{ padding:"16px 28px", borderBottom:`1px solid ${C.border}`, flexShrink:0, background:C.surface }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:14 }}>
          <div>
            <div style={{ fontFamily:"'Syne',sans-serif", fontSize:20, fontWeight:800, color:C.text, letterSpacing:"-0.4px" }}>Order Review</div>
            <div style={{ fontSize:12, color:C.muted, marginTop:2 }}>Review all changes before processing.</div>
          </div>
          {!processed && (
            <button
              onClick={totalChanges > 0 ? processAll : () => { if (onShowComplete) onShowComplete(buildCompletedShow()); navigate("shows"); }}
              disabled={processing}
              style={{ background: totalChanges > 0 ? `linear-gradient(135deg,${C.green},#059669)` : `linear-gradient(135deg,#a78bfa,#7c3aed)`, border:"none", color:"#fff", fontSize:13, fontWeight:700, padding:"11px 28px", borderRadius:10, cursor:"pointer", minWidth:180 }}>
              {processing ? "Processing…" : totalChanges > 0 ? `Process All Changes (${totalChanges})` : "Done — View Shows →"}
            </button>
          )}
          {processed && <div style={{ display:"flex", alignItems:"center", gap:8, background:"#0a1e16", border:"1px solid #10b98144", borderRadius:10, padding:"10px 18px" }}><span style={{ fontSize:14, color:C.green }}>✓</span><span style={{ fontSize:13, fontWeight:700, color:C.green }}>All changes processed!</span></div>}
        </div>
        <div style={{ display:"flex", gap:12 }}>
          {[
            { label:"Total Buyers",  value:liveBuyers.length,          color:C.accent  },
            { label:"Show GMV",      value:`$${gmv.toLocaleString()}`, color:C.green   },
            { label:"Added GMV",     value:`+$${totalAddedGMV}`,       color:C.green   },
            { label:"With Changes",  value:totalChanges,               color:"#a78bfa" },
          ].map(s=>(
            <div key={s.label} style={{ background:C.surface2, border:`1px solid ${C.border}`, borderRadius:9, padding:"8px 14px" }}>
              <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:16, fontWeight:700, color:s.color }}>{s.value}</div>
              <div style={{ fontSize:9, color:C.muted, marginTop:1 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ flex:1, overflowY:"auto", padding:"16px 28px" }}>

        {/* ── YOUTUBE RECONCILIATION PANEL ── */}
        {isYTShow && ytReconcile.length > 0 && (
          <div style={{ background:"#0d0812", border:"1px solid #ff000033", borderRadius:14, padding:"16px 20px", marginBottom:20 }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:4 }}>
              <div style={{ width:26, height:26, borderRadius:7, background:"#ff000018", border:"1px solid #ff000033", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12 }}>▶</div>
              <div style={{ flex:1 }}>
                <span style={{ fontSize:13, fontWeight:700, color:"#ff6b6b" }}>YouTube Order Reconciliation</span>
                <span style={{ fontSize:10, color:C.muted, marginLeft:8 }}>Method 3 of 3 — manual confirm</span>
              </div>
              {pendingYT.length > 0
                ? <span style={{ fontSize:10, fontWeight:700, color:"#f59e0b", background:"#f59e0b18", border:"1px solid #f59e0b33", padding:"3px 10px", borderRadius:99 }}>{pendingYT.length} pending</span>
                : <span style={{ fontSize:10, fontWeight:700, color:C.green, background:"#10b98118", border:"1px solid #10b98133", padding:"3px 10px", borderRadius:99 }}>✓ All resolved</span>
              }
            </div>
            <div style={{ fontSize:11, color:C.muted, marginBottom:14, lineHeight:1.5 }}>
              These Shopify orders weren't captured by time-window or UTM attribution. Confirm to attribute them to this show, or dismiss if they're unrelated.
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              {ytReconcile.map(order => (
                <div key={order.id} style={{ background:C.surface, border:`1px solid ${order.status==="confirmed"?C.green+"44":order.status==="dismissed"?"#ef444433":C.border}`, borderRadius:10, padding:"12px 16px", display:"flex", alignItems:"center", gap:14, opacity:order.status!=="pending"?0.6:1 }}>
                  <div style={{ flex:1 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:3 }}>
                      <span style={{ fontSize:12, fontWeight:700, color:C.text }}>{order.name}</span>
                      <span style={{ fontSize:9, color:C.muted }}>{order.email}</span>
                      <span style={{ fontSize:9, fontWeight:600, color:order.confidence==="medium"?"#f59e0b":"#9ca3af", background:order.confidence==="medium"?"#f59e0b18":"#1a1a2e", border:`1px solid ${order.confidence==="medium"?"#f59e0b33":"#2a2a4a"}`, padding:"1px 6px", borderRadius:4, marginLeft:"auto" }}>
                        {order.confidence} confidence
                      </span>
                    </div>
                    <div style={{ fontSize:11, color:C.muted }}>{order.product} · <span style={{ fontFamily:"'JetBrains Mono',monospace", color:C.green, fontWeight:700 }}>${order.amount}</span> · placed at {order.time}</div>
                  </div>
                  {order.status === "pending" ? (
                    <div style={{ display:"flex", gap:6 }}>
                      <button onClick={()=>confirmYT(order.id)} style={{ fontSize:11, fontWeight:700, color:"#fff", background:`linear-gradient(135deg,${C.green},#059669)`, border:"none", padding:"6px 14px", borderRadius:7, cursor:"pointer" }}>✓ Confirm</button>
                      <button onClick={()=>dismissYT(order.id)} style={{ fontSize:11, fontWeight:600, color:"#f87171", background:"#1c0f0f", border:"1px solid #ef444433", padding:"6px 14px", borderRadius:7, cursor:"pointer" }}>Dismiss</button>
                    </div>
                  ) : (
                    <span style={{ fontSize:11, fontWeight:700, color:order.status==="confirmed"?C.green:"#ef4444" }}>
                      {order.status==="confirmed" ? "✓ Attributed" : "✕ Dismissed"}
                    </span>
                  )}
                </div>
              ))}
            </div>
            {ytReconcile.filter(o=>o.status==="confirmed").length > 0 && (
              <div style={{ marginTop:12, fontSize:11, color:C.green, padding:"8px 12px", background:"#10b98110", border:"1px solid #10b98133", borderRadius:8 }}>
                ✓ {ytReconcile.filter(o=>o.status==="confirmed").length} order{ytReconcile.filter(o=>o.status==="confirmed").length!==1?"s":""} confirmed · +${ytReconcile.filter(o=>o.status==="confirmed").reduce((a,o)=>a+o.amount,0).toLocaleString()} added to show GMV
              </div>
            )}
          </div>
        )}

        {[...orders.filter(o=>o.hasChanges), ...orders.filter(o=>!o.hasChanges)].map((order,i)=>{
          const { buyer:b, discount, items, note, tier, hasChanges } = order;
          const pl = PLATFORMS[b.platform];
          const isExpanded = expandedId===b.id;
          return (
            <div key={b.id} style={{ background:hasChanges?C.surface:"#070710", border:`1px solid ${hasChanges?C.border2:C.border}`, borderRadius:14, marginBottom:8, overflow:"hidden", opacity:!hasChanges?0.5:1 }}>
              <div onClick={()=>hasChanges&&setExpandedId(isExpanded?null:b.id)} style={{ display:"flex", alignItems:"center", gap:12, padding:"13px 18px", cursor:hasChanges?"pointer":"default" }}>
                <Avatar initials={b.avatar} color={pl?.color} size={32} />
                <div style={{ flex:1 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:3 }}>
                    <span style={{ fontSize:13, fontWeight:700, color:C.text }}>{b.name}</span>
                    {tier && <span style={{ fontSize:10 }}>{tier.icon}</span>}
                    <PlatformPill code={b.platform} />
                    {!hasChanges && <span style={{ fontSize:10, color:C.muted }}>— no changes</span>}
                  </div>
                  <div style={{ display:"flex", gap:6 }}>
                    {discount>0 && <span style={{ fontSize:9, fontWeight:700, color:C.green, background:"#0a1e16", border:"1px solid #10b98133", padding:"1px 7px", borderRadius:5 }}>{discount}% OFF</span>}
                    {items.length>0 && <span style={{ fontSize:9, fontWeight:700, color:C.amber, background:"#1e1206", border:"1px solid #d9770633", padding:"1px 7px", borderRadius:5 }}>+{items.length} items</span>}
                    {note && <span style={{ fontSize:9, fontWeight:700, color:"#60a5fa", background:"#0f1e2e", border:"1px solid #3b82f633", padding:"1px 7px", borderRadius:5 }}>📝 Note</span>}
                  </div>
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                  {items.length>0 && <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:12, fontWeight:700, color:C.green }}>+${items.reduce((a,p)=>a+p.price,0)}</span>}
                  {processed && hasChanges && <span style={{ fontSize:11, fontWeight:700, color:C.green }}>✓ Processed</span>}
                  {hasChanges && <span style={{ fontSize:11, color:C.muted }}>{isExpanded?"▲":"▼"}</span>}
                </div>
              </div>
              {isExpanded && hasChanges && (
                <div style={{ borderTop:`1px solid ${C.border}`, padding:"14px 18px", background:"#080812" }}>
                  {discount>0 && <div style={{ marginBottom:10, fontSize:12, color:"#9ca3af" }}>Discount: {discount}% off applied</div>}
                  {items.length>0 && items.map(p=>(
                    <div key={p.id} style={{ display:"flex", justifyContent:"space-between", padding:"6px 10px", background:C.surface, border:`1px solid ${C.border}`, borderRadius:8, marginBottom:5 }}>
                      <span style={{ fontSize:11, color:C.text }}>{p.image} {p.name}</span>
                      <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:11, fontWeight:700, color:C.green }}>${p.price}</span>
                    </div>
                  ))}
                  {note && <div style={{ fontSize:12, color:"#9ca3af", fontStyle:"italic", marginTop:8 }}>Note: "{note}"</div>}
                </div>
              )}
            </div>
          );
        })}

        {liveBuyers.length===0 && (
          <div style={{ textAlign:"center", padding:"60px 0", color:C.muted }}>
            <div style={{ fontSize:32, marginBottom:12 }}>📋</div>
            <div style={{ fontSize:14, fontWeight:600, color:C.text, marginBottom:6 }}>No orders from this show</div>
            <button onClick={()=>navigate("shows")} style={{ marginTop:16, background:C.surface, border:`1px solid ${C.border}`, color:C.muted, fontSize:12, fontWeight:600, padding:"8px 20px", borderRadius:9, cursor:"pointer" }}>← Back to Shows</button>
          </div>
        )}
      </div>
    </div>
  );
}


// ─── ANALYTICS CHART HELPERS (top-level for React fast-refresh) ─────────────
// ── SVG CHART HELPERS ────────────────────────────────────────────────────────
const BarChart = ({ data, color="#7c3aed", height=80, showLabels=true }) => {
  const max = Math.max(...data.map(d=>d.value));
  const w = 100/data.length;
  return (
    <svg width="100%" height={height+24} style={{ overflow:"visible" }}>
      {data.map((d,i)=>{
        const barH = max>0 ? (d.value/max)*(height-4) : 0;
        const x = i*w + w*0.15;
        const barW = w*0.7;
        return (
          <g key={i}>
            <rect x={`${x}%`} y={height-barH} width={`${barW}%`} height={barH}
              fill={d.color||color} rx="3" opacity="0.9" />
            {showLabels && (
              <text x={`${x+barW/2}%`} y={height+16} textAnchor="middle"
                fontSize="8" fill="#6b7280">{d.label}</text>
            )}
            {d.value>0 && (
              <text x={`${x+barW/2}%`} y={height-barH-4} textAnchor="middle"
                fontSize="8" fill="#9ca3af" fontWeight="600">
                {d.prefix||""}{d.value>=1000?`${(d.value/1000).toFixed(1)}k`:d.value}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
};

const LineChart = ({ data, color="#10b981", height=80 }) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max-min||1;
  const W = 100;
  const pts = data.map((v,i) => ({
    x: (i/(data.length-1))*W,
    y: height-((v-min)/range)*(height-10)-5,
  }));

  // Build smooth cubic bezier path
  const smooth = pts.reduce((acc, p, i) => {
    if (i === 0) return `M ${p.x},${p.y}`;
    const prev = pts[i-1];
    const cpx = (prev.x + p.x) / 2;
    return `${acc} C ${cpx},${prev.y} ${cpx},${p.y} ${p.x},${p.y}`;
  }, "");

  const area = `${smooth} L ${W},${height} L 0,${height} Z`;

  return (
    <svg width="100%" height={height} viewBox={`0 0 ${W} ${height}`} preserveAspectRatio="none" style={{ display:"block" }}>
      <defs>
        <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25"/>
          <stop offset="100%" stopColor={color} stopOpacity="0"/>
        </linearGradient>
      </defs>
      <path d={area} fill="url(#lineGrad)" />
      <path d={smooth} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke"/>
      {pts.map((p,i) => (
        <circle key={i} cx={p.x} cy={p.y} r="1.5" fill={color} vectorEffect="non-scaling-stroke"/>
      ))}
    </svg>
  );
};

const DonutChart = ({ segments, size=120 }) => {
  const total = segments.reduce((a,s)=>a+s.value,0);
  const r = 44; const cx = size/2; const cy = size/2;
  let cumAngle = -90;
  const slices = segments.map(s=>{
    const angle = (s.value/total)*360;
    const startRad = (cumAngle*Math.PI)/180;
    const endRad   = ((cumAngle+angle)*Math.PI)/180;
    const x1 = cx + r*Math.cos(startRad);
    const y1 = cy + r*Math.sin(startRad);
    const x2 = cx + r*Math.cos(endRad);
    const y2 = cy + r*Math.sin(endRad);
    const large = angle>180?1:0;
    const path = `M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${large},1 ${x2},${y2} Z`;
    cumAngle += angle;
    return { ...s, path };
  });
  return (
    <svg width={size} height={size}>
      <circle cx={cx} cy={cy} r={r} fill="transparent" />
      {slices.map((s,i)=>(
        <path key={i} d={s.path} fill={s.color} opacity="0.9" />
      ))}
      <circle cx={cx} cy={cy} r={28} fill="#0a0a15" />
    </svg>
  );
};

const HBar = ({ value, max, color, label, suffix="" }) => (
  <div style={{ marginBottom:10 }}>
    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
      <span style={{ fontSize:11, color:C.muted }}>{label}</span>
      <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:11, fontWeight:700, color }}>{value}{suffix}</span>
    </div>
    <div style={{ height:6, background:C.surface2, borderRadius:3, overflow:"hidden" }}>
      <div style={{ width:`${(value/max)*100}%`, height:"100%", background:color, borderRadius:3, transition:"width .6s ease" }} />
    </div>
  </div>
);

const KPI = ({ label, value, sub, color="#7c3aed", trend }) => (
  <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:14, padding:"16px 18px" }}>
    <div style={{ fontSize:10, color:C.muted, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:8 }}>{label}</div>
    <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:22, fontWeight:800, color, marginBottom:4 }}>{value}</div>
    <div style={{ display:"flex", alignItems:"center", gap:6 }}>
      {trend && <span style={{ fontSize:10, fontWeight:700, color:trend>0?C.green:"#ef4444" }}>{trend>0?`↑ +${trend}%`:`↓ ${trend}%`}</span>}
      {sub && <span style={{ fontSize:10, color:C.subtle }}>{sub}</span>}
    </div>
  </div>
);

// ─── SCREEN: ANALYTICS ────────────────────────────────────────────────────────
function ScreenAnalytics({ buyers, persona, navigate }) {
  const [tab, setTab]           = useState("overview");
  const [aiExpanded, setAiExpanded] = useState(null);
  const [dateRange, setDateRange]   = useState("30d");

  // ── DERIVED METRICS ──────────────────────────────────────────────────────────
  const totalGMV       = SHOWS.reduce((a,s)=>a+s.gmv,0);
  const totalBuyers    = buyers.length;
  const totalOrders    = buyers.reduce((a,b)=>a+b.orders,0);
  const avgOrderValue  = Math.round(totalGMV / totalOrders);
  const avgRepeatRate  = Math.round(SHOWS.reduce((a,s)=>a+s.repeatRate,0)/SHOWS.length);
  const vipBuyers      = buyers.filter(b=>b.status==="vip");
  const vipGMV         = vipBuyers.reduce((a,b)=>a+b.spend,0);
  const avgLTV         = Math.round(buyers.reduce((a,b)=>a+b.spend,0)/buyers.length);
  const topLTV         = Math.max(...buyers.map(b=>b.spend));
  const campaignGMV    = CAMPAIGNS.filter(c=>c.status==="sent").reduce((a,c)=>a+c.gmv,0);
  const totalCampaignRecipients = CAMPAIGNS.filter(c=>c.status==="sent").reduce((a,c)=>a+c.recipients,0);
  const avgConvRate    = Math.round(CAMPAIGNS.filter(c=>c.status==="sent"&&c.recipients>0).reduce((a,c)=>a+(c.converted/c.recipients*100),0)/CAMPAIGNS.filter(c=>c.status==="sent").length);

  // Platform breakdown
  const platformGMV = { WN:0, TT:0, AM:0, IG:0 };
  SHOWS.forEach(s=>{ platformGMV[s.platform]=(platformGMV[s.platform]||0)+s.gmv; });
  const platformBuyers = { WN:0, TT:0, AM:0, IG:0 };
  buyers.forEach(b=>{ platformBuyers[b.platform]=(platformBuyers[b.platform]||0)+1; });

  // Status breakdown
  const statusCounts = { vip:0, active:0, risk:0, dormant:0, new:0 };
  buyers.forEach(b=>{ statusCounts[b.status]=(statusCounts[b.status]||0)+1; });

  // Category breakdown
  const catSpend = {};
  buyers.forEach(b=>{ catSpend[b.category]=(catSpend[b.category]||0)+b.spend; });

  // 8-week simulated GMV trend
  const gmvTrend = [2800,3100,2600,3800,4200,3900,4820,5100];
  const gmvWeeks = ["Jan 2","Jan 9","Jan 16","Jan 23","Jan 30","Feb 6","Feb 13","Feb 20"];

  // Show platform colors
  const PC = { WN:"#7c3aed", TT:"#f43f5e", IG:"#ec4899", AM:"#f59e0b" };
  const PN = { WN:"Whatnot", TT:"TikTok", IG:"Instagram", AM:"Amazon" };


  // ── TABS ─────────────────────────────────────────────────────────────────────
  const TABS = [
    { id:"overview",  label:"Overview"   },
    { id:"revenue",   label:"Revenue"    },
    { id:"audience",  label:"Audience"   },
    { id:"shows",     label:"Shows"      },
    { id:"ai",        label:"✦ AI Insights" },
  ];

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100%", overflow:"hidden" }}>

      {/* HEADER */}
      <div style={{ padding:"14px 28px 0", borderBottom:`1px solid ${C.border}`, flexShrink:0, background:C.surface }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
          <div>
            <div style={{ fontFamily:"'Syne',sans-serif", fontSize:18, fontWeight:800, color:C.text, letterSpacing:"-0.3px" }}>Analytics</div>
            <div style={{ fontSize:11, color:C.muted, marginTop:2 }}>All data is real-time from your shows, buyers, and campaigns.</div>
          </div>
          <div style={{ display:"flex", gap:6 }}>
            {["7d","30d","90d","All"].map(r=>(
              <button key={r} onClick={()=>setDateRange(r)} style={{ fontSize:11, fontWeight:dateRange===r?700:400, color:dateRange===r?C.text:C.muted, background:dateRange===r?C.surface2:"transparent", border:`1px solid ${dateRange===r?C.border2:"transparent"}`, padding:"4px 10px", borderRadius:7, cursor:"pointer" }}>{r}</button>
            ))}
          </div>
        </div>
        <div style={{ display:"flex", gap:0 }}>
          {TABS.map(t=>(
            <button key={t.id} onClick={()=>setTab(t.id)} style={{ fontSize:12, fontWeight:tab===t.id?700:400, color:tab===t.id?(t.id==="ai"?"#a78bfa":C.text):C.muted, background:"none", border:"none", borderBottom:`2px solid ${tab===t.id?(t.id==="ai"?"#a78bfa":C.accent):"transparent"}`, padding:"8px 18px 10px", cursor:"pointer" }}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ flex:1, overflowY:"auto", padding:"20px 28px" }}>

        {/* ─────────────────── OVERVIEW ─────────────────────────────────────── */}
        {tab==="overview" && (
          <div>
            {/* KPI row */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:20 }}>
              <KPI label="Total GMV"        value={`$${totalGMV.toLocaleString()}`}  color={C.green}    trend={14} sub="last 30 days" />
              <KPI label="Avg Order Value"  value={`$${avgOrderValue}`}              color={C.accent}   trend={8}  sub="per transaction" />
              <KPI label="Avg Customer LTV" value={`$${avgLTV}`}                     color="#f59e0b"    trend={22} sub="per buyer" />
              <KPI label="Repeat Rate"      value={`${avgRepeatRate}%`}              color="#a78bfa"    trend={5}  sub="across all shows" />
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:24 }}>
              <KPI label="Total Buyers"     value={totalBuyers}                       color={C.text}     sub={`${vipBuyers.length} VIP`} />
              <KPI label="Total Orders"     value={totalOrders}                       color={C.text}     sub={`${SHOWS.length} shows`} />
              <KPI label="Campaign GMV"     value={`$${campaignGMV.toLocaleString()}`} color={C.green}  sub="from campaigns" />
              <KPI label="Avg Conv. Rate"   value={`${avgConvRate}%`}                color="#f59e0b"    sub="campaign avg" />
            </div>

            {/* GMV Trend + Platform split */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 340px", gap:16, marginBottom:20 }}>
              <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:14, padding:"18px 20px" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:16 }}>
                  <div>
                    <div style={{ fontSize:13, fontWeight:700, color:C.text }}>GMV Trend</div>
                    <div style={{ fontSize:11, color:C.muted, marginTop:2 }}>8-week rolling revenue</div>
                  </div>
                  <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:18, fontWeight:800, color:C.green }}>${(gmvTrend[gmvTrend.length-1]/1000).toFixed(1)}k</div>
                </div>
                <LineChart data={gmvTrend} color={C.green} height={90} />
                <div style={{ display:"flex", justifyContent:"space-between", marginTop:4 }}>
                  {gmvWeeks.map((w,i)=>(
                    <span key={i} style={{ fontSize:8, color:C.subtle }}>{w.split(" ")[1]}</span>
                  ))}
                </div>
              </div>

              <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:14, padding:"18px 20px" }}>
                <div style={{ fontSize:13, fontWeight:700, color:C.text, marginBottom:4 }}>Revenue by Platform</div>
                <div style={{ fontSize:11, color:C.muted, marginBottom:16 }}>% of total GMV · ${totalGMV.toLocaleString()}</div>
                <div style={{ display:"flex", justifyContent:"center", marginBottom:16 }}>
                  <DonutChart size={110} segments={Object.entries(platformGMV).filter(([,v])=>v>0).map(([k,v])=>({ value:v, color:PC[k], label:PN[k] }))} />
                </div>
                {Object.entries(platformGMV).filter(([,v])=>v>0).map(([k,v])=>(
                  <div key={k} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:7 }}>
                    <div style={{ width:8, height:8, borderRadius:2, background:PC[k], flexShrink:0 }} />
                    <span style={{ fontSize:11, color:C.muted, flex:1 }}>{PN[k]}</span>
                    <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:11, fontWeight:700, color:C.text }}>${v.toLocaleString()}</span>
                    <span style={{ fontSize:10, color:C.subtle }}>{Math.round(v/totalGMV*100)}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top buyers */}
            <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:14, padding:"18px 20px" }}>
              <div style={{ fontSize:13, fontWeight:700, color:C.text, marginBottom:14 }}>Top Buyers by LTV</div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12 }}>
                {[...buyers].sort((a,b)=>b.spend-a.spend).slice(0,8).map((b,i)=>(
                  <div key={b.id} style={{ display:"flex", gap:10, alignItems:"center", padding:"10px 12px", background:C.surface2, border:`1px solid ${C.border}`, borderRadius:10 }}>
                    <div style={{ width:28, height:28, borderRadius:8, background:b.status==="vip"?`${C.accent}33`:C.surface, border:`1px solid ${b.status==="vip"?C.accent+"44":C.border}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:800, color:C.accent, flexShrink:0 }}>{i+1}</div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:11, fontWeight:700, color:C.text, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{b.name}</div>
                      <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:11, color:C.green, fontWeight:700 }}>${b.spend.toLocaleString()}</div>
                    </div>
                    {b.status==="vip" && <span style={{ fontSize:9 }}>👑</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ─────────────────── REVENUE ──────────────────────────────────────── */}
        {tab==="revenue" && (
          <div>
            {/* GMV per show bars */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:20 }}>
              <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:14, padding:"18px 20px" }}>
                <div style={{ fontSize:13, fontWeight:700, color:C.text, marginBottom:4 }}>GMV by Show</div>
                <div style={{ fontSize:11, color:C.muted, marginBottom:16 }}>Revenue per live show · last 4 shows</div>
                <BarChart height={100} data={SHOWS.map(s=>({ value:s.gmv, label:s.date.split(",")[0], color:PC[s.platform], prefix:"$" }))} />
              </div>
              <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:14, padding:"18px 20px" }}>
                <div style={{ fontSize:13, fontWeight:700, color:C.text, marginBottom:4 }}>Buyers per Show</div>
                <div style={{ fontSize:11, color:C.muted, marginBottom:16 }}>Unique buyers and repeat breakdown</div>
                <BarChart height={100} data={SHOWS.map(s=>({ value:s.buyers, label:s.date.split(",")[0], color:"#a78bfa" }))} />
              </div>
            </div>

            {/* Campaign performance table */}
            <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:14, padding:"18px 20px", marginBottom:20 }}>
              <div style={{ fontSize:13, fontWeight:700, color:C.text, marginBottom:14 }}>Campaign Revenue Performance</div>
              <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr 1fr 1fr", gap:0 }}>
                {["Campaign","Recipients","Open Rate","Click Rate","Conv. Rate","GMV"].map(h=>(
                  <div key={h} style={{ fontSize:9, fontWeight:700, color:C.muted, textTransform:"uppercase", letterSpacing:"0.07em", padding:"0 0 10px" }}>{h}</div>
                ))}
                {CAMPAIGNS.filter(c=>c.status==="sent").map((c,i)=>{
                  const openRate  = c.recipients>0?Math.round(c.opened/c.recipients*100):0;
                  const clickRate = c.recipients>0?Math.round(c.clicked/c.recipients*100):0;
                  const convRate  = c.recipients>0?Math.round(c.converted/c.recipients*100):0;
                  const typeColors= { email:"#3b82f6", sms:"#10b981", ig_dm:"#ec4899", tt_dm:"#f43f5e", wn_dm:"#7c3aed", am_msg:"#f59e0b" };
                  return [
                    <div key={`n${i}`} style={{ padding:"10px 0", borderTop:`1px solid ${C.border}` }}>
                      <div style={{ fontSize:11, fontWeight:600, color:C.text }}>{c.name}</div>
                      <span style={{ fontSize:9, color:typeColors[c.type]||C.accent, background:`${typeColors[c.type]||C.accent}15`, padding:"1px 6px", borderRadius:4, fontWeight:700 }}>{c.type.toUpperCase()}</span>
                    </div>,
                    <div key={`r${i}`} style={{ padding:"10px 0", borderTop:`1px solid ${C.border}`, fontFamily:"'JetBrains Mono',monospace", fontSize:12, fontWeight:700, color:C.text, display:"flex", alignItems:"center" }}>{c.recipients.toLocaleString()}</div>,
                    <div key={`o${i}`} style={{ padding:"10px 0", borderTop:`1px solid ${C.border}`, display:"flex", alignItems:"center" }}>
                      <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:12, fontWeight:700, color:openRate>70?C.green:openRate>40?"#f59e0b":"#9ca3af" }}>{openRate}%</span>
                    </div>,
                    <div key={`cl${i}`} style={{ padding:"10px 0", borderTop:`1px solid ${C.border}`, display:"flex", alignItems:"center" }}>
                      <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:12, fontWeight:700, color:clickRate>50?C.green:clickRate>25?"#f59e0b":"#9ca3af" }}>{clickRate}%</span>
                    </div>,
                    <div key={`cv${i}`} style={{ padding:"10px 0", borderTop:`1px solid ${C.border}`, display:"flex", alignItems:"center" }}>
                      <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:12, fontWeight:700, color:convRate>30?C.green:convRate>15?"#f59e0b":"#9ca3af" }}>{convRate}%</span>
                    </div>,
                    <div key={`g${i}`} style={{ padding:"10px 0", borderTop:`1px solid ${C.border}`, fontFamily:"'JetBrains Mono',monospace", fontSize:12, fontWeight:700, color:C.green, display:"flex", alignItems:"center" }}>{c.gmv>0?`$${c.gmv.toLocaleString()}`:"—"}</div>,
                  ];
                })}
              </div>
            </div>

            {/* Product revenue */}
            <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:14, padding:"18px 20px" }}>
              <div style={{ fontSize:13, fontWeight:700, color:C.text, marginBottom:14 }}>Top Products by Revenue (Last 30 Days)</div>
              {[...PRODUCTS].sort((a,b)=>b.soldLast30*b.price - a.soldLast30*a.price).slice(0,6).map((p,i)=>{
                const rev = p.soldLast30*p.price;
                const maxRev = PRODUCTS.reduce((a,pr)=>Math.max(a,pr.soldLast30*pr.price),0);
                return (
                  <div key={p.id} style={{ display:"flex", alignItems:"center", gap:12, marginBottom:12 }}>
                    <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:11, color:C.accent, width:18, textAlign:"right", flexShrink:0 }}>{i+1}</span>
                    <span style={{ fontSize:16, flexShrink:0 }}>{p.image}</span>
                    <div style={{ flex:1 }}>
                      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                        <span style={{ fontSize:11, fontWeight:600, color:C.text }}>{p.name}</span>
                        <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:11, fontWeight:700, color:C.green }}>${rev.toLocaleString()}</span>
                      </div>
                      <div style={{ height:4, background:C.surface2, borderRadius:2 }}>
                        <div style={{ width:`${(rev/maxRev)*100}%`, height:"100%", background:`linear-gradient(90deg,${C.accent},${C.green})`, borderRadius:2 }} />
                      </div>
                      <div style={{ display:"flex", gap:12, marginTop:3 }}>
                        <span style={{ fontSize:9, color:C.muted }}>{p.soldLast30} sold · ${p.price} avg</span>
                        <span style={{ fontSize:9, color:"#a78bfa" }}>AI Score {p.aiScore}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ─────────────────── AUDIENCE ─────────────────────────────────────── */}
        {tab==="audience" && (
          <div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:16, marginBottom:20 }}>
              {/* Buyer status donut */}
              <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:14, padding:"18px 20px" }}>
                <div style={{ fontSize:13, fontWeight:700, color:C.text, marginBottom:4 }}>Buyer Health</div>
                <div style={{ fontSize:11, color:C.muted, marginBottom:14 }}>Status breakdown of {totalBuyers} buyers</div>
                <div style={{ display:"flex", justifyContent:"center", marginBottom:14 }}>
                  <DonutChart size={110} segments={[
                    { value:statusCounts.vip||0,     color:"#7c3aed", label:"VIP"     },
                    { value:statusCounts.active||0,  color:"#10b981", label:"Active"  },
                    { value:statusCounts.new||0,     color:"#3b82f6", label:"New"     },
                    { value:statusCounts.risk||0,    color:"#f59e0b", label:"At Risk" },
                    { value:statusCounts.dormant||0, color:"#4b5563", label:"Dormant" },
                  ].filter(s=>s.value>0)} />
                </div>
                {[
                  { label:"VIP",     count:statusCounts.vip||0,     color:"#7c3aed" },
                  { label:"Active",  count:statusCounts.active||0,  color:C.green   },
                  { label:"New",     count:statusCounts.new||0,     color:"#3b82f6" },
                  { label:"At Risk", count:statusCounts.risk||0,    color:"#f59e0b" },
                  { label:"Dormant", count:statusCounts.dormant||0, color:"#4b5563" },
                ].filter(s=>s.count>0).map(s=>(
                  <div key={s.label} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
                    <div style={{ width:8, height:8, borderRadius:2, background:s.color, flexShrink:0 }} />
                    <span style={{ fontSize:11, color:C.muted, flex:1 }}>{s.label}</span>
                    <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:11, fontWeight:700, color:C.text }}>{s.count}</span>
                    <span style={{ fontSize:10, color:C.subtle }}>{Math.round(s.count/totalBuyers*100)}%</span>
                  </div>
                ))}
              </div>

              {/* Platform mix */}
              <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:14, padding:"18px 20px" }}>
                <div style={{ fontSize:13, fontWeight:700, color:C.text, marginBottom:4 }}>Platform Mix</div>
                <div style={{ fontSize:11, color:C.muted, marginBottom:16 }}>Where your buyers come from</div>
                {Object.entries(platformBuyers).filter(([,v])=>v>0).sort((a,b)=>b[1]-a[1]).map(([k,v])=>(
                  <HBar key={k} label={PN[k]} value={v} max={Math.max(...Object.values(platformBuyers))} color={PC[k]} suffix=" buyers" />
                ))}
                <div style={{ marginTop:16, padding:"12px 14px", background:C.surface2, border:`1px solid ${C.border}`, borderRadius:10 }}>
                  <div style={{ fontSize:10, color:C.muted, marginBottom:6 }}>Revenue per buyer by platform</div>
                  {Object.entries(platformGMV).filter(([,v])=>v>0).map(([k,v])=>{
                    const bCount = platformBuyers[k]||1;
                    return (
                      <div key={k} style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                        <span style={{ fontSize:11, color:C.muted }}>{PN[k]}</span>
                        <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:11, fontWeight:700, color:PC[k] }}>${Math.round(v/bCount)}/buyer</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Category preferences */}
              <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:14, padding:"18px 20px" }}>
                <div style={{ fontSize:13, fontWeight:700, color:C.text, marginBottom:4 }}>Category Preferences</div>
                <div style={{ fontSize:11, color:C.muted, marginBottom:16 }}>Spend by product category</div>
                {Object.entries(catSpend).sort((a,b)=>b[1]-a[1]).map(([cat,spend])=>(
                  <HBar key={cat} label={cat} value={spend} max={Math.max(...Object.values(catSpend))} color={C.accent} suffix={` · $${spend.toLocaleString()}`} />
                ))}
              </div>
            </div>

            {/* LTV distribution */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:20 }}>
              <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:14, padding:"18px 20px" }}>
                <div style={{ fontSize:13, fontWeight:700, color:C.text, marginBottom:4 }}>Lifetime Value Distribution</div>
                <div style={{ fontSize:11, color:C.muted, marginBottom:16 }}>Spend concentration across buyer base</div>
                <BarChart height={90} data={[
                  { label:"<$500",  value:buyers.filter(b=>b.spend<500).length,              color:"#4b5563" },
                  { label:"$500-1k",value:buyers.filter(b=>b.spend>=500&&b.spend<1000).length, color:"#6b7280" },
                  { label:"$1-2k",  value:buyers.filter(b=>b.spend>=1000&&b.spend<2000).length, color:"#7c3aed" },
                  { label:"$2-5k",  value:buyers.filter(b=>b.spend>=2000&&b.spend<5000).length, color:"#a78bfa" },
                  { label:"$5k+",   value:buyers.filter(b=>b.spend>=5000).length,             color:"#10b981" },
                ]} />
                <div style={{ marginTop:16, display:"flex", justifyContent:"space-between", padding:"10px 14px", background:C.surface2, border:`1px solid ${C.border}`, borderRadius:9 }}>
                  <div>
                    <div style={{ fontSize:9, color:C.muted }}>Top 20% of buyers</div>
                    <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:14, fontWeight:800, color:C.green }}>
                      {Math.round(vipGMV/totalGMV*100)}% of GMV
                    </div>
                  </div>
                  <div style={{ textAlign:"right" }}>
                    <div style={{ fontSize:9, color:C.muted }}>Highest LTV</div>
                    <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:14, fontWeight:800, color:C.accent }}>${topLTV.toLocaleString()}</div>
                  </div>
                </div>
              </div>

              {/* Purchase frequency */}
              <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:14, padding:"18px 20px" }}>
                <div style={{ fontSize:13, fontWeight:700, color:C.text, marginBottom:4 }}>Purchase Frequency</div>
                <div style={{ fontSize:11, color:C.muted, marginBottom:16 }}>Orders per buyer bucket</div>
                <BarChart height={90} data={[
                  { label:"1 order",  value:buyers.filter(b=>b.orders===1).length,          color:"#4b5563" },
                  { label:"2–5",      value:buyers.filter(b=>b.orders>=2&&b.orders<=5).length, color:"#7c3aed" },
                  { label:"6–15",     value:buyers.filter(b=>b.orders>=6&&b.orders<=15).length, color:"#a78bfa" },
                  { label:"16–30",    value:buyers.filter(b=>b.orders>=16&&b.orders<=30).length, color:C.green  },
                  { label:"30+",      value:buyers.filter(b=>b.orders>30).length,            color:"#10b981" },
                ]} />
                <div style={{ marginTop:12, fontSize:11, color:C.muted }}>
                  Avg <span style={{ fontFamily:"'JetBrains Mono',monospace", fontWeight:700, color:C.text }}>{Math.round(totalOrders/totalBuyers)}</span> orders/buyer · Most valuable segment: <span style={{ color:C.green, fontWeight:700 }}>6–15 orders</span>
                </div>
              </div>
            </div>

            {/* Loyalty tier breakdown */}
            <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:14, padding:"18px 20px" }}>
              <div style={{ fontSize:13, fontWeight:700, color:C.text, marginBottom:14 }}>Loyalty Tier Health</div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12 }}>
                {LOYALTY_TIERS.map(tier=>{
                  const tierBuyers = Object.values(LOYALTY_BUYERS).filter(lb=>lb.tier===tier.id);
                  const tierGMV    = buyers.filter(b=>{ const lb=LOYALTY_BUYERS[b.id]; return lb&&lb.tier===tier.id; }).reduce((a,b)=>a+b.spend,0);
                  return (
                    <div key={tier.id} style={{ background:tier.bg, border:`1px solid ${tier.color}33`, borderRadius:12, padding:"14px 16px" }}>
                      <div style={{ fontSize:20, marginBottom:8 }}>{tier.icon}</div>
                      <div style={{ fontSize:13, fontWeight:800, color:tier.color, marginBottom:2 }}>{tier.label}</div>
                      <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:18, fontWeight:800, color:C.text, marginBottom:2 }}>{tierBuyers.length}</div>
                      <div style={{ fontSize:10, color:C.muted }}>buyers</div>
                      {tierGMV>0 && <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:12, fontWeight:700, color:C.green, marginTop:6 }}>${tierGMV.toLocaleString()} GMV</div>}
                      <div style={{ fontSize:10, color:C.subtle, marginTop:4 }}>{tier.minPoints.toLocaleString()}{tier.maxPoints?`–${tier.maxPoints.toLocaleString()}`:"+"} pts</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ─────────────────── SHOWS ────────────────────────────────────────── */}
        {tab==="shows" && (
          <div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:20 }}>
              <KPI label="Best GMV"       value={`$${Math.max(...SHOWS.map(s=>s.gmv)).toLocaleString()}`} color={C.green} sub="single show" />
              <KPI label="Avg Show GMV"   value={`$${Math.round(SHOWS.reduce((a,s)=>a+s.gmv,0)/SHOWS.length).toLocaleString()}`} color={C.accent} />
              <KPI label="Avg Buyers/Show" value={Math.round(SHOWS.reduce((a,s)=>a+s.buyers,0)/SHOWS.length)} color="#a78bfa" />
              <KPI label="Best Platform"   value={Object.entries(platformGMV).sort((a,b)=>b[1]-a[1])[0]?.[0]&&PN[Object.entries(platformGMV).sort((a,b)=>b[1]-a[1])[0][0]]} color="#f59e0b" sub="by GMV" />
            </div>

            {/* Show performance table */}
            <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:14, padding:"18px 20px", marginBottom:20 }}>
              <div style={{ fontSize:13, fontWeight:700, color:C.text, marginBottom:14 }}>Show-by-Show Performance</div>
              <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr 1fr 1fr 1fr 80px", gap:0 }}>
                {["Show","Platform","Date","GMV","Buyers","Repeat Rate","New Buyers",""].map(h=>(
                  <div key={h} style={{ fontSize:9, fontWeight:700, color:C.muted, textTransform:"uppercase", letterSpacing:"0.07em", padding:"0 0 10px" }}>{h}</div>
                ))}
                {[...SHOWS].sort((a,b)=>new Date(b.date)-new Date(a.date)).map((s,i)=>[
                  <div key={`t${i}`} style={{ padding:"10px 0", borderTop:`1px solid ${C.border}`, fontSize:12, fontWeight:600, color:C.text }}>{s.title}</div>,
                  <div key={`p${i}`} style={{ padding:"10px 0", borderTop:`1px solid ${C.border}`, display:"flex", alignItems:"center" }}><PlatformPill code={s.platform} /></div>,
                  <div key={`d${i}`} style={{ padding:"10px 0", borderTop:`1px solid ${C.border}`, fontSize:11, color:C.muted, display:"flex", alignItems:"center" }}>{s.date}</div>,
                  <div key={`g${i}`} style={{ padding:"10px 0", borderTop:`1px solid ${C.border}`, fontFamily:"'JetBrains Mono',monospace", fontSize:13, fontWeight:800, color:C.green, display:"flex", alignItems:"center" }}>${s.gmv.toLocaleString()}</div>,
                  <div key={`b${i}`} style={{ padding:"10px 0", borderTop:`1px solid ${C.border}`, fontFamily:"'JetBrains Mono',monospace", fontSize:12, fontWeight:700, color:C.text, display:"flex", alignItems:"center" }}>{s.buyers}</div>,
                  <div key={`r${i}`} style={{ padding:"10px 0", borderTop:`1px solid ${C.border}`, display:"flex", alignItems:"center" }}>
                    <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:12, fontWeight:700, color:s.repeatRate>=65?C.green:s.repeatRate>=50?"#f59e0b":"#ef4444" }}>{s.repeatRate}%</span>
                  </div>,
                  <div key={`n${i}`} style={{ padding:"10px 0", borderTop:`1px solid ${C.border}`, fontFamily:"'JetBrains Mono',monospace", fontSize:12, fontWeight:700, color:"#a78bfa", display:"flex", alignItems:"center" }}>{s.newBuyers}</div>,
                  <div key={`v${i}`} style={{ padding:"10px 0", borderTop:`1px solid ${C.border}`, display:"flex", alignItems:"center" }}>
                    <button onClick={()=>navigate&&navigate("show-report",{showId:s.id})} style={{ fontSize:10, fontWeight:600, color:C.accent, background:`${C.accent}10`, border:`1px solid ${C.accent}33`, padding:"3px 10px", borderRadius:6, cursor:"pointer", whiteSpace:"nowrap" }}>View →</button>
                  </div>,
                ])}
              </div>
            </div>

            {/* Platform comparison */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
              <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:14, padding:"18px 20px" }}>
                <div style={{ fontSize:13, fontWeight:700, color:C.text, marginBottom:14 }}>Platform Comparison</div>
                {Object.entries(platformGMV).filter(([,v])=>v>0).sort((a,b)=>b[1]-a[1]).map(([k,v])=>{
                  const shows = SHOWS.filter(s=>s.platform===k);
                  const avgRR = shows.length ? Math.round(shows.reduce((a,s)=>a+s.repeatRate,0)/shows.length) : 0;
                  return (
                    <div key={k} style={{ display:"flex", gap:14, alignItems:"center", padding:"12px 0", borderBottom:`1px solid ${C.border}` }}>
                      <div style={{ width:36, height:36, borderRadius:10, background:`${PC[k]}18`, border:`1px solid ${PC[k]}44`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                        <PlatformPill code={k} />
                      </div>
                      <div style={{ flex:1 }}>
                        <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:14, fontWeight:800, color:C.green }}>${v.toLocaleString()}</div>
                        <div style={{ fontSize:10, color:C.muted }}>{shows.length} show{shows.length!==1?"s":""} · {avgRR}% repeat rate</div>
                      </div>
                      <div style={{ textAlign:"right" }}>
                        <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:13, fontWeight:700, color:PC[k] }}>{Math.round(v/totalGMV*100)}%</div>
                        <div style={{ fontSize:9, color:C.muted }}>of GMV</div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:14, padding:"18px 20px" }}>
                <div style={{ fontSize:13, fontWeight:700, color:C.text, marginBottom:4 }}>Repeat Rate by Show</div>
                <div style={{ fontSize:11, color:C.muted, marginBottom:16 }}>Buyer loyalty signal per show</div>
                <BarChart height={100} data={SHOWS.map(s=>({
                  value:s.repeatRate,
                  label:s.date.split(",")[0],
                  color:s.repeatRate>=65?C.green:s.repeatRate>=50?"#f59e0b":"#ef4444",
                  prefix:"",
                }))} />
                <div style={{ fontSize:10, color:C.muted, marginTop:8 }}>
                  Target: <span style={{ color:C.green, fontWeight:700 }}>65%+</span> repeat rate · Current avg: <span style={{ fontFamily:"'JetBrains Mono',monospace", fontWeight:700, color:C.text }}>{avgRepeatRate}%</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─────────────────── AI INSIGHTS ──────────────────────────────────── */}
        {tab==="ai" && (
          <div>
            <div style={{ background:"linear-gradient(135deg,#2d1f5e18,#1a103022)", border:`1px solid ${C.accent}33`, borderRadius:14, padding:"16px 22px", marginBottom:20, display:"flex", alignItems:"center", gap:14 }}>
              <div style={{ width:40, height:40, borderRadius:11, background:`${C.accent}22`, border:`1px solid ${C.accent}44`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>✦</div>
              <div>
                <div style={{ fontSize:13, fontWeight:700, color:C.text }}>AI Business Intelligence</div>
                <div style={{ fontSize:11, color:C.muted, marginTop:2 }}>Insights generated from your real show, buyer, campaign, and product data. Updated after every show.</div>
              </div>
              <div style={{ marginLeft:"auto", fontFamily:"'JetBrains Mono',monospace", fontSize:10, color:"#a78bfa", background:"#2d1f5e22", border:"1px solid #7c3aed33", padding:"4px 10px", borderRadius:7 }}>
                {new Date().toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})}
              </div>
            </div>

            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              {[
                {
                  id:"i1",
                  priority:"high",
                  category:"Revenue",
                  icon:"💰",
                  color:C.green,
                  title:"Your VIP segment is underserved",
                  insight:`${vipBuyers.length} VIP buyers generate ${Math.round(vipGMV/totalGMV*100)}% of total GMV but haven't had a dedicated VIP-only show in 30+ days. Based on their average spend of $${Math.round(vipGMV/vipBuyers.length).toLocaleString()}/buyer, a private VIP show could generate an estimated $${(Math.round(vipGMV/vipBuyers.length)*vipBuyers.length/2).toLocaleString()}–$${(Math.round(vipGMV/vipBuyers.length)*vipBuyers.length).toLocaleString()} in a single session.`,
                  action:"Schedule VIP Show",
                  impact:"$2,400–$4,820 est. GMV",
                  confidence:91,
                },
                {
                  id:"i2",
                  priority:"high",
                  category:"Retention",
                  icon:"⚠️",
                  color:"#f59e0b",
                  title:`${buyers.filter(b=>b.status==="risk").length} at-risk buyers need immediate re-engagement`,
                  insight:`${buyers.filter(b=>b.status==="risk").map(b=>b.name).join(", ")} haven't purchased in 28–44 days. Their combined historical spend is $${buyers.filter(b=>b.status==="risk").reduce((a,b)=>a+b.spend,0).toLocaleString()}. Win-back campaigns sent within 45 days have a ${avgConvRate+8}% conversion rate on your account — 8 points above average.`,
                  action:"Launch Win-Back Campaign",
                  impact:`${buyers.filter(b=>b.status==="risk").length} buyers · potential $${Math.round(buyers.filter(b=>b.status==="risk").reduce((a,b)=>a+b.spend,0)*0.3).toLocaleString()} recovered`,
                  confidence:84,
                },
                {
                  id:"i3",
                  priority:"high",
                  category:"Product",
                  icon:"🏆",
                  color:"#a78bfa",
                  title:"3 high-AI-score products underperformed last show",
                  insight:`Silk Wrap Midi Dress (AI: 9.6), Leather Crossbody Bag (AI: 9.1), and Merino Wool Blazer (AI: 9.4) all have AI scores above 9.0 but weren't featured in your last 2 shows. Historically, featuring 2+ top-AI-score products per show increases average GMV by $${Math.round(totalGMV/SHOWS.length*0.18).toLocaleString()}. Consider opening your next show with these items.`,
                  action:"Add to Show Planner",
                  impact:`+$${Math.round(totalGMV/SHOWS.length*0.18).toLocaleString()} est. GMV per show`,
                  confidence:88,
                },
                {
                  id:"i4",
                  priority:"medium",
                  category:"Platform",
                  icon:"📱",
                  color:"#f43f5e",
                  title:"TikTok shows have 55% repeat rate vs 70% on Whatnot",
                  insight:`Your TikTok audience skews toward new buyers (avg ${SHOWS.filter(s=>s.platform==="TT")[0]?.newBuyers||14} new buyers/show vs ${SHOWS.filter(s=>s.platform==="WN")[0]?.newBuyers||7} on Whatnot) but lower repeat rate. This suggests TikTok is your acquisition channel and Whatnot is your retention channel. Strategy: use TikTok to acquire → drive to Whatnot via opt-in page for long-term LTV.`,
                  action:"Set Up Cross-Platform Funnel",
                  impact:"Estimated +12% LTV on TikTok buyers",
                  confidence:79,
                },
                {
                  id:"i5",
                  priority:"medium",
                  category:"Campaigns",
                  icon:"📊",
                  color:"#3b82f6",
                  title:"SMS campaigns outperform email by 2.4× on conversion",
                  insight:`Your SMS campaigns average ${Math.round(CAMPAIGNS.filter(c=>c.type==="sms"&&c.status==="sent").reduce((a,c)=>a+(c.converted/c.recipients*100),0)/CAMPAIGNS.filter(c=>c.type==="sms"&&c.status==="sent").length)}% conversion vs ${Math.round(CAMPAIGNS.filter(c=>c.type==="email"&&c.status==="sent").reduce((a,c)=>a+(c.converted/c.recipients*100),0)/CAMPAIGNS.filter(c=>c.type==="email"&&c.status==="sent").length)}% for email. Your SMS list of ${CAMPAIGNS.filter(c=>c.type==="sms")[0]?.recipients||124} subscribers generates $${CAMPAIGNS.filter(c=>c.type==="sms"&&c.status==="sent").reduce((a,c)=>a+c.gmv,0).toLocaleString()} per campaign. Growing this list by 3× could add $${Math.round(CAMPAIGNS.filter(c=>c.type==="sms"&&c.status==="sent").reduce((a,c)=>a+c.gmv,0)*3).toLocaleString()}/campaign.`,
                  action:"Grow SMS List",
                  impact:"3× list = est. +$9,600/campaign",
                  confidence:82,
                },
                {
                  id:"i6",
                  priority:"low",
                  category:"Show Timing",
                  icon:"🕐",
                  color:"#10b981",
                  title:"Thursday shows outperform other days by $900 avg GMV",
                  insight:`Your 2 Thursday shows averaged $${Math.round((4820+5100)/2).toLocaleString()} GMV with ${Math.round((68+72)/2)}% repeat rate. Non-Thursday shows averaged $${Math.round((3210+2100)/2).toLocaleString()} GMV with ${Math.round((55+43)/2)}% repeat rate. Your audience has formed a habit around Thursday nights. Consistency in timing increases repeat attendance — consider locking Thursday 8pm EST as your primary show slot and promoting it as a recurring event.`,
                  action:"Set Recurring Show Schedule",
                  impact:"$900/show uplift vs other days",
                  confidence:76,
                },
              ].map(insight=>{
                const expanded = aiExpanded===insight.id;
                const priColor = insight.priority==="high"?"#ef4444":insight.priority==="medium"?"#f59e0b":"#6b7280";
                return (
                  <div key={insight.id} style={{ background:C.surface, border:`1px solid ${expanded?insight.color+"44":C.border}`, borderRadius:14, overflow:"hidden", transition:"border-color .2s" }}>
                    <div onClick={()=>setAiExpanded(expanded?null:insight.id)} style={{ padding:"16px 20px", cursor:"pointer", display:"flex", gap:14, alignItems:"flex-start" }}>
                      <div style={{ width:40, height:40, borderRadius:11, background:`${insight.color}15`, border:`1px solid ${insight.color}33`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>{insight.icon}</div>
                      <div style={{ flex:1 }}>
                        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:5, flexWrap:"wrap" }}>
                          <span style={{ fontSize:9, fontWeight:800, color:priColor, background:`${priColor}18`, border:`1px solid ${priColor}33`, padding:"2px 7px", borderRadius:4, textTransform:"uppercase", letterSpacing:"0.06em" }}>{insight.priority} priority</span>
                          <span style={{ fontSize:9, color:C.muted, background:C.surface2, border:`1px solid ${C.border}`, padding:"2px 7px", borderRadius:4 }}>{insight.category}</span>
                          <span style={{ fontSize:9, color:"#a78bfa", background:"#2d1f5e22", border:"1px solid #7c3aed33", padding:"2px 7px", borderRadius:4 }}>{insight.confidence}% confidence</span>
                        </div>
                        <div style={{ fontSize:13, fontWeight:700, color:C.text, marginBottom:4 }}>{insight.title}</div>
                        {!expanded && <div style={{ fontSize:11, color:C.muted, lineHeight:1.5, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{insight.insight}</div>}
                      </div>
                      <div style={{ fontSize:13, color:C.muted, flexShrink:0, marginTop:4 }}>{expanded?"▲":"▼"}</div>
                    </div>
                    {expanded && (
                      <div style={{ padding:"0 20px 18px", borderTop:`1px solid ${C.border}` }}>
                        <div style={{ padding:"14px 0 16px", fontSize:12, color:"#d1d5db", lineHeight:1.7 }}>{insight.insight}</div>
                        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                          <button style={{ background:`linear-gradient(135deg,${insight.color},${insight.color}cc)`, border:"none", color:"#fff", fontSize:12, fontWeight:700, padding:"9px 20px", borderRadius:9, cursor:"pointer" }}>{insight.action} →</button>
                          <div style={{ background:C.surface2, border:`1px solid ${C.border}`, borderRadius:9, padding:"8px 14px" }}>
                            <div style={{ fontSize:9, color:C.muted, marginBottom:2 }}>Estimated Impact</div>
                            <div style={{ fontSize:11, fontWeight:700, color:C.green }}>{insight.impact}</div>
                          </div>
                          <div style={{ background:C.surface2, border:`1px solid ${C.border}`, borderRadius:9, padding:"8px 14px" }}>
                            <div style={{ fontSize:9, color:C.muted, marginBottom:2 }}>AI Confidence</div>
                            <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                              <div style={{ width:60, height:4, background:C.border2, borderRadius:2 }}>
                                <div style={{ width:`${insight.confidence}%`, height:"100%", background:"#a78bfa", borderRadius:2 }} />
                              </div>
                              <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:11, fontWeight:700, color:"#a78bfa" }}>{insight.confidence}%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}


// ─── SCREEN: PRODUCTION ───────────────────────────────────────────────────────
function ScreenProduction({ persona, navigate }) {
  const [tab, setTab] = useState("equipment");

  // ── EQUIPMENT STATE ──────────────────────────────────────────────────────────
  const [devices, setDevices] = useState([
    { id:"fx3",    name:"Sony FX3",        category:"camera",  icon:"📷", brand:"Sony",   connected:true,  battery:null, signal:5,
      settings:{ iso:800,  aperture:"f/2.8", shutter:"1/60",  wb:"5600K", focus:"AF-C",  rec:false },
      sdk:"Sony Camera Remote SDK", sdkStatus:"connected" },
    { id:"fx6",    name:"Sony FX6",        category:"camera",  icon:"🎥", brand:"Sony",   connected:true,  battery:null, signal:5,
      settings:{ iso:1600, aperture:"f/4",   shutter:"1/120", wb:"5600K", focus:"AF-S",  rec:false },
      sdk:"Sony Camera Remote SDK", sdkStatus:"connected" },
    { id:"rs4pro", name:"DJI RS4 Pro",     category:"gimbal",  icon:"🎛", brand:"DJI",    connected:true,  battery:81,   signal:4,
      settings:{ mode:"Pan Follow", tilt:0, pan:0, roll:0, speed:60, tracking:false },
      sdk:"DJI Ronin SDK", sdkStatus:"connected" },
    { id:"ipad",   name:"iPad Pro 12.9in", category:"monitor", icon:"📱", brand:"Apple",  connected:true,  battery:84,   signal:5,
      settings:{ brightness:80, app:"Streamlive Chat" },
      sdk:"AirPlay / USB", sdkStatus:"connected" },
    { id:"lg27",   name:"LG 27in Monitor", category:"monitor", icon:"🖥", brand:"LG",     connected:true,  battery:null, signal:5,
      settings:{ brightness:75, input:"HDMI 2" },
      sdk:"HDMI", sdkStatus:"connected" },
    { id:"elgato", name:"Elgato Key Light", category:"light",  icon:"💡", brand:"Elgato", connected:true,  battery:null, signal:5,
      settings:{ brightness:80, temp:5500, on:true },
      sdk:"Elgato HTTP API", sdkStatus:"connected" },
    { id:"aputure",name:"Aputure 600d",    category:"light",   icon:"🔆", brand:"Aputure",connected:false, battery:null, signal:0,
      settings:{ brightness:100, temp:5600, on:false, effect:"none" },
      sdk:"Sidus Link SDK", sdkStatus:"disconnected" },
    { id:"rode",   name:"Rode Wireless GO II", category:"audio", icon:"🎙", brand:"Rode", connected:true,  battery:72,   signal:4,
      settings:{ gain:0, mute:false, channel:"A+B" },
      sdk:"USB Audio", sdkStatus:"connected" },
    { id:"macbook",name:"MacBook Pro M3",  category:"encoder", icon:"💻", brand:"Apple",  connected:true,  battery:91,   signal:5,
      settings:{ encoder:"Apple VT H.264", bitrate:6000, fps:60, res:"1920×1080" },
      sdk:"OBS WebSocket v5", sdkStatus:"connected" },
  ]);

  const [selectedDevice, setSelectedDevice] = useState("fx3");
  const [addingDevice, setAddingDevice]     = useState(false);
  const [scanning, setScanning]             = useState(false);
  const [scannedDevices, setScannedDevices] = useState([]);

  // ── OBS / SCENE STATE ────────────────────────────────────────────────────────
  const [obsConnected, setObsConnected]   = useState(true);
  const [activeScene, setActiveScene]     = useState("Wide — FX3");
  const [transitionType, setTransitionType] = useState("Cut");
  const [scenes, setScenes] = useState([
    { id:"wide",    name:"Wide — FX3",       source:"fx3",   preview:"📷 Wide" },
    { id:"closeup", name:"Close-Up — FX6",   source:"fx6",   preview:"🎥 Close" },
    { id:"product", name:"Product Focus",     source:"fx6",   preview:"🎥 + 📷" },
    { id:"pip",     name:"PiP — FX3+iPad",   source:"fx3",   preview:"📷 + 📱" },
    { id:"screen",  name:"Screen Share",      source:"macbook",preview:"💻 Screen" },
  ]);

  // ── AUTOMATION STATE ─────────────────────────────────────────────────────────
  const [automations, setAutomations] = useState([
    { id:"a1", enabled:true,  trigger:"Product queued",  action:"Switch to Close-Up — FX6",       devices:["fx6","rs4pro"],    icon:"🎥" },
    { id:"a2", enabled:true,  trigger:"Show starts",     action:"Key Light → 100% · 5600K",        devices:["elgato"],          icon:"💡" },
    { id:"a3", enabled:false, trigger:"VIP buyer joins", action:"RS4 Pro → Product Follow mode",   devices:["rs4pro"],          icon:"🎛" },
    { id:"a4", enabled:true,  trigger:"Show ends",       action:"All lights off · Cameras standby",devices:["elgato","fx3","fx6"],icon:"⏹" },
    { id:"a5", enabled:false, trigger:"Product changes", action:"DJI gimbal → reframe wide",       devices:["rs4pro"],          icon:"🎛" },
  ]);

  // ── STREAM DESTINATIONS ──────────────────────────────────────────────────────
  const [streamTests, setStreamTests] = useState({});
  const [testingDest, setTestingDest] = useState(null);
  const DESTINATIONS = [
    { id:"WN", label:"Whatnot",    color:"#7c3aed", bitrate:"6 Mbps",  latency:"1.2s", rtmp:"rtmp://live.whatnot.com/app/[key]" },
    { id:"TT", label:"TikTok",     color:"#f43f5e", bitrate:"4 Mbps",  latency:"0.8s", rtmp:"rtmp://push.tiktokcdn.com/rtmp/[key]" },
    { id:"IG", label:"Instagram",  color:"#ec4899", bitrate:"3.5 Mbps",latency:"1.4s", rtmp:"rtmp://live-api-s.facebook.com/rtmp/[key]" },
    { id:"AM", label:"Amazon Live",color:"#f59e0b", bitrate:"4 Mbps",  latency:"2.1s", rtmp:"rtmp://live.amazon.com/app/[key]" },
  ];

  const testStream = (pid) => {
    setTestingDest(pid);
    setTimeout(()=>{ setTestingDest(null); setStreamTests(p=>({...p,[pid]:true})); }, 1800);
  };

  const updateDeviceSetting = (devId, key, val) => {
    setDevices(prev=>prev.map(d=>d.id===devId?{...d,settings:{...d.settings,[key]:val}}:d));
  };

  const toggleDeviceConnected = (devId) => {
    setDevices(prev=>prev.map(d=>d.id===devId?{...d,connected:!d.connected,sdkStatus:d.connected?"disconnected":"connected"}:d));
  };

  const scanForDevices = () => {
    setScanning(true);
    setScannedDevices([]);
    setTimeout(()=>{
      setScannedDevices([
        { id:"rs5pro",  name:"DJI RS5 Pro",       category:"gimbal", icon:"🎛", brand:"DJI",     sdk:"DJI Ronin SDK",    how:"Bluetooth" },
        { id:"aputure2",name:"Aputure 300d II",    category:"light",  icon:"💡", brand:"Aputure", sdk:"Sidus Link SDK",   how:"WiFi" },
        { id:"fx30",    name:"Sony ZV-E1",          category:"camera", icon:"📷", brand:"Sony",    sdk:"Sony Remote SDK",  how:"WiFi" },
        { id:"elgato2", name:"Elgato Key Light Air",category:"light",  icon:"💡", brand:"Elgato",  sdk:"HTTP API",         how:"Network" },
      ]);
      setScanning(false);
    }, 2500);
  };

  const addScannedDevice = (dev) => {
    const newDev = {
      ...dev, connected:true, battery:dev.category==="gimbal"?94:null, signal:4,
      settings: dev.category==="camera" ? { iso:800, aperture:"f/2.8", shutter:"1/60", wb:"5600K", focus:"AF-C", rec:false }
               : dev.category==="gimbal" ? { mode:"Pan Follow", tilt:0, pan:0, roll:0, speed:60, tracking:false }
               : dev.category==="light"  ? { brightness:80, temp:5600, on:true, effect:"none" }
               : {},
      sdkStatus:"connected",
    };
    setDevices(p=>[...p,newDev]);
    setScannedDevices(p=>p.filter(d=>d.id!==dev.id));
  };

  const dev = devices.find(d=>d.id===selectedDevice) || devices[0];
  const connectedCount = devices.filter(d=>d.connected).length;
  const allStreamReady = persona.platforms.filter(p=>DESTINATIONS.find(d=>d.id===p)).every(p=>streamTests[p]);

  const CATEGORY_COLORS = { camera:"#7c3aed", gimbal:"#f59e0b", light:"#10b981", monitor:"#3b82f6", audio:"#ec4899", encoder:"#6b7280" };
  const CATEGORY_LABELS = { camera:"Camera", gimbal:"Gimbal", light:"Light", monitor:"Monitor", audio:"Audio", encoder:"Encoder" };

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100%", overflow:"hidden" }}>

      {/* ── HEADER ── */}
      <div style={{ padding:"14px 28px 0", borderBottom:`1px solid ${C.border}`, flexShrink:0, background:C.surface }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
          <div>
            <div style={{ fontFamily:"'Syne',sans-serif", fontSize:18, fontWeight:800, color:C.text, letterSpacing:"-0.3px" }}>Production</div>
            <div style={{ fontSize:11, color:C.muted, marginTop:2 }}>
              <span style={{ color:C.green, fontWeight:700 }}>{connectedCount}</span>/{devices.length} devices connected
              {obsConnected && <span style={{ color:"#a78bfa", marginLeft:10 }}>● OBS connected</span>}
            </div>
          </div>
          <div style={{ display:"flex", gap:8 }}>
            <button onClick={()=>{ setAddingDevice(true); scanForDevices(); }} style={{ background:C.surface2, border:`1px solid ${C.border2}`, color:C.muted, fontSize:12, fontWeight:600, padding:"7px 14px", borderRadius:9, cursor:"pointer" }}>
              + Add Device
            </button>
            <button onClick={()=>navigate("show-planner")} style={{ background:`linear-gradient(135deg,${C.accent},${C.accent2})`, border:"none", color:"#fff", fontSize:12, fontWeight:700, padding:"7px 16px", borderRadius:9, cursor:"pointer" }}>
              → Show Planner
            </button>
          </div>
        </div>
        <div style={{ display:"flex", gap:0 }}>
          {[{id:"equipment",label:"Equipment"},{id:"obs",label:"OBS Scenes"},{id:"automation",label:"Automation"},{id:"stream",label:"Stream"}].map(t=>(
            <button key={t.id} onClick={()=>setTab(t.id)} style={{ fontSize:12, fontWeight:tab===t.id?700:400, color:tab===t.id?C.text:C.muted, background:"none", border:"none", borderBottom:`2px solid ${tab===t.id?C.accent:"transparent"}`, padding:"8px 18px 10px", cursor:"pointer" }}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── ADD DEVICE MODAL ── */}
      {addingDevice && (
        <div style={{ position:"fixed", inset:0, zIndex:100, background:"rgba(6,6,14,0.85)", backdropFilter:"blur(6px)", display:"flex", alignItems:"center", justifyContent:"center" }} onClick={()=>setAddingDevice(false)}>
          <div className="pop-in" style={{ background:"#0a0a15", border:`1px solid ${C.border2}`, borderRadius:18, padding:"28px", maxWidth:520, width:"90%", maxHeight:"80vh", overflowY:"auto" }} onClick={e=>e.stopPropagation()}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20 }}>
              <div style={{ fontFamily:"'Syne',sans-serif", fontSize:16, fontWeight:800, color:C.text }}>Add Equipment</div>
              <button onClick={()=>setAddingDevice(false)} style={{ background:"none", border:"none", color:C.muted, fontSize:16, cursor:"pointer" }}>✕</button>
            </div>

            {/* SDK info */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginBottom:20 }}>
              {[
                { label:"Sony Cameras", sdk:"Camera Remote SDK", color:"#f59e0b", icon:"📷" },
                { label:"DJI Gimbals",  sdk:"Ronin SDK",         color:"#7c3aed", icon:"🎛" },
                { label:"Aputure",      sdk:"Sidus Link SDK",    color:"#10b981", icon:"🔆" },
                { label:"Godox",        sdk:"Bluetooth",         color:"#3b82f6", icon:"💡" },
                { label:"Elgato",       sdk:"HTTP API",          color:"#ec4899", icon:"💡" },
                { label:"OBS",          sdk:"WebSocket v5",      color:"#6b7280", icon:"🎬" },
              ].map(s=>(
                <div key={s.label} style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:10, padding:"10px 12px" }}>
                  <div style={{ fontSize:16, marginBottom:4 }}>{s.icon}</div>
                  <div style={{ fontSize:11, fontWeight:700, color:C.text }}>{s.label}</div>
                  <div style={{ fontSize:9, color:s.color, marginTop:2, fontWeight:600 }}>{s.sdk}</div>
                </div>
              ))}
            </div>

            <button onClick={()=>!scanning&&scanForDevices()} style={{ width:"100%", background:scanning?C.surface2:`${C.accent}18`, border:`1px solid ${scanning?C.border:C.accent+"44"}`, color:scanning?C.muted:C.accent, fontSize:12, fontWeight:700, padding:"10px", borderRadius:10, cursor:scanning?"not-allowed":"pointer", marginBottom:16 }}>
              {scanning ? "Scanning network & Bluetooth…" : "↻ Scan for Devices"}
            </button>

            {scannedDevices.length > 0 && (
              <div>
                <div style={{ fontSize:11, color:C.muted, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:10 }}>Found Nearby</div>
                {scannedDevices.map(d=>(
                  <div key={d.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 14px", background:C.surface, border:`1px solid ${C.border}`, borderRadius:11, marginBottom:8 }}>
                    <div style={{ fontSize:22, width:36, textAlign:"center" }}>{d.icon}</div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:13, fontWeight:700, color:C.text }}>{d.name}</div>
                      <div style={{ fontSize:10, color:C.muted, marginTop:2 }}>{d.sdk} · via {d.how}</div>
                    </div>
                    <button onClick={()=>addScannedDevice(d)} style={{ background:`${C.accent}18`, border:`1px solid ${C.accent}44`, color:C.accent, fontSize:11, fontWeight:700, padding:"6px 14px", borderRadius:8, cursor:"pointer" }}>
                      + Add
                    </button>
                  </div>
                ))}
              </div>
            )}
            {!scanning && scannedDevices.length===0 && (
              <div style={{ textAlign:"center", padding:"20px 0", color:C.muted, fontSize:12 }}>
                No new devices found. Make sure your equipment is powered on and connected to the same network or has Bluetooth enabled.
              </div>
            )}
          </div>
        </div>
      )}

      <div style={{ flex:1, overflow:"hidden", display:"flex" }}>

        {/* ── TAB: EQUIPMENT ── */}
        {tab==="equipment" && (
          <div style={{ display:"flex", flex:1, overflow:"hidden" }}>
            {/* Device list */}
            <div style={{ width:240, borderRight:`1px solid ${C.border}`, overflowY:"auto", padding:"12px 10px", flexShrink:0 }}>
              {["camera","gimbal","light","audio","monitor","encoder"].map(cat=>{
                const catDevices = devices.filter(d=>d.category===cat);
                if (!catDevices.length) return null;
                const col = CATEGORY_COLORS[cat];
                return (
                  <div key={cat} style={{ marginBottom:14 }}>
                    <div style={{ fontSize:9, fontWeight:700, color:col, textTransform:"uppercase", letterSpacing:"0.1em", padding:"0 6px 6px" }}>{CATEGORY_LABELS[cat]}s</div>
                    {catDevices.map(d=>(
                      <button key={d.id} onClick={()=>setSelectedDevice(d.id)} style={{ width:"100%", display:"flex", alignItems:"center", gap:8, padding:"9px 10px", borderRadius:9, border:"none", background:selectedDevice===d.id?`${col}18`:"transparent", cursor:"pointer", marginBottom:2, textAlign:"left" }}>
                        <span style={{ fontSize:16 }}>{d.icon}</span>
                        <div style={{ flex:1, minWidth:0 }}>
                          <div style={{ fontSize:12, fontWeight:selectedDevice===d.id?700:500, color:selectedDevice===d.id?C.text:C.muted, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{d.name}</div>
                          <div style={{ fontSize:9, color:d.connected?C.green:"#4b5563", marginTop:1 }}>{d.connected?"● Connected":"○ Offline"}</div>
                        </div>
                        {d.battery!==null && <span style={{ fontSize:9, color:d.battery>30?C.muted:"#f59e0b" }}>{d.battery}%</span>}
                      </button>
                    ))}
                  </div>
                );
              })}
            </div>

            {/* Device detail panel */}
            {dev && (
              <div style={{ flex:1, overflowY:"auto", padding:"20px 24px" }}>
                {/* Device header */}
                <div style={{ display:"flex", alignItems:"flex-start", gap:16, marginBottom:24 }}>
                  <div style={{ width:56, height:56, borderRadius:14, background:`${CATEGORY_COLORS[dev.category]}18`, border:`1px solid ${CATEGORY_COLORS[dev.category]}44`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:26, flexShrink:0 }}>{dev.icon}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:17, fontWeight:800, color:C.text, fontFamily:"'Syne',sans-serif", marginBottom:3 }}>{dev.name}</div>
                    <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                      <span style={{ fontSize:10, color:CATEGORY_COLORS[dev.category], background:`${CATEGORY_COLORS[dev.category]}15`, border:`1px solid ${CATEGORY_COLORS[dev.category]}33`, padding:"2px 8px", borderRadius:5, fontWeight:700 }}>{CATEGORY_LABELS[dev.category]}</span>
                      <span style={{ fontSize:10, color:dev.sdkStatus==="connected"?C.green:"#ef4444", background:dev.sdkStatus==="connected"?"#0a1e16":"#2d0808", border:`1px solid ${dev.sdkStatus==="connected"?C.green+"33":"#ef444433"}`, padding:"2px 8px", borderRadius:5, fontWeight:600 }}>
                        {dev.sdkStatus==="connected"?"● SDK Connected":"○ SDK Offline"}
                      </span>
                      <span style={{ fontSize:10, color:C.muted, background:C.surface2, border:`1px solid ${C.border}`, padding:"2px 8px", borderRadius:5 }}>{dev.sdk}</span>
                      {dev.battery!==null && <span style={{ fontSize:10, color:dev.battery>30?C.muted:C.amber, background:C.surface2, border:`1px solid ${C.border}`, padding:"2px 8px", borderRadius:5 }}>🔋 {dev.battery}%</span>}
                    </div>
                  </div>
                  <div style={{ display:"flex", gap:8 }}>
                    <button onClick={()=>toggleDeviceConnected(dev.id)} style={{ fontSize:11, fontWeight:600, color:dev.connected?"#ef4444":C.green, background:dev.connected?"#2d080818":"#0a1e16", border:`1px solid ${dev.connected?"#ef444433":C.green+"33"}`, padding:"7px 14px", borderRadius:8, cursor:"pointer" }}>
                      {dev.connected?"Disconnect":"Connect"}
                    </button>
                  </div>
                </div>

                {/* ── CAMERA CONTROLS ── */}
                {dev.category==="camera" && (
                  <div>
                    <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
                      <div style={{ fontSize:12, fontWeight:700, color:C.text }}>Camera Controls</div>
                      <span style={{ fontSize:10, color:"#a78bfa", background:"#2d1f5e22", border:"1px solid #7c3aed33", padding:"2px 8px", borderRadius:5 }}>Sony Camera Remote SDK</span>
                    </div>
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10, marginBottom:16 }}>
                      {[
                        { key:"iso", label:"ISO", options:["100","200","400","800","1600","3200","6400","12800"] },
                        { key:"aperture", label:"Aperture", options:["f/1.8","f/2","f/2.8","f/4","f/5.6","f/8"] },
                        { key:"shutter", label:"Shutter", options:["1/30","1/60","1/100","1/120","1/250","1/500"] },
                        { key:"wb", label:"White Balance", options:["3200K","4000K","5000K","5600K","6500K","Auto"] },
                        { key:"focus", label:"Focus Mode", options:["AF-S","AF-C","MF","Eye-AF"] },
                      ].map(ctrl=>(
                        <div key={ctrl.key} style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:10, padding:"12px 14px" }}>
                          <div style={{ fontSize:10, color:C.muted, marginBottom:6, textTransform:"uppercase", letterSpacing:"0.06em" }}>{ctrl.label}</div>
                          <select value={dev.settings[ctrl.key]} onChange={e=>updateDeviceSetting(dev.id,ctrl.key,e.target.value)} style={{ width:"100%", background:C.surface2, border:`1px solid ${C.border2}`, color:C.text, fontSize:12, fontWeight:700, padding:"5px 8px", borderRadius:7, outline:"none" }}>
                            {ctrl.options.map(o=><option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                      ))}
                      {/* REC button */}
                      <div style={{ background:dev.settings.rec?"#2d0808":"#0a0a15", border:`1px solid ${dev.settings.rec?"#ef444455":C.border}`, borderRadius:10, padding:"12px 14px", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", cursor:"pointer" }} onClick={()=>updateDeviceSetting(dev.id,"rec",!dev.settings.rec)}>
                        <div style={{ width:22, height:22, borderRadius:"50%", background:dev.settings.rec?"#ef4444":C.surface2, border:`2px solid ${dev.settings.rec?"#ef4444":C.border2}`, marginBottom:6, animation:dev.settings.rec?"pulse 1s infinite":undefined }} />
                        <div style={{ fontSize:10, fontWeight:700, color:dev.settings.rec?"#ef4444":C.muted }}>{dev.settings.rec?"● REC":"REC"}</div>
                      </div>
                    </div>
                    {/* Signal bars */}
                    <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:10, padding:"12px 16px", display:"flex", alignItems:"center", gap:16 }}>
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:10, color:C.muted, marginBottom:4 }}>Signal Strength</div>
                        <div style={{ display:"flex", gap:3, alignItems:"flex-end" }}>
                          {[1,2,3,4,5].map(i=>(
                            <div key={i} style={{ width:8, height:6+i*4, background:i<=dev.signal?CATEGORY_COLORS[dev.category]:C.surface2, borderRadius:2 }} />
                          ))}
                        </div>
                      </div>
                      <div style={{ textAlign:"right" }}>
                        <div style={{ fontSize:10, color:C.muted, marginBottom:2 }}>Resolution</div>
                        <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:12, fontWeight:700, color:C.text }}>{dev.id==="fx3"?"4K/60fps":"4K/120fps"}</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── GIMBAL CONTROLS ── */}
                {dev.category==="gimbal" && (
                  <div>
                    <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
                      <div style={{ fontSize:12, fontWeight:700, color:C.text }}>Gimbal Controls</div>
                      <span style={{ fontSize:10, color:"#f59e0b", background:"#2e1f0a22", border:"1px solid #f59e0b33", padding:"2px 8px", borderRadius:5 }}>DJI Ronin SDK · Bluetooth</span>
                    </div>
                    {/* Follow mode */}
                    <div style={{ marginBottom:16 }}>
                      <div style={{ fontSize:11, color:C.muted, marginBottom:8 }}>Follow Mode</div>
                      <div style={{ display:"flex", gap:8 }}>
                        {["Pan Follow","Full Follow","FPV","Locked"].map(m=>{
                          const active = dev.settings.mode===m;
                          return (
                            <button key={m} onClick={()=>updateDeviceSetting(dev.id,"mode",m)} style={{ flex:1, padding:"9px 8px", background:active?`${CATEGORY_COLORS.gimbal}18`:C.surface, border:`1.5px solid ${active?CATEGORY_COLORS.gimbal+"66":C.border}`, borderRadius:9, color:active?CATEGORY_COLORS.gimbal:C.muted, fontSize:11, fontWeight:active?700:400, cursor:"pointer" }}>
                              {m}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    {/* Axis controls */}
                    {["tilt","pan","roll"].map(axis=>(
                      <div key={axis} style={{ marginBottom:12 }}>
                        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                          <span style={{ fontSize:11, color:C.muted, textTransform:"capitalize" }}>{axis}</span>
                          <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:11, color:CATEGORY_COLORS.gimbal, fontWeight:700 }}>{dev.settings[axis]}°</span>
                        </div>
                        <input type="range" min="-90" max="90" value={dev.settings[axis]}
                          onChange={e=>updateDeviceSetting(dev.id,axis,parseInt(e.target.value))}
                          style={{ width:"100%", accentColor:CATEGORY_COLORS.gimbal }} />
                      </div>
                    ))}
                    {/* Speed */}
                    <div style={{ marginBottom:16 }}>
                      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                        <span style={{ fontSize:11, color:C.muted }}>Motor Speed</span>
                        <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:11, color:CATEGORY_COLORS.gimbal, fontWeight:700 }}>{dev.settings.speed}%</span>
                      </div>
                      <input type="range" min="10" max="100" value={dev.settings.speed}
                        onChange={e=>updateDeviceSetting(dev.id,"speed",parseInt(e.target.value))}
                        style={{ width:"100%", accentColor:CATEGORY_COLORS.gimbal }} />
                    </div>
                    {/* Subject tracking */}
                    <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:10, padding:"12px 16px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                      <div>
                        <div style={{ fontSize:12, fontWeight:600, color:C.text }}>Subject Tracking</div>
                        <div style={{ fontSize:11, color:C.muted, marginTop:2 }}>RS4 Pro / RS5 Pro active tracking</div>
                      </div>
                      <div onClick={()=>updateDeviceSetting(dev.id,"tracking",!dev.settings.tracking)} style={{ width:44, height:24, borderRadius:12, background:dev.settings.tracking?CATEGORY_COLORS.gimbal:C.border2, cursor:"pointer", position:"relative", transition:"background .2s" }}>
                        <div style={{ position:"absolute", top:3, left:dev.settings.tracking?22:3, width:18, height:18, borderRadius:"50%", background:"#fff", transition:"left .2s" }} />
                      </div>
                    </div>
                    {/* Quick moves */}
                    <div style={{ marginTop:14 }}>
                      <div style={{ fontSize:11, color:C.muted, marginBottom:8 }}>Quick Positions</div>
                      <div style={{ display:"flex", gap:8 }}>
                        {[
                          { label:"Center",   t:0,   p:0,   r:0 },
                          { label:"Wide",     t:-5,  p:-10, r:0 },
                          { label:"Product",  t:10,  p:5,   r:0 },
                          { label:"Over Shoulder", t:15, p:-20, r:0 },
                        ].map(pos=>(
                          <button key={pos.label} onClick={()=>{ updateDeviceSetting(dev.id,"tilt",pos.t); updateDeviceSetting(dev.id,"pan",pos.p); updateDeviceSetting(dev.id,"roll",pos.r); }} style={{ flex:1, fontSize:10, fontWeight:600, color:C.muted, background:C.surface, border:`1px solid ${C.border}`, padding:"7px 6px", borderRadius:8, cursor:"pointer" }}>
                            {pos.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* ── LIGHT CONTROLS ── */}
                {dev.category==="light" && (
                  <div>
                    <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
                      <div style={{ fontSize:12, fontWeight:700, color:C.text }}>Light Controls</div>
                      <span style={{ fontSize:10, color:C.green, background:"#0a1e1622", border:"1px solid #10b98133", padding:"2px 8px", borderRadius:5 }}>
                        {dev.brand==="Elgato"?"Elgato HTTP API":dev.brand==="Aputure"?"Sidus Link SDK":"Godox Bluetooth"}
                      </span>
                    </div>
                    {/* On/Off */}
                    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", background:C.surface, border:`1px solid ${C.border}`, borderRadius:10, padding:"14px 16px", marginBottom:12 }}>
                      <div>
                        <div style={{ fontSize:13, fontWeight:700, color:C.text }}>Power</div>
                        <div style={{ fontSize:11, color:C.muted, marginTop:2 }}>{dev.settings.on?"Light is on":"Light is off"}</div>
                      </div>
                      <div onClick={()=>updateDeviceSetting(dev.id,"on",!dev.settings.on)} style={{ width:48, height:26, borderRadius:13, background:dev.settings.on?C.green:C.border2, cursor:"pointer", position:"relative", transition:"background .2s" }}>
                        <div style={{ position:"absolute", top:3, left:dev.settings.on?24:3, width:20, height:20, borderRadius:"50%", background:"#fff", transition:"left .2s" }} />
                      </div>
                    </div>
                    {/* Brightness */}
                    <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:10, padding:"14px 16px", marginBottom:12 }}>
                      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:10 }}>
                        <span style={{ fontSize:12, fontWeight:600, color:C.text }}>Brightness</span>
                        <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:12, fontWeight:700, color:C.green }}>{dev.settings.brightness}%</span>
                      </div>
                      <input type="range" min="0" max="100" value={dev.settings.brightness}
                        onChange={e=>updateDeviceSetting(dev.id,"brightness",parseInt(e.target.value))}
                        style={{ width:"100%", accentColor:C.green }} />
                      <div style={{ display:"flex", justifyContent:"space-between", marginTop:4 }}>
                        <span style={{ fontSize:9, color:C.muted }}>0%</span>
                        <span style={{ fontSize:9, color:C.muted }}>100%</span>
                      </div>
                    </div>
                    {/* Color temp */}
                    <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:10, padding:"14px 16px", marginBottom:12 }}>
                      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:10 }}>
                        <span style={{ fontSize:12, fontWeight:600, color:C.text }}>Color Temperature</span>
                        <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:12, fontWeight:700, color:"#f59e0b" }}>{dev.settings.temp}K</span>
                      </div>
                      <input type="range" min="2700" max="7500" step="100" value={dev.settings.temp}
                        onChange={e=>updateDeviceSetting(dev.id,"temp",parseInt(e.target.value))}
                        style={{ width:"100%", accentColor:"#f59e0b" }} />
                      <div style={{ display:"flex", justifyContent:"space-between", marginTop:4 }}>
                        <span style={{ fontSize:9, color:"#f59e0b" }}>2700K Warm</span>
                        <span style={{ fontSize:9, color:"#93c5fd" }}>7500K Cool</span>
                      </div>
                    </div>
                    {/* Preset scenes */}
                    <div style={{ marginBottom:12 }}>
                      <div style={{ fontSize:11, color:C.muted, marginBottom:8 }}>Quick Presets</div>
                      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                        {[
                          { label:"Daylight",    b:90, t:5600 },
                          { label:"Warm Studio", b:75, t:4000 },
                          { label:"Cinematic",   b:50, t:3200 },
                          { label:"Bright Show",  b:100,t:6500 },
                        ].map(p=>(
                          <button key={p.label} onClick={()=>{ updateDeviceSetting(dev.id,"brightness",p.b); updateDeviceSetting(dev.id,"temp",p.t); }} style={{ fontSize:11, fontWeight:600, color:C.muted, background:C.surface, border:`1px solid ${C.border}`, padding:"8px", borderRadius:9, cursor:"pointer" }}>
                            {p.label}<br/><span style={{ fontSize:9, color:C.subtle }}>{p.b}% · {p.t}K</span>
                          </button>
                        ))}
                      </div>
                    </div>
                    {/* Effect (Aputure only) */}
                    {dev.brand==="Aputure" && (
                      <div>
                        <div style={{ fontSize:11, color:C.muted, marginBottom:8 }}>Effect Mode</div>
                        <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                          {["none","lightning","TV flash","pulse","strobe"].map(fx=>(
                            <button key={fx} onClick={()=>updateDeviceSetting(dev.id,"effect",fx)} style={{ fontSize:11, fontWeight:600, color:dev.settings.effect===fx?C.green:C.muted, background:dev.settings.effect===fx?"#0a1e16":C.surface, border:`1px solid ${dev.settings.effect===fx?C.green+"44":C.border}`, padding:"6px 12px", borderRadius:7, cursor:"pointer", textTransform:"capitalize" }}>
                              {fx==="none"?"No Effect":fx}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* ── MONITOR / AUDIO / ENCODER ── */}
                {(dev.category==="monitor"||dev.category==="audio"||dev.category==="encoder") && (
                  <div>
                    <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, padding:"16px 18px", marginBottom:14 }}>
                      <div style={{ fontSize:12, fontWeight:700, color:C.text, marginBottom:12 }}>Device Info</div>
                      {Object.entries(dev.settings).map(([k,v])=>(
                        <div key={k} style={{ display:"flex", justifyContent:"space-between", padding:"6px 0", borderBottom:`1px solid ${C.border}` }}>
                          <span style={{ fontSize:11, color:C.muted, textTransform:"capitalize" }}>{k.replace(/([A-Z])/g," $1")}</span>
                          <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:11, fontWeight:700, color:C.text }}>{String(v)}</span>
                        </div>
                      ))}
                    </div>
                    {dev.category==="audio" && (
                      <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, padding:"16px 18px" }}>
                        <div style={{ fontSize:12, fontWeight:700, color:C.text, marginBottom:12 }}>Live Levels</div>
                        {["Channel A","Channel B"].map((ch,i)=>{
                          const level = i===0?82:34;
                          return (
                            <div key={ch} style={{ marginBottom:i===0?12:0 }}>
                              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                                <span style={{ fontSize:11, color:C.muted }}>{ch}</span>
                                <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:11, color:level>80?C.amber:C.green }}>{level}%</span>
                              </div>
                              <div style={{ height:6, background:C.surface2, borderRadius:3, overflow:"hidden" }}>
                                <div style={{ width:`${level}%`, height:"100%", background:level>80?"#f59e0b":C.green, borderRadius:3 }} />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── TAB: OBS SCENES ── */}
        {tab==="obs" && (
          <div style={{ flex:1, overflowY:"auto", padding:"20px 28px" }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:20 }}>
              <div style={{ width:10, height:10, borderRadius:"50%", background:obsConnected?C.green:"#ef4444", animation:obsConnected?"pulse 2s infinite":undefined }} />
              <span style={{ fontSize:12, fontWeight:700, color:obsConnected?C.green:"#ef4444" }}>OBS WebSocket {obsConnected?"Connected":"Disconnected"}</span>
              <span style={{ fontSize:11, color:C.muted }}>· ws://localhost:4455</span>
              <div style={{ marginLeft:"auto", display:"flex", gap:8 }}>
                <select value={transitionType} onChange={e=>setTransitionType(e.target.value)} style={{ background:C.surface2, border:`1px solid ${C.border2}`, color:C.text, fontSize:11, padding:"5px 10px", borderRadius:7, outline:"none" }}>
                  {["Cut","Fade","Slide","Stinger"].map(t=><option key={t}>{t}</option>)}
                </select>
                <button onClick={()=>setScenes(p=>[...p,{id:`s${Date.now()}`,name:"New Scene",source:"fx3",preview:"📷 New"}])} style={{ background:C.surface, border:`1px solid ${C.border}`, color:C.muted, fontSize:11, fontWeight:600, padding:"5px 14px", borderRadius:7, cursor:"pointer" }}>+ Scene</button>
              </div>
            </div>

            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, marginBottom:24 }}>
              {scenes.map(s=>{
                const isActive = activeScene===s.name;
                return (
                  <div key={s.id} onClick={()=>setActiveScene(s.name)} style={{ background:isActive?`${C.accent}12`:C.surface, border:`2px solid ${isActive?C.accent+"66":C.border}`, borderRadius:14, overflow:"hidden", cursor:"pointer", transition:"all .15s" }}>
                    {/* Preview box */}
                    <div style={{ height:72, background:"#000", display:"flex", alignItems:"center", justifyContent:"center", position:"relative" }}>
                      <span style={{ fontSize:11, color:"#4b5563" }}>{s.preview}</span>
                      {isActive && (
                        <div style={{ position:"absolute", top:6, left:6, background:"#ef4444", borderRadius:4, padding:"1px 7px" }}>
                          <span style={{ fontSize:9, fontWeight:800, color:"#fff" }}>LIVE</span>
                        </div>
                      )}
                    </div>
                    <div style={{ padding:"10px 12px" }}>
                      <div style={{ fontSize:12, fontWeight:700, color:isActive?C.text:C.muted }}>{s.name}</div>
                      <div style={{ fontSize:10, color:C.subtle, marginTop:2 }}>Source: {s.source}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Transition */}
            <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:14, padding:"16px 20px" }}>
              <div style={{ fontSize:12, fontWeight:700, color:C.text, marginBottom:12 }}>Active Scene</div>
              <div style={{ display:"flex", alignItems:"center", gap:16 }}>
                <div style={{ flex:1, background:"#000", borderRadius:10, height:80, display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <span style={{ fontSize:13, color:C.green, fontWeight:700 }}>● {activeScene}</span>
                </div>
                <div style={{ fontSize:20, color:C.muted }}>→</div>
                <div style={{ flex:1, background:C.surface2, borderRadius:10, height:80, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:4 }}>
                  <span style={{ fontSize:11, color:C.muted }}>Next</span>
                  <span style={{ fontSize:12, color:C.text, fontWeight:600 }}>Click a scene to cut</span>
                </div>
              </div>
              <div style={{ marginTop:12, fontSize:11, color:C.muted }}>Transition: <span style={{ color:C.text, fontWeight:600 }}>{transitionType}</span> · Via OBS WebSocket v5 API</div>
            </div>
          </div>
        )}

        {/* ── TAB: AUTOMATION ── */}
        {tab==="automation" && (
          <div style={{ flex:1, overflowY:"auto", padding:"20px 28px" }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20 }}>
              <div>
                <div style={{ fontSize:13, fontWeight:700, color:C.text }}>Scene Automations</div>
                <div style={{ fontSize:11, color:C.muted, marginTop:2 }}>Trigger equipment changes from show events automatically</div>
              </div>
              <button style={{ background:C.surface, border:`1px solid ${C.border}`, color:C.muted, fontSize:11, fontWeight:600, padding:"7px 14px", borderRadius:8, cursor:"pointer" }}>+ Add Rule</button>
            </div>

            <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:28 }}>
              {automations.map(a=>(
                <div key={a.id} style={{ background:C.surface, border:`1px solid ${a.enabled?C.accent+"33":C.border}`, borderRadius:14, padding:"14px 18px", display:"flex", alignItems:"center", gap:14 }}>
                  <div style={{ width:38, height:38, borderRadius:10, background:a.enabled?`${C.accent}18`:C.surface2, border:`1px solid ${a.enabled?C.accent+"44":C.border}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>{a.icon}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ display:"flex", gap:8, alignItems:"center", marginBottom:4 }}>
                      <span style={{ fontSize:10, fontWeight:700, color:C.muted, background:C.surface2, border:`1px solid ${C.border}`, padding:"2px 8px", borderRadius:5 }}>WHEN</span>
                      <span style={{ fontSize:12, fontWeight:700, color:C.text }}>{a.trigger}</span>
                    </div>
                    <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                      <span style={{ fontSize:10, fontWeight:700, color:C.accent, background:`${C.accent}15`, border:`1px solid ${C.accent}33`, padding:"2px 8px", borderRadius:5 }}>THEN</span>
                      <span style={{ fontSize:12, color:C.muted }}>{a.action}</span>
                    </div>
                    <div style={{ display:"flex", gap:6, marginTop:6 }}>
                      {a.devices.map(did=>{
                        const d = devices.find(x=>x.id===did);
                        return d ? <span key={did} style={{ fontSize:9, color:C.subtle, background:C.surface2, border:`1px solid ${C.border}`, padding:"1px 7px", borderRadius:4 }}>{d.icon} {d.name}</span> : null;
                      })}
                    </div>
                  </div>
                  <div onClick={()=>setAutomations(prev=>prev.map(x=>x.id===a.id?{...x,enabled:!x.enabled}:x))} style={{ width:44, height:24, borderRadius:12, background:a.enabled?C.accent:C.border2, cursor:"pointer", position:"relative", transition:"background .2s", flexShrink:0 }}>
                    <div style={{ position:"absolute", top:3, left:a.enabled?22:3, width:18, height:18, borderRadius:"50%", background:"#fff", transition:"left .2s" }} />
                  </div>
                </div>
              ))}
            </div>

            {/* SDK Connection guide */}
            <div style={{ background:"#0d0d1a", border:`1px solid ${C.border}`, borderRadius:14, padding:"18px 22px" }}>
              <div style={{ fontSize:12, fontWeight:700, color:C.text, marginBottom:14 }}>SDK Integration Status</div>
              <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                {[
                  { name:"Sony Camera Remote SDK", status:"connected", note:"FX3 + FX6 responding",         color:C.green,   url:"developer.sony.com/develop/cameras" },
                  { name:"DJI Ronin SDK",           status:"connected", note:"RS4 Pro paired via Bluetooth", color:C.green,   url:"developer.dji.com/mobile-sdk" },
                  { name:"Elgato HTTP API",          status:"connected", note:"Key Light on 192.168.1.42",   color:C.green,   url:"github.com/dave-wind/elgato-api" },
                  { name:"Aputure Sidus Link SDK",   status:"pending",  note:"Not yet configured",           color:C.amber,   url:"aputure.com/siduslink" },
                  { name:"OBS WebSocket v5",         status:"connected", note:"ws://localhost:4455",          color:C.green,   url:"obsproject.com/wiki/ob-websocket" },
                  { name:"Godox Bluetooth",          status:"pending",  note:"No Godox devices paired",      color:C.amber,   url:"godox.com/app" },
                ].map(s=>(
                  <div key={s.name} style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 14px", background:C.surface, border:`1px solid ${C.border}`, borderRadius:10 }}>
                    <div style={{ width:8, height:8, borderRadius:"50%", background:s.color, flexShrink:0 }} />
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:12, fontWeight:700, color:C.text }}>{s.name}</div>
                      <div style={{ fontSize:10, color:C.muted, marginTop:1 }}>{s.note}</div>
                    </div>
                    <span style={{ fontSize:10, fontWeight:600, color:s.color, background:`${s.color}15`, border:`1px solid ${s.color}33`, padding:"2px 10px", borderRadius:6 }}>
                      {s.status==="connected"?"Connected":"Setup Needed"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── TAB: STREAM ── */}
        {tab==="stream" && (
          <div style={{ flex:1, overflowY:"auto", padding:"20px 28px" }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20 }}>
              <div>
                <div style={{ fontSize:13, fontWeight:700, color:C.text }}>Stream Destinations</div>
                <div style={{ fontSize:11, color:C.muted, marginTop:2 }}>Test each platform before going live. All must be green.</div>
              </div>
              <button onClick={()=>navigate("show-planner")} disabled={!allStreamReady} style={{ background:allStreamReady?"linear-gradient(135deg,#10b981,#059669)":"#1a1a2e", border:`1px solid ${allStreamReady?C.green+"44":C.border}`, color:allStreamReady?"#fff":C.muted, fontSize:13, fontWeight:700, padding:"10px 22px", borderRadius:10, cursor:allStreamReady?"pointer":"not-allowed" }}>
                {allStreamReady?"🔴 All Systems Go →":"Test all streams first"}
              </button>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:12, marginBottom:24 }}>
              {DESTINATIONS.filter(d=>persona.platforms.includes(d.id)).map(dest=>{
                const ready = streamTests[dest.id];
                const testing = testingDest===dest.id;
                return (
                  <div key={dest.id} style={{ background:C.surface, border:`1px solid ${ready?dest.color+"44":C.border}`, borderRadius:14, padding:"16px 20px" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:14 }}>
                      <PlatformPill code={dest.id} />
                      <div style={{ flex:1 }}>
                        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
                          <span style={{ fontSize:13, fontWeight:700, color:C.text }}>{dest.label}</span>
                          {ready && <span style={{ fontSize:10, fontWeight:700, color:C.green, background:"#0a1e16", border:"1px solid #10b98133", padding:"1px 8px", borderRadius:5 }}>✓ Ready</span>}
                        </div>
                        <div style={{ display:"flex", gap:16 }}>
                          <span style={{ fontSize:11, color:C.muted }}>Bitrate <span style={{ fontFamily:"'JetBrains Mono',monospace", color:C.text, fontWeight:700 }}>{dest.bitrate}</span></span>
                          <span style={{ fontSize:11, color:C.muted }}>Latency <span style={{ fontFamily:"'JetBrains Mono',monospace", color:parseFloat(dest.latency)>2?C.amber:C.green, fontWeight:700 }}>{dest.latency}</span></span>
                        </div>
                      </div>
                      <button onClick={()=>!ready&&testStream(dest.id)} disabled={ready||testing} style={{ background:ready?"#0a1e16":testing?C.surface2:`${dest.color}18`, border:`1px solid ${ready?C.green+"44":dest.color+"33"}`, color:ready?C.green:testing?C.muted:dest.color, fontSize:12, fontWeight:700, padding:"8px 18px", borderRadius:9, cursor:ready?"default":"pointer" }}>
                        {ready?"✓ Connected":testing?"Testing…":"Test Connection"}
                      </button>
                    </div>
                    <div style={{ marginTop:10, background:C.surface2, border:`1px solid ${C.border}`, borderRadius:8, padding:"7px 12px" }}>
                      <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10, color:C.subtle }}>{dest.rtmp}</span>
                    </div>
                  </div>
                );
              })}
            </div>
            {/* Encoder settings */}
            <div style={{ background:"#0d0d1a", border:`1px solid ${C.border}`, borderRadius:14, padding:"16px 20px" }}>
              <div style={{ fontSize:12, fontWeight:700, color:C.text, marginBottom:14 }}>Encoder Settings (OBS)</div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12 }}>
                {[
                  { label:"Video Codec",    value:"H.264 / AVC" },
                  { label:"Resolution",     value:"1920 × 1080" },
                  { label:"Frame Rate",     value:"60 fps" },
                  { label:"Video Bitrate",  value:"6,000 kbps" },
                  { label:"Audio Bitrate",  value:"128 kbps AAC" },
                  { label:"Keyframe Int.",  value:"2 seconds" },
                ].map(s=>(
                  <div key={s.label} style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:9, padding:"10px 14px" }}>
                    <div style={{ fontSize:10, color:C.muted, marginBottom:3 }}>{s.label}</div>
                    <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:13, fontWeight:700, color:C.text }}>{s.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}


// ─── SCREEN: LOYALTY HUB ─────────────────────────────────────────────────────
function ScreenLoyalty({ buyers, navigate, persona }) {
  const [tab, setTab]         = useState("overview");
  const [search, setSearch]   = useState("");
  const [awardModal, setAwardModal] = useState(false);
  const [awardBuyer, setAwardBuyer] = useState("");
  const [awardAmount, setAwardAmount] = useState("100");
  const [awardReason, setAwardReason] = useState("manual");
  const [awardDone, setAwardDone]   = useState(false);

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
          <button onClick={() => { setAwardDone(false); setAwardBuyer(""); setAwardAmount("100"); setAwardModal(true); }} style={{ background:`linear-gradient(135deg,${C.accent},${C.accent2})`, border:"none", color:"#fff", fontSize:12, fontWeight:700, padding:"8px 18px", borderRadius:9, cursor:"pointer" }}>
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

      {/* ── AWARD POINTS MODAL ── */}
      {awardModal && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.72)", zIndex:9999, display:"flex", alignItems:"center", justifyContent:"center" }}
          onClick={e => { if (e.target === e.currentTarget) setAwardModal(false); }}>
          <div style={{ background:C.surface2, border:`1px solid ${C.border2}`, borderRadius:16, padding:"28px 28px 24px", width:400, boxShadow:"0 24px 80px rgba(0,0,0,0.6)" }}>
            {awardDone ? (
              <div style={{ textAlign:"center", padding:"16px 0" }}>
                <div style={{ fontSize:36, marginBottom:12 }}>✅</div>
                <div style={{ fontFamily:"'Syne',sans-serif", fontSize:17, fontWeight:800, color:C.text, marginBottom:6 }}>Points Awarded!</div>
                <div style={{ fontSize:13, color:C.muted, marginBottom:24 }}>
                  <strong style={{ color:C.green }}>+{awardAmount} pts</strong> added to {enriched.find(b=>b.id===awardBuyer)?.name || "buyer"}'s balance.
                </div>
                <button onClick={() => setAwardModal(false)} style={{ background:`linear-gradient(135deg,${C.accent},${C.accent2})`, border:"none", color:"#fff", fontSize:13, fontWeight:700, padding:"10px 28px", borderRadius:9, cursor:"pointer" }}>
                  Done
                </button>
              </div>
            ) : (
              <>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:22 }}>
                  <div style={{ fontFamily:"'Syne',sans-serif", fontSize:16, fontWeight:800, color:C.text }}>Award Points</div>
                  <button onClick={() => setAwardModal(false)} style={{ background:"none", border:"none", color:C.muted, fontSize:18, cursor:"pointer", lineHeight:1, padding:"2px 6px" }}>✕</button>
                </div>

                {/* Buyer selector */}
                <div style={{ marginBottom:16 }}>
                  <div style={{ fontSize:10, fontWeight:700, color:C.muted, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:7 }}>Buyer</div>
                  <select value={awardBuyer} onChange={e => setAwardBuyer(e.target.value)}
                    style={{ width:"100%", background:C.surface, border:`1px solid ${C.border2}`, borderRadius:9, padding:"10px 12px", color: awardBuyer ? C.text : C.muted, fontSize:13 }}>
                    <option value="">Select a buyer…</option>
                    {enriched.map(b => (
                      <option key={b.id} value={b.id}>{b.name} — {b.loyalty.points.toLocaleString()} pts ({b.loyalty.tier})</option>
                    ))}
                  </select>
                </div>

                {/* Points amount */}
                <div style={{ marginBottom:16 }}>
                  <div style={{ fontSize:10, fontWeight:700, color:C.muted, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:7 }}>Points to Award</div>
                  <div style={{ display:"flex", gap:8, marginBottom:10 }}>
                    {["50","100","250","500"].map(amt => (
                      <button key={amt} onClick={() => setAwardAmount(amt)}
                        style={{ flex:1, background: awardAmount===amt ? `${C.accent}22` : C.surface, border:`1px solid ${awardAmount===amt ? C.accent : C.border2}`, color: awardAmount===amt ? C.accent : C.muted, fontSize:12, fontWeight:700, padding:"8px 0", borderRadius:8, cursor:"pointer" }}>
                        +{amt}
                      </button>
                    ))}
                  </div>
                  <input type="number" value={awardAmount} onChange={e => setAwardAmount(e.target.value)} placeholder="Custom amount"
                    style={{ width:"100%", background:C.surface, border:`1px solid ${C.border2}`, borderRadius:9, padding:"10px 12px", color:C.text, fontSize:13 }} />
                </div>

                {/* Reason */}
                <div style={{ marginBottom:24 }}>
                  <div style={{ fontSize:10, fontWeight:700, color:C.muted, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:7 }}>Reason</div>
                  <select value={awardReason} onChange={e => setAwardReason(e.target.value)}
                    style={{ width:"100%", background:C.surface, border:`1px solid ${C.border2}`, borderRadius:9, padding:"10px 12px", color:C.text, fontSize:13 }}>
                    <option value="manual">Manual award</option>
                    <option value="show">Show attendance bonus</option>
                    <option value="purchase">Purchase bonus</option>
                    <option value="referral">Referral reward</option>
                    <option value="birthday">Birthday gift</option>
                    <option value="winback">Win-back offer</option>
                  </select>
                </div>

                <button
                  disabled={!awardBuyer || !awardAmount || parseInt(awardAmount) <= 0}
                  onClick={() => setAwardDone(true)}
                  style={{ width:"100%", background: (!awardBuyer || !awardAmount) ? C.border2 : `linear-gradient(135deg,${C.accent},${C.accent2})`, border:"none", color: (!awardBuyer || !awardAmount) ? C.muted : "#fff", fontSize:14, fontWeight:700, padding:"13px", borderRadius:10, cursor: (!awardBuyer || !awardAmount) ? "default" : "pointer", transition:"all .15s" }}>
                  Award {awardAmount ? `+${parseInt(awardAmount).toLocaleString()} pts` : "Points"}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}


// ═══════════════════════════════════════════════════════════════════════════════
// ENTERPRISE SCREENS
// ═══════════════════════════════════════════════════════════════════════════════

// ─── ENTERPRISE: NETWORK OVERVIEW ─────────────────────────────────────────────
function ScreenNetwork({ persona, navigate }) {
  const sellers   = persona.managedSellers;
  const networkGMV   = sellers.reduce((a,s)=>a+s.gmv, 0);
  const prevGMV      = sellers.reduce((a,s)=>a+s.gmvPrev, 0);
  const gmvDelta     = Math.round((networkGMV-prevGMV)/prevGMV*100);
  const activeSellers = sellers.filter(s=>s.status==="active").length;
  const totalBuyers  = sellers.reduce((a,s)=>a+s.buyerCount, 0);
  const totalSubs    = sellers.reduce((a,s)=>a+s.subscriberCount, 0);
  const allAlerts    = sellers.flatMap(s=>s.alerts.map(a=>({...a, seller:s.name, sellerId:s.id})));
  const topSellers   = [...sellers].filter(s=>s.status==="active").sort((a,b)=>b.gmv-a.gmv).slice(0,5);

  const planBreakdown = sellers.reduce((acc,s)=>{ acc[s.plan]=(acc[s.plan]||0)+1; return acc; },{});
  const planColors = { starter:"#10b981", growth:"#7c3aed", pro:"#f59e0b" };

  // Mini bar chart data — simulate 8-week trend
  const weeklyData = [28400,31200,29800,34100,37200,35800,39400,networkGMV/4];

  return (
    <div style={{ padding:"28px 32px", overflowY:"auto", height:"100%" }}>
      {/* Header */}
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:24, flexWrap:"wrap", gap:12 }}>
        <div>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:6 }}>
            <div style={{ fontFamily:"'Syne',sans-serif", fontSize:22, fontWeight:800, color:C.text, letterSpacing:"-0.5px" }}>
              Good evening, {persona.name.split(" ")[0]} 👋
            </div>
            <span style={{ fontSize:9, fontWeight:800, color:"#a78bfa", background:"#a78bfa18", border:"1px solid #a78bfa44", padding:"3px 10px", borderRadius:99, textTransform:"uppercase", letterSpacing:"0.08em" }}>Enterprise</span>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:8, fontSize:12, color:C.muted }}>
            <span>{persona.shop}</span>
            <span style={{ color:C.subtle }}>·</span>
            <span style={{ color:"#10b981", fontWeight:600 }}>🌐 {persona.whiteLabelDomain}</span>
            <span style={{ color:C.subtle }}>·</span>
            <span>{persona.teamSize} team members</span>
          </div>
        </div>
        <button onClick={()=>navigate("sellers")} className="cta-btn"
          style={{ background:"linear-gradient(135deg,#a78bfa,#7c3aed)", border:"none", color:"#fff", fontSize:12, fontWeight:700, padding:"9px 20px", borderRadius:9, cursor:"pointer" }}>
          Manage Sellers →
        </button>
      </div>

      {/* Network KPIs */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:20 }}>
        {[
          { label:"Network GMV (30d)",  value:`$${(networkGMV/1000).toFixed(0)}k`, sub:`${gmvDelta>=0?"+":""}${gmvDelta}% vs prev month`, color:"#a78bfa", up:gmvDelta>=0 },
          { label:"Active Sellers",     value:activeSellers,                         sub:`${sellers.length-activeSellers} paused`,            color:"#10b981", up:true },
          { label:"Network Buyers",     value:totalBuyers.toLocaleString(),           sub:"across all accounts",                               color:"#7c3aed", up:true },
          { label:"Opt-in Subscribers", value:totalSubs.toLocaleString(),             sub:"across all opt-in pages",                           color:"#f59e0b", up:true },
        ].map(k=>(
          <div key={k.label} style={{ background:C.surface, border:`1px solid ${C.border}`, borderTop:`2px solid ${k.color}`, borderRadius:12, padding:"16px 18px" }}>
            <div style={{ fontSize:10, color:C.muted, textTransform:"uppercase", letterSpacing:"0.08em", fontWeight:700, marginBottom:8 }}>{k.label}</div>
            <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:26, fontWeight:700, color:C.text, lineHeight:1, marginBottom:5 }}>{k.value}</div>
            <div style={{ fontSize:10, color:k.up?"#10b981":C.amber }}>{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Main grid */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 340px", gap:16, marginBottom:16 }}>
        {/* Left: GMV trend + top sellers */}
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          {/* Trend chart */}
          <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:14, padding:"18px 20px" }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
              <span style={{ fontSize:12, fontWeight:700, color:C.text }}>Network GMV — 8 Week Trend</span>
              <span style={{ fontSize:10, color:"#10b981", fontWeight:600 }}>+{gmvDelta}% MTD</span>
            </div>
            <svg width="100%" height="80" viewBox="0 0 400 80" preserveAspectRatio="none">
              <defs>
                <linearGradient id="ngmv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.3"/>
                  <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.02"/>
                </linearGradient>
              </defs>
              {(() => {
                const mx=Math.max(...weeklyData), mn=Math.min(...weeklyData)*0.9;
                const pts=weeklyData.map((v,i)=>[i*(400/7), 80-((v-mn)/(mx-mn))*70]);
                const pathD="M"+pts.map(p=>p.join(",")).join(" L");
                const areaD=pathD+` L${pts[pts.length-1][0]},80 L0,80 Z`;
                return (<>
                  <path d={areaD} fill="url(#ngmv)"/>
                  <path d={pathD} fill="none" stroke="#a78bfa" strokeWidth="2" strokeLinejoin="round"/>
                  {pts.map((p,i)=><circle key={i} cx={p[0]} cy={p[1]} r="3" fill="#a78bfa"/>)}
                </>);
              })()}
            </svg>
            <div style={{ display:"flex", justifyContent:"space-between", marginTop:8 }}>
              {["W1","W2","W3","W4","W5","W6","W7","W8"].map(w=>(
                <span key={w} style={{ fontSize:9, color:C.subtle }}>{w}</span>
              ))}
            </div>
          </div>

          {/* Top sellers table */}
          <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:14, padding:"18px 20px" }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
              <span style={{ fontSize:12, fontWeight:700, color:C.text }}>Top Performers This Month</span>
              <button onClick={()=>navigate("sellers")} style={{ fontSize:11, color:"#a78bfa", background:"none", border:"none", cursor:"pointer", fontWeight:600 }}>View all →</button>
            </div>
            {topSellers.map((s,i)=>{
              const delta=Math.round((s.gmv-s.gmvPrev)/s.gmvPrev*100);
              const pct=Math.round(s.gmv/networkGMV*100);
              return (
                <div key={s.id} onClick={()=>navigate("seller-detail",{sellerId:s.id})}
                  style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 0", borderBottom:i<topSellers.length-1?`1px solid ${C.border}`:"none", cursor:"pointer" }}>
                  <div style={{ width:22, height:22, borderRadius:6, background:`${s.planColor}18`, border:`1px solid ${s.planColor}33`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:8, fontWeight:800, color:s.planColor, flexShrink:0 }}>
                    {i+1}
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:12, fontWeight:600, color:C.text, marginBottom:3 }}>{s.name}</div>
                    <div style={{ height:3, background:C.border2, borderRadius:2 }}>
                      <div style={{ width:`${pct}%`, height:"100%", background:s.planColor, borderRadius:2 }}/>
                    </div>
                  </div>
                  <div style={{ textAlign:"right", flexShrink:0 }}>
                    <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:12, fontWeight:700, color:C.text }}>${(s.gmv/1000).toFixed(1)}k</div>
                    <div style={{ fontSize:10, color:delta>=0?"#10b981":"#ef4444", fontWeight:600 }}>{delta>=0?"+":""}{delta}%</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Alerts + plan breakdown + plan fees */}
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          {/* Alerts */}
          <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:14, padding:"16px 18px" }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
              <span style={{ fontSize:12, fontWeight:700, color:C.text }}>Network Alerts</span>
              <span style={{ fontSize:10, background:"#ef444420", color:"#ef4444", border:"1px solid #ef444433", padding:"1px 8px", borderRadius:99, fontWeight:700 }}>{allAlerts.length}</span>
            </div>
            {allAlerts.length===0 ? (
              <div style={{ fontSize:12, color:C.subtle, textAlign:"center", padding:"12px 0" }}>All clear ✓</div>
            ) : allAlerts.map((a,i)=>{
              const col = a.type==="alert"?"#ef4444":a.type==="warning"?"#f59e0b":"#10b981";
              const icon = a.type==="alert"?"⚠":a.type==="warning"?"▲":"↑";
              return (
                <div key={i} onClick={()=>navigate("seller-detail",{sellerId:a.sellerId})}
                  style={{ display:"flex", gap:10, padding:"9px 0", borderBottom:i<allAlerts.length-1?`1px solid ${C.border}`:"none", cursor:"pointer" }}>
                  <div style={{ width:20, height:20, borderRadius:5, background:`${col}18`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:9, color:col, flexShrink:0, marginTop:1 }}>{icon}</div>
                  <div>
                    <div style={{ fontSize:10, fontWeight:700, color:col, marginBottom:2 }}>{a.seller}</div>
                    <div style={{ fontSize:11, color:C.muted, lineHeight:1.5 }}>{a.text}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Plan breakdown */}
          <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:14, padding:"16px 18px" }}>
            <div style={{ fontSize:12, fontWeight:700, color:C.text, marginBottom:14 }}>Network by Plan</div>
            {Object.entries(planBreakdown).map(([plan,count])=>{
              const col=planColors[plan]||"#a78bfa";
              const gmvForPlan=sellers.filter(s=>s.plan===plan).reduce((a,s)=>a+s.gmv,0);
              return (
                <div key={plan} style={{ marginBottom:12 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                    <span style={{ fontSize:10, fontWeight:700, color:col, textTransform:"uppercase" }}>{plan} · {count} sellers</span>
                    <span style={{ fontSize:10, color:C.muted }}>${(gmvForPlan/1000).toFixed(0)}k GMV</span>
                  </div>
                  <div style={{ height:4, background:C.border2, borderRadius:2 }}>
                    <div style={{ width:`${(count/sellers.length)*100}%`, height:"100%", background:col, borderRadius:2 }}/>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Monthly network fee */}
          <div style={{ background:"linear-gradient(135deg,#1a0f2e,#12102a)", border:"1px solid #a78bfa33", borderRadius:14, padding:"16px 18px" }}>
            <div style={{ fontSize:10, fontWeight:800, color:"#a78bfa", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:10 }}>Agency Billing</div>
            {[
              { label:"Network plan fee",   value:"$999/mo" },
              { label:"Managed seller fees", value:`$${sellers.reduce((a,s)=>a+s.monthlyFee,0).toLocaleString()}/mo` },
              { label:"Total monthly",       value:`$${(999+sellers.reduce((a,s)=>a+s.monthlyFee,0)).toLocaleString()}/mo`, bold:true },
            ].map(r=>(
              <div key={r.label} style={{ display:"flex", justifyContent:"space-between", padding:"5px 0", borderBottom:`1px solid ${C.border}` }}>
                <span style={{ fontSize:11, color:C.muted }}>{r.label}</span>
                <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:11, fontWeight:r.bold?700:400, color:r.bold?"#a78bfa":C.text }}>{r.value}</span>
              </div>
            ))}
            <button onClick={()=>navigate("billing")} style={{ width:"100%", marginTop:12, background:"#a78bfa18", border:"1px solid #a78bfa33", color:"#a78bfa", fontSize:11, fontWeight:700, padding:"8px", borderRadius:8, cursor:"pointer" }}>
              View Invoices →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── ENTERPRISE: SELLERS LIST ─────────────────────────────────────────────────
function ScreenSellers({ persona, navigate }) {
  const [search, setSearch]   = useState("");
  const [filter, setFilter]   = useState("all"); // all | active | paused | alert
  const sellers = persona.managedSellers;
  const planColors = { starter:"#10b981", growth:"#7c3aed", pro:"#f59e0b" };

  const filtered = sellers.filter(s=>{
    const q=search.toLowerCase();
    const matchSearch = !q || s.name.toLowerCase().includes(q) || s.owner.toLowerCase().includes(q) || s.category.toLowerCase().includes(q);
    const matchFilter = filter==="all" || (filter==="active"&&s.status==="active") || (filter==="paused"&&s.status==="paused") || (filter==="alert"&&s.alerts.length>0);
    return matchSearch && matchFilter;
  });

  const alertCount = sellers.filter(s=>s.alerts.length>0).length;

  return (
    <div style={{ padding:"28px 32px", overflowY:"auto", height:"100%" }}>
      {/* Header */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:24, flexWrap:"wrap", gap:12 }}>
        <div>
          <div style={{ fontFamily:"'Syne',sans-serif", fontSize:20, fontWeight:800, color:C.text, marginBottom:4 }}>Seller Accounts</div>
          <div style={{ fontSize:12, color:C.muted }}>{sellers.length} managed accounts · {sellers.filter(s=>s.status==="active").length} active</div>
        </div>
        <div style={{ display:"flex", gap:8 }}>
          <div style={{ display:"flex", background:C.surface2, border:`1px solid ${C.border2}`, borderRadius:9, overflow:"hidden" }}>
            {["all","active","paused","alert"].map(f=>(
              <button key={f} onClick={()=>setFilter(f)}
                style={{ padding:"7px 14px", background:filter===f?"#a78bfa18":"transparent", border:"none", color:filter===f?"#a78bfa":C.muted, fontSize:11, fontWeight:filter===f?700:400, cursor:"pointer", position:"relative" }}>
                {f==="alert"?`Alerts (${alertCount})`:f.charAt(0).toUpperCase()+f.slice(1)}
              </button>
            ))}
          </div>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search sellers…"
            style={{ background:C.surface2, border:`1px solid ${C.border2}`, borderRadius:9, padding:"7px 14px", color:C.text, fontSize:12, outline:"none", width:180 }}/>
        </div>
      </div>

      {/* Seller cards */}
      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {filtered.map(s=>{
          const col = planColors[s.plan]||"#a78bfa";
          const delta = Math.round((s.gmv-s.gmvPrev)/s.gmvPrev*100);
          const manager = ENTERPRISE_TEAM.find(t=>t.id===s.manager);
          return (
            <div key={s.id} onClick={()=>navigate("seller-detail",{sellerId:s.id})}
              style={{ background:C.surface, border:`1px solid ${s.alerts.length>0?C.amber+"44":C.border}`, borderRadius:14, padding:"16px 20px",
                cursor:"pointer", transition:"border-color .15s", display:"flex", alignItems:"center", gap:16 }}>
              {/* Avatar + status */}
              <div style={{ position:"relative", flexShrink:0 }}>
                <div style={{ width:40, height:40, borderRadius:11, background:`${col}18`, border:`1px solid ${col}44`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:800, color:col }}>
                  {s.avatar}
                </div>
                <div style={{ position:"absolute", bottom:-2, right:-2, width:10, height:10, borderRadius:"50%", background:s.status==="active"?"#10b981":"#374151", border:"2px solid #06060e" }}/>
              </div>

              {/* Name + meta */}
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:3 }}>
                  <span style={{ fontSize:13, fontWeight:700, color:C.text }}>{s.name}</span>
                  <span style={{ fontSize:9, fontWeight:700, color:col, background:`${col}18`, border:`1px solid ${col}33`, padding:"1px 7px", borderRadius:4, textTransform:"uppercase" }}>{s.plan}</span>
                  {s.status==="paused" && <span style={{ fontSize:9, fontWeight:700, color:"#6b7280", background:"#1f1f35", border:"1px solid #374151", padding:"1px 7px", borderRadius:4 }}>Paused</span>}
                </div>
                <div style={{ fontSize:11, color:C.muted }}>{s.owner} · {s.category}</div>
              </div>

              {/* Platforms */}
              <div style={{ display:"flex", gap:4, flexShrink:0 }}>
                {s.platforms.map(p=>{
                  const pc={WN:"#7c3aed",TT:"#f43f5e",AM:"#f59e0b",IG:"#ec4899"}[p]||C.muted;
                  return <span key={p} style={{ fontSize:9, fontWeight:700, color:pc, background:`${pc}12`, border:`1px solid ${pc}33`, padding:"1px 6px", borderRadius:4 }}>{p}</span>;
                })}
              </div>

              {/* Metrics */}
              <div style={{ display:"flex", gap:20, flexShrink:0 }}>
                <div style={{ textAlign:"center" }}>
                  <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:13, fontWeight:700, color:C.text }}>${(s.gmv/1000).toFixed(1)}k</div>
                  <div style={{ fontSize:9, color:delta>=0?"#10b981":"#ef4444", fontWeight:600 }}>{delta>=0?"+":""}{delta}%</div>
                  <div style={{ fontSize:9, color:C.subtle }}>GMV 30d</div>
                </div>
                <div style={{ textAlign:"center" }}>
                  <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:13, fontWeight:700, color:C.text }}>{s.buyerCount.toLocaleString()}</div>
                  <div style={{ fontSize:9, color:C.subtle }}>buyers</div>
                </div>
                <div style={{ textAlign:"center" }}>
                  <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:13, fontWeight:700, color:C.text }}>{s.showCount}</div>
                  <div style={{ fontSize:9, color:C.subtle }}>shows</div>
                </div>
              </div>

              {/* Manager */}
              <div style={{ display:"flex", alignItems:"center", gap:7, flexShrink:0 }}>
                <div style={{ width:26, height:26, borderRadius:7, background:`${manager?.color||C.accent}22`, border:`1px solid ${manager?.color||C.accent}44`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:8, fontWeight:800, color:manager?.color||C.accent }}>
                  {manager?.avatar||"?"}
                </div>
                <div>
                  <div style={{ fontSize:10, fontWeight:600, color:C.text }}>{manager?.name.split(" ")[0]||"—"}</div>
                  <div style={{ fontSize:9, color:C.subtle }}>{manager?.role||""}</div>
                </div>
              </div>

              {/* Alerts badge */}
              {s.alerts.length>0 && (
                <div style={{ width:18, height:18, borderRadius:"50%", background:"#f59e0b22", border:"1px solid #f59e0b44", display:"flex", alignItems:"center", justifyContent:"center", fontSize:9, color:"#f59e0b", fontWeight:700, flexShrink:0 }}>
                  {s.alerts.length}
                </div>
              )}

              <span style={{ fontSize:14, color:C.subtle, flexShrink:0 }}>›</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── ENTERPRISE: SELLER DETAIL ────────────────────────────────────────────────
function ScreenSellerDetail({ persona, params, navigate }) {
  const [activeTab, setActiveTab] = useState("overview");
  const s = persona.managedSellers.find(sel=>sel.id===params.sellerId) || persona.managedSellers[0];
  if (!s) return null;
  const planColors = { starter:"#10b981", growth:"#7c3aed", pro:"#f59e0b" };
  const col = planColors[s.plan]||"#a78bfa";
  const delta = Math.round((s.gmv-s.gmvPrev)/s.gmvPrev*100);
  const manager = ENTERPRISE_TEAM.find(t=>t.id===s.manager);
  const planPrices = { starter:79, growth:199, pro:399 };
  const nextPlan   = { starter:"growth", growth:"pro" };
  const nextPrice  = { starter:199, growth:399 };
  const nextColor  = { starter:"#7c3aed", growth:"#f59e0b" };

  // Simulate buyer breakdown
  const vipCount    = Math.round(s.buyerCount * 0.08);
  const activeCount = Math.round(s.buyerCount * 0.52);
  const atRiskCount = Math.round(s.buyerCount * 0.18);
  const dormantCount= s.buyerCount - vipCount - activeCount - atRiskCount;

  // Simulate show performance
  const recentShows = Array.from({length:Math.min(s.showCount,4)},(_,i)=>({
    title:`Show #${s.showCount-i}`,
    date:`Feb ${22-i*3}, 2025`,
    platform: s.platforms[i%s.platforms.length],
    gmv: Math.round(s.gmv/s.showCount * (0.8+Math.random()*0.4)),
    buyers: Math.round(s.buyerCount*0.04*(0.8+Math.random()*0.4)),
  }));

  const tabs = ["overview","buyers","shows","campaigns"];

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100%", overflow:"hidden" }}>
      {/* Sub-header */}
      <div style={{ background:"#050508", borderBottom:`1px solid ${C.border}`, padding:"14px 28px", display:"flex", alignItems:"center", gap:12, flexShrink:0 }}>
        <button onClick={()=>navigate("sellers")}
          style={{ background:"none", border:"none", color:C.muted, cursor:"pointer", fontSize:12, display:"flex", alignItems:"center", gap:4 }}>
          ← Sellers
        </button>
        <span style={{ color:C.border }}>/</span>
        <div style={{ width:28, height:28, borderRadius:8, background:`${col}18`, border:`1px solid ${col}44`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:800, color:col }}>
          {s.avatar}
        </div>
        <span style={{ fontSize:13, fontWeight:700, color:C.text }}>{s.name}</span>
        <span style={{ fontSize:9, fontWeight:700, color:col, background:`${col}18`, border:`1px solid ${col}33`, padding:"2px 8px", borderRadius:4, textTransform:"uppercase" }}>{s.plan}</span>
        <span style={{ fontSize:10, color:s.status==="active"?"#10b981":"#6b7280", fontWeight:600 }}>● {s.status}</span>
        <div style={{ flex:1 }}/>
        {/* Manager chip */}
        {manager && (
          <div style={{ display:"flex", alignItems:"center", gap:7, background:C.surface2, border:`1px solid ${C.border2}`, borderRadius:8, padding:"5px 10px" }}>
            <div style={{ width:20, height:20, borderRadius:5, background:`${manager.color}22`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:8, fontWeight:800, color:manager.color }}>
              {manager.avatar}
            </div>
            <span style={{ fontSize:11, color:C.muted }}>{manager.name}</span>
            <span style={{ fontSize:9, color:C.subtle }}>{manager.role}</span>
          </div>
        )}
        {s.status==="paused" ? (
          <button style={{ background:"#10b98118", border:"1px solid #10b98133", color:"#10b981", fontSize:11, fontWeight:700, padding:"7px 14px", borderRadius:8, cursor:"pointer" }}>
            Reactivate
          </button>
        ) : (
          <button style={{ background:C.surface2, border:`1px solid ${C.border2}`, color:C.muted, fontSize:11, fontWeight:700, padding:"7px 14px", borderRadius:8, cursor:"pointer" }}>
            Pause Account
          </button>
        )}
        <button style={{ background:"linear-gradient(135deg,#a78bfa,#7c3aed)", border:"none", color:"#fff", fontSize:11, fontWeight:700, padding:"7px 16px", borderRadius:8, cursor:"pointer" }}>
          Enter Account →
        </button>
      </div>

      {/* Scrollable body */}
      <div style={{ flex:1, overflowY:"auto", padding:"24px 28px" }}>
        {/* KPI row */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:20 }}>
          {[
            { label:"GMV (30d)", value:`$${(s.gmv/1000).toFixed(1)}k`, sub:`${delta>=0?"+":""}${delta}% vs prev`, color:col, up:delta>=0 },
            { label:"Buyers",    value:s.buyerCount.toLocaleString(),     sub:`${vipCount} VIP · ${atRiskCount} at-risk`, color:"#7c3aed", up:true },
            { label:"Shows (30d)",value:s.showCount,                       sub:`Last: ${s.lastShow}`,              color:"#10b981", up:true },
            { label:"Subscribers",value:s.subscriberCount.toLocaleString(), sub:"opt-in list",                    color:"#f59e0b", up:true },
          ].map(k=>(
            <div key={k.label} style={{ background:C.surface, border:`1px solid ${C.border}`, borderTop:`2px solid ${k.color}`, borderRadius:12, padding:"14px 16px" }}>
              <div style={{ fontSize:10, color:C.muted, textTransform:"uppercase", letterSpacing:"0.08em", fontWeight:700, marginBottom:6 }}>{k.label}</div>
              <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:22, fontWeight:700, color:C.text, lineHeight:1, marginBottom:4 }}>{k.value}</div>
              <div style={{ fontSize:10, color:k.up?"#10b981":C.amber }}>{k.sub}</div>
            </div>
          ))}
        </div>

        {/* Tab bar */}
        <div style={{ display:"flex", gap:4, marginBottom:18, borderBottom:`1px solid ${C.border}`, paddingBottom:0 }}>
          {tabs.map(t=>(
            <button key={t} onClick={()=>setActiveTab(t)}
              style={{ padding:"8px 16px", background:"none", border:"none", borderBottom:`2px solid ${activeTab===t?col:"transparent"}`, color:activeTab===t?C.text:C.muted, fontSize:12, fontWeight:activeTab===t?700:400, cursor:"pointer", textTransform:"capitalize", marginBottom:-1 }}>
              {t}
            </button>
          ))}
        </div>

        {activeTab==="overview" && (
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
            {/* Alerts */}
            <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:14, padding:"16px 18px" }}>
              <div style={{ fontSize:12, fontWeight:700, color:C.text, marginBottom:12 }}>Alerts & Opportunities</div>
              {s.alerts.length===0 ? (
                <div style={{ fontSize:12, color:C.subtle, padding:"8px 0" }}>No active alerts ✓</div>
              ) : s.alerts.map((a,i)=>{
                const ac=a.type==="alert"?"#ef4444":a.type==="warning"?"#f59e0b":"#10b981";
                return (
                  <div key={i} style={{ display:"flex", gap:10, padding:"10px 12px", background:`${ac}08`, border:`1px solid ${ac}22`, borderRadius:9, marginBottom:8 }}>
                    <div style={{ width:20,height:20,borderRadius:5,background:`${ac}18`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,color:ac,flexShrink:0 }}>
                      {a.type==="alert"?"⚠":a.type==="warning"?"▲":"↑"}
                    </div>
                    <div style={{ fontSize:11, color:C.muted, lineHeight:1.6 }}>{a.text}</div>
                  </div>
                );
              })}
            </div>

            {/* Buyer health */}
            <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:14, padding:"16px 18px" }}>
              <div style={{ fontSize:12, fontWeight:700, color:C.text, marginBottom:12 }}>Buyer Health</div>
              {[
                { label:"VIP",     count:vipCount,     color:"#7c3aed", pct:Math.round(vipCount/s.buyerCount*100) },
                { label:"Active",  count:activeCount,  color:"#10b981", pct:Math.round(activeCount/s.buyerCount*100) },
                { label:"At-Risk", count:atRiskCount,  color:"#f59e0b", pct:Math.round(atRiskCount/s.buyerCount*100) },
                { label:"Dormant", count:dormantCount, color:"#374151", pct:Math.round(dormantCount/s.buyerCount*100) },
              ].map(b=>(
                <div key={b.label} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
                  <span style={{ width:52, fontSize:10, fontWeight:700, color:b.color }}>{b.label}</span>
                  <div style={{ flex:1, height:4, background:C.border2, borderRadius:2 }}>
                    <div style={{ width:`${b.pct}%`, height:"100%", background:b.color, borderRadius:2 }}/>
                  </div>
                  <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:11, fontWeight:700, color:C.text, minWidth:24, textAlign:"right" }}>{b.count}</span>
                  <span style={{ fontSize:9, color:C.subtle, minWidth:28 }}>{b.pct}%</span>
                </div>
              ))}
            </div>

            {/* Plan info */}
            <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:14, padding:"16px 18px" }}>
              <div style={{ fontSize:12, fontWeight:700, color:C.text, marginBottom:12 }}>Subscription</div>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
                <span style={{ fontSize:11, color:C.muted }}>Current plan</span>
                <span style={{ fontSize:11, fontWeight:700, color:col, textTransform:"capitalize" }}>{s.plan}</span>
              </div>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
                <span style={{ fontSize:11, color:C.muted }}>Monthly fee</span>
                <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:11, fontWeight:700, color:C.text }}>${planPrices[s.plan]}/mo</span>
              </div>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:16 }}>
                <span style={{ fontSize:11, color:C.muted }}>Platforms</span>
                <div style={{ display:"flex", gap:4 }}>
                  {s.platforms.map(p=>{
                    const pc={WN:"#7c3aed",TT:"#f43f5e",AM:"#f59e0b",IG:"#ec4899"}[p]||C.muted;
                    return <span key={p} style={{ fontSize:9, fontWeight:700, color:pc, background:`${pc}12`, border:`1px solid ${pc}33`, padding:"1px 5px", borderRadius:4 }}>{p}</span>;
                  })}
                </div>
              </div>
              {nextPlan[s.plan] && (
                <div style={{ background:`${nextColor[s.plan]}08`, border:`1px solid ${nextColor[s.plan]}33`, borderRadius:9, padding:"10px 12px" }}>
                  <div style={{ fontSize:10, fontWeight:700, color:nextColor[s.plan], marginBottom:4 }}>
                    Upgrade to {nextPlan[s.plan].charAt(0).toUpperCase()+nextPlan[s.plan].slice(1)} — +${nextPrice[s.plan]-planPrices[s.plan]}/mo
                  </div>
                  <div style={{ fontSize:10, color:C.muted }}>
                    {nextPlan[s.plan]==="growth"?"Unlocks Analytics, Loyalty, AI Insights, SMS campaigns":"Unlocks Production Suite, camera & gimbal control"}
                  </div>
                  <button style={{ marginTop:8, background:`linear-gradient(135deg,${nextColor[s.plan]},${nextColor[s.plan]}aa)`, border:"none", color:"#fff", fontSize:10, fontWeight:700, padding:"6px 14px", borderRadius:6, cursor:"pointer" }}>
                    Upgrade This Seller →
                  </button>
                </div>
              )}
            </div>

            {/* Contact */}
            <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:14, padding:"16px 18px" }}>
              <div style={{ fontSize:12, fontWeight:700, color:C.text, marginBottom:12 }}>Account Details</div>
              {[
                { label:"Owner",    value:s.owner },
                { label:"Category", value:s.category },
                { label:"Joined",   value:"Nov 2024" },
                { label:"Manager",  value:manager?.name||"Unassigned" },
              ].map(r=>(
                <div key={r.label} style={{ display:"flex", justifyContent:"space-between", padding:"6px 0", borderBottom:`1px solid ${C.border}` }}>
                  <span style={{ fontSize:11, color:C.muted }}>{r.label}</span>
                  <span style={{ fontSize:11, fontWeight:600, color:C.text }}>{r.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab==="shows" && (
          <div>
            {recentShows.length===0 ? (
              <div style={{ textAlign:"center", padding:"40px", color:C.muted, fontSize:13 }}>No shows recorded yet</div>
            ) : recentShows.map((show,i)=>{
              const pc={WN:"#7c3aed",TT:"#f43f5e",AM:"#f59e0b",IG:"#ec4899",YT:"#ff0000"}[show.platform]||C.muted;
              return (
                <div key={i} style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, padding:"14px 18px", marginBottom:10, display:"flex", alignItems:"center", gap:14 }}>
                  <div style={{ width:36, height:36, borderRadius:9, background:`${pc}18`, border:`1px solid ${pc}33`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, flexShrink:0 }}>◈</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:13, fontWeight:700, color:C.text }}>{show.title}</div>
                    <div style={{ fontSize:11, color:C.muted }}>{show.date} · <span style={{ color:pc }}>{show.platform}</span></div>
                  </div>
                  <div style={{ textAlign:"right" }}>
                    <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:14, fontWeight:700, color:C.text }}>${show.gmv.toLocaleString()}</div>
                    <div style={{ fontSize:10, color:C.muted }}>{show.buyers} buyers</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeTab==="buyers" && (
          <div>
            {[
              { label:"VIP Buyers",     count:vipCount,     color:"#7c3aed", desc:"Lifetime spend > $1k, loyal repeat buyers" },
              { label:"Active",          count:activeCount,  color:"#10b981", desc:"Purchased in last 30 days" },
              { label:"At-Risk",         count:atRiskCount,  color:"#f59e0b", desc:"28–60 days since last order — needs re-engagement" },
              { label:"Dormant",         count:dormantCount, color:"#374151", desc:"60+ days inactive" },
            ].map(seg=>(
              <div key={seg.label} style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, padding:"14px 18px", marginBottom:10, display:"flex", alignItems:"center", gap:14 }}>
                <div style={{ width:40, height:40, borderRadius:11, background:`${seg.color}18`, border:`1px solid ${seg.color}33`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:14, fontWeight:700, color:seg.color }}>{seg.count}</span>
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13, fontWeight:700, color:seg.color }}>{seg.label}</div>
                  <div style={{ fontSize:11, color:C.muted }}>{seg.desc}</div>
                </div>
                <div style={{ fontSize:12, color:C.subtle }}>{Math.round(seg.count/s.buyerCount*100)}% of list</div>
              </div>
            ))}
          </div>
        )}

        {activeTab==="campaigns" && (
          <div>
            {[
              { name:"Re-engagement — at-risk buyers",    type:"email",  status:"sent",  sent:atRiskCount, opened:62, converted:18, gmv:Math.round(atRiskCount*240) },
              { name:"VIP early access notice",           type:"sms",    status:"sent",  sent:vipCount,    opened:91, converted:68, gmv:Math.round(vipCount*890) },
              { name:"New inventory drop",                type:"ig_dm",  status:"draft", sent:0,           opened:0,  converted:0,  gmv:0 },
            ].map((c,i)=>{
              const typeCol={email:"#3b82f6",sms:"#10b981",ig_dm:"#ec4899"}[c.type]||C.accent;
              return (
                <div key={i} style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, padding:"14px 18px", marginBottom:10, display:"flex", alignItems:"center", gap:14 }}>
                  <span style={{ fontSize:9, fontWeight:700, color:typeCol, background:`${typeCol}18`, border:`1px solid ${typeCol}33`, padding:"2px 8px", borderRadius:4, textTransform:"uppercase", flexShrink:0 }}>{c.type}</span>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:12, fontWeight:700, color:C.text }}>{c.name}</div>
                    {c.status==="sent" && <div style={{ fontSize:10, color:C.muted }}>{c.sent} sent · {c.opened}% opened · {c.converted}% converted</div>}
                    {c.status==="draft" && <div style={{ fontSize:10, color:C.subtle }}>Draft — not yet sent</div>}
                  </div>
                  {c.status==="sent" && c.gmv>0 && (
                    <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:13, fontWeight:700, color:"#10b981" }}>${c.gmv.toLocaleString()}</div>
                  )}
                  <span style={{ fontSize:9, fontWeight:700, color:c.status==="sent"?"#10b981":"#6b7280", background:c.status==="sent"?"#0a1e16":"#1a1a2e", border:`1px solid ${c.status==="sent"?"#10b98133":"#374151"}`, padding:"2px 8px", borderRadius:4 }}>{c.status}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── ENTERPRISE: NETWORK ANALYTICS ───────────────────────────────────────────
function ScreenNetworkAnalytics({ persona }) {
  const sellers   = persona.managedSellers;
  const networkGMV = sellers.reduce((a,s)=>a+s.gmv,0);
  const planColors = { starter:"#10b981", growth:"#7c3aed", pro:"#f59e0b" };

  // Platform GMV breakdown (simulated)
  const platformGMV = {
    WN: sellers.filter(s=>s.platforms.includes("WN")).reduce((a,s)=>a+s.gmv*0.44,0),
    TT: sellers.filter(s=>s.platforms.includes("TT")).reduce((a,s)=>a+s.gmv*0.28,0),
    AM: sellers.filter(s=>s.platforms.includes("AM")).reduce((a,s)=>a+s.gmv*0.18,0),
    IG: sellers.filter(s=>s.platforms.includes("IG")).reduce((a,s)=>a+s.gmv*0.10,0),
  };
  const platformColors={WN:"#7c3aed",TT:"#f43f5e",AM:"#f59e0b",IG:"#ec4899"};

  // Monthly trend (8 months)
  const months=["Jul","Aug","Sep","Oct","Nov","Dec","Jan","Feb"];
  const monthlyGMV=[148200,162400,179800,198200,221400,248600,289100,networkGMV];

  // Seller performance table sorted by GMV
  const ranked=[...sellers].sort((a,b)=>b.gmv-a.gmv);

  return (
    <div style={{ padding:"28px 32px", overflowY:"auto", height:"100%" }}>
      <div style={{ fontFamily:"'Syne',sans-serif", fontSize:20, fontWeight:800, color:C.text, marginBottom:4 }}>Network Analytics</div>
      <div style={{ fontSize:12, color:C.muted, marginBottom:24 }}>Aggregate performance across all {sellers.length} managed accounts</div>

      {/* KPI row */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:20 }}>
        {[
          { label:"Network GMV",         value:`$${(networkGMV/1000).toFixed(0)}k`, color:"#a78bfa" },
          { label:"Avg GMV / Seller",    value:`$${Math.round(networkGMV/sellers.length/1000).toFixed(1)}k`, color:"#7c3aed" },
          { label:"Top Seller Share",    value:`${Math.round(ranked[0].gmv/networkGMV*100)}%`, color:"#f59e0b" },
          { label:"Sellers Growing",     value:`${sellers.filter(s=>s.gmv>s.gmvPrev).length} / ${sellers.length}`, color:"#10b981" },
        ].map(k=>(
          <div key={k.label} style={{ background:C.surface, border:`1px solid ${C.border}`, borderTop:`2px solid ${k.color}`, borderRadius:12, padding:"14px 16px" }}>
            <div style={{ fontSize:10, color:C.muted, textTransform:"uppercase", letterSpacing:"0.08em", fontWeight:700, marginBottom:6 }}>{k.label}</div>
            <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:24, fontWeight:700, color:C.text }}>{k.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:16 }}>
        {/* GMV trend */}
        <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:14, padding:"18px 20px" }}>
          <div style={{ fontSize:12, fontWeight:700, color:C.text, marginBottom:16 }}>Network GMV — 8 Month Trend</div>
          <svg width="100%" height="100" viewBox="0 0 420 100" preserveAspectRatio="none">
            <defs>
              <linearGradient id="nettrend" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.25"/>
                <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.02"/>
              </linearGradient>
            </defs>
            {(()=>{
              const mx=Math.max(...monthlyGMV), mn=Math.min(...monthlyGMV)*0.85;
              const pts=monthlyGMV.map((v,i)=>[i*(420/7), 100-((v-mn)/(mx-mn))*88]);
              const pd="M"+pts.map(p=>p.join(",")).join(" L");
              const ad=pd+` L${pts[pts.length-1][0]},100 L0,100 Z`;
              return(<>
                <path d={ad} fill="url(#nettrend)"/>
                <path d={pd} fill="none" stroke="#a78bfa" strokeWidth="2.5" strokeLinejoin="round"/>
                {pts.map((p,i)=>(
                  <g key={i}>
                    <circle cx={p[0]} cy={p[1]} r="3.5" fill="#a78bfa"/>
                    <text x={p[0]} y={100} textAnchor="middle" fill="#374151" fontSize="8">{months[i]}</text>
                  </g>
                ))}
              </>);
            })()}
          </svg>
        </div>

        {/* Platform breakdown */}
        <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:14, padding:"18px 20px" }}>
          <div style={{ fontSize:12, fontWeight:700, color:C.text, marginBottom:16 }}>GMV by Platform</div>
          {Object.entries(platformGMV).map(([p,v])=>{
            const pct=Math.round(v/networkGMV*100);
            const pc=platformColors[p];
            return (
              <div key={p} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
                <span style={{ fontSize:10, fontWeight:700, color:pc, width:24 }}>{p}</span>
                <div style={{ flex:1, height:6, background:C.border2, borderRadius:3 }}>
                  <div style={{ width:`${pct}%`, height:"100%", background:pc, borderRadius:3 }}/>
                </div>
                <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:11, fontWeight:700, color:C.text, minWidth:48, textAlign:"right" }}>${(v/1000).toFixed(0)}k</span>
                <span style={{ fontSize:10, color:C.subtle, minWidth:30 }}>{pct}%</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Seller performance table */}
      <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:14, padding:"18px 20px" }}>
        <div style={{ fontSize:12, fontWeight:700, color:C.text, marginBottom:14 }}>Seller Performance Ranking</div>
        <div style={{ display:"grid", gridTemplateColumns:"28px 1fr 80px 80px 80px 80px 80px 72px", gap:0 }}>
          {/* Header */}
          {["#","Seller","Plan","GMV 30d","vs Prev","Buyers","Shows","Trend"].map(h=>(
            <div key={h} style={{ fontSize:9, fontWeight:700, color:C.subtle, textTransform:"uppercase", letterSpacing:"0.08em", padding:"0 8px 10px 0", borderBottom:`1px solid ${C.border}` }}>{h}</div>
          ))}
          {/* Rows */}
          {ranked.map((s,i)=>{
            const col=planColors[s.plan]||"#a78bfa";
            const delta=Math.round((s.gmv-s.gmvPrev)/s.gmvPrev*100);
            const barW=Math.round(s.gmv/ranked[0].gmv*100);
            return (
              <React.Fragment key={s.id}>
                <div style={{ padding:"10px 8px 10px 0", borderBottom:`1px solid ${C.border}`, display:"flex", alignItems:"center" }}>
                  <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:11, color:C.subtle }}>{i+1}</span>
                </div>
                <div style={{ padding:"10px 8px 10px 0", borderBottom:`1px solid ${C.border}`, display:"flex", alignItems:"center", gap:8 }}>
                  <div style={{ width:24,height:24,borderRadius:6,background:`${col}18`,border:`1px solid ${col}33`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:8,fontWeight:800,color:col,flexShrink:0 }}>{s.avatar}</div>
                  <span style={{ fontSize:12, fontWeight:600, color:C.text }}>{s.name}</span>
                </div>
                <div style={{ padding:"10px 8px 10px 0", borderBottom:`1px solid ${C.border}`, display:"flex", alignItems:"center" }}>
                  <span style={{ fontSize:9,fontWeight:700,color:col,background:`${col}18`,border:`1px solid ${col}33`,padding:"1px 6px",borderRadius:4,textTransform:"uppercase" }}>{s.plan}</span>
                </div>
                <div style={{ padding:"10px 8px 10px 0", borderBottom:`1px solid ${C.border}`, display:"flex", alignItems:"center" }}>
                  <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:12, fontWeight:700, color:C.text }}>${(s.gmv/1000).toFixed(1)}k</span>
                </div>
                <div style={{ padding:"10px 8px 10px 0", borderBottom:`1px solid ${C.border}`, display:"flex", alignItems:"center" }}>
                  <span style={{ fontSize:11, fontWeight:600, color:delta>=0?"#10b981":"#ef4444" }}>{delta>=0?"+":""}{delta}%</span>
                </div>
                <div style={{ padding:"10px 8px 10px 0", borderBottom:`1px solid ${C.border}`, display:"flex", alignItems:"center" }}>
                  <span style={{ fontSize:11, color:C.muted }}>{s.buyerCount.toLocaleString()}</span>
                </div>
                <div style={{ padding:"10px 8px 10px 0", borderBottom:`1px solid ${C.border}`, display:"flex", alignItems:"center" }}>
                  <span style={{ fontSize:11, color:C.muted }}>{s.showCount}</span>
                </div>
                <div style={{ padding:"10px 0 10px 0", borderBottom:`1px solid ${C.border}`, display:"flex", alignItems:"center" }}>
                  <div style={{ width:"100%", height:4, background:C.border2, borderRadius:2 }}>
                    <div style={{ width:`${barW}%`, height:"100%", background:col, borderRadius:2 }}/>
                  </div>
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── ENTERPRISE: TEAM MANAGEMENT ─────────────────────────────────────────────
function ScreenTeam({ persona }) {
  const [activeTab,      setActiveTab]      = useState("members");
  const [showInvite,     setShowInvite]      = useState(false);
  const [inviteName,     setInviteName]      = useState("");
  const [inviteEmail,    setInviteEmail]     = useState("");
  const [inviteRole,     setInviteRole]      = useState("Manager");
  const [inviteLink,     setInviteLink]      = useState("");
  const [inviteSent,     setInviteSent]      = useState(false);
  const [inviteLoading,  setInviteLoading]   = useState(false);
  const [teamMembers,    setTeamMembers]     = useState(ENTERPRISE_TEAM);
  const [editMember,     setEditMember]      = useState(null); // member obj being edited
  const [editRole,       setEditRole]        = useState("");
  const [editSellers,    setEditSellers]     = useState([]);
  const [removeTarget,   setRemoveTarget]    = useState(null);

  const sellers = persona.managedSellers;
  const roleColors={Owner:"#a78bfa", Manager:"#7c3aed", Analyst:"#f59e0b", Support:"#10b981", Producer:"#06b6d4"};
  const permLabels={all:"All Access", view:"View", edit:"Edit", campaigns:"Campaigns", buyers:"Buyers", shows:"Shows", analytics:"Analytics", production:"Production", catalog:"Catalog", live:"Live"};

  const rolePerms = {
    Owner:    ["all"],
    Manager:  ["view","edit","campaigns","buyers","shows"],
    Analyst:  ["view","analytics"],
    Support:  ["view","buyers"],
    Producer: ["shows","production","catalog","live"],
  };

  const roleDescriptions = {
    Owner:    "Full access to everything",
    Manager:  "Edit sellers, campaigns, buyers, shows",
    Analyst:  "View analytics across network",
    Support:  "View buyers and handle support",
    Producer: "Production, shows & live — Pro+ sellers only",
  };

  const openEdit = (m) => {
    setEditMember(m);
    setEditRole(m.role);
    setEditSellers(m.assignedSellers || []);
  };

  const saveEdit = () => {
    setTeamMembers(prev => prev.map(m =>
      m.id === editMember.id
        ? { ...m, role: editRole, permissions: rolePerms[editRole] || m.permissions, assignedSellers: editSellers }
        : m
    ));
    setEditMember(null);
  };

  const confirmRemove = (id) => {
    setTeamMembers(prev => prev.filter(m => m.id !== id));
    setRemoveTarget(null);
  };

  const handleInvite = async () => {
    if (!inviteEmail.trim() || !inviteName.trim()) return;
    setInviteLoading(true);
    const token = Math.random().toString(36).slice(2) + Date.now().toString(36);
    const link  = `${window.location.origin}${window.location.pathname}?invite=${token}`;
    try {
      await window.storage.set(`strmlive:invite:${token}`, JSON.stringify({
        token, workspace: persona.shop, invitedBy: persona.name,
        name: inviteName.trim(), email: inviteEmail.trim().toLowerCase(),
        role: inviteRole, invitedAt: new Date().toISOString(),
      }));
    } catch(e) { /* storage may not be available in all envs */ }
    setInviteLink(link);
    setInviteSent(true);
    setInviteLoading(false);
  };

  const resetInvite = () => {
    setShowInvite(false); setInviteSent(false); setInviteLoading(false);
    setInviteName(""); setInviteEmail(""); setInviteRole("Manager"); setInviteLink("");
  };

  return (
    <div style={{ padding:"28px 32px", overflowY:"auto", height:"100%", position:"relative" }}>

      {/* ── INVITE MODAL ── */}
      {showInvite && (
        <div onClick={resetInvite}
          style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.7)", zIndex:200, display:"flex", alignItems:"center", justifyContent:"center" }}>
          <div onClick={e=>e.stopPropagation()} className="pop-in"
            style={{ background:"#0a0a15", border:"1px solid #a78bfa44", borderRadius:18, padding:"28px 32px", width:460, maxWidth:"90vw" }}>

            {!inviteSent ? (<>
              {/* Header */}
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:22 }}>
                <div>
                  <div style={{ fontFamily:"'Syne',sans-serif", fontSize:16, fontWeight:800, color:C.text }}>Invite Team Member</div>
                  <div style={{ fontSize:11, color:C.muted, marginTop:3 }}>{persona.shop} · Enterprise</div>
                </div>
                <button onClick={resetInvite} style={{ background:"none", border:"none", color:C.muted, fontSize:18, cursor:"pointer", lineHeight:1 }}>✕</button>
              </div>

              {/* Name */}
              <div style={{ marginBottom:14 }}>
                <label style={{ fontSize:10, fontWeight:700, color:C.muted, textTransform:"uppercase", letterSpacing:"0.08em", display:"block", marginBottom:6 }}>Full Name</label>
                <input value={inviteName} onChange={e=>setInviteName(e.target.value)}
                  placeholder="e.g. Jordan Lee"
                  style={{ width:"100%", background:C.surface2, border:`1px solid ${C.border2}`, borderRadius:9, padding:"10px 14px", color:C.text, fontSize:13, outline:"none" }}/>
              </div>

              {/* Email */}
              <div style={{ marginBottom:14 }}>
                <label style={{ fontSize:10, fontWeight:700, color:C.muted, textTransform:"uppercase", letterSpacing:"0.08em", display:"block", marginBottom:6 }}>Work Email</label>
                <input value={inviteEmail} onChange={e=>setInviteEmail(e.target.value)}
                  placeholder="jordan@yourcompany.com" type="email"
                  style={{ width:"100%", background:C.surface2, border:`1px solid ${C.border2}`, borderRadius:9, padding:"10px 14px", color:C.text, fontSize:13, outline:"none" }}/>
              </div>

              {/* Role picker */}
              <div style={{ marginBottom:22 }}>
                <label style={{ fontSize:10, fontWeight:700, color:C.muted, textTransform:"uppercase", letterSpacing:"0.08em", display:"block", marginBottom:8 }}>Role</label>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                  {["Manager","Producer","Analyst","Support","Owner"].map(r=>{
                    const col=roleColors[r];
                    const isSelected=inviteRole===r;
                    // For Producer: flag any managed sellers on Starter/Growth
                    const lockedSellers = r==="Producer"
                      ? sellers.filter(s=>PLAN_LEVEL[s.plan]<2)
                      : [];
                    return (
                      <button key={r} onClick={()=>setInviteRole(r)}
                        style={{ padding:"10px 12px", borderRadius:9, border:`1px solid ${isSelected?col+"66":C.border2}`, background:isSelected?`${col}14`:"transparent", cursor:"pointer", textAlign:"left" }}>
                        <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:3 }}>
                          <div style={{ fontSize:11, fontWeight:700, color:isSelected?col:C.muted }}>{r}</div>
                          {r==="Producer"
                            ? <span style={{ fontSize:7, fontWeight:800, color:"#f59e0b", background:"#f59e0b14", border:"1px solid #f59e0b33", padding:"1px 5px", borderRadius:3, textTransform:"uppercase" }}>Pro+ Sellers</span>
                            : null
                          }
                        </div>
                        <div style={{ fontSize:9, color:C.subtle }}>{roleDescriptions[r]}</div>
                        {isSelected && (
                          <div style={{ marginTop:6, display:"flex", flexWrap:"wrap", gap:3 }}>
                            {rolePerms[r].map(p=>(
                              <span key={p} style={{ fontSize:8, fontWeight:700, color:col, background:`${col}12`, border:`1px solid ${col}28`, padding:"1px 5px", borderRadius:3 }}>
                                {permLabels[p]||p}
                              </span>
                            ))}
                          </div>
                        )}
                        {isSelected && lockedSellers.length>0 && (
                          <div style={{ marginTop:8, background:"#f59e0b08", border:"1px solid #f59e0b28", borderRadius:7, padding:"7px 9px" }}>
                            <div style={{ fontSize:9, fontWeight:700, color:"#f59e0b", marginBottom:3 }}>
                              ⚠ {lockedSellers.length} seller{lockedSellers.length>1?"s":""} won't get Production access
                            </div>
                            <div style={{ fontSize:8, color:C.muted, lineHeight:1.5, marginBottom:5 }}>
                              {lockedSellers.map(s=>s.name).join(", ")} {lockedSellers.length>1?"are":"is"} on {lockedSellers.length>1?"plans":"a plan"} below Pro. Upgrade to unlock the Production Suite for {lockedSellers.length>1?"them":"this seller"}.
                            </div>
                            <div style={{ display:"flex", flexWrap:"wrap", gap:4 }}>
                              {lockedSellers.map(s=>{
                                const pc=({starter:"#10b981",growth:"#7c3aed"})[s.plan]||C.accent;
                                return (
                                  <span key={s.id} style={{ fontSize:8, fontWeight:700, color:pc, background:`${pc}12`, border:`1px solid ${pc}28`, padding:"1px 7px", borderRadius:4 }}>
                                    {s.name} · {s.plan}
                                  </span>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Send button */}
              <button onClick={handleInvite} disabled={!inviteName.trim()||!inviteEmail.trim()||inviteLoading}
                style={{ width:"100%", background:inviteName&&inviteEmail?"linear-gradient(135deg,#a78bfa,#7c3aed)":"#1a1a2e",
                  border:"none", color:inviteName&&inviteEmail?"#fff":"#374151", fontSize:13, fontWeight:700,
                  padding:"12px", borderRadius:10, cursor:inviteName&&inviteEmail?"pointer":"not-allowed" }}>
                {inviteLoading ? "Generating link…" : "Generate Invite Link →"}
              </button>
            </>) : (<>
              {/* Success state */}
              <div style={{ textAlign:"center", marginBottom:20 }}>
                <div style={{ fontSize:32, marginBottom:10 }}>✉️</div>
                <div style={{ fontFamily:"'Syne',sans-serif", fontSize:16, fontWeight:800, color:C.text, marginBottom:6 }}>Invite Ready</div>
                <div style={{ fontSize:12, color:C.muted }}>Send this link to <strong style={{ color:C.text }}>{inviteName}</strong></div>
              </div>

              {/* Role summary */}
              <div style={{ display:"flex", alignItems:"center", gap:8, padding:"8px 12px", background:C.surface2, border:`1px solid ${C.border2}`, borderRadius:9, marginBottom:16 }}>
                <div style={{ width:28, height:28, borderRadius:7, background:`${roleColors[inviteRole]}18`, border:`1px solid ${roleColors[inviteRole]}44`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:800, color:roleColors[inviteRole] }}>
                  {inviteName.split(" ").map(n=>n[0]).slice(0,2).join("").toUpperCase()}
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:12, fontWeight:600, color:C.text }}>{inviteName}</div>
                  <div style={{ fontSize:10, color:C.muted }}>{inviteEmail} · <span style={{ color:roleColors[inviteRole] }}>{inviteRole}</span></div>
                </div>
              </div>

              {/* Link copy box */}
              <div style={{ background:C.surface2, border:`1px solid #a78bfa33`, borderRadius:9, padding:"10px 12px", marginBottom:16 }}>
                <div style={{ fontSize:9, fontWeight:700, color:"#a78bfa", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:6 }}>Invite Link</div>
                <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10, color:C.muted, wordBreak:"break-all", marginBottom:10 }}>{inviteLink}</div>
                <button onClick={()=>navigator.clipboard?.writeText(inviteLink)}
                  style={{ width:"100%", background:"#a78bfa18", border:"1px solid #a78bfa33", color:"#a78bfa", fontSize:11, fontWeight:700, padding:"8px", borderRadius:7, cursor:"pointer" }}>
                  Copy Link
                </button>
              </div>

              <button onClick={resetInvite}
                style={{ width:"100%", background:"none", border:`1px solid ${C.border2}`, color:C.muted, fontSize:12, fontWeight:600, padding:"10px", borderRadius:9, cursor:"pointer" }}>
                Done
              </button>
            </>)}
          </div>
        </div>
      )}

      {/* ── EDIT MEMBER MODAL ── */}
      {editMember && (
        <div onClick={()=>setEditMember(null)}
          style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.7)", zIndex:200, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
          <div onClick={e=>e.stopPropagation()} className="pop-in"
            style={{ background:"#09090f", border:"1px solid #2a2a3a", borderRadius:18, padding:28, width:420, maxWidth:"94vw" }}>

            {/* Header */}
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:22 }}>
              <div>
                <div style={{ fontFamily:"'Syne',sans-serif", fontSize:16, fontWeight:800, color:C.text }}>Edit Member</div>
                <div style={{ fontSize:11, color:C.muted, marginTop:2 }}>{editMember.name} · {editMember.email}</div>
              </div>
              <button onClick={()=>setEditMember(null)} style={{ background:"none", border:"none", color:C.muted, fontSize:18, cursor:"pointer" }}>✕</button>
            </div>

            {/* Role picker */}
            <div style={{ marginBottom:20 }}>
              <div style={{ fontSize:10, fontWeight:700, color:C.muted, textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:8 }}>Role</div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6 }}>
                {["Manager","Producer","Analyst","Support","Owner"].map(r => {
                  const col = roleColors[r] || C.accent;
                  const sel = editRole === r;
                  return (
                    <button key={r} onClick={()=>setEditRole(r)}
                      style={{ padding:"10px 12px", borderRadius:9, border:`1px solid ${sel?col+"55":C.border2}`,
                        background:sel?`${col}14`:"transparent", cursor:"pointer", textAlign:"left" }}>
                      <div style={{ fontSize:12, fontWeight:700, color:sel?col:C.muted, marginBottom:2 }}>{r}</div>
                      <div style={{ fontSize:9, color:C.subtle }}>{roleDescriptions[r]}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Seller assignment */}
            <div style={{ marginBottom:22 }}>
              <div style={{ fontSize:10, fontWeight:700, color:C.muted, textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:8 }}>
                Assigned Sellers <span style={{ color:C.subtle, fontWeight:400, textTransform:"none", fontSize:9 }}>({editSellers.length} selected)</span>
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:5, maxHeight:180, overflowY:"auto" }}>
                {(persona.managedSellers||[]).map(s => {
                  const assigned = editSellers.includes(s.id);
                  const pc = ({starter:"#10b981",growth:"#7c3aed",pro:"#f59e0b",enterprise:"#a78bfa"})[s.plan]||C.accent;
                  return (
                    <div key={s.id} onClick={()=>setEditSellers(prev=>assigned?prev.filter(x=>x!==s.id):[...prev,s.id])}
                      style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 10px", borderRadius:8,
                        border:`1px solid ${assigned?C.accent+"44":C.border2}`,
                        background:assigned?`${C.accent}08`:"transparent", cursor:"pointer" }}>
                      <div style={{ width:16, height:16, borderRadius:4, border:`1.5px solid ${assigned?C.accent:C.border2}`,
                        background:assigned?C.accent:"transparent", display:"flex", alignItems:"center", justifyContent:"center",
                        fontSize:9, color:"#fff", flexShrink:0 }}>{assigned?"✓":""}</div>
                      <div style={{ flex:1, fontSize:11, color:C.text }}>{s.name}</div>
                      <span style={{ fontSize:8, fontWeight:700, color:pc, background:`${pc}15`, border:`1px solid ${pc}28`, padding:"1px 6px", borderRadius:4, textTransform:"capitalize" }}>{s.plan}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Actions */}
            <div style={{ display:"flex", gap:8 }}>
              <button onClick={()=>setEditMember(null)}
                style={{ flex:1, background:"none", border:`1px solid ${C.border2}`, color:C.muted, fontSize:12, fontWeight:600, padding:"10px", borderRadius:9, cursor:"pointer" }}>
                Cancel
              </button>
              <button onClick={saveEdit}
                style={{ flex:2, background:"linear-gradient(135deg,#a78bfa,#7c3aed)", border:"none", color:"#fff", fontSize:12, fontWeight:700, padding:"10px", borderRadius:9, cursor:"pointer" }}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── REMOVE CONFIRM DIALOG ── */}
      {removeTarget && (
        <div onClick={()=>setRemoveTarget(null)}
          style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.7)", zIndex:200, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
          <div onClick={e=>e.stopPropagation()} className="pop-in"
            style={{ background:"#09090f", border:"1px solid #ef444433", borderRadius:16, padding:24, width:340, maxWidth:"94vw", textAlign:"center" }}>
            <div style={{ fontSize:28, marginBottom:12 }}>⚠️</div>
            <div style={{ fontSize:15, fontWeight:700, color:C.text, marginBottom:6 }}>Remove member?</div>
            <div style={{ fontSize:12, color:C.muted, marginBottom:20, lineHeight:1.6 }}>
              {teamMembers.find(m=>m.id===removeTarget)?.name} will lose access to all sellers and features immediately.
            </div>
            <div style={{ display:"flex", gap:8 }}>
              <button onClick={()=>setRemoveTarget(null)}
                style={{ flex:1, background:"none", border:`1px solid ${C.border2}`, color:C.muted, fontSize:12, fontWeight:600, padding:"9px", borderRadius:8, cursor:"pointer" }}>
                Cancel
              </button>
              <button onClick={()=>confirmRemove(removeTarget)}
                style={{ flex:1, background:"#ef444418", border:"1px solid #ef444444", color:"#ef4444", fontSize:12, fontWeight:700, padding:"9px", borderRadius:8, cursor:"pointer" }}>
                Remove
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:24 }}>
        <div>
          <div style={{ fontFamily:"'Syne',sans-serif", fontSize:20, fontWeight:800, color:C.text, marginBottom:4 }}>Team Management</div>
          <div style={{ fontSize:12, color:C.muted }}>{teamMembers.length} members · {Object.keys(roleColors).map(r=>teamMembers.filter(t=>t.role===r).length+" "+r+"s").filter(s=>!s.startsWith("0")).join(" · ")}</div>
        </div>
        <button onClick={()=>setShowInvite(true)}
          style={{ background:"linear-gradient(135deg,#a78bfa,#7c3aed)", border:"none", color:"#fff", fontSize:12, fontWeight:700, padding:"9px 20px", borderRadius:9, cursor:"pointer" }}>
          + Invite Member
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display:"flex", gap:4, marginBottom:20, borderBottom:`1px solid ${C.border}`, paddingBottom:0 }}>
        {["members","permissions","assignments"].map(t=>(
          <button key={t} onClick={()=>setActiveTab(t)}
            style={{ padding:"8px 18px", background:"none", border:"none", borderBottom:`2px solid ${activeTab===t?"#a78bfa":"transparent"}`, color:activeTab===t?C.text:C.muted, fontSize:12, fontWeight:activeTab===t?700:400, cursor:"pointer", textTransform:"capitalize", marginBottom:-1 }}>
            {t}
          </button>
        ))}
      </div>

      {activeTab==="members" && (
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {teamMembers.map(m=>{
            const col=roleColors[m.role]||C.accent;
            const assignedCount = m.assignedSellers[0]==="all" ? sellers.length : m.assignedSellers.length;
            return (
              <div key={m.id} style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:14, padding:"16px 20px", display:"flex", alignItems:"center", gap:14 }}>
                <div style={{ width:40, height:40, borderRadius:11, background:`${col}18`, border:`1px solid ${col}44`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:800, color:col, flexShrink:0 }}>{m.avatar}</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:3 }}>
                    <span style={{ fontSize:13, fontWeight:700, color:C.text }}>{m.name}</span>
                    <span style={{ fontSize:9, fontWeight:700, color:col, background:`${col}18`, border:`1px solid ${col}33`, padding:"1px 7px", borderRadius:4 }}>{m.role}</span>
                    {m.id==="tm1" && <span style={{ fontSize:9, color:"#10b981", background:"#0a1e16", border:"1px solid #10b98133", padding:"1px 7px", borderRadius:4, fontWeight:700 }}>You</span>}
                  </div>
                  <div style={{ fontSize:11, color:C.muted }}>{m.email}</div>
                </div>
                <div style={{ textAlign:"center", flexShrink:0 }}>
                  <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:14, fontWeight:700, color:C.text }}>{assignedCount}</div>
                  <div style={{ fontSize:9, color:C.subtle }}>sellers</div>
                </div>
                <div style={{ display:"flex", gap:4, flexWrap:"wrap", maxWidth:200, flexShrink:0 }}>
                  {m.permissions.map(p=>(
                    <span key={p} style={{ fontSize:8, fontWeight:700, color:col, background:`${col}12`, border:`1px solid ${col}28`, padding:"1px 6px", borderRadius:4, textTransform:"uppercase" }}>
                      {permLabels[p]||p}
                    </span>
                  ))}
                </div>
                <div style={{ textAlign:"right", flexShrink:0 }}>
                  <div style={{ fontSize:10, color:m.lastActive==="Online now"?"#10b981":C.muted, fontWeight:m.lastActive==="Online now"?600:400 }}>{m.lastActive}</div>
                </div>
                {m.id!=="tm1" && (
                  <div style={{ display:"flex", gap:6, flexShrink:0 }}>
                    <button onClick={()=>openEdit(m)} style={{ background:C.surface2, border:`1px solid ${C.border2}`, color:C.muted, fontSize:11, padding:"5px 10px", borderRadius:7, cursor:"pointer" }}>Edit</button>
                    <button onClick={()=>setRemoveTarget(m.id)} style={{ background:"#ef444410", border:"1px solid #ef444433", color:"#ef4444", fontSize:11, padding:"5px 10px", borderRadius:7, cursor:"pointer" }}>Remove</button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {activeTab==="permissions" && (
        <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:14, padding:"18px 20px", overflowX:"auto" }}>
          <div style={{ display:"grid", gridTemplateColumns:"180px repeat(8,1fr)", gap:0, minWidth:780 }}>
            {["Member","View","Edit","Buyers","Shows","Campaigns","Production","Analytics","Admin"].map(h=>(
              <div key={h} style={{ fontSize:9, fontWeight:700, color:h==="Production"?"#06b6d4":C.subtle, textTransform:"uppercase", letterSpacing:"0.08em", padding:"0 0 12px", borderBottom:`1px solid ${C.border}`, textAlign:h==="Member"?"left":"center" }}>{h}</div>
            ))}
            {teamMembers.map(m=>{
              const col=roleColors[m.role]||C.accent;
              const has=(p)=>m.permissions.includes("all")||m.permissions.includes(p);
              return (
                <React.Fragment key={m.id}>
                  <div style={{ display:"flex", alignItems:"center", gap:8, padding:"12px 0", borderBottom:`1px solid ${C.border}` }}>
                    <div style={{ width:24, height:24, borderRadius:6, background:`${col}18`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:8, fontWeight:800, color:col }}>{m.avatar}</div>
                    <div>
                      <div style={{ fontSize:11, fontWeight:700, color:C.text }}>{m.name}</div>
                      <div style={{ fontSize:9, color:col }}>{m.role}</div>
                    </div>
                  </div>
                  {[has("view"),has("edit"),has("buyers"),has("shows"),has("campaigns"),has("production"),has("analytics"),m.permissions.includes("all")].map((v,i)=>(
                    <div key={i} style={{ display:"flex", alignItems:"center", justifyContent:"center", padding:"12px 0", borderBottom:`1px solid ${C.border}` }}>
                      <div style={{ width:16, height:16, borderRadius:4, background:v?`${col}18`:"#1a1a2e", border:`1px solid ${v?col+"44":"#2a2a4a"}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, color:col }}>
                        {v?"✓":""}
                      </div>
                    </div>
                  ))}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      )}

      {activeTab==="assignments" && (
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
          {teamMembers.filter(m=>m.role==="Manager"||m.role==="Producer").map(m=>{
            const col=roleColors[m.role];
            const assigned = m.assignedSellers[0]==="all" ? sellers : sellers.filter(s=>m.assignedSellers.includes(s.id));
            return (
              <div key={m.id} style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:14, padding:"16px 18px" }}>
                <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
                  <div style={{ width:32, height:32, borderRadius:9, background:`${col}18`, border:`1px solid ${col}44`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:800, color:col }}>{m.avatar}</div>
                  <div>
                    <div style={{ fontSize:12, fontWeight:700, color:C.text }}>{m.name}</div>
                    <div style={{ fontSize:10, color:C.muted }}>{assigned.length} sellers assigned</div>
                  </div>
                </div>
                {assigned.map(s=>{
                  const sc=({starter:"#10b981",growth:"#7c3aed",pro:"#f59e0b"})[s.plan]||"#a78bfa";
                  return (
                    <div key={s.id} style={{ display:"flex", alignItems:"center", gap:8, padding:"7px 0", borderBottom:`1px solid ${C.border}` }}>
                      <div style={{ width:5, height:5, borderRadius:"50%", background:s.status==="active"?"#10b981":"#374151", flexShrink:0 }}/>
                      <span style={{ fontSize:11, flex:1, color:C.text }}>{s.name}</span>
                      <span style={{ fontSize:8, fontWeight:700, color:sc, background:`${sc}18`, border:`1px solid ${sc}33`, padding:"1px 6px", borderRadius:4, textTransform:"uppercase" }}>{s.plan}</span>
                      <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10, color:C.muted }}>${(s.gmv/1000).toFixed(0)}k</span>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── ENTERPRISE: BILLING ──────────────────────────────────────────────────────
function ScreenBilling({ persona }) {
  const sellers = persona.managedSellers;
  const planPrices={starter:79,growth:199,pro:399};
  const sellerTotal=sellers.reduce((a,s)=>a+(planPrices[s.plan]||0),0);
  const agencyFee=999;
  const total=agencyFee+sellerTotal;
  const planColors={starter:"#10b981",growth:"#7c3aed",pro:"#f59e0b"};

  const invoices=[
    { month:"February 2025", amount:total, status:"current",  date:"Feb 1, 2025" },
    { month:"January 2025",  amount:total-199, status:"paid", date:"Jan 1, 2025" },
    { month:"December 2024", amount:total-398, status:"paid", date:"Dec 1, 2024" },
    { month:"November 2024", amount:total-597, status:"paid", date:"Nov 1, 2024" },
  ];

  return (
    <div style={{ padding:"28px 32px", overflowY:"auto", height:"100%" }}>
      <div style={{ fontFamily:"'Syne',sans-serif", fontSize:20, fontWeight:800, color:C.text, marginBottom:4 }}>Billing</div>
      <div style={{ fontSize:12, color:C.muted, marginBottom:24 }}>Manage agency subscription and seller plan fees</div>

      {/* Summary cards */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, marginBottom:24 }}>
        {[
          { label:"Enterprise Plan",   value:"$999/mo",               sub:"Agency base fee",                    color:"#a78bfa" },
          { label:"Seller Fees",       value:`$${sellerTotal}/mo`,    sub:`${sellers.length} accounts`,          color:"#7c3aed" },
          { label:"Total Monthly",     value:`$${total.toLocaleString()}/mo`, sub:"Next invoice: Mar 1, 2025", color:"#10b981" },
        ].map(k=>(
          <div key={k.label} style={{ background:C.surface, border:`1px solid ${C.border}`, borderTop:`2px solid ${k.color}`, borderRadius:12, padding:"16px 18px" }}>
            <div style={{ fontSize:10, color:C.muted, textTransform:"uppercase", letterSpacing:"0.08em", fontWeight:700, marginBottom:8 }}>{k.label}</div>
            <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:24, fontWeight:700, color:C.text, marginBottom:4 }}>{k.value}</div>
            <div style={{ fontSize:10, color:C.subtle }}>{k.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 320px", gap:16 }}>
        {/* Seller subscription table */}
        <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:14, padding:"18px 20px" }}>
          <div style={{ fontSize:12, fontWeight:700, color:C.text, marginBottom:14 }}>Seller Subscriptions</div>
          {sellers.map((s,i)=>{
            const col=planColors[s.plan]||"#a78bfa";
            const fee=planPrices[s.plan]||0;
            const nextP={starter:"growth",growth:"pro"}[s.plan];
            const nextFee={starter:199,growth:399}[s.plan];
            return (
              <div key={s.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 0", borderBottom:i<sellers.length-1?`1px solid ${C.border}`:"none" }}>
                <div style={{ width:28, height:28, borderRadius:8, background:`${col}18`, border:`1px solid ${col}33`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:9, fontWeight:800, color:col, flexShrink:0 }}>{s.avatar}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:12, fontWeight:600, color:C.text }}>{s.name}</div>
                  <div style={{ fontSize:10, color:C.muted }}>{s.owner}</div>
                </div>
                <span style={{ fontSize:9, fontWeight:700, color:col, background:`${col}18`, border:`1px solid ${col}33`, padding:"1px 7px", borderRadius:4, textTransform:"uppercase", flexShrink:0 }}>{s.plan}</span>
                <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:12, fontWeight:700, color:C.text, minWidth:60, textAlign:"right" }}>${fee}/mo</div>
                <div style={{ width:6, height:6, borderRadius:"50%", background:s.status==="active"?"#10b981":"#374151", flexShrink:0 }}/>
                {nextP && (
                  <button style={{ fontSize:8, fontWeight:700, color:"#a78bfa", background:"#a78bfa12", border:"1px solid #a78bfa33", padding:"2px 8px", borderRadius:4, cursor:"pointer", whiteSpace:"nowrap" }}>
                    → {nextP} ${nextFee}
                  </button>
                )}
              </div>
            );
          })}
          <div style={{ display:"flex", justifyContent:"space-between", paddingTop:12, marginTop:4 }}>
            <span style={{ fontSize:11, fontWeight:700, color:C.muted }}>Seller total</span>
            <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:13, fontWeight:700, color:C.text }}>${sellerTotal}/mo</span>
          </div>
        </div>

        {/* Invoice history */}
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:14, padding:"16px 18px" }}>
            <div style={{ fontSize:12, fontWeight:700, color:C.text, marginBottom:12 }}>Invoice History</div>
            {invoices.map((inv,i)=>(
              <div key={i} style={{ display:"flex", alignItems:"center", gap:10, padding:"9px 0", borderBottom:i<invoices.length-1?`1px solid ${C.border}`:"none" }}>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:12, fontWeight:600, color:C.text }}>{inv.month}</div>
                  <div style={{ fontSize:10, color:C.muted }}>{inv.date}</div>
                </div>
                <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:12, fontWeight:700, color:C.text }}>${inv.amount.toLocaleString()}</span>
                <span style={{ fontSize:8, fontWeight:700, color:inv.status==="current"?"#f59e0b":"#10b981", background:inv.status==="current"?"#f59e0b18":"#0a1e16", border:`1px solid ${inv.status==="current"?"#f59e0b33":"#10b98133"}`, padding:"2px 7px", borderRadius:4, textTransform:"uppercase" }}>
                  {inv.status}
                </span>
                <button style={{ fontSize:9, color:"#a78bfa", background:"none", border:"none", cursor:"pointer" }}>↓ PDF</button>
              </div>
            ))}
          </div>

          {/* Payment method */}
          <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:14, padding:"16px 18px" }}>
            <div style={{ fontSize:12, fontWeight:700, color:C.text, marginBottom:12 }}>Payment Method</div>
            <div style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 12px", background:C.surface2, border:`1px solid ${C.border2}`, borderRadius:9 }}>
              <div style={{ width:36, height:24, background:"linear-gradient(135deg,#1a1a2e,#2d2d4e)", border:"1px solid #374151", borderRadius:5, display:"flex", alignItems:"center", justifyContent:"center" }}>
                <span style={{ fontSize:9, fontWeight:800, color:"#a78bfa" }}>VISA</span>
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:12, fontWeight:600, color:C.text }}>Visa ending 4242</div>
                <div style={{ fontSize:10, color:C.muted }}>Expires 09/27</div>
              </div>
              <button style={{ fontSize:11, color:"#a78bfa", background:"none", border:"none", cursor:"pointer" }}>Change</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── ENTERPRISE: WHITE LABEL ──────────────────────────────────────────────────
function ScreenWhiteLabel({ persona }) {
  const [domain, setDomain]  = useState(persona.whiteLabelDomain);
  const [brand, setBrand]    = useState("LiveScale");
  const [accent, setAccent]  = useState("#7c3aed");
  const [saved, setSaved]    = useState(false);

  const handleSave=()=>{ setSaved(true); setTimeout(()=>setSaved(false),2500); };

  return (
    <div style={{ padding:"28px 32px", overflowY:"auto", height:"100%" }}>
      <div style={{ fontFamily:"'Syne',sans-serif", fontSize:20, fontWeight:800, color:C.text, marginBottom:4 }}>White Label</div>
      <div style={{ fontSize:12, color:C.muted, marginBottom:24 }}>Your sellers experience your brand — Streamlive is invisible.</div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 340px", gap:20 }}>
        {/* Config */}
        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
          {/* Domain */}
          <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:14, padding:"18px 20px" }}>
            <div style={{ fontSize:12, fontWeight:700, color:C.text, marginBottom:14 }}>Custom Domain</div>
            <div style={{ display:"flex", gap:10, marginBottom:10 }}>
              <input value={domain} onChange={e=>setDomain(e.target.value)}
                style={{ flex:1, background:C.surface2, border:`1px solid ${C.border2}`, borderRadius:9, padding:"9px 14px", color:C.text, fontSize:13, outline:"none", fontFamily:"'JetBrains Mono',monospace" }}/>
              <div style={{ display:"flex", alignItems:"center", gap:6, padding:"9px 12px", background:"#0a1e16", border:"1px solid #10b98133", borderRadius:9 }}>
                <div style={{ width:6, height:6, borderRadius:"50%", background:"#10b981" }}/>
                <span style={{ fontSize:11, fontWeight:700, color:"#10b981" }}>Active</span>
              </div>
            </div>
            <div style={{ fontSize:11, color:C.subtle }}>All seller-facing URLs, emails, and notifications route through your domain. SSL managed automatically.</div>
          </div>

          {/* Branding */}
          <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:14, padding:"18px 20px" }}>
            <div style={{ fontSize:12, fontWeight:700, color:C.text, marginBottom:14 }}>Brand Identity</div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:12 }}>
              <div>
                <label style={{ fontSize:10, fontWeight:700, color:C.muted, textTransform:"uppercase", letterSpacing:"0.08em", display:"block", marginBottom:6 }}>Brand Name</label>
                <input value={brand} onChange={e=>setBrand(e.target.value)}
                  style={{ width:"100%", background:C.surface2, border:`1px solid ${C.border2}`, borderRadius:9, padding:"9px 14px", color:C.text, fontSize:13, outline:"none", boxSizing:"border-box" }}/>
              </div>
              <div>
                <label style={{ fontSize:10, fontWeight:700, color:C.muted, textTransform:"uppercase", letterSpacing:"0.08em", display:"block", marginBottom:6 }}>Accent Color</label>
                <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                  <div style={{ width:36, height:36, borderRadius:8, background:accent, border:`1px solid ${C.border2}`, cursor:"pointer" }}/>
                  <input value={accent} onChange={e=>setAccent(e.target.value)}
                    style={{ flex:1, background:C.surface2, border:`1px solid ${C.border2}`, borderRadius:9, padding:"9px 10px", color:C.text, fontSize:12, outline:"none", fontFamily:"'JetBrains Mono',monospace" }}/>
                </div>
              </div>
            </div>
            {/* Logo upload area */}
            <div>
              <label style={{ fontSize:10, fontWeight:700, color:C.muted, textTransform:"uppercase", letterSpacing:"0.08em", display:"block", marginBottom:6 }}>Logo</label>
              <div style={{ border:`2px dashed ${C.border2}`, borderRadius:10, padding:"20px", textAlign:"center", cursor:"pointer" }}>
                <div style={{ width:40, height:40, borderRadius:10, background:accent+"18", border:`1px solid ${accent}44`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, fontWeight:900, color:accent, margin:"0 auto 8px" }}>L</div>
                <div style={{ fontSize:11, fontWeight:700, color:C.text }}>LiveScale</div>
                <div style={{ fontSize:10, color:C.muted, marginTop:4 }}>Click to upload PNG or SVG · 512×512 recommended</div>
              </div>
            </div>
          </div>

          {/* SSO + Email */}
          <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:14, padding:"18px 20px" }}>
            <div style={{ fontSize:12, fontWeight:700, color:C.text, marginBottom:14 }}>Authentication & Email</div>
            {[
              { label:"SSO Provider",    value:"Google Workspace (G Suite)", status:"connected", color:"#10b981" },
              { label:"Email Sender",    value:`noreply@${domain}`, status:"verified", color:"#10b981" },
              { label:"Email Template",  value:"LiveScale brand template active", status:"active", color:"#a78bfa" },
              { label:"API Access",      value:"REST API + Webhooks enabled", status:"active", color:"#7c3aed" },
            ].map(r=>(
              <div key={r.label} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"9px 0", borderBottom:`1px solid ${C.border}` }}>
                <div>
                  <div style={{ fontSize:11, fontWeight:600, color:C.text }}>{r.label}</div>
                  <div style={{ fontSize:10, color:C.muted }}>{r.value}</div>
                </div>
                <span style={{ fontSize:9, fontWeight:700, color:r.color, background:`${r.color}18`, border:`1px solid ${r.color}33`, padding:"2px 8px", borderRadius:5 }}>{r.status}</span>
              </div>
            ))}
          </div>

          <button onClick={handleSave} className="cta-btn"
            style={{ background:saved?"#0a1e16":"linear-gradient(135deg,#a78bfa,#7c3aed)", border:saved?"1px solid #10b98133":"none", color:saved?"#10b981":"#fff", fontSize:13, fontWeight:700, padding:"12px", borderRadius:10, cursor:"pointer" }}>
            {saved?"✓ Changes Saved":"Save White Label Config"}
          </button>
        </div>

        {/* Live preview */}
        <div style={{ position:"sticky", top:0 }}>
          <div style={{ fontSize:11, fontWeight:700, color:C.muted, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:10 }}>Seller Preview</div>
          <div style={{ background:"#04040a", border:"1px solid #1a1a2e", borderRadius:14, overflow:"hidden" }}>
            {/* Fake top bar */}
            <div style={{ background:"#060609", borderBottom:"1px solid #12122a", padding:"8px 14px", display:"flex", alignItems:"center", gap:8 }}>
              <div style={{ width:20, height:20, borderRadius:6, background:accent, display:"flex", alignItems:"center", justifyContent:"center", fontSize:9, fontWeight:900, color:"#fff" }}>
                {brand.charAt(0)}
              </div>
              <span style={{ fontFamily:"'Syne',sans-serif", fontSize:12, fontWeight:800, color:"#fff" }}>{brand}</span>
              <div style={{ flex:1 }}/>
              <span style={{ fontSize:9, color:"#374151", fontFamily:"'JetBrains Mono',monospace" }}>{domain}</span>
            </div>
            {/* Fake sidebar + content */}
            <div style={{ display:"flex", height:280 }}>
              <div style={{ width:130, background:"#040407", borderRight:"1px solid #12122a", padding:"10px 8px" }}>
                {["Dashboard","Buyers","Shows","Analytics","Loyalty","Settings"].map((item,i)=>(
                  <div key={item} style={{ display:"flex", alignItems:"center", gap:7, padding:"6px 8px", borderRadius:7, marginBottom:2, background:i===0?`${accent}18`:"transparent" }}>
                    <div style={{ width:4, height:4, borderRadius:"50%", background:i===0?accent:"#374151" }}/>
                    <span style={{ fontSize:9, color:i===0?"#fff":"#374151", fontWeight:i===0?700:400 }}>{item}</span>
                  </div>
                ))}
                <div style={{ marginTop:"auto", padding:"8px 8px 0", borderTop:"1px solid #12122a", marginTop:80 }}>
                  <div style={{ fontSize:7, fontWeight:600, color:"#374151" }}>Powered by</div>
                  <div style={{ fontSize:8, fontWeight:800, color:accent }}>{brand}</div>
                </div>
              </div>
              <div style={{ flex:1, padding:"12px 14px" }}>
                <div style={{ fontSize:11, fontWeight:800, color:"#fff", fontFamily:"'Syne',sans-serif", marginBottom:8 }}>Good evening, Sarah 👋</div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6 }}>
                  {[{l:"Buyers",v:"847",c:accent},{l:"GMV",v:"$48.2k",c:"#10b981"},{l:"Shows",v:"8",c:"#f59e0b"},{l:"VIP",v:"68",c:"#ec4899"}].map(k=>(
                    <div key={k.l} style={{ background:`${k.c}10`, border:`1px solid ${k.c}22`, borderRadius:7, padding:"7px 9px" }}>
                      <div style={{ fontSize:7, color:"#4b5563", textTransform:"uppercase", letterSpacing:"0.05em" }}>{k.l}</div>
                      <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:13, fontWeight:700, color:"#fff", marginTop:2 }}>{k.v}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div style={{ fontSize:10, color:C.subtle, textAlign:"center", marginTop:8 }}>Live preview — what your sellers see</div>
        </div>
      </div>
    </div>
  );
}


// ─── SCREEN: UPGRADE WALL ─────────────────────────────────────────────────────
function ScreenUpgrade({ feature, persona, navigate, openCheckout }) {
  const wall = UPGRADE_WALLS[feature];
  if (!wall) return null;

  const nextPlan   = wall.requiredPlan;   // "growth" or "pro"
  const nextColor  = wall.requiredColor;
  const nextLevel  = PLAN_LEVEL[nextPlan];
  const planName   = nextPlan.charAt(0).toUpperCase() + nextPlan.slice(1);
  const planPrice  = nextPlan === "growth" ? "$199" : "$399";

  // Plan comparison table data
  const comparisonPlans = [
    { id:"starter",    label:"Starter",    price:"$79",  color:"#10b981" },
    { id:"growth",     label:"Growth",     price:"$199", color:"#7c3aed" },
    { id:"pro",        label:"Pro",        price:"$399", color:"#f59e0b" },
    { id:"enterprise", label:"Enterprise", price:"$999", color:"#a78bfa" },
  ];

  return (
    <div style={{ flex:1, overflow:"auto", background:C.bg, display:"flex", alignItems:"center", justifyContent:"center", padding:"40px 24px" }}>
      <div style={{ maxWidth:600, width:"100%" }}>
        {/* Back link */}
        <button onClick={()=>navigate("dashboard")} style={{ background:"none", border:"none", color:C.muted, fontSize:12, cursor:"pointer", display:"flex", alignItems:"center", gap:6, marginBottom:32, padding:0 }}>
          ← Back to Dashboard
        </button>

        {/* Header card */}
        <div style={{ background:`linear-gradient(135deg,${nextColor}0d,${nextColor}06)`, border:`1px solid ${nextColor}33`, borderRadius:20, padding:"32px", marginBottom:20, position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", top:-40, right:-40, width:200, height:200, borderRadius:"50%", background:nextColor, opacity:0.06, filter:"blur(60px)" }} />
          
          <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:20 }}>
            <div style={{ width:52, height:52, borderRadius:14, background:`${nextColor}18`, border:`1px solid ${nextColor}44`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:24 }}>{wall.icon}</div>
            <div>
              <div style={{ fontSize:10, fontWeight:800, color:nextColor, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:4 }}>
                {planName} Plan · {planPrice}/mo
              </div>
              <div style={{ fontFamily:"'Syne',sans-serif", fontSize:22, fontWeight:800, color:C.text, letterSpacing:"-0.5px" }}>{wall.headline}</div>
            </div>
          </div>

          <p style={{ fontSize:13, color:C.muted, lineHeight:1.75, marginBottom:24 }}>{wall.desc}</p>

          {/* Feature checklist */}
          <div style={{ display:"flex", flexDirection:"column", gap:9, marginBottom:28 }}>
            {wall.features.map((f,i)=>(
              <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:10 }}>
                <div style={{ width:18, height:18, borderRadius:5, background:`${nextColor}20`, border:`1px solid ${nextColor}44`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:9, color:nextColor, fontWeight:800, flexShrink:0, marginTop:1 }}>✓</div>
                <span style={{ fontSize:13, color:"#d1d5db", lineHeight:1.5 }}>{f}</span>
              </div>
            ))}
          </div>

          {/* CTA buttons */}
          <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
            <button
              onClick={()=>openCheckout&&openCheckout(nextPlan)}
              style={{ background:`linear-gradient(135deg,${nextColor},${nextColor}cc)`, border:"none", color:"#fff", fontSize:13, fontWeight:700, padding:"12px 28px", borderRadius:10, cursor:"pointer" }}>
              Upgrade to {planName} — {planPrice}/mo →
            </button>
            <button onClick={()=>navigate("settings")} style={{ background:C.surface2, border:`1px solid ${C.border2}`, color:C.muted, fontSize:13, fontWeight:600, padding:"12px 20px", borderRadius:10, cursor:"pointer" }}>
              View Plan Details
            </button>
          </div>
        </div>

        {/* Plan comparison strip */}
        <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:16, padding:"20px 24px" }}>
          <div style={{ fontSize:11, fontWeight:700, color:C.muted, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:16 }}>What each plan includes</div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10 }}>
            {comparisonPlans.map(p=>{
              const isCurrent  = p.id === persona.plan;
              const isRequired = p.id === nextPlan;
              const hasFeature = PLAN_LEVEL[p.id] >= nextLevel;
              return (
                <div key={p.id} style={{ background:isCurrent?`${p.color}10`:isRequired?`${p.color}08`:"#06060e", border:`1px solid ${isCurrent?p.color+"44":isRequired?p.color+"33":C.border}`, borderRadius:12, padding:"14px 12px", textAlign:"center", position:"relative" }}>
                  {isCurrent && (
                    <div style={{ position:"absolute", top:-8, left:"50%", transform:"translateX(-50%)", background:p.color, color:"#fff", fontSize:7, fontWeight:800, padding:"2px 8px", borderRadius:99, textTransform:"uppercase", letterSpacing:"0.08em", whiteSpace:"nowrap" }}>Your Plan</div>
                  )}
                  {isRequired && !isCurrent && (
                    <div style={{ position:"absolute", top:-8, left:"50%", transform:"translateX(-50%)", background:`linear-gradient(135deg,${p.color},${p.color}aa)`, color:"#fff", fontSize:7, fontWeight:800, padding:"2px 8px", borderRadius:99, textTransform:"uppercase", letterSpacing:"0.08em", whiteSpace:"nowrap" }}>Required</div>
                  )}
                  <div style={{ fontSize:11, fontWeight:700, color:p.color, marginBottom:2 }}>{p.label}</div>
                  <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:14, fontWeight:700, color:C.text, marginBottom:8 }}>{p.price}</div>
                  <div style={{ fontSize:18 }}>{hasFeature ? "✓" : "—"}</div>
                  <div style={{ fontSize:9, color:hasFeature?p.color:C.subtle, fontWeight:700, marginTop:2 }}>{hasFeature?"Included":"Not included"}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Current plan note */}
        <div style={{ marginTop:16, textAlign:"center", fontSize:12, color:C.subtle }}>
          You're on <span style={{ color:persona.planColor, fontWeight:700 }}>{persona.plan.charAt(0).toUpperCase()+persona.plan.slice(1)}</span> · {wall.title} requires {planName} or higher
        </div>
      </div>
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
    "Producer":           "Production suite, shows & live companion — Pro+ sellers only",
    "Show Manager":       "Run live shows and manage orders",
    "Campaign Manager":   "Create and send campaigns",
    "Viewer":             "Read-only access to all sections",
    "Manager":            "Edit sellers, campaigns, buyers, and shows",
    "Analyst":            "View analytics across the network",
    "Support":            "View buyers and handle support",
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
  const onboardParam = new URLSearchParams(window.location.search).get("onboard");
  const [personaId, setPersonaId]   = useState("sarah");
  const [view, setView]             = useState(onboardParam === "settings" ? "settings" : "dashboard");
  const [params, setParams]         = useState({});
  const [showPersonaMenu, setShowPersonaMenu] = useState(false);
  const [notifications, setNotifications] = useState(3);
  const [checkoutPlan, setCheckoutPlan] = useState(null);
  const [completedShows, setCompletedShows] = useState(SHOWS);
  // Persist the active live session so navigating away and back restores it
  const [liveSession, setLiveSession] = useState(null); // null = no show running

  // Check for invite token in URL — render accept screen instead of app
  const urlInviteToken = new URLSearchParams(window.location.search).get("invite");
  if (urlInviteToken) {
    return <ScreenAcceptInvite token={urlInviteToken} />;
  }

  const persona  = PERSONAS.find(p=>p.id===personaId);
  const buyers   = BUYERS_BY_PERSONA[personaId] || [];

  const navigate = (screen, newParams={}) => {
    // Starting a live show — persist the session
    if (screen === "live") {
      // Stamp showStartTime now and write to localStorage so ALL tabs stay in sync
      const t = newParams.showStartTime || Date.now();
      const session = { ...newParams, showStartTime: t };
      try { localStorage.setItem("STRMLIVE_SHOW_START", String(t));
            localStorage.setItem("STRMLIVE_SHOW_TIMINGS", JSON.stringify(session.productTimings || {}));
            localStorage.setItem("STRMLIVE_SHOW_ORDER", JSON.stringify((session.runOrder || []).map(p=>p.id))); } catch(e) {}
      setLiveSession(session);
    }
    // Ending a show — clear the session
    if (screen === "order-review") {
      try { localStorage.removeItem("STRMLIVE_SHOW_START");
            localStorage.removeItem("STRMLIVE_SHOW_TIMINGS");
            localStorage.removeItem("STRMLIVE_SHOW_ORDER"); } catch(e) {}
      setLiveSession(null);
    }
    // Clicking Shows nav while a show is live — jump back into it
    if (screen === "shows" && liveSession) {
      setView("live");
      setParams(liveSession);
      setShowPersonaMenu(false);
      return;
    }
    setView(screen);
    setParams(newParams);
    setShowPersonaMenu(false);
  };

  // Allows ScreenLive to push runOrder/timing changes back up so Live Shop stays in sync
  const updateLiveSession = (patch) => {
    setLiveSession(prev => {
      if (!prev) return prev;
      const next = { ...prev, ...patch };
      try {
        if (patch.productTimings) localStorage.setItem("STRMLIVE_SHOW_TIMINGS", JSON.stringify(patch.productTimings));
        if (patch.runOrder)       localStorage.setItem("STRMLIVE_SHOW_ORDER",   JSON.stringify(patch.runOrder.map(p=>p.id)));
      } catch(e) {}
      return next;
    });
  };

  const activeBuyer = params.buyerId ? buyers.find(b=>b.id===params.buyerId) : null;
  const activeShow  = params.showId  ? (completedShows.find(s=>s.id===params.showId) || SHOWS.find(s=>s.id===params.showId)) : null;

  const isEnterprise = persona.plan === "enterprise";

  // Map view to nav item for highlighting
  const activeNav = isEnterprise
    ? (view === "seller-detail" ? "sellers" : view)
    : (["buyer-profile"].includes(view) ? "buyers" : ["show-report","live","show-planner","order-review"].includes(view) ? "shows" : ["composer"].includes(view) ? "campaigns" : view);

  return (
    <>
      <style>{GLOBAL_CSS}</style>

      {checkoutPlan && <CheckoutModal plan={checkoutPlan} onClose={()=>setCheckoutPlan(null)} />}
      <div style={{ display:"flex", flexDirection:"column", height:"100vh", maxHeight:"100vh", minHeight:0, background:C.bg, color:C.text, fontFamily:"'DM Sans',sans-serif", overflow:"hidden" }}>

        {/* ── DEMO BANNER ── */}
        <div style={{ background:"linear-gradient(90deg,#1a0f2e,#2d1f5e,#1a0f2e)", borderBottom:"1px solid #7c3aed33", padding:"4px 16px", display:"flex", alignItems:"center", gap:12, flexShrink:0, flexWrap:"wrap", minHeight:36 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, flexShrink:0 }}>
            <div style={{ width:5, height:5, borderRadius:"50%", background:"#a78bfa", animation:"pulse 2s infinite" }} />
            <span style={{ fontSize:9, fontWeight:700, color:"#6b5fa0", letterSpacing:"0.08em", textTransform:"uppercase" }}>Demo</span>
            <span style={{ fontSize:9, color:"#2d2a4a" }}>Switch plan to explore gating →</span>
          </div>
          {/* Quick-switch persona pills */}
          <div style={{ display:"flex", gap:5, flexWrap:"wrap", flex:1 }}>
            {PERSONAS.map(p=>{
              const isCurrent = p.id === personaId;
              const locked = Object.keys(UPGRADE_WALLS).filter(f => !PLAN_FEATURES[p.plan].includes(f));
              return (
                <button key={p.id}
                  onClick={()=>{ setPersonaId(p.id); setView(p.plan==="enterprise"?"network":"dashboard"); setParams({}); setShowPersonaMenu(false); }}
                  style={{ display:"flex", alignItems:"center", gap:6, padding:"3px 10px 3px 6px", borderRadius:99,
                    background: isCurrent ? `${p.planColor}22` : "transparent",
                    border: `1px solid ${isCurrent ? p.planColor+"55" : "#2a2a4a"}`,
                    cursor:"pointer", transition:"all .12s" }}>
                  <div style={{ width:16, height:16, borderRadius:5, background:`${p.planColor}22`, border:`1px solid ${p.planColor}44`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:7, fontWeight:800, color:p.planColor, flexShrink:0 }}>{p.avatar}</div>
                  <span style={{ fontSize:10, fontWeight:isCurrent?700:500, color:isCurrent?p.planColor:"#4b5563" }}>{p.name.split(" ")[0]}</span>
                  <span style={{ fontSize:8, fontWeight:700, color:p.planColor, background:`${p.planColor}18`, padding:"1px 5px", borderRadius:3, textTransform:"uppercase" }}>{p.plan}</span>
                  {locked.length > 0 && <span style={{ fontSize:8, color:"#374151" }}>{"🔒"}</span>}
                </button>
              );
            })}
          </div>
          {/* Plan feature key */}
          <div style={{ display:"flex", gap:10, flexShrink:0 }}>
            {[{f:"Analytics",plan:"Growth+"},{f:"Loyalty",plan:"Growth+"},{f:"Production",plan:"Pro+"}].map(({f,plan})=>(
              <div key={f} style={{ display:"flex", alignItems:"center", gap:4 }}>
                <span style={{ fontSize:8, color: PLAN_LEVEL[persona.plan] >= PLAN_LEVEL[plan.toLowerCase().replace("+","")] ? "#10b981" : "#374151" }}>
                  {PLAN_LEVEL[persona.plan] >= (plan.includes("Pro") ? 2 : 1) ? "✓" : "🔒"}
                </span>
                <span style={{ fontSize:9, color:"#374151" }}>{f}</span>
              </div>
            ))}
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
            {/* Enterprise breadcrumbs */}
            {view==="network"        ? "Network Overview" :
             view==="sellers"        ? "Sellers" :
             view==="seller-detail"  ? `Sellers / ${persona.managedSellers?.find(s=>s.id===params.sellerId)?.name||"Detail"}` :
             view==="net-analytics"  ? "Analytics" :
             view==="team"           ? "Team" :
             view==="billing"        ? "Billing" :
             view==="white-label"    ? "White Label" :
             /* Standard breadcrumbs */
             view==="buyer-profile" ? `Buyers / ${activeBuyer?.name||"Profile"}` :
             view==="show-report"   ? `Shows / ${activeShow?.title||"Report"}` :
             view==="composer"      ? "Campaigns / New" :
             view==="live"          ? "Shows / Live Companion" :
             view==="live-shop"     ? "Shows / Live Shop Page" :
             view==="show-planner"  ? "Shows / Show Planner" :
             view==="order-review"  ? "Shows / Order Review" :
             view==="catalog"       ? "Catalog" :
             view==="analytics"     ? "Analytics" :
             view==="loyalty"       ? "Loyalty Hub" :
             view==="production"    ? "Production" :
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
                  <button key={p.id} onClick={()=>{ setPersonaId(p.id); setView(p.plan==="enterprise"?"network":"dashboard"); setParams({}); setShowPersonaMenu(false); }} style={{ width:"100%", display:"flex", alignItems:"center", gap:10, padding:"9px 10px", borderRadius:8, border:"none", background:personaId===p.id?`${p.planColor}12`:"transparent", cursor:"pointer", textAlign:"left" }}>
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
        <div style={{ display:"flex", flex:1, overflow:"hidden", minHeight:0 }}>

          {/* ── SIDEBAR ── */}
          <div style={{ width:216, borderRight:`1px solid ${C.border}`, display:"flex", flexDirection:"column", padding:"12px 10px", flexShrink:0, background:"#050508" }}>
            {isEnterprise ? (
              <>
                {/* Enterprise agency nav */}
                <div style={{ fontSize:8, fontWeight:800, color:"#a78bfa44", textTransform:"uppercase", letterSpacing:"0.12em", padding:"2px 12px 8px" }}>Agency</div>
                {ENTERPRISE_NAV.map(n=>{
                  const isActive = activeNav === n.id;
                  return (
                    <button key={n.id} onClick={()=>navigate(n.id)}
                      style={{ display:"flex", alignItems:"center", gap:10, padding:"9px 12px", borderRadius:9, border:"none", cursor:"pointer", marginBottom:2, background:isActive?"#a78bfa18":"transparent", transition:"all .12s" }}>
                      <span style={{ fontSize:13, color:isActive?"#a78bfa":C.subtle, width:16, textAlign:"center" }}>{n.icon}</span>
                      <span style={{ fontSize:13, fontWeight:isActive?700:400, color:isActive?C.text:C.muted }}>{n.label}</span>
                      {n.id==="shows" && liveSession && (
                        <div style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:4, background:"#1a0505", border:"1px solid #ef444444", borderRadius:5, padding:"2px 6px" }}>
                          <div style={{ width:5, height:5, borderRadius:"50%", background:"#ef4444", animation:"pulse 1s infinite", flexShrink:0 }}/>
                          <span style={{ fontSize:8, fontWeight:800, color:"#ef4444", letterSpacing:".06em" }}>LIVE</span>
                        </div>
                      )}
                    </button>
                  );
                })}
                <div style={{ flex:1 }}/>
                {/* Seller drill-in context chip */}
                {view==="seller-detail" && params.sellerId && (()=>{
                  const s = persona.managedSellers.find(sel=>sel.id===params.sellerId);
                  if (!s) return null;
                  const sc = ({starter:"#10b981",growth:"#7c3aed",pro:"#f59e0b"})[s.plan]||"#a78bfa";
                  return (
                    <div style={{ background:`${sc}10`, border:`1px solid ${sc}28`, borderRadius:10, padding:"10px 12px", marginBottom:6 }}>
                      <div style={{ fontSize:8, fontWeight:800, color:sc, textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:3 }}>Viewing</div>
                      <div style={{ fontSize:11, fontWeight:700, color:C.text, marginBottom:1 }}>{s.name}</div>
                      <div style={{ fontSize:9, color:C.muted }}>{s.owner} · {s.plan}</div>
                    </div>
                  );
                })()}
                {/* Enterprise plan badge */}
                <div style={{ background:"#a78bfa10", border:"1px solid #a78bfa28", borderRadius:10, padding:"10px 12px", marginBottom:6 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:3 }}>
                    <span style={{ fontSize:9, fontWeight:800, color:"#a78bfa", textTransform:"uppercase", letterSpacing:"0.07em" }}>Enterprise</span>
                    <span style={{ fontSize:8, color:"#10b981", background:"#0a1e16", border:"1px solid #10b98133", padding:"1px 5px", borderRadius:3, fontWeight:700 }}>WL</span>
                  </div>
                  <div style={{ fontSize:9, color:C.muted }}>{persona.sellerCount} sellers · {persona.teamSize} team</div>
                </div>
              </>
            ) : (
              <>
                {/* Standard seller nav */}
                {NAV.map(n=>{
                  const isActive  = activeNav === n.id;
                  const allowed   = PLAN_FEATURES[persona.plan] || [];
                  const isLocked  = !allowed.includes(n.id);
                  const navColor  = isLocked ? C.subtle : isActive ? C.accent : C.subtle;
                  const textColor = isLocked ? "#374151" : isActive ? C.text : C.muted;
                  return (
                    <button key={n.id} onClick={()=>{ if(isLocked){ navigate("upgrade-"+n.id); } else { navigate(n.id); } }}
                      style={{ display:"flex", alignItems:"center", gap:10, padding:"9px 12px", borderRadius:9, border:"none", cursor:"pointer", marginBottom:2,
                        background:isActive?`${C.accent}18`:"transparent", opacity:isLocked?0.45:1, transition:"all .12s" }}>
                      <span style={{ fontSize:13, color:navColor, width:16, textAlign:"center" }}>{n.icon}</span>
                      <span style={{ fontSize:13, fontWeight:isActive?700:400, color:textColor }}>{n.label}</span>
                      {isLocked && <span style={{ marginLeft:"auto", fontSize:9, color:"#374151" }}>🔒</span>}
                      {!isLocked && n.id==="subscribers" && notifications>0 && (
                        <div style={{ marginLeft:"auto", width:16, height:16, borderRadius:"50%", background:"#ef4444", fontSize:9, fontWeight:700, color:"#fff", display:"flex", alignItems:"center", justifyContent:"center" }}>{notifications}</div>
                      )}
                      {!isLocked && n.id==="shows" && liveSession && (
                        <div style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:4, background:"#1a0505", border:"1px solid #ef444444", borderRadius:5, padding:"2px 6px" }}>
                          <div style={{ width:5, height:5, borderRadius:"50%", background:"#ef4444", animation:"pulse 1s infinite", flexShrink:0 }}/>
                          <span style={{ fontSize:8, fontWeight:800, color:"#ef4444", letterSpacing:".06em" }}>LIVE</span>
                        </div>
                      )}
                    </button>
                  );
                })}
                <div style={{ flex:1 }}/>
                {persona.plan === "pro" ? (
                  <div style={{ background:"#f59e0b10", border:"1px solid #f59e0b28", borderRadius:10, padding:"11px 12px", marginBottom:6 }}>
                    <div style={{ fontSize:10, fontWeight:700, color:"#f59e0b", textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:4 }}>Pro Plan</div>
                    <div style={{ fontSize:10, color:C.muted, lineHeight:1.5 }}>All features unlocked</div>
                  </div>
                ) : (
                  <div style={{ background:`${persona.planColor}10`, border:`1px solid ${persona.planColor}28`, borderRadius:10, padding:"11px 12px", marginBottom:6 }}>
                    <div style={{ fontSize:10, fontWeight:700, color:persona.planColor, textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:4 }}>
                      {persona.plan === "starter" ? "🔒 3 features locked" : "🔒 1 feature locked"}
                    </div>
                    <div style={{ fontSize:10, color:C.muted, marginBottom:8, lineHeight:1.5 }}>
                      {persona.plan === "starter" ? "Analytics, Loyalty & Production on Growth+" : "Production Suite on Pro+"}
                    </div>
                    <button onClick={()=>setCheckoutPlan(persona.plan==="starter"?"growth":"pro")}
                      style={{ display:"block", textAlign:"center", width:"100%", background:`linear-gradient(135deg,${C.accent},${C.accent2})`, border:"none", color:"#fff", fontSize:11, fontWeight:700, padding:"7px", borderRadius:7, cursor:"pointer" }}>
                      Upgrade →
                    </button>
                  </div>
                )}
              </>
            )}

            {/* USER — always visible at bottom */}
            <div style={{ display:"flex", alignItems:"center", gap:8, padding:"10px 10px 4px", borderTop:`1px solid ${C.border}`, marginTop:4 }}>
              <Avatar initials={persona.avatar} color={persona.planColor} size={28} />
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:11, fontWeight:600, color:C.text, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{persona.name}</div>
                <div style={{ fontSize:9, color:C.muted, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{persona.shop}</div>
              </div>
            </div>
          </div>

          {/* ── MAIN CONTENT ── */}
          <div style={{ flex:1, overflow:"hidden", display:"flex", flexDirection:"column", minHeight:0 }}>
            {isEnterprise ? (
              <>
                {(view==="network"||view==="dashboard") && <ScreenNetwork          persona={persona} navigate={navigate} />}
                {view==="sellers"        && <ScreenSellers          persona={persona} navigate={navigate} />}
                {view==="seller-detail"  && <ScreenSellerDetail     persona={persona} params={params}   navigate={navigate} />}
                {view==="net-analytics"  && <ScreenNetworkAnalytics persona={persona} />}
                {view==="team"           && <ScreenTeam             persona={persona} />}
                {view==="billing"        && <ScreenBilling          persona={persona} />}
                {view==="white-label"    && <ScreenWhiteLabel       persona={persona} />}
                {view==="settings"       && <ScreenSettings         persona={persona} openCheckout={setCheckoutPlan} />}
              </>
            ) : (
              <>
                {view==="upgrade-analytics"  && <ScreenUpgrade feature="analytics"  persona={persona} navigate={navigate} openCheckout={setCheckoutPlan} />}
                {view==="upgrade-loyalty"     && <ScreenUpgrade feature="loyalty"    persona={persona} navigate={navigate} openCheckout={setCheckoutPlan} />}
                {view==="upgrade-production"  && <ScreenUpgrade feature="production" persona={persona} navigate={navigate} openCheckout={setCheckoutPlan} />}
                {view==="dashboard"    && <ScreenDashboard    persona={persona} buyers={buyers} navigate={navigate} shows={completedShows} />}
                {view==="buyers"       && <ScreenBuyers        buyers={buyers} navigate={navigate} />}
                {view==="buyer-profile"&& <ScreenBuyerProfile  buyer={activeBuyer} persona={persona} navigate={navigate} />}
                {view==="shows"        && <ScreenShows         navigate={navigate} persona={persona} shows={completedShows} />}
                {view==="show-report"  && <ScreenShowReport    show={activeShow} allShows={completedShows} buyers={buyers} navigate={navigate} />}
                {/* ScreenLive stays mounted while liveSession is active so its intervals keep ticking */}
                <div style={{ display: view==="live" ? "contents" : "none" }}>
                  {(view==="live" || liveSession) && <ScreenLive buyers={buyers} navigate={navigate} params={liveSession || params} persona={persona} updateLiveSession={updateLiveSession} />}
                </div>
                {view==="live-shop"    && <ScreenLiveShop     navigate={navigate} params={liveSession || params} persona={persona} />}
                {view==="campaigns"    && <ScreenCampaigns     navigate={navigate} persona={persona} />}
                {view==="composer"     && <ScreenComposer      navigate={navigate} persona={persona} />}
                {view==="subscribers"  && <ScreenSubscribers   persona={persona} />}
                {view==="settings"     && <ScreenSettings      persona={persona} initialTab={onboardParam==="settings"?"platforms":undefined} openCheckout={setCheckoutPlan} />}
                {view==="order-review" && <ScreenOrderReview   params={params} navigate={navigate} onShowComplete={(show)=>setCompletedShows(prev=>[show,...prev])} />}
                {view==="catalog"      && <ScreenCatalog       persona={persona} navigate={navigate} />}
                {view==="show-planner" && <ScreenShowPlanner   navigate={navigate} persona={persona} />}
                {view==="loyalty"      && <ScreenLoyalty       buyers={buyers} navigate={navigate} persona={persona} />}
                {view==="production"   && <ScreenProduction    persona={persona} navigate={navigate} />}
                {view==="analytics"    && <ScreenAnalytics     buyers={buyers} persona={persona} navigate={navigate} />}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
