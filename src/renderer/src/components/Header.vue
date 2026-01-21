<script setup>
defineProps({
  title: { type: String, required: true },
  badgeLabel: { type: String, default: null },
  badgeMode: {
    type: String,
    default: 'info' // "info" | "success" | "warning" | "danger"
  }
})
</script>

<template>
  <header
    class="flex h-14 w-full border-b border-gray-300/60 dark:border-gray-800/60 shadow-xs items-center px-5 dark:bg-gray-900"
  >
    <!-- LEFT -->
    <div class="flex flex-1 gap-2 items-center">
      <span class="text-lg font-bold">{{ title }}</span>

      <span
        v-if="badgeLabel"
        :class="[
          badgeMode === 'info' &&
            'bg-blue-100 text-blue-700 ring-1 ring-inset ring-blue-700/10 dark:bg-blue-900/30 dark:text-blue-400 dark:ring-blue-400/20',
          badgeMode === 'success' &&
            'bg-green-100 text-green-700 ring-1 ring-inset ring-green-700/10 dark:bg-green-900/30 dark:text-green-400 dark:ring-green-400/20',
          badgeMode === 'warning' &&
            'bg-yellow-100 text-yellow-700 ring-1 ring-inset ring-yellow-700/10 dark:bg-yellow-900/30 dark:text-yellow-400 dark:ring-yellow-400/20',
          badgeMode === 'danger' &&
            'bg-red-100 text-red-700 ring-1 ring-inset ring-red-700/10 dark:bg-red-900/30 dark:text-red-400 dark:ring-red-400/20',
          'inline-flex items-center align-middle rounded-full px-1.5 py-1 text-xs/none font-medium'
        ]"
      >
        {{ badgeLabel }}
      </span>
    </div>

    <!-- RIGHT ACTIONS -->
    <div class="flex gap-2">
      <slot name="actions" />
    </div>
  </header>
</template>
