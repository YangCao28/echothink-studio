# T09 Confirm New Tab Insertion Point

Date: 2026-05-28
Wave: W1
Delivery target: M2 New Tab hook decision
Status: DONE

## Prerequisite Check

T09 depends on T00. `docs/progress.md` marks T00 as `DONE` and records the
repository-root mismatch as an acceptable baseline dependency for discovery and
documentation tasks.

The requested repository root remains documentation-only:

```text
C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new
```

The inherited Ungoogled Chromium patch/config tree used to inspect concrete New
Tab touchpoints is:

```text
C:\Users\caoya\source\repos\echothink-studio
```

This task produced documentation only. It did not create a patch, add
`patches/echothink/`, update `patches/series`, or change browser behavior.

## Decision

Use the existing New Tab location override hook in:

```text
chrome/browser/chrome_content_browser_client.cc
HandleNewTabPageLocationOverride()
```

as modified by:

```text
patches/extra/ungoogled-chromium/add-flag-for-custom-ntp.patch
```

For the Echothink Alpha default, prefer seeding the profile preference
`prefs::kNewTabPageLocationOverride` to:

```text
https://app.echothink.ai/newtab
```

rather than setting the inherited command-line switch:

```text
--custom-ntp=https://app.echothink.ai/newtab
```

T08/T10 should verify the exact Chromium preference seed path against the
pinned source tree, but the selected browser hook is
`HandleNewTabPageLocationOverride()`.

## Why This Hook

This hook is the lowest-risk insertion point currently visible in the inherited
tree because it:

- Already exists in the applied Ungoogled Chromium patch set.
- Reads Chromium's New Tab override preference before returning a replacement
  URL.
- Leaves tab creation, navigation, renderer behavior, history, downloads,
  bookmarks, cookies, TLS, sandboxing, and DevTools untouched.
- Avoids editing New Tab WebUI resources, search engine internals, omnibox
  routing, tab strip behavior, or renderer code.
- Is compatible with T07's preference-first defaults strategy.
- Keeps the Echothink change isolated as a browser-shell route decision.

Deeper approaches are rejected for Alpha:

| Rejected approach | Reason |
|---|---|
| Rebuild Chromium New Tab WebUI resources | Higher rebase cost and unnecessary for a remote workspace route. |
| Route through default search provider `new_tab_url` | The inherited `0008-restore-classic-ntp.patch` deliberately avoids search-provider New Tab URLs and returns local Chromium NTP URLs. |
| Patch omnibox/navigation internals | Too broad for a simple New Tab route and risks direct URL navigation behavior. |
| Force global command-line `--custom-ntp` | The inherited switch can affect incognito external New Tabs, which is broader than the Alpha default requirement. |

## Incognito Behavior

The inherited `add-flag-for-custom-ntp.patch` preserves Chromium behavior for
off-the-record profiles unless `--custom-ntp` is present:

- If the profile is incognito and no `--custom-ntp` switch exists, the hook
  returns `false`, so the normal Chromium incognito New Tab behavior continues.
- If `--custom-ntp` is present and points to an external URL, the inherited
  patch can route incognito New Tabs to that external URL.
- If `--custom-ntp` is present and points to a `chrome://` URL, the inherited
  patch avoids applying that internal page to incognito.

For Echothink Alpha, do not use `--custom-ntp` as the default route mechanism.
Seed the normal-profile preference path instead so incognito New Tab behavior
remains inherited unless a later task explicitly changes it.

## Fallback Behavior

`HandleNewTabPageLocationOverride()` only chooses the URL. It does not provide
authentication, offline, or service-failure fallback behavior by itself.

T10 should implement fallback outside the routing hook:

- Normal ready state: New Tab resolves to
  `https://app.echothink.ai/newtab`.
- Not signed in or not enrolled: show a minimal local setup/fallback page or
  login-gate route owned by T10/T11/T20.
- Offline or remote service unavailable: show a minimal local fallback page
  with only login, device enrollment, diagnostics, update, and
  support/download links.
- Invalid or unauthorized workspace state: let backend/gateway authorization
  own the decision; the browser fallback must not embed business data.

The fallback page should use a narrow local WebUI pattern, reusing lessons from
`patches/extra/ungoogled-chromium/first-run-page.patch`, rather than modifying
the New Tab renderer or replacing native Chromium navigation.

## Compatibility With Inherited Patches

Relevant inherited patches:

| Patch | Relationship to T09 |
|---|---|
| `patches/extra/ungoogled-chromium/add-flag-for-custom-ntp.patch` | Adds the selected `HandleNewTabPageLocationOverride()` behavior and `custom-ntp` flag. |
| `patches/extra/inox-patchset/0008-restore-classic-ntp.patch` | Forces classic local Chromium NTP instead of default search provider NTP URLs; T09 avoids fighting this path. |
| `patches/extra/ungoogled-chromium/add-flag-for-bookmark-bar-ntp.patch` | Controls bookmark bar visibility on New Tab; T09 does not alter this behavior. |
| `patches/extra/ungoogled-chromium/first-run-page.patch` | Provides a local WebUI pattern useful for T10/T11 fallback/setup pages, not the primary New Tab route hook. |

## Implementation Guidance For T10

When T10 creates `patches/echothink/0003-new-tab-and-first-run.patch`:

- Keep the route patch ordered after all inherited patches.
- Prefer setting `prefs::kNewTabPageLocationOverride` for normal profiles.
- Do not set a global `--custom-ntp` default unless a written incognito
  behavior decision approves it.
- Keep fallback local and minimal; do not embed workspace data.
- Do not modify search-provider New Tab URL logic, omnibox internals, renderer
  internals, or Chromium network behavior.
- Validate by applying inherited patches plus the Echothink patch, then
  launching a normal profile and verifying New Tab opens the Echothink route.
- Separately verify incognito New Tab behavior remains inherited.

## Validation

Validation for this discovery task is path and documentation based:

- Confirmed T00 is `DONE` in `docs/progress.md`.
- Confirmed relevant inherited New Tab patches exist:
  - `patches/extra/ungoogled-chromium/add-flag-for-custom-ntp.patch`
  - `patches/extra/inox-patchset/0008-restore-classic-ntp.patch`
  - `patches/extra/ungoogled-chromium/add-flag-for-bookmark-bar-ntp.patch`
  - `patches/extra/ungoogled-chromium/first-run-page.patch`
- Confirmed inherited docs describe `--custom-ntp` and `--bookmark-bar-ntp` in
  `docs/flags.md`.
- Confirmed the decision is linked to concrete Chromium files touched by
  inherited patches.

## Known Limitations

- No Chromium source checkout is present locally, so T10 must verify exact
  current source context after inherited patches are applied.
- No patch application, browser build, or runtime smoke test was run for T09.
- Fallback design is intentionally assigned to T10/T11/T20; T09 only selects
  the route hook and documents the fallback boundary.
