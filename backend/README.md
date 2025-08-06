# Backend Setup

## Environment Variables

Create a `.env` file in the backend directory with the following variables:

```env
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GOOGLE_REDIRECT_URI=http://localhost:5173/oauth-callback

# Google Ads API Configuration
GOOGLE_ADS_DEVELOPER_TOKEN=your_developer_token_here
```

## Getting Google OAuth Credentials

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google Ads API
4. Go to "Credentials" and create OAuth 2.0 Client ID
5. Add `http://localhost:5173/oauth-callback` to the authorized redirect URIs
6. Copy the Client ID and Client Secret to your `.env` file

## Getting Google Ads Developer Token

1. Go to the [Google Ads API Center](https://developers.google.com/google-ads/api/docs/first-call/dev-token)
2. Request a developer token
3. Add the token to your `.env` file

## Installation

```bash
npm install
```

## Running the Server

```bash
node index.js
```

The server will run on port 5000 by default. 