import Link from 'next/link';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi2';
import type { SeoBreadcrumbItem } from '@/lib/seo/site';
import type { Locale } from '@/i18n/routing';

// Visible breadcrumb trail (the matching BreadcrumbList JSON-LD is emitted separately
// by the page). The separator chevron points in the reading direction per locale.
export default function Breadcrumb({
  items,
  locale,
}: {
  items: SeoBreadcrumbItem[];
  locale: Locale;
}) {
  const Chevron = locale === 'fa' ? HiChevronLeft : HiChevronRight;

  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-1.5 text-xs font-semibold text-(--dcode-text-muted) sm:text-sm">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={item.href} className="flex items-center gap-1.5">
              {isLast ? (
                <span className="text-(--dcode-text)" aria-current="page">
                  {item.label}
                </span>
              ) : (
                <Link href={item.href} className="transition-colors hover:text-(--dcode-red)">
                  {item.label}
                </Link>
              )}
              {!isLast && <Chevron aria-hidden className="opacity-60" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
