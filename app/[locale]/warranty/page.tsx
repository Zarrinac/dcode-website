import type { Metadata } from 'next';
import { getLocale, setRequestLocale } from 'next-intl/server';
import JsonLd from '@/components/seo/JsonLd';
import RoutePage from '@/components/dcode/routes/RoutePage';
import ContactCard from '@/components/dcode/routes/ContactCard';
import type { Locale } from '@/i18n/routing';
import {
  createBreadcrumbItems,
  createBreadcrumbJsonLd,
  getLanguageAlternates,
  SITE_URL,
} from '@/lib/seo/site';
import { DCODE_ROUTES } from '@/lib/dcode/routes';

export const revalidate = 3600;

type PageParams = { locale?: string };
type PageProps = { params: PageParams | Promise<PageParams> };
const resolveLocale = (value?: string): Locale => (value === 'fa' ? 'fa' : 'en');

type Highlight = { label: string; value: string };
type TermSection = { title: string; items: string[] };
type WarrantyContent = {
  eyebrow: string;
  title: string;
  description: string;
  highlights: Highlight[];
  sections: TermSection[];
  note: { title: string; body: string };
  contact: { title: string; description: string; call: string };
};

const CONTENT: Record<Locale, WarrantyContent> = {
  fa: {
    eyebrow: 'پشتیبانی',
    title: 'شرایط گارانتی و خدمات پس از فروش',
    description:
      'خلاصه‌ای خوانا از شرایط گارانتی محصولات D’code، عرضه‌شده توسط صنایع زرین نمای کاسپین. این متن برای شناخت پوشش ضمانت، مسئولیت‌ها و موارد خارج از گارانتی تنظیم شده است.',
    highlights: [
      { label: 'مدت گارانتی محصول', value: '۲۴ ماه از تاریخ نصب' },
      { label: 'گارانتی کمپرسور', value: 'حداقل ۶۰ ماه' },
      { label: 'پشتیبانی پس از گارانتی', value: 'تا ۱۰ سال خدمات و قطعات' },
      { label: 'نصب استاندارد', value: 'رایگان طبق شرایط اعلام‌شده' },
    ],
    sections: [
      {
        title: 'شرایط عمومی گارانتی',
        items: [
          'تمامی محصولات طبق شرایط استاندارد شامل نصب رایگان هستند. برای کولر گازی، لوله‌کشی تا ۵ متر در نصب استاندارد لحاظ می‌شود.',
          'گارانتی محصول از تاریخ نصب به مدت ۲۴ ماه معتبر است، مگر اینکه در کارت گارانتی مدت دیگری اعلام شده باشد.',
          'گارانتی کمپرسور برای محصولات مشمول، حداقل ۶۰ ماه است.',
          'پشتیبانی خدمات پس از فروش و تأمین قطعات، طبق ضوابط شرکت تا ۱۰ سال ارائه می‌شود.',
          'خدمات گارانتی فقط از طریق مراکز خدمات مجاز و نمایندگان رسمی در ایران انجام می‌شود.',
          'ارائه کارت گارانتی، اطلاعات خرید یا مدارک نصب برای ثبت و پیگیری خدمات ضروری است.',
        ],
      },
      {
        title: 'مسئولیت‌های مشتری',
        items: [
          'فراهم کردن شرایط ایمن نصب مانند دسترسی مناسب، داربست، بالابر یا نردبان در صورت نیاز.',
          'پرداخت هزینه متریال مصرفی و موارد خارج از نصب استاندارد مانند لوله، کابل، پایه، سوراخ‌کاری یا تغییرات ساختمانی.',
          'استفاده از دستگاه مطابق دفترچه راهنما و جلوگیری از شرایط محیطی نامناسب.',
          'نگهداری مدارک خرید، کارت گارانتی و اطلاعات نصب برای فعال‌سازی یا پیگیری خدمات.',
        ],
      },
      {
        title: 'موارد خارج از پوشش گارانتی',
        items: [
          'آسیب ناشی از استفاده نادرست، نصب غیرمجاز، نوسان برق، حوادث، رطوبت غیرمجاز یا عوامل محیطی خارج از استاندارد.',
          'صدمات فیزیکی مانند شکستگی، ضربه، فرورفتگی، خط‌وخش یا آسیب حمل‌ونقل پس از تحویل.',
          'هرگونه تعمیر، باز کردن دستگاه یا دستکاری توسط افراد یا مراکز غیرمجاز.',
          'ایرادهای ناشی از برق‌کشی، ارت یا ولتاژ خارج از محدوده استاندارد دستگاه.',
          'هزینه نصب‌های اضافه، تجهیزات جانبی یا متریال مصرفی که جزو تعهد گارانتی نیستند.',
        ],
      },
    ],
    note: {
      title: 'توجه مهم',
      body: 'این متن نسخه‌ی وب و بهینه‌شده برای مطالعه‌ی سریع است. در صورت وجود اختلاف، کارت گارانتی محصول، فاکتور خرید و قرارداد فروش مبنای بررسی کارشناسی خواهند بود.',
    },
    contact: {
      title: 'برای پیگیری گارانتی با ما تماس بگیرید',
      description:
        'اگر درباره‌ی پوشش ضمانت، وضعیت سرویس یا مدارک موردنیاز سؤال دارید، از مسیر رسمی پشتیبانی استفاده کنید.',
      call: 'تماس با پشتیبانی',
    },
  },
  en: {
    eyebrow: 'Support',
    title: 'Warranty & after-sales terms',
    description:
      'A readable summary of the warranty terms for D’code products, supplied by Zarrin Nama Caspian Industries — covering what is protected, your responsibilities, and exclusions.',
    highlights: [
      { label: 'Product warranty', value: '24 months from installation' },
      { label: 'Compressor warranty', value: 'Minimum 60 months' },
      { label: 'Post-warranty support', value: 'Service & parts up to 10 years' },
      { label: 'Standard installation', value: 'Free under stated conditions' },
    ],
    sections: [
      {
        title: 'General warranty conditions',
        items: [
          'All products include free standard installation. For air conditioners, up to 5 metres of piping is included in standard installation.',
          'The product warranty is valid for 24 months from the installation date, unless stated otherwise on the warranty card.',
          'The compressor warranty for eligible products is at least 60 months.',
          'After-sales service and parts supply are provided for up to 10 years under company terms.',
          'Warranty service is performed only through authorized service centres and official representatives in Iran.',
          'A warranty card, proof of purchase, or installation records are required to register and follow up service.',
        ],
      },
      {
        title: 'Customer responsibilities',
        items: [
          'Provide safe installation conditions — proper access, scaffolding, lifts, or ladders where required.',
          'Cover consumables and items beyond standard installation, such as piping, cabling, brackets, drilling, or structural changes.',
          'Use the device per the manual and avoid unsuitable environmental conditions.',
          'Keep proof of purchase, the warranty card, and installation details for activation or follow-up.',
        ],
      },
      {
        title: 'Exclusions from warranty coverage',
        items: [
          'Damage from misuse, unauthorized installation, power surges, accidents, excess moisture, or non-standard environments.',
          'Physical damage such as breakage, impact, dents, scratches, or transport damage after delivery.',
          'Any repair, opening, or tampering by unauthorized people or centres.',
          'Faults caused by wiring, earthing, or voltage outside the device’s standard range.',
          'Costs of extra installation, accessories, or consumables not covered by the warranty.',
        ],
      },
    ],
    note: {
      title: 'Important note',
      body: 'This is a web-optimized summary for quick reading. In case of any discrepancy, the product warranty card, purchase invoice, and sales contract are the basis for review.',
    },
    contact: {
      title: 'Contact us to follow up a warranty claim',
      description:
        'Questions about coverage, service status, or required documents? Reach our official support line.',
      call: 'Call support',
    },
  },
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolved = await params;
  const locale = resolveLocale(resolved?.locale ?? (await getLocale()));
  setRequestLocale(locale);
  const c = CONTENT[locale];
  const path = `/${locale}${DCODE_ROUTES.warranty}`;
  return {
    title: c.title,
    description: c.description,
    openGraph: { title: c.title, description: c.description, url: path, type: 'website' },
    twitter: { card: 'summary', title: c.title, description: c.description },
    alternates: { canonical: path, languages: getLanguageAlternates(DCODE_ROUTES.warranty) },
    metadataBase: new URL(SITE_URL),
  };
}

export default async function WarrantyPage({ params }: PageProps) {
  const resolved = await params;
  const locale = resolveLocale(resolved?.locale ?? (await getLocale()));
  setRequestLocale(locale);
  const c = CONTENT[locale];

  const breadcrumbItems = createBreadcrumbItems(locale, {
    label: c.title,
    href: `/${locale}${DCODE_ROUTES.warranty}`,
  });

  return (
    <RoutePage
      locale={locale}
      eyebrow={c.eyebrow}
      title={c.title}
      description={c.description}
      breadcrumbItems={breadcrumbItems}
    >
      <JsonLd data={createBreadcrumbJsonLd(breadcrumbItems)} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {c.highlights.map((h) => (
          <div
            key={h.label}
            className="rounded-2xl border border-(--dcode-border) bg-(--dcode-surface) p-5"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-(--dcode-text-faint)">
              {h.label}
            </p>
            <p className="mt-2 text-lg font-bold text-(--dcode-text)">{h.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-3 lg:items-start">
        {c.sections.map((section) => (
          <div
            key={section.title}
            className="rounded-2xl border border-(--dcode-border) bg-(--dcode-surface) p-6"
          >
            <h2 className="text-lg font-bold text-(--dcode-text)">{section.title}</h2>
            <ul className="mt-4 space-y-3">
              {section.items.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2.5 text-sm leading-relaxed text-(--dcode-text-muted)"
                >
                  <span
                    aria-hidden
                    className="mt-2 size-1.5 shrink-0 rounded-full bg-(--dcode-red)"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-(--dcode-border-strong) bg-(--dcode-surface-muted) p-6">
        <h2 className="text-base font-bold text-(--dcode-text)">{c.note.title}</h2>
        <p className="mt-2 text-sm leading-relaxed text-(--dcode-text-muted)">{c.note.body}</p>
      </div>

      <div className="mt-12">
        <ContactCard
          locale={locale}
          title={c.contact.title}
          description={c.contact.description}
          callLabel={c.contact.call}
        />
      </div>
    </RoutePage>
  );
}
