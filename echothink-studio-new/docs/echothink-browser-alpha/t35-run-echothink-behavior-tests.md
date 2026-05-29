# T35 Run Echothink Behavior Tests

Date: 2026-05-29
Wave: W12
Prerequisites: T33
Delivery target: M7 behavior test report
Status: BLOCKED

## Blocker

T35 cannot run the Echothink behavior test pass because its direct prerequisite,
T33, is not complete.

`docs/progress.md` marks T33 as `BLOCKED`, and
`docs/echothink-browser-alpha/t33-run-full-patch-validation.md` explicitly says
T34, T35, and T37 must remain blocked on T33 until T23 and T26 are complete.
No progress entry or task note accepts incomplete T33 as an
acceptable baseline dependency for T35.

The missing prerequisite artifacts are:

| Missing task | Missing artifact | Why it blocks T35 behavior testing |
|---|---|---|
| T23 - Implement device key generation and storage | `patches/echothink/0007-device-identity.patch` | T35 must verify device identity persistence, but the device identity patch does not exist. |
| T26 - Implement proof signing helper | `patches/echothink/0008-request-proof-helper.patch` | T35 must verify proof helper allowlist signing, but the proof helper patch does not exist. |

Because the required Alpha patch set is incomplete and T33 did not validate the
full inherited-plus-Echothink patch application, there is no validated Alpha
browser candidate for the M7 behavior test pass.

## Behavior Test Status

| Behavior | T35 result | Notes |
|---|---|---|
| Echothink branding | Not run | T05/T31 exist, but T35 is blocked until the complete Alpha patch set is validated by T33. |
| New Tab route and fallback | Not run | T08/T10 exist, but runtime behavior was not retested under a validated full Alpha build. |
| Default search and suggest route | Not run | T19 exists, but runtime behavior was not retested under a validated full Alpha build. |
| Side Panel opens | Not run | T13/T14 exist, but runtime behavior was not retested under a validated full Alpha build. |
| Chat and Workspace Context modes | Not run | T15/T16/T17/T18 exist, but runtime behavior was not retested under a validated full Alpha build. |
| Chat scope metadata | Not run | T16 source work exists, but runtime request metadata was not retested under a validated full Alpha build. |
| Login gate and allowlist behavior | Not run | T21 now provides `0006-login-gate.patch`, but runtime behavior was not tested because T33 is blocked and no validated full Alpha build exists. |
| Device identity persistence | BLOCKED | T23 is `BLOCKED`; no `0007-device-identity.patch` exists. |
| Proof helper signs only allowed Echothink URLs | BLOCKED | T26 is `BLOCKED`; no `0008-request-proof-helper.patch` exists. |
| Optional `echo://` routes | Not run | T28/T29 exist, but runtime behavior was not retested under a validated full Alpha build. |

No deferred behavior is marked non-blocking in this T35 pass. Device identity
and proof helper behaviors are required Alpha browser behaviors, so T35 remains
blocked rather than partially passing.

## Missing Prerequisite Work

Complete and rerun T33 before resuming T35.

T33 cannot complete until:

- T22 is finalized as the M5 device identity design in
  `docs/echothink-browser-alpha/t22-define-device-identity-and-dpapi-storage.md`.
- T23 creates `patches/echothink/0007-device-identity.patch` and activates it
  in `patches/series`.
- T24 delivers the narrow extension bridge task note and implementation
  artifact at `docs/echothink-browser-alpha/t24-implement-narrow-extension-bridge.md`
  and any required active patch or `patches/series` entry.
- T25 is finalized as the M5 proof helper spec in
  `docs/echothink-browser-alpha/t25-define-request-proof-payload-and-allowlist.md`.
- T26 creates `patches/echothink/0008-request-proof-helper.patch` and activates
  it in `patches/series`.
- `docs/progress.md` marks those prerequisite tasks and T33 as `DONE`, or
  explicitly documents an acceptable baseline dependency for T35.

Only after that can T35 run the behavior pass against a validated browser
candidate and record pass/fail results for the required Alpha behaviors.

## Validation

Commands were run from the canonical browser patch/config root, where
`patches/`, `devutils/`, and `echothink-studio-new/docs/` are present.

| Command | Result |
|---|---|
| `rtk rg -n "^\\| T33 \\|[^|]*\\|[^|]*\\|[^|]*\\| DONE \\|" echothink-studio-new/docs/progress.md` | Exited 1 as expected: T33 is not marked `DONE`. |
| `rtk rg -n "^\\| T33 \\|[^|]*\\|[^|]*\\|[^|]*\\| BLOCKED \\|" echothink-studio-new/docs/progress.md` | Passed: progress marks T33 `BLOCKED`. |
| `rtk rg -n "T34, T35, and T37 must remain blocked on T33|Status: BLOCKED" echothink-studio-new/docs/echothink-browser-alpha/t33-run-full-patch-validation.md` | Passed: the T33 task note blocks T35. |
| `rtk ls -l patches/echothink/0006-login-gate.patch` | Passed: T21 login-gate patch exists. |
| `rtk rg -n "echothink/0006-login-gate.patch" patches/series` | Passed: T21 login-gate patch is active in the patch pipeline. |
| `rtk ls -l patches/echothink/0007-device-identity.patch patches/echothink/0008-request-proof-helper.patch` | Failed as expected: the required device identity and proof helper patches are missing. |
| `rtk rg -n "echothink/0007-device-identity.patch|echothink/0008-request-proof-helper.patch" patches/series` | Exited 1 as expected: inactive missing patches are not listed in the active patch pipeline. |
| `rtk ls -l echothink-studio-new/docs/echothink-browser-alpha/t35-run-echothink-behavior-tests.md echothink-studio-new/docs/progress.md` | Passed: the T35 note and shared progress file exist. |
| `rtk git diff --check` | Passed: no whitespace errors. |
| `rtk rg -n "[[:blank:]]$" echothink-studio-new/docs/progress.md echothink-studio-new/docs/echothink-browser-alpha/t35-run-echothink-behavior-tests.md` | Exited 1 as expected: no trailing whitespace in the changed docs. |

## Known Limitations

- This is a blocker report, not the final M7 behavior test report.
- No browser runtime behavior tests were run because T33 is blocked and no
  validated full Alpha browser candidate exists in this environment.
- No backend services, gateway logic, search ranking, chat orchestration,
  workflow orchestration, business pages, network stack, TLS validation,
  sandbox, renderer internals, downloads, history, bookmarks, password manager,
  cookies, or DevTools behavior was changed.
