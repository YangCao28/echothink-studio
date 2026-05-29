# T18 Add Side Panel Local States

Date: 2026-05-29
Wave: W8
Prerequisites: T16, T17
Delivery target: M3 resilient Side Panel UX
Status: DONE

## Prerequisite Check

T18 depends on T16 and T17. `docs/progress.md` marks both as `DONE`.

The canonical-root mismatch remains an accepted baseline dependency:
documentation lives under `echothink-studio-new/docs`; extension source and
active patch artifacts live in the inherited browser root beside
`extensions/` and `patches/`.

## Implementation

T18 keeps local setup and error states inside the bundled Manifest V3 extension
shell. No native Chromium UI, backend service, gateway authorization, workflow
logic, or device-proof implementation was added.

Changed source extension files:

```text
extensions/echothink-workspace/content_bridge.js
extensions/echothink-workspace/sidepanel.html
extensions/echothink-workspace/sidepanel.css
extensions/echothink-workspace/sidepanel.js
```

Added active browser patch:

```text
patches/echothink/0018-side-panel-local-states.patch
```

and appended it after T16/T17 in:

```text
patches/series
```

The Side Panel now supports these local state values:

```text
signed_out
no_device_identity
unauthorized_scope
offline
remote_service_error
```

State is stored under profile-local extension storage key:

```text
echothink.sidePanel.localState
```

The Side Panel also accepts a narrow internal message:

```text
echothink.sidePanel.localState.update
```

and the existing first-party content bridge can forward only this state update
from allowed `app.echothink.ai` and `auth.echothink.ai` pages via
`side_panel_state`. The bridge does not expose tokens, private keys, request
proofs, device keys, or privileged browser APIs.

## Protected Content Behavior

The shared local-state card is outside the mode panels, so both Chat Panel and
Workspace Context modes can show the same setup/error state.

For `signed_out`, `no_device_identity`, and `unauthorized_scope`, the extension:

- hides and resets protected Chat transcript/composer content;
- hides and resets service-rendered Workspace Context content;
- keeps the top-level mode selector visible;
- shows recovery links for sign-in, device enrollment, and/or support.

For `offline`, the extension derives state from browser online/offline events,
disables Chat sending, and shows retry/support actions. For
`remote_service_error`, the extension shows retry/support actions while allowing
the user to retry Chat after the service recovers.

Chat request failures also map local states:

- `401` -> `signed_out`
- `403` -> `unauthorized_scope`
- `412` or `428`, or an Echothink error header mentioning device/enrollment ->
  `no_device_identity`
- network/service failures -> `offline` or `remote_service_error`

Workspace Context snapshots may also carry `local_state` or `localState`; a
blocking state prevents rendering service-provided content.

## Boundary Notes

- The extension manifest was not changed.
- No new permissions, host permissions, native messaging, Web Store replacement
  path, `webRequest`, cookies, history, bookmarks, downloads, debugger,
  management, or DevTools permission was added.
- No access token, refresh token, private key, DPoP proof, request-proof
  payload, device key, backend authorization rule, workflow action, approval
  decision, project/task business logic, network stack, TLS validation,
  sandbox, renderer internals, downloads, history, bookmarks, password manager,
  cookies, or DevTools behavior was changed.

## Changed Files

- `extensions/echothink-workspace/content_bridge.js`
- `extensions/echothink-workspace/sidepanel.html`
- `extensions/echothink-workspace/sidepanel.css`
- `extensions/echothink-workspace/sidepanel.js`
- `patches/echothink/0018-side-panel-local-states.patch`
- `patches/series`
- `docs/echothink-browser-alpha/t18-add-side-panel-local-states.md`
- `docs/ungoogled_to_echothink_browser_change_plan.md`
- `docs/echothink_browser_construction.md`
- `docs/progress.md`

## Validation

Validation was run from the inherited browser repository root in the local
worktree.

| Command | Result |
|---|---|
| `rtk rg -n "^\\| T1[67] \\|.*DONE" echothink-studio-new/docs/progress.md` | T16 and T17 were confirmed `DONE` before implementation. |
| `rtk python3 -m json.tool extensions/echothink-workspace/manifest.json` | Passed: manifest JSON parses. |
| `rtk node --check extensions/echothink-workspace/background.js` | Passed. |
| `rtk node --check extensions/echothink-workspace/content_bridge.js` | Passed. |
| `rtk node --check extensions/echothink-workspace/sidepanel.js` | Passed. |
| Node local-state contract check | Passed: all five state values, protected-content gates, recovery actions, bridge state message, exact permissions, exact host permissions, and missing `update_url` matched expectations. |
| `rtk rg -n -e Authorization -e Bearer -e access_token -e refresh_token -e privateKey -e private_key -e DPoP extensions/echothink-workspace/sidepanel.html extensions/echothink-workspace/sidepanel.js extensions/echothink-workspace/content_bridge.js` | Exited 1 as expected: no token, private-key, authorization-header, or DPoP handling exists in the Side Panel source. |
| `rtk git apply --numstat patches/echothink/0018-side-panel-local-states.patch` | Passed: unified diff parses cleanly; reports 35 insertions / 14 deletions in `content_bridge.js`, 63 insertions in `sidepanel.css`, 186 insertions / 162 deletions in `sidepanel.html`, and 383 insertions / 23 deletions in `sidepanel.js`. |
| `rtk python3 devutils/check_patch_files.py` | Passed, exit 0. |
| `rtk python3 devutils/validate_config.py` | Passed, exit 0. |
| `rtk python3 devutils/check_gn_flags.py` | Passed, exit 0. |
| `rtk git diff --check` | Passed: no whitespace errors. |

Patch application command for a reviewer or build worker with the pinned
Chromium tree:

```text
patch -p1 < patches/echothink/0018-side-panel-local-states.patch
```

Run that from the Chromium `148.0.7778.178` source root after inherited patches,
after `echothink/0004-bundled-workspace-extension.patch`,
`echothink/0014-side-panel-container.patch`,
`echothink/0015-side-panel-mode-selector.patch`,
`echothink/0017-workspace-context-shell.patch`, and
`echothink/0016-chat-panel-shell.patch` have applied. The full local pipeline
command remains:

```text
python3 devutils/validate_patches.py --local <path-to-unmodified-chromium-src>
```

## Known Limitations

- No local Chromium source checkout or browser build exists in this
  environment, so real `patch -p1` application against Chromium source and
  runtime Side Panel smoke testing were not run.
- T18 provides local state display and protection behavior only. Authoritative
  login readiness, device identity, device bridge APIs, request proof signing,
  and backend authorization remain later tasks.
- A built browser still needs to verify each state visually in both modes and
  confirm recovery links open the expected Echothink-owned destinations.
