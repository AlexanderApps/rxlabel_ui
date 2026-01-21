<script setup>
import { ref, computed } from 'vue'
defineProps({
  clients: {
    type: Array,
    required: false,
    default: () => []
  }
})

const data = ref([
  { id: 1, name: 'John Doe', phone: '(555) 123-4567', email: 'john.doe@example.com' },
  { id: 2, name: 'Jane Smith', phone: '(555) 234-5678', email: 'jane.smith@example.com' },
  { id: 3, name: 'Bob Johnson', phone: '(555) 345-6789', email: 'bob.johnson@example.com' },
  { id: 4, name: 'Alice Williams', phone: '(555) 456-7890', email: 'alice.williams@example.com' },
  { id: 5, name: 'Charlie Brown', phone: '(555) 567-8901', email: 'charlie.brown@example.com' },
  { id: 6, name: 'Diana Prince', phone: '(555) 678-9012', email: 'diana.prince@example.com' },
  { id: 7, name: 'Edward Norton', phone: '(555) 789-0123', email: 'edward.norton@example.com' },
  { id: 8, name: 'Fiona Green', phone: '(555) 890-1234', email: 'fiona.green@example.com' },
  { id: 9, name: 'George Miller', phone: '(555) 901-2345', email: 'george.miller@example.com' },
  { id: 10, name: 'Helen Carter', phone: '(555) 012-3456', email: 'helen.carter@example.com' },
  { id: 11, name: 'Ian Thompson', phone: '(555) 123-4568', email: 'ian.thompson@example.com' },
  { id: 12, name: 'Julia Roberts', phone: '(555) 234-5679', email: 'julia.roberts@example.com' }
])

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
  return data.value.filter(
    (item) =>
      item.id.toString().includes(q) ||
      item.name.toLowerCase().includes(q) ||
      item.phone.toLowerCase().includes(q) ||
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

const handleEdit = (id) => alert(`Edit item ${id}`)
const handleDelete = (id) => alert(`Delete item ${id}`)
</script>

<template>
  <div class="p-6 max-w-7xl mx-auto">
    <!-- Search -->
    <div class="mb-4">
      <input
        v-model="searchQuery"
        placeholder="Search by ID, Name, Phone, or Email..."
        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              v-for="key in ['id', 'name', 'phone', 'email']"
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
            <td class="px-6 py-4 text-sm">{{ item.phone }}</td>
            <td class="px-6 py-4 text-sm">{{ item.email }}</td>

            <td class="px-6 py-4 text-right text-sm">
              <button class="text-blue-600 hover:text-blue-900 mr-3" @click="handleEdit(item.id)">
                Edit
              </button>
              <button class="text-red-600 hover:text-red-900" @click="handleDelete(item.id)">
                Delete
              </button>
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
