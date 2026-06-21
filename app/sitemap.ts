import type { MetadataRoute } from 'next';
import { getDcodeProducts } from '@/lib/dcode/source';
import { routing } from '@/i18n/routing';
import { SITE_CONTENT_LAST_MODIFIED, SITE_URL, getLocalizedPath } from '@/lib/seo/site';

// Native sitemap: home + /tvs + each product detail, per locale, with hreflang
// language alternates so Google sees the fa/en pairing.

const buildAlternates = (path: string) => {
  const languages = routing.locales.reduce<Record<string, string>>((acc, locale) => {
    acc[locale] = `${SITE_URL}${getLocalizedPath(locale, path)}`;
    return acc;
  }, {});
  return { languages };
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getDcodeProducts();

  const paths = ['/', '/tvs', ...products.map((product) => `/tvs/${product.id}`)];

  const entries: MetadataRoute.Sitemap = [];
  for (const path of paths) {
    for (const locale of routing.locales) {
      entries.push({
        url: `${SITE_URL}${getLocalizedPath(locale, path)}`,
        lastModified: SITE_CONTENT_LAST_MODIFIED,
        changeFrequency: 'weekly',
        priority: path === '/' ? 1 : 0.8,
        alternates: buildAlternates(path),
      });
    }
  }

  return entries;
}
