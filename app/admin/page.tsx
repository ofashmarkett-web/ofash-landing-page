"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";

// ── Types ──────────────────────────────────────────────────────────
interface Reg {
  email: string;
  role: string;
  businessName?: string;
  whatsapp?: string;
  timestamp: string;
  emailId?: string;
}

interface SentEmail {
  id: string;
  recipient: string;
  subject: string;
  sentAt: string;
  status: string;
  role: string | null;
  businessName: string | null;
}

interface Stats {
  total: number;
  buyers: number;
  vendors: number;
  riders: number;
  resendCount: number | null;
  resendError: string | null;
  resendPermissionError: boolean;
  resendRateLimited: boolean;
  resendEmails: SentEmail[];
  emailSource: "resend" | "local";
  registrations: Reg[];
}

// ── Helpers ────────────────────────────────────────────────────────
function fmt(iso: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-NG", {
    timeZone: "Africa/Lagos",
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function roleBadge(role: string) {
  const map: Record<string, { bg: string; label: string }> = {
    buyer:  { bg: "#0e7490", label: "🛍 Buyer"  },
    vendor: { bg: "#b45309", label: "🏪 Vendor" },
    rider:  { bg: "#7c3aed", label: "🛵 Rider"  },
  };
  const r = map[role] ?? { bg: "#374151", label: role || "—" };
  return (
    <span style={{ display:"inline-block", padding:"2px 10px", borderRadius:100, background:r.bg+"33", color:r.bg, border:`1px solid ${r.bg}66`, fontSize:12, fontWeight:800, whiteSpace:"nowrap" }}>
      {r.label}
    </span>
  );
}

function statusBadge(status: string) {
  const map: Record<string, { bg: string; label: string }> = {
    delivered: { bg: "#16a34a", label: "✓ Delivered" },
    sent:      { bg: "#0d9488", label: "→ Sent"      },
    opened:    { bg: "#2563eb", label: "👁 Opened"   },
    clicked:   { bg: "#7c3aed", label: "🖱 Clicked"  },
    bounced:   { bg: "#dc2626", label: "✗ Bounced"   },
    complained:{ bg: "#b45309", label: "⚠ Complaint" },
  };
  const s = map[status.toLowerCase()] ?? { bg: "#374151", label: status };
  return (
    <span style={{ display:"inline-block", padding:"2px 10px", borderRadius:100, background:s.bg+"22", color:s.bg, border:`1px solid ${s.bg}55`, fontSize:12, fontWeight:700, whiteSpace:"nowrap" }}>
      {s.label}
    </span>
  );
}

function downloadCSV(rows: string[][], filename: string) {
  const csv = rows
    .map((row) => row.map((cell) => `"${String(cell ?? "").replace(/"/g, '""')}"`).join(","))
    .join("\n");
  const blob = new Blob(["﻿" + csv, ""], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// ── Chart ──────────────────────────────────────────────────────────
interface ChartPoint { label: string; total: number; buyers: number; vendors: number; riders: number; }
type Period = "hourly" | "daily" | "weekly" | "monthly" | "yearly";

function buildChartData(regs: Reg[], period: Period): ChartPoint[] {
  const now = new Date();
  let buckets: { label: string; start: Date; end: Date }[] = [];

  if (period === "hourly") {
    buckets = Array.from({ length: 24 }, (_, i) => {
      const h = new Date(now); h.setMinutes(0, 0, 0); h.setHours(h.getHours() - 23 + i);
      const end = new Date(h); end.setHours(h.getHours() + 1);
      return { label: h.toLocaleTimeString("en-NG", { hour: "numeric", hour12: true }), start: h, end };
    });
  } else if (period === "daily") {
    buckets = Array.from({ length: 30 }, (_, i) => {
      const d = new Date(now); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() - 29 + i);
      const end = new Date(d); end.setDate(d.getDate() + 1);
      return { label: d.toLocaleDateString("en-NG", { month: "short", day: "numeric" }), start: d, end };
    });
  } else if (period === "weekly") {
    buckets = Array.from({ length: 12 }, (_, i) => {
      const d = new Date(now); d.setHours(0, 0, 0, 0);
      const dow = d.getDay() === 0 ? 7 : d.getDay();
      d.setDate(d.getDate() - (dow - 1) - (11 - i) * 7);
      const end = new Date(d); end.setDate(d.getDate() + 7);
      return { label: d.toLocaleDateString("en-NG", { month: "short", day: "numeric" }), start: d, end };
    });
  } else if (period === "monthly") {
    buckets = Array.from({ length: 12 }, (_, i) => {
      const start = new Date(now.getFullYear(), now.getMonth() - 11 + i, 1);
      const end   = new Date(start.getFullYear(), start.getMonth() + 1, 1);
      return { label: start.toLocaleDateString("en-NG", { month: "short", year: "2-digit" }), start, end };
    });
  } else {
    const years = [...new Set(regs.map(r => new Date(r.timestamp).getFullYear()))].sort();
    if (years.length === 0) years.push(now.getFullYear());
    if (years.length === 1) years.unshift(years[0] - 1);
    buckets = years.map(yr => ({
      label: String(yr),
      start: new Date(yr, 0, 1),
      end:   new Date(yr + 1, 0, 1),
    }));
  }

  return buckets.map(b => {
    const slice = regs.filter(r => { const t = new Date(r.timestamp); return t >= b.start && t < b.end; });
    return {
      label:   b.label,
      total:   slice.length,
      buyers:  slice.filter(r => r.role === "buyer").length,
      vendors: slice.filter(r => r.role === "vendor").length,
      riders:  slice.filter(r => r.role === "rider").length,
    };
  });
}

function smoothPath(pts: [number, number][]): string {
  if (pts.length === 0) return "";
  if (pts.length === 1) return `M ${pts[0][0]},${pts[0][1]}`;
  let d = `M ${pts[0][0]},${pts[0][1]}`;
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1], [x1, y1] = pts[i];
    const mx = (x0 + x1) / 2;
    d += ` C ${mx},${y0} ${mx},${y1} ${x1},${y1}`;
  }
  return d;
}

function RegistrationChart({ registrations }: { registrations: Reg[] }) {
  const [period, setPeriod] = useState<Period>("daily");
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  const data = useMemo(() => buildChartData(registrations, period), [registrations, period]);

  const W = 900, H = 260, PL = 46, PR = 12, PT = 16, PB = 48;
  const iW = W - PL - PR, iH = H - PT - PB;

  const rawMax  = Math.max(...data.map(d => d.total), 1);
  const yMax    = Math.ceil(rawMax / 5) * 5 || 5;
  const yTicks  = [0, 1, 2, 3, 4].map(i => Math.round((yMax / 4) * i));
  const xPos    = (i: number) => PL + (data.length <= 1 ? iW / 2 : (i / (data.length - 1)) * iW);
  const yPos    = (v: number) => PT + iH - (v / yMax) * iH;
  const skipEvery = data.length <= 12 ? 1 : data.length <= 24 ? 3 : 5;

  const SERIES = [
    { key: "total"   as const, color: "#14b8a6", label: "Total",   dash: "5 3", w: 1.5 },
    { key: "buyers"  as const, color: "#06b6d4", label: "Buyers",  dash: "",    w: 2   },
    { key: "vendors" as const, color: "#f59e0b", label: "Vendors", dash: "",    w: 2   },
    { key: "riders"  as const, color: "#a78bfa", label: "Riders",  dash: "",    w: 2   },
  ];

  const border  = "rgba(20,184,166,0.16)";
  const teal    = "#14b8a6";
  const textMut = "rgba(220,250,245,0.62)";
  const textMut2= "rgba(220,250,245,0.38)";
  const bgCard  = "#0d1a18";
  const text    = "#e8f8f5";

  const hovPoint = hoverIdx !== null ? data[hoverIdx] : null;

  const PERIODS: { value: Period; label: string }[] = [
    { value: "hourly",  label: "Hourly"  },
    { value: "daily",   label: "Daily"   },
    { value: "weekly",  label: "Weekly"  },
    { value: "monthly", label: "Monthly" },
    { value: "yearly",  label: "Yearly"  },
  ];

  return (
    <div style={{ background: bgCard, border: `1px solid ${border}`, borderRadius: 16, padding: "20px 20px 14px", marginBottom: 24 }}>
      {/* header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 18 }}>
        <div>
          <h2 style={{ fontSize: 15, fontWeight: 800, color: text, marginBottom: 2 }}>Registration Trends</h2>
          <p style={{ fontSize: 11, color: textMut2 }}>Signups over time by role</p>
        </div>
        <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
          {PERIODS.map(p => (
            <button key={p.value} onClick={() => setPeriod(p.value)} style={{ padding: "5px 13px", borderRadius: 100, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", border: `1px solid ${period === p.value ? teal : border}`, background: period === p.value ? "rgba(20,184,166,0.15)" : "transparent", color: period === p.value ? teal : textMut2, transition: "all 0.15s" }}>
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* chart */}
      <div style={{ position: "relative" }}>
        <svg
          viewBox={`0 0 ${W} ${H}`}
          style={{ width: "100%", height: "auto", display: "block", overflow: "visible" }}
          onMouseLeave={() => setHoverIdx(null)}
          onMouseMove={ev => {
            const rect = (ev.currentTarget as SVGSVGElement).getBoundingClientRect();
            const svgX  = ((ev.clientX - rect.left) / rect.width) * W;
            if (data.length === 0) return;
            let best = 0, bestDist = Infinity;
            data.forEach((_, i) => { const d = Math.abs(xPos(i) - svgX); if (d < bestDist) { bestDist = d; best = i; } });
            setHoverIdx(best);
          }}
        >
          <defs>
            {SERIES.map(s => (
              <linearGradient key={s.key} id={`ag-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor={s.color} stopOpacity="0.22" />
                <stop offset="100%" stopColor={s.color} stopOpacity="0"    />
              </linearGradient>
            ))}
          </defs>

          {/* grid */}
          {yTicks.map(v => (
            <g key={v}>
              <line x1={PL} y1={yPos(v)} x2={W - PR} y2={yPos(v)} stroke="rgba(20,184,166,0.09)" strokeWidth="1" />
              <text x={PL - 7} y={yPos(v) + 4} textAnchor="end" fill={textMut2} fontSize="11">{v}</text>
            </g>
          ))}

          {/* area fills */}
          {SERIES.map(s => {
            const pts: [number, number][] = data.map((d, i) => [xPos(i), yPos(d[s.key])]);
            if (pts.length === 0) return null;
            const bY  = PT + iH;
            const aD  = smoothPath(pts) + ` L ${pts[pts.length - 1][0]},${bY} L ${pts[0][0]},${bY} Z`;
            return <path key={s.key} d={aD} fill={`url(#ag-${s.key})`} />;
          })}

          {/* lines */}
          {SERIES.map(s => {
            const pts: [number, number][] = data.map((d, i) => [xPos(i), yPos(d[s.key])]);
            return (
              <path key={s.key} d={smoothPath(pts)} fill="none" stroke={s.color} strokeWidth={s.w}
                strokeDasharray={s.dash || undefined} strokeLinecap="round" strokeLinejoin="round" opacity="0.92" />
            );
          })}

          {/* hover line */}
          {hoverIdx !== null && (
            <line x1={xPos(hoverIdx)} y1={PT} x2={xPos(hoverIdx)} y2={PT + iH}
              stroke="rgba(20,184,166,0.35)" strokeWidth="1" strokeDasharray="3 2" />
          )}

          {/* hover dots */}
          {hoverIdx !== null && SERIES.map(s => (
            <circle key={s.key} cx={xPos(hoverIdx)} cy={yPos(data[hoverIdx][s.key])}
              r="4.5" fill={s.color} stroke="#0d1a18" strokeWidth="2" />
          ))}

          {/* x-axis labels */}
          {data.map((d, i) => {
            if (i % skipEvery !== 0 && i !== data.length - 1) return null;
            return (
              <text key={i} x={xPos(i)} y={PT + iH + 16} textAnchor="middle" fill={textMut2} fontSize="10">
                {d.label}
              </text>
            );
          })}

          {/* invisible mouse overlay */}
          <rect x={PL} y={PT} width={iW} height={iH} fill="transparent" style={{ cursor: "crosshair" }} />
        </svg>

        {/* floating tooltip */}
        {hovPoint !== null && hoverIdx !== null && (
          <div style={{
            position: "absolute", top: 8,
            left: `clamp(0px, ${(hoverIdx / Math.max(data.length - 1, 1)) * 100}% - 65px, calc(100% - 140px))`,
            background: "rgba(6,13,12,0.97)", border: `1px solid ${border}`,
            borderRadius: 10, padding: "10px 14px", pointerEvents: "none",
            backdropFilter: "blur(14px)", zIndex: 10, minWidth: 130,
          }}>
            <p style={{ fontSize: 11, color: textMut2, marginBottom: 8, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>{hovPoint.label}</p>
            {SERIES.map(s => (
              <div key={s.key} style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 4 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: s.color, flexShrink: 0 }} />
                <span style={{ fontSize: 12, color: textMut, flex: 1 }}>{s.label}</span>
                <span style={{ fontSize: 13, fontWeight: 900, color: s.color }}>{hovPoint[s.key]}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* legend */}
      <div style={{ display: "flex", gap: 18, flexWrap: "wrap", marginTop: 4, paddingTop: 12, borderTop: `1px solid ${border}` }}>
        {SERIES.map(s => (
          <div key={s.key} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <svg width="22" height="10" style={{ flexShrink: 0 }}>
              <line x1="0" y1="5" x2="22" y2="5" stroke={s.color} strokeWidth="2" strokeDasharray={s.dash || undefined} />
              <circle cx="11" cy="5" r="3" fill={s.color} />
            </svg>
            <span style={{ fontSize: 12, color: textMut, fontWeight: 600 }}>{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────
export default function AdminPage() {
  const [password, setPassword]       = useState("");
  const [showPw, setShowPw]           = useState(false);
  const [authed, setAuthed]           = useState(false);
  const [authErr, setAuthErr]         = useState("");
  const [stats, setStats]             = useState<Stats | null>(null);
  const [loading, setLoading]         = useState(false);
  const [fetchErr, setFetchErr]       = useState("");
  const [search, setSearch]               = useState("");
  const [roleFilter, setRoleFilter]       = useState("all");
  const [emailSearch, setEmailSearch]     = useState("");
  const [emailRoleFilter, setEmailRoleFilter] = useState("all");
  const [activeTab, setActiveTab]         = useState<"registrations" | "emails">("registrations");
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const [syncing, setSyncing]         = useState(false);
  const [syncResult, setSyncResult]   = useState<{ imported: number; skipped: number; unknown: number; total: number; message: string } | null>(null);

  // Tracks whether data has already been fetched for this session to prevent double-fetch
  const didFetchRef = useRef(false);

  const fetchStats = useCallback(async (pw: string) => {
    setLoading(true); setFetchErr("");
    try {
      const res = await fetch("/api/admin", { headers: { "x-admin-password": pw } });
      if (res.status === 401) {
        setAuthed(false); sessionStorage.removeItem("ofm_admin_pw");
        setAuthErr("Session expired. Please log in again."); setLoading(false); return;
      }
      if (!res.ok) throw new Error("Server error");
      setStats(await res.json());
      setLastRefresh(new Date());
    } catch { setFetchErr("Failed to load data. Check your connection."); }
    finally { setLoading(false); }
  }, []);

  // Restore session on mount
  useEffect(() => {
    const saved = sessionStorage.getItem("ofm_admin_pw");
    if (saved) { setPassword(saved); setAuthed(true); }
  }, []);

  // Auto-fetch once after session restore (ref prevents double-fetch after login)
  useEffect(() => {
    if (authed && password && !didFetchRef.current) {
      didFetchRef.current = true;
      fetchStats(password);
    }
  }, [authed, password, fetchStats]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); setAuthErr(""); setLoading(true);
    const res = await fetch("/api/admin", { headers: { "x-admin-password": password } });
    setLoading(false);
    if (res.status === 401) { setAuthErr("Incorrect password. Try again."); return; }
    if (!res.ok) { setAuthErr("Server error. Please try again."); return; }
    // Mark as fetched BEFORE setAuthed so the useEffect fires and skips
    didFetchRef.current = true;
    setStats(await res.json());
    setLastRefresh(new Date());
    setAuthed(true);
    sessionStorage.setItem("ofm_admin_pw", password);
  };

  const handleLogout = () => {
    didFetchRef.current = false;
    setAuthed(false); setStats(null); setPassword(""); setSyncResult(null); sessionStorage.removeItem("ofm_admin_pw");
  };

  const handleSync = async () => {
    setSyncing(true); setSyncResult(null);
    try {
      const res  = await fetch("/api/admin", { method: "POST", headers: { "x-admin-password": password } });
      const data = await res.json();
      setSyncResult(data);
      if (res.ok && data.imported > 0) await fetchStats(password);
    } catch {
      setSyncResult({ imported: 0, skipped: 0, unknown: 0, total: 0, message: "Sync failed — check your connection." });
    } finally {
      setSyncing(false);
    }
  };

  // ── Design tokens ───────────────────────────────────────────────
  const bg      = "#060d0c";
  const bgCard  = "#0d1a18";
  const bgCard2 = "#112220";
  const border  = "rgba(20,184,166,0.16)";
  const teal    = "#14b8a6";
  const tealDim = "#0d9488";
  const gold    = "#f59e0b";
  const text    = "#e8f8f5";
  const textMut = "rgba(220,250,245,0.62)";
  const textMut2= "rgba(220,250,245,0.38)";

  const inputSt: React.CSSProperties = {
    padding:"12px 16px", borderRadius:10, border:`1.5px solid ${border}`,
    background:bgCard2, color:text, fontSize:15, outline:"none",
    fontFamily:"inherit", width:"100%", transition:"border-color 0.18s",
  };

  const btnSecondary: React.CSSProperties = {
    padding:"8px 16px", borderRadius:8, background:"rgba(20,184,166,0.1)",
    border:`1px solid ${border}`, color:teal, fontSize:13, fontWeight:700,
    cursor:"pointer", fontFamily:"inherit", whiteSpace:"nowrap",
  };

  // ── CSV exports ─────────────────────────────────────────────────
  const exportRegistrations = () => {
    if (!stats) return;
    const rows = [
      ["#", "Email", "Role", "Business / Shop", "WhatsApp", "Date (WAT)"],
      ...stats.registrations.map((r, i) => [
        String(i + 1),
        r.email,
        r.role.charAt(0).toUpperCase() + r.role.slice(1),
        r.businessName || "",
        r.whatsapp || "",
        fmt(r.timestamp),
      ]),
    ];
    downloadCSV(rows, `ofash-waitlist-${new Date().toISOString().slice(0,10)}.csv`);
  };

  const exportEmails = () => {
    if (!stats) return;
    const rows = [
      ["#", "Email", "Role", "Business / Shop", "Subject", "Status", "Sent (WAT)"],
      ...stats.resendEmails.map((e, i) => [
        String(i + 1),
        e.recipient,
        e.role ? e.role.charAt(0).toUpperCase() + e.role.slice(1) : "Unknown",
        e.businessName || "",
        e.subject,
        e.status,
        fmt(e.sentAt),
      ]),
    ];
    downloadCSV(rows, `ofash-emails-sent-${new Date().toISOString().slice(0,10)}.csv`);
  };

  // ── LOGIN ───────────────────────────────────────────────────────
  if (!authed) return (
    <div style={{ minHeight:"100vh", background:bg, display:"flex", alignItems:"center", justifyContent:"center", padding:24, fontFamily:"'Inter','Segoe UI',Arial,sans-serif" }}>
      <div className="login-card" style={{ width:"100%", maxWidth:420, background:bgCard, border:`1px solid ${border}`, borderRadius:20, padding:"40px 36px", boxShadow:"0 32px 80px rgba(0,0,0,0.6)" }}>
        <div style={{ textAlign:"center", marginBottom:32 }}>
          <div style={{ fontSize:32, fontWeight:900, background:`linear-gradient(90deg,#a7f3d0,${teal})`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", fontFamily:"Georgia,serif", marginBottom:4 }}>O-Fash Markett</div>
          <p style={{ color:textMut2, fontSize:12, letterSpacing:"0.14em", textTransform:"uppercase" }}>Admin Dashboard</p>
        </div>

        <form onSubmit={handleLogin} style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <div>
            <label style={{ fontSize:13, fontWeight:700, color:textMut, display:"block", marginBottom:7 }}>Password</label>
            <div style={{ position:"relative" }}>
              <input
                type={showPw ? "text" : "password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter admin password"
                required
                style={{ ...inputSt, paddingRight:48 }}
                autoFocus
                onFocus={e => { e.currentTarget.style.borderColor = teal; }}
                onBlur={e  => { e.currentTarget.style.borderColor = border; }}
              />
              <button
                type="button"
                onClick={() => setShowPw(v => !v)}
                style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", fontSize:18, color:textMut, padding:4, lineHeight:1 }}
                title={showPw ? "Hide password" : "Show password"}
              >
                {showPw ? "🙈" : "👁"}
              </button>
            </div>
          </div>

          {authErr && (
            <p style={{ color:"#f87171", fontSize:13, padding:"8px 12px", background:"rgba(239,68,68,0.1)", borderRadius:8, border:"1px solid rgba(239,68,68,0.25)" }}>
              ⚠️ {authErr}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{ padding:"13px", borderRadius:11, background:`linear-gradient(135deg,${tealDim},${teal})`, color:"#042e2a", fontWeight:900, fontSize:15, cursor:loading?"not-allowed":"pointer", border:"none", fontFamily:"inherit", opacity:loading?0.7:1, marginTop:4 }}
          >
            {loading ? "Checking…" : "Access Dashboard →"}
          </button>
        </form>

        <p style={{ fontSize:11.5, color:textMut2, textAlign:"center", marginTop:20 }}>
          🔒 Access is restricted to authorised personnel only.
        </p>
      </div>
    </div>
  );

  // ── DASHBOARD ───────────────────────────────────────────────────
  const filtered = (stats?.registrations ?? []).filter(r => {
    const matchRole   = roleFilter === "all" || r.role === roleFilter;
    const matchSearch = !search ||
      r.email.toLowerCase().includes(search.toLowerCase()) ||
      (r.businessName ?? "").toLowerCase().includes(search.toLowerCase());
    return matchRole && matchSearch;
  });

  const filteredEmails = (stats?.resendEmails ?? []).filter(e => {
    const matchRole   = emailRoleFilter === "all"
      ? true
      : emailRoleFilter === "unknown"
        ? !e.role
        : e.role === emailRoleFilter;
    const matchSearch = !emailSearch ||
      e.recipient.toLowerCase().includes(emailSearch.toLowerCase()) ||
      (e.businessName ?? "").toLowerCase().includes(emailSearch.toLowerCase());
    return matchRole && matchSearch;
  });

  const pct = (n: number) => stats && stats.total > 0 ? Math.round((n / stats.total) * 100) : 0;
  const emailCount = stats?.resendCount ?? stats?.resendEmails?.length ?? 0;

  return (
    <div style={{ minHeight:"100vh", background:bg, color:text, fontFamily:"'Inter','Segoe UI',Arial,sans-serif", padding:"0 0 60px" }}>

      {/* ── Top bar ── */}
      <div style={{ position:"sticky", top:0, zIndex:50, background:"rgba(6,13,12,0.97)", backdropFilter:"blur(20px)", borderBottom:`1px solid ${border}`, padding:"12px 24px", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:10 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <span style={{ fontWeight:900, fontSize:17, background:`linear-gradient(90deg,#a7f3d0,${teal})`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", fontFamily:"Georgia,serif" }}>O-Fash Markett</span>
          <span style={{ fontSize:10, padding:"2px 8px", borderRadius:100, background:"rgba(20,184,166,0.12)", border:`1px solid ${border}`, color:teal, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase" }}>Admin</span>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}>
          {lastRefresh && <span style={{ fontSize:11, color:textMut2 }}>Updated: {lastRefresh.toLocaleTimeString()}</span>}
          <button onClick={() => fetchStats(password)} disabled={loading} style={btnSecondary}>{loading ? "⏳" : "↻ Refresh"}</button>
          <button onClick={handleSync} disabled={syncing || loading} style={{ ...btnSecondary, background:"rgba(245,158,11,0.08)", border:"1px solid rgba(245,158,11,0.25)", color:gold, opacity: syncing ? 0.7 : 1 }}>
            {syncing ? "⏳ Importing…" : "⬆ Sync from Resend"}
          </button>
          <button onClick={handleLogout} style={{ ...btnSecondary, background:"rgba(239,68,68,0.08)", border:"1px solid rgba(239,68,68,0.2)", color:"#f87171" }}>Log Out</button>
        </div>
      </div>

      <div style={{ maxWidth:1120, margin:"0 auto", padding:"32px 20px 0" }}>
        {fetchErr && <p style={{ color:"#f87171", marginBottom:20, padding:"12px 16px", background:"rgba(239,68,68,0.1)", borderRadius:10, border:"1px solid rgba(239,68,68,0.2)" }}>⚠️ {fetchErr}</p>}

        <h1 style={{ fontSize:24, fontWeight:900, marginBottom:4 }}>Waitlist Dashboard</h1>
        <p style={{ color:textMut, fontSize:13, marginBottom:28 }}>Real-time overview of all registered users and sent emails.</p>

        {stats && (
          <>
            {/* ── Stat cards ── */}
            <div className="stat-grid" style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))", gap:14, marginBottom:22 }}>
              {[
                { label:"Total Signups", value:stats.total,   accent:teal,      icon:"👥" },
                { label:"Buyers",        value:stats.buyers,  accent:"#06b6d4", icon:"🛍" },
                { label:"Vendors",       value:stats.vendors, accent:gold,      icon:"🏪" },
                { label:"Riders",        value:stats.riders,  accent:"#a78bfa", icon:"🛵" },
                { label:"Emails Sent",   value:emailCount,    accent:"#4ade80", icon:"📨" },
              ].map(({ label, value, accent, icon }) => (
                <div key={label} style={{ background:bgCard, border:`1px solid ${accent}28`, borderRadius:14, padding:"18px 20px", boxShadow:`0 0 0 1px ${accent}12` }}>
                  <div style={{ fontSize:22, marginBottom:6 }}>{icon}</div>
                  <div style={{ fontSize:34, fontWeight:900, color:accent, lineHeight:1, marginBottom:4, fontFamily:"Georgia,serif" }}>{value}</div>
                  <div style={{ fontSize:12, color:textMut, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.08em" }}>{label}</div>
                  {label !== "Emails Sent" && stats.total > 0 && (
                    <div style={{ marginTop:8 }}>
                      <div style={{ height:3, borderRadius:2, background:"rgba(255,255,255,0.06)", overflow:"hidden" }}>
                        <div style={{ height:"100%", width:`${pct(value)}%`, background:accent, borderRadius:2 }} />
                      </div>
                      <div style={{ fontSize:10, color:textMut2, marginTop:3 }}>{pct(value)}% of total</div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* ── Resend permission error card ── */}
            {stats.resendPermissionError && (
              <div style={{ padding:"18px 22px", borderRadius:14, background:"rgba(245,158,11,0.06)", border:"2px solid rgba(245,158,11,0.28)", marginBottom:20 }}>
                <div style={{ display:"flex", gap:12, alignItems:"flex-start", flexWrap:"wrap" }}>
                  <span style={{ fontSize:22, flexShrink:0 }}>🔑</span>
                  <div style={{ flex:1 }}>
                    <p style={{ fontWeight:800, fontSize:14, color:gold, marginBottom:6 }}>API key needs Full Access to list emails</p>
                    <ol style={{ paddingLeft:16, fontSize:13, color:textMut, lineHeight:2 }}>
                      <li>Log in to <strong style={{color:teal}}>resend.com</strong> → <strong style={{color:text}}>API Keys</strong></li>
                      <li>Create a new key → set Permission to <strong style={{color:text}}>Full Access</strong></li>
                      <li>Replace <code style={{background:bgCard2,padding:"1px 6px",borderRadius:4,fontSize:11}}>RESEND_API_KEY</code> in <code style={{background:bgCard2,padding:"1px 6px",borderRadius:4,fontSize:11}}>.env.local</code></li>
                      <li>Restart the server — email history will appear automatically</li>
                    </ol>
                    <p style={{ fontSize:11, color:textMut2, marginTop:8 }}>New signups are tracked locally and appear in the Registrations tab below.</p>
                  </div>
                </div>
              </div>
            )}

            {/* ── Rate limit warning ── */}
            {stats.resendRateLimited && (
              <div style={{ padding:"10px 16px", borderRadius:10, background:"rgba(245,158,11,0.06)", border:"1px solid rgba(245,158,11,0.22)", marginBottom:20, fontSize:13, color:gold }}>
                ⚠️ Resend rate limit hit — showing partial results. Click <strong>Refresh</strong> in a few seconds to load the full list.
              </div>
            )}

            {/* ── General Resend error ── */}
            {stats.resendError && !stats.resendPermissionError && !stats.resendRateLimited && (
              <div style={{ padding:"10px 16px", borderRadius:10, background:"rgba(239,68,68,0.06)", border:"1px solid rgba(239,68,68,0.2)", marginBottom:20, fontSize:13, color:"#f87171" }}>
                ⚠️ Could not reach Resend: {stats.resendError}. Showing local records only.
              </div>
            )}

            {/* ── Sync result banner ── */}
            {syncResult && (
              <div style={{ padding:"12px 16px", borderRadius:10, marginBottom:20, fontSize:13, background: syncResult.imported > 0 ? "rgba(74,222,128,0.06)" : "rgba(245,158,11,0.06)", border: `1px solid ${syncResult.imported > 0 ? "rgba(74,222,128,0.22)" : "rgba(245,158,11,0.22)"}`, color: syncResult.imported > 0 ? "#4ade80" : gold }}>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:8 }}>
                  <span>{syncResult.imported > 0 ? "✅" : "ℹ️"} {syncResult.message}</span>
                  <button onClick={() => setSyncResult(null)} style={{ background:"none", border:"none", cursor:"pointer", color:"inherit", fontSize:16, lineHeight:1, padding:2, opacity:0.7 }}>✕</button>
                </div>
                {syncResult.imported > 0 && (
                  <div style={{ marginTop:6, fontSize:12, opacity:0.8 }}>
                    Imported: {syncResult.imported} · Skipped: {syncResult.skipped} · No role info: {syncResult.unknown}
                  </div>
                )}
              </div>
            )}

            {/* ── Match/mismatch banner ── */}
            {!stats.resendError && !stats.resendRateLimited && stats.resendCount !== null && (
              stats.resendCount === stats.total ? (
                <div style={{ padding:"9px 16px", borderRadius:10, background:"rgba(74,222,128,0.06)", border:"1px solid rgba(74,222,128,0.18)", marginBottom:20, fontSize:13, color:"#4ade80" }}>
                  ✓ Resend confirms <strong style={{margin:"0 3px"}}>{stats.resendCount}</strong> confirmation emails — matches local records.
                </div>
              ) : (
                <div style={{ padding:"12px 16px", borderRadius:10, background:"rgba(245,158,11,0.06)", border:"1px solid rgba(245,158,11,0.22)", marginBottom:20, fontSize:13, color:gold }}>
                  ⚠️ Resend shows <strong style={{margin:"0 3px"}}>{stats.resendCount}</strong> user emails but local records show <strong style={{margin:"0 3px"}}>{stats.total}</strong> signups — use <strong>⬆ Sync from Resend</strong> in the top bar to backfill missing records.
                </div>
              )
            )}

            {/* ── Registration trends chart ── */}
            <RegistrationChart registrations={stats.registrations} />

            {/* ── Tabs ── */}
            <div style={{ display:"flex", gap:4, marginBottom:20, borderBottom:`1px solid ${border}` }}>
              {(["registrations","emails"] as const).map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding:"9px 18px", borderRadius:"9px 9px 0 0", fontFamily:"inherit", fontSize:13, fontWeight:700, cursor:"pointer", border:`1px solid ${activeTab===tab?border:"transparent"}`, borderBottom:activeTab===tab?`1px solid ${bg}`:"1px solid transparent", background:activeTab===tab?bgCard:"transparent", color:activeTab===tab?teal:textMut2, marginBottom:-1, transition:"all 0.15s" }}>
                  {tab === "registrations"
                    ? `📋 Registrations (${stats.total})`
                    : `📨 Emails Sent (${stats.resendEmails.length})`}
                </button>
              ))}
            </div>

            {/* ── Registrations tab ── */}
            {activeTab === "registrations" && (
              <div style={{ background:bgCard, border:`1px solid ${border}`, borderRadius:16, overflow:"hidden" }}>
                <div className="table-header" style={{ padding:"16px 20px", borderBottom:`1px solid ${border}`, display:"flex", alignItems:"center", gap:10, flexWrap:"wrap" }}>
                  <h2 style={{ fontSize:15, fontWeight:800, flex:1, minWidth:100 }}>
                    Registrations <span style={{ color:textMut2, fontWeight:600, fontSize:13 }}>({filtered.length})</span>
                  </h2>
                  <input type="text" placeholder="Search…" value={search} onChange={e=>setSearch(e.target.value)} className="table-search" style={{ ...inputSt, width:"auto", minWidth:160, padding:"7px 12px", fontSize:13 }} onFocus={e=>{e.currentTarget.style.borderColor=teal}} onBlur={e=>{e.currentTarget.style.borderColor=border}} />
                  <div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>
                    {["all","buyer","vendor","rider"].map(f => (
                      <button key={f} onClick={()=>setRoleFilter(f)} style={{ padding:"5px 12px", borderRadius:100, fontSize:12, fontWeight:800, cursor:"pointer", fontFamily:"inherit", border:`1px solid ${roleFilter===f?teal:border}`, background:roleFilter===f?"rgba(20,184,166,0.15)":"transparent", color:roleFilter===f?teal:textMut2, transition:"all 0.15s", textTransform:"capitalize" }}>
                        {f==="all"?"All":f==="buyer"?"🛍 Buyers":f==="vendor"?"🏪 Vendors":"🛵 Riders"}
                      </button>
                    ))}
                  </div>
                  <button onClick={exportRegistrations} style={{ ...btnSecondary, background:"rgba(74,222,128,0.08)", border:"1px solid rgba(74,222,128,0.22)", color:"#4ade80" }}>
                    ↓ Export CSV
                  </button>
                </div>

                <div style={{ overflowX:"auto" }}>
                  {filtered.length === 0 ? (
                    <div style={{ padding:"48px 24px", textAlign:"center", color:textMut2 }}>
                      {stats.total === 0 ? "No registrations yet — they will appear here as people sign up." : "No results match your filter."}
                    </div>
                  ) : (
                    <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
                      <thead>
                        <tr style={{ borderBottom:`1px solid ${border}` }}>
                          {["#","Email","Role","Business / Shop","WhatsApp","Date (WAT)"].map(h => (
                            <th key={h} style={{ padding:"11px 18px", textAlign:"left", color:textMut2, fontWeight:700, fontSize:11, letterSpacing:"0.08em", textTransform:"uppercase", whiteSpace:"nowrap" }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {filtered.map((r, i) => (
                          <tr key={i} style={{ borderBottom:i<filtered.length-1?`1px solid ${border}`:"none", background:i%2===0?"transparent":"rgba(20,184,166,0.02)" }}>
                            <td style={{ padding:"12px 18px", color:textMut2, fontSize:11 }}>{i+1}</td>
                            <td style={{ padding:"12px 18px", fontWeight:600, fontFamily:"monospace", fontSize:12 }}>{r.email}</td>
                            <td style={{ padding:"12px 18px" }}>{roleBadge(r.role)}</td>
                            <td style={{ padding:"12px 18px", color:r.businessName?text:textMut2, fontStyle:r.businessName?"normal":"italic" }}>{r.businessName||"—"}</td>
                            <td style={{ padding:"12px 18px", color:r.whatsapp?teal:textMut2, fontFamily:"monospace", fontSize:12 }}>{r.whatsapp||"—"}</td>
                            <td style={{ padding:"12px 18px", color:textMut, whiteSpace:"nowrap", fontSize:12 }}>{fmt(r.timestamp)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            )}

            {/* ── Emails Sent tab ── */}
            {activeTab === "emails" && (
              <div style={{ background:bgCard, border:`1px solid ${border}`, borderRadius:16, overflow:"hidden" }}>
                <div className="table-header" style={{ padding:"16px 20px", borderBottom:`1px solid ${border}`, display:"flex", alignItems:"center", gap:10, flexWrap:"wrap" }}>
                  <div style={{ flex:1, minWidth:160 }}>
                    <h2 style={{ fontSize:15, fontWeight:800, marginBottom:3 }}>
                      Emails Sent <span style={{ color:textMut2, fontWeight:600, fontSize:13 }}>({filteredEmails.length})</span>
                    </h2>
                    <p style={{ fontSize:11, color: stats.emailSource==="resend" ? "#4ade80" : gold }}>
                      {stats.emailSource==="resend" ? "✓ Live data from Resend" : "⚠ Local records — update API key for full history"}
                    </p>
                  </div>

                  {/* Role filter pills */}
                  <div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>
                    {[
                      { value:"all",     label:"All" },
                      { value:"buyer",   label:"🛍 Buyers" },
                      { value:"vendor",  label:"🏪 Vendors" },
                      { value:"rider",   label:"🛵 Riders" },
                      { value:"unknown", label:"❓ Unknown" },
                    ].map(f => (
                      <button key={f.value} onClick={()=>setEmailRoleFilter(f.value)} style={{ padding:"5px 12px", borderRadius:100, fontSize:12, fontWeight:800, cursor:"pointer", fontFamily:"inherit", border:`1px solid ${emailRoleFilter===f.value?teal:border}`, background:emailRoleFilter===f.value?"rgba(20,184,166,0.15)":"transparent", color:emailRoleFilter===f.value?teal:textMut2, transition:"all 0.15s" }}>
                        {f.label}
                      </button>
                    ))}
                  </div>

                  <input type="text" placeholder="Search email…" value={emailSearch} onChange={e=>setEmailSearch(e.target.value)} className="table-search" style={{ ...inputSt, width:"auto", minWidth:160, padding:"7px 12px", fontSize:13 }} onFocus={e=>{e.currentTarget.style.borderColor=teal}} onBlur={e=>{e.currentTarget.style.borderColor=border}} />
                  <button onClick={exportEmails} style={{ ...btnSecondary, background:"rgba(74,222,128,0.08)", border:"1px solid rgba(74,222,128,0.22)", color:"#4ade80" }}>
                    ↓ Export CSV
                  </button>
                </div>

                <div style={{ overflowX:"auto" }}>
                  {filteredEmails.length === 0 ? (
                    <div style={{ padding:"48px 24px", textAlign:"center", color:textMut2 }}>
                      {(stats.resendEmails ?? []).length === 0
                        ? "No emails recorded yet — they will appear here after the first signup."
                        : "No results match your filter."}
                    </div>
                  ) : (
                    <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
                      <thead>
                        <tr style={{ borderBottom:`1px solid ${border}` }}>
                          {["#","Email","Role","Business / Shop","Status","Sent (WAT)"].map(h => (
                            <th key={h} style={{ padding:"11px 18px", textAlign:"left", color:textMut2, fontWeight:700, fontSize:11, letterSpacing:"0.08em", textTransform:"uppercase", whiteSpace:"nowrap" }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {filteredEmails.map((e, i) => (
                          <tr key={i} style={{ borderBottom:i<filteredEmails.length-1?`1px solid ${border}`:"none", background:i%2===0?"transparent":"rgba(20,184,166,0.02)" }}>
                            <td style={{ padding:"12px 18px", color:textMut2, fontSize:11 }}>{i+1}</td>
                            <td style={{ padding:"12px 18px", fontFamily:"monospace", fontSize:12, fontWeight:600 }}>{e.recipient}</td>
                            <td style={{ padding:"12px 18px" }}>{e.role ? roleBadge(e.role) : <span style={{ color:textMut2, fontSize:12, fontStyle:"italic" }}>—</span>}</td>
                            <td style={{ padding:"12px 18px", color:e.businessName?text:textMut2, fontStyle:e.businessName?"normal":"italic", fontSize:12 }}>{e.businessName||"—"}</td>
                            <td style={{ padding:"12px 18px" }}>{statusBadge(e.status)}</td>
                            <td style={{ padding:"12px 18px", color:textMut, whiteSpace:"nowrap", fontSize:12 }}>{fmt(e.sentAt)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            )}
          </>
        )}

        {loading && !stats && (
          <div style={{ textAlign:"center", padding:"80px 0", color:textMut }}>
            <div style={{ fontSize:30, marginBottom:12, animation:"spin 1s linear infinite", display:"inline-block" }}>⏳</div>
            <p>Loading dashboard…</p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #060d0c; }
        ::selection { background: rgba(20,184,166,0.25); }

        /* ── Responsive ── */
        @media (max-width: 600px) {
          .login-card { padding: 28px 20px !important; }
          .stat-grid  { grid-template-columns: repeat(2, 1fr) !important; }
          .table-header { flex-direction: column !important; align-items: stretch !important; }
          .table-search { min-width: unset !important; width: 100% !important; }
        }
        @media (max-width: 400px) {
          .stat-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </div>
  );
}
