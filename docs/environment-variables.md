# Environment Variables

Learn how to configure environment variables for LabKit.

This document lists the environment variables required to run LabKit.

## Required Variables

```text
# Database
MONGODB_URI= # Your MongoDB connection string

# Authentication
# Google OAuth (optional)
GOOGLE_CLIENT_ID= # Google OAuth Client ID
GOOGLE_CLIENT_SECRET= # Google OAuth Client Secret
GOOGLE_CALLBACK_URL= # OAuth callback URL (e.g., http://localhost:3000/api/auth/google/callback)

# JWT
PAYLOAD_SECRET= # Random string for JWT encryption

# Email (optional)
RESEND_API_KEY=re_xxxx... # Resend API key
EMAIL_FROM_ADDRESS=info@example.com # Email address from which emails are sent by default

# Storage
# For Vercel Blob Storage (default)
BLOB_READ_WRITE_TOKEN= # Vercel Blob storage token
```

## Development Variables

Both variables are optional. They work automatically on localhost and use `VERCEL_URL` when deployed on Vercel.

```text
PAYLOAD_PUBLIC_SERVER_URL=http://localhost:3000 # Local development URL
NEXT_PUBLIC_SERVER_URL=http://localhost:3000    # Next.js public URL
```

## Production Variables

Both variables are optional. They work automatically on localhost and use `VERCEL_URL` when deployed on Vercel.

```text
PAYLOAD_PUBLIC_SERVER_URL=https://your-domain.com # Production URL
NEXT_PUBLIC_SERVER_URL=https://your-domain.com    # Production Next.js URL
```

## Alternative Storage Adapters

If you’re not deploying to Vercel, you’ll need to implement a different storage adapter. PayloadCMS supports various storage solutions including:
- AWS S3
- Google Cloud Storage
- Local filesystem

Refer to the PayloadCMS documentation for implementing alternative storage adapters.