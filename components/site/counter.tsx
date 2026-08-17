"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";

/** Counts up to `target` the first time it scrolls into view. */
export function Counter({
  target,
  suffix = "",
  duration = 1800,
}: {
  target: number;
  suffix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const still = useReducedMotion();
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView || still) return;
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - t0) / duration, 1);
      setN(Math.round((1 - Math.pow(1 - p, 3)) * target)); // easeOutCubic
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, still, target, duration]);

  // With motion reduced there's nothing to animate, so show the final value.
  const shown = still ? target : n;

  return (
    <span ref={ref}>
      {shown.toLocaleString("en-NG")}
      {suffix}
    </span>
  );
}
