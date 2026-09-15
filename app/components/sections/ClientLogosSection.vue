<script setup lang="ts">
import { clients } from '~/data/clients'

const { t } = useI18n()

const reverseClients = [...clients.slice(3), ...clients.slice(0, 3)]

const logoClass = 'mx-6 h-8 w-auto max-w-none shrink-0 object-contain sm:h-10 md:mx-10 md:h-12'
</script>

<template>
  <section
    aria-labelledby="client-logos-heading"
    class="overflow-hidden bg-lightest-bg pt-8 pb-24 md:pt-12 md:pb-32"
  >
    <div class="mx-auto max-w-360 px-4 sm:px-6 md:px-8">
      <UiSectionHeading
        id="client-logos-heading"
        class="mb-12 scroll-mt-28 md:mb-16"
        :title="t('clients.heading')"
        :handwritten="t('clients.headingAccent')"
      />
    </div>

    <div
      dir="ltr"
      class="flex w-full flex-col gap-8 sm:gap-10 md:gap-12"
      aria-hidden="true"
    >
      <UiMarquee
        class="min-h-8 w-full sm:min-h-10 md:min-h-12"
        :duration="40"
        separator=""
        decorative
      >
        <img
          v-for="logo in clients"
          :key="logo.slug"
          :src="logo.src"
          alt=""
          :width="logo.width"
          :height="logo.height"
          :class="logoClass"
        >
      </UiMarquee>
      <UiMarquee
        class="min-h-8 w-full sm:min-h-10 md:min-h-12"
        :duration="40"
        reverse
        separator=""
        decorative
      >
        <img
          v-for="logo in reverseClients"
          :key="logo.slug"
          :src="logo.src"
          alt=""
          :width="logo.width"
          :height="logo.height"
          :class="logoClass"
        >
      </UiMarquee>
    </div>
  </section>
</template>
