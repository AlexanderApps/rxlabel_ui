<template>
  <span :class="classes">
    <slot />
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  mode: {
    type: String,
    default: 'info',
    validator: (v) => ['info', 'success', 'warning', 'danger'].includes(v)
  }
})

const classes = computed(() => [
  'inline-flex items-center align-middle rounded-full px-1.5 py-1 text-xs/none font-medium',
  {
    info: 'bg-blue-100 text-blue-700 ring-1 ring-inset ring-blue-700/10 dark:bg-blue-900/30 dark:text-blue-400 dark:ring-blue-400/20',
    success:
      'bg-green-100 text-green-700 ring-1 ring-inset ring-green-700/10 dark:bg-green-900/30 dark:text-green-400 dark:ring-green-400/20',
    warning:
      'bg-yellow-100 text-yellow-700 ring-1 ring-inset ring-yellow-700/10 dark:bg-yellow-900/30 dark:text-yellow-400 dark:ring-yellow-400/20',
    danger:
      'bg-red-100 text-red-700 ring-1 ring-inset ring-red-700/10 dark:bg-red-900/30 dark:text-red-400 dark:ring-red-400/20'
  }[props.mode]
])
</script>
