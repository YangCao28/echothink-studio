# Browser-Only Change Plan: Ungoogled Chromium To Echothink Browser

Version: 1.0
Date: 2026-05-28
Scope: Browser repository changes only

## 1. Goal

Transform the current Ungoogled Chromium patch/config repository into a
Windows-first Echothink Browser distribution.

The target browser should remain a thin Chromium-based workspace client. It
should keep native Chromium browser primitives intact and add only the
Echothink browser layer:

- Product branding
- Default policies and preferences
- Echothink New Tab entry
- Echothink Side Panel shell
- Default Echothink Search provider
- Login-required startup gate
- Browser-bound device identity
- Request proof helper
- Bundled trusted workspace extension
- Optional `echo://` navigation routes
- Windows packaging and release setup

This plan does not implement backend services, gateway authorization, search
ranking, chat services, workflow orchestration, or business pages.

## 2. Current Starting Point

The current repository is an Ungoogled Chromium common patch/config repository.

Current important assets:

```text
chromium_version.txt
revision.txt
flags.gn
downloads.ini
pruning.list
domain_regex.list
domain_substitution.list
patches/series
patches/core/
patches/extra/
utils/
devutils/
docs/
```

Current Chromium pin:

```text
148.0.7778.178
```

The rewrite should preserve the existing patch pipeline:

```text
download Chromium
prune binaries
apply inherited patches
apply Echothink patches
apply domain substitution
generate GN build
build Chromium target
package Echothink Browser
```

## 3. Scope Boundaries

### In Scope

- Browser patch organization
- Product name and visual branding
- Windows application identity
- Browser defaults
- New Tab override
- Bundled workspace extension
- Side Panel shell and mode switching
- Chat panel UI shell and scope selection
- Workspace context panel UI shell
- Default search provider configuration
- Login gate inside browser startup/navigation flow
- Local device identity generation and secure storage
- Browser-side DPoP signing helper
- Optional `echo://` route resolution
- Browser-side update client configuration
- Windows build, signing, installer, smoke tests, and release channels

### Out Of Scope

- App service implementation
- Auth service implementation
- Search service implementation
- Chat service implementation
- API service implementation
- Gateway implementation
- Backend authorization rules
- Audit-log service
- Workflow execution
- Project, Task Wave, App Domain, Artifact, or Approval business logic
- Replacing native Chromium tabs, windows, history, downloads, bookmarks,
  passwords, cookies, rendering, TLS, sandbox, or DevTools

## 4. Patch Layer Strategy

Add a dedicated Echothink patch namespace:

```text
patches/echothink/
```

Append Echothink patches after the existing inherited patches in
`patches/series`.

Recommended order:

```text
echothink/0001-branding.patch
echothink/0002-default-policies-and-preferences.patch
echothink/0003-new-tab-and-first-run.patch
echothink/0004-bundled-workspace-extension.patch
echothink/0005-default-search-provider.patch
echothink/0006-login-gate.patch
echothink/0007-device-identity.patch
echothink/0008-request-proof-helper.patch
echothink/0009-echo-protocol-router.patch
echothink/0010-windows-packaging-identity.patch
```

Rules for Echothink patches:

- Keep patches small and single-purpose.
- Prefer policy, preferences, extension APIs, and existing Chromium hooks before
  native code changes.
- Do not alter security-critical Chromium primitives unless a separate security
  review approves it.
- Every patch must include a short header explaining why the change belongs in
  the browser rather than a backend service.
- The detailed Alpha patch convention is defined in
  `docs/echothink-browser-alpha/t01-define-echothink-patch-discipline.md`.

## 5. Browser Change Set

### 5.1 Repository Identity And Documentation

Change the repo presentation from a generic Ungoogled Chromium patch repo to
Echothink Browser while preserving upstream attribution.

Implementation:

- Rewrite `README.md` for Echothink Browser.
- Keep a section named `Upstream Relationship` explaining Chromium and
  Ungoogled Chromium inheritance.
- Add browser-only docs:
  - construction plan
  - browser change plan
  - patch discipline
  - Windows build notes
  - release checklist
  - security boundary notes
- Keep original license and third-party notices.
- Do not remove upstream credit.

Acceptance:

- A new engineer can tell this is an Echothink Browser repo.
- A new engineer can still identify inherited Chromium/Ungoogled tooling.

### 5.2 Product Branding

Replace visible Chromium/Ungoogled Chromium product identity with Echothink
Browser where appropriate.

Implementation:

- Product name: `Echothink Browser`
- Application display name: `Echothink Browser`
- Windows installer name: `EchothinkBrowserSetup`
- Windows Start Menu entry: `Echothink Browser`
- Executable naming decision:
  - Alpha can keep Chromium executable internals if this reduces patch risk.
  - Public Beta should use Echothink-branded installer and app display identity.
- Add Echothink icon assets in:
  ```text
  assets/icons/
  assets/installer/
  assets/about/
  ```
- Patch product strings and about-page branding through the smallest stable
  Chromium insertion points.
- Use the Alpha branding inventory in
  `docs/echothink-browser-alpha/t04-define-product-branding-inventory.md` as
  the source of truth for product strings, Windows display names, installer
  name, first-run/About copy requirements, icon sizes, and attribution rules.

Acceptance:

- Installed browser appears as Echothink Browser to users.
- About and first-run surfaces show Echothink Browser.
- Chromium and Ungoogled Chromium credits remain available.

### 5.3 Default Policies And Preferences

Configure Echothink defaults without changing core browser behavior.

Implementation:

- Default homepage:
  ```text
  https://app.echothink.ai/dashboard
  ```
- Default New Tab:
  ```text
  https://app.echothink.ai/newtab
  ```
- Default search provider:
  ```text
  https://search.echothink.ai/search?q={searchTerms}
  ```
- Default suggestions provider:
  ```text
  https://search.echothink.ai/suggest?q={searchTerms}
  ```
- Default bookmarks:
  - Echothink Workspace
  - Echothink Search
  - Echothink Support
  - Browser Update / Download page
- The detailed Alpha defaults spec is maintained in
  `docs/echothink-browser-alpha/t07-define-default-policy-preference-set.md`.
  It is the source of truth for the default route values, bookmark set,
  policy/preference surface preference, and enterprise-safe defaults.
- Enterprise defaults:
  - Preserve DevTools unless policy disables it.
  - Preserve password manager unless policy disables it.
  - Preserve downloads, history, bookmarks, cookies, and site storage.

Acceptance:

- First launch uses Echothink defaults.
- User-visible native browser features still behave like Chromium.
- Defaults can be overridden by enterprise policy where appropriate.

### 5.4 New Tab And First-Run Shell

Use the existing custom New Tab patch pattern as the first insertion point.
The detailed Alpha hook decision is recorded in
`docs/echothink-browser-alpha/t09-confirm-new-tab-insertion-point.md`: use the
existing `HandleNewTabPageLocationOverride()` path, prefer the normal-profile
New Tab override preference for `https://app.echothink.ai/newtab`, and avoid a
global `--custom-ntp` default because it can affect incognito external New Tab
behavior.

Implementation:

- Route normal New Tab to:
  ```text
  https://app.echothink.ai/newtab
  ```
- Add a minimal built-in fallback page for unavailable or unauthenticated state.
- Fallback page can link only to:
  - login
  - device enrollment
  - diagnostics
  - update
  - support/download
- First-run flow should open the login gate before general browsing.

Acceptance:

- New Tab consistently opens the Echothink workspace route.
- Offline or unauthenticated state does not expose a full general-purpose
  browser workspace.
- The fallback page contains no business data.

### 5.5 Bundled Workspace Extension

Add a trusted Manifest V3 extension as the first implementation of the
Echothink workspace shell.

Repository location:

```text
extensions/echothink-workspace/
```

Recommended files:

```text
manifest.json
background.js
sidepanel.html
sidepanel.js
sidepanel.css
content_bridge.js
assets/
```

Minimum permissions:

```text
sidePanel
storage
tabs
activeTab
scripting
```

Host permissions should be limited to Echothink-owned domains:

```text
https://app.echothink.ai/*
https://auth.echothink.ai/*
https://api.echothink.ai/*
https://search.echothink.ai/*
```

Alpha implementation details are recorded in:

- `docs/echothink-browser-alpha/t12-scaffold-bundled-workspace-extension.md`
- `docs/echothink-browser-alpha/t13-add-bundled-extension-install-patch.md`
- `docs/echothink-browser-alpha/t14-implement-side-panel-container.md`

T13 bundles the extension as a Chromium component extension with fixed ID
`lokdibgfmiemhdoogailbfpdggndpolk`, no `update_url`, and the same narrow
permission set listed above.

T14 keeps the Side Panel browser UI entry inside the bundled MV3 extension: the
extension action configures Chromium's Side Panel action-click behavior and has
an explicit `chrome.action.onClicked` fallback that opens `sidepanel.html`.

Acceptance:

- Extension is installed by default with the browser.
- Extension cannot be silently replaced by a public web-store extension.
- Extension permissions are narrow and documented.
- Extension does not contain business workflow logic.

### 5.6 Side Panel Shell

The Side Panel must provide two switchable modes.

Mode selector:

- Always visible at the top of the panel.
- Stores last selected mode in profile-local extension storage.
- Does not require a browser restart.

Mode 1: Chat Panel

- User can choose chat scope before or during conversation.
- Alpha scopes:
  - Current page
  - Current project
  - Current App Domain
  - Current Task Wave
  - Recent artifacts
  - Organization workspace, if authorized by backend
- Browser extension collects selected scope metadata.
- Browser extension sends messages to remote chat API when available.
- Browser extension supports streaming responses when available.
- Browser extension shows local UI states for:
  - not signed in
  - no device identity
  - unauthorized scope
  - offline
  - remote service error
- Conversation persistence and model orchestration remain outside the browser.

Mode 2: Workspace Context

- Current project context
- Current App Domain context
- Current Task Wave status
- Agent console entry
- Pending approval prompts
- Recent artifacts
- Project navigation
- Notifications
- Quick actions

Acceptance:

- User can switch between Chat Panel and Workspace Context.
- The selected mode persists across browser restart.
- Chat scope selector is visible and included in outbound request metadata.
- Workspace Context mode can render service-provided content.
- Business logic stays outside the extension.

### 5.7 Default Search Provider

Configure Echothink Search as the default provider.

Implementation preference:

1. Policy or master preferences.
2. Minimal preference patch if policy is insufficient.
3. Avoid omnibox internals.

Search URL:

```text
https://search.echothink.ai/search?q={searchTerms}
```

Suggestions URL:

```text
https://search.echothink.ai/suggest?q={searchTerms}
```

Acceptance:

- Typing a search in the omnibox routes to Echothink Search.
- Suggestions, when enabled, call Echothink suggest.
- Direct URL navigation still works normally.

### 5.8 Login Gate

Add a browser-side gate so the browser does not present itself as a normal
general-purpose browser before identity is established.

Implementation:

- On first launch, open the login gate.
- Track local auth/device readiness state in profile preferences.
- Allow unauthenticated navigation only to a small allowlist.
- Block or redirect other normal navigation until login/device setup completes.
- Show a local explanation page when access is blocked.

Allowed unauthenticated destinations:

```text
https://auth.echothink.ai/login
https://auth.echothink.ai/device/enroll
https://app.echothink.ai/browser-required
https://app.echothink.ai/download-browser
https://updates.echothink.ai/
chrome://echothink-diagnostics
chrome://echothink-first-run
```

Acceptance:

- First launch forces login or enrollment path.
- User cannot browse arbitrary sites before identity is established.
- Diagnostics and support paths remain available.
- Once identity is established, normal Chromium browsing works.

### 5.9 Device Identity

Add a local browser component or native extension bridge for device identity.

Implementation:

- Generate an asymmetric keypair per browser installation.
- Store private key using Windows DPAPI for Alpha.
- Store non-secret metadata in profile preferences or local state:
  ```text
  device_id
  installation_id
  browser_channel
  browser_version
  enrollment_status
  last_verified_at
  ```
- Expose a narrow browser-side API to the bundled extension:
  - get device status
  - request enrollment challenge
  - sign proof payload
  - clear local enrollment on explicit logout/reset
- Never expose the private key to extension JavaScript.

Acceptance:

- Device identity persists across browser restart.
- Private key is protected by Windows DPAPI.
- Extension can request signatures but cannot read the private key.
- Local reset removes enrollment state.

### 5.10 Request Proof Helper

Add browser-side support for signing request proofs used by protected APIs.

Implementation:

- Build a native helper or browser component that signs proof payloads with the
  local device private key.
- Extension sends canonical request data to the helper:
  ```text
  method
  url
  timestamp
  nonce, if supplied
  access token hash, if required
  ```
- Helper returns signed proof only for allowed Echothink domains.
- Helper rejects signing for arbitrary third-party origins.
- Keep replay protection and proof validation out of the browser.

Acceptance:

- Extension can attach a proof to Echothink API requests.
- Helper refuses to sign non-Echothink destinations.
- Proof signing does not weaken Chromium TLS or network behavior.

### 5.11 Optional Echo Protocol Router

Add `echo://` only as a convenience navigation helper.

Implementation:

- Register internal route handling for:
  ```text
  echo://dashboard
  echo://project/{project_id}
  echo://task-wave/{wave_id}
  echo://app-domain/{domain}/{instance_id}
  echo://artifact/{artifact_id}
  echo://approval/{approval_id}
  ```
- Resolve routes to HTTPS destinations under Echothink domains.
- Do not bypass backend authorization.
- Do not treat `echo://` as proof of browser authenticity.

Acceptance:

- `echo://project/123` navigates to the matching HTTPS app route.
- Invalid routes show a local route-error page.
- Route resolution does not expose protected data.

### 5.12 Windows Packaging And Update Client

Make Windows the first production target.

Implementation:

- Add Windows build documentation under:
  ```text
  build/windows/
  ```
- Define application identity, installer naming, and channel naming.
- Prepare signing workflow documentation.
- Configure browser-side update URL/channel metadata when the update service is
  available.
- Add smoke test script for installed browser.

The detailed Alpha Windows identity and channel spec is maintained in
`docs/echothink-browser-alpha/t30-define-windows-app-identity-and-channels.md`.
It is the source of truth for the Windows display name, Start Menu name,
`EchothinkBrowserSetup` installer stem, channel IDs and labels, Alpha-versus-Beta
branding tradeoff, and update-channel metadata contract expected by packaging.

The active Alpha implementation patch is
`patches/echothink/0010-windows-packaging-identity.patch`, with task details in
`docs/echothink-browser-alpha/t31-implement-windows-packaging-identity-patch.md`.
It sets the Windows Alpha Dev app/install identity and version label while
deliberately keeping Chromium-derived executable internals unchanged for Alpha.

The Windows Alpha release runbook is maintained in
`docs/echothink-browser-alpha/t32-add-windows-build-signing-smoke-docs.md`.
For Alpha, it selects Chromium `mini_installer`, defines the
`EchothinkBrowserSetup-Dev-x64-148.0.7778.178-alpha.<build>.exe` artifact
shape, signing workflow, sidecar update-channel metadata, and the manual smoke
procedure for launch, branding, New Tab, Side Panel, search, restart, and
uninstall. The earlier planned `build/windows/` path remains a future home for
scripts or duplicated release docs when non-doc artifact creation is allowed.

Channels:

```text
Canary
Dev
Beta
Stable
Enterprise Stable
```

Acceptance:

- Windows build can be produced from the repo instructions.
- Installer identity is Echothink Browser.
- Channel is visible in About/version surfaces.
- Packaging metadata carries the canonical channel ID and update track.
- Smoke test can verify launch, branding, New Tab, Side Panel, search provider,
  restart persistence, and uninstall.

## 6. Recommended Implementation Sequence

### Phase 0: Repository Preparation

Tasks:

- Add `patches/echothink/`.
- Add placeholder entries to `patches/series` only when patches exist.
- Add `extensions/echothink-workspace/`.
- Add `assets/`.
- Add `build/windows/`.
- Add browser-only docs.

The detailed Alpha repository skeleton plan for these paths is maintained in
`docs/echothink-browser-alpha/t02-define-echothink-repo-structure.md`. It
defines the owner, purpose, and expected contents of each path, when
`patches/series` entries may be added (only when a real patch file exists), and
that placeholder directories/files and generated build artifacts are not
committed.

Done when:

- Existing validation still passes.
- New folders do not disturb inherited patch tooling.

### Phase 1: Branding And Defaults

Tasks:

- Add product strings and icon assets.
- Add default homepage, bookmarks, and policies.
- Add Echothink default search provider.

Done when:

- Browser launches with Echothink-visible identity.
- Omnibox search uses Echothink Search.
- Native Chromium behavior remains unchanged.

### Phase 2: New Tab And First-Run

Tasks:

- Route New Tab to Echothink workspace URL.
- Add minimal local first-run page.
- Add fallback unauthenticated/offline page.

Done when:

- New tabs open Echothink workspace.
- First-run path leads to login/enrollment.
- Fallback pages contain no protected content.

### Phase 3: Bundled Extension And Side Panel

Tasks:

- Bundle the trusted workspace extension.
- Add Side Panel entry.
- Implement Chat Panel and Workspace Context mode switching.
- Implement chat scope selector.
- Add local UI states for unauthenticated, offline, unauthorized, and error
  cases.

Done when:

- Side Panel opens by default or from toolbar entry.
- User can switch modes.
- Mode persists per profile.
- Chat requests include selected scope metadata.

### Phase 4: Login Gate

Tasks:

- Add profile/local-state auth readiness flags.
- Open login gate on first launch.
- Add unauthenticated navigation allowlist.
- Add blocked-navigation explanation page.

Done when:

- Browser cannot be used as a general-purpose browser before setup.
- Allowed setup/support routes still work.
- Normal browsing returns after successful setup.

### Phase 5: Device Identity And Proof Signing

Tasks:

- Generate local device keypair.
- Store private key with Windows DPAPI.
- Add narrow signing API for bundled extension.
- Add proof helper domain allowlist.

Done when:

- Device key persists across restart.
- Extension can request signatures.
- Extension cannot read private key.
- Helper signs only Echothink destinations.

### Phase 6: Optional Echo Router

Tasks:

- Add `echo://` route resolver.
- Map known routes to HTTPS app URLs.
- Add invalid route fallback page.

Done when:

- Valid routes navigate correctly.
- Invalid routes fail safely.
- No authorization logic lives in the router.

### Phase 7: Windows Release Readiness

Tasks:

- Add Windows build notes.
- Add installer identity notes.
- Add signing workflow notes.
- Add smoke test script.
- Add release checklist.
- Use `patches/echothink/0010-windows-packaging-identity.patch` as the active
  Alpha Dev packaging identity baseline.

Done when:

- A Windows Alpha build can be produced and manually tested.
- Smoke test covers launch, branding, New Tab, Side Panel, and search.

## 7. Browser-Only Test Plan

### Patch Validation

- Validate all patch paths in `patches/series`.
- Apply inherited patches plus Echothink patches to the pinned Chromium source.
- Run existing `utils` and `devutils` tests.
- Verify Echothink patches are ordered after inherited patches.

### Native Browser Regression

Confirm these remain Chromium-native:

- Tabs
- Windows
- Popups
- History
- Downloads
- Bookmarks
- Password manager
- Cookies and site storage
- TLS certificate validation
- DevTools
- Extension loading

### Echothink Browser Behavior

- Product branding appears correctly.
- New Tab opens Echothink workspace URL.
- Default search uses Echothink Search.
- Suggestions use Echothink suggest URL when enabled.
- Side Panel opens.
- Side Panel mode switch works.
- Chat scope selector works.
- Workspace Context mode renders.
- Login gate appears before setup.
- Allowed unauthenticated routes work.
- Blocked unauthenticated routes show local explanation.
- Device identity persists across restart.
- Request proof helper signs only allowed Echothink URLs.
- Optional `echo://` routes resolve to HTTPS.

### Windows Packaging Smoke Test

- Install browser on clean Windows machine.
- Launch from Start Menu.
- Verify application name and icon.
- Verify New Tab.
- Verify Side Panel.
- Verify omnibox search.
- Restart browser and verify persisted Side Panel mode.
- Uninstall browser.

## 8. Browser Acceptance Criteria

Alpha is complete from the browser side when:

- Existing Ungoogled Chromium patch pipeline still works.
- Echothink patches are isolated under `patches/echothink/`.
- Browser is visibly branded as Echothink Browser.
- New Tab routes to Echothink workspace.
- Side Panel is available through bundled trusted extension.
- Side Panel has Chat Panel and Workspace Context modes.
- Chat Panel supports user-selected scope metadata.
- Default search provider is Echothink Search.
- Login gate prevents general browsing before setup.
- Device identity can be generated and stored with Windows DPAPI.
- Request proof signing is available to the bundled extension only through a
  narrow API.
- Native Chromium primitives still pass regression checks.
- Windows packaging path is documented.

## 9. Explicitly Deferred Browser Work

These browser-side items should be deferred until after Alpha unless they become
blocking:

- Native Chromium Side Panel replacement for extension Side Panel
- TPM-backed key storage
- macOS Keychain support
- Linux keyring/libsecret support
- Enterprise mTLS client certificate mode
- Deep project-aware history index
- Download artifact metadata overlay
- Bookmark collection overlay
- Native `echo://` deep integration beyond simple route mapping
- Managed enterprise policy console
