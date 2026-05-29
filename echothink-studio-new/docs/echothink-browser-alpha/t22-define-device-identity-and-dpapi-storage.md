# T22 Define Device Identity And DPAPI Storage

Date: 2026-05-29
Wave: W5
Delivery target: M5 - device identity design
Status: DONE

## Scope

This is the Alpha design for local browser device identity. It does not create
`patches/echothink/0007-device-identity.patch`, implement extension bridge APIs,
call backend services, or add request-proof signing. T23 owns key generation and
storage implementation, T24 owns the extension bridge, and T25/T26 own proof
payload and signing behavior.

The design preserves Chromium network stack, TLS validation, sandbox, renderer
internals, downloads, history, bookmarks, password manager, cookies, and
DevTools behavior.

## Prerequisite Check

| Prerequisite | Required by | Status | Evidence |
|---|---|---|---|
| T00 - Baseline repo audit | T22 | DONE | `docs/progress.md` marks T00 `DONE`; the canonical-root mismatch is accepted for this docs-only design task. |
| T20 - Define login gate local state and allowlist | T22 | DONE | `docs/progress.md` marks T20 `DONE`; the T20 spec defines the readiness prefs, setup completion, and reset/logout contract this design consumes. |

## Design Summary

Alpha uses a browser-local asymmetric device keypair plus non-secret enrollment
metadata. DPAPI is the selected Alpha protection mechanism for private key
material on Windows.

Identity scope:

- The cryptographic device key is scoped to the Chromium user data directory
  for the current Windows user. It is not scoped to a web origin, extension,
  tab, or renderer process.
- Profile preferences hold profile-specific readiness and enrollment state, so
  secondary profiles do not silently inherit a verified setup flag.
- Backend services remain responsible for binding a public key to a user,
  organization, and device status. The local browser state is not a backend
  authorization boundary.

Key algorithm:

- Generate an ECDSA P-256 keypair for Alpha.
- Use `ES256` for the device key identifier and future DPoP-style signatures.
- Store/export the public key as JWK fields containing only public values.
- Never store or expose the JWK private `d` value outside the native protected
  payload.

## Local Device Identity Fields

| Field | Storage surface | Type | Meaning |
|---|---|---|---|
| `echothink.device.installation_id` | Local State | UUID string | Locally generated identifier for the current user data directory. Rotated by explicit device reset. |
| `echothink.device.key_id` | Local State | string | Public-key thumbprint or equivalent stable identifier for the active local key. |
| `echothink.device.key_algorithm` | Local State | string | `ES256` for Alpha. |
| `echothink.device.public_key_jwk` | Local State | dictionary | Public JWK only: `kty`, `crv`, `x`, `y`, and optional non-secret key metadata. No private component. |
| `echothink.device.key_created_at` | Local State | ISO-8601 UTC string | Creation time for the active local key. |
| `echothink.device.key_storage` | Local State | string | `windows_dpapi_current_user_v1`. |
| `echothink.device.browser_channel` | Local State | string | Echothink Browser channel observed when metadata was last refreshed. |
| `echothink.device.browser_version` | Local State | string | Browser version observed when metadata was last refreshed. |
| `echothink.device.device_id` | Profile prefs | string | Opaque backend-assigned device identifier after enrollment. Empty before enrollment. |
| `echothink.device.enrollment_status` | Profile prefs | string enum | `none`, `pending`, `enrolled`, `verified`, `revoked`, `reset_required`, or `error`. |
| `echothink.device.enrolled_at` | Profile prefs | ISO-8601 UTC string or empty | Local time when enrollment became available for this profile. |
| `echothink.device.last_verified_at` | Profile prefs | ISO-8601 UTC string or empty | Local time when backend device verification last succeeded. |
| `echothink.device.revoked_at` | Profile prefs | ISO-8601 UTC string or empty | Local time when the browser observed revocation or reset-required state. |
| `echothink.device.last_error` | Profile prefs | coarse string enum or empty | Optional local diagnostic enum. Must not contain URLs, tokens, key material, proof payloads, or signatures. |

T20 readiness preferences remain authoritative for the login gate:

- `echothink.device.enrolled`
- `echothink.device.verified`
- `echothink.setup.complete`

T23 may register additional implementation detail prefs only if they are
non-secret and this document or the T23 note is updated.

## Windows DPAPI Storage

Private key material is stored only as a DPAPI-protected native payload.

Selected Alpha approach:

- Generate the private key in the browser process or a browser-owned native
  component, never in extension JavaScript or page JavaScript.
- Serialize the private key into a native key payload suitable for reloading by
  Chromium on Windows, with a version, algorithm, and key identifier.
- Protect that payload with Windows DPAPI using current-user scope
  (`CryptProtectData` / `CryptUnprotectData`) and UI disabled.
- Do not use machine-wide DPAPI scope for Alpha.
- Store the resulting protected blob in a dedicated file under the Chromium user
  data directory, for example
  `User Data/Echothink Device Identity/device_key.dpapi`.
- Do not store the protected private-key blob in profile preferences,
  extension storage, web storage, logs, crash keys, docs examples, or progress
  notes.
- Store only non-secret metadata in Local State and profile prefs.

Protected file format:

| Field | Meaning |
|---|---|
| `schema_version` | Storage envelope version, initially `1`. |
| `storage` | `windows_dpapi_current_user_v1`. |
| `key_algorithm` | `ES256`. |
| `key_id` | Matches `echothink.device.key_id` in Local State. |
| `protected_payload` | Base64 DPAPI blob. The unprotected payload contains private key material and must never be logged or surfaced to JavaScript. |

DPAPI failure behavior:

- If the file is missing and no enrollment exists, T23 should generate a fresh
  key when enrollment starts.
- If metadata exists but DPAPI unprotect fails, mark the profile
  `reset_required` or `error`, clear `echothink.device.verified`, clear
  `echothink.setup.complete`, and keep diagnostics to coarse enums.
- Do not automatically upload a new public key or silently replace an enrolled
  device without a user-visible enrollment/reset path.

Known Alpha limitation:

- DPAPI current-user protection does not protect against code already running as
  the same Windows user. TPM-backed or hardware-backed keys are deferred beyond
  Alpha.

## Non-Secret Metadata Placement

Use Local State for installation/key facts shared by the browser user data
directory:

- `echothink.device.installation_id`
- `echothink.device.key_id`
- `echothink.device.key_algorithm`
- `echothink.device.public_key_jwk`
- `echothink.device.key_created_at`
- `echothink.device.key_storage`
- `echothink.device.browser_channel`
- `echothink.device.browser_version`

Use profile preferences for per-profile enrollment and gate readiness:

- `echothink.device.device_id`
- `echothink.device.enrollment_status`
- `echothink.device.enrolled_at`
- `echothink.device.last_verified_at`
- `echothink.device.revoked_at`
- `echothink.device.last_error`
- T20 readiness prefs: `echothink.auth.session_ready`,
  `echothink.device.enrolled`, `echothink.device.verified`,
  `echothink.setup.complete`, and the T20 diagnostic timestamps.

Do not put access tokens, refresh tokens, private key material, proof payloads,
signed proof values, or full blocked URLs in any of these storage surfaces.

## Reset And Logout Behavior

| Event | Required local behavior |
|---|---|
| Browser restart | Reload Local State metadata and DPAPI-protected key file. If both are valid, the identity persists. Recompute T20 `echothink.setup.complete` from auth/device readiness. |
| Sign-out | Clear `echothink.auth.session_ready` and `echothink.setup.complete`. Keep DPAPI key, `installation_id`, public key metadata, and profile enrollment metadata unless the user also chooses device reset. |
| Sign-in as a different account or organization | Require backend verification before setting `echothink.device.verified` true. If verification fails or reports mismatch, clear `echothink.device.verified` and `echothink.setup.complete`, and set a coarse enrollment status. |
| Device verification revoked by backend | Clear `echothink.device.verified` and `echothink.setup.complete`; set profile `echothink.device.enrollment_status` to `revoked` or `reset_required`; keep the DPAPI key until explicit local reset unless the implementation has a verified server instruction to rotate. |
| Explicit local device reset | Delete the DPAPI-protected key file, clear Local State device key metadata, rotate `echothink.device.installation_id`, clear profile `device_id`, enrollment timestamps, enrollment status, `echothink.device.enrolled`, `echothink.device.verified`, and `echothink.setup.complete`. The next enrollment generates a new keypair. |
| Profile deletion | Chromium removes profile prefs. Local State and user-data-dir key artifacts remain unless the whole user data directory is removed or explicit device reset runs. |
| Uninstall without user data removal | No special deletion guarantee. Windows uninstall behavior is owned by packaging tasks; users must use explicit reset or remove user data if they need local identity deletion. |

## Extension Bridge Boundaries

The bundled workspace extension may request device operations only through a
narrow browser-owned API implemented after T23. The trusted component extension
ID is `lokdibgfmiemhdoogailbfpdggndpolk`; arbitrary extensions and web pages
must not receive this API.

Allowed bridge shape:

| Method | May return | Must not return |
|---|---|---|
| `getDeviceStatus` | Non-secret booleans and metadata such as enrolled/verified state, `device_id`, `installation_id`, `key_id`, `key_algorithm`, and whether a protected key exists. | Private key bytes, DPAPI blob, access tokens, proof payloads, signatures, or detailed DPAPI errors. |
| `requestEnrollmentChallenge` | Public-key registration material, browser channel/version, and non-secret enrollment status needed by the auth service. | Private key material, DPAPI blob, auth tokens, or server-side authorization decisions. |
| `signProofPayload` | A signature/proof result only after T25 defines canonical payload rules and T26 enforces an Echothink-domain allowlist. | Raw private key, exported private JWK, DPAPI blob, signing internals, or signatures for arbitrary third-party URLs. |
| `clearEnrollment` | Success/failure status for explicit local reset or enrollment clearing. | Deleted key contents, old DPAPI blob, old signatures, or proof payload history. |

Bridge implementation rules:

- The native browser side owns key load, DPAPI unprotect, signing, and reset.
- Extension JavaScript never receives private key material, DPAPI blobs, or raw
  unprotected key handles.
- Page JavaScript must not call the native device API directly. First-party web
  pages may communicate only through the bundled extension's explicitly
  reviewed message paths.
- T24 must check caller identity and reject all non-bundled extensions.
- T25/T26 must enforce canonical request-proof shape and destination allowlist
  before any signing result is returned.
- Logs and diagnostics may record coarse result codes only. They must not
  include private key material, access tokens, request-proof payloads,
  signatures, blocked URLs, query strings, fragments, or referrers.

## Implementation Anchors For T23

T23 should implement this design in `patches/echothink/0007-device-identity.patch`
and add `echothink/0007-device-identity.patch` to `patches/series` when the
patch exists and validates.

Expected Chromium target areas:

- A small browser-owned device identity component under a Chromium browser path
  such as `chrome/browser/echothink/device_identity/`.
- Preference registration for the Local State and profile-pref keys above.
- Windows-only DPAPI helpers guarded to avoid changing non-Windows behavior.
- Reset hooks callable by the later T24 bridge and by explicit local reset UI or
  command paths.

T23 must not implement backend enrollment services, gateway authorization,
request-proof payload policy, extension bridge exposure, or proof signing for
third-party destinations.

## Source Anchors Inspected

- `docs/ungoogled_to_echothink_browser_change_plan.md` section 5.9, which
  requires device key generation, Windows DPAPI, non-secret metadata, reset, and
  private-key boundaries.
- `docs/echothink_browser_construction.md` sections 5.6 and 5.7, which define
  the high-level device identity and request-proof architecture.
- `docs/dag-doc.md`, which defines T22 prerequisites and delivery criteria.
- `docs/echothink-browser-alpha/t20-define-login-gate-local-state-and-allowlist.md`,
  which supplies the completed readiness and reset contract.
- `patches/echothink/0006-login-gate.patch`, which registers and consumes the
  T20 readiness prefs.
- `extensions/echothink-workspace/manifest.json` and
  `patches/echothink/0004-bundled-workspace-extension.patch`, which establish
  the bundled workspace extension identity and narrow permission baseline.

## Validation

Commands were run from the inherited browser patch/config root, where
`patches/`, `extensions/`, and `echothink-studio-new/docs/` are present.

| Command | Result |
|---|---|
| `rtk rg -n "^\\| T00 \\|[^|]*\\|[^|]*\\|[^|]*\\| DONE \\|" echothink-studio-new/docs/progress.md` | Passed: T00 is marked `DONE`. |
| `rtk rg -n "^\\| T20 \\|[^|]*\\|[^|]*\\|[^|]*\\| DONE \\|" echothink-studio-new/docs/progress.md` | Passed: T20 is marked `DONE`. |
| `rtk rg -n "^\\| T22 \\|[^|]*\\|[^|]*\\|[^|]*\\| DONE \\|" echothink-studio-new/docs/progress.md` | Passed: T22 is marked `DONE`. |
| `rtk rg -n "^\\| T23 \\|[^|]*\\|[^|]*\\|[^|]*\\| READY \\|" echothink-studio-new/docs/progress.md` | Passed: T23 is now ready for implementation. |
| `rtk rg -n "echothink.device.enrolled|echothink.device.verified|Reset And Logout Semantics" echothink-studio-new/docs/echothink-browser-alpha/t20-define-login-gate-local-state-and-allowlist.md` | Passed: T20 defines the readiness/reset anchors T22 consumes. |
| `rtk rg -n "kEchothinkDeviceEnrolledPref|kEchothinkDeviceVerifiedPref|kEchothinkSetupCompletePref" patches/echothink/0006-login-gate.patch` | Passed: the active login-gate patch uses the T20 readiness prefs T22 preserves. |
| `rtk rg -n "lokdibgfmiemhdoogailbfpdggndpolk|host_permissions|sidePanel|storage" extensions/echothink-workspace/manifest.json patches/echothink/0004-bundled-workspace-extension.patch` | Passed: the bundled extension identity and permission baseline exist for the future bridge boundary. |
| `rtk rg -n "Status: DONE|windows_dpapi_current_user_v1|Extension Bridge Boundaries|Explicit local device reset" echothink-studio-new/docs/echothink-browser-alpha/t22-define-device-identity-and-dpapi-storage.md` | Passed: this design records DPAPI selection, bridge boundary, and reset behavior. |
| `rtk rg -n "t22-define-device-identity-and-dpapi-storage|DPAPI current-user|Alpha source of truth" echothink-studio-new/docs/ungoogled_to_echothink_browser_change_plan.md echothink-studio-new/docs/echothink_browser_construction.md` | Passed: broader docs point to this design. |
| `rtk rg -n 'T22 is not mark[e]d|T22 is now [[:punct:]]READY[[:punct:]]|T22 is [[:punct:]]READY[[:punct:]]|no final M5 device identit[y]|T23 must not us[e]|T23 is mark[e]d [[:punct:]]BLOCKED[[:punct:]]|no T24 task note exist[s]|has no T24 ro[w]|Complete the M5 device identity desig[n]' echothink-studio-new/docs` | Exited 1 as expected: no stale T22/T23 blocker language remains. |
| `rtk git diff --check` | Passed: no whitespace errors. |

## Known Limitations

- No Chromium patch was created in T22. T23 still must implement and validate
  `patches/echothink/0007-device-identity.patch`.
- No runtime persistence test was run because this is a design task and no
  device identity implementation exists yet.
- TPM-backed or hardware-backed keys are deferred beyond Alpha.
