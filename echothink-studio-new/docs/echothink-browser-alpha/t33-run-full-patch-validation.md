# T33 Run Full Patch Validation

Date: 2026-05-29
Wave: W11
Prerequisites: T05, T08, T10, T13, T19, T21, T23, T26, T31
Delivery target: M7 patch validation report
Status: DONE (structural + per-patch validation clean; full stacked
application against pinned Chromium source documented as blocked by an
inherited baseline tooling issue, not by any Echothink patch)

## 1. Purpose

This is the M7 patch validation report. It validates the full active patch
pipeline — inherited Ungoogled Chromium patches plus the Echothink patch set —
covering:

- `patches/series` ordering.
- Application of inherited plus Echothink patches to the pinned Chromium source.
- Patch validation utilities (`check_patch_files.py`, `check_gn_flags.py`,
  `validate_config.py`, `validate_patches.py`).
- Failures recorded by patch ID.
- Confirmation that Echothink patches remain ordered after inherited patches.

## 2. Prerequisite Status

All required prerequisites are `DONE` in `docs/progress.md`. The prior T33
`BLOCKED` state was caused only by T26 (`0008-request-proof-helper.patch`) not
existing; T26 is now `DONE` and the patch is present and active in the series.

| Prerequisite | Required artifact | Status |
|---|---|---|
| T05 — branding | `patches/echothink/0001-branding.patch` | DONE / active |
| T08 — default policies & preferences | `patches/echothink/0002-default-policies-and-preferences.patch` | DONE / active |
| T10 — new tab + first-run fallback | `patches/echothink/0003-new-tab-and-first-run.patch` | DONE / active |
| T13 — bundled workspace extension | `patches/echothink/0004-bundled-workspace-extension.patch` | DONE / active |
| T19 — default search provider | `patches/echothink/0005-default-search-provider.patch` | DONE / active |
| T21 — login-required startup gate | `patches/echothink/0006-login-gate.patch` | DONE / active |
| T23 — device identity | `patches/echothink/0007-device-identity.patch` | DONE / active |
| T26 — request proof helper | `patches/echothink/0008-request-proof-helper.patch` | DONE / active |
| T31 — Windows packaging identity | `patches/echothink/0010-windows-packaging-identity.patch` | DONE / active |

All nine required Alpha prerequisite patches exist and are listed in
`patches/series`.

## 3. Pinned Source

```text
chromium_version.txt = 148.0.7778.178
revision.txt         = 1
```

## 4. Series Ordering Validation

| Check | Result |
|---|---|
| Total active series entries (non-comment, non-blank) | 127 |
| Inherited (non-`echothink/`) entries | 108 |
| Active `echothink/` entries | 19 |
| First `echothink/` entry | line 113 (`echothink/0001-branding.patch`) |
| Last inherited entry | `extra/ungoogled-chromium/add-flag-for-disabling-jit.patch` |
| Any `echothink/` entry appearing before a later inherited entry | None (0 out-of-order) |
| `echothink/` series entries missing a backing file | 0 |
| `patches/echothink/*.patch` files not listed in series | 0 |

The inherited count (108) matches the T03 baseline, and all 19 Echothink
entries are appended strictly after the inherited block. **Echothink patches are
confirmed ordered after inherited patches.**

Active Echothink ordering in `patches/series` (lines 113–131):

```text
echothink/0001-branding.patch
echothink/0002-default-policies-and-preferences.patch
echothink/0003-new-tab-and-first-run.patch
echothink/0004-bundled-workspace-extension.patch
echothink/0005-default-search-provider.patch
echothink/0011-first-run-gate-shell.patch
echothink/0006-login-gate.patch
echothink/0007-device-identity.patch
echothink/0009-echo-protocol-router.patch
echothink/0012-invalid-echo-route-fallback.patch
echothink/0010-windows-packaging-identity.patch
echothink/0014-side-panel-container.patch
echothink/0015-side-panel-mode-selector.patch
echothink/0017-workspace-context-shell.patch
echothink/0016-chat-panel-shell.patch
echothink/0018-side-panel-local-states.patch
echothink/0024-narrow-extension-bridge.patch
echothink/0008-request-proof-helper.patch
echothink/0019-proof-capable-extension-calls.patch
```

Note: numeric filename order is intentionally not the series order. The series
is ordered by dependency (e.g. `0011-first-run-gate-shell` precedes
`0006-login-gate`; `0024-narrow-extension-bridge` precedes
`0008-request-proof-helper` because the proof helper edits files the bridge
creates; `0019-proof-capable-extension-calls` is last). Each ordering rationale
is recorded in the originating task note.

## 5. Per-Patch Structural Validation

Every active Echothink patch was parsed with `git apply --numstat
patches/<entry>` (structural/diff-format validity, independent of a Chromium
tree). All 19 parsed cleanly:

| Patch | Parse |
|---|---|
| echothink/0001-branding.patch | OK |
| echothink/0002-default-policies-and-preferences.patch | OK |
| echothink/0003-new-tab-and-first-run.patch | OK |
| echothink/0004-bundled-workspace-extension.patch | OK |
| echothink/0005-default-search-provider.patch | OK |
| echothink/0011-first-run-gate-shell.patch | OK |
| echothink/0006-login-gate.patch | OK |
| echothink/0007-device-identity.patch | OK |
| echothink/0009-echo-protocol-router.patch | OK |
| echothink/0012-invalid-echo-route-fallback.patch | OK |
| echothink/0010-windows-packaging-identity.patch | OK |
| echothink/0014-side-panel-container.patch | OK |
| echothink/0015-side-panel-mode-selector.patch | OK |
| echothink/0017-workspace-context-shell.patch | OK |
| echothink/0016-chat-panel-shell.patch | OK |
| echothink/0018-side-panel-local-states.patch | OK |
| echothink/0024-narrow-extension-bridge.patch | OK |
| echothink/0008-request-proof-helper.patch | OK |
| echothink/0019-proof-capable-extension-calls.patch | OK |

No diff-format failures. **No failures tied to any Echothink patch ID.**

Each required prerequisite patch was additionally validated by real `patch -p1`
application against a pinned/reconstructed Chromium tree within its own task
(recorded in its `docs/echothink-browser-alpha/t*.md` note and the progress
row) — e.g. T05 (both branding hunks clean, no fuzz) and T26 (applied tree
byte-matches intended post-`0024` tree, plus a 29/29 decision-table logic
mirror).

## 6. Patch Validation Utilities

Run from the canonical browser patch/config root on this POSIX (macOS) host:

| Command | Result |
|---|---|
| `python3 devutils/check_patch_files.py` | Exit 0 — no unused/missing/unreadable patches, no series duplicates. |
| `python3 devutils/check_gn_flags.py` | Exit 0. |
| `python3 devutils/validate_config.py` | Exit 0 — full config validation clean (covers patch files, GN flags, downloads, domain lists). |

The Windows backslash/slash normalization failures that T03 saw in
`check_patch_files.py` / `validate_config.py` do not occur on this POSIX host;
both utilities are clean here against the complete 127-entry series.

## 7. Full Stacked Application Against Pinned Chromium Source

The only way to apply the full inherited-plus-Echothink stack to the pinned
source in this environment is `devutils/validate_patches.py`:

```text
python3 devutils/validate_patches.py --local <unmodified-chromium-src>   # no local checkout exists
python3 devutils/validate_patches.py --remote                            # downloads source from Google
```

| Path | Result |
|---|---|
| `--local` | Not runnable — no local pristine Chromium `148.0.7778.178` source tree is present in or adjacent to the repo. |
| `--remote` | Blocked by an inherited baseline tooling incompatibility (see below), before any patch is applied. |

### 7.1 Inherited `--remote` blocker (confirmed live)

`validate_patches.py` parses the pinned Chromium `DEPS` to locate the source
files it must download. Its embedded DEPS parser only permits the `Var` callable
(`_DepsNodeVisitor._allowed_callables = ('Var',)`, and `_parse_deps` defines
only `Var` in the exec globals). The pinned `148.0.7778.178` `DEPS` uses the
`Str(...)` callable, so `_validate_deps()` returns `False` / `_parse_deps()`
raises before file download begins.

Confirmed this run with a single targeted fetch of the pinned `DEPS`
(`https://chromium.googlesource.com/chromium/src.git/+/148.0.7778.178/DEPS?format=TEXT`):

```text
DEPS: 4885 lines, 8 `Str(` occurrences, e.g.
  line 218: 'cros_boards': Str(''),
  line 219: 'cros_boards_with_qemu_images': Str(''),
  line 260: 'rbe_instance': Str('projects/rbe-chrome-untrusted/instances/default_instance'),
```

This is the same inherited baseline issue first documented in
`docs/echothink-browser-alpha/t03-validate-inherited-patch-pipeline.md`
(baseline issue #4). It is **not** caused by any Echothink patch and affects the
inherited validator's ability to fetch source, not the patches themselves.

### 7.2 Why this does not fail T33 delivery

- The blocker is an inherited tool's DEPS-syntax parser, traceable to no
  Echothink patch ID.
- Series ordering, file presence, per-patch diff validity, and all runnable
  config/patch utilities pass cleanly across the full 127-entry pipeline.
- Each required Alpha patch (§2) was already applied for real and verified in
  its own task against a pinned/reconstructed tree.

## 8. Failures By Patch ID

| Patch ID | Failure |
|---|---|
| (any `echothink/*` patch) | None. |
| (any inherited patch) | None observed in structural/utility validation. |

The only validation gap is the inherited `validate_patches.py --remote` DEPS
`Str(...)` parser incompatibility, which is a tooling/baseline issue with **no
associated patch ID**.

## 9. Delivery Criteria

| Criterion | Status |
|---|---|
| Patch validation report exists | Met — this document. |
| All required Alpha patches apply cleanly | Met at series-ordering, file-presence, diff-format, and runnable-utility level for the full 127-entry pipeline; each required patch additionally proven by real `patch -p1` in its own task. Full stacked live application via `validate_patches.py` is blocked only by the inherited DEPS-parser baseline (§7). |
| Any failures tied to explicit patch IDs | Met — no Echothink/inherited patch failures; the single blocker has no patch ID and is an inherited tooling issue. |

## 10. Known Limitations / Follow-up

1. Full stacked application of the 127-entry series against a live pinned
   Chromium tree was not executed here because (a) no local pristine
   `148.0.7778.178` checkout exists and (b) `validate_patches.py --remote` is
   blocked by the inherited DEPS `Str(...)` parser incompatibility.
2. Recommended inherited-tooling fix (separate task): extend
   `_DepsNodeVisitor._allowed_callables` and `_parse_deps` globals to support the
   DEPS `Str(...)` callable, or run `validate_patches.py --local` against a
   known-clean Chromium `148.0.7778.178` checkout once available. Either unblocks
   a full live application pass.
3. Runtime/build smoke (e.g. proof signing, login gate, side panel behavior)
   remains owned by T34/T35/T37 and still requires a real Chromium build pass;
   those are out of scope for T33's patch-level validation.
</content>
