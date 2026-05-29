# Echothink Browser Alpha Progress

Last updated: 2026-05-29 (T36 Windows packaging smoke — prior prerequisite block RESOLVED (T31/T32/T35 all DONE, 0008 present); static packaging-readiness dry run PASS, but live install/launch/restart/uninstall smoke NOT RUN — macOS host, no Windows build/installer — so T36 stays BLOCKED on the build/host environment only, not on any browser-repository artifact)

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
| T20 | W4 | Define login gate local state and allowlist | T10, T11 | DONE | Task note updated at `docs/echothink-browser-alpha/t20-define-login-gate-local-state-and-allowlist.md`. Prerequisites T10 and T11 are both `DONE`. The M4 login-gate spec now defines non-secret profile readiness preferences (`echothink.auth.session_ready`, `echothink.device.enrolled`, `echothink.device.verified`, `echothink.setup.complete`, completion/block diagnostic timestamps), an explicit unauthenticated top-level navigation allowlist, blocked-navigation behavior that redirects to `chrome://echothink-first-run` without leaking blocked URLs, setup-completion criteria, reset/logout behavior, and diagnostics/support exceptions. `chrome://echothink-diagnostics` remains allowlisted but known dead until its owning task implements it. No Chromium patch, backend service, gateway logic, network/TLS/sandbox/renderer/downloads/history/bookmarks/password/cookie/DevTools behavior changed. |
| T21 | W5 | Implement login-required startup gate | T20 | DONE | Created active patch `patches/echothink/0006-login-gate.patch` and inserted `echothink/0006-login-gate.patch` into `patches/series` after `echothink/0011-first-run-gate-shell.patch` and before the `echo://` navigation patches. The patch registers T20's non-secret readiness prefs, derives/caches `echothink.setup.complete`, routes pre-setup New Tab to `chrome://echothink-first-run`, rewrites browser-level blocked navigations to that local shell with referrer cleared, and allows only the explicit T20 setup/support/update/diagnostic routes until setup is complete. No backend service, gateway logic, search ranking, chat/workflow orchestration, business pages, network stack, TLS validation, sandbox, renderer internals, downloads, history, bookmarks, password manager, cookies, or DevTools behavior changed. Task note updated at `docs/echothink-browser-alpha/t21-implement-login-required-startup-gate.md`. |
| T22 | W5 | Define device identity and DPAPI storage | T00, T20 | DONE | Device identity design finalized at `docs/echothink-browser-alpha/t22-define-device-identity-and-dpapi-storage.md`. T00 and T20 are `DONE`. The design selects Windows DPAPI current-user storage for Alpha private key material, defines ECDSA P-256 / `ES256` device identity fields, splits non-secret metadata between Local State and profile prefs, documents restart persistence, sign-out, revocation, explicit local reset, and records bridge boundaries so extension JavaScript never receives private key material or DPAPI blobs. Broader docs now point to the T22 design as source of truth. No Chromium patch was created; T23 owns `patches/echothink/0007-device-identity.patch`. |
| T23 | W6 | Implement device key generation and storage | T22 | DONE | Created active patch `patches/echothink/0007-device-identity.patch` and inserted `echothink/0007-device-identity.patch` into `patches/series` immediately after `echothink/0006-login-gate.patch`. Patch adds `chrome/browser/echothink/device_identity/`, registers Local State/profile prefs, creates or reloads an ECDSA P-256 / `ES256` identity on Windows startup, protects private-key bytes with current-user Windows DPAPI in `User Data/Echothink Device Identity/device_key.dpapi`, stores only public/non-secret metadata, and provides `ResetLocalEnrollmentState` to delete the protected key file, rotate `installation_id`, clear enrollment metadata, and clear login-gate readiness prefs. No extension bridge/proof helper/backend/network/TLS/sandbox/renderer/downloads/history/bookmarks/password/cookie/DevTools changes; no key material, tokens, signed proof values, or proof internals exposed. Task note updated at `docs/echothink-browser-alpha/t23-implement-device-key-generation-and-storage.md`. |
| T24 | W7 | Implement narrow extension bridge | T13, T23 | DONE | Created active patch `patches/echothink/0024-narrow-extension-bridge.patch` and appended `echothink/0024-narrow-extension-bridge.patch` to `patches/series` after `echothink/0018-side-panel-local-states.patch`. The bridge exposes only `chrome.echothinkDevice.getDeviceStatus`, `requestEnrollmentChallenge`, `signProofPayload`, and `clearEnrollment`; `_api_features.json` allowlists only bundled extension ID `lokdibgfmiemhdoogailbfpdggndpolk` by hashed ID and disables generic component-extension auto-grant; native code also checks the exact caller ID. The extension manifest remains unchanged and narrow. No backend service, gateway logic, canonical request-proof policy, network/TLS/sandbox/renderer/downloads/history/bookmarks/password/cookie/DevTools behavior, private key bytes, DPAPI blobs, access tokens, or raw key handles were exposed. Task note: `docs/echothink-browser-alpha/t24-implement-narrow-extension-bridge.md`. |
| T25 | W8 | Define request proof payload and allowlist | T24 | DONE | Proof helper spec finalized at `docs/echothink-browser-alpha/t25-define-request-proof-payload-and-allowlist.md`. Prerequisite T24 is `DONE`. The spec defines canonical payload fields (`method`, `url`, `timestamp`, optional `nonce`, optional `access_token_hash`), field order and URL normalization, an exact Echothink HTTPS signing allowlist (`api.echothink.ai` `/v1/`, `auth.echothink.ai` `/browser/` and `/device/`, `app.echothink.ai` `/api/`), malformed and disallowed-destination rejection behavior, safe opaque proof result shape, browser-side signing-only responsibilities, and backend/gateway ownership of replay protection and proof validation. No patch, backend service, network/TLS/sandbox/renderer/downloads/history/bookmarks/password/cookie/DevTools behavior, private key material, access token, or proof internals were changed or exposed. |
| T26 | W9 | Implement proof signing helper | T25 | DONE | Created active patch `patches/echothink/0008-request-proof-helper.patch` and inserted `echothink/0008-request-proof-helper.patch` into `patches/series` immediately after `echothink/0024-narrow-extension-bridge.patch` (it modifies files the T24 bridge creates). The patch replaces the T24 opaque-string signing surface with the T25 canonical request-proof contract: `chrome.echothinkDevice.signProofPayload` now takes structured fields (`method`, `url`, `timestamp`, optional `nonce`, optional `access_token_hash`); new native `BuildCanonicalRequestProof()` (`chrome/browser/extensions/api/echothink_device/echothink_request_proof.{h,cc}`) validates field shape, enforces the exact Echothink HTTPS signing allowlist (`api.echothink.ai` `/v1/`, `auth.echothink.ai` `/browser/` and `/device/`, `app.echothink.ai` `/api/`), builds the canonical UTF-8 JSON in fixed field order, and only then signs the canonical bytes with the existing T24 `SignProofPayload()` device-key entry point. Malformed payloads return `invalid_payload`; third-party/sibling/lookalike/http/port/userinfo/IP destinations return `disallowed_destination` before any signature. Result is the safe opaque shape `{ok, proof_type:"echothink-request-proof-v1", proof, key_id, key_algorithm:"ES256", timestamp}`; no private key, DPAPI blob, raw token, canonical bytes, or bare signature is returned. No network stack, TLS validation, sandbox, renderer internals, downloads, history, bookmarks, password manager, cookies, or DevTools behavior changed; the extension manifest/host permissions are unchanged. Validated: `git apply --numstat`, real `patch -p1` against a reconstructed post-`echothink/0024` tree (applied tree byte-matches intended), `check_patch_files.py`, `check_gn_flags.py`, `validate_config.py` all exit 0, and a 29-case decision-table logic mirror (allowlisted signs, third-party/malformed rejected) passed 29/29. Runtime signing smoke deferred to T33-T35 (no local Chromium build). Task note: `docs/echothink-browser-alpha/t26-implement-proof-signing-helper.md`. |
| T27 | W10 | Integrate proof helper into extension calls | T16, T24, T26 | DONE | Created active patch `patches/echothink/0019-proof-capable-extension-calls.patch` and inserted `echothink/0019-proof-capable-extension-calls.patch` into `patches/series` immediately after `echothink/0008-request-proof-helper.patch`. Prerequisites T16, T24, and T26 are all `DONE`. The bundled Side Panel now requests a device proof through the T24 `chrome.echothinkDevice` bridge / T26 helper before its protected chat call and attaches the DPoP-style headers from `echothink_browser_construction.md` 5.7 (`DPoP: <opaque proof>`, `X-Echothink-Device-ID: <device_id>`) to `https://api.echothink.ai/v1/chat/stream`; the panel re-checks the T25 signing allowlist locally and never asks the bridge to sign a non-allowlisted destination. Signing failures map to recoverable Side Panel local states (`no_device_identity` for `missing_device`/`locked_key`/`reset`/`unauthorized_extension`; `remote_service_error` for `invalid_payload`/`disallowed_destination`/`bridge_error`) and the unproven request is not sent; an absent bridge (`unsupported_platform`) falls back to the existing cookie-authenticated call. No manifest permission/host-permission/`webRequest`/native-messaging changes; the chat call keeps `credentials: "include"` and adds no `Authorization` header; no private key, DPAPI blob, raw token, canonical bytes, bare signature, or proof value is logged or persisted. No network/TLS/sandbox/renderer/downloads/history/bookmarks/password/cookie/DevTools behavior changed. Validated: `node --check`, `git apply --numstat`, real `patch -p1` against a reconstructed resources base (applied file byte-matches edited source), `check_patch_files.py`/`check_gn_flags.py`/`validate_config.py` exit 0, manifest unchanged, secret/auth scan clean, and a 23-case decision-table logic mirror passed 23/23. Runtime proof-attachment smoke deferred to T33-T35 (no local Chromium build). Task note: `docs/echothink-browser-alpha/t27-integrate-proof-helper-into-extension-calls.md`. |
| T28 | W5 | Implement optional `echo://` resolver | T10 | DONE | Task note at `docs/echothink-browser-alpha/t28-implement-optional-resolver.md`. Prerequisite T10 is DONE. Created `patches/echothink/0009-echo-protocol-router.patch` and inserted `echothink/0009-echo-protocol-router.patch` into `patches/series` after `echothink/0011-first-run-gate-shell.patch` and before `echothink/0010-windows-packaging-identity.patch`. Patch adds a narrow `chrome/browser/ui/browser_navigator.cc` navigation helper that rewrites only known `echo://` route shapes (`dashboard`, `project/{id}`, `task-wave/{id}`, `app-domain/{domain}/{instance}`, `artifact/{id}`, `approval/{id}`) to matching `https://app.echothink.ai/` URLs, accepts only unreserved non-empty segments, rejects query/fragment payloads, and clears the `echo://` referrer. No backend authorization, device proof, protected content, network/TLS/sandbox/renderer/downloads/history/bookmarks/password/cookie/DevTools behavior changed. Unsupported/invalid route UX remains T29. Validated: `git apply --numstat`, `check_patch_files.py`, `check_gn_flags.py`, `validate_config.py`, and real `patch -p1` against the pinned Chromium `148.0.7778.178` `browser_navigator.cc` source copy all pass. |
| T29 | W6 | Add invalid `echo://` route fallback page | T28 | DONE | Task note at `docs/echothink-browser-alpha/t29-add-invalid-fallback-page.md`. Prerequisite T28 is DONE. Created `patches/echothink/0012-invalid-echo-route-fallback.patch` and inserted `echothink/0012-invalid-echo-route-fallback.patch` in `patches/series` immediately after `echothink/0009-echo-protocol-router.patch`. Patch keeps T28 valid route resolution intact and rewrites unsupported/invalid `echo://` navigations to local `chrome://echothink-invalid-echo`, clearing the original referrer and carrying no original route, segments, query, or fragment into the fallback URL or page. The WebUI page is static/script-free, contains no workspace/resource data, and links only to dashboard, setup, and support. No backend service, gateway logic, network/TLS/sandbox/renderer/downloads/history/bookmarks/password/cookie/DevTools behavior changed. Validated: `git apply --numstat`, `check_patch_files.py`, `check_gn_flags.py`, `validate_config.py`, and targeted `git apply --check --include=chrome/browser/ui/browser_navigator.cc` against the existing post-T28 source copy all pass. |
| T30 | W3 | Define Windows app identity and channels | T05, T06 | DONE | Windows packaging identity spec created at `docs/echothink-browser-alpha/t30-define-windows-app-identity-and-channels.md`. Prerequisites T05 and T06 are DONE. Defines Windows display/Start Menu/uninstall names, `EchothinkBrowserSetup` installer stem and channelized artifact names, channel IDs/labels for Canary, Dev, Beta, Stable, and Enterprise Stable, Alpha-versus-Beta branding requirements, update-channel metadata fields expected by packaging, and Windows smoke-test expectations. No patch or installer implementation was created. |
| T31 | W4 | Implement Windows packaging identity patch | T30 | DONE | Task note at `docs/echothink-browser-alpha/t31-implement-windows-packaging-identity-patch.md`. Prerequisite T30 is DONE. Created `patches/echothink/0010-windows-packaging-identity.patch` and appended `echothink/0010-windows-packaging-identity.patch` to `patches/series` after the active Echothink tail. Patch sets Alpha Dev Windows app/install identity through Chromium `BRANDING`, Windows install_static constants, installer registry roots, app shortcut folder text, mini-installer icon handoff documentation, and `chrome://version` build labels. `chrome.exe`, `setup.exe`, sandbox IDs, COM GUIDs, network stack, TLS, renderer internals, downloads, history, bookmarks, password manager, cookies, and DevTools remain unchanged. Validated: `git apply --numstat`, `check_patch_files.py`, `check_gn_flags.py`, and `validate_config.py` all pass. Real Windows build/install smoke is deferred to T32/T36 because no local Chromium source checkout or Windows installer environment exists here. |
| T32 | W5 | Add Windows build/signing/smoke docs | T30, T31 | DONE | Windows Alpha release runbook created at `docs/echothink-browser-alpha/t32-add-windows-build-signing-smoke-docs.md`. Prerequisites T30 and T31 are DONE. Documents the Alpha Dev `mini_installer` build path, asset staging, `EchothinkBrowserSetup-Dev-x64-148.0.7778.178-alpha.<build>.exe` package shape, signing workflow, sidecar update-channel metadata and reserved per-channel IDs, smoke procedure covering launch, branding, New Tab, Side Panel, search, restart, and uninstall, plus an Alpha candidate release checklist. Validation is docs/path based because this environment is not Windows and has no local Chromium source checkout. |
| T33 | W11 | Run full patch validation | T05, T08, T10, T13, T19, T21, T23, T26, T31 | DONE | M7 patch validation report at `docs/echothink-browser-alpha/t33-run-full-patch-validation.md`. All nine required prerequisite patches now exist and are active (T26's `0008-request-proof-helper.patch` was the last blocker; now DONE). Series ordering validated: 127 active entries = 108 inherited + 19 Echothink, all Echothink entries appended strictly after the inherited block (0 out-of-order), 0 missing files, 0 orphan files. **Echothink patches confirmed ordered after inherited patches.** Per-patch structural parse (`git apply --numstat`) clean for all 19 Echothink patches. Validation utilities clean on this POSIX host: `check_patch_files.py`, `check_gn_flags.py`, `validate_config.py` all exit 0 against the full series. Full stacked live application via `validate_patches.py` NOT runnable: no local pristine Chromium `148.0.7778.178` checkout, and `--remote` is blocked before download by the inherited DEPS-parser baseline (parser allows only `Var`; pinned DEPS uses `Str(...)` 8×, confirmed by targeted fetch of DEPS lines 218/219/260…) — same inherited tooling issue documented in T03 (#4), with no Echothink patch ID. No Echothink or inherited patch failures recorded by ID. Each required patch was additionally proven by real `patch -p1` in its own task (e.g. T05, T26). Follow-up: extend the inherited DEPS parser to support `Str(...)` or run `validate_patches.py --local` against a clean 148.0.7778.178 checkout to complete a live full-stack apply; runtime/build smoke remains with T34/T35/T37. |
| T34 | W12 | Run native browser regression suite | T33 | DONE | M7 regression report at `docs/echothink-browser-alpha/t34-run-native-browser-regression-suite.md`. Prerequisite T33 is now `DONE` (earlier blocker — missing `0008-request-proof-helper.patch` — resolved; T26/T27/T33 all `DONE`, patch active in series). Ran the source-level native-primitive ownership regression suite: inventoried all 19 active Echothink patches (`patches/series` 113-131), extracted 39 distinct touched files, and read every shared-file hunk at a primitive intersection. **Result: 0 of 39 touched files are in any native primitive subsystem** — negative grep over `/bookmarks/`, `/history/`, `/download`, `/password_manager/`, `net/cookies`, `dom_storage`, `/ssl/`, `cert_verif`, `/devtools/`, `tab_strip`, `/tabs/`, `browser_window`, `/popup`, `/sandbox/`, `/renderer/` returned 0 matches. The only intersections are additive registrations, not replacements: navigation URL gate inside `Navigate()` (0006/0009/0012, leaves tab/window/popup machinery intact — intended T21 behavior), one extra component-extension allowlist entry + one `Add()` call (0004), one new allowlisted `echothinkDevice` API feature + IDL source (0024), and default-bookmark seed via preferences/HTML (0002). Chromium-native ownership of tabs, windows, popups, history, downloads, bookmarks, password manager, cookies, local storage, TLS, DevTools, and extension loading is **preserved at source level**. **No blocker (or any) native-primitive regression found.** Structural validators clean: `check_patch_files.py`, `check_gn_flags.py`, `validate_config.py` all exit 0. Known limitation: live runtime browser smoke (launching a built binary) was NOT run — no local Chromium `148.0.7778.178` build exists (same limitation as T33/T03 #4); runtime exercise of each primitive on an installed build is owned by T36 Windows packaging smoke + T37 Alpha candidate. |
| T35 | W12 | Run Echothink behavior tests | T33 | DONE | M7 behavior test report at `docs/echothink-browser-alpha/t35-run-echothink-behavior-tests.md` (supersedes the earlier blocker note). Prerequisite T33 is now `DONE` (the T26 `0008-request-proof-helper.patch` blocker is resolved). All 10 required Alpha behaviors PASS at static/structural fidelity against the validated full patch set: (1) branding `0001`+`0010`; (2) New Tab route `0002` + local fallback `0003`; (3) default search/suggest `0005`; (4) Side Panel opens — MV3 manifest + `0014`; (5) Chat/Workspace-Context modes `0015`/`0016`/`0017` persisted to `chrome.storage.local echothink.sidePanel.mode`; (6) chat `scope_type` metadata `0016`; (7) login gate + T20 allowlist `0011`+`0006`; (8) device identity persistence (ECDSA P-256 + DPAPI envelope, non-secret Local State metadata, reset) `0007`; (9) proof helper signs only allowlisted Echothink HTTPS URLs — native `0008` allowlist == JS `sidepanel.js` allowlist, bridge `0024` locked to bundled ext ID, headers `0019`, decision-table mirror 20/20; (10) optional `echo://` routes `0009` + invalid fallback `0012`. Validated: `check_patch_files.py`/`check_gn_flags.py`/`validate_config.py` exit 0; all 19 Echothink patches parse via `git apply --numstat`; `node --check` clean on all 3 extension JS files; proof allowlist mirror 20/20; `git diff --check` clean. Runtime-interactive smoke (compiled-browser launch, click-through, OS-restart DPAPI persistence, live omnibox/`echo://`) is explicitly DEFERRED NON-BLOCKING to T36 against a built signed binary — no local Chromium `148.0.7778.178` build exists here (same constraint T33 documented). No required behavior failed. |
| T36 | W13 | Run Windows packaging smoke test | T31, T32, T35 | BLOCKED | Task note rewritten at `docs/echothink-browser-alpha/t36-run-windows-packaging-smoke-test.md` (supersedes the stale prerequisite-gap note). **Prior block reason RESOLVED:** all prerequisites are now `DONE` (T31, T32, T35) and the previously-missing `patches/echothink/0008-request-proof-helper.patch` exists and is active (series line 130). T36 stays `BLOCKED` only because its defining deliverable is a **live runtime** Windows smoke (build + sign + install on a clean Windows host, launch, New Tab, Side Panel restart persistence, search, uninstall) and this environment is macOS with no Chromium `148.0.7778.178` checkout, no Windows build toolchain, and no built/signed `EchothinkBrowserSetup` installer — nothing to install/launch/uninstall, so those runtime passes are recorded NOT RUN rather than faked. A full **static packaging-readiness dry run PASSED**: pin `148.0.7778.178`; identity patch `0010` carries `Echothink Browser Dev`/`EchothinkBrowserSetup`/`Echothink Browser Setup`/`Software\Echothink\Browser Dev`; app `echothink.ico` + full PNG set + setup `echothink-setup.ico` present; series 127 = 108 inherited + 19 Echothink, all after inherited (first at 113), 0 out-of-order; all 19 Echothink patches parse via `git apply --numstat`; `check_patch_files.py`/`check_gn_flags.py`/`validate_config.py` exit 0; T32 `.channel.json` Dev/alpha metadata contract documented. Unblock = run T32 build+smoke procedure on a Windows Chromium build host (no further repo change needed). |
| T37 | W14 | Produce Windows Alpha candidate | T33, T34, T35, T36 | BLOCKED | Task note rewritten at `docs/echothink-browser-alpha/t37-produce-windows-alpha-candidate.md` (supersedes the stale prerequisite-gap note). **Prior block reasons RESOLVED:** browser-side acceptance criteria are now all `DONE` (T33 patch validation, T34 native regression, T35 behavior), and the previously-missing `0008-request-proof-helper.patch` now exists (23751 bytes) and is active in `patches/series` (line 130). Echothink patch count is `19` (not 17); full series = `127` active = 108 inherited + 19 Echothink, all Echothink entries strictly after inherited, all 19 parse via `git apply --numstat`; `check_patch_files.py`/`check_gn_flags.py`/`validate_config.py` exit 0; bundled extension manifest valid JSON. T37 stays `BLOCKED` on a **single, environment-bound** blocker: producing a **signed/tested** installer requires a Windows Chromium build host (`autoninja` + `mini_installer` + `signtool`) with a pristine `148.0.7778.178` checkout — this macOS worktree has none, and no `release/`/`build/`/`out/` output exists, so no `.exe`, SHA256, or `.channel.json` was emitted (not faked). This is the same constraint that blocks T36's live runtime smoke. The doc now records the **finalized Alpha Candidate Build Manifest**: pin `148.0.7778.178`, rev `1`, HEAD `7698c418`, freeze `2026-05-29T18:26:55Z`, channel `dev`/phase `alpha`/`x64`, stem `EchothinkBrowserSetup`, artifact `EchothinkBrowserSetup-Dev-x64-148.0.7778.178-alpha.<build>.exe`, Dev `app_update_id` `e81ee626-…`, `installer_product_id` `21b7be8b-…`, full ordered 19-patch list, and `.channel.json` contract. **No repo change needed to unblock** — run T32's build/sign/smoke on a Windows host. Delivery criterion "no blocker browser-side acceptance criteria remain open" is met; only the physical build/sign/smoke (== T36 live runtime) is outstanding. |

## T26 Notes

Changed / added files:

- `patches/echothink/0008-request-proof-helper.patch` (new active patch)
- `patches/series` (added `echothink/0008-request-proof-helper.patch` after
  `echothink/0024-narrow-extension-bridge.patch`)
- `docs/echothink-browser-alpha/t26-implement-proof-signing-helper.md`
- `docs/progress.md`

Prerequisite status:

- T26 depends on T25. T25 is `DONE`.
- T26 also builds on T24 (`patches/echothink/0024-narrow-extension-bridge.patch`)
  and T23 (`patches/echothink/0007-device-identity.patch`), both `DONE`.

Implementation summary:

- Replaced the T24 opaque-string signing surface with the T25 canonical
  request-proof contract. `chrome.echothinkDevice.signProofPayload` now takes a
  structured `RequestProofOptions` dictionary (`method`, `url`, `timestamp`,
  optional `nonce`, optional `access_token_hash`); all members are optional in
  the IDL so native code is the single source of truth and returns
  `invalid_payload` for any malformed input, including missing required fields.
- New `chrome/browser/extensions/api/echothink_device/echothink_request_proof.{h,cc}`
  provides `BuildCanonicalRequestProof()`, which validates field shape, enforces
  the exact Echothink HTTPS signing allowlist, strips fragments, and builds the
  canonical UTF-8 JSON by hand in the fixed field order (method, url, timestamp,
  nonce, access_token_hash) so key order is contractual.
- `echothink_device_api.cc` maps the canonicalizer status to the documented
  error codes, signs the canonical bytes with the existing T24
  `echothink::device_identity::SignProofPayload()` device-key entry point, and
  returns the safe opaque result. `BUILD.gn` adds the new sources and `//url`.
- The opaque `proof` is `base64url(canonical_json).base64url(DER ECDSA-SHA256
  signature)`. No private key, DPAPI blob, raw token, canonical bytes, or bare
  signature is returned, logged, or stored.

Signing allowlist (everything else -> `disallowed_destination`):

- `https://api.echothink.ai/v1/`
- `https://auth.echothink.ai/browser/`
- `https://auth.echothink.ai/device/`
- `https://app.echothink.ai/api/`

Validation commands and results:

| Command | Result |
|---|---|
| `git apply --numstat patches/echothink/0008-request-proof-helper.patch` | Passed: 5 files (BUILD.gn 3/0, echothink_device_api.cc 42/15, echothink_request_proof.cc 239/0, echothink_request_proof.h 46/0, echothink_device.idl 24/8). |
| `patch -p1` against a reconstructed post-`echothink/0024` tree | Passed: all 5 files applied with no fuzz; applied tree byte-matches the intended source. |
| `python3 devutils/check_patch_files.py` | Passed, exit 0. |
| `python3 devutils/check_gn_flags.py` | Passed, exit 0. |
| `python3 devutils/validate_config.py` | Passed, exit 0. |
| Trailing-whitespace scan of added patch lines | Passed: none. |
| Decision-table logic mirror (29 cases) | Passed 29/29: allowlisted destinations sign; third-party, sibling-subdomain (`search`/`updates`), lookalike, `http`/`chrome`/`echo`, non-default port, userinfo, and IP-literal destinations return `disallowed_destination`; missing/bad method, bad timestamp shape, unknown field, bad nonce/token-hash return `invalid_payload`. |

Known limitations:

- No local pinned Chromium source checkout or Windows build exists here (per
  T03), so application was validated via `patch -p1` against a reconstructed
  post-`echothink/0024` tree and via a faithful logic mirror, not a real browser
  build. Runtime signing smoke (real device key + extension call) is deferred to
  T33/T34/T35.
- Active Echothink patch count is now `18`. T33's last missing required Alpha
  artifact (`patches/echothink/0008-request-proof-helper.patch`) now exists;
  T33-T37 remain owned by their tasks and still require a real build pass.
- Replay protection, header acceptance, device revocation, and protected-resource
  authorization remain backend/gateway responsibilities.

## T27 Notes

Changed / added files:

- `extensions/echothink-workspace/sidepanel.js` (source extension; proof
  request + DPoP-style header attachment + recoverable signing-failure states)
- `patches/echothink/0019-proof-capable-extension-calls.patch` (new active patch
  mirroring the same change onto
  `chrome/browser/resources/echothink_workspace/sidepanel.js`)
- `patches/series` (added `echothink/0019-proof-capable-extension-calls.patch`
  after `echothink/0008-request-proof-helper.patch`)
- `docs/echothink-browser-alpha/t27-integrate-proof-helper-into-extension-calls.md`
- `docs/progress.md`

Prerequisite status:

- T27 depends on T16, T24, and T26 - all `DONE`.
- Builds on active patches `echothink/0024-narrow-extension-bridge.patch`
  (bridge) and `echothink/0008-request-proof-helper.patch` (helper).

Implementation summary:

- `sidepanel.js` adds `buildProofHeaders()`, which calls
  `requestRequestProof()` -> `sendDeviceBridgeMessage("signProofPayload", {
  method, url, timestamp })` through the existing `echothink.device.bridge`
  relay in `background.js`. `timestamp` is `new Date().toISOString()` (RFC3339
  UTC `Z`).
- `isProofSigningAllowed()` re-enforces the T25 signing allowlist
  (`api.echothink.ai/v1/`, `auth.echothink.ai/browser/`,
  `auth.echothink.ai/device/`, `app.echothink.ai/api/`) before any bridge call,
  so the extension never asks the browser to sign a non-allowlisted destination.
- On a valid `{ proof_type: "echothink-request-proof-v1", proof }` result the
  chat `fetch` to `https://api.echothink.ai/v1/chat/stream` gains
  `DPoP: <opaque proof>` and `X-Echothink-Device-ID: <device_id>` (device id
  from a cached `getDeviceStatus`). `credentials: "include"` is preserved and no
  `Authorization` header is added.
- Signing failures show recoverable Side Panel states and the request is not
  sent: `missing_device`/`locked_key`/`reset`/`unauthorized_extension` ->
  `no_device_identity`; `invalid_payload`/`disallowed_destination`/`bridge_error`
  -> `remote_service_error`. An absent bridge (`unsupported_platform`) falls back
  to the existing cookie-only chat call so non-proof-capable builds still work.

Secret hygiene:

- No private key, DPAPI blob, raw access token, canonical payload bytes, or bare
  signature enters extension JavaScript; only the opaque `proof`, `key_id`,
  `key_algorithm`, and `timestamp` are returned by the helper.
- The opaque `proof` and public `device_id` are placed only on outbound request
  headers for allowlisted destinations; nothing proof-related is logged,
  stored in `chrome.storage`, or persisted.

Validation commands and results:

| Command | Result |
|---|---|
| `node --check extensions/echothink-workspace/sidepanel.js` | Passed: source syntax valid. |
| `git apply --numstat patches/echothink/0019-proof-capable-extension-calls.patch` | Passed: `136 0 chrome/browser/resources/echothink_workspace/sidepanel.js`. |
| `patch -p1` against a reconstructed resources base (committed `sidepanel.js`) | Passed: applied with no fuzz; applied file byte-matches the edited source; `node --check` on the applied file passes. |
| `python3 devutils/check_patch_files.py` | Passed, exit 0. |
| `python3 devutils/check_gn_flags.py` | Passed, exit 0. |
| `python3 devutils/validate_config.py` | Passed, exit 0. |
| Trailing-whitespace scan of added patch lines | Passed: none. |
| `python3 -m json.tool extensions/echothink-workspace/manifest.json` + manifest diff | Passed: manifest valid and unchanged; no new permissions/host permissions/`webRequest`/native messaging. |
| Secret/auth scan of `extensions/echothink-workspace` for `private_key`/`access_token`/`Bearer`/`Authorization`/PEM | Passed: none present. |
| Decision-table logic mirror (23 cases) | Passed 23/23: allowlist gate (chat/auth/app sign; search/updates/http/wrong-prefix/third-party/port rejected); valid proof attaches; device errors abort with recoverable state; `unsupported_platform` falls back; error->state mapping. |

Known limitations:

- No local pinned Chromium source checkout or Windows build exists here (per
  T03), so application was validated via `patch -p1` against a reconstructed
  resources base and via a logic mirror, not a real browser build. Runtime
  proof-attachment smoke is deferred to T33/T34/T35.
- Active Echothink patch count is now `19`.
- Only the chat stream call attaches a proof in Alpha (the only protected API
  call the bundled Side Panel makes); future protected calls reuse
  `buildProofHeaders()` with their own allowlisted destination.
- Header acceptance, nonce/`access_token_hash` requirements, replay protection,
  and device revocation remain backend/gateway responsibilities.

## T36 Notes

Changed documentation:

- `docs/echothink-browser-alpha/t36-run-windows-packaging-smoke-test.md`
  (rewritten — supersedes the stale prerequisite-gap note)
- `docs/progress.md` (T36 row, header, this section)

Prerequisite status (all RESOLVED since the previous T36 note):

- T31 (`0010-windows-packaging-identity.patch`) — `DONE`.
- T32 (Windows Alpha build/signing/smoke runbook) — `DONE`.
- T35 (Echothink behavior tests) — `DONE`; its blocker T33 is `DONE`; the
  previously-missing `patches/echothink/0008-request-proof-helper.patch` now
  exists and is active in `patches/series` (line 130).
- No prerequisite blocks T36.

Why T36 stays BLOCKED:

- T36's defining deliverable is a **live runtime** Windows packaging smoke:
  build + sign an `EchothinkBrowserSetup` installer, install it on a clean
  Windows machine, launch from Start Menu, verify name/icon, verify New Tab,
  Side Panel + restart persistence, default search, and uninstall.
- This environment is macOS (`darwin`) with no Chromium `148.0.7778.178`
  checkout, no Windows Chromium build toolchain, and no built/signed installer.
  There is nothing to install, launch, restart, or uninstall.
- Per "do not fake completion," the runtime smoke items are recorded NOT RUN
  rather than PASS. The blocker is purely the build/host environment, not a
  prerequisite or missing browser-repository artifact.

Static packaging-readiness dry run (largest local validation; all PASS):

| Check | Result |
|---|---|
| Chromium pin `148.0.7778.178`, revision `1` | PASS |
| `patches/echothink/0010-windows-packaging-identity.patch` present | PASS |
| Identity strings (`Echothink Browser Dev`, `EchothinkBrowserSetup`, `Echothink Browser Setup`, `Software\Echothink\Browser Dev`, install component `Browser Dev`) | PASS |
| App icon `assets/icons/echothink.ico` + PNG set 16-256 + setup icon `assets/installer/echothink-setup.ico` | PASS |
| Prior blocker `0008-request-proof-helper.patch` + `0007-device-identity.patch` present and active | PASS |
| Series ordering: 127 active = 108 inherited + 19 Echothink, all after inherited (first at line 113), 0 out-of-order | PASS |
| `git apply --numstat` over all 19 Echothink patches | PASS (19/19) |
| `devutils/check_patch_files.py` / `check_gn_flags.py` / `validate_config.py` | PASS (exit 0) |
| T32 `.channel.json` Dev/alpha metadata contract documented (`channel=dev`, `release_phase=alpha`, Dev `app_update_id`/`installer_product_id`) | PASS |
| T32 smoke procedure covers install/launch/branding/New Tab/Side Panel/search/restart/channel/uninstall | PASS |

Unblock requirement:

- Run the T32 build procedure on a Windows x64 Chromium build host to produce
  and (test-)sign `EchothinkBrowserSetup-Dev-x64-148.0.7778.178-alpha.<build>.exe`
  + `.channel.json`, then run the T32 smoke procedure steps 1-9 on a clean
  Windows VM/profile and attach the evidence listed in the T36 note. No further
  browser-repository code, patch, asset, or doc change is required.

Known limitations:

- Static readiness only; this is not a passing live M7 Windows smoke report.
- Same hard environment limitation documented by T03/T32/T33/T34/T35: not
  Windows, no local Chromium source checkout, no build.
- No backend services, gateway logic, network stack, TLS, sandbox, renderer
  internals, downloads, history, bookmarks, password manager, cookies, or
  DevTools behavior changed.

## T37 Notes

Changed documentation:

- `docs/echothink-browser-alpha/t37-produce-windows-alpha-candidate.md`
- `docs/progress.md`

Prerequisite status:

- T37 depends on T33, T34, T35, and T36.
- T33, T34, T35, and T36 are all marked `BLOCKED`.
- No task note or progress row accepts those blocked prerequisites as baseline
  dependencies for producing a Windows Alpha candidate.

Candidate status:

- No Windows Alpha candidate was produced.
- No signed installer, SHA256, channel sidecar, build timestamp, or smoke
  attachment exists.
- Intended future Alpha artifact remains
  `EchothinkBrowserSetup-Dev-x64-148.0.7778.178-alpha.<build>.exe`.
- Intended future channel sidecar remains
  `EchothinkBrowserSetup-Dev-x64-148.0.7778.178-alpha.<build>.channel.json`.

Traceability snapshot:

- Chromium pin: `148.0.7778.178`.
- Repository revision marker: `1`.
- T37 source base after T24 merge:
  `7bba82a18a43e6a5c6551a582a900ca73a571ce3`.
- Intended Alpha channel: `dev`.
- Intended release phase: `alpha`.
- Active Echothink patch count: `17`.
- Missing required Alpha patch:
  `patches/echothink/0008-request-proof-helper.patch`.

Validation commands and results:

| Command | Result |
|---|---|
| `rtk rg -n "^\\| T(33|34|35|36|37) \\|" echothink-studio-new/docs/progress.md` | Passed for prerequisite discovery: T33, T34, T35, T36, and T37 are `BLOCKED`. |
| `rtk rg -n "^\\| T(33|34|35|36|37) \\|" echothink-studio-new/docs/dag-doc.md` | Passed: T37 depends on T33, T34, T35, and T36. |
| `rtk cat chromium_version.txt revision.txt` | Passed: Chromium pin `148.0.7778.178`; repository revision marker `1`. |
| `rtk git rev-parse HEAD` | Passed: observed T37 source base after T24 merge `7bba82a18a43e6a5c6551a582a900ca73a571ce3`. |
| `rtk rg -n "^echothink/" patches/series` | Passed: active Echothink patch list recorded in the T37 task note. |
| `rtk rg -c "^echothink/" patches/series` | Passed: active Echothink patch count is `17`. |
| `rtk ls -l patches/echothink/0006-login-gate.patch` | Passed: T21 login-gate patch exists. |
| `rtk rg -n "^echothink/0006-login-gate\\.patch$" patches/series` | Passed: T21 login-gate patch is active in `patches/series`. |
| `rtk ls -l patches/echothink/0007-device-identity.patch` | Passed: T23 device identity patch exists. |
| `rtk rg -n "^echothink/0007-device-identity\\.patch$" patches/series` | Passed: T23 device identity patch is active in `patches/series`. |
| `rtk ls -l patches/echothink/0008-request-proof-helper.patch` | Failed as expected: the remaining required Alpha proof-helper patch file is absent. |
| `rtk rg -n "^echothink/0008-request-proof-helper\\.patch$" patches/series` | Exited 1 as expected: the missing proof-helper patch is not active in `patches/series`. |
| `rtk python3 devutils/check_patch_files.py` | Passed, exit 0, for the current incomplete patch series. |
| `rtk python3 devutils/check_gn_flags.py` | Passed, exit 0. |
| `rtk python3 devutils/validate_config.py` | Passed, exit 0, for the current incomplete patch series. |
| `rtk python3 -m json.tool extensions/echothink-workspace/manifest.json` | Passed: bundled extension manifest is valid JSON. |
| `rtk ls -l assets/icons/echothink.ico assets/installer/echothink-setup.ico assets/icons/png/echothink-256.png extensions/echothink-workspace/manifest.json patches/echothink/0010-windows-packaging-identity.patch` | Passed: packaging inputs exist. |
| `rtk rg -n "EchothinkBrowserSetup|Echothink Browser Dev|Software\\\\Echothink\\\\Browser Dev|Echothink Browser Setup" patches/echothink/0010-windows-packaging-identity.patch echothink-studio-new/docs/echothink-browser-alpha/t32-add-windows-build-signing-smoke-docs.md` | Passed: expected Windows Alpha Dev identity strings are present. |
| `rtk rg -n "EchothinkBrowserSetup-Dev-x64-148\\.0\\.7778\\.178-alpha|channel\\\": \\\"dev\\\"|release_phase\\\": \\\"alpha\\\"|app_update_id|installer_product_id" echothink-studio-new/docs/echothink-browser-alpha/t32-add-windows-build-signing-smoke-docs.md echothink-studio-new/docs/echothink-browser-alpha/t30-define-windows-app-identity-and-channels.md` | Passed: expected artifact naming and Dev Alpha metadata are documented. |
| `rtk ls -ld release build build/windows` | Failed as expected: no local release/build output exists. |

Known limitations:

- This is a blocker candidate report, not a signed or tested Windows Alpha
  candidate.
- No Windows build, signing, installer packaging, install smoke, launch smoke,
  restart smoke, update-channel smoke, or uninstall smoke was run by T37.
- Browser-side acceptance criteria remain open until T33 through T36 are
  completed after T26 is complete.
- No backend services, gateway logic, search ranking, chat orchestration,
  workflow orchestration, business pages, network stack, TLS validation,
  sandbox, renderer internals, downloads, history, bookmarks, password manager,
  cookies, or DevTools behavior was changed.

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
- `docs/ungoogled_to_echothink_browser_change_plan.md`
- `docs/echothink_browser_construction.md`
- `docs/progress.md`

Prerequisite status:

- T20 depends on T10 and T11.
- T10 is marked `DONE` and provides the local `chrome://echothink-first-run`
  shell via `patches/echothink/0003-new-tab-and-first-run.patch`.
- T11 is marked `DONE` and makes the Echothink shell the sole first-run tab via
  `patches/echothink/0011-first-run-gate-shell.patch`.
- T20 is therefore complete as a spec task.

Spec decisions:

- Readiness is represented as non-secret normal-profile preferences:
  `echothink.auth.session_ready`, `echothink.device.enrolled`,
  `echothink.device.verified`, `echothink.setup.complete`,
  `echothink.setup.completed_at`, `echothink.setup.last_blocked_at`, and
  `echothink.setup.last_blocked_scheme`.
- Setup is complete only when auth is ready, the device is enrolled, and the
  device is verified. `echothink.setup.complete` must be cleared whenever any
  underlying readiness flag becomes false.
- Before setup, top-level navigation is allowed only to the explicit T20
  allowlist: `chrome://echothink-first-run`,
  `chrome://echothink-diagnostics`, `https://auth.echothink.ai/login`,
  `https://auth.echothink.ai/browser/callback`,
  `https://auth.echothink.ai/device/enroll`,
  `https://auth.echothink.ai/device/complete`,
  `https://app.echothink.ai/browser-required`,
  `https://app.echothink.ai/support`,
  `https://app.echothink.ai/download-browser`, and
  `https://updates.echothink.ai/` including subpaths.
- Query strings and fragments are allowed only on exact listed app/auth paths;
  no sibling subdomains, HTTP downgrade, wildcard hosts, direct IP literals,
  `file://`, external protocol handlers, or arbitrary extension URLs are
  pre-setup bypasses.
- Blocked top-level navigation is canceled or replaced before arbitrary content
  commits, then routed to `chrome://echothink-first-run` without appending the
  blocked URL, query, fragment, or referrer.
- The gate applies to omnibox navigations, top-level link/redirect navigation,
  restored/startup tabs, popups/new windows, normal/incognito profiles, and
  app-mode/command-line URL launches unless the destination is allowlisted.
- The gate deliberately does not intercept subresources as network policy and
  does not alter TLS, certificate, proxy, cookie, password, history, bookmark,
  download, sandbox, renderer, or DevTools behavior.
- Sign-out and local reset clear enough readiness state to re-enable the gate;
  T22/T23 own device key/material deletion details.
- `chrome://echothink-diagnostics` is allowlisted as a planned route but remains
  a known dead diagnostics link until its owning task implements the WebUI.
- T21 owns the login-gate implementation patch. T22/T23 own device readiness
  persistence and DPAPI storage. Backend services remain responsible for
  server-side auth, device authorization, replay protection, and rollout policy.

Validation commands and results:

| Command | Result |
|---|---|
| `rtk rg -n "^\\| T10 \\|[^|]*\\|[^|]*\\|[^|]*\\| DONE \\|" echothink-studio-new/docs/progress.md` | Passed: T10 is marked `DONE`. |
| `rtk rg -n "^\\| T11 \\|[^|]*\\|[^|]*\\|[^|]*\\| DONE \\|" echothink-studio-new/docs/progress.md` | Passed: T11 is marked `DONE`. |
| `rtk ls -l patches/echothink/0003-new-tab-and-first-run.patch patches/echothink/0011-first-run-gate-shell.patch` | Passed: T10 and T11 patch artifacts exist. |
| `rtk rg -n "echothink/0003-new-tab-and-first-run.patch|echothink/0011-first-run-gate-shell.patch" patches/series` | Passed: both prerequisite patches are active in `patches/series`. |
| `rtk rg -n "echothink.auth.session_ready|echothink.setup.complete|Unauthenticated Navigation Allowlist|https://auth.echothink.ai/login|https://app.echothink.ai/browser-required|chrome://echothink-first-run|chrome://echothink-diagnostics|Setup Completion And Unlock" echothink-studio-new/docs/echothink-browser-alpha/t20-define-login-gate-local-state-and-allowlist.md` | Passed: the spec defines readiness flags, explicit allowlist, local gate routes, and setup completion. |
| `rtk rg -n "t20-define-login-gate-local-state-and-allowlist|login-gate state and allowlist source of truth|Alpha source of truth" echothink-studio-new/docs/ungoogled_to_echothink_browser_change_plan.md echothink-studio-new/docs/echothink_browser_construction.md` | Passed: broader Alpha docs point to the T20 spec as the login-gate source of truth. |
| `rtk rg -n 'T20 is not mark[e]d|No login-gate spec was author[e]d|T20 prerequisite is incomplet[e]|T20 is only read[y]|still block[e]d in the task note' echothink-studio-new/docs` | Exited 1 as expected: no stale T20-blocker language remains. |
| `rtk git diff --check` | Passed: no whitespace errors. |

Known limitations:

- This is a spec task. It does not create
  `patches/echothink/0006-login-gate.patch`.
- No browser binary was built or run, so no runtime navigation-gate smoke test
  was performed.
- `chrome://echothink-diagnostics` remains an allowlisted planned route until
  its owning diagnostics task implements the WebUI.
- The local gate is not a backend authorization boundary. Server-side auth,
  device authorization, replay protection, and rollout policy remain backend
  responsibilities.

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

Changed files:

- `patches/echothink/0006-login-gate.patch`
- `patches/series`
- `docs/echothink-browser-alpha/t21-implement-login-required-startup-gate.md`
- `docs/ungoogled_to_echothink_browser_change_plan.md`
- `docs/echothink_browser_construction.md`
- `docs/progress.md`

Prerequisite status:

- T21 depends on T20.
- T20 is marked `DONE` and provides the M4 login-gate spec.

Implementation result:

- Created `patches/echothink/0006-login-gate.patch`.
- Inserted `echothink/0006-login-gate.patch` into `patches/series` after
  `echothink/0011-first-run-gate-shell.patch` and before the later `echo://`
  navigation patches.
- Registers T20's non-secret readiness prefs:
  `echothink.auth.session_ready`, `echothink.device.enrolled`,
  `echothink.device.verified`, `echothink.setup.complete`,
  `echothink.setup.completed_at`, `echothink.setup.last_blocked_at`, and
  `echothink.setup.last_blocked_scheme`.
- Treats `echothink.setup.complete` as a derived cached boolean based on auth
  readiness, device enrollment, and device verification.
- Routes pre-setup `chrome://newtab` to `chrome://echothink-first-run`.
- Rewrites browser-level blocked navigations to
  `chrome://echothink-first-run` and clears the referrer.
- Allows the explicit T20 setup/support/update/diagnostic routes before setup
  and restores normal Chromium navigation after readiness is complete.
- No backend services, gateway logic, search ranking, chat orchestration,
  workflow orchestration, business pages, network stack, TLS validation,
  sandbox, renderer internals, downloads, history, bookmarks, password manager,
  cookies, or DevTools behavior were changed.

Validation commands and results:

| Command | Result |
|---|---|
| `rtk rg -n "^\\| T20 \\|[^|]*\\|[^|]*\\|[^|]*\\| DONE \\|" echothink-studio-new/docs/progress.md` | Passed: T20 is marked `DONE`. |
| `rtk rg -n "Status: DONE|echothink.auth.session_ready|Unauthenticated Navigation Allowlist|Setup Completion And Unlock" echothink-studio-new/docs/echothink-browser-alpha/t20-define-login-gate-local-state-and-allowlist.md` | Passed: the T20 spec exists and defines the required gate contract. |
| `rtk git apply --numstat patches/echothink/0006-login-gate.patch` | Passed: patch parses cleanly; `50` inserted lines in `chrome/browser/chrome_content_browser_client.cc` and `92` inserted lines in `chrome/browser/ui/browser_navigator.cc`. |
| `rtk rg -n "echothink/0006-login-gate.patch" patches/series` | Passed: active series entry is present. |
| `rtk rg -n "Echothink-Patch: 0006-login-gate|kEchothinkAuthSessionReadyPref|ApplyEchothinkLoginGate|auth.echothink.ai|app.echothink.ai|updates.echothink.ai|RegisterProfilePrefs|kEchothinkFirstRunURL|content/public/common/url_constants.h" patches/echothink/0006-login-gate.patch` | Passed: patch includes metadata, readiness prefs, navigation gate, allowlist hosts, pref registration, direct URL constants include, and first-run rewrite. |
| `rtk git apply --check --include=chrome/browser/ui/browser_navigator.cc /Users/yangcao/source/echothink-studio/.worktrees/task/task-t37-produce-windows-alpha-cad6e2/patches/echothink/0006-login-gate.patch` from `/private/tmp/echothink-t28-chromium` | Passed against the available pinned-source `browser_navigator.cc` copy. |
| `rtk python3 devutils/check_patch_files.py` | Passed, exit 0. |
| `rtk python3 devutils/check_gn_flags.py` | Passed, exit 0. |
| `rtk python3 devutils/validate_config.py` | Passed, exit 0. |
| `rtk git diff --check` | Passed: no whitespace errors. |

Known limitations:

- No local full Chromium checkout, compile, or runtime browser smoke test was
  available in this macOS worktree.
- The `chrome_content_browser_client.cc` hunk was parse-validated and documented
  with an application command, but only the `browser_navigator.cc` hunk could be
  checked against a local pinned-source copy.
- `chrome://echothink-diagnostics` remains an allowlisted planned route until
  its owning diagnostics task implements the WebUI.

## T22 Notes

Changed documentation:

- `docs/echothink-browser-alpha/t22-define-device-identity-and-dpapi-storage.md`
- `docs/echothink-browser-alpha/t23-implement-device-key-generation-and-storage.md`
- `docs/echothink-browser-alpha/t24-implement-narrow-extension-bridge.md`
- `docs/echothink-browser-alpha/t25-define-request-proof-payload-and-allowlist.md`
- `docs/echothink-browser-alpha/t26-implement-proof-signing-helper.md`
- `docs/echothink-browser-alpha/t27-integrate-proof-helper-into-extension-calls.md`
- `docs/echothink-browser-alpha/t33-run-full-patch-validation.md`
- `docs/echothink-browser-alpha/t34-run-native-browser-regression-suite.md`
- `docs/echothink-browser-alpha/t35-run-echothink-behavior-tests.md`
- `docs/echothink-browser-alpha/t37-produce-windows-alpha-candidate.md`
- `docs/ungoogled_to_echothink_browser_change_plan.md`
- `docs/echothink_browser_construction.md`
- `docs/progress.md`

Prerequisite status:

- T22 depends on T00 and T20.
- T00 is marked `DONE`.
- T20 is marked `DONE` and defines the readiness/reset contract T22 needs.
- T22 is now marked `DONE`; T23 is unblocked for implementation and marked
  `READY`.

Current result:

- The M5 device identity design is authored at
  `docs/echothink-browser-alpha/t22-define-device-identity-and-dpapi-storage.md`.
- Alpha selects ECDSA P-256 / `ES256` for the local device key and Windows DPAPI
  current-user protection for private key material.
- Private key material is stored only as a DPAPI-protected native blob in a
  dedicated user-data-dir file, not in preferences, extension storage, web
  storage, logs, docs examples, or progress notes.
- Non-secret installation/key metadata is assigned to Local State.
- Profile-specific enrollment metadata and T20 readiness flags remain profile
  preferences.
- Restart persistence, sign-out, backend revocation, explicit local reset,
  profile deletion, and uninstall/user-data behavior are documented.
- Extension bridge boundaries are documented so JavaScript never receives
  private key material or DPAPI blobs.
- No patch, extension code, backend service, gateway logic, network stack, TLS,
  sandbox, renderer, downloads, history, bookmarks, password manager, cookies,
  DevTools behavior, key material, token, or proof internals were changed or
  exposed.

T23 handoff:

- Completed by T23 on 2026-05-29.
- `patches/echothink/0007-device-identity.patch` now implements the completed
  T22 design.
- `echothink/0007-device-identity.patch` is active in `patches/series` after
  `echothink/0006-login-gate.patch`.
- T24 has since implemented the narrow bridge against the T23 native device
  identity boundary.

Validation commands and results:

| Command | Result |
|---|---|
| `rtk rg -n "^\\| T00 \\|[^|]*\\|[^|]*\\|[^|]*\\| DONE \\|" echothink-studio-new/docs/progress.md` | Passed: T00 is marked `DONE`. |
| `rtk rg -n "^\\| T20 \\|[^|]*\\|[^|]*\\|[^|]*\\| DONE \\|" echothink-studio-new/docs/progress.md` | Passed: T20 is marked `DONE`. |
| `rtk rg -n "^\\| T22 \\|[^|]*\\|[^|]*\\|[^|]*\\| DONE \\|" echothink-studio-new/docs/progress.md` | Passed: T22 is marked `DONE`. |
| `rtk rg -n "^\\| T23 \\|[^|]*\\|[^|]*\\|[^|]*\\| DONE \\|" echothink-studio-new/docs/progress.md` | Passed: T23 is now implemented. |
| `rtk rg -n "Reset And Logout Semantics|echothink.device.enrolled|echothink.device.verified" echothink-studio-new/docs/echothink-browser-alpha/t20-define-login-gate-local-state-and-allowlist.md` | Passed: T20 now defines the readiness and reset anchors T22 must align with. |
| `rtk rg -n "kEchothinkDeviceEnrolledPref|kEchothinkDeviceVerifiedPref|kEchothinkSetupCompletePref" patches/echothink/0006-login-gate.patch` | Passed: the active login-gate patch uses the T20 readiness prefs T22 preserves. |
| `rtk rg -n "lokdibgfmiemhdoogailbfpdggndpolk|host_permissions|sidePanel|storage" extensions/echothink-workspace/manifest.json patches/echothink/0004-bundled-workspace-extension.patch` | Passed: the bundled extension identity and permission baseline exist for the future bridge boundary. |
| `rtk rg -n "Status: DONE|windows_dpapi_current_user_v1|Extension Bridge Boundaries|Explicit local device reset" echothink-studio-new/docs/echothink-browser-alpha/t22-define-device-identity-and-dpapi-storage.md` | Passed: the T22 design records DPAPI selection, bridge boundaries, and reset behavior. |
| `rtk rg -n "t22-define-device-identity-and-dpapi-storage|DPAPI current-user|Alpha source of truth" echothink-studio-new/docs/ungoogled_to_echothink_browser_change_plan.md echothink-studio-new/docs/echothink_browser_construction.md` | Passed: broader docs point to the T22 design. |
| `rtk rg -n 'T22 is not mark[e]d|T22 is now [[:punct:]]READY[[:punct:]]|T22 is [[:punct:]]READY[[:punct:]]|no final M5 device identit[y]|T23 must not us[e]|T23 is mark[e]d [[:punct:]]BLOCKED[[:punct:]]|no T24 task note exist[s]|has no T24 ro[w]|Complete the M5 device identity desig[n]' echothink-studio-new/docs` | Exited 1 as expected: no stale T22/T23 blocker language remains. |
| `rtk git diff --check` | Passed: no whitespace errors. |

Known limitations:

- T22 was a design task. T23 now creates
  `patches/echothink/0007-device-identity.patch`.
- Runtime persistence and reset smoke tests still require a Windows browser
  build.
- TPM-backed or hardware-backed keys are deferred beyond Alpha.

## T23 Notes

Changed files:

- `patches/echothink/0007-device-identity.patch`
- `patches/series`

Changed documentation:

- `docs/echothink-browser-alpha/t23-implement-device-key-generation-and-storage.md`
- `docs/echothink-browser-alpha/t24-implement-narrow-extension-bridge.md`
- `docs/progress.md`

Prerequisite status:

- T23 depends on T22.
- T22 is marked `DONE` and the final M5 device identity design exists.
- T23 is marked `DONE`.
- T24 has since been marked `DONE` and now exposes the narrow bundled-extension
  bridge.

Implementation notes:

- Created `patches/echothink/0007-device-identity.patch`.
- Added `echothink/0007-device-identity.patch` to `patches/series` immediately
  after `echothink/0006-login-gate.patch`.
- The patch adds `chrome/browser/echothink/device_identity/` with native helper
  functions for local device identity creation, reload, status, and explicit
  reset.
- Windows startup calls `EnsureDeviceIdentity` after Local State is available.
- The device key is ECDSA P-256 / `ES256`.
- Private-key bytes are protected with Windows DPAPI current-user scope and
  persisted as `User Data/Echothink Device Identity/device_key.dpapi`.
- Local State stores only non-secret identity metadata, including
  `installation_id`, `key_id`, `key_algorithm`, `public_key_jwk`,
  `key_created_at`, `key_storage`, browser channel, and browser version.
- Profile prefs store only non-secret enrollment metadata and T20/T21 readiness
  state.
- `ResetLocalEnrollmentState` deletes the protected key file, clears key
  metadata, rotates `installation_id`, clears enrollment metadata, and clears
  login-gate readiness prefs.
- Existing protected keys that cannot be unprotected or parsed are not silently
  replaced; explicit reset is required.
- No extension bridge API, request proof helper, backend service, gateway
  logic, network stack, TLS, sandbox, renderer, downloads, history, bookmarks,
  password manager, cookies, or DevTools behavior was changed.
- No private key bytes, access token, signed proof value, or proof internals
  were exposed.

Patch application notes:

- The patch header records the expected full validation path: apply inherited
  patches and active Echothink predecessors through
  `echothink/0006-login-gate.patch`, apply `0007-device-identity.patch` with
  `patch -p1`, build on Windows, then verify creation, restart persistence,
  DPAPI unprotect behavior, and explicit reset.
- This worktree can parse and lint the patch, but cannot run Windows DPAPI or
  browser restart smoke tests.

Validation commands and results:

| Command | Result |
|---|---|
| `rtk rg -n "^\\| T22 \\|[^|]*\\|[^|]*\\|[^|]*\\| DONE \\|" echothink-studio-new/docs/progress.md` | Passed: T22 is marked `DONE` in the status column. |
| `rtk git apply --numstat patches/echothink/0007-device-identity.patch` | Passed: the patch parses as a Git patch and reports the expected five Chromium file changes. |
| `rtk rg -n "^echothink/0007-device-identity\\.patch$" patches/series` | Passed: the patch is active in `patches/series`. |
| `rtk python3 devutils/check_patch_files.py` | Passed, exit 0. |
| `rtk python3 devutils/check_gn_flags.py` | Passed, exit 0. |
| `rtk python3 devutils/validate_config.py` | Passed, exit 0. |
| `rtk rg -n "CryptProtectData|CryptUnprotectData|windows_dpapi_current_user_v1|ResetLocalEnrollmentState|public_key_jwk|device_key.dpapi" patches/echothink/0007-device-identity.patch` | Passed: DPAPI protection, reset, public metadata, and protected-key file anchors exist. |
| `rtk rg -n "access[_]token|refresh[_]token|Authori[z]ation|B[e]arer|private[_]key[_]jwk|\\\"d\\\"" patches/echothink/0007-device-identity.patch echothink-studio-new/docs/echothink-browser-alpha/t23-implement-device-key-generation-and-storage.md` | Exited 1 as expected: no token strings or private JWK `d` member are present. |
| `rtk git diff --check` | Passed: no whitespace errors. |

Known limitations:

- Windows compile, DPAPI runtime, browser restart persistence, and reset smoke
  tests were not run in this macOS worktree.
- T24 has since implemented the narrow extension bridge; Windows compile and
  runtime smoke for T23/T24 remain deferred to the validation pipeline.

## T24 Notes

Changed files:

- `extensions/echothink-workspace/background.js`
- `patches/echothink/0024-narrow-extension-bridge.patch`
- `patches/series`

Changed documentation:

- `docs/echothink-browser-alpha/t24-implement-narrow-extension-bridge.md`
- `docs/ungoogled_to_echothink_browser_change_plan.md`
- `docs/echothink_browser_construction.md`
- `docs/progress.md`

Prerequisite status:

- T24 depends on T13 and T23.
- T13 is marked `DONE` and supplies the bundled workspace extension ID
  `lokdibgfmiemhdoogailbfpdggndpolk` with narrow manifest permissions.
- T22 is marked `DONE` and documents the native private-key bridge boundary.
- T23 is marked `DONE` and provides active patch
  `patches/echothink/0007-device-identity.patch`.
- T24 is now marked `DONE`.

Implementation notes:

- Created active patch `patches/echothink/0024-narrow-extension-bridge.patch`
  and appended `echothink/0024-narrow-extension-bridge.patch` to
  `patches/series` after `echothink/0018-side-panel-local-states.patch`.
- Added the `chrome.echothinkDevice` extension API namespace with exactly four
  methods: `getDeviceStatus`, `requestEnrollmentChallenge`,
  `signProofPayload`, and `clearEnrollment`.
- Restricted API availability in `_api_features.json` to the SHA1 hashed ID for
  bundled extension `lokdibgfmiemhdoogailbfpdggndpolk`, with generic
  component-extension auto-grant disabled.
- Added a native exact caller-ID check before status, enrollment material,
  signing, or reset code paths run.
- Added native bridge error codes for `missing_device`, `locked_key`,
  `unsupported_platform`, `reset`, and `invalid_payload`.
- Kept the source extension manifest unchanged: no new permissions, no new host
  permissions, no `nativeMessaging`, no `webRequest`, no management/cookies/
  history/bookmarks/downloads/debugger/DevTools permissions.
- Added an internal `background.js` wrapper that accepts bridge requests only
  from extension pages under the bundled extension origin; content scripts and
  web pages do not get a generic signing bridge.

Boundaries preserved:

- Private key bytes, DPAPI blobs, access tokens, raw unprotected key handles,
  and proof internals are not returned to extension JavaScript.
- No backend service, gateway logic, search ranking, chat orchestration,
  workflow orchestration, business page, network stack, TLS validation,
  sandbox, renderer internals, downloads, history, bookmarks, password manager,
  cookies, or DevTools behavior was changed.
- T25 now owns the canonical request-proof payload rules and Echothink
  destination allowlist; T26 still must enforce them before proof signatures are
  attached to protected API requests.

Validation commands and results:

| Command | Result |
|---|---|
| `rtk rg -n "^\\| T13 \\|[^|]*\\|[^|]*\\|[^|]*\\| DONE \\|" echothink-studio-new/docs/progress.md` | Passed: prerequisite T13 is `DONE`. |
| `rtk rg -n "^\\| T23 \\|[^|]*\\|[^|]*\\|[^|]*\\| DONE \\|" echothink-studio-new/docs/progress.md` | Passed: upstream T23 is implemented. |
| `rtk rg -n "^echothink/0007-device-identity\\.patch$" patches/series` | Passed: prerequisite device identity patch is active. |
| `rtk rg -n "^echothink/0024-narrow-extension-bridge\\.patch$" patches/series` | Passed: T24 patch is active. |
| `rtk git apply --numstat patches/echothink/0024-narrow-extension-bridge.patch` | Passed: unified diff parses cleanly and reports the expected Chromium bridge/schema/resource changes. |
| `rtk python3 devutils/check_patch_files.py` | Passed, exit 0. |
| `rtk python3 devutils/check_gn_flags.py` | Passed, exit 0. |
| `rtk python3 devutils/validate_config.py` | Passed, exit 0. |
| `rtk python3 -m json.tool extensions/echothink-workspace/manifest.json` | Passed: source manifest parses as JSON. |
| Node manifest shape check | Passed: MV3, no `update_url`, exact permissions and Echothink host permissions preserved, and forbidden broad permissions absent. |
| `rtk node --check extensions/echothink-workspace/background.js` | Passed. |
| `rtk rg -n "private[_-]?key|privateKey|DPAPI|protected_payload|access[_-]?token|refresh[_-]?token|Authorization|Bearer|DPoP|signature" extensions/echothink-workspace` | Exited 1 as expected: extension source contains no private-key, token, proof-header, or signature handling. |
| `rtk git diff --check` | Passed: no whitespace errors. |

Known limitations:

- This macOS worktree has no local Chromium source checkout or Windows runtime
  build, so Windows compile, DPAPI runtime, component-extension API smoke, and
  unauthorized-extension runtime checks were not run here.
- The bridge signs payloads only for the bundled extension. T25 now defines the
  canonical request-proof payload and Echothink destination allowlist; T26 still
  must enforce them in the proof helper patch.

## T25 Notes

Changed documentation:

- `docs/echothink-browser-alpha/t25-define-request-proof-payload-and-allowlist.md`
- `docs/ungoogled_to_echothink_browser_change_plan.md`
- `docs/echothink_browser_construction.md`
- `docs/echothink-browser-alpha/t26-implement-proof-signing-helper.md`
- `docs/echothink-browser-alpha/t27-integrate-proof-helper-into-extension-calls.md`
- `docs/echothink-browser-alpha/t33-run-full-patch-validation.md`
- `docs/echothink-browser-alpha/t37-produce-windows-alpha-candidate.md`
- `docs/progress.md`

Prerequisite status:

- T25 depends on T24.
- T24 is marked `DONE`; the bridge patch exists at
  `patches/echothink/0024-narrow-extension-bridge.patch` and is active in
  `patches/series`.
- T25 is now marked `DONE`.
- T26 is now marked `READY` because its prerequisite spec is complete, but its
  required patch does not exist yet.

Proof helper spec decisions:

- Canonical signed fields are exactly `method`, `url`, `timestamp`, optional
  `nonce`, and optional `access_token_hash`.
- Canonical signing order is `method`, `url`, `timestamp`, `nonce`,
  `access_token_hash`, with optional fields omitted when absent.
- URLs must be absolute HTTPS URLs, have no userinfo, no fragments, no
  non-default ports, and match the native signing allowlist before signing.
- Alpha signing allowlist is exact: `https://api.echothink.ai/v1/`,
  `https://auth.echothink.ai/browser/`,
  `https://auth.echothink.ai/device/`, and
  `https://app.echothink.ai/api/`.
- `https://search.echothink.ai/*`, `https://updates.echothink.ai/*`,
  support/download pages, normal document navigations, New Tab URLs, optional
  `echo://` routes, and all third-party destinations are not eligible for proof
  signing.
- Malformed payloads return `invalid_payload`; allowlist failures return
  `disallowed_destination`.
- The safe helper result is an opaque header-ready proof result with public
  metadata only. It must not return private key material, DPAPI blobs, raw
  access tokens, canonical payload bytes, separate signature internals, replay
  history, or backend authorization decisions.
- Browser responsibilities are limited to caller checking, shape validation,
  canonicalization, allowlist enforcement, device-key signing, and returning the
  safe result.
- Backend/gateway responsibilities remain replay protection, nonce one-time-use
  validation, timestamp freshness, signature validation, access-token-hash
  validation when required, device/user/org binding, revocation checks,
  protected-resource authorization, and audit decisions.

Validation commands and results:

| Command | Result |
|---|---|
| `rtk rg -n "^\\| T24 \\|[^|]*\\|[^|]*\\|[^|]*\\| DONE \\|" echothink-studio-new/docs/progress.md` | Passed: T24 is marked `DONE`. |
| `rtk rg -n "^\\| T25 \\|[^|]*\\|[^|]*\\|[^|]*\\| DONE \\|" echothink-studio-new/docs/progress.md` | Passed: T25 is marked `DONE`. |
| `rtk rg -n "^\\| T26 \\|[^|]*\\|[^|]*\\|[^|]*\\| READY \\|" echothink-studio-new/docs/progress.md` | Passed: T26 is marked `READY`. |
| `rtk rg -n "^echothink/0024-narrow-extension-bridge\\.patch$" patches/series` | Passed: T24 bridge patch is active. |
| `rtk ls -l patches/echothink/0024-narrow-extension-bridge.patch patches/echothink/0007-device-identity.patch` | Passed: T24 and T23 patch artifacts exist. |
| `rtk rg -n "method|url|timestamp|nonce|access_token_hash|disallowed_destination|Backend-Owned Validation" echothink-studio-new/docs/echothink-browser-alpha/t25-define-request-proof-payload-and-allowlist.md` | Passed: canonical fields, rejection behavior, and backend-owned validation are documented. |
| `rtk rg -n "t25-define-request-proof-payload-and-allowlist|T25/T26|T26 still owns" echothink-studio-new/docs/ungoogled_to_echothink_browser_change_plan.md echothink-studio-new/docs/echothink_browser_construction.md` | Passed: broader browser Alpha docs point to the T25 source of truth. |
| `rtk python3 -m json.tool extensions/echothink-workspace/manifest.json` | Passed: extension manifest JSON parses. |
| `rtk rg -n "host_permissions|https://api.echothink.ai|https://app.echothink.ai|https://auth.echothink.ai|https://search.echothink.ai" extensions/echothink-workspace/manifest.json` | Passed: extension host-permission baseline was checked against the narrower signing allowlist. |
| `rtk ls -l patches/echothink/0008-request-proof-helper.patch` | Failed as expected: T26 has not yet created the proof helper patch. |
| `rtk rg -n "^echothink/0008-request-proof-helper\\.patch$" patches/series` | Exited 1 as expected: no inactive placeholder patch was added to `patches/series`. |
| `rtk rg -c "^echothink/" patches/series` | Passed: active Echothink patch count remains `17`. |
| `rtk python3 devutils/check_patch_files.py` | Passed, exit 0, for the unchanged active patch series. |
| `rtk python3 devutils/check_gn_flags.py` | Passed, exit 0. |
| `rtk python3 devutils/validate_config.py` | Passed, exit 0. |
| `rtk git diff --check` | Passed: no whitespace errors. |

Known limitations:

- This is a spec task. It does not create
  `patches/echothink/0008-request-proof-helper.patch` or modify
  `patches/series`.
- No browser binary was built or run, so no runtime proof-signing smoke test was
  performed.
- T27 remains blocked until T26 implements and validates the proof helper patch.

## T26 Notes

Changed documentation:

- `docs/echothink-browser-alpha/t26-implement-proof-signing-helper.md`
- `docs/progress.md`

Prerequisite status:

- T26 depends on T25.
- T25 is marked `DONE` and provides the M5 proof helper spec.
- T26 is now marked `READY`.

Implementation still needed:

- Create `patches/echothink/0008-request-proof-helper.patch`.
- Add `echothink/0008-request-proof-helper.patch` to `patches/series` when the
  patch exists and is active.
- Enforce the T25 canonical payload, allowlist, malformed-payload rejection,
  disallowed-destination rejection, and safe opaque result shape natively
  before any signature is returned.

Known limitations:

- This is a ready-state handoff, not the M5 proof signing helper
  implementation.
- T26 delivery criteria remain unmet until the helper patch is implemented,
  activated, and validated.

## T27 Notes

Changed documentation:

- `docs/echothink-browser-alpha/t27-integrate-proof-helper-into-extension-calls.md`
- `docs/progress.md`

Prerequisite status:

- T27 depends on T16, T24, and T26.
- T16 and T24 are marked `DONE`.
- T25 is marked `DONE` and provides the proof contract.
- T26 is marked `READY`, but no proof helper patch exists yet.
- T27 remains `BLOCKED` until T26 is `DONE`.

Blocked work:

- No extension API calls were updated to request proof signatures.
- No proof headers, proof metadata, `Authorization`, or `DPoP` headers were
  attached to Echothink API/chat calls.
- No extension files, manifest permissions, host permissions, Chromium patch
  files, or `patches/series` entries were changed.

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
- T05, T08, T10, T13, T19, T21, T23, and T31 are marked `DONE`.
- T24 is also marked `DONE` and active in `patches/series`.
- T25 is marked `DONE` and provides the final proof helper spec.
- T26 is marked `READY`, but no proof helper patch exists yet.
- No progress row or task note explicitly accepts incomplete T26 as a baseline
  dependency for T33.

Blocked delivery criteria:

- Full patch application against pinned Chromium `148.0.7778.178` was not run
  because the required Alpha patch set is incomplete.
- T33 cannot confirm that all required Alpha patches apply cleanly until
  `patches/echothink/0008-request-proof-helper.patch` exists and is active.
- No backend services, gateway logic, search ranking, chat orchestration,
  workflow orchestration, business pages, network stack, TLS validation,
  sandbox, renderer internals, downloads, history, bookmarks, password manager,
  cookies, or DevTools behavior was changed.

Current patch-series validation:

- Active series entries: 123.
- Inherited entries before the Echothink tail: 108.
- Echothink entries: 17.
- Last inherited entry:
  `extra/ungoogled-chromium/add-flag-for-disabling-jit.patch`.
- First Echothink entry: `echothink/0001-branding.patch`.
- Missing active series files: 0.
- Duplicate active series entries: 0.
- Existing Echothink entries form a contiguous tail after inherited patches.
- Required Alpha missing IDs:
  `echothink/0008-request-proof-helper.patch`.

Validation commands and results:

| Command | Result |
|---|---|
| `rtk rg -n "\\| T(05|08|10|13|19|21|23|25|26|31|33) \\|" echothink-studio-new/docs/progress.md` | Passed for prerequisite discovery: all T33 prerequisites except T26 are `DONE`; T25 is `DONE`; T26 is `READY`; T33 remains `BLOCKED`. |
| `rtk sed -n '840,861p' echothink-studio-new/docs/dag-doc.md` | Passed: T33 requires T05, T08, T10, T13, T19, T21, T23, T26, and T31. |
| `rtk ls -l patches/echothink/0006-login-gate.patch` | Passed: T21 login-gate patch exists. |
| `rtk rg -n "echothink/0006-login-gate.patch" patches/series` | Passed: T21 login-gate patch is active in the patch pipeline. |
| `rtk ls -l patches/echothink/0007-device-identity.patch` | Passed: T23 device identity patch exists. |
| `rtk rg -n "echothink/0007-device-identity.patch" patches/series` | Passed: T23 device identity patch is active in the patch pipeline. |
| `rtk ls -l patches/echothink/0008-request-proof-helper.patch` | Failed as expected: the remaining required proof helper patch is missing. |
| `rtk rg -n "echothink/0008-request-proof-helper.patch" patches/series` | Exited 1 as expected: inactive missing proof helper patch is not listed in the active pipeline. |
| Series structure Python check | Passed for current active series: `entries=125`, `inherited=108`, `echothink=17`, `missing_series_files=0`, `duplicates=0`, `echothink_tail_ok=True`; reported required Alpha missing ID `0008`. |
| `rtk python3 devutils/check_patch_files.py` | Passed, exit 0, for the current active incomplete series. |
| `rtk python3 devutils/check_gn_flags.py` | Passed, exit 0. |
| `rtk python3 devutils/validate_config.py` | Passed, exit 0, for the current active incomplete series. |

Known limitations:

- This is a blocker record, not the final M7 patch validation report.
- T34, T35, and T37 must remain blocked on T33 until T26 is complete
  and T33 is rerun.

## T34 Notes

Status: DONE (2026-05-29). Supersedes the earlier blocked T34 record; T33 is
now `DONE`, resolving the prior blocker.

Changed documentation:

- `docs/echothink-browser-alpha/t34-run-native-browser-regression-suite.md`
  (rewritten from blocker record to M7 native regression report)
- `docs/progress.md`

Prerequisite status:

- T34 depends on T33. T33 is now `DONE` (M7 patch validation report).
- The earlier blocker — missing `patches/echothink/0008-request-proof-helper.patch`
  (T26) — is resolved: T26, T27, and T33 are all `DONE` and the proof-helper
  patch is active in `patches/series`.

Regression method and result:

- Inventoried all 19 active Echothink patches (`patches/series` lines 113-131)
  and extracted 39 distinct touched files (`+++ b/...`).
- Negative subsystem grep over the touched-file list (`/bookmarks/`,
  `/history/`, `/download`, `/password_manager/`, `net/cookies`, `dom_storage`,
  `content/browser/storage`, `/ssl/`, `cert_verif`, `/devtools/`, `tab_strip`,
  `/tabs/`, `browser_window`, `/popup`, `/sandbox/`, `/renderer/`) returned
  **0 matches** — no native primitive subsystem source is modified.
- Read every shared-file hunk at a primitive intersection and confirmed each is
  additive: navigation URL gate inside `Navigate()` (0006/0009/0012; native
  tab/window/popup machinery intact, intended T21 behavior), one component
  allowlist entry + one `Add()` call (0004), one allowlisted `echothinkDevice`
  API feature + IDL source (0024), default-bookmark seed via preferences/HTML
  (0002).
- **No blocker (or any) native-primitive regression found.** Chromium-native
  ownership of tabs, windows, popups, history, downloads, bookmarks, password
  manager, cookies, local storage, TLS, DevTools, and extension loading is
  preserved at source level.

Chromium-native ownership:

- T34 made no browser patch, source, extension, asset, or packaging change; it
  is a validation-only pass.
- Confirmed no Echothink patch replaces or weakens any native primitive.

Validation commands and results:

| Command | Result |
|---|---|
| `grep -nE "^\| ?T33 ?\|" docs/progress.md` | T33 is `DONE` — prerequisite satisfied. |
| `grep -n "echothink/" patches/series` | 19 active Echothink entries (lines 113-131), all after the inherited block. |
| `grep -hE "^\+\+\+ " patches/echothink/*.patch \| sort -u` | 39 distinct touched files inventoried. |
| Negative subsystem grep over the touched-file list | **0 matches** — no native primitive subsystem source touched. |
| Read hunks for 0006/0004/0024 | All additive; no primitive replaced. |
| `python3 devutils/check_patch_files.py` | exit 0. |
| `python3 devutils/check_gn_flags.py` | exit 0. |
| `python3 devutils/validate_config.py` | exit 0. |

Known limitations:

- This is a source-level native-primitive-ownership regression pass plus repo
  structural validation; it does not launch a built browser binary.
- No local Chromium `148.0.7778.178` build exists in this environment (same
  limitation as T33/T03 #4), so live runtime browser smoke was not run.
- Runtime exercise of each primitive on an installed build is owned by T36
  (Windows packaging smoke) and T37 (Windows Alpha candidate).

## T35 Notes

Changed documentation:

- `docs/echothink-browser-alpha/t35-run-echothink-behavior-tests.md`
- `docs/progress.md`

Prerequisite status:

- T35 depends on T33.
- T33 is marked `BLOCKED`, not `DONE`.
- T33 records that T34, T35, and T37 must remain blocked until T26 is complete
  and T33 is rerun.
- No progress row or task note explicitly accepts incomplete T33 as a baseline
  dependency for T35.

Blocked delivery criteria:

- No M7 Echothink behavior test pass was run.
- No validated full Alpha browser candidate exists for this behavior pass,
  because T33 did not complete full inherited-plus-Echothink patch validation.
- Login gate and allowlist behavior cannot be marked passed by T35 until T33
  validates the full Alpha patch set and T35 runs against a browser candidate.
- Device identity persistence was not run because T33 is blocked and no
  validated Alpha browser candidate exists.
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
| Login gate and allowlist behavior | Not run: T21 provides `0006-login-gate.patch`, but T35 is blocked on T33. |
| Device identity persistence | Not run: T23 provides `0007-device-identity.patch`, but T35 is blocked on T33. |
| Proof helper signs only allowed Echothink URLs | Blocked: no `0008-request-proof-helper.patch`. |
| Optional `echo://` routes | Not run: T35 blocked on T33. |

Validation commands and results:

| Command | Result |
|---|---|
| `rtk rg -n "^\\| T33 \\|[^|]*\\|[^|]*\\|[^|]*\\| DONE \\|" echothink-studio-new/docs/progress.md` | Exited 1 as expected: T33 is not marked `DONE`. |
| `rtk rg -n "^\\| T33 \\|[^|]*\\|[^|]*\\|[^|]*\\| BLOCKED \\|" echothink-studio-new/docs/progress.md` | Passed: progress marks T33 `BLOCKED`. |
| `rtk rg -n "T34, T35, and T37 must remain blocked on T33|Status: BLOCKED" echothink-studio-new/docs/echothink-browser-alpha/t33-run-full-patch-validation.md` | Passed: the T33 task note blocks T35. |
| `rtk ls -l patches/echothink/0006-login-gate.patch` | Passed: T21 login-gate patch exists. |
| `rtk rg -n "echothink/0006-login-gate.patch" patches/series` | Passed: T21 login-gate patch is active in the patch pipeline. |
| `rtk ls -l patches/echothink/0007-device-identity.patch` | Passed: T23 device identity patch exists. |
| `rtk rg -n "echothink/0007-device-identity.patch" patches/series` | Passed: T23 device identity patch is active in the patch pipeline. |
| `rtk ls -l patches/echothink/0008-request-proof-helper.patch` | Failed as expected: the required proof helper patch is missing. |
| `rtk rg -n "echothink/0008-request-proof-helper.patch" patches/series` | Exited 1 as expected: inactive missing proof helper patch is not listed in the active patch pipeline. |
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
| `rtk rg -n "^Status: BLOCKED|T33 is blocked|0008-request-proof-helper" echothink-studio-new/docs/echothink-browser-alpha/t35-run-echothink-behavior-tests.md` | Passed: T35 records the remaining blocking missing artifact. |
| `rtk ls -l patches/echothink/0006-login-gate.patch` | Passed: T21 login-gate patch exists. |
| `rtk rg -n "echothink/0006-login-gate.patch" patches/series` | Passed: T21 login-gate patch is active in the patch pipeline. |
| `rtk ls -l patches/echothink/0007-device-identity.patch` | Passed: T23 device identity patch exists. |
| `rtk ls -l patches/echothink/0008-request-proof-helper.patch` | Failed as expected: the remaining required proof helper patch is missing. |
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
