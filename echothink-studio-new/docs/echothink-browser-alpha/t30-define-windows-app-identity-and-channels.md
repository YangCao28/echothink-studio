# T30 Define Windows App Identity And Channels

Date: 2026-05-28
Wave: W3
Prerequisites: T05, T06
Delivery target: M7 Windows packaging spec
Status: DONE

## Prerequisite Check

T30 depends on T05 and T06. `docs/progress.md` marks both prerequisites as
`DONE`:

- T05 created `patches/echothink/0001-branding.patch`, which sets the
  user-visible browser product strings to `Echothink Browser` and deliberately
  deferred Windows executable, installer, Start Menu, uninstall, and channel
  identity to T30/T31.
- T06 created the Echothink visual asset bundle at the inherited canonical build
  root under `assets/`, including `assets/icons/echothink.ico` and
  `assets/installer/echothink-setup.ico`.

The canonical-root mismatch recorded by T00 still applies. Planning docs live
under `echothink-studio-new/docs`, while the inherited Ungoogled Chromium
patch/config tree and build assets live one directory up. This task is a
documentation/spec task only and changes no browser patch or installer code.

## Scope

This spec defines Windows packaging identity for the browser repository. It does
not implement installer technology, update services, backend release endpoints,
gateway logic, business pages, or a Windows packaging patch. T31 owns the native
Windows identity patch, and T32 owns build, signing, update, and smoke-test
documentation.

## Windows Application Identity

Base product identity is:

| Surface | Required value |
|---|---|
| Product display name | `Echothink Browser` |
| Windows application display name | `Echothink Browser` |
| Stable Start Menu shortcut | `Echothink Browser` |
| Stable desktop shortcut, if created | `Echothink Browser` |
| Stable Apps & Features / uninstall display name | `Echothink Browser` |
| Start Menu folder | `Echothink` |
| Installer executable/name stem | `EchothinkBrowserSetup` |
| Installer display name | `Echothink Browser Setup` |
| Publisher/company display name | `Echothink` |

Non-Stable channels append the channel label to user-visible shell surfaces so
parallel installs and support reports are unambiguous. Stable keeps the base
product name in shortcuts and uninstall UI, while still exposing its channel in
About/version and update metadata.

Recommended install locations for Beta and later:

```text
Per-user:    %LOCALAPPDATA%\Echothink\Browser\Application
System-wide: %ProgramFiles%\Echothink\Browser\Application
```

Alpha may use a Chromium-derived internal executable name such as `chrome.exe`
if changing it creates unnecessary patch risk. That exception does not apply to
user-visible Windows shell names, installer branding, or icon identity.

## Installer Naming

The installer filename must keep the stem `EchothinkBrowserSetup`.

Channel and architecture suffixes are allowed for distribution artifacts:

| Channel | x64 installer artifact |
|---|---|
| Canary | `EchothinkBrowserSetup-Canary-x64.exe` |
| Dev | `EchothinkBrowserSetup-Dev-x64.exe` |
| Beta | `EchothinkBrowserSetup-Beta-x64.exe` |
| Stable | `EchothinkBrowserSetup-Stable-x64.exe` |
| Enterprise Stable | `EchothinkBrowserSetup-EnterpriseStable-x64.exe` |

If a release process emits a generic latest installer, it may also publish
`EchothinkBrowserSetup.exe` as an alias for the currently recommended channel.
The signed installer binary's file description should read
`Echothink Browser Setup`.

## Channel Names And Labels

`Alpha` is not a release channel. It is the current implementation milestone.
Alpha builds should use the `dev` update track by default, or `canary` for
short-lived experimental packaging tests.

| Channel ID | Display label | Windows display name | Start Menu shortcut | Update track | Side-by-side expectation |
|---|---|---|---|---|---|
| `canary` | `Canary` | `Echothink Browser Canary` | `Echothink Browser Canary` | `canary` | May install beside all other channels. |
| `dev` | `Dev` | `Echothink Browser Dev` | `Echothink Browser Dev` | `dev` | May install beside Beta and Stable. |
| `beta` | `Beta` | `Echothink Browser Beta` | `Echothink Browser Beta` | `beta` | May install beside Stable. |
| `stable` | `Stable` | `Echothink Browser` | `Echothink Browser` | `stable` | Replaces/updates only Stable. |
| `enterprise-stable` | `Enterprise Stable` | `Echothink Browser Enterprise Stable` | `Echothink Browser Enterprise Stable` | `enterprise-stable` | Enterprise-managed track; may install beside consumer Stable only if T32 allocates distinct app/update IDs. |

Channel labels must be visible in About/version surfaces for every non-Stable
channel. Stable should still expose `Stable` in machine-readable update metadata
and diagnostic output.

## Alpha Versus Beta Branding Tradeoff

Alpha requirements:

- Browser-visible product strings must say `Echothink Browser` via T05.
- Windows Start Menu, uninstall, shortcut, and installer UI specs are fixed to
  the names in this document.
- App and setup icons must use T06 assets:
  `assets/icons/echothink.ico` and `assets/installer/echothink-setup.ico`.
- Installer artifact names must use the `EchothinkBrowserSetup` stem.
- Channel metadata must be present in package metadata and diagnostic/version
  surfaces, even if the update service is still a route contract.
- `chrome.exe`, Chromium-derived install-mode internals, and other low-level
  identifiers may remain unchanged if changing them would increase Alpha patch
  risk.
- Installer banner/dialog bitmaps are optional until the installer technology is
  selected by T32.

Beta requirements:

- All user-visible Windows shell surfaces must be Echothink-branded, including
  Start Menu, taskbar, desktop shortcut if present, Apps & Features, uninstall
  UI, installer UI, UAC/file description, and icon resources.
- Channel-specific packages must have distinct app/update IDs, uninstall keys,
  install directories where needed, and update tracks so Beta cannot overwrite
  Stable unexpectedly.
- Non-Stable channels must include the channel label in the display name.
- Public installer assets must include final banner/dialog artwork sized for the
  selected installer technology.
- `chrome://version` or equivalent diagnostics must not append
  `ungoogled-chromium` as the product/channel label. Chromium and Ungoogled
  Chromium attribution remains in credits, licenses, docs, and About copy.
- Update metadata must be signed or delivered through the release mechanism
  chosen by T32 before public Beta.

This tradeoff keeps Alpha patch scope narrow while making the Beta bar explicit:
public builds must look and update like Echothink Browser, not like a renamed
local Chromium test build.

## Update-Channel Metadata Contract

Windows packaging should emit or carry a channel metadata record with these
fields. The exact file location is owned by T32, but the values below are the
contract T31/T32 should implement.

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
  "app_update_id": "<stable per-channel ID allocated by T32>",
  "installer_product_id": "<stable per-channel installer ID allocated by T32>",
  "allow_side_by_side": true,
  "icon_source": "assets/icons/echothink.ico",
  "setup_icon_source": "assets/installer/echothink-setup.ico",
  "initial_preferences_source": "chrome/browser/resources/echothink/initial_preferences.json",
  "bookmarks_source": "chrome/browser/resources/echothink/echothink_bookmarks.html"
}
```

Packaging must stamp the canonical `channel` value into browser-local metadata
used later by device identity and diagnostics. The change plan already defines
`browser_channel` as a local device metadata field; T23/T31/T32 should use the
same canonical channel IDs from this document.

Update metadata is advisory for browser routing and diagnostics. It must not be
treated as a security boundary; backend gateway policy still owns authorization,
device status, version enforcement, and rollout decisions.

## Concrete Source And Asset Touchpoints

T31/T32 should verify these paths when implementing the Windows packaging patch
and installer docs:

| Path | Purpose |
|---|---|
| `patches/echothink/0001-branding.patch` | Existing product-string patch from T05. |
| `patches/extra/ungoogled-chromium/add-extra-channel-info.patch` | Current inherited source of the `ungoogled-chromium` About/version suffix; T31 should replace or supersede this wording for Echothink channel labels. |
| `patches/echothink/0002-default-policies-and-preferences.patch` | Defines `chrome/browser/resources/echothink/initial_preferences.json` and `echothink_bookmarks.html`; Windows packaging must install them as initial preferences/default bookmark seed files. |
| `assets/icons/echothink.ico` | App, taskbar, shortcut, and shell icon source. |
| `assets/installer/echothink-setup.ico` | `EchothinkBrowserSetup` executable icon source. |
| `assets/installer/README.md` | Records deferred installer banner/dialog artwork and examples of installer-specific dimensions. |
| `chrome/app/theme/chromium/BRANDING` | Expected Chromium branding file for product/install strings; exact context must be verified against the pinned Chromium source during T31. |
| `chrome/install_static/install_modes.cc` | Expected Windows install-mode/channel surface; exact context must be verified against the pinned Chromium source during T31. |
| `chrome/installer/mini_installer/chromium.release` | Expected mini-installer release manifest surface; exact context must be verified during T32. |
| `components/version_ui_strings.grdp` | Version UI strings currently affected by inherited `add-extra-channel-info.patch`. |

No local Chromium source checkout is present in this worktree, so the Chromium
source paths above are expected implementation targets, not locally verified
source files.

## Smoke-Test Expectations For Windows Packaging

When T31/T32 produce an installer, the smallest useful Windows smoke test should
check:

- Installer filename starts with `EchothinkBrowserSetup`.
- Installer executable icon is the Echothink setup icon.
- Installed app launches from Start Menu using the expected channel-specific
  name.
- Taskbar and shortcut icons use the Echothink app icon.
- Apps & Features / uninstall UI shows the expected display name and publisher.
- About/version shows `Echothink Browser` and the correct channel label.
- Clean profile New Tab, homepage/startup, bookmarks, and search defaults come
  from the T08/T19 resources.
- Update metadata carries the canonical channel ID and update track.
- Uninstall removes the channel-specific app without affecting other channels.

## Validation

Validation for T30 is documentation and path based:

- Confirmed `docs/progress.md` marks T05 and T06 `DONE`.
- Confirmed the T05 patch exists at `patches/echothink/0001-branding.patch`.
- Confirmed the T06 assets exist at `assets/icons/echothink.ico` and
  `assets/installer/echothink-setup.ico`.
- Confirmed the inherited About/version suffix touchpoint exists at
  `patches/extra/ungoogled-chromium/add-extra-channel-info.patch`.
- Confirmed the defaults packaging resources are defined by
  `patches/echothink/0002-default-policies-and-preferences.patch`.
- Confirmed this spec records `Echothink Browser`, `EchothinkBrowserSetup`, all
  five required channels, Alpha/Beta branding tradeoffs, update-channel
  metadata fields, and Windows smoke-test expectations.

## Known Limitations

- No Windows installer technology has been selected yet; T32 owns MSI/WiX,
  NSIS, Inno, mini-installer, signing, release metadata, and final smoke-test
  procedure decisions.
- No Chromium source checkout exists locally, so expected native Windows source
  paths must be verified during T31 against pinned Chromium `148.0.7778.178`
  after inherited patches are applied.
- No installer was built or run in this environment.
- Backend availability of `updates.echothink.ai` and
  `app.echothink.ai/download-browser` was not validated; these are route
  contracts only.
