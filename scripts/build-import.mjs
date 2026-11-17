/**
 * Writes import/femzou-products.csv for Shopify's product importer.
 * Create the metafield definitions in docs/SHOPIFY-SETUP.md first, or Shopify
 * ignores the metafield columns.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as CAT from '../data/catalog.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const cell = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
const json = (v) => (v ? JSON.stringify(v) : '');
const faqFor = (cat) => (cat === 'face-care' ? CAT.faqs.face : cat === 'hair-care' ? CAT.faqs.hair : CAT.faqs.body).map(([q, a]) => ({ q, a }));
const M = (label, key) => `${label} (product.metafields.femzou.${key})`;

const head = [
  'Handle', 'Title', 'Body (HTML)', 'Vendor', 'Type', 'Tags', 'Published', 'Option1 Name', 'Option1 Value', 'Variant Inventory Tracker', 'Variant Inventory Qty', 'Variant Inventory Policy', 'Variant Fulfillment Service', 'Variant Price', 'Variant Compare At Price', 'Variant Requires Shipping', 'Variant Taxable', 'Status',
  M('Short title', 'short_title'), M('Subtitle', 'subtitle'), M('Size', 'size'), M('Category', 'category'), M('Helps with', 'helps_with'), M('Works for', 'works_for'), M('Ingredients', 'ingredients'), M('How to', 'how_to'), M('Free from', 'free_from'), M('FAQ', 'faq'), M('Routine', 'routine'), M('Also in', 'also_in'),
];
const rows = CAT.products.map((p) => [
  p.handle, p.title, `<p>${p.desc}</p>`, 'FemZou', p.type, [p.cat, ...p.concerns, ...(p.pro ? ['professional'] : []), ...(p.best ? ['bestseller'] : [])].join(', '), 'TRUE', 'Title', 'Default Title', '', '', 'deny', 'manual', p.price, p.mrp > p.price ? p.mrp : '', 'TRUE', 'TRUE', 'draft',
  p.short || '', p.sub, p.size, p.cat, json(p.helps), json(p.works), json(p.ingredients), json(p.how), json(p.free.length ? p.free : null), json(faqFor(p.cat)), json(p.routine), json(p.also),
]);
const out = path.join(ROOT, 'import/femzou-products.csv');
fs.writeFileSync(out, `${[head, ...rows].map((r) => r.map(cell).join(',')).join('\n')}\n`);
console.log(`  ${rows.length} products -> ${path.relative(ROOT, out)}`);
