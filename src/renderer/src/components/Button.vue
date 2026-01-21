<template>
  <button :class="[colors[color], ' flex rounded-lg py-1 px-2 select-none']">
    {{ labelId }}
  </button>
</template>

<script setup>
const colors = {
  blue: 'bg-blue-200 hover:bg-blue-300 dark:bg-blue-800 dark:hover:bg-blue-900',
  green: 'bg-green-200 hover:bg-green-300 dark:bg-green-800 dark:hover:bg-green-900',
  red: 'bg-red-200 hover:bg-red-300 dark:bg-red-800 dark:hover:bg-red-900',
  yellow: 'bg-yellow-200 hover:bg-yellow-300 dark:bg-yellow-800 dark:hover:bg-yellow-900'
}

defineProps({
  labelId: {
    type: String,
    required: true
  },
  color: {
    type: String,
    default: 'blue'
  }
})
</script>
