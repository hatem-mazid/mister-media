<script setup lang="ts">
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { ProjectSpan } from '~/data/projects'

const { t } = useI18n()
const localePath = useLocalePath()
const { featured } = useProjects()

const sectionRef = useTemplateRef<HTMLElement>('sectionRef')

const spanClass: Record<ProjectSpan, string> = {
  hero: 'row-span-2 sm:col-span-2 md:col-span-4 lg:col-span-7',
  landscape: 'sm:col-span-1 md:col-span-2 lg:col-span-5',
  third: 'sm:col-span-1 md:col-span-2 lg:col-span-4',
  tall: 'row-span-2 sm:col-span-1 md:col-span-2 lg:col-span-5',
  wide: 'sm:col-span-1 sm:row-span-2 md:col-span-4 md:row-span-1 lg:col-span-7 lg:row-span-1',
  splitWide: 'sm:col-span-1 md:col-span-2 lg:col-span-4',
  splitNarrow: 'sm:col-span-1 md:col-span-2 lg:col-span-3',
  half: 'sm:col-span-1 md:col-span-3 lg:col-span-6',
  band: 'sm:col-span-2 md:col-span-3 lg:col-span-6',
}

const spanSizes: Record<ProjectSpan, string> = {
  hero: 'sm:100vw lg:60vw',
  landscape: 'sm:50vw lg:42vw',
  third: 'sm:50vw lg:33vw',
  tall: 'sm:50vw lg:42vw',
  wide: 'sm:100vw md:66vw lg:58vw',
  splitWide: 'sm:50vw lg:33vw',
  splitNarrow: 'sm:50vw lg:25vw',
  half: 'sm:50vw lg:50vw',
  band: 'sm:100vw lg:50vw',
}

let ctx: gsap.Context | undefined

onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  gsap.registerPlugin(ScrollTrigger)

  const section = sectionRef.value
  if (!section) return

  ctx = gsap.context(() => {
    gsap.from('[data-projects-animate]', {
      y: 40,
      autoAlpha: 0,
      duration: 0.5,
      ease: 'power3.out',
      stagger: 0.05,
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
    id="selected-work"
    aria-labelledby="featured-projects-heading"
    class="scroll-mt-28 bg-lightest-bg px-4 pt-12 pb-12 sm:px-6 md:px-8 md:pt-16 md:pb-16"
  >
    <div class="mx-auto max-w-360">
      <UiSectionHeading
        id="featured-projects-heading"
        class="mb-8 scroll-mt-28 md:mb-12"
        :title="t('projects.heading')"
        :handwritten="t('projects.headingAccent')"
        data-projects-animate
      />

      <div
        class="grid grid-cols-1 auto-rows-64 gap-4 sm:grid-cols-2 sm:auto-rows-56 md:grid-cols-6 md:auto-rows-52 md:gap-5 lg:grid-cols-12 lg:auto-rows-60 lg:gap-6 xl:auto-rows-68"
      >
        <UiProjectTile
          v-for="(project, index) in featured"
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
          :sizes="spanSizes[project.span]"
          :eager="index === 0"
          :class="spanClass[project.span]"
          data-projects-animate
        />
      </div>

      <div
        class="mt-12 flex justify-center md:mt-16"
        data-projects-animate
      >
        <UiButton :to="localePath('/projects')">
          {{ t('projects.viewAll') }}
        </UiButton>
      </div>
    </div>
  </section>
</template>
