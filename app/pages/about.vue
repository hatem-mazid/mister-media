<script setup lang="ts">
const { t } = useI18n()

useSeoMeta({
  title: () => t('seo.aboutTitle'),
  description: () => t('seo.aboutDescription'),
  ogTitle: () => t('seo.aboutTitle'),
  ogDescription: () => t('seo.aboutDescription'),
})
</script>

<template>
  <main>
    <SectionsAboutHeroSection />
    <SectionsAboutProcessSection />
    <SectionsWorldCoverageSection />
  </main>
</template>
