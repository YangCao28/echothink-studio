# T25 Define Request Proof Payload And Allowlist

Date: 2026-05-29
Wave: W8
Delivery target: M5 - proof helper spec
Status: READY

## Current State

T25 depends on T24. T24 is now `DONE` and provides the narrow bundled-extension
bridge in active patch `patches/echothink/0024-narrow-extension-bridge.patch`.

T25 is ready to define the final request-proof payload and allowlist. This note
is a readiness refresh only; it does not author the proof helper spec.

## Prerequisite Check

| Prerequisite | Required by | Status | Evidence |
|---|---|---|---|
| T24 - Implement narrow extension bridge | T25 | DONE | `docs/progress.md` marks T24 `DONE`; `patches/echothink/0024-narrow-extension-bridge.patch` exists and is active in `patches/series`. |

## T25 Work Not Started

No final proof helper spec was authored in this refresh. T25 still must define:

- Canonical request-proof payload fields, ordering, and normalization.
- Required versus optional fields.
- Echothink-domain signing allowlist.
- Rejection behavior for malformed and third-party destinations.
- Browser-side signing-only responsibilities.
- Backend-owned replay protection and proof-validation responsibilities.
- Safe proof result shape that T26/T27 may consume without exposing private key
  material, access tokens, or proof internals.

T26 must not implement `patches/echothink/0008-request-proof-helper.patch` until
T25 is completed.

## Source Anchors

- `docs/ungoogled_to_echothink_browser_change_plan.md` sections 5.9 and 5.10.
- `docs/echothink_browser_construction.md` sections 5.6 and 5.7.
- `docs/echothink-browser-alpha/t24-implement-narrow-extension-bridge.md`.
- `patches/echothink/0024-narrow-extension-bridge.patch`.

## Validation

Run from the inherited repository root.

| Command | Result |
|---|---|
| `rtk rg -n "^\\| T24 \\|[^|]*\\|[^|]*\\|[^|]*\\| DONE \\|" echothink-studio-new/docs/progress.md` | Passed: T24 is marked `DONE`. |
| `rtk rg -n "^echothink/0024-narrow-extension-bridge\\.patch$" patches/series` | Passed: T24 bridge patch is active. |
| `rtk ls -l patches/echothink/0024-narrow-extension-bridge.patch` | Passed: T24 bridge patch exists. |

## Known Limitations

- This is a readiness handoff, not the M5 proof helper spec.
- T26 and T27 remain blocked until T25 and then T26 are completed.
