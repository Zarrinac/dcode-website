'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { HiChevronDown } from 'react-icons/hi2';

// Desktop primary nav. Two groups sit on opposite sides of the bar (justify-between):
//   • product families (TVs, Air Conditioners) — direct links
//   • About (direct link) + Support (a hover/click mega-menu)
// The home link is intentionally gone — the brand logo is the route home. An animated
// underline tracks the active item; RTL is handled by the header's `dir`.
export type NavItem = { href: string; label: string };
export type SupportItem = { href: string; label: string; description: string };

type MainNavProps = {
  primaryItems: NavItem[];
  aboutItem: NavItem;
  supportLabel: string;
  supportItems: SupportItem[];
};

function useActiveHref(hrefs: string[]) {
  const pathname = usePathname();
  return hrefs
    .filter((href) => {
      const isRoot = href.split('/').length <= 2; // '/fa'
      return isRoot ? pathname === href : pathname.startsWith(href);
    })
    .sort((a, b) => b.length - a.length)[0];
}

function NavLinkItem({ item, active }: { item: NavItem; active: boolean }) {
  const reduce = useReducedMotion();
  return (
    <Link
      href={item.href}
      aria-current={active ? 'page' : undefined}
      className={`relative rounded-full px-3.5 py-2 text-sm font-semibold transition-colors ${
        active ? 'text-(--dcode-text)' : 'text-(--dcode-text-muted) hover:text-(--dcode-text)'
      }`}
    >
      {item.label}
      {active && (
        <motion.span
          layoutId={reduce ? undefined : 'nav-underline'}
          className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-(--dcode-red)"
          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
        />
      )}
    </Link>
  );
}

export default function MainNav({
  primaryItems,
  aboutItem,
  supportLabel,
  supportItems,
}: MainNavProps) {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const activePrimary = useActiveHref([...primaryItems.map((i) => i.href), aboutItem.href]);
  const supportActive = supportItems.some((i) => pathname.startsWith(i.href));

  // Close on Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  const clearClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  };
  const scheduleClose = () => {
    clearClose();
    closeTimer.current = setTimeout(() => setOpen(false), 120);
  };

  return (
    <div className="hidden flex-1 items-center justify-between md:flex">
      <nav className="flex items-center gap-1" aria-label="Primary">
        {primaryItems.map((item) => (
          <NavLinkItem key={item.href} item={item} active={item.href === activePrimary} />
        ))}
      </nav>

      <nav className="flex items-center gap-1" aria-label="Secondary">
        <NavLinkItem item={aboutItem} active={aboutItem.href === activePrimary} />

        <div
          className="relative"
          onMouseEnter={() => {
            clearClose();
            setOpen(true);
          }}
          onMouseLeave={scheduleClose}
        >
          <button
            type="button"
            aria-haspopup="true"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className={`relative inline-flex items-center gap-1 rounded-full px-3.5 py-2 text-sm font-semibold transition-colors ${
              supportActive || open
                ? 'text-(--dcode-text)'
                : 'text-(--dcode-text-muted) hover:text-(--dcode-text)'
            }`}
          >
            {supportLabel}
            <HiChevronDown
              aria-hidden
              className={`size-4 transition-transform ${open ? 'rotate-180' : ''}`}
            />
            {supportActive && (
              <motion.span
                layoutId={reduce ? undefined : 'nav-underline'}
                className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-(--dcode-red)"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
          </button>

          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, y: reduce ? 0 : 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: reduce ? 0 : 8 }}
                transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-e-0 top-[calc(100%+0.75rem)] z-50 w-136 max-w-[90vw] rounded-2xl border border-(--dcode-border) bg-(--dcode-surface)/95 p-3 shadow-2xl backdrop-blur-xl"
                role="menu"
              >
                <ul className="grid grid-cols-2 gap-1">
                  {supportItems.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        role="menuitem"
                        onClick={() => setOpen(false)}
                        className="block rounded-xl px-3.5 py-3 transition-colors hover:bg-(--dcode-surface-muted)"
                      >
                        <span className="block text-sm font-semibold text-(--dcode-text)">
                          {item.label}
                        </span>
                        <span className="mt-1 block text-xs leading-relaxed text-(--dcode-text-faint)">
                          {item.description}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>
    </div>
  );
}
