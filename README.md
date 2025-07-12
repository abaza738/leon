# Leon - Restaurant Management System

A modern restaurant management system built with Nuxt.js frontend and PocketBase backend, featuring Google OAuth authentication.

## 🔗 Related Repositories & Deployment

- **Backend Repository**: [leons-restaurant-backend](https://github.com/abdrizik/leons-restaurant-backend)
- **Deployed App**: [https://leons-restaurant.up.railway.app/](https://leons-restaurant.up.railway.app/)
- **Admin Dashboard**: [https://leons-restaurant.up.railway.app/\_/](https://leons-restaurant.up.railway.app/_/)

## Prerequisites

- Node.js 18+
- pnpm

## Local Development Setup

1. **Install dependencies:**

   ```bash
   pnpm install
   ```

2. **Set up environment variables:**

   ```bash
   cp .env.example .env
   ```

   Configure your `.env` file to point to either:
   - Local PocketBase instance (if running backend locally)
   - Production backend: `POCKETBASE_URL=https://leons-restaurant.up.railway.app`

3. **Start the frontend:**
   ```bash
   pnpm dev
   ```

## 📁 Project Structure

```
leon/
├── client/           # Nuxt.js application
│   ├── app/          # Pages, components, layouts
│   ├── composables/  # Vue composables (auth, etc.)
│   ├── utils/        # Utilities
│   └── .env         # Environment configuration
└── docs/            # Documentation
```

## 🔐 Authentication Setup _(Note: Only needed if setting up backend locally)_

This project uses PocketBase with Google OAuth for authentication.

### Google OAuth Configuration

For local development with Google OAuth:

1. Follow the setup guide in `docs/google-oauth.md`
2. Configure credentials in PocketBase admin panel:
   - Go to http://127.0.0.1:8090/_/
   - Navigate to Settings → Auth providers → Google
   - Enter your Google Client ID and Secret

**Important:** Register `http://127.0.0.1:8090/api/oauth2-redirect` as redirect URL in Google Cloud Console.

## Local Development URLs

- Frontend: http://localhost:3000
- PocketBase Admin: http://127.0.0.1:8090/_/
