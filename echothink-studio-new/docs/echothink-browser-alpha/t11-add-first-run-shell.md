# T11 Add First-Run Shell

Date: 2026-05-28
Wave: W4
Delivery target: M2 — first-run gate shell
Status: DONE

## Prerequisite Check

| Prerequisite | Status in `docs/progress.md` | Notes |
|---|---|---|
| T10 — Implement New Tab route and fallback | DONE | Created `chrome://echothink-first-run` (the local first-run / New Tab fallback shell) in `patches/echothink/0003-new-tab-and-first-run.patch` and opened it as the first first-run tab, additively, alongside the inherited `chrome://ungoogled-first-run` how-to tab and the normal-profile first-run tabs. T10's note explicitly defers the *gating* (when first run should present only the shell, and the login/enrollment redirect) to T11/T20. |

T10 is DONE. The canonical-root mismatch recorded by T00 is carried forward: the
requested root `echothink-studio-new` contains only `docs/`, while the inherited
Ungoogled Chromium patch/config tree lives one directory up. This patch artifact
is therefore placed in the inherited tree's `patches/echothink/` alongside the
existing Echothink patches, consistent with T05/T06/T08/T10/T19.

## Scope: Where T11 Sits Between T10 And T20/T21

The first-run / login-gate work is split across four tasks. Keeping the
boundaries explicit avoids overlap and patch collisions:

| Task | Owns | Artifact |
|---|---|---|
| T10 | The local first-run gate **shell page** `chrome://echothink-first-run` (static, offline, links to sign-in / enrollment / diagnostics / update / support) and opening it on first run (additively). | `echothink/0003-new-tab-and-first-run.patch` |
| **T11 (this task)** | The first-run **gate** itself: on first launch present **only** the gate shell and **not** the normal general-purpose browser (workspace / New Tab / inherited how-to). | `echothink/0011-first-run-gate-shell.patch` |
| T20 | Spec: local auth/device readiness flags, the unauthenticated navigation allowlist, blocked-navigation behavior, and how successful setup unlocks normal browsing. | (spec doc) |
| T21 | Implementation of the ongoing login-required startup gate: navigation allowlist enforcement, blocked-navigation explanation page, and restoring normal Chromium browsing after setup. | `echothink/0006-login-gate.patch` |

T11 is intentionally the smallest possible change: it reuses the existing shell
page (no second page) and only changes *what the browser opens at first launch*.
It does **not** add navigation interception — after the first-run tab opens, the
user is not yet prevented from typing another URL. That ongoing enforcement is
T21's `0006-login-gate.patch`.

## What Was Implemented

Created `patches/echothink/0011-first-run-gate-shell.patch` and appended
`echothink/0011-first-run-gate-shell.patch` to the Echothink tail of
`patches/series` (after `echothink/0005-default-search-provider.patch`).

The patch makes a single, narrow, first-run-only edit to
`chrome/browser/chrome_browser_main.cc`, inside the existing
`ChromeBrowserMainParts::PreCreateThreads` first-run block
(`if (first_run::IsChromeFirstRun())`). After T10's `0003`, that block opened
three sets of first-run tabs:

```cpp
browser_creator_->AddFirstRunTabs({GURL("chrome://echothink-first-run")});   // 0003 (T10)
browser_creator_->AddFirstRunTabs({GURL("chrome://ungoogled-first-run")});   // inherited first-run-page.patch
browser_creator_->AddFirstRunTabs(master_prefs_->new_tabs);                  // normal-profile first-run / workspace tabs
```

T11 replaces those three with a single call so the **only** first-run tab is the
Echothink gate shell:

```cpp
// Echothink Browser first-run gate shell (T11). On first launch present ONLY
// the local Echothink first-run gate shell ...
browser_creator_->AddFirstRunTabs({GURL("chrome://echothink-first-run")});
```

Effect:

- **First launch leads to login/enrollment.** The single first-run tab is
  `chrome://echothink-first-run`, whose primary section links to
  `https://auth.echothink.ai/login` (Sign in) and
  `https://auth.echothink.ai/device/enroll` (Enroll this device).
- **First run does not present a normal general-purpose browser before setup.**
  The normal-profile New Tab / startup tabs (`master_prefs_->new_tabs`, which
  route to the general-purpose workspace `https://app.echothink.ai/newtab`) and
  the inherited `chrome://ungoogled-first-run` how-to tab are not opened during
  first run.
- **The shell is reused, minimal, and service-oriented.** No new page is added;
  the existing static, script-free, offline-capable `chrome://echothink-first-run`
  shell from `0003` is the gate destination.
- The guard is unchanged: the edit is inside `if (first_run::IsChromeFirstRun())`
  and keeps the inherited `--app` / `--app-id` switch checks, so only the first
  launch on a fresh profile is affected. Non-first-run startup, and a New Tab
  resolving to `https://app.echothink.ai/newtab` (seeded by `0002`), are
  unchanged.

### Native files touched

| File | Change |
|---|---|
| `chrome/browser/chrome_browser_main.cc` | Gate the first-run `AddFirstRunTabs` block so the Echothink first-run shell is the sole first-run tab (suppress the inherited how-to tab and the normal workspace/New Tab first-run tabs). |

## Patch Numbering

The change plan's recommended numbers are 1:1 with other concerns and are
reserved by task: `0004` = bundled-workspace-extension (T13, parallel in W4),
`0006` = login-gate (T21), `0007`–`0010` = device identity / request-proof /
echo router / packaging. T11 is an extra decomposed first-run task with no
reserved number, so to avoid pre-empting any task-owned patch this patch uses
`0011`, appended at the Echothink series tail. Series **order** (not the integer)
governs application: `0011` sorts after `0003`, so the first-run block `0003`
introduced is already present when `0011` applies. The repo already tolerates a
numbering gap (`0004` is unfilled); once T13/T21/T22+ land, the series fills in.

## Protected-Area Compliance

- No change to the network stack, TLS validation, sandbox, renderer internals,
  downloads, history, bookmarks, password manager, cookies, or DevTools.
- No navigation throttle / interception is added (that is T21). T11 changes only
  which local tabs open at first run.
- No policy or preference change; no new page; no business/workflow logic. The
  reused shell contains only the product name, an explanatory sentence, and
  static links to the allowed unauthenticated destinations.
- The inherited `chrome://ungoogled-first-run` how-to page is preserved as a
  reachable URL; it is only omitted from the gated first-run tab set.

## Delivery Criteria Mapping

| Criterion | Status | Evidence |
|---|---|---|
| First-run gate shell exists | Met | `chrome://echothink-first-run` (shell, from `0003`) is established as the sole first-run surface by `echothink/0011-first-run-gate-shell.patch`. |
| First launch leads to login/enrollment | Met | The single first-run tab is the gate shell, whose primary CTAs are Sign in (`auth.echothink.ai/login`) and Enroll this device (`auth.echothink.ai/device/enroll`). |
| Shell has no business workflow logic | Met | Reuses the static, script-free shell; the patch only changes the first-run tab set. No workspace data, no orchestration, no policy/pref change. |
| First-run does not present a normal general-purpose browser before setup | Met | `master_prefs_->new_tabs` (workspace/New Tab) and the inherited how-to tab are not opened during first run. |

## Validation

Run from the inherited repository root.

| Command | Result |
|---|---|
| `git apply --numstat patches/echothink/0011-first-run-gate-shell.patch` | exit 0 — parses cleanly: `12 3 chrome/browser/chrome_browser_main.cc`. |
| `python3 devutils/check_patch_files.py` | exit 0 — patch parses, is referenced in `series`, no duplicates, no unused patches. |
| `python3 devutils/check_gn_flags.py` | exit 0. |
| `python3 devutils/validate_config.py` | exit 0 (clean on POSIX). |
| Series file-mapping loop (every non-comment entry maps to a file) | `missing_count=0`; Echothink tail is `0001, 0002, 0003, 0005, 0011`, contiguous after all inherited patches. |
| Real `patch -p1` against a reconstructed post-`0003` `chrome_browser_main.cc` | Applied cleanly (dry-run exit 0, then applied): the resulting first-run block contains only `AddFirstRunTabs({GURL("chrome://echothink-first-run")})`; the `chrome://ungoogled-first-run` and `master_prefs_->new_tabs` lines are removed. |

## Known Limitations

- No full Chromium source checkout exists locally (per T03/T08/T10), so real
  `patch -p1` was validated against a reconstructed fragment of the post-`0003`
  first-run block, not against the full pinned tree, and no runtime browser
  smoke test was run. The `@@` line numbers are anchored on the post-`0003`
  block and rely on `patch -p1` offset tolerance; exact offsets must be
  confirmed at build time against pinned Chromium `148.0.7778.178`. The
  documented application/smoke command is in the patch header (`Validation:`).
- T11 is the first-run *presentation* gate only. It does not block ongoing
  navigation after the first-run tab opens, does not track auth/device readiness
  flags, and does not restore normal browsing after setup — those are owned by
  T20 (spec) and T21 (`echothink/0006-login-gate.patch`). Until T21 lands, a
  determined user can navigate away from the gate shell on first run.
- Suppressing `master_prefs_->new_tabs` at first run also suppresses any
  enterprise-configured `first_run_tabs` for that first launch; this is
  intentional for a gated first launch and is documented for T30/T31 packaging.
- `chrome://echothink-diagnostics`, referenced by the reused shell, is still a
  known dead `chrome://` link until its owning task lands (see T10 note).
