# Access control

LabKit uses Payload authentication with two layers of authorization:

1. role slugs answer identity questions such as “is this user an Admin?”; and
2. permission flags answer capability questions such as “may this user manage content?”

This page documents the current implementation. It does not prescribe Payload's generic RBAC pattern.

## Role documents

`Users.roles` is a many-to-many relationship to the `Roles` collection. Each Role has a stable `slug` and a `permissions` group.

The default roles are created during Payload initialization:

| Role | Intended use | Default permissions |
| --- | --- | --- |
| `admin` | Instance administration | all four flags enabled |
| `editor` | Routine content work | `canManageContent` only |

The four stored flags are:

- `canManageContent`
- `canPublish`
- `canManageUsers`
- `canManageRedirects`

Stored flags and enforced capabilities are not currently identical. `canManageContent` guards writes to content collections, and `canManageRedirects` guards redirect writes. `canPublish` and `canManageUsers` are stored but are not consulted by current access functions; user and Role management use the `admin` slug directly. Do not describe those two flags as enforced until the code uses them.

## The two checks

`checkRole()` reads a Role slug. It works with populated Role objects or slug strings. A relationship ID string does not contain a slug and therefore cannot prove a role. The check is used for Admin-only boundaries such as Users, Roles, Import Runs, Review Items, and admin-panel access.

`hasPermission()` reads a permission flag from populated Role objects. It fails closed and warns when a Role is only a string ID, because an ID does not contain permission data. Content collections use `hasPermission('canManageContent')`; redirect writes use `hasPermission('canManageRedirects')`.

The distinction is intentional: use a role check for a stable administrative identity, and a permission check for a configurable capability. Do not silently substitute one for the other.

## Effective policy

### Public and content reads

Versioned public collections such as Pages, Posts, and Projects use `authenticatedOrPublished`: unauthenticated readers see published documents, while authenticated users may read drafts.

Other research collections define their own public-read behavior. Their collection configuration is authoritative.

### Content writes

Pages, Posts, Media, Categories, Projects, Publications, Team, Grants, Awards, and Research Themes require `canManageContent` for create, update, and delete operations.

The Header and Footer globals currently allow any authenticated user to update them. PageConfig and ThemeConfig use Admin checks. These are current implementation boundaries, not a generalized promise that all globals follow one policy.

### Administrative records

- Import Runs and Review Items are Admin-only.
- Roles are readable by authenticated users and writable only by Admins.
- Users are readable by authenticated users, creatable and deletable only by Admins, and updatable by an Admin or the user themself.
- The `roles` field is assignable on creation only during first-user bootstrap or by an Admin. Only an Admin may update it afterward.
- A user cannot delete their own account.
- The last remaining Admin cannot be demoted or deleted.

## User creation and bootstrap

New users receive the Editor role unless an Admin intentionally supplies roles during creation.

If no Admin exists after the first user is created, the oldest user is promoted to Admin once. Google domain allowlisting controls who may authenticate through Google; it does not grant the Admin role.

See [Authentication](../guides/authentication.md) for sign-in configuration and [Roles and permissions](../guides/roles-and-permissions.md) for the Lab Editor-facing policy.

## Payload Local API rule

Payload's Local API bypasses access control by default. Any operation performed on behalf of a user must pass both the user and `overrideAccess: false`:

```ts
await payload.find({
  collection: 'pages',
  user,
  overrideAccess: false,
})
```

Trusted system work such as ingestion may intentionally override access. That choice must be explicit at the call site.

## Known constraints

### Permission checks need populated Roles

`hasPermission()` cannot evaluate a string relationship ID. The `roles` relationship uses `saveToJWT: true`, and the runtime expects `req.user.roles` to contain Role objects when permission checks run. If logs show “Role ID provided as string,” permission checks are denying access and the authentication/population path must be investigated.

### Permission changes can outlive a session

Role data is included in authentication state. After changing a Role's permissions, have affected users sign out and back in before testing the new policy.

### Unused flags can mislead

`canPublish` and `canManageUsers` look authoritative but currently do not gate those operations. Either wire them into access rules or remove them in a focused authorization change; documentation alone must not pretend they work.

## Verification checklist

When changing authorization:

1. test with a fresh Admin session and a fresh Editor session;
2. test REST or browser requests, not only trusted Local API calls;
3. test create, read, update, and delete separately;
4. verify draft versus published reads;
5. verify the last-Admin safeguards; and
6. check logs for unpopulated Role warnings.

No automated authorization test suite exists today, so record the manual cases run with the change.

## Related code

- `src/collections/Roles/index.ts`
- `src/collections/Users/index.ts`
- `src/utilities/initRoles.ts`
- `src/utilities/checkRole.ts`
- `src/utilities/checkPermission.ts`
- `src/access/isAdmin.ts`
- `src/access/isAdminOrCreatedBy.ts`
- `src/access/authenticatedOrPublished.ts`
