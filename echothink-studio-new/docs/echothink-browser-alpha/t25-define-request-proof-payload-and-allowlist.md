# T25 Define Request Proof Payload And Allowlist

Date: 2026-05-29
Wave: W8
Delivery target: M5 - proof helper spec
Status: BLOCKED

## Blocker

T25 depends on T24. T24 is not marked `DONE` in the shared progress source, and
no bridge implementation exists for T25 to specify proof payload handoff,
caller validation, or signing failure behavior against.

Current evidence:

- `docs/progress.md` marks T24 as `BLOCKED`, not `DONE`.
- `docs/echothink-browser-alpha/t24-implement-narrow-extension-bridge.md`
  exists, but it records a prerequisite blocker rather than a bridge
  implementation.
- T24 remains blocked because T23 is not `DONE` and no
  `patches/echothink/0007-device-identity.patch` exists.
- T22 is now `DONE` and supplies the device identity, DPAPI storage, reset, and
  private-key bridge-boundary design. T23 is `READY` but not implemented.

Because the coordination rules require prerequisites to be marked `DONE` or
explicitly documented as acceptable baseline dependencies, T25 cannot define the
authoritative request-proof payload shape, signing allowlist, or rejection
behavior yet.

## Prerequisite Check

| Prerequisite | Required by | Status | Evidence |
|---|---|---|---|
| T24 - Implement narrow extension bridge | T25 | BLOCKED | `docs/progress.md` marks T24 `BLOCKED`; the T24 task note says no bridge API or device-key implementation exists. |

No progress entry or task note explicitly accepts incomplete T24 as a baseline
dependency for T25.

## Missing Prerequisite Work

Complete T24 before resuming T25. The T24 evidence must confirm:

- Bridge methods available to the bundled workspace extension.
- Caller restriction to the fixed bundled workspace extension identity.
- Bridge error model for missing device, locked key, unsupported platform, and
  explicit reset.
- Boundary that allows signature requests without exposing private key material
  to extension JavaScript, logs, docs examples, or progress notes.
- How bridge request inputs are accepted, normalized, and rejected before they
  reach the signing helper.

The upstream device chain now has its design but still needs implementation:

- T22 is complete at
  `docs/echothink-browser-alpha/t22-define-device-identity-and-dpapi-storage.md`.
- T23 must create `patches/echothink/0007-device-identity.patch` and add its
  `patches/series` entry before T24 can complete.

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
- `docs/progress.md`, which marks T24 `BLOCKED`, T23 `READY`, and T22 `DONE`.
- `docs/echothink-browser-alpha/t24-implement-narrow-extension-bridge.md`,
  which blocks T25 until the bridge exists.
- `docs/echothink-browser-alpha/t22-define-device-identity-and-dpapi-storage.md`,
  which supplies the completed upstream private-key boundary design.

## Validation

Run from the inherited repository root.

| Command | Result |
|---|---|
| `rtk rg -n "^\\| T24 \\|[^|]*\\|[^|]*\\|[^|]*\\| DONE \\|" echothink-studio-new/docs/progress.md` | Exited 1 as expected: T24 is not marked `DONE` in the status column. |
| `rtk rg -n "^\\| T24 \\|[^|]*\\|[^|]*\\|[^|]*\\| BLOCKED \\|" echothink-studio-new/docs/progress.md` | Passed: T24 is marked `BLOCKED`. |
| `rtk rg -n "^\\| T23 \\|[^|]*\\|[^|]*\\|[^|]*\\| READY \\|" echothink-studio-new/docs/progress.md` | Passed: T23 is ready but not implemented. |
| `rtk ls -l echothink-studio-new/docs/echothink-browser-alpha/t24-implement-narrow-extension-bridge.md` | Passed: the T24 blocker note exists. |
| `rtk rg -n "### T24: Implement Narrow Extension Bridge|### T25: Define Request Proof Payload And Allowlist|Prerequisites: T24" echothink-studio-new/docs/dag-doc.md` | Passed: DAG anchors for T24 and T25 exist. |

## Known Limitations

- This note records a prerequisite blocker only; it is not the M5 proof helper
  spec.
- T26 must not use this document as authorization to implement
  `patches/echothink/0008-request-proof-helper.patch`.
- The broader browser Alpha proof-helper docs remain unchanged because no T25
  design decisions are complete yet.
