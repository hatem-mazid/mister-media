<script setup lang="ts">
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const { t } = useI18n()
const localePath = useLocalePath()
const { featured } = useProjects()

const sectionRef = useTemplateRef<HTMLElement>('sectionRef')

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

      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">
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
          :eager="index < 3"
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
