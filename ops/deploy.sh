#!/bin/bash
# Canonical production deploy script for dcode.co.ir (source of truth in git).
#
# The LIVE copy runs from /var/www/dcode/deploy.sh — OUTSIDE the repo on purpose,
# so the pull never rewrites the script while it is executing. After pulling a
# change to this file, sync it to the live location:
#     cp /var/www/dcode/app/ops/deploy.sh /var/www/dcode/deploy.sh
#     chmod +x /var/www/dcode/deploy.sh
#
# Run as the app user (reza), NOT root — root-owned .next breaks PM2.
set -e

APP_DIR="${DCODE_APP_DIR:-/var/www/dcode/app}"
LOG_FILE="${DCODE_DEPLOY_LOG:-/var/log/dcode-deploy.log}"

# Fall back to a user-writable log if the default isn't writable. A failing
# `tee` under `set -e` aborts the whole deploy, so never let logging be fatal.
# One-time setup for the default path: sudo touch /var/log/dcode-deploy.log
#                                      sudo chown reza:users /var/log/dcode-deploy.log
if ! touch "$LOG_FILE" 2>/dev/null; then
  LOG_FILE="$HOME/dcode-deploy.log"
fi

log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"; }

# --- Toolchain on PATH (nvm) --------------------------------------------------
# node/npm/pm2 are installed via nvm, which is initialized in ~/.bashrc — a file
# that NON-interactive shells (cron, CI, `ssh host /var/www/dcode/deploy.sh`) do
# NOT source. Without this, an unattended deploy dies at the first node/npm call
# with "node: command not found"; it only appears to work when launched from an
# interactive login shell. Source nvm here so the script is self-sufficient
# however it's invoked.
export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
# shellcheck source=/dev/null
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh" >/dev/null 2>&1
command -v node >/dev/null 2>&1 || {
  echo "ERROR: node not found on PATH (nvm not loaded from $NVM_DIR)." >&2
  exit 127
}

log "=== Deploy started ==="
cd "$APP_DIR"
log "Toolchain: node $(node -v), npm $(npm -v), pm2 $(pm2 -v 2>/dev/null || echo '?')"

log "Pulling latest from GitHub..."
git pull origin main

# --- Integrity guard ---------------------------------------------------------
# Branch protection can't be enforced on a free private repo, so this is the
# backstop against a re-infection of origin/main (as happened on the sibling
# zarrinac/hisense repos): if a known malware signature appears in a build-time
# config file, abort BEFORE `npm run build` can execute it. The app keeps running
# on its last good build. postcss.config.mjs is the proven injection point and is
# essentially static, so this won't false-positive in normal use. Only scan the
# files that actually exist so a renamed config never makes the guard fail open.
log "Scanning build config for malware signatures..."
SCAN_FILES=()
for f in postcss.config.mjs next.config.ts; do
  [ -f "$f" ] && SCAN_FILES+=("$f")
done
if [ ${#SCAN_FILES[@]} -gt 0 ] && \
   grep -IlE 'createRequire\(|_\$_|\beval\(|Buffer\.from\([^)]*base64|global\.[A-Za-z_]+\s*=' \
     "${SCAN_FILES[@]}" 2>/dev/null; then
  log "!!! ABORT: suspicious code detected in build config — possible re-infection. Deploy halted."
  exit 1
fi

log "Running D'code deployment preflight..."
node ops/preflight.mjs

# Full install (NOT --omit=dev): building Next.js on the server needs
# devDependencies — typescript, @tailwindcss/postcss, and dotenv (loaded by
# prisma.config.ts during the prisma generate postinstall).
log "Installing dependencies..."
npm ci

log "Running DB migrations..."
npm run db:deploy

# Bust the persisted Next cache BEFORE building. `npm run build` preserves
# .next/cache across deploys, so a stale Data Cache and ISR full-route cache
# (revalidate 3600) keep serving PRE-deploy content after the code changes —
# e.g. the old product order, or a media URL the new code would now rewrite.
# Clearing it forces a fresh render against the live DB on first request.
# (Costs webpack/image cache warmth; correctness of freshly-deployed content wins.)
log "Clearing Next cache (.next/cache) to avoid serving stale content..."
rm -rf .next/cache

# Ensure public/media -> live media dir symlink exists.
# Media lives outside the app at /var/www/dcode/media and is served to browsers
# by the Apache `Alias /media/`. But next/image's optimizer fetches a *relative*
# source (NEXT_PUBLIC_MEDIA_BASE_URL=/media) via an INTERNAL request to the Node
# server (:3000), which has no /media route — so optimized images 400 with
# "received null" unless the Node server can also resolve /media. Symlinking it
# into public/ lets the optimizer read it off disk, independent of host/domain
# (works via raw IP and the live domain alike). Idempotent.
MEDIA_LIVE="${DCODE_MEDIA_DIR:-/var/www/dcode/media}"
if [ -d "$MEDIA_LIVE" ] && [ ! -e "$APP_DIR/public/media" ]; then
  log "Linking public/media -> $MEDIA_LIVE ..."
  ln -s "$MEDIA_LIVE" "$APP_DIR/public/media"
fi

log "Building Next.js..."
npm run build

log "Restarting PM2..."
pm2 reload ecosystem.config.cjs --update-env

log "=== Deploy complete ==="
