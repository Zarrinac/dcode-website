#!/bin/bash
# Server-side media sync: mirror the uploaded staging folder into the live media
# dir with the ownership + permissions the app needs.
#
# WHY THIS EXISTS: the Next app runs as `reza` and reads /media off disk to optimize
# images. If the live dir is left web-server-only / mode 700, `reza` gets EACCES and
# the app crash-loops (503). This script always sets a+rX so both reza (the Node app)
# and the Apache user can read it.
#
# NOTE: on openSUSE Leap, Apache runs as user `wwwrun`, group `www` (NOT Ubuntu's
# `www-data`). Override with MEDIA_OWNER if your host differs.
#
# Install (root-owned so a NOPASSWD sudoers rule for it is safe):
#   sudo cp /var/www/dcode/app/ops/sync-media.sh /usr/local/bin/sync-media.sh
#   sudo chown root:root /usr/local/bin/sync-media.sh && sudo chmod 755 /usr/local/bin/sync-media.sh
# Run (needs root):  sudo /usr/local/bin/sync-media.sh
set -euo pipefail

STAGING="${MEDIA_STAGING:-/home/reza/media/}"
LIVE="${MEDIA_LIVE:-/var/www/dcode/media/}"
MEDIA_OWNER="${MEDIA_OWNER:-wwwrun:www}"

if [ ! -d "$STAGING" ]; then
  echo "ERROR: staging dir '$STAGING' not found — upload your media there first (scp)." >&2
  exit 1
fi

echo "Mirroring $STAGING -> $LIVE ..."
# --delete makes LIVE an exact mirror of STAGING (propagates local deletions).
mkdir -p "$LIVE"
rsync -av --delete "$STAGING" "$LIVE"

echo "Setting ownership ($MEDIA_OWNER) and read perms (a+rX) ..."
chown -R "$MEDIA_OWNER" "$LIVE"
chmod -R a+rX "$LIVE"

# SELinux (enforcing on openSUSE Leap 16): newly written files may land with a context
# Apache's httpd_t can't read, causing 403s on /media/*. Relabel to the inherited
# httpd_sys_content_t. No-op on systems without SELinux/restorecon.
if command -v restorecon >/dev/null 2>&1; then
  echo "Relabeling SELinux context (restorecon) ..."
  restorecon -RF "$LIVE" || true
fi

echo "MEDIA SYNC DONE — $(find "$LIVE" -type f | wc -l) files in $LIVE"
