# T27 Integrate Proof Helper Into Extension Calls

Date: 2026-05-29
Wave: W10
Delivery target: M5 - proof-capable extension
Status: DONE

## Current State

T27 is implemented. The bundled Side Panel now requests a browser-signed device
proof through the T24 bridge / T26 helper and attaches it to its protected
Echothink chat API call. Active patch
`patches/echothink/0019-proof-capable-extension-calls.patch` is listed in
`patches/series` immediately after `echothink/0008-request-proof-helper.patch`.

## Prerequisite Check

| Prerequisite | Required by | Status | Evidence |
|---|---|---|---|
| T16 - Implement Chat Panel shell | T27 | DONE | `docs/progress.md` marks T16 `DONE`; `sidepanel.js` posts chat requests to `https://api.echothink.ai/v1/chat/stream` with `credentials: "include"`. |
| T24 - Implement narrow extension bridge | T27 | DONE | `patches/echothink/0024-narrow-extension-bridge.patch` is active; `background.js` relays `echothink.device.bridge` messages to `chrome.echothinkDevice.{getDeviceStatus,signProofPayload,...}`. |
| T26 - Implement proof signing helper | T27 | DONE | `patches/echothink/0008-request-proof-helper.patch` is active and returns the safe opaque `{ok, proof_type:"echothink-request-proof-v1", proof, key_id, key_algorithm, timestamp}` result. |

## What T27 Implements

T27 wires the existing native signing helper into the bundled extension's
protected chat call. The extension only *describes* the request and *attaches*
the opaque proof; the private key, canonicalization, allowlist enforcement, and
signing stay in native browser code (T23/T24/T26).

### Patch

- `patches/echothink/0019-proof-capable-extension-calls.patch`, ordered in
  `patches/series` immediately after `echothink/0008-request-proof-helper.patch`
  because it consumes the helper's result shape. It edits only the bundled
  extension resource file
  `chrome/browser/resources/echothink_workspace/sidepanel.js` (added by
  `echothink/0004` and previously edited by `echothink/0016`/`0018`).

### Source file

- `extensions/echothink-workspace/sidepanel.js` is updated in lockstep with the
  patch (same hunks), keeping the source extension and the Chromium resource
  copy in sync.

### Behavior

1. Before the chat `fetch`, `buildProofHeaders("POST", CHAT_STREAM_ENDPOINT)`
   runs.
2. `isProofSigningAllowed()` re-checks the destination against the T25/T26
   signing allowlist (`api.echothink.ai/v1/`, `auth.echothink.ai/browser/`,
   `auth.echothink.ai/device/`, `app.echothink.ai/api/`). A non-allowlisted
   destination gets no proof; the extension never asks the bridge to sign it.
3. For an allowlisted destination the panel sends an
   `echothink.device.bridge` runtime message to the background service worker,
   which calls `chrome.echothinkDevice.signProofPayload({ method, url,
   timestamp })`. `timestamp` is `new Date().toISOString()` (RFC3339 UTC `Z`).
4. On `{ ok: true, proof_type: "echothink-request-proof-v1", proof }` the panel
   attaches the DPoP-style header contract from
   `docs/echothink_browser_construction.md` section 5.7:
   - `DPoP: <opaque proof>`
   - `X-Echothink-Device-ID: <device_id>` from `getDeviceStatus` (cached;
     omitted if unavailable)
   The chat call keeps `credentials: "include"`; no `Authorization` header is
   added because Alpha chat is cookie-authenticated and raw access tokens never
   enter extension state.

### Signing-failure handling (recoverable UI)

Signing failures are mapped to existing recoverable Side Panel local states and
the unproven request is **not** sent:

| Helper / bridge error | Side Panel local state |
|---|---|
| `missing_device`, `locked_key`, `reset`, `unauthorized_extension` | `no_device_identity` |
| `invalid_payload`, `disallowed_destination`, `bridge_error` | `remote_service_error` |

`no_device_identity` shows the Enroll device / Sign in / Support actions;
`remote_service_error` shows Retry / Support. Both are recoverable. The
assistant bubble and chat status surface the local-state copy.

If the bundled bridge is entirely absent (`unsupported_platform` - e.g. a
non-proof-capable build or unpacked dev load), the chat request falls back to
the existing cookie-authenticated call unchanged instead of blocking chat.

## Secret Hygiene

- No private key, DPAPI blob, raw access token, canonical payload bytes, or bare
  signature ever enters extension JavaScript. The helper returns only the opaque
  `proof`, `key_id`, `key_algorithm`, and `timestamp`.
- The opaque `proof` and `device_id` are placed only on outbound request headers
  for allowlisted destinations and are never written to `console`,
  `chrome.storage`, web storage, or any persisted state.
- `cachedDeviceId` holds only the non-secret public device identifier returned
  by `getDeviceStatus`, used solely for the `X-Echothink-Device-ID` header.

## Out Of Scope / Preserved

- No manifest permission, host-permission, `webRequest`, native-messaging, or
  privileged-bridge changes. The narrow `chrome.echothinkDevice` bridge from T24
  is reused as-is.
- No backend service, gateway authorization, replay protection, proof
  validation, chat orchestration, or business logic was added. Replay/proof
  validation remain backend/gateway responsibilities (T25).
- No Chromium network stack, TLS validation, sandbox, renderer internals,
  downloads, history, bookmarks, password manager, cookies, or DevTools behavior
  changed.

## Source Anchors

- `docs/echothink-browser-alpha/t16-implement-chat-panel-shell.md`.
- `docs/echothink-browser-alpha/t24-implement-narrow-extension-bridge.md`.
- `docs/echothink-browser-alpha/t25-define-request-proof-payload-and-allowlist.md`.
- `docs/echothink-browser-alpha/t26-implement-proof-signing-helper.md`.
- `docs/echothink_browser_construction.md` section 5.7 (DPoP-style headers).
- `extensions/echothink-workspace/sidepanel.js`, `background.js`.

## Validation

Run from the inherited repository root.

| Command | Result |
|---|---|
| `node --check extensions/echothink-workspace/sidepanel.js` | Passed: source syntax valid. |
| `git apply --numstat patches/echothink/0019-proof-capable-extension-calls.patch` | Passed: `136 0 chrome/browser/resources/echothink_workspace/sidepanel.js`. |
| `patch -p1` against a reconstructed resources base (committed `sidepanel.js`) | Passed: applied with no fuzz; the applied resource file byte-matches the edited source, and `node --check` on the applied file passes. |
| `python3 devutils/check_patch_files.py` | Passed, exit 0. |
| `python3 devutils/check_gn_flags.py` | Passed, exit 0. |
| `python3 devutils/validate_config.py` | Passed, exit 0. |
| Trailing-whitespace scan of added patch lines | Passed: none. |
| Manifest diff | Passed: `manifest.json` unchanged; no new permissions/host permissions/`webRequest`/native messaging. |
| Secret/auth scan of `extensions/echothink-workspace` for `private_key`/`access_token`/`Bearer`/`Authorization`/PEM | Passed: none present (no raw key/token/Authorization handling). |
| Decision-table logic mirror (23 cases: allowlist gate; valid proof attaches; device errors abort with recoverable state; `unsupported_platform` falls back; error→state mapping) | Passed: 23/23. |

## Known Limitations

- No local pinned Chromium source checkout or Windows build exists here (per
  T03), so application was validated via `patch -p1` against a reconstructed
  resources base and via a faithful logic mirror, not a real browser build.
  Runtime proof-attachment smoke (real device key + live chat endpoint) is
  deferred to T33/T34/T35.
- Only the chat stream call (`https://api.echothink.ai/v1/chat/stream`) attaches
  a proof in Alpha, because it is the only protected API call the bundled Side
  Panel currently makes. Future protected calls reuse `buildProofHeaders()` with
  their own allowlisted destination.
- Header acceptance, nonce/`access_token_hash` requirements, replay-cache
  behavior, and device revocation checks remain backend/gateway
  responsibilities.
