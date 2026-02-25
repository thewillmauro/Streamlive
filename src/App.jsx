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
const FONT = `@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400;600&display=swap');`

const STRIPE_LINKS = {
  starter: 'https://buy.stripe.com/test_cNibJ377j60W9TS1rX0kE00',
  growth:  'https://buy.stripe.com/test_7sYbJ363fblgfec9Yt0kE01',
  pro:     'https://buy.stripe.com/test_00w5kF77j7504zyc6B0kE02',
}

const PLANS = {
  starter: {
    id: 'starter', name: 'Starter', price: 49, color: '#10b981', bg: '#0a1e16', border: '#10b98133',
    emoji: '🌱', tagline: 'Perfect for sellers getting started',
    headline: "You're in. Let\'s import your buyers.",
    subline: "Your Streamlive account is active. Connect Whatnot and your buyers will be waiting for you.",
    features: ['Buyer CRM — all platforms in one place','Email campaigns (500/month)','Show performance reports','Opt-in page at strmlive.com/s/yourshop','Whatnot, TikTok Shop & Amazon Live sync'],
    nextLabel: "Connect your first platform →", nextHint: "Takes 2 minutes. We\'ll import your buyers immediately.",
    billing: 'Billed monthly. Cancel anytime.',
  },
  growth: {
    id: 'growth', name: 'Growth', price: 149, color: '#7c3aed', bg: '#2d1f5e22', border: '#7c3aed44', popular: true,
    emoji: '🚀', tagline: 'For sellers running multiple shows per week',
    headline: "Growth unlocked. Time to go live.",
    subline: "You now have real-time Live Companion, AI weekly briefings, and SMS campaigns.",
    features: ['Everything in Starter','Real-time Live Companion','AI-powered weekly briefing every Monday','SMS campaigns (5,000/month)','Instagram audience sync','Churn scanner — catch at-risk buyers early'],
    nextLabel: "Set up your platforms →", nextHint: "Connect Whatnot and it activates automatically when you go live.",
    billing: 'Billed monthly. Cancel anytime.',
  },
  pro: {
    id: 'pro', name: 'Pro', price: 349, color: '#f59e0b', bg: '#2e1f0a22', border: '#f59e0b33',
    emoji: '⚡', tagline: 'For power sellers at full scale',
    headline: "Pro activated. You\'re operating at full power.",
    subline: "Every feature unlocked — DM automation, multi-platform attribution, AI churn narratives.",
    features: ['Everything in Growth','Instagram DM automation','TikTok multi-shop (up to 5)','Amazon multi-marketplace sync','AI churn narratives & win-back copy','Cross-platform buyer identity matching'],
    nextLabel: "Set up your platforms →", nextHint: "Connect all 4 platforms and let Streamlive do the rest.",
    billing: 'Billed monthly. Cancel anytime.',
  },
}

const GLOBAL_CSS = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { background: #06060e; color: #e2e8f0; font-family: 'DM Sans', sans-serif; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-thumb { background: #1e1e3a; border-radius: 4px; }
  @keyframes float   { 0%,100% { transform:translateY(0) } 50% { transform:translateY(-12px) } }
  @keyframes fadeUp  { from { opacity:0; transform:translateY(16px) } to { opacity:1; transform:translateY(0) } }
  @keyframes pop     { 0% { transform:scale(.8);opacity:0 } 60% { transform:scale(1.08) } 100% { transform:scale(1);opacity:1 } }
  @keyframes pulse   { 0%,100% { opacity:1 } 50% { opacity:.4 } }
  @keyframes spin    { to { transform:rotate(360deg) } }
  .fade-a0 { animation: fadeUp .5s ease both; }
  .fade-a1 { animation: fadeUp .5s .1s ease both; }
  .fade-a2 { animation: fadeUp .5s .2s ease both; }
  .fade-a3 { animation: fadeUp .5s .3s ease both; }
  .fade-a4 { animation: fadeUp .5s .4s ease both; }
  .pop     { animation: pop .4s ease both; }
  .feat-card:hover { border-color:#7c3aed88 !important; transform:translateY(-2px); }
  .feat-card       { transition:all .2s ease; }
  .plan-card:hover { transform:translateY(-2px); }
  .plan-card       { transition: all .2s ease; }
  .cta-btn:hover   { opacity:.9; transform:translateY(-1px); box-shadow: 0 8px 32px rgba(124,58,237,.3); }
  .cta-btn         { transition:all .15s ease; }
`

// ─── SHARED NAV ───────────────────────────────────────────────────────────────
function Nav({ currentPlan }) {
  const p = currentPlan ? PLANS[currentPlan] : null
  return (
    <nav style={{ position:'sticky', top:0, zIndex:50, background:'#06060eee', backdropFilter:'blur(12px)', borderBottom:'1px solid #14142a', padding:'0 32px', height:56, display:'flex', alignItems:'center', gap:12 }}>
      <button onClick={()=>navigate('/')} style={{ display:'flex', alignItems:'center', gap:9, background:'none', border:'none', cursor:'pointer', padding:0 }}>
        <div style={{ width:28, height:28, borderRadius:8, background:'linear-gradient(135deg,#7c3aed,#4f46e5)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:900, color:'#fff' }}>S</div>
        <span style={{ fontFamily:"'Syne',sans-serif", fontSize:16, fontWeight:800, color:'#fff', letterSpacing:'-0.3px' }}>Streamlive</span>
      </button>
      <div style={{ flex:1 }} />
      <div style={{ display:'flex', alignItems:'center', gap:8 }}>
        {p && (
          <div style={{ display:'flex', alignItems:'center', gap:6, background:`${p.color}12`, border:`1px solid ${p.color}33`, borderRadius:6, padding:'4px 12px' }}>
            <div style={{ width:5, height:5, borderRadius:'50%', background:p.color, animation:'pulse 2s infinite' }} />
            <span style={{ fontSize:10, fontWeight:700, color:p.color, textTransform:'uppercase', letterSpacing:'0.07em' }}>{p.name} — ${p.price}/mo</span>
          </div>
        )}
        <button onClick={()=>navigate('/app')} className="cta-btn" style={{ background:'linear-gradient(135deg,#7c3aed,#4f46e5)', border:'none', color:'#fff', fontSize:12, fontWeight:700, padding:'7px 16px', borderRadius:8, cursor:'pointer' }}>
          Preview App →
        </button>
      </div>
    </nav>
  )
}

// ─── LANDING ──────────────────────────────────────────────────────────────────
function Landing() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const SHEET_URL = 'https://script.google.com/macros/s/AKfycbw8rtlHDPcvCeV72NuAWWwJqig2mflATPpCt8G5PHUQQUB6KxaXKSVG5F6hxc3GJd8v7Q/exec'

  const handleSubmit = async () => {
    if (!email.includes('@')) return
    try { await fetch(SHEET_URL, { method:'POST', mode:'no-cors', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ email }) }) } catch(e) {}
    setSubmitted(true)
  }

  const features = [
    { icon:'◉', label:'Buyer CRM',      desc:'Every buyer across every platform in one place. VIP tags, spend history, churn risk scores.' },
    { icon:'◈', label:'Live Companion',  desc:'Real-time buyer intelligence during your shows. Instant lookup, notes, VIP alerts on every order.' },
    { icon:'◆', label:'Show Campaigns',  desc:'Email and SMS reminders sent to exactly the right segment at exactly the right time.' },
    { icon:'▲', label:'AI Insights',     desc:'Claude-powered weekly briefings, show debriefs, and churn recovery narratives.' },
  ]

  const platforms = [
    { id:'WN', label:'Whatnot',     color:'#7c3aed' },
    { id:'TT', label:'TikTok Shop', color:'#f43f5e' },
    { id:'AM', label:'Amazon Live', color:'#f59e0b' },
    { id:'IG', label:'Instagram',   color:'#ec4899' },
  ]

  return (
    <>
      <style>{FONT}</style><style>{GLOBAL_CSS}</style>
      <div style={{ minHeight:'100vh', background:'#06060e', overflowY:'auto', overflowX:'hidden' }}>
        <Nav />
        {/* HERO */}
        <div style={{ maxWidth:900, margin:'0 auto', padding:'80px 32px 60px', textAlign:'center' }}>
          <div className="fade-a0" style={{ display:'inline-flex', alignItems:'center', gap:8, background:'#2d1f5e44', border:'1px solid #7c3aed44', borderRadius:99, padding:'5px 14px 5px 10px', marginBottom:28 }}>
            <div style={{ width:6, height:6, borderRadius:'50%', background:'#10b981', animation:'pulse 2s infinite' }} />
            <span style={{ fontSize:11, fontWeight:700, color:'#a78bfa', letterSpacing:'0.06em', textTransform:'uppercase' }}>Now in private beta</span>
          </div>
          <h1 className="fade-a1" style={{ fontFamily:"'Syne',sans-serif", fontSize:'clamp(36px,6vw,68px)', fontWeight:800, color:'#fff', lineHeight:1.05, letterSpacing:'-2px', marginBottom:22 }}>
            Stop losing buyers<br />
            <span style={{ background:'linear-gradient(135deg,#7c3aed,#a78bfa,#ec4899)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>between shows.</span>
          </h1>
          <p className="fade-a2" style={{ fontSize:18, color:'#6b7280', lineHeight:1.65, maxWidth:560, margin:'0 auto 36px' }}>
            Streamlive is the CRM built for live commerce sellers. Import buyers from every platform, send show reminders, and get AI-powered insights — all in one place.
          </p>
          <div className="fade-a3" style={{ display:'flex', gap:10, justifyContent:'center', marginBottom:16, flexWrap:'wrap' }}>
            {!submitted ? (
              <>
                <input value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==='Enter'&&handleSubmit()} placeholder="your@email.com"
                  style={{ width:280, background:'#0d0d1e', border:'1px solid #1e1e3a', borderRadius:10, padding:'11px 16px', color:'#fff', fontSize:14, outline:'none' }} />
                <button onClick={handleSubmit} className="cta-btn"
                  style={{ background:'linear-gradient(135deg,#7c3aed,#4f46e5)', border:'none', color:'#fff', fontSize:14, fontWeight:700, padding:'11px 24px', borderRadius:10, cursor:'pointer', whiteSpace:'nowrap' }}>
                  Request Early Access
                </button>
              </>
            ) : (
              <div style={{ display:'flex', alignItems:'center', gap:10, background:'#0a1e16', border:'1px solid #10b98144', borderRadius:10, padding:'12px 22px' }}>
                <span style={{ fontSize:16 }}>✓</span><span style={{ fontSize:14, color:'#10b981', fontWeight:600 }}>You're on the list — we'll be in touch soon.</span>
              </div>
            )}
          </div>
          <p className="fade-a3" style={{ fontSize:11, color:'#3d3d6e' }}>No credit card required · Free during beta · Cancel anytime</p>
        </div>

        {/* PLATFORMS */}
        <div style={{ display:'flex', justifyContent:'center', gap:12, marginBottom:72, flexWrap:'wrap', padding:'0 32px' }}>
          {platforms.map(p => (
            <div key={p.id} style={{ display:'flex', alignItems:'center', gap:8, background:`${p.color}10`, border:`1px solid ${p.color}30`, borderRadius:10, padding:'8px 16px' }}>
              <div style={{ width:8, height:8, borderRadius:'50%', background:p.color }} />
              <span style={{ fontSize:12, fontWeight:700, color:p.color }}>{p.label}</span>
            </div>
          ))}
        </div>

        {/* APP PREVIEW CTA */}
        <div style={{ maxWidth:900, margin:'0 auto 72px', padding:'0 32px' }}>
          <div style={{ background:'linear-gradient(135deg,#0d0d1e,#14102a)', border:'1px solid #7c3aed33', borderRadius:20, padding:32, textAlign:'center' }}>
            <div style={{ fontSize:11, fontWeight:700, color:'#a78bfa', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:12 }}>✦ Interactive Preview</div>
            <div style={{ fontFamily:"'Syne',sans-serif", fontSize:24, fontWeight:800, color:'#fff', marginBottom:10, letterSpacing:'-0.5px' }}>See the full product right now</div>
            <p style={{ fontSize:14, color:'#6b7280', marginBottom:24, maxWidth:480, margin:'0 auto 24px' }}>The complete prototype is live — browse the dashboard, buyer CRM, live show companion, and campaign tools.</p>
            <button onClick={()=>navigate('/app')} className="cta-btn" style={{ background:'linear-gradient(135deg,#7c3aed,#4f46e5)', border:'none', color:'#fff', fontSize:14, fontWeight:700, padding:'12px 32px', borderRadius:10, cursor:'pointer' }}>Open Prototype →</button>
          </div>
        </div>

        {/* FEATURES */}
        <div style={{ maxWidth:900, margin:'0 auto 80px', padding:'0 32px' }}>
          <div style={{ textAlign:'center', marginBottom:40 }}>
            <div style={{ fontFamily:"'Syne',sans-serif", fontSize:32, fontWeight:800, color:'#fff', letterSpacing:'-1px', marginBottom:10 }}>Everything you need. Nothing you don't.</div>
            <p style={{ fontSize:15, color:'#6b7280' }}>Built for sellers who run multiple shows a week.</p>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:14 }}>
            {features.map(f => (
              <div key={f.label} className="feat-card" style={{ background:'#0a0a15', border:'1px solid #14142a', borderRadius:16, padding:'22px 24px' }}>
                <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:12 }}>
                  <div style={{ width:36, height:36, borderRadius:10, background:'#2d1f5e44', border:'1px solid #7c3aed33', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, color:'#a78bfa' }}>{f.icon}</div>
                  <span style={{ fontSize:15, fontWeight:700, color:'#fff' }}>{f.label}</span>
                </div>
                <p style={{ fontSize:13, color:'#6b7280', lineHeight:1.65 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* PRICING — now routes to /checkout */}
        <div style={{ maxWidth:900, margin:'0 auto 80px', padding:'0 32px' }}>
          <div style={{ textAlign:'center', marginBottom:40 }}>
            <div style={{ fontFamily:"'Syne',sans-serif", fontSize:32, fontWeight:800, color:'#fff', letterSpacing:'-1px', marginBottom:10 }}>Simple pricing.</div>
            <p style={{ fontSize:15, color:'#6b7280' }}>Free during beta. Paid plans launch at MVP.</p>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14 }}>
            {Object.values(PLANS).map(p => (
              <div key={p.id} className="plan-card" style={{ background:p.popular?'linear-gradient(180deg,#1a1030,#0d0d1e)':'#0a0a15', border:`1px solid ${p.popular?p.color+'66':'#14142a'}`, borderRadius:16, padding:'24px 22px', position:'relative' }}>
                {p.popular && <div style={{ position:'absolute', top:-10, left:'50%', transform:'translateX(-50%)', background:'#7c3aed', color:'#fff', fontSize:10, fontWeight:700, padding:'3px 12px', borderRadius:99, textTransform:'uppercase', letterSpacing:'0.06em', whiteSpace:'nowrap' }}>Most Popular</div>}
                <div style={{ marginBottom:16 }}>
                  <span style={{ fontSize:11, fontWeight:700, color:p.color, textTransform:'uppercase', letterSpacing:'0.08em' }}>{p.name}</span>
                  <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:32, fontWeight:700, color:'#fff', lineHeight:1.1, marginTop:4 }}>${p.price}<span style={{ fontSize:14, color:'#4b5563', fontWeight:400 }}>/mo</span></div>
                  <div style={{ fontSize:11, color:'#4b5563', marginTop:3 }}>{p.tagline}</div>
                </div>
                {p.features.map(f => (
                  <div key={f} style={{ display:'flex', gap:8, marginBottom:8, alignItems:'flex-start' }}>
                    <span style={{ color:p.color, fontSize:11, marginTop:2, flexShrink:0 }}>✓</span>
                    <span style={{ fontSize:12, color:'#9ca3af', lineHeight:1.5 }}>{f}</span>
                  </div>
                ))}
                <button onClick={()=>navigate(`/checkout?plan=${p.id}`)} className="cta-btn"
                  style={{ display:'block', width:'100%', textAlign:'center', marginTop:18, background:p.popular?'linear-gradient(135deg,#7c3aed,#4f46e5)':`${p.color}18`, border:`1px solid ${p.color}44`, color:p.popular?'#fff':p.color, fontSize:12, fontWeight:700, padding:10, borderRadius:9, cursor:'pointer' }}>
                  Get Started — ${p.price}/mo →
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* FOOTER */}
        <footer style={{ borderTop:'1px solid #14142a', padding:'24px 32px', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:12 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <div style={{ width:22, height:22, borderRadius:6, background:'linear-gradient(135deg,#7c3aed,#4f46e5)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:900, color:'#fff' }}>S</div>
            <span style={{ fontFamily:"'Syne',sans-serif", fontSize:13, fontWeight:800, color:'#fff' }}>Streamlive</span>
          </div>
          <div style={{ display:'flex', gap:20 }}>{['Privacy','Terms','Contact'].map(l=><a key={l} href="#" style={{ fontSize:12, color:'#4b5563', textDecoration:'none' }}>{l}</a>)}</div>
          <span style={{ fontSize:11, color:'#3d3d6e', fontFamily:"'JetBrains Mono',monospace" }}>strmlive.com</span>
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

// ─── ROOT ROUTER ──────────────────────────────────────────────────────────────
export default function App() {
  const route = useRoute()
  if (route === '/app')      return <StreamlivePrototype />
  if (route === '/checkout') return <Checkout />
  if (route === '/welcome')  return <Welcome />
  return <Landing />
}
