/* eslint-disable no-console */
// Build the production media mirror in the sibling ../media folder.
//
// D'code heavy media (product renders, logos, video, datasheets) is NOT committed
// to git — it lives locally under public/ for dev and is promoted to the server from
// ../media (mirroring hisense-ir.com / zarrinac.com). This script assembles that
// mirror with a uniform optimization pass:
//
//   • raster images (png/jpg/jpeg/webp) → re-encoded, metadata stripped, downscaled
//     to a max long-edge, kept under their ORIGINAL path + filename so the URLs the
//     content references resolve identically in prod (NEXT_PUBLIC_MEDIA_BASE_URL).
//   • everything else (svg/mp4/pdf/ico/manifest) → copied verbatim.
//
// Usage:
//   node scripts/optimize-media.mjs            # mirror public/dcode + public/logos → ../media
//   node scripts/optimize-media.mjs --webp     # additionally emit a .webp next to each raster
//
// Re-runnable and idempotent.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const MEDIA_ROOT = path.resolve(ROOT, '..', 'media');

const ALSO_WEBP = process.argv.includes('--webp');

// Folders under public/ to promote to ../media (preserving the leading folder).
const SOURCES = ['public/dcode', 'public/logos'];

// Long-edge caps by role so assets are uniform without upscaling small icons.
const MAX_EDGE = 2000; // product renders / logos
const RASTER = new Set(['.png', '.jpg', '.jpeg', '.webp']);
const COPY_AS_IS = new Set(['.svg', '.mp4', '.pdf', '.ico', '.webmanifest', '.json', '.txt']);

const stats = { optimized: 0, copied: 0, skipped: 0, bytesIn: 0, bytesOut: 0 };

function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}

async function optimizeRaster(srcAbs, destAbs, ext) {
  const input = sharp(srcAbs, { failOn: 'none' });
  const meta = await input.metadata();
  const longEdge = Math.max(meta.width ?? 0, meta.height ?? 0);
  const pipeline = sharp(srcAbs, { failOn: 'none' }).rotate();
  if (longEdge > MAX_EDGE) {
    pipeline.resize({
      width: meta.width >= meta.height ? MAX_EDGE : undefined,
      height: meta.height > meta.width ? MAX_EDGE : undefined,
      fit: 'inside',
      withoutEnlargement: true,
    });
  }

  // Re-encode in place to the original format, stripping metadata.
  if (ext === '.png') {
    await pipeline.png({ compressionLevel: 9, palette: true }).toFile(destAbs);
  } else if (ext === '.webp') {
    await pipeline.webp({ quality: 82 }).toFile(destAbs);
  } else {
    await pipeline.jpeg({ quality: 82, mozjpeg: true }).toFile(destAbs);
  }

  if (ALSO_WEBP && ext !== '.webp') {
    const webpDest = destAbs.replace(/\.(png|jpe?g)$/i, '.webp');
    await sharp(srcAbs, { failOn: 'none' })
      .rotate()
      .resize({ width: MAX_EDGE, height: MAX_EDGE, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 82 })
      .toFile(webpDest);
  }
}

async function run() {
  if (!fs.existsSync(MEDIA_ROOT)) fs.mkdirSync(MEDIA_ROOT, { recursive: true });
  console.log(`Mirroring media → ${MEDIA_ROOT}${ALSO_WEBP ? ' (+webp)' : ''}\n`);

  for (const source of SOURCES) {
    const srcRoot = path.resolve(ROOT, source);
    if (!fs.existsSync(srcRoot)) {
      console.warn(`! skip missing source: ${source}`);
      continue;
    }
    // ../media keeps the same leading folder name (dcode, logos).
    const leaf = path.basename(source);

    for (const srcAbs of walk(srcRoot)) {
      const rel = path.relative(srcRoot, srcAbs);
      const destAbs = path.join(MEDIA_ROOT, leaf, rel);
      fs.mkdirSync(path.dirname(destAbs), { recursive: true });

      const ext = path.extname(srcAbs).toLowerCase();
      const sizeIn = fs.statSync(srcAbs).size;
      stats.bytesIn += sizeIn;

      try {
        if (RASTER.has(ext)) {
          await optimizeRaster(srcAbs, destAbs, ext);
          stats.optimized += 1;
        } else if (COPY_AS_IS.has(ext)) {
          fs.copyFileSync(srcAbs, destAbs);
          stats.copied += 1;
        } else {
          fs.copyFileSync(srcAbs, destAbs);
          stats.copied += 1;
        }
        stats.bytesOut += fs.existsSync(destAbs) ? fs.statSync(destAbs).size : 0;
      } catch (err) {
        console.error(`  ✗ ${rel}: ${err.message}`);
        stats.skipped += 1;
      }
    }
  }

  const mb = (n) => (n / 1024 / 1024).toFixed(1);
  console.log(
    `\nDone — optimized ${stats.optimized}, copied ${stats.copied}, skipped ${stats.skipped}.`,
  );
  console.log(`Size: ${mb(stats.bytesIn)}MB → ${mb(stats.bytesOut)}MB`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
