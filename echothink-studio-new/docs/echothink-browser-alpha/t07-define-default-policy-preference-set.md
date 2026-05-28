# T07 Define Default Policy And Preference Set

Date: 2026-05-28
Wave: W1
Delivery target: M1 defaults spec
Status: DONE

## Prerequisite Check

T07 depends on T00. `docs/progress.md` marks T00 as `DONE` and records the
repository-root mismatch as an acceptable baseline dependency for discovery and
documentation tasks.

The requested repository root remains documentation-only:

```text
C:\Users\caoya\source\repos\echothink-studio\echothink-studio-new
```

The inherited Ungoogled Chromium patch/config tree used to identify concrete
defaults touchpoints is:

```text
C:\Users\caoya\source\repos\echothink-studio
```

This task produced documentation only. It did not create a patch, add
`patches/echothink/`, update `patches/series`, change preferences, create
policies, or implement backend routes.

## Default URL Decisions

| Default | Value | Notes |
|---|---|---|
| Homepage | `https://app.echothink.ai/dashboard` | User-visible workspace home route. Should be seeded as a default/recommended value, not a mandatory lock, unless an enterprise package explicitly chooses managed policy. |
| New Tab | `https://app.echothink.ai/newtab` | Normal profile New Tab route. Incognito behavior should remain Chromium-like unless T09/T10 explicitly approve otherwise. |
| Search provider name | `Echothink Search` | Display name for the default search provider. |
| Search keyword | `echothink.ai` | Short, stable keyword; T08 may choose a different keyword only if Chromium validation requires it. |
| Search URL | `https://search.echothink.ai/search?q={searchTerms}` | Required default omnibox search target. |
| Suggest URL | `https://search.echothink.ai/suggest?q={searchTerms}` | Configure the provider URL, but do not enable search suggestions by default over the inherited baseline. |

These URLs are browser-side route contracts. T07 does not implement app,
search, suggestion, authorization, ranking, or gateway services.

## Default Bookmark Set

Seed default bookmarks for new profiles without changing Chromium bookmark
storage or bookmark manager behavior.

| Title | URL | Purpose |
|---|---|---|
| Echothink Workspace | `https://app.echothink.ai/dashboard` | Main workspace entry. |
| Echothink New Tab | `https://app.echothink.ai/newtab` | Direct access to the workspace New Tab route. |
| Echothink Search | `https://search.echothink.ai/` | Search entry point without a pre-filled query. |
| Echothink Support | `https://app.echothink.ai/support` | User support route under the app domain. |
| Echothink Browser Download | `https://app.echothink.ai/download-browser` | Browser download and recovery route. |
| Echothink Browser Updates | `https://updates.echothink.ai/` | Update information route when update service metadata exists. |

If T08 needs a smaller Alpha bookmark set, keep at least Workspace, Search,
Support, and Browser Download. Any changed URL must remain under an
Echothink-owned domain already listed in the browser plan.

## Implementation Surface Preference

T08 should implement defaults in this order:

1. Recommended enterprise policy or installer-provided initial preferences for
   homepage, startup, search provider, and default bookmarks.
2. Existing profile preference hooks when policy or initial preferences are not
   sufficient.
3. Existing inherited hooks, such as the custom New Tab preference path, before
   adding a new native Chromium path.
4. Native Chromium patching only when a policy/preference path cannot satisfy a
   browser-shell requirement, and only under `patches/echothink/`.

Mandatory managed policy should be reserved for enterprise packaging decisions,
login-gate enforcement, or explicit security requirements. The default Alpha
browser should seed Echothink defaults while preserving user and enterprise
override behavior where Chromium normally supports it.

## Candidate Policy And Preference Mapping

Exact Chromium policy and preference names must be verified against the pinned
Chromium source during T08. The intended mapping is:

| Area | Preferred surface | Desired setting |
|---|---|---|
| Homepage URL | Recommended policy or initial preference | `HomepageLocation = https://app.echothink.ai/dashboard`; `HomepageIsNewTabPage = false`. |
| Home button | Initial preference or recommended policy if available | Show home button only if needed for Alpha UX; do not force it when enterprise policy overrides browser appearance. |
| Startup URLs | Initial preference or recommended policy | Open `https://app.echothink.ai/dashboard` for normal post-setup startup only if this does not conflict with T20/T21 login gate behavior. |
| New Tab URL | Existing profile pref for New Tab override, or inherited custom NTP hook | `https://app.echothink.ai/newtab` for normal profiles. Prefer profile preference over command-line `--custom-ntp` because the inherited command-line hook also affects incognito for external URLs. |
| Default search provider | Recommended policy, initial preference, or TemplateURL seed | Name `Echothink Search`; keyword `echothink.ai`; search URL `https://search.echothink.ai/search?q={searchTerms}`. |
| Suggest provider URL | Same search provider seed | `https://search.echothink.ai/suggest?q={searchTerms}`. Leave inherited search suggestions disabled by default unless policy/user enables suggestions. |
| Default bookmarks | Initial preferences, managed/recommended bookmarks, or narrow seed patch | Add the default bookmark set above. Do not patch bookmark storage, editing, sync, or manager behavior. |

## Inherited Defaults To Preserve

The inherited baseline already documents and patches default behavior in
`docs/default_settings.md` and related patches. T07 does not override those
defaults except where explicitly listed above.

Keep these inherited defaults as-is unless a future task explicitly documents a
change:

- Search suggestions are disabled by default.
- Bookmark bar is enabled by default.
- Downloads prompt for save location by default.
- Third-party cookies are blocked by default.
- Password saving and auto sign-in are disabled by default.
- Background apps are disabled by default.
- Link Doctor, hyperlink auditing, preload pages, payment checks, payment
  autofill, and selected WebRTC IP behavior remain inherited.

## Enterprise-Safe Defaults

Echothink defaults must preserve native Chromium behavior and enterprise
control:

- Do not change Chromium networking, TLS/certificate validation, sandbox,
  renderer internals, download manager behavior, history, bookmarks, password
  manager, cookies/site storage, or DevTools behavior.
- Do not disable DevTools by default.
- Do not force-disable the password manager beyond the inherited Ungoogled
  Chromium baseline.
- Do not change cookie, storage, download, history, or bookmark manager
  semantics to support Echothink routes.
- Do not hard-code authorization assumptions into defaults. Backend services
  and the future gateway own authorization.
- Prefer recommended policy or initial preference seeding so enterprise policy
  can replace homepage, startup, search, and bookmark defaults.
- Search suggestions may use the configured Echothink suggest URL only when the
  user or enterprise enables suggestions.

## Follow-Up Ownership

- T08 implements homepage, New Tab, default bookmarks, and policy/preference
  defaults as `patches/echothink/0002-default-policies-and-preferences.patch`
  if a patch is required.
- T09 confirms the safest New Tab insertion point before T10 routes the final
  New Tab behavior and fallback.
- T19 implements the final default search provider behavior if it is split from
  T08.
- T20/T21 own login-gate startup restrictions and unauthenticated navigation
  behavior.

## Validation

Validation for this discovery task is path and documentation based:

- Confirmed T00 is `DONE` in `docs/progress.md`.
- Confirmed inherited defaults documentation exists:
  `docs/default_settings.md`.
- Confirmed inherited default/search/New Tab patches exist:
  - `patches/extra/inox-patchset/0006-modify-default-prefs.patch`
  - `patches/extra/iridium-browser/prefs-always-prompt-for-download-directory-by-defaul.patch`
  - `patches/extra/ungoogled-chromium/default-webrtc-ip-handling-policy.patch`
  - `patches/core/ungoogled-chromium/replace-google-search-engine-with-nosearch.patch`
  - `patches/extra/ungoogled-chromium/add-suggestions-url-field.patch`
  - `patches/extra/ungoogled-chromium/add-flag-for-custom-ntp.patch`
  - `patches/extra/ungoogled-chromium/add-flag-for-bookmark-bar-ntp.patch`
- Confirmed the spec records required homepage, New Tab, search, suggest, and
  bookmark defaults.
- Confirmed this task produced no patch and no browser behavior change.

## Known Limitations

- No Chromium source checkout is present locally, so exact native policy,
  preference, TemplateURL, and bookmark seed files must be verified during T08
  against the pinned Chromium source after inherited patches are applied.
- Existing T03 baseline tooling issues still apply to future patch validation.
- The app/search/update/support URLs are browser route contracts for Alpha; T07
  does not prove backend availability.
