#!/usr/bin/env python3
"""Generate Echothink Browser raster icon assets from the master design.

This reproduces the design in ``assets/icons/echothink.svg`` (original artwork
for the Echothink Browser project) and emits the Windows Alpha icon bundle:

  assets/icons/png/echothink-{16,20,24,32,40,48,64,128,256}.png
  assets/icons/echothink.ico                (multi-resolution app icon)
  assets/installer/echothink-setup.ico       (installer executable icon)
  assets/about/echothink-logo-{64,128,256}.png

Rendering strategy: draw the design once at high resolution (MASTER px) with
anti-aliased primitives, then LANCZOS-downsample to each target size so every
exported icon is crisp and consistent with the master.

No Chromium / Google Chrome / Ungoogled Chromium artwork is used. The mark is a
focal "think" dot emitting two "echo" ripples on a teal->blue brand tile.

Dependencies: Pillow only (no native SVG/cairo dependency).
Run from the repository (asset) root:  python3 assets/tools/generate_icons.py
"""

import os

from PIL import Image, ImageDraw

# --- design constants, expressed in the 256 authoring space (see SVG) ---------
BASE = 256
CORNER = 56
DOT_C = (96, 128)
DOT_R = 16
ARC1_R = 44
ARC2_R = 76
ARC_HALF_SWEEP = 55  # degrees, ripple 1; ripple 2 uses 50
ARC2_HALF_SWEEP = 50
STROKE = 16
GRAD_TOP = (0x15, 0xC2, 0xD6)   # #15C2D6 teal/cyan
GRAD_BOT = (0x0A, 0x4F, 0x8A)   # #0A4F8A deep blue
MARK = (0xFF, 0xFF, 0xFF)

MASTER = 1024                    # high-res render size
SS = MASTER / BASE               # scale factor authoring -> master

# Windows Alpha required icon sizes (see docs/.../t04 and t06).
PNG_SIZES = [16, 20, 24, 32, 40, 48, 64, 128, 256]
ICO_SIZES = [16, 20, 24, 32, 40, 48, 64, 128, 256]
ABOUT_SIZES = [64, 128, 256]

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)            # assets/
ICONS_PNG = os.path.join(ROOT, "icons", "png")
ICONS_DIR = os.path.join(ROOT, "icons")
INSTALLER_DIR = os.path.join(ROOT, "installer")
ABOUT_DIR = os.path.join(ROOT, "about")


def _s(v):
    """Scale an authoring-space value to master space."""
    return v * SS


def _vertical_gradient(size, top, bottom):
    """Return an RGB gradient image (top color -> bottom color)."""
    grad = Image.new("RGB", (1, size))
    for y in range(size):
        t = y / (size - 1)
        grad.putpixel(
            (0, y),
            tuple(round(top[i] + (bottom[i] - top[i]) * t) for i in range(3)),
        )
    return grad.resize((size, size))


def _rounded_mask(size, radius):
    mask = Image.new("L", (size, size), 0)
    d = ImageDraw.Draw(mask)
    d.rounded_rectangle([0, 0, size - 1, size - 1], radius=radius, fill=255)
    return mask


def render_master():
    """Render the icon at MASTER resolution as an RGBA image."""
    # Tile: gradient clipped to a rounded rectangle.
    tile = _vertical_gradient(MASTER, GRAD_TOP, GRAD_BOT).convert("RGBA")
    mask = _rounded_mask(MASTER, round(_s(CORNER)))
    img = Image.new("RGBA", (MASTER, MASTER), (0, 0, 0, 0))
    img.paste(tile, (0, 0), mask)

    # Mark drawn on its own layer so the softer ripple can carry opacity.
    mark = Image.new("RGBA", (MASTER, MASTER), (0, 0, 0, 0))
    d = ImageDraw.Draw(mark)

    cx, cy = _s(DOT_C[0]), _s(DOT_C[1])

    # focal dot
    r = _s(DOT_R)
    d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=MARK + (255,))

    # ripple 1 (opaque)
    sw = _s(STROKE)
    r1 = _s(ARC1_R)
    d.arc(
        [cx - r1, cy - r1, cx + r1, cy + r1],
        start=-ARC_HALF_SWEEP, end=ARC_HALF_SWEEP,
        fill=MARK + (255,), width=round(sw),
    )

    # ripple 2 (85% opacity) -- draw on a scratch layer then fade
    r2 = _s(ARC2_R)
    ripple2 = Image.new("RGBA", (MASTER, MASTER), (0, 0, 0, 0))
    d2 = ImageDraw.Draw(ripple2)
    d2.arc(
        [cx - r2, cy - r2, cx + r2, cy + r2],
        start=-ARC2_HALF_SWEEP, end=ARC2_HALF_SWEEP,
        fill=MARK + (217,), width=round(sw),
    )
    mark = Image.alpha_composite(mark, ripple2)

    return Image.alpha_composite(img, mark)


def downsample(master, size):
    return master.resize((size, size), Image.LANCZOS)


def main():
    for p in (ICONS_PNG, ICONS_DIR, INSTALLER_DIR, ABOUT_DIR):
        os.makedirs(p, exist_ok=True)

    master = render_master()

    # PNG app icons
    rasters = {}
    for s in sorted(set(PNG_SIZES + ICO_SIZES + ABOUT_SIZES)):
        rasters[s] = downsample(master, s)

    written = []
    for s in PNG_SIZES:
        path = os.path.join(ICONS_PNG, f"echothink-{s}.png")
        rasters[s].save(path)
        written.append(path)

    # Multi-resolution .ico (app + installer share the same artwork)
    ico_imgs = [rasters[s] for s in ICO_SIZES]
    app_ico = os.path.join(ICONS_DIR, "echothink.ico")
    rasters[max(ICO_SIZES)].save(
        app_ico, format="ICO",
        sizes=[(s, s) for s in ICO_SIZES], append_images=ico_imgs,
    )
    written.append(app_ico)

    setup_ico = os.path.join(INSTALLER_DIR, "echothink-setup.ico")
    rasters[max(ICO_SIZES)].save(
        setup_ico, format="ICO",
        sizes=[(s, s) for s in ICO_SIZES], append_images=ico_imgs,
    )
    written.append(setup_ico)

    # About / first-run logo PNGs
    for s in ABOUT_SIZES:
        path = os.path.join(ABOUT_DIR, f"echothink-logo-{s}.png")
        rasters[s].save(path)
        written.append(path)

    for w in written:
        print("wrote", os.path.relpath(w, ROOT))


if __name__ == "__main__":
    main()
