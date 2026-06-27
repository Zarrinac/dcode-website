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

type Step = { title: string; body: string };
type Content = {
  eyebrow: string;
  title: string;
  description: string;
  stepsTitle: string;
  steps: Step[];
  coverageTitle: string;
  coverage: string[];
  contact: { title: string; description: string; call: string };
};

const CONTENT: Record<Locale, Content> = {
  fa: {
    eyebrow: 'پشتیبانی',
    title: 'خدمات تعمیر و پشتیبانی',
    description:
      'نصب، تعمیر و خدمات پس از فروش محصولات D’code توسط شبکه‌ی خدمات مجاز صنایع زرین نمای کاسپین در سراسر ایران انجام می‌شود.',
    stepsTitle: 'ثبت درخواست سرویس در سه گام',
    steps: [
      {
        title: '۱. تماس بگیرید',
        body: 'با امور مشتریان تماس بگیرید و مدل دستگاه و شرح مشکل را اعلام کنید.',
      },
      {
        title: '۲. هماهنگی کارشناس',
        body: 'نزدیک‌ترین مرکز خدمات مجاز برای بازدید یا تعمیر با شما هماهنگ می‌کند.',
      },
      {
        title: '۳. انجام خدمت',
        body: 'خدمات نصب یا تعمیر طبق شرایط گارانتی و در زمان مقرر انجام می‌شود.',
      },
    ],
    coverageTitle: 'چه خدماتی ارائه می‌شود؟',
    coverage: [
      'نصب اولیه‌ی تلویزیون و کولر گازی طبق شرایط نصب استاندارد.',
      'تعمیر و تعویض قطعات در دوره‌ی گارانتی، به‌جز موارد خارج از پوشش.',
      'بروزرسانی نرم‌افزار تلویزیون به‌صورت رایگان توسط نمایندگی.',
      'جابجایی دستگاه در دوره‌ی گارانتی با تأیید کارشناس.',
      'تأمین قطعات و خدمات پس از فروش تا ۱۰ سال طبق ضوابط شرکت.',
    ],
    contact: {
      title: 'ثبت درخواست سرویس',
      description: 'برای نصب، تعمیر یا پشتیبانی، با امور مشتریان D’code تماس بگیرید.',
      call: 'تماس با پشتیبانی',
    },
  },
  en: {
    eyebrow: 'Support',
    title: 'Repair & support',
    description:
      'Installation, repair, and after-sales service for D’code products are handled by the authorized service network of Zarrin Nama Caspian Industries across Iran.',
    stepsTitle: 'Request service in three steps',
    steps: [
      {
        title: '1. Get in touch',
        body: 'Call customer service with your device model and a description of the issue.',
      },
      {
        title: '2. Technician coordination',
        body: 'The nearest authorized service centre arranges a visit or repair with you.',
      },
      {
        title: '3. Service performed',
        body: 'Installation or repair is completed under warranty terms within the agreed time.',
      },
    ],
    coverageTitle: 'What is covered?',
    coverage: [
      'Initial installation of TVs and air conditioners under standard installation terms.',
      'Repair and parts replacement during the warranty period, except excluded cases.',
      'Free TV software updates performed by the authorized representative.',
      'Device relocation during the warranty period, subject to technician approval.',
      'Parts and after-sales service for up to 10 years under company terms.',
    ],
    contact: {
      title: 'Request service',
      description: 'For installation, repair, or support, contact D’code customer service.',
      call: 'Call support',
    },
  },
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolved = await params;
  const locale = resolveLocale(resolved?.locale ?? (await getLocale()));
  setRequestLocale(locale);
  const c = CONTENT[locale];
  const path = `/${locale}${DCODE_ROUTES.service}`;
  return {
    title: c.title,
    description: c.description,
    openGraph: { title: c.title, description: c.description, url: path, type: 'website' },
    twitter: { card: 'summary', title: c.title, description: c.description },
    alternates: { canonical: path, languages: getLanguageAlternates(DCODE_ROUTES.service) },
    metadataBase: new URL(SITE_URL),
  };
}

export default async function ServicePage({ params }: PageProps) {
  const resolved = await params;
  const locale = resolveLocale(resolved?.locale ?? (await getLocale()));
  setRequestLocale(locale);
  const c = CONTENT[locale];

  const breadcrumbItems = createBreadcrumbItems(locale, {
    label: c.title,
    href: `/${locale}${DCODE_ROUTES.service}`,
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

      <h2 className="text-xl font-bold text-(--dcode-text)">{c.stepsTitle}</h2>
      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        {c.steps.map((step) => (
          <div
            key={step.title}
            className="rounded-2xl border border-(--dcode-border) bg-(--dcode-surface) p-6"
          >
            <h3 className="text-base font-bold text-(--dcode-red)">{step.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-(--dcode-text-muted)">{step.body}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 rounded-2xl border border-(--dcode-border) bg-(--dcode-surface) p-6 sm:p-8">
        <h2 className="text-xl font-bold text-(--dcode-text)">{c.coverageTitle}</h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {c.coverage.map((item) => (
            <li
              key={item}
              className="flex items-start gap-2.5 text-sm leading-relaxed text-(--dcode-text-muted)"
            >
              <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-(--dcode-red)" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
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
