import type { RouterConfig } from '@nuxt/schema'

export default {
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      return {
        el: to.hash,
        top: 0,
      }
    }

    // Query-only changes (in-page state such as the projects filter) must not scroll.
    if (to.path === from.path) {
      return false
    }

    if (savedPosition) {
      return savedPosition
    }

    return {
      top: 0,
      left: 0,
    }
  },
} satisfies RouterConfig
