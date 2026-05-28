# T10 Implement New Tab Route And Fallback

Date: 2026-05-28
Wave: W3
Delivery target: M2 — `0003-new-tab-and-first-run.patch`
Status: DONE

## Prerequisite Check

| Prerequisite | Status in `docs/progress.md` | Notes |
|---|---|---|
| T08 — Implement default policies/preferences patch | DONE | Seeds the normal-profile New Tab route to `https://app.echothink.ai/newtab` via the inherited `HandleNewTabPageLocationOverride()` hook in `patches/echothink/0002-default-policies-and-preferences.patch`. |
| T09 — Confirm New Tab insertion point | DONE | Selected the `HandleNewTabPageLocationOverride()` hook and assigned the local fallback page to T10/T11/T20. |

Both prerequisites are DONE. The canonical-root mismatch recorded by T00 is
carried forward: the requested root `echothink-studio-new` contains only `docs/`,
while the inherited Ungoogled Chromium patch/config tree lives one directory up.
This patch artifact is therefore placed in the inherited tree's `patches/echothink/`
alongside the existing Echothink patches, consistent with T05/T06/T08/T19.

## Scope Split With T08

The authenticated New Tab route already exists. T08's `0002` patch seeds the
normal-profile New Tab route to `https://app.echothink.ai/newtab` through the
inherited custom-ntp hook. **T10 does not re-edit that hook**, so the two patches
never touch the same lines.

T10's novel contribution is the **local fallback / first-run landing page** that
the remote route degrades to when the workspace is unauthenticated or unavailable
(offline, signed-out, or pre-enrollment).

## What Was Implemented

Created `patches/echothink/0003-new-tab-and-first-run.patch` and inserted it into
`patches/series` after `echothink/0002-default-policies-and-preferences.patch`
and before `echothink/0005-default-search-provider.patch`.

The patch:

1. **Adds a new local WebUI page** `chrome://echothink-first-run`
   (`chrome/browser/ui/webui/echothink_first_run.h`, new file). It reuses the
   inherited `URLDataSource` pattern from
   `patches/extra/ungoogled-chromium/first-run-page.patch`, serving a static,
   self-contained HTML page from memory. It:
   - Requires no network access and renders fully offline.
   - Needs no JavaScript, so the WebUI default CSP is left in place (no
     `script-src` override).
   - Links **only** to the allowed unauthenticated destinations from change-plan
     sections 5.4 / 5.8:
     - Login — `https://auth.echothink.ai/login`
     - Device enrollment — `https://auth.echothink.ai/device/enroll`
     - Diagnostics — `chrome://echothink-diagnostics`
     - Update — `https://updates.echothink.ai/`
     - Support — `https://app.echothink.ai/support`
     - Download — `https://app.echothink.ai/download-browser`
   - Contains **no workspace content, no user data, and no protected business
     data** — only the product name, an explanatory sentence, and the static
     navigation links above.

2. **Registers the WebUI** by adding `EchothinkFirstRunUIConfig` to
   `RegisterChromeWebUIConfigs()` and the `echothink_first_run.h` include in
   `chrome/browser/ui/webui/chrome_web_ui_configs.cc`, adjacent to the inherited
   `UngoogledFirstRunUIConfig` entry.

3. **Registers the host** `"echothink-first-run"` in `ChromeURLHosts()` in
   `chrome/common/webui_url_constants.cc`, so the page is reachable and
   omnibox-suggestible.

4. **Opens the page on first run** by adding
   `browser_creator_->AddFirstRunTabs({GURL("chrome://echothink-first-run")})`
   in `chrome/browser/chrome_browser_main.cc`, **before** the inherited
   `chrome://ungoogled-first-run` tab. This is additive: the inherited Ungoogled
   first-run how-to page is preserved, while the Echothink login-gate landing
   page opens in the foreground on first launch.

### Native files touched

| File | Change |
|---|---|
| `chrome/browser/ui/webui/echothink_first_run.h` | New: local fallback WebUI controller + data source. |
| `chrome/browser/ui/webui/chrome_web_ui_configs.cc` | Register `EchothinkFirstRunUIConfig` + include. |
| `chrome/common/webui_url_constants.cc` | Add `echothink-first-run` host. |
| `chrome/browser/chrome_browser_main.cc` | Add `chrome://echothink-first-run` as first first-run tab. |

## Protected-Area Compliance

- No change to the network stack, TLS validation, sandbox, renderer internals,
  downloads, history, bookmarks, password manager, cookies, or DevTools.
- The New Tab route hook (`HandleNewTabPageLocationOverride()`) is **not** edited
  by this patch; it remains as T08 left it. Incognito New Tab behavior is
  unchanged.
- The fallback page is read-only static HTML with no script and no business data.
- All four edits are small and single-purpose, ordered after every inherited
  patch.

## Delivery Criteria Mapping

| Criterion | Status | Evidence |
|---|---|---|
| `0003-new-tab-and-first-run.patch` exists | Met | `patches/echothink/0003-new-tab-and-first-run.patch`, referenced in `patches/series`. |
| New tabs open Echothink workspace route | Met (via 0002 + 0003 series) | Route seeded by `0002`; this patch adds the local fallback the route degrades to. Cumulative series application yields both behaviors. |
| Fallback page works without backend availability | Met | `chrome://echothink-first-run` is a local in-memory WebUI; no network needed to render. |
| No protected content embedded in the browser | Met | Page contains only product name + static links to the allowed destinations. |

## Validation

Run from the inherited repository root.

| Command | Result |
|---|---|
| `python3 devutils/check_patch_files.py` | exit 0 — patch parses, is referenced in `series`, no duplicates, no unused patches. |
| `git apply --numstat patches/echothink/0003-new-tab-and-first-run.patch` | exit 0 — parses cleanly: `121 0` `echothink_first_run.h`, `2 0` `chrome_web_ui_configs.cc`, `1 0` `webui_url_constants.cc`, `1 0` `chrome_browser_main.cc`. |
| `python3 devutils/check_gn_flags.py` | exit 0. |
| `python3 devutils/validate_config.py` | exit 0 (clean on POSIX; Windows path-separator warning noted by T00 does not apply here). |

Patch placement and ordering verified: the patch lives under `patches/echothink/`
and its `series` entry is appended after all inherited patches, between
`echothink/0002` and `echothink/0005`.

## Known Limitations

- No Chromium source checkout exists locally (per T03/T08), so real `patch -p1`
  application and a runtime browser smoke test were not performed. Application is
  deferred to the build pipeline. The documented application command is in the
  patch header (`Validation:` line).
- The `@@` hunk line numbers for the three edited native files are anchored on
  the lines the inherited `first-run-page.patch` introduces; exact post-inherited
  line offsets must be confirmed when the patch is applied against the pinned
  Chromium `148.0.7778.178` tree. `patch -p1` fuzzy matching is expected to absorb
  small offset drift since the surrounding context is taken verbatim from the
  inherited patch.
- `chrome://echothink-diagnostics` is referenced as the diagnostics link target
  per the change plan's allowed-destination list, but the diagnostics WebUI
  itself is owned by a later task (change plan section 5.8). Until that lands the
  diagnostics link is a known dead `chrome://` link.
- The decision of *when* to redirect a failed/unauthenticated remote `/newtab`
  load to `chrome://echothink-first-run` (vs. relying on the remote workspace to
  redirect to login) is a backend/gateway and enrollment concern owned by
  T11/T20; this patch only provides the local destination and the first-run
  entry point.
