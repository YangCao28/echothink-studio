# T27 Integrate Proof Helper Into Extension Calls

Date: 2026-05-29
Wave: W10
Delivery target: M5 - proof-capable extension
Status: BLOCKED

## Blocker

T27 depends on T16, T24, and T26. T16 and T24 are now complete, but T26 remains
`BLOCKED` because T25 has not defined the final proof payload and allowlist and
`patches/echothink/0008-request-proof-helper.patch` does not exist.

T27 cannot attach proof headers or metadata to extension API calls until T25 and
T26 define the safe proof shape, allowed destinations, and failure behavior.

## Prerequisite Check

| Prerequisite | Required by | Status | Evidence |
|---|---|---|---|
| T16 - Implement Chat Panel shell | T27 | DONE | `docs/progress.md` marks T16 `DONE`; `extensions/echothink-workspace/sidepanel.js` currently posts chat requests to `https://api.echothink.ai/v1/chat/stream` with `credentials: "include"`. |
| T24 - Implement narrow extension bridge | T27 | DONE | `docs/progress.md` marks T24 `DONE`; `patches/echothink/0024-narrow-extension-bridge.patch` is active. |
| T26 - Implement proof signing helper | T27 | BLOCKED | `docs/progress.md` marks T26 `BLOCKED`; no `patches/echothink/0008-request-proof-helper.patch` exists. |

## Missing Prerequisite Work

Complete T25 and T26 before resuming T27. The remaining artifacts needed are:

- Final T25 proof payload and Echothink-domain allowlist spec.
- `patches/echothink/0008-request-proof-helper.patch`.
- `patches/series`, with `echothink/0008-request-proof-helper.patch` active
  once the helper patch exists.

The prerequisite decisions T27 needs before extension integration can be safe:

- Proof helper result shape that may be attached to Echothink API requests
  without exposing private key material, access tokens, or proof internals.
- Canonical request fields and header or metadata names expected by
  Echothink API/chat services.
- Recoverable signing error model for malformed payload and disallowed
  destination, in addition to T24's device bridge errors.
- Explicit Echothink destination allowlist for proof-capable extension requests.

## T27 Work Not Started

No proof integration was implemented. In particular, this refresh did not
modify chat/API request signing, attach `Authorization` or `DPoP` headers, add
extension permissions, widen host permissions, introduce native messaging or
webRequest, log proof payloads/signatures/tokens, or change Chromium
network/TLS/sandbox/renderer/downloads/history/bookmarks/password/cookie/
DevTools behavior.

## Source Anchors

- `docs/echothink-browser-alpha/t16-implement-chat-panel-shell.md`.
- `docs/echothink-browser-alpha/t24-implement-narrow-extension-bridge.md`.
- `docs/echothink-browser-alpha/t25-define-request-proof-payload-and-allowlist.md`.
- `docs/echothink-browser-alpha/t26-implement-proof-signing-helper.md`.
- `extensions/echothink-workspace/manifest.json`, `sidepanel.js`,
  `background.js`, and `content_bridge.js`.

## Validation

Run from the inherited repository root.

| Command | Result |
|---|---|
| `rtk rg -n "^\\| T16 \\|[^|]*\\|[^|]*\\|[^|]*\\| DONE \\|" echothink-studio-new/docs/progress.md` | Passed: T16 is marked `DONE`. |
| `rtk rg -n "^\\| T24 \\|[^|]*\\|[^|]*\\|[^|]*\\| DONE \\|" echothink-studio-new/docs/progress.md` | Passed: T24 is marked `DONE`. |
| `rtk rg -n "^\\| T26 \\|[^|]*\\|[^|]*\\|[^|]*\\| BLOCKED \\|" echothink-studio-new/docs/progress.md` | Passed: T26 remains `BLOCKED`. |
| `rtk ls -l patches/echothink/0008-request-proof-helper.patch` | Failed as expected: no proof helper patch exists. |
| `rtk rg -n "^echothink/0008-request-proof-helper\\.patch$" patches/series` | Exited 1 as expected: inactive proof-helper patch is not listed in the active patch pipeline. |

## Known Limitations

- This is a blocker refresh, not the M5 proof-capable extension implementation.
- T27 delivery criteria remain unmet until T26 is complete.
