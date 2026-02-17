<template>
  <div
    class="h-full w-full dark:bg-gray-900 dark:text-white"
    :class="{ 'pointer-events-none': showModal }"
  >
    <AddLabelModal :show="showModal" @close="showModal = false" @save="handleSave" />
    <div class="grid grid-rows-[3.5rem_3rem_1fr] h-full">
      <Header
        title="Medication Label"
        :badge-label="`Queue: ${queueCount}`"
        :badge-mode="queueCount <= 0 ? 'danger' : 'info'"
      >
        <template #actions>
          <!-- <button
            class="p-2 rounded-lg bg-gray-200/60 dark:bg-gray-700 hover:bg-gray-300 transition-colors text-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            @click="() => router.push({ name: 'TestLabelJson' })"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="bi bi-gear w-4 h-4"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path
                d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492M5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0"
              />
              <path
                d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115z"
              />
            </svg>
          </button> -->
          <button class="btn-icon" @click="openSettings">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="bi bi-gear w-4 h-4"
              fill="currentColor"
              viewBox="0 0 16 16"
              :class="isOpeningSettings ? 'animate-spin' : ''"
            >
              <path
                d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492M5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0"
              />
              <path
                d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115z"
              />
            </svg>
          </button>

          <button class="btn-icon" @click="refreshLabels">
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

          <GlobalMoreMenu :includes="['Clients', 'Users', 'Admin', 'Logout']" />

          <button class="btn-queue" @click="goToQueue">View Queue</button>
        </template>
      </Header>

      <!-- Search and Client -->
      <div
        class="flex h-12 w-full shadow-xs items-center justify-between px-5 mb-4 gap-x-4 border-b border-gray-300/60 dark:border-gray-800/60 dark:bg-gray-900 dark:text-white"
      >
        <div class="flex items-center gap-x-4">
          <div class="flex items-center">
            <label for="search" class="sr-only">Search</label>
            <div class="relative w-full">
              <div class="absolute inset-y-0 start-0 flex items-center ps-2 pointer-events-none">
                <svg
                  class="w-4 h-4 text-gray-600/60 dark:text-gray-500"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-width="2"
                    d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
                  />
                </svg>
              </div>
              <div class="absolute inset-y-0 end-2 flex items-center pointer-events-none">
                <kbd
                  class="text-[10px] font-sans px-1.5 py-0.5 rounded border-2 border-gray-400/50 text-gray-400"
                >
                  Ctrl + K
                </kbd>
              </div>
              <input
                id="search"
                ref="searchInput"
                v-model="search"
                type="text"
                class="h-7 px-3 py-1.5 bg-gray-300/50 dark:bg-gray-800 border border-gray-300/50 dark:border-gray-700/60 rounded-md ps-8 text-sm focus:outline focus:outline-gray-500/50 block w-full placeholder:text-body"
                placeholder="Search label..."
              />
            </div>
          </div>
          <div class="flex items-center">
            <label for="client" class="sr-only">Client Name</label>
            <div class="relative w-full">
              <div class="absolute inset-y-0 end-2 flex items-center pointer-events-none">
                <kbd
                  class="text-[10px] font-sans px-1.5 py-0.5 rounded border border-gray-400/50 text-gray-400"
                >
                  Ctrl + O
                </kbd>
              </div>
              <input
                id="client"
                ref="clientInput"
                v-model="client"
                type="text"
                class="h-7 px-3 py-1.5 border rounded-md ps-3 bg-gray-300/50 dark:bg-gray-800 border-gray-300/50 dark:border-gray-700/60 text-sm focus:outline focus:outline-gray-500/50 block w-full placeholder:text-body"
                placeholder="Client Name"
              />
            </div>
          </div>
        </div>
        <button
          class="flex items-center font-medium gap-1.5 h-7 px-3 py-1.5 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors text-sm whitespace-nowrap"
          @click="addNewLabel"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-3.5 h-3.5"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path
              d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"
            />
          </svg>
          Add Label
        </button>
      </div>

      <div
        class="label-container w-full h-[calc(100vh-6.5rem)] overflow-auto grid grid-cols-[repeat(auto-fill,350px)] gap-7.5 p-5 justify-center dark:bg-gray-900 dark:text-white"
      >
        <LabelCardV2
          v-for="label in labels"
          :key="label.id"
          v-model="labelModels[label.id]"
          :current-date="formattedDate"
          :client-name="client"
          :current-user="currentUser?.name || ''"
          @remove="() => removeLabelConfirmed(label.id)"
          @update="() => saveLabel(label.id)"
          @queue="() => addToQueue(label.id)"
          @print="() => printLabel(label.id)"
        />
        <!-- <LabelCardV3
          v-for="label in labels"
          :key="label.id"
          v-model="labelModels[label.id]"
          :current-date="formattedDate"
          :client-name="client"
          :current-user="currentUser?.name || ''"
          @remove="() => removeLabelConfirmed(label.id)"
          @update="() => saveLabel(label.id)"
          @queue="() => addToQueue(label.id)"
          @print="() => printLabel(label.id)"
        /> -->
      </div>
    </div>
  </div>
</template>

<script setup>
/* =========================
 * Imports
 * ========================= */
import { ref, reactive, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAlerts } from '../composables/useAlerts.js'
import { useSettings, showSettings } from '../composables/useSettings.js'
import { useConfirm } from '../composables/useConfirm.js'

import LabelCardV2 from '../components/LabelCardV2.vue'
import LabelCardV3 from '../components/LabelCardV3.vue'
import Header from '../components/Header.vue'
import AddLabelModal from './AddLabelModal.vue'
import GlobalMoreMenu from '../components/GlobalMoreMenu.vue'

/* =========================
 * Composables / Globals
 * ========================= */
const router = useRouter()
const alerts = useAlerts()
const { confirm } = useConfirm()
const { formattedDate, currentUser, playSoundIfEnabled, closeSettings } = useSettings()

/* =========================
 * State
 * ========================= */
const labels = ref([])
const labelModels = reactive({})

const search = ref('')
const client = ref('')
const queueCount = ref(0)

const searchInput = ref(null)
const clientInput = ref(null)

const showModal = ref(false)
const isRefreshing = ref(false)
const isOpeningSettings = ref(false)

/* =========================
 * Keyboard Shortcuts
 * ========================= */
const handleKeyDown = (event) => {
  // ESC → Close modal if open
  if (event.key === 'Escape' && (showModal.value || showSettings.value)) {
    event.preventDefault()
    showModal.value = false
    closeSettings()
    return
  }
  const isModKey = event.ctrlKey || event.metaKey

  // Ctrl / Cmd + K → Focus search
  if (isModKey && event.key.toLowerCase() === 'k') {
    event.preventDefault()
    searchInput.value?.focus()
  }

  // Ctrl / Cmd + O → Focus client
  if (isModKey && event.key.toLowerCase() === 'o') {
    event.preventDefault()
    clientInput.value?.focus()
  }

  // Ctrl / Cmd + N → New label
  if (isModKey && event.key.toLowerCase() === 'n') {
    event.preventDefault()
    addNewLabel()
  }
}

/* =========================
 * API Helpers
 * ========================= */
const fetchQueueCount = async () => {
  try {
    queueCount.value = await window.api.countQueue()
  } catch (err) {
    alerts.error('Failed to fetch queue count.')
    console.error(err)
  }
}

const loadLabels = async () => {
  try {
    const data = await window.api.getLabels(search.value)
    labels.value = data

    // Reset local cache
    for (const k in labelModels) delete labelModels[k]

    // Hydrate local models
    data.forEach((l) => {
      labelModels[l.id] = {
        ...l,
        client: client.value,
        _dirty: false
      }
    })
  } catch (err) {
    alerts.error('Failed to load labels.')
    console.error(err)
  }
}

/* =========================
 * Core Actions
 * ========================= */
const refresh = async () => {
  await Promise.all([loadLabels(), fetchQueueCount()])
}

const refreshLabels = async () => {
  if (isRefreshing.value) return

  isRefreshing.value = true
  try {
    await refresh()
    setTimeout(() => {
      alerts.info('Labels refresh completed.')
    }, 500)
  } catch (err) {
    alerts.error('Failed to refresh labels.')
    console.error(err)
  } finally {
    setTimeout(() => {
      isRefreshing.value = false
    }, 800)
  }
}

/* =========================
 * CRUD Operations
 * ========================= */
const handleSave = async (labels_list) => {
  try {
    const createPromises = labels_list.map((l) =>
      window.api.createLabel(l.product, l.instructions, l.warning)
    )

    await Promise.all(createPromises)
    showModal.value = false
    await refresh()

    alerts.success('Successfully added item(s) to labels')
  } catch (err) {
    alerts.error('Failed to save labels.')
    console.error(err)
  }
}

const saveLabel = async (id) => {
  try {
    const selected = { ...labelModels[id] }
    await window.api.updateLabel(id, selected.product, selected.instructions, selected.warning)

    await refresh()
    alerts.success('Update completed successfully')
  } catch (err) {
    alerts.error('Failed to update label.')
    console.error(err)
  }
}

const removeLabelConfirmed = async (id) => {
  try {
    const accepted = await confirm('Delete this item?')
    if (!accepted) return

    await window.api.deleteLabel(id)
    await refresh()

    alerts.success('Delete completed successfully')
  } catch (err) {
    alerts.error('Failed to delete label.')
    console.error(err)
  }
}

/* =========================
 * Queue & Printing
 * ========================= */
const addToQueue = async (id) => {
  try {
    await window.api.addToQueue({ ...labelModels[id] })
    await fetchQueueCount()

    alerts.success('Item added to queue successfully.')
  } catch (err) {
    alerts.error('Failed to add item to queue.')
    console.error(err)
  }
}

const printLabel = async (id) => {
  try {
    playSoundIfEnabled()
    console.log({ ...labelModels[id], timestamp: formattedDate.value })
    await window.api.printerPrint({ ...labelModels[id], timestamp: formattedDate.value })

    alerts.error('Print functionality not implemented.')
  } catch (err) {
    alerts.error('Printing failed.')
    console.error(err)
  }
}

/* =========================
 * Navigation / UI Actions
 * ========================= */
const goToQueue = () => {
  router.push({ name: 'MedicationLabelQueue' })
}

const openSettings = () => {
  if (isOpeningSettings.value) return

  isOpeningSettings.value = true
  setTimeout(() => {
    showSettings.value = true
    isOpeningSettings.value = false
  }, 200)
}

const addNewLabel = () => {
  showModal.value = true
}

/* =========================
 * Lifecycle
 * ========================= */
onMounted(async () => {
  window.addEventListener('keydown', handleKeyDown)
  await refresh()
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
})

/* =========================
 * Watchers
 * ========================= */
watch(search, loadLabels)
</script>
