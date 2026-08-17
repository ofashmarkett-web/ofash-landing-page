import Image from "next/image";
import Link from "next/link";
import {
  ShoppingBag,
  Storefront,
  Moped,
  ArrowRight,
  Lock,
  SealCheck,
  ShieldCheck,
  Lightning,
  MapPin,
  Globe,
  Sparkle,
  Headset,
  TShirt,
  Dress,
  Sneaker,
  Handbag,
  Scissors,
  Truck,
  SprayBottle,
  Crown,
} from "@phosphor-icons/react/dist/ssr";
import {
  Shell,
  SectionHead,
  SECTION_Y,
  AdinkraMark,
  KenteBand,
  cardBase,
} from "./primitives";
import { Reveal, Stagger, StaggerItem } from "./reveal";
import { CategoryCarousel } from "./category-carousel";
import { InquiryBox } from "./forms";

/* ══════════════════════════════════════════════════════════════════
   MARKET RIBBON — replaces the emoji marquee. Pure CSS, no JS.
   ══════════════════════════════════════════════════════════════════ */
const MARKETS = [
  "Balogun Market",
  "Onitsha Central",
  "Dutse Fashion Hub",
  "Ariaria Market",
  "Kano Textiles",
  "Yaba Fashion",
  "Aba Market",
  "Idumota Lagos",
  "Trade Fair Complex",
];

export function MarketRibbon() {
  const run = [...MARKETS, ...MARKETS];
  return (
    <div
      style={{
        overflow: "hidden",
        borderTop: "1px solid var(--line)",
        borderBottom: "1px solid var(--line)",
        background: "var(--bg-sunk)",
        padding: "13px 0",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 30,
          width: "max-content",
          animation: "marquee 58s linear infinite",
        }}
      >
        {run.map((m, i) => (
          <span
            key={i}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 30,
              fontSize: 14,
              fontWeight: 600,
              letterSpacing: "0.06em",
              color: "var(--ink-soft)",
              whiteSpace: "nowrap",
            }}
          >
            {m}
            <AdinkraMark size={11} color="var(--terra)" />
          </span>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   MARKET BANNER — cover + scrim, so the photo fills the band and the
   headline sits on a readable gradient instead of on top of stalls.
   ══════════════════════════════════════════════════════════════════ */
export function MarketBanner() {
  return (
    <section style={{ position: "relative" }}>
      <div
        style={{
          position: "relative",
          minHeight: "clamp(320px, 40vw, 440px)",
          display: "flex",
          alignItems: "center",
          overflow: "hidden",
        }}
      >
        <Image
          src="/images/marketScene.png"
          alt="Traders and racks of clothing inside a busy Nigerian fashion market"
          fill
          sizes="100vw"
          style={{ objectFit: "cover", objectPosition: "center 40%" }}
        />
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(100deg, rgba(8,17,15,0.90) 0%, rgba(8,17,15,0.70) 42%, rgba(8,17,15,0.18) 100%)",
          }}
        />
        <Shell style={{ position: "relative", zIndex: 1 }}>
          <Reveal style={{ maxWidth: 620 }}>
            <p
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 9,
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "var(--ochre-bright)",
                marginBottom: 16,
              }}
            >
              <AdinkraMark size={13} color="var(--ochre-bright)" />
              Inspired by real markets
            </p>
            <h2
              style={{
                fontSize: "clamp(28px, 3.8vw, 46px)",
                fontWeight: 600,
                lineHeight: 1.1,
                letterSpacing: "-0.025em",
                color: "#fdfaf3",
                marginBottom: 16,
              }}
            >
              The digital twin of Africa&apos;s fashion markets
            </h2>
            <p
              style={{
                fontSize: 17,
                lineHeight: 1.7,
                color: "rgba(253,250,243,0.82)",
                maxWidth: 480,
              }}
            >
              We&apos;re not replacing the market — we&apos;re extending it. Same
              traders, same cloth, now reachable from anywhere.
            </p>
          </Reveal>
        </Shell>
      </div>
      <KenteBand />
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════
   WHO WE SERVE — each card links straight to a pre-selected waitlist
   role, so no client-side selection state is needed.
   ══════════════════════════════════════════════════════════════════ */
const ROLES = [
  {
    id: "buyer",
    title: "Buyer",
    tagline: "Shop every market",
    desc: "Discover fashion from Nigeria's top markets. Clothes, shoes, bags and fabric delivered fast.",
    img: "/images/africanFashion.png",
    alt: "A woman in a bold African print dress",
    icon: <ShoppingBag size={20} weight="duotone" />,
    tint: "var(--teal)",
    wash: "var(--teal-wash)",
  },
  {
    id: "vendor",
    title: "Vendor",
    tagline: "Reach more buyers",
    desc: "Sell your collection nationwide. Register free, list products, and grow beyond your stall.",
    img: "/images/vendor2.png",
    alt: "A market vendor standing among racks of clothing",
    icon: <Storefront size={20} weight="duotone" />,
    tint: "var(--ochre)",
    wash: "var(--ochre-wash)",
  },
  {
    id: "rider",
    title: "Rider",
    tagline: "Earn on your terms",
    desc: "Deliver fashion orders. Flexible hours, per-delivery pay and bonuses. Start earning today.",
    img: "/images/rider1.png",
    alt: "A delivery rider with a insulated backpack",
    icon: <Moped size={20} weight="duotone" />,
    tint: "var(--terra)",
    wash: "var(--terra-wash)",
  },
];

export function WhoWeServe() {
  return (
    <section id="who-we-serve" style={{ padding: `${SECTION_Y} 0` }}>
      <Shell>
        <SectionHead
          eyebrow="Who we serve"
          title="For everyone in the fashion chain"
          blurb="Buyers, vendors and riders — we've built for all three, and registration is free for each."
        />
        <Stagger className="g-3">
          {ROLES.map((r) => (
            <StaggerItem key={r.id}>
              <Link
                href={`/waitlist?role=${r.id}`}
                className="card lift"
                style={{
                  ...cardBase,
                  display: "block",
                  textDecoration: "none",
                  height: "100%",
                }}
              >
                <div
                  style={{
                    position: "relative",
                    aspectRatio: "4 / 5",
                    overflow: "hidden",
                    background: "var(--bg-sunk)",
                  }}
                >
                  <Image
                    src={r.img}
                    alt={r.alt}
                    fill
                    sizes="(max-width: 1000px) 100vw, 350px"
                    className="zoom-img"
                    style={{ objectFit: "cover", objectPosition: "center 20%" }}
                  />
                  <span
                    style={{
                      position: "absolute",
                      top: 13,
                      left: 13,
                      width: 40,
                      height: 40,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "var(--radius-sm)",
                      background: "var(--bg-raised)",
                      color: r.tint,
                      boxShadow: "var(--shadow-sm)",
                    }}
                  >
                    {r.icon}
                  </span>
                </div>
                <div style={{ padding: "18px 20px 22px" }}>
                  <p
                    style={{
                      fontSize: 11.5,
                      fontWeight: 700,
                      letterSpacing: "0.13em",
                      textTransform: "uppercase",
                      color: r.tint,
                      marginBottom: 7,
                    }}
                  >
                    {r.tagline}
                  </p>
                  <h3
                    style={{
                      fontSize: 23,
                      fontWeight: 600,
                      color: "var(--ink)",
                      marginBottom: 10,
                    }}
                  >
                    {r.title}
                  </h3>
                  <p
                    style={{
                      fontSize: 15.5,
                      lineHeight: 1.72,
                      color: "var(--ink-soft)",
                      marginBottom: 15,
                    }}
                  >
                    {r.desc}
                  </p>
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 7,
                      fontSize: 14.5,
                      fontWeight: 700,
                      color: r.tint,
                    }}
                  >
                    Join as {r.title.toLowerCase()}
                    <ArrowRight size={16} weight="bold" />
                  </span>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </Shell>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════
   CATEGORIES
   ══════════════════════════════════════════════════════════════════ */
const CATEGORIES = [
  {
    label: "Men's Fashion",
    desc: "Agbada, shirts, suits",
    icon: <TShirt size={17} weight="duotone" />,
    imgs: ["/images/clotheMen.png", "/images/menAgbada.png", "/images/menSuit.png"],
  },
  {
    label: "Women's Fashion",
    desc: "Dresses, blouses, skirts",
    icon: <Dress size={17} weight="duotone" />,
    imgs: ["/images/clotheWomen.png", "/images/skirts.png", "/images/blouse.png"],
  },
  {
    label: "Shoes & Footwear",
    desc: "All styles, all genders",
    icon: <Sneaker size={17} weight="duotone" />,
    imgs: ["/images/shoe.png", "/images/shoe1.png", "/images/shoe2.png"],
  },
  {
    label: "Wigs & Hair",
    desc: "Human hair & synthetics",
    icon: <Crown size={17} weight="duotone" />,
    imgs: ["/images/wig.png", "/images/wig1.png", "/images/wig2.png"],
  },
  {
    label: "Bags & Purses",
    desc: "Leather & designer",
    icon: <Handbag size={17} weight="duotone" />,
    imgs: ["/images/bags.png", "/images/bags1.png", "/images/bags2.png"],
  },
  {
    label: "Fabrics & Textiles",
    desc: "Ankara, lace, aso-oke",
    icon: <Scissors size={17} weight="duotone" />,
    imgs: ["/images/asooke.png", "/images/lace.png", "/images/ankara.png"],
  },
  {
    label: "Perfume & Scents",
    desc: "Fragrance for every occasion",
    icon: <SprayBottle size={17} weight="duotone" />,
    imgs: ["/images/perfume.png", "/images/perfume1.png", "/images/perfume2.png"],
  },
  {
    label: "Verified Vendors",
    desc: "Trusted sellers only",
    icon: <SealCheck size={17} weight="duotone" />,
    imgs: ["/images/vendor2.png", "/images/vendor1.png", "/images/vendor3.png"],
  },
  {
    label: "Fast Delivery",
    desc: "30 min – 1 hour",
    icon: <Truck size={17} weight="duotone" />,
    imgs: ["/images/riderBike.png", "/images/rider1.png", "/images/rider2.png"],
  },
];

export function Categories() {
  return (
    <section
      id="categories"
      style={{ padding: `${SECTION_Y} 0`, background: "var(--bg-sunk)" }}
      className="pat-dots"
    >
      <Shell>
        <SectionHead
          eyebrow="Categories"
          title="Fashion for everyone"
          blurb="Buy, sell and arrange delivery in one app — across every corner of the market."
        />
        <Stagger className="g-cat">
          {CATEGORIES.map((c) => (
            <StaggerItem key={c.label}>
              <div
                className="card lift"
                style={{
                  position: "relative",
                  aspectRatio: "4 / 5",
                  borderRadius: "var(--radius-lg)",
                  overflow: "hidden",
                  border: "1px solid var(--line)",
                  background: "var(--bg-inset)",
                  boxShadow: "var(--shadow-sm)",
                }}
              >
                <CategoryCarousel images={c.imgs} alt={c.label} />
                <div
                  aria-hidden
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(to top, rgba(8,17,15,0.92) 0%, rgba(8,17,15,0.42) 34%, rgba(8,17,15,0) 62%)",
                  }}
                />
                <span
                  style={{
                    position: "absolute",
                    top: 12,
                    right: 12,
                    width: 34,
                    height: 34,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "var(--radius-sm)",
                    background: "rgba(253,250,243,0.92)",
                    color: "var(--teal-ink)",
                  }}
                >
                  {c.icon}
                </span>
                <div style={{ position: "absolute", bottom: 16, left: 17, right: 17 }}>
                  <p
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: 19,
                      fontWeight: 600,
                      color: "#fdfaf3",
                      letterSpacing: "-0.01em",
                      marginBottom: 3,
                    }}
                  >
                    {c.label}
                  </p>
                  <p style={{ fontSize: 13.5, color: "rgba(253,250,243,0.74)" }}>
                    {c.desc}
                  </p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </Shell>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════
   HOW IT WORKS
   ══════════════════════════════════════════════════════════════════ */
const STEPS = [
  {
    n: "01",
    title: "Browse & buy",
    desc: "Discover thousands of fashion items from Nigeria's top markets, all in one place.",
    img: "/images/clotheWomen.png",
    alt: "A shopper browsing a rack of print dresses",
    tint: "var(--teal)",
  },
  {
    n: "02",
    title: "Vendors post & sell",
    desc: "Traders list their collections and reach thousands of buyers nationwide.",
    img: "/images/vendor1.png",
    alt: "A vendor arranging garments in her shop",
    tint: "var(--ochre)",
  },
  {
    n: "03",
    title: "Riders pick & deliver",
    desc: "Fast, reliable delivery tracked in real time, right to your door.",
    img: "/images/vendor3.png",
    alt: "A rider handing a parcel to a customer",
    tint: "var(--terra)",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" style={{ padding: `${SECTION_Y} 0` }}>
      <Shell>
        <SectionHead
          eyebrow="How it works"
          title="From discovery to doorstep"
          blurb="Three moving parts, one app — and payment stays in escrow until you confirm delivery."
        />
        <Stagger className="g-3">
          {STEPS.map((s) => (
            <StaggerItem key={s.n}>
              <div className="card lift" style={{ ...cardBase, height: "100%" }}>
                <div
                  style={{
                    position: "relative",
                    aspectRatio: "1 / 1",
                    overflow: "hidden",
                    background: "var(--bg-sunk)",
                  }}
                >
                  <Image
                    src={s.img}
                    alt={s.alt}
                    fill
                    sizes="(max-width: 1000px) 100vw, 350px"
                    className="zoom-img"
                    style={{ objectFit: "cover", objectPosition: "center 20%" }}
                  />
                  <span
                    style={{
                      position: "absolute",
                      bottom: 12,
                      left: 13,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 42,
                      height: 42,
                      borderRadius: "50%",
                      background: s.tint,
                      color: "var(--on-accent)",
                      fontFamily: "var(--font-display)",
                      fontSize: 16,
                      fontWeight: 700,
                      boxShadow: "var(--shadow-md)",
                    }}
                  >
                    {s.n}
                  </span>
                </div>
                <div style={{ padding: "18px 20px 22px" }}>
                  <h3
                    style={{
                      fontSize: 21,
                      fontWeight: 600,
                      color: "var(--ink)",
                      marginBottom: 10,
                    }}
                  >
                    {s.title}
                  </h3>
                  <p style={{ fontSize: 15.5, lineHeight: 1.74, color: "var(--ink-soft)" }}>
                    {s.desc}
                  </p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </Shell>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════
   TRUST
   ══════════════════════════════════════════════════════════════════ */
const TRUST = [
  { icon: <Lock size={22} weight="duotone" />, t: "Escrow payments", d: "Money held safely until delivery is confirmed.", tint: "var(--teal)", wash: "var(--teal-wash)" },
  { icon: <SealCheck size={22} weight="duotone" />, t: "Verified vendors", d: "Every seller passes strict verification.", tint: "var(--ochre)", wash: "var(--ochre-wash)" },
  { icon: <ShieldCheck size={22} weight="duotone" />, t: "Buyer protection", d: "Items guaranteed as described.", tint: "var(--terra)", wash: "var(--terra-wash)" },
  { icon: <Lightning size={22} weight="duotone" />, t: "Fast refunds", d: "Refunds within 24–48 hours.", tint: "var(--palm)", wash: "var(--palm-wash)" },
  { icon: <MapPin size={22} weight="duotone" />, t: "Live tracking", d: "Follow your rider in real time.", tint: "var(--teal)", wash: "var(--teal-wash)" },
  { icon: <Globe size={22} weight="duotone" />, t: "Built for Africa", d: "Designed around Nigerian markets.", tint: "var(--ochre)", wash: "var(--ochre-wash)" },
  { icon: <Sparkle size={22} weight="duotone" />, t: "Premium app", d: "Fast, smooth and glitch-free.", tint: "var(--terra)", wash: "var(--terra-wash)" },
  { icon: <Headset size={22} weight="duotone" />, t: "24/7 support", d: "Help via app, WhatsApp or email.", tint: "var(--palm)", wash: "var(--palm-wash)" },
];

export function Trust() {
  return (
    <section id="trust" style={{ padding: `${SECTION_Y} 0` }}>
      <Shell>
        <SectionHead
          eyebrow="Trust & safety"
          title="Your safety, our priority"
          blurb="Buying cloth you can't touch takes trust. Here's how we earn it."
        />
        <Stagger className="g-4">
          {TRUST.map((f) => (
            <StaggerItem key={f.t}>
              <div
                className="lift"
                style={{ ...cardBase, padding: 22, height: "100%" }}
              >
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 44,
                    height: 44,
                    borderRadius: "var(--radius-sm)",
                    background: f.wash,
                    color: f.tint,
                    marginBottom: 15,
                  }}
                >
                  {f.icon}
                </span>
                <h3
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: 16.5,
                    fontWeight: 700,
                    color: "var(--ink)",
                    letterSpacing: "-0.01em",
                    marginBottom: 8,
                  }}
                >
                  {f.t}
                </h3>
                <p style={{ fontSize: 14.5, lineHeight: 1.7, color: "var(--ink-soft)" }}>
                  {f.d}
                </p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </Shell>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════
   FEATURE REQUESTS
   ══════════════════════════════════════════════════════════════════ */
export function YourVoice() {
  return (
    <section style={{ padding: `${SECTION_Y} 0`, background: "var(--bg-sunk)" }}>
      <Shell style={{ maxWidth: 780 }}>
        <Reveal>
          <SectionHead
            eyebrow="Your voice matters"
            title="Help us build what you need"
            blurb="Tell us what features you'd like added, or any concerns. Life's already hard — let us make selling, buying and delivery easier for you."
          />
          <InquiryBox />
        </Reveal>
      </Shell>
    </section>
  );
}
