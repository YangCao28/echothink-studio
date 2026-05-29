# T24 Implement Narrow Extension Bridge

Date: 2026-05-29
Wave: W7
Delivery target: M5 - device bridge API
Status: BLOCKED

## Blocker

T24 depends on T13 and T23. T13 is complete, but T23 is not complete and does
not provide the device-key implementation that this bridge must call.

Evidence:

- `docs/progress.md` marks T13 as `DONE`.
- `docs/progress.md` marks T23 as `BLOCKED`, not `DONE`.
- `docs/echothink-browser-alpha/t23-implement-device-key-generation-and-storage.md`
  is a blocker note and explicitly says no Chromium device identity patch was
  created.
- `patches/echothink/0007-device-identity.patch` does not exist.
- `patches/series` does not list `echothink/0007-device-identity.patch`.

Because the coordination rules require prerequisites to be marked `DONE` or
explicitly documented as acceptable baseline dependencies, T24 cannot expose a
bridge API yet. Implementing the bridge without T23 would require inventing the
device storage, key loading, reset, and private-key boundary contracts that are
owned by T22 and T23.

## Prerequisite Check

| Prerequisite | Required by | Status | Evidence |
|---|---|---|---|
| T13 - Add bundled extension install patch | T24 | DONE | `docs/progress.md` marks T13 `DONE`; the task note records the fixed bundled extension ID `lokdibgfmiemhdoogailbfpdggndpolk` and narrow manifest permissions. |
| T23 - Implement device key generation and storage | T24 | BLOCKED | `docs/progress.md` marks T23 `BLOCKED`; the T23 note says no `0007-device-identity.patch` was created and no key generation, DPAPI storage, metadata persistence, or reset behavior was implemented. |

No progress entry or task note explicitly accepts incomplete T23 as a baseline
dependency for T24.

## Missing Prerequisite Work

Complete T23 before resuming T24. The exact files that need to be updated are:

- `docs/echothink-browser-alpha/t23-implement-device-key-generation-and-storage.md`
- `docs/progress.md`
- `patches/echothink/0007-device-identity.patch`
- `patches/series`

T23 itself remains blocked on T22. The upstream prerequisite files and decisions
are:

- `docs/echothink-browser-alpha/t22-define-device-identity-and-dpapi-storage.md`
- `docs/echothink-browser-alpha/t20-define-login-gate-local-state-and-allowlist.md`
- `docs/progress.md`
- Local device identity field names and meanings.
- Windows DPAPI private-key storage format and scope.
- Placement for non-secret device metadata.
- Persistence behavior across browser restart.
- Explicit reset behavior for local enrollment state.
- Native boundary that keeps private key material out of extension JavaScript,
  logs, docs examples, and progress notes.

After T23 is complete, T24 must implement only the narrow bridge methods:

- `getDeviceStatus`
- `requestEnrollmentChallenge`
- `signProofPayload`
- `clearEnrollment`

The bridge must restrict callers to the bundled workspace extension ID
`lokdibgfmiemhdoogailbfpdggndpolk`, must not expose private key material to
extension JavaScript, and must define errors for missing device, locked key,
unsupported platform, and reset.

## T24 Work Not Started

No Chromium implementation patch was created. In particular, this blocked pass
did not:

- Create a new Echothink bridge patch.
- Add a bridge patch to `patches/series`.
- Add extension methods for `getDeviceStatus`, `requestEnrollmentChallenge`,
  `signProofPayload`, or `clearEnrollment`.
- Change the bundled extension manifest or permissions.
- Add broad host permissions, `nativeMessaging`, management APIs, or a
  general-purpose privileged bridge.
- Change backend services, gateway logic, search ranking, chat orchestration,
  workflow orchestration, business pages, network stack, TLS validation,
  sandbox, renderer internals, downloads, history, bookmarks, password manager,
  cookies, or DevTools behavior.
- Expose private key material, access tokens, or proof internals.

## Source Anchors Inspected

- `docs/ungoogled_to_echothink_browser_change_plan.md` sections 5.9 and 5.10,
  which sketch the device bridge and request proof boundaries.
- `docs/echothink_browser_construction.md` sections 5.6 and 5.7, which define
  the high-level device identity and request-proof architecture.
- `docs/dag-doc.md`, which defines T24 prerequisites, required bridge methods,
  and delivery criteria.
- `docs/progress.md`, which marks T13 `DONE` and T23 `BLOCKED`.
- `docs/echothink-browser-alpha/t13-add-bundled-extension-install-patch.md`,
  which records the bundled extension ID and narrow manifest boundary.
- `docs/echothink-browser-alpha/t23-implement-device-key-generation-and-storage.md`,
  which blocks bridge implementation until the device identity patch exists.
- `extensions/echothink-workspace/manifest.json`, which remains the bundled
  extension source manifest and should not be widened for this blocked pass.

## Validation

Run from the inherited repository root.

| Command | Result |
|---|---|
| `rtk rg -n "^\\| T13 \\|[^|]*\\|[^|]*\\|[^|]*\\| DONE \\|" echothink-studio-new/docs/progress.md` | Passed: T13 is marked `DONE` in the status column. |
| `rtk rg -n "^\\| T23 \\|[^|]*\\|[^|]*\\|[^|]*\\| DONE \\|" echothink-studio-new/docs/progress.md` | Exited 1 as expected: T23 is not marked `DONE` in the status column. |
| `rtk rg -n "^\\| T23 \\|[^|]*\\|[^|]*\\|[^|]*\\| BLOCKED \\||no Chromium implementation patch was created|0007-device-identity.patch" echothink-studio-new/docs/progress.md echothink-studio-new/docs/echothink-browser-alpha/t23-implement-device-key-generation-and-storage.md` | Passed: progress and the T23 note block T24. |
| `rtk rg -n "### T24: Implement Narrow Extension Bridge|Prerequisites: T13, T23|getDeviceStatus|signProofPayload" echothink-studio-new/docs/dag-doc.md echothink-studio-new/docs/ungoogled_to_echothink_browser_change_plan.md` | Passed: T24 scope and bridge method anchors exist. |
| `rtk ls -l patches/echothink/0007-device-identity.patch` | Failed as expected: no prerequisite device identity patch exists. |
| `rtk rg -n "echothink/0007-device-identity.patch" patches/series` | Failed as expected: inactive blocked patch is not listed in the active patch pipeline. |
| `rtk ls -l echothink-studio-new/docs/echothink-browser-alpha/t24-implement-narrow-extension-bridge.md echothink-studio-new/docs/progress.md` | Passed: the T24 note and shared progress file exist. |
| `rtk python3 -m json.tool extensions/echothink-workspace/manifest.json` | Passed: source manifest parses as JSON. |
| Node manifest boundary check against `extensions/echothink-workspace/manifest.json` | Passed: manifest is MV3, has no `update_url`, derives extension ID `lokdibgfmiemhdoogailbfpdggndpolk`, keeps exact permissions `sidePanel`, `storage`, `tabs`, `activeTab`, `scripting`, keeps host permissions limited to Echothink-owned domains, and does not declare broad privileged permissions. |
| `rtk git diff --check` | Passed: no whitespace errors. |

## Known Limitations

- This is a blocker record, not the M5 device bridge API implementation.
- T24 delivery criteria remain unmet until T23 is completed and the bridge can
  be implemented against the real device-key storage boundary.
- No runtime extension bridge smoke test was run because no bridge patch exists
  in this blocked pass.
