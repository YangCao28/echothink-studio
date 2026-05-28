# T06 Add Echothink Visual Assets

Date: 2026-05-28
Wave: W2
Prerequisites: T04
Delivery target: M1 asset bundle
Status: DONE

## Prerequisite Check

- T06 depends on T04.
- `docs/progress.md` marks T04 (`Define product branding inventory`) as `DONE`.
- T04 is the source of truth for icon sizes, About/first-run logo needs,
  installer naming (`EchothinkBrowserSetup`), and the attribution rules this
  task follows.

## Repository Root / Asset Placement Decision

The canonical-root mismatch recorded by T00 still holds: the requested root
`echothink-studio-new` contains only `docs/`, while the inherited Ungoogled
Chromium patch/config tree (the canonical build root the packaging and branding
patches consume) is one directory up.

T06 is the first task that produces real (non-documentation) build artifacts.
The asset bundle is therefore placed at the inherited canonical build root:

```text
assets/            (at the inherited build root, beside patches/ utils/ devutils/)
```

This matches the change plan's Phase 0 ("Add `assets/`") and section 5.2 paths
(`assets/icons/`, `assets/installer/`, `assets/about/`), and keeps the assets
where future branding/packaging patches (T05, T30/T32) can reference them.
Documentation for this task remains under `echothink-studio-new/docs`, as with
prior tasks.

## What Was Added

```text
assets/
  README.md                                  source, ownership, sizes manifest
  icons/
    echothink.svg                            master source artwork (hand-authored)
    echothink.ico                            multi-resolution app icon
    png/echothink-16.png                     app icon PNG exports (RGBA)
    png/echothink-20.png
    png/echothink-24.png
    png/echothink-32.png
    png/echothink-40.png
    png/echothink-48.png
    png/echothink-64.png
    png/echothink-128.png
    png/echothink-256.png
  installer/
    echothink-setup.ico                      EchothinkBrowserSetup exe icon
    README.md                                installer banner/dialog deferral note
  about/
    echothink-logo-64.png                    About / first-run logos (RGBA)
    echothink-logo-128.png
    echothink-logo-256.png
  tools/
    generate_icons.py                        reproducible Pillow generator
```

## Design, Source, and Ownership

- **Origin:** original artwork for the Echothink Browser project. Concept: a
  focal "think" dot emitting two "echo" ripples, white, on a rounded app tile
  with a vertical teal->deep-blue gradient (`#15C2D6` -> `#0A4F8A`).
- **Owner:** Echothink Browser project; distributed under repository terms.
- **Master:** `assets/icons/echothink.svg` is the auditable design source.
- **No upstream logo reuse:** no Chromium, Google Chrome, or Ungoogled Chromium
  icon/logo artwork is copied into any Echothink surface, per T04 attribution
  rules. Inherited attribution (root `LICENSE`, generated credits, README
  `Upstream Relationship`) is preserved by other tasks (T02/T05).

## Rendering Method (Environment Note)

The cairo-backed SVG rasterizer (`cairosvg`) was present but unusable in this
environment (`OSError: no library called "cairo-2" was found`). To stay
self-contained, raster assets are generated with `assets/tools/generate_icons.py`
using Pillow only: the design is drawn once at 1024 px with anti-aliased
primitives that reproduce the SVG geometry, then LANCZOS-downsampled to each
target size. The SVG remains the human-auditable master; the generator constants
mirror it and must be edited together.

## Required Windows Alpha Sizes — Coverage

| Requirement (from T04) | Delivered |
|---|---|
| Source master (SVG/lossless) | `icons/echothink.svg` |
| PNG app icons 16/20/24/32/40/48/64/128/256 | `icons/png/echothink-*.png` (9 files, verified) |
| Windows `.ico` (multi-res, same sizes) | `icons/echothink.ico` (9 resolutions, verified) |
| About/first-run logo PNG 64/128/256 | `about/echothink-logo-*.png` (3 files, verified) |
| Installer icon (`.ico`, same sizes) | `installer/echothink-setup.ico` (9 resolutions, verified) |
| Installer banner/dialog images | Deferred to T30/T32; documented in `installer/README.md` (dimensions depend on the installer technology chosen there). |

## Spec References (assets are referenced by branding/packaging specs)

- `docs/ungoogled_to_echothink_browser_change_plan.md` section 5.2 lists
  `assets/icons/`, `assets/installer/`, `assets/about/` as the branding asset
  paths; these now exist and are populated.
- `docs/echothink-browser-alpha/t04-define-product-branding-inventory.md`
  "Icon And Asset Requirements" lists the required sizes; all non-deferred
  items are delivered.
- `assets/README.md` is the per-bundle manifest linking sizes to purposes.

## Validation

Run from the asset (build) root:

| Command | Result |
|---|---|
| `python3 assets/tools/generate_icons.py` | Passed: wrote 9 PNG app icons, `echothink.ico`, `echothink-setup.ico`, and 3 About logos. |
| Pillow size/mode check on every `icons/png/*.png` and `about/*.png` | Passed: exact target sizes, RGBA mode. |
| Pillow `.ico` resolution check on `echothink.ico` and `echothink-setup.ico` | Passed: each contains 16, 20, 24, 32, 40, 48, 64, 128, 256. |
| Visual inspection of 256 px and 32 px exports | Passed: mark is legible at both large and small sizes. |
| `find assets -type f` | Passed: 17 files present under the planned structure. |

## Known Limitations / Follow-up

- The repository requested-root mismatch persists (T00); assets live at the
  inherited build root by design, not under `echothink-studio-new`.
- Raster icons are downsampled from one master rather than hand-tuned per size;
  production may want size-specific pixel hinting for the 16 px icon. Acceptable
  for Alpha.
- Installer banner/dialog bitmaps are deferred to T30/T32 once the installer
  technology is chosen (see `assets/installer/README.md`).
- Wiring these assets into Chromium resources and the installer is owned by
  later tasks (T05 branding patch; T30/T32 Windows packaging). T06 only adds and
  documents the bundle.
- A pinned Chromium source checkout was not available, so exact native icon
  resource replacement paths are verified by T05/T30, not here.
