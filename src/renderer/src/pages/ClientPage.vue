<template>
  <div class="h-screen w-full dark:bg-gray-900 dark:text-white">
    <AddClientLabels :open="showModal" @close="showModal = false" @confirm="handleLabelsAdded" />
    <div class="h-full w-full dark:bg-gray-900 dark:text-white">
      <div class="grid grid-rows-[auto_auto_1fr] h-full">
        <Header
          title="Client Details"
          :badge-label="`Clients: ${clientCount}`"
          :badge-mode="clientCount <= 0 ? 'danger' : 'info'"
        >
          <template #actions>
            <button
              class="p-2 rounded-lg bg-gray-200/60 dark:bg-gray-700 hover:bg-gray-300 transition-colors text-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              @click="refreshClient"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="bi bi-arrow-clockwise w-4 h-4"
                fill="currentColor"
                viewBox="0 0 16 16"
                :class="isRefreshing ? 'animate-spin' : ''"
              >
                <path
                  fill-rule="evenodd"
                  d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2z"
                />
                <path
                  d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466"
                />
              </svg>
            </button>
            <button
              v-show="clientCount > 0"
              class="text-sm font-medium py-1 px-2 rounded-lg bg-gray-200/60 dark:bg-gray-700 hover:bg-gray-300 transition-colors text-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              @click="confirmClearQueue"
            >
              Print Queue
            </button>
            <button
              class="text-sm font-medium py-1 px-2 rounded-lg bg-gray-200/60 dark:bg-gray-700 hover:bg-gray-300 transition-colors text-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              @click="printQueue"
            >
              Add Client
            </button>
            <MoreMenu :actions="moreActions">
              <template #trigger>
                <button
                  class="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 transition-colors text-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="bi bi-three-dots-vertical w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path
                      d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0"
                    />
                  </svg>
                </button>
              </template>
            </MoreMenu>

            <button
              class="text-sm font-medium text-gray-50 bg-black dark:bg-gray-100 dark:hover:bg-gray-100/70 dark:text-gray-900 py-1 px-2 rounded-lg"
              @click="goToQueue"
            >
              Go To Queue
            </button>
          </template>
        </Header>

        <!-- Client Details Container -->
        <div
          class="w-full border-b border-gray-300/60 dark:border-gray-800/60 bg-white dark:bg-gray-900 shadow-sm p-4 md:p-5"
        >
          <div class="max-w-7xl mx-auto">
            <div class="flex flex-col md:flex-row justify-between items-start gap-4 mb-4">
              <h2 class="text-xl font-bold">{{ client.name }}</h2>
              <button
                v-if="!isEditing"
                class="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                @click="isEditing = true"
              >
                Edit Client
              </button>
              <div v-else class="flex gap-2">
                <button
                  class="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                  @click="saveClient"
                >
                  Save
                </button>
                <button
                  class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg transition-colors"
                  @click="cancelEdit"
                >
                  Cancel
                </button>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Client ID
                </label>
                <input
                  v-model="client.id"
                  type="text"
                  disabled
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Name
                </label>
                <input
                  v-model="client.name"
                  type="text"
                  :disabled="!isEditing"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800"
                  :class="!isEditing ? 'bg-gray-50 dark:bg-gray-800/50' : ''"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Contact
                </label>
                <input
                  v-model="client.contact"
                  type="text"
                  :disabled="!isEditing"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800"
                  :class="!isEditing ? 'bg-gray-50 dark:bg-gray-800/50' : ''"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email
                </label>
                <input
                  v-model="client.email"
                  type="email"
                  :disabled="!isEditing"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800"
                  :class="!isEditing ? 'bg-gray-50 dark:bg-gray-800/50' : ''"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Labels Container -->
        <div
          class="bg-white dark:bg-gray-900 border-t border-gray-200/60 dark:border-gray-800/60 p-4 md:p-5"
        >
          <div class="max-w-7xl mx-auto h-full flex flex-col gap-4">
            <!-- Header Row -->
            <div class="grid grid-cols-1 md:grid-cols-3 items-center gap-3">
              <h2 class="text-xl font-semibold">Client Labels</h2>

              <!-- Search -->
              <div class="order-last md:order-0">
                <div class="relative w-full">
                  <span class="absolute left-3 top-2.5 text-gray-500 dark:text-gray-400">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-width="2"
                        stroke-linecap="round"
                        d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
                      />
                    </svg>
                  </span>
                  <input
                    v-model="searchProduct"
                    type="text"
                    placeholder="Search product..."
                    class="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-white outline-0 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <!-- Actions -->
              <div class="flex justify-end gap-2 flex-wrap">
                <button
                  class="px-3 py-1.5 text-sm font-medium rounded-lg bg-green-600 text-white hover:bg-green-700 flex items-center gap-1 transition"
                  @click="showModal = true"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="w-4 h-4"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                  >
                    <path
                      d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"
                    />
                  </svg>
                  Add
                </button>

                <template v-if="selectedLabels.length > 0">
                  <button
                    class="px-3 py-1.5 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
                    @click="bulkPrint"
                  >
                    Print ({{ selectedLabels.length }})
                  </button>
                  <button
                    class="px-3 py-1.5 text-sm font-medium rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition"
                    @click="bulkQueue"
                  >
                    Queue
                  </button>
                  <button
                    class="px-3 py-1.5 text-sm font-medium rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
                    @click="bulkDelete"
                  >
                    Delete
                  </button>
                </template>
              </div>
            </div>

            <!-- Labels Strip -->
            <div class="flex-1 overflow-auto">
              <div
                ref="labelsContainer"
                class="flex flex-col md:flex-row md:gap-4 gap-3 pb-4 md:overflow-x-auto md:overflow-y-hidden overflow-y-auto overflow-x-hidden"
              >
                <div
                  v-for="label in filteredLabels"
                  :key="label.id"
                  class="shrink-0 w-full md:w-auto relative rounded-xl border border-gray-300/60 dark:border-gray-700/60 bg-white dark:bg-gray-800 p-2 shadow-sm"
                >
                  <!-- Checkbox -->
                  <div class="absolute top-2 left-2 z-10">
                    <input
                      type="checkbox"
                      :checked="selectedLabels.includes(label.id)"
                      class="w-4 h-4 cursor-pointer"
                      @change="toggleLabelSelection(label.id)"
                    />
                  </div>

                  <LabelCardV2
                    v-model="labelModels[label.id]"
                    :current-date="currentDate"
                    :client-name="client.name"
                    @remove="() => removeLabel(label.id)"
                    @update="() => updateLabel(label.id)"
                    @queue="() => queueLabel(label.id)"
                    @print="() => printLabel(label.id)"
                  />
                </div>

                <!-- Empty -->
                <div
                  v-if="filteredLabels.length === 0"
                  class="flex items-center justify-center w-full h-71 text-gray-500 dark:text-gray-400"
                >
                  <div>No labels found</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div></div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import Header from '../components/Header.vue'
import MoreMenu from '../components/MoreMenu.vue'
import LabelCardV2 from '../components/LabelCardV2.vue'
import { useRoute, useRouter } from 'vue-router'
import { useAlerts } from '../composables/useAlerts.js'
import AddClientLabels from './AddClientLabels.vue'

const showModal = ref(false)

const router = useRouter()

// Client data
const client = ref({})

const originalClient = ref({ ...client.value })
const isEditing = ref(false)
const route = useRoute()
const alerts = useAlerts()
const isRefreshing = ref(false)

// Labels data
const labels = ref([])

const newUnsavedLabels = ref([])

// const labelModels = ref({})
// labels.value.forEach((label) => {
//   labelModels.value[label.id] = { ...label }
// })

// Handle when user confirms label selection
function handleLabelsAdded(selectedLabels) {
  console.log('Labels added:', selectedLabels)

  // Each label in selectedLabels has:
  // - id: original label ID
  // - name: label name
  // - tempId: unique temporary ID (for unsaved items)
  // - instructions: user's custom instructions/notes

  // Add your logic here, e.g.:
  // - Save to database
  // - Add to local state
  // - Update UI

  // Example:
  selectedLabels.forEach((label) => {
    labels.value.push({
      id: label.tempId, // or generate new ID after saving to DB
      product: label.name,
      instructions: label.instructions
      // ... other fields
    })
  })

  // Close modal
  showModal.value = false
}

const labelModels = computed(() => {
  return [...labels.value, ...newUnsavedLabels.value]
})

const searchProduct = ref('')
const selectedLabels = ref([])
const currentDate = ref(new Date().toLocaleString())

// Scroll handling
const labelsContainer = ref(null)
const isDesktop = ref(window.matchMedia('(min-width: 768px)').matches)
const mediaQuery = window.matchMedia('(min-width: 768px)')

const handleWheel = (e) => {
  e.preventDefault()
  labelsContainer.value.scrollLeft += e.deltaY + e.deltaX
}

const handleMediaChange = (e) => {
  isDesktop.value = e.matches
  if (e.matches) {
    labelsContainer.value.addEventListener('wheel', handleWheel, { passive: false })
  } else {
    labelsContainer.value.removeEventListener('wheel', handleWheel)
  }
}

// Computed
const filteredLabels = computed(() => {
  if (!searchProduct.value) return labels.value

  const query = searchProduct.value.toLowerCase()
  return labels.value.filter((label) => label.product.toLowerCase().includes(query))
})

// Client Methods
const saveClient = () => {
  originalClient.value = { ...client.value }
  isEditing.value = false
  // Add your save logic here (API call, etc.)
  console.log('Client saved:', client.value)
}

const cancelEdit = () => {
  client.value = { ...originalClient.value }
  isEditing.value = false
}

const getClientLabels = async (id) => {
  const cl = await window.api.getClientLabels(id)
  console.log(cl)
  labels.value = cl
  labelModels.value = {}
  cl.forEach((l) => {
    labelModels.value[l.id] = { ...l }
  })
}

const getClient = async (id) => {
  const cl = await window.api.getClientById(id)
  client.value = cl
  originalClient.value = { ...cl }
}

// Label Methods
const toggleLabelSelection = (labelId) => {
  const index = selectedLabels.value.indexOf(labelId)
  if (index > -1) {
    selectedLabels.value.splice(index, 1)
  } else {
    selectedLabels.value.push(labelId)
  }
}

const addNewLabel = () => {
  const newLabel = {
    id: `L-${String(labels.value.length + 1).padStart(3, '0')}`,
    product: 'New Medication',
    instructions: '',
    dispensedBy: '',
    warning: ''
  }
  labels.value.push(newLabel)
  labelModels.value[newLabel.id] = { ...newLabel }
  console.log('New label added:', newLabel)
}

const removeLabel = (labelId) => {
  const index = labels.value.findIndex((l) => l.id === labelId)
  if (index > -1) {
    labels.value.splice(index, 1)
    delete labelModels.value[labelId]
    selectedLabels.value = selectedLabels.value.filter((id) => id !== labelId)
  }
  console.log('Label removed:', labelId)
}

const updateLabel = (labelId) => {
  console.log('Label updated:', labelId, labelModels.value[labelId])
}

const queueLabel = (labelId) => {
  console.log('Label queued:', labelId)
}

const printLabel = (labelId) => {
  console.log('Label printed:', labelId)
}

// Bulk Actions
const bulkPrint = () => {
  console.log('Bulk print:', selectedLabels.value)
  selectedLabels.value = []
}

const bulkQueue = () => {
  console.log('Bulk queue:', selectedLabels.value)
  selectedLabels.value = []
}

const bulkDelete = () => {
  if (confirm(`Delete ${selectedLabels.value.length} selected labels?`)) {
    labels.value = labels.value.filter((l) => !selectedLabels.value.includes(l.id))
    selectedLabels.value.forEach((id) => delete labelModels.value[id])
    selectedLabels.value = []
  }
}

const refresh = () => {
  getClient(route.params.id)
  getClientLabels(route.params.id)
}

const refreshClient = async () => {
  if (isRefreshing.value) return
  isRefreshing.value = true
  await refresh()

  setTimeout(() => {
    isRefreshing.value = false
    alerts.info('Client list refreshed.')
  }, 1000)
}

const moreActions = [
  {
    label: 'Clients',
    handler: () => router.push({ name: 'Clients' })
  },
  {
    label: 'Logout',
    handler: (id) => router.push({ name: 'Client', params: { id } })
  }
]

onMounted(() => {
  refresh()
  filteredLabels
  mediaQuery.addEventListener('change', handleMediaChange)
  if (isDesktop.value) {
    labelsContainer.value.addEventListener('wheel', handleWheel, { passive: false })
  }
})

onUnmounted(() => {
  mediaQuery.removeEventListener('change', handleMediaChange)
  if (labelsContainer.value) {
    labelsContainer.value.removeEventListener('wheel', handleWheel)
  }
})
</script>

<style scoped>
/* Custom scrollbar for horizontal scroll on md+ */
@media (min-width: 768px) {
  .md\:overflow-x-auto::-webkit-scrollbar {
    height: 8px;
  }

  .md\:overflow-x-auto::-webkit-scrollbar-track {
    background: transparent;
  }

  .md\:overflow-x-auto::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 4px;
  }

  .dark .md\:overflow-x-auto::-webkit-scrollbar-thumb {
    background: #4b5563;
  }

  .md\:overflow-x-auto::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
  }

  .dark .md\:overflow-x-auto::-webkit-scrollbar-thumb:hover {
    background: #6b7280;
  }
}
</style>
