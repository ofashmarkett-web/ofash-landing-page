"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X, Envelope, MapPin, Clock, DownloadSimple } from "@phosphor-icons/react/dist/ssr";
import type { CSSProperties, ReactNode } from "react";
import { LEGAL, type LegalKey } from "@/content/legal";
import { ContactForm } from "./forms";

/* Radix handles focus trapping, scroll locking, Escape and aria-* — the
   parts the previous hand-rolled modals were missing. */

function CloseButton() {
  return (
    <Dialog.Close asChild>
      <button
        aria-label="Close"
        style={{
          width: 34,
          height: 34,
          flexShrink: 0,
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
        <X size={16} weight="bold" />
      </button>
    </Dialog.Close>
  );
}

function Panel({
  title,
  children,
  description,
}: {
  title: string;
  children: ReactNode;
  description?: string;
}) {
  return (
    <Dialog.Portal>
      <Dialog.Overlay className="dlg-overlay" />
      <Dialog.Content className="dlg-panel">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
            padding: "20px 24px 16px",
            borderBottom: "1px solid var(--line)",
            flexShrink: 0,
          }}
        >
          <Dialog.Title
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 21,
              fontWeight: 600,
              color: "var(--ink)",
              letterSpacing: "-0.02em",
            }}
          >
            {title}
          </Dialog.Title>
          <CloseButton />
        </div>
        {description && (
          <Dialog.Description
            style={{
              padding: "16px 24px 0",
              fontSize: 15,
              lineHeight: 1.7,
              color: "var(--ink-soft)",
            }}
          >
            {description}
          </Dialog.Description>
        )}
        <div style={{ padding: "20px 24px 28px", overflowY: "auto", flex: 1 }}>
          {children}
        </div>
        <div className="kente kente-thin" aria-hidden />
      </Dialog.Content>
    </Dialog.Portal>
  );
}

/** A footer/nav link that opens one of the long-form policy documents. */
export function LegalLink({
  doc,
  children,
  style,
  className = "u-link",
}: {
  doc: LegalKey;
  children: ReactNode;
  style?: CSSProperties;
  className?: string;
}) {
  const { title, sections } = LEGAL[doc];
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button
          className={className}
          style={{
            background: "none",
            border: "none",
            padding: 0,
            font: "inherit",
            color: "var(--ink-soft)",
            cursor: "pointer",
            textAlign: "left",
            ...style,
          }}
        >
          {children}
        </button>
      </Dialog.Trigger>
      <Panel title={title}>
        {sections.map((s) => (
          <div key={s.h} style={{ marginBottom: 22 }}>
            <h3
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: 14.5,
                fontWeight: 700,
                color: "var(--teal)",
                marginBottom: 7,
                letterSpacing: "0",
              }}
            >
              {s.h}
            </h3>
            <p style={{ fontSize: 15, lineHeight: 1.78, color: "var(--ink-soft)" }}>
              {s.p}
            </p>
          </div>
        ))}
      </Panel>
    </Dialog.Root>
  );
}

/** A footer/nav link that opens the contact form. */
export function ContactLink({
  children,
  style,
  className = "u-link",
}: {
  children: ReactNode;
  style?: CSSProperties;
  className?: string;
}) {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button
          className={className}
          style={{
            background: "none",
            border: "none",
            padding: 0,
            font: "inherit",
            color: "var(--ink-soft)",
            cursor: "pointer",
            textAlign: "left",
            ...style,
          }}
        >
          {children}
        </button>
      </Dialog.Trigger>
      <Panel
        title="Contact Us"
        description="Tell us how we can help, or what you'd love to see in the app."
      >
        <ContactForm />
        <div
          style={{
            display: "flex",
            gap: 18,
            flexWrap: "wrap",
            marginTop: 20,
            paddingTop: 16,
            borderTop: "1px solid var(--line)",
          }}
        >
          {[
            { icon: <Envelope size={15} />, t: "contact@o-fashmarkett.com" },
            { icon: <MapPin size={15} />, t: "Lagos, Nigeria" },
            { icon: <Clock size={15} />, t: "Replies within 24hrs" },
          ].map((x) => (
            <span
              key={x.t}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                fontSize: 13,
                color: "var(--ink-faint)",
              }}
            >
              <span style={{ color: "var(--terra)", display: "flex" }}>{x.icon}</span>
              {x.t}
            </span>
          ))}
        </div>
      </Panel>
    </Dialog.Root>
  );
}

/**
 * Wraps the app-store buttons: they aren't real links yet, so tapping one
 * explains what happens next instead of doing nothing.
 */
export function AppNoticeDialog({ children }: { children: ReactNode }) {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="dlg-overlay" />
        <Dialog.Content className="dlg-panel" style={{ maxWidth: 430 }}>
          <div style={{ padding: "26px 26px 28px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                marginBottom: 18,
              }}
            >
              <span
                style={{
                  width: 52,
                  height: 52,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "var(--radius)",
                  background: "var(--teal-wash)",
                  color: "var(--teal)",
                }}
              >
                <DownloadSimple size={26} weight="duotone" />
              </span>
              <CloseButton />
            </div>
            <Dialog.Title
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 24,
                fontWeight: 600,
                color: "var(--ink)",
                letterSpacing: "-0.02em",
                marginBottom: 10,
              }}
            >
              App download coming soon
            </Dialog.Title>
            <Dialog.Description
              style={{
                fontSize: 15.5,
                lineHeight: 1.75,
                color: "var(--ink-soft)",
                marginBottom: 22,
              }}
            >
              We&apos;re working on the mobile app and will contact you through the
              email provided in your waitlist registration.
            </Dialog.Description>
            <Dialog.Close asChild>
              <button
                className="btn"
                style={{
                  width: "100%",
                  padding: "14px 18px",
                  borderRadius: "var(--radius)",
                  border: "none",
                  background: "var(--teal)",
                  color: "var(--on-accent)",
                  fontFamily: "var(--font-sans)",
                  fontWeight: 700,
                  fontSize: 15.5,
                  cursor: "pointer",
                }}
              >
                Got it
              </button>
            </Dialog.Close>
          </div>
          <div className="kente kente-thin" aria-hidden />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
