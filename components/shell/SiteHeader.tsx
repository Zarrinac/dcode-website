import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import DcodeLogo from '@/components/dcode/DcodeLogo';
import LocaleToggle from '@/components/shell/LocaleToggle';
import { DCODE_BRAND } from '@/lib/dcode/brand';
import type { Locale } from '@/i18n/routing';

// Slim, D'code-branded site header: logo (→ home), primary nav, and a locale toggle.
export default async function SiteHeader({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: 'Shell' });

  return (
    <header className="sticky top-0 z-50 border-b border-(--dcode-border) bg-(--dcode-black)/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-10">
        <Link href={`/${locale}`} aria-label={DCODE_BRAND.name}>
          <DcodeLogo className="h-8 w-auto" priority />
        </Link>
        <nav className="flex items-center gap-4 text-sm font-semibold text-(--dcode-text-muted) sm:gap-6">
          <Link href={`/${locale}`} className="transition-colors hover:text-(--dcode-red)">
            {t('home')}
          </Link>
          <Link href={`/${locale}/tvs`} className="transition-colors hover:text-(--dcode-red)">
            {t('tvs')}
          </Link>
          <LocaleToggle locale={locale} labels={{ fa: t('localeFa'), en: t('localeEn') }} />
        </nav>
      </div>
    </header>
  );
}
