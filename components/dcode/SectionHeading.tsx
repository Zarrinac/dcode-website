import type { ReactNode } from 'react';
import Reveal from '@/components/motion/Reveal';

// Consistent section header: a red eyebrow label, a title, and optional supporting
// text. The heading level is configurable so pages keep a valid h1 → h2 → h3 order.
type SectionHeadingProps = {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  as?: 'h2' | 'h3';
  align?: 'start' | 'center';
  className?: string;
};

export default function SectionHeading({
  eyebrow,
  title,
  description,
  as: Tag = 'h2',
  align = 'start',
  className,
}: SectionHeadingProps) {
  return (
    <Reveal
      className={`flex flex-col gap-3 ${align === 'center' ? 'items-center text-center' : ''} ${
        className ?? ''
      }`}
    >
      {eyebrow && (
        <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-(--dcode-red)">
          <span className="h-1.5 w-1.5 rounded-full bg-(--dcode-red)" aria-hidden />
          {eyebrow}
        </span>
      )}
      <Tag className="text-pretty text-2xl font-bold tracking-tight text-(--dcode-text) sm:text-3xl lg:text-4xl">
        {title}
      </Tag>
      {description && (
        <p
          className={`max-w-2xl text-base leading-relaxed text-(--dcode-text-muted) ${
            align === 'center' ? 'mx-auto' : ''
          }`}
        >
          {description}
        </p>
      )}
    </Reveal>
  );
}
