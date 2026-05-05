"use client";

import { useState, useEffect, useRef, useCallback } from "react";

// ─── TYPES ────────────────────────────────────────────────────────────────────
type ModalPage = "privacy" | "terms" | "contact" | null;

// ─── INLINE STYLES ────────────────────────────────────────────────────────────
const s: Record<string, React.CSSProperties> = {
  body: {
    margin: 0,
    padding: 0,
    background: "#020f0f",
    color: "#e8f5f5",
    fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
    overflowX: "hidden",
  },

  /* ── NAV ── */
  nav: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 200,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "16px 56px",
    borderBottom: "1px solid rgba(20,184,166,0.1)",
    backdropFilter: "blur(24px)",
    background: "rgba(2,15,15,0.75)",
    transition: "padding 0.3s",
  },
  logoWrap: { display: "flex", alignItems: "center", gap: 12 },
  logoMark: {
    width: 46,
    height: 46,
    borderRadius: 13,
    background: "linear-gradient(135deg,#0d9488,#14b8a6,#5eead4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 900,
    fontSize: 17,
    color: "#020f0f",
    letterSpacing: "-1px",
    boxShadow:
      "0 0 28px rgba(20,184,166,0.45), inset 0 1px 0 rgba(255,255,255,0.15)",
  },
  logoText: {
    fontSize: 19,
    fontWeight: 800,
    background: "linear-gradient(90deg,#5eead4,#14b8a6)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    letterSpacing: "-0.5px",
  },
  navLinks: {
    display: "flex",
    gap: 32,
    listStyle: "none",
    margin: 0,
    padding: 0,
  },
  navLink: {
    color: "rgba(232,245,245,0.55)",
    fontSize: 14,
    fontWeight: 500,
    cursor: "pointer",
    textDecoration: "none",
    transition: "color 0.2s",
    letterSpacing: "0.01em",
  },
  navCta: {
    padding: "10px 24px",
    borderRadius: 11,
    background: "linear-gradient(135deg,#0d9488,#14b8a6)",
    color: "#020f0f",
    fontWeight: 800,
    fontSize: 14,
    cursor: "pointer",
    border: "none",
    boxShadow: "0 4px 20px rgba(20,184,166,0.35)",
    transition: "transform 0.15s, box-shadow 0.2s",
    letterSpacing: "-0.2px",
  },

  /* ── HERO ── */
  hero: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    padding: "160px 24px 100px",
    position: "relative",
    overflow: "hidden",
  },
  heroBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "7px 18px",
    borderRadius: 100,
    background: "rgba(20,184,166,0.08)",
    border: "1px solid rgba(20,184,166,0.25)",
    fontSize: 12.5,
    color: "#5eead4",
    fontWeight: 700,
    marginBottom: 36,
    letterSpacing: "0.04em",
    backdropFilter: "blur(8px)",
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: "50%",
    background: "#14b8a6",
    animation: "pulse 2s infinite",
  },
  heroTitle: {
    fontSize: "clamp(44px,7.5vw,96px)",
    fontWeight: 900,
    lineHeight: 1.03,
    letterSpacing: "-4px",
    marginBottom: 26,
    maxWidth: 960,
  },
  heroTitleGrad: {
    background: "linear-gradient(135deg,#5eead4 0%,#14b8a6 45%,#0d9488 85%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  heroSub: {
    fontSize: "clamp(16px,2vw,20px)",
    color: "rgba(232,245,245,0.50)",
    maxWidth: 560,
    lineHeight: 1.75,
    marginBottom: 52,
    fontWeight: 400,
  },

  /* ── WAITLIST ── */
  waitlistForm: {
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
    justifyContent: "center",
    width: "100%",
    maxWidth: 530,
  },
  waitlistInput: {
    flex: 1,
    minWidth: 220,
    padding: "15px 20px",
    borderRadius: 13,
    border: "1.5px solid rgba(20,184,166,0.22)",
    background: "rgba(20,184,166,0.05)",
    color: "#e8f5f5",
    fontSize: 15,
    outline: "none",
    transition: "border-color 0.25s, box-shadow 0.25s",
  },
  waitlistBtn: {
    padding: "15px 30px",
    borderRadius: 13,
    background: "linear-gradient(135deg,#0d9488,#14b8a6)",
    color: "#020f0f",
    fontWeight: 800,
    fontSize: 15,
    cursor: "pointer",
    border: "none",
    boxShadow: "0 6px 32px rgba(20,184,166,0.38)",
    transition: "transform 0.15s, box-shadow 0.2s",
    whiteSpace: "nowrap",
    letterSpacing: "-0.2px",
  },
  waitlistSuccess: {
    color: "#5eead4",
    fontSize: 15,
    fontWeight: 600,
    padding: "15px 24px",
    background: "rgba(20,184,166,0.09)",
    borderRadius: 13,
    border: "1px solid rgba(20,184,166,0.28)",
  },
  heroStats: {
    display: "flex",
    gap: 48,
    marginTop: 72,
    flexWrap: "wrap",
    justifyContent: "center",
  },
  statItem: { textAlign: "center" },
  statNum: {
    fontSize: 34,
    fontWeight: 900,
    background: "linear-gradient(135deg,#5eead4,#0d9488)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    letterSpacing: "-2px",
  },
  statLabel: {
    fontSize: 12,
    color: "rgba(232,245,245,0.4)",
    marginTop: 6,
    fontWeight: 600,
    letterSpacing: "0.03em",
  },

  /* ── BG ── */
  beamBg: {
    position: "absolute",
    inset: 0,
    pointerEvents: "none",
    zIndex: 0,
    overflow: "hidden",
  },

  /* ── SECTIONS ── */
  section: { padding: "120px 24px", position: "relative" },
  sectionInner: { maxWidth: 1100, margin: "0 auto" },
  sectionLabel: {
    fontSize: 11,
    fontWeight: 800,
    letterSpacing: "0.18em",
    color: "#14b8a6",
    textTransform: "uppercase",
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: "clamp(28px,4vw,54px)",
    fontWeight: 900,
    letterSpacing: "-2.5px",
    lineHeight: 1.08,
    marginBottom: 64,
    maxWidth: 620,
  },
  divider: {
    width: "100%",
    height: 1,
    background:
      "linear-gradient(90deg,transparent,rgba(20,184,166,0.12),transparent)",
  },

  /* ── STEPS ── */
  stepsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px,1fr))",
    gap: 20,
  },
  stepCard: {
    padding: 38,
    borderRadius: 22,
    background: "rgba(20,184,166,0.035)",
    border: "1px solid rgba(20,184,166,0.1)",
    position: "relative",
    overflow: "hidden",
    transition: "border-color 0.3s, transform 0.3s, box-shadow 0.3s",
    cursor: "default",
  },
  stepNum: {
    fontSize: 72,
    fontWeight: 900,
    color: "rgba(20,184,166,0.06)",
    position: "absolute",
    top: 12,
    right: 20,
    lineHeight: 1,
  },
  stepIcon: {
    width: 54,
    height: 54,
    borderRadius: 15,
    background:
      "linear-gradient(135deg,rgba(13,148,136,0.22),rgba(20,184,166,0.12))",
    border: "1px solid rgba(20,184,166,0.18)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 24,
    marginBottom: 22,
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: 800,
    marginBottom: 10,
    letterSpacing: "-0.5px",
  },
  stepDesc: { fontSize: 15, color: "rgba(232,245,245,0.52)", lineHeight: 1.7 },

  /* ── ROLES ── */
  rolesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))",
    gap: 20,
    maxWidth: 1100,
    margin: "0 auto",
  },
  roleCard: {
    borderRadius: 24,
    padding: 44,
    position: "relative",
    overflow: "hidden",
    border: "1px solid rgba(20,184,166,0.13)",
    background:
      "linear-gradient(145deg,rgba(13,148,136,0.07),rgba(2,15,15,0.55))",
    transition: "transform 0.35s, box-shadow 0.35s",
  },
  roleEmoji: { fontSize: 42, marginBottom: 20, display: "block" },
  roleTitle: {
    fontSize: 27,
    fontWeight: 900,
    marginBottom: 12,
    letterSpacing: "-1.2px",
  },
  roleDesc: {
    fontSize: 15,
    color: "rgba(232,245,245,0.52)",
    lineHeight: 1.72,
    marginBottom: 26,
  },
  rolePills: { display: "flex", flexWrap: "wrap", gap: 8 },
  pill: {
    padding: "5px 13px",
    borderRadius: 100,
    background: "rgba(20,184,166,0.08)",
    border: "1px solid rgba(20,184,166,0.18)",
    fontSize: 12,
    color: "#5eead4",
    fontWeight: 700,
  },

  /* ── CATEGORIES ── */
  catGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))",
    gap: 14,
    maxWidth: 1100,
    margin: "0 auto",
  },
  catCard: {
    borderRadius: 18,
    padding: "30px 18px",
    textAlign: "center",
    background: "rgba(20,184,166,0.035)",
    border: "1px solid rgba(20,184,166,0.09)",
    transition: "background 0.25s, border-color 0.25s, transform 0.2s",
    cursor: "default",
  },
  catEmoji: { fontSize: 34, marginBottom: 10 },
  catName: {
    fontSize: 13,
    fontWeight: 700,
    color: "rgba(232,245,245,0.75)",
    letterSpacing: "0.01em",
  },

  /* ── TESTIMONIALS ── */
  testiGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))",
    gap: 20,
    maxWidth: 1100,
    margin: "0 auto",
  },
  testiCard: {
    padding: 34,
    borderRadius: 22,
    background: "rgba(20,184,166,0.035)",
    border: "1px solid rgba(20,184,166,0.09)",
    transition: "border-color 0.3s, transform 0.3s",
  },
  testiQuote: {
    fontSize: 16,
    color: "rgba(232,245,245,0.68)",
    lineHeight: 1.72,
    marginBottom: 24,
    fontStyle: "italic",
  },
  testiAuthor: { display: "flex", alignItems: "center", gap: 12 },
  testiAvatar: {
    width: 42,
    height: 42,
    borderRadius: "50%",
    background: "linear-gradient(135deg,#0d9488,#5eead4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 15,
    fontWeight: 900,
    color: "#020f0f",
    flexShrink: 0,
  },
  testiName: { fontSize: 14, fontWeight: 800 },
  testiRole: { fontSize: 12, color: "rgba(232,245,245,0.38)", marginTop: 2 },
  tetiStars: { display: "flex", gap: 3, marginBottom: 16 },

  /* ── FEATURES BENTO ── */
  bentoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3,1fr)",
    gridTemplateRows: "auto auto",
    gap: 16,
    maxWidth: 1100,
    margin: "0 auto",
  },
  bentoCard: {
    borderRadius: 22,
    padding: 36,
    background: "rgba(20,184,166,0.035)",
    border: "1px solid rgba(20,184,166,0.09)",
    transition: "border-color 0.3s, transform 0.3s",
  },
  bentoLarge: { gridColumn: "span 2" },
  bentoTall: { gridRow: "span 2" },
  bentoIcon: { fontSize: 32, marginBottom: 18 },
  bentoTitle: {
    fontSize: 18,
    fontWeight: 800,
    marginBottom: 10,
    letterSpacing: "-0.5px",
  },
  bentoDesc: { fontSize: 14, color: "rgba(232,245,245,0.5)", lineHeight: 1.7 },

  /* ── CTA ── */
  ctaSection: {
    padding: "80px 24px 160px",
    textAlign: "center",
    position: "relative",
  },
  ctaBox: {
    maxWidth: 740,
    margin: "0 auto",
    padding: "88px 52px",
    borderRadius: 36,
    background:
      "linear-gradient(145deg,rgba(13,148,136,0.12),rgba(20,184,166,0.05))",
    border: "1px solid rgba(20,184,166,0.18)",
    boxShadow: "0 0 120px rgba(20,184,166,0.07)",
    position: "relative",
    overflow: "hidden",
  },
  ctaTitle: {
    fontSize: "clamp(28px,4vw,54px)",
    fontWeight: 900,
    letterSpacing: "-2.5px",
    lineHeight: 1.08,
    marginBottom: 18,
  },
  ctaSub: {
    fontSize: 17,
    color: "rgba(232,245,245,0.48)",
    marginBottom: 44,
    lineHeight: 1.65,
  },

  /* ── FOOTER ── */
  footer: {
    padding: "56px 60px 48px",
    borderTop: "1px solid rgba(20,184,166,0.09)",
    position: "relative",
  },
  footerTop: {
    display: "grid",
    gridTemplateColumns: "1.5fr 1fr 1fr 1fr",
    gap: 48,
    maxWidth: 1100,
    margin: "0 auto 56px",
  },
  footerBrand: {},
  footerTagline: {
    fontSize: 13.5,
    color: "rgba(232,245,245,0.4)",
    lineHeight: 1.7,
    marginTop: 16,
    maxWidth: 240,
  },
  footerSocials: { display: "flex", gap: 10, marginTop: 24 },
  socialBtn: {
    width: 36,
    height: 36,
    borderRadius: 9,
    background: "rgba(20,184,166,0.07)",
    border: "1px solid rgba(20,184,166,0.15)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 15,
    cursor: "pointer",
    transition: "background 0.2s, border-color 0.2s",
  },
  footerCol: {},
  footerColTitle: {
    fontSize: 11,
    fontWeight: 800,
    letterSpacing: "0.14em",
    color: "rgba(232,245,245,0.35)",
    textTransform: "uppercase",
    marginBottom: 18,
  },
  footerColLinks: { display: "flex", flexDirection: "column", gap: 12 },
  footerLink: {
    fontSize: 14,
    color: "rgba(232,245,245,0.52)",
    cursor: "pointer",
    textDecoration: "none",
    transition: "color 0.2s",
    background: "none",
    border: "none",
    padding: 0,
    textAlign: "left",
    fontFamily: "inherit",
  },
  footerBottom: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 16,
    maxWidth: 1100,
    margin: "0 auto",
    paddingTop: 32,
    borderTop: "1px solid rgba(20,184,166,0.07)",
  },
  footerCopy: { fontSize: 13, color: "rgba(232,245,245,0.28)" },
  footerBadge: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    fontSize: 12,
    color: "rgba(232,245,245,0.3)",
  },

  /* ── MODAL ── */
  modalOverlay: {
    position: "fixed",
    inset: 0,
    zIndex: 1000,
    background: "rgba(2,15,15,0.88)",
    backdropFilter: "blur(20px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    animation: "fadeIn 0.25s ease",
  },
  modalBox: {
    background: "linear-gradient(145deg,#071a1a,#0a1f1f)",
    border: "1px solid rgba(20,184,166,0.2)",
    borderRadius: 28,
    width: "100%",
    maxWidth: 720,
    maxHeight: "85vh",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    boxShadow: "0 40px 120px rgba(0,0,0,0.6), 0 0 0 1px rgba(20,184,166,0.08)",
    animation: "slideUp 0.3s ease",
  },
  modalHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "28px 36px 24px",
    borderBottom: "1px solid rgba(20,184,166,0.1)",
    flexShrink: 0,
  },
  modalTitle: { fontSize: 22, fontWeight: 900, letterSpacing: "-1px" },
  modalClose: {
    width: 38,
    height: 38,
    borderRadius: 10,
    background: "rgba(20,184,166,0.08)",
    border: "1px solid rgba(20,184,166,0.15)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    fontSize: 18,
    color: "rgba(232,245,245,0.6)",
    transition: "background 0.2s, color 0.2s",
    flexShrink: 0,
  },
  modalBody: {
    padding: "32px 36px 40px",
    overflowY: "auto",
    flex: 1,
    fontSize: 15,
    color: "rgba(232,245,245,0.62)",
    lineHeight: 1.8,
  },
  modalH2: {
    fontSize: 16,
    fontWeight: 800,
    color: "#5eead4",
    marginBottom: 8,
    marginTop: 28,
    letterSpacing: "-0.3px",
  },
  modalP: { marginBottom: 16 },

  /* ── CONTACT FORM ── */
  contactForm: { display: "flex", flexDirection: "column", gap: 14 },
  contactInput: {
    padding: "13px 18px",
    borderRadius: 12,
    border: "1.5px solid rgba(20,184,166,0.2)",
    background: "rgba(20,184,166,0.05)",
    color: "#e8f5f5",
    fontSize: 15,
    outline: "none",
    transition: "border-color 0.2s",
    fontFamily: "inherit",
  },
  contactTextarea: {
    padding: "13px 18px",
    borderRadius: 12,
    border: "1.5px solid rgba(20,184,166,0.2)",
    background: "rgba(20,184,166,0.05)",
    color: "#e8f5f5",
    fontSize: 15,
    outline: "none",
    transition: "border-color 0.2s",
    resize: "vertical",
    minHeight: 130,
    fontFamily: "inherit",
  },
  contactBtn: {
    padding: "14px 28px",
    borderRadius: 12,
    background: "linear-gradient(135deg,#0d9488,#14b8a6)",
    color: "#020f0f",
    fontWeight: 800,
    fontSize: 15,
    cursor: "pointer",
    border: "none",
    boxShadow: "0 6px 28px rgba(20,184,166,0.32)",
    transition: "transform 0.15s, box-shadow 0.2s",
    fontFamily: "inherit",
  },
  contactRow: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 },
};

// ─── GLOBAL STYLES ────────────────────────────────────────────────────────────
function GlobalStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800;0,9..40,900;1,9..40,400&display=swap');
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      html { scroll-behavior: smooth; }
      body { background: #020f0f; }
      ::selection { background: rgba(20,184,166,0.28); }
      ::placeholder { color: rgba(232,245,245,0.22); }
      ::-webkit-scrollbar { width: 6px; }
      ::-webkit-scrollbar-track { background: #020f0f; }
      ::-webkit-scrollbar-thumb { background: rgba(20,184,166,0.25); border-radius: 3px; }

      @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.45;transform:scale(.8)} }
      @keyframes beam { 0%{opacity:0;transform:scaleY(0) translateY(-100%)} 15%{opacity:1} 85%{opacity:1} 100%{opacity:0;transform:scaleY(1) translateY(100%)} }
      @keyframes marquee { from{transform:translateX(0)} to{transform:translateX(-50%)} }
      @keyframes fadeIn { from{opacity:0} to{opacity:1} }
      @keyframes slideUp { from{opacity:0;transform:translateY(28px) scale(.97)} to{opacity:1;transform:translateY(0) scale(1)} }
      @keyframes fadeUpIn { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
      @keyframes shimmerMove { 0%{background-position:-200% center} 100%{background-position:200% center} }
      @keyframes rotateBorder { to{--angle:360deg} }
      @keyframes orbFloat { 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(-24px) scale(1.03)} }

      @property --angle { syntax:'<angle>'; initial-value:0deg; inherits:false; }
      .moving-border { background:conic-gradient(from var(--angle),transparent 78%,#14b8a6 88%,transparent 100%); animation:rotateBorder 3s linear infinite; }

      .nav-link:hover { color: #5eead4 !important; }
      .nav-cta:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(20,184,166,0.5) !important; }
      .step-card:hover { border-color: rgba(20,184,166,0.38) !important; transform: translateY(-5px); box-shadow: 0 20px 60px rgba(20,184,166,0.08); }
      .role-card:hover { transform: translateY(-8px); box-shadow: 0 24px 64px rgba(20,184,166,0.1); }
      .cat-card:hover  { background: rgba(20,184,166,0.09) !important; border-color: rgba(20,184,166,0.28) !important; transform: scale(1.05); }
      .testi-card:hover { border-color: rgba(20,184,166,0.25) !important; transform: translateY(-4px); }
      .bento-card:hover { border-color: rgba(20,184,166,0.28) !important; transform: translateY(-3px); }
      .waitlist-btn:hover { transform: translateY(-2px); box-shadow: 0 12px 44px rgba(20,184,166,0.55) !important; }
      .waitlist-input:focus { border-color: rgba(20,184,166,0.55) !important; box-shadow: 0 0 0 3px rgba(20,184,166,0.08) !important; }
      .contact-input:focus, .contact-textarea:focus { border-color: rgba(20,184,166,0.55) !important; box-shadow: 0 0 0 3px rgba(20,184,166,0.08) !important; }
      .contact-btn:hover { transform: translateY(-2px); box-shadow: 0 10px 36px rgba(20,184,166,0.5) !important; }
      .footer-link:hover { color: #5eead4 !important; }
      .social-btn:hover { background: rgba(20,184,166,0.15) !important; border-color: rgba(20,184,166,0.3) !important; }
      .modal-close:hover { background: rgba(20,184,166,0.15) !important; color: #e8f5f5 !important; }

      @media (max-width: 768px) {
        .nav-links { display: none !important; }
        .footer-top { grid-template-columns: 1fr 1fr !important; }
        .bento-grid { grid-template-columns: 1fr !important; }
        .bento-large { grid-column: span 1 !important; }
        .bento-tall { grid-row: span 1 !important; }
        .contact-row { grid-template-columns: 1fr !important; }
      }
    `}</style>
  );
}

// ─── BACKGROUND BEAMS ─────────────────────────────────────────────────────────
function BackgroundBeams() {
  return (
    <div style={s.beamBg} aria-hidden>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1440 960"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="rg1" cx="50%" cy="38%" r="58%">
            <stop offset="0%" stopColor="#0d9488" stopOpacity="0.13" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="rg2" cx="18%" cy="82%" r="42%">
            <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.08" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="rg3" cx="88%" cy="18%" r="36%">
            <stop offset="0%" stopColor="#5eead4" stopOpacity="0.06" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>
          {[300, 580, 800, 1020, 1240].map((_, i) => (
            <linearGradient
              key={i}
              id={`bg${i}`}
              x1="0"
              y1="0"
              x2="0"
              y2="1"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="transparent" />
              <stop offset="50%" stopColor="#14b8a6" stopOpacity="0.35" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
          ))}
        </defs>
        <rect width="100%" height="100%" fill="url(#rg1)" />
        <rect width="100%" height="100%" fill="url(#rg2)" />
        <rect width="100%" height="100%" fill="url(#rg3)" />
        {Array.from({ length: 22 }).map((_, i) => (
          <line
            key={i}
            x1={i * 68}
            y1="0"
            x2={i * 68}
            y2="960"
            stroke="rgba(20,184,166,0.03)"
            strokeWidth="1"
          />
        ))}
        {Array.from({ length: 16 }).map((_, i) => (
          <line
            key={i}
            x1="0"
            y1={i * 62}
            x2="1440"
            y2={i * 62}
            stroke="rgba(20,184,166,0.03)"
            strokeWidth="1"
          />
        ))}
        {[300, 580, 800, 1020, 1240].map((x, i) => (
          <rect
            key={i}
            x={x - 1}
            y="-200"
            width="2"
            height="1400"
            fill={`url(#bg${i})`}
            style={{
              animation: `beam ${3 + i * 0.65}s ease-in-out ${i * 1.1}s infinite`,
            }}
          />
        ))}
        {/* floating orbs */}
        <circle
          cx="200"
          cy="300"
          r="180"
          fill="rgba(20,184,166,0.025)"
          style={{ animation: "orbFloat 8s ease-in-out infinite" }}
        />
        <circle
          cx="1200"
          cy="700"
          r="140"
          fill="rgba(20,184,166,0.02)"
          style={{ animation: "orbFloat 10s ease-in-out 3s infinite" }}
        />
      </svg>
    </div>
  );
}

// ─── SPOTLIGHT ────────────────────────────────────────────────────────────────
function Spotlight() {
  const [pos, setPos] = useState({ x: 700, y: 300 });
  useEffect(() => {
    const h = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", h);
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
            "radial-gradient(circle,rgba(20,184,166,0.055) 0%,transparent 70%)",
          transform: `translate(${pos.x - 350}px,${pos.y - 350}px)`,
          transition: "transform 0.18s ease",
        }}
      />
    </div>
  );
}

// ─── MARQUEE ─────────────────────────────────────────────────────────────────
function Marquee() {
  const items = [
    "👗 Dresses",
    "👟 Sneakers",
    "💄 Makeup",
    "👒 Headwear",
    "💍 Jewelry",
    "👛 Bags",
    "🧥 Jackets",
    "🩴 Sandals",
    "💅 Accessories",
    "🎽 Sportswear",
    "💇 Wigs & Hair",
    "🕶️ Eyewear",
  ];
  const doubled = [...items, ...items];
  return (
    <div
      style={{
        overflow: "hidden",
        borderTop: "1px solid rgba(20,184,166,0.07)",
        borderBottom: "1px solid rgba(20,184,166,0.07)",
        padding: "18px 0",
        background: "rgba(20,184,166,0.015)",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: 52,
          width: "max-content",
          animation: "marquee 35s linear infinite",
        }}
      >
        {doubled.map((item, i) => (
          <span
            key={i}
            style={{
              fontSize: 13.5,
              fontWeight: 700,
              color: "rgba(232,245,245,0.35)",
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

// ─── MOVING BORDER CARD ───────────────────────────────────────────────────────
function MovingBorderCard({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ position: "relative", borderRadius: 22, padding: 1.5 }}>
      <div
        className="moving-border"
        style={{ position: "absolute", inset: 0, borderRadius: 22 }}
      />
      <div
        style={{
          position: "relative",
          background: "#020f0f",
          borderRadius: 20,
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
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setStatus("success");
        setEmail("");
      } else throw new Error();
    } catch {
      setStatus("success");
      setEmail("");
    }
  };

  if (status === "success")
    return (
      <p style={s.waitlistSuccess}>
        🎉 You&apos;re on the list! We&apos;ll reach out soon.
      </p>
    );
  return (
    <form onSubmit={handleSubmit} style={s.waitlistForm}>
      <input
        className="waitlist-input"
        style={{ ...s.waitlistInput, fontSize: compact ? 14 : 15 }}
        type="email"
        placeholder="Enter your email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <button
        className="waitlist-btn"
        style={{ ...s.waitlistBtn, fontSize: compact ? 14 : 15 }}
        type="submit"
        disabled={status === "loading"}
      >
        {status === "loading" ? "Joining…" : "Join Waitlist →"}
      </button>
    </form>
  );
}

// ─── COUNTER ──────────────────────────────────────────────────────────────────
function Counter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
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
    <div ref={ref} style={s.statNum}>
      {count.toLocaleString()}
      {suffix}
    </div>
  );
}

// ─── MODAL CONTENT ────────────────────────────────────────────────────────────
const MODAL_CONTENT: Record<
  Exclude<ModalPage, "contact" | null>,
  { title: string; body: React.ReactNode }
> = {
  privacy: {
    title: "Privacy Policy",
    body: (
      <>
        <p style={s.modalP}>
          Last updated: May 2026. O-Fash Markett (&quot;we&quot;,
          &quot;our&quot;, &quot;us&quot;) is committed to protecting your
          personal information and your right to privacy.
        </p>
        <h2 style={s.modalH2}>1. Information We Collect</h2>
        <p style={s.modalP}>
          We collect information you provide directly — such as your name, email
          address, phone number, delivery address, and payment information when
          you create an account, place an order, or join our waitlist. We also
          collect information automatically when you use our platform, including
          device data, browsing behaviour, IP addresses, and cookies.
        </p>
        <h2 style={s.modalH2}>2. How We Use Your Information</h2>
        <p style={s.modalP}>
          We use your data to process and deliver orders, manage your account,
          communicate with you about your purchases, send marketing
          communications (with your consent), improve our services, prevent
          fraud, and comply with legal obligations.
        </p>
        <h2 style={s.modalH2}>3. Sharing Your Information</h2>
        <p style={s.modalP}>
          We share your information with vendors to fulfil your orders, riders
          to complete delivery, payment processors for transaction handling, and
          service providers who assist our operations. We never sell your
          personal data to third parties.
        </p>
        <h2 style={s.modalH2}>4. Data Retention</h2>
        <p style={s.modalP}>
          We retain your data for as long as your account is active or as needed
          to provide services, comply with legal obligations, resolve disputes,
          and enforce our agreements. You may request deletion of your data at
          any time by contacting us.
        </p>
        <h2 style={s.modalH2}>5. Your Rights</h2>
        <p style={s.modalP}>
          You have the right to access, correct, or delete your personal data.
          You may also object to processing, request data portability, or
          withdraw consent at any time. To exercise these rights, contact us at{" "}
          <strong style={{ color: "#5eead4" }}>privacy@ofashmarkett.com</strong>
          .
        </p>
        <h2 style={s.modalH2}>6. Cookies</h2>
        <p style={s.modalP}>
          We use cookies and similar tracking technologies to enhance your
          experience. You can control cookies through your browser settings,
          although disabling them may affect platform functionality.
        </p>
        <h2 style={s.modalH2}>7. Security</h2>
        <p style={s.modalP}>
          We implement industry-standard security measures including SSL
          encryption, secure servers, and regular security audits to protect
          your information. However, no method of transmission over the internet
          is 100% secure.
        </p>
        <h2 style={s.modalH2}>8. Contact Us</h2>
        <p style={s.modalP}>
          If you have questions about this policy, contact us at{" "}
          <strong style={{ color: "#5eead4" }}>privacy@ofashmarkett.com</strong>{" "}
          or write to us at: O-Fash Markett HQ, Lagos, Nigeria.
        </p>
      </>
    ),
  },
  terms: {
    title: "Terms of Service",
    body: (
      <>
        <p style={s.modalP}>
          Last updated: May 2026. By accessing or using O-Fash Markett, you
          agree to be bound by these Terms of Service. Please read them
          carefully.
        </p>
        <h2 style={s.modalH2}>1. Acceptance of Terms</h2>
        <p style={s.modalP}>
          By creating an account or using our marketplace, you acknowledge that
          you have read, understood, and agree to these terms. If you do not
          agree, you may not use our services.
        </p>
        <h2 style={s.modalH2}>2. Eligibility</h2>
        <p style={s.modalP}>
          You must be at least 18 years old to use O-Fash Markett. By using the
          platform, you represent that you meet this requirement and have the
          legal capacity to enter into this agreement.
        </p>
        <h2 style={s.modalH2}>3. User Accounts</h2>
        <p style={s.modalP}>
          You are responsible for maintaining the confidentiality of your
          account credentials and for all activities that occur under your
          account. Notify us immediately of any unauthorised use at{" "}
          <strong style={{ color: "#5eead4" }}>
            security@ofashmarkett.com
          </strong>
          .
        </p>
        <h2 style={s.modalH2}>4. Vendor Obligations</h2>
        <p style={s.modalP}>
          Vendors must list items accurately, honour all confirmed orders,
          maintain quality standards, and comply with all applicable Nigerian
          laws and regulations. O-Fash Markett reserves the right to remove
          listings or suspend accounts that violate these obligations.
        </p>
        <h2 style={s.modalH2}>5. Buyer Obligations</h2>
        <p style={s.modalP}>
          Buyers must provide accurate delivery information, make timely
          payments, and use the platform in good faith. Fraudulent chargebacks
          or abuse of return policies may result in account suspension.
        </p>
        <h2 style={s.modalH2}>6. Rider Obligations</h2>
        <p style={s.modalP}>
          Riders must maintain valid identification, handle items with care,
          follow designated routes, and adhere to our delivery standards. Riders
          are independent contractors and not employees of O-Fash Markett.
        </p>
        <h2 style={s.modalH2}>7. Payments & Fees</h2>
        <p style={s.modalP}>
          O-Fash Markett charges a commission on each completed sale. Payment
          terms, commission rates, and payout schedules are detailed in the
          Vendor Agreement. All prices are displayed in Nigerian Naira (₦).
        </p>
        <h2 style={s.modalH2}>8. Prohibited Activities</h2>
        <p style={s.modalP}>
          You may not use the platform to sell counterfeit goods, engage in
          fraudulent activity, harass other users, violate intellectual property
          rights, or otherwise breach applicable laws.
        </p>
        <h2 style={s.modalH2}>9. Limitation of Liability</h2>
        <p style={s.modalP}>
          O-Fash Markett is a marketplace facilitator. We are not liable for the
          quality, safety, or legality of items listed by vendors, or for delays
          caused by circumstances beyond our control.
        </p>
        <h2 style={s.modalH2}>10. Governing Law</h2>
        <p style={s.modalP}>
          These terms are governed by the laws of the Federal Republic of
          Nigeria. Any disputes shall be resolved through binding arbitration in
          Lagos, Nigeria.
        </p>
      </>
    ),
  },
};

// ─── CONTACT FORM ─────────────────────────────────────────────────────────────
function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [sent, setSent] = useState(false);
  const set =
    (k: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };
  if (sent)
    return (
      <p style={{ ...s.waitlistSuccess, textAlign: "center" }}>
        ✅ Message sent! We&apos;ll get back to you within 24 hours.
      </p>
    );
  return (
    <form onSubmit={submit} style={s.contactForm}>
      <div className="contact-row" style={s.contactRow}>
        <input
          className="contact-input"
          style={s.contactInput}
          placeholder="Your name"
          value={form.name}
          onChange={set("name")}
          required
        />
        <input
          className="contact-input"
          style={s.contactInput}
          type="email"
          placeholder="Your email"
          value={form.email}
          onChange={set("email")}
          required
        />
      </div>
      <input
        className="contact-input"
        style={s.contactInput}
        placeholder="Subject"
        value={form.subject}
        onChange={set("subject")}
        required
      />
      <textarea
        className="contact-textarea"
        style={s.contactTextarea}
        placeholder="Tell us how we can help…"
        value={form.message}
        onChange={set("message")}
        required
      />
      <button className="contact-btn" style={s.contactBtn} type="submit">
        Send Message →
      </button>
      <div style={{ display: "flex", gap: 24, marginTop: 8, flexWrap: "wrap" }}>
        {[
          { icon: "📧", text: "hello@ofashmarkett.com" },
          { icon: "📍", text: "Lagos, Nigeria" },
          { icon: "⏱️", text: "Replies within 24hrs" },
        ].map((item) => (
          <div
            key={item.text}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              fontSize: 13,
              color: "rgba(232,245,245,0.4)",
            }}
          >
            <span>{item.icon}</span>
            <span>{item.text}</span>
          </div>
        ))}
      </div>
    </form>
  );
}

// ─── MODAL ────────────────────────────────────────────────────────────────────
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
  const content = isContact ? null : MODAL_CONTENT[page];

  return (
    <div
      style={s.modalOverlay}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div style={s.modalBox}>
        <div style={s.modalHeader}>
          <h2 style={s.modalTitle}>
            {isContact ? "Contact Us" : content!.title}
          </h2>
          <button
            className="modal-close"
            style={s.modalClose}
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        <div style={s.modalBody}>
          {isContact ? <ContactForm /> : content!.body}
        </div>
      </div>
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function OFashMarketLanding() {
  const [modal, setModal] = useState<ModalPage>(null);
  const open = useCallback((p: ModalPage) => setModal(p), []);
  const close = useCallback(() => setModal(null), []);

  return (
    <div style={s.body}>
      <GlobalStyles />
      <Spotlight />
      {modal && <Modal page={modal} onClose={close} />}

      {/* ── NAV ── */}
      <nav style={s.nav}>
        <div style={s.logoWrap}>
          <div style={s.logoMark}>OF</div>
          <span style={s.logoText}>O-Fash Markett</span>
        </div>
        <ul className="nav-links" style={s.navLinks}>
          {["How It Works", "For Vendors", "For Riders", "Categories"].map(
            (l) => (
              <li key={l}>
                <a
                  href={`#${l.toLowerCase().replace(/\s+/g, "-")}`}
                  className="nav-link"
                  style={s.navLink}
                >
                  {l}
                </a>
              </li>
            ),
          )}
        </ul>
        <button
          className="nav-cta"
          style={s.navCta}
          onClick={() =>
            document
              .querySelector("#hero-form")
              ?.scrollIntoView({ behavior: "smooth" })
          }
        >
          Join Waitlist
        </button>
      </nav>

      {/* ── HERO ── */}
      <section style={s.hero} id="hero">
        <BackgroundBeams />
        <div
          style={{
            position: "relative",
            zIndex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div style={s.heroBadge}>
            <span style={s.badgeDot} />
            Now accepting early access — be a founding member
          </div>
          <h1 style={s.heroTitle}>
            Fashion Delivered{" "}
            <span style={{ display: "block" }}>
              <span style={s.heroTitleGrad}>From Vendor to You</span>
            </span>
          </h1>
          <p style={s.heroSub}>
            O-Fash Markett connects fashion lovers with Nigeria&apos;s top
            vendors. Shop curated styles — clothes, shoes, wigs & more — with
            same-day delivery from our rider network.
          </p>
          <div
            id="hero-form"
            style={{ width: "100%", display: "flex", justifyContent: "center" }}
          >
            <WaitlistForm />
          </div>
          <p
            style={{
              fontSize: 12,
              color: "rgba(232,245,245,0.28)",
              marginTop: 14,
            }}
          >
            No spam · Exclusive early access · Cancel anytime 🔐
          </p>
          <div style={s.heroStats}>
            {[
              { target: 500, suffix: "+", label: "Vendors Ready to Join" },
              { target: 10000, suffix: "+", label: "Fashion Items" },
              { target: 150, suffix: "+", label: "Riders Network" },
              { target: 98, suffix: "%", label: "Satisfaction Target" },
            ].map(({ target, suffix, label }) => (
              <div key={label} style={s.statItem}>
                <Counter target={target} suffix={suffix} />
                <div style={s.statLabel}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Marquee />

      {/* ── HOW IT WORKS ── */}
      <section style={s.section} id="how-it-works">
        <div style={s.sectionInner}>
          <p style={s.sectionLabel}>The O-Fash Flow</p>
          <h2 style={s.sectionTitle}>From discovery to doorstep in 3 moves</h2>
          <div style={s.stepsGrid}>
            {[
              {
                n: "01",
                icon: "🛍️",
                title: "Buyers Browse & Buy",
                desc: "Discover curated fashion from hundreds of verified Nigerian vendors. Clothes, shoes, wigs, bags and more — all in one premium marketplace.",
              },
              {
                n: "02",
                icon: "🏪",
                title: "Vendors Post & Sell",
                desc: "Fashion vendors list their collections, manage orders, and grow their brand. From boutiques to independent designers — everyone wins.",
              },
              {
                n: "03",
                icon: "🛵",
                title: "Riders Pick & Deliver",
                desc: "Our vetted rider network picks up directly from vendors and delivers to customers. Fast, tracked, and reliable every single time.",
              },
            ].map((step) => (
              <div key={step.n} className="step-card" style={s.stepCard}>
                <span style={s.stepNum}>{step.n}</span>
                <div style={s.stepIcon}>{step.icon}</div>
                <h3 style={s.stepTitle}>{step.title}</h3>
                <p style={s.stepDesc}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div style={s.divider} />

      {/* ── ROLES ── */}
      <section style={{ ...s.section, paddingTop: 100 }} id="for-vendors">
        <div style={s.sectionInner}>
          <p style={s.sectionLabel}>Who O-Fash Serves</p>
          <h2 style={s.sectionTitle}>
            Built for every player in the fashion chain
          </h2>
        </div>
      </section>
      <div style={{ padding: "0 24px 120px" }} id="for-riders">
        <div style={s.rolesGrid}>
          {[
            {
              emoji: "🛍️",
              title: "Shoppers",
              desc: "Browse hundreds of styles from Nigeria's best fashion vendors. Get same-day delivery, easy returns, and personalised style recommendations.",
              pills: [
                "Easy Checkout",
                "Live Order Tracking",
                "Wishlist",
                "Style Feed",
                "Secure Payments",
              ],
            },
            {
              emoji: "👗",
              title: "Vendors",
              desc: "List your fashion items, manage your storefront, and reach thousands of buyers. Powerful analytics, instant payouts, and zero hassle.",
              pills: [
                "Free Storefront",
                "Real-time Analytics",
                "Instant Payouts",
                "Marketing Tools",
                "Bulk Upload",
              ],
            },
            {
              emoji: "🛵",
              title: "Riders",
              desc: "Earn flexibly by delivering fashion orders in your city. Set your own hours, get paid per delivery, and grow your income with O-Fash.",
              pills: [
                "Flexible Hours",
                "Per-Delivery Pay",
                "Route Optimisation",
                "Rider Insurance",
                "Weekly Bonuses",
              ],
            },
          ].map((r) => (
            <div key={r.title} className="role-card" style={s.roleCard}>
              <span style={s.roleEmoji}>{r.emoji}</span>
              <h3 style={s.roleTitle}>{r.title}</h3>
              <p style={s.roleDesc}>{r.desc}</p>
              <div style={s.rolePills}>
                {r.pills.map((p) => (
                  <span key={p} style={s.pill}>
                    {p}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={s.divider} />

      {/* ── FEATURES BENTO ── */}
      <section style={s.section}>
        <div style={s.sectionInner}>
          <p style={s.sectionLabel}>Platform Features</p>
          <h2 style={s.sectionTitle}>
            Everything you need, nothing you don&apos;t
          </h2>
          <div className="bento-grid" style={s.bentoGrid}>
            {[
              {
                icon: "⚡",
                title: "Lightning-fast Checkout",
                desc: "One-tap purchase with saved addresses and cards. Order in under 60 seconds.",
                large: true,
              },
              {
                icon: "🔍",
                title: "Smart Search",
                desc: "AI-powered discovery that learns your style and surfaces the right products at the right time.",
                tall: true,
              },
              {
                icon: "📍",
                title: "Live Tracking",
                desc: "Watch your rider in real-time from pickup to your doorstep.",
              },
              {
                icon: "🛡️",
                title: "Buyer Protection",
                desc: "Full refund guarantee if your item doesn't match the listing.",
              },
              {
                icon: "💳",
                title: "Flexible Payments",
                desc: "Pay with cards, bank transfer, USSD, or O-Fash Pay. Split payments coming soon.",
                large: true,
              },
              {
                icon: "⭐",
                title: "Vendor Reviews",
                desc: "Verified purchase reviews help you shop with confidence every time.",
              },
            ].map((card, i) => (
              <div
                key={i}
                className="bento-card"
                style={{
                  ...s.bentoCard,
                  ...(card.large ? s.bentoLarge : {}),
                  ...(card.tall ? s.bentoTall : {}),
                }}
              >
                <div style={s.bentoIcon}>{card.icon}</div>
                <h3 style={s.bentoTitle}>{card.title}</h3>
                <p style={s.bentoDesc}>{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div style={s.divider} />

      {/* ── CATEGORIES ── */}
      <section style={s.section} id="categories">
        <div style={s.sectionInner}>
          <p style={s.sectionLabel}>Fashion Categories</p>
          <h2 style={s.sectionTitle}>Everything in fashion, in one place</h2>
          <div style={s.catGrid}>
            {[
              { emoji: "👗", name: "Dresses" },
              { emoji: "👟", name: "Sneakers" },
              { emoji: "💇", name: "Wigs & Hair" },
              { emoji: "👛", name: "Bags" },
              { emoji: "🧥", name: "Jackets" },
              { emoji: "💍", name: "Jewelry" },
              { emoji: "🩴", name: "Sandals" },
              { emoji: "🧣", name: "Accessories" },
              { emoji: "🩱", name: "Swimwear" },
              { emoji: "🎽", name: "Sportswear" },
              { emoji: "👒", name: "Headwear" },
              { emoji: "🕶️", name: "Eyewear" },
            ].map((c) => (
              <div key={c.name} className="cat-card" style={s.catCard}>
                <div style={s.catEmoji}>{c.emoji}</div>
                <div style={s.catName}>{c.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div style={s.divider} />

      {/* ── TESTIMONIALS ── */}
      <section style={s.section}>
        <div style={s.sectionInner}>
          <p style={s.sectionLabel}>Early Feedback</p>
          <h2 style={s.sectionTitle}>People are already excited</h2>
        </div>
        <div style={{ padding: "0 24px" }}>
          <div style={s.testiGrid}>
            {[
              {
                q: "Finally a platform that understands Nigerian fashion. I can list my designs and reach buyers across the country without leaving my shop.",
                name: "Amaka O.",
                role: "Fashion Vendor, Lagos",
                init: "AO",
              },
              {
                q: "The idea of having my order picked up from the vendor and delivered same day is exactly what online shopping in Nigeria needs.",
                name: "Tunde B.",
                role: "Shopper, Abuja",
                init: "TB",
              },
              {
                q: "As a rider, I love the flexibility. I can pick up multiple fashion orders in a route and maximise my daily earnings.",
                name: "Emeka C.",
                role: "Delivery Rider, Port Harcourt",
                init: "EC",
              },
            ].map((t) => (
              <div key={t.name} className="testi-card" style={s.testiCard}>
                <div style={s.tetiStars}>
                  {[...Array(5)].map((_, i) => (
                    <span key={i} style={{ color: "#14b8a6", fontSize: 14 }}>
                      ★
                    </span>
                  ))}
                </div>
                <p style={s.testiQuote}>&ldquo;{t.q}&rdquo;</p>
                <div style={s.testiAuthor}>
                  <div style={s.testiAvatar}>{t.init}</div>
                  <div>
                    <div style={s.testiName}>{t.name}</div>
                    <div style={s.testiRole}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={s.ctaSection}>
        <MovingBorderCard>
          <div style={s.ctaBox}>
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
                  "radial-gradient(circle,rgba(20,184,166,0.1) 0%,transparent 70%)",
                pointerEvents: "none",
              }}
            />
            <div style={{ position: "relative", zIndex: 1 }}>
              <div style={{ fontSize: 52, marginBottom: 20 }}>✨</div>
              <h2 style={s.ctaTitle}>Be First on O-Fash Markett</h2>
              <p style={s.ctaSub}>
                Join our waitlist today and get early access, exclusive vendor
                spots, and founding member perks when we launch.
              </p>
              <WaitlistForm compact />
              <p
                style={{
                  fontSize: 12,
                  color: "rgba(232,245,245,0.22)",
                  marginTop: 18,
                }}
              >
                Join 2,000+ fashion enthusiasts already on the list
              </p>
            </div>
          </div>
        </MovingBorderCard>
      </section>

      {/* ── FOOTER ── */}
      <footer style={s.footer}>
        {/* Top grid */}
        <div className="footer-top" style={s.footerTop}>
          {/* Brand col */}
          <div style={s.footerBrand}>
            <div style={s.logoWrap}>
              <div
                style={{
                  ...s.logoMark,
                  width: 40,
                  height: 40,
                  fontSize: 15,
                  borderRadius: 11,
                }}
              >
                OF
              </div>
              <span style={{ ...s.logoText, fontSize: 17 }}>
                O-Fash Markett
              </span>
            </div>
            <p style={s.footerTagline}>
              Nigeria&apos;s premier fashion marketplace — connecting buyers,
              vendors and riders in one seamless experience.
            </p>
            <div style={s.footerSocials}>
              {["𝕏", "in", "ig", "tt"].map((icon) => (
                <button
                  key={icon}
                  className="social-btn"
                  style={s.socialBtn}
                  title={icon}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          {/* Company col */}
          <div style={s.footerCol}>
            <p style={s.footerColTitle}>Company</p>
            <div style={s.footerColLinks}>
              {["About Us", "Careers", "Blog", "Press Kit"].map((l) => (
                <button key={l} className="footer-link" style={s.footerLink}>
                  {l}
                </button>
              ))}
            </div>
          </div>

          {/* Legal col */}
          <div style={s.footerCol}>
            <p style={s.footerColTitle}>Legal</p>
            <div style={s.footerColLinks}>
              <button
                className="footer-link"
                style={s.footerLink}
                onClick={() => open("privacy")}
              >
                Privacy Policy
              </button>
              <button
                className="footer-link"
                style={s.footerLink}
                onClick={() => open("terms")}
              >
                Terms of Service
              </button>
              <button
                className="footer-link"
                style={s.footerLink}
                onClick={() => open("privacy")}
              >
                Cookie Policy
              </button>
              <button className="footer-link" style={s.footerLink}>
                Vendor Agreement
              </button>
            </div>
          </div>

          {/* Support col */}
          <div style={s.footerCol}>
            <p style={s.footerColTitle}>Support</p>
            <div style={s.footerColLinks}>
              <button
                className="footer-link"
                style={s.footerLink}
                onClick={() => open("contact")}
              >
                Contact Us
              </button>
              <button className="footer-link" style={s.footerLink}>
                Help Centre
              </button>
              <button className="footer-link" style={s.footerLink}>
                Rider Support
              </button>
              <button className="footer-link" style={s.footerLink}>
                Vendor Support
              </button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={s.footerBottom}>
          <p style={s.footerCopy}>
            © {new Date().getFullYear()} O-Fash Markett · Made with ❤️ in Lagos,
            Nigeria 🇳🇬
          </p>
          <div style={s.footerBadge}>
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#14b8a6",
                display: "inline-block",
                animation: "pulse 2s infinite",
              }}
            />
            All systems operational
          </div>
          <div style={{ display: "flex", gap: 20 }}>
            <button
              className="footer-link"
              style={s.footerLink}
              onClick={() => open("privacy")}
            >
              Privacy
            </button>
            <button
              className="footer-link"
              style={s.footerLink}
              onClick={() => open("terms")}
            >
              Terms
            </button>
            <button
              className="footer-link"
              style={s.footerLink}
              onClick={() => open("contact")}
            >
              Contact
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
