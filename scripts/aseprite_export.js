#!/usr/bin/env node
/**
 * Aseprite export helper – converts source .aseprite files into trimmed PNGs
 * using the FF-like 28-colour palette defined in web/assets/palette_fflike.json.
 *
 * Usage (from repo root):
 *   node scripts/aseprite_export.js path/to/file.aseprite
 *
 * Requires the Aseprite CLI binary in PATH or ASEPRITE_BIN env variable.
 */
const { execFileSync } = require('child_process');
const { readFileSync } = require('fs');
const { resolve, basename, dirname } = require('path');

const aseprite = process.env.ASEPRITE_BIN || 'aseprite';
const src = process.argv[2];
if (!src) {
  console.error('Usage: aseprite_export <file.aseprite>');
  process.exit(1);
}

const srcAbs = resolve(src);
const outDir = resolve(dirname(src), 'export');
const base = basename(src, '.aseprite');
const outPng = resolve(outDir, `${base}.png`);
const palette = resolve('web/assets/palette_fflike.json');

try {
  // ensure palette exists
  readFileSync(palette);
} catch {
  console.error('Palette file missing:', palette);
  process.exit(1);
}

const cmd = [
  '--batch', srcAbs,
  '--palette', palette,
  '--trim',
  '--save-as', outPng,
];

console.log('Exporting', srcAbs, '→', outPng);
execFileSync(aseprite, cmd, { stdio: 'inherit' }); 