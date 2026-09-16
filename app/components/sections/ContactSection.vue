<script setup lang="ts">
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const { t } = useI18n()
const config = useRuntimeConfig()

const whatsappUrl = computed(() =>
  String(config.public.whatsappUrl || 'https://wa.me/'),
)

const sectionRef = useTemplateRef<HTMLElement>('sectionRef')

const tickerKeys = ['talk', 'whatsapp', 'hq', 'promise'] as const

const letsTalkParts = computed(() => {
  const text = t('nav.letsTalk')
  const index = text.indexOf("'")
  if (index === -1) return [{ value: text, accent: false }]

  return [
    { value: text.slice(0, index), accent: false },
    { value: "'", accent: true },
    { value: text.slice(index + 1), accent: false },
  ]
})

let ctx: gsap.Context | undefined

onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  gsap.registerPlugin(ScrollTrigger)

  const section = sectionRef.value
  if (!section) return

  ctx = gsap.context(() => {
    gsap.from('[data-contact-animate]', {
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
    id="contact"
    aria-labelledby="contact-heading"
    class="relative scroll-mt-28 overflow-hidden bg-primary"
  >
    <div
      class="pointer-events-none absolute -inset-s-24 -bottom-32 size-80 rounded-full bg-main/10 md:size-96"
      aria-hidden="true"
    />
    <div
      class="pointer-events-none absolute -inset-e-16 -top-20 size-64 rounded-full bg-lightest-bg/20 md:size-96"
      aria-hidden="true"
    />

    <div class="relative mx-auto flex max-w-360 flex-col items-center px-4 pt-24 pb-12 text-center sm:px-6 md:px-8 md:pt-32 md:pb-16">
      <h2
        id="contact-heading"
        class="relative inline-block max-w-full pb-[0.12em] font-title text-[clamp(2.5rem,6.5vw,5.5rem)] leading-[0.95] font-semibold tracking-tight text-lightest-bg"
        :aria-label="`${t('contact.headline')} ${t('contact.headingAccent')}`"
        data-contact-animate
      >
        <span>{{ t('contact.headline') }}</span>
        <span
          class="pointer-events-none absolute inset-e-0 bottom-0 origin-bottom translate-y-[42%] -rotate-3 font-handwritten text-[0.42em] font-normal leading-none text-main rtl:rotate-3"
          aria-hidden="true"
        >
          {{ t('contact.headingAccent') }}
        </span>
      </h2>

      <div
        class="mt-12 md:mt-16"
        data-contact-animate
      >
        <UiButton
          :to="whatsappUrl"
          outline="main"
          external
        >
          <span
            v-for="(part, index) in letsTalkParts"
            :key="index"
            :class="part.accent && 'text-primary'"
          >{{ part.value }}</span>
        </UiButton>
      </div>
    </div>

    <div
      class="relative border-t border-main/15 py-5 md:py-6"
      data-contact-animate
    >
      <UiMarquee
        class="font-title text-sm font-semibold tracking-wide text-main uppercase md:text-base"
        :duration="36"
        decorative
      >
        <span
          v-for="(key, index) in tickerKeys"
          :key="key"
          class="contents"
        >
          <span class="whitespace-nowrap">{{ t(`contact.ticker.${key}`) }}</span>
          <span
            v-if="index < tickerKeys.length - 1"
            class="mx-[0.5em]"
          >●</span>
        </span>
      </UiMarquee>
    </div>
  </section>
</template>
