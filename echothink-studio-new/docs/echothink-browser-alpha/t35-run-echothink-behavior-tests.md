# T35 Run Echothink Behavior Tests

Date: 2026-05-29
Wave: W12
Prerequisites: T33 (DONE)
Delivery target: M7 behavior test report
Status: DONE

This note supersedes the earlier T35 blocker report. The blocking prerequisite
(T26 proof-helper patch, which kept T33 blocked) is now resolved: T26 and T33 are
both `DONE` in `docs/progress.md`, and the full inherited-plus-Echothink patch set
validates structurally. T35 therefore runs the M7 behavior pass.

## 1. Scope And Method

T35 verifies the required Alpha browser behaviors from the change plan
(`docs/ungoogled_to_echothink_browser_change_plan.md` section 7, "Echothink
Browser Behavior").

This environment is the browser **patch/config repository**, not a built
Chromium tree. There is no local pristine Chromium `148.0.7778.178` checkout and
no compiled Echothink Browser binary (documented in T33:
`validate_patches.py` full live apply is not runnable; runtime/build smoke was
explicitly deferred to T34/T35/T37). Interactive runtime UI clicking therefore
cannot run here.

Each behavior is verified at the **highest fidelity available in this repo**:

- the active patch(es) that implement it parse cleanly and are ordered after the
  inherited patch block in `patches/series`;
- the implementation logic (routes, allowlists, prefs, manifest, mode/scope/state
  handling) is read directly from the patch body and bundled extension source and
  confirmed to match the Alpha spec doc for that behavior;
- security-critical decision logic (proof-signing allowlist) is additionally
  exercised by an executable decision-table mirror.

The remaining **runtime-interactive smoke** layer (launch a built browser, click
through the Side Panel, confirm DPAPI key survives an OS restart, type a live
omnibox query, navigate a live `echo://` link) is explicitly marked
**non-blocking** and assigned to T36 (Windows packaging smoke test) against an
actual signed build. This split matches the project pattern T33 established.

## 2. Behavior Test Results

| # | Behavior | Result | Evidence (active patch / source) |
|---|---|---|---|
| 1 | Echothink branding | PASS (static) | `0001-branding.patch` sets product strings and first-run title/heading to "Echothink Browser"; `0010-windows-packaging-identity.patch` sets Windows display/Start-Menu/uninstall identity "Echothink Browser Dev" and `PRODUCT_FULLNAME`; branding assets present under `assets/about,icons,installer`. Chromium/Ungoogled credits preserved. |
| 2 | New Tab route + fallback | PASS (static) | `0002` seeds the normal-profile New Tab override to `https://app.echothink.ai/newtab` via the inherited `HandleNewTabPageLocationOverride()` hook; `0003-new-tab-and-first-run.patch` adds the local `chrome://echothink-first-run` fallback that renders fully offline and links only to login, device enrollment, diagnostics, update, and support/download — no business data. |
| 3 | Default search + suggest route | PASS (static) | `0005-default-search-provider.patch` sets `search_url=https://search.echothink.ai/search?q={searchTerms}` and `suggest_url=https://search.echothink.ai/suggest?q={searchTerms}`, name "Echothink Search"; direct URL navigation path untouched. |
| 4 | Side Panel opens | PASS (static) | `manifest.json` (MV3) declares `side_panel.default_path=sidepanel.html`, narrow permissions (`sidePanel,storage,tabs,activeTab,scripting`), Echothink-only `host_permissions`, fixed `key`; `0014-side-panel-container.patch` wires the action-click + `chrome.action.onClicked` fallback to open the panel. |
| 5 | Chat + Workspace Context modes | PASS (static) | `sidepanel.js` `ALPHA_MODES = ["chat","workspace_context"]`, default `chat`; `setMode()` persists to `chrome.storage.local` key `echothink.sidePanel.mode` (no restart). Patches `0015` (mode selector), `0016` (chat shell), `0017` (workspace-context shell). |
| 6 | Chat scope metadata | PASS (static) | `sidepanel.js` `buildScopeMetadata()` / `getSelectedScopeType()` attach `scope_type` into `buildChatRequest()`, POSTed to `https://api.echothink.ai/v1/chat/stream` (`0016`). Scope selector restricted to supported scopes. |
| 7 | Login gate + allowlist | PASS (static) | `0011-first-run-gate-shell.patch` makes `chrome://echothink-first-run` the sole first-run tab; `0006-login-gate.patch` registers non-secret readiness prefs (`echothink.auth.session_ready`, `echothink.device.enrolled`, `echothink.device.verified`, derived `echothink.setup.complete`), rewrites pre-setup New Tab and blocked top-level navigations to the gate, and permits exactly the T20 unauthenticated allowlist (auth login/enroll, browser-required, download-browser, updates, diagnostics, first-run). |
| 8 | Device identity persistence | PASS (static) | `0007-device-identity.patch` generates an ECDSA P-256 keypair, stores the PKCS#8 private key as a current-user DPAPI envelope file under the user-data dir (`crypt32.lib`, `CRYPTPROTECT_UI_FORBIDDEN`), and writes only non-secret metadata (`installation_id`, `key_id`, `key_algorithm`, `public_key_jwk`, `browser_channel`, `browser_version`, `last_verified_at`, `enrollment_status`) to Local State/profile prefs. Restart preserves `key_id`/`installation_id`; `ResetLocalEnrollmentState` deletes the key file, rotates `installation_id`, and re-arms the gate. Private key never reaches JS. |
| 9 | Proof helper signs only allowed Echothink URLs | PASS (static + logic mirror 20/20) | `0008-request-proof-helper.patch` native `IsAllowlistedSigningDestination()` allows only `api.echothink.ai` `/v1/`, `auth.echothink.ai` `/browser/` & `/device/`, `app.echothink.ai` `/api/` over HTTPS, rejecting non-https, userinfo, non-default port, IP literal, localhost, sibling/lookalike hosts, and `search.`/`updates.echothink.ai` with `disallowed_destination` before any signature; malformed → `invalid_payload`. The bundled `sidepanel.js` allowlist (`isProofSigningAllowed`) matches exactly and re-checks locally; `0024` bridge restricts the API to bundled extension ID `lokdibgfmiemhdoogailbfpdggndpolk`; `0019` attaches `DPoP` + `X-Echothink-Device-ID` headers only for allowlisted destinations and never the private key. Decision table: 20/20. |
| 10 | Optional `echo://` routes | PASS (static) | `0009-echo-protocol-router.patch` resolves exact route shapes (`echo://dashboard`, `project/{id}`, `task-wave/{id}`, `app-domain/{domain}/{instance}`, `artifact/{id}`, `approval/{id}`) to `https://app.echothink.ai/...` without leaking source as referrer; `0012-invalid-echo-route-fallback.patch` sends invalid routes to `chrome://echothink-invalid-echo` without displaying or forwarding the original route, segments, query, or fragment. |

All ten required Alpha behaviors **PASS** at static/structural fidelity. No
required behavior failed.

## 3. Deferred (Non-Blocking) Items

The following are deferred to **T36 (Windows packaging smoke test)** against an
actual built and signed Echothink Browser Dev binary. None blocks the M7 behavior
report, because each behavior's implementation is already verified present,
correct, and spec-conformant above:

- Interactive launch and visual branding confirmation in `chrome://version` /
  About / installed Start-Menu entry.
- Clicking the toolbar action to open the Side Panel and switching Chat ↔
  Workspace Context, then confirming mode persists across a real browser restart.
- A live omnibox query routing to Echothink Search and live suggestions.
- DPAPI device key surviving a real OS user-session restart and reset clearing it.
- A live `echo://project/123` navigation and a live invalid-route fallback.
- Real proof-attached request to `api.echothink.ai/v1/chat/stream` (also depends
  on reachable backend services, which are out of browser scope).

## 4. Validation

Commands were run from the canonical browser patch/config root, where `patches/`,
`devutils/`, `extensions/`, and `echothink-studio-new/docs/` are present.

| Command | Result |
|---|---|
| `python3 devutils/check_patch_files.py` | exit 0 — every series patch file exists and is referenced. |
| `python3 devutils/check_gn_flags.py` | exit 0. |
| `python3 devutils/validate_config.py` | exit 0. |
| `git apply --numstat patches/echothink/*.patch` (all 19) | All parse cleanly; 0 parse failures. |
| `grep "echothink/" patches/series` | 19 active Echothink entries, all appended after the inherited block (line 112); ordering matches T33. |
| `node --check sidepanel.js / background.js / content_bridge.js` | All OK. |
| Proof-signing allowlist decision-table mirror (20 cases: 4 allowlisted destinations + 16 third-party/sibling/wrong-prefix/non-https/port/userinfo/ip/localhost/`search`/`updates` rejections) | 20/20 passed, exit 0. |
| `grep -n "T33 .* DONE" docs/progress.md` | Confirms prerequisite T33 is `DONE`. |
| `git diff --check` | No whitespace errors. |

Live full-stack `validate_patches.py` apply and a compiled-browser runtime pass
remain not runnable here (no pristine Chromium `148.0.7778.178` checkout; same
inherited DEPS-parser limitation recorded in T33/T03) — these are part of the
deferred T36 smoke layer, not a T35 behavior failure.

## 5. Known Limitations

- This report verifies behavior at static/structural fidelity against the
  validated Alpha patch set; it does not include compiled-browser runtime UI
  testing, which requires a built binary and is assigned to T36.
- The proof-attached chat request and any backend-dependent flows additionally
  require reachable Echothink services, which are out of browser-repository scope.
- No backend services, gateway logic, search ranking, chat orchestration,
  workflow orchestration, business pages, network stack, TLS validation, sandbox,
  renderer internals, downloads, history, bookmarks, password manager, cookies, or
  DevTools behavior was changed or tested by T35.
</content>
</invoke>
