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

type FaqItem = { question: string; answer: string[]; list?: string[] };
type FaqSection = { id: string; title: string; items: FaqItem[] };

const META: Record<Locale, { eyebrow: string; title: string; description: string }> = {
  fa: {
    eyebrow: 'پشتیبانی',
    title: 'سوالات متداول',
    description:
      'پاسخ سریع به پرسش‌های رایج درباره نصب، گارانتی، شارژ گاز و خدمات کولرهای گازی و تلویزیون‌های D’code.',
  },
  en: {
    eyebrow: 'Support',
    title: 'Frequently asked questions',
    description:
      'Fast answers to common questions about installation, warranty, gas charging, and service for D’code air conditioners and TVs.',
  },
};

const SECTIONS: Record<Locale, FaqSection[]> = {
  fa: [
    {
      id: 'ac',
      title: 'کولر گازی اسپلیت',
      items: [
        {
          question: 'آیا کولر گازی شامل لوله مسی می‌باشد؟',
          answer: [
            'خیر. دستگاه‌ها بدون لوله مسی عرضه می‌شوند و مشتری می‌تواند متناسب با ظرفیت دستگاه، لوله موردنیاز را از نمایندگی تهیه کند.',
          ],
        },
        {
          question: 'هزینه نصب کولر گازی چقدر است؟',
          answer: [
            'نصب یونیت داخلی و خارجی به همراه لوله‌کشی تا ۵ متر رایگان است.',
            'موارد زیر شامل هزینه جداگانه می‌شوند:',
          ],
          list: [
            'سوراخ‌کاری',
            'جوشکاری',
            'نصب پایه دیواری یا زمینی',
            'کابل‌کشی از کنتور',
            'متریال مصرفی مانند نوار پرایمر و لوله درین',
          ],
        },
        {
          question: 'آیا دستگاه پس از نصب نیاز به شارژ گاز دارد؟',
          answer: [
            'تا ۵ متر لوله‌کشی، گاز دستگاه به‌صورت کارخانه‌ای تأمین شده است. در صورت افزایش متراژ، شارژ گاز اضافی بر اساس مدل و ظرفیت دستگاه انجام می‌شود.',
          ],
        },
        {
          question: 'زمان مراجعه برای نصب یا تعمیر کولر گازی چقدر است؟',
          answer: [
            'نصب حداکثر تا ۴۸ ساعت کاری و تعمیر حداکثر تا ۷۲ ساعت کاری انجام می‌شود. در ایام پیک، این زمان ممکن است تا یک هفته افزایش یابد.',
          ],
        },
        {
          question: 'آیا هزینه تعمیر و جابجایی در دوره گارانتی بر عهده مشتری است؟',
          answer: [
            'خیر. تمامی هزینه‌های تعمیر و جابجایی در دوره گارانتی، به‌جز موارد خارج از شرایط ضمانت و با تأیید کارشناس، بر عهده شرکت است.',
          ],
        },
      ],
    },
    {
      id: 'tv',
      title: 'تلویزیون',
      items: [
        {
          question: 'هزینه نصب تلویزیون چقدر است؟',
          answer: [
            'نصب تلویزیون در حالت پایه رومیزی رایگان است. در صورت نصب دیواری، هزینه نصب بر عهده مشتری خواهد بود.',
          ],
        },
        {
          question: 'آیا آپدیت نرم‌افزار تلویزیون هزینه دارد؟',
          answer: [
            'خیر. خدمات بروزرسانی نرم‌افزار کاملاً رایگان بوده و توسط نمایندگی انجام می‌شود.',
          ],
        },
        {
          question: 'آیا شکستگی پنل شامل گارانتی است؟',
          answer: [
            'خیر. شکستگی پنل شامل گارانتی نمی‌شود و هزینه آن بسته به مدل دستگاه، حدود ۸۰ تا ۹۰ درصد قیمت کل دستگاه است.',
          ],
        },
        {
          question: 'آیا هزینه تعمیر تلویزیون در دوره گارانتی با مشتری است؟',
          answer: [
            'خیر. تمامی هزینه‌ها در دوره گارانتی، به‌جز موارد خارج از شرایط ضمانت، بر عهده شرکت می‌باشد.',
          ],
        },
      ],
    },
  ],
  en: [
    {
      id: 'ac',
      title: 'Split air conditioner',
      items: [
        {
          question: 'Do air conditioners include copper piping?',
          answer: [
            'No. Units are supplied without copper pipes. Purchase the required piping based on the unit capacity through an authorized dealer.',
          ],
        },
        {
          question: 'What is the air conditioner installation cost?',
          answer: [
            'Installation of indoor and outdoor units with up to 5 metres of piping is free.',
            'Additional costs may apply for:',
          ],
          list: [
            'Drilling',
            'Welding',
            'Wall or floor brackets',
            'Electrical wiring from the meter',
            'Consumables such as drain pipe and insulation tape',
          ],
        },
        {
          question: 'Does the unit need extra gas charging after installation?',
          answer: [
            'Units are factory pre-charged for up to 5 metres of piping. Extra pipe length may require additional gas depending on the model and capacity.',
          ],
        },
        {
          question: 'How long do installation and repair take?',
          answer: [
            'Installation is completed within 48 working hours and repair within 72 working hours. During peak seasons this may extend up to one week.',
          ],
        },
        {
          question: 'Are repair and relocation covered during the warranty period?',
          answer: [
            'Yes. All repair and relocation costs are covered under warranty — except cases excluded in the terms — when approved by a technician.',
          ],
        },
      ],
    },
    {
      id: 'tv',
      title: 'TV',
      items: [
        {
          question: 'What is the TV installation cost?',
          answer: [
            'Installation is free with the standard tabletop stand. Wall-mount installation incurs an additional cost.',
          ],
        },
        {
          question: 'Are software updates free?',
          answer: [
            'Yes. Software updates are completely free and performed by authorized service technicians.',
          ],
        },
        {
          question: 'Is a broken panel covered by warranty?',
          answer: [
            'No. Panel damage is not covered and typically costs 80–90 percent of the device price depending on the model.',
          ],
        },
        {
          question: 'Is TV repair covered during the warranty period?',
          answer: ['Yes. All repair costs are covered under warranty except for excluded cases.'],
        },
      ],
    },
  ],
};

const CONTACT_COPY: Record<Locale, { title: string; description: string; call: string }> = {
  fa: {
    title: 'پاسخ خود را پیدا نکردید؟',
    description: 'با امور مشتریان D’code تماس بگیرید؛ تیم پشتیبانی در ساعات کاری پاسخگوی شماست.',
    call: 'تماس با پشتیبانی',
  },
  en: {
    title: 'Didn’t find your answer?',
    description:
      'Contact D’code customer service — our support team is available during working hours.',
    call: 'Call support',
  },
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolved = await params;
  const locale = resolveLocale(resolved?.locale ?? (await getLocale()));
  setRequestLocale(locale);
  const meta = META[locale];
  const path = `/${locale}${DCODE_ROUTES.faq}`;
  return {
    title: meta.title,
    description: meta.description,
    openGraph: { title: meta.title, description: meta.description, url: path, type: 'website' },
    twitter: { card: 'summary', title: meta.title, description: meta.description },
    alternates: { canonical: path, languages: getLanguageAlternates(DCODE_ROUTES.faq) },
    metadataBase: new URL(SITE_URL),
  };
}

export default async function FaqPage({ params }: PageProps) {
  const resolved = await params;
  const locale = resolveLocale(resolved?.locale ?? (await getLocale()));
  setRequestLocale(locale);
  const meta = META[locale];
  const sections = SECTIONS[locale];
  const contact = CONTACT_COPY[locale];

  const breadcrumbItems = createBreadcrumbItems(locale, {
    label: meta.title,
    href: `/${locale}${DCODE_ROUTES.faq}`,
  });

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: sections
      .flatMap((s) => s.items)
      .map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: [...item.answer, ...(item.list ?? [])].join(' '),
        },
      })),
  };

  return (
    <RoutePage
      locale={locale}
      eyebrow={meta.eyebrow}
      title={meta.title}
      description={meta.description}
      breadcrumbItems={breadcrumbItems}
    >
      <JsonLd data={[createBreadcrumbJsonLd(breadcrumbItems), faqSchema]} />

      <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
        {sections.map((section) => (
          <div key={section.id}>
            <h2 className="mb-4 text-xl font-bold text-(--dcode-text)">{section.title}</h2>
            <div className="overflow-hidden rounded-2xl border border-(--dcode-border) bg-(--dcode-surface)">
              {section.items.map((item, index) => (
                <details
                  key={item.question}
                  open={index === 0}
                  className="group border-b border-(--dcode-border) last:border-b-0"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-sm font-semibold text-(--dcode-text) transition-colors hover:bg-(--dcode-surface-muted) [&::-webkit-details-marker]:hidden">
                    <span>{item.question}</span>
                    <span
                      aria-hidden
                      className="inline-flex size-6 shrink-0 items-center justify-center text-lg font-semibold leading-none text-(--dcode-red) before:content-['+'] group-open:before:content-['−']"
                    />
                  </summary>
                  <div className="border-t border-(--dcode-border) px-5 py-4 text-sm leading-7 text-(--dcode-text-muted)">
                    {item.answer.map((p) => (
                      <p key={p} className="mb-2 last:mb-0">
                        {p}
                      </p>
                    ))}
                    {item.list && (
                      <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                        {item.list.map((li) => (
                          <li key={li} className="flex items-start gap-2 text-(--dcode-text)">
                            <span
                              aria-hidden
                              className="mt-2 size-1.5 shrink-0 rounded-full bg-(--dcode-red)"
                            />
                            <span>{li}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </details>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12">
        <ContactCard
          locale={locale}
          title={contact.title}
          description={contact.description}
          callLabel={contact.call}
        />
      </div>
    </RoutePage>
  );
}
