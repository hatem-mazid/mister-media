<script setup lang="ts">
const route = useRoute()
const { t } = useI18n()
const { getBySlug, neighbors } = useProjects()

const slug = computed(() => {
  const value = route.params.slug
  return String(Array.isArray(value) ? value[0] : value || '')
})

const project = computed(() => getBySlug(slug.value))
const around = computed(() => neighbors(slug.value))

watch(slug, () => {
  if (!project.value) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Not Found',
      fatal: true,
    })
  }
}, { immediate: true })

useSeoMeta({
  title: () => project.value
    ? t('seo.projectTitle', { name: project.value.name })
    : t('seo.projectsTitle'),
  description: () => project.value?.description
    || (project.value
      ? t('seo.projectDescription', { name: project.value.name })
      : t('seo.projectsDescription')),
  ogTitle: () => project.value
    ? t('seo.projectTitle', { name: project.value.name })
    : t('seo.projectsTitle'),
  ogDescription: () => project.value?.description
    || (project.value
      ? t('seo.projectDescription', { name: project.value.name })
      : t('seo.projectsDescription')),
  ogImage: () => project.value?.cover,
})
</script>

<template>
  <main v-if="project">
    <SectionsProjectDetailSection
      :key="project.slug"
      :project="project"
      :previous="around.previous"
      :next="around.next"
    />
    <SectionsContactSection />
  </main>
</template>
