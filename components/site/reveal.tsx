"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import type { CSSProperties, ReactNode } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

const groupVariants: Variants = {
  hidden: {},
  shown: { transition: { staggerChildren: 0.075, delayChildren: 0.04 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 22 },
  shown: { opacity: 1, y: 0, transition: { duration: 0.62, ease: EASE } },
};

type Props = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  id?: string;
};

/** A single block that fades and rises once as it scrolls into view. */
export function Reveal({ children, className, style, id }: Props) {
  const still = useReducedMotion();
  if (still) {
    return (
      <div id={id} className={className} style={style}>
        {children}
      </div>
    );
  }
  return (
    <motion.div
      id={id}
      data-reveal
      className={className}
      style={style}
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.62, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Wraps a grid or list. Direct `<StaggerItem>` children inherit the
 * variants and animate in sequence rather than all at once.
 */
export function Stagger({ children, className, style, id }: Props) {
  const still = useReducedMotion();
  if (still) {
    return (
      <div id={id} className={className} style={style}>
        {children}
      </div>
    );
  }
  return (
    <motion.div
      id={id}
      className={className}
      style={style}
      variants={groupVariants}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, amount: 0.12 }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className, style }: Props) {
  const still = useReducedMotion();
  if (still) {
    return (
      <div className={className} style={style}>
        {children}
      </div>
    );
  }
  return (
    <motion.div
      data-reveal
      className={className}
      style={style}
      variants={itemVariants}
    >
      {children}
    </motion.div>
  );
}
