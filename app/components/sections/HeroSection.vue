<script setup lang="ts">
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import LampIcon from '~/components/global/LampIcon.vue'
import { clients } from '~/data/clients'

const { t } = useI18n()
const localePath = useLocalePath()
const config = useRuntimeConfig()

const whatsappUrl = computed(() =>
  String(config.public.whatsappUrl || 'https://wa.me/'),
)

const heroRef = useTemplateRef<HTMLElement>('heroRef')
const stripRef = useTemplateRef<HTMLElement>('stripRef')
const stripReverseRef = useTemplateRef<HTMLElement>('stripReverseRef')

const STACK_SIZE = 3
const STACK_SHIFT = 12
const stackTick = ref(0)

const stackLogos = computed(() =>
  Array.from({ length: Math.min(STACK_SIZE, clients.length) }, (_, slot) => {
    const client = clients[(stackTick.value + slot) % clients.length]!
    return {
      ...client,
      slot,
    }
  }),
)

const stackWidth = `${32 + STACK_SHIFT * (STACK_SIZE - 1)}px`

const stripImages = Array.from({ length: 8 }, (_, index) => ({
  src: `https://picsum.photos/seed/mm-strip-${index + 1}/720/960`,
}))

const stripImagesReverse = Array.from({ length: 8 }, (_, index) => ({
  src: `https://picsum.photos/seed/mm-strip-${index + 9}/720/960`,
}))

const tileClass = 'h-48 w-36 max-w-none shrink-0 rounded-3xl bg-light-bg object-cover sm:h-64 sm:w-48 md:h-80 md:w-60 lg:h-96 lg:w-72'

let ctx: gsap.Context | undefined
let alive = true
let logoTimer: ReturnType<typeof window.setInterval> | undefined

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

  if (!reduced) {
    setupStrips()
    logoTimer = window.setInterval(() => {
      stackTick.value = (stackTick.value + 1) % clients.length
    }, 4000)
  }
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
  if (logoTimer) window.clearInterval(logoTimer)
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
        <div
          class="relative h-8 shrink-0"
          :style="{ width: stackWidth }"
          aria-hidden="true"
        >
          <TransitionGroup name="hero-logos">
            <span
              v-for="logo in stackLogos"
              :key="logo.slug"
              class="absolute top-0 flex size-8 items-center justify-center rounded-full bg-lightest-bg"
              :style="{
                zIndex: logo.slot + 1,
                insetInlineStart: `${logo.slot * STACK_SHIFT}px`,
              }"
            >
              <img
                :src="logo.src"
                alt=""
                :width="logo.width"
                :height="logo.height"
                class="size-[70%] max-w-none object-contain"
              >
            </span>
          </TransitionGroup>
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
          <LampIcon class="size-[0.85em] shrink-0 text-primary" />
          <span class="font-handwritten font-normal text-primary">{{ t('hero.idea') }}</span>
        </span>

        <span
          class="flex flex-wrap items-center justify-center gap-x-3 md:gap-x-5"
          data-hero-animate
        >
          <span class="font-normal text-light-text">{{ t('hero.to') }}</span>
          <span
            class="flex size-[0.85em] shrink-0 items-center justify-center text-primary"
            aria-hidden="true"
          >
            <Icon
              name="lucide:settings"
              class="size-[0.7em] animate-spin-slow motion-reduce:animate-none"
            />
          </span>
          <span class="text-primary">{{ t('hero.execution') }}</span>
        </span>

        <span
          class="flex flex-wrap items-center justify-center gap-x-3 md:gap-x-5"
          data-hero-animate
        >
          <span class="font-normal text-light-text">{{ t('hero.forBrands') }}</span>
          <span
            class="flex size-[0.85em] shrink-0 items-center justify-center text-primary perspective-[12em]"
            aria-hidden="true"
          >
            <Icon
              name="lucide:globe-2"
              class="size-[0.7em] motion-reduce:animate-none"
            />
          </span>
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

<style scoped>
.hero-logos-move {
  transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);
}

.hero-logos-enter-active {
  z-index: 20;
  transition:
    transform 0.55s cubic-bezier(0.34, 1.4, 0.64, 1),
    opacity 0.3s ease-out;
}

.hero-logos-enter-from {
  opacity: 0;
  transform: scale(0.4) translateY(-12px);
}

.hero-logos-leave-active {
  z-index: 0;
  transition:
    transform 0.45s ease,
    opacity 0.4s ease;
}

.hero-logos-leave-to {
  opacity: 0;
  transform: scale(0.65);
}

@media (prefers-reduced-motion: reduce) {
  .hero-logos-move,
  .hero-logos-enter-active,
  .hero-logos-leave-active {
    transition: none;
  }
}
</style>
