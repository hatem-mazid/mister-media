<script setup lang="ts">
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const { t } = useI18n()
const localePath = useLocalePath()

const sectionRef = useTemplateRef<HTMLElement>('sectionRef')

// Same placeholder as the About hero until studio photography is supplied.
const studioImage = 'https://picsum.photos/seed/mm-studio/1200/1500'

const facts = [
  { key: 'years', icon: 'lucide:calendar-check' },
  { key: 'clients', icon: 'lucide:users' },
  { key: 'hq', icon: 'lucide:map-pin' },
] as const

let ctx: gsap.Context | undefined

onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  gsap.registerPlugin(ScrollTrigger)

  const section = sectionRef.value
  if (!section) return

  ctx = gsap.context(() => {
    gsap.from('[data-about-teaser-animate]', {
      y: 40,
      autoAlpha: 0,
      duration: 0.5,
      ease: 'power3.out',
      stagger: 0.08,
      scrollTrigger: {
        trigger: section,
        start: 'top 78%',
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
    id="about"
    aria-labelledby="about-teaser-heading"
    class="scroll-mt-28 bg-light-bg px-4 py-16 sm:px-6 md:px-8 md:py-24"
  >
    <div class="mx-auto grid max-w-360 items-center gap-10 lg:grid-cols-12 lg:gap-8">
      <div class="flex flex-col items-start gap-8 lg:col-span-7">
        <UiSectionHeading
          id="about-teaser-heading"
          :title="t('aboutTeaser.heading')"
          :handwritten="t('aboutTeaser.headingAccent')"
          data-about-teaser-animate
        />

        <p
          class="max-w-2xl font-paragraph text-base leading-relaxed text-main md:text-lg"
          data-about-teaser-animate
        >
          {{ t('about.intro') }}
        </p>

        <ul
          class="flex flex-wrap gap-2"
          data-about-teaser-animate
        >
          <li
            v-for="fact in facts"
            :key="fact.key"
            class="inline-flex items-center gap-2 rounded-full bg-lightest-bg px-4 py-2 font-paragraph text-sm text-main"
          >
            <Icon
              :name="fact.icon"
              class="size-4 text-primary"
              aria-hidden="true"
            />
            {{ t(`aboutTeaser.facts.${fact.key}`) }}
          </li>
        </ul>

        <div data-about-teaser-animate>
          <UiButton :to="localePath('/about')">
            {{ t('aboutTeaser.cta') }}
          </UiButton>
        </div>
      </div>

      <NuxtLink
        :to="localePath('/about')"
        :aria-label="t('aboutTeaser.cta')"
        class="group relative block overflow-hidden rounded-3xl bg-lightest-bg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary lg:col-span-5 md:rounded-[2.5rem]"
        data-about-teaser-animate
      >
        <div class="aspect-video lg:aspect-4/3">
          <NuxtImg
            :src="studioImage"
            :alt="t('about.studioAlt')"
            width="1200"
            height="1500"
            sizes="100vw md:720px"
            loading="lazy"
            class="size-full object-cover transition-transform duration-500 ease-out group-hover:scale-105 motion-reduce:transition-none"
          />
        </div>
        <span
          class="absolute inset-e-4 bottom-4 flex size-12 items-center justify-center rounded-full bg-primary text-main transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6 motion-reduce:transition-none md:inset-e-6 md:bottom-6"
          aria-hidden="true"
        >
          <Icon
            name="lucide:arrow-up-right"
            class="size-5 rtl:-scale-x-100"
          />
        </span>
      </NuxtLink>
    </div>
  </section>
</template>
