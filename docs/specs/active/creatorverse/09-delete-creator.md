# Spec: Delete a Creator

## Objective
Let authenticated users permanently remove a creator from Supabase via a delete control on the
edit page, after which the creator no longer appears on the homepage. Unauthenticated users
are prompted to sign in before accessing the delete control.

## Scope
- Package: `creatorverse`
- Modifies: `src/pages/EditCreator.jsx` (add delete button + handler, auth gate)
- Off-limits: `client.js`, `ShowCreators.jsx`, `Card.jsx`, `ViewCreator.jsx`, `AddCreator.jsx`

## Non-Goals
- No soft-delete/undo — deletion is permanent.
- No confirmation modal required (a native confirm is optional).

## Requirements
1. THE SYSTEM SHALL display a "Delete" button on the edit page, visible only to authenticated users.
2. WHEN an unauthenticated user views the edit page, THE SYSTEM SHALL prompt them to sign in before showing the delete control.
3. WHEN the user clicks Delete, THE SYSTEM SHALL delete the matching row from `creators` (`eq('id', id)`) using async/await.
4. WHEN the delete succeeds, THE SYSTEM SHALL navigate to the homepage; WHEN it returns an error, THE SYSTEM SHALL remain on the page and surface the error (navigation occurs only on success).
5. WHEN the homepage re-fetches, THE SYSTEM SHALL no longer display the deleted creator.

## Design
```jsx
const handleDelete = async () => {
  const { error } = await supabase.from('creators').delete().eq('id', id)
  if (error) return // surface error + stay on page; navigate only on success
  navigate('/')
}
// <button onClick={handleDelete}>Delete</button>
```

## Current State
- `EditCreator` exists with update behavior from spec 08. [confirmed — depends on 08]
- Delete button co-locates on the edit page per prework. [confirmed]

## Tests
- `delete_button_present`: edit page renders a Delete control when authenticated.
- `auth_gate_requires_signin_for_delete`: unauthenticated users see the sign-in form, not the delete control.
- `click_deletes_row`: click calls `delete` filtered by `eq('id', id)`.
- `redirects_home_after_delete`: navigation to `/` occurs on success.
- `error_keeps_page`: when `delete` returns an error, the page does not navigate away.
- `creator_gone_from_list`: homepage no longer lists the deleted creator.

## Constraints
- Dependencies: `08-update-creator` (shares `EditCreator.jsx`; merge after it), `13-auth`.
- Backward compatibility: must not disturb the update form/handler on the same page.

## Context
- Supabase JS delete: https://supabase.com/docs/reference/javascript/introduction
