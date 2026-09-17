<script setup lang="ts">
const { t } = useI18n()

useSeoMeta({
  title: () => t('seo.projectsTitle'),
  description: () => t('seo.projectsDescription'),
  ogTitle: () => t('seo.projectsTitle'),
  ogDescription: () => t('seo.projectsDescription'),
})
</script>

<template>
  <main>
    <SectionsProjectsHeroSection />
    <SectionsProjectsGallerySection />
    <SectionsContactSection />
  </main>
</template>
