# Access Control & RBAC Extension

**Last Updated:** March 2026  
**Status:** Stable — Custom extension on top of PayloadCMS

## Overview

This codebase extends PayloadCMS's standard RBAC (Role-Based Access Control) with a custom **Roles collection** that provides database-driven, configurable permissions. This differs from Payload's official pattern of using a simple `select` field on Users.

**Key differences:**
- Official Payload: Roles are strings in a `select` field (`['admin', 'editor']`)
- This codebase: Roles are full MongoDB documents with configurable permission flags

## Why We Extended Payload's RBAC

The standard Payload pattern (documented in their guides) looks like this:

```typescript
// Standard Payload approach
{
  name: 'roles',
  type: 'select',
  hasMany: true,
  saveToJWT: true,
  options: ['admin', 'editor', 'user'],
  defaultValue: ['user'],
}
```

This works well for simple role checks, but has limitations:
- Permissions are hardcoded in application code
- Adding new permissions requires code changes and deployment
- No fine-grained control without editing access functions

**Our approach** uses a separate `Roles` collection where each role is a document with configurable permissions:

```typescript
{
  _id: "abc123",
  name: "Admin",
  slug: "admin",
  permissions: {
    canManageContent: true,
    canPublish: true,
    canManageUsers: true,
    canManageRedirects: true
  }
}
```

**Trade-off:** This is more flexible but relies on undocumented Payload behavior (see "The JWT Reliability Question" below).

## The Roles Collection Structure

**File:** `src/collections/Roles/index.ts`

Each role document contains:
- `name`: Display name (e.g., "Admin", "Editor")
- `slug`: Unique identifier (e.g., "admin", "editor")
- `permissions`: Group of boolean flags:
  - `canManageContent`: Create/edit content collections
  - `canPublish`: Publish content
  - `canManageUsers`: User administration
  - `canManageRedirects`: Manage URL redirects

Roles are assigned to users via a `relationship` field in the Users collection:

```typescript
// src/collections/Users/index.ts
{
  name: 'roles',
  type: 'relationship',
  relationTo: 'roles',
  hasMany: true,
  saveToJWT: true,  // ⚠️ Undocumented behavior for relationships
}
```

## The Two Permission Check Utilities

### `checkRole` — Official Pattern (Reliable)

**File:** `src/utilities/checkRole.ts`

Checks if a user has any of the specified role **slugs**:

```typescript
export const checkRole = (allRoles: string[], user) => {
  const userRoles = user.roles.map(role => {
    if (typeof role === 'string') return role
    return role.slug
  })
  return allRoles.some(role => userRoles.includes(role))
}
```

**Usage:**
```typescript
// Check if user is admin
checkRole(['admin'], user)

// Check if user is admin OR editor
checkRole(['admin', 'editor'], user)
```

**Reliability:** ✅ Works regardless of whether roles are strings or objects in the JWT.

### `hasPermission` — Custom Pattern (Requires Full Objects)

**File:** `src/utilities/checkPermission.ts`

Checks if a user has a specific permission flag:

```typescript
export const checkPermission = (permissionKey: string, user) => {
  return user.roles.some(role => {
    if (typeof role === 'string') {
      console.warn('Role ID provided as string, cannot check permissions.')
      return false  // Fails closed — denies access if uncertain
    }
    return role.permissions?.[permissionKey] === true
  })
}

// Wrapper for use in access control config
export const hasPermission = (permissionKey: string) => {
  return ({ req }) => checkPermission(permissionKey, req.user)
}
```

**Usage:**
```typescript
// In collection access control
access: {
  create: hasPermission('canManageContent'),
  update: hasPermission('canManageContent'),
  delete: hasPermission('canManageContent'),
}
```

**Reliability:** ⚠️ Requires roles to be **full objects** in the JWT, not just IDs.

### Comparison

| Aspect | `checkRole` | `hasPermission` |
|--------|-------------|-----------------|
| **What it checks** | Role slug (e.g. "admin") | Permission flag (e.g. `canManageContent`) |
| **Works with string IDs?** | ✅ Yes | ❌ No — warns and denies |
| **Works with slug strings?** | ✅ Yes | ❌ No — no `.permissions` property |
| **Works with full objects?** | ✅ Yes | ✅ Yes |
| **Follows Payload docs?** | ✅ Yes | ❌ Custom extension |
| **Configurable via CMS?** | No — hardcoded in code | Yes — edit in admin UI |

## The JWT Reliability Question

**Critical question:** When a user logs in, what does Payload actually put in the JWT for the `roles` field?

### Option A: Just the IDs (breaks `hasPermission`)
```json
{
  "id": "6671",
  "email": "user@example.com",
  "roles": ["abc123def456"]  // MongoDB ObjectId strings
}
```

If this is what's stored, `hasPermission` always returns `false` for everyone.

### Option B: Full populated objects (works)
```json
{
  "id": "6671",
  "email": "user@example.com",
  "roles": [
    {
      "id": "abc123def456",
      "slug": "admin",
      "permissions": {
        "canManageContent": true,
        "canPublish": true,
        "canManageUsers": true,
        "canManageRedirects": true
      }
    }
  ]
}
```

If this is what's stored, `hasPermission` works correctly.

### What Payload Actually Does

PayloadCMS's documentation explicitly mentions `saveToJWT` works for `select`, `group`, and `tab` fields. **Relationship fields are not mentioned.** This means the behavior is **undocumented**.

**Why it probably works anyway:** When Payload generates the JWT at login time, it likely fetches the user document at depth 1 (which populates one level of relationships), so the roles come out as full objects.

**The risk:** This is inferred behavior, not guaranteed. Payload upgrades could change this without warning.

### JWT Staleness Problem

JWTs cache data. When permissions change in the database, existing JWTs still have the old values:

```
User logs in → JWT created with roles as full objects ✓
Admin changes Editor role permissions in CMS
→ MongoDB "roles" document updated ✓
→ Existing JWTs still have OLD permissions ✗
→ User must log out and back in to get new permissions
```

This staleness is inherent to JWTs (not unique to this pattern), but the Roles collection adds a second cacheable layer.

## How This is Used in the Codebase

### Collection Access Control

Most collections use `hasPermission`:

```typescript
// src/collections/Pages/index.ts
access: {
  create: hasPermission('canManageContent'),
  update: hasPermission('canManageContent'),
  delete: hasPermission('canManageContent'),
  read: authenticatedOrPublished,
}
```

All research collections (Publications, Team, Projects, Grants, etc.) follow the same pattern.

### Admin Dashboard Access

The admin dashboard uses `checkRole` (the reliable pattern):

```typescript
// src/collections/Users/index.ts
admin: {
  useAsTitle: 'name',
  defaultColumns: ['name', 'email'],
  group: 'Admin',
  condition: (user) => checkRole(['admin', 'editor'], user),
}
```

### Field-Level Access

The `roles` field itself has special access rules:

```typescript
// src/collections/Users/index.ts
{
  name: 'roles',
  access: {
    create: () => true,  // ⚠️ SECURITY ISSUE: Anyone can set roles on create
    update: isAdminFieldLevel,
  }
}
```

**Note:** The `create: () => true` is mitigated by a `beforeValidate` hook that overwrites submitted roles, but this is fragile. Any code path that bypasses the hook (OAuth plugins, server actions, Local API calls) could be exploited.

## Default Roles Initialization

**File:** `src/utilities/initRoles.ts`

When the server starts, `initializeRoles()` checks if the roles collection is empty. If so, it creates two default roles:

```typescript
const defaultRoles = [
  {
    name: 'Admin',
    slug: 'admin',
    permissions: {
      canManageContent: true,
      canPublish: true,
      canManageUsers: true,
      canManageRedirects: true,
    },
  },
  {
    name: 'Editor',
    slug: 'editor',
    permissions: {
      canManageContent: true,
      canPublish: false,
      canManageUsers: false,
      canManageRedirects: false,
    },
  },
]
```

**Called from:** `src/payload.config.ts` in the `onInit` hook.

## How Users Get Roles

**File:** `src/collections/Users/index.ts` (lines 36-77)

A `beforeValidate` hook runs when users are created. It assigns roles based on:

1. **First user ever:** Gets admin role automatically
2. **Email domain match:** If `ALLOWED_EMAIL_DOMAINS` includes the user's domain, gets admin role
3. **All others:** Get editor role

```typescript
beforeValidate: [
  async ({ data, req, operation }) => {
    if (operation === 'create' && !data.roles) {
      const { totalDocs } = await req.payload.count({
        collection: 'users',
        limit: 0,
      })
      
      if (totalDocs === 0) {
        // First user → admin
        const adminRole = await req.payload.find({
          collection: 'roles',
          where: { slug: { equals: 'admin' } },
        })
        return { ...data, roles: [adminRole.docs[0].id] }
      }
      
      // Check allowed domains...
    }
  }
]
```

## Comparison to Official Payload Pattern

### What the Official Pattern Looks Like

```typescript
// Official Payload RBAC (from docs)
{
  name: 'roles',
  type: 'select',
  hasMany: true,
  saveToJWT: true,  // Documented and reliable
  options: ['admin', 'editor'],
  defaultValue: ['editor'],
}

// Access control
access: {
  create: ({ req: { user } }) => checkRole(['admin', 'editor'], user),
  delete: ({ req: { user } }) => checkRole(['admin'], user),
}
```

No Roles collection. No `hasPermission`. No undocumented JWT behavior.

### Side-by-Side Comparison

| Aspect | This Codebase | Official Payload Pattern |
|--------|---------------|--------------------------|
| **Role storage** | Separate MongoDB collection | Field on Users (`type: select`) |
| **Permissions** | Configurable checkboxes per role | Fixed in code |
| **JWT content** | Full role objects (probably) | Role slug strings (documented) |
| **Check utility** | `hasPermission` (custom) | `checkRole` (standard) |
| **Change process** | Edit in admin UI, no deploy | Edit code, commit, deploy |
| **Reliability** | Depends on undocumented behavior | Fully documented |
| **Complexity** | High (5 files, extra collection) | Low (1 field, 1 utility) |
| **Use case** | Large systems, many roles | Simple multi-role CMS |

### Would Switching Lose Anything?

Currently, the distinction is:
- Admin: All permissions enabled
- Editor: Only `canManageContent` enabled

This can be expressed with `checkRole`:

```typescript
// canManageContent (admin + editor can write)
create: ({ req: { user } }) => checkRole(['admin', 'editor'], user)

// canManageRedirects (admin only)
create: ({ req: { user } }) => checkRole(['admin'], user)

// canManageUsers (admin only) — already uses isAdmin → checkRole
```

**Conclusion:** Nothing is lost. The official pattern is simpler and doesn't depend on undocumented behavior.

## Best Practices

### When to Use Each Utility

- **Use `checkRole`** for:
  - Admin dashboard access
  - Simple role checks (is user admin?)
  - Any security-critical checks
  - **Reason:** Reliable, documented, fail-safe

- **Use `hasPermission`** for:
  - Content collection access control
  - When you need CMS-configurable permissions
  - Non-critical permission checks
  - **Reason:** Flexible, but be aware of JWT reliability concerns

### Security Considerations

1. **Fail closed:** If `hasPermission` can't read permissions, it denies access (good)
2. **JWT staleness:** Changing role permissions requires users to re-login
3. **Field-level access bug:** The `roles` field has `create: () => true` — risky if hooks are bypassed
4. **No audit trail:** Changing permissions in the CMS leaves no git history

### Testing Permissions

Always test permission changes with:
1. Fresh login (not cached JWT)
2. Both admin and editor roles
3. Verify the warning "Role ID provided as string" doesn't appear in logs

If you see that warning, the JWT doesn't contain full role objects and `hasPermission` is failing for everyone.

## Related Files

- `src/collections/Roles/index.ts` — Roles collection definition
- `src/collections/Users/index.ts` — User-role relationship, auto-assignment logic
- `src/utilities/checkRole.ts` — Official pattern utility
- `src/utilities/checkPermission.ts` — Custom pattern utility
- `src/utilities/initRoles.ts` — Default roles seeding
- `src/access/isAdmin.ts` — Uses `checkRole`
- `src/access/authenticated.ts` — Simplest access function

## Further Reading

- [PayloadCMS Access Control](https://payloadcms.com/docs/access-control/overview)
- [PayloadCMS Authentication](https://payloadcms.com/docs/authentication/overview)
- [JWT Introduction](https://jwt.io/introduction)
