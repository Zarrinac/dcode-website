# D'code Website

Standalone marketing site for the **D'code** TV brand — [dcode.co.ir](https://dcode.co.ir).

Extracted from the `zarrinac-website` repo (where D'code lived under `/dcode`) so the
brand can evolve on its own domain. Built with Next.js 16 (App Router) · React 19 ·
TypeScript · next-intl (fa/en) · Prisma 7 + PostgreSQL · Tailwind CSS v4.

See [CLAUDE.md](./CLAUDE.md) for the full architecture guide.

## Quick start

```bash
cp .env.example .env.local   # then edit values
npm install
npm run dev                  # http://localhost:3002
```

The app runs **without a database** — it falls back to the bundled catalog in
`content/DcodeProducts.ts`. To use Postgres, set `DATABASE_URL`, then:

```bash
npm run db:migrate
npm run db:seed
```

## Routes

| Path                        | Page          |
| --------------------------- | ------------- |
| `/[locale]`                 | Brand landing |
| `/[locale]/tvs`             | TV list       |
| `/[locale]/tvs/[productId]` | TV detail     |

Locales: `fa` (default, RTL) and `en` (LTR).

## Media

Media lives outside git in the sibling `../media` folder (staging for server
promotion). `public/dcode` is committed so local dev works out of the box.
