# T23 Implement Device Key Generation And Storage

Date: 2026-05-29
Wave: W6
Delivery target: M5 - `0007-device-identity.patch`
Status: READY

## Current State

T23 depends on T22. T22 is now marked `DONE` in `docs/progress.md` and the
final M5 device identity design exists at
`docs/echothink-browser-alpha/t22-define-device-identity-and-dpapi-storage.md`.

T23 is therefore no longer blocked by missing design work. It still has not
implemented the Chromium device identity patch.

## Prerequisite Check

| Prerequisite | Required by | Status | Evidence |
|---|---|---|---|
| T22 - Define device identity and DPAPI storage | T23 | DONE | `docs/progress.md` marks T22 `DONE`; the T22 task note defines local device identity fields, Windows DPAPI current-user private-key storage, non-secret metadata placement, reset/logout behavior, and bridge boundaries. |

## Implementation Contract From T22

T23 should implement `patches/echothink/0007-device-identity.patch` against the
T22 design:

- Generate an ECDSA P-256 / `ES256` device keypair in browser-owned native code.
- Protect private key material with Windows DPAPI current-user scope.
- Store the protected private-key blob in a dedicated user-data-dir file, not
  in profile preferences, extension storage, web storage, logs, docs examples,
  or progress notes.
- Store non-secret installation/key metadata in Local State.
- Store per-profile enrollment metadata and T20 readiness prefs in profile
  preferences.
- Persist identity across browser restart.
- Support explicit local device reset that deletes the protected blob, rotates
  `echothink.device.installation_id`, clears enrollment metadata, and re-enables
  the T20 login gate.
- Keep private key material unavailable to extension JavaScript; T24 will add
  the narrow bridge after this patch exists.

## T23 Work Not Started

No Chromium implementation patch was created in this T22 pass. In particular,
this note does not:

- Create `patches/echothink/0007-device-identity.patch`.
- Add `echothink/0007-device-identity.patch` to `patches/series`.
- Add asymmetric key generation, DPAPI storage, metadata persistence, restart
  loading, or reset handling.
- Change extension bridge APIs, request proof helpers, backend services,
  gateway logic, search ranking, chat orchestration, workflow orchestration, or
  business pages.
- Change network stack, TLS validation, sandbox, renderer internals, downloads,
  history, bookmarks, password manager, cookies, or DevTools behavior.
- Expose private key material, access tokens, or proof internals.

## Source Anchors Inspected

- `docs/echothink-browser-alpha/t22-define-device-identity-and-dpapi-storage.md`,
  the completed M5 device identity design.
- `docs/ungoogled_to_echothink_browser_change_plan.md` section 5.9, which now
  points to the T22 design as the Alpha source of truth.
- `docs/echothink_browser_construction.md` sections 5.6 and 5.7, which define
  the high-level device identity and request-proof architecture.
- `docs/dag-doc.md`, which defines T23's prerequisite and delivery criteria.
- `docs/progress.md`, which marks T22 `DONE` and T23 `READY`.
- `docs/echothink-browser-alpha/t20-define-login-gate-local-state-and-allowlist.md`,
  which supplies the completed login-gate readiness and reset baseline.

## Validation

Run from the inherited repository root.

| Command | Result |
|---|---|
| `rtk rg -n "^\\| T22 \\|[^|]*\\|[^|]*\\|[^|]*\\| DONE \\|" echothink-studio-new/docs/progress.md` | Passed: T22 is marked `DONE` in the status column. |
| `rtk rg -n "Status: DONE|windows_dpapi_current_user_v1|Extension Bridge Boundaries|Explicit local device reset" echothink-studio-new/docs/echothink-browser-alpha/t22-define-device-identity-and-dpapi-storage.md` | Passed: the T22 design exists and records DPAPI, bridge, and reset decisions. |
| `rtk rg -n "### T23: Implement Device Key Generation And Storage|Prerequisites: T22|0007-device-identity.patch" echothink-studio-new/docs/dag-doc.md echothink-studio-new/docs/ungoogled_to_echothink_browser_change_plan.md echothink-studio-new/docs/echothink_browser_construction.md` | Passed: T23 scope and delivery target anchors exist. |
| `rtk ls -l patches/echothink/0007-device-identity.patch` | Failed as expected: T23 has not implemented the patch yet. |
| `rtk rg -n "echothink/0007-device-identity.patch" patches/series` | Failed as expected: the unimplemented patch is not listed in the active patch pipeline. |

## Known Limitations

- T23 delivery criteria remain unmet until
  `patches/echothink/0007-device-identity.patch` is implemented and validated.
- No runtime persistence or reset smoke test was run because no implementation
  patch exists yet.
