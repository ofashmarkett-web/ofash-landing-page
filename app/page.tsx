"use client";

import Image from "next/image";
import {
  useState,
  useEffect,
  useRef,
  useCallback,
  createContext,
  useContext,
  type ReactNode,
  type MouseEvent,
  type FormEvent,
} from "react";
import {
  Menu,
  X,
  ArrowRight,
  Share2,
  Globe,
  AtSign,
  Video,
} from "lucide-react";

// ────── THEME CONTEXT ──────
type ThemeContextType = {
  isDark: boolean;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function ThemeProvider({ children }: { children: ReactNode }) {
  const [isDark, setIsDark] = useState(true);
  const toggleTheme = () => setIsDark(!isDark);
  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}

// ────── COLOR TOKENS ──────
const colors = {
  dark: {
    bg: "#050c0b",
    bgAlt: "#0a1512",
    bgAlt2: "#0f1a17",
    text: "#edfaf7",
    textMuted: "rgba(220,250,245,0.55)",
    textMuted2: "rgba(220,250,245,0.35)",
    border: "rgba(20,184,166,0.12)",
    borderLight: "rgba(20,184,166,0.25)",
    glass: "rgba(6,95,88,0.08)",
    glassBorder: "rgba(20,184,166,0.15)",
  },
  light: {
    bg: "#f8fdfb",
    bgAlt: "#eef6f4",
    bgAlt2: "#e0ebe8",
    text: "#042e2a",
    textMuted: "rgba(4,46,42,0.65)",
    textMuted2: "rgba(4,46,42,0.45)",
    border: "rgba(13,148,136,0.15)",
    borderLight: "rgba(13,148,136,0.35)",
    glass: "rgba(167,243,208,0.08)",
    glassBorder: "rgba(13,148,136,0.25)",
  },
};

// ────── PALETTE ──────
const palette = {
  teal: {
    light: "#0d9488",
    lighter: "#5eead4",
    lightest: "#a7f3d0",
  },
  gold: {
    main: "#f59e0b",
    light: "#fbbf24",
    lighter: "#fde68a",
  },
  rust: {
    main: "#c4430a",
    light: "#ea580c",
  },
  green: {
    bright: "#10b981",
    vibrant: "#14b8a6",
  },
  red: {
    accent: "#ef4444",
  },
  slate: {
    dark: "#1e293b",
    light: "#f1f5f9",
  },
};

const IMG = {
  heroMarket: "/images/heroMarket.png",
  clothesMen: "/images/clotheMen.png",
  clothesWomen: "/images/clotheWomen.png",
  shoes: "/images/shoe.png",
  wigs: "/images/wig.png",
  bags: "/images/bag.png",
  fabric: "/images/fabrics.png",
  riderBike: "/images/riderBike.png",
  marketScene: "/images/marketScene.png",
  vendor1: "/images/vendor1.png",
  vendor2: "/images/vendor2.png",
  market2: "/images/market2.png",
  africanFashion: "/images/africanFashion.png",
  couple: "/images/couple.png",
  perfume: "/images/perfume.png",
};

type ModalPage = "privacy" | "terms" | "contact" | "cookies" | null;
type UserRole = "buyer" | "vendor" | "rider" | null;

function GlobalStyles() {
  const { isDark } = useTheme();
  const c = colors[isDark ? "dark" : "light"];
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;0,900;1,700&family=Sora:wght@400;600;700;800&display=swap');
      
      *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
      html{scroll-behavior:smooth;}
      body{background:${c.bg};color:${c.text};overflow-x:hidden;font-family:'Sora',sans-serif;transition:background 0.35s, color 0.35s;}
      ::selection{background:rgba(13,148,136,0.25);}
      ::placeholder{color:${c.textMuted2};}
      ::-webkit-scrollbar{width:6px;}
      ::-webkit-scrollbar-track{background:${c.bg};}
      ::-webkit-scrollbar-thumb{background:${palette.teal.light};border-radius:3px;opacity:0.6;}
      ::-webkit-scrollbar-thumb:hover{opacity:0.9;}

      @keyframes pulse-dot{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.4;transform:scale(.7)}}
      @keyframes fade-in{from{opacity:0}to{opacity:1}}
      @keyframes slide-up{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}}
      @keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}
      @keyframes float-y{0%,100%{transform:translateY(0)}50%{transform:translateY(-14px)}}
      @keyframes shimmer{from{background-position:-200% 0}to{background-position:200% 0}}
      @keyframes glow{0%,100%{box-shadow:0 0 20px rgba(13,148,136,0.3)}50%{box-shadow:0 0 30px rgba(245,158,11,0.2)}}
      @keyframes rotate-border{to{--angle:360deg}}
      @keyframes beam-fall{0%{opacity:0;transform:scaleY(0) translateY(-110%)}15%{opacity:1}80%{opacity:.8}100%{opacity:0;transform:scaleY(1) translateY(110%)}}
      @keyframes ride-across{from{transform:translateX(-80px);opacity:0}to{transform:translateX(0);opacity:1}}

      @property --angle{syntax:'<angle>';initial-value:0deg;inherits:false;}

      .shimmer-text{background:linear-gradient(90deg,${palette.green.vibrant} 0%,${palette.gold.light} 35%,${palette.teal.lighter} 70%);background-size:220% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;animation:shimmer 4.2s linear infinite;}

      .mborder-conic{
        background:conic-gradient(from var(--angle),
          transparent 60%,${palette.green.vibrant} 72%,${palette.teal.lighter} 79%,
          ${palette.gold.main} 86%,${palette.gold.light} 91%,transparent 100%);
        animation:rotate-border 3.4s linear infinite;
      }
      .glass{background:${c.glass};backdrop-filter:blur(16px) saturate(155%);-webkit-backdrop-filter:blur(16px) saturate(155%);border:1px solid ${c.glassBorder};}

      .nav-link:hover{color:${palette.teal.lighter}!important;}
      .nav-cta:hover{transform:translateY(-2px)!important;box-shadow:0 12px 36px rgba(13,148,136,0.35)!important;}
      .role-card:hover{transform:translateY(-8px)!important;}
      .role-card.sel{box-shadow:0 0 0 2.5px ${palette.teal.light},0 22px 56px rgba(13,148,136,0.28)!important;}
      .cat-tile:hover{transform:scale(1.06)!important;}
      .btn-primary:hover{transform:translateY(-3px);box-shadow:0 16px 48px rgba(13,148,136,0.4);}
      .btn-secondary:hover{transform:translateY(-3px);box-shadow:0 12px 36px rgba(245,158,11,0.35);}
      .trust-card:hover{transform:translateY(-5px)!important;}
      .step-card:hover{transform:translateY(-6px)!important;}
      .faq-item:hover .faq-q{color:${palette.teal.lighter}!important;}
      .footer-link:hover{color:${palette.teal.lighter}!important;}
      .social-btn:hover{background:rgba(20,184,166,0.14)!important;border-color:rgba(20,184,166,0.38)!important;}
      .modal-close:hover{background:rgba(20,184,166,0.14)!important;}
      .mobile-menu{display:none;}

      @media(max-width:960px){
        .nav-links{display:none!important;}
        .mobile-menu{display:block;}
        .roles-g,.rider-g{grid-template-columns:1fr!important;}
        .cat-g{grid-template-columns:repeat(2,1fr)!important;}
        .trust-g{grid-template-columns:repeat(2,1fr)!important;}
        .steps-g{grid-template-columns:1fr!important;}
      }
      @media(max-width:600px){
        .footer-g{grid-template-columns:1fr!important;}
        .cat-g{grid-template-columns:1fr!important;}
        .trust-g,.cr2{grid-template-columns:1fr!important;}
      }
    `}</style>
  );
}

// ────── LOGO ──────
function OFashLogo({ size = 44, textSize = 18, dark = true }) {
  const style = dark
    ? { textColor: "#a7f3d0", gradStart: "#042e2a", gradEnd: "#0d9488" }
    : { textColor: "#0d9488", gradStart: "#e0ebe8", gradEnd: "#a7f3d0" };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <div
        style={{
          width: size,
          height: size,
          flexShrink: 0,
          borderRadius: Math.round(size * 0.22),
          background: `linear-gradient(135deg,${style.gradStart},${style.gradEnd})`,
          boxShadow: `0 0 0 1.5px ${dark ? "rgba(20,184,166,0.3)" : "rgba(13,148,136,0.25)"}, 0 4px ${size * 0.5}px ${dark ? "rgba(13,148,136,0.2)" : "rgba(13,148,136,0.15)"}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg
          width={size * 0.6}
          height={size * 0.6}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M4 6h7a3 3 0 010 6H4V6z" fill={style.textColor} />
          <path d="M4 12h5v6H4v-6z" fill={style.textColor} opacity="0.6" />
          <path d="M13 6h7v3h-7V6z" fill={palette.gold.main} />
          <path
            d="M13 10.5h5v3h-5v-3z"
            fill={palette.gold.main}
            opacity="0.7"
          />
        </svg>
      </div>
      <div>
        <div
          style={{
            fontSize: textSize,
            fontWeight: 900,
            fontFamily: "'Playfair Display',serif",
            background: `linear-gradient(90deg,${palette.teal.lightest},${palette.teal.light})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            letterSpacing: "-0.5px",
            lineHeight: 1,
          }}
        >
          O-Fash
        </div>
        <div
          style={{
            fontSize: Math.max(textSize * 0.45, 7),
            color: palette.teal.light,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            fontWeight: 700,
            marginTop: 2,
          }}
        >
          Markett
        </div>
      </div>
    </div>
  );
}

// ────── BACKGROUND EFFECTS ──────
function BackgroundBeams() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 0,
        overflow: "hidden",
      }}
      aria-hidden
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1440 960"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <radialGradient id="rg1" cx="30%" cy="42%" r="55%">
            <stop offset="0%" stopColor="#0d9488" stopOpacity=".15" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="rg2" cx="78%" cy="20%" r="42%">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity=".065" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="rg3" cx="55%" cy="90%" r="38%">
            <stop offset="0%" stopColor="#c4430a" stopOpacity=".055" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>
          {[160, 420, 700, 960, 1220].map((_, i) => (
            <linearGradient
              key={i}
              id={`b${i}`}
              x1="0"
              y1="0"
              x2="0"
              y2="1"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="transparent" />
              <stop
                offset="40%"
                stopColor="#14b8a6"
                stopOpacity={0.2 - i * 0.02}
              />
              <stop offset="62%" stopColor="#f59e0b" stopOpacity="0.07" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
          ))}
        </defs>
        <rect width="100%" height="100%" fill="url(#rg1)" />
        <rect width="100%" height="100%" fill="url(#rg2)" />
        <rect width="100%" height="100%" fill="url(#rg3)" />
        {Array.from({ length: 26 }).map((_, i) => (
          <line
            key={i}
            x1={i * 56}
            y1="0"
            x2={i * 56}
            y2="960"
            stroke="rgba(20,184,166,0.03)"
            strokeWidth="1"
          />
        ))}
        {Array.from({ length: 17 }).map((_, i) => (
          <line
            key={i}
            x1="0"
            y1={i * 58}
            x2="1440"
            y2={i * 58}
            stroke="rgba(245,158,11,0.018)"
            strokeWidth="1"
          />
        ))}
        {[160, 420, 700, 960, 1220].map((x, i) => (
          <rect
            key={i}
            x={x - 1}
            y="-150"
            width="1.5"
            height="1260"
            fill={`url(#b${i})`}
            style={{
              animation: `beam-fall ${3.2 + i * 0.65}s ease-in-out ${i * 1.1}s infinite`,
              willChange: "transform,opacity",
            }}
          />
        ))}
      </svg>
    </div>
  );
}

function Spotlight() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let id = 0,
      tx = 700,
      ty = 300,
      cx = 700,
      cy = 300;
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const tick = () => {
      cx = lerp(cx, tx, 0.07);
      cy = lerp(cy, ty, 0.07);
      if (ref.current)
        ref.current.style.transform = `translate(${cx - 400}px,${cy - 400}px)`;
      id = requestAnimationFrame(tick);
    };
    const mv = (e: any) => {
      tx = e.clientX;
      ty = e.clientY;
    };
    window.addEventListener("mousemove", mv, { passive: true });
    id = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("mousemove", mv);
      cancelAnimationFrame(id);
    };
  }, []);
  return (
    <div
      style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}
    >
      <div
        ref={ref}
        style={{
          position: "absolute",
          width: 800,
          height: 800,
          borderRadius: "50%",
          background:
            "radial-gradient(circle,rgba(13,148,136,0.05) 0%,rgba(245,158,11,0.018) 50%,transparent 70%)",
          willChange: "transform",
        }}
      />
    </div>
  );
}

// ────── MARQUEES ──────
function Marquee({ type = "markets" }) {
  const markets = [
    "🏪 Balogun Market",
    "🏬 Onitsha Central",
    "🛍 Dutse Fashion Hub",
    "🏪 Ariaria Market",
    "🏬 Kano Textiles",
    "🛍 Yaba Fashion",
  ];

  const goods = [
    "👗 Ankara Dresses",
    "👔 Men's Suits",
    "👞 Designer Shoes",
    "💍 Accessories",
    "🧵 Premium Fabrics",
    "👛 Leather Bags",
    "💇 Human Hair Wigs",
    "🕶 Eyewear",
  ];

  const items = type === "markets" ? markets : goods;
  const doubled = [...items, ...items];

  return (
    <div
      style={{
        overflow: "hidden",
        borderTop: `1px solid ${colors.dark.border}`,
        borderBottom: `1px solid ${colors.dark.border}`,
        padding: "16px 0",
        background: "rgba(20,184,166,0.02)",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: 64,
          width: "max-content",
          animation: "marquee 50s linear infinite",
          willChange: "transform",
        }}
      >
        {doubled.map((item, i) => (
          <span
            key={i}
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: "rgba(220,250,245,0.38)",
              whiteSpace: "nowrap",
              letterSpacing: "0.08em",
            }}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

// ────── NAVIGATION ──────
function Navigation({ onWaitlistClick }: { onWaitlistClick: () => void }) {
  const { isDark, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const c = colors[isDark ? "dark" : "light"];

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 200,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px 32px",
        borderBottom: `1px solid ${c.border}`,
        backdropFilter: "blur(28px) saturate(160%)",
        background: isDark ? "rgba(5,12,11,0.88)" : "rgba(248,253,251,0.88)",
        transition: "all 0.35s",
      }}
    >
      <OFashLogo size={40} textSize={14} dark={isDark} />

      <ul
        className="nav-links"
        style={{
          display: "flex",
          gap: 32,
          listStyle: "none",
          margin: 0,
          padding: 0,
        }}
      >
        {[
          ["How It Works", "#how-it-works"],
          ["Who We Serve", "#who-we-serve"],
          ["Categories", "#categories"],
          ["FAQ", "#faq"],
        ].map(([label, href]) => (
          <li key={label}>
            <a
              href={href}
              style={{
                color: c.textMuted,
                fontSize: 14,
                fontWeight: 600,
                textDecoration: "none",
                transition: "color 0.25s",
              }}
            >
              {label}
            </a>
          </li>
        ))}
      </ul>

      <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
        <button
          onClick={toggleTheme}
          style={{
            width: 44,
            height: 44,
            borderRadius: 10,
            background: c.bgAlt,
            border: `1px solid ${c.border}`,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 20,
            transition: "all 0.25s",
          }}
          title={isDark ? "Light mode" : "Dark mode"}
        >
          {isDark ? "☀️" : "🌙"}
        </button>
        <button
          className="btn-primary"
          onClick={onWaitlistClick}
          style={{
            padding: "11px 24px",
            borderRadius: 10,
            background: `linear-gradient(135deg,${palette.teal.light},${palette.green.vibrant})`,
            color: isDark ? colors.dark.bg : "#042e2a",
            fontWeight: 800,
            fontSize: 13,
            cursor: "pointer",
            border: "none",
            fontFamily: "'Sora',sans-serif",
            boxShadow: `0 6px 20px rgba(13,148,136,0.35)`,
            transition: "transform 0.15s,box-shadow 0.25s",
            willChange: "transform",
          }}
        >
          Join Waitlist
        </button>
        <button
          className="mobile-menu"
          onClick={() => setMobileOpen(!mobileOpen)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: c.text,
          }}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </nav>
  );
}

// ────── WAITLIST FORM ──────
function WaitlistForm({ compact = false }: { compact?: boolean }) {
  const { isDark } = useTheme();
  const c = colors[isDark ? "dark" : "light"];
  const [email, setEmail] = useState("");
  const [wa, setWa] = useState("");
  const [role, setRole] = useState<"" | "buyer" | "vendor" | "rider">("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errMsg, setErrMsg] = useState("");
  const [note, setNote] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) {
      setErrMsg("Please enter a valid email.");
      return;
    }
    setStatus("loading");
    setErrMsg("");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.toLowerCase(),
          whatsapp: wa,
          role,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setErrMsg(data.error || "Something went wrong. Please try again.");
        return;
      }
      setStatus("success");
      setEmail("");
      setWa("");
      setRole("");
    } catch {
      setStatus("error");
      setErrMsg("Network error — please check your connection.");
    }
  };

  if (status === "success")
    return (
      <div
        style={{
          textAlign: "center",
          padding: "26px 30px",
          background: "rgba(13,148,136,0.11)",
          borderRadius: 17,
          border: `1px solid ${palette.teal.light}`,
          animation: "slide-up 0.4s ease",
        }}
      >
        <div
          style={{
            fontSize: 42,
            marginBottom: 10,
            animation: "float-y 2s ease-in-out infinite",
          }}
        >
          🎉
        </div>
        <p
          style={{
            color: palette.teal.lighter,
            fontWeight: 800,
            fontSize: 17,
            marginBottom: 5,
          }}
        >
          You&apos;re on the list!
        </p>
        <p
          style={{
            color: c.textMuted,
            fontSize: 13,
            lineHeight: 1.72,
          }}
        >
          Check your inbox — confirmation sent! We&apos;ll notify you the moment
          we launch.
        </p>
      </div>
    );

  if (status === "error")
    return (
      <div
        style={{
          textAlign: "center",
          padding: "22px 26px",
          background: "rgba(196,67,10,0.09)",
          borderRadius: 15,
          border: "1px solid rgba(196,67,10,0.28)",
        }}
      >
        <div style={{ fontSize: 30, marginBottom: 9 }}>⚠️</div>
        <p
          style={{
            color: palette.rust.light,
            fontWeight: 700,
            fontSize: 15,
            marginBottom: 5,
          }}
        >
          Something went wrong
        </p>
        <p
          style={{
            color: c.textMuted,
            fontSize: 13,
            marginBottom: 13,
          }}
        >
          {errMsg}
        </p>
        <button
          onClick={() => setStatus("idle")}
          style={{
            padding: "8px 18px",
            borderRadius: 8,
            background: "rgba(196,67,10,0.18)",
            color: palette.rust.light,
            border: "1px solid rgba(196,67,10,0.28)",
            cursor: "pointer",
            fontSize: 12.5,
            fontWeight: 700,
            fontFamily: "'Sora',sans-serif",
          }}
        >
          Try Again
        </button>
      </div>
    );

  const inSt: React.CSSProperties = {
    flex: 1,
    minWidth: 175,
    padding: compact ? "11px 13px" : "13px 16px",
    borderRadius: 11,
    border: `1.5px solid ${c.border}`,
    background: isDark ? "rgba(20,184,166,0.05)" : "rgba(13,148,136,0.04)",
    color: c.text,
    fontSize: compact ? 13 : 14.5,
    outline: "none",
    fontFamily: "'Sora',sans-serif",
    transition: "border-color 0.18s,box-shadow 0.18s",
  };

  return (
    <form
      onSubmit={submit}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 10,
        width: "100%",
        maxWidth: 540,
      }}
    >
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {(["buyer", "vendor", "rider"] as const).map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => setRole(role === r ? "" : r)}
            style={{
              padding: "5px 14px",
              borderRadius: 100,
              fontSize: 12,
              fontWeight: 700,
              fontFamily: "'Sora',sans-serif",
              cursor: "pointer",
              transition: "all 0.17s",
              background:
                role === r
                  ? isDark
                    ? "rgba(20,184,166,0.18)"
                    : "rgba(13,148,136,0.15)"
                  : isDark
                    ? "rgba(20,184,166,0.055)"
                    : "rgba(13,148,136,0.05)",
              border:
                role === r
                  ? `1.5px solid ${palette.teal.light}`
                  : `1.5px solid ${c.border}`,
              color: role === r ? palette.teal.lighter : c.textMuted2,
            }}
          >
            {r === "buyer"
              ? "🛍 Buyer"
              : r === "vendor"
                ? "🏪 Vendor"
                : "🛵 Rider"}
          </button>
        ))}
      </div>
      <div style={{ display: "flex", gap: 9, flexWrap: "wrap" }}>
        <input
          style={inSt}
          type="email"
          placeholder="Email address *"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          onFocus={(e) => {
            e.currentTarget.style.borderColor = palette.teal.light;
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = c.border;
          }}
        />
        <input
          style={inSt}
          type="tel"
          placeholder="WhatsApp number"
          value={wa}
          onChange={(e) => setWa(e.target.value)}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = palette.teal.light;
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = c.border;
          }}
        />
      </div>
      <div
        style={{
          display: "flex",
          gap: 9,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <button
          type="submit"
          disabled={status === "loading"}
          style={{
            flex: 1,
            padding: compact ? "12px 18px" : "14px 26px",
            borderRadius: 12,
            background: `linear-gradient(135deg,${palette.teal.light},${palette.green.vibrant})`,
            color: isDark ? colors.dark.bg : "#042e2a",
            fontWeight: 800,
            fontSize: compact ? 14 : 15,
            cursor: "pointer",
            border: "none",
            boxShadow: `0 6px 26px rgba(13,148,136,0.36)`,
            fontFamily: "'Sora',sans-serif",
            transition: "transform 0.15s,box-shadow 0.2s",
            willChange: "transform",
          }}
        >
          {status === "loading" ? "Reserving…" : "Reserve a Spot →"}
        </button>
        <button
          type="button"
          onClick={() => setNote((n) => !n)}
          style={{
            fontSize: 12,
            color: c.textMuted2,
            background: "none",
            border: "none",
            cursor: "pointer",
            textDecoration: "underline",
            fontFamily: "'Sora',sans-serif",
            whiteSpace: "nowrap",
          }}
        >
          Why WhatsApp?
        </button>
      </div>
      {errMsg && status === "idle" && (
        <p
          style={{
            fontSize: 12,
            color: palette.rust.light,
            padding: "8px 11px",
            borderRadius: 8,
            background: "rgba(196,67,10,0.07)",
            border: "1px solid rgba(196,67,10,0.18)",
          }}
        >
          {errMsg}
        </p>
      )}
      {note && (
        <div
          style={{
            fontSize: 12,
            color: c.textMuted,
            background: isDark
              ? "rgba(20,184,166,0.055)"
              : "rgba(13,148,136,0.05)",
            padding: "10px 13px",
            borderRadius: 10,
            border: `1px solid ${c.border}`,
            lineHeight: 1.7,
          }}
        >
          📱{" "}
          <strong style={{ color: palette.teal.lighter }}>We promise:</strong>{" "}
          WhatsApp is only for your launch notification. No spam, ever.
        </div>
      )}
    </form>
  );
}

// ────── ROLE SELECTOR ──────
function RoleSelector({
  onSelectRole,
}: {
  onSelectRole: (roleId: string) => void;
}) {
  const { isDark } = useTheme();
  const c = colors[isDark ? "dark" : "light"];
  const [sel, setSel] = useState<UserRole>(null);

  const roles = [
    {
      id: "buyer" as UserRole,
      icon: "🛍",
      title: "Buyer",
      subtitle: "Shop from Every Market",
      desc: "Discover fashion items from Nigeria's top markets. Clothes, shoes, bags, fabrics — delivered fast.",
      img: IMG.couple,
      accent: palette.teal.light,
      color: palette.teal.lighter,
    },
    {
      id: "vendor" as UserRole,
      icon: "🏪",
      title: "Vendor",
      subtitle: "Reach More Buyers",
      desc: "Sell your collection nationwide. Register free, list products, and grow your sales effortlessly.",
      img: IMG.vendor2,
      accent: palette.gold.main,
      color: palette.gold.light,
    },
    {
      id: "rider" as UserRole,
      icon: "🛵",
      title: "Rider",
      subtitle: "Earn on Your Terms",
      desc: "Deliver fashion orders. Flexible hours, per-delivery pay, and bonuses. Start earning today.",
      img: IMG.riderBike,
      accent: palette.rust.main,
      color: palette.rust.light,
    },
  ];

  const handleSelect = (roleId: string) => {
    setSel(roleId as UserRole);
    onSelectRole(roleId);
  };

  return (
    <div style={{ marginBottom: 40 }}>
      <p
        style={{
          fontSize: 12,
          fontWeight: 800,
          letterSpacing: "0.16em",
          color: palette.teal.light,
          textTransform: "uppercase",
          marginBottom: 24,
          textAlign: "center",
        }}
      >
        I am joining as a…
      </p>
      <div
        className="roles-g"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: 18,
          maxWidth: 1000,
          margin: "0 auto",
        }}
      >
        {roles.map((role) => (
          <div
            key={role.id}
            className={`role-card`}
            onClick={() => handleSelect(role.id || "")}
            style={{
              borderRadius: 22,
              overflow: "hidden",
              cursor: "pointer",
              border: `2px solid ${sel === role.id ? role.accent : c.border}`,
              background: isDark
                ? sel === role.id
                  ? `linear-gradient(145deg,rgba(${parseInt(role.accent.slice(1, 3), 16)},${parseInt(role.accent.slice(3, 5), 16)},${parseInt(role.accent.slice(5, 7), 16)},0.1),${c.bgAlt})`
                  : c.bgAlt2
                : sel === role.id
                  ? c.bgAlt
                  : c.bgAlt2,
              transition: "all 0.35s cubic-bezier(0.34,1.56,0.64,1)",
              willChange: "transform,border-color",
              boxShadow:
                sel === role.id
                  ? `0 0 0 1px ${role.accent},0 20px 50px rgba(13,148,136,0.2)`
                  : "none",
            }}
          >
            <div
              style={{
                height: 160,
                overflow: "hidden",
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "rgba(0,0,0,0.03)",
              }}
            >
              <Image
                src={role.img}
                alt={role.title}
                fill
                sizes="(max-width: 960px) 100vw, 33vw"
                style={{ objectFit: "contain", objectPosition: "center" }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: isDark
                    ? "linear-gradient(to top,rgba(5,12,11,0.96) 0%,rgba(5,12,11,0.08) 60%)"
                    : "linear-gradient(to top,rgba(248,253,251,0.92) 0%,rgba(248,253,251,0.05) 60%)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: 12,
                  left: 14,
                  fontSize: 28,
                }}
              >
                {role.icon}
              </div>
              {sel === role.id && (
                <div
                  style={{
                    position: "absolute",
                    top: 12,
                    right: 12,
                    width: 26,
                    height: 26,
                    borderRadius: "50%",
                    background: role.accent,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 13,
                    color: isDark ? colors.dark.bg : "#fff",
                    fontWeight: 900,
                    animation: "fade-in 0.3s ease",
                  }}
                >
                  ✓
                </div>
              )}
            </div>
            <div style={{ padding: "16px 17px 20px" }}>
              <h3
                style={{
                  fontSize: 17.5,
                  fontWeight: 900,
                  fontFamily: "'Playfair Display',serif",
                  marginBottom: 4,
                  color: sel === role.id ? role.color : c.text,
                }}
              >
                {role.title}
              </h3>
              <p
                style={{
                  fontSize: 11.5,
                  fontWeight: 700,
                  color: role.accent,
                  letterSpacing: "0.06em",
                  marginBottom: 8,
                  textTransform: "uppercase",
                }}
              >
                {role.subtitle}
              </p>
              <p
                style={{
                  fontSize: 13.5,
                  color: c.textMuted,
                  lineHeight: 1.68,
                }}
              >
                {role.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
      {sel && (
        <p
          style={{
            textAlign: "center",
            marginTop: 20,
            fontSize: 14,
            color: palette.teal.light,
            fontWeight: 700,
            animation: "fade-in 0.4s ease",
          }}
        >
          ✓ Selected:{" "}
          <strong style={{ color: palette.gold.main }}>
            {sel?.toUpperCase()}
          </strong>
        </p>
      )}
    </div>
  );
}

// ────── CATEGORIES ──────
function Categories() {
  const { isDark } = useTheme();

  const items = [
    {
      img: IMG.clothesMen,
      label: "Men's Fashion",
      desc: "Agbada, shirts, suits",
    },
    {
      img: IMG.clothesWomen,
      label: "Women's Fashion",
      desc: "Dresses, blouses, skirts",
    },
    {
      img: IMG.shoes,
      label: "Shoes & Footwear",
      desc: "All styles, all genders",
    },
    { img: IMG.wigs, label: "Wigs & Hair", desc: "Human hair & synthetics" },
    { img: IMG.bags, label: "Bags & Purses", desc: "Leather & designer" },
    {
      img: IMG.fabric,
      label: "Fabrics & Textiles",
      desc: "Ankara, lace, aso-oke",
    },
    { img: IMG.vendor2, label: "Verified Vendors", desc: "Trusted sellers" },
    { img: IMG.riderBike, label: "Fast Delivery", desc: "30 min – 1 hour" },
    {
      img: IMG.perfume,
      label: "Perfume and Scents",
      desc: "Fragrances for every occasion",
    },
  ];

  return (
    <section
      id="categories"
      style={{
        padding: "90px 24px",
        position: "relative",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <h2
          style={{
            fontSize: "clamp(28px,4vw,52px)",
            fontWeight: 900,
            fontFamily: "'Playfair Display',serif",
            marginBottom: 16,
            textAlign: "center",
            letterSpacing: "-1px",
          }}
        >
          Fashion for Everyone
        </h2>
        <p
          style={{
            textAlign: "center",
            fontSize: 15.5,
            color: colors[isDark ? "dark" : "light"].textMuted,
            marginBottom: 48,
            maxWidth: 600,
            margin: "0 auto 48px",
            lineHeight: 1.8,
          }}
        >
          From Balogun to your door find everything you need.
        </p>

        <div
          className="cat-g"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4,1fr)",
            gap: 14,
          }}
        >
          {items.map((item, i) => (
            <div
              key={i}
              className="cat-tile"
              style={{
                borderRadius: 16,
                overflow: "hidden",
                position: "relative",
                aspectRatio: "1",
                cursor: "default",
                transition: "transform 0.35s cubic-bezier(0.34,1.56,0.64,1)",
                willChange: "transform",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "rgba(0,0,0,0.02)",
              }}
            >
              <Image
                src={item.img}
                alt={item.label}
                fill
                sizes="(max-width: 600px) 50vw, (max-width: 960px) 25vw, 275px"
                style={{ objectFit: "contain", objectPosition: "center" }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: isDark
                    ? "linear-gradient(to top,rgba(5,12,11,0.97) 0%,rgba(5,12,11,0.06) 55%)"
                    : "linear-gradient(to top,rgba(248,253,251,0.94) 0%,rgba(248,253,251,0.04) 55%)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: 12,
                  left: 13,
                  right: 13,
                }}
              >
                <p
                  style={{
                    fontSize: 13.5,
                    fontWeight: 800,
                    marginBottom: 3,
                    letterSpacing: "-0.3px",
                  }}
                >
                  {item.label}
                </p>
                <p
                  style={{
                    fontSize: 11.5,
                    color: colors[isDark ? "dark" : "light"].textMuted2,
                  }}
                >
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ────── HOW IT WORKS ──────
function HowItWorks() {
  const { isDark } = useTheme();
  const c = colors[isDark ? "dark" : "light"];

  const steps = [
    {
      num: "01",
      icon: "🛍",
      title: "Browse & Buy",
      desc: "Discover thousands of fashion items from Nigeria's top markets.",
      img: IMG.couple,
      accent: palette.teal.lighter,
    },
    {
      num: "02",
      icon: "🏪",
      title: "Vendors Post & Sell",
      desc: "List collections and reach thousands of buyers nationwide.",
      img: IMG.vendor2,
      accent: palette.gold.light,
    },
    {
      num: "03",
      icon: "🛵",
      title: "Riders Pick & Deliver",
      desc: "Fast, reliable delivery tracked in real-time to your door.",
      img: IMG.riderBike,
      accent: palette.rust.light,
    },
  ];

  return (
    <section
      id="how-it-works"
      style={{
        padding: "90px 24px",
        position: "relative",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <h2
          style={{
            fontSize: "clamp(28px,4vw,52px)",
            fontWeight: 900,
            fontFamily: "'Playfair Display',serif",
            marginBottom: 44,
            textAlign: "center",
            letterSpacing: "-1px",
          }}
        >
          From Discovery to Doorstep
        </h2>

        <div
          className="steps-g"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3,1fr)",
            gap: 20,
          }}
        >
          {steps.map((step) => (
            <div
              key={step.num}
              className="step-card"
              style={{
                borderRadius: 22,
                overflow: "hidden",
                border: `1.5px solid ${c.border}`,
                background: isDark ? c.bgAlt2 : c.bgAlt,
                transition: "all 0.35s ease",
              }}
              onMouseEnter={(e: MouseEvent<HTMLElement>) => {
                e.currentTarget.style.transform = "translateY(-8px)";
                e.currentTarget.style.borderColor = step.accent;
              }}
              onMouseLeave={(e: MouseEvent<HTMLElement>) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.borderColor = c.border;
              }}
            >
              <div
                style={{
                  height: 180,
                  overflow: "hidden",
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "rgba(0,0,0,0.02)",
                }}
              >
                <Image
                  src={step.img}
                  alt={step.title}
                  fill
                  sizes="(max-width: 960px) 100vw, 33vw"
                  style={{
                    objectFit: "contain",
                    objectPosition: "center",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: isDark
                      ? "linear-gradient(to top,rgba(5,12,11,0.95) 0%,rgba(5,12,11,0.2) 65%)"
                      : "linear-gradient(to top,rgba(248,253,251,0.93) 0%,rgba(248,253,251,0.1) 65%)",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    top: 12,
                    right: 14,
                    fontSize: 56,
                    fontWeight: 900,
                    color: "rgba(255,255,255,0.08)",
                    lineHeight: 1,
                  }}
                >
                  {step.num}
                </div>
                <div
                  style={{
                    position: "absolute",
                    bottom: 11,
                    left: 13,
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: isDark ? "rgba(5,12,11,0.85)" : c.bg,
                    border: `1.5px solid ${c.borderLight}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 20,
                  }}
                >
                  {step.icon}
                </div>
              </div>
              <div style={{ padding: "20px 22px 24px" }}>
                <h3
                  style={{
                    fontSize: 17,
                    fontWeight: 900,
                    fontFamily: "'Playfair Display',serif",
                    marginBottom: 10,
                    color: step.accent,
                  }}
                >
                  {step.title}
                </h3>
                <p
                  style={{
                    fontSize: 13.5,
                    color: c.textMuted,
                    lineHeight: 1.75,
                  }}
                >
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ────── TRUST SECTION ──────
function Trust() {
  const { isDark } = useTheme();
  const c = colors[isDark ? "dark" : "light"];

  const features = [
    {
      icon: "🔒",
      title: "Escrow Payments",
      desc: "Money held safely until delivery confirmed.",
    },
    {
      icon: "✅",
      title: "Verified Vendors",
      desc: "Every seller passes strict verification.",
    },
    {
      icon: "🛡",
      title: "Buyer Protection",
      desc: "Items guaranteed as described.",
    },
    { icon: "⚡", title: "Fast Refunds", desc: "Refunds within 24–48 hours." },
    {
      icon: "📱",
      title: "Live Tracking",
      desc: "Track your rider in real-time.",
    },
    {
      icon: "🌍",
      title: "Built for Africa",
      desc: "Designed for Nigerian markets.",
    },
    { icon: "🚀", title: "Premium App", desc: "Fast, smooth, glitch-free." },
    {
      icon: "💬",
      title: "24/7 Support",
      desc: "Help via app, WhatsApp, or email.",
    },
  ];

  return (
    <section id="trust" style={{ padding: "90px 24px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <h2
          style={{
            fontSize: "clamp(28px,4vw,52px)",
            fontWeight: 900,
            fontFamily: "'Playfair Display',serif",
            marginBottom: 44,
            textAlign: "center",
            letterSpacing: "-1px",
          }}
        >
          Your Safety, Our Priority
        </h2>

        <div
          className="trust-g"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4,1fr)",
            gap: 16,
          }}
        >
          {features.map((f, i) => (
            <div
              key={i}
              className="trust-card"
              style={{
                padding: 22,
                borderRadius: 18,
                border: `1.5px solid ${c.border}`,
                background: isDark ? c.bgAlt2 : c.bgAlt,
                transition: "all 0.3s ease",
                cursor: "default",
              }}
              onMouseEnter={(e: MouseEvent<HTMLElement>) => {
                e.currentTarget.style.transform = "translateY(-6px)";
                e.currentTarget.style.borderColor = palette.teal.light;
              }}
              onMouseLeave={(e: MouseEvent<HTMLElement>) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.borderColor = c.border;
              }}
            >
              <div style={{ fontSize: 26, marginBottom: 12 }}>{f.icon}</div>
              <h3
                style={{
                  fontSize: 14,
                  fontWeight: 800,
                  marginBottom: 8,
                  letterSpacing: "-0.3px",
                }}
              >
                {f.title}
              </h3>
              <p
                style={{
                  fontSize: 13,
                  color: c.textMuted,
                  lineHeight: 1.72,
                }}
              >
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ────── FAQ ──────
function FAQ() {
  const { isDark } = useTheme();
  const c = colors[isDark ? "dark" : "light"];
  const [open, setOpen] = useState<number | null>(null);

  const items = [
    {
      q: "What is O-Fash Markett?",
      a: "It's the digital twin of Africa's fashion markets. Balogun, Onitsha, Dutse — all in one app. Access multiple vendors, shop items, and get delivery in hours.",
    },
    {
      q: "Is registration really free?",
      a: "Yes! 100% free to join as a buyer, vendor, or rider. No hidden charges. Only transaction fees apply when you make a sale.",
    },
    {
      q: "How are vendors verified?",
      a: "Every vendor passes strict onboarding checks before listing products. Only verified sellers appear on the platform.",
    },
    {
      q: "How long does delivery take?",
      a: "30 minutes to 5 hours depending on vendor location and rider availability. We're constantly optimizing.",
    },
    {
      q: "Is my payment safe?",
      a: "Absolutely. We hold payments in escrow until delivery is confirmed. Your money is always protected.",
    },
    {
      q: "What if I'm not happy with my order?",
      a: "No problem. Items can be returned if not as described. Refunds processed within 24–48 hours.",
    },
  ];

  return (
    <section id="faq" style={{ padding: "90px 24px" }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <h2
          style={{
            fontSize: "clamp(28px,4vw,52px)",
            fontWeight: 900,
            fontFamily: "'Playfair Display',serif",
            marginBottom: 44,
            textAlign: "center",
            letterSpacing: "-1px",
          }}
        >
          Frequently Asked
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {items.map((item, i) => (
            <div
              key={i}
              className="faq-item"
              style={{
                borderRadius: 14,
                overflow: "hidden",
                border: `1px solid ${c.border}`,
                background: isDark ? c.bgAlt2 : c.bgAlt,
                transition: "all 0.3s ease",
              }}
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                style={{
                  width: "100%",
                  padding: "18px 22px",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 16,
                  fontFamily: "'Sora',sans-serif",
                }}
              >
                <span
                  className="faq-q"
                  style={{
                    fontSize: 15,
                    fontWeight: 700,
                    textAlign: "left",
                    transition: "color 0.25s",
                  }}
                >
                  {item.q}
                </span>
                <span
                  style={{
                    fontSize: 22,
                    color: palette.gold.main,
                    flexShrink: 0,
                    transition: "transform 0.3s",
                    transform: open === i ? "rotate(45deg)" : "rotate(0deg)",
                    lineHeight: 1,
                  }}
                >
                  +
                </span>
              </button>
              {open === i && (
                <div
                  style={{
                    padding: "0 22px 18px",
                    animation: "slide-up 0.25s ease",
                  }}
                >
                  <p
                    style={{
                      fontSize: 14,
                      color: c.textMuted,
                      lineHeight: 1.8,
                    }}
                  >
                    {item.a}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ────── CONTACT FORM ──────
function ContactForm() {
  const { isDark } = useTheme();
  const c = colors[isDark ? "dark" : "light"];
  const [f, setF] = useState({ name: "", email: "", subject: "", msg: "" });
  const [sent, setSent] = useState(false);

  const set =
    (k: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setF((p) => ({ ...p, [k]: e.target.value }));

  const inSt: React.CSSProperties = {
    padding: "12px 16px",
    borderRadius: 11,
    border: `1.5px solid ${c.border}`,
    background: isDark ? "rgba(20,184,166,0.05)" : "rgba(13,148,136,0.04)",
    color: c.text,
    fontSize: 14.5,
    outline: "none",
    fontFamily: "'Sora',sans-serif",
    transition: "border-color 0.18s",
  };

  if (sent)
    return (
      <div style={{ textAlign: "center", padding: 30 }}>
        <div style={{ fontSize: 38, marginBottom: 11 }}>✅</div>
        <p
          style={{ color: palette.teal.lighter, fontWeight: 700, fontSize: 15 }}
        >
          Message sent!
        </p>
        <p
          style={{
            color: c.textMuted,
            fontSize: 13,
            marginTop: 7,
          }}
        >
          We&apos;ll get back to you within 24 hours.
        </p>
      </div>
    );

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
      }}
      style={{ display: "flex", flexDirection: "column", gap: 11 }}
    >
      <div
        className="cr2"
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 11 }}
      >
        <input
          style={inSt}
          value={f.name}
          onChange={set("name")}
          placeholder="Your name"
          required
          onFocus={(e) => {
            e.currentTarget.style.borderColor = palette.teal.light;
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = c.border;
          }}
        />
        <input
          style={inSt}
          value={f.email}
          onChange={set("email")}
          type="email"
          placeholder="Email address"
          required
          onFocus={(e) => {
            e.currentTarget.style.borderColor = palette.teal.light;
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = c.border;
          }}
        />
      </div>
      <input
        style={inSt}
        value={f.subject}
        onChange={set("subject")}
        placeholder="Subject"
        required
        onFocus={(e) => {
          e.currentTarget.style.borderColor = palette.teal.light;
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = c.border;
        }}
      />
      <textarea
        style={{ ...inSt, resize: "vertical", minHeight: 108 }}
        value={f.msg}
        onChange={set("msg")}
        placeholder="Tell us how we can help, or what features you'd love to see…"
        required
        onFocus={(e) => {
          e.currentTarget.style.borderColor = palette.teal.light;
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = c.border;
        }}
      />
      <button
        type="submit"
        style={{
          padding: "13px",
          borderRadius: 11,
          background: `linear-gradient(135deg,${palette.teal.light},${palette.green.vibrant})`,
          color: isDark ? colors.dark.bg : "#042e2a",
          fontWeight: 800,
          fontSize: 14.5,
          cursor: "pointer",
          border: "none",
          fontFamily: "'Sora',sans-serif",
        }}
      >
        Send Message →
      </button>
      <div style={{ display: "flex", gap: 17, flexWrap: "wrap", marginTop: 2 }}>
        {[
          { i: "📧", t: "contact@o-fashmarkett.com" },
          { i: "📍", t: "Lagos, Nigeria 🇳🇬" },
          { i: "⏱", t: "Replies within 24hrs" },
        ].map((x) => (
          <div
            key={x.t}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              fontSize: 11.5,
              color: c.textMuted2,
            }}
          >
            <span>{x.i}</span>
            <span>{x.t}</span>
          </div>
        ))}
      </div>
    </form>
  );
}

// ────── MODALS ──────
const MODALS: Record<
  "privacy" | "terms" | "cookies" | "about",
  { title: string; body: React.ReactNode }
> = {
  about: {
    title: "About O-Fash Markett",
    body: (
      <>
        {[
          {
            h: "Who We Are",
            p: "O-Fash Markett is the digital branch of Africa's vibrant fashion market. We are not another fashion store or logistics company. We are building an app that serves as the structure between the market, the customer, and the delivery channel — all activities happening simultaneously in one app.",
          },
          {
            h: "Our Mission",
            p: "We connect buyers, sellers, and riders within one seamless ecosystem, making local fashion markets more accessible with just one click. It's the same feeling as teleporting to the physical market.",
          },
          {
            h: "Our Vision",
            p: "Our vision is to create a future where every fashion item available in the local market can also be found at O-Fash Markett. We believe the traditional African market is a cultural treasure worth preserving, so our goal is not to replace it, but to expand it through technology.",
          },
          {
            h: "How It Works",
            p: "With O-Fash Markett, buyers can easily discover vendors, sellers gain greater visibility beyond algorithm reach, and riders access more delivery opportunities. We believe e-commerce works best when everyone wins.",
          },
        ].map((s) => (
          <div key={s.h}>
            <h2
              style={{
                fontSize: 14,
                fontWeight: 800,
                color: palette.teal.lighter,
                marginBottom: 5,
                marginTop: 20,
              }}
            >
              {s.h}
            </h2>
            <p
              style={{
                fontSize: 13,
                color: "rgba(220,250,245,0.54)",
                lineHeight: 1.8,
              }}
            >
              {s.p}
            </p>
          </div>
        ))}
      </>
    ),
  },
  privacy: {
    title: "Privacy Policy",
    body: (
      <>
        {[
          {
            h: "1. Information We Collect",
            p: "We collect the following information when you use O-Fash Markett: full name, email address, phone number, delivery address, payment and transaction details, location information, account and order history, communications between users vendors and riders, and business registration information for onboarding and verifying sellers.",
          },
          {
            h: "2. How We Use Your Information",
            p: "We use your information to process orders and deliveries, connect buyers, sellers, and riders, improve platform performance and user experience, provide customer support, send important updates and notifications, maintain platform safety and prevent fraudulent activity, and analyze and personalize your user experience.",
          },
          {
            h: "3. Sharing Your Information",
            p: "O-Fash Markett does not sell users' personal information. We may share limited information with vendors and riders to fulfil orders, escrow payment service providers for secure transactions, and service providers supporting our platform operation.",
          },
          {
            h: "4. Data Protection",
            p: "We implement reasonable security measures to protect user information from unauthorized access, loss, misuse, or alteration. Payment details are handled by certified payment processors, and O-Fash Markett holds funds in escrow without storing full card details on our servers.",
          },
          {
            h: "5. Cookies and Tracking",
            p: "We may use cookies and similar technologies to improve functionality, analyze usage, and personalize your user experience. You may control or disable cookies through your browser or device settings, though this may affect platform functionality.",
          },
          {
            h: "6. WhatsApp Communications",
            p: "If you provide your WhatsApp number, we will only use it to send launch updates and critical order notifications. You can opt out at any time by replying STOP.",
          },
          {
            h: "7. User Rights",
            p: "You have the right to access your personal information, request corrections to inaccurate data, and request account deletion subject to legal and operational requirements. Contact us at contact@o-fashmarkett.com for any such requests.",
          },
          {
            h: "8. Third-Party Services",
            p: "Some of our functionality may rely on trusted third-party services. These third parties may collect limited information in accordance with their own privacy policies.",
          },
          {
            h: "9. Changes to This Policy",
            p: "We may update this Privacy Policy from time to time. Continued use of the platform after updates means acceptance of the revised policy.",
          },
          {
            h: "10. Contact Us",
            p: "For questions or concerns regarding this Privacy Policy, contact O-Fash Markett at contact@o-fashmarkett.com or through our official communication channels.",
          },
        ].map((s) => (
          <div key={s.h}>
            <h2
              style={{
                fontSize: 14,
                fontWeight: 800,
                color: palette.teal.lighter,
                marginBottom: 5,
                marginTop: 20,
              }}
            >
              {s.h}
            </h2>
            <p
              style={{
                fontSize: 13,
                color: "rgba(220,250,245,0.54)",
                lineHeight: 1.8,
              }}
            >
              {s.p}
            </p>
          </div>
        ))}
      </>
    ),
  },
  terms: {
    title: "Terms of Service",
    body: (
      <>
        {[
          {
            h: "1. Acceptance of Terms",
            p: "By accessing or using O-Fash Markett, you agree to comply with and be bound by these Terms of Service.",
          },
          {
            h: "2. About O-Fash Markett",
            p: "O-Fash Markett is a digital marketplace that connects buyers, fashion vendors, and riders within the African fashion ecosystem. Our platform helps facilitate fashion discovery, transactions, and delivery services.",
          },
          {
            h: "3. User Accounts",
            p: "You may be required to create an account to access the platform. By creating an account, you agree to provide accurate and complete information, keep your login credentials secure, and accept responsibility for activities carried out under your account. O-Fash Markett reserves the right to suspend or terminate accounts that provide false information or violate these terms.",
          },
          {
            h: "4. Eligibility",
            p: "You must be at least 18 years old to use O-Fash Markett and have the legal capacity to enter this agreement.",
          },
          {
            h: "5. Marketplace Activities",
            p: "You agree to use the platform lawfully and respectfully. You must not sell counterfeit, illegal, damaged or prohibited items; engage in fraudulent transactions; impersonate another person or business; interfere with platform operations; use the platform for harmful or abusive conduct; or fault the policies of the platform.",
          },
          {
            h: "6. Escrow Payment System",
            p: "All buyer payments are held in escrow until the buyer confirms satisfactory delivery. Funds are released to vendors only after confirmation. Payments must follow approved payment processes.",
          },
          {
            h: "7. Vendor Responsibilities",
            p: "Vendors are responsible for providing accurate product descriptions and pricing, ensuring products meet expected quality standards, and fulfilling orders in a timely manner. O-Fash Markett may suspend vendors or listings that violate platform standards after consistent warnings.",
          },
          {
            h: "8. Rider Responsibilities",
            p: "Riders are responsible for handling deliveries professionally and safely, providing accurate delivery updates, and protecting customer orders during transit. Riders are independent contractors.",
          },
          {
            h: "9. Transactions and Dispute Resolution",
            p: "O-Fash Markett is bound to facilitate transactions but is not responsible for disputes arising directly between buyers, vendors, or riders beyond reasonable platform support efforts. However, we will deploy all means and effort to ensure good conflict resolution.",
          },
          {
            h: "10. Intellectual Property",
            p: "All platform content including the O-Fash Markett name, logo, designs, text, and digital materials are the intellectual property of O-Fash Markett and may not be copied or used without permission.",
          },
          {
            h: "11. Limitation of Liability",
            p: "O-Fash Markett provides the platform 'as available' and does not guarantee uninterrupted or error-free service. We are not liable for delays in delivery, vendor product issues, losses resulting from user misconduct, or technical interruptions beyond reasonable control.",
          },
          {
            h: "12. Suspension and Termination",
            p: "O-Fash Markett reserves the right to suspend or terminate user access at any time if these Terms are violated. Users may appeal suspension decisions by contacting support.",
          },
          {
            h: "13. Changes to Terms",
            p: "We may update these Terms of Service periodically. Continued use of the platform after updates constitutes acceptance of the revised terms.",
          },
          {
            h: "14. Governing Law",
            p: "These terms are governed by the laws of the Federal Republic of Nigeria. Disputes are resolved through binding arbitration in Lagos, Nigeria.",
          },
          {
            h: "15. Contact Information",
            p: "For questions regarding these Terms of Service, contact O-Fash Markett at contact@o-fashmarkett.com through official communication channels.",
          },
        ].map((s) => (
          <div key={s.h}>
            <h2
              style={{
                fontSize: 14,
                fontWeight: 800,
                color: palette.teal.lighter,
                marginBottom: 5,
                marginTop: 20,
              }}
            >
              {s.h}
            </h2>
            <p
              style={{
                fontSize: 13,
                color: "rgba(220,250,245,0.54)",
                lineHeight: 1.8,
              }}
            >
              {s.p}
            </p>
          </div>
        ))}
      </>
    ),
  },
  cookies: {
    title: "Cookie Policy",
    body: (
      <>
        {[
          {
            h: "1. Introduction",
            p: "This Cookie Policy explains how O-Fash Markett uses cookies and similar technologies when users access our website or platform. By continuing to use O-Fash Markett, you agree to the use of cookies as described in this policy.",
          },
          {
            h: "2. What Are Cookies?",
            p: "Cookies are small data files stored on your device when you visit a website or use an application. They help improve functionality, remember preferences, and enhance user experience.",
          },
          {
            h: "3. How We Use Cookies",
            p: "O-Fash Markett may use cookies to keep you signed into your accounts, remember user preferences and settings, improve platform performance and functionality, analyze platform traffic and usage patterns, support search navigation and recommendations, and enhance security and prevent fraudulent activity.",
          },
          {
            h: "4. Essential Cookies",
            p: "These cookies are necessary for the platform to function properly, including login, navigation, and security features. They are critical to platform operation.",
          },
          {
            h: "5. Performance and Analytics Cookies",
            p: "These cookies help us understand how users interact with the platform so we can improve performance and user experience. They collect data about how you use our services.",
          },
          {
            h: "6. Functional Cookies",
            p: "These cookies remember user preferences such as language, location, and personalized settings, allowing us to provide a more tailored experience.",
          },
          {
            h: "7. Third-Party Services",
            p: "Some cookies may be provided by trusted third-party services used for analytics, payment processing, or platform functionality. These third parties may collect limited information in accordance with their own privacy policies.",
          },
          {
            h: "8. Managing Cookies",
            p: "You can control or disable cookies through your browser or device settings. However, disabling certain cookies may affect platform functionality and user experience. Most browsers allow you to refuse cookies or alert you when cookies are being sent.",
          },
          {
            h: "9. Updates to This Policy",
            p: "O-Fash Markett may update this Cookie Policy from time to time. Continued use of the platform after updates means acceptance of the revised policy.",
          },
          {
            h: "10. Contact Us",
            p: "For questions regarding this Cookie Policy, contact O-Fash Markett at contact@o-fashmarkett.com through official communication channels.",
          },
        ].map((s) => (
          <div key={s.h}>
            <h2
              style={{
                fontSize: 14,
                fontWeight: 800,
                color: palette.teal.lighter,
                marginBottom: 5,
                marginTop: 20,
              }}
            >
              {s.h}
            </h2>
            <p
              style={{
                fontSize: 13,
                color: "rgba(220,250,245,0.54)",
                lineHeight: 1.8,
              }}
            >
              {s.p}
            </p>
          </div>
        ))}
      </>
    ),
  },
};

function Modal({ page, onClose }: { page: ModalPage; onClose: () => void }) {
  const { isDark } = useTheme();
  const c = colors[isDark ? "dark" : "light"];

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", h);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", h);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  if (!page) return null;
  const isContact = page === "contact";
  const content = isContact ? null : MODALS[page as "privacy" | "terms"];

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        background: isDark ? "rgba(5,12,11,0.92)" : "rgba(248,253,251,0.92)",
        backdropFilter: "blur(22px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        animation: "fade-in 0.2s ease",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="glass"
        style={{
          borderRadius: 23,
          width: "100%",
          maxWidth: 680,
          maxHeight: "88vh",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 40px 120px rgba(0,0,0,0.72)",
          animation: "slide-up 0.27s ease",
          background: isDark ? c.glass : c.glass,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "21px 29px 17px",
            borderBottom: `1px solid ${c.border}`,
            flexShrink: 0,
          }}
        >
          <h2
            style={{
              fontSize: 18.5,
              fontWeight: 900,
              fontFamily: "'Playfair Display',serif",
              color: c.text,
            }}
          >
            {isContact ? "Contact Us" : content!.title}
          </h2>
          <button
            className="modal-close"
            onClick={onClose}
            style={{
              width: 33,
              height: 33,
              borderRadius: 8,
              background: isDark
                ? "rgba(20,184,166,0.07)"
                : "rgba(13,148,136,0.07)",
              border: `1px solid ${c.border}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              fontSize: 13,
              color: c.textMuted2,
              transition: "background 0.18s",
            }}
          >
            ✕
          </button>
        </div>
        <div
          style={{
            padding: "23px 29px 32px",
            overflowY: "auto",
            flex: 1,
          }}
        >
          {isContact ? <ContactForm /> : content!.body}
        </div>
      </div>
    </div>
  );
}

// ────── INQUIRY BOX ──────
function InquiryBox() {
  const { isDark } = useTheme();
  const c = colors[isDark ? "dark" : "light"];
  const [val, setVal] = useState("");
  const [sent, setSent] = useState(false);

  if (sent)
    return (
      <p
        style={{
          color: palette.teal.lighter,
          fontWeight: 700,
          fontSize: 14,
          textAlign: "center",
          padding: "15px",
          background: isDark ? "rgba(13,148,136,0.1)" : "rgba(13,148,136,0.08)",
          borderRadius: 12,
          border: `1px solid ${palette.teal.light}`,
        }}
      >
        Thanks for sharing! We&apos;ve noted your suggestion. 🙏
      </p>
    );

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
      }}
      style={{ display: "flex", gap: 10, flexWrap: "wrap" }}
    >
      <textarea
        value={val}
        onChange={(e) => setVal(e.target.value)}
        required
        placeholder="Tell us what features you'd love, or any concerns. We have your best interest at heart…"
        style={{
          flex: 1,
          minWidth: 240,
          minHeight: 106,
          padding: "13px 16px",
          borderRadius: 12,
          border: `1.5px solid ${c.border}`,
          background: isDark
            ? "rgba(20,184,166,0.042)"
            : "rgba(13,148,136,0.04)",
          color: c.text,
          fontSize: 14,
          outline: "none",
          resize: "vertical",
          fontFamily: "'Sora',sans-serif",
          transition: "border-color 0.18s",
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = palette.teal.light;
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = c.border;
        }}
      />
      <button
        type="submit"
        style={{
          padding: "13px 23px",
          borderRadius: 12,
          background: `linear-gradient(135deg,${palette.teal.light},${palette.green.vibrant})`,
          color: isDark ? colors.dark.bg : "#042e2a",
          fontWeight: 800,
          fontSize: 14,
          cursor: "pointer",
          border: "none",
          alignSelf: "flex-end",
          fontFamily: "'Sora',sans-serif",
          boxShadow: `0 6px 20px rgba(13,148,136,0.3)`,
        }}
      >
        Submit →
      </button>
    </form>
  );
}

// ────── MARKET BANNER ──────
function MarketBanner() {
  return (
    <div style={{ position: "relative", height: 320, overflow: "hidden" }}>
      <Image
        src={IMG.marketScene}
        alt="African fashion market"
        fill
        sizes="100vw"
        style={{
          objectFit: "contain",
          objectPosition: "center",
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "0 24px",
          zIndex: 2,
        }}
      >
        <p
          style={{
            fontSize: 12,
            fontWeight: 800,
            letterSpacing: "0.16em",
            color: palette.gold.light,
            textTransform: "uppercase",
            marginBottom: 10,
          }}
        >
          Inspired by Real Markets
        </p>
        <h2
          style={{
            fontFamily: "'Playfair Display',serif",
            fontSize: "clamp(24px,3.5vw,44px)",
            fontWeight: 900,
            letterSpacing: "-1.5px",
            lineHeight: 1.15,
            maxWidth: 700,
            color: "#edfaf7",
          }}
        >
          The Digital Twin of Africa&apos;s Fashion Markets
        </h2>
      </div>
    </div>
  );
}

// ────── FOOTER ──────
function Footer({ onLinkClick }: { onLinkClick: (page: ModalPage) => void }) {
  const { isDark } = useTheme();
  const c = colors[isDark ? "dark" : "light"];

  const socials = [
    { icon: Share2, label: "Share" },
    { icon: Globe, label: "Web" },
    { icon: AtSign, label: "Contact" },
    { icon: Video, label: "Video" },
  ];

  return (
    <footer
      style={{
        padding: "54px 48px 32px",
        borderTop: `1px solid ${c.border}`,
        background: isDark ? "rgba(3,6,5,0.97)" : "rgba(240,248,246,0.97)",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div
          className="footer-g"
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr 1fr",
            gap: 48,
            marginBottom: 40,
          }}
        >
          <div>
            <OFashLogo size={42} textSize={16} dark={isDark} />
            <p
              style={{
                fontSize: 13.5,
                color: c.textMuted,
                lineHeight: 1.82,
                marginTop: 14,
                maxWidth: 270,
              }}
            >
              Africa&apos;s premier fashion marketplace connecting buyers,
              vendors, and riders.
            </p>
            <p
              style={{
                fontSize: 11.5,
                color: palette.teal.lighter,
                marginTop: 8,
                fontWeight: 700,
              }}
            >
              🚀 Launching soon in Lagos · Expanding rapidly
            </p>
            <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
              {socials.map(({ icon: Icon, label }) => (
                <button
                  key={label}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    background: isDark
                      ? "rgba(20,184,166,0.08)"
                      : "rgba(13,148,136,0.08)",
                    border: `1px solid ${c.border}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    transition: "all 0.25s",
                    color: palette.teal.light,
                  }}
                  title={label}
                  onMouseEnter={(e: MouseEvent<HTMLElement>) => {
                    e.currentTarget.style.background = isDark
                      ? "rgba(20,184,166,0.15)"
                      : "rgba(13,148,136,0.15)";
                  }}
                  onMouseLeave={(e: MouseEvent<HTMLElement>) => {
                    e.currentTarget.style.background = isDark
                      ? "rgba(20,184,166,0.08)"
                      : "rgba(13,148,136,0.08)";
                  }}
                >
                  <Icon size={18} />
                </button>
              ))}
            </div>
          </div>

          {[
            {
              title: "Company",
              links: [["About Us"], ["Careers"], ["Blog"], ["Press"]],
            },
            {
              title: "Support",
              links: [
                ["Help Centre"],
                ["Contact", "contact"],
                ["Vendor Help"],
                ["Rider Help"],
              ],
            },
            {
              title: "Legal",
              links: [
                ["Privacy", "privacy"],
                ["Terms", "terms"],
                ["Cookies"],
                ["Vendor Agreement"],
              ],
            },
          ].map((col) => (
            <div key={col.title}>
              <p
                style={{
                  fontSize: 11,
                  fontWeight: 800,
                  letterSpacing: "0.16em",
                  color: c.textMuted2,
                  textTransform: "uppercase",
                  marginBottom: 16,
                }}
              >
                {col.title}
              </p>
              <div
                style={{ display: "flex", flexDirection: "column", gap: 11 }}
              >
                {col.links.map(([label, page]) => (
                  <button
                    key={label}
                    onClick={() => {
                      if (page) onLinkClick(page as ModalPage);
                    }}
                    style={{
                      background: "none",
                      border: "none",
                      padding: 0,
                      fontSize: 13.5,
                      color: c.textMuted,
                      cursor: "pointer",
                      textAlign: "left",
                      transition: "color 0.25s",
                      fontFamily: "'Sora',sans-serif",
                    }}
                    onMouseEnter={(e: MouseEvent<HTMLElement>) => {
                      e.currentTarget.style.color = palette.teal.lighter;
                    }}
                    onMouseLeave={(e: MouseEvent<HTMLElement>) => {
                      e.currentTarget.style.color = c.textMuted;
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            paddingTop: 24,
            borderTop: `1px solid ${c.border}`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          <p
            style={{
              fontSize: 12,
              color: c.textMuted2,
            }}
          >
            © {new Date().getFullYear()} O-Fash Markett. All rights reserved.
            Made in Nigeria 🇳🇬
          </p>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              fontSize: 12,
              color: c.textMuted2,
            }}
          >
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: palette.teal.light,
                display: "inline-block",
                animation: "pulse-dot 2s infinite",
              }}
            />
            All systems operational
          </div>
          <div style={{ display: "flex", gap: 15 }}>
            {[
              ["Privacy", "privacy"],
              ["Terms", "terms"],
              ["Contact", "contact"],
            ].map(([label, page]) => (
              <button
                key={label}
                onClick={() => onLinkClick(page as ModalPage)}
                style={{
                  background: "none",
                  border: "none",
                  padding: 0,
                  fontSize: 11.5,
                  color: c.textMuted2,
                  cursor: "pointer",
                  transition: "color 0.25s",
                  fontFamily: "'Sora',sans-serif",
                }}
                onMouseEnter={(e: MouseEvent<HTMLElement>) => {
                  e.currentTarget.style.color = palette.teal.lighter;
                }}
                onMouseLeave={(e: MouseEvent<HTMLElement>) => {
                  e.currentTarget.style.color = c.textMuted2;
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

// ────── WAITLIST PAGE ──────
function WaitlistPage({ onBack }: { onBack: () => void }) {
  const { isDark } = useTheme();
  const c = colors[isDark ? "dark" : "light"];
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email.includes("@")) {
      setError("Please enter a valid email.");
      return;
    }
    setStatus("loading");
    setError("");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.toLowerCase(), whatsapp, role }),
      });
      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setError(data.error || "Something went wrong. Please try again.");
        return;
      }
      setStatus("success");
      setEmail("");
      setWhatsapp("");
      setRole("");
    } catch {
      setStatus("error");
      setError("Network error — please check your connection.");
    }
  };

  if (status === "success") {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
          textAlign: "center",
          marginTop: 60,
        }}
      >
        <div
          style={{
            fontSize: 72,
            marginBottom: 20,
            animation: "float-y 2.4s ease-in-out infinite",
          }}
        >
          🎉
        </div>
        <h1
          style={{
            fontSize: "clamp(32px,5vw,56px)",
            fontFamily: "'Playfair Display',serif",
            fontWeight: 900,
            marginBottom: 14,
            color: palette.teal.lighter,
          }}
        >
          You&apos;re on the list!
        </h1>
        <p
          style={{
            fontSize: 16,
            color: c.textMuted,
            maxWidth: 500,
            lineHeight: 1.8,
            marginBottom: 32,
          }}
        >
          Check your inbox for a confirmation email. We&apos;ll notify you the
          moment we launch in Lagos.
        </p>
        <button
          onClick={onBack}
          style={{
            padding: "14px 32px",
            borderRadius: 12,
            background: `linear-gradient(135deg,${palette.teal.light},${palette.green.vibrant})`,
            color: isDark ? colors.dark.bg : "#042e2a",
            fontWeight: 800,
            fontSize: 15,
            cursor: "pointer",
            border: "none",
            fontFamily: "'Sora',sans-serif",
            boxShadow: `0 8px 24px rgba(13,148,136,0.3)`,
            transition: "all 0.25s",
          }}
          onMouseEnter={(e: MouseEvent<HTMLElement>) => {
            e.currentTarget.style.transform = "translateY(-2px)";
          }}
          onMouseLeave={(e: MouseEvent<HTMLElement>) => {
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        marginTop: 60,
      }}
    >
      <div style={{ maxWidth: 600, width: "100%" }}>
        <button
          onClick={onBack}
          style={{
            background: "none",
            border: "none",
            padding: 0,
            cursor: "pointer",
            fontSize: 14,
            color: palette.teal.lighter,
            fontWeight: 700,
            marginBottom: 32,
            fontFamily: "'Sora',sans-serif",
          }}
        >
          ← Back
        </button>

        <h1
          style={{
            fontSize: "clamp(36px,6vw,64px)",
            fontFamily: "'Playfair Display',serif",
            fontWeight: 900,
            letterSpacing: "-1.5px",
            marginBottom: 12,
            lineHeight: 1.1,
          }}
        >
          Be First. Join the Waitlist.
        </h1>

        <p
          style={{
            fontSize: 16,
            color: c.textMuted,
            marginBottom: 40,
            lineHeight: 1.8,
          }}
        >
          Registration is FREE. Founding members get exclusive early access and
          special perks when we launch.
        </p>

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: 16 }}
        >
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {["buyer", "vendor", "rider"].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(role === r ? "" : r)}
                style={{
                  padding: "8px 18px",
                  borderRadius: 100,
                  fontSize: 13,
                  fontWeight: 700,
                  fontFamily: "'Sora',sans-serif",
                  cursor: "pointer",
                  background:
                    role === r
                      ? "rgba(13,148,136,0.2)"
                      : "rgba(13,148,136,0.08)",
                  border: `1.5px solid ${role === r ? palette.teal.light : c.border}`,
                  color: role === r ? palette.teal.lighter : c.textMuted2,
                  transition: "all 0.25s",
                }}
              >
                {r === "buyer"
                  ? "🛍 Buyer"
                  : r === "vendor"
                    ? "🏪 Vendor"
                    : "🛵 Rider"}
              </button>
            ))}
          </div>

          <input
            type="email"
            placeholder="Your email address *"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              padding: "14px 16px",
              borderRadius: 12,
              border: `1.5px solid ${c.border}`,
              background: isDark ? c.bgAlt : c.bgAlt2,
              color: c.text,
              fontSize: 14.5,
              outline: "none",
              fontFamily: "'Sora',sans-serif",
              transition: "border-color 0.25s",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = palette.teal.light;
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = c.border;
            }}
          />

          <input
            type="tel"
            placeholder="WhatsApp number (optional)"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            style={{
              padding: "14px 16px",
              borderRadius: 12,
              border: `1.5px solid ${c.border}`,
              background: isDark ? c.bgAlt : c.bgAlt2,
              color: c.text,
              fontSize: 14.5,
              outline: "none",
              fontFamily: "'Sora',sans-serif",
              transition: "border-color 0.25s",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = palette.teal.light;
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = c.border;
            }}
          />

          {error && (
            <div
              style={{
                padding: "12px 14px",
                borderRadius: 10,
                background: "rgba(196,67,10,0.1)",
                border: `1px solid ${palette.rust.main}`,
                color: palette.rust.light,
                fontSize: 13,
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={status === "loading"}
            style={{
              padding: "16px 24px",
              borderRadius: 12,
              background: `linear-gradient(135deg,${palette.teal.light},${palette.green.vibrant})`,
              color: isDark ? colors.dark.bg : "#042e2a",
              fontWeight: 900,
              fontSize: 15,
              cursor: status === "loading" ? "not-allowed" : "pointer",
              border: "none",
              fontFamily: "'Sora',sans-serif",
              boxShadow: `0 10px 32px rgba(13,148,136,0.35)`,
              transition: "all 0.25s",
              opacity: status === "loading" ? 0.7 : 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            {status === "loading" ? (
              <>
                <span style={{ animation: "pulse-dot 1.5s infinite" }}>⏳</span>{" "}
                Reserving…
              </>
            ) : (
              <>
                Reserve Your Spot <ArrowRight size={16} />
              </>
            )}
          </button>

          <p
            style={{
              fontSize: 12,
              color: c.textMuted2,
              textAlign: "center",
              marginTop: 12,
            }}
          >
            🔒 No spam · 🚀 Early access · 🎁 Founding perks
          </p>
        </form>
      </div>
    </div>
  );
}

// ────── HERO SECTION ──────
function Hero({ onWaitlistClick }: { onWaitlistClick: () => void }) {
  const { isDark } = useTheme();
  const c = colors[isDark ? "dark" : "light"];

  return (
    <section
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "180px 24px 100px",
        position: "relative",
        overflow: "hidden",
        marginTop: 60,
      }}
    >
      <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
        <Image
          src={IMG.heroMarket}
          alt=""
          fill
          sizes="100vw"
          style={{
            objectFit: "contain",
            objectPosition: "center",
            opacity: isDark ? 0.08 : 0.05,
            filter: "sepia(12%) saturate(120%)",
          }}
          priority
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: isDark
              ? "linear-gradient(to bottom,rgba(5,12,11,0.3) 0%,rgba(5,12,11,0.7) 50%,rgba(5,12,11,0.98) 100%)"
              : "linear-gradient(to bottom,rgba(248,253,251,0.2) 0%,rgba(248,253,251,0.5) 50%,rgba(248,253,251,0.95) 100%)",
          }}
        />
      </div>

      <BackgroundBeams />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 1000 }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 9,
            padding: "8px 18px",
            borderRadius: 100,
            background: isDark
              ? "rgba(20,184,166,0.1)"
              : "rgba(13,148,136,0.08)",
            border: `1.5px solid ${palette.teal.light}`,
            fontSize: 13,
            color: palette.teal.lighter,
            fontWeight: 700,
            marginBottom: 28,
            letterSpacing: "0.06em",
            backdropFilter: "blur(10px)",
            animation: "slide-up 0.5s ease",
          }}
        >
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: palette.teal.light,
              display: "inline-block",
              animation: "pulse-dot 2s infinite",
            }}
          />
          Launching Soon in Lagos · Expanding Across Africa
        </div>

        <h1
          style={{
            fontFamily: "'Playfair Display',serif",
            fontSize: "clamp(42px,7vw,92px)",
            fontWeight: 900,
            lineHeight: 1.08,
            letterSpacing: "-2px",
            marginBottom: 20,
            maxWidth: 1000,
            animation: "slide-up 0.6s 0.1s ease both",
          }}
        >
          Africa&apos;s Fashion Market,
          <span
            className="shimmer-text"
            style={{ display: "block", marginTop: 8 }}
          >
            Now One Click Away
          </span>
        </h1>

        <h2
          style={{
            fontSize: "clamp(16px,2.2vw,24px)",
            fontWeight: 600,
            color: c.textMuted,
            maxWidth: 620,
            margin: "0 auto 14px",
            lineHeight: 1.7,
            animation: "slide-up 0.6s 0.2s ease both",
          }}
        >
          Access Balogun, Onitsha, Dutse, and every fashion market without the
          hassle.
        </h2>

        <p
          style={{
            fontSize: "clamp(14px,1.6vw,18px)",
            color: c.textMuted2,
            maxWidth: 580,
            margin: "0 auto 16px",
            lineHeight: 1.8,
            animation: "slide-up 0.6s 0.28s ease both",
          }}
        >
          Get items delivered within hours. Register free. Zero stress, pure
          convenience.
        </p>

        <div
          style={{
            display: "flex",
            gap: 14,
            flexWrap: "wrap",
            justifyContent: "center",
            marginBottom: 60,
            animation: "slide-up 0.6s 0.38s ease both",
          }}
        >
          <button
            className="btn-primary"
            onClick={onWaitlistClick}
            style={{
              padding: "16px 36px",
              borderRadius: 14,
              background: `linear-gradient(135deg,${palette.teal.light},${palette.green.vibrant})`,
              color: isDark ? colors.dark.bg : "#042e2a",
              fontWeight: 900,
              fontSize: 16,
              cursor: "pointer",
              border: "none",
              fontFamily: "'Sora',sans-serif",
              boxShadow: `0 12px 40px rgba(13,148,136,0.4)`,
              transition: "transform 0.18s,box-shadow 0.3s",
              willChange: "transform",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            Join Waitlist <ArrowRight size={18} />
          </button>
          <button
            onClick={onWaitlistClick}
            style={{
              padding: "16px 32px",
              borderRadius: 14,
              background: isDark
                ? "rgba(245,158,11,0.12)"
                : "rgba(245,158,11,0.1)",
              color: palette.gold.light,
              fontWeight: 800,
              fontSize: 16,
              cursor: "pointer",
              border: `1.5px solid ${palette.gold.main}`,
              fontFamily: "'Sora',sans-serif",
              transition: "all 0.25s",
            }}
            onMouseEnter={(e: MouseEvent<HTMLElement>) => {
              e.currentTarget.style.background = isDark
                ? "rgba(245,158,11,0.2)"
                : "rgba(245,158,11,0.15)";
            }}
            onMouseLeave={(e: MouseEvent<HTMLElement>) => {
              e.currentTarget.style.background = isDark
                ? "rgba(245,158,11,0.12)"
                : "rgba(245,158,11,0.1)";
            }}
          >
            Reserve Spot
          </button>
        </div>

        <div
          style={{
            display: "flex",
            gap: 50,
            flexWrap: "wrap",
            justifyContent: "center",
            animation: "slide-up 0.6s 0.5s ease both",
          }}
        >
          {[
            { value: "500+", label: "Vendors Ready" },
            { value: "10K+", label: "Fashion Items" },
            { value: "150+", label: "Bike Riders" },
            { value: "FREE", label: "Registration" },
          ].map(({ value, label }) => (
            <div key={label} style={{ textAlign: "center" }}>
              <div
                style={{
                  fontSize: 32,
                  fontWeight: 900,
                  fontFamily: "'Playfair Display',serif",
                  background: `linear-gradient(135deg,${palette.teal.lighter},${palette.gold.light})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  letterSpacing: "-1px",
                }}
              >
                {value}
              </div>
              <div
                style={{
                  fontSize: 11.5,
                  color: c.textMuted2,
                  marginTop: 6,
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 32,
          right: 32,
          animation: "float-y 3.2s ease-in-out infinite",
          zIndex: 2,
        }}
      >
        <div
          style={{
            borderRadius: 14,
            padding: "13px 18px",
            display: "flex",
            alignItems: "center",
            gap: 11,
            background: isDark ? "rgba(6,95,88,0.15)" : "rgba(13,148,136,0.1)",
            border: `1px solid ${palette.teal.light}`,
            boxShadow: `0 8px 24px rgba(13,148,136,0.15)`,
          }}
        >
          <span style={{ fontSize: 22 }}>🚀</span>
          <div>
            <p
              style={{
                fontSize: 12,
                fontWeight: 800,
                color: palette.teal.lighter,
                margin: 0,
              }}
            >
              Launching Soon
            </p>
            <p style={{ fontSize: 11, color: c.textMuted2, margin: 0 }}>
              Be first notified
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ────── MAIN APP ──────
function OFashMarketLanding() {
  const [currentPage, setCurrentPage] = useState<"home" | "waitlist">("home");
  const [modal, setModal] = useState<ModalPage>(null);

  const handleWaitlistClick = () => {
    setCurrentPage("waitlist");
  };

  const handleBackHome = () => {
    setCurrentPage("home");
  };

  const openModal = useCallback((p: ModalPage) => setModal(p), []);
  const closeModal = useCallback(() => setModal(null), []);

  return (
    <ThemeProvider>
      <div style={{ margin: 0, padding: 0, overflowX: "hidden" }}>
        <GlobalStyles />
        <Spotlight />

        {currentPage === "home" ? (
          <>
            <Navigation onWaitlistClick={handleWaitlistClick} />
            {modal && <Modal page={modal} onClose={closeModal} />}
            <Hero onWaitlistClick={handleWaitlistClick} />
            <Marquee type="markets" />
            <MarketBanner />
            <Marquee type="goods" />
            <section
              id="who-we-serve"
              style={{ padding: "90px 24px", textAlign: "center" }}
            >
              <div style={{ maxWidth: 1100, margin: "0 auto" }}>
                <h2
                  style={{
                    fontSize: "clamp(28px,4vw,52px)",
                    fontWeight: 900,
                    fontFamily: "'Playfair Display',serif",
                    marginBottom: 12,
                    letterSpacing: "-1px",
                  }}
                >
                  For Everyone in the Fashion Chain
                </h2>
                <p
                  style={{
                    fontSize: 15.5,
                    color: colors.dark.textMuted,
                    maxWidth: 600,
                    margin: "0 auto 48px",
                    lineHeight: 1.8,
                  }}
                >
                  Buyers, Vendors, Riders — we&apos;ve built for all of you.
                </p>
                <RoleSelector onSelectRole={() => handleWaitlistClick()} />
              </div>
            </section>
            <Categories />
            <HowItWorks />
            <Trust />
            <FAQ />
            <section style={{ padding: "74px 24px" }}>
              <div style={{ maxWidth: 740, margin: "0 auto" }}>
                <p
                  style={{
                    fontSize: 12,
                    fontWeight: 800,
                    letterSpacing: "0.16em",
                    color: palette.teal.light,
                    textTransform: "uppercase",
                    marginBottom: 24,
                    textAlign: "center",
                  }}
                >
                  Your Voice Matters
                </p>
                <h2
                  style={{
                    fontSize: "clamp(28px,4vw,52px)",
                    fontWeight: 900,
                    fontFamily: "'Playfair Display',serif",
                    marginBottom: 11,
                    letterSpacing: "-1px",
                  }}
                >
                  Help us build what you need
                </h2>
                <p
                  style={{
                    fontSize: 15,
                    color: colors.dark.textMuted,
                    lineHeight: 1.8,
                    marginBottom: 24,
                  }}
                >
                  Tell us what features you&apos;d like us to add, or any
                  concerns. Life&apos;s already hard let us help make sale,
                  purchase and delivery easier for you.
                </p>
                <InquiryBox />
              </div>
            </section>
            <Footer onLinkClick={openModal} />
          </>
        ) : (
          <WaitlistPage onBack={handleBackHome} />
        )}
      </div>
    </ThemeProvider>
  );
}

export default OFashMarketLanding;
