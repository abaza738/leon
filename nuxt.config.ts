// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      meta: [
        {
          'http-equiv': 'Content-Security-Policy',
          content:
            [
              // Default sources
              "default-src 'self'",
              // Allow images from your own domain and Google's user content domain
              "img-src 'self' data: http://127.0.0.1:8090 http://localhost:8090 https://leons-restaurant.up.railway.app/ https://lh3.googleusercontent.com",
              // Script sources
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              // Style sources
              "style-src 'self' 'unsafe-inline'",
              // Connect sources (for API calls)
              "connect-src 'self' http://127.0.0.1:8090 http://localhost:8090 https://leons-restaurant.up.railway.app/ https://accounts.google.com https://oauth2.googleapis.com https://www.googleapis.com",
              // Frame sources (for Google OAuth popups/iframes)
              "frame-src 'self' https://accounts.google.com",
              // Font sources
              "font-src 'self' data:",
            ].join('; ') + ';',
        },
        // Add Cross-Origin-Opener-Policy to help with OAuth popup issues
        {
          'http-equiv': 'Cross-Origin-Opener-Policy',
          content: 'same-origin-allow-popups',
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

  modules: ['@nuxt/ui', '@vueuse/nuxt', '@pinia/nuxt'],

  runtimeConfig: {
    public: {
      pocketbaseUrl: process.env.POCKETBASE_URL || 'http://127.0.0.1:8090',
    },
  },

  css: ['~/assets/css/main.css'],

  future: { compatibilityVersion: 4 },

  fonts: { families: [{ name: 'Onest', provider: 'google' }] },

  ui: { colorMode: false },

  compatibilityDate: '2024-11-27',
})
