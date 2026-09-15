<script setup lang="ts">
const { t } = useI18n()
const { services } = useServices()

const bands = [
  { key: 'dark', reverse: true, bandClass: 'z-10 rotate-10 bg-main' },
  { key: 'primary', reverse: false, bandClass: 'z-20 -rotate-10 bg-primary' },
] as const
</script>

<template>
  <section
    aria-labelledby="service-bands-heading"
    class="relative overflow-hidden bg-lightest-bg py-12 md:py-16 lg:py-20"
  >
    <h2 id="service-bands-heading" class="sr-only">
      {{ t('services.heading') }}
    </h2>
    <ul class="sr-only">
      <li v-for="service in services" :key="service.slug">
        {{ service.name }}
      </li>
    </ul>

    <div class="relative h-40 sm:h-52 md:h-64 lg:h-72">
      <div
        v-for="band in bands"
        :key="band.key"
        class="absolute top-1/2 left-1/2 w-[max(160vw,72rem)] -translate-x-1/2 -translate-y-1/2 overflow-hidden py-1 md:py-5"
        :class="band.bandClass"
        dir="ltr"
        aria-hidden="true"
      >
        <UiMarquee
          class="font-title text-lg font-semibold text-lightest-bg md:text-2xl"
          :duration="40"
          :reverse="band.reverse"
          decorative
        >
          <span
            v-for="(service, index) in services"
            :key="service.slug"
            class="contents"
          >
            <span class="whitespace-nowrap">{{ service.name }}</span>
            <span
              v-if="index < services.length - 1"
              class="mx-[0.5em]"
            >●</span>
          </span>
        </UiMarquee>
      </div>
    </div>
  </section>
</template>
