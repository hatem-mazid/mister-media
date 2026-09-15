<script setup lang="ts">
defineProps<{
  label: string
  icon: string
  color: string
}>()
</script>

<template>
  <span class="inline-flex max-w-full items-center rounded-full bg-lightest-bg py-1 ps-1 pe-3">
    <span
      class="flex size-7 shrink-0 items-center justify-center rounded-full text-lightest-bg"
      :style="{ backgroundColor: color }"
      aria-hidden="true"
    >
      <Icon :name="icon" class="size-3.5" />
    </span>
    <span class="ms-2 truncate font-paragraph text-sm font-medium text-main">
      {{ label }}
    </span>
  </span>
</template>
