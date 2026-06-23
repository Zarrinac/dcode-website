import Image from 'next/image';
import Link from 'next/link';
import { HiArrowRight } from 'react-icons/hi2';
import type { ImageSource } from '@/types/tv';

// Landing-page card for a whole product family (TVs, Air Conditioners). Links to that
// family's section. White products (the AC) render on a light "stage" so they read on
// the dark theme; dark products (TVs) sit on the surface tone.
type ProductFamilyCardProps = {
  href: string;
  eyebrow: string;
  title: string;
  description: string;
  image: ImageSource;
  imageAlt: string;
  cta: string;
  /** Render the product on the light stage surface (for white products). */
  light?: boolean;
  priority?: boolean;
};

export default function ProductFamilyCard({
  href,
  eyebrow,
  title,
  description,
  image,
  imageAlt,
  cta,
  light = false,
  priority = false,
}: ProductFamilyCardProps) {
  return (
    <Link
      href={href}
      className="group relative flex flex-col overflow-hidden rounded-3xl border border-(--dcode-border) bg-(--dcode-surface) transition-[border-color,transform] duration-300 hover:-translate-y-1 hover:border-(--dcode-red) focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-(--dcode-red)"
    >
      <div
        className={`relative aspect-16/10 w-full overflow-hidden ${
          light ? 'dcode-stage' : 'bg-(--dcode-surface-muted)'
        }`}
      >
        <Image
          src={image}
          alt={imageAlt}
          fill
          priority={priority}
          className="object-contain p-6 transition-transform duration-500 ease-out group-hover:scale-[1.04]"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        {/* Top sheen for depth on the dark cards. */}
        {!light && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-linear-to-b from-white/4 to-transparent"
          />
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-6 sm:p-7">
        <span className="text-xs font-semibold uppercase tracking-[0.3em] text-(--dcode-red)">
          {eyebrow}
        </span>
        <h3 className="text-xl font-bold text-(--dcode-text)">{title}</h3>
        <p className="text-sm leading-relaxed text-(--dcode-text-muted)">{description}</p>
        <span className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-(--dcode-text) transition-colors group-hover:text-(--dcode-red)">
          {cta}
          <HiArrowRight
            aria-hidden
            className="transition-transform duration-300 group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1"
          />
        </span>
      </div>
    </Link>
  );
}
