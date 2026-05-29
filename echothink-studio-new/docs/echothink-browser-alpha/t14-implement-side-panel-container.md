# T14 Implement Side Panel Container

Date: 2026-05-29
Wave: W5
Prerequisites: T13
Delivery target: M3 Side Panel opens
Status: DONE

## Prerequisite Check

T14 depends on T13. `docs/progress.md` marks T13 as `DONE` and records that
the Echothink Workspace extension is bundled as Chromium component extension ID
`lokdibgfmiemhdoogailbfpdggndpolk` by
`patches/echothink/0004-bundled-workspace-extension.patch`.

The canonical-root mismatch from earlier Alpha tasks is carried forward as an
accepted baseline dependency. Documentation remains under
`echothink-studio-new/docs`; extension source and patch artifacts live at the
inherited browser root beside `patches/`, `extensions/`, and the existing
Ungoogled Chromium build files.

## Implementation

T14 keeps the Side Panel entry in the bundled Manifest V3 extension rather than
adding a native Chromium toolbar rewrite.

Changed the source extension service worker:

```text
extensions/echothink-workspace/background.js
```

and added the active patch:

```text
patches/echothink/0014-side-panel-container.patch
```

The patch updates the bundled Chromium resource copy at:

```text
chrome/browser/resources/echothink_workspace/background.js
```

and appends this patch to the Echothink tail block in `patches/series`.

The extension action is the browser UI entry point. The service worker now:

- configures `chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true })`
  on install, browser startup, and service-worker load;
- enables the default Side Panel path `sidepanel.html`;
- enables the Side Panel for new, active, and loading tabs;
- handles `chrome.action.onClicked` and calls `chrome.sidePanel.open()` from the
  toolbar action user gesture as a runtime fallback.

No new extension permissions, host permissions, privileged bridges, native
messaging, Web Store replacement path, backend service calls, search ranking,
chat orchestration, workflow orchestration, project/task business logic,
conversation persistence, or device/private-key handling were added.

## Changed Files

- `extensions/echothink-workspace/background.js`
- `patches/echothink/0014-side-panel-container.patch`
- `patches/series`
- `docs/echothink-browser-alpha/t14-implement-side-panel-container.md`
- `docs/ungoogled_to_echothink_browser_change_plan.md`
- `docs/echothink_browser_construction.md`
- `docs/progress.md`

## Validation

Validation was run from the inherited browser repository root in the local
worktree.

| Command | Result |
|---|---|
| `rtk python3 -m json.tool extensions/echothink-workspace/manifest.json` | Passed: manifest JSON parses. |
| `rtk node --check extensions/echothink-workspace/background.js` | Passed. |
| `rtk node --check extensions/echothink-workspace/content_bridge.js` | Passed. |
| `rtk node --check extensions/echothink-workspace/sidepanel.js` | Passed. |
| Node manifest shape check | Passed: MV3, `side_panel.default_path`, action title, exact permissions, exact host permissions, and no `update_url` or forbidden broad permissions matched expectations. |
| `rtk git apply --numstat patches/echothink/0014-side-panel-container.patch` | Passed: unified diff parses cleanly; reports 82 insertions and 13 deletions in `chrome/browser/resources/echothink_workspace/background.js`. |
| `rtk python3 devutils/check_patch_files.py` | Passed, exit 0. |
| `rtk python3 devutils/validate_config.py` | Passed, exit 0. |
| `rtk python3 devutils/check_gn_flags.py` | Passed, exit 0. |
| `rtk git diff --check` | Passed: no whitespace errors. |

Patch application command for a reviewer or build worker with the pinned
Chromium tree:

```text
patch -p1 < patches/echothink/0014-side-panel-container.patch
```

Run that from the Chromium `148.0.7778.178` source root after inherited patches
and after `echothink/0004-bundled-workspace-extension.patch` has applied. The
full local pipeline command remains:

```text
python3 devutils/validate_patches.py --local <path-to-unmodified-chromium-src>
```

## Known Limitations

- No local Chromium source checkout or browser build exists in this
  environment, so real `patch -p1` application against Chromium source and a
  clean-profile runtime click smoke test were not run.
- A built browser still needs to verify that clicking the Echothink Workspace
  extension action opens the Chromium Side Panel and loads extension URL
  `sidepanel.html` from bundled component extension
  `lokdibgfmiemhdoogailbfpdggndpolk`.
- Persisted mode state remains T15.
- Chat UI behavior, outbound scope metadata, service states, request proof,
  device identity, and Workspace Context rendering remain later tasks.
