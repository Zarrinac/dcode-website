import { HiCheck } from 'react-icons/hi2';
import Reveal from '@/components/motion/Reveal';

// Presentational spec sheet: a localized key/value attribute table plus a checklist of
// highlight bullets. Both inputs are pre-resolved to the current locale by the caller.
type SpecSheetProps = {
  attributes: { label: string; value: string }[];
  bullets: string[];
  labels: { specifications: string; highlights: string };
};

export default function SpecSheet({ attributes, bullets, labels }: SpecSheetProps) {
  return (
    <div className="grid gap-10 lg:grid-cols-2">
      {attributes.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-(--dcode-text) sm:text-2xl">
            {labels.specifications}
          </h2>
          <dl className="mt-5 overflow-hidden rounded-2xl border border-(--dcode-border)">
            {attributes.map((attr, i) => (
              <div
                key={attr.label}
                className={`flex items-start justify-between gap-4 px-4 py-3 text-sm sm:px-5 ${
                  i % 2 === 0 ? 'bg-(--dcode-surface)' : 'bg-(--dcode-surface-muted)'
                }`}
              >
                <dt className="shrink-0 font-medium text-(--dcode-text-muted)">{attr.label}</dt>
                <dd className="text-end font-semibold text-(--dcode-text)">{attr.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}

      {bullets.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-(--dcode-text) sm:text-2xl">{labels.highlights}</h2>
          <ul className="mt-5 grid gap-2.5">
            {bullets.map((bullet, i) => (
              <Reveal as="li" delay={Math.min(i * 0.03, 0.3)} key={bullet}>
                <span className="flex items-start gap-3 rounded-xl border border-(--dcode-border) bg-(--dcode-surface) px-4 py-3 text-sm text-(--dcode-text-muted)">
                  <HiCheck aria-hidden className="mt-0.5 size-4 shrink-0 text-(--dcode-red)" />
                  <span>{bullet}</span>
                </span>
              </Reveal>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
