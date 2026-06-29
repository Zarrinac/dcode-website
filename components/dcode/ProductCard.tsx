import Image from 'next/image';
import Link from 'next/link';
import { HiArrowRight } from 'react-icons/hi2';
import type { ImageSource } from '@/types/tv';

// List-page card for a single product (a TV line, an AC model). Shows the render, the
// series eyebrow, name, tagline, the available sizes/capacities, and a view CTA.
type ProductCardProps = {
  href: string;
  series: string;
  name: string;
  tagline: string;
  options: string; // e.g. '55" · 65" · 75"' or '30,000 BTU'
  image: ImageSource;
  imageAlt: string;
  cta: string;
  light?: boolean;
  priority?: boolean;
};

export default function ProductCard({
  href,
  series,
  name,
  tagline,
  options,
  image,
  imageAlt,
  cta,
  light = false,
  priority = false,
}: ProductCardProps) {
  return (
    <Link
      href={href}
      className="group flex flex-col overflow-hidden rounded-3xl border border-(--dcode-border) bg-(--dcode-surface) transition-[border-color,transform] duration-300 hover:-translate-y-1 hover:border-(--dcode-red) focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-(--dcode-red)"
    >
      <div
        className={`relative aspect-4/3 w-full overflow-hidden ${
          light ? 'dcode-stage' : 'bg-(--dcode-surface-muted)'
        }`}
      >
        <Image
          src={image}
          alt={imageAlt}
          fill
          priority={priority}
          className="object-contain p-5 transition-transform duration-500 ease-out group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-5 sm:p-6">
        <span className="text-xs font-semibold uppercase tracking-[0.3em] text-(--dcode-red)">
          {series}
        </span>
        <h2 className="text-lg font-bold text-(--dcode-text)">{name}</h2>
        <p className="text-sm leading-relaxed text-(--dcode-text-muted)">{tagline}</p>
        <p className="mt-2 text-xs font-semibold text-(--dcode-text-muted)" dir="ltr">
          {options}
        </p>
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
