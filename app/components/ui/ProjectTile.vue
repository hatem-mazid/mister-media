<script setup lang="ts">
const props = withDefaults(defineProps<{
  to: string
  name: string
  category: string
  categoryIcon: string
  categoryColor: string
  cover: string
  width: number
  height: number
  motionSrc?: string
  sizes?: string
  eager?: boolean
}>(), {
  sizes: 'sm:100vw md:50vw lg:50vw',
  eager: false,
})

const videoRef = useTemplateRef<HTMLVideoElement>('videoRef')
const hovering = ref(false)

const isVideo = computed(() =>
  Boolean(props.motionSrc && /\.(mp4|webm)(\?|$)/i.test(props.motionSrc)),
)

function enter() {
  hovering.value = true
  videoRef.value?.play().catch(() => undefined)
}

function leave() {
  hovering.value = false
  videoRef.value?.pause()
}
</script>

<template>
  <NuxtLink
    :to="to"
    class="group relative block h-full min-h-0 overflow-hidden rounded-3xl bg-light-bg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
    :aria-label="`${name}, ${category}`"
    data-project-tile
    @pointerenter="enter"
    @pointerleave="leave"
    @focusin="enter"
    @focusout="leave"
  >
    <NuxtImg
      :src="cover"
      :alt="name"
      :width="width"
      :height="height"
      :sizes="sizes"
      :loading="eager ? 'eager' : 'lazy'"
      class="absolute inset-0 size-full max-w-none object-cover transition-transform duration-300 ease-out motion-safe:group-hover:scale-110"
    />

    <NuxtImg
      v-if="motionSrc && !isVideo"
      :src="motionSrc"
      :alt="name"
      :width="width"
      :height="height"
      :sizes="sizes"
      loading="lazy"
      class="absolute inset-0 size-full max-w-none object-cover transition-opacity duration-300 ease-out"
      :class="hovering ? 'opacity-100' : 'opacity-0'"
    />

    <video
      v-if="motionSrc && isVideo"
      ref="videoRef"
      :src="motionSrc"
      muted
      loop
      playsinline
      preload="none"
      class="absolute inset-0 size-full object-cover transition-opacity duration-300 ease-out"
      :class="hovering ? 'opacity-100' : 'opacity-0'"
    />

    <div
      class="pointer-events-none absolute inset-0 bg-primary/75 opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100 group-focus-visible:opacity-100"
    />

    <div
      class="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100 group-focus-visible:opacity-100 md:gap-4 md:p-6"
    >
      <div class="min-w-0">
        <p class="font-title text-base font-semibold text-lightest-bg md:text-lg">
          {{ name }}
        </p>
        <UiCategoryPill
          class="mt-2"
          :label="category"
          :icon="categoryIcon"
          :color="categoryColor"
        />
      </div>
      <span
        class="flex size-10 shrink-0 origin-center items-center justify-center rounded-full bg-lightest-bg text-main transition-transform duration-300 ease-out motion-safe:group-hover:rotate-12 motion-safe:group-hover:scale-110"
        aria-hidden="true"
      >
        <Icon name="lucide:arrow-up-right" class="size-5" />
      </span>
    </div>
  </NuxtLink>
</template>
