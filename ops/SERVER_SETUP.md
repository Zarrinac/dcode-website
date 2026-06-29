# D'code server bootstrap — fresh openSUSE Leap 16.0

One-time provisioning for the **DcodeSite** host (`172.17.0.20`, openSUSE Leap 16.0,
user `reza`). This box ships nothing pre-installed, so this runbook stands up the
whole stack: toolchain → local Postgres → app → PM2 → Apache (TLS) → firewall → cron.
After this is done, ongoing deploys are just `ssh reza@172.17.0.20 /var/www/dcode/deploy.sh`
(see `ops/README.md`).

> **openSUSE Leap 16 vs. the zarrinac/Ubuntu host** — the gotchas that actually bit
> during the first bring-up (2026-06-27):
>
> - Package manager is **`zypper`** (not `apt`); firewall is **`firewalld`** (not `ufw`).
> - Apache runs as **`wwwrun:www`** (not `www-data`); the control binary is
>   **`apachectl`** / `/usr/sbin/apachectl` (there is **no** `apache2ctl`).
> - **Leap 16's default LSM is SELinux (enforcing, `targeted`)** — NOT AppArmor. The
>   reverse proxy 503s with `(13)Permission denied … connect to 127.0.0.1:3000` until
>   you `setsebool -P httpd_can_network_connect 1` (§7). `getenforce`/`setsebool` aren't
>   installed by default — `zypper install policycoreutils`.
> - **`openssl` CLI is not preinstalled** (needed for the self-signed placeholder cert).
> - PostgreSQL's default `pg_hba.conf` uses **`ident`** for loopback → password auth
>   fails until switched to `scram-sha-256` (§2).
> - **Outbound SSH (port 22) is firewalled off**, so the GitHub deploy key only works
>   via **SSH-over-443** (`ssh.github.com:443`) **with `IPQoS none`** in `~/.ssh/config`
>   (§3). HTTPS egress (zypper, nodejs.org, github HTTPS) is fine.

Run everything below **as `reza`** (with `sudo` where shown). Never build/run the app as root.

---

## 0. Base packages

```bash
sudo zypper refresh
sudo zypper update -y
# git+rsync for deploy/media, curl for nvm, tar/gzip for backups, python3 for the
# monitor script, gcc-c++/make as a fallback toolchain for any native npm build.
# openssl (self-signed placeholder cert), policycoreutils (SELinux setsebool, §7b),
# cronie (crontab + cron daemon, §11) are NOT preinstalled on the minimal image.
sudo zypper install -y git rsync curl tar gzip python3 gcc-c++ make openssl policycoreutils cronie
```

## 1. Node toolchain (nvm + PM2)

node/npm are installed via **nvm** (the deploy + cron scripts source it from
`~/.nvm`). Do NOT `zypper install nodejs` — keep a single nvm-managed toolchain.

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
export NVM_DIR="$HOME/.nvm"; . "$NVM_DIR/nvm.sh"
nvm install 22          # Next 16 needs Node >= 18.18; 22 LTS is the safe default
nvm alias default 22
npm install -g pm2
node -v && npm -v && pm2 -v
```

## 2. PostgreSQL (local, dedicated `dcode` DB)

D'code runs its **own** Postgres on this host — no cross-host dependency.

```bash
sudo zypper install -y postgresql-server postgresql
sudo systemctl enable --now postgresql     # first start runs initdb into /var/lib/pgsql/data
```

Create the role + database (peer auth as `postgres` over the local socket):

```bash
sudo -u postgres psql <<'SQL'
CREATE USER reza_sf WITH PASSWORD 'CHANGE_ME_STRONG';
CREATE DATABASE dcode OWNER reza_sf;
SQL
```

Allow `reza_sf` to connect to `dcode` over loopback TCP (Prisma connects via
`localhost:5432`). **Leap 16's default `pg_hba.conf` uses `ident` for loopback**, which
makes password auth fail with `Ident authentication failed for user "reza_sf"`. Switch
the two generic loopback `host all all` rules from `ident` to `scram-sha-256`:

```bash
HBA=/var/lib/pgsql/data/pg_hba.conf
sudo cp "$HBA" "${HBA}.bak"
sudo sed -ri 's#^(host[[:space:]]+all[[:space:]]+all[[:space:]]+(127\.0\.0\.1/32|::1/128)[[:space:]]+)(ident|peer|trust|md5)#\1scram-sha-256#' "$HBA"
sudo grep -E '127\.0\.0\.1/32|::1/128' "$HBA"   # confirm both now say scram-sha-256
```

Keep `listen_addresses = 'localhost'` (the default) so the DB is never exposed off-box.
Then reload + sanity-check:

```bash
sudo systemctl reload postgresql
psql "postgresql://reza_sf:CHANGE_ME_STRONG@localhost:5432/dcode" -tAc "select current_user, current_database();"
```

## 3. App directory + repo

```bash
sudo mkdir -p /var/www/dcode/{app,media}
sudo chown -R reza:users /var/www/dcode
```

The repo is **private** (`Zarrinac/dcode-website`). Give the server its own read-only
**deploy key** on GitHub. **Outbound SSH on port 22 is blocked on this network**, so the
key must talk to GitHub over **SSH-over-443** (`ssh.github.com:443`), and that path needs
**`IPQoS none`** or the TCP connect fails with `Network is unreachable`:

```bash
ssh-keygen -t ed25519 -f ~/.ssh/dcode_github_deploy -N '' -C 'dcode-site-deploy'
cat ~/.ssh/dcode_github_deploy.pub
# → GitHub repo → Settings → Deploy keys → Add deploy key (read-only). Then:
cat >> ~/.ssh/config <<'CFG'
Host github-dcode
  HostName ssh.github.com
  Port 443
  User git
  IdentityFile ~/.ssh/dcode_github_deploy
  IdentitiesOnly yes
  IPQoS none
CFG
chmod 600 ~/.ssh/config
ssh -o StrictHostKeyChecking=accept-new -T github-dcode   # expect: "Hi Zarrinac/dcode-website! ..."
```

The GitHub repo root **is** the Next project (`package.json` at the top level), so clone
straight into `app/`:

```bash
cd /var/www/dcode
rm -rf app && git clone github-dcode:Zarrinac/dcode-website.git app
cd app && test -f package.json && echo "repo root OK"
```

## 4. Server env (`.env`) + PM2 config

Create `/var/www/dcode/app/.env` (gitignored; read by `prisma` during deploy **and** by
`next start`):

```bash
cat > /var/www/dcode/app/.env <<'ENV'
DATABASE_URL="postgresql://reza_sf:CHANGE_ME_STRONG@localhost:5432/dcode?schema=public"
NEXT_PUBLIC_SITE_URL="https://dcode.co.ir"
# PRODUCTION = "remote": mediaUrl() emits /media/* served off the live media dir.
# "local" (the dev default) would emit public-root /dcode,/logos and 404 on the server.
NEXT_PUBLIC_CONTENT_SOURCE="remote"
NEXT_PUBLIC_MEDIA_BASE_URL="/media"
# GA4 Measurement ID (public; ships in the client bundle). Build-time inlined, so it's
# baked by `npm run build` during deploy.sh — a runtime-only change won't take effect.
NEXT_PUBLIC_GA_ID="G-TM4KN9XCZZ"
ENV
chmod 600 /var/www/dcode/app/.env
```

> **Analytics & Search Console (already configured):** GA4 is wired through
> `NEXT_PUBLIC_GA_ID` above — Measurement ID `G-TM4KN9XCZZ`, a property under the
> **Zarrinac** GA account (D'code is a brand of the same company, not a separate
> account). The `Analytics` component auto-injects gtag whenever the var is set.
> Search Console ownership is a **DNS TXT Domain property** for `dcode.co.ir` (covers
> www + non-www / http + https; no meta tag or redeploy needed), and **Bing** is
> verified by _importing from GSC_ — so no `*_SITE_VERIFICATION` env vars are needed.
> Because `NEXT_PUBLIC_GA_ID` is build-time inlined, changing it requires a redeploy
> (`deploy.sh` rebuilds), not just a runtime env edit.

> **Media path gotcha (cost an hour the first time):** with `remote`, runtime images
> resolve as `/media/*`, but the **catalog DB also has `/dcode/*` and `/logos/*` baked
> in** by `dcodeAsset()` at seed time — those render as-is and must ALSO resolve. So
> `deploy.sh` symlinks all three into `public/` (`media`, `logos`, and each
> `media/dcode/*` subdir). And because `next start` caches the `public/` listing at
> boot, symlinks must exist **before** the process (re)starts — `deploy.sh` creates
> them pre-`pm2 reload`. If you add them by hand to a running app, `pm2 restart dcode`.

PM2 process config (also gitignored — holds the DB password). Start from the template:

```bash
cd /var/www/dcode/app
cp ops/ecosystem.config.cjs.example ecosystem.config.cjs
$EDITOR ecosystem.config.cjs        # set the same DATABASE_URL password
```

## 5. Load the DB from a local dump, then build

The whole `dcode` database is seeded from a **dump of the local dev DB** — it already
holds the catalog (2 products / 4 variants / 4 copies) **and** the ~918
`ServiceRepresentative` rows, plus Prisma's `_prisma_migrations` table. So restore it
into the **empty** `dcode` DB created in §2 — do **not** run `prisma migrate` first
(the dump recreates the tables itself; pre-creating them would make the restore error).

On the **dev PC**, create a fresh dump (gitignored under `backups/`):

```powershell
# from the repo root; uses the local DATABASE_URL password
$env:PGPASSWORD = '<local-dcode-password>'
& 'C:\Program Files\PostgreSQL\16\bin\pg_dump.exe' -h localhost -U reza_sf -d dcode `
    --no-owner --no-privileges -Fp -f "backups\dcode-$(Get-Date -Format yyyyMMdd).sql"
```

Copy it to the server and restore (over the SSH key from §3 / `ops/upload-media.ps1` host):

```powershell
scp -i $HOME\.ssh\dcode_site_ed25519 backups\dcode-YYYYMMDD.sql reza@172.17.0.20:/home/reza/
```

```bash
# on the server — restore into the empty dcode DB
DCODE='postgresql://reza_sf:CHANGE_ME_STRONG@localhost:5432/dcode'
psql "$DCODE" -v ON_ERROR_STOP=1 -f /home/reza/dcode-YYYYMMDD.sql
psql "$DCODE" -c 'SELECT count(*) FROM "ServiceRepresentative";'   # expect 918
```

Then install deps, confirm migrations are in sync, build, and start under PM2:

```bash
cd /var/www/dcode/app
npm ci                               # if it errors "lock file out of sync", run `npm install` instead
npm run db:deploy                    # no-op: _prisma_migrations came in with the dump
npm run build
pm2 start ecosystem.config.cjs && pm2 save
pm2 status                           # `dcode` should be `online` on :3000
curl -sS -o /dev/null -w '%{http_code}\n' http://127.0.0.1:3000/fa   # expect 200
```

> `npm ci` requires `package-lock.json` to be in sync with `package.json`. If the
> committed lock is stale (it was during first bring-up — `Missing @swc/helpers from
lock file`), `npm ci` refuses; use `npm install` once, then commit the regenerated
> lock so future `deploy.sh` runs (`npm ci`) work.

> To **refresh** the DB later (e.g. after editing the catalog locally), re-dump, scp,
> then on the server drop+recreate the DB or `psql -c '\i dump.sql'` into a clean one.
> Service-center rows ultimately originate from the zarrin DB (filtered
> `serviceKind IN ('tv','rac')`) — see [`dcode-db-service-centers`]; the local dump is
> just the convenient transport.

## 6. Media

Upload media from the dev PC (see `ops/README.md` → Media sync). The live dir is
`/var/www/dcode/media`; the optimizer also needs the `public/media` symlink, which
`deploy.sh` recreates idempotently. Create it now for the first run:

```bash
ln -s /var/www/dcode/media /var/www/dcode/app/public/media   # idempotent
```

## 7. Apache (reverse proxy + TLS)

```bash
sudo zypper install -y apache2
# Enable modules. On Leap these go into APACHE_MODULES in /etc/sysconfig/apache2 and
# need a RESTART (not just reload) to take effect — a2enmod alone won't load them.
sudo a2enmod rewrite proxy proxy_http headers ssl
sudo a2enflag SSL                    # enables the <IfDefine SSL> :443 listener
sudo systemctl enable --now apache2
```

> Without `rewrite`/`proxy`/`proxy_http`/`headers` loaded, the vhost below fails to
> start with `Invalid command 'RewriteEngine'` (or proxies 500). Confirm with
> `sudo /usr/sbin/apachectl -M | grep -E 'rewrite|proxy_http|headers|ssl'`.

**TLS cert** (manual — mirror zarrinac; NOT Let's Encrypt). Install the purchased
bundle for `dcode.co.ir`:

```bash
sudo mkdir -p /etc/ssl/dcode
sudo install -m 644 fullchain.crt /etc/ssl/dcode/fullchain.crt   # leaf + intermediates, root omitted
sudo install -m 600 dcode.key     /etc/ssl/dcode/dcode.key
sudo chown root:root /etc/ssl/dcode/*
```

> **No cert yet?** Use a self-signed placeholder so the :443 vhost works (browser
> warning) until the real bundle arrives — swapping it later is just replacing these two
> files + `systemctl reload apache2`. `openssl` is **not preinstalled** on Leap 16:
>
> ```bash
> sudo zypper install -y openssl
> sudo openssl req -x509 -newkey rsa:2048 -nodes \
>   -keyout /etc/ssl/dcode/dcode.key -out /etc/ssl/dcode/fullchain.crt \
>   -days 825 -subj "/CN=dcode.co.ir" \
>   -addext "subjectAltName=DNS:dcode.co.ir,DNS:www.dcode.co.ir"
> sudo chmod 600 /etc/ssl/dcode/dcode.key && sudo chmod 644 /etc/ssl/dcode/fullchain.crt
> ```

Create `/etc/apache2/vhosts.d/dcode.conf` (single file, both vhosts):

```apache
# :80 — redirect everything to HTTPS
<VirtualHost *:80>
    ServerName dcode.co.ir
    ServerAlias www.dcode.co.ir
    RewriteEngine On
    RewriteRule ^/?(.*)$ https://dcode.co.ir/$1 [R=301,L]
</VirtualHost>

<VirtualHost *:443>
    ServerName dcode.co.ir
    ServerAlias www.dcode.co.ir

    SSLEngine on
    SSLCertificateFile    /etc/ssl/dcode/fullchain.crt
    SSLCertificateKeyFile /etc/ssl/dcode/dcode.key

    # Serve heavy media straight off disk (bypasses Node). Must match
    # NEXT_PUBLIC_MEDIA_BASE_URL=/media and be readable by wwwrun (sync-media.sh sets a+rX).
    Alias /media/ /var/www/dcode/media/
    <Directory /var/www/dcode/media/>
        Require all granted
        Options -Indexes
    </Directory>

    # Everything else → Next on :3000. Exclude /media from the proxy.
    ProxyPreserveHost On
    ProxyPass        /media/ !
    ProxyPass        / http://127.0.0.1:3000/
    ProxyPassReverse / http://127.0.0.1:3000/

    # Forward the real scheme so Next builds https:// absolute URLs.
    RequestHeader set X-Forwarded-Proto "https"
</VirtualHost>
```

```bash
sudo /usr/sbin/apachectl -t && sudo systemctl restart apache2   # restart: picks up new modules + SSL flag
```

### 7b. SELinux — allow the reverse proxy (REQUIRED on Leap 16)

Leap 16 runs **SELinux enforcing** (`targeted`). The `httpd_t` domain may bind 80/443 but
is **denied connecting out to the Node backend on :3000** — the proxy 503s with
`(13)Permission denied … connect to 127.0.0.1:3000` in `/var/log/apache2/error_log`.
The tooling isn't installed by default. Flip the standard boolean persistently:

```bash
sudo zypper install -y policycoreutils
sudo /usr/sbin/setsebool -P httpd_can_network_connect 1
sudo /usr/sbin/getsebool httpd_can_network_connect           # -> ... --> on
# verify end-to-end through Apache (self-signed cert -> -k):
curl -skS -o /dev/null -w 'https /fa -> %{http_code}\n' --resolve dcode.co.ir:443:127.0.0.1 https://dcode.co.ir/fa
```

> When media is later synced into `/var/www/dcode/media`, if Apache 403s on `/media/*`,
> relabel it: `sudo /usr/sbin/restorecon -RF /var/www/dcode/media` (it should inherit
> `httpd_sys_content_t` from `/var/www` automatically).

### 7c. Renewing the TLS cert (manual, Certum DV)

The cert is a **purchased Certum DV** cert (NOT Let's Encrypt → no auto-renewal). It is
**short-lived (~6.5 months)** — the cert installed 2026-06-28 expires **2027-01-13**.
Renew/reissue with Certum, then swap the two files and reload Apache. Certum ships three
files (`*_cert.pem` = leaf, `*_bundle.pem` = chain incl. self-signed root, `*_private_key.pem`):

```bash
# On the dev PC: build fullchain = leaf + intermediates (drop the self-signed root),
# i.e. cert.pem + the two intermediate certs from bundle.pem. Then verify key⇄cert match:
#   openssl x509 -in fullchain.crt -noout -modulus | openssl md5
#   openssl rsa  -in dcode.key     -noout -modulus | openssl md5   # the two md5s must be equal
scp -i ~/.ssh/dcode_site_ed25519 fullchain.crt dcode.key reza@172.17.0.20:/home/reza/
```

```bash
# On the server: back up, install (root-owned, key 600), scrub copies, test, reload.
TS=$(date +%Y%m%d-%H%M%S)
sudo cp -a /etc/ssl/dcode/fullchain.crt /etc/ssl/dcode/fullchain.crt.bak.$TS
sudo cp -a /etc/ssl/dcode/dcode.key     /etc/ssl/dcode/dcode.key.bak.$TS
sudo install -m 644 -o root -g root /home/reza/fullchain.crt /etc/ssl/dcode/fullchain.crt
sudo install -m 600 -o root -g root /home/reza/dcode.key     /etc/ssl/dcode/dcode.key
shred -u /home/reza/dcode.key; rm -f /home/reza/fullchain.crt
sudo /usr/sbin/apachectl -t && sudo systemctl reload apache2
# Verify the swap took (expect the new notAfter + verify=0):
echo | openssl s_client -connect 127.0.0.1:443 -servername dcode.co.ir 2>/dev/null \
  | openssl x509 -noout -subject -issuer -dates
curl -sS -o /dev/null -w '%{http_code} verify=%{ssl_verify_result}\n' \
  --resolve dcode.co.ir:443:127.0.0.1 https://dcode.co.ir/fa            # 200 verify=0
```

> Cert + key are **secrets** — they live only under `/etc/ssl/dcode/` on the host, never in
> git. The `*.dcode.co.ir` wildcard (SAN also lists the apex `dcode.co.ir`) covers `www`.
> **Set a reminder for early January 2027** to renew before expiry — the cert is short-lived.

## 8. Firewall (firewalld)

```bash
sudo zypper install -y firewalld          # usually already present
sudo systemctl enable --now firewalld
sudo firewall-cmd --permanent --add-service=http --add-service=https
sudo firewall-cmd --reload
sudo firewall-cmd --list-services         # expect: ... http https ssh
```

## 9. Deploy script + logs (live copies outside the repo)

```bash
cp /var/www/dcode/app/ops/deploy.sh /var/www/dcode/deploy.sh
chmod +x /var/www/dcode/deploy.sh

# Deploy log must be writable by reza (a failing tee aborts the deploy under set -e)
sudo touch /var/log/dcode-deploy.log  && sudo chown reza:users /var/log/dcode-deploy.log
sudo touch /var/log/dcode-monitor.log && sudo chown reza:users /var/log/dcode-monitor.log
```

## 10. PM2 boot persistence

```bash
pm2 startup systemd        # prints a `sudo env PATH=... pm2 startup systemd -u reza ...` line — run it
pm2 save                   # snapshot the running process list (replayed at boot)
systemctl is-enabled pm2-reza   # → enabled
```

## 11. Media sync hook + cron (optional, mirrors zarrinac)

```bash
# Root-owned media sync + NOPASSWD rule so upload-media.ps1 runs unattended
sudo cp /var/www/dcode/app/ops/sync-media.sh /usr/local/bin/sync-media.sh
sudo chown root:root /usr/local/bin/sync-media.sh && sudo chmod 755 /usr/local/bin/sync-media.sh
echo 'reza ALL=(root) NOPASSWD: /usr/local/bin/sync-media.sh' | sudo tee /etc/sudoers.d/dcode-media
sudo chmod 440 /etc/sudoers.d/dcode-media

# Cron scripts
sudo cp /var/www/dcode/app/ops/cron/dcode-monitor.sh /usr/local/bin/dcode-monitor.sh
sudo cp /var/www/dcode/app/ops/cron/weekly-backup.sh /usr/local/bin/weekly-backup.sh
sudo chmod +x /usr/local/bin/dcode-monitor.sh /usr/local/bin/weekly-backup.sh

# cron is NOT installed by default on Leap 16 minimal — install + enable it, and
# pre-create the backup dir/log (weekly-backup.sh's mkdir runs as reza but /backup is root).
sudo zypper install -y cronie
sudo systemctl enable --now cron
sudo mkdir -p /backup
sudo touch /var/log/dcode-backup.log && sudo chown reza:users /var/log/dcode-backup.log

# Install the schedule (idempotent — replaces only our two lines):
( crontab -l 2>/dev/null | grep -vE 'dcode-monitor\.sh|weekly-backup\.sh'
  echo '0 * * * *  /usr/local/bin/dcode-monitor.sh'
  echo '0 3 * * 0  /usr/local/bin/weekly-backup.sh >> /var/log/dcode-backup.log 2>&1'
) | crontab -
crontab -l
```

> `dcode-monitor.sh` pipes stats to `claude -p`; the `claude` CLI isn't on the server, so
> it gracefully falls back to logging raw `df`/`free`/PM2 stats to `/var/log/dcode-monitor.log`.

(The `weekly-backup.sh` `pg_dumpall`/`tar /etc` steps and the monitor's `df/free` are
generic — they work the same on openSUSE.)

---

## Verify the whole stack

```bash
# Local app responds:
curl -sS -o /dev/null -w '%{http_code}\n' http://127.0.0.1:3000/fa            # 200
# TLS terminates + proxies (once DNS/host resolves, or via --resolve locally):
curl -sS -o /dev/null -w '%{http_code} verify=%{ssl_verify_result}\n' \
  --resolve dcode.co.ir:443:127.0.0.1 https://dcode.co.ir/fa                  # 200 verify=0
# :80 redirects to https:
curl -sS -o /dev/null -w '%{http_code}\n' --resolve dcode.co.ir:80:127.0.0.1 \
  http://dcode.co.ir/fa                                                       # 301
```

Public reachability also needs the **public DNS A-records** for `dcode.co.ir` + `www`
to point at this host, and ports **80/443 open through any upstream firewall/NAT**.

## Troubleshooting

- **503 from Apache with `(13)Permission denied … connect to 127.0.0.1:3000`** → SELinux
  (enforcing on Leap 16) is blocking the proxy. Fix: `sudo setsebool -P httpd_can_network_connect 1`
  (§7b). Tell it apart from a real backend outage: `curl localhost:3000/fa` returns 200
  but Apache still 503s. `getenforce` → `Enforcing` confirms SELinux is active.
- **502 from Apache** → Node isn't up (`pm2 status`, `pm2 logs dcode`).
- **Optimized images 400 "received null"** → the `public/media` symlink is missing or
  the live dir isn't world-readable. `deploy.sh` recreates the symlink; `sync-media.sh`
  applies `chmod -R a+rX`.
- **`node: command not found` in cron/unattended deploy** → nvm not sourced; the scripts
  already source `~/.nvm/nvm.sh`, so confirm nvm installed under `reza`'s `$HOME`.
- **Prisma can't connect** → check `pg_hba.conf` lines above and that the `.env` password
  matches the role; `node ops/preflight.mjs` will report the exact failure.
