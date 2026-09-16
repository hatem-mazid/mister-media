<script setup lang="ts">
const { t } = useI18n()

useSeoMeta({
  title: () => t('seo.homeTitle'),
  description: () => t('seo.homeDescription'),
  ogTitle: () => t('seo.homeTitle'),
  ogDescription: () => t('seo.homeDescription'),
})
</script>

<template>
  <main>
    <SectionsHeroSection />
    <SectionsServiceBandsSection />
    <SectionsFeaturedProjectsSection />
    <SectionsClientLogosSection />

    <div class="h-screen bg-light-bg"></div>
    <SectionsTestimonialsSection />
  </main>
</template>
