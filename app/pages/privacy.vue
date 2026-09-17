<script setup lang="ts">
const { t } = useI18n()

const topics = computed(() => [
  t('legal.privacy.topics.contact'),
  t('legal.privacy.topics.forms'),
  t('legal.privacy.topics.analytics'),
  t('legal.privacy.topics.cookies'),
  t('legal.privacy.topics.embeds'),
  t('legal.privacy.topics.marketing'),
  t('legal.privacy.topics.rights'),
])

useSeoMeta({
  title: () => t('legal.privacy.title'),
  description: () => t('legal.privacy.description'),
  ogTitle: () => t('legal.privacy.title'),
  ogDescription: () => t('legal.privacy.description'),
})
</script>

<template>
  <main>
    <SectionsLegalDocumentSection
      :title="t('legal.privacy.heading')"
      :intro="t('legal.pending')"
      :topics="topics"
    />
  </main>
</template>
