import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import DcodeLogo from '@/components/dcode/DcodeLogo';
import LocaleToggle from '@/components/shell/LocaleToggle';
import MainNav, { type NavItem, type SupportItem } from '@/components/shell/MainNav';
import MobileNav from '@/components/shell/MobileNav';
import { DCODE_BRAND } from '@/lib/dcode/brand';
import { ABOUT_LINK, PRIMARY_NAV, SUPPORT_LABEL, SUPPORT_LINKS } from '@/lib/dcode/nav';
import { localeHref } from '@/lib/dcode/routes';
import type { Locale } from '@/i18n/routing';

// Slim, D'code-branded sticky header. Logo (→ home) sits opposite a two-group nav:
// product families on one side, About + a Support mega-menu on the other. Only the
// locale toggle accompanies it (no theme/search). Direction follows the locale.
export default async function SiteHeader({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: 'Shell' });

  const primaryItems: NavItem[] = PRIMARY_NAV.map((item) => ({
    href: localeHref(locale, item.href),
    label: item.label[locale],
  }));
  const aboutItem: NavItem = {
    href: localeHref(locale, ABOUT_LINK.href),
    label: ABOUT_LINK.label[locale],
  };
  const supportItems: SupportItem[] = SUPPORT_LINKS.map((item) => ({
    href: localeHref(locale, item.href),
    label: item.label[locale],
    description: item.description?.[locale] ?? '',
  }));
  const localeLabels = { fa: t('localeFa'), en: t('localeEn') };

  return (
    <header
      dir={locale === 'fa' ? 'rtl' : 'ltr'}
      className="sticky top-0 z-50 border-b border-(--dcode-border) bg-(--dcode-black)/80 backdrop-blur-xl"
    >
      <div className="mx-auto flex w-full max-w-6xl items-center gap-4 px-4 py-3 sm:px-6 lg:px-10">
        <Link
          href={localeHref(locale, '')}
          aria-label={DCODE_BRAND.name}
          className="shrink-0 rounded focus-visible:outline focus-visible:outline-offset-4 focus-visible:outline-(--dcode-red)"
        >
          <DcodeLogo className="h-7 w-auto sm:h-8" priority />
        </Link>

        <MainNav
          primaryItems={primaryItems}
          aboutItem={aboutItem}
          supportLabel={SUPPORT_LABEL[locale]}
          supportItems={supportItems}
        />

        <div className="ms-auto flex items-center gap-2 sm:gap-4 md:ms-0">
          <div className="hidden md:block">
            <LocaleToggle locale={locale} labels={localeLabels} />
          </div>
          <MobileNav
            primaryItems={primaryItems}
            aboutItem={aboutItem}
            supportLabel={SUPPORT_LABEL[locale]}
            supportItems={supportItems}
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
