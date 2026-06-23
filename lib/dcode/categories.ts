import type { DcodeCategory, DcodeLocale, LocalizedText } from '@/types/dcode';

// Single source of truth mapping a product family to its URL section and labels.
// Used by the list/detail pages, the landing family cards, the sitemap, and breadcrumbs.
type CategoryMeta = {
  slug: string; // URL segment, same in both locales for clean canonical/hreflang pairing
  label: LocalizedText; // section title (e.g. "TVs" / "تلویزیون‌ها")
};

export const DCODE_CATEGORIES: Record<DcodeCategory, CategoryMeta> = {
  tv: {
    slug: 'tvs',
    label: { en: 'TVs', fa: 'تلویزیون‌ها' },
  },
  ac: {
    slug: 'air-conditioners',
    label: { en: 'Air Conditioners', fa: 'کولرهای گازی' },
  },
};

// Ordered list for iterating families (landing, sitemap).
export const DCODE_CATEGORY_ORDER: DcodeCategory[] = ['tv', 'ac'];

export const categorySlug = (category: DcodeCategory) => DCODE_CATEGORIES[category].slug;

export const categoryPath = (category: DcodeCategory) => `/${DCODE_CATEGORIES[category].slug}`;

export const categoryHref = (locale: DcodeLocale, category: DcodeCategory) =>
  `/${locale}/${DCODE_CATEGORIES[category].slug}`;

export const productHref = (locale: DcodeLocale, category: DcodeCategory, id: string) =>
  `/${locale}/${DCODE_CATEGORIES[category].slug}/${id}`;

// Resolve a URL slug back to a category (used by the [productId] detail routes if needed).
export const categoryFromSlug = (slug: string): DcodeCategory | undefined =>
  (Object.keys(DCODE_CATEGORIES) as DcodeCategory[]).find(
    (key) => DCODE_CATEGORIES[key].slug === slug,
  );
