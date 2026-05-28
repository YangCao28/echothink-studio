# Echothink Browser Alpha Progress

Last updated: 2026-05-28

This file is the shared source of truth for browser Alpha task status. Task
notes should record changed files, validation commands, validation results, and
known limitations here.

## Task Status

| ID | Wave | Task | Prerequisites | Status | Notes |
|---|---|---|---|---|---|
| T00 | W0 | Baseline repo audit | None | DONE | Audit note created at `docs/echothink-browser-alpha/t00-baseline-repo-audit.md`. No repo behavior changed. Critical baseline gap: requested root `echothink-studio-new` contains only `docs/`; inherited Ungoogled Chromium patch/config files are present one directory up at `C:\Users\caoya\source\repos\echothink-studio`. Follow-on implementation tasks must resolve or explicitly accept the canonical root mismatch before patch/build work. |
| T01 | W1 | Define Echothink patch discipline | T00 | DONE | Patch convention doc created at `docs/echothink-browser-alpha/t01-define-echothink-patch-discipline.md`. T00 is DONE and the canonical-root mismatch is carried forward as an acceptable baseline dependency for this docs-only task. No patch was produced; `patches/series` was not changed. |
| T02 | W2 | Define Echothink repo structure | T01 | DONE | Repo skeleton plan created at `docs/echothink-browser-alpha/t02-define-echothink-repo-structure.md`. T01 is DONE; the canonical-root mismatch is carried forward as an acceptable baseline dependency for this docs-only task. Defines owner/purpose/expected-contents/creation-trigger for `patches/echothink/`, `extensions/echothink-workspace/`, `assets/`, `build/windows/`, and the docs surface; specifies when `patches/series` entries may be added and how placeholders/generated artifacts are treated. No directory created, no patch produced, `patches/series` unchanged (108 inherited entries, 0 echothink). |
| T03 | W1 | Validate inherited patch pipeline | T00 | DONE | Validation note created at `docs/echothink-browser-alpha/t03-validate-inherited-patch-pipeline.md`. T00 is DONE and the canonical-root mismatch is carried forward as an acceptable baseline dependency for validating the inherited tree one directory up. `patches/series` has 108 entries, 0 missing files, 0 duplicates, and 0 Echothink entries. Existing Windows/tooling failures are documented as baseline issues. No Echothink patch work started. |
| T04 | W1 | Define product branding inventory | T00 | DONE | Branding inventory created at `docs/echothink-browser-alpha/t04-define-product-branding-inventory.md`. T00 is DONE and the canonical-root mismatch is carried forward as an acceptable baseline dependency for this docs-only task. User-visible name is `Echothink Browser`; Windows Start Menu name is `Echothink Browser`; installer name stem is `EchothinkBrowserSetup`; About/first-run copy, icon asset requirements, and Chromium/Ungoogled Chromium attribution requirements are documented. No patch or asset work started. |
| T06 | W2 | Add Echothink visual assets | T04 | DONE | Asset bundle created at the inherited canonical build root `assets/` (icons/, installer/, about/, tools/), with task note at `docs/echothink-browser-alpha/t06-add-echothink-visual-assets.md`. T04 is DONE; the canonical-root mismatch is carried forward — as the first artifact-producing task, assets live at the build root the packaging/branding patches consume, not under docs-only `echothink-studio-new`. Delivered original Echothink artwork: master SVG, PNG app icons (16/20/24/32/40/48/64/128/256), multi-resolution `echothink.ico` and `echothink-setup.ico`, and About/first-run logos (64/128/256). All required Windows Alpha sizes verified present. Installer banner/dialog bitmaps deferred to T30/T32. Wiring into Chromium/installer owned by T05/T30/T32. |
| T07 | W1 | Define default policy/preference set | T00 | DONE | Defaults spec created at `docs/echothink-browser-alpha/t07-define-default-policy-preference-set.md`. T00 is DONE and the canonical-root mismatch is carried forward as an acceptable baseline dependency for this docs-only task. Homepage, New Tab, search URL, suggest URL, default bookmarks, preferred policy/preference surfaces, and enterprise-safe defaults are documented. No patch or backend work started. |
| T09 | W1 | Confirm New Tab insertion point | T00 | DONE | Hook decision created at `docs/echothink-browser-alpha/t09-confirm-new-tab-insertion-point.md`. T00 is DONE and the canonical-root mismatch is carried forward as an acceptable baseline dependency for this docs-only task. Selected hook: `HandleNewTabPageLocationOverride()` via the normal-profile New Tab override preference. Avoid a global `--custom-ntp` default for Alpha because the inherited switch can affect incognito external New Tabs. No patch work started. |

## T00 Notes

Changed documentation:

- `docs/echothink-browser-alpha/t00-baseline-repo-audit.md`
- `docs/progress.md`

Recorded baseline:

- Chromium pin from inherited tree: `148.0.7778.178`.
- Repo revision from inherited tree: `1`.
- Git HEAD observed in inherited tree:
  `95f6fe1c945624ea19746084d4ecc3e33c1dee3f`.
- Patch pipeline documented: downloads, pruning, patch application, domain
  substitution, GN generation, and Ninja build invocation.
- Known insertion points documented for New Tab, search provider, first-run,
  flags/defaults, extension handling, and Side Panel-adjacent inherited UI.
- Areas to keep inherited from Chromium/Ungoogled Chromium documented.

Validation commands and results:

| Command | Result |
|---|---|
| Requested-root path check for required patch/config files | All required build/config paths missing under `echothink-studio-new`; only `docs/` is present. |
| Inherited-root path check for required patch/config files | All required build/config paths present under `C:\Users\caoya\source\repos\echothink-studio`. |
| `python devutils\validate_config.py` | Failed with unused-patch warnings due to Windows path separator mismatch in the unused-patch check. |
| Direct PowerShell validation of `patches\series` entries | Passed: `series_entries=108`, `missing_count=0`. |
| `python devutils\check_downloads_ini.py -d downloads.ini` | Passed. |
| `python devutils\check_gn_flags.py` | Passed. |

Known limitations:

- T00 did not apply patches, download Chromium, build Chromium, or run browser
  smoke tests.
- `python devutils\validate_config.py` is not clean on Windows in the inherited
  tree until path normalization is fixed or the check is run in a POSIX-style
  environment.
- `python devutils\check_downloads_ini.py` fails with no arguments in this
  environment because its default downloads list is a string list; passing
  `-d downloads.ini` succeeds.
- No `patches/echothink/`, `extensions/echothink-workspace/`, `assets/`, or
  `build/windows/` path exists yet.

## T01 Notes

Changed documentation:

- `docs/echothink-browser-alpha/t01-define-echothink-patch-discipline.md`
- `docs/ungoogled_to_echothink_browser_change_plan.md`
- `docs/echothink_browser_construction.md`
- `docs/progress.md`

Defined patch discipline:

- Echothink-owned native Chromium patches must live under `patches/echothink/`.
- Patch names must use `NNNN-short-kebab-case-purpose.patch`.
- Patches must be small, single-purpose, UTF-8 unified diffs compatible with
  the inherited `patch -p1` pipeline.
- Echothink entries in `patches/series` must be slash-delimited and appended
  after all inherited patches.
- Placeholder `patches/series` entries are forbidden.
- Every Echothink patch must include the required header documenting browser
  ownership, preferred surfaces checked, protected areas, touched native files,
  rebase risk, and validation.
- Future tasks must prefer policy, preferences, extension APIs, web-app/backend
  ownership, or existing Chromium hooks before native Chromium patching.
- Network stack, TLS/certificate validation, sandbox, renderer internals,
  download manager behavior, history manager behavior, bookmark manager
  behavior, password manager behavior, cookie/site-storage behavior, and
  DevTools behavior are explicitly protected.
- Review checklists are defined for new patches and future Chromium rebases.

Validation commands and results:

| Command | Result |
|---|---|
| `Test-Path docs\echothink-browser-alpha\t01-define-echothink-patch-discipline.md` | Passed. |
| `rg -n "NNNN-short-kebab-case-purpose|Required Patch Header|Forbidden Native Changes|Chromium Rebase Checklist|patches/echothink|patches/series" docs\echothink-browser-alpha\t01-define-echothink-patch-discipline.md` | Passed. |
| `rg -n "\| T01 \| W1 \| Define Echothink patch discipline" docs\progress.md` | Passed. |
| Inherited-root path check for `patches\series`, `patches\core`, and `patches\extra` | Present under `C:\Users\caoya\source\repos\echothink-studio`. |
| Requested-root path check for `patches\series` and `patches\echothink` | Missing under `echothink-studio-new`, as documented by T00. |

Known limitations:

- T01 did not create `patches/echothink/`, produce a patch, update
  `patches/series`, or run patch application.
- Patch placement and ordering validation are defined but remain deferred until
  a task creates the first Echothink patch.
- The requested repository root still contains only documentation; the inherited
  patch/config tree remains one directory up.

## T02 Notes

Changed documentation:

- `docs/echothink-browser-alpha/t02-define-echothink-repo-structure.md`
- `docs/progress.md`

Prerequisite status:

- T02 depends on T01.
- T01 is marked `DONE` (and records T00 as `DONE`).
- The requested-root mismatch remains accepted as a baseline dependency for
  this docs-only skeleton plan. Documentation lives under
  `echothink-studio-new\docs`; the canonical browser repo (inherited patch tree)
  is one directory up at `C:\Users\caoya\source\repos\echothink-studio`.

Skeleton decisions:

- Four Echothink-owned paths defined with owner, purpose, expected contents, and
  creation trigger: `patches/echothink/` (T05+), `extensions/echothink-workspace/`
  (T12), `assets/` with `icons/`, `installer/`, `about/` (T06), and
  `build/windows/` (T32). Docs surface (`docs/`, `docs/echothink-browser-alpha/`)
  documented as the planning/convention home.
- `patches/series` entry timing restated from T01: an `echothink/NNNN-*.patch`
  line may be added only when the patch file exists and is active; placeholder
  entries forbidden; Echothink entries form a contiguous tail after the final
  inherited entry `extra/ungoogled-chromium/add-flag-for-disabling-jit.patch`.
- Placeholder/generated-artifact policy defined: no empty directories, no stub
  patch/doc files, no committed build outputs (Chromium source, `out/`, archives,
  installers); only canonical shipped assets are committed under `assets/`.
- T02 created no directory, produced no patch, and did not modify
  `patches/series`.

Validation commands and results:

| Command | Result |
|---|---|
| Target-path existence check for `patches/echothink`, `extensions`, `extensions/echothink-workspace`, `assets`, `build`, `build/windows` | All MISSING — confirms the skeleton is a plan and T02 introduces no directories. |
| `patches/` layer listing | `core/`, `extra/`, `upstream-fixes/` present; no `echothink/`. Inherited layers untouched. |
| Non-blank `patches/series` entry count | `108` — unchanged from T00/T03 baseline. |
| `grep -c echothink patches/series` | `0` — series remains inherited-only. |
| `patches/series` tail check | Final inherited entry is `extra/ungoogled-chromium/add-flag-for-disabling-jit.patch`. |
| Cross-reference check vs `t01-define-echothink-patch-discipline.md` and `echothink_browser_construction.md` section 4 | Path names, patch filenames, and ordering rules match. |

Known limitations:

- T02 did not create `patches/echothink/`, `extensions/echothink-workspace/`,
  `assets/`, or `build/windows/`; downstream tasks materialize them with real
  content.
- The canonical-root mismatch is unresolved; the first task to physically create
  these directories (T05/T06/T08/T12/T32) must resolve or explicitly accept it
  and record the decision here.
- Exact `manifest.json` fields, asset dimensions, and Windows channel/update
  metadata remain owned by T12, T06/T04, and T30/T32.

## T03 Notes

Changed documentation:

- `docs/echothink-browser-alpha/t03-validate-inherited-patch-pipeline.md`
- `docs/progress.md`

Prerequisite status:

- T03 depends on T00.
- T00 is marked `DONE`.
- The requested-root mismatch remains accepted as a baseline dependency for
  this validation task: documentation lives under `echothink-studio-new\docs`,
  while inherited patch/config validation was run from
  `C:\Users\caoya\source\repos\echothink-studio`.

Validation commands and results:

| Command | Result |
|---|---|
| `python devutils\validate_config.py` | Failed as a baseline Windows tooling issue: unused-patch detection reports all patches unused because it compares Windows backslash paths against slash-delimited `patches/series` entries. |
| Direct PowerShell validation of `patches\series` entries | Passed: `entries=108`, `missing=0`, `duplicates=0`, `echothink_entries=0`. |
| Direct imported `check_patch_readability()` and `check_series_duplicates()` | Passed: `readability_warnings=False`, `duplicate_warnings=False`. |
| `python devutils\check_patch_files.py` | Failed with the same baseline Windows path separator issue as `validate_config.py`. |
| `python devutils\check_downloads_ini.py -d downloads.ini` | Passed. |
| `python devutils\check_gn_flags.py` | Passed. |
| `python -m pytest -c pytest.ini` from `utils\` | Failed before running tests because `pytest-cov` is missing from the local environment. |
| `python -m pytest -c pytest.ini -o addopts=''` from `utils\` | Ran without coverage addopts: 3 passed, 1 failed. The failing test is POSIX-specific and expects `/bin/false` to exist on Windows. |
| `python -m pytest -c pytest.ini` from `devutils\` | Failed before running tests because `pytest-cov` is missing from the local environment. |
| `python -m pytest -c pytest.ini -o addopts=''` from `devutils\` | Passed: 2 tests passed. |
| `where.exe patch` | Found GNU patch at `C:\Users\caoya\anaconda3\Library\usr\bin\patch.exe`. |
| `python -c "import importlib.util; ..."` | Confirmed `requests=True`, so the Python dependency for remote validation is available. |
| `python devutils\validate_patches.py --remote` | Failed before patch application. It attempted to download 639 remote files, then failed while parsing Chromium `DEPS`. |
| `python devutils\validate_patches.py --remote -v` | Confirmed the parser failure occurs while reading `https://chromium.googlesource.com/chromium/src.git/+/148.0.7778.178/DEPS?format=TEXT`; line 218 uses `Str('')`, which the inherited parser does not support. |

Patch baseline:

- `patches/series` remains inherited-only before Echothink patch additions.
- Current active series entries: 108.
- Current final inherited entry:
  `extra/ungoogled-chromium/add-flag-for-disabling-jit.patch`.
- `patches/echothink/` still does not exist in the inherited tree.
- No `echothink/*` entries exist in `patches/series`.

Known limitations:

- No local pristine Chromium source tree was available for
  `python devutils\validate_patches.py --local <path-to-unmodified-chromium-src>`.
- The attempted remote patch application validator did not reach patch
  application because of the inherited `DEPS` parser issue.
- Existing failures are baseline inherited-tooling or Windows-portability
  issues, not Echothink patch regressions.

## T04 Notes

Changed documentation:

- `docs/echothink-browser-alpha/t04-define-product-branding-inventory.md`
- `docs/ungoogled_to_echothink_browser_change_plan.md`
- `docs/echothink_browser_construction.md`
- `docs/progress.md`

Prerequisite status:

- T04 depends on T00.
- T00 is marked `DONE`.
- The requested-root mismatch remains accepted as a baseline dependency for
  this docs-only branding inventory. Documentation lives under
  `echothink-studio-new\docs`; inherited branding touchpoints were inspected in
  `C:\Users\caoya\source\repos\echothink-studio`.

Branding decisions:

- Product name: `Echothink Browser`.
- Windows application display name: `Echothink Browser`.
- Windows Start Menu shortcut name: `Echothink Browser`.
- Windows installed-app / uninstall display name: `Echothink Browser`.
- Installer executable/name stem: `EchothinkBrowserSetup`.
- About page heading and first-run page title/heading:
  `Echothink Browser`.
- Alpha may keep Chromium-derived executable/internal naming if needed to
  reduce patch risk; public Beta should revisit this through T30/T31.

Concrete inherited touchpoints checked:

- `patches/extra/ungoogled-chromium/first-run-page.patch` for inherited
  first-run WebUI pattern and copy.
- `patches/extra/ungoogled-chromium/add-extra-channel-info.patch` for
  `chrome://version` build label changes.
- `patches/extra/ungoogled-chromium/add-credits.patch` for Chromium and
  Ungoogled Chromium credits/license generation.
- `patches/extra/ungoogled-chromium/remove-uneeded-ui.patch` for inherited
  About-page UI edits.
- Root `README.md`, `LICENSE`, and `SUPPORT.md` as inherited attribution and
  repo-presentation surfaces.

Validation commands and results:

| Command | Result |
|---|---|
| `Test-Path docs\echothink-browser-alpha\t04-define-product-branding-inventory.md` | Passed. |
| `rg -n "EchothinkBrowserSetup|Windows Start Menu|About Page Copy Requirements|First-Run Copy Requirements|Icon And Asset Requirements|Attribution Requirements" docs\echothink-browser-alpha\t04-define-product-branding-inventory.md` | Passed. |
| Inherited touchpoint path check for `first-run-page.patch`, `add-extra-channel-info.patch`, `add-credits.patch`, and `remove-uneeded-ui.patch` | Passed: all four files exist. |
| Inherited-root path check for `assets` | Passed as expected for inventory baseline: `assets` does not exist yet. |
| `rg -n "t04-define-product-branding-inventory" docs\ungoogled_to_echothink_browser_change_plan.md docs\echothink_browser_construction.md docs\progress.md` | Passed. |

Known limitations:

- T04 did not create `patches/echothink/0001-branding.patch`, add visual
  assets, modify installer metadata, or run a browser build.
- Exact Chromium source string/resource files must be verified during T05/T06
  because the requested root is docs-only and the inherited common repo does
  not include a Chromium source checkout.
- Exact installer bitmap dimensions and channel-specific names remain T30/T32
  packaging decisions.

## T06 Notes

Changed / added files:

- `assets/README.md`
- `assets/icons/echothink.svg`
- `assets/icons/echothink.ico`
- `assets/icons/png/echothink-{16,20,24,32,40,48,64,128,256}.png` (9 files)
- `assets/installer/echothink-setup.ico`
- `assets/installer/README.md`
- `assets/about/echothink-logo-{64,128,256}.png` (3 files)
- `assets/tools/generate_icons.py`
- `docs/echothink-browser-alpha/t06-add-echothink-visual-assets.md`
- `docs/progress.md`

Prerequisite status:

- T06 depends on T04. T04 is marked `DONE`.
- The canonical-root mismatch (T00) is carried forward. T06 is the first
  artifact-producing task, so the `assets/` bundle is placed at the inherited
  canonical build root (beside `patches/`, `utils/`, `devutils/`) — where the
  packaging/branding patches consume it — rather than under the docs-only
  `echothink-studio-new` root. Task documentation stays under
  `echothink-studio-new\docs`.

Asset decisions:

- Original Echothink artwork: a focal "think" dot emitting two "echo" ripples
  in white on a rounded teal->deep-blue tile (`#15C2D6` -> `#0A4F8A`).
- Master source: `assets/icons/echothink.svg`. All rasters are reproduced from
  the matching geometry via `assets/tools/generate_icons.py` (Pillow), because
  the environment's `cairosvg` lacks a working cairo native library.
- No Chromium / Google Chrome / Ungoogled Chromium logo artwork is reused, per
  T04 attribution rules. Source/ownership recorded in `assets/README.md`.
- Required Windows Alpha sizes are present: PNG 16/20/24/32/40/48/64/128/256,
  multi-resolution app `.ico` and installer `.ico` (same 9 sizes), and
  About/first-run logos 64/128/256.
- Installer banner/dialog bitmaps are deferred to T30/T32 (dimensions depend on
  the installer technology); documented in `assets/installer/README.md`.

Validation commands and results:

| Command | Result |
|---|---|
| `python3 assets/tools/generate_icons.py` | Passed: wrote 9 PNG app icons, `echothink.ico`, `echothink-setup.ico`, and 3 About logos. |
| Pillow size/mode check on `icons/png/*.png` and `about/*.png` | Passed: exact target sizes, RGBA. |
| Pillow `.ico` resolution check on both `.ico` files | Passed: each contains 16, 20, 24, 32, 40, 48, 64, 128, 256. |
| Visual inspection of 256 px and 32 px exports | Passed: mark legible at large and small sizes. |
| `find assets -type f` | Passed: 17 files present under the planned structure. |

Known limitations:

- Rasters are downsampled from one master rather than hand-tuned per size;
  production may want pixel hinting for the 16 px icon. Acceptable for Alpha.
- Installer banner/dialog bitmaps deferred to T30/T32.
- Wiring assets into Chromium resources and the installer is owned by T05 and
  T30/T32; T06 only adds and documents the bundle.
- No pinned Chromium source checkout was available locally; exact native icon
  resource replacement paths are verified by T05/T30.

## T07 Notes

Changed documentation:

- `docs/echothink-browser-alpha/t07-define-default-policy-preference-set.md`
- `docs/ungoogled_to_echothink_browser_change_plan.md`
- `docs/echothink_browser_construction.md`
- `docs/dag-doc.md`
- `docs/progress.md`

Prerequisite status:

- T07 depends on T00.
- T00 is marked `DONE`.
- The requested-root mismatch remains accepted as a baseline dependency for
  this docs-only defaults spec. Documentation lives under
  `echothink-studio-new\docs`; inherited defaults/search/New Tab touchpoints
  were inspected in `C:\Users\caoya\source\repos\echothink-studio`.

Default decisions:

- Homepage: `https://app.echothink.ai/dashboard`.
- New Tab: `https://app.echothink.ai/newtab`.
- Default search provider: `Echothink Search`.
- Search URL: `https://search.echothink.ai/search?q={searchTerms}`.
- Suggest URL: `https://search.echothink.ai/suggest?q={searchTerms}`.
- Search suggestions remain disabled by default over the inherited baseline;
  the suggest URL is configured for use when the user or enterprise enables
  suggestions.
- Default bookmarks: Workspace, New Tab, Search, Support, Browser Download,
  and Browser Updates under Echothink-owned domains.
- T08 should prefer recommended policy, installer initial preferences, existing
  profile preference hooks, and inherited New Tab hooks before native patching.

Concrete inherited touchpoints checked:

- `docs/default_settings.md` for inherited default settings.
- `patches/extra/inox-patchset/0006-modify-default-prefs.patch` for inherited
  profile preference defaults.
- `patches/extra/iridium-browser/prefs-always-prompt-for-download-directory-by-defaul.patch`
  for inherited download prompt default.
- `patches/extra/ungoogled-chromium/default-webrtc-ip-handling-policy.patch`
  for inherited WebRTC IP handling default.
- `patches/core/ungoogled-chromium/replace-google-search-engine-with-nosearch.patch`
  for inherited default search replacement.
- `patches/extra/ungoogled-chromium/add-suggestions-url-field.patch` for
  suggestion URL editing support.
- `patches/extra/ungoogled-chromium/add-flag-for-custom-ntp.patch` for the
  inherited custom New Tab hook.
- `patches/extra/ungoogled-chromium/add-flag-for-bookmark-bar-ntp.patch` for
  inherited New Tab bookmark bar behavior.

Validation commands and results:

| Command | Result |
|---|---|
| `Test-Path docs\echothink-browser-alpha\t07-define-default-policy-preference-set.md` | Passed. |
| `rg -n "https://app.echothink.ai/dashboard|https://app.echothink.ai/newtab|https://search.echothink.ai/search\\?q=\\{searchTerms\\}|https://search.echothink.ai/suggest\\?q=\\{searchTerms\\}|Default Bookmark Set|Enterprise-Safe Defaults" docs\echothink-browser-alpha\t07-define-default-policy-preference-set.md` | Passed. |
| Inherited touchpoint path check for `docs\default_settings.md`, `0006-modify-default-prefs.patch`, `replace-google-search-engine-with-nosearch.patch`, `add-suggestions-url-field.patch`, `add-flag-for-custom-ntp.patch`, and `add-flag-for-bookmark-bar-ntp.patch` | Passed: all checked files exist. |
| `rg -n "t07-define-default-policy-preference-set|Default homepage route" docs\ungoogled_to_echothink_browser_change_plan.md docs\echothink_browser_construction.md docs\dag-doc.md docs\progress.md` | Passed. |

Known limitations:

- T07 did not create `patches/echothink/0002-default-policies-and-preferences.patch`,
  add bookmarks, modify search provider data, or run a browser build.
- Exact Chromium policy, preference, TemplateURL, and bookmark seed paths must
  be verified during T08 against the pinned Chromium source after inherited
  patches are applied.
- Backend availability for app/search/suggest/support/update routes was not
  validated; these are browser route contracts only.

## T09 Notes

Changed documentation:

- `docs/echothink-browser-alpha/t09-confirm-new-tab-insertion-point.md`
- `docs/ungoogled_to_echothink_browser_change_plan.md`
- `docs/echothink_browser_construction.md`
- `docs/dag-doc.md`
- `docs/progress.md`

Prerequisite status:

- T09 depends on T00.
- T00 is marked `DONE`.
- The requested-root mismatch remains accepted as a baseline dependency for
  this docs-only New Tab hook decision. Documentation lives under
  `echothink-studio-new\docs`; inherited New Tab touchpoints were inspected in
  `C:\Users\caoya\source\repos\echothink-studio`.

Hook decision:

- Use Chromium's `HandleNewTabPageLocationOverride()` path in
  `chrome/browser/chrome_content_browser_client.cc` as modified by the
  inherited `add-flag-for-custom-ntp.patch`.
- Prefer seeding `prefs::kNewTabPageLocationOverride` for normal profiles to
  `https://app.echothink.ai/newtab`.
- Do not use a global `--custom-ntp=https://app.echothink.ai/newtab` default
  for Alpha because the inherited switch can route incognito New Tabs to
  external URLs.
- Keep fallback behavior out of the route hook. T10/T11/T20 own minimal local
  fallback/setup pages and login-gate state.

Concrete inherited touchpoints checked:

- `patches/extra/ungoogled-chromium/add-flag-for-custom-ntp.patch` for the
  selected New Tab override hook.
- `patches/extra/inox-patchset/0008-restore-classic-ntp.patch` for inherited
  local NTP behavior and why search-provider `new_tab_url` is not the safest
  Alpha route.
- `patches/extra/ungoogled-chromium/add-flag-for-bookmark-bar-ntp.patch` for
  inherited New Tab bookmark bar behavior.
- `patches/extra/ungoogled-chromium/first-run-page.patch` for the local WebUI
  setup/fallback pattern.
- `docs/flags.md` for inherited `--custom-ntp` and `--bookmark-bar-ntp`
  behavior.

Validation commands and results:

| Command | Result |
|---|---|
| `Test-Path docs\echothink-browser-alpha\t09-confirm-new-tab-insertion-point.md` | Passed. |
| `rg -n "HandleNewTabPageLocationOverride|prefs::kNewTabPageLocationOverride|--custom-ntp|Incognito Behavior|Fallback Behavior|lower-risk" docs\echothink-browser-alpha\t09-confirm-new-tab-insertion-point.md` | Passed. |
| Inherited touchpoint path check for `add-flag-for-custom-ntp.patch`, `0008-restore-classic-ntp.patch`, `add-flag-for-bookmark-bar-ntp.patch`, `first-run-page.patch`, and `docs\flags.md` | Passed: all checked files exist. |
| `rg -n "t09-confirm-new-tab-insertion-point|HandleNewTabPageLocationOverride|--custom-ntp" docs\ungoogled_to_echothink_browser_change_plan.md docs\echothink_browser_construction.md docs\dag-doc.md docs\progress.md` | Passed. |

Known limitations:

- T09 did not create `patches/echothink/0003-new-tab-and-first-run.patch`,
  modify New Tab behavior, add fallback WebUI, or run a browser build.
- Exact patched Chromium source context must be verified during T10 after
  inherited patches are applied.
- T09 assigns fallback implementation to T10/T11/T20 and does not validate
  remote `https://app.echothink.ai/newtab` availability.
