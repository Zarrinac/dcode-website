'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, useReducedMotion } from 'framer-motion';

// Desktop primary nav with an animated active-underline that slides between items as
// the route changes (the header lives in the layout, so this component persists).
export type NavItem = { href: string; label: string };

export default function MainNav({ items }: { items: NavItem[] }) {
  const pathname = usePathname();
  const reduce = useReducedMotion();

  // Longest matching href wins so /tvs/r6d highlights "TVs", and the bare locale
  // root only matches exactly (otherwise it would match everything).
  const activeHref = items
    .filter((item) => {
      const isRoot = item.href.split('/').length <= 2; // '/fa'
      return isRoot ? pathname === item.href : pathname.startsWith(item.href);
    })
    .sort((a, b) => b.href.length - a.href.length)[0]?.href;

  return (
    <nav className="hidden items-center gap-1 md:flex">
      {items.map((item) => {
        const isActive = item.href === activeHref;
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? 'page' : undefined}
            className={`relative rounded-full px-3.5 py-2 text-sm font-semibold transition-colors ${
              isActive
                ? 'text-(--dcode-text)'
                : 'text-(--dcode-text-muted) hover:text-(--dcode-text)'
            }`}
          >
            {item.label}
            {isActive && (
              <motion.span
                layoutId={reduce ? undefined : 'nav-underline'}
                className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-(--dcode-red)"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
