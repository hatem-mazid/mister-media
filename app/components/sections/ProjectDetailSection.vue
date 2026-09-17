<script setup lang="ts">
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { ProjectModule } from '~/data/projects'

const props = defineProps<{
  project: {
    name: string
    cover: string
    width: number
    height: number
    serviceName: string
    serviceIcon: string
    serviceColor: string
    sourceUrl?: string
    description?: string
    publishedOn?: number
    modules?: readonly ProjectModule[]
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

const sectionRef = useTemplateRef<HTMLElement>('sectionRef')

const year = computed(() => {
  if (!props.project.publishedOn) return ''
  return String(new Date(props.project.publishedOn * 1000).getFullYear())
})

const modules = computed<ProjectModule[]>(() => {
  if (props.project.modules?.length) return [...props.project.modules]
  return [{
    type: 'image',
    src: props.project.cover,
    width: props.project.width,
    height: props.project.height,
    fullBleed: true,
  }]
})

function imageSizes(module: Extract<ProjectModule, { type: 'image' }>) {
  return module.fullBleed ? 'sm:100vw lg:90vw' : 'sm:100vw md:70vw lg:50vw'
}

function embedSrc(module: Extract<ProjectModule, { type: 'youtube' | 'vimeo' }>) {
  return module.type === 'youtube'
    ? `https://www.youtube-nocookie.com/embed/${module.id}`
    : `https://player.vimeo.com/video/${module.id}`
}

let ctx: gsap.Context | undefined

onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  gsap.registerPlugin(ScrollTrigger)

  const section = sectionRef.value
  if (!section) return

  ctx = gsap.context(() => {
    gsap.from('[data-detail-animate]', {
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
      <div class="max-w-3xl">
        <p
          class="font-paragraph text-sm text-light-text md:text-base"
          data-detail-animate
        >
          {{ t('projectDetail.eyebrow') }}
        </p>

        <h1
          class="mt-4 font-title text-[clamp(2.25rem,5.8vw,5.5rem)] leading-[0.95] font-semibold tracking-tight text-main rtl:leading-[1.2] rtl:tracking-normal"
          data-detail-animate
        >
          {{ project.name }}
        </h1>

        <div
          class="mt-6 flex flex-wrap items-center gap-3"
          data-detail-animate
        >
          <UiCategoryPill
            :label="project.serviceName"
            :icon="project.serviceIcon"
            :color="project.serviceColor"
          />
          <span
            v-if="year"
            class="font-paragraph text-sm text-light-text md:text-base"
          >
            {{ year }}
          </span>
        </div>

        <p
          v-if="project.description"
          class="mt-8 max-w-2xl whitespace-pre-line font-paragraph text-base leading-relaxed text-main md:text-lg"
          data-detail-animate
        >
          {{ project.description }}
        </p>

        <div
          class="mt-8 flex flex-wrap items-center gap-4"
          data-detail-animate
        >
          <UiButton
            :to="localePath('/projects')"
            variant="secondary"
          >
            {{ t('projectDetail.back') }}
          </UiButton>
          <UiButton
            v-if="project.sourceUrl"
            :to="project.sourceUrl"
            variant="text"
            external
          >
            {{ t('projectDetail.onBehance') }}
          </UiButton>
        </div>
      </div>

      <div
        class="mt-12 flex flex-col gap-6 md:mt-16 md:gap-8"
        :aria-label="t('projectDetail.gallery')"
      >
        <template
          v-for="(module, index) in modules"
          :key="`${module.type}-${index}`"
        >
          <figure
            v-if="module.type === 'image'"
            class="overflow-hidden rounded-3xl bg-light-bg"
            :class="module.fullBleed ? 'w-full' : 'mx-auto w-full'"
            :style="module.fullBleed ? undefined : { maxWidth: `${module.width}px` }"
            data-detail-animate
          >
            <NuxtImg
              :src="module.src"
              :alt="module.alt || project.name"
              :width="module.width"
              :height="module.height"
              :sizes="imageSizes(module)"
              :loading="index === 0 ? 'eager' : 'lazy'"
              class="block h-auto w-full max-w-none"
            />
          </figure>

          <p
            v-else-if="module.type === 'text'"
            class="mx-auto max-w-2xl whitespace-pre-line font-paragraph text-base leading-relaxed text-main md:text-lg"
            :class="module.align === 'center' ? 'text-center' : 'text-start'"
            data-detail-animate
          >
            {{ module.text }}
          </p>

          <div
            v-else-if="module.type === 'youtube' || module.type === 'vimeo'"
            class="relative aspect-video overflow-hidden rounded-3xl bg-main"
            data-detail-animate
          >
            <iframe
              :src="embedSrc(module)"
              :title="project.name"
              class="absolute inset-0 size-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowfullscreen
            />
          </div>
        </template>
      </div>

      <nav
        v-if="previous || next"
        class="mt-16 grid gap-6 border-t border-main/10 pt-8 md:mt-20 md:grid-cols-2 md:gap-8 md:pt-10"
        :aria-label="`${t('projectDetail.previous')}, ${t('projectDetail.next')}`"
      >
        <NuxtLink
          v-if="previous"
          :to="previous.to"
          class="group min-w-0 rounded-3xl p-1 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
        >
          <p class="font-paragraph text-sm text-light-text md:text-base">
            {{ t('projectDetail.previous') }}
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
            {{ t('projectDetail.next') }}
          </p>
          <p class="mt-2 font-title text-xl font-semibold text-main transition-colors group-hover:text-primary md:text-2xl">
            {{ next.name }}
          </p>
        </NuxtLink>
      </nav>
    </div>
  </article>
</template>
