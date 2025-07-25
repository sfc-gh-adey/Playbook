# Vercel Deployment Setup

## Environment Variables

You need to add these environment variables in your Vercel project settings:

### 1. Go to your Vercel project dashboard
Navigate to: https://vercel.com/[your-username]/[your-project]/settings/environment-variables

### 2. Add the following environment variables:

#### VITE_GITHUB_CLIENT_ID (Public)
- **Key**: `VITE_GITHUB_CLIENT_ID`
- **Value**: `Ov23liE61Pl2AubDldYI`
- **Environment**: Production, Preview, Development
- **Type**: Plain text

#### GITHUB_CLIENT_SECRET (Secret)
- **Key**: `GITHUB_CLIENT_SECRET`
- **Value**: Get this from your GitHub OAuth App settings
- **Environment**: Production, Preview, Development
- **Type**: Sensitive (check the "Sensitive" checkbox)

### 3. Get your GitHub Client Secret:
1. Go to https://github.com/settings/developers
2. Click on your OAuth App
3. Copy the "Client secret" (you may need to regenerate it)

### 4. Update your GitHub OAuth App settings:
Make sure your Authorization callback URL includes your Vercel domain:
- `https://your-app.vercel.app`
- `https://your-custom-domain.com` (if you have one)

### 5. Deploy
After adding the environment variables, redeploy your project:
```bash
vercel --prod
```

## Testing OAuth Flow

1. Visit your deployed app
2. Click "Sign in with GitHub"
3. Authorize the app
4. You should be redirected back and logged in!

## Troubleshooting

If OAuth isn't working:
1. Check the browser console for errors
2. Verify your callback URL matches exactly
3. Make sure both environment variables are set
4. Check Vercel Functions logs for the `/api/github-auth` endpoint 