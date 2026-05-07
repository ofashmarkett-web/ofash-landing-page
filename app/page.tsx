"use client";

import Image from "next/image";
import { useState, useEffect, useRef, useCallback } from "react";

type ModalPage = "privacy" | "terms" | "contact" | null;
type UserRole = "buyer" | "vendor" | "rider" | null;

const IMG = {
  heroMarket: "/images/heroMarket.png",
  clothesMen: "/images/clothesMen.png",
  clothesWomen: "/images/clothesWomen.png",
  shoes: "/images/shoes.png",
  wigs: "/images/wigs.png",
  bags: "/images/bags.png",
  fabric: "/images/fabric.png",
  riderBike: "/images/riderBike.png",
  marketScene: "/images/marketScene.png",
  vendor1: "/images/vendor1.png",
  vendor2: "/images/vendor2.png",
  market2: "/images/market2.png",
  africanFashion: "/images/africanFashion.png",
};

function GlobalStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,600;9..40,700;9..40,800&display=swap');
      *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
      html{scroll-behavior:smooth;}
      body{background:#050c0b;overflow-x:hidden;}
      ::selection{background:rgba(20,184,166,0.35);}
      ::placeholder{color:rgba(220,250,245,0.25);}
      ::-webkit-scrollbar{width:4px;}
      ::-webkit-scrollbar-track{background:#050c0b;}
      ::-webkit-scrollbar-thumb{background:rgba(20,184,166,0.45);border-radius:2px;}

      :root{
        --t1:#042e2a; --t2:#065f58; --t3:#0d9488; --t4:#14b8a6; --t5:#5eead4; --t6:#a7f3d0;
        --gold:#f59e0b; --gold-l:#fbbf24; --gold-p:#fde68a;
        --rust:#c4430a; --clay:#b87333;
        --dark:#050c0b;
        --glass:rgba(6,95,88,0.11);
        --gborder:rgba(20,184,166,0.17);
      }

      @keyframes pulse-dot{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.3;transform:scale(.65)}}
      @keyframes fade-in{from{opacity:0}to{opacity:1}}
      @keyframes slide-up{from{opacity:0;transform:translateY(26px)}to{opacity:1;transform:translateY(0)}}
      @keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}
      @keyframes rotate-border{to{--angle:360deg}}
      @keyframes beam-fall{0%{opacity:0;transform:scaleY(0) translateY(-110%)}15%{opacity:1}80%{opacity:.8}100%{opacity:0;transform:scaleY(1) translateY(110%)}}
      @keyframes float-y{0%,100%{transform:translateY(0)}50%{transform:translateY(-11px)}}
      @keyframes shimmer{from{background-position:-200% 0}to{background-position:200% 0}}
      @keyframes ride-across{from{transform:translateX(-80px);opacity:0}to{transform:translateX(0);opacity:1}}

      @property --angle{syntax:'<angle>';initial-value:0deg;inherits:false;}

      .mborder-conic{
        background:conic-gradient(from var(--angle),
          transparent 60%,var(--t4) 72%,var(--t5) 79%,
          var(--gold) 86%,var(--gold-l) 91%,transparent 100%);
        animation:rotate-border 3.4s linear infinite;
      }
      .glass{background:var(--glass);backdrop-filter:blur(16px) saturate(155%);-webkit-backdrop-filter:blur(16px) saturate(155%);border:1px solid var(--gborder);}
      .shimmer-text{background:linear-gradient(90deg,var(--t5) 0%,var(--gold-l) 28%,var(--t5) 48%,var(--t4) 66%,var(--gold) 100%);background-size:220% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;animation:shimmer 4.2s linear infinite;}

      .nav-link:hover{color:var(--t5)!important;}
      .nav-cta:hover{transform:translateY(-2px)!important;box-shadow:0 10px 34px rgba(13,148,136,0.52)!important;}
      .role-card:hover{transform:translateY(-9px)!important;}
      .role-card.sel{box-shadow:0 0 0 2px var(--t4),0 22px 56px rgba(20,184,166,0.24)!important;}
      .step-card:hover{transform:translateY(-6px)!important;border-color:rgba(20,184,166,0.38)!important;}
      .trust-card:hover{transform:translateY(-4px)!important;border-color:rgba(245,158,11,0.28)!important;}
      .cat-tile:hover{transform:scale(1.05)!important;}
      .btn-p:hover{transform:translateY(-2px);box-shadow:0 13px 42px rgba(13,148,136,0.52);}
      .btn-g:hover{transform:translateY(-2px);box-shadow:0 10px 34px rgba(245,158,11,0.42);}
      .wl-input:focus{border-color:rgba(20,184,166,0.58)!important;box-shadow:0 0 0 3px rgba(20,184,166,0.09)!important;}
      .wl-btn:hover{transform:translateY(-2px);box-shadow:0 11px 38px rgba(13,148,136,0.55)!important;}
      .faq-item:hover .faq-q{color:var(--t5)!important;}
      .footer-link:hover{color:var(--t5)!important;}
      .social-btn:hover{background:rgba(20,184,166,0.14)!important;border-color:rgba(20,184,166,0.38)!important;}
      .modal-close:hover{background:rgba(20,184,166,0.14)!important;}

      @media(max-width:960px){
        .nav-links{display:none!important;}
        .roles-g,.rider-g{grid-template-columns:1fr!important;}
        .footer-g{grid-template-columns:1fr 1fr!important;}
        .cat-g{grid-template-columns:repeat(2,1fr)!important;}
        .trust-g{grid-template-columns:repeat(2,1fr)!important;}
        .steps-g{grid-template-columns:1fr!important;}
        .stats-r{gap:22px!important;}
      }
      @media(max-width:600px){
        .footer-g{grid-template-columns:1fr!important;}
        .trust-g,.cr2{grid-template-columns:1fr!important;}
        .wl-pad{padding:32px 22px!important;}
      }
    `}</style>
  );
}

// ── FIX 1: Replace broken /logo.png with a pure SVG/CSS logo ──────────────
function OFashLogo({
  size = 44,
  textSize = 18,
}: {
  size?: number;
  textSize?: number;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
      {/* SVG logo mark — no external image needed */}
      <div
        style={{
          width: size,
          height: size,
          flexShrink: 0,
          borderRadius: Math.round(size * 0.26),
          background: "linear-gradient(135deg,#042e2a,#0d9488,#14b8a6)",
          boxShadow: `0 0 0 1.5px rgba(20,184,166,0.38), 0 4px ${Math.round(size * 0.5)}px rgba(13,148,136,0.26)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg
          width={size * 0.58}
          height={size * 0.58}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Stylised "OF" monogram */}
          <path d="M4 6h7a3 3 0 010 6H4V6z" fill="rgba(167,243,208,0.95)" />
          <path d="M4 12h5v6H4v-6z" fill="rgba(167,243,208,0.55)" />
          <path d="M13 6h7v3h-7V6z" fill="rgba(245,158,11,0.9)" />
          <path d="M13 10.5h5v3h-5v-3z" fill="rgba(245,158,11,0.65)" />
        </svg>
      </div>
      <div>
        <div
          style={{
            fontSize: textSize,
            fontWeight: 900,
            fontFamily: "'Playfair Display',serif",
            background: "linear-gradient(90deg,#a7f3d0,#14b8a6,#0d9488)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            letterSpacing: "-0.4px",
            lineHeight: 1.1,
          }}
        >
          O-Fash Markett
        </div>
        <div
          style={{
            fontSize: 8.5,
            color: "rgba(220,250,245,0.36)",
            letterSpacing: "0.17em",
            textTransform: "uppercase",
            fontWeight: 700,
            marginTop: 1,
          }}
        >
          Africa&apos;s Fashion Market
        </div>
      </div>
    </div>
  );
}

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
    const mv = (e: MouseEvent) => {
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

function Marquee() {
  const items = [
    "🛍 Balogun Market",
    "👗 Ankara Dresses",
    "🛵 Bike Dispatch",
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
    "🏍 Fast Delivery",
    "🌍 Pan-Africa Now",
  ];
  const doubled = [...items, ...items];
  return (
    <div
      style={{
        overflow: "hidden",
        borderTop: "1px solid rgba(20,184,166,0.09)",
        borderBottom: "1px solid rgba(20,184,166,0.09)",
        padding: "13px 0",
        background: "rgba(20,184,166,0.018)",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: 52,
          width: "max-content",
          animation: "marquee 45s linear infinite",
          willChange: "transform",
        }}
      >
        {doubled.map((item, i) => (
          <span
            key={i}
            style={{
              fontSize: 12.5,
              fontWeight: 700,
              color: "rgba(220,250,245,0.32)",
              whiteSpace: "nowrap",
              letterSpacing: "0.07em",
            }}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

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
        className="mborder-conic"
        style={{ position: "absolute", inset: 0, borderRadius: r }}
      />
      <div
        style={{
          position: "relative",
          background: "linear-gradient(145deg,#071412,#0a1a17)",
          borderRadius: r - 1.5,
          zIndex: 1,
        }}
      >
        {children}
      </div>
    </div>
  );
}

function WaitlistForm({ compact = false }: { compact?: boolean }) {
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
        body: JSON.stringify({ email, whatsapp: wa, role }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        setStatus("error");
        setErrMsg(d.error || "Something went wrong. Please try again.");
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
          border: "1px solid rgba(20,184,166,0.3)",
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
            color: "#5eead4",
            fontWeight: 800,
            fontSize: 17,
            marginBottom: 5,
          }}
        >
          You&apos;re on the list!
        </p>
        <p
          style={{
            color: "rgba(220,250,245,0.48)",
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
            color: "#ea580c",
            fontWeight: 700,
            fontSize: 15,
            marginBottom: 5,
          }}
        >
          Something went wrong
        </p>
        <p
          style={{
            color: "rgba(220,250,245,0.47)",
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
            color: "#ea580c",
            border: "1px solid rgba(196,67,10,0.28)",
            cursor: "pointer",
            fontSize: 12.5,
            fontWeight: 700,
            fontFamily: "'DM Sans',sans-serif",
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
    border: "1.5px solid rgba(20,184,166,0.19)",
    background: "rgba(20,184,166,0.05)",
    color: "#edfaf7",
    fontSize: compact ? 13 : 14.5,
    outline: "none",
    fontFamily: "'DM Sans',sans-serif",
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
              fontFamily: "'DM Sans',sans-serif",
              cursor: "pointer",
              transition: "all 0.17s",
              background:
                role === r ? "rgba(20,184,166,0.18)" : "rgba(20,184,166,0.055)",
              border:
                role === r
                  ? "1.5px solid rgba(20,184,166,0.48)"
                  : "1.5px solid rgba(20,184,166,0.14)",
              color: role === r ? "#5eead4" : "rgba(220,250,245,0.42)",
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
          className="wl-input"
          style={inSt}
          type="email"
          placeholder="Email address *"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="wl-input"
          style={inSt}
          type="tel"
          placeholder="WhatsApp number"
          value={wa}
          onChange={(e) => setWa(e.target.value)}
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
          className="wl-btn"
          type="submit"
          disabled={status === "loading"}
          style={{
            flex: 1,
            padding: compact ? "12px 18px" : "14px 26px",
            borderRadius: 12,
            background: "linear-gradient(135deg,#065f58,#0d9488,#14b8a6)",
            color: "#edfaf7",
            fontWeight: 800,
            fontSize: compact ? 14 : 15,
            cursor: "pointer",
            border: "none",
            boxShadow: "0 6px 26px rgba(13,148,136,0.36)",
            fontFamily: "'DM Sans',sans-serif",
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
            color: "rgba(220,250,245,0.3)",
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
      {errMsg && status === "idle" && (
        <p
          style={{
            fontSize: 12,
            color: "#ea580c",
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
            color: "rgba(220,250,245,0.44)",
            background: "rgba(20,184,166,0.055)",
            padding: "10px 13px",
            borderRadius: 10,
            border: "1px solid rgba(20,184,166,0.13)",
            lineHeight: 1.7,
          }}
        >
          📱 <strong style={{ color: "#a7f3d0" }}>We promise:</strong> WhatsApp
          is only for your launch notification. No spam, ever.
        </div>
      )}
    </form>
  );
}

function Counter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const ob = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        const dur = 1600,
          s = performance.now();
        const tick = (now: number) => {
          const p = Math.min((now - s) / dur, 1);
          const ease = 1 - Math.pow(1 - p, 3);
          setCount(Math.floor(ease * target));
          if (p < 1) requestAnimationFrame(tick);
          else setCount(target);
        };
        requestAnimationFrame(tick);
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

function RoleSelector() {
  const [sel, setSel] = useState<UserRole>(null);
  const roles = [
    {
      id: "buyer" as UserRole,
      icon: "🛍",
      title: "Buyer",
      sub: "Shop from Balogun to Onitsha",
      desc: "Find clothing, shoes, bags and other fashion items from your local markets instantly. Access multiple vendors across Nigeria delivered to your door.",
      img: IMG.clothesMen,
      accent: "#0d9488",
      rgb: "13,148,136",
    },
    {
      id: "vendor" as UserRole,
      icon: "🏪",
      title: "Vendor",
      sub: "Reach more buyers, make more sales",
      desc: "List your fashion items, manage your digital market stall, and reach thousands of buyers nationwide. More sales, zero extra stress.",
      img: IMG.vendor1,
      accent: "#f59e0b",
      rgb: "245,158,11",
    },
    {
      id: "rider" as UserRole,
      icon: "🛵",
      title: "Rider",
      sub: "Deliver orders across your city",
      desc: "Earn flexibly delivering fashion orders in your city on your bike. Set your own hours, get paid per delivery, and grow your income on your terms.",
      img: IMG.riderBike,
      accent: "#c4430a",
      rgb: "196,67,10",
    },
  ];
  return (
    <div>
      <p
        style={{
          fontSize: 11.5,
          fontWeight: 800,
          letterSpacing: "0.14em",
          color: "#14b8a6",
          textTransform: "uppercase",
          marginBottom: 18,
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
          gap: 15,
          maxWidth: 940,
          margin: "0 auto",
        }}
      >
        {roles.map((r) => (
          <div
            key={r.id!}
            className={`role-card glass${sel === r.id ? " sel" : ""}`}
            onClick={() => setSel(sel === r.id ? null : r.id)}
            style={{
              borderRadius: 20,
              overflow: "hidden",
              cursor: "pointer",
              border: `1.5px solid ${sel === r.id ? r.accent : "var(--gborder)"}`,
              background:
                sel === r.id
                  ? `linear-gradient(145deg,rgba(${r.rgb},0.15),rgba(5,12,11,0.7))`
                  : undefined,
              transition: "all 0.28s cubic-bezier(0.34,1.56,0.64,1)",
              willChange: "transform",
            }}
          >
            {/* FIX 2: added sizes prop to all fill Images */}
            <div
              style={{ height: 155, overflow: "hidden", position: "relative" }}
            >
              <Image
                src={r.img}
                alt={r.title}
                fill
                sizes="(max-width: 960px) 100vw, 33vw"
                style={{ objectFit: "cover" }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(to top,rgba(5,12,11,0.94) 0%,rgba(5,12,11,0.04) 55%)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: 10,
                  left: 12,
                  fontSize: 27,
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
                    width: 24,
                    height: 24,
                    borderRadius: "50%",
                    background: r.accent,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 12,
                    color: "#050c0b",
                    fontWeight: 900,
                    animation: "fade-in 0.2s ease",
                  }}
                >
                  ✓
                </div>
              )}
            </div>
            <div style={{ padding: "13px 15px 19px" }}>
              <h3
                style={{
                  fontSize: 16.5,
                  fontWeight: 900,
                  fontFamily: "'Playfair Display',serif",
                  marginBottom: 3,
                  color: sel === r.id ? "#a7f3d0" : "#edfaf7",
                }}
              >
                {r.title}
              </h3>
              <p
                style={{
                  fontSize: 10.5,
                  fontWeight: 700,
                  color: "#5eead4",
                  letterSpacing: "0.05em",
                  marginBottom: 6,
                  textTransform: "uppercase",
                }}
              >
                {r.sub}
              </p>
              <p
                style={{
                  fontSize: 12.5,
                  color: "rgba(220,250,245,0.5)",
                  lineHeight: 1.65,
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
            marginTop: 14,
            fontSize: 13,
            color: "#14b8a6",
            fontWeight: 700,
            animation: "fade-in 0.3s ease",
          }}
        >
          ✓ Selected: <strong style={{ color: "#f59e0b" }}>{sel}</strong> —
          scroll down to reserve your spot.
        </p>
      )}
    </div>
  );
}

function FAQ() {
  const [open, setOpen] = useState<number | null>(null);
  const items = [
    {
      q: "What is O-Fash Markett?",
      a: "O-Fash Markett is the digital twin of Africa's local fashion markets. Think of it as Balogun, Yaba, Dutse, Onitsha and every other fashion market accessible on your mobile phone. One download gives you access to multiple vendors across several markets, with items delivered to your doorstep in minutes to hours.",
    },
    {
      q: "What can I buy or sell on the app?",
      a: "All fashion items available in local markets bags, shoes, textiles, clothes, wigs, accessories and more. All genders and age ranges. Vendors register their business and list what they have readily in stock.",
    },
    {
      q: "Is my payment safe?",
      a: "Absolutely. O-Fash Markett holds your payment until the dispatch rider delivers and you confirm receipt. Vendors are protected too items must be returned in same condition for a refund. Refunds processed within 24–48 hours.",
    },
    {
      q: "How do I know vendors are verified?",
      a: "Every vendor passes a strict verification and onboarding check before they can list products. Only verified vendors appear on the platform.",
    },
    {
      q: "How long does delivery take?",
      a: "30 minutes to 5 hours depending on vendor location, your proximity, and bike rider availability. We're constantly working to minimise wait times.",
    },
    {
      q: "How do I download the app?",
      a: "Join the waitlist now. You'll receive a direct download link the moment we launch.",
    },
    {
      q: "Where will O-Fash Markett launch?",
      a: "Lagos first, then rapidly expanding to other states across Nigeria and Africa. Join to be notified about your city.",
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
          className="faq-item glass"
          style={{ borderRadius: 12, overflow: "hidden" }}
        >
          <button
            onClick={() => setOpen(open === i ? null : i)}
            style={{
              width: "100%",
              padding: "16px 19px",
              background: "none",
              border: "none",
              cursor: "pointer",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 14,
              fontFamily: "'DM Sans',sans-serif",
            }}
          >
            <span
              className="faq-q"
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: "#edfaf7",
                textAlign: "left",
                transition: "color 0.18s",
              }}
            >
              {item.q}
            </span>
            <span
              style={{
                fontSize: 20,
                color: "#f59e0b",
                flexShrink: 0,
                transition: "transform 0.22s",
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
                padding: "0 19px 17px",
                animation: "slide-up 0.22s ease",
              }}
            >
              <p
                style={{
                  fontSize: 13.5,
                  color: "rgba(220,250,245,0.54)",
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

function ContactForm() {
  const [f, setF] = useState({ name: "", email: "", subject: "", msg: "" });
  const [sent, setSent] = useState(false);
  const set =
    (k: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setF((p) => ({ ...p, [k]: e.target.value }));
  const inSt: React.CSSProperties = {
    padding: "12px 16px",
    borderRadius: 11,
    border: "1.5px solid rgba(20,184,166,0.19)",
    background: "rgba(20,184,166,0.05)",
    color: "#edfaf7",
    fontSize: 14.5,
    outline: "none",
    fontFamily: "'DM Sans',sans-serif",
    transition: "border-color 0.18s",
  };
  if (sent)
    return (
      <div style={{ textAlign: "center", padding: 30 }}>
        <div style={{ fontSize: 38, marginBottom: 11 }}>✅</div>
        <p style={{ color: "#5eead4", fontWeight: 700, fontSize: 15 }}>
          Message sent!
        </p>
        <p
          style={{
            color: "rgba(220,250,245,0.48)",
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
          className="wl-input"
          style={inSt}
          value={f.name}
          onChange={set("name")}
          placeholder="Your name"
          required
        />
        <input
          className="wl-input"
          style={inSt}
          value={f.email}
          onChange={set("email")}
          type="email"
          placeholder="Email address"
          required
        />
      </div>
      <input
        className="wl-input"
        style={inSt}
        value={f.subject}
        onChange={set("subject")}
        placeholder="Subject"
        required
      />
      <textarea
        className="wl-input"
        style={{ ...inSt, resize: "vertical", minHeight: 108 }}
        value={f.msg}
        onChange={set("msg")}
        placeholder="Tell us how we can help, or what features you'd love to see…"
        required
      />
      <button
        type="submit"
        style={{
          padding: "13px",
          borderRadius: 11,
          background: "linear-gradient(135deg,#065f58,#0d9488,#14b8a6)",
          color: "#edfaf7",
          fontWeight: 800,
          fontSize: 14.5,
          cursor: "pointer",
          border: "none",
          fontFamily: "'DM Sans',sans-serif",
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
              color: "rgba(220,250,245,0.28)",
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

const MODALS: Record<
  "privacy" | "terms",
  { title: string; body: React.ReactNode }
> = {
  privacy: {
    title: "Privacy Policy",
    body: (
      <>
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
            p: "You have the right to access, correct, or delete your personal data. Contact us at contact@o-fashmarkett.com.",
          },
          {
            h: "7. Security",
            p: "We implement SSL encryption, secure servers, and regular security audits.",
          },
          {
            h: "8. Contact",
            p: "Questions? Contact us at contact@o-fashmarkett.com · Lagos, Nigeria.",
          },
        ].map((s) => (
          <div key={s.h}>
            <h2
              style={{
                fontSize: 14,
                fontWeight: 800,
                color: "#5eead4",
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
            p: "Buyers must provide accurate delivery information, make timely payments, and use the platform in good faith.",
          },
          {
            h: "6. Rider Obligations",
            p: "Riders must maintain valid identification, handle items with care, and adhere to our delivery standards. Riders are independent contractors.",
          },
          {
            h: "7. Prohibited Activities",
            p: "You may not sell counterfeit goods, engage in fraudulent activity, harass other users, or breach Nigerian laws. Violations result in immediate account suspension.",
          },
          {
            h: "8. Governing Law",
            p: "These terms are governed by the laws of the Federal Republic of Nigeria. Disputes are resolved through binding arbitration in Lagos, Nigeria.",
          },
        ].map((s) => (
          <div key={s.h}>
            <h2
              style={{
                fontSize: 14,
                fontWeight: 800,
                color: "#5eead4",
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
        background: "rgba(5,12,11,0.92)",
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
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "21px 29px 17px",
            borderBottom: "1px solid rgba(20,184,166,0.1)",
            flexShrink: 0,
          }}
        >
          <h2
            style={{
              fontSize: 18.5,
              fontWeight: 900,
              fontFamily: "'Playfair Display',serif",
              color: "#edfaf7",
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
              background: "rgba(20,184,166,0.07)",
              border: "1px solid rgba(20,184,166,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              fontSize: 13,
              color: "rgba(220,250,245,0.48)",
              transition: "background 0.18s",
            }}
          >
            ✕
          </button>
        </div>
        <div style={{ padding: "23px 29px 32px", overflowY: "auto", flex: 1 }}>
          {isContact ? <ContactForm /> : content!.body}
        </div>
      </div>
    </div>
  );
}

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
          padding: "15px",
          background: "rgba(13,148,136,0.1)",
          borderRadius: 12,
          border: "1px solid rgba(20,184,166,0.2)",
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
          border: "1.5px solid rgba(20,184,166,0.17)",
          background: "rgba(20,184,166,0.042)",
          color: "#edfaf7",
          fontSize: 14,
          outline: "none",
          resize: "vertical",
          fontFamily: "'DM Sans',sans-serif",
          transition: "border-color 0.18s",
        }}
      />
      <button
        type="submit"
        style={{
          padding: "13px 23px",
          borderRadius: 12,
          background: "linear-gradient(135deg,#065f58,#0d9488)",
          color: "#a7f3d0",
          fontWeight: 800,
          fontSize: 14,
          cursor: "pointer",
          border: "none",
          alignSelf: "flex-end",
          fontFamily: "'DM Sans',sans-serif",
          boxShadow: "0 6px 20px rgba(13,148,136,0.3)",
        }}
      >
        Submit →
      </button>
    </form>
  );
}

export default function OFashMarketLanding() {
  const [modal, setModal] = useState<ModalPage>(null);
  const open = useCallback((p: ModalPage) => setModal(p), []);
  const close = useCallback(() => setModal(null), []);

  const S: React.CSSProperties = {
    padding: "106px 24px",
    position: "relative",
  };
  const Inn: React.CSSProperties = { maxWidth: 1100, margin: "0 auto" };
  const SL: React.CSSProperties = {
    fontSize: 10.5,
    fontWeight: 800,
    letterSpacing: "0.2em",
    color: "#14b8a6",
    textTransform: "uppercase",
    marginBottom: 11,
  };
  const ST: React.CSSProperties = {
    fontFamily: "'Playfair Display',serif",
    fontSize: "clamp(24px,3.5vw,47px)",
    fontWeight: 900,
    letterSpacing: "-1.5px",
    lineHeight: 1.1,
    marginBottom: 46,
    maxWidth: 600,
    color: "#edfaf7",
  };
  const DIV: React.CSSProperties = {
    width: "100%",
    height: 1,
    background:
      "linear-gradient(90deg,transparent,rgba(20,184,166,0.12),rgba(245,158,11,0.055),transparent)",
  };
  const flBtn = (): React.CSSProperties => ({
    background: "none",
    border: "none",
    padding: 0,
    cursor: "pointer",
    fontFamily: "'DM Sans',sans-serif",
    textAlign: "left",
    transition: "color 0.18s",
  });

  return (
    <div
      style={{
        margin: 0,
        padding: 0,
        background: "#050c0b",
        color: "#edfaf7",
        fontFamily: "'DM Sans','Helvetica Neue',sans-serif",
        overflowX: "hidden",
      }}
    >
      <GlobalStyles />
      <Spotlight />
      {modal && <Modal page={modal} onClose={close} />}

      {/* NAV */}
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
          padding: "13px 48px",
          borderBottom: "1px solid rgba(20,184,166,0.09)",
          backdropFilter: "blur(24px) saturate(155%)",
          background: "rgba(5,12,11,0.82)",
        }}
      >
        <OFashLogo size={38} textSize={15} />
        <ul
          className="nav-links"
          style={{
            display: "flex",
            gap: 25,
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
                  color: "rgba(220,250,245,0.46)",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  textDecoration: "none",
                  transition: "color 0.18s",
                }}
              >
                {l}
              </a>
            </li>
          ))}
        </ul>
        <button
          className="nav-cta btn-p"
          onClick={() =>
            document
              .querySelector("#waitlist")
              ?.scrollIntoView({ behavior: "smooth" })
          }
          style={{
            padding: "10px 21px",
            borderRadius: 10,
            background: "linear-gradient(135deg,#065f58,#0d9488,#14b8a6)",
            color: "#edfaf7",
            fontWeight: 800,
            fontSize: 13,
            cursor: "pointer",
            border: "none",
            boxShadow: "0 4px 17px rgba(13,148,136,0.33)",
            fontFamily: "'DM Sans',sans-serif",
            transition: "transform 0.15s,box-shadow 0.2s",
            willChange: "transform",
          }}
        >
          Join Waitlist
        </button>
      </nav>

      {/* HERO */}
      <section
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "158px 24px 86px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <BackgroundBeams />
        <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
          {/* FIX 2: added sizes prop */}
          <Image
            src={IMG.heroMarket}
            alt=""
            fill
            sizes="100vw"
            style={{
              objectFit: "cover",
              opacity: 0.12,
              filter: "sepia(16%) saturate(112%) hue-rotate(128deg)",
            }}
            priority
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to bottom,rgba(5,12,11,0.26) 0%,rgba(5,12,11,0.6) 50%,rgba(5,12,11,1) 100%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: "50%",
              transform: "translateX(-50%)",
              width: "80%",
              height: 160,
              background:
                "radial-gradient(ellipse,rgba(245,158,11,0.055) 0%,transparent 70%)",
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
            maxWidth: 1000,
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 16px",
              borderRadius: 100,
              background: "rgba(20,184,166,0.08)",
              border: "1px solid rgba(20,184,166,0.28)",
              fontSize: 12,
              color: "#a7f3d0",
              fontWeight: 700,
              marginBottom: 26,
              letterSpacing: "0.05em",
              backdropFilter: "blur(8px)",
              animation: "slide-up 0.5s ease",
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#14b8a6",
                display: "inline-block",
                animation: "pulse-dot 2s infinite",
              }}
            />
            Launching Soon in Lagos · Expanding Across Africa
          </div>

          <h1
            style={{
              fontFamily: "'Playfair Display',serif",
              fontSize: "clamp(36px,6.2vw,82px)",
              fontWeight: 900,
              lineHeight: 1.04,
              letterSpacing: "-3px",
              marginBottom: 15,
              maxWidth: 960,
              animation: "slide-up 0.58s 0.1s ease both",
            }}
          >
            Africa&apos;s Fashion Market,
            <span className="shimmer-text" style={{ display: "block" }}>
              Now One Click Away
            </span>
          </h1>

          <h2
            style={{
              fontSize: "clamp(14px,2vw,20px)",
              fontWeight: 600,
              color: "rgba(220,250,245,0.68)",
              maxWidth: 580,
              lineHeight: 1.62,
              marginBottom: 10,
              fontFamily: "'DM Sans',sans-serif",
              animation: "slide-up 0.58s 0.18s ease both",
            }}
          >
            Access the market without the stress of moving from shop to shop.
          </h2>
          <p
            style={{
              fontSize: "clamp(13px,1.4vw,16px)",
              color: "rgba(220,250,245,0.4)",
              maxWidth: 490,
              lineHeight: 1.82,
              marginBottom: 10,
              animation: "slide-up 0.58s 0.24s ease both",
            }}
          >
            Get items delivered within hours, not days.
          </p>
          <p
            style={{
              fontSize: 13.5,
              color: "rgba(220,250,245,0.3)",
              maxWidth: 540,
              lineHeight: 1.82,
              marginBottom: 42,
              fontStyle: "italic",
              animation: "slide-up 0.58s 0.3s ease both",
            }}
          >
            Balogun, Onitsha, Dutse every fashion market, in one click.
          </p>

          <div
            style={{
              display: "flex",
              gap: 10,
              flexWrap: "wrap",
              justifyContent: "center",
              marginBottom: 50,
              animation: "slide-up 0.58s 0.4s ease both",
            }}
          >
            <button
              className="btn-p"
              onClick={() =>
                document
                  .querySelector("#waitlist")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              style={{
                padding: "15px 34px",
                borderRadius: 13,
                background: "linear-gradient(135deg,#065f58,#0d9488,#14b8a6)",
                color: "#edfaf7",
                fontWeight: 800,
                fontSize: 15,
                cursor: "pointer",
                border: "none",
                boxShadow: "0 8px 30px rgba(13,148,136,0.42)",
                fontFamily: "'DM Sans',sans-serif",
                transition: "transform 0.15s,box-shadow 0.2s",
                willChange: "transform",
              }}
            >
              Join the Waitlist Be First Notified →
            </button>
            <button
              className="btn-g"
              onClick={() =>
                document
                  .querySelector("#waitlist")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              style={{
                padding: "15px 24px",
                borderRadius: 13,
                background: "rgba(245,158,11,0.09)",
                color: "#fbbf24",
                fontWeight: 700,
                fontSize: 15,
                cursor: "pointer",
                border: "1.5px solid rgba(245,158,11,0.28)",
                fontFamily: "'DM Sans',sans-serif",
                transition: "transform 0.15s,box-shadow 0.2s",
                willChange: "transform",
              }}
            >
              Reserve a Spot
            </button>
          </div>

          <div
            className="stats-r"
            style={{
              display: "flex",
              gap: 42,
              flexWrap: "wrap",
              justifyContent: "center",
              animation: "slide-up 0.58s 0.5s ease both",
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
                    fontSize: 28,
                    fontWeight: 900,
                    fontFamily: "'Playfair Display',serif",
                    background:
                      "linear-gradient(135deg,#a7f3d0,#14b8a6,#f59e0b)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    letterSpacing: "-1.5px",
                  }}
                >
                  <Counter target={t} suffix={s} />
                </div>
                <div
                  style={{
                    fontSize: 10.5,
                    color: "rgba(220,250,245,0.34)",
                    marginTop: 4,
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                  }}
                >
                  {l}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 28,
            right: 28,
            zIndex: 2,
            animation: "float-y 3s ease-in-out infinite",
          }}
        >
          <div
            className="glass"
            style={{
              borderRadius: 13,
              padding: "11px 16px",
              display: "flex",
              alignItems: "center",
              gap: 9,
              boxShadow: "inset 0 1px 0 rgba(167,243,208,0.07)",
            }}
          >
            <span style={{ fontSize: 20 }}>🛵</span>
            <div>
              <p
                style={{
                  fontSize: 11.5,
                  fontWeight: 700,
                  color: "#5eead4",
                  margin: 0,
                }}
              >
                Bike Delivery
              </p>
              <p
                style={{
                  fontSize: 10.5,
                  color: "rgba(220,250,245,0.42)",
                  margin: 0,
                }}
              >
                30 min – 5 hrs
              </p>
            </div>
          </div>
        </div>
      </section>

      <Marquee />

      {/* MARKET BANNER */}
      <div style={{ position: "relative", height: 295, overflow: "hidden" }}>
        {/* FIX 2: added sizes prop */}
        <Image
          src={IMG.marketScene}
          alt="African fashion market"
          fill
          sizes="100vw"
          style={{
            objectFit: "cover",
            filter: "sepia(7%) saturate(112%) hue-rotate(128deg)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to right,rgba(5,12,11,0.9) 0%,rgba(5,12,11,0.22) 50%,rgba(5,12,11,0.9) 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(245,158,11,0.035)",
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
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: "0.2em",
              color: "#f59e0b",
              textTransform: "uppercase",
              marginBottom: 8,
            }}
          >
            Inspired by Real Markets
          </p>
          <h2
            style={{
              fontFamily: "'Playfair Display',serif",
              fontSize: "clamp(20px,3.1vw,40px)",
              fontWeight: 900,
              letterSpacing: "-1.5px",
              lineHeight: 1.15,
              maxWidth: 660,
              color: "#edfaf7",
            }}
          >
            O-Fash Markett is the digital branch of Africa&apos;s fashion market
          </h2>
          <p
            style={{
              fontSize: 14,
              color: "rgba(220,250,245,0.5)",
              maxWidth: 500,
              marginTop: 11,
              lineHeight: 1.75,
            }}
          >
            Vendors selling fabrics, clothes, shoes and bags. Buyers
            negotiating. Bike dispatch riders moving through the crowd. Now, in
            one app.
          </p>
        </div>
      </div>

      {/* WHO WE SERVE */}
      <section
        style={{ ...S, paddingTop: 94, paddingBottom: 74 }}
        id="who-we-serve"
      >
        <div style={{ ...Inn, textAlign: "center" }}>
          <p style={SL}>Who We Serve</p>
          <h2
            style={{
              ...ST,
              maxWidth: "100%",
              textAlign: "center",
              marginBottom: 11,
            }}
          >
            Built for every player in Africa&apos;s fashion chain
          </h2>
          <p
            style={{
              fontSize: 15,
              color: "rgba(220,250,245,0.46)",
              maxWidth: 500,
              margin: "0 auto 42px",
              lineHeight: 1.8,
            }}
          >
            Vendors, Buyers and Riders — we&apos;ve got you all covered.
          </p>
          <RoleSelector />
        </div>
      </section>

      <div style={DIV} />

      {/* PRODUCT CATEGORIES */}
      <section style={S}>
        <div style={Inn}>
          <p style={SL}>What You&apos;ll Find</p>
          <h2 style={ST}>Fashion for everyone, from every market</h2>
          <div
            className="cat-g"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4,1fr)",
              gap: 12,
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
                label: "Bike Delivery 🛵",
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
                className="cat-tile"
                style={{
                  borderRadius: 14,
                  overflow: "hidden",
                  position: "relative",
                  aspectRatio: "1",
                  transition: "transform 0.3s cubic-bezier(0.34,1.56,0.64,1)",
                  cursor: "default",
                  willChange: "transform",
                }}
              >
                {/* FIX 2: added sizes prop */}
                <Image
                  src={c.img}
                  alt={c.label}
                  fill
                  sizes="(max-width: 600px) 50vw, (max-width: 960px) 25vw, 275px"
                  style={{ objectFit: "cover" }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(to top,rgba(5,12,11,0.97) 0%,rgba(5,12,11,0.04) 52%)",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    top: 9,
                    right: 9,
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "#f59e0b",
                    opacity: 0.65,
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    bottom: 10,
                    left: 12,
                    right: 12,
                  }}
                >
                  <p
                    style={{
                      fontSize: 12.5,
                      fontWeight: 800,
                      color: "#edfaf7",
                      marginBottom: 2,
                    }}
                  >
                    {c.label}
                  </p>
                  <p style={{ fontSize: 10.5, color: "rgba(220,250,245,0.4)" }}>
                    {c.sub}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div style={DIV} />

      {/* HOW IT WORKS */}
      <section style={S} id="how-it-works">
        <div style={Inn}>
          <p style={SL}>The O-Fash Flow</p>
          <h2 style={ST}>From discovery to doorstep in 3 moves</h2>
          <div
            className="steps-g"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3,1fr)",
              gap: 17,
            }}
          >
            {[
              {
                n: "01",
                icon: "🛍",
                title: "Buyers Browse & Buy",
                desc: "Discover curated fashion from hundreds of verified vendors across Nigeria's biggest markets. Clothes, shoes, wigs, bags all genders, all ages.",
                img: IMG.clothesMen,
                color: "#5eead4",
              },
              {
                n: "02",
                icon: "🏪",
                title: "Vendors Post & Sell",
                desc: "List your collections, manage your digital market stall, and reach thousands of buyers nationwide. From boutiques to market traders everyone wins.",
                img: IMG.vendor1,
                color: "#fbbf24",
              },
              {
                n: "03",
                icon: "🛵",
                title: "Riders Pick & Deliver",
                desc: "Our vetted bike rider network picks up from vendors and delivers to your door. Fast, tracked, and reliable 30 minutes to 5 hours, every time.",
                img: IMG.riderBike,
                color: "#fb923c",
              },
            ].map((step) => (
              <div
                key={step.n}
                className="step-card glass"
                style={{
                  borderRadius: 20,
                  overflow: "hidden",
                  transition:
                    "border-color 0.28s,transform 0.28s cubic-bezier(0.34,1.56,0.64,1)",
                  willChange: "transform",
                }}
              >
                <div
                  style={{
                    height: 192,
                    overflow: "hidden",
                    position: "relative",
                  }}
                >
                  {/* FIX 2: added sizes prop */}
                  <Image
                    src={step.img}
                    alt={step.title}
                    fill
                    sizes="(max-width: 960px) 100vw, 33vw"
                    style={{ objectFit: "cover" }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "linear-gradient(to top,rgba(5,12,11,0.97) 0%,rgba(5,12,11,0.14) 62%)",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      top: 11,
                      right: 13,
                      fontSize: 52,
                      fontWeight: 900,
                      color: "rgba(255,255,255,0.07)",
                      lineHeight: 1,
                    }}
                  >
                    {step.n}
                  </div>
                  <div
                    style={{
                      position: "absolute",
                      bottom: 10,
                      left: 13,
                      width: 42,
                      height: 42,
                      borderRadius: 10,
                      background: "rgba(5,12,11,0.88)",
                      border: "1px solid rgba(20,184,166,0.28)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 19,
                    }}
                  >
                    {step.icon}
                  </div>
                </div>
                <div style={{ padding: "19px 21px 24px" }}>
                  <h3
                    style={{
                      fontSize: 17,
                      fontWeight: 900,
                      marginBottom: 8,
                      fontFamily: "'Playfair Display',serif",
                      color: step.color,
                    }}
                  >
                    {step.title}
                  </h3>
                  <p
                    style={{
                      fontSize: 13.5,
                      color: "rgba(220,250,245,0.49)",
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

      {/* TRUST & SAFETY */}
      <section style={S} id="trust">
        <div style={Inn}>
          <p style={SL}>Trust & Safety</p>
          <h2 style={ST}>Your money, your goods always protected</h2>
          <div
            className="trust-g"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4,1fr)",
              gap: 12,
            }}
          >
            {[
              {
                icon: "🔒",
                t: "Secure Escrow Payments",
                d: "Your money is held safely until you confirm delivery then released to the vendor.",
              },
              {
                icon: "✅",
                t: "Verified Vendors Only",
                d: "Every seller goes through strict onboarding checks before listing any product.",
              },
              {
                icon: "🛡",
                t: "Buyer Protection",
                d: "Items can be returned if not delivered as described. Your purchase is fully backed.",
              },
              {
                icon: "⚡",
                t: "Fast Refunds",
                d: "Refunds processed within 24–48 hours. No long waits, no runarounds.",
              },
              {
                icon: "📱",
                t: "Seamless Experience",
                d: "Clean, fast, glitch-free. A premium digital market in your pocket.",
              },
              {
                icon: "🛵",
                t: "Live Bike Tracking",
                d: "Watch your rider in real-time from vendor pickup to your doorstep.",
              },
              {
                icon: "🌍",
                t: "Built for Africa",
                d: "Designed by people who understand Nigerian fashion markets deeply.",
              },
              {
                icon: "💬",
                t: "24/7 Support",
                d: "Our team is available via app, WhatsApp, or email any time of day.",
              },
            ].map((f, i) => (
              <div
                key={i}
                className="trust-card glass"
                style={{
                  padding: 19,
                  borderRadius: 16,
                  transition: "border-color 0.28s,transform 0.28s ease",
                  willChange: "transform",
                }}
              >
                <div style={{ fontSize: 24, marginBottom: 10 }}>{f.icon}</div>
                <h3
                  style={{
                    fontSize: 13,
                    fontWeight: 800,
                    marginBottom: 6,
                    color: "#edfaf7",
                  }}
                >
                  {f.t}
                </h3>
                <p
                  style={{
                    fontSize: 12.5,
                    color: "rgba(220,250,245,0.45)",
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

      {/* RIDER SECTION */}
      <section style={{ ...S, padding: "78px 24px" }}>
        <div
          className="rider-g"
          style={{
            ...Inn,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 50,
            alignItems: "center",
          }}
        >
          <div>
            <p style={SL}>For Bike Riders</p>
            <h2 style={{ ...ST, marginBottom: 15 }}>
              Earn on your terms. Ride & deliver fashion across your city.
            </h2>
            <p
              style={{
                fontSize: 15,
                color: "rgba(220,250,245,0.5)",
                lineHeight: 1.8,
                marginBottom: 21,
              }}
            >
              Join our growing bike rider network. Set your hours, maximise
              earnings, and help connect buyers with the fashion they love.
            </p>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 8,
                marginBottom: 24,
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
                    background: "rgba(13,148,136,0.09)",
                    border: "1px solid rgba(20,184,166,0.2)",
                    fontSize: 11.5,
                    color: "#5eead4",
                    fontWeight: 700,
                  }}
                >
                  {p}
                </span>
              ))}
            </div>
            <button
              className="btn-p"
              onClick={() =>
                document
                  .querySelector("#waitlist")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              style={{
                padding: "13px 27px",
                borderRadius: 12,
                background: "linear-gradient(135deg,#065f58,#0d9488,#14b8a6)",
                color: "#edfaf7",
                fontWeight: 800,
                fontSize: 14,
                cursor: "pointer",
                border: "none",
                fontFamily: "'DM Sans',sans-serif",
                boxShadow: "0 6px 20px rgba(13,148,136,0.3)",
                transition: "transform 0.15s,box-shadow 0.2s",
                willChange: "transform",
              }}
            >
              Register as a Rider 🛵 →
            </button>
          </div>

          <div style={{ position: "relative" }}>
            <div
              style={{
                borderRadius: 22,
                overflow: "hidden",
                aspectRatio: "4/3",
                position: "relative",
                boxShadow:
                  "0 28px 78px rgba(0,0,0,0.48),0 0 0 1px rgba(20,184,166,0.14)",
              }}
            >
              {/* FIX 2: added sizes prop */}
              <Image
                src={IMG.riderBike}
                alt="O-Fash bike rider"
                fill
                sizes="(max-width: 960px) 100vw, 50vw"
                style={{ objectFit: "cover" }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(135deg,rgba(5,12,11,0.16),rgba(5,12,11,0.01))",
                }}
              />
            </div>
            <div
              className="glass"
              style={{
                position: "absolute",
                bottom: 16,
                left: 16,
                right: 16,
                padding: "13px 17px",
                borderRadius: 13,
                backdropFilter: "blur(16px)",
                boxShadow:
                  "0 8px 30px rgba(0,0,0,0.38),inset 0 1px 0 rgba(167,243,208,0.07)",
              }}
            >
              <p
                style={{
                  fontSize: 12.5,
                  fontWeight: 700,
                  color: "#5eead4",
                  marginBottom: 3,
                  animation: "ride-across 0.6s ease",
                }}
              >
                🛵 Active Rider · Lagos Island
              </p>
              <p style={{ fontSize: 11.5, color: "rgba(220,250,245,0.46)" }}>
                3 deliveries today · ₦12,400 earned
              </p>
            </div>
            <div
              style={{
                position: "absolute",
                top: -18,
                right: -18,
                width: 72,
                height: 72,
                borderRadius: "50%",
                background: "rgba(245,158,11,0.11)",
                filter: "blur(18px)",
                pointerEvents: "none",
              }}
            />
          </div>
        </div>
      </section>

      <div style={DIV} />

      {/* WAITLIST */}
      <section
        style={{ ...S, paddingBottom: 78, textAlign: "center" }}
        id="waitlist"
      >
        <div style={{ ...Inn, maxWidth: 820 }}>
          <p style={SL}>Join the Waitlist</p>
          <h2
            style={{
              ...ST,
              maxWidth: "100%",
              textAlign: "center",
              marginBottom: 11,
            }}
          >
            Be the first to access Africa&apos;s digital fashion market
          </h2>
          <p
            style={{
              fontSize: 15,
              color: "rgba(220,250,245,0.46)",
              maxWidth: 490,
              margin: "0 auto 34px",
              lineHeight: 1.8,
            }}
          >
            Founding members get exclusive early access and special perks.
          </p>
          <MovingBorderCard r={26}>
            <div
              className="wl-pad"
              style={{
                padding: "50px 46px",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: -90,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: 460,
                  height: 460,
                  borderRadius: "50%",
                  background:
                    "radial-gradient(circle,rgba(13,148,136,0.08) 0%,rgba(245,158,11,0.025) 50%,transparent 70%)",
                  pointerEvents: "none",
                }}
              />
              <div style={{ position: "relative", zIndex: 1 }}>
                <div
                  style={{
                    fontSize: 40,
                    marginBottom: 11,
                    animation: "float-y 2.6s ease-in-out infinite",
                  }}
                >
                  🛍
                </div>
                <h3
                  style={{
                    fontFamily: "'Playfair Display',serif",
                    fontSize: "clamp(21px,2.8vw,34px)",
                    fontWeight: 900,
                    marginBottom: 10,
                    letterSpacing: "-1.5px",
                  }}
                >
                  Reserve Your Spot Now
                </h3>
                <p
                  style={{
                    fontSize: 13.5,
                    color: "rgba(220,250,245,0.45)",
                    lineHeight: 1.78,
                    maxWidth: 430,
                    margin: "0 auto 28px",
                  }}
                >
                  Enter your email and WhatsApp. We&apos;ll only contact you
                  about our launch.
                </p>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <WaitlistForm />
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: 20,
                    marginTop: 20,
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
                        fontSize: 11.5,
                        color: "rgba(220,250,245,0.26)",
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

      {/* FAQ */}
      <section style={S} id="faq">
        <div style={Inn}>
          <p style={SL}>FAQ</p>
          <h2 style={ST}>Questions we know you have</h2>
          <FAQ />
        </div>
      </section>

      <div style={DIV} />

      {/* INQUIRY */}
      <section style={{ ...S, padding: "74px 24px" }}>
        <div style={{ ...Inn, maxWidth: 740 }}>
          <p style={SL}>Your Voice Matters</p>
          <h2 style={{ ...ST, marginBottom: 11 }}>
            Help us build what you need
          </h2>
          <p
            style={{
              fontSize: 15,
              color: "rgba(220,250,245,0.45)",
              lineHeight: 1.8,
              marginBottom: 24,
            }}
          >
            Tell us what features you&apos;d like us to add, or any concerns.
            Life&apos;s already hard let us help make sale, purchase and
            delivery easier for you.
          </p>
          <InquiryBox />
        </div>
      </section>

      {/* CLOSING QUOTE */}
      <section
        style={{
          textAlign: "center",
          padding: "54px 24px 94px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", inset: 0 }}>
          {/* FIX 2: added sizes prop */}
          <Image
            src={IMG.africanFashion}
            alt=""
            fill
            sizes="100vw"
            style={{
              objectFit: "cover",
              opacity: 0.065,
              filter: "sepia(22%) hue-rotate(128deg)",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to bottom,#050c0b 0%,rgba(5,12,11,0.44) 50%,#050c0b 100%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(245,158,11,0.02)",
            }}
          />
        </div>
        <div
          style={{
            position: "relative",
            zIndex: 1,
            maxWidth: 600,
            margin: "0 auto",
          }}
        >
          <p
            style={{
              fontFamily: "'Playfair Display',serif",
              fontSize: "clamp(16px,2.5vw,31px)",
              fontWeight: 700,
              fontStyle: "italic",
              color: "rgba(220,250,245,0.56)",
              lineHeight: 1.65,
              marginBottom: 32,
            }}
          >
            &ldquo;Life&apos;s already hard let us help make sale, purchase and
            delivery easier for you in the way that we can.&rdquo;
          </p>
          <OFashLogo size={50} textSize={20} />
          <p
            style={{
              fontSize: 11,
              color: "rgba(220,250,245,0.21)",
              marginTop: 9,
            }}
          >
            🚀 Launching soon in Lagos, expanding rapidly
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer
        style={{
          padding: "54px 48px 38px",
          borderTop: "1px solid rgba(20,184,166,0.08)",
          background: "rgba(3,6,5,0.97)",
        }}
      >
        <div
          className="footer-g"
          style={{
            display: "grid",
            gridTemplateColumns: "1.8fr 1fr 1fr 1fr",
            gap: 40,
            maxWidth: 1100,
            margin: "0 auto 42px",
          }}
        >
          <div>
            <OFashLogo size={42} textSize={16} />
            <p
              style={{
                fontSize: 13,
                color: "rgba(220,250,245,0.34)",
                lineHeight: 1.8,
                marginTop: 13,
                maxWidth: 245,
              }}
            >
              Nigeria&apos;s premier fashion marketplace the digital twin of
              Africa&apos;s local fashion markets, connecting buyers, vendors
              and riders.
            </p>
            <p
              style={{
                fontSize: 11.5,
                color: "rgba(20,184,166,0.58)",
                marginTop: 8,
                fontWeight: 700,
              }}
            >
              🚀 Launching soon in Lagos · Expanding rapidly
            </p>
            <div style={{ display: "flex", gap: 7, marginTop: 17 }}>
              {["𝕏", "in", "📸", "▶"].map((icon) => (
                <button
                  key={icon}
                  className="social-btn"
                  style={{
                    width: 33,
                    height: 33,
                    borderRadius: 8,
                    background: "rgba(20,184,166,0.065)",
                    border: "1px solid rgba(20,184,166,0.14)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 13,
                    cursor: "pointer",
                    transition: "all 0.18s",
                    color: "#edfaf7",
                  }}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>
          {[
            {
              title: "Company",
              links: [["About Us"], ["Careers"], ["Blog"], ["Press Kit"]],
            },
            {
              title: "Legal",
              links: [
                ["Privacy Policy", "privacy"],
                ["Terms of Service", "terms"],
                ["Cookie Policy", "privacy"],
                ["Vendor Agreement"],
              ],
            },
            {
              title: "Support",
              links: [
                ["Contact Us", "contact"],
                ["Help Centre"],
                ["Rider Support"],
                ["Vendor Support"],
              ],
            },
          ].map((col) => (
            <div key={col.title}>
              <p
                style={{
                  fontSize: 10.5,
                  fontWeight: 800,
                  letterSpacing: "0.15em",
                  color: "rgba(220,250,245,0.26)",
                  textTransform: "uppercase",
                  marginBottom: 15,
                }}
              >
                {col.title}
              </p>
              <div
                style={{ display: "flex", flexDirection: "column", gap: 10 }}
              >
                {col.links.map(([l, p]) => (
                  <button
                    key={l}
                    className="footer-link"
                    onClick={p ? () => open(p as ModalPage) : undefined}
                    style={{
                      ...flBtn(),
                      fontSize: 13,
                      color: "rgba(220,250,245,0.42)",
                    }}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 12,
            maxWidth: 1100,
            margin: "0 auto",
            paddingTop: 24,
            borderTop: "1px solid rgba(20,184,166,0.065)",
          }}
        >
          <p style={{ fontSize: 11.5, color: "rgba(220,250,245,0.21)" }}>
            © {new Date().getFullYear()} O-Fash Markett. All rights reserved.
            Nigeria 🇳🇬
          </p>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 11,
              color: "rgba(220,250,245,0.23)",
            }}
          >
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: "#14b8a6",
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
            ].map(([l, p]) => (
              <button
                key={l}
                className="footer-link"
                onClick={() => open(p as ModalPage)}
                style={{
                  ...flBtn(),
                  fontSize: 11.5,
                  color: "rgba(220,250,245,0.28)",
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
