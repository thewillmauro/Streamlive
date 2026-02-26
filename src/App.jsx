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
      'Buyer CRM — all platforms unified',
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
      'AI Insights — 6 weekly business recommendations',
      'SMS campaigns (5,000/month)',
      'Instagram & all 4 platform sync',
      'Loyalty Hub (all 4 tiers incl. VIP)',
      'ManyChat DM automation (TikTok + Instagram)',
      'Audience segmentation & win-back campaigns',
      'Show Planner with multi-platform streaming',
    ],
    notIncluded:['Production suite','DJI / Sony SDK control','White label','Dedicated support'],
    nextLabel:'Set up your platforms →',
    nextHint:"Connect Whatnot and it activates automatically when you go live.",
    billing:'Billed monthly. Cancel anytime.',
  },
  pro: {
    id:'pro', name:'Pro', price:399, color:'#f59e0b', bg:'#2e1f0a22', border:'#f59e0b33',
    emoji:'⚡', tagline:'For power sellers at full scale',
    headline:"Pro activated. You're operating at full power.",
    subline:'Every feature unlocked — Production suite, full AI, multi-platform at scale.',
    features:[
      'Everything in Growth',
      'Production suite — Sony FX3/FX6, DJI Gimbal control',
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
      'White label — your brand, your domain',
      'Unlimited team seats with role permissions',
      'Dedicated account manager',
      'Custom SDK & API integrations',
      'SSO (Single Sign-On)',
      'SLA — 99.9% uptime guarantee',
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
  *, *:hover, *:focus, *:active { cursor: none !important; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-thumb { background: #1e1e3a; border-radius: 4px; }
  @keyframes float     { 0%,100% { transform:translateY(0) } 50% { transform:translateY(-12px) } }
  @keyframes fadeUp    { from { opacity:0; transform:translateY(20px) } to { opacity:1; transform:translateY(0) } }
  @keyframes pop       { 0% { transform:scale(.85);opacity:0 } 60% { transform:scale(1.06) } 100% { transform:scale(1);opacity:1 } }
  @keyframes pulse     { 0%,100% { opacity:1 } 50% { opacity:.35 } }
  @keyframes shimmer   { 0% { background-position:-200% 0 } 100% { background-position:200% 0 } }
  @keyframes livePulse {
    0%   { transform: translate(-50%,-50%) scale(1);   opacity: 0.7; }
    50%  { transform: translate(-50%,-50%) scale(2.4); opacity: 0; }
    100% { transform: translate(-50%,-50%) scale(1);   opacity: 0; }
  }
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
            <span style={{ fontSize:10, fontWeight:700, color:p.color, textTransform:'uppercase', letterSpacing:'0.07em' }}>{p.name} — ${p.price}/mo</span>
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

  // ── Live-dot cursor ──────────────────────────────────────────────────────────
  const [cursorPos,     setCursorPos]     = useState({ x: -100, y: -100 })
  const [cursorClicked, setCursorClicked] = useState(false)
  const [cursorVisible, setCursorVisible] = useState(false)
  useEffect(() => {
    const onMove  = (e) => { setCursorPos({ x: e.clientX, y: e.clientY }); setCursorVisible(true) }
    const onDown  = ()  => setCursorClicked(true)
    const onUp    = ()  => setTimeout(() => setCursorClicked(false), 400)
    const onLeave = ()  => setCursorVisible(false)
    const onEnter = ()  => setCursorVisible(true)
    window.addEventListener('mousemove',  onMove)
    window.addEventListener('mousedown',  onDown)
    window.addEventListener('mouseup',    onUp)
    document.documentElement.addEventListener('mouseleave', onLeave)
    document.documentElement.addEventListener('mouseenter', onEnter)
    return () => {
      window.removeEventListener('mousemove',  onMove)
      window.removeEventListener('mousedown',  onDown)
      window.removeEventListener('mouseup',    onUp)
      document.documentElement.removeEventListener('mouseleave', onLeave)
      document.documentElement.removeEventListener('mouseenter', onEnter)
    }
  }, [])
  const dotColor = cursorClicked ? '#10b981' : '#ef4444'
  const SHEET_URL = 'https://script.google.com/macros/s/AKfycbw8rtlHDPcvCeV72NuAWWwJqig2mflATPpCt8G5PHUQQUB6KxaXKSVG5F6hxc3GJd8v7Q/exec'

  const handleSubmit = async () => {
    if (!email.includes('@')) return
    try { await fetch(SHEET_URL, { method:'POST', mode:'no-cors', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ email }) }) } catch(e) {}
    setSubmitted(true)
  }

  const FEATURES = [
    { icon:'◉', color:'#7c3aed', label:'Buyer CRM',          desc:'Every buyer across every platform unified. Spend history, churn risk scores, VIP flags, and platform handles in one view.' },
    { icon:'◈', color:'#10b981', label:'Live Companion',      desc:'Real-time buyer intelligence during shows. Instant lookup, notes, discounts, VIP alerts, and product add-ons — all without leaving the stream.' },
    { icon:'◑', color:'#f59e0b', label:'Analytics',           desc:'Revenue trends, audience health, platform comparison, LTV distribution, and 6 weekly AI-generated recommendations with confidence scores.' },
    { icon:'⬛', color:'#a78bfa', label:'Production Suite',    desc:'Control Sony FX3/FX6 cameras, DJI RS4 Pro gimbals, Elgato and Aputure lights, and OBS scenes — all from one interface during your show.' },
    { icon:'◆', color:'#ec4899', label:'Campaigns',           desc:'Email, SMS, and ManyChat DM campaigns. TikTok and Instagram keyword automations that trigger instant opt-ins when fans comment.' },
    { icon:'♦', color:'#f43f5e', label:'Loyalty Hub',         desc:'4-tier loyalty program (Bronze → VIP) with points, perks, early access, and birthday rewards. Buyers level up automatically.' },
    { icon:'●', color:'#3b82f6', label:'Opt-in Pages',        desc:'Branded landing pages at strmlive.com/s/yourshop. Collect email, phone, and platform handles. TCPA-compliant consent built in.' },
    { icon:'◧', color:'#10b981', label:'Show Planner',        desc:'Multi-platform stream setup, AI-ranked product run orders, show perks configuration, and one-click Go Live flow.' },
    { icon:'✦', color:'#a78bfa', label:'AI Insights',         desc:'Claude-powered business intelligence: VIP opportunities, at-risk buyer alerts, product performance gaps, and show timing optimization.' },
    { icon:'⬡', color:'#7c3aed', label:'Audience Segments',   desc:'Smart segments: VIP buyers, at-risk, dormant, platform-specific, category fans. Send the right message to exactly the right people.' },
    { icon:'◎', color:'#f59e0b', label:'Order Review',        desc:'Post-show order management. Bulk process discounts, add-ons, notes, and Shopify sync — all in one screen before you close out.' },
    { icon:'🔗', color:'#ec4899', label:'Multi-Platform Sync', desc:'Whatnot, TikTok, Instagram, and Amazon Live. Import buyers, match identities across platforms, and stream to all of them simultaneously.' },
  ]

  const STATS = [
    { value:'4',   label:'Platforms',       sub:'Whatnot · TikTok · IG · Amazon' },
    { value:'12',  label:'Core Features',   sub:'CRM to production suite' },
    { value:'<2m', label:'Setup time',      sub:'Buyers imported instantly' },
    { value:'AI',  label:'Powered by Claude', sub:'Insights after every show' },
  ]

  const SPOTLIGHTS = [
    {
      tag:'DURING THE SHOW',
      headline:"Your command center\nwhile you're live.",
      desc:"The Live Companion gives you real-time buyer intelligence — see exactly who's watching, their full purchase history, loyalty tier, and any open notes. Apply discounts, add items, or flag buyers for follow-up without ever leaving the stream. Per-platform viewer counts pulse live across Whatnot, TikTok, Instagram, and Amazon simultaneously.",
      color:'#10b981',
      stats:[{ label:'Avg GMV lift', value:'+18%' },{ label:'Buyer lookup', value:'< 1s' },{ label:'Platforms', value:'4 live' }],
      side:'left',
    },
    {
      tag:'AFTER THE SHOW',
      headline:"AI that tells you what\nto do next.",
      desc:"After every show, Streamlive analyzes your data and surfaces 6 prioritized recommendations with confidence scores. Which buyers are about to churn. Which products underperformed vs their AI score. Why Thursday shows outperform by $900. What your VIP segment is worth in untapped revenue. Each insight links directly to the action that addresses it.",
      color:'#a78bfa',
      stats:[{ label:'Insights/week', value:'6+' },{ label:'Avg confidence', value:'83%' },{ label:'Data sources', value:'4' }],
      side:'right',
    },
    {
      tag:'BEFORE THE SHOW',
      headline:"Professional production,\nsimplified.",
      desc:"The Production suite connects your Sony FX3 and FX6 cameras via Sony Camera Remote SDK, your DJI RS4/RS5 Pro gimbals via DJI Ronin SDK over Bluetooth, and your Elgato, Aputure, or Godox lights via their respective APIs. Set scenes in OBS with one click. Build automation rules: when a product is queued, the gimbal reframes and the key light hits 100% automatically.",
      color:'#f59e0b',
      stats:[{ label:'Camera SDKs', value:'Sony' },{ label:'Gimbal control', value:'DJI' },{ label:'Lighting', value:'3 brands' }],
      side:'left',
    },
  ]

  const FAQS = [
    { q:'How does buyer importing work?', a:"Connect your Whatnot, TikTok, Instagram, or Amazon account and we pull your entire buyer history — names, handles, spend, orders — automatically. It takes under 2 minutes and your data is live immediately." },
    { q:'What platforms do you support?', a:'Whatnot, TikTok Shop, Instagram Live, and Amazon Live. You can stream to all four simultaneously from the Show Planner, and manage buyers from all platforms in the same CRM.' },
    { q:'Do I need a separate OBS license for Production?', a:"No. OBS is free and open source. Streamlive connects to OBS via its official WebSocket v5 API. You install OBS once and Streamlive controls it. Sony and DJI SDK access requires registering as a developer with each brand — we walk you through it." },
    { q:"What's the difference between Growth and Pro?", a:'Growth gives you the full CRM, Live Companion, Analytics, Loyalty Hub, ManyChat automation, and AI Insights — everything you need to run and grow your shows. Pro adds the Production suite (camera/gimbal/lighting control), higher SMS volume, multi-shop TikTok support, and cross-platform buyer identity matching.' },
    { q:'Can I white label this for my clients?', a:'Yes — Enterprise plan includes white labeling under your domain, custom branding, and multi-seller network management. Ideal for agencies running shows for multiple brands.' },
    { q:'Is there a contract for Enterprise?', a:'Enterprise is available monthly or on annual contracts with volume discounts. We also offer custom scoping for unique integration requirements. Contact our sales team to discuss.' },
  ]

  const annualDiscount = 0.17

  const MOBILE_CSS = `
    /* ── MOBILE NAV ─────────────────────────────────────────── */
    .nav-links         { display:flex; }
    .nav-hamburger     { display:none; }
    .mobile-menu       { display:none; }
    .mobile-menu.open  { display:flex; flex-direction:column; }

    /* ── HERO ───────────────────────────────────────────────── */
    .hero-wrap         { padding:72px 24px 56px; }
    .hero-input-row    { flex-direction:row; }
    .hero-input        { width:300px; }
    .hero-platforms    { gap:10px; }

    /* ── STATS ──────────────────────────────────────────────── */
    .stats-grid        { grid-template-columns:repeat(4,1fr); }
    .stat-divider      { border-right:1px solid #14142a; }

    /* ── PREVIEW ────────────────────────────────────────────── */
    .preview-wrap      { padding:72px 40px 0; }

    /* ── FEATURES ───────────────────────────────────────────── */
    .features-section  { padding:88px 40px 0; }
    .features-grid     { grid-template-columns:repeat(3,1fr); }

    /* ── SPOTLIGHTS ─────────────────────────────────────────── */
    .spotlight-section { padding:88px 40px 0; }
    .spotlight-grid    { grid-template-columns:1fr 1fr; gap:56px; }
    .spotlight-text    { order:inherit; }
    .spotlight-mockup  { order:inherit; }

    /* ── PRICING ────────────────────────────────────────────── */
    .pricing-section   { padding:96px 40px 0; }
    .pricing-grid      { grid-template-columns:repeat(4,1fr); gap:12px; }
    .enterprise-row    { flex-direction:row; }

    /* ── FAQ ────────────────────────────────────────────────── */
    .faq-section       { padding:88px 40px 0; }

    /* ── FINAL CTA ──────────────────────────────────────────── */
    .cta-section       { padding:88px 40px 80px; }
    .cta-btns          { flex-direction:row; }

    /* ── FOOTER ─────────────────────────────────────────────── */
    .footer-grid       { grid-template-columns:1fr 1fr 1fr 1fr; gap:32px; }
    .footer-inner      { padding:36px 40px; }

    @media (max-width: 860px) {
      .pricing-grid    { grid-template-columns:repeat(2,1fr); }
    }

    @media (max-width: 700px) {
      /* Nav */
      .nav-links       { display:none; }
      .nav-hamburger   { display:flex; }

      /* Hero */
      .hero-wrap       { padding:56px 20px 44px; }
      .hero-input-row  { flex-direction:column; align-items:stretch; }
      .hero-input      { width:100%; }
      .hero-platforms  { gap:8px; }

      /* Stats */
      .stats-grid      { grid-template-columns:repeat(2,1fr); }
      .stat-divider    { border-right:none; }
      .stat-item       { border-bottom:1px solid #14142a; padding-bottom:20px !important; }
      .stat-item:nth-child(3),
      .stat-item:nth-child(4) { border-bottom:none; }

      /* Preview */
      .preview-wrap    { padding:56px 20px 0; }

      /* Features */
      .features-section { padding:64px 20px 0; }
      .features-grid   { grid-template-columns:1fr; gap:10px; }

      /* Spotlights */
      .spotlight-section { padding:64px 20px 0; }
      .spotlight-grid  { grid-template-columns:1fr; gap:32px; }
      .spotlight-text  { order:2 !important; }
      .spotlight-mockup { order:1 !important; }

      /* Pricing */
      .pricing-section { padding:64px 20px 0; }
      .pricing-grid    { grid-template-columns:1fr; gap:16px; }
      .enterprise-row  { flex-direction:column; gap:16px; }

      /* FAQ */
      .faq-section     { padding:64px 20px 0; }

      /* Final CTA */
      .cta-section     { padding:64px 20px 64px; }
      .cta-btns        { flex-direction:column; align-items:stretch; }
      .cta-btns button { width:100%; }

      /* Footer */
      .footer-grid     { grid-template-columns:1fr 1fr; gap:28px; }
      .footer-inner    { padding:28px 20px; }
    }

    @media (max-width: 420px) {
      .footer-grid     { grid-template-columns:1fr; gap:24px; }
      .hero-platforms  { gap:6px; }
      .pricing-grid    { gap:12px; }
    }
  `

  return (
    <>
      <style>{FONT}</style><style>{GLOBAL_CSS}</style>
      <style>{MOBILE_CSS}</style>

      {/* ── LIVE DOT CURSOR ── */}
      {cursorVisible && (
        <div style={{ position:'fixed', left:cursorPos.x, top:cursorPos.y, pointerEvents:'none', zIndex:99999 }}>
          <div style={{
            position:'absolute', width:14, height:14, borderRadius:'50%',
            background: dotColor,
            transform:'translate(-50%,-50%)',
            animation:'livePulse 1.2s ease-out infinite',
            transition:'background 0.15s ease',
          }}/>
          <div style={{
            position:'absolute', width:8, height:8, borderRadius:'50%',
            background: dotColor,
            transform: cursorClicked ? 'translate(-50%,-50%) scale(1.4)' : 'translate(-50%,-50%) scale(1)',
            boxShadow:`0 0 ${cursorClicked ? '10px 3px' : '6px 2px'} ${dotColor}99`,
            transition:'background 0.15s ease, box-shadow 0.15s ease, transform 0.1s ease',
          }}/>
        </div>
      )}
      <style>{`
        .section-label { font-size:10px; font-weight:800; letter-spacing:.12em; text-transform:uppercase; color:#a78bfa; margin-bottom:14px; display:block; }
        .gradient-text { background:linear-gradient(135deg,#7c3aed,#a78bfa 50%,#ec4899); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
        .divider-glow  { height:1px; background:linear-gradient(90deg,transparent 0%,#7c3aed44 30%,#a78bfa55 50%,#7c3aed44 70%,transparent 100%); margin:0 auto; max-width:800px; }
        .toggle-pill   { display:inline-flex; background:#0d0d1e; border:1px solid #1e1e3a; border-radius:99px; padding:4px; gap:4px; }
        .toggle-opt    { font-size:12px; font-weight:600; padding:6px 18px; border-radius:99px; border:none; cursor:pointer; transition:all .15s; }
        .check-include { color:#10b981; font-size:11px; margin-top:1px; flex-shrink:0; }
        .check-exclude { color:#374151; font-size:11px; margin-top:1px; flex-shrink:0; }
        .hamburger-btn { background:none; border:1px solid #1e1e3a; borderRadius:8px; color:#9ca3af; padding:6px 10px; cursor:pointer; font-size:16px; display:flex; align-items:center; justify-content:center; }
      `}</style>

      <div style={{ minHeight:'100vh', background:'#06060e', overflowY:'auto', overflowX:'hidden' }}>

        {/* ── NAV ──────────────────────────────────────────────────────────── */}
        <nav style={{ position:'sticky', top:0, zIndex:50, background:'#06060eee', backdropFilter:'blur(16px)', borderBottom:'1px solid #14142a', padding:'0 24px', height:58, display:'flex', alignItems:'center', gap:12 }}>
          <button onClick={()=>navigate('/')} style={{ display:'flex', alignItems:'center', gap:9, background:'none', border:'none', cursor:'pointer', padding:0, flexShrink:0 }}>
            <div style={{ width:30, height:30, borderRadius:9, background:'linear-gradient(135deg,#7c3aed,#4f46e5)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, fontWeight:900, color:'#fff', boxShadow:'0 2px 12px rgba(124,58,237,.4)' }}>S</div>
            <span style={{ fontFamily:"'Syne',sans-serif", fontSize:17, fontWeight:800, color:'#fff', letterSpacing:'-0.3px' }}>Streamlive</span>
          </button>
          <div style={{ flex:1 }} />
          {/* Desktop links */}
          <div className="nav-links" style={{ alignItems:'center', gap:20 }}>
            <a href="#features" style={{ fontSize:13, color:'#6b7280', textDecoration:'none', fontWeight:500 }} onClick={e=>{e.preventDefault();document.getElementById('features')?.scrollIntoView({behavior:'smooth'})}}>Features</a>
            <a href="#pricing"  style={{ fontSize:13, color:'#6b7280', textDecoration:'none', fontWeight:500 }} onClick={e=>{e.preventDefault();document.getElementById('pricing')?.scrollIntoView({behavior:'smooth'})}}>Pricing</a>
            <button onClick={()=>navigate('/app')} className="cta-btn" style={{ background:'linear-gradient(135deg,#7c3aed,#4f46e5)', border:'none', color:'#fff', fontSize:12, fontWeight:700, padding:'7px 18px', borderRadius:8, cursor:'pointer' }}>Open App →</button>
          </div>
          {/* Mobile hamburger */}
          <button className="nav-hamburger hamburger-btn" onClick={()=>setMenuOpen(m=>!m)} style={{ background:'none', border:'1px solid #1e1e3a', borderRadius:8, color:'#9ca3af', padding:'6px 10px', cursor:'pointer', fontSize:16, display:'none', alignItems:'center', justifyContent:'center' }}>
            {menuOpen ? '✕' : '☰'}
          </button>
        </nav>

        {/* Mobile menu dropdown */}
        <div className={`mobile-menu${menuOpen?' open':''}`} style={{ background:'#07070f', borderBottom:'1px solid #14142a', padding:'16px 24px', gap:0, position:'sticky', top:58, zIndex:49 }}>
          <a href="#features" style={{ fontSize:14, color:'#9ca3af', textDecoration:'none', fontWeight:500, padding:'12px 0', borderBottom:'1px solid #14142a' }}
            onClick={e=>{e.preventDefault();setMenuOpen(false);document.getElementById('features')?.scrollIntoView({behavior:'smooth'})}}>Features</a>
          <a href="#pricing"  style={{ fontSize:14, color:'#9ca3af', textDecoration:'none', fontWeight:500, padding:'12px 0', borderBottom:'1px solid #14142a' }}
            onClick={e=>{e.preventDefault();setMenuOpen(false);document.getElementById('pricing')?.scrollIntoView({behavior:'smooth'})}}>Pricing</a>
          <button onClick={()=>{setMenuOpen(false);navigate('/app')}} className="cta-btn" style={{ background:'linear-gradient(135deg,#7c3aed,#4f46e5)', border:'none', color:'#fff', fontSize:14, fontWeight:700, padding:'12px', borderRadius:10, cursor:'pointer', marginTop:12, textAlign:'center' }}>Open App →</button>
        </div>

        {/* ── HERO ─────────────────────────────────────────────────────────── */}
        <div className="hero-wrap" style={{ maxWidth:980, margin:'0 auto', textAlign:'center', position:'relative' }}>
          <div style={{ position:'absolute', top:60, left:'15%', width:320, height:320, borderRadius:'50%', background:'#7c3aed', opacity:0.04, filter:'blur(80px)', pointerEvents:'none' }} />
          <div style={{ position:'absolute', top:100, right:'15%', width:280, height:280, borderRadius:'50%', background:'#ec4899', opacity:0.04, filter:'blur(80px)', pointerEvents:'none' }} />

          <div className="fade-a0" style={{ display:'inline-flex', alignItems:'center', gap:8, background:'#2d1f5e44', border:'1px solid #7c3aed44', borderRadius:99, padding:'5px 16px 5px 10px', marginBottom:28 }}>
            <div style={{ width:6, height:6, borderRadius:'50%', background:'#10b981', animation:'pulse 2s infinite' }} />
            <span style={{ fontSize:11, fontWeight:700, color:'#a78bfa', letterSpacing:'0.08em', textTransform:'uppercase' }}>Now open for beta — limited spots</span>
          </div>

          <h1 className="fade-a1" style={{ fontFamily:"'Syne',sans-serif", fontSize:'clamp(34px,6.5vw,72px)', fontWeight:800, color:'#fff', lineHeight:1.06, letterSpacing:'-2px', marginBottom:20 }}>
            The operating system<br />
            <span className="gradient-text">for live commerce sellers.</span>
          </h1>

          <p className="fade-a2" style={{ fontSize:'clamp(14px,2vw,18px)', color:'#6b7280', lineHeight:1.7, maxWidth:580, margin:'0 auto 32px', fontWeight:400 }}>
            CRM, live show intelligence, production control, loyalty programs, campaign automation, and AI insights — everything a serious live seller needs, in one platform.
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
                <span style={{ fontSize:14, color:'#10b981', fontWeight:600 }}>You're on the list — we'll be in touch soon.</span>
              </div>
            )}
          </div>
          <p className="fade-a3" style={{ fontSize:11, color:'#3d3d6e' }}>No credit card required · Free during beta · Cancel anytime</p>

          <div className="fade-a4 hero-platforms" style={{ display:'flex', justifyContent:'center', marginTop:36, flexWrap:'wrap' }}>
            {[{id:'WN',label:'Whatnot',color:'#7c3aed'},{id:'TT',label:'TikTok',color:'#f43f5e'},{id:'IG',label:'Instagram',color:'#ec4899'},{id:'AM',label:'Amazon Live',color:'#f59e0b'}].map(p=>(
              <div key={p.id} style={{ display:'flex', alignItems:'center', gap:7, background:`${p.color}10`, border:`1px solid ${p.color}28`, borderRadius:99, padding:'6px 14px' }}>
                <div style={{ width:6, height:6, borderRadius:'50%', background:p.color }} />
                <span style={{ fontSize:12, fontWeight:600, color:p.color }}>{p.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── STATS STRIP ──────────────────────────────────────────────────── */}
        <div style={{ borderTop:'1px solid #14142a', borderBottom:'1px solid #14142a', background:'#07070f' }}>
          <div className="stats-grid" style={{ maxWidth:900, margin:'0 auto', padding:'28px 24px', display:'grid', gap:0 }}>
            {STATS.map((s,i)=>(
              <div key={s.label} className={`stat-item${i<3?' stat-divider':''}`} style={{ textAlign:'center', padding:'8px 16px' }}>
                <div className="stat-num" style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:26, fontWeight:700, color:'#fff', marginBottom:4 }}>{s.value}</div>
                <div style={{ fontSize:12, fontWeight:700, color:'#a78bfa', marginBottom:2 }}>{s.label}</div>
                <div style={{ fontSize:10, color:'#374151' }}>{s.sub}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── INTERACTIVE PREVIEW ──────────────────────────────────────────── */}
        <div className="preview-wrap" style={{ maxWidth:900, margin:'0 auto' }}>
          <div style={{ background:'linear-gradient(135deg,#0d0d1e,#12103a)', border:'1px solid #7c3aed33', borderRadius:22, padding:'36px 28px', textAlign:'center', position:'relative', overflow:'hidden' }}>
            <div style={{ position:'absolute', top:-40, right:-40, width:200, height:200, borderRadius:'50%', background:'#7c3aed', opacity:0.06, filter:'blur(60px)' }} />
            <span className="section-label">✦ Interactive Demo</span>
            <div style={{ fontFamily:"'Syne',sans-serif", fontSize:'clamp(20px,4vw,26px)', fontWeight:800, color:'#fff', marginBottom:12, letterSpacing:'-0.5px' }}>The full product is live right now</div>
            <p style={{ fontSize:14, color:'#6b7280', maxWidth:500, margin:'0 auto 24px', lineHeight:1.65 }}>Every screen is built and interactive — buyer CRM, live shows, production control, analytics, loyalty hub, campaigns, and more.</p>
            <button onClick={()=>navigate('/app')} className="cta-btn" style={{ background:'linear-gradient(135deg,#7c3aed,#4f46e5)', border:'none', color:'#fff', fontSize:14, fontWeight:700, padding:'13px 32px', borderRadius:11, cursor:'pointer' }}>Open Interactive Demo →</button>
          </div>
        </div>

        {/* ── FEATURES GRID ────────────────────────────────────────────────── */}
        <div id="features" className="features-section" style={{ maxWidth:980, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:44 }}>
            <span className="section-label">Built for live sellers</span>
            <div style={{ fontFamily:"'Syne',sans-serif", fontSize:'clamp(24px,4vw,40px)', fontWeight:800, color:'#fff', letterSpacing:'-1px', marginBottom:12 }}>Everything in one platform.</div>
            <p style={{ fontSize:15, color:'#6b7280', maxWidth:500, margin:'0 auto' }}>Not another tool to manage. A single place where every part of your live commerce business lives.</p>
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
              {/* Text side */}
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
              {/* Mockup side */}
              <div className="spotlight-mockup" style={{ order:s.side==='right'?1:2 }}>
                <div style={{ background:'linear-gradient(135deg,#0a0a15,#12102a)', border:`1px solid ${s.color}22`, borderRadius:20, padding:'24px', position:'relative', overflow:'hidden' }}>
                  <div style={{ position:'absolute', top:-20, right:-20, width:160, height:160, borderRadius:'50%', background:s.color, opacity:0.05, filter:'blur(50px)' }} />
                  <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:9, color:'#374151', marginBottom:12, textTransform:'uppercase', letterSpacing:'.08em' }}>● Streamlive · {s.tag}</div>
                  {i===0 && (
                    <div>
                      <div style={{ display:'flex', gap:6, marginBottom:12 }}>
                        {['WN','TT','IG','AM'].map((p,pi)=>{ const cols=['#7c3aed','#f43f5e','#ec4899','#f59e0b']; const views=[312,891,445,156]; return (
                          <div key={p} style={{ flex:1, background:`${cols[pi]}12`, border:`1px solid ${cols[pi]}33`, borderRadius:8, padding:'7px 6px', textAlign:'center' }}>
                            <div style={{ width:5,height:5,borderRadius:'50%',background:cols[pi],margin:'0 auto 4px',animation:'pulse 1s infinite' }} />
                            <div style={{ fontSize:9,fontWeight:800,color:cols[pi] }}>{p}</div>
                            <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:11,fontWeight:700,color:'#fff' }}>{views[pi]}</div>
                          </div>
                        );})}</div>
                      {[{n:'Marcus Webb',s:9.4,t:'VIP',c:'#f59e0b'},{n:'Priya Nair',s:8.9,t:'VIP',c:'#f59e0b'},{n:'Devon Price',s:8.1,t:'Active',c:'#10b981'}].map(b=>(
                        <div key={b.n} style={{ display:'flex',alignItems:'center',gap:10,padding:'9px 10px',background:'#0d0d1e',border:'1px solid #14142a',borderRadius:9,marginBottom:6 }}>
                          <div style={{ width:28,height:28,borderRadius:8,background:'#1e1e3a',display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,fontWeight:800,color:'#a78bfa',flexShrink:0 }}>{b.n.split(' ').map(w=>w[0]).join('')}</div>
                          <div style={{ flex:1 }}><div style={{ fontSize:11,fontWeight:700,color:'#fff' }}>{b.n}</div><div style={{ fontSize:9,color:'#4b5563' }}>Score {b.s}</div></div>
                          <span style={{ fontSize:9,fontWeight:700,color:b.c,background:`${b.c}15`,border:`1px solid ${b.c}33`,padding:'2px 7px',borderRadius:4 }}>{b.t}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {i===1 && (
                    <div>
                      {[{icon:'💰',pri:'HIGH',title:'VIP segment underserved',impact:'$4,820 est.',conf:91,c:'#10b981'},{icon:'⚠️',pri:'HIGH',title:'3 at-risk buyers — re-engage now',impact:'$680 potential',conf:84,c:'#f59e0b'},{icon:'📊',pri:'MED',title:'SMS outperforms email 2.4×',impact:'3× list growth',conf:82,c:'#a78bfa'}].map(ins=>(
                        <div key={ins.title} style={{ padding:'10px 12px',background:'#0d0d1e',border:`1px solid ${ins.c}22`,borderRadius:10,marginBottom:8,display:'flex',gap:10,alignItems:'flex-start' }}>
                          <div style={{ width:28,height:28,borderRadius:8,background:`${ins.c}15`,border:`1px solid ${ins.c}33`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,flexShrink:0 }}>{ins.icon}</div>
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
                  {i===2 && (
                    <div>
                      <div style={{ display:'flex',gap:8,marginBottom:12 }}>
                        {['Equipment','OBS Scenes','Automation'].map(t=>(
                          <div key={t} style={{ fontSize:10,fontWeight:600,color:t==='Equipment'?s.color:'#4b5563',borderBottom:`2px solid ${t==='Equipment'?s.color:'transparent'}`,padding:'4px 0',cursor:'pointer' }}>{t}</div>
                        ))}
                      </div>
                      {[{n:'Sony FX3',t:'Camera',icon:'📷',badge:'SDK'},{n:'Sony FX6',t:'Camera',icon:'🎥',badge:'SDK'},{n:'DJI RS4 Pro',t:'Gimbal',icon:'🎛',badge:'BT'},{n:'Elgato Key Light',t:'Light',icon:'💡',badge:'HTTP'}].map(d=>(
                        <div key={d.n} style={{ display:'flex',alignItems:'center',gap:10,padding:'9px 10px',background:'#0d0d1e',border:`1px solid ${s.color}22`,borderRadius:9,marginBottom:6 }}>
                          <span style={{ fontSize:16 }}>{d.icon}</span>
                          <div style={{ flex:1, minWidth:0 }}><div style={{ fontSize:11,fontWeight:700,color:'#fff' }}>{d.n}</div><div style={{ fontSize:9,color:'#4b5563' }}>{d.t}</div></div>
                          <span style={{ fontSize:8,fontWeight:700,color:s.color,background:`${s.color}15`,padding:'2px 6px',borderRadius:4 }}>{d.badge}</span>
                          <div style={{ width:6,height:6,borderRadius:'50%',background:'#10b981',flexShrink:0,animation:'pulse 2s infinite' }} />
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
                    <div style={{ display:'flex', alignItems:'flex-end', gap:4, marginBottom:4 }}>
                      <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:28, fontWeight:700, color:'#fff', lineHeight:1 }}>${isEnt&&billingCycle==='annual'?Math.round(p.price*(1-annualDiscount)):isEnt?p.price:displayPrice}</span>
                      <span style={{ fontSize:12, color:'#4b5563', paddingBottom:2 }}>/mo</span>
                    </div>
                    {billingCycle==='annual'&&!isEnt && <div style={{ fontSize:10, color:'#10b981', fontWeight:600 }}>↓ ${p.price-displayPrice}/mo savings</div>}
                    {isEnt&&billingCycle==='annual' && <div style={{ fontSize:10, color:'#10b981', fontWeight:600 }}>Annual: ${Math.round(p.price*(1-annualDiscount)*12).toLocaleString()}/yr</div>}
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
                    <button className="cta-btn" style={{ width:'100%', background:`${p.color}18`, border:`1px solid ${p.color}44`, color:p.color, fontSize:12, fontWeight:700, padding:'11px', borderRadius:10, cursor:'pointer' }}>Contact Sales →</button>
                  ) : (
                    <button onClick={()=>navigate(`/checkout?plan=${p.id}`)} className="cta-btn"
                      style={{ width:'100%', background:p.popular?'linear-gradient(135deg,#7c3aed,#4f46e5)':`${p.color}18`, border:`1px solid ${p.color}44`, color:p.popular?'#fff':p.color, fontSize:12, fontWeight:700, padding:'11px', borderRadius:10, cursor:'pointer' }}>
                      {p.popular?`Start Growth — $${displayPrice}/mo →`:`Get ${p.name} — $${displayPrice}/mo →`}
                    </button>
                  )}
                  <div style={{ fontSize:10, color:'#374151', textAlign:'center', marginTop:8 }}>{p.billing}</div>
                </div>
              )
            })}
          </div>

          {/* Enterprise callout */}
          <div className="enterprise-row" style={{ marginTop:20, background:'linear-gradient(135deg,#0f0a1e,#12102a)', border:'1px solid #7c3aed33', borderRadius:16, padding:'24px', display:'flex', alignItems:'center', gap:20, flexWrap:'wrap' }}>
            <div style={{ width:44, height:44, borderRadius:12, background:'#2d1f5e44', border:'1px solid #7c3aed44', display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, flexShrink:0 }}>🏢</div>
            <div style={{ flex:1, minWidth:180 }}>
              <div style={{ fontSize:15, fontWeight:700, color:'#fff', marginBottom:4 }}>Running an agency or seller network?</div>
              <div style={{ fontSize:13, color:'#6b7280' }}>Enterprise includes white labeling, unlimited team seats, dedicated support, and custom integrations.</div>
            </div>
            <button onClick={()=>document.getElementById('pricing')?.scrollIntoView({behavior:'smooth'})} className="cta-btn" style={{ background:'linear-gradient(135deg,#4c1d95,#7c3aed)', border:'none', color:'#fff', fontSize:13, fontWeight:700, padding:'11px 24px', borderRadius:10, cursor:'pointer', whiteSpace:'nowrap' }}>Talk to Sales →</button>
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
            Your buyers are waiting.<br/><span className="gradient-text">Don't let them forget you.</span>
          </div>
          <p style={{ fontSize:15, color:'#6b7280', marginBottom:32, lineHeight:1.65 }}>Join the beta and get full access while we build. Your feedback shapes the product.</p>
          <div className="cta-btns" style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap' }}>
            <button onClick={()=>navigate('/checkout?plan=growth')} className="cta-btn" style={{ background:'linear-gradient(135deg,#7c3aed,#4f46e5)', border:'none', color:'#fff', fontSize:14, fontWeight:700, padding:'13px 32px', borderRadius:11, cursor:'pointer' }}>
              Start with Growth →
            </button>
            <button onClick={()=>navigate('/app')} className="cta-btn" style={{ background:'#0d0d1e', border:'1px solid #1e1e3a', color:'#9ca3af', fontSize:14, fontWeight:600, padding:'13px 28px', borderRadius:11, cursor:'pointer' }}>
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
                <p style={{ fontSize:12, color:'#374151', lineHeight:1.7, margin:0 }}>The operating system for live commerce sellers. CRM, production, analytics, and campaigns in one platform.</p>
              </div>
              <div>
                <div style={{ fontSize:11, fontWeight:700, color:'#6b7280', textTransform:'uppercase', letterSpacing:'.08em', marginBottom:14 }}>Product</div>
                {['Features','Pricing','Changelog','Roadmap'].map(l=><div key={l} style={{ fontSize:13, color:'#374151', marginBottom:8, cursor:'pointer' }}>{l}</div>)}
              </div>
              <div>
                <div style={{ fontSize:11, fontWeight:700, color:'#6b7280', textTransform:'uppercase', letterSpacing:'.08em', marginBottom:14 }}>Platforms</div>
                {['Whatnot','TikTok Shop','Instagram Live','Amazon Live'].map(l=><div key={l} style={{ fontSize:13, color:'#374151', marginBottom:8 }}>{l}</div>)}
              </div>
              <div>
                <div style={{ fontSize:11, fontWeight:700, color:'#6b7280', textTransform:'uppercase', letterSpacing:'.08em', marginBottom:14 }}>Company</div>
                {['About','Blog','Privacy Policy','Terms of Service','Contact'].map(l=><a key={l} href="#" style={{ display:'block', fontSize:13, color:'#374151', marginBottom:8, textDecoration:'none' }}>{l}</a>)}
              </div>
            </div>
            <div style={{ borderTop:'1px solid #0d0d1a', paddingTop:20, display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:10 }}>
              <span style={{ fontSize:11, color:'#1e1e3a' }}>© 2025 Streamlive. All rights reserved.</span>
              <span style={{ fontSize:11, color:'#1e1e3a', fontFamily:"'JetBrains Mono',monospace" }}>strmlive.com</span>
            </div>
          </div>
        </footer>

      </div>
    </>
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
          <div style={{ fontSize:13, color:'#4b5563' }}>Pay securely below — you'll never leave Streamlive.</div>
        </div>

        <div style={{ maxWidth:1080, margin:'0 auto', padding:'28px 32px 80px', display:'grid', gridTemplateColumns:'1fr 460px', gap:32, alignItems:'start' }}>

          {/* LEFT — plan selector + features */}
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
                  <div style={{ fontSize:15, fontWeight:700, color:'#fff' }}>{p.name} — What's included</div>
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

          {/* RIGHT — payment form */}
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
                      🔒 Pay ${p.price}.00 — Start {p.name}
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
  cardvaultsc: {
    name: "CardVaultSC",
    owner: "Sarah Chen",
    bio: "Premier trading card breaks on Whatnot every Thursday at 8PM EST. Get exclusive drops, early access, and VIP perks — straight to your inbox.",
    avatar: "SC",
    color: "#7c3aed",
    category: "Trading Cards & Sports Collectibles",
    platforms: ["WN", "TT", "IG"],
    badge: "🏆",
    followers: "12.4K",
    perks: [
      "🎯 Early access to exclusive card breaks",
      "💌 VIP-only deals and flash drops",
      "🎁 Birthday discount + loyalty rewards",
      "📲 Show alerts before they go live",
    ],
  },
  sneakerdroptr: {
    name: "SneakerDropTR",
    owner: "Tyler Rhodes",
    bio: "Authenticated sneakers and exclusive drops. TikTok Live every Saturday. Get notified first — never miss a heat drop.",
    avatar: "TR",
    color: "#f43f5e",
    category: "Sneakers & Streetwear",
    platforms: ["TT"],
    badge: "👟",
    followers: "8.2K",
    perks: [
      "🔥 First access to limited drops",
      "💸 Subscriber-only discount codes",
      "📲 Live show alerts before they start",
      "🎁 Loyalty rewards on every purchase",
    ],
  },
  kingcomics: {
    name: "KingComics",
    owner: "Devon King",
    bio: "Silver age comics and key issues. New to live selling and building something special. Join the community early.",
    avatar: "DK",
    color: "#10b981",
    category: "Comics & Collectibles",
    platforms: ["WN"],
    badge: "📚",
    followers: "840",
    perks: [
      "📚 Early picks on key issues",
      "💌 Exclusive subscriber deals",
      "📲 Show alerts straight to your phone",
      "🌱 Founding member perks",
    ],
  },
};

const PLATFORM_META = {
  WN: { label: "Whatnot",      color: "#7c3aed", icon: "◈", placeholder: "@yourhandle",  manychat: false, dmNote: null },
  TT: { label: "TikTok",       color: "#f43f5e", icon: "♦", placeholder: "@yourhandle",  manychat: true,  dmNote: "DM us your keyword on TikTok to activate show alerts" },
  AM: { label: "Amazon Live",  color: "#f59e0b", icon: "◆", placeholder: null,            manychat: false, dmNote: null },
  IG: { label: "Instagram",    color: "#ec4899", icon: "●", placeholder: "@yourhandle",  manychat: true,  dmNote: "DM us your keyword on Instagram to activate show alerts" },
};
// Platforms we collect handles for (excludes Amazon — no user DMs possible)
const DM_PLATFORMS = ["WN", "TT", "IG"];

// ─── OPT-IN PAGE ──────────────────────────────────────────────────────────────
function OptInPage({ slug }) {
  const seller = SELLER_PROFILES[slug];
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
          {seller.platforms.filter(p=>PLATFORM_META[p]?.manychat).length > 0 && (
            <div style={{ background:"#0d1a1f", border:"1px solid #1e3a2e", borderRadius:14, padding:"20px 24px", marginBottom:16, textAlign:"left" }}>
              <div style={{ fontSize:11, color:"#34d399", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:14 }}>🔔 Activate your DM alerts</div>
              <div style={{ fontSize:12, color:"#9ca3af", marginBottom:14, lineHeight:1.6 }}>
                To receive show alerts as a direct message, send <span style={{ fontFamily:"'JetBrains Mono',monospace", background:"#0a1e16", border:"1px solid #34d39933", padding:"2px 8px", borderRadius:4, color:"#34d399", fontWeight:600 }}>JOIN</span> to {seller.name} on each platform:
              </div>
              {seller.platforms.filter(p=>PLATFORM_META[p]?.manychat).map(p => {
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
            {seller.avatar}
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
            {seller.platforms.map(p => (
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
              const dmPlatforms = seller.platforms.filter(p => DM_PLATFORMS.includes(p));
              if (dmPlatforms.length === 0) return null;
              return (
                <div>
                  <label style={{ fontSize:12, fontWeight:600, color:"#9ca3af", display:"block", marginBottom:4 }}>
                    Your Handles <span style={{ color:"#6b7280", fontWeight:400 }}>(so we can recognize you in chat)</span>
                  </label>
                  <div style={{ fontSize:11, color:"#6b7280", marginBottom:10, lineHeight:1.5 }}>
                    Optional — helps us match you across platforms and send you personalized DMs.
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
                    <div style={{ fontSize:11, color:"#6b7280", marginTop:2 }}>Instant show alerts — never miss a live drop</div>
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
export default function App() {
  const route = useRoute()
  if (route === '/app')            return <StreamlivePrototype />
  if (route === '/checkout')       return <Checkout />
  if (route === '/welcome')        return <Welcome />
  if (route.startsWith('/s/')) {
    const slug = route.split('/s/')[1]?.split('/')[0]
    return <OptInPage slug={slug} />
  }
  return <Landing />
}
