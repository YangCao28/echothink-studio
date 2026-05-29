# T23 Implement Device Key Generation And Storage

Date: 2026-05-29
Wave: W6
Delivery target: M5 - `0007-device-identity.patch`
Status: BLOCKED

## Blocker

T23 depends on T22. T22 is not complete in the shared progress source and does
not provide the device identity design that this implementation patch is
required to consume.

Evidence:

- `docs/progress.md` marks T22 as `BLOCKED`, not `DONE`.
- `docs/echothink-browser-alpha/t22-define-device-identity-and-dpapi-storage.md`
  is a blocker note, not the final M5 device identity design.
- The T22 note explicitly says T23 must not use it as authorization to
  implement `patches/echothink/0007-device-identity.patch`.

Because the coordination rules require prerequisites to be marked `DONE` or
explicitly documented as acceptable baseline dependencies, T23 cannot create or
activate the device identity patch yet.

## Prerequisite Check

| Prerequisite | Required by | Status | Evidence |
|---|---|---|---|
| T22 - Define device identity and DPAPI storage | T23 | BLOCKED | `docs/progress.md` marks T22 `BLOCKED`; the T22 task note says no device identity fields, DPAPI storage format, metadata placement, reset/logout behavior, or private-key bridge boundary were defined. |

No progress entry or task note explicitly accepts incomplete T22 as a baseline
dependency for T23.

## Missing Prerequisite Work

Complete T22 before resuming T23. The exact files that need to be updated are:

- `docs/echothink-browser-alpha/t22-define-device-identity-and-dpapi-storage.md`
- `docs/progress.md`

T22 itself is blocked on T20. The upstream prerequisite files and decisions are:

- `docs/echothink-browser-alpha/t20-define-login-gate-local-state-and-allowlist.md`
- `docs/progress.md`
- Local auth/device readiness flags and their storage surface.
- Final unauthenticated navigation allowlist.
- Blocked-navigation behavior and local recovery surface.
- Setup-completion criteria after login and device verification.
- Diagnostics/support exceptions, including the status of
  `chrome://echothink-diagnostics`.
- Reset/logout semantics for non-secret enrollment state.

After T20 is complete, T22 must define the exact implementation contract T23
needs:

- Local device identity field names and meanings.
- Windows DPAPI private-key storage format and scope.
- Placement for non-secret device metadata.
- Persistence behavior across browser restart.
- Explicit reset behavior for local enrollment state.
- Native bridge boundary that keeps private key material out of extension
  JavaScript, logs, docs examples, and progress notes.

## T23 Work Not Started

No Chromium implementation patch was created. In particular, this blocked pass
did not:

- Create `patches/echothink/0007-device-identity.patch`.
- Add `echothink/0007-device-identity.patch` to `patches/series`.
- Add asymmetric key generation, DPAPI storage, metadata persistence, restart
  loading, or reset handling.
- Change extension bridge APIs, request proof helpers, backend services,
  gateway logic, search ranking, chat orchestration, workflow orchestration, or
  business pages.
- Change network stack, TLS validation, sandbox, renderer internals, downloads,
  history, bookmarks, password manager, cookies, or DevTools behavior.
- Expose private key material, access tokens, or proof internals.

## Source Anchors Inspected

- `docs/ungoogled_to_echothink_browser_change_plan.md` section 5.9, which
  sketches device identity, DPAPI storage, non-secret metadata, reset, and
  private-key boundaries.
- `docs/echothink_browser_construction.md` sections 5.6 and 5.7, which define
  the high-level device identity and request-proof architecture.
- `docs/dag-doc.md`, which defines T23's prerequisite and delivery criteria.
- `docs/progress.md`, which marks T22 `BLOCKED`.
- `docs/echothink-browser-alpha/t22-define-device-identity-and-dpapi-storage.md`,
  which blocks T23 until the M5 device identity design exists.
- `docs/echothink-browser-alpha/t20-define-login-gate-local-state-and-allowlist.md`,
  which remains the upstream blocker for T22.

## Validation

Run from the inherited repository root.

| Command | Result |
|---|---|
| `rtk rg -n "^\\| T22 \\|[^|]*\\|[^|]*\\|[^|]*\\| DONE \\|" echothink-studio-new/docs/progress.md` | Exited 1 as expected: T22 is not marked `DONE` in the status column. |
| `rtk rg -n "^\\| T22 \\|[^|]*\\|[^|]*\\|[^|]*\\| BLOCKED \\||T23 must not use" echothink-studio-new/docs/progress.md echothink-studio-new/docs/echothink-browser-alpha/t22-define-device-identity-and-dpapi-storage.md` | Passed: progress and the T22 note block T23. |
| `rtk rg -n "### T23: Implement Device Key Generation And Storage|Prerequisites: T22|0007-device-identity.patch" echothink-studio-new/docs/dag-doc.md echothink-studio-new/docs/ungoogled_to_echothink_browser_change_plan.md echothink-studio-new/docs/echothink_browser_construction.md` | Passed: T23 scope and delivery target anchors exist. |
| `rtk ls -l patches/echothink/0007-device-identity.patch` | Failed as expected: no blocked patch artifact was created. |
| `rtk rg -n "echothink/0007-device-identity.patch" patches/series` | Failed as expected: inactive blocked patch is not listed in the active patch pipeline. |
| `rtk ls -l echothink-studio-new/docs/echothink-browser-alpha/t23-implement-device-key-generation-and-storage.md echothink-studio-new/docs/progress.md` | Passed: the T23 note and shared progress file exist. |
| `rtk git diff --check` | Passed: no whitespace errors. |

## Known Limitations

- This is a blocker record, not the M5 device identity implementation.
- T23 delivery criteria remain unmet until T22 is completed and
  `patches/echothink/0007-device-identity.patch` can be implemented and
  validated.
- No runtime persistence or reset smoke test was run because no implementation
  patch exists in this blocked pass.
