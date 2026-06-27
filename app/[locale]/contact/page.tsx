import type { Metadata } from 'next';
import { getLocale, setRequestLocale } from 'next-intl/server';
import JsonLd from '@/components/seo/JsonLd';
import RoutePage from '@/components/dcode/routes/RoutePage';
import ContactCard from '@/components/dcode/routes/ContactCard';
import type { Locale } from '@/i18n/routing';
import {
  createBreadcrumbItems,
  createBreadcrumbJsonLd,
  getLanguageAlternates,
  SITE_URL,
  toAbsoluteUrl,
} from '@/lib/seo/site';
import { DCODE_CONTACT } from '@/lib/dcode/contact';
import { DCODE_ROUTES } from '@/lib/dcode/routes';

export const revalidate = 3600;

type PageParams = { locale?: string };
type PageProps = { params: PageParams | Promise<PageParams> };
const resolveLocale = (value?: string): Locale => (value === 'fa' ? 'fa' : 'en');

const CONTENT: Record<
  Locale,
  {
    eyebrow: string;
    title: string;
    description: string;
    cardTitle: string;
    cardBody: string;
    call: string;
  }
> = {
  fa: {
    eyebrow: 'تماس با ما',
    title: 'با D’code در ارتباط باشید',
    description:
      'برای پرسش درباره‌ی محصولات، فروش، گارانتی یا خدمات پس از فروش، از راه‌های رسمی زیر با تیم D’code تماس بگیرید.',
    cardTitle: 'راه‌های ارتباطی',
    cardBody:
      'تیم پشتیبانی D’code در ساعات کاری پاسخگوی شماست. می‌توانید تماس بگیرید یا ایمیل بفرستید.',
    call: 'تماس با پشتیبانی',
  },
  en: {
    eyebrow: 'Contact us',
    title: 'Get in touch with D’code',
    description:
      'For questions about products, sales, warranty, or after-sales service, reach the D’code team through the official channels below.',
    cardTitle: 'Ways to reach us',
    cardBody:
      'The D’code support team is available during working hours. Call us or send an email.',
    call: 'Call support',
  },
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolved = await params;
  const locale = resolveLocale(resolved?.locale ?? (await getLocale()));
  setRequestLocale(locale);
  const c = CONTENT[locale];
  const path = `/${locale}${DCODE_ROUTES.contact}`;
  return {
    title: c.title,
    description: c.description,
    openGraph: { title: c.title, description: c.description, url: path, type: 'website' },
    twitter: { card: 'summary', title: c.title, description: c.description },
    alternates: { canonical: path, languages: getLanguageAlternates(DCODE_ROUTES.contact) },
    metadataBase: new URL(SITE_URL),
  };
}

export default async function ContactPage({ params }: PageProps) {
  const resolved = await params;
  const locale = resolveLocale(resolved?.locale ?? (await getLocale()));
  setRequestLocale(locale);
  const c = CONTENT[locale];

  const breadcrumbItems = createBreadcrumbItems(locale, {
    label: c.title,
    href: `/${locale}${DCODE_ROUTES.contact}`,
  });

  const contactSchema = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: c.title,
    description: c.description,
    url: toAbsoluteUrl(`/${locale}${DCODE_ROUTES.contact}`),
    mainEntity: {
      '@type': 'Organization',
      name: DCODE_CONTACT.company[locale],
      telephone: DCODE_CONTACT.phone.tel,
      email: DCODE_CONTACT.email,
      address: DCODE_CONTACT.address[locale],
    },
  };

  return (
    <RoutePage
      locale={locale}
      eyebrow={c.eyebrow}
      title={c.title}
      description={c.description}
      breadcrumbItems={breadcrumbItems}
    >
      <JsonLd data={[createBreadcrumbJsonLd(breadcrumbItems), contactSchema]} />

      <ContactCard
        locale={locale}
        title={c.cardTitle}
        description={c.cardBody}
        callLabel={c.call}
      />
    </RoutePage>
  );
}
