/**
 * Image optimization for the Pulse redesign.
 * Reads raw assets from tools/raw/ and writes web-optimized WebP + JPG
 * (and a transparent-background logo) into assets/img/.
 */
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const RAW = path.join(__dirname, 'raw');
const OUT = path.join(__dirname, '..', 'assets', 'img');
fs.mkdirSync(OUT, { recursive: true });

// Photos: { src, base, width } -> base.webp + base.jpg
const PHOTOS = [
  { src: 'grouppic.jpg',   base: 'coaches',        width: 1300 },
  { src: 'jenny_tina.png', base: 'consult',        width: 1000 },
  { src: 'snap.jpeg',      base: 'transformation', width: 900  },
  // client photos (before/after + portraits)
  { src: 'taylor.jpg',   base: 't-taylor',   width: 900 },
  { src: 'tiffany.jpg',  base: 't-tiffany',  width: 900 },
  { src: 'danielle.png', base: 't-danielle', width: 900 },
  { src: 'jamie.png',    base: 't-jamie',    width: 900 },
  { src: 'kim.png',      base: 't-kim',      width: 900 },
  { src: 'kelli.jpg',    base: 't-kelli',    width: 900 },
  { src: 'jill.png',     base: 't-jill',     width: 900 },
  { src: 'michelle.png', base: 't-michelle', width: 900 },
  { src: 'meredith.png', base: 't-meredith', width: 900 },
  { src: 'joe.jpg',      base: 't-joe',      width: 900 },
  { src: 'katrina.png',  base: 't-katrina',  width: 900 },
  { src: 'gina.png',     base: 't-gina',     width: 900 },
];

// Red caption graphics — kept as optional WebP fallback (we mostly render text)
const QUOTES = [
  'taylorquote','tiffanyquote','daniellequote','jamiequote','kimquote','kelliquote',
  'jillquote','michellequote','meredithquote','joequote','katrinaquote','ginaquote',
];

async function processPhoto({ src, base, width }) {
  const input = path.join(RAW, src);
  if (!fs.existsSync(input)) { console.warn('MISSING', src); return; }
  const pipeline = sharp(input).rotate().resize({ width, withoutEnlargement: true });
  await pipeline.clone().webp({ quality: 80 }).toFile(path.join(OUT, `${base}.webp`));
  await pipeline.clone().jpeg({ quality: 82, mozjpeg: true }).toFile(path.join(OUT, `${base}.jpg`));
  const w = fs.statSync(path.join(OUT, `${base}.webp`)).size;
  console.log(`${base.padEnd(16)} webp ${(w/1024).toFixed(0)}KB`);
}

async function processQuote(name) {
  const input = path.join(RAW, `${name}.png`);
  if (!fs.existsSync(input)) return;
  await sharp(input).resize({ width: 760, withoutEnlargement: true })
    .webp({ quality: 82 }).toFile(path.join(OUT, `q-${name.replace('quote','')}.webp`));
}

async function makeLogo() {
  // Trim white border, then key out near-white to transparent so the red wordmark
  // sits cleanly on both light and dark backgrounds.
  const trimmed = await sharp(path.join(RAW, 'logo.jpg'))
    .trim({ threshold: 20 })
    .resize({ width: 720, withoutEnlargement: true })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { data, info } = trimmed;
  const { width, height, channels } = info;
  for (let i = 0; i < data.length; i += channels) {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    // distance from white
    const minc = Math.min(r, g, b);
    if (r > 232 && g > 232 && b > 232) {
      data[i + 3] = 0; // fully transparent
    } else if (minc > 200) {
      // soft edge: partially transparent for light-gray anti-alias fringe
      data[i + 3] = Math.round(((255 - minc) / 55) * 255);
    }
  }
  await sharp(data, { raw: { width, height, channels } })
    .png().toFile(path.join(OUT, 'logo.png'));
  // small square favicon (padded)
  await sharp(data, { raw: { width, height, channels } })
    .resize({ width: 128, height: 128, fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png().toFile(path.join(OUT, 'favicon.png'));
  console.log('logo.png + favicon.png written', `${width}x${height}`);
}

(async () => {
  await makeLogo();
  for (const p of PHOTOS) await processPhoto(p);
  for (const q of QUOTES) await processQuote(q);
  console.log('\nDone. Output ->', OUT);
})().catch(e => { console.error(e); process.exit(1); });
