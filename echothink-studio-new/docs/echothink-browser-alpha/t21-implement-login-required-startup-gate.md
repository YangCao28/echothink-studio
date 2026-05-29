# T21 Implement Login-Required Startup Gate

Date: 2026-05-29
Wave: W5
Delivery target: M4 - `0006-login-gate.patch`
Status: BLOCKED

## Blocker

T21 depends on T20. T20 is not complete in the shared progress source and does
not yet provide the login-gate implementation spec that T21 is required to
consume.

Evidence:

- `docs/progress.md` marks T20 as `READY`, not `DONE`.
- The T20 progress row says the M4 login-gate spec is still pending and that
  T21 must not implement `patches/echothink/0006-login-gate.patch` until the
  spec exists.
- `docs/echothink-browser-alpha/t20-define-login-gate-local-state-and-allowlist.md`
  is still a blocker note, not the final T20 spec. It says no login-gate spec
  was authored and that T21 must not consume it as authorization to implement
  `0006-login-gate.patch`.

Because the coordination rules require prerequisites to be marked `DONE` or
explicitly documented as acceptable baseline dependencies, T21 cannot create or
activate `patches/echothink/0006-login-gate.patch` yet.

## Missing Prerequisite Work

Complete T20 before resuming T21. The T20 deliverable needs to define the exact
browser-side decisions that the login gate patch will implement:

- Local auth and device readiness flags, including storage surface, names,
  initial values, profile/local-state behavior, and reset behavior.
- The unauthenticated navigation allowlist, including exact schemes, origins,
  and paths for login, device enrollment, diagnostics, update, support, and
  download routes.
- Blocked-navigation behavior, including the local explanation page URL, when
  redirects occur, and which navigation types are in scope.
- Setup completion criteria and the browser-side signal that restores normal
  Chromium browsing.
- Known exceptions for `chrome://` pages, diagnostics, support, update, app
  mode, incognito, guest, and enterprise-managed startup surfaces.

Concrete files or decisions needed:

- Update
  `docs/echothink-browser-alpha/t20-define-login-gate-local-state-and-allowlist.md`
  from blocker note to final T20 spec, or create a replacement T20 spec and
  cross-link it.
- Update `docs/progress.md` so T20 is marked `DONE`, or explicitly document why
  T20 is an acceptable baseline dependency for T21 despite not being `DONE`.
- Resolve whether `chrome://echothink-diagnostics` is available for T21 or must
  remain an allowed-but-dead route until its owning task lands.

## T21 Work Not Started

No Chromium patch was created. In particular, this blocked pass did not:

- Create `patches/echothink/0006-login-gate.patch`.
- Add `echothink/0006-login-gate.patch` to `patches/series`.
- Add navigation throttles, WebUI pages, local-state preferences, readiness
  checks, or setup-completion logic.
- Change network stack, TLS validation, sandbox, renderer internals, downloads,
  history, bookmarks, password manager, cookies, DevTools, backend services,
  gateway logic, search ranking, chat orchestration, workflow orchestration, or
  business pages.

## Validation

Run from the inherited repository root.

| Command | Result |
|---|---|
| `rtk rg -n "\\| T20 \\|.*\\| DONE \\|" echothink-studio-new/docs/progress.md` | Failed as expected: T20 is not marked `DONE`. |
| `rtk rg -n "\\| T20 \\|.*READY|T21 must not implement|Still pending" echothink-studio-new/docs/progress.md` | Passed: progress records T20 as `READY` and says the T20 spec is still pending before T21 can implement `0006`. |
| `rtk rg -n "No login-gate spec was authored|T21 must not consume|0006-login-gate" echothink-studio-new/docs/echothink-browser-alpha/t20-define-login-gate-local-state-and-allowlist.md` | Passed: the T20 task note is a blocker note, not an implementation spec. |
| `rtk ls -l patches/echothink/0006-login-gate.patch` | Failed as expected: no blocked patch artifact was created. |
| `rtk rg -n "echothink/0006-login-gate.patch" patches/series` | Failed as expected: the inactive blocked patch is not listed in the active patch pipeline. |
| `rtk git diff --check -- echothink-studio-new/docs/progress.md echothink-studio-new/docs/echothink-browser-alpha/t21-implement-login-required-startup-gate.md` | Passed, exit 0. |

## Known Limitations

- This note records the prerequisite blocker only; it is not the T20 login-gate
  spec.
- Delivery criteria for T21 remain unmet until T20 is completed and
  `patches/echothink/0006-login-gate.patch` can be implemented and validated.
