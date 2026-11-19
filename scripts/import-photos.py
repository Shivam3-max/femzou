"""Copy supplied product photos into catalog/images/<handle>/ at web size.

    python3 -I scripts/import-photos.py <folder with the original PNGs> [...more folders]

Writes 1400px JPEGs (Shopify resizes from these) and data/images.json, the
gallery order the local preview uses. In Shopify, upload the same files in
this order on each product.
"""
import json
import os
import subprocess
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# gallery order per product; first image is the card and listing image
GALLERY = {
    "hydrarevive-moisture-restore-lotion": [
        "FemZou Hydrarevive Lotion on White Spa Surface", "FemZou HydrareVive Moisture Restore Lotion",
        "FEMZOU HydrareVive Hydration Benefits", "Before & After Hydration Glow",
        "FEMZOU HydraRevive Skincare Routine", "Hydration and Radiance Skincare Infographic",
        "Lotion Bottle Back Label in Spa Setting",
    ],
    "de-tan-face-pack": [
        "FEMZOU De-Tan Face Pack Jar", "FemZou De-Tan Face Pack Jar (1)", "Skincare Face Pack Guide",
        "Pink De-Tan Face Pack Jar",
    ],
    "intimate-foaming-cleanser-5-berry": [
        "FemZou Intimate Foaming Cleanser", "FemZou Berry Cleanser Spa Display", "FEMZOU Berry Foaming Cleanser Spa Scene",
        "Joyful FemZou Cleanser Studio Ad", "FemZou Foaming Cleanser Spa Scene",
        "Minimalist 5 Berry Foaming Cleanser Spa Scene", "Foaming Cleanser in a Fresh Spa Setting",
    ],
    "onion-hair-oil": [
        "FemZou Onion Hair Oil Product Shot", "Femzou Onion Hair Oil Product Set", "Pure, Safe & Effective Onion Hair Oil",
        "Real Results, Onion Hair Oil Benefits", "Powerful Naturals Hair Oil Infographic", "Build Your Hair Care Routine",
        "Femzou Onion Hair Oil Applicator Bottle", "White Squeeze Bottle with Pointed Nozzle",
    ],
    "gleaming-hair-conditioner-250ml": [
        "FemZou Glamour Hair Conditioner", "Gleaming Hair Conditioner with Cream Swirl", "Glossy One-Minute Haircare Ad",
        "FemZou Conditioner_ Three Easy Steps", "Glossy Black Pump Bottle Vanity Display", "Glossy Black Hair Conditioner Bottle",
    ],
    "conditioning-shampoo": [
        "FemZou Pink Botanical Shampoo Splash", "Glossy Pink Pump Bottle Product Shot", "Glossy Pink Hair Benefits Infographic",
        "Glossy Pink Haircare Ingredients Infographic", "Healthy Hair Benefits Infographic", "Pink Hair Care How-To Guide",
        "Pink Shampoo Bottle Back Label",
    ],
    "sulphate-free-shampoo": [
        "FemZou Shampoo Pink Botanical Product Ad", "Pink Haircare Ingredients Infographic", "Pink Shampoo How-To Guide",
        "Minimal Pink Shampoo Bottle Product Shot", "Pink Botanical Shampoo Bottle Product Shot",
    ],
    "vanilla-body-lotion": [
        "FemZou Vanilla Body Lotion Studio Shot", "Vanilla Lotion with Cream Swirls and Pearls", "Vanilla Extract Botanical Lotion Ad",
        "Vanilla Hydrating Lotion Advertisement", "Vanilla Hydration Spa Lotion Ad",
    ],
    "glutathione-foaming-facewash": [
        "FemZou Glutathione Foaming Facewash", "FEMZOU Glutathione Foaming Facewash (1)",
        "Skincare Box Back Panel Display", "Ingredients Label Skincare Bottle",
    ],
    "hydrating-face-cleanser-250ml": [
        "FEMZOU Hydrating Face Cleanser Bottle", "Spa Glow with Hydrating Cleanser", "Key Benefits Infographic Poster",
        "How to Use Facial Cleanser", "White Pump Bottle Product Shot",
    ],
    "hair-shampoo-oceandermx": [
        "FEMZOU Hair Cleanser Bottle", "Natural Ingredients Hair Cleanser Infographic", "Botanical Haircare Key Benefits Infographic",
        "FemZou Hair Cleanser Guide", "White Back-Label Hair Cleanser Bottle",
    ],
    "peach-body-lotion": [
        "Peach Hydrating Body Lotion Bottle", "Fresh Peach Shower Glow", "Peach-Infused Hydrating Softness",
        "Peachy Hydration Product Splash Ad", "Peach Lotion Spa Bathroom Ad", "Femzou Peach Lotion Back Label",
    ],
    "rose-mist": [
        "FemZou Rose Mist Bottle", "Rose Floral Skincare Spray Bottle", "FemZou Rose Mist Promotional Poster",
        "Pure Steam Distilled Rose Mist", "Rose Mist Benefits Infographic", "FemZou Rose Mist for Every Skin Type",
        "Rose Mist Skincare Guide", "Pure Rose Ingredient Infographic",
    ],
    "hydrating-face-wash-100ml": [
        "FEMZOU Hydrating Face Cleanser Product Shot", "FemZou Hydrating Cleanser Ad", "Aloe Vera Hydrating Cleanser Infographic",
        "5 Signs of Skin Sensitivity", "FEMZOU Cleanser_ Simple Three-Step Guide", "White Organic Cleanser Bottle Back Label",
    ],
    "dual-acid-power-facewash": [
        "FemZou Dual Acid Facewash Bottle", "FemZou Facewash Benefits Infographic", "FemZou\u2122 Botanical Facewash Infographic",
        "FemZou Facewash How-To Guide", "White Facial Cleanser Bottle", "Back-Label White Pump Bottle",
    ],
    "ha-vitamin-c-foaming-face-wash": [
        "FEMZOU Vitamin C Foaming Facewash Bottle", "HA + Vitamin C Foaming Face Wash", "FemZou Brightening Face Wash Ad",
        "Unveil Brighter Skin with FemZou", "HA+VC Foaming Face Wash Bottle", "Vitamin C Foaming Face Wash Bottle",
    ],
    "sunscreen-spf-50": [
        "FemZou SPF 50 Sunscreen Bottle", "FemZou SPF 50 Sunscreen Product Shot", "Glossy Glow Sunscreen Product Showcase",
        "Why You\u2019ll Trust It_ SPF 50 Benefits", "Key Benefits_ Golden Glow Sunscreen", "Radiant SPF 50 Key Benefits",
        "White Sunscreen Spray Bottle Product Shot",
    ],
    "hair-cleanser": [
        "FEMZOU Hair Cleanser Bottle Studio Shot", "FemZou Hair Cleanser in Water", "Hydrating Hair Benefits Advertisement",
        "Key Ingredients_ Aloe, Fenugreek & Rosemary", "Teal Hair Cleanser Pump Bottle", "Teal Pump Bottle Back Label",
    ],
    "cleansing-hair-conditioner-100ml": [
        "FEMZOU Gleaming Hair Conditioner Bottle", "FemZou Cleansing Hair Conditioner", "Before and After Hair Transformation",
        "FemZou Hair Conditioner Benefits", "Gleaming Hair Conditioner Usage Guide", "Back-Labeled White Conditioner Bottle",
    ],
    "gentle-cleansing-shampoo": [
        "FemZou Gentle Cleansing Shampoo Bottle", "Gentle Cleansing Shampoo Advertisement", "FemZou\u2122 Key Ingredients Infographic",
        "Femzou Hair Care Infographic", "How to Use Shampoo_ Three Simple Steps", "Scalp Care Benefits Beauty Infographic",
        "Gentle Cleansing Shampoo Bottle",
    ],
    "hair-mask": [
        "FEMZOU Hair Mask Jar", "Salon-Smooth Waves Beauty Ad", "Frizzy to Sleek Hair Transformation", "Sleek Hair Before and After",
        "How to Use Hair Mask", "Pink Hair Mask Ingredient Label", "Pink Hair Mask Jar Product Shot",
    ],
    "kiwi-body-lotion": [
        "Kiwi Hydrating Body Lotion Bottle", "Kiwi Deep Hydration Skincare Ad", "Kiwi Hydration for Radiant Skin",
        "Kiwi Hydrating Lotion Ingredients", "Kiwi Hydrating Lotion How-To Guide", "FEMZOU Kiwi Lotion Back Label",
    ],
    "aloe-vera-gel": [
        "FemZou Aloe Vera Gel Product Shot", "FEMZOU Aloe Vera Gel Lid", "Fresh Aloe Vera Gel Still Life",
        "FEMZOU Aloe Vera Gel Skincare Close-Up", "Aloe Moisture Repair Gel Poster", "Before and After Skincare Glow-2",
        "Visible Difference_ Radiant Skin Journey-1",
    ],
    "cold-cream": [
        "FEMZOU Cold Cream Product Display", "FEMZOU Cold Cream with Natural Ingredients", "FEMZOU Cold Cream Drizzle",
        "FEMZOU Cold Cream in Glossy Pour", "FemZou Cold Cream Splash Display", "Femzou Cold Cream Hydration Ad",
        "Key Skincare Ingredients Infographic", "Radiant Pink Cold Cream Advertisement", "Radiant Skin Before and After",
        "FEMZOU Cold Cream Usage Guide", "FEMZOU Cold Cream Safety Promise", "Naturally Sourced Cold Cream Label",
    ],
}

# left out on purpose (see docs/SEEDED-DATA.md)
SKIPPED = {
    "FemZou Conditioner Hair Transformation": "names a competitor brand (Dove)",
    "FemZou Shampoo Brightening Care": "shows skin actives that are not in a shampoo",
    "Key Skincare Ingredients Guide": "lists ingredients that are not on the De-Tan label",
    "Gleaming Hair Conditioner with Cream Swirl (1)": "duplicate",
    "FEMZOU Glutathione Foaming Facewash Infographic": "names lemon oil and licorice, which are not on the label",
    "How to Use Facial Cleanser (1)": "duplicate",
    "Natural Ingredients Hair Cleanser Infographic (1)": "duplicate",
    "FemZou Rose Mist Refresh Moment": "near-duplicate of the promotional poster",
    "Hyaluronic Acid Sunscreen Spray Ad": "claims 1% hyaluronic acid, which is not on the sunscreen label",
    "FemZou Sunscreen Glow Advertisement": "claims 100% new-gen UV filters; the label lists conventional filters",
    "Radiant Skin Vitamin Guide": "names vitamin E and mulberry, which are not on the HA + Vitamin C label",
    "FemZou Dual Acid Facewash Bottle (1)": "duplicate",
    "Back-Label White Pump Bottle (1)": "duplicate",
    "FemZou SPF 50 Sunscreen Product Shot (1)": "duplicate",
    "Aloe, Almond, and Shea Ingredients": "shows almond oil and shea butter for the aloe gel; no label confirms them",
    "FemZou Cold Cream_ How to Use": "near-duplicate of the cold cream usage guide",
    "Femzou Cold Cream Safety Promise (1)": "near-duplicate of the cold cream safety promise",
}


def alt_for(name):
    return name.replace("_", ":").replace(" (1)", "").replace("FEMZOU", "FemZou").replace("Femzou", "FemZou")


def main(folders):
    found = {}
    for folder in folders:
        for dirpath, _, files in os.walk(folder):
            if "__MACOSX" in dirpath:
                continue
            for f in files:
                if f.lower().endswith(".png"):
                    found[f[:-4]] = os.path.join(dirpath, f)
    out = {}
    for handle, names in GALLERY.items():
        dest = os.path.join(ROOT, "catalog", "images", handle)
        os.makedirs(dest, exist_ok=True)
        out[handle] = []
        for i, name in enumerate(names, 1):
            if name not in found:
                print("  missing:", name)
                continue
            fname = f"{i:02d}.jpg"
            subprocess.run(["sips", "-Z", "1400", "-s", "format", "jpeg", "-s", "formatOptions", "82",
                            found[name], "--out", os.path.join(dest, fname)], check=True, capture_output=True)
            out[handle].append({"file": fname, "alt": alt_for(name)})
    with open(os.path.join(ROOT, "data", "images.json"), "w") as fh:
        json.dump(out, fh, indent=2)
    used = {n for names in GALLERY.values() for n in names}
    unused = sorted(set(found) - used - set(SKIPPED))
    print(f"  {sum(len(v) for v in out.values())} photos for {len(out)} products")
    if unused:
        print("  not placed:", unused)


if __name__ == "__main__":
    main(sys.argv[1:])
