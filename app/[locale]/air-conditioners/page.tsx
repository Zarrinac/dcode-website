import type { Metadata } from 'next';
import { getLocale, getTranslations, setRequestLocale } from 'next-intl/server';
import JsonLd from '@/components/seo/JsonLd';
import ProductListView from '@/components/dcode/ProductListView';
import { getDcodeProductsByCategory } from '@/lib/dcode/source';
import { buildCollectionJsonLd } from '@/lib/dcode/jsonld';
import type { Locale } from '@/i18n/routing';
import {
  createBreadcrumbItems,
  createBreadcrumbJsonLd,
  getLanguageAlternates,
  SITE_URL,
} from '@/lib/seo/site';

export const revalidate = 3600;

type PageParams = { locale?: string };
type PageProps = { params: PageParams | Promise<PageParams> };

const resolveLocale = (value?: string): Locale => (value === 'fa' ? 'fa' : 'en');

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolved = await params;
  const locale = resolveLocale(resolved?.locale ?? (await getLocale()));
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'DcodePage' });
  const languageAlternates = getLanguageAlternates('/air-conditioners');
  return {
    title: t('ac.metaTitle'),
    description: t('ac.metaDescription'),
    openGraph: {
      title: t('ac.metaTitle'),
      description: t('ac.metaDescription'),
      url: `/${locale}/air-conditioners`,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: t('ac.metaTitle'),
      description: t('ac.metaDescription'),
    },
    alternates: { canonical: `/${locale}/air-conditioners`, languages: languageAlternates },
    metadataBase: new URL(SITE_URL),
  };
}

export default async function DcodeAirConditionersPage({ params }: PageProps) {
  const resolved = await params;
  const locale = resolveLocale(resolved?.locale ?? (await getLocale()));
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'DcodePage' });

  const products = await getDcodeProductsByCategory('ac');

  const breadcrumbItems = createBreadcrumbItems(locale, {
    label: t('ac.title'),
    href: `/${locale}/air-conditioners`,
  });

  const collectionSchema = buildCollectionJsonLd(locale, 'ac', products, {
    title: t('ac.title'),
    description: t('ac.metaDescription'),
  });

  return (
    <div className="pb-16">
      <JsonLd data={[createBreadcrumbJsonLd(breadcrumbItems), collectionSchema]} />
      <ProductListView
        locale={locale}
        category="ac"
        products={products}
        breadcrumbItems={breadcrumbItems}
        labels={{
          eyebrow: t('ac.eyebrow'),
          title: t('ac.title'),
          tagline: t('ac.tagline'),
          viewProduct: t('ac.viewProduct'),
        }}
      />
    </div>
  );
}
