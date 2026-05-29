# T32 Add Windows Build Signing Smoke Docs

Date: 2026-05-29
Wave: W5
Prerequisites: T30, T31
Delivery target: M7 Windows Alpha release docs
Status: DONE

## Prerequisite Check

T32 depends on T30 and T31. `echothink-studio-new/docs/progress.md` marks both
prerequisites as `DONE`:

- T30 defines the Windows application identity, channel labels, installer stem,
  update-channel metadata contract, and Alpha/Beta branding tradeoff.
- T31 creates the active Windows Alpha Dev identity patch at
  `patches/echothink/0010-windows-packaging-identity.patch`.

The canonical-root mismatch recorded by T00 still applies. Planning docs live
under `echothink-studio-new/docs`, while the inherited browser patch/config
tree, `patches/`, `assets/`, `utils/`, and `devutils/` live one directory up at
the canonical browser build root:

```text
C:\Users\caoya\source\repos\echothink-studio
```

This task creates documentation only under `docs/`. It does not add build
scripts, installer services, updater services, backend release endpoints,
network-stack changes, TLS changes, sandbox changes, renderer changes, download
manager changes, history changes, bookmark changes, password manager changes,
cookie changes, or DevTools changes.

## Alpha Packaging Decision

Windows Alpha uses the T30 `dev` update track and the T31 Alpha Dev packaging
identity:

| Surface | Alpha Dev value |
|---|---|
| Product display name | `Echothink Browser` |
| Windows shell/app display name | `Echothink Browser Dev` |
| Installer stem | `EchothinkBrowserSetup` |
| Installer display name | `Echothink Browser Setup` |
| Install path components | `%LOCALAPPDATA%\Echothink\Browser Dev\Application` for per-user installs |
| Registry roots | `Software\Echothink\Browser Dev` |
| Version/About channel label | `Echothink Browser Dev` |
| Chromium version | `148.0.7778.178` |

The Alpha installer technology is Chromium `mini_installer`. The distributable
artifact is the signed `mini_installer.exe` output renamed with the
`EchothinkBrowserSetup` stem:

```text
EchothinkBrowserSetup-Dev-x64-148.0.7778.178-alpha.<build>.exe
```

MSI/WiX, NSIS, Inno, final public installer UI bitmaps, and a replacement
auto-updater are out of scope for T32. They remain Beta/release-pipeline work
unless a later task explicitly selects one of those installer technologies.

## Required Inputs

Run the build from the canonical browser build root, not from
`echothink-studio-new`:

```powershell
$Repo = "C:\Users\caoya\source\repos\echothink-studio"
Set-Location $Repo
```

Required local inputs:

| Path | Purpose |
|---|---|
| `chromium_version.txt` | Pinned Chromium version, currently `148.0.7778.178`. |
| `downloads.ini` | Chromium source archive download definition. |
| `pruning.list` | Binary pruning manifest. |
| `patches/series` | Active inherited plus Echothink patch order. |
| `patches/echothink/0010-windows-packaging-identity.patch` | T31 Windows Alpha Dev packaging identity patch. |
| `flags.gn` | Base GN flags inherited from the patch/config repository. |
| `assets/icons/echothink.ico` | App/taskbar/shortcut icon source. |
| `assets/installer/echothink-setup.ico` | `EchothinkBrowserSetup` executable icon source. |
| `echothink-studio-new/docs/echothink-browser-alpha/t30-define-windows-app-identity-and-channels.md` | Channel and metadata source of truth. |
| `echothink-studio-new/docs/echothink-browser-alpha/t31-implement-windows-packaging-identity-patch.md` | Packaging patch source of truth. |

Required Windows host tools:

- Windows x64 host with enough disk and RAM for a Chromium build.
- Visual Studio C++ toolchain and Windows SDK compatible with the pinned
  Chromium branch.
- `depot_tools` on `PATH`, providing `gn`, `ninja` or `autoninja`, and Chromium
  helper tooling.
- Python 3 available as `py -3` or `python`.
- 7-Zip available as `7z` or discoverable by the inherited download unpacker.
- GNU `patch` available on `PATH` or passed to `utils\patches.py --patch-bin`.
- Windows SDK `signtool.exe` on `PATH` for signing and verification.

## Build Procedure

Open a Developer PowerShell or a shell initialized by the Visual Studio build
environment, then run:

```powershell
$Repo = "C:\Users\caoya\source\repos\echothink-studio"
$ChromiumVersion = (Get-Content "$Repo\chromium_version.txt").Trim()
$BuildNumber = "1"
$Channel = "dev"
$Arch = "x64"
$ArtifactBase = "EchothinkBrowserSetup-Dev-$Arch-$ChromiumVersion-alpha.$BuildNumber"
$BuildRoot = Join-Path $Repo "build"
$Cache = Join-Path $BuildRoot "download_cache"
$Src = Join-Path $BuildRoot "src"
$Out = Join-Path $Src "out\Default"

Set-Location $Repo
py -3 devutils\check_downloads_ini.py -d downloads.ini
py -3 devutils\check_patch_files.py
py -3 devutils\check_gn_flags.py
py -3 devutils\validate_config.py
```

Prepare Chromium source:

```powershell
New-Item -ItemType Directory -Force $Cache | Out-Null
py -3 utils\downloads.py retrieve -c $Cache -i downloads.ini
py -3 utils\downloads.py unpack -c $Cache -i downloads.ini $Src
py -3 utils\prune_binaries.py $Src pruning.list
py -3 utils\patches.py apply $Src patches
py -3 utils\domain_substitution.py apply `
  -r domain_regex.list `
  -f domain_substitution.list `
  -c (Join-Path $BuildRoot "domsubcache.tar.gz") `
  $Src
```

Stage Windows branding assets before `gn gen` and before building
`mini_installer`:

```powershell
Copy-Item `
  "$Repo\assets\installer\echothink-setup.ico" `
  "$Src\chrome\installer\mini_installer\mini_installer.ico" `
  -Force

$AppIconTargets = @(
  "chrome\app\theme\chromium\win\chromium.ico",
  "chrome\app\theme\chromium\product_logo_16.png",
  "chrome\app\theme\chromium\product_logo_24.png",
  "chrome\app\theme\chromium\product_logo_32.png",
  "chrome\app\theme\chromium\product_logo_48.png",
  "chrome\app\theme\chromium\product_logo_64.png",
  "chrome\app\theme\chromium\product_logo_128.png",
  "chrome\app\theme\chromium\product_logo_256.png"
)

foreach ($Target in $AppIconTargets) {
  $FullTarget = Join-Path $Src $Target
  if (Test-Path $FullTarget) {
    if ($Target.EndsWith(".ico")) {
      Copy-Item "$Repo\assets\icons\echothink.ico" $FullTarget -Force
    } else {
      $Size = [regex]::Match($Target, "product_logo_(\d+)\.png").Groups[1].Value
      Copy-Item "$Repo\assets\icons\png\echothink-$Size.png" $FullTarget -Force
    }
  }
}
```

If a pinned Chromium source checkout moves the app icon resource paths, record
the observed paths in the release checklist before producing an Alpha candidate.
Do not silently ship a candidate with Chromium shell/taskbar icons.

Generate and build:

```powershell
New-Item -ItemType Directory -Force $Out | Out-Null
Copy-Item "$Repo\flags.gn" "$Out\args.gn" -Force
$GnArgs = @"
is_debug=false
is_component_build=false
target_cpu="x64"
symbol_level=1
"@
Add-Content "$Out\args.gn" $GnArgs

Push-Location $Src
gn gen out\Default --fail-on-unused-args
autoninja -C out\Default chrome mini_installer
Pop-Location
```

If `autoninja` is not available, use `ninja -C out\Default chrome
mini_installer` from `$Src`.

## Package Layout

Create a release staging directory outside the source tree's committed files:

```powershell
$ReleaseDir = Join-Path $Repo "release\windows\dev\$ArtifactBase"
New-Item -ItemType Directory -Force $ReleaseDir | Out-Null

$UnsignedInstaller = Join-Path $ReleaseDir "$ArtifactBase.unsigned.exe"
Copy-Item "$Out\mini_installer.exe" $UnsignedInstaller -Force
Get-FileHash $UnsignedInstaller -Algorithm SHA256 |
  Format-List |
  Out-File (Join-Path $ReleaseDir "$ArtifactBase.unsigned.sha256.txt")
```

The release directory is a local output only. Do not commit it.

## Signing Workflow

Signing inputs must come from the release host or secure signing service, not
from the repository:

```powershell
$CertThumbprint = $env:ECHOTHINK_SIGNING_CERT_THUMBPRINT
$TimestampUrl = $env:ECHOTHINK_TIMESTAMP_URL
if (-not $TimestampUrl) {
  $TimestampUrl = "http://timestamp.digicert.com"
}
```

Minimum internal Alpha signing signs the installer artifact:

```powershell
$SignedInstaller = Join-Path $ReleaseDir "$ArtifactBase.exe"
Copy-Item $UnsignedInstaller $SignedInstaller -Force

signtool sign `
  /fd SHA256 `
  /tr $TimestampUrl `
  /td SHA256 `
  /sha1 $CertThumbprint `
  /d "Echothink Browser Setup" `
  /du "https://app.echothink.ai/download-browser?platform=win&channel=dev" `
  $SignedInstaller

signtool verify /pa /tw $SignedInstaller
Get-FileHash $SignedInstaller -Algorithm SHA256 |
  Format-List |
  Out-File (Join-Path $ReleaseDir "$ArtifactBase.sha256.txt")
```

Public or wider-distribution candidates must also sign the installed runtime
binaries inside the installer package or a staging package before installer
assembly. At minimum verify the installed `chrome.exe`, `chrome_proxy.exe`, and
any installed `setup.exe` with `signtool verify /pa /tw`. If runtime signing is
not wired yet, mark the candidate internal-only and record the limitation in
the release checklist.

Never commit certificates, private keys, PFX files, signing passwords, or
hardware-token PINs. Test-signed installers may be used for internal smoke
testing only and must include `test-signed` in the staging directory name and
release notes.

## Update-Channel Notes

Alpha does not add an updater implementation. It does require a sidecar channel
metadata file beside the signed installer so release automation, diagnostics,
and later updater work use the same canonical values from T30.

Write this file as:

```text
EchothinkBrowserSetup-Dev-x64-148.0.7778.178-alpha.<build>.channel.json
```

Required Alpha Dev metadata:

```json
{
  "product_name": "Echothink Browser",
  "installer_stem": "EchothinkBrowserSetup",
  "platform": "win",
  "architecture": "x64",
  "channel": "dev",
  "channel_display_name": "Dev",
  "release_phase": "alpha",
  "chromium_version": "148.0.7778.178",
  "update_track": "dev",
  "update_manifest_url": "https://updates.echothink.ai/windows/dev/update.xml",
  "download_url": "https://app.echothink.ai/download-browser?platform=win&channel=dev",
  "app_update_id": "e81ee626-9e29-52ac-ad5d-ff669f8e65b1",
  "installer_product_id": "21b7be8b-f85e-53f5-8e90-189d16d3b6d7",
  "allow_side_by_side": true,
  "icon_source": "assets/icons/echothink.ico",
  "setup_icon_source": "assets/installer/echothink-setup.ico",
  "initial_preferences_source": "chrome/browser/resources/echothink/initial_preferences.json",
  "bookmarks_source": "chrome/browser/resources/echothink/echothink_bookmarks.html"
}
```

Reserved per-channel IDs for later side-by-side/update work:

| Channel | `app_update_id` | `installer_product_id` |
|---|---|---|
| `canary` | `b15a26f6-00c2-50a9-bc24-422fa06781d5` | `3748a5ab-2e09-5933-862b-07c73c56ee04` |
| `dev` | `e81ee626-9e29-52ac-ad5d-ff669f8e65b1` | `21b7be8b-f85e-53f5-8e90-189d16d3b6d7` |
| `beta` | `b8444d38-cb31-5681-af49-8851bcbd2fd6` | `628a1674-963b-5997-92c1-98afcd5c0d5e` |
| `stable` | `be7453d0-4bc3-58b0-b5e3-234f2b0e4223` | `a20856d8-5ce1-5ae8-92d8-0ae87632ef41` |
| `enterprise-stable` | `d4c7506c-24b4-583d-8a36-0cf7955bbb4f` | `2669fdaf-c390-511b-8d1d-43b9daaa9cb0` |

These IDs are release metadata identifiers. They are not a security boundary and
do not replace signed installers, signed update metadata, or backend rollout
authorization.

## Smoke Test Procedure

Run smoke testing on a clean Windows VM or clean Windows user profile. Capture
the installer path, SHA256, signing verification output, Windows version, and
browser `chrome://version` output with the release checklist.

1. Pre-install checks:

   ```powershell
   signtool verify /pa /tw $SignedInstaller
   Get-FileHash $SignedInstaller -Algorithm SHA256
   (Get-Item $SignedInstaller).VersionInfo | Format-List
   ```

   Pass criteria: filename starts with `EchothinkBrowserSetup-Dev-x64`, file
   description says `Echothink Browser Setup`, signature chains to the expected
   publisher for release candidates, and the installer icon is the Echothink
   setup icon.

2. Install:

   ```powershell
   Start-Process -FilePath $SignedInstaller -Wait
   ```

   Pass criteria: install completes without crash, creates the Dev-channel app
   under the expected Echothink install path, and does not overwrite another
   channel.

3. Launch and branding:

   Launch `Echothink Browser Dev` from the Start Menu. Open `chrome://version`.

   Pass criteria: Start Menu and window/taskbar surfaces show `Echothink Browser
   Dev`; `chrome://version` shows `Echothink Browser Dev`; Apps & Features
   lists publisher `Echothink`; app and taskbar icons are Echothink assets.

4. New Tab:

   On a fresh profile, first launch may show `chrome://echothink-first-run`.
   Open a new tab after the first-run shell is visible or after completing the
   setup path available in that build.

   Pass criteria: a normal New Tab routes to
   `https://app.echothink.ai/newtab`, or an authenticated/gated build records
   the expected gate and then routes to that URL after setup.

5. Side Panel:

   Open `chrome://extensions` and confirm bundled extension ID
   `lokdibgfmiemhdoogailbfpdggndpolk` is present. Open the Side Panel through
   the toolbar/action path available in the current build.

   Pass criteria: the Echothink Workspace Side Panel opens, uses the bundled
   extension, and shows only the expected Alpha shell or local setup/error state.
   If T14/T15 are not yet present in the candidate, record Side Panel as blocked
   by missing task IDs rather than passing it.

6. Search:

   Search for `echothink alpha smoke test` from the omnibox.

   Pass criteria: navigation uses
   `https://search.echothink.ai/search?q=echothink+alpha+smoke+test` or the
   correctly URL-encoded equivalent. Search suggestions remain disabled unless
   deliberately enabled, and enabling suggestions uses
   `https://search.echothink.ai/suggest?q={searchTerms}`.

7. Restart persistence:

   If Side Panel modes are available, switch to `workspace_context`. Close every
   browser window and launch `Echothink Browser Dev` again.

   Pass criteria: browser relaunches with the same Windows identity, New Tab and
   search defaults remain Echothink routes, and Side Panel mode persists when
   the mode-selector tasks are included in the candidate.

8. Update-channel metadata:

   Verify the release directory includes the `.channel.json` sidecar and that
   it declares `"channel": "dev"`, `"release_phase": "alpha"`, and the Dev
   `app_update_id`/`installer_product_id` values above. If an installed metadata
   location is added by a later task, verify that location too.

9. Uninstall:

   Uninstall `Echothink Browser Dev` from Apps & Features or Control Panel.

   Pass criteria: uninstall completes without crash, removes the channel-specific
   application files and Start Menu shortcut, leaves other channels untouched,
   and any retained user profile data is documented as Chromium-native behavior.

## Alpha Candidate Release Checklist

Use this checklist before handing a Windows Alpha candidate to T36/T37:

| Gate | Required evidence |
|---|---|
| Prerequisites | T30 and T31 are `DONE` in `echothink-studio-new/docs/progress.md`. |
| Source pin | `chromium_version.txt` is `148.0.7778.178`; repo commit hash recorded. |
| Patch order | `patches/series` has all Echothink entries after inherited patches and includes `echothink/0010-windows-packaging-identity.patch`. |
| Patch validation | `devutils\check_patch_files.py`, `check_gn_flags.py`, and `validate_config.py` pass on the release host. |
| Build | `chrome` and `mini_installer` build from the patched source. |
| Branding assets | `echothink-setup.ico` is staged into `mini_installer.ico`; app icon resource paths are confirmed and staged. |
| Artifact name | Signed artifact uses `EchothinkBrowserSetup-Dev-x64-148.0.7778.178-alpha.<build>.exe`. |
| Signing | `signtool verify /pa /tw` passes for the installer; runtime binary signing status recorded. |
| Metadata | `.channel.json` exists, matches the Dev Alpha metadata contract, and hash files are generated. |
| Smoke | Launch, branding, New Tab, Side Panel, search, restart, and uninstall are run and results attached. |
| Limitations | Missing task dependencies, unsigned runtime binaries, updater gaps, or icon-path gaps are explicitly recorded. |

## Known Limitations

- This environment is not Windows and has no local Chromium source checkout, so
  T32 could not run a real Windows build, installer signing, install, launch, or
  uninstall smoke test.
- T32 selects Chromium `mini_installer` as the Alpha path only. Public Beta may
  replace or wrap it with MSI/WiX, NSIS, Inno, or a dedicated release pipeline.
- The T31 patch implements Alpha Dev identity but not a full multi-channel
  install-mode matrix. The per-channel IDs above are reserved release metadata
  for later implementation.
- App icon source paths must be verified against the patched Chromium checkout
  during the first real Windows build. Shipping with Chromium shell/taskbar
  icons is not acceptable for an Alpha candidate unless explicitly marked as a
  blocker.
- Update URLs and download URLs are route contracts only. No update service or
  updater trust chain is implemented by this docs task.

## Validation

Validation for T32 is documentation and path based:

- Confirmed `echothink-studio-new/docs/progress.md` marks T30 and T31 `DONE`.
- Confirmed T30/T31 task notes exist under `docs/echothink-browser-alpha/`.
- Confirmed required build anchors exist in the canonical build root:
  `downloads.ini`, `flags.gn`, `patches/series`,
  `patches/echothink/0010-windows-packaging-identity.patch`,
  `assets/icons/echothink.ico`, and
  `assets/installer/echothink-setup.ico`.
- Confirmed this runbook records Windows build, package, signing,
  update-channel metadata, smoke test, restart, uninstall, and Alpha candidate
  checklist steps.
