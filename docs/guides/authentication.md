# Authentication

LabKit uses Payload's built-in email/password auth on the `Users` collection, plus an optional Google OAuth login button for the admin panel via the `payload-oauth2` plugin (`packages/core/src/auth/googleLogin.ts`, added by `labkitPlugin()`).

## Google OAuth Setup

Google login is disabled until both client credentials are set. Set these in `.env`:

```bash
GOOGLE_LOGIN_CLIENT_ID=
GOOGLE_LOGIN_CLIENT_SECRET=
```

To obtain them:

1. Create (or select) a project in the [Google Cloud Console](https://console.cloud.google.com/).
2. Under "APIs & Services" → "OAuth consent screen", configure an External app with the `email` and `profile` scopes.
3. Under "Credentials", create an OAuth Client ID of type "Web application".
4. Add an authorized redirect URI matching your `NEXT_PUBLIC_SERVER_URL` — the plugin builds the callback path itself from `serverURL`, so check the network tab on a login attempt if you're unsure of the exact path for your `payload-oauth2` version.

There is no separate callback-URL env var — the plugin derives the redirect from `NEXT_PUBLIC_SERVER_URL`.

## Restricting Sign-in by Domain

Set `ALLOWED_EMAIL_DOMAINS` (comma-separated) to reject Google sign-ins outside those domains:

```bash
ALLOWED_EMAIL_DOMAINS=example.edu,example.org
```

This check happens in the `getUserInfo` callback in `packages/core/src/auth/googleLogin.ts`, not in Google's OAuth consent flow — an unlisted domain still completes the Google auth handshake but is rejected afterward with "Email domain not allowed."

## How Users Get Roles

Role assignment on user creation is intentionally separate from authentication:

- `ALLOWED_EMAIL_DOMAINS` controls who may sign in with Google
- it does **not** grant the admin role
- new users are created as editors by default unless an admin explicitly assigns roles
- when the system has no admins yet, the oldest created user is promoted to admin once to bootstrap the instance

See [Roles and Permissions](./roles-and-permissions.md) and [Architecture: Access Control](../architecture/access-control.md) for the full policy.

## Related Files

- `packages/core/src/auth/googleLogin.ts` — `OAuth2Plugin` configuration, `googleLoginActive` flag
- `packages/core/src/auth/GoogleLoginButton.tsx` — renders the Google login button when enabled
