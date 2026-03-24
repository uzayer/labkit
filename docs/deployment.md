# Deployment
Learn how to deploy LabKit to Vercel or other platforms.

LabKit is optimized for deployment on Vercel, but can be deployed to other platforms with some additional configuration.

## Vercel Deployment (Recommended)
### Prerequisites
- A Vercel account
- Your project pushed to a Git repository (GitHub, GitLab, or Bitbucket)

### Steps
1. Connect your repository to Vercel:
   - Go to Vercel
   - Click “New Project”
   - Import your repository
   - Select the LabKit repository
2. Configure environment variables:
   - Open your `.env` file and make sure all default secret values are replaced with random secrets from your side.
   - Copy all variables from your `.env` file.
   - Add them to your Vercel project settings.
   - If you used a local MongoDB for development, update `MONGODB_URI` with a hosted MongoDB such as Atlas MongoDB Cloud or Vercel MongoDB Integration. We recommend a separate DB between dev/preview and production. Also update your local `.env` if you decide to use remote DB.
   - Update `PAYLOAD_PUBLIC_SERVER_URL` and `NEXT_PUBLIC_SERVER_URL` to match your production domain. Set these env variables to be only available for the production environment. For preview environments, we will fall back to `VERCEL_URL` (set automatically by Vercel).
3. Deploy:
   - Click “Deploy”
   - Vercel will automatically build and deploy your project
   - Your site will be live at a Vercel-provided URL
4. Connect Vercel Blob Storage:
   - The default Node.js file storage will not work in Vercel deployments.
   - Therefore, a real cloud storage like Vercel Blob Storage is needed.
   - Enable Vercel Blob in your project settings.
   - Add `BLOB_READ_WRITE_TOKEN` to your local and project environment variables.
   - After `BLOB_READ_WRITE_TOKEN` is set, Payload will switch from storing media in local files (`/public/media/...`) to storing them in Vercel Blob Storage. If you already uploaded media in the Payload admin UI before enabling blob storage, you need to manually upload them via the Vercel Blob Storage dashboard. Open your `/public/media` folder and drag-and-drop them into the Vercel Blob Storage Browser area (located in the Vercel dashboard).
## Alternative Deployments
For deployments to other platforms, you’ll need to modify the storage adapter.

### Required Changes
- Storage Adapter: replace the Vercel Blob storage adapter in `src/config/plugins/upload.ts`:

```ts
import { s3Adapter } from '@payloadcms/plugin-cloud-storage/s3'

const storageAdapter = s3Adapter({
  config: {
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    },
    region: process.env.S3_REGION,
    bucket: process.env.S3_BUCKET,
  },
})
```
- Environment Variables: update your environment variables according to your chosen storage solution.

### Platform-Specific Guidelines
- AWS Elastic Beanstalk:
  - Create an Elastic Beanstalk environment
  - Configure environment variables
  - Set up S3 for file storage
  - Deploy using the AWS CLI or console
- Digital Ocean App Platform:
  - Create a new app from your repository
  - Configure environment variables
  - Set up Spaces for file storage
  - Deploy directly from your repository
- Self-Hosted:
  - Set up a Node.js environment
  - Configure your web server (nginx recommended)
  - Set up PM2 (or similar process manager)
  - Configure environment variables
  - Set up local or cloud storage solution

## Production Considerations
### Database
- Use a production MongoDB instance
- Configure proper authentication
- Set up database backups

### Environment
- Use production-grade environment variables
- Configure proper security headers
- Set up SSL/TLS

### Monitoring
- Set up error tracking (e.g., Sentry)
- Configure performance monitoring
- Set up uptime monitoring

### Backups
- Regular database backups
- Media files backup strategy
- Environment configuration backup

## Deployment Checklist
- Environment variables configured
- Database connection tested
- Storage adapter properly configured
- SSL/TLS certificates set up
- Domain configuration updated
- Backups configured
- Monitoring tools set up
- Security headers configured
- Build process verified
- Performance tested