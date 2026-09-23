// ============================================================
// SKILLSWAP — useScrollReveal hook
// ============================================================
// Returns Framer Motion props to fade+slide in when element
// enters the viewport. Use as: <motion.div {...scrollReveal()}>
import { useInView, useReducedMotion } from 'framer-motion';
import { useRef } from 'react';

interface ScrollRevealOptions {
  delay?: number;       // seconds
  distance?: number;    // px to slide from
  once?: boolean;
}

export function useScrollReveal(opts: ScrollRevealOptions = {}) {
  const { delay = 0, distance = 16, once = true } = opts;
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, margin: '0px 0px -80px 0px' });
  const prefersReducedMotion = useReducedMotion();

  const motionProps = {
    ref,
    initial: prefersReducedMotion ? false : { opacity: 0, y: distance },
    animate: prefersReducedMotion || isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: distance },
    transition: prefersReducedMotion ? { duration: 0 } : { duration: 0.38, ease: [0.22, 1, 0.36, 1] as const, delay },
  } as const;

  return motionProps;
}

