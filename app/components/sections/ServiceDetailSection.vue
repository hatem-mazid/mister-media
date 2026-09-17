<script setup lang="ts">
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const props = defineProps<{
  service: {
    slug: string
    name: string
    summary: string
    icon: string
    color: string
    index: number
    workTo: string
  }
  previous?: {
    name: string
    to: string
  }
  next?: {
    name: string
    to: string
  }
}>()

const { t } = useI18n()
const localePath = useLocalePath()
const { projects } = useProjects()

const sectionRef = useTemplateRef<HTMLElement>('sectionRef')

const related = computed(() =>
  projects.value.filter(project => project.service === props.service.slug),
)

let ctx: gsap.Context | undefined

onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  gsap.registerPlugin(ScrollTrigger)

  const section = sectionRef.value
  if (!section) return

  ctx = gsap.context(() => {
    gsap.from('[data-service-detail-animate]', {
      y: 40,
      autoAlpha: 0,
      duration: 0.55,
      ease: 'power3.out',
      stagger: 0.06,
      delay: 0.05,
    })
  }, section)
})

onBeforeUnmount(() => {
  ctx?.revert()
})
</script>

<template>
  <article
    ref="sectionRef"
    class="bg-lightest-bg px-4 pt-32 pb-12 sm:px-6 md:px-8 md:pt-40 md:pb-16"
  >
    <div class="mx-auto max-w-360">
      <div
        class="flex flex-wrap items-center gap-4"
        data-service-detail-animate
      >
        <span
          class="font-title text-5xl leading-none font-light text-transparent tabular-nums [-webkit-text-stroke:1px_var(--color-light-text)] md:text-7xl"
          aria-hidden="true"
        >
          {{ String(service.index).padStart(2, '0') }}
        </span>
        <span
          class="flex size-12 items-center justify-center rounded-full text-lightest-bg md:size-14"
          :style="{ backgroundColor: service.color }"
          aria-hidden="true"
        >
          <Icon
            :name="service.icon"
            class="size-5 md:size-6"
          />
        </span>
      </div>

      <h1
        class="mt-6 max-w-4xl font-title text-[clamp(2.25rem,5.8vw,5.5rem)] leading-[0.95] font-semibold tracking-tight text-main rtl:leading-[1.2] rtl:tracking-normal"
        data-service-detail-animate
      >
        {{ service.name }}
      </h1>

      <p
        class="mt-8 max-w-2xl font-paragraph text-base leading-relaxed text-main md:text-lg"
        data-service-detail-animate
      >
        {{ service.summary }}
      </p>

      <div
        class="mt-8 flex flex-wrap items-center gap-3"
        data-service-detail-animate
      >
        <UiButton
          v-if="related.length"
          :to="service.workTo"
        >
          {{ t('servicesPage.viewWork') }}
        </UiButton>
        <UiButton
          :to="localePath('/services')"
          :variant="related.length ? 'secondary' : 'primary'"
        >
          {{ t('servicesPage.allServices') }}
        </UiButton>
      </div>

      <section
        class="mt-16 md:mt-20"
        :aria-labelledby="related.length ? 'related-work-heading' : undefined"
      >
        <h2
          v-if="related.length"
          id="related-work-heading"
          class="mb-8 font-title text-xl font-semibold text-main md:mb-10 md:text-2xl"
          data-service-detail-animate
        >
          {{ t('servicesPage.related') }}
        </h2>

        <div
          v-if="related.length"
          class="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6"
        >
          <UiProjectTile
            v-for="(project, index) in related"
            :key="project.slug"
            :to="project.to"
            :name="project.name"
            :category="project.serviceName"
            :category-icon="project.serviceIcon"
            :category-color="project.serviceColor"
            :cover="project.cover"
            :width="project.width"
            :height="project.height"
            :motion-src="project.motionSrc"
            :eager="index < 3"
            data-service-detail-animate
          />
        </div>

        <p
          v-else
          class="rounded-3xl bg-light-bg px-6 py-16 text-center font-paragraph text-base text-main/70 md:px-8 md:py-24 md:text-lg"
          data-service-detail-animate
        >
          {{ t('servicesPage.emptyWork') }}
        </p>
      </section>

      <nav
        v-if="previous || next"
        class="mt-16 grid gap-6 border-t border-main/10 pt-8 md:mt-20 md:grid-cols-2 md:gap-8 md:pt-10"
        :aria-label="`${t('servicesPage.previous')}, ${t('servicesPage.next')}`"
      >
        <NuxtLink
          v-if="previous"
          :to="previous.to"
          class="group min-w-0 rounded-3xl p-1 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
        >
          <p class="font-paragraph text-sm text-light-text md:text-base">
            {{ t('servicesPage.previous') }}
          </p>
          <p class="mt-2 font-title text-xl font-semibold text-main transition-colors group-hover:text-primary md:text-2xl">
            {{ previous.name }}
          </p>
        </NuxtLink>
        <span
          v-else
          aria-hidden="true"
        />

        <NuxtLink
          v-if="next"
          :to="next.to"
          class="group min-w-0 rounded-3xl p-1 text-end focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
        >
          <p class="font-paragraph text-sm text-light-text md:text-base">
            {{ t('servicesPage.next') }}
          </p>
          <p class="mt-2 font-title text-xl font-semibold text-main transition-colors group-hover:text-primary md:text-2xl">
            {{ next.name }}
          </p>
        </NuxtLink>
      </nav>
    </div>
  </article>
</template>
