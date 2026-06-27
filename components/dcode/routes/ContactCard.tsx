import {
  HiOutlineClock,
  HiOutlineEnvelope,
  HiOutlineMapPin,
  HiOutlinePhone,
} from 'react-icons/hi2';
import { DCODE_CONTACT } from '@/lib/dcode/contact';
import type { Locale } from '@/i18n/routing';

// Reusable contact block reused across the support pages (FAQ, warranty, service,
// complaint, …). Pulls every value from the central DCODE_CONTACT config so the
// company's phone/email/address/hours are written once.
type ContactCardProps = {
  locale: Locale;
  title: string;
  description: string;
  callLabel: string;
};

export default function ContactCard({ locale, title, description, callLabel }: ContactCardProps) {
  const c = DCODE_CONTACT;
  const items = [
    {
      icon: HiOutlinePhone,
      value: c.phone.display[locale],
      dir: 'ltr' as const,
      href: `tel:${c.phone.tel}`,
    },
    { icon: HiOutlineEnvelope, value: c.email, dir: 'ltr' as const, href: `mailto:${c.email}` },
    { icon: HiOutlineMapPin, value: c.address[locale] },
    { icon: HiOutlineClock, value: c.hours[locale] },
  ];

  return (
    <div className="grid gap-6 rounded-3xl border border-(--dcode-border) bg-(--dcode-surface) p-6 sm:p-8 lg:grid-cols-[1.1fr_1fr] lg:items-center">
      <div>
        <h2 className="text-2xl font-bold text-(--dcode-text)">{title}</h2>
        <p className="mt-3 text-sm leading-relaxed text-(--dcode-text-muted)">{description}</p>
        <a
          href={`tel:${c.phone.tel}`}
          className="mt-5 inline-flex items-center gap-2 rounded-full bg-(--dcode-red) px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-(--dcode-red-hover)"
        >
          <HiOutlinePhone aria-hidden className="size-4" />
          {callLabel}
        </a>
      </div>

      <ul className="space-y-3">
        {items.map((item) => {
          const Icon = item.icon;
          const body = (
            <span className="flex items-start gap-3">
              <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-(--dcode-surface-muted) text-(--dcode-red)">
                <Icon aria-hidden className="size-4.5" />
              </span>
              <span className="text-sm leading-relaxed text-(--dcode-text-muted)" dir={item.dir}>
                {item.value}
              </span>
            </span>
          );
          return (
            <li key={item.value}>
              {item.href ? (
                <a href={item.href} className="block transition-colors hover:text-(--dcode-red)">
                  {body}
                </a>
              ) : (
                body
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
