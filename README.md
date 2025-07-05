# Nuxt UI Starter

Look at [Nuxt docs](https://nuxt.com/docs/getting-started/introduction) and [Nuxt UI docs](https://ui.nuxt.com) to learn more.

## Setup

Make sure to install the dependencies:

```bash
# pnpm
pnpm install
```

## Development Server

### Environment Variables

Google OAuth is used for authentication. You need to setup a project and [create an OAuth Client via Google Cloud Console](./docs/google-oauth.md).

Copy the variables from `.env.example` to a `.env` file.  
Each variable has a doc string to explain its usage.

```bash
cp .env.example .env
```

Start the development server on `http://localhost:3000`:

```bash
# pnpm
pnpm run dev
```

## Deployemnt

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
