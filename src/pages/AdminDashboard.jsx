import { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabase.js";
import { navigate, FONT, GLOBAL_CSS } from "../lib/shared.jsx";

const C = {
  bg: "#06060e", surface: "#0a0a15", surface2: "#0d0d1e", border: "#14142a",
  border2: "#1e1e38", text: "#e2e8f0", muted: "#6b7280", subtle: "#3d3d6e",
  accent: "#7c3aed", accent2: "#4f46e5", green: "#10b981", red: "#ef4444",
  amber: "#f59e0b", blue: "#60a5fa", pink: "#ec4899",
};

const PLAN_COLORS = { starter: "#10b981", growth: "#7c3aed", pro: "#f59e0b", enterprise: "#a78bfa" };
const PLAN_PRICES = { starter: 79, growth: 199, pro: 399, enterprise: 999 };
const VALID_PLANS = ["starter", "growth", "pro"];

const ADMIN_NAV = [
  { id: "overview", label: "Overview", icon: "⬡" },
  { id: "users", label: "Users", icon: "◉" },
  { id: "subscriptions", label: "Subscriptions", icon: "◆" },
  { id: "content", label: "Content", icon: "◧" },
];

function deriveAvatar(name) {
  if (!name) return "??";
  const parts = name.trim().split(/\s+/);
  return parts.length >= 2
    ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    : name.slice(0, 2).toUpperCase();
}

function Avatar({ initials, color, size = 32 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%", display: "flex",
      alignItems: "center", justifyContent: "center",
      background: `linear-gradient(135deg, ${color}44, ${color}22)`,
      border: `1px solid ${color}44`, fontSize: size * 0.36, fontWeight: 700,
      color, flexShrink: 0,
    }}>
      {initials}
    </div>
  );
}

function StatCard({ label, value, sub, color = C.accent }) {
  return (
    <div style={{
      flex: 1, minWidth: 180, background: C.surface, border: `1px solid ${C.border}`,
      borderRadius: 14, padding: "22px 20px", position: "relative", overflow: "hidden",
    }}>
      <div style={{ position: "absolute", top: -30, right: -30, width: 100, height: 100, borderRadius: "50%", background: color, opacity: 0.04, filter: "blur(30px)" }} />
      <div style={{ fontSize: 11, fontWeight: 600, color: C.muted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>{label}</div>
      <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 28, fontWeight: 800, color: C.text }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

function PlanBadge({ plan }) {
  const col = PLAN_COLORS[plan] || C.muted;
  return (
    <span style={{
      fontSize: 9, fontWeight: 700, color: col, background: `${col}18`,
      border: `1px solid ${col}33`, padding: "2px 8px", borderRadius: 4,
      textTransform: "uppercase", letterSpacing: "0.06em",
    }}>
      {plan || "starter"}
    </span>
  );
}

// ── HACKER-STYLE LOGIN LANDING ───────────────────────────────────────────────
function AdminLoginScreen({ onLogin }) {
  const [lines, setLines] = useState([]);
  const [inputVal, setInputVal] = useState("");
  const [phase, setPhase] = useState("boot"); // boot → prompt → auth
  const [cursorVisible, setCursorVisible] = useState(true);

  const bootSequence = [
    { text: "STRMLIVE MISSION CONTROL v2.1.0", delay: 0 },
    { text: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", delay: 100 },
    { text: "", delay: 200 },
    { text: "[SYS] Initializing secure terminal...", delay: 300 },
    { text: "[SYS] Establishing encrypted tunnel... ██████████ OK", delay: 700 },
    { text: "[SYS] Loading kernel modules............. OK", delay: 1100 },
    { text: "[SYS] TLS 1.3 handshake verified......... OK", delay: 1400 },
    { text: "[SYS] Firewall rules loaded.............. OK", delay: 1650 },
    { text: "[NET] Connecting to Streamlive Core...... OK", delay: 1900 },
    { text: "[AUTH] Multi-factor gateway active....... READY", delay: 2200 },
    { text: "", delay: 2400 },
    { text: "┌─────────────────────────────────────────┐", delay: 2500 },
    { text: "│  CLASSIFICATION: TOP SECRET // STRMLIVE │", delay: 2600 },
    { text: "│  AUTHORIZED PERSONNEL ONLY             │", delay: 2700 },
    { text: "└─────────────────────────────────────────┘", delay: 2800 },
    { text: "", delay: 2900 },
  ];

  // Cursor blink
  useEffect(() => {
    const t = setInterval(() => setCursorVisible(v => !v), 530);
    return () => clearInterval(t);
  }, []);

  // Boot sequence
  useEffect(() => {
    const timers = bootSequence.map((line, i) =>
      setTimeout(() => {
        setLines(prev => [...prev, line.text]);
        if (i === bootSequence.length - 1) {
          setTimeout(() => setPhase("prompt"), 400);
        }
      }, line.delay)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && phase === "prompt") {
      const cmd = inputVal.trim().toLowerCase();
      if (cmd === "access" || cmd === "login" || cmd === "connect") {
        setLines(prev => [...prev, `> ${inputVal}`, "", "[AUTH] Redirecting to secure authentication portal...", "[AUTH] Google OAuth 2.0 handshake initiated..."]);
        setPhase("auth");
        setInputVal("");
        setTimeout(() => onLogin(), 1500);
      } else if (cmd === "help") {
        setLines(prev => [...prev, `> ${inputVal}`, "", "Available commands:", "  access  — Authenticate via secure portal", "  login   — Authenticate via secure portal", "  status  — System status check", "  help    — Display this message", ""]);
        setInputVal("");
      } else if (cmd === "status") {
        setLines(prev => [...prev, `> ${inputVal}`, "", `[STATUS] Uptime: ${Math.floor(Math.random() * 99 + 1)} days`, `[STATUS] Active sessions: ${Math.floor(Math.random() * 3)}`, `[STATUS] Threat level: NOMINAL`, `[STATUS] Last breach attempt: ${Math.floor(Math.random() * 48 + 1)}h ago — BLOCKED`, ""]);
        setInputVal("");
      } else if (cmd) {
        setLines(prev => [...prev, `> ${inputVal}`, `bash: ${cmd}: command not found. Type 'help' for available commands.`, ""]);
        setInputVal("");
      }
    }
  };

  return (
    <div style={{ background: "#000", height: "100vh", overflow: "hidden", fontFamily: "'JetBrains Mono', 'Courier New', monospace", position: "relative" }}
      onClick={() => document.getElementById("mc-terminal-input")?.focus()}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&display=swap');
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        @keyframes flicker {
          0%, 100% { opacity: 1; }
          92% { opacity: 1; }
          93% { opacity: 0.8; }
          94% { opacity: 1; }
          96% { opacity: 0.9; }
          97% { opacity: 1; }
        }
        @keyframes glowPulse {
          0%, 100% { text-shadow: 0 0 5px #00ff4188, 0 0 10px #00ff4144; }
          50% { text-shadow: 0 0 10px #00ff4188, 0 0 20px #00ff4166, 0 0 30px #00ff4122; }
        }
        @keyframes matrixRain {
          0% { transform: translateY(-100%); opacity: 1; }
          100% { transform: translateY(100vh); opacity: 0; }
        }
      `}</style>

      {/* Scanline effect */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none", zIndex: 10,
        background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,65,0.015) 2px, rgba(0,255,65,0.015) 4px)",
      }} />
      <div style={{
        position: "absolute", left: 0, right: 0, height: 2, background: "rgba(0,255,65,0.06)",
        zIndex: 11, pointerEvents: "none", animation: "scanline 8s linear infinite",
      }} />

      {/* Matrix rain columns (subtle background) */}
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", opacity: 0.04 }}>
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} style={{
            position: "absolute", left: `${i * 5 + Math.random() * 2}%`, top: 0,
            fontSize: 11, color: "#00ff41", writingMode: "vertical-rl", lineHeight: 1.2,
            animation: `matrixRain ${6 + Math.random() * 8}s linear infinite`,
            animationDelay: `${Math.random() * 5}s`,
          }}>
            {Array.from({ length: 30 }).map(() => String.fromCharCode(0x30A0 + Math.random() * 96)).join("")}
          </div>
        ))}
      </div>

      {/* CRT vignette */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none", zIndex: 12,
        background: "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.6) 100%)",
      }} />

      {/* Terminal content */}
      <div style={{
        position: "relative", zIndex: 5, height: "100%", padding: "40px 60px",
        overflow: "auto", animation: "flicker 10s infinite",
      }}>
        {/* Logo */}
        <div style={{ marginBottom: 8 }}>
          <pre style={{ color: "#00ff41", fontSize: 10, lineHeight: 1.2, animation: "glowPulse 3s ease-in-out infinite", margin: 0 }}>{`
 ███╗   ███╗ ██╗ ███████╗ ███████╗ ██╗  ██████╗  ███╗   ██╗
 ████╗ ████║ ██║ ██╔════╝ ██╔════╝ ██║ ██╔═══██╗ ████╗  ██║
 ██╔████╔██║ ██║ ███████╗ ███████╗ ██║ ██║   ██║ ██╔██╗ ██║
 ██║╚██╔╝██║ ██║ ╚════██║ ╚════██║ ██║ ██║   ██║ ██║╚██╗██║
 ██║ ╚═╝ ██║ ██║ ███████║ ███████║ ██║ ╚██████╔╝ ██║ ╚████║
 ╚═╝     ╚═╝ ╚═╝ ╚══════╝ ╚══════╝ ╚═╝  ╚═════╝  ╚═╝  ╚═══╝
  ██████╗  ██████╗  ███╗   ██╗ ████████╗ ██████╗   ██████╗  ██╗
 ██╔════╝ ██╔═══██╗ ████╗  ██║ ╚══██╔══╝ ██╔══██╗ ██╔═══██╗ ██║
 ██║      ██║   ██║ ██╔██╗ ██║    ██║    ██████╔╝ ██║   ██║ ██║
 ██║      ██║   ██║ ██║╚██╗██║    ██║    ██╔══██╗ ██║   ██║ ██║
 ╚██████╗ ╚██████╔╝ ██║ ╚████║    ██║    ██║  ██║ ╚██████╔╝ ███████╗
  ╚═════╝  ╚═════╝  ╚═╝  ╚═══╝    ╚═╝    ╚═╝  ╚═╝  ╚═════╝  ╚══════╝`}
          </pre>
        </div>

        {/* Terminal output lines */}
        {lines.map((line, i) => (
          <div key={i} style={{
            color: line.startsWith("[AUTH]") ? "#ff6b35" : line.startsWith("[SYS]") ? "#00ff41" : line.startsWith("[NET]") ? "#00d4ff" : line.startsWith("[STATUS]") ? "#ffdd00" : line.startsWith("┌") || line.startsWith("│") || line.startsWith("└") || line.startsWith("━") ? "#ff003c" : line.startsWith("  ") ? "#888" : "#00ff41",
            fontSize: 13, lineHeight: 1.7, whiteSpace: "pre",
            textShadow: line.startsWith("[") ? "0 0 8px currentColor" : "none",
          }}>
            {line}
          </div>
        ))}

        {/* Input prompt */}
        {phase === "prompt" && (
          <div style={{ display: "flex", alignItems: "center", marginTop: 4 }}>
            <span style={{ color: "#00ff41", fontSize: 13 }}>root@mission-control:~$ </span>
            <input
              id="mc-terminal-input"
              autoFocus
              value={inputVal}
              onChange={e => setInputVal(e.target.value)}
              onKeyDown={handleKeyDown}
              style={{
                background: "transparent", border: "none", outline: "none",
                color: "#00ff41", fontSize: 13, fontFamily: "'JetBrains Mono', monospace",
                flex: 1, caretColor: "transparent",
              }}
            />
            <span style={{ color: "#00ff41", opacity: cursorVisible ? 1 : 0, fontSize: 13, fontWeight: 700 }}>█</span>
          </div>
        )}

        {phase === "prompt" && (
          <div style={{ marginTop: 20, color: "#444", fontSize: 11 }}>
            Type <span style={{ color: "#00ff41" }}>access</span> to authenticate · <span style={{ color: "#555" }}>or type <span style={{ color: "#666" }}>help</span> for commands</span>
          </div>
        )}

        {phase === "auth" && (
          <div style={{ marginTop: 12, color: "#ff6b35", fontSize: 13, animation: "glowPulse 1s ease-in-out infinite" }}>
            ████████████████ CONNECTING TO AUTH GATEWAY...
          </div>
        )}

        {/* Quick access button (for convenience) */}
        {phase === "prompt" && (
          <div style={{ position: "fixed", bottom: 32, right: 40, zIndex: 20 }}>
            <button onClick={onLogin} style={{
              background: "rgba(0,255,65,0.08)", border: "1px solid #00ff4133",
              borderRadius: 8, color: "#00ff41", fontSize: 11, fontWeight: 600,
              padding: "10px 20px", cursor: "pointer", fontFamily: "'JetBrains Mono', monospace",
              transition: "all .2s",
            }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(0,255,65,0.15)"; e.currentTarget.style.borderColor = "#00ff4166"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(0,255,65,0.08)"; e.currentTarget.style.borderColor = "#00ff4133"; }}>
              [ QUICK ACCESS → ]
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function AdminDashboardInner({ session, onSignOut }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [editPlan, setEditPlan] = useState("");
  const [saving, setSaving] = useState(false);
  const [confirmModal, setConfirmModal] = useState(null);

  const getToken = useCallback(async () => {
    const { data: { session: s } } = await supabase.auth.getSession();
    return s?.access_token;
  }, []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = await getToken();
      if (!token) { setError("Not authenticated"); setLoading(false); return; }

      const [usersRes, statsRes] = await Promise.all([
        fetch("/api/admin/users?action=list", { headers: { Authorization: `Bearer ${token}` } }),
        fetch("/api/admin/users?action=stats", { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      if (!usersRes.ok) {
        const err = await usersRes.json().catch(() => ({}));
        throw new Error(err.error || `HTTP ${usersRes.status}`);
      }

      const usersData = await usersRes.json();
      const statsData = statsRes.ok ? await statsRes.json() : null;

      setUsers(usersData.users || []);
      setStats(statsData);
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  }, [getToken]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const updatePlan = async (userId, newPlan) => {
    setSaving(true);
    try {
      const token = await getToken();
      const res = await fetch("/api/admin/users?action=update-plan", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ userId, plan: newPlan }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Update failed");
      }
      // Optimistic update
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, plan: newPlan } : u));
      setEditingUser(null);
      setConfirmModal(null);
      // Refresh stats
      const statsRes = await fetch("/api/admin/users?action=stats", { headers: { Authorization: `Bearer ${token}` } });
      if (statsRes.ok) setStats(await statsRes.json());
    } catch (e) {
      alert("Failed to update plan: " + e.message);
    }
    setSaving(false);
  };

  const filteredUsers = users.filter(u => {
    if (!search) return true;
    const q = search.toLowerCase();
    const name = (u.name || u.first_name || "").toLowerCase();
    const email = (u.email || "").toLowerCase();
    return name.includes(q) || email.includes(q);
  });

  const formatDate = (d) => {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  // ── Tab: Overview ────────────────────────────────────────────────────────────
  function TabOverview() {
    const planBreakdown = stats?.planCounts
      ? Object.entries(stats.planCounts).map(([p, c]) => `${c} ${p}`).join(" · ")
      : "—";

    return (
      <div style={{ padding: "28px 32px", overflowY: "auto", flex: 1 }}>
        <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 22, fontWeight: 800, color: C.text, marginBottom: 4 }}>Overview</div>
        <div style={{ fontSize: 12, color: C.muted, marginBottom: 28 }}>Platform health at a glance</div>

        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 32 }}>
          <StatCard label="Total Users" value={stats?.total || users.length} color={C.accent} />
          <StatCard label="MRR" value={`$${(stats?.mrr || 0).toLocaleString()}`} sub={planBreakdown} color={C.green} />
          <StatCard label="Recent Signups" value={stats?.recentSignups ?? "—"} sub="Last 7 days" color={C.blue} />
          <StatCard label="Avg Revenue / User" value={stats?.total ? `$${Math.round((stats.mrr || 0) / stats.total)}` : "—"} color={C.amber} />
        </div>

        {/* Plan distribution */}
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: "20px 22px", marginBottom: 28 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: C.text, marginBottom: 14 }}>Plan Distribution</div>
          <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
            {["starter", "growth", "pro", "enterprise"].map(p => {
              const count = stats?.planCounts?.[p] || 0;
              const total = stats?.total || 1;
              const pct = Math.round((count / total) * 100);
              const col = PLAN_COLORS[p];
              return (
                <div key={p} style={{ flex: 1, minWidth: 140 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontSize: 11, fontWeight: 600, color: col, textTransform: "capitalize" }}>{p}</span>
                    <span style={{ fontSize: 11, color: C.muted }}>{count} ({pct}%)</span>
                  </div>
                  <div style={{ height: 6, background: `${col}18`, borderRadius: 3 }}>
                    <div style={{ height: "100%", width: `${pct}%`, background: col, borderRadius: 3, transition: "width .3s ease" }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent signups table */}
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: "20px 22px" }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: C.text, marginBottom: 14 }}>Recent Signups</div>
          {users.slice(0, 10).map(u => (
            <div key={u.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: `1px solid ${C.border}` }}>
              <Avatar initials={deriveAvatar(u.name || u.first_name || u.email)} color={PLAN_COLORS[u.plan] || C.accent} size={30} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: C.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{u.name || u.first_name || "—"}</div>
                <div style={{ fontSize: 10, color: C.muted }}>{u.email}</div>
              </div>
              <PlanBadge plan={u.plan} />
              <div style={{ fontSize: 10, color: C.muted, minWidth: 80, textAlign: "right" }}>{formatDate(u.created_at)}</div>
            </div>
          ))}
          {users.length === 0 && <div style={{ fontSize: 12, color: C.muted, padding: 20, textAlign: "center" }}>No users yet</div>}
        </div>
      </div>
    );
  }

  // ── Tab: Users ───────────────────────────────────────────────────────────────
  function TabUsers() {
    return (
      <div style={{ padding: "28px 32px", overflowY: "auto", flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <div>
            <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 22, fontWeight: 800, color: C.text, marginBottom: 4 }}>Users</div>
            <div style={{ fontSize: 12, color: C.muted }}>{users.length} total accounts</div>
          </div>
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            style={{
              background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 8,
              padding: "8px 14px", fontSize: 12, color: C.text, width: 260, outline: "none",
            }}
          />
        </div>

        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, overflow: "hidden" }}>
          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", padding: "12px 18px", borderBottom: `1px solid ${C.border2}`, background: C.surface2 }}>
            <div style={{ flex: 2, fontSize: 10, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.08em" }}>User</div>
            <div style={{ flex: 2, fontSize: 10, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.08em" }}>Email</div>
            <div style={{ width: 90, fontSize: 10, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.08em" }}>Plan</div>
            <div style={{ width: 100, fontSize: 10, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.08em" }}>Category</div>
            <div style={{ width: 100, fontSize: 10, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.08em" }}>Joined</div>
            <div style={{ width: 100, fontSize: 10, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.08em", textAlign: "right" }}>Actions</div>
          </div>

          {/* Rows */}
          {filteredUsers.map(u => (
            <div key={u.id} style={{ display: "flex", alignItems: "center", padding: "12px 18px", borderBottom: `1px solid ${C.border}`, transition: "background .1s" }}
              onMouseEnter={e => e.currentTarget.style.background = C.surface2}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
              <div style={{ flex: 2, display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                {u.avatar_url ? (
                  <img src={u.avatar_url} alt="" style={{ width: 30, height: 30, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} referrerPolicy="no-referrer" />
                ) : (
                  <Avatar initials={deriveAvatar(u.name || u.first_name || u.email)} color={PLAN_COLORS[u.plan] || C.accent} size={30} />
                )}
                <div style={{ fontSize: 12, fontWeight: 600, color: C.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {u.name || u.first_name || "—"}
                </div>
              </div>
              <div style={{ flex: 2, fontSize: 11, color: C.muted, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{u.email || "—"}</div>
              <div style={{ width: 90 }}><PlanBadge plan={u.plan} /></div>
              <div style={{ width: 100, fontSize: 11, color: C.muted }}>{u.category || "—"}</div>
              <div style={{ width: 100, fontSize: 11, color: C.muted }}>{formatDate(u.created_at)}</div>
              <div style={{ width: 100, textAlign: "right" }}>
                <button
                  onClick={() => { setEditingUser(u); setEditPlan(u.plan || "starter"); }}
                  style={{
                    background: `${C.accent}18`, border: `1px solid ${C.accent}33`, borderRadius: 6,
                    color: C.accent, fontSize: 10, fontWeight: 600, padding: "4px 10px", cursor: "pointer",
                  }}
                >
                  Edit Plan
                </button>
              </div>
            </div>
          ))}

          {filteredUsers.length === 0 && (
            <div style={{ padding: 40, textAlign: "center", fontSize: 12, color: C.muted }}>
              {search ? "No users match your search" : "No users found"}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── Tab: Subscriptions ───────────────────────────────────────────────────────
  function TabSubscriptions() {
    return (
      <div style={{ padding: "28px 32px", overflowY: "auto", flex: 1 }}>
        <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 22, fontWeight: 800, color: C.text, marginBottom: 4 }}>Subscriptions</div>
        <div style={{ fontSize: 12, color: C.muted, marginBottom: 28 }}>Manage user plans and billing</div>

        {/* Plan summary cards */}
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 32 }}>
          {["starter", "growth", "pro"].map(plan => {
            const count = stats?.planCounts?.[plan] || 0;
            const col = PLAN_COLORS[plan];
            const revenue = count * PLAN_PRICES[plan];
            return (
              <div key={plan} style={{
                flex: 1, minWidth: 200, background: C.surface, border: `1px solid ${col}33`,
                borderRadius: 14, padding: "22px 20px", position: "relative", overflow: "hidden",
              }}>
                <div style={{ position: "absolute", top: -20, right: -20, width: 80, height: 80, borderRadius: "50%", background: col, opacity: 0.06, filter: "blur(24px)" }} />
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: col }} />
                  <span style={{ fontSize: 13, fontWeight: 700, color: col, textTransform: "capitalize" }}>{plan}</span>
                  <span style={{ fontSize: 11, color: C.muted, marginLeft: "auto" }}>${PLAN_PRICES[plan]}/mo</span>
                </div>
                <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 24, fontWeight: 800, color: C.text, marginBottom: 4 }}>{count}</div>
                <div style={{ fontSize: 11, color: C.muted }}>users · ${revenue.toLocaleString()}/mo revenue</div>
              </div>
            );
          })}
        </div>

        {/* User plan management table */}
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, overflow: "hidden" }}>
          <div style={{ padding: "14px 18px", borderBottom: `1px solid ${C.border2}`, background: C.surface2 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: C.text }}>All Subscriptions</div>
          </div>
          {users.map(u => {
            const col = PLAN_COLORS[u.plan] || C.muted;
            return (
              <div key={u.id} style={{ display: "flex", alignItems: "center", padding: "12px 18px", borderBottom: `1px solid ${C.border}`, gap: 14 }}
                onMouseEnter={e => e.currentTarget.style.background = C.surface2}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                {u.avatar_url ? (
                  <img src={u.avatar_url} alt="" style={{ width: 28, height: 28, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} referrerPolicy="no-referrer" />
                ) : (
                  <Avatar initials={deriveAvatar(u.name || u.first_name || u.email)} color={col} size={28} />
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: C.text }}>{u.name || u.first_name || "—"}</div>
                  <div style={{ fontSize: 10, color: C.muted }}>{u.email}</div>
                </div>
                <PlanBadge plan={u.plan} />
                <div style={{ fontSize: 10, color: C.muted, minWidth: 70, textAlign: "right" }}>${PLAN_PRICES[u.plan || "starter"]}/mo</div>
                <button
                  onClick={() => { setEditingUser(u); setEditPlan(u.plan || "starter"); }}
                  style={{
                    background: "none", border: `1px solid ${C.border2}`, borderRadius: 6,
                    color: C.muted, fontSize: 10, fontWeight: 600, padding: "4px 12px", cursor: "pointer",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = C.accent; e.currentTarget.style.color = C.accent; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = C.border2; e.currentTarget.style.color = C.muted; }}
                >
                  Change
                </button>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ── Tab: Content (coming soon) ───────────────────────────────────────────────
  function TabContent() {
    return (
      <div style={{ padding: "28px 32px", overflowY: "auto", flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", maxWidth: 400 }}>
          <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.3 }}>◧</div>
          <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 20, fontWeight: 800, color: C.text, marginBottom: 8 }}>Content Management</div>
          <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.6 }}>
            Manage featured content, platform highlights, blog posts, and changelog entries. This module is coming soon.
          </div>
        </div>
      </div>
    );
  }

  // ── Edit Plan Modal ──────────────────────────────────────────────────────────
  function EditPlanModal() {
    if (!editingUser) return null;
    const currentPlan = editingUser.plan || "starter";
    const isChanged = editPlan !== currentPlan;
    const userName = editingUser.name || editingUser.first_name || editingUser.email;

    return (
      <div onClick={() => setEditingUser(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.7)", zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div onClick={e => e.stopPropagation()} style={{
          background: "#09090f", border: `1px solid ${C.accent}44`, borderRadius: 18,
          padding: 28, width: 400, maxWidth: "92vw", position: "relative",
        }}>
          <div style={{ position: "absolute", top: -40, right: -40, width: 140, height: 140, borderRadius: "50%", background: C.accent, opacity: 0.05, filter: "blur(50px)" }} />
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 16, fontWeight: 800, color: C.text }}>Edit Plan</div>
            <button onClick={() => setEditingUser(null)} style={{ background: "none", border: "none", color: C.muted, fontSize: 16, cursor: "pointer" }}>✕</button>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20, padding: "12px 14px", background: C.surface, borderRadius: 10, border: `1px solid ${C.border}` }}>
            {editingUser.avatar_url ? (
              <img src={editingUser.avatar_url} alt="" style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "cover" }} referrerPolicy="no-referrer" />
            ) : (
              <Avatar initials={deriveAvatar(userName)} color={PLAN_COLORS[currentPlan]} size={32} />
            )}
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{userName}</div>
              <div style={{ fontSize: 11, color: C.muted }}>{editingUser.email}</div>
            </div>
          </div>

          <div style={{ fontSize: 11, fontWeight: 600, color: C.muted, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.06em" }}>Select Plan</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 24 }}>
            {VALID_PLANS.map(p => {
              const col = PLAN_COLORS[p];
              const isSelected = editPlan === p;
              const isCurrent = currentPlan === p;
              return (
                <button key={p} onClick={() => setEditPlan(p)} style={{
                  display: "flex", alignItems: "center", gap: 12, padding: "12px 14px",
                  background: isSelected ? `${col}14` : C.surface, border: `1px solid ${isSelected ? `${col}55` : C.border}`,
                  borderRadius: 10, cursor: "pointer", transition: "all .15s",
                }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: isSelected ? col : "transparent", border: `2px solid ${col}`, flexShrink: 0 }} />
                  <span style={{ fontSize: 13, fontWeight: 600, color: isSelected ? C.text : C.muted, textTransform: "capitalize", flex: 1, textAlign: "left" }}>{p}</span>
                  <span style={{ fontSize: 11, color: C.muted }}>${PLAN_PRICES[p]}/mo</span>
                  {isCurrent && <span style={{ fontSize: 8, fontWeight: 700, color: C.green, background: `${C.green}18`, padding: "2px 6px", borderRadius: 3, textTransform: "uppercase" }}>current</span>}
                </button>
              );
            })}
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => setEditingUser(null)} style={{
              flex: 1, background: C.surface2, border: `1px solid ${C.border2}`, borderRadius: 9,
              color: C.muted, fontSize: 12, fontWeight: 600, padding: "10px", cursor: "pointer",
            }}>
              Cancel
            </button>
            <button
              onClick={() => {
                if (!isChanged) return;
                setConfirmModal({ user: editingUser, from: currentPlan, to: editPlan });
              }}
              disabled={!isChanged || saving}
              style={{
                flex: 1, background: isChanged ? `linear-gradient(135deg,${C.accent},${C.accent2})` : C.surface2,
                border: "none", borderRadius: 9, color: isChanged ? "#fff" : C.muted,
                fontSize: 12, fontWeight: 700, padding: "10px", cursor: isChanged ? "pointer" : "default",
                opacity: isChanged ? 1 : 0.5,
              }}
            >
              {saving ? "Saving..." : "Apply Change"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Confirm Modal ────────────────────────────────────────────────────────────
  function ConfirmModal() {
    if (!confirmModal) return null;
    const { user, from, to } = confirmModal;
    const userName = user.name || user.first_name || user.email;
    const fromCol = PLAN_COLORS[from];
    const toCol = PLAN_COLORS[to];
    const isUpgrade = VALID_PLANS.indexOf(to) > VALID_PLANS.indexOf(from);

    return (
      <div onClick={() => setConfirmModal(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.8)", zIndex: 400, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div onClick={e => e.stopPropagation()} style={{
          background: "#09090f", border: `1px solid ${toCol}44`, borderRadius: 16,
          padding: 24, width: 380, maxWidth: "92vw",
        }}>
          <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 16, fontWeight: 800, color: C.text, marginBottom: 16 }}>
            Confirm {isUpgrade ? "Upgrade" : "Downgrade"}
          </div>
          <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.6, marginBottom: 20 }}>
            {isUpgrade ? "Upgrade" : "Downgrade"} <strong style={{ color: C.text }}>{userName}</strong> from{" "}
            <span style={{ color: fromCol, fontWeight: 700, textTransform: "capitalize" }}>{from}</span> to{" "}
            <span style={{ color: toCol, fontWeight: 700, textTransform: "capitalize" }}>{to}</span>?
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20, padding: "10px 14px", background: C.surface, borderRadius: 8, border: `1px solid ${C.border}` }}>
            <span style={{ fontSize: 12, color: C.muted }}>Billing change:</span>
            <span style={{ fontSize: 12, color: fromCol, fontWeight: 600 }}>${PLAN_PRICES[from]}/mo</span>
            <span style={{ fontSize: 12, color: C.muted }}>→</span>
            <span style={{ fontSize: 12, color: toCol, fontWeight: 700 }}>${PLAN_PRICES[to]}/mo</span>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => setConfirmModal(null)} style={{
              flex: 1, background: C.surface2, border: `1px solid ${C.border2}`, borderRadius: 9,
              color: C.muted, fontSize: 12, fontWeight: 600, padding: "10px", cursor: "pointer",
            }}>
              Cancel
            </button>
            <button
              onClick={() => updatePlan(user.id, to)}
              disabled={saving}
              style={{
                flex: 1, background: isUpgrade ? `linear-gradient(135deg,${C.accent},${C.accent2})` : `linear-gradient(135deg,${C.amber},${C.red})`,
                border: "none", borderRadius: 9, color: "#fff",
                fontSize: 12, fontWeight: 700, padding: "10px", cursor: "pointer",
              }}
            >
              {saving ? "Applying..." : isUpgrade ? "Confirm Upgrade" : "Confirm Downgrade"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Loading state ────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", background: C.bg, fontFamily: "'DM Sans',sans-serif" }}>
        <style>{FONT}{GLOBAL_CSS}{`@keyframes spin { to { transform: rotate(360deg) } } @keyframes pulse { 0%,100% { opacity:1 } 50% { opacity:.4 } }`}</style>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 36, height: 36, border: `3px solid ${C.accent}33`, borderTop: `3px solid ${C.accent}`, borderRadius: "50%", animation: "spin .8s linear infinite", margin: "0 auto 16px" }} />
          <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 14, fontWeight: 800, color: C.accent }}>Mission Control</div>
          <div style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>Loading platform data...</div>
        </div>
      </div>
    );
  }

  // ── Error state ──────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", background: C.bg, fontFamily: "'DM Sans',sans-serif" }}>
        <style>{FONT}{GLOBAL_CSS}</style>
        <div style={{ textAlign: "center", maxWidth: 400 }}>
          <div style={{ fontSize: 36, marginBottom: 12, opacity: 0.3 }}>⚠</div>
          <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 18, fontWeight: 800, color: C.text, marginBottom: 8 }}>Access Denied</div>
          <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.6, marginBottom: 20 }}>{error}</div>
          <button onClick={() => navigate("/app")} style={{
            background: `linear-gradient(135deg,${C.accent},${C.accent2})`, border: "none",
            color: "#fff", fontSize: 12, fontWeight: 700, padding: "10px 24px", borderRadius: 9, cursor: "pointer",
          }}>
            Back to App
          </button>
        </div>
      </div>
    );
  }

  // ── Main render ──────────────────────────────────────────────────────────────
  return (
    <>
      <style>{FONT}{GLOBAL_CSS}{`
        @keyframes pulse { 0%,100% { opacity:1 } 50% { opacity:.4 } }
        @keyframes mcGlow { 0%,100% { box-shadow: 0 0 20px ${C.accent}22; } 50% { box-shadow: 0 0 40px ${C.accent}44; } }
      `}</style>

      <EditPlanModal />
      <ConfirmModal />

      <div style={{ display: "flex", height: "100vh", maxHeight: "100vh", overflow: "hidden", background: C.bg, color: C.text, fontFamily: "'DM Sans',sans-serif" }}>

        {/* ── SIDEBAR ── */}
        <div style={{ width: 220, borderRight: `1px solid ${C.border}`, display: "flex", flexDirection: "column", background: "#050508", flexShrink: 0 }}>

          {/* Logo */}
          <div style={{ padding: "20px 16px 16px", borderBottom: `1px solid ${C.border}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
              <div style={{
                width: 32, height: 32, borderRadius: 9,
                background: `linear-gradient(135deg,${C.accent},${C.accent2})`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 15, fontWeight: 900, color: "#fff",
                boxShadow: `0 2px 16px ${C.accent}44`,
                animation: "mcGlow 3s ease-in-out infinite",
              }}>
                S
              </div>
              <div>
                <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 14, fontWeight: 800, color: C.text, letterSpacing: "-0.3px" }}>Mission Control</div>
                <div style={{ fontSize: 9, color: C.accent, fontWeight: 600 }}>ADMIN</div>
              </div>
            </div>
          </div>

          {/* Nav */}
          <div style={{ flex: 1, padding: "12px 10px", overflow: "hidden" }}>
            {ADMIN_NAV.map(n => {
              const isActive = activeTab === n.id;
              return (
                <button key={n.id} onClick={() => setActiveTab(n.id)} style={{
                  display: "flex", alignItems: "center", gap: 10, padding: "10px 12px",
                  borderRadius: 9, border: "none", cursor: "pointer", marginBottom: 2, width: "100%",
                  background: isActive ? `${C.accent}18` : "transparent", transition: "all .12s",
                }}>
                  <span style={{ fontSize: 13, color: isActive ? C.accent : C.subtle, width: 16, textAlign: "center" }}>{n.icon}</span>
                  <span style={{ fontSize: 13, fontWeight: isActive ? 700 : 400, color: isActive ? C.text : C.muted }}>{n.label}</span>
                </button>
              );
            })}
          </div>

          {/* Bottom actions */}
          <div style={{ borderTop: `1px solid ${C.border}`, padding: "10px" }}>
            <button onClick={() => navigate("/app")} style={{
              display: "flex", alignItems: "center", gap: 8, width: "100%",
              background: "none", border: "none", color: C.muted, fontSize: 12,
              fontWeight: 500, padding: "9px 12px", cursor: "pointer", borderRadius: 6,
              textAlign: "left",
            }}
              onMouseEnter={e => e.currentTarget.style.color = C.text}
              onMouseLeave={e => e.currentTarget.style.color = C.muted}>
              ← Back to App
            </button>
            <button onClick={() => { if (onSignOut) onSignOut(); }} style={{
              display: "flex", alignItems: "center", gap: 8, width: "100%",
              background: "none", border: "none", color: C.muted, fontSize: 12,
              fontWeight: 500, padding: "9px 12px", cursor: "pointer", borderRadius: 6,
              textAlign: "left",
            }}
              onMouseEnter={e => e.currentTarget.style.color = C.red}
              onMouseLeave={e => e.currentTarget.style.color = C.muted}>
              ↩ Sign Out
            </button>
          </div>
        </div>

        {/* ── MAIN CONTENT ── */}
        <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>

          {/* Top bar */}
          <div style={{
            height: 52, borderBottom: `1px solid ${C.border}`, display: "flex",
            alignItems: "center", justifyContent: "space-between", padding: "0 28px", flexShrink: 0,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 15, fontWeight: 800, color: C.text }}>
                {ADMIN_NAV.find(n => n.id === activeTab)?.label || "Overview"}
              </div>
              <div style={{ width: 5, height: 5, borderRadius: "50%", background: C.green, animation: "pulse 2s infinite" }} />
              <span style={{ fontSize: 10, color: C.green, fontWeight: 600 }}>System Healthy</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <button onClick={fetchData} style={{
                background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 7,
                color: C.muted, fontSize: 11, fontWeight: 600, padding: "5px 12px", cursor: "pointer",
              }}
                onMouseEnter={e => e.currentTarget.style.color = C.text}
                onMouseLeave={e => e.currentTarget.style.color = C.muted}>
                Refresh
              </button>
              {session?.user?.email && (
                <div style={{ fontSize: 10, color: C.muted }}>
                  {session.user.email}
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          {activeTab === "overview" && <TabOverview />}
          {activeTab === "users" && <TabUsers />}
          {activeTab === "subscriptions" && <TabSubscriptions />}
          {activeTab === "content" && <TabContent />}
        </div>
      </div>
    </>
  );
}

// ── WRAPPER: show login screen or dashboard ─────────────────────────────────
export default function AdminDashboard({ session, onSignOut }) {
  const handleLogin = useCallback(async () => {
    if (!supabase) return;
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin + "/admin",
        queryParams: { access_type: "offline", prompt: "consent" },
      },
    });
  }, []);

  if (!session) {
    return <AdminLoginScreen onLogin={handleLogin} />;
  }

  return <AdminDashboardInner session={session} onSignOut={onSignOut} />;
}
