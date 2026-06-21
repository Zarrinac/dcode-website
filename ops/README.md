# ops — deployment & server scripts (placeholder)

Deployment infrastructure for the standalone D'code site is **not set up yet**. This
folder mirrors the `ops/` convention from the parent `zarrinac-website` repo, where
canonical copies of all server scripts live in-repo as the source of truth and the
live copies run from outside the repo so a `git pull` never rewrites an executing
script.

When D'code gets its own host, port the relevant scripts here, e.g.:

- `deploy.sh` — `git pull` → preflight env guard → `npm ci` → `db:deploy` → clear
  `.next/cache` → `npm run build` → `pm2 reload`.
- `preflight.mjs` — assert required env (`NEXT_PUBLIC_SITE_URL=https://dcode.co.ir`,
  DB target, port reachability) without printing secrets.
- `upload-media.ps1` + `sync-media.sh` — promote `../media` to the server's live
  media dir (rsync `--delete`, then `chmod -R a+rX`).

Until then, see the parent repo's `ops/README.md` for the established patterns.

## Workflow (planned, mirrors zarrinac)

develop locally (Windows, port 3002) → push branch → PR → merge to `main` → server
pulls `main` → deploy. The server only ever sits on `main` and only pulls — never
edit code directly on the server.
