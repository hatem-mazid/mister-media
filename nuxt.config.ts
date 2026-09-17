import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxtjs/i18n',
    'lenis/nuxt',
  ],

  css: [
    '~/assets/css/main.css',
    'lenis/dist/lenis.css',
  ],

  runtimeConfig: {
    public: {
      whatsappUrl: 'https://wa.me/',
      instagramUrl: 'https://www.instagram.com/',
      behanceUrl: 'https://www.behance.net/Fouad-Mazid',
      facebookUrl: 'https://www.facebook.com/',
      youtubeUrl: 'https://www.youtube.com/',
    },
  },

  vite: {
    plugins: [tailwindcss()],
  },

  fonts: {
    defaults: {
      weights: [400, 700],
      styles: ['normal'],
      subsets: ['latin', 'latin-ext', 'arabic'],
    },
    families: [
      { name: 'Almarai', provider: 'google', weights: [300, 400, 700, 800], subsets: ['arabic', 'latin'], global: true },
      { name: 'Caveat', provider: 'google', weights: [400, 500, 600, 700], global: true },
      { name: 'Exo', provider: 'google', weights: [400, 500, 600, 700], global: true },
      { name: 'Eurostile', provider: 'none' },
      { name: 'Shekari', provider: 'none' },
    ],
  },

  image: {
    domains: ['picsum.photos', 'fastly.picsum.photos', 'mir-s3-cdn-cf.behance.net'],
  },

  i18n: {
    strategy: 'prefix',
    defaultLocale: 'en',
    langDir: 'locales',
    locales: [
      {
        code: 'en',
        language: 'en',
        name: 'English',
        dir: 'ltr',
        file: 'en.json',
      },
      {
        code: 'ar',
        language: 'ar',
        name: 'العربية',
        dir: 'rtl',
        file: 'ar.json',
      },
    ],
  },
})
