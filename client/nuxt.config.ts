// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      meta: [
        {
          'http-equiv': 'Content-Security-Policy',
          content:
            [
              // Default sources (adjust as needed for your app)
              "default-src 'self'",
              // Allow images from your own domain and Google's user content domain
              "img-src 'self' data: http://127.0.0.1:8090 http://localhost:8090 https://leon.up.railway.app https://lh3.googleusercontent.com",
              // Script sources (adjust as needed for your app)
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // 'unsafe-inline' and 'unsafe-eval' are often needed for development and some libraries, but should be refined for production.
              // Style sources (adjust as needed for your app)
              "style-src 'self' 'unsafe-inline'",
              // Connect sources (for API calls, etc.)
              "connect-src 'self' http://127.0.0.1:8090 http://localhost:8090 http://pocketbase:8090 https://leon.up.railway.app https://accounts.google.com https://oauth2.googleapis.com https://www.googleapis.com https://api.iconify.design", // Add any other API endpoints you connect to
              // Frame sources (for Google OAuth popups/iframes)
              "frame-src 'self' https://accounts.google.com",
              // Font sources
              "font-src 'self' data:",
            ].join('; ') + ';', // Join all directives with a semicolon
        },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'icon', type: 'image/png', href: '/favicon.png' },
      ],
    },
    rootTag: 'main',
    rootAttrs: { class: 'flex-1 flex flex-col bg-teal-100', id: 'leon' },
  },

  modules: ['@nuxt/ui'],

  runtimeConfig: {
    public: {
      pocketbaseUrl: process.env.POCKETBASE_URL || 'http://127.0.0.1:8090',
    },
  },

  css: ['~/assets/css/main.css'],

  future: { compatibilityVersion: 4 },

  fonts: { families: [{ name: 'Onest', provider: 'google' }] },

  ui: { colorMode: false },

  // Ensure proper SSR handling
  ssr: false,

  // Experimental features for better hydration
  experimental: {
    payloadExtraction: false, // Helps with auth state hydration
  },

  compatibilityDate: '2024-11-27',
})
