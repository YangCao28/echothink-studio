# Echothink Browser Construction Design And Delivery Plan

Version: 1.0
Date: 2026-05-28
Target: Windows-first Echothink Browser Alpha

## 1. Purpose

This document defines how to construct Echothink Browser from the current
Ungoogled Chromium patch repository into a Windows-first browser distribution.
It is intended as an engineering handoff: it describes the architecture,
technical boundaries, repository layout, implementation sequence, backend
contracts, and acceptance criteria.

The product should be a managed Chromium-based workspace browser for
Echothink.ai. It must not become a deep browser-engine fork. Chromium and
Ungoogled Chromium should continue to own core browser behavior, while
Echothink adds a thin workspace, identity, and service integration layer.

## 2. Architecture Summary

Echothink Browser is built from three layers:

```text
Chromium / Ungoogled Chromium native layer
  tabs, windows, history, downloads, bookmarks, passwords, cookies,
  rendering, TLS validation, sandboxing, DevTools, extension system

Echothink browser layer
  branding, default policies, New Tab container, Side Panel container,
  default search provider, login gate, device identity, route helpers,
  bundled trusted extension

Independent Echothink services
  app pages, authentication, device enrollment, search, APIs,
  authorization, gateway policy, audit logs, update metadata
```

The core rule is:

```text
Browser owns workspace entry, identity proof, and local integration.
Backend services own business pages, data, workflow execution, and authorization.
```

## 3. Non-Goals

The rewrite must not replace or deeply modify:

- Chromium network stack
- TLS or certificate verification
- Renderer process model
- Sandbox model
- Download manager
- History database
- Bookmark manager
- Password manager
- Cookie or site storage
- Omnibox internals beyond search provider configuration
- Extension permission system

Any change touching these areas requires a separate security and maintenance
review.

## 4. Recommended Repository Shape

The new browser distribution should keep the existing Ungoogled Chromium patch
pipeline and add Echothink material as a clearly separated layer.

```text
echothink-browser/
  chromium_version.txt
  revision.txt
  flags.gn
  downloads.ini
  pruning.list
  domain_regex.list
  domain_substitution.list

  patches/
    series
    upstream-fixes/
    core/
    extra/
    echothink/
      0001-branding.patch
      0002-default-policies-and-preferences.patch
      0003-new-tab.patch
      0004-side-panel-extension.patch
      0005-default-search-provider.patch
      0006-login-gate.patch
      0007-device-identity.patch
      0008-echo-protocol.patch

  extensions/
    echothink-workspace/
      manifest.json
      background.js
      sidepanel.html
      sidepanel.css
      sidepanel.js
      content_bridge.js
      assets/
        workspace-mark.svg

  assets/
    icons/
    installer/
    about/

  docs/
    echothink_browser_construction.md
    backend_contracts.md
    release_checklist.md
    security_model.md

  build/
    windows/
      README.md
      signing.md
      smoke_test.md

  scripts/
    validate_patches.ps1
    build_windows_alpha.ps1
    smoke_test_windows.ps1
```

Echothink patches must be listed after the inherited Chromium/Ungoogled patches
in `patches/series`. This keeps the upstream base easy to rebase and makes the
Echothink layer auditable.

The detailed Alpha patch convention is defined in
`docs/echothink-browser-alpha/t01-define-echothink-patch-discipline.md`.

The detailed Alpha repository skeleton plan is maintained in
`docs/echothink-browser-alpha/t02-define-echothink-repo-structure.md`. It is the
source of truth for the owner, purpose, expected contents, and creation trigger
of `patches/echothink/`, `extensions/echothink-workspace/`, `assets/`, and
`build/windows/`, for when `patches/series` entries may be added, and for how
placeholder docs and generated build artifacts are treated.

## 5. Browser Feature Design

### 5.1 Branding And Defaults

The browser distribution should ship as Echothink Browser with:

- Product name: `Echothink Browser`
- Windows application identity and installer branding
- Echothink icon set
- Echothink About page copy
- Default homepage
- Default New Tab
- Default search engine
- Default bookmarks
- Default policy set

Attribution to Chromium and Ungoogled Chromium must remain in documentation and
license material.

The detailed Alpha branding inventory is maintained in
`docs/echothink-browser-alpha/t04-define-product-branding-inventory.md`. It
decides the visible product name, Windows display and Start Menu names,
installer name, first-run/About copy needs, Windows Alpha icon requirements,
and upstream attribution rules used by T05, T06, and later Windows packaging
tasks.

The detailed Alpha Windows packaging identity and channel spec is maintained in
`docs/echothink-browser-alpha/t30-define-windows-app-identity-and-channels.md`.
It defines `EchothinkBrowserSetup`, the Canary/Dev/Beta/Stable/Enterprise Stable
channel IDs and labels, the Alpha-versus-Beta branding tradeoff, and the
update-channel metadata expected by Windows packaging.

The active Alpha packaging identity patch is
`patches/echothink/0010-windows-packaging-identity.patch`; the implementation
note is
`docs/echothink-browser-alpha/t31-implement-windows-packaging-identity-patch.md`.
It applies the Windows Alpha Dev app/install identity while preserving
Chromium-derived executable internals for Alpha.

The detailed Alpha default policy/preference set is maintained in
`docs/echothink-browser-alpha/t07-define-default-policy-preference-set.md`.
It defines the homepage, New Tab, default search and suggest URLs, default
bookmarks, preferred policy/preference surfaces, and enterprise-safe defaults
used by T08, T10, and T19.

### 5.2 New Tab

Default New Tab route:

```text
https://app.echothink.ai/newtab
```

The browser provides the New Tab entry point and fallback shell. The backend
renders the actual workspace content.

The Alpha New Tab hook decision is maintained in
`docs/echothink-browser-alpha/t09-confirm-new-tab-insertion-point.md`. The
selected hook is Chromium's `HandleNewTabPageLocationOverride()` path as
modified by the inherited custom NTP patch. Alpha should prefer the
normal-profile New Tab override preference and avoid a global `--custom-ntp`
default so incognito behavior remains inherited.

The New Tab should eventually show:

- Search box
- Recent projects
- Active project collections
- Recent App Domains
- Recent Task Waves
- Pending approvals
- Recent artifacts
- Workspace notifications
- Account and organization status

If the user is not authenticated or the network is unavailable, the browser
should show a minimal built-in page with links only to login, device enrollment,
diagnostics, update, and support/download pages.

### 5.3 Side Panel

Phase 1 implementation should be a bundled trusted Manifest V3 extension using
Chromium Side Panel APIs where available.

Default Side Panel route:

```text
https://app.echothink.ai/sidepanel
```

The Alpha extension scaffold is documented in
`docs/echothink-browser-alpha/t12-scaffold-bundled-workspace-extension.md`.
The bundled install patch is documented in
`docs/echothink-browser-alpha/t13-add-bundled-extension-install-patch.md`; it
loads the workspace shell as component extension ID
`lokdibgfmiemhdoogailbfpdggndpolk` with no `update_url` and no broad host
permissions.
The Side Panel container entry is documented in
`docs/echothink-browser-alpha/t14-implement-side-panel-container.md`; it keeps
the browser UI entry in the bundled extension action and opens the local
extension shell `sidepanel.html`.

The Side Panel should provide two switchable modes. The mode selector should be
visible at the top of the panel and preserve the user's last selected mode per
profile.

Mode 1: Chat Panel

- Let the user choose the chat scope before or during a conversation
- Supported scopes for Alpha:
  - Current page
  - Current project
  - Current App Domain
  - Current Task Wave
  - Recent artifacts
  - Organization workspace, if authorized
- Send messages to the remote Echothink chat service
- Include selected scope metadata with each chat request
- Stream assistant responses when the remote service supports streaming
- Show authentication, authorization, offline, and service-error states clearly
- Keep conversation storage and model orchestration in backend services, not in
  the extension

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

The Side Panel must not contain heavy business logic. It should render service
UI and call backend APIs through authenticated, device-bound requests.

### 5.4 Default Search

The browser should configure Echothink Search as the default search provider.

```text
Search URL:  https://search.echothink.ai/search?q={searchTerms}
Suggest URL: https://search.echothink.ai/suggest?q={searchTerms}
```

The v1 implementation should use policy, master preferences, or a minimal
preference patch. It should avoid deep omnibox rewrites.

The default search provider values and suggestion behavior are defined in
`docs/echothink-browser-alpha/t07-define-default-policy-preference-set.md`.

### 5.5 Login Gate

On first launch, Echothink Browser starts in a restricted unauthenticated mode.

Allowed unauthenticated destinations:

```text
https://auth.echothink.ai/login
https://auth.echothink.ai/device/enroll
https://app.echothink.ai/browser-required
https://app.echothink.ai/download-browser
https://updates.echothink.ai/
local diagnostics page
```

After successful login and device verification, the browser enters normal
workspace mode.

### 5.6 Device Identity

Each installation must have browser-bound device identity.

Generated or stored locally:

```text
device_id
installation_id
device_public_key
device_private_key
browser_channel
browser_version
```

Windows secure storage for Alpha:

```text
DPAPI
```

TPM-backed key storage should be investigated for later hardening.

The backend stores:

```text
device_id
user_id
organization_id
public_key
browser_version
browser_channel
device_status
created_at
last_seen_at
revoked_at
```

### 5.7 Request Proof

Protected APIs should use DPoP-style proof-of-possession.

Conceptual request headers:

```text
Authorization: DPoP <access_token>
DPoP: <signed_request_proof>
X-Echothink-Device-ID: <device_id>
```

Security comes from the signature and backend verification against the
registered device public key, not from the header names.

Enterprise mTLS can be added later as an optional hardening mode.

### 5.8 Optional Echo Protocol

`echo://` routes are navigation helpers only. They must not be used as a
security boundary.

Examples:

```text
echo://dashboard        -> https://app.echothink.ai/dashboard
echo://project/123      -> https://app.echothink.ai/project/123
echo://task-wave/abc    -> https://app.echothink.ai/task-wave/abc
echo://app-domain/domain/instance
                        -> https://app.echothink.ai/app-domain/domain/instance
echo://artifact/file-1  -> https://app.echothink.ai/artifact/file-1
echo://approval/appr-1  -> https://app.echothink.ai/approval/appr-1
```

The active Alpha resolver is
`patches/echothink/0009-echo-protocol-router.patch`; implementation notes are in
`docs/echothink-browser-alpha/t28-implement-optional-resolver.md`. It rewrites
only exact known route shapes to HTTPS app URLs, clears the `echo://` referrer,
and does not carry authorization or device-proof semantics. The invalid-route
fallback page remains a separate T29 task.

## 6. Backend Service Contracts

### 6.1 Domains

```text
app.echothink.ai
search.echothink.ai
auth.echothink.ai
api.echothink.ai
assets.echothink.ai
updates.echothink.ai
```

### 6.2 Auth Service

```text
GET  /login
POST /logout
POST /device/enroll
POST /device/challenge
POST /session
```

### 6.3 App Service

```text
GET /newtab
GET /sidepanel
GET /dashboard
GET /project/:project_id
GET /task-wave/:wave_id
GET /app-domain/:domain/:instance_id
GET /artifact/:artifact_id
GET /approval/:approval_id
GET /settings
GET /browser-required
GET /download-browser
```

### 6.4 Search Service

```text
GET /search?q={searchTerms}
GET /suggest?q={searchTerms}
GET /internal?q={searchTerms}
GET /web?q={searchTerms}
```

### 6.5 API Service

```text
GET /v1/projects
GET /v1/task-waves
GET /v1/app-domains
GET /v1/artifacts
GET /v1/approvals
GET /v1/search
GET /v1/browser/session
```

### 6.6 Chat Service

The Side Panel Chat mode should call a remote chat service through the protected
API gateway.

```text
POST /v1/chat/conversations
GET  /v1/chat/conversations/:conversation_id
POST /v1/chat/conversations/:conversation_id/messages
POST /v1/chat/stream
```

Each chat request should include scope metadata selected by the user:

```text
scope_type: current_page | project | app_domain | task_wave | artifacts | organization
scope_id: optional resource identifier
page_url: optional current page URL
artifact_ids: optional selected artifact identifiers
project_id: optional project identifier
task_wave_id: optional task wave identifier
app_domain_id: optional App Domain identifier
```

The backend is responsible for model routing, conversation persistence,
authorization, retrieval, tool execution, and audit logging.

## 7. Gateway Policy

All protected service domains should sit behind a gateway.

Gateway responsibilities:

- TLS termination
- User session validation
- Device session validation
- DPoP proof validation
- Token replay protection
- Organization policy checks
- Browser version and channel checks
- Resource authorization
- Audit logging
- Request forwarding

Public paths:

```text
/login
/logout
/device/enroll
/device/challenge
/browser-required
/download-browser
/healthz
/static/*
```

Protected paths:

```text
/newtab
/sidepanel
/dashboard
/project/*
/task-wave/*
/app-domain/*
/artifact/*
/approval/*
/settings
/search/internal
/api/*
```

If a normal browser opens a protected Echothink URL, the gateway should return
the browser-required page instead of protected business content.

## 8. Delivery Milestones

### Milestone 0: Repository Construction

Deliverables:

- Rename top-level docs around Echothink Browser
- Add `patches/echothink/`
- Add Echothink entries to `patches/series`
- Add construction, backend contract, release, and security docs
- Preserve existing Chromium/Ungoogled tooling

Acceptance:

- Existing patch validation still runs
- Echothink patches are isolated and ordered after inherited patches
- Docs clearly explain upstream relationship

### Milestone 1: Windows Baseline Build

Deliverables:

- Build current Ungoogled Chromium baseline for Windows
- Validate native browser primitives
- Produce base validation report

Acceptance:

- Tabs, windows, popups, history, downloads, bookmarks, passwords, cookies,
  DevTools, extensions, and search settings behave as expected
- No Echothink-specific patches are required to pass baseline validation

### Milestone 2: Echothink Shell Alpha

Deliverables:

- Branding and product identity
- Echothink icons and installer identity
- Default New Tab route
- Default search provider
- Bundled workspace extension
- Side Panel route
- First-run/login placeholder page

Acceptance:

- New Tab opens `https://app.echothink.ai/newtab`
- Side Panel opens `https://app.echothink.ai/sidepanel`
- Omnibox search routes to Echothink Search
- Browser is visibly branded as Echothink Browser

### Milestone 3: Login And Device Identity Prototype

Deliverables:

- Login-required startup mode
- Device key generation
- Windows DPAPI private key storage
- Device enrollment handshake
- Short-lived device-bound session
- Browser-required fallback page

Acceptance:

- First launch requires login
- Device identity persists across restart
- Revoked or missing device cannot access protected app pages
- Normal Chrome or Edge cannot access protected pages with copied URLs

### Milestone 4: Gateway Hardening

Deliverables:

- DPoP-style API proof
- Replay protection
- Device revocation
- Version and channel enforcement
- Audit logging

Acceptance:

- Invalid method, URL, timestamp, signature, token, key, or revoked device is
  rejected
- Gateway denies protected resources without both user session and device proof
- Audit events are written for protected access decisions

### Milestone 5: Windows Beta Release Pipeline

Deliverables:

- Signed Windows installer
- Update metadata integration
- Smoke test automation
- Rollback process
- Release channel labels
- Channel-specific Windows app identity from
  `docs/echothink-browser-alpha/t30-define-windows-app-identity-and-channels.md`
- Active Alpha Dev packaging identity from
  `patches/echothink/0010-windows-packaging-identity.patch`

Acceptance:

- Installer works on a clean Windows machine
- Update metadata verifies successfully
- Smoke tests pass after install and after update
- Rollback process is documented and tested

### Milestone 6: Production Readiness

Deliverables:

- Security review
- Performance review
- Enterprise policy defaults
- Admin and revocation documentation
- Release checklist

Acceptance:

- Startup, New Tab, Side Panel, and login unlock meet agreed performance targets
- Security review findings are resolved or explicitly accepted
- v1.0 release checklist is complete

## 9. Test Plan

### Patch And Repo Tests

- Validate patch paths and `patches/series`
- Apply all patches against pinned Chromium version
- Run existing Python tests under `utils/tests`
- Run existing Python tests under `devutils/tests`

### Browser Regression Tests

- Tabs and windows
- Popups
- History
- Downloads
- Bookmarks
- Password manager
- Cookies and local storage
- TLS certificate validation
- DevTools
- Extension loading

### Workspace Shell Tests

- New Tab route
- Side Panel route
- Default search route
- Suggest route
- Offline fallback
- Unauthenticated fallback

### Auth And Device Tests

- First launch login requirement
- Device enrollment
- DPAPI storage persistence
- Device revocation
- Session expiration and refresh
- Copied URL access from normal browser

### Security Tests

- DPoP proof signature validation
- Replay rejection
- Wrong method rejection
- Wrong URL rejection
- Expired proof rejection
- Revoked device rejection
- Unauthorized resource rejection

### Release Tests

- Installer install and uninstall
- Code signature verification
- Auto-update metadata verification
- Smoke tests after install
- Smoke tests after update
- Rollback test

## 10. Risks And Mitigations

| Risk | Mitigation |
|---|---|
| Chromium rebases become expensive | Keep Echothink patches small, isolated, and ordered last |
| Browser identity is treated as absolute security | Document realistic guarantee and enforce server-side authorization |
| Side Panel API support varies by Chromium version | Keep Side Panel as bundled extension first, native integration later |
| Backend pages leak to normal browsers | Put all protected routes behind gateway checks |
| Device private key extraction on compromised machines | Use DPAPI for Alpha, evaluate TPM-backed keys for hardening |
| Update pipeline becomes a security weak point | Require signed installers, verified update metadata, and rollback tests |

## 11. Security Claim

The product claim should be:

```text
Echothink protected services require a logged-in user, a registered Echothink
Browser device, and cryptographic proof from the browser runtime. Ordinary
browsers and basic scrapers cannot access protected workspace pages without
valid device-bound credentials.
```

The product must not claim:

```text
Impossible to bypass
Absolute protection against a fully compromised endpoint
Only this binary can ever access the service
Perfect network-level lock-in
```

## 12. Definition Of Done For Alpha

Echothink Browser Alpha is complete when:

- Windows build installs and launches
- Browser is branded as Echothink Browser
- New Tab loads the Echothink workspace route
- Side Panel loads the Echothink side panel route
- Default search uses Echothink Search
- First launch requires login or shows the login gate
- Device identity can be generated and stored locally
- Backend contract for enrollment and protected requests is documented
- Existing browser primitives still pass baseline validation
- Patch validation and smoke tests pass
