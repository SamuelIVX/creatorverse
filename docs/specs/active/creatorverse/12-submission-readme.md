# Spec: Submission — README & Walkthrough

## Objective
Package the finished Creatorverse for CodePath prework submission: a
`README.md` following the required template with a checked-off feature list, and
a recorded walkthrough (GIF/video) demonstrating the CRUD flows. This is the
plan's "Adding the Prework to Your Application" deliverable — the only planned
requirement not covered by specs 01–10.

## Scope
- Package: `creatorverse`
- Modifies: `README.md` (new), walkthrough asset (e.g., `walkthrough.gif` or a hosted link)
- Off-limits: all application source (`src/**`, `client.js`, pages, components) — this spec adds documentation only, no behavior change

## Non-Goals
- No code changes: features must already be implemented by specs 01–10.
- No CI/automated publishing of the submission (submission is a manual form step).

## Requirements
1. THE SYSTEM SHALL include a `README.md` at the project root based on the CodePath prework README template.
2. THE SYSTEM SHALL list the prework's Required and Stretch features in the README, marking each implemented feature with `[x]` and any unimplemented feature with `[ ]`.
3. THE SYSTEM SHALL embed or link a walkthrough (GIF, Loom, YouTube, or MP4) that demonstrates create, read (list + detail), update, and delete.
4. THE SYSTEM SHALL push the project — including the README and walkthrough asset/link — to the GitHub repository tied to the author's CodePath-registered account.
5. THE README feature checklist SHALL reflect the actual implemented state (a feature is `[x]` only if its owning spec's tests pass).

## Design
`README.md` outline (from the template):
```markdown
# Creatorverse

Submitted by: <name>

## Required Features
- [x] Logical React component structure
- [x] Homepage displays ≥ 5 creators
- [x] Each item shows name, channel link, description
- [x] async/await data access
- [x] Click-through to a unique detail page (name, url, description)
- [x] Edit a creator (name, url, description)
- [x] Delete a creator
- [x] Add a creator; it appears in the list

## Stretch Features
- [ ] PicoCSS styling
- [ ] Card layout
- [ ] Image on card

## Walkthrough
![walkthrough](walkthrough.gif)
```
Stretch features are optional (spec 10). Per R2/R5, mark a stretch item `[x]`
only if it was actually implemented and its spec-10 test passes; otherwise leave
it `[ ]`. The example above shows them unchecked as the default.
Record the walkthrough with LiceCap or similar (Windows: set display scaling to
100% for correct capture).

## Current State
- Core CRUD + stretch features complete (specs 01–10). [prerequisite]
- No `README.md` or walkthrough asset exists yet. [confirmed]

## Tests
- `readme_present`: `README.md` exists at the project root.
- `feature_checklist_complete`: every Required feature is marked `[x]`.
- `walkthrough_linked`: the README references a walkthrough asset or URL that resolves.
- `checklist_matches_reality`: no feature is marked `[x]` whose owning spec's tests fail.

## Constraints
- Dependencies: `01-project-setup` through `11-ui-ux-overhaul` (documents their delivered state; merge last).
- Backward compatibility: documentation only — must not alter application behavior.

## Context
- Prework README template: `snippets/readme_templates/prework_readme_template.md`
- Submission form: https://apply.codepath.org/prework
- Submitting a project via GitHub: https://www.youtube.com/watch?v=5I2qrCZ8xnM
