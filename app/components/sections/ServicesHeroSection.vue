<script setup lang="ts">
import gsap from 'gsap'

const { t } = useI18n()
const { services } = useServices()

const sectionRef = useTemplateRef<HTMLElement>('sectionRef')

const serviceCount = ref(0)
const yearsLabel = computed(() => t('servicesPage.stats.yearsValue'))

watchEffect(() => {
  serviceCount.value = services.value.length
})

let ctx: gsap.Context | undefined

onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  const section = sectionRef.value
  if (!section) return

  ctx = gsap.context(() => {
    gsap.from('[data-services-hero-animate]', {
      y: 40,
      autoAlpha: 0,
      duration: 0.6,
      ease: 'power3.out',
      stagger: 0.08,
      delay: 0.1,
    })

    const counters = { services: 0 }
    gsap.to(counters, {
      services: services.value.length,
      duration: 1,
      ease: 'power2.out',
      delay: 0.3,
      onUpdate: () => {
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
    aria-labelledby="services-heading"
    class="bg-lightest-bg px-4 pt-32 pb-12 sm:px-6 md:px-8 md:pt-40 md:pb-16"
  >
    <div class="mx-auto max-w-360">
      <div class="grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
        <div class="lg:col-span-7">
          <h1
            id="services-heading"
            class="relative inline-block max-w-full pb-[0.1em] font-title text-[clamp(2.25rem,5.8vw,5.5rem)] leading-[0.95] font-semibold tracking-tight text-main rtl:leading-[1.2] rtl:tracking-normal"
            :aria-label="`${t('servicesPage.headline')} ${t('servicesPage.headlineAccent')}`"
            data-services-hero-animate
          >
            <span
              class="bg-lightest-bg"
              aria-hidden="true"
            >{{ t('servicesPage.headline') }}</span>
            <span
              class="pointer-events-none absolute inset-e-0 bottom-0 origin-bottom translate-y-[48%] -rotate-3 font-handwritten text-[0.5em] leading-none font-normal text-primary rtl:rotate-3"
              aria-hidden="true"
            >
              {{ t('servicesPage.headlineAccent') }}
            </span>
          </h1>

          <p
            class="mt-8 max-w-xl font-paragraph text-base leading-relaxed text-main md:text-lg"
            data-services-hero-animate
          >
            {{ t('servicesPage.intro') }}
          </p>

          <dl
            class="mt-10 flex flex-wrap gap-x-12 gap-y-6"
            data-services-hero-animate
          >
            <div>
              <dt class="sr-only">{{ t('servicesPage.stats.services') }}</dt>
              <dd class="relative inline-block pb-[0.15em] font-title text-[clamp(2.5rem,5vw,4rem)] leading-none font-semibold tracking-tight text-main tabular-nums">
                <span aria-hidden="true">{{ serviceCount }}</span>
                <span
                  class="pointer-events-none absolute inset-e-0 bottom-0 origin-bottom translate-y-[45%] -rotate-3 font-handwritten text-[0.38em] leading-none font-normal text-primary rtl:rotate-3"
                  aria-hidden="true"
                >
                  {{ t('servicesPage.stats.services') }}
                </span>
              </dd>
            </div>
            <div>
              <dt class="sr-only">{{ t('servicesPage.stats.years') }}</dt>
              <dd class="relative inline-block pb-[0.15em] font-title text-[clamp(2.5rem,5vw,4rem)] leading-none font-semibold tracking-tight text-main tabular-nums">
                <span aria-hidden="true">{{ yearsLabel }}</span>
                <span
                  class="pointer-events-none absolute inset-e-0 bottom-0 origin-bottom translate-y-[45%] -rotate-3 font-handwritten text-[0.38em] leading-none font-normal text-primary rtl:rotate-3"
                  aria-hidden="true"
                >
                  {{ t('servicesPage.stats.years') }}
                </span>
              </dd>
            </div>
          </dl>
        </div>

        <nav
          class="lg:col-span-5"
          :aria-label="t('servicesPage.indexLabel')"
          data-services-hero-animate
        >
          <ul class="grid grid-cols-2 gap-2 sm:gap-3">
            <li
              v-for="service in services"
              :key="service.slug"
            >
              <a
                :href="`#service-${service.slug}`"
                class="group flex h-full items-center gap-3 rounded-2xl bg-light-bg p-3 ring-1 ring-main/8 transition-colors hover:bg-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary sm:gap-3.5 sm:p-3.5 md:rounded-3xl"
              >
                <span
                  class="flex size-10 shrink-0 items-center justify-center rounded-full text-lightest-bg transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6 motion-reduce:transition-none sm:size-11"
                  :style="{ backgroundColor: service.color }"
                  aria-hidden="true"
                >
                  <Icon
                    :name="service.icon"
                    class="size-4 sm:size-5"
                  />
                </span>
                <span class="min-w-0">
                  <span
                    class="block font-title text-[0.65rem] font-semibold tabular-nums text-main/35 sm:text-xs"
                    aria-hidden="true"
                  >
                    {{ String(service.index).padStart(2, '0') }}
                  </span>
                  <span class="mt-0.5 block font-title text-xs font-semibold leading-snug text-main sm:text-sm rtl:leading-normal">
                    {{ service.name }}
                  </span>
                </span>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </section>
</template>
