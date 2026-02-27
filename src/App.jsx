import { useState, useEffect } from 'react'
import StreamlivePrototype from './StreamlivePrototype.jsx'

// ─── ROUTER ───────────────────────────────────────────────────────────────────
function useRoute() {
  const [route, setRoute] = useState(() => window.location.pathname)
  useEffect(() => {
    const handler = () => setRoute(window.location.pathname)
    window.addEventListener('popstate', handler)
    return () => window.removeEventListener('popstate', handler)
  }, [])
  return route
}

function navigate(path) {
  window.history.pushState({}, '', path)
  window.dispatchEvent(new PopStateEvent('popstate'))
}

// ─── SHARED CONSTANTS ─────────────────────────────────────────────────────────
const FONT = `@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:ital,wght@0,400;0,500;0,600;1,400&family=JetBrains+Mono:wght@400;600&display=swap');`

const STRIPE_LINKS = {
  starter:    'https://buy.stripe.com/test_cNibJ377j60W9TS1rX0kE00',
  growth:     'https://buy.stripe.com/test_7sYbJ363fblgfec9Yt0kE01',
  pro:        'https://buy.stripe.com/test_00w5kF77j7504zyc6B0kE02',
  enterprise: null,
}

const PLANS = {
  starter: {
    id:'starter', name:'Starter', price:79, color:'#10b981', bg:'#0a1e16', border:'#10b98133',
    emoji:'🌱', tagline:'For sellers just getting started with live commerce',
    headline:"You're in. Let's import your buyers.",
    subline:"Your Streamlive account is active. Connect your first platform and we'll import your buyers immediately.",
    features:[
      'Buyer CRM: all platforms unified',
      'Email campaigns (1,000/month)',
      'Show performance reports',
      'Opt-in landing page (strmlive.com/s/yourshop)',
      'Whatnot, TikTok & Amazon Live sync',
      'Loyalty program (Bronze & Silver tiers)',
      'Show Planner with run order',
      'Up to 2 platforms',
    ],
    notIncluded:['Live Companion','Analytics','Production suite','AI Insights','SMS campaigns'],
    nextLabel:'Connect your first platform →',
    nextHint:"Takes 2 minutes. We'll import your buyers immediately.",
    billing:'Billed monthly. Cancel anytime.',
  },
  growth: {
    id:'growth', name:'Growth', price:199, color:'#7c3aed', bg:'#2d1f5e22', border:'#7c3aed44', popular:true,
    emoji:'🚀', tagline:'For sellers running multiple shows per week',
    headline:'Growth unlocked. Time to go live.',
    subline:'You now have real-time Live Companion, Analytics, AI insights, and SMS campaigns.',
    features:[
      'Everything in Starter',
      'Real-time Live Companion during shows',
      'Analytics dashboard (Revenue, Audience, Shows)',
      'AI Insights: 6 weekly business recommendations',
      'SMS campaigns (5,000/month)',
      'Instagram & all 4 platform sync',
      'Loyalty Hub (all 4 tiers incl. VIP)',
      'ManyChat DM automation (TikTok + Instagram)',
      'Audience segmentation & win-back campaigns',
      'Show Planner with multi-platform streaming',
    ],
    notIncluded:['Production suite','Multi-camera & lighting control','White label','Dedicated support'],
    nextLabel:'Set up your platforms →',
    nextHint:"Connect Whatnot and it activates automatically when you go live.",
    billing:'Billed monthly. Cancel anytime.',
  },
  pro: {
    id:'pro', name:'Pro', price:399, color:'#f59e0b', bg:'#2e1f0a22', border:'#f59e0b33',
    emoji:'⚡', tagline:'For power sellers at full scale',
    headline:"Pro activated. You're operating at full power.",
    subline:'Every feature unlocked. Production suite, full AI, and multi-platform at scale.',
    features:[
      'Everything in Growth',
      'Production suite: Sony FX3/FX6, multi-camera and OBS control',
      'OBS scene switcher via WebSocket',
      'Lighting control (Elgato, Aputure, Godox)',
      'Production automation rules',
      'AI churn narratives & win-back copy generation',
      'Cross-platform buyer identity matching',
      'SMS campaigns (25,000/month)',
      'TikTok multi-shop (up to 5)',
      'Amazon multi-marketplace sync',
      'Priority support (< 4hr response)',
    ],
    notIncluded:['White label','Dedicated account manager','Custom integrations'],
    nextLabel:'Set up your platforms →',
    nextHint:"Connect all 4 platforms and let Streamlive do the rest.",
    billing:'Billed monthly. Cancel anytime.',
  },
  enterprise: {
    id:'enterprise', name:'Enterprise', price:999, color:'#a78bfa', bg:'#1a1030', border:'#7c3aed55',
    emoji:'🏢', tagline:'For agencies and high-volume seller networks',
    headline:'Enterprise activated. Your whole team is live.',
    subline:'White label, dedicated support, custom integrations, and unlimited scale.',
    features:[
      'Everything in Pro',
      'White label: your brand, your domain',
      'Unlimited team seats with role permissions',
      'Dedicated account manager',
      'Custom SDK & API integrations',
      'SSO (Single Sign-On)',
      'SLA: 99.9% uptime guarantee',
      'Custom analytics & data exports',
      'Unlimited SMS campaigns',
      'Multi-seller network management',
      '< 1hr support response + emergency line',
      'Quarterly business reviews',
    ],
    notIncluded:[],
    nextLabel:'Contact sales →',
    nextHint:"We'll scope a custom plan for your team.",
    billing:'Annual billing available. Custom contracts.',
    contactSales: true,
  },
}

const GLOBAL_CSS = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { background: #06060e; color: #e2e8f0; font-family: 'DM Sans', sans-serif; }
  /* cursor:none is scoped to the app screens only, not the landing page */
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
function Nav({ currentPlan }) {
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

// ─── LANDING ──────────────────────────────────────────────────────────────────
function Landing() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [billingCycle, setBillingCycle] = useState('monthly')
  const [faqOpen, setFaqOpen] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [liveGmv, setLiveGmv] = useState(0)
  // Demo gate modal
  const [demoModal, setDemoModal] = useState(false)
  const [demoEmail, setDemoEmail] = useState('')
  const [demoEmailSent, setDemoEmailSent] = useState(false)
  // Contact Sales modal
  const [salesModal, setSalesModal] = useState(false)
  const [salesForm, setSalesForm] = useState({ firstName:'', lastName:'', email:'', phone:'' })
  const [salesSent, setSalesSent] = useState(false)

  useEffect(() => {
    // Simulate realistic live show GMV ticking up
    // Orders come in bursts — sometimes fast, sometimes a pause
    let current = 0
    const tick = () => {
      // Each "order" is between $18–$340, weighted toward $40–$120
      const rand = Math.random()
      let orderAmt
      if (rand < 0.45)      orderAmt = Math.round(Math.random() * 60 + 40)   // $40–$100 (common)
      else if (rand < 0.72) orderAmt = Math.round(Math.random() * 80 + 100)  // $100–$180 (mid)
      else if (rand < 0.88) orderAmt = Math.round(Math.random() * 100 + 180) // $180–$280 (bigger)
      else                  orderAmt = Math.round(Math.random() * 60 + 18)   // $18–$78 (small)

      current += orderAmt
      if (current >= 10000) {
        setLiveGmv(0)
        current = 0
      } else {
        setLiveGmv(current)
      }
      // Delay between orders: 400ms–2800ms (feels like real orders coming in)
      const delay = Math.random() < 0.3
        ? Math.round(Math.random() * 400 + 200)   // burst: 200–600ms
        : Math.round(Math.random() * 1800 + 600)  // normal: 600–2400ms
      setTimeout(tick, delay)
    }
    const t = setTimeout(tick, 800)
    return () => clearTimeout(t)
  }, [])

  const SHEET_URL = 'https://script.google.com/macros/s/AKfycbw8rtlHDPcvCeV72NuAWWwJqig2mflATPpCt8G5PHUQQUB6KxaXKSVG5F6hxc3GJd8v7Q/exec'

  const openDemo = () => {
    setDemoEmailSent(false)
    setDemoEmail('')
    setDemoModal(true)
  }

  const submitDemoEmail = async () => {
    if (!demoEmail.includes('@')) return
    try { await fetch(SHEET_URL, { method:'POST', mode:'no-cors', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ email: demoEmail, source: 'demo_gate' }) }) } catch(e) {}
    setDemoEmailSent(true)
    setTimeout(() => {
      setDemoModal(false)
      navigate('/app')
    }, 1400)
  }

  const openSales = () => {
    setSalesForm({ firstName:'', lastName:'', email:'', phone:'' })
    setSalesSent(false)
    setSalesModal(true)
  }

  const submitSales = async () => {
    if (!salesForm.firstName || !salesForm.email.includes('@')) return
    try { await fetch(SHEET_URL, { method:'POST', mode:'no-cors', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ ...salesForm, source: 'contact_sales' }) }) } catch(e) {}
    setSalesSent(true)
  }

  const handleSubmit = async () => {
    if (!email.includes('@')) return
    try { await fetch(SHEET_URL, { method:'POST', mode:'no-cors', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ email }) }) } catch(e) {}
    setSubmitted(true)
  }

  const FEATURES = [
    { icon:'◉', color:'#7c3aed', label:'Buyer CRM',             desc:'Every buyer across every platform, unified. Spend history, churn risk scores, VIP flags, and platform handles. All in one view, updated in real time.' },
    { icon:'◈', color:'#10b981', label:'Live Companion',         desc:'Your command center during shows. Real-time buyer feed, accurate per-order GMV tracking, full purchase history, loyalty tier, notes, discounts, and VIP alerts. Starts fresh at $0 every show and counts only real purchases.' },
    { icon:'◑', color:'#f59e0b', label:'Analytics',              desc:'Revenue trends, audience health, platform comparison, LTV distribution, and 6 weekly AI-generated recommendations with confidence scores after every show.' },
    { icon:'⬛', color:'#a78bfa', label:'Production Suite',       desc:'Control Sony FX3/FX6 camera feeds, Elgato, Aputure, and Godox lights, and OBS scenes, all from one interface. Switch feeds, set lighting presets, and manage your broadcast without leaving the app.' },
    { icon:'◆', color:'#ec4899', label:'Campaigns',              desc:'Email, SMS, and ManyChat DM campaigns. TikTok and Instagram keyword automations that trigger instant opt-ins when fans comment.' },
    { icon:'♦', color:'#f43f5e', label:'Loyalty Hub',            desc:'4-tier loyalty program (Bronze → VIP) with points, perks, early access, and birthday rewards. Buyers level up automatically across every platform.' },
    { icon:'●', color:'#3b82f6', label:'Opt-in Pages',           desc:'Branded landing pages at strmlive.com/s/yourshop. Collect email, phone, and platform handles. TCPA-compliant consent built in.' },
    { icon:'◧', color:'#10b981', label:'Show Planner',           desc:'Name your show, pick your platforms, set AI-ranked product run orders and perks, then go live. Your show name is required and flows automatically from planner through Live Companion, Order Review, and Show History so every report is exactly what you called it.' },
    { icon:'🔴', color:'#ff0000', label:'YouTube Live',           desc:'Stream to YouTube alongside your other platforms simultaneously. Live Pixel tracks viewers from stream to site to purchase with 99% attribution accuracy. No guessing.' },
    { icon:'◎', color:'#f59e0b', label:'Live Pixel Attribution', desc:'First-party pixel installed on your Shopify store. Every viewer who buys is tracked end-to-end: session ID, order ID, and show ID. No third-party cookies needed.' },
    { icon:'✦', color:'#a78bfa', label:'AI Insights',            desc:'Intelligent business analysis: VIP opportunities, at-risk buyer alerts, product performance gaps, and show timing optimization. All confidence-scored and delivered after every show.' },
    { icon:'🔗', color:'#ec4899', label:'Multi-Platform Sync',   desc:'Whatnot, TikTok, Instagram, Amazon Live, and YouTube Live. Stream to all five simultaneously. Show cards in your history display every platform you were live on, so you always know exactly where each show reached.' },
  ]

  const STATS = [
    { value:'5',    label:'Platforms',            sub:'Whatnot · TikTok · IG · Amazon · YouTube' },
    { value:'99%',  label:'Attribution accuracy', sub:'Live Pixel vs 55–82% guesswork' },
    { value:'LIVE_GMV', label:'Live Show GMV',    sub:'Live show in progress · real orders only' },
    { value:'6+',   label:'AI Insights per Show', sub:'Confidence-scored recommendations' },
  ]

  const SPOTLIGHTS = [
    {
      tag:'PLAN THE SHOW',
      headline:"Name it. Build it.\nLaunch it.",
      desc:"Before you go live, the Show Planner walks you through everything. Name your show and it flows through to your Live Companion, Order Review, and Show History as a real title, not a timestamp. Pick every platform you're streaming to. Add products and let the AI rank them by conversion score so your best performers open and close the show. Configure perks for your live audience: first-order discounts, bundle unlocks, VIP early access. Everything is set before you hit Go Live.",
      color:'#7c3aed',
      stats:[{ label:'AI product ranking', value:'✓' },{ label:'Show perks', value:'✓' },{ label:'Multi-platform', value:'5' }],
      side:'left',
    },
    {
      tag:'BEFORE THE SHOW',
      headline:"Broadcast-quality setup.\nOne interface.",
      desc:"The Production Suite connects your cameras, lighting, and streaming software into one control panel. Switch between Sony FX3 and FX6 camera feeds via Sony Camera Remote SDK. Control Elgato, Aputure, and Godox lighting rigs. Set intensity, color temperature, and scene presets with a tap. Manage OBS scenes via WebSocket: switch camera angles, overlays, and layouts without leaving Streamlive. Build automation rules so when a product goes live, your lighting and OBS scene update automatically.",
      color:'#f59e0b',
      stats:[{ label:'Camera feeds', value:'Multi' },{ label:'Lighting brands', value:'3' },{ label:'OBS control', value:'Live' }],
      side:'right',
    },
    {
      tag:'DURING THE SHOW',
      headline:"Stream everywhere.\nAttribute every sale.",
      desc:"The Live Companion is your real-time command center across all 5 platforms simultaneously. See live viewer counts pulse on Whatnot, TikTok, Instagram, Amazon, and YouTube. Every order that comes in from any platform appears instantly in your buyer feed with their full history, loyalty tier, and notes. GMV starts at $0 and ticks up only on real purchases, so every number you see is earned. YouTube viewers are tracked by Live Pixel: a first-party snippet that follows each viewer from stream to purchase with 99% accuracy.",
      color:'#10b981',
      stats:[{ label:'Platforms live', value:'5' },{ label:'Attribution', value:'99%' },{ label:'Buyer lookup', value:'< 1s' }],
      side:'left',
    },
    {
      tag:'AFTER THE SHOW',
      headline:"Intelligent insights.\nEvery single show.",
      desc:"After every show, Streamlive analyzes your performance and surfaces 6 prioritized recommendations with confidence scores. Which buyers are about to churn. Which products underperformed vs their projected score. Why Thursday shows outperform by $900. What your YouTube audience converts at vs TikTok. Each insight links directly to the action that addresses it: a targeted campaign, a win-back flow, or a product adjustment for next time.",
      color:'#a78bfa',
      stats:[{ label:'Insights/show', value:'6+' },{ label:'Avg confidence', value:'83%' },{ label:'Data sources', value:'5' }],
      side:'right',
    },
  ]

  const FAQS = [
    { q:'How does YouTube Live attribution work?', a:"YouTube doesn't expose buyer data directly, so Streamlive uses Live Pixel, a lightweight JavaScript snippet you install on your Shopify store. When a viewer clicks from your stream to your site, Live Pixel assigns a session ID that follows them through checkout. Orders are matched to your show with 99% accuracy, compared to 55–64% via time-window guessing or 82% via UTM links." },
    { q:'What platforms do you support?', a:'Whatnot, TikTok Shop, Instagram Live, Amazon Live, and YouTube Live. You can stream to all five simultaneously from the Show Planner, and manage buyers from all platforms in one unified CRM. Your Show History cards display every platform you were live on for each show, so multi-stream shows display all platform badges, not just one.' },
    { q:'How does buyer importing work?', a:"Connect your Whatnot, TikTok, Instagram, or Amazon account and we pull your entire buyer history: names, handles, spend, and orders. It happens automatically. It takes under 2 minutes and your data is live immediately. YouTube buyers are attributed via Live Pixel after your first show." },
    { q:'Do I need a separate OBS license for Production?', a:"No. OBS is free and open source. Streamlive connects to OBS via its official WebSocket v5 API. You install OBS once and Streamlive controls it. Sony Camera Remote SDK access requires a developer registration with Sony. We walk you through the setup." },
    { q:"What's the difference between Growth and Pro?", a:'Growth gives you the full CRM, Live Companion across all 5 platforms, Analytics, Loyalty Hub, ManyChat automation, and AI Insights. Everything you need to run and grow your shows. Pro adds the Production suite (multi-camera, lighting, and OBS control), higher SMS volume, multi-shop TikTok support, and cross-platform buyer identity matching.' },
    { q:'Can I white label this for my clients?', a:'Yes. The Enterprise plan includes white labeling under your domain, custom branding, and multi-seller network management. It is built for agencies running shows for multiple brands simultaneously.' },
  ]

  const annualDiscount = 0.17

  const MOBILE_CSS = `
    .nav-links         { display:flex; }
    .nav-hamburger     { display:none; }
    .mobile-menu       { display:none; }
    .mobile-menu.open  { display:flex; flex-direction:column; }
    .hero-wrap         { padding:72px 24px 56px; }
    .hero-input-row    { flex-direction:row; }
    .hero-input        { width:300px; }
    .hero-platforms    { gap:8px; }
    .stats-grid        { grid-template-columns:repeat(4,1fr); }
    .stat-divider      { border-right:1px solid #14142a; }
    .preview-wrap      { padding:72px 40px 0; }
    .features-section  { padding:88px 40px 0; }
    .features-grid     { grid-template-columns:repeat(3,1fr); }
    .spotlight-section { padding:88px 40px 0; }
    .spotlight-grid    { grid-template-columns:1fr 1fr; gap:56px; }
    .spotlight-text    { order:inherit; }
    .spotlight-mockup  { order:inherit; }
    .pricing-section   { padding:96px 40px 0; }
    .pricing-grid      { grid-template-columns:repeat(4,1fr); gap:12px; }
    .enterprise-row    { flex-direction:row; }
    .faq-section       { padding:88px 40px 0; }
    .cta-section       { padding:88px 40px 80px; }
    .cta-btns          { flex-direction:row; }
    .footer-grid       { grid-template-columns:1fr 1fr 1fr 1fr; gap:32px; }
    .footer-inner      { padding:36px 40px; }

    @media (max-width: 860px) {
      .pricing-grid    { grid-template-columns:repeat(2,1fr); }
    }
    @media (max-width: 700px) {
      .nav-links       { display:none; }
      .nav-hamburger   { display:flex; }
      .hero-wrap       { padding:56px 20px 44px; }
      .hero-input-row  { flex-direction:column; align-items:stretch; }
      .hero-input      { width:100%; }
      .hero-platforms  { gap:6px; flex-wrap:wrap; }
      .stats-grid      { grid-template-columns:repeat(2,1fr); }
      .stat-divider    { border-right:none; }
      .stat-item       { border-bottom:1px solid #14142a; padding-bottom:20px !important; }
      .stat-item:nth-child(3), .stat-item:nth-child(4) { border-bottom:none; }
      .preview-wrap    { padding:56px 20px 0; }
      .features-section { padding:64px 20px 0; }
      .features-grid   { grid-template-columns:1fr; gap:10px; }
      .spotlight-section { padding:64px 20px 0; }
      .spotlight-grid  { grid-template-columns:1fr; gap:32px; }
      .spotlight-text  { order:2 !important; }
      .spotlight-mockup { order:1 !important; }
      .pricing-section { padding:64px 20px 0; }
      .pricing-grid    { grid-template-columns:1fr; gap:16px; }
      .enterprise-row  { flex-direction:column; gap:16px; }
      .faq-section     { padding:64px 20px 0; }
      .cta-section     { padding:64px 20px 64px; }
      .cta-btns        { flex-direction:column; align-items:stretch; }
      .cta-btns button { width:100%; }
      .footer-grid     { grid-template-columns:1fr 1fr; gap:28px; }
      .footer-inner    { padding:28px 20px; }
    }
    @media (max-width: 420px) {
      .footer-grid     { grid-template-columns:1fr; gap:24px; }
      .pricing-grid    { gap:12px; }
    }
  `

  return (
    <>
      <style>{FONT}</style><style>{GLOBAL_CSS}</style>
      <style>{MOBILE_CSS}</style>
      <style>{`
        .section-label { font-size:10px; font-weight:800; letter-spacing:.12em; text-transform:uppercase; color:#a78bfa; margin-bottom:14px; display:block; }
        .gradient-text { background:linear-gradient(135deg,#7c3aed,#a78bfa 50%,#ec4899); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
        .divider-glow  { height:1px; background:linear-gradient(90deg,transparent 0%,#7c3aed44 30%,#a78bfa55 50%,#7c3aed44 70%,transparent 100%); margin:0 auto; max-width:800px; }
        .toggle-pill   { display:inline-flex; background:#0d0d1e; border:1px solid #1e1e3a; border-radius:99px; padding:4px; gap:4px; }
        .toggle-opt    { font-size:12px; font-weight:600; padding:6px 18px; border-radius:99px; border:none; cursor:pointer; transition:all .15s; }
        .check-include { color:#10b981; font-size:11px; margin-top:1px; flex-shrink:0; }
        .check-exclude { color:#374151; font-size:11px; margin-top:1px; flex-shrink:0; }
        .yt-badge      { display:inline-flex; align-items:center; gap:5px; background:#ff000015; border:1px solid #ff000033; border-radius:99px; padding:3px 10px; }
        .pixel-badge   { display:inline-flex; align-items:center; gap:5px; background:#10b98115; border:1px solid #10b98133; border-radius:99px; padding:3px 10px; }
      `}</style>

      <div style={{ minHeight:'100vh', background:'#06060e', overflowY:'auto', overflowX:'hidden' }}>

        {/* ── NAV ──────────────────────────────────────────────────────────── */}
        <nav style={{ position:'sticky', top:0, zIndex:50, background:'#06060eee', backdropFilter:'blur(16px)', borderBottom:'1px solid #14142a', padding:'0 24px', height:58, display:'flex', alignItems:'center', gap:12 }}>
          <button onClick={()=>navigate('/')} style={{ display:'flex', alignItems:'center', gap:9, background:'none', border:'none', cursor:'pointer', padding:0, flexShrink:0 }}>
            <div style={{ width:30, height:30, borderRadius:9, background:'linear-gradient(135deg,#7c3aed,#4f46e5)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, fontWeight:900, color:'#fff', boxShadow:'0 2px 12px rgba(124,58,237,.4)' }}>S</div>
            <span style={{ fontFamily:"'Syne',sans-serif", fontSize:17, fontWeight:800, color:'#fff', letterSpacing:'-0.3px' }}>Streamlive</span>
          </button>
          <div style={{ flex:1 }} />
          <div className="nav-links" style={{ alignItems:'center', gap:20 }}>
            <a href="#features" style={{ fontSize:13, color:'#6b7280', textDecoration:'none', fontWeight:500 }} onClick={e=>{e.preventDefault();document.getElementById('features')?.scrollIntoView({behavior:'smooth'})}}>Features</a>
            <a href="#pricing"  style={{ fontSize:13, color:'#6b7280', textDecoration:'none', fontWeight:500 }} onClick={e=>{e.preventDefault();document.getElementById('pricing')?.scrollIntoView({behavior:'smooth'})}}>Pricing</a>
            <button onClick={()=>openDemo()} className="cta-btn" style={{ background:'linear-gradient(135deg,#7c3aed,#4f46e5)', border:'none', color:'#fff', fontSize:12, fontWeight:700, padding:'7px 18px', borderRadius:8, cursor:'pointer' }}>Open App →</button>
          </div>
          <button className="nav-hamburger" onClick={()=>setMenuOpen(m=>!m)} style={{ background:'none', border:'1px solid #1e1e3a', borderRadius:8, color:'#9ca3af', padding:'6px 10px', cursor:'pointer', fontSize:16, display:'none', alignItems:'center', justifyContent:'center' }}>
            {menuOpen ? '✕' : '☰'}
          </button>
        </nav>

        <div className={`mobile-menu${menuOpen?' open':''}`} style={{ background:'#07070f', borderBottom:'1px solid #14142a', padding:'16px 24px', gap:0, position:'sticky', top:58, zIndex:49 }}>
          <a href="#features" style={{ fontSize:14, color:'#9ca3af', textDecoration:'none', fontWeight:500, padding:'12px 0', borderBottom:'1px solid #14142a' }} onClick={e=>{e.preventDefault();setMenuOpen(false);document.getElementById('features')?.scrollIntoView({behavior:'smooth'})}}>Features</a>
          <a href="#pricing"  style={{ fontSize:14, color:'#9ca3af', textDecoration:'none', fontWeight:500, padding:'12px 0', borderBottom:'1px solid #14142a' }} onClick={e=>{e.preventDefault();setMenuOpen(false);document.getElementById('pricing')?.scrollIntoView({behavior:'smooth'})}}>Pricing</a>
          <button onClick={()=>{setMenuOpen(false);openDemo()}} className="cta-btn" style={{ background:'linear-gradient(135deg,#7c3aed,#4f46e5)', border:'none', color:'#fff', fontSize:14, fontWeight:700, padding:'12px', borderRadius:10, cursor:'pointer', marginTop:12 }}>Open App →</button>
        </div>

        {/* ── HERO ─────────────────────────────────────────────────────────── */}
        <div className="hero-wrap" style={{ maxWidth:1000, margin:'0 auto', textAlign:'center', position:'relative' }}>
          <div style={{ position:'absolute', top:40, left:'10%', width:400, height:400, borderRadius:'50%', background:'#7c3aed', opacity:0.035, filter:'blur(100px)', pointerEvents:'none' }} />
          <div style={{ position:'absolute', top:80, right:'8%', width:320, height:320, borderRadius:'50%', background:'#ff0000', opacity:0.03, filter:'blur(80px)', pointerEvents:'none' }} />

          <div className="fade-a0" style={{ display:'inline-flex', alignItems:'center', gap:8, background:'#2d1f5e44', border:'1px solid #7c3aed44', borderRadius:99, padding:'5px 16px 5px 10px', marginBottom:28 }}>
            <div style={{ width:6, height:6, borderRadius:'50%', background:'#10b981', animation:'pulse 2s infinite' }} />
            <span style={{ fontSize:11, fontWeight:700, color:'#a78bfa', letterSpacing:'0.08em', textTransform:'uppercase' }}>Now open for beta. Limited spots.</span>
          </div>

          <h1 className="fade-a1" style={{ fontFamily:"'Syne',sans-serif", fontSize:'clamp(32px,6vw,68px)', fontWeight:800, color:'#fff', lineHeight:1.06, letterSpacing:'-2px', marginBottom:16 }}>
            The Live Selling<br />
            <span className="gradient-text">Command Center.</span>
          </h1>

          <p className="fade-a2" style={{ fontFamily:"'Syne',sans-serif", fontSize:'clamp(16px,2.2vw,22px)', color:'#6b7280', lineHeight:1.5, maxWidth:600, margin:'0 auto 12px', fontWeight:700, letterSpacing:'-0.3px' }}>
            Stream everywhere. Attribute every sale. Delight every buyer.
          </p>

          <p className="fade-a2" style={{ fontSize:'clamp(13px,1.6vw,16px)', color:'#4b5563', lineHeight:1.7, maxWidth:520, margin:'0 auto 32px', fontWeight:400 }}>
            CRM, live show intelligence, YouTube Live attribution, production control, loyalty programs, and AI insights. One platform for serious live sellers.
          </p>

          <div className="fade-a3 hero-input-row" style={{ display:'flex', gap:10, justifyContent:'center', marginBottom:16, flexWrap:'wrap' }}>
            {!submitted ? (
              <>
                <input value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==='Enter'&&handleSubmit()} placeholder="your@email.com"
                  className="hero-input"
                  style={{ background:'#0d0d1e', border:'1px solid #1e1e3a', borderRadius:11, padding:'12px 18px', color:'#fff', fontSize:14, outline:'none', fontFamily:"'DM Sans',sans-serif" }} />
                <button onClick={handleSubmit} className="cta-btn"
                  style={{ background:'linear-gradient(135deg,#7c3aed,#4f46e5)', border:'none', color:'#fff', fontSize:14, fontWeight:700, padding:'12px 28px', borderRadius:11, cursor:'pointer', whiteSpace:'nowrap' }}>
                  Request Early Access →
                </button>
              </>
            ) : (
              <div style={{ display:'flex', alignItems:'center', gap:10, background:'#0a1e16', border:'1px solid #10b98144', borderRadius:11, padding:'13px 24px' }}>
                <span style={{ fontSize:16 }}>✓</span>
                <span style={{ fontSize:14, color:'#10b981', fontWeight:600 }}>You're on the list. We'll be in touch soon.</span>
              </div>
            )}
          </div>
          <p className="fade-a3" style={{ fontSize:11, color:'#3d3d6e', marginBottom:32 }}>No credit card required · Free during beta · Cancel anytime</p>

          {/* Platform pills */}
          <div className="fade-a4 hero-platforms" style={{ display:'flex', justifyContent:'center', gap:8 }}>
            {[
              {id:'WN',label:'Whatnot',    color:'#7c3aed'},
              {id:'TT',label:'TikTok',     color:'#f43f5e'},
              {id:'IG',label:'Instagram',  color:'#ec4899'},
              {id:'AM',label:'Amazon Live',color:'#f59e0b'},
              {id:'YT',label:'YouTube Live',color:'#ff0000'},
            ].map(p=>(
              <div key={p.id} style={{ display:'flex', alignItems:'center', gap:7, background:`${p.color}12`, border:`1px solid ${p.color}30`, borderRadius:99, padding:'6px 14px' }}>
                <div style={{ width:6, height:6, borderRadius:'50%', background:p.color }} />
                <span style={{ fontSize:12, fontWeight:600, color:p.color }}>{p.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── STATS STRIP ──────────────────────────────────────────────────── */}
        <div style={{ borderTop:'1px solid #14142a', borderBottom:'1px solid #14142a', background:'#07070f', marginTop:56 }}>
          <div className="stats-grid" style={{ maxWidth:900, margin:'0 auto', padding:'28px 24px', display:'grid', gap:0 }}>
            {STATS.map((s,i)=>(
              <div key={s.label} className={`stat-item${i<3?' stat-divider':''}`} style={{ textAlign:'center', padding:'8px 16px' }}>
                {s.value === 'LIVE_GMV' ? (
                  <div style={{ position:'relative' }}>
                    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:6, marginBottom:4 }}>
                      <div style={{ width:6, height:6, borderRadius:'50%', background:'#10b981', animation:'pulse 1s infinite', flexShrink:0 }} />
                      <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:26, fontWeight:700, color:'#10b981', transition:'all 0.15s ease', minWidth:90, textAlign:'left' }}>
                        ${liveGmv.toLocaleString()}
                      </div>
                    </div>
                    <div style={{ fontSize:12, fontWeight:700, color:'#a78bfa', marginBottom:2 }}>{s.label}</div>
                    <div style={{ fontSize:10, color:'#374151' }}>{s.sub}</div>
                  </div>
                ) : (
                  <>
                    <div className="stat-num" style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:26, fontWeight:700, color:'#fff', marginBottom:4 }}>{s.value}</div>
                    <div style={{ fontSize:12, fontWeight:700, color:'#a78bfa', marginBottom:2 }}>{s.label}</div>
                    <div style={{ fontSize:10, color:'#374151' }}>{s.sub}</div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── YOUTUBE LIVE CALLOUT ──────────────────────────────────────────── */}
        <div style={{ maxWidth:900, margin:'0 auto', padding:'64px 24px 0' }}>
          <div style={{ background:'linear-gradient(135deg,#0f0404,#1a0505)', border:'1px solid #ff000033', borderRadius:20, padding:'32px 36px', display:'flex', alignItems:'center', gap:28, flexWrap:'wrap', position:'relative', overflow:'hidden' }}>
            <div style={{ position:'absolute', top:-30, right:-30, width:200, height:200, borderRadius:'50%', background:'#ff0000', opacity:0.04, filter:'blur(60px)' }} />
            <div style={{ width:52, height:52, borderRadius:14, background:'#ff000018', border:'1px solid #ff000044', display:'flex', alignItems:'center', justifyContent:'center', fontSize:24, flexShrink:0 }}>🔴</div>
            <div style={{ flex:1, minWidth:240 }}>
              <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
                <span style={{ fontFamily:"'Syne',sans-serif", fontSize:18, fontWeight:800, color:'#fff', letterSpacing:'-0.3px' }}>YouTube Live: Now Fully Supported</span>
                <span style={{ fontSize:9, fontWeight:800, color:'#ff0000', background:'#ff000015', border:'1px solid #ff000033', padding:'2px 8px', borderRadius:99, textTransform:'uppercase', letterSpacing:'0.08em' }}>New</span>
              </div>
              <p style={{ fontSize:13, color:'#6b7280', lineHeight:1.7, margin:0 }}>
                Stream to your YouTube audience alongside Whatnot, TikTok, Instagram, and Amazon simultaneously. <strong style={{ color:'#9ca3af' }}>Live Pixel</strong>, our first-party attribution snippet, installs on your Shopify store in under 2 minutes and tracks every viewer from stream to purchase with <strong style={{ color:'#ff4444' }}>99% accuracy</strong>. No UTM guesswork. No time-window estimation. Every sale attributed.
              </p>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:8, flexShrink:0 }}>
              {[
                { label:'Live Pixel', sub:'99% accuracy', color:'#10b981' },
                { label:'UTM Links', sub:'82% accuracy', color:'#f59e0b' },
                { label:'Time Window', sub:'55–64%', color:'#ef4444' },
              ].map(m=>(
                <div key={m.label} style={{ display:'flex', alignItems:'center', gap:8 }}>
                  <div style={{ width:6, height:6, borderRadius:'50%', background:m.color, flexShrink:0 }} />
                  <span style={{ fontSize:11, fontWeight:600, color:'#9ca3af' }}>{m.label}</span>
                  <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:11, fontWeight:700, color:m.color, marginLeft:'auto', paddingLeft:12 }}>{m.sub}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── INTERACTIVE PREVIEW ──────────────────────────────────────────── */}
        <div className="preview-wrap" style={{ maxWidth:900, margin:'0 auto' }}>
          <div style={{ background:'linear-gradient(135deg,#0d0d1e,#12103a)', border:'1px solid #7c3aed33', borderRadius:22, padding:'36px 28px', textAlign:'center', position:'relative', overflow:'hidden' }}>
            <div style={{ position:'absolute', top:-40, right:-40, width:200, height:200, borderRadius:'50%', background:'#7c3aed', opacity:0.06, filter:'blur(60px)' }} />
            <span className="section-label">✦ Interactive Demo</span>
            <div style={{ fontFamily:"'Syne',sans-serif", fontSize:'clamp(20px,4vw,26px)', fontWeight:800, color:'#fff', marginBottom:12, letterSpacing:'-0.5px' }}>Every screen is built and working right now</div>
            <p style={{ fontSize:14, color:'#6b7280', maxWidth:520, margin:'0 auto 24px', lineHeight:1.65 }}>Buyer CRM, Live Companion with all 5 platforms, YouTube Live Pixel, analytics, production suite, loyalty hub, show planner, and more. All fully interactive.</p>
            <button onClick={()=>openDemo()} className="cta-btn" style={{ background:'linear-gradient(135deg,#7c3aed,#4f46e5)', border:'none', color:'#fff', fontSize:14, fontWeight:700, padding:'13px 32px', borderRadius:11, cursor:'pointer' }}>Open Interactive Demo →</button>
          </div>
        </div>

        {/* ── FEATURES GRID ────────────────────────────────────────────────── */}
        <div id="features" className="features-section" style={{ maxWidth:980, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:44 }}>
            <span className="section-label">Built for live sellers</span>
            <div style={{ fontFamily:"'Syne',sans-serif", fontSize:'clamp(24px,4vw,40px)', fontWeight:800, color:'#fff', letterSpacing:'-1px', marginBottom:12 }}>Everything in one platform.</div>
            <p style={{ fontSize:15, color:'#6b7280', maxWidth:500, margin:'0 auto' }}>Not another tool to manage. A single command center where every part of your live commerce business lives.</p>
          </div>
          <div className="features-grid" style={{ display:'grid', gap:12 }}>
            {FEATURES.map(f=>(
              <div key={f.label} className="feat-card" style={{ background:'#08080f', border:'1px solid #14142a', borderRadius:18, padding:'22px 20px' }}>
                <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:12 }}>
                  <div style={{ width:36, height:36, borderRadius:10, background:`${f.color}15`, border:`1px solid ${f.color}33`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:15, color:f.color, flexShrink:0 }}>{f.icon}</div>
                  <span style={{ fontSize:14, fontWeight:700, color:'#fff' }}>{f.label}</span>
                </div>
                <p style={{ fontSize:12, color:'#6b7280', lineHeight:1.7, margin:0 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── SPOTLIGHT SECTIONS ───────────────────────────────────────────── */}
        {SPOTLIGHTS.map((s,i)=>(
          <div key={i} className="spotlight-section" style={{ maxWidth:980, margin:'0 auto' }}>
            <div className="spotlight-grid" style={{ display:'grid', alignItems:'center' }}>
              <div className="spotlight-text" style={{ order:s.side==='right'?2:1 }}>
                <span style={{ fontSize:10, fontWeight:800, letterSpacing:'.14em', textTransform:'uppercase', color:s.color, display:'block', marginBottom:14 }}>{s.tag}</span>
                <div style={{ fontFamily:"'Syne',sans-serif", fontSize:'clamp(22px,3.2vw,34px)', fontWeight:800, color:'#fff', lineHeight:1.15, letterSpacing:'-1px', marginBottom:16, whiteSpace:'pre-line' }}>{s.headline}</div>
                <p style={{ fontSize:14, color:'#6b7280', lineHeight:1.75, marginBottom:24 }}>{s.desc}</p>
                <div style={{ display:'flex', gap:24, flexWrap:'wrap' }}>
                  {s.stats.map(st=>(
                    <div key={st.label}>
                      <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:22, fontWeight:700, color:s.color, marginBottom:2 }}>{st.value}</div>
                      <div style={{ fontSize:11, color:'#4b5563' }}>{st.label}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="spotlight-mockup" style={{ order:s.side==='right'?1:2 }}>
                <div style={{ background:'linear-gradient(135deg,#0a0a15,#12102a)', border:`1px solid ${s.color}22`, borderRadius:20, padding:'24px', position:'relative', overflow:'hidden' }}>
                  <div style={{ position:'absolute', top:-20, right:-20, width:160, height:160, borderRadius:'50%', background:s.color, opacity:0.05, filter:'blur(50px)' }} />
                  <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:9, color:'#374151', marginBottom:12, textTransform:'uppercase', letterSpacing:'.08em' }}>● Streamlive · {s.tag}</div>
                  {/* i=0: Plan the Show */}
                  {i===0 && (
                    <div>
                      {/* Show name */}
                      <div style={{ background:'#0d0d1e', border:'1px solid #7c3aed33', borderRadius:10, padding:'11px 14px', marginBottom:8 }}>
                        <div style={{ fontSize:9, color:'#4b5563', marginBottom:5, textTransform:'uppercase', letterSpacing:'0.08em' }}>Show Name</div>
                        <div style={{ fontSize:13, fontWeight:700, color:'#fff' }}>Friday Night Flash Sale ✦</div>
                      </div>
                      {/* Platform selection */}
                      <div style={{ background:'#0d0d1e', border:'1px solid #1e1e3a', borderRadius:10, padding:'11px 14px', marginBottom:8 }}>
                        <div style={{ fontSize:9, color:'#4b5563', marginBottom:7, textTransform:'uppercase', letterSpacing:'0.08em' }}>Streaming To</div>
                        <div style={{ display:'flex', gap:5, flexWrap:'wrap' }}>
                          {[['TT','#f43f5e'],['IG','#ec4899'],['AM','#f59e0b'],['YT','#ff0000']].map(([p,c])=>(
                            <div key={p} style={{ display:'flex',alignItems:'center',gap:4,background:`${c}15`,border:`1px solid ${c}44`,borderRadius:6,padding:'4px 9px' }}>
                              <div style={{ width:5,height:5,borderRadius:'50%',background:c }} />
                              <span style={{ fontSize:9,fontWeight:700,color:c }}>{p}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      {/* AI run order */}
                      <div style={{ background:'#0d0d1e', border:'1px solid #1e1e3a', borderRadius:10, padding:'11px 14px', marginBottom:8 }}>
                        <div style={{ fontSize:9, color:'#4b5563', marginBottom:7, textTransform:'uppercase', letterSpacing:'0.08em' }}>AI Run Order</div>
                        {[{n:'Silk Wrap Midi Dress',ai:9.6},{n:'Merino Wool Blazer',ai:9.4},{n:'Spring Style Bundle',ai:9.2}].map((p,pi)=>(
                          <div key={p.n} style={{ display:'flex',alignItems:'center',gap:8,marginBottom:5 }}>
                            <span style={{ fontSize:9,fontWeight:800,color:'#374151',width:12 }}>{pi+1}</span>
                            <span style={{ fontSize:10,color:'#d1d5db',flex:1 }}>{p.n}</span>
                            <span style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:'#7c3aed' }}>{p.ai}</span>
                          </div>
                        ))}
                      </div>
                      {/* Perks */}
                      <div style={{ background:'#0d0d1e', border:'1px solid #1e1e3a', borderRadius:10, padding:'11px 14px' }}>
                        <div style={{ fontSize:9, color:'#4b5563', marginBottom:7, textTransform:'uppercase', letterSpacing:'0.08em' }}>Show Perks</div>
                        {[{label:'First order 10% off',active:true},{label:'VIP early access (5 min)',active:true},{label:'Bundle unlock at $150+',active:false}].map(pk=>(
                          <div key={pk.label} style={{ display:'flex',alignItems:'center',gap:7,marginBottom:5 }}>
                            <div style={{ width:14,height:14,borderRadius:4,background:pk.active?'#7c3aed18':'#1e1e3a',border:`1px solid ${pk.active?'#7c3aed55':'#374151'}`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0 }}>
                              {pk.active && <span style={{ fontSize:8,color:'#a78bfa' }}>✓</span>}
                            </div>
                            <span style={{ fontSize:10,color:pk.active?'#d1d5db':'#374151' }}>{pk.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {/* i=1: Before the Show - Production */}
                  {i===1 && (
                    <div>
                      {/* Camera feeds */}
                      <div style={{ background:'#0d0d1e', border:'1px solid #f59e0b22', borderRadius:10, padding:'11px 14px', marginBottom:8 }}>
                        <div style={{ fontSize:9, color:'#4b5563', marginBottom:7, textTransform:'uppercase', letterSpacing:'0.08em' }}>Camera Feeds</div>
                        <div style={{ display:'flex', gap:7 }}>
                          {[{label:'Sony FX3',sub:'Wide · LIVE',active:true},{label:'Sony FX6',sub:'Close-up',active:false}].map(cam=>(
                            <div key={cam.label} style={{ flex:1, background:cam.active?'#0a1e0a':'#0d0d1e', border:`1px solid ${cam.active?'#10b98144':'#1e1e3a'}`, borderRadius:8, padding:'8px 10px' }}>
                              <div style={{ display:'flex',alignItems:'center',gap:5,marginBottom:3 }}>
                                <div style={{ width:5,height:5,borderRadius:'50%',background:cam.active?'#10b981':'#374151',animation:cam.active?'pulse 1s infinite':undefined }} />
                                <span style={{ fontSize:9,fontWeight:700,color:cam.active?'#10b981':'#4b5563' }}>{cam.label}</span>
                              </div>
                              <div style={{ fontSize:8,color:'#4b5563' }}>{cam.sub}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                      {/* Lighting */}
                      <div style={{ background:'#0d0d1e', border:'1px solid #f59e0b22', borderRadius:10, padding:'11px 14px', marginBottom:8 }}>
                        <div style={{ fontSize:9, color:'#4b5563', marginBottom:7, textTransform:'uppercase', letterSpacing:'0.08em' }}>Lighting</div>
                        {[{name:'Elgato Key Light',brand:'Elgato',pct:100,temp:'5600K'},{name:'Aputure 300d Fill',brand:'Aputure',pct:65,temp:'4200K'},{name:'Godox Background',brand:'Godox',pct:40,temp:'3200K'}].map(light=>(
                          <div key={light.name} style={{ display:'flex',alignItems:'center',gap:8,marginBottom:6 }}>
                            <span style={{ fontSize:10 }}>💡</span>
                            <div style={{ flex:1,minWidth:0 }}>
                              <div style={{ display:'flex',justifyContent:'space-between',marginBottom:3 }}>
                                <span style={{ fontSize:9,fontWeight:600,color:'#d1d5db' }}>{light.name}</span>
                                <span style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:'#f59e0b' }}>{light.pct}%</span>
                              </div>
                              <div style={{ height:3,background:'#1e1e3a',borderRadius:2 }}>
                                <div style={{ height:3,width:`${light.pct}%`,background:'linear-gradient(90deg,#f59e0b,#fbbf24)',borderRadius:2 }} />
                              </div>
                            </div>
                            <span style={{ fontSize:8,color:'#4b5563',fontFamily:"'JetBrains Mono',monospace" }}>{light.temp}</span>
                          </div>
                        ))}
                      </div>
                      {/* OBS Scenes */}
                      <div style={{ background:'#0d0d1e', border:'1px solid #f59e0b22', borderRadius:10, padding:'11px 14px' }}>
                        <div style={{ fontSize:9, color:'#4b5563', marginBottom:7, textTransform:'uppercase', letterSpacing:'0.08em' }}>OBS Scenes</div>
                        {[{scene:'Product Reveal',active:true},{scene:'Close-Up Shot',active:false},{scene:'Wide Room View',active:false}].map(sc=>(
                          <div key={sc.scene} style={{ display:'flex',alignItems:'center',gap:7,padding:'6px 8px',background:sc.active?'#f59e0b10':'transparent',border:`1px solid ${sc.active?'#f59e0b33':'transparent'}`,borderRadius:6,marginBottom:4 }}>
                            <div style={{ width:5,height:5,borderRadius:'50%',background:sc.active?'#f59e0b':'#374151',flexShrink:0 }} />
                            <span style={{ fontSize:10,color:sc.active?'#fff':'#4b5563',fontWeight:sc.active?600:400 }}>{sc.scene}</span>
                            {sc.active && <span style={{ marginLeft:'auto',fontSize:8,fontWeight:700,color:'#f59e0b',background:'#f59e0b15',padding:'1px 6px',borderRadius:3 }}>LIVE</span>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {/* i=2: During the Show - Live Companion */}
                  {i===2 && (
                    <div>
                      {/* 5-platform live badges */}
                      <div style={{ display:'flex', gap:5, marginBottom:12, flexWrap:'wrap' }}>
                        {[['WN','#7c3aed',312],['TT','#f43f5e',891],['IG','#ec4899',445],['AM','#f59e0b',156],['YT','#ff0000',4200]].map(([p,c,v])=>(
                          <div key={p} style={{ flex:1, minWidth:40, background:`${c}12`, border:`1px solid ${c}33`, borderRadius:8, padding:'7px 4px', textAlign:'center' }}>
                            <div style={{ width:5,height:5,borderRadius:'50%',background:c,margin:'0 auto 4px',animation:'pulse 1s infinite' }} />
                            <div style={{ fontSize:8,fontWeight:800,color:c }}>{p}</div>
                            <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:10,fontWeight:700,color:'#fff' }}>{v.toLocaleString()}</div>
                          </div>
                        ))}
                      </div>
                      {/* GMV ticker */}
                      <div style={{ display:'flex', alignItems:'center', gap:8, background:'#0a1e1680', border:'1px solid #10b98133', borderRadius:8, padding:'8px 12px', marginBottom:10 }}>
                        <div style={{ width:6,height:6,borderRadius:'50%',background:'#10b981',animation:'pulse 1s infinite' }} />
                        <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:11, fontWeight:700, color:'#10b981' }}>$2,708 GMV</span>
                        <span style={{ fontSize:9, color:'#374151' }}>· 10 orders · live</span>
                      </div>
                      {[{n:'Marcus Duval',s:9.4,t:'VIP',c:'#f59e0b',p:'AM'},{n:'Olivia Bennett',s:9.1,t:'VIP',c:'#f59e0b',p:'IG'},{n:'Derek Huang',s:6.4,t:'New',c:'#3b82f6',p:'YT'}].map(b=>(
                        <div key={b.n} style={{ display:'flex',alignItems:'center',gap:10,padding:'9px 10px',background:'#0d0d1e',border:'1px solid #14142a',borderRadius:9,marginBottom:6 }}>
                          <div style={{ width:28,height:28,borderRadius:8,background:'#1e1e3a',display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,fontWeight:800,color:'#a78bfa',flexShrink:0 }}>{b.n.split(' ').map(w=>w[0]).join('')}</div>
                          <div style={{ flex:1 }}><div style={{ fontSize:11,fontWeight:700,color:'#fff' }}>{b.n}</div><div style={{ fontSize:9,color:'#4b5563' }}>Score {b.s}</div></div>
                          <span style={{ fontSize:8,fontWeight:700,color:b.c,background:`${b.c}15`,border:`1px solid ${b.c}33`,padding:'2px 6px',borderRadius:4 }}>{b.t}</span>
                          <span style={{ fontSize:8,fontWeight:700,color:({AM:'#f59e0b',IG:'#ec4899',YT:'#ff0000'})[b.p]||'#7c3aed',background:'#14142a',padding:'1px 5px',borderRadius:3 }}>{b.p}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {/* i=3: After the Show - AI Insights */}
                  {i===3 && (
                    <div>
                      {[
                        {icon:'💰',pri:'HIGH',title:'YouTube viewers convert 2.1× vs TikTok',impact:'+$3,400 potential',conf:89,c:'#10b981'},
                        {icon:'⚠️',pri:'HIGH',title:'3 at-risk buyers: re-engage now',impact:'$680 at stake',conf:84,c:'#f59e0b'},
                        {icon:'📊',pri:'MED',title:'Thursday shows outperform by +$900',impact:'Schedule more Thurs',conf:82,c:'#a78bfa'},
                        {icon:'🎯',pri:'MED',title:'Live Pixel capturing 99% of YT sales',impact:'14 orders attributed',conf:97,c:'#ff0000'},
                      ].map(ins=>(
                        <div key={ins.title} style={{ padding:'9px 10px',background:'#0d0d1e',border:`1px solid ${ins.c}22`,borderRadius:9,marginBottom:7,display:'flex',gap:10,alignItems:'flex-start' }}>
                          <div style={{ width:26,height:26,borderRadius:7,background:`${ins.c}15`,border:`1px solid ${ins.c}33`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,flexShrink:0 }}>{ins.icon}</div>
                          <div style={{ flex:1, minWidth:0 }}>
                            <div style={{ display:'flex',gap:6,alignItems:'center',marginBottom:2 }}>
                              <span style={{ fontSize:8,fontWeight:800,color:ins.c==='#10b981'?'#ef4444':ins.c,textTransform:'uppercase' }}>{ins.pri}</span>
                              <span style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:'#a78bfa' }}>{ins.conf}%</span>
                            </div>
                            <div style={{ fontSize:10,fontWeight:700,color:'#fff',marginBottom:2 }}>{ins.title}</div>
                            <div style={{ fontSize:9,color:'#10b981',fontWeight:600 }}>{ins.impact}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* ── PRICING ──────────────────────────────────────────────────────── */}
        <div id="pricing" className="pricing-section" style={{ maxWidth:1040, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:44 }}>
            <span className="section-label">Pricing</span>
            <div style={{ fontFamily:"'Syne',sans-serif", fontSize:'clamp(24px,4vw,40px)', fontWeight:800, color:'#fff', letterSpacing:'-1px', marginBottom:12 }}>Start free. Scale confidently.</div>
            <p style={{ fontSize:14, color:'#6b7280', marginBottom:24 }}>Free during beta. Paid plans launch at MVP. No contracts, no surprises.</p>
            <div className="toggle-pill">
              <button className="toggle-opt" onClick={()=>setBillingCycle('monthly')} style={{ background:billingCycle==='monthly'?'#1e1e3a':'transparent', color:billingCycle==='monthly'?'#fff':'#4b5563' }}>Monthly</button>
              <button className="toggle-opt" onClick={()=>setBillingCycle('annual')} style={{ background:billingCycle==='annual'?'#1e1e3a':'transparent', color:billingCycle==='annual'?'#fff':'#4b5563', display:'flex', alignItems:'center', gap:6 }}>
                Annual
                <span style={{ fontSize:10, fontWeight:700, color:'#10b981', background:'#0a1e16', border:'1px solid #10b98133', padding:'1px 7px', borderRadius:99 }}>Save 17%</span>
              </button>
            </div>
          </div>

          <div className="pricing-grid" style={{ display:'grid' }}>
            {Object.values(PLANS).map(p=>{
              const displayPrice = billingCycle==='annual' ? Math.round(p.price*(1-annualDiscount)) : p.price
              const isEnt = p.id==='enterprise'
              return (
                <div key={p.id} className="plan-card" style={{ background:p.popular?'linear-gradient(180deg,#1a1030,#0e0b1e)':isEnt?'linear-gradient(180deg,#0f0a1e,#080810)':'#08080f', border:`1px solid ${p.popular?p.color+'66':isEnt?p.color+'44':'#14142a'}`, borderRadius:18, padding:'24px 20px', position:'relative', display:'flex', flexDirection:'column' }}>
                  {p.popular && <div style={{ position:'absolute', top:-11, left:'50%', transform:'translateX(-50%)', background:'linear-gradient(135deg,#7c3aed,#4f46e5)', color:'#fff', fontSize:9, fontWeight:800, padding:'3px 14px', borderRadius:99, textTransform:'uppercase', letterSpacing:'0.08em', whiteSpace:'nowrap', boxShadow:'0 2px 12px rgba(124,58,237,.4)' }}>Most Popular</div>}
                  {isEnt && <div style={{ position:'absolute', top:-11, left:'50%', transform:'translateX(-50%)', background:'linear-gradient(135deg,#4c1d95,#7c3aed)', color:'#e9d5ff', fontSize:9, fontWeight:800, padding:'3px 14px', borderRadius:99, textTransform:'uppercase', letterSpacing:'0.08em', whiteSpace:'nowrap' }}>For Teams</div>}
                  <div style={{ marginBottom:18 }}>
                    <div style={{ fontSize:18, marginBottom:6 }}>{p.emoji}</div>
                    <span style={{ fontSize:10, fontWeight:800, color:p.color, textTransform:'uppercase', letterSpacing:'.1em', display:'block', marginBottom:6 }}>{p.name}</span>
                    {isEnt ? (
                      <div style={{ marginBottom:4 }}>
                        <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:22, fontWeight:700, color:'#a78bfa', lineHeight:1 }}>Custom pricing</span>
                        <div style={{ fontSize:10, color:'#6b7280', marginTop:4 }}>Tailored to your team size & needs</div>
                      </div>
                    ) : (
                      <>
                        <div style={{ display:'flex', alignItems:'flex-end', gap:4, marginBottom:4 }}>
                          <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:28, fontWeight:700, color:'#fff', lineHeight:1 }}>${displayPrice}</span>
                          <span style={{ fontSize:12, color:'#4b5563', paddingBottom:2 }}>/mo</span>
                        </div>
                        {billingCycle==='annual' && <div style={{ fontSize:10, color:'#10b981', fontWeight:600 }}>↓ ${p.price-displayPrice}/mo savings</div>}
                      </>
                    )}
                    <div style={{ fontSize:11, color:'#374151', marginTop:5, lineHeight:1.5 }}>{p.tagline}</div>
                  </div>
                  <div style={{ flex:1, marginBottom:18 }}>
                    {p.features.map(f=>(
                      <div key={f} style={{ display:'flex', gap:8, marginBottom:6, alignItems:'flex-start' }}>
                        <span className="check-include">✓</span>
                        <span style={{ fontSize:11, color:'#9ca3af', lineHeight:1.55 }}>{f}</span>
                      </div>
                    ))}
                    {p.notIncluded&&p.notIncluded.length>0 && (
                      <div style={{ marginTop:10, paddingTop:10, borderTop:'1px solid #14142a' }}>
                        {p.notIncluded.map(f=>(
                          <div key={f} style={{ display:'flex', gap:8, marginBottom:5, alignItems:'flex-start' }}>
                            <span className="check-exclude">✕</span>
                            <span style={{ fontSize:11, color:'#374151', lineHeight:1.55 }}>{f}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  {p.contactSales ? (
                    <button onClick={openSales} className="cta-btn" style={{ width:'100%', background:`${p.color}18`, border:`1px solid ${p.color}44`, color:p.color, fontSize:12, fontWeight:700, padding:'11px', borderRadius:10, cursor:'pointer' }}>Contact Sales →</button>
                  ) : (
                    <button onClick={()=>navigate(`/checkout?plan=${p.id}`)} className="cta-btn"
                      style={{ width:'100%', background:p.popular?'linear-gradient(135deg,#7c3aed,#4f46e5)':`${p.color}18`, border:`1px solid ${p.color}44`, color:p.popular?'#fff':p.color, fontSize:12, fontWeight:700, padding:'11px', borderRadius:10, cursor:'pointer' }}>
                      {p.popular?`Start Growth for $${displayPrice}/mo →`:`Get ${p.name} for $${displayPrice}/mo →`}
                    </button>
                  )}
                  <div style={{ fontSize:10, color:'#374151', textAlign:'center', marginTop:8 }}>{p.billing}</div>
                </div>
              )
            })}
          </div>

          <div className="enterprise-row" style={{ marginTop:20, background:'linear-gradient(135deg,#0f0a1e,#12102a)', border:'1px solid #7c3aed33', borderRadius:16, padding:'24px', display:'flex', alignItems:'center', gap:20, flexWrap:'wrap' }}>
            <div style={{ width:44, height:44, borderRadius:12, background:'#2d1f5e44', border:'1px solid #7c3aed44', display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, flexShrink:0 }}>🏢</div>
            <div style={{ flex:1, minWidth:180 }}>
              <div style={{ fontSize:15, fontWeight:700, color:'#fff', marginBottom:4 }}>Running an agency or seller network?</div>
              <div style={{ fontSize:13, color:'#6b7280' }}>Enterprise includes white labeling, unlimited team seats, dedicated support, and custom integrations.</div>
            </div>
            <button onClick={openSales} className="cta-btn" style={{ background:'linear-gradient(135deg,#4c1d95,#7c3aed)', border:'none', color:'#fff', fontSize:13, fontWeight:700, padding:'11px 24px', borderRadius:10, cursor:'pointer', whiteSpace:'nowrap' }}>Talk to Sales →</button>
          </div>
        </div>

        {/* ── FAQ ──────────────────────────────────────────────────────────── */}
        <div className="faq-section" style={{ maxWidth:720, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:40 }}>
            <span className="section-label">FAQ</span>
            <div style={{ fontFamily:"'Syne',sans-serif", fontSize:'clamp(22px,3.5vw,34px)', fontWeight:800, color:'#fff', letterSpacing:'-0.8px' }}>Common questions</div>
          </div>
          {FAQS.map((f,i)=>(
            <div key={i} style={{ borderBottom:'1px solid #14142a' }}>
              <button onClick={()=>setFaqOpen(faqOpen===i?null:i)} style={{ width:'100%', display:'flex', justifyContent:'space-between', alignItems:'center', padding:'18px 0', background:'none', border:'none', cursor:'pointer', textAlign:'left', gap:16 }}>
                <span style={{ fontSize:14, fontWeight:600, color:faqOpen===i?'#fff':'#9ca3af' }}>{f.q}</span>
                <span style={{ fontSize:18, color:'#4b5563', flexShrink:0, transform:faqOpen===i?'rotate(45deg)':'none', transition:'transform .2s', lineHeight:1 }}>+</span>
              </button>
              {faqOpen===i && <div style={{ paddingBottom:18, fontSize:13, color:'#6b7280', lineHeight:1.75 }}>{f.a}</div>}
            </div>
          ))}
        </div>

        {/* ── FINAL CTA ────────────────────────────────────────────────────── */}
        <div className="cta-section" style={{ maxWidth:800, margin:'0 auto', textAlign:'center' }}>
          <div className="divider-glow" style={{ marginBottom:56 }} />
          <span className="section-label">Get started</span>
          <div style={{ fontFamily:"'Syne',sans-serif", fontSize:'clamp(26px,4.5vw,48px)', fontWeight:800, color:'#fff', letterSpacing:'-1.5px', lineHeight:1.1, marginBottom:16 }}>
            Stream everywhere.<br/>Attribute every sale.<br/><span className="gradient-text">Delight every buyer.</span>
          </div>
          <p style={{ fontSize:15, color:'#6b7280', marginBottom:32, lineHeight:1.65 }}>Join the beta and get full access while we build. Every platform, every feature, your feedback shapes what's next.</p>
          <div className="cta-btns" style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap' }}>
            <button onClick={()=>navigate('/checkout?plan=growth')} className="cta-btn" style={{ background:'linear-gradient(135deg,#7c3aed,#4f46e5)', border:'none', color:'#fff', fontSize:14, fontWeight:700, padding:'13px 32px', borderRadius:11, cursor:'pointer' }}>
              Start with Growth →
            </button>
            <button onClick={()=>openDemo()} className="cta-btn" style={{ background:'#0d0d1e', border:'1px solid #1e1e3a', color:'#9ca3af', fontSize:14, fontWeight:600, padding:'13px 28px', borderRadius:11, cursor:'pointer' }}>
              Explore the demo
            </button>
          </div>
        </div>

        {/* ── FOOTER ───────────────────────────────────────────────────────── */}
        <footer style={{ borderTop:'1px solid #14142a', background:'#07070f' }}>
          <div className="footer-inner" style={{ maxWidth:980, margin:'0 auto' }}>
            <div className="footer-grid" style={{ display:'grid', marginBottom:32 }}>
              <div>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:14 }}>
                  <div style={{ width:26, height:26, borderRadius:8, background:'linear-gradient(135deg,#7c3aed,#4f46e5)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:900, color:'#fff' }}>S</div>
                  <span style={{ fontFamily:"'Syne',sans-serif", fontSize:15, fontWeight:800, color:'#fff' }}>Streamlive</span>
                </div>
                <p style={{ fontSize:12, color:'#374151', lineHeight:1.7, margin:0 }}>The live selling command center. Stream everywhere, attribute every sale, and delight every buyer across all 5 platforms.</p>
              </div>
              <div>
                <div style={{ fontSize:11, fontWeight:700, color:'#6b7280', textTransform:'uppercase', letterSpacing:'.08em', marginBottom:14 }}>Product</div>
                {[
                  {label:'Features', action:()=>document.getElementById('features')?.scrollIntoView({behavior:'smooth'})},
                  {label:'Pricing',  action:()=>document.getElementById('pricing')?.scrollIntoView({behavior:'smooth'})},
                  {label:'Changelog',action:()=>navigate('/changelog')},
                  {label:'Roadmap',  action:()=>navigate('/roadmap')},
                ].map(({label,action})=>(
                  <div key={label} onClick={action} className="footer-link-hover" style={{ fontSize:13, color:'#374151', marginBottom:8, cursor:'pointer', transition:'color .15s' }}>{label}</div>
                ))}
              </div>
              <div>
                <div style={{ fontSize:11, fontWeight:700, color:'#6b7280', textTransform:'uppercase', letterSpacing:'.08em', marginBottom:14 }}>Platforms</div>
                {[['Whatnot','whatnot'],['TikTok Shop','tiktok'],['Instagram Live','instagram'],['Amazon Live','amazon'],['YouTube Live','youtube']].map(([l,slug])=>(
                  <div key={l} onClick={()=>navigate(`/platform/${slug}`)} style={{ fontSize:13, color:'#374151', marginBottom:8, cursor:'pointer', transition:'color .15s' }} onMouseEnter={e=>e.target.style.color='#9ca3af'} onMouseLeave={e=>e.target.style.color='#374151'}>{l}</div>
                ))}
              </div>
              <div>
                <div style={{ fontSize:11, fontWeight:700, color:'#6b7280', textTransform:'uppercase', letterSpacing:'.08em', marginBottom:14 }}>Company</div>
                {[
                  {label:'About',           path:'/about'},
                  {label:'Blog',            path:'/blog'},
                  {label:'Privacy Policy',  path:'/privacy'},
                  {label:'Terms of Service',path:'/terms'},
                  {label:'Contact',         path:'/contact'},
                ].map(({label,path})=>(
                  <div key={label} onClick={()=>navigate(path)} className="footer-link-hover" style={{ fontSize:13, color:'#374151', marginBottom:8, cursor:'pointer', transition:'color .15s' }}>{label}</div>
                ))}
              </div>
            </div>
            <div style={{ borderTop:'1px solid #0d0d1a', paddingTop:20, display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:10 }}>
              <span style={{ fontSize:11, color:'#1e1e3a' }}>© 2025 Streamlive. All rights reserved.</span>
              <span style={{ fontSize:11, color:'#1e1e3a', fontFamily:"'JetBrains Mono',monospace" }}>strmlive.com</span>
            </div>
          </div>
        </footer>

      </div>
      {/* ── DEMO EMAIL GATE MODAL ── */}
      {demoModal && (
        <div onClick={e=>{ if(e.target===e.currentTarget) setDemoModal(false) }} style={{ position:'fixed', inset:0, background:'rgba(4,4,18,.88)', backdropFilter:'blur(14px)', zIndex:2000, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
          <div style={{ background:'linear-gradient(160deg,#0d0d1e,#0a0a16)', border:'1px solid #2a2a4a', borderRadius:22, padding:'40px 36px', maxWidth:420, width:'100%', position:'relative', boxShadow:'0 40px 100px rgba(0,0,0,.9)' }}>
            <button onClick={()=>setDemoModal(false)} style={{ position:'absolute', top:16, right:18, background:'none', border:'none', color:'#4b5563', fontSize:20, cursor:'pointer', lineHeight:1, padding:'4px 8px' }}>✕</button>
            <div style={{ position:'absolute', top:-60, left:'50%', transform:'translateX(-50%)', width:200, height:200, borderRadius:'50%', background:'#7c3aed', opacity:0.07, filter:'blur(60px)', pointerEvents:'none' }}/>
            {demoEmailSent ? (
              <div style={{ textAlign:'center', padding:'20px 0' }}>
                <div style={{ fontSize:52, marginBottom:16 }}>🚀</div>
                <div style={{ fontFamily:"'Syne',sans-serif", fontSize:24, fontWeight:800, color:'#fff', marginBottom:8 }}>You're in!</div>
                <div style={{ fontSize:14, color:'#6b7280' }}>Opening the demo now…</div>
              </div>
            ) : (
              <div>
                <div style={{ textAlign:'center', marginBottom:28 }}>
                  <div style={{ width:56, height:56, borderRadius:16, background:'linear-gradient(135deg,#7c3aed22,#4f46e522)', border:'1px solid #7c3aed44', display:'flex', alignItems:'center', justifyContent:'center', fontSize:26, margin:'0 auto 16px' }}>🚀</div>
                  <div style={{ fontFamily:"'Syne',sans-serif", fontSize:22, fontWeight:800, color:'#fff', letterSpacing:'-0.4px', marginBottom:8 }}>Try the interactive demo</div>
                  <div style={{ fontSize:13, color:'#6b7280', lineHeight:1.65 }}>Enter your email to get full access. No credit card needed.</div>
                </div>
                <div style={{ background:'#07070f', border:'1px solid #14142a', borderRadius:12, padding:'12px 16px', marginBottom:20 }}>
                  {[['◉','Buyer CRM across all platforms'],['◈','Live Companion & real-time show data'],['◑','Analytics & AI Insights'],['◆','Show Planner + Production Suite']].map(([icon,label]) => (
                    <div key={label} style={{ display:'flex', alignItems:'center', gap:10, padding:'6px 0', borderBottom:'1px solid #0d0d1a' }}>
                      <span style={{ fontSize:13, color:'#7c3aed', flexShrink:0 }}>{icon}</span>
                      <span style={{ fontSize:13, color:'#9ca3af' }}>{label}</span>
                    </div>
                  ))}
                </div>
                <input
                  type="email"
                  value={demoEmail}
                  onChange={e=>setDemoEmail(e.target.value)}
                  onKeyDown={e=>{ if(e.key==='Enter') submitDemoEmail() }}
                  placeholder="your@email.com"
                  autoFocus
                  style={{ width:'100%', background:'#0a0a18', border:'1px solid #2a2a4a', borderRadius:10, padding:'13px 14px', color:'#fff', fontSize:14, outline:'none', boxSizing:'border-box', fontFamily:"'DM Sans',sans-serif", marginBottom:12 }}
                />
                <button
                  onClick={submitDemoEmail}
                  style={{ width:'100%', background: demoEmail.includes('@') ? 'linear-gradient(135deg,#7c3aed,#4f46e5)' : '#141428', border:'none', color: demoEmail.includes('@') ? '#fff' : '#374151', fontSize:14, fontWeight:700, padding:'14px', borderRadius:10, cursor: demoEmail.includes('@') ? 'pointer' : 'default', transition:'all .15s' }}
                >
                  Open the Demo →
                </button>
                <div style={{ fontSize:11, color:'#374151', textAlign:'center', marginTop:10 }}>No spam. Occasional product updates only.</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── CONTACT SALES MODAL ── */}
      {salesModal && (
        <div onClick={e=>{ if(e.target===e.currentTarget) setSalesModal(false) }} style={{ position:'fixed', inset:0, background:'rgba(4,4,18,.88)', backdropFilter:'blur(14px)', zIndex:2000, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
          <div style={{ background:'linear-gradient(160deg,#0d0d1e,#0a0a16)', border:'1px solid #2a2a4a', borderRadius:22, padding:'40px 36px', maxWidth:440, width:'100%', position:'relative', boxShadow:'0 40px 100px rgba(0,0,0,.9)' }}>
            <button onClick={()=>setSalesModal(false)} style={{ position:'absolute', top:16, right:18, background:'none', border:'none', color:'#4b5563', fontSize:20, cursor:'pointer', lineHeight:1, padding:'4px 8px' }}>✕</button>
            <div style={{ position:'absolute', top:-60, left:'50%', transform:'translateX(-50%)', width:200, height:200, borderRadius:'50%', background:'#a78bfa', opacity:0.07, filter:'blur(60px)', pointerEvents:'none' }}/>
            {salesSent ? (
              <div style={{ textAlign:'center', padding:'20px 0' }}>
                <div style={{ fontSize:52, marginBottom:16 }}>🎉</div>
                <div style={{ fontFamily:"'Syne',sans-serif", fontSize:24, fontWeight:800, color:'#fff', marginBottom:10 }}>We'll be in touch!</div>
                <div style={{ fontSize:14, color:'#6b7280', lineHeight:1.65 }}>Thanks for reaching out. Our team will contact you within one business day.</div>
                <button onClick={()=>setSalesModal(false)} style={{ marginTop:24, background:'#1a1a2e', border:'1px solid #2a2a4a', color:'#9ca3af', fontSize:13, fontWeight:600, padding:'10px 24px', borderRadius:10, cursor:'pointer' }}>Close</button>
              </div>
            ) : (
              <div>
                <div style={{ textAlign:'center', marginBottom:28 }}>
                  <div style={{ width:56, height:56, borderRadius:16, background:'linear-gradient(135deg,#a78bfa22,#7c3aed22)', border:'1px solid #a78bfa44', display:'flex', alignItems:'center', justifyContent:'center', fontSize:26, margin:'0 auto 16px' }}>🏢</div>
                  <div style={{ fontFamily:"'Syne',sans-serif", fontSize:22, fontWeight:800, color:'#fff', letterSpacing:'-0.4px', marginBottom:8 }}>Talk to Sales</div>
                  <div style={{ fontSize:13, color:'#6b7280', lineHeight:1.65 }}>Tell us about your team. We'll reach out with custom pricing and a walkthrough.</div>
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:12 }}>
                  <div>
                    <label style={{ display:'block', fontSize:11, fontWeight:700, color:'#6b7280', marginBottom:6, textTransform:'uppercase', letterSpacing:'0.06em' }}>First Name *</label>
                    <input
                      type="text"
                      value={salesForm.firstName}
                      onChange={e=>setSalesForm(f=>({...f, firstName:e.target.value}))}
                      placeholder="Jamie"
                      style={{ width:'100%', background:'#0a0a18', border:'1px solid #2a2a4a', borderRadius:10, padding:'12px 13px', color:'#fff', fontSize:14, outline:'none', boxSizing:'border-box', fontFamily:"'DM Sans',sans-serif" }}
                    />
                  </div>
                  <div>
                    <label style={{ display:'block', fontSize:11, fontWeight:700, color:'#6b7280', marginBottom:6, textTransform:'uppercase', letterSpacing:'0.06em' }}>Last Name</label>
                    <input
                      type="text"
                      value={salesForm.lastName}
                      onChange={e=>setSalesForm(f=>({...f, lastName:e.target.value}))}
                      placeholder="Ellis"
                      style={{ width:'100%', background:'#0a0a18', border:'1px solid #2a2a4a', borderRadius:10, padding:'12px 13px', color:'#fff', fontSize:14, outline:'none', boxSizing:'border-box', fontFamily:"'DM Sans',sans-serif" }}
                    />
                  </div>
                </div>
                <div style={{ marginBottom:12 }}>
                  <label style={{ display:'block', fontSize:11, fontWeight:700, color:'#6b7280', marginBottom:6, textTransform:'uppercase', letterSpacing:'0.06em' }}>Work Email *</label>
                  <input
                    type="email"
                    value={salesForm.email}
                    onChange={e=>setSalesForm(f=>({...f, email:e.target.value}))}
                    placeholder="jamie@company.com"
                    style={{ width:'100%', background:'#0a0a18', border:'1px solid #2a2a4a', borderRadius:10, padding:'12px 13px', color:'#fff', fontSize:14, outline:'none', boxSizing:'border-box', fontFamily:"'DM Sans',sans-serif" }}
                  />
                </div>
                <div style={{ marginBottom:20 }}>
                  <label style={{ display:'block', fontSize:11, fontWeight:700, color:'#6b7280', marginBottom:6, textTransform:'uppercase', letterSpacing:'0.06em' }}>Phone Number</label>
                  <input
                    type="tel"
                    value={salesForm.phone}
                    onChange={e=>setSalesForm(f=>({...f, phone:e.target.value}))}
                    placeholder="(555) 000-0000"
                    style={{ width:'100%', background:'#0a0a18', border:'1px solid #2a2a4a', borderRadius:10, padding:'12px 13px', color:'#fff', fontSize:14, outline:'none', boxSizing:'border-box', fontFamily:"'DM Sans',sans-serif" }}
                  />
                </div>
                <button
                  onClick={submitSales}
                  style={{ width:'100%', background: (salesForm.firstName && salesForm.email.includes('@')) ? 'linear-gradient(135deg,#7c3aed,#4f46e5)' : '#141428', border:'none', color: (salesForm.firstName && salesForm.email.includes('@')) ? '#fff' : '#374151', fontSize:14, fontWeight:700, padding:'14px', borderRadius:10, cursor: (salesForm.firstName && salesForm.email.includes('@')) ? 'pointer' : 'default', transition:'all .15s' }}
                >
                  Get in Touch →
                </button>
                <div style={{ fontSize:11, color:'#374151', textAlign:'center', marginTop:10 }}>We respond within one business day.</div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}



// ─── SHARED PAGE SHELL ────────────────────────────────────────────────────────
export default function App() {
  const route = useRoute()
  return (
    <>
      <style>{`
        @keyframes livePulse {
          0%   { transform: translate(-50%,-50%) scale(1);   opacity: 0.7; }
          50%  { transform: translate(-50%,-50%) scale(2.4); opacity: 0; }
          100% { transform: translate(-50%,-50%) scale(1);   opacity: 0; }
        }
      `}</style>
      <LiveCursor />
      {route === '/app'         ? <StreamlivePrototype /> :
       route === '/checkout'    ? <Checkout /> :
       route === '/welcome'     ? <Welcome /> :
       route.startsWith('/s/')  ? <OptInPage slug={route.split('/s/')[1]?.split('/')[0]} connectedPlatforms={PERSONA_PLATFORMS[route.split('/s/')[1]?.split('/')[0]]} /> :
       route.startsWith('/live/') ? (() => {
         const parts   = route.split('/live/')[1]?.split('/') || [];
         const shopSlug = parts[0] || '';
         const showSlug = parts[1] || '';
         return <LiveShopPage shopSlug={shopSlug} showSlug={showSlug} />;
       })() :
       route === '/changelog'      ? <ChangelogPage /> :
       route === '/roadmap'        ? <RoadmapPage /> :
       route === '/about'          ? <AboutPage /> :
       route === '/blog'           ? <BlogPage /> :
       route === '/privacy'        ? <PrivacyPage /> :
       route === '/terms'          ? <TermsPage /> :
       route === '/contact'        ? <ContactPage /> :
       route.startsWith('/blog/')    ? <BlogPostPage slug={route.split('/blog/')[1]} /> :
       route.startsWith('/platform/')? <PlatformPage platform={route.split('/platform/')[1]} /> :
       <Landing />}
    </>
  );
}

// ─── SHARED PAGE SHELL ────────────────────────────────────────────────────────
function PageShell({ children, title }) {
  return (
    <div style={{ minHeight:'100vh', background:'#06060e', color:'#e2e8f0', fontFamily:"'DM Sans',sans-serif" }}>
      <style>{FONT}</style>
      <style>{GLOBAL_CSS}</style>
      {/* Nav */}
      <nav style={{ position:'sticky', top:0, zIndex:50, background:'#06060eee', backdropFilter:'blur(16px)', borderBottom:'1px solid #14142a', padding:'0 24px', height:58, display:'flex', alignItems:'center', gap:12 }}>
        <button onClick={()=>navigate('/')} style={{ display:'flex', alignItems:'center', gap:9, background:'none', border:'none', cursor:'pointer', padding:0 }}>
          <div style={{ width:30, height:30, borderRadius:9, background:'linear-gradient(135deg,#7c3aed,#4f46e5)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, fontWeight:900, color:'#fff' }}>S</div>
          <span style={{ fontFamily:"'Syne',sans-serif", fontSize:17, fontWeight:800, color:'#fff', letterSpacing:'-0.3px' }}>Streamlive</span>
        </button>
        <div style={{ flex:1 }} />
        <button onClick={()=>navigate('/#pricing')} style={{ background:'none', border:'none', color:'#6b7280', fontSize:13, fontWeight:500, cursor:'pointer' }}>Pricing</button>
        <button onClick={()=>{ window.history.pushState({},'','/app'); window.dispatchEvent(new PopStateEvent('popstate')) }} style={{ background:'linear-gradient(135deg,#7c3aed,#4f46e5)', border:'none', color:'#fff', fontSize:12, fontWeight:700, padding:'7px 18px', borderRadius:8, cursor:'pointer', marginLeft:8 }}>Open App →</button>
      </nav>
      {/* Content */}
      <div style={{ maxWidth:780, margin:'0 auto', padding:'56px 24px 80px' }}>
        {children}
      </div>
      {/* Footer */}
      <div style={{ borderTop:'1px solid #14142a', padding:'28px 24px', display:'flex', justifyContent:'center', gap:24, flexWrap:'wrap' }}>
        {[['About','/about'],['Blog','/blog'],['Changelog','/changelog'],['Privacy','/privacy'],['Terms','/terms'],['Contact','/contact']].map(([l,h])=>(
          <button key={l} onClick={()=>navigate(h)} style={{ background:'none', border:'none', color:'#374151', fontSize:12, cursor:'pointer' }}>{l}</button>
        ))}
      </div>
    </div>
  )
}

function PageHeading({ label, title, subtitle }) {
  return (
    <div style={{ marginBottom:48 }}>
      {label && <span style={{ fontSize:10, fontWeight:800, letterSpacing:'.12em', textTransform:'uppercase', color:'#a78bfa', display:'block', marginBottom:14 }}>{label}</span>}
      <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:'clamp(28px,5vw,48px)', fontWeight:800, color:'#fff', letterSpacing:'-1.5px', lineHeight:1.1, margin:'0 0 16px' }}>{title}</h1>
      {subtitle && <p style={{ fontSize:16, color:'#6b7280', lineHeight:1.7, margin:0, maxWidth:600 }}>{subtitle}</p>}
    </div>
  )
}

// ─── ABOUT PAGE ───────────────────────────────────────────────────────────────
function AboutPage() {
  return (
    <PageShell>
      <PageHeading
        label="Our story"
        title="Built by live sellers, for live sellers."
        subtitle="Streamlive was born from a simple frustration: going live on five platforms and having no idea which one actually drove sales."
      />
      <div style={{ display:'flex', flexDirection:'column', gap:40 }}>
        <div style={{ background:'linear-gradient(160deg,#0d0d1e,#0a0a16)', border:'1px solid #1e1e3a', borderRadius:18, padding:'32px 36px' }}>
          <div style={{ fontFamily:"'Syne',sans-serif", fontSize:22, fontWeight:800, color:'#fff', marginBottom:16 }}>The problem we set out to solve</div>
          <p style={{ fontSize:15, color:'#9ca3af', lineHeight:1.8, margin:'0 0 16px' }}>Live commerce is the fastest-growing channel in retail — but the tools haven't kept up. Sellers were juggling five browser tabs, copy-pasting tracking links, guessing at attribution, and losing buyers in the chaos of managing chats across TikTok, Instagram, Whatnot, Amazon, and YouTube simultaneously.</p>
          <p style={{ fontSize:15, color:'#9ca3af', lineHeight:1.8, margin:0 }}>Every dollar earned in a live show deserves to be attributed. Every buyer deserves to feel remembered. We built Streamlive to make both things possible.</p>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
          {[
            { icon:'📡', title:'Multi-platform first', body:'We built for all 5 major live platforms from day one — not as an afterthought.' },
            { icon:'🧠', title:'Attribution obsessed', body:'Every order, every click, every show. We track the full buyer journey across platforms.' },
            { icon:'🛒', title:'Buyer relationships', body:'A CRM built for live commerce means your buyers feel recognized every time they return.' },
            { icon:'⚡', title:'Real-time everything', body:'Your show is live. Your data should be too — GMV, orders, viewers, and sentiment in real time.' },
          ].map(c => (
            <div key={c.title} style={{ background:'#0a0a14', border:'1px solid #14142a', borderRadius:14, padding:'24px 22px' }}>
              <div style={{ fontSize:28, marginBottom:12 }}>{c.icon}</div>
              <div style={{ fontFamily:"'Syne',sans-serif", fontSize:16, fontWeight:800, color:'#fff', marginBottom:8 }}>{c.title}</div>
              <p style={{ fontSize:13, color:'#6b7280', lineHeight:1.7, margin:0 }}>{c.body}</p>
            </div>
          ))}
        </div>

        <div style={{ background:'linear-gradient(135deg,#7c3aed11,#4f46e511)', border:'1px solid #7c3aed33', borderRadius:18, padding:'32px 36px' }}>
          <div style={{ fontFamily:"'Syne',sans-serif", fontSize:20, fontWeight:800, color:'#fff', marginBottom:14 }}>Where we're headed</div>
          <p style={{ fontSize:15, color:'#9ca3af', lineHeight:1.8, margin:'0 0 16px' }}>We're in active beta with real sellers across fashion, beauty, collectibles, and home goods. Every week we ship new features based directly on what our sellers tell us they need.</p>
          <p style={{ fontSize:15, color:'#9ca3af', lineHeight:1.8, margin:'0 0 24px' }}>Our roadmap includes AI-powered show planning, predictive inventory, and post-show email sequences that turn one-time buyers into loyal regulars.</p>
          <button onClick={()=>navigate('/roadmap')} style={{ background:'linear-gradient(135deg,#7c3aed,#4f46e5)', border:'none', color:'#fff', fontSize:13, fontWeight:700, padding:'10px 22px', borderRadius:9, cursor:'pointer' }}>View the Roadmap →</button>
        </div>

        <div>
          <div style={{ fontSize:11, fontWeight:800, color:'#6b7280', textTransform:'uppercase', letterSpacing:'.08em', marginBottom:20 }}>The team</div>
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            {[
              { initials:'WM', name:'Will Mauro', role:'Founder & CEO', color:'#7c3aed', bio:'Former live seller. Built Streamlive after losing $40k in untraceable show revenue.' },
              { initials:'EL', name:'Engineering Lead', role:'Head of Platform Integrations', color:'#10b981', bio:'Previously built real-time data infrastructure for e-commerce at scale.' },
              { initials:'PM', name:'Product & Design', role:'Head of Seller Experience', color:'#f59e0b', bio:'Spent 3 years studying live commerce buyer behavior across Asian and US markets.' },
            ].map(m => (
              <div key={m.name} style={{ display:'flex', alignItems:'center', gap:16, background:'#0a0a14', border:'1px solid #14142a', borderRadius:12, padding:'16px 20px' }}>
                <div style={{ width:44, height:44, borderRadius:12, background:`${m.color}20`, border:`1px solid ${m.color}44`, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'Syne',sans-serif", fontSize:14, fontWeight:800, color:m.color, flexShrink:0 }}>{m.initials}</div>
                <div>
                  <div style={{ fontSize:14, fontWeight:700, color:'#fff', marginBottom:2 }}>{m.name} · <span style={{ color:m.color, fontWeight:600 }}>{m.role}</span></div>
                  <div style={{ fontSize:12, color:'#6b7280', lineHeight:1.5 }}>{m.bio}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageShell>
  )
}

// ─── BLOG PAGE ────────────────────────────────────────────────────────────────
const BLOG_POSTS = [
  {
    slug: 'live-commerce-attribution',
    date: 'Jan 14, 2025',
    tag: 'Strategy',
    tagColor: '#7c3aed',
    title: 'Why Live Commerce Attribution Is Broken (And How to Fix It)',
    excerpt: 'Most live sellers have no idea which platform drives their actual revenue. Here\'s the attribution model we built to solve it.',
    readTime: '6 min read',
    emoji: '📊',
  },
  {
    slug: 'multiplatform-live-guide',
    date: 'Jan 28, 2025',
    tag: 'Guide',
    tagColor: '#10b981',
    title: 'The Complete Guide to Going Live on 5 Platforms at Once',
    excerpt: 'TikTok, Instagram, Whatnot, Amazon, YouTube — streaming to all five simultaneously without losing your mind.',
    readTime: '9 min read',
    emoji: '📡',
  },
  {
    slug: 'buyer-crm-live-sellers',
    date: 'Feb 5, 2025',
    tag: 'Product',
    tagColor: '#f59e0b',
    title: 'Why Every Live Seller Needs a Buyer CRM',
    excerpt: 'Your repeat buyers are your highest-value customers. Here\'s how recognizing them in-show drives 3x more repeat purchases.',
    readTime: '5 min read',
    emoji: '🧠',
  },
  {
    slug: 'tiktok-shop-live-tips',
    date: 'Feb 12, 2025',
    tag: 'Platform',
    tagColor: '#f43f5e',
    title: '10 TikTok Shop Live Tactics That Actually Convert',
    excerpt: 'From show structure to comment pinning to product sequencing — what the top TikTok Live sellers do differently.',
    readTime: '7 min read',
    emoji: '🎵',
  },
  {
    slug: 'live-show-planning',
    date: 'Feb 19, 2025',
    tag: 'Operations',
    tagColor: '#06b6d4',
    title: 'How Top Live Sellers Plan Their Shows Like Professionals',
    excerpt: 'A structured run-of-show, product lineup prep, and a pre-show checklist that reduces chaos and increases GMV.',
    readTime: '8 min read',
    emoji: '🗓️',
  },
  {
    slug: 'whatnot-vs-tiktok',
    date: 'Feb 24, 2025',
    tag: 'Analysis',
    tagColor: '#a78bfa',
    title: 'Whatnot vs TikTok Shop: Where Should You Sell Live in 2025?',
    excerpt: 'We analyzed 500+ shows across both platforms. Here\'s the data on fees, reach, conversion rates, and buyer loyalty.',
    readTime: '10 min read',
    emoji: '⚖️',
  },
]

function BlogPage() {
  return (
    <PageShell>
      <PageHeading
        label="Streamlive Blog"
        title="Insights for live sellers."
        subtitle="Strategy, platform guides, and product updates from the Streamlive team."
      />
      <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
        {BLOG_POSTS.map((post, i) => (
          <div key={post.slug} onClick={()=>navigate(`/blog/${post.slug}`)} style={{ display:'flex', gap:20, background: i===0 ? 'linear-gradient(160deg,#0d0d1e,#0a0a16)' : '#0a0a14', border:`1px solid ${i===0 ? '#2a2a4a' : '#14142a'}`, borderRadius:16, padding:'22px 24px', cursor:'pointer', transition:'border-color .15s' }}>
            <div style={{ width:52, height:52, borderRadius:14, background:`${post.tagColor}15`, border:`1px solid ${post.tagColor}33`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:24, flexShrink:0 }}>{post.emoji}</div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8 }}>
                <span style={{ fontSize:10, fontWeight:800, color:post.tagColor, background:`${post.tagColor}15`, border:`1px solid ${post.tagColor}33`, padding:'2px 8px', borderRadius:99, textTransform:'uppercase', letterSpacing:'0.06em' }}>{post.tag}</span>
                <span style={{ fontSize:11, color:'#374151' }}>{post.date}</span>
                <span style={{ fontSize:11, color:'#374151' }}>· {post.readTime}</span>
              </div>
              <div style={{ fontFamily:"'Syne',sans-serif", fontSize:17, fontWeight:800, color:'#fff', marginBottom:6, lineHeight:1.3 }}>{post.title}</div>
              <p style={{ fontSize:13, color:'#6b7280', lineHeight:1.6, margin:0 }}>{post.excerpt}</p>
            </div>
          </div>
        ))}
      </div>
    </PageShell>
  )
}

function BlogPostPage({ slug }) {
  const post = BLOG_POSTS.find(p => p.slug === slug)
  if (!post) return <PageShell><div style={{ textAlign:'center', padding:'60px 0' }}><div style={{ fontSize:48, marginBottom:16 }}>📭</div><div style={{ color:'#fff', fontFamily:"'Syne',sans-serif", fontSize:22, fontWeight:800 }}>Post not found</div></div></PageShell>

  const CONTENT = {
    'live-commerce-attribution': `Live commerce is growing at 30%+ annually — but most sellers still can't answer the most basic question: which platform actually made me money today?\n\nThe problem is structural. Each platform has its own analytics dashboard. Orders come in from five different places. And the "source" of a sale — whether a viewer on TikTok bought after seeing you on Instagram first — is invisible to every native tool.\n\n**The attribution gap costs real money.**\n\nWe surveyed 200 live sellers and found that 73% couldn't confidently say which platform drove their highest-ROI shows. They were making platform decisions — where to invest their time, which software to buy, which audiences to grow — based on gut feeling instead of data.\n\n**How proper live attribution works:**\n\nEvery product link shared in a live show should carry three pieces of tracking data: the platform it was shared on, the show ID, and a seller identifier. When a buyer clicks and converts, that data travels all the way to your order management system.\n\nStreamlive does this automatically. Every product deeplink generated for a show is tagged with `ref=streamlive_live`, `show_id`, and `utm_source` parameters. Post-show, you get a clean breakdown: $2,400 from TikTok, $890 from Instagram, $340 from Whatnot — for the same 2-hour show.\n\n**What good attribution changes:**\n\nOnce you know which platforms convert, you can double down on them. Once you know which products sell better on which platforms, you can plan your show lineup accordingly. Attribution turns live commerce from performance art into a data-driven operation.`,
    'multiplatform-live-guide': `Going live on five platforms simultaneously sounds overwhelming. Most sellers try it once, get confused by the chaos, and retreat to one or two platforms. That's leaving serious revenue on the table.\n\nHere's the framework we've seen work for high-volume multi-platform sellers.\n\n**Step 1: Use a streaming tool that handles the multicast**\n\nDon't try to manage five separate streaming sessions manually. Use a tool like StreamYard, Restream, or OBS with plugins to send one stream to all platforms simultaneously. The stream itself is the easy part.\n\n**Step 2: Manage chats with a unified inbox**\n\nThis is where sellers break down. TikTok chat, Instagram comments, Whatnot bidding activity, YouTube chat — all at once. Streamlive's Live Companion aggregates all of this into one view, filtered by priority.\n\n**Step 3: Pre-generate your product links**\n\nBefore going live, build your show run order in Streamlive's Show Planner. Each product gets a deeplink with platform-specific tracking baked in. When you go live, your links are ready.\n\n**Step 4: Assign platform roles**\n\nIf you have a team: one person watches TikTok chat, one watches Instagram, one manages Whatnot bidding. If you're solo: focus on the platform with your highest viewer count and let the others run.\n\n**Step 5: Do a post-show debrief within 1 hour**\n\nWhile it's fresh: which product sold out fastest, which platform had the most engagement, what questions came up repeatedly. Streamlive logs all of this automatically — your job is to read the data and adjust.`,
  }

  const bodyText = CONTENT[slug] || `Full article coming soon. In the meantime, explore the rest of our blog for more live commerce insights.`

  return (
    <PageShell>
      <button onClick={()=>navigate('/blog')} style={{ background:'none', border:'none', color:'#6b7280', fontSize:13, cursor:'pointer', marginBottom:32, padding:0, display:'flex', alignItems:'center', gap:6 }}>← Back to Blog</button>
      <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:16 }}>
        <span style={{ fontSize:10, fontWeight:800, color:post.tagColor, background:`${post.tagColor}15`, border:`1px solid ${post.tagColor}33`, padding:'3px 10px', borderRadius:99, textTransform:'uppercase', letterSpacing:'0.06em' }}>{post.tag}</span>
        <span style={{ fontSize:12, color:'#374151' }}>{post.date} · {post.readTime}</span>
      </div>
      <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:'clamp(24px,4vw,40px)', fontWeight:800, color:'#fff', letterSpacing:'-1px', lineHeight:1.15, margin:'0 0 32px' }}>{post.title}</h1>
      <div style={{ borderLeft:'3px solid #7c3aed44', paddingLeft:20, marginBottom:36 }}>
        <p style={{ fontSize:16, color:'#9ca3af', lineHeight:1.75, margin:0, fontStyle:'italic' }}>{post.excerpt}</p>
      </div>
      <div style={{ fontSize:15, color:'#9ca3af', lineHeight:1.85 }}>
        {bodyText.split('\n\n').map((para, i) => {
          if (para.startsWith('**') && para.endsWith('**')) {
            return <h3 key={i} style={{ fontFamily:"'Syne',sans-serif", fontSize:19, fontWeight:800, color:'#fff', margin:'28px 0 12px' }}>{para.replace(/\*\*/g,'')}</h3>
          }
          return <p key={i} style={{ margin:'0 0 20px' }}>{para}</p>
        })}
      </div>
      <div style={{ borderTop:'1px solid #14142a', paddingTop:28, marginTop:20 }}>
        <div style={{ fontSize:13, color:'#6b7280', marginBottom:16 }}>Ready to track your live show performance?</div>
        <button onClick={()=>{ window.history.pushState({},'','/app'); window.dispatchEvent(new PopStateEvent('popstate')) }} style={{ background:'linear-gradient(135deg,#7c3aed,#4f46e5)', border:'none', color:'#fff', fontSize:13, fontWeight:700, padding:'11px 24px', borderRadius:10, cursor:'pointer' }}>Try Streamlive Free →</button>
      </div>
    </PageShell>
  )
}

// ─── CHANGELOG PAGE ───────────────────────────────────────────────────────────
function ChangelogPage() {
  const entries = [
    {
      version: 'v0.9.2',
      date: 'Feb 24, 2025',
      type: 'Feature',
      color: '#10b981',
      changes: [
        'Live Shop buyer-facing page with deeplinks to Shopify PDPs',
        'Quick Message tab — send pre-filled SMS, Instagram DM, or TikTok DM with live shop link',
        'Copy-link widget in Live Companion header with one-click URL copy',
      ]
    },
    {
      version: 'v0.9.1',
      date: 'Feb 19, 2025',
      type: 'Improvement',
      color: '#7c3aed',
      changes: [
        'Two-row Live Companion header with Total Viewers and condensed platform badges',
        'Show name now included in live shop URL slug',
        'Platform viewer counts now abbreviated (1.0k, 4.2k)',
        'Email gate modal before demo access with Google Sheets capture',
      ]
    },
    {
      version: 'v0.9.0',
      date: 'Feb 14, 2025',
      type: 'Feature',
      color: '#10b981',
      changes: [
        'Show Planner redesigned as Command Center with 4-phase flow: Plan → Production → Live → Post-Show',
        'Post-Show analytics screen with AI-generated insights and revenue attribution',
        'Perks & Exclusives tab in Live Companion for show-specific offers',
        'Subscriber management with tier tracking and renewal flags',
      ]
    },
    {
      version: 'v0.8.5',
      date: 'Feb 7, 2025',
      type: 'Feature',
      color: '#10b981',
      changes: [
        'Buyer CRM with cross-platform profile merging',
        'Lifetime value and order history per buyer',
        'Platform handle linking across TT, IG, WN, AM, YT',
        'Buyer tags and notes',
      ]
    },
    {
      version: 'v0.8.0',
      date: 'Jan 28, 2025',
      type: 'Launch',
      color: '#f59e0b',
      changes: [
        'Live Companion: unified chat view across all 5 platforms',
        'Real-time GMV, order count, and platform viewer stats',
        'Product run-order management during live show',
        'Pinned message composer with per-platform send',
      ]
    },
    {
      version: 'v0.7.0',
      date: 'Jan 15, 2025',
      type: 'Launch',
      color: '#f59e0b',
      changes: [
        'Multi-platform Opt-In page builder (TT, IG, WN, AM, YT)',
        'Seller persona system with platform connectivity dashboard',
        'Show Planner v1 with run-of-show builder',
        'Landing page and marketing site launched',
      ]
    },
  ]

  return (
    <PageShell>
      <PageHeading
        label="Changelog"
        title="What's new in Streamlive."
        subtitle="We ship every week. Here's what we've built."
      />
      <div style={{ position:'relative', paddingLeft:28 }}>
        <div style={{ position:'absolute', left:7, top:8, bottom:0, width:2, background:'linear-gradient(180deg,#7c3aed44,transparent)' }} />
        {entries.map(entry => (
          <div key={entry.version} style={{ marginBottom:40, position:'relative' }}>
            <div style={{ position:'absolute', left:-28, top:4, width:14, height:14, borderRadius:'50%', background:`${entry.color}`, border:'3px solid #06060e', boxShadow:`0 0 8px ${entry.color}66` }} />
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:14 }}>
              <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:13, fontWeight:700, color:'#fff' }}>{entry.version}</span>
              <span style={{ fontSize:10, fontWeight:800, color:entry.color, background:`${entry.color}15`, border:`1px solid ${entry.color}33`, padding:'2px 8px', borderRadius:99, textTransform:'uppercase', letterSpacing:'0.06em' }}>{entry.type}</span>
              <span style={{ fontSize:11, color:'#374151' }}>{entry.date}</span>
            </div>
            <div style={{ background:'#0a0a14', border:'1px solid #14142a', borderRadius:12, padding:'16px 20px' }}>
              {entry.changes.map((c, i) => (
                <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:10, padding:'6px 0', borderBottom: i < entry.changes.length-1 ? '1px solid #0d0d1a' : 'none' }}>
                  <span style={{ color:entry.color, fontSize:12, marginTop:1, flexShrink:0 }}>+</span>
                  <span style={{ fontSize:13, color:'#9ca3af', lineHeight:1.5 }}>{c}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </PageShell>
  )
}

// ─── ROADMAP PAGE ─────────────────────────────────────────────────────────────
function RoadmapPage() {
  const quarters = [
    {
      period: 'Q1 2025 — In Progress',
      color: '#10b981',
      items: [
        { status:'✅', label:'Live Shop buyer pages with Shopify deeplinks' },
        { status:'✅', label:'Email gate + lead capture on demo access' },
        { status:'✅', label:'Contact Sales modal with Google Sheets capture' },
        { status:'🔄', label:'Stripe billing integration for paid plans' },
        { status:'🔄', label:'Webhook support for Shopify order sync' },
        { status:'🔄', label:'Mobile app (iOS) for Live Companion' },
      ]
    },
    {
      period: 'Q2 2025 — Planned',
      color: '#7c3aed',
      items: [
        { status:'🗓️', label:'AI-generated show outlines from past performance data' },
        { status:'🗓️', label:'Predictive inventory: flag products likely to sell out' },
        { status:'🗓️', label:'Post-show email sequences (Klaviyo + Mailchimp)' },
        { status:'🗓️', label:'Buyer win-back campaigns for lapsed customers' },
        { status:'🗓️', label:'TikTok Shop native order ingestion' },
        { status:'🗓️', label:'Affiliate link support for show collaborators' },
      ]
    },
    {
      period: 'Q3 2025 — Roadmap',
      color: '#4b5563',
      items: [
        { status:'💡', label:'Real-time sentiment analysis from live chat' },
        { status:'💡', label:'Cross-show buyer cohort analysis' },
        { status:'💡', label:'Multi-seller show support (guest hosts)' },
        { status:'💡', label:'Custom branded buyer opt-in domains' },
        { status:'💡', label:'Live show replay attribution (VOD tracking)' },
        { status:'💡', label:'Wholesale/B2B live show mode' },
      ]
    },
  ]

  return (
    <PageShell>
      <PageHeading
        label="Roadmap"
        title="Where Streamlive is headed."
        subtitle="Our public roadmap, updated each quarter. Have a feature request? Let us know."
      />
      <div style={{ display:'flex', flexDirection:'column', gap:36 }}>
        {quarters.map(q => (
          <div key={q.period}>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:16 }}>
              <div style={{ width:10, height:10, borderRadius:'50%', background:q.color }} />
              <span style={{ fontFamily:"'Syne',sans-serif", fontSize:16, fontWeight:800, color:'#fff' }}>{q.period}</span>
            </div>
            <div style={{ background:'#0a0a14', border:'1px solid #14142a', borderRadius:14, overflow:'hidden' }}>
              {q.items.map((item, i) => (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:12, padding:'13px 20px', borderBottom: i < q.items.length-1 ? '1px solid #0d0d1a' : 'none' }}>
                  <span style={{ fontSize:14, flexShrink:0 }}>{item.status}</span>
                  <span style={{ fontSize:13, color: item.status==='✅' ? '#9ca3af' : '#e5e7eb', textDecoration: item.status==='✅' ? 'line-through' : 'none', textDecorationColor:'#374151' }}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
        <div style={{ background:'linear-gradient(135deg,#7c3aed11,#4f46e511)', border:'1px solid #7c3aed33', borderRadius:14, padding:'24px 26px', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:16 }}>
          <div>
            <div style={{ fontFamily:"'Syne',sans-serif", fontSize:16, fontWeight:800, color:'#fff', marginBottom:4 }}>Got a feature idea?</div>
            <div style={{ fontSize:13, color:'#6b7280' }}>We read every suggestion and the best ones make it onto the roadmap.</div>
          </div>
          <button onClick={()=>navigate('/contact')} style={{ background:'linear-gradient(135deg,#7c3aed,#4f46e5)', border:'none', color:'#fff', fontSize:13, fontWeight:700, padding:'10px 22px', borderRadius:9, cursor:'pointer', whiteSpace:'nowrap' }}>Submit an Idea →</button>
        </div>
      </div>
    </PageShell>
  )
}

// ─── CONTACT PAGE ─────────────────────────────────────────────────────────────
function ContactPage() {
  const [form, setForm] = useState({ name:'', email:'', topic:'general', message:'' })
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)
  const SHEET_URL = 'https://script.google.com/macros/s/AKfycbw8rtlHDPcvCeV72NuAWWwJqig2mflATPpCt8G5PHUQQUB6KxaXKSVG5F6hxc3GJd8v7Q/exec'

  const submit = async () => {
    if (!form.name || !form.email.includes('@') || !form.message) return
    setSending(true)
    try { await fetch(SHEET_URL, { method:'POST', mode:'no-cors', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ ...form, source:'contact_page' }) }) } catch(e) {}
    setSending(false)
    setSent(true)
  }

  const inputStyle = { width:'100%', background:'#0a0a18', border:'1px solid #2a2a4a', borderRadius:10, padding:'12px 14px', color:'#fff', fontSize:14, outline:'none', boxSizing:'border-box', fontFamily:"'DM Sans',sans-serif" }
  const labelStyle = { display:'block', fontSize:11, fontWeight:700, color:'#6b7280', marginBottom:6, textTransform:'uppercase', letterSpacing:'0.06em' }

  return (
    <PageShell>
      <PageHeading
        label="Contact"
        title="We'd love to hear from you."
        subtitle="Questions, feedback, partnerships, or just to say hi. We respond to every message."
      />
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1.6fr', gap:32, alignItems:'start' }}>
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          {[
            { icon:'💬', title:'General questions', body:'Product questions, how things work, compatibility.' },
            { icon:'🏢', title:'Enterprise & teams', body:'Custom pricing, onboarding, and team setup. Click Talk to Sales on the landing page.' },
            { icon:'🐛', title:'Report a bug', body:'Found something broken? Tell us exactly what happened.' },
            { icon:'💡', title:'Feature requests', body:'Ideas for what we should build next. We actually read these.' },
            { icon:'🤝', title:'Partnerships', body:'Platform integrations, agency partnerships, reseller programs.' },
          ].map(c => (
            <div key={c.title} style={{ background:'#0a0a14', border:'1px solid #14142a', borderRadius:12, padding:'16px 18px' }}>
              <div style={{ fontSize:20, marginBottom:6 }}>{c.icon}</div>
              <div style={{ fontSize:13, fontWeight:700, color:'#fff', marginBottom:4 }}>{c.title}</div>
              <div style={{ fontSize:12, color:'#6b7280', lineHeight:1.5 }}>{c.body}</div>
            </div>
          ))}
        </div>
        <div style={{ background:'linear-gradient(160deg,#0d0d1e,#0a0a16)', border:'1px solid #2a2a4a', borderRadius:18, padding:'32px' }}>
          {sent ? (
            <div style={{ textAlign:'center', padding:'40px 0' }}>
              <div style={{ fontSize:52, marginBottom:16 }}>🎉</div>
              <div style={{ fontFamily:"'Syne',sans-serif", fontSize:22, fontWeight:800, color:'#fff', marginBottom:8 }}>Message received!</div>
              <div style={{ fontSize:14, color:'#6b7280', lineHeight:1.65 }}>We'll get back to you within one business day.</div>
              <button onClick={()=>setSent(false)} style={{ marginTop:24, background:'#1a1a2e', border:'1px solid #2a2a4a', color:'#9ca3af', fontSize:13, fontWeight:600, padding:'10px 24px', borderRadius:10, cursor:'pointer' }}>Send another message</button>
            </div>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
              <div>
                <label style={labelStyle}>Your name</label>
                <input type="text" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} placeholder="Jamie Ellis" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Email</label>
                <input type="email" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} placeholder="jamie@yourstore.com" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Topic</label>
                <select value={form.topic} onChange={e=>setForm(f=>({...f,topic:e.target.value}))} style={{...inputStyle, cursor:'pointer'}}>
                  <option value="general">General question</option>
                  <option value="bug">Bug report</option>
                  <option value="feature">Feature request</option>
                  <option value="partnership">Partnership</option>
                  <option value="billing">Billing</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Message</label>
                <textarea value={form.message} onChange={e=>setForm(f=>({...f,message:e.target.value}))} placeholder="Tell us what's on your mind…" rows={5} style={{...inputStyle, resize:'vertical', lineHeight:1.6}} />
              </div>
              <button
                onClick={submit}
                disabled={sending}
                style={{ background: (form.name && form.email.includes('@') && form.message) ? 'linear-gradient(135deg,#7c3aed,#4f46e5)' : '#141428', border:'none', color: (form.name && form.email.includes('@') && form.message) ? '#fff' : '#374151', fontSize:14, fontWeight:700, padding:'14px', borderRadius:10, cursor: (form.name && form.email.includes('@') && form.message) ? 'pointer' : 'default', transition:'all .15s' }}
              >
                {sending ? 'Sending…' : 'Send Message →'}
              </button>
            </div>
          )}
        </div>
      </div>
    </PageShell>
  )
}

// ─── PRIVACY POLICY ───────────────────────────────────────────────────────────
function PrivacyPage() {
  const sections = [
    { title:'Information We Collect', body:'We collect information you provide directly, including name, email address, and payment details when you create an account or purchase a plan. We also collect usage data such as features accessed, show data, buyer CRM entries, and platform connection details necessary to provide the service.' },
    { title:'How We Use Your Information', body:'We use your information to provide, maintain, and improve Streamlive. This includes processing payments, sending transactional emails, providing customer support, and analyzing usage patterns to improve the product. We do not sell your personal data to third parties.' },
    { title:'Platform Integrations', body:'When you connect your TikTok, Instagram, Whatnot, Amazon, or YouTube accounts, we access only the permissions required to display chat, viewer counts, and order data within Streamlive. We do not post on your behalf or access content beyond what is required for the Live Companion and analytics features.' },
    { title:'Buyer Data', body:'Data you collect about your buyers through Streamlive (names, platform handles, purchase history) is your data. You remain the data controller for all buyer information. We process this data on your behalf as a data processor and do not use it for our own marketing purposes.' },
    { title:'Data Security', body:'We use industry-standard encryption for data in transit (TLS 1.3) and at rest (AES-256). Access to production systems is restricted to authorized personnel. We conduct regular security reviews.' },
    { title:'Data Retention', body:'We retain your account data for as long as your account is active. If you cancel your account, we retain data for 90 days before permanent deletion, allowing time for export. You may request immediate deletion by contacting support.' },
    { title:'Cookies', body:'We use cookies for authentication (session management) and analytics (understanding how features are used). We do not use third-party advertising cookies. You can manage cookie preferences in your browser settings.' },
    { title:'Third-Party Services', body:'We use Stripe for payment processing, Google Sheets for lead capture, and standard cloud infrastructure providers. Each third-party service processes only the data necessary for their function and is bound by their own privacy policies.' },
    { title:'Your Rights', body:'You have the right to access, correct, or delete your personal data at any time. EU/UK residents have additional rights under GDPR including data portability and the right to object to processing. To exercise these rights, contact privacy@strmlive.com.' },
    { title:'Contact', body:'For privacy-related questions, contact us at privacy@strmlive.com. For general inquiries, visit our Contact page.' },
  ]
  return (
    <PageShell>
      <PageHeading label="Legal" title="Privacy Policy" subtitle="Last updated February 24, 2025. We keep this plain and readable on purpose." />
      <div style={{ display:'flex', flexDirection:'column', gap:28 }}>
        {sections.map((s, i) => (
          <div key={i}>
            <div style={{ fontFamily:"'Syne',sans-serif", fontSize:16, fontWeight:800, color:'#fff', marginBottom:10 }}>{i+1}. {s.title}</div>
            <p style={{ fontSize:14, color:'#9ca3af', lineHeight:1.8, margin:0 }}>{s.body}</p>
          </div>
        ))}
      </div>
    </PageShell>
  )
}

// ─── TERMS OF SERVICE ─────────────────────────────────────────────────────────
function TermsPage() {
  const sections = [
    { title:'Acceptance of Terms', body:'By accessing or using Streamlive ("the Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, do not use the Service. We may update these terms periodically; continued use after changes constitutes acceptance.' },
    { title:'Description of Service', body:'Streamlive is a live commerce management platform that enables sellers to manage multi-platform live shows, track buyer data, and attribute sales. Features include Live Companion, Show Planner, Buyer CRM, Analytics, and Live Shop pages.' },
    { title:'Account Registration', body:'You must create an account to use most features of the Service. You are responsible for maintaining the confidentiality of your credentials and for all activities under your account. You must be at least 18 years old to create an account.' },
    { title:'Acceptable Use', body:'You agree not to use the Service to violate any laws, infringe intellectual property rights, transmit harmful content, attempt to gain unauthorized access to systems, or engage in fraudulent activity. We reserve the right to suspend accounts that violate these terms.' },
    { title:'Platform Connections', body:'When connecting third-party platforms (TikTok, Instagram, Whatnot, Amazon, YouTube), you are responsible for complying with those platforms\' terms of service. Streamlive is not responsible for changes to third-party APIs that affect functionality.' },
    { title:'Buyer Data Responsibility', body:'You are the data controller for buyer information collected through Streamlive. You are responsible for complying with applicable privacy laws regarding the buyer data you collect, including GDPR, CCPA, and other relevant regulations.' },
    { title:'Payment and Billing', body:'Paid plans are billed monthly or annually as selected. Fees are non-refundable except as required by law or as explicitly stated in our refund policy. We reserve the right to change pricing with 30 days\' notice.' },
    { title:'Intellectual Property', body:'Streamlive and its original content, features, and functionality are owned by Streamlive and protected by intellectual property laws. Your content (show data, buyer records, product information) remains your property.' },
    { title:'Limitation of Liability', body:'Streamlive shall not be liable for indirect, incidental, or consequential damages arising from use of the Service, including lost revenue from platform outages, integration failures, or data loss beyond our reasonable control.' },
    { title:'Termination', body:'Either party may terminate the relationship at any time. Upon termination, your access to the Service will cease. We will provide a 30-day data export window following account termination.' },
    { title:'Governing Law', body:'These terms are governed by the laws of the State of Delaware, USA. Disputes will be resolved by binding arbitration rather than in court, except for small claims.' },
    { title:'Contact', body:'Questions about these terms: legal@strmlive.com' },
  ]
  return (
    <PageShell>
      <PageHeading label="Legal" title="Terms of Service" subtitle="Last updated February 24, 2025. The important stuff, written to be understood." />
      <div style={{ display:'flex', flexDirection:'column', gap:28 }}>
        {sections.map((s, i) => (
          <div key={i}>
            <div style={{ fontFamily:"'Syne',sans-serif", fontSize:16, fontWeight:800, color:'#fff', marginBottom:10 }}>{i+1}. {s.title}</div>
            <p style={{ fontSize:14, color:'#9ca3af', lineHeight:1.8, margin:0 }}>{s.body}</p>
          </div>
        ))}
      </div>
    </PageShell>
  )
}

// ─── PLATFORM PAGES ───────────────────────────────────────────────────────────
const PLATFORM_DATA = {
  whatnot: {
    name: 'Whatnot',
    tagline: 'The collector\'s platform, supercharged.',
    color: '#7c3aed',
    emoji: '🏷️',
    desc: 'Whatnot is the leading live auction and fixed-price platform for collectibles, trading cards, sneakers, and vintage goods. Streamlive integrates deeply with Whatnot\'s bidding system, live chat, and buyer profiles.',
    features: [
      { icon:'🔨', title:'Bid activity in Live Companion', body:'See every bid, outbid notification, and winning buyer in your unified chat view.' },
      { icon:'📋', title:'Auction run-order planning', body:'Build your lot lineup in Show Planner with estimated prices and reserve tracking.' },
      { icon:'👤', title:'Buyer history across shows', body:'Recognize your best bidders the moment they join — total spent, items won, show history.' },
      { icon:'📊', title:'GMV by lot', body:'Post-show breakdown of revenue per lot, average bid, and sell-through rate.' },
    ],
    stat1: { label:'Avg seller GMV/show', value:'$2,840' },
    stat2: { label:'Buyer retention rate', value:'67%' },
  },
  tiktok: {
    name: 'TikTok Shop',
    tagline: 'Viral moments. Attributed revenue.',
    color: '#f43f5e',
    emoji: '🎵',
    desc: 'TikTok Shop Live is the fastest-growing live commerce channel in the US. Streamlive captures your TikTok Live orders, chat, and viewer data in real time — and ties it back to your other platform performance.',
    features: [
      { icon:'💬', title:'TikTok chat in unified inbox', body:'All TikTok Live comments alongside IG, Whatnot, Amazon, and YouTube in one view.' },
      { icon:'🛍️', title:'TikTok Shop order tracking', body:'Orders from TikTok Shop flow directly into your Streamlive analytics dashboard.' },
      { icon:'📌', title:'Comment pinning for product links', body:'Quick Message lets you DM your TikTok Live shop link with one tap, mid-show.' },
      { icon:'📈', title:'Viewer-to-buyer conversion', body:'See exactly how many TikTok viewers converted to buyers compared to other platforms.' },
    ],
    stat1: { label:'Avg TikTok Live viewers', value:'1,200' },
    stat2: { label:'Conversion to purchase', value:'4.8%' },
  },
  instagram: {
    name: 'Instagram Live',
    tagline: 'Your audience. Your products. Together.',
    color: '#ec4899',
    emoji: '📸',
    desc: 'Instagram Live Shopping connects your existing IG following directly to your product catalog. Streamlive helps you manage the chaos of high-engagement IG Lives with unified chat and live shop links.',
    features: [
      { icon:'💬', title:'Instagram comments tracked', body:'Surface the highest-intent comments from your Instagram Live directly in Streamlive.' },
      { icon:'🔗', title:'Live shop links via Instagram DM', body:'Send your live shop page link directly to interested buyers via IG DM, mid-show.' },
      { icon:'👥', title:'Follower-to-buyer tracking', body:'See which of your Instagram followers are also buying — and which need a nudge.' },
      { icon:'📸', title:'Story + Live show coordination', body:'Plan your Story teases and Live show in the same Show Planner workflow.' },
    ],
    stat1: { label:'Avg IG Live viewers', value:'445' },
    stat2: { label:'DM-to-purchase rate', value:'12%' },
  },
  amazon: {
    name: 'Amazon Live',
    tagline: 'Prime buyers. Premium attribution.',
    color: '#f59e0b',
    emoji: '📦',
    desc: 'Amazon Live gives you access to Prime members actively shopping. Streamlive integrates with Amazon Live to track your carousel clicks, orders, and commission revenue alongside all your other platforms.',
    features: [
      { icon:'📦', title:'Amazon order attribution', body:'Link Amazon Live carousel purchases back to specific shows and products.' },
      { icon:'💰', title:'Commission tracking', body:'Track affiliate commission and direct sale revenue separately in your post-show report.' },
      { icon:'🛒', title:'Product carousel sync', body:'Your Streamlive run-order syncs with your Amazon Live product carousel sequence.' },
      { icon:'⭐', title:'Prime buyer recognition', body:'Identify your Amazon Prime regulars in the Buyer CRM across show appearances.' },
    ],
    stat1: { label:'Avg order value', value:'$89' },
    stat2: { label:'Prime buyer retention', value:'58%' },
  },
  youtube: {
    name: 'YouTube Live',
    tagline: 'Reach. Scale. Attribution.',
    color: '#ef4444',
    emoji: '▶️',
    desc: 'YouTube Live offers massive organic reach and long-form show formats perfect for product education and storytelling. Streamlive unifies your YouTube Live data with your other platforms for a complete picture.',
    features: [
      { icon:'💬', title:'YouTube chat integration', body:'YouTube Live Superchat and regular comments surface in your unified Streamlive inbox.' },
      { icon:'🎯', title:'VOD replay tracking', body:'Track clicks on your live shop links that come in after the show ends from the VOD.' },
      { icon:'📊', title:'Cross-platform audience overlap', body:'See how many of your YouTube viewers are also buyers on your other platforms.' },
      { icon:'🔔', title:'Subscriber milestone alerts', body:'Get notified of subscriber milestones mid-show so you can acknowledge them live.' },
    ],
    stat1: { label:'Avg live viewers', value:'4,200' },
    stat2: { label:'VOD-to-purchase rate', value:'2.1%' },
  },
}

function PlatformPage({ platform }) {
  const p = PLATFORM_DATA[platform]
  if (!p) return <PageShell><div style={{ textAlign:'center', padding:'60px 0' }}><div style={{ fontSize:48, marginBottom:16 }}>📭</div><div style={{ color:'#fff', fontFamily:"'Syne',sans-serif", fontSize:22, fontWeight:800 }}>Platform not found</div></div></PageShell>

  return (
    <PageShell>
      <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:20 }}>
        <div style={{ width:54, height:54, borderRadius:16, background:`${p.color}20`, border:`1px solid ${p.color}44`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:26 }}>{p.emoji}</div>
        <div>
          <div style={{ fontSize:10, fontWeight:800, letterSpacing:'.12em', textTransform:'uppercase', color:p.color, marginBottom:4 }}>Platform Integration</div>
          <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:32, fontWeight:800, color:'#fff', letterSpacing:'-1px', margin:0, lineHeight:1 }}>{p.name}</h1>
        </div>
      </div>
      <p style={{ fontFamily:"'Syne',sans-serif", fontSize:24, fontWeight:700, color:p.color, marginBottom:16, lineHeight:1.2 }}>{p.tagline}</p>
      <p style={{ fontSize:15, color:'#9ca3af', lineHeight:1.8, marginBottom:40, maxWidth:620 }}>{p.desc}</p>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:40 }}>
        {[p.stat1, p.stat2].map(s => (
          <div key={s.label} style={{ background:`${p.color}10`, border:`1px solid ${p.color}33`, borderRadius:14, padding:'22px 24px' }}>
            <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:32, fontWeight:700, color:p.color, marginBottom:6 }}>{s.value}</div>
            <div style={{ fontSize:12, color:'#6b7280' }}>{s.label} on Streamlive</div>
          </div>
        ))}
      </div>

      <div style={{ marginBottom:40 }}>
        <div style={{ fontSize:11, fontWeight:800, color:'#6b7280', textTransform:'uppercase', letterSpacing:'.08em', marginBottom:16 }}>What Streamlive adds to your {p.name} shows</div>
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          {p.features.map(f => (
            <div key={f.title} style={{ display:'flex', gap:16, background:'#0a0a14', border:'1px solid #14142a', borderRadius:12, padding:'18px 20px' }}>
              <div style={{ width:40, height:40, borderRadius:10, background:`${p.color}15`, border:`1px solid ${p.color}33`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, flexShrink:0 }}>{f.icon}</div>
              <div>
                <div style={{ fontSize:14, fontWeight:700, color:'#fff', marginBottom:4 }}>{f.title}</div>
                <div style={{ fontSize:13, color:'#6b7280', lineHeight:1.55 }}>{f.body}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background:'linear-gradient(135deg,#7c3aed11,#4f46e511)', border:'1px solid #7c3aed33', borderRadius:16, padding:'28px 32px', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:16 }}>
        <div>
          <div style={{ fontFamily:"'Syne',sans-serif", fontSize:18, fontWeight:800, color:'#fff', marginBottom:4 }}>Add {p.name} to your setup</div>
          <div style={{ fontSize:13, color:'#6b7280' }}>Connect all 5 platforms and see your full live commerce picture.</div>
        </div>
        <button onClick={()=>{ window.history.pushState({},'','/app'); window.dispatchEvent(new PopStateEvent('popstate')) }} style={{ background:'linear-gradient(135deg,#7c3aed,#4f46e5)', border:'none', color:'#fff', fontSize:13, fontWeight:700, padding:'11px 24px', borderRadius:10, cursor:'pointer', whiteSpace:'nowrap' }}>Try It Free →</button>
      </div>
    </PageShell>
  )
}
