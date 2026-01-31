<template>
  <div class="w-full h-full dark:bg-gray-900 dark:text-white">
    <div class="grid grid-rows-[3.5rem_1fr] h-full">
      <Header
        title="Users"
        :badge-label="`Users: ${clientCount}`"
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
          <!-- <button
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
          </button> -->
          <GlobalMoreMenu :includes="['View Labels', 'Settings', 'Logout']" />

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
        <UserTable ref="usersRef" />
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAlerts } from '../composables/useAlerts.js'
import Header from '../components/Header.vue'
import GlobalMoreMenu from '../components/GlobalMoreMenu.vue'
import UserTable from '../components/UserTable.vue'
// import { useConfirm } from '../composables/useConfirm.js'

// const { confirm } = useConfirm()
const router = useRouter()
const userCount = ref(0)
const alerts = useAlerts()
const isRefreshing = ref(false)
const usersRef = ref(null)

const fetchUserCount = async () => {
  // userCount.value = await window.api.countClients()
}

const refresh = async () => {
  usersRef.value.refresh()
  await fetchUserCount()
}

const refreshUsers = async () => {
  if (isRefreshing.value) return
  isRefreshing.value = true
  await refresh()

  setTimeout(() => {
    isRefreshing.value = false
    alerts.info('User list refreshed.')
  }, 1000)
}

//
function goToQueue() {
  router.push({ name: 'MedicationLabelQueue' })
}

// onMounted(() => {
//   refresh()
// })
</script>
