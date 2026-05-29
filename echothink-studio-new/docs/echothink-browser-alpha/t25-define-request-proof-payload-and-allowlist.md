# T25 Define Request Proof Payload And Allowlist

Date: 2026-05-29
Wave: W8
Delivery target: M5 - proof helper spec
Status: BLOCKED

## Blocker

T25 depends on T24. T24 is not marked `DONE` in the shared progress source and
no T24 task note exists in `docs/echothink-browser-alpha/`.

Current evidence:

- `docs/progress.md` has no T24 status row.
- No `docs/echothink-browser-alpha/t24-implement-narrow-extension-bridge.md`
  task note exists.
- T23, the upstream prerequisite for T24, is marked `BLOCKED`.
- T23 is blocked because T22 is marked `BLOCKED`, and T22 is blocked on the
  incomplete T20 login-gate spec.

Because the coordination rules require prerequisites to be marked `DONE` or
explicitly documented as acceptable baseline dependencies, T25 cannot define the
authoritative request-proof payload shape, signing allowlist, or rejection
behavior yet.

## Prerequisite Check

| Prerequisite | Required by | Status | Evidence |
|---|---|---|---|
| T24 - Implement narrow extension bridge | T25 | MISSING | `docs/progress.md` has no T24 row, no T24 task note exists, and no completed bridge API evidence is available. |

No progress entry or task note explicitly accepts incomplete T24 as a baseline
dependency for T25.

## Missing Prerequisite Work

Complete T24 before resuming T25. The exact files that need to be updated or
created are:

- `docs/echothink-browser-alpha/t24-implement-narrow-extension-bridge.md`
- `docs/progress.md`
- The T24 bridge implementation artifact, including any required
  `patches/echothink/` patch and `patches/series` entry if T24 is delivered as
  a Chromium patch.

The T24 evidence must confirm these decisions before T25 can safely define the
proof helper contract:

- The bridge methods available to the bundled workspace extension.
- The caller restriction to the fixed bundled workspace extension identity.
- The bridge error model for missing device, locked key, unsupported platform,
  and explicit reset.
- The boundary that allows signature requests without exposing private key
  material to extension JavaScript, logs, docs examples, or progress notes.
- How bridge request inputs are accepted, normalized, and rejected before they
  reach the signing helper.

The dependency chain also requires unblocking T23, T22, and T20:

- `docs/echothink-browser-alpha/t23-implement-device-key-generation-and-storage.md`
- `docs/echothink-browser-alpha/t22-define-device-identity-and-dpapi-storage.md`
- `docs/echothink-browser-alpha/t20-define-login-gate-local-state-and-allowlist.md`
- `docs/progress.md`
- `patches/echothink/0007-device-identity.patch` and its `patches/series`
  entry once T23 can be implemented.

## T25 Work Not Started

No proof helper spec was authored in this blocked pass. In particular, this task
does not yet define:

- Canonical request-proof payload field ordering, normalization, or required
  versus optional fields.
- Echothink-domain signing allowlist.
- Rejection behavior for third-party destinations.
- Browser-side signing-only responsibilities.
- Backend-owned replay protection and proof-validation responsibilities.

No Chromium patch, extension code, backend service, gateway logic, network
stack, TLS validation, sandbox, renderer internals, downloads, history,
bookmarks, password manager, cookies, or DevTools behavior was changed. No
private key material, access token, signed proof, or proof internals were
exposed.

## Source Anchors Inspected

- `docs/ungoogled_to_echothink_browser_change_plan.md` section 5.10, which
  sketches request-proof helper scope and the intended browser-side signing
  boundary.
- `docs/echothink_browser_construction.md` section 5.7, which defines the
  high-level DPoP-style proof-of-possession architecture.
- `docs/dag-doc.md`, which defines T24 and T25 prerequisites and delivery
  criteria.
- `docs/progress.md`, which lacks a T24 row and marks T23 `BLOCKED`.
- `docs/echothink-browser-alpha/t23-implement-device-key-generation-and-storage.md`,
  which blocks T24's upstream dependency chain.

## Validation

Run from the inherited repository root.

| Command | Result |
|---|---|
| `rtk rg -n "^\\| T24 \\|[^|]*\\|[^|]*\\|[^|]*\\| DONE \\|" echothink-studio-new/docs/progress.md` | Exited 1 as expected: T24 is not marked `DONE` in the status column. |
| `rtk ls -l echothink-studio-new/docs/echothink-browser-alpha/t24-implement-narrow-extension-bridge.md` | Failed as expected: no T24 task note exists. |
| `rtk rg -n "^\\| T23 \\|[^|]*\\|[^|]*\\|[^|]*\\| BLOCKED \\|" echothink-studio-new/docs/progress.md` | Passed: upstream T23 is blocked. |
| `rtk rg -n "### T24: Implement Narrow Extension Bridge|### T25: Define Request Proof Payload And Allowlist|Prerequisites: T24" echothink-studio-new/docs/dag-doc.md` | Passed: DAG anchors for T24 and T25 exist. |
| `rtk ls -l echothink-studio-new/docs/echothink-browser-alpha/t25-define-request-proof-payload-and-allowlist.md echothink-studio-new/docs/progress.md` | Passed: the T25 note and shared progress file exist. |
| `rtk git diff --check` | Passed: no whitespace errors. |

## Known Limitations

- This note records a prerequisite blocker only; it is not the M5 proof helper
  spec.
- T26 must not use this document as authorization to implement
  `patches/echothink/0008-request-proof-helper.patch`.
- The broader browser Alpha docs were left unchanged because no T25 design
  decisions are complete yet.
