#!/usr/bin/env python3
"""
Regenerates every logo / favicon / social-share image in /public.

    pip install fonttools pillow playwright && playwright install chromium
    python tools/build_brand_assets.py

Text is converted to outlines with the Poppins font (same family the site uses for
headings) so the SVG logos render identically everywhere, with no font dependency.
Set POPPINS_DIR if your Poppins .ttf files live somewhere else.
"""
from __future__ import annotations

import io
import os
import struct
from pathlib import Path

from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont
from PIL import Image
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"
POPPINS_DIR = Path(os.environ.get("POPPINS_DIR", "/usr/share/fonts/truetype/google-fonts"))

DARK = "#1A1A1A"
GOLD = "#D49E35"
RED = "#A83226"
CREAM = "#F8F7F4"
GOLD_INK = "#7A5606"  # gold dark enough for text on light backgrounds


# ---------------------------------------------------------------- text -> outline
class Face:
    def __init__(self, filename: str):
        self.font = TTFont(POPPINS_DIR / filename)
        self.gs = self.font.getGlyphSet()
        self.cmap = self.font.getBestCmap()
        self.upm = self.font["head"].unitsPerEm

    def path(self, text: str, size: float, x: float, y: float, tracking: float = 0.0):
        """Return (svg_path_d, advance_width) for text with baseline at (x, y)."""
        scale = size / self.upm
        pen = SVGPathPen(self.gs, ntos=lambda v: f"{v:.1f}".rstrip('0').rstrip('.'))
        cursor = 0.0
        for ch in text:
            name = self.cmap[ord(ch)]
            glyph = self.gs[name]
            t = (scale, 0, 0, -scale, x + cursor * scale + 0, y)
            glyph.draw(TransformPen(pen, t))
            cursor += glyph.width + tracking / scale
        return pen.getCommands(), cursor * scale

    def glyph_bounds(self, ch: str):
        bp = BoundsPen(self.gs)
        self.gs[self.cmap[ord(ch)]].draw(bp)
        return bp.bounds, self.gs[self.cmap[ord(ch)]].width


bold = Face("Poppins-Bold.ttf")
medium = Face("Poppins-Medium.ttf")


# ---------------------------------------------------------------- the mark
def mark_group(cx: float = 256, cy: float = 256, r: float = 256, ring: bool = True) -> str:
    """Dark disc, gold ring, gold 'P', red destination dot. Coordinates are 512-based scaled to r."""
    k = r / 256
    (xmin, ymin, xmax, ymax), adv = bold.glyph_bounds("P")
    target_h = 236 * k
    size = target_h / ((ymax - ymin) / bold.upm)
    scale = size / bold.upm
    gw = (xmax - xmin) * scale
    gx = cx - gw / 2 - xmin * scale - 6 * k          # optical nudge left (bowl is heavier)
    baseline = cy + target_h / 2 + ymin * scale
    d, _ = bold.path("P", size, gx, baseline)
    out = [f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="{DARK}"/>']
    if ring:
        out.append(
            f'<circle cx="{cx}" cy="{cy}" r="{r - 20 * k:.1f}" fill="none" stroke="{GOLD}" stroke-width="{11 * k:.1f}"/>'
        )
    out.append(f'<path d="{d}" fill="{GOLD}"/>')
    # destination dot sitting on the ring, lower right
    out.append(f'<circle cx="{cx + 0.62 * r:.1f}" cy="{cy + 0.62 * r:.1f}" r="{30 * k:.1f}" fill="{RED}" stroke="{DARK}" stroke-width="{9 * k:.1f}"/>')
    return "".join(out)


def svg(w: int, h: int, body: str, title: str | None = None) -> str:
    t = f"<title>{title.replace('&', '&amp;')}</title>" if title else ""
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w}" height="{h}" role="img">{t}{body}</svg>\n'


def write(name: str, data: str | bytes):
    p = PUBLIC / name
    p.write_bytes(data.encode() if isinstance(data, str) else data)
    print("wrote", p.relative_to(ROOT))


# ---------------------------------------------------------------- horizontal logo
def wordmark(on_dark: bool) -> str:
    ink = "#FFFFFF" if on_dark else DARK
    soft = "#FFFFFF" if on_dark else DARK
    tag = GOLD if on_dark else GOLD_INK
    parts = [f'<g transform="translate(0,0) scale(0.25)">{mark_group()}</g>']  # 128px mark
    x0 = 128 + 28
    d1, w1 = bold.path("P.M.S", 46, x0, 62)
    d2, w2 = medium.path("Tours & Travels", 46, x0 + w1 + 12, 62)
    d3, _ = bold.path("JOURNEY YOUR WAY", 17.5, x0 + 2, 100, tracking=4.2)
    parts.append(f'<path d="{d1}" fill="{ink}"/>')
    parts.append(f'<path d="{d2}" fill="{soft}" fill-opacity=".72"/>')
    parts.append(f'<path d="{d3}" fill="{tag}"/>')
    width = int(x0 + w1 + 12 + w2 + 4)
    return svg(width, 128, "".join(parts), "P.M.S Tours & Travels")


# ---------------------------------------------------------------- PNG / ICO
def ico_bytes(pngs: list[tuple[int, bytes]]) -> bytes:
    header = struct.pack("<HHH", 0, 1, len(pngs))
    entries, blobs, offset = b"", b"", 6 + 16 * len(pngs)
    for size, data in pngs:
        entries += struct.pack("<BBBBHHII", size % 256, size % 256, 0, 0, 1, 32, len(data), offset)
        blobs += data
        offset += len(data)
    return header + entries + blobs


def main():
    PUBLIC.mkdir(exist_ok=True)

    mark = svg(512, 512, mark_group(), "P.M.S Tours & Travels")
    write("logo-mark.svg", mark)
    # favicon: no ring (too fine at 16px), bigger P
    fav_body = (
        f'<circle cx="256" cy="256" r="256" fill="{DARK}"/>'
        + mark_group(r=256, ring=False).split("/>", 1)[1]
    )
    write("favicon.svg", svg(512, 512, fav_body))
    write("logo.svg", wordmark(on_dark=False))
    write("logo-white.svg", wordmark(on_dark=True))

    def square_icon(size: int, inset: float, full_bleed: bool) -> str:
        """inset = fraction of canvas the disc occupies."""
        r = size * inset / 2
        bg = f'<rect width="{size}" height="{size}" fill="{DARK}"/>' if full_bleed else ""
        return svg(size, size, bg + mark_group(size / 2, size / 2, r))

    og_html = f"""<!doctype html><html><head><meta charset="utf-8"><style>
      *{{margin:0;box-sizing:border-box}}
      body{{width:1200px;height:630px;background:{DARK};font-family:'Poppins',sans-serif;color:#fff;position:relative;overflow:hidden}}
      .glow{{position:absolute;right:-180px;top:-140px;width:760px;height:760px;border-radius:50%;
             border:2px solid {GOLD}55;box-shadow:0 0 0 70px {GOLD}0f,0 0 0 150px {GOLD}09}}
      .road{{position:absolute;left:0;right:0;bottom:0;height:150px;background:linear-gradient(0deg,#0f0f0f,transparent)}}
      .wrap{{position:absolute;left:84px;top:72px;right:84px;bottom:72px;display:flex;flex-direction:column;justify-content:space-between}}
      .logo{{height:104px;align-self:flex-start}}
      h1{{font-weight:700;font-size:78px;line-height:1.02;letter-spacing:-2.6px;max-width:860px}}
      h1 span{{color:{GOLD}}}
      p{{font-size:27px;color:#ffffffb8;margin-top:22px;font-weight:500}}
      .bar{{display:flex;gap:16px;align-items:center;font-weight:600;font-size:24px}}
      .pill{{background:{RED};padding:14px 26px;border-radius:999px}}
      .muted{{color:#ffffff99}}
    </style></head><body><div class="glow"></div><div class="road"></div>
    <div class="wrap">
      <img class="logo" src="data:image/svg+xml;base64,__LOGO__">
      <div><h1>Car rentals with driver, <span>local &amp; outstation.</span></h1>
      <p>Sedans, MPVs, SUVs and Tempo Travellers across South India.</p></div>
      <div class="bar"><span class="pill">+91 63807 98106</span><span class="muted">Airport transfers · Temple tours · Family trips</span></div>
    </div></body></html>"""
    import base64

    logo_b64 = base64.b64encode(wordmark(on_dark=True).encode()).decode()
    og_html = og_html.replace("__LOGO__", logo_b64)

    with sync_playwright() as p:
        browser = p.chromium.launch()

        def shot_svg(markup: str, size: int) -> bytes:
            page = browser.new_page(viewport={"width": size, "height": size}, device_scale_factor=1)
            page.set_content(f'<html><body style="margin:0;background:transparent">{markup}</body></html>')
            data = page.screenshot(omit_background=True, clip={"x": 0, "y": 0, "width": size, "height": size})
            page.close()
            return data

        def raster(markup_512: str, size: int) -> bytes:
            markup = markup_512.replace('width="512" height="512"', f'width="{size}" height="{size}"', 1)
            return shot_svg(markup, size)

        fav512 = svg(512, 512, fav_body)
        icon_any = svg(512, 512, mark_group())
        write("icon-192.png", raster(icon_any, 192))
        write("icon-512.png", raster(icon_any, 512))
        maskable = svg(512, 512, f'<rect width="512" height="512" fill="{DARK}"/>' + mark_group(256, 256, 256 * 0.78))
        write("icon-maskable-512.png", raster(maskable, 512))
        apple = svg(512, 512, f'<rect width="512" height="512" fill="{DARK}"/>' + mark_group(256, 256, 256 * 0.86))
        write("apple-touch-icon.png", raster(apple, 180))
        ico = [(s, raster(fav512, s)) for s in (16, 32, 48)]
        write("favicon.ico", ico_bytes(ico))
        write("favicon-48x48.png", ico[2][1])

        page = browser.new_page(viewport={"width": 1200, "height": 630})
        page.set_content(og_html)
        page.wait_for_timeout(400)
        write("og-image.png", page.screenshot())
        browser.close()

    # optimise OG image size
    im = Image.open(PUBLIC / "og-image.png").convert("RGB")
    buf = io.BytesIO()
    im.save(buf, "PNG", optimize=True)
    write("og-image.png", buf.getvalue())


if __name__ == "__main__":
    main()
