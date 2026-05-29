# T13 Add Bundled Extension Install Patch

Date: 2026-05-29
Wave: W4
Prerequisites: T12
Delivery target: M3 `0004-bundled-workspace-extension.patch`
Status: DONE

## Prerequisite Check

T13 depends on T12. `docs/progress.md` marks T12 as `DONE` and records the
source-only Manifest V3 workspace extension scaffold under
`extensions/echothink-workspace/`.

The canonical-root mismatch from T00/T02/T12 is carried forward as an accepted
baseline dependency. Documentation remains under `echothink-studio-new/docs`;
the patch artifact and extension source live at the inherited browser root
beside `patches/`, `assets/`, and the Ungoogled Chromium build files.

## Implementation

Created the Echothink-owned patch:

```text
patches/echothink/0004-bundled-workspace-extension.patch
```

and inserted it into `patches/series` after:

```text
echothink/0003-new-tab-and-first-run.patch
```

and before:

```text
echothink/0005-default-search-provider.patch
```

The patch uses Chromium's component-extension path:

- Adds the fixed Echothink Workspace extension ID
  `lokdibgfmiemhdoogailbfpdggndpolk` to
  `chrome/browser/extensions/component_extensions_allowlist/allowlist.cc`.
- Registers the bundled extension in
  `ComponentLoader::AddDefaultComponentExtensionsWithBackgroundPages()` so it is
  loaded for normal profiles by default.
- Adds extension resources to
  `chrome/browser/resources/component_extension_resources.grd`.
- Copies the MV3 shell into
  `chrome/browser/resources/echothink_workspace/` as a bundled browser
  resource.

The source scaffold manifest at `extensions/echothink-workspace/manifest.json`
was updated with the same public key used in the bundled manifest so unpacked
development and the bundled component extension derive the same stable ID.

## Replacement Boundary

The bundled extension is a component extension loaded from browser resources,
not a public Web Store install. Its manifest has:

- A fixed public key deriving ID `lokdibgfmiemhdoogailbfpdggndpolk`.
- No `update_url`.
- Component-loader allowlisting for only that derived ID.

A public Web Store extension cannot silently replace this component extension:
the bundled extension does not opt into Web Store updates, and another extension
cannot claim the same ID without the corresponding private key.

Normal extension installation, updates, policy behavior, and user extension
permissions outside this trusted component extension are otherwise left to the
inherited Chromium/Ungoogled Chromium extension system.

## Permission Boundary

The manifest remains narrow:

```text
sidePanel
storage
tabs
activeTab
scripting
```

Host permissions remain limited to Echothink-owned domains:

```text
https://app.echothink.ai/*
https://auth.echothink.ai/*
https://api.echothink.ai/*
https://search.echothink.ai/*
```

The manifest does not declare broad host permissions, `nativeMessaging`,
`webRequest`, `declarativeNetRequest`, `cookies`, `history`, `bookmarks`,
`downloads`, `debugger`, `management`, or DevTools permissions.

The extension shell still contains no backend service calls, search ranking,
chat orchestration, workflow orchestration, project/task business logic,
conversation persistence, or device/private-key handling.

## Changed Files

- `extensions/echothink-workspace/manifest.json`
- `patches/echothink/0004-bundled-workspace-extension.patch`
- `patches/series`
- `docs/echothink-browser-alpha/t12-scaffold-bundled-workspace-extension.md`
- `docs/echothink-browser-alpha/t13-add-bundled-extension-install-patch.md`
- `docs/ungoogled_to_echothink_browser_change_plan.md`
- `docs/echothink_browser_construction.md`
- `docs/progress.md`

## Validation

Validation was run from the inherited browser repository root.

| Command | Result |
|---|---|
| `python3 -m json.tool extensions/echothink-workspace/manifest.json` | Passed; source manifest parses. |
| `node --check extensions/echothink-workspace/background.js` | Passed. |
| `node --check extensions/echothink-workspace/content_bridge.js` | Passed. |
| `node --check extensions/echothink-workspace/sidepanel.js` | Passed. |
| Manifest shape and ID check using Node `crypto` | Passed; derived ID is `lokdibgfmiemhdoogailbfpdggndpolk`, MV3/minimum Chrome version match, exact permissions/host permissions match, and no forbidden broad permissions or `update_url` are present. |
| `git apply --numstat patches/echothink/0004-bundled-workspace-extension.patch` | Passed; unified diff parses cleanly. |
| `git apply --stat patches/echothink/0004-bundled-workspace-extension.patch` | Passed; patch reports 10 files changed, 492 insertions. |
| `python3 devutils/check_patch_files.py` | Passed, exit 0. |
| `python3 devutils/validate_config.py` | Passed, exit 0. |
| `python3 devutils/check_gn_flags.py` | Passed, exit 0. |

Patch application command for a reviewer or build worker with the pinned
Chromium tree:

```text
patch -p1 < patches/echothink/0004-bundled-workspace-extension.patch
```

Run that from the Chromium `148.0.7778.178` source root after inherited patches
and after Echothink patches `0001`, `0002`, and `0003` have applied. The full
local pipeline command remains:

```text
python3 devutils/validate_patches.py --local <path-to-unmodified-chromium-src>
```

## Known Limitations

- No local Chromium source checkout exists, so real `patch -p1` application and
  runtime browser smoke testing were not run in this environment.
- A clean-profile browser build still needs to verify that extension ID
  `lokdibgfmiemhdoogailbfpdggndpolk` loads as a component extension by default
  and that the side panel opens.
- The extension is a local shell only. Persisted mode state, remote chat,
  workspace context rendering, request proof integration, and device identity
  integration remain owned by later tasks.
