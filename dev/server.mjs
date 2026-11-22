/**
 * Local Shopify emulator for the FemZou theme.
 *
 * Express + LiquidJS standing in for Shopify's object graph, filters, tags and
 * /cart/*.js API, so the theme can be built and reviewed with no store attached.
 *
 *   npm run dev   ->  http://localhost:3820
 *
 * Two LiquidJS traps are handled deliberately (both fail silently):
 *   1. custom block tags use generator `*render`, never `async render`;
 *   2. `{% render %}` isolates scope, so Shopify globals go in renderOptions.globals.
 */
import express from 'express';
import { Liquid } from 'liquidjs';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as CAT from '../data/catalog.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const THEME = path.join(ROOT, 'theme');
const PORT = process.env.PORT || 3820;

const INR = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 });
const money = (paise) => `₹${INR.format(Math.round(Number(paise || 0) / 100))}`;
const field = (value) => ({ value });

/* ------------------------------ products ------------------------------ */
/* supplied photos, in gallery order (scripts/import-photos.py); everything else stays a placeholder */
const PHOTOS = fs.existsSync(path.join(ROOT, 'data/images.json')) ? JSON.parse(fs.readFileSync(path.join(ROOT, 'data/images.json'), 'utf8')) : {};
const imagesFor = (handle) => (PHOTOS[handle] || []).map((im, k) => {
  const img = { id: k + 1, position: k + 1, src: `/media/${handle}/${im.file}`, alt: im.alt, width: 1254, height: 1254, aspect_ratio: 1 };
  return { ...img, media_type: 'image', preview_image: img };
});
const faqFor = (cat) => (cat === 'face-care' ? CAT.faqs.face : cat === 'hair-care' ? CAT.faqs.hair : CAT.faqs.body);
const products = CAT.products.map((p, i) => {
  const id = 1000 + i;
  const variant = {
    id: id * 100 + 1, title: 'Default Title', option1: 'Default Title',
    price: p.price * 100,
    compare_at_price: p.mrp > p.price ? p.mrp * 100 : null,
    available: true,
    url: `/products/${p.handle}?variant=${id * 100 + 1}`,
  };
  return {
    id, handle: p.handle, title: p.title, vendor: 'FemZou', type: p.type,
    url: `/products/${p.handle}`, available: true,
    description: `<p>${p.desc}</p>`,
    tags: [p.cat, ...p.concerns, ...(p.pro ? ['professional'] : [])],
    variants: [variant], first_available_variant: variant, selected_or_first_available_variant: variant,
    has_only_default_variant: true,
    price: variant.price, price_min: variant.price, compare_at_price: variant.compare_at_price,
    ...(() => { const media = imagesFor(p.handle); const images = media.map((m) => m.preview_image); return { images, media, featured_image: images[0] || null, featured_media: media[0] || null }; })(),
    metafields: {
      femzou: {
        short_title: field(p.short || null),
        subtitle: field(p.sub), size: field(p.size), category: field(p.cat),
        helps_with: field(p.helps), works_for: field(p.works),
        ingredients: field(p.ingredients), how_to: field(p.how), free_from: field(p.free.length ? p.free : null),
        faq: field(faqFor(p.cat).map(([q, a]) => ({ q, a }))),
        routine: field(p.routine || null), also_in: field(p.also || null),
      },
      reviews: { rating: field(null), rating_count: field(null) },
    },
  };
});
const P = (h) => products.find((x) => x.handle === h);
const variantById = new Map(products.flatMap((p) => p.variants.map((v) => [v.id, { product: p, variant: v }])));

/* ----------------------------- collections ---------------------------- */
const collections = {};
function mkCollection(handle, title, list, line = '') {
  collections[handle] = {
    id: Object.keys(collections).length + 1, handle, title, url: `/collections/${handle}`,
    products: list, products_count: list.length, all_products_count: list.length,
    all_types: [...new Set(list.map((p) => p.type))],
    description: line ? `<p>${line}</p>` : '', image: null, featured_image: null,
  };
}
const src = (fn) => CAT.products.filter(fn).map((p) => P(p.handle));
mkCollection('all', 'Shop All', products, 'The full FemZou range, for face, hair and body.');
for (const c of CAT.categories) mkCollection(c.handle, c.title, src((p) => p.cat === c.handle), c.line);
for (const c of CAT.concerns) mkCollection(c.handle, c.title, src((p) => p.concerns.includes(c.handle)), c.line);
mkCollection('professional', 'FemZou Professional', src((p) => p.pro), 'Salon-strength hair care for the professional chair and the home.');
mkCollection('bestsellers', 'Bestsellers', src((p) => p.best), 'The formulas people keep coming back for.');
mkCollection('body-lotions', 'Body Lotions', src((p) => p.type === 'Body Lotion'), 'Four fruit scents, one soft finish.');

/* -------------------------------- blog -------------------------------- */
const articles = CAT.articles.map((a, i) => ({
  id: i + 1, handle: a.handle, title: a.title, url: `/blogs/skin-notes/${a.handle}`, excerpt: a.excerpt,
  content: a.body.map((b) => `<p>${b}</p>`).join(''), tags: [], published_at: '2026-11-01', author: 'FemZou', image: null,
  metafields: { femzou: { read_minutes: field(a.read) } },
}));
const blogs = { 'skin-notes': { handle: 'skin-notes', title: 'Skin Notes', url: '/blogs/skin-notes', articles, articles_count: articles.length } };

/* -------------------------------- cart -------------------------------- */
const cart = { items: [], item_count: 0, total_price: 0, original_total_price: 0, total_discount: 0, currency: 'INR', note: '' };
function recalc() {
  cart.items.forEach((i) => { i.line_price = i.price * i.quantity; i.final_line_price = i.line_price; });
  cart.item_count = cart.items.reduce((n, i) => n + i.quantity, 0);
  cart.total_price = cart.items.reduce((n, i) => n + i.line_price, 0);
  cart.original_total_price = cart.total_price;
}
function addToCart(id, quantity = 1) {
  const rec = variantById.get(Number(id));
  if (!rec) return null;
  const { product, variant } = rec;
  let line = cart.items.find((i) => i.variant_id === variant.id);
  if (line) line.quantity += quantity;
  else {
    line = {
      key: `${variant.id}:fz`, id: variant.id, variant_id: variant.id, product_id: product.id, handle: product.handle,
      product_title: product.title, variant_title: null, title: product.title, quantity, price: variant.price,
      original_price: variant.price, url: product.url, image: product.featured_image?.src || null,
      properties: {}, options_with_values: [], product_type: product.type,
    };
    cart.items.push(line);
  }
  recalc();
  return line;
}
function changeCart(key, quantity) {
  const i = typeof key === 'number' && key < 1000 ? key - 1 : cart.items.findIndex((x) => x.key === key || String(x.variant_id) === String(key));
  if (i < 0 || !cart.items[i]) return;
  if (quantity <= 0) cart.items.splice(i, 1); else cart.items[i].quantity = quantity;
  recalc();
}

/* ------------------------------- engine ------------------------------- */
const engine = new Liquid({
  root: ['sections', 'snippets', 'templates', 'layout'].map((d) => path.join(THEME, d)),
  extname: '.liquid', cache: false, jsTruthy: true, strictFilters: false, strictVariables: false,
});
const F = engine.registerFilter.bind(engine);
const handleize = (v) => String(v || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
F('asset_url', (v) => `/assets/${v}`);
F('stylesheet_tag', (v) => `<link rel="stylesheet" href="${v}">`);
F('script_tag', (v) => `<script src="${v}" defer></script>`);
F('image_url', (img) => (typeof img === 'string' ? img : img?.src || ''));
/* keyword arguments arrive as [key, value] pairs, as in Shopify's image_tag */
F('image_tag', (url, ...args) => {
  const a = Object.fromEntries(args.filter(Array.isArray));
  const esc = (v) => String(v ?? '').replace(/"/g, '&quot;');
  return `<img src="${url}" alt="${esc(a.alt)}"${a.class ? ` class="${esc(a.class)}"` : ''}${a.sizes ? ` sizes="${esc(a.sizes)}"` : ''} loading="${esc(a.loading || 'lazy')}" width="1254" height="1254">`;
});
F('money', money);
F('money_without_trailing_zeros', money);
/* Shopify INR: 28000 -> "280.00", 103900 -> "1,039.00" */
F('money_without_currency', (c) => (Number(c || 0) / 100).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
F('handle', handleize);
F('handleize', handleize);
F('json', (v) => JSON.stringify(v));
F('t', (v) => String(v));
F('strip_html', (s) => String(s || '').replace(/<[^>]*>/g, ''));
F('date', (v, fmt) => {
  const d = v === 'now' || v === 'today' ? new Date() : new Date(v);
  if (isNaN(d)) return String(v || '');
  const M = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return String(fmt || '%-d %b %Y').replace('%Y', d.getFullYear()).replace('%b', M[d.getMonth()]).replace('%d', String(d.getDate()).padStart(2, '0')).replace('%-d', d.getDate());
});
F('within', (url) => url);
F('default_errors', () => '');
F('payment_type_svg_tag', () => '');

const skipBlock = (name) => engine.registerTag(name, {
  parse(t, remain) { while (remain.length) { const x = remain.shift(); if (x.name === `end${name}`) return; } },
  render() { return ''; },
});
['schema', 'javascript', 'stylesheet'].forEach(skipBlock);

const wrapTag = (name, open, close) => engine.registerTag(name, {
  parse(token, remain) {
    this.args = token.args; this.tpls = [];
    const s = this.liquid.parser.parseStream(remain);
    s.on(`tag:end${name}`, function () { this.stop(); }).on('template', (t) => this.tpls.push(t))
      .on('end', () => { throw new Error(`{% ${name} %} not closed`); });
    s.start();
  },
  *render(ctx, emitter) {
    emitter.write(open(this.args));
    yield this.liquid.renderer.renderTemplates(this.tpls, ctx, emitter);
    emitter.write(close);
  },
});
wrapTag('style', () => '<style>', '</style>');
wrapTag('form', (args) => {
  const kind = (args.split(',')[0] || '').trim().replace(/^['"]|['"]$/g, '');
  const action = { product: '/cart/add', cart: '/cart', customer: '/contact', contact: '/contact' }[kind] || '/';
  const cls = (args.match(/class:\s*['"]([^'"]+)['"]/) || [])[1] || '';
  return `<form method="post" action="${action}" accept-charset="UTF-8" class="${cls}" data-form="${kind}">`;
}, '</form>');

engine.registerTag('paginate', {
  parse(token, remain) {
    this.args = token.args; this.tpls = [];
    const s = this.liquid.parser.parseStream(remain);
    s.on('tag:endpaginate', function () { this.stop(); }).on('template', (t) => this.tpls.push(t)).on('end', () => { throw new Error('paginate not closed'); });
    s.start();
  },
  *render(ctx, emitter) {
    ctx.push({ paginate: { pages: 1, current_page: 1, parts: [] } });
    yield this.liquid.renderer.renderTemplates(this.tpls, ctx, emitter);
    ctx.pop();
  },
});

function buildSection(name, source) {
  const m = source.match(/\{%-?\s*schema\s*-?%\}([\s\S]*?)\{%-?\s*endschema\s*-?%\}/);
  const section = { id: name, settings: {}, blocks: [] };
  if (!m) return section;
  let schema;
  try { schema = JSON.parse(m[1]); } catch (e) { console.warn(`  ! ${name}: schema JSON: ${e.message}`); section.settings._bad_schema = true; return section; }
  const defaults = (list) => Object.fromEntries((list || []).filter((s) => s.id).map((s) => [s.id, s.default !== undefined ? s.default : (s.type === 'checkbox' ? false : '')]));
  Object.assign(section.settings, defaults(schema.settings));
  const preset = (schema.presets || [])[0];
  if (preset) {
    Object.assign(section.settings, preset.settings || {});
    section.blocks = (preset.blocks || []).map((b, i) => ({
      id: `${name}-${i}`, type: b.type, shopify_attributes: '',
      settings: { ...defaults((schema.blocks || []).find((x) => x.type === b.type)?.settings), ...(b.settings || {}) },
    }));
  }
  section._schema = schema;
  return section;
}

async function renderSection(key, def, globals) {
  const file = path.join(THEME, 'sections', `${def.type}.liquid`);
  if (!fs.existsSync(file)) return `<!-- section ${def.type} missing -->`;
  const source = fs.readFileSync(file, 'utf8');
  const section = buildSection(def.type, source);
  if (def.settings) Object.assign(section.settings, def.settings);
  if (def.blocks) {
    const order = def.block_order || Object.keys(def.blocks);
    const blockDefs = section._schema?.blocks || [];
    section.blocks = order.map((bk, i) => {
      const b = def.blocks[bk];
      const d = Object.fromEntries((blockDefs.find((x) => x.type === b.type)?.settings || []).filter((s) => s.id).map((s) => [s.id, s.default ?? '']));
      return { id: `${key}-${i}`, type: b.type, settings: { ...d, ...(b.settings || {}) }, shopify_attributes: '' };
    });
  }
  const resolve = (defs, target) => {
    for (const d of defs || []) {
      const v = target[d.id];
      if (typeof v !== 'string' || !v) continue;
      if (d.type === 'collection') target[d.id] = collections[v] || null;
      if (d.type === 'product') target[d.id] = P(v) || null;
      /* image pickers store shopify://shop_images/<file>; locally those files live in catalog/images/_banners */
      if (d.type === 'image_picker' && v.startsWith('shopify://shop_images/')) {
        const name = v.slice('shopify://shop_images/'.length);
        target[d.id] = fs.existsSync(path.join(ROOT, 'catalog/images/_banners', name)) ? { src: `/media/_banners/${name}`, alt: '', width: 1350, height: 1650 } : null;
      }
    }
  };
  resolve(section._schema?.settings, section.settings);
  for (const b of section.blocks) resolve((section._schema?.blocks || []).find((x) => x.type === b.type)?.settings, b.settings);
  delete section._schema;
  section.id = key;
  const html = await engine.parseAndRender(source, { section }, { globals });
  return `<div id="shopify-section-${key}" class="shopify-section">${html}</div>`;
}

const settingsData = JSON.parse(fs.readFileSync(path.join(THEME, 'config/settings_data.json'), 'utf8'));
const staticSections = settingsData.current.sections || {};
engine.registerTag('section', {
  parse(token) { this.name = token.args.trim().replace(/^['"]|['"]$/g, ''); },
  *render(ctx, emitter) {
    const html = yield renderSection(this.name, staticSections[this.name] || { type: this.name }, ctx.globals || {});
    emitter.write(html);
  },
});

/* ------------------------------- globals ------------------------------ */
const settings = settingsData.current;
const routes = {
  root_url: '/', cart_url: '/cart', cart_add_url: '/cart/add', cart_change_url: '/cart/change', cart_update_url: '/cart/update',
  search_url: '/search', all_products_collection_url: '/collections/all', collections_url: '/collections',
  account_url: '/account', account_login_url: '/account/login', predictive_search_url: '/search/suggest',
};
const shop = { name: 'FemZou', email: settings.contact_email, domain: 'femzou.com', url: `http://localhost:${PORT}`, currency: 'INR', money_format: '₹{{amount_no_decimals}}' };
const linklists = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/menus.json'), 'utf8'));

function globalsFor(extra) {
  return {
    settings, routes, shop, cart, linklists, collections, blogs,
    all_products: Object.fromEntries(products.map((p) => [p.handle, p])),
    canonical_url: shop.url + (extra.path || '/'),
    request: { design_mode: false, page_type: extra.template, path: extra.path || '/', host: 'localhost' },
    content_for_header: '',
    ...extra,
    template: { name: extra.template.split(/[./]/)[0], suffix: extra.template.split(/[./]/)[1] || null },
  };
}

async function renderPage(req, res, { template, page_title, page_description, data = {} }) {
  const globals = globalsFor({ template, path: req.path, page_title, page_description, ...data });
  /* Section Rendering API: ?section_id=<file> returns that section alone, as Shopify does */
  if (req.query.section_id) {
    const html = await renderSection(String(req.query.section_id), { type: String(req.query.section_id) }, globals);
    return res.set('content-type', 'text/html; charset=utf-8').send(html);
  }
  try {
    const jsonPath = path.join(THEME, 'templates', `${template}.json`);
    const cfg = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    let order = cfg.order || Object.keys(cfg.sections);
    if (req.query.only) order = order.filter((k) => k === req.query.only || cfg.sections[k]?.type === req.query.only);
    const parts = [];
    for (const key of order) if (cfg.sections[key] && !cfg.sections[key].disabled) parts.push(await renderSection(key, cfg.sections[key], globals));
    const layout = fs.readFileSync(path.join(THEME, 'layout/theme.liquid'), 'utf8');
    const html = await engine.parseAndRender(layout, { content_for_layout: parts.join('\n') }, { globals });
    res.set('content-type', 'text/html; charset=utf-8').send(html);
  } catch (err) {
    console.error(`\n[render ${template}]`, err.message);
    res.status(500).send(`<pre style="padding:2rem;white-space:pre-wrap"><b>Render error: ${template}</b>\n\n${String(err.stack || err.message).replace(/[<>]/g, (c) => ({ '<': '&lt;', '>': '&gt;' }[c]))}</pre>`);
  }
}
const notFound = (req, res) => { res.status(404); return renderPage(req, res, { template: '404', page_title: 'Page not found' }); };

/* -------------------------------- routes ------------------------------ */
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/assets', express.static(path.join(THEME, 'assets'), { maxAge: 0 }));
app.use('/media', express.static(path.join(ROOT, 'catalog/images'), { maxAge: '1h' }));

/* product JSON, shaped like Shopify's /products/<handle>.js */
app.get(/^\/products\/([^/]+)\.js$/, (req, res) => {
  const p = P(req.params[0]);
  if (!p) return res.status(404).json({ status: 404 });
  res.json({
    id: p.id, title: p.title, handle: p.handle, type: p.product_type || p.type, url: p.url, available: p.available,
    price: p.price, compare_at_price: p.compare_at_price, featured_image: p.featured_image?.src || null,
    images: p.images.map((i) => i.src), variants: p.variants.map((v) => ({ id: v.id, price: v.price, available: v.available })),
  });
});

app.get('/', (req, res) => renderPage(req, res, { template: 'index', page_title: null, page_description: 'FemZou professional skincare and haircare. Beauty, science and confidence, made in India.' }));

app.get('/collections/:handle', (req, res) => {
  const c = collections[req.params.handle];
  if (!c) return notFound(req, res);
  const sort = String(req.query.sort_by || 'manual');
  const sorters = {
    'price-ascending': (a, b) => a.price - b.price, 'price-descending': (a, b) => b.price - a.price,
    'title-ascending': (a, b) => a.title.localeCompare(b.title),
  };
  const collection = { ...c, sort_by: sort, default_sort_by: 'manual', products: sorters[sort] ? [...c.products].sort(sorters[sort]) : c.products };
  renderPage(req, res, { template: 'collection', page_title: c.title, page_description: c.description.replace(/<[^>]+>/g, ''), data: { collection } });
});

app.get('/products/:handle', (req, res) => {
  const product = P(req.params.handle);
  if (!product) return notFound(req, res);
  renderPage(req, res, { template: 'product', page_title: product.title, page_description: product.metafields.femzou.subtitle.value, data: { product } });
});

const pages = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/pages.json'), 'utf8'));
app.get('/pages/:handle', (req, res) => {
  const def = pages[req.params.handle];
  if (!def) return notFound(req, res);
  renderPage(req, res, { template: def.template || 'page', page_title: def.title, data: { page: { title: def.title, handle: req.params.handle, content: def.content || '' } } });
});

app.get('/blogs/skin-notes', (req, res) => renderPage(req, res, { template: 'blog', page_title: 'Skin Notes', data: { blog: blogs['skin-notes'] } }));
app.get('/blogs/skin-notes/:handle', (req, res) => {
  const article = articles.find((a) => a.handle === req.params.handle);
  if (!article) return notFound(req, res);
  renderPage(req, res, { template: 'article', page_title: article.title, page_description: article.excerpt, data: { blog: blogs['skin-notes'], article } });
});

app.get('/cart', (req, res) => renderPage(req, res, { template: 'cart', page_title: 'Your cart' }));

const haystack = (p) => [p.title, p.type, p.metafields.femzou.subtitle.value, ...p.metafields.femzou.ingredients.value.map((i) => i.n), ...p.tags].join(' ').toLowerCase();
app.get('/search', (req, res) => {
  const q = String(req.query.q || '').trim();
  const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
  const results = terms.length ? products.filter((p) => terms.every((t) => haystack(p).includes(t))) : [];
  renderPage(req, res, { template: 'search', page_title: q ? `Search: ${q}` : 'Search', data: { search: { terms: q, results, results_count: results.length, performed: !!q } } });
});

app.get('/search/suggest.json', (req, res) => {
  const q = String(req.query.q || '').toLowerCase().trim();
  res.json({ resources: { results: {
    products: q ? products.filter((p) => haystack(p).includes(q)).slice(0, 6).map((p) => ({ title: p.title, url: p.url, price: (p.price / 100).toFixed(2), image: p.featured_image?.src || null, type: p.type })) : [],
    collections: q ? Object.values(collections).filter((c) => c.title.toLowerCase().includes(q)).slice(0, 4).map((c) => ({ title: c.title, url: c.url })) : [],
  } } });
});

app.get('/cart.js', (req, res) => res.json(cart));
app.post('/cart/add.js', (req, res) => {
  const items = req.body.items || [{ id: req.body.id, quantity: req.body.quantity || 1 }];
  const added = items.map((i) => addToCart(i.id, Number(i.quantity) || 1)).filter(Boolean);
  if (!added.length) return res.status(422).json({ status: 422, description: 'Variant not found' });
  res.json({ items: added });
});
app.post('/cart/change.js', (req, res) => { changeCart(req.body.id ?? req.body.line, Number(req.body.quantity)); res.json(cart); });
app.post('/cart/clear.js', (req, res) => { cart.items = []; recalc(); res.json(cart); });
app.post('/cart/add', (req, res) => { addToCart(req.body.id, Number(req.body.quantity) || 1); res.redirect('/cart'); });
app.post('/contact', (req, res) => res.redirect(`${(req.get('referer') || '/').split('#')[0]}#subscribed`));
app.use(notFound);

app.listen(PORT, () => {
  console.log(`\n  FemZou theme  ->  http://localhost:${PORT}`);
  console.log(`  ${products.length} products, ${Object.keys(collections).length} collections, ${articles.length} articles\n`);
});
