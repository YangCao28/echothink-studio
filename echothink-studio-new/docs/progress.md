# Echothink Browser Alpha Progress

Last updated: 2026-05-29 (T31 added)

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
| T05 | W2 | Implement branding patch | T01, T04 | DONE | Task note at `docs/echothink-browser-alpha/t05-implement-branding-patch.md`. Prerequisites T01 and T04 are DONE. Created `patches/echothink/0001-branding.patch` (the first Echothink-owned patch) and appended `echothink/0001-branding.patch` to the tail of `patches/series` after all inherited patches. Patch updates `IDS_PRODUCT_NAME`/`IDS_SHORT_PRODUCT_NAME` in `chrome/app/chromium_strings.grd` and the first-run `<title>`/`<h2>` in `chrome/browser/ui/webui/ungoogled_first_run.h` to `Echothink Browser`; upstream credits/licenses and the first-run attribution sentence are preserved; `BRANDING`/executable/installer identity deferred to T30/T31. Validated by real `patch -p1` against the pinned Chromium `148.0.7778.178` source (both hunks applied cleanly, no fuzz) and `devutils/check_patch_files.py` passing. |
| T06 | W2 | Add Echothink visual assets | T04 | DONE | Asset bundle created at the inherited canonical build root `assets/` (icons/, installer/, about/, tools/), with task note at `docs/echothink-browser-alpha/t06-add-echothink-visual-assets.md`. T04 is DONE; the canonical-root mismatch is carried forward — as the first artifact-producing task, assets live at the build root the packaging/branding patches consume, not under docs-only `echothink-studio-new`. Delivered original Echothink artwork: master SVG, PNG app icons (16/20/24/32/40/48/64/128/256), multi-resolution `echothink.ico` and `echothink-setup.ico`, and About/first-run logos (64/128/256). All required Windows Alpha sizes verified present. Installer banner/dialog bitmaps deferred to T30/T32. Wiring into Chromium/installer owned by T05/T30/T32. |
| T07 | W1 | Define default policy/preference set | T00 | DONE | Defaults spec created at `docs/echothink-browser-alpha/t07-define-default-policy-preference-set.md`. T00 is DONE and the canonical-root mismatch is carried forward as an acceptable baseline dependency for this docs-only task. Homepage, New Tab, search URL, suggest URL, default bookmarks, preferred policy/preference surfaces, and enterprise-safe defaults are documented. No patch or backend work started. |
| T09 | W1 | Confirm New Tab insertion point | T00 | DONE | Hook decision created at `docs/echothink-browser-alpha/t09-confirm-new-tab-insertion-point.md`. T00 is DONE and the canonical-root mismatch is carried forward as an acceptable baseline dependency for this docs-only task. Selected hook: `HandleNewTabPageLocationOverride()` via the normal-profile New Tab override preference. Avoid a global `--custom-ntp` default for Alpha because the inherited switch can affect incognito external New Tabs. No patch work started. |
| T08 | W2 | Implement default policies/preferences patch | T01, T07 | DONE | First Echothink defaults patch created: `patches/echothink/0002-default-policies-and-preferences.patch`, appended to `patches/series` after inherited patches. Seeds normal-profile New Tab route (inherited custom-ntp hook empty-branch) and homepage/startup/default-bookmarks via Chromium initial preferences (new files `chrome/browser/resources/echothink/initial_preferences.json` and `echothink_bookmarks.html`). Default search provider and suggest URL were split to T19's `patches/echothink/0005-default-search-provider.patch`. All defaults are override-safe; no locked policy; native bookmark/history/download/password/cookie/DevTools behavior untouched. Validated: `validate_config.py`, `check_patch_files.py`, `check_gn_flags.py` exit 0 clean; `git apply --numstat` parses cleanly; series has 0 missing files. Patch application against Chromium source deferred to build pipeline (no local checkout, per T03). Task note: `docs/echothink-browser-alpha/t08-implement-default-policies-preferences-patch.md`. |
| T10 | W3 | Implement New Tab route and fallback | T08, T09 | DONE | Created `patches/echothink/0003-new-tab-and-first-run.patch` and inserted it into `patches/series` between `echothink/0002` and `echothink/0005`. The authenticated New Tab route to `https://app.echothink.ai/newtab` already comes from T08's `0002` (inherited `HandleNewTabPageLocationOverride()` hook) and is NOT re-edited, so the patches never collide. T10 adds the local fallback/first-run page `chrome://echothink-first-run` (new file `chrome/browser/ui/webui/echothink_first_run.h`, reusing the inherited `first-run-page.patch` URLDataSource pattern), registers it in `chrome_web_ui_configs.cc`, adds the `echothink-first-run` host in `webui_url_constants.cc`, and opens it as the first first-run tab in `chrome_browser_main.cc` (additive, before the inherited ungoogled-first-run tab). The page is static, script-free, renders fully offline, and links ONLY to login, device enrollment, diagnostics (`chrome://echothink-diagnostics`), update, and support/download — no workspace/business data. No network/TLS/sandbox/renderer/downloads/history/bookmarks/password/cookie/DevTools changes; incognito New Tab behavior untouched. Validated: `check_patch_files.py`, `check_gn_flags.py`, `validate_config.py` exit 0; `git apply --numstat` parses cleanly (4 files). Real `patch -p1` application and runtime smoke deferred to build pipeline (no local Chromium checkout, per T03). Task note: `docs/echothink-browser-alpha/t10-implement-new-tab-route-and-fallback.md`. |
| T19 | W2 | Implement default search provider | T08 | DONE | Created `patches/echothink/0005-default-search-provider.patch` and appended it to the Echothink tail block after `echothink/0002-default-policies-and-preferences.patch`. The patch re-points the inherited "No Search" prepopulated engine slot to Echothink Search and adds `default_search_provider` values to the T08 initial-preferences file: search URL `https://search.echothink.ai/search?q={searchTerms}` and suggest URL `https://search.echothink.ai/suggest?q={searchTerms}`. Search suggestions remain disabled by default over the inherited baseline and use the Echothink suggest route only when enabled. No omnibox internals, direct URL navigation, network stack, TLS, sandbox, renderer, downloads, history, bookmarks, password manager, cookies, or DevTools behavior changed. Task note: `docs/echothink-browser-alpha/t19-implement-default-search-provider.md`. |
| T12 | W3 | Scaffold bundled Manifest V3 workspace extension | T02 | DONE | Created source-only extension scaffold at `extensions/echothink-workspace/` in the canonical browser root: MV3 `manifest.json`, background service worker, Side Panel HTML/CSS/JS, narrow content bridge, and extension-local asset. T02 is DONE; the canonical-root mismatch is carried forward and recorded in the task note. Manifest declares only `sidePanel`, `storage`, `tabs`, `activeTab`, and `scripting`; host permissions are limited to `app.echothink.ai`, `auth.echothink.ai`, `api.echothink.ai`, and `search.echothink.ai`. No backend/business logic was added. T13 has since added the fixed public key and bundled install patch. Task note: `docs/echothink-browser-alpha/t12-scaffold-bundled-workspace-extension.md`. |
| T13 | W4 | Add bundled extension install patch | T12 | DONE | Created `patches/echothink/0004-bundled-workspace-extension.patch` and inserted it into `patches/series` between `echothink/0003-new-tab-and-first-run.patch` and `echothink/0005-default-search-provider.patch`. T12 is DONE. The patch bundles the workspace shell as a Chromium component extension, allowlists only fixed extension ID `lokdibgfmiemhdoogailbfpdggndpolk`, registers it in `ComponentLoader::AddDefaultComponentExtensionsWithBackgroundPages()`, and adds resources under `chrome/browser/resources/echothink_workspace/`. Source manifest now carries the same public key, no `update_url`, exact permissions `sidePanel`, `storage`, `tabs`, `activeTab`, `scripting`, and only Echothink-owned host permissions. No extension permission model weakening or Web Store replacement path was added. Task note: `docs/echothink-browser-alpha/t13-add-bundled-extension-install-patch.md`. |
| T11 | W4 | Add first-run shell | T10 | DONE | Created `patches/echothink/0011-first-run-gate-shell.patch` and appended `echothink/0011-first-run-gate-shell.patch` to the Echothink series tail (after `echothink/0005`). Establishes the M2 first-run **gate shell** by reusing T10's `chrome://echothink-first-run` page (no new page) and making a single narrow first-run-only edit to the `AddFirstRunTabs` block in `chrome/browser/chrome_browser_main.cc` so that on first launch the browser opens **only** the gate shell — suppressing the inherited `chrome://ungoogled-first-run` how-to tab and the normal-profile workspace / New Tab tabs (`master_prefs_->new_tabs`) before setup. The shell's primary CTAs are Sign in (`auth.echothink.ai/login`) and Enroll device (`auth.echothink.ai/device/enroll`), so first launch leads to login/enrollment. No navigation interception, auth-readiness flags, or post-setup restoration — those are owned by T20 (spec) and T21 (`echothink/0006-login-gate.patch`). No policy/pref change; no business logic; no network/TLS/sandbox/renderer/downloads/history/bookmarks/password/cookie/DevTools change; non-first-run startup untouched. Patch number `0011` chosen to avoid the change plan's reserved band (0004/0006–0010). Validated: `git apply --numstat` (12/3), `check_patch_files.py`, `check_gn_flags.py`, `validate_config.py` all exit 0; real `patch -p1` applied cleanly against a reconstructed post-`0003` block. Task note: `docs/echothink-browser-alpha/t11-add-first-run-shell.md`. |
| T20 | W4 | Define login gate local state and allowlist | T10, T11 | READY | Task note created at `docs/echothink-browser-alpha/t20-define-login-gate-local-state-and-allowlist.md`. Both prerequisites are now `DONE` (T10; and T11, merged in this change — see the T11 row above and task note `t11-add-first-run-shell.md`). The earlier `BLOCKED` state (recorded when T11 was missing) is therefore resolved and T20 may proceed. Still pending: the M4 login-gate spec itself (local auth/device readiness flags, unauthenticated navigation allowlist, blocked-navigation behavior, setup-completion criteria, diagnostics/support exceptions). T21 must not implement `patches/echothink/0006-login-gate.patch` until that spec exists. |
| T30 | W3 | Define Windows app identity and channels | T05, T06 | DONE | Windows packaging identity spec created at `docs/echothink-browser-alpha/t30-define-windows-app-identity-and-channels.md`. Prerequisites T05 and T06 are DONE. Defines Windows display/Start Menu/uninstall names, `EchothinkBrowserSetup` installer stem and channelized artifact names, channel IDs/labels for Canary, Dev, Beta, Stable, and Enterprise Stable, Alpha-versus-Beta branding requirements, update-channel metadata fields expected by packaging, and Windows smoke-test expectations. No patch or installer implementation was created. |
| T31 | W4 | Implement Windows packaging identity patch | T30 | DONE | Task note at `docs/echothink-browser-alpha/t31-implement-windows-packaging-identity-patch.md`. Prerequisite T30 is DONE. Created `patches/echothink/0010-windows-packaging-identity.patch` and appended `echothink/0010-windows-packaging-identity.patch` to `patches/series` after the active Echothink tail. Patch sets Alpha Dev Windows app/install identity through Chromium `BRANDING`, Windows install_static constants, installer registry roots, app shortcut folder text, mini-installer icon handoff documentation, and `chrome://version` build labels. `chrome.exe`, `setup.exe`, sandbox IDs, COM GUIDs, network stack, TLS, renderer internals, downloads, history, bookmarks, password manager, cookies, and DevTools remain unchanged. Validated: `git apply --numstat`, `check_patch_files.py`, `check_gn_flags.py`, and `validate_config.py` all pass. Real Windows build/install smoke is deferred to T32/T36 because no local Chromium source checkout or Windows installer environment exists here. |

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

## T05 Notes

Changed files:

- `patches/echothink/0001-branding.patch` (new; first Echothink-owned patch)
- `patches/series` (appended `echothink/0001-branding.patch` as the tail block)
- `docs/echothink-browser-alpha/t05-implement-branding-patch.md` (new task note)
- `docs/progress.md`

Prerequisite status:

- T05 depends on T01 and T04; both are `DONE`.
- The canonical-root mismatch is carried forward: the patch and `patches/series`
  live in the inherited tree (one directory up), while this note lives under
  `echothink-studio-new\docs`. Chromium pin: `148.0.7778.178`.

Implementation decisions:

- Smallest stable user-visible insertion points only:
  - `chrome/app/chromium_strings.grd`: `IDS_PRODUCT_NAME` and
    `IDS_SHORT_PRODUCT_NAME` (non-Chrome-for-Testing `<else>` branch)
    `Chromium` -> `Echothink Browser`.
  - `chrome/browser/ui/webui/ungoogled_first_run.h`: first-run `<title>` and
    `<h2>` heading `ungoogled-chromium` -> `Echothink Browser`.
- Upstream attribution preserved: credits/license generation untouched; the
  first-run "built with ungoogled-chromium patches ... default Chromium
  experience" sentence and links kept verbatim; Chrome-for-Testing `<then>`
  branch unchanged.
- Deferred by design: `chrome/app/theme/chromium/BRANDING`,
  executable/installer identity, Start Menu/uninstall names, and channel labels
  (T30/T31); icon/logo assets (T06).
- Patch carries the required T01 Echothink header; `Depends-On: none`; the
  ordering dependency on the inherited `first-run-page.patch` is satisfied
  because Echothink patches apply after all inherited patches.

Validation commands and results:

| Command | Result |
|---|---|
| `python3 devutils/check_patch_files.py` | Passed, exit 0 (patch exists and is referenced; no missing/unused patches). |
| Patch placement check (`patches/echothink/0001-branding.patch`) | Passed: present under `patches/echothink/`. |
| `patches/series` tail check | Passed: `echothink/0001-branding.patch` is part of the Echothink tail block, after all inherited patches; no placeholder entries. |
| Real `patch -p1 --dry-run` and `patch -p1` against pinned Chromium source | Passed: fetched real `chromium_strings.grd` at tag `148.0.7778.178`, reconstructed `ungoogled_first_run.h` via the inherited `first-run-page.patch`, then both hunks applied cleanly, exit 0, no fuzz, no offset, no rejects. |
| Post-apply content check | Passed: product-name strings and first-run title/heading read `Echothink Browser`; attribution sentence preserved; Chrome-for-Testing branch unchanged. |

Known limitations:

- No full browser build/visual smoke test was run in this environment; About and
  `chrome://ungoogled-first-run` rendering should be confirmed in a real build.
- `validate_patches.py --remote` remains blocked by the inherited `DEPS` parser
  issue documented in T03; the targeted dry-run above validates this patch's
  hunks directly against the real pinned source.
- `chrome://version` build label still appends `ungoogled-chromium` via the
  inherited `add-extra-channel-info.patch`; channel/label wording is a T30
  packaging concern, not part of T05's product-name change.

## T08 Notes

Changed files:

- `patches/echothink/0002-default-policies-and-preferences.patch` (new
  Echothink patch)
- `patches/series` (added `echothink/0002-default-policies-and-preferences.patch`
  to the Echothink tail block after inherited patches)
- `docs/echothink-browser-alpha/t08-implement-default-policies-preferences-patch.md`
  (new task note)
- `docs/progress.md` (this file)

Prerequisite status:

- T08 depends on T01 and T07; both are `DONE`. The related New Tab hook decision
  T09 is also `DONE`.
- The T00 canonical-root mismatch is carried forward as an accepted baseline
  dependency: planning docs live under `echothink-studio-new/docs`; the inherited
  Ungoogled Chromium patch/config tree is the repository root one level up, where
  the patch and `patches/series` change were made.

Implementation decisions:

- New Tab default: seed the normal-profile, no-override fallback inside the
  inherited `HandleNewTabPageLocationOverride()` hook (T09's chosen insertion
  point). Incognito and explicit `kNewTabPageLocationOverride` /
  NewTabPageLocation policy / `--custom-ntp` values are preserved.
- Homepage, startup URL, and the six default bookmarks (Workspace, New Tab,
  Search, Support, Browser Download, Browser Updates) are delivered as Chromium
  initial preferences (`chrome/browser/resources/echothink/initial_preferences.json`)
  plus a Netscape bookmarks file imported via `import_bookmarks_from_file`. These
  are recommended distribution defaults, fully override-safe; native bookmark
  storage and the bookmark manager are not modified.
- No locked/mandatory policy is introduced. Inherited defaults preserved
  (suggestions off by default, bookmark bar on, third-party cookies blocked,
  password save/auto sign-in off). DevTools, downloads, history, cookies, TLS,
  sandbox, renderer, and network stack are untouched.
- Default search provider and suggest URL are split to
  `patches/echothink/0005-default-search-provider.patch` for T19.

Ordering / dependencies:

- Patch is in the Echothink tail block of `patches/series`, after all inherited
  entries and after `echothink/0001-branding.patch`.
- One edit hunk depends on inherited
  `extra/ungoogled-chromium/add-flag-for-custom-ntp.patch` and must apply after
  it (recorded in the patch header `Inherited-Depends-On`).

Validation commands and results:

| Command | Result |
|---|---|
| `ls patches/echothink/` | `0001-branding.patch`, `0002-default-policies-and-preferences.patch`, and `0005-default-search-provider.patch` present. |
| `grep -n "echothink/" patches/series` | Echothink entries present in the tail block, after inherited tail `add-flag-for-disabling-jit.patch`. |
| Shell loop mapping every non-comment series entry to a file | `missing_count=0`. |
| `python3 devutils/validate_config.py` | Exit 0, clean (no unused-patch/duplicate/readability warnings). Runs clean on POSIX here. |
| `python3 devutils/check_patch_files.py` | Exit 0, clean. |
| `python3 devutils/check_gn_flags.py` | Exit 0. |
| `git apply --stat` / `git apply --numstat` on the patch | Parses cleanly: chrome_content_browser_client.cc +6, initial_preferences.json +25, echothink_bookmarks.html +15. |

Build-pipeline application command (deferred; no local Chromium checkout):

- `patch -p1 < patches/echothink/0002-default-policies-and-preferences.patch`
  from the pinned Chromium 148.0.7778.178 source root after inherited patches, or
  `python3 devutils/validate_patches.py --local <unmodified-chromium-src>`.

Known limitations:

- No Chromium source checkout locally, so the New Tab edit hunk was authored
  against context that inherited patches prove exists in the pinned tree. Hunk
  line numbers are approximate (GNU patch tolerates offset, not fuzz); exact
  context must be re-confirmed at build time and on every Chromium rebase.
- Homepage/startup/bookmarks take effect only once Windows packaging (T30)
  installs the initial-preferences file (and bookmarks file). The patch commits
  the canonical content; packaging wiring is T30.
- `validate_patches.py --remote` remains blocked by the inherited Chromium `DEPS`
  parser issue documented in T03; remote patch application was not run.
- Backend availability of the Echothink app/update routes is not validated; they
  are browser route contracts only.

## T10 Notes

Changed files:

- `patches/echothink/0003-new-tab-and-first-run.patch` (new)
- `patches/series` (inserted `echothink/0003-new-tab-and-first-run.patch`
  between `echothink/0002` and `echothink/0005`)
- `docs/echothink-browser-alpha/t10-implement-new-tab-route-and-fallback.md` (new)
- `docs/progress.md`

Native files the patch touches:

- `chrome/browser/ui/webui/echothink_first_run.h` (new local fallback WebUI)
- `chrome/browser/ui/webui/chrome_web_ui_configs.cc` (register the WebUI)
- `chrome/common/webui_url_constants.cc` (add `echothink-first-run` host)
- `chrome/browser/chrome_browser_main.cc` (open page as first first-run tab)

Design decisions:

- The authenticated New Tab route (`https://app.echothink.ai/newtab`) is owned by
  T08's `0002` patch via the inherited `HandleNewTabPageLocationOverride()` hook.
  T10 does NOT re-edit that hook, so `0002` and `0003` never touch the same lines.
  T10 adds the local fallback the route degrades to when the workspace is offline,
  signed-out, or pre-enrollment.
- The fallback page reuses the inherited `first-run-page.patch` in-memory
  `URLDataSource` pattern. It is static, script-free (WebUI default CSP kept),
  renders fully offline, and links ONLY to login, device enrollment, diagnostics,
  update, and support/download. No workspace data or protected business data is
  embedded.
- First-run wiring is additive: the Echothink page is added before the inherited
  `chrome://ungoogled-first-run` tab so inherited behavior is preserved.

Validation commands and results (run from inherited repo root):

| Command | Result |
|---|---|
| `python3 devutils/check_patch_files.py` | Passed (exit 0): patch parses, referenced in series, no duplicates, no unused. |
| `git apply --numstat patches/echothink/0003-new-tab-and-first-run.patch` | Passed (exit 0): `121 0` echothink_first_run.h, `2 0` chrome_web_ui_configs.cc, `1 0` webui_url_constants.cc, `1 0` chrome_browser_main.cc. |
| `python3 devutils/check_gn_flags.py` | Passed (exit 0). |
| `python3 devutils/validate_config.py` | Passed (exit 0; clean on POSIX). |

Known limitations:

- No local Chromium checkout (per T03/T08), so real `patch -p1` application and a
  runtime browser smoke test were not run. Application is deferred to the build
  pipeline; the documented application command is in the patch header.
- `@@` hunk offsets for the three edited native files are anchored on the lines
  the inherited `first-run-page.patch` introduces; exact post-inherited offsets
  must be confirmed at apply time against pinned Chromium `148.0.7778.178`.
  `patch -p1` fuzzy matching should absorb small offset drift.
- `chrome://echothink-diagnostics` is referenced as the diagnostics link target
  per the allowed-destination list, but the diagnostics WebUI itself is owned by a
  later task (change plan 5.8); until then the diagnostics link is a known dead
  `chrome://` link.
- The redirect logic that decides *when* a failed/unauthenticated remote `/newtab`
  load lands on `chrome://echothink-first-run` is a backend/gateway and enrollment
  concern owned by T11/T20; T10 only provides the local destination and the
  first-run entry point.

## T19 Notes

Changed files:

- `patches/echothink/0002-default-policies-and-preferences.patch` (split search
  provider values out of T08 so T19 owns them)
- `patches/echothink/0005-default-search-provider.patch` (new Echothink patch)
- `patches/series` (added `echothink/0005-default-search-provider.patch` after
  `echothink/0002-default-policies-and-preferences.patch`)
- `docs/echothink-browser-alpha/t08-implement-default-policies-preferences-patch.md`
  (updated T08 scope after the split)
- `docs/echothink-browser-alpha/t19-implement-default-search-provider.md`
  (new task note)
- `docs/progress.md` (this file)

Prerequisite status:

- T19 depends on T08; T08 is `DONE` after merging local `master` into this
  worktree.
- T07 defines the search contract: provider name `Echothink Search`, keyword
  `echothink.ai`, search URL
  `https://search.echothink.ai/search?q={searchTerms}`, and suggest URL
  `https://search.echothink.ai/suggest?q={searchTerms}`.

Implementation decisions:

- Re-point the inherited "No Search" prepopulated engine slot
  (`SEARCH_ENGINE_GOOGLE`) to Echothink Search. This reuses the inherited
  default-engine mechanism and preserves DefaultSearchProvider policy and user
  choice override behavior.
- Add a `default_search_provider` block to the initial preferences file created
  by T08 so installer/first-run defaults also carry the Echothink provider.
- Configure the suggest URL on the provider but do not enable search suggestions
  by default. Suggestions remain disabled over the inherited baseline and use
  `https://search.echothink.ai/suggest?q={searchTerms}` only when a user or
  enterprise enables them.
- Preserve direct URL navigation and avoid omnibox internals. No network stack,
  TLS/certificate validation, sandbox, renderer, downloads, history, bookmarks,
  password manager, cookies, or DevTools behavior changed.

Ordering / dependencies:

- `echothink/0005-default-search-provider.patch` is in the Echothink tail block
  after `echothink/0002-default-policies-and-preferences.patch`.
- The patch depends on T08 because it edits
  `chrome/browser/resources/echothink/initial_preferences.json`, which T08
  creates.
- The prepopulated search-engine hunk depends on inherited
  `core/ungoogled-chromium/replace-google-search-engine-with-nosearch.patch`.
- Suggest URL support relies on inherited
  `extra/ungoogled-chromium/add-suggestions-url-field.patch`.

Validation commands and results:

| Command | Result |
|---|---|
| `rg -n "^\\| T08 \\|.*DONE" echothink-studio-new/docs/progress.md` | Passed; prerequisite T08 is marked `DONE`. |
| `test -f patches/echothink/0005-default-search-provider.patch` | Passed. |
| `grep -n "echothink/" patches/series` | Passed; `0005-default-search-provider.patch` is after `0002-default-policies-and-preferences.patch` in the Echothink tail block. |
| Shell loop mapping every non-comment series entry to a file | `missing_count=0`. |
| `python3 devutils/validate_config.py` | Passed, exit 0. |
| `python3 devutils/check_patch_files.py` | Passed, exit 0. |
| `python3 devutils/check_gn_flags.py` | Passed, exit 0. |
| `git apply --stat patches/echothink/0005-default-search-provider.patch` / `git apply --numstat patches/echothink/0005-default-search-provider.patch` | Parses cleanly: prepopulated_engines.json +5/-4, initial_preferences.json +7. |

Build-pipeline application command (deferred; no local Chromium checkout):

- `patch -p1 < patches/echothink/0005-default-search-provider.patch` from the
  pinned Chromium 148.0.7778.178 source root after inherited patches and after
  `patches/echothink/0002-default-policies-and-preferences.patch`, or
  `python3 devutils/validate_patches.py --local <unmodified-chromium-src>`.

Known limitations:

- No Chromium source checkout locally, so full patch application and browser
  smoke testing were not run.
- Omnibox routing and suggest behavior should be smoke-tested in a real browser
  build with a clean profile.
- Backend availability of `search.echothink.ai` was not validated; the URLs are
  browser route contracts only.

## T12 Notes

Changed files:

- `extensions/echothink-workspace/manifest.json` (new MV3 manifest)
- `extensions/echothink-workspace/background.js` (new service worker)
- `extensions/echothink-workspace/sidepanel.html` (new Side Panel shell)
- `extensions/echothink-workspace/sidepanel.css` (new Side Panel styling)
- `extensions/echothink-workspace/sidepanel.js` (new local shell behavior)
- `extensions/echothink-workspace/content_bridge.js` (new narrow content bridge)
- `extensions/echothink-workspace/assets/workspace-mark.svg` (new local asset)
- `docs/echothink-browser-alpha/t12-scaffold-bundled-workspace-extension.md`
  (new task note)
- `docs/echothink_browser_construction.md` (updated extension tree)
- `docs/progress.md` (this file)

Prerequisite status:

- T12 depends on T02; T02 is marked `DONE`.
- The canonical-root mismatch is carried forward as an accepted baseline
  dependency. The extension source lives at the inherited browser root
  (`extensions/echothink-workspace/`) beside `patches/` and `assets/`; planning
  documentation remains under `echothink-studio-new/docs`.

Implementation decisions:

- Created a source-only Manifest V3 extension skeleton. T13 has since added the
  fixed public key to the source manifest and created
  `patches/echothink/0004-bundled-workspace-extension.patch` to bundle it as a
  component extension.
- Local loading assumption for development is Chromium's unpacked-extension flow
  against `extensions/echothink-workspace/`. There is no npm, bundler,
  generated asset, or build step in this scaffold.
- Manifest declares only the T12 required permissions:
  `sidePanel`, `storage`, `tabs`, `activeTab`, and `scripting`.
- Manifest host permissions are limited to Echothink-owned domains:
  `https://app.echothink.ai/*`, `https://auth.echothink.ai/*`,
  `https://api.echothink.ai/*`, and `https://search.echothink.ai/*`.
- The content bridge injects only on `app.echothink.ai` and
  `auth.echothink.ai`, responds only to same-window bridge pings from allowed
  origins, and exposes no privileged capabilities.
- The Side Panel shell has Chat and Workspace regions with local-only state.
  Persisted mode selection remains T15; service-backed chat/context behavior
  remains T16/T17/T18/T27 or later tasks.
- No Chromium native patch, `patches/series` change, backend service call,
  search ranking, chat orchestration, workflow orchestration, or business page
  implementation was added.
- Network stack, TLS validation, sandbox, renderer internals, downloads,
  history, bookmarks, password manager, cookies, and DevTools were untouched.

Validation commands and results:

| Command | Result |
|---|---|
| `python3 -m json.tool extensions/echothink-workspace/manifest.json` | Passed: manifest JSON parses. |
| Manifest shape check for MV3, service worker, side panel path, permissions, host permissions, and content script matches | Passed: expected values matched exactly. |
| `node --check extensions/echothink-workspace/background.js` | Passed. |
| `node --check extensions/echothink-workspace/content_bridge.js` | Passed. |
| `node --check extensions/echothink-workspace/sidepanel.js` | Passed. |
| Source path check for the seven required scaffold files | Passed: all files exist under `extensions/echothink-workspace/`. |
| `git diff --check` | Passed: no whitespace errors. |

Known limitations:

- The extension was not loaded in a live Chromium profile in this environment.
  T12 validates source shape and local syntax only.
- Bundling and default installation were completed by T13; see T13 Notes below.
- Persisted Side Panel mode state remains T15.
- Chat UI behavior, outbound scope metadata, service states, request proof
  integration, and Workspace Context rendering remain later tasks.

## T13 Notes

Changed files:

- `extensions/echothink-workspace/manifest.json` (added the fixed public key so
  the source scaffold derives the same ID as the bundled component extension)
- `patches/echothink/0004-bundled-workspace-extension.patch` (new patch)
- `patches/series` (inserted `echothink/0004-bundled-workspace-extension.patch`
  between `0003` and `0005`)
- `docs/echothink-browser-alpha/t12-scaffold-bundled-workspace-extension.md`
  (noted the T13 public key and bundled-install completion)
- `docs/echothink-browser-alpha/t13-add-bundled-extension-install-patch.md`
  (new task note)
- `docs/ungoogled_to_echothink_browser_change_plan.md`
- `docs/echothink_browser_construction.md`
- `docs/progress.md` (this file)

Prerequisite status:

- T13 depends on T12; T12 is marked `DONE`.
- The canonical-root mismatch is carried forward as an accepted baseline
  dependency. Documentation lives under `echothink-studio-new/docs`; patches
  and extension source live at the inherited browser repository root.

Implementation decisions:

- Bundled the workspace shell as a Chromium component extension rather than as
  a Web Store/external update install. This loads it by default for normal
  profiles through `ComponentLoader` while preserving normal extension behavior
  outside the trusted Echothink component extension.
- Added only fixed extension ID `lokdibgfmiemhdoogailbfpdggndpolk` to the
  component extension allowlist.
- Added the extension resource files to
  `chrome/browser/resources/component_extension_resources.grd` and copied the
  shell to `chrome/browser/resources/echothink_workspace/` in the patch.
- The manifest has no `update_url`. A public Web Store extension cannot
  silently replace the bundled component because the component does not opt into
  Web Store updates and another extension cannot claim this ID without the
  corresponding private key.
- The permission model is not weakened. The manifest declares only `sidePanel`,
  `storage`, `tabs`, `activeTab`, and `scripting`; host permissions are limited
  to `https://app.echothink.ai/*`, `https://auth.echothink.ai/*`,
  `https://api.echothink.ai/*`, and `https://search.echothink.ai/*`.
- No backend service calls, search ranking, chat orchestration, workflow
  orchestration, project/task business logic, conversation persistence, or
  device/private-key handling were added.
- Network stack, TLS validation, sandbox, renderer internals, downloads,
  history, bookmarks, password manager, cookies, and DevTools were untouched.

Validation commands and results:

| Command | Result |
|---|---|
| `python3 -m json.tool extensions/echothink-workspace/manifest.json` | Passed; source manifest parses. |
| `node --check extensions/echothink-workspace/background.js` | Passed. |
| `node --check extensions/echothink-workspace/content_bridge.js` | Passed. |
| `node --check extensions/echothink-workspace/sidepanel.js` | Passed. |
| Node manifest shape/ID check | Passed; derived ID is `lokdibgfmiemhdoogailbfpdggndpolk`, permissions/host permissions match exactly, no broad permissions or `update_url`. |
| `git apply --numstat patches/echothink/0004-bundled-workspace-extension.patch` | Passed; unified diff parses cleanly. |
| `git apply --stat patches/echothink/0004-bundled-workspace-extension.patch` | Passed; patch reports 10 files changed, 492 insertions. |
| `python3 devutils/check_patch_files.py` | Passed, exit 0. |
| `python3 devutils/validate_config.py` | Passed, exit 0. |
| `python3 devutils/check_gn_flags.py` | Passed, exit 0. |

Build-pipeline application command (deferred; no local Chromium checkout):

- `patch -p1 < patches/echothink/0004-bundled-workspace-extension.patch` from
  the pinned Chromium `148.0.7778.178` source root after inherited patches and
  Echothink patches `0001`, `0002`, and `0003`, or
  `python3 devutils/validate_patches.py --local <unmodified-chromium-src>`.

Known limitations:

- No local Chromium source checkout exists, so real `patch -p1` application and
  browser runtime smoke testing were not run.
- A clean-profile browser build still needs to verify that extension ID
  `lokdibgfmiemhdoogailbfpdggndpolk` loads as a component extension by default
  and that the Side Panel opens.
- Persisted mode state, remote chat, workspace context rendering, request proof,
  and device identity integration remain later tasks.

## T30 Notes

Changed documentation:

- `docs/echothink-browser-alpha/t30-define-windows-app-identity-and-channels.md`
  (new task note)
- `docs/ungoogled_to_echothink_browser_change_plan.md`
- `docs/echothink_browser_construction.md`
- `docs/progress.md`

Prerequisite status:

- T30 depends on T05 and T06; both are `DONE`.
- The canonical-root mismatch is carried forward for this docs-only spec:
  documentation lives under `echothink-studio-new/docs`; patches and assets live
  at the inherited build root one directory up.

Packaging identity decisions:

- Base Windows application display name, Stable Start Menu shortcut, Stable
  desktop shortcut if created, and Apps & Features / uninstall display name:
  `Echothink Browser`.
- Start Menu folder: `Echothink`.
- Installer stem: `EchothinkBrowserSetup`; channelized artifacts may use names
  such as `EchothinkBrowserSetup-Dev-x64.exe`.
- Channel IDs and labels are fixed as `canary` / `Canary`, `dev` / `Dev`,
  `beta` / `Beta`, `stable` / `Stable`, and `enterprise-stable` /
  `Enterprise Stable`.
- Alpha is not a channel; Alpha builds should use `dev` by default or `canary`
  for short-lived experimental packaging tests.
- Alpha must use Echothink user-visible product, installer, shortcut, uninstall,
  and icon identity but may keep low-level Chromium-derived executable/internal
  identifiers if renaming them increases patch risk.
- Public Beta must complete user-visible Windows shell branding, channel-specific
  app/update IDs, uninstall keys, install directories where needed, final
  installer artwork, signed update metadata, and About/version channel labeling.

Concrete paths linked by the spec:

- `patches/echothink/0001-branding.patch`
- `patches/extra/ungoogled-chromium/add-extra-channel-info.patch`
- `patches/echothink/0002-default-policies-and-preferences.patch`
- `assets/icons/echothink.ico`
- `assets/installer/echothink-setup.ico`
- `assets/installer/README.md`

Validation commands and results:

| Command | Result |
|---|---|
| `rg -n "^\\| T0[56] \\|.*DONE" echothink-studio-new/docs/progress.md` | Passed; T05 and T06 are marked `DONE`. |
| Path checks for `patches/echothink/0001-branding.patch`, `patches/extra/ungoogled-chromium/add-extra-channel-info.patch`, `patches/echothink/0002-default-policies-and-preferences.patch`, `assets/icons/echothink.ico`, and `assets/installer/echothink-setup.ico` | Passed; all required local anchor paths exist. |
| `rg -n "EchothinkBrowserSetup|Enterprise Stable|enterprise-stable|Alpha Versus Beta Branding Tradeoff|Update-Channel Metadata Contract|Smoke-Test Expectations" docs/echothink-browser-alpha/t30-define-windows-app-identity-and-channels.md` | Passed. |
| `rg -n "t30-define-windows-app-identity-and-channels|Packaging metadata carries the canonical channel ID|Channel-specific Windows app identity" docs/ungoogled_to_echothink_browser_change_plan.md docs/echothink_browser_construction.md docs/progress.md` | Passed. |

Known limitations:

- No Chromium source checkout existed locally during T30. T31 later implemented
  the active patch against `chrome/app/theme/chromium/BRANDING` and
  `chrome/install_static/chromium_install_modes.h`; real application against
  pinned Chromium `148.0.7778.178` remains deferred to a source checkout.
- No Windows installer technology has been selected and no installer was built
  or run in this environment.
- Backend availability of `updates.echothink.ai` and
  `app.echothink.ai/download-browser` was not validated; these are packaging
  route contracts only.

## T20 Notes

Changed documentation:

- `docs/echothink-browser-alpha/t20-define-login-gate-local-state-and-allowlist.md`
- `docs/progress.md`

Prerequisite status:

- T20 depends on T10 and T11.
- T10 is marked `DONE` in this file.
- T11 is not marked `DONE`, has no row in this file, and has no task note under
  `docs/echothink-browser-alpha/`.
- T20 is therefore `BLOCKED` until T11 is completed or this file explicitly
  records T11 as an acceptable baseline dependency satisfied by T10's
  first-run shell work.

Blocked work:

- No login-gate local state spec was authored.
- No unauthenticated navigation allowlist was finalized.
- No blocked-navigation behavior was defined.
- No setup completion criteria were defined.
- No diagnostics/support exceptions were finalized.
- No patch, backend logic, gateway logic, network stack, TLS, sandbox,
  renderer, downloads, history, bookmarks, password manager, cookies, or
  DevTools behavior was changed.

Validation commands and results:

| Command | Result |
|---|---|
| `rtk rg -n "^\\| T10 \\|.*DONE|^\\| T20 \\|.*BLOCKED|^\\| T11 \\|" docs/progress.md` | Passed for T10 and T20; no T11 row was found. |
| `rtk rg -n "^\\| T11 \\|" docs/progress.md` | Exited 1 as expected: no T11 progress row exists. |
| `rtk rg -n "### T11: Add First-Run Shell|### T20: Define Login Gate State And Allowlist" docs/dag-doc.md` | Passed: the DAG defines T11 and T20, and T20 depends on T10 and T11. |
| `rtk rg -n "echothink/0003-new-tab-and-first-run.patch" ../patches/series` | Passed: T10's patch is active in the inherited patch series. |
| `rtk rg -n "Status: BLOCKED|T11 is not marked|No login-gate spec was authored|T21 must not consume" docs/echothink-browser-alpha/t20-define-login-gate-local-state-and-allowlist.md` | Passed: the T20 task note records the blocker and prevents downstream implementation from treating it as a spec. |
| `rtk git diff --check` | Passed: no whitespace errors. |

Known limitations:

- This is a blocker record, not the M4 login-gate spec.
- T21 must not use the T20 task note as authorization to implement
  `patches/echothink/0006-login-gate.patch`.
- The `chrome://echothink-diagnostics` route is referenced by T10, but its
  diagnostics WebUI ownership and readiness still need to be resolved before it
  can be relied on as a final login-gate exception.

## T11 Notes

Changed files:

- `patches/echothink/0011-first-run-gate-shell.patch` (new Echothink patch)
- `patches/series` (appended `echothink/0011-first-run-gate-shell.patch` to the
  Echothink tail block after `echothink/0005-default-search-provider.patch`)
- `docs/echothink-browser-alpha/t11-add-first-run-shell.md` (new task note)
- `docs/progress.md` (this file)

Native files the patch touches:

- `chrome/browser/chrome_browser_main.cc` (gate the first-run `AddFirstRunTabs`
  block so the Echothink first-run shell is the sole first-run tab)

Prerequisite status:

- T11 depends on T10; T10 is marked `DONE`. The canonical-root mismatch (T00) is
  carried forward: the patch and `patches/series` live in the inherited tree one
  directory up, while this note lives under `echothink-studio-new/docs`.

Scope boundaries (avoids overlap / patch collision):

- T10 (`0003`) owns the shell **page** `chrome://echothink-first-run` and opening
  it on first run additively.
- T11 (this task, `0011`) owns the first-run **gate**: on first launch present
  ONLY the gate shell; suppress the inherited `chrome://ungoogled-first-run`
  how-to tab and the normal-profile workspace / New Tab tabs
  (`master_prefs_->new_tabs`) before setup.
- T20 (spec) + T21 (`0006-login-gate.patch`) own the ongoing login gate:
  auth/device readiness flags, the unauthenticated navigation allowlist,
  blocked-navigation enforcement + explanation page, and restoring normal
  browsing after setup. T11 deliberately adds no navigation interception.

Implementation decisions:

- Reuse the existing `chrome://echothink-first-run` shell (no second page), per
  the brief ("reuse the New Tab fallback style where possible", "keep the shell
  minimal and service-oriented"). The shell is static, script-free, renders
  offline, links only to sign-in / device enrollment / diagnostics / update /
  support/download, and embeds no workspace or business data.
- Single narrow edit inside `if (first_run::IsChromeFirstRun())`: replace the
  three `AddFirstRunTabs` calls (echothink shell + inherited how-to + workspace
  tabs) with a single call that opens only the echothink shell. The inherited
  `--app`/`--app-id` guard is preserved; non-first-run startup is untouched; a
  New Tab still resolves to `https://app.echothink.ai/newtab` (seeded by `0002`).
- Patch number `0011` chosen to avoid the change plan's reserved band
  (`0004` = bundled extension / T13, parallel in W4; `0006` = login gate / T21;
  `0007`–`0010` = device identity / request proof / echo router / packaging).
  Series order, not the integer, governs application: `0011` sorts after `0003`,
  so the first-run block `0003` introduced is present when `0011` applies.

Validation commands and results (run from the inherited repository root):

| Command | Result |
|---|---|
| `git apply --numstat patches/echothink/0011-first-run-gate-shell.patch` | Passed (exit 0): `12 3 chrome/browser/chrome_browser_main.cc`. |
| `python3 devutils/check_patch_files.py` | Passed (exit 0): patch parses, referenced in series, no duplicates, no unused. |
| `python3 devutils/check_gn_flags.py` | Passed (exit 0). |
| `python3 devutils/validate_config.py` | Passed (exit 0; clean on POSIX). |
| Series file-mapping loop | `missing_count=0`; Echothink tail `0001, 0002, 0003, 0005, 0011`, contiguous after all inherited patches. |
| Real `patch -p1` against a reconstructed post-`0003` `chrome_browser_main.cc` | Passed: dry-run exit 0, applied cleanly; resulting first-run block contains only `AddFirstRunTabs({GURL("chrome://echothink-first-run")})`, with the `ungoogled-first-run` and `master_prefs_->new_tabs` lines removed. |

Build-pipeline application command (deferred; no local Chromium checkout):

- `patch -p1 < patches/echothink/0011-first-run-gate-shell.patch` from the pinned
  Chromium 148.0.7778.178 source root after inherited patches and after
  `echothink/0001..0003`, or
  `python3 devutils/validate_patches.py --local <unmodified-chromium-src>`.

Known limitations:

- No full Chromium source checkout locally, so real `patch -p1` was validated
  against a reconstructed post-`0003` fragment, not the full pinned tree, and no
  runtime browser smoke test was run. Exact `@@` offsets must be confirmed at
  build time; `patch -p1` fuzzy matching should absorb small drift.
- First-run *presentation* gate only — no ongoing navigation blocking until T21
  lands `echothink/0006-login-gate.patch`.
- Suppressing `master_prefs_->new_tabs` at first run also suppresses any
  enterprise-configured `first_run_tabs` for that first launch (intentional for a
  gated first launch; noted for T30/T31 packaging).
- `chrome://echothink-diagnostics` (referenced by the reused shell) remains a
  known dead `chrome://` link until its owning task lands.

## T31 Notes

Changed files:

- `patches/echothink/0010-windows-packaging-identity.patch`
- `patches/series`
- `docs/echothink-browser-alpha/t31-implement-windows-packaging-identity-patch.md`
- `docs/ungoogled_to_echothink_browser_change_plan.md`
- `docs/echothink_browser_construction.md`
- `docs/progress.md`

Prerequisite status:

- T31 depends on T30; T30 is marked `DONE`.
- T30's prerequisite chain to T05 and T06 is already complete. T05 supplies the
  product-string baseline, and T06 supplies `assets/icons/echothink.ico` and
  `assets/installer/echothink-setup.ico`.

Implementation decisions:

- Created the active Windows packaging identity patch at
  `patches/echothink/0010-windows-packaging-identity.patch`.
- Appended `echothink/0010-windows-packaging-identity.patch` to the active
  Echothink tail in `patches/series` after
  `echothink/0011-first-run-gate-shell.patch`.
- Implemented the Alpha default as T30's `dev` track:
  `Echothink Browser Dev` for Windows shell/app identity,
  `Echothink\\Browser Dev\\Application` install path components,
  `Software\\Echothink\\Browser Dev` installer registry roots,
  `Echothink Browser Setup` / `EchothinkBrowserSetup` installer metadata, and
  `Echothink Browser Dev` in `chrome://version` build labels. Machine-readable
  update/package channel metadata remains T32 because Chromium's non-Google
  install mode reports an empty runtime channel.
- Preserved Alpha's low-risk executable/internal-name boundary: no rename of
  `chrome.exe`, `chrome_proxy.exe`, `setup.exe`, or `mini_installer.exe`; no
  sandbox ID, COM GUID, app container SID prefix, update-mechanic, network,
  TLS, renderer, downloads, history, bookmarks, password-manager, cookie, or
  DevTools changes.
- Documented mini-installer icon handoff to
  `assets/installer/echothink-setup.ico` but did not embed binary icon deltas
  in the unified-diff patch.

Validation commands and results:

| Command | Result |
|---|---|
| `rtk ls -l patches/echothink/0010-windows-packaging-identity.patch assets/icons/echothink.ico assets/installer/echothink-setup.ico` | Passed: patch and required icon assets exist. |
| `rtk rg -n "echothink/0010-windows-packaging-identity.patch" patches/series` | Passed: active series entry present. |
| `rtk rg -n "Echothink Browser Dev|EchothinkBrowserSetup|Browser Dev|Software\\\\Echothink" patches/echothink/0010-windows-packaging-identity.patch` | Passed: expected identity strings present. |
| `rtk git apply --numstat patches/echothink/0010-windows-packaging-identity.patch` | Passed: patch parses cleanly; six source files touched. |
| `rtk python3 devutils/check_patch_files.py` | Passed, exit 0. |
| `rtk python3 devutils/check_gn_flags.py` | Passed, exit 0. |
| `rtk python3 devutils/validate_config.py` | Passed, exit 0. |

Build-pipeline application command (deferred; no local Chromium checkout):

- `patch -p1 < patches/echothink/0010-windows-packaging-identity.patch` from the
  pinned Chromium `148.0.7778.178` source root after inherited patches and
  earlier active Echothink patches have applied.

Known limitations:

- No local Chromium source checkout exists, so real patch application against
  the pinned source and a Windows compile were not run.
- No installer was built or installed here. Start Menu, taskbar, Apps &
  Features, UAC/file-description, uninstall, and icon smoke tests remain T32/T36.
- Full side-by-side Canary/Beta/Stable/Enterprise Stable install modes still
  need final app/update IDs and packaging docs from T32.
