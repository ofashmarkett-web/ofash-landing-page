"use client";

import * as Accordion from "@radix-ui/react-accordion";
import { CaretDown } from "@phosphor-icons/react/dist/ssr";
import { Shell, SectionHead, SECTION_Y } from "./primitives";

const ITEMS = [
  {
    q: "What is O-Fash Markett?",
    a: "It's the digital twin of Africa's fashion markets. Balogun, Onitsha, Dutse all in one app. Access multiple vendors, shop items, and get delivery in hours.",
  },
  {
    q: "Is registration really free?",
    a: "Yes! 100% free to join as a buyer, vendor, or rider. No hidden charges. Only transaction fees apply when you make a sale.",
  },
  {
    q: "How are vendors verified?",
    a: "Every vendor passes strict onboarding checks before listing products. Only verified sellers appear on the platform.",
  },
  {
    q: "How long does delivery take?",
    a: "30 minutes to 5 hours depending on vendor location and rider availability. We're constantly optimizing.",
  },
  {
    q: "Is my payment safe?",
    a: "Absolutely. We hold payments in escrow until delivery is confirmed. Your money is always protected.",
  },
  {
    q: "What if I'm not happy with my order?",
    a: "No problem. Items can be returned if not as described. Refunds processed within 24–48 hours.",
  },
];

export function FAQ() {
  return (
    <section id="faq" style={{ padding: `${SECTION_Y} 0` }}>
      <Shell style={{ maxWidth: 780 }}>
        <SectionHead eyebrow="Questions" title="Frequently asked" />
        {/* Radix wires up the ARIA, keyboard nav and height animation */}
        <Accordion.Root type="single" collapsible style={{ display: "grid", gap: 10 }}>
          {ITEMS.map((item, i) => (
            <Accordion.Item
              key={i}
              value={`i${i}`}
              style={{
                background: "var(--bg-raised)",
                border: "1px solid var(--line)",
                borderRadius: "var(--radius)",
                overflow: "hidden",
              }}
            >
              <Accordion.Header style={{ margin: 0 }}>
                <Accordion.Trigger
                  className="acc-trigger"
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 16,
                    padding: "18px 20px",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left",
                    fontFamily: "var(--font-sans)",
                    fontSize: 16.5,
                    fontWeight: 600,
                    color: "var(--ink)",
                  }}
                >
                  {item.q}
                  <CaretDown
                    className="acc-caret"
                    size={18}
                    weight="bold"
                    color="var(--terra)"
                    style={{ flexShrink: 0 }}
                  />
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content className="acc-content">
                <p
                  style={{
                    padding: "0 20px 20px",
                    fontSize: 15.5,
                    lineHeight: 1.78,
                    color: "var(--ink-soft)",
                  }}
                >
                  {item.a}
                </p>
              </Accordion.Content>
            </Accordion.Item>
          ))}
        </Accordion.Root>
      </Shell>
    </section>
  );
}
