<script setup lang="ts">
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const { t } = useI18n()
const localePath = useLocalePath()
const config = useRuntimeConfig()

const whatsappUrl = computed(() =>
  String(config.public.whatsappUrl || 'https://wa.me/'),
)

const heroRef = useTemplateRef<HTMLElement>('heroRef')
const stripRef = useTemplateRef<HTMLElement>('stripRef')
const stripReverseRef = useTemplateRef<HTMLElement>('stripReverseRef')

const eyebrowAvatars = [
  'https://picsum.photos/seed/mm-avatar-1/96/96',
  'https://picsum.photos/seed/mm-avatar-2/96/96',
  'https://picsum.photos/seed/mm-avatar-3/96/96',
]

const headlineImages = {
  idea: 'https://picsum.photos/seed/mm-idea/240/240',
  execution: 'https://picsum.photos/seed/mm-execution/240/240',
  world: 'https://picsum.photos/seed/mm-world/240/240',
}

const stripImages = Array.from({ length: 8 }, (_, index) => ({
  src: `https://picsum.photos/seed/mm-strip-${index + 1}/720/960`,
}))

const stripImagesReverse = Array.from({ length: 8 }, (_, index) => ({
  src: `https://picsum.photos/seed/mm-strip-${index + 9}/720/960`,
}))

const tileClass = 'h-48 w-36 max-w-none shrink-0 rounded-3xl bg-light-bg object-cover sm:h-64 sm:w-48 md:h-80 md:w-60 lg:h-96 lg:w-72'

let ctx: gsap.Context | undefined
let alive = true

function stripRange(strip: HTMLElement, track: HTMLElement) {
  const firstTile = strip.firstElementChild as HTMLElement | null
  const inset = (firstTile?.offsetWidth ?? 0) * 0.35
  const end = -(strip.scrollWidth - track.clientWidth - inset)

  return {
    start: -inset,
    end: Math.min(end, -inset),
  }
}

onMounted(() => {
  alive = true
  const hero = heroRef.value
  if (!hero) return

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  gsap.registerPlugin(ScrollTrigger)
  ScrollTrigger.config({ ignoreMobileResize: true })

  ctx = gsap.context(() => {
    if (!reduced) {
      gsap.from('[data-hero-animate]', {
        y: 40,
        autoAlpha: 0,
        duration: 0.6,
        ease: 'power3.out',
        stagger: 0.08,
        delay: 0.1,
      })
    }
  }, hero)

  if (!reduced) setupStrips()
})

async function setupStrips() {
  await nextTick()

  const strips = [stripRef.value, stripReverseRef.value].filter((strip): strip is HTMLElement => Boolean(strip))
  const images = strips.flatMap(strip => [...strip.querySelectorAll('img')])
  await Promise.all(images.map(image => image.decode().catch(() => undefined)))

  const hero = heroRef.value
  if (!alive || !ctx || !hero || strips.length < 2) return

  ctx.add(() => {
    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: hero,
        start: 'top top',
        end: 'bottom top',
        scrub: 0.6,
        invalidateOnRefresh: true,
      },
    })

    strips.forEach((strip, index) => {
      const track = strip.parentElement
      if (!track) return

      const reverse = index === 1

      timeline.fromTo(strip, {
        x: () => {
          const range = stripRange(strip, track)
          return reverse ? range.end : range.start
        },
      }, {
        x: () => {
          const range = stripRange(strip, track)
          return reverse ? range.start : range.end
        },
        ease: 'none',
      }, 0)
    })
  })
}

onBeforeUnmount(() => {
  alive = false
  ctx?.revert()
})
</script>

<template>
  <section
    ref="heroRef"
    aria-labelledby="hero-heading"
    class="flex min-h-dvh flex-col overflow-hidden bg-lightest-bg"
  >
    <div class="flex flex-col items-center justify-center px-6 pt-32 pb-20 md:px-8 md:pt-40 md:pb-24">
      <div
        class="mb-8 flex items-center gap-3 md:mb-10"
        data-hero-animate
      >
        <div class="flex -space-x-2 rtl:space-x-reverse">
          <NuxtImg
            v-for="(src, index) in eyebrowAvatars"
            :key="src"
            :src="src"
            alt=""
            width="48"
            height="48"
            :class="[
              'size-8 max-w-none rounded-full object-cover ring-2 ring-lightest-bg',
              index === 0 ? 'relative z-30' : index === 1 ? 'relative z-20' : 'relative z-10',
            ]"
          />
        </div>
        <p class="font-paragraph text-sm text-light-text md:text-base">
          {{ t('hero.eyebrow') }}
        </p>
      </div>

      <h1
        id="hero-heading"
        class="flex max-w-6xl flex-col items-center gap-y-2 text-center font-title text-[clamp(2.25rem,5.8vw,5.5rem)] leading-[0.95] font-semibold tracking-tight text-main md:gap-y-3"
      >
        <span
          class="flex flex-wrap items-center justify-center gap-x-3 md:gap-x-5"
          data-hero-animate
        >
          <span>{{ t('hero.from') }}</span>
          <NuxtImg
            :src="headlineImages.idea"
            alt=""
            width="120"
            height="120"
            class="size-[0.85em] max-w-none shrink-0 rounded-full object-cover"
          />
          <span class="font-handwritten font-normal text-primary">{{ t('hero.idea') }}</span>
        </span>

        <span
          class="flex flex-wrap items-center justify-center gap-x-3 md:gap-x-5"
          data-hero-animate
        >
          <span class="font-normal text-light-text">{{ t('hero.to') }}</span>
          <NuxtImg
            :src="headlineImages.execution"
            alt=""
            width="120"
            height="120"
            class="size-[0.85em] max-w-none shrink-0 rounded-full object-cover"
          />
          <span class="text-primary">{{ t('hero.execution') }}</span>
        </span>

        <span
          class="flex flex-wrap items-center justify-center gap-x-3 md:gap-x-5"
          data-hero-animate
        >
          <span class="font-normal text-light-text">{{ t('hero.forBrands') }}</span>
          <NuxtImg
            :src="headlineImages.world"
            alt=""
            width="120"
            height="120"
            class="size-[0.85em] max-w-none shrink-0 rounded-full object-cover"
          />
          <span>{{ t('hero.world') }}</span>
        </span>
      </h1>

      <div
        class="mt-10 flex flex-wrap items-center justify-center gap-3 md:mt-12 md:gap-4"
        data-hero-animate
      >
        <UiButton :to="localePath('/projects')">
          {{ t('hero.ourWorks') }}
        </UiButton>
        <UiButton :to="whatsappUrl" variant="secondary" external>
          {{ t('hero.contactUs') }}
        </UiButton>
      </div>
    </div>

    <div
      dir="ltr"
      class="flex w-full shrink-0 flex-col items-start gap-2 overflow-hidden px-0 pb-6 md:pb-8"
      data-hero-animate
    >
      <div
        ref="stripRef"
        dir="ltr"
        class="flex w-max gap-2 will-change-transform"
      >
        <NuxtImg
          v-for="image in stripImages"
          :key="image.src"
          :src="image.src"
          alt=""
          width="720"
          height="960"
          :class="tileClass"
        />
      </div>
      <div
        ref="stripReverseRef"
        dir="ltr"
        class="flex w-max gap-2 will-change-transform"
      >
        <NuxtImg
          v-for="image in stripImagesReverse"
          :key="image.src"
          :src="image.src"
          alt=""
          width="720"
          height="960"
          :class="tileClass"
        />
      </div>
    </div>
  </section>
</template>
