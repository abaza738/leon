# Setting Up Google OAuth

## 1. Access Google Cloud Console & Select Project

- Go to console.cloud.google.com.
- Select your existing Google Cloud Project or create a new one.

## 2. Configure OAuth Consent Screen

- In the navigation menu, go to APIs & Services > OAuth consent screen.
- Choose your User Type (Internal or External).
- Fill in the required App information (App name, User support email, etc.).
- Define Scopes: Click "Add or Remove Scopes" and select the necessary API permissions your - application needs.
- Add Test users if your app is External and in "Testing" status.
- Save your changes.

## 3. Create OAuth Client ID

- Navigate to APIs & Services > Credentials.
- Click "Create Credentials" and select "OAuth client ID."
- Choose your Application type (e.g., Web application, Android, iOS, Desktop app).
- Provide a Name for your client ID.
- For Web applications:
  - Add Authorized JavaScript origins: `http://localhost:3000`.
  - Add Authorized redirect URIs (the URL where Google redirects after authentication): in this project's case, it should be set to `http://localhost:3000/api/auth/google`.
- Click "Create."

## 4. Copy Credentials

- A dialog will appear showing your Client ID and, for most types, your Client Secret.
- Copy and securely store both of these values. You'll need them in your application's configuration.
