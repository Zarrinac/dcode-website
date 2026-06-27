import Image from 'next/image';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import {
  HiOutlineClock,
  HiOutlineEnvelope,
  HiOutlineMapPin,
  HiOutlinePhone,
} from 'react-icons/hi2';
import { COMPANY_LOGO, DCODE_CONTACT } from '@/lib/dcode/contact';
import { INFO_LINKS, PRIMARY_NAV, SUPPORT_LINKS } from '@/lib/dcode/nav';
import { localeHref } from '@/lib/dcode/routes';
import type { Locale } from '@/i18n/routing';

// D'code-branded footer mirroring the company's hisense-ir.com layout: a brand +
// contact column (company details reused from صنایع زرین نمای کاسپین) alongside
// Products / Support / Information link columns, then a legal + sitemap bar.
const HEADINGS: Record<string, Record<Locale, string>> = {
  products: { fa: 'محصولات', en: 'Products' },
  support: { fa: 'پشتیبانی', en: 'Support' },
  info: { fa: 'اطلاعات', en: 'Information' },
};

export default async function SiteFooter({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: 'Shell' });
  const year = new Date().getFullYear();
  const c = DCODE_CONTACT;

  const columns = [
    { title: HEADINGS.products[locale], links: PRIMARY_NAV },
    { title: HEADINGS.support[locale], links: SUPPORT_LINKS },
    { title: HEADINGS.info[locale], links: INFO_LINKS },
  ];

  const contactItems = [
    { icon: HiOutlineMapPin, value: c.address[locale] },
    {
      icon: HiOutlinePhone,
      value: c.phone.display[locale],
      href: `tel:${c.phone.tel}`,
      dir: 'ltr' as const,
    },
    { icon: HiOutlineEnvelope, value: c.email, href: `mailto:${c.email}`, dir: 'ltr' as const },
    { icon: HiOutlineClock, value: c.hours[locale] },
  ];

  return (
    <footer
      dir={locale === 'fa' ? 'rtl' : 'ltr'}
      className="border-t border-(--dcode-border) bg-(--dcode-black) text-(--dcode-text)"
    >
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:px-10">
        <div className="space-y-4">
          <Link
            href={localeHref(locale, '')}
            aria-label={DCODE_CONTACT.company[locale]}
            className="inline-block"
          >
            <Image
              src={COMPANY_LOGO.src}
              alt={DCODE_CONTACT.company[locale]}
              width={COMPANY_LOGO.width}
              height={COMPANY_LOGO.height}
              className="h-12 w-auto"
            />
          </Link>
          <p className="max-w-sm text-sm leading-relaxed text-(--dcode-text-muted)">
            {t('footerTagline')}
          </p>
          <ul className="space-y-2.5 pt-1">
            {contactItems.map((item) => {
              const Icon = item.icon;
              const body = (
                <span className="flex items-start gap-2.5">
                  <Icon aria-hidden className="mt-0.5 size-4 shrink-0 text-(--dcode-red)" />
                  <span
                    className="text-sm leading-relaxed text-(--dcode-text-muted)"
                    dir={item.dir}
                  >
                    {item.value}
                  </span>
                </span>
              );
              return (
                <li key={item.value}>
                  {item.href ? (
                    <a
                      href={item.href}
                      className="block transition-colors hover:text-(--dcode-red)"
                    >
                      {body}
                    </a>
                  ) : (
                    body
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        {columns.map((column) => (
          <div key={column.title}>
            <h2 className="text-xs font-semibold uppercase tracking-[0.3em] text-(--dcode-text-faint)">
              {column.title}
            </h2>
            <ul className="mt-4 space-y-2.5">
              {column.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={localeHref(locale, link.href)}
                    className="text-sm font-medium text-(--dcode-text-muted) transition-colors hover:text-(--dcode-red)"
                  >
                    {link.label[locale]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-(--dcode-border)">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-10">
          <p className="text-xs text-(--dcode-text-faint)">{t('footerRights', { year })}</p>
          <Link
            href="/sitemap.xml"
            className="text-xs font-medium text-(--dcode-text-muted) transition-colors hover:text-(--dcode-red)"
          >
            {t('footerSitemap')}
          </Link>
        </div>
      </div>
    </footer>
  );
}
