import DcodeSection from '@/components/dcode/DcodeSection';
import Breadcrumb from '@/components/dcode/Breadcrumb';
import ProductCard from '@/components/dcode/ProductCard';
import Reveal from '@/components/motion/Reveal';
import { Stagger, StaggerItem } from '@/components/motion/Stagger';
import { productHref } from '@/lib/dcode/categories';
import type { SeoBreadcrumbItem } from '@/lib/seo/site';
import type { DcodeCategory, DcodeProduct } from '@/types/dcode';
import type { Locale } from '@/i18n/routing';

// Shared list view for a product family (TVs or Air Conditioners): breadcrumb, an
// h1 hero, and a responsive grid of product cards. The page supplies the data,
// localized labels, and JSON-LD.
type ProductListViewProps = {
  locale: Locale;
  category: DcodeCategory;
  products: DcodeProduct[];
  breadcrumbItems: SeoBreadcrumbItem[];
  labels: { eyebrow: string; title: string; tagline: string; viewProduct: string };
};

export default function ProductListView({
  locale,
  category,
  products,
  breadcrumbItems,
  labels,
}: ProductListViewProps) {
  const isLight = category === 'ac';

  return (
    <DcodeSection locale={locale}>
      <div className="mb-8">
        <Breadcrumb items={breadcrumbItems} locale={locale} />
      </div>

      <Reveal className="flex flex-col gap-3">
        <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-(--dcode-red)">
          <span className="h-1.5 w-1.5 rounded-full bg-(--dcode-red)" aria-hidden />
          {labels.eyebrow}
        </span>
        <h1 className="text-pretty text-3xl font-extrabold leading-tight text-(--dcode-text) sm:text-4xl lg:text-5xl">
          {labels.title}
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-(--dcode-text-muted) sm:text-lg">
          {labels.tagline}
        </p>
      </Reveal>

      <Stagger className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product, index) => (
          <StaggerItem key={product.id}>
            <ProductCard
              href={productHref(locale, category, product.id)}
              series={product.series}
              name={product.copy[locale].name}
              tagline={product.copy[locale].tagline}
              options={product.variants.map((variant) => variant.size).join(' · ')}
              image={product.heroImage}
              cta={labels.viewProduct}
              light={isLight}
              priority={index === 0}
            />
          </StaggerItem>
        ))}
      </Stagger>
    </DcodeSection>
  );
}
