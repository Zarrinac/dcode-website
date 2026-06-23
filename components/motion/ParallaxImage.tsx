'use client';

import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useRef, type ReactNode } from 'react';

// Subtle vertical parallax for hero product renders. Wrap an <Image fill> (or any
// absolutely-positioned child). Reduced-motion renders static.
type ParallaxImageProps = {
  children: ReactNode;
  className?: string;
  /** Travel distance in px across the scroll range. */
  distance?: number;
};

export default function ParallaxImage({ children, className, distance = 40 }: ParallaxImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], [distance, -distance]);

  return (
    <div ref={ref} className={className}>
      <motion.div style={reduce ? undefined : { y }} className="h-full w-full">
        {children}
      </motion.div>
    </div>
  );
}
