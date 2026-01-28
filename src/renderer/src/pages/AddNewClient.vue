<template>
  <Transition
    enter-active-class="transition-opacity duration-200"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition-opacity duration-150"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="open"
      class="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-4 overflow-hidden"
      @click.self="$emit('close')"
      @wheel.prevent.stop
      @touchmove.prevent.stop
      @scroll.prevent.stop
    >
      <Transition
        enter-active-class="transition-all duration-200"
        enter-from-class="opacity-0 scale-95"
        enter-to-class="opacity-100 scale-100"
        leave-active-class="transition-all duration-150"
        leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-95"
      >
        <div
          v-if="open"
          class="bg-white dark:bg-gray-800 w-full max-w-4xl rounded-2xl shadow-2xl grid grid-rows-[auto_1fr_auto] h-[90vh] max-h-150 sm:max-h-175 lg:max-h-[85vh]"
          @wheel.stop
          @touchmove.stop
        >
          <!-- Header -->
          <div
            class="flex items-center justify-between px-6 py-5 border-b border-gray-200 dark:border-gray-700"
          >
            <div>
              <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Add New Client</h2>
              <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Enter client details and assign labels
              </p>
            </div>
            <button
              class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-500 dark:text-gray-400"
              @click="$emit('close')"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <!-- Fetch State -->
          <div v-if="loading" class="px-6 py-8 flex items-center justify-center">
            <div class="inline-flex items-center gap-3 text-gray-600 dark:text-gray-400">
              <svg class="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span>Loading labels...</span>
            </div>
          </div>

          <div v-else-if="error" class="px-6 py-8 flex items-center justify-center">
            <div
              class="inline-flex items-center gap-2 text-red-500 bg-red-50 dark:bg-red-900/20 px-4 py-3 rounded-lg"
            >
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clip-rule="evenodd"
                />
              </svg>
              <span>{{ error }}</span>
            </div>
          </div>

          <!-- Content -->
          <div v-else class="overflow-hidden min-h-0">
            <div class="h-full overflow-y-auto custom-scrollbar">
              <div class="px-6 py-5 space-y-6">
                <!-- Client Information Section -->
                <div
                  class="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-5 border-2 border-gray-200 dark:border-gray-700"
                >
                  <h3
                    class="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-4"
                  >
                    Client Information
                  </h3>

                  <div class="space-y-4">
                    <!-- Name Field -->
                    <div>
                      <label
                        class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      >
                        Name <span class="text-red-500">*</span>
                      </label>
                      <input
                        v-model="clientData.name"
                        type="text"
                        placeholder="Enter client name"
                        class="w-full px-4 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg outline-0 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <!-- Contact Field -->
                    <div>
                      <label
                        class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      >
                        Contact <span class="text-red-500">*</span>
                      </label>
                      <input
                        v-model="clientData.contact"
                        type="text"
                        placeholder="Enter contact number"
                        class="w-full px-4 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg outline-0 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <!-- Email Field -->
                    <div>
                      <label
                        class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      >
                        Email <span class="text-red-500">*</span>
                      </label>
                      <input
                        v-model="clientData.email"
                        type="email"
                        placeholder="Enter email address"
                        class="w-full px-4 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg outline-0 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                <!-- Labels Section -->
                <div>
                  <div class="flex items-center justify-between mb-4">
                    <h3
                      class="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide"
                    >
                      Assign Labels
                    </h3>
                    <span
                      class="text-xs bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded-full text-blue-600 dark:text-blue-400"
                    >
                      {{ selectedLabels.length }} selected
                    </span>
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <!-- Available Labels Column -->
                    <div class="space-y-3">
                      <div class="flex items-center justify-between">
                        <span
                          class="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide"
                        >
                          Available Labels
                        </span>
                        <span
                          class="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full text-gray-600 dark:text-gray-400"
                        >
                          {{ filteredLabels.length }} of {{ dbLabels.length }}
                        </span>
                      </div>

                      <!-- Search Input -->
                      <div class="relative">
                        <div
                          class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
                        >
                          <svg
                            class="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
                            />
                          </svg>
                        </div>
                        <input
                          v-model="searchQuery"
                          type="text"
                          placeholder="Search labels..."
                          class="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg outline-0 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <!-- Labels List -->
                      <div
                        class="border-2 border-gray-200 dark:border-gray-700 rounded-xl overflow-y-auto bg-gray-50 dark:bg-gray-900/50 h-64 custom-scrollbar"
                      >
                        <div
                          v-if="filteredLabels.length === 0"
                          class="flex items-center justify-center h-full text-gray-400 dark:text-gray-500"
                        >
                          <div class="text-center p-4">
                            <svg
                              class="w-12 h-12 mx-auto mb-2 opacity-50"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                              />
                            </svg>
                            <p class="text-sm">
                              {{ searchQuery ? 'No labels found' : 'No labels available' }}
                            </p>
                          </div>
                        </div>

                        <div v-else class="divide-y divide-gray-200 dark:divide-gray-700">
                          <div
                            v-for="label in filteredLabels"
                            :key="label.id"
                            class="flex items-center justify-between p-3 hover:bg-white dark:hover:bg-gray-800 transition-colors"
                          >
                            <div class="flex items-center gap-3 flex-1 min-w-0">
                              <div
                                class="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0"
                              >
                                <svg
                                  class="w-4 h-4 text-blue-600 dark:text-blue-400"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                                  />
                                </svg>
                              </div>
                              <div class="flex-1 min-w-0">
                                <span
                                  class="text-sm font-medium text-gray-900 dark:text-gray-100 truncate block"
                                >
                                  {{ label.product }}
                                </span>
                                <span
                                  v-if="label.warning"
                                  class="text-xs text-orange-600 dark:text-orange-400 truncate block"
                                >
                                  {{ label.warning }}
                                </span>
                              </div>
                            </div>
                            <button
                              class="px-3 py-1.5 text-xs font-medium rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                              :disabled="selectedLabels.some((x) => x.id === label.id)"
                              :class="
                                selectedLabels.some((x) => x.id === label.id)
                                  ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                                  : 'bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600'
                              "
                              @click="selectLabel(label)"
                            >
                              {{
                                selectedLabels.some((x) => x.id === label.id)
                                  ? 'Selected'
                                  : 'Select'
                              }}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Selected Labels Column -->
                    <div class="space-y-3">
                      <div class="flex items-center justify-between">
                        <span
                          class="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide"
                        >
                          Selected Labels
                        </span>
                      </div>

                      <div
                        class="border-2 border-blue-200 dark:border-blue-800 rounded-xl overflow-y-auto bg-blue-50/30 dark:bg-blue-900/10 h-[17.5rem] custom-scrollbar"
                      >
                        <div
                          v-if="selectedLabels.length === 0"
                          class="flex items-center justify-center h-full text-gray-400 dark:text-gray-500"
                        >
                          <div class="text-center p-4">
                            <svg
                              class="w-12 h-12 mx-auto mb-2 opacity-50"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                              />
                            </svg>
                            <p class="text-sm">No labels selected</p>
                            <p class="text-xs mt-1 opacity-70">
                              Optional: Add labels to this client
                            </p>
                          </div>
                        </div>

                        <div v-else class="divide-y divide-blue-200 dark:divide-blue-800/50">
                          <div
                            v-for="(item, idx) in selectedLabels"
                            :key="item.tempId"
                            class="p-3 hover:bg-white dark:hover:bg-gray-800 transition-colors"
                          >
                            <div class="flex items-center justify-between mb-3">
                              <div class="flex items-center gap-2">
                                <div
                                  class="w-6 h-6 rounded-md bg-green-100 dark:bg-green-900/30 flex items-center justify-center shrink-0"
                                >
                                  <svg
                                    class="w-3.5 h-3.5 text-green-600 dark:text-green-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                      stroke-width="2"
                                      d="M5 13l4 4L19 7"
                                    />
                                  </svg>
                                </div>
                                <span class="text-xs font-medium text-gray-500 dark:text-gray-400">
                                  Label #{{ idx + 1 }}
                                </span>
                              </div>
                              <button
                                class="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 dark:text-red-400 transition-colors"
                                title="Remove"
                                @click="removeSelectedLabel(idx)"
                              >
                                <svg
                                  class="w-4 h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M6 18L18 6M6 6l12 12"
                                  />
                                </svg>
                              </button>
                            </div>

                            <div class="space-y-2">
                              <div>
                                <label
                                  class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1"
                                >
                                  Product
                                </label>
                                <input
                                  v-model="item.product"
                                  type="text"
                                  class="w-full text-xs border border-gray-300 dark:border-gray-600 rounded-lg outline-0 p-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  placeholder="Product name..."
                                />
                              </div>

                              <div>
                                <label
                                  class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1"
                                >
                                  Instructions
                                </label>
                                <textarea
                                  v-model="item.instructions"
                                  class="w-full text-xs border border-gray-300 dark:border-gray-600 rounded-lg outline-0 p-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                  placeholder="Instructions..."
                                  rows="2"
                                />
                              </div>

                              <div>
                                <label
                                  class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1"
                                >
                                  Warning
                                </label>
                                <textarea
                                  v-model="item.warning"
                                  class="w-full text-xs border border-gray-300 dark:border-gray-600 rounded-lg outline-0 p-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                  placeholder="Warning..."
                                  rows="2"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div
            class="flex items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 rounded-b-2xl"
          >
            <div class="text-sm text-gray-500 dark:text-gray-400">
              <span v-if="!isFormValid" class="text-red-500">
                Please fill in all required fields
              </span>
              <span v-else>
                Ready to add client{{
                  selectedLabels.length > 0
                    ? ` with ${selectedLabels.length} label${selectedLabels.length === 1 ? '' : 's'}`
                    : ''
                }}
              </span>
            </div>

            <div class="flex gap-3">
              <button
                class="px-4 py-2 text-sm font-medium border-2 border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
                @click="handleClose"
              >
                Cancel
              </button>

              <button
                :disabled="!isFormValid"
                class="px-5 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-500/30 disabled:shadow-none"
                @click="confirmAdd"
              >
                Add Client
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<script setup>
import { ref, watch, computed } from 'vue'

const props = defineProps({
  open: { type: Boolean, default: false }
})

const emits = defineEmits(['close', 'confirm'])

// Client data
const clientData = ref({
  name: '',
  contact: '',
  email: ''
})

// Labels data
const dbLabels = ref([])
const selectedLabels = ref([])
const loading = ref(false)
const error = ref(null)
const searchQuery = ref('')

// Computed filtered labels based on search
const filteredLabels = computed(() => {
  if (!searchQuery.value) return dbLabels.value

  const query = searchQuery.value.toLowerCase()
  return dbLabels.value.filter((label) => label.product.toLowerCase().includes(query))
})

// Form validation
const isFormValid = computed(() => {
  return (
    clientData.value.name.trim() !== '' &&
    clientData.value.contact.trim() !== '' &&
    clientData.value.email.trim() !== ''
  )
})

watch(
  () => props.open,
  async (v) => {
    if (v) {
      await loadDbLabels()
      resetForm()
    }
  }
)

async function loadDbLabels() {
  loading.value = true
  error.value = null
  try {
    dbLabels.value = await window.api.getLabels('')
  } catch (e) {
    error.value = 'Failed to fetch labels'
    console.error(e)
  } finally {
    loading.value = false
  }
}

function selectLabel(label) {
  if (selectedLabels.value.some((x) => x.id === label.id)) return

  selectedLabels.value.push({
    ...label,
    tempId: crypto.randomUUID()
  })
}

function removeSelectedLabel(i) {
  selectedLabels.value.splice(i, 1)
}

function resetForm() {
  clientData.value = {
    name: '',
    contact: '',
    email: ''
  }
  selectedLabels.value = []
  searchQuery.value = ''
}

function handleClose() {
  resetForm()
  emits('close')
}

async function confirmAdd() {
  if (!isFormValid.value) return

  const result = await window.api.createClient(
    clientData.value.name,
    clientData.value.contact,
    clientData.value.email
  )
  console.log(result)
  const clientId = result.lastInsertRowid

  if (selectedLabels.value.length > 0) {
    const labelsToAdd = selectedLabels.value.map((label) => ({
      client_id: clientId,
      product: label.product,
      instructions: label.instructions,
      warning: label.warning
    }))
    await window.api.createClientLabels(labelsToAdd)
  }

  emits('confirm', result)
  resetForm()
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e0;
  border-radius: 4px;
}

.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background: #4a5568;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #a0aec0;
}

.dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #718096;
}
</style>
