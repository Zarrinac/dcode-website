'use client';

import { motion, useReducedMotion, type HTMLMotionProps } from 'framer-motion';
import type { ReactNode } from 'react';

// Scroll-triggered fade + slide-in. Transforms/opacity only (no layout animation),
// so it never causes CLS. Respects prefers-reduced-motion (renders static).
type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** Direction the element travels in from. */
  from?: 'up' | 'down' | 'left' | 'right' | 'none';
  /** Render as a different element (e.g. 'li', 'section'). */
  as?: keyof typeof motion;
} & Omit<HTMLMotionProps<'div'>, 'ref'>;

const OFFSET = 24;

export default function Reveal({
  children,
  className,
  delay = 0,
  from = 'up',
  as = 'div',
  ...rest
}: RevealProps) {
  const reduce = useReducedMotion();
  const MotionTag = motion[as] as typeof motion.div;

  if (reduce) {
    return (
      <MotionTag className={className} {...rest}>
        {children}
      </MotionTag>
    );
  }

  const offset = {
    up: { y: OFFSET },
    down: { y: -OFFSET },
    left: { x: OFFSET },
    right: { x: -OFFSET },
    none: {},
  }[from];

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, ...offset }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, amount: 0.2, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay }}
      {...rest}
    >
      {children}
    </MotionTag>
  );
}
