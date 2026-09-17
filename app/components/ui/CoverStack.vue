<script setup lang="ts">
const props = defineProps<{
  covers: Array<{
    src: string
    alt: string
    width: number
    height: number
  }>
  icon: string
  color: string
  label: string
}>()

const { localeProperties } = useI18n()

const rtl = computed(() => localeProperties.value.dir === 'rtl')

function cardStyle(index: number) {
  const dir = rtl.value ? -1 : 1
  const offset = index - (props.covers.length - 1) / 2
  const x = offset * 52 * dir
  const y = index * 14
  const rot = offset * 12 * dir

  return {
    transform: `translate3d(${x}px, ${y}px, ${-index * 48}px) rotateY(${rot}deg)`,
    zIndex: props.covers.length - index,
  }
}
</script>

<template>
  <div
    class="relative mx-auto aspect-4/5 w-full max-w-sm"
    style="perspective: 1100px"
    data-cover-stack
  >
    <div
      class="absolute inset-[8%] transform-3d"
      data-cover-stage
    >
      <template v-if="covers.length">
        <div
          v-for="(cover, index) in covers"
          :key="cover.src"
          class="absolute inset-0 origin-center overflow-hidden rounded-3xl bg-light-bg shadow-lg ring-1 ring-main/10 will-change-transform md:rounded-4xl"
          :style="cardStyle(index)"
          data-cover-card
        >
          <NuxtImg
            :src="cover.src"
            :alt="cover.alt"
            :width="cover.width"
            :height="cover.height"
            sizes="sm:70vw lg:28vw"
            :loading="index === 0 ? 'eager' : 'lazy'"
            class="size-full object-cover"
          />
        </div>
      </template>

      <div
        v-else
        class="absolute inset-0 flex items-center justify-center rounded-3xl bg-light-bg ring-1 ring-main/10 md:rounded-4xl"
        data-cover-card
      >
        <span
          class="flex size-24 items-center justify-center rounded-full text-lightest-bg md:size-28"
          :style="{ backgroundColor: color }"
          aria-hidden="true"
        >
          <Icon
            :name="icon"
            class="size-10 md:size-12"
          />
        </span>
        <span class="sr-only">{{ label }}</span>
      </div>
    </div>
  </div>
</template>
