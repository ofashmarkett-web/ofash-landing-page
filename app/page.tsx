import { Navigation } from "@/components/site/nav";
import { Hero } from "@/components/site/hero";
import {
  MarketRibbon,
  MarketBanner,
  WhoWeServe,
  Categories,
  HowItWorks,
  Trust,
  YourVoice,
} from "@/components/site/sections";
import { AppDownload } from "@/components/site/app-download";
import { FAQ } from "@/components/site/faq";
import { Footer } from "@/components/site/footer";

/**
 * Server Component. Only the pieces that genuinely need interactivity
 * (nav sheet, theme toggle, counters, carousels, dialogs, forms) ship
 * JavaScript — the rest of this page is static HTML.
 */
export default function Home() {
  return (
    <>
      <Navigation />
      <main>
        <Hero />
        <MarketRibbon />
        <WhoWeServe />
        <MarketBanner />
        <Categories />
        <HowItWorks />
        <AppDownload />
        <Trust />
        <FAQ />
        <YourVoice />
      </main>
      <Footer />
    </>
  );
}
