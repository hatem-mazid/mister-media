<script setup lang="ts">
const route = useRoute()
const { t } = useI18n()
const { getBySlug, neighbors } = useServices()

const slug = computed(() => {
  const value = route.params.slug
  return String(Array.isArray(value) ? value[0] : value || '')
})

const service = computed(() => getBySlug(slug.value))
const around = computed(() => neighbors(slug.value))

watch(slug, () => {
  if (!service.value) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Not Found',
      fatal: true,
    })
  }
}, { immediate: true })

useSeoMeta({
  title: () => service.value
    ? t('seo.serviceTitle', { name: service.value.name })
    : t('seo.servicesTitle'),
  description: () => service.value
    ? t('seo.serviceDescription', { name: service.value.name })
    : t('seo.servicesDescription'),
  ogTitle: () => service.value
    ? t('seo.serviceTitle', { name: service.value.name })
    : t('seo.servicesTitle'),
  ogDescription: () => service.value
    ? t('seo.serviceDescription', { name: service.value.name })
    : t('seo.servicesDescription'),
})
</script>

<template>
  <main v-if="service">
    <SectionsServiceDetailSection
      :key="service.slug"
      :service="service"
      :previous="around.previous"
      :next="around.next"
    />
    <SectionsContactSection />
  </main>
</template>
