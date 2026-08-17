"use client";

import { AppleLogo, GooglePlayLogo, Bell } from "@phosphor-icons/react/dist/ssr";
import { Shell, SectionHead, SECTION_Y, cardBase } from "./primitives";
import { AppNoticeDialog } from "./dialogs";

const STORES = [
  {
    label: "Apple App Store",
    eyebrow: "Download on the",
    icon: <AppleLogo size={26} weight="fill" />,
    tint: "var(--teal)",
  },
  {
    label: "Google Play Store",
    eyebrow: "Get it on",
    icon: <GooglePlayLogo size={25} weight="fill" />,
    tint: "var(--ochre)",
  },
];

export function AppDownload() {
  return (
    <section id="download-app" style={{ padding: `${SECTION_Y} 0` }}>
      <Shell>
        <div className="g-split">
          <div>
            <SectionHead
              align="left"
              eyebrow="Mobile app"
              title="Shop the market from your phone"
              blurb="O-Fash Markett is preparing native apps for buyers, vendors, and riders. Join the waitlist so we know where to send your early access invite."
            />
          </div>

          <div
            style={{
              ...cardBase,
              padding: 22,
              background:
                "linear-gradient(145deg, var(--teal-wash), var(--ochre-wash))",
              boxShadow: "var(--shadow-md)",
            }}
          >
            <div style={{ display: "grid", gap: 12 }}>
              {STORES.map((s) => (
                <AppNoticeDialog key={s.label}>
                  <button
                    type="button"
                    aria-label={`${s.label} — download coming soon`}
                    className="btn"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 14,
                      width: "100%",
                      padding: "16px 18px",
                      borderRadius: "var(--radius)",
                      background: "var(--bg-raised)",
                      border: "1px solid var(--line)",
                      cursor: "pointer",
                      textAlign: "left",
                      boxShadow: "var(--shadow-sm)",
                    }}
                  >
                    <span
                      style={{
                        width: 46,
                        height: 46,
                        flexShrink: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "var(--radius-sm)",
                        background: "var(--bg-sunk)",
                        color: s.tint,
                      }}
                    >
                      {s.icon}
                    </span>
                    <span style={{ minWidth: 0 }}>
                      <span
                        style={{
                          display: "block",
                          fontSize: 11,
                          fontWeight: 700,
                          letterSpacing: "0.08em",
                          textTransform: "uppercase",
                          color: "var(--ink-faint)",
                        }}
                      >
                        {s.eyebrow}
                      </span>
                      <span
                        style={{
                          display: "block",
                          fontSize: 16.5,
                          fontWeight: 700,
                          color: "var(--ink)",
                          marginTop: 2,
                        }}
                      >
                        {s.label}
                      </span>
                    </span>
                  </button>
                </AppNoticeDialog>
              ))}
            </div>

            <p
              style={{
                display: "flex",
                alignItems: "center",
                gap: 9,
                marginTop: 16,
                fontSize: 13,
                lineHeight: 1.6,
                color: "var(--ink-soft)",
              }}
            >
              <Bell size={17} weight="duotone" color="var(--terra)" />
              Waitlist members get the first availability email.
            </p>
          </div>
        </div>
      </Shell>
    </section>
  );
}
