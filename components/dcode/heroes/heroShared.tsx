'use client';

import { motion, useReducedMotion, type Variants } from 'framer-motion';
import type { ReactNode } from 'react';
import { DCODE_BLEED_CLASS, DCODE_THEME_STYLE } from '@/components/dcode/dcodeTheme';
import type { Locale } from '@/i18n/routing';

// Shared scaffolding for the hero variants: a full-bleed themed frame (background
// slot + content + scroll cue) and a reusable per-word headline reveal. Each
// variant supplies its own animated background. Reduced-motion renders static.

export const EASE = [0.22, 1, 0.36, 1] as const;

export const heroContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.12 } },
};

export const heroRise: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

const headlineStagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const wordRise: Variants = {
  hidden: { opacity: 0, y: '0.5em' },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

export type HeroVariantProps = {
  locale: Locale;
  title: string;
  subtitle: string;
};

// Standard headline: per-word stagger, glowing brand-red final word.
export function HeadlineReveal({ title }: { title: string }) {
  const reduce = useReducedMotion();
  const words = title.trim().split(/\s+/);
  const last = words.length - 1;
  return (
    <motion.h1
      id="hero-title"
      variants={reduce ? undefined : headlineStagger}
      className="max-w-4xl text-balance text-4xl font-extrabold leading-[1.06] tracking-tight sm:text-6xl lg:text-7xl"
    >
      {words.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          variants={reduce ? undefined : wordRise}
          className={`inline-block ${i === last ? 'text-(--dcode-red)' : ''}`}
          style={i === last ? { textShadow: '0 0 40px var(--dcode-red-glow)' } : undefined}
        >
          {word}
          {i < last ? ' ' : ''}
        </motion.span>
      ))}
    </motion.h1>
  );
}

function ScrollCue() {
  const reduce = useReducedMotion();
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 bottom-6 flex justify-center"
    >
      <span className="flex h-9 w-5 items-start justify-center rounded-full border border-(--dcode-border-strong) p-1.5">
        <span
          className={`size-1.5 rounded-full bg-(--dcode-text-muted) ${reduce ? '' : 'dcode-scroll-dot'}`}
        />
      </span>
    </div>
  );
}

// Full-bleed themed hero shell. `background` renders behind the content (inside a
// pointer-events-none, -z-10 layer with edge vignettes); `children` are the
// staggered content items (headline, subtitle).
export function HeroFrame({
  locale,
  background,
  children,
}: {
  locale: Locale;
  background: ReactNode;
  children: ReactNode;
}) {
  const reduce = useReducedMotion();
  return (
    <section
      dir={locale === 'fa' ? 'rtl' : 'ltr'}
      style={DCODE_THEME_STYLE}
      className={`${DCODE_BLEED_CLASS} relative isolate flex min-h-[78vh] items-center overflow-hidden bg-(--dcode-black) text-(--dcode-text) lg:min-h-[86vh]`}
      aria-labelledby="hero-title"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        {background}
        <div className="absolute inset-x-0 top-0 h-28 bg-linear-to-b from-(--dcode-black) to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-44 bg-linear-to-t from-(--dcode-black) to-transparent" />
      </div>

      <motion.div
        variants={reduce ? undefined : heroContainer}
        initial={reduce ? undefined : 'hidden'}
        animate={reduce ? undefined : 'show'}
        className="mx-auto flex w-full max-w-5xl flex-col items-center gap-7 px-4 py-24 text-center sm:px-6 lg:px-10"
      >
        {children}
      </motion.div>

      <ScrollCue />
    </section>
  );
}
