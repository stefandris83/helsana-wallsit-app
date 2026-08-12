/**
 * Erzeugt die App-Icons fuer den Startbildschirm (Android, iOS) nach `public/`.
 *
 * Aufruf: `npm run icons`
 *
 * Warum ein eigenes Skript: Im Projekt sind ausser dem Stack aus CLAUDE.md B.2
 * keine Bibliotheken zugelassen, und es liegt kein SVG-Konverter vor. Das Skript
 * rastert das Motiv daher selbst und schreibt PNG ausschliesslich mit
 * Node-Bordmitteln (`zlib`). Es laeuft nicht im Build mit; die erzeugten Dateien
 * sind eingecheckt und werden nur bei einer Aenderung des Motivs neu erzeugt.
 *
 * Motiv: vollflaechiges Helsana-Rot mit schwachem Verlauf (brand-400 nach
 * brand-600 aus `src/design/tokens.css`) und einem weissen Herz in der Mitte.
 */

import { deflateSync } from 'node:zlib';
import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const outDir = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'public');

/** Verlaufsfarben aus der Brand-Palette (tokens.css). */
const GRADIENT_FROM = [0xad, 0x0b, 0x49]; // --brand-400
const GRADIENT_TO = [0x7d, 0x1c, 0x3a]; // --brand-600
const HEART = [0xff, 0xff, 0xff];

/**
 * Implizite Herzkurve: (u^2 + v^2 - 1)^3 - u^2 * v^3 <= 0.
 * Die Kurve reicht von v = -1.26 (Spitze) bis v = 1.0 (Boegen), ist also um
 * -0.13 gegen die Mitte versetzt; das wird beim Zeichnen ausgeglichen.
 */
const HEART_SPAN = 2.26;
const HEART_OFFSET = -0.13;

function insideHeart(u, v) {
  const a = u * u + v * v - 1;
  return a * a * a - u * u * v * v * v <= 0;
}

/** 4x4-Ueberabtastung je Pixel, damit die Herzkante weich bleibt. */
const SAMPLES = 4;

function renderIcon(size, heartShare) {
  const pixels = Buffer.alloc(size * size * 4);
  const center = size / 2;
  const scale = (size * heartShare) / HEART_SPAN;

  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      let covered = 0;
      for (let sy = 0; sy < SAMPLES; sy += 1) {
        for (let sx = 0; sx < SAMPLES; sx += 1) {
          const px = x + (sx + 0.5) / SAMPLES;
          const py = y + (sy + 0.5) / SAMPLES;
          const u = (px - center) / scale;
          const v = (center - py) / scale + HEART_OFFSET;
          if (insideHeart(u, v)) covered += 1;
        }
      }
      const alpha = covered / (SAMPLES * SAMPLES);

      // Diagonaler Verlauf von oben links nach unten rechts.
      const t = (x / size + y / size) / 2;
      const offset = (y * size + x) * 4;
      for (let c = 0; c < 3; c += 1) {
        const background = GRADIENT_FROM[c] + (GRADIENT_TO[c] - GRADIENT_FROM[c]) * t;
        pixels[offset + c] = Math.round(background + (HEART[c] - background) * alpha);
      }
      pixels[offset + 3] = 0xff;
    }
  }
  return pixels;
}

/* ===== Minimaler PNG-Encoder (RGBA, 8 Bit, ohne Interlacing) ===== */

const CRC_TABLE = (() => {
  const table = new Int32Array(256);
  for (let n = 0; n < 256; n += 1) {
    let c = n;
    for (let k = 0; k < 8; k += 1) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c;
  }
  return table;
})();

function crc32(buffer) {
  let c = 0xffffffff;
  for (const byte of buffer) c = CRC_TABLE[(c ^ byte) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body), 0);
  return Buffer.concat([length, body, crc]);
}

function encodePng(size, pixels) {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; // Bittiefe
  ihdr[9] = 6; // Farbtyp RGBA
  // Kompression, Filter, Interlacing bleiben 0.

  // Jede Bildzeile bekommt ein fuehrendes Filterbyte (0 = None).
  const raw = Buffer.alloc((size * 4 + 1) * size);
  for (let y = 0; y < size; y += 1) {
    const target = y * (size * 4 + 1);
    raw[target] = 0;
    pixels.copy(raw, target + 1, y * size * 4, (y + 1) * size * 4);
  }

  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

/*
 * `maskable` schneidet Android je nach Geraeteform zu. Das Herz bleibt deshalb
 * innerhalb der sicheren Zone (mittlere 80 Prozent) und faellt kleiner aus.
 */
const icons = [
  { file: 'icon-192.png', size: 192, heartShare: 0.58 },
  { file: 'icon-512.png', size: 512, heartShare: 0.58 },
  { file: 'icon-maskable-512.png', size: 512, heartShare: 0.46 },
  { file: 'apple-touch-icon.png', size: 180, heartShare: 0.58 },
  { file: 'favicon-32.png', size: 32, heartShare: 0.62 },
];

mkdirSync(outDir, { recursive: true });
for (const icon of icons) {
  const png = encodePng(icon.size, renderIcon(icon.size, icon.heartShare));
  writeFileSync(resolve(outDir, icon.file), png);
  process.stdout.write(`${icon.file} (${icon.size}x${icon.size}, ${png.length} Bytes)\n`);
}
