# T22 Define Device Identity And DPAPI Storage

Date: 2026-05-29
Wave: W5
Delivery target: M5 - device identity design
Status: BLOCKED

## Blocker

T22 depends on T00 and T20. T00 is marked `DONE` in `docs/progress.md`, but
T20 is not marked `DONE` and is not explicitly documented as an acceptable
baseline dependency for T22.

Current T20 evidence is incomplete:

- `docs/progress.md` marks T20 as `READY`, not `DONE`.
- `docs/echothink-browser-alpha/t20-define-login-gate-local-state-and-allowlist.md`
  still has `Status: BLOCKED` and says no login-gate spec was authored.
- The required M4 login-gate decisions that T22 depends on are still pending:
  local auth/device readiness flags, the unauthenticated navigation allowlist,
  blocked-navigation behavior, setup-completion criteria, and diagnostics /
  support exceptions.

Because the coordination rules require prerequisites to be complete or
explicitly accepted before starting dependent work, T22 cannot define the
authoritative device identity fields, DPAPI storage shape, non-secret metadata
location, reset/logout behavior, or extension bridge boundaries yet.

## Prerequisite Check

| Prerequisite | Required by | Status | Evidence |
|---|---|---|---|
| T00 - Baseline repo audit | T22 | DONE | `docs/progress.md` marks T00 `DONE`; task note exists at `docs/echothink-browser-alpha/t00-baseline-repo-audit.md`. |
| T20 - Define login gate local state and allowlist | T22 | INCOMPLETE | `docs/progress.md` marks T20 `READY`, not `DONE`; the T20 task note still says `Status: BLOCKED` and records that no login-gate spec was authored. |

No progress entry or task note explicitly accepts incomplete T20 as a baseline
dependency for T22.

## Missing Prerequisite Work

Complete T20 before resuming T22. The exact files that need to be updated are:

- `docs/echothink-browser-alpha/t20-define-login-gate-local-state-and-allowlist.md`
- `docs/progress.md`

The exact T20 decisions needed by T22 are:

- Names and meanings for local auth/device readiness state, including how login
  state, device enrollment, device verification, and setup completion are
  represented.
- Whether those readiness values live in profile preferences, Local State, or a
  split between the two.
- The final unauthenticated navigation allowlist, including auth, enrollment,
  browser-required, support/download, update, and diagnostics routes.
- Whether `chrome://echothink-diagnostics` is implemented, replaced, or kept as
  a known dead link before it is treated as an exception route.
- Blocked-navigation behavior and the local explanation/recovery surface.
- Setup-completion criteria that unlock normal browsing after login and device
  verification.
- Reset/logout semantics for login-gate state, especially which non-secret
  enrollment flags are cleared on sign-out, explicit local reset, and profile
  deletion.

T21's implementation patch (`patches/echothink/0006-login-gate.patch`) is not a
prerequisite for T22, but T22 needs the completed T20 spec before it can align
device metadata and reset behavior with the login gate.

## T22 Work Not Started

No device identity design was authored in this blocked pass. In particular,
this task does not yet define:

- Local device identity fields.
- Windows DPAPI storage format for private key material.
- Profile preference versus Local State placement for non-secret metadata.
- Reset/logout behavior for device identity and enrollment.
- The native bridge boundary that keeps private key material out of extension
  JavaScript.

The broader construction and change-plan docs already identify DPAPI as the
intended Windows Alpha secure-storage target, but this T22 task has not
completed the Alpha device identity design because the T20 prerequisite is
incomplete.

No Chromium patch, extension code, backend service, gateway logic, network
stack, TLS validation, sandbox, renderer internals, downloads, history,
bookmarks, password manager, cookies, DevTools behavior, key material, token, or
proof internals were changed or exposed.

## Source Anchors Inspected

- `docs/ungoogled_to_echothink_browser_change_plan.md` section 5.9, which
  sketches device identity, DPAPI, metadata, reset, and private-key boundaries.
- `docs/echothink_browser_construction.md` sections 5.6 and 5.7, which define
  the high-level device identity and request-proof architecture.
- `docs/dag-doc.md`, which defines T22 prerequisites and delivery criteria.
- `docs/progress.md`, which marks T00 `DONE` and T20 `READY`.
- `docs/echothink-browser-alpha/t20-define-login-gate-local-state-and-allowlist.md`,
  which still records T20 as blocked and incomplete.
- `docs/echothink-browser-alpha/t11-add-first-run-shell.md`, which confirms
  T11 is done but explicitly leaves auth/device readiness and ongoing gate
  enforcement to T20/T21.

## Validation

Run from the inherited repository root.

| Command | Result |
|---|---|
| `rtk rg -n "^\\| T00 \\|[^|]*\\|[^|]*\\|[^|]*\\| DONE \\|" echothink-studio-new/docs/progress.md` | Passed: T00 is marked `DONE` in the status column. |
| `rtk rg -n "^\\| T20 \\|[^|]*\\|[^|]*\\|[^|]*\\| DONE \\|" echothink-studio-new/docs/progress.md` | Exited 1 as expected: T20 is not marked `DONE` in the status column. |
| `rtk rg -n "^\\| T20 \\|[^|]*\\|[^|]*\\|[^|]*\\| READY \\||Status: BLOCKED|No login-gate spec was authored" echothink-studio-new/docs/progress.md echothink-studio-new/docs/echothink-browser-alpha/t20-define-login-gate-local-state-and-allowlist.md` | Passed: T20 is only ready/incomplete in progress and still blocked in the task note. |
| `rtk rg -n "### T22: Define Device Identity And DPAPI Storage|Prerequisites: T00, T20|DPAPI" echothink-studio-new/docs/dag-doc.md echothink-studio-new/docs/ungoogled_to_echothink_browser_change_plan.md echothink-studio-new/docs/echothink_browser_construction.md` | Passed: T22 scope and DPAPI source anchors exist. |
| `rtk ls -l echothink-studio-new/docs/echothink-browser-alpha/t22-define-device-identity-and-dpapi-storage.md echothink-studio-new/docs/echothink-browser-alpha/t20-define-login-gate-local-state-and-allowlist.md echothink-studio-new/docs/progress.md` | Passed: the T22 note, T20 note, and shared progress file exist. |
| `rtk git diff --check` | Passed: no whitespace errors. |

## Known Limitations

- This note records a prerequisite blocker only; it is not the device identity
  design.
- T23 must not use this document as authorization to implement
  `patches/echothink/0007-device-identity.patch`.
- The broader browser Alpha docs were left unchanged because no T22 design
  decisions are complete yet.
