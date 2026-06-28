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
  toAbsoluteUrl,
} from '@/lib/seo/site';
import { DCODE_ROUTES } from '@/lib/dcode/routes';

export const revalidate = 3600;

type PageParams = { locale?: string };
type PageProps = { params: PageParams | Promise<PageParams> };
const resolveLocale = (value?: string): Locale => (value === 'fa' ? 'fa' : 'en');

type Block = { title: string; body: string };
type Stat = { value: string; label: string };
type AboutContent = {
  eyebrow: string;
  title: string;
  description: string;
  lead: string;
  stats: Stat[];
  blocks: Block[];
  contact: { title: string; description: string; call: string };
};

const CONTENT: Record<Locale, AboutContent> = {
  fa: {
    eyebrow: 'درباره ما',
    title: 'برند D’code',
    description:
      'D’code برندی جوان از صنایع زرین نمای کاسپین است؛ با تمرکز بر تلویزیون و کولر گازی پریمیوم، طراحی سنجیده و خدمات پس از فروش مطمئن در ایران.',
    lead: 'D’code با یک ایده‌ی ساده ساخته شد: فناوری باکیفیت برای خانه، بدون پیچیدگی. ما طراحی مدرن را با عملکرد هوشمند و دوام بالا همراه می‌کنیم تا محصولاتی بسازیم که هر روز به آن‌ها تکیه کنید.',
    stats: [
      { value: '۲۴ ماه', label: 'گارانتی محصول' },
      { value: 'تا ۱۰ سال', label: 'تأمین قطعات و خدمات' },
      { value: '۵ سال', label: 'گارانتی کمپرسور کولر گازی' },
    ],
    blocks: [
      {
        title: 'پشتوانه‌ی یک شرکت معتبر',
        body: 'D’code برندی از صنایع زرین نمای کاسپین، نماینده‌ی رسمی Hisense در ایران است. همین پشتوانه یعنی دسترسی به شبکه‌ی سراسری خدمات، تأمین قطعات و تیم پشتیبانی آموزش‌دیده در سراسر کشور.',
      },
      {
        title: 'طراحی و کیفیت',
        body: 'هر محصول D’code با خطوط تمیز، پرداخت پریمیوم و قطعات بادوام طراحی می‌شود تا هم زیبا به نظر برسد و هم سال‌ها بدون دردسر کار کند.',
      },
      {
        title: 'تعهد به مشتری',
        body: 'از خرید تا نصب و خدمات پس از فروش، تجربه‌ای شفاف و قابل‌اعتماد ارائه می‌کنیم؛ با گارانتی روشن و مسیرهای ساده برای دریافت پشتیبانی. کولرهای گازی D’code افزون بر گارانتی محصول، از ۵ سال گارانتی کمپرسور بهره‌مند می‌شوند.',
      },
    ],
    contact: {
      title: 'سؤالی دارید؟ با ما در ارتباط باشید',
      description:
        'تیم D’code آماده‌ی پاسخگویی به پرسش‌های شما درباره‌ی محصولات، فروش و خدمات است.',
      call: 'تماس با ما',
    },
  },
  en: {
    eyebrow: 'About us',
    title: 'The D’code brand',
    description:
      'D’code is a young brand by Zarrin Nama Caspian Industries, focused on premium TVs and air conditioners — thoughtful design and dependable after-sales service in Iran.',
    lead: 'D’code was built on a simple idea: quality home technology, without the complexity. We pair modern design with intelligent performance and lasting durability to make products you can rely on every day.',
    stats: [
      { value: '24 months', label: 'Product warranty' },
      { value: 'Up to 10 yrs', label: 'Parts & service' },
      { value: '5 years', label: 'AC compressor warranty' },
    ],
    blocks: [
      {
        title: 'Backed by an established company',
        body: 'D’code is a brand of Zarrin Nama Caspian Industries, the official Hisense representative in Iran. That backing means access to a nationwide service network, parts supply, and a trained support team across the country.',
      },
      {
        title: 'Design and quality',
        body: 'Every D’code product is designed with clean lines, a premium finish, and durable components — so it looks great and keeps working for years without hassle.',
      },
      {
        title: 'Commitment to customers',
        body: 'From purchase to installation and after-sales service, we deliver a transparent, trustworthy experience — with clear warranty terms and simple paths to support. D’code air conditioners also come with a 5-year compressor warranty in addition to the product warranty.',
      },
    ],
    contact: {
      title: 'Have a question? Get in touch',
      description:
        'The D’code team is ready to answer your questions about products, sales, and service.',
      call: 'Contact us',
    },
  },
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolved = await params;
  const locale = resolveLocale(resolved?.locale ?? (await getLocale()));
  setRequestLocale(locale);
  const c = CONTENT[locale];
  const path = `/${locale}${DCODE_ROUTES.about}`;
  return {
    title: c.title,
    description: c.description,
    openGraph: { title: c.title, description: c.description, url: path, type: 'website' },
    twitter: { card: 'summary', title: c.title, description: c.description },
    alternates: { canonical: path, languages: getLanguageAlternates(DCODE_ROUTES.about) },
    metadataBase: new URL(SITE_URL),
  };
}

export default async function AboutPage({ params }: PageProps) {
  const resolved = await params;
  const locale = resolveLocale(resolved?.locale ?? (await getLocale()));
  setRequestLocale(locale);
  const c = CONTENT[locale];

  const breadcrumbItems = createBreadcrumbItems(locale, {
    label: c.title,
    href: `/${locale}${DCODE_ROUTES.about}`,
  });

  const aboutSchema = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: c.title,
    description: c.description,
    url: toAbsoluteUrl(`/${locale}${DCODE_ROUTES.about}`),
  };

  return (
    <RoutePage
      locale={locale}
      eyebrow={c.eyebrow}
      title={c.title}
      description={c.description}
      breadcrumbItems={breadcrumbItems}
    >
      <JsonLd data={[createBreadcrumbJsonLd(breadcrumbItems), aboutSchema]} />

      <p className="max-w-3xl text-lg leading-relaxed text-(--dcode-text)">{c.lead}</p>

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        {c.stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-(--dcode-border) bg-(--dcode-surface) p-6 text-center"
          >
            <p className="text-3xl font-extrabold text-(--dcode-red)">{stat.value}</p>
            <p className="mt-1 text-sm text-(--dcode-text-muted)">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-3 lg:items-start">
        {c.blocks.map((block) => (
          <div
            key={block.title}
            className="rounded-2xl border border-(--dcode-border) bg-(--dcode-surface) p-6"
          >
            <h2 className="text-lg font-bold text-(--dcode-text)">{block.title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-(--dcode-text-muted)">{block.body}</p>
          </div>
        ))}
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
