# ops/ — server operations scripts

Canonical, version-controlled copies of the D'code production server's operational
scripts. The **live** copies run from outside the repo (so a `git pull` never rewrites
a script mid-execution); these are the source of truth — edit here, then sync to the server.

**First-time provisioning of a bare host is in [`SERVER_SETUP.md`](SERVER_SETUP.md).**
This file covers the scripts and the ongoing workflow.

**Server:** openSUSE Leap 16.0 host `DcodeSite` (`172.17.0.20`), user `reza`, app at
`/var/www/dcode/app`, served by PM2 (`dcode`, `ecosystem.config.cjs`) behind Apache.
D'code is **standalone**: its own dedicated **local** Postgres `dcode` DB on this host
(not the shared zarrin DB), domain `https://dcode.co.ir`, no `NEXT_PUBLIC_SITE_ID`, no
admin auth — so the preflight is slimmer than zarrinac's.

> **openSUSE Leap 16 differences vs. the zarrinac Ubuntu host:** `zypper` (not `apt`),
> `firewalld` (not `ufw`), Apache user `wwwrun:www` (not `www-data`) with control binary
> `apachectl` (no `apache2ctl`), and **SELinux enforcing** (NOT AppArmor) — the reverse
> proxy needs `setsebool -P httpd_can_network_connect 1`. Outbound SSH:22 is firewalled,
> so GitHub is reached via SSH-over-443 (`ssh.github.com:443` + `IPQoS none`). Full
> first-time detail + every gotcha is in [`SERVER_SETUP.md`](SERVER_SETUP.md).

## Workflow

Develop locally (Windows, port 3002) → push branch → PR → merge to `main` → server
pulls `main` → deploy. **The server only ever sits on `main` and only pulls — never
edit code directly on the server.** Deploy with:

```bash
ssh reza@172.17.0.20 /var/www/dcode/deploy.sh
```

## Files

| Repo file                          | Live location on server           | Purpose                                                                                                                                                                                      |
| ---------------------------------- | --------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ops/deploy.sh`                    | `/var/www/dcode/deploy.sh`        | `git pull` → malware scan → `preflight` → `npm ci` → `db:deploy` → clear `.next/cache` → media symlink → `build` → `pm2 reload`                                                              |
| `ops/preflight.mjs`                | (runs from deploy on the server)  | Env guard: asserts `NEXT_PUBLIC_SITE_URL=https://dcode.co.ir`, the local `dcode` DB target + port 5432 reachability, and that `.env`/`ecosystem.config.cjs` exist — without printing secrets |
| `ops/ecosystem.config.cjs.example` | → `ecosystem.config.cjs` (server) | PM2 process template; the real file (with the DB password) is gitignored, server-only                                                                                                        |
| `ops/sync-media.sh`                | `/usr/local/bin/sync-media.sh`    | Mirror staged media → live dir + fix owner/perms (`wwwrun:www`, `a+rX`)                                                                                                                      |
| `ops/upload-media.ps1`             | (runs on the Windows dev PC)      | scp upload + trigger `sync-media.sh` over ssh (key auth)                                                                                                                                     |
| `ops/cron/dcode-monitor.sh`        | `/usr/local/bin/dcode-monitor.sh` | Hourly health check piped to `claude -p`                                                                                                                                                     |
| `ops/cron/weekly-backup.sh`        | `/usr/local/bin/weekly-backup.sh` | Weekly lean backup: `pg_dumpall` + `/etc` + app secrets, keeps 4 weeks                                                                                                                       |

> Not committed: `ecosystem.config.cjs`, `.env` — they hold the DB password and are
> gitignored. Keep them only on the server. The husky hooks live in the repo root already.

## Syncing a changed script to the server

After a deploy pulls a change under `ops/`, copy the affected script to its live location:

```bash
cd /var/www/dcode/app

# Deploy script (outside the repo on purpose — bash reads a script as it runs, so
# letting `git pull` overwrite the executing file is unsafe).
cp ops/deploy.sh /var/www/dcode/deploy.sh
chmod +x /var/www/dcode/deploy.sh

# Media + cron scripts (need root to write /usr/local/bin)
sudo cp ops/sync-media.sh        /usr/local/bin/sync-media.sh
sudo cp ops/cron/dcode-monitor.sh /usr/local/bin/dcode-monitor.sh
sudo cp ops/cron/weekly-backup.sh /usr/local/bin/weekly-backup.sh
sudo chmod +x /usr/local/bin/sync-media.sh /usr/local/bin/dcode-monitor.sh /usr/local/bin/weekly-backup.sh
```

## Production env guard

`deploy.sh` runs `node ops/preflight.mjs` before migrations/build. It reads the server
`.env` without printing secret values and checks:

```bash
DATABASE_URL="postgresql://reza_sf:***@localhost:5432/dcode?schema=public"
NEXT_PUBLIC_SITE_URL="https://dcode.co.ir"
```

— that the DB host is local (`localhost`/`127.0.0.1`), the DB name is `dcode`, port 5432
is reachable, and `ecosystem.config.cjs` is present. Run it manually from the app dir
with `node ops/preflight.mjs`. (If the DB ever moves off-box, set `DCODE_DB_HOSTS` to the
allowed host list.)

## Media sync (local PC → server)

Media lives **outside git** (local `C:\Users\r.saberifard\Documents\IT-Hisense\dcode-website\media`,
server `/var/www/dcode/media`). The Next app runs as `reza` and reads media off disk to
optimize images — so the live dir **must be readable by `reza`**. `sync-media.sh` always
applies `chmod -R a+rX`, preventing the `EACCES` → 503 crash-loop.

**`public/media` symlink (required for `next/image`).** Browsers fetch raw media via
Apache's `Alias /media/ → /var/www/dcode/media/`, but `next/image`'s optimizer fetches
its _relative_ source (`NEXT_PUBLIC_MEDIA_BASE_URL=/media`) through an **internal request
to the Node server** (`:3000`), which has no `/media` route — so optimized images 400 with
`"received null"` unless the Node server can also read it off disk:

```bash
ln -s /var/www/dcode/media /var/www/dcode/app/public/media   # idempotent; deploy.sh recreates it
```

**One-time setup** (so `upload-media.ps1` runs unattended) and **usage** are in
`SERVER_SETUP.md` §6 / §11. From the Windows PC: `pwsh ops/upload-media.ps1` — it uses
Windows OpenSSH key auth (`~/.ssh/dcode_site_ed25519`, `BatchMode`), clears staging →
`scp` uploads → `ssh` runs `sudo sync-media.sh` (rsync `--delete` mirror + owner/perms).
Verify access with:
`ssh -i $HOME\.ssh\dcode_site_ed25519 -o BatchMode=yes reza@172.17.0.20 hostname`.

Tip: optimize images first — `npm run media:optimize` — since the upload mirrors with
`--delete` on the server.

## TLS / HTTPS

Apache terminates TLS for `dcode.co.ir` (+ `www`) and reverse-proxies to Next on `:3000`;
the `:80` vhost 301-redirects to HTTPS. Cert files live **outside git** under
`/etc/ssl/dcode/`:

| File                           | Perms           | Apache directive        |
| ------------------------------ | --------------- | ----------------------- |
| `/etc/ssl/dcode/fullchain.crt` | `644 root:root` | `SSLCertificateFile`    |
| `/etc/ssl/dcode/dcode.key`     | `600 root:root` | `SSLCertificateKeyFile` |

`fullchain.crt` is the **leaf + intermediates** concatenated in order (self-signed root
omitted — clients have it). This is a **manual** cert (NOT Let's Encrypt) → **renewal is
manual**; set a `/schedule` reminder ~2 weeks before expiry. The full vhost block and
verification curls are in `SERVER_SETUP.md` §7.

## Notes

- `dcode-monitor.sh` sources nvm and resolves `node`/`pm2`/`claude` dynamically, so it
  survives Node patch-version upgrades.
- `deploy.sh` runs as `reza` (never root): a root-owned `.next` breaks PM2.
- Keep the server tree clean — CRLF line-endings or uncommitted local edits to tracked
  `ops/` files can silently block `git pull` (a deploy then stalls many commits behind).
  Realign with `git reset --hard origin/main`.
- Deploy/DB/media workflow context also lives in the repo root `CLAUDE.md`.
