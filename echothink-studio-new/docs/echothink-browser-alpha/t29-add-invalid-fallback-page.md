# T29 Add Invalid Echo Route Fallback Page

Date: 2026-05-29
Wave: W6
Prerequisites: T28
Delivery target: M6 safe route failure
Status: DONE

## Prerequisite Check

| Prerequisite | Status in `docs/progress.md` | Notes |
|---|---|---|
| T28 - Implement optional `echo://` resolver | DONE | `docs/progress.md` marks T28 `DONE`; `patches/echothink/0009-echo-protocol-router.patch` exists and is active in `patches/series`. |

T29 can proceed. The canonical-root mismatch recorded by T00 remains the
accepted Alpha baseline: task documentation lives under
`echothink-studio-new/docs`, while active Chromium patch artifacts and
`patches/series` live in the inherited browser build root.

## What Was Implemented

Created the active Echothink-owned patch:

```text
patches/echothink/0012-invalid-echo-route-fallback.patch
```

and inserted it in `patches/series` immediately after:

```text
echothink/0009-echo-protocol-router.patch
```

The patch keeps T28's valid route mapping intact and adds a safe failure path:

- Valid routes still resolve to `https://app.echothink.ai/` destinations through
  `ResolveEchoURL()`.
- Any `echo://` URL that the resolver rejects is rewritten locally to
  `chrome://echothink-invalid-echo`.
- The invalid fallback URL carries no query string, fragment, or original route.
- The original `echo://` referrer is cleared for both valid and invalid cases.

## Local Fallback Page

The new WebUI page is:

```text
chrome://echothink-invalid-echo
```

It is implemented as a static, in-memory URLDataSource in:

```text
chrome/browser/ui/webui/echothink_invalid_echo.h
```

The page is intentionally generic. It does not display the original `echo://`
URL, route segments, project IDs, task-wave IDs, app-domain values, artifact
IDs, approval IDs, query strings, fragments, or workspace content.

Safe navigation links are limited to:

- `https://app.echothink.ai/dashboard`
- `chrome://echothink-first-run`
- `https://app.echothink.ai/support`

## Protected-Area Compliance

- No network stack, TLS validation, sandbox, renderer internals, downloads,
  history, bookmarks, password manager, cookies, or DevTools behavior changed.
- No backend service, gateway logic, search ranking, chat orchestration,
  workflow orchestration, or business page was added.
- The fallback is a browser-shell error surface only. HTTPS app and gateway
  services remain responsible for authorization and device proof after the user
  opens any workspace destination.

## Changed Files

- `patches/echothink/0012-invalid-echo-route-fallback.patch`
- `patches/series`
- `docs/echothink-browser-alpha/t29-add-invalid-fallback-page.md`
- `docs/ungoogled_to_echothink_browser_change_plan.md`
- `docs/echothink_browser_construction.md`
- `docs/progress.md`

## Validation

Validation was run from the inherited browser repository root unless noted.

| Command | Result |
|---|---|
| `rtk git apply --numstat patches/echothink/0012-invalid-echo-route-fallback.patch` | Passed: patch parses; reports `20 6 chrome/browser/ui/browser_navigator.cc`, `111 0 chrome/browser/ui/webui/echothink_invalid_echo.h`, `2 0 chrome/browser/ui/webui/chrome_web_ui_configs.cc`, and `1 0 chrome/common/webui_url_constants.cc`. |
| `rtk python3 devutils/check_patch_files.py` | Passed, exit 0. |
| `rtk python3 devutils/check_gn_flags.py` | Passed, exit 0. |
| `rtk python3 devutils/validate_config.py` | Passed, exit 0. |
| `rtk git apply --check --include=chrome/browser/ui/browser_navigator.cc .../patches/echothink/0012-invalid-echo-route-fallback.patch` from `/private/tmp/echothink-t28-chromium` | Passed against the existing post-T28 `browser_navigator.cc` source copy. |

Patch application command for a real Chromium source checkout:

```bash
patch -p1 < patches/echothink/0012-invalid-echo-route-fallback.patch
```

Run that from the pinned Chromium `148.0.7778.178` source root after inherited
patches and active Echothink predecessors through
`echothink/0009-echo-protocol-router.patch` have applied.

## Known Limitations

- No full Chromium source checkout, compile, or runtime browser smoke test was
  available here. A built browser still needs runtime verification that
  `echo://unknown`, `echo://project`, `echo://project/secret?token=1`, and
  `echo://artifact/private#frag` show `chrome://echothink-invalid-echo`.
- Full `patch -p1` application against Chromium source was not run because this
  environment only had the T28 `browser_navigator.cc` source copy available,
  not the WebUI registration source files.
- `chrome://echothink-first-run` is used as the setup fallback link. That page
  exists via T10/T11; diagnostics remains owned by later login-gate work.
