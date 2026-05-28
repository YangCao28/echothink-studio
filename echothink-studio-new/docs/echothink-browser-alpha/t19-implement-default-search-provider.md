# T19 Implement Default Search Provider

Date: 2026-05-28
Wave: W2
Prerequisites: T08
Delivery target: M1/M3 `patches/echothink/0005-default-search-provider.patch`
Status: DONE

## Prerequisite Check

T19 depends on T08. This worktree was fast-forwarded from the local `master`
branch that contains T08, and `docs/progress.md` marks T08 as `DONE`.

T07 defines the search route contract:

```text
Search provider name: Echothink Search
Search keyword:       echothink.ai
Search URL:           https://search.echothink.ai/search?q={searchTerms}
Suggest URL:          https://search.echothink.ai/suggest?q={searchTerms}
```

The final implementation is split into
`patches/echothink/0005-default-search-provider.patch` so search-provider
behavior has its own small, single-purpose patch.

## What This Patch Does

`0005-default-search-provider.patch` configures Echothink Search without
rewriting omnibox internals:

- Re-points the inherited "No Search" prepopulated engine slot
  (`SEARCH_ENGINE_GOOGLE`) to Echothink Search.
- Adds the same provider values to the initial preferences file created by T08.
- Configures the suggest URL for use when suggestions are enabled.
- Leaves inherited search-suggestion enablement unchanged; suggestions remain
  disabled by default.
- Preserves direct URL navigation and native Chromium search-engine override
  behavior.

## Files Changed

- `patches/echothink/0002-default-policies-and-preferences.patch`
  - Search-provider values were split out so T19 owns them.
- `patches/echothink/0005-default-search-provider.patch`
  - New Echothink search-provider patch.
- `patches/series`
  - Added `echothink/0005-default-search-provider.patch` after
    `echothink/0002-default-policies-and-preferences.patch`.
- `docs/echothink-browser-alpha/t08-implement-default-policies-preferences-patch.md`
  - Updated T08 scope after the split.
- `docs/echothink-browser-alpha/t19-implement-default-search-provider.md`
  - New task note.
- `docs/progress.md`
  - Added T19 status, implementation notes, validation, and limitations.

## Ordering And Dependencies

Series tail after this task:

```text
echothink/0001-branding.patch
echothink/0002-default-policies-and-preferences.patch
echothink/0005-default-search-provider.patch
```

The sequence intentionally skips `0003` and `0004` until those task patches
exist. T01 allows adding active Echothink entries only when the patch file exists
and should be part of the ordered pipeline.

Patch dependencies:

- Depends on `echothink/0002-default-policies-and-preferences.patch` because T19
  edits the initial preferences file created by T08.
- Depends on inherited
  `core/ungoogled-chromium/replace-google-search-engine-with-nosearch.patch`
  because T19 re-points that patch's "No Search" slot.
- Uses the inherited suggest URL support from
  `extra/ungoogled-chromium/add-suggestions-url-field.patch`.

## Native Preservation

This task does not change:

- Omnibox internals beyond provider configuration.
- Direct URL navigation.
- Network stack behavior.
- TLS or certificate validation.
- Sandbox or renderer internals.
- Downloads, history, bookmarks, password manager, cookies, or DevTools.

DefaultSearchProvider policy and user search-engine choice remain the normal
Chromium override paths.

## Validation

Performed locally from the inherited canonical build root. No Chromium checkout
is present locally, so full patch application remains deferred to the build
pipeline.

| Check | Command | Result |
|---|---|---|
| T08 prerequisite | `rg -n "^\\| T08 \\|.*DONE" echothink-studio-new/docs/progress.md` | Passed. |
| Patch placement | `test -f patches/echothink/0005-default-search-provider.patch` | Passed. |
| Series order | `grep -n "echothink/" patches/series` | Passed: `0005` follows `0002` in the Echothink tail block. |
| Series file mapping | shell loop mapping every non-comment `patches/series` entry to a file | `missing_count=0`. |
| Config validation | `python3 devutils/validate_config.py` | Passed, exit 0. |
| Patch-file validation | `python3 devutils/check_patch_files.py` | Passed, exit 0. |
| GN flags validation | `python3 devutils/check_gn_flags.py` | Passed, exit 0. |
| Unified-diff parse | `git apply --stat patches/echothink/0005-default-search-provider.patch` and `git apply --numstat patches/echothink/0005-default-search-provider.patch` | Parses cleanly: `prepopulated_engines.json` +5/-4, `initial_preferences.json` +7. |

Build-pipeline application command:

```text
patch -p1 < patches/echothink/0005-default-search-provider.patch
```

Run that from the pinned Chromium `148.0.7778.178` source root after inherited
patches and after `patches/echothink/0002-default-policies-and-preferences.patch`.
The broader local-source validation command remains:

```text
python3 devutils/validate_patches.py --local <path-to-unmodified-chromium-src>
```

## Known Limitations

- No local Chromium checkout was available, so full patch application was not
  run.
- No browser build or omnibox smoke test was run in this environment.
- Backend availability of `https://search.echothink.ai/search` and
  `https://search.echothink.ai/suggest` was not validated; these are browser
  route contracts only.
