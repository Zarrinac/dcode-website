'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { HiBars3, HiXMark } from 'react-icons/hi2';
import LocaleToggle from '@/components/shell/LocaleToggle';
import type { NavItem } from '@/components/shell/MainNav';
import type { Locale } from '@/i18n/routing';

// Mobile menu: a hamburger that opens an animated full-width sheet with the nav links
// and the locale toggle. Closes on route change, Escape, and backdrop tap.
type MobileNavProps = {
  items: NavItem[];
  locale: Locale;
  localeLabels: { fa: string; en: string };
  openLabel: string;
  closeLabel: string;
};

export default function MobileNav({
  items,
  locale,
  localeLabels,
  openLabel,
  closeLabel,
}: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const reduce = useReducedMotion();

  // Lock scroll + close on Escape while open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={openLabel}
        aria-expanded={open}
        className="inline-flex size-10 items-center justify-center rounded-full border border-(--dcode-border) text-(--dcode-text) transition-colors hover:border-(--dcode-red) focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-(--dcode-red)"
      >
        <HiBars3 className="size-6" aria-hidden />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-90 bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.2 }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              className="absolute inset-x-0 top-0 origin-top border-b border-(--dcode-border) bg-(--dcode-black) p-5 shadow-2xl"
              initial={{ y: reduce ? 0 : '-100%' }}
              animate={{ y: 0 }}
              exit={{ y: reduce ? 0 : '-100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 34 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-6 flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label={closeLabel}
                  className="inline-flex size-10 items-center justify-center rounded-full border border-(--dcode-border) text-(--dcode-text) transition-colors hover:border-(--dcode-red) focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-(--dcode-red)"
                >
                  <HiXMark className="size-6" aria-hidden />
                </button>
              </div>
              <nav className="flex flex-col gap-1">
                {items.map((item) => {
                  const isRoot = item.href.split('/').length <= 2;
                  const isActive = isRoot ? pathname === item.href : pathname.startsWith(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      aria-current={isActive ? 'page' : undefined}
                      className={`rounded-2xl px-4 py-3.5 text-lg font-semibold transition-colors ${
                        isActive
                          ? 'bg-(--dcode-surface) text-(--dcode-red)'
                          : 'text-(--dcode-text) hover:bg-(--dcode-surface)'
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
              <div className="mt-6 border-t border-(--dcode-border) pt-5">
                <LocaleToggle locale={locale} labels={localeLabels} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
