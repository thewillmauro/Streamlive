import { useState } from 'react'
import { navigate, useIntercom, FONT, GLOBAL_CSS, PLANS, Nav } from '../lib/shared.jsx'
import { track } from '../lib/analytics.js'

export default function Checkout() {
  const params = new URLSearchParams(window.location.search)
  const initPlan = (() => { const q = params.get('plan'); return (q && q !== 'enterprise' && PLANS[q]) ? q : 'growth' })()
  const [selectedPlan, setSelectedPlan] = useState(initPlan)
  useIntercom()
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
    track('Checkout Started', { plan: selectedPlan, price: p.price })
    // Simulate payment processing (1.8s) then go to /welcome
    await new Promise(r => setTimeout(r, 1800))
    track('Checkout Completed', { plan: selectedPlan, price: p.price })
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
        .checkout-wrap   { display:grid; grid-template-columns:1fr 460px; gap:32px; align-items:start; padding:28px 32px 80px; max-width:1080px; margin:0 auto; }
        .checkout-header { max-width:1080px; margin:0 auto; padding:20px 32px 0; }
        .checkout-form   { position:sticky; top:80px; }
        .checkout-features-grid { display:grid; grid-template-columns:1fr 1fr; gap:8px 16px; }
        .checkout-trust  { display:grid; grid-template-columns:repeat(3,1fr); gap:10px; }
        @media (max-width:760px) {
          .checkout-wrap  { grid-template-columns:1fr; padding:20px 16px 60px; gap:20px; }
          .checkout-header { padding:16px 16px 0; }
          .checkout-form  { position:static; }
          .checkout-features-grid { grid-template-columns:1fr; }
          .checkout-trust { grid-template-columns:repeat(3,1fr); gap:8px; }
        }
        @media (max-width:480px) {
          .checkout-trust { grid-template-columns:1fr; gap:8px; }
        }
      `}</style>
      <div style={{ minHeight:'100vh', background:'#06060e', overflowY:'auto' }}>
        <Nav currentPlan={selectedPlan} />

        <div className="checkout-header">
          <button onClick={()=>navigate('/')} style={{ background:'none', border:'none', color:'#4b5563', fontSize:12, cursor:'pointer', padding:0 }}>← Back to plans</button>
        </div>
        <div className="checkout-header">
          <div style={{ fontFamily:"'Syne',sans-serif", fontSize:26, fontWeight:800, color:'#fff', letterSpacing:'-0.5px', marginBottom:4 }}>Complete your subscription</div>
          <div style={{ fontSize:13, color:'#4b5563' }}>Pay securely below. You'll never leave Streamlive.</div>
        </div>

        <div className="checkout-wrap">

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
              <div className="checkout-features-grid" style={{ borderTop:'1px solid #14142a', paddingTop:16 }}>
                {p.features.map(f => (
                  <div key={f} style={{ display:'flex', gap:8, alignItems:'flex-start' }}>
                    <span style={{ color:p.color, fontSize:12, flexShrink:0, marginTop:2 }}>✓</span>
                    <span style={{ fontSize:12, color:'#9ca3af', lineHeight:1.5 }}>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Trust */}
            <div className="checkout-trust">
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
          <div className="checkout-form">
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
