import type { Metadata, Viewport } from "next";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { SITE_URL } from "@/lib/site";

// Warm, high-contrast serif for display — the optical-size axis keeps the
// big hero settings refined instead of merely large.
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["SOFT", "WONK", "opsz"],
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "O-Fash Markett — Africa's Fashion Market, One Click Away",
  description:
    "Shop Balogun, Onitsha, Ariaria and every African fashion market from one app. Verified vendors, escrow payments, delivery in hours. Free to join as a buyer, vendor, or rider.",
  keywords: [
    "African fashion marketplace",
    "Nigerian fashion",
    "Balogun market online",
    "Ankara",
    "aso-oke",
    "Lagos delivery",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    title: "O-Fash Markett — Africa's Fashion Market, One Click Away",
    description:
      "The digital twin of Africa's fashion markets. Verified vendors, escrow payments, delivery in hours.",
    type: "website",
    locale: "en_NG",
    siteName: "O-Fash Markett",
    url: "/",
    images: [
      {
        url: "/images/heroMarket.png",
        width: 1360,
        height: 768,
        alt: "Traders and fabric stalls in a Nigerian fashion market",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "O-Fash Markett — Africa's Fashion Market, One Click Away",
    description:
      "The digital twin of Africa's fashion markets. Verified vendors, escrow payments, delivery in hours.",
    images: ["/images/heroMarket.png"],
  },
};

// Matches `--bg` in globals.css so mobile browser chrome blends with the page.
// Deliberately a single light value rather than a prefers-color-scheme pair:
// the theme follows the stored `data-theme` toggle, not OS preference, and light
// is the default first paint for every visitor who has not opted into dark.
export const viewport: Viewport = {
  themeColor: "#faf4e8",
};

// Applies the stored theme before first paint so a returning dark-mode
// visitor never sees a cream flash. Light is the default.
const THEME_BOOTSTRAP = `
try {
  var t = localStorage.getItem("ofash-theme");
  if (t === "dark") document.documentElement.dataset.theme = "dark";
} catch (e) {}
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      // The bootstrap script below sets data-theme before React hydrates, so
      // this element legitimately differs from the server HTML.
      suppressHydrationWarning
      className={`${fraunces.variable} ${jakarta.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOTSTRAP }} />
        {/* Scroll-reveal starts hidden and is animated in by Motion. With
            scripting off, nothing would ever reveal it — so force it open. */}
        <noscript>
          <style>{`[data-reveal]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
