<script setup lang="ts">
const { t } = useI18n()

useSeoMeta({
  title: () => t('seo.servicesTitle'),
  description: () => t('seo.servicesDescription'),
  ogTitle: () => t('seo.servicesTitle'),
  ogDescription: () => t('seo.servicesDescription'),
})
</script>

<template>
  <main>
    <SectionsServicesHeroSection />
    <SectionsServicesShowcaseSection />
    <SectionsContactSection />
  </main>
</template>
