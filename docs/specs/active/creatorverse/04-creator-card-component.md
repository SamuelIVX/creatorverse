# Spec: Creator Card Component

## Objective
Flesh out the `Card` component so it displays a single creator's information and
links both to their external channel and to their in-app detail page. This is
the reusable unit rendered on the homepage.

## Scope
- Package: `creatorverse`
- Modifies: `src/components/Card.jsx`
- Off-limits: page files, `client.js`

## Non-Goals
- No data fetching (Card is presentational; parent passes props).
- No edit/delete controls yet (edit link added in `08-update-creator`).
- No card-grid styling (see `10-stretch-styling`).

## Requirements
1. THE SYSTEM SHALL display the creator's `name`.
2. THE SYSTEM SHALL render `url` as an anchor linking to the creator's external channel/page.
3. THE SYSTEM SHALL display the creator's `description`.
4. WHEN `imageURL` is provided, THE SYSTEM SHALL render the image; WHEN absent, THE SYSTEM SHALL render no broken image.
5. THE SYSTEM SHALL provide a link to `/creator/:id` for the detail view.

## Design
```jsx
import { Link } from 'react-router-dom'

export default function Card({ id, name, url, description, imageURL }) {
  return (
    <article>
      {imageURL && <img src={imageURL} alt={name} />}
      <h3>{name}</h3>
      <p>{description}</p>
      <a href={url} target="_blank" rel="noreferrer">Visit channel</a>
      <Link to={`/creator/${id}`}>View details</Link>
    </article>
  )
}
```

## Current State
- `Card` exists as a placeholder from spec 03. [confirmed]

## Tests
- `renders_name_description`: name and description appear in output.
- `channel_link_uses_url`: anchor `href` equals the `url` prop.
- `detail_link_uses_id`: detail link points to `/creator/{id}`.
- `image_conditional`: image renders only when `imageURL` is truthy.

## Constraints
- Dependencies: `03-app-structure-and-routing` (component exists, `/creator/:id` route defined).
- Backward compatibility: prop shape consumed by `05-view-all-creators`; keep the five prop names stable.

## Context
- Passing Data Through Props: https://reactjs.org/tutorial/tutorial.html#passing-data-through-props
