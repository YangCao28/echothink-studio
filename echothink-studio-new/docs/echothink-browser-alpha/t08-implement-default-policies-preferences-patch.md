# T08 Implement Default Policies And Preferences Patch

Date: 2026-05-28
Wave: W2
Prerequisites: T01, T07
Delivery target: M1 `patches/echothink/0002-default-policies-and-preferences.patch`
Status: DONE

## Prerequisite Check

| Prereq | Required for | Status in `docs/progress.md` |
|---|---|---|
| T01 | Echothink patch discipline (namespace, naming, header, series ordering) | DONE |
| T07 | Default URL/search/bookmark spec and preferred surfaces | DONE |
| T09 (related) | New Tab insertion-point decision reused by this patch | DONE |

All prerequisites are `DONE`. The T00 canonical-root mismatch is carried forward
as an accepted baseline dependency: planning docs live under
`echothink-studio-new/docs`, while the inherited Ungoogled Chromium patch/config
tree (where this patch is added) is the repository root one level up. No
Chromium source checkout is present locally, so patch application is validated by
structure/parse here and deferred to the build pipeline (consistent with T03).

## What This Patch Does

Single-purpose theme: seed Echothink first-run defaults without changing native
Chromium primitives. Delivered as the first Echothink patch:
`patches/echothink/0002-default-policies-and-preferences.patch`.

| Default | Value | Surface used | Override-safe? |
|---|---|---|---|
| Default search provider | `Echothink Search`, keyword `echothink.ai`, `https://search.echothink.ai/search?q={searchTerms}` | Re-point the inherited "No Search" prepopulated engine slot (`SEARCH_ENGINE_GOOGLE`) in `prepopulated_engines.json` | Yes — DefaultSearchProvider policy and user choice still override |
| Suggest URL | `https://search.echothink.ai/suggest?q={searchTerms}` | Same prepopulated engine entry (`suggest_url` field, enabled by inherited `add-suggestions-url-field.patch`) | Yes — suggestions stay disabled by default per inherited baseline |
| New Tab (normal profile) | `https://app.echothink.ai/newtab` | Inherited `HandleNewTabPageLocationOverride()` empty-branch fallback in `chrome_content_browser_client.cc` | Yes — explicit `kNewTabPageLocationOverride` / NewTabPageLocation policy and `--custom-ntp` still win; incognito untouched |
| Homepage | `https://app.echothink.ai/dashboard` (`homepage_is_newtabpage = false`) | Chromium initial preferences file | Yes — HomepageLocation policy and user setting override |
| Startup | Restore-on-startup = open URL list → `https://app.echothink.ai/dashboard` | Chromium initial preferences file | Yes — RestoreOnStartup policy and user setting override |
| Default bookmarks | Workspace, New Tab, Search, Support, Browser Download, Browser Updates | Netscape bookmarks file imported via initial preferences `import_bookmarks_from_file` | Yes — editable user bookmarks; native bookmark manager unchanged |

### Why each surface

- **Search provider — prepopulated engine edit.** The inherited
  `replace-google-search-engine-with-nosearch.patch` already neutralizes the
  default engine slot. Re-pointing that same slot to Echothink Search is the
  smallest, most reliable way to make the omnibox default resolve to Echothink
  while leaving the DefaultSearchProvider policy and user choice intact. This is
  the established mechanism in this repo for the default engine.
- **New Tab — inherited custom-ntp hook.** T09 selected
  `HandleNewTabPageLocationOverride()`. This patch only seeds the
  normal-profile, no-override fallback (when both the
  `kNewTabPageLocationOverride` preference and the `--custom-ntp` switch are
  empty). Incognito behavior and any explicit pref/policy/switch value are
  preserved, so enterprise policy and users can still override the New Tab route.
  The local fallback/first-run page remains owned by the new-tab/first-run task
  (`0003`).
- **Homepage / startup / bookmarks — initial preferences.** T07's first
  preferred surface is "installer-provided initial preferences." Initial
  preferences are recommended distribution defaults, not locked policy, so user
  settings and enterprise policy override them normally. This avoids touching the
  bookmark manager, history, or session-restore internals. Windows packaging
  (T30) installs `initial_preferences.json` as the browser's `initial_preferences`
  file and ships the bookmarks file alongside it.

## Files In The Patch

New Echothink patch:

- `patches/echothink/0002-default-policies-and-preferences.patch`

Series update:

- `patches/series` — appended an Echothink tail block (a comment line plus
  `echothink/0002-default-policies-and-preferences.patch`) after the final
  inherited entry `extra/ungoogled-chromium/add-flag-for-disabling-jit.patch`.

Chromium source files touched by the patch hunks (applied during build):

- `third_party/search_engines_data/resources/definitions/prepopulated_engines.json` (edit)
- `chrome/browser/chrome_content_browser_client.cc` (edit)
- `chrome/browser/resources/echothink/initial_preferences.json` (new file)
- `chrome/browser/resources/echothink/echothink_bookmarks.html` (new file)

## Ordering And Dependencies

- The patch is the tail block of `patches/series`, after all 108 inherited
  entries, per T01.
- Two hunks edit context introduced by inherited patches, so this patch **must**
  apply after them (recorded in the patch header `Inherited-Depends-On`):
  - `core/ungoogled-chromium/replace-google-search-engine-with-nosearch.patch`
    (the `prepopulated_engines.json` "No Search" slot).
  - `extra/ungoogled-chromium/add-flag-for-custom-ntp.patch` (the
    `HandleNewTabPageLocationOverride()` body and the `kNewTabPageLocationOverride`
    read).
- No dependency on another Echothink patch (`Depends-On: none`).

## Enterprise / Native Preservation

- No locked/mandatory policy is introduced. All seeded values are defaults that
  user settings and enterprise policy can override.
- DevTools, password manager, downloads, history, cookies/site storage,
  bookmarks storage, TLS/cert validation, sandbox, renderer internals, and the
  network stack are not modified.
- Inherited defaults are preserved: search suggestions stay disabled by default,
  bookmark bar stays enabled, third-party cookies stay blocked, password saving
  and auto sign-in stay disabled (per T07 "Inherited Defaults To Preserve").
- Incognito New Tab behavior is unchanged.

## Validation

Performed locally (no Chromium checkout present; patch application is the build
pipeline's job, deferred per T03):

| Check | Command | Result |
|---|---|---|
| Patch placement | `ls patches/echothink/` | `0002-default-policies-and-preferences.patch` present. |
| Series entry present, after inherited patches | `grep -n "echothink/" patches/series` | Single entry at the tail block (line 113), after inherited tail `add-flag-for-disabling-jit.patch`. |
| Every series entry maps to a file | shell loop over `patches/series` | `missing_count=0`. |
| Repo config validation | `python3 devutils/validate_config.py` | Exit 0, clean (no unused-patch, duplicate, or readability warnings). Runs clean on POSIX, unlike the Windows path-separator issue noted for T00/T03. |
| Patch-file checks | `python3 devutils/check_patch_files.py` | Exit 0, clean. |
| GN flag check | `python3 devutils/check_gn_flags.py` | Exit 0. |
| Unified-diff parse | `git apply --stat` / `git apply --numstat` | Parses cleanly: prepopulated_engines.json +5/-4, chrome_content_browser_client.cc +6, initial_preferences.json +32, echothink_bookmarks.html +15. |

Patch application command for the build pipeline / a reviewer with a pinned
Chromium tree:

```text
# from the unmodified Chromium 148.0.7778.178 source root, after inherited patches:
patch -p1 < <repo>/patches/echothink/0002-default-policies-and-preferences.patch
```

Or via the repo tooling against a local pristine Chromium tree:

```text
python3 devutils/validate_patches.py --local <path-to-unmodified-chromium-src>
```

## Known Limitations

- No Chromium source checkout exists locally, so the two edit hunks were authored
  against context that inherited patches prove exists in the pinned tree
  (post-`nosearch` for `prepopulated_engines.json`; post-`add-flag-for-custom-ntp`
  for `chrome_content_browser_client.cc`). Hunk line numbers are approximate;
  GNU `patch` tolerates line offset but not context fuzz. Exact context must be
  re-confirmed at build time and on every Chromium rebase.
- Homepage, startup URL, and default bookmarks take effect only once Windows
  packaging (T30) installs `initial_preferences.json` (and the bookmarks file)
  as the browser's initial preferences. The patch commits the canonical content;
  the packaging wiring is T30's responsibility.
- Backend availability of `app.echothink.ai`, `search.echothink.ai`,
  `updates.echothink.ai` routes is not validated; these are browser route
  contracts only.
- `0003-new-tab-and-first-run` owns the local New Tab fallback page and first-run
  flow; this patch only seeds the default New Tab route value.
- `validate_patches.py --remote` remains blocked by the inherited Chromium `DEPS`
  parser issue documented in T03, so remote patch application could not be run.

## Follow-Up

- T10 (`0003-new-tab-and-first-run`): local fallback/first-run page; may build on
  the New Tab default seeded here.
- T19: final default search provider behavior if split from T08.
- T30 (Windows packaging): install `initial_preferences.json` + bookmarks file as
  the browser initial preferences; confirm first-run defaults on a clean install.
- Every Chromium rebase: re-verify the two edit hunks' context per the T01 rebase
  checklist.
