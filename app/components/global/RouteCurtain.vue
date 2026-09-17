<script setup lang="ts">
import gsap from 'gsap'
import { useLenis } from 'lenis/vue'
import type { RouteLocationNormalized } from 'vue-router'

const overlayRef = useTemplateRef<HTMLElement>('overlayRef')
const accentRef = useTemplateRef<HTMLElement>('accentRef')
const panelRef = useTemplateRef<HTMLElement>('panelRef')

const router = useRouter()
const nuxtApp = useNuxtApp()
const lenis = useLenis()

type Phase = 'idle' | 'covering' | 'covered' | 'revealing'

let phase: Phase = 'idle'
let timeline: gsap.core.Timeline | null = null

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function shouldAnimate(to: RouteLocationNormalized, from: RouteLocationNormalized) {
  if (!from.matched.length) return false
  if (to.path === from.path) return false
  if (prefersReducedMotion()) return false
  return true
}

function layers() {
  const accent = accentRef.value
  const panel = panelRef.value
  if (!accent || !panel) return null
  return { accent, panel }
}

function resetLayers() {
  const els = layers()
  if (!els) return
  gsap.set([els.accent, els.panel], { yPercent: 100, opacity: 1 })
}

function lock() {
  overlayRef.value?.classList.remove('pointer-events-none')
  document.documentElement.classList.add('overflow-hidden')
  lenis.value?.stop()
}

function unlock() {
  overlayRef.value?.classList.add('pointer-events-none')
  document.documentElement.classList.remove('overflow-hidden')
  lenis.value?.start()
}

function abort() {
  timeline?.kill()
  timeline = null
  phase = 'idle'
  resetLayers()
  unlock()
}

function waitFor(tl: gsap.core.Timeline) {
  return new Promise<void>((resolve) => {
    tl.eventCallback('onComplete', () => resolve())
  })
}

function cover() {
  const els = layers()
  if (!els) return Promise.resolve()

  lock()
  timeline?.kill()
  timeline = gsap.timeline()
  timeline.set([els.accent, els.panel], { yPercent: 100, opacity: 1 })
  timeline.to(els.accent, { yPercent: 0, duration: 0.38, ease: 'power4.in' }, 0)
  timeline.to(els.panel, { yPercent: 0, duration: 0.4, ease: 'power4.in' }, 0.07)
  return waitFor(timeline)
}

function reveal() {
  const els = layers()
  if (!els) {
    unlock()
    return Promise.resolve()
  }

  timeline?.kill()
  timeline = gsap.timeline()
  timeline.to(els.panel, { yPercent: -100, duration: 1.2, ease: 'power3.out' }, 0)
  timeline.to(els.accent, { yPercent: -100, duration: 1.2, ease: 'power3.out' }, 0.06)
  return waitFor(timeline).then(() => {
    resetLayers()
    unlock()
  })
}

function holdCover() {
  timeline?.kill()
  timeline = null
  const els = layers()
  if (els) gsap.set([els.accent, els.panel], { yPercent: 0, opacity: 1 })
  lock()
  phase = 'covered'
}

async function finish() {
  if (phase !== 'covered') return

  phase = 'revealing'
  lenis.value?.scrollTo(0, { immediate: true })
  await reveal()
  if (phase === 'revealing') phase = 'idle'
}

onMounted(() => {
  resetLayers()

  const stopGuard = router.beforeEach(async (to, from) => {
    if (!shouldAnimate(to, from)) return

    if (phase === 'covering' || phase === 'covered') return

    if (phase === 'revealing') {
      holdCover()
      return
    }

    phase = 'covering'
    await cover()
    if (phase === 'covering') phase = 'covered'
  })

  const stopError = router.onError(() => {
    abort()
  })

  const stopFinish = nuxtApp.hook('page:finish', () => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        void finish()
      })
    })
  })

  onBeforeUnmount(() => {
    stopGuard()
    stopError()
    stopFinish()
    abort()
  })
})
</script>

<template>
  <div
    ref="overlayRef"
    data-page-transition
    class="pointer-events-none fixed inset-0 z-1100 overflow-hidden"
    aria-hidden="true"
  >
    <div
      ref="accentRef"
      class="absolute inset-0 bg-primary opacity-0"
    />
    <div
      ref="panelRef"
      class="absolute inset-0 bg-main opacity-0"
    />
  </div>
</template>

<style scoped>
[data-page-transition] {
  isolation: isolate;
}
</style>
