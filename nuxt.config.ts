// https://nuxt.com/docs/api/configuration/nuxt-config
const isDev = process.env.NODE_ENV === 'development' || process.env.NUXT_DEV === 'true'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    'nitro-cloudflare-dev',
    '@nuxt/eslint',
    '@nuxt/ui',
    'nuxt-auth-utils',
    // only enable @nuxt/fonts in non-development (remote/prod) builds
    ...(isDev ? [] : ['@nuxt/fonts']),
  ],
  // include main.css always; include a local dev-only font CSS only in development
  css: [
    '~/assets/css/main.css',
    ...(isDev ? ['~/assets/css/dev-fonts.css'] : ["~/assets/css/production-fonts.css"]),
  ],
  runtimeConfig: {
    sendCodeURL: '',
    session: {
      password: '',
      maxAge: 30 * 24 * 60 * 60,
    }
  },
  colorMode: {
    preference: 'dark',
  },
  experimental: {
    asyncContext: true,
  },
  devServer: {
    port: 24598,
  },
  vite: {
    server: {
      allowedHosts: true,
    },
  },
  ui: {
    fonts: false
  }
})