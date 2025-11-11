// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    'nitro-cloudflare-dev',
    '@nuxt/eslint',
    '@nuxt/ui',
    'nuxt-auth-utils',
  ],
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    sendCodeURL: '',
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
})
