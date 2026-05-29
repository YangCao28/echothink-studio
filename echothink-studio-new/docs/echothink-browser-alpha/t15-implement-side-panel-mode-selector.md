# T15 Implement Side Panel Mode Selector

Date: 2026-05-29
Wave: W6
Prerequisites: T14
Delivery target: M3 switchable panel modes
Status: DONE

## Prerequisite Check

T15 depends on T14. `docs/progress.md` marks T14 as `DONE` and records that
the bundled Echothink Workspace extension action opens the Chromium Side Panel
to local extension shell `sidepanel.html`.

The canonical-root mismatch from earlier Alpha tasks remains an accepted
baseline dependency. Documentation lives under `echothink-studio-new/docs`;
extension source and active patch artifacts live at the inherited browser root
beside `extensions/` and `patches/`.

## Implementation

T15 keeps mode selection inside the bundled Manifest V3 extension shell. No
native Chromium state plumbing was added.

Changed source extension files:

```text
extensions/echothink-workspace/sidepanel.html
extensions/echothink-workspace/sidepanel.css
extensions/echothink-workspace/sidepanel.js
```

Added active browser patch:

```text
patches/echothink/0015-side-panel-mode-selector.patch
```

and appended it to the Echothink tail block in:

```text
patches/series
```

The Side Panel now exposes exactly two Alpha modes:

```text
chat
workspace_context
```

The visible top-level selector labels them as `Chat` and `Workspace Context`.
The previous temporary `workspace` mode value was removed from the active
selector and panel markup.

Mode state is stored under extension-local key:

```text
echothink.sidePanel.mode
```

using:

```text
chrome.storage.local
```

`chrome.storage.local` is local to the extension install in the current browser
profile, so the selected mode persists across browser restart without using
remote account state or `chrome.storage.sync`. Unsupported or missing stored
values fall back to `chat`. If a user clicks a mode while the initial storage
read is still in flight, the user click wins and the late restore is ignored.

The mode switch happens immediately in the already-open Side Panel. It does not
require browser restart, extension reload, backend availability, or page reload.

No new extension permissions, host permissions, privileged bridges, native
messaging, Web Store replacement path, backend service calls, search ranking,
chat orchestration, workflow orchestration, project/task business logic,
conversation persistence, sync storage, or device/private-key handling were
added.

## Changed Files

- `extensions/echothink-workspace/sidepanel.html`
- `extensions/echothink-workspace/sidepanel.css`
- `extensions/echothink-workspace/sidepanel.js`
- `patches/echothink/0015-side-panel-mode-selector.patch`
- `patches/series`
- `docs/echothink-browser-alpha/t15-implement-side-panel-mode-selector.md`
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
| Node manifest shape check | Passed: MV3, `side_panel.default_path`, action title, exact permissions, exact host permissions, storage permission present, and no `update_url` or forbidden broad permissions matched expectations. |
| Node side-panel storage mock | Passed: stored `workspace_context` restores on load, clicking `chat` updates `chrome.storage.local`, and panel visibility follows the selected mode. |
| Node side-panel restore race mock | Passed: a user click made while initial storage restore is pending remains selected after the late restore resolves. |
| Mode contract source check | Passed: active source selector exposes only `chat` and `workspace_context`; no active `data-mode="workspace"` or `data-panel="workspace"` remains. |
| `rtk git apply --numstat patches/echothink/0015-side-panel-mode-selector.patch` | Passed: unified diff parses cleanly; reports 2 insertions in `sidepanel.css`, 25 insertions / 6 deletions in `sidepanel.html`, and 57 insertions / 3 deletions in `sidepanel.js`. |
| `rtk python3 devutils/check_patch_files.py` | Passed, exit 0. |
| `rtk python3 devutils/validate_config.py` | Passed, exit 0. |
| `rtk python3 devutils/check_gn_flags.py` | Passed, exit 0. |
| `rtk git diff --check` | Passed: no whitespace errors. |

Patch application command for a reviewer or build worker with the pinned
Chromium tree:

```text
patch -p1 < patches/echothink/0015-side-panel-mode-selector.patch
```

Run that from the Chromium `148.0.7778.178` source root after inherited patches,
after `echothink/0004-bundled-workspace-extension.patch`, and after
`echothink/0014-side-panel-container.patch` have applied. The full local
pipeline command remains:

```text
python3 devutils/validate_patches.py --local <path-to-unmodified-chromium-src>
```

## Known Limitations

- No local Chromium source checkout or browser build exists in this
  environment, so real `patch -p1` application against Chromium source and a
  clean-profile browser restart smoke test were not run.
- Browser-level verification still needs a built candidate to switch to
  `workspace_context`, close all windows, restart, and verify the Side Panel
  restores that mode in the same profile.
- Chat UI behavior, outbound scope metadata, service states, request proof,
  device identity, and service-rendered Workspace Context content remain later
  tasks.
