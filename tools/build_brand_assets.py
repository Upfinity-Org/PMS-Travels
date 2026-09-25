#!/usr/bin/env python3
"""
Regenerates every logo / favicon / social-share image in /public from the real brand logo at
tools/source/pms-logo.jpg (a lockup on a solid black canvas: a pulse line, "PMS", a bus/car
pictogram, and "TOURS & TRAVELS" beneath a swoosh).

    pip install pillow numpy playwright && playwright install chromium
    python tools/build_brand_assets.py

The source is a flat JPEG with no alpha channel, so the black background is keyed out to
transparency by treating each pixel's own brightness as its alpha (an "unpremultiply against
black" — standard for extracting a light logo cleanly off a solid dark matte).
"""
from __future__ import annotations

import io
from pathlib import Path

import numpy as np
from PIL import Image
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"
SOURCE_LOGO = ROOT / "tools" / "source" / "pms-logo.jpg"

DARK = "#1A1A1A"

# Content bounding boxes hand-measured from the 1600x1600 source (see the row/column brightness
# histograms used to find them) — the mark (pulse + "PMS" + bus/car pictogram) and the full lockup
# (mark + "TOURS & TRAVELS" + swoosh) don't separate into non-overlapping shapes, so both crops
# keep the "PMS" lettering; MARK_BOX just excludes the smaller "TOURS & TRAVELS" line beneath it.
MARK_BOX = (109, 451, 1556, 914)  # x0, y0, x1, y1
LOCKUP_BOX = (96, 451, 1564, 1174)


def unpremultiply_from_black(im: Image.Image) -> Image.Image:
    """Keys a light logo off a solid black background: alpha = brightness, then un-darkens color."""
    arr = np.asarray(im.convert("RGB")).astype(np.float32)
    alpha = arr.max(axis=2)
    safe = np.where(alpha == 0, 1, alpha)
    rgb = np.clip(arr * 255.0 / safe[..., None], 0, 255)
    return Image.fromarray(np.dstack([rgb, alpha]).astype(np.uint8), mode="RGBA")


def write(name: str, data: bytes):
    p = PUBLIC / name
    p.write_bytes(data)
    print("wrote", p.relative_to(ROOT))


def png_bytes(im: Image.Image) -> bytes:
    buf = io.BytesIO()
    im.save(buf, "PNG", optimize=True)
    return buf.getvalue()


def fit_on_square(mark: Image.Image, size: int, coverage: float, bg: tuple[int, int, int, int]) -> Image.Image:
    """Centers `mark` on a size x size canvas, scaled so its longest side is `coverage` * size."""
    canvas = Image.new("RGBA", (size, size), bg)
    scale = (size * coverage) / max(mark.width, mark.height)
    resized = mark.resize((max(1, round(mark.width * scale)), max(1, round(mark.height * scale))), Image.LANCZOS)
    x = (size - resized.width) // 2
    y = (size - resized.height) // 2
    canvas.alpha_composite(resized, (x, y))
    return canvas


def ico_bytes(pngs: list[tuple[int, bytes]]) -> bytes:
    import struct

    header = struct.pack("<HHH", 0, 1, len(pngs))
    entries, blobs, offset = b"", b"", 6 + 16 * len(pngs)
    for size, data in pngs:
        entries += struct.pack("<BBBBHHII", size % 256, size % 256, 0, 0, 1, 32, len(data), offset)
        blobs += data
        offset += len(data)
    return header + entries + blobs


def main():
    PUBLIC.mkdir(exist_ok=True)
    if not SOURCE_LOGO.exists():
        raise SystemExit(f"Source logo not found at {SOURCE_LOGO}. Copy the brand logo there first.")

    source = Image.open(SOURCE_LOGO)
    transparent = unpremultiply_from_black(source)

    mark = transparent.crop(MARK_BOX)  # "PMS" + pulse + bus/car pictogram, no subtext (for small sizes)
    lockup = transparent.crop(LOCKUP_BOX)  # full lockup including "TOURS & TRAVELS" (for larger sizes)

    write("logo-mark.png", png_bytes(mark))
    write("logo-lockup.png", png_bytes(lockup))

    black_opaque = (0, 0, 0, 255)
    write("favicon-48x48.png", png_bytes(fit_on_square(mark, 48, 0.82, black_opaque)))
    write("apple-touch-icon.png", png_bytes(fit_on_square(mark, 180, 0.78, black_opaque)))
    write("icon-192.png", png_bytes(fit_on_square(mark, 192, 0.78, black_opaque)))
    write("icon-512.png", png_bytes(fit_on_square(mark, 512, 0.78, black_opaque)))
    # Maskable icons get cropped to a circle/rounded-square by the OS, so the mark must sit well
    # inside the safe zone (roughly the middle 66%) — smaller coverage than the plain icons above.
    write("icon-maskable-512.png", png_bytes(fit_on_square(mark, 512, 0.58, black_opaque)))

    favicon_sizes = [16, 32, 48]
    ico_frames = [(s, png_bytes(fit_on_square(mark, s, 0.82, black_opaque))) for s in favicon_sizes]
    write("favicon.ico", ico_bytes(ico_frames))

    # Social-share (Open Graph) image: real photography feel isn't available without stock photos
    # here, so this leans on the brand's own dark/gold palette plus the actual logo lockup.
    og_html = f"""<!doctype html><html><head><meta charset="utf-8"><style>
      *{{margin:0;box-sizing:border-box}}
      body{{width:1200px;height:630px;background:{DARK};font-family:'Poppins',sans-serif;color:#fff;position:relative;overflow:hidden}}
      .glow{{position:absolute;right:-180px;top:-140px;width:760px;height:760px;border-radius:50%;
             border:2px solid #D49E3555;box-shadow:0 0 0 70px #D49E350f,0 0 0 150px #D49E3509}}
      .wrap{{position:absolute;left:84px;top:72px;right:84px;bottom:72px;display:flex;flex-direction:column;justify-content:space-between}}
      .logo{{height:150px;align-self:flex-start}}
      h1{{font-weight:700;font-size:78px;line-height:1.02;letter-spacing:-2.6px;max-width:860px}}
      h1 span{{color:#D49E35}}
      p{{font-size:27px;color:#ffffffb8;margin-top:22px;font-weight:500}}
      .bar{{display:flex;gap:16px;align-items:center;font-weight:600;font-size:24px}}
      .pill{{background:#A83226;padding:14px 26px;border-radius:999px}}
      .muted{{color:#ffffff99}}
    </style></head><body><div class="glow"></div>
    <div class="wrap">
      <img class="logo" src="data:image/png;base64,__LOGO__">
      <div><h1>Car rentals with driver, <span>local &amp; outstation.</span></h1>
      <p>Sedans, MPVs, SUVs and Tempo Travellers across South India.</p></div>
      <div class="bar"><span class="pill">+91 63807 98106</span><span class="muted">Airport transfers &middot; Temple tours &middot; Family trips</span></div>
    </div></body></html>"""
    import base64

    logo_b64 = base64.b64encode(png_bytes(lockup)).decode()
    og_html = og_html.replace("__LOGO__", logo_b64)

    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(viewport={"width": 1200, "height": 630})
        page.set_content(og_html)
        page.wait_for_timeout(300)
        og_bytes = page.screenshot()
        browser.close()

    im = Image.open(io.BytesIO(og_bytes)).convert("RGB")
    buf = io.BytesIO()
    im.save(buf, "PNG", optimize=True)
    write("og-image.png", buf.getvalue())


if __name__ == "__main__":
    main()
