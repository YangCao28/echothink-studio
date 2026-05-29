# T23 Implement Device Key Generation And Storage

Date: 2026-05-29
Wave: W6
Delivery target: M5 - `0007-device-identity.patch`
Status: DONE

## Current State

T23 depends on T22. T22 is marked `DONE` in `docs/progress.md`, and the final
M5 device identity design exists at
`docs/echothink-browser-alpha/t22-define-device-identity-and-dpapi-storage.md`.

T23 implements that design with the active Echothink patch
`patches/echothink/0007-device-identity.patch`. The patch is listed in
`patches/series` immediately after `echothink/0006-login-gate.patch`, so it
lands after the login-gate readiness preferences that its reset path clears.

## Prerequisite Check

| Prerequisite | Required by | Status | Evidence |
|---|---|---|---|
| T22 - Define device identity and DPAPI storage | T23 | DONE | `docs/progress.md` marks T22 `DONE`; the T22 task note defines local device identity fields, Windows DPAPI current-user private-key storage, non-secret metadata placement, reset/logout behavior, and bridge boundaries. |

## Implementation

`0007-device-identity.patch` adds a narrow browser-owned device identity
component under `chrome/browser/echothink/device_identity/`.

The patch:

- Registers Local State prefs for non-secret identity metadata:
  `installation_id`, `key_id`, `key_algorithm`, `public_key_jwk`,
  `key_created_at`, `key_storage`, browser channel, and browser version.
- Registers profile prefs for non-secret enrollment metadata and T20/T21
  readiness state.
- Ensures device identity during browser startup on Windows from
  `chrome/browser/chrome_browser_main.cc`.
- Generates an ECDSA P-256 / `ES256` keypair when no protected local key exists.
- Protects serialized private-key bytes with Windows DPAPI current-user scope
  using `CryptProtectData` and `CRYPTPROTECT_UI_FORBIDDEN`.
- Persists the protected key envelope at
  `User Data/Echothink Device Identity/device_key.dpapi`.
- Reloads the protected key on restart with `CryptUnprotectData` and preserves
  the existing `installation_id`, `key_id`, and public metadata.
- Refuses to silently replace an existing protected key that cannot be
  unprotected or parsed; explicit reset is required.
- Exposes native helper functions for future bridge work without exposing
  private key bytes or DPAPI blobs to JavaScript.

## Reset Behavior

`ResetLocalEnrollmentState` removes local enrollment state by:

- Deleting `User Data/Echothink Device Identity/device_key.dpapi`.
- Clearing Local State key metadata.
- Rotating `echothink.device.installation_id`.
- Refreshing non-secret browser channel/version metadata.
- Clearing profile enrollment metadata.
- Clearing T20/T21 setup-readiness prefs so the login gate is re-enabled.

The reset helper is native-only in this task. T24 owns exposing a narrow
extension bridge method that can call it.

## Boundaries Preserved

This task does not implement an extension bridge, request-proof helper, backend
service, gateway logic, search ranking, chat orchestration, workflow
orchestration, or business pages.

The patch does not change Chromium network stack, TLS validation, sandbox,
renderer internals, downloads, history, bookmarks, password manager, cookies,
or DevTools behavior.

No private key bytes, access tokens, signed proof values, or proof internals are
included in JavaScript, logs, examples, or progress notes.

## Changed Files

- `patches/echothink/0007-device-identity.patch`
- `patches/series`
- `docs/echothink-browser-alpha/t23-implement-device-key-generation-and-storage.md`
- `docs/echothink-browser-alpha/t24-implement-narrow-extension-bridge.md`
- `docs/progress.md`

The patch itself modifies these Chromium paths when applied:

- `chrome/browser/BUILD.gn`
- `chrome/browser/chrome_browser_main.cc`
- `chrome/browser/chrome_content_browser_client.cc`
- `chrome/browser/echothink/device_identity/device_identity_service.h`
- `chrome/browser/echothink/device_identity/device_identity_service.cc`

## Validation

Run from the inherited repository root.

| Command | Result |
|---|---|
| `rtk rg -n "^\\| T22 \\|[^|]*\\|[^|]*\\|[^|]*\\| DONE \\|" echothink-studio-new/docs/progress.md` | Passed: T22 is marked `DONE` in the status column. |
| `rtk git apply --numstat patches/echothink/0007-device-identity.patch` | Passed: the patch parses as a Git patch and reports the expected five Chromium file changes. |
| `rtk rg -n "^echothink/0007-device-identity\\.patch$" patches/series` | Passed: `0007-device-identity.patch` is active in `patches/series`. |
| `rtk python3 devutils/check_patch_files.py` | Passed, exit 0. |
| `rtk python3 devutils/check_gn_flags.py` | Passed, exit 0. |
| `rtk python3 devutils/validate_config.py` | Passed, exit 0. |
| `rtk rg -n "CryptProtectData|CryptUnprotectData|windows_dpapi_current_user_v1|ResetLocalEnrollmentState|public_key_jwk|device_key.dpapi" patches/echothink/0007-device-identity.patch` | Passed: DPAPI protection, reset, public metadata, and protected-key file anchors exist. |
| `rtk rg -n "access[_]token|refresh[_]token|Authori[z]ation|B[e]arer|private[_]key[_]jwk|\\\"d\\\"" patches/echothink/0007-device-identity.patch echothink-studio-new/docs/echothink-browser-alpha/t23-implement-device-key-generation-and-storage.md` | Exited 1 as expected: no token strings or private JWK `d` member are present. |
| `rtk git diff --check` | Passed: no whitespace errors. |

## Known Limitations

- This macOS worktree has no local Chromium source checkout or Windows runtime
  build, so Windows compile, DPAPI runtime, restart persistence, and reset
  smoke tests were not run here.
- The patch header records the intended full application and Windows smoke
  command sequence for the T33/T34/T35 validation pipeline.
- T24 must still add the narrow extension bridge before JavaScript can request
  device status, enrollment challenge generation, proof signing, or reset.
