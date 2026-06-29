'use client';

// Generic brand-themed detail body for any D'code product (TV or AC). Driven entirely
// by the family-agnostic data model: a hero with a size/capacity selector, the active
// variant's box details, an icon feature grid, a localized spec sheet, and a gallery.
// Assumes it renders inside a page that already applies the D'code theme + container.
import { useState } from 'react';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { HiPlay } from 'react-icons/hi2';
import Reveal from '@/components/motion/Reveal';
import { Stagger, StaggerItem } from '@/components/motion/Stagger';
import SpecSheet from '@/components/dcode/SpecSheet';
import Gallery from '@/components/dcode/Gallery';
import { productImageAlt } from '@/lib/dcode/categories';
import type { DcodeLocale, DcodeProduct } from '@/types/dcode';

export type DcodeShowcaseLabels = {
  selectSize: string;
  model: string;
  specifications: string;
  highlights: string;
  keyFeatures: string;
  gallery: string;
  dimensionsWithStand: string;
  dimensionsWithoutStand: string;
  netWeight: string;
  watchVideo: string;
  close: string;
};

type ProductShowcaseProps = {
  product: DcodeProduct;
  locale: DcodeLocale;
  labels: DcodeShowcaseLabels;
};

const imageToSrc = (image: DcodeProduct['heroImage']): string =>
  typeof image === 'string' ? image : image.src;

export default function ProductShowcase({ product, locale, labels }: ProductShowcaseProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const reduce = useReducedMotion();
  const copy = product.copy[locale];
  const bullets = product.specs[locale] ?? [];
  const activeVariant = product.variants[activeIndex] ?? product.variants[0];
  const isLight = product.category === 'ac';
  const hasSelector = product.variants.length > 1;

  const attributes = product.attributes.map((attr) => ({
    label: attr.label[locale],
    value: attr.value[locale],
  }));

  const variantDetails = [
    { label: labels.model, value: activeVariant?.sku, ltr: true },
    { label: labels.dimensionsWithStand, value: activeVariant?.dimensionsWithStand, ltr: true },
    {
      label: labels.dimensionsWithoutStand,
      value: activeVariant?.dimensionsWithoutStand,
      ltr: true,
    },
    { label: labels.netWeight, value: activeVariant?.netWeight, ltr: true },
  ].filter((d) => Boolean(d.value));

  return (
    <div className="space-y-16 py-6 sm:py-10">
      {/* Hero */}
      <section className="grid items-center gap-10 lg:grid-cols-2">
        <Reveal className="space-y-5" from="right">
          <span className="inline-flex items-center gap-2 rounded-full border border-(--dcode-border) px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-(--dcode-red)">
            {product.series}
          </span>
          <h1 className="text-pretty text-3xl font-extrabold leading-tight text-(--dcode-text) sm:text-4xl lg:text-5xl">
            {copy.name}
          </h1>
          <p className="text-lg text-(--dcode-text-muted) sm:text-xl">{copy.tagline}</p>
          <p className="max-w-xl text-sm leading-relaxed text-(--dcode-text-muted) sm:text-base">
            {copy.description}
          </p>
          {product.heroVideo && (
            <a
              href={product.heroVideo}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-(--dcode-red) px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-(--dcode-red-hover) focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-(--dcode-red)"
            >
              <HiPlay aria-hidden className="size-4" />
              {labels.watchVideo}
            </a>
          )}
        </Reveal>

        <div className="relative">
          {/* Soft brand glow behind the product. */}
          <div
            aria-hidden
            className="dcode-glow pointer-events-none absolute inset-0 opacity-70 blur-2xl"
          />
          <div
            className={`relative aspect-4/3 w-full overflow-hidden rounded-3xl border border-(--dcode-border) ${
              isLight ? 'dcode-stage' : 'bg-(--dcode-surface)'
            }`}
          >
            <motion.div
              key={activeVariant?.sku}
              initial={reduce ? false : { opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0"
            >
              <Image
                src={activeVariant?.image ?? product.heroImage}
                alt={productImageAlt(locale, product, activeVariant?.size)}
                fill
                priority
                className="object-contain p-6"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Size / capacity selector + active variant details */}
      {activeVariant && (
        <section className="space-y-6">
          {hasSelector && (
            <>
              <h2 className="text-xs font-semibold uppercase tracking-[0.35em] text-(--dcode-text-muted)">
                {labels.selectSize}
              </h2>
              <div className="flex flex-wrap gap-3">
                {product.variants.map((variant, index) => {
                  const isActive = index === activeIndex;
                  return (
                    <button
                      key={variant.sku}
                      type="button"
                      onClick={() => setActiveIndex(index)}
                      aria-pressed={isActive}
                      className={`min-w-20 rounded-2xl border px-5 py-3 text-center transition-colors focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-(--dcode-red) ${
                        isActive
                          ? 'border-(--dcode-red) bg-(--dcode-red) text-white'
                          : 'border-(--dcode-border) bg-(--dcode-surface-muted) text-(--dcode-text) hover:border-(--dcode-red)'
                      }`}
                    >
                      <span className="block text-base font-bold" dir="ltr">
                        {variant.size}
                      </span>
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {variantDetails.length > 0 && (
            <div className="grid gap-4 rounded-3xl border border-(--dcode-border) bg-(--dcode-surface) p-6 sm:grid-cols-2 lg:grid-cols-4">
              {variantDetails.map((detail) => (
                <div
                  key={detail.label}
                  className="rounded-2xl border border-(--dcode-border) bg-(--dcode-black) p-4"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-(--dcode-text-muted)">
                    {detail.label}
                  </p>
                  <p
                    className="mt-1 text-sm font-semibold text-(--dcode-text)"
                    dir={detail.ltr ? 'ltr' : undefined}
                  >
                    {detail.value}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Feature cards */}
      {product.featureCards && product.featureCards.length > 0 && (
        <section className="space-y-6">
          <h2 className="text-xl font-bold text-(--dcode-text) sm:text-2xl">
            {labels.keyFeatures}
          </h2>
          <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {product.featureCards.map((card) => {
              const iconSrc = card.icon ? imageToSrc(card.icon) : null;
              return (
                <StaggerItem
                  key={card.title[locale]}
                  className="flex gap-4 rounded-3xl border border-(--dcode-border) bg-(--dcode-surface) p-6 transition-colors hover:border-(--dcode-border-strong)"
                >
                  {iconSrc ? (
                    <div className="relative h-12 w-16 shrink-0">
                      <Image
                        src={iconSrc}
                        alt=""
                        fill
                        aria-hidden
                        className="object-contain object-left"
                        sizes="64px"
                      />
                    </div>
                  ) : (
                    <span
                      className="mt-1.5 size-3 shrink-0 rounded-full bg-(--dcode-red)"
                      aria-hidden
                    />
                  )}
                  <div>
                    <h3 className="text-base font-bold text-(--dcode-text)">
                      {card.title[locale]}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-(--dcode-text-muted)">
                      {card.description[locale]}
                    </p>
                  </div>
                </StaggerItem>
              );
            })}
          </Stagger>
        </section>
      )}

      {/* Specifications + highlights */}
      {(attributes.length > 0 || bullets.length > 0) && (
        <section>
          <SpecSheet
            attributes={attributes}
            bullets={bullets}
            labels={{ specifications: labels.specifications, highlights: labels.highlights }}
          />
        </section>
      )}

      {/* Gallery */}
      {product.gallery && product.gallery.length > 0 && (
        <section className="space-y-6">
          <h2 className="text-xl font-bold text-(--dcode-text) sm:text-2xl">{labels.gallery}</h2>
          <Gallery
            images={product.gallery}
            alt={productImageAlt(locale, product)}
            light={isLight}
            closeLabel={labels.close}
          />
        </section>
      )}
    </div>
  );
}
