<script setup lang="ts">
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const { t } = useI18n()

const sectionRef = useTemplateRef<HTMLElement>('sectionRef')

const steps = [
  { key: 'idea', icon: 'lucide:lightbulb' },
  { key: 'design', icon: 'lucide:pen-tool' },
  { key: 'production', icon: 'lucide:printer' },
  { key: 'launch', icon: 'lucide:rocket' },
] as const

let ctx: gsap.Context | undefined

onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  gsap.registerPlugin(ScrollTrigger)

  const section = sectionRef.value
  if (!section) return

  ctx = gsap.context(() => {
    gsap.from('[data-process-animate]', {
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
    id="process"
    aria-labelledby="process-heading"
    class="scroll-mt-28 bg-lightest-bg px-4 py-12 sm:px-6 md:px-8 md:py-16"
  >
    <div class="mx-auto max-w-360">
      <div
        class="mb-8 flex flex-col items-start gap-6 md:mb-12 md:flex-row md:items-end md:justify-between md:gap-12"
        data-process-animate
      >
        <UiSectionHeading
          id="process-heading"
          class="self-start"
          :title="t('about.process.heading')"
          :handwritten="t('about.process.headingAccent')"
        />
        <p class="max-w-md font-paragraph text-base text-light-text md:pb-1 md:text-lg">
          {{ t('about.process.intro') }}
        </p>
      </div>

      <ol class="grid gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4">
        <li
          v-for="(step, index) in steps"
          :key="step.key"
          class="group relative flex flex-col gap-8 overflow-hidden rounded-3xl bg-lightest-bg p-6 ring-1 ring-main/10 transition-colors hover:bg-light-bg md:p-8"
          data-process-animate
        >
          <div class="flex items-start justify-between gap-4">
            <span
              class="flex size-12 items-center justify-center rounded-full bg-primary text-main transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110 motion-reduce:transition-none"
              aria-hidden="true"
            >
              <Icon
                :name="step.icon"
                class="size-5"
              />
            </span>
            <span
              class="font-title text-5xl leading-none font-light text-transparent tabular-nums [-webkit-text-stroke:1px_var(--color-light-text)] md:text-6xl"
              aria-hidden="true"
            >
              {{ String(index + 1).padStart(2, '0') }}
            </span>
          </div>
          <div class="flex flex-col gap-2">
            <h3 class="font-title text-xl font-semibold text-main md:text-2xl">
              <span class="sr-only">{{ index + 1 }}. </span>{{ t(`about.process.steps.${step.key}.title`) }}
            </h3>
            <p class="font-paragraph text-sm leading-relaxed text-main/70 md:text-base">
              {{ t(`about.process.steps.${step.key}.text`) }}
            </p>
          </div>
        </li>
      </ol>
    </div>
  </section>
</template>
