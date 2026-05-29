# Echothink Browser Alpha Progress

Last updated: 2026-05-29 (T36 blocked)

This file is the shared source of truth for browser Alpha task status. Task
notes should record changed files, validation commands, validation results, and
known limitations here.

## Task Status

| ID | Wave | Task | Prerequisites | Status | Notes |
|---|---|---|---|---|---|
| T00 | W0 | Baseline repo audit | None | DONE | Audit note created at `docs/echothink-browser-alpha/t00-baseline-repo-audit.md`. No repo behavior changed. Critical baseline gap: requested root `echothink-studio-new` contains only `docs/`; inherited Ungoogled Chromium patch/config files are present one directory up at `C:\Users\caoya\source\repos\echothink-studio`. Follow-on implementation tasks must resolve or explicitly accept the canonical root mismatch before patch/build work. |
| T01 | W1 | Define Echothink patch discipline | T00 | DONE | Patch convention doc created at `docs/echothink-browser-alpha/t01-define-echothink-patch-discipline.md`. T00 is DONE and the canonical-root mismatch is carried forward as an acceptable baseline dependency for this docs-only task. No patch was produced; `patches/series` was not changed. |
| T02 | W2 | Define Echothink repo structure | T01 | DONE | Repo skeleton plan created at `docs/echothink-browser-alpha/t02-define-echothink-repo-structure.md`. T01 is DONE; the canonical-root mismatch is carried forward as an acceptable baseline dependency for this docs-only task. Defines owner/purpose/expected-contents/creation-trigger for `patches/echothink/`, `extensions/echothink-workspace/`, `assets/`, `build/windows/`, and the docs surface; specifies when `patches/series` entries may be added and how placeholders/generated artifacts are treated. No directory created, no patch produced, `patches/series` unchanged (108 inherited entries, 0 echothink). |
| T03 | W1 | Validate inherited patch pipeline | T00 | DONE | Validation note created at `docs/echothink-browser-alpha/t03-validate-inherited-patch-pipeline.md`. T00 is DONE and the canonical-root mismatch is carried forward as an acceptable baseline dependency for validating the inherited tree one directory up. `patches/series` has 108 entries, 0 missing files, 0 duplicates, and 0 Echothink entries. Existing Windows/tooling failures are documented as baseline issues. No Echothink patch work started. |
| T04 | W1 | Define product branding inventory | T00 | DONE | Branding inventory created at `docs/echothink-browser-alpha/t04-define-product-branding-inventory.md`. T00 is DONE and the canonical-root mismatch is carried forward as an acceptable baseline dependency for this docs-only task. User-visible name is `Echothink Browser`; Windows Start Menu name is `Echothink Browser`; installer name stem is `EchothinkBrowserSetup`; About/first-run copy, icon asset requirements, and Chromium/Ungoogled Chromium attribution requirements are documented. No patch or asset work started. |
| T05 | W2 | Implement branding patch | T01, T04 | DONE | Task note at `docs/echothink-browser-alpha/t05-implement-branding-patch.md`. Prerequisites T01 and T04 are DONE. Created `patches/echothink/0001-branding.patch` (the first Echothink-owned patch) and appended `echothink/0001-branding.patch` to the tail of `patches/series` after all inherited patches. Patch updates `IDS_PRODUCT_NAME`/`IDS_SHORT_PRODUCT_NAME` in `chrome/app/chromium_strings.grd` and the first-run `<title>`/`<h2>` in `chrome/browser/ui/webui/ungoogled_first_run.h` to `Echothink Browser`; upstream credits/licenses and the first-run attribution sentence are preserved; `BRANDING`/executable/installer identity deferred to T30/T31. Validated by real `patch -p1` against the pinned Chromium `148.0.7778.178` source (both hunks applied cleanly, no fuzz) and `devutils/check_patch_files.py` passing. |
| T06 | W2 | Add Echothink visual assets | T04 | DONE | Asset bundle created at the inherited canonical build root `assets/` (icons/, installer/, about/, tools/), with task note at `docs/echothink-browser-alpha/t06-add-echothink-visual-assets.md`. T04 is DONE; the canonical-root mismatch is carried forward — as the first artifact-producing task, assets live at the build root the packaging/branding patches consume, not under docs-only `echothink-studio-new`. Delivered original Echothink artwork: master SVG, PNG app icons (16/20/24/32/40/48/64/128/256), multi-resolution `echothink.ico` and `echothink-setup.ico`, and About/first-run logos (64/128/256). All required Windows Alpha sizes verified present. Installer banner/dialog bitmaps deferred to T30/T32. Wiring into Chromium/installer owned by T05/T30/T32. |
| T07 | W1 | Define default policy/preference set | T00 | DONE | Defaults spec created at `docs/echothink-browser-alpha/t07-define-default-policy-preference-set.md`. T00 is DONE and the canonical-root mismatch is carried forward as an acceptable baseline dependency for this docs-only task. Homepage, New Tab, search URL, suggest URL, default bookmarks, preferred policy/preference surfaces, and enterprise-safe defaults are documented. No patch or backend work started. |
| T09 | W1 | Confirm New Tab insertion point | T00 | DONE | Hook decision created at `docs/echothink-browser-alpha/t09-confirm-new-tab-insertion-point.md`. T00 is DONE and the canonical-root mismatch is carried forward as an acceptable baseline dependency for this docs-only task. Selected hook: `HandleNewTabPageLocationOverride()` via the normal-profile New Tab override preference. Avoid a global `--custom-ntp` default for Alpha because the inherited switch can affect incognito external New Tabs. No patch work started. |
| T08 | W2 | Implement default policies/preferences patch | T01, T07 | DONE | First Echothink defaults patch created: `patches/echothink/0002-default-policies-and-preferences.patch`, appended to `patches/series` after inherited patches. Seeds normal-profile New Tab route (inherited custom-ntp hook empty-branch) and homepage/startup/default-bookmarks via Chromium initial preferences (new files `chrome/browser/resources/echothink/initial_preferences.json` and `echothink_bookmarks.html`). Default search provider and suggest URL were split to T19's `patches/echothink/0005-default-search-provider.patch`. All defaults are override-safe; no locked policy; native bookmark/history/download/password/cookie/DevTools behavior untouched. Validated: `validate_config.py`, `check_patch_files.py`, `check_gn_flags.py` exit 0 clean; `git apply --numstat` parses cleanly; series has 0 missing files. Patch application against Chromium source deferred to build pipeline (no local checkout, per T03). Task note: `docs/echothink-browser-alpha/t08-implement-default-policies-preferences-patch.md`. |
| T10 | W3 | Implement New Tab route and fallback | T08, T09 | DONE | Created `patches/echothink/0003-new-tab-and-first-run.patch` and inserted it into `patches/series` between `echothink/0002` and `echothink/0005`. The authenticated New Tab route to `https://app.echothink.ai/newtab` already comes from T08's `0002` (inherited `HandleNewTabPageLocationOverride()` hook) and is NOT re-edited, so the patches never collide. T10 adds the local fallback/first-run page `chrome://echothink-first-run` (new file `chrome/browser/ui/webui/echothink_first_run.h`, reusing the inherited `first-run-page.patch` URLDataSource pattern), registers it in `chrome_web_ui_configs.cc`, adds the `echothink-first-run` host in `webui_url_constants.cc`, and opens it as the first first-run tab in `chrome_browser_main.cc` (additive, before the inherited ungoogled-first-run tab). The page is static, script-free, renders fully offline, and links ONLY to login, device enrollment, diagnostics (`chrome://echothink-diagnostics`), update, and support/download — no workspace/business data. No network/TLS/sandbox/renderer/downloads/history/bookmarks/password/cookie/DevTools changes; incognito New Tab behavior untouched. Validated: `check_patch_files.py`, `check_gn_flags.py`, `validate_config.py` exit 0; `git apply --numstat` parses cleanly (4 files). Real `patch -p1` application and runtime smoke deferred to build pipeline (no local Chromium checkout, per T03). Task note: `docs/echothink-browser-alpha/t10-implement-new-tab-route-and-fallback.md`. |
| T19 | W2 | Implement default search provider | T08 | DONE | Created `patches/echothink/0005-default-search-provider.patch` and appended it to the Echothink tail block after `echothink/0002-default-policies-and-preferences.patch`. The patch re-points the inherited "No Search" prepopulated engine slot to Echothink Search and adds `default_search_provider` values to the T08 initial-preferences file: search URL `https://search.echothink.ai/search?q={searchTerms}` and suggest URL `https://search.echothink.ai/suggest?q={searchTerms}`. Search suggestions remain disabled by default over the inherited baseline and use the Echothink suggest route only when enabled. No omnibox internals, direct URL navigation, network stack, TLS, sandbox, renderer, downloads, history, bookmarks, password manager, cookies, or DevTools behavior changed. Task note: `docs/echothink-browser-alpha/t19-implement-default-search-provider.md`. |
| T12 | W3 | Scaffold bundled Manifest V3 workspace extension | T02 | DONE | Created source-only extension scaffold at `extensions/echothink-workspace/` in the canonical browser root: MV3 `manifest.json`, background service worker, Side Panel HTML/CSS/JS, narrow content bridge, and extension-local asset. T02 is DONE; the canonical-root mismatch is carried forward and recorded in the task note. Manifest declares only `sidePanel`, `storage`, `tabs`, `activeTab`, and `scripting`; host permissions are limited to `app.echothink.ai`, `auth.echothink.ai`, `api.echothink.ai`, and `search.echothink.ai`. No backend/business logic was added. T13 has since added the fixed public key and bundled install patch. Task note: `docs/echothink-browser-alpha/t12-scaffold-bundled-workspace-extension.md`. |
| T13 | W4 | Add bundled extension install patch | T12 | DONE | Created `patches/echothink/0004-bundled-workspace-extension.patch` and inserted it into `patches/series` between `echothink/0003-new-tab-and-first-run.patch` and `echothink/0005-default-search-provider.patch`. T12 is DONE. The patch bundles the workspace shell as a Chromium component extension, allowlists only fixed extension ID `lokdibgfmiemhdoogailbfpdggndpolk`, registers it in `ComponentLoader::AddDefaultComponentExtensionsWithBackgroundPages()`, and adds resources under `chrome/browser/resources/echothink_workspace/`. Source manifest now carries the same public key, no `update_url`, exact permissions `sidePanel`, `storage`, `tabs`, `activeTab`, `scripting`, and only Echothink-owned host permissions. No extension permission model weakening or Web Store replacement path was added. Task note: `docs/echothink-browser-alpha/t13-add-bundled-extension-install-patch.md`. |
| T14 | W5 | Implement Side Panel container | T13 | DONE | Added `patches/echothink/0014-side-panel-container.patch` and appended it to `patches/series` after the active Echothink tail. T13 is DONE. The extension action remains the browser UI entry point: `background.js` now configures `openPanelOnActionClick` on install/startup/service-worker load, enables the local `sidepanel.html` shell for tabs, and calls `chrome.sidePanel.open()` from the action click user gesture as a runtime fallback. No new permissions, host permissions, privileged bridges, backend calls, or business logic were added. Runtime click smoke is deferred because no local Chromium source/build exists. Task note: `docs/echothink-browser-alpha/t14-implement-side-panel-container.md`. |
| T15 | W6 | Implement Side Panel mode selector | T14 | DONE | Added `patches/echothink/0015-side-panel-mode-selector.patch` and appended it to `patches/series` after `echothink/0014-side-panel-container.patch`. T14 is DONE. The Side Panel source shell now exposes exactly two Alpha modes, `chat` and `workspace_context`, with a visible top-level selector labelled Chat and Workspace Context. `sidepanel.js` persists selected mode under `echothink.sidePanel.mode` in profile-local `chrome.storage.local`, restores it on panel load, falls back to `chat` for missing/unsupported values, and switches modes without browser restart. No new permissions, host permissions, privileged bridges, backend calls, sync storage, or business logic were added. Runtime restart persistence smoke is deferred because no local Chromium source/build exists. Task note: `docs/echothink-browser-alpha/t15-implement-side-panel-mode-selector.md`. |
| T16 | W7 | Implement Chat Panel shell | T15 | DONE | Added `patches/echothink/0016-chat-panel-shell.patch` and appended it to `patches/series` after the already-merged `echothink/0017-workspace-context-shell.patch` on current `master`. T15 is DONE. Chat mode now renders an in-memory transcript, composer, status region, and visible Alpha scope selector (`current_page`, `project`, `app_domain`, `task_wave`, `artifacts`, `organization`). `sidepanel.js` posts to `https://api.echothink.ai/v1/chat/stream` with `credentials: "include"`, `stream: true`, and selected `scope.scope_type` metadata; `current_page` adds a sanitized `http`/`https` `page_url` when available. Streaming display handles SSE, NDJSON, and plain-text streams with JSON/text fallback. No manifest permission changes, token/private-key UI exposure, conversation persistence, model orchestration, request-proof signing, or backend business logic was added. Runtime chat smoke is deferred because no local Chromium build or real chat service exists here. Task note: `docs/echothink-browser-alpha/t16-implement-chat-panel-shell.md`. |
| T17 | W7 | Implement Workspace Context shell | T15 | DONE | Added `patches/echothink/0017-workspace-context-shell.patch` and appended it to `patches/series` after `echothink/0015-side-panel-mode-selector.patch`. T15 is DONE. Workspace Context mode now renders containers for current project context, App Domain context, Task Wave status, agent console entry, pending approvals, recent artifacts, project navigation, notifications, and quick actions. `sidepanel.js` can render an already available structured snapshot from `chrome.storage.local` or an internal extension message using text-only DOM writes and Echothink-owned HTTPS links only. No new permissions, host permissions, backend fetches, workflow execution, approval/project/task business logic, privileged bridges, token/private-key exposure, or protected Chromium behavior changes were added. Runtime Side Panel smoke is deferred because no local Chromium source/build exists. Task note: `docs/echothink-browser-alpha/t17-implement-workspace-context-shell.md`. |
| T18 | W8 | Add Side Panel local states | T16, T17 | DONE | Added `patches/echothink/0018-side-panel-local-states.patch` and appended it to `patches/series` after T16/T17. Prerequisites T16 and T17 are DONE. The bundled Side Panel now has local states for `signed_out`, `no_device_identity`, `unauthorized_scope`, `offline`, and `remote_service_error`; stores state under `echothink.sidePanel.localState`; accepts a narrow first-party `side_panel_state` bridge update from `app.echothink.ai`/`auth.echothink.ai`; and hides/resets protected Chat and Workspace Context content for signed-out, missing-device, and unauthorized-scope states. No manifest permission or host-permission changes, backend logic, native bridge, token/private-key handling, request-proof handling, network/TLS/sandbox/renderer/downloads/history/bookmarks/password/cookie/DevTools changes were added. Runtime Side Panel smoke is deferred because no local Chromium source/build exists. Task note: `docs/echothink-browser-alpha/t18-add-side-panel-local-states.md`. |
| T11 | W4 | Add first-run shell | T10 | DONE | Created `patches/echothink/0011-first-run-gate-shell.patch` and appended `echothink/0011-first-run-gate-shell.patch` to the Echothink series tail (after `echothink/0005`). Establishes the M2 first-run **gate shell** by reusing T10's `chrome://echothink-first-run` page (no new page) and making a single narrow first-run-only edit to the `AddFirstRunTabs` block in `chrome/browser/chrome_browser_main.cc` so that on first launch the browser opens **only** the gate shell — suppressing the inherited `chrome://ungoogled-first-run` how-to tab and the normal-profile workspace / New Tab tabs (`master_prefs_->new_tabs`) before setup. The shell's primary CTAs are Sign in (`auth.echothink.ai/login`) and Enroll device (`auth.echothink.ai/device/enroll`), so first launch leads to login/enrollment. No navigation interception, auth-readiness flags, or post-setup restoration — those are owned by T20 (spec) and T21 (`echothink/0006-login-gate.patch`). No policy/pref change; no business logic; no network/TLS/sandbox/renderer/downloads/history/bookmarks/password/cookie/DevTools change; non-first-run startup untouched. Patch number `0011` chosen to avoid the change plan's reserved band (0004/0006–0010). Validated: `git apply --numstat` (12/3), `check_patch_files.py`, `check_gn_flags.py`, `validate_config.py` all exit 0; real `patch -p1` applied cleanly against a reconstructed post-`0003` block. Task note: `docs/echothink-browser-alpha/t11-add-first-run-shell.md`. |
| T20 | W4 | Define login gate local state and allowlist | T10, T11 | READY | Task note created at `docs/echothink-browser-alpha/t20-define-login-gate-local-state-and-allowlist.md`. Both prerequisites are now `DONE` (T10; and T11, merged in this change — see the T11 row above and task note `t11-add-first-run-shell.md`). The earlier `BLOCKED` state (recorded when T11 was missing) is therefore resolved and T20 may proceed. Still pending: the M4 login-gate spec itself (local auth/device readiness flags, unauthenticated navigation allowlist, blocked-navigation behavior, setup-completion criteria, diagnostics/support exceptions). T21 must not implement `patches/echothink/0006-login-gate.patch` until that spec exists. |
| T21 | W5 | Implement login-required startup gate | T20 | BLOCKED | T21 cannot start because prerequisite T20 is not marked `DONE` and no final login-gate spec exists. `docs/progress.md` marks T20 `READY`, says the M4 spec is still pending, and explicitly says T21 must not implement `patches/echothink/0006-login-gate.patch` until that spec exists. The current T20 note is also still a blocker note and states no login-gate spec was authored. No Chromium patch was created, `patches/series` was not changed, and protected browser areas remain untouched. Task note: `docs/echothink-browser-alpha/t21-implement-login-required-startup-gate.md`. |
| T22 | W5 | Define device identity and DPAPI storage | T00, T20 | BLOCKED | Task note created at `docs/echothink-browser-alpha/t22-define-device-identity-and-dpapi-storage.md`. T00 is `DONE`, but T20 is not `DONE` or explicitly accepted as a baseline dependency for T22: this file marks T20 `READY`, and the T20 task note still says `Status: BLOCKED` with no login-gate spec authored. T22 cannot define device identity fields, DPAPI private-key storage, metadata placement, reset/logout behavior, or private-key bridge boundaries until T20 completes the M4 login-gate spec. Missing T20 decisions: auth/device readiness flags, unauthenticated allowlist, blocked-navigation behavior, setup-completion criteria, diagnostics/support exceptions, and reset/logout semantics for non-secret enrollment state. No patch or device identity design was produced. |
| T23 | W6 | Implement device key generation and storage | T22 | BLOCKED | T23 cannot start because prerequisite T22 is not marked `DONE` and no final M5 device identity design exists. `docs/progress.md` marks T22 `BLOCKED`, and the T22 task note explicitly says T23 must not use it as authorization to implement `patches/echothink/0007-device-identity.patch`. Missing T22 decisions: local device identity fields, Windows DPAPI private-key storage format/scope, non-secret metadata placement, restart persistence, explicit reset behavior, and native bridge boundary that keeps private key material out of extension JavaScript/logs/docs. No Chromium patch was created, `patches/series` was not changed, and no key material, token, or proof internals were exposed. Task note: `docs/echothink-browser-alpha/t23-implement-device-key-generation-and-storage.md`. |
| T24 | W7 | Implement narrow extension bridge | T13, T23 | BLOCKED | Task note at `docs/echothink-browser-alpha/t24-implement-narrow-extension-bridge.md`. T24 cannot start because prerequisite T23 is not marked `DONE` and no device-key implementation exists for the bridge to call. T13 is `DONE` and supplies the bundled workspace extension ID `lokdibgfmiemhdoogailbfpdggndpolk`, but `docs/progress.md` marks T23 `BLOCKED`, no `patches/echothink/0007-device-identity.patch` exists, and `patches/series` does not list `echothink/0007-device-identity.patch`. Missing T23/T22 decisions and files: DPAPI key storage format/scope, device metadata placement, restart persistence, explicit reset behavior, native private-key boundary, `patches/echothink/0007-device-identity.patch`, and `patches/series`. No bridge API, extension permissions, native code, backend service, network/TLS/sandbox/renderer/downloads/history/bookmarks/password/cookie/DevTools behavior, key material, token, or proof internals were changed or exposed. |
| T25 | W8 | Define request proof payload and allowlist | T24 | BLOCKED | T25 cannot start because prerequisite T24 is not marked `DONE`; T24 is `BLOCKED` by missing device identity implementation from T23. No proof helper spec was authored: canonical payload shape, Echothink-domain signing allowlist, third-party rejection behavior, browser-side signing boundary, replay-protection ownership, and proof-validation ownership remain undefined. No Chromium patch, extension code, backend service, gateway logic, network/TLS/sandbox/renderer/downloads/history/bookmarks/password/cookie/DevTools behavior, private key material, access token, signed proof, or proof internals were changed or exposed. Task note: `docs/echothink-browser-alpha/t25-define-request-proof-payload-and-allowlist.md`. |
| T26 | W9 | Implement proof signing helper | T25 | BLOCKED | T26 cannot start because prerequisite T25 is not marked `DONE`, no final M5 proof helper spec exists, and the T25 task note explicitly says T26 must not use it as authorization to implement `patches/echothink/0008-request-proof-helper.patch`. Missing T25 decisions: canonical request-proof payload fields/order/normalization, Echothink destination signing allowlist, malformed and third-party rejection behavior, browser-side signing-only boundary, backend replay/proof-validation ownership, and safe signature/proof result shape. Upstream blockers remain T24 bridge, T23 device key implementation, T22 device identity design, and T20 login-gate spec. No patch was created, `patches/series` was not changed, Chromium network/TLS behavior remains untouched, and no private key material, access token, signed proof, or proof internals were exposed. Task note: `docs/echothink-browser-alpha/t26-implement-proof-signing-helper.md`. |
| T27 | W10 | Integrate proof helper into extension calls | T16, T24, T26 | BLOCKED | T27 cannot start because prerequisite T24 is not marked `DONE` and T26 is marked `BLOCKED` with no proof signing helper patch. T16 is `DONE` and supplies the current chat request path, but there is no authorized bridge method, proof helper result shape, signing error model, proof header/metadata contract, or active `patches/echothink/0008-request-proof-helper.patch` for the extension to consume. No extension files, manifest permissions, host permissions, Chromium patch files, or `patches/series` entries were changed; no private key material, access tokens, proof payloads, signed proof values, or proof internals were exposed. Task note: `docs/echothink-browser-alpha/t27-integrate-proof-helper-into-extension-calls.md`. |
| T28 | W5 | Implement optional `echo://` resolver | T10 | DONE | Task note at `docs/echothink-browser-alpha/t28-implement-optional-resolver.md`. Prerequisite T10 is DONE. Created `patches/echothink/0009-echo-protocol-router.patch` and inserted `echothink/0009-echo-protocol-router.patch` into `patches/series` after `echothink/0011-first-run-gate-shell.patch` and before `echothink/0010-windows-packaging-identity.patch`. Patch adds a narrow `chrome/browser/ui/browser_navigator.cc` navigation helper that rewrites only known `echo://` route shapes (`dashboard`, `project/{id}`, `task-wave/{id}`, `app-domain/{domain}/{instance}`, `artifact/{id}`, `approval/{id}`) to matching `https://app.echothink.ai/` URLs, accepts only unreserved non-empty segments, rejects query/fragment payloads, and clears the `echo://` referrer. No backend authorization, device proof, protected content, network/TLS/sandbox/renderer/downloads/history/bookmarks/password/cookie/DevTools behavior changed. Unsupported/invalid route UX remains T29. Validated: `git apply --numstat`, `check_patch_files.py`, `check_gn_flags.py`, `validate_config.py`, and real `patch -p1` against the pinned Chromium `148.0.7778.178` `browser_navigator.cc` source copy all pass. |
| T29 | W6 | Add invalid `echo://` route fallback page | T28 | DONE | Task note at `docs/echothink-browser-alpha/t29-add-invalid-fallback-page.md`. Prerequisite T28 is DONE. Created `patches/echothink/0012-invalid-echo-route-fallback.patch` and inserted `echothink/0012-invalid-echo-route-fallback.patch` in `patches/series` immediately after `echothink/0009-echo-protocol-router.patch`. Patch keeps T28 valid route resolution intact and rewrites unsupported/invalid `echo://` navigations to local `chrome://echothink-invalid-echo`, clearing the original referrer and carrying no original route, segments, query, or fragment into the fallback URL or page. The WebUI page is static/script-free, contains no workspace/resource data, and links only to dashboard, setup, and support. No backend service, gateway logic, network/TLS/sandbox/renderer/downloads/history/bookmarks/password/cookie/DevTools behavior changed. Validated: `git apply --numstat`, `check_patch_files.py`, `check_gn_flags.py`, `validate_config.py`, and targeted `git apply --check --include=chrome/browser/ui/browser_navigator.cc` against the existing post-T28 source copy all pass. |
| T30 | W3 | Define Windows app identity and channels | T05, T06 | DONE | Windows packaging identity spec created at `docs/echothink-browser-alpha/t30-define-windows-app-identity-and-channels.md`. Prerequisites T05 and T06 are DONE. Defines Windows display/Start Menu/uninstall names, `EchothinkBrowserSetup` installer stem and channelized artifact names, channel IDs/labels for Canary, Dev, Beta, Stable, and Enterprise Stable, Alpha-versus-Beta branding requirements, update-channel metadata fields expected by packaging, and Windows smoke-test expectations. No patch or installer implementation was created. |
| T31 | W4 | Implement Windows packaging identity patch | T30 | DONE | Task note at `docs/echothink-browser-alpha/t31-implement-windows-packaging-identity-patch.md`. Prerequisite T30 is DONE. Created `patches/echothink/0010-windows-packaging-identity.patch` and appended `echothink/0010-windows-packaging-identity.patch` to `patches/series` after the active Echothink tail. Patch sets Alpha Dev Windows app/install identity through Chromium `BRANDING`, Windows install_static constants, installer registry roots, app shortcut folder text, mini-installer icon handoff documentation, and `chrome://version` build labels. `chrome.exe`, `setup.exe`, sandbox IDs, COM GUIDs, network stack, TLS, renderer internals, downloads, history, bookmarks, password manager, cookies, and DevTools remain unchanged. Validated: `git apply --numstat`, `check_patch_files.py`, `check_gn_flags.py`, and `validate_config.py` all pass. Real Windows build/install smoke is deferred to T32/T36 because no local Chromium source checkout or Windows installer environment exists here. |
| T32 | W5 | Add Windows build/signing/smoke docs | T30, T31 | DONE | Windows Alpha release runbook created at `docs/echothink-browser-alpha/t32-add-windows-build-signing-smoke-docs.md`. Prerequisites T30 and T31 are DONE. Documents the Alpha Dev `mini_installer` build path, asset staging, `EchothinkBrowserSetup-Dev-x64-148.0.7778.178-alpha.<build>.exe` package shape, signing workflow, sidecar update-channel metadata and reserved per-channel IDs, smoke procedure covering launch, branding, New Tab, Side Panel, search, restart, and uninstall, plus an Alpha candidate release checklist. Validation is docs/path based because this environment is not Windows and has no local Chromium source checkout. |
| T33 | W11 | Run full patch validation | T05, T08, T10, T13, T19, T21, T23, T26, T31 | BLOCKED | Task note at `docs/echothink-browser-alpha/t33-run-full-patch-validation.md`. T33 cannot run full inherited-plus-Echothink patch validation because required prerequisites T21, T23, and T26 are `BLOCKED`, with no explicit baseline exception for T33. Missing required artifacts are `patches/echothink/0006-login-gate.patch`, `patches/echothink/0007-device-identity.patch`, and `patches/echothink/0008-request-proof-helper.patch`; none are listed in `patches/series`. Current active `patches/series` is structurally valid for existing patches (`entries=122`, `inherited=108`, `echothink=14`, `missing_series_files=0`, `duplicates=0`, `echothink_tail_ok=True`), and `check_patch_files.py`, `check_gn_flags.py`, and `validate_config.py` pass for the current incomplete series. Full application to pinned Chromium source was not run because it would validate an incomplete Alpha patch set. |
| T34 | W12 | Run native browser regression suite | T33 | BLOCKED | Task note at `docs/echothink-browser-alpha/t34-run-native-browser-regression-suite.md`. T34 cannot run the native browser regression suite because direct prerequisite T33 is `BLOCKED`, with no explicit baseline exception for T34. Missing prerequisite artifacts remain `patches/echothink/0006-login-gate.patch`, `patches/echothink/0007-device-identity.patch`, and `patches/echothink/0008-request-proof-helper.patch`; none are active in `patches/series`. No runtime validation was run for tabs, windows, popups, history, downloads, bookmarks, password manager, cookies, local storage, TLS, DevTools, or extension loading. T34 made no browser patch/source/extension/asset/packaging changes and did not replace Chromium primitives; runtime Chromium-native ownership remains unconfirmed until T33 completes and a runnable validated browser build exists. |
| T35 | W12 | Run Echothink behavior tests | T33 | BLOCKED | Task note at `docs/echothink-browser-alpha/t35-run-echothink-behavior-tests.md`. T35 cannot run because direct prerequisite T33 is `BLOCKED`, with no explicit baseline exception for behavior testing. T33 is blocked by missing required Alpha implementation patches `patches/echothink/0006-login-gate.patch`, `patches/echothink/0007-device-identity.patch`, and `patches/echothink/0008-request-proof-helper.patch`, owned by blocked T21, T23, and T26. Required behavior checks for login gate and allowlist behavior, device identity persistence, and proof-helper URL allowlist signing cannot pass because those browser artifacts do not exist. Branding, New Tab, search, Side Panel, Chat, Workspace Context, scope metadata, and optional `echo://` behavior were not rerun because there is no validated full Alpha browser candidate after T33. No source or patch files changed; docs only. |
| T36 | W13 | Run Windows packaging smoke test | T31, T32, T35 | BLOCKED | Task note at `docs/echothink-browser-alpha/t36-run-windows-packaging-smoke-test.md`. T36 cannot run because prerequisite T35 is `BLOCKED`, with no explicit baseline exception for Windows packaging smoke. T31 and T32 are `DONE`; the Windows Alpha Dev identity patch, icon assets, update-channel metadata contract, and smoke procedure are present. However, no validated Alpha behavior pass or Windows installer candidate exists after T35, so install, Start Menu launch, app/icon identity, New Tab, Side Panel restart persistence, search, signing/update-channel observations, and uninstall were not run. Missing upstream artifacts remain `patches/echothink/0006-login-gate.patch`, `patches/echothink/0007-device-identity.patch`, and `patches/echothink/0008-request-proof-helper.patch`. Docs only; no source, patch, asset, installer, network, TLS, sandbox, renderer, downloads, history, bookmarks, password manager, cookies, or DevTools behavior changed. |

## T00 Notes

Changed documentation:

- `docs/echothink-browser-alpha/t00-baseline-repo-audit.md`
- `docs/progress.md`

Recorded baseline:

- Chromium pin from inherited tree: `148.0.7778.178`.
- Repo revision from inherited tree: `1`.
- Git HEAD observed in inherited tree:
  `95f6fe1c945624ea19746084d4ecc3e33c1dee3f`.
- Patch pipeline documented: downloads, pruning, patch application, domain
  substitution, GN generation, and Ninja build invocation.
- Known insertion points documented for New Tab, search provider, first-run,
  flags/defaults, extension handling, and Side Panel-adjacent inherited UI.
- Areas to keep inherited from Chromium/Ungoogled Chromium documented.

Validation commands and results:

| Command | Result |
|---|---|
| Requested-root path check for required patch/config files | All required build/config paths missing under `echothink-studio-new`; only `docs/` is present. |
| Inherited-root path check for required patch/config files | All required build/config paths present under `C:\Users\caoya\source\repos\echothink-studio`. |
| `python devutils\validate_config.py` | Failed with unused-patch warnings due to Windows path separator mismatch in the unused-patch check. |
| Direct PowerShell validation of `patches\series` entries | Passed: `series_entries=108`, `missing_count=0`. |
| `python devutils\check_downloads_ini.py -d downloads.ini` | Passed. |
| `python devutils\check_gn_flags.py` | Passed. |

Known limitations:

- T00 did not apply patches, download Chromium, build Chromium, or run browser
  smoke tests.
- `python devutils\validate_config.py` is not clean on Windows in the inherited
  tree until path normalization is fixed or the check is run in a POSIX-style
  environment.
- `python devutils\check_downloads_ini.py` fails with no arguments in this
  environment because its default downloads list is a string list; passing
  `-d downloads.ini` succeeds.
- No `patches/echothink/`, `extensions/echothink-workspace/`, `assets/`, or
  `build/windows/` path exists yet.

## T01 Notes

Changed documentation:

- `docs/echothink-browser-alpha/t01-define-echothink-patch-discipline.md`
- `docs/ungoogled_to_echothink_browser_change_plan.md`
- `docs/echothink_browser_construction.md`
- `docs/progress.md`

Defined patch discipline:

- Echothink-owned native Chromium patches must live under `patches/echothink/`.
- Patch names must use `NNNN-short-kebab-case-purpose.patch`.
- Patches must be small, single-purpose, UTF-8 unified diffs compatible with
  the inherited `patch -p1` pipeline.
- Echothink entries in `patches/series` must be slash-delimited and appended
  after all inherited patches.
- Placeholder `patches/series` entries are forbidden.
- Every Echothink patch must include the required header documenting browser
  ownership, preferred surfaces checked, protected areas, touched native files,
  rebase risk, and validation.
- Future tasks must prefer policy, preferences, extension APIs, web-app/backend
  ownership, or existing Chromium hooks before native Chromium patching.
- Network stack, TLS/certificate validation, sandbox, renderer internals,
  download manager behavior, history manager behavior, bookmark manager
  behavior, password manager behavior, cookie/site-storage behavior, and
  DevTools behavior are explicitly protected.
- Review checklists are defined for new patches and future Chromium rebases.

Validation commands and results:

| Command | Result |
|---|---|
| `Test-Path docs\echothink-browser-alpha\t01-define-echothink-patch-discipline.md` | Passed. |
| `rg -n "NNNN-short-kebab-case-purpose|Required Patch Header|Forbidden Native Changes|Chromium Rebase Checklist|patches/echothink|patches/series" docs\echothink-browser-alpha\t01-define-echothink-patch-discipline.md` | Passed. |
| `rg -n "\| T01 \| W1 \| Define Echothink patch discipline" docs\progress.md` | Passed. |
| Inherited-root path check for `patches\series`, `patches\core`, and `patches\extra` | Present under `C:\Users\caoya\source\repos\echothink-studio`. |
| Requested-root path check for `patches\series` and `patches\echothink` | Missing under `echothink-studio-new`, as documented by T00. |

Known limitations:

- T01 did not create `patches/echothink/`, produce a patch, update
  `patches/series`, or run patch application.
- Patch placement and ordering validation are defined but remain deferred until
  a task creates the first Echothink patch.
- The requested repository root still contains only documentation; the inherited
  patch/config tree remains one directory up.

## T02 Notes

Changed documentation:

- `docs/echothink-browser-alpha/t02-define-echothink-repo-structure.md`
- `docs/progress.md`

Prerequisite status:

- T02 depends on T01.
- T01 is marked `DONE` (and records T00 as `DONE`).
- The requested-root mismatch remains accepted as a baseline dependency for
  this docs-only skeleton plan. Documentation lives under
  `echothink-studio-new\docs`; the canonical browser repo (inherited patch tree)
  is one directory up at `C:\Users\caoya\source\repos\echothink-studio`.

Skeleton decisions:

- Four Echothink-owned paths defined with owner, purpose, expected contents, and
  creation trigger: `patches/echothink/` (T05+), `extensions/echothink-workspace/`
  (T12), `assets/` with `icons/`, `installer/`, `about/` (T06), and
  `build/windows/` (T32). Docs surface (`docs/`, `docs/echothink-browser-alpha/`)
  documented as the planning/convention home.
- `patches/series` entry timing restated from T01: an `echothink/NNNN-*.patch`
  line may be added only when the patch file exists and is active; placeholder
  entries forbidden; Echothink entries form a contiguous tail after the final
  inherited entry `extra/ungoogled-chromium/add-flag-for-disabling-jit.patch`.
- Placeholder/generated-artifact policy defined: no empty directories, no stub
  patch/doc files, no committed build outputs (Chromium source, `out/`, archives,
  installers); only canonical shipped assets are committed under `assets/`.
- T02 created no directory, produced no patch, and did not modify
  `patches/series`.

Validation commands and results:

| Command | Result |
|---|---|
| Target-path existence check for `patches/echothink`, `extensions`, `extensions/echothink-workspace`, `assets`, `build`, `build/windows` | All MISSING — confirms the skeleton is a plan and T02 introduces no directories. |
| `patches/` layer listing | `core/`, `extra/`, `upstream-fixes/` present; no `echothink/`. Inherited layers untouched. |
| Non-blank `patches/series` entry count | `108` — unchanged from T00/T03 baseline. |
| `grep -c echothink patches/series` | `0` — series remains inherited-only. |
| `patches/series` tail check | Final inherited entry is `extra/ungoogled-chromium/add-flag-for-disabling-jit.patch`. |
| Cross-reference check vs `t01-define-echothink-patch-discipline.md` and `echothink_browser_construction.md` section 4 | Path names, patch filenames, and ordering rules match. |

Known limitations:

- T02 did not create `patches/echothink/`, `extensions/echothink-workspace/`,
  `assets/`, or `build/windows/`; downstream tasks materialize them with real
  content.
- The canonical-root mismatch is unresolved; the first task to physically create
  these directories (T05/T06/T08/T12/T32) must resolve or explicitly accept it
  and record the decision here.
- Exact `manifest.json` fields, asset dimensions, and Windows channel/update
  metadata remain owned by T12, T06/T04, and T30/T32.

## T03 Notes

Changed documentation:

- `docs/echothink-browser-alpha/t03-validate-inherited-patch-pipeline.md`
- `docs/progress.md`

Prerequisite status:

- T03 depends on T00.
- T00 is marked `DONE`.
- The requested-root mismatch remains accepted as a baseline dependency for
  this validation task: documentation lives under `echothink-studio-new\docs`,
  while inherited patch/config validation was run from
  `C:\Users\caoya\source\repos\echothink-studio`.

Validation commands and results:

| Command | Result |
|---|---|
| `python devutils\validate_config.py` | Failed as a baseline Windows tooling issue: unused-patch detection reports all patches unused because it compares Windows backslash paths against slash-delimited `patches/series` entries. |
| Direct PowerShell validation of `patches\series` entries | Passed: `entries=108`, `missing=0`, `duplicates=0`, `echothink_entries=0`. |
| Direct imported `check_patch_readability()` and `check_series_duplicates()` | Passed: `readability_warnings=False`, `duplicate_warnings=False`. |
| `python devutils\check_patch_files.py` | Failed with the same baseline Windows path separator issue as `validate_config.py`. |
| `python devutils\check_downloads_ini.py -d downloads.ini` | Passed. |
| `python devutils\check_gn_flags.py` | Passed. |
| `python -m pytest -c pytest.ini` from `utils\` | Failed before running tests because `pytest-cov` is missing from the local environment. |
| `python -m pytest -c pytest.ini -o addopts=''` from `utils\` | Ran without coverage addopts: 3 passed, 1 failed. The failing test is POSIX-specific and expects `/bin/false` to exist on Windows. |
| `python -m pytest -c pytest.ini` from `devutils\` | Failed before running tests because `pytest-cov` is missing from the local environment. |
| `python -m pytest -c pytest.ini -o addopts=''` from `devutils\` | Passed: 2 tests passed. |
| `where.exe patch` | Found GNU patch at `C:\Users\caoya\anaconda3\Library\usr\bin\patch.exe`. |
| `python -c "import importlib.util; ..."` | Confirmed `requests=True`, so the Python dependency for remote validation is available. |
| `python devutils\validate_patches.py --remote` | Failed before patch application. It attempted to download 639 remote files, then failed while parsing Chromium `DEPS`. |
| `python devutils\validate_patches.py --remote -v` | Confirmed the parser failure occurs while reading `https://chromium.googlesource.com/chromium/src.git/+/148.0.7778.178/DEPS?format=TEXT`; line 218 uses `Str('')`, which the inherited parser does not support. |

Patch baseline:

- `patches/series` remains inherited-only before Echothink patch additions.
- Current active series entries: 108.
- Current final inherited entry:
  `extra/ungoogled-chromium/add-flag-for-disabling-jit.patch`.
- `patches/echothink/` still does not exist in the inherited tree.
- No `echothink/*` entries exist in `patches/series`.

Known limitations:

- No local pristine Chromium source tree was available for
  `python devutils\validate_patches.py --local <path-to-unmodified-chromium-src>`.
- The attempted remote patch application validator did not reach patch
  application because of the inherited `DEPS` parser issue.
- Existing failures are baseline inherited-tooling or Windows-portability
  issues, not Echothink patch regressions.

## T04 Notes

Changed documentation:

- `docs/echothink-browser-alpha/t04-define-product-branding-inventory.md`
- `docs/ungoogled_to_echothink_browser_change_plan.md`
- `docs/echothink_browser_construction.md`
- `docs/progress.md`

Prerequisite status:

- T04 depends on T00.
- T00 is marked `DONE`.
- The requested-root mismatch remains accepted as a baseline dependency for
  this docs-only branding inventory. Documentation lives under
  `echothink-studio-new\docs`; inherited branding touchpoints were inspected in
  `C:\Users\caoya\source\repos\echothink-studio`.

Branding decisions:

- Product name: `Echothink Browser`.
- Windows application display name: `Echothink Browser`.
- Windows Start Menu shortcut name: `Echothink Browser`.
- Windows installed-app / uninstall display name: `Echothink Browser`.
- Installer executable/name stem: `EchothinkBrowserSetup`.
- About page heading and first-run page title/heading:
  `Echothink Browser`.
- Alpha may keep Chromium-derived executable/internal naming if needed to
  reduce patch risk; public Beta should revisit this through T30/T31.

Concrete inherited touchpoints checked:

- `patches/extra/ungoogled-chromium/first-run-page.patch` for inherited
  first-run WebUI pattern and copy.
- `patches/extra/ungoogled-chromium/add-extra-channel-info.patch` for
  `chrome://version` build label changes.
- `patches/extra/ungoogled-chromium/add-credits.patch` for Chromium and
  Ungoogled Chromium credits/license generation.
- `patches/extra/ungoogled-chromium/remove-uneeded-ui.patch` for inherited
  About-page UI edits.
- Root `README.md`, `LICENSE`, and `SUPPORT.md` as inherited attribution and
  repo-presentation surfaces.

Validation commands and results:

| Command | Result |
|---|---|
| `Test-Path docs\echothink-browser-alpha\t04-define-product-branding-inventory.md` | Passed. |
| `rg -n "EchothinkBrowserSetup|Windows Start Menu|About Page Copy Requirements|First-Run Copy Requirements|Icon And Asset Requirements|Attribution Requirements" docs\echothink-browser-alpha\t04-define-product-branding-inventory.md` | Passed. |
| Inherited touchpoint path check for `first-run-page.patch`, `add-extra-channel-info.patch`, `add-credits.patch`, and `remove-uneeded-ui.patch` | Passed: all four files exist. |
| Inherited-root path check for `assets` | Passed as expected for inventory baseline: `assets` does not exist yet. |
| `rg -n "t04-define-product-branding-inventory" docs\ungoogled_to_echothink_browser_change_plan.md docs\echothink_browser_construction.md docs\progress.md` | Passed. |

Known limitations:

- T04 did not create `patches/echothink/0001-branding.patch`, add visual
  assets, modify installer metadata, or run a browser build.
- Exact Chromium source string/resource files must be verified during T05/T06
  because the requested root is docs-only and the inherited common repo does
  not include a Chromium source checkout.
- Exact installer bitmap dimensions and channel-specific names remain T30/T32
  packaging decisions.

## T06 Notes

Changed / added files:

- `assets/README.md`
- `assets/icons/echothink.svg`
- `assets/icons/echothink.ico`
- `assets/icons/png/echothink-{16,20,24,32,40,48,64,128,256}.png` (9 files)
- `assets/installer/echothink-setup.ico`
- `assets/installer/README.md`
- `assets/about/echothink-logo-{64,128,256}.png` (3 files)
- `assets/tools/generate_icons.py`
- `docs/echothink-browser-alpha/t06-add-echothink-visual-assets.md`
- `docs/progress.md`

Prerequisite status:

- T06 depends on T04. T04 is marked `DONE`.
- The canonical-root mismatch (T00) is carried forward. T06 is the first
  artifact-producing task, so the `assets/` bundle is placed at the inherited
  canonical build root (beside `patches/`, `utils/`, `devutils/`) — where the
  packaging/branding patches consume it — rather than under the docs-only
  `echothink-studio-new` root. Task documentation stays under
  `echothink-studio-new\docs`.

Asset decisions:

- Original Echothink artwork: a focal "think" dot emitting two "echo" ripples
  in white on a rounded teal->deep-blue tile (`#15C2D6` -> `#0A4F8A`).
- Master source: `assets/icons/echothink.svg`. All rasters are reproduced from
  the matching geometry via `assets/tools/generate_icons.py` (Pillow), because
  the environment's `cairosvg` lacks a working cairo native library.
- No Chromium / Google Chrome / Ungoogled Chromium logo artwork is reused, per
  T04 attribution rules. Source/ownership recorded in `assets/README.md`.
- Required Windows Alpha sizes are present: PNG 16/20/24/32/40/48/64/128/256,
  multi-resolution app `.ico` and installer `.ico` (same 9 sizes), and
  About/first-run logos 64/128/256.
- Installer banner/dialog bitmaps are deferred to T30/T32 (dimensions depend on
  the installer technology); documented in `assets/installer/README.md`.

Validation commands and results:

| Command | Result |
|---|---|
| `python3 assets/tools/generate_icons.py` | Passed: wrote 9 PNG app icons, `echothink.ico`, `echothink-setup.ico`, and 3 About logos. |
| Pillow size/mode check on `icons/png/*.png` and `about/*.png` | Passed: exact target sizes, RGBA. |
| Pillow `.ico` resolution check on both `.ico` files | Passed: each contains 16, 20, 24, 32, 40, 48, 64, 128, 256. |
| Visual inspection of 256 px and 32 px exports | Passed: mark legible at large and small sizes. |
| `find assets -type f` | Passed: 17 files present under the planned structure. |

Known limitations:

- Rasters are downsampled from one master rather than hand-tuned per size;
  production may want pixel hinting for the 16 px icon. Acceptable for Alpha.
- Installer banner/dialog bitmaps deferred to T30/T32.
- Wiring assets into Chromium resources and the installer is owned by T05 and
  T30/T32; T06 only adds and documents the bundle.
- No pinned Chromium source checkout was available locally; exact native icon
  resource replacement paths are verified by T05/T30.

## T07 Notes

Changed documentation:

- `docs/echothink-browser-alpha/t07-define-default-policy-preference-set.md`
- `docs/ungoogled_to_echothink_browser_change_plan.md`
- `docs/echothink_browser_construction.md`
- `docs/dag-doc.md`
- `docs/progress.md`

Prerequisite status:

- T07 depends on T00.
- T00 is marked `DONE`.
- The requested-root mismatch remains accepted as a baseline dependency for
  this docs-only defaults spec. Documentation lives under
  `echothink-studio-new\docs`; inherited defaults/search/New Tab touchpoints
  were inspected in `C:\Users\caoya\source\repos\echothink-studio`.

Default decisions:

- Homepage: `https://app.echothink.ai/dashboard`.
- New Tab: `https://app.echothink.ai/newtab`.
- Default search provider: `Echothink Search`.
- Search URL: `https://search.echothink.ai/search?q={searchTerms}`.
- Suggest URL: `https://search.echothink.ai/suggest?q={searchTerms}`.
- Search suggestions remain disabled by default over the inherited baseline;
  the suggest URL is configured for use when the user or enterprise enables
  suggestions.
- Default bookmarks: Workspace, New Tab, Search, Support, Browser Download,
  and Browser Updates under Echothink-owned domains.
- T08 should prefer recommended policy, installer initial preferences, existing
  profile preference hooks, and inherited New Tab hooks before native patching.

Concrete inherited touchpoints checked:

- `docs/default_settings.md` for inherited default settings.
- `patches/extra/inox-patchset/0006-modify-default-prefs.patch` for inherited
  profile preference defaults.
- `patches/extra/iridium-browser/prefs-always-prompt-for-download-directory-by-defaul.patch`
  for inherited download prompt default.
- `patches/extra/ungoogled-chromium/default-webrtc-ip-handling-policy.patch`
  for inherited WebRTC IP handling default.
- `patches/core/ungoogled-chromium/replace-google-search-engine-with-nosearch.patch`
  for inherited default search replacement.
- `patches/extra/ungoogled-chromium/add-suggestions-url-field.patch` for
  suggestion URL editing support.
- `patches/extra/ungoogled-chromium/add-flag-for-custom-ntp.patch` for the
  inherited custom New Tab hook.
- `patches/extra/ungoogled-chromium/add-flag-for-bookmark-bar-ntp.patch` for
  inherited New Tab bookmark bar behavior.

Validation commands and results:

| Command | Result |
|---|---|
| `Test-Path docs\echothink-browser-alpha\t07-define-default-policy-preference-set.md` | Passed. |
| `rg -n "https://app.echothink.ai/dashboard|https://app.echothink.ai/newtab|https://search.echothink.ai/search\\?q=\\{searchTerms\\}|https://search.echothink.ai/suggest\\?q=\\{searchTerms\\}|Default Bookmark Set|Enterprise-Safe Defaults" docs\echothink-browser-alpha\t07-define-default-policy-preference-set.md` | Passed. |
| Inherited touchpoint path check for `docs\default_settings.md`, `0006-modify-default-prefs.patch`, `replace-google-search-engine-with-nosearch.patch`, `add-suggestions-url-field.patch`, `add-flag-for-custom-ntp.patch`, and `add-flag-for-bookmark-bar-ntp.patch` | Passed: all checked files exist. |
| `rg -n "t07-define-default-policy-preference-set|Default homepage route" docs\ungoogled_to_echothink_browser_change_plan.md docs\echothink_browser_construction.md docs\dag-doc.md docs\progress.md` | Passed. |

Known limitations:

- T07 did not create `patches/echothink/0002-default-policies-and-preferences.patch`,
  add bookmarks, modify search provider data, or run a browser build.
- Exact Chromium policy, preference, TemplateURL, and bookmark seed paths must
  be verified during T08 against the pinned Chromium source after inherited
  patches are applied.
- Backend availability for app/search/suggest/support/update routes was not
  validated; these are browser route contracts only.

## T09 Notes

Changed documentation:

- `docs/echothink-browser-alpha/t09-confirm-new-tab-insertion-point.md`
- `docs/ungoogled_to_echothink_browser_change_plan.md`
- `docs/echothink_browser_construction.md`
- `docs/dag-doc.md`
- `docs/progress.md`

Prerequisite status:

- T09 depends on T00.
- T00 is marked `DONE`.
- The requested-root mismatch remains accepted as a baseline dependency for
  this docs-only New Tab hook decision. Documentation lives under
  `echothink-studio-new\docs`; inherited New Tab touchpoints were inspected in
  `C:\Users\caoya\source\repos\echothink-studio`.

Hook decision:

- Use Chromium's `HandleNewTabPageLocationOverride()` path in
  `chrome/browser/chrome_content_browser_client.cc` as modified by the
  inherited `add-flag-for-custom-ntp.patch`.
- Prefer seeding `prefs::kNewTabPageLocationOverride` for normal profiles to
  `https://app.echothink.ai/newtab`.
- Do not use a global `--custom-ntp=https://app.echothink.ai/newtab` default
  for Alpha because the inherited switch can route incognito New Tabs to
  external URLs.
- Keep fallback behavior out of the route hook. T10/T11/T20 own minimal local
  fallback/setup pages and login-gate state.

Concrete inherited touchpoints checked:

- `patches/extra/ungoogled-chromium/add-flag-for-custom-ntp.patch` for the
  selected New Tab override hook.
- `patches/extra/inox-patchset/0008-restore-classic-ntp.patch` for inherited
  local NTP behavior and why search-provider `new_tab_url` is not the safest
  Alpha route.
- `patches/extra/ungoogled-chromium/add-flag-for-bookmark-bar-ntp.patch` for
  inherited New Tab bookmark bar behavior.
- `patches/extra/ungoogled-chromium/first-run-page.patch` for the local WebUI
  setup/fallback pattern.
- `docs/flags.md` for inherited `--custom-ntp` and `--bookmark-bar-ntp`
  behavior.

Validation commands and results:

| Command | Result |
|---|---|
| `Test-Path docs\echothink-browser-alpha\t09-confirm-new-tab-insertion-point.md` | Passed. |
| `rg -n "HandleNewTabPageLocationOverride|prefs::kNewTabPageLocationOverride|--custom-ntp|Incognito Behavior|Fallback Behavior|lower-risk" docs\echothink-browser-alpha\t09-confirm-new-tab-insertion-point.md` | Passed. |
| Inherited touchpoint path check for `add-flag-for-custom-ntp.patch`, `0008-restore-classic-ntp.patch`, `add-flag-for-bookmark-bar-ntp.patch`, `first-run-page.patch`, and `docs\flags.md` | Passed: all checked files exist. |
| `rg -n "t09-confirm-new-tab-insertion-point|HandleNewTabPageLocationOverride|--custom-ntp" docs\ungoogled_to_echothink_browser_change_plan.md docs\echothink_browser_construction.md docs\dag-doc.md docs\progress.md` | Passed. |

Known limitations:

- T09 did not create `patches/echothink/0003-new-tab-and-first-run.patch`,
  modify New Tab behavior, add fallback WebUI, or run a browser build.
- Exact patched Chromium source context must be verified during T10 after
  inherited patches are applied.
- T09 assigns fallback implementation to T10/T11/T20 and does not validate
  remote `https://app.echothink.ai/newtab` availability.

## T05 Notes

Changed files:

- `patches/echothink/0001-branding.patch` (new; first Echothink-owned patch)
- `patches/series` (appended `echothink/0001-branding.patch` as the tail block)
- `docs/echothink-browser-alpha/t05-implement-branding-patch.md` (new task note)
- `docs/progress.md`

Prerequisite status:

- T05 depends on T01 and T04; both are `DONE`.
- The canonical-root mismatch is carried forward: the patch and `patches/series`
  live in the inherited tree (one directory up), while this note lives under
  `echothink-studio-new\docs`. Chromium pin: `148.0.7778.178`.

Implementation decisions:

- Smallest stable user-visible insertion points only:
  - `chrome/app/chromium_strings.grd`: `IDS_PRODUCT_NAME` and
    `IDS_SHORT_PRODUCT_NAME` (non-Chrome-for-Testing `<else>` branch)
    `Chromium` -> `Echothink Browser`.
  - `chrome/browser/ui/webui/ungoogled_first_run.h`: first-run `<title>` and
    `<h2>` heading `ungoogled-chromium` -> `Echothink Browser`.
- Upstream attribution preserved: credits/license generation untouched; the
  first-run "built with ungoogled-chromium patches ... default Chromium
  experience" sentence and links kept verbatim; Chrome-for-Testing `<then>`
  branch unchanged.
- Deferred by design: `chrome/app/theme/chromium/BRANDING`,
  executable/installer identity, Start Menu/uninstall names, and channel labels
  (T30/T31); icon/logo assets (T06).
- Patch carries the required T01 Echothink header; `Depends-On: none`; the
  ordering dependency on the inherited `first-run-page.patch` is satisfied
  because Echothink patches apply after all inherited patches.

Validation commands and results:

| Command | Result |
|---|---|
| `python3 devutils/check_patch_files.py` | Passed, exit 0 (patch exists and is referenced; no missing/unused patches). |
| Patch placement check (`patches/echothink/0001-branding.patch`) | Passed: present under `patches/echothink/`. |
| `patches/series` tail check | Passed: `echothink/0001-branding.patch` is part of the Echothink tail block, after all inherited patches; no placeholder entries. |
| Real `patch -p1 --dry-run` and `patch -p1` against pinned Chromium source | Passed: fetched real `chromium_strings.grd` at tag `148.0.7778.178`, reconstructed `ungoogled_first_run.h` via the inherited `first-run-page.patch`, then both hunks applied cleanly, exit 0, no fuzz, no offset, no rejects. |
| Post-apply content check | Passed: product-name strings and first-run title/heading read `Echothink Browser`; attribution sentence preserved; Chrome-for-Testing branch unchanged. |

Known limitations:

- No full browser build/visual smoke test was run in this environment; About and
  `chrome://ungoogled-first-run` rendering should be confirmed in a real build.
- `validate_patches.py --remote` remains blocked by the inherited `DEPS` parser
  issue documented in T03; the targeted dry-run above validates this patch's
  hunks directly against the real pinned source.
- `chrome://version` build label still appends `ungoogled-chromium` via the
  inherited `add-extra-channel-info.patch`; channel/label wording is a T30
  packaging concern, not part of T05's product-name change.

## T08 Notes

Changed files:

- `patches/echothink/0002-default-policies-and-preferences.patch` (new
  Echothink patch)
- `patches/series` (added `echothink/0002-default-policies-and-preferences.patch`
  to the Echothink tail block after inherited patches)
- `docs/echothink-browser-alpha/t08-implement-default-policies-preferences-patch.md`
  (new task note)
- `docs/progress.md` (this file)

Prerequisite status:

- T08 depends on T01 and T07; both are `DONE`. The related New Tab hook decision
  T09 is also `DONE`.
- The T00 canonical-root mismatch is carried forward as an accepted baseline
  dependency: planning docs live under `echothink-studio-new/docs`; the inherited
  Ungoogled Chromium patch/config tree is the repository root one level up, where
  the patch and `patches/series` change were made.

Implementation decisions:

- New Tab default: seed the normal-profile, no-override fallback inside the
  inherited `HandleNewTabPageLocationOverride()` hook (T09's chosen insertion
  point). Incognito and explicit `kNewTabPageLocationOverride` /
  NewTabPageLocation policy / `--custom-ntp` values are preserved.
- Homepage, startup URL, and the six default bookmarks (Workspace, New Tab,
  Search, Support, Browser Download, Browser Updates) are delivered as Chromium
  initial preferences (`chrome/browser/resources/echothink/initial_preferences.json`)
  plus a Netscape bookmarks file imported via `import_bookmarks_from_file`. These
  are recommended distribution defaults, fully override-safe; native bookmark
  storage and the bookmark manager are not modified.
- No locked/mandatory policy is introduced. Inherited defaults preserved
  (suggestions off by default, bookmark bar on, third-party cookies blocked,
  password save/auto sign-in off). DevTools, downloads, history, cookies, TLS,
  sandbox, renderer, and network stack are untouched.
- Default search provider and suggest URL are split to
  `patches/echothink/0005-default-search-provider.patch` for T19.

Ordering / dependencies:

- Patch is in the Echothink tail block of `patches/series`, after all inherited
  entries and after `echothink/0001-branding.patch`.
- One edit hunk depends on inherited
  `extra/ungoogled-chromium/add-flag-for-custom-ntp.patch` and must apply after
  it (recorded in the patch header `Inherited-Depends-On`).

Validation commands and results:

| Command | Result |
|---|---|
| `ls patches/echothink/` | `0001-branding.patch`, `0002-default-policies-and-preferences.patch`, and `0005-default-search-provider.patch` present. |
| `grep -n "echothink/" patches/series` | Echothink entries present in the tail block, after inherited tail `add-flag-for-disabling-jit.patch`. |
| Shell loop mapping every non-comment series entry to a file | `missing_count=0`. |
| `python3 devutils/validate_config.py` | Exit 0, clean (no unused-patch/duplicate/readability warnings). Runs clean on POSIX here. |
| `python3 devutils/check_patch_files.py` | Exit 0, clean. |
| `python3 devutils/check_gn_flags.py` | Exit 0. |
| `git apply --stat` / `git apply --numstat` on the patch | Parses cleanly: chrome_content_browser_client.cc +6, initial_preferences.json +25, echothink_bookmarks.html +15. |

Build-pipeline application command (deferred; no local Chromium checkout):

- `patch -p1 < patches/echothink/0002-default-policies-and-preferences.patch`
  from the pinned Chromium 148.0.7778.178 source root after inherited patches, or
  `python3 devutils/validate_patches.py --local <unmodified-chromium-src>`.

Known limitations:

- No Chromium source checkout locally, so the New Tab edit hunk was authored
  against context that inherited patches prove exists in the pinned tree. Hunk
  line numbers are approximate (GNU patch tolerates offset, not fuzz); exact
  context must be re-confirmed at build time and on every Chromium rebase.
- Homepage/startup/bookmarks take effect only once Windows packaging (T30)
  installs the initial-preferences file (and bookmarks file). The patch commits
  the canonical content; packaging wiring is T30.
- `validate_patches.py --remote` remains blocked by the inherited Chromium `DEPS`
  parser issue documented in T03; remote patch application was not run.
- Backend availability of the Echothink app/update routes is not validated; they
  are browser route contracts only.

## T10 Notes

Changed files:

- `patches/echothink/0003-new-tab-and-first-run.patch` (new)
- `patches/series` (inserted `echothink/0003-new-tab-and-first-run.patch`
  between `echothink/0002` and `echothink/0005`)
- `docs/echothink-browser-alpha/t10-implement-new-tab-route-and-fallback.md` (new)
- `docs/progress.md`

Native files the patch touches:

- `chrome/browser/ui/webui/echothink_first_run.h` (new local fallback WebUI)
- `chrome/browser/ui/webui/chrome_web_ui_configs.cc` (register the WebUI)
- `chrome/common/webui_url_constants.cc` (add `echothink-first-run` host)
- `chrome/browser/chrome_browser_main.cc` (open page as first first-run tab)

Design decisions:

- The authenticated New Tab route (`https://app.echothink.ai/newtab`) is owned by
  T08's `0002` patch via the inherited `HandleNewTabPageLocationOverride()` hook.
  T10 does NOT re-edit that hook, so `0002` and `0003` never touch the same lines.
  T10 adds the local fallback the route degrades to when the workspace is offline,
  signed-out, or pre-enrollment.
- The fallback page reuses the inherited `first-run-page.patch` in-memory
  `URLDataSource` pattern. It is static, script-free (WebUI default CSP kept),
  renders fully offline, and links ONLY to login, device enrollment, diagnostics,
  update, and support/download. No workspace data or protected business data is
  embedded.
- First-run wiring is additive: the Echothink page is added before the inherited
  `chrome://ungoogled-first-run` tab so inherited behavior is preserved.

Validation commands and results (run from inherited repo root):

| Command | Result |
|---|---|
| `python3 devutils/check_patch_files.py` | Passed (exit 0): patch parses, referenced in series, no duplicates, no unused. |
| `git apply --numstat patches/echothink/0003-new-tab-and-first-run.patch` | Passed (exit 0): `121 0` echothink_first_run.h, `2 0` chrome_web_ui_configs.cc, `1 0` webui_url_constants.cc, `1 0` chrome_browser_main.cc. |
| `python3 devutils/check_gn_flags.py` | Passed (exit 0). |
| `python3 devutils/validate_config.py` | Passed (exit 0; clean on POSIX). |

Known limitations:

- No local Chromium checkout (per T03/T08), so real `patch -p1` application and a
  runtime browser smoke test were not run. Application is deferred to the build
  pipeline; the documented application command is in the patch header.
- `@@` hunk offsets for the three edited native files are anchored on the lines
  the inherited `first-run-page.patch` introduces; exact post-inherited offsets
  must be confirmed at apply time against pinned Chromium `148.0.7778.178`.
  `patch -p1` fuzzy matching should absorb small offset drift.
- `chrome://echothink-diagnostics` is referenced as the diagnostics link target
  per the allowed-destination list, but the diagnostics WebUI itself is owned by a
  later task (change plan 5.8); until then the diagnostics link is a known dead
  `chrome://` link.
- The redirect logic that decides *when* a failed/unauthenticated remote `/newtab`
  load lands on `chrome://echothink-first-run` is a backend/gateway and enrollment
  concern owned by T11/T20; T10 only provides the local destination and the
  first-run entry point.

## T19 Notes

Changed files:

- `patches/echothink/0002-default-policies-and-preferences.patch` (split search
  provider values out of T08 so T19 owns them)
- `patches/echothink/0005-default-search-provider.patch` (new Echothink patch)
- `patches/series` (added `echothink/0005-default-search-provider.patch` after
  `echothink/0002-default-policies-and-preferences.patch`)
- `docs/echothink-browser-alpha/t08-implement-default-policies-preferences-patch.md`
  (updated T08 scope after the split)
- `docs/echothink-browser-alpha/t19-implement-default-search-provider.md`
  (new task note)
- `docs/progress.md` (this file)

Prerequisite status:

- T19 depends on T08; T08 is `DONE` after merging local `master` into this
  worktree.
- T07 defines the search contract: provider name `Echothink Search`, keyword
  `echothink.ai`, search URL
  `https://search.echothink.ai/search?q={searchTerms}`, and suggest URL
  `https://search.echothink.ai/suggest?q={searchTerms}`.

Implementation decisions:

- Re-point the inherited "No Search" prepopulated engine slot
  (`SEARCH_ENGINE_GOOGLE`) to Echothink Search. This reuses the inherited
  default-engine mechanism and preserves DefaultSearchProvider policy and user
  choice override behavior.
- Add a `default_search_provider` block to the initial preferences file created
  by T08 so installer/first-run defaults also carry the Echothink provider.
- Configure the suggest URL on the provider but do not enable search suggestions
  by default. Suggestions remain disabled over the inherited baseline and use
  `https://search.echothink.ai/suggest?q={searchTerms}` only when a user or
  enterprise enables them.
- Preserve direct URL navigation and avoid omnibox internals. No network stack,
  TLS/certificate validation, sandbox, renderer, downloads, history, bookmarks,
  password manager, cookies, or DevTools behavior changed.

Ordering / dependencies:

- `echothink/0005-default-search-provider.patch` is in the Echothink tail block
  after `echothink/0002-default-policies-and-preferences.patch`.
- The patch depends on T08 because it edits
  `chrome/browser/resources/echothink/initial_preferences.json`, which T08
  creates.
- The prepopulated search-engine hunk depends on inherited
  `core/ungoogled-chromium/replace-google-search-engine-with-nosearch.patch`.
- Suggest URL support relies on inherited
  `extra/ungoogled-chromium/add-suggestions-url-field.patch`.

Validation commands and results:

| Command | Result |
|---|---|
| `rg -n "^\\| T08 \\|.*DONE" echothink-studio-new/docs/progress.md` | Passed; prerequisite T08 is marked `DONE`. |
| `test -f patches/echothink/0005-default-search-provider.patch` | Passed. |
| `grep -n "echothink/" patches/series` | Passed; `0005-default-search-provider.patch` is after `0002-default-policies-and-preferences.patch` in the Echothink tail block. |
| Shell loop mapping every non-comment series entry to a file | `missing_count=0`. |
| `python3 devutils/validate_config.py` | Passed, exit 0. |
| `python3 devutils/check_patch_files.py` | Passed, exit 0. |
| `python3 devutils/check_gn_flags.py` | Passed, exit 0. |
| `git apply --stat patches/echothink/0005-default-search-provider.patch` / `git apply --numstat patches/echothink/0005-default-search-provider.patch` | Parses cleanly: prepopulated_engines.json +5/-4, initial_preferences.json +7. |

Build-pipeline application command (deferred; no local Chromium checkout):

- `patch -p1 < patches/echothink/0005-default-search-provider.patch` from the
  pinned Chromium 148.0.7778.178 source root after inherited patches and after
  `patches/echothink/0002-default-policies-and-preferences.patch`, or
  `python3 devutils/validate_patches.py --local <unmodified-chromium-src>`.

Known limitations:

- No Chromium source checkout locally, so full patch application and browser
  smoke testing were not run.
- Omnibox routing and suggest behavior should be smoke-tested in a real browser
  build with a clean profile.
- Backend availability of `search.echothink.ai` was not validated; the URLs are
  browser route contracts only.

## T12 Notes

Changed files:

- `extensions/echothink-workspace/manifest.json` (new MV3 manifest)
- `extensions/echothink-workspace/background.js` (new service worker)
- `extensions/echothink-workspace/sidepanel.html` (new Side Panel shell)
- `extensions/echothink-workspace/sidepanel.css` (new Side Panel styling)
- `extensions/echothink-workspace/sidepanel.js` (new local shell behavior)
- `extensions/echothink-workspace/content_bridge.js` (new narrow content bridge)
- `extensions/echothink-workspace/assets/workspace-mark.svg` (new local asset)
- `docs/echothink-browser-alpha/t12-scaffold-bundled-workspace-extension.md`
  (new task note)
- `docs/echothink_browser_construction.md` (updated extension tree)
- `docs/progress.md` (this file)

Prerequisite status:

- T12 depends on T02; T02 is marked `DONE`.
- The canonical-root mismatch is carried forward as an accepted baseline
  dependency. The extension source lives at the inherited browser root
  (`extensions/echothink-workspace/`) beside `patches/` and `assets/`; planning
  documentation remains under `echothink-studio-new/docs`.

Implementation decisions:

- Created a source-only Manifest V3 extension skeleton. T13 has since added the
  fixed public key to the source manifest and created
  `patches/echothink/0004-bundled-workspace-extension.patch` to bundle it as a
  component extension.
- Local loading assumption for development is Chromium's unpacked-extension flow
  against `extensions/echothink-workspace/`. There is no npm, bundler,
  generated asset, or build step in this scaffold.
- Manifest declares only the T12 required permissions:
  `sidePanel`, `storage`, `tabs`, `activeTab`, and `scripting`.
- Manifest host permissions are limited to Echothink-owned domains:
  `https://app.echothink.ai/*`, `https://auth.echothink.ai/*`,
  `https://api.echothink.ai/*`, and `https://search.echothink.ai/*`.
- The content bridge injects only on `app.echothink.ai` and
  `auth.echothink.ai`, responds only to same-window bridge pings from allowed
  origins, and exposes no privileged capabilities.
- The Side Panel shell has Chat and Workspace regions with local-only state.
  Persisted mode selection has since been completed by T15; service-backed
  chat/context behavior remains T16/T17/T18/T27 or later tasks.
- No Chromium native patch, `patches/series` change, backend service call,
  search ranking, chat orchestration, workflow orchestration, or business page
  implementation was added.
- Network stack, TLS validation, sandbox, renderer internals, downloads,
  history, bookmarks, password manager, cookies, and DevTools were untouched.

Validation commands and results:

| Command | Result |
|---|---|
| `python3 -m json.tool extensions/echothink-workspace/manifest.json` | Passed: manifest JSON parses. |
| Manifest shape check for MV3, service worker, side panel path, permissions, host permissions, and content script matches | Passed: expected values matched exactly. |
| `node --check extensions/echothink-workspace/background.js` | Passed. |
| `node --check extensions/echothink-workspace/content_bridge.js` | Passed. |
| `node --check extensions/echothink-workspace/sidepanel.js` | Passed. |
| Source path check for the seven required scaffold files | Passed: all files exist under `extensions/echothink-workspace/`. |
| `git diff --check` | Passed: no whitespace errors. |

Known limitations:

- The extension was not loaded in a live Chromium profile in this environment.
  T12 validates source shape and local syntax only.
- Bundling and default installation were completed by T13; see T13 Notes below.
- Persisted Side Panel mode state has since been completed by T15.
- Chat UI behavior, outbound scope metadata, service states, request proof
  integration, and Workspace Context rendering remain later tasks.

## T13 Notes

Changed files:

- `extensions/echothink-workspace/manifest.json` (added the fixed public key so
  the source scaffold derives the same ID as the bundled component extension)
- `patches/echothink/0004-bundled-workspace-extension.patch` (new patch)
- `patches/series` (inserted `echothink/0004-bundled-workspace-extension.patch`
  between `0003` and `0005`)
- `docs/echothink-browser-alpha/t12-scaffold-bundled-workspace-extension.md`
  (noted the T13 public key and bundled-install completion)
- `docs/echothink-browser-alpha/t13-add-bundled-extension-install-patch.md`
  (new task note)
- `docs/ungoogled_to_echothink_browser_change_plan.md`
- `docs/echothink_browser_construction.md`
- `docs/progress.md` (this file)

Prerequisite status:

- T13 depends on T12; T12 is marked `DONE`.
- The canonical-root mismatch is carried forward as an accepted baseline
  dependency. Documentation lives under `echothink-studio-new/docs`; patches
  and extension source live at the inherited browser repository root.

Implementation decisions:

- Bundled the workspace shell as a Chromium component extension rather than as
  a Web Store/external update install. This loads it by default for normal
  profiles through `ComponentLoader` while preserving normal extension behavior
  outside the trusted Echothink component extension.
- Added only fixed extension ID `lokdibgfmiemhdoogailbfpdggndpolk` to the
  component extension allowlist.
- Added the extension resource files to
  `chrome/browser/resources/component_extension_resources.grd` and copied the
  shell to `chrome/browser/resources/echothink_workspace/` in the patch.
- The manifest has no `update_url`. A public Web Store extension cannot
  silently replace the bundled component because the component does not opt into
  Web Store updates and another extension cannot claim this ID without the
  corresponding private key.
- The permission model is not weakened. The manifest declares only `sidePanel`,
  `storage`, `tabs`, `activeTab`, and `scripting`; host permissions are limited
  to `https://app.echothink.ai/*`, `https://auth.echothink.ai/*`,
  `https://api.echothink.ai/*`, and `https://search.echothink.ai/*`.
- No backend service calls, search ranking, chat orchestration, workflow
  orchestration, project/task business logic, conversation persistence, or
  device/private-key handling were added.
- Network stack, TLS validation, sandbox, renderer internals, downloads,
  history, bookmarks, password manager, cookies, and DevTools were untouched.

Validation commands and results:

| Command | Result |
|---|---|
| `python3 -m json.tool extensions/echothink-workspace/manifest.json` | Passed; source manifest parses. |
| `node --check extensions/echothink-workspace/background.js` | Passed. |
| `node --check extensions/echothink-workspace/content_bridge.js` | Passed. |
| `node --check extensions/echothink-workspace/sidepanel.js` | Passed. |
| Node manifest shape/ID check | Passed; derived ID is `lokdibgfmiemhdoogailbfpdggndpolk`, permissions/host permissions match exactly, no broad permissions or `update_url`. |
| `git apply --numstat patches/echothink/0004-bundled-workspace-extension.patch` | Passed; unified diff parses cleanly. |
| `git apply --stat patches/echothink/0004-bundled-workspace-extension.patch` | Passed; patch reports 10 files changed, 492 insertions. |
| `python3 devutils/check_patch_files.py` | Passed, exit 0. |
| `python3 devutils/validate_config.py` | Passed, exit 0. |
| `python3 devutils/check_gn_flags.py` | Passed, exit 0. |

Build-pipeline application command (deferred; no local Chromium checkout):

- `patch -p1 < patches/echothink/0004-bundled-workspace-extension.patch` from
  the pinned Chromium `148.0.7778.178` source root after inherited patches and
  Echothink patches `0001`, `0002`, and `0003`, or
  `python3 devutils/validate_patches.py --local <unmodified-chromium-src>`.

Known limitations:

- No local Chromium source checkout exists, so real `patch -p1` application and
  browser runtime smoke testing were not run.
- A clean-profile browser build still needs to verify that extension ID
  `lokdibgfmiemhdoogailbfpdggndpolk` loads as a component extension by default
  and that the Side Panel opens.
- Persisted mode state has since been completed by T15. Remote chat, workspace
  context rendering, request proof, and device identity integration remain
  later tasks.

## T14 Notes

Changed files:

- `extensions/echothink-workspace/background.js` (source extension service
  worker)
- `patches/echothink/0014-side-panel-container.patch` (new Echothink patch)
- `patches/series` (appended `echothink/0014-side-panel-container.patch` to the
  Echothink tail block)
- `docs/echothink-browser-alpha/t14-implement-side-panel-container.md` (new task
  note)
- `docs/ungoogled_to_echothink_browser_change_plan.md`
- `docs/echothink_browser_construction.md`
- `docs/progress.md` (this file)

Prerequisite status:

- T14 depends on T13; T13 is marked `DONE`.
- The canonical-root mismatch is carried forward: documentation lives under
  `echothink-studio-new/docs`; the extension source and patch artifacts live in
  the inherited browser root beside `patches/` and `extensions/`.

Implementation decisions:

- Kept the Side Panel browser UI entry in the bundled MV3 extension instead of
  adding a native Chromium toolbar rewrite.
- The extension action is the entry point. The service worker configures
  `chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true })` on
  install, browser startup, and service-worker load.
- Added an explicit `chrome.action.onClicked` fallback that configures the
  current tab and calls `chrome.sidePanel.open()` from the toolbar action user
  gesture.
- The local Side Panel shell remains `sidepanel.html`; service-rendered content
  and backend behavior remain outside this task.
- No new extension permissions, host permissions, privileged bridges, native
  messaging, Web Store replacement path, backend service calls, search ranking,
  chat orchestration, workflow orchestration, project/task business logic,
  conversation persistence, or device/private-key handling were added.
- Network stack, TLS validation, sandbox, renderer internals, downloads,
  history, bookmarks, password manager, cookies, and DevTools were untouched.

Validation commands and results:

| Command | Result |
|---|---|
| `rtk python3 -m json.tool extensions/echothink-workspace/manifest.json` | Passed: manifest JSON parses. |
| `rtk node --check extensions/echothink-workspace/background.js` | Passed. |
| `rtk node --check extensions/echothink-workspace/content_bridge.js` | Passed. |
| `rtk node --check extensions/echothink-workspace/sidepanel.js` | Passed. |
| Node manifest shape check | Passed: MV3, `side_panel.default_path`, action title, exact permissions, exact host permissions, and no `update_url` or forbidden broad permissions matched expectations. |
| `rtk git apply --numstat patches/echothink/0014-side-panel-container.patch` | Passed; reports 82 insertions and 13 deletions in `chrome/browser/resources/echothink_workspace/background.js`. |
| `rtk python3 devutils/check_patch_files.py` | Passed, exit 0. |
| `rtk python3 devutils/validate_config.py` | Passed, exit 0. |
| `rtk python3 devutils/check_gn_flags.py` | Passed, exit 0. |
| `rtk git diff --check` | Passed: no whitespace errors. |

Build-pipeline application command (deferred; no local Chromium checkout):

- `patch -p1 < patches/echothink/0014-side-panel-container.patch` from the
  pinned Chromium `148.0.7778.178` source root after inherited patches and after
  `echothink/0004-bundled-workspace-extension.patch`, or
  `python3 devutils/validate_patches.py --local <unmodified-chromium-src>`.

Known limitations:

- No local Chromium source checkout or browser build exists here, so real
  `patch -p1` application and a clean-profile browser click smoke test were not
  run.
- A built browser still needs to verify that clicking the Echothink Workspace
  extension action opens the Chromium Side Panel and loads extension URL
  `sidepanel.html` from bundled component extension
  `lokdibgfmiemhdoogailbfpdggndpolk`.
- Persisted mode state has since been completed by T15.
- Chat UI behavior, outbound scope metadata, service states, request proof,
  device identity, and Workspace Context rendering remain later tasks.

## T15 Notes

Changed files:

- `extensions/echothink-workspace/sidepanel.html` (mode selector values and
  Workspace Context panel target)
- `extensions/echothink-workspace/sidepanel.css` (selector text fit)
- `extensions/echothink-workspace/sidepanel.js` (profile-local persisted mode
  state)
- `patches/echothink/0015-side-panel-mode-selector.patch` (new Echothink patch)
- `patches/series` (appended
  `echothink/0015-side-panel-mode-selector.patch` after T14)
- `docs/echothink-browser-alpha/t15-implement-side-panel-mode-selector.md`
  (new task note)
- `docs/ungoogled_to_echothink_browser_change_plan.md`
- `docs/echothink_browser_construction.md`
- `docs/progress.md` (this file)

Prerequisite status:

- T15 depends on T14; T14 is marked `DONE`.
- The canonical-root mismatch is carried forward: documentation lives under
  `echothink-studio-new/docs`; the extension source and patch artifacts live in
  the inherited browser root beside `patches/` and `extensions/`.

Implementation decisions:

- Kept the mode selector inside the bundled MV3 extension shell rather than
  adding native Chromium state plumbing.
- Exposed exactly two active Alpha modes: `chat` and `workspace_context`. The
  prior temporary `workspace` mode value was removed from source selector and
  panel markup.
- The visible top-level selector is labelled `Chat` and `Workspace Context`.
- Stored the selected mode under `echothink.sidePanel.mode` in
  `chrome.storage.local`; this storage is local to the extension install in the
  current browser profile.
- Restores the stored mode on Side Panel load, falls back to `chat` for missing
  or unsupported stored values, and switches modes immediately in the open
  panel without browser restart. A user click during initial storage restore
  wins over the late restore.
- Did not use `chrome.storage.sync`, remote account state, backend services, or
  new permissions.
- No new extension permissions, host permissions, privileged bridges, native
  messaging, Web Store replacement path, backend service calls, search ranking,
  chat orchestration, workflow orchestration, project/task business logic,
  conversation persistence, or device/private-key handling were added.
- Network stack, TLS validation, sandbox, renderer internals, downloads,
  history, bookmarks, password manager, cookies, and DevTools were untouched.

Validation commands and results:

| Command | Result |
|---|---|
| `rtk rg -n "^\\| T14 \\|.*DONE" echothink-studio-new/docs/progress.md` | Passed: prerequisite T14 is marked `DONE`. |
| `rtk python3 -m json.tool extensions/echothink-workspace/manifest.json` | Passed: manifest JSON parses. |
| `rtk node --check extensions/echothink-workspace/background.js` | Passed. |
| `rtk node --check extensions/echothink-workspace/content_bridge.js` | Passed. |
| `rtk node --check extensions/echothink-workspace/sidepanel.js` | Passed. |
| Node manifest shape check | Passed: MV3, `side_panel.default_path`, action title, exact permissions, exact host permissions, storage permission present, and no `update_url` or forbidden broad permissions matched expectations. |
| Node side-panel storage mock | Passed: stored `workspace_context` restores on load, clicking `chat` updates `chrome.storage.local`, and panel visibility follows the selected mode. |
| Node side-panel restore race mock | Passed: a user click made while initial storage restore is pending remains selected after the late restore resolves. |
| Mode contract source check | Passed: active source selector exposes only `chat` and `workspace_context`; no active `data-mode="workspace"` or `data-panel="workspace"` remains. |
| `rtk git apply --numstat patches/echothink/0015-side-panel-mode-selector.patch` | Passed: unified diff parses cleanly; reports 2 insertions in `sidepanel.css`, 25 insertions / 6 deletions in `sidepanel.html`, and 57 insertions / 3 deletions in `sidepanel.js`. |
| `rtk python3 devutils/check_patch_files.py` | Passed, exit 0. |
| `rtk python3 devutils/validate_config.py` | Passed, exit 0. |
| `rtk python3 devutils/check_gn_flags.py` | Passed, exit 0. |
| `rtk git diff --check` | Passed: no whitespace errors. |

Build-pipeline application command (deferred; no local Chromium checkout):

- `patch -p1 < patches/echothink/0015-side-panel-mode-selector.patch` from the
  pinned Chromium `148.0.7778.178` source root after inherited patches,
  `echothink/0004-bundled-workspace-extension.patch`, and
  `echothink/0014-side-panel-container.patch`, or
  `python3 devutils/validate_patches.py --local <unmodified-chromium-src>`.

Known limitations:

- No local Chromium source checkout or browser build exists here, so real
  `patch -p1` application and clean-profile restart persistence smoke testing
  were not run.
- A built browser still needs to verify that selecting `workspace_context`,
  closing all browser windows, and relaunching with the same profile restores
  Workspace Context in the Side Panel.
- Chat UI behavior, outbound scope metadata, service states, request proof,
  device identity, and service-rendered Workspace Context content remain later
  tasks.

## T16 Notes

Changed files:

- `extensions/echothink-workspace/sidepanel.html` (Chat Panel shell,
  transcript, composer, and scope selector wiring)
- `extensions/echothink-workspace/sidepanel.css` (Chat Panel transcript,
  status, scope, and composer styling)
- `extensions/echothink-workspace/sidepanel.js` (scope metadata collection,
  chat request construction, and streaming response rendering)
- `patches/echothink/0016-chat-panel-shell.patch` (new Echothink patch)
- `patches/series` (appended `echothink/0016-chat-panel-shell.patch` after the
  already-merged T17 patch on current `master`)
- `docs/echothink-browser-alpha/t16-implement-chat-panel-shell.md` (new task
  note)
- `docs/ungoogled_to_echothink_browser_change_plan.md`
- `docs/echothink_browser_construction.md`
- `docs/progress.md` (this file)

Prerequisite status:

- T16 depends on T15; T15 is marked `DONE`.
- The canonical-root mismatch is carried forward: documentation lives under
  `echothink-studio-new/docs`; the extension source and patch artifacts live in
  the inherited browser root beside `patches/` and `extensions/`.

Implementation decisions:

- Kept Chat Panel behavior inside the bundled Manifest V3 extension shell
  rather than adding native Chromium UI or service orchestration.
- Chat mode now renders an in-memory transcript, message composer, status
  region, and the visible Alpha scope selector.
- Scope values are exactly `current_page`, `project`, `app_domain`,
  `task_wave`, `artifacts`, and `organization`.
- Outbound chat requests post to `https://api.echothink.ai/v1/chat/stream`
  with `credentials: "include"`, `stream: true`, and selected
  `scope.scope_type` metadata. `current_page` also includes a sanitized
  `http`/`https` `scope.page_url` when an active tab URL is available.
- Streaming display handles `text/event-stream`, `application/x-ndjson`, and
  `text/plain` readable streams, with buffered JSON/text fallback.
- The transcript is DOM-only state for the current panel lifetime. No
  conversation is written to `chrome.storage.local`, `chrome.storage.sync`,
  profile preferences, files, or native state.
- The manifest was not changed; no new permissions, host permissions,
  privileged bridges, native messaging, Web Store replacement path, broad host
  permissions, or private extension APIs were added.
- The UI does not read, render, store, or log access tokens, private key
  material, request-proof payloads, or proof signatures.
- No backend service, gateway logic, search ranking, chat orchestration,
  workflow orchestration, project/task business logic, network stack, TLS
  validation, sandbox, renderer internals, downloads, history, bookmarks,
  password manager, cookies, or DevTools behavior changed.

Validation commands and results:

| Command | Result |
|---|---|
| `rtk rg -n "^\\| T15 \\|.*DONE" echothink-studio-new/docs/progress.md` | Passed: prerequisite T15 is marked `DONE`. |
| `rtk python3 -m json.tool extensions/echothink-workspace/manifest.json` | Passed: manifest JSON parses. |
| `rtk node --check extensions/echothink-workspace/background.js` | Passed. |
| `rtk node --check extensions/echothink-workspace/content_bridge.js` | Passed. |
| `rtk node --check extensions/echothink-workspace/sidepanel.js` | Passed. |
| Node manifest shape check | Passed: MV3, `side_panel.default_path`, exact permissions, exact host permissions, no `update_url`, and no forbidden broad permissions matched expectations. |
| Node chat request mock | Passed: submitting a message posts to `/v1/chat/stream`, uses `credentials: "include"`, includes `scope.scope_type`, omits `page_url` for non-page scopes, and renders a streamed SSE delta into the transcript. |
| `rtk rg -n -e Authorization -e Bearer -e access_token -e refresh_token -e privateKey -e private_key -e proof extensions/echothink-workspace/sidepanel.html extensions/echothink-workspace/sidepanel.js` | Exited 1 as expected: side-panel UI source contains no token, private-key, authorization-header, or proof handling. |
| `rtk git apply --numstat patches/echothink/0016-chat-panel-shell.patch` | Passed: unified diff parses cleanly against current `master` patch order after T17. |
| `rtk python3 devutils/check_patch_files.py` | Passed, exit 0. |
| `rtk python3 devutils/validate_config.py` | Passed, exit 0. |
| `rtk python3 devutils/check_gn_flags.py` | Passed, exit 0. |
| `rtk git diff --check` | Passed: no whitespace errors. |

Build-pipeline application command (deferred; no local Chromium checkout):

- `patch -p1 < patches/echothink/0016-chat-panel-shell.patch` from the pinned
  Chromium `148.0.7778.178` source root after inherited patches,
  `echothink/0004-bundled-workspace-extension.patch`,
  `echothink/0014-side-panel-container.patch`,
  `echothink/0015-side-panel-mode-selector.patch`, and
  `echothink/0017-workspace-context-shell.patch`, or
  `python3 devutils/validate_patches.py --local <unmodified-chromium-src>`.

Known limitations:

- No local Chromium source checkout or browser build exists here, so real
  `patch -p1` application and clean-profile runtime chat smoke testing were
  not run.
- Real chat endpoint behavior still depends on backend auth/session, scope
  authorization, retrieval, conversation persistence, model routing, audit
  logging, and proof validation outside the browser.
- T16 does not implement project/App Domain/Task Wave/artifact ID discovery.
  Those identifiers remain service-context inputs for later work.
- Broader resilient local states are handled by T18. Workspace Context service
  retrieval remains later work beyond the T17 shell. Device
  bridge/proof-capable requests remain T24/T27.

## T17 Notes

Changed files:

- `extensions/echothink-workspace/sidepanel.html` (Workspace Context overview
  and required section containers)
- `extensions/echothink-workspace/sidepanel.css` (Workspace Context layout,
  section states, item rows, and action link styles)
- `extensions/echothink-workspace/sidepanel.js` (generic structured snapshot
  renderer)
- `patches/echothink/0017-workspace-context-shell.patch` (new Echothink patch)
- `patches/series` (appended
  `echothink/0017-workspace-context-shell.patch` after T15)
- `docs/echothink-browser-alpha/t17-implement-workspace-context-shell.md`
  (new task note)
- `docs/ungoogled_to_echothink_browser_change_plan.md`
- `docs/echothink_browser_construction.md`
- `docs/progress.md` (this file)

Prerequisite status:

- T17 depends on T15; T15 is marked `DONE`.
- The canonical-root mismatch is carried forward: documentation lives under
  `echothink-studio-new/docs`; the extension source and patch artifacts live in
  the inherited browser root beside `patches/` and `extensions/`.

Implementation decisions:

- Kept Workspace Context mode inside the bundled MV3 extension shell instead of
  adding native Chromium UI or state plumbing.
- Added containers for current project context, App Domain context, Task Wave
  status, agent console entry, pending approvals, recent artifacts, project
  navigation, notifications, and quick actions.
- Each container has stable `data-context-section` markup, default unavailable
  copy, status/title targets, an item list target, and an action target.
- Added a generic text-only renderer that can consume a structured snapshot
  already available in extension-local storage under
  `echothink.workspaceContext.snapshot` or an internal extension message of type
  `echothink.workspaceContext.update`.
- The renderer writes through `textContent`, caps displayed item/action counts,
  and only creates links for Echothink-owned HTTPS origins:
  `app.echothink.ai`, `auth.echothink.ai`, and `search.echothink.ai`.
- Did not add service fetching, project/task/approval/artifact/business
  decisions, quick-action execution, workflow orchestration, conversation
  persistence, sync storage, native messaging, externally connectable messaging,
  privileged bridges, new permissions, new host permissions, token/private-key
  exposure, or Web Store replacement behavior.
- Network stack, TLS validation, sandbox, renderer internals, downloads,
  history, bookmarks, password manager, cookies, and DevTools were untouched.

Validation commands and results:

| Command | Result |
|---|---|
| `rtk rg -n "^\\| T15 \\|.*DONE" echothink-studio-new/docs/progress.md` | Passed: prerequisite T15 is marked `DONE`. |
| `rtk python3 -m json.tool extensions/echothink-workspace/manifest.json` | Passed: manifest JSON parses. |
| `rtk node --check extensions/echothink-workspace/background.js` | Passed. |
| `rtk node --check extensions/echothink-workspace/content_bridge.js` | Passed. |
| `rtk node --check extensions/echothink-workspace/sidepanel.js` | Passed. |
| Node manifest shape check | Passed: MV3, `side_panel.default_path`, action title, exact permissions, exact host permissions, no `update_url`, and no forbidden broad permissions matched expectations. |
| Node Workspace Context shell contract check | Passed: all required `data-context-section` containers are present, the renderer includes the storage/message snapshot hooks, Echothink-only link allowlist, and no `fetch`, `XMLHttpRequest`, `WebSocket`, `nativeMessaging`, `cookies`, `history`, `bookmarks`, or `downloads` surface. |
| `rtk git apply --numstat patches/echothink/0017-workspace-context-shell.patch` | Passed: unified diff parses cleanly; reports 130 insertions / 14 deletions in `sidepanel.css`, 161 insertions / 19 deletions in `sidepanel.html`, and 250 insertions in `sidepanel.js`. |
| `rtk python3 devutils/check_patch_files.py` | Passed, exit 0. |
| `rtk python3 devutils/validate_config.py` | Passed, exit 0. |
| `rtk python3 devutils/check_gn_flags.py` | Passed, exit 0. |
| `rtk git diff --check` | Passed: no whitespace errors. |

Build-pipeline application command (deferred; no local Chromium checkout):

- `patch -p1 < patches/echothink/0017-workspace-context-shell.patch` from the
  pinned Chromium `148.0.7778.178` source root after inherited patches,
  `echothink/0004-bundled-workspace-extension.patch`,
  `echothink/0014-side-panel-container.patch`, and
  `echothink/0015-side-panel-mode-selector.patch`, or
  `python3 devutils/validate_patches.py --local <unmodified-chromium-src>`.

Known limitations:

- No local Chromium source checkout or browser build exists here, so real
  `patch -p1` application and runtime Side Panel smoke testing were not run.
- A built browser still needs to verify that switching to Workspace Context
  shows the required containers and that later service integration can populate
  the structured snapshot.
- Backend context retrieval, request proof, device identity, workflow
  execution, approval decisions, artifact ranking, and quick-action execution
  remain later tasks. Side Panel local setup/error states are handled by T18.

## T18 Notes

Changed files:

- `extensions/echothink-workspace/content_bridge.js` (narrow first-party
  `side_panel_state` forwarding)
- `extensions/echothink-workspace/sidepanel.html` (shared local-state card and
  protected-content markers)
- `extensions/echothink-workspace/sidepanel.css` (local-state card,
  protected-content pending/hidden behavior, and Workspace Context wrapper)
- `extensions/echothink-workspace/sidepanel.js` (local-state storage,
  rendering, response mapping, offline/online handling, and protected-content
  reset behavior)
- `patches/echothink/0018-side-panel-local-states.patch` (new Echothink patch)
- `patches/series` (appended `echothink/0018-side-panel-local-states.patch`
  after T16/T17)
- `docs/echothink-browser-alpha/t18-add-side-panel-local-states.md`
- `docs/ungoogled_to_echothink_browser_change_plan.md`
- `docs/echothink_browser_construction.md`
- `docs/progress.md` (this file)

Prerequisite status:

- T18 depends on T16 and T17; both are marked `DONE`.
- The canonical-root mismatch is carried forward: documentation lives under
  `echothink-studio-new/docs`; extension source and active patch artifacts live
  in the inherited browser root beside `extensions/` and `patches/`.

Implementation decisions:

- Kept setup/error state handling inside the bundled MV3 Side Panel shell
  rather than adding native Chromium UI, backend services, or gateway logic.
- Added local state values `signed_out`, `no_device_identity`,
  `unauthorized_scope`, `offline`, and `remote_service_error`.
- Stores the current local state in profile-local extension storage under
  `echothink.sidePanel.localState`. Offline state is derived from browser
  online/offline events and is not persisted.
- Added a shared state card outside the mode panels so both Chat Panel and
  Workspace Context can show the same setup/error state while the mode selector
  remains visible.
- Added `data-protected-content` gates. `signed_out`, `no_device_identity`, and
  `unauthorized_scope` hide and reset protected Chat transcript/composer and
  service-rendered Workspace Context content.
- Added recovery actions for sign-in, device enrollment, support, and retry as
  appropriate for each state.
- Chat response mapping now treats `401` as signed out, `403` as unauthorized
  scope, `412`/`428` or device/enrollment error headers as missing device
  identity, and network/service failures as offline or remote service error.
- Workspace Context snapshots may provide `local_state` or `localState`; a
  blocking state prevents service-provided content from rendering.
- The existing first-party content bridge can forward only local state updates
  from `https://app.echothink.ai` and `https://auth.echothink.ai` using
  `side_panel_state`. It does not expose tokens, device keys, private keys,
  proof payloads, or privileged browser APIs.
- The extension manifest was not changed. No new permissions, host
  permissions, native messaging, broad bridge, Web Store replacement path,
  backend business logic, workflow execution, request proof handling, token or
  private-key handling, network stack, TLS validation, sandbox, renderer
  internals, downloads, history, bookmarks, password manager, cookies, or
  DevTools behavior changed.

Validation commands and results:

| Command | Result |
|---|---|
| `rtk rg -n "^\\| T1[67] \\|.*DONE" echothink-studio-new/docs/progress.md` | Passed: prerequisites T16 and T17 are marked `DONE`. |
| `rtk python3 -m json.tool extensions/echothink-workspace/manifest.json` | Passed: manifest JSON parses. |
| `rtk node --check extensions/echothink-workspace/background.js` | Passed. |
| `rtk node --check extensions/echothink-workspace/content_bridge.js` | Passed. |
| `rtk node --check extensions/echothink-workspace/sidepanel.js` | Passed. |
| Node local-state contract check | Passed: all five state values, protected-content gates, recovery actions, bridge state message, exact permissions, exact host permissions, and missing `update_url` matched expectations. |
| `rtk rg -n -e Authorization -e Bearer -e access_token -e refresh_token -e privateKey -e private_key -e DPoP extensions/echothink-workspace/sidepanel.html extensions/echothink-workspace/sidepanel.js extensions/echothink-workspace/content_bridge.js` | Exited 1 as expected: no token, private-key, authorization-header, or DPoP handling exists in Side Panel source. |
| `rtk git apply --numstat patches/echothink/0018-side-panel-local-states.patch` | Passed: unified diff parses cleanly; reports 35 insertions / 14 deletions in `content_bridge.js`, 63 insertions in `sidepanel.css`, 186 insertions / 162 deletions in `sidepanel.html`, and 383 insertions / 23 deletions in `sidepanel.js`. |
| `rtk python3 devutils/check_patch_files.py` | Passed, exit 0. |
| `rtk python3 devutils/validate_config.py` | Passed, exit 0. |
| `rtk python3 devutils/check_gn_flags.py` | Passed, exit 0. |
| `rtk git diff --check` | Passed: no whitespace errors. |

Build-pipeline application command (deferred; no local Chromium checkout):

- `patch -p1 < patches/echothink/0018-side-panel-local-states.patch` from the
  pinned Chromium `148.0.7778.178` source root after inherited patches,
  `echothink/0004-bundled-workspace-extension.patch`,
  `echothink/0014-side-panel-container.patch`,
  `echothink/0015-side-panel-mode-selector.patch`,
  `echothink/0017-workspace-context-shell.patch`, and
  `echothink/0016-chat-panel-shell.patch`, or
  `python3 devutils/validate_patches.py --local <unmodified-chromium-src>`.

Known limitations:

- No local Chromium source checkout or browser build exists here, so real
  `patch -p1` application and runtime Side Panel state smoke testing were not
  run.
- T18 provides local display/protection behavior only. Authoritative login
  readiness, device identity, device bridge APIs, request proof signing, and
  backend authorization remain later tasks.
- A built browser still needs to verify each state visually in both modes and
  confirm recovery links open the expected Echothink-owned destinations.

## T30 Notes

Changed documentation:

- `docs/echothink-browser-alpha/t30-define-windows-app-identity-and-channels.md`
  (new task note)
- `docs/ungoogled_to_echothink_browser_change_plan.md`
- `docs/echothink_browser_construction.md`
- `docs/progress.md`

Prerequisite status:

- T30 depends on T05 and T06; both are `DONE`.
- The canonical-root mismatch is carried forward for this docs-only spec:
  documentation lives under `echothink-studio-new/docs`; patches and assets live
  at the inherited build root one directory up.

Packaging identity decisions:

- Base Windows application display name, Stable Start Menu shortcut, Stable
  desktop shortcut if created, and Apps & Features / uninstall display name:
  `Echothink Browser`.
- Start Menu folder: `Echothink`.
- Installer stem: `EchothinkBrowserSetup`; channelized artifacts may use names
  such as `EchothinkBrowserSetup-Dev-x64.exe`.
- Channel IDs and labels are fixed as `canary` / `Canary`, `dev` / `Dev`,
  `beta` / `Beta`, `stable` / `Stable`, and `enterprise-stable` /
  `Enterprise Stable`.
- Alpha is not a channel; Alpha builds should use `dev` by default or `canary`
  for short-lived experimental packaging tests.
- Alpha must use Echothink user-visible product, installer, shortcut, uninstall,
  and icon identity but may keep low-level Chromium-derived executable/internal
  identifiers if renaming them increases patch risk.
- Public Beta must complete user-visible Windows shell branding, channel-specific
  app/update IDs, uninstall keys, install directories where needed, final
  installer artwork, signed update metadata, and About/version channel labeling.

Concrete paths linked by the spec:

- `patches/echothink/0001-branding.patch`
- `patches/extra/ungoogled-chromium/add-extra-channel-info.patch`
- `patches/echothink/0002-default-policies-and-preferences.patch`
- `assets/icons/echothink.ico`
- `assets/installer/echothink-setup.ico`
- `assets/installer/README.md`

Validation commands and results:

| Command | Result |
|---|---|
| `rg -n "^\\| T0[56] \\|.*DONE" echothink-studio-new/docs/progress.md` | Passed; T05 and T06 are marked `DONE`. |
| Path checks for `patches/echothink/0001-branding.patch`, `patches/extra/ungoogled-chromium/add-extra-channel-info.patch`, `patches/echothink/0002-default-policies-and-preferences.patch`, `assets/icons/echothink.ico`, and `assets/installer/echothink-setup.ico` | Passed; all required local anchor paths exist. |
| `rg -n "EchothinkBrowserSetup|Enterprise Stable|enterprise-stable|Alpha Versus Beta Branding Tradeoff|Update-Channel Metadata Contract|Smoke-Test Expectations" docs/echothink-browser-alpha/t30-define-windows-app-identity-and-channels.md` | Passed. |
| `rg -n "t30-define-windows-app-identity-and-channels|Packaging metadata carries the canonical channel ID|Channel-specific Windows app identity" docs/ungoogled_to_echothink_browser_change_plan.md docs/echothink_browser_construction.md docs/progress.md` | Passed. |

Known limitations:

- No Chromium source checkout existed locally during T30. T31 later implemented
  the active patch against `chrome/app/theme/chromium/BRANDING` and
  `chrome/install_static/chromium_install_modes.h`; real application against
  pinned Chromium `148.0.7778.178` remains deferred to a source checkout.
- No Windows installer technology has been selected and no installer was built
  or run in this environment.
- Backend availability of `updates.echothink.ai` and
  `app.echothink.ai/download-browser` was not validated; these are packaging
  route contracts only.

## T20 Notes

Changed documentation:

- `docs/echothink-browser-alpha/t20-define-login-gate-local-state-and-allowlist.md`
- `docs/progress.md`

Prerequisite status:

- T20 depends on T10 and T11.
- T10 is marked `DONE` in this file.
- T11 is not marked `DONE`, has no row in this file, and has no task note under
  `docs/echothink-browser-alpha/`.
- T20 is therefore `BLOCKED` until T11 is completed or this file explicitly
  records T11 as an acceptable baseline dependency satisfied by T10's
  first-run shell work.

Blocked work:

- No login-gate local state spec was authored.
- No unauthenticated navigation allowlist was finalized.
- No blocked-navigation behavior was defined.
- No setup completion criteria were defined.
- No diagnostics/support exceptions were finalized.
- No patch, backend logic, gateway logic, network stack, TLS, sandbox,
  renderer, downloads, history, bookmarks, password manager, cookies, or
  DevTools behavior was changed.

Validation commands and results:

| Command | Result |
|---|---|
| `rtk rg -n "^\\| T10 \\|.*DONE|^\\| T20 \\|.*BLOCKED|^\\| T11 \\|" docs/progress.md` | Passed for T10 and T20; no T11 row was found. |
| `rtk rg -n "^\\| T11 \\|" docs/progress.md` | Exited 1 as expected: no T11 progress row exists. |
| `rtk rg -n "### T11: Add First-Run Shell|### T20: Define Login Gate State And Allowlist" docs/dag-doc.md` | Passed: the DAG defines T11 and T20, and T20 depends on T10 and T11. |
| `rtk rg -n "echothink/0003-new-tab-and-first-run.patch" ../patches/series` | Passed: T10's patch is active in the inherited patch series. |
| `rtk rg -n "Status: BLOCKED|T11 is not marked|No login-gate spec was authored|T21 must not consume" docs/echothink-browser-alpha/t20-define-login-gate-local-state-and-allowlist.md` | Passed: the T20 task note records the blocker and prevents downstream implementation from treating it as a spec. |
| `rtk git diff --check` | Passed: no whitespace errors. |

Known limitations:

- This is a blocker record, not the M4 login-gate spec.
- T21 must not use the T20 task note as authorization to implement
  `patches/echothink/0006-login-gate.patch`.
- The `chrome://echothink-diagnostics` route is referenced by T10, but its
  diagnostics WebUI ownership and readiness still need to be resolved before it
  can be relied on as a final login-gate exception.

## T11 Notes

Changed files:

- `patches/echothink/0011-first-run-gate-shell.patch` (new Echothink patch)
- `patches/series` (appended `echothink/0011-first-run-gate-shell.patch` to the
  Echothink tail block after `echothink/0005-default-search-provider.patch`)
- `docs/echothink-browser-alpha/t11-add-first-run-shell.md` (new task note)
- `docs/progress.md` (this file)

Native files the patch touches:

- `chrome/browser/chrome_browser_main.cc` (gate the first-run `AddFirstRunTabs`
  block so the Echothink first-run shell is the sole first-run tab)

Prerequisite status:

- T11 depends on T10; T10 is marked `DONE`. The canonical-root mismatch (T00) is
  carried forward: the patch and `patches/series` live in the inherited tree one
  directory up, while this note lives under `echothink-studio-new/docs`.

Scope boundaries (avoids overlap / patch collision):

- T10 (`0003`) owns the shell **page** `chrome://echothink-first-run` and opening
  it on first run additively.
- T11 (this task, `0011`) owns the first-run **gate**: on first launch present
  ONLY the gate shell; suppress the inherited `chrome://ungoogled-first-run`
  how-to tab and the normal-profile workspace / New Tab tabs
  (`master_prefs_->new_tabs`) before setup.
- T20 (spec) + T21 (`0006-login-gate.patch`) own the ongoing login gate:
  auth/device readiness flags, the unauthenticated navigation allowlist,
  blocked-navigation enforcement + explanation page, and restoring normal
  browsing after setup. T11 deliberately adds no navigation interception.

Implementation decisions:

- Reuse the existing `chrome://echothink-first-run` shell (no second page), per
  the brief ("reuse the New Tab fallback style where possible", "keep the shell
  minimal and service-oriented"). The shell is static, script-free, renders
  offline, links only to sign-in / device enrollment / diagnostics / update /
  support/download, and embeds no workspace or business data.
- Single narrow edit inside `if (first_run::IsChromeFirstRun())`: replace the
  three `AddFirstRunTabs` calls (echothink shell + inherited how-to + workspace
  tabs) with a single call that opens only the echothink shell. The inherited
  `--app`/`--app-id` guard is preserved; non-first-run startup is untouched; a
  New Tab still resolves to `https://app.echothink.ai/newtab` (seeded by `0002`).
- Patch number `0011` chosen to avoid the change plan's reserved band
  (`0004` = bundled extension / T13, parallel in W4; `0006` = login gate / T21;
  `0007`–`0010` = device identity / request proof / echo router / packaging).
  Series order, not the integer, governs application: `0011` sorts after `0003`,
  so the first-run block `0003` introduced is present when `0011` applies.

Validation commands and results (run from the inherited repository root):

| Command | Result |
|---|---|
| `git apply --numstat patches/echothink/0011-first-run-gate-shell.patch` | Passed (exit 0): `12 3 chrome/browser/chrome_browser_main.cc`. |
| `python3 devutils/check_patch_files.py` | Passed (exit 0): patch parses, referenced in series, no duplicates, no unused. |
| `python3 devutils/check_gn_flags.py` | Passed (exit 0). |
| `python3 devutils/validate_config.py` | Passed (exit 0; clean on POSIX). |
| Series file-mapping loop | `missing_count=0`; Echothink tail `0001, 0002, 0003, 0005, 0011`, contiguous after all inherited patches. |
| Real `patch -p1` against a reconstructed post-`0003` `chrome_browser_main.cc` | Passed: dry-run exit 0, applied cleanly; resulting first-run block contains only `AddFirstRunTabs({GURL("chrome://echothink-first-run")})`, with the `ungoogled-first-run` and `master_prefs_->new_tabs` lines removed. |

Build-pipeline application command (deferred; no local Chromium checkout):

- `patch -p1 < patches/echothink/0011-first-run-gate-shell.patch` from the pinned
  Chromium 148.0.7778.178 source root after inherited patches and after
  `echothink/0001..0003`, or
  `python3 devutils/validate_patches.py --local <unmodified-chromium-src>`.

Known limitations:

- No full Chromium source checkout locally, so real `patch -p1` was validated
  against a reconstructed post-`0003` fragment, not the full pinned tree, and no
  runtime browser smoke test was run. Exact `@@` offsets must be confirmed at
  build time; `patch -p1` fuzzy matching should absorb small drift.
- First-run *presentation* gate only — no ongoing navigation blocking until T21
  lands `echothink/0006-login-gate.patch`.
- Suppressing `master_prefs_->new_tabs` at first run also suppresses any
  enterprise-configured `first_run_tabs` for that first launch (intentional for a
  gated first launch; noted for T30/T31 packaging).
- `chrome://echothink-diagnostics` (referenced by the reused shell) remains a
  known dead `chrome://` link until its owning task lands.

## T28 Notes

Changed files:

- `patches/echothink/0009-echo-protocol-router.patch` (new Echothink patch)
- `patches/series` (inserted `echothink/0009-echo-protocol-router.patch` in
  the active Echothink tail before `echothink/0010-windows-packaging-identity.patch`)
- `docs/echothink-browser-alpha/t28-implement-optional-resolver.md` (new task note)
- `docs/echothink_browser_construction.md` (recorded active Alpha resolver)
- `docs/progress.md` (this file)

Prerequisite status:

- T28 depends on T10.
- T10 is marked `DONE` and its active patch
  `patches/echothink/0003-new-tab-and-first-run.patch` remains listed in
  `patches/series`.
- The canonical-root mismatch (T00) is carried forward: docs live under
  `echothink-studio-new/docs`, while active browser patches and `patches/series`
  live in the inherited browser root one directory up.

Implementation decisions:

- Added a narrow resolver in `chrome/browser/ui/browser_navigator.cc` inside the
  desktop `NavigateParams` path, before custom `echo://` navigations fall through
  to Chromium external-protocol handling.
- Valid route shapes map only to `https://app.echothink.ai/` paths:
  `dashboard`, `project/{id}`, `task-wave/{id}`,
  `app-domain/{domain}/{instance}`, `artifact/{id}`, and `approval/{id}`.
- Route segments must be non-empty and contain only unreserved ASCII
  characters. Query strings and fragments are rejected; `echo://dashboard/` is
  accepted only as a host-only dashboard canonicalization alias.
- The resolver clears the original `echo://` referrer before loading the HTTPS
  destination.
- The patch adds no content protocol, local workspace page, backend service,
  authorization decision, device proof, session handling, or protected data.
  HTTPS app/gateway services still own user authorization and device proof.
- Unsupported/invalid route UI is deliberately deferred to T29, which owns the
  local invalid `echo://` fallback page.

Validation commands and results:

| Command | Result |
|---|---|
| `rtk git apply --numstat patches/echothink/0009-echo-protocol-router.patch` | Passed: `96 0 chrome/browser/ui/browser_navigator.cc`. |
| `rtk python3 devutils/check_patch_files.py` | Passed, exit 0. |
| `rtk python3 devutils/check_gn_flags.py` | Passed, exit 0. |
| `rtk python3 devutils/validate_config.py` | Passed, exit 0. |
| `rtk patch -p1 -i .../patches/echothink/0009-echo-protocol-router.patch` from `/private/tmp/echothink-t28-chromium` with the pinned Chromium `148.0.7778.178` `browser_navigator.cc` file | Passed: patch applied cleanly to the fetched pinned source file. |

Build-pipeline application command:

- `patch -p1 -i patches/echothink/0009-echo-protocol-router.patch` from the
  pinned Chromium `148.0.7778.178` source root after inherited patches and active
  Echothink predecessors have applied.

Known limitations:

- No full Chromium source checkout, compile, or runtime browser smoke test was
  run in this environment.
- T28 does not provide invalid-route UX; T29 owns the local invalid
  `echo://` fallback page.
- The browser-side mapper intentionally does not accept query strings,
  fragments, encoded path separators, or non-unreserved path characters.

## T29 Notes

Changed files:

- `patches/echothink/0012-invalid-echo-route-fallback.patch` (new Echothink patch)
- `patches/series` (inserted `echothink/0012-invalid-echo-route-fallback.patch`
  immediately after `echothink/0009-echo-protocol-router.patch`)
- `docs/echothink-browser-alpha/t29-add-invalid-fallback-page.md` (new task note)
- `docs/ungoogled_to_echothink_browser_change_plan.md` (recorded active invalid
  route fallback behavior)
- `docs/echothink_browser_construction.md` (recorded active invalid route
  fallback patch)
- `docs/progress.md` (this file)

Prerequisite status:

- T29 depends on T28.
- T28 is marked `DONE` and its active patch
  `patches/echothink/0009-echo-protocol-router.patch` remains listed in
  `patches/series`.
- The canonical-root mismatch (T00) is carried forward: docs live under
  `echothink-studio-new/docs`, while active browser patches and `patches/series`
  live in the inherited browser root one directory up.

Implementation decisions:

- Added `patches/echothink/0012-invalid-echo-route-fallback.patch` as the T29
  patch rather than changing T28 retroactively.
- Valid `echo://` routes still resolve through T28's `ResolveEchoURL()` mapping.
- Unsupported or invalid `echo://` routes now rewrite to the local
  `chrome://echothink-invalid-echo` WebUI page.
- The fallback rewrite clears the original `echo://` referrer and does not place
  the original route, route segments, query string, or fragment in the fallback
  URL.
- The fallback page is static, script-free, served from an in-memory
  URLDataSource, and registered alongside the existing Echothink first-run
  local WebUI.
- The page does not display workspace data, project IDs, task-wave IDs,
  app-domain values, artifact IDs, approval IDs, queries, fragments, or the
  original route. It links only to `https://app.echothink.ai/dashboard`,
  `chrome://echothink-first-run`, and `https://app.echothink.ai/support`.
- No backend authorization, device proof, gateway logic, search ranking, chat
  orchestration, workflow orchestration, network stack, TLS validation, sandbox,
  renderer internals, downloads, history, bookmarks, password manager, cookies,
  or DevTools behavior changed.

Validation commands and results:

| Command | Result |
|---|---|
| `rtk git apply --numstat patches/echothink/0012-invalid-echo-route-fallback.patch` | Passed: `20 6 chrome/browser/ui/browser_navigator.cc`, `111 0 chrome/browser/ui/webui/echothink_invalid_echo.h`, `2 0 chrome/browser/ui/webui/chrome_web_ui_configs.cc`, `1 0 chrome/common/webui_url_constants.cc`. |
| `rtk python3 devutils/check_patch_files.py` | Passed, exit 0. |
| `rtk python3 devutils/check_gn_flags.py` | Passed, exit 0. |
| `rtk python3 devutils/validate_config.py` | Passed, exit 0. |
| `rtk git apply --check --include=chrome/browser/ui/browser_navigator.cc .../patches/echothink/0012-invalid-echo-route-fallback.patch` from `/private/tmp/echothink-t28-chromium` | Passed against the existing post-T28 `browser_navigator.cc` source copy. |

Build-pipeline application command:

- `patch -p1 -i patches/echothink/0012-invalid-echo-route-fallback.patch` from
  the pinned Chromium `148.0.7778.178` source root after inherited patches and
  active Echothink predecessors through
  `echothink/0009-echo-protocol-router.patch` have applied.

Known limitations:

- No full Chromium source checkout, compile, or runtime browser smoke test was
  run in this environment.
- Full `patch -p1` application against Chromium source was not run because this
  environment only had the T28 `browser_navigator.cc` source copy available,
  not the WebUI registration source files.
- A built browser still needs to verify that invalid examples such as
  `echo://unknown`, `echo://project`, `echo://project/secret?token=1`, and
  `echo://artifact/private#frag` show `chrome://echothink-invalid-echo` while
  valid examples such as `echo://dashboard` still resolve to HTTPS app routes.

## T31 Notes

Changed files:

- `patches/echothink/0010-windows-packaging-identity.patch`
- `patches/series`
- `docs/echothink-browser-alpha/t31-implement-windows-packaging-identity-patch.md`
- `docs/ungoogled_to_echothink_browser_change_plan.md`
- `docs/echothink_browser_construction.md`
- `docs/progress.md`

Prerequisite status:

- T31 depends on T30; T30 is marked `DONE`.
- T30's prerequisite chain to T05 and T06 is already complete. T05 supplies the
  product-string baseline, and T06 supplies `assets/icons/echothink.ico` and
  `assets/installer/echothink-setup.ico`.

Implementation decisions:

- Created the active Windows packaging identity patch at
  `patches/echothink/0010-windows-packaging-identity.patch`.
- Appended `echothink/0010-windows-packaging-identity.patch` to the active
  Echothink tail in `patches/series` after
  `echothink/0011-first-run-gate-shell.patch`.
- Implemented the Alpha default as T30's `dev` track:
  `Echothink Browser Dev` for Windows shell/app identity,
  `Echothink\\Browser Dev\\Application` install path components,
  `Software\\Echothink\\Browser Dev` installer registry roots,
  `Echothink Browser Setup` / `EchothinkBrowserSetup` installer metadata, and
  `Echothink Browser Dev` in `chrome://version` build labels. Machine-readable
  update/package channel metadata remains T32 because Chromium's non-Google
  install mode reports an empty runtime channel.
- Preserved Alpha's low-risk executable/internal-name boundary: no rename of
  `chrome.exe`, `chrome_proxy.exe`, `setup.exe`, or `mini_installer.exe`; no
  sandbox ID, COM GUID, app container SID prefix, update-mechanic, network,
  TLS, renderer, downloads, history, bookmarks, password-manager, cookie, or
  DevTools changes.
- Documented mini-installer icon handoff to
  `assets/installer/echothink-setup.ico` but did not embed binary icon deltas
  in the unified-diff patch.

Validation commands and results:

| Command | Result |
|---|---|
| `rtk ls -l patches/echothink/0010-windows-packaging-identity.patch assets/icons/echothink.ico assets/installer/echothink-setup.ico` | Passed: patch and required icon assets exist. |
| `rtk rg -n "echothink/0010-windows-packaging-identity.patch" patches/series` | Passed: active series entry present. |
| `rtk rg -n "Echothink Browser Dev|EchothinkBrowserSetup|Browser Dev|Software\\\\Echothink" patches/echothink/0010-windows-packaging-identity.patch` | Passed: expected identity strings present. |
| `rtk git apply --numstat patches/echothink/0010-windows-packaging-identity.patch` | Passed: patch parses cleanly; six source files touched. |
| `rtk python3 devutils/check_patch_files.py` | Passed, exit 0. |
| `rtk python3 devutils/check_gn_flags.py` | Passed, exit 0. |
| `rtk python3 devutils/validate_config.py` | Passed, exit 0. |

Build-pipeline application command (deferred; no local Chromium checkout):

- `patch -p1 < patches/echothink/0010-windows-packaging-identity.patch` from the
  pinned Chromium `148.0.7778.178` source root after inherited patches and
  earlier active Echothink patches have applied.

Known limitations:

- No local Chromium source checkout exists, so real patch application against
  the pinned source and a Windows compile were not run.
- No installer was built or installed here. Start Menu, taskbar, Apps &
  Features, UAC/file-description, uninstall, and icon smoke tests remain T32/T36.
- Full side-by-side Canary/Beta/Stable/Enterprise Stable install modes still
  need implementation after T32's release metadata ID reservations.

## T21 Notes

Changed documentation:

- `docs/echothink-browser-alpha/t21-implement-login-required-startup-gate.md`
- `docs/progress.md`

Prerequisite status:

- T21 depends on T20.
- T20 is not marked `DONE` in this shared progress file. Its row is `READY` and
  says the M4 login-gate spec is still pending.
- The current T20 task note remains a blocker note and explicitly says no
  login-gate spec was authored and that T21 must not consume it as authorization
  to implement `patches/echothink/0006-login-gate.patch`.

Blocked result:

- T21 is marked `BLOCKED`.
- No `patches/echothink/0006-login-gate.patch` file was created.
- `patches/series` was not changed.
- No navigation throttles, WebUI pages, readiness flags, setup-completion
  signals, backend services, gateway logic, search ranking, chat orchestration,
  workflow orchestration, business pages, network stack, TLS validation,
  sandbox, renderer internals, downloads, history, bookmarks, password manager,
  cookies, or DevTools behavior were changed.

Missing prerequisite decisions:

- Local auth and device readiness flags: storage surface, names, defaults,
  profile/local-state behavior, and reset behavior.
- Exact unauthenticated navigation allowlist: schemes, origins, and paths for
  login, enrollment, diagnostics, update, support, and download routes.
- Blocked-navigation behavior: local explanation page URL, redirect timing, and
  navigation types in scope.
- Setup completion criteria and browser-side signal that restores normal
  Chromium browsing.
- Exceptions for `chrome://` pages, diagnostics, support, update, app mode,
  incognito, guest, and enterprise-managed startup surfaces.

Validation commands and results:

| Command | Result |
|---|---|
| `rtk rg -n "\\| T20 \\|.*\\| DONE \\|" echothink-studio-new/docs/progress.md` | Failed as expected: T20 is not marked `DONE`. |
| `rtk rg -n "\\| T20 \\|.*READY|T21 must not implement|Still pending" echothink-studio-new/docs/progress.md` | Passed: progress records T20 as `READY`, records the pending spec, and blocks T21 from implementing `0006`. |
| `rtk rg -n "No login-gate spec was authored|T21 must not consume|0006-login-gate" echothink-studio-new/docs/echothink-browser-alpha/t20-define-login-gate-local-state-and-allowlist.md` | Passed: the T20 note is not the final implementation spec. |
| `rtk ls -l patches/echothink/0006-login-gate.patch` | Failed as expected: no blocked patch artifact exists. |
| `rtk rg -n "echothink/0006-login-gate.patch" patches/series` | Failed as expected: inactive blocked patch is not listed in the active patch pipeline. |
| `rtk git diff --check -- echothink-studio-new/docs/progress.md echothink-studio-new/docs/echothink-browser-alpha/t21-implement-login-required-startup-gate.md` | Passed, exit 0. |

Known limitations:

- T21 delivery criteria remain unmet until T20 is completed and the login gate
  patch can be implemented and validated.
- No runtime browser smoke test was run because no implementation patch exists
  in this blocked pass.

## T22 Notes

Changed documentation:

- `docs/echothink-browser-alpha/t22-define-device-identity-and-dpapi-storage.md`
- `docs/progress.md`

Prerequisite status:

- T22 depends on T00 and T20.
- T00 is marked `DONE`.
- T20 is not marked `DONE`; the task-status table marks it `READY`, and the T20
  task note still records `Status: BLOCKED` with no login-gate spec authored.
- No progress entry or task note explicitly accepts incomplete T20 as a baseline
  dependency for T22.

Blocked work:

- No local device identity fields were defined.
- No Windows DPAPI private-key storage format was defined.
- No profile preference versus Local State placement was selected for
  non-secret device metadata.
- No reset/logout behavior was defined.
- No native bridge boundary was defined for keeping private key material out of
  extension JavaScript.
- No patch, extension code, backend service, gateway logic, network stack, TLS,
  sandbox, renderer, downloads, history, bookmarks, password manager, cookies,
  DevTools behavior, key material, token, or proof internals were changed or
  exposed.

Missing prerequisite decisions from T20:

- Local auth/device readiness flags and their storage surface.
- Final unauthenticated navigation allowlist.
- Blocked-navigation behavior and local recovery surface.
- Setup-completion criteria after login and device verification.
- Diagnostics/support exceptions, including the status of
  `chrome://echothink-diagnostics`.
- Reset/logout semantics for non-secret enrollment state.

Validation commands and results:

| Command | Result |
|---|---|
| `rtk rg -n "^\\| T00 \\|[^|]*\\|[^|]*\\|[^|]*\\| DONE \\|" echothink-studio-new/docs/progress.md` | Passed: T00 is marked `DONE` in the status column. |
| `rtk rg -n "^\\| T20 \\|[^|]*\\|[^|]*\\|[^|]*\\| DONE \\|" echothink-studio-new/docs/progress.md` | Exited 1 as expected: T20 is not marked `DONE` in the status column. |
| `rtk rg -n "^\\| T20 \\|[^|]*\\|[^|]*\\|[^|]*\\| READY \\||Status: BLOCKED|No login-gate spec was authored" echothink-studio-new/docs/progress.md echothink-studio-new/docs/echothink-browser-alpha/t20-define-login-gate-local-state-and-allowlist.md` | Passed: T20 is only ready/incomplete in progress and still blocked in the task note. |
| `rtk rg -n "### T22: Define Device Identity And DPAPI Storage|Prerequisites: T00, T20|DPAPI" echothink-studio-new/docs/dag-doc.md echothink-studio-new/docs/ungoogled_to_echothink_browser_change_plan.md echothink-studio-new/docs/echothink_browser_construction.md` | Passed: T22 scope and DPAPI source anchors exist. |
| `rtk ls -l echothink-studio-new/docs/echothink-browser-alpha/t22-define-device-identity-and-dpapi-storage.md echothink-studio-new/docs/echothink-browser-alpha/t20-define-login-gate-local-state-and-allowlist.md echothink-studio-new/docs/progress.md` | Passed: the T22 note, T20 note, and shared progress file exist. |
| `rtk git diff --check` | Passed: no whitespace errors. |

Known limitations:

- This is a blocker record, not the M5 device identity design.
- T23 must not use the T22 task note as authorization to implement
  `patches/echothink/0007-device-identity.patch`.
- The broader browser Alpha docs were left unchanged because no T22 design
  decisions are complete yet.

## T23 Notes

Changed documentation:

- `docs/echothink-browser-alpha/t23-implement-device-key-generation-and-storage.md`
- `docs/progress.md`

Prerequisite status:

- T23 depends on T22.
- T22 is not marked `DONE`; the task-status table marks it `BLOCKED`, and the
  T22 task note explicitly says T23 must not use it as authorization to
  implement `patches/echothink/0007-device-identity.patch`.
- No progress entry or task note explicitly accepts incomplete T22 as a baseline
  dependency for T23.

Blocked work:

- No Chromium implementation patch was created.
- No asymmetric key generation, DPAPI storage, metadata persistence, restart
  loading, or reset behavior was implemented.
- No `echothink/0007-device-identity.patch` entry was added to
  `patches/series`.
- No extension bridge API, request proof helper, backend service, gateway
  logic, network stack, TLS, sandbox, renderer, downloads, history, bookmarks,
  password manager, cookies, or DevTools behavior was changed.
- No private key material, access token, or proof internals were exposed.

Missing prerequisite decisions from T22:

- Local device identity fields and meanings.
- Windows DPAPI private-key storage format and scope.
- Placement for non-secret device metadata.
- Persistence behavior across browser restart.
- Explicit reset behavior for local enrollment state.
- Native bridge boundary that keeps private key material out of extension
  JavaScript, logs, docs examples, and progress notes.

Upstream T20 decisions still needed before T22 can complete:

- Local auth/device readiness flags and their storage surface.
- Final unauthenticated navigation allowlist.
- Blocked-navigation behavior and local recovery surface.
- Setup-completion criteria after login and device verification.
- Diagnostics/support exceptions, including the status of
  `chrome://echothink-diagnostics`.
- Reset/logout semantics for non-secret enrollment state.

Validation commands and results:

| Command | Result |
|---|---|
| `rtk rg -n "^\\| T22 \\|[^|]*\\|[^|]*\\|[^|]*\\| DONE \\|" echothink-studio-new/docs/progress.md` | Exited 1 as expected: T22 is not marked `DONE` in the status column. |
| `rtk rg -n "^\\| T22 \\|[^|]*\\|[^|]*\\|[^|]*\\| BLOCKED \\||T23 must not use" echothink-studio-new/docs/progress.md echothink-studio-new/docs/echothink-browser-alpha/t22-define-device-identity-and-dpapi-storage.md` | Passed: progress and the T22 note block T23. |
| `rtk rg -n "### T23: Implement Device Key Generation And Storage|Prerequisites: T22|0007-device-identity.patch" echothink-studio-new/docs/dag-doc.md echothink-studio-new/docs/ungoogled_to_echothink_browser_change_plan.md echothink-studio-new/docs/echothink_browser_construction.md` | Passed: T23 scope and delivery target anchors exist. |
| `rtk ls -l patches/echothink/0007-device-identity.patch` | Failed as expected: no blocked patch artifact was created. |
| `rtk rg -n "echothink/0007-device-identity.patch" patches/series` | Failed as expected: inactive blocked patch is not listed in the active patch pipeline. |
| `rtk ls -l echothink-studio-new/docs/echothink-browser-alpha/t23-implement-device-key-generation-and-storage.md echothink-studio-new/docs/progress.md` | Passed: the T23 note and shared progress file exist. |
| `rtk git diff --check` | Passed: no whitespace errors. |

Known limitations:

- This is a blocker record, not the M5 device identity implementation.
- T23 delivery criteria remain unmet until T22 is completed and
  `patches/echothink/0007-device-identity.patch` can be implemented and
  validated.
- No runtime persistence or reset smoke test was run because no implementation
  patch exists in this blocked pass.

## T24 Notes

Changed documentation:

- `docs/echothink-browser-alpha/t24-implement-narrow-extension-bridge.md`
- `docs/progress.md`

Prerequisite status:

- T24 depends on T13 and T23.
- T13 is marked `DONE` and supplies the bundled workspace extension ID
  `lokdibgfmiemhdoogailbfpdggndpolk` with narrow manifest permissions.
- T23 is not marked `DONE`; the task-status table marks it `BLOCKED`, and the
  T23 task note explicitly says no Chromium device identity patch was created.
- No progress entry or task note explicitly accepts incomplete T23 as a
  baseline dependency for T24.

Blocked work:

- No Chromium implementation patch was created.
- No extension bridge API was exposed for `getDeviceStatus`,
  `requestEnrollmentChallenge`, `signProofPayload`, or `clearEnrollment`.
- No bridge patch entry was added to `patches/series`.
- No extension manifest or permission changes were made.
- No broad host permissions, `nativeMessaging`, management APIs, or
  general-purpose privileged bridge were added.
- No backend service, gateway logic, search ranking, chat orchestration,
  workflow orchestration, business page, network stack, TLS, sandbox, renderer,
  downloads, history, bookmarks, password manager, cookies, or DevTools
  behavior was changed.
- No private key material, access token, or proof internals were exposed.

Missing prerequisite work from T23:

- `patches/echothink/0007-device-identity.patch`.
- `echothink/0007-device-identity.patch` entry in `patches/series`.
- Asymmetric key generation and DPAPI private-key storage.
- Device metadata persistence and restart loading.
- Explicit reset behavior.
- Native private-key boundary that the extension bridge can call without
  exposing key material to JavaScript.

Upstream T22/T20 decisions still needed before T23 can complete:

- Local device identity fields and meanings.
- Windows DPAPI private-key storage format and scope.
- Placement for non-secret device metadata.
- Local auth/device readiness flags and their storage surface.
- Setup-completion and reset/logout semantics for enrollment state.

Validation commands and results:

| Command | Result |
|---|---|
| `rtk rg -n "^\\| T24 \\|[^|]*\\|[^|]*\\|[^|]*\\| DONE \\|" echothink-studio-new/docs/progress.md` | Exited 1 as expected: T24 is not marked `DONE` in the status column. |
| `rtk ls -l echothink-studio-new/docs/echothink-browser-alpha/t24-implement-narrow-extension-bridge.md` | Passed: the T24 note exists. |
| `rtk rg -n "^\\| T23 \\|[^|]*\\|[^|]*\\|[^|]*\\| BLOCKED \\|" echothink-studio-new/docs/progress.md` | Passed: upstream T23 is blocked. |
| `rtk rg -n "### T24: Implement Narrow Extension Bridge|Prerequisites: T13, T23|getDeviceStatus|signProofPayload" echothink-studio-new/docs/dag-doc.md echothink-studio-new/docs/ungoogled_to_echothink_browser_change_plan.md` | Passed: T24 scope and bridge method anchors exist. |
| `rtk ls -l patches/echothink/0007-device-identity.patch` | Failed as expected: no prerequisite device identity patch exists. |
| `rtk rg -n "echothink/0007-device-identity.patch" patches/series` | Failed as expected: inactive blocked patch is not listed in the active patch pipeline. |
| `rtk python3 -m json.tool extensions/echothink-workspace/manifest.json` | Passed: source manifest parses as JSON. |
| `rtk git diff --check` | Passed: no whitespace errors. |

Known limitations:

- This is a blocker record, not the M5 device bridge API implementation.
- T24 delivery criteria remain unmet until T23 is completed and the bridge can
  be implemented against the real device-key storage boundary.
- No runtime extension bridge smoke test was run because no bridge patch exists
  in this blocked pass.

## T25 Notes

Changed documentation:

- `docs/echothink-browser-alpha/t25-define-request-proof-payload-and-allowlist.md`
- `docs/progress.md`

Prerequisite status:

- T25 depends on T24.
- T24 is marked `BLOCKED`; its task note exists at
  `docs/echothink-browser-alpha/t24-implement-narrow-extension-bridge.md`.
- T24's upstream dependency chain is blocked because T23 remains `BLOCKED`.
- No progress entry or task note explicitly accepts incomplete T24 as a
  baseline dependency for T25.

Blocked work:

- No proof helper spec was authored.
- No canonical request-proof payload field ordering, normalization, or required
  versus optional fields were defined.
- No Echothink-domain signing allowlist was defined.
- No third-party destination rejection behavior was defined.
- No browser-side signing-only responsibility boundary was defined.
- No backend-owned replay protection or proof-validation responsibility was
  defined.
- No Chromium patch, extension code, backend service, gateway logic, network
  stack, TLS validation, sandbox, renderer internals, downloads, history,
  bookmarks, password manager, cookies, or DevTools behavior was changed.
- No private key material, access token, signed proof, or proof internals were
  exposed.

Missing prerequisite work from T24:

- Deliver the narrow bridge implementation artifact, including any required
  `patches/echothink/` patch and `patches/series` entry if T24 is delivered as
  a Chromium patch.
- Confirm the bridge methods available to the bundled workspace extension.
- Confirm the caller restriction to the fixed bundled workspace extension
  identity.
- Confirm the bridge error model for missing device, locked key, unsupported
  platform, and explicit reset.
- Confirm the boundary that allows signature requests without exposing private
  key material to extension JavaScript, logs, docs examples, or progress notes.

Upstream dependency chain still needed before T24 can complete:

- T23 must implement device key generation and storage.
- T22 must define device identity and DPAPI storage.
- T20 must complete the login-gate local state and allowlist spec.

Validation commands and results:

| Command | Result |
|---|---|
| `rtk rg -n "^\\| T24 \\|[^|]*\\|[^|]*\\|[^|]*\\| DONE \\|" echothink-studio-new/docs/progress.md` | Exited 1 as expected: T24 is not marked `DONE` in the status column. |
| `rtk rg -n "^\\| T24 \\|[^|]*\\|[^|]*\\|[^|]*\\| BLOCKED \\|" echothink-studio-new/docs/progress.md` | Passed: T24 is marked `BLOCKED`. |
| `rtk ls -l echothink-studio-new/docs/echothink-browser-alpha/t24-implement-narrow-extension-bridge.md` | Passed: T24 task note exists. |
| `rtk rg -n "^\\| T23 \\|[^|]*\\|[^|]*\\|[^|]*\\| BLOCKED \\|" echothink-studio-new/docs/progress.md` | Passed: upstream T23 is blocked. |
| `rtk rg -n "### T24: Implement Narrow Extension Bridge|### T25: Define Request Proof Payload And Allowlist|Prerequisites: T24" echothink-studio-new/docs/dag-doc.md` | Passed: DAG anchors for T24 and T25 exist. |
| `rtk ls -l echothink-studio-new/docs/echothink-browser-alpha/t25-define-request-proof-payload-and-allowlist.md echothink-studio-new/docs/progress.md` | Passed: the T25 note and shared progress file exist. |
| `rtk git diff --check` | Passed: no whitespace errors. |

Known limitations:

- This is a blocker record, not the M5 proof helper spec.
- T26 must not use the T25 task note as authorization to implement
  `patches/echothink/0008-request-proof-helper.patch`.
- The broader browser Alpha docs were left unchanged because no T25 design
  decisions are complete yet.

## T26 Notes

Changed documentation:

- `docs/echothink-browser-alpha/t26-implement-proof-signing-helper.md`
- `docs/progress.md`

Prerequisite status:

- T26 depends on T25.
- T25 is not marked `DONE`; `docs/progress.md` marks it `BLOCKED`.
- The T25 task note is a blocker note, not the final M5 proof helper spec, and
  explicitly says T26 must not use it as authorization to implement
  `patches/echothink/0008-request-proof-helper.patch`.
- No progress entry or task note explicitly accepts incomplete T25 as a
  baseline dependency for T26.

Blocked work:

- No proof signing helper patch was authored.
- No canonical payload acceptance, signing allowlist enforcement, malformed
  payload rejection, or third-party URL rejection was implemented.
- No helper result shape was implemented or exposed.
- No Chromium patch, extension code, backend service, gateway logic, network
  stack, TLS validation, sandbox, renderer internals, downloads, history,
  bookmarks, password manager, cookies, or DevTools behavior was changed.
- No private key material, access token, signed proof contents, or proof
  internals were exposed.

Missing prerequisite work from T25:

- Define canonical request-proof payload fields, ordering, normalization, and
  required versus optional fields.
- Define the Echothink destination signing allowlist.
- Define rejection behavior for third-party destinations and malformed payloads.
- Define browser-side signing-only responsibilities.
- Define backend-owned replay protection and proof-validation responsibilities.
- Define safe signature/proof result fields without exposing private key
  material, access tokens, or proof internals.

Upstream dependency chain still needed before T25 can complete:

- T24 must implement the narrow extension bridge and restrict it to the bundled
  workspace extension.
- T23 must implement device key generation and storage.
- T22 must define device identity and DPAPI storage.
- T20 must complete the login-gate local state and allowlist spec.

Validation commands and results:

| Command | Result |
|---|---|
| `rtk rg -n "^\\| T25 \\|[^|]*\\|[^|]*\\|[^|]*\\| DONE \\|" echothink-studio-new/docs/progress.md` | Exited 1 as expected: T25 is not marked `DONE` in the status column. |
| `rtk rg -n "^\\| T25 \\|[^|]*\\|[^|]*\\|[^|]*\\| BLOCKED \\|" echothink-studio-new/docs/progress.md` | Passed: progress marks T25 `BLOCKED`. |
| `rtk rg -n "Status: BLOCKED|T26 must not use" echothink-studio-new/docs/echothink-browser-alpha/t25-define-request-proof-payload-and-allowlist.md` | Passed: the T25 note is a blocker note and explicitly blocks T26 implementation. |
| `rtk ls -l echothink-studio-new/docs/echothink-browser-alpha/t24-implement-narrow-extension-bridge.md` | Passed: T24 task note exists. |
| `rtk ls -l patches/echothink/0008-request-proof-helper.patch` | Failed as expected: no blocked patch artifact was created. |
| `rtk rg -n "echothink/0008-request-proof-helper.patch" patches/series` | Exited 1 as expected: inactive blocked patch is not listed in the active patch pipeline. |
| `rtk ls -l echothink-studio-new/docs/echothink-browser-alpha/t26-implement-proof-signing-helper.md echothink-studio-new/docs/progress.md` | Passed: the T26 note and shared progress file exist. |
| `rtk git diff --check` | Passed: no whitespace errors. |

Known limitations:

- This is a blocker record, not the M5 proof signing helper implementation.
- T26 delivery criteria remain unmet until T25 is completed and
  `patches/echothink/0008-request-proof-helper.patch` can be implemented and
  validated.
- No signing helper tests or runtime proof smoke tests were run because no
  implementation patch exists in this blocked pass.

## T27 Notes

Changed documentation:

- `docs/echothink-browser-alpha/t27-integrate-proof-helper-into-extension-calls.md`
- `docs/progress.md`

Prerequisite status:

- T27 depends on T16, T24, and T26.
- T16 is marked `DONE` and provides the current Side Panel chat request path.
- T24 is marked `BLOCKED`; its task note exists at
  `docs/echothink-browser-alpha/t24-implement-narrow-extension-bridge.md`.
- T26 is marked `BLOCKED`; no final proof signing helper implementation exists
  and no `patches/echothink/0008-request-proof-helper.patch` exists.
- No progress entry or task note explicitly accepts incomplete T24 or T26 as a
  baseline dependency for T27.

Blocked work:

- No extension API calls were updated to request proof signatures.
- No proof headers, proof metadata, `Authorization`, or `DPoP` headers were
  attached to Echothink API/chat calls.
- No signing-error UI state was added to the Side Panel because the bridge error
  model and helper result shape are undefined.
- No extension files, manifest permissions, host permissions, Chromium patch
  files, or `patches/series` entries were changed.
- No backend service, gateway logic, search ranking, chat orchestration,
  workflow orchestration, business page, network stack, TLS validation, sandbox,
  renderer internals, downloads, history, bookmarks, password manager, cookies,
  or DevTools behavior was changed.
- No private key material, access tokens, proof payloads, signed proof values,
  or proof internals were exposed in JavaScript, logs, docs examples, or
  progress notes.

Missing prerequisite work from T24 and T26:

- Deliver the T24 narrow bridge implementation artifact, including any required
  `patches/echothink/` patch and `patches/series` entry if T24 is delivered as
  a Chromium patch.
- Confirm the bridge method name and call shape available to the bundled
  workspace extension.
- Confirm the caller restriction to fixed extension ID
  `lokdibgfmiemhdoogailbfpdggndpolk`.
- Complete T25's request-proof payload and allowlist spec.
- Implement T26's proof signing helper in
  `patches/echothink/0008-request-proof-helper.patch` and add the patch to
  `patches/series`.
- Define the proof result shape, destination allowlist, header/metadata
  contract, and recoverable signing error model that T27 must consume.

Validation commands and results:

| Command | Result |
|---|---|
| `rtk rg -n "^\\| T16 \\|[^|]*\\|[^|]*\\|[^|]*\\| DONE \\|" echothink-studio-new/docs/progress.md` | Passed: T16 is marked `DONE`. |
| `rtk rg -n "^\\| T24 \\|[^|]*\\|[^|]*\\|[^|]*\\| DONE \\|" echothink-studio-new/docs/progress.md` | Exited 1 as expected: T24 is not marked `DONE`. |
| `rtk ls -l echothink-studio-new/docs/echothink-browser-alpha/t24-implement-narrow-extension-bridge.md` | Passed: T24 task note exists. |
| `rtk rg -n "^\\| T26 \\|[^|]*\\|[^|]*\\|[^|]*\\| BLOCKED \\|" echothink-studio-new/docs/progress.md` | Passed: T26 is marked `BLOCKED`. |
| `rtk ls -l patches/echothink/0008-request-proof-helper.patch` | Failed as expected: no proof helper patch exists. |
| `rtk rg -n "echothink/0008-request-proof-helper.patch" patches/series` | Exited 1 as expected: inactive blocked patch is not listed in the active patch pipeline. |
| `rtk python3 -m json.tool extensions/echothink-workspace/manifest.json` | Passed: manifest JSON parses. |
| Node manifest shape check | Passed: MV3, `side_panel.default_path`, exact narrow permissions, exact Echothink host permissions, no `update_url`, and no broad or forbidden permissions. |
| `rtk node --check extensions/echothink-workspace/background.js` | Passed. |
| `rtk node --check extensions/echothink-workspace/content_bridge.js` | Passed. |
| `rtk node --check extensions/echothink-workspace/sidepanel.js` | Passed. |
| `rtk rg -n -e Authorization -e Bearer -e access_token -e refresh_token -e privateKey -e private_key -e DPoP -e signed_request_proof extensions/echothink-workspace` | Exited 1 as expected: extension source contains no token, private-key, authorization-header, DPoP, or signed-proof handling. |
| `rtk ls -l echothink-studio-new/docs/echothink-browser-alpha/t27-integrate-proof-helper-into-extension-calls.md echothink-studio-new/docs/progress.md` | Passed: the T27 note and shared progress file exist. |
| `rtk git diff --check` | Passed: no whitespace errors. |

Known limitations:

- This is a blocker record, not the M5 proof-capable extension implementation.
- T27 delivery criteria remain unmet until T24 and T26 are complete.
- No runtime Side Panel signing-error smoke test was run because no extension
  bridge or proof signing helper exists in this blocked pass.
- The broader browser Alpha docs were left unchanged because no T27 integration
  design or implementation decisions are complete yet.

## T32 Notes

Changed documentation:

- `docs/echothink-browser-alpha/t32-add-windows-build-signing-smoke-docs.md`
- `docs/ungoogled_to_echothink_browser_change_plan.md`
- `docs/echothink_browser_construction.md`
- `docs/progress.md`

Prerequisite status:

- T32 depends on T30 and T31; both are marked `DONE`.
- T30 supplies Windows identity, channel, installer naming, and update metadata
  contracts.
- T31 supplies the active Alpha Dev packaging identity patch at
  `patches/echothink/0010-windows-packaging-identity.patch`.

Implementation decisions:

- Created the Windows Alpha release runbook under `docs/` only, per the T32
  docs-only constraint. The planned `build/windows/` path remains a future home
  for scripts or duplicated release docs when non-doc artifact creation is
  allowed.
- Selected Chromium `mini_installer` as the Alpha installer path. The signed
  distributable artifact shape is
  `EchothinkBrowserSetup-Dev-x64-148.0.7778.178-alpha.<build>.exe`.
- Documented Windows build preparation from the canonical browser build root,
  inherited patch application, domain substitution, asset staging for
  `assets/installer/echothink-setup.ico` and `assets/icons/echothink.ico`, GN
  generation, and `chrome mini_installer` build targets.
- Documented signing with Windows SDK `signtool`, timestamping, hash capture,
  runtime-binary signing expectations, and internal-only limits for unsigned or
  test-signed builds.
- Documented sidecar update-channel metadata for Alpha Dev and reserved stable
  per-channel metadata IDs for Canary, Dev, Beta, Stable, and Enterprise Stable.
- Documented the manual smoke test procedure for launch, branding, New Tab,
  Side Panel, search, restart persistence, update-channel metadata, and
  uninstall.

Validation commands and results:

| Command | Result |
|---|---|
| `rtk rg -n "^\\| T3[01] \\|.*DONE" docs/progress.md` | Passed: T30 and T31 are marked `DONE`. |
| `rtk ls -l docs/echothink-browser-alpha/t30-define-windows-app-identity-and-channels.md docs/echothink-browser-alpha/t31-implement-windows-packaging-identity-patch.md docs/echothink-browser-alpha/t32-add-windows-build-signing-smoke-docs.md ../patches/echothink/0010-windows-packaging-identity.patch ../assets/icons/echothink.ico ../assets/installer/echothink-setup.ico` | Passed: required docs, patch, and icon assets exist. |
| `rtk rg -n "Build Procedure|Signing Workflow|Update-Channel Notes|Smoke Test Procedure|Alpha Candidate Release Checklist|uninstall|restart" docs/echothink-browser-alpha/t32-add-windows-build-signing-smoke-docs.md` | Passed. |
| `rtk rg -n "Echothink Browser Dev|\"channel\": \"dev\"|e81ee626-9e29-52ac-ad5d-ff669f8e65b1|21b7be8b-f85e-53f5-8e90-189d16d3b6d7|assets/icons/echothink.ico|assets/installer/echothink-setup.ico" docs/echothink-browser-alpha/t32-add-windows-build-signing-smoke-docs.md` | Passed: Alpha Dev names, channel metadata, and asset references are present. |
| `rtk rg -n "t32-add-windows-build-signing-smoke-docs|restart|uninstall" docs/ungoogled_to_echothink_browser_change_plan.md docs/echothink_browser_construction.md` | Passed. |
| `rtk git diff --check` | Passed: no whitespace errors. |

Known limitations:

- This environment is not Windows and has no local Chromium source checkout, so
  no real Windows build, signing, install, launch, restart, or uninstall smoke
  test was run.
- Alpha uses Chromium `mini_installer`; MSI/WiX, NSIS, Inno, public installer
  UI bitmaps, and a replacement auto-updater remain future release-pipeline
  work.
- T31 implements Alpha Dev identity only. The per-channel update/app IDs
  recorded by T32 are release metadata reservations until a later task wires
  full side-by-side install/update modes.
- App icon source paths must be verified during the first real Windows Chromium
  checkout/build. Shipping with Chromium taskbar or shortcut icons is an Alpha
  candidate blocker unless explicitly recorded as a known failed smoke item.

## T33 Notes

Changed documentation:

- `docs/echothink-browser-alpha/t33-run-full-patch-validation.md`
- `docs/progress.md`

Prerequisite status:

- T33 depends on T05, T08, T10, T13, T19, T21, T23, T26, and T31.
- T05, T08, T10, T13, T19, and T31 are marked `DONE`.
- T21 is marked `BLOCKED`; T20 is still only `READY`, and the final M4
  login-gate spec does not exist.
- T23 is marked `BLOCKED`; T22 is `BLOCKED`, and the final M5 device identity
  design does not exist.
- T26 is marked `BLOCKED`; T25 is `BLOCKED`, no final proof helper spec exists,
  and T24 has no progress row or task note.
- No progress row or task note explicitly accepts incomplete T21, T23, or T26
  as baseline dependencies for T33.

Blocked delivery criteria:

- Full patch application against pinned Chromium `148.0.7778.178` was not run
  because the required Alpha patch set is incomplete.
- T33 cannot confirm that all required Alpha patches apply cleanly until
  `patches/echothink/0006-login-gate.patch`,
  `patches/echothink/0007-device-identity.patch`, and
  `patches/echothink/0008-request-proof-helper.patch` exist and are active.
- No backend services, gateway logic, search ranking, chat orchestration,
  workflow orchestration, business pages, network stack, TLS validation,
  sandbox, renderer internals, downloads, history, bookmarks, password manager,
  cookies, or DevTools behavior was changed.

Current patch-series validation:

- Active series entries: 122.
- Inherited entries before the Echothink tail: 108.
- Echothink entries: 14.
- Last inherited entry:
  `extra/ungoogled-chromium/add-flag-for-disabling-jit.patch`.
- First Echothink entry: `echothink/0001-branding.patch`.
- Missing active series files: 0.
- Duplicate active series entries: 0.
- Existing Echothink entries form a contiguous tail after inherited patches.
- Required Alpha missing IDs:
  `echothink/0006-login-gate.patch`,
  `echothink/0007-device-identity.patch`,
  `echothink/0008-request-proof-helper.patch`.

Validation commands and results:

| Command | Result |
|---|---|
| `rtk rg -n "\\| T(05|08|10|13|19|21|23|26|31|33) \\|" echothink-studio-new/docs/progress.md` | Passed for prerequisite discovery: T05, T08, T10, T13, T19, and T31 are `DONE`; T21, T23, and T26 are `BLOCKED`; no prior T33 row existed. |
| `rtk sed -n '840,861p' echothink-studio-new/docs/dag-doc.md` | Passed: T33 requires T05, T08, T10, T13, T19, T21, T23, T26, and T31. |
| `rtk ls -l patches/echothink/0006-login-gate.patch patches/echothink/0007-device-identity.patch patches/echothink/0008-request-proof-helper.patch` | Failed as expected: all three required blocked patch artifacts are missing. |
| `rtk rg -n "echothink/0006-login-gate.patch|echothink/0007-device-identity.patch|echothink/0008-request-proof-helper.patch" patches/series` | Exited 1 as expected: inactive missing patches are not listed in the active pipeline. |
| Series structure Python check | Passed for current active series: `entries=122`, `inherited=108`, `echothink=14`, `missing_series_files=0`, `duplicates=0`, `echothink_tail_ok=True`; reported required Alpha missing IDs `0006`, `0007`, and `0008`. |
| `rtk python3 devutils/check_patch_files.py` | Passed, exit 0, for the current active incomplete series. |
| `rtk python3 devutils/check_gn_flags.py` | Passed, exit 0. |
| `rtk python3 devutils/validate_config.py` | Passed, exit 0, for the current active incomplete series. |

Known limitations:

- This is a blocker record, not the final M7 patch validation report.
- T34, T35, and T37 must remain blocked on T33 until T21, T23, and T26 are
  complete and T33 is rerun.

## T34 Notes

Changed documentation:

- `docs/echothink-browser-alpha/t34-run-native-browser-regression-suite.md`
- `docs/progress.md`

Prerequisite status:

- T34 depends on T33.
- T33 is marked `BLOCKED`, not `DONE`.
- No progress row or task note explicitly accepts blocked T33 as an acceptable
  baseline dependency for T34.
- T33 is blocked by T21, T23, and T26. The missing active artifacts are
  `patches/echothink/0006-login-gate.patch`,
  `patches/echothink/0007-device-identity.patch`, and
  `patches/echothink/0008-request-proof-helper.patch`.

Blocked delivery criteria:

- The native browser regression suite was not run.
- No browser binary was launched.
- Runtime behavior was not validated for native tabs, windows, popups, history,
  downloads, bookmarks, password manager, cookies, local storage, TLS, DevTools,
  or extension loading.
- T34 cannot confirm that no blocker native regressions remain until T33
  completes and a runnable, fully validated browser build exists.

Chromium-native ownership:

- T34 made no browser patch, source, extension, asset, or packaging changes.
- T34 did not replace Chromium primitives or touch network stack, TLS
  validation, sandbox, renderer internals, downloads, history, bookmarks,
  password manager, cookies, local storage, or DevTools.
- Runtime Chromium-native ownership remains unconfirmed because the regression
  suite could not start while T33 is blocked.

Validation commands and results:

| Command | Result |
|---|---|
| `rtk rg -n "^\\| T33 \\|.*\\| DONE \\|" echothink-studio-new/docs/progress.md` | Exited 1 as expected: T33 is not marked `DONE`. |
| `rtk rg -n "^\\| T33 \\|.*\\| BLOCKED \\|" echothink-studio-new/docs/progress.md` | Passed: T33 is marked `BLOCKED`. |
| `rtk sed -n '860,878p' echothink-studio-new/docs/dag-doc.md` | Passed: T34 depends on T33 and requires the native browser regression report. |
| `rtk ls patches/echothink` | Passed: existing Echothink patches are listed, and `0006`, `0007`, and `0008` are absent. |
| `rtk rg -n "echothink/0006-login-gate.patch|echothink/0007-device-identity.patch|echothink/0008-request-proof-helper.patch" patches/series` | Exited 1 as expected: inactive missing patches are not listed in the active pipeline. |
| `rtk git diff --check` | Passed: no whitespace errors. |

Known limitations:

- This is a blocker regression report, not the final passing M7 native
  regression report.
- T34 must remain blocked until T33 is completed after T21, T23, and T26 are
  complete.

## T35 Notes

Changed documentation:

- `docs/echothink-browser-alpha/t35-run-echothink-behavior-tests.md`
- `docs/progress.md`

Prerequisite status:

- T35 depends on T33.
- T33 is marked `BLOCKED`, not `DONE`.
- T33 records that T34, T35, and T37 must remain blocked until T21, T23, and
  T26 are complete and T33 is rerun.
- No progress row or task note explicitly accepts incomplete T33 as a baseline
  dependency for T35.

Blocked delivery criteria:

- No M7 Echothink behavior test pass was run.
- No validated full Alpha browser candidate exists for this behavior pass,
  because T33 did not complete full inherited-plus-Echothink patch validation.
- Login gate and allowlist behavior cannot pass because
  `patches/echothink/0006-login-gate.patch` does not exist.
- Device identity persistence cannot pass because
  `patches/echothink/0007-device-identity.patch` does not exist.
- Proof-helper URL allowlist signing cannot pass because
  `patches/echothink/0008-request-proof-helper.patch` does not exist.

Behavior test status:

| Behavior | Result |
|---|---|
| Echothink branding | Not run: T35 blocked on T33. |
| New Tab route and fallback | Not run: T35 blocked on T33. |
| Default search and suggest route | Not run: T35 blocked on T33. |
| Side Panel opens | Not run: T35 blocked on T33. |
| Chat and Workspace Context modes | Not run: T35 blocked on T33. |
| Chat scope metadata | Not run: T35 blocked on T33. |
| Login gate and allowlist behavior | Blocked: no `0006-login-gate.patch`. |
| Device identity persistence | Blocked: no `0007-device-identity.patch`. |
| Proof helper signs only allowed Echothink URLs | Blocked: no `0008-request-proof-helper.patch`. |
| Optional `echo://` routes | Not run: T35 blocked on T33. |

Validation commands and results:

| Command | Result |
|---|---|
| `rtk rg -n "^\\| T33 \\|[^|]*\\|[^|]*\\|[^|]*\\| DONE \\|" echothink-studio-new/docs/progress.md` | Exited 1 as expected: T33 is not marked `DONE`. |
| `rtk rg -n "^\\| T33 \\|[^|]*\\|[^|]*\\|[^|]*\\| BLOCKED \\|" echothink-studio-new/docs/progress.md` | Passed: progress marks T33 `BLOCKED`. |
| `rtk rg -n "T34, T35, and T37 must remain blocked on T33|Status: BLOCKED" echothink-studio-new/docs/echothink-browser-alpha/t33-run-full-patch-validation.md` | Passed: the T33 task note blocks T35. |
| `rtk ls -l patches/echothink/0006-login-gate.patch patches/echothink/0007-device-identity.patch patches/echothink/0008-request-proof-helper.patch` | Failed as expected: all three required behavior-blocking patch artifacts are missing. |
| `rtk rg -n "echothink/0006-login-gate.patch|echothink/0007-device-identity.patch|echothink/0008-request-proof-helper.patch" patches/series` | Exited 1 as expected: inactive missing patches are not listed in the active patch pipeline. |
| `rtk ls -l echothink-studio-new/docs/echothink-browser-alpha/t35-run-echothink-behavior-tests.md echothink-studio-new/docs/progress.md` | Passed: the T35 note and shared progress file exist. |
| `rtk git diff --check` | Passed: no whitespace errors. |
| `rtk rg -n "[[:blank:]]$" echothink-studio-new/docs/progress.md echothink-studio-new/docs/echothink-browser-alpha/t35-run-echothink-behavior-tests.md` | Exited 1 as expected: no trailing whitespace in the changed docs. |

Known limitations:

- This is a blocker record, not the final M7 behavior test report.
- T35 cannot mark any required Alpha behavior as passed until T33 is complete
  and the browser behavior pass runs against a validated candidate.

## T36 Notes

Changed documentation:

- `docs/echothink-browser-alpha/t36-run-windows-packaging-smoke-test.md`
- `docs/progress.md`

Prerequisite status:

- T36 depends on T31, T32, and T35.
- T31 is marked `DONE`; the active Windows Alpha Dev identity patch exists at
  `patches/echothink/0010-windows-packaging-identity.patch`.
- T32 is marked `DONE`; the Windows Alpha runbook records build, signing,
  update-channel metadata, smoke, restart, and uninstall procedure.
- T35 is marked `BLOCKED`, not `DONE`.
- No progress row or task note explicitly accepts incomplete T35 as a baseline
  dependency for T36.

Blocked delivery criteria:

- No Windows installer was installed on a clean Windows machine.
- No Start Menu launch was performed.
- No installed app name, taskbar/window icon, Apps & Features entry,
  `chrome://version` output, or uninstall surface was inspected.
- New Tab, default search, Side Panel open behavior, and Side Panel mode
  persistence after restart were not runtime-smoked because no validated Alpha
  candidate exists after T35.
- Install, update-channel, and signing observations were not captured from a
  signed `EchothinkBrowserSetup` artifact.

Local packaging anchors confirmed:

- T31/T32 define Alpha Dev Windows identity as `Echothink Browser Dev`.
- Installer artifact shape remains
  `EchothinkBrowserSetup-Dev-x64-148.0.7778.178-alpha.<build>.exe`.
- App icon source remains `assets/icons/echothink.ico`.
- Setup icon source remains `assets/installer/echothink-setup.ico`.
- Update sidecar shape remains
  `EchothinkBrowserSetup-Dev-x64-148.0.7778.178-alpha.<build>.channel.json`.
- Dev metadata IDs remain
  `e81ee626-9e29-52ac-ad5d-ff669f8e65b1` and
  `21b7be8b-f85e-53f5-8e90-189d16d3b6d7`.

Validation commands and results:

| Command | Result |
|---|---|
| `rtk rg -n "^\\| T(31|32|35) \\|" echothink-studio-new/docs/progress.md` | Passed for prerequisite discovery: T31 and T32 are `DONE`; T35 is `BLOCKED`. |
| `rtk rg -n "^Status: BLOCKED|T33 is blocked|0006-login-gate|0007-device-identity|0008-request-proof-helper" echothink-studio-new/docs/echothink-browser-alpha/t35-run-echothink-behavior-tests.md` | Passed: T35 records the blocking missing artifacts. |
| `rtk ls -l patches/echothink/0006-login-gate.patch patches/echothink/0007-device-identity.patch patches/echothink/0008-request-proof-helper.patch` | Failed as expected: all three required blocked patch artifacts are missing. |
| `rtk ls -l patches/echothink/0010-windows-packaging-identity.patch assets/icons/echothink.ico assets/installer/echothink-setup.ico` | Passed: T31 patch and T06/T32 icon inputs exist. |
| `rtk rg -n "Echothink Browser Dev|EchothinkBrowserSetup|Software\\\\Echothink\\\\Browser Dev" patches/echothink/0010-windows-packaging-identity.patch` | Passed: Windows Alpha Dev identity strings are present in the packaging patch. |
| `rtk rg -n "Smoke Test Procedure|Launch and branding|New Tab|Side Panel|Search|Restart persistence|Update-channel metadata|Uninstall" echothink-studio-new/docs/echothink-browser-alpha/t32-add-windows-build-signing-smoke-docs.md` | Passed: T32 contains the Windows smoke procedure T36 should run after unblock. |

Known limitations:

- This is a blocker smoke report, not a passing M7 Windows smoke report.
- This environment is not a clean Windows machine and no signed
  `EchothinkBrowserSetup` installer was available, so install, launch, restart,
  and uninstall were not runnable.
- T36 remains blocked until T35 is `DONE` or explicitly accepted as a baseline
  dependency by a future task owner.
