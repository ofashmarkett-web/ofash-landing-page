import Link from "next/link";
import {
  FacebookLogo,
  InstagramLogo,
  TiktokLogo,
  Rocket,
} from "@phosphor-icons/react/dist/ssr";
import { Shell, Logo, KenteBand } from "./primitives";
import { LegalLink, ContactLink } from "./dialogs";

const SOCIALS = [
  { label: "Facebook", href: "https://facebook.com/ofashmarkett", icon: <FacebookLogo size={18} weight="fill" /> },
  { label: "Instagram", href: "https://instagram.com/ofashmarkett", icon: <InstagramLogo size={18} weight="fill" /> },
  { label: "TikTok", href: "https://tiktok.com/@ofashmarkett", icon: <TiktokLogo size={18} weight="fill" /> },
];

const colHeading: React.CSSProperties = {
  fontSize: 11.5,
  fontWeight: 700,
  letterSpacing: "0.16em",
  textTransform: "uppercase",
  color: "var(--ink-faint)",
  marginBottom: 16,
};

const plainLink: React.CSSProperties = {
  fontSize: 15,
  color: "var(--ink-soft)",
  textDecoration: "none",
};

export function Footer() {
  return (
    <footer style={{ marginTop: "auto", background: "var(--bg-sunk)" }}>
      <KenteBand />
      <Shell style={{ paddingTop: 52, paddingBottom: 28 }}>
        <div className="g-foot" style={{ marginBottom: 40 }}>
          <div>
            <Logo mark={38} />
            <p
              style={{
                fontSize: 15,
                lineHeight: 1.75,
                color: "var(--ink-soft)",
                marginTop: 15,
                maxWidth: 280,
              }}
            >
              Africa&apos;s fashion marketplace, connecting buyers, vendors and
              riders in one app.
            </p>
            <p
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 7,
                fontSize: 13,
                fontWeight: 600,
                color: "var(--teal)",
                marginTop: 12,
              }}
            >
              <Rocket size={16} weight="duotone" />
              Launching soon in Lagos
            </p>
            <div style={{ display: "flex", gap: 9, marginTop: 18 }}>
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="btn"
                  style={{
                    width: 38,
                    height: 38,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "var(--radius-sm)",
                    background: "var(--bg-raised)",
                    border: "1px solid var(--line)",
                    color: "var(--ink-soft)",
                  }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          <div>
            <p style={colHeading}>Explore</p>
            <div style={{ display: "grid", gap: 11 }}>
              <a href="#how-it-works" className="u-link" style={plainLink}>
                How it works
              </a>
              <a href="#who-we-serve" className="u-link" style={plainLink}>
                Who we serve
              </a>
              <a href="#categories" className="u-link" style={plainLink}>
                Categories
              </a>
              <a href="#faq" className="u-link" style={plainLink}>
                FAQ
              </a>
            </div>
          </div>

          <div>
            <p style={colHeading}>Company</p>
            <div style={{ display: "grid", gap: 11 }}>
              <LegalLink doc="about" style={{ fontSize: 15 }}>
                About us
              </LegalLink>
              <ContactLink style={{ fontSize: 15 }}>Contact</ContactLink>
              <Link href="/waitlist" className="u-link" style={plainLink}>
                Join waitlist
              </Link>
            </div>
          </div>

          <div>
            <p style={colHeading}>Legal</p>
            <div style={{ display: "grid", gap: 11 }}>
              <LegalLink doc="privacy" style={{ fontSize: 15 }}>
                Privacy policy
              </LegalLink>
              <LegalLink doc="terms" style={{ fontSize: 15 }}>
                Terms of service
              </LegalLink>
              <LegalLink doc="cookies" style={{ fontSize: 15 }}>
                Cookie policy
              </LegalLink>
            </div>
          </div>
        </div>

        <div
          style={{
            paddingTop: 22,
            borderTop: "1px solid var(--line)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 14,
          }}
        >
          <p style={{ fontSize: 13.5, color: "var(--ink-faint)" }}>
            © {new Date().getFullYear()} O-Fash Markett. All rights reserved. Made
            in Nigeria.
          </p>
          <p
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              fontSize: 12.5,
              color: "var(--ink-faint)",
            }}
          >
            <span
              aria-hidden
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: "var(--palm)",
                animation: "pulse-dot 2.2s infinite",
              }}
            />
            All systems operational
          </p>
        </div>
      </Shell>
    </footer>
  );
}
