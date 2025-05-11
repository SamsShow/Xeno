# Setting Up Google OAuth 2.0 Authentication

This document provides step-by-step instructions for setting up Google OAuth 2.0 authentication for the Xeno application.

## Prerequisites

- A Google account
- Access to the Google Cloud Console
- Local development environment

## Steps to Set Up Google OAuth

### 1. Create a Google Cloud Project

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Click on "Select a project" at the top right, then click "New Project"
3. Enter a project name (e.g., "Xeno") and click "Create"
4. Select your newly created project

### 2. Configure OAuth Consent Screen

1. In the left sidebar, navigate to "APIs & Services" > "OAuth consent screen"
2. Select "External" as the user type and click "Create"
3. Fill in the required fields:
   - App name: "Xeno"
   - User support email: Your email
   - Developer contact information: Your email
4. Click "Save and Continue"
5. On the "Scopes" page, click "Add or Remove Scopes" and select:
   - `./auth/userinfo.email`
   - `./auth/userinfo.profile`
   - `openid`
6. Click "Save and Continue"
7. Add test users if you're in testing mode, or click "Save and Continue"
8. Review your app registration and click "Back to Dashboard"

### 3. Create OAuth 2.0 Credentials

1. In the left sidebar, navigate to "APIs & Services" > "Credentials"
2. Click "Create Credentials" and select "OAuth client ID"
3. Select "Web application" as the application type
4. Enter a name for your OAuth client (e.g., "Xeno Web Client")
5. Add authorized JavaScript origins:
   - `http://localhost:5173` (for frontend development)
   - `http://localhost:3000` (for backend development)
6. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/google/callback`
7. Click "Create"
8. Note down your Client ID and Client Secret

### 4. Update Environment Variables

1. Open the `.env` file in the backend directory
2. Update the following variables:
   ```
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   JWT_SECRET=your-secure-random-string
   ```
   
   Replace the placeholders with your actual credentials. For JWT_SECRET, generate a secure random string (at least 32 characters).

3. Make sure your frontend URL is correctly set:
   ```
   FRONTEND_URL=http://localhost:5173
   ```

## Testing the Authentication

1. Start the backend server: `npm run dev` in the backend directory
2. Start the frontend server: `npm run dev` in the root directory
3. Open your browser and navigate to `http://localhost:5173`
4. Click "Sign in with Google" and follow the prompts
5. You should be redirected back to the application after successful authentication

## Troubleshooting

- If you encounter CORS issues, ensure that your frontend URL is correctly set in the `.env` file and that you've properly configured CORS in the backend
- If you're getting "Error 400: redirect_uri_mismatch", ensure that your redirect URI is exactly as specified in the Google Cloud Console
- For issues with JWT validation, check that your JWT_SECRET is correctly set and consistent

## Production Deployment

For production deployment, remember to:

1. Update the authorized JavaScript origins and redirect URIs in the Google Cloud Console
2. Set up a new OAuth consent screen for production if needed
3. Use secure environment variables for storing secrets
4. Consider using HTTP-only cookies instead of localStorage for storing JWTs
5. Implement rate limiting and additional security measures 