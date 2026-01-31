<template>
  <div class="w-full h-full dark:bg-gray-900 dark:text-white">
    <div class="grid grid-rows-[3.5rem_1fr] h-full">
      <Header
        title="Medication Label Queue"
        :badge-label="`Queue: ${queueCount}`"
        :badge-mode="queueCount <= 0 ? 'danger' : 'info'"
      >
        <template #actions>
          <button
            class="p-2 rounded-lg bg-gray-200/60 dark:bg-gray-700 hover:bg-gray-300 transition-colors text-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            @click="refreshLabels"
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
            v-show="queueCount > 0"
            class="text-sm font-medium py-1 px-2 rounded-lg bg-gray-200/60 dark:bg-gray-700 hover:bg-gray-300 transition-colors text-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            @click="confirmClearQueue"
          >
            Clear Queue
          </button>
          <button
            v-show="queueCount > 0"
            class="text-sm font-medium py-1 px-2 rounded-lg bg-gray-200/60 dark:bg-gray-700 hover:bg-gray-300 transition-colors text-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            @click="printQueue"
          >
            Print Queue
          </button>
          <GlobalMoreMenu :includes="['Clients', 'Users', 'Settings', 'Logout']" />
          <button
            class="text-sm font-medium text-gray-50 bg-black dark:bg-gray-100 dark:hover:bg-gray-100/70 dark:text-gray-900 py-1 px-2 rounded-lg"
            @click="goToLabel"
          >
            View Labels
          </button>
        </template>
      </Header>
      <div
        class="label-container w-full h-[calc(100vh-3.5rem)] overflow-auto grid grid-cols-[repeat(auto-fill,350px)] gap-7.5 p-5 justify-center dark:bg-gray-900 dark:text-white"
      >
        <LabelQueueCardV2
          v-for="label in labels"
          :key="label.id"
          v-model="labelModels[label.id]"
          :current-date="formattedDate"
          :current-user="currentUser?.name || ''"
          @remove="() => removeFromQueue(label.id)"
          @update="() => saveLabel(label.id)"
          @print="() => printLabel(label.id)"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import LabelQueueCardV2 from '../components/LabelQueueCardV2.vue'
import { useAlerts } from '../composables/useAlerts.js'
import Header from '../components/Header.vue'
import GlobalMoreMenu from '../components/GlobalMoreMenu.vue'
import { useSettings } from '../composables/useSettings.js'
import { useConfirm } from '../composables/useConfirm.js'

const router = useRouter()
const { formattedDate, currentUser, playSoundIfEnabled } = useSettings()
const labels = ref([])
const labelModels = reactive({})
const queueCount = ref(0)
const alerts = useAlerts()
const isRefreshing = ref(false)
const { confirm } = useConfirm()

/* =========================
 * Keyboard Shortcuts
 * ========================= */
const handleKeyDown = (event) => {
  const isModKey = event.ctrlKey || event.metaKey

  // Ctrl / Cmd + P → Print Queue
  if (isModKey && event.key.toLowerCase() === 'p') {
    event.preventDefault()
    printQueue()
  }

  // Ctrl / Cmd + I → Clear Queue
  if (isModKey && event.key.toLowerCase() === 'i') {
    event.preventDefault()
    confirmClearQueue()
  }
}

const confirmClearQueue = async () => {
  if (await confirm('Clear the entire queue?')) {
    await clearQueue()
    setTimeout(() => alerts.success('Queue cleared.'), 500)
  }
}

const printQueue = async () => {
  if (await confirm('Print all labels in the queue?')) {
    playSoundIfEnabled()

    const jobList = JSON.parse(JSON.stringify(Object.values(labelModels)))

    await window.api.printerPrint(jobList)

    alerts.success('Print jobs sent for all labels in the queue.')
  }
}

const loadQueueLabels = async () => {
  const data = await window.api.getQueue()
  labels.value = data

  // reset model cache
  Object.keys(labelModels).forEach((k) => delete labelModels[k])

  // hydrate editable models
  data.forEach((l) => (labelModels[l.id] = { ...l, _dirty: false }))
}

const fetchQueueCount = async () => {
  queueCount.value = await window.api.countQueue()
}

const removeFromQueue = async (id) => {
  await window.api.removeFromQueue(id)
  await loadQueueLabels()
  await fetchQueueCount()
  setTimeout(() => {
    alerts.success('Successfully removed label from queue.')
  }, 500)
}

const saveLabel = async (id) => {
  await window.api.updateLabel({ ...labelModels[id] })
  await loadQueueLabels()
}

const clearQueue = async () => {
  await window.api.clearQueue()
  await loadQueueLabels()
  await fetchQueueCount()
}

const printLabel = async (id) => {
  playSoundIfEnabled()
  await window.api.printerPrint({ ...labelModels[id] })
  alerts.error('Print functionality not implemented.')
}

const refresh = async () => {
  await loadQueueLabels()
  await fetchQueueCount()
}

const refreshLabels = async () => {
  if (isRefreshing.value) return
  isRefreshing.value = true
  await refresh()

  setTimeout(() => {
    isRefreshing.value = false
    alerts.info('Queue refreshed.')
  }, 1000)
}

function goToLabel() {
  router.push({ name: 'MedicationLabel' })
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
</script>
