# T37 Produce Windows Alpha Candidate

Date: 2026-05-29
Wave: W14
Prerequisites: T33, T34, T35, T36
Delivery target: Alpha: signed/tested candidate
Status: BLOCKED (build-host-bound only; all browser-side acceptance criteria closed)

> This note supersedes the earlier T37 blocker note. The earlier note claimed
> T33/T34/T35 were `BLOCKED` and that `0008-request-proof-helper.patch` was
> missing. **Both claims are now stale:** T33/T34/T35 are `DONE`, the proof
> helper patch exists and is active in `patches/series` (line 130), and the
> full ordered Echothink patch set is complete at 19 patches. The single
> remaining blocker is the physical Windows Chromium build host required to
> emit and sign the installer (this is exactly T36's live-runtime deliverable).

## Why this is BLOCKED and not DONE

The delivery target is a **signed/tested** Windows Alpha candidate — a real,
signed `EchothinkBrowserSetup-Dev-x64-148.0.7778.178-alpha.<build>.exe`, with a
verified signature, a SHA256, a `.channel.json` sidecar, and a passing install /
launch / restart / uninstall smoke.

That artifact **cannot be honestly produced in this worktree**:

- This is a macOS POSIX worktree, not a Windows release host.
- There is no local pristine Chromium `148.0.7778.178` source checkout.
- There is no Windows build toolchain (`autoninja`, `mini_installer`,
  `signtool.exe`) available here.
- No `release/`, `build/`, `build/windows/`, or `out/` output directory exists.

Producing a candidate `.exe` requires building `chrome` + `mini_installer` from
the patched source on Windows, then signing it. Marking DONE without that build
would fake the deliverable, which the coordination rules forbid. Therefore T37
is recorded as **BLOCKED** on the build host.

What is **not** blocking T37: every browser-side acceptance criterion is closed
(see prerequisite check below). The delivery criterion "No blocker browser-side
acceptance criteria remain open" is satisfied. This doc finalizes the candidate
specification so that, on a Windows build host, the candidate is produced
deterministically with **no further repository change required**.

## Prerequisite Check (current, corrected)

| Prerequisite | Report | Status | Effect on T37 |
|---|---|---|---|
| T33 — Run full patch validation | `docs/echothink-browser-alpha/t33-run-full-patch-validation.md` | DONE | Satisfied. 127 active series entries = 108 inherited + 19 Echothink, all Echothink entries strictly after inherited (0 out-of-order, 0 missing files, 0 orphans); all 19 Echothink patches parse via `git apply --numstat`; structural validators exit 0. |
| T34 — Run native browser regression suite | `docs/echothink-browser-alpha/t34-run-native-browser-regression-suite.md` | DONE | Satisfied. 0 of 39 touched files sit in any native primitive subsystem; Chromium-native ownership of tabs/windows/history/downloads/bookmarks/passwords/cookies/storage/TLS/DevTools/extension-loading preserved at source level; 0 native-primitive regressions. |
| T35 — Run Echothink behavior tests | `docs/echothink-browser-alpha/t35-run-echothink-behavior-tests.md` | DONE | Satisfied. All 10 required Alpha behaviors PASS at static/structural fidelity against the validated full patch set; proof allowlist mirror 20/20; extension JS `node --check` clean. |
| T36 — Run Windows packaging smoke test | `docs/echothink-browser-alpha/t36-run-windows-packaging-smoke-test.md` | BLOCKED (env only) | Static packaging-readiness dry run PASSED; **live** Windows build+sign+install+launch+restart+uninstall smoke NOT RUN because no Windows Chromium build host exists here. This is the same constraint that blocks T37's candidate emission. |

**Net:** browser-side acceptance criteria (T33, T34, T35) are all `DONE`. T36 is
blocked only on the Windows build host, not on any repo/browser-side gap. T37
inherits exactly that one environment-bound blocker.

## Alpha Candidate Build Manifest (finalized, ready to build)

This is the complete, frozen specification of the Windows Alpha candidate. On a
Windows Chromium build host running the T32 procedure, these inputs produce the
candidate deterministically.

### Source trace

| Field | Value | Source of truth |
|---|---|---|
| Product | Echothink Browser (Dev channel) | T30/T31/T32 |
| Chromium pin | `148.0.7778.178` | `chromium_version.txt` |
| Repository revision marker | `1` | `revision.txt` |
| Git HEAD at manifest freeze | `7698c4186322cb2a6cdb0d8e6a05634d4d4d5c96` | `git rev-parse HEAD` |
| Manifest freeze timestamp (UTC) | `2026-05-29T18:26:55Z` | `date -u` on this host |
| Base | Ungoogled Chromium patch/config tree (inherited series + Echothink series) | `patches/series` |
| Active series entries | `127` total = `108` inherited + `19` Echothink | `patches/series` |

### Channel / release metadata

| Field | Value |
|---|---|
| Channel (canonical) | `dev` |
| Channel display name | `Dev` |
| Release phase | `alpha` (a milestone, not a channel) |
| Architecture | `x64` |
| Installer technology | Chromium `mini_installer` (Alpha path only, per T32) |
| Installer stem | `EchothinkBrowserSetup` |
| Dev `app_update_id` | `e81ee626-9e29-52ac-ad5d-ff669f8e65b1` |
| Dev `installer_product_id` | `21b7be8b-f85e-53f5-8e90-189d16d3b6d7` |
| Windows registry root | `Software\Echothink\Browser Dev` |

### Artifact names (produced on the build host)

| Artifact | Pattern |
|---|---|
| Signed installer | `EchothinkBrowserSetup-Dev-x64-148.0.7778.178-alpha.<build>.exe` |
| Unsigned hash sidecar | `EchothinkBrowserSetup-Dev-x64-148.0.7778.178-alpha.<build>.unsigned.sha256.txt` |
| Signed hash sidecar | `EchothinkBrowserSetup-Dev-x64-148.0.7778.178-alpha.<build>.sha256.txt` |
| Channel metadata sidecar | `EchothinkBrowserSetup-Dev-x64-148.0.7778.178-alpha.<build>.channel.json` |

`<build>` is the incremental build number assigned at build time on the Windows
host; it is intentionally not fixed in this worktree because no build was run.

### Active Echothink patch list (exact apply order from `patches/series`)

Applied strictly after the 108 inherited patches (lines 113–131):

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
echothink/0008-request-proof-helper.patch
echothink/0019-proof-capable-extension-calls.patch
```

All 19 patch files are present under `patches/echothink/` and parse cleanly via
`git apply --numstat`. No required Alpha patch is missing.

### Packaging inputs present

| Input | Observation |
|---|---|
| Windows identity patch | `patches/echothink/0010-windows-packaging-identity.patch` carries `Echothink Browser Dev`, `EchothinkBrowserSetup`, `Echothink Browser Setup`, `Software\Echothink\Browser Dev`. |
| App icon | `assets/icons/echothink.ico` present. |
| Setup/installer icon | `assets/installer/echothink-setup.ico` present (staged into `mini_installer.ico`). |
| 256px PNG | `assets/icons/png/echothink-256.png` present. |
| Bundled extension manifest | `extensions/echothink-workspace/manifest.json` is valid JSON. |
| T32 build/sign/smoke procedure | Documented end-to-end (build → hash → sign → verify → `.channel.json` → install/launch/restart/uninstall smoke). |

## Channel metadata sidecar contract (`.channel.json`)

To be emitted alongside the signed installer (values frozen except `version`'s
build component and the build-time fields):

```json
{
  "product_name": "Echothink Browser",
  "installer_stem": "EchothinkBrowserSetup",
  "architecture": "x64",
  "channel": "dev",
  "channel_display_name": "Dev",
  "release_phase": "alpha",
  "chromium_version": "148.0.7778.178",
  "app_update_id": "e81ee626-9e29-52ac-ad5d-ff669f8e65b1",
  "installer_product_id": "21b7be8b-f85e-53f5-8e90-189d16d3b6d7"
}
```

## Attached validation reports

These are attached as **release evidence**. Three are passing browser-side
acceptance reports; the fourth is the static packaging-readiness pass plus the
explicitly-deferred live runtime smoke.

| Report | File | T37 use |
|---|---|---|
| Full patch validation (T33) | `docs/echothink-browser-alpha/t33-run-full-patch-validation.md` | PASS — series complete and ordered; structural parse + validators clean. |
| Native regression (T34) | `docs/echothink-browser-alpha/t34-run-native-browser-regression-suite.md` | PASS — no native-primitive regression; native ownership preserved. |
| Echothink behavior (T35) | `docs/echothink-browser-alpha/t35-run-echothink-behavior-tests.md` | PASS — all 10 required Alpha behaviors at static fidelity. |
| Windows packaging smoke (T36) | `docs/echothink-browser-alpha/t36-run-windows-packaging-smoke-test.md` | Static readiness PASS; live build+sign+install+smoke NOT RUN (no Windows build host). |

## The single remaining blocker (how to unblock)

Run the T32 build/sign/smoke procedure on a Windows Chromium build host:

1. Provision a Windows x64 build host with a pristine Chromium `148.0.7778.178`
   checkout, depot_tools, and the Windows SDK (`signtool.exe` on `PATH`).
2. Apply the inherited + Echothink `patches/series` (108 + 19 = 127 entries) to
   the checkout (e.g. via the inherited build flow / `quilt push -a`).
3. `autoninja -C out\Default chrome mini_installer`.
4. Rename `out\Default\mini_installer.exe` →
   `EchothinkBrowserSetup-Dev-x64-148.0.7778.178-alpha.<build>.exe`; emit the
   unsigned SHA256 sidecar.
5. Sign with `signtool sign /fd SHA256 /td SHA256 ...`; verify with
   `signtool verify /pa /tw`; emit the signed SHA256 sidecar.
6. Write the `.channel.json` sidecar (contract above).
7. Run the install / launch / New Tab / Side Panel restart-persistence / search
   / uninstall smoke (T36 live runtime). Record results, marking T36 `DONE`.
8. Mark T37 `DONE` once the signed installer, its SHA256, the `.channel.json`
   sidecar, and a passing smoke exist and are traceable to this manifest.

**No repository change is required to unblock** — the patch set, identity patch,
assets, channel IDs, and naming are all finalized in this worktree.

## Validation

Run from the canonical browser patch/config root (where `patches/`, `assets/`,
`extensions/`, `devutils/`, and `echothink-studio-new/docs/` are present).

| Command | Result |
|---|---|
| `cat chromium_version.txt` | `148.0.7778.178` (Chromium pin). |
| `cat revision.txt` | `1` (repository revision marker). |
| `git rev-parse HEAD` | `7698c4186322cb2a6cdb0d8e6a05634d4d4d5c96` (manifest source base). |
| `date -u +%Y-%m-%dT%H:%M:%SZ` | `2026-05-29T18:26:55Z` (manifest freeze time). |
| `grep -c "^echothink/" patches/series` | `19` active Echothink patches. |
| `grep -cvE '^\s*#\|^\s*$' patches/series` | `127` total active series entries (108 inherited + 19 Echothink). |
| `grep -n "^echothink/0008-request-proof-helper.patch$" patches/series` | Found at line 130 — proof helper patch now active (prior blocker resolved). |
| `ls patches/echothink/0008-request-proof-helper.patch` | Present (23751 bytes) — prior missing-file blocker resolved. |
| `for p in $(grep "^echothink/" patches/series); do git apply --numstat "patches/$p"; done` | All 19 Echothink patches parse cleanly (structural). |
| `python3 devutils/check_patch_files.py` | Exit 0. |
| `python3 devutils/check_gn_flags.py` | Exit 0. |
| `python3 devutils/validate_config.py` | Exit 0. |
| `python3 -m json.tool extensions/echothink-workspace/manifest.json` | Valid JSON (exit 0). |
| `ls assets/icons/echothink.ico assets/installer/echothink-setup.ico assets/icons/png/echothink-256.png` | All present. |
| `ls -ld release build build/windows out` | All absent — no local build output exists (candidate not buildable here). |

## Known Limitations

- This is a finalized **candidate build manifest + readiness gate**, not a
  signed/tested installer. No `.exe`, SHA256, or `.channel.json` was emitted
  because no Windows build ran.
- No Windows build, signing, installer packaging, or install/launch/restart/
  update-channel/uninstall smoke was run by T37 (environment-bound; macOS host,
  no Chromium `148.0.7778.178` checkout, no Windows toolchain).
- Live full-stack patch application (`validate_patches.py`) was not run here;
  the inherited DEPS parser (`Str(...)` vs `Var`) limitation documented in T03
  (#4) and T33 still applies and is an inherited-tooling issue, not an Echothink
  patch defect.
- `<build>` number is unassigned until build time on the Windows host.

## Deferred work

The actionable Windows-host checklist is recorded separately at
`docs/echothink-browser-alpha/windows-alpha-pending-build-work.md`.

- Execute the T32 build/sign/smoke procedure on a Windows host to emit and sign
  the candidate and complete the live smoke (unblocks T36 and T37).
- Extend the inherited DEPS parser to support `Str(...)` (or run
  `validate_patches.py --local` against a clean checkout) for a live full-stack
  apply pass.
- Stamp the assigned `<build>` number, final installer SHA256, and signing
  certificate details into the candidate record once produced.

## Out of scope (unchanged by this task)

No backend services, gateway logic, search ranking, chat orchestration, workflow
orchestration, business pages, network stack, TLS validation, sandbox, renderer
internals, downloads, history, bookmarks, password manager, cookies, or DevTools
behavior was changed. This task is browser-repository documentation/packaging
work only.
