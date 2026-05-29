# T24 Implement Narrow Extension Bridge

Date: 2026-05-29
Wave: W7
Delivery target: M5 - device bridge API
Status: DONE

## Current State

T24 depends on T13 and T23. Both prerequisites are complete:

- T13 is `DONE` and supplies the bundled workspace extension ID
  `lokdibgfmiemhdoogailbfpdggndpolk` with narrow manifest permissions.
- T23 is `DONE` and supplies the native device identity implementation in
  active patch `patches/echothink/0007-device-identity.patch`.

T24 adds the active bridge patch:

```text
patches/echothink/0024-narrow-extension-bridge.patch
```

and appends it to `patches/series` after
`echothink/0018-side-panel-local-states.patch`. The patch number is outside the
reserved `0008` proof-helper slot because T26 still owns
`patches/echothink/0008-request-proof-helper.patch`.

## Implementation

The bridge exposes one Chrome extension API namespace to the bundled workspace
extension:

```text
chrome.echothinkDevice
```

Allowed methods:

- `getDeviceStatus`
- `requestEnrollmentChallenge`
- `signProofPayload`
- `clearEnrollment`

The API is restricted twice:

- `_api_features.json` allowlists only the SHA1 hashed ID for bundled extension
  `lokdibgfmiemhdoogailbfpdggndpolk` and disables generic component-extension
  auto-grant.
- The native implementation checks the exact caller extension ID before reading
  device state, generating enrollment material, signing, or resetting.

The bundled extension manifest is unchanged. It still declares only:

```text
sidePanel
storage
tabs
activeTab
scripting
```

Host permissions remain limited to Echothink-owned domains.

## Bridge Behavior

`getDeviceStatus` returns non-secret metadata only: support flag, protected-key
presence, installation ID, key ID, algorithm, key storage name, browser
channel/version, public JWK, profile enrollment status, readiness booleans, and
reset-required state.

`requestEnrollmentChallenge` ensures local enrollment material exists through
the T23 native device identity boundary and returns public-key registration
material plus non-secret browser metadata. It does not call backend services.

`signProofPayload` signs a bounded UTF-8 payload string with the browser-owned
device key and returns only the key ID, algorithm, signature, and signature
encoding. The private key remains inside native browser code. T25/T26 still own
the canonical request-proof payload and Echothink destination allowlist before
the extension attaches proofs to protected API requests.

`clearEnrollment` calls the T23 reset helper to delete the protected local key,
clear local enrollment/readiness prefs, and rotate local installation state.

Defined bridge error codes:

- `missing_device`
- `locked_key`
- `unsupported_platform`
- `reset`
- `invalid_payload`

## Changed Files

- `extensions/echothink-workspace/background.js`
- `patches/echothink/0024-narrow-extension-bridge.patch`
- `patches/series`
- `docs/echothink-browser-alpha/t24-implement-narrow-extension-bridge.md`
- `docs/ungoogled_to_echothink_browser_change_plan.md`
- `docs/echothink_browser_construction.md`
- `docs/progress.md`

The patch itself modifies these Chromium paths when applied:

- `chrome/browser/BUILD.gn`
- `chrome/browser/echothink/device_identity/device_identity_service.h`
- `chrome/browser/echothink/device_identity/device_identity_service.cc`
- `chrome/browser/extensions/api/BUILD.gn`
- `chrome/browser/extensions/api/echothink_device/BUILD.gn`
- `chrome/browser/extensions/api/echothink_device/echothink_device_api.h`
- `chrome/browser/extensions/api/echothink_device/echothink_device_api.cc`
- `chrome/common/extensions/api/_api_features.json`
- `chrome/common/extensions/api/api_sources.gni`
- `chrome/common/extensions/api/echothink_device.idl`
- `chrome/browser/resources/echothink_workspace/background.js`

## Boundaries Preserved

This task does not implement backend services, gateway logic, search ranking,
chat orchestration, workflow orchestration, business pages, canonical request
proof policy, replay protection, or proof validation.

The patch does not change Chromium network stack, TLS validation, sandbox,
renderer internals, downloads, history, bookmarks, password manager, cookies,
or DevTools behavior.

No private key bytes, DPAPI blobs, access tokens, raw unprotected key handles,
or proof internals are exposed to extension JavaScript. The source extension
contains no token/private-key/proof-header handling.

## Validation

Run from the inherited repository root.

| Command | Result |
|---|---|
| `rtk rg -n "^\\| T13 \\|[^|]*\\|[^|]*\\|[^|]*\\| DONE \\|" echothink-studio-new/docs/progress.md` | Passed: T13 is marked `DONE`. |
| `rtk rg -n "^\\| T23 \\|[^|]*\\|[^|]*\\|[^|]*\\| DONE \\|" echothink-studio-new/docs/progress.md` | Passed: T23 is marked `DONE`. |
| `rtk rg -n "^echothink/0007-device-identity\\.patch$" patches/series` | Passed: T23 patch is active. |
| `rtk rg -n "^echothink/0024-narrow-extension-bridge\\.patch$" patches/series` | Passed: T24 patch is active. |
| `rtk git apply --numstat patches/echothink/0024-narrow-extension-bridge.patch` | Passed: unified diff parses cleanly and reports the expected Chromium bridge/schema/resource changes. |
| `rtk python3 devutils/check_patch_files.py` | Passed, exit 0. |
| `rtk python3 devutils/check_gn_flags.py` | Passed, exit 0. |
| `rtk python3 devutils/validate_config.py` | Passed, exit 0. |
| `rtk python3 -m json.tool extensions/echothink-workspace/manifest.json` | Passed: manifest JSON parses. |
| Manifest shape check with Node | Passed: MV3, no `update_url`, exact permissions and Echothink host permissions preserved, and forbidden broad permissions absent. |
| `rtk node --check extensions/echothink-workspace/background.js` | Passed. |
| `rtk rg -n "private[_-]?key|privateKey|DPAPI|protected_payload|access[_-]?token|refresh[_-]?token|Authorization|Bearer|DPoP|signature" extensions/echothink-workspace` | Exited 1 as expected: extension source contains no private-key, token, proof-header, or signature handling. |

## Known Limitations

- This macOS worktree has no local Chromium source checkout or Windows runtime
  build, so Windows compile, DPAPI runtime, component-extension API smoke, and
  unauthorized-extension runtime checks were not run here.
- `signProofPayload` is a bundled-extension-only signing bridge. T25/T26 still
  must define and enforce canonical request-proof payloads and the Echothink
  destination allowlist before proofs are attached to protected API requests.
