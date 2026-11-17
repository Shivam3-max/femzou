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
}

# left out on purpose (see docs/SEEDED-DATA.md)
SKIPPED = {
    "FemZou Conditioner Hair Transformation": "names a competitor brand (Dove)",
    "FemZou Shampoo Brightening Care": "shows skin actives that are not in a shampoo",
    "Key Skincare Ingredients Guide": "lists ingredients that are not on the De-Tan label",
    "Gleaming Hair Conditioner with Cream Swirl (1)": "duplicate",
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
