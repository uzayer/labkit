# Roles and Permissions
Learn about roles and permissions in LabKit.

LabKit implements a robust role-based access control system to manage user permissions effectively.

## Default Roles
The system comes with two pre-configured roles:
- Admin: full access to all features; can manage content; can publish content; can manage users; the first user in the system is automatically assigned the admin role.
- Editor: can create and edit content; cannot publish content; cannot manage users; the most common role for content creators.

## Role Permissions
Each role has specific permissions that can be configured:

| Permission | Description |
|---|---|
| `canManageContent` | Ability to create and edit content |
| `canPublish` | Ability to publish content |
| `canManageUsers` | Ability to manage user accounts |

## Managing Roles
### Admin Panel
- Access the roles section at `/admin/collections/roles`
- Create, edit, or delete roles
- Configure permissions for each role

### Role Fields
- Name: display name of the role (e.g., “Admin”, “Editor”)
- Slug: unique identifier (automatically generated from name)
- Description: detailed explanation of the role’s purpose
- Permissions: group of specific permissions assigned to the role

## Access Control
The role system is used throughout LabKit to control access to various features:

### Content Management
- Only users with `canManageContent` permission can create and edit content
- Publishing requires `canPublish`
- Admins have unrestricted access to all content

### User Management
- Only admins can create new roles
- User role assignment is restricted to users with `canManageUsers`
- Users can only be assigned roles by administrators

## Best Practices
### Role Assignment
- Keep the number of admin users minimal
- Assign the most restrictive role that still allows users to perform their tasks
- Regularly audit user roles

### Custom Roles
- Create custom roles for specific needs rather than modifying existing ones
- Document the purpose and scope of custom roles
- Consider the principle of least privilege when defining permissions

### Security
- Regularly review role assignments
- Audit role permissions periodically
- Remove unused roles to maintain security

## Technical Implementation
Roles are implemented as a PayloadCMS collection with the following structure:

```json
{
  slug: 'roles',
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      unique: true
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true
    },
    {
      name: 'permissions',
      type: 'group',
      fields: [
        {
          name: 'canManageContent',
          type: 'checkbox',
          defaultValue: false
        },
        {
          name: 'canPublish',
          type: 'checkbox',
          defaultValue: false
        },
        {
          name: 'canManageUsers',
          type: 'checkbox',
          defaultValue: false
        }
      ]
    }
  ]
}
```

## Role Initialization
When LabKit starts for the first time, it automatically creates the default roles (`Admin` and `Editor`) if they don’t exist. This ensures that the basic role structure is always available.
---

## Developer Notes

### Custom RBAC Extension

This codebase extends PayloadCMS's standard RBAC with a custom **Roles collection** that provides database-driven, configurable permissions. This differs from Payload's official pattern of using a simple `select` field on Users.

**Key points for developers:**

1. **Two Permission Check Utilities:**
   - `checkRole(slugs[], user)` — Checks role slugs (reliable, follows Payload docs)
   - `hasPermission(permissionKey)` — Checks permission flags (custom, requires full role objects in JWT)

2. **JWT Reliability:**
   - The `roles` field uses `type: 'relationship'` with `saveToJWT: true`
   - This behavior is **undocumented** for relationship fields in Payload
   - It works because Payload populates relationships at depth 1 when creating JWTs
   - But this is inferred behavior, not guaranteed

3. **JWT Staleness:**
   - Changing role permissions in the CMS requires users to log out and back in
   - JWTs cache both role assignments AND permission flags

4. **When to Use Each Utility:**
   - Use `checkRole` for admin dashboard access and security-critical checks (reliable)
   - Use `hasPermission` for content collection access control (flexible but has caveats)

5. **Testing Permissions:**
   - Always test with fresh logins (not cached JWTs)
   - If you see "Role ID provided as string" warnings in logs, the JWT structure is wrong

**For a complete technical explanation**, see [Architecture: Access Control](../architecture/access-control.md).

### Related Files

- `src/collections/Roles/index.ts` — Roles collection definition
- `src/collections/Users/index.ts` — User-role relationship
- `src/utilities/checkRole.ts` — Standard role checking
- `src/utilities/checkPermission.ts` — Custom permission checking
- `src/utilities/initRoles.ts` — Default roles initialization
