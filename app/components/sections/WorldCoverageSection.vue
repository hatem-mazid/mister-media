<script setup lang="ts">
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { worldMap } from '~/data/worldMap'

const { t } = useI18n()
const { hq, markets, baseDots } = useCoverage()
const config = useRuntimeConfig()

const whatsappUrl = computed(() =>
  String(config.public.whatsappUrl || 'https://wa.me/'),
)

const sectionRef = useTemplateRef<HTMLElement>('sectionRef')
const mapRef = useTemplateRef<SVGSVGElement>('mapRef')
const maskCircleRef = useTemplateRef<SVGCircleElement>('maskCircleRef')
const maskId = useId()

const hovered = ref<string | null>(null)
const pinned = ref<string | null>(null)
const current = computed(() => hovered.value ?? pinned.value)

// Horizontal position of HQ as a share of the map width, used to keep Turkey centred
// when the map is taller than wide and overflows the panel on small screens.
const hqShift = computed(() => `${((hq.value.point[0] / worldMap.width) * 100).toFixed(2)}%`)

const revealRadius = worldMap.width * 1.15

function toggle(code: string) {
  pinned.value = pinned.value === code ? null : code
}

function arcPath(from: readonly [number, number], to: readonly [number, number]) {
  const [x1, y1] = from
  const [x2, y2] = to
  const dx = x2 - x1
  const dy = y2 - y1
  const dist = Math.hypot(dx, dy) || 1
  const lift = Math.min(dist * 0.3, 90)
  // Perpendicular to the chord, flipped so the arc always bows upward.
  let nx = -dy / dist
  let ny = dx / dist
  if (ny > 0) {
    nx = -nx
    ny = -ny
  }
  const cx = (x1 + x2) / 2 + nx * lift
  const cy = (y1 + y2) / 2 + ny * lift
  return `M${x1} ${y1}Q${cx} ${cy} ${x2} ${y2}`
}

let ctx: gsap.Context | undefined

onMounted(() => {
  const section = sectionRef.value
  const map = mapRef.value
  const maskCircle = maskCircleRef.value
  if (!section || !map || !maskCircle) return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  gsap.registerPlugin(ScrollTrigger)

  const arcs = [...map.querySelectorAll<SVGPathElement>('[data-arc]')]
  arcs.forEach((arc) => {
    const length = arc.getTotalLength()
    arc.style.strokeDasharray = `${length}`
    arc.style.strokeDashoffset = `${length}`
  })

  ctx = gsap.context(() => {
    const timeline = gsap.timeline({
      defaults: { ease: 'power3.out' },
      scrollTrigger: {
        trigger: section,
        start: 'top 75%',
        once: true,
      },
    })

    timeline
      .from('[data-coverage-animate]', {
        y: 40,
        autoAlpha: 0,
        duration: 0.5,
        stagger: 0.08,
      })
      .fromTo(maskCircle, { attr: { r: 0 } }, {
        attr: { r: revealRadius },
        duration: 1.2,
        ease: 'power2.inOut',
      }, 0.15)
      .from('[data-hq]', {
        scale: 0,
        transformOrigin: '50% 50%',
        duration: 0.5,
        ease: 'back.out(2)',
      }, 0.25)
      .to(arcs, {
        strokeDashoffset: 0,
        duration: 0.7,
        ease: 'power2.out',
        stagger: 0.05,
      }, 0.55)
      .from('[data-marker]', {
        scale: 0,
        transformOrigin: '50% 50%',
        duration: 0.45,
        ease: 'back.out(2.4)',
        stagger: 0.05,
      }, 0.8)
  }, section)
})

onBeforeUnmount(() => {
  ctx?.revert()
})
</script>

<template>
  <section
    ref="sectionRef"
    id="coverage"
    aria-labelledby="coverage-heading"
    class="scroll-mt-28 bg-lightest-bg px-4 py-12 sm:px-6 md:px-8 md:py-16"
  >
    <div class="mx-auto max-w-360">
      <div
        class="mb-8 flex flex-col items-start gap-6 md:mb-12 md:flex-row md:items-end md:justify-between md:gap-12"
        data-coverage-animate
      >
        <UiSectionHeading
          id="coverage-heading"
          class="self-start"
          :title="t('coverage.heading')"
          :handwritten="t('coverage.headingAccent')"
        />
        <p class="max-w-md font-paragraph text-base text-light-text md:pb-1 md:text-lg">
          {{ t('coverage.intro') }}
        </p>
      </div>

      <div
        class="overflow-hidden rounded-3xl bg-main text-lightest-bg md:rounded-[2.5rem]"
        data-coverage-animate
      >
        <div
          dir="ltr"
          class="relative aspect-4/5 overflow-hidden sm:aspect-3/2 lg:aspect-896/422"
        >
          <svg
            ref="mapRef"
            :viewBox="worldMap.viewBox"
            class="absolute top-0 left-1/2 h-full w-auto max-w-none -translate-x-(--hq-x) lg:left-0 lg:h-auto lg:w-full lg:translate-x-0"
            :style="{ '--hq-x': hqShift }"
            role="img"
            :aria-label="t('coverage.mapLabel')"
          >
            <defs>
              <mask
                :id="maskId"
                maskUnits="userSpaceOnUse"
                x="0"
                y="0"
                :width="worldMap.width"
                :height="worldMap.height"
              >
                <circle
                  ref="maskCircleRef"
                  :cx="hq.point[0]"
                  :cy="hq.point[1]"
                  :r="revealRadius"
                  fill="white"
                />
              </mask>
            </defs>

            <g
              :mask="`url(#${maskId})`"
              fill="none"
              stroke-linecap="round"
              :stroke-width="worldMap.dotSize"
            >
              <path
                :d="baseDots"
                class="stroke-light-text/35"
              />
              <path
                v-for="market in markets"
                :key="market.code"
                :d="market.dots"
                class="stroke-primary transition-opacity duration-300"
                :class="current === market.code ? 'opacity-100' : current ? 'opacity-30' : 'opacity-60'"
              />
              <path
                :d="hq.dots"
                class="stroke-lightest-bg"
              />
            </g>

            <g
              fill="none"
              stroke-linecap="round"
            >
              <path
                v-for="market in markets"
                :key="market.code"
                :d="arcPath(hq.point, market.point)"
                data-arc
                class="stroke-primary transition-opacity duration-300"
                :class="current && current !== market.code ? 'opacity-25' : 'opacity-70'"
                :stroke-width="current === market.code ? 2 : 1.1"
              />
            </g>

            <g
              v-for="market in markets"
              :key="market.code"
              data-marker
              class="cursor-pointer"
              @pointerenter="hovered = market.code"
              @pointerleave="hovered = null"
              @click="toggle(market.code)"
            >
              <circle
                :cx="market.point[0]"
                :cy="market.point[1]"
                r="9"
                class="fill-transparent"
              />
              <circle
                :cx="market.point[0]"
                :cy="market.point[1]"
                r="7"
                class="fill-none stroke-primary transition-opacity duration-300"
                stroke-width="1.2"
                :class="current === market.code ? 'opacity-100' : 'opacity-0'"
              />
              <circle
                :cx="market.point[0]"
                :cy="market.point[1]"
                r="3.2"
                class="fill-primary stroke-main transition-transform duration-300"
                stroke-width="1.5"
              />
            </g>

            <g data-hq>
              <circle
                :cx="hq.point[0]"
                :cy="hq.point[1]"
                r="9"
                class="origin-center transform-fill animate-ping fill-primary/40 motion-reduce:hidden"
              />
              <circle
                :cx="hq.point[0]"
                :cy="hq.point[1]"
                r="5"
                class="fill-primary stroke-lightest-bg"
                stroke-width="2"
              />
            </g>
          </svg>
        </div>

        <div class="flex flex-col gap-6 px-5 pt-2 pb-6 md:px-8 md:pb-8 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
          <div class="flex min-w-0 flex-col gap-4">
            <p class="font-title text-xs font-semibold tracking-wider text-light-text uppercase">
              {{ t('coverage.marketsLabel') }}
            </p>
            <ul class="flex flex-wrap gap-2">
              <li>
                <span class="inline-flex items-center gap-2 rounded-full bg-lightest-bg px-4 py-2 font-paragraph text-sm text-main">
                  <Icon
                    name="lucide:map-pin"
                    class="size-4 text-primary"
                    aria-hidden="true"
                  />
                  <span class="font-semibold">{{ hq.name }}</span>
                  <span class="text-light-text">{{ t('coverage.hq') }}</span>
                </span>
              </li>
              <li
                v-for="market in markets"
                :key="market.code"
              >
                <button
                  type="button"
                  class="inline-flex items-center gap-2 rounded-full px-4 py-2 font-paragraph text-sm ring-1 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  :class="current === market.code
                    ? 'bg-primary text-main ring-primary'
                    : 'text-lightest-bg ring-lightest-bg/15 hover:bg-lightest-bg/10'"
                  :aria-pressed="pinned === market.code"
                  @pointerenter="hovered = market.code"
                  @pointerleave="hovered = null"
                  @focus="hovered = market.code"
                  @blur="hovered = null"
                  @click="toggle(market.code)"
                >
                  <span
                    class="size-1.5 rounded-full"
                    :class="current === market.code ? 'bg-main' : 'bg-primary'"
                    aria-hidden="true"
                  />
                  {{ market.name }}
                </button>
              </li>
            </ul>
          </div>

          <UiButton
            :to="whatsappUrl"
            variant="light"
            external
            class="shrink-0"
          >
            {{ t('nav.letsTalk') }}
          </UiButton>
        </div>
      </div>
    </div>
  </section>
</template>
