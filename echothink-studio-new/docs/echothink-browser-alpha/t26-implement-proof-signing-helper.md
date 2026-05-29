# T26 Implement Proof Signing Helper

Date: 2026-05-29
Wave: W9
Delivery target: M5 - `0008-request-proof-helper.patch`
Status: DONE

## Current State

T26 depends on T25. T25 is `DONE` and provides the final request-proof payload
and allowlist specification at
`docs/echothink-browser-alpha/t25-define-request-proof-payload-and-allowlist.md`.

T26 is now implemented. Active patch
`patches/echothink/0008-request-proof-helper.patch` exists and is listed in
`patches/series` after `echothink/0024-narrow-extension-bridge.patch`.

## Prerequisite Check

| Prerequisite | Required by | Status | Evidence |
|---|---|---|---|
| T25 - Define request proof payload and allowlist | T26 | DONE | `docs/progress.md` marks T25 `DONE`; the T25 task note defines canonical fields, URL normalization, exact signing allowlist, rejection behavior, safe result shape, and backend replay/proof-validation ownership. |
| T24 - Narrow extension bridge | T26 | DONE | `patches/echothink/0024-narrow-extension-bridge.patch` is active; it added `chrome.echothinkDevice.signProofPayload` and the native `SignProofPayload()` device-key entry point that T26 reuses. |
| T23 - Device key generation and storage | T26 | DONE | `patches/echothink/0007-device-identity.patch` provides the DPAPI-protected ECDSA P-256 / `ES256` device key and `key_id` metadata. |

## What T26 Implements

T26 replaces the T24 opaque-string signing surface with the T25 canonical
request-proof contract. The bundled extension no longer hands the browser a
pre-canonicalized string to sign; instead it sends structured request fields,
and native browser code validates them, enforces the Echothink signing
allowlist, builds the canonical bytes itself, and only then signs.

### Patch

- `patches/echothink/0008-request-proof-helper.patch`, ordered in
  `patches/series` immediately after
  `echothink/0024-narrow-extension-bridge.patch` because it modifies files that
  the T24 bridge patch creates.

### Native files

- `chrome/common/extensions/api/echothink_device.idl` - `signProofPayload`
  now takes a structured `RequestProofOptions` dictionary (`method`, `url`,
  `timestamp`, optional `nonce`, optional `access_token_hash`) instead of a raw
  `payload` string. All members are declared optional so native code is the
  single source of truth for the contract and returns `invalid_payload` for any
  malformed input, including missing required fields.
- `chrome/browser/extensions/api/echothink_device/echothink_request_proof.h`,
  `echothink_request_proof.cc` (new) - `BuildCanonicalRequestProof()` performs
  all T25 validation and canonicalization and returns a `RequestProofStatus`
  (`kOk`, `kInvalidPayload`, `kDisallowedDestination`) plus the canonical JSON
  bytes and echoed timestamp.
- `chrome/browser/extensions/api/echothink_device/echothink_device_api.cc` -
  `EchothinkDeviceSignProofPayloadFunction::Run()` now calls the canonicalizer,
  maps the status to the documented error codes, signs the canonical bytes with
  the existing `echothink::device_identity::SignProofPayload()`, and returns the
  safe opaque proof result.
- `chrome/browser/extensions/api/echothink_device/BUILD.gn` - adds the new
  source files and the `//url` dependency for `GURL` parsing.

### Canonical payload

The canonical JSON is built by hand (not `base::Value::Dict`, whose
serialization sorts keys) in the fixed contractual order, with string values
only, no insignificant whitespace, and optional fields omitted entirely:

```text
{"method":"POST","url":"https://api.echothink.ai/v1/chat/stream","timestamp":"<RFC3339 Z>"}
```

Validation enforced before signing:

- `method` is one of `GET`, `POST`, `PUT`, `PATCH`, `DELETE`, `HEAD`, `OPTIONS`
  (exact uppercase token).
- `url` parses as an absolute HTTPS URL with no userinfo, no non-default port,
  a non-empty host, an exact allowlisted host, and an allowlisted path prefix.
  The fragment is stripped; `GURL` lowercases scheme/host, omits the default
  `:443` port, and query order is preserved (not sorted).
- `timestamp` matches RFC3339 UTC shape `YYYY-MM-DDTHH:MM:SS[.fraction]Z`.
- `nonce` (optional) is 1-256 UTF-8 bytes with no control characters.
- `access_token_hash` (optional) is exactly 43 base64url characters with no
  padding (a SHA-256 digest). Only the hash is accepted; raw tokens never reach
  the helper.
- Unknown fields are rejected.

### Signing allowlist

A URL is eligible for signing only when it is HTTPS and matches one of:

| Origin | Allowed path prefix |
|---|---|
| `https://api.echothink.ai` | `/v1/` |
| `https://auth.echothink.ai` | `/browser/` |
| `https://auth.echothink.ai` | `/device/` |
| `https://app.echothink.ai` | `/api/` |

Everything else - third-party hosts, sibling subdomains
(`search.echothink.ai`, `updates.echothink.ai`), lookalike hosts, `http`,
`file`, `chrome`, `chrome-extension`, `echo`, IP literals, localhost, userinfo,
and non-default ports - is rejected as `disallowed_destination` before any
signature is produced.

### Result shape

On success the helper returns the safe opaque result expected by T27:

```text
{
  ok: true,
  proof_type: "echothink-request-proof-v1",
  proof: "<base64url(canonical_json)>.<base64url(DER ECDSA-SHA256 signature)>",
  key_id: "<public device key identifier>",
  key_algorithm: "ES256",
  timestamp: "<canonical payload timestamp>"
}
```

The `proof` is opaque to T27. The helper does not return the private key, the
DPAPI blob, a raw access token, the canonical payload bytes, or a bare signature
value as separate fields.

### Rejection behavior

- Malformed payloads return `{ ok: false, error: "invalid_payload" }`.
- Disallowed destinations return `{ ok: false, error: "disallowed_destination" }`.
- Existing T24 bridge errors (`unauthorized_extension`, `missing_device`,
  `locked_key`, `unsupported_platform`, `reset`, `bridge_error`) remain valid.
- Rejection responses carry no rejected URL, query string, fragment, nonce, raw
  token, payload bytes, signature value, or private-key detail.

## Out Of Scope / Preserved

- No backend service, gateway authorization, search ranking, chat
  orchestration, workflow orchestration, or business pages were added.
- No Chromium network stack, TLS validation, sandbox, renderer internals,
  downloads, history, bookmarks, password manager, cookies, or DevTools
  behavior was changed. The request is only described and signed, never fetched.
- No replay cache, nonce history, proof history, signature, or token is stored
  in preferences, extension storage, web storage, logs, crash keys, docs, or
  progress notes. Backend/gateway services own replay protection and proof
  verification.
- The extension manifest and host permissions are unchanged; no `webRequest`,
  native messaging, cookies, or DevTools surface was added.

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
| `git apply --numstat patches/echothink/0008-request-proof-helper.patch` | Passed: 5 files parsed (BUILD.gn 3/0, echothink_device_api.cc 42/15, echothink_request_proof.cc 239/0, echothink_request_proof.h 46/0, echothink_device.idl 24/8). |
| `patch -p1` against a reconstructed post-`echothink/0024` tree | Passed: all 5 files applied with no fuzz; the applied tree byte-matches the intended source. |
| `python3 devutils/check_patch_files.py` | Passed, exit 0. |
| `python3 devutils/check_gn_flags.py` | Passed, exit 0. |
| `python3 devutils/validate_config.py` | Passed, exit 0. |
| Trailing-whitespace scan of added patch lines | Passed: none. |
| Decision-table logic mirror (29 cases: valid allowlisted signs, third-party / sibling-subdomain / lookalike / scheme / port / userinfo / IP rejected as `disallowed_destination`, malformed inputs rejected as `invalid_payload`) | Passed: 29/29. |

## Known Limitations

- No local pinned Chromium source checkout or Windows build exists here (per
  T03), so the patch was validated by `patch -p1` against a reconstructed
  post-`echothink/0024` tree and by a faithful logic mirror rather than a real
  browser build. Runtime signing smoke (real device key + extension call) is
  deferred to T33/T34/T35.
- The T24 hunk-count headers for the bridge's new files are internally
  inconsistent (the inherited pipeline applies with lenient `patch -p1`); T26's
  patch uses correct `git`-generated hunk headers and still applies with both
  `patch -p1` and `git apply --numstat`.
- Header acceptance, replay-cache behavior, device revocation checks, and
  protected-resource authorization remain backend/gateway responsibilities.
