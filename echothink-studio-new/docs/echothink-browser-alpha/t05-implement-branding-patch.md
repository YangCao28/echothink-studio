# T05 Implement Branding Patch

Date: 2026-05-28
Wave: W2
Prerequisites: T01, T04
Delivery target: M1 `patches/echothink/0001-branding.patch`
Status: DONE

## Prerequisite Check

- T01 (Define Echothink patch discipline) is `DONE` in `docs/progress.md`.
- T04 (Define product branding inventory) is `DONE` in `docs/progress.md`.

Both prerequisites are satisfied. This task implements the first Echothink-owned
native patch using the convention from
`docs/echothink-browser-alpha/t01-define-echothink-patch-discipline.md` and the
identity decisions from
`docs/echothink-browser-alpha/t04-define-product-branding-inventory.md`.

### Repository-root note

The mandated task paths reference
`...\echothink-studio\echothink-studio-new`, which contains only `docs/`. The
inherited Ungoogled Chromium patch/config tree (with `patches/series`,
`patches/core`, `patches/extra`, `chromium_version.txt`) lives one directory up,
the same canonical-root mismatch documented and accepted by T00. The patch was
created in the inherited tree (where `patches/` exists) and this note lives under
`echothink-studio-new\docs` as required. The Chromium pin is `148.0.7778.178`
(`chromium_version.txt`).

## What This Patch Does

`patches/echothink/0001-branding.patch` updates only the smallest stable,
user-visible product-identity insertion points and preserves all upstream
attribution.

| File | Change | Effect |
|---|---|---|
| `chrome/app/chromium_strings.grd` | `IDS_PRODUCT_NAME` and `IDS_SHORT_PRODUCT_NAME` (non-Chrome-for-Testing `<else>` branch) `Chromium` -> `Echothink Browser` | Propagates the product name to the About settings surface, application menus, `chrome://version`, and other strings that template the product-name placeholder. |
| `chrome/browser/ui/webui/ungoogled_first_run.h` | First-run page `<title>` and `<h2>` heading `ungoogled-chromium` -> `Echothink Browser` | First-run identity surface (`chrome://ungoogled-first-run`) shows the Echothink identity. |

### Why these insertion points

- `IDS_PRODUCT_NAME` / `IDS_SHORT_PRODUCT_NAME` are the canonical GRIT product
  name resources. There is no policy, preference, or extension override for the
  compiled product name, so a native string patch is required. Changing these
  two messages is the smallest stable change that reaches the broadest set of
  user-visible identity surfaces, because many Chromium UI strings substitute
  the product-name placeholder rather than hardcoding "Chromium".
- The first-run identity lives in the inherited local WebUI source created by
  `patches/extra/ungoogled-chromium/first-run-page.patch`. Because Echothink
  patches apply after all inherited patches, that file already exists and can be
  edited directly.

### What this patch deliberately does NOT touch

- `chrome/app/theme/chromium/BRANDING` (`PRODUCT_FULLNAME`,
  `PRODUCT_SHORTNAME`, `MAC_BUNDLE_ID`, installer names). These feed
  executable/installer identity and packaging. Per the T04 inventory and the
  task instruction to "avoid renaming low-level internal executable identifiers
  in Alpha unless required by packaging," Windows packaging identity and
  executable naming are deferred to T30/T31.
- Credits and license generation: `add-credits.patch`,
  `third_party/ungoogled-chromium/LICENSE`, `tools/licenses/licenses.py`, the
  open-source-licenses link on the About page, and the root `LICENSE` are all
  untouched.
- The first-run attribution sentence ("This browser was built with
  ungoogled-chromium patches and differs from the default Chromium
  experience...") and all upstream links are preserved verbatim.

This keeps the patch small and single-purpose: product identity only.

## Patch Header

The patch carries the required Echothink header
(`# Echothink-Patch:`, `# Title:`, `# Area: branding`, `# Depends-On: none`,
`# Browser-Layer-Reason:`, `# Preferred-Surface-Checked:`,
`# Security-Critical-Areas: none`, `# Native-Files-Touched:`,
`# Rebase-Risk:`, `# Validation:`) per the T01 discipline.

`Depends-On` is `none` (no dependency on another Echothink patch). The patch
does have an ordering dependency on the inherited
`patches/extra/ungoogled-chromium/first-run-page.patch` (which creates
`ungoogled_first_run.h`); this is satisfied automatically because all Echothink
patches apply after all inherited patches, and it is called out in the patch
header scope notes and `Rebase-Risk`.

## Series Ordering

`patches/series` now ends with:

```text
extra/ungoogled-chromium/add-flag-for-disabling-jit.patch

echothink/0001-branding.patch
```

The Echothink entry is the tail block, after every inherited patch, with a blank
separator line, matching the expected shape in the T01 discipline doc. No
placeholder entries were added.

## Validation

Performed in the inherited tree (where `patches/` lives):

| Command | Result |
|---|---|
| `python3 devutils/check_patch_files.py` | Passed, exit 0 (patch exists and is referenced by `patches/series`; no unused/missing patches). |
| Inspect `patches/echothink/0001-branding.patch` placement | Passed: file present under `patches/echothink/`. |
| Inspect `patches/series` tail | Passed: `echothink/0001-branding.patch` is the final entry, after all inherited patches, separated by a blank line. |
| Real dry-run + apply against pinned Chromium source | Passed. Fetched the real `chrome/app/chromium_strings.grd` at tag `148.0.7778.178` from `chromium.googlesource.com`; reconstructed `chrome/browser/ui/webui/ungoogled_first_run.h` by applying the inherited `first-run-page.patch`; then `patch -p1 --dry-run` and a real `patch -p1` both applied **both hunks cleanly, exit 0, no fuzz, no offset, no rejects**. |
| Post-apply content check | Passed: `IDS_PRODUCT_NAME` and `IDS_SHORT_PRODUCT_NAME` read `Echothink Browser`; first-run `<title>` and `<h2>` read `Echothink Browser`; the `ungoogled-chromium`/`Chromium` attribution sentence remains; the Chrome-for-Testing `<then>` branch is unchanged. |

Recommended full-pipeline validation when a Chromium checkout is available:

```text
# Remote pristine apply of the whole ordered series (inherited + echothink):
python3 devutils/validate_patches.py --remote

# Or against a local unmodified Chromium 148.0.7778.178 source tree:
python3 devutils/validate_patches.py --local <path-to-unmodified-chromium-src>
```

Note: `validate_patches.py --remote` was documented by T03 as failing in the
inherited Windows environment while parsing Chromium `DEPS` (an inherited-tooling
issue unrelated to this patch). The targeted dry-run above validates this
patch's hunks directly against the real pinned source.

## Delivery Criteria Check

- `0001-branding.patch` exists: yes, at `patches/echothink/0001-branding.patch`.
- Browser-visible identity says `Echothink Browser`: yes
  (`IDS_PRODUCT_NAME`/`IDS_SHORT_PRODUCT_NAME` and the first-run identity).
- Upstream attribution remains visible: yes (credits/licenses untouched;
  first-run attribution sentence preserved).
- Patch applies after inherited patches: yes (tail of `patches/series`; applies
  cleanly after the inherited first-run patch creates the target file).

## Known Limitations / Follow-up

- No full browser build was produced in this environment; visual confirmation of
  the About surface and `chrome://ungoogled-first-run` rendering should happen in
  a real build during a build/smoke task.
- Channel suffixes and `chrome://version` build-label wording (the inherited
  `add-extra-channel-info.patch` still appends `ungoogled-chromium`) are left to
  T30 packaging; T05 changes only the product name, not the channel label.
- Executable/installer identity (`BRANDING`, Start Menu, uninstall entry,
  `EchothinkBrowserSetup`) is deferred to T30/T31 per the T04 inventory.
- Icon and logo assets are owned by T06; this patch changes strings only.
- `Rebase-Risk` for the `ungoogled_first_run.h` hunk is medium: if the inherited
  first-run page copy changes, this hunk's context must be rechecked.
