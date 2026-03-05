import { useState } from 'react'
import { SELLER_PROFILES, PLATFORM_META, DM_PLATFORMS } from '../lib/shared.jsx'

export default function OptInPage({ slug, connectedPlatforms }) {
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
