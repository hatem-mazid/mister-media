<script setup lang="ts">
withDefaults(defineProps<{
  title: string
  handwritten: string
  echo?: string
  as?: 'h1' | 'h2' | 'h3'
  id?: string
}>(), {
  as: 'h2',
})
</script>

<template>
  <component
    :is="as"
    :id="id"
    :aria-label="`${title} ${handwritten}`"
    class="relative inline-block max-w-full pb-[0.08em] font-title text-[clamp(1.875rem,4.2vw,3.5rem)] leading-none font-semibold tracking-tight text-main"
  >
    <span
      v-if="echo"
      class="pointer-events-none absolute top-1/2 left-1/2 z-0 w-[135%] -translate-x-1/2 -translate-y-1/2 text-center text-[1.12em] font-light text-transparent uppercase opacity-35 [-webkit-text-stroke:1px_var(--color-light-text)]"
      aria-hidden="true"
    >
      {{ echo }}
    </span>
    <span class="relative z-10 uppercase">{{ title }}</span>
    <span
      class="pointer-events-none absolute inset-e-0 bottom-0 z-20 origin-bottom translate-y-[50%] -rotate-3 font-handwritten text-[0.9em] font-normal normal-case leading-none text-primary rtl:rotate-3"
    >
      {{ handwritten }}
    </span>
  </component>
</template>
