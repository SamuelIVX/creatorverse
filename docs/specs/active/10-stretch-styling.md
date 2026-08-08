# Spec: Stretch — Styling, Card Layout & Images

## Objective
Elevate the UI beyond the functional baseline: apply PicoCSS, present creators
as a card grid rather than a plain list, and show each creator's image on their
card. These are the prework's optional stretch features.

## Scope
- Package: `creatorverse`
- Modifies: `package.json` (install Pico), `src/main.jsx` (single additive Pico import — file owned by `01-project-setup`, touched here only to add one import line), `src/components/Card.jsx`, `src/pages/ShowCreators.jsx`, CSS
- Off-limits: `client.js`, CRUD data logic (no behavior changes)

## Non-Goals
- No changes to CRUD behavior or data fetching.
- No custom design system — Pico defaults plus light layout CSS only.

## Requirements
1. THE SYSTEM SHALL install PicoCSS (`npm install @picocss/pico`) and apply it to style HTML elements across the app.
2. THE SYSTEM SHALL present creators in a card layout (e.g., CSS grid) rather than a plain vertical list.
3. WHEN a creator has an `imageURL`, THE SYSTEM SHALL display that image on their card.
4. THE SYSTEM SHALL preserve all existing CRUD behavior unchanged.

## Design
- Import Pico once, via `import '@picocss/pico'` at the top of `src/main.jsx`
  (chosen over the `index.html` CDN `<link>` so styling stays bundled; this is
  the single line this spec adds to that spec-01-owned file).
- Wrap the homepage `Card` list in a grid container:
  ```css
  .creator-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 1rem; }
  ```
- `Card` already conditionally renders `imageURL` (spec 04); ensure image sizing
  fits the card.

## Current State
- Core CRUD complete (specs 01–09). [prerequisite]
- PicoCSS is not yet installed; this spec owns `npm install @picocss/pico`. [confirmed — spec 01 excludes styling]
- `Card` conditionally renders `imageURL`. [confirmed — spec 04]

## Tests
- `pico_applied`: Pico stylesheet is loaded (semantic elements pick up Pico styles).
- `homepage_uses_grid`: creators render inside the grid container.
- `card_shows_image`: a creator with `imageURL` renders an `<img>` on its card.
- `crud_unaffected`: create/read/update/delete still pass their specs' tests.

## Constraints
- Dependencies: `01-project-setup` (owns `src/main.jsx`, where the Pico import is added), `04-creator-card-component`, `05-view-all-creators`; best merged after core CRUD (01–09).
- Backward compatibility: purely additive — must not alter data flow or props contracts.

## Context
- PicoCSS: https://picocss.com/
