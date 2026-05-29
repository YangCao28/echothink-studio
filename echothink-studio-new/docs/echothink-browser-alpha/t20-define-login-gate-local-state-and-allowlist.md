# T20 Define Login Gate Local State And Allowlist

Status: BLOCKED
Date: 2026-05-29

## Blocker

T20 depends on T10 and T11. T10 is marked `DONE` in
`docs/progress.md`, but T11 is not marked `DONE` and is not explicitly
documented as an acceptable baseline dependency for T20.

Because the coordination rules require all prerequisites to be complete or
explicitly accepted before starting T20, this task cannot define the
authoritative login-gate local state, unauthenticated allowlist, blocked
navigation behavior, setup unlock criteria, or diagnostics/support exceptions
yet.

## Prerequisite Check

| Prerequisite | Required by | Status | Evidence |
|---|---|---|---|
| T10 - Implement New Tab route and fallback | T20 | DONE | `docs/progress.md` marks T10 `DONE`; `patches/echothink/0003-new-tab-and-first-run.patch` exists and is listed in `patches/series`. |
| T11 - Add first-run shell | T20 | BLOCKED | `docs/dag-doc.md` defines T11, but `docs/progress.md` has no T11 row or notes section, and no `docs/echothink-browser-alpha/t11-add-first-run-shell.md` task note exists. |

## Missing Prerequisite Work

Resolve T11 before resuming T20 by doing one of the following:

- Complete T11 and add a progress row plus task note, expected at
  `docs/echothink-browser-alpha/t11-add-first-run-shell.md` unless another
  existing doc is selected.
- Or explicitly document in `docs/progress.md` that T11 is satisfied by the
  first-run work already delivered in T10, with source anchors and validation.

The T11 evidence should confirm these concrete decisions:

- The first-run gate shell target is `chrome://echothink-first-run`.
- First launch opens that shell before normal browsing.
- The shell leads only to login, device enrollment, diagnostics, update, and
  support/download routes.
- The shell contains no protected workspace data and no business workflow
  logic.
- The status of the `chrome://echothink-diagnostics` link is accepted or
  assigned before it is treated as an allowlisted diagnostics route.

Concrete files to use when resolving T11:

- `patches/echothink/0003-new-tab-and-first-run.patch`
- `patches/series`
- `docs/echothink-browser-alpha/t10-implement-new-tab-route-and-fallback.md`
- `docs/dag-doc.md`
- `docs/progress.md`

## T20 Work Not Started

No login-gate spec was authored in this blocked pass. In particular, this task
does not yet define:

- Local auth/device readiness flags.
- The final unauthenticated navigation allowlist.
- Blocked-navigation behavior.
- Setup completion criteria for unlocking normal browsing.
- Diagnostics and support exceptions.

No Chromium patch, extension code, backend service, gateway logic, network
stack behavior, TLS validation, sandbox, renderer internals, downloads,
history, bookmarks, password manager, cookies, or DevTools behavior was
changed.

## Validation

| Command | Result |
|---|---|
| `rtk rg -n "\\| T10 \\|.*DONE" docs/progress.md` | Passed: T10 is marked `DONE`. |
| `rtk rg -n "\\| T11 \\|" docs/progress.md` | Failed as expected: no T11 progress row exists. |
| `rtk rg -n "### T11: Add First-Run Shell|### T20: Define Login Gate State And Allowlist" docs/dag-doc.md` | Passed: the DAG defines T11 and T20, and T20 depends on T10 and T11. |
| `rtk rg -n "echothink/0003-new-tab-and-first-run.patch" ../patches/series` | Passed: the T10 patch is active in the inherited patch series. |
| `rtk rg -n "echothink-first-run|auth.echothink.ai|device/enroll|echothink-diagnostics|updates.echothink.ai|download-browser" ../patches/echothink/0003-new-tab-and-first-run.patch` | Passed: the T10 patch contains concrete first-run shell anchors that T11 can either validate or explicitly adopt. |

## Known Limitations

- This note records a prerequisite blocker only; it is not the login-gate spec.
- T21 must not consume this document as authorization to implement
  `patches/echothink/0006-login-gate.patch`.
- The broader browser Alpha docs were left unchanged because no T20 decisions
  are complete yet.
