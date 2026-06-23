'use client';

import { useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { HiXMark } from 'react-icons/hi2';
import type { ImageSource } from '@/types/tv';

// Product gallery: a responsive grid of renders with a click-to-enlarge lightbox.
// The lightbox traps Escape/backdrop dismissal and respects reduced-motion.
type GalleryProps = {
  images: ImageSource[];
  alt: string;
  light?: boolean;
  closeLabel: string;
};

export default function Gallery({ images, alt, light = false, closeLabel }: GalleryProps) {
  const [active, setActive] = useState<number | null>(null);
  const reduce = useReducedMotion();

  if (images.length === 0) return null;

  return (
    <>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {images.map((image, index) => (
          <button
            key={index}
            type="button"
            onClick={() => setActive(index)}
            aria-label={`${alt} — ${index + 1}`}
            className={`group relative aspect-4/3 overflow-hidden rounded-2xl border border-(--dcode-border) transition-colors hover:border-(--dcode-red) focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-(--dcode-red) ${
              light ? 'dcode-stage' : 'bg-(--dcode-surface-muted)'
            }`}
          >
            <Image
              src={image}
              alt={`${alt} ${index + 1}`}
              fill
              className="object-contain p-3 transition-transform duration-500 ease-out group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, 33vw"
            />
          </button>
        ))}
      </div>

      <AnimatePresence>
        {active !== null && (
          <motion.div
            className="fixed inset-0 z-100 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.2 }}
            onClick={() => setActive(null)}
            role="dialog"
            aria-modal="true"
            aria-label={alt}
          >
            <button
              type="button"
              onClick={() => setActive(null)}
              aria-label={closeLabel}
              className="absolute right-4 top-4 rounded-full border border-white/20 bg-black/40 p-2 text-white transition-colors hover:bg-(--dcode-red) focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <HiXMark className="size-6" aria-hidden />
            </button>
            <motion.div
              className={`relative aspect-4/3 w-full max-w-4xl overflow-hidden rounded-2xl ${
                light ? 'dcode-stage' : 'bg-(--dcode-surface)'
              }`}
              initial={{ scale: reduce ? 1 : 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: reduce ? 1 : 0.96, opacity: 0 }}
              transition={{ duration: reduce ? 0 : 0.25, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={images[active]}
                alt={`${alt} ${active + 1}`}
                fill
                className="object-contain p-6"
                sizes="(max-width: 1024px) 100vw, 80vw"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
