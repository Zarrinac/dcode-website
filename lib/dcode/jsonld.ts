import { DCODE_BRAND } from '@/lib/dcode/brand';
import { DCODE_CATEGORIES, productHref } from '@/lib/dcode/categories';
import { SITE_URL, getLocaleLanguage, toAbsoluteUrl } from '@/lib/seo/site';
import type { DcodeCategory, DcodeProduct } from '@/types/dcode';
import type { Locale } from '@/i18n/routing';

// Centralised JSON-LD builders for the D'code product sections, so the TV and AC
// pages emit identical, correct structured data.
//
// NOTE: this site publishes no prices, so a product detail page is a `WebPage` whose
// `about` is a generic `Thing` — NOT a schema.org `Product`. A price-less `Product`
// triggers Google's "Either offers, review, or aggregateRating should be specified"
// warning, and faking an Offer/rating violates Google policy.

const imageToUrl = (image: DcodeProduct['heroImage']): string =>
  typeof image === 'string' ? image : image.src;

export function buildCollectionJsonLd(
  locale: Locale,
  category: DcodeCategory,
  products: DcodeProduct[],
  copy: { title: string; description: string },
) {
  const url = `${SITE_URL}/${locale}/${DCODE_CATEGORIES[category].slug}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: copy.title,
    description: copy.description,
    url,
    inLanguage: getLocaleLanguage(locale),
    isPartOf: { '@id': `${SITE_URL}#website` },
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: products.map((product, index) => {
        const itemUrl = `${SITE_URL}${productHref(locale, category, product.id)}`;
        return {
          '@type': 'ListItem',
          position: index + 1,
          url: itemUrl,
          item: {
            '@type': 'Thing',
            name: product.copy[locale].name,
            image: toAbsoluteUrl(imageToUrl(product.heroImage)),
            url: itemUrl,
          },
        };
      }),
    },
  };
}

export function buildProductPageJsonLd(
  locale: Locale,
  category: DcodeCategory,
  product: DcodeProduct,
) {
  const copy = product.copy[locale];
  const url = `${SITE_URL}${productHref(locale, category, product.id)}`;
  const categoryLabel = DCODE_CATEGORIES[category].label.en;

  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: copy.name,
    description: copy.description || copy.tagline,
    url,
    inLanguage: getLocaleLanguage(locale),
    isPartOf: { '@id': `${SITE_URL}#website` },
    primaryImageOfPage: {
      '@type': 'ImageObject',
      url: toAbsoluteUrl(imageToUrl(product.heroImage)),
    },
    about: {
      '@type': 'Thing',
      name: copy.name,
      description: copy.description || copy.tagline,
      url,
      image: toAbsoluteUrl(imageToUrl(product.heroImage)),
      additionalProperty: [
        { '@type': 'PropertyValue', name: 'Brand', value: DCODE_BRAND.name },
        { '@type': 'PropertyValue', name: 'Category', value: categoryLabel },
        // Localized spec sheet → additionalProperty rows (English labels for schema).
        ...product.attributes.map((attr) => ({
          '@type': 'PropertyValue' as const,
          name: attr.label.en,
          value: attr.value.en,
        })),
        // Each SKU as a model property.
        ...product.variants.map((variant) => ({
          '@type': 'PropertyValue' as const,
          name: `Model ${variant.size}`,
          value: variant.sku,
        })),
      ],
    },
  };
}
