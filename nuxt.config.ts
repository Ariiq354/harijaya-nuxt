export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  future: {
    compatibilityVersion: 4,
  },
  modules: [
    "@nuxt/ui",
    "nuxt-security",
    "@nuxt/fonts",
    "@nuxt/eslint",
    "@nuxt/image",
  ],

  runtimeConfig: {
    databaseUrl: process.env.DATABASE_URL,
    databaseAuthToken: process.env.DATABASE_AUTH_TOKEN,
  },

  ignorePrefix: "_",
});