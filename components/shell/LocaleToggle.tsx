'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { Locale } from '@/i18n/routing';

// Swaps the leading locale segment of the current path, preserving the rest, so
// the user stays on the same page when switching language.
type LocaleToggleProps = {
  locale: Locale;
  labels: { fa: string; en: string };
};

export default function LocaleToggle({ locale, labels }: LocaleToggleProps) {
  const pathname = usePathname() ?? `/${locale}`;
  const target: Locale = locale === 'fa' ? 'en' : 'fa';

  const segments = pathname.split('/');
  segments[1] = target; // segments[0] is '' (leading slash), segments[1] is the locale
  const href = segments.join('/') || `/${target}`;

  return (
    <Link
      href={href}
      hrefLang={target}
      className="rounded-full border border-(--dcode-border) px-3 py-1 text-xs font-semibold text-(--dcode-text) transition-colors hover:border-(--dcode-red) hover:text-(--dcode-red)"
    >
      {target === 'fa' ? labels.fa : labels.en}
    </Link>
  );
}
