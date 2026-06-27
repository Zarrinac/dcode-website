import type { Locale } from '@/i18n/routing';
import { DCODE_ROUTES } from './routes';

// Navigation model shared by the header and footer. Link copy is co-located here as
// localized objects (the same pattern the parent Hisense site uses for its nav data)
// so the two languages stay in sync by construction and the chrome stays generic.

type Localized = Record<Locale, string>;

export type NavLink = {
  href: string; // locale-less route (prefixed at render time)
  label: Localized;
  description?: Localized; // shown in the desktop support mega-menu
};

// Primary product families — direct links, no submenu.
export const PRIMARY_NAV: NavLink[] = [
  { href: DCODE_ROUTES.tvs, label: { fa: 'تلویزیون‌ها', en: 'TVs' } },
  { href: DCODE_ROUTES.airConditioners, label: { fa: 'کولرهای گازی', en: 'Air Conditioners' } },
];

// "About us" — a plain link in the secondary nav group.
export const ABOUT_LINK: NavLink = {
  href: DCODE_ROUTES.about,
  label: { fa: 'درباره ما', en: 'About us' },
};

export const SUPPORT_LABEL: Localized = { fa: 'پشتیبانی', en: 'Support' };

// Support submenu — also reused as the footer "Support" column.
export const SUPPORT_LINKS: NavLink[] = [
  {
    href: DCODE_ROUTES.faq,
    label: { fa: 'سوالات متداول', en: 'FAQ' },
    description: {
      fa: 'پاسخ سریع به سوالات نصب، گارانتی و خدمات.',
      en: 'Fast answers on installation, warranty, and service.',
    },
  },
  {
    href: DCODE_ROUTES.warranty,
    label: { fa: 'شرایط گارانتی', en: 'Warranty' },
    description: {
      fa: 'پوشش ۲۴ ماهه و شرایط خدمات پس از فروش.',
      en: '24-month coverage and after-sales terms.',
    },
  },
  {
    href: DCODE_ROUTES.service,
    label: { fa: 'خدمات تعمیر و پشتیبانی', en: 'Repair & support' },
    description: {
      fa: 'ثبت درخواست سرویس و تعمیر رسمی.',
      en: 'Book official service and repair.',
    },
  },
  {
    href: DCODE_ROUTES.serviceCenters,
    label: { fa: 'لیست نمایندگان خدمات', en: 'Service centers' },
    description: {
      fa: 'یافتن نزدیک‌ترین مرکز خدمات مجاز.',
      en: 'Find your nearest authorized center.',
    },
  },
  {
    href: DCODE_ROUTES.complaint,
    label: { fa: 'فرم شکایت', en: 'Complaint form' },
    description: {
      fa: 'ثبت شکایت خدمات یا کیفیت محصول.',
      en: 'Submit a service or product complaint.',
    },
  },
  {
    href: DCODE_ROUTES.survey,
    label: { fa: 'فرم نظرسنجی', en: 'Customer survey' },
    description: {
      fa: 'تجربه‌ی خدمات خود را ارزیابی کنید.',
      en: 'Rate your service experience.',
    },
  },
  {
    href: DCODE_ROUTES.becomeDealer,
    label: { fa: 'درخواست نمایندگی', en: 'Become a dealer' },
    description: {
      fa: 'همکاری به‌عنوان نماینده‌ی فروش یا خدمات.',
      en: 'Partner as a sales or service dealer.',
    },
  },
  {
    href: DCODE_ROUTES.dealerPortal,
    label: { fa: 'پرتال نمایندگان خدمات', en: 'Dealer portal' },
    description: {
      fa: 'ورود نمایندگان خدمات پس از فروش.',
      en: 'Sign in for after-sales partners.',
    },
  },
];

// Footer "Information" column.
export const INFO_LINKS: NavLink[] = [
  ABOUT_LINK,
  { href: DCODE_ROUTES.contact, label: { fa: 'تماس با ما', en: 'Contact us' } },
];
