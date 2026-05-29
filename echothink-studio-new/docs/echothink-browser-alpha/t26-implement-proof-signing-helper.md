# T26 Implement Proof Signing Helper

Date: 2026-05-29
Wave: W9
Delivery target: M5 - `0008-request-proof-helper.patch`
Status: BLOCKED

## Blocker

T26 depends on T25. T25 is not complete in the shared progress source and does
not provide the request-proof payload and allowlist specification this
implementation patch is required to consume.

Current evidence:

- `docs/progress.md` marks T25 as `BLOCKED`, not `DONE`.
- `docs/echothink-browser-alpha/t25-define-request-proof-payload-and-allowlist.md`
  is a blocker note, not the final M5 proof helper spec.
- The T25 note explicitly says T26 must not use it as authorization to
  implement `patches/echothink/0008-request-proof-helper.patch`.
- T25 did not define canonical payload shape, Echothink-domain signing
  allowlist, third-party rejection behavior, browser-side signing boundaries,
  replay-protection ownership, or proof-validation ownership.

Because the coordination rules require prerequisites to be marked `DONE` or
explicitly documented as acceptable baseline dependencies, T26 cannot create or
activate the proof signing helper patch yet.

## Prerequisite Check

| Prerequisite | Required by | Status | Evidence |
|---|---|---|---|
| T25 - Define request proof payload and allowlist | T26 | BLOCKED | `docs/progress.md` marks T25 `BLOCKED`; the T25 task note says no proof helper spec was authored and explicitly blocks T26 from implementing `0008-request-proof-helper.patch`. |

No progress entry or task note explicitly accepts incomplete T25 as a baseline
dependency for T26.

## Missing Prerequisite Work

Complete T25 before resuming T26. The exact files that need to be updated are:

- `docs/echothink-browser-alpha/t25-define-request-proof-payload-and-allowlist.md`
- `docs/progress.md`

T25 must define the implementation contract T26 needs:

- Canonical request-proof payload fields, ordering, normalization, and required
  versus optional fields.
- Allowed Echothink destinations eligible for signing.
- Rejection behavior for third-party destinations and malformed payloads.
- Browser-side signing-only responsibilities.
- Backend-owned replay protection and proof-validation responsibilities.
- Safe treatment of signature/proof result fields without exposing private key
  material, access tokens, or proof internals.

T25 is also blocked on T24. The upstream prerequisite files and decisions are:

- `docs/echothink-browser-alpha/t24-implement-narrow-extension-bridge.md`
- `docs/progress.md`
- The T24 bridge implementation artifact, including any required
  `patches/echothink/` patch and `patches/series` entry if T24 is delivered as
  a Chromium patch.
- Bridge methods available to the bundled workspace extension.
- Caller restriction to the fixed bundled workspace extension identity.
- Bridge error model for missing device, locked key, unsupported platform, and
  explicit reset.
- Boundary that allows signature requests without exposing private key material
  to extension JavaScript, logs, docs examples, or progress notes.
- How bridge inputs are accepted, normalized, and rejected before they reach the
  signing helper.

The upstream device identity chain still needs completion before T24 can be
complete:

- T23 must implement device key generation and storage, including
  `patches/echothink/0007-device-identity.patch` and its `patches/series` entry.
- T22 is complete and defines device identity, DPAPI storage, reset behavior,
  and private-key bridge boundaries.
- T20 is complete and defines the login-gate local state and allowlist spec.

## T26 Work Not Started

No Chromium implementation patch was created. In particular, this blocked pass
did not:

- Create `patches/echothink/0008-request-proof-helper.patch`.
- Add `echothink/0008-request-proof-helper.patch` to `patches/series`.
- Add a native proof signing helper or bridge-facing signing implementation.
- Sign payloads, accept canonical payloads, or define allowed destinations.
- Change backend services, gateway logic, search ranking, chat orchestration,
  workflow orchestration, or business pages.
- Change network stack, TLS validation, sandbox, renderer internals, downloads,
  history, bookmarks, password manager, cookies, or DevTools behavior.
- Expose private key material, access tokens, signed proof contents, or proof
  internals in JavaScript, logs, docs examples, or progress notes.

## Source Anchors Inspected

- `docs/ungoogled_to_echothink_browser_change_plan.md` section 5.10, which
  sketches request-proof helper scope and requires signing only for allowed
  Echothink domains without weakening Chromium TLS or network behavior.
- `docs/echothink_browser_construction.md` sections 5.6 and 5.7, which define
  the high-level browser-bound device identity and DPoP-style proof architecture.
- `docs/dag-doc.md`, which defines T26's prerequisite and delivery criteria.
- `docs/progress.md`, which marks T25 `BLOCKED`.
- `docs/echothink-browser-alpha/t25-define-request-proof-payload-and-allowlist.md`,
  which blocks T26 until the M5 proof helper spec exists.
- `docs/echothink-browser-alpha/t23-implement-device-key-generation-and-storage.md`,
  which documents that T23 is ready but has not implemented the device-key
  patch required by T24 and T25.

## Validation

Run from the inherited repository root.

| Command | Result |
|---|---|
| `rtk rg -n "^\\| T25 \\|[^|]*\\|[^|]*\\|[^|]*\\| DONE \\|" echothink-studio-new/docs/progress.md` | Exited 1 as expected: T25 is not marked `DONE` in the status column. |
| `rtk rg -n "^\\| T25 \\|[^|]*\\|[^|]*\\|[^|]*\\| BLOCKED \\|" echothink-studio-new/docs/progress.md` | Passed: progress marks T25 `BLOCKED`. |
| `rtk rg -n "Status: BLOCKED|T26 must not use" echothink-studio-new/docs/echothink-browser-alpha/t25-define-request-proof-payload-and-allowlist.md` | Passed: the T25 note is a blocker note and explicitly blocks T26 implementation. |
| `rtk rg -n "^\\| T24 \\|[^|]*\\|[^|]*\\|[^|]*\\| BLOCKED \\|" echothink-studio-new/docs/progress.md` | Passed: T24 is marked `BLOCKED`. |
| `rtk ls -l patches/echothink/0008-request-proof-helper.patch` | Failed as expected: no blocked patch artifact was created. |
| `rtk rg -n "echothink/0008-request-proof-helper.patch" patches/series` | Exited 1 as expected: inactive blocked patch is not listed in the active patch pipeline. |
| `rtk ls -l echothink-studio-new/docs/echothink-browser-alpha/t26-implement-proof-signing-helper.md echothink-studio-new/docs/progress.md` | Passed: the T26 note and shared progress file exist. |
| `rtk git diff --check` | Passed: no whitespace errors. |

## Known Limitations

- This is a blocker record, not the M5 proof signing helper implementation.
- T26 delivery criteria remain unmet until T25 is completed and
  `patches/echothink/0008-request-proof-helper.patch` can be implemented and
  validated.
- No signing helper tests or runtime proof smoke tests were run because no
  implementation patch exists in this blocked pass.
