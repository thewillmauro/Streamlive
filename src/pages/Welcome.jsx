import { useIntercom, FONT, GLOBAL_CSS, PLANS } from '../lib/shared.jsx'

export default function Welcome() {
  const plan = new URLSearchParams(window.location.search).get('plan') || 'starter'
  const p = PLANS[plan] || PLANS.starter
  useIntercom({ plan_name: plan })

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
