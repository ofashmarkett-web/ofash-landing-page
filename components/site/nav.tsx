"use client";

import Link from "next/link";
import * as Dialog from "@radix-ui/react-dialog";
import { List, X, ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { useEffect, useState } from "react";
import { Logo, KenteBand } from "./primitives";
import { ThemeToggle } from "./theme-toggle";
import { LegalLink, ContactLink } from "./dialogs";

const LINKS: [string, string][] = [
  ["How It Works", "#how-it-works"],
  ["Who We Serve", "#who-we-serve"],
  ["Categories", "#categories"],
  ["FAQ", "#faq"],
];

export function Navigation() {
  const [lifted, setLifted] = useState(false);

  // The bar starts flush with the hero and gains a shadow once you scroll,
  // so it reads as part of the page rather than a floating slab.
  useEffect(() => {
    const onScroll = () => setLifted(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 200,
        background: "var(--nav-bg)",
        backdropFilter: "blur(16px) saturate(150%)",
        WebkitBackdropFilter: "blur(16px) saturate(150%)",
        boxShadow: lifted ? "var(--shadow-sm)" : "none",
        transition: "box-shadow 0.3s ease",
      }}
    >
      <nav
        style={{
          height: "var(--nav-h)",
          maxWidth: "var(--shell)",
          margin: "0 auto",
          padding: "0 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 20,
        }}
      >
        <Link href="/" aria-label="O-Fash Markett home" style={{ textDecoration: "none" }}>
          <Logo mark={34} />
        </Link>

        <ul
          className="hide-mobile"
          style={{ display: "flex", gap: 30, listStyle: "none", margin: 0, padding: 0 }}
        >
          {LINKS.map(([label, href]) => (
            <li key={label}>
              <a
                href={href}
                className="u-link"
                style={{
                  color: "var(--ink-soft)",
                  fontSize: 15,
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <ThemeToggle />
          <Link
            href="/waitlist"
            className="btn hide-mobile"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "11px 22px",
              borderRadius: "var(--radius-sm)",
              background: "var(--teal)",
              color: "var(--on-accent)",
              fontWeight: 700,
              fontSize: 14.5,
              textDecoration: "none",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            Join waitlist
          </Link>

          {/* Mobile sheet — Radix supplies the focus trap and scroll lock */}
          <Dialog.Root>
            <Dialog.Trigger asChild>
              <button
                className="only-mobile"
                aria-label="Open menu"
                style={{
                  width: 40,
                  height: 40,
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "var(--radius-sm)",
                  background: "var(--bg-sunk)",
                  border: "1px solid var(--line)",
                  color: "var(--ink)",
                  cursor: "pointer",
                }}
              >
                <List size={20} weight="bold" />
              </button>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="dlg-overlay" />
              <Dialog.Content className="sheet">
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "14px 20px",
                    borderBottom: "1px solid var(--line)",
                  }}
                >
                  <Dialog.Title style={{ display: "flex" }}>
                    <Logo mark={30} />
                  </Dialog.Title>
                  <Dialog.Close asChild>
                    <button
                      aria-label="Close menu"
                      style={{
                        width: 36,
                        height: 36,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "var(--radius-sm)",
                        background: "var(--bg-sunk)",
                        border: "1px solid var(--line)",
                        color: "var(--ink-soft)",
                        cursor: "pointer",
                      }}
                    >
                      <X size={17} weight="bold" />
                    </button>
                  </Dialog.Close>
                </div>

                <div style={{ overflowY: "auto", flex: 1 }}>
                  {LINKS.map(([label, href]) => (
                    <Dialog.Close asChild key={label}>
                      <a
                        href={href}
                        style={{
                          display: "block",
                          padding: "14px 26px",
                          borderBottom: "1px solid var(--line)",
                          color: "var(--ink)",
                          fontSize: 16,
                          fontWeight: 600,
                          textDecoration: "none",
                        }}
                      >
                        {label}
                      </a>
                    </Dialog.Close>
                  ))}

                  <p
                    style={{
                      padding: "18px 26px 8px",
                      fontSize: 11.5,
                      fontWeight: 700,
                      letterSpacing: "0.16em",
                      textTransform: "uppercase",
                      color: "var(--ink-faint)",
                    }}
                  >
                    Company
                  </p>
                  {(
                    [
                      ["About us", "about"],
                      ["Privacy policy", "privacy"],
                    ] as const
                  ).map(([label, doc]) => (
                    <div
                      key={label}
                      style={{ borderBottom: "1px solid var(--line)", padding: "13px 26px" }}
                    >
                      <LegalLink doc={doc} style={{ fontSize: 16, fontWeight: 600 }}>
                        {label}
                      </LegalLink>
                    </div>
                  ))}
                  <div style={{ borderBottom: "1px solid var(--line)", padding: "13px 26px" }}>
                    <ContactLink style={{ fontSize: 16, fontWeight: 600 }}>
                      Contact us
                    </ContactLink>
                  </div>

                  <div style={{ padding: "20px 26px" }}>
                    <Dialog.Close asChild>
                      <Link
                        href="/waitlist"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 9,
                          width: "100%",
                          padding: "15px",
                          borderRadius: "var(--radius)",
                          background: "var(--teal)",
                          color: "var(--on-accent)",
                          fontWeight: 700,
                          fontSize: 16,
                          textDecoration: "none",
                        }}
                      >
                        Join waitlist
                        <ArrowRight size={17} weight="bold" />
                      </Link>
                    </Dialog.Close>
                  </div>
                </div>

                <ThemeToggle compact />
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      </nav>
      <KenteBand thin />
    </header>
  );
}
