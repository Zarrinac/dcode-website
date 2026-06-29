import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import SiteHeader from '@/components/shell/SiteHeader';
import SiteFooter from '@/components/shell/SiteFooter';
import StructuredData from '@/components/seo/StructuredData';
import { DCODE_BRAND } from '@/lib/dcode/brand';
import { SITE_URL } from '@/lib/seo/site';
import { getSeoKeywords } from '@/lib/seo/keywords';
import { routing, type Locale } from '@/i18n/routing';

// Locale layout validates the locale, wires translations, and applies the shared
// D'code-branded page chrome (header + footer).

type LocaleLayoutParams = { locale: string };
type LocaleLayoutProps = {
  children: ReactNode;
  params: Promise<LocaleLayoutParams>;
};

function ensureLocale(locale: string): Locale {
  const match = routing.locales.find((value): value is Locale => value === locale);
  if (!match) {
    notFound();
  }
  return match;
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata(
  props: Omit<LocaleLayoutProps, 'children'>,
): Promise<Metadata> {
  const { locale } = await props.params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Keywords cascade from the locale layout to every page (pages don't set their
  // own `keywords`), so the <meta name="keywords"> is emitted site-wide.
  const seoLocale = locale === 'fa' ? 'fa' : 'en';
  const keywords = getSeoKeywords(seoLocale);

  const googleVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;
  const bingVerification = process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION;
  const verificationOther = {
    ...(bingVerification ? { 'msvalidate.01': bingVerification } : {}),
  };

  return {
    metadataBase: new URL(SITE_URL),
    title:
      seoLocale === 'fa'
        ? "D'code — تلویزیون و کولر گازی هوشمند"
        : "D'code — Smart TVs & Air Conditioners",
    keywords,
    applicationName: DCODE_BRAND.name,
    manifest: '/site.webmanifest',
    icons: {
      icon: [
        { url: '/favicon.ico', sizes: 'any' },
        { url: '/favicon.svg', type: 'image/svg+xml' },
        { url: '/favicon-96x96.png', type: 'image/png', sizes: '96x96' },
      ],
      apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1,
      },
    },
    verification:
      googleVerification || Object.keys(verificationOther).length > 0
        ? { google: googleVerification, other: verificationOther }
        : undefined,
  };
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const typedLocale = ensureLocale(locale);
  setRequestLocale(typedLocale);

  const messages = await getMessages();
  const pageContainerClass = 'mx-auto w-full max-w-[120rem] px-4 sm:px-6 lg:px-10';

  return (
    <NextIntlClientProvider locale={typedLocale} messages={messages}>
      <StructuredData locale={typedLocale} />
      <SiteHeader locale={typedLocale} />
      <div className={pageContainerClass}>
        <main>{children}</main>
      </div>
      <SiteFooter locale={typedLocale} />
    </NextIntlClientProvider>
  );
}
