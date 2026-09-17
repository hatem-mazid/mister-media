<script setup lang="ts">
import Logo from '~/components/global/Logo.vue'

const { t } = useI18n()
const localePath = useLocalePath()
const { links: socialLinks } = useSocial()
const { featured } = useProjects()

const footerRef = useTemplateRef<HTMLElement>('footerRef')
const spacerHeight = ref(320)

const pageLinks = [
  { key: 'home', to: '/' },
  { key: 'projects', to: '/projects' },
  { key: 'services', to: '/services' },
  { key: 'about', to: '/about' },
] as const

const legalLinks = [
  { key: 'privacy', to: '/privacy' },
  { key: 'terms', to: '/terms' },
] as const

const projectLinks = computed(() => featured.value.slice(0, 5))

const brandParts = computed(() => {
  const parts = t('footer.brand').trim().split(/\s+/)
  if (parts.length < 2) return { start: t('footer.brand'), end: '' }

  return {
    start: parts[0],
    end: parts.slice(1).join(' '),
  }
})

const linkClass = 'font-paragraph text-sm text-lightest-bg/80 transition-colors hover:text-primary md:text-base focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary'

let observer: ResizeObserver | undefined

onMounted(() => {
  const el = footerRef.value
  if (!el) return

  const update = () => {
    spacerHeight.value = el.offsetHeight
  }

  update()
  observer = new ResizeObserver(update)
  observer.observe(el)
})

onBeforeUnmount(() => {
  observer?.disconnect()
})
</script>

<template>
  <div
    class="pointer-events-none"
    :style="{ height: `${spacerHeight}px` }"
    aria-hidden="true"
  />
  <footer
    ref="footerRef"
    class="fixed inset-x-0 bottom-0 z-1 overflow-hidden bg-main text-lightest-bg"
  >
    <div class="mx-auto flex min-h-[min(24rem,68vh)] max-w-360 flex-col justify-between gap-12 pt-10 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:gap-16 md:pt-14">
      <div class="grid grid-cols-2 gap-8 px-4 sm:px-6 md:grid-cols-4 md:gap-10 md:px-8">
        <nav
          class="flex flex-col items-start"
          :aria-label="t('footer.columns.pages')"
        >
          <p class="font-title text-xs font-semibold tracking-wide text-light-text uppercase md:text-sm">
            {{ t('footer.columns.pages') }}
          </p>
          <ul class="mt-4 flex flex-col gap-2.5">
            <li
              v-for="item in pageLinks"
              :key="item.key"
            >
              <NuxtLink
                :to="localePath(item.to)"
                :class="linkClass"
              >
                {{ t(`nav.links.${item.key}`) }}
              </NuxtLink>
            </li>
          </ul>
        </nav>

        <nav
          class="flex flex-col items-start"
          :aria-label="t('footer.columns.works')"
        >
          <p class="font-title text-xs font-semibold tracking-wide text-light-text uppercase md:text-sm">
            {{ t('footer.columns.works') }}
          </p>
          <ul class="mt-4 flex flex-col gap-2.5">
            <li
              v-for="project in projectLinks"
              :key="project.slug"
            >
              <NuxtLink
                :to="project.to"
                :class="linkClass"
              >
                {{ project.name }}
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                :to="localePath('/projects')"
                :class="linkClass"
              >
                {{ t('projects.viewAll') }}
              </NuxtLink>
            </li>
          </ul>
        </nav>

        <nav
          class="flex flex-col items-start"
          :aria-label="t('footer.columns.legal')"
        >
          <p class="font-title text-xs font-semibold tracking-wide text-light-text uppercase md:text-sm">
            {{ t('footer.columns.legal') }}
          </p>
          <ul class="mt-4 flex flex-col gap-2.5">
            <li
              v-for="item in legalLinks"
              :key="item.key"
            >
              <NuxtLink
                :to="localePath(item.to)"
                :class="linkClass"
              >
                {{ t(`footer.legal.${item.key}`) }}
              </NuxtLink>
            </li>
          </ul>
        </nav>

        <nav
          class="flex flex-col items-start"
          :aria-label="t('footer.socialLabel')"
        >
          <p class="font-title text-xs font-semibold tracking-wide text-light-text uppercase md:text-sm">
            {{ t('footer.socialLabel') }}
          </p>
          <ul class="mt-4 flex flex-wrap items-center gap-2">
            <li
              v-for="link in socialLinks"
              :key="link.key"
            >
              <a
                :href="link.href"
                target="_blank"
                rel="noopener noreferrer"
                :aria-label="link.label"
                class="flex size-10 items-center justify-center rounded-full bg-lightest-bg/10 text-lightest-bg transition-colors hover:bg-primary hover:text-main focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
              >
                <Icon
                  :name="link.icon"
                  class="size-4"
                />
              </a>
            </li>
          </ul>
        </nav>
      </div>

      <p
        class="flex items-end justify-center gap-[0.08em] px-3 font-title text-[clamp(1.85rem,8vw,7.5rem)] leading-none font-semibold tracking-tighter text-lightest-bg md:px-4"
        :aria-label="t('footer.brand')"
      >
        <span>{{ brandParts.start }}</span>
          <Logo
            mark
            class="h-[1.4em]"
          />
        <span>{{ brandParts.end }}</span>
      </p>
    </div>
  </footer>
</template>
