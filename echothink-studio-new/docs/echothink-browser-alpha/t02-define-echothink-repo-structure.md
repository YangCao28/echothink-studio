# T02 Define Echothink Repo Structure

Date: 2026-05-28
Wave: W2
Delivery target: M0 repo skeleton plan
Status: DONE

## Prerequisite Check

T02 depends on T01. `docs/progress.md` marks T01 as `DONE`, and T01 in turn
records T00 as `DONE`. The patch discipline established by
`docs/echothink-browser-alpha/t01-define-echothink-patch-discipline.md` is the
authority this skeleton plan builds on.

This task produces documentation only. It does not create
`patches/echothink/`, `extensions/echothink-workspace/`, `assets/`, or
`build/windows/`; it does not add an Echothink patch; and it does not modify
`patches/series`. Directories are created by the later tasks that first place
real content in them.

## Canonical Root Note

The requested browser repository root is:

```text
C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new
```

As recorded by T00, that path currently contains only `docs/`. The inherited
Ungoogled Chromium patch/config tree (the real browser repo, holding
`patches/`, `utils/`, `devutils/`, `chromium_version.txt`, etc.) lives one
directory up at:

```text
C:\Users\caoya\source\repos\echothink-studio
```

All repo-relative paths in this plan (`patches/echothink/`,
`extensions/echothink-workspace/`, `assets/`, `build/windows/`) are defined
relative to that canonical browser repo root — the directory that already owns
`patches/series`. The root mismatch is carried forward as an acceptable
baseline dependency for this docs-only task and must be resolved (make
`echothink-studio-new` the real browser repo, or re-point the canonical root)
by the first task that physically creates these directories — primarily
T05/T06 (branding/assets), T08 (defaults), and T12 (extension scaffold).

## Skeleton Overview

The Echothink layer is added as a small, clearly separated set of top-level
paths beside the inherited Ungoogled Chromium tree. Nothing inherited is moved
or renamed.

```text
<browser-repo-root>/
  # --- inherited, untouched ---
  chromium_version.txt
  revision.txt
  flags.gn
  downloads.ini
  pruning.list
  domain_regex.list
  domain_substitution.list
  utils/
  devutils/
  patches/
    series                      # inherited entries first; Echothink tail appended later
    upstream-fixes/
    core/
    extra/

  # --- Echothink additions (created by later tasks, not by T02) ---
  patches/
    echothink/                  # Echothink-owned native patches (T05, T08, T10, ...)
  extensions/
    echothink-workspace/        # bundled trusted MV3 workspace extension (T12)
  assets/                       # branding + installer + about assets (T06)
    icons/
    installer/
    about/
  build/
    windows/                    # Windows build/signing/smoke docs (T32)
  docs/                         # this plan and all Echothink Alpha docs
```

## Path Definitions

### `patches/echothink/`

- Owner: Echothink browser team.
- Purpose: holds every Echothink-owned native Chromium patch, isolated from the
  inherited `upstream-fixes/`, `core/`, and `extra/` layers.
- Expected contents (filenames fixed by the T01 recommended Alpha order; each
  file is created only by its owning implementation task):
  ```text
  0001-branding.patch                          # T05
  0002-default-policies-and-preferences.patch  # T08
  0003-new-tab-and-first-run.patch             # T10
  0004-bundled-workspace-extension.patch       # T13
  0005-default-search-provider.patch           # T19
  0006-login-gate.patch                        # T21
  0007-device-identity.patch                   # T23
  0008-request-proof-helper.patch              # T26
  0009-echo-protocol-router.patch              # T28
  0010-windows-packaging-identity.patch        # T31
  ```
- Rules: naming, headers, single-purpose sizing, forbidden native areas, and
  ordering all follow
  `docs/echothink-browser-alpha/t01-define-echothink-patch-discipline.md`. No
  Echothink patch may live under an inherited namespace; no inherited patch may
  move into `echothink/`.
- Creation trigger: this directory comes into existence when T05 writes
  `0001-branding.patch`. T02 does not create it.

### `extensions/echothink-workspace/`

- Owner: Echothink browser team.
- Purpose: the single bundled, trusted Manifest V3 extension that implements the
  Side Panel workspace shell. It is the only extension Echothink adds; the
  inherited extension permission model is otherwise preserved.
- Expected contents (scaffolded by T12; later tasks fill in behavior):
  ```text
  manifest.json        # MV3 manifest; narrow permissions + Echothink host allowlist
  background.js        # service worker / side panel registration
  sidepanel.html       # Side Panel shell markup
  sidepanel.js         # mode selector, chat + workspace-context shells
  sidepanel.css        # Side Panel styling
  content_bridge.js    # page-context bridge to the narrow device/proof API
  assets/              # extension-local icons and static UI assets
  ```
- Expected `manifest.json` shape (authority is T12; recorded here for skeleton
  completeness):
  - `manifest_version: 3`
  - permissions: `sidePanel`, `storage`, `tabs`, `activeTab`, `scripting`
  - host_permissions limited to Echothink-owned domains:
    `https://app.echothink.ai/*`, `https://auth.echothink.ai/*`,
    `https://api.echothink.ai/*`, `https://search.echothink.ai/*`
- Rules: no business/workflow logic; no conversation persistence or model
  orchestration; never receives device private-key material (only the narrow
  bridge methods from T24). Bundling into the browser is done by the separate
  patch `echothink/0004-bundled-workspace-extension.patch` (T13), not by adding
  the source folder.
- Creation trigger: T12 scaffolds this folder. T02 does not create it.

### `assets/`

- Owner: Echothink branding/packaging.
- Purpose: source-of-truth visual assets referenced by the branding patch and
  Windows packaging, kept out of the patch files themselves so binaries are not
  embedded in diffs.
- Expected contents (populated by T06; sizes/specs owned by T04 and T30):
  ```text
  icons/        # app icon set (Windows Alpha sizes per T04)
  installer/    # installer bitmaps / setup imagery (dimensions per T30/T32)
  about/        # About-page and first-run visual assets
  ```
- Rules: each asset must be documented with source, ownership, and required
  size in the T06 asset note. Generated/derived image variants are not checked
  in unless they are the canonical shipped asset (see "Placeholder Docs And
  Generated Artifacts").
- Creation trigger: T06 adds the first real asset. T02 does not create it.

### `build/windows/`

- Owner: Echothink Windows packaging/release.
- Purpose: Windows-first build, signing, channel, and smoke-test documentation
  and any thin packaging helper scripts. Windows is the first production target.
- Expected contents (authored by T32; identity/channels decided by T30):
  ```text
  README.md       # how to produce a Windows Alpha build from the repo
  signing.md      # signing workflow and certificate handling notes
  smoke_test.md   # post-install smoke procedure (launch, New Tab, Side Panel, search, restart, uninstall)
  channels.md     # Canary / Dev / Beta / Stable / Enterprise Stable channel + update-metadata notes
  ```
- Rules: documentation and packaging glue only. This path does not implement
  backend update services; it records the browser-side update URL/channel
  contract when the update service is available.
- Creation trigger: T32 (with identity inputs from T30/T31). T02 does not
  create it.

### Supporting docs (`docs/` and `docs/echothink-browser-alpha/`)

- Owner: Echothink browser team.
- Purpose: the planning and convention surface. `docs/` holds the broad Alpha
  documents (change plan, construction plan, DAG, defaults, branding inventory,
  this skeleton plan, plus future backend-contract / release-checklist /
  security-model docs as referenced by the construction plan). `progress.md`
  remains the shared source of truth for task status.
- Rules: per the global coordination rules, documentation is created or updated
  only under `docs/`. Per-task notes live under
  `docs/echothink-browser-alpha/tNN-...md`.

## When `patches/series` Entries May Be Added

This restates and applies the T01 ordering rules to the skeleton:

- An `echothink/NNNN-...patch` line may be added to `patches/series` **only
  when the corresponding patch file already exists** under `patches/echothink/`
  and is intended to be active in the ordered build pipeline.
- Placeholder or commented-out future entries are **forbidden**. The series must
  never reference a patch file that does not exist.
- All Echothink entries form a contiguous tail block appended **after every
  inherited entry**. The current final inherited entry is
  `extra/ungoogled-chromium/add-flag-for-disabling-jit.patch`; the first
  Echothink entry (`echothink/0001-branding.patch`, added by T05) goes
  immediately after the inherited block.
- Entries use slash-delimited paths relative to `patches/` (e.g.
  `echothink/0001-branding.patch`).
- Inherited entries and their order are not edited by Echothink tasks. Any fix
  to inherited tooling/order is a separate, explicitly documented
  inherited-pipeline task, not an Echothink product change.
- Ordering inside the Echothink tail follows dependency order (the T01
  recommended Alpha sequence), not author or convenience.

T02 adds **zero** entries; the series stays inherited-only (108 entries) until
T05 lands the first patch.

## How Placeholder Docs And Generated Artifacts Are Treated

- **No placeholder directories.** Git does not track empty directories, and the
  patch discipline forbids placeholder series entries. Each Echothink path is
  materialized by the task that first puts real content in it, not preemptively.
- **No placeholder/stub patch files.** A `.patch` file appears only when it
  contains a real, single-purpose diff with the required T01 header.
- **Docs are real or absent.** A doc is added when it has actual content. Future
  docs named in the construction plan (`backend_contracts.md`,
  `release_checklist.md`, `security_model.md`) are owned by their later tasks;
  this plan does not stub them.
- **Generated build artifacts are never committed.** Chromium source
  checkouts, `out/` build trees, downloaded archives, pruned trees,
  domain-substituted trees, compiled binaries, and produced installers are
  build outputs, not repository sources. They must stay ignored, consistent with
  the inherited tooling.
- **Derived assets:** only the canonical shipped asset is committed under
  `assets/`. Transient resized/exported variants produced by a build step are
  treated as generated artifacts and are not checked in.
- **Capacity to evolve:** if a later task needs a new top-level Echothink path
  not listed here, it must extend this skeleton plan (and the construction
  plan's repository-shape section) rather than scatter ad-hoc folders.

## Relationship To Inherited Tooling

- The inherited patch pipeline (download → prune → apply inherited patches →
  apply Echothink patches → domain substitution → GN → build → package) is
  unchanged. Echothink patches insert only at the "apply Echothink patches"
  step, after inherited patches.
- `utils/`, `devutils/`, `patches/series` parsing, `downloads.ini`,
  `pruning.list`, `domain_regex.list`, and `domain_substitution.list` are not
  modified by repo-structure work.
- New top-level Echothink folders (`extensions/`, `assets/`, `build/`) sit
  beside the inherited tree and are ignored by inherited patch tooling, so they
  do not disturb existing validation.

## Validation

This is a discovery/spec task, validated by checking source paths and linking
decisions to concrete files. Commands were run from the canonical browser repo
root (the inherited tree root in this local checkout).

| Command | Result |
|---|---|
| Target-path existence check for `patches/echothink`, `extensions`, `extensions/echothink-workspace`, `assets`, `build`, `build/windows` | All MISSING — confirms T02 introduces no directories and the skeleton is a plan, as intended. |
| `patches/` layer listing | `core/`, `extra/`, `upstream-fixes/` present; no `echothink/` — inherited layers untouched. |
| Non-blank `patches/series` entry count | `108` — unchanged from the T00/T03 baseline. |
| `grep -c echothink patches/series` | `0` — no Echothink series entries; series remains inherited-only. |
| `patches/series` tail check | Final inherited entry is `extra/ungoogled-chromium/add-flag-for-disabling-jit.patch`, matching the documented insertion point for the future Echothink tail. |
| Cross-reference check against T01 discipline and the construction-plan repo shape | Path names, ordering rules, and patch filenames in this plan match `t01-define-echothink-patch-discipline.md` and `echothink_browser_construction.md` section 4. |

No patch was created, no directory was created, `patches/series` was not
modified, and no Chromium download/build/packaging step was run.

## Known Limitations

- T02 does not physically create any Echothink directory; downstream tasks
  (T05/T06/T08/T12/T32) materialize them when they add real content.
- The canonical-root mismatch from T00 remains unresolved. The first task that
  physically creates `patches/echothink/`, `extensions/echothink-workspace/`,
  `assets/`, or `build/windows/` must either make `echothink-studio-new` the
  real browser repo or re-point the canonical root, and must record that
  decision in `docs/progress.md`.
- Exact `manifest.json` fields, asset dimensions, and Windows channel/update
  metadata are owned by T12, T06/T04, and T30/T32 respectively; this plan fixes
  only their location and purpose, not their final contents.

## T02 Outcome

The Echothink repository skeleton is defined: four Echothink-owned paths plus
the docs surface, each with an owner, a purpose, expected contents, and a
creation trigger. Series-entry timing and the treatment of placeholders and
generated artifacts are specified so later tasks can add isolated, reviewable
content without disturbing the inherited Ungoogled Chromium pipeline.
</content>
</invoke>
