<template>
  <span
    ref="containerRef"
    class="marquee"
    :dir="reverse ? 'rtl' : undefined"
  >
    <span v-if="!decorative" class="sr-only">
      <slot />
    </span>
    <span
      ref="sourceRef"
      class="marquee-source"
      aria-hidden="true"
    ><slot /><span v-if="separator" class="marquee-separator">{{ separator }}</span></span>
    <span ref="trackRef" class="marquee-track" aria-hidden="true" />
  </span>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  duration?: number
  separator?: string
  reverse?: boolean
  decorative?: boolean
}>(), {
  duration: 40,
  separator: '●',
  reverse: false,
  decorative: false,
})

const containerRef = useTemplateRef<HTMLElement>('containerRef')
const sourceRef = useTemplateRef<HTMLElement>('sourceRef')
const trackRef = useTemplateRef<HTMLElement>('trackRef')

let offset = 0
let rafId = 0
let lastTime = 0
let running = false
let setupId = 0
let lastContainerWidth = 0
let resizeObserver: ResizeObserver | undefined

function isRtl() {
  return !!containerRef.value && getComputedStyle(containerRef.value).direction === 'rtl'
}

function applyTransform() {
  if (trackRef.value) {
    trackRef.value.style.transform = `translate3d(${offset}px, 0, 0)`
  }
}

function makeSegment() {
  const source = sourceRef.value
  if (!source) return null

  const clone = source.cloneNode(true) as HTMLElement
  clone.classList.remove('marquee-source')
  clone.classList.add('marquee-segment')
  clone.setAttribute('aria-hidden', 'true')
  return clone
}

function fillTrack() {
  const container = containerRef.value
  const track = trackRef.value
  const source = sourceRef.value
  if (!container || !track || !source) return

  const segmentWidth = source.offsetWidth
  if (!segmentWidth) return

  track.replaceChildren()
  const needed = Math.max(2, Math.ceil(container.offsetWidth / segmentWidth) + 2)
  for (let i = 0; i < needed; i++) {
    const segment = makeSegment()
    if (segment) track.appendChild(segment)
  }
}

function recycle() {
  const container = containerRef.value
  const track = trackRef.value
  if (!container || !track) return

  const containerBox = container.getBoundingClientRect()
  const rtl = isRtl()

  while (track.firstElementChild) {
    const first = track.firstElementChild as HTMLElement
    const box = first.getBoundingClientRect()
    const finished = rtl
      ? box.left > containerBox.right
      : box.right < containerBox.left

    if (!finished) break

    const width = box.width
    if (!width) break

    first.remove()
    const next = makeSegment()
    if (!next) break
    track.appendChild(next)
    offset += rtl ? -width : width
    applyTransform()
  }
}

function tick(now: number) {
  if (!running) return

  const track = trackRef.value
  const source = sourceRef.value
  if (!track?.firstElementChild || !source?.offsetWidth) {
    rafId = requestAnimationFrame(tick)
    return
  }

  if (!lastTime) lastTime = now
  const dt = Math.min((now - lastTime) / 1000, 0.05)
  lastTime = now

  const speed = source.offsetWidth / props.duration
  offset += (isRtl() ? speed : -speed) * dt
  applyTransform()
  recycle()

  rafId = requestAnimationFrame(tick)
}

function stop() {
  running = false
  lastTime = 0
  if (rafId) cancelAnimationFrame(rafId)
  rafId = 0
}

function start() {
  stop()
  offset = 0
  applyTransform()

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  running = true
  rafId = requestAnimationFrame(tick)
}

async function setup() {
  const id = ++setupId
  stop()
  await nextTick()
  if (document.fonts?.ready) await document.fonts.ready
  if (id !== setupId) return
  fillTrack()
  start()
}

function onResize() {
  const width = containerRef.value?.offsetWidth ?? 0
  if (Math.abs(width - lastContainerWidth) < 1) return
  lastContainerWidth = width
  setup()
}

onMounted(() => {
  const container = containerRef.value
  if (container) {
    resizeObserver = new ResizeObserver(onResize)
    resizeObserver.observe(container)
  }
  setup()
})

onBeforeUnmount(() => {
  stop()
  resizeObserver?.disconnect()
})
</script>

<style scoped>
.marquee {
  display: block;
  overflow: hidden;
  position: relative;
}

.marquee-source {
  position: absolute;
  visibility: hidden;
  pointer-events: none;
}

.marquee-track {
  display: flex;
  width: max-content;
  will-change: transform;
}

.marquee-source,
.marquee-segment {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  white-space: nowrap;
}

.marquee-separator {
  margin-inline: 0.5em;
}
</style>
