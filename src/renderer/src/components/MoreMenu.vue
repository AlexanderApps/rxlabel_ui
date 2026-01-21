<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

defineProps({
  actions: {
    type: Array,
    default: () => []
  },
  placement: {
    type: String,
    default: 'bottom-right'
  }
})

const menuRef = ref(null)
const triggerRef = ref(null)
const open = ref(false)

const toggle = (e) => {
  e.stopPropagation()
  open.value = !open.value
}

const close = (e) => {
  if (open.value && !menuRef.value?.contains(e.target) && !triggerRef.value?.contains(e.target)) {
    open.value = false
  }
}

onMounted(() => document.addEventListener('click', close))
onBeforeUnmount(() => document.removeEventListener('click', close))

const handleAction = (fn) => {
  if (typeof fn === 'function') fn()
  open.value = false
}
</script>

<template>
  <div class="relative inline-block">
    <!-- Trigger slot -->
    <div ref="triggerRef" @click="toggle">
      <slot name="trigger" />
    </div>

    <!-- Menu -->
    <div
      v-if="open"
      ref="menuRef"
      class="absolute z-100 w-40 mt-2 rounded-md bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-700 shadow-xl py-1"
      :class="{
        'right-0 top-full': placement === 'bottom-right',
        'left-0 top-full': placement === 'bottom-left'
      }"
    >
      <button
        v-for="(a, i) in actions"
        :key="i"
        class="flex w-full px-3 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-700 gap-2 items-center"
        @click="handleAction(a.handler)"
      >
        <span v-if="a.icon" class="w-4 h-4" v-html="a.icon"></span>
        {{ a.label }}
      </button>
    </div>
  </div>
</template>
