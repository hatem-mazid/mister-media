<script setup lang="ts">
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const { t } = useI18n()
const { services } = useServices()
const { projects } = useProjects()

const sectionRef = useTemplateRef<HTMLElement>('sectionRef')
const activeSlug = ref(services.value[0]?.slug ?? '')

const cards = computed(() =>
  services.value.map((service) => {
    const related = projects.value.filter(project => project.service === service.slug)

    return {
      ...service,
      related,
      covers: related.slice(0, 3).map(project => ({
        src: project.cover,
        alt: project.name,
        width: project.width,
        height: project.height,
      })),
    }
  }),
)

let ctx: gsap.Context | undefined

onMounted(() => {
  const section = sectionRef.value
  if (!section) return

  gsap.registerPlugin(ScrollTrigger)

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  ctx = gsap.context(() => {
    const panels = section.querySelectorAll<HTMLElement>('[data-service-panel]')

    panels.forEach((panel) => {
      const slug = panel.dataset.servicePanel
      if (!slug) return

      ScrollTrigger.create({
        trigger: panel,
        start: 'top 45%',
        end: 'bottom 45%',
        onToggle: (self) => {
          if (self.isActive) activeSlug.value = slug
        },
      })

      if (reduced) return

      const copy = panel.querySelector('[data-service-copy]')
      const mockup = panel.querySelector('[data-cover-stack]')
      const targets = [copy, mockup].filter(Boolean)
      if (!targets.length) return

      gsap.fromTo(targets, {
        y: 36,
        autoAlpha: 0,
      }, {
        y: 0,
        autoAlpha: 1,
        duration: 0.55,
        ease: 'power3.out',
        stagger: 0.08,
        immediateRender: false,
        scrollTrigger: {
          trigger: panel,
          start: 'top 82%',
          once: true,
        },
      })
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
    aria-labelledby="services-index-heading"
    class="bg-lightest-bg px-4 pb-16 sm:px-6 md:px-8 md:pb-24"
  >
    <div class="mx-auto max-w-360">
      <h2
        id="services-index-heading"
        class="sr-only"
      >
        {{ t('services.heading') }}
      </h2>

      <div class="lg:grid lg:grid-cols-12 lg:items-start lg:gap-8">
        <!-- Wrapper must stretch with the panels; sticky on the grid item itself has no room to travel. -->
        <div class="lg:col-span-3 lg:self-stretch">
          <nav
            class="sticky top-32 z-20 -mx-4 mb-8 bg-lightest-bg/90 px-4 py-3 backdrop-blur-md sm:-mx-6 sm:px-6 md:-mx-8 md:px-8 lg:top-36 lg:mx-0 lg:mb-0 lg:bg-transparent lg:px-0 lg:py-0 lg:backdrop-blur-none"
            :aria-label="t('servicesPage.indexLabel')"
          >
            <ul class="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:gap-1 lg:overflow-visible lg:pb-0">
              <li
                v-for="service in services"
                :key="service.slug"
                class="shrink-0"
              >
                <a
                  :href="`#service-${service.slug}`"
                  class="flex items-center gap-3 rounded-full px-3 py-2 font-paragraph text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary lg:rounded-2xl lg:px-3 lg:py-2.5"
                  :class="activeSlug === service.slug
                    ? 'bg-light-bg text-main'
                    : 'text-light-text hover:text-main'"
                >
                  <span
                    class="font-title text-xs font-semibold tabular-nums lg:text-sm"
                    aria-hidden="true"
                  >
                    {{ String(service.index).padStart(2, '0') }}
                  </span>
                  <span class="truncate">{{ service.name }}</span>
                </a>
              </li>
            </ul>
          </nav>
        </div>

        <ol class="lg:col-span-9">
          <li
            v-for="(service, index) in cards"
            :id="`service-${service.slug}`"
            :key="service.slug"
            class="scroll-mt-44 border-t border-main/10 py-16 md:scroll-mt-40 md:py-24 lg:scroll-mt-32"
            :data-service-panel="service.slug"
          >
            <article class="grid items-center gap-10 lg:grid-cols-12 lg:gap-8">
              <div
                class="lg:col-span-6"
                :class="index % 2 === 1 && 'lg:col-start-7'"
                data-service-copy
              >
                <p
                  class="font-title text-5xl leading-none font-light text-transparent tabular-nums [-webkit-text-stroke:1px_var(--color-light-text)] md:text-7xl"
                  aria-hidden="true"
                >
                  {{ String(service.index).padStart(2, '0') }}
                </p>

                <div class="mt-6 flex items-start gap-4">
                  <span
                    class="mt-1 flex size-12 shrink-0 items-center justify-center rounded-full text-lightest-bg"
                    :style="{ backgroundColor: service.color }"
                    aria-hidden="true"
                  >
                    <Icon
                      :name="service.icon"
                      class="size-5"
                    />
                  </span>
                  <h3 class="font-title text-[clamp(1.75rem,3.4vw,3rem)] leading-[1.05] font-semibold tracking-tight text-main rtl:leading-[1.3] rtl:tracking-normal">
                    <NuxtLink
                      :to="service.to"
                      class="rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
                    >
                      {{ service.name }}
                    </NuxtLink>
                  </h3>
                </div>

                <p class="mt-6 max-w-md font-paragraph text-base leading-relaxed text-main/80 md:text-lg">
                  {{ service.summary }}
                </p>

                <div class="mt-8 flex flex-wrap items-center gap-3">
                  <UiButton :to="service.to">
                    {{ t('servicesPage.explore') }}
                  </UiButton>
                  <UiButton
                    v-if="service.related.length"
                    :to="service.workTo"
                    variant="secondary"
                  >
                    {{ t('servicesPage.viewWork') }}
                  </UiButton>
                </div>
              </div>

              <div
                class="lg:col-span-6"
                :class="index % 2 === 1 && 'lg:col-start-1 lg:row-start-1'"
              >
                <UiCoverStack
                  :covers="service.covers"
                  :icon="service.icon"
                  :color="service.color"
                  :label="service.name"
                />
              </div>
            </article>
          </li>
        </ol>
      </div>
    </div>
  </section>
</template>
