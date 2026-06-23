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
  const languageAlternates = getLanguageAlternates('/tvs');
  return {
    title: t('tvs.metaTitle'),
    description: t('tvs.metaDescription'),
    openGraph: {
      title: t('tvs.metaTitle'),
      description: t('tvs.metaDescription'),
      url: `/${locale}/tvs`,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: t('tvs.metaTitle'),
      description: t('tvs.metaDescription'),
    },
    alternates: { canonical: `/${locale}/tvs`, languages: languageAlternates },
    metadataBase: new URL(SITE_URL),
  };
}

export default async function DcodeTvsPage({ params }: PageProps) {
  const resolved = await params;
  const locale = resolveLocale(resolved?.locale ?? (await getLocale()));
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'DcodePage' });

  const products = await getDcodeProductsByCategory('tv');

  const breadcrumbItems = createBreadcrumbItems(locale, {
    label: t('tvs.title'),
    href: `/${locale}/tvs`,
  });

  const collectionSchema = buildCollectionJsonLd(locale, 'tv', products, {
    title: t('tvs.title'),
    description: t('tvs.metaDescription'),
  });

  return (
    <div className="pb-16">
      <JsonLd data={[createBreadcrumbJsonLd(breadcrumbItems), collectionSchema]} />
      <ProductListView
        locale={locale}
        category="tv"
        products={products}
        breadcrumbItems={breadcrumbItems}
        labels={{
          eyebrow: t('tvs.eyebrow'),
          title: t('tvs.title'),
          tagline: t('tvs.tagline'),
          viewProduct: t('tvs.viewProduct'),
        }}
      />
    </div>
  );
}
