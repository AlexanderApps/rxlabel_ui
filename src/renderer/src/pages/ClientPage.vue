<template>
  <div class="h-screen w-full dark:bg-gray-900 dark:text-white">
    <ConfirmModal
      :show="modalState.show"
      :message="modalState.message"
      @confirm="onConfirm"
      @cancel="onCancel"
    />
    <AddClientLabels :open="showModal" @close="showModal = false" @confirm="handleLabelsAdded" />
    <div class="h-full w-full dark:bg-gray-900 dark:text-white">
      <div class="grid grid-rows-[auto_auto_1fr] h-full">
        <Header
          title="Client Details"
          :badge-label="`Queue: ${queueCount}`"
          :badge-mode="queueCount <= 0 ? 'danger' : 'info'"
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
            <!-- <MoreMenu :actions="moreActions">
              <template #trigger>
                <button
                  class="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 transition-colors text-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 select-none"
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
            </MoreMenu> -->
            <GlobalMoreMenu
              :includes="['View Labels', 'View Queue', 'Users', 'Settings', 'Logout']"
            />
            <button
              class="text-sm font-medium text-gray-50 bg-black dark:bg-gray-100 dark:hover:bg-gray-100/70 dark:text-gray-900 py-1 px-2 rounded-lg select-none"
              @click="goBack"
            >
              Go to Clients
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
                class="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors select-none"
                @click="isEditing = true"
              >
                Edit Client
              </button>
              <div v-else class="flex gap-2">
                <button
                  class="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors select-none"
                  @click="saveClient"
                >
                  Save
                </button>
                <button
                  class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg transition-colors select-none"
                  @click="cancelEdit"
                >
                  Cancel
                </button>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <!-- <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Client ID
                </label>
                <input
                  v-model="client.id"
                  type="text"
                  disabled
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                />
              </div> -->

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
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Home Address
                </label>
                <textarea
                  v-model="client.home_address"
                  type="text"
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
              <div class="flex gap-2">
                <h2 class="text-xl font-semibold">Client Labels</h2>
                <div class="w-14">
                  <Badge :mode="Object.keys(labelModels).length === 0 ? 'danger' : 'info'">
                    <span>Labels:&nbsp;</span>{{ Object.keys(labelModels).length }}
                  </Badge>
                </div>
              </div>

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
                  class="px-3 py-1.5 text-sm font-medium rounded-lg bg-green-600 text-white hover:bg-green-700 flex items-center gap-1 transition select-none"
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

                <button
                  v-if="hasUnsavedChanges"
                  class="px-3 py-1.5 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition select-none"
                  @click="saveLabelsConfirmed"
                >
                  Save
                </button>

                <template v-if="selectedLabels.length > 0">
                  <button
                    class="px-3 py-1.5 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition select-none"
                    @click="bulkPrint"
                  >
                    Print ({{ selectedLabels.length }})
                  </button>
                  <button
                    class="px-3 py-1.5 text-sm font-medium rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition select-none"
                    @click="bulkQueue"
                  >
                    Queue
                  </button>
                  <button
                    class="px-3 py-1.5 text-sm font-medium rounded-lg bg-red-600 text-white hover:bg-red-700 transition select-none"
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

                  <!-- State Indicator Badge -->
                  <div
                    v-if="isLabelDirty(label.id) || label._state === 'unsaved'"
                    class="absolute top-2 right-2 z-10 group cursor-default"
                  >
                    <span
                      :class="[
                        'w-3 h-3 rounded-full block',
                        label._state === 'unsaved'
                          ? 'bg-blue-500'
                          : isLabelDirty(label.id)
                            ? 'bg-yellow-500'
                            : 'bg-gray-400'
                      ]"
                    ></span>

                    <!-- Tooltip -->
                    <span
                      class="absolute right-0 -translate-y-full mb-1 hidden group-hover:block text-xs bg-gray-900 text-white px-2 py-1 rounded whitespace-nowrap shadow-md"
                    >
                      {{
                        label._state === 'unsaved'
                          ? 'Unsaved'
                          : isLabelDirty(label.id)
                            ? 'Edited'
                            : 'Unknown'
                      }}
                    </span>
                  </div>

                  <LabelCardV2
                    v-model="labelModels[label.id]"
                    :client-editable="false"
                    :show-edit-status="false"
                    :current-date="formattedDate"
                    :current-user="currentUser?.name || ''"
                    :client-name="clientName"
                    @remove="() => removeLabel(label.id)"
                    @update="(updated) => updateLabel(label.id, updated)"
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
import { ref, reactive, computed, onMounted, onUnmounted, toRaw } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAlerts } from '../composables/useAlerts.js'
import { useSettings } from '../composables/useSettings.js'
import { useQueueCount } from '../composables/useQueueCount.js'

import Header from '../components/Header.vue'
import GlobalMoreMenu from '../components/GlobalMoreMenu.vue'
import LabelCardV2 from '../components/LabelCardV2.vue'
import AddClientLabels from './AddClientLabels.vue'
import ConfirmModal from '../components/ConfirmModal.vue'
import Badge from '../components/Badge.vue'

const { formattedDate, currentUser, playSoundIfEnabled } = useSettings()
const { queueCount, getQueueCount } = useQueueCount()

// Client data
const client = ref({})
const originalClient = ref({ ...client.value })

// Editing and refreshing
const isEditing = ref(false)
const isRefreshing = ref(false)

// Labels data
const labels = ref([])
const newUnsavedLabels = ref([])
const labelModels = ref({})
const selectedLabels = ref([])
const searchProduct = ref('')
const deletedLabelIds = ref([])

const clientName = computed(() => client.value?.name || 'Client')

// UI and modal
const showModal = ref(false)

// Routing
const route = useRoute()
const router = useRouter()

// Alerts
const alerts = useAlerts()

// modal confirm helper
const modalState = reactive({
  show: false,
  message: '',
  resolve: null
})

// ----- Helpers -----
const confirm = (message) => {
  return new Promise((resolve) => {
    modalState.message = message
    modalState.resolve = resolve
    modalState.show = true
  })
}

const onConfirm = () => {
  modalState.resolve(true)
  modalState.show = false
}

const onCancel = () => {
  modalState.resolve(false)
  modalState.show = false
}

// Scroll handling
const labelsContainer = ref(null)
const isDesktop = ref(window.matchMedia('(min-width: 768px)').matches)
const mediaQuery = window.matchMedia('(min-width: 768px)')

const filteredLabels = computed(() => {
  const allLabels = [...labels.value, ...newUnsavedLabels.value]

  if (!searchProduct.value) return allLabels

  const query = searchProduct.value.toLowerCase()
  return allLabels.filter((label) => label.product?.toLowerCase().includes(query))
})

const hasUnsavedChanges = computed(() => {
  // Check for deleted labels
  if (deletedLabelIds.value.length > 0) return true

  // Check for new unsaved labels
  if (newUnsavedLabels.value.length > 0) return true

  // Check for dirty labels - compare labelModels with source labels
  return labels.value.some((sourceLabel) => {
    const normalizedId = normalizeId(sourceLabel.id)
    const model = labelModels.value[normalizedId]

    if (!model) return false

    // Check if any field has changed
    return (
      model.product !== sourceLabel.product ||
      model.instructions !== sourceLabel.instructions ||
      model.warning !== sourceLabel.warning
    )
  })
})

// Helper function to normalize ID for comparison (handles both UUID strings and numbers)
const normalizeId = (id) => String(id)

// Helper function to check if a label has unsaved changes
const isLabelDirty = (labelId) => {
  const normalizedId = normalizeId(labelId)
  const sourceLabel = labels.value.find((l) => normalizeId(l.id) === normalizedId)
  const model = labelModels.value[normalizedId]

  if (!sourceLabel || !model) return false

  return (
    model.product !== sourceLabel.product ||
    model.instructions !== sourceLabel.instructions ||
    model.warning !== sourceLabel.warning
  )
}

// Function to sync models with source data
const syncLabelModels = () => {
  // Add saved labels (but preserve existing edits)
  labels.value.forEach((l) => {
    const normalizedId = normalizeId(l.id)
    if (!labelModels.value[normalizedId]) {
      // New label, create fresh model
      labelModels.value[normalizedId] = { ...l, client: client.value.name }
    }
    // If it exists, keep it to preserve edits
  })

  // Add unsaved labels (but preserve existing edits)
  newUnsavedLabels.value.forEach((l) => {
    const normalizedId = normalizeId(l.id)
    if (!labelModels.value[normalizedId]) {
      // New label, create fresh model
      labelModels.value[normalizedId] = { ...l, client: client.value.name }
    }
    // If it exists, keep it to preserve edits
  })

  // Remove models that no longer exist in source data
  const allIds = new Set([
    ...labels.value.map((l) => normalizeId(l.id)),
    ...newUnsavedLabels.value.map((l) => normalizeId(l.id))
  ])

  Object.keys(labelModels.value).forEach((id) => {
    if (!allIds.has(id)) {
      delete labelModels.value[id]
    }
  })
}

// Scroll handling
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

// Client Methods
const getClient = async (id) => {
  try {
    const cl = await window.api.getClientById(id)
    client.value = cl
    originalClient.value = { ...cl }
  } catch (error) {
    console.error('Failed to fetch client:', error)
    alerts.error('Failed to load client')
  }
}

const saveClient = async () => {
  const data = client.value
  try {
    await window.api.updateClient(
      route.params.id,
      data.name,
      data.contact,
      data.email,
      data.home_address
    )
    originalClient.value = { ...client.value }
    isEditing.value = false
    alerts.success('Client updated successfully')
  } catch (error) {
    console.error('Failed to save client:', error)
    alerts.error('Failed to save client')
  }
}

const cancelEdit = () => {
  client.value = { ...originalClient.value }
  isEditing.value = false
}

// Label Methods
const getClientLabels = async (id) => {
  try {
    const cl = await window.api.getClientLabels(id)
    labels.value = cl.map((l) => ({
      ...l,
      _state: 'saved',
      _dirty: false
    }))
    // Filter out pending deletions after fetch
    labels.value = labels.value.filter(
      (l) => !deletedLabelIds.value.some((did) => normalizeId(did) === normalizeId(l.id))
    )
    syncLabelModels() // Sync after fetching labels
  } catch (error) {
    console.error('Failed to fetch labels:', error)
    alerts.error('Failed to load labels')
  }
}

function handleLabelsAdded(selected) {
  selected.forEach((l) => {
    newUnsavedLabels.value.push({
      id: l.tempId,
      product: l.product,
      instructions: l.instructions,
      warning: l.warning,
      _state: 'unsaved',
      _dirty: false
    })
  })

  syncLabelModels() // Sync after adding new labels
  showModal.value = false
  alerts.success(`Added ${selected.length} new label(s)`)
}

function toggleLabelSelection(labelId) {
  const normalizedId = normalizeId(labelId)
  const index = selectedLabels.value.findIndex((id) => normalizeId(id) === normalizedId)

  if (index > -1) {
    selectedLabels.value.splice(index, 1)
  } else {
    selectedLabels.value.push(labelId)
  }
}

function removeLabel(labelId) {
  const normalizedId = normalizeId(labelId)
  const l = labelModels.value[normalizedId]

  if (!l) {
    alerts.error('Label not found')
    return
  }

  if (l._state === 'unsaved') {
    newUnsavedLabels.value = newUnsavedLabels.value.filter(
      (x) => normalizeId(x.id) !== normalizedId
    )
    delete labelModels.value[normalizedId]
    alerts.info('Unsaved label removed')
  } else {
    deletedLabelIds.value.push(labelId)
    labels.value = labels.value.filter((x) => normalizeId(x.id) !== normalizedId)
    delete labelModels.value[normalizedId]
    alerts.success('Label deleted')
  }

  // Remove from selection
  selectedLabels.value = selectedLabels.value.filter((id) => normalizeId(id) !== normalizedId)
}

function updateLabel(labelId, updated) {
  const normalizedId = normalizeId(labelId)
  const l = labelModels.value[normalizedId]

  if (!l) {
    console.warn('Label model not found for update:', labelId)
    return
  }

  // Update the model directly (this is now safe since it's a ref)
  Object.assign(l, updated)

  // No need to manually track dirty state anymore -
  // hasUnsavedChanges computed will detect the change by comparing with source

  alerts.info('Label updated (not saved)')
}

async function saveLabels() {
  try {
    // Save new unsaved labels
    const createPromises = newUnsavedLabels.value.map(async (l) => {
      const normalizedId = normalizeId(l.id)
      const model = labelModels.value[normalizedId]

      // Use the model data (which has user edits) instead of the source
      const data = {
        product: model.product,
        instructions: model.instructions,
        warning: model.warning
      }

      const res = await window.api.createClientLabel(
        route.params.id,
        data.product,
        data.instructions,
        data.warning
      )
      return { ...data, id: res.lastInsertRowid, _state: 'saved', _dirty: false }
    })

    await Promise.all(createPromises)

    // Add created labels to source
    // labels.value.push(...createdLabels)
    newUnsavedLabels.value = []

    // Find dirty labels by comparing models with source
    const dirtyUpdates = labels.value
      .filter((sourceLabel) => {
        const normalizedId = normalizeId(sourceLabel.id)
        const model = labelModels.value[normalizedId]

        if (!model) return false

        // Check if any field has changed
        return (
          model.product !== sourceLabel.product ||
          model.instructions !== sourceLabel.instructions ||
          model.warning !== sourceLabel.warning
        )
      })
      .map((sourceLabel) => ({
        id: sourceLabel.id,
        normalizedId: normalizeId(sourceLabel.id)
      }))

    // Update dirty labels using model data
    const updatePromises = dirtyUpdates.map(async ({ id, normalizedId }) => {
      const model = labelModels.value[normalizedId]

      const data = {
        product: model.product,
        instructions: model.instructions,
        warning: model.warning
      }

      await window.api.updateClientLabel(id, model.product, model.instructions, model.warning)

      // Update source label with saved data
      const labelIndex = labels.value.findIndex((l) => normalizeId(l.id) === normalizedId)
      if (labelIndex > -1) {
        labels.value[labelIndex].product = data.product
        labels.value[labelIndex].instructions = data.instructions
        labels.value[labelIndex].warning = data.warning
      }
    })

    await Promise.all(updatePromises)

    // Handle deletions
    const deletePromises = deletedLabelIds.value.map((id) => window.api.deleteClientLabel(id))
    await Promise.all(deletePromises)
    deletedLabelIds.value = []

    // Sync models after saving to ensure they match source
    // syncLabelModels()
    refreshClientLabels()

    alerts.success('All changes saved')
  } catch (error) {
    console.error('Save error:', error)
    alerts.error('Failed to save some changes')
  }
}

const saveLabelsConfirmed = async () => {
  if (await confirm('Save all changes to labels?')) {
    await saveLabels()
  }
  // if (!confirm('Save all changes to labels?')) return

  // try {
  //   await saveLabels()
  // } catch (error) {
  //   console.error('Print queue error:', error)
  //   alerts.error('Failed to print queue')
  // }
}

const queueLabel = async (labelId) => {
  const normalizedId = normalizeId(labelId)
  const label = labelModels.value[normalizedId]

  await window.api.addToQueue({
    product: label.product,
    instructions: label.instructions,
    warning: label.warning,
    client: client.value.name
  })

  if (!label) {
    alerts.error('Label not found')
    return
  }
  await getQueueCount()

  // Add to queue logic here
  alerts.success('Label added to queue')
}

const printLabel = async (id) => {
  const normalizedId = normalizeId(id)
  const label = labelModels.value[normalizedId]

  if (!label) {
    alerts.error('Label not found')
    return
  }

  try {
    playSoundIfEnabled()
    await window.api.printerPrint([
      {
        ...toRaw(label),
        client: client.value ? client.value.name : '',
        user: currentUser.value?.name || null,
        timestamp: formattedDate.value
      }
    ])
    alerts.success('Label sent to printer')
  } catch (error) {
    console.error('Print error:', error)
    alerts.error('Failed to print label')
  }
}

// Bulk Actions
const bulkPrint = async () => {
  if (!selectedLabels.value.length) {
    alerts.error('No labels selected to print')
    return
  }

  try {
    // Get labels using normalized IDs
    const jobs = selectedLabels.value
      .map((id) => {
        const normalizedId = normalizeId(id)
        return labelModels.value[normalizedId]
      })
      .filter(Boolean)

    if (!jobs.length) {
      alerts.error('Selected labels not found')
      return
    }

    // Prepare job list with client and user data
    const jobList = jobs.map((j) => ({
      ...toRaw(j),
      client: client.value ? client.value.name : '',
      user: currentUser.value?.name || null,
      timestamp: formattedDate.value
    }))

    playSoundIfEnabled()
    await window.api.printerPrint(jobList)
    alerts.success(`Sent ${jobList.length} label(s) to the printer`)

    // Clear selection after successful print
    selectedLabels.value = []
  } catch (err) {
    console.error('Bulk print error:', err)
    alerts.error('Failed to send jobs to printer')
  }
}

const bulkQueue = async () => {
  if (!selectedLabels.value.length) {
    alerts.error('No labels selected to queue')
    return
  }

  try {
    const successCount = []
    const failedCount = []

    // Process each selected label one at a time
    for (const labelId of selectedLabels.value) {
      const normalizedId = normalizeId(labelId)
      const label = labelModels.value[normalizedId]

      if (!label) {
        failedCount.push(labelId)
        continue
      }

      try {
        // Send label data to API - one at a time
        await window.api.addToQueue({
          product: label.product,
          instructions: label.instructions,
          warning: label.warning,
          client: client.value.name
        })

        successCount.push(labelId)

        // If it was an unsaved label, remove it from the unsaved list
        if (label._state === 'unsaved') {
          newUnsavedLabels.value = newUnsavedLabels.value.filter(
            (x) => normalizeId(x.id) !== normalizedId
          )
          delete labelModels.value[normalizedId]
        }
      } catch (error) {
        console.error(`Failed to queue label ${labelId}:`, error)
        failedCount.push(labelId)
      }
    }
    await getQueueCount()

    // Show results
    if (successCount.length > 0) {
      alerts.success(`Successfully queued ${successCount.length} label(s)`)
    }

    if (failedCount.length > 0) {
      alerts.error(`Failed to queue ${failedCount.length} label(s)`)
    }

    // Clear selection
    selectedLabels.value = []
  } catch (error) {
    console.error('Bulk queue error:', error)
    alerts.error('Failed to queue labels')
  }
}

const bulkDelete = async () => {
  if (!selectedLabels.value.length) {
    alerts.error('No labels selected to delete')
    return
  }

  if (await confirm(`Delete ${selectedLabels.value.length} selected label(s)?`)) {
    try {
      const normalizedIds = selectedLabels.value.map(normalizeId)

      // Separate saved and unsaved labels
      const savedToDelete = []
      const unsavedToDelete = []

      normalizedIds.forEach((normalizedId) => {
        const label = labelModels.value[normalizedId]
        if (label) {
          if (label._state === 'unsaved') {
            unsavedToDelete.push(normalizedId)
          } else {
            savedToDelete.push(normalizedId)
          }
        }
      })

      // Queue saved labels for deletion
      savedToDelete.forEach((normalizedId) => {
        const originalId = labels.value.find((l) => normalizeId(l.id) === normalizedId)?.id
        if (originalId) {
          deletedLabelIds.value.push(originalId)
        }
      })

      // Remove from local arrays
      labels.value = labels.value.filter((l) => {
        const normalizedId = normalizeId(l.id)
        return !normalizedIds.includes(normalizedId)
      })

      newUnsavedLabels.value = newUnsavedLabels.value.filter((l) => {
        const normalizedId = normalizeId(l.id)
        return !normalizedIds.includes(normalizedId)
      })

      // Remove from labelModels
      normalizedIds.forEach((id) => {
        delete labelModels.value[id]
      })

      alerts.success(`Deleted ${selectedLabels.value.length} label(s)`)
      selectedLabels.value = []
    } catch (error) {
      console.error('Bulk delete error:', error)
      alerts.error('Failed to delete some labels')
    }
  }
}

// Refresh Methods
const refresh = async () => {
  await getClient(route.params.id)
  await getClientLabels(route.params.id)
  await getQueueCount()
}

const refreshClientLabels = async () => {
  await getClientLabels(route.params.id)
}

const refreshClient = async () => {
  if (isRefreshing.value) return
  isRefreshing.value = true

  try {
    await refresh()
    alerts.info('Client data refreshed')
  } catch (error) {
    console.error('Refresh error:', error)
    alerts.error('Failed to refresh client data')
  } finally {
    setTimeout(() => {
      isRefreshing.value = false
    }, 1000)
  }
}

// Navigation and Actions
const goBack = () => {
  router.push({ name: 'Clients' })
}

onMounted(async () => {
  await refresh()

  syncLabelModels() // Initial sync

  mediaQuery.addEventListener('change', handleMediaChange)

  if (isDesktop.value && labelsContainer.value) {
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
