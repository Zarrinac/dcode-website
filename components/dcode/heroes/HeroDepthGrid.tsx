'use client';

import { useEffect, useRef } from 'react';
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from 'framer-motion';
import { DCODE_BLEED_CLASS, DCODE_THEME_STYLE } from '@/components/dcode/dcodeTheme';
import {
  HeadlineReveal,
  heroContainer,
  heroRise,
  type HeroVariantProps,
} from '@/components/dcode/heroes/heroShared';

// Concept — "Depth Grid × Decoder". A minimal one-point-perspective grid (spokes +
// depth rings + intersection dots) implies structure and draws the eye inward. It sits
// faint by default; a red light follows the cursor and the grid RESOLVES brighter only
// where the light falls — the brand's "decoding" idea. Ambient breathing keeps it alive.
// Touch / reduced-motion: faint grid + a static centred glow, no tracking.

// ── Precomputed one-point-perspective geometry (constant, built once) ──────────
const VB = { w: 1600, h: 900 };
const CX = VB.w / 2;
const CY = VB.h / 2;
const RING_SCALES = [1, 0.6, 0.36, 0.21, 0.12];
const INNER = RING_SCALES[RING_SCALES.length - 1];

function buildGrid() {
  const perEdge = 7;
  const pts: { x: number; y: number }[] = [];
  for (let i = 0; i < perEdge; i++) pts.push({ x: (i / perEdge) * VB.w, y: 0 });
  for (let i = 0; i < perEdge; i++) pts.push({ x: VB.w, y: (i / perEdge) * VB.h });
  for (let i = 0; i < perEdge; i++) pts.push({ x: VB.w - (i / perEdge) * VB.w, y: VB.h });
  for (let i = 0; i < perEdge; i++) pts.push({ x: 0, y: VB.h - (i / perEdge) * VB.h });

  const at = (p: { x: number; y: number }, s: number) => ({
    x: CX + s * (p.x - CX),
    y: CY + s * (p.y - CY),
  });

  const spokes = pts.map((p) => ({ a: p, b: at(p, INNER) }));
  const rings = RING_SCALES.map((s) => ({
    x: CX - (s * VB.w) / 2,
    y: CY - (s * VB.h) / 2,
    w: s * VB.w,
    h: s * VB.h,
  }));
  const dots: { x: number; y: number }[] = [];
  pts.forEach((p) => RING_SCALES.forEach((s) => dots.push(at(p, s))));

  return { spokes, rings, dots };
}

const GRID = buildGrid();

function GridSvg({ strokeWidth = 1.1, dotR = 2.2 }: { strokeWidth?: number; dotR?: number }) {
  return (
    <svg
      viewBox={`0 0 ${VB.w} ${VB.h}`}
      preserveAspectRatio="xMidYMid slice"
      className="h-full w-full"
      aria-hidden
    >
      <g stroke="currentColor" fill="currentColor">
        {GRID.rings.map((r, i) => (
          <rect
            key={`r${i}`}
            x={r.x}
            y={r.y}
            width={r.w}
            height={r.h}
            fill="none"
            strokeWidth={strokeWidth}
          />
        ))}
        {GRID.spokes.map((l, i) => (
          <line
            key={`l${i}`}
            x1={l.a.x}
            y1={l.a.y}
            x2={l.b.x}
            y2={l.b.y}
            strokeWidth={strokeWidth}
          />
        ))}
        {GRID.dots.map((d, i) => (
          <circle key={`d${i}`} cx={d.x} cy={d.y} r={dotR} stroke="none" />
        ))}
      </g>
    </svg>
  );
}

// Fade the dead-centre (vanishing point) and the extreme edges so a mid "depth band" reads.
const DEPTH_MASK =
  'radial-gradient(circle at 50% 50%, transparent 4%, #000 22%, #000 70%, transparent 100%)';

export default function HeroDepthGrid({ locale, title, subtitle }: HeroVariantProps) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 150, damping: 24 });
  const sy = useSpring(my, { stiffness: 150, damping: 24 });

  useEffect(() => {
    const r = ref.current?.getBoundingClientRect();
    if (r) {
      mx.set(r.width / 2);
      my.set(r.height / 2);
    }
  }, [mx, my]);

  const glow = useMotionTemplate`radial-gradient(420px circle at ${sx}px ${sy}px, var(--dcode-red-glow), transparent 72%)`;
  const reveal = useMotionTemplate`radial-gradient(320px circle at ${sx}px ${sy}px, #000 0%, #000 34%, transparent 70%)`;

  const handleMove = reduce
    ? undefined
    : (e: React.PointerEvent<HTMLElement>) => {
        const r = e.currentTarget.getBoundingClientRect();
        mx.set(e.clientX - r.left);
        my.set(e.clientY - r.top);
      };

  return (
    <section
      ref={ref}
      onPointerMove={handleMove}
      dir={locale === 'fa' ? 'rtl' : 'ltr'}
      style={DCODE_THEME_STYLE}
      className={`${DCODE_BLEED_CLASS} relative isolate flex min-h-[78vh] items-center overflow-hidden bg-(--dcode-black) text-(--dcode-text) lg:min-h-[86vh]`}
      aria-labelledby="hero-title"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        {/* base centred glow so the headline always has a backdrop */}
        <div
          className="absolute left-1/2 top-1/2 h-176 w-176 max-w-[120vw] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-45 blur-3xl"
          style={{
            background: 'radial-gradient(closest-side, var(--dcode-red-glow), transparent 70%)',
          }}
        />

        {/* grid layers: depth-masked + slow ambient breathing */}
        <div
          className={`absolute inset-0 ${reduce ? '' : 'dcode-grid-breathe'}`}
          style={{ WebkitMaskImage: DEPTH_MASK, maskImage: DEPTH_MASK }}
        >
          {/* faint encoded grid (always on) */}
          <div className="absolute inset-0 text-(--dcode-red)/35">
            <GridSvg />
          </div>

          {/* bright grid that only resolves under the cursor light */}
          {!reduce && (
            <motion.div
              className="absolute inset-0"
              style={{ WebkitMaskImage: reveal, maskImage: reveal }}
            >
              <div
                className="absolute inset-0"
                style={{
                  color: 'rgba(255,90,100,0.95)',
                  filter: 'drop-shadow(0 0 5px var(--dcode-red-glow))',
                }}
              >
                <GridSvg strokeWidth={1.3} dotR={2.6} />
              </div>
            </motion.div>
          )}
        </div>

        {/* red light following the cursor */}
        {!reduce && <motion.div className="absolute inset-0" style={{ background: glow }} />}

        {/* edge vignettes */}
        <div className="absolute inset-x-0 top-0 h-28 bg-linear-to-b from-(--dcode-black) to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-44 bg-linear-to-t from-(--dcode-black) to-transparent" />
        <div className="absolute inset-y-0 left-0 w-24 bg-linear-to-r from-(--dcode-black) to-transparent" />
        <div className="absolute inset-y-0 right-0 w-24 bg-linear-to-l from-(--dcode-black) to-transparent" />
      </div>

      <motion.div
        variants={reduce ? undefined : heroContainer}
        initial={reduce ? undefined : 'hidden'}
        animate={reduce ? undefined : 'show'}
        className="mx-auto flex w-full max-w-5xl flex-col items-center gap-7 px-4 py-24 text-center sm:px-6 lg:px-10"
      >
        <HeadlineReveal title={title} />
        <motion.p
          variants={reduce ? undefined : heroRise}
          className="max-w-2xl text-base leading-relaxed text-(--dcode-text-muted) sm:text-lg"
        >
          {subtitle}
        </motion.p>
      </motion.div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-6 flex justify-center"
      >
        <span className="flex h-9 w-5 items-start justify-center rounded-full border border-(--dcode-border-strong) p-1.5">
          <span
            className={`size-1.5 rounded-full bg-(--dcode-text-muted) ${reduce ? '' : 'dcode-scroll-dot'}`}
          />
        </span>
      </div>
    </section>
  );
}
