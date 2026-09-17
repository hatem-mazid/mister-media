<script setup lang="ts">
defineProps<{
  title: string
  intro: string
  topics: string[]
}>()
</script>

<template>
  <section class="mx-auto max-w-360 px-4 pt-32 pb-24 sm:px-6 md:px-8 md:pt-40 md:pb-32">
    <h1 class="max-w-3xl font-title text-[clamp(2rem,5vw,4rem)] leading-[0.95] font-semibold tracking-tight text-main">
      {{ title }}
    </h1>
    <p class="mt-6 max-w-2xl font-paragraph text-base leading-relaxed text-main/80 md:text-lg">
      {{ intro }}
    </p>
    <ul class="mt-10 max-w-2xl list-disc space-y-3 ps-5 font-paragraph text-base leading-relaxed text-main md:text-lg">
      <li
        v-for="topic in topics"
        :key="topic"
      >
        {{ topic }}
      </li>
    </ul>
  </section>
</template>
