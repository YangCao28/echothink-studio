# T26 Implement Proof Signing Helper

Date: 2026-05-29
Wave: W9
Delivery target: M5 - `0008-request-proof-helper.patch`
Status: BLOCKED

## Blocker

T26 depends on T25. T25 is now `READY` because T24 is complete, but T25 is not
`DONE` and still does not provide the final request-proof payload and allowlist
specification this implementation patch must consume.

T22, T23, and T24 are complete. The remaining blocker is the missing T25 proof
contract.

## Prerequisite Check

| Prerequisite | Required by | Status | Evidence |
|---|---|---|---|
| T25 - Define request proof payload and allowlist | T26 | READY | `docs/progress.md` marks T25 `READY`; no final proof helper spec has been authored. |

No progress entry or task note accepts incomplete T25 as a baseline dependency
for T26.

## Missing Prerequisite Work

Complete T25 before resuming T26. T25 must define:

- Canonical request-proof payload fields, ordering, normalization, and required
  versus optional fields.
- Allowed Echothink destinations eligible for signing.
- Rejection behavior for third-party destinations and malformed payloads.
- Browser-side signing-only responsibilities.
- Backend-owned replay protection and proof-validation responsibilities.
- Safe signature/proof result fields without exposing private key material,
  access tokens, or proof internals.

## T26 Work Not Started

No Chromium implementation patch was created. In particular, this blocked pass
did not create `patches/echothink/0008-request-proof-helper.patch`, add it to
`patches/series`, attach proof headers, alter Chromium network/TLS behavior, or
expose private key material, access tokens, signed proof contents, or proof
internals.

## Source Anchors

- `docs/ungoogled_to_echothink_browser_change_plan.md` section 5.10.
- `docs/echothink_browser_construction.md` sections 5.6 and 5.7.
- `docs/echothink-browser-alpha/t24-implement-narrow-extension-bridge.md`.
- `docs/echothink-browser-alpha/t25-define-request-proof-payload-and-allowlist.md`.

## Validation

Run from the inherited repository root.

| Command | Result |
|---|---|
| `rtk rg -n "^\\| T25 \\|[^|]*\\|[^|]*\\|[^|]*\\| READY \\|" echothink-studio-new/docs/progress.md` | Passed: progress marks T25 `READY`. |
| `rtk rg -n "^\\| T24 \\|[^|]*\\|[^|]*\\|[^|]*\\| DONE \\|" echothink-studio-new/docs/progress.md` | Passed: T24 is now complete. |
| `rtk ls -l patches/echothink/0008-request-proof-helper.patch` | Failed as expected: no proof-helper patch exists. |
| `rtk rg -n "^echothink/0008-request-proof-helper\\.patch$" patches/series` | Exited 1 as expected: inactive proof-helper patch is not listed in the active patch pipeline. |

## Known Limitations

- This is a blocker record, not the M5 proof signing helper implementation.
- T26 delivery criteria remain unmet until T25 is completed and
  `patches/echothink/0008-request-proof-helper.patch` can be implemented and
  validated.
