# Leon - Restaurant Management System

A modern restaurant management system built with Nuxt.js frontend and PocketBase backend, featuring Google OAuth authentication.

## Prerequisites

- Node.js 18+
- pnpm

## Local Development Setup

1. **Install dependencies:**

   ```bash
   pnpm client:install
   ```

2. **Set up environment variables:**

   ```bash
   cp client/.env.example client/.env
   ```

3. **Start PocketBase server**

   ```bash
   pnpm server:dev
   ```

4. **Start the frontend (in another terminal):**
   ```bash
   pnpm client:dev
   ```

## 📁 Project Structure

```
leon/
├── client/           # Nuxt.js application
│   ├── app/          # Pages, components, layouts
│   ├── composables/  # Vue composables (auth, etc.)
│   ├── utils/        # Utilities
│   └── .env         # Environment configuration
├── pocketbase/       # PocketBase backend
└── docs/            # Documentation
```

## 🔐 Authentication Setup

This project uses PocketBase with Google OAuth for authentication.

### Local Google OAuth Configuration

1. Follow the setup guide in `docs/google-oauth.md`
2. Configure credentials in PocketBase admin panel:
   - Go to http://127.0.0.1:8090/_/
   - Navigate to Settings → Auth providers → Google
   - Enter your Google Client ID and Secret

**Important:** Register `http://127.0.0.1:8090/api/oauth2-redirect` as redirect URL in Google Cloud Console.

## 🗄️ Database Schema

- `users` - User accounts with roles (admin/customer)
- `products` - Restaurant menu items
- `orders` - Customer orders
- `order_items` - Individual items within orders

## Local Development URLs

- Frontend: http://localhost:3000
- PocketBase Admin: http://127.0.0.1:8090/_/
