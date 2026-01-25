<template>
  <Transition name="modal">
    <div
      v-if="show"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm pointer-events-auto"
      @click.self="closeModal"
    >
      <div
        class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
      >
        <!-- Header -->
        <div
          class="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700"
        >
          <div>
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Add New Labels</h2>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Create one or more medication labels
            </p>
          </div>
          <button
            class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            @click="closeModal"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-5 h-5 text-gray-500 dark:text-gray-400"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path
                d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"
              />
            </svg>
          </button>
        </div>

        <!-- Content -->
        <div class="flex-1 overflow-y-auto px-6 py-4">
          <div class="space-y-4">
            <div
              v-for="(label, index) in labels"
              :key="label.id"
              class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border border-gray-200 dark:border-gray-600"
            >
              <div class="flex items-start justify-between mb-3">
                <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Label {{ index + 1 }}
                </h3>
                <button
                  v-if="labels.length > 1"
                  class="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 transition-colors"
                  title="Remove label"
                  @click="removeLabel(label.id)"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path
                      d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"
                    />
                    <path
                      d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"
                    />
                  </svg>
                </button>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <!-- Product -->
                <div class="md:col-span-2">
                  <label
                    :for="`product-${label.id}`"
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
                  >
                    Product Name <span class="text-red-500">*</span>
                  </label>
                  <input
                    :id="`product-${label.id}`"
                    v-model="label.product"
                    type="text"
                    placeholder="e.g., Amoxicillin 500mg"
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg outline-0 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                  />
                </div>

                <!-- Instructions -->
                <div class="md:col-span-2">
                  <label
                    :for="`instructions-${label.id}`"
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
                  >
                    Instructions
                  </label>
                  <textarea
                    :id="`instructions-${label.id}`"
                    v-model="label.instructions"
                    rows="3"
                    placeholder="e.g., Take one capsule twice daily with food"
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg outline-0 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-shadow"
                  ></textarea>
                </div>

                <!-- Warning -->
                <div class="md:col-span-2">
                  <label
                    :for="`warning-${label.id}`"
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
                  >
                    Warning
                  </label>
                  <textarea
                    :id="`warning-${label.id}`"
                    v-model="label.warning"
                    rows="2"
                    placeholder="e.g., May cause drowsiness. Do not drive or operate machinery."
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg outline-0 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-shadow"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>

          <!-- Add Another Button -->
          <button
            class="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2.5 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            @click="addLabel"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-4 h-4"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path
                d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"
              />
            </svg>
            Add Another Label
          </button>
        </div>

        <!-- Footer -->
        <div
          class="flex items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50"
        >
          <div class="text-sm text-gray-500 dark:text-gray-400">
            {{ labels.length }} label{{ labels.length !== 1 ? 's' : '' }} to create
          </div>
          <div class="flex gap-3">
            <button
              class="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              @click="closeModal"
            >
              Cancel
            </button>
            <button
              class="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed text-white transition-colors"
              :disabled="!isValid"
              @click="saveLabels"
            >
              Create Labels
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, computed } from 'vue'

defineProps({
  show: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'save'])

let nextId = 1

const labels = ref([
  {
    id: nextId++,
    product: '',
    instructions: '',
    warning: ''
  }
])

const isValid = computed(() => {
  return labels.value.every((label) => label.product.trim() !== '')
})

const addLabel = () => {
  labels.value.push({
    id: nextId++,
    product: '',
    instructions: '',
    warning: ''
  })
}

const removeLabel = (id) => {
  labels.value = labels.value.filter((label) => label.id !== id)
}

const saveLabels = () => {
  if (!isValid.value) return

  const labelsToSave = labels.value.map(({ product, instructions, warning }) => ({
    product: product.trim(),
    instructions: instructions.trim(),
    warning: warning.trim()
  }))

  emit('save', labelsToSave)
  resetForm()
}

const closeModal = () => {
  emit('close')
  resetForm()
}

const resetForm = () => {
  labels.value = [
    {
      id: nextId++,
      product: '',
      instructions: '',
      warning: ''
    }
  ]
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .bg-white,
.modal-leave-active .bg-white {
  transition: transform 0.3s ease;
}

.modal-enter-from .bg-white,
.modal-leave-to .bg-white {
  transform: scale(0.9);
}
</style>
