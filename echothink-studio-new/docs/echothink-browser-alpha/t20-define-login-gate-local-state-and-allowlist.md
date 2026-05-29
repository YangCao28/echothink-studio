# T20 Define Login Gate Local State And Allowlist

Date: 2026-05-29
Wave: W4
Prerequisites: T10, T11
Delivery target: M4 login gate spec
Status: DONE

## Prerequisite Check

T20 depends on T10 and T11. Both are now complete in
`echothink-studio-new/docs/progress.md`:

| Prerequisite | Status | Evidence |
|---|---|---|
| T10 - Implement New Tab route and fallback | DONE | `patches/echothink/0003-new-tab-and-first-run.patch` creates `chrome://echothink-first-run` and keeps it static, script-free, offline-capable, and limited to setup/support links. |
| T11 - Add first-run shell | DONE | `patches/echothink/0011-first-run-gate-shell.patch` makes `chrome://echothink-first-run` the sole first-run tab and suppresses normal first-run browsing before setup. |

The canonical-root mismatch recorded by T00 still applies. This spec lives
under `echothink-studio-new/docs`; the active browser patches and
`patches/series` live in the inherited browser patch/config root one directory
up.

## Scope

This task defines the browser-side login gate contract for T21. It does not
implement `patches/echothink/0006-login-gate.patch`, backend authorization,
gateway policy, search ranking, chat orchestration, workflow orchestration, or
business pages.

T21 should implement this spec with narrow browser-shell integration and avoid
changes to Chromium network stack, TLS validation, sandbox, renderer internals,
downloads, history, bookmarks, password manager, cookies, and DevTools.

## Local Readiness State

T21 should store only non-secret readiness state. No access token, refresh
token, private key, proof payload, or signed proof may be stored in these
preferences.

Use normal-profile profile preferences for the gate state:

| Preference key | Type | Initial value | Meaning |
|---|---|---|---|
| `echothink.auth.session_ready` | boolean | `false` | The browser has observed a successful Echothink auth completion signal for this profile. |
| `echothink.device.enrolled` | boolean | `false` | The browser has a non-secret device enrollment record for this profile/install. |
| `echothink.device.verified` | boolean | `false` | The local device identity has been accepted by the Echothink setup flow. |
| `echothink.setup.complete` | boolean | `false` | Normal browsing may be restored for this profile. This is derived from the auth/device flags and must not be set independently by arbitrary web content. |
| `echothink.setup.completed_at` | string, ISO-8601 UTC or empty | `""` | Timestamp for the latest transition to setup complete. |
| `echothink.setup.last_blocked_at` | string, ISO-8601 UTC or empty | `""` | Optional local diagnostic timestamp for the latest blocked navigation. |
| `echothink.setup.last_blocked_scheme` | string or empty | `""` | Optional local diagnostic scheme only, for example `https`; do not store full blocked URLs. |

Derived readiness:

```text
setup_complete =
  auth.session_ready == true
  and device.enrolled == true
  and device.verified == true
```

T21 may persist `echothink.setup.complete` as a cached boolean, but it must be
cleared whenever any underlying readiness flag becomes false. T22/T23 own the
device identity implementation and may refine the exact non-secret device
metadata fields, but they must preserve this readiness contract or update this
spec explicitly.

## Unauthenticated Navigation Allowlist

Before `echothink.setup.complete` is true, normal top-level browsing is blocked
except for the exact setup, diagnostics, update, support, and browser-required
routes below.

The allowlist applies to top-level main-frame navigations. Subresources loaded
by an allowed HTTPS page are left to normal Chromium web security and are not a
new browser-network policy surface.

| Purpose | Allowed destination |
|---|---|
| Local gate shell | `chrome://echothink-first-run` |
| Local diagnostics | `chrome://echothink-diagnostics` |
| Sign in | `https://auth.echothink.ai/login` |
| Auth callback/setup status | `https://auth.echothink.ai/browser/callback` |
| Device enrollment | `https://auth.echothink.ai/device/enroll` |
| Device enrollment callback/status | `https://auth.echothink.ai/device/complete` |
| Browser-required setup/status | `https://app.echothink.ai/browser-required` |
| Support | `https://app.echothink.ai/support` |
| Browser download/recovery | `https://app.echothink.ai/download-browser` |
| Update metadata/help | `https://updates.echothink.ai/` and paths under `https://updates.echothink.ai/` |

URL matching rules:

- Scheme and host must match exactly and must use HTTPS for remote routes.
- Listed app/auth paths allow query strings and fragments only on the exact
  path, so auth services can carry opaque state without broadening to all paths.
- `updates.echothink.ai` may allow subpaths because update metadata and help
  files may move under that origin during Alpha.
- Do not allow sibling subdomains, HTTP downgrade, wildcard hosts, or arbitrary
  `app.echothink.ai` paths before setup.
- Do not allow `file://`, external protocol handlers, direct IP literals, or
  arbitrary extension URLs as setup bypasses.

Internal Chromium diagnostic exceptions:

- `chrome://version`, `chrome://policy`, `chrome://settings/help`, and
  `chrome://extensions` may remain reachable for local troubleshooting because
  they are not general web browsing destinations.
- DevTools availability should remain Chromium-native. The login gate must not
  change DevTools internals or use DevTools as a setup bypass.
- `chrome://echothink-diagnostics` is allowlisted even though its WebUI may not
  exist yet. Until its owning task lands, it is an allowed-but-dead route and
  must be documented in validation rather than treated as a passing diagnostics
  surface.

## Blocked Navigation Behavior

When setup is incomplete and a top-level navigation targets anything outside
the allowlist, T21 should:

1. Cancel or replace the navigation before arbitrary content is committed.
2. Navigate the tab to `chrome://echothink-first-run`.
3. Avoid appending the blocked URL, query string, fragment, or referrer to the
   local gate URL.
4. Optionally update `echothink.setup.last_blocked_at` and
   `echothink.setup.last_blocked_scheme` for local diagnostics only.

The gate applies to:

- Omnibox typed navigations.
- Link clicks and redirects in top-level frames.
- Restored tabs and startup tabs.
- New windows and popups that attempt a top-level disallowed destination.
- Normal and incognito profiles until setup is complete; incognito must not be
  a bypass.
- App-mode and command-line URL launches unless the target is allowlisted.

The gate should not:

- Intercept subresource requests as a network-stack policy.
- Rewrite TLS, certificate, proxy, cookie, password, history, bookmark,
  download, sandbox, renderer, or DevTools behavior.
- Store full blocked URLs in prefs, logs, docs examples, or progress notes.
- Expose auth tokens, private keys, request proofs, or device secrets to web or
  extension JavaScript.

## Setup Completion And Unlock

Normal browsing unlocks only after all setup criteria are satisfied:

1. `echothink.auth.session_ready` is true.
2. `echothink.device.enrolled` is true.
3. `echothink.device.verified` is true.
4. The current profile is not under an explicit local reset or sign-out state.

When these criteria are met, T21 should set or recompute
`echothink.setup.complete = true` and record `echothink.setup.completed_at`.
After that, normal Chromium browsing resumes: New Tab, direct URL navigation,
downloads, history, bookmarks, password manager, cookies, DevTools, and native
tab/window behavior should work according to Chromium and existing policy.

Setup completion signal ownership:

- T21 owns the gate and readiness preference checks.
- T22/T23 own device identity fields, DPAPI storage, enrollment persistence,
  and the non-secret device readiness values.
- T24/T26/T27 own bridge/proof surfaces and must not expose private key
  material while updating readiness.
- Backend services own server-side auth, device authorization, replay
  protection, and rollout policy. The local gate is not a security boundary by
  itself.

## Reset And Logout Semantics

Sign-out, explicit local reset, profile deletion, or failed device verification
must clear enough state to re-enable the gate:

| Event | Required local effect |
|---|---|
| Sign-out observed by browser shell | Clear `echothink.auth.session_ready` and `echothink.setup.complete`; keep non-secret device metadata unless user also requests device reset. |
| Device verification revoked or reset | Clear `echothink.device.verified` and `echothink.setup.complete`; T22/T23 decide whether to clear the DPAPI key and non-secret device IDs. |
| Explicit local reset | Clear all T20 readiness flags and timestamps; T22/T23 own key/material deletion details. |
| Profile deletion | Chromium profile deletion removes profile preferences; any Local State or DPAPI artifacts are owned by T22/T23. |

## Diagnostics And Support Exceptions

Before setup, users must still have recovery paths:

- `chrome://echothink-first-run` is the local recovery page and is always
  allowlisted.
- `chrome://echothink-diagnostics` is the planned local diagnostics route. It
  is allowlisted now but may remain a known dead route until implemented.
- `https://app.echothink.ai/support` and
  `https://app.echothink.ai/download-browser` are allowlisted for support and
  recovery.
- `https://updates.echothink.ai/` is allowlisted for update metadata/help.
- `https://app.echothink.ai/browser-required` is allowlisted for setup status
  and browser-required messaging.

These exceptions must not open general app/workspace browsing before setup.
Routes such as `https://app.echothink.ai/dashboard`,
`https://app.echothink.ai/newtab`, project pages, task waves, artifacts,
approvals, and arbitrary external sites remain blocked until setup completes.

## T21 Implementation Notes

T21 should implement `patches/echothink/0006-login-gate.patch` against this
spec. The narrowest acceptable implementation is:

- Register the T20 profile preferences.
- Add a browser-side top-level navigation gate for normal/incognito profiles.
- Reuse `chrome://echothink-first-run` as the local blocked-navigation
  explanation/recovery surface for Alpha.
- Apply the explicit allowlist above.
- Compute setup completion from the readiness flags.
- Leave backend authorization, device proof, and server-side policy outside the
  browser patch.

## Validation

Commands were run from the inherited browser patch/config root, where
`patches/`, `devutils/`, and `echothink-studio-new/docs/` are present.

| Command | Result |
|---|---|
| `rtk rg -n "^\\| T10 \\|[^|]*\\|[^|]*\\|[^|]*\\| DONE \\|" echothink-studio-new/docs/progress.md` | Passed: T10 is marked `DONE`. |
| `rtk rg -n "^\\| T11 \\|[^|]*\\|[^|]*\\|[^|]*\\| DONE \\|" echothink-studio-new/docs/progress.md` | Passed: T11 is marked `DONE`. |
| `rtk ls -l patches/echothink/0003-new-tab-and-first-run.patch patches/echothink/0011-first-run-gate-shell.patch` | Passed: T10 and T11 patch artifacts exist. |
| `rtk rg -n "echothink/0003-new-tab-and-first-run.patch|echothink/0011-first-run-gate-shell.patch" patches/series` | Passed: both prerequisite patches are active in `patches/series`. |
| `rtk rg -n "echothink.auth.session_ready|echothink.setup.complete|Unauthenticated Navigation Allowlist|https://auth.echothink.ai/login|https://app.echothink.ai/browser-required|chrome://echothink-first-run|chrome://echothink-diagnostics|Setup Completion And Unlock" echothink-studio-new/docs/echothink-browser-alpha/t20-define-login-gate-local-state-and-allowlist.md` | Passed: the spec defines readiness flags, explicit allowlist, local gate routes, and setup completion. |
| `rtk rg -n "t20-define-login-gate-local-state-and-allowlist|login-gate state and allowlist source of truth|Alpha source of truth" echothink-studio-new/docs/ungoogled_to_echothink_browser_change_plan.md echothink-studio-new/docs/echothink_browser_construction.md` | Passed: broader Alpha docs point to the T20 spec as the login-gate source of truth. |
| `rtk rg -n 'T20 is not mark[e]d|No login-gate spec was author[e]d|T20 prerequisite is incomplet[e]|T20 is only read[y]|still block[e]d in the task note' echothink-studio-new/docs` | Exited 1 as expected: no stale T20-blocker language remains. |
| `rtk git diff --check` | Passed: no whitespace errors. |

## Known Limitations

- This is a spec task. It does not create `patches/echothink/0006-login-gate.patch`.
- No browser binary was built or run, so no runtime navigation gate smoke test
  was performed.
- `chrome://echothink-diagnostics` remains an allowlisted planned route until
  its owning diagnostics task implements the WebUI.
- The local gate is not a backend authorization boundary. Server-side auth,
  device authorization, replay protection, and rollout policy remain backend
  responsibilities.
