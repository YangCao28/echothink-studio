# T26 Implement Proof Signing Helper

Date: 2026-05-29
Wave: W9
Delivery target: M5 - `0008-request-proof-helper.patch`
Status: READY

## Current State

T26 depends on T25. T25 is now `DONE` and provides the final request-proof
payload and allowlist specification at
`docs/echothink-browser-alpha/t25-define-request-proof-payload-and-allowlist.md`.

T22, T23, T24, and T25 are complete. T26 is ready for implementation, but no
proof signing helper patch exists yet.

## Prerequisite Check

| Prerequisite | Required by | Status | Evidence |
|---|---|---|---|
| T25 - Define request proof payload and allowlist | T26 | DONE | `docs/progress.md` marks T25 `DONE`; the T25 task note defines canonical fields, URL normalization, exact signing allowlist, rejection behavior, safe result shape, and backend replay/proof-validation ownership. |

## Implementation Still Needed

T26 still must create `patches/echothink/0008-request-proof-helper.patch` and
activate it in `patches/series`.

The patch must implement the T25 contract:

- Canonical request-proof payload fields, ordering, normalization, and required
  versus optional fields.
- Exact Echothink HTTPS signing allowlist.
- Rejection behavior for malformed payloads and disallowed destinations before
  signing.
- Browser-side signing-only responsibilities.
- Safe opaque proof result fields for T27.
- Preservation of backend-owned replay protection and proof validation.

## T26 Work Not Started

No Chromium implementation patch has been created. In particular, this task
note does not create `patches/echothink/0008-request-proof-helper.patch`, add it
to `patches/series`, attach proof headers, alter Chromium network/TLS behavior,
or expose private key material, access tokens, signed proof contents, or proof
internals.

## Source Anchors

- `docs/ungoogled_to_echothink_browser_change_plan.md` section 5.10.
- `docs/echothink_browser_construction.md` sections 5.6 and 5.7.
- `docs/echothink-browser-alpha/t24-implement-narrow-extension-bridge.md`.
- `docs/echothink-browser-alpha/t25-define-request-proof-payload-and-allowlist.md`.
- `patches/echothink/0007-device-identity.patch`.
- `patches/echothink/0024-narrow-extension-bridge.patch`.

## Validation

Run from the inherited repository root.

| Command | Result |
|---|---|
| `rtk rg -n "^\\| T25 \\|[^|]*\\|[^|]*\\|[^|]*\\| DONE \\|" echothink-studio-new/docs/progress.md` | Passed: progress marks T25 `DONE`. |
| `rtk rg -n "^\\| T24 \\|[^|]*\\|[^|]*\\|[^|]*\\| DONE \\|" echothink-studio-new/docs/progress.md` | Passed: T24 is now complete. |
| `rtk rg -n "method|url|timestamp|nonce|access_token_hash|disallowed_destination|Backend-Owned Validation" echothink-studio-new/docs/echothink-browser-alpha/t25-define-request-proof-payload-and-allowlist.md` | Passed: T25 has the required implementation contract. |
| `rtk ls -l patches/echothink/0008-request-proof-helper.patch` | Failed as expected: no proof-helper patch exists. |
| `rtk rg -n "^echothink/0008-request-proof-helper\\.patch$" patches/series` | Exited 1 as expected: inactive proof-helper patch is not listed in the active patch pipeline. |

## Known Limitations

- This is a ready-state handoff, not the M5 proof signing helper
  implementation.
- T26 delivery criteria remain unmet until
  `patches/echothink/0008-request-proof-helper.patch` is implemented,
  activated in `patches/series`, and validated.
