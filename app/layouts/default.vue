<script setup lang="ts">
const { localeProperties } = useI18n()

useHead({
  htmlAttrs: {
    lang: () => localeProperties.value.language ?? localeProperties.value.code,
    dir: () => localeProperties.value.dir ?? 'ltr',
  },
})
</script>

<template>
  <div class="min-h-dvh overflow-x-clip bg-main font-paragraph text-main">
    <NavigationSiteHeader />
    <div class="relative z-10 bg-lightest-bg">
      <slot />
    </div>
    <NavigationSiteFooter />
  </div>
</template>
