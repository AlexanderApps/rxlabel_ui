<script setup>
import { ref, computed, readonly, defineExpose } from 'vue'
import MoreMenu from './MoreMenu.vue'
import { useRouter } from 'vue-router'

defineEmits(['refresh'])

const clients = ref([])
const router = useRouter()
const selected = ref([])
const currentPage = ref(1)
const itemsPerPage = ref(10)
const sortConfig = ref({ key: null, direction: 'asc' })
const searchQuery = ref('')

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
  console.log(data)
  clients.value = data

  // reset model cache
  // Object.keys(labelModels).forEach((k) => delete labelModels[k])

  // hydrate editable models
  // data.forEach((l) => (labelModels[l.id] = { ...l }))
}

defineExpose({
  refresh: loadClients,
  selected: readonly(selected),
  clients: readonly(clients)
})

const clientActions = [
  {
    label: 'Send to Queue',
    handler: () => console.log('first')
  },
  {
    label: 'Print Labels',
    handler: () => console.log('first')
  }
]

const handleEdit = (id) => router.push({ name: 'Client', params: { id } })
// const handleDelete = (id) => alert(`Delete item ${id}`)

// onMounted(() => {
//   loadClients()
// })
</script>

<template>
  <div class="p-6 max-w-7xl mx-auto">
    <!-- Search -->
    <div class="mb-4">
      <input
        v-model="searchQuery"
        placeholder="Search by ID, Name, Contact, or Email..."
        class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800"
        @input="currentPage = 1"
      />
    </div>

    <!-- Table -->
    <div
      class="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm text-black dark:text-gray-100"
    >
      <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead class="bg-gray-50 dark:bg-gray-950">
          <tr>
            <th class="px-4 py-3">
              <input
                type="checkbox"
                :checked="paginatedData.length > 0 && selected.length === paginatedData.length"
                class="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                @change="toggleSelectAll"
              />
            </th>

            <th
              v-for="key in ['id', 'name', 'contact', 'email']"
              :key="key"
              class="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-200 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-900 select-none"
              @click="handleSort(key)"
            >
              <div class="flex items-center gap-2">
                {{ key }}
                <span v-if="sortConfig.key === key">
                  {{ sortConfig.direction === 'asc' ? '↑' : '↓' }}
                </span>
              </div>
            </th>

            <th class="px-6 py-3 text-right text-xs font-medium uppercase">Actions</th>
          </tr>
        </thead>

        <tbody class="bg-white divide-y divide-gray-200 dark:divide-gray-700">
          <tr
            v-for="(item, idx) in paginatedData"
            :key="item.id"
            :class="idx % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-800/95'"
          >
            <td class="px-4 py-3">
              <input
                type="checkbox"
                :checked="selected.includes(item.id)"
                class="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                @change="toggleSelect(item.id)"
              />
            </td>
            <td class="px-6 py-4 text-sm">{{ item.id }}</td>
            <td class="px-6 py-4 text-sm">{{ item.name }}</td>
            <td class="px-6 py-4 text-sm">{{ item.contact }}</td>
            <td class="px-6 py-4 text-sm">{{ item.email }}</td>

            <td class="px-6 py-4 text-right text-sm">
              <div class="flex justify-end gap-2">
                <button class="btn-icon" @click="handleEdit(item.id)">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    class="bi bi-box-arrow-up-right"
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
                <button class="btn-icon" @click="handleEdit(item.id)">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    class="bi bi-x-circle-fill w-4 h-4 text-red-400 hover:text-red-600"
                    viewBox="0 0 16 16"
                  >
                    <path
                      d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z"
                    />
                  </svg>
                </button>
                <MoreMenu :actions="clientActions">
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
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="mt-4 flex items-center justify-between">
      <div class="text-sm text-gray-700">
        Showing {{ startIdx + 1 }} to {{ Math.min(startIdx + itemsPerPage, sortedData.length) }} of
        {{ sortedData.length }} results
      </div>

      <div class="flex gap-2">
        <button
          class="px-4 py-2 text-sm border rounded disabled:opacity-50"
          :disabled="currentPage === 1"
          @click="currentPage = Math.max(1, currentPage - 1)"
        >
          Previous
        </button>

        <span class="px-4 py-2 text-sm">Page {{ currentPage }} of {{ totalPages }}</span>

        <button
          :disabled="currentPage === totalPages"
          class="px-4 py-2 text-sm border rounded disabled:opacity-50"
          @click="currentPage = Math.min(totalPages, currentPage + 1)"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>
