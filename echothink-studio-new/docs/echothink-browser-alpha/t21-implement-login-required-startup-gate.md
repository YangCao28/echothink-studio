# T21 Implement Login-Required Startup Gate

Date: 2026-05-29
Wave: W5
Delivery target: M4 - `0006-login-gate.patch`
Status: DONE

## Prerequisite Check

T21 depends on T20. T20 is marked `DONE` in `docs/progress.md`, and the
login-gate implementation contract is documented in
`docs/echothink-browser-alpha/t20-define-login-gate-local-state-and-allowlist.md`.

| Prerequisite | Required by | Status | Evidence |
|---|---|---|---|
| T20 - Define login gate local state and allowlist | T21 | DONE | `docs/progress.md` marks T20 `DONE`; the T20 task note defines readiness prefs, allowlist, blocked-navigation behavior, setup unlock, diagnostics/support exceptions, and reset/logout semantics. |

## Implementation

Created the active Echothink login-gate patch:

- `patches/echothink/0006-login-gate.patch`

Updated `patches/series` so the patch applies after
`echothink/0011-first-run-gate-shell.patch` and before the later `echo://`
navigation patches. This keeps the first-run shell in place before the ongoing
navigation gate and keeps later route rewriting layered after setup gating.

Native files touched by the patch:

- `chrome/browser/chrome_content_browser_client.cc`
- `chrome/browser/ui/browser_navigator.cc`

Implemented browser-side behavior:

- Registers T20's non-secret profile readiness prefs:
  `echothink.auth.session_ready`, `echothink.device.enrolled`,
  `echothink.device.verified`, `echothink.setup.complete`,
  `echothink.setup.completed_at`, `echothink.setup.last_blocked_at`, and
  `echothink.setup.last_blocked_scheme`.
- Treats `echothink.setup.complete` as a derived cached boolean. It is true
  only when auth readiness, device enrollment, and device verification are all
  true; otherwise the cached flag is cleared.
- Routes `chrome://newtab` to `chrome://echothink-first-run` until setup is
  complete, so normal New Tab/workspace browsing is not presented pre-setup.
- Adds a browser-level `NavigateParams` gate that rewrites pre-setup
  browser-created top-level navigations to `chrome://echothink-first-run` and
  clears the referrer.
- Preserves the explicit T20 unauthenticated allowlist for setup, diagnostics,
  update, support/download, and browser-required routes.
- Leaves normal Chromium browsing unchanged after setup readiness is satisfied.

The patch does not implement backend services, gateway logic, search ranking,
chat orchestration, workflow orchestration, business pages, network stack, TLS
validation, sandbox, renderer internals, downloads, history, bookmarks,
password manager, cookies, or DevTools behavior.

## Allowlist Implemented

Before setup completion, the browser-level gate allows:

- `chrome://echothink-first-run`
- `chrome://echothink-diagnostics`
- `chrome://version`
- `chrome://policy`
- `chrome://settings/help`
- `chrome://extensions`
- `https://auth.echothink.ai/login`
- `https://auth.echothink.ai/browser/callback`
- `https://auth.echothink.ai/device/enroll`
- `https://auth.echothink.ai/device/complete`
- `https://app.echothink.ai/browser-required`
- `https://app.echothink.ai/support`
- `https://app.echothink.ai/download-browser`
- `https://updates.echothink.ai/` and subpaths

Blocked browser-level navigations are rewritten to
`chrome://echothink-first-run` without adding the blocked URL, query, fragment,
or referrer to the local page.

## Validation

Commands were run from the inherited browser patch/config root, where
`patches/`, `devutils/`, and `echothink-studio-new/docs/` are present.

| Command | Result |
|---|---|
| `rtk rg -n "^\\| T20 \\|[^|]*\\|[^|]*\\|[^|]*\\| DONE \\|" echothink-studio-new/docs/progress.md` | Passed: T20 is marked `DONE`. |
| `rtk git apply --numstat patches/echothink/0006-login-gate.patch` | Passed: patch parses cleanly; `50` inserted lines in `chrome/browser/chrome_content_browser_client.cc` and `92` inserted lines in `chrome/browser/ui/browser_navigator.cc`. |
| `rtk rg -n "echothink/0006-login-gate.patch" patches/series` | Passed: patch is active in `patches/series`. |
| `rtk rg -n "Echothink-Patch: 0006-login-gate|kEchothinkAuthSessionReadyPref|ApplyEchothinkLoginGate|auth.echothink.ai|app.echothink.ai|updates.echothink.ai|RegisterProfilePrefs|kEchothinkFirstRunURL|content/public/common/url_constants.h" patches/echothink/0006-login-gate.patch` | Passed: patch includes metadata, readiness prefs, navigation gate, allowlist hosts, pref registration, direct URL constants include, and first-run rewrite. |
| `rtk git apply --check --include=chrome/browser/ui/browser_navigator.cc /Users/yangcao/source/echothink-studio/.worktrees/task/task-t37-produce-windows-alpha-cad6e2/patches/echothink/0006-login-gate.patch` from `/private/tmp/echothink-t28-chromium` | Passed against the available pinned-source `browser_navigator.cc` copy. |
| `rtk python3 devutils/check_patch_files.py` | Passed, exit 0. |
| `rtk python3 devutils/check_gn_flags.py` | Passed, exit 0. |
| `rtk python3 devutils/validate_config.py` | Passed, exit 0. |
| `rtk git diff --check` | Passed: no whitespace errors. |

## Known Limitations

- No local full Chromium checkout, compile, or runtime browser smoke test was
  available in this macOS worktree.
- The `chrome_content_browser_client.cc` hunk was parse-validated and documented
  with an application command, but only the `browser_navigator.cc` hunk could be
  checked against a local pinned-source copy.
- `chrome://echothink-diagnostics` remains an allowlisted planned route until
  its owning diagnostics task implements the WebUI.
- Full Alpha patch validation remains blocked by T26 until
  `patches/echothink/0008-request-proof-helper.patch` is implemented.
