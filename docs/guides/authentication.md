# Authentication

Learn how to set up authentication in LabKit and about the supported providers.

LabKit includes built-in authentication support, including Google OAuth integration.

## Google Authentication Setup
1. Create a Google Cloud Project:
   - Go to Google Cloud Console
   - Create a new project or select an existing one
   - Enable the Google OAuth2 API
2. Configure OAuth Consent Screen:
   - Go to “OAuth consent screen”
   - Choose “External” user type
   - Fill in the required information
   - Add necessary scopes (`email`, `profile`)
3. Create OAuth Credentials:
   - Go to “Credentials”
   - Click “Create Credentials” > “OAuth client ID”
   - Choose “Web application”
4. Add authorized redirect URIs:
   - Development: `http://localhost:3000/api/auth/google/callback`
   - Production: `https://your-domain.com/api/auth/google/callback`
5. Set environment variables:

```bash
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback
```

## Authentication Flow
### Login Process
1. User clicks “Login with Google”
2. Redirected to the Google consent screen
3. After approval, redirected back to your app
4. Session created and user logged in

### User Creation
- First-time users automatically get a new account
- Email and basic profile info synced from Google
- Additional user fields can be filled later

## Custom Authentication
LabKit uses PayloadCMS’s authentication system. You can extend it with:
- Additional OAuth providers
- Email/password authentication
- Custom authentication strategies

Refer to PayloadCMS Authentication docs for more details.

## Security Best Practices
### Environment Variables
- Never commit credentials to version control
- Use different credentials for development and production
- Regularly rotate secrets

### OAuth Settings
- Restrict authorized domains
- Only request necessary scopes
- Keep OAuth consent screen information up to date

### Session Management
- Configure appropriate session timeouts
- Implement secure session storage
- Handle session expiration gracefully