# Leon - Restaurant Management System

A modern restaurant management system built with Nuxt.js frontend and PocketBase backend, featuring Google OAuth authentication.

## Prerequisites

- Node.js 18+
- pnpm
- Docker & Docker Compose (for containerized development)

## 🚀 Quick Start

### Option 1: Docker Development (Recommended)

```bash
# Start development environment
make dev

# Available at:
# - Frontend: http://localhost:3000
# - PocketBase Admin: http://localhost:8090/_/
```

### Option 2: Local Development

```bash
# Terminal 1: Start PocketBase
pnpm server:dev

# Terminal 2: Start frontend (in another terminal)
pnpm client:dev
```

## 🐳 Docker Commands

| Command      | Description                                      |
| ------------ | ------------------------------------------------ |
| `make dev`   | Start development environment with hot reloading |
| `make prod`  | Start production environment                     |
| `make build` | Build all containers                             |
| `make clean` | Clean up containers, images, and volumes         |
| `make logs`  | View logs for all services                       |
| `make shell` | Open shell in client container                   |
| `make down`  | Stop all services                                |
| `make help`  | Show all available commands                      |

## 📦 Local Development Setup

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
│   ├── pb_data/      # Database files (git ignored)
│   ├── pb_migrations/# Database migrations
│   └── Dockerfile    # PocketBase container
├── docker-compose.yml      # Production Docker setup
├── docker-compose.dev.yml  # Development Docker setup
├── Makefile         # Convenient Docker commands
└── docs/            # Documentation
```

## 🐳 Docker Features

- **Multi-stage builds** for optimized production images
- **Hot reloading** in development mode
- **Volume mounting** for live code changes
- **Health checks** and proper service dependencies
- **Non-root users** for enhanced security
- **Local database sync** (PocketBase data persists locally)

## 🔧 Development Workflow

### Docker Development (Recommended)

```bash
# Start everything
make dev

# Make changes to your code - they'll auto-reload!

# View logs if needed
make logs

# Clean up when done
make down
```

### Local Development (Alternative)

```bash
# Terminal 1: PocketBase
cd pocketbase && ./pocketbase serve

# Terminal 2: Frontend
pnpm client:dev
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

## 🌐 Development URLs

| Service          | Docker                    | Local                     |
| ---------------- | ------------------------- | ------------------------- |
| Frontend         | http://localhost:3000     | http://localhost:3000     |
| PocketBase Admin | http://localhost:8090/\_/ | http://127.0.0.1:8090/_/  |
| PocketBase API   | http://localhost:8090/api | http://127.0.0.1:8090/api |
