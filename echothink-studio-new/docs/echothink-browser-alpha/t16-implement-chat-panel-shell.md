# T16 Implement Chat Panel Shell

Date: 2026-05-29
Wave: W7
Prerequisites: T15
Delivery target: M3 chat mode with scope metadata
Status: DONE

## Prerequisite Check

T16 depends on T15. `docs/progress.md` marks T15 as `DONE` and records that
the bundled Side Panel extension exposes exactly two persisted modes:
`chat` and `workspace_context`.

The canonical-root mismatch from earlier Alpha tasks remains an accepted
baseline dependency. Documentation lives under `echothink-studio-new/docs`;
extension source and active patch artifacts live at the inherited browser root
beside `extensions/` and `patches/`.

## Implementation

T16 keeps Chat Panel behavior in the bundled Manifest V3 extension shell. No
native Chromium UI, network stack, auth, device identity, or proof-signing code
was added.

Changed source extension files:

```text
extensions/echothink-workspace/sidepanel.html
extensions/echothink-workspace/sidepanel.css
extensions/echothink-workspace/sidepanel.js
```

Added active browser patch:

```text
patches/echothink/0016-chat-panel-shell.patch
```

and appended it to:

```text
patches/series
```

after:

```text
echothink/0015-side-panel-mode-selector.patch
```

Chat mode now renders:

- the visible Alpha scope selector;
- an in-memory transcript;
- a message composer;
- a small status region for send, offline, sign-in, unauthorized-scope, and
  remote-service failures returned by the chat request path.

## Scope Metadata

The selector exposes the Alpha scope values defined by the browser Alpha plan:

```text
current_page
project
app_domain
task_wave
artifacts
organization
```

Each outbound chat request posts JSON to:

```text
https://api.echothink.ai/v1/chat/stream
```

with this browser-side shape:

```json
{
  "message": "...",
  "scope": {
    "scope_type": "task_wave"
  },
  "client": {
    "source": "echothink_browser_side_panel",
    "version": "0.1.0"
  },
  "stream": true
}
```

When `current_page` is selected and the active tab has an `http` or `https`
URL, the request also includes `scope.page_url`. Non-web schemes such as
`chrome://` are not sent as page URLs. Other scope identifiers remain backend
or service-context responsibilities because T16 does not implement project,
App Domain, Task Wave, artifact, or organization workspace business logic.

## Streaming Behavior

The chat request sends:

```text
Accept: text/event-stream, application/x-ndjson, application/json, text/plain
```

The UI handles:

- `text/event-stream` and `application/x-ndjson` line-delimited deltas;
- `text/plain` readable streams;
- buffered JSON or text fallback responses.

The transcript is process-local DOM state only. It is not written to
`chrome.storage.local`, `chrome.storage.sync`, profile preferences, files, or
remote state by this browser code. Conversation persistence and model
orchestration remain remote service responsibilities.

## Security And Boundary Notes

- The extension manifest was not changed.
- No new permissions, host permissions, privileged bridges, native messaging,
  Web Store replacement path, `webRequest`, cookies permission, history
  permission, bookmarks permission, downloads permission, DevTools permission,
  or broad host permission was added.
- Chat requests rely on the existing narrow
  `https://api.echothink.ai/*` host permission and use
  `credentials: "include"` so browser-managed session cookies can flow without
  exposing token values in UI code.
- The UI does not read, render, store, or log access tokens, private key
  material, device proof payloads, or proof signatures.
- Request-proof integration remains T27 after the device bridge and proof
  helper tasks are complete.
- No backend service, gateway logic, search ranking, chat orchestration,
  workflow orchestration, project/task business logic, network stack, TLS
  validation, sandbox, renderer internals, downloads, history, bookmarks,
  password manager, cookies, or DevTools behavior changed.

## Changed Files

- `extensions/echothink-workspace/sidepanel.html`
- `extensions/echothink-workspace/sidepanel.css`
- `extensions/echothink-workspace/sidepanel.js`
- `patches/echothink/0016-chat-panel-shell.patch`
- `patches/series`
- `docs/echothink-browser-alpha/t16-implement-chat-panel-shell.md`
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
| Node manifest shape check | Passed: MV3, `side_panel.default_path`, exact permissions, exact host permissions, no `update_url`, and no forbidden broad permissions matched expectations. |
| Node chat request mock | Passed: submitting a message posts to `/v1/chat/stream`, uses `credentials: "include"`, includes `scope.scope_type`, omits `page_url` for non-page scopes, and renders a streamed SSE delta into the transcript. |
| `rtk rg -n -e Authorization -e Bearer -e access_token -e refresh_token -e privateKey -e private_key -e proof extensions/echothink-workspace/sidepanel.html extensions/echothink-workspace/sidepanel.js` | Exited 1 as expected: side-panel UI source contains no token, private-key, authorization-header, or proof handling. |
| `rtk git apply --numstat patches/echothink/0016-chat-panel-shell.patch` | Passed: unified diff parses cleanly; reports 67 insertions / 5 deletions in `sidepanel.css`, 23 insertions / 17 deletions in `sidepanel.html`, and 385 insertions / 1 deletion in `sidepanel.js`. |
| `rtk python3 devutils/check_patch_files.py` | Passed, exit 0. |
| `rtk python3 devutils/validate_config.py` | Passed, exit 0. |
| `rtk python3 devutils/check_gn_flags.py` | Passed, exit 0. |
| `rtk git diff --check` | Passed: no whitespace errors. |

Patch application command for a reviewer or build worker with the pinned
Chromium tree:

```text
patch -p1 < patches/echothink/0016-chat-panel-shell.patch
```

Run that from the Chromium `148.0.7778.178` source root after inherited
patches, after `echothink/0004-bundled-workspace-extension.patch`, and after
`echothink/0014-side-panel-container.patch` and
`echothink/0015-side-panel-mode-selector.patch` have applied. The full local
pipeline command remains:

```text
python3 devutils/validate_patches.py --local <path-to-unmodified-chromium-src>
```

## Known Limitations

- No local Chromium source checkout or browser build exists in this
  environment, so real `patch -p1` application against Chromium source and a
  clean-profile runtime chat smoke test were not run.
- The real chat endpoint still needs backend auth/session behavior, scope
  authorization, retrieval, conversation persistence, model routing, audit
  logging, and proof validation outside the browser.
- T16 does not implement project/App Domain/Task Wave/artifact ID discovery.
  Those identifiers remain service-context inputs for later work.
- Broader resilient local states remain T18. Workspace Context rendering remains
  T17. Device bridge/proof-capable requests remain T24/T27.
