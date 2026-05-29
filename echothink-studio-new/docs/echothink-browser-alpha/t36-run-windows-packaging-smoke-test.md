# T36 Run Windows Packaging Smoke Test

Date: 2026-05-29
Wave: W13
Prerequisites: T31, T32, T35
Delivery target: M7 Windows smoke report
Status: BLOCKED

## Prerequisite Check

T36 cannot run the Windows packaging smoke test because one required
prerequisite is not complete.

`echothink-studio-new/docs/progress.md` currently marks:

| Prerequisite | Status | Result |
|---|---|---|
| T31 - Implement Windows packaging identity patch | DONE | Acceptable. The active patch `patches/echothink/0010-windows-packaging-identity.patch` exists. |
| T32 - Add Windows build, signing, update-channel, and smoke-test documentation | DONE | Acceptable. The Windows Alpha runbook and smoke procedure exist. |
| T35 - Run Echothink behavior tests | BLOCKED | Blocks T36. No validated behavior test pass exists for the Alpha candidate. |

T35 is blocked because T33 is blocked, and T33 is blocked by missing required
Alpha browser artifacts:

| Missing task | Missing artifact |
|---|---|
| T23 - Implement device key generation and storage | `patches/echothink/0007-device-identity.patch` |
| T26 - Implement proof signing helper | `patches/echothink/0008-request-proof-helper.patch` |

No progress row or task note accepts incomplete T35 as an acceptable baseline
dependency for T36. Per the task coordination rules, T36 is recorded as blocked
rather than marking install, launch, restart, or uninstall as passed.

## Smoke Test Status

No clean Windows install smoke was run for this task.

| Required smoke item | T36 result | Notes |
|---|---|---|
| Install browser on a clean Windows machine | BLOCKED | No validated Alpha installer candidate is available after T35. |
| Launch from Start Menu | BLOCKED | Requires a successful install. |
| Verify application name and icon | BLOCKED | T31/T32 define expected names and asset staging, but no installed Windows app was available to inspect. |
| Verify New Tab route | BLOCKED | T35 did not produce a behavior pass for New Tab under a validated Alpha candidate. |
| Verify Side Panel opens and mode persists after restart | BLOCKED | T35 did not produce a behavior pass; restart persistence cannot be smoked without an installed candidate. |
| Verify default search | BLOCKED | T35 did not produce a behavior pass for search under a validated Alpha candidate. |
| Verify uninstall path | BLOCKED | Requires a successful install. |
| Record install/update-channel/signing observations | BLOCKED | T32 defines expected signing and `.channel.json` evidence, but no signed installer was produced or installed here. |

## Expected Windows Alpha Values

These are the values the future T36 rerun should verify against the actual
installed Windows candidate:

| Surface | Expected Alpha Dev value |
|---|---|
| Installer artifact | `EchothinkBrowserSetup-Dev-x64-148.0.7778.178-alpha.<build>.exe` |
| Signed installer description | `Echothink Browser Setup` |
| Start Menu / shell name | `Echothink Browser Dev` |
| App/product name | `Echothink Browser` |
| Install path | `%LOCALAPPDATA%\Echothink\Browser Dev\Application` for per-user install |
| Registry roots | `Software\Echothink\Browser Dev` |
| Version/About channel label | `Echothink Browser Dev` |
| Setup icon source | `assets/installer/echothink-setup.ico` |
| App icon source | `assets/icons/echothink.ico` |
| New Tab route | `https://app.echothink.ai/newtab` after any expected setup gate |
| Search URL | `https://search.echothink.ai/search?q={searchTerms}` |
| Suggest URL | `https://search.echothink.ai/suggest?q={searchTerms}` when suggestions are enabled |
| Bundled Side Panel extension ID | `lokdibgfmiemhdoogailbfpdggndpolk` |
| Side Panel persisted mode key | `echothink.sidePanel.mode` |
| Update metadata sidecar | `EchothinkBrowserSetup-Dev-x64-148.0.7778.178-alpha.<build>.channel.json` |
| Update channel | `dev` |
| Release phase | `alpha` |
| Dev `app_update_id` | `e81ee626-9e29-52ac-ad5d-ff669f8e65b1` |
| Dev `installer_product_id` | `21b7be8b-f85e-53f5-8e90-189d16d3b6d7` |

## Required Evidence For Rerun

When T35 is complete and a Windows Alpha candidate exists, rerun T36 on a clean
Windows VM or clean Windows user profile and attach or record:

- Windows version and machine/profile cleanliness notes.
- Installer path, file version info, SHA256, and `signtool verify /pa /tw`
  result.
- `.channel.json` sidecar contents and hash evidence.
- Install transcript or notes, including whether install is per-user or
  system-wide.
- Start Menu, taskbar/window, Apps & Features, and `chrome://version` identity
  observations.
- New Tab URL after first-run/setup gate behavior.
- Side Panel extension presence, open path, selected mode before restart, and
  selected mode after restart.
- Omnibox search destination URL and suggestion-provider observation.
- Uninstall path used and post-uninstall file/shortcut observations.
- Any blocking packaging issue, especially unsigned binaries, wrong icons,
  wrong names, missing channel metadata, install overwrite behavior, or failed
  uninstall cleanup.

## Validation

Commands were run from the canonical browser patch/config root, where
`patches/`, `assets/`, `devutils/`, and `echothink-studio-new/docs/` are
present.

| Command | Result |
|---|---|
| `rtk rg -n "^\\| T(31|32|35) \\|" echothink-studio-new/docs/progress.md` | Passed for prerequisite discovery: T31 and T32 are `DONE`; T35 is `BLOCKED`. |
| `rtk rg -n "^Status: BLOCKED|T33 is blocked|0008-request-proof-helper" echothink-studio-new/docs/echothink-browser-alpha/t35-run-echothink-behavior-tests.md` | Passed: T35 records the remaining blocking missing artifact. |
| `rtk ls -l patches/echothink/0006-login-gate.patch` | Passed: T21 login-gate patch exists. |
| `rtk rg -n "echothink/0006-login-gate.patch" patches/series` | Passed: T21 login-gate patch is active in the patch pipeline. |
| `rtk ls -l patches/echothink/0007-device-identity.patch` | Passed: T23 device identity patch exists. |
| `rtk ls -l patches/echothink/0008-request-proof-helper.patch` | Failed as expected: the remaining required proof helper patch is missing. |
| `rtk ls -l patches/echothink/0010-windows-packaging-identity.patch assets/icons/echothink.ico assets/installer/echothink-setup.ico` | Passed: T31 patch and T06/T32 icon inputs exist. |
| `rtk rg -n "Echothink Browser Dev|EchothinkBrowserSetup|Software\\\\Echothink\\\\Browser Dev" patches/echothink/0010-windows-packaging-identity.patch` | Passed: Windows Alpha Dev identity strings are present in the packaging patch. |
| `rtk rg -n "Smoke Test Procedure|Launch and branding|New Tab|Side Panel|Search|Restart persistence|Update-channel metadata|Uninstall" echothink-studio-new/docs/echothink-browser-alpha/t32-add-windows-build-signing-smoke-docs.md` | Passed: T32 contains the Windows smoke procedure T36 should run after unblock. |

## Known Limitations

- This is a blocker smoke report, not a passing M7 Windows smoke report.
- This environment is not a clean Windows machine and has no built or signed
  `EchothinkBrowserSetup` installer, so install, launch, restart, and uninstall
  were not runnable here.
- T36 remains blocked until T35 is `DONE` or explicitly accepted as a baseline
  dependency by a future task owner.
- No backend services, gateway logic, search ranking, chat orchestration,
  workflow orchestration, business pages, network stack, TLS validation,
  sandbox, renderer internals, downloads, history, bookmarks, password manager,
  cookies, or DevTools behavior was changed.
