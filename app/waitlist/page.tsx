import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ShieldCheck, Rocket, Coins } from "@phosphor-icons/react/dist/ssr";
import { Navigation } from "@/components/site/nav";
import { Footer } from "@/components/site/footer";
import { Shell, AdinkraMark, KenteBand } from "@/components/site/primitives";
import { WaitlistForm, type Role } from "@/components/site/forms";

export const metadata: Metadata = {
  title: "Join the Waitlist — O-Fash Markett",
  description:
    "Registration is free. Founding members get early access and launch perks when O-Fash Markett goes live in Lagos.",
  alternates: { canonical: "/waitlist" },
};

const VALID: Role[] = ["buyer", "vendor", "rider"];

const PERKS = [
  { icon: <ShieldCheck size={18} weight="duotone" />, t: "No spam, ever" },
  { icon: <Rocket size={18} weight="duotone" />, t: "Early access" },
  { icon: <Coins size={18} weight="duotone" />, t: "Founding perks" },
];

export default async function WaitlistPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string | string[] }>;
}) {
  // Role arrives pre-selected when you come from a "Join as vendor" card.
  const raw = (await searchParams).role;
  const candidate = Array.isArray(raw) ? raw[0] : raw;
  const initialRole = (VALID.includes(candidate as Role) ? candidate : "") as Role;

  return (
    <>
      <Navigation />
      <main
        style={{
          paddingTop: "calc(var(--nav-h) + clamp(36px, 5vw, 64px))",
          paddingBottom: "clamp(56px, 7vw, 88px)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          aria-hidden
          className="pat-adire"
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 0,
            background:
              "radial-gradient(110% 80% at 85% 0%, var(--ochre-wash) 0%, transparent 58%)," +
              "radial-gradient(90% 70% at 5% 20%, var(--teal-wash) 0%, transparent 60%)",
          }}
        />

        <Shell style={{ position: "relative", zIndex: 1 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 1fr)",
              maxWidth: 980,
              margin: "0 auto",
            }}
          >
            <Link
              href="/"
              className="u-link"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 7,
                width: "fit-content",
                fontSize: 14.5,
                fontWeight: 600,
                color: "var(--ink-soft)",
                textDecoration: "none",
                marginBottom: 26,
              }}
            >
              <ArrowLeft size={16} weight="bold" />
              Back to home
            </Link>

            <div className="g-split" style={{ gap: 48, alignItems: "start" }}>
              <div>
                <p
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 9,
                    fontSize: 12,
                    fontWeight: 700,
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    color: "var(--teal)",
                    marginBottom: 16,
                  }}
                >
                  <AdinkraMark size={13} />
                  Free registration
                </p>
                <h1
                  style={{
                    fontSize: "clamp(34px, 4.6vw, 56px)",
                    fontWeight: 600,
                    lineHeight: 1.06,
                    letterSpacing: "-0.03em",
                    color: "var(--ink)",
                    marginBottom: 18,
                  }}
                >
                  Be first through
                  <span className="gilded" style={{ display: "block", marginTop: 4 }}>
                    the market gate
                  </span>
                </h1>
                <p
                  style={{
                    fontSize: 17,
                    lineHeight: 1.7,
                    color: "var(--ink-soft)",
                    maxWidth: 440,
                    marginBottom: 26,
                  }}
                >
                  Founding members get exclusive early access and special perks when
                  we launch. It costs nothing to hold your place.
                </p>

                <ul
                  style={{
                    display: "grid",
                    gap: 12,
                    listStyle: "none",
                    padding: 0,
                    margin: "0 0 30px",
                  }}
                >
                  {PERKS.map((p) => (
                    <li
                      key={p.t}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        fontSize: 15.5,
                        color: "var(--ink-soft)",
                      }}
                    >
                      <span style={{ color: "var(--teal)", display: "flex" }}>
                        {p.icon}
                      </span>
                      {p.t}
                    </li>
                  ))}
                </ul>

                <div
                  className="hide-mobile"
                  style={{
                    position: "relative",
                    aspectRatio: "16 / 10",
                    borderRadius: "var(--radius-lg)",
                    overflow: "hidden",
                    border: "1px solid var(--line)",
                    boxShadow: "var(--shadow-md)",
                    maxWidth: 420,
                  }}
                >
                  <Image
                    src="/images/market.png"
                    alt="Stalls of fabric and clothing in a Nigerian market"
                    fill
                    sizes="420px"
                    style={{ objectFit: "cover" }}
                  />
                </div>
              </div>

              <div
                style={{
                  background: "var(--bg-raised)",
                  border: "1px solid var(--line)",
                  borderRadius: "var(--radius-xl)",
                  boxShadow: "var(--shadow-lg)",
                  overflow: "hidden",
                }}
              >
                <KenteBand thin />
                <div style={{ padding: "26px 24px 28px" }}>
                  <h2
                    style={{
                      fontSize: 22,
                      fontWeight: 600,
                      color: "var(--ink)",
                      marginBottom: 6,
                    }}
                  >
                    Reserve your spot
                  </h2>
                  <p
                    style={{
                      fontSize: 14.5,
                      lineHeight: 1.65,
                      color: "var(--ink-faint)",
                      marginBottom: 22,
                    }}
                  >
                    Takes under a minute.
                  </p>
                  <WaitlistForm initialRole={initialRole} />
                </div>
              </div>
            </div>
          </div>
        </Shell>
      </main>
      <Footer />
    </>
  );
}
