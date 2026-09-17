<script setup lang="ts">
import gsap from 'gsap'
import { A11y, Autoplay, EffectCards, Keyboard } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/vue'
import type { Swiper as SwiperClass } from 'swiper'
import 'swiper/css'
import 'swiper/css/effect-cards'

const { t, localeProperties } = useI18n()
const { projects } = useProjects()
const { services } = useServices()

const sectionRef = useTemplateRef<HTMLElement>('sectionRef')
const swiperRef = ref<SwiperClass | null>(null)
const activeIndex = ref(0)
const reducedMotion = ref(false)

const deck = computed(() => projects.value.slice(0, 5))
const canLoop = computed(() => deck.value.length > 1)
const dir = computed(() => localeProperties.value.dir === 'rtl' ? 'rtl' : 'ltr')
const modules = [EffectCards, Autoplay, A11y, Keyboard]

const autoplay = computed(() => {
  if (reducedMotion.value || !canLoop.value) return false

  return {
    delay: 3200,
    disableOnInteraction: false,
    pauseOnMouseEnter: true,
  }
})

// Counters hold the real totals for SSR, then count up once on the client.
const projectCount = ref(0)
const serviceCount = ref(0)

watchEffect(() => {
  projectCount.value = projects.value.length
  serviceCount.value = services.value.length
})

let ctx: gsap.Context | undefined

function onSwiper(swiper: SwiperClass) {
  swiperRef.value = swiper
  activeIndex.value = swiper.realIndex
  if (reducedMotion.value) swiper.params.speed = 0
}

function onSlideChange(swiper: SwiperClass) {
  activeIndex.value = swiper.realIndex
}

onMounted(() => {
  reducedMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (reducedMotion.value) {
    if (swiperRef.value) {
      swiperRef.value.params.speed = 0
      swiperRef.value.autoplay?.stop()
    }
    return
  }

  const section = sectionRef.value
  if (!section) return

  ctx = gsap.context(() => {
    gsap.from('[data-projects-hero-animate]', {
      y: 40,
      autoAlpha: 0,
      duration: 0.6,
      ease: 'power3.out',
      stagger: 0.08,
      delay: 0.1,
    })

    const counters = { projects: 0, services: 0 }
    gsap.to(counters, {
      projects: projects.value.length,
      services: services.value.length,
      duration: 1,
      ease: 'power2.out',
      delay: 0.3,
      onUpdate: () => {
        projectCount.value = Math.round(counters.projects)
        serviceCount.value = Math.round(counters.services)
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
    aria-labelledby="projects-heading"
    class="bg-lightest-bg px-4 pt-32 pb-12 sm:px-6 md:px-8 md:pt-40 md:pb-16"
  >
    <div class="mx-auto max-w-360">
      <div class="grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
        <div class="lg:col-span-7">
          <p
            class="font-paragraph text-sm text-light-text md:text-base"
            data-projects-hero-animate
          >
            {{ t('projectsPage.eyebrow') }}
          </p>

          <h1
            id="projects-heading"
            class="relative mt-4 inline-block max-w-full pb-[0.1em] font-title text-[clamp(2.25rem,5.8vw,5.5rem)] leading-[0.95] font-semibold tracking-tight text-main rtl:leading-[1.2] rtl:tracking-normal"
            :aria-label="`${t('projectsPage.headline')} ${t('projectsPage.headlineAccent')}`"
            data-projects-hero-animate
          >
            <span
              class="bg-lightest-bg"
              aria-hidden="true"
            >{{ t('projectsPage.headline') }}</span>
            <span
              class="pointer-events-none absolute inset-e-0 bottom-0 origin-bottom translate-y-[48%] -rotate-3 font-handwritten text-[0.5em] leading-none font-normal text-primary rtl:rotate-3"
              aria-hidden="true"
            >
              {{ t('projectsPage.headlineAccent') }}
            </span>
          </h1>

          <p
            class="mt-8 max-w-xl font-paragraph text-base leading-relaxed text-main md:text-lg"
            data-projects-hero-animate
          >
            {{ t('projectsPage.intro') }}
          </p>

          <dl
            class="mt-10 flex flex-wrap gap-x-12 gap-y-6"
            data-projects-hero-animate
          >
            <div
              v-for="stat in [
                { key: 'projects', value: projectCount },
                { key: 'services', value: serviceCount },
              ]"
              :key="stat.key"
            >
              <dt class="sr-only">{{ t(`projectsPage.stats.${stat.key}`) }}</dt>
              <dd class="relative inline-block pb-[0.15em] font-title text-[clamp(2.5rem,5vw,4rem)] leading-none font-semibold tracking-tight text-main tabular-nums">
                <span aria-hidden="true">{{ stat.value }}</span>
                <span
                  class="pointer-events-none absolute inset-e-0 bottom-0 origin-bottom translate-y-[45%] -rotate-3 font-handwritten text-[0.38em] leading-none font-normal text-primary rtl:rotate-3"
                  aria-hidden="true"
                >
                  {{ t(`projectsPage.stats.${stat.key}`) }}
                </span>
              </dd>
            </div>
          </dl>
        </div>

        <div
          class="lg:col-span-5"
          data-projects-hero-animate
        >
          <!-- Padding around the swiper so Effect Cards can fan without clipping. -->
          <div
            class="mx-auto w-full max-w-sm px-8 py-6"
            :dir="dir"
          >
            <Swiper
              :key="dir"
              :modules="modules"
              effect="cards"
              :cards-effect="{
                perSlideOffset: 8,
                perSlideRotate: 3,
                rotate: true,
                slideShadows: false,
              }"
              :grab-cursor="canLoop"
              :loop="canLoop"
              :speed="reducedMotion ? 0 : 500"
              :autoplay="autoplay"
              :keyboard="{ enabled: canLoop }"
              :a11y="{
                enabled: true,
                containerMessage: t('projectsPage.deckLabel'),
                prevSlideMessage: t('projectsPage.deckPrev'),
                nextSlideMessage: t('projectsPage.deckNext'),
              }"
              class="aspect-4/5 w-full overflow-visible [&_.swiper-slide]:overflow-hidden [&_.swiper-slide]:rounded-3xl [&_.swiper-slide]:bg-light-bg [&_.swiper-slide]:ring-1 [&_.swiper-slide]:ring-main/10 md:[&_.swiper-slide]:rounded-4xl"
              @swiper="onSwiper"
              @slide-change="onSlideChange"
            >
              <SwiperSlide
                v-for="(project, index) in deck"
                :key="project.slug"
              >
                <NuxtLink
                  :to="project.to"
                  class="relative block size-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
                >
                  <NuxtImg
                    :src="project.cover"
                    :alt="project.name"
                    :width="project.width"
                    :height="project.height"
                    sizes="sm:90vw lg:34vw"
                    :loading="index === 0 ? 'eager' : 'lazy'"
                    class="size-full object-cover"
                  />

                  <div class="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-linear-to-t from-main/80 to-transparent p-5 md:p-6">
                    <div class="min-w-0">
                      <p class="truncate font-title text-base font-semibold text-lightest-bg md:text-lg">
                        {{ project.name }}
                      </p>
                      <UiCategoryPill
                        class="mt-2"
                        :label="project.serviceName"
                        :icon="project.serviceIcon"
                        :color="project.serviceColor"
                      />
                    </div>
                    <span
                      class="shrink-0 font-title text-sm font-semibold text-lightest-bg tabular-nums"
                      aria-hidden="true"
                    >
                      {{ String(index + 1).padStart(2, '0') }}/{{ String(deck.length).padStart(2, '0') }}
                    </span>
                  </div>
                </NuxtLink>
              </SwiperSlide>
            </Swiper>

            <p
              class="sr-only"
              aria-live="polite"
            >
              {{ activeIndex + 1 }}/{{ deck.length }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
