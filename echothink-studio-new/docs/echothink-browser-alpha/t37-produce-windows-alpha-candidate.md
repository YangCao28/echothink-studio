# T37 Produce Windows Alpha Candidate

Date: 2026-05-29
Wave: W14
Prerequisites: T33, T34, T35, T36
Delivery target: Alpha signed/tested candidate
Status: BLOCKED

## Prerequisite Check

T37 cannot produce the Windows Alpha candidate because all required validation
and smoke prerequisites are currently blocked.

| Prerequisite | Required report | Current status | Result |
|---|---|---|---|
| T33 - Run full patch validation | M7 patch validation report | BLOCKED | Blocks T37. The full inherited-plus-Echothink patch validation did not run because remaining required Alpha patches are missing. |
| T34 - Run native browser regression suite | M7 regression report | BLOCKED | Blocks T37. Native browser regression testing cannot start until T33 is `DONE`. |
| T35 - Run Echothink behavior tests | M7 behavior test report | BLOCKED | Blocks T37. Echothink behavior testing cannot start until T33 is `DONE`. |
| T36 - Run Windows packaging smoke test | M7 Windows smoke report | BLOCKED | Blocks T37. No Windows installer smoke pass exists because T35 is blocked. |

No progress row or task note accepts blocked T33, T34, T35, or T36 as an
acceptable baseline dependency for producing an Alpha candidate. Per the global
coordination rules, this task is recorded as blocked and no candidate is
manufactured.

## Blocking Work Required

The immediate missing browser-side artifacts remaining after T24 are the same
blockers recorded by T33 through T36:

| Missing task | Required artifact or decision | Exact file or decision needed |
|---|---|---|
| T26 | Request proof signing helper patch | Create `patches/echothink/0008-request-proof-helper.patch` and add `echothink/0008-request-proof-helper.patch` to `patches/series` when active. |
| T33 | Passing full patch validation | Rerun full patch validation against the complete ordered patch set and mark T33 `DONE`. |
| T34 | Passing native regression report | Run native Chromium regression coverage against a validated browser build and mark T34 `DONE`. |
| T35 | Passing Echothink behavior report | Run Echothink behavior tests against a validated browser build and mark T35 `DONE`. |
| T36 | Passing Windows packaging smoke report | Build, sign or test-sign, install, smoke, and uninstall a Windows Alpha package and mark T36 `DONE`. |

## Candidate Status

No Windows Alpha candidate exists from T37.

| Candidate field | T37 value |
|---|---|
| Candidate artifact | Not produced. |
| Signed installer | Not produced. |
| Installer SHA256 | Not available. |
| Channel metadata sidecar | Not produced. |
| Build timestamp | Not assigned because no candidate build was emitted. |
| Blocker report timestamp | `2026-05-29T10:02:13Z`. |
| Candidate channel intended by T30/T32 | `dev`. |
| Release phase intended by T30/T32 | `alpha`. |
| Expected future artifact pattern | `EchothinkBrowserSetup-Dev-x64-148.0.7778.178-alpha.<build>.exe`. |
| Expected future metadata sidecar | `EchothinkBrowserSetup-Dev-x64-148.0.7778.178-alpha.<build>.channel.json`. |
| Dev `app_update_id` | `e81ee626-9e29-52ac-ad5d-ff669f8e65b1`. |
| Dev `installer_product_id` | `21b7be8b-f85e-53f5-8e90-189d16d3b6d7`. |

## Source Trace At Blocker Time

| Field | Value |
|---|---|
| Chromium pin | `148.0.7778.178` from `chromium_version.txt`. |
| Repository revision marker | `1` from `revision.txt`. |
| Git HEAD after merging T24 before T37 docs edits | `7bba82a18a43e6a5c6551a582a900ca73a571ce3`. |
| Active Echothink patch count | `17`. |
| Active missing required Alpha patch IDs | `0008-request-proof-helper`. |

Active Echothink patch list from `patches/series`:

```text
echothink/0001-branding.patch
echothink/0002-default-policies-and-preferences.patch
echothink/0003-new-tab-and-first-run.patch
echothink/0004-bundled-workspace-extension.patch
echothink/0005-default-search-provider.patch
echothink/0011-first-run-gate-shell.patch
echothink/0006-login-gate.patch
echothink/0007-device-identity.patch
echothink/0009-echo-protocol-router.patch
echothink/0012-invalid-echo-route-fallback.patch
echothink/0010-windows-packaging-identity.patch
echothink/0014-side-panel-container.patch
echothink/0015-side-panel-mode-selector.patch
echothink/0017-workspace-context-shell.patch
echothink/0016-chat-panel-shell.patch
echothink/0018-side-panel-local-states.patch
echothink/0024-narrow-extension-bridge.patch
```

The required Alpha patch ID below is not active in `patches/series` and the
patch file is absent under `patches/echothink/`:

```text
echothink/0008-request-proof-helper.patch
```

## Attached Reports

These reports are attached as blocker evidence rather than passing release
attachments:

| Report | File | T37 use |
|---|---|---|
| Patch validation report | `docs/echothink-browser-alpha/t33-run-full-patch-validation.md` | Blocks candidate; full validation did not run. |
| Native browser regression report | `docs/echothink-browser-alpha/t34-run-native-browser-regression-suite.md` | Blocks candidate; native regression did not run. |
| Echothink behavior report | `docs/echothink-browser-alpha/t35-run-echothink-behavior-tests.md` | Blocks candidate; required behavior tests did not run. |
| Windows packaging smoke report | `docs/echothink-browser-alpha/t36-run-windows-packaging-smoke-test.md` | Blocks candidate; install/signing/smoke evidence does not exist. |

## Packaging Inputs Observed

The Windows Alpha Dev packaging inputs from earlier completed tasks are present,
but they are not sufficient to produce a candidate without T33 through T36.

| Input | Current observation |
|---|---|
| Windows identity patch | `patches/echothink/0010-windows-packaging-identity.patch` exists and contains `Echothink Browser Dev`, `EchothinkBrowserSetup`, `Echothink Browser Setup`, and `Software\Echothink\Browser Dev`. |
| App icon | `assets/icons/echothink.ico` exists. |
| Setup icon | `assets/installer/echothink-setup.ico` exists. |
| 256 px icon | `assets/icons/png/echothink-256.png` exists. |
| Bundled extension manifest | `extensions/echothink-workspace/manifest.json` parses as JSON. |
| T32 packaging contract | Records Dev Alpha artifact naming, channel sidecar metadata, signing workflow, smoke steps, and release checklist. |
| Local release output | No `release/`, `build/`, or `build/windows/` output directory exists in this worktree. |

## Validation

Commands were run from the canonical browser patch/config root, where
`patches/`, `assets/`, `extensions/`, `devutils/`, and
`echothink-studio-new/docs/` are present.

| Command | Result |
|---|---|
| `rtk rg -n "^\\| T(33|34|35|36|37) \\|" echothink-studio-new/docs/progress.md` | Passed for prerequisite discovery: T33, T34, T35, T36, and T37 are all `BLOCKED`. |
| `rtk rg -n "^\\| T(33|34|35|36|37) \\|" echothink-studio-new/docs/dag-doc.md` | Passed: T37 depends on T33, T34, T35, and T36 and targets `Alpha: signed/tested candidate`. |
| `rtk cat chromium_version.txt revision.txt` | Passed: Chromium pin `148.0.7778.178`; repository revision marker `1`. |
| `rtk git rev-parse HEAD` | Passed: observed T37 source base after T24 merge `7bba82a18a43e6a5c6551a582a900ca73a571ce3`. |
| `rtk rg -n "^echothink/" patches/series` | Passed: active Echothink patch list recorded above. |
| `rtk rg -c "^echothink/" patches/series` | Passed: active Echothink patch count is `17`. |
| `rtk ls -l patches/echothink/0006-login-gate.patch` | Passed: T21 login-gate patch exists. |
| `rtk rg -n "^echothink/0006-login-gate\\.patch$" patches/series` | Passed: T21 login-gate patch is active in `patches/series`. |
| `rtk ls -l patches/echothink/0007-device-identity.patch patches/echothink/0024-narrow-extension-bridge.patch` | Passed: T23 and T24 patch files exist. |
| `rtk rg -n "^echothink/0007-device-identity\\.patch$|^echothink/0024-narrow-extension-bridge\\.patch$" patches/series` | Passed: T23 and T24 patches are active in `patches/series`. |
| `rtk ls -l patches/echothink/0008-request-proof-helper.patch` | Failed as expected: the remaining required Alpha proof-helper patch file is absent. |
| `rtk rg -n "^echothink/0008-request-proof-helper\\.patch$" patches/series` | Exited 1 as expected: the missing proof-helper patch is not active in `patches/series`. |
| `rtk python3 devutils/check_patch_files.py` | Passed, exit 0, for the current incomplete patch series. |
| `rtk python3 devutils/check_gn_flags.py` | Passed, exit 0. |
| `rtk python3 devutils/validate_config.py` | Passed, exit 0, for the current incomplete patch series. |
| `rtk python3 -m json.tool extensions/echothink-workspace/manifest.json` | Passed: bundled extension manifest is valid JSON. |
| `rtk ls -l assets/icons/echothink.ico assets/installer/echothink-setup.ico assets/icons/png/echothink-256.png extensions/echothink-workspace/manifest.json patches/echothink/0010-windows-packaging-identity.patch` | Passed: packaging inputs exist. |
| `rtk rg -n "EchothinkBrowserSetup|Echothink Browser Dev|Software\\\\Echothink\\\\Browser Dev|Echothink Browser Setup" patches/echothink/0010-windows-packaging-identity.patch echothink-studio-new/docs/echothink-browser-alpha/t32-add-windows-build-signing-smoke-docs.md` | Passed: expected Windows Alpha Dev identity strings are present. |
| `rtk rg -n "EchothinkBrowserSetup-Dev-x64-148\\.0\\.7778\\.178-alpha|channel\\\": \\\"dev\\\"|release_phase\\\": \\\"alpha\\\"|app_update_id|installer_product_id" echothink-studio-new/docs/echothink-browser-alpha/t32-add-windows-build-signing-smoke-docs.md echothink-studio-new/docs/echothink-browser-alpha/t30-define-windows-app-identity-and-channels.md` | Passed: expected artifact naming and Dev Alpha metadata are documented. |
| `rtk ls -ld release build build/windows` | Failed as expected: no local release/build output exists. |

## Known Limitations

- This is a blocker candidate report, not a signed or tested Windows Alpha
  candidate.
- No Windows build, signing, installer packaging, install smoke, launch smoke,
  restart smoke, update-channel smoke, or uninstall smoke was run by T37.
- This macOS worktree is not a clean Windows release host and does not contain
  a local patched Chromium source checkout or a `mini_installer` output.
- Browser-side acceptance criteria remain open: full patch validation, native
  regression, Echothink behavior validation, and Windows packaging smoke.
- No backend services, gateway logic, search ranking, chat orchestration,
  workflow orchestration, business pages, network stack, TLS validation,
  sandbox, renderer internals, downloads, history, bookmarks, password manager,
  cookies, or DevTools behavior was changed.
