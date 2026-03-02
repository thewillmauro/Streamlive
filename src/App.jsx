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
  const [liveViewers, setLiveViewers] = useState({ WN: 234, TT: 891, IG: 312, AM: 156, YT: 420 })
  // Demo gate modal
  const [demoModal, setDemoModal] = useState(false)
  const [demoEmail, setDemoEmail] = useState('')
  const [demoEmailSent, setDemoEmailSent] = useState(false)
  // Contact Sales modal
  const [salesModal, setSalesModal] = useState(false)
  const [salesForm, setSalesForm] = useState({ firstName:'', lastName:'', email:'', phone:'', store:'', platforms:[], message:'' })
  const [salesSent, setSalesSent] = useState(false)

  useEffect(() => {
    // Simulate realistic live show GMV ticking up
    // Orders come in bursts — sometimes fast, sometimes a pause
    // Viewers fluctuate across all 5 platforms simultaneously (mirrors Live Companion behavior)
    let current = 0
    const seeds = { WN: 234, TT: 891, IG: 312, AM: 156, YT: 420 }
    let viewers = { ...seeds }

    const tickViewers = () => {
      setLiveViewers(prev => {
        const next = { ...prev }
        Object.keys(next).forEach(pid => {
          const drift = Math.floor((Math.random() - 0.38) * 12)
          next[pid] = Math.max(seeds[pid] * 0.6 | 0, next[pid] + drift)
        })
        return next
      })
      setTimeout(tickViewers, Math.round(Math.random() * 1200 + 600))
    }
    setTimeout(tickViewers, 400)

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
        setLiveViewers({ WN: 234, TT: 891, IG: 312, AM: 156, YT: 420 })
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

  const SHEET_URL = 'https://script.google.com/macros/s/AKfycbwgOLHc642bZ-iHn5djlMWE4zqUHd06apowDVVj8Nk_96w-xal6QjSMyc6W_aYRm-ePrw/exec'

  const openDemo = () => {
    setDemoEmailSent(false)
    setDemoEmail('')
    setDemoModal(true)
  }

  const submitDemoEmail = async () => {
    if (!demoEmail.includes('@')) return
    try { await fetch(SHEET_URL, { method:'POST', mode:'no-cors', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ email: demoEmail, source: 'demo_gate', timestamp: new Date().toISOString() }) }) } catch(e) {}
    setDemoEmailSent(true)
    setTimeout(() => {
      setDemoModal(false)
      navigate('/app')
    }, 1400)
  }

  const openSales = () => {
    setSalesForm({ firstName:'', lastName:'', email:'', phone:'', store:'', platforms:[], message:'' })
    setSalesSent(false)
    setSalesModal(true)
  }

  const submitSales = async () => {
    if (!salesForm.firstName || !salesForm.email.includes('@')) return
    const payload = {
      ...salesForm,
      platforms: salesForm.platforms.join(', '),
      source: 'contact_sales',
      timestamp: new Date().toISOString(),
      page: window.location.href,
    }
    // Primary: Vercel API proxy (avoids no-cors limitations)
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
    } catch(e) {
      // Fallback: direct Google Sheets webhook
      try { await fetch(SHEET_URL, { method:'POST', mode:'no-cors', headers:{'Content-Type':'application/json'}, body:JSON.stringify(payload) }) } catch(e2) {}
    }
    setSalesSent(true)
  }

  const handleSubmit = async () => {
    if (!email.includes('@')) return
    try { await fetch(SHEET_URL, { method:'POST', mode:'no-cors', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ email, source: 'waitlist', timestamp: new Date().toISOString() }) }) } catch(e) {}
    setSubmitted(true)
  }

  const FEATURES = [
    { icon:'◉', color:'#7c3aed', label:'Buyer CRM',             desc:'All 5 platforms. One buyer view.' },
    { icon:'◈', color:'#10b981', label:'Live Companion',         desc:'Real-time GMV, orders, and VIP alerts.' },
    { icon:'◑', color:'#f59e0b', label:'Analytics',              desc:'AI insights after every show.' },
    { icon:'⬛', color:'#a78bfa', label:'Production Suite',       desc:'Cameras, lights, and OBS. One panel.' },
    { icon:'◆', color:'#ec4899', label:'Campaigns',              desc:'Email, SMS, and DM automations.' },
    { icon:'♦', color:'#f43f5e', label:'Loyalty Hub',            desc:'4-tier program. Auto across all platforms.' },
    { icon:'●', color:'#3b82f6', label:'Opt-in Pages',           desc:'Collect email and phone. TCPA-compliant.' },
    { icon:'◧', color:'#10b981', label:'Show Planner',           desc:'AI run order. Perks. Go live in minutes.' },
    { icon:'📋', color:'#a78bfa', label:'Host Briefing',          desc:'Live script. Countdown. Talking points.' },
    { icon:'🔗', color:'#ec4899', label:'Multi-Platform Sync',   desc:'All 5 simultaneously. Always in sync.' },
  ]

  const STATS = [
    { value:'5',    label:'Platforms',   sub:'Simultaneous live streaming' },
    { value:'99%',  label:'Attribution', sub:'vs 55–82% with guesswork' },
    { value:'LIVE_GMV', label:'Live GMV', sub:'Real orders · resets every show' },
    { value:'6+',   label:'AI Insights', sub:'Confidence-scored, per show' },
  ]

  const SPOTLIGHTS = [
    {
      tag:'PLAN THE SHOW',
      headline:"Name it. Build it.\nLaunch it.",
      desc:"AI-ranked run order, perks configured, platforms selected — before you go live.",
      color:'#7c3aed',
      stats:[{ label:'AI product ranking', value:'✓' },{ label:'Show perks', value:'✓' },{ label:'Platforms', value:'5' }],
      side:'left',
    },
    {
      tag:'BEFORE THE SHOW',
      headline:"Broadcast-quality setup.\nOne interface.",
      desc:"Cameras, lighting, and OBS scenes — all controlled from one panel.",
      color:'#f59e0b',
      stats:[{ label:'Camera feeds', value:'Multi' },{ label:'Lighting brands', value:'3' },{ label:'OBS control', value:'Live' }],
      side:'right',
    },
    {
      tag:'LIVE COMMAND CENTER',
      headline:"Stream everywhere.\nAttribute every sale.",
      desc:"Live buyer feed, real GMV, and 99% attribution across all 5 platforms simultaneously.",
      color:'#10b981',
      stats:[{ label:'Platforms live', value:'5' },{ label:'Attribution', value:'99%' },{ label:'Buyer lookup', value:'< 1s' }],
      side:'left',
    },
    {
      tag:'AFTER THE SHOW',
      headline:"Intelligent insights.\nEvery single show.",
      desc:"6 prioritized, confidence-scored recommendations delivered after every show.",
      color:'#a78bfa',
      stats:[{ label:'Insights/show', value:'6+' },{ label:'Avg confidence', value:'83%' },{ label:'Data sources', value:'5' }],
      side:'right',
    },
    {
      tag:'HOST BRIEFING',
      headline:"Your script.\nLive and in sync.",
      desc:"The Briefing opens alongside your Live Companion — run order, countdown timer, and AI talking points auto-advance with the show clock.",
      color:'#38bdf8',
      stats:[{ label:'Auto-advances', value:'✓' },{ label:'Talking points', value:'AI' },{ label:'Sync', value:'Live' }],
      side:'left',
    },
  ]

  const FAQS = [
    { q:'Free during beta?', a:'Yes. Full access, no credit card. Paid plans launch at MVP — join now to lock in founding-member pricing.' },
    { q:'Which platforms?', a:'Whatnot, TikTok Shop, Instagram Live, Amazon Live, and YouTube Live. Stream all five simultaneously. One buyer CRM for all of them.' },
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

          <p className="fade-a2" style={{ fontSize:'clamp(14px,1.8vw,17px)', color:'#4b5563', lineHeight:1.6, maxWidth:480, margin:'0 auto 32px', fontWeight:400 }}>
            One command center for Whatnot, TikTok, Instagram, Amazon Live, and YouTube Live — simultaneously.
          </p>

          <div className="fade-a3 hero-input-row" style={{ display:'flex', gap:10, justifyContent:'center', marginBottom:12, flexWrap:'wrap' }}>
            {!submitted ? (
              <>
                <input value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==='Enter'&&handleSubmit()} placeholder="your@email.com"
                  className="hero-input"
                  style={{ background:'#0d0d1e', border:'1px solid #1e1e3a', borderRadius:11, padding:'12px 18px', color:'#fff', fontSize:14, outline:'none', fontFamily:"'DM Sans',sans-serif" }} />
                <button onClick={handleSubmit} className="cta-btn"
                  style={{ background:'linear-gradient(135deg,#7c3aed,#4f46e5)', border:'none', color:'#fff', fontSize:14, fontWeight:700, padding:'12px 28px', borderRadius:11, cursor:'pointer', whiteSpace:'nowrap' }}>
                  Get Early Access →
                </button>
                <button onClick={openSales} className="cta-btn"
                  style={{ background:'transparent', border:'1px solid #2a2a4a', color:'#9ca3af', fontSize:14, fontWeight:600, padding:'12px 22px', borderRadius:11, cursor:'pointer', whiteSpace:'nowrap' }}>
                  Talk to Sales
                </button>
              </>
            ) : (
              <div style={{ display:'flex', alignItems:'center', gap:10, background:'#0a1e16', border:'1px solid #10b98144', borderRadius:11, padding:'13px 24px' }}>
                <span style={{ fontSize:16 }}>✓</span>
                <span style={{ fontSize:14, color:'#10b981', fontWeight:600 }}>You're on the list. We'll be in touch soon.</span>
              </div>
            )}
          </div>
          <p className="fade-a3" style={{ fontSize:11, color:'#3d3d6e', marginBottom:24 }}>Free during beta · No credit card required</p>

          {/* Live viewer count — mirrors Live Companion platform strip behavior */}
          <div style={{ display:'flex', justifyContent:'center', marginBottom:0 }}>
            <div className="fade-a4" style={{ display:'inline-flex', flexDirection:'column', alignItems:'center', gap:9, background:'#0a0a16', border:'1px solid #1e1e3a', borderRadius:14, padding:'11px 18px' }}>
              <div style={{ display:'flex', alignItems:'center', gap:7 }}>
                <div style={{ width:7, height:7, borderRadius:'50%', background:'#ef4444', animation:'pulse 1s infinite', flexShrink:0 }} />
                <span style={{ fontSize:11, fontWeight:800, color:'#ef4444', letterSpacing:'0.08em', textTransform:'uppercase' }}>Live Now</span>
                <span style={{ fontSize:11, color:'#374151', marginLeft:2 }}>·</span>
                <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:12, fontWeight:700, color:'#fff' }}>
                  {Object.values(liveViewers).reduce((a,v)=>a+v,0).toLocaleString()}
                </span>
                <span style={{ fontSize:11, color:'#6b7280' }}>viewers across 5 platforms</span>
              </div>
              <div style={{ display:'flex', gap:5, flexWrap:'wrap', justifyContent:'center' }}>
                {[
                  {id:'WN', label:'Whatnot',     color:'#7c3aed'},
                  {id:'TT', label:'TikTok',      color:'#f43f5e'},
                  {id:'IG', label:'Instagram',   color:'#ec4899'},
                  {id:'AM', label:'Amazon Live', color:'#f59e0b'},
                  {id:'YT', label:'YouTube',     color:'#ff0000'},
                ].map(p=>(
                  <div key={p.id} style={{ display:'flex', alignItems:'center', gap:5, background:`${p.color}18`, border:`1px solid ${p.color}44`, borderRadius:99, padding:'4px 11px' }}>
                    <div style={{ width:5, height:5, borderRadius:'50%', background:p.color, animation:'pulse 1.4s infinite', flexShrink:0 }} />
                    <span style={{ fontSize:11, fontWeight:700, color:p.color }}>{p.label}</span>
                    <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:11, fontWeight:700, color:'#e5e7eb', marginLeft:2 }}>
                      {liveViewers[p.id] >= 1000 ? (liveViewers[p.id]/1000).toFixed(1)+'k' : liveViewers[p.id]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
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




        {/* ── FEATURES GRID ────────────────────────────────────────────────── */}
        <div id="features" style={{ maxWidth:900, margin:'0 auto', padding:'72px 24px 0' }}>
          <div style={{ textAlign:'center', marginBottom:32 }}>
            <div style={{ fontFamily:"'Syne',sans-serif", fontSize:'clamp(22px,3.5vw,34px)', fontWeight:800, color:'#fff', letterSpacing:'-0.8px' }}>Everything in one platform.</div>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(140px,1fr))', gap:8 }}>
            {FEATURES.map(f=>(
              <div key={f.label} style={{ display:'flex', alignItems:'center', gap:10, background:'#08080f', border:'1px solid #14142a', borderRadius:12, padding:'12px 14px' }}>
                <div style={{ width:28, height:28, borderRadius:8, background:`${f.color}15`, border:`1px solid ${f.color}33`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, color:f.color, flexShrink:0 }}>{f.icon}</div>
                <span style={{ fontSize:12, fontWeight:600, color:'#d1d5db' }}>{f.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── SHOW STAGES ─────────────────────────────────────────────────── */}
        <div style={{ maxWidth:900, margin:'0 auto', padding:'72px 24px 0' }}>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:10 }}>
            {[
              { num:'01', tag:'PLAN', label:'Show Planner', bullets:['AI-ranked run order','Perks & bundle config','Multi-platform in one click'], color:'#7c3aed' },
              { num:'02', tag:'SETUP', label:'Production Suite', bullets:['Camera & lighting control','OBS scene switching','All gear, one panel'], color:'#f59e0b' },
              { num:'03', tag:'LIVE', label:'Live Companion', bullets:['Real-time GMV counter','Buyer feed across 5 platforms','VIP alerts as orders land'], color:'#10b981' },
              { num:'04', tag:'AFTER', label:'AI Insights', bullets:['6 recs per show','Confidence-scored','Revenue impact estimated'], color:'#a78bfa' },
            ].map(s=>(
              <div key={s.num} style={{ background:'#08080f', border:`1px solid ${s.color}22`, borderRadius:16, padding:'20px 18px' }}>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:14 }}>
                  <span style={{ fontSize:9, fontWeight:800, color:s.color, letterSpacing:'0.1em' }}>{s.tag}</span>
                  <div style={{ flex:1, height:'1px', background:`${s.color}22` }} />
                </div>
                <div style={{ fontSize:15, fontWeight:700, color:'#fff', marginBottom:12 }}>{s.label}</div>
                {s.bullets.map(b=>(
                  <div key={b} style={{ display:'flex', alignItems:'flex-start', gap:7, marginBottom:7 }}>
                    <div style={{ width:4, height:4, borderRadius:'50%', background:s.color, marginTop:5, flexShrink:0 }} />
                    <span style={{ fontSize:11, color:'#6b7280', lineHeight:1.5 }}>{b}</span>
                  </div>
                ))}
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
                <p style={{ fontSize:14, color:'#4b5563', lineHeight:1.6, marginBottom:20 }}>{s.desc}</p>
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
                      <div style={{ background:'#0d0d1e', border:'1px solid #7c3aed33', borderRadius:10, padding:'11px 14px', marginBottom:8 }}>
                        <div style={{ fontSize:9, color:'#4b5563', marginBottom:5, textTransform:'uppercase', letterSpacing:'0.08em' }}>Show Name</div>
                        <div style={{ fontSize:13, fontWeight:700, color:'#fff' }}>Friday Night Flash Sale ✦</div>
                      </div>
                      <div style={{ background:'#0d0d1e', border:'1px solid #1e1e3a', borderRadius:10, padding:'11px 14px', marginBottom:8 }}>
                        <div style={{ fontSize:9, color:'#4b5563', marginBottom:7, textTransform:'uppercase', letterSpacing:'0.08em' }}>Streaming To</div>
                        <div style={{ display:'flex', gap:5, flexWrap:'wrap' }}>
                          {[['WN','#7c3aed'],['TT','#f43f5e'],['IG','#ec4899'],['AM','#f59e0b'],['YT','#ff0000']].map(([p,c])=>(
                            <div key={p} style={{ display:'flex',alignItems:'center',gap:4,background:`${c}15`,border:`1px solid ${c}44`,borderRadius:6,padding:'4px 9px' }}>
                              <div style={{ width:5,height:5,borderRadius:'50%',background:c }} />
                              <span style={{ fontSize:9,fontWeight:700,color:c }}>{p}</span>
                            </div>
                          ))}
                        </div>
                      </div>
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
                      <div style={{ background:'#0d0d1e', border:'1px solid #f59e0b22', borderRadius:10, padding:'11px 14px', marginBottom:8 }}>
                        <div style={{ fontSize:9, color:'#4b5563', marginBottom:7, textTransform:'uppercase', letterSpacing:'0.08em' }}>Lighting</div>
                        {[{name:'Elgato Key Light',pct:100,temp:'5600K'},{name:'Aputure 300d Fill',pct:65,temp:'4200K'},{name:'Godox Background',pct:40,temp:'3200K'}].map(light=>(
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
                      <div style={{ display:'flex', gap:5, marginBottom:12, flexWrap:'wrap' }}>
                        {[['WN','#7c3aed',312],['TT','#f43f5e',891],['IG','#ec4899',445],['AM','#f59e0b',156],['YT','#ff0000',4200]].map(([p,c,v])=>(
                          <div key={p} style={{ flex:1, minWidth:40, background:`${c}12`, border:`1px solid ${c}33`, borderRadius:8, padding:'7px 4px', textAlign:'center' }}>
                            <div style={{ width:5,height:5,borderRadius:'50%',background:c,margin:'0 auto 4px',animation:'pulse 1s infinite' }} />
                            <div style={{ fontSize:8,fontWeight:800,color:c }}>{p}</div>
                            <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:10,fontWeight:700,color:'#fff' }}>{v.toLocaleString()}</div>
                          </div>
                        ))}
                      </div>
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
                        {icon:'🎯',pri:'MED',title:'Live Pixel: 99% of YT sales attributed',impact:'14 orders confirmed',conf:97,c:'#ff0000'},
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
                  {/* i=4: Host Briefing */}
                  {i===4 && (
                    <div style={{ display:'flex', gap:10, height:'100%' }}>
                      {/* Run order sidebar */}
                      <div style={{ width:110, flexShrink:0, background:'#07070f', border:'1px solid #1e1e3a', borderRadius:10, overflow:'hidden' }}>
                        <div style={{ padding:'8px 10px', borderBottom:'1px solid #1e1e3a' }}>
                          <div style={{ fontSize:8, fontWeight:800, color:'#38bdf8', textTransform:'uppercase', letterSpacing:'.1em' }}>📋 Run Order</div>
                          <div style={{ fontSize:8, color:'#374151', marginTop:2 }}>Friday Night Flash</div>
                        </div>
                        <div style={{ padding:'6px' }}>
                          {[
                            {n:'Silk Wrap Midi',p:'$89',active:true},
                            {n:'Merino Blazer',p:'$165',active:false},
                            {n:'Style Bundle',p:'$210',active:false},
                            {n:'Linen Trousers',p:'$72',active:false},
                          ].map((item,ii)=>(
                            <div key={ii} style={{ display:'flex',alignItems:'center',gap:6,padding:'6px 7px',background:item.active?'#38bdf818':'transparent',border:`1px solid ${item.active?'#38bdf844':'transparent'}`,borderRadius:7,marginBottom:3 }}>
                              <span style={{ fontSize:8,fontWeight:800,color:item.active?'#38bdf8':'#374151',width:10 }}>{ii+1}</span>
                              <div style={{ flex:1,minWidth:0 }}>
                                <div style={{ fontSize:8,fontWeight:700,color:item.active?'#fff':'#4b5563',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' }}>{item.n}</div>
                                <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:7,color:item.active?'#10b981':'#374151' }}>{item.p}</div>
                              </div>
                              {item.active && <div style={{ width:4,height:4,borderRadius:'50%',background:'#10b981',flexShrink:0,boxShadow:'0 0 6px #10b981' }} />}
                            </div>
                          ))}
                        </div>
                      </div>
                      {/* Main product card */}
                      <div style={{ flex:1, display:'flex', flexDirection:'column', gap:8 }}>
                        {/* Timer bar */}
                        <div style={{ background:'#0a0a14', border:'1px solid #38bdf833', borderRadius:9, padding:'8px 12px', display:'flex', alignItems:'center', gap:10 }}>
                          <div style={{ width:6,height:6,borderRadius:'50%',background:'#ef4444',animation:'pulse 1s infinite',flexShrink:0 }} />
                          <span style={{ fontSize:9,fontWeight:800,color:'#ef4444',textTransform:'uppercase',letterSpacing:'.08em' }}>LIVE</span>
                          <span style={{ fontSize:9,color:'#374151',flex:1 }}>Friday Night Flash Sale</span>
                          <span style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:16,fontWeight:800,color:'#10b981' }}>1:24</span>
                        </div>
                        {/* Product hero */}
                        <div style={{ background:'#0d0d1e', border:'1px solid #38bdf822', borderRadius:9, padding:'10px 12px' }}>
                          <div style={{ fontSize:8,color:'#374151',marginBottom:4,textTransform:'uppercase',letterSpacing:'.08em' }}>Now featuring · 1 of 4</div>
                          <div style={{ display:'flex',alignItems:'center',gap:10,marginBottom:8 }}>
                            <span style={{ fontSize:28 }}>👗</span>
                            <div>
                              <div style={{ fontSize:12,fontWeight:800,color:'#fff' }}>Silk Wrap Midi Dress</div>
                              <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:13,fontWeight:800,color:'#10b981' }}>$89</div>
                            </div>
                          </div>
                          <div style={{ display:'flex',gap:6 }}>
                            {[{l:'42 sold/30d',c:'#10b981'},{l:'↑ 9.6 AI score',c:'#a78bfa'},{l:'8 left',c:'#f59e0b'}].map(b=>(
                              <div key={b.l} style={{ fontSize:7,fontWeight:700,color:b.c,background:`${b.c}15`,border:`1px solid ${b.c}33`,padding:'2px 7px',borderRadius:4 }}>{b.l}</div>
                            ))}
                          </div>
                        </div>
                        {/* Talking points */}
                        <div style={{ background:'#07070f', border:'1px solid #1e1e3a', borderRadius:9, padding:'10px 12px' }}>
                          <div style={{ fontSize:8,fontWeight:800,color:'#4b5563',textTransform:'uppercase',letterSpacing:'.1em',marginBottom:8 }}>Talking Points</div>
                          {[
                            {icon:'✨',pt:'100% mulberry silk — mention the weight and drape'},
                            {icon:'📦',pt:'Only 8 left — create urgency naturally'},
                            {icon:'🎁',pt:'Pairs with the Merino Blazer (next up)'},
                          ].map((tp,ti)=>(
                            <div key={ti} style={{ display:'flex',gap:8,alignItems:'flex-start',marginBottom:6,paddingBottom:6,borderBottom:ti<2?'1px solid #1e1e3a11':'none' }}>
                              <span style={{ fontSize:11,flexShrink:0 }}>{tp.icon}</span>
                              <span style={{ fontSize:9,color:'#d1d5db',lineHeight:1.5 }}>{tp.pt}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* ── DEMO CTA ─────────────────────────────────────────────────────── */}
        <div style={{ maxWidth:900, margin:'0 auto', padding:'56px 24px 0' }}>
          <div style={{ background:'linear-gradient(135deg,#0d0d1e,#12103a)', border:'1px solid #7c3aed33', borderRadius:18, padding:'32px', textAlign:'center', position:'relative', overflow:'hidden' }}>
            <div style={{ position:'absolute', top:-40, right:-40, width:200, height:200, borderRadius:'50%', background:'#7c3aed', opacity:0.06, filter:'blur(60px)' }} />
            <div style={{ fontSize:11, fontWeight:800, color:'#a78bfa', letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:10 }}>Every screen is live right now</div>
            <div style={{ fontFamily:"'Syne',sans-serif", fontSize:'clamp(20px,3.5vw,28px)', fontWeight:800, color:'#fff', letterSpacing:'-0.5px', marginBottom:20 }}>Try the interactive demo. No signup required.</div>
            <div style={{ display:'flex', gap:10, justifyContent:'center', flexWrap:'wrap' }}>
              <button onClick={()=>openDemo()} style={{ background:'linear-gradient(135deg,#7c3aed,#4f46e5)', border:'none', color:'#fff', fontSize:14, fontWeight:700, padding:'12px 28px', borderRadius:10, cursor:'pointer' }}>Open Demo →</button>
              <button onClick={openSales} style={{ background:'transparent', border:'1px solid #2a2a4a', color:'#9ca3af', fontSize:14, fontWeight:600, padding:'12px 22px', borderRadius:10, cursor:'pointer' }}>Talk to Sales</button>
            </div>
          </div>
        </div>

                {/* ── PRICING ──────────────────────────────────────────────────────── */}
        <div id="pricing" className="pricing-section" style={{ maxWidth:1040, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:32 }}>
            <div style={{ fontFamily:"'Syne',sans-serif", fontSize:'clamp(22px,3.5vw,34px)', fontWeight:800, color:'#fff', letterSpacing:'-0.8px', marginBottom:16 }}>Start free. Scale when ready.</div>
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
              <div style={{ fontSize:13, color:'#6b7280' }}>White label · unlimited seats · custom integrations.</div>
            </div>
            <button onClick={openSales} className="cta-btn" style={{ background:'linear-gradient(135deg,#4c1d95,#7c3aed)', border:'none', color:'#fff', fontSize:13, fontWeight:700, padding:'11px 24px', borderRadius:10, cursor:'pointer', whiteSpace:'nowrap' }}>Talk to Sales →</button>
          </div>
        </div>

        {/* ── FAQ ──────────────────────────────────────────────────────────── */}
        <div className="faq-section" style={{ maxWidth:720, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:24 }}>
            <div style={{ fontFamily:"'Syne',sans-serif", fontSize:20, fontWeight:800, color:'#fff' }}>Common questions</div>
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
          <div style={{ fontFamily:"'Syne',sans-serif", fontSize:'clamp(26px,4.5vw,48px)', fontWeight:800, color:'#fff', letterSpacing:'-1.5px', lineHeight:1.1, marginBottom:24 }}>
            <span className="gradient-text">Ready to go live?</span>
          </div>
          <div style={{ display:'flex', gap:10, justifyContent:'center', marginBottom:12, flexWrap:'wrap' }}>
            {!submitted ? (
              <>
                <input value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==='Enter'&&handleSubmit()} placeholder="your@email.com"
                  className="hero-input"
                  style={{ background:'#0d0d1e', border:'1px solid #2a2a4a', borderRadius:11, padding:'12px 18px', color:'#fff', fontSize:14, outline:'none', fontFamily:"'DM Sans',sans-serif" }} />
                <button onClick={handleSubmit} className="cta-btn"
                  style={{ background:'linear-gradient(135deg,#7c3aed,#4f46e5)', border:'none', color:'#fff', fontSize:14, fontWeight:700, padding:'12px 28px', borderRadius:11, cursor:'pointer', whiteSpace:'nowrap' }}>
                  Get Early Access →
                </button>
                <button onClick={openSales} className="cta-btn"
                  style={{ background:'transparent', border:'1px solid #2a2a4a', color:'#9ca3af', fontSize:14, fontWeight:600, padding:'12px 22px', borderRadius:11, cursor:'pointer', whiteSpace:'nowrap' }}>
                  Talk to Sales
                </button>
              </>
            ) : (
              <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:12 }}>
                <div style={{ display:'flex', alignItems:'center', gap:10, background:'#0a1e16', border:'1px solid #10b98144', borderRadius:11, padding:'13px 24px' }}>
                  <span style={{ fontSize:16 }}>✓</span>
                  <span style={{ fontSize:14, color:'#10b981', fontWeight:600 }}>You're on the list. We'll be in touch soon.</span>
                </div>
                <button onClick={openSales} style={{ background:'none', border:'none', color:'#6b7280', fontSize:13, cursor:'pointer', textDecoration:'underline', textUnderlineOffset:3 }}>
                  Or talk to sales about subscribing →
                </button>
              </div>
            )}
          </div>
          {!submitted && <p style={{ fontSize:11, color:'#374151' }}>Free during beta · No credit card</p>}
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
                <p style={{ fontSize:12, color:'#374151', lineHeight:1.6, margin:0 }}>Live selling command center for Whatnot, TikTok, Instagram, Amazon, and YouTube.</p>
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
                {[
                  {label:'Whatnot',        slug:'whatnot'},
                  {label:'TikTok Shop',    slug:'tiktok-shop'},
                  {label:'Instagram Live', slug:'instagram-live'},
                  {label:'Amazon Live',    slug:'amazon-live'},
                  {label:'YouTube Live',   slug:'youtube-live'},
                ].map(({label, slug})=>(
                  <div key={slug} onClick={()=>navigate('/platform/'+slug)} className="footer-link-hover" style={{ fontSize:13, color:'#374151', marginBottom:8, cursor:'pointer', transition:'color .15s' }}>{label}</div>
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
          <div style={{ background:'linear-gradient(160deg,#0d0d1e,#0a0a16)', border:'1px solid #2a2a4a', borderRadius:22, padding:'40px 36px', maxWidth:440, width:'100%', position:'relative', boxShadow:'0 40px 100px rgba(0,0,0,.9)', maxHeight:'90vh', overflowY:'auto' }}>
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
                <div style={{ marginBottom:12 }}>
                  <label style={{ display:'block', fontSize:11, fontWeight:700, color:'#6b7280', marginBottom:6, textTransform:'uppercase', letterSpacing:'0.06em' }}>Phone Number</label>
                  <input
                    type="tel"
                    value={salesForm.phone}
                    onChange={e=>setSalesForm(f=>({...f, phone:e.target.value}))}
                    placeholder="(555) 000-0000"
                    style={{ width:'100%', background:'#0a0a18', border:'1px solid #2a2a4a', borderRadius:10, padding:'12px 13px', color:'#fff', fontSize:14, outline:'none', boxSizing:'border-box', fontFamily:"'DM Sans',sans-serif" }}
                  />
                </div>
                <div style={{ marginBottom:12 }}>
                  <label style={{ display:'block', fontSize:11, fontWeight:700, color:'#6b7280', marginBottom:6, textTransform:'uppercase', letterSpacing:'0.06em' }}>Store / Shop Name</label>
                  <input
                    type="text"
                    value={salesForm.store}
                    onChange={e=>setSalesForm(f=>({...f, store:e.target.value}))}
                    placeholder="Banana Republic, Jamie's Closet…"
                    style={{ width:'100%', background:'#0a0a18', border:'1px solid #2a2a4a', borderRadius:10, padding:'12px 13px', color:'#fff', fontSize:14, outline:'none', boxSizing:'border-box', fontFamily:"'DM Sans',sans-serif" }}
                  />
                </div>
                <div style={{ marginBottom:12 }}>
                  <label style={{ display:'block', fontSize:11, fontWeight:700, color:'#6b7280', marginBottom:6, textTransform:'uppercase', letterSpacing:'0.06em' }}>Platforms you sell on</label>
                  <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
                    {[['WN','Whatnot','167,139,250'],['TT','TikTok','244,63,94'],['IG','Instagram','236,72,153'],['AM','Amazon','245,158,11'],['YT','YouTube','248,68,68']].map(([code,label,col])=>{
                      const sel = salesForm.platforms.includes(code)
                      const c = `rgb(${col})`
                      return (
                        <button key={code}
                          onClick={()=>setSalesForm(f=>({...f, platforms: sel ? f.platforms.filter(p=>p!==code) : [...f.platforms, code]}))}
                          style={{ padding:'6px 12px', borderRadius:8, fontSize:12, fontWeight:700, cursor:'pointer', transition:'all .12s',
                            background: sel ? `rgba(${col},0.15)` : '#0a0a18',
                            border: `1px solid ${sel ? c : '#2a2a4a'}`,
                            color: sel ? c : '#6b7280' }}>
                          {code} · {label}
                        </button>
                      )
                    })}
                  </div>
                </div>
                <div style={{ marginBottom:20 }}>
                  <label style={{ display:'block', fontSize:11, fontWeight:700, color:'#6b7280', marginBottom:6, textTransform:'uppercase', letterSpacing:'0.06em' }}>Anything else? <span style={{fontWeight:400,textTransform:'none'}}>(optional)</span></label>
                  <textarea
                    value={salesForm.message}
                    onChange={e=>setSalesForm(f=>({...f, message:e.target.value}))}
                    placeholder="Tell us about your show schedule, volume, what you're looking to solve…"
                    rows={3}
                    style={{ width:'100%', background:'#0a0a18', border:'1px solid #2a2a4a', borderRadius:10, padding:'12px 13px', color:'#fff', fontSize:13, outline:'none', boxSizing:'border-box', fontFamily:"'DM Sans',sans-serif", resize:'vertical', lineHeight:1.6 }}
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
function PageShell({ children }) {
  return (
    <div style={{ minHeight:'100vh', background:'#06060e', color:'#e2e8f0', fontFamily:"'DM Sans',sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap');
        * { box-sizing:border-box; margin:0; padding:0; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        .page-fade { animation:fadeUp .45s ease both; }
        .footer-link-hover:hover { color:#a78bfa !important; }
      `}</style>
      <nav style={{ position:'sticky', top:0, zIndex:50, background:'#06060eee', backdropFilter:'blur(16px)', borderBottom:'1px solid #14142a', padding:'0 32px', height:56, display:'flex', alignItems:'center', gap:12 }}>
        <button onClick={()=>navigate('/')} style={{ display:'flex', alignItems:'center', gap:8, background:'none', border:'none', cursor:'pointer', padding:0 }}>
          <div style={{ width:28, height:28, borderRadius:8, background:'linear-gradient(135deg,#7c3aed,#4f46e5)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:900, color:'#fff' }}>S</div>
          <span style={{ fontFamily:"'Syne',sans-serif", fontSize:16, fontWeight:800, color:'#fff' }}>Streamlive</span>
        </button>
        <div style={{ flex:1 }}/>
        <button onClick={()=>navigate('/')} style={{ fontSize:12, color:'#6b7280', background:'none', border:'none', cursor:'pointer', display:'flex', alignItems:'center', gap:5 }}>← Back to home</button>
      </nav>
      <div style={{ maxWidth:780, margin:'0 auto', padding:'64px 28px 96px' }}>
        {children}
      </div>
    </div>
  )
}

function PLabel({ t }) { return <div style={{ fontSize:10, fontWeight:800, letterSpacing:'.12em', textTransform:'uppercase', color:'#7c3aed', marginBottom:12 }}>{t}</div> }
function PTitle({ children }) { return <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:'clamp(28px,5vw,46px)', fontWeight:800, color:'#fff', letterSpacing:'-1.5px', lineHeight:1.1, marginBottom:14 }}>{children}</h1> }
function PSub({ children }) { return <p style={{ fontSize:15, color:'#6b7280', lineHeight:1.75, marginBottom:52 }}>{children}</p> }
function Divider2() { return <div style={{ height:1, background:'linear-gradient(90deg,transparent,#7c3aed33,#a78bfa44,#7c3aed33,transparent)', margin:'44px 0' }}/> }
function SectionTitle({ children }) { return <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:22, fontWeight:800, color:'#fff', letterSpacing:'-0.5px', marginBottom:14 }}>{children}</h2> }
function Body({ children }) { return <p style={{ fontSize:14, color:'#6b7280', lineHeight:1.8, marginBottom:14 }}>{children}</p> }

// ─── CHANGELOG PAGE ───────────────────────────────────────────────────────────
function ChangelogPage() {
  const entries = [
    {
      version:'v0.9.2', date:'February 2026', tag:'New', tagColor:'#10b981',
      items:[
        {type:'✦', text:'Live Shop page — shareable buyer-facing URL per show with full product lineup and Shopify deeplinks'},
        {type:'✦', text:'Quick Message tab — SMS, Instagram DM, and TikTok DM templates with one-tap live shop link sharing'},
        {type:'◈', text:'Live Companion two-row header: Total Viewers, condensed per-platform badges, copy-link widget'},
        {type:'◈', text:'Show name flows from Show Planner → Live Companion → Order Review → Show History automatically'},
        {type:'✓', text:'Fixed: live shop URL now includes show slug so every show gets a unique, bookmarkable link'},
      ]
    },
    {
      version:'v0.9.1', date:'January 2026', tag:'Improved', tagColor:'#7c3aed',
      items:[
        {type:'◈', text:'Perks tab in Live Companion — assign live-only discounts and bundles to individual buyers mid-show'},
        {type:'◈', text:'Loyalty Hub — 4-tier program (Bronze → Silver → Gold → VIP) with points, rewards, birthday discounts'},
        {type:'◉', text:'Buyer Profile — full purchase history, churn risk score, LTV, and cross-platform handle registry'},
        {type:'◉', text:'Order Review — post-show summary with per-buyer breakdown, total GMV, and CSV export'},
        {type:'✓', text:'Fixed: platform viewer counts now update in real-time during show without page refresh'},
        {type:'✓', text:'Fixed: Show Planner run order correctly persists into Live Companion on session start'},
      ]
    },
    {
      version:'v0.9.0', date:'December 2025', tag:'Launch', tagColor:'#f59e0b',
      items:[
        {type:'✦', text:'Beta launch — full product available to founding members across all 5 platforms'},
        {type:'✦', text:'Buyer CRM — unified buyer database across Whatnot, TikTok, Instagram, Amazon Live, and YouTube Live'},
        {type:'✦', text:'Live Companion — real-time buyer feed, GMV counter, per-order tracking, and VIP alerts'},
        {type:'✦', text:'Analytics dashboard — revenue trends, audience health, platform comparison, LTV distribution'},
        {type:'✦', text:'AI Insights — 6 weekly recommendations with confidence scores after every show'},
        {type:'✦', text:'Production Suite — Sony FX3/FX6 camera control, Elgato/Aputure lighting, OBS scene switching'},
        {type:'✦', text:'Opt-in pages at strmlive.com/s/yourshop with TCPA-compliant email, SMS, and DM capture'},
        {type:'✦', text:'Show Planner — platform selection, AI-ranked run order, perk assignment, show history'},
        {type:'✦', text:'YouTube Live Pixel — first-party attribution from stream → site → purchase, 99% accuracy'},
      ]
    },
    {
      version:'v0.8', date:'October 2025', tag:'Beta', tagColor:'#6b7280',
      items:[
        {type:'◈', text:'Private beta with 12 founding seller partners on Whatnot and TikTok'},
        {type:'◈', text:'Core buyer CRM and live show tracking established'},
        {type:'◈', text:'ManyChat integration for keyword automations and DM opt-ins'},
        {type:'✓', text:'80+ issues resolved from founding partner feedback sessions'},
      ]
    },
  ]

  return (
    <PageShell>
      <div className="page-fade">
        <PLabel t="Changelog"/>
        <PTitle>What's shipped.</PTitle>
        <PSub>Every update to Streamlive, documented. We ship fast and break things carefully — this is the honest record of both.</PSub>

        <div style={{ position:'relative', paddingLeft:28 }}>
          <div style={{ position:'absolute', left:6, top:6, bottom:6, width:1, background:'linear-gradient(180deg,#7c3aed88,#7c3aed11)' }}/>
          {entries.map((e, ei) => (
            <div key={ei} style={{ marginBottom:52, position:'relative' }}>
              <div style={{ position:'absolute', left:-28, top:4, width:14, height:14, borderRadius:'50%', background:'#7c3aed', border:'2px solid #06060e', boxShadow:'0 0 0 3px #7c3aed33' }}/>
              <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:14 }}>
                <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:13, fontWeight:700, color:'#fff' }}>{e.version}</span>
                <span style={{ fontSize:9, fontWeight:800, color:e.tagColor, background:`${e.tagColor}18`, border:`1px solid ${e.tagColor}44`, padding:'2px 9px', borderRadius:99, textTransform:'uppercase', letterSpacing:'.08em' }}>{e.tag}</span>
                <span style={{ fontSize:11, color:'#374151' }}>{e.date}</span>
              </div>
              <div style={{ background:'#0a0a14', border:'1px solid #14142a', borderRadius:14, overflow:'hidden' }}>
                {e.items.map((item, ii) => (
                  <div key={ii} style={{ display:'flex', gap:12, padding:'12px 18px', borderBottom:ii<e.items.length-1?'1px solid #0d0d1a':'none', alignItems:'flex-start' }}>
                    <span style={{ fontSize:11, color:item.type==='✦'?'#7c3aed':item.type==='◈'?'#10b981':item.type==='◉'?'#f59e0b':'#374151', marginTop:2, flexShrink:0 }}>{item.type}</span>
                    <span style={{ fontSize:13, color:item.type==='✓'?'#4b5563':'#9ca3af', lineHeight:1.6 }}>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={{ background:'linear-gradient(135deg,#0d0d1e,#12103a)', border:'1px solid #7c3aed33', borderRadius:16, padding:'28px', textAlign:'center' }}>
          <div style={{ fontSize:14, fontWeight:700, color:'#fff', marginBottom:6 }}>Want to shape what we build next?</div>
          <div style={{ fontSize:13, color:'#6b7280', marginBottom:18 }}>Founding members get direct access to the roadmap and feature voting.</div>
          <button onClick={()=>navigate('/roadmap')} style={{ background:'linear-gradient(135deg,#7c3aed,#4f46e5)', border:'none', color:'#fff', fontSize:12, fontWeight:700, padding:'10px 22px', borderRadius:9, cursor:'pointer' }}>View Roadmap →</button>
        </div>
      </div>
    </PageShell>
  )
}

// ─── ROADMAP PAGE ─────────────────────────────────────────────────────────────
function RoadmapPage() {
  const quarters = [
    { period:'Q1 2026', label:'In Progress', color:'#10b981',
      items:[
        {title:'Shopify live sync', desc:'Real-time inventory deduction during shows. When a buyer claims an item, stock drops instantly on Shopify — no more overselling.'},
        {title:'Show templates', desc:'Save your best-performing show structure as a reusable template. Platform mix, run order strategy, perk assignments — all saved and reapplied in seconds.'},
        {title:'Buyer segments', desc:"Create saved segments: VIPs who haven't bought in 60 days, buyers who watch but never purchase, high-spenders. Target them directly in campaigns."},
        {title:'Live co-hosting', desc:'Invite a second seller or brand account into your live session. Both streams stay synced; both buyer CRMs update.'},
      ]
    },
    { period:'Q2 2026', label:'Planned', color:'#7c3aed',
      items:[
        {title:'Waitlist & pre-orders', desc:'Let buyers reserve items before a show. Waitlist fills automatically in Live Companion as the run order progresses — no manual tracking.'},
        {title:'Post-show email automation', desc:'Trigger personalized emails after every show: thank-you notes, "you missed it" restock alerts, and VIP early-access invites based on what each buyer watched and bought.'},
        {title:'AI show scripting', desc:'Generate a full show script from your run order: talking points, pricing callouts, urgency hooks, and platform-specific language. Edit inline before going live.'},
        {title:'Affiliate seller network', desc:'Invite other sellers to promote your products during their shows. Track clicks, views, and purchases back to each affiliate automatically.'},
      ]
    },
    { period:'Q3 2026', label:'Exploring', color:'#f59e0b',
      items:[
        {title:'Native checkout overlay', desc:'Buyers check out without leaving the stream. Stripe-powered overlay triggered directly from the Live Companion run order card — no redirect, no friction.'},
        {title:'Multi-language support', desc:'Streamlive in Spanish, Portuguese, French, and Mandarin. Opt-in pages, buyer notifications, and the full app UI localized.'},
        {title:'Buyer mobile app', desc:'A companion app for buyers: live alerts when favorite sellers go live, order tracking, loyalty point balance, and restock notifications.'},
        {title:'White-label reseller program', desc:'Agencies run Streamlive under their own brand domain with custom colors and logo. Includes multi-seller management for agencies running 5+ accounts.'},
      ]
    },
  ]
  return (
    <PageShell>
      <div className="page-fade">
        <PLabel t="Roadmap"/>
        <PTitle>Where we're going.</PTitle>
        <PSub>Our public roadmap. Founding members vote on priorities — the most-requested features move up the queue first.</PSub>

        <div style={{ background:'#0a0a14', border:'1px solid #10b98133', borderRadius:12, padding:'16px 20px', marginBottom:48, display:'flex', gap:14, alignItems:'center', flexWrap:'wrap' }}>
          <div style={{ width:8, height:8, borderRadius:'50%', background:'#10b981', flexShrink:0 }}/>
          <span style={{ fontSize:13, color:'#9ca3af', flex:1, minWidth:180 }}>Have a feature request? We read every submission from founding members.</span>
          <button onClick={()=>navigate('/contact')} style={{ background:'#10b98118', border:'1px solid #10b98144', color:'#10b981', fontSize:12, fontWeight:700, padding:'8px 18px', borderRadius:9, cursor:'pointer', whiteSpace:'nowrap' }}>Submit a request →</button>
        </div>

        {quarters.map((q, qi) => (
          <div key={qi} style={{ marginBottom:52 }}>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:22 }}>
              <div style={{ fontFamily:"'Syne',sans-serif", fontSize:20, fontWeight:800, color:'#fff' }}>{q.period}</div>
              <div style={{ fontSize:9, fontWeight:800, color:q.color, background:`${q.color}18`, border:`1px solid ${q.color}44`, padding:'3px 10px', borderRadius:99, textTransform:'uppercase', letterSpacing:'.08em' }}>{q.label}</div>
            </div>
            <div style={{ display:'grid', gap:12, gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))' }}>
              {q.items.map((item, ii) => (
                <div key={ii} style={{ background:'#0a0a14', border:`1px solid ${qi===0?'#10b98122':qi===1?'#7c3aed22':'#14142a'}`, borderRadius:14, padding:'18px 20px' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8 }}>
                    <div style={{ width:7, height:7, borderRadius:'50%', background:q.color, flexShrink:0 }}/>
                    <div style={{ fontSize:14, fontWeight:700, color:'#fff' }}>{item.title}</div>
                  </div>
                  <div style={{ fontSize:12, color:'#6b7280', lineHeight:1.65 }}>{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
        <div style={{ textAlign:'center', fontSize:12, color:'#374151', marginTop:8 }}>Last updated February 2026 · Subject to change based on founder feedback and technical complexity.</div>
      </div>
    </PageShell>
  )
}

// ─── ABOUT PAGE ───────────────────────────────────────────────────────────────
function AboutPage() {
  const values = [
    {icon:'◉', label:'Sellers first', desc:"Every decision starts with one question: does this make a seller's show better? Not a nice-to-have — does it actually move GMV or reduce friction during a live show."},
    {icon:'◈', label:'Attribution without compromise', desc:'Live commerce has a $0 attribution problem. Everyone tracks clicks. Nobody tracks what happened in the stream. We built a first-party pixel that follows the full path from stream to purchase — no cookies, no guessing.'},
    {icon:'◆', label:'One tool, all platforms', desc:"A seller shouldn't need five dashboards to understand their business. We built one source of truth for buyer data, analytics, and live operations — regardless of whether you sell on TikTok, Whatnot, Amazon, Instagram, or YouTube."},
    {icon:'✦', label:'Transparency in how we build', desc:"Our roadmap is public. Our changelog is honest. When we ship something broken, we say so. Founding members know exactly what stage we're at."},
  ]
  return (
    <PageShell>
      <div className="page-fade">
        <PLabel t="About Streamlive"/>
        <PTitle>Built for sellers who take live commerce seriously.</PTitle>
        <PSub>Streamlive started with a simple observation: the best live sellers on Whatnot, TikTok, and Amazon were running their operations out of spreadsheets, group chats, and memory. There was no purpose-built tool for managing what actually happens during and after a live show.</PSub>

        <SectionTitle>The problem we're solving</SectionTitle>
        <Body>Live commerce is one of the fastest-growing retail channels in the world. In China, it already accounts for over 20% of e-commerce. In the US, sellers on Whatnot, TikTok Shop, and Amazon Live are building seven-figure businesses one show at a time.</Body>
        <Body>But the infrastructure hasn't kept up. Sellers stream across 5 platforms simultaneously with no way to unify buyer data. They have no real-time visibility into who's buying during a show. They can't attribute revenue back to a specific item, a specific moment, or a specific platform. They manage loyalty in notes apps and DM fans manually to remind them about upcoming shows.</Body>
        <Body>Streamlive is the operating system for live commerce. The buyer CRM, live command center, attribution layer, and analytics platform — all in one place, purpose-built for sellers who go live.</Body>

        <Divider2/>

        <SectionTitle>What we believe</SectionTitle>
        <div style={{ display:'flex', flexDirection:'column', gap:14, marginBottom:52 }}>
          {values.map((v, i) => (
            <div key={i} style={{ display:'flex', gap:16, padding:'20px', background:'#0a0a14', border:'1px solid #14142a', borderRadius:14 }}>
              <span style={{ fontSize:16, color:'#7c3aed', flexShrink:0, marginTop:1 }}>{v.icon}</span>
              <div>
                <div style={{ fontSize:14, fontWeight:700, color:'#fff', marginBottom:5 }}>{v.label}</div>
                <div style={{ fontSize:13, color:'#6b7280', lineHeight:1.65 }}>{v.desc}</div>
              </div>
            </div>
          ))}
        </div>

        <Divider2/>

        <SectionTitle>Where we are</SectionTitle>
        <Body>We're in open beta. The full product — Buyer CRM, Live Companion, Analytics, AI Insights, Production Suite, Show Planner, Loyalty Hub, and Opt-in Pages — is live and available to founding members today.</Body>
        <Body>We're a small, focused team. We don't have a 200-person org or a $50M Series B. What we have is a working product, a group of founding sellers using it every week, and a roadmap built around their feedback.</Body>

        <div style={{ background:'linear-gradient(135deg,#0d0d1e,#12103a)', border:'1px solid #7c3aed33', borderRadius:16, padding:'32px', textAlign:'center', marginTop:40 }}>
          <div style={{ fontFamily:"'Syne',sans-serif", fontSize:20, fontWeight:800, color:'#fff', marginBottom:10 }}>Ready to see it?</div>
          <div style={{ fontSize:13, color:'#6b7280', marginBottom:22 }}>The full product is interactive and available right now.</div>
          <button onClick={()=>navigate('/')} style={{ background:'linear-gradient(135deg,#7c3aed,#4f46e5)', border:'none', color:'#fff', fontSize:13, fontWeight:700, padding:'11px 26px', borderRadius:10, cursor:'pointer' }}>Explore Streamlive →</button>
        </div>
      </div>
    </PageShell>
  )
}

// ─── BLOG PAGE ────────────────────────────────────────────────────────────────
function BlogPage() {
  const [activePost, setActivePost] = useState(null)
  const posts = [
    {
      slug:'attribution', date:'February 12, 2026', tag:'Product', tagColor:'#7c3aed', readTime:'6 min',
      title:'The $0 attribution problem in live commerce',
      summary:"You run a 3-hour show, drive $12,000 in sales, then your analytics says it came from \"direct.\" Here's how we built a first-party pixel that actually solves this.",
      body:[
        {h:''},
        {p:"When we started talking to live sellers, one complaint came up in almost every conversation: \"I have no idea what's actually working.\""},
        {p:'They were running shows on TikTok, Whatnot, and Amazon simultaneously — sometimes driving $10,000–$20,000 in a single three-hour show. But Shopify analytics showed "direct" traffic. No channel. No source. No show.'},
        {h:'Why live commerce breaks traditional attribution'},
        {p:"Traditional attribution is built around a click. Someone sees an ad, clicks a link, lands on a product page, buys. The click is the tracking event. Live commerce doesn't work that way."},
        {p:'A buyer watches a stream for 45 minutes. The seller mentions a product. The buyer opens a new tab, searches the store, and buys. Or they wait until after the show ends. Or they click a chat link with no UTM parameters. The click — if it exists at all — is invisible to your analytics stack.'},
        {h:'What we built instead'},
        {p:'The Streamlive Live Pixel is a first-party script on your Shopify store. When a live show starts, the Pixel creates a session token tied to that show ID. Every visitor during the show window gets the token in their browser.'},
        {p:'When that visitor converts — whether through a chat link, typing your URL directly, or returning three hours later — the Pixel links their order to the show session. No third-party cookies. No cross-site tracking. Just a direct connection between your live show and your Shopify orders.'},
        {p:'The result: 99% attribution accuracy on purchases made during and immediately after a live show. You know exactly which show drove which revenue, which product performed, and which platform your buyers came from.'},
      ]
    },
    {
      slug:'buyer-data', date:'January 28, 2026', tag:'Strategy', tagColor:'#10b981', readTime:'8 min',
      title:'Why your buyer data is your biggest live commerce advantage',
      summary:"Most sellers treat every show like a fresh start. The sellers doing seven figures treat each show as a data collection opportunity. Here's the difference.",
      body:[
        {h:''},
        {p:"There's a pattern with the top-performing live sellers on our platform. They don't treat shows as isolated events. They treat each show as a data collection opportunity."},
        {p:"After 10 shows, they know which of their 200 buyers purchases every week. They know who hasn't been seen in 45 days. They know who consistently spends over $200 and who's a one-time buyer. They know which buyers watch on TikTok but buy on the website."},
        {h:'The compounding advantage'},
        {p:'Buyer data compounds. A seller with 500 buyers in their CRM — with real purchase history, platform handles, and loyalty tiers — has a fundamentally different business than a seller with 500 TikTok followers.'},
        {p:'The unified CRM in Streamlive is built around this idea. Every buyer across every platform gets a single profile. Every purchase, every show appearance, every opt-in flows in automatically. You always know who your best buyers are, which platform they prefer, and when you last saw them.'},
        {h:'What you can do with it'},
        {p:"Segment your VIP buyers and DM them before a show. Build a re-engagement campaign for buyers who haven't purchased in 60 days. Send a birthday discount to every buyer in their birthday month. Create a waitlist for popular products and notify the most likely buyers first."},
        {p:"None of this requires a marketing team. It requires data, and the tools to act on it. That's what we built."},
      ]
    },
    {
      slug:'five-platforms', date:'January 14, 2026', tag:'Guide', tagColor:'#f59e0b', readTime:'10 min',
      title:'How to run a 5-platform live show without losing your mind',
      summary:"Going live on Whatnot, TikTok, Instagram, Amazon, and YouTube simultaneously sounds chaotic. Here's the system top multi-platform sellers use to make it manageable.",
      body:[
        {h:''},
        {p:"The case for streaming across all five platforms is straightforward: you're already producing the content, and every platform has a different audience. Going live only on TikTok means the buyers who only watch Whatnot never see your show."},
        {p:'The counterargument is equally clear: managing five live chats, five sets of questions, and five comment feeds while running a show is operationally impossible for a solo seller.'},
        {h:'Separate the production from the distribution'},
        {p:'The sellers who do this well have separated their production infrastructure from their distribution infrastructure. The show — the camera feed, product presentation, the lighting — runs once. The distribution layer handles all five platforms.'},
        {p:"OBS handles the multi-platform stream routing. Streamlive's Production Suite controls camera feeds, scene switching, and lighting presets from a single interface, without touching OBS during the show."},
        {p:"The Live Companion aggregates buyer activity across all five platforms into one feed. You're not watching five chats. You're watching one buyer feed sorted by who just bought, who just joined, and who your VIPs are."},
        {h:'The setup'},
        {p:'Run OBS on a dedicated machine. Connect your streaming keys for all five platforms. Connect Streamlive to all five platform APIs so buyer data flows in real time. Start your show from the Show Planner, which pushes your run order into the Live Companion automatically.'},
        {p:"Your GMV counter tracks only verified purchases. Your run order keeps you on script. You don't need to watch five feeds. You need to watch one."},
      ]
    },
  ]

  if (activePost) {
    const post = posts.find(p => p.slug === activePost)
    return (
      <PageShell>
        <div className="page-fade">
          <button onClick={()=>setActivePost(null)} style={{ fontSize:12, color:'#6b7280', background:'none', border:'none', cursor:'pointer', marginBottom:32, display:'flex', alignItems:'center', gap:5, padding:0 }}>← Back to blog</button>
          <div style={{ fontSize:9, fontWeight:800, color:post.tagColor, background:`${post.tagColor}18`, border:`1px solid ${post.tagColor}33`, padding:'3px 10px', borderRadius:99, textTransform:'uppercase', letterSpacing:'.1em', display:'inline-flex', marginBottom:14 }}>{post.tag}</div>
          <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:'clamp(22px,4vw,38px)', fontWeight:800, color:'#fff', letterSpacing:'-1px', lineHeight:1.15, marginBottom:10 }}>{post.title}</h1>
          <div style={{ fontSize:12, color:'#4b5563', marginBottom:44 }}>{post.date} · {post.readTime} read</div>
          <div>
            {post.body.map((b, i) => (
              b.h !== undefined
                ? (b.h ? <h2 key={i} style={{ fontFamily:"'Syne',sans-serif", fontSize:19, fontWeight:800, color:'#fff', margin:'36px 0 12px', letterSpacing:'-0.3px' }}>{b.h}</h2> : null)
                : <p key={i} style={{ fontSize:14, color:'#9ca3af', lineHeight:1.8, marginBottom:16 }}>{b.p}</p>
            ))}
          </div>
          <Divider2/>
          <div style={{ background:'#0a0a14', border:'1px solid #7c3aed33', borderRadius:14, padding:'24px', textAlign:'center' }}>
            <div style={{ fontSize:14, fontWeight:700, color:'#fff', marginBottom:8 }}>See it in action</div>
            <div style={{ fontSize:12, color:'#6b7280', marginBottom:18 }}>The full product is interactive — every screen is available right now.</div>
            <button onClick={()=>navigate('/')} style={{ background:'linear-gradient(135deg,#7c3aed,#4f46e5)', border:'none', color:'#fff', fontSize:12, fontWeight:700, padding:'10px 22px', borderRadius:9, cursor:'pointer' }}>Explore Streamlive →</button>
          </div>
        </div>
      </PageShell>
    )
  }

  return (
    <PageShell>
      <div className="page-fade">
        <PLabel t="Blog"/>
        <PTitle>Thinking out loud.</PTitle>
        <PSub>Strategy, product thinking, and practical guides for live commerce sellers.</PSub>
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
          {posts.map((post, i) => (
            <div key={i} onClick={()=>setActivePost(post.slug)}
              style={{ background:'#0a0a14', border:'1px solid #14142a', borderRadius:16, padding:'24px', cursor:'pointer', transition:'border-color .15s,transform .15s' }}
              onMouseEnter={e=>{ e.currentTarget.style.borderColor='#7c3aed44'; e.currentTarget.style.transform='translateY(-2px)' }}
              onMouseLeave={e=>{ e.currentTarget.style.borderColor='#14142a'; e.currentTarget.style.transform='translateY(0)' }}>
              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:10 }}>
                <span style={{ fontSize:9, fontWeight:800, color:post.tagColor, background:`${post.tagColor}18`, border:`1px solid ${post.tagColor}33`, padding:'2px 9px', borderRadius:99, textTransform:'uppercase', letterSpacing:'.1em' }}>{post.tag}</span>
                <span style={{ fontSize:11, color:'#374151' }}>{post.date}</span>
                <span style={{ fontSize:11, color:'#374151', marginLeft:'auto' }}>{post.readTime} read</span>
              </div>
              <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:18, fontWeight:800, color:'#fff', letterSpacing:'-0.3px', lineHeight:1.3, marginBottom:8 }}>{post.title}</h2>
              <p style={{ fontSize:13, color:'#6b7280', lineHeight:1.65, marginBottom:12 }}>{post.summary}</p>
              <span style={{ fontSize:12, fontWeight:700, color:'#7c3aed' }}>Read more →</span>
            </div>
          ))}
        </div>
      </div>
    </PageShell>
  )
}

// ─── PRIVACY POLICY PAGE ──────────────────────────────────────────────────────
function PrivacyPage() {
  const sections = [
    { title:'What information we collect',
      body:`We collect information you provide when you create an account or set up your seller profile: name, email, business name, Shopify store domain, and payment information.

We collect buyer data through your connected platform accounts (Whatnot, TikTok, Instagram Live, Amazon Live, YouTube Live). This includes buyer usernames, purchase history, opt-in consent records, and email addresses or phone numbers provided through your opt-in pages.

We collect data through the Streamlive Live Pixel installed on your Shopify store: session identifiers, page view data, and order IDs for purchases made during or after your live shows.` },
    { title:'How we use your information',
      body:`We use information collected to power your Buyer CRM — unifying buyer data across platforms and calculating loyalty tiers, churn risk scores, and lifetime value metrics.

We use it to provide live show analytics, post-show reports, and AI Insights. To process your Streamlive subscription payments. To send operational emails about your account, billing, and product updates. To attribute purchases to specific shows via the Live Pixel.` },
    { title:'Your buyer data',
      body:`Your buyers' data belongs to you. We process it on your behalf to provide Streamlive's features, but we do not sell it, use it for our own marketing, or share it with third parties except as required to provide the service.

All opt-in records collected through Streamlive pages include explicit consent documentation with timestamp, consent language, and opt-in source. These records are available in your dashboard at all times.

You can export your full buyer database in CSV format at any time. If you cancel your account, you have 30 days to export your data before it is deleted from our systems.` },
    { title:'Data security',
      body:`We use TLS 1.3 encryption for all data in transit. Data at rest is encrypted using AES-256. Our infrastructure runs on AWS with SOC 2 compliant data centers.

Access to customer data is restricted to Streamlive engineers on a need-to-know basis and is logged and audited. We do not store credit card numbers — all payment processing is handled by Stripe (PCI DSS Level 1 certified).` },
    { title:'TCPA compliance',
      body:`Streamlive opt-in pages are designed to be TCPA-compliant. Every SMS opt-in includes explicit consent language, message frequency disclosure, standard messaging rates disclosure, and opt-out instructions.

Consent records store: timestamp, IP address, consent language version, opt-in source URL, and the contact provided. You are responsible for ensuring your SMS campaigns comply with applicable law in your jurisdiction.` },
    { title:'Your rights',
      body:`You have the right to access, correct, or delete your personal information at any time from your account settings, or by contacting us at privacy@strmlive.com.

If you are in the European Economic Area, you have additional rights under GDPR including data portability and the right to object to processing. We respond to all requests within 30 days.` },
    { title:'Changes to this policy',
      body:`We will notify you by email and in-app at least 14 days before any material changes take effect. Continued use of Streamlive after the effective date constitutes acceptance of the updated policy.` },
  ]
  return (
    <PageShell>
      <div className="page-fade">
        <PLabel t="Legal"/>
        <PTitle>Privacy Policy</PTitle>
        <PSub>Last updated February 1, 2026. This policy describes how Streamlive collects, uses, and protects your information and your buyers' information.</PSub>
        {sections.map((s, i) => (
          <div key={i} style={{ marginBottom:38 }}>
            <SectionTitle>{s.title}</SectionTitle>
            {s.body.split('\n\n').map((para, pi) => (
              <Body key={pi}>{para}</Body>
            ))}
            {i < sections.length-1 && <div style={{ height:1, background:'#0d0d1a', marginTop:28 }}/>}
          </div>
        ))}
        <div style={{ marginTop:12, fontSize:12, color:'#374151' }}>Questions? Email <a href="mailto:privacy@strmlive.com" style={{ color:'#7c3aed', textDecoration:'none' }}>privacy@strmlive.com</a></div>
      </div>
    </PageShell>
  )
}

// ─── TERMS OF SERVICE PAGE ────────────────────────────────────────────────────
function TermsPage() {
  const sections = [
    { title:'Acceptance of terms',
      body:`By creating a Streamlive account or using any part of the platform, you agree to be bound by these Terms. If you do not agree, do not use Streamlive.

These terms constitute a binding legal agreement between you (the "Seller") and Streamlive, Inc. If you are accepting on behalf of a company, you represent that you have authority to bind that company.` },
    { title:'The service',
      body:`Streamlive provides software tools for live commerce sellers: buyer relationship management, live show analytics, campaign tools, loyalty program management, production tools, and attribution technology.

We reserve the right to modify, suspend, or discontinue any part of the service at any time. We will provide reasonable advance notice of significant changes.` },
    { title:'Your account',
      body:`You are responsible for maintaining the confidentiality of your account credentials and for all activity under your account. You must provide accurate information when creating your account and must be at least 18 years old.

You may not share credentials with others or allow multiple users to access the service under a single account unless you are on the Enterprise plan with multi-seat access enabled.` },
    { title:'Your buyer data',
      body:`You retain ownership of all buyer data you bring into or collect through Streamlive. By using Streamlive, you grant us a limited license to process that data for the purpose of providing the service.

You represent that you have the right to collect and process the buyer data you input into Streamlive, and that your use of that data complies with all applicable laws — including CAN-SPAM, TCPA, GDPR, and CCPA.

You are solely responsible for obtaining proper consent from your buyers for any marketing communications sent through Streamlive.` },
    { title:'Prohibited uses',
      body:`You may not use Streamlive to send unsolicited messages to buyers who have not opted in, collect data about individuals under 13, violate any applicable law, impersonate any person or entity, interfere with the integrity of the service, or resell access to the service without a written reseller agreement with Streamlive.` },
    { title:'Payment and billing',
      body:`Paid plans are billed monthly or annually in advance. All fees are non-refundable except as required by law.

We reserve the right to change pricing with 30 days' advance notice. If payment fails, we will notify you by email. If not resolved within 7 days, we may suspend your account. Suspended accounts retain data for 30 days before deletion.` },
    { title:'Intellectual property',
      body:`Streamlive and its original content, features, and functionality are owned by Streamlive, Inc. and protected by intellectual property laws. You retain all intellectual property rights in your content, including product listings, buyer communications, and show recordings.` },
    { title:'Limitation of liability',
      body:`To the maximum extent permitted by law, Streamlive shall not be liable for any indirect, incidental, special, or consequential damages. Our total liability for any claim shall not exceed the amount you paid us in the 12 months prior to the event giving rise to the claim.` },
    { title:'Governing law',
      body:`These terms are governed by the laws of the State of California. Disputes shall be resolved in the state or federal courts of San Francisco County, California.` },
  ]
  return (
    <PageShell>
      <div className="page-fade">
        <PLabel t="Legal"/>
        <PTitle>Terms of Service</PTitle>
        <PSub>Last updated February 1, 2026. Please read these terms carefully before using Streamlive.</PSub>
        {sections.map((s, i) => (
          <div key={i} style={{ marginBottom:38 }}>
            <SectionTitle>{s.title}</SectionTitle>
            {s.body.split('\n\n').map((para, pi) => (
              <Body key={pi}>{para}</Body>
            ))}
            {i < sections.length-1 && <div style={{ height:1, background:'#0d0d1a', marginTop:28 }}/>}
          </div>
        ))}
        <div style={{ marginTop:12, fontSize:12, color:'#374151' }}>Questions? Email <a href="mailto:legal@strmlive.com" style={{ color:'#7c3aed', textDecoration:'none' }}>legal@strmlive.com</a></div>
      </div>
    </PageShell>
  )
}

// ─── CONTACT PAGE ─────────────────────────────────────────────────────────────
function ContactPage() {
  const [form, setForm] = useState({name:'',email:'',subject:'',message:''})
  const [sent, setSent] = useState(false)
  const SHEET_URL_C = 'https://script.google.com/macros/s/AKfycbwgOLHc642bZ-iHn5djlMWE4zqUHd06apowDVVj8Nk_96w-xal6QjSMyc6W_aYRm-ePrw/exec'
  const ready = form.name && form.email.includes('@') && form.message
  const handleSend = async () => {
    if (!ready) return
    try { await fetch(SHEET_URL_C, {method:'POST',mode:'no-cors',headers:{'Content-Type':'application/json'},body:JSON.stringify({...form,source:'contact_page'})}) } catch(e) {}
    setSent(true)
  }
  const channels = [
    {icon:'◉', label:'General', email:'hello@strmlive.com', desc:'Product questions, partnership inquiries, or anything else.'},
    {icon:'◈', label:'Sales', email:'sales@strmlive.com', desc:'Custom pricing, Enterprise plans, and reseller programs.'},
    {icon:'◆', label:'Support', email:'support@strmlive.com', desc:'Technical help for existing customers.'},
    {icon:'✦', label:'Privacy & Legal', email:'privacy@strmlive.com', desc:'Data requests, GDPR/CCPA, or legal notices.'},
  ]
  const inp = (label, key, type='text', ph='', rows=0) => (
    <div style={{ marginBottom:16 }}>
      <label style={{ display:'block', fontSize:11, fontWeight:700, color:'#6b7280', marginBottom:6, textTransform:'uppercase', letterSpacing:'.06em' }}>{label}</label>
      {rows > 0
        ? <textarea value={form[key]} onChange={e=>setForm(f=>({...f,[key]:e.target.value}))} placeholder={ph} rows={rows} style={{ width:'100%', background:'#0a0a18', border:'1px solid #1e1e3a', borderRadius:10, padding:'12px 14px', color:'#fff', fontSize:14, outline:'none', resize:'vertical', fontFamily:"'DM Sans',sans-serif", boxSizing:'border-box', lineHeight:1.6 }}/>
        : <input type={type} value={form[key]} onChange={e=>setForm(f=>({...f,[key]:e.target.value}))} placeholder={ph} style={{ width:'100%', background:'#0a0a18', border:'1px solid #1e1e3a', borderRadius:10, padding:'12px 14px', color:'#fff', fontSize:14, outline:'none', fontFamily:"'DM Sans',sans-serif", boxSizing:'border-box' }}/>
      }
    </div>
  )
  return (
    <PageShell>
      <div className="page-fade">
        <PLabel t="Contact"/>
        <PTitle>Let's talk.</PTitle>
        <PSub>We're a small team and we read every message. Expect a reply within one business day.</PSub>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))', gap:12, marginBottom:48 }}>
          {channels.map((c, i) => (
            <div key={i} style={{ background:'#0a0a14', border:'1px solid #14142a', borderRadius:12, padding:'16px 18px' }}>
              <div style={{ fontSize:14, color:'#7c3aed', marginBottom:6 }}>{c.icon}</div>
              <div style={{ fontSize:13, fontWeight:700, color:'#fff', marginBottom:4 }}>{c.label}</div>
              <a href={`mailto:${c.email}`} style={{ fontSize:11, color:'#7c3aed', textDecoration:'none', display:'block', marginBottom:5 }}>{c.email}</a>
              <div style={{ fontSize:11, color:'#4b5563', lineHeight:1.55 }}>{c.desc}</div>
            </div>
          ))}
        </div>

        <Divider2/>

        {sent ? (
          <div style={{ textAlign:'center', padding:'40px 20px', background:'#0a0a14', border:'1px solid #10b98133', borderRadius:16 }}>
            <div style={{ fontSize:48, marginBottom:16 }}>✓</div>
            <div style={{ fontFamily:"'Syne',sans-serif", fontSize:22, fontWeight:800, color:'#fff', marginBottom:8 }}>Message sent.</div>
            <div style={{ fontSize:13, color:'#6b7280' }}>We'll get back to you within one business day.</div>
          </div>
        ) : (
          <div>
            <SectionTitle>Send us a message</SectionTitle>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginTop:20 }}>
              <div>{inp('Name *','name','text','Your name')}</div>
              <div>{inp('Email *','email','email','your@email.com')}</div>
            </div>
            {inp('Subject','subject','text',"What's this about?")}
            {inp('Message *','message','text','Tell us what you need help with…',5)}
            <button onClick={handleSend} style={{ background:ready?'linear-gradient(135deg,#7c3aed,#4f46e5)':'#141428', border:'none', color:ready?'#fff':'#374151', fontSize:14, fontWeight:700, padding:'13px 28px', borderRadius:10, cursor:ready?'pointer':'default', transition:'all .15s', marginTop:4 }}>
              Send message →
            </button>
          </div>
        )}
      </div>
    </PageShell>
  )
}


// ─── PLATFORM PAGES ───────────────────────────────────────────────────────────
function PlatformPage({ slug }) {
  const platforms = {
    'whatnot': {
      name: 'Whatnot',
      color: '#7c3aed',
      emoji: '🔨',
      tagline: 'The auction-first live marketplace.',
      about: "Whatnot is the leading live auction and shopping platform in the US, built specifically for collectors, resellers, and enthusiast sellers. It launched in 2020 focused on trading cards and sneakers, and has since expanded to vintage clothing, comics, toys, luxury goods, and general merchandise. Whatnot sellers go live in scheduled shows, selling items individually through timed auctions or Buy It Now pricing, with buyers competing in real time.",
      audienceNote: "Whatnot buyers tend to be highly engaged collectors and enthusiasts. They're repeat buyers who follow specific sellers and tune in regularly. Show loyalty is strong — many Whatnot sellers build audiences that return every week for years.",
      features: [
        { icon: '◉', title: 'Buyer CRM sync', body: "Streamlive pulls your full Whatnot buyer history automatically — every buyer, every order, every item sold — into your unified CRM. Buyer handles, spend history, and auction wins are all captured and linked to a single buyer profile." },
        { icon: '◈', title: 'Live Companion integration', body: "When you go live on Whatnot, the Live Companion activates automatically. Your Whatnot viewer count appears in the platform strip. Every bid and purchase shows up in your real-time buyer feed with the buyer's full history — loyalty tier, lifetime spend, notes, and past orders." },
        { icon: '◆', title: 'Show attribution', body: "Every show you run on Whatnot is logged in Show History with total GMV, number of items sold, and per-buyer breakdowns. Post-show Order Review gives you a clean summary you can use to plan your next show or export for records." },
        { icon: '✦', title: 'Opt-in & loyalty', body: "Whatnot buyers who opt in through your Streamlive link get added to your buyer CRM with SMS and email consent on file. You can enroll them in your loyalty program and send show reminders to bring them back to your next live." },
      ],
    },
    'tiktok-shop': {
      name: 'TikTok Shop',
      color: '#f43f5e',
      emoji: '🎵',
      tagline: 'The fastest-growing live commerce channel in the world.',
      about: "TikTok Shop launched in the US in 2023 and grew faster than any live commerce platform in history. It combines TikTok's algorithm-driven discovery with native shopping — viewers can buy products without leaving the app. Live selling on TikTok happens through TikTok LIVE, where creators and sellers stream to their followers and algorithmically distributed audiences simultaneously.",
      audienceNote: "TikTok audiences skew younger and are highly impulse-driven. Discovery is algorithm-powered, so new viewers can find your show without being a follower first. This makes TikTok exceptional for new customer acquisition — but buyer loyalty requires active nurturing off-platform.",
      features: [
        { icon: '◉', title: 'Buyer CRM sync', body: "Streamlive connects to your TikTok Shop seller account and imports your full order history — buyer usernames, items purchased, order values, and dates. Every TikTok buyer gets a unified profile in your CRM alongside their activity on other platforms." },
        { icon: '◈', title: 'Live Companion integration', body: "TikTok viewer counts and order activity appear in the Live Companion in real time during your show. When a TikTok viewer converts to a buyer, they surface immediately in your buyer feed with their full profile — even if they also buy on other platforms." },
        { icon: '◆', title: 'ManyChat keyword automations', body: "Streamlive connects to ManyChat to power TikTok keyword DM automations. A viewer types a keyword in your TikTok LIVE chat, ManyChat sends them a DM with your product link or opt-in page automatically. No manual follow-up required." },
        { icon: '✦', title: 'Cross-platform attribution', body: "TikTok often drives buyers who then purchase on your Shopify store. Streamlive's Live Pixel captures these cross-platform conversions and links them back to the specific TikTok show that drove them — so your TikTok GMV is never undercounted." },
      ],
    },
    'instagram-live': {
      name: 'Instagram Live',
      color: '#ec4899',
      emoji: '📸',
      tagline: 'Live selling to your most loyal followers.',
      about: "Instagram Live is Meta's live video feature inside Instagram. Sellers go live directly from their Instagram profile and sell to their existing followers in real time. Instagram Live Shopping allows sellers to tag products from their Instagram Shop catalog during a live session, letting viewers tap to buy without leaving the app. It's less discovery-driven than TikTok, making it best suited for selling to an established, warm audience.",
      audienceNote: "Instagram Live audiences are typically existing followers — people who already know your brand and have opted in to see your content. This makes Instagram Live high-converting for repeat buyers and VIP audiences, but it requires a built-up following to drive meaningful volume.",
      features: [
        { icon: '◉', title: 'Buyer CRM sync', body: "Streamlive imports your Instagram buyer history through your Meta Business account — order records, buyer profiles, and purchase history all flow into your unified CRM. Instagram handles are linked to buyer profiles so you recognize buyers across platforms." },
        { icon: '◈', title: 'Live Companion integration', body: "Instagram Live viewer counts appear in the Live Companion platform strip during your show. Order activity from Instagram Live Shopping surfaces in your buyer feed in real time, with full buyer profiles attached — including their history from TikTok, Whatnot, or any other connected platform." },
        { icon: '◆', title: 'DM opt-in flow', body: "Streamlive connects to ManyChat to enable Instagram DM keyword automations. A viewer comments a keyword during your Instagram Live, and ManyChat automatically sends them a DM with your opt-in link or product URL. Opt-ins from Instagram capture consent and flow directly into your buyer CRM." },
        { icon: '✦', title: 'Quick Message', body: "After a show, use Streamlive's Quick Message tab in the Live Companion to send a pre-built Instagram DM to followers with a link to your Live Shop page — so viewers who missed the show can still browse and buy the full lineup." },
      ],
    },
    'amazon-live': {
      name: 'Amazon Live',
      color: '#f59e0b',
      emoji: '📦',
      tagline: "Live selling inside the world's largest store.",
      about: "Amazon Live is Amazon's native live shopping feature, available to brand-registered sellers and Amazon Influencers. Sellers stream directly on Amazon product pages and their Amazon storefront, demonstrating products to shoppers who are already in buying mode. Amazon Live sits at the bottom of the funnel — viewers are actively searching for products to buy, not browsing for entertainment — which makes conversion rates exceptionally high.",
      audienceNote: "Amazon Live audiences are purchase-intent shoppers. Unlike TikTok or Instagram where discovery is social, Amazon Live viewers find shows through product searches and Amazon's recommendation engine. They're already primed to buy — your job is to demonstrate and convince.",
      features: [
        { icon: '◉', title: 'Buyer CRM sync', body: "Streamlive imports your Amazon Live order data — buyer identifiers, product purchases, show dates, and order values — into your unified buyer CRM. Amazon buyer privacy restrictions mean we work with the data Amazon makes available to sellers through the API." },
        { icon: '◈', title: 'Live Companion integration', body: "Amazon Live viewer counts and purchase activity appear in your Live Companion during a show. Amazon orders convert in real time and surface in your buyer feed as they come in, giving you a live view of your Amazon GMV ticking up alongside your other platforms." },
        { icon: '◆', title: 'Show attribution', body: "Every Amazon Live show is tracked in your Show History with product-level attribution. You can see exactly which items sold, at what volume, and compare Amazon performance against other platforms for the same show — all in one post-show report." },
        { icon: '✦', title: 'Cross-platform buyer matching', body: "Buyers who purchase on Amazon and also engage on TikTok or Instagram can be matched in your CRM using email or contact information when available. This gives you a more complete view of your highest-value buyers across every channel they use." },
      ],
    },
    'youtube-live': {
      name: 'YouTube Live',
      color: '#ef4444',
      emoji: '▶️',
      tagline: 'Long-form live selling with first-party attribution.',
      about: "YouTube Live is Google's live streaming platform, the largest video platform in the world by watch time. YouTube Live Shopping launched in 2023, allowing creators and sellers to tag products directly in their live stream for viewers to purchase. YouTube's audiences tend toward longer watch times than TikTok or Instagram — viewers will stay for hours — making it well-suited for in-depth product demonstrations, unboxings, and educational selling.",
      audienceNote: "YouTube Live audiences are engaged, long-session viewers who are comfortable watching extended content. They research before buying and respond well to detailed product explanations, comparisons, and demonstrations. Building a YouTube audience takes longer than TikTok, but the buyer quality and average order value tend to be higher.",
      features: [
        { icon: '◉', title: 'Live Pixel attribution', body: "YouTube doesn't expose buyer data the same way as other platforms. Streamlive solves this with the YouTube Live Pixel — a lightweight JavaScript snippet installed on your Shopify store. When a viewer clicks from your stream to your store, the Pixel creates a session ID that follows them through checkout and links their purchase back to your specific YouTube show with 99% accuracy." },
        { icon: '◈', title: 'Live Companion integration', body: "YouTube viewer counts appear in your Live Companion platform strip in real time. Purchases attributed via Live Pixel surface in your buyer feed as they're confirmed — typically within seconds of checkout completion. Your YouTube GMV ticks up live alongside all other platforms." },
        { icon: '◆', title: 'Show attribution & reporting', body: "Post-show, your YouTube revenue is broken out in Order Review and Show History alongside TikTok, Whatnot, Instagram, and Amazon. You can see your total show GMV and exactly what percentage came from YouTube — the number most sellers have never been able to measure before." },
        { icon: '✦', title: 'Pixel setup', body: "Installing the Live Pixel takes under 5 minutes. Add a single script tag to your Shopify theme, connect your YouTube channel in Streamlive settings, and the Pixel activates automatically at the start of every YouTube Live. No ongoing maintenance required." },
      ],
    },
  }

  const p = platforms[slug]

  if (!p) {
    return (
      <PageShell>
        <div style={{ textAlign:'center', padding:'60px 0' }}>
          <div style={{ fontSize:48, marginBottom:16 }}>📡</div>
          <div style={{ fontFamily:"'Syne',sans-serif", fontSize:22, fontWeight:800, color:'#fff', marginBottom:8 }}>Platform not found</div>
          <button onClick={()=>navigate('/')} style={{ fontSize:13, color:'#7c3aed', background:'none', border:'none', cursor:'pointer', marginTop:8 }}>← Back to home</button>
        </div>
      </PageShell>
    )
  }

  return (
    <PageShell>
      <div className="page-fade">
        {/* Header */}
        <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:20 }}>
          <div style={{ width:52, height:52, borderRadius:16, background:`${p.color}18`, border:`1px solid ${p.color}33`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:26, flexShrink:0 }}>{p.emoji}</div>
          <div>
            <PLabel t="Platform"/>
            <div style={{ fontFamily:"'Syne',sans-serif", fontSize:28, fontWeight:800, color:'#fff', letterSpacing:'-0.8px', lineHeight:1.1 }}>{p.name}</div>
          </div>
        </div>
        <PSub>{p.tagline}</PSub>

        {/* About the platform */}
        <SectionTitle>About {p.name}</SectionTitle>
        <Body>{p.about}</Body>

        {/* Audience note */}
        <div style={{ background:`${p.color}0c`, border:`1px solid ${p.color}22`, borderRadius:12, padding:'16px 20px', margin:'8px 0 44px' }}>
          <div style={{ fontSize:10, fontWeight:800, color:p.color, textTransform:'uppercase', letterSpacing:'.1em', marginBottom:6 }}>Audience profile</div>
          <div style={{ fontSize:13, color:'#9ca3af', lineHeight:1.7 }}>{p.audienceNote}</div>
        </div>

        <Divider2/>

        {/* How Streamlive works with this platform */}
        <SectionTitle>How Streamlive works with {p.name}</SectionTitle>
        <div style={{ display:'flex', flexDirection:'column', gap:14, marginBottom:52 }}>
          {p.features.map((f, i) => (
            <div key={i} style={{ display:'flex', gap:16, padding:'20px', background:'#0a0a14', border:`1px solid ${p.color}22`, borderRadius:14 }}>
              <span style={{ fontSize:16, color:p.color, flexShrink:0, marginTop:1 }}>{f.icon}</span>
              <div>
                <div style={{ fontSize:14, fontWeight:700, color:'#fff', marginBottom:5 }}>{f.title}</div>
                <div style={{ fontSize:13, color:'#6b7280', lineHeight:1.65 }}>{f.body}</div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ background:'linear-gradient(135deg,#0d0d1e,#12103a)', border:`1px solid ${p.color}33`, borderRadius:16, padding:'28px', textAlign:'center' }}>
          <div style={{ fontFamily:"'Syne',sans-serif", fontSize:18, fontWeight:800, color:'#fff', marginBottom:8 }}>See {p.name} in the Live Companion</div>
          <div style={{ fontSize:13, color:'#6b7280', marginBottom:20 }}>Every platform is connected and running in the interactive demo.</div>
          <button onClick={()=>navigate('/')} style={{ background:`linear-gradient(135deg,${p.color},${p.color}bb)`, border:'none', color:'#fff', fontSize:13, fontWeight:700, padding:'11px 26px', borderRadius:10, cursor:'pointer' }}>Explore Streamlive →</button>
        </div>
      </div>
    </PageShell>
  )
}

// ─── CHECKOUT ─────────────────────────────────────────────────────────────────
function Checkout() {
  const params = new URLSearchParams(window.location.search)
  const [selectedPlan, setSelectedPlan] = useState(params.get('plan') || 'growth')
  const p = PLANS[selectedPlan] || PLANS.growth

  // Form fields
  const [email,    setEmail]    = useState('')
  const [name,     setName]     = useState('')
  const [cardNum,  setCardNum]  = useState('')
  const [expiry,   setExpiry]   = useState('')
  const [cvc,      setCvc]      = useState('')
  const [agreed,   setAgreed]   = useState(false)
  const [stage,    setStage]    = useState('idle') // idle | processing | success | error
  const [errMsg,   setErrMsg]   = useState('')

  // Card brand detection
  const cardBrand = (() => {
    const n = cardNum.replace(/\s/g,'')
    if (/^4/.test(n))          return { name:'Visa',       logo:'VISA',  color:'#1a1f71' }
    if (/^5[1-5]/.test(n))     return { name:'Mastercard', logo:'MC',    color:'#eb001b' }
    if (/^3[47]/.test(n))      return { name:'Amex',       logo:'AMEX',  color:'#2E77BC' }
    if (/^6011|^65/.test(n))   return { name:'Discover',   logo:'DISC',  color:'#e65c1e' }
    return null
  })()

  // Format card number with spaces
  const formatCard = (val) => {
    const digits = val.replace(/\D/g,'').slice(0,16)
    return digits.replace(/(.{4})/g,'$1 ').trim()
  }
  const formatExpiry = (val) => {
    const digits = val.replace(/\D/g,'').slice(0,4)
    if (digits.length >= 3) return digits.slice(0,2) + '/' + digits.slice(2)
    return digits
  }

  // Validation
  const isValidEmail  = email.includes('@') && email.includes('.')
  const isValidName   = name.trim().length > 2
  const rawCard       = cardNum.replace(/\s/g,'')
  const isValidCard   = rawCard.length === 16
  const isValidExpiry = /^\d{2}\/\d{2}$/.test(expiry) && (() => {
    const [m,y] = expiry.split('/').map(Number)
    const now = new Date(); const nm = now.getMonth()+1; const ny = now.getFullYear()%100
    return m >= 1 && m <= 12 && (y > ny || (y === ny && m >= nm))
  })()
  const isValidCvc    = cvc.length >= 3
  const canPay = isValidEmail && isValidName && isValidCard && isValidExpiry && isValidCvc && agreed

  const handlePay = async () => {
    if (!canPay || stage !== 'idle') return
    setStage('processing')
    setErrMsg('')
    // Simulate payment processing (1.8s) then go to /welcome
    await new Promise(r => setTimeout(r, 1800))
    navigate(`/welcome?plan=${selectedPlan}`)
  }

  const TRUST = [
    { icon:'🔒', label:'SSL Encrypted',   sub:'Your card data never touches our servers' },
    { icon:'↩',  label:'Cancel anytime',  sub:'No contracts. No fees. Ever.' },
    { icon:'✉',  label:'Instant receipt', sub:'Confirmation email within seconds' },
  ]

  const inputStyle = (valid, touched) => ({
    width:'100%', background:'#07070f',
    border:`1px solid ${touched && !valid ? '#ef444466' : touched && valid ? '#10b98144' : '#1e1e3a'}`,
    borderRadius:10, padding:'11px 14px', color:'#fff', fontSize:14,
    outline:'none', transition:'border-color .15s', fontFamily:"'DM Sans',sans-serif"
  })

  return (
    <>
      <style>{FONT}</style><style>{GLOBAL_CSS}</style>
      <style>{`
        .card-input-wrap { position:relative; }
        .card-brand-badge { position:absolute; right:12px; top:50%; transform:translateY(-50%); font-size:9px; font-weight:900; padding:2px 6px; border-radius:4px; letter-spacing:.05em; }
        @keyframes checkPop { 0%{transform:scale(0)} 60%{transform:scale(1.2)} 100%{transform:scale(1)} }
        .check-pop { animation: checkPop .35s ease both; }
      `}</style>
      <div style={{ minHeight:'100vh', background:'#06060e', overflowY:'auto' }}>
        <Nav currentPlan={selectedPlan} />

        <div style={{ maxWidth:1080, margin:'0 auto', padding:'20px 32px 0' }}>
          <button onClick={()=>navigate('/')} style={{ background:'none', border:'none', color:'#4b5563', fontSize:12, cursor:'pointer', padding:0 }}>← Back to plans</button>
        </div>
        <div style={{ maxWidth:1080, margin:'0 auto', padding:'20px 32px 0' }}>
          <div style={{ fontFamily:"'Syne',sans-serif", fontSize:26, fontWeight:800, color:'#fff', letterSpacing:'-0.5px', marginBottom:4 }}>Complete your subscription</div>
          <div style={{ fontSize:13, color:'#4b5563' }}>Pay securely below. You'll never leave Streamlive.</div>
        </div>

        <div style={{ maxWidth:1080, margin:'0 auto', padding:'28px 32px 80px', display:'grid', gridTemplateColumns:'1fr 460px', gap:32, alignItems:'start' }}>

          {/* LEFT - plan selector + features */}
          <div>
            <div style={{ marginBottom:28 }}>
              <div style={{ fontSize:10, fontWeight:700, color:'#4b5563', textTransform:'uppercase', letterSpacing:'0.09em', marginBottom:14 }}>Select plan</div>
              {Object.values(PLANS).map(plan => {
                const sel = selectedPlan === plan.id
                return (
                  <div key={plan.id} onClick={()=>{ setSelectedPlan(plan.id); navigate(`/checkout?plan=${plan.id}`) }}
                    style={{ background:sel?plan.bg:'#0a0a15', border:`1.5px solid ${sel?plan.color+'77':'#1e1e3a'}`, borderRadius:14, padding:'16px 20px', cursor:'pointer', transition:'all .18s', display:'flex', alignItems:'center', gap:16, marginBottom:10, position:'relative' }}>
                    {plan.popular && !sel && <div style={{ position:'absolute', right:14, top:-8, background:'#7c3aed', color:'#fff', fontSize:9, fontWeight:700, padding:'2px 10px', borderRadius:99, textTransform:'uppercase', letterSpacing:'0.06em' }}>Popular</div>}
                    <div style={{ width:42, height:42, borderRadius:12, background:sel?`${plan.color}20`:'#14142a', border:`1px solid ${sel?plan.color+'44':'#1e1e3a'}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, flexShrink:0 }}>{plan.emoji}</div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:14, fontWeight:700, color:sel?'#fff':'#9ca3af' }}>{plan.name}</div>
                      <div style={{ fontSize:11, color:sel?'#6b7280':'#374151', marginTop:2 }}>{plan.tagline}</div>
                    </div>
                    <div style={{ textAlign:'right', flexShrink:0 }}>
                      <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:20, fontWeight:700, color:sel?plan.color:'#374151' }}>${plan.price}</div>
                      <div style={{ fontSize:10, color:'#374151' }}>/mo</div>
                    </div>
                    <div style={{ width:20, height:20, borderRadius:'50%', border:`2px solid ${sel?plan.color:'#374151'}`, background:sel?plan.color:'transparent', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center', transition:'all .15s' }}>
                      {sel && <div style={{ width:7, height:7, borderRadius:'50%', background:'#fff' }} />}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Features */}
            <div style={{ background:'#0a0a15', border:'1px solid #14142a', borderRadius:16, padding:'22px 24px', marginBottom:20 }}>
              <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:18 }}>
                <span style={{ fontSize:24 }}>{p.emoji}</span>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:15, fontWeight:700, color:'#fff' }}>{p.name}: What's Included</div>
                  <div style={{ fontSize:11, color:'#4b5563', marginTop:2 }}>{p.tagline}</div>
                </div>
                <div style={{ textAlign:'right' }}>
                  <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:22, fontWeight:700, color:p.color }}>${p.price}</div>
                  <div style={{ fontSize:10, color:'#4b5563' }}>per month</div>
                </div>
              </div>
              <div style={{ borderTop:'1px solid #14142a', paddingTop:16, display:'grid', gridTemplateColumns:'1fr 1fr', gap:'8px 16px' }}>
                {p.features.map(f => (
                  <div key={f} style={{ display:'flex', gap:8, alignItems:'flex-start' }}>
                    <span style={{ color:p.color, fontSize:12, flexShrink:0, marginTop:2 }}>✓</span>
                    <span style={{ fontSize:12, color:'#9ca3af', lineHeight:1.5 }}>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Trust */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10 }}>
              {TRUST.map(t => (
                <div key={t.label} style={{ background:'#0a0a15', border:'1px solid #14142a', borderRadius:12, padding:'14px 16px' }}>
                  <div style={{ fontSize:20, marginBottom:8 }}>{t.icon}</div>
                  <div style={{ fontSize:11, fontWeight:700, color:'#d1d5db', marginBottom:4 }}>{t.label}</div>
                  <div style={{ fontSize:10, color:'#4b5563', lineHeight:1.5 }}>{t.sub}</div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT - payment form */}
          <div style={{ position:'sticky', top:80 }}>
            <div style={{ background:'linear-gradient(160deg,#0e0e1a,#09090f)', border:`1px solid ${p.color}33`, borderRadius:20, padding:28, boxShadow:`0 0 80px ${p.color}0d` }}>

              {/* Order summary */}
              <div style={{ marginBottom:22 }}>
                <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10 }}>
                  <span style={{ fontSize:20 }}>{p.emoji}</span>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:16, fontWeight:700, color:'#fff' }}>{p.name} Plan</div>
                    <div style={{ fontSize:11, color:'#4b5563' }}>{p.billing}</div>
                  </div>
                </div>
                <div style={{ display:'flex', alignItems:'baseline', gap:4, marginBottom:14 }}>
                  <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:34, fontWeight:700, color:p.color }}>${p.price}</span>
                  <span style={{ fontSize:13, color:'#4b5563' }}>/month</span>
                </div>
                <div style={{ background:'#0a0a15', border:'1px solid #14142a', borderRadius:10, padding:'10px 14px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <div>
                    <div style={{ fontSize:12, fontWeight:600, color:'#d1d5db' }}>Streamlive {p.name}</div>
                    <div style={{ fontSize:10, color:'#374151', marginTop:1 }}>Monthly · renews automatically</div>
                  </div>
                  <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:13, fontWeight:700, color:'#fff' }}>${p.price}.00</div>
                </div>
              </div>

              {/* ── FORM ── */}
              {stage === 'processing' ? (
                /* Processing state */
                <div style={{ textAlign:'center', padding:'28px 0' }}>
                  <div style={{ width:52, height:52, border:'3px solid #1e1e3a', borderTop:`3px solid ${p.color}`, borderRadius:'50%', animation:'spin .8s linear infinite', margin:'0 auto 20px' }} />
                  <div style={{ fontSize:15, fontWeight:700, color:'#fff', marginBottom:6 }}>Processing payment…</div>
                  <div style={{ fontSize:12, color:'#4b5563' }}>Please don't close this tab</div>
                </div>
              ) : (
                <div>
                  {/* Email */}
                  <div style={{ marginBottom:14 }}>
                    <label style={{ fontSize:10, fontWeight:700, color:'#6b7280', textTransform:'uppercase', letterSpacing:'0.07em', display:'block', marginBottom:7 }}>Email Address</label>
                    <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com"
                      style={inputStyle(isValidEmail, email.length > 0)} />
                  </div>

                  {/* Name on card */}
                  <div style={{ marginBottom:14 }}>
                    <label style={{ fontSize:10, fontWeight:700, color:'#6b7280', textTransform:'uppercase', letterSpacing:'0.07em', display:'block', marginBottom:7 }}>Name on Card</label>
                    <input value={name} onChange={e=>setName(e.target.value)} placeholder="Jane Smith"
                      style={inputStyle(isValidName, name.length > 0)} />
                  </div>

                  {/* Card number */}
                  <div style={{ marginBottom:14 }}>
                    <label style={{ fontSize:10, fontWeight:700, color:'#6b7280', textTransform:'uppercase', letterSpacing:'0.07em', display:'block', marginBottom:7 }}>Card Number</label>
                    <div className="card-input-wrap">
                      <input value={cardNum} onChange={e=>setCardNum(formatCard(e.target.value))} placeholder="1234 5678 9012 3456"
                        style={{ ...inputStyle(isValidCard, cardNum.length > 0), fontFamily:"'JetBrains Mono',monospace", letterSpacing:'0.12em', paddingRight:64 }} />
                      {cardBrand ? (
                        <span className="card-brand-badge" style={{ background:cardBrand.color, color:'#fff' }}>{cardBrand.logo}</span>
                      ) : cardNum.length > 0 ? (
                        <span style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', fontSize:16 }}>💳</span>
                      ) : null}
                    </div>
                  </div>

                  {/* Expiry + CVC */}
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:18 }}>
                    <div>
                      <label style={{ fontSize:10, fontWeight:700, color:'#6b7280', textTransform:'uppercase', letterSpacing:'0.07em', display:'block', marginBottom:7 }}>Expiry</label>
                      <input value={expiry} onChange={e=>setExpiry(formatExpiry(e.target.value))} placeholder="MM/YY"
                        style={{ ...inputStyle(isValidExpiry, expiry.length > 0), fontFamily:"'JetBrains Mono',monospace", letterSpacing:'0.1em' }} />
                    </div>
                    <div>
                      <label style={{ fontSize:10, fontWeight:700, color:'#6b7280', textTransform:'uppercase', letterSpacing:'0.07em', display:'block', marginBottom:7 }}>CVC</label>
                      <input value={cvc} onChange={e=>setCvc(e.target.value.replace(/\D/g,'').slice(0,4))} placeholder="123"
                        type="password"
                        style={{ ...inputStyle(isValidCvc, cvc.length > 0), fontFamily:"'JetBrains Mono',monospace", letterSpacing:'0.2em' }} />
                    </div>
                  </div>

                  {/* Terms */}
                  <div style={{ display:'flex', gap:10, alignItems:'flex-start', marginBottom:20, cursor:'pointer' }} onClick={()=>setAgreed(v=>!v)}>
                    <div style={{ width:18, height:18, borderRadius:5, border:`2px solid ${agreed?p.color:'#374151'}`, background:agreed?p.color:'transparent', flexShrink:0, marginTop:2, display:'flex', alignItems:'center', justifyContent:'center', transition:'all .15s' }}>
                      {agreed && <span className="check-pop" style={{ fontSize:10, color:'#fff', fontWeight:800, lineHeight:1 }}>✓</span>}
                    </div>
                    <span style={{ fontSize:11, color:'#6b7280', lineHeight:1.65 }}>
                      I agree to Streamlive's <a href="#" style={{ color:'#a78bfa', textDecoration:'none' }}>Terms</a> and <a href="#" style={{ color:'#a78bfa', textDecoration:'none' }}>Privacy Policy</a>
                    </span>
                  </div>

                  {/* Error */}
                  {errMsg && <div style={{ background:'#2d0808', border:'1px solid #ef444444', borderRadius:8, padding:'10px 14px', fontSize:12, color:'#f87171', marginBottom:14 }}>{errMsg}</div>}

                  {/* Pay button */}
                  <button disabled={!canPay} onClick={handlePay}
                    className={canPay ? 'cta-btn' : ''}
                    style={{ width:'100%', background:canPay?`linear-gradient(135deg,${p.color},${p.color}aa)`:'#14142a', border:`1px solid ${canPay?p.color+'55':'#1e1e3a'}`, color:canPay?'#fff':'#374151', fontSize:14, fontWeight:700, padding:13, borderRadius:11, cursor:canPay?'pointer':'default', transition:'all .2s', marginBottom:14 }}>
                    <span style={{ display:'flex', alignItems:'center', gap:8, justifyContent:'center' }}>
                      🔒 Pay ${p.price}.00 · Start {p.name}
                    </span>
                  </button>

                  {/* Stripe badge */}
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:7 }}>
                    <svg width="38" height="16" viewBox="0 0 60 25" fill="none">
                      <rect width="60" height="25" rx="4" fill="#635bff"/>
                      <text x="30" y="17" textAnchor="middle" fill="white" fontSize="12" fontWeight="700" fontFamily="sans-serif">stripe</text>
                    </svg>
                    <span style={{ fontSize:10, color:'#374151' }}>256-bit SSL · PCI compliant</span>
                  </div>
                </div>
              )}
            </div>

            <div style={{ textAlign:'center', marginTop:12 }}>
              <p style={{ fontSize:11, color:'#374151' }}>Questions? <a href="mailto:hello@strmlive.com" style={{ color:'#a78bfa', textDecoration:'none' }}>hello@strmlive.com</a></p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

// ─── WELCOME ──────────────────────────────────────────────────────────────────
function Welcome() {
  const plan = new URLSearchParams(window.location.search).get('plan') || 'starter'
  const p = PLANS[plan] || PLANS.starter

  return (
    <>
      <style>{FONT}</style><style>{GLOBAL_CSS}</style>
      <div style={{ minHeight:'100vh', background:'#06060e', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'40px 24px' }}>
        <div className="fade-a0" style={{ display:'flex', alignItems:'center', gap:8, marginBottom:48 }}>
          <div style={{ width:28, height:28, borderRadius:8, background:'linear-gradient(135deg,#7c3aed,#4f46e5)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:900, color:'#fff' }}>S</div>
          <span style={{ fontFamily:"'Syne',sans-serif", fontSize:16, fontWeight:800, color:'#fff' }}>Streamlive</span>
        </div>
        <div style={{ width:'100%', maxWidth:560 }}>
          <div className="pop" style={{ textAlign:'center', marginBottom:28 }}>
            <div style={{ display:'inline-flex', alignItems:'center', justifyContent:'center', width:72, height:72, borderRadius:'50%', background:`${p.color}18`, border:`2px solid ${p.color}44`, fontSize:32, marginBottom:16 }}>{p.emoji}</div>
            <div style={{ display:'inline-flex', alignItems:'center', gap:6, background:'#0a1e16', border:'1px solid #10b98144', borderRadius:99, padding:'4px 14px', marginLeft:12 }}>
              <div style={{ width:6, height:6, borderRadius:'50%', background:'#10b981', animation:'pulse 2s infinite' }} />
              <span style={{ fontSize:11, fontWeight:700, color:'#10b981', textTransform:'uppercase', letterSpacing:'0.06em' }}>Payment confirmed</span>
            </div>
          </div>
          <div className="fade-a1" style={{ textAlign:'center', marginBottom:32 }}>
            <div style={{ fontFamily:"'Syne',sans-serif", fontSize:28, fontWeight:800, color:'#fff', letterSpacing:'-0.5px', marginBottom:10 }}>{p.headline}</div>
            <p style={{ fontSize:15, color:'#6b7280', lineHeight:1.6 }}>{p.subline}</p>
          </div>
          <div className="fade-a1" style={{ display:'flex', justifyContent:'center', marginBottom:28 }}>
            <div style={{ background:`${p.color}12`, border:`1px solid ${p.color}33`, borderRadius:10, padding:'10px 24px', display:'flex', alignItems:'center', gap:10 }}>
              <span style={{ fontSize:11, fontWeight:700, color:p.color, textTransform:'uppercase', letterSpacing:'0.08em' }}>{p.name} Plan</span>
              <div style={{ width:1, height:12, background:`${p.color}44` }} />
              <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:13, fontWeight:700, color:'#fff' }}>${p.price}/mo</span>
            </div>
          </div>
          <div className="fade-a2" style={{ background:'#0a0a15', border:'1px solid #14142a', borderRadius:16, padding:'22px 24px', marginBottom:20 }}>
            <div style={{ fontSize:10, fontWeight:700, color:'#4b5563', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:14 }}>What you unlocked</div>
            {p.features.map((f,i) => (
              <div key={i} style={{ display:'flex', gap:10, marginBottom:10, alignItems:'flex-start' }}>
                <span style={{ color:p.color, fontSize:12, flexShrink:0, marginTop:2 }}>✓</span>
                <span style={{ fontSize:13, color:'#9ca3af', lineHeight:1.5 }}>{f}</span>
              </div>
            ))}
          </div>
          <div className="fade-a3">
            <button onClick={()=>{ window.location.href = p.id === 'starter' ? '/app?onboard=settings' : p.id === 'growth' ? '/app?onboard=settings' : '/app?onboard=settings' }} className="cta-btn"
              style={{ width:'100%', background:'linear-gradient(135deg,#7c3aed,#4f46e5)', border:'none', color:'#fff', fontSize:15, fontWeight:700, padding:14, borderRadius:12, cursor:'pointer', marginBottom:10 }}>
              {p.nextLabel}
            </button>
            <p style={{ textAlign:'center', fontSize:12, color:'#3d3d6e' }}>{p.nextHint}</p>
          </div>
          <div className="fade-a3" style={{ textAlign:'center', marginTop:28, paddingTop:24, borderTop:'1px solid #14142a' }}>
            <p style={{ fontSize:12, color:'#4b5563' }}>Questions? Email us at <a href="mailto:hello@strmlive.com" style={{ color:'#a78bfa', textDecoration:'none' }}>hello@strmlive.com</a></p>
          </div>
        </div>
      </div>
    </>
  )
}


// ─── SELLER DATA (for opt-in page) ────────────────────────────────────────────
const SELLER_PROFILES = {
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
};

const PLATFORM_META = {
  WN: { label: "Whatnot",      color: "#7c3aed", icon: "◈", placeholder: "@yourhandle",  manychat: false, dmNote: null },
  TT: { label: "TikTok",       color: "#f43f5e", icon: "♦", placeholder: "@yourhandle",  manychat: true,  dmNote: "DM us your keyword on TikTok to activate show alerts" },
  AM: { label: "Amazon Live",  color: "#f59e0b", icon: "◆", placeholder: null,            manychat: false, dmNote: null },
  IG: { label: "Instagram",    color: "#ec4899", icon: "●", placeholder: "@yourhandle",  manychat: true,  dmNote: "DM us your keyword on Instagram to activate show alerts" },
};
// Platforms we collect handles for (excludes Amazon - no user DMs possible)
const DM_PLATFORMS = ["WN", "TT", "IG"];


// ─── LIVE SHOP PAGE (public, shareable URL) ────────────────────────────────────
// Route: /live/:shopSlug/:showSlug
// This is the buyer-facing landing page sent via SMS/DM during a live show.
// In production it pulls live session data from the API. Here it uses demo data.

const LIVE_SHOP_DATA = {
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
        name: "New Shade Drop — Live",
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
};

function LiveShopPage({ shopSlug, showSlug }) {
  const seller    = SELLER_PROFILES[shopSlug];

  // Resolve seller first — everything else depends on it
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

                  {/* Buy Now — full text on desktop, arrow-only on mobile handled via min-width */}
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

// ─── OPT-IN PAGE ──────────────────────────────────────────────────────────────
function OptInPage({ slug, connectedPlatforms }) {
  const seller = SELLER_PROFILES[slug];
  // Use live connected platforms if provided, fall back to profile default
  const activePlatforms = connectedPlatforms || seller?.platforms || [];
  const [step, setStep] = useState("form"); // form | success
  const [firstName, setFirstName] = useState("");
  const [email, setEmail]         = useState("");
  const [phone, setPhone]         = useState("");
  const [handles, setHandles]     = useState({});
  const [emailOptIn, setEmailOptIn]   = useState(true);
  const [smsOptIn, setSmsOptIn]       = useState(true);
  const [submitting, setSubmitting]   = useState(false);
  const [errors, setErrors]           = useState({});

  const formatPhone = (val) => {
    const digits = val.replace(/\D/g, "").slice(0, 10);
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `(${digits.slice(0,3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0,3)}) ${digits.slice(3,6)}-${digits.slice(6)}`;
  };

  const validate = () => {
    const e = {};
    if (!firstName.trim()) e.firstName = "Required";
    if (!email.includes("@") || !email.includes(".")) e.email = "Enter a valid email";
    if (smsOptIn && phone.replace(/\D/g,"").length < 10) e.phone = "Enter a valid phone number";
    if (!emailOptIn && !smsOptIn) e.consent = "Please choose at least one way to stay in touch";
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setSubmitting(true);
    setTimeout(() => { setStep("success"); }, 1800);
  };

  if (!seller) {
    return (
      <div style={{ minHeight:"100vh", background:"#06060e", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"DM Sans,sans-serif" }}>
        <div style={{ textAlign:"center", color:"#6b7280" }}>
          <div style={{ fontSize:48, marginBottom:16 }}>404</div>
          <div style={{ fontSize:16 }}>This opt-in page doesn't exist.</div>
          <a href="/" style={{ color:"#7c3aed", marginTop:12, display:"block" }}>← Back to Streamlive</a>
        </div>
      </div>
    );
  }

  const accentRgb = seller.color;

  if (step === "success") {
    return (
      <div style={{ minHeight:"100vh", background:"#06060e", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'DM Sans',sans-serif", padding:24 }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600;700&display=swap'); * { box-sizing:border-box; margin:0; padding:0; }`}</style>
        <div style={{ maxWidth:480, width:"100%", textAlign:"center" }}>
          <div style={{ width:80, height:80, borderRadius:"50%", background:`${accentRgb}22`, border:`2px solid ${accentRgb}44`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:36, margin:"0 auto 24px" }}>✓</div>
          <div style={{ fontFamily:"'Syne',sans-serif", fontSize:28, fontWeight:800, color:"#fff", marginBottom:8, letterSpacing:"-0.5px" }}>You're in, {firstName}!</div>
          <div style={{ fontSize:15, color:"#9ca3af", lineHeight:1.7, marginBottom:32 }}>
            Welcome to the <span style={{ color:"#fff", fontWeight:600 }}>{seller.name}</span> subscriber list.
            You'll be the first to know about shows, exclusive drops, and VIP offers.
          </div>
          <div style={{ background:"#0d0d1a", border:"1px solid #1e1e3a", borderRadius:14, padding:"20px 24px", marginBottom:16, textAlign:"left" }}>
            <div style={{ fontSize:11, color:"#6b7280", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:14 }}>What to expect</div>
            {seller.perks.map((p,i) => (
              <div key={i} style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 0", borderBottom:i<seller.perks.length-1?"1px solid #1e1e3a":"none" }}>
                <span style={{ fontSize:14 }}>{p.split(" ")[0]}</span>
                <span style={{ fontSize:13, color:"#d1d5db" }}>{p.slice(p.indexOf(" ")+1)}</span>
              </div>
            ))}
          </div>
          {/* ManyChat activation steps */}
          {activePlatforms.filter(p=>PLATFORM_META[p]?.manychat).length > 0 && (
            <div style={{ background:"#0d1a1f", border:"1px solid #1e3a2e", borderRadius:14, padding:"20px 24px", marginBottom:16, textAlign:"left" }}>
              <div style={{ fontSize:11, color:"#34d399", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:14 }}>🔔 Activate your DM alerts</div>
              <div style={{ fontSize:12, color:"#9ca3af", marginBottom:14, lineHeight:1.6 }}>
                To receive show alerts as a direct message, send <span style={{ fontFamily:"'JetBrains Mono',monospace", background:"#0a1e16", border:"1px solid #34d39933", padding:"2px 8px", borderRadius:4, color:"#34d399", fontWeight:600 }}>JOIN</span> to {seller.name} on each platform:
              </div>
              {activePlatforms.filter(p=>PLATFORM_META[p]?.manychat).map(p => {
                const pm = PLATFORM_META[p];
                return (
                  <div key={p} style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 0", borderBottom:"1px solid #1e1e3a" }}>
                    <div style={{ width:32, height:32, borderRadius:8, background:`${pm.color}18`, border:`1px solid ${pm.color}33`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, flexShrink:0 }}>
                      {p === "TT" ? "♦" : "●"}
                    </div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:12, fontWeight:700, color:"#fff" }}>DM on {pm.label}</div>
                      <div style={{ fontSize:11, color:"#6b7280", marginTop:2 }}>Open {pm.label} → find <span style={{ color:pm.color }}>@{seller.name.toLowerCase().replace(/\s/g,"")}</span> → send "JOIN"</div>
                    </div>
                    <span style={{ fontSize:11, fontWeight:700, color:pm.color, background:`${pm.color}15`, border:`1px solid ${pm.color}33`, padding:"3px 10px", borderRadius:6 }}>Required</span>
                  </div>
                );
              })}
              <div style={{ fontSize:11, color:"#4b5563", marginTop:12, lineHeight:1.5 }}>
                This activates ManyChat so {seller.name} can send you instant alerts on these platforms. Only takes 30 seconds.
              </div>
            </div>
          )}
          <a href={`https://strmlive.com/s/${slug}`} style={{ fontSize:13, color:"#6b7280", textDecoration:"none" }}>← Back to page</a>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight:"100vh", background:"#06060e", fontFamily:"'DM Sans',sans-serif", display:"flex", flexDirection:"column" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600;700&display=swap');
        * { box-sizing:border-box; margin:0; padding:0; }
        body { background:#06060e; }
        .opt-input { width:100%; background:#0d0d1a; border:1.5px solid #1e1e3a; border-radius:10px; padding:12px 16px; color:#fff; font-family:'DM Sans',sans-serif; font-size:14px; outline:none; transition:border-color .15s; }
        .opt-input:focus { border-color:${accentRgb}88; }
        .opt-input::placeholder { color:#4b5563; }
        .opt-input.error { border-color:#ef444488; }
        .toggle-check { display:flex; align-items:flex-start; gap:12; cursor:pointer; }
        .check-box { width:20px; height:20px; border-radius:6px; border:2px solid #374151; background:transparent; flex-shrink:0; display:flex; align-items:center; justify-content:center; transition:all .15s; margin-top:1px; }
        .check-box.checked { background:${accentRgb}; border-color:${accentRgb}; }
      `}</style>

      {/* HERO BANNER */}
      <div style={{ background:`linear-gradient(160deg, ${accentRgb}18 0%, #06060e 60%)`, borderBottom:"1px solid #1e1e3a", padding:"48px 24px 40px" }}>
        <div style={{ maxWidth:560, margin:"0 auto", textAlign:"center" }}>
          {/* Avatar */}
          <div style={{ width:72, height:72, borderRadius:"50%", background:`${accentRgb}22`, border:`2px solid ${accentRgb}55`, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 16px", fontFamily:"'Syne',sans-serif", fontSize:22, fontWeight:800, color:accentRgb }}>
            {resolvedSeller.avatar}
          </div>
          <div style={{ fontSize:11, fontWeight:700, color:accentRgb, textTransform:"uppercase", letterSpacing:"0.12em", marginBottom:8 }}>{seller.category}</div>
          <div style={{ fontFamily:"'Syne',sans-serif", fontSize:30, fontWeight:800, color:"#fff", letterSpacing:"-0.5px", marginBottom:12, lineHeight:1.2 }}>
            Join the {seller.name}<br />VIP List {seller.badge}
          </div>
          <div style={{ fontSize:15, color:"#9ca3af", lineHeight:1.7, maxWidth:420, margin:"0 auto 20px" }}>{seller.bio}</div>
          {/* Social proof */}
          <div style={{ display:"flex", gap:8, justifyContent:"center", flexWrap:"wrap" }}>
            <div style={{ background:"#0d0d1a", border:"1px solid #1e1e3a", borderRadius:20, padding:"5px 14px", fontSize:12, color:"#9ca3af" }}>
              <span style={{ color:"#fff", fontWeight:700 }}>{seller.followers}</span> live followers
            </div>
            {activePlatforms.map(p => (
              <div key={p} style={{ background:`${PLATFORM_META[p].color}15`, border:`1px solid ${PLATFORM_META[p].color}33`, borderRadius:20, padding:"5px 14px", fontSize:12, color:PLATFORM_META[p].color, fontWeight:600 }}>
                {PLATFORM_META[p].label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FORM */}
      <div style={{ flex:1, padding:"32px 24px 48px" }}>
        <div style={{ maxWidth:480, margin:"0 auto" }}>

          {/* Perks */}
          <div style={{ background:"#0d0d1a", border:"1px solid #1e1e3a", borderRadius:14, padding:"18px 20px", marginBottom:28 }}>
            <div style={{ fontSize:11, fontWeight:700, color:"#6b7280", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:12 }}>When you join you get</div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
              {seller.perks.map((p,i) => (
                <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:8 }}>
                  <span style={{ fontSize:14, flexShrink:0, marginTop:1 }}>{p.split(" ")[0]}</span>
                  <span style={{ fontSize:12, color:"#d1d5db", lineHeight:1.5 }}>{p.slice(p.indexOf(" ")+1)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Form fields */}
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>

            {/* Name */}
            <div>
              <label style={{ fontSize:12, fontWeight:600, color:"#9ca3af", display:"block", marginBottom:6 }}>First Name *</label>
              <input
                className={`opt-input${errors.firstName?" error":""}`}
                placeholder="Your first name"
                value={firstName}
                onChange={e=>{ setFirstName(e.target.value); setErrors(er=>({...er,firstName:null})); }}
              />
              {errors.firstName && <div style={{ fontSize:11, color:"#ef4444", marginTop:4 }}>{errors.firstName}</div>}
            </div>

            {/* Email */}
            <div>
              <label style={{ fontSize:12, fontWeight:600, color:"#9ca3af", display:"block", marginBottom:6 }}>Email Address *</label>
              <input
                className={`opt-input${errors.email?" error":""}`}
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e=>{ setEmail(e.target.value); setErrors(er=>({...er,email:null})); }}
              />
              {errors.email && <div style={{ fontSize:11, color:"#ef4444", marginTop:4 }}>{errors.email}</div>}
            </div>

            {/* Phone */}
            <div>
              <label style={{ fontSize:12, fontWeight:600, color:"#9ca3af", display:"block", marginBottom:6 }}>
                Phone Number <span style={{ color:"#6b7280", fontWeight:400 }}>(for SMS alerts)</span>
              </label>
              <input
                className={`opt-input${errors.phone?" error":""}`}
                type="tel"
                placeholder="(555) 000-0000"
                value={phone}
                onChange={e=>{ setPhone(formatPhone(e.target.value)); setErrors(er=>({...er,phone:null})); }}
              />
              {errors.phone && <div style={{ fontSize:11, color:"#ef4444", marginTop:4 }}>{errors.phone}</div>}
            </div>

            {/* Platform handles */}
            {(() => {
              const dmPlatforms = activePlatforms.filter(p => DM_PLATFORMS.includes(p));
              if (dmPlatforms.length === 0) return null;
              return (
                <div>
                  <label style={{ fontSize:12, fontWeight:600, color:"#9ca3af", display:"block", marginBottom:4 }}>
                    Your Handles <span style={{ color:"#6b7280", fontWeight:400 }}>(so we can recognize you in chat)</span>
                  </label>
                  <div style={{ fontSize:11, color:"#6b7280", marginBottom:10, lineHeight:1.5 }}>
                    Optional. Helps us match you across platforms and send personalized DMs.
                  </div>
                  <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                    {dmPlatforms.map(p => {
                      const pm = PLATFORM_META[p];
                      const hasHandle = handles[p] && handles[p].length > 1;
                      return (
                        <div key={p}>
                          <div style={{ display:"flex", alignItems:"center", gap:10, background:"#0d0d1a", border:`1.5px solid ${hasHandle?pm.color+"55":"#1e1e3a"}`, borderRadius:10, padding:"10px 14px", transition:"border-color .15s" }}>
                            <span style={{ fontSize:11, fontWeight:700, color:pm.color, minWidth:68 }}>{pm.label}</span>
                            <input
                              style={{ flex:1, background:"none", border:"none", color:"#fff", fontSize:14, outline:"none", fontFamily:"'DM Sans',sans-serif" }}
                              placeholder={pm.placeholder}
                              value={handles[p]||""}
                              onChange={e=>setHandles(h=>({...h,[p]:e.target.value}))}
                            />
                          </div>
                          {pm.manychat && hasHandle && (
                            <div style={{ display:"flex", alignItems:"flex-start", gap:8, background:`${pm.color}0d`, border:`1px solid ${pm.color}22`, borderRadius:8, padding:"9px 12px", marginTop:6 }}>
                              <span style={{ fontSize:13, flexShrink:0, marginTop:1 }}>💬</span>
                              <div>
                                <div style={{ fontSize:11, fontWeight:700, color:pm.color, marginBottom:2 }}>Activate {pm.label} DMs</div>
                                <div style={{ fontSize:11, color:"#9ca3af", lineHeight:1.5 }}>
                                  To receive show alerts via {pm.label} DM, send the message{" "}
                                  <span style={{ fontFamily:"'JetBrains Mono',monospace", background:"#0d0d1a", border:`1px solid ${pm.color}33`, padding:"1px 7px", borderRadius:4, color:"#fff", fontWeight:600 }}>JOIN</span>
                                  {" "}to <span style={{ color:pm.color, fontWeight:600 }}>@{seller.name.toLowerCase().replace(/\s/g,"")}</span> on {pm.label} after signing up.
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })()}

            {/* Consent checkboxes */}
            <div style={{ background:"#0d0d1a", border:`1px solid ${errors.consent?"#ef444444":"#1e1e3a"}`, borderRadius:12, padding:"16px 18px" }}>
              <div style={{ fontSize:12, fontWeight:700, color:"#9ca3af", marginBottom:12 }}>How do you want to hear from {seller.name}?</div>
              <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                <label style={{ display:"flex", alignItems:"flex-start", gap:12, cursor:"pointer" }} onClick={()=>setEmailOptIn(v=>!v)}>
                  <div style={{ width:20, height:20, borderRadius:6, border:`2px solid ${emailOptIn?accentRgb:"#374151"}`, background:emailOptIn?accentRgb:"transparent", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center", marginTop:1, transition:"all .15s" }}>
                    {emailOptIn && <span style={{ color:"#fff", fontSize:12, fontWeight:700 }}>✓</span>}
                  </div>
                  <div>
                    <div style={{ fontSize:13, color:"#fff", fontWeight:600 }}>Email updates</div>
                    <div style={{ fontSize:11, color:"#6b7280", marginTop:2 }}>Show schedules, exclusive drops, and VIP offers</div>
                  </div>
                </label>
                <label style={{ display:"flex", alignItems:"flex-start", gap:12, cursor:"pointer" }} onClick={()=>setSmsOptIn(v=>!v)}>
                  <div style={{ width:20, height:20, borderRadius:6, border:`2px solid ${smsOptIn?accentRgb:"#374151"}`, background:smsOptIn?accentRgb:"transparent", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center", marginTop:1, transition:"all .15s" }}>
                    {smsOptIn && <span style={{ color:"#fff", fontSize:12, fontWeight:700 }}>✓</span>}
                  </div>
                  <div>
                    <div style={{ fontSize:13, color:"#fff", fontWeight:600 }}>SMS alerts</div>
                    <div style={{ fontSize:11, color:"#6b7280", marginTop:2 }}>Instant show alerts. Never miss a live drop.</div>
                  </div>
                </label>
              </div>
              {errors.consent && <div style={{ fontSize:11, color:"#ef4444", marginTop:10 }}>{errors.consent}</div>}
            </div>

            {/* CTA Button */}
            <button
              onClick={handleSubmit}
              disabled={submitting}
              style={{ width:"100%", background:submitting?"#374151":`linear-gradient(135deg,${accentRgb},${accentRgb}cc)`, border:"none", color:"#fff", fontSize:15, fontWeight:700, padding:"15px", borderRadius:12, cursor:submitting?"not-allowed":"pointer", transition:"all .2s", marginTop:4, letterSpacing:"-0.2px" }}
            >
              {submitting ? "Joining..." : `Join ${seller.name}'s VIP List →`}
            </button>

            {/* Legal */}
            <p style={{ fontSize:11, color:"#4b5563", textAlign:"center", lineHeight:1.6 }}>
              By subscribing you agree to receive marketing messages from <strong style={{ color:"#6b7280" }}>{seller.name}</strong> via Streamlive.
              Message & data rates may apply. Reply STOP to unsubscribe at any time.{" "}
              <a href="#" style={{ color:"#6b7280" }}>Privacy Policy</a>
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ padding:"16px 24px", borderTop:"1px solid #1e1e3a", textAlign:"center" }}>
        <a href="https://strmlive.com" style={{ fontSize:11, color:"#4b5563", textDecoration:"none" }}>
          Powered by <span style={{ color:"#7c3aed", fontWeight:700 }}>Streamlive</span>
        </a>
      </div>
    </div>
  );
}

// ─── ROOT ROUTER ──────────────────────────────────────────────────────────────
// ─── PERSONA PLATFORM CONFIG (mirrors StreamlivePrototype PERSONAS) ───────────
const PERSONA_PLATFORMS = {
  bananarepublic: ["TT", "IG", "AM"],
  kyliecosmetics: ["TT", "IG"],
  tropicfeel:     ["IG", "AM"],
  walmartlive:    ["WN", "TT", "AM", "IG"],
};

// ─── LIVE DOT CURSOR (shared across all routes) ───────────────────────────────
function LiveCursor() {
  const [pos,     setPos]     = useState({ x: -100, y: -100 });
  const [clicked, setClicked] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Strip cursor from any element that has it inline — runs on mount + DOM changes
    const stripCursors = (root = document.body) => {
      root.querySelectorAll('*').forEach(el => {
        if (el.style.cursor) el.style.cursor = '';
      });
    };

    // Inject stylesheet cursor:none as a fallback layer
    const styleEl = document.createElement('style');
    styleEl.id = 'live-cursor-hide';
    styleEl.textContent = `
      html, body { cursor: none !important; }
      *:not(button):not(a):not(input):not(select):not(textarea):not([role="button"]) { cursor: none !important; }
      button, a, input, select, textarea, [role="button"], label { cursor: pointer !important; }
      button:disabled, input[type="text"]:not([disabled]), input[type="email"]:not([disabled]) { cursor: default !important; }
    `;
    document.head.appendChild(styleEl);

    // Strip existing inline cursors immediately
    stripCursors();

    // Watch for new elements added by React renders
    const observer = new MutationObserver((mutations) => {
      mutations.forEach(m => {
        m.addedNodes.forEach(node => {
          if (node.nodeType === 1) {
            if (node.style?.cursor) node.style.cursor = '';
            node.querySelectorAll?.('*')?.forEach(el => {
              if (el.style.cursor) el.style.cursor = '';
            });
          }
        });
        // Also catch attribute changes (React updating style prop)
        if (m.type === 'attributes' && m.attributeName === 'style') {
          if (m.target.style?.cursor) m.target.style.cursor = '';
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style'],
    });

    const onMove  = (e) => { setPos({ x: e.clientX, y: e.clientY }); setVisible(true); };
    const onDown  = ()  => setClicked(true);
    const onUp    = ()  => setTimeout(() => setClicked(false), 400);
    const onLeave = ()  => setVisible(false);
    const onEnter = ()  => setVisible(true);

    window.addEventListener('mousemove',  onMove);
    window.addEventListener('mousedown',  onDown);
    window.addEventListener('mouseup',    onUp);
    document.documentElement.addEventListener('mouseleave', onLeave);
    document.documentElement.addEventListener('mouseenter', onEnter);

    return () => {
      observer.disconnect();
      if (document.head.contains(styleEl)) document.head.removeChild(styleEl);
      window.removeEventListener('mousemove',  onMove);
      window.removeEventListener('mousedown',  onDown);
      window.removeEventListener('mouseup',    onUp);
      document.documentElement.removeEventListener('mouseleave', onLeave);
      document.documentElement.removeEventListener('mouseenter', onEnter);
    };
  }, []);

  const color = clicked ? '#10b981' : '#ef4444';
  if (!visible) return null;

  return (
    <div style={{ position:'fixed', left:pos.x, top:pos.y, pointerEvents:'none', zIndex:999999 }}>
      {/* Pulse ring */}
      <div style={{
        position:'absolute', width:14, height:14, borderRadius:'50%',
        background: color,
        transform:'translate(-50%,-50%)',
        animation:'livePulse 1.2s ease-out infinite',
        transition:'background 0.15s ease',
      }}/>
      {/* Solid core */}
      <div style={{
        position:'absolute', width:8, height:8, borderRadius:'50%',
        background: color,
        transform: clicked ? 'translate(-50%,-50%) scale(1.4)' : 'translate(-50%,-50%) scale(1)',
        boxShadow: `0 0 ${clicked ? '10px 3px' : '6px 2px'} ${color}99`,
        transition:'background 0.15s ease, box-shadow 0.15s ease, transform 0.1s ease',
      }}/>
    </div>
  );
}

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
       route.startsWith('/platform/') ? <PlatformPage slug={route.split('/platform/')[1]} /> :
       <Landing />}
    </>
  );
}
