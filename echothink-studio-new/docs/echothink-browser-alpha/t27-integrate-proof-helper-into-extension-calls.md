# T27 Integrate Proof Helper Into Extension Calls

Date: 2026-05-29
Wave: W10
Delivery target: M5 - proof-capable extension
Status: BLOCKED

## Blocker

T27 depends on T16, T24, and T26. T16 is complete, but the proof-capable
extension integration cannot start because the extension bridge and proof helper
prerequisites are not complete in the shared progress source.

Current evidence:

- `docs/progress.md` marks T16 as `DONE`.
- `docs/progress.md` has no T24 status row.
- No `docs/echothink-browser-alpha/t24-implement-narrow-extension-bridge.md`
  task note exists.
- `docs/progress.md` marks T26 as `BLOCKED`.
- `docs/echothink-browser-alpha/t26-implement-proof-signing-helper.md` confirms
  no `patches/echothink/0008-request-proof-helper.patch` was created or added
  to `patches/series`.

Because the coordination rules require prerequisites to be marked `DONE` or
explicitly documented as acceptable baseline dependencies, T27 cannot update
the bundled extension to request signatures or attach proof headers yet.

## Prerequisite Check

| Prerequisite | Required by | Status | Evidence |
|---|---|---|---|
| T16 - Implement Chat Panel shell | T27 | DONE | `docs/progress.md` marks T16 `DONE`; `extensions/echothink-workspace/sidepanel.js` currently posts chat requests to `https://api.echothink.ai/v1/chat/stream` with `credentials: "include"`. |
| T24 - Implement narrow extension bridge | T27 | MISSING | `docs/progress.md` has no T24 row and no `docs/echothink-browser-alpha/t24-implement-narrow-extension-bridge.md` task note exists. |
| T26 - Implement proof signing helper | T27 | BLOCKED | `docs/progress.md` marks T26 `BLOCKED`; no `patches/echothink/0008-request-proof-helper.patch` exists. |

No progress entry or task note explicitly accepts incomplete T24 or T26 as a
baseline dependency for T27.

## Missing Prerequisite Work

Complete T24 and T26 before resuming T27. The exact missing files or artifacts
needed are:

- `docs/echothink-browser-alpha/t24-implement-narrow-extension-bridge.md`
- `docs/progress.md`, with T24 marked `DONE`
- The T24 bridge implementation artifact, including any required
  `patches/echothink/` patch and `patches/series` entry if delivered as a
  Chromium patch
- `docs/echothink-browser-alpha/t25-define-request-proof-payload-and-allowlist.md`,
  updated from blocker note to completed proof helper spec
- `docs/echothink-browser-alpha/t26-implement-proof-signing-helper.md`,
  updated from blocker note to completed implementation note
- `patches/echothink/0008-request-proof-helper.patch`
- `patches/series`, with `echothink/0008-request-proof-helper.patch` active
  once the helper patch exists

The prerequisite decisions T27 needs before extension integration can be safe:

- The exact bridge method name and call shape exposed to the bundled workspace
  extension for signing requests.
- The caller restriction confirming only fixed extension ID
  `lokdibgfmiemhdoogailbfpdggndpolk` can request device status or signatures.
- The proof helper result shape that may be attached to Echothink API requests
  without exposing private key material, access tokens, or proof internals.
- The canonical request fields and header or metadata names expected by
  Echothink API/chat services.
- The recoverable signing error model for missing device identity, locked key,
  unsupported platform, malformed payload, reset enrollment, and disallowed
  destination.
- The explicit Echothink destination allowlist for proof-capable extension
  requests.

## T27 Work Not Started

No extension integration was implemented. In particular, this blocked pass did
not:

- Modify `extensions/echothink-workspace/sidepanel.js`.
- Modify `extensions/echothink-workspace/background.js`.
- Modify `extensions/echothink-workspace/content_bridge.js`.
- Modify `extensions/echothink-workspace/manifest.json`.
- Add host permissions, broad extension permissions, privileged JavaScript
  bridges, native messaging, `webRequest`, cookies, history, bookmarks,
  downloads, or DevTools permissions.
- Attach `Authorization`, `DPoP`, device proof, or custom proof headers to chat
  requests.
- Log proof payloads, proof signatures, access tokens, private key material, or
  proof internals.
- Change backend services, gateway logic, search ranking, chat orchestration,
  workflow orchestration, business pages, Chromium network stack, TLS
  validation, sandbox, renderer internals, downloads, history, bookmarks,
  password manager, cookies, or DevTools behavior.

## Source Anchors Inspected

- `docs/ungoogled_to_echothink_browser_change_plan.md` sections 5.9 and 5.10,
  which define the intended device bridge and request-proof helper boundaries.
- `docs/echothink_browser_construction.md` section 5.7, which describes the
  high-level proof-of-possession headers while leaving security to backend
  signature verification.
- `docs/dag-doc.md`, which defines T27's prerequisites and delivery criteria.
- `docs/progress.md`, which marks T16 `DONE`, marks T26 `BLOCKED`, and has no
  T24 row.
- `docs/echothink-browser-alpha/t16-implement-chat-panel-shell.md`, which
  records the current chat request path and explicitly defers proof integration.
- `docs/echothink-browser-alpha/t25-define-request-proof-payload-and-allowlist.md`,
  which is a blocker note rather than a completed proof helper spec.
- `docs/echothink-browser-alpha/t26-implement-proof-signing-helper.md`, which is
  a blocker note and confirms the proof helper patch was not created.
- `extensions/echothink-workspace/manifest.json`, `sidepanel.js`,
  `background.js`, and `content_bridge.js`, which are the extension files T27
  would modify once the bridge and helper contract exists.

## Validation

Run from the inherited browser repository root.

| Command | Result |
|---|---|
| `rtk rg -n "^\\| T16 \\|[^|]*\\|[^|]*\\|[^|]*\\| DONE \\|" echothink-studio-new/docs/progress.md` | Passed: T16 is marked `DONE`. |
| `rtk rg -n "^\\| T24 \\|[^|]*\\|[^|]*\\|[^|]*\\| DONE \\|" echothink-studio-new/docs/progress.md` | Exited 1 as expected: T24 is not marked `DONE`. |
| `rtk ls -l echothink-studio-new/docs/echothink-browser-alpha/t24-implement-narrow-extension-bridge.md` | Failed as expected: no T24 task note exists. |
| `rtk rg -n "^\\| T26 \\|[^|]*\\|[^|]*\\|[^|]*\\| BLOCKED \\|" echothink-studio-new/docs/progress.md` | Passed: T26 is marked `BLOCKED`. |
| `rtk ls -l patches/echothink/0008-request-proof-helper.patch` | Failed as expected: no proof helper patch exists. |
| `rtk rg -n "echothink/0008-request-proof-helper.patch" patches/series` | Exited 1 as expected: inactive blocked patch is not listed in the active patch pipeline. |
| `rtk python3 -m json.tool extensions/echothink-workspace/manifest.json` | Passed: manifest JSON parses. |
| Node manifest shape check | Passed: MV3, `side_panel.default_path`, exact narrow permissions, exact Echothink host permissions, no `update_url`, and no broad or forbidden permissions. |
| `rtk node --check extensions/echothink-workspace/background.js` | Passed. |
| `rtk node --check extensions/echothink-workspace/content_bridge.js` | Passed. |
| `rtk node --check extensions/echothink-workspace/sidepanel.js` | Passed. |
| `rtk rg -n -e Authorization -e Bearer -e access_token -e refresh_token -e privateKey -e private_key -e DPoP -e signed_request_proof extensions/echothink-workspace` | Exited 1 as expected: extension source contains no token, private-key, authorization-header, DPoP, or signed-proof handling. |
| `rtk ls -l echothink-studio-new/docs/echothink-browser-alpha/t27-integrate-proof-helper-into-extension-calls.md echothink-studio-new/docs/progress.md` | Passed: the T27 note and shared progress file exist. |
| `rtk git diff --check` | Passed: no whitespace errors. |

## Known Limitations

- This is a blocker record, not the M5 proof-capable extension implementation.
- T27 delivery criteria remain unmet until T24 and T26 are complete.
- No runtime Side Panel signing-error smoke test was run because no extension
  bridge or proof signing helper exists in this blocked pass.
- Broader browser Alpha docs were left unchanged because no T27 integration
  design or implementation decisions are complete yet.
