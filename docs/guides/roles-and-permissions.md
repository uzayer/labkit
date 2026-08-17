# Roles and permissions

LabKit starts with two Roles for the people who operate a Lab website.

| Role | Use it for | Effective access |
| --- | --- | --- |
| Admin | Instance administration and sensitive import work | content, redirects, Users, Roles, Import Runs, Review Items, and Admin-only globals |
| Editor | Day-to-day work by a Lab Editor | routine content collections and authenticated draft reads |

Assign the least-powerful Role that still lets someone do their work. Most Lab Editors should be Editors; keep the Admin group small.

## How users receive a Role

- A new user receives the Editor role by default.
- An Admin creating a user may assign a Role explicitly.
- If the instance has no Admin, the oldest user is promoted once to bootstrap it.
- Google sign-in domain allowlisting controls who may authenticate. It does not make an allowed user an Admin.

The system prevents a user from deleting their own account and prevents the last Admin from being demoted or deleted.

## Manage Roles

Admins manage Role documents at `/admin/collections/roles` and Users at `/admin/collections/users`.

Each Role stores these flags:

| Flag | Enforced today |
| --- | --- |
| `canManageContent` | Yes — create, update, and delete on the main content collections |
| `canManageRedirects` | Yes — redirect writes |
| `canPublish` | No — stored for a future policy, not currently consulted |
| `canManageUsers` | No — User and Role management currently require the Admin role slug |

Do not create a custom Role based only on the labels in the Admin Panel. Verify the affected operation in a fresh session; an unused flag grants nothing.

## After changing access

1. Have the affected user sign out and back in.
2. Test the exact create, edit, publish, delete, or administrative action they need.
3. Confirm an Editor still cannot reach Admin-only collections.
4. Keep at least one verified Admin account.

For implementation details and current gaps, see [Access control](../architecture/access-control.md). For Google login and domain allowlisting, see [Authentication](./authentication.md).
