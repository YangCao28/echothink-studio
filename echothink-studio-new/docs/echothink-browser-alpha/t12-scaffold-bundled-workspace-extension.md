# T12 Scaffold Bundled Workspace Extension

Date: 2026-05-28
Wave: W3
Delivery target: M3 extension skeleton
Status: DONE

## Prerequisite Check

T12 depends on T02. `docs/progress.md` marks T02 as `DONE`, and T02 records
the expected location, file set, permission boundary, and creation trigger for
`extensions/echothink-workspace/`.

The canonical-root mismatch from T00/T02 is carried forward as an accepted
baseline dependency. Documentation remains under
`echothink-studio-new/docs`, while this source scaffold lives at the inherited
browser repository root beside `patches/`, `assets/`, and the existing
Ungoogled Chromium build files.

## Created Extension Skeleton

Created source files under:

```text
extensions/echothink-workspace/
  manifest.json
  background.js
  sidepanel.html
  sidepanel.css
  sidepanel.js
  content_bridge.js
  assets/
    workspace-mark.svg
```

The extension is source-only in T12. It is not yet bundled into Chromium; that
remains T13 and the future `patches/echothink/0004-bundled-workspace-extension.patch`.
No `patches/series` entry was added by this task.

T13 update: `patches/echothink/0004-bundled-workspace-extension.patch` now
bundles the extension as a Chromium component extension. The source manifest now
also carries the fixed public key that derives bundled extension ID
`lokdibgfmiemhdoogailbfpdggndpolk`.

Local loading assumption for development is Chromium's unpacked-extension flow
against `extensions/echothink-workspace/`. There is no npm, bundler, generated
asset, or build step in this scaffold.

## Manifest Shape

`manifest.json` is a Manifest V3 extension manifest for the Chromium Alpha
target:

- `manifest_version`: `3`
- `minimum_chrome_version`: `148`, matching the local Chromium pin family
  `148.0.7778.178`
- fixed public key deriving extension ID
  `lokdibgfmiemhdoogailbfpdggndpolk` (added by T13 for bundled/component
  loading)
- background service worker: `background.js`
- default Side Panel path: `sidepanel.html`
- content bridge: `content_bridge.js`, injected only on
  `https://app.echothink.ai/*` and `https://auth.echothink.ai/*`

Declared permissions are exactly the T12 minimum set:

```text
sidePanel
storage
tabs
activeTab
scripting
```

Host permissions are restricted to Echothink-owned domains:

```text
https://app.echothink.ai/*
https://auth.echothink.ai/*
https://api.echothink.ai/*
https://search.echothink.ai/*
```

No broad host permissions, wildcard all-site permissions, web request
permissions, native messaging permissions, cookies permission, history
permission, bookmarks permission, downloads permission, DevTools permission, or
private extension APIs were added.

## Implementation Notes

- `background.js` registers the default Side Panel path and configures the
  extension action to open the panel where Chromium's `sidePanel` API supports
  that behavior.
- `sidepanel.html`, `sidepanel.css`, and `sidepanel.js` provide a local shell
  with Chat and Workspace regions, a scope selector, and a signed-out local
  state. The mode toggle is intentionally local only; persisted mode state is
  still owned by T15.
- `content_bridge.js` is intentionally narrow. It responds only to a same-window
  `ping` message on the explicit bridge channel from the allowed Echothink page
  origins and returns a readiness response with no privileged capabilities.
- The scaffold contains no backend service calls, search ranking, chat
  orchestration, workflow orchestration, project/task business logic,
  conversation persistence, or device/private-key handling.
- The browser network stack, TLS validation, sandbox, renderer internals,
  downloads, history, bookmarks, password manager, cookies, and DevTools are
  untouched.

## Validation

Validation was run from the canonical browser repository root in the local
worktree.

| Command | Result |
|---|---|
| `python3 -m json.tool extensions/echothink-workspace/manifest.json` | Passed: manifest JSON parses. |
| Manifest shape check for MV3, service worker, side panel path, permissions, host permissions, and content script matches | Passed: expected values matched exactly. |
| `node --check extensions/echothink-workspace/background.js` | Passed. |
| `node --check extensions/echothink-workspace/content_bridge.js` | Passed. |
| `node --check extensions/echothink-workspace/sidepanel.js` | Passed. |
| Source path check for the seven required scaffold files | Passed: all files exist under `extensions/echothink-workspace/`. |
| `git diff --check` | Passed: no whitespace errors. |

## Known Limitations

- The extension was not loaded in a live Chromium profile in this environment.
  T12 validates source shape and local syntax only.
- Bundling and forced default installation are not part of this scaffold and
  remain T13.
- Persisted mode state remains T15.
- Chat UI behavior, outbound scope metadata, and service integration remain
  T16/T18/T27 or later tasks.
- Workspace context rendering remains T17 or later tasks.
