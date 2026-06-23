import DcodeSection from '@/components/dcode/DcodeSection';
import Breadcrumb from '@/components/dcode/Breadcrumb';
import ProductShowcase, { type DcodeShowcaseLabels } from '@/components/dcode/ProductShowcase';
import type { SeoBreadcrumbItem } from '@/lib/seo/site';
import type { DcodeProduct } from '@/types/dcode';
import type { Locale } from '@/i18n/routing';

// Shared detail view for a single product (TV or AC): breadcrumb + the generic
// ProductShowcase, on the brand theme. The page supplies data, labels, and JSON-LD.
type ProductDetailViewProps = {
  locale: Locale;
  product: DcodeProduct;
  breadcrumbItems: SeoBreadcrumbItem[];
  labels: DcodeShowcaseLabels;
};

export default function ProductDetailView({
  locale,
  product,
  breadcrumbItems,
  labels,
}: ProductDetailViewProps) {
  return (
    <DcodeSection locale={locale} className="pt-8 pb-4">
      <Breadcrumb items={breadcrumbItems} locale={locale} />
      <ProductShowcase product={product} locale={locale} labels={labels} />
    </DcodeSection>
  );
}
