<template>
  <div
    class="relative bg-white dark:bg-gray-900 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-200 dark:border-gray-800 max-w-md"
  >
    <!-- Header with gradient accent -->
    <div class="relative bg-gradient-to-r from-blue-500 to-indigo-600 p-4">
      <div class="flex items-center justify-between gap-3">
        <input
          v-model="label.product"
          type="text"
          placeholder="Product Name"
          class="flex-1 bg-white/95 dark:bg-gray-800/95 text-gray-900 dark:text-white px-4 py-2.5 rounded-lg text-lg font-semibold placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
        />

        <!-- Status indicator -->
        <div v-if="showEditStatus && label._dirty" class="group relative flex-shrink-0">
          <div class="relative">
            <div
              class="w-3 h-3 rounded-full bg-amber-400 animate-pulse shadow-lg shadow-amber-400/50"
            ></div>
            <div
              class="absolute inset-0 w-3 h-3 rounded-full bg-amber-400 animate-ping opacity-75"
            ></div>
          </div>
          <div
            class="absolute right-0 top-full mt-2 px-3 py-1.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10 shadow-xl"
          >
            Unsaved changes
            <div
              class="absolute bottom-full right-4 w-2 h-2 bg-gray-900 dark:bg-white transform rotate-45 translate-y-1"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main content -->
    <div class="p-5 space-y-4">
      <!-- Instructions section -->
      <div class="space-y-2">
        <label
          class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider"
        >
          Instructions
        </label>
        <textarea
          v-model="label.instructions"
          placeholder="Enter dosage and usage instructions..."
          class="w-full h-28 px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 placeholder:text-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />
      </div>

      <!-- Patient & Dispensing info -->
      <div class="grid grid-cols-2 gap-3">
        <div class="space-y-2">
          <label
            class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider"
          >
            Patient Name
          </label>
          <input
            v-model="label.client"
            type="text"
            placeholder="Enter name"
            class="w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="!clientEditable"
          />
        </div>

        <div class="space-y-2">
          <label
            class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider"
          >
            Dispensed By
          </label>
          <input
            :value="currentUser"
            type="text"
            class="w-full px-3 py-2.5 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 font-medium uppercase text-sm cursor-not-allowed"
            readonly
            disabled
          />
        </div>
      </div>

      <!-- Date badge -->
      <div class="flex items-center gap-2 text-sm">
        <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <span class="font-medium text-gray-700 dark:text-gray-300">{{ currentDate }}</span>
      </div>

      <!-- Warnings section -->
      <div class="space-y-2">
        <label
          class="text-xs font-semibold text-amber-600 dark:text-amber-500 uppercase tracking-wider flex items-center gap-1.5"
        >
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clip-rule="evenodd"
            />
          </svg>
          Warnings & Precautions
        </label>
        <textarea
          v-model="label.warning"
          placeholder="Add any warnings or special notes..."
          class="w-full h-20 px-4 py-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 rounded-xl text-amber-900 dark:text-amber-400 placeholder:text-amber-400/60 resize-none focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
        />
      </div>
    </div>

    <!-- Action buttons -->
    <div class="px-5 pb-5 pt-2">
      <div class="grid grid-cols-2 gap-2">
        <button
          @click="$emit('remove', label)"
          class="px-4 py-2.5 bg-gray-100 hover:bg-red-50 dark:bg-gray-800 dark:hover:bg-red-950/30 text-gray-700 hover:text-red-600 dark:text-gray-300 dark:hover:text-red-400 font-medium rounded-lg transition-all duration-200 border border-gray-200 dark:border-gray-700 hover:border-red-300 dark:hover:border-red-900 active:scale-95"
        >
          Remove
        </button>

        <button
          @click="$emit('update', label)"
          class="px-4 py-2.5 bg-gray-100 hover:bg-amber-50 dark:bg-gray-800 dark:hover:bg-amber-950/30 text-gray-700 hover:text-amber-600 dark:text-gray-300 dark:hover:text-amber-400 font-medium rounded-lg transition-all duration-200 border border-gray-200 dark:border-gray-700 hover:border-amber-300 dark:hover:border-amber-900 active:scale-95"
        >
          Update
        </button>

        <button
          @click="$emit('queue', label)"
          class="px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-medium rounded-lg transition-all duration-200 shadow-md hover:shadow-lg active:scale-95"
        >
          Add to Queue
        </button>

        <button
          @click="$emit('print', label)"
          class="px-4 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium rounded-lg transition-all duration-200 shadow-md hover:shadow-lg active:scale-95 flex items-center justify-center gap-2"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
            />
          </svg>
          Print
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { watch } from 'vue'

const label = defineModel({ type: Object, required: true })

const props = defineProps({
  currentDate: { type: String, required: true },
  currentUser: { type: String, required: true },
  clientName: { type: String, required: false },
  clientEditable: { type: Boolean, required: false, default: () => true },
  showEditStatus: { type: Boolean, required: false, default: () => true }
})

defineEmits(['remove', 'update', 'queue', 'print'])

const trackedKeys = ['product', 'instructions', 'warning']

// Sync client name from prop
watch(
  () => props.clientName,
  (newVal) => {
    if (newVal) label.value.client = newVal
  },
  { immediate: true }
)

// Track changes for dirty state
watch(
  () => ({
    product: label.value?.product,
    instructions: label.value?.instructions,
    warning: label.value?.warning
  }),
  (newVal, oldVal) => {
    if (!newVal || !oldVal) return
    for (const key of trackedKeys) {
      if (newVal[key] !== oldVal[key]) {
        label.value._dirty = true
        break
      }
    }
  }
)
</script>

<style scoped>
/* Custom scrollbar for textareas */
textarea::-webkit-scrollbar {
  width: 6px;
}

textarea::-webkit-scrollbar-track {
  background: transparent;
}

textarea::-webkit-scrollbar-thumb {
  background: rgba(156, 163, 175, 0.3);
  border-radius: 3px;
}

textarea::-webkit-scrollbar-thumb:hover {
  background: rgba(156, 163, 175, 0.5);
}

/* Smooth transitions */
* {
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}
</style>
