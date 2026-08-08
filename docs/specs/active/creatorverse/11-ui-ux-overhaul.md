# Spec: UI/UX Overhaul — Dark Studio Design System

## Objective
Replace the PicoCSS default look with a hand-rolled, token-driven "premium dark
studio" design system and a proper app shell, then elevate every page: a hero
with search on the homepage, rich cards with image fallbacks, a profile-style
detail page, polished forms with a live image preview, toast feedback, and a
delete-confirmation dialog. All existing behavior and tests stay intact.

## Scope
- Package: `creatorverse`
- Modifies: `src/main.jsx`, `src/App.jsx`, `src/index.css`, `index.html`,
  `src/components/Card.jsx`, `src/components/CreatorForm.jsx`,
  `src/pages/ShowCreators.jsx`, `src/pages/ViewCreator.jsx`,
  `src/pages/AddCreator.jsx`, `src/pages/EditCreator.jsx`,
  `src/App.test.jsx`, `src/components/Card.test.jsx`,
  `src/pages/ShowCreators.test.jsx`, `package.json`, `README.md`
- New: `src/components/Layout.jsx`, `src/components/Toast.jsx`,
  `src/components/ConfirmDialog.jsx`, `src/components/SkeletonCard.jsx`,
  `src/styles/tokens.css`, `src/styles/base.css`, `src/styles/components.css`
- Removed: `@picocss/pico` dependency + its imports
- Off-limits: `src/lib/*` (client, useCreator), Supabase schema, feature behavior

## Non-Goals
- No new backend features, no schema changes, no search in the database
  (search is client-side over the fetched list).
- No light-theme support in this pass (dark studio is the single theme).
- No animation libraries; micro-interactions use CSS transitions only.

## Requirements
1. THE SYSTEM SHALL provide an app shell: a sticky header with a brand
   wordmark and Home/Add nav, a main content region, and a footer, shared by
   every route.
2. THE SYSTEM SHALL define its visual language in CSS custom properties
   (`src/styles/tokens.css`): dark palette, one accent color, type scale,
   spacing scale, radii, and shadows; components SHALL consume tokens, not
   hard-coded values.
3. THE SYSTEM SHALL render a hero section on the homepage with a headline,
   supporting text, and a search input that filters creators client-side by
   name and description (case-insensitive substring).
4. THE SYSTEM SHALL show a designed empty state when there are no creators and
   a distinct no-results state when search matches nothing.
5. THE SYSTEM SHALL show skeleton placeholders while the homepage list loads.
6. THE SYSTEM SHALL render creator cards with: a fallback treatment when
   `imageURL` is null or fails to load, name, description, channel link, and
   detail/edit actions; the card grid SHALL remain responsive.
7. THE SYSTEM SHALL render the detail page as a profile: a gradient header
   band, avatar (or fallback), name, description, channel link, and an Edit
   action.
8. THE SYSTEM SHALL present create/edit forms inside a contained card with a
   live image preview while the image URL is being typed and a loading state on
   the submit button during the async write.
9. THE SYSTEM SHALL surface toast notifications for successful add, edit, and
   delete operations (and error toasts on failure).
10. THE SYSTEM SHALL confirm deletes via a modal dialog before deleting.
11. THE SYSTEM SHALL keep every pre-existing behavior test passing and add
    tests for search, no-results, toast, confirm-dialog, and skeleton states.
12. THE SYSTEM SHALL remove the `@picocss/pico` dependency; the design-system
    test (replacing `pico_applied`) SHALL assert our own tokens load.
13. THE SYSTEM SHALL set `color-scheme: dark` and a dark `--bg` token so the
    app renders dark by default with no FOUC.

## Design
### Token set (`src/styles/tokens.css`)
```css
:root {
  color-scheme: dark;
  --bg: #0a0a0f;
  --surface: #14141c;
  --surface-raised: #1c1c26;
  --border: #2a2a36;
  --text: #f4f4f6;
  --text-muted: #9b9baa;
  --color-accent: #8b5cf6;
  --color-accent-strong: #7c3aed;
  --radius-sm/md/lg: 8px / 12px / 20px;
  --space-1..6: 0.25rem..2rem;
  --shadow-1/2: ...
}
```

### App shell (`src/components/Layout.jsx`)
```jsx
<header>brand wordmark · Home · Add Creator</header>
<main>{children}</main>
<footer>© {year} Creatorverse</footer>
```

### Toast (`src/components/Toast.jsx`)
Context-backed `ToastProvider` + `useToast()` hook. Renders stacked toasts,
each auto-dismissing after a delay with a success/error variant.

### ConfirmDialog (`src/components/ConfirmDialog.jsx`)
Controlled modal (`<dialog open>` or overlay) with title, message, Cancel, and
Confirm (danger-styled) buttons. Focuses the confirm button on open.

## Current State
- PicoCSS v2 default styling with a small custom layer (`.creator-grid`,
  `.card-image`). [confirmed]
- No app shell, hero, search, skeletons, toasts, or confirm dialogs. [confirmed]
- All 55 tests pass on `main`. [confirmed]
- **Implementation note:** Pico removed; `src/styles/{tokens,base,components}.css`
  form the design system, imported via `index.css`. Google Fonts (Space Grotesk
  + Inter) load in `index.html` with `theme-color: #0a0a0f` to avoid FOUC. New
  components: `Layout` (header/nav/footer shell), `ToastProvider` + `useToast`
  (context split across `components/Toast.jsx`, `components/ToastContext.js`,
  `lib/useToast.js` to satisfy fast-refresh), `ConfirmDialog`, `SkeletonCard`.
  Card and detail fall back to an initial-letter tile when `imageURL` is missing
  or fails. Search is client-side over the fetched list (name/description,
  case-insensitive). Add/edit pages push toasts; delete routes through the
  confirm dialog. 62 tests pass (existing suites updated for new markup/labels
  — `Channel URL` label, `Details` card link, link-based add nav — plus new
  tests: search filter, no-results, skeleton, toast, confirm-cancel, image
  fallbacks, design-system load).

## Tests
- `design_system_applied` (replaces `pico_applied`): a loaded `<style>` tag
  contains `--color-accent` (tokens) or `.app-header`.
- `homepage_search_filters`: typing in the search input filters the card list.
- `search_no_results_message`: a non-matching query shows the no-results state.
- `skeleton_shown_while_loading`: skeleton placeholder is present before data.
- `toast_on_add_success`: adding a creator fires a success toast.
- `confirm_dialog_on_delete`: clicking Delete opens the confirm dialog; confirm
  deletes, cancel does not.
- Pre-existing suites (App, Card, ShowCreators, CreatorForm, useCreator,
  client) updated in lockstep where markup/class names changed.

## Constraints
- Dependencies: specs 01–10 (delivered state).
- Backward compatibility: routes, behavior, and async data flows unchanged;
  only presentation and UX feedback change.

## Context
- Design tokens pattern: https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties
- Google Fonts (Space Grotesk / Inter): https://fonts.google.com/
