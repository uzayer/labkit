# Email Configuration
Learn how to configure email in LabKit and the supported email providers.

LabKit uses Resend as its email service provider through the official @payloadcms/email-resend adapter. This is the recommended setup for projects deployed on Vercel due to its lightweight nature and excellent integration.

## Current Setup
The project is configured to use Resend for all email communications, including:
- User authentication emails (password reset, email verification)
- Form submission notifications
- System notifications

## Configuration
1. Get your Resend API key from the Resend Dashboard.
2. Add it to your `.env` file:

```bash
RESEND_API_KEY=re_xxxx...
EMAIL_FROM_ADDRESS=info@example.com
```

## Alternative Email Providers
While Resend is the default choice, PayloadCMS supports several other email options:

### Nodemailer (SMTP)
For traditional SMTP setup, you can switch to the Nodemailer adapter:

```ts
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'

export default buildConfig({
  email: nodemailerAdapter({
    transportOptions: {
      host: 'smtp.example.com',
      auth: {
        user: 'username',
        pass: 'password'
      },
      port: 587,
      secure: false, // true for 465, false for other ports
    },
  }),
})
```

### SendGrid
You can use SendGrid through Nodemailer’s transport:

```ts
import nodemailer from 'nodemailer'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'

export default buildConfig({
  email: nodemailerAdapter({
    transport: nodemailer.createTransport({
      service: 'SendGrid',
      auth: {
        user: 'apikey',
        pass: 'YOUR_SENDGRID_API_KEY'
      }
    })
  }),
})
```

## Sending Emails Programmatically
You can send emails from anywhere in your code using the PayloadCMS email API:

```ts
await payload.sendEmail({
  to: 'recipient@example.com',
  subject: 'Hello from LabKit',
  html: '<h1>Welcome!</h1><p>Your email content here</p>',
})
```

## Development Testing
During development:
- For Resend: use test API keys from your Resend dashboard.
- For Nodemailer: if no configuration is provided, it will automatically use Ethereal Email for testing.

## Resources
- PayloadCMS Email Documentation
- Resend Documentation
- Nodemailer Documentation