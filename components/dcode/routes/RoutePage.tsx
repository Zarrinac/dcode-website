import type { ReactNode } from 'react';
import DcodeSection from '@/components/dcode/DcodeSection';
import Breadcrumb from '@/components/dcode/Breadcrumb';
import Reveal from '@/components/motion/Reveal';
import type { SeoBreadcrumbItem } from '@/lib/seo/site';
import type { Locale } from '@/i18n/routing';

// Shared scaffold for the D'code content/support pages: full-bleed dark section,
// breadcrumb trail, and a single <h1> hero (eyebrow → title → lead). Pages drop their
// body into `children`. Keeps every support page visually consistent and on-brand.
type RoutePageProps = {
  locale: Locale;
  eyebrow: string;
  title: string;
  description: string;
  breadcrumbItems: SeoBreadcrumbItem[];
  children: ReactNode;
};

export default function RoutePage({
  locale,
  eyebrow,
  title,
  description,
  breadcrumbItems,
  children,
}: RoutePageProps) {
  return (
    <DcodeSection locale={locale}>
      <div className="mb-8">
        <Breadcrumb items={breadcrumbItems} locale={locale} />
      </div>

      <Reveal className="flex max-w-3xl flex-col gap-3">
        <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-(--dcode-red)">
          <span className="h-1.5 w-1.5 rounded-full bg-(--dcode-red)" aria-hidden />
          {eyebrow}
        </span>
        <h1 className="text-pretty text-3xl font-extrabold leading-tight text-(--dcode-text) sm:text-4xl lg:text-5xl">
          {title}
        </h1>
        <p className="text-base leading-relaxed text-(--dcode-text-muted) sm:text-lg">
          {description}
        </p>
      </Reveal>

      <div className="mt-12">{children}</div>
    </DcodeSection>
  );
}
