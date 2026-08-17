import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  SealCheck,
  Moped,
  ShieldCheck,
} from "@phosphor-icons/react/dist/ssr";
import { Shell, AdinkraMark, btnPrimary, btnSecondary } from "./primitives";
import { Counter } from "./counter";

const STATS = [
  { n: 2000, suffix: "+", label: "Early buyers" },
  { n: 500, suffix: "+", label: "Vendors ready" },
  { n: 10, suffix: "K+", label: "Fashion items" },
  { n: 150, suffix: "+", label: "Bike riders" },
];

/** Floating credential chip laid over the collage. */
function Chip({
  icon,
  title,
  note,
  style,
}: {
  icon: React.ReactNode;
  title: string;
  note: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={{
        position: "absolute",
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "10px 14px",
        borderRadius: "var(--radius)",
        background: "var(--bg-raised)",
        border: "1px solid var(--line)",
        boxShadow: "var(--shadow-md)",
        ...style,
      }}
    >
      {icon}
      <span style={{ lineHeight: 1.3 }}>
        <span
          style={{
            display: "block",
            fontSize: 13.5,
            fontWeight: 700,
            color: "var(--ink)",
          }}
        >
          {title}
        </span>
        <span style={{ display: "block", fontSize: 11.5, color: "var(--ink-faint)" }}>
          {note}
        </span>
      </span>
    </div>
  );
}

export function Hero() {
  return (
    <section
      style={{
        position: "relative",
        overflow: "hidden",
        paddingTop: "calc(var(--nav-h) + clamp(44px, 6vw, 76px))",
        paddingBottom: "clamp(56px, 7vw, 92px)",
      }}
    >
      {/* Warm ground: an ochre/teal wash under an adire lattice, instead of
          the near-black letterboxed photo that used to sit here. */}
      <div
        aria-hidden
        className="pat-adire"
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          background:
            "radial-gradient(120% 90% at 82% 8%, var(--ochre-wash) 0%, transparent 55%)," +
            "radial-gradient(90% 80% at 8% 30%, var(--teal-wash) 0%, transparent 60%)",
        }}
      />

      <Shell style={{ position: "relative", zIndex: 1 }}>
        <div className="g-hero">
          {/* ── Copy ── */}
          <div>
            <p
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 9,
                padding: "8px 16px 8px 12px",
                borderRadius: 100,
                background: "var(--bg-raised)",
                border: "1px solid var(--line)",
                boxShadow: "var(--shadow-sm)",
                fontSize: 13.5,
                fontWeight: 600,
                color: "var(--ink-soft)",
                marginBottom: 26,
              }}
            >
              <AdinkraMark size={15} />
              Launching soon in Lagos
              <span
                aria-hidden
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "var(--teal)",
                  animation: "pulse-dot 2.2s infinite",
                }}
              />
            </p>

            <h1
              style={{
                fontSize: "clamp(37px, 4.3vw, 54px)",
                fontWeight: 600,
                lineHeight: 1.05,
                letterSpacing: "-0.03em",
                color: "var(--ink)",
                marginBottom: 22,
                textWrap: "balance",
              }}
            >
              Africa&apos;s fashion market,
              <span className="gilded" style={{ display: "block", marginTop: 6 }}>
                one click away
              </span>
            </h1>

            <p
              style={{
                fontSize: "clamp(16.5px, 1.5vw, 19px)",
                lineHeight: 1.68,
                color: "var(--ink-soft)",
                maxWidth: 500,
                marginBottom: 32,
              }}
            >
              Shop Balogun, Onitsha, Ariaria and every fashion market from one app.
              Verified vendors, payment held in escrow, delivered to your door in hours.
            </p>

            <div
              style={{
                display: "flex",
                gap: 13,
                flexWrap: "wrap",
                alignItems: "center",
                marginBottom: 40,
              }}
            >
              <Link href="/waitlist" className="btn" style={btnPrimary}>
                Join the waitlist
                <ArrowRight size={18} weight="bold" />
              </Link>
              <a href="#how-it-works" className="btn" style={btnSecondary}>
                See how it works
              </a>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: 13.5,
                  fontWeight: 600,
                  color: "var(--palm)",
                }}
              >
                <ShieldCheck size={17} weight="duotone" />
                Free to join
              </span>
            </div>

            {/* ── Stats ── */}
            <dl
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "22px 36px",
                paddingTop: 26,
                borderTop: "1px solid var(--line)",
                margin: 0,
              }}
            >
              {STATS.map((s) => (
                <div key={s.label}>
                  <dd
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: 31,
                      fontWeight: 600,
                      color: "var(--ink)",
                      letterSpacing: "-0.02em",
                      margin: 0,
                      lineHeight: 1.1,
                    }}
                  >
                    <Counter target={s.n} suffix={s.suffix} />
                  </dd>
                  <dt
                    style={{
                      fontSize: 12.5,
                      fontWeight: 600,
                      color: "var(--ink-faint)",
                      letterSpacing: "0.04em",
                      marginTop: 4,
                    }}
                  >
                    {s.label}
                  </dt>
                </div>
              ))}
            </dl>
          </div>

          {/* ── Collage ──
              Portrait photos in portrait frames at objectFit:cover, so nothing
              letterboxes the way the old square tiles did. */}
          <div style={{ position: "relative" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1.12fr 0.88fr",
                gridTemplateRows: "auto auto",
                gap: 13,
              }}
            >
              <div
                style={{
                  gridRow: "1 / 3",
                  position: "relative",
                  minHeight: 380,
                  borderRadius: "var(--radius-lg)",
                  overflow: "hidden",
                  border: "1px solid var(--line)",
                  boxShadow: "var(--shadow-lg)",
                  background: "var(--bg-sunk)",
                }}
              >
                <Image
                  src="/images/couple.png"
                  alt="Two shoppers wearing coordinated African print outfits"
                  fill
                  sizes="(max-width: 1000px) 55vw, 300px"
                  style={{ objectFit: "cover", objectPosition: "center 22%" }}
                  preload
                />
              </div>

              <div
                style={{
                  position: "relative",
                  aspectRatio: "4 / 5",
                  borderRadius: "var(--radius)",
                  overflow: "hidden",
                  border: "1px solid var(--line)",
                  boxShadow: "var(--shadow-md)",
                  background: "var(--bg-sunk)",
                }}
              >
                <Image
                  src="/images/asooke.png"
                  alt="Folded aso-oke and lace fabric on a market stall"
                  fill
                  sizes="(max-width: 1000px) 40vw, 220px"
                  style={{ objectFit: "cover" }}
                />
              </div>

              <div
                style={{
                  position: "relative",
                  aspectRatio: "1 / 1",
                  borderRadius: "var(--radius)",
                  overflow: "hidden",
                  border: "1px solid var(--line)",
                  boxShadow: "var(--shadow-md)",
                  background: "var(--bg-sunk)",
                }}
              >
                <Image
                  src="/images/riderBike.png"
                  alt="An O-Fash delivery rider on a motorbike"
                  fill
                  sizes="(max-width: 1000px) 40vw, 220px"
                  style={{ objectFit: "cover" }}
                />
              </div>
            </div>

            <Chip
              icon={<SealCheck size={22} weight="duotone" color="var(--teal)" />}
              title="Verified vendors"
              note="Every seller checked"
              style={{ left: -14, bottom: "31%" }}
            />
            <Chip
              icon={<Moped size={22} weight="duotone" color="var(--terra)" />}
              title="30 min – 1 hr"
              note="Typical delivery"
              style={{ right: -6, bottom: 10 }}
            />
          </div>
        </div>
      </Shell>
    </section>
  );
}
