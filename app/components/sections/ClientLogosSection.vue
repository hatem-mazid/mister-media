<script setup lang="ts">
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { clients } from '~/data/clients'

const { t } = useI18n()
const sectionRef = useTemplateRef<HTMLElement>('sectionRef')

const reverseClients = [...clients.slice(3), ...clients.slice(0, 3)]

const logoClass = 'mx-6 h-8 w-auto max-w-none shrink-0 object-contain sm:h-10 md:mx-10 md:h-12'

let ctx: gsap.Context | undefined

onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  gsap.registerPlugin(ScrollTrigger)

  const section = sectionRef.value
  if (!section) return

  ctx = gsap.context(() => {
    gsap.from('[data-clients-animate]', {
      y: 40,
      autoAlpha: 0,
      duration: 0.5,
      ease: 'power3.out',
      stagger: 0.08,
      scrollTrigger: {
        trigger: section,
        start: 'top 82%',
        once: true,
      },
    })
  }, section)
})

onBeforeUnmount(() => {
  ctx?.revert()
})
</script>

<template>
  <section
    ref="sectionRef"
    aria-labelledby="client-logos-heading"
    class="overflow-hidden bg-lightest-bg pt-8 pb-24 md:pt-12 md:pb-32"
  >
    <div class="mx-auto max-w-360 px-4 sm:px-6 md:px-8">
      <UiSectionHeading
        id="client-logos-heading"
        class="mb-12 scroll-mt-28 md:mb-16"
        :title="t('clients.heading')"
        :handwritten="t('clients.headingAccent')"
        data-clients-animate
      />
    </div>

    <div
      dir="ltr"
      class="flex w-full flex-col gap-8 sm:gap-10 md:gap-12"
      aria-hidden="true"
    >
      <div data-clients-animate>
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
      </div>
      <div data-clients-animate>
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
    </div>
  </section>
</template>
