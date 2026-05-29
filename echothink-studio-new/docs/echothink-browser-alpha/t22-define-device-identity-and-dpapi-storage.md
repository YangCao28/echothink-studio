# T22 Define Device Identity And DPAPI Storage

Date: 2026-05-29
Wave: W5
Delivery target: M5 - device identity design
Status: READY

## Current State

T22 depends on T00 and T20. Both prerequisites are now marked `DONE` in
`docs/progress.md`. The T20 login-gate spec supplies the auth/device readiness
and reset contract that T22 must align with.

This note is not the M5 device identity design. No final T22 design was
authored in this T20 pass, and T23 remains blocked until T22 is completed.

## Prerequisite Check

| Prerequisite | Required by | Status | Evidence |
|---|---|---|---|
| T00 - Baseline repo audit | T22 | DONE | `docs/progress.md` marks T00 `DONE`; task note exists at `docs/echothink-browser-alpha/t00-baseline-repo-audit.md`. |
| T20 - Define login gate local state and allowlist | T22 | DONE | `docs/progress.md` marks T20 `DONE`; the T20 task note defines local auth/device readiness prefs, allowlist, blocked-navigation behavior, setup completion, diagnostics/support exceptions, and reset/logout semantics. |

No remaining prerequisite blocker is recorded for T22. The next T22 pass may
define the device identity and Windows DPAPI storage design.

## T20 Contract T22 Must Honor

The T22 device identity design must align with these T20 decisions:

- `echothink.device.enrolled` and `echothink.device.verified` are non-secret
  normal-profile readiness preferences used by the login gate.
- `echothink.setup.complete` is true only when the auth session is ready and
  device enrollment plus verification are both ready.
- Sign-out clears auth readiness and setup completion but does not destroy the
  local device identity by default.
- Explicit local reset clears auth readiness, setup completion, device
  enrollment, device verification, and non-secret enrollment metadata owned by
  the device identity design.
- Private keys, access tokens, and signed proof internals must stay out of
  preferences, extension JavaScript, docs examples, and progress notes.

## T22 Work Not Started

The next T22 pass still needs to define:

- Local device identity fields and meanings.
- Windows DPAPI private-key storage format and scope.
- Profile preference versus Local State placement for non-secret metadata.
- Persistence behavior across browser restart.
- Explicit reset behavior for local enrollment state.
- Native bridge boundary that keeps private key material out of extension
  JavaScript, logs, docs examples, and progress notes.

No Chromium patch, extension code, backend service, gateway logic, network
stack, TLS validation, sandbox, renderer internals, downloads, history,
bookmarks, password manager, cookies, DevTools behavior, key material, token, or
proof internals were changed or exposed.

## Source Anchors Inspected

- `docs/ungoogled_to_echothink_browser_change_plan.md` section 5.9, which
  sketches device identity, DPAPI, metadata, reset, and private-key boundaries.
- `docs/echothink_browser_construction.md` sections 5.6 and 5.7, which define
  the high-level device identity and request-proof architecture.
- `docs/dag-doc.md`, which defines T22 prerequisites and delivery criteria.
- `docs/progress.md`, which marks T00 and T20 `DONE` and T22 `READY`.
- `docs/echothink-browser-alpha/t20-define-login-gate-local-state-and-allowlist.md`,
  which supplies the login-gate readiness and reset contract.

## Validation

Run from the inherited repository root.

| Command | Result |
|---|---|
| `rtk rg -n "^\\| T00 \\|[^|]*\\|[^|]*\\|[^|]*\\| DONE \\|" echothink-studio-new/docs/progress.md` | Passed: T00 is marked `DONE` in the status column. |
| `rtk rg -n "^\\| T20 \\|[^|]*\\|[^|]*\\|[^|]*\\| DONE \\|" echothink-studio-new/docs/progress.md` | Passed: T20 is marked `DONE` in the status column. |
| `rtk rg -n "echothink.device.enrolled|echothink.device.verified|Setup Completion And Unlock|Reset And Logout Semantics" echothink-studio-new/docs/echothink-browser-alpha/t20-define-login-gate-local-state-and-allowlist.md` | Passed: T20 defines the readiness/reset anchors T22 must consume. |
| `rtk ls -l echothink-studio-new/docs/echothink-browser-alpha/t22-define-device-identity-and-dpapi-storage.md echothink-studio-new/docs/progress.md` | Passed: the T22 note and shared progress file exist. |

## Known Limitations

- This note records that the prerequisite blocker was resolved by T20; it is
  not the device identity design.
- T23 must not use this document as authorization to implement
  `patches/echothink/0007-device-identity.patch`.
- T22 delivery criteria remain unmet until the device identity and DPAPI design
  is authored and marked `DONE`.
