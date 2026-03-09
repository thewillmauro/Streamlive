import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "../lib/supabase.js";
import { navigate, FONT, GLOBAL_CSS } from "../lib/shared.jsx";

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const C = {
  bg: "#06060e", surface: "#0a0a15", surface2: "#0d0d1e", border: "#14142a",
  border2: "#1e1e38", text: "#e2e8f0", muted: "#6b7280", subtle: "#3d3d6e",
  accent: "#7c3aed", accent2: "#4f46e5", green: "#10b981", red: "#ef4444",
  amber: "#f59e0b", blue: "#60a5fa", pink: "#ec4899", cyan: "#06b6d4",
};

const PLAN_COLORS = { starter: "#10b981", growth: "#7c3aed", pro: "#f59e0b", enterprise: "#a78bfa" };
const PLAN_PRICES = { starter: 79, growth: 199, pro: 399, enterprise: 999 };
const VALID_PLANS = ["starter", "growth", "pro", "enterprise"];
const PLATFORM_LABELS = { WN: "Whatnot", TT: "TikTok", IG: "Instagram", AM: "Amazon", YT: "YouTube", instagram: "Instagram", tiktok: "TikTok", whatnot: "Whatnot", amazon: "Amazon", youtube: "YouTube", shopify: "Shopify" };
const PLATFORM_COLORS = { WN: "#7c3aed", TT: "#f43f5e", IG: "#ec4899", AM: "#f59e0b", YT: "#ef4444", instagram: "#ec4899", tiktok: "#f43f5e", whatnot: "#7c3aed", amazon: "#f59e0b", youtube: "#ef4444", shopify: "#96bf48" };

const ADMIN_NAV = [
  { id: "overview", label: "Overview", icon: "⬡" },
  { id: "users", label: "Users", icon: "◉" },
  { id: "subscriptions", label: "Subscriptions", icon: "◆" },
  { id: "analytics", label: "Analytics", icon: "◑" },
  { id: "shows", label: "Shows", icon: "◈" },
  { id: "content", label: "Content", icon: "◧" },
  { id: "system", label: "System", icon: "◎" },
];

function deriveAvatar(name) {
  if (!name) return "??";
  const parts = name.trim().split(/\s+/);
  return parts.length >= 2 ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase() : name.slice(0, 2).toUpperCase();
}

function Avatar({ initials, color, size = 32, url }) {
  if (url) return <img src={url} alt="" style={{ width: size, height: size, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} referrerPolicy="no-referrer" />;
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: `linear-gradient(135deg, ${color}44, ${color}22)`, border: `1px solid ${color}44`, fontSize: size * 0.36, fontWeight: 700, color, flexShrink: 0 }}>
      {initials}
    </div>
  );
}

function StatCard({ label, value, sub, color = C.accent, icon, trend }) {
  const valStr = String(value);
  const fontSize = valStr.length > 9 ? 18 : valStr.length > 7 ? 20 : valStr.length > 5 ? 22 : 26;
  return (
    <div style={{ flex: 1, minWidth: 170, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: "20px 18px", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: -30, right: -30, width: 100, height: 100, borderRadius: "50%", background: color, opacity: 0.04, filter: "blur(30px)" }} />
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</span>
        {icon && <span style={{ fontSize: 14, color: `${color}88` }}>{icon}</span>}
      </div>
      <div style={{ fontFamily: "'Syne',sans-serif", fontSize, fontWeight: 800, color: C.text, fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{value}</div>
      {(sub || trend) && (
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
          {trend && <span style={{ fontSize: 10, fontWeight: 700, color: trend > 0 ? C.green : C.red }}>{trend > 0 ? "↑" : "↓"} {Math.abs(trend)}%</span>}
          {sub && <span style={{ fontSize: 10, color: C.muted, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{sub}</span>}
        </div>
      )}
    </div>
  );
}

function PlanBadge({ plan }) {
  const col = PLAN_COLORS[plan] || C.muted;
  return <span style={{ fontSize: 9, fontWeight: 700, color: col, background: `${col}18`, border: `1px solid ${col}33`, padding: "2px 8px", borderRadius: 4, textTransform: "uppercase", letterSpacing: "0.06em" }}>{plan || "starter"}</span>;
}

function MiniBar({ value, max, color }) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  return (
    <div style={{ height: 4, background: `${color}18`, borderRadius: 2, width: "100%" }}>
      <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: 2, transition: "width .4s ease" }} />
    </div>
  );
}

function SectionHeader({ title, sub }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 22, fontWeight: 800, color: C.text, marginBottom: 4 }}>{title}</div>
      {sub && <div style={{ fontSize: 12, color: C.muted }}>{sub}</div>}
    </div>
  );
}

function Card({ children, style = {} }) {
  return <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, overflow: "hidden", ...style }}>{children}</div>;
}

function CardHeader({ title, right }) {
  return (
    <div style={{ padding: "14px 18px", borderBottom: `1px solid ${C.border}`, background: C.surface2, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <span style={{ fontSize: 12, fontWeight: 700, color: C.text }}>{title}</span>
      {right}
    </div>
  );
}

function EmptyRow({ text }) {
  return <div style={{ padding: 32, textAlign: "center", fontSize: 12, color: C.muted }}>{text}</div>;
}

const fmt = (n) => typeof n === "number" ? n.toLocaleString() : n;
const fmtUSD = (n) => `$${(Number(n) || 0).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
const fmtDate = (d) => d ? new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—";
const fmtDateShort = (d) => d ? new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "—";

// ═══════════════════════════════════════════════════════════════════════════════
// HACKER LOGIN SCREEN
// ═══════════════════════════════════════════════════════════════════════════════
function AdminLoginScreen({ onLogin }) {
  const [lines, setLines] = useState([]);
  const [inputVal, setInputVal] = useState("");
  const [phase, setPhase] = useState("boot");
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

  useEffect(() => { const t = setInterval(() => setCursorVisible(v => !v), 530); return () => clearInterval(t); }, []);
  useEffect(() => {
    const timers = bootSequence.map((line, i) => setTimeout(() => {
      setLines(prev => [...prev, line.text]);
      if (i === bootSequence.length - 1) setTimeout(() => setPhase("prompt"), 400);
    }, line.delay));
    return () => timers.forEach(clearTimeout);
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && phase === "prompt") {
      const cmd = inputVal.trim().toLowerCase();
      if (cmd === "access" || cmd === "login" || cmd === "connect") {
        setLines(prev => [...prev, `> ${inputVal}`, "", "[AUTH] Redirecting to secure authentication portal...", "[AUTH] Google OAuth 2.0 handshake initiated..."]);
        setPhase("auth"); setInputVal("");
        setTimeout(() => onLogin(), 1500);
      } else if (cmd === "help") {
        setLines(prev => [...prev, `> ${inputVal}`, "", "Available commands:", "  access  — Authenticate via secure portal", "  status  — System status check", "  help    — Display this message", ""]);
        setInputVal("");
      } else if (cmd === "status") {
        setLines(prev => [...prev, `> ${inputVal}`, "", `[STATUS] Uptime: ${Math.floor(Math.random() * 99 + 1)} days`, `[STATUS] Active sessions: ${Math.floor(Math.random() * 3)}`, `[STATUS] Threat level: NOMINAL`, `[STATUS] Last breach attempt: ${Math.floor(Math.random() * 48 + 1)}h ago — BLOCKED`, ""]);
        setInputVal("");
      } else if (cmd) {
        setLines(prev => [...prev, `> ${inputVal}`, `bash: ${cmd}: command not found. Type 'help' for commands.`, ""]);
        setInputVal("");
      }
    }
  };

  return (
    <div style={{ background: "#000", height: "100vh", overflow: "hidden", fontFamily: "'JetBrains Mono','Courier New',monospace", position: "relative" }} onClick={() => document.getElementById("mc-terminal-input")?.focus()}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&display=swap');
        @keyframes scanline { 0% { transform:translateY(-100%) } 100% { transform:translateY(100vh) } }
        @keyframes flicker { 0%,100% { opacity:1 } 93% { opacity:.8 } 94%,97% { opacity:1 } 96% { opacity:.9 } }
        @keyframes glowPulse { 0%,100% { text-shadow:0 0 5px #00ff4188,0 0 10px #00ff4144 } 50% { text-shadow:0 0 10px #00ff4188,0 0 20px #00ff4166,0 0 30px #00ff4122 } }
        @keyframes matrixRain { 0% { transform:translateY(-100%);opacity:1 } 100% { transform:translateY(100vh);opacity:0 } }
      `}</style>
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 10, background: "repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,255,65,0.015) 2px,rgba(0,255,65,0.015) 4px)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, height: 2, background: "rgba(0,255,65,0.06)", zIndex: 11, pointerEvents: "none", animation: "scanline 8s linear infinite" }} />
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", opacity: 0.04 }}>
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} style={{ position: "absolute", left: `${i * 5 + Math.random() * 2}%`, top: 0, fontSize: 11, color: "#00ff41", writingMode: "vertical-rl", lineHeight: 1.2, animation: `matrixRain ${6 + Math.random() * 8}s linear infinite`, animationDelay: `${Math.random() * 5}s` }}>
            {Array.from({ length: 30 }).map(() => String.fromCharCode(0x30A0 + Math.random() * 96)).join("")}
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 12, background: "radial-gradient(ellipse at center,transparent 50%,rgba(0,0,0,0.6) 100%)" }} />
      <div style={{ position: "relative", zIndex: 5, height: "100%", padding: "40px 60px", overflow: "auto", animation: "flicker 10s infinite" }}>
        <pre style={{ color: "#00ff41", fontSize: 10, lineHeight: 1.2, animation: "glowPulse 3s ease-in-out infinite", margin: "0 0 8px" }}>{`
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
  ╚═════╝  ╚═════╝  ╚═╝  ╚═══╝    ╚═╝    ╚═╝  ╚═╝  ╚═════╝  ╚══════╝`}</pre>
        {lines.map((line, i) => (
          <div key={i} style={{ color: line.startsWith("[AUTH]") ? "#ff6b35" : line.startsWith("[SYS]") ? "#00ff41" : line.startsWith("[NET]") ? "#00d4ff" : line.startsWith("[STATUS]") ? "#ffdd00" : line.startsWith("┌") || line.startsWith("│") || line.startsWith("└") || line.startsWith("━") ? "#ff003c" : line.startsWith("  ") ? "#888" : "#00ff41", fontSize: 13, lineHeight: 1.7, whiteSpace: "pre", textShadow: line.startsWith("[") ? "0 0 8px currentColor" : "none" }}>{line}</div>
        ))}
        {phase === "prompt" && (
          <div style={{ display: "flex", alignItems: "center", marginTop: 4 }}>
            <span style={{ color: "#00ff41", fontSize: 13 }}>root@mission-control:~$ </span>
            <input id="mc-terminal-input" autoFocus value={inputVal} onChange={e => setInputVal(e.target.value)} onKeyDown={handleKeyDown} style={{ background: "transparent", border: "none", outline: "none", color: "#00ff41", fontSize: 13, fontFamily: "'JetBrains Mono',monospace", flex: 1, caretColor: "transparent" }} />
            <span style={{ color: "#00ff41", opacity: cursorVisible ? 1 : 0, fontSize: 13, fontWeight: 700 }}>█</span>
          </div>
        )}
        {phase === "prompt" && <div style={{ marginTop: 20, color: "#444", fontSize: 11 }}>Type <span style={{ color: "#00ff41" }}>access</span> to authenticate · <span style={{ color: "#555" }}>or type <span style={{ color: "#666" }}>help</span> for commands</span></div>}
        {phase === "auth" && <div style={{ marginTop: 12, color: "#ff6b35", fontSize: 13, animation: "glowPulse 1s ease-in-out infinite" }}>████████████████ CONNECTING TO AUTH GATEWAY...</div>}
        {phase === "prompt" && (
          <div style={{ position: "fixed", bottom: 32, right: 40, zIndex: 20 }}>
            <button onClick={onLogin} style={{ background: "rgba(0,255,65,0.08)", border: "1px solid #00ff4133", borderRadius: 8, color: "#00ff41", fontSize: 11, fontWeight: 600, padding: "10px 20px", cursor: "pointer", fontFamily: "'JetBrains Mono',monospace" }}
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

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN DASHBOARD
// ═══════════════════════════════════════════════════════════════════════════════
function AdminDashboardInner({ session, onSignOut }) {
  const [activeTab, setActiveTab] = useState(() => {
    const hash = window.location.hash.replace("#", "");
    const validTabs = ["overview", "users", "subscriptions", "analytics", "shows", "content", "system"];
    return validTabs.includes(hash) ? hash : "overview";
  });
  useEffect(() => { window.location.hash = activeTab; }, [activeTab]);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [editPlan, setEditPlan] = useState("");
  const [saving, setSaving] = useState(false);
  const [confirmModal, setConfirmModal] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userDetail, setUserDetail] = useState(null);
  const [userDetailLoading, setUserDetailLoading] = useState(false);
  const [planFilter, setPlanFilter] = useState("all");
  const [userSort, setUserSort] = useState("newest");
  const [showAddUser, setShowAddUser] = useState(false);
  const [addingUser, setAddingUser] = useState(false);

  const getToken = useCallback(async () => {
    const { data: { session: s } } = await supabase.auth.getSession();
    return s?.access_token;
  }, []);

  const fetchData = useCallback(async (isInitial) => {
    if (isInitial) setLoading(true);
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
      setUsers((await usersRes.json()).users || []);
      if (statsRes.ok) setStats(await statsRes.json());
    } catch (e) { setError(e.message); }
    if (isInitial) setLoading(false);
  }, [getToken]);

  useEffect(() => {
    fetchData(true);
    const interval = setInterval(() => fetchData(false), 30000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const fetchUserDetail = useCallback(async (userId) => {
    setUserDetailLoading(true);
    try {
      const token = await getToken();
      const res = await fetch(`/api/admin/users?action=user-detail&userId=${userId}`, { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) setUserDetail(await res.json());
    } catch (e) {}
    setUserDetailLoading(false);
  }, [getToken]);

  const updatePlan = async (userId, newPlan) => {
    setSaving(true);
    try {
      const token = await getToken();
      const res = await fetch("/api/admin/users?action=update-plan", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ userId, plan: newPlan }),
      });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || "Failed");
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, plan: newPlan } : u));
      setEditingUser(null);
      setConfirmModal(null);
      // Refresh stats
      const token2 = await getToken();
      const statsRes = await fetch("/api/admin/users?action=stats", { headers: { Authorization: `Bearer ${token2}` } });
      if (statsRes.ok) setStats(await statsRes.json());
    } catch (e) { alert("Failed: " + e.message); }
    setSaving(false);
  };

  const createUser = async (userData) => {
    setAddingUser(true);
    try {
      const token = await getToken();
      const res = await fetch("/api/admin/users?action=create-user", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(userData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create user");
      // Add new user to list
      if (data.user) setUsers(prev => [data.user, ...prev]);
      setShowAddUser(false);
      // Refresh stats
      const statsRes = await fetch("/api/admin/users?action=stats", { headers: { Authorization: `Bearer ${token}` } });
      if (statsRes.ok) setStats(await statsRes.json());
      return { success: true };
    } catch (e) {
      return { error: e.message };
    } finally {
      setAddingUser(false);
    }
  };

  const filteredUsers = users.filter(u => {
    if (planFilter !== "all" && (u.plan || "starter") !== planFilter) return false;
    if (!search) return true;
    const q = search.toLowerCase();
    return (u.name || u.first_name || "").toLowerCase().includes(q) || (u.email || "").toLowerCase().includes(q) || (u.shop_name || "").toLowerCase().includes(q);
  }).sort((a, b) => {
    if (userSort === "newest") return new Date(b.created_at || 0) - new Date(a.created_at || 0);
    if (userSort === "oldest") return new Date(a.created_at || 0) - new Date(b.created_at || 0);
    if (userSort === "name") return (a.name || a.first_name || "").localeCompare(b.name || b.first_name || "");
    return 0;
  });

  // ════════════════════════════════════════════════════════════════════════════
  // TAB: OVERVIEW
  // ════════════════════════════════════════════════════════════════════════════
  function TabOverview() {
    const s = stats || {};
    const planBreakdown = s.planCounts ? Object.entries(s.planCounts).map(([p, c]) => `${c} ${p}`).join(" · ") : "";
    return (
      <div style={{ padding: "28px 32px", overflowY: "auto", flex: 1 }}>
        <SectionHeader title="Command Center" sub="Real-time platform health and performance" />

        {/* Row 1: Core KPIs */}
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 20 }}>
          <StatCard label="Total Users" value={fmt(s.total || users.length)} icon="◉" color={C.accent} sub={planBreakdown} />
          <StatCard label="Monthly Revenue" value={fmtUSD(s.mrr || 0)} icon="◆" color={C.green} sub={`${fmt(s.total || 0)} subscriptions`} />
          <StatCard label="Active Users" value={fmt(s.activeUsers || 0)} icon="⬡" color={C.blue} sub="Shows in last 30 days" />
          <StatCard label="New This Week" value={fmt(s.recentSignups ?? 0)} icon="✦" color={C.cyan} />
        </div>

        {/* Row 2: Platform metrics */}
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 24 }}>
          <StatCard label="Total Buyers" value={fmt(s.buyers?.total || 0)} icon="◉" color={C.pink} sub={`${fmtUSD(s.buyers?.totalSpend || 0)} total spend`} />
          <StatCard label="Shows Completed" value={fmt(s.shows?.completed || 0)} icon="◈" color={C.amber} sub={`${fmtUSD(s.shows?.totalGMV || 0)} GMV`} />
          <StatCard label="Campaigns Sent" value={fmt(s.campaigns?.sent || 0)} icon="◆" color={C.accent} sub={`${fmt(s.campaigns?.totalRecipients || 0)} recipients`} />
          <StatCard label="Connections" value={fmt(s.connections?.total || 0)} icon="◎" color={C.green} />
        </div>

        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          {/* Plan distribution */}
          <Card style={{ flex: 2, minWidth: 300 }}>
            <CardHeader title="Plan Distribution" />
            <div style={{ padding: "16px 18px" }}>
              {["starter", "growth", "pro", "enterprise"].map(p => {
                const count = s.planCounts?.[p] || 0;
                const total = s.total || 1;
                const pct = Math.round((count / total) * 100);
                const col = PLAN_COLORS[p];
                const rev = count * PLAN_PRICES[p];
                return (
                  <div key={p} style={{ marginBottom: 14 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 5 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ width: 8, height: 8, borderRadius: "50%", background: col }} />
                        <span style={{ fontSize: 12, fontWeight: 600, color: col, textTransform: "capitalize" }}>{p}</span>
                      </div>
                      <div style={{ display: "flex", gap: 12 }}>
                        <span style={{ fontSize: 11, color: C.muted }}>{count} users ({pct}%)</span>
                        <span style={{ fontSize: 11, color: col, fontWeight: 600 }}>{fmtUSD(rev)}/mo</span>
                      </div>
                    </div>
                    <MiniBar value={count} max={total} color={col} />
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Platform connections */}
          <Card style={{ flex: 1, minWidth: 240 }}>
            <CardHeader title="Platform Connections" />
            <div style={{ padding: "12px 18px" }}>
              {Object.entries(s.connections?.byPlatform || {}).sort((a, b) => b[1] - a[1]).map(([plat, count]) => {
                const col = PLATFORM_COLORS[plat] || C.muted;
                const label = PLATFORM_LABELS[plat] || plat;
                return (
                  <div key={plat} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${C.border}` }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 6, height: 6, borderRadius: "50%", background: col }} />
                      <span style={{ fontSize: 12, color: C.text }}>{label}</span>
                    </div>
                    <span style={{ fontSize: 12, color: C.muted, fontVariantNumeric: "tabular-nums" }}>{count}</span>
                  </div>
                );
              })}
              {!s.connections?.byPlatform || Object.keys(s.connections.byPlatform).length === 0 ? <EmptyRow text="No connections yet" /> : null}
            </div>
          </Card>
        </div>

        {/* Recent signups */}
        <Card style={{ marginTop: 20 }}>
          <CardHeader title="Recent Signups" right={<span style={{ fontSize: 10, color: C.muted }}>{users.length} total</span>} />
          {users.slice(0, 8).map(u => (
            <div key={u.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 18px", borderBottom: `1px solid ${C.border}` }}>
              <Avatar initials={deriveAvatar(u.name || u.first_name || u.email)} color={PLAN_COLORS[u.plan] || C.accent} size={30} url={u.avatar_url} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: C.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{u.name || u.first_name || "—"}</div>
                <div style={{ fontSize: 10, color: C.muted }}>{u.email} {u.shop_name ? `· ${u.shop_name}` : ""}</div>
              </div>
              <PlanBadge plan={u.plan} />
              <span style={{ fontSize: 10, color: C.muted, minWidth: 70, textAlign: "right" }}>{fmtDateShort(u.created_at)}</span>
            </div>
          ))}
          {users.length === 0 && <EmptyRow text="No users yet" />}
        </Card>
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════════════════════
  // TAB: USERS
  // ════════════════════════════════════════════════════════════════════════════
  function TabUsers() {
    return (
      <div style={{ padding: "28px 32px", overflowY: "auto", flex: 1 }}>
        {selectedUser ? (
          <UserDetailView user={selectedUser} onBack={() => { setSelectedUser(null); setUserDetail(null); }} />
        ) : (
          <>
            <SectionHeader title="Users" sub={`${users.length} total accounts`} />

            {/* Toolbar */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name, email, or shop..."
                style={{ background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 8, padding: "8px 14px", fontSize: 12, color: C.text, width: 280, outline: "none" }} />
              <div style={{ display: "flex", gap: 4 }}>
                {["all", "starter", "growth", "pro"].map(p => (
                  <button key={p} onClick={() => setPlanFilter(p)} style={{
                    background: planFilter === p ? `${(PLAN_COLORS[p] || C.accent)}22` : C.surface, border: `1px solid ${planFilter === p ? (PLAN_COLORS[p] || C.accent) + "55" : C.border}`,
                    borderRadius: 6, padding: "5px 12px", fontSize: 10, fontWeight: 600, cursor: "pointer",
                    color: planFilter === p ? (PLAN_COLORS[p] || C.accent) : C.muted, textTransform: "capitalize",
                  }}>{p}</button>
                ))}
              </div>
              <select value={userSort} onChange={e => setUserSort(e.target.value)} style={{ background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 6, padding: "6px 10px", fontSize: 11, color: C.text, outline: "none" }}>
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
                <option value="name">Name A–Z</option>
              </select>
              <span style={{ fontSize: 10, color: C.muted, marginLeft: "auto" }}>{filteredUsers.length} results</span>
              <button onClick={() => setShowAddUser(true)} style={{ background: `linear-gradient(135deg,${C.accent},${C.accent2})`, border: "none", borderRadius: 7, color: "#fff", fontSize: 11, fontWeight: 700, padding: "7px 16px", cursor: "pointer" }}>+ Add User</button>
            </div>

            <Card>
              <div style={{ display: "flex", alignItems: "center", padding: "10px 18px", borderBottom: `1px solid ${C.border2}`, background: C.surface2 }}>
                <div style={{ flex: 2, fontSize: 10, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.08em" }}>User</div>
                <div style={{ flex: 2, fontSize: 10, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.08em" }}>Email</div>
                <div style={{ width: 90, fontSize: 10, fontWeight: 700, color: C.muted, textTransform: "uppercase" }}>Plan</div>
                <div style={{ width: 110, fontSize: 10, fontWeight: 700, color: C.muted, textTransform: "uppercase" }}>Shop</div>
                <div style={{ width: 90, fontSize: 10, fontWeight: 700, color: C.muted, textTransform: "uppercase" }}>Joined</div>
                <div style={{ width: 130, fontSize: 10, fontWeight: 700, color: C.muted, textTransform: "uppercase", textAlign: "right" }}>Actions</div>
              </div>
              {filteredUsers.map(u => (
                <div key={u.id} style={{ display: "flex", alignItems: "center", padding: "10px 18px", borderBottom: `1px solid ${C.border}`, cursor: "pointer", transition: "background .1s" }}
                  onMouseEnter={e => e.currentTarget.style.background = C.surface2}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  onClick={() => { setSelectedUser(u); fetchUserDetail(u.id); }}>
                  <div style={{ flex: 2, display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                    <Avatar initials={deriveAvatar(u.name || u.first_name || u.email)} color={PLAN_COLORS[u.plan] || C.accent} size={28} url={u.avatar_url} />
                    <span style={{ fontSize: 12, fontWeight: 600, color: C.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{u.name || u.first_name || "—"}</span>
                  </div>
                  <div style={{ flex: 2, fontSize: 11, color: C.muted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{u.email || "—"}</div>
                  <div style={{ width: 90 }}><PlanBadge plan={u.plan} /></div>
                  <div style={{ width: 110, fontSize: 11, color: C.muted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{u.shop_name || "—"}</div>
                  <div style={{ width: 90, fontSize: 11, color: C.muted }}>{fmtDateShort(u.created_at)}</div>
                  <div style={{ width: 130, display: "flex", gap: 6, justifyContent: "flex-end" }} onClick={e => e.stopPropagation()}>
                    <button onClick={() => { setEditingUser(u); setEditPlan(u.plan || "starter"); }} style={{ background: `${C.accent}18`, border: `1px solid ${C.accent}33`, borderRadius: 6, color: C.accent, fontSize: 10, fontWeight: 600, padding: "4px 10px", cursor: "pointer" }}>Edit Plan</button>
                    <button onClick={() => { setSelectedUser(u); fetchUserDetail(u.id); }} style={{ background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 6, color: C.muted, fontSize: 10, fontWeight: 600, padding: "4px 10px", cursor: "pointer" }}>View</button>
                  </div>
                </div>
              ))}
              {filteredUsers.length === 0 && <EmptyRow text={search ? "No users match" : "No users"} />}
            </Card>
          </>
        )}
      </div>
    );
  }

  // ── User Detail View ────────────────────────────────────────────────────────
  function UserDetailView({ user, onBack }) {
    const d = userDetail;
    const col = PLAN_COLORS[user.plan] || C.accent;
    return (
      <div>
        <button onClick={onBack} style={{ background: "none", border: "none", color: C.muted, fontSize: 12, cursor: "pointer", padding: "0 0 16px", display: "flex", alignItems: "center", gap: 6 }}
          onMouseEnter={e => e.currentTarget.style.color = C.text} onMouseLeave={e => e.currentTarget.style.color = C.muted}>
          ← Back to Users
        </button>

        {/* Profile header */}
        <Card style={{ marginBottom: 20 }}>
          <div style={{ padding: "24px 22px", display: "flex", gap: 20, alignItems: "center" }}>
            <Avatar initials={deriveAvatar(user.name || user.first_name)} color={col} size={56} url={user.avatar_url} />
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 20, fontWeight: 800, color: C.text }}>{user.name || user.first_name || "—"}</div>
              <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{user.email}</div>
              <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
                <PlanBadge plan={user.plan} />
                {user.shop_name && <span style={{ fontSize: 9, fontWeight: 600, color: C.cyan, background: `${C.cyan}18`, border: `1px solid ${C.cyan}33`, padding: "2px 8px", borderRadius: 4 }}>{user.shop_name}</span>}
                {user.category && <span style={{ fontSize: 9, fontWeight: 600, color: C.muted, background: C.surface2, border: `1px solid ${C.border}`, padding: "2px 8px", borderRadius: 4 }}>{user.category}</span>}
                {(user.platforms || []).map(p => <span key={p} style={{ fontSize: 9, fontWeight: 600, color: PLATFORM_COLORS[p] || C.muted, background: `${PLATFORM_COLORS[p] || C.muted}18`, border: `1px solid ${PLATFORM_COLORS[p] || C.muted}33`, padding: "2px 8px", borderRadius: 4 }}>{p}</span>)}
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 10, color: C.muted }}>Joined {fmtDate(user.created_at)}</div>
              <div style={{ fontSize: 10, color: C.muted, marginTop: 2 }}>ID: {user.id?.slice(0, 8)}...</div>
              <button onClick={() => { setEditingUser(user); setEditPlan(user.plan || "starter"); }} style={{ marginTop: 8, background: `linear-gradient(135deg,${C.accent},${C.accent2})`, border: "none", borderRadius: 7, color: "#fff", fontSize: 11, fontWeight: 700, padding: "6px 16px", cursor: "pointer" }}>Change Plan</button>
            </div>
          </div>
        </Card>

        {userDetailLoading ? (
          <div style={{ textAlign: "center", padding: 40, color: C.muted, fontSize: 12 }}>Loading user data...</div>
        ) : d ? (
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            {/* Stats row */}
            <div style={{ display: "flex", gap: 14, width: "100%", flexWrap: "wrap" }}>
              <StatCard label="Buyers" value={fmt(d.buyers?.length || 0)} color={C.pink} icon="◉" />
              <StatCard label="Shows" value={fmt(d.shows?.length || 0)} color={C.amber} icon="◈" />
              <StatCard label="Products" value={fmt(d.products?.length || 0)} color={C.green} icon="◧" />
              <StatCard label="Orders" value={fmt(d.orders?.length || 0)} color={C.blue} icon="◆" />
              <StatCard label="Connections" value={fmt(d.connections?.length || 0)} color={C.cyan} icon="◎" />
            </div>

            {/* Connections */}
            <Card style={{ flex: 1, minWidth: 260 }}>
              <CardHeader title="Connected Platforms" />
              <div style={{ padding: "8px 18px" }}>
                {(d.connections || []).map((c, i) => {
                  const pc = PLATFORM_COLORS[c.platform] || C.muted;
                  return (
                    <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${C.border}` }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ width: 6, height: 6, borderRadius: "50%", background: pc }} />
                        <span style={{ fontSize: 12, color: C.text }}>{PLATFORM_LABELS[c.platform] || c.platform}</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        {c.handle && <span style={{ fontSize: 10, color: C.muted }}>@{c.handle}</span>}
                        <span style={{ fontSize: 10, color: C.green }}>Connected</span>
                      </div>
                    </div>
                  );
                })}
                {(d.connections || []).length === 0 && <EmptyRow text="No connections" />}
              </div>
            </Card>

            {/* Recent shows */}
            <Card style={{ flex: 1, minWidth: 300 }}>
              <CardHeader title="Recent Shows" />
              <div style={{ padding: "4px 0" }}>
                {(d.shows || []).slice(0, 8).map(s => (
                  <div key={s.id} style={{ display: "flex", alignItems: "center", padding: "8px 18px", borderBottom: `1px solid ${C.border}`, gap: 10 }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: C.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.title}</div>
                      <div style={{ fontSize: 10, color: C.muted }}>{fmtDateShort(s.date)} · {s.duration_min || 0}min · {(s.platforms || []).join(", ")}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: C.green }}>{fmtUSD(s.gmv)}</div>
                      <div style={{ fontSize: 10, color: C.muted }}>{s.buyers_count || 0} buyers</div>
                    </div>
                  </div>
                ))}
                {(d.shows || []).length === 0 && <EmptyRow text="No shows yet" />}
              </div>
            </Card>

            {/* Top buyers */}
            <Card style={{ width: "100%" }}>
              <CardHeader title="Top Buyers" right={<span style={{ fontSize: 10, color: C.muted }}>{d.buyers?.length || 0} total</span>} />
              <div style={{ padding: "4px 0" }}>
                {(d.buyers || []).slice(0, 10).map(b => (
                  <div key={b.id} style={{ display: "flex", alignItems: "center", padding: "8px 18px", borderBottom: `1px solid ${C.border}`, gap: 10 }}>
                    <Avatar initials={deriveAvatar(b.name)} color={b.status === "vip" ? C.amber : C.accent} size={24} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: C.text }}>{b.name}</span>
                      <span style={{ fontSize: 10, color: C.muted, marginLeft: 8 }}>{b.email || ""}</span>
                    </div>
                    <span style={{ fontSize: 10, color: C.muted, textTransform: "capitalize" }}>{b.status}</span>
                    <span style={{ fontSize: 10, color: C.muted }}>{b.orders || 0} orders</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: C.green, minWidth: 60, textAlign: "right" }}>{fmtUSD(b.spend)}</span>
                  </div>
                ))}
                {(d.buyers || []).length === 0 && <EmptyRow text="No buyers" />}
              </div>
            </Card>
          </div>
        ) : null}
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════════════════════
  // TAB: SUBSCRIPTIONS
  // ════════════════════════════════════════════════════════════════════════════
  function TabSubscriptions() {
    return (
      <div style={{ padding: "28px 32px", overflowY: "auto", flex: 1 }}>
        <SectionHeader title="Subscriptions" sub="Manage plans, revenue, and billing" />

        {/* Revenue cards */}
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 24 }}>
          {VALID_PLANS.map(plan => {
            const count = stats?.planCounts?.[plan] || 0;
            const col = PLAN_COLORS[plan];
            const revenue = count * PLAN_PRICES[plan];
            const pct = (stats?.total || 1) > 0 ? Math.round((count / (stats?.total || 1)) * 100) : 0;
            return (
              <div key={plan} style={{ flex: 1, minWidth: 200, background: C.surface, border: `1px solid ${col}33`, borderRadius: 14, padding: "22px 20px", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: -20, right: -20, width: 80, height: 80, borderRadius: "50%", background: col, opacity: 0.06, filter: "blur(24px)" }} />
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: col }} />
                  <span style={{ fontSize: 14, fontWeight: 700, color: col, textTransform: "capitalize" }}>{plan}</span>
                  <span style={{ fontSize: 11, color: C.muted, marginLeft: "auto" }}>${PLAN_PRICES[plan]}/mo</span>
                </div>
                <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 28, fontWeight: 800, color: C.text }}>{count}</div>
                <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{pct}% of users · {fmtUSD(revenue)}/mo</div>
                <MiniBar value={count} max={stats?.total || 1} color={col} />
              </div>
            );
          })}
        </div>

        {/* All users subscription list */}
        <Card>
          <CardHeader title="All Subscriptions" right={<span style={{ fontSize: 10, color: C.green, fontWeight: 700 }}>MRR: {fmtUSD(stats?.mrr || 0)}</span>} />
          {users.map(u => (
            <div key={u.id} style={{ display: "flex", alignItems: "center", padding: "10px 18px", borderBottom: `1px solid ${C.border}`, gap: 12 }}
              onMouseEnter={e => e.currentTarget.style.background = C.surface2}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
              <Avatar initials={deriveAvatar(u.name || u.first_name || u.email)} color={PLAN_COLORS[u.plan] || C.accent} size={28} url={u.avatar_url} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: C.text }}>{u.name || u.first_name || "—"}</div>
                <div style={{ fontSize: 10, color: C.muted }}>{u.email}</div>
              </div>
              <PlanBadge plan={u.plan} />
              <span style={{ fontSize: 11, color: C.muted, minWidth: 70, textAlign: "right", fontVariantNumeric: "tabular-nums" }}>${PLAN_PRICES[u.plan || "starter"]}/mo</span>
              <button onClick={() => { setEditingUser(u); setEditPlan(u.plan || "starter"); }}
                style={{ background: "none", border: `1px solid ${C.border2}`, borderRadius: 6, color: C.muted, fontSize: 10, fontWeight: 600, padding: "4px 12px", cursor: "pointer" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = C.accent; e.currentTarget.style.color = C.accent; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = C.border2; e.currentTarget.style.color = C.muted; }}>
                Change
              </button>
            </div>
          ))}
        </Card>
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════════════════════
  // TAB: ANALYTICS
  // ════════════════════════════════════════════════════════════════════════════
  function TabAnalytics() {
    const [analyticsUser, setAnalyticsUser] = useState("all");
    const [userStats, setUserStats] = useState(null);
    const [userStatsLoading, setUserStatsLoading] = useState(false);

    useEffect(() => {
      if (analyticsUser === "all") { setUserStats(null); return; }
      (async () => {
        setUserStatsLoading(true);
        try {
          const token = await getToken();
          const res = await fetch(`/api/admin/users?action=user-stats&userId=${analyticsUser}`, { headers: { Authorization: `Bearer ${token}` } });
          if (res.ok) setUserStats(await res.json());
        } catch (e) {}
        setUserStatsLoading(false);
      })();
    }, [analyticsUser, getToken]);

    const s = analyticsUser === "all" ? (stats || {}) : (userStats || {});
    const showStats = s.shows || {};
    const buyerStats = s.buyers || {};
    const campaignStats = s.campaigns || {};
    const orderStats = s.orders || {};
    const autoStats = s.automations || {};
    const loyaltyStats = s.loyalty || {};
    const optInStats = s.optIns || {};
    const prodStats = s.production || {};
    const teamStats = s.team || {};
    const showProdStats = s.showProducts || {};

    const selectedUserName = analyticsUser === "all" ? null : (users.find(u => u.id === analyticsUser) || {});

    return (
      <div style={{ padding: "28px 32px", overflowY: "auto", flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <SectionHeader title={analyticsUser === "all" ? "Platform Analytics" : `${selectedUserName?.first_name || selectedUserName?.email || "User"} Analytics`} sub={analyticsUser === "all" ? "Aggregate performance across all users" : (selectedUserName?.shop_name || selectedUserName?.email || "")} />
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {userStatsLoading && <span style={{ fontSize: 11, color: C.muted }}>Loading...</span>}
            <select value={analyticsUser} onChange={e => setAnalyticsUser(e.target.value)}
              style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "8px 14px", fontSize: 12, color: C.text, outline: "none", minWidth: 180, cursor: "pointer" }}>
              <option value="all">All Accounts</option>
              {users.map(u => (
                <option key={u.id} value={u.id}>{u.first_name || u.email} — {(u.plan || "starter").charAt(0).toUpperCase() + (u.plan || "starter").slice(1)}</option>
              ))}
            </select>
          </div>
        </div>

        {/* GMV & Revenue */}
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 24 }}>
          <StatCard label="Total GMV" value={fmtUSD(showStats.totalGMV || 0)} icon="◆" color={C.green} sub={`${fmt(showStats.completed || 0)} shows`} />
          <StatCard label="Avg Show GMV" value={fmtUSD(showStats.avgShowGMV || 0)} icon="◈" color={C.amber} />
          <StatCard label="Total Orders" value={fmt(orderStats.total || 0)} icon="◉" color={C.blue} sub={fmtUSD(orderStats.totalRevenue || 0)} />
          <StatCard label="Total Airtime" value={`${fmt(showStats.totalMinutes || 0)}m`} icon="⬡" color={C.pink} sub={showStats.completed ? `~${Math.round((showStats.totalMinutes || 0) / showStats.completed)}m avg` : ""} />
        </div>

        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 24 }}>
          {/* Platform usage in shows */}
          <Card style={{ flex: 1, minWidth: 280 }}>
            <CardHeader title="Platform Usage in Shows" />
            <div style={{ padding: "12px 18px" }}>
              {Object.entries(showStats.platformUsage || {}).sort((a, b) => b[1] - a[1]).map(([plat, count]) => {
                const col = PLATFORM_COLORS[plat] || C.muted;
                const maxCount = Math.max(...Object.values(showStats.platformUsage || {}), 1);
                return (
                  <div key={plat} style={{ marginBottom: 12 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: col }}>{PLATFORM_LABELS[plat] || plat}</span>
                      <span style={{ fontSize: 11, color: C.muted }}>{count} shows</span>
                    </div>
                    <MiniBar value={count} max={maxCount} color={col} />
                  </div>
                );
              })}
              {!showStats.platformUsage || Object.keys(showStats.platformUsage).length === 0 ? <EmptyRow text="No show data" /> : null}
            </div>
          </Card>

          {/* Buyer health */}
          <Card style={{ flex: 1, minWidth: 280 }}>
            <CardHeader title="Buyer Health" right={<span style={{ fontSize: 10, color: C.muted }}>{fmt(buyerStats.total || 0)} total</span>} />
            <div style={{ padding: "12px 18px" }}>
              {Object.entries(buyerStats.byStatus || {}).sort((a, b) => b[1] - a[1]).map(([status, count]) => {
                const cols = { vip: C.amber, active: C.green, risk: C.red, new: C.blue, dormant: C.muted };
                const col = cols[status] || C.muted;
                return (
                  <div key={status} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${C.border}` }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 6, height: 6, borderRadius: "50%", background: col }} />
                      <span style={{ fontSize: 12, color: C.text, textTransform: "capitalize" }}>{status}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: col }}>{fmt(count)}</span>
                      <span style={{ fontSize: 10, color: C.muted }}>{buyerStats.total ? Math.round((count / buyerStats.total) * 100) : 0}%</span>
                    </div>
                  </div>
                );
              })}
              {!buyerStats.byStatus || Object.keys(buyerStats.byStatus).length === 0 ? <EmptyRow text="No buyer data" /> : null}
            </div>
          </Card>
        </div>

        {/* Campaign performance */}
        <Card>
          <CardHeader title="Campaign Performance" />
          <div style={{ padding: "20px 18px", display: "flex", gap: 30, flexWrap: "wrap" }}>
            {[
              { label: "Sent", value: fmt(campaignStats.sent || 0), color: C.accent },
              { label: "Recipients", value: fmt(campaignStats.totalRecipients || 0), color: C.blue },
              { label: "Opens", value: fmt(campaignStats.totalOpens || 0), color: C.cyan },
              { label: "Clicks", value: fmt(campaignStats.totalClicks || 0), color: C.amber },
              { label: "Conversions", value: fmt(campaignStats.totalConversions || 0), color: C.green },
              { label: "Campaign GMV", value: fmtUSD(campaignStats.gmv || 0), color: C.green },
            ].map(m => {
              const vLen = String(m.value).length;
              const fs = vLen > 9 ? 18 : vLen > 7 ? 20 : vLen > 5 ? 22 : 26;
              return (
                <div key={m.label} style={{ textAlign: "center", minWidth: 80, flex: 1 }}>
                  <div style={{ fontFamily: "'Syne',sans-serif", fontSize: fs, fontWeight: 800, color: m.color, fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>{m.value}</div>
                  <div style={{ fontSize: 10, color: C.muted, marginTop: 2 }}>{m.label}</div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Categories & Orders by platform */}
        <div style={{ display: "flex", gap: 16, marginTop: 20, flexWrap: "wrap" }}>
          <Card style={{ flex: 1, minWidth: 260 }}>
            <CardHeader title="Seller Categories" />
            <div style={{ padding: "12px 18px" }}>
              {Object.entries(stats?.categories || {}).sort((a, b) => b[1] - a[1]).map(([cat, count]) => (
                <div key={cat} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "7px 0", borderBottom: `1px solid ${C.border}` }}>
                  <span style={{ fontSize: 12, color: C.text }}>{cat}</span>
                  <span style={{ fontSize: 12, color: C.muted, fontVariantNumeric: "tabular-nums" }}>{count}</span>
                </div>
              ))}
              {!stats?.categories || Object.keys(stats.categories).length === 0 ? <EmptyRow text="No category data" /> : null}
            </div>
          </Card>

          <Card style={{ flex: 1, minWidth: 260 }}>
            <CardHeader title="Orders by Platform" />
            <div style={{ padding: "12px 18px" }}>
              {Object.entries(orderStats.byPlatform || {}).sort((a, b) => b[1] - a[1]).map(([plat, count]) => {
                const col = PLATFORM_COLORS[plat] || C.muted;
                return (
                  <div key={plat} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "7px 0", borderBottom: `1px solid ${C.border}` }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 6, height: 6, borderRadius: "50%", background: col }} />
                      <span style={{ fontSize: 12, color: C.text }}>{PLATFORM_LABELS[plat] || plat}</span>
                    </div>
                    <span style={{ fontSize: 12, color: C.muted }}>{fmt(count)}</span>
                  </div>
                );
              })}
              {!orderStats.byPlatform || Object.keys(orderStats.byPlatform).length === 0 ? <EmptyRow text="No order data" /> : null}
            </div>
          </Card>
        </div>

        {/* ── Perks & Loyalty ── */}
        <div style={{ marginTop: 28 }}>
          <SectionHeader title="Perks & Loyalty" sub="Loyalty program engagement across the platform" />
        </div>
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 24 }}>
          <StatCard label="Loyalty Transactions" value={fmt(loyaltyStats.totalTransactions || 0)} icon="★" color={C.amber} />
          <StatCard label="Points Issued" value={fmt(loyaltyStats.totalPoints || 0)} icon="◆" color={C.green} sub="all time" />
          <StatCard label="Loyalty Members" value={fmt(loyaltyStats.uniqueBuyers || 0)} icon="◉" color={C.accent} />
          <StatCard label="Opt-Ins Collected" value={fmt(optInStats.total || 0)} icon="✦" color={C.cyan} />
        </div>

        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 24 }}>
          <Card style={{ flex: 1, minWidth: 260 }}>
            <CardHeader title="Points by Reason" />
            <div style={{ padding: "12px 18px" }}>
              {Object.entries(loyaltyStats.byReason || {}).sort((a, b) => b[1] - a[1]).map(([reason, count]) => {
                const reasonLabels = { show_purchase: "Show Purchase", referral_bonus: "Referral", vip_bonus: "VIP Bonus", repeat_purchase: "Repeat Purchase", review_reward: "Review", birthday_bonus: "Birthday", streak_bonus: "Streak", social_share: "Social Share" };
                const maxCount = Math.max(...Object.values(loyaltyStats.byReason || {}), 1);
                return (
                  <div key={reason} style={{ marginBottom: 10 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 3 }}>
                      <span style={{ fontSize: 12, color: C.text }}>{reasonLabels[reason] || reason}</span>
                      <span style={{ fontSize: 11, color: C.muted }}>{count}</span>
                    </div>
                    <MiniBar value={count} max={maxCount} color={C.amber} />
                  </div>
                );
              })}
              {!loyaltyStats.byReason || Object.keys(loyaltyStats.byReason).length === 0 ? <EmptyRow text="No loyalty data" /> : null}
            </div>
          </Card>

          <Card style={{ flex: 1, minWidth: 260 }}>
            <CardHeader title="Opt-In Sources" />
            <div style={{ padding: "12px 18px" }}>
              {Object.entries(optInStats.bySource || {}).sort((a, b) => b[1] - a[1]).map(([src, count]) => {
                const srcLabels = { show_popup: "Show Popup", checkout_flow: "Checkout", landing_page: "Landing Page", social_link: "Social Link", qr_code: "QR Code", referral: "Referral" };
                const maxCount = Math.max(...Object.values(optInStats.bySource || {}), 1);
                return (
                  <div key={src} style={{ marginBottom: 10 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 3 }}>
                      <span style={{ fontSize: 12, color: C.text }}>{srcLabels[src] || src}</span>
                      <span style={{ fontSize: 11, color: C.muted }}>{count}</span>
                    </div>
                    <MiniBar value={count} max={maxCount} color={C.cyan} />
                  </div>
                );
              })}
              {!optInStats.bySource || Object.keys(optInStats.bySource).length === 0 ? <EmptyRow text="No opt-in data" /> : null}
            </div>
          </Card>
        </div>

        {/* ── Production & Automation ── */}
        <div style={{ marginTop: 28 }}>
          <SectionHeader title="Production & Automation" sub="Devices, automations, and team across the platform" />
        </div>
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 24 }}>
          <StatCard label="Total Devices" value={fmt(prodStats.totalDevices || 0)} icon="◧" color={C.pink} sub={`${fmt(prodStats.connected || 0)} connected`} />
          <StatCard label="Automations" value={fmt(autoStats.total || 0)} icon="⚡" color={C.accent} sub={`${fmt(autoStats.active || 0)} active`} />
          <StatCard label="Auto Triggers" value={fmt(autoStats.totalTriggers || 0)} icon="◈" color={C.amber} sub={`${fmt(autoStats.totalConversions || 0)} conv.`} />
          <StatCard label="Team Members" value={fmt(teamStats.totalMembers || 0)} icon="◉" color={C.blue} sub={`${fmt(teamStats.teamsWithMembers || 0)} teams`} />
          <StatCard label="Show Products" value={fmt(showProdStats.total || 0)} icon="◆" color={C.green} sub={`~${showProdStats.avgPerShow || 0}/show`} />
        </div>

        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 24 }}>
          <Card style={{ flex: 1, minWidth: 260 }}>
            <CardHeader title="Device Categories" />
            <div style={{ padding: "12px 18px" }}>
              {Object.entries(prodStats.byCategory || {}).sort((a, b) => b[1] - a[1]).map(([cat, count]) => {
                const catLabels = { camera: "Cameras", computer: "Computers", microphone: "Microphones", lighting: "Lighting", capture_card: "Capture Cards", controller: "Controllers", audio_mixer: "Audio Mixers", switcher: "Switchers", teleprompter: "Teleprompters" };
                return (
                  <div key={cat} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "7px 0", borderBottom: `1px solid ${C.border}` }}>
                    <span style={{ fontSize: 12, color: C.text }}>{catLabels[cat] || cat}</span>
                    <span style={{ fontSize: 12, color: C.muted }}>{count}</span>
                  </div>
                );
              })}
              {!prodStats.byCategory || Object.keys(prodStats.byCategory).length === 0 ? <EmptyRow text="No device data" /> : null}
            </div>
          </Card>

          <Card style={{ flex: 1, minWidth: 260 }}>
            <CardHeader title="Automation Goals" />
            <div style={{ padding: "12px 18px" }}>
              {Object.entries(autoStats.byGoal || {}).sort((a, b) => b[1] - a[1]).map(([goal, count]) => {
                const goalCols = { sales: C.green, engagement: C.accent, support: C.blue, trust: C.amber, loyalty: C.pink, leads: C.cyan, onboarding: C.green };
                return (
                  <div key={goal} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "7px 0", borderBottom: `1px solid ${C.border}` }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 6, height: 6, borderRadius: "50%", background: goalCols[goal] || C.muted }} />
                      <span style={{ fontSize: 12, color: C.text, textTransform: "capitalize" }}>{goal}</span>
                    </div>
                    <span style={{ fontSize: 12, color: C.muted }}>{count}</span>
                  </div>
                );
              })}
              {!autoStats.byGoal || Object.keys(autoStats.byGoal).length === 0 ? <EmptyRow text="No automation data" /> : null}
            </div>
          </Card>

          <Card style={{ flex: 1, minWidth: 260 }}>
            <CardHeader title="Team Roles" />
            <div style={{ padding: "12px 18px" }}>
              {Object.entries(teamStats.byRole || {}).sort((a, b) => b[1] - a[1]).map(([role, count]) => {
                const roleCols = { owner: C.amber, manager: C.accent, producer: C.green, analyst: C.cyan, support: C.blue, viewer: C.muted };
                return (
                  <div key={role} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "7px 0", borderBottom: `1px solid ${C.border}` }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 6, height: 6, borderRadius: "50%", background: roleCols[role] || C.muted }} />
                      <span style={{ fontSize: 12, color: C.text, textTransform: "capitalize" }}>{role}</span>
                    </div>
                    <span style={{ fontSize: 12, color: C.muted }}>{count}</span>
                  </div>
                );
              })}
              {!teamStats.byRole || Object.keys(teamStats.byRole).length === 0 ? <EmptyRow text="No team data" /> : null}
            </div>
          </Card>
        </div>

        {prodStats.avgBattery != null && (
          <div style={{ padding: "12px 18px", background: C.surface, borderRadius: 10, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 11, color: C.muted }}>Avg Device Battery</span>
            <div style={{ flex: 1, maxWidth: 200 }}><MiniBar value={prodStats.avgBattery} max={100} color={prodStats.avgBattery > 50 ? C.green : prodStats.avgBattery > 20 ? C.amber : C.red} /></div>
            <span style={{ fontSize: 12, fontWeight: 700, color: prodStats.avgBattery > 50 ? C.green : C.amber }}>{prodStats.avgBattery}%</span>
          </div>
        )}
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════════════════════
  // TAB: SHOWS
  // ════════════════════════════════════════════════════════════════════════════
  function TabShows() {
    const s = stats?.shows || {};
    return (
      <div style={{ padding: "28px 32px", overflowY: "auto", flex: 1 }}>
        <SectionHeader title="Live Shows" sub="Platform-wide show performance" />
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 24 }}>
          <StatCard label="Total Shows" value={fmt(s.total || 0)} icon="◈" color={C.amber} />
          <StatCard label="Completed" value={fmt(s.completed || 0)} icon="◉" color={C.green} />
          <StatCard label="Total GMV" value={fmtUSD(s.totalGMV || 0)} icon="◆" color={C.green} />
          <StatCard label="Avg GMV" value={fmtUSD(s.avgShowGMV || 0)} icon="◑" color={C.accent} />
          <StatCard label="Recent (30d)" value={fmt(s.recent || 0)} icon="✦" color={C.cyan} />
        </div>

        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          <Card style={{ flex: 1, minWidth: 300 }}>
            <CardHeader title="Platform Usage" />
            <div style={{ padding: "16px 18px" }}>
              {Object.entries(s.platformUsage || {}).sort((a, b) => b[1] - a[1]).map(([plat, count]) => {
                const col = PLATFORM_COLORS[plat] || C.muted;
                const total = s.total || 1;
                return (
                  <div key={plat} style={{ marginBottom: 14 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: col }}>{PLATFORM_LABELS[plat] || plat}</span>
                      <span style={{ fontSize: 11, color: C.muted }}>{count} shows ({Math.round((count / total) * 100)}%)</span>
                    </div>
                    <MiniBar value={count} max={total} color={col} />
                  </div>
                );
              })}
              {!s.platformUsage || Object.keys(s.platformUsage).length === 0 ? <EmptyRow text="No show data yet" /> : null}
            </div>
          </Card>

          <Card style={{ flex: 1, minWidth: 300 }}>
            <CardHeader title="Show Performance" />
            <div style={{ padding: "20px 18px", display: "flex", flexDirection: "column", gap: 16 }}>
              {[
                { label: "Total Airtime", value: `${fmt(s.totalMinutes || 0)} minutes`, color: C.pink },
                { label: "Avg Duration", value: s.completed ? `${Math.round((s.totalMinutes || 0) / s.completed)} min` : "—", color: C.amber },
                { label: "GMV per Minute", value: s.totalMinutes ? fmtUSD((s.totalGMV || 0) / s.totalMinutes) : "—", color: C.green },
                { label: "Shows This Month", value: fmt(s.recent || 0), color: C.blue },
              ].map(m => (
                <div key={m.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${C.border}` }}>
                  <span style={{ fontSize: 12, color: C.muted }}>{m.label}</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: m.color }}>{m.value}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════════════════════
  // TAB: CONTENT
  // ════════════════════════════════════════════════════════════════════════════
  function TabContent() {
    const [cmsContent, setCmsContent] = useState({});
    const [cmsLoading, setCmsLoading] = useState(true);
    const [cmsSection, setCmsSection] = useState("hero");
    const [cmsSaving, setCmsSaving] = useState(false);
    const [cmsSaved, setCmsSaved] = useState(null);
    const [cmsError, setCmsError] = useState(null);

    // Default content (what the site shows when no CMS override exists)
    const DEFAULTS = {
      hero: {
        badge_text: "Now open for beta. Limited spots.",
        headline: "The Live Selling",
        headline_accent: "Command Center.",
        subheadline: "One command center for Whatnot, TikTok, Instagram, Amazon Live, and YouTube Live: simultaneously.",
        cta_text: "Get Early Access",
        footer_text: "Free during beta · No credit card required",
      },
      features: {
        title: "Everything in one platform.",
        items: [
          { icon: "◉", label: "Buyer CRM", desc: "All 5 platforms. One buyer view." },
          { icon: "◈", label: "Live Companion", desc: "Real-time GMV, orders, and VIP alerts." },
          { icon: "◑", label: "Analytics", desc: "AI insights after every show." },
          { icon: "⬛", label: "Production Suite", desc: "Cameras, lights, and OBS. One panel." },
          { icon: "◆", label: "Campaigns", desc: "Email, SMS, and DM automations." },
          { icon: "♦", label: "Loyalty Hub", desc: "4-tier program. Auto across all platforms." },
          { icon: "●", label: "Opt-in Pages", desc: "Collect email and phone. TCPA-compliant." },
          { icon: "◧", label: "Show Planner", desc: "AI run order. Perks. Go live in minutes." },
          { icon: "📋", label: "Host Briefing", desc: "Live script. Countdown. Talking points." },
          { icon: "🔗", label: "Multi-Platform Sync", desc: "All 5 simultaneously. Always in sync." },
        ],
      },
      stats: {
        items: [
          { value: "5", label: "Platforms", sub: "Simultaneous live streaming" },
          { value: "99%", label: "Attribution", sub: "vs 55–82% with guesswork" },
          { value: "LIVE_GMV", label: "Live GMV", sub: "Real orders · resets every show" },
          { value: "6+", label: "AI Insights", sub: "Confidence-scored, per show" },
        ],
      },
      demo_cta: {
        subheading: "Ready to go live?",
        headline: "Create your account and start selling live today.",
      },
      final_cta: {
        headline: "Ready to go live?",
      },
      pricing: {
        headline: "Stream five platforms. Pay one bill.",
      },
      faq: {
        items: [
          { q: "Do I actually stream to all 5 platforms at the same time?", a: "Yes. One stream out, five platforms live simultaneously." },
          { q: "How does the Host Briefing work?", a: "The Briefing is a companion window with your current product, countdown, and AI talking points." },
          { q: "What does the Live Command Center solve?", a: "One live feed: real-time GMV, buyer names across all platforms, and VIP alerts." },
          { q: "How does attribution work?", a: "Each order is matched using platform ID, email, and order timing. 99% accuracy." },
          { q: "What does the Production Suite control?", a: "Camera switching, lighting levels, and OBS scene changes. All from one panel." },
          { q: "What insights are generated after each show?", a: "Six AI recommendations scored by confidence and revenue impact." },
          { q: "Is buyer data combined across platforms?", a: "Yes. Streamlive matches profiles using email, phone, and behavioral signals." },
          { q: "What does it cost?", a: "Free during beta. Paid plans start at $79/mo. Beta users lock in founding-member pricing." },
        ],
      },
      about: {
        title: "Built for sellers who take live commerce seriously.",
        intro: "Streamlive started with a simple observation: the best live sellers were running their operations out of spreadsheets, group chats, and memory.",
      },
    };

    const SECTIONS = [
      { id: "hero", label: "Hero Section", icon: "◆" },
      { id: "features", label: "Features", icon: "◉" },
      { id: "stats", label: "Stats Strip", icon: "◈" },
      { id: "pricing", label: "Pricing", icon: "★" },
      { id: "faq", label: "FAQ", icon: "?" },
      { id: "demo_cta", label: "Demo CTA", icon: "◧" },
      { id: "final_cta", label: "Final CTA", icon: "✦" },
      { id: "about", label: "About Page", icon: "◑" },
    ];

    useEffect(() => {
      (async () => {
        try {
          const token = await getToken();
          const res = await fetch("/api/admin/content?action=list", { headers: { Authorization: `Bearer ${token}` } });
          if (res.ok) { const d = await res.json(); setCmsContent(d.content || {}); }
        } catch (e) {}
        setCmsLoading(false);
      })();
    }, [getToken]);

    const getVal = (section, key) => {
      if (cmsContent[section]?.[key] !== undefined) return cmsContent[section][key];
      return DEFAULTS[section]?.[key] ?? "";
    };

    const setVal = (section, key, value) => {
      setCmsContent(prev => ({ ...prev, [section]: { ...prev[section], [key]: value } }));
      setCmsSaved(null);
    };

    const saveSection = async (section) => {
      setCmsSaving(true); setCmsError(null); setCmsSaved(null);
      try {
        const token = await getToken();
        const sectionData = { ...(DEFAULTS[section] || {}), ...(cmsContent[section] || {}) };
        const items = Object.entries(sectionData).map(([key, value]) => ({ section, key, value }));
        const res = await fetch("/api/admin/content?action=upsert-batch", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ items }),
        });
        if (!res.ok) throw new Error((await res.json()).error || "Failed");
        setCmsSaved(section);
      } catch (e) { setCmsError(e.message); }
      setCmsSaving(false);
    };

    const resetSection = async (section) => {
      setCmsSaving(true); setCmsError(null);
      try {
        const token = await getToken();
        await fetch(`/api/admin/content?action=delete-section&section=${section}`, {
          method: "DELETE", headers: { Authorization: `Bearer ${token}` },
        });
        setCmsContent(prev => { const n = { ...prev }; delete n[section]; return n; });
        setCmsSaved(section);
      } catch (e) { setCmsError(e.message); }
      setCmsSaving(false);
    };

    const inputStyle = { width: "100%", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 14px", fontSize: 13, color: C.text, outline: "none", fontFamily: "inherit" };
    const labelStyle = { fontSize: 10, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 5 };

    const TextField = ({ section, field, label, multiline }) => (
      <label style={{ display: "block", marginBottom: 14 }}>
        <span style={labelStyle}>{label}</span>
        {multiline ? (
          <textarea value={getVal(section, field)} onChange={e => setVal(section, field, e.target.value)} rows={3} style={{ ...inputStyle, resize: "vertical" }} />
        ) : (
          <input value={getVal(section, field)} onChange={e => setVal(section, field, e.target.value)} style={inputStyle} />
        )}
      </label>
    );

    const SaveBar = ({ section }) => (
      <div style={{ display: "flex", gap: 10, marginTop: 18, alignItems: "center" }}>
        <button onClick={() => saveSection(section)} disabled={cmsSaving}
          style={{ background: `linear-gradient(135deg,${C.accent},${C.accent2})`, border: "none", borderRadius: 8, color: "#fff", fontSize: 12, fontWeight: 700, padding: "10px 24px", cursor: "pointer", opacity: cmsSaving ? 0.6 : 1 }}>
          {cmsSaving ? "Saving..." : "Save Changes"}
        </button>
        <button onClick={() => resetSection(section)} disabled={cmsSaving}
          style={{ background: "none", border: `1px solid ${C.border2}`, borderRadius: 8, color: C.muted, fontSize: 12, fontWeight: 600, padding: "10px 16px", cursor: "pointer" }}>
          Reset to Default
        </button>
        {cmsSaved === section && <span style={{ fontSize: 11, color: C.green, fontWeight: 600 }}>Saved!</span>}
      </div>
    );

    const renderArrayEditor = (section, key, fields, defaults) => {
      const items = getVal(section, key) || defaults || [];
      const updateItem = (idx, field, val) => {
        const updated = items.map((it, i) => i === idx ? { ...it, [field]: val } : it);
        setVal(section, key, updated);
      };
      const removeItem = (idx) => setVal(section, key, items.filter((_, i) => i !== idx));
      const addItem = () => setVal(section, key, [...items, fields.reduce((o, f) => ({ ...o, [f.key]: "" }), {})]);
      const moveItem = (idx, dir) => {
        const arr = [...items]; const target = idx + dir;
        if (target < 0 || target >= arr.length) return;
        [arr[idx], arr[target]] = [arr[target], arr[idx]];
        setVal(section, key, arr);
      };

      return (
        <div>
          {items.map((item, idx) => (
            <div key={idx} style={{ padding: 14, marginBottom: 10, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: C.accent }}>#{idx + 1}</span>
                <div style={{ display: "flex", gap: 4 }}>
                  <button onClick={() => moveItem(idx, -1)} style={{ background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: 12, padding: "2px 6px" }}>▲</button>
                  <button onClick={() => moveItem(idx, 1)} style={{ background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: 12, padding: "2px 6px" }}>▼</button>
                  <button onClick={() => removeItem(idx)} style={{ background: "none", border: "none", color: C.red, cursor: "pointer", fontSize: 12, padding: "2px 6px" }}>✕</button>
                </div>
              </div>
              {fields.map(f => (
                <label key={f.key} style={{ display: "block", marginBottom: 8 }}>
                  <span style={{ ...labelStyle, fontSize: 9 }}>{f.label}</span>
                  {f.multiline ? (
                    <textarea value={item[f.key] || ""} onChange={e => updateItem(idx, f.key, e.target.value)} rows={2} style={{ ...inputStyle, fontSize: 12 }} />
                  ) : (
                    <input value={item[f.key] || ""} onChange={e => updateItem(idx, f.key, e.target.value)} style={{ ...inputStyle, fontSize: 12 }} />
                  )}
                </label>
              ))}
            </div>
          ))}
          <button onClick={addItem} style={{ background: `${C.accent}12`, border: `1px dashed ${C.accent}44`, borderRadius: 8, color: C.accent, fontSize: 12, fontWeight: 600, padding: "10px", width: "100%", cursor: "pointer" }}>
            + Add Item
          </button>
        </div>
      );
    };

    const renderSectionEditor = () => {
      switch (cmsSection) {
        case "hero": return (
          <Card><CardHeader title="Hero Section" />
            <div style={{ padding: "16px 18px" }}>
              <TextField section="hero" field="badge_text" label="Beta Badge Text" />
              <TextField section="hero" field="headline" label="Headline (Line 1)" />
              <TextField section="hero" field="headline_accent" label="Headline Accent (Gradient Text)" />
              <TextField section="hero" field="subheadline" label="Subheadline" multiline />
              <TextField section="hero" field="cta_text" label="CTA Button Text" />
              <TextField section="hero" field="footer_text" label="Footer Text" />
              <SaveBar section="hero" />
            </div>
          </Card>
        );
        case "features": return (
          <Card><CardHeader title="Features Grid" />
            <div style={{ padding: "16px 18px" }}>
              <TextField section="features" field="title" label="Section Title" />
              <div style={{ marginTop: 14 }}>
                <span style={labelStyle}>Feature Items</span>
                {renderArrayEditor("features", "items",
                  [{ key: "icon", label: "Icon" }, { key: "label", label: "Label" }, { key: "desc", label: "Description" }],
                  DEFAULTS.features.items
                )}
              </div>
              <SaveBar section="features" />
            </div>
          </Card>
        );
        case "stats": return (
          <Card><CardHeader title="Stats Strip" />
            <div style={{ padding: "16px 18px" }}>
              <span style={labelStyle}>Stat Items</span>
              {renderArrayEditor("stats", "items",
                [{ key: "value", label: "Value" }, { key: "label", label: "Label" }, { key: "sub", label: "Subtitle" }],
                DEFAULTS.stats.items
              )}
              <SaveBar section="stats" />
            </div>
          </Card>
        );
        case "pricing": return (
          <Card><CardHeader title="Pricing Section" />
            <div style={{ padding: "16px 18px" }}>
              <TextField section="pricing" field="headline" label="Section Headline" />
              <SaveBar section="pricing" />
            </div>
          </Card>
        );
        case "faq": return (
          <Card><CardHeader title="FAQ" />
            <div style={{ padding: "16px 18px" }}>
              <span style={labelStyle}>Questions & Answers</span>
              {renderArrayEditor("faq", "items",
                [{ key: "q", label: "Question" }, { key: "a", label: "Answer", multiline: true }],
                DEFAULTS.faq.items
              )}
              <SaveBar section="faq" />
            </div>
          </Card>
        );
        case "demo_cta": return (
          <Card><CardHeader title="Demo CTA Section" />
            <div style={{ padding: "16px 18px" }}>
              <TextField section="demo_cta" field="subheading" label="Subheading" />
              <TextField section="demo_cta" field="headline" label="Headline" multiline />
              <SaveBar section="demo_cta" />
            </div>
          </Card>
        );
        case "final_cta": return (
          <Card><CardHeader title="Final CTA Section" />
            <div style={{ padding: "16px 18px" }}>
              <TextField section="final_cta" field="headline" label="Headline" />
              <SaveBar section="final_cta" />
            </div>
          </Card>
        );
        case "about": return (
          <Card><CardHeader title="About Page" />
            <div style={{ padding: "16px 18px" }}>
              <TextField section="about" field="title" label="Page Title" />
              <TextField section="about" field="intro" label="Introduction" multiline />
              <SaveBar section="about" />
            </div>
          </Card>
        );
        default: return null;
      }
    };

    if (cmsLoading) return (
      <div style={{ padding: "28px 32px", display: "flex", alignItems: "center", justifyContent: "center", flex: 1 }}>
        <div style={{ fontSize: 13, color: C.muted }}>Loading content...</div>
      </div>
    );

    return (
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Section sidebar */}
        <div style={{ width: 200, borderRight: `1px solid ${C.border}`, padding: "20px 0", overflowY: "auto" }}>
          <div style={{ padding: "0 16px 12px", fontSize: 10, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.08em" }}>Sections</div>
          {SECTIONS.map(s => (
            <button key={s.id} onClick={() => setCmsSection(s.id)} style={{
              display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 16px",
              background: cmsSection === s.id ? `${C.accent}12` : "transparent", border: "none",
              borderLeft: cmsSection === s.id ? `2px solid ${C.accent}` : "2px solid transparent",
              color: cmsSection === s.id ? C.accent : C.muted, fontSize: 12, fontWeight: 600,
              cursor: "pointer", textAlign: "left", transition: "all .15s",
            }}>
              <span style={{ fontSize: 14, opacity: 0.7 }}>{s.icon}</span>
              {s.label}
            </button>
          ))}
        </div>

        {/* Editor panel */}
        <div style={{ flex: 1, padding: "28px 32px", overflowY: "auto" }}>
          <SectionHeader title="Content Management" sub="Edit marketing copy across the website" />
          {cmsError && <div style={{ marginBottom: 14, padding: "10px 14px", background: `${C.red}12`, border: `1px solid ${C.red}33`, borderRadius: 8, fontSize: 12, color: C.red }}>{cmsError}</div>}
          {renderSectionEditor()}
        </div>
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════════════════════
  // TAB: SYSTEM
  // ════════════════════════════════════════════════════════════════════════════
  function TabSystem() {
    const services = [
      { name: "Supabase", status: "operational", desc: "Database & Auth", color: C.green },
      { name: "Vercel", status: "operational", desc: "Hosting & Serverless", color: C.green },
      { name: "Stripe", status: "operational", desc: "Payments", color: C.green },
      { name: "Intercom", status: "operational", desc: "Support Chat", color: C.green },
      { name: "Sentry", status: "operational", desc: "Error Monitoring", color: C.green },
      { name: "Mixpanel", status: "operational", desc: "Analytics", color: C.green },
      { name: "Meta OAuth", status: "operational", desc: "Instagram Login", color: C.green },
      { name: "Shopify API", status: "operational", desc: "Store Sync", color: C.green },
    ];

    return (
      <div style={{ padding: "28px 32px", overflowY: "auto", flex: 1 }}>
        <SectionHeader title="System Status" sub="Infrastructure and service health" />

        <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 24 }}>
          <StatCard label="Services" value={`${services.length}/${services.length}`} icon="◎" color={C.green} sub="All operational" />
          <StatCard label="API Endpoints" value="8" icon="◆" color={C.accent} sub="All healthy" />
          <StatCard label="Database Tables" value="13" icon="◉" color={C.blue} sub="Supabase" />
          <StatCard label="Build Status" value="Passing" icon="✦" color={C.green} sub="Vercel" />
        </div>

        <Card style={{ marginBottom: 20 }}>
          <CardHeader title="Service Health" right={<div style={{ display: "flex", alignItems: "center", gap: 6 }}><div style={{ width: 6, height: 6, borderRadius: "50%", background: C.green, animation: "pulse 2s infinite" }} /><span style={{ fontSize: 10, color: C.green, fontWeight: 600 }}>All Systems Operational</span></div>} />
          {services.map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", padding: "12px 18px", borderBottom: `1px solid ${C.border}`, gap: 14 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: s.color, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{s.name}</div>
                <div style={{ fontSize: 10, color: C.muted }}>{s.desc}</div>
              </div>
              <span style={{ fontSize: 10, fontWeight: 700, color: s.color, textTransform: "uppercase" }}>{s.status}</span>
            </div>
          ))}
        </Card>

        <Card>
          <CardHeader title="Environment" />
          <div style={{ padding: "16px 18px" }}>
            {[
              { key: "Platform", val: "Vercel + Supabase" },
              { key: "Framework", val: "React + Vite" },
              { key: "Auth", val: "Supabase Auth (Google OAuth)" },
              { key: "Payments", val: "Stripe Checkout" },
              { key: "Monitoring", val: "Sentry + Mixpanel" },
              { key: "Support", val: "Intercom" },
              { key: "Admin", val: session?.user?.email || "—" },
            ].map((r, i) => (
              <div key={i} style={{ display: "flex", padding: "7px 0", borderBottom: `1px solid ${C.border}` }}>
                <span style={{ fontSize: 12, color: C.muted, width: 120 }}>{r.key}</span>
                <span style={{ fontSize: 12, color: C.text, fontFamily: "'JetBrains Mono',monospace", letterSpacing: "-0.3px" }}>{r.val}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════════════════════
  // ADD USER MODAL
  // ════════════════════════════════════════════════════════════════════════════
  function AddUserModal() {
    const [form, setForm] = useState({ email: "", name: "", shop_name: "", category: "", plan: "starter", account_type: "business", discount: "", custom_price: "" });
    const [formError, setFormError] = useState(null);
    const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

    const CATEGORIES = ["Apparel & Fashion", "Beauty & Cosmetics", "Electronics", "Home & Garden", "Sports & Outdoors", "Toys & Collectibles", "Food & Beverage", "Jewelry & Accessories", "Health & Wellness", "Other"];
    const ACCOUNT_TYPES = [
      { id: "business", label: "Business", icon: "🏪" },
      { id: "partner", label: "Partner", icon: "🤝" },
    ];

    const handleSubmit = async () => {
      setFormError(null);
      if (!form.email || !form.email.includes("@")) { setFormError("Valid email is required"); return; }
      const result = await createUser(form);
      if (result.error) setFormError(result.error);
    };

    if (!showAddUser) return null;
    return (
      <div onClick={() => setShowAddUser(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.7)", zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
        <div onClick={e => e.stopPropagation()} style={{ background: "#09090f", border: `1px solid ${C.accent}44`, borderRadius: 18, padding: 28, width: 480, maxWidth: "94vw", position: "relative" }}>
          <div style={{ position: "absolute", top: -40, right: -40, width: 140, height: 140, borderRadius: "50%", background: C.accent, opacity: 0.05, filter: "blur(50px)", pointerEvents: "none" }} />

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22, position: "relative", zIndex: 1 }}>
            <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 18, fontWeight: 800, color: C.text }}>Add New User</div>
            <button onClick={(e) => { e.stopPropagation(); setShowAddUser(false); }} style={{ background: "none", border: "none", color: C.muted, fontSize: 18, cursor: "pointer", padding: "4px 8px", lineHeight: 1 }}>✕</button>
          </div>

          {/* Email */}
          <label style={{ display: "block", marginBottom: 14 }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 5 }}>Email *</span>
            <input value={form.email} onChange={e => set("email", e.target.value)} placeholder="user@example.com"
              style={{ width: "100%", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 14px", fontSize: 13, color: C.text, outline: "none" }} />
          </label>

          {/* Name */}
          <label style={{ display: "block", marginBottom: 14 }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 5 }}>Full Name</span>
            <input value={form.name} onChange={e => set("name", e.target.value)} placeholder="Jane Smith"
              style={{ width: "100%", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 14px", fontSize: 13, color: C.text, outline: "none" }} />
          </label>

          {/* Shop Name */}
          <label style={{ display: "block", marginBottom: 14 }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 5 }}>Shop Name</span>
            <input value={form.shop_name} onChange={e => set("shop_name", e.target.value)} placeholder="My Awesome Store"
              style={{ width: "100%", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 14px", fontSize: 13, color: C.text, outline: "none" }} />
          </label>

          {/* Category */}
          <label style={{ display: "block", marginBottom: 14 }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 5 }}>Category</span>
            <select value={form.category} onChange={e => set("category", e.target.value)}
              style={{ width: "100%", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 14px", fontSize: 13, color: C.text, outline: "none" }}>
              <option value="">Select category...</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </label>

          {/* Plan */}
          <div style={{ marginBottom: 14 }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 8 }}>Plan</span>
            <div style={{ display: "flex", gap: 6 }}>
              {VALID_PLANS.map(p => {
                const col = PLAN_COLORS[p];
                const sel = form.plan === p;
                return (
                  <button key={p} onClick={() => set("plan", p)} style={{
                    flex: 1, padding: "10px 8px", background: sel ? `${col}14` : C.surface, border: `1px solid ${sel ? `${col}55` : C.border}`,
                    borderRadius: 8, cursor: "pointer", textAlign: "center", transition: "all .15s",
                  }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: sel ? col : C.muted, textTransform: "capitalize" }}>{p}</div>
                    <div style={{ fontSize: 10, color: C.muted, marginTop: 2 }}>{p === "enterprise" ? "Custom" : `$${PLAN_PRICES[p]}/mo`}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Enterprise Custom Pricing */}
          {form.plan === "enterprise" && (
            <div style={{ marginBottom: 14, padding: 16, background: `${PLAN_COLORS.enterprise}08`, border: `1px solid ${PLAN_COLORS.enterprise}22`, borderRadius: 10 }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: PLAN_COLORS.enterprise, textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 10 }}>Enterprise Pricing</span>
              <label style={{ display: "block" }}>
                <span style={{ fontSize: 11, color: C.muted, display: "block", marginBottom: 4 }}>Base Price ($/mo)</span>
                <input value={form.custom_price} onChange={e => { const v = e.target.value.replace(/[^0-9]/g, ""); set("custom_price", v); }} placeholder="999"
                  style={{ width: "100%", background: C.surface, border: `1px solid ${PLAN_COLORS.enterprise}33`, borderRadius: 8, padding: "10px 14px", fontSize: 14, fontWeight: 700, color: C.text, outline: "none" }} />
              </label>
            </div>
          )}

          {/* Account Type */}
          <div style={{ marginBottom: 14 }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 8 }}>User Type</span>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {ACCOUNT_TYPES.map(t => {
                const sel = form.account_type === t.id;
                return (
                  <button key={t.id} onClick={() => set("account_type", t.id)} style={{
                    flex: "1 1 auto", minWidth: 80, padding: "10px 8px", background: sel ? `${C.accent}14` : C.surface, border: `1px solid ${sel ? `${C.accent}55` : C.border}`,
                    borderRadius: 8, cursor: "pointer", textAlign: "center", transition: "all .15s",
                  }}>
                    <div style={{ fontSize: 14, marginBottom: 2 }}>{t.icon}</div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: sel ? C.accent : C.muted }}>{t.label}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Discount */}
          <label style={{ display: "block", marginBottom: 14 }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 5 }}>Discount %</span>
            <input value={form.discount} onChange={e => { const v = e.target.value.replace(/[^0-9]/g, ""); if (v === "" || (Number(v) >= 0 && Number(v) <= 100)) set("discount", v); }} placeholder="0"
              style={{ width: "100%", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 14px", fontSize: 13, color: C.text, outline: "none" }} />
          </label>

          {/* ── Summary ── */}
          {form.email && (
            <div style={{ marginBottom: 14, padding: 16, background: C.surface, border: `1px solid ${C.border2}`, borderRadius: 10 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: C.accent, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>Summary</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 16px", fontSize: 12 }}>
                <div style={{ color: C.muted }}>Email</div>
                <div style={{ color: C.text, fontWeight: 600, textAlign: "right", overflow: "hidden", textOverflow: "ellipsis" }}>{form.email}</div>

                {form.name && <>
                  <div style={{ color: C.muted }}>Name</div>
                  <div style={{ color: C.text, fontWeight: 600, textAlign: "right" }}>{form.name}</div>
                </>}

                {form.shop_name && <>
                  <div style={{ color: C.muted }}>Shop</div>
                  <div style={{ color: C.text, fontWeight: 600, textAlign: "right" }}>{form.shop_name}</div>
                </>}

                {form.category && <>
                  <div style={{ color: C.muted }}>Category</div>
                  <div style={{ color: C.text, fontWeight: 600, textAlign: "right" }}>{form.category}</div>
                </>}

                <div style={{ color: C.muted }}>Plan</div>
                <div style={{ textAlign: "right" }}>
                  <span style={{ color: PLAN_COLORS[form.plan], fontWeight: 700, textTransform: "capitalize" }}>{form.plan}</span>
                </div>

                <div style={{ color: C.muted }}>User Type</div>
                <div style={{ color: C.text, fontWeight: 600, textAlign: "right", textTransform: "capitalize" }}>{form.account_type}</div>

                {Number(form.discount) > 0 && <>
                  <div style={{ color: C.muted }}>Discount</div>
                  <div style={{ color: C.green, fontWeight: 700, textAlign: "right" }}>{form.discount}% off</div>
                </>}

                <div style={{ gridColumn: "1 / -1", borderTop: `1px solid ${C.border}`, marginTop: 4, paddingTop: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: C.muted, fontWeight: 600 }}>Monthly Price</span>
                  {(() => {
                    const base = form.plan === "enterprise" ? (Number(form.custom_price) || 999) : PLAN_PRICES[form.plan];
                    const disc = Number(form.discount) || 0;
                    const final_ = Math.round(base * (1 - disc / 100));
                    const hasDiscount = disc > 0;
                    return (
                      <div style={{ textAlign: "right" }}>
                        {hasDiscount && <span style={{ fontSize: 11, color: C.muted, textDecoration: "line-through", marginRight: 6 }}>${base.toLocaleString()}</span>}
                        <span style={{ fontSize: 16, fontWeight: 800, color: PLAN_COLORS[form.plan] }}>${final_.toLocaleString()}/mo</span>
                      </div>
                    );
                  })()}
                </div>
              </div>

              <div style={{ marginTop: 10, padding: "8px 10px", background: `${C.accent}08`, borderRadius: 6, fontSize: 11, color: C.muted, lineHeight: 1.5 }}>
                An invite email will be sent to <strong style={{ color: C.text }}>{form.email}</strong> with a magic link to sign in.
              </div>
            </div>
          )}

          {/* Error */}
          {formError && (
            <div style={{ marginBottom: 14, padding: "10px 14px", background: `${C.red}12`, border: `1px solid ${C.red}33`, borderRadius: 8, fontSize: 12, color: C.red }}>{formError}</div>
          )}

          {/* Actions */}
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => setShowAddUser(false)} style={{ flex: 1, background: C.surface2, border: `1px solid ${C.border2}`, borderRadius: 9, color: C.muted, fontSize: 12, fontWeight: 600, padding: "11px", cursor: "pointer" }}>Cancel</button>
            <button onClick={handleSubmit} disabled={addingUser}
              style={{ flex: 1, background: `linear-gradient(135deg,${C.accent},${C.accent2})`, border: "none", borderRadius: 9, color: "#fff", fontSize: 12, fontWeight: 700, padding: "11px", cursor: "pointer", opacity: addingUser ? 0.6 : 1 }}>
              {addingUser ? "Creating & Inviting..." : "Create & Send Invite"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════════════════════
  // EDIT PLAN MODAL
  // ════════════════════════════════════════════════════════════════════════════
  function EditPlanModal() {
    if (!editingUser) return null;
    const currentPlan = editingUser.plan || "starter";
    const isChanged = editPlan !== currentPlan;
    const userName = editingUser.name || editingUser.first_name || editingUser.email;
    return (
      <div onClick={() => setEditingUser(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.7)", zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div onClick={e => e.stopPropagation()} style={{ background: "#09090f", border: `1px solid ${C.accent}44`, borderRadius: 18, padding: 28, width: 400, maxWidth: "92vw", position: "relative" }}>
          <div style={{ position: "absolute", top: -40, right: -40, width: 140, height: 140, borderRadius: "50%", background: C.accent, opacity: 0.05, filter: "blur(50px)" }} />
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 16, fontWeight: 800, color: C.text }}>Edit Plan</div>
            <button onClick={() => setEditingUser(null)} style={{ background: "none", border: "none", color: C.muted, fontSize: 16, cursor: "pointer" }}>✕</button>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20, padding: "12px 14px", background: C.surface, borderRadius: 10, border: `1px solid ${C.border}` }}>
            <Avatar initials={deriveAvatar(userName)} color={PLAN_COLORS[currentPlan]} size={32} url={editingUser.avatar_url} />
            <div><div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{userName}</div><div style={{ fontSize: 11, color: C.muted }}>{editingUser.email}</div></div>
          </div>
          <div style={{ fontSize: 11, fontWeight: 600, color: C.muted, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.06em" }}>Select Plan</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 24 }}>
            {VALID_PLANS.map(p => {
              const col = PLAN_COLORS[p];
              const sel = editPlan === p;
              const cur = currentPlan === p;
              return (
                <button key={p} onClick={() => setEditPlan(p)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", background: sel ? `${col}14` : C.surface, border: `1px solid ${sel ? `${col}55` : C.border}`, borderRadius: 10, cursor: "pointer", transition: "all .15s" }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: sel ? col : "transparent", border: `2px solid ${col}`, flexShrink: 0 }} />
                  <span style={{ fontSize: 13, fontWeight: 600, color: sel ? C.text : C.muted, textTransform: "capitalize", flex: 1, textAlign: "left" }}>{p}</span>
                  <span style={{ fontSize: 11, color: C.muted }}>${PLAN_PRICES[p]}/mo</span>
                  {cur && <span style={{ fontSize: 8, fontWeight: 700, color: C.green, background: `${C.green}18`, padding: "2px 6px", borderRadius: 3, textTransform: "uppercase" }}>current</span>}
                </button>
              );
            })}
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => setEditingUser(null)} style={{ flex: 1, background: C.surface2, border: `1px solid ${C.border2}`, borderRadius: 9, color: C.muted, fontSize: 12, fontWeight: 600, padding: "10px", cursor: "pointer" }}>Cancel</button>
            <button onClick={() => { if (isChanged) setConfirmModal({ user: editingUser, from: currentPlan, to: editPlan }); }} disabled={!isChanged || saving}
              style={{ flex: 1, background: isChanged ? `linear-gradient(135deg,${C.accent},${C.accent2})` : C.surface2, border: "none", borderRadius: 9, color: isChanged ? "#fff" : C.muted, fontSize: 12, fontWeight: 700, padding: "10px", cursor: isChanged ? "pointer" : "default", opacity: isChanged ? 1 : 0.5 }}>
              {saving ? "Saving..." : "Apply Change"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  function ConfirmModal() {
    if (!confirmModal) return null;
    const { user, from, to } = confirmModal;
    const userName = user.name || user.first_name || user.email;
    const toCol = PLAN_COLORS[to];
    const fromCol = PLAN_COLORS[from];
    const isUp = VALID_PLANS.indexOf(to) > VALID_PLANS.indexOf(from);
    return (
      <div onClick={() => setConfirmModal(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.8)", zIndex: 400, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div onClick={e => e.stopPropagation()} style={{ background: "#09090f", border: `1px solid ${toCol}44`, borderRadius: 16, padding: 24, width: 380, maxWidth: "92vw" }}>
          <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 16, fontWeight: 800, color: C.text, marginBottom: 16 }}>Confirm {isUp ? "Upgrade" : "Downgrade"}</div>
          <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.6, marginBottom: 20 }}>
            {isUp ? "Upgrade" : "Downgrade"} <strong style={{ color: C.text }}>{userName}</strong> from <span style={{ color: fromCol, fontWeight: 700, textTransform: "capitalize" }}>{from}</span> to <span style={{ color: toCol, fontWeight: 700, textTransform: "capitalize" }}>{to}</span>?
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20, padding: "10px 14px", background: C.surface, borderRadius: 8, border: `1px solid ${C.border}` }}>
            <span style={{ fontSize: 12, color: C.muted }}>Billing:</span>
            <span style={{ fontSize: 12, color: fromCol, fontWeight: 600 }}>${PLAN_PRICES[from]}/mo</span>
            <span style={{ fontSize: 12, color: C.muted }}>→</span>
            <span style={{ fontSize: 12, color: toCol, fontWeight: 700 }}>${PLAN_PRICES[to]}/mo</span>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => setConfirmModal(null)} style={{ flex: 1, background: C.surface2, border: `1px solid ${C.border2}`, borderRadius: 9, color: C.muted, fontSize: 12, fontWeight: 600, padding: "10px", cursor: "pointer" }}>Cancel</button>
            <button onClick={() => updatePlan(user.id, to)} disabled={saving}
              style={{ flex: 1, background: isUp ? `linear-gradient(135deg,${C.accent},${C.accent2})` : `linear-gradient(135deg,${C.amber},${C.red})`, border: "none", borderRadius: 9, color: "#fff", fontSize: 12, fontWeight: 700, padding: "10px", cursor: "pointer" }}>
              {saving ? "Applying..." : isUp ? "Confirm Upgrade" : "Confirm Downgrade"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════════════════════
  // LOADING STATE
  // ════════════════════════════════════════════════════════════════════════════
  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", background: C.bg, fontFamily: "'DM Sans',sans-serif" }}>
        <style>{FONT}{GLOBAL_CSS}{`@keyframes spin { to { transform:rotate(360deg) } } @keyframes pulse { 0%,100% { opacity:1 } 50% { opacity:.4 } }`}</style>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 36, height: 36, border: `3px solid ${C.accent}33`, borderTop: `3px solid ${C.accent}`, borderRadius: "50%", animation: "spin .8s linear infinite", margin: "0 auto 16px" }} />
          <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 14, fontWeight: 800, color: C.accent }}>Mission Control</div>
          <div style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>Decrypting platform data...</div>
        </div>
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════════════════════
  // MAIN RENDER
  // ════════════════════════════════════════════════════════════════════════════
  return (
    <>
      <style>{FONT}{GLOBAL_CSS}{`
        @keyframes pulse { 0%,100% { opacity:1 } 50% { opacity:.4 } }
        @keyframes mcGlow { 0%,100% { box-shadow:0 0 20px ${C.accent}22 } 50% { box-shadow:0 0 40px ${C.accent}44 } }
      `}</style>

      <AddUserModal />
      <EditPlanModal />
      <ConfirmModal />

      <div style={{ display: "flex", height: "100vh", maxHeight: "100vh", overflow: "hidden", background: C.bg, color: C.text, fontFamily: "'DM Sans',sans-serif" }}>

        {/* SIDEBAR */}
        <div style={{ width: 220, borderRight: `1px solid ${C.border}`, display: "flex", flexDirection: "column", background: "#050508", flexShrink: 0 }}>
          <div style={{ padding: "20px 16px 16px", borderBottom: `1px solid ${C.border}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
              <div style={{ width: 32, height: 32, borderRadius: 9, background: `linear-gradient(135deg,${C.accent},${C.accent2})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 900, color: "#fff", boxShadow: `0 2px 16px ${C.accent}44`, animation: "mcGlow 3s ease-in-out infinite" }}>S</div>
              <div>
                <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 14, fontWeight: 800, color: C.text, letterSpacing: "-0.3px" }}>Mission Control</div>
                <div style={{ fontSize: 9, color: C.accent, fontWeight: 600 }}>ADMIN</div>
              </div>
            </div>
          </div>

          <div style={{ flex: 1, padding: "12px 10px", overflow: "hidden" }}>
            <div style={{ fontSize: 8, fontWeight: 800, color: `${C.accent}44`, textTransform: "uppercase", letterSpacing: "0.12em", padding: "2px 12px 8px" }}>Navigation</div>
            {ADMIN_NAV.map(n => {
              const isActive = activeTab === n.id;
              return (
                <button key={n.id} onClick={() => { setActiveTab(n.id); setSelectedUser(null); setUserDetail(null); }} style={{
                  display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 9, border: "none", cursor: "pointer", marginBottom: 2, width: "100%",
                  background: isActive ? `${C.accent}18` : "transparent", transition: "all .12s",
                }}>
                  <span style={{ fontSize: 13, color: isActive ? C.accent : C.subtle, width: 16, textAlign: "center" }}>{n.icon}</span>
                  <span style={{ fontSize: 13, fontWeight: isActive ? 700 : 400, color: isActive ? C.text : C.muted }}>{n.label}</span>
                </button>
              );
            })}
          </div>

          {/* Quick stats in sidebar */}
          {stats && (
            <div style={{ padding: "0 10px 8px" }}>
              <div style={{ background: `${C.accent}08`, border: `1px solid ${C.accent}22`, borderRadius: 10, padding: "10px 12px" }}>
                <div style={{ fontSize: 8, fontWeight: 800, color: C.accent, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>Quick Stats</div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                  <span style={{ fontSize: 10, color: C.muted }}>Users</span>
                  <span style={{ fontSize: 10, color: C.text, fontWeight: 600 }}>{fmt(stats.total || 0)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                  <span style={{ fontSize: 10, color: C.muted }}>MRR</span>
                  <span style={{ fontSize: 10, color: C.green, fontWeight: 600 }}>{fmtUSD(stats.mrr || 0)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 10, color: C.muted }}>Active</span>
                  <span style={{ fontSize: 10, color: C.blue, fontWeight: 600 }}>{fmt(stats.activeUsers || 0)}</span>
                </div>
              </div>
            </div>
          )}

          <div style={{ borderTop: `1px solid ${C.border}`, padding: "10px" }}>
            <button onClick={() => navigate("/app")} style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", background: "none", border: "none", color: C.muted, fontSize: 12, fontWeight: 500, padding: "9px 12px", cursor: "pointer", borderRadius: 6, textAlign: "left" }}
              onMouseEnter={e => e.currentTarget.style.color = C.text} onMouseLeave={e => e.currentTarget.style.color = C.muted}>← Back to App</button>
            <button onClick={() => { if (onSignOut) onSignOut(); }} style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", background: "none", border: "none", color: C.muted, fontSize: 12, fontWeight: 500, padding: "9px 12px", cursor: "pointer", borderRadius: 6, textAlign: "left" }}
              onMouseEnter={e => e.currentTarget.style.color = C.red} onMouseLeave={e => e.currentTarget.style.color = C.muted}>↩ Sign Out</button>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
          <div style={{ height: 52, borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 28px", flexShrink: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 15, fontWeight: 800, color: C.text }}>{ADMIN_NAV.find(n => n.id === activeTab)?.label || "Overview"}</div>
              <div style={{ width: 5, height: 5, borderRadius: "50%", background: C.green, animation: "pulse 2s infinite" }} />
              <span style={{ fontSize: 10, color: C.green, fontWeight: 600 }}>Operational</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ fontSize: 10, color: C.muted, opacity: 0.6 }}>Auto-refresh 30s</div>
              {session?.user?.email && <div style={{ fontSize: 10, color: C.muted }}>{session.user.email}</div>}
            </div>
          </div>

          {error && (
            <div style={{ margin: "12px 28px 0", padding: "12px 16px", background: `${C.red}12`, border: `1px solid ${C.red}33`, borderRadius: 10, display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 11, color: C.red, flex: 1 }}>{error}</span>
              <button onClick={() => fetchData(true)} style={{ background: `${C.red}22`, border: `1px solid ${C.red}44`, borderRadius: 6, color: C.red, fontSize: 10, fontWeight: 600, padding: "4px 12px", cursor: "pointer", whiteSpace: "nowrap" }}>Retry</button>
            </div>
          )}

          {activeTab === "overview" && <TabOverview />}
          {activeTab === "users" && <TabUsers />}
          {activeTab === "subscriptions" && <TabSubscriptions />}
          {activeTab === "analytics" && <TabAnalytics />}
          {activeTab === "shows" && <TabShows />}
          {activeTab === "content" && <TabContent />}
          {activeTab === "system" && <TabSystem />}
        </div>
      </div>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// WRAPPER
// ═══════════════════════════════════════════════════════════════════════════════
export default function AdminDashboard({ session, onSignOut }) {
  const handleLogin = useCallback(async () => {
    if (!supabase) return;
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin + "/admin", queryParams: { access_type: "offline", prompt: "consent" } },
    });
  }, []);

  if (!session) return <AdminLoginScreen onLogin={handleLogin} />;
  return <AdminDashboardInner session={session} onSignOut={onSignOut} />;
}
