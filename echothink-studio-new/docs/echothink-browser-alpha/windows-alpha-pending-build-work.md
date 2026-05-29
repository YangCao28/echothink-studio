# Windows Alpha — Pending Build Work

Date: 2026-05-29
Owner task: T37 (Produce Windows Alpha candidate); also unblocks T36 (Windows packaging smoke)
Status of repo work: COMPLETE — no repository change required to proceed.

## Purpose

Everything browser-side for the Windows Echothink Browser Alpha is done and
frozen. The only remaining work is **physical build/sign/smoke on a Windows
host**, which cannot run in the macOS worktree. This doc is the actionable
checklist for whoever runs it. The frozen specification lives in
`t37-produce-windows-alpha-candidate.md` ("Alpha Candidate Build Manifest").

## What is already DONE (do not redo)

- T33 full patch validation — DONE.
- T34 native browser regression — DONE.
- T35 Echothink behavior tests — DONE.
- T36 static packaging readiness — PASSED (live runtime smoke pending below).
- Patch set complete: 19 Echothink patches, all present, ordered, parse clean;
  `0008-request-proof-helper.patch` active at `patches/series` line 130.
- Validators clean: `check_patch_files.py`, `check_gn_flags.py`,
  `validate_config.py` all exit 0.
- Packaging assets present: `assets/icons/echothink.ico`,
  `assets/installer/echothink-setup.ico`, `assets/icons/png/echothink-256.png`.

## Frozen inputs (from the Candidate Build Manifest)

| Field | Value |
|---|---|
| Chromium pin | `148.0.7778.178` |
| Repo revision marker | `1` |
| Git HEAD (manifest freeze) | `7698c4186322cb2a6cdb0d8e6a05634d4d4d5c96` |
| Channel / phase / arch | `dev` / `alpha` / `x64` |
| Installer stem | `EchothinkBrowserSetup` |
| Signed artifact | `EchothinkBrowserSetup-Dev-x64-148.0.7778.178-alpha.<build>.exe` |
| Dev `app_update_id` | `e81ee626-9e29-52ac-ad5d-ff669f8e65b1` |
| Dev `installer_product_id` | `21b7be8b-f85e-53f5-8e90-189d16d3b6d7` |
| Registry root | `Software\Echothink\Browser Dev` |

## Pending work on Windows (ordered checklist)

### 1. Provision the build host
- [ ] Windows x64 host with depot_tools and Windows SDK; `signtool.exe` on `PATH`.
- [ ] Pristine Chromium `148.0.7778.178` source checkout.
- [ ] A code-signing certificate available to `signtool` (test-sign acceptable
      for Alpha if production cert is unavailable — record which was used).

### 2. Apply patches
- [ ] Apply the full `patches/series` (127 entries = 108 inherited + 19
      Echothink) to the checkout via the inherited build flow (`quilt push -a`
      or the repo's documented apply path).
- [ ] Resolve the inherited DEPS-parser `Str(...)` limitation (T03 #4 / T33) if
      it blocks the apply: extend the parser to accept `Str(...)`, or use a
      local checkout path that bypasses the remote DEPS fetch.

### 3. Build
- [ ] Stage GN args from `flags.gn`.
- [ ] `autoninja -C out\Default chrome mini_installer`.

### 4. Package + hash
- [ ] Rename `out\Default\mini_installer.exe` →
      `EchothinkBrowserSetup-Dev-x64-148.0.7778.178-alpha.<build>.exe`.
- [ ] Emit `…-alpha.<build>.unsigned.sha256.txt` (`Get-FileHash -Algorithm SHA256`).

### 5. Sign + verify
- [ ] `signtool sign /fd SHA256 /td SHA256 ...` the renamed installer.
- [ ] `signtool verify /pa /tw` — must pass.
- [ ] Emit `…-alpha.<build>.sha256.txt` for the signed installer.

### 6. Channel metadata
- [ ] Write `EchothinkBrowserSetup-Dev-x64-148.0.7778.178-alpha.<build>.channel.json`
      matching the contract in the Candidate Build Manifest (channel `dev`,
      phase `alpha`, the two Dev IDs above, pin `148.0.7778.178`).

### 7. Runtime smoke (completes T36)
On a clean Windows test machine:
- [ ] Install runs; Start Menu entry uses the Dev channel display name.
- [ ] Launch; About/version shows `Echothink Browser` + `Dev`, not `ungoogled-chromium`.
- [ ] New Tab route + first-run/login gate behave per T35.
- [ ] Side Panel opens; mode selection (Chat / Workspace Context) **persists
      across restart** (`chrome.storage.local echothink.sidePanel.mode`).
- [ ] Default search/suggest works.
- [ ] Uninstall removes the Dev channel app without touching other channels.
- [ ] Record installer path, signed SHA256, `signtool verify` output, and the
      Windows version into the T36 note; mark **T36 DONE**.

### 8. Close out T37
- [ ] Confirm signed installer + SHA256 + `.channel.json` + passing smoke exist
      and trace to the manifest (pin/rev/HEAD/patch list).
- [ ] Stamp the assigned `<build>` number and final SHA256 into the T37 note.
- [ ] Mark **T37 DONE** in `progress.md`.

## Known constraints carried into this work

- `<build>` number is assigned at build time; it is intentionally unset in the repo.
- Live full-stack `validate_patches.py` apply was never run in the worktree
  (inherited DEPS-parser limitation); the Windows apply step above is the first
  true full-stack application.
- If only test-signing is available for Alpha, record that explicitly — a
  production-signed candidate may be required before public distribution.
