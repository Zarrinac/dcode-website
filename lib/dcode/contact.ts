import type { Locale } from '@/i18n/routing';
import { dcodeLogoAsset } from '@/lib/dcode/brand';

// The parent company's public site. D'code reuses its official service forms
// (complaint, survey, representation request, dealer portal) rather than
// duplicating the back-end on this standalone marketing site.
export const PARENT_SITE_URL = 'https://hisense-ir.com';

// Company logo (صنایع زرین نمای کاسپین, white wordmark) used in the D'code footer —
// the footer represents the operating company, so it carries the company mark.
export const COMPANY_LOGO = {
  src: dcodeLogoAsset('zarrin-logo-white.png'),
  width: 323,
  height: 119,
} as const;

// Shared contact + company details for the D'code brand. D'code is a brand of
// صنایع زرین نمای کاسپین (the official Hisense representative in Iran), so the
// after-sales network, address, and customer-service line are the company's
// existing ones — reused here verbatim. Centralised so the footer and every
// support page reference a single source of truth.

type Localized = Record<Locale, string>;

type DcodeContact = {
  company: Localized;
  brandLine: Localized;
  address: Localized;
  phone: { display: Localized; tel: string };
  email: string;
  hours: Localized;
  holidays: Localized;
};

export const DCODE_CONTACT: DcodeContact = {
  company: {
    fa: 'صنایع زرین نمای کاسپین',
    en: 'Zarrin Nama Caspian Industries',
  },
  // D'code is one of the company's brands; this line frames the relationship.
  brandLine: {
    fa: "D'code، برندی از صنایع زرین نمای کاسپین",
    en: "D'code, a brand of Zarrin Nama Caspian Industries",
  },
  address: {
    fa: 'تهران، میدان کتابی (احمدی روشن)، خیابان ساسانی‌پور، بن‌بست کاملیا، پلاک ۶',
    en: 'No. 6, Camellia Dead-end, Sasanipour St., Ketabi (Ahmadi Roshan) Sq., Tehran, Iran',
  },
  phone: {
    display: {
      fa: '۰۲۱-۷۲۱۳۳',
      en: '+98 21 72133',
    },
    tel: '+982172133',
  },
  email: 'info@zarrinac.com',
  hours: {
    fa: 'شنبه تا چهارشنبه: ۸:۳۰ تا ۱۶ | پنجشنبه: ۸:۳۰ تا ۱۳',
    en: 'Sat–Wed: 8:30–16:00 | Thu: 8:30–13:00',
  },
  holidays: {
    fa: 'تعطیلات رسمی تعطیل است',
    en: 'Closed on public holidays',
  },
};
