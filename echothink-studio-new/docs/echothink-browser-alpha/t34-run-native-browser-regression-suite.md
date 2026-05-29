# T34 Run Native Browser Regression Suite

Date: 2026-05-29
Wave: W12
Prerequisites: T33
Delivery target: M7 regression report
Status: BLOCKED

## Blocker

T34 cannot run the native browser regression suite because its direct
prerequisite, T33, is not complete. The shared progress file marks T33 as
`BLOCKED`, and the T33 task note says the full inherited-plus-Echothink patch
validation pass was not run because the required Alpha patch set is incomplete.

The coordination rules require prerequisites to be marked `DONE` or explicitly
documented as acceptable baseline dependencies before starting dependent work.
No T34 source note, prerequisite task note, or `docs/progress.md` row accepts a
blocked T33 as an acceptable baseline dependency for native regression testing.

Because no fully validated patch set or runnable Windows Alpha browser build is
available from T33, this task cannot honestly validate native Chromium runtime
behavior for tabs, windows, popups, history, downloads, bookmarks, password
manager, cookies, local storage, TLS, DevTools, or extension loading.

## Missing Prerequisite Work

Complete and rerun T33 before resuming T34. T33 currently depends on these
blocked implementation artifacts:

| Prerequisite | Required artifact | Current status | Exact files or decisions needed |
|---|---|---|---|
| T23 - Implement device key generation and storage | `patches/echothink/0007-device-identity.patch` | BLOCKED | Complete the M5 device identity design in `docs/echothink-browser-alpha/t22-define-device-identity-and-dpapi-storage.md`, update `docs/progress.md`, create the `0007` patch, and add `echothink/0007-device-identity.patch` to `patches/series` when active. |
| T26 - Implement proof signing helper | `patches/echothink/0008-request-proof-helper.patch` | BLOCKED | Complete T24 bridge work, finalize `docs/echothink-browser-alpha/t25-define-request-proof-payload-and-allowlist.md`, update `docs/progress.md`, create the `0008` patch, and add `echothink/0008-request-proof-helper.patch` to `patches/series` when active. |

After those artifacts are active, T33 must rerun full patch validation against
the pinned Chromium `148.0.7778.178` source and mark T33 `DONE` before T34 can
run the native regression suite.

## Regression Report Status

This document is a blocker regression report, not a passing M7 native regression
report.

| Area | Required T34 validation | Status | Current result |
|---|---|---|---|
| Tabs and windows | Validate native Chromium tab and window behavior. | BLOCKED | Not run; T33 is blocked. |
| Popups | Validate native popup creation/blocking behavior. | BLOCKED | Not run; T33 is blocked. |
| History | Validate Chromium history ownership and behavior. | BLOCKED | Not run; T33 is blocked. |
| Downloads | Validate Chromium download manager ownership and behavior. | BLOCKED | Not run; T33 is blocked. |
| Bookmarks | Validate native bookmarks UI/storage behavior. | BLOCKED | Not run; T33 is blocked. |
| Password manager | Validate Chromium password manager behavior remains native. | BLOCKED | Not run; T33 is blocked. |
| Cookies and local storage | Validate Chromium cookie and site-storage behavior. | BLOCKED | Not run; T33 is blocked. |
| TLS | Validate Chromium TLS/certificate behavior remains native. | BLOCKED | Not run; T33 is blocked. |
| DevTools | Validate Chromium DevTools behavior remains available/native. | BLOCKED | Not run; T33 is blocked. |
| Extension loading | Validate bundled extension loading without weakening native extension primitives. | BLOCKED | Not run; T33 is blocked. |

## Regressions And Ownership

| Severity | Finding | Owning task or patch |
|---|---|---|
| BLOCKER | Native browser regression suite cannot start because full patch validation is incomplete. | T33, blocked by T23/T26. |
| BLOCKER | Required M5 Alpha patches are missing from both `patches/echothink/` and `patches/series`. | T23 `0007-device-identity`, T26 `0008-request-proof-helper`. |

No native runtime behavior regression is asserted by this blocked pass. The
failure is a prerequisite and validation-sequencing blocker.

## Chromium-Native Ownership

T34 made no browser patch, source, extension, asset, or packaging change. It did
not replace Chromium primitives or touch protected areas such as network stack,
TLS validation, sandbox, renderer internals, downloads, history, bookmarks,
password manager, cookies, local storage, or DevTools.

Chromium-native ownership cannot be confirmed at runtime until T33 produces a
validated patch set and a runnable browser build for this regression suite.

## Validation

Validation for this blocked pass is prerequisite and source-path based.

| Command | Result |
|---|---|
| `rtk rg -n "^\\| T33 \\|.*\\| DONE \\|" echothink-studio-new/docs/progress.md` | Exited 1 as expected: T33 is not marked `DONE`. |
| `rtk rg -n "^\\| T33 \\|.*\\| BLOCKED \\|" echothink-studio-new/docs/progress.md` | Passed: T33 is marked `BLOCKED`. |
| `rtk sed -n '860,878p' echothink-studio-new/docs/dag-doc.md` | Passed: T34 depends on T33 and requires the native browser regression report. |
| `rtk ls patches/echothink` | Passed: existing Echothink patches are listed, `0006-login-gate.patch` is present, and `0007`/`0008` are absent. |
| `rtk rg -n "echothink/0006-login-gate.patch" patches/series` | Passed: `0006-login-gate.patch` is active in the patch pipeline. |
| `rtk rg -n "echothink/0007-device-identity.patch|echothink/0008-request-proof-helper.patch" patches/series` | Exited 1 as expected: inactive missing patches are not listed in the active pipeline. |

## Known Limitations

- This is not a passing native browser regression report.
- No browser binary was launched and no tab/window/popup/history/downloads/
  bookmarks/password/cookie/local-storage/TLS/DevTools/extension runtime smoke
  was run.
- T34 must remain blocked until T33 is completed after T23 and T26 are complete.
