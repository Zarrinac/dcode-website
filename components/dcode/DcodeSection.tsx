import type { ReactNode } from 'react';
import { DCODE_BLEED_CLASS, DCODE_THEME_STYLE } from '@/components/dcode/dcodeTheme';
import type { Locale } from '@/i18n/routing';

// Full-bleed D'code-themed page section: applies the brand black/red theme tokens,
// cancels the locale layout padding, sets text direction, and re-centres a contained
// column. Reused by the landing, list, and detail pages.
type DcodeSectionProps = {
  locale: Locale;
  children: ReactNode;
  className?: string;
};

export default function DcodeSection({ locale, children, className }: DcodeSectionProps) {
  return (
    <div
      style={DCODE_THEME_STYLE}
      className={`${DCODE_BLEED_CLASS} bg-(--dcode-black) text-(--dcode-text)`}
      dir={locale === 'fa' ? 'rtl' : 'ltr'}
    >
      <div
        className={`mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-10 ${className ?? 'py-10 lg:py-16'}`}
      >
        {children}
      </div>
    </div>
  );
}
