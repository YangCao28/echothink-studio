# T24 Implement Narrow Extension Bridge

Date: 2026-05-29
Wave: W7
Delivery target: M5 - device bridge API
Status: READY

## Current State

T24 depends on T13 and T23. Both prerequisites are now complete:

- T13 is marked `DONE` and supplies the bundled workspace extension ID
  `lokdibgfmiemhdoogailbfpdggndpolk` with narrow manifest permissions.
- T23 is marked `DONE` and supplies the native device identity implementation
  in active patch `patches/echothink/0007-device-identity.patch`.

T24 is no longer blocked by missing device-key storage. This note is a handoff
refresh only; it does not implement the bridge.

## Prerequisite Check

| Prerequisite | Required by | Status | Evidence |
|---|---|---|---|
| T13 - Add bundled extension install patch | T24 | DONE | `docs/progress.md` marks T13 `DONE`; the task note records the fixed bundled extension ID and narrow manifest permissions. |
| T23 - Implement device key generation and storage | T24 | DONE | `docs/progress.md` marks T23 `DONE`; `patches/echothink/0007-device-identity.patch` exists and is active in `patches/series`. |

## Handoff For T24

The bridge implementation must call the native device identity boundary from
T23 instead of creating another key store. The expected bridge methods remain:

- `getDeviceStatus`
- `requestEnrollmentChallenge`
- `signProofPayload`
- `clearEnrollment`

The bridge must restrict callers to bundled extension ID
`lokdibgfmiemhdoogailbfpdggndpolk`, must not expose private key bytes or DPAPI
blobs to extension JavaScript, and must define errors for missing device,
locked key, unsupported platform, and reset.

## T24 Work Not Started

No Chromium bridge patch was created by this T23 handoff update. In particular,
this note does not:

- Create a new Echothink bridge patch.
- Add a bridge patch to `patches/series`.
- Add extension methods for `getDeviceStatus`, `requestEnrollmentChallenge`,
  `signProofPayload`, or `clearEnrollment`.
- Change the bundled extension manifest or permissions.
- Add broad host permissions, `nativeMessaging`, management APIs, or a
  general-purpose privileged bridge.
- Change backend services, gateway logic, search ranking, chat orchestration,
  workflow orchestration, business pages, network stack, TLS validation,
  sandbox, renderer internals, downloads, history, bookmarks, password manager,
  cookies, or DevTools behavior.
- Expose private key bytes, access tokens, signed proof values, or proof
  internals.

## Source Anchors Inspected

- `docs/ungoogled_to_echothink_browser_change_plan.md` sections 5.9 and 5.10,
  which sketch the device bridge and request proof boundaries.
- `docs/echothink_browser_construction.md` sections 5.6 and 5.7, which define
  the high-level device identity and request-proof architecture.
- `docs/dag-doc.md`, which defines T24 prerequisites, required bridge methods,
  and delivery criteria.
- `docs/progress.md`, which now marks T13 and T23 `DONE` and T24 `READY`.
- `docs/echothink-browser-alpha/t13-add-bundled-extension-install-patch.md`,
  which records the bundled extension ID and narrow manifest boundary.
- `docs/echothink-browser-alpha/t23-implement-device-key-generation-and-storage.md`,
  which records the completed native device identity implementation.
- `extensions/echothink-workspace/manifest.json`, which remains the bundled
  extension source manifest and should not be widened just to add the bridge.

## Validation

Run from the inherited repository root.

| Command | Result |
|---|---|
| `rtk rg -n "^\\| T13 \\|[^|]*\\|[^|]*\\|[^|]*\\| DONE \\|" echothink-studio-new/docs/progress.md` | Passed: T13 is marked `DONE` in the status column. |
| `rtk rg -n "^\\| T23 \\|[^|]*\\|[^|]*\\|[^|]*\\| DONE \\|" echothink-studio-new/docs/progress.md` | Passed: T23 is marked `DONE` in the status column. |
| `rtk rg -n "^echothink/0007-device-identity\\.patch$" patches/series` | Passed: the T23 patch is active. |
| `rtk rg -n "### T24: Implement Narrow Extension Bridge|Prerequisites: T13, T23|getDeviceStatus|signProofPayload" echothink-studio-new/docs/dag-doc.md echothink-studio-new/docs/ungoogled_to_echothink_browser_change_plan.md` | Passed: T24 scope and bridge method anchors exist. |
| `rtk python3 -m json.tool extensions/echothink-workspace/manifest.json` | Passed: source manifest parses as JSON. |
| `rtk git diff --check` | Passed: no whitespace errors. |

## Known Limitations

- This is a readiness handoff, not the M5 device bridge API implementation.
- T24 delivery criteria remain unmet until a future task creates the bridge
  patch and validates extension-side behavior.
- No runtime extension bridge smoke test was run because no bridge patch exists.
