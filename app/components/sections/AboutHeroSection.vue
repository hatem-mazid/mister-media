<script setup lang="ts">
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const { t } = useI18n()
const localePath = useLocalePath()
const config = useRuntimeConfig()

const whatsappUrl = computed(() =>
  String(config.public.whatsappUrl || 'https://wa.me/'),
)

const sectionRef = useTemplateRef<HTMLElement>('sectionRef')
const mediaRef = useTemplateRef<HTMLElement>('mediaRef')
const imageRef = useTemplateRef<HTMLElement>('imageRef')

// Placeholder until the client supplies studio / office photography.
const studioImage = 'https://picsum.photos/seed/mm-studio/1920/820'

const facts = ['years', 'clients', 'services'] as const

// Almarai ink rises above its line box; Chrome culls it on a wrapped row unless the
// span paints a box, so connector words get a same-color background.
const connectorClass = 'bg-lightest-bg font-normal text-light-text'

let ctx: gsap.Context | undefined

onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  gsap.registerPlugin(ScrollTrigger)

  const section = sectionRef.value
  const media = mediaRef.value
  const image = imageRef.value
  if (!section) return

  ctx = gsap.context(() => {
    gsap.from('[data-about-animate]', {
      y: 40,
      autoAlpha: 0,
      duration: 0.6,
      ease: 'power3.out',
      stagger: 0.08,
      delay: 0.1,
    })

    if (media && image) {
      gsap.fromTo(image, { yPercent: -8 }, {
        yPercent: 8,
        ease: 'none',
        scrollTrigger: {
          trigger: media,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.5,
        },
      })
    }
  }, section)
})

onBeforeUnmount(() => {
  ctx?.revert()
})
</script>

<template>
  <section
    ref="sectionRef"
    aria-labelledby="about-heading"
    class="bg-lightest-bg px-4 pt-32 pb-12 sm:px-6 md:px-8 md:pt-40 md:pb-16"
  >
    <div class="mx-auto max-w-360">
      <div class="grid gap-10 lg:grid-cols-12 lg:gap-8">
        <div class="lg:col-span-8">
          <p
            class="font-paragraph text-sm text-light-text md:text-base"
            data-about-animate
          >
            {{ t('about.eyebrow') }}
          </p>
          <h1
            id="about-heading"
            class="mt-4 flex flex-col gap-y-1 font-title text-[clamp(2.25rem,5.8vw,5.5rem)] leading-[0.95] font-semibold tracking-tight text-main md:gap-y-2 rtl:leading-[1.2] rtl:tracking-normal"
          >
            <span
              class="flex flex-wrap items-baseline gap-x-3 md:gap-x-5"
              data-about-animate
            >
              <span :class="connectorClass">{{ t('about.headline.artists') }}</span>
              <span class="font-handwritten font-normal text-primary">{{ t('about.headline.graphic') }}</span>
            </span>
            <span
              class="flex flex-wrap items-baseline gap-x-3 md:gap-x-5"
              data-about-animate
            >
              <span :class="connectorClass">{{ t('about.headline.experts') }}</span>
              <span class="text-primary">{{ t('about.headline.printing') }}</span>
            </span>
            <span
              class="flex flex-wrap items-baseline gap-x-3 md:gap-x-5"
              data-about-animate
            >
              <span :class="connectorClass">{{ t('about.headline.specialized') }}</span>
              <span>{{ t('about.headline.marketing') }}</span>
            </span>
          </h1>
        </div>

        <div
          class="flex flex-col gap-6 lg:col-span-4 lg:self-end lg:pb-2"
          data-about-animate
        >
          <p class="max-w-md font-paragraph text-base leading-relaxed text-main md:text-lg">
            {{ t('about.intro') }}
          </p>
          <div class="flex flex-wrap items-center gap-3">
            <UiButton :to="localePath('/projects')">
              {{ t('hero.ourWorks') }}
            </UiButton>
            <UiButton
              :to="whatsappUrl"
              variant="secondary"
              external
            >
              {{ t('hero.contactUs') }}
            </UiButton>
          </div>
        </div>
      </div>

      <div
        ref="mediaRef"
        class="mt-12 overflow-hidden rounded-3xl bg-light-bg md:mt-16 md:rounded-[2.5rem]"
        data-about-animate
      >
        <div class="aspect-4/3 sm:aspect-video lg:aspect-21/9">
          <NuxtImg
            ref="imageRef"
            :src="studioImage"
            :alt="t('about.studioAlt')"
            width="1920"
            height="820"
            sizes="100vw md:1440px"
            class="size-full scale-[1.18] object-cover will-change-transform"
          />
        </div>
      </div>

      <ul class="mt-4 grid gap-4 sm:grid-cols-3 md:mt-6 md:gap-6">
        <li
          v-for="fact in facts"
          :key="fact"
          class="flex flex-col gap-6 rounded-3xl bg-light-bg px-6 py-6 md:px-8 md:py-8"
          data-about-animate
        >
          <p
            class="relative inline-block self-start pb-[0.15em] font-title text-[clamp(3rem,6vw,5rem)] font-semibold leading-none tracking-tight text-main"
            :aria-label="`${t(`about.facts.${fact}.value`)} ${t(`about.facts.${fact}.accent`)}`"
          >
            <span aria-hidden="true">{{ t(`about.facts.${fact}.value`) }}</span>
            <span
              class="pointer-events-none absolute inset-e-0 bottom-0 origin-bottom translate-y-[45%] -rotate-3 font-handwritten text-[0.38em] font-normal leading-none text-primary rtl:rotate-3"
              aria-hidden="true"
            >
              {{ t(`about.facts.${fact}.accent`) }}
            </span>
          </p>
          <p class="font-paragraph text-sm text-main/70 md:text-base">
            {{ t(`about.facts.${fact}.label`) }}
          </p>
        </li>
      </ul>
    </div>
  </section>
</template>
