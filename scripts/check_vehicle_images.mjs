import fs from 'node:fs';
import path from 'node:path';

const repoRoot = path.resolve(new URL('..', import.meta.url).pathname);
const registryPath = path.join(repoRoot, 'src/data/vehicle-images.json');
const publicRoot = path.join(repoRoot, 'public');
const images = JSON.parse(fs.readFileSync(registryPath, 'utf8'));
const allowedLicenses = new Set(['CC0 1.0', 'CC BY 4.0', 'CC BY-SA 4.0']);
const keys = new Set();

if (!Array.isArray(images) || images.length === 0) throw new Error('vehicle image registry is empty');
for (const image of images) {
  const key = `${image.maker}::${image.model}`;
  if (keys.has(key)) throw new Error(`duplicate vehicle image: ${key}`);
  keys.add(key);
  if (!image.src?.startsWith('/vehicles/') || !image.src.endsWith('.webp')) throw new Error(`image must be self-hosted WebP: ${key}`);
  const filePath = path.join(publicRoot, image.src.slice(1));
  if (!fs.existsSync(filePath)) throw new Error(`missing image asset: ${image.src}`);
  const bytes = fs.statSync(filePath).size;
  if (bytes > 250_000) throw new Error(`image exceeds 250KB budget (${bytes}): ${key}`);
  if (!Number.isInteger(image.width) || !Number.isInteger(image.height) || image.width > 1600 || image.height > 1200) throw new Error(`image dimensions are not optimized: ${key}`);
  for (const field of ['alt', 'note', 'author', 'authorUrl', 'license', 'licenseUrl', 'sourceUrl']) {
    if (typeof image[field] !== 'string' || image[field].trim() === '') throw new Error(`missing ${field}: ${key}`);
  }
  if (!image.sourceUrl.startsWith('https://commons.wikimedia.org/wiki/File:')) throw new Error(`source is not a Commons file page: ${key}`);
  if (!allowedLicenses.has(image.license)) throw new Error(`license is not approved: ${key}`);
  if (!image.licenseUrl.startsWith('https://creativecommons.org/')) throw new Error(`license URL is not canonical: ${key}`);
}

console.log(`vehicle images ${images.length} checked; PASS (self-hosted WebP <=250KB, Commons attribution recorded)`);
