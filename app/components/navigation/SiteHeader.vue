<script setup lang="ts">
import gsap from 'gsap'
import { useLenis } from 'lenis/vue'
import Logo from '~/components/global/Logo.vue'

const { t, locale, locales } = useI18n()
const lenis = useLenis()
const localePath = useLocalePath()
const switchLocalePath = useSwitchLocalePath()
const route = useRoute()
const config = useRuntimeConfig()

const open = ref(false)
const menuId = 'site-menu'
const menuRef = useTemplateRef<HTMLElement>('menuRef')

const navItems = [
  { key: 'home', to: '/' },
  { key: 'projects', to: '/projects' },
  { key: 'services', to: '/services' },
  { key: 'about', to: '/about' },
] as const

const otherLocales = computed(() =>
  locales.value.flatMap((item) => {
    if (typeof item === 'string' || item.code === locale.value) return []
    return [{ code: item.code, name: item.name ?? item.code }]
  }),
)

const whatsappUrl = computed(() =>
  String(config.public.whatsappUrl || 'https://wa.me/'),
)

const letsTalkParts = computed(() => {
  const text = t('nav.letsTalk')
  const index = text.indexOf("'")
  if (index === -1) return [{ value: text, accent: false }]

  return [
    { value: text.slice(0, index), accent: false },
    { value: "'", accent: true },
    { value: text.slice(index + 1), accent: false },
  ]
})

function isActive(to: string) {
  const localized = localePath(to)
  if (to === '/') return route.path === localized
  return route.path === localized || route.path.startsWith(`${localized}/`)
}

function close() {
  open.value = false
}

function toggle() {
  open.value = !open.value
}

watch(() => route.fullPath, close)

watch(open, async (isOpen) => {
  if (!import.meta.client) return

  document.documentElement.classList.toggle('overflow-hidden', isOpen)
  if (isOpen) lenis.value?.stop()
  else lenis.value?.start()

  if (!isOpen) return

  await nextTick()
  const items = menuRef.value?.querySelectorAll('[data-menu-item]')
  if (!items?.length) return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  gsap.from(items, {
    y: 28,
    opacity: 0,
    duration: 0.4,
    stagger: 0.07,
    ease: 'power3.out',
  })
})

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') close()
}

onMounted(() => {
  window.addEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
  document.documentElement.classList.remove('overflow-hidden')
  lenis.value?.start()
})
</script>

<template>
  <header class="pointer-events-none fixed inset-x-4 top-4 z-[1001] md:inset-x-6 md:top-5 lg:inset-x-8">
    <div class="pointer-events-auto flex items-center justify-between rounded-2xl bg-lightest-bg/65 px-5 py-3 shadow-sm ring-1 ring-main/5 backdrop-blur-xl md:rounded-3xl md:px-6 md:py-3.5">
      <NuxtLink
        :to="localePath('/')"
        :aria-label="t('nav.logoAlt')"
        class="relative z-10 shrink-0 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
      >
        <Logo />
      </NuxtLink>

      <div class="relative z-10 flex items-center gap-3 md:gap-4">
        <UiButton :to="whatsappUrl" variant="text" external :magnetic="false">
          <span v-for="(part, index) in letsTalkParts" :key="index" :class="part.accent && 'text-primary'">{{ part.value }}</span>
        </UiButton>

        <button
          type="button"
          class="group flex size-11 cursor-pointer items-center justify-center rounded-full bg-main text-lightest-bg transition-colors hover:bg-main/90 md:size-12 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          :aria-expanded="open"
          :aria-controls="menuId"
          :aria-label="open ? t('nav.closeMenu') : t('nav.openMenu')"
          @click="toggle"
        >
          <span class="flex w-5 flex-col items-end justify-center gap-1" aria-hidden="true">
            <span
              class="block h-0.5 origin-center bg-current transition-[width,transform,opacity] duration-200 motion-reduce:transition-none"
              :class="open ? 'w-5 translate-y-1.5 rotate-45' : 'w-3.5 group-hover:w-5'"
            />
            <span
              class="block h-0.5 origin-center bg-current transition-[width,transform,opacity] duration-200 motion-reduce:transition-none"
              :class="open ? 'w-5 opacity-0' : 'w-2.5 group-hover:w-5'"
            />
            <span
              class="block h-0.5 origin-center bg-current transition-[width,transform,opacity] duration-200 motion-reduce:transition-none"
              :class="open ? 'w-5 -translate-y-1.5 -rotate-45' : 'w-5'"
            />
          </span>
        </button>
      </div>
    </div>
  </header>

  <Teleport to="body">
    <div
      v-if="open"
      :id="menuId"
      ref="menuRef"
      class="fixed inset-0 z-[1000] bg-lightest-bg"
      data-lenis-prevent
      role="dialog"
      aria-modal="true"
      :aria-label="t('nav.menuLabel')"
    >
      <nav class="flex h-full flex-col items-center justify-center gap-8 px-6 pb-16 md:gap-10">
        <ul class="flex flex-col items-center gap-5 md:gap-7">
          <li v-for="item in navItems" :key="item.key" data-menu-item>
            <NuxtLink
              :to="localePath(item.to)"
              class="font-title text-4xl font-semibold text-main transition-colors hover:text-primary md:text-6xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
              :class="isActive(item.to) && 'text-primary'"
              @click="close"
            >
              {{ t(`nav.links.${item.key}`) }}
            </NuxtLink>
          </li>
        </ul>

        <div class="flex items-center gap-4 font-paragraph text-sm text-light-text md:text-base">
          <NuxtLink
            v-for="item in otherLocales"
            :key="item.code"
            data-menu-item
            :to="switchLocalePath(item.code)"
            class="text-main underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
          >
            {{ item.name }}
          </NuxtLink>
        </div>
      </nav>
    </div>
  </Teleport>
</template>
