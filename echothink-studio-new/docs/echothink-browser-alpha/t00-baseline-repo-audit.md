# T00 Baseline Repo Audit

Date: 2026-05-28
Wave: W0
Delivery target: M0 baseline audit note
Status: DONE with implementation-blocking repository-root gap documented

## Scope

This task is documentation-only. No browser patches, build files, source
behavior, network stack, TLS validation, sandboxing, renderer internals,
downloads, history, bookmarks, password manager, cookies, or DevTools behavior
were changed.

The requested repository root was:

```text
C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new
```

That path currently contains only `docs/`. The inherited Ungoogled Chromium
patch/config tree used for this audit is present one directory up:

```text
C:\Users\caoya\source\repos\echothink-studio
```

This is the most important baseline gap for follow-on implementation work. T00
can record the current baseline, but patch/build tasks must either make
`echothink-studio-new` the real browser repo or update the canonical root.

## Version Baseline

At the inherited patch/config tree:

| File | Value |
|---|---|
| `chromium_version.txt` | `148.0.7778.178` |
| `revision.txt` | `1` |
| Git HEAD | `95f6fe1c945624ea19746084d4ecc3e33c1dee3f` |
| Git HEAD subject | `Port CirrusCI jobs to github actions (#3776)` |

At the requested `echothink-studio-new` root, `chromium_version.txt` and
`revision.txt` are missing.

## Current Patch Pipeline

The inherited repository is an Ungoogled Chromium common patch/config repo. The
pipeline documented by `docs/design.md` and `docs/building.md` is:

1. Download and unpack Chromium source.
   - Config: `downloads.ini`
   - Tooling: `utils/downloads.py`
   - Current archive: `chromium-%(_chromium_version)s-lite.tar.xz`
   - Current source URL:
     `https://commondatastorage.googleapis.com/chromium-browser-official/chromium-%(_chromium_version)s-lite.tar.xz`

2. Prune binaries.
   - Config: `pruning.list`
   - Tooling: `utils/prune_binaries.py`
   - Current list size: 13,717 lines

3. Apply inherited patches.
   - Config: `patches/series`
   - Tooling: `utils/patches.py`
   - Current ordered patch entries: 108
   - Direct path validation found 0 missing patch files.
   - Current layers include `upstream-fixes/`, `core/`, and `extra/`.
   - No `patches/echothink/` layer exists yet.

4. Apply domain substitution.
   - Regex config: `domain_regex.list`
   - File list: `domain_substitution.list`
   - Tooling: `utils/domain_substitution.py`
   - Current substitution list size: 17,674 lines
   - Replacement domains use the inherited `qjz9zk` pattern.

5. Generate GN/build files.
   - Config: `flags.gn`
   - Docs state `flags.gn` is only a subset of the flags needed to build.
   - Documented GN command:
     `./out/Default/gn gen out/Default --fail-on-unused-args`

6. Invoke Chromium build.
   - Documented build command:
     `ninja -C out/Default chrome chromedriver chrome_sandbox`
   - The common repo docs say platform-specific repositories provide the rest
     of the configuration for supported platforms.

## Known Browser Insertion Points

### New Tab

- `patches/extra/ungoogled-chromium/add-flag-for-custom-ntp.patch`
  changes `chrome/browser/chrome_content_browser_client.cc` in
  `HandleNewTabPageLocationOverride`, adds the `custom-ntp` flag, and stores
  its value through Chromium flags state.
- `patches/extra/inox-patchset/0008-restore-classic-ntp.patch` changes
  `chrome/browser/search/search.cc` so the NTP path returns Chromium local NTP
  URLs rather than default search provider NTP URLs.
- `patches/extra/ungoogled-chromium/add-flag-for-bookmark-bar-ntp.patch`
  controls bookmark bar visibility on New Tab.

Recommended Echothink follow-up: use the custom NTP pattern first, then decide
whether the Alpha route belongs in policy/master preferences or a narrow
Echothink patch ordered after inherited patches.

### Search Provider

- `patches/core/ungoogled-chromium/replace-google-search-engine-with-nosearch.patch`
  changes `third_party/search_engines_data/resources/definitions/prepopulated_engines.json`
  so the Google built-in provider becomes `No Search`.
- `patches/extra/ungoogled-chromium/prepopulated-search-engines.patch` disables
  Site Search Starter Pack expansion.
- `patches/extra/ungoogled-chromium/add-suggestions-url-field.patch` adds UI
  and service support for editing a suggestions URL.
- `patches/extra/ungoogled-chromium/add-flag-for-search-engine-collection.patch`
  adds a flag to disable automatic search engine collection.

Recommended Echothink follow-up: prefer policy or master preferences for
`https://search.echothink.ai/search?q={searchTerms}` and
`https://search.echothink.ai/suggest?q={searchTerms}` before changing omnibox
internals.

### First Run

- `patches/extra/ungoogled-chromium/first-run-page.patch` changes
  `chrome/browser/chrome_browser_main.cc` to add a first-run tab at
  `chrome://ungoogled-first-run`.
- The same patch registers a WebUI config in
  `chrome/browser/ui/webui/chrome_web_ui_configs.cc`, adds
  `chrome/browser/ui/webui/ungoogled_first_run.h`, and registers
  `ungoogled-first-run` in `chrome/common/webui_url_constants.cc`.
- `patches/extra/iridium-browser/browser-disable-profile-auto-import-on-first-run.patch`
  disables profile auto-import behavior during first run.

Recommended Echothink follow-up: reuse the first-run WebUI pattern for
`chrome://echothink-first-run` or an equivalent local setup gate, while keeping
business data out of the local page.

### Flags And Defaults

- `patches/extra/ungoogled-chromium/add-ungoogled-flag-headers.patch` adds the
  inherited flag header structure under `chrome/browser/ungoogled_*`.
- `patches/extra/inox-patchset/0006-modify-default-prefs.patch` changes native
  default preferences such as background mode, hyperlink auditing, search
  suggestions, bookmark bar visibility, third-party cookies, password manager,
  and autofill defaults.
- `docs/default_settings.md` documents user-visible inherited default changes.
- `flags.gn` disables or configures Google-related build features and sets
  safe browsing mode to `0`.

Recommended Echothink follow-up: keep Echothink defaults in policies,
preferences, and narrow browser-shell patches; avoid deep native rewrites.

### Extensions And Side Panel

- No Echothink bundled extension or Side Panel shell exists yet.
- `patches/core/inox-patchset/0005-disable-default-extensions.patch` removes
  selected default/component extension behavior and Chrome Web Store install
  paths.
- `patches/core/ungoogled-chromium/disable-webstore-urls.patch` changes
  extension update/install URL behavior away from the Chrome Web Store.
- `patches/extra/ungoogled-chromium/add-flag-to-configure-extension-downloading.patch`
  adds CRX/user-script handling controls.
- `patches/core/ungoogled-chromium/extensions-manifestv2.patch` keeps MV2
  compatibility paths enabled.
- `patches/extra/ungoogled-chromium/remove-uneeded-ui.patch` hides the All
  Bookmarks side panel entry; it is not an Echothink Side Panel insertion point.

Recommended Echothink follow-up: bundle a trusted MV3 extension through a
dedicated Echothink patch after inherited extension patches, and document any
interaction with inherited Web Store disabling.

## Windows Build Assumptions And Gaps

Current inherited assumptions:

- The common repo is not a complete standalone Windows build repo.
  `docs/building.md` explicitly points to platform-specific repositories, and
  `docs/platforms.md` points Windows users to `ungoogled-chromium-windows`.
- `utils/clone.py` recognizes `win32`, `win64`, and `win-arm64` platform
  choices.
- `utils/_extraction.py` contains Windows-specific extraction helpers for
  7-Zip and WinRAR discovery.
- `docs/flags.md` documents Windows-only `--disable-encryption` and
  `--disable-machine-id`.
- `patches/extra/ungoogled-chromium/disable-download-quarantine.patch` removes
  quarantine/Zone Identifier behavior for downloads and File System Access
  moves.

Current gaps:

- The requested `echothink-studio-new` root lacks all build/config files.
- No `build/windows/` path exists.
- No Echothink installer identity, signing workflow, update channel metadata,
  smoke test script, or Windows release checklist exists yet.
- No `patches/echothink/`, `extensions/echothink-workspace/`, or `assets/`
  paths exist yet.
- `python devutils\validate_config.py` currently fails on Windows because
  `check_unused_patches()` compares Windows backslash paths from `Path` against
  slash-delimited `patches/series` entries. A direct PowerShell check confirmed
  all 108 `patches/series` entries exist.
- `python devutils\check_downloads_ini.py` fails with no arguments because its
  default argument is a string list; `python devutils\check_downloads_ini.py -d
  downloads.ini` passes.

## Areas To Keep Inherited

The Echothink Browser Alpha layer should preserve Chromium and Ungoogled
Chromium ownership of:

- Tabs, windows, popups, session restore, and normal navigation.
- History, downloads, bookmarks, password manager, cookies, and site storage.
- Renderer process model, sandboxing, TLS/certificate validation, and DevTools.
- Extension permission model and normal extension loading semantics except for
  the explicitly bundled trusted Echothink extension.
- Ungoogled Chromium binary pruning, Google-service removal, domain
  substitution, and inherited privacy/control patches unless a later task
  explicitly documents a narrow exception.

## Validation

Commands run from `C:\Users\caoya\source\repos\echothink-studio` unless noted:

| Command | Result |
|---|---|
| Requested-root path check for `chromium_version.txt`, `revision.txt`, `downloads.ini`, `pruning.list`, `domain_regex.list`, `domain_substitution.list`, `flags.gn`, `patches\series`, `utils`, `devutils` | All missing under `echothink-studio-new` |
| Inherited-root path check for the same files/directories | All present one directory up |
| `python devutils\validate_config.py` | Failed with unused-patch warnings caused by Windows slash/backslash path comparison |
| Direct PowerShell validation of `patches\series` paths | `series_entries=108`, `missing_count=0` |
| `python devutils\check_downloads_ini.py -d downloads.ini` | Passed |
| `python devutils\check_gn_flags.py` | Passed |

No patch application, Chromium build, packaging, installer, or browser runtime
test was run for T00.

## T00 Outcome

The baseline is now recorded. T00 made no repo behavior changes. Follow-on
implementation tasks should treat the repository-root mismatch and Windows
validation utility quirks as baseline dependencies to resolve or explicitly
accept before making browser patches.
