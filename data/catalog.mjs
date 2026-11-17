/**
 * FemZou range, from the 2026 product catalogue (33 products).
 *
 * Copy follows the catalogue, with drug-like or fairness claims softened
 * (see docs/SEEDED-DATA.md). Prices come from the old femzou.com listing.
 * Products marked `est: true` had no matching price there: the number is a
 * stand-in taken from the nearest sibling and must be replaced before launch.
 *
 * No product has an image on purpose. The theme renders placeholders until
 * photos are uploaded in Shopify.
 */
const SUL = 'Sulphate free', PAR = 'Paraben free', CRU = 'Cruelty free', DER = 'Dermatologically tested',
  SIL = 'Silicone free', SOAP = 'Soap free', MIN = 'Mineral oil free', ALC = 'Alcohol free', PH = 'pH balanced', SLS = 'SLS free', COL = 'Colour safe';

const OCEAN = { n: 'OceanDerMX', d: 'A marine active complex that helps hydrate, protect and restore.' };
const ALOE = { n: 'Aloe Vera', d: 'Soothes and hydrates.' };
const VITE = { n: 'Vitamin E', d: 'Antioxidant care that protects and conditions.' };
const ROSEMARY = { n: 'Rosemary', d: 'Conditions the scalp and supports stronger-looking hair.' };
const ONION = { n: 'Onion Extract', d: 'Nourishes the scalp and hair roots.' };
const KERATIN = { n: 'Keratin', d: 'Strengthens and smooths the hair strand.' };
const TEATREE = { n: 'Tea Tree', d: 'Soothes the scalp and keeps it fresh.' };
const ARGAN = { n: 'Argan Oil', d: 'Softens, nourishes and adds shine.' };
const SHEA = { n: 'Shea Butter', d: 'Deeply moisturises and softens.' };
const HA = { n: 'Hyaluronic Acid', d: 'Attracts and holds moisture in the skin.' };
const GLY = { n: 'Glycolic Acid', d: 'Exfoliates dead skin cells and refines texture.' };
const SAL = { n: 'Salicylic Acid', d: 'Works inside pores to help keep them clear.' };

const lotion = (fruit, handle, line, note) => ({
  handle, title: `${fruit} Skin Hydrating Body Lotion`, short: `${fruit} Body Lotion`, sub: line, size: '250 ml', type: 'Body Lotion', cat: 'body-hygiene', concerns: ['dry-skin'],
  mrp: 249, price: 199,
  desc: `A refreshing, nourishing body lotion with ${note}. It keeps skin soft, smooth and comfortable all day.`,
  helps: ['Locks in moisture', 'Improves skin softness', 'Leaves a light, fresh scent', 'Comfortable all-day wear'],
  works: ['All skin types', 'Daily use'],
  ingredients: fruit === 'Orange'
    ? [{ n: 'Orange Extract', d: 'Rich in vitamin C, freshens dull-looking skin.' }, SHEA, HA, VITE]
    : [{ n: `${fruit} Extract`, d: 'Gives the lotion its fresh character.' }, SHEA, HA],
  how: ['Apply on clean skin after a shower.', 'Massage until absorbed.', 'Use morning and night.'],
  free: [],
  pairs: ['lavender-hand-wash', 'aloe-vera-gel'],
});

export const products = [
  {
    handle: 'hair-mask', title: 'Hair Mask', sub: 'Nourish, repair and shine', size: '500 gm', type: 'Hair Mask', cat: 'hair-care', concerns: ['frizz-damage'], mrp: 1899, price: 1519, best: true,
    desc: 'A deep conditioning treatment enriched with natural extracts and vitamins. It works into the hair shaft to help repair damage, reduce frizz and restore moisture balance.',
    helps: ['Deeply nourishes dry, frizzy hair', 'Strengthens from root to tip', 'Restores natural shine', 'Helps protect from heat and colour stress'],
    works: ['All hair types', 'Men and women'],
    ingredients: [ARGAN, KERATIN, { n: 'Aloe Vera', d: 'Soothes and hydrates the scalp.' }, VITE, { n: 'Natural Extracts', d: 'Revitalise and strengthen.' }],
    how: ['After shampooing, apply evenly on damp hair.', 'Leave for 10 to 15 minutes.', 'Rinse thoroughly with water.'],
    free: [], routine: ['sulphate-free-shampoo', 'gleaming-hair-conditioner-250ml', 'hair-mask'],
  },
  {
    handle: 'dual-acid-power-facewash', title: 'Dual Acid Power Facewash', sub: 'With glycolic and salicylic acid', size: '100 ml', type: 'Cleanser', cat: 'face-care', concerns: ['acne-oily', 'dull-tan'], mrp: 349, price: 280, best: true,
    desc: 'A daily cleanser built on the combination of glycolic and salicylic acid. It cleanses deeply, clears excess oil and impurities and helps refine skin texture and tone.',
    helps: ['Deeply cleanses and removes impurities', 'Helps keep pores clear', 'Exfoliates dead skin cells', 'Helps even the look of skin tone'],
    works: ['All skin types', 'Especially oily and combination skin'],
    ingredients: [GLY, SAL],
    how: ['Pump a small amount on a wet face.', 'Massage gently in circular motions.', 'Rinse thoroughly. Use twice daily.'],
    free: [PAR], routine: ['dual-acid-power-facewash', 'vitamin-c-face-serum', 'sunscreen-spf-50'],
  },
  {
    handle: 'hair-cleanser', title: 'Hair Cleanser with OceanDerMX', short: 'Hair Cleanser', sub: 'Restore and protect', size: '250 ml', type: 'Shampoo', cat: 'hair-care', concerns: ['frizz-damage'], mrp: 349, price: 349, best: true,
    desc: 'A gentle, effective cleanser enriched with OceanDerMX and plant-based ingredients. It cleanses, nourishes and helps restore the natural balance of hair and scalp, leaving hair soft and manageable.',
    helps: ['Deeply cleanses hair and scalp', 'Nourishes hair roots', 'Helps restore moisture balance', 'Leaves hair soft and shiny'],
    works: ['All hair types', 'Daily use'],
    ingredients: [OCEAN, { n: 'Aloe Vera', d: 'Soothes the scalp and adds natural shine.' }, { n: 'Rosemary Extract', d: 'Conditions the scalp and hair.' }],
    how: ['Apply on wet hair.', 'Gently massage into scalp and hair.', 'Rinse thoroughly. Use daily.'],
    free: [], routine: ['hair-cleanser', 'gleaming-hair-conditioner-250ml', 'hair-mask'],
  },
  {
    handle: 'ha-vitamin-c-foaming-face-wash', title: 'HA + Vitamin C Foaming Face Wash', sub: 'With OceanDerMX', size: '60 ml', type: 'Cleanser', cat: 'face-care', concerns: ['dull-tan'], mrp: 249, price: 199,
    desc: 'A gentle foaming face wash that cleanses deeply and brightens, while helping restore the skin\'s natural glow.',
    helps: ['Deeply cleanses and removes impurities', 'Brightens and improves radiance', 'Helps protect the skin barrier', 'Light and gentle'],
    works: ['All skin types', 'Daily use'],
    ingredients: [{ n: 'Hyaluronic Acid', d: 'Deeply hydrates and helps retain moisture.' }, { n: 'Vitamin C', d: 'Brightens and helps fade the look of dark spots.' }, { n: 'OceanDerMX', d: 'Strengthens the skin barrier against oxidative stress.' }],
    how: ['Pump a small amount and apply on a wet face.', 'Massage gently in circular motions.', 'Rinse thoroughly and pat dry. Use twice daily.'],
    free: [SUL, CRU, PAR], routine: ['ha-vitamin-c-foaming-face-wash', 'vitamin-c-face-serum', 'sunscreen-spf-50'],
  },
  {
    handle: 'advance-hair-growth-serum', title: 'Advance Hair Growth Serum', sub: 'Formulated to support stronger follicles', size: '60 ml', type: 'Hair Serum', cat: 'hair-care', concerns: ['hair-fall'], mrp: 1299, price: 1039,
    desc: 'A blend of well-known scalp actives that nourishes the scalp and strengthens follicles, formulated to support fuller, healthier-looking hair.',
    helps: ['Nourishes the scalp', 'Strengthens hair follicles', 'Helps reduce breakage', 'Improves hair texture and shine'],
    works: ['All hair types', 'Men and women'],
    ingredients: [{ n: 'Capixyl', d: 'Supports hair density.' }, { n: 'Redensyl', d: 'Supports fuller-looking hair.' }, { n: 'Procapil', d: 'Strengthens hair follicles.' }, { n: 'Aminexil', d: 'Strengthens the roots.' }, { n: 'Capilia Longa', d: 'Supports scalp condition.' }, { n: 'Caffeine', d: 'Energises the roots.' }],
    how: ['Part your hair and apply a few drops directly on the scalp.', 'Gently massage with fingertips for 2 to 3 minutes.', 'Do not rinse. Use daily.'],
    free: [PAR, SUL, CRU, DER], routine: ['sulphate-free-shampoo', 'onion-hair-oil', 'advance-hair-growth-serum'],
  },
  {
    handle: 'cleansing-hair-conditioner-100ml', title: 'Cleansing Hair Conditioner', sub: 'Nourishes and hydrates', size: '100 ml + 25% extra', type: 'Conditioner', cat: 'hair-care', concerns: ['frizz-damage'], mrp: 219, price: 175,
    desc: 'Formulated to nourish, hydrate and strengthen hair from root to tip. Natural botanical extracts help restore moisture, improve manageability and leave hair soft and smooth.',
    helps: ['Replenishes moisture', 'Reduces breakage', 'Detangles and tames frizz', 'Restores natural shine'],
    works: ['Dry and damaged hair', 'Frizzy or chemically treated hair'],
    ingredients: [{ n: 'Natural Botanical Extracts', d: 'Condition and soften each strand.' }],
    how: ['After shampooing, apply to wet hair.', 'Focus on mid-lengths and ends.', 'Leave for 2 to 3 minutes and rinse.'],
    free: [SUL, PAR, SIL], routine: ['hair-shampoo-oceandermx', 'cleansing-hair-conditioner-100ml', 'hair-mask'],
  },
  {
    handle: 'sulphate-free-shampoo', title: 'Shampoo for Healthy Hair Growth', short: 'Sulphate Free Shampoo', sub: '8X advance care', size: '500 ml', type: 'Shampoo', cat: 'hair-care', concerns: ['hair-fall'], mrp: 1299, price: 1039,
    desc: 'A hair care formula enriched with onion, rosemary, tea tree and keratin to support healthy-looking hair and strengthen it from root to tip.',
    helps: ['Nourishes the scalp', 'Strengthens the hair structure', 'Leaves hair smooth and frizz free', 'Gentle on coloured hair'],
    works: ['All hair types', 'Colour-treated hair'],
    ingredients: [ONION, ROSEMARY, TEATREE, KERATIN],
    how: ['Apply on wet hair and massage into scalp and hair.', 'Lather well and rinse thoroughly.', 'Use regularly.'],
    free: [SUL, PAR, CRU, COL], routine: ['sulphate-free-shampoo', 'gleaming-hair-conditioner-250ml', 'hair-mask'],
  },
  {
    handle: 'instaglow-facial-kit', title: 'Instaglow Facial Kit', sub: 'Five steps to glowing skin', size: '5-step kit', type: 'Facial Kit', cat: 'face-care', concerns: ['dull-tan'], mrp: 239, price: 239,
    desc: 'A complete five-step facial at home: cleanse, exfoliate, massage, gel and pack. It leaves skin soft, supple and refreshed.',
    helps: ['Brightens the look of skin', 'Makes skin soft and supple', 'Gives a refreshing glow', 'Helps with the look of tan'],
    works: ['Dull or tanned skin', 'All skin types'],
    ingredients: [{ n: 'Step 1: Cleanser', d: 'Removes impurities and prepares skin.' }, { n: 'Step 2: Exfoliator', d: 'Gently removes dead skin cells.' }, { n: 'Step 3: Massage Cream', d: 'Nourishes and revitalises skin.' }, { n: 'Step 4: Gel', d: 'Soothes and hydrates.' }, { n: 'Step 5: Pack', d: 'Brightens and gives a glowing finish.' }],
    how: ['Follow steps 1 to 5 in order on clean skin.', 'Rinse with water between steps as directed in the kit.', 'Finish with sunscreen in the day.'],
    free: [PAR, DER],
  },
  {
    handle: 'rose-mist', title: 'Rose Mist', sub: 'Refresh your skin with pure rose water', size: '100 ml', type: 'Face Mist', cat: 'face-care', concerns: ['dry-skin'], mrp: 120, price: 102,
    desc: 'Steam-distilled rose water that tones, soothes and hydrates. Use it as a toner, makeup setter or a quick refresh at any time.',
    helps: ['Tones and refreshes', 'Soothes and hydrates', 'Sets makeup', 'Quick refresh, anywhere'],
    works: ['All skin types', 'Daily use'],
    ingredients: [{ n: 'Rose Water', d: 'Steam distilled for purity and freshness.' }],
    how: ['Close your eyes.', 'Spray evenly on your face and neck.', 'Use any time for a refresh.'],
    free: [PAR, ALC, CRU, DER],
  },
  {
    handle: 'sunscreen-spf-50', title: 'Sunscreen SPF 50+ PA++++', short: 'Sunscreen SPF 50+', sub: 'Advanced sun protection formula', size: '100 ml', type: 'Sunscreen', cat: 'face-care', concerns: ['sun-care'], mrp: 669, price: 535, best: true,
    desc: 'High-performance broad-spectrum protection from UVA and UVB rays. Light, fast absorbing and non-sticky, it keeps skin moisturised while it protects.',
    helps: ['Broad-spectrum UVA and UVB protection', 'Water and sweat resistant', 'Non-greasy, fast absorbing', 'Helps prevent tanning and sunburn'],
    works: ['All skin types', 'Everyday use'],
    ingredients: [{ n: 'Zinc Oxide', d: 'Mineral UV filter.' }, { n: 'Titanium Dioxide', d: 'Broad-spectrum protection.' }, { n: 'Glycerin', d: 'Keeps skin hydrated.' }, { n: 'Niacinamide', d: 'Improves skin texture.' }, { n: 'Vitamin E', d: 'Antioxidant protection.' }, { n: 'Aloe Vera Extract', d: 'Soothes and nourishes.' }],
    how: ['Apply liberally on face and exposed skin.', 'Apply 15 to 20 minutes before going out.', 'Reapply every 2 to 3 hours.'],
    free: [CRU, DER], routine: ['hydrating-face-cleanser-250ml', 'vitamin-c-face-serum', 'sunscreen-spf-50'],
  },
  {
    handle: 'hydrating-face-cleanser-250ml', title: 'Hydrating Face Cleanser with OceanDerMX', short: 'Hydrating Face Cleanser', sub: 'Restore and protect', size: '250 ml', type: 'Cleanser', cat: 'face-care', concerns: ['dry-skin'], mrp: 349, price: 349, best: true,
    desc: 'A gentle formula that cleanses deeply while restoring moisture and protecting the skin\'s natural barrier. Skin feels fresh, clean and hydration-balanced.',
    helps: ['Removes dirt, oil and makeup', 'Hydrates without stripping', 'Strengthens the skin barrier', 'Supports smoother-looking skin'],
    works: ['All skin types', 'Sensitive skin friendly', 'Men and women'],
    ingredients: [{ n: 'OceanDerMX', d: 'Marine bioactive that helps hydrate, protect and revitalise.' }],
    how: ['Apply a small amount on a wet face.', 'Massage gently in circular motions.', 'Rinse thoroughly with water.'],
    free: [PAR, SUL, CRU, DER], also: ['hydrating-face-wash-100ml'], routine: ['hydrating-face-cleanser-250ml', 'vitamin-c-face-serum', 'sunscreen-spf-50'],
  },
  {
    handle: 'glycolic-salicylic-foaming-facewash', title: 'Glycolic & Salicylic Foaming Facewash', sub: 'Clear skin, daily care', size: '60 ml', type: 'Cleanser', cat: 'face-care', concerns: ['acne-oily'], mrp: 179, price: 152, best: true,
    desc: 'Formulated with glycolic and salicylic acid to deeply cleanse, exfoliate and renew skin. It helps clear pores and reveal a smoother, brighter complexion.',
    helps: ['Deeply cleanses and purifies', 'Helps keep pores clear', 'Helps with blemish-prone skin', 'Gentle enough for daily use'],
    works: ['Oily skin', 'Acne-prone skin'],
    ingredients: [GLY, SAL, { n: 'OceanDerMX', d: 'Soothes and strengthens the skin barrier.' }],
    how: ['Pump a small amount onto a wet face.', 'Massage gently and rinse.', 'Use twice daily.'],
    free: [SUL, PAR, CRU, DER], routine: ['glycolic-salicylic-foaming-facewash', 'vitamin-c-face-serum', 'sunscreen-spf-50'],
  },
  {
    handle: 'gleaming-hair-conditioner-250ml', title: 'Gleaming Hair Conditioner', sub: 'Nourishes and hydrates', size: '250 ml', type: 'Conditioner', cat: 'hair-care', concerns: ['frizz-damage'], mrp: 329, price: 329, best: true,
    desc: 'A deeply nourishing formula that restores moisture, strength and shine to dry, damaged hair. It detangles, smooths and protects, leaving hair soft and revitalised.',
    helps: ['Restores essential moisture', 'Detangles and reduces frizz', 'Helps guard against breakage', 'Revitalises dull hair'],
    works: ['Dry and damaged hair', 'Chemically treated hair', 'Frizzy, brittle hair'],
    ingredients: [{ n: 'Natural Botanical Extracts', d: 'Nourish and soften.' }],
    how: ['After shampooing, apply to wet hair.', 'Focus on mid-lengths and ends.', 'Leave for 2 to 3 minutes and rinse.'],
    free: [PAR, SUL, CRU, DER], also: ['gleaming-hair-conditioner-200ml'], routine: ['hair-cleanser', 'gleaming-hair-conditioner-250ml', 'hair-mask'],
  },
  {
    handle: 'conditioning-shampoo', title: 'Conditioning Shampoo', sub: '3X advance care', size: '500 ml', type: 'Shampoo', cat: 'hair-care', concerns: ['hair-fall', 'frizz-damage'], mrp: 1299, price: 1039, est: true,
    desc: 'A blend of onion, rosemary, tea tree and keratin to strengthen, nourish and revitalise hair from root to tip.',
    helps: ['Deeply nourishes and conditions', 'Reduces frizz and adds shine', 'Strengthens hair', 'Reduces the look of breakage'],
    works: ['Dry and damaged hair', 'Frizzy, unruly hair', 'Daily care'],
    ingredients: [ONION, ROSEMARY, TEATREE, KERATIN],
    how: ['Apply to wet hair.', 'Gently massage into scalp and hair.', 'Rinse thoroughly. Use regularly.'],
    free: [PAR, SUL, SIL, CRU], routine: ['conditioning-shampoo', 'gleaming-hair-conditioner-250ml', 'hair-mask'],
  },
  {
    handle: 'cold-cream', title: 'Moisturizing Cold Cream', short: 'Cold Cream', sub: 'Cocoa butter, shea butter and almond oil', size: '50 gm', type: 'Moisturiser', cat: 'face-care', concerns: ['dry-skin'], mrp: 41, price: 41,
    desc: 'A rich, non-greasy formula that deeply moisturises and nourishes. It helps protect against dryness and leaves skin soft, smooth and radiant.',
    helps: ['Deep moisturisation', 'Nourishes and softens', 'Helps protect the skin barrier', 'Smooth, healthy glow'],
    works: ['All skin types', 'Dry-weather care'],
    ingredients: [{ n: 'Cocoa Butter', d: 'Rich, softening moisture.' }, SHEA, { n: 'Almond Oil', d: 'Nourishes and smooths.' }],
    how: ['Take a small amount on clean skin.', 'Massage gently until absorbed.', 'Use morning and night.'],
    free: [],
  },
  {
    handle: 'hydrarevive-moisture-restore-lotion', title: 'HydraRevive Moisture Restore Lotion', short: 'HydraRevive Lotion', sub: 'Long-lasting hydration, never greasy', size: '100 ml', type: 'Moisturiser', cat: 'face-care', concerns: ['dry-skin'], mrp: 199, price: 159, est: true, best: true,
    desc: 'A non-greasy daily moisturiser with aloe vera, glycerin and vitamin E. It helps keep skin soft, supple and comfortable all day, on the face and body.',
    helps: ['Long-lasting hydration', 'Softens dry, rough patches', 'Comforts dry skin', 'Non-greasy, light finish'],
    works: ['Dry and normal skin', 'Face and body', 'Daily use'],
    ingredients: [{ n: 'Aloe Vera', d: 'Soothing leaf extract that hydrates.' }, { n: 'Glycerin', d: 'Draws water to the skin surface.' }, VITE, SHEA, { n: 'Olive Oil', d: 'Nourishing plant oil for a supple feel.' }, { n: 'Light Liquid Paraffin', d: 'A light film that slows water loss.' }],
    how: ['Take a small amount on your palm.', 'Apply all over the face, neck or body.', 'Massage gently until absorbed. Reapply when skin feels dry.'],
    free: [], routine: ['hydrating-face-cleanser-250ml', 'hydrarevive-moisture-restore-lotion', 'sunscreen-spf-50'],
  },
  {
    handle: 'hydrating-face-wash-100ml', title: 'Hydrating Face Wash with OceanDerMX', short: 'Hydrating Face Wash', sub: 'Restore and protect', size: '100 ml + 25% extra', type: 'Cleanser', cat: 'face-care', concerns: ['dry-skin'], mrp: 190, price: 155,
    desc: 'A gentle yet effective cleanser enriched with OceanDerMX that deeply hydrates, restores and protects. It removes impurities without stripping natural moisture.',
    helps: ['Deeply cleanses', 'Helps restore the skin barrier', 'Provides intense hydration', 'Keeps skin soft'],
    works: ['All skin types'],
    ingredients: [OCEAN, { n: 'Glycerin', d: 'Keeps moisture in the skin.' }, { n: 'Aloe Vera Extract', d: 'Soothes.' }, VITE, { n: 'Allantoin', d: 'Comforts and softens.' }],
    how: ['Wet your face with water.', 'Take a small amount and lather gently.', 'Rinse thoroughly. Use twice daily.'],
    free: [PAR, SUL, SIL, CRU], also: ['hydrating-face-cleanser-250ml'], routine: ['hydrating-face-wash-100ml', 'vitamin-c-face-serum', 'sunscreen-spf-50'],
  },
  {
    handle: 'lavender-hand-wash', title: 'Lavender Hand Wash', sub: 'With aroma of royal flora lavender', size: '300 ml', type: 'Hand Wash', cat: 'body-hygiene', concerns: [], mrp: 119, price: 119, est: true, best: true,
    desc: 'A gentle, effective formula that cleanses hands and leaves them soft, refreshed and delicately fragranced with lavender.',
    helps: ['Removes dirt and oil', 'Leaves a calming lavender aroma', 'Keeps hands soft and smooth', 'Everyday hand hygiene'],
    works: ['All skin types', 'Daily hand cleansing'],
    ingredients: [{ n: 'Lavender Aroma', d: 'A calming, refreshing fragrance.' }],
    how: ['Pump a small amount on wet hands.', 'Lather well and scrub gently.', 'Rinse thoroughly with water.'],
    free: [PAR, SUL, CRU, DER, PH],
  },
  {
    handle: 'de-tan-face-pack', title: 'De-Tan Face Pack', sub: 'For brightening and glowing skin', size: '500 gm', type: 'Face Pack', cat: 'face-care', concerns: ['dull-tan'], mrp: 549, price: 439, best: true,
    desc: 'A specially formulated treatment that helps lift tan, impurities and dullness caused by sun and pollution. It deeply cleanses and evens the look of skin tone.',
    helps: ['Helps remove the look of sun tan', 'Promotes a bright, even look', 'Clears excess oil and dirt', 'Leaves skin soft and refreshed'],
    works: ['All skin types'],
    ingredients: [{ n: 'Kaolin Clay', d: 'Absorbs excess oil and cleanses pores.' }, { n: 'Licorice Extract', d: 'Helps with the look of tan.' }, ALOE, VITE],
    how: ['Cleanse your face and pat dry.', 'Apply an even layer, avoiding the eye area.', 'Leave for 15 to 20 minutes or until semi-dry.', 'Rinse with lukewarm water. Use 2 to 3 times a week.'],
    free: [PAR, DER], routine: ['hydrating-face-cleanser-250ml', 'de-tan-face-pack', 'sunscreen-spf-50'],
  },
  {
    handle: 'onion-hair-oil', title: 'Onion Hair Oil', sub: 'Nourish your hair the natural way', size: '100 ml', type: 'Hair Oil', cat: 'hair-care', concerns: ['hair-fall'], mrp: 199, price: 159, best: true,
    desc: 'A blend of onion extract and natural oils that helps strengthen hair from the roots and reduce hair fall from breakage, for healthy, long and shiny hair.',
    helps: ['Strengthens hair roots', 'Helps reduce hair fall from breakage', 'Improves the look of thickness', 'Adds shine and softness'],
    works: ['All hair types'],
    ingredients: [ONION, { n: 'Coconut Oil', d: 'Conditions and softens.' }, { n: 'Castor Oil', d: 'Coats and nourishes.' }, VITE],
    how: ['Apply directly on scalp and hair.', 'Massage gently with fingertips.', 'Leave for 1 to 2 hours or overnight.', 'Wash with a mild shampoo.'],
    free: [PAR, MIN, SIL], routine: ['onion-hair-oil', 'sulphate-free-shampoo', 'gleaming-hair-conditioner-250ml'],
  },
  {
    handle: 'hair-shampoo-oceandermx', title: 'Hair Shampoo with OceanDerMX', short: 'Hair Shampoo', sub: 'Clean, repair, strengthen', size: '100 ml + 25% extra', type: 'Shampoo', cat: 'hair-care', concerns: ['frizz-damage'], mrp: 119, price: 119,
    desc: 'A plant-based shampoo enriched with OceanDerMX and natural ingredients that gently cleanses, repairs and protects hair from root to tip.',
    helps: ['Removes dirt, oil and build-up', 'Helps repair damaged hair', 'Protects and nourishes', 'Suitable for daily use'],
    works: ['All hair types'],
    ingredients: [OCEAN, { n: 'Organic Aloe Vera', d: 'Hydrates and soothes the scalp.' }, { n: 'Organic Fenugreek', d: 'Nourishes the scalp and hair roots.' }, { n: 'Organic Rosemary Oil', d: 'Conditions the scalp and supports stronger-looking hair.' }, { n: 'Green Tea Extract', d: 'Antioxidant care that refreshes the scalp.' }, { n: 'Keratin and Biotin', d: 'Help strengthen and smooth each strand.' }],
    how: ['Apply to wet hair.', 'Massage gently into scalp and hair.', 'Rinse thoroughly. Use regularly.'],
    free: [SUL, PAR, CRU], routine: ['hair-shampoo-oceandermx', 'cleansing-hair-conditioner-100ml', 'hair-mask'],
  },
  {
    handle: 'herbal-toothpaste', title: 'Herbal Toothpaste', sub: 'Made from 9 traditional herbs', size: '100 gm', type: 'Toothpaste', cat: 'body-hygiene', concerns: [], mrp: 120, price: 102,
    desc: 'A blend of nine traditional herbs for complete oral care. It helps strengthen teeth, supports healthy gums and keeps your mouth fresh.',
    helps: ['Helps strengthen teeth', 'Supports healthy gums', 'Long-lasting freshness', 'Helps protect against plaque'],
    works: ['The whole family', 'Daily use'],
    ingredients: ['Clove', 'Neem', 'Tulsi', 'Amla', 'Babool', 'Mint', 'Mulethi', 'Pudina', 'Honey'].map((n) => ({ n, d: 'One of the nine traditional herbs in this formula.' })),
    how: ['Apply on a toothbrush.', 'Brush for two minutes.', 'Use morning and night.'],
    free: ['No parabens', 'No SLS', 'No artificial colours'],
  },
  {
    handle: 'aloe-vera-gel', title: 'Aloe Vera Gel', sub: 'Soothe and hydrate', size: '100 gm', type: 'Moisturiser', cat: 'face-care', concerns: ['dry-skin', 'sun-care'], mrp: 149, price: 119, best: true,
    desc: 'A light, cooling gel enriched with the goodness of aloe vera. It soothes sun-exposed skin and nourishes, leaving skin cool, calm and refreshed.',
    helps: ['Cools and calms sun-exposed skin', 'Hydrates and keeps skin soft', 'Soothes after shaving or waxing', 'Non-greasy and lightweight'],
    works: ['All skin types', 'Dry and dehydrated skin'],
    ingredients: [{ n: 'Aloe Vera', d: 'Rich in vitamins A, C and E; soothes and refreshes.' }],
    how: ['Apply a generous amount on clean skin.', 'Gently massage until absorbed.', 'Use as often as needed. For external use only.'],
    free: [PAR, SUL, CRU, DER],
  },
  {
    handle: 'intimate-foaming-cleanser-5-berry', title: 'Intimate Foaming Cleanser 5 Berry', short: 'Intimate Foam 5 Berry', sub: 'Gentle care, daily confidence', size: '100 ml', type: 'Intimate Wash', cat: 'body-hygiene', concerns: [], mrp: 449, price: 360,
    desc: 'A pH-balanced foaming cleanser designed for the delicate intimate area. Enriched with five berries, it helps cleanse, hydrate and maintain natural freshness.',
    helps: ['pH 3.5 balanced', 'Gently cleanses and refreshes', 'Helps maintain natural moisture', 'Safe for daily use'],
    works: ['All skin types', 'Daily use', 'For external use only'],
    ingredients: [{ n: 'Licorice', d: 'A gentle botanical.' }, { n: 'Goji Berry', d: 'Antioxidant care.' }, { n: 'Strawberry', d: 'Fresh, fruity care.' }, { n: 'Blackberry', d: 'Antioxidant care.' }, { n: 'Raspberry', d: 'Fresh, fruity care.' }],
    how: ['Pump a small amount onto your hand.', 'Gently cleanse the intimate area.', 'Rinse thoroughly with water. Use daily.'],
    free: [PAR, SOAP, DER, 'SLS / SLES free'], also: ['intimate-gentle-cleanser'],
  },
  {
    handle: 'gleaming-hair-conditioner-200ml', title: 'Gleaming Hair Conditioner Pump', short: 'Gleaming Conditioner Pump', sub: 'For dry and damaged hair', size: '200 ml', type: 'Conditioner', cat: 'hair-care', concerns: ['frizz-damage'], mrp: 769, price: 615,
    desc: 'A nourishing formula designed to restore moisture, improve manageability and enhance natural shine, while helping protect against damage.',
    helps: ['Nourishes dry, damaged hair', 'Improves texture and manageability', 'Adds natural shine and softness', 'Helps reduce breakage'],
    works: ['Dry and damaged hair'],
    ingredients: [{ n: 'Natural Ingredients', d: 'Strengthen strands and reduce frizz.' }],
    how: ['After shampooing, apply to wet hair.', 'Focus on mid-lengths and ends.', 'Leave for 2 to 3 minutes and rinse.'],
    free: [SUL, PAR, CRU], also: ['gleaming-hair-conditioner-250ml'], routine: ['hair-cleanser', 'gleaming-hair-conditioner-200ml', 'hair-mask'],
  },
  {
    handle: 'glutathione-foaming-facewash', title: 'Glutathione Foaming Facewash', sub: 'Cleanse, refresh, glow', size: '100 ml', type: 'Cleanser', cat: 'face-care', concerns: ['dull-tan', 'acne-oily'], mrp: 349, price: 280, est: true,
    desc: 'With the power of glutathione and vitamin C for cleaner, brighter and healthier-looking skin.',
    helps: ['Removes dirt and impurities', 'Hydrates and moisturises', 'Helps control excess oil', 'Brightens the look of skin'],
    works: ['All skin types'],
    ingredients: [{ n: 'L-Glutathione', d: 'Antioxidant care for a brighter look.' }, { n: 'Vitamin C', d: 'As ethyl ascorbic acid. Helps with the look of dark spots and adds glow.' }, { n: 'Niacinamide', d: 'Supports an even-looking tone and a strong skin barrier.' }, { n: 'Fermented Rice Water', d: 'A traditional skin-softening ingredient.' }, { n: 'Calendula Extract', d: 'Soothes and comforts skin.' }],
    how: ['Pump a small amount onto a wet face.', 'Massage gently and rinse.', 'Use twice daily.'],
    free: [SUL, CRU, PAR], routine: ['glutathione-foaming-facewash', 'vitamin-c-face-serum', 'sunscreen-spf-50'],
  },
  {
    handle: 'vitamin-c-face-serum', title: 'Vitamin C Face Serum', sub: 'Vitamin C 10% + Niacinamide 2%', size: '30 ml', type: 'Serum', cat: 'face-care', concerns: ['dull-tan'], mrp: 699, price: 559, est: true, best: true,
    desc: 'A brightening and anti-aging serum for brighter, smoother and younger-looking skin, with hyaluronic acid to hydrate and plump.',
    helps: ['Brightens the complexion', 'Helps with signs of aging', 'Repairs and protects', 'Improves skin elasticity'],
    works: ['All skin types'],
    ingredients: [{ n: 'Vitamin C 10%', d: 'Boosts radiance and evens the look of skin tone.' }, { n: 'Niacinamide 2%', d: 'Minimises the look of pores and strengthens the barrier.' }, { n: 'Hyaluronic Acid', d: 'Deeply hydrates and plumps.' }],
    how: ['Apply 2 to 3 drops on clean, dry skin.', 'Pat gently until absorbed.', 'Follow with sunscreen in the day.'],
    free: [], routine: ['hydrating-face-cleanser-250ml', 'vitamin-c-face-serum', 'sunscreen-spf-50'],
  },
  {
    handle: 'professional-hair-mask', title: 'Professional Hair Mask', sub: 'Hydrolyzed keratin, rosemary and argan oil', size: '280 gm', type: 'Hair Mask', cat: 'hair-care', pro: true, concerns: ['frizz-damage'], mrp: 1099, price: 879, est: true,
    desc: 'Deep nourishment for healthier, stronger hair. Enriched with hydrolyzed keratin, rosemary oil and argan oil to repair, restore and rejuvenate.',
    helps: ['Keeps hair smooth and manageable', 'Adds natural luster', 'Locks in moisture', 'Reduces the look of breakage'],
    works: ['All hair types', 'Salon and home use'],
    ingredients: [{ n: 'Keratin', d: 'Repairs and strengthens hair strands.' }, { n: 'Rosemary Oil', d: 'Conditions the scalp.' }, ARGAN],
    how: ['After shampooing, apply evenly on damp hair.', 'Leave for 10 to 15 minutes.', 'Rinse thoroughly.'],
    free: [], routine: ['professional-shampoo', 'gleaming-hair-conditioner-250ml', 'professional-hair-mask'],
  },
  {
    handle: 'professional-shampoo', title: 'Professional Shampoo', sub: 'Onion, rosemary oil and keratin', size: 'Size on pack', type: 'Shampoo', cat: 'hair-care', pro: true, concerns: ['hair-fall'], mrp: 1299, price: 1039, est: true,
    desc: 'Stronger, healthier, shinier-looking hair. Enriched with onion, rosemary oil, keratin and tea tree. Colour safe and sulphate free.',
    helps: ['Nourishes roots', 'Helps reduce hair fall from breakage', 'Adds shine and softness', 'Long-lasting colour care'],
    works: ['All hair types', 'Salon and home use'],
    ingredients: [{ n: 'Onion', d: 'Nourishes the scalp.' }, { n: 'Rosemary Oil', d: 'Strengthens the look of hair.' }, { n: 'Keratin', d: 'Repairs and rebuilds hair structure.' }, { n: 'Tea Tree Oil', d: 'Keeps the scalp fresh.' }, { n: 'Argan Oil', d: 'Moisturises and adds shine.' }],
    how: ['Apply to wet hair.', 'Massage into scalp and hair.', 'Rinse thoroughly.'],
    free: [SUL, COL], routine: ['professional-shampoo', 'gleaming-hair-conditioner-250ml', 'professional-hair-mask'],
  },
  {
    handle: 'intimate-gentle-cleanser', title: 'Intimate Gentle Cleanser', sub: 'With tea tree and sea buckthorn oil', size: '100 ml', type: 'Intimate Wash', cat: 'body-hygiene', concerns: [], mrp: 155, price: 124, best: true,
    desc: 'Specially formulated for your intimate hygiene with the goodness of nature. It removes impurities without dryness.',
    helps: ['pH 3.5 balanced', 'Gentle cleansing without dryness', 'Keeps you fresh all day', 'Supports natural balance'],
    works: ['Daily use', 'For external use only'],
    ingredients: [{ n: 'Tea Tree Oil', d: 'Known for its fresh, soothing properties.' }, { n: 'Sea Buckthorn Oil', d: 'Rich in vitamins and antioxidants, helps nourish.' }],
    how: ['Use a small amount with water on the external area.', 'Gently cleanse.', 'Rinse thoroughly.'],
    free: [PAR, SUL, SOAP], also: ['intimate-foaming-cleanser-5-berry'],
  },
  lotion('Orange', 'orange-body-lotion', 'Hydrate, nourish, glow', 'orange extract, shea butter and hyaluronic acid'),
  lotion('Kiwi', 'kiwi-body-lotion', 'Deep hydration, soft smooth skin', 'kiwi extract and shea butter'),
  lotion('Vanilla', 'vanilla-body-lotion', 'Soft, smooth, nourished skin', 'warm vanilla and shea butter'),
  lotion('Peach', 'peach-body-lotion', 'Peachy fresh all day', 'peach extract and shea butter'),
];

export const categories = [
  { handle: 'face-care', title: 'Face Care', line: 'Cleansers, serums, sun care and masks.' },
  { handle: 'hair-care', title: 'Hair Care', line: 'Shampoo, conditioner, oils and treatments.' },
  { handle: 'body-hygiene', title: 'Body & Hygiene', line: 'Lotions, hand wash, intimate and oral care.' },
];

export const concerns = [
  { handle: 'dull-tan', title: 'Dullness & Tan', line: 'For skin that needs its brightness back.' },
  { handle: 'acne-oily', title: 'Oily & Acne-Prone', line: 'Keep pores clear and excess oil in check.' },
  { handle: 'dry-skin', title: 'Dry Skin', line: 'Moisture that stays through the day.' },
  { handle: 'sun-care', title: 'Sun Care', line: 'Daily protection and after-sun comfort.' },
  { handle: 'hair-fall', title: 'Hair Fall', line: 'Care for the scalp and the root.' },
  { handle: 'frizz-damage', title: 'Frizz & Damage', line: 'Softness, shine and manageability.' },
];

export const articles = [
  {
    handle: 'cold-cream-vs-moisturiser', title: 'Cold cream or moisturiser: which one does winter skin need?', excerpt: 'Both soften the skin. They do it differently, and the difference shows up on the coldest days.', read: 3,
    body: ['A moisturiser is usually a light mix of water and humectants. It suits most skin, most of the year.', 'A cold cream carries more oil and butter. That richer layer helps slow water loss when the air turns dry, which is why it feels so good in winter.', 'If your skin is oily, keep the moisturiser and use cold cream only on dry patches. If your skin feels tight within an hour of washing, a cold cream at night is worth trying.'],
  },
  {
    handle: 'shampoo-and-conditioner-basics', title: 'Shampoo and conditioner: the basics most of us skip', excerpt: 'Where each one goes, how long to leave it, and why the order matters.', read: 3,
    body: ['Shampoo is for the scalp. Massage it there and let the lather clean the lengths as you rinse.', 'Conditioner is for the lengths. Start at mid-length, work down to the ends and keep it off the roots if your hair gets flat quickly.', 'Two to three minutes is enough for most conditioners. Rinse well, and let a weekly hair mask do the heavier work.'],
  },
  {
    handle: 'why-the-right-face-wash-matters', title: 'Why the right face wash makes everything else work better', excerpt: 'A cleanser sets up the rest of your routine. Here is how to choose yours.', read: 4,
    body: ['A good cleanser removes the day without stripping the skin. If your face feels squeaky and tight, the formula is too harsh for you.', 'Oily or blemish-prone skin often does well with glycolic and salicylic acid. Dry or sensitive skin is happier with a hydrating formula.', 'Wash twice a day, use lukewarm water, and follow with your serum and sunscreen in the morning.'],
  },
];

export const faqs = {
  face: [
    ['Can I use this every day?', 'Yes, unless the directions on the pack say otherwise. Follow the frequency listed in How to use.'],
    ['Should I patch test first?', 'We recommend it. Apply a small amount on your inner arm and wait 24 hours before using on your face.'],
    ['Is it for external use only?', 'Yes. Avoid contact with eyes. If it happens, rinse with plenty of water.'],
  ],
  hair: [
    ['How often should I use this?', 'Follow the frequency listed in How to use. Most FemZou hair products are gentle enough for regular use.'],
    ['Is it safe for coloured hair?', 'Products marked Colour safe or Sulphate free are the best choice for coloured or chemically treated hair.'],
    ['When will I see a difference?', 'Hair responds slowly. Give any routine at least 6 to 8 weeks of regular use. Results vary from person to person.'],
  ],
  body: [
    ['Can the whole family use this?', 'Yes, unless the pack says otherwise. Intimate care products are for external use only.'],
    ['Is it suitable for sensitive skin?', 'Our formulas are made to be gentle, but we recommend a patch test first if your skin is sensitive.'],
  ],
};
