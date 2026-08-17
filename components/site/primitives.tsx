import type { CSSProperties, ReactNode } from "react";
import Image from "next/image";

/* ══════════════════════════════════════════════════════════════════
   Server-safe building blocks. No hooks, no state — these render on
   the server so the landing page ships as mostly static HTML.
   ══════════════════════════════════════════════════════════════════ */

export const SHELL: CSSProperties = {
  width: "100%",
  maxWidth: "var(--shell)",
  margin: "0 auto",
  padding: "0 24px",
};

export const SECTION_Y = "clamp(60px, 7.5vw, 100px)";

export function Shell({
  children,
  style,
  className,
}: {
  children: ReactNode;
  style?: CSSProperties;
  className?: string;
}) {
  return (
    <div className={className} style={{ ...SHELL, ...style }}>
      {children}
    </div>
  );
}

/* ── Kente band ───────────────────────────────────────────────────
   Woven weft blocks crossed by warp threads. Used as the nav's lower
   edge and as a divider between sections. */
export function KenteBand({
  thin = false,
  style,
}: {
  thin?: boolean;
  style?: CSSProperties;
}) {
  return (
    <div
      aria-hidden
      className={thin ? "kente kente-thin" : "kente"}
      style={style}
    />
  );
}

/* ── Adinkra-style mark ───────────────────────────────────────────
   A diamond-in-diamond with rays, echoing adire resist motifs and the
   chevron already inside the O-Fash logo. Used beside section eyebrows. */
export function AdinkraMark({
  size = 16,
  color = "var(--ochre-bright)",
  style,
}: {
  size?: number;
  color?: string;
  style?: CSSProperties;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      style={{ flexShrink: 0, ...style }}
    >
      <path d="M12 1.6 22.4 12 12 22.4 1.6 12Z" stroke={color} strokeWidth="1.6" />
      <path d="M12 7.2 16.8 12 12 16.8 7.2 12Z" fill={color} opacity="0.9" />
    </svg>
  );
}

/* ── Section heading ─────────────────────────────────────────────── */
export function SectionHead({
  eyebrow,
  title,
  blurb,
  align = "center",
  tone = "var(--teal)",
  maxWidth = 620,
}: {
  eyebrow?: string;
  title: ReactNode;
  blurb?: string;
  align?: "center" | "left";
  tone?: string;
  maxWidth?: number;
}) {
  const centered = align === "center";
  return (
    <div
      style={{
        textAlign: align,
        marginBottom: "clamp(34px, 4vw, 54px)",
        maxWidth: centered ? maxWidth : undefined,
        marginLeft: centered ? "auto" : undefined,
        marginRight: centered ? "auto" : undefined,
      }}
    >
      {eyebrow && (
        <p
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: tone,
            marginBottom: 14,
          }}
        >
          <AdinkraMark size={13} color={tone} />
          {eyebrow}
        </p>
      )}
      <h2
        style={{
          fontSize: "clamp(29px, 4.1vw, 47px)",
          fontWeight: 600,
          color: "var(--ink)",
          marginBottom: blurb ? 15 : 0,
        }}
      >
        {title}
      </h2>
      {blurb && (
        <p
          style={{
            fontSize: 17,
            lineHeight: 1.72,
            color: "var(--ink-soft)",
            maxWidth: centered ? maxWidth : 560,
            marginLeft: centered ? "auto" : undefined,
            marginRight: centered ? "auto" : undefined,
          }}
        >
          {blurb}
        </p>
      )}
    </div>
  );
}

/* ── Logo ─────────────────────────────────────────────────────────
   Rendered at the asset's true 159×175 ratio rather than forced square,
   which is what triggered Next's aspect-ratio warning before. */
export function Logo({ mark = 34 }: { mark?: number }) {
  return (
    <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <Image
        src="/logo.png"
        alt=""
        width={159}
        height={175}
        style={{ width: mark, height: "auto" }}
        priority={false}
      />
      <span style={{ lineHeight: 1 }}>
        <span
          style={{
            display: "block",
            fontFamily: "var(--font-display)",
            fontSize: mark * 0.52,
            fontWeight: 600,
            color: "var(--ink)",
            letterSpacing: "-0.02em",
          }}
        >
          O-Fash
        </span>
        <span
          style={{
            display: "block",
            fontSize: Math.max(mark * 0.24, 8.5),
            fontWeight: 700,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "var(--terra)",
            marginTop: 3,
          }}
        >
          Markett
        </span>
      </span>
    </span>
  );
}

/* ── Shared control styles ───────────────────────────────────────── */
export const btnBase: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 9,
  borderRadius: "var(--radius)",
  fontFamily: "var(--font-sans)",
  fontWeight: 700,
  cursor: "pointer",
  textDecoration: "none",
  whiteSpace: "nowrap",
  lineHeight: 1.2,
};

export const btnPrimary: CSSProperties = {
  ...btnBase,
  padding: "15px 28px",
  fontSize: 16,
  background: "var(--teal)",
  color: "var(--on-accent)",
  border: "1px solid transparent",
  boxShadow: "var(--shadow-md)",
};

export const btnSecondary: CSSProperties = {
  ...btnBase,
  padding: "15px 26px",
  fontSize: 16,
  background: "transparent",
  color: "var(--ink)",
  border: "1.5px solid var(--line-strong)",
};

export const cardBase: CSSProperties = {
  background: "var(--bg-raised)",
  border: "1px solid var(--line)",
  borderRadius: "var(--radius-lg)",
  boxShadow: "var(--shadow-sm)",
  overflow: "hidden",
};

export const fieldBase: CSSProperties = {
  width: "100%",
  padding: "14px 16px",
  borderRadius: "var(--radius)",
  border: "1.5px solid var(--line)",
  background: "var(--bg)",
  color: "var(--ink)",
  fontSize: 15.5,
  fontFamily: "var(--font-sans)",
  outline: "none",
  transition: "border-color 0.2s ease, box-shadow 0.2s ease",
};

export const eyebrowStyle: CSSProperties = {
  fontSize: 12,
  fontWeight: 700,
  letterSpacing: "0.15em",
  textTransform: "uppercase",
  color: "var(--teal)",
};
