<script setup lang="ts">
const { t } = useI18n()

const topics = computed(() => [
  t('legal.terms.topics.usage'),
  t('legal.terms.topics.ip'),
  t('legal.terms.topics.portfolio'),
  t('legal.terms.topics.ownership'),
  t('legal.terms.topics.thirdParty'),
  t('legal.terms.topics.availability'),
  t('legal.terms.topics.liability'),
])

useSeoMeta({
  title: () => t('legal.terms.title'),
  description: () => t('legal.terms.description'),
  ogTitle: () => t('legal.terms.title'),
  ogDescription: () => t('legal.terms.description'),
})
</script>

<template>
  <main>
    <SectionsLegalDocumentSection
      :title="t('legal.terms.heading')"
      :intro="t('legal.pending')"
      :topics="topics"
    />
  </main>
</template>
