<script setup lang="ts">
import gsap from 'gsap'

const props = withDefaults(defineProps<{
  to: string
  variant?: 'primary' | 'secondary' | 'text' | 'light'
  size?: 'md' | 'lg'
  wide?: boolean
  outline?: 'primary' | 'main'
  external?: boolean
  magnetic?: boolean
  magnetPad?: number
  magnetStrength?: number
}>(), {
  variant: 'primary',
  size: 'md',
  wide: false,
  outline: 'primary',
  external: false,
  magnetic: true,
  magnetPad: 25,
  magnetStrength: 0.38,
})

const homeRef = useTemplateRef<HTMLElement>('homeRef')
const magnetRef = useTemplateRef<HTMLElement>('magnetRef')
const iconRef = useTemplateRef<HTMLElement>('iconRef')

const variantClass = computed(() => {
  const display = props.wide ? 'flex w-full justify-between' : 'inline-flex'
  const focus = props.outline === 'main'
    ? 'focus-visible:outline-main'
    : 'focus-visible:outline-primary'
  const pillSize = props.size === 'lg'
    ? 'gap-5 py-3.5 ps-8 pe-3.5 text-2xl md:gap-8 md:py-5 md:ps-14 md:pe-5 md:text-5xl'
    : 'gap-3 py-1.5 ps-6 pe-1.5 text-base'

  return {
    primary: `${display} items-center ${pillSize} rounded-full bg-main font-title font-semibold text-lightest-bg transition-colors hover:bg-main/90 focus-visible:outline-2 focus-visible:outline-offset-4 ${focus}`,
    secondary: `${display} items-center rounded-full px-6 py-3.5 font-title text-base font-semibold text-main ring-1 ring-main/15 transition-colors hover:bg-main/5 focus-visible:outline-2 focus-visible:outline-offset-4 ${focus}`,
    text: `${display} items-center font-title text-base font-semibold text-main md:text-xl focus-visible:outline-2 focus-visible:outline-offset-4 ${focus}`,
    light: `${display} items-center ${pillSize} rounded-full bg-lightest-bg font-title font-semibold text-main transition-colors hover:bg-lightest-bg/90 focus-visible:outline-2 focus-visible:outline-offset-4 ${focus}`,
  }
})

const iconWrapClass = computed(() =>
  props.size === 'lg'
    ? 'size-16 md:size-24'
    : 'size-10',
)

const iconClass = computed(() =>
  props.size === 'lg'
    ? 'size-7 md:size-10'
    : 'size-5',
)

let pulling = false

function shouldAnimate() {
  return window.matchMedia('(hover: hover) and (pointer: fine)').matches
    && !window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function moveMagnet(x: number, y: number, releasing = false) {
  const el = magnetRef.value
  if (!el) return

  gsap.to(el, {
    x,
    y,
    duration: releasing ? 0.55 : 0.4,
    ease: releasing ? 'back.out(1.8)' : 'power3.out',
    overwrite: 'auto',
  })
}

function onMove(event: MouseEvent | PointerEvent) {
  const home = homeRef.value
  if (!home || !magnetRef.value || !props.magnetic) return
  if (!shouldAnimate()) return

  const rect = home.getBoundingClientRect()
  const dx = event.clientX - (rect.left + rect.width / 2)
  const dy = event.clientY - (rect.top + rect.height / 2)
  const dist = Math.hypot(dx, dy)
  const range = Math.max(rect.width, rect.height) / 2 + props.magnetPad

  if (dist < range) {
    pulling = true
    const pull = (1 - dist / range) * props.magnetStrength
    moveMagnet(dx * pull, dy * pull)
    return
  }

  if (!pulling) return
  pulling = false
  moveMagnet(0, 0, true)
}

function enter() {
  if (!shouldAnimate() || !magnetRef.value) return

  if (!props.wide) {
    gsap.to(magnetRef.value, {
      scale: 1.06,
      duration: 0.45,
      ease: 'back.out(2.4)',
      overwrite: false,
    })
  }

  if (iconRef.value) {
    gsap.to(iconRef.value, {
      rotate: 18,
      scale: 1.1,
      duration: 0.45,
      ease: 'back.out(2.4)',
      overwrite: false,
    })
  }
}

function leave() {
  if (!magnetRef.value) return

  gsap.to(magnetRef.value, {
    scale: 1,
    duration: 0.28,
    ease: 'power3.out',
    overwrite: false,
  })

  if (iconRef.value) {
    gsap.to(iconRef.value, {
      rotate: 0,
      scale: 1,
      duration: 0.28,
      ease: 'power3.out',
      overwrite: false,
    })
  }
}

onMounted(() => {
  if (!props.magnetic) return
  document.addEventListener('pointermove', onMove, { passive: true })
})

onBeforeUnmount(() => {
  document.removeEventListener('pointermove', onMove)
  if (magnetRef.value) gsap.killTweensOf(magnetRef.value)
  if (iconRef.value) gsap.killTweensOf(iconRef.value)
})
</script>

<template>
  <span
    ref="homeRef"
    :class="wide ? 'flex w-full' : 'inline-flex'"
  >
    <span
      ref="magnetRef"
      :class="[
        'origin-center will-change-transform',
        wide ? 'flex w-full' : 'inline-flex',
      ]"
      @pointerenter="enter"
      @pointerleave="leave"
    >
      <NuxtLink
        :to="to"
        :target="external ? '_blank' : undefined"
        :rel="external ? 'noopener noreferrer' : undefined"
        :class="variantClass[variant]"
      >
        <span class="min-w-0">
          <slot />
        </span>
        <span
          v-if="variant === 'primary' || variant === 'light'"
          ref="iconRef"
          :class="[
            'flex origin-center items-center justify-center rounded-full bg-primary text-main',
            iconWrapClass,
          ]"
          aria-hidden="true"
        >
          <Icon
            name="lucide:arrow-up-right"
            :class="iconClass"
          />
        </span>
      </NuxtLink>
    </span>
  </span>
</template>
