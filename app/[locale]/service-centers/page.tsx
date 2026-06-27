import type { Metadata } from 'next';
import { getLocale, setRequestLocale } from 'next-intl/server';
import JsonLd from '@/components/seo/JsonLd';
import RoutePage from '@/components/dcode/routes/RoutePage';
import ContactCard from '@/components/dcode/routes/ContactCard';
import ServiceCenterFinder, {
  type ServiceCenterFinderCopy,
} from '@/components/dcode/routes/ServiceCenterFinder';
import type { Locale } from '@/i18n/routing';
import {
  createBreadcrumbItems,
  createBreadcrumbJsonLd,
  getLanguageAlternates,
  getLocaleLanguage,
  SITE_URL,
  toAbsoluteUrl,
} from '@/lib/seo/site';
import {
  loadServiceCenterData,
  normalizeServiceCenterFilters,
} from '@/lib/dcode/serviceCenterSource';
import { DCODE_ROUTES } from '@/lib/dcode/routes';

// Dynamic (reads searchParams to filter the representative table). No `revalidate`.
type PageParams = { locale?: string };
type PageProps = {
  params: PageParams | Promise<PageParams>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};
const resolveLocale = (value?: string): Locale => (value === 'fa' ? 'fa' : 'en');
const firstValue = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

const META: Record<Locale, { eyebrow: string; title: string; description: string }> = {
  fa: {
    eyebrow: 'پشتیبانی',
    title: 'لیست نمایندگان خدمات',
    description:
      'نزدیک‌ترین نماینده‌ی رسمی خدمات پس از فروش را پیدا کنید. محصولات D’code توسط شبکه‌ی سراسری خدمات مجاز صنایع زرین نمای کاسپین سرویس می‌شوند؛ با انتخاب استان، شهر و نوع فعالیت، نماینده‌ی موردنظر را بیابید.',
  },
  en: {
    eyebrow: 'Support',
    title: 'Service centers',
    description:
      'Find the nearest official after-sales service representative. D’code products are serviced by the nationwide authorized network of Zarrin Nama Caspian Industries — filter by province, city, and service type.',
  },
};

const TABLE_COPY: Record<Locale, ServiceCenterFinderCopy> = {
  fa: {
    provinceLabel: 'استان',
    cityLabel: 'شهر',
    serviceKindLabel: 'نوع فعالیت',
    allCities: 'همه شهرها',
    allServiceKinds: 'همه فعالیت‌ها',
    provincePlaceholder: '-- انتخاب استان --',
    cityPlaceholder: '-- ابتدا استان را انتخاب کنید --',
    serviceKindPlaceholder: '-- انتخاب فعالیت --',
    submitLabel: 'نمایش مشخصات',
    resetLabel: 'پاک کردن فیلترها',
    resultCount: '{count} نماینده',
    emptyTitle: 'نماینده‌ای با این فیلترها پیدا نشد.',
    emptyDescription: 'لطفاً استان، شهر یا نوع فعالیت دیگری را انتخاب کنید.',
    noDataTitle: 'اطلاعات نمایندگان هنوز ثبت نشده است.',
    noDataDescription:
      'ساختار جدول و فیلترها آماده است. پس از بارگذاری اطلاعات رسمی نمایندگان خدمات، ردیف‌ها در همین بخش نمایش داده می‌شوند.',
    initialTitle: 'برای مشاهده‌ی نمایندگان، فیلترها را انتخاب کنید.',
    initialDescription:
      'استان و نوع فعالیت موردنظر را انتخاب کنید و روی نمایش مشخصات بزنید. در صورت خالی گذاشتن فیلترها، همه‌ی نمایندگان نمایش داده می‌شوند.',
    headers: {
      province: 'استان',
      city: 'شهر',
      serviceKind: 'نوع فعالیت نماینده',
      representativeName: 'نام و نام خانوادگی',
      representativeCode: 'کد نمایندگی',
      primaryPhone: 'شماره اصلی',
      mobilePhone: 'شماره همراه',
      address: 'آدرس',
    },
  },
  en: {
    provinceLabel: 'Province',
    cityLabel: 'City',
    serviceKindLabel: 'Service type',
    allCities: 'All cities',
    allServiceKinds: 'All service types',
    provincePlaceholder: '-- Select province --',
    cityPlaceholder: '-- Select province first --',
    serviceKindPlaceholder: '-- Select service type --',
    submitLabel: 'Show details',
    resetLabel: 'Clear filters',
    resultCount: '{count} representatives',
    emptyTitle: 'No representatives match these filters.',
    emptyDescription: 'Please choose another province, city, or service type.',
    noDataTitle: 'Representative data has not been added yet.',
    noDataDescription:
      'The table and filters are ready. Official service representative rows will appear here once the data is loaded.',
    initialTitle: 'Choose filters to view representatives.',
    initialDescription:
      'Select a province and service type, then choose Show details. Leave filters empty to show all representatives.',
    headers: {
      province: 'Province',
      city: 'City',
      serviceKind: 'Service type',
      representativeName: 'Representative name',
      representativeCode: 'Representative code',
      primaryPhone: 'Primary phone',
      mobilePhone: 'Mobile',
      address: 'Address',
    },
  },
};

const CONTACT_COPY: Record<Locale, { title: string; description: string; call: string }> = {
  fa: {
    title: 'نزدیک‌ترین نماینده را نمی‌یابید؟',
    description:
      'با امور مشتریان D’code تماس بگیرید تا نزدیک‌ترین مرکز خدمات مجاز به شما معرفی شود.',
    call: 'تماس با پشتیبانی',
  },
  en: {
    title: 'Can’t find a nearby centre?',
    description:
      'Call D’code customer service and we’ll refer you to the nearest authorized service centre.',
    call: 'Call support',
  },
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolved = await params;
  const locale = resolveLocale(resolved?.locale ?? (await getLocale()));
  setRequestLocale(locale);
  const meta = META[locale];
  const path = `/${locale}${DCODE_ROUTES.serviceCenters}`;
  return {
    title: meta.title,
    description: meta.description,
    openGraph: { title: meta.title, description: meta.description, url: path, type: 'website' },
    twitter: { card: 'summary', title: meta.title, description: meta.description },
    alternates: { canonical: path, languages: getLanguageAlternates(DCODE_ROUTES.serviceCenters) },
    metadataBase: new URL(SITE_URL),
  };
}

export default async function ServiceCentersPage({ params, searchParams }: PageProps) {
  const resolved = await params;
  const locale = resolveLocale(resolved?.locale ?? (await getLocale()));
  setRequestLocale(locale);
  const meta = META[locale];
  const resolvedSearchParams = (await searchParams) ?? {};

  // Only load + serialize rows after the finder submits (`submitted=1`); the bare
  // canonical page stays light, while the dropdown data still loads for filtering.
  const hasSearched = firstValue(resolvedSearchParams.submitted) === '1';
  const selectedFilters = normalizeServiceCenterFilters({
    provinceId: firstValue(resolvedSearchParams.province),
    cityId: firstValue(resolvedSearchParams.city),
    serviceKind: firstValue(resolvedSearchParams.service),
  });
  // Both the result rows and the province → city dropdown options come from the
  // ServiceRepresentative table (data.locations is derived from the rep rows), so the
  // dropdown IDs always line up with the filter. This mirrors how the parent site's
  // finder works.
  const data = await loadServiceCenterData(locale, selectedFilters, hasSearched);
  const locations = data.locations;

  const breadcrumbItems = createBreadcrumbItems(locale, {
    label: meta.title,
    href: `/${locale}${DCODE_ROUTES.serviceCenters}`,
  });

  const pageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: meta.title,
    description: meta.description,
    url: toAbsoluteUrl(`/${locale}${DCODE_ROUTES.serviceCenters}`),
    inLanguage: getLocaleLanguage(locale),
  };

  return (
    <RoutePage
      locale={locale}
      eyebrow={meta.eyebrow}
      title={meta.title}
      description={meta.description}
      breadcrumbItems={breadcrumbItems}
    >
      <JsonLd data={[createBreadcrumbJsonLd(breadcrumbItems), pageSchema]} />

      <ServiceCenterFinder
        locale={locale}
        centers={data.centers}
        locations={locations}
        copy={TABLE_COPY[locale]}
        selectedFilters={selectedFilters}
        hasSearched={hasSearched}
        totalCount={data.totalCount}
      />

      <div className="mt-12">
        <ContactCard
          locale={locale}
          title={CONTACT_COPY[locale].title}
          description={CONTACT_COPY[locale].description}
          callLabel={CONTACT_COPY[locale].call}
        />
      </div>
    </RoutePage>
  );
}
