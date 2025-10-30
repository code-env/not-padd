# GitHub App Integration Setup Guide

## Overview

This guide walks you through setting up GitHub App integration for your NotPadd application.

## Prerequisites

- A GitHub account
- Access to your NotPadd application
- Admin access to create a GitHub App

## Step 1: Create a GitHub App

1. Go to GitHub Settings
   - For personal account: https://github.com/settings/apps
   - For organization: https://github.com/organizations/{org-name}/settings/apps

2. Click **"New GitHub App"**

3. Fill in the required fields:
   - **GitHub App name**: Choose a unique name (e.g., `my-notpadd-app`)
   - **Homepage URL**: Your app's homepage (e.g., `https://yourdomain.com`)
   - **Callback URL**: `https://yourdomain.com/api/github-callback`
   - **Webhook URL**: (Optional) If you want to receive webhooks
   - **Webhook secret**: (Optional) Generate a random string if using webhooks

4. Set Permissions:
   - **Repository permissions**:
     - Contents: Read & write (if you need to read/write to repos)
     - Metadata: Read-only (required)
   - **Organization permissions**: (Optional, based on your needs)
   - **Account permissions**: (Optional, based on your needs)

5. **Subscribe to events**: (Optional) Select events you want to receive

6. **Where can this GitHub App be installed?**
   - Choose "Any account" to allow installation on any GitHub account

7. Click **"Create GitHub App"**

## Step 2: Configure Environment Variables

After creating your GitHub App, add these environment variables to your `.env` file:

```bash
# GitHub App Configuration
NEXT_PUBLIC_GITHUB_APP_NAME="your-github-app-name"  # The name you chose in Step 1
GITHUB_APP_CLIENT_ID="your_client_id"               # From GitHub App settings
GITHUB_APP_CLIENT_SECRET="your_client_secret"       # Generate in GitHub App settings
GITHUB_APP_ID="your_app_id"                         # From GitHub App settings
GITHUB_APP_PRIVATE_KEY="your_private_key"           # Generate in GitHub App settings (optional for now)
```

### Where to find these values:

1. **NEXT_PUBLIC_GITHUB_APP_NAME**: The URL-friendly name you chose (visible in the app URL)
2. **GITHUB_APP_CLIENT_ID**: In your GitHub App settings page
3. **GITHUB_APP_CLIENT_SECRET**: Generate a new client secret in the GitHub App settings
4. **GITHUB_APP_ID**: At the top of your GitHub App settings page (App ID)
5. **GITHUB_APP_PRIVATE_KEY**: Generate a private key in GitHub App settings (needed for API authentication)

## Step 3: Update Turbo.json (Optional)

If you want these env vars available in all workspaces, add them to `turbo.json`:

```json
{
  "globalEnv": [
    // ... existing vars
    "GITHUB_APP_CLIENT_ID",
    "GITHUB_APP_CLIENT_SECRET",
    "GITHUB_APP_ID",
    "GITHUB_APP_PRIVATE_KEY",
    "NEXT_PUBLIC_GITHUB_APP_NAME"
  ]
}
```

## Step 4: Build and Restart

```bash
# Build the env package
pnpm --filter @notpadd/env build

# Restart your development server
pnpm dev
```

## Step 5: Initiate GitHub App Installation

1. Navigate to your organization settings page:

   ```
   https://yourdomain.com/{org-slug}/settings/general
   ```

2. You'll see the **GitHub Integration** card with a "Connect" button

3. Click **"Connect"** to be redirected to GitHub

4. Select the account/organization where you want to install the app

5. Choose which repositories to grant access to (All or Select)

6. Click **"Install"**

7. You'll be redirected back to your settings page with the integration connected

## How It Works

### Installation Flow

1. **User clicks "Connect"** → Component initiates OAuth flow

   ```
   https://github.com/apps/{app-name}/installations/new?state={org-id}
   ```

2. **GitHub redirects back** → After installation, GitHub calls your callback:

   ```
   /api/github-callback?installation_id={id}&state={org-id}
   ```

3. **Callback handler** → Saves the integration to your database:
   - Creates `githubAppIntegration` record
   - Links it to the organization
   - Stores installation metadata

4. **User sees connected state** → Component fetches and displays integration status

### Component Features

The `GithubAppLogin` component (`apps/web/components/auth/github-app-login.tsx`):

- ✅ Fetches current integration status
- ✅ Shows "Connect" button if not connected
- ✅ Shows "Disconnect" button if connected
- ✅ Displays connected GitHub account name
- ✅ Handles loading and error states

## API Endpoints

Your app now has these GitHub App integration endpoints:

- `POST /api/github-app/:organizationId` - Create integration
- `GET /api/github-app/:organizationId` - List integrations
- `GET /api/github-app/:organizationId/:integrationId` - Get integration
- `PUT /api/github-app/:organizationId/:integrationId` - Update integration
- `DELETE /api/github-app/:organizationId/:integrationId` - Delete integration

## Next Steps: Enhance the Callback (Optional)

The current callback handler (`apps/web/app/api/github-callback/route.ts`) uses placeholder data. You can enhance it to:

1. **Fetch real installation data from GitHub**:

   ```typescript
   const response = await fetch(
     `https://api.github.com/app/installations/${installationId}`,
     {
       headers: {
         Authorization: `Bearer ${jwt_token}`,
         Accept: "application/vnd.github+json",
       },
     }
   );
   const data = await response.json();
   ```

2. **Store additional metadata**:
   - Repository access list
   - Installation permissions
   - Webhook URLs

3. **Set up webhook handler** to receive events from GitHub

## Troubleshooting

### Error: "GitHub App name is not configured"

- Make sure `NEXT_PUBLIC_GITHUB_APP_NAME` is set in your `.env` file
- Rebuild and restart your app

### Error: "Missing installation data"

- Check that your callback URL is correctly configured in GitHub App settings
- Verify the URL matches: `https://yourdomain.com/api/github-callback`

### Integration not showing as connected

- Check browser console for errors
- Verify the API endpoints are working
- Check database for the `github_app_integration` table and records

## Security Notes

- ⚠️ **Never commit** your GitHub App credentials to version control
- 🔒 Store `GITHUB_APP_PRIVATE_KEY` securely (consider using a secrets manager)
- 🔐 The `state` parameter prevents CSRF attacks by verifying the org ID
- ✅ All API endpoints require authentication and organization membership

## Database Schema

The integration data is stored in the `github_app_integration` table:

```typescript
{
  id: string; // UUID
  organizationId: string; // Links to organization
  installationId: string; // GitHub installation ID (unique)
  githubAccountName: string; // GitHub username/org name
  githubAccountId: string; // GitHub account ID
  githubAccountType: string; // "User" or "Organization"
  accessTokensUrl: string; // URL to get access tokens
  repositoriesUrl: string; // URL to get repositories
  metadata: object; // Additional data
  createdAt: Date;
  updatedAt: Date;
}
```

## Support

For issues or questions, check:

- The linter errors in your IDE
- Browser console for client-side errors
- Server logs for API errors
- GitHub App installation status in GitHub settings
