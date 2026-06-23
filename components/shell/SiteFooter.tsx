import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import DcodeLogo from '@/components/dcode/DcodeLogo';
import { DCODE_BRAND } from '@/lib/dcode/brand';
import type { Locale } from '@/i18n/routing';

// D'code-branded footer: brand mark + tagline, a products column, and a legal line.
export default async function SiteFooter({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: 'Shell' });
  const year = new Date().getFullYear();

  const productLinks = [
    { href: `/${locale}/tvs`, label: t('tvs') },
    { href: `/${locale}/air-conditioners`, label: t('airConditioners') },
  ];

  return (
    <footer className="border-t border-(--dcode-border) bg-(--dcode-black)">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-3 lg:px-10">
        <div className="space-y-4 lg:col-span-2">
          <Link href={`/${locale}`} aria-label={DCODE_BRAND.name} className="inline-block">
            <DcodeLogo className="h-8 w-auto" />
          </Link>
          <p className="max-w-sm text-sm leading-relaxed text-(--dcode-text-muted)">
            {t('footerTagline')}
          </p>
        </div>

        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.3em] text-(--dcode-text-faint)">
            {t('footerProducts')}
          </h2>
          <ul className="mt-4 space-y-2.5">
            {productLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm font-medium text-(--dcode-text-muted) transition-colors hover:text-(--dcode-red)"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-(--dcode-border)">
        <div className="mx-auto w-full max-w-6xl px-4 py-5 sm:px-6 lg:px-10">
          <p className="text-xs text-(--dcode-text-faint)">{t('footerRights', { year })}</p>
        </div>
      </div>
    </footer>
  );
}
