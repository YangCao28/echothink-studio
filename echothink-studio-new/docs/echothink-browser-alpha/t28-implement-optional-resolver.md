# T28 Implement Optional Echo Protocol Resolver

Date: 2026-05-29
Wave: W5
Delivery target: M6 - `0009-echo-protocol-router.patch`
Status: DONE

## Prerequisite Check

| Prerequisite | Status in `docs/progress.md` | Notes |
|---|---|---|
| T10 - Implement New Tab route and fallback | DONE | `docs/progress.md` marks T10 `DONE`; `patches/echothink/0003-new-tab-and-first-run.patch` exists and is active in `patches/series`. |

T28's prerequisite is complete. The canonical-root mismatch recorded by T00 is
carried forward: task documentation lives under `echothink-studio-new/docs`,
while the active Chromium patch pipeline lives one directory up in the inherited
browser root.

## What Was Implemented

Created `patches/echothink/0009-echo-protocol-router.patch` and inserted it in
`patches/series` after `echothink/0011-first-run-gate-shell.patch` and before
`echothink/0010-windows-packaging-identity.patch`.

The patch adds a narrow navigation helper in
`chrome/browser/ui/browser_navigator.cc`:

- It runs inside the desktop `NavigateParams` path before Chromium treats
  `echo://` as an external protocol.
- It rewrites only known route shapes to HTTPS app URLs under
  `https://app.echothink.ai/`.
- It clears the original `echo://` referrer before loading the HTTPS route.
- It does not register a content protocol, serve local workspace data, read auth
  state, sign requests, or bypass backend authorization/device proof.

Resolved routes:

| Echo route | HTTPS destination |
|---|---|
| `echo://dashboard` | `https://app.echothink.ai/dashboard` |
| `echo://project/{project_id}` | `https://app.echothink.ai/project/{project_id}` |
| `echo://task-wave/{wave_id}` | `https://app.echothink.ai/task-wave/{wave_id}` |
| `echo://app-domain/{domain}/{instance_id}` | `https://app.echothink.ai/app-domain/{domain}/{instance_id}` |
| `echo://artifact/{artifact_id}` | `https://app.echothink.ai/artifact/{artifact_id}` |
| `echo://approval/{approval_id}` | `https://app.echothink.ai/approval/{approval_id}` |

The resolver accepts only non-empty route segments made of RFC 3986 unreserved
characters (`A-Z`, `a-z`, `0-9`, `-`, `.`, `_`, `~`) and rejects
query strings/fragments. `echo://dashboard/` is accepted as a dashboard alias
only to tolerate host-only custom URL canonicalization.

Unsupported or invalid `echo://` routes are intentionally left to inherited
Chromium handling in T28. `docs/dag-doc.md` assigns the local invalid-route
fallback page to T29.

## Protected-Area Compliance

- No network stack, TLS validation, sandbox, renderer internals, downloads,
  history, bookmarks, password manager, cookies, or DevTools behavior changed.
- No backend service, gateway logic, authorization rule, device proof, search
  ranking, chat orchestration, workflow orchestration, or business page was
  implemented.
- The browser only maps route-shaped shortcuts to HTTPS URLs. The destination
  app/gateway must still enforce user session, authorization, and device proof.

## Validation

Run from the inherited browser repository root unless noted.

| Command | Result |
|---|---|
| `rtk git apply --numstat patches/echothink/0009-echo-protocol-router.patch` | Passed: `96 0 chrome/browser/ui/browser_navigator.cc`. |
| `rtk python3 devutils/check_patch_files.py` | Passed, exit 0. |
| `rtk python3 devutils/check_gn_flags.py` | Passed, exit 0. |
| `rtk python3 devutils/validate_config.py` | Passed, exit 0. |
| `rtk patch -p1 -i .../patches/echothink/0009-echo-protocol-router.patch` from `/private/tmp/echothink-t28-chromium` containing the pinned Chromium `148.0.7778.178` `chrome/browser/ui/browser_navigator.cc` | Passed: patch applied cleanly to the fetched pinned source file. |

Patch placement and ordering verified: the patch lives under
`patches/echothink/`, has an active `patches/series` entry in the Echothink tail
block, and remains ordered before the Windows packaging identity patch.

## Known Limitations

- No full Chromium source checkout, compile, or runtime browser smoke test was
  available here. Runtime validation should launch a built browser and verify
  the six valid `echo://` examples navigate to the expected HTTPS routes.
- Invalid-route UX is not part of T28. T29 owns the local invalid `echo://`
  fallback page.
- Query strings, fragments, encoded path separators, and non-unreserved
  characters are not accepted by the T28 resolver. This is intentional to keep
  the browser-side mapper simple and avoid hidden browser-layer payloads.
