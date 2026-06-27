import type { Locale } from '@/i18n/routing';

// Central registry of D'code route slugs. The product families (tvs, air-conditioners)
// and the support/info pages all resolve through here so the header, footer, sitemap,
// and pages stay in lockstep — change a slug once and every link follows.
export const DCODE_ROUTES = {
  home: '',
  tvs: '/tvs',
  airConditioners: '/air-conditioners',
  about: '/about',
  contact: '/contact',
  faq: '/faq',
  warranty: '/warranty',
  service: '/service',
  serviceCenters: '/service-centers',
  complaint: '/complaint',
  survey: '/survey',
  becomeDealer: '/become-a-dealer',
  dealerPortal: '/dealer-portal',
} as const;

export type DcodeRoute = (typeof DCODE_ROUTES)[keyof typeof DCODE_ROUTES];

// Prefix a route with the active locale segment (`/fa/faq`). The bare home route
// collapses to `/${locale}`.
export const localeHref = (locale: Locale, route: string) =>
  route === '' ? `/${locale}` : `/${locale}${route}`;

// Every content route that should appear in the sitemap (excludes home, which the
// sitemap adds explicitly, and the product family lists handled separately).
// Note: complaint, survey, become-a-dealer, and dealer-portal are intentionally
// absent — they 307-redirect to the company's pages on hisense-ir.com (see
// next.config.ts) and have no page here.
export const DCODE_CONTENT_ROUTES: string[] = [
  DCODE_ROUTES.about,
  DCODE_ROUTES.contact,
  DCODE_ROUTES.faq,
  DCODE_ROUTES.warranty,
  DCODE_ROUTES.service,
  DCODE_ROUTES.serviceCenters,
];
