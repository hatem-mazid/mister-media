<script setup lang="ts">
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { A11y, Keyboard } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/vue'
import type { Swiper as SwiperClass } from 'swiper'
import 'swiper/css'

const { t, localeProperties } = useI18n()
const { testimonials } = useTestimonials()
const config = useRuntimeConfig()

const whatsappUrl = computed(() =>
  String(config.public.whatsappUrl || 'https://wa.me/'),
)

const sectionRef = useTemplateRef<HTMLElement>('sectionRef')
const swiperRef = ref<SwiperClass | null>(null)
const activeIndex = ref(0)

const modules = [A11y, Keyboard]
const total = computed(() => testimonials.value.length)
const dir = computed(() => localeProperties.value.dir === 'rtl' ? 'rtl' : 'ltr')
const canNavigate = computed(() => total.value > 1)

let ctx: gsap.Context | undefined

function onSwiper(swiper: SwiperClass) {
  swiperRef.value = swiper
  activeIndex.value = swiper.realIndex
}

function onSlideChange(swiper: SwiperClass) {
  activeIndex.value = swiper.realIndex
}

function prev() {
  swiperRef.value?.slidePrev()
}

function next() {
  swiperRef.value?.slideNext()
}

onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    if (swiperRef.value) swiperRef.value.params.speed = 0
    return
  }

  gsap.registerPlugin(ScrollTrigger)

  const section = sectionRef.value
  if (!section) return

  ctx = gsap.context(() => {
    gsap.from('[data-testimonials-animate]', {
      y: 40,
      autoAlpha: 0,
      duration: 0.5,
      ease: 'power3.out',
      stagger: 0.08,
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
    id="testimonials"
    aria-labelledby="testimonials-heading"
    class="scroll-mt-28 bg-lightest-bg px-4 pt-12 pb-24 sm:px-6 md:px-8 md:pt-16 md:pb-32"
  >
    <div class="mx-auto max-w-360">
      <div
        class="mb-8 flex flex-col items-start gap-8 sm:flex-row sm:items-end sm:justify-between md:mb-12"
        data-testimonials-animate
      >
        <UiSectionHeading
          id="testimonials-heading"
          class="scroll-mt-28 self-start"
          :title="t('testimonials.heading')"
          :handwritten="t('testimonials.headingAccent')"
        />

        <div
          v-if="canNavigate"
          class="flex shrink-0 gap-3 pb-1"
        >
          <button
            type="button"
            class="flex size-12 items-center justify-center rounded-full bg-main text-lightest-bg transition-colors hover:bg-main/90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
            :aria-label="t('testimonials.prev')"
            @click="prev"
          >
            <Icon
              name="lucide:arrow-left"
              class="size-5 rtl:rotate-180"
            />
          </button>
          <button
            type="button"
            class="flex size-12 items-center justify-center rounded-full bg-main text-lightest-bg transition-colors hover:bg-main/90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
            :aria-label="t('testimonials.next')"
            @click="next"
          >
            <Icon
              name="lucide:arrow-right"
              class="size-5 rtl:rotate-180"
            />
          </button>
        </div>
      </div>

      <div
        class="grid items-stretch gap-4 md:gap-6 lg:grid-cols-12 lg:gap-6"
        data-testimonials-animate
      >
        <aside class="flex flex-col justify-between gap-6 rounded-3xl bg-main px-6 py-6 text-lightest-bg md:px-8 md:py-8 lg:col-span-4 lg:min-h-0">
          <p
            class="relative inline-block self-start pb-[0.15em] font-title text-[clamp(3rem,6vw,5.5rem)] font-semibold leading-none tracking-tight"
            :aria-label="`${t('testimonials.aside.count')} ${t('testimonials.aside.countAccent')}`"
          >
            <span aria-hidden="true">{{ t('testimonials.aside.count') }}</span>
            <span
              class="pointer-events-none absolute inset-e-0 bottom-0 origin-bottom translate-y-[45%] -rotate-3 font-handwritten text-[0.38em] font-normal leading-none text-primary rtl:rotate-3"
              aria-hidden="true"
            >
              {{ t('testimonials.aside.countAccent') }}
            </span>
          </p>

          <div class="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between lg:flex-col lg:items-start">
            <p class="max-w-xs font-paragraph text-sm text-light-text md:text-base">
              {{ t('testimonials.aside.experience') }}
            </p>
            <UiButton
              :to="whatsappUrl"
              variant="light"
              external
            >
              {{ t('nav.letsTalk') }}
            </UiButton>
          </div>
        </aside>

        <div
          class="min-w-0 lg:col-span-8"
          :dir="dir"
        >
          <Swiper
            :key="dir"
            :modules="modules"
            :slides-per-view="1"
            :space-between="24"
            :speed="400"
            :loop="canNavigate"
            :auto-height="true"
            :grab-cursor="canNavigate"
            :keyboard="{ enabled: canNavigate }"
            :a11y="{
              enabled: true,
              prevSlideMessage: t('testimonials.prev'),
              nextSlideMessage: t('testimonials.next'),
            }"
            class="h-full w-full [&_.swiper-slide]:h-full"
            @swiper="onSwiper"
            @slide-change="onSlideChange"
          >
            <SwiperSlide
              v-for="(item, index) in testimonials"
              :key="item.slug"
            >
              <UiTestimonialCard
                :quote="item.quote"
                :name="item.name"
                :role="item.role"
                :photo="item.photo"
                :photo-width="item.width"
                :photo-height="item.height"
                :index="index + 1"
                :total="total"
              />
            </SwiperSlide>
          </Swiper>
          <p class="sr-only" aria-live="polite">
            {{ activeIndex + 1 }}/{{ total }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
