<template>
  <section
    class="rounded-lg border border-gray-200/60 dark:border-gray-700 bg-white dark:bg-gray-900"
  >
    <!-- Header -->
    <div class="px-4 py-3 border-b border-gray-200/60 dark:border-gray-700">
      <h3 class="text-sm font-semibold text-gray-800 dark:text-gray-200">
        {{ title }}
      </h3>
    </div>

    <!-- Shortcuts -->
    <ul class="divide-y divide-gray-200/60 dark:divide-gray-700">
      <li
        v-for="(shortcut, i) in shortcuts"
        :key="i"
        class="flex items-center justify-between px-4 py-3"
      >
        <!-- Action -->
        <span class="text-sm text-gray-700 dark:text-gray-300">
          {{ shortcut.action }}
        </span>

        <!-- Keys -->
        <div class="flex items-center gap-1">
          <template v-for="(key, k) in shortcut.keys" :key="k">
            <kbd
              class="px-2 py-1 text-xs font-medium rounded-md bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200 border border-gray-300/60 dark:border-gray-600"
            >
              {{ key }}
            </kbd>
            <span v-if="k < shortcut.keys.length - 1" class="text-xs text-gray-400 mx-0.5">
              +
            </span>
          </template>
        </div>
      </li>
    </ul>
  </section>
</template>
<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  shortcuts: {
    type: Array,
    required: true
  }
})
</script>
