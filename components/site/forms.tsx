"use client";

import { useState, type CSSProperties, type ReactNode } from "react";
import {
  ShoppingBag,
  Storefront,
  Moped,
  ArrowRight,
  Check,
  Confetti,
  Warning,
  SpinnerGap,
  PaperPlaneTilt,
  WhatsappLogo,
} from "@phosphor-icons/react/dist/ssr";
import { fieldBase } from "./primitives";

export type Role = "" | "buyer" | "vendor" | "rider";

const ROLES: { id: Exclude<Role, "">; label: string; icon: ReactNode }[] = [
  { id: "buyer", label: "Buyer", icon: <ShoppingBag size={17} weight="duotone" /> },
  { id: "vendor", label: "Vendor", icon: <Storefront size={17} weight="duotone" /> },
  { id: "rider", label: "Rider", icon: <Moped size={17} weight="duotone" /> },
];

const ROLE_TINT: Record<string, string> = {
  buyer: "var(--teal)",
  vendor: "var(--ochre)",
  rider: "var(--terra)",
};

function Field(props: React.InputHTMLAttributes<HTMLInputElement>) {
  // The design labels these inputs with their placeholder alone. A placeholder is
  // not a dependable accessible name — some screen readers skip it, and it
  // disappears the moment the field has a value — so mirror it into aria-label
  // unless the caller names the field itself. The trailing "*" is trimmed because
  // `required` already conveys that to assistive tech.
  const fromPlaceholder = props.placeholder?.replace(/\s*\*\s*$/, "");
  return (
    <input
      aria-label={props["aria-labelledby"] ? undefined : fromPlaceholder}
      {...props}
      style={{ ...fieldBase, ...props.style }}
      onFocus={(e) => {
        e.currentTarget.style.borderColor = "var(--teal)";
        e.currentTarget.style.boxShadow = "0 0 0 3px var(--teal-wash)";
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderColor = "var(--line)";
        e.currentTarget.style.boxShadow = "none";
      }}
    />
  );
}

function RoleChips({
  value,
  onChange,
}: {
  value: Role;
  onChange: (r: Role) => void;
}) {
  return (
    <div>
      <p
        style={{
          fontSize: 12.5,
          fontWeight: 700,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          color: "var(--ink-faint)",
          marginBottom: 9,
        }}
      >
        I&apos;m joining as <span style={{ color: "var(--terra)" }}>*</span>
      </p>
      <div style={{ display: "flex", gap: 9, flexWrap: "wrap" }}>
        {ROLES.map((r) => {
          const on = value === r.id;
          const tint = ROLE_TINT[r.id];
          return (
            <button
              key={r.id}
              type="button"
              aria-pressed={on}
              onClick={() => onChange(on ? "" : r.id)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 18px",
                borderRadius: 100,
                fontSize: 14.5,
                fontWeight: 700,
                fontFamily: "var(--font-sans)",
                cursor: "pointer",
                background: on ? tint : "var(--bg-sunk)",
                color: on ? "var(--on-accent)" : "var(--ink-soft)",
                border: `1.5px solid ${on ? tint : "var(--line)"}`,
                transition: "all 0.2s ease",
              }}
            >
              {on ? <Check size={16} weight="bold" /> : r.icon}
              {r.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Notice({
  tone,
  icon,
  title,
  body,
  children,
}: {
  tone: string;
  icon: ReactNode;
  title: string;
  body: string;
  children?: ReactNode;
}) {
  return (
    <div
      className="anim-rise"
      style={{
        textAlign: "center",
        padding: "30px 26px",
        borderRadius: "var(--radius-lg)",
        background: "var(--bg-raised)",
        border: `1.5px solid ${tone}`,
        boxShadow: "var(--shadow-sm)",
      }}
    >
      <span style={{ color: tone, display: "inline-flex", marginBottom: 12 }}>
        {icon}
      </span>
      <p
        style={{
          fontFamily: "var(--font-display)",
          fontSize: 21,
          fontWeight: 600,
          color: "var(--ink)",
          marginBottom: 7,
        }}
      >
        {title}
      </p>
      <p style={{ fontSize: 15, lineHeight: 1.72, color: "var(--ink-soft)" }}>{body}</p>
      {children}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   WAITLIST
   ══════════════════════════════════════════════════════════════════ */
export function WaitlistForm({ initialRole = "" }: { initialRole?: Role }) {
  const [role, setRole] = useState<Role>(initialRole);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [wa, setWa] = useState("");
  const [biz, setBiz] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [err, setErr] = useState("");
  const [why, setWhy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role) return setErr("Please select your role — Buyer, Vendor, or Rider.");
    if (!email.includes("@")) return setErr("Please enter a valid email.");
    if (!name.trim()) return setErr("Please enter your name.");
    if (!wa.trim() || wa.trim().length < 7)
      return setErr("Please enter your WhatsApp number — it's required for launch updates.");
    if (role === "vendor" && !biz.trim())
      return setErr("Please enter your business / shop name.");
    if (role === "rider" && !biz.trim())
      return setErr("Please enter your rider company / delivery business name.");

    setStatus("loading");
    setErr("");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.toLowerCase(),
          name: name.trim(),
          whatsapp: wa,
          role,
          businessName: role === "vendor" || role === "rider" ? biz : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus("error");
        setErr(data.error || "Something went wrong. Please try again.");
        return;
      }
      setStatus("success");
      setEmail("");
      setName("");
      setWa("");
      setRole("");
      setBiz("");
    } catch {
      setStatus("error");
      setErr("Network error please check your connection.");
    }
  };

  if (status === "success")
    return (
      <Notice
        tone="var(--teal)"
        icon={<Confetti size={40} weight="duotone" />}
        title="You're on the list!"
        body="Check your inbox — a confirmation is on its way. We'll notify you the moment we launch."
      />
    );

  if (status === "error")
    return (
      <Notice
        tone="var(--terra)"
        icon={<Warning size={36} weight="duotone" />}
        title="Something went wrong"
        body={err}
      >
        <button
          onClick={() => {
            setStatus("idle");
            setErr("");
          }}
          className="btn"
          style={{
            marginTop: 16,
            padding: "10px 22px",
            borderRadius: "var(--radius-sm)",
            background: "var(--terra-wash)",
            color: "var(--terra)",
            border: "1px solid var(--terra)",
            fontFamily: "var(--font-sans)",
            fontWeight: 700,
            fontSize: 14,
            cursor: "pointer",
          }}
        >
          Try again
        </button>
      </Notice>
    );

  return (
    <form
      onSubmit={submit}
      style={{ display: "flex", flexDirection: "column", gap: 13, width: "100%" }}
    >
      <RoleChips
        value={role}
        onChange={(r) => {
          setRole(r);
          setBiz("");
          setErr("");
        }}
      />

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <Field
          type="text"
          placeholder="Full name *"
          autoComplete="name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ flex: 1, minWidth: 190, width: "auto" }}
        />
        <Field
          type="email"
          placeholder="Email address *"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ flex: 1, minWidth: 190, width: "auto" }}
        />
        <Field
          type="tel"
          placeholder="WhatsApp number *"
          autoComplete="tel"
          required
          value={wa}
          onChange={(e) => setWa(e.target.value)}
          style={{ flex: 1, minWidth: 190, width: "auto" }}
        />
      </div>

      {(role === "vendor" || role === "rider") && (
        <Field
          className="anim-rise"
          type="text"
          required
          placeholder={
            role === "vendor"
              ? "Business / shop name *"
              : "Rider company / delivery business name *"
          }
          value={biz}
          onChange={(e) => setBiz(e.target.value)}
        />
      )}

      {err && (
        <p
          className="anim-fade"
          role="alert"
          style={{
            fontSize: 13.5,
            color: "var(--terra)",
            background: "var(--terra-wash)",
            border: "1px solid var(--terra)",
            borderRadius: "var(--radius-sm)",
            padding: "10px 13px",
            lineHeight: 1.6,
          }}
        >
          {err}
        </p>
      )}

      <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
        <button
          type="submit"
          disabled={status === "loading"}
          className="btn"
          style={{
            flex: 1,
            minWidth: 200,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 9,
            padding: "16px 28px",
            borderRadius: "var(--radius)",
            border: "none",
            background: "var(--teal)",
            color: "var(--on-accent)",
            fontFamily: "var(--font-sans)",
            fontWeight: 700,
            fontSize: 16,
            cursor: status === "loading" ? "wait" : "pointer",
            opacity: status === "loading" ? 0.75 : 1,
            boxShadow: "var(--shadow-md)",
          }}
        >
          {status === "loading" ? (
            <>
              <SpinnerGap size={19} weight="bold" className="spin" />
              Reserving…
            </>
          ) : (
            <>
              Reserve my spot
              <ArrowRight size={18} weight="bold" />
            </>
          )}
        </button>
        <button
          type="button"
          onClick={() => setWhy((v) => !v)}
          aria-expanded={why}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            background: "none",
            border: "none",
            padding: 0,
            color: "var(--ink-faint)",
            fontFamily: "var(--font-sans)",
            fontSize: 14,
            cursor: "pointer",
            textDecoration: "underline",
            textUnderlineOffset: 3,
          }}
        >
          <WhatsappLogo size={16} weight="fill" />
          Why WhatsApp?
        </button>
      </div>

      {why && (
        <p
          className="anim-rise"
          style={{
            fontSize: 14.5,
            lineHeight: 1.72,
            color: "var(--ink-soft)",
            background: "var(--bg-sunk)",
            border: "1px solid var(--line)",
            borderRadius: "var(--radius-sm)",
            padding: "13px 15px",
          }}
        >
          <strong style={{ color: "var(--teal)" }}>We promise:</strong> WhatsApp is
          only used for your launch notification. No spam, ever.
        </p>
      )}
    </form>
  );
}

/* ══════════════════════════════════════════════════════════════════
   CONTACT
   ══════════════════════════════════════════════════════════════════ */
export function ContactForm() {
  const [f, setF] = useState({ name: "", email: "", subject: "", msg: "" });
  const [sent, setSent] = useState(false);
  const set =
    (k: keyof typeof f) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setF((p) => ({ ...p, [k]: e.target.value }));

  if (sent)
    return (
      <Notice
        tone="var(--teal)"
        icon={<Check size={34} weight="bold" />}
        title="Message sent"
        body="We'll get back to you within 24 hours."
      />
    );

  const areaStyle: CSSProperties = {
    ...fieldBase,
    minHeight: 112,
    resize: "vertical",
    lineHeight: 1.6,
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
      }}
      style={{ display: "flex", flexDirection: "column", gap: 11 }}
    >
      <div style={{ display: "flex", gap: 11, flexWrap: "wrap" }}>
        <Field
          placeholder="Your name"
          required
          value={f.name}
          onChange={set("name")}
          style={{ flex: 1, minWidth: 170, width: "auto" }}
        />
        <Field
          type="email"
          placeholder="Email address"
          required
          value={f.email}
          onChange={set("email")}
          style={{ flex: 1, minWidth: 170, width: "auto" }}
        />
      </div>
      <Field placeholder="Subject" required value={f.subject} onChange={set("subject")} />
      <textarea
        aria-label="Message"
        placeholder="Tell us how we can help, or what features you'd love to see…"
        required
        value={f.msg}
        onChange={set("msg")}
        style={areaStyle}
      />
      <button
        type="submit"
        className="btn"
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 9,
          padding: "14px 22px",
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
        Send message
        <PaperPlaneTilt size={17} weight="fill" />
      </button>
    </form>
  );
}

/* ══════════════════════════════════════════════════════════════════
   FEATURE-REQUEST BOX
   ══════════════════════════════════════════════════════════════════ */
export function InquiryBox() {
  const [val, setVal] = useState("");
  const [sent, setSent] = useState(false);

  if (sent)
    return (
      <p
        className="anim-rise"
        style={{
          textAlign: "center",
          padding: "17px 20px",
          borderRadius: "var(--radius)",
          background: "var(--teal-wash)",
          border: "1px solid var(--teal)",
          color: "var(--teal)",
          fontWeight: 700,
          fontSize: 15,
        }}
      >
        Thanks for sharing — we&apos;ve noted your suggestion.
      </p>
    );

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
      }}
      style={{ display: "flex", gap: 11, flexWrap: "wrap", alignItems: "flex-end" }}
    >
      <textarea
        aria-label="Your feedback or feature request"
        value={val}
        onChange={(e) => setVal(e.target.value)}
        required
        placeholder="Tell us what features you'd love, or any concerns. We have your best interest at heart…"
        style={{
          ...fieldBase,
          flex: 1,
          minWidth: 240,
          width: "auto",
          minHeight: 108,
          resize: "vertical",
          lineHeight: 1.6,
        }}
      />
      <button
        type="submit"
        className="btn"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 9,
          padding: "14px 24px",
          borderRadius: "var(--radius)",
          border: "none",
          background: "var(--teal)",
          color: "var(--on-accent)",
          fontFamily: "var(--font-sans)",
          fontWeight: 700,
          fontSize: 15.5,
          cursor: "pointer",
          boxShadow: "var(--shadow-sm)",
        }}
      >
        Submit
        <ArrowRight size={17} weight="bold" />
      </button>
    </form>
  );
}
