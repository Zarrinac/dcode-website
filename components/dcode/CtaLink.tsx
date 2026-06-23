'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';

// Brand CTA link: a next/link styled as a pill button with a subtle scale on hover
// and press (scale-feedback per the motion guidelines). Two visual variants. The
// href stays in the DOM, so it remains crawlable/SEO-safe despite being a client island.
type CtaLinkProps = {
  href: string;
  children: ReactNode;
  variant?: 'primary' | 'ghost';
  className?: string;
  'aria-label'?: string;
};

const base =
  'inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-(--dcode-red)';

const variants = {
  primary: 'bg-(--dcode-red) text-white hover:bg-(--dcode-red-hover)',
  ghost:
    'border border-(--dcode-border-strong) text-(--dcode-text) hover:border-(--dcode-red) hover:text-white',
} as const;

export default function CtaLink({
  href,
  children,
  variant = 'primary',
  className,
  ...rest
}: CtaLinkProps) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className="inline-flex"
      whileHover={reduce ? undefined : { scale: 1.03 }}
      whileTap={reduce ? undefined : { scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      <Link href={href} className={`${base} ${variants[variant]} ${className ?? ''}`} {...rest}>
        {children}
      </Link>
    </motion.div>
  );
}
