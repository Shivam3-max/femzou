# FemZou Shopify setup

## 1. Metafield definitions (Settings, Custom data, Products)

Namespace `femzou`, created before the product import.

| Key | Type |
|---|---|
| `short_title` | Single line text |
| `subtitle` | Single line text |
| `size` | Single line text |
| `category` | Single line text. One of `face-care`, `hair-care`, `body-hygiene` |
| `helps_with` | JSON. Array of strings |
| `works_for` | JSON. Array of strings |
| `ingredients` | JSON. Array of `{ "n": name, "d": what it does }` |
| `how_to` | JSON. Array of strings |
| `free_from` | JSON. Array of strings |
| `faq` | JSON. Array of `{ "q": question, "a": answer }` |
| `routine` | JSON. Array of up to 3 product handles |
| `also_in` | JSON. Array of product handles for other pack sizes |

## 2. Products

Import `import/femzou-products.csv` (Products, Import). Every product comes in as a draft with no images. Run `npm run import:csv` after changing `data/catalog.mjs`.

## 3. Collections

Create these with these exact handles. Automated collections by tag are the easiest.

| Handle | Title | Condition |
|---|---|---|
| `face-care` | Face Care | Tag is `face-care` |
| `hair-care` | Hair Care | Tag is `hair-care` |
| `body-hygiene` | Body & Hygiene | Tag is `body-hygiene` |
| `professional` | FemZou Professional | Tag is `professional` |
| `bestsellers` | Bestsellers | Tag is `bestseller` |
| `body-lotions` | Body Lotions | Type is `Body Lotion` |
| `dull-tan` | Dullness & Tan | Tag is `dull-tan` |
| `acne-oily` | Oily & Acne-Prone | Tag is `acne-oily` |
| `dry-skin` | Dry Skin | Tag is `dry-skin` |
| `sun-care` | Sun Care | Tag is `sun-care` |
| `hair-fall` | Hair Fall | Tag is `hair-fall` |
| `frizz-damage` | Frizz & Damage | Tag is `frizz-damage` |

## 4. Menus, pages, blog

- Menus (Content, Menus) with handles `footer-shop`, `footer-help`, `footer-about`. Links are in `data/menus.json`.
- Pages with handles `about` (template `page.about`), `contact` (`page.contact`), `faq` (`page.faq`), `shipping-policy`, `refund-policy`.
- Blog with handle `skin-notes`.

## 5. Theme

Run `node scripts/materialize-presets.mjs` after adding any new section with blocks, then push with `npm run shopify:push`. The Shopify CLI is not installed on this Mac yet.

## 6. Images

Upload each product's photos from `catalog/images/<handle>/` in file order (01 first). 01 is the card image and 02 is the hover image, so keep a clean packshot first and a lifestyle shot second.

Theme editor settings that use products: Header, Featured product in the Shop menu (Onion Hair Oil), and the two Product spotlight sections on the homepage. Quick view, recently viewed and the cart suggestions need no setup.


Nothing else to change in code. Upload a product's photos in Shopify and they replace the placeholders on every page. Banners and tiles are set in the theme editor, each slot states its size. If the final product photos are not square, change Theme settings, Product images, Product image shape.
