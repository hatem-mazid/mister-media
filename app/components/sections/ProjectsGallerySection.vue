<script setup lang="ts">
import gsap from 'gsap'
import { Flip } from 'gsap/Flip'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const { projects } = useProjects()
const { services } = useServices()

const sectionRef = useTemplateRef<HTMLElement>('sectionRef')
const wallRef = useTemplateRef<HTMLElement>('wallRef')
const listRef = useTemplateRef<HTMLElement>('listRef')
const previewRef = useTemplateRef<HTMLElement>('previewRef')

const view = ref<'wall' | 'index'>('wall')
const activePreview = ref('')

const filters = computed(() => {
  const counts = new Map<string, number>()
  for (const project of projects.value) {
    counts.set(project.service, (counts.get(project.service) ?? 0) + 1)
  }

  return services.value
    .filter(service => counts.has(service.slug))
    .map(service => ({ ...service, count: counts.get(service.slug) ?? 0 }))
})

// The filter lives in the URL so a filtered wall can be linked and shared.
const activeService = computed(() => {
  const query = route.query.service
  const slug = Array.isArray(query) ? query[0] : query
  const known = filters.value.some(filter => filter.slug === slug)
  return known && typeof slug === 'string' ? slug : 'all'
})

const filtered = computed(() =>
  activeService.value === 'all'
    ? projects.value
    : projects.value.filter(project => project.service === activeService.value),
)

// Every tile stays mounted; a project that drops out of the filter is hidden so
// Flip can treat it as a leaving element instead of an unmount.
const visible = computed(() => new Set(filtered.value.map(project => project.slug)))

function reduced() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function fine() {
  return window.matchMedia('(hover: hover) and (pointer: fine)').matches
}

let flip: gsap.core.Timeline | undefined
let heightTween: gsap.core.Tween | undefined

function releaseWall(wall: HTMLElement) {
  heightTween?.kill()
  gsap.set(wall, { clearProps: 'height,overflow' })
}

async function setService(slug: string) {
  if (slug === activeService.value) return

  const wall = wallRef.value
  const animate = Boolean(wall) && view.value === 'wall' && !reduced()
  const fromHeight = wall?.offsetHeight ?? 0
  const state = animate && wall
    ? Flip.getState(wall.querySelectorAll('[data-wall-tile]'))
    : undefined

  await router.replace({
    query: slug === 'all' ? {} : { service: slug },
  })
  await nextTick()

  if (!state || !wall) {
    ScrollTrigger.refresh()
    return
  }

  // Flip's absolute tiles leave the flow, which would collapse this grid and
  // flash the contact band below. Hold the outgoing height, then ease to the new one.
  flip?.kill()
  releaseWall(wall)

  const toHeight = wall.offsetHeight
  gsap.set(wall, { height: fromHeight, overflow: 'hidden' })

  heightTween = gsap.to(wall, {
    height: toHeight,
    duration: 0.55,
    ease: 'power3.out',
  })

  flip = Flip.from(state, {
    duration: 0.55,
    ease: 'power3.out',
    absoluteOnLeave: true,
    stagger: 0.02,
    onEnter: elements => gsap.fromTo(
      elements,
      { scale: 0.96 },
      { scale: 1, duration: 0.4, ease: 'power2.out' },
    ),
    onLeave: elements => gsap.to(elements, {
      opacity: 0,
      scale: 0.92,
      duration: 0.3,
      ease: 'power2.in',
    }),
    onComplete: () => {
      releaseWall(wall)
      ScrollTrigger.refresh()
    },
    onInterrupt: () => releaseWall(wall),
  })
}

async function setView(next: 'wall' | 'index') {
  if (next === view.value) return

  view.value = next
  activePreview.value = ''
  moveX = undefined
  moveY = undefined
  await nextTick()

  const target = next === 'wall' ? wallRef.value : listRef.value
  if (target && !reduced()) {
    gsap.from(target.children, {
      y: 24,
      autoAlpha: 0,
      duration: 0.45,
      ease: 'power3.out',
      stagger: 0.03,
    })
  }

  ScrollTrigger.refresh()
}

let moveX: ((value: number) => void) | undefined
let moveY: ((value: number) => void) | undefined

// The preview only exists while the index view is mounted, so its follow tweens
// are built on first use and dropped again whenever the view is swapped.
function initPreview() {
  const preview = previewRef.value
  if (!preview) return undefined

  if (!moveX || !moveY) {
    gsap.set(preview, { autoAlpha: 0, scale: 0.9, xPercent: 15, yPercent: -50 })
    moveX = gsap.quickTo(preview, 'x', { duration: 0.4, ease: 'power3' })
    moveY = gsap.quickTo(preview, 'y', { duration: 0.4, ease: 'power3' })
  }

  return preview
}

function trackPointer(event: PointerEvent) {
  if (!initPreview()) return
  moveX?.(event.clientX)
  moveY?.(event.clientY)
}

function showPreview(slug: string, event: PointerEvent | FocusEvent) {
  if (!fine() || reduced()) return

  const preview = initPreview()
  if (!preview) return

  const entering = !activePreview.value
  activePreview.value = slug

  if (event instanceof PointerEvent) {
    // Snap to the cursor on the first row rather than gliding in from the corner.
    if (entering) gsap.set(preview, { x: event.clientX, y: event.clientY })
    else trackPointer(event)
  }

  gsap.to(preview, {
    autoAlpha: 1,
    scale: 1,
    duration: 0.28,
    ease: 'power3.out',
  })
}

function hidePreview() {
  activePreview.value = ''
  if (previewRef.value) {
    gsap.to(previewRef.value, {
      autoAlpha: 0,
      scale: 0.9,
      duration: 0.2,
      ease: 'power2.in',
    })
  }
}

let ctx: gsap.Context | undefined

onMounted(() => {
  gsap.registerPlugin(Flip, ScrollTrigger)

  if (reduced()) return

  const section = sectionRef.value
  if (!section) return

  ctx = gsap.context(() => {
    gsap.from('[data-gallery-animate]', {
      y: 40,
      autoAlpha: 0,
      duration: 0.5,
      ease: 'power3.out',
      stagger: 0.05,
      scrollTrigger: {
        trigger: section,
        start: 'top 85%',
        once: true,
      },
    })
  }, section)
})

onBeforeUnmount(() => {
  flip?.kill()
  heightTween?.kill()
  ctx?.revert()
})
</script>

<template>
  <section
    ref="sectionRef"
    id="works"
    aria-labelledby="works-heading"
    class="scroll-mt-28 bg-light-bg px-4 py-12 sm:px-6 md:px-8 md:py-16"
  >
    <div class="mx-auto max-w-360">
      <h2
        id="works-heading"
        class="sr-only"
      >
        {{ t('projectsPage.headline') }}
      </h2>

      <div
        class="mb-8 flex flex-col gap-6 md:mb-12 lg:flex-row lg:items-end lg:justify-between lg:gap-10"
        data-gallery-animate
      >
        <div class="min-w-0">
          <p class="font-title text-xs font-semibold tracking-[0.2em] text-main/50 uppercase">
            {{ t('projectsPage.filterLabel') }}
          </p>

          <!-- Scrolls sideways on phones so the wall is not pushed off-screen. -->
          <div
            class="mt-4 flex gap-2 overflow-x-auto pb-2 md:flex-wrap md:overflow-x-visible md:pb-0"
            role="group"
            :aria-label="t('projectsPage.filterLabel')"
          >
            <button
              type="button"
              class="inline-flex shrink-0 items-center gap-2 rounded-full py-1.5 ps-4 pe-3 font-paragraph text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-main"
              :class="activeService === 'all'
                ? 'bg-main text-lightest-bg'
                : 'bg-lightest-bg text-main hover:bg-lightest-bg/60'"
              :aria-pressed="activeService === 'all'"
              @click="setService('all')"
            >
              {{ t('projectsPage.all') }}
              <span class="font-title text-xs tabular-nums opacity-60">{{ projects.length }}</span>
            </button>

            <button
              v-for="filter in filters"
              :key="filter.slug"
              type="button"
              class="inline-flex shrink-0 items-center gap-2 rounded-full py-1 ps-1 pe-3 font-paragraph text-sm font-medium whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-main"
              :class="activeService === filter.slug
                ? 'bg-main text-lightest-bg'
                : 'bg-lightest-bg text-main hover:bg-lightest-bg/60'"
              :aria-pressed="activeService === filter.slug"
              @click="setService(filter.slug)"
            >
              <span
                class="flex size-7 shrink-0 items-center justify-center rounded-full text-lightest-bg"
                :style="{ backgroundColor: filter.color }"
                aria-hidden="true"
              >
                <Icon
                  :name="filter.icon"
                  class="size-3.5"
                />
              </span>
              {{ filter.name }}
              <span class="font-title text-xs tabular-nums opacity-60">{{ filter.count }}</span>
            </button>
          </div>
        </div>

        <div class="flex shrink-0 items-center gap-4">
          <p class="font-paragraph text-sm text-main/60">
            <span class="font-title font-semibold text-main tabular-nums">{{ filtered.length }}</span>
            {{ t('projectsPage.projectCount', filtered.length) }}
          </p>

          <div
            class="flex items-center gap-1 rounded-full bg-lightest-bg p-1"
            role="group"
            :aria-label="t('projectsPage.viewLabel')"
          >
            <button
              v-for="option in [
                { key: 'wall', icon: 'lucide:layout-grid' },
                { key: 'index', icon: 'lucide:list' },
              ] as const"
              :key="option.key"
              type="button"
              class="inline-flex items-center gap-2 rounded-full px-3 py-1.5 font-paragraph text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-main"
              :class="view === option.key
                ? 'bg-main text-lightest-bg'
                : 'text-main hover:bg-main/5'"
              :aria-pressed="view === option.key"
              @click="setView(option.key)"
            >
              <Icon
                :name="option.icon"
                class="size-4"
                aria-hidden="true"
              />
              <span class="sr-only sm:not-sr-only">{{ t(`projectsPage.views.${option.key}`) }}</span>
            </button>
          </div>
        </div>
      </div>

      <div
        v-if="view === 'wall'"
        ref="wallRef"
        class="grid min-h-64 grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6"
      >
        <div
          v-for="project in projects"
          :key="project.slug"
          :class="{ hidden: !visible.has(project.slug) }"
          data-wall-tile
          data-gallery-animate
        >
          <UiProjectTile
            :to="project.to"
            :name="project.name"
            :category="project.serviceName"
            :category-icon="project.serviceIcon"
            :category-color="project.serviceColor"
            :cover="project.cover"
            :width="project.width"
            :height="project.height"
            :motion-src="project.motionSrc"
            eager
          />
        </div>
      </div>

      <div v-else>
        <div class="flex items-center justify-between gap-4 pb-3 font-title text-xs font-semibold tracking-[0.2em] text-main/50 uppercase">
          <span>{{ t('projectsPage.columns.project') }}</span>
          <span class="hidden md:inline">{{ t('projectsPage.columns.service') }}</span>
        </div>

        <ul
          ref="listRef"
          @pointermove="trackPointer"
          @pointerleave="hidePreview"
        >
          <li
            v-for="(project, index) in filtered"
            :key="project.slug"
          >
            <NuxtLink
              :to="project.to"
              class="group flex items-center gap-4 border-t border-main/15 py-5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-main md:gap-8 md:py-7"
              @pointerenter="showPreview(project.slug, $event)"
              @focusin="showPreview(project.slug, $event)"
              @focusout="hidePreview"
            >
              <span
                class="w-10 shrink-0 font-title text-2xl leading-none font-light text-transparent tabular-nums [-webkit-text-stroke:1px_var(--color-main)] opacity-40 transition-opacity group-hover:opacity-100 md:w-14 md:text-4xl"
                aria-hidden="true"
              >
                {{ String(index + 1).padStart(2, '0') }}
              </span>

              <span class="min-w-0 flex-1 font-title text-xl font-semibold text-main transition-[color,transform] duration-300 ease-out group-hover:text-primary md:text-3xl motion-safe:group-hover:translate-x-2 rtl:motion-safe:group-hover:-translate-x-2">
                {{ project.name }}
              </span>

              <span class="hidden shrink-0 md:block">
                <UiCategoryPill
                  :label="project.serviceName"
                  :icon="project.serviceIcon"
                  :color="project.serviceColor"
                />
              </span>

              <span
                class="flex size-9 shrink-0 origin-center items-center justify-center rounded-full bg-lightest-bg text-main transition-transform duration-300 ease-out md:size-11 motion-safe:group-hover:rotate-12 motion-safe:group-hover:scale-110"
                aria-hidden="true"
              >
                <Icon
                  name="lucide:arrow-up-right"
                  class="size-4 md:size-5"
                />
              </span>
            </NuxtLink>
          </li>
        </ul>

        <div class="border-t border-main/15" />

        <div
          ref="previewRef"
          class="pointer-events-none fixed top-0 left-0 z-30 hidden w-64 overflow-hidden rounded-2xl bg-light-bg ring-1 ring-main/10 lg:block"
          aria-hidden="true"
        >
          <div class="relative aspect-4/3">
            <NuxtImg
              v-for="project in filtered"
              :key="project.slug"
              :src="project.cover"
              alt=""
              width="512"
              height="384"
              sizes="256px"
              loading="lazy"
              class="absolute inset-0 size-full object-cover transition-opacity duration-200 ease-out"
              :class="activePreview === project.slug ? 'opacity-100' : 'opacity-0'"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
