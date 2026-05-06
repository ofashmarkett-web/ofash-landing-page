"use client";

import { useState, useEffect, useRef, useCallback } from "react";

type ModalPage = "privacy" | "terms" | "contact" | null;
type UserRole = "buyer" | "vendor" | "rider" | null;

// ─── UNSPLASH REAL IMAGES ─────────────────────────────────────────────────────
const IMG = {
  heroMarket:
    "https://images.unsplash.com/photo-1596449763009-f62fe48e7ed5?w=1600&q=80&fit=crop",
  clothesMen:
    "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=700&q=80&fit=crop",
  clothesWomen:
    "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=700&q=80&fit=crop",
  shoes:
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80&fit=crop",
  wigs: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&q=80&fit=crop",
  bags: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80&fit=crop",
  fabric:
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80&fit=crop",
  riderBike:
    "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&q=80&fit=crop",
  riderStreet:
    "https://images.unsplash.com/photo-1558618047-3df89b4d5bca?w=700&q=80&fit=crop",
  marketScene:
    "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&q=80&fit=crop",
  vendor1:
    "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=700&q=80&fit=crop",
  vendor2:
    "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&q=80&fit=crop",
  africanMan:
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&q=80&fit=crop&crop=face",
  africanWoman:
    "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=500&q=80&fit=crop&crop=face",
  market2:
    "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&q=80&fit=crop",
};

// ─── GLOBAL STYLES (TEAL-DOMINANT PALETTE) ───────────────────────────────────
function GlobalStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@300;400;500;600;700;800&display=swap');
      *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
      html{scroll-behavior:smooth;}
      body{background:#060e0d;overflow-x:hidden;}
      ::selection{background:rgba(20,184,166,0.32);}
      ::placeholder{color:rgba(220,250,245,0.28);}
      ::-webkit-scrollbar{width:5px;}
      ::-webkit-scrollbar-track{background:#060e0d;}
      ::-webkit-scrollbar-thumb{background:rgba(20,184,166,0.4);border-radius:3px;}

      :root{
        /* Primary teal spectrum */
        --t0:#042e2a;   /* deepest */
        --t1:#065f58;   /* deep teal */
        --t2:#0d9488;   /* brand teal */
        --t3:#14b8a6;   /* bright teal */
        --t4:#5eead4;   /* pale teal */
        --t5:#a7f3d0;   /* mint */
        /* Accent warm */
        --rust:#c4430a;
        --clay:#b87333;
        --amber:#e8a020;  /* warm accent replacing gold */
        /* Neutral */
        --dark:#060e0d;
        --dark2:#081412;
        --text:#e8f7f5;
        --text-d:rgba(220,250,245,0.55);
        --text-f:rgba(220,250,245,0.32);
        --border:rgba(20,184,166,0.18);
        --border-b:rgba(20,184,166,0.10);
      }

      @keyframes pulse2{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.4;transform:scale(.75)}}
      @keyframes fadeIn{from{opacity:0}to{opacity:1}}
      @keyframes slideUp{from{opacity:0;transform:translateY(32px) scale(.97)}to{opacity:1;transform:translateY(0) scale(1)}}
      @keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}
      @keyframes beamDown{0%{opacity:0;transform:scaleY(0) translateY(-100%)}20%{opacity:1}80%{opacity:1}100%{opacity:0;transform:scaleY(1) translateY(100%)}}
      @keyframes rotateBorder{to{--angle:360deg}}
      @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}

      @property --angle{syntax:'<angle>';initial-value:0deg;inherits:false;}
      .mborder{background:conic-gradient(from var(--angle),transparent 70%,var(--t3) 80%,var(--t4) 88%,var(--amber) 94%,transparent 100%);animation:rotateBorder 4s linear infinite;}

      .nav-link:hover{color:var(--t4) !important;}
      .nav-cta:hover{transform:translateY(-2px) !important;box-shadow:0 8px 32px rgba(20,184,166,0.55) !important;}
      .role-card:hover{transform:translateY(-8px) !important;border-color:var(--t3) !important;}
      .role-card.selected{border-color:var(--t3) !important;box-shadow:0 0 0 2px var(--t3),0 20px 60px rgba(20,184,166,0.22) !important;}
      .step-card:hover{transform:translateY(-5px) !important;border-color:rgba(20,184,166,0.35) !important;}
      .trust-card:hover{border-color:rgba(20,184,166,0.28) !important;transform:translateY(-3px) !important;}
      .cat-img:hover{transform:scale(1.04) !important;}
      .faq-item:hover .faq-q{color:var(--t4) !important;}
      .footer-link:hover{color:var(--t4) !important;}
      .social-btn:hover{background:rgba(20,184,166,0.14) !important;border-color:rgba(20,184,166,0.38) !important;}
      .modal-close:hover{background:rgba(20,184,166,0.14) !important;}
      .wl-btn:hover{transform:translateY(-2px) !important;box-shadow:0 12px 44px rgba(20,184,166,0.6) !important;}
      .wl-input:focus{border-color:rgba(20,184,166,0.65) !important;box-shadow:0 0 0 3px rgba(20,184,166,0.12) !important;}
      .ci:focus{border-color:rgba(20,184,166,0.55) !important;}

      @media(max-width:900px){
        .nav-ul{display:none !important;}
        .roles-g{grid-template-columns:1fr !important;}
        .hero-cols{flex-direction:column !important;}
        .rider-cols{flex-direction:column !important;}
        .footer-g{grid-template-columns:1fr 1fr !important;}
        .cat-g{grid-template-columns:repeat(2,1fr) !important;}
        .trust-g{grid-template-columns:repeat(2,1fr) !important;}
        .steps-g{grid-template-columns:1fr !important;}
      }
      @media(max-width:600px){
        .footer-g{grid-template-columns:1fr !important;}
        .trust-g{grid-template-columns:1fr !important;}
        .stats-r{gap:20px !important;}
        .cr{grid-template-columns:1fr !important;}
        .cat-g{grid-template-columns:repeat(2,1fr) !important;}
      }
    `}</style>
  );
}

// ─── LOGO ─────────────────────────────────────────────────────────────────────
function OFashLogo({
  size = 44,
  textSize = 19,
}: {
  size?: number;
  textSize?: number;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      {/* Logo image with subtle teal glow ring */}
      <div
        style={{
          width: size,
          height: size,
          flexShrink: 0,
          position: "relative",
          borderRadius: Math.round(size * 0.27),
          overflow: "hidden",
          boxShadow: `0 0 0 1.5px rgba(20,184,166,0.35), 0 4px ${Math.round(size * 0.45)}px rgba(13,148,136,0.30)`,
        }}
      >
        <img
          src="/logo.png"
          alt="O-Fash Markett logo"
          width={size}
          height={size}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />
      </div>

      {/* Wordmark */}
      <div>
        <div
          style={{
            fontSize: textSize,
            fontWeight: 900,
            fontFamily: "'Playfair Display',serif",
            background: "linear-gradient(90deg,#a7f3d0,#14b8a6,#0d9488)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            letterSpacing: "-0.5px",
            lineHeight: 1.1,
          }}
        >
          O-Fash Markett
        </div>
        <div
          style={{
            fontSize: 9,
            color: "rgba(220,250,245,0.38)",
            letterSpacing: "0.15em",
            textTransform: "uppercase" as const,
            fontWeight: 700,
            marginTop: 2,
          }}
        >
          Africa&apos;s Fashion Market
        </div>
      </div>
    </div>
  );
}

// ─── BACKGROUND BEAMS ─────────────────────────────────────────────────────────
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
          <radialGradient id="bg1" cx="35%" cy="45%" r="55%">
            <stop offset="0%" stopColor="#0d9488" stopOpacity="0.18" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="bg2" cx="80%" cy="25%" r="40%">
            <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.10" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="bg3" cx="55%" cy="85%" r="35%">
            <stop offset="0%" stopColor="#065f58" stopOpacity="0.14" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>
          {[200, 480, 740, 1000, 1260].map((_, i) => (
            <linearGradient
              key={i}
              id={`bb${i}`}
              x1="0"
              y1="0"
              x2="0"
              y2="1"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="transparent" />
              <stop offset="45%" stopColor="#14b8a6" stopOpacity="0.28" />
              <stop offset="60%" stopColor="#5eead4" stopOpacity="0.16" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
          ))}
        </defs>
        <rect width="100%" height="100%" fill="url(#bg1)" />
        <rect width="100%" height="100%" fill="url(#bg2)" />
        <rect width="100%" height="100%" fill="url(#bg3)" />
        {Array.from({ length: 22 }).map((_, i) => (
          <line
            key={i}
            x1={i * 66}
            y1="0"
            x2={i * 66}
            y2="960"
            stroke="rgba(20,184,166,0.04)"
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
            stroke="rgba(94,234,212,0.025)"
            strokeWidth="1"
          />
        ))}
        {[200, 480, 740, 1000, 1260].map((x, i) => (
          <rect
            key={i}
            x={x - 1}
            y="-200"
            width="1.5"
            height="1400"
            fill={`url(#bb${i})`}
            style={{
              animation: `beamDown ${3.5 + i * 0.7}s ease-in-out ${i * 1.2}s infinite`,
            }}
          />
        ))}
      </svg>
    </div>
  );
}

// ─── SPOTLIGHT ────────────────────────────────────────────────────────────────
function Spotlight() {
  const [pos, setPos] = useState({ x: 700, y: 300 });
  useEffect(() => {
    const h = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", h, { passive: true });
    return () => window.removeEventListener("mousemove", h);
  }, []);
  return (
    <div
      style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}
    >
      <div
        style={{
          position: "absolute",
          width: 700,
          height: 700,
          borderRadius: "50%",
          background:
            "radial-gradient(circle,rgba(20,184,166,0.06) 0%,transparent 70%)",
          transform: `translate(${pos.x - 350}px,${pos.y - 350}px)`,
          transition: "transform 0.2s ease",
        }}
      />
    </div>
  );
}

// ─── MARQUEE ─────────────────────────────────────────────────────────────────
function Marquee() {
  const items = [
    "🛍 Balogun Market",
    "👗 Ankara Dresses",
    "👟 Yaba Sneakers",
    "💇 Onitsha Wigs",
    "🧵 Aso-oke Fabrics",
    "👒 Aba Shoes",
    "💍 Alaba Accessories",
    "🧥 Bendel Jackets",
    "👛 Ariaria Bags",
    "🎽 Lagos Sportswear",
    "🪡 Kano Textiles",
    "🕶 Dutse Eyewear",
    "👘 Surulere Fashion",
    "🩴 Ibadan Sandals",
  ];
  const doubled = [...items, ...items];
  return (
    <div
      style={{
        overflow: "hidden",
        borderTop: "1px solid rgba(20,184,166,0.12)",
        borderBottom: "1px solid rgba(20,184,166,0.12)",
        padding: "16px 0",
        background: "rgba(20,184,166,0.025)",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: 48,
          width: "max-content",
          animation: "marquee 42s linear infinite",
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
              letterSpacing: "0.06em",
            }}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── MOVING BORDER ────────────────────────────────────────────────────────────
function MovingBorderCard({
  children,
  r = 24,
}: {
  children: React.ReactNode;
  r?: number;
}) {
  return (
    <div style={{ position: "relative", borderRadius: r, padding: 1.5 }}>
      <div
        className="mborder"
        style={{ position: "absolute", inset: 0, borderRadius: r }}
      />
      <div
        style={{
          position: "relative",
          background: "#060e0d",
          borderRadius: r - 2,
          zIndex: 1,
        }}
      >
        {children}
      </div>
    </div>
  );
}

// ─── WAITLIST FORM ────────────────────────────────────────────────────────────
function WaitlistForm({ compact = false }: { compact?: boolean }) {
  const [email, setEmail] = useState("");
  const [wa, setWa] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const [note, setNote] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;
    setStatus("loading");
    try {
      await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, whatsapp: wa }),
      });
    } catch {}
    setStatus("success");
    setEmail("");
    setWa("");
  };

  if (status === "success")
    return (
      <div
        style={{
          textAlign: "center",
          padding: "22px 28px",
          background: "rgba(13,148,136,0.12)",
          borderRadius: 16,
          border: "1px solid rgba(20,184,166,0.35)",
        }}
      >
        <div style={{ fontSize: 36, marginBottom: 8 }}>🎉</div>
        <p style={{ color: "#5eead4", fontWeight: 700, fontSize: 16 }}>
          You&apos;re on the list!
        </p>
        <p
          style={{ color: "rgba(220,250,245,0.5)", fontSize: 13, marginTop: 6 }}
        >
          We&apos;ll notify you via email & WhatsApp the moment we launch.
        </p>
      </div>
    );

  const inputSt: React.CSSProperties = {
    flex: 1,
    minWidth: 190,
    padding: compact ? "12px 16px" : "14px 18px",
    borderRadius: 12,
    border: "1.5px solid rgba(20,184,166,0.22)",
    background: "rgba(20,184,166,0.06)",
    color: "#e8f7f5",
    fontSize: compact ? 13 : 15,
    outline: "none",
    fontFamily: "'DM Sans',sans-serif",
    transition: "border-color 0.2s,box-shadow 0.2s",
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
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <input
          className="wl-input"
          style={inputSt}
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="wl-input"
          style={inputSt}
          type="tel"
          placeholder="WhatsApp number"
          value={wa}
          onChange={(e) => setWa(e.target.value)}
        />
      </div>
      <div
        style={{
          display: "flex",
          gap: 10,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <button
          className="wl-btn"
          type="submit"
          disabled={status === "loading"}
          style={{
            flex: 1,
            padding: compact ? "12px 20px" : "14px 28px",
            borderRadius: 12,
            background: "linear-gradient(135deg,#065f58,#0d9488,#14b8a6)",
            color: "#e8f7f5",
            fontWeight: 800,
            fontSize: compact ? 14 : 15,
            cursor: "pointer",
            border: "none",
            boxShadow: "0 6px 32px rgba(20,184,166,0.38)",
            fontFamily: "'DM Sans',sans-serif",
            transition: "transform 0.15s,box-shadow 0.2s",
          }}
        >
          {status === "loading" ? "Reserving…" : "Reserve a Spot →"}
        </button>
        <button
          type="button"
          onClick={() => setNote((n) => !n)}
          style={{
            fontSize: 12,
            color: "rgba(220,250,245,0.35)",
            background: "none",
            border: "none",
            cursor: "pointer",
            textDecoration: "underline",
            fontFamily: "'DM Sans',sans-serif",
            whiteSpace: "nowrap",
          }}
        >
          Why WhatsApp?
        </button>
      </div>
      {note && (
        <p
          style={{
            fontSize: 12,
            color: "rgba(220,250,245,0.45)",
            background: "rgba(20,184,166,0.07)",
            padding: "10px 14px",
            borderRadius: 10,
            border: "1px solid rgba(20,184,166,0.15)",
            lineHeight: 1.7,
          }}
        >
          📱 <strong style={{ color: "#a7f3d0" }}>We promise:</strong> We will
          only message you about our launch update. No spam, ever.
        </p>
      )}
    </form>
  );
}

// ─── COUNTER ─────────────────────────────────────────────────────────────────
function Counter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const ob = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        let c = 0;
        const step = target / 60;
        const t = setInterval(() => {
          c += step;
          if (c >= target) {
            setCount(target);
            clearInterval(t);
          } else setCount(Math.floor(c));
        }, 16);
        ob.disconnect();
      },
      { threshold: 0.5 },
    );
    if (ref.current) ob.observe(ref.current);
    return () => ob.disconnect();
  }, [target]);
  return (
    <span ref={ref}>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

// ─── ROLE SELECTOR ────────────────────────────────────────────────────────────
function RoleSelector() {
  const [sel, setSel] = useState<UserRole>(null);
  const roles = [
    {
      id: "buyer" as UserRole,
      icon: "🛍",
      title: "Buyer",
      sub: "Shop from Balogun to Onitsha",
      desc: "Find clothing, shoes, bags and other fashion items from your local markets instantly. Access multiple vendors across Nigeria — delivered to your door.",
      img: IMG.clothesMen,
      accent: "#0d9488",
      accentRgb: "13,148,136",
    },
    {
      id: "vendor" as UserRole,
      icon: "🏪",
      title: "Vendor",
      sub: "Reach more buyers, make more sales",
      desc: "List your fashion items, manage your digital market stall, and reach thousands of buyers nationwide. More sales, zero extra stress.",
      img: IMG.vendor1,
      accent: "#14b8a6",
      accentRgb: "20,184,166",
    },
    {
      id: "rider" as UserRole,
      icon: "🛵",
      title: "Rider",
      sub: "Deliver orders across your city",
      desc: "Earn flexibly delivering fashion orders in your city. Set your own hours, get paid per delivery, and grow your income on your terms.",
      img: IMG.riderBike,
      accent: "#c4430a",
      accentRgb: "196,67,10",
    },
  ];
  return (
    <div>
      <p
        style={{
          fontSize: 13,
          fontWeight: 700,
          letterSpacing: "0.12em",
          color: "#14b8a6",
          textTransform: "uppercase" as const,
          marginBottom: 20,
          textAlign: "center",
        }}
      >
        How should we address you?
      </p>
      <div
        className="roles-g"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: 18,
          maxWidth: 920,
          margin: "0 auto",
        }}
      >
        {roles.map((r) => (
          <div
            key={r.id!}
            className={`role-card${sel === r.id ? " selected" : ""}`}
            onClick={() => setSel(r.id)}
            style={{
              borderRadius: 22,
              border: `1.5px solid ${sel === r.id ? r.accent : "rgba(20,184,166,0.13)"}`,
              background:
                sel === r.id
                  ? `linear-gradient(145deg,rgba(${r.accentRgb},0.14),rgba(6,14,13,0.6))`
                  : "rgba(255,255,255,0.015)",
              cursor: "pointer",
              overflow: "hidden",
              transition: "all 0.3s ease",
              boxShadow:
                sel === r.id
                  ? `0 0 0 2px ${r.accent},0 24px 60px rgba(${r.accentRgb},0.18)`
                  : "none",
            }}
          >
            <div
              style={{ height: 160, overflow: "hidden", position: "relative" }}
            >
              <img
                src={r.img}
                alt={r.title}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transition: "transform 0.4s",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(to top,rgba(6,14,13,0.92) 0%,rgba(6,14,13,0.1) 60%)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: 12,
                  left: 14,
                  fontSize: 30,
                }}
              >
                {r.icon}
              </div>
              {sel === r.id && (
                <div
                  style={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                    width: 26,
                    height: 26,
                    borderRadius: "50%",
                    background: r.accent,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 13,
                    color: "#060e0d",
                    fontWeight: 900,
                  }}
                >
                  ✓
                </div>
              )}
            </div>
            <div style={{ padding: "16px 18px 22px" }}>
              <h3
                style={{
                  fontSize: 18,
                  fontWeight: 900,
                  fontFamily: "'Playfair Display',serif",
                  marginBottom: 4,
                  color: sel === r.id ? "#a7f3d0" : "#e8f7f5",
                }}
              >
                {r.title}
              </h3>
              <p
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#5eead4",
                  letterSpacing: "0.05em",
                  marginBottom: 8,
                  textTransform: "uppercase" as const,
                }}
              >
                {r.sub}
              </p>
              <p
                style={{
                  fontSize: 13,
                  color: "rgba(220,250,245,0.55)",
                  lineHeight: 1.68,
                }}
              >
                {r.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
      {sel && (
        <p
          style={{
            textAlign: "center",
            marginTop: 18,
            fontSize: 13.5,
            color: "#14b8a6",
            fontWeight: 700,
            animation: "fadeIn 0.3s ease",
          }}
        >
          ✓ Great! You selected <strong>{sel}</strong> — join the waitlist below
          to reserve your spot.
        </p>
      )}
    </div>
  );
}

// ─── FAQ ─────────────────────────────────────────────────────────────────────
function FAQ() {
  const [open, setOpen] = useState<number | null>(null);
  const items = [
    {
      q: "What is O-Fash Markett?",
      a: "O-Fash Markett is the digital twin of Africa's local fashion markets. Think of it as Balogun, Yaba, Dutse, Onitsha and every other fashion market — accessible on your mobile phone. With one download, you access multiple vendors across several markets, make purchases, and get items delivered to your doorstep in minutes to hours.",
    },
    {
      q: "What can I buy or sell on the app?",
      a: "All fashion items available in local markets — bags, shoes, textiles, clothes, wigs, accessories and more. All genders and age ranges. Vendors register their business and list what they have readily in stock.",
    },
    {
      q: "Is my payment safe?",
      a: "Absolutely. O-Fash Markett holds your payment until the dispatch rider delivers and you confirm receipt. Vendors are also protected — purchased items must be returned in the same condition they were sent for a full refund. Refunds are processed within 24–48 hours.",
    },
    {
      q: "How do I know vendors are verified?",
      a: "Every vendor on O-Fash Markett passes a strict verification process and onboarding check before they can list products. Only verified vendors appear on the platform — so you can shop with confidence.",
    },
    {
      q: "How long does delivery take?",
      a: "Delivery happens within 30 minutes to 5 hours, depending on the vendor's location, your proximity to the vendor, and rider availability at that location. We're constantly working to minimise wait times.",
    },
    {
      q: "How do I download the app?",
      a: "Click the 'Join Waitlist' button to be added to our list. You'll be the first to be notified — with a direct download link — the moment we launch.",
    },
    {
      q: "Where will O-Fash Markett be available?",
      a: "We are launching soon in Lagos first, then rapidly expanding to other states across Nigeria and Africa. Join the waitlist to be notified about expansion to your city.",
    },
  ];
  return (
    <div
      style={{
        maxWidth: 760,
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: 4,
      }}
    >
      {items.map((item, i) => (
        <div
          key={i}
          className="faq-item"
          style={{
            borderRadius: 14,
            border: "1px solid rgba(20,184,166,0.12)",
            background: "rgba(255,255,255,0.014)",
            overflow: "hidden",
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
              fontFamily: "'DM Sans',sans-serif",
            }}
          >
            <span
              className="faq-q"
              style={{
                fontSize: 14.5,
                fontWeight: 700,
                color: "#e8f7f5",
                textAlign: "left",
                transition: "color 0.2s",
              }}
            >
              {item.q}
            </span>
            <span
              style={{
                fontSize: 20,
                color: "#14b8a6",
                flexShrink: 0,
                transition: "transform 0.25s",
                transform: open === i ? "rotate(45deg)" : "rotate(0deg)",
                lineHeight: 1,
              }}
            >
              +
            </span>
          </button>
          {open === i && (
            <div
              style={{ padding: "0 22px 20px", animation: "fadeIn 0.25s ease" }}
            >
              <p
                style={{
                  fontSize: 14,
                  color: "rgba(220,250,245,0.58)",
                  lineHeight: 1.78,
                }}
              >
                {item.a}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── CONTACT FORM ─────────────────────────────────────────────────────────────
function ContactForm() {
  const [f, setF] = useState({ name: "", email: "", subject: "", msg: "" });
  const [sent, setSent] = useState(false);
  const set =
    (k: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setF((p) => ({ ...p, [k]: e.target.value }));
  const inSt: React.CSSProperties = {
    padding: "13px 18px",
    borderRadius: 12,
    border: "1.5px solid rgba(20,184,166,0.22)",
    background: "rgba(20,184,166,0.06)",
    color: "#e8f7f5",
    fontSize: 15,
    outline: "none",
    fontFamily: "'DM Sans',sans-serif",
    transition: "border-color 0.2s",
  };
  if (sent)
    return (
      <div style={{ textAlign: "center", padding: 32 }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>✅</div>
        <p style={{ color: "#5eead4", fontWeight: 700, fontSize: 16 }}>
          Message sent!
        </p>
        <p
          style={{ color: "rgba(220,250,245,0.5)", fontSize: 14, marginTop: 8 }}
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
      style={{ display: "flex", flexDirection: "column", gap: 12 }}
    >
      <div
        className="cr"
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
      >
        <input
          className="ci"
          style={inSt}
          value={f.name}
          onChange={set("name")}
          placeholder="Your name"
          required
        />
        <input
          className="ci"
          style={inSt}
          value={f.email}
          onChange={set("email")}
          type="email"
          placeholder="Email address"
          required
        />
      </div>
      <input
        className="ci"
        style={inSt}
        value={f.subject}
        onChange={set("subject")}
        placeholder="Subject"
        required
      />
      <textarea
        className="ci"
        style={{ ...inSt, resize: "vertical", minHeight: 120 }}
        value={f.msg}
        onChange={set("msg")}
        placeholder="Tell us how we can help, or what features you'd love to see…"
        required
      />
      <button
        type="submit"
        style={{
          padding: "14px",
          borderRadius: 12,
          background: "linear-gradient(135deg,#065f58,#0d9488,#14b8a6)",
          color: "#e8f7f5",
          fontWeight: 800,
          fontSize: 15,
          cursor: "pointer",
          border: "none",
          fontFamily: "'DM Sans',sans-serif",
        }}
      >
        Send Message →
      </button>
      <div style={{ display: "flex", gap: 20, flexWrap: "wrap", marginTop: 4 }}>
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
              gap: 6,
              fontSize: 12,
              color: "rgba(220,250,245,0.32)",
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

// ─── MODAL ───────────────────────────────────────────────────────────────────
const MODALS: Record<
  "privacy" | "terms",
  { title: string; body: React.ReactNode }
> = {
  privacy: {
    title: "Privacy Policy",
    body: (
      <>
        <p
          style={{
            marginBottom: 16,
            color: "rgba(220,250,245,0.55)",
            fontSize: 14,
          }}
        >
          Last updated: May 2026. O-Fash Markett is committed to protecting your
          personal information.
        </p>
        {[
          {
            h: "1. Information We Collect",
            p: "We collect information you provide directly — name, email, WhatsApp number, delivery address, and payment information when you create an account or join our waitlist. We also collect device data, browsing behaviour, and IP addresses automatically.",
          },
          {
            h: "2. How We Use Your Information",
            p: "We use your data to process and deliver orders, manage your account, send launch notifications (with your consent), improve our services, prevent fraud, and comply with Nigerian legal obligations.",
          },
          {
            h: "3. Sharing Your Information",
            p: "We share your data with vendors to fulfil orders, riders to complete deliveries, and payment processors for transaction handling. We never sell your personal data to third parties.",
          },
          {
            h: "4. Escrow & Payment Data",
            p: "Payment details are handled by certified payment processors. O-Fash Markett holds funds in escrow and does not store full card details on our servers.",
          },
          {
            h: "5. WhatsApp Communications",
            p: "If you provide your WhatsApp number, we will only use it to send launch updates and critical order notifications. You can opt out at any time by replying STOP.",
          },
          {
            h: "6. Your Rights",
            p: "You have the right to access, correct, or delete your personal data. Contact us at contact@o-fashmarkett.com to exercise your rights.",
          },
          {
            h: "7. Security",
            p: "We implement SSL encryption, secure servers, and regular security audits to protect your information.",
          },
          {
            h: "8. Contact",
            p: "Questions? Contact us at contact@o-fashmarkett.com · Lagos, Nigeria.",
          },
        ].map((s) => (
          <div key={s.h}>
            <h2
              style={{
                fontSize: 14.5,
                fontWeight: 800,
                color: "#5eead4",
                marginBottom: 6,
                marginTop: 22,
              }}
            >
              {s.h}
            </h2>
            <p
              style={{
                fontSize: 13.5,
                color: "rgba(220,250,245,0.58)",
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
        <p
          style={{
            marginBottom: 16,
            color: "rgba(220,250,245,0.55)",
            fontSize: 14,
          }}
        >
          Last updated: May 2026. By using O-Fash Markett, you agree to these
          Terms.
        </p>
        {[
          {
            h: "1. Acceptance of Terms",
            p: "By creating an account or using our marketplace, you acknowledge you have read, understood, and agree to these terms.",
          },
          {
            h: "2. Eligibility",
            p: "You must be at least 18 years old to use O-Fash Markett and have the legal capacity to enter this agreement.",
          },
          {
            h: "3. Escrow Payment System",
            p: "All buyer payments are held in escrow until the buyer confirms satisfactory delivery. Funds are released to vendors only after confirmation. Disputed payments are resolved within 24–48 hours.",
          },
          {
            h: "4. Vendor Obligations",
            p: "Vendors must list items accurately, honour all confirmed orders, pass our verification process, and comply with all applicable Nigerian laws.",
          },
          {
            h: "5. Buyer Obligations",
            p: "Buyers must provide accurate delivery information, make timely payments, and use the platform in good faith. Items can be returned if not delivered as described, in the same condition they were sent.",
          },
          {
            h: "6. Rider Obligations",
            p: "Riders must maintain valid identification, handle items with care, and adhere to our delivery standards. Riders are independent contractors, not employees of O-Fash Markett.",
          },
          {
            h: "7. Prohibited Activities",
            p: "You may not sell counterfeit goods, engage in fraudulent activity, harass other users, or breach applicable Nigerian laws. Violations result in immediate account suspension.",
          },
          {
            h: "8. Governing Law",
            p: "These terms are governed by the laws of the Federal Republic of Nigeria. Disputes are resolved through binding arbitration in Lagos, Nigeria.",
          },
        ].map((s) => (
          <div key={s.h}>
            <h2
              style={{
                fontSize: 14.5,
                fontWeight: 800,
                color: "#5eead4",
                marginBottom: 6,
                marginTop: 22,
              }}
            >
              {s.h}
            </h2>
            <p
              style={{
                fontSize: 13.5,
                color: "rgba(220,250,245,0.58)",
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
  const content = isContact ? null : MODALS[page];
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        background: "rgba(6,14,13,0.93)",
        backdropFilter: "blur(20px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        animation: "fadeIn 0.25s ease",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          background: "linear-gradient(145deg,#081a17,#0a1612)",
          border: "1px solid rgba(20,184,166,0.2)",
          borderRadius: 28,
          width: "100%",
          maxWidth: 700,
          maxHeight: "88vh",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          boxShadow:
            "0 40px 120px rgba(0,0,0,0.8),0 0 60px rgba(13,148,136,0.08)",
          animation: "slideUp 0.3s ease",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "24px 32px 20px",
            borderBottom: "1px solid rgba(20,184,166,0.12)",
            flexShrink: 0,
          }}
        >
          <h2
            style={{
              fontSize: 20,
              fontWeight: 900,
              fontFamily: "'Playfair Display',serif",
              color: "#e8f7f5",
            }}
          >
            {isContact ? "Contact Us" : content!.title}
          </h2>
          <button
            className="modal-close"
            onClick={onClose}
            style={{
              width: 36,
              height: 36,
              borderRadius: 9,
              background: "rgba(20,184,166,0.08)",
              border: "1px solid rgba(20,184,166,0.18)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              fontSize: 15,
              color: "rgba(220,250,245,0.55)",
              transition: "background 0.2s",
            }}
          >
            ✕
          </button>
        </div>
        <div style={{ padding: "26px 32px 36px", overflowY: "auto", flex: 1 }}>
          {isContact ? <ContactForm /> : content!.body}
        </div>
      </div>
    </div>
  );
}

// ─── INQUIRY ─────────────────────────────────────────────────────────────────
function InquiryBox() {
  const [val, setVal] = useState("");
  const [sent, setSent] = useState(false);
  if (sent)
    return (
      <p
        style={{
          color: "#5eead4",
          fontWeight: 700,
          fontSize: 14,
          textAlign: "center",
          padding: "16px",
          background: "rgba(13,148,136,0.1)",
          borderRadius: 14,
          border: "1px solid rgba(20,184,166,0.25)",
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
        placeholder="Tell us what features you'd love, or any concerns you have. We have your best interest at heart…"
        style={{
          flex: 1,
          minWidth: 240,
          minHeight: 110,
          padding: "14px 18px",
          borderRadius: 14,
          border: "1.5px solid rgba(20,184,166,0.2)",
          background: "rgba(20,184,166,0.05)",
          color: "#e8f7f5",
          fontSize: 14,
          outline: "none",
          resize: "vertical",
          fontFamily: "'DM Sans',sans-serif",
          transition: "border-color 0.2s",
        }}
      />
      <button
        type="submit"
        style={{
          padding: "14px 26px",
          borderRadius: 14,
          background: "linear-gradient(135deg,#065f58,#0d9488)",
          color: "#a7f3d0",
          fontWeight: 800,
          fontSize: 14,
          cursor: "pointer",
          border: "none",
          alignSelf: "flex-end",
          fontFamily: "'DM Sans',sans-serif",
          boxShadow: "0 6px 24px rgba(13,148,136,0.35)",
        }}
      >
        Submit →
      </button>
    </form>
  );
}

// ─── MAIN ────────────────────────────────────────────────────────────────────
export default function OFashMarketLanding() {
  const [modal, setModal] = useState<ModalPage>(null);
  const open = useCallback((p: ModalPage) => setModal(p), []);
  const close = useCallback(() => setModal(null), []);

  const S: React.CSSProperties = {
    padding: "110px 24px",
    position: "relative",
  };
  const Inn: React.CSSProperties = { maxWidth: 1100, margin: "0 auto" };
  const SL: React.CSSProperties = {
    fontSize: 11,
    fontWeight: 800,
    letterSpacing: "0.18em",
    color: "#14b8a6",
    textTransform: "uppercase" as const,
    marginBottom: 12,
  };
  const ST: React.CSSProperties = {
    fontFamily: "'Playfair Display',serif",
    fontSize: "clamp(26px,3.8vw,50px)",
    fontWeight: 900,
    letterSpacing: "-1.5px",
    lineHeight: 1.1,
    marginBottom: 52,
    maxWidth: 600,
    color: "#e8f7f5",
  };
  const DIV: React.CSSProperties = {
    width: "100%",
    height: 1,
    background:
      "linear-gradient(90deg,transparent,rgba(20,184,166,0.15),transparent)",
  };
  const flBtn = (onClick?: () => void): React.CSSProperties => ({
    background: "none",
    border: "none",
    padding: 0,
    cursor: "pointer",
    fontFamily: "'DM Sans',sans-serif",
    textAlign: "left" as const,
    transition: "color 0.2s",
  });

  return (
    <div
      style={{
        margin: 0,
        padding: 0,
        background: "#060e0d",
        color: "#e8f7f5",
        fontFamily: "'DM Sans','Helvetica Neue',sans-serif",
        overflowX: "hidden",
      }}
    >
      <GlobalStyles />
      <Spotlight />
      {modal && <Modal page={modal} onClose={close} />}

      {/* ══ NAV ══ */}
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
          padding: "14px 48px",
          borderBottom: "1px solid rgba(20,184,166,0.12)",
          backdropFilter: "blur(24px)",
          background: "rgba(6,14,13,0.85)",
        }}
      >
        <OFashLogo size={40} textSize={16} />
        <ul
          className="nav-ul"
          style={{
            display: "flex",
            gap: 28,
            listStyle: "none",
            margin: 0,
            padding: 0,
          }}
        >
          {[
            ["How It Works", "#how-it-works"],
            ["Who We Serve", "#who-we-serve"],
            ["Trust & Safety", "#trust"],
            ["FAQ", "#faq"],
          ].map(([l, h]) => (
            <li key={l}>
              <a
                href={h}
                className="nav-link"
                style={{
                  color: "rgba(220,250,245,0.52)",
                  fontSize: 13.5,
                  fontWeight: 600,
                  cursor: "pointer",
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}
              >
                {l}
              </a>
            </li>
          ))}
        </ul>
        <button
          className="nav-cta"
          onClick={() =>
            document
              .querySelector("#waitlist")
              ?.scrollIntoView({ behavior: "smooth" })
          }
          style={{
            padding: "10px 22px",
            borderRadius: 11,
            background: "linear-gradient(135deg,#065f58,#0d9488,#14b8a6)",
            color: "#e8f7f5",
            fontWeight: 800,
            fontSize: 13.5,
            cursor: "pointer",
            border: "none",
            boxShadow: "0 4px 20px rgba(13,148,136,0.38)",
            fontFamily: "'DM Sans',sans-serif",
            transition: "transform 0.15s,box-shadow 0.2s",
          }}
        >
          Join Waitlist
        </button>
      </nav>

      {/* ══ HERO ══ */}
      <section
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "160px 24px 90px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <BackgroundBeams />
        {/* Market bg image */}
        <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
          <img
            src={IMG.heroMarket}
            alt="African fashion market"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: 0.11,
              filter: "sepia(10%) saturate(100%) hue-rotate(140deg)",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to bottom,rgba(6,14,13,0.3) 0%,rgba(6,14,13,0.7) 55%,rgba(6,14,13,1) 100%)",
            }}
          />
        </div>

        <div
          style={{
            position: "relative",
            zIndex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            maxWidth: 980,
          }}
        >
          {/* Badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "7px 18px",
              borderRadius: 100,
              background: "rgba(20,184,166,0.1)",
              border: "1px solid rgba(20,184,166,0.32)",
              fontSize: 12.5,
              color: "#a7f3d0",
              fontWeight: 700,
              marginBottom: 32,
              letterSpacing: "0.05em",
              backdropFilter: "blur(8px)",
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#14b8a6",
                display: "inline-block",
                animation: "pulse2 2s infinite",
              }}
            />
            Launching Soon in Lagos · Expanding Rapidly Across Africa
          </div>

          {/* Headline 1 */}
          <h1
            style={{
              fontFamily: "'Playfair Display',serif",
              fontSize: "clamp(38px,6.5vw,86px)",
              fontWeight: 900,
              lineHeight: 1.04,
              letterSpacing: "-3px",
              marginBottom: 18,
              maxWidth: 940,
            }}
          >
            Africa&apos;s Fashion Market,
            <span
              style={{
                display: "block",
                background:
                  "linear-gradient(135deg,#a7f3d0 0%,#5eead4 35%,#14b8a6 65%,#0d9488 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Now One Click Away
            </span>
          </h1>

          {/* Headline 2 */}
          <h2
            style={{
              fontSize: "clamp(16px,2.2vw,22px)",
              fontWeight: 600,
              color: "rgba(220,250,245,0.72)",
              maxWidth: 620,
              lineHeight: 1.6,
              marginBottom: 12,
              fontFamily: "'DM Sans',sans-serif",
            }}
          >
            Access the market without the stress of physically moving from shop
            to shop.
          </h2>
          <p
            style={{
              fontSize: "clamp(14px,1.5vw,17px)",
              color: "rgba(220,250,245,0.45)",
              maxWidth: 520,
              lineHeight: 1.8,
              marginBottom: 12,
              fontFamily: "'DM Sans',sans-serif",
            }}
          >
            Get items delivered within hours, not days.
          </p>
          <p
            style={{
              fontSize: 14.5,
              color: "rgba(220,250,245,0.36)",
              maxWidth: 580,
              lineHeight: 1.8,
              marginBottom: 48,
              fontStyle: "italic",
            }}
          >
            Imagine accessing Balogun, Onitsha, Dutse and every fashion market —
            with just one click.
          </p>

          {/* CTA buttons */}
          <div
            style={{
              display: "flex",
              gap: 12,
              flexWrap: "wrap",
              justifyContent: "center",
              marginBottom: 52,
            }}
          >
            <button
              onClick={() =>
                document
                  .querySelector("#waitlist")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              style={{
                padding: "16px 38px",
                borderRadius: 14,
                background: "linear-gradient(135deg,#065f58,#0d9488,#14b8a6)",
                color: "#e8f7f5",
                fontWeight: 800,
                fontSize: 16,
                cursor: "pointer",
                border: "none",
                boxShadow: "0 8px 36px rgba(13,148,136,0.48)",
                fontFamily: "'DM Sans',sans-serif",
              }}
            >
              Join the Waitlist, Be the First Notified →
            </button>
            <button
              onClick={() =>
                document
                  .querySelector("#waitlist")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              style={{
                padding: "16px 28px",
                borderRadius: 14,
                background: "rgba(20,184,166,0.07)",
                color: "#e8f7f5",
                fontWeight: 700,
                fontSize: 15,
                cursor: "pointer",
                border: "1px solid rgba(20,184,166,0.25)",
                fontFamily: "'DM Sans',sans-serif",
              }}
            >
              Reserve a Spot
            </button>
          </div>

          {/* Stats */}
          <div
            className="stats-r"
            style={{
              display: "flex",
              gap: 52,
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            {[
              { t: 500, s: "+", l: "Vendors Ready" },
              { t: 10000, s: "+", l: "Fashion Items" },
              { t: 150, s: "+", l: "Riders Network" },
              { t: 3, s: " Cities", l: "At Launch" },
            ].map(({ t, s, l }) => (
              <div key={l} style={{ textAlign: "center" }}>
                <div
                  style={{
                    fontSize: 30,
                    fontWeight: 900,
                    fontFamily: "'Playfair Display',serif",
                    background:
                      "linear-gradient(135deg,#a7f3d0,#14b8a6,#0d9488)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    letterSpacing: "-1.5px",
                  }}
                >
                  <Counter target={t} suffix={s} />
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: "rgba(220,250,245,0.38)",
                    marginTop: 5,
                    fontWeight: 700,
                    letterSpacing: "0.07em",
                    textTransform: "uppercase" as const,
                  }}
                >
                  {l}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ MARQUEE ══ */}
      <Marquee />

      {/* ══ REAL MARKET BANNER ══ */}
      <div style={{ position: "relative", height: 320, overflow: "hidden" }}>
        <img
          src={IMG.marketScene}
          alt="African fashion market scene"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: "sepia(5%) saturate(110%) hue-rotate(140deg)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to right,rgba(6,14,13,0.9) 0%,rgba(6,14,13,0.3) 50%,rgba(6,14,13,0.9) 100%)",
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
          }}
        >
          <p
            style={{
              fontSize: 12,
              fontWeight: 800,
              letterSpacing: "0.18em",
              color: "#14b8a6",
              textTransform: "uppercase" as const,
              marginBottom: 10,
            }}
          >
            Inspired by Real Markets
          </p>
          <h2
            style={{
              fontFamily: "'Playfair Display',serif",
              fontSize: "clamp(22px,3.5vw,44px)",
              fontWeight: 900,
              letterSpacing: "-1.5px",
              lineHeight: 1.15,
              maxWidth: 700,
              color: "#e8f7f5",
            }}
          >
            O-Fash Markett is the digital branch of Africa&apos;s fashion market
          </h2>
          <p
            style={{
              fontSize: 15,
              color: "rgba(220,250,245,0.55)",
              maxWidth: 560,
              marginTop: 14,
              lineHeight: 1.75,
            }}
          >
            Connecting buyers, vendors, and riders into one seamless digital
            marketplace inspired by the real physical markets you already know
            and love.
          </p>
        </div>
      </div>

      {/* ══ WHO WE SERVE ══ */}
      <section
        style={{ ...S, paddingTop: 100, paddingBottom: 80 }}
        id="who-we-serve"
      >
        <div style={{ ...Inn, textAlign: "center" }}>
          <p style={SL}>Who We Serve</p>
          <h2
            style={{
              ...ST,
              maxWidth: "100%",
              textAlign: "center",
              marginBottom: 14,
            }}
          >
            Built for every player in Africa&apos;s fashion chain
          </h2>
          <p
            style={{
              fontSize: 15,
              color: "rgba(220,250,245,0.5)",
              maxWidth: 540,
              margin: "0 auto 48px",
              lineHeight: 1.8,
            }}
          >
            Vendors, Buyers and Riders — we&apos;ve got you covered. Reach more
            people who need your services and make more sales.
          </p>
          <RoleSelector />
        </div>
      </section>

      <div style={DIV} />

      {/* ══ PRODUCT CATEGORIES ══ */}
      <section style={S}>
        <div style={Inn}>
          <p style={SL}>What You&apos;ll Find</p>
          <h2 style={ST}>Fashion for everyone, from every market</h2>
          <div
            className="cat-g"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4,1fr)",
              gap: 14,
            }}
          >
            {[
              {
                img: IMG.clothesMen,
                label: "Men's Fashion",
                sub: "Agbada, suits, shirts & more",
              },
              {
                img: IMG.clothesWomen,
                label: "Women's Fashion",
                sub: "Dresses, blouses, skirts & more",
              },
              {
                img: IMG.shoes,
                label: "Shoes & Footwear",
                sub: "All styles, all genders",
              },
              {
                img: IMG.wigs,
                label: "Wigs & Hair",
                sub: "Human hair, synthetics & more",
              },
              {
                img: IMG.bags,
                label: "Bags & Purses",
                sub: "Leather, fabric & designer",
              },
              {
                img: IMG.fabric,
                label: "Fabrics & Textiles",
                sub: "Ankara, lace, aso-oke & more",
              },
              {
                img: IMG.riderBike,
                label: "Fast Delivery",
                sub: "30 mins – 5 hours to your door",
              },
              {
                img: IMG.vendor2,
                label: "Verified Vendors",
                sub: "Balogun, Onitsha & more",
              },
            ].map((c, i) => (
              <div
                key={i}
                className="cat-img"
                style={{
                  borderRadius: 16,
                  overflow: "hidden",
                  position: "relative",
                  aspectRatio: "1",
                  transition: "transform 0.3s",
                  cursor: "default",
                }}
              >
                <img
                  src={c.img}
                  alt={c.label}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(to top,rgba(6,14,13,0.97) 0%,rgba(6,14,13,0.08) 55%)",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    bottom: 12,
                    left: 14,
                    right: 14,
                  }}
                >
                  <p
                    style={{
                      fontSize: 13,
                      fontWeight: 800,
                      color: "#e8f7f5",
                      marginBottom: 2,
                    }}
                  >
                    {c.label}
                  </p>
                  <p style={{ fontSize: 11, color: "rgba(220,250,245,0.45)" }}>
                    {c.sub}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div style={DIV} />

      {/* ══ HOW IT WORKS ══ */}
      <section style={S} id="how-it-works">
        <div style={Inn}>
          <p style={SL}>The O-Fash Flow</p>
          <h2 style={ST}>From discovery to doorstep in 3 moves</h2>
          <div
            className="steps-g"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3,1fr)",
              gap: 20,
            }}
          >
            {[
              {
                n: "01",
                icon: "🛍",
                title: "Buyers Browse & Buy",
                desc: "Discover curated fashion from hundreds of verified vendors across Nigeria's biggest markets. Clothes, shoes, wigs, bags — all genders, all ages, all in one place.",
                img: IMG.clothesMen,
              },
              {
                n: "02",
                icon: "🏪",
                title: "Vendors Post & Sell",
                desc: "Fashion vendors list their collections, manage their digital market stall, and reach thousands of buyers nationwide. From boutiques to market traders — everyone wins.",
                img: IMG.vendor1,
              },
              {
                n: "03",
                icon: "🛵",
                title: "Riders Pick & Deliver",
                desc: "Our vetted rider network picks up directly from vendors and delivers to your door. Fast, tracked, and reliable — 30 minutes to 5 hours, every single time.",
                img: IMG.riderBike,
              },
            ].map((step) => (
              <div
                key={step.n}
                className="step-card"
                style={{
                  borderRadius: 22,
                  overflow: "hidden",
                  border: "1px solid rgba(20,184,166,0.12)",
                  background: "rgba(255,255,255,0.012)",
                  transition: "border-color 0.3s,transform 0.3s",
                }}
              >
                <div
                  style={{
                    height: 200,
                    overflow: "hidden",
                    position: "relative",
                  }}
                >
                  <img
                    src={step.img}
                    alt={step.title}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "linear-gradient(to top,rgba(6,14,13,0.97) 0%,rgba(6,14,13,0.18) 65%)",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      top: 14,
                      right: 16,
                      fontSize: 56,
                      fontWeight: 900,
                      color: "rgba(20,184,166,0.15)",
                      lineHeight: 1,
                    }}
                  >
                    {step.n}
                  </div>
                  <div
                    style={{
                      position: "absolute",
                      bottom: 12,
                      left: 16,
                      width: 46,
                      height: 46,
                      borderRadius: 12,
                      background: "rgba(6,14,13,0.88)",
                      border: "1px solid rgba(20,184,166,0.32)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 22,
                    }}
                  >
                    {step.icon}
                  </div>
                </div>
                <div style={{ padding: "22px 24px 28px" }}>
                  <h3
                    style={{
                      fontSize: 18,
                      fontWeight: 900,
                      marginBottom: 10,
                      fontFamily: "'Playfair Display',serif",
                    }}
                  >
                    {step.title}
                  </h3>
                  <p
                    style={{
                      fontSize: 14,
                      color: "rgba(220,250,245,0.52)",
                      lineHeight: 1.72,
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

      <div style={DIV} />

      {/* ══ TRUST & SAFETY ══ */}
      <section style={S} id="trust">
        <div style={Inn}>
          <p style={SL}>Trust & Safety</p>
          <h2 style={ST}>Your money, your goods — always protected</h2>
          <div
            className="trust-g"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4,1fr)",
              gap: 14,
            }}
          >
            {[
              {
                icon: "🔒",
                t: "Secure Escrow Payments",
                d: "Your money is safe with us. We hold it securely until you confirm delivery — then release to the vendor.",
              },
              {
                icon: "✅",
                t: "Verified Vendors Only",
                d: "Every seller goes through strict onboarding checks. No unverified vendors on O-Fash Markett.",
              },
              {
                icon: "🛡",
                t: "Buyer Protection",
                d: "Items can be returned if not delivered as described. Your purchase is fully backed by our protection policy.",
              },
              {
                icon: "⚡",
                t: "Fast Refunds",
                d: "Refunds processed within 24–48 hours. No long waits, no runarounds.",
              },
              {
                icon: "📱",
                t: "Seamless Processes",
                d: "All activities are smooth, no glitches. A clean, fast, enjoyable experience every time.",
              },
              {
                icon: "🛵",
                t: "Live Delivery Tracking",
                d: "Watch your rider in real-time from vendor pickup to your doorstep.",
              },
              {
                icon: "🌍",
                t: "Built for Africa",
                d: "Designed by people who understand Nigeria's fashion markets — from Balogun to Ariaria.",
              },
              {
                icon: "💬",
                t: "24/7 Support",
                d: "Our team is always available via the app, WhatsApp, or email — any time of day.",
              },
            ].map((f, i) => (
              <div
                key={i}
                className="trust-card"
                style={{
                  padding: 22,
                  borderRadius: 18,
                  background: "rgba(20,184,166,0.025)",
                  border: "1px solid rgba(20,184,166,0.1)",
                  transition: "border-color 0.3s,transform 0.3s",
                }}
              >
                <div style={{ fontSize: 26, marginBottom: 12 }}>{f.icon}</div>
                <h3
                  style={{
                    fontSize: 14,
                    fontWeight: 800,
                    marginBottom: 7,
                    letterSpacing: "-0.3px",
                    color: "#e8f7f5",
                  }}
                >
                  {f.t}
                </h3>
                <p
                  style={{
                    fontSize: 13,
                    color: "rgba(220,250,245,0.5)",
                    lineHeight: 1.68,
                  }}
                >
                  {f.d}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div style={DIV} />

      {/* ══ RIDER FEATURE ══ */}
      <section style={{ ...S, padding: "80px 24px" }}>
        <div
          style={{
            ...Inn,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 56,
            alignItems: "center",
          }}
          className="rider-cols"
        >
          <div>
            <p style={SL}>For Riders</p>
            <h2 style={{ ...ST, marginBottom: 18 }}>
              Earn on your terms. Deliver fashion across your city.
            </h2>
            <p
              style={{
                fontSize: 15,
                color: "rgba(220,250,245,0.55)",
                lineHeight: 1.8,
                marginBottom: 24,
              }}
            >
              Join our growing rider network and deliver fashion orders
              efficiently and timely. Set your hours, maximise earnings, and
              help connect buyers with the fashion they love.
            </p>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 8,
                marginBottom: 28,
              }}
            >
              {[
                "Flexible Hours",
                "Per-Delivery Pay",
                "Route Optimisation",
                "Rider Insurance",
                "Weekly Bonuses",
                "Real-Time Navigation",
              ].map((p) => (
                <span
                  key={p}
                  style={{
                    padding: "5px 13px",
                    borderRadius: 100,
                    background: "rgba(13,148,136,0.12)",
                    border: "1px solid rgba(20,184,166,0.25)",
                    fontSize: 12,
                    color: "#5eead4",
                    fontWeight: 700,
                  }}
                >
                  {p}
                </span>
              ))}
            </div>
            <button
              onClick={() =>
                document
                  .querySelector("#waitlist")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              style={{
                padding: "13px 28px",
                borderRadius: 12,
                background: "linear-gradient(135deg,#065f58,#0d9488,#14b8a6)",
                color: "#e8f7f5",
                fontWeight: 800,
                fontSize: 14,
                cursor: "pointer",
                border: "none",
                fontFamily: "'DM Sans',sans-serif",
                boxShadow: "0 6px 24px rgba(13,148,136,0.35)",
              }}
            >
              Register as a Rider →
            </button>
          </div>
          <div
            style={{
              position: "relative",
              borderRadius: 24,
              overflow: "hidden",
              aspectRatio: "4/3",
            }}
          >
            <img
              src={IMG.riderBike}
              alt="O-Fash rider delivering fashion"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(135deg,rgba(6,14,13,0.2),rgba(6,14,13,0.02))",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: 18,
                left: 18,
                right: 18,
                padding: "14px 18px",
                background: "rgba(6,14,13,0.9)",
                backdropFilter: "blur(12px)",
                borderRadius: 14,
                border: "1px solid rgba(20,184,166,0.22)",
              }}
            >
              <p
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#5eead4",
                  marginBottom: 3,
                }}
              >
                🛵 Active Rider · Lagos Island
              </p>
              <p style={{ fontSize: 12, color: "rgba(220,250,245,0.5)" }}>
                3 deliveries completed today · ₦12,400 earned
              </p>
            </div>
          </div>
        </div>
      </section>

      <div style={DIV} />

      {/* ══ WAITLIST ══ */}
      <section
        style={{ ...S, paddingBottom: 80, textAlign: "center" }}
        id="waitlist"
      >
        <div style={{ ...Inn, maxWidth: 800 }}>
          <p style={SL}>Join the Waitlist</p>
          <h2
            style={{
              ...ST,
              maxWidth: "100%",
              textAlign: "center",
              marginBottom: 12,
            }}
          >
            Be the first to access Africa&apos;s digital fashion market
          </h2>
          <p
            style={{
              fontSize: 15,
              color: "rgba(220,250,245,0.5)",
              maxWidth: 520,
              margin: "0 auto 40px",
              lineHeight: 1.8,
            }}
          >
            Join the waitlist and be the first to be notified once we launch.
            Founding members get exclusive early access and special perks.
          </p>
          <MovingBorderCard r={26}>
            <div
              style={{
                padding: "56px 48px",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: -80,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: 400,
                  height: 400,
                  borderRadius: "50%",
                  background:
                    "radial-gradient(circle,rgba(13,148,136,0.1) 0%,transparent 70%)",
                  pointerEvents: "none",
                }}
              />
              <div style={{ position: "relative", zIndex: 1 }}>
                <div style={{ fontSize: 44, marginBottom: 14 }}>🛍</div>
                <h3
                  style={{
                    fontFamily: "'Playfair Display',serif",
                    fontSize: "clamp(22px,3vw,36px)",
                    fontWeight: 900,
                    marginBottom: 12,
                    letterSpacing: "-1.5px",
                  }}
                >
                  Reserve Your Spot Now
                </h3>
                <p
                  style={{
                    fontSize: 14,
                    color: "rgba(220,250,245,0.5)",
                    marginBottom: 32,
                    lineHeight: 1.78,
                    maxWidth: 460,
                    margin: "0 auto 32px",
                  }}
                >
                  Enter your email and WhatsApp number. We will only message you
                  about our launch update.
                </p>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <WaitlistForm />
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: 24,
                    marginTop: 24,
                    flexWrap: "wrap",
                  }}
                >
                  {[
                    "🔒 No spam",
                    "🚀 Early access",
                    "🎁 Founding perks",
                    "🇳🇬 Made for Nigeria",
                  ].map((b) => (
                    <span
                      key={b}
                      style={{
                        fontSize: 12,
                        color: "rgba(220,250,245,0.3)",
                        fontWeight: 600,
                      }}
                    >
                      {b}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </MovingBorderCard>
        </div>
      </section>

      <div style={DIV} />

      {/* ══ FAQ ══ */}
      <section style={S} id="faq">
        <div style={Inn}>
          <p style={SL}>FAQ</p>
          <h2 style={ST}>Questions we know you have</h2>
          <FAQ />
        </div>
      </section>

      <div style={DIV} />

      {/* ══ INQUIRY ══ */}
      <section style={{ ...S, padding: "80px 24px" }}>
        <div style={{ ...Inn, maxWidth: 760 }}>
          <p style={SL}>Your Voice Matters</p>
          <h2 style={{ ...ST, marginBottom: 12 }}>
            Help us build what you need
          </h2>
          <p
            style={{
              fontSize: 15,
              color: "rgba(220,250,245,0.5)",
              lineHeight: 1.8,
              marginBottom: 28,
            }}
          >
            Let us know what features you&apos;d like us to add, or any
            concerns. Life&apos;s already hard — let us help make sale, purchase
            and delivery easier for you in the way that we can.
          </p>
          <InquiryBox />
        </div>
      </section>

      {/* ══ CLOSING QUOTE ══ */}
      <section
        style={{
          textAlign: "center",
          padding: "60px 24px 100px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", inset: 0 }}>
          <img
            src={IMG.market2}
            alt=""
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: 0.06,
              filter: "sepia(20%) hue-rotate(140deg)",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to bottom,#060e0d 0%,rgba(6,14,13,0.5) 50%,#060e0d 100%)",
            }}
          />
        </div>
        <div
          style={{
            position: "relative",
            zIndex: 1,
            maxWidth: 640,
            margin: "0 auto",
          }}
        >
          <p
            style={{
              fontFamily: "'Playfair Display',serif",
              fontSize: "clamp(18px,2.8vw,34px)",
              fontWeight: 700,
              fontStyle: "italic",
              color: "rgba(220,250,245,0.6)",
              lineHeight: 1.65,
              marginBottom: 36,
            }}
          >
            &ldquo;Life&apos;s already hard — let us help make sale, purchase
            and delivery easier for you in the way that we can.&rdquo;
          </p>
          <OFashLogo size={50} textSize={21} />
          <p
            style={{
              fontSize: 12,
              color: "rgba(220,250,245,0.25)",
              marginTop: 10,
            }}
          >
            🚀 Launching soon in Lagos, expanding rapidly
          </p>
        </div>
      </section>

      {/* ══ FOOTER ══ */}
      <footer
        style={{
          padding: "60px 48px 44px",
          borderTop: "1px solid rgba(20,184,166,0.1)",
          background: "rgba(4,9,8,0.95)",
        }}
      >
        <div
          className="footer-g"
          style={{
            display: "grid",
            gridTemplateColumns: "1.8fr 1fr 1fr 1fr",
            gap: 44,
            maxWidth: 1100,
            margin: "0 auto 48px",
          }}
        >
          {/* Brand */}
          <div>
            <OFashLogo size={46} textSize={18} />
            <p
              style={{
                fontSize: 13.5,
                color: "rgba(220,250,245,0.38)",
                lineHeight: 1.78,
                marginTop: 16,
                maxWidth: 260,
              }}
            >
              Nigeria&apos;s premier fashion marketplace — the digital twin of
              Africa&apos;s local fashion markets, connecting buyers, vendors
              and riders.
            </p>
            <p
              style={{
                fontSize: 12,
                color: "rgba(20,184,166,0.65)",
                marginTop: 10,
                fontWeight: 700,
              }}
            >
              🚀 Launching soon in Lagos · Expanding rapidly
            </p>
            <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
              {["𝕏", "in", "📸", "▶"].map((icon) => (
                <button
                  key={icon}
                  className="social-btn"
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 9,
                    background: "rgba(20,184,166,0.07)",
                    border: "1px solid rgba(20,184,166,0.16)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 14,
                    cursor: "pointer",
                    transition: "all 0.2s",
                    color: "#e8f7f5",
                  }}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          {/* Company */}
          <div>
            <p
              style={{
                fontSize: 11,
                fontWeight: 800,
                letterSpacing: "0.14em",
                color: "rgba(220,250,245,0.3)",
                textTransform: "uppercase" as const,
                marginBottom: 18,
              }}
            >
              Company
            </p>
            <div
              style={{
                display: "flex",
                flexDirection: "column" as const,
                gap: 12,
              }}
            >
              {["About Us", "Careers", "Blog", "Press Kit"].map((l) => (
                <button
                  key={l}
                  className="footer-link"
                  style={{
                    ...flBtn(),
                    fontSize: 14,
                    color: "rgba(220,250,245,0.48)",
                  }}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          {/* Legal */}
          <div>
            <p
              style={{
                fontSize: 11,
                fontWeight: 800,
                letterSpacing: "0.14em",
                color: "rgba(220,250,245,0.3)",
                textTransform: "uppercase" as const,
                marginBottom: 18,
              }}
            >
              Legal
            </p>
            <div
              style={{
                display: "flex",
                flexDirection: "column" as const,
                gap: 12,
              }}
            >
              <button
                className="footer-link"
                onClick={() => open("privacy")}
                style={{
                  ...flBtn(() => open("privacy")),
                  fontSize: 14,
                  color: "rgba(220,250,245,0.48)",
                }}
              >
                Privacy Policy
              </button>
              <button
                className="footer-link"
                onClick={() => open("terms")}
                style={{
                  ...flBtn(() => open("terms")),
                  fontSize: 14,
                  color: "rgba(220,250,245,0.48)",
                }}
              >
                Terms of Service
              </button>
              <button
                className="footer-link"
                onClick={() => open("privacy")}
                style={{
                  ...flBtn(),
                  fontSize: 14,
                  color: "rgba(220,250,245,0.48)",
                }}
              >
                Cookie Policy
              </button>
              <button
                className="footer-link"
                style={{
                  ...flBtn(),
                  fontSize: 14,
                  color: "rgba(220,250,245,0.48)",
                }}
              >
                Vendor Agreement
              </button>
            </div>
          </div>

          {/* Support */}
          <div>
            <p
              style={{
                fontSize: 11,
                fontWeight: 800,
                letterSpacing: "0.14em",
                color: "rgba(220,250,245,0.3)",
                textTransform: "uppercase" as const,
                marginBottom: 18,
              }}
            >
              Support
            </p>
            <div
              style={{
                display: "flex",
                flexDirection: "column" as const,
                gap: 12,
              }}
            >
              <button
                className="footer-link"
                onClick={() => open("contact")}
                style={{
                  ...flBtn(() => open("contact")),
                  fontSize: 14,
                  color: "rgba(220,250,245,0.48)",
                }}
              >
                Contact Us
              </button>
              <button
                className="footer-link"
                style={{
                  ...flBtn(),
                  fontSize: 14,
                  color: "rgba(220,250,245,0.48)",
                }}
              >
                Help Centre
              </button>
              <button
                className="footer-link"
                style={{
                  ...flBtn(),
                  fontSize: 14,
                  color: "rgba(220,250,245,0.48)",
                }}
              >
                Rider Support
              </button>
              <button
                className="footer-link"
                style={{
                  ...flBtn(),
                  fontSize: 14,
                  color: "rgba(220,250,245,0.48)",
                }}
              >
                Vendor Support
              </button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 14,
            maxWidth: 1100,
            margin: "0 auto",
            paddingTop: 28,
            borderTop: "1px solid rgba(20,184,166,0.08)",
          }}
        >
          <p style={{ fontSize: 12.5, color: "rgba(220,250,245,0.24)" }}>
            © {new Date().getFullYear()} O-Fash Markett. All rights reserved.
            Nigeria 🇳🇬
          </p>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 11,
              color: "rgba(220,250,245,0.26)",
            }}
          >
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: "#14b8a6",
                display: "inline-block",
                animation: "pulse2 2s infinite",
              }}
            />
          </div>
          <div style={{ display: "flex", gap: 18 }}>
            {[
              ["Privacy", "privacy" as ModalPage],
              ["Terms", "terms" as ModalPage],
              ["Contact", "contact" as ModalPage],
            ].map(([l, p]) => (
              <button
                key={l}
                className="footer-link"
                onClick={() => open(p as ModalPage)}
                style={{
                  ...flBtn(() => open(p as ModalPage)),
                  fontSize: 12.5,
                  color: "rgba(220,250,245,0.32)",
                }}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
