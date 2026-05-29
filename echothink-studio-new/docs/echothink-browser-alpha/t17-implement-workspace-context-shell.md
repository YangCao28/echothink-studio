# T17 Implement Workspace Context Shell

Date: 2026-05-29
Wave: W7
Prerequisites: T15
Delivery target: M3 workspace context mode
Status: DONE

## Prerequisite Check

T17 depends on T15. `docs/progress.md` marks T15 as `DONE` and records that
the bundled Echothink Workspace Side Panel exposes exactly two modes,
`chat` and `workspace_context`, with the selected mode persisted in
profile-local extension storage.

The canonical-root mismatch from earlier Alpha tasks remains an accepted
baseline dependency. Documentation lives under `echothink-studio-new/docs`;
extension source and active patch artifacts live at the inherited browser root
beside `extensions/` and `patches/`.

## Implementation

T17 keeps Workspace Context mode inside the bundled Manifest V3 extension shell.
No native Chromium UI rewrite, privileged bridge, backend call, or workflow
logic was added.

Changed source extension files:

```text
extensions/echothink-workspace/sidepanel.html
extensions/echothink-workspace/sidepanel.css
extensions/echothink-workspace/sidepanel.js
```

Added active browser patch:

```text
patches/echothink/0017-workspace-context-shell.patch
```

and appended it to the Echothink tail block in:

```text
patches/series
```

Workspace Context mode now provides UI containers for:

- Current project context
- Current App Domain context
- Current Task Wave status
- Agent console entry
- Pending approvals
- Recent artifacts
- Project navigation
- Notifications
- Quick actions

Each section has a stable `data-context-section` slot, default unavailable copy,
an item list target, an action target, and status/title targets. The shell also
adds a Workspace Context overview target.

`sidepanel.js` contains a generic text-only renderer for a structured workspace
context snapshot. It can render a snapshot already available in
`chrome.storage.local` under:

```text
echothink.workspaceContext.snapshot
```

or from an internal extension message with type:

```text
echothink.workspaceContext.update
```

The renderer supports object- or array-shaped `sections`, writes text through
`textContent`, caps displayed items/actions, and only creates links for
Echothink-owned HTTPS origins:

```text
https://app.echothink.ai
https://auth.echothink.ai
https://search.echothink.ai
```

The extension does not fetch workspace context, derive project state, rank
artifacts, execute quick actions, decide approvals, orchestrate workflows,
persist conversations, expose token/private-key internals, or implement backend
service logic. No new permissions, host permissions, native messaging,
externally connectable surface, or Web Store replacement path were added.

## Changed Files

- `extensions/echothink-workspace/sidepanel.html`
- `extensions/echothink-workspace/sidepanel.css`
- `extensions/echothink-workspace/sidepanel.js`
- `patches/echothink/0017-workspace-context-shell.patch`
- `patches/series`
- `docs/echothink-browser-alpha/t17-implement-workspace-context-shell.md`
- `docs/ungoogled_to_echothink_browser_change_plan.md`
- `docs/echothink_browser_construction.md`
- `docs/progress.md`

## Validation

Validation was run from the inherited browser repository root in the local
worktree.

| Command | Result |
|---|---|
| `rtk rg -n "^\\| T15 \\|.*DONE" echothink-studio-new/docs/progress.md` | Passed: prerequisite T15 is marked `DONE`. |
| `rtk python3 -m json.tool extensions/echothink-workspace/manifest.json` | Passed: manifest JSON parses. |
| `rtk node --check extensions/echothink-workspace/background.js` | Passed. |
| `rtk node --check extensions/echothink-workspace/content_bridge.js` | Passed. |
| `rtk node --check extensions/echothink-workspace/sidepanel.js` | Passed. |
| Node manifest shape check | Passed: MV3, `side_panel.default_path`, action title, exact permissions, exact host permissions, no `update_url`, and no forbidden broad permissions matched expectations. |
| Node Workspace Context shell contract check | Passed: all required `data-context-section` containers are present, the source renderer includes the storage/message snapshot hooks, Echothink-only link allowlist, and no `fetch`, `XMLHttpRequest`, `WebSocket`, `nativeMessaging`, `cookies`, `history`, `bookmarks`, or `downloads` surface. |
| `rtk git apply --numstat patches/echothink/0017-workspace-context-shell.patch` | Passed: unified diff parses cleanly; reports 130 insertions / 14 deletions in `sidepanel.css`, 161 insertions / 19 deletions in `sidepanel.html`, and 250 insertions in `sidepanel.js`. |
| `rtk python3 devutils/check_patch_files.py` | Passed, exit 0. |
| `rtk python3 devutils/validate_config.py` | Passed, exit 0. |
| `rtk python3 devutils/check_gn_flags.py` | Passed, exit 0. |
| `rtk git diff --check` | Passed: no whitespace errors. |

Patch application command for a reviewer or build worker with the pinned
Chromium tree:

```text
patch -p1 < patches/echothink/0017-workspace-context-shell.patch
```

Run that from the Chromium `148.0.7778.178` source root after inherited patches,
after `echothink/0004-bundled-workspace-extension.patch`,
`echothink/0014-side-panel-container.patch`, and
`echothink/0015-side-panel-mode-selector.patch` have applied. The full local
pipeline command remains:

```text
python3 devutils/validate_patches.py --local <path-to-unmodified-chromium-src>
```

## Known Limitations

- No local Chromium source checkout or browser build exists in this
  environment, so real `patch -p1` application against Chromium source and a
  runtime Side Panel smoke test were not run.
- A built browser still needs to verify that switching to Workspace Context
  shows the nine required containers and that later service integration can
  populate the structured snapshot.
- T17 intentionally does not implement Chat shell behavior, Side Panel local
  error/auth/device states, backend context retrieval, request proof, device
  identity, workflow execution, approval decisions, artifact ranking, or quick
  action execution.
