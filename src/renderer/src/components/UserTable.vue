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
            placeholder="Search by ID, Name, Email, Role or Position..."
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
            <Badge :mode="sortedData.length <= 0 ? 'danger' : 'info'"
              >Users: {{ sortedData.length }}</Badge
            >
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
              class="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow-md select-none"
              @click="bulkDeleteUsers"
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
            @click="showUserModal = true"
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
            Add User
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
                    v-for="key in ['id', 'name', 'email', 'role', 'position']"
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
                      {{ item.email }}
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-600 dark:text-gray-400">
                      {{ item.role }}
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-600 dark:text-gray-400">
                      {{ item.position }}
                    </div>
                  </td>

                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <div class="flex justify-end gap-2">
                      <button
                        class="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-all duration-200 hover:scale-110 select-none"
                        title="Edit"
                        @click="
                          handleEditUser(item.id, item.name, item.email, item.role, item.position)
                        "
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
                        @click="deleteUserConfirmed(item.id)"
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
                      <p class="text-lg font-medium">No users found</p>
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
  <AddNewUser :open="showUserModal" @close="showUserModal = false" @confirm="handleUserAdded" />
  <EditUser
    :id="editUserID"
    :open="showEditUserModal"
    :name="editUserName"
    :email="editUserEmail"
    :role="editUserRole"
    :position="editUserPosition"
    @close="showEditUserModal = false"
    @confirm="handleUserEdited"
  />
</template>

<script setup>
/* =========================================================
 * Imports
 * ========================================================= */
import { ref, computed, readonly, defineExpose, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import AddNewUser from '../pages/AddNewUser.vue'
import Badge from './Badge.vue'
import EditUser from '../pages/EditUser.vue'
import { useAlerts } from '../composables/useAlerts.js'
import { useConfirm } from '../composables/useConfirm.js'
import { runQuery } from '../utils/api.js'

defineEmits(['refresh'])

/* =========================================================
 * Composables / Globals
 * ========================================================= */
const router = useRouter()
const alerts = useAlerts()
const { confirm } = useConfirm()

/* =========================================================
 * State
 * ========================================================= */
const showUserModal = ref(false)
const users = ref([])
const selected = ref([])
const openMenuId = ref(null)

const currentPage = ref(1)
const itemsPerPage = ref(10)

const sortConfig = ref({ key: null, direction: 'asc' })
const searchQuery = ref('')
const searchInput = ref(null)

// Edit User
const showEditUserModal = ref(false)
const editUserID = ref('')
const editUserName = ref('')
const editUserEmail = ref('')
const editUserRole = ref('')
const editUserPosition = ref('')

/* =========================================================
 * Keyboard Shortcuts
 * ========================================================= */
const handleKeyDown = (event) => {
  if (event.key === 'Escape' && showUserModal.value) {
    event.preventDefault()
    showUserModal.value = false
    return
  }
  const isModKey = event.ctrlKey || event.metaKey

  /* Ctrl/Cmd + K → Focus search */
  if (isModKey && event.key.toLowerCase() === 'k') {
    event.preventDefault()
    searchInput.value?.focus()
    return
  }

  /* Ctrl/Cmd + N → Add new user */
  if (isModKey && event.key.toLowerCase() === 'n') {
    event.preventDefault()
    showUserModal.value = true
    return
  }

  /* Ctrl/Cmd + → → Next page */
  if (isModKey && event.key === 'ArrowRight') {
    event.preventDefault()
    if (currentPage.value < totalPages.value) {
      currentPage.value++
      // alerts.info(`Page ${currentPage.value} of ${totalPages.value}`)
    }
    return
  }

  /* Ctrl/Cmd + ← → Previous page */
  if (isModKey && event.key === 'ArrowLeft') {
    event.preventDefault()
    if (currentPage.value > 1) {
      currentPage.value--
      // alerts.info(`Page ${currentPage.value} of ${totalPages.value}`)
    }
  }
}

/* =========================================================
 * Sorting / Filtering / Pagination
 * ========================================================= */
const handleSort = (key) => {
  sortConfig.value = {
    key,
    direction: sortConfig.value.key === key && sortConfig.value.direction === 'asc' ? 'desc' : 'asc'
  }
}

const filteredData = computed(() => {
  const q = searchQuery.value.toLowerCase()
  return users.value.filter(
    (item) =>
      item.id.toString().includes(q) ||
      item.name.toLowerCase().includes(q) ||
      item.email.toLowerCase().includes(q) ||
      item.role.toLowerCase().includes(q) ||
      item.position.toLowerCase().includes(q)
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

/* =========================================================
 * Selection Logic
 * ========================================================= */
const toggleSelect = (id) => {
  selected.value.includes(id)
    ? (selected.value = selected.value.filter((i) => i !== id))
    : selected.value.push(id)
}

const toggleSelectAll = () => {
  selected.value.length === paginatedData.value.length
    ? (selected.value = [])
    : (selected.value = paginatedData.value.map((item) => item.id))
}

/* =========================================================
 * API Calls
 * ========================================================= */
const loadUsers = async () => {
  try {
    users.value = await runQuery(window.api.getUsers)
  } catch (error) {
    console.error(error)
    alerts.error('Failed to load users')
  }
}

/* =========================================================
 * Single User Actions
 * ========================================================= */
const deleteUser = async (user) => {
  try {
    await window.api.deleteUser(user)
    await loadUsers()
    alerts.success('Deleted user successfully')
  } catch (error) {
    console.error(error)
    alerts.error('Failed to delete user')
  }
}

/* =========================================================
 * Confirmed Actions
 * ========================================================= */
const deleteUserConfirmed = async (id) => {
  if (await confirm('Delete user and all associated data?')) {
    await deleteUser(id)
  }
}

/* =========================================================
 * Bulk Actions
 * ========================================================= */
const bulkDeleteUsers = async () => {
  if (!(await confirm(`Delete ${selected.value.length} user(s) and all associated data?`))) return

  let success = 0
  let fail = 0

  for (const userId of selected.value) {
    try {
      await window.api.deleteUser(userId)
      success++
    } catch (error) {
      console.error(error)
      fail++
    }
  }

  success && alerts.success(`${success} user(s) deleted successfully`)
  fail && alerts.error(`${fail} user(s) failed to delete`)

  await loadUsers()
  selected.value = []
}

/* =========================================================
 * Navigation / UI Helpers
 * ========================================================= */

const handleUserAdded = async () => {
  showUserModal.value = false
  await loadUsers()
}

const handleUserEdited = async () => {
  showEditUserModal.value = false
  await loadUsers()
}

// Close menu when clicking outside / scrolling
const closeMenu = () => {
  openMenuId.value = null
}

const handleEditUser = (id, name, email, role, position) => {
  editUserID.value = id
  editUserName.value = name
  editUserEmail.value = email
  editUserRole.value = role
  editUserPosition.value = position
  showEditUserModal.value = true
}

/* =========================================================
 * Expose
 * ========================================================= */
defineExpose({
  refresh: loadUsers,
  selected: readonly(selected),
  users: readonly(users)
})

/* =========================================================
 * Lifecycle
 * ========================================================= */
onMounted(async () => {
  await loadUsers()
  window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
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
