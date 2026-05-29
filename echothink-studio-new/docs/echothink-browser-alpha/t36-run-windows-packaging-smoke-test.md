# T36 Run Windows Packaging Smoke Test

Date: 2026-05-29
Wave: W13
Prerequisites: T31, T32, T35
Delivery target: M7 Windows smoke report
Status: BLOCKED (live runtime smoke not runnable in this environment; all
browser-repository prerequisites and packaging inputs are DONE and validated)

## Summary Of Change Since The Previous T36 Note

The earlier version of this note recorded T36 as `BLOCKED` because prerequisite
T35 was blocked and the required `patches/echothink/0008-request-proof-helper.patch`
was missing. **Both of those blockers are now resolved.** This note supersedes
the stale prerequisite-gap reasoning:

- T26 produced `patches/echothink/0008-request-proof-helper.patch`; it exists and
  is active in `patches/series` (line 130).
- T33 (full patch validation), T34 (native regression), and T35 (Echothink
  behavior tests) are all now `DONE`.
- T31 and T32 remain `DONE`.

So **all three direct prerequisites (T31, T32, T35) are DONE**, and the Alpha
browser-side artifact set the smoke test depends on is complete and validated.

T36 is nevertheless still recorded `BLOCKED`, but the reason is now narrow and
accurate: **the defining deliverable of T36 is a live runtime Windows packaging
smoke test (install a built, signed browser on a clean Windows machine; launch
from Start Menu; verify name/icon; verify New Tab, Side Panel, restart
persistence, search; uninstall). That live test requires a built and signed
`EchothinkBrowserSetup` installer running on a Windows host. Neither exists in
this environment**, which is macOS (`darwin`) with no Chromium
`148.0.7778.178` source checkout and no Windows Chromium build toolchain. There
is therefore nothing to install, launch, or uninstall, and the runtime pass/fail
results cannot be honestly produced here.

This is an environment/build-artifact constraint, **not** a prerequisite gap and
**not** a missing browser-repository artifact. Per the task rule "do not fake
completion," the runtime smoke items are recorded as NOT RUN rather than PASS.

## Prerequisite Check

`echothink-studio-new/docs/progress.md` currently marks:

| Prerequisite | Status | Result |
|---|---|---|
| T31 - Implement Windows packaging identity patch | DONE | Acceptable. `patches/echothink/0010-windows-packaging-identity.patch` exists and is active in `patches/series`. |
| T32 - Add Windows build/signing/smoke docs | DONE | Acceptable. The Windows Alpha runbook + smoke procedure exist (`t32-add-windows-build-signing-smoke-docs.md`). |
| T35 - Run Echothink behavior tests | DONE | Acceptable. All 10 required Alpha behaviors PASS at static/structural fidelity; T33 (its blocker) is DONE. |

All prerequisites are DONE. No prerequisite blocks T36.

## What Was Validated Here (Static Packaging-Readiness / Dry-Run Smoke)

Because the live runtime smoke is not runnable, this task ran the largest
relevant validation the local (non-Windows, no-build) environment allows:
verifying that every input the T32 smoke procedure consumes is present, named
correctly, ordered correctly, and internally consistent with the T30/T31/T32
contract. This is a packaging-readiness dry run, **not** a runtime pass.

| Readiness check | Result | Evidence |
|---|---|---|
| Chromium pin matches contract (`148.0.7778.178`) | PASS | `chromium_version.txt` = `148.0.7778.178`; `revision.txt` = `1`. |
| Windows packaging identity patch present | PASS | `patches/echothink/0010-windows-packaging-identity.patch` exists (7.8K). |
| Packaging identity strings match T30/T32 spec | PASS | Patch carries `Echothink Browser Dev` (shell/app + version labels), `PRODUCT_INSTALLER_FULLNAME=Echothink Browser Setup`, `PRODUCT_INSTALLER_SHORTNAME=EchothinkBrowserSetup`, install path component `Browser Dev`, registry roots `Software\Echothink\Browser Dev`. |
| App icon source present | PASS | `assets/icons/echothink.ico` (29.4K) + full PNG set `assets/icons/png/echothink-{16,20,24,32,40,48,64,128,256}.png`. |
| Setup icon source present | PASS | `assets/installer/echothink-setup.ico` (29.4K). |
| Proof-helper prerequisite artifact present (prior blocker) | PASS | `patches/echothink/0008-request-proof-helper.patch` exists (23.2K) and is active in series (line 130). |
| Device-identity prerequisite artifact present | PASS | `patches/echothink/0007-device-identity.patch` exists (27.3K), active (line 120). |
| Series ordering: Echothink after inherited | PASS | 127 active entries = 108 inherited + 19 Echothink; first Echothink entry at line 113; 0 out-of-order. |
| All 19 Echothink patches parse | PASS | `git apply --numstat` clean for all 19 (0 parse failures). |
| Patch-file validator | PASS | `devutils/check_patch_files.py` exit 0. |
| GN flag validator | PASS | `devutils/check_gn_flags.py` exit 0. |
| Config validator | PASS | `devutils/validate_config.py` exit 0. |
| Channel metadata contract documented | PASS | T32 `.channel.json` contract present: `channel=dev`, `release_phase=alpha`, Dev `app_update_id=e81ee626-9e29-52ac-ad5d-ff669f8e65b1`, `installer_product_id=21b7be8b-f85e-53f5-8e90-189d16d3b6d7`. |
| Bundled Side Panel extension ID consistent | PASS | `lokdibgfmiemhdoogailbfpdggndpolk` referenced by T13/T24 patches and T32 smoke step 5. |
| Smoke procedure exists and is complete | PASS | T32 §"Smoke Test Procedure" covers pre-install, install, launch/branding, New Tab, Side Panel, search, restart persistence, channel metadata, uninstall. |

Conclusion of the dry run: the Windows Alpha Dev packaging inputs are **ready**
for a real build host to produce and smoke-test a candidate. No packaging input
is missing, mis-named, mis-ordered, or inconsistent.

## Live Runtime Smoke Status (NOT RUN)

These items are the actual T36 deliverable and require a built, signed installer
on a clean Windows host. They were **not executed** here. They are not blocked by
any prerequisite or missing browser-repository artifact — only by the absence of
a Windows build/installer in this macOS no-build environment.

| Required smoke item | T36 result | Reason |
|---|---|---|
| Install browser on a clean Windows machine | NOT RUN | No built/signed `EchothinkBrowserSetup` installer exists; environment is macOS with no Chromium build toolchain. |
| Launch from Start Menu | NOT RUN | Requires a successful install. |
| Verify application name and icon | NOT RUN | Expected values validated statically (above); no installed Windows app to inspect. |
| Verify New Tab route | NOT RUN | Route validated statically via patches `0002`/`0003`; no runtime browser to navigate. |
| Verify Side Panel opens and mode persists after restart | NOT RUN | Behavior validated statically via patches `0014`/`0015`; OS-restart persistence needs a running install. |
| Verify default search | NOT RUN | Search/suggest URLs validated statically via patch `0005`; no runtime omnibox. |
| Verify uninstall path | NOT RUN | Requires a successful install. |
| Record install/update-channel/signing observations | NOT RUN | `.channel.json` contract validated statically; no signed installer produced or installed here. |

## Exact Requirement To Unblock

T36's live smoke is unblocked the moment a build artifact exists:

1. A Windows x64 host with the Chromium build toolchain (Visual Studio C++ +
   Windows SDK, `depot_tools` providing `gn`/`ninja`/`autoninja`, Python 3,
   7-Zip, GNU `patch`, and `signtool.exe`) — exactly the host T32 §"Required
   Inputs" lists.
2. Run the T32 build procedure from the canonical browser build root to produce
   and (test-)sign
   `EchothinkBrowserSetup-Dev-x64-148.0.7778.178-alpha.<build>.exe` plus its
   `.channel.json` sidecar.
3. Run the T32 §"Smoke Test Procedure" steps 1-9 on a clean Windows VM/profile
   and record the evidence listed below.

No further browser-repository code, patch, asset, or doc change is required to
unblock; the blocker is solely the build/host environment. In a real release
flow the candidate build is produced by the build pipeline (the same path T37
finalizes); this environment cannot run that pipeline.

## Expected Windows Alpha Values (Verify At Rerun)

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

Rerun T36 on a clean Windows VM or clean Windows user profile and attach or
record:

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
`patches/`, `assets/`, `devutils/`, and `echothink-studio-new/docs/` are present.

| Command | Result |
|---|---|
| `cat chromium_version.txt revision.txt` | Passed: pin `148.0.7778.178`, revision `1`. |
| `ls patches/echothink/0010-windows-packaging-identity.patch patches/echothink/0008-request-proof-helper.patch patches/echothink/0007-device-identity.patch` | Passed: all present (prior blocker `0008` now exists). |
| `grep -E "Echothink Browser Dev\|EchothinkBrowserSetup\|Software\\\\Echothink\\\\Browser Dev\|Echothink Browser Setup" patches/echothink/0010-windows-packaging-identity.patch` | Passed: Alpha Dev identity strings present and consistent with T30/T32. |
| `ls assets/icons/echothink.ico assets/installer/echothink-setup.ico assets/icons/png/` | Passed: app icon, setup icon, and full PNG size set present. |
| `grep -c` non-comment series entries + first-echothink boundary | Passed: 127 active = 108 inherited + 19 Echothink; first Echothink at line 113; ordering correct. |
| `git apply --numstat` over all 19 Echothink patches | Passed: 19/19 parse clean, 0 failures. |
| `python3 devutils/check_patch_files.py` | Passed, exit 0. |
| `python3 devutils/check_gn_flags.py` | Passed, exit 0. |
| `python3 devutils/validate_config.py` | Passed, exit 0. |
| Live build / install / launch / restart / uninstall smoke | NOT RUN: macOS host, no Chromium `148.0.7778.178` checkout, no Windows build toolchain, no signed installer (see "Live Runtime Smoke Status"). |

## Known Limitations

- This is a packaging-readiness (dry-run) report plus an honest NOT-RUN record
  for the live runtime smoke. It is not a passing live M7 Windows smoke report.
- This environment is not a clean Windows machine and has no built or signed
  `EchothinkBrowserSetup` installer, so install, launch, restart, and uninstall
  were not runnable here.
- All browser-repository prerequisites (T31, T32, T35) are `DONE`; the remaining
  blocker is solely the absence of a Windows build artifact and Windows host. The
  same hard environment limitation was documented by T03, T32, T33, T34, and T35.
- No backend services, gateway logic, search ranking, chat orchestration,
  workflow orchestration, business pages, network stack, TLS validation,
  sandbox, renderer internals, downloads, history, bookmarks, password manager,
  cookies, or DevTools behavior was changed by this task.
