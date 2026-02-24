import { useState, useEffect } from 'react'
import StreamlivePrototype from './StreamlivePrototype.jsx'

// ─── SIMPLE HASH ROUTER ───────────────────────────────────────────────────────
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

// ─── COMING SOON LANDING ──────────────────────────────────────────────────────
const FONT = `@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400;600&display=swap');`

function Landing() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [hovering, setHovering] = useState(null)

  const SHEET_URL = 'https://script.google.com/macros/s/AKfycbw8rtlHDPcvCeV72NuAWWwJqig2mflATPpCt8G5PHUQQUB6KxaXKSVG5F6hxc3GJd8v7Q/exec'

  const handleSubmit = async () => {
    if (!email.includes('@')) return
    setLoading(true)
    try {
      await fetch(SHEET_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
    } catch (e) {}
    setLoading(false)
    setSubmitted(true)
  }

  const STRIPE_LINKS = {
    Starter: 'https://buy.stripe.com/test_cNibJ377j60W9TS1rX0kE00',
    Growth:  'https://buy.stripe.com/test_7sYbJ363fblgfec9Yt0kE01',
    Pro:     'https://buy.stripe.com/test_00w5kF77j7504zyc6B0kE02',
  }
  // Stripe Dashboard → each Payment Link → After Payment → set redirect to:
  // https://strmlive.com/welcome?plan=starter (or growth / pro)

  const features = [
    { icon: '◉', label: 'Buyer CRM',         desc: 'Every buyer across every platform in one place. VIP tags, spend history, churn risk scores.' },
    { icon: '◈', label: 'Live Companion',     desc: 'Real-time buyer intelligence during your shows. Instant lookup, notes, VIP alerts on every order.' },
    { icon: '◆', label: 'Show Campaigns',     desc: 'Email and SMS reminders sent to exactly the right segment at exactly the right time.' },
    { icon: '▲', label: 'AI Insights',        desc: 'Claude-powered weekly briefings, show debriefs, and churn recovery narratives.' },
  ]

  const platforms = [
    { id: 'WN', label: 'Whatnot',     color: '#7c3aed' },
    { id: 'TT', label: 'TikTok Shop', color: '#f43f5e' },
    { id: 'AM', label: 'Amazon Live', color: '#f59e0b' },
    { id: 'IG', label: 'Instagram',   color: '#ec4899' },
  ]

  return (
    <>
      <style>{FONT}</style>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { background: #06060e; color: #e2e8f0; font-family: 'DM Sans', sans-serif; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #1e1e3a; border-radius: 4px; }
        @keyframes float { 0%,100% { transform: translateY(0px) } 50% { transform: translateY(-12px) } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px) } to { opacity:1; transform:translateY(0) } }
        @keyframes pulse { 0%,100% { opacity:1 } 50% { opacity:.4 } }
        @keyframes spin { to { transform: rotate(360deg) } }
        .fade-a0 { animation: fadeUp .5s ease both; }
        .fade-a1 { animation: fadeUp .5s .1s ease both; }
        .fade-a2 { animation: fadeUp .5s .2s ease both; }
        .fade-a3 { animation: fadeUp .5s .3s ease both; }
        .fade-a4 { animation: fadeUp .5s .4s ease both; }
        .feat-card:hover { border-color: #7c3aed88 !important; transform: translateY(-2px); }
        .feat-card { transition: all .2s ease; }
        .cta-btn:hover { opacity: .9; transform: translateY(-1px); }
        .cta-btn { transition: all .15s ease; }
      `}</style>

      <div style={{ minHeight: '100vh', background: '#06060e', overflowY: 'auto', overflowX: 'hidden' }}>

        {/* NAV */}
        <nav style={{ position: 'sticky', top: 0, zIndex: 50, background: '#06060eee', backdropFilter: 'blur(12px)', borderBottom: '1px solid #14142a', padding: '0 32px', height: 56, display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 900, color: '#fff' }}>S</div>
            <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 16, fontWeight: 800, color: '#fff', letterSpacing: '-0.3px' }}>Streamlive</span>
          </div>
          <div style={{ flex: 1 }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 11, color: '#4b5563', fontFamily: "'JetBrains Mono', monospace" }}>strmlive.com</span>
            <button onClick={() => navigate('/app')} className="cta-btn" style={{ background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', border: 'none', color: '#fff', fontSize: 12, fontWeight: 700, padding: '7px 16px', borderRadius: 8, cursor: 'pointer' }}>
              Preview App →
            </button>
          </div>
        </nav>

        {/* HERO */}
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '80px 32px 60px', textAlign: 'center' }}>

          {/* BADGE */}
          <div className="fade-a0" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#2d1f5e44', border: '1px solid #7c3aed44', borderRadius: 99, padding: '5px 14px 5px 10px', marginBottom: 28 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', animation: 'pulse 2s infinite' }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: '#a78bfa', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Now in private beta</span>
          </div>

          {/* HEADLINE */}
          <h1 className="fade-a1" style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(36px, 6vw, 68px)', fontWeight: 800, color: '#fff', lineHeight: 1.05, letterSpacing: '-2px', marginBottom: 22 }}>
            Stop losing buyers<br />
            <span style={{ background: 'linear-gradient(135deg,#7c3aed,#a78bfa,#ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>between shows.</span>
          </h1>

          <p className="fade-a2" style={{ fontSize: 18, color: '#6b7280', lineHeight: 1.65, maxWidth: 560, margin: '0 auto 36px' }}>
            Streamlive is the CRM built for live commerce sellers. Import buyers from every platform, send show reminders, and get AI-powered insights — all in one place.
          </p>

          {/* EMAIL CAPTURE */}
          <div className="fade-a3" style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 16, flexWrap: 'wrap' }}>
            {!submitted ? (
              <>
                <input
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                  placeholder="your@email.com"
                  style={{ width: 280, background: '#0d0d1e', border: '1px solid #1e1e3a', borderRadius: 10, padding: '11px 16px', color: '#fff', fontSize: 14, outline: 'none', fontFamily: "'DM Sans', sans-serif" }}
                />
                <button
                  onClick={handleSubmit}
                  className="cta-btn"
                  style={{ background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', border: 'none', color: '#fff', fontSize: 14, fontWeight: 700, padding: '11px 24px', borderRadius: 10, cursor: 'pointer', whiteSpace: 'nowrap' }}
                >
                  Request Early Access
                </button>
              </>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#0a1e16', border: '1px solid #10b98144', borderRadius: 10, padding: '12px 22px' }}>
                <span style={{ fontSize: 16 }}>✓</span>
                <span style={{ fontSize: 14, color: '#10b981', fontWeight: 600 }}>You're on the list — we'll be in touch soon.</span>
              </div>
            )}
          </div>

          <p className="fade-a3" style={{ fontSize: 11, color: '#3d3d6e' }}>No credit card required · Free during beta · Cancel anytime</p>
        </div>

        {/* PLATFORM BADGES */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginBottom: 72, flexWrap: 'wrap', padding: '0 32px' }}>
          {platforms.map(p => (
            <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 8, background: `${p.color}10`, border: `1px solid ${p.color}30`, borderRadius: 10, padding: '8px 16px' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: p.color }} />
              <span style={{ fontSize: 12, fontWeight: 700, color: p.color }}>{p.label}</span>
            </div>
          ))}
        </div>

        {/* APP PREVIEW CTA */}
        <div style={{ maxWidth: 900, margin: '0 auto 72px', padding: '0 32px' }}>
          <div style={{ background: 'linear-gradient(135deg, #0d0d1e, #14102a)', border: '1px solid #7c3aed33', borderRadius: 20, padding: '32px', textAlign: 'center' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#a78bfa', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>✦ Interactive Preview</div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 24, fontWeight: 800, color: '#fff', marginBottom: 10, letterSpacing: '-0.5px' }}>See the full product right now</div>
            <p style={{ fontSize: 14, color: '#6b7280', marginBottom: 24, maxWidth: 480, margin: '0 auto 24px' }}>
              The complete prototype is live — browse the dashboard, buyer CRM, live show companion, and campaign tools.
            </p>
            <button onClick={() => navigate('/app')} className="cta-btn" style={{ background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', border: 'none', color: '#fff', fontSize: 14, fontWeight: 700, padding: '12px 32px', borderRadius: 10, cursor: 'pointer' }}>
              Open Prototype →
            </button>
          </div>
        </div>

        {/* FEATURES */}
        <div style={{ maxWidth: 900, margin: '0 auto 80px', padding: '0 32px' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 32, fontWeight: 800, color: '#fff', letterSpacing: '-1px', marginBottom: 10 }}>Everything you need. Nothing you don't.</div>
            <p style={{ fontSize: 15, color: '#6b7280' }}>Built for sellers who run multiple shows a week.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
            {features.map((f, i) => (
              <div key={f.label} className="feat-card" style={{ background: '#0a0a15', border: '1px solid #14142a', borderRadius: 16, padding: '22px 24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: '#2d1f5e44', border: '1px solid #7c3aed33', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, color: '#a78bfa' }}>{f.icon}</div>
                  <span style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>{f.label}</span>
                </div>
                <p style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.65 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* PRICING PREVIEW */}
        <div style={{ maxWidth: 900, margin: '0 auto 80px', padding: '0 32px' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 32, fontWeight: 800, color: '#fff', letterSpacing: '-1px', marginBottom: 10 }}>Simple pricing.</div>
            <p style={{ fontSize: 15, color: '#6b7280' }}>Free during beta. Paid plans launch at MVP.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
            {[
              { plan: 'Starter', price: '$49', color: '#10b981', features: ['Whatnot + TikTok + Amazon Live', 'Buyer import after shows', 'Email campaigns (500/mo)', 'Basic show reports', 'Opt-in page'] },
              { plan: 'Growth',  price: '$149', color: '#7c3aed', popular: true, features: ['Everything in Starter', 'Real-time Live Companion', 'Instagram audience sync', 'SMS campaigns (5k/mo)', 'AI weekly briefing', 'Churn scanner'] },
              { plan: 'Pro',     price: '$349', color: '#f59e0b', features: ['Everything in Growth', 'Instagram DM automation', 'TikTok multi-shop (5)', 'Amazon multi-marketplace', 'AI churn narratives', 'Cross-platform buyer ID'] },
            ].map(p => (
              <div key={p.plan} style={{ background: p.popular ? 'linear-gradient(180deg,#1a1030,#0d0d1e)' : '#0a0a15', border: `1px solid ${p.popular ? '#7c3aed66' : '#14142a'}`, borderRadius: 16, padding: '24px 22px', position: 'relative' }}>
                {p.popular && <div style={{ position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)', background: '#7c3aed', color: '#fff', fontSize: 10, fontWeight: 700, padding: '3px 12px', borderRadius: 99, textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>Most Popular</div>}
                <div style={{ marginBottom: 16 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: p.color, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{p.plan}</span>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 32, fontWeight: 700, color: '#fff', lineHeight: 1.1, marginTop: 4 }}>{p.price}<span style={{ fontSize: 14, color: '#4b5563', fontWeight: 400 }}>/mo</span></div>
                </div>
                {p.features.map(f => (
                  <div key={f} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'flex-start' }}>
                    <span style={{ color: p.color, fontSize: 11, marginTop: 2, flexShrink: 0 }}>✓</span>
                    <span style={{ fontSize: 12, color: '#9ca3af', lineHeight: 1.5 }}>{f}</span>
                  </div>
                ))}
                <a href={STRIPE_LINKS[p.plan]} target="_blank" rel="noopener noreferrer" className="cta-btn" style={{ display: 'block', textAlign: 'center', marginTop: 18, background: p.popular ? 'linear-gradient(135deg,#7c3aed,#4f46e5)' : `${p.color}22`, border: `1px solid ${p.color}44`, color: p.popular ? '#fff' : p.color, fontSize: 12, fontWeight: 700, padding: '10px', borderRadius: 9, cursor: 'pointer', textDecoration: 'none' }}>
                  Get Started — {p.price}/mo
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* FOOTER */}
        <footer style={{ borderTop: '1px solid #14142a', padding: '24px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 22, height: 22, borderRadius: 6, background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 900, color: '#fff' }}>S</div>
            <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 13, fontWeight: 800, color: '#fff' }}>Streamlive</span>
          </div>
          <div style={{ display: 'flex', gap: 20 }}>
            {['Privacy', 'Terms', 'Contact'].map(l => (
              <a key={l} href="#" style={{ fontSize: 12, color: '#4b5563', textDecoration: 'none' }}>{l}</a>
            ))}
          </div>
          <span style={{ fontSize: 11, color: '#3d3d6e', fontFamily: "'JetBrains Mono', monospace" }}>strmlive.com</span>
        </footer>
      </div>
    </>
  )
}


// ─── WELCOME / POST-PAYMENT PAGE ─────────────────────────────────────────────
function Welcome() {
  const params = new URLSearchParams(window.location.search)
  const plan = params.get('plan') || 'starter'

  const PLANS = {
    starter: {
      name: "Starter",
      price: "$49",
      color: "#10b981",
      emoji: "🌱",
      headline: "You're in. Let's import your buyers.",
      subline: "Your Streamlive account is active. Connect Whatnot and your buyers will be waiting for you.",
      features: [
        'Import buyers from Whatnot, TikTok Shop & Amazon Live',
        'Send email campaigns to up to 500 subscribers/month',
        'Show performance reports after every live',
        'Your personal opt-in page at strmlive.com/s/yourshop',
      ],
      nextLabel: "Connect your first platform →",
      nextHint: "Takes 2 minutes. We'll import your buyers immediately.",
    },
    growth: {
      name: "Growth",
      price: "$149",
      color: "#7c3aed",
      emoji: "🚀",
      headline: "Growth unlocked. Time to go live.",
      subline: "You now have real-time Live Companion, AI weekly briefings, and SMS campaigns.",
      features: [
        'Real-time Live Companion during every show',
        'AI-powered weekly briefing every Monday',
        'SMS campaigns up to 5,000 messages/month',
        'Instagram audience sync',
        'Churn scanner — catch at-risk buyers before they leave',
      ],
      nextLabel: "Set up Live Companion →",
      nextHint: "Connect Whatnot and it activates automatically when you go live.",
    },
    pro: {
      name: "Pro",
      price: "$349",
      color: "#f59e0b",
      emoji: "⚡",
      headline: "Pro activated. You're operating at full power.",
      subline: "Every feature unlocked — DM automation, multi-platform attribution, AI churn narratives.",
      features: [
        'Instagram DM automation for show announcements',
        'TikTok multi-shop support (up to 5 shops)',
        'Amazon multi-marketplace sync',
        'AI churn narratives — personalized win-back copy',
        'Cross-platform buyer identity matching',
      ],
      nextLabel: "Set up your platforms →",
      nextHint: "Connect all 4 platforms and let Streamlive do the rest.",
    },
  }

  const p = PLANS[plan] || PLANS.starter

  return (
    <>
      <style>{FONT}</style>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { background: #06060e; color: #e2e8f0; font-family: "DM Sans", sans-serif; overflow: auto; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px) } to { opacity:1; transform:translateY(0) } }
        @keyframes pop { 0% { transform:scale(.8); opacity:0 } 60% { transform:scale(1.1) } 100% { transform:scale(1); opacity:1 } }
        @keyframes pulse { 0%,100% { opacity:1 } 50% { opacity:.4 } }
        .fade-a0 { animation: fadeUp .5s ease both; }
        .fade-a1 { animation: fadeUp .5s .15s ease both; }
        .fade-a2 { animation: fadeUp .5s .3s ease both; }
        .fade-a3 { animation: fadeUp .5s .45s ease both; }
        .pop { animation: pop .4s ease both; }
        .cta-btn:hover { opacity:.9; transform:translateY(-1px); }
        .cta-btn { transition: all .15s ease; }
      `}</style>

      <div style={{ minHeight: '100vh', background: '#06060e', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>

        {/* LOGO */}
        <div className="fade-a0" style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 48 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 900, color: '#fff' }}>S</div>
          <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 16, fontWeight: 800, color: '#fff' }}>Streamlive</span>
        </div>

        {/* SUCCESS CARD */}
        <div style={{ width: '100%', maxWidth: 560 }}>

          {/* CHECK + EMOJI */}
          <div className="pop" style={{ textAlign: 'center', marginBottom: 28 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 72, height: 72, borderRadius: '50%', background: `${p.color}18`, border: `2px solid ${p.color}44`, fontSize: 32, marginBottom: 16 }}>
              {p.emoji}
            </div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#0a1e16', border: '1px solid #10b98144', borderRadius: 99, padding: '4px 14px', marginLeft: 12 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', animation: 'pulse 2s infinite' }} />
              <span style={{ fontSize: 11, fontWeight: 700, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Payment confirmed</span>
            </div>
          </div>

          {/* HEADLINE */}
          <div className="fade-a1" style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 28, fontWeight: 800, color: '#fff', letterSpacing: '-0.5px', marginBottom: 10 }}>
              {p.headline}
            </div>
            <p style={{ fontSize: 15, color: '#6b7280', lineHeight: 1.6 }}>{p.subline}</p>
          </div>

          {/* PLAN BADGE */}
          <div className="fade-a1" style={{ display: 'flex', justifyContent: 'center', marginBottom: 28 }}>
            <div style={{ background: `${p.color}12`, border: `1px solid ${p.color}33`, borderRadius: 10, padding: '10px 24px', display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: p.color, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{p.name} Plan</span>
              <div style={{ width: 1, height: 12, background: `${p.color}44` }} />
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 700, color: '#fff' }}>{p.price}/mo</span>
            </div>
          </div>

          {/* WHAT YOU UNLOCKED */}
          <div className="fade-a2" style={{ background: '#0a0a15', border: '1px solid #14142a', borderRadius: 16, padding: '22px 24px', marginBottom: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#4b5563', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>What you unlocked</div>
            {p.features.map((f, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 10, alignItems: 'flex-start' }}>
                <span style={{ color: p.color, fontSize: 12, flexShrink: 0, marginTop: 2 }}>✓</span>
                <span style={{ fontSize: 13, color: '#9ca3af', lineHeight: 1.5 }}>{f}</span>
              </div>
            ))}
          </div>

          {/* NEXT STEP CTA */}
          <div className="fade-a3">
            <button
              onClick={() => { window.location.href = '/app' }}
              className="cta-btn"
              style={{ width: '100%', background: `linear-gradient(135deg,#7c3aed,#4f46e5)`, border: 'none', color: '#fff', fontSize: 15, fontWeight: 700, padding: '14px', borderRadius: 12, cursor: 'pointer', marginBottom: 10 }}
            >
              {p.nextLabel}
            </button>
            <p style={{ textAlign: 'center', fontSize: 12, color: '#3d3d6e' }}>{p.nextHint}</p>
          </div>

          {/* SUPPORT NOTE */}
          <div className="fade-a3" style={{ textAlign: 'center', marginTop: 28, paddingTop: 24, borderTop: '1px solid #14142a' }}>
            <p style={{ fontSize: 12, color: '#4b5563' }}>
              Questions? Email us at{' '}
              <a href="mailto:hello@strmlive.com" style={{ color: '#a78bfa', textDecoration: 'none' }}>hello@strmlive.com</a>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

// ─── ROOT ROUTER ─────────────────────────────────────────────────────────────
export default function App() {
  const route = useRoute()

  if (route === '/app') return <StreamlivePrototype />
  if (route === '/welcome') return <Welcome />
  return <Landing />
}
