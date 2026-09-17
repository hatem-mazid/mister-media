<script setup lang="ts">
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { VueLenis, useLenis } from 'lenis/vue'
import RouteCurtain from '~/components/global/RouteCurtain.vue'

const route = useRoute()
const nuxtApp = useNuxtApp()
const lenis = useLenis()

const lenisOptions = {
  autoRaf: false,
  anchors: true,
  autoToggle: true,
  stopInertiaOnNavigate: true,
}

if (import.meta.client) {
  gsap.registerPlugin(ScrollTrigger)
}

watchEffect((onInvalidate) => {
  const instance = lenis.value
  if (!instance) return

  instance.on('scroll', ScrollTrigger.update)

  function update(time: number) {
    instance?.raf(time * 1000)
  }

  gsap.ticker.add(update)
  gsap.ticker.lagSmoothing(0)

  onInvalidate(() => {
    instance.off('scroll', ScrollTrigger.update)
    gsap.ticker.remove(update)
  })
})

watch(() => route.path, () => {
  lenis.value?.scrollTo(0, { immediate: true })
})

nuxtApp.hook('page:finish', () => {
  requestAnimationFrame(() => {
    ScrollTrigger.refresh()
  })
})
</script>

<template>
  <VueLenis
    root
    :options="lenisOptions"
  />
  <NuxtRouteAnnouncer />
  <RouteCurtain />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
