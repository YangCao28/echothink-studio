# Echothink Browser Visual Assets

This bundle holds the Echothink Browser visual identity assets added in task
T06. It is referenced by the branding inventory
(`docs/echothink-browser-alpha/t04-define-product-branding-inventory.md`) and by
the browser change plan
(`docs/ungoogled_to_echothink_browser_change_plan.md`, section 5.2).

## Layout

```text
assets/
  README.md                      This manifest (source, ownership, sizes).
  icons/
    echothink.svg                Master source artwork (hand-authored SVG).
    echothink.ico                Multi-resolution app icon (Windows shell/exe).
    png/echothink-<size>.png     App icon PNG exports.
  installer/
    echothink-setup.ico          EchothinkBrowserSetup executable icon.
    README.md                    Installer banner/dialog dimension notes.
  about/
    echothink-logo-<size>.png    About / first-run logo PNGs.
  tools/
    generate_icons.py            Reproducible raster generator (Pillow only).
```

## Source and ownership

- **Origin:** original artwork created for the Echothink Browser project.
- **Owner:** Echothink Browser project.
- **License:** owned by the project; distributed under the repository terms.
- **Master:** `assets/icons/echothink.svg` is the auditable design source. All
  raster files are generated from the matching design encoded in
  `assets/tools/generate_icons.py` (the cairo-backed SVG rasterizer was not
  available in the build environment, so the generator reproduces the SVG
  geometry with Pillow primitives and a high-resolution LANCZOS downsample).
- **Attribution rule:** no Chromium, Google Chrome, or Ungoogled Chromium logo
  or icon artwork is copied into any Echothink-branded surface. Upstream
  attribution is preserved separately (root `LICENSE`, generated credits, and
  the README `Upstream Relationship` section per T04).

## Design

A focal "think" dot emitting two outward "echo" ripples, in white, on a
rounded app tile with a vertical teal-to-deep-blue gradient.

- Tile gradient: `#15C2D6` (top) -> `#0A4F8A` (bottom).
- Mark: `#FFFFFF` (the outer ripple at 85% opacity).
- Tile corner radius: ~22% of the icon edge.

## Required sizes (Windows Alpha)

| Asset | Sizes / format | Purpose |
|---|---|---|
| `icons/echothink.svg` | vector | Auditable master source. |
| `icons/png/echothink-*.png` | 16, 20, 24, 32, 40, 48, 64, 128, 256 px (RGBA) | Chromium resource patching, About/first-run UI, high-DPI exports. |
| `icons/echothink.ico` | multi-resolution `.ico`: 16, 20, 24, 32, 40, 48, 64, 128, 256 px | Executable, Start Menu, taskbar, desktop shortcut, shell identity. |
| `installer/echothink-setup.ico` | multi-resolution `.ico`, same sizes as app icon | `EchothinkBrowserSetup` executable identity. |
| `about/echothink-logo-*.png` | 64, 128, 256 px (RGBA) | Local About and first-run surfaces. |
| `installer/` banners/dialogs | PNG source + installer-specific exports | Exact dimensions depend on the installer tech chosen in T30/T32. See `installer/README.md`. |

## Regenerating

```bash
python3 assets/tools/generate_icons.py
```

Requires Pillow. Edit `assets/icons/echothink.svg` and the matching constants in
`assets/tools/generate_icons.py` together so the master source and the raster
exports stay in sync.
