import JsonLd from '@/components/seo/JsonLd';
import { DCODE_BRAND } from '@/lib/dcode/brand';
import { SITE_URL, getLocaleLanguage, toAbsoluteUrl } from '@/lib/seo/site';
import type { Locale } from '@/i18n/routing';

// Global Organization + WebSite JSON-LD, emitted once in the locale layout. These
// give search engines the brand entity + site identity for richer SERP treatment.
export default function StructuredData({ locale }: { locale: Locale }) {
  const description =
    locale === 'fa'
      ? "D'code (دیکد) — برند تلویزیون و کولر گازی از صنایع زرین نمای کاسپین، نماینده رسمی Hisense در ایران."
      : "D'code — a TV and air-conditioner brand by Zarrin Nama Caspian Industries, the official Hisense representative in Iran.";

  const organization = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_URL}#organization`,
    name: DCODE_BRAND.name,
    alternateName: ['Dcode', 'دیکد'],
    url: SITE_URL,
    logo: toAbsoluteUrl(DCODE_BRAND.logo),
    description,
    areaServed: 'IR',
    parentOrganization: {
      '@type': 'Organization',
      name: 'Zarrin Nama Caspian Industries',
      alternateName: 'صنایع زرین نمای کاسپین',
    },
  };

  const website = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}#website`,
    name: DCODE_BRAND.name,
    url: SITE_URL,
    inLanguage: getLocaleLanguage(locale),
    publisher: { '@id': `${SITE_URL}#organization` },
  };

  return <JsonLd data={[organization, website]} />;
}
