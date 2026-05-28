# T03 Validate Inherited Patch Pipeline

Date: 2026-05-28
Wave: W1
Delivery target: M0 validation result
Status: DONE with baseline inherited-tooling failures documented

## Prerequisite Check

T03 depends on T00. `docs/progress.md` marks T00 as `DONE` and records the
repository-root mismatch as an acceptable baseline dependency for follow-on
validation work.

The requested repository root remains:

```text
C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new
```

That path still contains documentation only. The inherited Ungoogled Chromium
patch/config tree validated for this task is one directory up:

```text
C:\Users\caoya\source\repos\echothink-studio
```

No Echothink patch work was started. No browser source, patch, build, network,
TLS, sandbox, renderer, downloads, history, bookmarks, password manager,
cookies, or DevTools behavior was changed.

## Validation Summary

The inherited `patches/series` baseline is structurally valid before any
Echothink patch additions:

- Active series entries: 108
- Missing patch files: 0
- Duplicate series entries: 0
- Active `echothink/*` entries: 0
- Current final inherited entry:
  `extra/ungoogled-chromium/add-flag-for-disabling-jit.patch`

Patch readability and duplicate checks passed when run directly through the
existing `devutils.check_patch_files` helpers. The broader inherited validation
commands expose baseline Windows/tooling issues, listed separately below.

## Commands And Results

Commands were run from:

```text
C:\Users\caoya\source\repos\echothink-studio
```

unless otherwise noted.

| Command | Result |
|---|---|
| `python devutils\validate_config.py` | Failed as a baseline Windows tooling issue. `check_unused_patches()` reports all patch files as unused because it compares Windows backslash paths from `Path.relative_to()` against slash-delimited `patches/series` entries. |
| Direct PowerShell validation of `patches\series` entries | Passed: `entries=108`, `missing=0`, `duplicates=0`, `echothink_entries=0`. |
| Direct imported `check_patch_readability()` and `check_series_duplicates()` | Passed: `readability_warnings=False`, `duplicate_warnings=False`. |
| `python devutils\check_patch_files.py` | Failed with the same baseline Windows path separator issue as `validate_config.py`; all patches are reported unused using backslash paths. |
| `python devutils\check_downloads_ini.py -d downloads.ini` | Passed. |
| `python devutils\check_gn_flags.py` | Passed. |
| `python -m pytest -c pytest.ini` from `utils\` | Failed before running tests because the local environment does not have the `pytest-cov` plugin required by `utils\pytest.ini` addopts. |
| `python -m pytest -c pytest.ini -o addopts=''` from `utils\` | Ran without coverage addopts: 3 passed, 1 failed. The failure is `tests/test_patches.py::test_find_and_check_patch`, which expects `/bin/false` to exist and is therefore POSIX-specific on Windows. |
| `python -m pytest -c pytest.ini` from `devutils\` | Failed before running tests because the local environment does not have the `pytest-cov` plugin required by `devutils\pytest.ini` addopts. |
| `python -m pytest -c pytest.ini -o addopts=''` from `devutils\` | Passed: 2 tests passed. |
| `where.exe patch` | Found GNU patch at `C:\Users\caoya\anaconda3\Library\usr\bin\patch.exe`. |
| `python -c "import importlib.util; ..."` | Confirmed `requests=True`, so remote patch validation dependencies are available. |
| `python devutils\validate_patches.py --remote` | Failed before patch application while parsing Chromium `DEPS`; it attempted to download 639 remote files, then raised `TypeError: 'NoneType' object is not subscriptable`. |
| `python devutils\validate_patches.py --remote -v` | Confirmed the failure occurs while parsing `https://chromium.googlesource.com/chromium/src.git/+/148.0.7778.178/DEPS?format=TEXT`; Chromium `DEPS` line 218 uses `Str('')`, while the inherited parser does not define or allow `Str`. |

## Baseline Issues

These failures are inherited baseline issues and are not caused by Echothink
work:

1. `devutils\check_patch_files.py` and `devutils\validate_config.py` are not
   clean on Windows because unused-patch detection does not normalize
   slash-delimited `patches/series` entries and Windows `Path` output.
2. The local Python environment is missing `pytest-cov`, so the default
   `utils` and `devutils` pytest configs fail before test execution.
3. `utils\tests\test_patches.py::test_find_and_check_patch` assumes
   `/bin/false` exists, so the suite is not fully Windows-portable even when
   coverage addopts are disabled.
4. `devutils\validate_patches.py --remote` is not compatible with the pinned
   Chromium `148.0.7778.178` `DEPS` syntax because the parser lacks support for
   `Str(...)`. No patch application result was produced by the remote validator.

## Patch Application Status

No local pristine Chromium source tree was available for a `--local` patch
application validation. The documented application validation commands are:

```text
python devutils\validate_patches.py --remote
python devutils\validate_patches.py --local <path-to-unmodified-chromium-src>
```

The `--remote` command was attempted and blocked by the baseline `DEPS` parser
issue above. A future inherited-tooling task should either add support for
Chromium `DEPS` `Str(...)` values or run validation against a known-clean local
Chromium source checkout.

## Outcome

T03 establishes the inherited patch pipeline health before Echothink patch
additions:

- `patches/series` paths, ordering, duplicates, and current absence of
  Echothink entries are known.
- Patch readability is clean.
- Existing Python test and patch-application failures are documented as
  baseline issues.
- No Echothink patch work should begin until follow-on tasks explicitly accept
  these baseline issues or repair the inherited tooling.
