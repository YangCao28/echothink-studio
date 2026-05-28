# T04 Define Product Branding Inventory

Date: 2026-05-28
Wave: W1
Delivery target: M1 branding inventory
Status: DONE

## Prerequisite Check

T04 depends on T00. `docs/progress.md` marks T00 as `DONE` and records the
repository-root mismatch as an acceptable baseline dependency for discovery and
documentation tasks.

The requested repository root remains documentation-only:

```text
C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new
```

The inherited Ungoogled Chromium patch/config tree used to identify concrete
branding touchpoints is:

```text
C:\Users\caoya\source\repos\echothink-studio
```

This task produced documentation only. It did not add assets, create patches,
change `patches/series`, or modify browser behavior.

## Branding Decisions

| Surface | Alpha decision |
|---|---|
| Product name | `Echothink Browser` |
| User-visible browser display name | `Echothink Browser` |
| Windows application display name | `Echothink Browser` |
| Windows Start Menu shortcut | `Echothink Browser` |
| Desktop shortcut, if created | `Echothink Browser` |
| Windows installed-app / uninstall display name | `Echothink Browser` |
| Installer executable/name stem | `EchothinkBrowserSetup` |
| About page heading | `Echothink Browser` |
| First-run page title and primary heading | `Echothink Browser` |
| Public support/download phrasing | `Echothink Browser` |
| Alpha executable/internal naming | May remain Chromium-derived if that reduces patch and packaging risk. Public Beta should revisit visible and executable identity in T30/T31. |

Channel suffixes are deferred to T30. Until then, the base visible product name
is always `Echothink Browser`; channel labels such as Canary, Dev, Beta,
Stable, or Enterprise Stable may be appended only in channel-specific packaging
or version surfaces.

## Product String Inventory

| Surface | Required user-visible result | Current local evidence | Owning follow-up |
|---|---|---|---|
| Repository presentation | Repo docs identify the project as `Echothink Browser` and keep an `Upstream Relationship` section. | `README.md` is still inherited `ungoogled-chromium`; docs already define the desired identity. | T02 or first repo-identity docs task |
| Browser product name in chrome UI | Menus, window/app labels, About settings, and native product headings show `Echothink Browser` where the browser identifies itself to users. | No local Chromium source checkout exists; the common repo contains patches only. Verify exact Chromium string resource files during T05. | T05 |
| `chrome://version` build label | Version page identifies the build as `Echothink Browser` while keeping version/channel facts visible. | `patches/extra/ungoogled-chromium/add-extra-channel-info.patch` currently changes `components/version_ui_strings.grdp` to append `ungoogled-chromium`. | T05, T30 |
| About/settings page | About page heading and local copy say `Echothink Browser`; links to open-source licenses and upstream credits remain available. | `patches/extra/ungoogled-chromium/remove-uneeded-ui.patch` touches `chrome/browser/resources/settings/about_page/about_page.html`. | T05 |
| First-run page | Title and heading say `Echothink Browser`; copy leads to login/enrollment and explains the local browser shell without embedding business data. | `patches/extra/ungoogled-chromium/first-run-page.patch` adds `chrome://ungoogled-first-run` and inline first-run copy in `chrome/browser/ui/webui/ungoogled_first_run.h`. | T05, T10, T11 |
| Credits and licenses | Chromium and Ungoogled Chromium attribution remain reachable from About or documentation. | `patches/extra/ungoogled-chromium/add-credits.patch` adds `third_party/ungoogled-chromium/LICENSE` and updates `tools/licenses/licenses.py`. Root `LICENSE` is inherited. | T05 and all patch tasks |
| Windows Start Menu | Start Menu shortcut is `Echothink Browser`. | No Windows platform repo or packaging files exist in the common tree. | T30, T31 |
| Windows installed app list | Apps & Features / uninstall entry is `Echothink Browser`. | No Windows installer metadata exists in the common tree. | T30, T31 |
| Installer executable | Installer file/name stem is `EchothinkBrowserSetup`. | Change plan already names this; no installer files exist yet. | T30, T31, T32 |
| Taskbar and shell icon label | Windows shell label and icon represent `Echothink Browser`. | No `assets/` path exists yet. | T06, T30, T31 |
| Default browser/file association prompts, if enabled | Any visible association prompt says `Echothink Browser`. | No Windows packaging or association config exists yet. | T30, T31 |

## About Page Copy Requirements

The About page or equivalent version surface should include:

- Product heading: `Echothink Browser`.
- Version, architecture, and channel when available.
- A short line such as:
  `Built on Chromium with the Ungoogled Chromium patch set.`
- A clear link to open-source licenses and credits.
- A clear support/download/update destination when the Windows update channel
  is defined.

The About page must not:

- Claim endorsement by Chromium, Google, or the Ungoogled Chromium project.
- Hide Chromium or Ungoogled Chromium attribution.
- Remove access to open-source license material.
- Make security claims stronger than the browser can enforce.

## First-Run Copy Requirements

First-run copy should be minimal and setup-oriented:

- Title: `Echothink Browser`.
- Primary action: sign in or enroll the device.
- Allowed setup links: login, device enrollment, diagnostics, update, and
  support/download.
- Attribution footer or secondary text:
  `Echothink Browser is built on Chromium and the Ungoogled Chromium patch set.`
- No project, task, artifact, workflow, chat, or other business data should be
  embedded in the local first-run page.

The existing inherited first-run page is useful as an insertion pattern, but
its current end-user how-to copy for manual extensions, spellcheck, and
Ungoogled Chromium feature education should not become the primary Echothink
setup experience.

## Icon And Asset Requirements

T06 should add assets under the planned paths:

```text
assets/icons/
assets/installer/
assets/about/
```

Required Alpha application icon assets:

| Asset | Required sizes / format | Purpose |
|---|---|---|
| Source master | SVG or high-resolution lossless source | Auditable source for all generated raster icons. |
| PNG app icons | 16, 20, 24, 32, 40, 48, 64, 128, and 256 px | Chromium resource patching, About/first-run UI, and high-DPI exports. |
| Windows `.ico` | Multi-resolution `.ico` containing 16, 20, 24, 32, 40, 48, 64, 128, and 256 px | Executable, Start Menu, taskbar, desktop shortcut, and installer shell identity. |
| About/first-run logo PNG | 64, 128, and 256 px | Local browser setup and About surfaces. |
| Installer icon | Multi-resolution `.ico`, same sizes as app icon | `EchothinkBrowserSetup` executable identity. |
| Installer banner/dialog images | PNG source plus installer-specific exports | Exact dimensions depend on the installer technology selected in T30/T32. |

All generated raster assets should include a short source/ownership note in the
asset task documentation. Do not copy Chromium, Google Chrome, or Ungoogled
Chromium logos into Echothink-branded surfaces.

## Attribution Requirements

Echothink branding must preserve upstream attribution:

- Keep the inherited root `LICENSE`.
- Keep Chromium attribution in docs and generated credits.
- Keep Ungoogled Chromium attribution in docs and generated credits.
- Preserve the inherited `third_party/ungoogled-chromium/LICENSE` addition from
  `patches/extra/ungoogled-chromium/add-credits.patch`.
- Add an `Upstream Relationship` section when the top-level README is rewritten.
- Do not imply Chromium, Google, or Ungoogled Chromium endorsement.
- Do not remove inherited copyright headers from patches or generated files.

## Expected Patch And Asset Split

T04 does not create patches. Future work should split branding this way:

- T05: create `patches/echothink/0001-branding.patch` for product strings,
  About/version copy, first-run identity copy, and attribution links.
- T06: add the asset bundle under `assets/` and document source/ownership.
- T30/T31: define and implement Windows packaging identity, Start Menu naming,
  installed-app naming, channel labels, and installer metadata.

If exact Chromium string/resource paths differ in the pinned source tree, T05
must record the verified paths in its task note rather than guessing from this
inventory.

## Validation

Validation for this discovery task is path and documentation based:

- Confirmed T00 is `DONE` in `docs/progress.md`.
- Confirmed relevant inherited touchpoints exist:
  - `patches/extra/ungoogled-chromium/first-run-page.patch`
  - `patches/extra/ungoogled-chromium/add-extra-channel-info.patch`
  - `patches/extra/ungoogled-chromium/add-credits.patch`
  - `patches/extra/ungoogled-chromium/remove-uneeded-ui.patch`
- Confirmed no `assets/` directory exists yet in the inherited tree.
- Confirmed this inventory records `Echothink Browser`,
  `EchothinkBrowserSetup`, icon requirements, copy requirements, and
  attribution requirements.

## Known Limitations

- No Chromium source checkout is present locally, so exact native string and
  icon resource files must be verified during T05/T06 against the pinned
  Chromium source after inherited patches are applied.
- No Windows platform repository or installer implementation is present in the
  inherited common tree, so installer UI bitmap dimensions and channel metadata
  remain finalization items for T30/T32.
- No actual branding patch, asset file, installer metadata, or browser runtime
  validation was produced by T04.
