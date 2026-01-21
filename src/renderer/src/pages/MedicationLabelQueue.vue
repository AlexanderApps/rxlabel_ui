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

          <!-- <button
            class="p-2 rounded-lg bg-gray-200/60 dark:bg-gray-700 hover:bg-gray-300 transition-colors text-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            @click="refreshLabels"
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
          </button> -->

          <button
            class="text-sm font-medium text-gray-50 bg-black dark:bg-gray-100 dark:hover:bg-gray-100/70 dark:text-gray-900 py-1 px-2 rounded-lg"
            @click="goToLabel"
          >
            Go back
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
          :current-date="curDate"
          :client-name="client"
          @remove="() => removeFromQueue(label.id)"
          @update="() => saveLabel(label.id)"
          @print="() => printLabel(label.id)"
        />
      </div>
    </div>
  </div>

  <ConfirmModal
    :show="confirmState.show"
    :message="confirmState.message"
    @confirm="onConfirm"
    @cancel="onCancel"
  />
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
import LabelQueueCardV2 from '../components/LabelQueueCardV2.vue'
import ConfirmModal from '../components/ConfirmModal.vue'
import { useAlerts } from '../composables/useAlerts.js'
import Header from '../components/Header.vue'
import MoreMenu from '../components/MoreMenu.vue'

const router = useRouter()
const labels = ref([])
const labelModels = reactive({})
const client = ref('')
const settings = ref({ facility_name: '', facility_address: '', dateFormat: 'd1' })
const queueCount = ref(0)
const curDate = ref(new Date().toUTCString())
const alerts = useAlerts()
const isRefreshing = ref(false)

const confirmState = reactive({
  show: false,
  message: '',
  resolve: null
})

function confirm(message) {
  return new Promise((resolve) => {
    confirmState.message = message
    confirmState.resolve = resolve
    confirmState.show = true
  })
}

const onConfirm = () => {
  confirmState.resolve(true)
  confirmState.show = false
}

const onCancel = () => {
  confirmState.resolve(false)
  confirmState.show = false
}

const confirmClearQueue = async () => {
  if (await confirm('Clear the entire queue?')) {
    await clearQueue()
    setTimeout(() => alerts.success('Queue cleared.'), 500)
  }
}

const printQueue = async () => {
  if (await confirm('Print all labels in the queue?')) {
    for (const label of labels.value) {
      console.log({ ...labelModels[label.id], client: client.value })
    }
    setTimeout(() => {
      alerts.success('Print jobs sent for all labels in the queue.')
    }, 500)
  }
}

const fetchSettings = async () => {
  const data = await window.api.getSettings()
  if (data) Object.assign(settings.value, data)
}

const loadQueueLabels = async () => {
  const data = await window.api.getQueue()
  labels.value = data

  // reset model cache
  Object.keys(labelModels).forEach((k) => delete labelModels[k])

  // hydrate editable models
  data.forEach((l) => (labelModels[l.id] = { ...l }))
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
  soothingPrinterSound()
  await window.api.printerPrint({
    ...labelModels[id],
    ...settings.value,
    user: 'Ann',
    client_name: 'Jim Doe'
  })
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

onMounted(() => {
  fetchSettings()
  refresh()
})

// only reload when search input changes
// watch(search, loadLabels)
</script>
