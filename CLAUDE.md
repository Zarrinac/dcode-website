# D'code Website — Claude Code Guide

Standalone marketing site for the **D'code** TV brand (`dcode.co.ir`). D'code is a
separate brand from Hisense, with its own black/red identity and its own domain.
This project was extracted from the `zarrinac-website` repo (where D'code lived
under `/dcode`) so the brand can evolve independently; the parent site's
`zarrinac.com/dcode` section will 308-redirect here once this is live.

Stack: Next.js 16 App Router · React 19 · TypeScript 6 · PostgreSQL + Prisma 7 · next-intl · Tailwind CSS v4.

> The package is named `dcode` and the **dev server runs on port 3002** (not 3000/3001)
> so it can run alongside the Hisense (`3000`) and zarrinac (`3001`) sites locally.
>
> **Routing note:** in this standalone project the D'code landing is the site root
> (`/[locale]`) — the `/dcode` path prefix from the parent repo is dropped. D'code
> ships **two product families**, each its own sibling section: TVs
> (`/[locale]/tvs` + `/[locale]/tvs/[productId]`) and air conditioners
> (`/[locale]/air-conditioners` + `/[locale]/air-conditioners/[productId]`). Section
> slugs live in `lib/dcode/categories.ts` (`tv` → `tvs`, `ac` → `air-conditioners`);
> a detail page 404s when the product's category doesn't match its section.

## Primary Objective: SEO

SEO efficiency is the top priority, same as the parent project. When touching pages/components:

- Preserve/extend per-page `generateMetadata` (title, description, `alternates.canonical`, `alternates.languages` hreflang).
- Keep one — and only one — `<h1>` per page; semantic heading order (h1 → h2 → h3).
- Maintain JSON-LD: `Organization` + `WebSite` (global, in `components/seo/StructuredData.tsx`), `Brand` (landing), `CollectionPage`/`ItemList` (each family list), `WebPage` + `about` `Thing` (detail), `BreadcrumbList`. The list/detail JSON-LD builders are centralized in `lib/dcode/jsonld.ts` — reuse them for both families.
- **No `offers`/`Product` schema:** no prices are published, so the detail page uses `WebPage` + `about` `Thing` — NOT a schema.org `Product`. A price-less `Product` triggers Google's "Either offers, review, or aggregateRating should be specified" warning. Don't add a price-less Offer.
- Every `<Image>` needs descriptive, localized `alt`. Hero/LCP images use `priority`.
- Both `fa` and `en` must stay in sync — hreflang depends on it.
- Don't break ISR (`revalidate = 3600`) or the `app/sitemap.ts` / `app/robots.ts` routes.
- SEO infrastructure: `lib/seo/site.ts`, `components/seo/`, `app/sitemap.ts`, `app/robots.ts`.

## Commands

| Command                  | Purpose                                          |
| ------------------------ | ------------------------------------------------ |
| `npm run dev`            | Dev server at **http://localhost:3002**          |
| `npm run build`          | Production build                                 |
| `npm run start`          | Serve production build                           |
| `npm run lint`           | ESLint check                                     |
| `npm run format`         | Prettier format                                  |
| `npm run db:migrate`     | Apply Prisma migrations (dev)                    |
| `npm run db:deploy`      | Apply migrations (production)                    |
| `npm run db:seed`        | Seed D'code catalog (via `scripts/seed-all.mjs`) |
| `npm run db:seed:dcode`  | Seed D'code catalog only                         |
| `npm run media:optimize` | Rebuild the optimized `../media` mirror (sharp)  |

## Architecture

### Routing

- All public pages live under `app/[locale]/` — locales: `fa` (default, RTL), `en` (LTR)
- Root `app/page.tsx` redirects to `/fa`
- `app/[locale]/page.tsx` — brand landing (the site home); its full-bleed animated hero is `components/dcode/heroes/HeroDepthGrid.tsx` ("Depth Grid × Decoder", shared scaffolding in `heroShared.tsx`) — product-free by design, single `<h1>`, with `prefers-reduced-motion` fallbacks
- `app/[locale]/tvs/page.tsx` + `tvs/[productId]/page.tsx` — TV list + detail
- `app/[locale]/air-conditioners/page.tsx` + `air-conditioners/[productId]/page.tsx` — AC list + detail
- List/detail pages are thin wrappers around shared views (`components/dcode/ProductListView.tsx`, `ProductDetailView.tsx`) that work for both families — keep them generic, don't fork per category.
- All public pages are ISR (`revalidate = 3600`) with their own `generateMetadata` + JSON-LD.
- Page chrome (header + footer) is the slim D'code-branded shell in `components/shell/` (sticky header with desktop `MainNav` + `MobileNav` sheet).

### Data Sources (DB-first → static fallback)

The app runs without a database. If `DATABASE_URL` is absent, `lib/dcode/source.ts`
falls back to the bundled static catalog.

| Data            | Primary                                                   | Fallback                                       |
| --------------- | --------------------------------------------------------- | ---------------------------------------------- |
| D'code products | DB (`DcodeProduct` + `DcodeVariant` + `DcodeProductCopy`) | `DCODE_PRODUCTS` in `content/DcodeProducts.ts` |

The product model is **family-agnostic** (`types/dcode.ts`): `category: 'tv' | 'ac'`
plus a localized `attributes` spec sheet (`{ label, value }` per locale) instead of
TV-specific scalar columns. `lib/dcode/source.ts` exposes `getDcodeProducts`,
`getDcodeProductsByCategory(category)`, and `getDcodeProductById`. After changing the
Prisma schema, run `npx prisma generate` (and `npm run db:migrate` when a DB is
configured — the app otherwise runs on the static fallback).

Content source is toggled by `NEXT_PUBLIC_CONTENT_SOURCE` (`"local"` or `"remote"`).

### Brand identity

- `lib/dcode/brand.ts` (`DCODE_BRAND` — black `#0B0B0B` + red `#E30613` palette) and
  `components/dcode/dcodeTheme.ts` (`DCODE_THEME_STYLE`, `DCODE_BLEED_CLASS`). The
  whole site themes off these tokens (also mirrored as CSS vars in `globals.css`).
- The red is an approximation of the logo red — **verify against the official brand
  guideline before launch.**

### Key Directories

| Path          | Purpose                                                      |
| ------------- | ------------------------------------------------------------ |
| `app/`        | Pages, layouts, sitemap/robots generators                    |
| `components/` | `dcode/` (brand UI + `heroes/`), `shell/`, `seo/`, `motion/` |
| `lib/`        | DB client, media URLs, SEO helpers, `dcode/` data + brand    |
| `content/`    | Static fallback catalog (`DcodeProducts.ts`)                 |
| `messages/`   | Translation dictionaries — `fa.json` and `en.json`           |
| `prisma/`     | Prisma schema (D'code models) and migration history          |
| `types/`      | Shared TypeScript types (`dcode.ts`, `tv.ts`)                |
| `i18n/`       | next-intl routing config and request helpers                 |
| `scripts/`    | DB seed scripts                                              |

### Localization

- **Server components:** `getTranslations('Namespace')` → `t('key')`
- **Client components:** `useTranslations('Namespace')`
- Namespaces: `Shell` (header/footer/locale toggle), `DcodePage` (landing/tvs/detail)
- `fa.json` and `en.json` must always stay in sync
- Persian = RTL (`dir="rtl"`), English = LTR — test both locales when touching layout

### Media URLs

Always use `mediaUrl(path)` from `lib/mediaUrl.ts`. It switches between `/` (local)
and `NEXT_PUBLIC_MEDIA_BASE_URL` (CDN/server) based on env. D'code assets are
referenced via `dcodeAsset(path)` in `lib/dcode/brand.ts`. Never hardcode media paths.

## Code Conventions

### TypeScript

- Strict mode enabled — no `any` unless unavoidable
- Path alias `@/` maps to the repo root (e.g., `@/lib/db`, `@/components/seo/JsonLd`)
- Prisma client: always import the singleton from `lib/db.ts`, never `new PrismaClient()`

### Components

- Server components by default; add `'use client'` only when state/effects/browser APIs are required
- Feature-grouped under `components/`: `dcode/`, `shell/`, `seo/`

### Styling

- Tailwind v4 is loaded via `@import 'tailwindcss';` — **not** `@tailwind base/components/utilities`
- Custom theme tokens go inside `@theme {}` blocks in `globals.css`, not `tailwind.config`
- D'code palette is exposed as CSS vars (`bg-(--dcode-black)`, `text-(--dcode-text)`, etc.)

### Database

- JSON fields (`gallery`, `featureCards`, `remotes`, `specs`) are `Json` in Prisma — type-assert when reading
- Never call `prisma.$disconnect()` in route handlers/server components — only in seed scripts

## Non-Obvious Gotchas

1. **`withNextIntl()` must stay** — `next.config.ts` wraps the config with the next-intl plugin. Removing it silently breaks all locale routing.
2. **No `middleware.ts`** — i18n routing is handled by the next-intl plugin config. Do not create a `middleware.ts` — it conflicts with the plugin's own middleware.
3. **Tailwind v4 syntax** — `@theme {}` blocks in `globals.css`, `@import 'tailwindcss'` (not `@tailwind` directives).
4. **ISR and `cache: 'no-store'` don't mix** — public pages export `revalidate = 3600`; don't add `cache: 'no-store'` to fetches inside them.
5. **Locale validation throws** — `app/[locale]/layout.tsx` validates the locale against the allowlist in `i18n/routing.ts`. Add a new locale to `routing.ts` first.
6. **RTL flips layout** — Persian (fa) is RTL. Flex direction, padding/margin semantics, and text alignment reverse. Test both locales after touching layout.
7. **DB is primary, content is fallback** — `lib/dcode/source.ts` queries the DB first; `content/DcodeProducts.ts` is the emergency fallback, not the authoritative source.
8. **`db:seed` runs through an orchestrator** — `scripts/seed-all.mjs` keys success off each seed's completion sentinel rather than the exit code (Windows + tsx + pg teardown can exit non-zero after a successful commit).

## Environment Variables

| Variable                               | Required | Purpose                                                      |
| -------------------------------------- | -------- | ------------------------------------------------------------ |
| `DATABASE_URL`                         | Optional | PostgreSQL for Prisma; app runs on static fallback if absent |
| `NEXT_PUBLIC_SITE_URL`                 | Yes      | Canonical/OG base URL (e.g., `https://dcode.co.ir`)          |
| `NEXT_PUBLIC_MEDIA_BASE_URL`           | Optional | CDN/server base for media (defaults to `/`)                  |
| `NEXT_PUBLIC_CONTENT_SOURCE`           | Optional | `"local"` or `"remote"` content mode                         |
| `NEXT_PUBLIC_GA_ID`                    | Optional | Google Analytics measurement ID                              |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | Optional | Google Search Console token                                  |
| `NEXT_PUBLIC_BING_SITE_VERIFICATION`   | Optional | Bing Webmaster Tools token                                   |

Copy `.env.example` → `.env.local` to get started.

## Media Workflow

Media is **not committed to git** (mirroring hisense-ir.com / zarrinac.com). Heavy
renders, video, logos, and datasheets under `public/dcode/**` and `public/logos/*`
are gitignored — they live locally under `public/` for dev and are promoted to the
server from the sibling `../media` folder, served from `NEXT_PUBLIC_MEDIA_BASE_URL`
in production. Only the tiny SVG logo and root favicons/manifest stay committed, so
the app still builds without the media present.

`npm run media:optimize` (→ `scripts/optimize-media.mjs`, sharp) rebuilds the
`../media` mirror: raster images are re-encoded + downscaled (uniform, metadata
stripped) under their **original path/filename** so the content URLs resolve
identically in prod; svg/mp4/pdf are copied verbatim. Re-run it after adding assets.
Because the renders are now ignored, a freshly added image must be `git add`-ed only
if you intend to commit it (you usually don't) — and any render still tracked from
before must be `git rm --cached`-ed.

## Testing

- **No unit test framework** — correctness relies on TypeScript strict mode and ESLint
- **Pre-commit:** Husky + lint-staged runs `lint` and `format` on staged files — do not bypass with `--no-verify`

## Git

- Batch all changes from a task into one commit at the end — no per-fix micro-commits.

## graphify

This project has a knowledge graph at graphify-out/ once generated.

Rules:

- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
