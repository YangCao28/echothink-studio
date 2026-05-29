# T34 Run Native Browser Regression Suite

Date: 2026-05-29
Wave: W12
Prerequisites: T33
Delivery target: M7 regression report
Status: DONE

## Summary

T34 runs the native browser regression suite for the Echothink Browser Alpha
patch set. Its direct prerequisite, T33 (full patch validation), is now `DONE`
in `docs/progress.md`; the earlier T34 blocker (T33 blocked behind the missing
T26 proof-helper patch) is resolved. T26, T27, and T33 are all `DONE`, the
proof-helper patch `echothink/0008-request-proof-helper.patch` is active in
`patches/series`, and the full 19-patch Echothink series passes T33 structural
validation.

The regression suite has two layers:

1. **Source-level native-primitive ownership analysis (executed, PASS).** This
   is the falsifiable core of the task: did any Echothink Alpha patch replace,
   weaken, or take ownership of a native Chromium primitive (tabs, windows,
   popups, history, downloads, bookmarks, password manager, cookies, local
   storage, TLS, DevTools, extension loading)? Every active Echothink patch was
   inventoried by touched file and every shared-file edit at a primitive
   intersection was read to confirm it is additive. Result: **no native
   primitive subsystem source is touched, and every intersection is an additive
   registration, not a replacement.**
2. **Live runtime smoke (deferred to T36).** Launching a built browser binary
   and exercising tabs/windows/popups/history/downloads/bookmarks/password/
   cookies/storage/TLS/DevTools/extension-loading at runtime requires an
   installed Windows Alpha build. No local Chromium `148.0.7778.178` checkout or
   build exists in this repository environment (the same limitation T33
   documented). Runtime browser launch is owned by
   `docs/echothink-browser-alpha/t36-run-windows-packaging-smoke-test.md`, which
   installs and launches the actual `EchothinkBrowserSetup` artifact. This is a
   validation-environment limitation, not a regression.

**No blocker regressions remain.** Chromium-native ownership of all listed
primitives is preserved at the source level.

## Method

The 19 active Echothink patches (`patches/echothink/`, listed in
`patches/series` lines 113-131) were inventoried by extracting every modified
target path (`+++ b/...`) and every shared-file hunk was read at each point
where an Echothink change meets a native primitive. The native-primitive list
comes from the change plan section 7 "Native Browser Regression" and the T34
task contract.

### Distinct files touched by the Echothink Alpha patch set (39)

Negative subsystem check (grep of the touched-file list against
`/bookmarks/`, `/history/`, `/download`, `/password_manager/`, `/safe_browsing/`,
`net/cookies`, `dom_storage`, `content/browser/storage`, `/ssl/`, `cert_verif`,
`/devtools/`, `tab_strip`, `/tabs/`, `browser_window`, `/popup`, `/sandbox/`,
`/renderer/`): **0 matches.** No native primitive subsystem file is modified by
any Echothink patch.

All Echothink-touched files fall into these non-primitive buckets:

- Branding / packaging strings: `chrome/app/chromium_strings.grd`,
  `chrome/app/theme/chromium/BRANDING`,
  `chrome/install_static/chromium_install_modes.h`,
  `chrome/installer/mini_installer/*`, `components/version_ui_strings.grdp`.
- Net-new isolated Echothink components: `chrome/browser/echothink/device_identity/*`,
  `chrome/browser/extensions/api/echothink_device/*`,
  `chrome/common/extensions/api/echothink_device.idl`,
  `chrome/browser/ui/webui/echothink_first_run.h`,
  `chrome/browser/ui/webui/echothink_invalid_echo.h`,
  `chrome/browser/resources/echothink/*`, `chrome/browser/resources/echothink_workspace/*`.
- Build wiring: `chrome/browser/BUILD.gn`, `chrome/browser/extensions/api/BUILD.gn`,
  `chrome/browser/extensions/api/echothink_device/BUILD.gn`,
  `chrome/common/extensions/api/api_sources.gni`,
  `chrome/browser/resources/component_extension_resources.grd`.
- Narrow additive edits to shared Chromium files (read and confirmed additive,
  see per-area table): `chrome/browser/chrome_content_browser_client.cc`,
  `chrome/browser/ui/browser_navigator.cc`, `chrome/browser/chrome_browser_main.cc`,
  `chrome/browser/extensions/component_extensions_allowlist/allowlist.cc`,
  `chrome/browser/extensions/component_loader.cc`,
  `chrome/common/extensions/api/_api_features.json`,
  `chrome/browser/ui/webui/chrome_web_ui_configs.cc`,
  `chrome/common/webui_url_constants.cc`,
  `third_party/search_engines_data/resources/definitions/prepopulated_engines.json`,
  `chrome/browser/ui/webui/ungoogled_first_run.h`.

## Regression Report (M7)

| Primitive | Native owner (unchanged) | Echothink intersection | Source-level verdict | Runtime smoke owner |
|---|---|---|---|---|
| Tabs | Chromium tab strip / `Navigate()` | 0006/0009/0012 add a URL-rewrite gate inside `Navigate()`; tab creation/lifecycle untouched | PASS — only the destination URL is gated, native tab machinery intact | T36 |
| Windows | Chromium browser window | none directly; `Navigate()` window routing runs natively after the URL gate | PASS — no window-lifecycle source touched | T36 |
| Popups | Chromium popup/window-open path | `Navigate()` gate applies the same pre-setup URL rewrite to browser-created popups (intended T21 behavior) | PASS — popup creation/blocking primitive unchanged; only pre-setup destination gated | T36 |
| History | `components/history`, `chrome/browser/history` | none | PASS — no history source touched | T36 |
| Downloads | `chrome/browser/download`, `components/download` | none | PASS — no download source touched | T36 |
| Bookmarks | `components/bookmarks`, `chrome/browser/ui/bookmarks` | `resources/echothink/echothink_bookmarks.html` + `initial_preferences.json` seed *default* bookmarks only | PASS — default-content seed via preferences layer; bookmark store/manager untouched | T36 |
| Password manager | `components/password_manager` | none | PASS — no password source touched | T36 |
| Cookies & local storage | `net/cookies`, `content/browser/.../storage` | none | PASS — no cookie/storage source touched | T36 |
| TLS / cert validation | `net/ssl`, cert verifier, network service | none | PASS — no TLS/cert/network source touched | T36 |
| DevTools | `chrome/browser/devtools`, `content/.../devtools` | none | PASS — no DevTools source touched | T36 |
| Extension loading | component loader, component allowlist, extension API features | 0004 adds one ID to the component allowlist set and one `Add()` component-extension registration; 0024 adds one allowlisted `echothinkDevice` API feature + one IDL source | PASS — additive registration through standard Chromium component-extension and API-feature mechanisms; no existing extension gating weakened, web store unchanged, no broad host permissions added | T36 |

### Detail on the three primitive intersections

- **Navigation gate (`browser_navigator.cc`, patches 0006/0009/0012).**
  `ApplyEchothinkLoginGate(params)` is inserted near the top of `Navigate()`.
  Before local setup completes, it rewrites `params->url` to
  `chrome://echothink-first-run` for non-allowlisted destinations and clears the
  referrer; otherwise it returns early. The native tab/window/popup creation and
  navigation path runs unchanged afterward. This is the intended T21 login-gate
  behavior, not a primitive replacement.
- **Extension loading (`allowlist.cc` + `component_loader.cc`, patch 0004).**
  Adds `lokdibgfmiemhdoogailbfpdggndpolk` to the existing
  `IsComponentExtensionAllowlisted` fixed flat set and one
  `Add(IDR_ECHOTHINK_WORKSPACE_MANIFEST, ...)` call in
  `AddDefaultComponentExtensionsWithBackgroundPages`. No change to extension
  verification, web-store policy, or general extension load flow.
- **Extension API surface (`_api_features.json` + `api_sources.gni`, patch 0024).**
  Adds a new `echothinkDevice` feature entry (`component_extensions_auto_granted:
  false`, allowlisted to hash `3FD653AFF268642D37729C1A261CBD4BD00AA032`, the SHA1
  of the bundled extension ID) and one new IDL source. No existing API feature,
  permission, or context gate is modified.

### Preference / content_browser_client edits (non-primitive)

`chrome_content_browser_client.cc` edits (0002/0006/0007) register
non-secret Echothink prefs, extend the existing `HandleNewTabPageLocationOverride`
hook, and wire the device-identity service. These are preference/registration
additions, not changes to a native primitive subsystem.

## Regressions And Ownership

| Severity | Finding | Owning task or patch |
|---|---|---|
| (none) | No native-primitive ownership regression found in any of the 19 active Echothink patches. | n/a |

No BLOCKER, MAJOR, or MINOR native-primitive regression is recorded. The only
deliberate user-visible native-surface behavior change is the pre-setup
navigation gate (tabs/windows/popups route to the local first-run shell before
login), which is the specified T21 login-gate behavior, owned by
`patches/echothink/0006-login-gate.patch`, not a regression.

## Chromium-Native Ownership

Confirmed preserved at the source level. No Echothink patch modifies any file in
the tabs, windows, popups, history, downloads, bookmarks, password-manager,
cookie, local-storage, TLS/network, sandbox, renderer, or DevTools subsystems.
Echothink changes live in net-new `echothink*` files, branding/packaging
strings, build wiring, and a small number of additive hunks in shared
navigation/extension-registration/preference files.

## Validation

| Command | Result |
|---|---|
| `grep -nE "^\| ?T33 ?\|" docs/progress.md` | T33 is `DONE` — prerequisite satisfied (earlier blocker resolved). |
| `grep -n "echothink/" patches/series` | 19 active Echothink entries (lines 113-131), all appended after the inherited block. |
| `grep -hE "^\+\+\+ " patches/echothink/*.patch \| sort -u` | 39 distinct touched files; full inventory captured in this note. |
| Negative subsystem grep over the touched-file list (`/bookmarks/`, `/history/`, `/download`, `/password_manager/`, `net/cookies`, `dom_storage`, `/ssl/`, `cert_verif`, `/devtools/`, `tab_strip`, `/tabs/`, `browser_window`, `/popup`, `/sandbox/`, `/renderer/`) | **0 matches** — no native primitive subsystem source touched. |
| Read hunks: `0006` (`browser_navigator.cc`, `chrome_content_browser_client.cc`), `0004` (`allowlist.cc`, `component_loader.cc`), `0024` (`_api_features.json`, `api_sources.gni`) | All confirmed additive; no primitive replaced. |
| `python3 devutils/check_patch_files.py` | exit 0 — series file references intact. |
| `python3 devutils/check_gn_flags.py` | exit 0. |
| `python3 devutils/validate_config.py` | exit 0. |

Live runtime browser smoke (launching a built binary) was **not run**: no local
Chromium `148.0.7778.178` checkout or build is available in this environment
(same limitation documented in T33 and T03 #4). That smoke is owned by T36
Windows packaging smoke test.

## Known Limitations

- This is a source-level native-primitive-ownership regression pass plus repo
  structural validation. It does not launch a built browser binary.
- Runtime confirmation of each primitive's behavior on a real installed build is
  carried by `t36-run-windows-packaging-smoke-test.md` and the Windows Alpha
  candidate (T37). T36 must exercise tabs, windows, popups, history, downloads,
  bookmarks, password manager, cookies, local storage, TLS, DevTools, and
  extension loading on the installed `EchothinkBrowserSetup` build.
- The full stacked live `patch -p1` apply against pinned Chromium remains
  subject to the inherited DEPS-parser tooling limitation noted in T33; each
  required patch was individually proven by real `patch -p1` in its own task.
