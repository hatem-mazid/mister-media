<script setup lang="ts">
defineProps<{
  quote: string
  name: string
  role?: string
  photo: string
  photoWidth: number
  photoHeight: number
  index: number
  total: number
}>()
</script>

<template>
  <article class="flex h-full flex-col rounded-3xl bg-light-bg px-5 py-5 md:px-6 md:py-6 lg:px-8 lg:py-8">
    <div class="flex items-start justify-between gap-3">
      <span
        class="-mt-1 font-handwritten text-5xl leading-none text-primary md:text-6xl"
        aria-hidden="true"
      >“</span>
      <p
        class="font-title text-xs font-semibold tabular-nums tracking-wide text-light-text md:text-sm"
        aria-hidden="true"
      >
        {{ index }}/{{ total }}
      </p>
    </div>

    <blockquote class="mt-2 md:mt-3">
      <p class="font-paragraph text-base leading-relaxed text-main md:text-lg">
        {{ quote }}
      </p>
      <span
        class="mt-1 block text-end font-handwritten text-4xl leading-none text-primary md:text-5xl"
        aria-hidden="true"
      >”</span>
    </blockquote>

    <footer class="mt-5 flex items-center gap-3 md:mt-6">
      <NuxtImg
        :src="photo"
        :alt="name"
        :width="photoWidth"
        :height="photoHeight"
        sizes="48px"
        loading="lazy"
        class="size-10 shrink-0 rounded-full object-cover md:size-12"
      />
      <div class="min-w-0">
        <p class="font-title text-sm font-semibold text-main md:text-base">
          {{ name }}
        </p>
        <p
          v-if="role"
          class="mt-0.5 truncate font-paragraph text-xs text-light-text md:text-sm"
        >
          {{ role }}
        </p>
      </div>
    </footer>
  </article>
</template>
