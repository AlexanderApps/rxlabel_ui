<template>
  <div class="h-full w-full dark:bg-gray-900 dark:text-white">
    <div class="grid grid-rows-[3.5rem_3rem_1fr] h-full">
      <Header
        title="Medication Label"
        :badge-label="`Queue: ${queueCount}`"
        :badge-mode="queueCount <= 0 ? 'danger' : 'info'"
      >
        <template #actions>
          <button class="btn-icon" @click="goToSettings">
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

          <button class="btn-queue" @click="goToQueue">View Queue</button>
        </template>
      </Header>
      <div
        class="flex h-12 w-full shadow-xs items-center px-5 mb-4 gap-x-4 border-b border-gray-300/60 dark:border-gray-800/60 dark:bg-gray-900 dark:text-white"
      >
        <div class="flex items-center">
          <label for="search" class="sr-only">Search</label>
          <div class="relative w-full z-50">
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
            <input
              id="search"
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
            <input
              id="client"
              v-model="client"
              type="text"
              class="h-7 px-3 py-1.5 border rounded-md ps-3 bg-gray-300/50 dark:bg-gray-800 border-gray-300/50 dark:border-gray-700/60 text-sm focus:outline focus:outline-gray-500/50 block w-full placeholder:text-body"
              placeholder="Client Name"
            />
          </div>
        </div>
      </div>
      <div
        class="label-container w-full h-[calc(100vh-6.5rem)] overflow-auto grid grid-cols-[repeat(auto-fill,350px)] gap-7.5 p-5 justify-center dark:bg-gray-900 dark:text-white"
      >
        <LabelCardV2
          v-for="label in labels"
          :key="label.id"
          v-model="labelModels[label.id]"
          :current-date="curDate"
          :client-name="client"
          @remove="() => removeLabelConfirmed(label.id)"
          @update="() => saveLabel(label.id)"
          @queue="() => addToQueue(label.id)"
          @print="() => printLabel(label.id)"
        />
      </div>
    </div>
  </div>
  <ConfirmModal
    :show="modalState.show"
    :message="modalState.message"
    @confirm="onConfirm"
    @cancel="onCancel"
  />
  <SettingsModal
    :show="showSettings"
    :initial-settings="settings"
    @close="showSettings = false"
    @save="handleSaveSettings"
  />
</template>

<script setup>
import { ref, onMounted, watch, reactive } from 'vue'
import { useRouter } from 'vue-router'
import LabelCardV2 from '../components/LabelCardV2.vue'
import ConfirmModal from '../components/ConfirmModal.vue'
import SettingsModal from './SettingsModal.vue'
import { useAlerts } from '../composables/useAlerts.js'
import MoreMenu from '../components/MoreMenu.vue'
import Header from '../components/Header.vue'

const router = useRouter()
const alerts = useAlerts()

// ----- State -----
const labels = ref([])
const labelModels = reactive({})
const search = ref('')
const client = ref('')
const queueCount = ref(0)
const curDate = ref(new Date().toLocaleDateString())

const showSettings = ref(false)
const isRefreshing = ref(false)
const isOpeningSettings = ref(false)

// IMPORTANT: make this reactive, not ref
const settings = reactive({
  facility_name: '',
  facility_address: '',
  facility_phone: '',
  queue_size: 0,
  theme: 'system',
  date_format: ''
})

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

// ----- I/O -----
const fetchSettings = async () => {
  const data = await window.api.getSettings()
  if (data) {
    // Instead of Object.assign(settings.value, data)
    for (const k in data) {
      settings[k] = data[k]
    }
  }
}

const fetchQueueCount = async () => {
  queueCount.value = await window.api.countQueue()
}

const loadLabels = async () => {
  const data = await window.api.getLabels(search.value)
  labels.value = data

  // reset cache
  for (const k in labelModels) delete labelModels[k]

  // hydrate models
  data.forEach((l) => (labelModels[l.id] = { ...l }))
}

// ----- Actions -----
const refresh = async () => {
  await Promise.all([loadLabels(), fetchQueueCount()])
}

const refreshLabels = async () => {
  if (isRefreshing.value) return
  isRefreshing.value = true

  await refresh()

  setTimeout(() => {
    alerts.info('Labels refreshed.')
    isRefreshing.value = false
  }, 800)
}

const saveLabel = async (id) => {
  const selected = { ...labelModels[id] }
  await window.api.updateLabel(id, selected.product, selected.instructions, selected.warning)
  await refresh()
  alerts.success('Update completed sucessfully')
}

const removeLabelConfirmed = async (id) => {
  if (await confirm('Delete this item?')) {
    await window.api.deleteLabel(id)
    await refresh()
    alerts.success('Delete completed successfully')
  }
}

const addToQueue = async (id) => {
  await window.api.addToQueue({ ...labelModels[id] })
  await fetchQueueCount()
  alerts.success('Item added to queue')
}

function soothingPrinterSound() {
  const context = new (window.AudioContext || window.webkitAudioContext)()

  // 1. Create a GainNode to control the "envelope" (fade-in/fade-out)
  const gainNode = context.createGain()
  gainNode.connect(context.destination)

  // 2. Setup frequencies (using a "Perfect Fifth" interval for a musical chime)
  const frequencies = [880, 1320] // A5 and E6 (higher is clearer/less intrusive)

  const startTime = context.currentTime
  const duration = 0.5 // Total length of the sound

  frequencies.forEach((freq) => {
    const osc = context.createOscillator()
    osc.type = 'sine' // Purest, smoothest wave
    osc.frequency.setValueAtTime(freq, startTime)
    osc.connect(gainNode)
    osc.start(startTime)
    osc.stop(startTime + duration)
  })

  // 3. Define the "Soothing" Envelope
  // Start silent
  gainNode.gain.setValueAtTime(0, startTime)
  // Attack: Quick fade in to 0.1 volume (10ms) to avoid a "pop"
  gainNode.gain.linearRampToValueAtTime(0.1, startTime + 0.02)
  // Decay/Release: Smoothly fade to silence over the rest of the duration
  gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration)
}

const printLabel = async (id) => {
  // manualBeep()
  soothingPrinterSound()
  await window.api.printerPrint({
    ...labelModels[id],
    ...settings,
    user: 'Ann',
    client_name: 'Jim Doe'
  })
  alerts.error('Print functionality not implemented.')
}

const goToQueue = () => {
  router.push({ name: 'MedicationLabelQueue' })
}

const goToSettings = () => {
  if (isOpeningSettings.value) return
  isOpeningSettings.value = true

  setTimeout(() => {
    showSettings.value = true
    isOpeningSettings.value = false
  }, 200)
}

const moreActions = [
  {
    label: 'Clients',
    handler: () => router.push({ name: 'Clients' })
  },
  {
    label: 'Logout',
    handler: () => console.log('first')
  }
]

// ----- Lifecycle -----
onMounted(async () => {
  await fetchSettings()
  await refresh()
})

// ----- Watch -----
watch(search, loadLabels)
</script>
