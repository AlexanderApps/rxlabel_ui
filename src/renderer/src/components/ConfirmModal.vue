<template>
  <teleport to="body">
    <div
      v-if="show"
      class="fixed inset-0 bg-black/70 text-gray-900 dark:text-gray-100 flex items-center justify-center z-50 backdrop-blur-[1px]"
      @click.self="cancel"
    >
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-5 w-87.5">
        <h3 class="text-lg font-medium mb-3">
          {{ title }}
        </h3>

        <p class="text-sm opacity-80 mb-5">
          {{ message }}
        </p>

        <div class="flex justify-end gap-2">
          <button
            class="px-3 py-1 rounded-md bg-gray-200 dark:bg-gray-700 dark:text-white text-sm"
            @click="cancel"
          >
            Cancel
          </button>

          <button class="px-3 py-1 rounded-md bg-blue-600 text-white text-sm" @click="confirm">
            Confirm
          </button>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup>
const props = defineProps({
  show: Boolean,
  title: { type: String, default: 'Confirm Action' },
  message: { type: String, default: 'Are you sure you want to continue?' }
})

const emit = defineEmits(['confirm', 'cancel'])

function confirm() {
  emit('confirm')
}
function cancel() {
  emit('cancel')
}

window.addEventListener('keydown', (e) => {
  if (!props.show) return
  if (e.key === 'Escape') cancel()
  if (e.key === 'Enter') confirm()
})
</script>
