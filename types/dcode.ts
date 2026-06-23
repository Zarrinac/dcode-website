import { type ImageSource } from '@/types/tv';

// Content shape for the D'code brand. The brand ships two product families today —
// LED TVs (R6D) and split air conditioners (DTEC30) — so the model is family-agnostic:
// shared fields + a localized `attributes` spec sheet that works for any category.

export type DcodeLocale = 'en' | 'fa';

// A value rendered in both languages.
export type LocalizedText = Record<DcodeLocale, string>;

// Product family. Drives the section route (see lib/dcode/categories.ts):
//   tv → /tvs, ac → /air-conditioners.
export type DcodeCategory = 'tv' | 'ac';

// A purchasable configuration (a TV size, or an AC capacity). Each is its own SKU.
// Dimension/weight fields are optional because not every family expresses them at the
// variant level (the AC keeps its indoor/outdoor dimensions in `attributes` instead).
export type DcodeVariant = {
  sku: string;
  size: string; // display label, e.g. '55"' or '30,000 BTU'
  image: ImageSource;
  diagonalInch?: number; // TV only
  capacityBtu?: number; // AC only
  // TV display configurations (optional; AC keeps unit dimensions in `attributes`).
  dimensionsWithoutStand?: string; // e.g. '1230 × 77 × 719 mm'
  dimensionsWithStand?: string; // e.g. '1230 × 257 × 795 mm'
  netWeight?: string;
};

// One localized row of the spec sheet (replaces the old TV-specific scalar columns).
export type DcodeAttribute = {
  label: LocalizedText;
  value: LocalizedText;
};

export type DcodeProductCopy = {
  name: string;
  tagline: string;
  description: string;
  highlights: string[];
};

export type DcodeFeatureCard = {
  title: LocalizedText;
  description: LocalizedText;
  // Optional icon (white/light asset, since D'code pages render on a dark theme).
  icon?: ImageSource;
};

export type DcodeProduct = {
  id: string; // 'r6d' | 'dtec30'
  brand: 'dcode';
  category: DcodeCategory;
  series: string; // 'R6D' | 'DTEC30'
  warrantyMonths?: number;
  heroImage: ImageSource;
  heroVideo?: string;
  remoteImage?: ImageSource;
  gallery?: ImageSource[];
  variants: DcodeVariant[];
  featureCards?: DcodeFeatureCard[];
  // Generic, localized spec sheet (powers the detail table + JSON-LD additionalProperty).
  attributes: DcodeAttribute[];
  // Flat localized highlight bullets shown as a checklist.
  specs: Record<DcodeLocale, string[]>;
  remotes?: Record<DcodeLocale, string[]>;
  extras?: string[];
  copy: Record<DcodeLocale, DcodeProductCopy>;
};
