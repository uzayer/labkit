# Getting Started with LabKit

## Prerequisites
- Node.js 18+ and pnpm
- MongoDB database (local or cloud)
- Git

## Quick Start
To spin up this project locally, follow these steps.

## Installation & Setup
1. Create a repository for your LabKit project.
2. Push this codebase to your repository (or fork it), then clone it to your development machine.
3. Open the project folder in your terminal.

## Configure Package Manager
After cloning your repo, make sure you install the correct package manager version by enabling Corepack. In your repo console, run:

```bash
corepack enable
pnpm -v
```

Your pnpm version should now match the version specified in `package.json`.

## Install Dependencies
```bash
pnpm install
```

## Copy Environment Variables
```bash
cp .env.example .env
```

## Set Up MongoDB
Install MongoDB locally or use a hosted service such as Atlas MongoDB Cloud Account or the Vercel MongoDB integration.

After setting up MongoDB, update your `.env` file with the MongoDB connection string:

```bash
MONGODB_URI=your_connection_string
```

Make sure the connection URL includes the credentials and database name.

- Remote (example):
  ```text
  mongodb+srv://<username>:<password>@cluster0.3fjkv.mongodb.net/<DB_NAME>?retryWrites=true&w=majority&appName=Cluster0
  ```
- Local (example):
  ```text
  mongodb://localhost:27017/<DB_NAME>
  ```

## Start the Development Server
```bash
pnpm dev
```

## Visit the Application
Open the admin panel in your browser:
- http://localhost:3000/admin

On first login, you will be asked to create an admin user.

## Seed the Database (Optional)
Click on the `Seed DB` button in the Admin panel home page to create some starter pages.

This step is recommended for those not familiar with Payload CMS.

If seeding was successful, you will see new content on the homepage:
- http://localhost:3000/

You can now visit the admin panel pages collection to edit the new demo pages:
- http://localhost:3000/admin/collections/pages

## Change All Secrets (Optional but Recommended)
Open your `.env` file and change all secrets. Create some random string for each of these:
- `PAYLOAD_SECRET`
- `PAYLOAD_PUBLIC_DRAFT_SECRET`
- `NEXT_PRIVATE_DRAFT_SECRET`
- `REVALIDATION_KEY`
- `NEXT_PRIVATE_REVALIDATION_KEY`
- `CRON_SECRET`
