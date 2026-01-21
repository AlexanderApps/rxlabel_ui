<template>
  <div class="w-full h-full dark:bg-gray-900 dark:text-white">
    <div class="grid grid-rows-[3.5rem_1fr] h-full">
      <Header
        title="Clients"
        :badge-label="`Clients: ${clientCount}`"
        :badge-mode="clientCount <= 0 ? 'danger' : 'info'"
      >
        <template #actions>
          <button
            class="p-2 rounded-lg bg-gray-200/60 dark:bg-gray-700 hover:bg-gray-300 transition-colors text-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            @click="refreshClients"
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
      <div
        class="label-container w-full h-[calc(100vh-3.5rem)] overflow-auto p-5 justify-center dark:bg-gray-900 dark:text-white items-center"
      >
        <ClientTable ref="clientsRef" clients="clients" />
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
import ConfirmModal from '../components/ConfirmModal.vue'
import { useAlerts } from '../composables/useAlerts.js'
import Header from '../components/Header.vue'
import MoreMenu from '../components/MoreMenu.vue'
import ClientTable from '../components/ClientTable.vue'

const router = useRouter()
// const labels = ref([])
// const clients = ref([])
// const labelModels = reactive({})
// const client = ref('')
const settings = ref({ facility_name: '', facility_address: '', dateFormat: 'd1' })
const clientCount = ref(0)
// const curDate = ref(new Date().toUTCString())
const alerts = useAlerts()
const isRefreshing = ref(false)
const clientsRef = ref(null)

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

// const printQueue = async () => {
//   if (await confirm('Print all labels in the queue?')) {
//     for (const label of labels.value) {
//       console.log({ ...labelModels[label.id], client: client.value })
//     }
//     setTimeout(() => {
//       alerts.success('Print jobs sent for all labels in the queue.')
//     }, 500)
//   }
// }

const fetchSettings = async () => {
  const data = await window.api.getSettings()
  if (data) Object.assign(settings.value, data)
}

const fetchclientCount = async () => {
  clientCount.value = await window.api.countClients()
}

// const removeFromQueue = async (id) => {
//   await window.api.removeFromQueue(id)
//   await loadClients()
//   await fetchclientCount()
//   setTimeout(() => {
//     alerts.success('Successfully removed label from queue.')
//   }, 500)
// }

// const saveLabel = async (id) => {
//   await window.api.updateLabel({ ...labelModels[id] })
//   await loadClients()
// }

const clearQueue = async () => {
  await window.api.clearQueue()
  await fetchclientCount()
}

const refresh = async () => {
  clientsRef.value.refresh()
  await fetchclientCount()
}

const refreshClients = async () => {
  if (isRefreshing.value) return
  isRefreshing.value = true
  await refresh()

  setTimeout(() => {
    isRefreshing.value = false
    alerts.info('Client list refreshed.')
  }, 1000)
}

//
function goToQueue() {
  router.push({ name: 'MedicationLabelQueue' })
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
  fetchSettings()
  refresh()
})
</script>
