#!/usr/bin/env python3
"""
Resizes the fleet photos in tools/source/vehicles/ into public/vehicles/ at the widths the site
requests (see src/lib/vehiclePhotos.ts). Source images are studio product shots on a near-white
background, so they're kept whole (no cropping) and displayed with object-contain in the app —
resizing here is purely for file size / responsive `srcset`, not composition.

    pip install pillow
    python tools/build_vehicle_photos.py
"""
from __future__ import annotations

from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SOURCE_DIR = ROOT / "tools" / "source" / "vehicles"
OUT_DIR = ROOT / "public" / "vehicles"

# slug (matches src/content/fleet.ts) -> source file
SOURCES = {
    "sedans": "sedans.png",
    "mpv-suv": "mpv-suv.png",
    "tempo-traveller": "tempo-traveller.jpg",
}

# Must match WIDTHS in src/lib/vehiclePhotos.ts.
WIDTHS = [480, 720, 960, 1280]


def main():
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    for slug, filename in SOURCES.items():
        src_path = SOURCE_DIR / filename
        if not src_path.exists():
            raise SystemExit(f"Missing source photo: {src_path}")
        im = Image.open(src_path).convert("RGB")
        for width in WIDTHS:
            if width >= im.width:
                resized = im
            else:
                height = round(im.height * width / im.width)
                resized = im.resize((width, height), Image.LANCZOS)
            out_path = OUT_DIR / f"{slug}-{width}.jpg"
            resized.save(out_path, "JPEG", quality=85, optimize=True)
            print("wrote", out_path.relative_to(ROOT))


if __name__ == "__main__":
    main()
