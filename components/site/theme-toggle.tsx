"use client";

import { useSyncExternalStore } from "react";
import { Sun, Moon } from "@phosphor-icons/react/dist/ssr";

const KEY = "ofash-theme";

/* The theme lives on <html data-theme>, which is an external system as far
   as React is concerned — so it's read through useSyncExternalStore rather
   than mirrored into state inside an effect. That keeps hydration honest
   (the inline bootstrap may already have set dark before React ran). */

const listeners = new Set<() => void>();

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

function isDark() {
  return document.documentElement.dataset.theme === "dark";
}

function serverSnapshot() {
  return false; // light is the default
}

function apply(next: boolean) {
  if (next) document.documentElement.dataset.theme = "dark";
  else delete document.documentElement.dataset.theme;
  try {
    localStorage.setItem(KEY, next ? "dark" : "light");
  } catch {
    /* private browsing — the toggle still works for this session */
  }
  listeners.forEach((l) => l());
}

export function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const dark = useSyncExternalStore(subscribe, isDark, serverSnapshot);
  const toggle = () => apply(!dark);
  const label = dark ? "Switch to light mode" : "Switch to dark mode";

  if (compact) {
    return (
      <button
        onClick={toggle}
        aria-label={label}
        title={label}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 9,
          width: "100%",
          padding: "13px 26px",
          background: "none",
          border: "none",
          borderTop: "1px solid var(--line)",
          color: "var(--ink-soft)",
          font: "inherit",
          fontWeight: 600,
          cursor: "pointer",
          textAlign: "left",
        }}
      >
        {dark ? <Sun size={18} weight="bold" /> : <Moon size={18} weight="bold" />}
        {dark ? "Light mode" : "Dark mode"}
      </button>
    );
  }

  return (
    <button
      onClick={toggle}
      aria-label={label}
      title={label}
      className="btn"
      style={{
        width: 40,
        height: 40,
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
      {dark ? <Sun size={19} weight="fill" /> : <Moon size={19} weight="fill" />}
    </button>
  );
}
