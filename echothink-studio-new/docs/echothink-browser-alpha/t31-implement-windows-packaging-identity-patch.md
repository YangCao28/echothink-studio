# T31 Implement Windows Packaging Identity Patch

Date: 2026-05-29
Wave: W4
Prerequisites: T30
Delivery target: M7 `patches/echothink/0010-windows-packaging-identity.patch`
Status: DONE

## Prerequisite Check

T31 depends on T30. `docs/progress.md` marks T30 as `DONE`, and the T30 spec
defines the Windows application name, installer stem, channel IDs, Alpha/Beta
tradeoff, and update-channel metadata contract.

The canonical-root mismatch recorded by T00 still applies. Planning docs live
under `echothink-studio-new/docs`; the inherited browser patch/config tree,
`patches/`, and `assets/` live one directory up at the canonical build root.
T31 follows that split:

- Patch artifact: `patches/echothink/0010-windows-packaging-identity.patch`
- Active patch ordering: `patches/series`
- Task documentation: `echothink-studio-new/docs/echothink-browser-alpha/`

## Implementation

Created the active Echothink-owned Windows packaging patch:

```text
patches/echothink/0010-windows-packaging-identity.patch
```

The patch is ordered at the Echothink tail after
`echothink/0005-default-search-provider.patch` in `patches/series`.

The patch implements the Alpha default as the T30 `dev` track. User-visible
Windows identity surfaces become:

| Surface | Alpha Dev value |
|---|---|
| Product display name | `Echothink Browser` |
| Windows shell/app display name | `Echothink Browser Dev` |
| Install path components | `Echothink\\Browser Dev\\Application` |
| Non-Google installer registry roots | `Software\\Echothink\\Browser Dev` |
| Installer description/name | `Echothink Browser Setup` |
| Installer artifact stem | `EchothinkBrowserSetup` |
| Version/About build label | `Echothink Browser Dev` |
| Start Menu apps folder string | `Echothink` |

## Native Source Touchpoints

`0010-windows-packaging-identity.patch` touches these Chromium source paths:

| Path | Change |
|---|---|
| `chrome/app/theme/chromium/BRANDING` | Sets `COMPANY_*` to `Echothink`, product name to `Echothink Browser`, installer full name to `Echothink Browser Setup`, and installer short name to `EchothinkBrowserSetup`. Keeps Chromium copyright text intact. |
| `chrome/app/chromium_strings.grd` | Changes the app shortcut folder string from `Chromium Apps` to `Echothink`. |
| `chrome/install_static/chromium_install_modes.h` | Sets Windows install path company/product pieces, base app name, base app ID, ProgID prefixes/descriptions, and direct launch scheme for Alpha Dev. |
| `chrome/installer/mini_installer/mini_installer_constants.cc` | Moves non-Google installer registry roots from `Software\\Chromium` to `Software\\Echothink\\Browser Dev`. |
| `chrome/installer/mini_installer/mini_installer.rc` | Documents that Windows packaging replaces the checked-in Chromium mini-installer icon with `assets/installer/echothink-setup.ico` before building `EchothinkBrowserSetup`. |
| `components/version_ui_strings.grdp` | Supersedes the inherited `ungoogled-chromium` build suffix with `Echothink Browser Dev` for official and developer builds. |

## Asset Wiring

The T06 assets required by T30 were verified locally:

- `assets/icons/echothink.ico`
- `assets/installer/echothink-setup.ico`

The patch does not embed binary icon deltas. The inherited patch pipeline is a
text unified-diff pipeline, and `patch -p1` is not appropriate for checked-in
binary icon replacement. T31 therefore records the icon source in the
mini-installer resource script and leaves the actual copy/replacement step to
T32 Windows packaging documentation and build glue.

## Deliberate Alpha Limits

T31 avoids risky executable and internal renames for Alpha:

- Does not rename `chrome.exe`, `chrome_proxy.exe`, `setup.exe`, or
  `mini_installer.exe`.
- Does not change sandbox IDs, COM GUIDs, app container SID prefix, installer
  update mechanics, network stack, TLS validation, renderer internals,
  downloads, history, bookmarks, password manager, cookies, or DevTools.
- Does not allocate final per-channel app/update IDs. T32 still owns final
  side-by-side packaging IDs and build/signing/update docs.

## Validation

Run from the canonical browser build root:

| Command | Result |
|---|---|
| `rtk ls -l patches/echothink/0010-windows-packaging-identity.patch assets/icons/echothink.ico assets/installer/echothink-setup.ico` | Passed: patch and required T06 icon assets exist. |
| `rtk rg -n "echothink/0010-windows-packaging-identity.patch" patches/series` | Passed: active series entry present at the Echothink tail. |
| `rtk rg -n "Echothink Browser Dev|EchothinkBrowserSetup|Browser Dev|Software\\\\Echothink" patches/echothink/0010-windows-packaging-identity.patch` | Passed: patch contains the expected app, installer, channel, and registry identity strings. |
| `rtk git apply --numstat patches/echothink/0010-windows-packaging-identity.patch` | Passed: patch parses cleanly; six source files touched. |
| `rtk python3 devutils/check_patch_files.py` | Passed, exit 0. |
| `rtk python3 devutils/check_gn_flags.py` | Passed, exit 0. |
| `rtk python3 devutils/validate_config.py` | Passed, exit 0. |

Patch application command for a real Chromium source checkout:

```bash
patch -p1 < patches/echothink/0010-windows-packaging-identity.patch
```

Run that from the pinned Chromium `148.0.7778.178` source root after inherited
patches and earlier active Echothink patches have applied.

## Known Limitations

- No local Chromium source checkout exists in this environment, so a real
  `patch -p1` application and Windows compile were not run.
- No Windows installer was built or run, so Start Menu, taskbar, Apps &
  Features, UAC version-resource, and uninstall smoke checks remain T32/T36.
- The patch exposes Alpha's `dev` channel in version UI. Machine-readable
  update/package channel metadata and full Canary/Beta/Stable/Enterprise Stable
  side-by-side install modes remain a Beta/release-pipeline follow-up after T32
  allocates final app/update IDs.
