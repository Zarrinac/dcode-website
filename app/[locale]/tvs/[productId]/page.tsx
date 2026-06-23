import type { Metadata } from 'next';
import { getLocale, getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import JsonLd from '@/components/seo/JsonLd';
import ProductDetailView from '@/components/dcode/ProductDetailView';
import { getDcodeProductById } from '@/lib/dcode/source';
import { buildProductPageJsonLd } from '@/lib/dcode/jsonld';
import { categoryHref, productHref } from '@/lib/dcode/categories';
import type { ImageSource } from '@/types/tv';
import type { Locale } from '@/i18n/routing';
import {
  createBreadcrumbItems,
  createBreadcrumbJsonLd,
  getLanguageAlternates,
  SITE_URL,
} from '@/lib/seo/site';

export const revalidate = 3600;

const CATEGORY = 'tv' as const;

type PageParams = { locale?: string; productId?: string };
type PageProps = { params: PageParams | Promise<PageParams> };

const resolveLocale = (value?: string): Locale => (value === 'fa' ? 'fa' : 'en');
const imageToUrl = (image: ImageSource): string => (typeof image === 'string' ? image : image.src);

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolved = await params;
  const locale = resolveLocale(resolved?.locale ?? (await getLocale()));
  setRequestLocale(locale);
  const productId = (resolved?.productId ?? '').toLowerCase();
  const product = await getDcodeProductById(productId);
  if (product?.category !== CATEGORY) return {};

  const copy = product.copy[locale];
  const languageAlternates = getLanguageAlternates(`/tvs/${productId}`);
  return {
    title: copy.name,
    description: copy.description || copy.tagline,
    openGraph: {
      title: copy.name,
      description: copy.description || copy.tagline,
      url: `/${locale}/tvs/${productId}`,
      type: 'website',
      images: [{ url: imageToUrl(product.heroImage) }],
    },
    twitter: {
      card: 'summary_large_image',
      title: copy.name,
      description: copy.description || copy.tagline,
      images: [imageToUrl(product.heroImage)],
    },
    alternates: { canonical: `/${locale}/tvs/${productId}`, languages: languageAlternates },
    metadataBase: new URL(SITE_URL),
  };
}

export default async function DcodeTvDetailPage({ params }: PageProps) {
  const resolved = await params;
  const locale = resolveLocale(resolved?.locale ?? (await getLocale()));
  setRequestLocale(locale);
  const productId = (resolved?.productId ?? '').toLowerCase();

  const product = await getDcodeProductById(productId);
  if (product?.category !== CATEGORY) {
    notFound();
  }

  const t = await getTranslations({ locale, namespace: 'DcodePage' });
  const copy = product.copy[locale];

  const breadcrumbItems = createBreadcrumbItems(
    locale,
    { label: copy.name, href: productHref(locale, CATEGORY, productId) },
    [{ label: t('tvs.title'), href: categoryHref(locale, CATEGORY) }],
  );

  const labels = {
    selectSize: t('detail.selectSize'),
    model: t('detail.model'),
    specifications: t('detail.specifications'),
    highlights: t('detail.highlights'),
    keyFeatures: t('detail.keyFeatures'),
    gallery: t('detail.gallery'),
    dimensionsWithStand: t('detail.dimensionsWithStand'),
    dimensionsWithoutStand: t('detail.dimensionsWithoutStand'),
    netWeight: t('detail.netWeight'),
    watchVideo: t('detail.watchVideo'),
    close: t('detail.close'),
  };

  return (
    <div className="pb-16">
      <JsonLd
        data={[
          createBreadcrumbJsonLd(breadcrumbItems),
          buildProductPageJsonLd(locale, CATEGORY, product),
        ]}
      />
      <ProductDetailView
        locale={locale}
        product={product}
        breadcrumbItems={breadcrumbItems}
        labels={labels}
      />
    </div>
  );
}
