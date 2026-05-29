# Echothink Browser Alpha Agent Prompt Pack

Version: 1.0

Generated from the Browser-Only Task DAG for converting Ungoogled Chromium into Echothink Browser Alpha.


## Purpose

This document is a paste-ready prompt pack for assigning each DAG task to an implementation agent. It keeps all workers aligned on the same browser-only scope, the same mandatory reading document, the same shared progress file, and the same documentation-update rules.

The source DAG defines browser-only work, including patch organization, branding, defaults, New Tab, bundled extension, Side Panel modes, login gate, device identity, request proof helper, optional `echo://` routing, Windows packaging, and validation. It explicitly excludes backend service implementation, gateway implementation, search ranking, chat service implementation, workflow orchestration, and business pages.


## Global Paths


- Repository root: `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new`

- Mandatory change plan for every task: `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\ungoogled_to_echothink_browser_change_plan.md`

- Documentation root: `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs`

- Shared progress file: `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md`


## Shared Worker Instructions

Use this block at the top of every task prompt, or rely on the task-specific prompts below, which already include it.


```text
You are working in the Echothink Studio browser repository.

Before making changes, read:
1. `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\ungoogled_to_echothink_browser_change_plan.md`
2. `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md` if it exists
3. All docs under `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs` that are relevant to your task

You must maintain `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md` as the shared coordination file for all task progress.

You must update docs accordingly under:
`C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs`

You must keep this work browser-only. Do not implement backend services, search ranking, chat service orchestration, workflow orchestration, gateway logic, or business application pages.

You must preserve Chromium/Ungoogled Chromium native browser primitives unless the current task explicitly asks for a narrow browser-shell change.

At the end, report either DONE or BLOCKED. Do not claim DONE unless the required implementation/spec/docs/progress updates and local validation are complete.
```


## Recommended `progress.md` Format


```markdown
# Echothink Browser Alpha Progress

Last updated: YYYY-MM-DD HH:MM local time

## Current Wave Status

| Wave | Status | Notes |
|---|---|---|
| W0 | NOT_STARTED / IN_PROGRESS / DONE / BLOCKED | ... |

## Task Status Table

| Task | Wave | Owner | Status | Prerequisites Checked | Changed Files | Docs Updated | Validation | Blockers / Notes |
|---|---|---|---|---|---|---|---|---|
| T00 | W0 | ... | NOT_STARTED | N/A | ... | ... | ... | ... |

## Baseline Decisions

- Chromium pin:
- Repo revision:
- Patch pipeline baseline:
- Known inherited failures:
- Security-protected areas:

## Open Blockers

| Blocker ID | Affected Tasks | Description | Owner | Required Decision/File |
|---|---|---|---|---|

## Validation Reports

| Report | Task | Path | Status | Notes |
|---|---|---|---|---|

```


## Wave Plan


### Wave — Delivery Target


- Parallel tasks: `Parallel Tasks`

- Notes: Notes


### W0 — M0 baseline


- Parallel tasks: `T00`

- Notes: Establish repo truth before dependent work.


### W1 — M0/M1/M2 discovery


- Parallel tasks: `T01, T03, T04, T07, T09`

- Notes: Patch rules, validation, branding inventory, defaults, and New Tab hook can proceed independently after audit.


### W2 — M0/M1 implementation


- Parallel tasks: `T02, T05, T06, T08, T19`

- Notes: Repo structure, branding patch, assets, defaults patch, and search provider can run in parallel after their specs are ready.


### W3 — M2/M3/M7 setup


- Parallel tasks: `T10, T12, T30`

- Notes: New Tab implementation, extension scaffold, and Windows identity spec can proceed independently.


### W4 — M2/M3/M4/M7 integration


- Parallel tasks: `T11, T13, T20, T31`

- Notes: First-run shell, extension bundling, login gate spec, and packaging patch do not block each other.


### W5 — M3/M4/M5/M6/M7 implementation


- Parallel tasks: `T14, T21, T22, T28, T32`

- Notes: Side Panel entry, login gate, device design, optional route resolver, and Windows docs can run in parallel.


### W6 — M3/M5/M6 implementation


- Parallel tasks: `T15, T23, T29`

- Notes: Side Panel modes, DPAPI key storage, and invalid route fallback are independent after their parents.


### W7 — M3/M5 extension work


- Parallel tasks: `T16, T17, T24`

- Notes: Chat mode, Workspace Context mode, and device bridge can run together.


### W8 — M3/M5 hardening specs


- Parallel tasks: `T18, T25`

- Notes: Side Panel local states and proof payload spec can run after mode and bridge foundations.


### W9 — M5 proof helper


- Parallel tasks: `T26`

- Notes: Proof signing helper depends on proof spec.


### W10 — M5 proof integration


- Parallel tasks: `T27`

- Notes: Extension integration depends on Chat mode, bridge, and signing helper.


### W11 — M7 patch validation


- Parallel tasks: `T33`

- Notes: Full patch validation starts after all required patches land.


### W12 — M7 regression and behavior tests


- Parallel tasks: `T34, T35`

- Notes: Native regression and Echothink behavior tests both depend on patch validation.


### W13 — M7 Windows smoke


- Parallel tasks: `T36`

- Notes: Packaging smoke test depends on packaging docs, packaging patch, and behavior tests.


### W14 — Alpha candidate


- Parallel tasks: `T37`

- Notes: Alpha candidate depends on patch, regression, behavior, and Windows smoke reports.



# Paste-Ready Prompts By Wave



## Wave — Delivery Target


Notes



## W0 — M0 baseline


Establish repo truth before dependent work.


### Prompt for T00: Baseline repo audit


```text

You are an implementation agent working on Echothink Browser Alpha.

Task: T00 — Baseline repo audit
Wave: W0
Prerequisites: None
Delivery target: M0: baseline audit note

Repository root:
`C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new`

Mandatory reading before changing files:
1. `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\ungoogled_to_echothink_browser_change_plan.md`
2. `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md` if it exists
3. Any existing docs under `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs` directly relevant to this task
4. The local repository files that this task may modify

Global coordination rules:
- Maintain `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md` as the shared source of truth for task progress.
- Before starting, check `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md` and confirm all prerequisites for T00 are marked DONE or explicitly documented as acceptable baseline dependencies.
- If prerequisites are not complete, do not fake completion. Mark this task BLOCKED with the missing prerequisite IDs and the exact files or decisions needed.
- Update or create documentation only under `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs`.
- Record meaningful implementation notes, changed files, validation commands, validation results, and known limitations in `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md`.
- Do not implement backend services, gateway logic, search ranking, chat orchestration, workflow orchestration, or business pages. This task is browser-repository work only.
- Preserve Chromium and Ungoogled Chromium native behavior unless this task explicitly requires a narrow browser-shell change.
- Avoid changes to network stack, TLS validation, sandbox, renderer internals, downloads, history, bookmarks, password manager, cookies, and DevTools unless explicitly required and justified by the task.
- Prefer policy, preferences, extension shell, and narrow browser integration over deep native Chromium rewrites.

Task contents:
- Confirm current Chromium pin from `chromium_version.txt`.
- Confirm repo revision from `revision.txt`.
- Inspect current patch pipeline: downloads, pruning, patch application, domain
  substitution, GN generation, build invocation.
- Identify existing hooks relevant to New Tab, search provider, first-run page,
  flags, and default settings.
- Identify current Windows build assumptions and gaps.
- Record which areas must remain inherited from Ungoogled Chromium.

Delivery criteria:
- A baseline audit note exists.
- Chromium pin and repo revision are recorded.
- Current patch tooling is documented.
- Known insertion points for New Tab/search/first-run are listed.
- No repo behavior is changed by this task.

Required documentation update:
- Create or update this task note unless a better existing doc already exists:
  `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\echothink-browser-alpha\t00-baseline-repo-audit.md`
- Also update any broader browser Alpha docs affected by the task under `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs`.
- Update `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md` with a row or section for T00.

Validation requirements:
- Run the smallest relevant validation available for this task.
- For discovery/spec tasks, validate by checking source paths and linking decisions to concrete files.
- For patch tasks, validate patch file placement, patch ordering, and whether the patch applies or at least has a documented application command.
- For extension tasks, validate manifest shape, permissions, and local loading/build assumptions.
- For Windows packaging tasks, validate names, assets, channel metadata, and smoke-test steps as far as the local environment allows.

Final response format:
```
TASK T00 STATUS: DONE or BLOCKED

Summary:
- ...

Changed files:
- ...

Docs updated:
- ...

Validation:
- Command/result or reason not runnable

Progress.md update:
- Confirmed updated at `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md`

Remaining risks / follow-up:
- ...
```

```



## W1 — M0/M1/M2 discovery


Patch rules, validation, branding inventory, defaults, and New Tab hook can proceed independently after audit.


### Prompt for T01: Define Echothink patch discipline


```text

You are an implementation agent working on Echothink Browser Alpha.

Task: T01 — Define Echothink patch discipline
Wave: W1
Prerequisites: T00
Delivery target: M0: patch convention doc

Repository root:
`C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new`

Mandatory reading before changing files:
1. `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\ungoogled_to_echothink_browser_change_plan.md`
2. `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md` if it exists
3. Any existing docs under `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs` directly relevant to this task
4. The local repository files that this task may modify

Global coordination rules:
- Maintain `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md` as the shared source of truth for task progress.
- Before starting, check `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md` and confirm all prerequisites for T01 are marked DONE or explicitly documented as acceptable baseline dependencies.
- If prerequisites are not complete, do not fake completion. Mark this task BLOCKED with the missing prerequisite IDs and the exact files or decisions needed.
- Update or create documentation only under `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs`.
- Record meaningful implementation notes, changed files, validation commands, validation results, and known limitations in `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md`.
- Do not implement backend services, gateway logic, search ranking, chat orchestration, workflow orchestration, or business pages. This task is browser-repository work only.
- Preserve Chromium and Ungoogled Chromium native behavior unless this task explicitly requires a narrow browser-shell change.
- Avoid changes to network stack, TLS validation, sandbox, renderer internals, downloads, history, bookmarks, password manager, cookies, and DevTools unless explicitly required and justified by the task.
- Prefer policy, preferences, extension shell, and narrow browser integration over deep native Chromium rewrites.

- If this task produces a patch, place the Echothink-owned patch under `patches/echothink/` and update `patches/series` only when the patch should be part of the active ordered pipeline.
- Keep the patch small, single-purpose, and ordered after inherited Ungoogled Chromium patches.

Task contents:
- Define patch naming convention for `patches/echothink/`.
- Define patch ordering rules in `patches/series`.
- Define required patch header format.
- Define which changes must be implemented through policy/preference/extension
  before native patching is allowed.
- Define forbidden changes: network stack, TLS validation, sandbox, renderer,
  downloads, history, bookmarks, password manager, cookies, DevTools.
- Define review checklist for future Chromium rebases.

Delivery criteria:
- Patch convention doc exists.
- Echothink patches are required to be small and single-purpose.
- Echothink patches are required to apply after inherited patches.
- Security-critical Chromium areas are explicitly protected.

Required documentation update:
- Create or update this task note unless a better existing doc already exists:
  `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\echothink-browser-alpha\t01-define-echothink-patch-discipline.md`
- Also update any broader browser Alpha docs affected by the task under `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs`.
- Update `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md` with a row or section for T01.

Validation requirements:
- Run the smallest relevant validation available for this task.
- For discovery/spec tasks, validate by checking source paths and linking decisions to concrete files.
- For patch tasks, validate patch file placement, patch ordering, and whether the patch applies or at least has a documented application command.
- For extension tasks, validate manifest shape, permissions, and local loading/build assumptions.
- For Windows packaging tasks, validate names, assets, channel metadata, and smoke-test steps as far as the local environment allows.

Final response format:
```
TASK T01 STATUS: DONE or BLOCKED

Summary:
- ...

Changed files:
- ...

Docs updated:
- ...

Validation:
- Command/result or reason not runnable

Progress.md update:
- Confirmed updated at `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md`

Remaining risks / follow-up:
- ...
```

```


### Prompt for T03: Validate inherited patch pipeline


```text

You are an implementation agent working on Echothink Browser Alpha.

Task: T03 — Validate inherited patch pipeline
Wave: W1
Prerequisites: T00
Delivery target: M0: validation result

Repository root:
`C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new`

Mandatory reading before changing files:
1. `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\ungoogled_to_echothink_browser_change_plan.md`
2. `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md` if it exists
3. Any existing docs under `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs` directly relevant to this task
4. The local repository files that this task may modify

Global coordination rules:
- Maintain `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md` as the shared source of truth for task progress.
- Before starting, check `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md` and confirm all prerequisites for T03 are marked DONE or explicitly documented as acceptable baseline dependencies.
- If prerequisites are not complete, do not fake completion. Mark this task BLOCKED with the missing prerequisite IDs and the exact files or decisions needed.
- Update or create documentation only under `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs`.
- Record meaningful implementation notes, changed files, validation commands, validation results, and known limitations in `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md`.
- Do not implement backend services, gateway logic, search ranking, chat orchestration, workflow orchestration, or business pages. This task is browser-repository work only.
- Preserve Chromium and Ungoogled Chromium native behavior unless this task explicitly requires a narrow browser-shell change.
- Avoid changes to network stack, TLS validation, sandbox, renderer internals, downloads, history, bookmarks, password manager, cookies, and DevTools unless explicitly required and justified by the task.
- Prefer policy, preferences, extension shell, and narrow browser integration over deep native Chromium rewrites.

Task contents:
- Run existing validation for patch paths and patch metadata.
- Run existing Python tests under `utils/tests` and `devutils/tests` when
  available.
- Confirm `patches/series` remains valid before Echothink patch additions.
- Record any existing failures separately from Echothink work.

Delivery criteria:
- Validation result exists.
- Existing failures, if any, are documented as baseline issues.
- No Echothink patch work begins without knowing baseline health.

Required documentation update:
- Create or update this task note unless a better existing doc already exists:
  `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\echothink-browser-alpha\t03-validate-inherited-patch-pipeline.md`
- Also update any broader browser Alpha docs affected by the task under `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs`.
- Update `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md` with a row or section for T03.

Validation requirements:
- Run the smallest relevant validation available for this task.
- For discovery/spec tasks, validate by checking source paths and linking decisions to concrete files.
- For patch tasks, validate patch file placement, patch ordering, and whether the patch applies or at least has a documented application command.
- For extension tasks, validate manifest shape, permissions, and local loading/build assumptions.
- For Windows packaging tasks, validate names, assets, channel metadata, and smoke-test steps as far as the local environment allows.

Final response format:
```
TASK T03 STATUS: DONE or BLOCKED

Summary:
- ...

Changed files:
- ...

Docs updated:
- ...

Validation:
- Command/result or reason not runnable

Progress.md update:
- Confirmed updated at `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md`

Remaining risks / follow-up:
- ...
```

```


### Prompt for T04: Define product branding inventory


```text

You are an implementation agent working on Echothink Browser Alpha.

Task: T04 — Define product branding inventory
Wave: W1
Prerequisites: T00
Delivery target: M1: branding inventory

Repository root:
`C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new`

Mandatory reading before changing files:
1. `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\ungoogled_to_echothink_browser_change_plan.md`
2. `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md` if it exists
3. Any existing docs under `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs` directly relevant to this task
4. The local repository files that this task may modify

Global coordination rules:
- Maintain `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md` as the shared source of truth for task progress.
- Before starting, check `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md` and confirm all prerequisites for T04 are marked DONE or explicitly documented as acceptable baseline dependencies.
- If prerequisites are not complete, do not fake completion. Mark this task BLOCKED with the missing prerequisite IDs and the exact files or decisions needed.
- Update or create documentation only under `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs`.
- Record meaningful implementation notes, changed files, validation commands, validation results, and known limitations in `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md`.
- Do not implement backend services, gateway logic, search ranking, chat orchestration, workflow orchestration, or business pages. This task is browser-repository work only.
- Preserve Chromium and Ungoogled Chromium native behavior unless this task explicitly requires a narrow browser-shell change.
- Avoid changes to network stack, TLS validation, sandbox, renderer internals, downloads, history, bookmarks, password manager, cookies, and DevTools unless explicitly required and justified by the task.
- Prefer policy, preferences, extension shell, and narrow browser integration over deep native Chromium rewrites.

Task contents:
- Inventory product strings that must show `Echothink Browser`.
- Identify Windows application display name and Start Menu naming.
- Define installer name: `EchothinkBrowserSetup`.
- Identify About page and first-run copy needs.
- Define icon sizes and asset types needed for Windows Alpha.
- Preserve Chromium and Ungoogled Chromium attribution requirements.

Delivery criteria:
- Branding inventory exists.
- User-visible names are decided.
- Icon and copy requirements are listed.
- Attribution requirements are retained.

Required documentation update:
- Create or update this task note unless a better existing doc already exists:
  `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\echothink-browser-alpha\t04-define-product-branding-inventory.md`
- Also update any broader browser Alpha docs affected by the task under `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs`.
- Update `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md` with a row or section for T04.

Validation requirements:
- Run the smallest relevant validation available for this task.
- For discovery/spec tasks, validate by checking source paths and linking decisions to concrete files.
- For patch tasks, validate patch file placement, patch ordering, and whether the patch applies or at least has a documented application command.
- For extension tasks, validate manifest shape, permissions, and local loading/build assumptions.
- For Windows packaging tasks, validate names, assets, channel metadata, and smoke-test steps as far as the local environment allows.

Final response format:
```
TASK T04 STATUS: DONE or BLOCKED

Summary:
- ...

Changed files:
- ...

Docs updated:
- ...

Validation:
- Command/result or reason not runnable

Progress.md update:
- Confirmed updated at `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md`

Remaining risks / follow-up:
- ...
```

```


### Prompt for T07: Define default policy/preference set


```text

You are an implementation agent working on Echothink Browser Alpha.

Task: T07 — Define default policy/preference set
Wave: W1
Prerequisites: T00
Delivery target: M1: defaults spec

Repository root:
`C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new`

Mandatory reading before changing files:
1. `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\ungoogled_to_echothink_browser_change_plan.md`
2. `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md` if it exists
3. Any existing docs under `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs` directly relevant to this task
4. The local repository files that this task may modify

Global coordination rules:
- Maintain `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md` as the shared source of truth for task progress.
- Before starting, check `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md` and confirm all prerequisites for T07 are marked DONE or explicitly documented as acceptable baseline dependencies.
- If prerequisites are not complete, do not fake completion. Mark this task BLOCKED with the missing prerequisite IDs and the exact files or decisions needed.
- Update or create documentation only under `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs`.
- Record meaningful implementation notes, changed files, validation commands, validation results, and known limitations in `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md`.
- Do not implement backend services, gateway logic, search ranking, chat orchestration, workflow orchestration, or business pages. This task is browser-repository work only.
- Preserve Chromium and Ungoogled Chromium native behavior unless this task explicitly requires a narrow browser-shell change.
- Avoid changes to network stack, TLS validation, sandbox, renderer internals, downloads, history, bookmarks, password manager, cookies, and DevTools unless explicitly required and justified by the task.
- Prefer policy, preferences, extension shell, and narrow browser integration over deep native Chromium rewrites.

Task contents:
- Define default homepage: `https://app.echothink.ai/dashboard`.
- Define default New Tab: `https://app.echothink.ai/newtab`.
- Define default search URL:
  `https://search.echothink.ai/search?q={searchTerms}`.
- Define default suggest URL:
  `https://search.echothink.ai/suggest?q={searchTerms}`.
- Define default bookmarks.
- Define enterprise-safe defaults that preserve native Chromium behavior.

Delivery criteria:
- Defaults spec exists.
- Defaults are browser-only and do not implement backend logic.
- Native browser primitives are preserved.

Required documentation update:
- Create or update this task note unless a better existing doc already exists:
  `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\echothink-browser-alpha\t07-define-default-policy-preference-set.md`
- Also update any broader browser Alpha docs affected by the task under `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs`.
- Update `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md` with a row or section for T07.

Validation requirements:
- Run the smallest relevant validation available for this task.
- For discovery/spec tasks, validate by checking source paths and linking decisions to concrete files.
- For patch tasks, validate patch file placement, patch ordering, and whether the patch applies or at least has a documented application command.
- For extension tasks, validate manifest shape, permissions, and local loading/build assumptions.
- For Windows packaging tasks, validate names, assets, channel metadata, and smoke-test steps as far as the local environment allows.

Final response format:
```
TASK T07 STATUS: DONE or BLOCKED

Summary:
- ...

Changed files:
- ...

Docs updated:
- ...

Validation:
- Command/result or reason not runnable

Progress.md update:
- Confirmed updated at `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md`

Remaining risks / follow-up:
- ...
```

```


### Prompt for T09: Confirm New Tab insertion point


```text

You are an implementation agent working on Echothink Browser Alpha.

Task: T09 — Confirm New Tab insertion point
Wave: W1
Prerequisites: T00
Delivery target: M2: New Tab hook decision

Repository root:
`C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new`

Mandatory reading before changing files:
1. `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\ungoogled_to_echothink_browser_change_plan.md`
2. `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md` if it exists
3. Any existing docs under `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs` directly relevant to this task
4. The local repository files that this task may modify

Global coordination rules:
- Maintain `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md` as the shared source of truth for task progress.
- Before starting, check `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md` and confirm all prerequisites for T09 are marked DONE or explicitly documented as acceptable baseline dependencies.
- If prerequisites are not complete, do not fake completion. Mark this task BLOCKED with the missing prerequisite IDs and the exact files or decisions needed.
- Update or create documentation only under `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs`.
- Record meaningful implementation notes, changed files, validation commands, validation results, and known limitations in `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md`.
- Do not implement backend services, gateway logic, search ranking, chat orchestration, workflow orchestration, or business pages. This task is browser-repository work only.
- Preserve Chromium and Ungoogled Chromium native behavior unless this task explicitly requires a narrow browser-shell change.
- Avoid changes to network stack, TLS validation, sandbox, renderer internals, downloads, history, bookmarks, password manager, cookies, and DevTools unless explicitly required and justified by the task.
- Prefer policy, preferences, extension shell, and narrow browser integration over deep native Chromium rewrites.

Task contents:
- Inspect existing custom New Tab patch pattern.
- Identify the safest Chromium hook for external New Tab URL override.
- Confirm incognito behavior and fallback behavior.
- Record why the chosen hook is lower risk than deeper UI rewrites.

Delivery criteria:
- New Tab hook decision exists.
- The chosen hook is compatible with existing ungoogled patches.
- Risk notes are documented.

Required documentation update:
- Create or update this task note unless a better existing doc already exists:
  `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\echothink-browser-alpha\t09-confirm-new-tab-insertion-point.md`
- Also update any broader browser Alpha docs affected by the task under `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs`.
- Update `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md` with a row or section for T09.

Validation requirements:
- Run the smallest relevant validation available for this task.
- For discovery/spec tasks, validate by checking source paths and linking decisions to concrete files.
- For patch tasks, validate patch file placement, patch ordering, and whether the patch applies or at least has a documented application command.
- For extension tasks, validate manifest shape, permissions, and local loading/build assumptions.
- For Windows packaging tasks, validate names, assets, channel metadata, and smoke-test steps as far as the local environment allows.

Final response format:
```
TASK T09 STATUS: DONE or BLOCKED

Summary:
- ...

Changed files:
- ...

Docs updated:
- ...

Validation:
- Command/result or reason not runnable

Progress.md update:
- Confirmed updated at `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md`

Remaining risks / follow-up:
- ...
```

```



## W2 — M0/M1 implementation


Repo structure, branding patch, assets, defaults patch, and search provider can run in parallel after their specs are ready.


### Prompt for T02: Define Echothink repo structure


```text

You are an implementation agent working on Echothink Browser Alpha.

Task: T02 — Define Echothink repo structure
Wave: W2
Prerequisites: T01
Delivery target: M0: repo skeleton plan

Repository root:
`C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new`

Mandatory reading before changing files:
1. `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\ungoogled_to_echothink_browser_change_plan.md`
2. `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md` if it exists
3. Any existing docs under `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs` directly relevant to this task
4. The local repository files that this task may modify

Global coordination rules:
- Maintain `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md` as the shared source of truth for task progress.
- Before starting, check `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md` and confirm all prerequisites for T02 are marked DONE or explicitly documented as acceptable baseline dependencies.
- If prerequisites are not complete, do not fake completion. Mark this task BLOCKED with the missing prerequisite IDs and the exact files or decisions needed.
- Update or create documentation only under `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs`.
- Record meaningful implementation notes, changed files, validation commands, validation results, and known limitations in `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md`.
- Do not implement backend services, gateway logic, search ranking, chat orchestration, workflow orchestration, or business pages. This task is browser-repository work only.
- Preserve Chromium and Ungoogled Chromium native behavior unless this task explicitly requires a narrow browser-shell change.
- Avoid changes to network stack, TLS validation, sandbox, renderer internals, downloads, history, bookmarks, password manager, cookies, and DevTools unless explicitly required and justified by the task.
- Prefer policy, preferences, extension shell, and narrow browser integration over deep native Chromium rewrites.

Task contents:
- Define target repo paths for browser-only additions:
  `patches/echothink/`, `extensions/echothink-workspace/`, `assets/`,
  `build/windows/`, and supporting docs.
- Define expected contents for each path.
- Define when `patches/series` entries may be added.
- Define how placeholder docs and generated artifacts should be treated.

Delivery criteria:
- Repo skeleton plan exists.
- New paths are documented with ownership and purpose.
- Existing inherited patch tooling remains untouched.

Required documentation update:
- Create or update this task note unless a better existing doc already exists:
  `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\echothink-browser-alpha\t02-define-echothink-repo-structure.md`
- Also update any broader browser Alpha docs affected by the task under `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs`.
- Update `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md` with a row or section for T02.

Validation requirements:
- Run the smallest relevant validation available for this task.
- For discovery/spec tasks, validate by checking source paths and linking decisions to concrete files.
- For patch tasks, validate patch file placement, patch ordering, and whether the patch applies or at least has a documented application command.
- For extension tasks, validate manifest shape, permissions, and local loading/build assumptions.
- For Windows packaging tasks, validate names, assets, channel metadata, and smoke-test steps as far as the local environment allows.

Final response format:
```
TASK T02 STATUS: DONE or BLOCKED

Summary:
- ...

Changed files:
- ...

Docs updated:
- ...

Validation:
- Command/result or reason not runnable

Progress.md update:
- Confirmed updated at `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md`

Remaining risks / follow-up:
- ...
```

```


### Prompt for T05: Implement branding patch


```text

You are an implementation agent working on Echothink Browser Alpha.

Task: T05 — Implement branding patch
Wave: W2
Prerequisites: T01, T04
Delivery target: M1: `0001-branding.patch`

Repository root:
`C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new`

Mandatory reading before changing files:
1. `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\ungoogled_to_echothink_browser_change_plan.md`
2. `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md` if it exists
3. Any existing docs under `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs` directly relevant to this task
4. The local repository files that this task may modify

Global coordination rules:
- Maintain `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md` as the shared source of truth for task progress.
- Before starting, check `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md` and confirm all prerequisites for T05 are marked DONE or explicitly documented as acceptable baseline dependencies.
- If prerequisites are not complete, do not fake completion. Mark this task BLOCKED with the missing prerequisite IDs and the exact files or decisions needed.
- Update or create documentation only under `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs`.
- Record meaningful implementation notes, changed files, validation commands, validation results, and known limitations in `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md`.
- Do not implement backend services, gateway logic, search ranking, chat orchestration, workflow orchestration, or business pages. This task is browser-repository work only.
- Preserve Chromium and Ungoogled Chromium native behavior unless this task explicitly requires a narrow browser-shell change.
- Avoid changes to network stack, TLS validation, sandbox, renderer internals, downloads, history, bookmarks, password manager, cookies, and DevTools unless explicitly required and justified by the task.
- Prefer policy, preferences, extension shell, and narrow browser integration over deep native Chromium rewrites.

- If this task produces a patch, place the Echothink-owned patch under `patches/echothink/` and update `patches/series` only when the patch should be part of the active ordered pipeline.
- Keep the patch small, single-purpose, and ordered after inherited Ungoogled Chromium patches.
- Expected patch artifact: `0001-branding.patch`.

Task contents:
- Patch the smallest stable Chromium string and resource insertion points for
  user-visible product identity.
- Update product display name to `Echothink Browser`.
- Update About/first-run browser identity surfaces.
- Preserve upstream credits and license notices.
- Avoid renaming low-level internal executable identifiers in Alpha unless
  required by packaging.

Delivery criteria:
- `0001-branding.patch` exists.
- Browser-visible identity says `Echothink Browser`.
- Upstream attribution remains visible.
- Patch applies after inherited patches.

Required documentation update:
- Create or update this task note unless a better existing doc already exists:
  `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\echothink-browser-alpha\t05-implement-branding-patch.md`
- Also update any broader browser Alpha docs affected by the task under `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs`.
- Update `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md` with a row or section for T05.

Validation requirements:
- Run the smallest relevant validation available for this task.
- For discovery/spec tasks, validate by checking source paths and linking decisions to concrete files.
- For patch tasks, validate patch file placement, patch ordering, and whether the patch applies or at least has a documented application command.
- For extension tasks, validate manifest shape, permissions, and local loading/build assumptions.
- For Windows packaging tasks, validate names, assets, channel metadata, and smoke-test steps as far as the local environment allows.

Final response format:
```
TASK T05 STATUS: DONE or BLOCKED

Summary:
- ...

Changed files:
- ...

Docs updated:
- ...

Validation:
- Command/result or reason not runnable

Progress.md update:
- Confirmed updated at `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md`

Remaining risks / follow-up:
- ...
```

```


### Prompt for T06: Add Echothink visual assets


```text

You are an implementation agent working on Echothink Browser Alpha.

Task: T06 — Add Echothink visual assets
Wave: W2
Prerequisites: T04
Delivery target: M1: asset bundle

Repository root:
`C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new`

Mandatory reading before changing files:
1. `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\ungoogled_to_echothink_browser_change_plan.md`
2. `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md` if it exists
3. Any existing docs under `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs` directly relevant to this task
4. The local repository files that this task may modify

Global coordination rules:
- Maintain `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md` as the shared source of truth for task progress.
- Before starting, check `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md` and confirm all prerequisites for T06 are marked DONE or explicitly documented as acceptable baseline dependencies.
- If prerequisites are not complete, do not fake completion. Mark this task BLOCKED with the missing prerequisite IDs and the exact files or decisions needed.
- Update or create documentation only under `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs`.
- Record meaningful implementation notes, changed files, validation commands, validation results, and known limitations in `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md`.
- Do not implement backend services, gateway logic, search ranking, chat orchestration, workflow orchestration, or business pages. This task is browser-repository work only.
- Preserve Chromium and Ungoogled Chromium native behavior unless this task explicitly requires a narrow browser-shell change.
- Avoid changes to network stack, TLS validation, sandbox, renderer internals, downloads, history, bookmarks, password manager, cookies, and DevTools unless explicitly required and justified by the task.
- Prefer policy, preferences, extension shell, and narrow browser integration over deep native Chromium rewrites.

Task contents:
- Add app icon assets.
- Add installer icon/assets.
- Add About/first-run visual assets.
- Store assets under the planned `assets/` structure.
- Document source, ownership, and required sizes.

Delivery criteria:
- Asset bundle exists.
- Required Windows Alpha sizes are present.
- Assets are referenced by branding/packaging specs.

Required documentation update:
- Create or update this task note unless a better existing doc already exists:
  `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\echothink-browser-alpha\t06-add-echothink-visual-assets.md`
- Also update any broader browser Alpha docs affected by the task under `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs`.
- Update `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md` with a row or section for T06.

Validation requirements:
- Run the smallest relevant validation available for this task.
- For discovery/spec tasks, validate by checking source paths and linking decisions to concrete files.
- For patch tasks, validate patch file placement, patch ordering, and whether the patch applies or at least has a documented application command.
- For extension tasks, validate manifest shape, permissions, and local loading/build assumptions.
- For Windows packaging tasks, validate names, assets, channel metadata, and smoke-test steps as far as the local environment allows.

Final response format:
```
TASK T06 STATUS: DONE or BLOCKED

Summary:
- ...

Changed files:
- ...

Docs updated:
- ...

Validation:
- Command/result or reason not runnable

Progress.md update:
- Confirmed updated at `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md`

Remaining risks / follow-up:
- ...
```

```


### Prompt for T08: Implement default policies/preferences patch


```text

You are an implementation agent working on Echothink Browser Alpha.

Task: T08 — Implement default policies/preferences patch
Wave: W2
Prerequisites: T01, T07
Delivery target: M1: `0002-default-policies-and-preferences.patch`

Repository root:
`C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new`

Mandatory reading before changing files:
1. `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\ungoogled_to_echothink_browser_change_plan.md`
2. `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md` if it exists
3. Any existing docs under `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs` directly relevant to this task
4. The local repository files that this task may modify

Global coordination rules:
- Maintain `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md` as the shared source of truth for task progress.
- Before starting, check `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md` and confirm all prerequisites for T08 are marked DONE or explicitly documented as acceptable baseline dependencies.
- If prerequisites are not complete, do not fake completion. Mark this task BLOCKED with the missing prerequisite IDs and the exact files or decisions needed.
- Update or create documentation only under `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs`.
- Record meaningful implementation notes, changed files, validation commands, validation results, and known limitations in `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md`.
- Do not implement backend services, gateway logic, search ranking, chat orchestration, workflow orchestration, or business pages. This task is browser-repository work only.
- Preserve Chromium and Ungoogled Chromium native behavior unless this task explicitly requires a narrow browser-shell change.
- Avoid changes to network stack, TLS validation, sandbox, renderer internals, downloads, history, bookmarks, password manager, cookies, and DevTools unless explicitly required and justified by the task.
- Prefer policy, preferences, extension shell, and narrow browser integration over deep native Chromium rewrites.

- If this task produces a patch, place the Echothink-owned patch under `patches/echothink/` and update `patches/series` only when the patch should be part of the active ordered pipeline.
- Keep the patch small, single-purpose, and ordered after inherited Ungoogled Chromium patches.
- Expected patch artifact: `0002-default-policies-and-preferences.patch`.

Task contents:
- Implement default homepage and preference defaults.
- Add default bookmark entries.
- Add policy/preference defaults for Echothink workspace entry.
- Avoid deep changes to browser primitives.
- Keep enterprise policy override behavior intact.

Delivery criteria:
- `0002-default-policies-and-preferences.patch` exists.
- First launch uses Echothink defaults.
- Native browser behavior remains Chromium-like.
- Patch applies after inherited patches.

Required documentation update:
- Create or update this task note unless a better existing doc already exists:
  `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\echothink-browser-alpha\t08-implement-default-policies-preferences-patch.md`
- Also update any broader browser Alpha docs affected by the task under `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs`.
- Update `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md` with a row or section for T08.

Validation requirements:
- Run the smallest relevant validation available for this task.
- For discovery/spec tasks, validate by checking source paths and linking decisions to concrete files.
- For patch tasks, validate patch file placement, patch ordering, and whether the patch applies or at least has a documented application command.
- For extension tasks, validate manifest shape, permissions, and local loading/build assumptions.
- For Windows packaging tasks, validate names, assets, channel metadata, and smoke-test steps as far as the local environment allows.

Final response format:
```
TASK T08 STATUS: DONE or BLOCKED

Summary:
- ...

Changed files:
- ...

Docs updated:
- ...

Validation:
- Command/result or reason not runnable

Progress.md update:
- Confirmed updated at `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md`

Remaining risks / follow-up:
- ...
```

```


### Prompt for T19: Implement default search provider


```text

You are an implementation agent working on Echothink Browser Alpha.

Task: T19 — Implement default search provider
Wave: W2
Prerequisites: T08
Delivery target: M1/M3: `0005-default-search-provider.patch`

Repository root:
`C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new`

Mandatory reading before changing files:
1. `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\ungoogled_to_echothink_browser_change_plan.md`
2. `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md` if it exists
3. Any existing docs under `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs` directly relevant to this task
4. The local repository files that this task may modify

Global coordination rules:
- Maintain `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md` as the shared source of truth for task progress.
- Before starting, check `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md` and confirm all prerequisites for T19 are marked DONE or explicitly documented as acceptable baseline dependencies.
- If prerequisites are not complete, do not fake completion. Mark this task BLOCKED with the missing prerequisite IDs and the exact files or decisions needed.
- Update or create documentation only under `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs`.
- Record meaningful implementation notes, changed files, validation commands, validation results, and known limitations in `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md`.
- Do not implement backend services, gateway logic, search ranking, chat orchestration, workflow orchestration, or business pages. This task is browser-repository work only.
- Preserve Chromium and Ungoogled Chromium native behavior unless this task explicitly requires a narrow browser-shell change.
- Avoid changes to network stack, TLS validation, sandbox, renderer internals, downloads, history, bookmarks, password manager, cookies, and DevTools unless explicitly required and justified by the task.
- Prefer policy, preferences, extension shell, and narrow browser integration over deep native Chromium rewrites.

- If this task produces a patch, place the Echothink-owned patch under `patches/echothink/` and update `patches/series` only when the patch should be part of the active ordered pipeline.
- Keep the patch small, single-purpose, and ordered after inherited Ungoogled Chromium patches.
- Expected patch artifact: `0005-default-search-provider.patch`.

Task contents:
- Configure Echothink Search as default search provider.
- Configure suggest URL when suggestions are enabled.
- Prefer policy or master preferences before native omnibox changes.
- Preserve direct URL navigation.

Delivery criteria:
- `0005-default-search-provider.patch` exists.
- Omnibox search routes to Echothink Search.
- Suggest requests use Echothink suggest route when enabled.
- Omnibox internals are not deeply rewritten.

Required documentation update:
- Create or update this task note unless a better existing doc already exists:
  `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\echothink-browser-alpha\t19-implement-default-search-provider.md`
- Also update any broader browser Alpha docs affected by the task under `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs`.
- Update `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md` with a row or section for T19.

Validation requirements:
- Run the smallest relevant validation available for this task.
- For discovery/spec tasks, validate by checking source paths and linking decisions to concrete files.
- For patch tasks, validate patch file placement, patch ordering, and whether the patch applies or at least has a documented application command.
- For extension tasks, validate manifest shape, permissions, and local loading/build assumptions.
- For Windows packaging tasks, validate names, assets, channel metadata, and smoke-test steps as far as the local environment allows.

Final response format:
```
TASK T19 STATUS: DONE or BLOCKED

Summary:
- ...

Changed files:
- ...

Docs updated:
- ...

Validation:
- Command/result or reason not runnable

Progress.md update:
- Confirmed updated at `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md`

Remaining risks / follow-up:
- ...
```

```



## W3 — M2/M3/M7 setup


New Tab implementation, extension scaffold, and Windows identity spec can proceed independently.


### Prompt for T10: Implement New Tab route and fallback


```text

You are an implementation agent working on Echothink Browser Alpha.

Task: T10 — Implement New Tab route and fallback
Wave: W3
Prerequisites: T08, T09
Delivery target: M2: `0003-new-tab-and-first-run.patch`

Repository root:
`C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new`

Mandatory reading before changing files:
1. `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\ungoogled_to_echothink_browser_change_plan.md`
2. `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md` if it exists
3. Any existing docs under `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs` directly relevant to this task
4. The local repository files that this task may modify

Global coordination rules:
- Maintain `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md` as the shared source of truth for task progress.
- Before starting, check `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md` and confirm all prerequisites for T10 are marked DONE or explicitly documented as acceptable baseline dependencies.
- If prerequisites are not complete, do not fake completion. Mark this task BLOCKED with the missing prerequisite IDs and the exact files or decisions needed.
- Update or create documentation only under `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs`.
- Record meaningful implementation notes, changed files, validation commands, validation results, and known limitations in `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md`.
- Do not implement backend services, gateway logic, search ranking, chat orchestration, workflow orchestration, or business pages. This task is browser-repository work only.
- Preserve Chromium and Ungoogled Chromium native behavior unless this task explicitly requires a narrow browser-shell change.
- Avoid changes to network stack, TLS validation, sandbox, renderer internals, downloads, history, bookmarks, password manager, cookies, and DevTools unless explicitly required and justified by the task.
- Prefer policy, preferences, extension shell, and narrow browser integration over deep native Chromium rewrites.

- If this task produces a patch, place the Echothink-owned patch under `patches/echothink/` and update `patches/series` only when the patch should be part of the active ordered pipeline.
- Keep the patch small, single-purpose, and ordered after inherited Ungoogled Chromium patches.
- Expected patch artifact: `0003-new-tab-and-first-run.patch`.

Task contents:
- Route normal New Tab to `https://app.echothink.ai/newtab`.
- Add local fallback page for unauthenticated or unavailable state.
- Fallback page links only to login, device enrollment, diagnostics, update,
  and support/download pages.
- Ensure fallback page contains no protected business data.

Delivery criteria:
- `0003-new-tab-and-first-run.patch` exists.
- New tabs open Echothink workspace route.
- Fallback page works without backend availability.
- No protected content is embedded in the browser.

Required documentation update:
- Create or update this task note unless a better existing doc already exists:
  `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\echothink-browser-alpha\t10-implement-new-tab-route-and-fallback.md`
- Also update any broader browser Alpha docs affected by the task under `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs`.
- Update `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md` with a row or section for T10.

Validation requirements:
- Run the smallest relevant validation available for this task.
- For discovery/spec tasks, validate by checking source paths and linking decisions to concrete files.
- For patch tasks, validate patch file placement, patch ordering, and whether the patch applies or at least has a documented application command.
- For extension tasks, validate manifest shape, permissions, and local loading/build assumptions.
- For Windows packaging tasks, validate names, assets, channel metadata, and smoke-test steps as far as the local environment allows.

Final response format:
```
TASK T10 STATUS: DONE or BLOCKED

Summary:
- ...

Changed files:
- ...

Docs updated:
- ...

Validation:
- Command/result or reason not runnable

Progress.md update:
- Confirmed updated at `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md`

Remaining risks / follow-up:
- ...
```

```


### Prompt for T12: Scaffold bundled workspace extension


```text

You are an implementation agent working on Echothink Browser Alpha.

Task: T12 — Scaffold bundled workspace extension
Wave: W3
Prerequisites: T02
Delivery target: M3: extension skeleton

Repository root:
`C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new`

Mandatory reading before changing files:
1. `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\ungoogled_to_echothink_browser_change_plan.md`
2. `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md` if it exists
3. Any existing docs under `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs` directly relevant to this task
4. The local repository files that this task may modify

Global coordination rules:
- Maintain `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md` as the shared source of truth for task progress.
- Before starting, check `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md` and confirm all prerequisites for T12 are marked DONE or explicitly documented as acceptable baseline dependencies.
- If prerequisites are not complete, do not fake completion. Mark this task BLOCKED with the missing prerequisite IDs and the exact files or decisions needed.
- Update or create documentation only under `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs`.
- Record meaningful implementation notes, changed files, validation commands, validation results, and known limitations in `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md`.
- Do not implement backend services, gateway logic, search ranking, chat orchestration, workflow orchestration, or business pages. This task is browser-repository work only.
- Preserve Chromium and Ungoogled Chromium native behavior unless this task explicitly requires a narrow browser-shell change.
- Avoid changes to network stack, TLS validation, sandbox, renderer internals, downloads, history, bookmarks, password manager, cookies, and DevTools unless explicitly required and justified by the task.
- Prefer policy, preferences, extension shell, and narrow browser integration over deep native Chromium rewrites.

- Keep extension permissions narrow. Do not add broad host permissions or general-purpose privileged bridges.
- Keep service-rendered business logic outside the bundled extension shell.

Task contents:
- Create Manifest V3 extension structure.
- Add `manifest.json`, background script, Side Panel HTML/CSS/JS, content bridge,
  and asset folder.
- Declare minimum permissions: `sidePanel`, `storage`, `tabs`, `activeTab`,
  `scripting`.
- Restrict host permissions to Echothink-owned domains.

Delivery criteria:
- Extension skeleton exists at `extensions/echothink-workspace/`.
- Manifest is valid for Chromium Alpha target.
- Permissions are narrow and documented.

Required documentation update:
- Create or update this task note unless a better existing doc already exists:
  `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\echothink-browser-alpha\t12-scaffold-bundled-workspace-extension.md`
- Also update any broader browser Alpha docs affected by the task under `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs`.
- Update `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md` with a row or section for T12.

Validation requirements:
- Run the smallest relevant validation available for this task.
- For discovery/spec tasks, validate by checking source paths and linking decisions to concrete files.
- For patch tasks, validate patch file placement, patch ordering, and whether the patch applies or at least has a documented application command.
- For extension tasks, validate manifest shape, permissions, and local loading/build assumptions.
- For Windows packaging tasks, validate names, assets, channel metadata, and smoke-test steps as far as the local environment allows.

Final response format:
```
TASK T12 STATUS: DONE or BLOCKED

Summary:
- ...

Changed files:
- ...

Docs updated:
- ...

Validation:
- Command/result or reason not runnable

Progress.md update:
- Confirmed updated at `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md`

Remaining risks / follow-up:
- ...
```

```


### Prompt for T30: Define Windows app identity and channels


```text

You are an implementation agent working on Echothink Browser Alpha.

Task: T30 — Define Windows app identity and channels
Wave: W3
Prerequisites: T05, T06
Delivery target: M7: Windows packaging spec

Repository root:
`C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new`

Mandatory reading before changing files:
1. `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\ungoogled_to_echothink_browser_change_plan.md`
2. `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md` if it exists
3. Any existing docs under `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs` directly relevant to this task
4. The local repository files that this task may modify

Global coordination rules:
- Maintain `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md` as the shared source of truth for task progress.
- Before starting, check `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md` and confirm all prerequisites for T30 are marked DONE or explicitly documented as acceptable baseline dependencies.
- If prerequisites are not complete, do not fake completion. Mark this task BLOCKED with the missing prerequisite IDs and the exact files or decisions needed.
- Update or create documentation only under `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs`.
- Record meaningful implementation notes, changed files, validation commands, validation results, and known limitations in `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md`.
- Do not implement backend services, gateway logic, search ranking, chat orchestration, workflow orchestration, or business pages. This task is browser-repository work only.
- Preserve Chromium and Ungoogled Chromium native behavior unless this task explicitly requires a narrow browser-shell change.
- Avoid changes to network stack, TLS validation, sandbox, renderer internals, downloads, history, bookmarks, password manager, cookies, and DevTools unless explicitly required and justified by the task.
- Prefer policy, preferences, extension shell, and narrow browser integration over deep native Chromium rewrites.

- Treat Windows Alpha as the primary target; document any non-Windows behavior as out of scope unless needed for patch safety.

Task contents:
- Define Windows application display name and Start Menu name.
- Define installer naming: `EchothinkBrowserSetup`.
- Define channel names: Canary, Dev, Beta, Stable, Enterprise Stable.
- Define what branding is required for Alpha versus Beta.
- Define update-channel metadata expected by browser packaging.

Delivery criteria:
- Windows packaging spec exists.
- Installer and channel names are decided.
- Alpha/Beta identity tradeoff is explicit.

Required documentation update:
- Create or update this task note unless a better existing doc already exists:
  `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\echothink-browser-alpha\t30-define-windows-app-identity-and-channels.md`
- Also update any broader browser Alpha docs affected by the task under `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs`.
- Update `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md` with a row or section for T30.

Validation requirements:
- Run the smallest relevant validation available for this task.
- For discovery/spec tasks, validate by checking source paths and linking decisions to concrete files.
- For patch tasks, validate patch file placement, patch ordering, and whether the patch applies or at least has a documented application command.
- For extension tasks, validate manifest shape, permissions, and local loading/build assumptions.
- For Windows packaging tasks, validate names, assets, channel metadata, and smoke-test steps as far as the local environment allows.

Final response format:
```
TASK T30 STATUS: DONE or BLOCKED

Summary:
- ...

Changed files:
- ...

Docs updated:
- ...

Validation:
- Command/result or reason not runnable

Progress.md update:
- Confirmed updated at `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md`

Remaining risks / follow-up:
- ...
```

```



## W4 — M2/M3/M4/M7 integration


First-run shell, extension bundling, login gate spec, and packaging patch do not block each other.


### Prompt for T11: Add first-run shell


```text

You are an implementation agent working on Echothink Browser Alpha.

Task: T11 — Add first-run shell
Wave: W4
Prerequisites: T10
Delivery target: M2: first-run gate shell

Repository root:
`C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new`

Mandatory reading before changing files:
1. `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\ungoogled_to_echothink_browser_change_plan.md`
2. `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md` if it exists
3. Any existing docs under `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs` directly relevant to this task
4. The local repository files that this task may modify

Global coordination rules:
- Maintain `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md` as the shared source of truth for task progress.
- Before starting, check `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md` and confirm all prerequisites for T11 are marked DONE or explicitly documented as acceptable baseline dependencies.
- If prerequisites are not complete, do not fake completion. Mark this task BLOCKED with the missing prerequisite IDs and the exact files or decisions needed.
- Update or create documentation only under `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs`.
- Record meaningful implementation notes, changed files, validation commands, validation results, and known limitations in `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md`.
- Do not implement backend services, gateway logic, search ranking, chat orchestration, workflow orchestration, or business pages. This task is browser-repository work only.
- Preserve Chromium and Ungoogled Chromium native behavior unless this task explicitly requires a narrow browser-shell change.
- Avoid changes to network stack, TLS validation, sandbox, renderer internals, downloads, history, bookmarks, password manager, cookies, and DevTools unless explicitly required and justified by the task.
- Prefer policy, preferences, extension shell, and narrow browser integration over deep native Chromium rewrites.

Task contents:
- Add a first-run page or startup route that leads to login/enrollment.
- Ensure first-run does not present a normal general-purpose browser before
  setup.
- Keep the shell minimal and service-oriented.
- Reuse the New Tab fallback style where possible.

Delivery criteria:
- First-run gate shell exists.
- First launch leads to login/enrollment.
- Shell has no business workflow logic.

Required documentation update:
- Create or update this task note unless a better existing doc already exists:
  `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\echothink-browser-alpha\t11-add-first-run-shell.md`
- Also update any broader browser Alpha docs affected by the task under `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs`.
- Update `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md` with a row or section for T11.

Validation requirements:
- Run the smallest relevant validation available for this task.
- For discovery/spec tasks, validate by checking source paths and linking decisions to concrete files.
- For patch tasks, validate patch file placement, patch ordering, and whether the patch applies or at least has a documented application command.
- For extension tasks, validate manifest shape, permissions, and local loading/build assumptions.
- For Windows packaging tasks, validate names, assets, channel metadata, and smoke-test steps as far as the local environment allows.

Final response format:
```
TASK T11 STATUS: DONE or BLOCKED

Summary:
- ...

Changed files:
- ...

Docs updated:
- ...

Validation:
- Command/result or reason not runnable

Progress.md update:
- Confirmed updated at `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md`

Remaining risks / follow-up:
- ...
```

```


### Prompt for T13: Add bundled extension install patch


```text

You are an implementation agent working on Echothink Browser Alpha.

Task: T13 — Add bundled extension install patch
Wave: W4
Prerequisites: T12
Delivery target: M3: `0004-bundled-workspace-extension.patch`

Repository root:
`C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new`

Mandatory reading before changing files:
1. `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\ungoogled_to_echothink_browser_change_plan.md`
2. `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md` if it exists
3. Any existing docs under `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs` directly relevant to this task
4. The local repository files that this task may modify

Global coordination rules:
- Maintain `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md` as the shared source of truth for task progress.
- Before starting, check `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md` and confirm all prerequisites for T13 are marked DONE or explicitly documented as acceptable baseline dependencies.
- If prerequisites are not complete, do not fake completion. Mark this task BLOCKED with the missing prerequisite IDs and the exact files or decisions needed.
- Update or create documentation only under `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs`.
- Record meaningful implementation notes, changed files, validation commands, validation results, and known limitations in `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md`.
- Do not implement backend services, gateway logic, search ranking, chat orchestration, workflow orchestration, or business pages. This task is browser-repository work only.
- Preserve Chromium and Ungoogled Chromium native behavior unless this task explicitly requires a narrow browser-shell change.
- Avoid changes to network stack, TLS validation, sandbox, renderer internals, downloads, history, bookmarks, password manager, cookies, and DevTools unless explicitly required and justified by the task.
- Prefer policy, preferences, extension shell, and narrow browser integration over deep native Chromium rewrites.

- If this task produces a patch, place the Echothink-owned patch under `patches/echothink/` and update `patches/series` only when the patch should be part of the active ordered pipeline.
- Keep the patch small, single-purpose, and ordered after inherited Ungoogled Chromium patches.
- Expected patch artifact: `0004-bundled-workspace-extension.patch`.

- Keep extension permissions narrow. Do not add broad host permissions or general-purpose privileged bridges.
- Keep service-rendered business logic outside the bundled extension shell.

Task contents:
- Add patch that bundles the trusted workspace extension with the browser.
- Ensure extension is installed by default for new profiles.
- Ensure extension cannot be silently replaced by a public web-store extension.
- Preserve normal extension system behavior outside this trusted extension.

Delivery criteria:
- `0004-bundled-workspace-extension.patch` exists.
- Extension loads by default.
- Extension permissions remain narrow.
- Patch does not weaken extension permission model.

Required documentation update:
- Create or update this task note unless a better existing doc already exists:
  `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\echothink-browser-alpha\t13-add-bundled-extension-install-patch.md`
- Also update any broader browser Alpha docs affected by the task under `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs`.
- Update `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md` with a row or section for T13.

Validation requirements:
- Run the smallest relevant validation available for this task.
- For discovery/spec tasks, validate by checking source paths and linking decisions to concrete files.
- For patch tasks, validate patch file placement, patch ordering, and whether the patch applies or at least has a documented application command.
- For extension tasks, validate manifest shape, permissions, and local loading/build assumptions.
- For Windows packaging tasks, validate names, assets, channel metadata, and smoke-test steps as far as the local environment allows.

Final response format:
```
TASK T13 STATUS: DONE or BLOCKED

Summary:
- ...

Changed files:
- ...

Docs updated:
- ...

Validation:
- Command/result or reason not runnable

Progress.md update:
- Confirmed updated at `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md`

Remaining risks / follow-up:
- ...
```

```


### Prompt for T20: Define login gate local state and allowlist


```text

You are an implementation agent working on Echothink Browser Alpha.

Task: T20 — Define login gate local state and allowlist
Wave: W4
Prerequisites: T10, T11
Delivery target: M4: login gate spec

Repository root:
`C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new`

Mandatory reading before changing files:
1. `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\ungoogled_to_echothink_browser_change_plan.md`
2. `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md` if it exists
3. Any existing docs under `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs` directly relevant to this task
4. The local repository files that this task may modify

Global coordination rules:
- Maintain `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md` as the shared source of truth for task progress.
- Before starting, check `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md` and confirm all prerequisites for T20 are marked DONE or explicitly documented as acceptable baseline dependencies.
- If prerequisites are not complete, do not fake completion. Mark this task BLOCKED with the missing prerequisite IDs and the exact files or decisions needed.
- Update or create documentation only under `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs`.
- Record meaningful implementation notes, changed files, validation commands, validation results, and known limitations in `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md`.
- Do not implement backend services, gateway logic, search ranking, chat orchestration, workflow orchestration, or business pages. This task is browser-repository work only.
- Preserve Chromium and Ungoogled Chromium native behavior unless this task explicitly requires a narrow browser-shell change.
- Avoid changes to network stack, TLS validation, sandbox, renderer internals, downloads, history, bookmarks, password manager, cookies, and DevTools unless explicitly required and justified by the task.
- Prefer policy, preferences, extension shell, and narrow browser integration over deep native Chromium rewrites.

Task contents:
- Define local auth/device readiness flags.
- Define unauthenticated navigation allowlist.
- Define blocked-navigation behavior.
- Define how successful setup unlocks normal browsing.
- Define diagnostics and support exceptions.

Delivery criteria:
- Login gate spec exists.
- Allowlist is explicit.
- Setup completion criteria are documented.
- General browsing remains blocked before setup.

Required documentation update:
- Create or update this task note unless a better existing doc already exists:
  `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\echothink-browser-alpha\t20-define-login-gate-local-state-and-allowlist.md`
- Also update any broader browser Alpha docs affected by the task under `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs`.
- Update `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md` with a row or section for T20.

Validation requirements:
- Run the smallest relevant validation available for this task.
- For discovery/spec tasks, validate by checking source paths and linking decisions to concrete files.
- For patch tasks, validate patch file placement, patch ordering, and whether the patch applies or at least has a documented application command.
- For extension tasks, validate manifest shape, permissions, and local loading/build assumptions.
- For Windows packaging tasks, validate names, assets, channel metadata, and smoke-test steps as far as the local environment allows.

Final response format:
```
TASK T20 STATUS: DONE or BLOCKED

Summary:
- ...

Changed files:
- ...

Docs updated:
- ...

Validation:
- Command/result or reason not runnable

Progress.md update:
- Confirmed updated at `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md`

Remaining risks / follow-up:
- ...
```

```


### Prompt for T31: Implement Windows packaging identity patch


```text

You are an implementation agent working on Echothink Browser Alpha.

Task: T31 — Implement Windows packaging identity patch
Wave: W4
Prerequisites: T30
Delivery target: M7: `0010-windows-packaging-identity.patch`

Repository root:
`C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new`

Mandatory reading before changing files:
1. `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\ungoogled_to_echothink_browser_change_plan.md`
2. `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md` if it exists
3. Any existing docs under `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs` directly relevant to this task
4. The local repository files that this task may modify

Global coordination rules:
- Maintain `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md` as the shared source of truth for task progress.
- Before starting, check `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md` and confirm all prerequisites for T31 are marked DONE or explicitly documented as acceptable baseline dependencies.
- If prerequisites are not complete, do not fake completion. Mark this task BLOCKED with the missing prerequisite IDs and the exact files or decisions needed.
- Update or create documentation only under `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs`.
- Record meaningful implementation notes, changed files, validation commands, validation results, and known limitations in `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md`.
- Do not implement backend services, gateway logic, search ranking, chat orchestration, workflow orchestration, or business pages. This task is browser-repository work only.
- Preserve Chromium and Ungoogled Chromium native behavior unless this task explicitly requires a narrow browser-shell change.
- Avoid changes to network stack, TLS validation, sandbox, renderer internals, downloads, history, bookmarks, password manager, cookies, and DevTools unless explicitly required and justified by the task.
- Prefer policy, preferences, extension shell, and narrow browser integration over deep native Chromium rewrites.

- If this task produces a patch, place the Echothink-owned patch under `patches/echothink/` and update `patches/series` only when the patch should be part of the active ordered pipeline.
- Keep the patch small, single-purpose, and ordered after inherited Ungoogled Chromium patches.
- Expected patch artifact: `0010-windows-packaging-identity.patch`.

- Treat Windows Alpha as the primary target; document any non-Windows behavior as out of scope unless needed for patch safety.

Task contents:
- Add patch for Windows package/application identity surfaces.
- Connect installer/app identity to branding assets where possible.
- Expose channel information in appropriate browser surfaces.
- Avoid risky executable/internal renames for Alpha unless required.

Delivery criteria:
- `0010-windows-packaging-identity.patch` exists.
- Windows app identity shows Echothink Browser.
- Channel identity is visible or documented.
- Patch applies after branding/assets decisions.

Required documentation update:
- Create or update this task note unless a better existing doc already exists:
  `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\echothink-browser-alpha\t31-implement-windows-packaging-identity-patch.md`
- Also update any broader browser Alpha docs affected by the task under `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs`.
- Update `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md` with a row or section for T31.

Validation requirements:
- Run the smallest relevant validation available for this task.
- For discovery/spec tasks, validate by checking source paths and linking decisions to concrete files.
- For patch tasks, validate patch file placement, patch ordering, and whether the patch applies or at least has a documented application command.
- For extension tasks, validate manifest shape, permissions, and local loading/build assumptions.
- For Windows packaging tasks, validate names, assets, channel metadata, and smoke-test steps as far as the local environment allows.

Final response format:
```
TASK T31 STATUS: DONE or BLOCKED

Summary:
- ...

Changed files:
- ...

Docs updated:
- ...

Validation:
- Command/result or reason not runnable

Progress.md update:
- Confirmed updated at `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md`

Remaining risks / follow-up:
- ...
```

```



## W5 — M3/M4/M5/M6/M7 implementation


Side Panel entry, login gate, device design, optional route resolver, and Windows docs can run in parallel.


### Prompt for T14: Implement Side Panel container


```text

You are an implementation agent working on Echothink Browser Alpha.

Task: T14 — Implement Side Panel container
Wave: W5
Prerequisites: T13
Delivery target: M3: Side Panel opens

Repository root:
`C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new`

Mandatory reading before changing files:
1. `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\ungoogled_to_echothink_browser_change_plan.md`
2. `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md` if it exists
3. Any existing docs under `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs` directly relevant to this task
4. The local repository files that this task may modify

Global coordination rules:
- Maintain `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md` as the shared source of truth for task progress.
- Before starting, check `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md` and confirm all prerequisites for T14 are marked DONE or explicitly documented as acceptable baseline dependencies.
- If prerequisites are not complete, do not fake completion. Mark this task BLOCKED with the missing prerequisite IDs and the exact files or decisions needed.
- Update or create documentation only under `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs`.
- Record meaningful implementation notes, changed files, validation commands, validation results, and known limitations in `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md`.
- Do not implement backend services, gateway logic, search ranking, chat orchestration, workflow orchestration, or business pages. This task is browser-repository work only.
- Preserve Chromium and Ungoogled Chromium native behavior unless this task explicitly requires a narrow browser-shell change.
- Avoid changes to network stack, TLS validation, sandbox, renderer internals, downloads, history, bookmarks, password manager, cookies, and DevTools unless explicitly required and justified by the task.
- Prefer policy, preferences, extension shell, and narrow browser integration over deep native Chromium rewrites.

- Keep extension permissions narrow. Do not add broad host permissions or general-purpose privileged bridges.
- Keep service-rendered business logic outside the bundled extension shell.

Task contents:
- Add Side Panel entry behavior through the bundled extension.
- Add toolbar or browser entry point if needed.
- Load the extension Side Panel shell.
- Keep service-rendered content separate from extension shell logic.

Delivery criteria:
- Side Panel opens from browser UI.
- Side Panel loads extension shell.
- No heavy business logic is embedded.

Required documentation update:
- Create or update this task note unless a better existing doc already exists:
  `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\echothink-browser-alpha\t14-implement-side-panel-container.md`
- Also update any broader browser Alpha docs affected by the task under `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs`.
- Update `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md` with a row or section for T14.

Validation requirements:
- Run the smallest relevant validation available for this task.
- For discovery/spec tasks, validate by checking source paths and linking decisions to concrete files.
- For patch tasks, validate patch file placement, patch ordering, and whether the patch applies or at least has a documented application command.
- For extension tasks, validate manifest shape, permissions, and local loading/build assumptions.
- For Windows packaging tasks, validate names, assets, channel metadata, and smoke-test steps as far as the local environment allows.

Final response format:
```
TASK T14 STATUS: DONE or BLOCKED

Summary:
- ...

Changed files:
- ...

Docs updated:
- ...

Validation:
- Command/result or reason not runnable

Progress.md update:
- Confirmed updated at `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md`

Remaining risks / follow-up:
- ...
```

```


### Prompt for T21: Implement login-required startup gate


```text

You are an implementation agent working on Echothink Browser Alpha.

Task: T21 — Implement login-required startup gate
Wave: W5
Prerequisites: T20
Delivery target: M4: `0006-login-gate.patch`

Repository root:
`C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new`

Mandatory reading before changing files:
1. `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\ungoogled_to_echothink_browser_change_plan.md`
2. `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md` if it exists
3. Any existing docs under `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs` directly relevant to this task
4. The local repository files that this task may modify

Global coordination rules:
- Maintain `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md` as the shared source of truth for task progress.
- Before starting, check `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md` and confirm all prerequisites for T21 are marked DONE or explicitly documented as acceptable baseline dependencies.
- If prerequisites are not complete, do not fake completion. Mark this task BLOCKED with the missing prerequisite IDs and the exact files or decisions needed.
- Update or create documentation only under `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs`.
- Record meaningful implementation notes, changed files, validation commands, validation results, and known limitations in `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md`.
- Do not implement backend services, gateway logic, search ranking, chat orchestration, workflow orchestration, or business pages. This task is browser-repository work only.
- Preserve Chromium and Ungoogled Chromium native behavior unless this task explicitly requires a narrow browser-shell change.
- Avoid changes to network stack, TLS validation, sandbox, renderer internals, downloads, history, bookmarks, password manager, cookies, and DevTools unless explicitly required and justified by the task.
- Prefer policy, preferences, extension shell, and narrow browser integration over deep native Chromium rewrites.

- If this task produces a patch, place the Echothink-owned patch under `patches/echothink/` and update `patches/series` only when the patch should be part of the active ordered pipeline.
- Keep the patch small, single-purpose, and ordered after inherited Ungoogled Chromium patches.
- Expected patch artifact: `0006-login-gate.patch`.

Task contents:
- Open login/enrollment path on first launch.
- Check local readiness flags before normal browsing.
- Allow only approved unauthenticated destinations before setup.
- Show a local explanation page for blocked navigation.
- Restore normal Chromium browsing after setup completion.

Delivery criteria:
- `0006-login-gate.patch` exists.
- First launch forces setup.
- Arbitrary browsing is blocked before setup.
- Allowed setup/support routes still work.

Required documentation update:
- Create or update this task note unless a better existing doc already exists:
  `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\echothink-browser-alpha\t21-implement-login-required-startup-gate.md`
- Also update any broader browser Alpha docs affected by the task under `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs`.
- Update `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md` with a row or section for T21.

Validation requirements:
- Run the smallest relevant validation available for this task.
- For discovery/spec tasks, validate by checking source paths and linking decisions to concrete files.
- For patch tasks, validate patch file placement, patch ordering, and whether the patch applies or at least has a documented application command.
- For extension tasks, validate manifest shape, permissions, and local loading/build assumptions.
- For Windows packaging tasks, validate names, assets, channel metadata, and smoke-test steps as far as the local environment allows.

Final response format:
```
TASK T21 STATUS: DONE or BLOCKED

Summary:
- ...

Changed files:
- ...

Docs updated:
- ...

Validation:
- Command/result or reason not runnable

Progress.md update:
- Confirmed updated at `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md`

Remaining risks / follow-up:
- ...
```

```


### Prompt for T22: Define device identity and DPAPI storage


```text

You are an implementation agent working on Echothink Browser Alpha.

Task: T22 — Define device identity and DPAPI storage
Wave: W5
Prerequisites: T00, T20
Delivery target: M5: device identity design

Repository root:
`C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new`

Mandatory reading before changing files:
1. `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\ungoogled_to_echothink_browser_change_plan.md`
2. `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md` if it exists
3. Any existing docs under `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs` directly relevant to this task
4. The local repository files that this task may modify

Global coordination rules:
- Maintain `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md` as the shared source of truth for task progress.
- Before starting, check `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md` and confirm all prerequisites for T22 are marked DONE or explicitly documented as acceptable baseline dependencies.
- If prerequisites are not complete, do not fake completion. Mark this task BLOCKED with the missing prerequisite IDs and the exact files or decisions needed.
- Update or create documentation only under `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs`.
- Record meaningful implementation notes, changed files, validation commands, validation results, and known limitations in `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md`.
- Do not implement backend services, gateway logic, search ranking, chat orchestration, workflow orchestration, or business pages. This task is browser-repository work only.
- Preserve Chromium and Ungoogled Chromium native behavior unless this task explicitly requires a narrow browser-shell change.
- Avoid changes to network stack, TLS validation, sandbox, renderer internals, downloads, history, bookmarks, password manager, cookies, and DevTools unless explicitly required and justified by the task.
- Prefer policy, preferences, extension shell, and narrow browser integration over deep native Chromium rewrites.

- Never expose private key material, access tokens, or proof internals in JavaScript, logs, docs examples, or progress notes.

Task contents:
- Define local device identity fields.
- Define Windows DPAPI storage approach for private key material.
- Define non-secret metadata storage in profile preferences or local state.
- Define reset/logout behavior.
- Define bridge boundaries so extension JavaScript never sees private key
  material.

Delivery criteria:
- Device identity design exists.
- DPAPI is selected for Alpha.
- Private key exposure boundaries are documented.
- Reset behavior is documented.

Required documentation update:
- Create or update this task note unless a better existing doc already exists:
  `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\echothink-browser-alpha\t22-define-device-identity-and-dpapi-storage.md`
- Also update any broader browser Alpha docs affected by the task under `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs`.
- Update `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md` with a row or section for T22.

Validation requirements:
- Run the smallest relevant validation available for this task.
- For discovery/spec tasks, validate by checking source paths and linking decisions to concrete files.
- For patch tasks, validate patch file placement, patch ordering, and whether the patch applies or at least has a documented application command.
- For extension tasks, validate manifest shape, permissions, and local loading/build assumptions.
- For Windows packaging tasks, validate names, assets, channel metadata, and smoke-test steps as far as the local environment allows.

Final response format:
```
TASK T22 STATUS: DONE or BLOCKED

Summary:
- ...

Changed files:
- ...

Docs updated:
- ...

Validation:
- Command/result or reason not runnable

Progress.md update:
- Confirmed updated at `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md`

Remaining risks / follow-up:
- ...
```

```


### Prompt for T28: Implement optional `echo://` resolver


```text

You are an implementation agent working on Echothink Browser Alpha.

Task: T28 — Implement optional `echo://` resolver
Wave: W5
Prerequisites: T10
Delivery target: M6: `0009-echo-protocol-router.patch`

Repository root:
`C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new`

Mandatory reading before changing files:
1. `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\ungoogled_to_echothink_browser_change_plan.md`
2. `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md` if it exists
3. Any existing docs under `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs` directly relevant to this task
4. The local repository files that this task may modify

Global coordination rules:
- Maintain `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md` as the shared source of truth for task progress.
- Before starting, check `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md` and confirm all prerequisites for T28 are marked DONE or explicitly documented as acceptable baseline dependencies.
- If prerequisites are not complete, do not fake completion. Mark this task BLOCKED with the missing prerequisite IDs and the exact files or decisions needed.
- Update or create documentation only under `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs`.
- Record meaningful implementation notes, changed files, validation commands, validation results, and known limitations in `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md`.
- Do not implement backend services, gateway logic, search ranking, chat orchestration, workflow orchestration, or business pages. This task is browser-repository work only.
- Preserve Chromium and Ungoogled Chromium native behavior unless this task explicitly requires a narrow browser-shell change.
- Avoid changes to network stack, TLS validation, sandbox, renderer internals, downloads, history, bookmarks, password manager, cookies, and DevTools unless explicitly required and justified by the task.
- Prefer policy, preferences, extension shell, and narrow browser integration over deep native Chromium rewrites.

- If this task produces a patch, place the Echothink-owned patch under `patches/echothink/` and update `patches/series` only when the patch should be part of the active ordered pipeline.
- Keep the patch small, single-purpose, and ordered after inherited Ungoogled Chromium patches.
- Expected patch artifact: `0009-echo-protocol-router.patch`.

Task contents:
- Add route resolver for known `echo://` routes.
- Map routes to HTTPS Echothink app URLs.
- Keep resolver as navigation helper only.
- Do not bypass backend authorization or device proof.

Delivery criteria:
- `0009-echo-protocol-router.patch` exists.
- Valid `echo://` routes navigate to expected HTTPS URLs.
- Resolver does not expose protected content.

Required documentation update:
- Create or update this task note unless a better existing doc already exists:
  `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\echothink-browser-alpha\t28-implement-optional-resolver.md`
- Also update any broader browser Alpha docs affected by the task under `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs`.
- Update `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md` with a row or section for T28.

Validation requirements:
- Run the smallest relevant validation available for this task.
- For discovery/spec tasks, validate by checking source paths and linking decisions to concrete files.
- For patch tasks, validate patch file placement, patch ordering, and whether the patch applies or at least has a documented application command.
- For extension tasks, validate manifest shape, permissions, and local loading/build assumptions.
- For Windows packaging tasks, validate names, assets, channel metadata, and smoke-test steps as far as the local environment allows.

Final response format:
```
TASK T28 STATUS: DONE or BLOCKED

Summary:
- ...

Changed files:
- ...

Docs updated:
- ...

Validation:
- Command/result or reason not runnable

Progress.md update:
- Confirmed updated at `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md`

Remaining risks / follow-up:
- ...
```

```


### Prompt for T32: Add Windows build/signing/smoke docs


```text

You are an implementation agent working on Echothink Browser Alpha.

Task: T32 — Add Windows build/signing/smoke docs
Wave: W5
Prerequisites: T30, T31
Delivery target: M7: Windows Alpha release docs

Repository root:
`C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new`

Mandatory reading before changing files:
1. `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\ungoogled_to_echothink_browser_change_plan.md`
2. `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md` if it exists
3. Any existing docs under `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs` directly relevant to this task
4. The local repository files that this task may modify

Global coordination rules:
- Maintain `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md` as the shared source of truth for task progress.
- Before starting, check `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md` and confirm all prerequisites for T32 are marked DONE or explicitly documented as acceptable baseline dependencies.
- If prerequisites are not complete, do not fake completion. Mark this task BLOCKED with the missing prerequisite IDs and the exact files or decisions needed.
- Update or create documentation only under `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs`.
- Record meaningful implementation notes, changed files, validation commands, validation results, and known limitations in `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md`.
- Do not implement backend services, gateway logic, search ranking, chat orchestration, workflow orchestration, or business pages. This task is browser-repository work only.
- Preserve Chromium and Ungoogled Chromium native behavior unless this task explicitly requires a narrow browser-shell change.
- Avoid changes to network stack, TLS validation, sandbox, renderer internals, downloads, history, bookmarks, password manager, cookies, and DevTools unless explicitly required and justified by the task.
- Prefer policy, preferences, extension shell, and narrow browser integration over deep native Chromium rewrites.

- Treat Windows Alpha as the primary target; document any non-Windows behavior as out of scope unless needed for patch safety.

Task contents:
- Add Windows build notes.
- Add signing workflow notes.
- Add update-channel notes.
- Add smoke test procedure.
- Add release checklist for Alpha candidate.

Delivery criteria:
- Windows Alpha release docs exist.
- A developer can build, package, sign, and smoke test from the docs.
- Smoke test includes launch, branding, New Tab, Side Panel, search, restart,
  and uninstall.

Required documentation update:
- Create or update this task note unless a better existing doc already exists:
  `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\echothink-browser-alpha\t32-add-windows-build-signing-smoke-docs.md`
- Also update any broader browser Alpha docs affected by the task under `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs`.
- Update `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md` with a row or section for T32.

Validation requirements:
- Run the smallest relevant validation available for this task.
- For discovery/spec tasks, validate by checking source paths and linking decisions to concrete files.
- For patch tasks, validate patch file placement, patch ordering, and whether the patch applies or at least has a documented application command.
- For extension tasks, validate manifest shape, permissions, and local loading/build assumptions.
- For Windows packaging tasks, validate names, assets, channel metadata, and smoke-test steps as far as the local environment allows.

Final response format:
```
TASK T32 STATUS: DONE or BLOCKED

Summary:
- ...

Changed files:
- ...

Docs updated:
- ...

Validation:
- Command/result or reason not runnable

Progress.md update:
- Confirmed updated at `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md`

Remaining risks / follow-up:
- ...
```

```



## W6 — M3/M5/M6 implementation


Side Panel modes, DPAPI key storage, and invalid route fallback are independent after their parents.


### Prompt for T15: Implement Side Panel mode selector


```text

You are an implementation agent working on Echothink Browser Alpha.

Task: T15 — Implement Side Panel mode selector
Wave: W6
Prerequisites: T14
Delivery target: M3: switchable panel modes

Repository root:
`C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new`

Mandatory reading before changing files:
1. `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\ungoogled_to_echothink_browser_change_plan.md`
2. `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md` if it exists
3. Any existing docs under `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs` directly relevant to this task
4. The local repository files that this task may modify

Global coordination rules:
- Maintain `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md` as the shared source of truth for task progress.
- Before starting, check `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md` and confirm all prerequisites for T15 are marked DONE or explicitly documented as acceptable baseline dependencies.
- If prerequisites are not complete, do not fake completion. Mark this task BLOCKED with the missing prerequisite IDs and the exact files or decisions needed.
- Update or create documentation only under `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs`.
- Record meaningful implementation notes, changed files, validation commands, validation results, and known limitations in `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md`.
- Do not implement backend services, gateway logic, search ranking, chat orchestration, workflow orchestration, or business pages. This task is browser-repository work only.
- Preserve Chromium and Ungoogled Chromium native behavior unless this task explicitly requires a narrow browser-shell change.
- Avoid changes to network stack, TLS validation, sandbox, renderer internals, downloads, history, bookmarks, password manager, cookies, and DevTools unless explicitly required and justified by the task.
- Prefer policy, preferences, extension shell, and narrow browser integration over deep native Chromium rewrites.

- Keep extension permissions narrow. Do not add broad host permissions or general-purpose privileged bridges.
- Keep service-rendered business logic outside the bundled extension shell.

Task contents:
- Add a visible top-level mode selector.
- Support exactly two Alpha modes: `chat` and `workspace_context`.
- Persist selected mode in profile-local extension storage.
- Switch modes without browser restart.

Delivery criteria:
- User can switch between Chat Panel and Workspace Context.
- Selected mode persists across restart.
- Mode state is profile-local.

Required documentation update:
- Create or update this task note unless a better existing doc already exists:
  `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\echothink-browser-alpha\t15-implement-side-panel-mode-selector.md`
- Also update any broader browser Alpha docs affected by the task under `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs`.
- Update `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md` with a row or section for T15.

Validation requirements:
- Run the smallest relevant validation available for this task.
- For discovery/spec tasks, validate by checking source paths and linking decisions to concrete files.
- For patch tasks, validate patch file placement, patch ordering, and whether the patch applies or at least has a documented application command.
- For extension tasks, validate manifest shape, permissions, and local loading/build assumptions.
- For Windows packaging tasks, validate names, assets, channel metadata, and smoke-test steps as far as the local environment allows.

Final response format:
```
TASK T15 STATUS: DONE or BLOCKED

Summary:
- ...

Changed files:
- ...

Docs updated:
- ...

Validation:
- Command/result or reason not runnable

Progress.md update:
- Confirmed updated at `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md`

Remaining risks / follow-up:
- ...
```

```


### Prompt for T23: Implement device key generation and storage


```text

You are an implementation agent working on Echothink Browser Alpha.

Task: T23 — Implement device key generation and storage
Wave: W6
Prerequisites: T22
Delivery target: M5: `0007-device-identity.patch`

Repository root:
`C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new`

Mandatory reading before changing files:
1. `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\ungoogled_to_echothink_browser_change_plan.md`
2. `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md` if it exists
3. Any existing docs under `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs` directly relevant to this task
4. The local repository files that this task may modify

Global coordination rules:
- Maintain `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md` as the shared source of truth for task progress.
- Before starting, check `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md` and confirm all prerequisites for T23 are marked DONE or explicitly documented as acceptable baseline dependencies.
- If prerequisites are not complete, do not fake completion. Mark this task BLOCKED with the missing prerequisite IDs and the exact files or decisions needed.
- Update or create documentation only under `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs`.
- Record meaningful implementation notes, changed files, validation commands, validation results, and known limitations in `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md`.
- Do not implement backend services, gateway logic, search ranking, chat orchestration, workflow orchestration, or business pages. This task is browser-repository work only.
- Preserve Chromium and Ungoogled Chromium native behavior unless this task explicitly requires a narrow browser-shell change.
- Avoid changes to network stack, TLS validation, sandbox, renderer internals, downloads, history, bookmarks, password manager, cookies, and DevTools unless explicitly required and justified by the task.
- Prefer policy, preferences, extension shell, and narrow browser integration over deep native Chromium rewrites.

- If this task produces a patch, place the Echothink-owned patch under `patches/echothink/` and update `patches/series` only when the patch should be part of the active ordered pipeline.
- Keep the patch small, single-purpose, and ordered after inherited Ungoogled Chromium patches.
- Expected patch artifact: `0007-device-identity.patch`.

- Never expose private key material, access tokens, or proof internals in JavaScript, logs, docs examples, or progress notes.

Task contents:
- Generate asymmetric keypair per browser installation.
- Store private key with Windows DPAPI.
- Store non-secret device metadata.
- Persist identity across browser restart.
- Support explicit reset of local enrollment state.

Delivery criteria:
- `0007-device-identity.patch` exists.
- Device identity persists across restart.
- Private key is protected by DPAPI.
- Reset removes local enrollment state.

Required documentation update:
- Create or update this task note unless a better existing doc already exists:
  `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\echothink-browser-alpha\t23-implement-device-key-generation-and-storage.md`
- Also update any broader browser Alpha docs affected by the task under `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs`.
- Update `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md` with a row or section for T23.

Validation requirements:
- Run the smallest relevant validation available for this task.
- For discovery/spec tasks, validate by checking source paths and linking decisions to concrete files.
- For patch tasks, validate patch file placement, patch ordering, and whether the patch applies or at least has a documented application command.
- For extension tasks, validate manifest shape, permissions, and local loading/build assumptions.
- For Windows packaging tasks, validate names, assets, channel metadata, and smoke-test steps as far as the local environment allows.

Final response format:
```
TASK T23 STATUS: DONE or BLOCKED

Summary:
- ...

Changed files:
- ...

Docs updated:
- ...

Validation:
- Command/result or reason not runnable

Progress.md update:
- Confirmed updated at `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md`

Remaining risks / follow-up:
- ...
```

```


### Prompt for T29: Add invalid `echo://` fallback page


```text

You are an implementation agent working on Echothink Browser Alpha.

Task: T29 — Add invalid `echo://` fallback page
Wave: W6
Prerequisites: T28
Delivery target: M6: safe route failure

Repository root:
`C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new`

Mandatory reading before changing files:
1. `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\ungoogled_to_echothink_browser_change_plan.md`
2. `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md` if it exists
3. Any existing docs under `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs` directly relevant to this task
4. The local repository files that this task may modify

Global coordination rules:
- Maintain `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md` as the shared source of truth for task progress.
- Before starting, check `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md` and confirm all prerequisites for T29 are marked DONE or explicitly documented as acceptable baseline dependencies.
- If prerequisites are not complete, do not fake completion. Mark this task BLOCKED with the missing prerequisite IDs and the exact files or decisions needed.
- Update or create documentation only under `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs`.
- Record meaningful implementation notes, changed files, validation commands, validation results, and known limitations in `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md`.
- Do not implement backend services, gateway logic, search ranking, chat orchestration, workflow orchestration, or business pages. This task is browser-repository work only.
- Preserve Chromium and Ungoogled Chromium native behavior unless this task explicitly requires a narrow browser-shell change.
- Avoid changes to network stack, TLS validation, sandbox, renderer internals, downloads, history, bookmarks, password manager, cookies, and DevTools unless explicitly required and justified by the task.
- Prefer policy, preferences, extension shell, and narrow browser integration over deep native Chromium rewrites.

Task contents:
- Add local fallback page for invalid or unsupported `echo://` routes.
- Show clear route error without leaking resource data.
- Provide safe navigation back to workspace or support.

Delivery criteria:
- Invalid route fallback exists.
- Invalid routes fail safely.
- No protected data appears on error page.

Required documentation update:
- Create or update this task note unless a better existing doc already exists:
  `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\echothink-browser-alpha\t29-add-invalid-fallback-page.md`
- Also update any broader browser Alpha docs affected by the task under `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs`.
- Update `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md` with a row or section for T29.

Validation requirements:
- Run the smallest relevant validation available for this task.
- For discovery/spec tasks, validate by checking source paths and linking decisions to concrete files.
- For patch tasks, validate patch file placement, patch ordering, and whether the patch applies or at least has a documented application command.
- For extension tasks, validate manifest shape, permissions, and local loading/build assumptions.
- For Windows packaging tasks, validate names, assets, channel metadata, and smoke-test steps as far as the local environment allows.

Final response format:
```
TASK T29 STATUS: DONE or BLOCKED

Summary:
- ...

Changed files:
- ...

Docs updated:
- ...

Validation:
- Command/result or reason not runnable

Progress.md update:
- Confirmed updated at `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md`

Remaining risks / follow-up:
- ...
```

```



## W7 — M3/M5 extension work


Chat mode, Workspace Context mode, and device bridge can run together.


### Prompt for T16: Implement Chat Panel shell


```text

You are an implementation agent working on Echothink Browser Alpha.

Task: T16 — Implement Chat Panel shell
Wave: W7
Prerequisites: T15
Delivery target: M3: chat mode with scope metadata

Repository root:
`C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new`

Mandatory reading before changing files:
1. `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\ungoogled_to_echothink_browser_change_plan.md`
2. `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md` if it exists
3. Any existing docs under `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs` directly relevant to this task
4. The local repository files that this task may modify

Global coordination rules:
- Maintain `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md` as the shared source of truth for task progress.
- Before starting, check `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md` and confirm all prerequisites for T16 are marked DONE or explicitly documented as acceptable baseline dependencies.
- If prerequisites are not complete, do not fake completion. Mark this task BLOCKED with the missing prerequisite IDs and the exact files or decisions needed.
- Update or create documentation only under `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs`.
- Record meaningful implementation notes, changed files, validation commands, validation results, and known limitations in `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md`.
- Do not implement backend services, gateway logic, search ranking, chat orchestration, workflow orchestration, or business pages. This task is browser-repository work only.
- Preserve Chromium and Ungoogled Chromium native behavior unless this task explicitly requires a narrow browser-shell change.
- Avoid changes to network stack, TLS validation, sandbox, renderer internals, downloads, history, bookmarks, password manager, cookies, and DevTools unless explicitly required and justified by the task.
- Prefer policy, preferences, extension shell, and narrow browser integration over deep native Chromium rewrites.

- Keep extension permissions narrow. Do not add broad host permissions or general-purpose privileged bridges.
- Keep service-rendered business logic outside the bundled extension shell.

Task contents:
- Add Chat Panel UI shell.
- Add scope selector with Alpha scopes: current page, current project, current
  App Domain, current Task Wave, recent artifacts, organization workspace.
- Collect selected scope metadata for outbound requests.
- Support streaming response display when the remote endpoint supports it.
- Keep conversation persistence and model orchestration outside the browser.

Delivery criteria:
- Chat mode renders.
- Scope selector is visible.
- Outbound request metadata includes selected scope.
- No private key or token internals are exposed in chat UI.

Required documentation update:
- Create or update this task note unless a better existing doc already exists:
  `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\echothink-browser-alpha\t16-implement-chat-panel-shell.md`
- Also update any broader browser Alpha docs affected by the task under `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs`.
- Update `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md` with a row or section for T16.

Validation requirements:
- Run the smallest relevant validation available for this task.
- For discovery/spec tasks, validate by checking source paths and linking decisions to concrete files.
- For patch tasks, validate patch file placement, patch ordering, and whether the patch applies or at least has a documented application command.
- For extension tasks, validate manifest shape, permissions, and local loading/build assumptions.
- For Windows packaging tasks, validate names, assets, channel metadata, and smoke-test steps as far as the local environment allows.

Final response format:
```
TASK T16 STATUS: DONE or BLOCKED

Summary:
- ...

Changed files:
- ...

Docs updated:
- ...

Validation:
- Command/result or reason not runnable

Progress.md update:
- Confirmed updated at `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md`

Remaining risks / follow-up:
- ...
```

```


### Prompt for T17: Implement Workspace Context shell


```text

You are an implementation agent working on Echothink Browser Alpha.

Task: T17 — Implement Workspace Context shell
Wave: W7
Prerequisites: T15
Delivery target: M3: workspace context mode

Repository root:
`C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new`

Mandatory reading before changing files:
1. `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\ungoogled_to_echothink_browser_change_plan.md`
2. `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md` if it exists
3. Any existing docs under `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs` directly relevant to this task
4. The local repository files that this task may modify

Global coordination rules:
- Maintain `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md` as the shared source of truth for task progress.
- Before starting, check `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md` and confirm all prerequisites for T17 are marked DONE or explicitly documented as acceptable baseline dependencies.
- If prerequisites are not complete, do not fake completion. Mark this task BLOCKED with the missing prerequisite IDs and the exact files or decisions needed.
- Update or create documentation only under `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs`.
- Record meaningful implementation notes, changed files, validation commands, validation results, and known limitations in `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md`.
- Do not implement backend services, gateway logic, search ranking, chat orchestration, workflow orchestration, or business pages. This task is browser-repository work only.
- Preserve Chromium and Ungoogled Chromium native behavior unless this task explicitly requires a narrow browser-shell change.
- Avoid changes to network stack, TLS validation, sandbox, renderer internals, downloads, history, bookmarks, password manager, cookies, and DevTools unless explicitly required and justified by the task.
- Prefer policy, preferences, extension shell, and narrow browser integration over deep native Chromium rewrites.

- Keep extension permissions narrow. Do not add broad host permissions or general-purpose privileged bridges.
- Keep service-rendered business logic outside the bundled extension shell.

Task contents:
- Add Workspace Context mode UI shell.
- Provide containers for current project context, App Domain context, Task Wave
  status, agent console entry, pending approvals, recent artifacts, project
  navigation, notifications, and quick actions.
- Render service-provided content where available.
- Keep business logic outside the extension.

Delivery criteria:
- Workspace Context mode renders.
- All required context sections have UI containers.
- Extension does not implement workflow/business logic.

Required documentation update:
- Create or update this task note unless a better existing doc already exists:
  `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\echothink-browser-alpha\t17-implement-workspace-context-shell.md`
- Also update any broader browser Alpha docs affected by the task under `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs`.
- Update `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md` with a row or section for T17.

Validation requirements:
- Run the smallest relevant validation available for this task.
- For discovery/spec tasks, validate by checking source paths and linking decisions to concrete files.
- For patch tasks, validate patch file placement, patch ordering, and whether the patch applies or at least has a documented application command.
- For extension tasks, validate manifest shape, permissions, and local loading/build assumptions.
- For Windows packaging tasks, validate names, assets, channel metadata, and smoke-test steps as far as the local environment allows.

Final response format:
```
TASK T17 STATUS: DONE or BLOCKED

Summary:
- ...

Changed files:
- ...

Docs updated:
- ...

Validation:
- Command/result or reason not runnable

Progress.md update:
- Confirmed updated at `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md`

Remaining risks / follow-up:
- ...
```

```


### Prompt for T24: Implement narrow extension bridge


```text

You are an implementation agent working on Echothink Browser Alpha.

Task: T24 — Implement narrow extension bridge
Wave: W7
Prerequisites: T13, T23
Delivery target: M5: device bridge API

Repository root:
`C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new`

Mandatory reading before changing files:
1. `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\ungoogled_to_echothink_browser_change_plan.md`
2. `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md` if it exists
3. Any existing docs under `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs` directly relevant to this task
4. The local repository files that this task may modify

Global coordination rules:
- Maintain `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md` as the shared source of truth for task progress.
- Before starting, check `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md` and confirm all prerequisites for T24 are marked DONE or explicitly documented as acceptable baseline dependencies.
- If prerequisites are not complete, do not fake completion. Mark this task BLOCKED with the missing prerequisite IDs and the exact files or decisions needed.
- Update or create documentation only under `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs`.
- Record meaningful implementation notes, changed files, validation commands, validation results, and known limitations in `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md`.
- Do not implement backend services, gateway logic, search ranking, chat orchestration, workflow orchestration, or business pages. This task is browser-repository work only.
- Preserve Chromium and Ungoogled Chromium native behavior unless this task explicitly requires a narrow browser-shell change.
- Avoid changes to network stack, TLS validation, sandbox, renderer internals, downloads, history, bookmarks, password manager, cookies, and DevTools unless explicitly required and justified by the task.
- Prefer policy, preferences, extension shell, and narrow browser integration over deep native Chromium rewrites.

- Keep extension permissions narrow. Do not add broad host permissions or general-purpose privileged bridges.
- Keep service-rendered business logic outside the bundled extension shell.

Task contents:
- Expose only required bridge methods to bundled extension:
  `getDeviceStatus`, `requestEnrollmentChallenge`, `signProofPayload`,
  `clearEnrollment`.
- Ensure private key is never exposed to extension JavaScript.
- Restrict bridge use to the bundled workspace extension.
- Define errors for missing device, locked key, unsupported platform, and reset.

Delivery criteria:
- Device bridge API exists.
- Bundled extension can check device status and request signatures.
- Private key cannot be read by extension code.
- Unauthorized extensions cannot access bridge methods.

Required documentation update:
- Create or update this task note unless a better existing doc already exists:
  `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\echothink-browser-alpha\t24-implement-narrow-extension-bridge.md`
- Also update any broader browser Alpha docs affected by the task under `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs`.
- Update `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md` with a row or section for T24.

Validation requirements:
- Run the smallest relevant validation available for this task.
- For discovery/spec tasks, validate by checking source paths and linking decisions to concrete files.
- For patch tasks, validate patch file placement, patch ordering, and whether the patch applies or at least has a documented application command.
- For extension tasks, validate manifest shape, permissions, and local loading/build assumptions.
- For Windows packaging tasks, validate names, assets, channel metadata, and smoke-test steps as far as the local environment allows.

Final response format:
```
TASK T24 STATUS: DONE or BLOCKED

Summary:
- ...

Changed files:
- ...

Docs updated:
- ...

Validation:
- Command/result or reason not runnable

Progress.md update:
- Confirmed updated at `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md`

Remaining risks / follow-up:
- ...
```

```



## W8 — M3/M5 hardening specs


Side Panel local states and proof payload spec can run after mode and bridge foundations.


### Prompt for T18: Add Side Panel local states


```text

You are an implementation agent working on Echothink Browser Alpha.

Task: T18 — Add Side Panel local states
Wave: W8
Prerequisites: T16, T17
Delivery target: M3: resilient Side Panel UX

Repository root:
`C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new`

Mandatory reading before changing files:
1. `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\ungoogled_to_echothink_browser_change_plan.md`
2. `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md` if it exists
3. Any existing docs under `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs` directly relevant to this task
4. The local repository files that this task may modify

Global coordination rules:
- Maintain `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md` as the shared source of truth for task progress.
- Before starting, check `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md` and confirm all prerequisites for T18 are marked DONE or explicitly documented as acceptable baseline dependencies.
- If prerequisites are not complete, do not fake completion. Mark this task BLOCKED with the missing prerequisite IDs and the exact files or decisions needed.
- Update or create documentation only under `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs`.
- Record meaningful implementation notes, changed files, validation commands, validation results, and known limitations in `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md`.
- Do not implement backend services, gateway logic, search ranking, chat orchestration, workflow orchestration, or business pages. This task is browser-repository work only.
- Preserve Chromium and Ungoogled Chromium native behavior unless this task explicitly requires a narrow browser-shell change.
- Avoid changes to network stack, TLS validation, sandbox, renderer internals, downloads, history, bookmarks, password manager, cookies, and DevTools unless explicitly required and justified by the task.
- Prefer policy, preferences, extension shell, and narrow browser integration over deep native Chromium rewrites.

- Keep extension permissions narrow. Do not add broad host permissions or general-purpose privileged bridges.
- Keep service-rendered business logic outside the bundled extension shell.

Task contents:
- Add UI states for signed out, no device identity, unauthorized scope, offline,
  and remote service error.
- Ensure both Chat Panel and Workspace Context modes can show relevant states.
- Avoid showing protected content when state is unauthenticated or unauthorized.

Delivery criteria:
- Side Panel handles setup and error states gracefully.
- Protected content is not shown in unauthorized states.
- User can recover by following login/enrollment/support links.

Required documentation update:
- Create or update this task note unless a better existing doc already exists:
  `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\echothink-browser-alpha\t18-add-side-panel-local-states.md`
- Also update any broader browser Alpha docs affected by the task under `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs`.
- Update `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md` with a row or section for T18.

Validation requirements:
- Run the smallest relevant validation available for this task.
- For discovery/spec tasks, validate by checking source paths and linking decisions to concrete files.
- For patch tasks, validate patch file placement, patch ordering, and whether the patch applies or at least has a documented application command.
- For extension tasks, validate manifest shape, permissions, and local loading/build assumptions.
- For Windows packaging tasks, validate names, assets, channel metadata, and smoke-test steps as far as the local environment allows.

Final response format:
```
TASK T18 STATUS: DONE or BLOCKED

Summary:
- ...

Changed files:
- ...

Docs updated:
- ...

Validation:
- Command/result or reason not runnable

Progress.md update:
- Confirmed updated at `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md`

Remaining risks / follow-up:
- ...
```

```


### Prompt for T25: Define request proof payload and allowlist


```text

You are an implementation agent working on Echothink Browser Alpha.

Task: T25 — Define request proof payload and allowlist
Wave: W8
Prerequisites: T24
Delivery target: M5: proof helper spec

Repository root:
`C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new`

Mandatory reading before changing files:
1. `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\ungoogled_to_echothink_browser_change_plan.md`
2. `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md` if it exists
3. Any existing docs under `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs` directly relevant to this task
4. The local repository files that this task may modify

Global coordination rules:
- Maintain `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md` as the shared source of truth for task progress.
- Before starting, check `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md` and confirm all prerequisites for T25 are marked DONE or explicitly documented as acceptable baseline dependencies.
- If prerequisites are not complete, do not fake completion. Mark this task BLOCKED with the missing prerequisite IDs and the exact files or decisions needed.
- Update or create documentation only under `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs`.
- Record meaningful implementation notes, changed files, validation commands, validation results, and known limitations in `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md`.
- Do not implement backend services, gateway logic, search ranking, chat orchestration, workflow orchestration, or business pages. This task is browser-repository work only.
- Preserve Chromium and Ungoogled Chromium native behavior unless this task explicitly requires a narrow browser-shell change.
- Avoid changes to network stack, TLS validation, sandbox, renderer internals, downloads, history, bookmarks, password manager, cookies, and DevTools unless explicitly required and justified by the task.
- Prefer policy, preferences, extension shell, and narrow browser integration over deep native Chromium rewrites.

- Never expose private key material, access tokens, or proof internals in JavaScript, logs, docs examples, or progress notes.

Task contents:
- Define canonical proof payload fields: method, URL, timestamp, nonce if
  supplied, and access token hash if required.
- Define Echothink-domain signing allowlist.
- Define rejection behavior for third-party destinations.
- Keep replay protection and proof validation outside the browser.

Delivery criteria:
- Proof helper spec exists.
- Canonical payload shape is documented.
- Domain allowlist is explicit.
- Browser-side responsibilities are limited to signing.

Required documentation update:
- Create or update this task note unless a better existing doc already exists:
  `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\echothink-browser-alpha\t25-define-request-proof-payload-and-allowlist.md`
- Also update any broader browser Alpha docs affected by the task under `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs`.
- Update `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md` with a row or section for T25.

Validation requirements:
- Run the smallest relevant validation available for this task.
- For discovery/spec tasks, validate by checking source paths and linking decisions to concrete files.
- For patch tasks, validate patch file placement, patch ordering, and whether the patch applies or at least has a documented application command.
- For extension tasks, validate manifest shape, permissions, and local loading/build assumptions.
- For Windows packaging tasks, validate names, assets, channel metadata, and smoke-test steps as far as the local environment allows.

Final response format:
```
TASK T25 STATUS: DONE or BLOCKED

Summary:
- ...

Changed files:
- ...

Docs updated:
- ...

Validation:
- Command/result or reason not runnable

Progress.md update:
- Confirmed updated at `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md`

Remaining risks / follow-up:
- ...
```

```



## W9 — M5 proof helper


Proof signing helper depends on proof spec.


### Prompt for T26: Implement proof signing helper


```text

You are an implementation agent working on Echothink Browser Alpha.

Task: T26 — Implement proof signing helper
Wave: W9
Prerequisites: T25
Delivery target: M5: `0008-request-proof-helper.patch`

Repository root:
`C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new`

Mandatory reading before changing files:
1. `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\ungoogled_to_echothink_browser_change_plan.md`
2. `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md` if it exists
3. Any existing docs under `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs` directly relevant to this task
4. The local repository files that this task may modify

Global coordination rules:
- Maintain `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md` as the shared source of truth for task progress.
- Before starting, check `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md` and confirm all prerequisites for T26 are marked DONE or explicitly documented as acceptable baseline dependencies.
- If prerequisites are not complete, do not fake completion. Mark this task BLOCKED with the missing prerequisite IDs and the exact files or decisions needed.
- Update or create documentation only under `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs`.
- Record meaningful implementation notes, changed files, validation commands, validation results, and known limitations in `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md`.
- Do not implement backend services, gateway logic, search ranking, chat orchestration, workflow orchestration, or business pages. This task is browser-repository work only.
- Preserve Chromium and Ungoogled Chromium native behavior unless this task explicitly requires a narrow browser-shell change.
- Avoid changes to network stack, TLS validation, sandbox, renderer internals, downloads, history, bookmarks, password manager, cookies, and DevTools unless explicitly required and justified by the task.
- Prefer policy, preferences, extension shell, and narrow browser integration over deep native Chromium rewrites.

- If this task produces a patch, place the Echothink-owned patch under `patches/echothink/` and update `patches/series` only when the patch should be part of the active ordered pipeline.
- Keep the patch small, single-purpose, and ordered after inherited Ungoogled Chromium patches.
- Expected patch artifact: `0008-request-proof-helper.patch`.

- Never expose private key material, access tokens, or proof internals in JavaScript, logs, docs examples, or progress notes.

Task contents:
- Implement browser-side signing helper using local device private key.
- Accept only canonical payloads from authorized bridge caller.
- Sign only allowed Echothink destinations.
- Return signature/proof result without exposing private key.
- Reject malformed payloads and non-allowed destinations.

Delivery criteria:
- `0008-request-proof-helper.patch` exists.
- Helper signs valid Echothink payloads.
- Helper rejects third-party URLs.
- Helper does not alter Chromium network/TLS behavior.

Required documentation update:
- Create or update this task note unless a better existing doc already exists:
  `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\echothink-browser-alpha\t26-implement-proof-signing-helper.md`
- Also update any broader browser Alpha docs affected by the task under `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs`.
- Update `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md` with a row or section for T26.

Validation requirements:
- Run the smallest relevant validation available for this task.
- For discovery/spec tasks, validate by checking source paths and linking decisions to concrete files.
- For patch tasks, validate patch file placement, patch ordering, and whether the patch applies or at least has a documented application command.
- For extension tasks, validate manifest shape, permissions, and local loading/build assumptions.
- For Windows packaging tasks, validate names, assets, channel metadata, and smoke-test steps as far as the local environment allows.

Final response format:
```
TASK T26 STATUS: DONE or BLOCKED

Summary:
- ...

Changed files:
- ...

Docs updated:
- ...

Validation:
- Command/result or reason not runnable

Progress.md update:
- Confirmed updated at `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md`

Remaining risks / follow-up:
- ...
```

```



## W10 — M5 proof integration


Extension integration depends on Chat mode, bridge, and signing helper.


### Prompt for T27: Integrate proof helper into extension calls


```text

You are an implementation agent working on Echothink Browser Alpha.

Task: T27 — Integrate proof helper into extension calls
Wave: W10
Prerequisites: T16, T24, T26
Delivery target: M5: proof-capable extension

Repository root:
`C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new`

Mandatory reading before changing files:
1. `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\ungoogled_to_echothink_browser_change_plan.md`
2. `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md` if it exists
3. Any existing docs under `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs` directly relevant to this task
4. The local repository files that this task may modify

Global coordination rules:
- Maintain `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md` as the shared source of truth for task progress.
- Before starting, check `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md` and confirm all prerequisites for T27 are marked DONE or explicitly documented as acceptable baseline dependencies.
- If prerequisites are not complete, do not fake completion. Mark this task BLOCKED with the missing prerequisite IDs and the exact files or decisions needed.
- Update or create documentation only under `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs`.
- Record meaningful implementation notes, changed files, validation commands, validation results, and known limitations in `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md`.
- Do not implement backend services, gateway logic, search ranking, chat orchestration, workflow orchestration, or business pages. This task is browser-repository work only.
- Preserve Chromium and Ungoogled Chromium native behavior unless this task explicitly requires a narrow browser-shell change.
- Avoid changes to network stack, TLS validation, sandbox, renderer internals, downloads, history, bookmarks, password manager, cookies, and DevTools unless explicitly required and justified by the task.
- Prefer policy, preferences, extension shell, and narrow browser integration over deep native Chromium rewrites.

- Keep extension permissions narrow. Do not add broad host permissions or general-purpose privileged bridges.
- Keep service-rendered business logic outside the bundled extension shell.

- Never expose private key material, access tokens, or proof internals in JavaScript, logs, docs examples, or progress notes.

Task contents:
- Update extension API calls to request proof signatures when needed.
- Attach proof headers/metadata for Echothink API/chat calls.
- Handle signing errors locally in the Side Panel.
- Ensure private key never enters extension state or logs.

Delivery criteria:
- Extension can make proof-capable Echothink requests.
- Signing failures show recoverable UI state.
- Extension logs do not expose secrets.

Required documentation update:
- Create or update this task note unless a better existing doc already exists:
  `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\echothink-browser-alpha\t27-integrate-proof-helper-into-extension-calls.md`
- Also update any broader browser Alpha docs affected by the task under `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs`.
- Update `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md` with a row or section for T27.

Validation requirements:
- Run the smallest relevant validation available for this task.
- For discovery/spec tasks, validate by checking source paths and linking decisions to concrete files.
- For patch tasks, validate patch file placement, patch ordering, and whether the patch applies or at least has a documented application command.
- For extension tasks, validate manifest shape, permissions, and local loading/build assumptions.
- For Windows packaging tasks, validate names, assets, channel metadata, and smoke-test steps as far as the local environment allows.

Final response format:
```
TASK T27 STATUS: DONE or BLOCKED

Summary:
- ...

Changed files:
- ...

Docs updated:
- ...

Validation:
- Command/result or reason not runnable

Progress.md update:
- Confirmed updated at `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md`

Remaining risks / follow-up:
- ...
```

```



## W11 — M7 patch validation


Full patch validation starts after all required patches land.


### Prompt for T33: Run full patch validation


```text

You are an implementation agent working on Echothink Browser Alpha.

Task: T33 — Run full patch validation
Wave: W11
Prerequisites: T05, T08, T10, T13, T19, T21, T23, T26, T31
Delivery target: M7: patch validation report

Repository root:
`C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new`

Mandatory reading before changing files:
1. `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\ungoogled_to_echothink_browser_change_plan.md`
2. `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md` if it exists
3. Any existing docs under `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs` directly relevant to this task
4. The local repository files that this task may modify

Global coordination rules:
- Maintain `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md` as the shared source of truth for task progress.
- Before starting, check `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md` and confirm all prerequisites for T33 are marked DONE or explicitly documented as acceptable baseline dependencies.
- If prerequisites are not complete, do not fake completion. Mark this task BLOCKED with the missing prerequisite IDs and the exact files or decisions needed.
- Update or create documentation only under `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs`.
- Record meaningful implementation notes, changed files, validation commands, validation results, and known limitations in `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md`.
- Do not implement backend services, gateway logic, search ranking, chat orchestration, workflow orchestration, or business pages. This task is browser-repository work only.
- Preserve Chromium and Ungoogled Chromium native behavior unless this task explicitly requires a narrow browser-shell change.
- Avoid changes to network stack, TLS validation, sandbox, renderer internals, downloads, history, bookmarks, password manager, cookies, and DevTools unless explicitly required and justified by the task.
- Prefer policy, preferences, extension shell, and narrow browser integration over deep native Chromium rewrites.

- If this task produces a patch, place the Echothink-owned patch under `patches/echothink/` and update `patches/series` only when the patch should be part of the active ordered pipeline.
- Keep the patch small, single-purpose, and ordered after inherited Ungoogled Chromium patches.

Task contents:
- Validate `patches/series` ordering.
- Apply inherited patches plus Echothink patches to pinned Chromium source.
- Run patch validation utilities.
- Record failures by patch ID.
- Confirm Echothink patches remain ordered after inherited patches.

Delivery criteria:
- Patch validation report exists.
- All required Alpha patches apply cleanly.
- Any failures are tied to explicit patch IDs.

Required documentation update:
- Create or update this task note unless a better existing doc already exists:
  `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\echothink-browser-alpha\t33-run-full-patch-validation.md`
- Also update any broader browser Alpha docs affected by the task under `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs`.
- Update `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md` with a row or section for T33.

Validation requirements:
- Run the smallest relevant validation available for this task.
- For discovery/spec tasks, validate by checking source paths and linking decisions to concrete files.
- For patch tasks, validate patch file placement, patch ordering, and whether the patch applies or at least has a documented application command.
- For extension tasks, validate manifest shape, permissions, and local loading/build assumptions.
- For Windows packaging tasks, validate names, assets, channel metadata, and smoke-test steps as far as the local environment allows.

Final response format:
```
TASK T33 STATUS: DONE or BLOCKED

Summary:
- ...

Changed files:
- ...

Docs updated:
- ...

Validation:
- Command/result or reason not runnable

Progress.md update:
- Confirmed updated at `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md`

Remaining risks / follow-up:
- ...
```

```



## W12 — M7 regression and behavior tests


Native regression and Echothink behavior tests both depend on patch validation.


### Prompt for T34: Run native browser regression suite


```text

You are an implementation agent working on Echothink Browser Alpha.

Task: T34 — Run native browser regression suite
Wave: W12
Prerequisites: T33
Delivery target: M7: regression report

Repository root:
`C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new`

Mandatory reading before changing files:
1. `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\ungoogled_to_echothink_browser_change_plan.md`
2. `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md` if it exists
3. Any existing docs under `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs` directly relevant to this task
4. The local repository files that this task may modify

Global coordination rules:
- Maintain `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md` as the shared source of truth for task progress.
- Before starting, check `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md` and confirm all prerequisites for T34 are marked DONE or explicitly documented as acceptable baseline dependencies.
- If prerequisites are not complete, do not fake completion. Mark this task BLOCKED with the missing prerequisite IDs and the exact files or decisions needed.
- Update or create documentation only under `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs`.
- Record meaningful implementation notes, changed files, validation commands, validation results, and known limitations in `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md`.
- Do not implement backend services, gateway logic, search ranking, chat orchestration, workflow orchestration, or business pages. This task is browser-repository work only.
- Preserve Chromium and Ungoogled Chromium native behavior unless this task explicitly requires a narrow browser-shell change.
- Avoid changes to network stack, TLS validation, sandbox, renderer internals, downloads, history, bookmarks, password manager, cookies, and DevTools unless explicitly required and justified by the task.
- Prefer policy, preferences, extension shell, and narrow browser integration over deep native Chromium rewrites.

Task contents:
- Validate native tabs, windows, popups, history, downloads, bookmarks, password
  manager, cookies, local storage, TLS, DevTools, and extension loading.
- Confirm Echothink changes did not replace Chromium primitives.
- Record regressions with severity and owning patch.

Delivery criteria:
- Regression report exists.
- No blocker regressions remain.
- Chromium-native ownership is preserved.

Required documentation update:
- Create or update this task note unless a better existing doc already exists:
  `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\echothink-browser-alpha\t34-run-native-browser-regression-suite.md`
- Also update any broader browser Alpha docs affected by the task under `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs`.
- Update `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md` with a row or section for T34.

Validation requirements:
- Run the smallest relevant validation available for this task.
- For discovery/spec tasks, validate by checking source paths and linking decisions to concrete files.
- For patch tasks, validate patch file placement, patch ordering, and whether the patch applies or at least has a documented application command.
- For extension tasks, validate manifest shape, permissions, and local loading/build assumptions.
- For Windows packaging tasks, validate names, assets, channel metadata, and smoke-test steps as far as the local environment allows.

Final response format:
```
TASK T34 STATUS: DONE or BLOCKED

Summary:
- ...

Changed files:
- ...

Docs updated:
- ...

Validation:
- Command/result or reason not runnable

Progress.md update:
- Confirmed updated at `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md`

Remaining risks / follow-up:
- ...
```

```


### Prompt for T35: Run Echothink behavior tests


```text

You are an implementation agent working on Echothink Browser Alpha.

Task: T35 — Run Echothink behavior tests
Wave: W12
Prerequisites: T33
Delivery target: M7: behavior test report

Repository root:
`C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new`

Mandatory reading before changing files:
1. `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\ungoogled_to_echothink_browser_change_plan.md`
2. `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md` if it exists
3. Any existing docs under `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs` directly relevant to this task
4. The local repository files that this task may modify

Global coordination rules:
- Maintain `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md` as the shared source of truth for task progress.
- Before starting, check `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md` and confirm all prerequisites for T35 are marked DONE or explicitly documented as acceptable baseline dependencies.
- If prerequisites are not complete, do not fake completion. Mark this task BLOCKED with the missing prerequisite IDs and the exact files or decisions needed.
- Update or create documentation only under `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs`.
- Record meaningful implementation notes, changed files, validation commands, validation results, and known limitations in `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md`.
- Do not implement backend services, gateway logic, search ranking, chat orchestration, workflow orchestration, or business pages. This task is browser-repository work only.
- Preserve Chromium and Ungoogled Chromium native behavior unless this task explicitly requires a narrow browser-shell change.
- Avoid changes to network stack, TLS validation, sandbox, renderer internals, downloads, history, bookmarks, password manager, cookies, and DevTools unless explicitly required and justified by the task.
- Prefer policy, preferences, extension shell, and narrow browser integration over deep native Chromium rewrites.

Task contents:
- Verify Echothink branding.
- Verify New Tab route and fallback.
- Verify default search and suggest route.
- Verify Side Panel opens.
- Verify Chat and Workspace Context modes.
- Verify chat scope metadata.
- Verify login gate and allowlist behavior.
- Verify device identity persistence.
- Verify proof helper signs only allowed Echothink URLs.
- Verify optional `echo://` routes if included.

Delivery criteria:
- Behavior test report exists.
- Required Alpha browser behaviors pass.
- Any deferred behavior is explicitly marked non-blocking.

Required documentation update:
- Create or update this task note unless a better existing doc already exists:
  `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\echothink-browser-alpha\t35-run-echothink-behavior-tests.md`
- Also update any broader browser Alpha docs affected by the task under `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs`.
- Update `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md` with a row or section for T35.

Validation requirements:
- Run the smallest relevant validation available for this task.
- For discovery/spec tasks, validate by checking source paths and linking decisions to concrete files.
- For patch tasks, validate patch file placement, patch ordering, and whether the patch applies or at least has a documented application command.
- For extension tasks, validate manifest shape, permissions, and local loading/build assumptions.
- For Windows packaging tasks, validate names, assets, channel metadata, and smoke-test steps as far as the local environment allows.

Final response format:
```
TASK T35 STATUS: DONE or BLOCKED

Summary:
- ...

Changed files:
- ...

Docs updated:
- ...

Validation:
- Command/result or reason not runnable

Progress.md update:
- Confirmed updated at `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md`

Remaining risks / follow-up:
- ...
```

```



## W13 — M7 Windows smoke


Packaging smoke test depends on packaging docs, packaging patch, and behavior tests.


### Prompt for T36: Run Windows packaging smoke test


```text

You are an implementation agent working on Echothink Browser Alpha.

Task: T36 — Run Windows packaging smoke test
Wave: W13
Prerequisites: T31, T32, T35
Delivery target: M7: Windows smoke report

Repository root:
`C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new`

Mandatory reading before changing files:
1. `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\ungoogled_to_echothink_browser_change_plan.md`
2. `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md` if it exists
3. Any existing docs under `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs` directly relevant to this task
4. The local repository files that this task may modify

Global coordination rules:
- Maintain `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md` as the shared source of truth for task progress.
- Before starting, check `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md` and confirm all prerequisites for T36 are marked DONE or explicitly documented as acceptable baseline dependencies.
- If prerequisites are not complete, do not fake completion. Mark this task BLOCKED with the missing prerequisite IDs and the exact files or decisions needed.
- Update or create documentation only under `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs`.
- Record meaningful implementation notes, changed files, validation commands, validation results, and known limitations in `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md`.
- Do not implement backend services, gateway logic, search ranking, chat orchestration, workflow orchestration, or business pages. This task is browser-repository work only.
- Preserve Chromium and Ungoogled Chromium native behavior unless this task explicitly requires a narrow browser-shell change.
- Avoid changes to network stack, TLS validation, sandbox, renderer internals, downloads, history, bookmarks, password manager, cookies, and DevTools unless explicitly required and justified by the task.
- Prefer policy, preferences, extension shell, and narrow browser integration over deep native Chromium rewrites.

- Treat Windows Alpha as the primary target; document any non-Windows behavior as out of scope unless needed for patch safety.

Task contents:
- Install browser on clean Windows machine.
- Launch from Start Menu.
- Verify application name and icon.
- Verify New Tab route.
- Verify Side Panel opens and mode persists after restart.
- Verify default search.
- Verify uninstall path.
- Record install/update-channel/signing observations.

Delivery criteria:
- Windows smoke report exists.
- Install, launch, restart, and uninstall pass.
- New Tab, Side Panel, and search pass after install.
- Blocking packaging issues are resolved or documented.

Required documentation update:
- Create or update this task note unless a better existing doc already exists:
  `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\echothink-browser-alpha\t36-run-windows-packaging-smoke-test.md`
- Also update any broader browser Alpha docs affected by the task under `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs`.
- Update `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md` with a row or section for T36.

Validation requirements:
- Run the smallest relevant validation available for this task.
- For discovery/spec tasks, validate by checking source paths and linking decisions to concrete files.
- For patch tasks, validate patch file placement, patch ordering, and whether the patch applies or at least has a documented application command.
- For extension tasks, validate manifest shape, permissions, and local loading/build assumptions.
- For Windows packaging tasks, validate names, assets, channel metadata, and smoke-test steps as far as the local environment allows.

Final response format:
```
TASK T36 STATUS: DONE or BLOCKED

Summary:
- ...

Changed files:
- ...

Docs updated:
- ...

Validation:
- Command/result or reason not runnable

Progress.md update:
- Confirmed updated at `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md`

Remaining risks / follow-up:
- ...
```

```



## W14 — Alpha candidate


Alpha candidate depends on patch, regression, behavior, and Windows smoke reports.


### Prompt for T37: Produce Windows Alpha candidate


```text

You are an implementation agent working on Echothink Browser Alpha.

Task: T37 — Produce Windows Alpha candidate
Wave: W14
Prerequisites: T33, T34, T35, T36
Delivery target: Alpha: signed/tested candidate

Repository root:
`C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new`

Mandatory reading before changing files:
1. `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\ungoogled_to_echothink_browser_change_plan.md`
2. `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md` if it exists
3. Any existing docs under `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs` directly relevant to this task
4. The local repository files that this task may modify

Global coordination rules:
- Maintain `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md` as the shared source of truth for task progress.
- Before starting, check `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md` and confirm all prerequisites for T37 are marked DONE or explicitly documented as acceptable baseline dependencies.
- If prerequisites are not complete, do not fake completion. Mark this task BLOCKED with the missing prerequisite IDs and the exact files or decisions needed.
- Update or create documentation only under `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs`.
- Record meaningful implementation notes, changed files, validation commands, validation results, and known limitations in `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md`.
- Do not implement backend services, gateway logic, search ranking, chat orchestration, workflow orchestration, or business pages. This task is browser-repository work only.
- Preserve Chromium and Ungoogled Chromium native behavior unless this task explicitly requires a narrow browser-shell change.
- Avoid changes to network stack, TLS validation, sandbox, renderer internals, downloads, history, bookmarks, password manager, cookies, and DevTools unless explicitly required and justified by the task.
- Prefer policy, preferences, extension shell, and narrow browser integration over deep native Chromium rewrites.

- Treat Windows Alpha as the primary target; document any non-Windows behavior as out of scope unless needed for patch safety.

Task contents:
- Package the validated Windows Alpha candidate.
- Attach patch validation, regression, behavior, and smoke reports.
- Record exact Chromium pin, repo revision, patch list, channel, and build
  timestamp.
- Mark known limitations and deferred work.

Delivery criteria:
- Windows Echothink Browser Alpha candidate exists.
- Candidate is traceable to source revision and patch list.
- Validation reports are attached.
- No blocker browser-side acceptance criteria remain open.

Required documentation update:
- Create or update this task note unless a better existing doc already exists:
  `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\echothink-browser-alpha\t37-produce-windows-alpha-candidate.md`
- Also update any broader browser Alpha docs affected by the task under `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs`.
- Update `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md` with a row or section for T37.

Validation requirements:
- Run the smallest relevant validation available for this task.
- For discovery/spec tasks, validate by checking source paths and linking decisions to concrete files.
- For patch tasks, validate patch file placement, patch ordering, and whether the patch applies or at least has a documented application command.
- For extension tasks, validate manifest shape, permissions, and local loading/build assumptions.
- For Windows packaging tasks, validate names, assets, channel metadata, and smoke-test steps as far as the local environment allows.

Final response format:
```
TASK T37 STATUS: DONE or BLOCKED

Summary:
- ...

Changed files:
- ...

Docs updated:
- ...

Validation:
- Command/result or reason not runnable

Progress.md update:
- Confirmed updated at `C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new\docs\progress.md`

Remaining risks / follow-up:
- ...
```

```



# Quick Assignment Index


| Wave | Task | Prompt Purpose | Prerequisites | Delivery Target |
|---|---|---|---|---|

| W0 | T00 | Baseline repo audit | None | M0: baseline audit note |

| W1 | T01 | Define Echothink patch discipline | T00 | M0: patch convention doc |

| W2 | T02 | Define Echothink repo structure | T01 | M0: repo skeleton plan |

| W1 | T03 | Validate inherited patch pipeline | T00 | M0: validation result |

| W1 | T04 | Define product branding inventory | T00 | M1: branding inventory |

| W2 | T05 | Implement branding patch | T01, T04 | M1: `0001-branding.patch` |

| W2 | T06 | Add Echothink visual assets | T04 | M1: asset bundle |

| W1 | T07 | Define default policy/preference set | T00 | M1: defaults spec |

| W2 | T08 | Implement default policies/preferences patch | T01, T07 | M1: `0002-default-policies-and-preferences.patch` |

| W1 | T09 | Confirm New Tab insertion point | T00 | M2: New Tab hook decision |

| W3 | T10 | Implement New Tab route and fallback | T08, T09 | M2: `0003-new-tab-and-first-run.patch` |

| W4 | T11 | Add first-run shell | T10 | M2: first-run gate shell |

| W3 | T12 | Scaffold bundled workspace extension | T02 | M3: extension skeleton |

| W4 | T13 | Add bundled extension install patch | T12 | M3: `0004-bundled-workspace-extension.patch` |

| W5 | T14 | Implement Side Panel container | T13 | M3: Side Panel opens |

| W6 | T15 | Implement Side Panel mode selector | T14 | M3: switchable panel modes |

| W7 | T16 | Implement Chat Panel shell | T15 | M3: chat mode with scope metadata |

| W7 | T17 | Implement Workspace Context shell | T15 | M3: workspace context mode |

| W8 | T18 | Add Side Panel local states | T16, T17 | M3: resilient Side Panel UX |

| W2 | T19 | Implement default search provider | T08 | M1/M3: `0005-default-search-provider.patch` |

| W4 | T20 | Define login gate local state and allowlist | T10, T11 | M4: login gate spec |

| W5 | T21 | Implement login-required startup gate | T20 | M4: `0006-login-gate.patch` |

| W5 | T22 | Define device identity and DPAPI storage | T00, T20 | M5: device identity design |

| W6 | T23 | Implement device key generation and storage | T22 | M5: `0007-device-identity.patch` |

| W7 | T24 | Implement narrow extension bridge | T13, T23 | M5: device bridge API |

| W8 | T25 | Define request proof payload and allowlist | T24 | M5: proof helper spec |

| W9 | T26 | Implement proof signing helper | T25 | M5: `0008-request-proof-helper.patch` |

| W10 | T27 | Integrate proof helper into extension calls | T16, T24, T26 | M5: proof-capable extension |

| W5 | T28 | Implement optional `echo://` resolver | T10 | M6: `0009-echo-protocol-router.patch` |

| W6 | T29 | Add invalid `echo://` fallback page | T28 | M6: safe route failure |

| W3 | T30 | Define Windows app identity and channels | T05, T06 | M7: Windows packaging spec |

| W4 | T31 | Implement Windows packaging identity patch | T30 | M7: `0010-windows-packaging-identity.patch` |

| W5 | T32 | Add Windows build/signing/smoke docs | T30, T31 | M7: Windows Alpha release docs |

| W11 | T33 | Run full patch validation | T05, T08, T10, T13, T19, T21, T23, T26, T31 | M7: patch validation report |

| W12 | T34 | Run native browser regression suite | T33 | M7: regression report |

| W12 | T35 | Run Echothink behavior tests | T33 | M7: behavior test report |

| W13 | T36 | Run Windows packaging smoke test | T31, T32, T35 | M7: Windows smoke report |

| W14 | T37 | Produce Windows Alpha candidate | T33, T34, T35, T36 | Alpha: signed/tested candidate |
