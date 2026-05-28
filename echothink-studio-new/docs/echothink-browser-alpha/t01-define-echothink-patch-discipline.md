# T01 Define Echothink Patch Discipline

Date: 2026-05-28
Wave: W1
Delivery target: M0 patch convention doc
Status: DONE

## Prerequisite Check

T01 depends on T00. `docs/progress.md` marks T00 as `DONE` and records the
repository-root gap as an acceptable baseline dependency for documentation and
discovery tasks.

This task produced documentation only. It did not create an Echothink patch,
add `patches/echothink/`, or update `patches/series`.

## Source Rules Inherited From Ungoogled Chromium

Echothink patches must stay compatible with the inherited Ungoogled Chromium
patch pipeline:

- Patch files live under `patches/`.
- `patches/series` is the ordered list of active patches.
- Entries in `patches/series` are relative to `patches/` and use slash paths.
- Lines beginning with `#` are ignored.
- Text after ` #` on a patch entry is treated as a comment.
- Patch files must be UTF-8 unified diffs.
- Hunk paths must apply with `patch -p1`.
- Patches must apply cleanly without fuzz.
- The preferred hunk style is `a/` and `b/` paths with 3 lines of context.

## Echothink Patch Namespace

All Echothink-owned native Chromium patches must live under:

```text
patches/echothink/
```

No Echothink patch may be placed under inherited namespaces such as
`patches/core/`, `patches/extra/`, `patches/upstream-fixes/`,
`patches/core/ungoogled-chromium/`, or `patches/extra/ungoogled-chromium/`.

If a future task needs to fix inherited tooling, that work must be documented as
an inherited-tooling change, not hidden inside an Echothink product patch.

## Naming Convention

Use this filename pattern:

```text
NNNN-short-kebab-case-purpose.patch
```

Rules:

- `NNNN` is a four-digit decimal sequence number.
- Use lowercase ASCII kebab-case after the number.
- Use `.patch` as the only file extension.
- Keep the name short and tied to one purpose.
- Do not include spaces, underscores, dates, usernames, or issue prose.
- Do not reuse a retired patch number for a different behavior.
- Do not renumber existing active patches unless the rebase plan explicitly
  documents the reason.

Recommended Alpha order:

```text
echothink/0001-branding.patch
echothink/0002-default-policies-and-preferences.patch
echothink/0003-new-tab-and-first-run.patch
echothink/0004-bundled-workspace-extension.patch
echothink/0005-default-search-provider.patch
echothink/0006-login-gate.patch
echothink/0007-device-identity.patch
echothink/0008-request-proof-helper.patch
echothink/0009-echo-protocol-router.patch
echothink/0010-windows-packaging-identity.patch
```

If a task needs multiple independent changes inside one area, split them into
separate later numbers instead of growing a broad patch.

## Patch Size And Purpose

Each Echothink patch must be small and single-purpose.

A patch is too broad if it:

- Touches unrelated browser areas.
- Combines UI strings, native behavior, packaging, and policy defaults in one
  file.
- Makes review require understanding unrelated Chromium subsystems.
- Contains multiple changes that could be reverted independently.
- Adds fallback behavior and production behavior in the same patch when they
  can be separated.

Prefer a patch that is easy to describe in one sentence:

```text
Route the first-run page to the Echothink setup shell.
```

Avoid broad patch descriptions:

```text
Make Echothink browser changes.
```

## Series Ordering Rules

Echothink patches must apply after all inherited Chromium and Ungoogled
Chromium patches.

Rules for `patches/series`:

- Add an Echothink entry only when the patch file exists and should be active in
  the ordered pipeline.
- Do not add placeholder entries.
- Keep all Echothink entries together as the tail block of `patches/series`.
- Preserve inherited patch order unless a separate inherited-pipeline task
  explicitly approves a change.
- Order Echothink patches by dependency, not by author or convenience.
- Keep slash-delimited paths in `patches/series`, for example
  `echothink/0001-branding.patch`.
- If a patch depends on a previous Echothink patch, mention that dependency in
  the patch header.

Expected tail shape:

```text
extra/ungoogled-chromium/add-flag-for-disabling-jit.patch

echothink/0001-branding.patch
echothink/0002-default-policies-and-preferences.patch
...
```

## Required Patch Header

Every Echothink patch must start with a short header before the first `---`
diff marker.

Required format:

```text
# Echothink-Patch: NNNN-short-kebab-case-purpose
# Title: Human readable one-line title
# Area: branding | defaults | new-tab | first-run | extension | search | login | device-identity | proof-helper | echo-router | windows-packaging | docs
# Depends-On: none | echothink/NNNN-name.patch
# Browser-Layer-Reason: Why this belongs in the browser rather than a backend service.
# Preferred-Surface-Checked: policy | preference | extension | existing-hook | native-required
# Security-Critical-Areas: none | list any touched protected areas
# Native-Files-Touched: short list of Chromium paths touched by this patch
# Rebase-Risk: low | medium | high
# Validation: command or manual validation expected for this patch
```

Header rules:

- `Browser-Layer-Reason` must explain why the change cannot live only in
  Echothink services.
- `Preferred-Surface-Checked` must show that policy, preferences, extension
  APIs, or existing Chromium hooks were considered before native patching.
- `Security-Critical-Areas` must be `none` for normal Alpha patches.
- If `Security-Critical-Areas` is not `none`, the patch is blocked until a
  separate security review explicitly approves the exception.
- `Native-Files-Touched` should name Chromium paths, not broad subsystems.
- `Validation` must be specific enough for another engineer to run or repeat.

Example:

```text
# Echothink-Patch: 0003-new-tab-and-first-run
# Title: Route New Tab to Echothink workspace
# Area: new-tab
# Depends-On: echothink/0002-default-policies-and-preferences.patch
# Browser-Layer-Reason: New Tab routing is a browser entry point and must have a local fallback before remote app content loads.
# Preferred-Surface-Checked: preference, existing-hook
# Security-Critical-Areas: none
# Native-Files-Touched: chrome/browser/chrome_content_browser_client.cc
# Rebase-Risk: medium
# Validation: Apply inherited patches then this patch; launch and verify New Tab route.
```

## Preferred Surfaces Before Native Patching

Future tasks must use these surfaces before native Chromium patching is allowed:

| Change type | Required first choice |
|---|---|
| Homepage, startup URLs, default New Tab URL, default search provider, suggest URL, and default bookmarks | Policy, master preferences, or existing preference hooks |
| User-visible browser defaults | Policy or profile/local-state preference registration |
| New Tab route | Existing custom NTP hook or preference before a new native pathway |
| First-run copy and setup links | Existing WebUI registration pattern with local static content only |
| Side Panel shell, chat UI, workspace context UI, scope selector, and local service states | Bundled trusted Manifest V3 extension |
| Chat orchestration, workspace content, search ranking, workflow execution, authorization, and business pages | Backend service or web app, not native browser patch |
| Extension-host communication | Narrow extension API or browser component bridge with explicit allowlist |
| Device private key operations | Native helper/component only when the private key never enters extension JavaScript |
| Request proof signing | Narrow browser-side helper with Echothink-domain signing allowlist |
| Optional `echo://` routes | Minimal route resolver to HTTPS Echothink URLs only |
| Windows application identity and installer metadata | Packaging/resource patch only after branding and asset decisions exist |

Native patching is allowed only when:

- The change is part of the browser shell or local trust boundary.
- A policy, preference, extension, or web-app implementation cannot satisfy the
  requirement.
- The patch uses the smallest stable Chromium insertion point already
  identified by a task note.
- The patch does not replace inherited Chromium primitives.
- The patch has a clear validation command or manual smoke step.

## Forbidden Native Changes

Echothink Alpha patches must not alter these Chromium areas:

- Network stack behavior.
- TLS or certificate validation.
- Sandbox model.
- Renderer process model or rendering engine internals.
- Download manager behavior or download safety handling.
- History database or history manager behavior.
- Bookmark manager or bookmark storage behavior.
- Password manager behavior or credential storage.
- Cookie behavior, site storage, or storage partitioning.
- DevTools behavior.

Allowed narrow exceptions:

- Default bookmarks may be seeded through policy or preferences, but native
  bookmark manager behavior must remain inherited.
- Downloads, history, bookmarks, passwords, cookies, and DevTools may be
  mentioned in docs or smoke tests, but not changed by Echothink Alpha patches.
- A future security-critical exception requires a dedicated task, written
  security review, owner approval, and explicit validation before a patch can be
  added to `patches/series`.

## Review Checklist For New Echothink Patches

Before adding a patch:

- Confirm the task prerequisite chain is marked `DONE` or explicitly accepted in
  `docs/progress.md`.
- Confirm the patch belongs under `patches/echothink/`.
- Confirm the patch has the required header.
- Confirm the patch is small and single-purpose.
- Confirm policy, preference, extension, web-app, or existing-hook options were
  checked first.
- Confirm no forbidden native area is touched.
- Confirm `patches/series` places the patch after inherited patches.
- Confirm no placeholder series entries are introduced.
- Confirm validation steps are recorded in the task note and `progress.md`.

Before merging or handing off:

- Run path validation for the patch file and its `patches/series` entry.
- Run patch application validation when a Chromium source tree is available.
- Record whether validation was run against remote pristine Chromium, local
  pristine Chromium, or was deferred with a concrete command.
- Update docs if the patch changes a public browser route, policy, preference,
  extension permission, or Windows packaging identity.

## Chromium Rebase Checklist

For every Chromium pin or Ungoogled Chromium rebase:

- Record the old and new `chromium_version.txt` values.
- Record the old and new `revision.txt` values.
- Revalidate inherited patch order before Echothink patches.
- Confirm every `patches/echothink/*.patch` entry still appears after inherited
  patches in `patches/series`.
- Apply inherited patches first, then Echothink patches.
- Resolve conflicts by keeping each Echothink patch single-purpose; split broad
  repairs into new patches if needed.
- Recheck every patch header, especially `Native-Files-Touched`,
  `Security-Critical-Areas`, and `Rebase-Risk`.
- Drop or shrink Echothink patches when Chromium or Ungoogled Chromium now
  provides the same behavior.
- Re-run native browser regression checks for tabs, windows, downloads,
  history, bookmarks, password manager, cookies, TLS, DevTools, and extensions
  when any nearby native file changes.
- Re-run Echothink behavior checks for branding, New Tab, first-run, search,
  Side Panel, login gate, device identity, proof helper, and Windows packaging
  when those patches exist.
- Record all validation commands and results in `docs/progress.md`.

## T01 Outcome

The Echothink patch discipline is defined. Future implementation tasks can use
this document to create isolated, reviewable patches without changing inherited
Chromium behavior outside the approved browser shell.
