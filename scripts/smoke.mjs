/**
 * DOM smoke tests against the running harness.
 *
 *   npm run dev   (another terminal)   ->   npm run smoke
 *
 * Asserts on rendered markup, not status codes: LiquidJS fails silently and
 * returns a 200 page with whole sections missing.
 */
import * as CAT from '../data/catalog.mjs';
import fs from 'node:fs';
const PHOTOS = JSON.parse(fs.readFileSync(new URL('../data/images.json', import.meta.url), 'utf8'));

const BASE = process.env.BASE || 'http://localhost:3820';
let pass = 0;
const fails = [];
const count = (html, re) => (html.match(re) || []).length;
const gte = (n) => (g) => g >= n;
function check(label, got, want) {
  const ok = typeof want === 'function' ? want(got) : got === want;
  if (ok) pass++; else fails.push(`${label}: got ${got}${typeof want === 'function' ? '' : `, want ${want}`}`);
}
async function get(p, status = 200) {
  const r = await fetch(BASE + p);
  check(`${p} HTTP`, r.status, status);
  return r.text();
}
function chrome(html, where) {
  check(`${where} no render error`, count(html, /Render error/g), 0);
  check(`${where} no raw liquid`, count(html, /\{%|\{\{ /g), 0);
  check(`${where} no missing section`, count(html, /section .+ missing/g), 0);
  check(`${where} no NaN/undefined`, count(html, />[^<]*(NaN|undefined|\[object Object\])[^<]*</g), 0);
  check(`${where} announcement`, count(html, /class="ann__msg/g), 2);
  check(`${where} header`, count(html, /class="hdr"/g), 1);
  check(`${where} mega columns`, count(html, /class="mega__col/g), 4);
  check(`${where} concern links`, count(html, /class="mega__concern"/g), 6);
  check(`${where} sticky category bar`, count(html, /data-catbar/g), 1);
  check(`${where} sticky category items`, count(html, /class="catbar__i/g), 13);
  check(`${where} footer`, count(html, /class="ftr"/g), 1);
  check(`${where} no old serif`, count(html, /Bodoni/g), 0);
  check(`${where} cart drawer`, count(html, /data-panel="cart"/g), 1);
  check(`${where} search overlay`, count(html, /data-panel="search"/g), 1);
  check(`${where} mobile nav`, count(html, /data-panel="nav"/g), 1);
  check(`${where} real phone`, count(html, /\+91 70185 32162/g), gte(1));
  check(`${where} mega feature`, count(html, /class="mega__feature"/g), 1);
  check(`${where} cart upsell items`, count(html, /data-ups-item=/g), gte(3));
  check(`${where} quick view modal`, count(html, /data-panel="quickview"/g), 1);
  check(`${where} images have alt`, count(html, /<img (?![^>]*alt=)/g), 0);
  check(`${where} no invented reviews`, count(html, /Emily Watson|Daniel Brooks|Sarah Bennett/g), 0);
}

const run = async () => {
  const home = await get('/');
  chrome(home, 'home');
  check('home hero banners', count(home, /class="hero__slide"/g), 3);
  check('home desktop hero slots', count(home, /slot--hero slot--desk/g), 3);
  check('home phone hero slots', count(home, /slot--hero slot--phone/g), 3);
  check('home dots', count(home, /class="hero__dot[ "]/g), 3);
  check('home circles', count(home, /class="circle"/g), 6);
  check('home tabs', count(home, /class="tab[ "]/g), 3);
  check('home concerns', count(home, /class="concern"/g), 6);
  check('home ingredients', count(home, /class="ing"/g), 4);
  check('home routine steps', count(home, /class="rstep"/g), 3);
  check('home routine add-all', count(home, /data-add-many="\d+,\d+,\d+,"/g), 1);
  check('home typed headline', count(home, /data-type>Beauty\. Science\. Confidence\.</g), 1);
  check('home statement rule', count(home, /class="statement__rule"/g), 1);
  check('home spotlights', count(home, /class="sec spot/g), 2);
  check('home spotlight photos', count(home, /data-spot-src="\/media\//g), gte(8));
  check('home splits', count(home, /class="split__h"/g), 2);
  check('home articles', count(home, /class="art"/g), 3);
  check('home trust', count(home, /class="trust__i"/g), 5);
  check('home cards', count(home, /class="pc[ "]/g), gte(24));
  check('home placeholders', count(home, /class="ph"/g), gte(20));

  for (const p of CAT.products) {
    const html = await get(`/products/${p.handle}`);
    const w = p.handle;
    chrome(html, w);
    check(`${w} title`, count(html, /class="pdp__title"/g), 1);
    check(`${w} name`, html.includes(p.title.replace(/&/g, '&')) || html.includes(p.title.replace(/&/g, '&amp;')), true);
    const shots = PHOTOS[p.handle] ? PHOTOS[p.handle].length : 5;
    check(`${w} gallery slots`, count(html, /class="pdp__shot/g), shots);
    check(`${w} thumbs`, count(html, /class="thumb/g), shots);
    check(`${w} zoomable photos`, count(html, /data-full="\/media\//g), PHOTOS[p.handle] ? shots : 0);
    check(`${w} recently viewed`, count(html, /data-recent hidden/g), 1);
    const qv = await (await fetch(`${BASE}/products/${p.handle}?section_id=quick-view`)).text();
    check(`${w} quick view section`, count(qv, /data-qv/g) >= 1 && !qv.includes('<html'), true);
    const js = await (await fetch(`${BASE}/products/${p.handle}.js`)).json();
    check(`${w} product json`, js.handle === p.handle && js.price === p.price * 100, true);
    check(`${w} add form`, count(html, /class="buy"/g), 1);
    check(`${w} helps`, count(html, />Helps with</g), 1);
    check(`${w} ingredient chips`, count(html, /data-ing="/g), p.ingredients.length);
    check(`${w} routine steps`, count(html, /class="routine__step"/g), p.routine ? p.routine.length : 0);
    check(`${w} how-to steps`, count(html, /<ol class="steps">/g), 1);
    check(`${w} size pills`, count(html, /class="sizes__pill/g), 1 + (p.also ? p.also.length : 0));
    check(`${w} sticky bar`, count(html, /data-stickybuy/g), 1);
    check(`${w} related cards`, count(html, /class="rail__item"/g), gte(1));
    check(`${w} price`, html.includes(`₹${p.price.toLocaleString('en-IN')}`), true);
  }

  const collections = ['all', 'face-care', 'hair-care', 'body-hygiene', 'professional', 'bestsellers', 'body-lotions', ...CAT.concerns.map((c) => c.handle)];
  for (const h of collections) {
    const html = await get(`/collections/${h}`);
    chrome(html, h);
    check(`${h} cards`, count(html, /class="pc[ "]/g), gte(2));
    check(`${h} sort`, count(html, /data-sort/g), 1);
    check(`${h} category tabs`, count(html, /class="coll__cat[ "]/g), 5);
  }
  check('all has every product', count(await get('/collections/all'), /class="pc[ "]/g), CAT.products.length);

  for (const p of ['/pages/about', '/pages/contact', '/pages/faq', '/pages/shipping-policy', '/pages/refund-policy', '/blogs/skin-notes', `/blogs/skin-notes/${CAT.articles[0].handle}`, '/cart', '/search', '/search?q=keratin']) {
    chrome(await get(p), p);
  }
  chrome(await get('/nope', 404), '404');
  check('search finds OceanDerMX range', count(await get('/search?q=OceanDerMX'), /class="pc[ "]/g), gte(5));
  check('about columns', count(await get('/pages/about'), /class="trio__i"/g), 3);
  check('faq items', count(await get('/pages/faq'), /<details/g), gte(6));
  check('contact form', count(await get('/pages/contact'), /contact\[body\]/g), 1);

  /* cart API */
  await fetch(`${BASE}/cart/clear.js`, { method: 'POST' });
  const j = (u, b) => fetch(BASE + u, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(b) }).then((r) => r.json());
  const add = await j('/cart/add.js', { items: [{ id: 100001, quantity: 2 }] });
  check('cart add', add.items.length, 1);
  const c1 = await (await fetch(`${BASE}/cart.js`)).json();
  check('cart count', c1.item_count, 2);
  check('cart total', c1.total_price, CAT.products[0].price * 200);
  const c2 = await j('/cart/change.js', { line: 1, quantity: 0 });
  check('cart change', c2.item_count, 0);
  const sug = await (await fetch(`${BASE}/search/suggest.json?q=vitamin`)).json();
  check('predictive products', sug.resources.results.products.length, gte(2));

  console.log(`\n  ${pass} passed, ${fails.length} failed`);
  if (fails.length) { console.log(fails.slice(0, 60).map((f) => `  x ${f}`).join('\n')); process.exit(1); }
};
run().catch((e) => { console.error(e); process.exit(1); });
