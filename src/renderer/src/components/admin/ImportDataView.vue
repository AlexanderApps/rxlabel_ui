<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-4">
        <button
          @click="$emit('back')"
          class="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
        >
          <svg
            class="w-5 h-5 text-slate-600 dark:text-slate-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <div>
          <h2 class="text-2xl font-bold text-slate-800 dark:text-slate-100">
            Import Data from CSV
          </h2>
          <p class="text-sm text-slate-500 dark:text-slate-400">
            Upload and map your CSV data to the database
          </p>
        </div>
      </div>
    </div>

    <!-- Step Indicator -->
    <div
      class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6"
    >
      <div class="flex items-center justify-between">
        <div
          v-for="(step, index) in steps"
          :key="step.id"
          class="flex items-center"
          :class="{ 'flex-1': index < steps.length - 1 }"
        >
          <div class="flex items-center">
            <div
              class="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all"
              :class="
                currentStep > step.id
                  ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white'
                  : currentStep === step.id
                    ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
              "
            >
              <svg
                v-if="currentStep > step.id"
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span v-else>{{ step.id }}</span>
            </div>
            <div class="ml-3">
              <p
                class="text-sm font-semibold"
                :class="
                  currentStep >= step.id
                    ? 'text-slate-800 dark:text-slate-100'
                    : 'text-slate-500 dark:text-slate-400'
                "
              >
                {{ step.label }}
              </p>
            </div>
          </div>
          <div
            v-if="index < steps.length - 1"
            class="flex-1 h-0.5 mx-4"
            :class="
              currentStep > step.id
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600'
                : 'bg-slate-200 dark:bg-slate-700'
            "
          ></div>
        </div>
      </div>
    </div>

    <!-- Step 1: Select Table & Upload File -->
    <div
      v-if="currentStep === 1"
      class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 space-y-6"
    >
      <!-- Table Selection -->
      <div class="space-y-3">
        <label class="text-sm font-semibold text-slate-700 dark:text-slate-300"
          >Select Target Table</label
        >
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button
            v-for="table in availableTables"
            :key="table.name"
            @click="selectedTable = table.name"
            class="flex flex-col items-center p-4 rounded-xl border-2 transition-all"
            :class="
              selectedTable === table.name
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
            "
          >
            <div
              class="w-12 h-12 rounded-xl flex items-center justify-center mb-2"
              :class="table.color"
            >
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  :d="table.icon"
                />
              </svg>
            </div>
            <span class="text-sm font-semibold text-slate-800 dark:text-slate-100">{{
              table.label
            }}</span>
            <span class="text-xs text-slate-500 dark:text-slate-400">{{ table.description }}</span>
          </button>
        </div>
      </div>

      <!-- File Upload Area -->
      <div class="space-y-3">
        <label class="text-sm font-semibold text-slate-700 dark:text-slate-300"
          >Upload CSV File</label
        >
        <div
          @drop.prevent="handleDrop"
          @dragover.prevent="isDragging = true"
          @dragleave.prevent="isDragging = false"
          class="relative border-2 border-dashed rounded-xl p-12 transition-all cursor-pointer"
          :class="
            isDragging
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
              : 'border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500'
          "
        >
          <input
            ref="fileInput"
            type="file"
            accept=".csv"
            @change="handleFileSelect"
            class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div class="flex flex-col items-center text-center">
            <div
              class="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-4"
            >
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-2">
              {{ uploadedFile ? uploadedFile.name : 'Drop your CSV file here' }}
            </h3>
            <p class="text-sm text-slate-500 dark:text-slate-400 mb-4">
              {{
                uploadedFile
                  ? `${uploadedFile.size} bytes • ${csvData.length} rows`
                  : 'or click to browse'
              }}
            </p>
            <button
              v-if="uploadedFile"
              @click.stop="clearFile"
              class="px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors text-sm font-semibold"
            >
              Remove File
            </button>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex justify-end space-x-3">
        <button
          @click="$emit('back')"
          class="px-6 py-3 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors font-semibold"
        >
          Cancel
        </button>
        <button
          @click="nextStep"
          :disabled="!selectedTable || !uploadedFile"
          class="px-6 py-3 rounded-xl font-semibold transition-all"
          :class="
            selectedTable && uploadedFile
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl'
              : 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed'
          "
        >
          Next: Map Columns
        </button>
      </div>
    </div>

    <!-- Step 2: Map Columns -->
    <div
      v-if="currentStep === 2"
      class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 space-y-6"
    >
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-slate-800 dark:text-slate-100">
            Map CSV Columns to Database Fields
          </h3>
          <button
            @click="autoMap"
            class="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors text-sm font-semibold flex items-center gap-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            Auto-Map
          </button>
        </div>

        <!-- Column Mapping -->
        <div class="space-y-3">
          <div
            v-for="field in tableFields"
            :key="field"
            class="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl"
          >
            <div class="flex-1">
              <label class="text-sm font-semibold text-slate-700 dark:text-slate-300">
                {{ field }}
                <span v-if="!isOptionalField(field)" class="text-red-500">*</span>
              </label>
            </div>
            <svg
              class="w-5 h-5 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
            <div class="flex-1">
              <select
                v-model="columnMapping[field]"
                class="w-full px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">-- Skip this field --</option>
                <option v-for="column in csvColumns" :key="column" :value="column">
                  {{ column }}
                </option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex justify-between">
        <button
          @click="prevStep"
          class="px-6 py-3 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors font-semibold"
        >
          Back
        </button>
        <button
          @click="nextStep"
          :disabled="!isMappingValid"
          class="px-6 py-3 rounded-xl font-semibold transition-all"
          :class="
            isMappingValid
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl'
              : 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed'
          "
        >
          Next: Preview
        </button>
      </div>
    </div>

    <!-- Step 3: Preview & Import -->
    <div
      v-if="currentStep === 3"
      class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 space-y-6"
    >
      <div class="space-y-4">
        <h3 class="text-lg font-semibold text-slate-800 dark:text-slate-100">
          Preview Import Data
        </h3>

        <!-- Import Summary -->
        <div class="grid grid-cols-3 gap-4">
          <div
            class="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800"
          >
            <p class="text-sm text-blue-600 dark:text-blue-400 font-semibold mb-1">Target Table</p>
            <p class="text-lg font-bold text-blue-800 dark:text-blue-300">{{ selectedTable }}</p>
          </div>
          <div
            class="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-200 dark:border-emerald-800"
          >
            <p class="text-sm text-emerald-600 dark:text-emerald-400 font-semibold mb-1">
              Total Rows
            </p>
            <p class="text-lg font-bold text-emerald-800 dark:text-emerald-300">
              {{ previewData.length }}
            </p>
          </div>
          <div
            class="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-800"
          >
            <p class="text-sm text-purple-600 dark:text-purple-400 font-semibold mb-1">
              Mapped Fields
            </p>
            <p class="text-lg font-bold text-purple-800 dark:text-purple-300">
              {{ Object.keys(columnMapping).filter((k) => columnMapping[k]).length }}
            </p>
          </div>
        </div>

        <!-- Preview Table -->
        <div class="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
          <table class="w-full">
            <thead class="bg-slate-50 dark:bg-slate-900/50">
              <tr>
                <th
                  v-for="field in mappedFields"
                  :key="field"
                  class="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider"
                >
                  {{ field }}
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-200 dark:divide-slate-700">
              <tr
                v-for="(row, index) in previewData.slice(0, 5)"
                :key="index"
                class="hover:bg-slate-50 dark:hover:bg-slate-700/50"
              >
                <td
                  v-for="field in mappedFields"
                  :key="field"
                  class="px-4 py-3 text-sm text-slate-800 dark:text-slate-200"
                >
                  {{ row[field] || '-' }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="text-xs text-slate-500 dark:text-slate-400 text-center">
          Showing first 5 rows of {{ previewData.length }} total rows
        </p>
      </div>

      <!-- Action Buttons -->
      <div class="flex justify-between">
        <button
          @click="prevStep"
          class="px-6 py-3 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors font-semibold"
        >
          Back
        </button>
        <button
          @click="importData"
          :disabled="isImporting"
          class="px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2"
          :class="
            isImporting
              ? 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700 shadow-lg hover:shadow-xl'
          "
        >
          <svg
            v-if="isImporting"
            class="animate-spin w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
          {{ isImporting ? 'Importing...' : 'Import Data' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const emit = defineEmits(['back', 'import-complete'])

const steps = [
  { id: 1, label: 'Select & Upload' },
  { id: 2, label: 'Map Columns' },
  { id: 3, label: 'Preview & Import' }
]

const availableTables = [
  {
    name: 'labels',
    label: 'Labels',
    description: 'Product labels',
    color: 'bg-gradient-to-br from-blue-500 to-cyan-600',
    icon: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z'
  },
  {
    name: 'clients',
    label: 'Clients',
    description: 'Client records',
    color: 'bg-gradient-to-br from-violet-500 to-purple-600',
    icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z'
  },
  {
    name: 'client_labels',
    label: 'Client Labels',
    description: 'Client-specific labels',
    color: 'bg-gradient-to-br from-emerald-500 to-teal-600',
    icon: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z'
  },
  {
    name: 'queue',
    label: 'Queue',
    description: 'Queue items',
    color: 'bg-gradient-to-br from-amber-500 to-orange-600',
    icon: 'M4 6h16M4 10h16M4 14h16M4 18h16'
  }
]

const tableSchemas = {
  labels: ['product', 'instructions', 'warning'],
  clients: ['name', 'contact', 'email', 'home_address'],
  client_labels: ['client_id', 'product', 'instructions', 'warning'],
  queue: ['product', 'instructions', 'warning', 'client']
}

const requiredFields = {
  labels: ['product'],
  clients: ['name'],
  client_labels: ['client_id', 'product'],
  queue: ['product']
}

const currentStep = ref(1)
const selectedTable = ref('')
const uploadedFile = ref(null)
const isDragging = ref(false)
const csvData = ref([])
const csvColumns = ref([])
const columnMapping = ref({})
const isImporting = ref(false)

const tableFields = computed(() => {
  return selectedTable.value ? tableSchemas[selectedTable.value] : []
})

const mappedFields = computed(() => {
  return Object.keys(columnMapping.value).filter((key) => columnMapping.value[key])
})

const isMappingValid = computed(() => {
  if (!selectedTable.value) return false
  const required = requiredFields[selectedTable.value] || []
  return required.every((field) => columnMapping.value[field])
})

const previewData = computed(() => {
  return csvData.value.map((row) => {
    const mappedRow = {}
    Object.keys(columnMapping.value).forEach((dbField) => {
      const csvColumn = columnMapping.value[dbField]
      if (csvColumn) {
        mappedRow[dbField] = row[csvColumn]
      }
    })
    return mappedRow
  })
})

const isOptionalField = (field) => {
  const required = requiredFields[selectedTable.value] || []
  return !required.includes(field)
}

const handleDrop = (e) => {
  isDragging.value = false
  const files = e.dataTransfer.files
  if (files.length > 0) {
    processFile(files[0])
  }
}

const handleFileSelect = (e) => {
  const files = e.target.files
  if (files.length > 0) {
    processFile(files[0])
  }
}

const processFile = (file) => {
  if (!file.name.endsWith('.csv')) {
    alert('Please upload a CSV file')
    return
  }

  uploadedFile.value = file

  const reader = new FileReader()
  reader.onload = (e) => {
    const text = e.target.result
    parseCSV(text)
  }
  reader.readAsText(file)
}

const parseCSV = (text) => {
  const lines = text.split('\n').filter((line) => line.trim())
  if (lines.length === 0) return

  // Get headers from first line
  const headers = lines[0].split(',').map((h) => h.trim().replace(/^"|"$/g, ''))
  csvColumns.value = headers

  // Parse data rows
  const data = []
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map((v) => v.trim().replace(/^"|"$/g, ''))
    const row = {}
    headers.forEach((header, index) => {
      row[header] = values[index] || ''
    })
    data.push(row)
  }
  csvData.value = data
}

const clearFile = () => {
  uploadedFile.value = null
  csvData.value = []
  csvColumns.value = []
  columnMapping.value = {}
}

const autoMap = () => {
  const mapping = {}
  tableFields.value.forEach((field) => {
    // Try exact match first
    const exactMatch = csvColumns.value.find((col) => col.toLowerCase() === field.toLowerCase())
    if (exactMatch) {
      mapping[field] = exactMatch
      return
    }

    // Try partial match
    const partialMatch = csvColumns.value.find(
      (col) =>
        col.toLowerCase().includes(field.toLowerCase()) ||
        field.toLowerCase().includes(col.toLowerCase())
    )
    if (partialMatch) {
      mapping[field] = partialMatch
    }
  })
  columnMapping.value = mapping
}

const nextStep = () => {
  if (currentStep.value < 3) {
    currentStep.value++
  }
}

const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

const importData = async () => {
  isImporting.value = true

  try {
    // Prepare data for import
    const dataToImport = {
      table: selectedTable.value,
      data: previewData.value
    }

    // Call the API to import data
    const result = await window.api.importCSVData(dataToImport)

    if (result.success) {
      emit('import-complete', {
        success: true,
        rowsImported: previewData.value.length,
        table: selectedTable.value
      })
    } else {
      throw new Error(result.error || 'Import failed')
    }
  } catch (error) {
    console.error('Import error:', error)
    emit('import-complete', {
      success: false,
      error: error.message
    })
  } finally {
    isImporting.value = false
  }
}
</script>

<style scoped>
.delay-75 {
  animation-delay: 75ms;
}
</style>
