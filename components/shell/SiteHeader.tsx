import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import DcodeLogo from '@/components/dcode/DcodeLogo';
import LocaleToggle from '@/components/shell/LocaleToggle';
import MainNav, { type NavItem } from '@/components/shell/MainNav';
import MobileNav from '@/components/shell/MobileNav';
import { DCODE_BRAND } from '@/lib/dcode/brand';
import type { Locale } from '@/i18n/routing';

// Slim, D'code-branded sticky header: logo (→ home), primary nav with an animated
// active underline (desktop), a locale toggle, and a mobile menu sheet.
export default async function SiteHeader({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: 'Shell' });

  const navItems: NavItem[] = [
    { href: `/${locale}`, label: t('home') },
    { href: `/${locale}/tvs`, label: t('tvs') },
    { href: `/${locale}/air-conditioners`, label: t('airConditioners') },
  ];
  const localeLabels = { fa: t('localeFa'), en: t('localeEn') };

  return (
    <header className="sticky top-0 z-50 border-b border-(--dcode-border) bg-(--dcode-black)/80 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-10">
        <Link
          href={`/${locale}`}
          aria-label={DCODE_BRAND.name}
          className="rounded focus-visible:outline focus-visible:outline-offset-4 focus-visible:outline-(--dcode-red)"
        >
          <DcodeLogo className="h-7 w-auto sm:h-8" priority />
        </Link>

        <div className="flex items-center gap-2 sm:gap-4">
          <MainNav items={navItems} />
          <div className="hidden md:block">
            <LocaleToggle locale={locale} labels={localeLabels} />
          </div>
          <MobileNav
            items={navItems}
            locale={locale}
            localeLabels={localeLabels}
            openLabel={t('openMenu')}
            closeLabel={t('closeMenu')}
          />
        </div>
      </div>
    </header>
  );
}
