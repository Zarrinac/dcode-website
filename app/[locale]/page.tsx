import type { Metadata } from 'next';
import { getLocale, getTranslations, setRequestLocale } from 'next-intl/server';
import { HiSparkles, HiCpuChip, HiShieldCheck } from 'react-icons/hi2';
import JsonLd from '@/components/seo/JsonLd';
import DcodeSection from '@/components/dcode/DcodeSection';
import HeroDepthGrid from '@/components/dcode/heroes/HeroDepthGrid';
import ProductFamilyCard from '@/components/dcode/ProductFamilyCard';
import SectionHeading from '@/components/dcode/SectionHeading';
import { Stagger, StaggerItem } from '@/components/motion/Stagger';
import { getDcodeProductsByCategory } from '@/lib/dcode/source';
import { categoryHref } from '@/lib/dcode/categories';
import { DCODE_BRAND } from '@/lib/dcode/brand';
import type { Locale } from '@/i18n/routing';
import { getLanguageAlternates, getLocaleLanguage, SITE_URL, toAbsoluteUrl } from '@/lib/seo/site';

// ISR: cache the brand landing (and its DB-backed product fetch), refresh hourly.
export const revalidate = 3600;

type PageParams = { locale?: string };
type PageProps = { params: PageParams | Promise<PageParams> };

const resolveLocale = (value?: string): Locale => (value === 'fa' ? 'fa' : 'en');

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolved = await params;
  const locale = resolveLocale(resolved?.locale ?? (await getLocale()));
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'DcodePage' });
  const languageAlternates = getLanguageAlternates('/');
  return {
    title: t('landing.metaTitle'),
    description: t('landing.metaDescription'),
    openGraph: {
      title: t('landing.metaTitle'),
      description: t('landing.metaDescription'),
      url: `/${locale}`,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: t('landing.metaTitle'),
      description: t('landing.metaDescription'),
    },
    alternates: { canonical: `/${locale}`, languages: languageAlternates },
    metadataBase: new URL(SITE_URL),
  };
}

export default async function DcodeLandingPage({ params }: PageProps) {
  const resolved = await params;
  const locale = resolveLocale(resolved?.locale ?? (await getLocale()));
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'DcodePage' });

  const [tvs, acs] = await Promise.all([
    getDcodeProductsByCategory('tv'),
    getDcodeProductsByCategory('ac'),
  ]);
  const featuredTv = tvs[0];
  const featuredAc = acs[0];

  const brandSchema = {
    '@context': 'https://schema.org',
    '@type': 'Brand',
    name: DCODE_BRAND.name,
    url: `${SITE_URL}/${locale}`,
    logo: toAbsoluteUrl(DCODE_BRAND.logoOnDark),
    inLanguage: getLocaleLanguage(locale),
    slogan: t('landing.heroTitle'),
  };

  const whyItems = [
    {
      icon: HiSparkles,
      title: t('landing.whyDesignTitle'),
      description: t('landing.whyDesignDescription'),
    },
    {
      icon: HiCpuChip,
      title: t('landing.whySmartTitle'),
      description: t('landing.whySmartDescription'),
    },
    {
      icon: HiShieldCheck,
      title: t('landing.whySupportTitle'),
      description: t('landing.whySupportDescription'),
    },
  ];

  return (
    <div className="pb-16">
      <JsonLd data={brandSchema} />

      {/* Animated brand hero — one big full-width banner, no products/CTAs.
          "Depth Grid × Decoder": a one-point-perspective wireframe that resolves
          brighter under a cursor-tracked red light (the brand's "decoding" idea). */}
      <HeroDepthGrid
        locale={locale}
        title={t('landing.heroTitle')}
        subtitle={t('landing.heroSubtitle')}
      />

      <DcodeSection locale={locale} className="py-12 lg:py-20">
        {/* Product categories */}
        <section>
          <SectionHeading
            eyebrow={t('landing.familiesEyebrow')}
            title={t('landing.familiesTitle')}
            description={t('landing.familiesDescription')}
          />
          <Stagger className="mt-10 grid gap-6 md:grid-cols-2">
            {featuredTv && (
              <StaggerItem>
                <ProductFamilyCard
                  href={categoryHref(locale, 'tv')}
                  eyebrow={t('landing.tvCardEyebrow')}
                  title={t('landing.tvCardTitle')}
                  description={t('landing.tvCardDescription')}
                  image={featuredTv.heroImage}
                  imageAlt={featuredTv.copy[locale].name}
                  cta={t('landing.exploreCta')}
                />
              </StaggerItem>
            )}
            {featuredAc && (
              <StaggerItem>
                <ProductFamilyCard
                  href={categoryHref(locale, 'ac')}
                  eyebrow={t('landing.acCardEyebrow')}
                  title={t('landing.acCardTitle')}
                  description={t('landing.acCardDescription')}
                  image={featuredAc.heroImage}
                  imageAlt={featuredAc.copy[locale].name}
                  cta={t('landing.exploreCta')}
                  light
                />
              </StaggerItem>
            )}
          </Stagger>
        </section>

        {/* Why D'code */}
        <section className="mt-24 lg:mt-32">
          <SectionHeading
            eyebrow={t('landing.whyEyebrow')}
            title={t('landing.whyTitle')}
            description={t('landing.whyDescription')}
          />
          <Stagger className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {whyItems.map((item) => {
              const Icon = item.icon;
              return (
                <StaggerItem
                  key={item.title}
                  className="flex h-full flex-col gap-4 rounded-3xl border border-(--dcode-border) bg-(--dcode-surface) p-7 transition-colors hover:border-(--dcode-border-strong)"
                >
                  <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-(--dcode-red)/10 text-(--dcode-red)">
                    <Icon className="size-6" aria-hidden />
                  </span>
                  <h3 className="text-lg font-bold text-(--dcode-text)">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-(--dcode-text-muted)">
                    {item.description}
                  </p>
                </StaggerItem>
              );
            })}
          </Stagger>
        </section>
      </DcodeSection>
    </div>
  );
}
