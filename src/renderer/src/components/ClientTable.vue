<template>
  <div class="flex flex-col h-[calc(100vh-6rem)] bg-gray-50 dark:bg-gray-900">
    <!-- Sticky Search Header -->
    <div
      class="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 shadow-sm"
    >
      <div class="max-w-7xl mx-auto">
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              class="h-5 w-5 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
          <div class="absolute inset-y-0 end-10 flex items-center pointer-events-none">
            <kbd
              class="text-[10px] font-sans px-1.5 py-0.5 rounded border-2 border-gray-400/50 text-gray-400"
            >
              Ctrl + K
            </kbd>
          </div>
          <input
            ref="searchInput"
            v-model="searchQuery"
            type="text"
            placeholder="Search by ID, Name, Contact, or Email..."
            class="block w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            @input="currentPage = 1"
          />
          <div v-if="searchQuery" class="absolute inset-y-0 right-0 pr-3 flex items-center">
            <button
              class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 select-none"
              @click="searchQuery = ''"
            >
              <svg
                class="h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>

        <!-- Results count and Bulk Actions -->
        <div class="mt-3 flex items-center justify-between">
          <div class="text-sm text-gray-600 dark:text-gray-400">
            {{ sortedData.length }} {{ sortedData.length === 1 ? 'client' : 'clients' }} found
            <span
              v-if="selected.length > 0"
              class="ml-2 text-blue-600 dark:text-blue-400 font-medium"
            >
              ({{ selected.length }} selected)
            </span>
          </div>

          <!-- Bulk Actions -->
          <div v-if="selected.length > 0" class="flex items-center gap-2">
            <span class="text-sm text-gray-600 dark:text-gray-400 font-medium mr-2"
              >Bulk Actions:</span
            >
            <button
              class="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow-md select-none"
              @click="bulkSendToQueue"
            >
              <svg
                class="w-4 h-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"
                />
              </svg>
              Queue ({{ selected.length }})
            </button>
            <button
              class="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow-md select-none"
              @click="bulkPrintLabels"
            >
              <svg
                class="w-4 h-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z"
                  clip-rule="evenodd"
                />
              </svg>
              Print ({{ selected.length }})
            </button>
            <button
              class="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow-md select-none"
              @click="bulkDeleteClients"
            >
              <svg
                class="w-4 h-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                  clip-rule="evenodd"
                />
              </svg>
              Delete ({{ selected.length }})
            </button>
          </div>
          <button
            class="flex items-center font-medium gap-1.5 h-7 px-3 py-1.5 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors text-sm whitespace-nowrap"
            @click="showClientModal = true"
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
            Add Client
          </button>
        </div>
      </div>
    </div>

    <!-- Scrollable Table Container -->
    <div class="flex-1 overflow-auto px-6 py-4 custom-scrollbar">
      <div class="max-w-7xl mx-auto">
        <div
          class="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
        >
          <div
            class="overflow-x-auto overflow-y-auto custom-scrollbar"
            style="max-height: calc(100vh - 280px)"
            @scroll="closeMenu"
          >
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead
                class="bg-linear-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 sticky top-0 z-5"
              >
                <tr>
                  <th class="px-4 py-4 bg-gray-50 dark:bg-gray-900">
                    <input
                      type="checkbox"
                      :checked="
                        paginatedData.length > 0 && selected.length === paginatedData.length
                      "
                      class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 cursor-pointer"
                      @change="toggleSelectAll"
                    />
                  </th>

                  <th
                    v-for="key in ['id', 'name', 'contact', 'email']"
                    :key="key"
                    class="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 select-none transition-colors bg-gray-50 dark:bg-gray-900"
                    @click="handleSort(key)"
                  >
                    <div class="flex items-center gap-2">
                      {{ key }}
                      <span v-if="sortConfig.key === key" class="text-blue-600 dark:text-blue-400">
                        {{ sortConfig.direction === 'asc' ? '↑' : '↓' }}
                      </span>
                      <span v-else class="text-gray-300 dark:text-gray-600"> ↕ </span>
                    </div>
                  </th>

                  <th
                    class="px-6 py-4 text-right text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider bg-gray-50 dark:bg-gray-900"
                  >
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody
                class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700"
              >
                <tr
                  v-for="(item, idx) in paginatedData"
                  :key="item.id"
                  class="hover:bg-blue-50 dark:hover:bg-gray-700/50 transition-colors"
                  :class="selected.includes(item.id) ? 'bg-blue-50 dark:bg-blue-900/20' : ''"
                >
                  <td class="px-4 py-4">
                    <input
                      type="checkbox"
                      :checked="selected.includes(item.id)"
                      class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 cursor-pointer"
                      @change="toggleSelect(item.id)"
                    />
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900 dark:text-gray-100">
                      #{{ item.id }}
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900 dark:text-gray-100 font-medium">
                      {{ item.name }}
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-600 dark:text-gray-400">
                      {{ item.contact }}
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-600 dark:text-gray-400">
                      {{ item.email }}
                    </div>
                  </td>

                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <div class="flex justify-end gap-2">
                      <button
                        class="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-all duration-200 hover:scale-110 select-none"
                        title="Edit"
                        @click="handleEdit(item.id)"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          viewBox="0 0 16 16"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5"
                          />
                          <path
                            fill-rule="evenodd"
                            d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0z"
                          />
                        </svg>
                      </button>
                      <button
                        class="p-2 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-all duration-200 hover:scale-110 select-none"
                        title="Delete"
                        @click="deleteClientConfirmed(item.id)"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          class="w-4 h-4"
                          viewBox="0 0 16 16"
                        >
                          <path
                            d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z"
                          />
                        </svg>
                      </button>
                      <MoreMenu
                        :actions="getClientActions(item.id)"
                        :is-open="openMenuId === item.id"
                        @toggle="toggleMenu(item.id)"
                      >
                        <template #trigger>
                          <button
                            class="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 text-gray-700 dark:text-gray-300 select-none"
                            :class="{ 'bg-gray-200 dark:bg-gray-600': openMenuId === item.id }"
                            title="More actions"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              class="w-4 h-4"
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
                    </div>
                  </td>
                </tr>

                <!-- Empty state -->
                <tr v-if="paginatedData.length === 0">
                  <td colspan="6" class="px-6 py-12 text-center">
                    <div
                      class="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400"
                    >
                      <svg
                        class="w-16 h-16 mb-4 text-gray-300 dark:text-gray-600"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                        />
                      </svg>
                      <p class="text-lg font-medium">No clients found</p>
                      <p class="text-sm mt-1">Try adjusting your search terms</p>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Sticky Pagination Footer -->
    <div
      class="sticky bottom-0 z-10 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-6 py-4 shadow-lg"
    >
      <div class="max-w-7xl mx-auto flex items-center justify-between">
        <div class="flex items-center gap-4">
          <div class="text-sm text-gray-700 dark:text-gray-300 font-medium">
            Showing
            <span class="font-semibold text-gray-900 dark:text-white">{{ startIdx + 1 }}</span>
            to
            <span class="font-semibold text-gray-900 dark:text-white">{{
              Math.min(startIdx + itemsPerPage, sortedData.length)
            }}</span>
            of
            <span class="font-semibold text-gray-900 dark:text-white">{{ sortedData.length }}</span>
            results
          </div>

          <!-- Rows per page selector -->
          <div class="flex items-center gap-2">
            <label
              for="rows-per-page"
              class="text-sm text-gray-700 dark:text-gray-300 font-medium whitespace-nowrap"
            >
              Rows per page:
            </label>
            <select
              id="rows-per-page"
              v-model="itemsPerPage"
              class="px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer transition-all"
              @change="currentPage = 1"
            >
              <option :value="5">5</option>
              <option :value="10">10</option>
              <option :value="25">25</option>
              <option :value="50">50</option>
              <option :value="100">100</option>
            </select>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <button
            class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 select-none"
            :disabled="currentPage === 1"
            @click="currentPage = Math.max(1, currentPage - 1)"
          >
            <span class="flex items-center gap-1">
              <svg
                class="w-4 h-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clip-rule="evenodd"
                />
              </svg>
              Previous
            </span>
          </button>

          <div
            class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
          >
            Page
            <span class="font-semibold text-blue-600 dark:text-blue-400">{{ currentPage }}</span> of
            <span class="font-semibold">{{ totalPages }}</span>
          </div>

          <button
            :disabled="currentPage === totalPages"
            class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 select-none"
            @click="currentPage = Math.min(totalPages, currentPage + 1)"
          >
            <span class="flex items-center gap-1">
              Next
              <svg
                class="w-4 h-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clip-rule="evenodd"
                />
              </svg>
            </span>
          </button>
        </div>
      </div>
    </div>
  </div>
  <AddNewClient
    :open="showClientModal"
    @close="showClientModal = false"
    @confirm="handleClientAdded"
  />
</template>

<script setup>
import { ref, computed, readonly, defineExpose, onMounted, onUnmounted } from 'vue'
import MoreMenu from './MoreMenu.vue'
import { useRouter } from 'vue-router'
import { useAlerts } from '../composables/useAlerts.js'
import { useConfirm } from '../composables/useConfirm.js'
import AddNewClient from '../pages/AddNewClient.vue'

defineEmits(['refresh'])

const showClientModal = ref(false)
const alerts = useAlerts()
const { confirm } = useConfirm()
const clients = ref([])
const router = useRouter()
const selected = ref([])
const currentPage = ref(1)
const itemsPerPage = ref(10)
const sortConfig = ref({ key: null, direction: 'asc' })
const searchQuery = ref('')
const openMenuId = ref(null)
const searchInput = ref(null)

const handleKeyDown = (event) => {
  const isModKey = event.ctrlKey || event.metaKey

  // Ctrl + K -> Focus Search
  if (isModKey && event.key.toLowerCase() === 'k') {
    event.preventDefault()
    searchInput.value?.focus()
  }

  // // Ctrl + N -> Focus Client
  // if (isModKey && event.key.toLowerCase() === 'n') {
  //   event.preventDefault()
  //   clientInput.value?.focus()
  // }

  // // Ctrl + J -> Go to Queue
  // if (isModKey && event.key.toLowerCase() === 'j') {
  //   event.preventDefault()
  //   goToQueue()
  // }

  // // Ctrl + , -> Open Settings
  // if (isModKey && event.key === ',') {
  //   event.preventDefault()
  //   showSettings.value = true
  // }
}

const handleSort = (key) => {
  sortConfig.value = {
    key,
    direction: sortConfig.value.key === key && sortConfig.value.direction === 'asc' ? 'desc' : 'asc'
  }
}

const filteredData = computed(() => {
  const q = searchQuery.value.toLowerCase()
  return clients.value.filter(
    (item) =>
      item.id.toString().includes(q) ||
      item.name.toLowerCase().includes(q) ||
      item.contact.toLowerCase().includes(q) ||
      item.email.toLowerCase().includes(q)
  )
})

const sortedData = computed(() => {
  if (!sortConfig.value.key) return filteredData.value

  return [...filteredData.value].sort((a, b) => {
    const aVal = a[sortConfig.value.key]
    const bVal = b[sortConfig.value.key]

    if (aVal < bVal) return sortConfig.value.direction === 'asc' ? -1 : 1
    if (aVal > bVal) return sortConfig.value.direction === 'asc' ? 1 : -1
    return 0
  })
})

const totalPages = computed(() => Math.ceil(sortedData.value.length / itemsPerPage.value))

const startIdx = computed(() => (currentPage.value - 1) * itemsPerPage.value)

const paginatedData = computed(() =>
  sortedData.value.slice(startIdx.value, startIdx.value + itemsPerPage.value)
)

const toggleSelect = (id) => {
  if (selected.value.includes(id)) {
    selected.value = selected.value.filter((i) => i !== id)
  } else {
    selected.value.push(id)
  }
}

const toggleSelectAll = () => {
  if (selected.value.length === paginatedData.value.length) {
    selected.value = []
  } else {
    selected.value = paginatedData.value.map((item) => item.id)
  }
}

const loadClients = async () => {
  const data = await window.api.getClients()
  clients.value = data
}

defineExpose({
  refresh: loadClients,
  selected: readonly(selected),
  clients: readonly(clients)
})

const sendToQueue = async (client) => {
  try {
    const count = await window.api.countClientLabels(client)
    if (count <= 0) {
      alerts.error('Client label is empty')
    } else {
      await window.api.sendToQueue(client)
      alerts.success('Send to queue successfully')
    }
  } catch (error) {
    console.error('Failed to fetch labels:', error)
    alerts.error('Failed to load labels')
  }
}

const deleteClient = async (client) => {
  try {
    await window.api.deleteClient(client)
    alerts.success('Deleted client successfully')
  } catch (error) {
    console.error('Failed to delete client:', error)
    alerts.error('Failed to delete client')
  }
}

const sendToQueueConfirmed = async (id) => {
  if (await confirm('Send to Queue?')) {
    await sendToQueue(id)
  }
}
const printLabelsConfirmed = async (id) => {
  if (await confirm('Send to printer?')) {
    await printLabels(id)
  }
}
const deleteClientConfirmed = async (id) => {
  if (await confirm('Delete client and all associated data')) {
    await deleteClient(id)
  }
}

const printLabels = async (client) => {
  try {
    const count = await window.api.countClientLabels(client)
    if (count <= 0) {
      alerts.error('Client label is empty')
    } else {
      await window.api.clientLabelsPrint(client)
      alerts.success('Send labels to printer successfully')
    }
  } catch (error) {
    console.error('Failed to fetch labels:', error)
    alerts.error('Failed to load labels')
  }
}

const getClientActions = (client) => [
  {
    label: 'Send to Queue',
    handler: async () => await sendToQueueConfirmed(client)
  },
  {
    label: 'Print Labels',
    handler: async () => await printLabelsConfirmed(client)
  }
]

const handleEdit = (id) => router.push({ name: 'Client', params: { id } })

// Toggle menu - only one open at a time
const toggleMenu = (id) => {
  openMenuId.value = openMenuId.value === id ? null : id
}

const handleClientAdded = async () => {
  showClientModal.value = false
  await loadClients()
}

// Close menu when clicking outside or scrolling
const closeMenu = () => {
  openMenuId.value = null
}

// Bulk actions
const bulkSendToQueue = async () => {
  if (await confirm(`Send ${selected.value.length} client(s) to queue?`)) {
    let successCount = 0
    let errorCount = 0

    for (const clientId of selected.value) {
      try {
        const count = await window.api.countClientLabels(clientId)
        if (count > 0) {
          await window.api.sendToQueue(clientId)
          successCount++
        } else {
          errorCount++
        }
      } catch (error) {
        console.error('Failed to send to queue:', error)
        errorCount++
      }
    }

    if (successCount > 0) {
      alerts.success(`${successCount} client(s) sent to queue successfully`)
    }
    if (errorCount > 0) {
      alerts.error(`${errorCount} client(s) failed (empty labels or error)`)
    }

    selected.value = []
  }
}

const bulkPrintLabels = async () => {
  if (await confirm(`Print labels for ${selected.value.length} client(s)?`)) {
    let successCount = 0
    let errorCount = 0

    for (const clientId of selected.value) {
      try {
        const count = await window.api.countClientLabels(clientId)
        if (count > 0) {
          await window.api.clientLabelsPrint(clientId)
          successCount++
        } else {
          errorCount++
        }
      } catch (error) {
        console.error('Failed to print labels:', error)
        errorCount++
      }
    }

    if (successCount > 0) {
      alerts.success(`${successCount} client(s) sent to printer successfully`)
    }
    if (errorCount > 0) {
      alerts.error(`${errorCount} client(s) failed (empty labels or error)`)
    }

    selected.value = []
  }
}

const bulkDeleteClients = async () => {
  if (await confirm(`Delete ${selected.value.length} client(s) and all associated data?`)) {
    let successCount = 0
    let errorCount = 0

    for (const clientId of selected.value) {
      try {
        await window.api.deleteClient(clientId)
        successCount++
      } catch (error) {
        console.error('Failed to delete client:', error)
        errorCount++
      }
    }

    if (successCount > 0) {
      alerts.success(`${successCount} client(s) deleted successfully`)
      await loadClients()
    }
    if (errorCount > 0) {
      alerts.error(`${errorCount} client(s) failed to delete`)
    }

    selected.value = []
  }
}
onMounted(async () => {
  await loadClients()
  // window.addEventListener('click', closeMenu)
  window.addEventListener('keydown', handleKeyDown)
})
onUnmounted(() => {
  // window.removeEventListener('click', closeMenu)
  window.removeEventListener('keydown', handleKeyDown)
})
</script>
<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e0;
  border-radius: 3px;
}

.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background: #4a5568;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
