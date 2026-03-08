import { useState } from 'react'
import { supabase } from '../lib/supabase.js'
import { navigate } from '../lib/shared.jsx'
import { track } from '../lib/analytics.js'

export default function LoginPage() {
  const [tab, setTab] = useState('business')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [mode, setMode] = useState('signin') // 'signin' | 'create'

  const subtitle = tab === 'business'
    ? 'Manage your live selling command center'
    : 'Access your partner dashboard'

  const handleEmailLogin = async (e) => {
    e.preventDefault()
    if (!supabase) { setError('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env'); return }
    setError('')
    setLoading(true)
    try {
      if (mode === 'create') {
        const { error: authError } = await supabase.auth.signUp({ email, password })
        if (authError) throw authError
        track('Account Created', { method: 'email' })
        navigate('/app')
      } else {
        const { error: authError } = await supabase.auth.signInWithPassword({ email, password })
        if (authError) throw authError
        track('Login Completed', { method: 'email' })
        navigate('/app')
      }
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
      track('Login Failed', { method: mode === 'create' ? 'email_signup' : 'email', error: err.message })
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    if (!supabase) { setError('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env'); return }
    setError('')
    setLoading(true)
    try {
      const { error: authError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/app',
          queryParams: { access_type: 'offline', prompt: 'consent' },
        },
      })
      if (authError) throw authError
      track('Login Started', { method: 'google' })
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
      track('Login Failed', { method: 'google', error: err.message })
      setLoading(false)
    }
  }

  const inputStyle = {
    width: '100%',
    background: '#07070f',
    border: '1px solid #1e1e3a',
    borderRadius: 10,
    padding: '12px 16px',
    color: '#fff',
    fontSize: 14,
    fontFamily: "'DM Sans',sans-serif",
    outline: 'none',
    boxSizing: 'border-box',
  }

  // ── Mode-specific left panel content ──
  const CONTENT = {
    signin: {
      headline: 'Welcome back. Your live selling data is waiting.',
      sub: 'Pick up right where you left off — your buyers, analytics, and upcoming shows are ready to go.',
      stats: [
        { value: '24/7', label: 'Always On', sub: 'Your CRM and analytics update even when you\'re offline' },
        { value: '< 1s', label: 'Real-Time', sub: 'Live order feed, viewer counts, and GMV — instant' },
        { value: '100%', label: 'Your Data', sub: 'Every show, buyer, and dollar synced across devices' },
      ],
      props: [
        { icon: '◉', text: 'Your buyer CRM is up to date across every platform' },
        { icon: '◈', text: 'Show history and analytics are ready to review' },
        { icon: '◑', text: 'AI insights have been crunching your latest data' },
        { icon: '◆', text: 'Scheduled campaigns are running on autopilot' },
        { icon: '●', text: 'Live Pixel is still tracking — nothing missed' },
      ],
      quote: 'I check Streamlive first thing every morning. My show reports, buyer activity, campaign performance — it\'s all right there. No more bouncing between five dashboards.',
      quoteAuthor: '— Returning seller, 3 platforms, $42K/mo GMV',
    },
    create: {
      headline: 'The command center for live sellers who are done guessing.',
      sub: 'Stream to five platforms at once. See every buyer, every order, every dollar — in real time. Built for independent Shopify sellers who sell live.',
      stats: [
        { value: '5', label: 'Platforms', sub: 'Whatnot, TikTok Shop, IG Live, Amazon, YouTube' },
        { value: '99%', label: 'Attribution', sub: 'Know exactly which show drove every sale' },
        { value: '1', label: 'Dashboard', sub: 'Every buyer, order, and metric in one place' },
      ],
      props: [
        { icon: '◉', text: 'Unified buyer CRM across every platform' },
        { icon: '◈', text: 'Live Companion with real-time order feed' },
        { icon: '◑', text: 'AI-powered analytics and show insights' },
        { icon: '◆', text: 'Automated campaigns and loyalty programs' },
        { icon: '●', text: 'Live Pixel for 99% sales attribution' },
      ],
      quote: 'We went from spreadsheets and guesswork to knowing exactly who bought what, on which platform, during which show. Streamlive changed our entire operation.',
      quoteAuthor: '— Live seller, 4 platforms, $28K/mo GMV',
    },
  }

  const c = CONTENT[mode]

  return (
    <div style={{ minHeight: '100vh', background: '#06060e', display: 'flex', fontFamily: "'DM Sans',sans-serif" }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg) } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(12px) } to { opacity:1; transform:translateY(0) } }
        .login-left { display:flex; }
        .login-right { display:flex; }
        @media (max-width: 900px) {
          .login-left { display:none !important; }
          .login-right { width:100% !important; }
        }
      `}</style>

      {/* ── LEFT: Persuasion panel ── */}
      <div className="login-left" style={{ flex:1, flexDirection:'column', justifyContent:'center', padding:'60px 50px', background:'linear-gradient(160deg,#0a0a18,#0d0b20)', borderRight:'1px solid #14142a', position:'relative', overflow:'hidden' }}>
        {/* Background glow */}
        <div style={{ position:'absolute', top:'20%', left:'-10%', width:400, height:400, borderRadius:'50%', background:'#7c3aed', opacity:0.04, filter:'blur(100px)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', bottom:'10%', right:'-5%', width:300, height:300, borderRadius:'50%', background:'#ef4444', opacity:0.03, filter:'blur(80px)', pointerEvents:'none' }} />

        {/* Logo */}
        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:48 }}>
          <div style={{ width:36, height:36, borderRadius:10, background:'linear-gradient(135deg,#7c3aed,#4f46e5)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:17, fontWeight:900, color:'#fff', boxShadow:'0 2px 16px rgba(124,58,237,.4)' }}>S</div>
          <span style={{ fontFamily:"'Syne',sans-serif", fontSize:22, fontWeight:800, color:'#fff', letterSpacing:'-0.3px' }}>Streamlive</span>
        </div>

        {/* Headline */}
        <div style={{ fontFamily:"'Syne',sans-serif", fontSize:'clamp(24px,2.5vw,32px)', fontWeight:800, color:'#fff', letterSpacing:'-0.8px', lineHeight:1.25, marginBottom:16 }}>
          {c.headline}
        </div>
        <div style={{ fontSize:15, color:'#9ca3af', lineHeight:1.7, marginBottom:36, maxWidth:440 }}>
          {c.sub}
        </div>

        {/* Stats row */}
        <div style={{ display:'flex', gap:20, marginBottom:40 }}>
          {c.stats.map(s => (
            <div key={s.label} style={{ flex:1 }}>
              <div style={{ fontFamily:"'Syne',sans-serif", fontSize:28, fontWeight:800, color:'#7c3aed', letterSpacing:'-1px' }}>{s.value}</div>
              <div style={{ fontSize:12, fontWeight:700, color:'#e2e8f0', marginBottom:2 }}>{s.label}</div>
              <div style={{ fontSize:11, color:'#6b7280', lineHeight:1.4 }}>{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Value props */}
        <div style={{ background:'#07070f', border:'1px solid #14142a', borderRadius:14, padding:'16px 20px', marginBottom:36 }}>
          {c.props.map((v, i) => (
            <div key={i} style={{ display:'flex', alignItems:'center', gap:12, padding:'8px 0', borderBottom: i < c.props.length - 1 ? '1px solid #0d0d1a' : 'none' }}>
              <span style={{ fontSize:14, color:'#7c3aed', flexShrink:0, width:20, textAlign:'center' }}>{v.icon}</span>
              <span style={{ fontSize:13, color:'#d1d5db' }}>{v.text}</span>
            </div>
          ))}
        </div>

        {/* Social proof */}
        <div style={{ fontSize:13, color:'#6b7280', lineHeight:1.7 }}>
          <span style={{ color:'#a78bfa', fontWeight:700 }}>"</span>
          {c.quote}
          <span style={{ color:'#a78bfa', fontWeight:700 }}>"</span>
          <div style={{ fontSize:12, color:'#4b5563', marginTop:8 }}>{c.quoteAuthor}</div>
        </div>
      </div>

      {/* ── RIGHT: Auth form ── */}
      <div className="login-right" style={{ width:480, flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center', padding:32 }}>
        <div style={{ width:'100%', maxWidth:400, animation:'fadeUp .4s ease' }}>

          {/* Mobile logo (hidden on desktop) */}
          <div className="mobile-logo" style={{ display:'none', alignItems:'center', justifyContent:'center', gap:10, marginBottom:32 }}>
            <div style={{ width:36, height:36, borderRadius:10, background:'linear-gradient(135deg,#7c3aed,#4f46e5)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:17, fontWeight:900, color:'#fff' }}>S</div>
            <span style={{ fontFamily:"'Syne',sans-serif", fontSize:22, fontWeight:800, color:'#fff' }}>Streamlive</span>
          </div>
          <style>{`@media (max-width:900px) { .mobile-logo { display:flex !important; } }`}</style>

          {/* Card */}
          <div style={{ background:'#0a0a1a', border:'1px solid #1e1e3a', borderRadius:16, padding:'32px 28px' }}>
            <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:22, fontWeight:800, color:'#fff', textAlign:'center', marginBottom:6, letterSpacing:'-0.3px' }}>
              {mode === 'create' ? 'Create your account' : 'Sign in to Streamlive'}
            </h1>

            {/* Tabs */}
            <div style={{ display:'flex', gap:0, marginBottom:20, marginTop:16, borderBottom:'1px solid #1e1e3a' }}>
              {['business', 'partner'].map(t => (
                <button key={t} onClick={() => setTab(t)} style={{
                  flex: 1,
                  background: 'none',
                  border: 'none',
                  borderBottom: tab === t ? '2px solid #7c3aed' : '2px solid transparent',
                  color: tab === t ? '#fff' : '#6b7280',
                  fontSize: 13,
                  fontWeight: 600,
                  padding: '10px 0',
                  cursor: 'pointer',
                  fontFamily: "'DM Sans',sans-serif",
                  transition: 'all .15s ease',
                  textTransform: 'capitalize',
                }}>{t}</button>
              ))}
            </div>

            <p style={{ fontSize:13, color:'#6b7280', textAlign:'center', marginBottom:20 }}>{subtitle}</p>

            {/* Error */}
            {error && (
              <div style={{ background:'#1a0a0a', border:'1px solid #ef444466', borderRadius:10, padding:'10px 14px', marginBottom:16, fontSize:13, color:'#f87171' }}>{error}</div>
            )}

            {/* Google */}
            <button onClick={handleGoogleLogin} disabled={loading} style={{
              width: '100%',
              background: 'none',
              border: '1px solid #2a2a4a',
              borderRadius: 10,
              padding: '11px 16px',
              color: '#e2e8f0',
              fontSize: 14,
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              fontFamily: "'DM Sans',sans-serif",
              opacity: loading ? 0.6 : 1,
              marginBottom: 20,
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              Continue with Google
            </button>

            <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:20 }}>
              <div style={{ flex:1, height:1, background:'#1e1e3a' }} />
              <span style={{ fontSize:11, color:'#4b5563', fontWeight:500 }}>or</span>
              <div style={{ flex:1, height:1, background:'#1e1e3a' }} />
            </div>

            {/* Form */}
            <form onSubmit={handleEmailLogin}>
              <div style={{ marginBottom:12 }}>
                <label style={{ fontSize:12, color:'#9ca3af', fontWeight:500, marginBottom:6, display:'block' }}>Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#7c3aed'}
                  onBlur={e => e.target.style.borderColor = '#1e1e3a'} />
              </div>
              <div style={{ marginBottom:20 }}>
                <label style={{ fontSize:12, color:'#9ca3af', fontWeight:500, marginBottom:6, display:'block' }}>Password</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#7c3aed'}
                  onBlur={e => e.target.style.borderColor = '#1e1e3a'} />
              </div>
              <button className="cta-btn" type="submit" disabled={loading} style={{
                width: '100%',
                background: 'linear-gradient(135deg,#7c3aed,#4f46e5)',
                border: 'none',
                color: '#fff',
                fontSize: 14,
                fontWeight: 700,
                padding: '12px',
                borderRadius: 10,
                cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: "'DM Sans',sans-serif",
                opacity: loading ? 0.7 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}>
                {loading && <span style={{ width:16, height:16, border:'2px solid #fff4', borderTopColor:'#fff', borderRadius:'50%', animation:'spin .6s linear infinite', display:'inline-block' }} />}
                {loading ? (mode === 'create' ? 'Creating account...' : 'Signing in...') : (mode === 'create' ? 'Create Account' : 'Sign In')}
              </button>
            </form>
          </div>

          {/* Toggle mode */}
          <p style={{ textAlign:'center', marginTop:20, fontSize:13, color:'#6b7280' }}>
            {mode === 'signin' ? (
              <>
                Don't have an account?{' '}
                <button onClick={() => { setMode('create'); setError('') }} style={{ background:'none', border:'none', color:'#a78bfa', fontSize:13, fontWeight:600, cursor:'pointer', fontFamily:"'DM Sans',sans-serif", padding:0 }}>
                  Create Account
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button onClick={() => { setMode('signin'); setError('') }} style={{ background:'none', border:'none', color:'#a78bfa', fontSize:13, fontWeight:600, cursor:'pointer', fontFamily:"'DM Sans',sans-serif", padding:0 }}>
                  Sign In
                </button>
              </>
            )}
          </p>

          {/* Back to home */}
          <p style={{ textAlign:'center', marginTop:8, fontSize:12, color:'#4b5563' }}>
            <button onClick={() => navigate('/')} style={{ background:'none', border:'none', color:'#4b5563', fontSize:12, cursor:'pointer', fontFamily:"'DM Sans',sans-serif", padding:0 }}>
              ← Back to strmlive.com
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
