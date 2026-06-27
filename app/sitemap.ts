import type { MetadataRoute } from 'next';
import { getDcodeProducts } from '@/lib/dcode/source';
import { DCODE_CATEGORY_ORDER, categoryPath, categorySlug } from '@/lib/dcode/categories';
import { DCODE_CONTENT_ROUTES } from '@/lib/dcode/routes';
import { routing } from '@/i18n/routing';
import { SITE_CONTENT_LAST_MODIFIED, SITE_URL, getLocalizedPath } from '@/lib/seo/site';

// Native sitemap: home + each product family list + every product detail + the
// support/info pages, per locale, with hreflang language alternates so Google sees
// the fa/en pairing.

const buildAlternates = (path: string) => {
  const languages = routing.locales.reduce<Record<string, string>>((acc, locale) => {
    acc[locale] = `${SITE_URL}${getLocalizedPath(locale, path)}`;
    return acc;
  }, {});
  return { languages };
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getDcodeProducts();

  // '/', then each family list, then each product detail under its family slug,
  // then the support/info pages.
  const productPaths = [
    '/',
    ...DCODE_CATEGORY_ORDER.map((category) => categoryPath(category)),
    ...products.map((product) => `/${categorySlug(product.category)}/${product.id}`),
  ];
  const paths = [...productPaths, ...DCODE_CONTENT_ROUTES];

  const entries: MetadataRoute.Sitemap = [];
  for (const path of paths) {
    const isProduct = productPaths.includes(path);
    for (const locale of routing.locales) {
      entries.push({
        url: `${SITE_URL}${getLocalizedPath(locale, path)}`,
        lastModified: SITE_CONTENT_LAST_MODIFIED,
        changeFrequency: 'weekly',
        priority: path === '/' ? 1 : isProduct ? 0.8 : 0.5,
        alternates: buildAlternates(path),
      });
    }
  }

  return entries;
}
