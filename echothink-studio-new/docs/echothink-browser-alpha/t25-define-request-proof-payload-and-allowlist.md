# T25 Define Request Proof Payload And Allowlist

Date: 2026-05-29
Wave: W8
Delivery target: M5 - proof helper spec
Status: DONE

## Current State

T25 depends on T24. T24 is `DONE` and provides the narrow bundled-extension
bridge in active patch `patches/echothink/0024-narrow-extension-bridge.patch`.

This document is the M5 Alpha source of truth for the request-proof payload
shape, destination allowlist, rejection behavior, and ownership boundaries that
T26 must implement before T27 attaches proofs to extension API calls.

## Prerequisite Check

| Prerequisite | Required by | Status | Evidence |
|---|---|---|---|
| T24 - Implement narrow extension bridge | T25 | DONE | `docs/progress.md` marks T24 `DONE`; `patches/echothink/0024-narrow-extension-bridge.patch` exists and is active in `patches/series`. |

## Scope

The browser-owned proof helper signs a canonical description of an outbound
Echothink request with the browser-local device key from T23. It does not fetch
the request, attach headers by itself, validate server responses, authorize
users, decide workspace scope, store replay state, or verify proofs.

T26 may keep the T24 method name `chrome.echothinkDevice.signProofPayload`, but
the final Alpha contract must not sign arbitrary caller-provided strings. The
native helper must validate structured request fields, enforce the allowlist,
construct the canonical bytes itself, and then sign those bytes.

## Canonical Payload Shape

The signed payload is a UTF-8 JSON object with only the following fields.
Required fields are always present. Optional fields are omitted completely when
not supplied or not required.

| Field | Required | Type | Canonical rule |
|---|---|---|---|
| `method` | Yes | string | Uppercase HTTP method token. Alpha allows `GET`, `POST`, `PUT`, `PATCH`, `DELETE`, `HEAD`, and `OPTIONS`. |
| `url` | Yes | string | Absolute canonical HTTPS URL for the request target, including path and query string and excluding fragment. |
| `timestamp` | Yes | string | UTC RFC3339 timestamp using `Z`. Backend owns freshness validation. |
| `nonce` | Only if supplied | string | Server-provided replay nonce. Browser validates shape and length but does not maintain a nonce cache. |
| `access_token_hash` | Only if required | string | Base64url SHA-256 hash of the request access token, without padding. Raw tokens are never passed to the helper. |

Canonical field order for signing is:

```text
method
url
timestamp
nonce
access_token_hash
```

Serialization rules:

- Serialize as JSON with string values only, no insignificant whitespace, and
  the exact field order above.
- Omit optional fields instead of serializing empty strings.
- Reject unknown fields. Alpha does not sign request body hashes, referrers,
  cookies, tab IDs, user IDs, organization IDs, scopes, or arbitrary caller
  metadata.
- Sign the UTF-8 bytes of the canonical JSON. Do not sign a JavaScript-built
  pre-canonicalized string without native revalidation.

URL normalization rules:

- Require `https`.
- Require an exact allowlisted host and path prefix from this document.
- Reject userinfo, empty hosts, non-default ports, fragments, and non-absolute
  URLs.
- Lowercase scheme and host, omit the default `:443` port, preserve path and
  query semantics as parsed by Chromium URL handling, and do not sort query
  parameters.
- Strip fragments before signing because fragments are not sent to the server.

Timestamp and optional field rules:

- `timestamp` must parse as a UTC RFC3339 instant. Browser validation is shape
  only; backend/gateway validation owns accepted clock skew and expiry.
- `nonce` is bounded to 256 UTF-8 bytes and must not contain control
  characters. Backend/gateway validation owns nonce issuance and one-time use.
- `access_token_hash` is present only when the protected API contract requires
  token binding. The helper accepts only the hash value, not the token. Backend
  validation owns comparing it to the request's token.

## Signing Allowlist

The Alpha signing allowlist is narrower than the extension host permissions.
A destination is eligible for signing only when the parsed URL matches one of
these exact HTTPS origins and path prefixes.

| Origin | Allowed path prefix | Purpose |
|---|---|---|
| `https://api.echothink.ai` | `/v1/` | Protected Echothink API calls, including the current chat stream endpoint. |
| `https://auth.echothink.ai` | `/browser/` | Browser setup/status calls that explicitly require a device proof. |
| `https://auth.echothink.ai` | `/device/` | Device enrollment or verification calls that explicitly require a device proof. |
| `https://app.echothink.ai` | `/api/` | First-party workspace app API calls that explicitly require a device proof. |

Everything else is disallowed for proof signing, including:

- Third-party hosts and sibling subdomains.
- `http`, `file`, `chrome`, `chrome-extension`, `echo`, and external protocol
  URLs.
- IP literals, localhost, and URLs with usernames, passwords, or non-default
  ports.
- `https://search.echothink.ai/*`, because default search and suggestions are
  browser defaults, not proof-signed protected API calls in Alpha.
- `https://updates.echothink.ai/*`, support/download pages, normal document
  navigations, New Tab URLs, and optional `echo://` routes.

T26 must enforce this allowlist natively before any signature is returned. T27
must not treat extension host permissions as proof-signing authorization.

## Rejection Behavior

Malformed payloads are rejected with:

```text
{ ok: false, error: "invalid_payload" }
```

Disallowed destinations, including third-party destinations and non-signing
Echothink origins, are rejected with:

```text
{ ok: false, error: "disallowed_destination" }
```

Existing bridge errors from T24 remain valid:

- `unauthorized_extension`
- `missing_device`
- `locked_key`
- `unsupported_platform`
- `reset`
- `bridge_error`

Rejection responses and diagnostics must not include the rejected full URL,
query string, fragment, referrer, raw token, payload bytes, signature value, or
private key details. Coarse error codes are enough for the extension to show
local state or retry guidance.

## Safe Result Shape

T26 should return a header-ready opaque proof result that T27 can attach without
inspecting proof internals:

```text
{
  ok: true,
  proof_type: "echothink-request-proof-v1",
  proof: "<opaque browser-created proof value>",
  key_id: "<public device key identifier>",
  key_algorithm: "ES256",
  timestamp: "<canonical payload timestamp>"
}
```

T27 may attach the opaque `proof` value using the backend-approved DPoP-style
header contract and may attach `X-Echothink-Device-ID` from `getDeviceStatus`
when required. Cookie-based extension requests do not add an `Authorization`
header. Any future access-token-bearing request must be owned by an auth task
that keeps raw tokens out of helper inputs, logs, documentation examples, and
progress notes.

The helper result must not return private key material, DPAPI blobs, raw access
tokens, canonical payload bytes, separate signature internals, replay nonces
history, or backend authorization decisions.

## Browser Responsibilities

The browser helper owns only:

- Checking the exact bundled extension caller through the T24 bridge.
- Validating request field shape.
- Canonicalizing the payload fields defined above.
- Enforcing the signing allowlist.
- Loading the browser-owned device key through the T23 native identity
  component.
- Signing the canonical payload bytes and returning the safe result shape.

The browser helper must not:

- Implement backend services, gateway authorization, search ranking, chat
  orchestration, workflow orchestration, or business pages.
- Change Chromium network stack, TLS validation, sandbox, renderer internals,
  downloads, history, bookmarks, password manager, cookies, or DevTools.
- Store replay caches, nonce history, proof payload history, proof signatures,
  access tokens, raw private keys, or DPAPI blobs in preferences, extension
  storage, web storage, logs, crash keys, docs examples, or progress notes.

## Backend-Owned Validation

Replay protection and proof validation are outside the browser. The
backend/gateway owns:

- Verifying the signature against the registered public device key.
- Binding the device key to user, organization, device status, browser channel,
  and revocation state.
- Validating method, URL, timestamp freshness, nonce presence and one-time use,
  and access-token hash when required.
- Rejecting expired, replayed, malformed, wrong-destination, wrong-token,
  unregistered-key, revoked-device, or unauthorized-scope proofs.
- Writing audit events for protected access decisions.

## Source Anchors

- `docs/ungoogled_to_echothink_browser_change_plan.md` sections 5.9 and 5.10.
- `docs/echothink_browser_construction.md` sections 5.6 and 5.7.
- `docs/echothink-browser-alpha/t22-define-device-identity-and-dpapi-storage.md`.
- `docs/echothink-browser-alpha/t23-implement-device-key-generation-and-storage.md`.
- `docs/echothink-browser-alpha/t24-implement-narrow-extension-bridge.md`.
- `patches/echothink/0007-device-identity.patch`.
- `patches/echothink/0024-narrow-extension-bridge.patch`.
- `extensions/echothink-workspace/manifest.json`, `background.js`,
  `sidepanel.js`, and `content_bridge.js`.

## T26/T27 Handoff

T26 is now unblocked from a prerequisite standpoint, but its patch still does
not exist. T26 must implement this spec in
`patches/echothink/0008-request-proof-helper.patch`, add
`echothink/0008-request-proof-helper.patch` to `patches/series` when active,
and validate that malformed and disallowed destinations fail before signing.

T27 remains blocked until T26 is `DONE`. T27 must not widen extension
permissions, add `webRequest`, use native messaging, log proof results, or
attach proofs to non-allowlisted destinations.

## Validation

Run from the inherited repository root.

| Command | Result |
|---|---|
| `rtk rg -n "^\\| T24 \\|[^|]*\\|[^|]*\\|[^|]*\\| DONE \\|" echothink-studio-new/docs/progress.md` | Passed: T24 is marked `DONE`. |
| `rtk rg -n "^echothink/0024-narrow-extension-bridge\\.patch$" patches/series` | Passed: T24 bridge patch is active. |
| `rtk ls -l patches/echothink/0024-narrow-extension-bridge.patch patches/echothink/0007-device-identity.patch` | Passed: T24 and T23 patch artifacts exist. |
| `rtk rg -n "signProofPayload|kBundledWorkspaceExtensionId|kMaxProofPayloadBytes|signature_encoding" patches/echothink/0024-narrow-extension-bridge.patch` | Passed: current bridge signing surface and caller guard were inspected. |
| `rtk python3 -m json.tool extensions/echothink-workspace/manifest.json` | Passed: extension manifest JSON parses. |
| `rtk rg -n "host_permissions|https://api.echothink.ai|https://app.echothink.ai|https://auth.echothink.ai|https://search.echothink.ai" extensions/echothink-workspace/manifest.json` | Passed: extension host-permission baseline was checked against the narrower signing allowlist. |
| `rtk rg -n "method|url|timestamp|nonce|access_token_hash|disallowed_destination|Backend-Owned Validation" echothink-studio-new/docs/echothink-browser-alpha/t25-define-request-proof-payload-and-allowlist.md` | Passed: canonical fields, rejection behavior, and backend-owned validation are documented. |
| `rtk python3 devutils/check_patch_files.py` | Passed, exit 0, for the unchanged active patch series. |
| `rtk python3 devutils/check_gn_flags.py` | Passed, exit 0. |
| `rtk python3 devutils/validate_config.py` | Passed, exit 0. |
| `rtk git diff --check` | Passed: no whitespace errors. |

## Known Limitations

- This is a spec task. It does not create
  `patches/echothink/0008-request-proof-helper.patch` or modify
  `patches/series`.
- No browser binary was built or run, so no runtime proof-signing smoke test was
  performed.
- Header acceptance, replay cache behavior, device revocation checks, and
  protected-resource authorization remain backend/gateway responsibilities.
