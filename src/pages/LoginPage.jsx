import { useState } from 'react'
import { supabase } from '../lib/supabase.js'
import { navigate } from '../lib/shared.jsx'

export default function LoginPage() {
  const [tab, setTab] = useState('business')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const subtitle = tab === 'business'
    ? 'Manage your live selling command center'
    : 'Access your partner dashboard'

  const handleEmailLogin = async (e) => {
    e.preventDefault()
    if (!supabase) { setError('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env'); return }
    setError('')
    setLoading(true)
    try {
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password })
      if (authError) throw authError
      navigate('/app')
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
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
        options: { redirectTo: window.location.origin + '/app' },
      })
      if (authError) throw authError
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
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
  }

  return (
    <div style={{ minHeight: '100vh', background: '#06060e', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div className="fade-a0" style={{ width: '100%', maxWidth: 420 }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 32 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, fontWeight: 900, color: '#fff', boxShadow: '0 2px 16px rgba(124,58,237,.4)' }}>S</div>
          <span style={{ fontFamily: "'Syne',sans-serif", fontSize: 22, fontWeight: 800, color: '#fff', letterSpacing: '-0.3px' }}>Streamlive</span>
        </div>

        {/* Card */}
        <div style={{ background: '#0a0a1a', border: '1px solid #1e1e3a', borderRadius: 16, padding: '32px 28px' }}>
          <h1 className="fade-a1" style={{ fontFamily: "'Syne',sans-serif", fontSize: 22, fontWeight: 800, color: '#fff', textAlign: 'center', marginBottom: 6, letterSpacing: '-0.3px' }}>Sign in to Streamlive</h1>

          {/* Tabs */}
          <div className="fade-a1" style={{ display: 'flex', gap: 0, marginBottom: 20, marginTop: 16, borderBottom: '1px solid #1e1e3a' }}>
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

          <p className="fade-a2" style={{ fontSize: 13, color: '#6b7280', textAlign: 'center', marginBottom: 20 }}>{subtitle}</p>

          {/* Error */}
          {error && (
            <div style={{ background: '#1a0a0a', border: '1px solid #ef444466', borderRadius: 10, padding: '10px 14px', marginBottom: 16, fontSize: 13, color: '#f87171' }}>{error}</div>
          )}

          {/* Google */}
          <button className="fade-a2" onClick={handleGoogleLogin} disabled={loading} style={{
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

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div style={{ flex: 1, height: 1, background: '#1e1e3a' }} />
            <span style={{ fontSize: 11, color: '#4b5563', fontWeight: 500 }}>or</span>
            <div style={{ flex: 1, height: 1, background: '#1e1e3a' }} />
          </div>

          {/* Form */}
          <form onSubmit={handleEmailLogin}>
            <div className="fade-a3" style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 12, color: '#9ca3af', fontWeight: 500, marginBottom: 6, display: 'block' }}>Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#7c3aed'}
                onBlur={e => e.target.style.borderColor = '#1e1e3a'} />
            </div>
            <div className="fade-a3" style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 12, color: '#9ca3af', fontWeight: 500, marginBottom: 6, display: 'block' }}>Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#7c3aed'}
                onBlur={e => e.target.style.borderColor = '#1e1e3a'} />
            </div>
            <button className="fade-a4 cta-btn" type="submit" disabled={loading} style={{
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
              {loading && <span style={{ width: 16, height: 16, border: '2px solid #fff4', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin .6s linear infinite', display: 'inline-block' }} />}
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="fade-a5" style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: '#6b7280' }}>
          Don't have an account?{' '}
          <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', color: '#a78bfa', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", padding: 0 }}>
            Get Early Access
          </button>
        </p>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}
