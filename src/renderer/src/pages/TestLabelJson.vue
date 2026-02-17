<template>
  <div
    class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-6"
  >
    <div class="max-w-6xl mx-auto space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-slate-800 dark:text-slate-100">
            Test Label JSON Printer
          </h1>
          <p class="text-sm text-slate-500 dark:text-slate-400">
            Test your label printer with custom JSON data
          </p>
        </div>
        <router-link
          to="/"
          class="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors font-semibold"
        >
          Back to Home
        </router-link>
      </div>

      <!-- Main Content -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- JSON Input Section -->
        <div
          class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 space-y-6"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <div
                class="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg"
              >
                <svg
                  class="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                  />
                </svg>
              </div>
              <div>
                <h2 class="text-lg font-bold text-slate-800 dark:text-slate-100">JSON Input</h2>
                <p class="text-sm text-slate-500 dark:text-slate-400">
                  Enter your label data as JSON
                </p>
              </div>
            </div>
            <div class="flex items-center space-x-2">
              <button
                @click="validateJson"
                class="px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors text-sm font-semibold flex items-center gap-1.5"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Validate
              </button>
              <button
                @click="formatJson"
                class="px-3 py-1.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-lg hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-colors text-sm font-semibold flex items-center gap-1.5"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Format
              </button>
            </div>
          </div>

          <!-- JSON Editor -->
          <div class="space-y-3">
            <textarea
              v-model="jsonInput"
              @input="clearValidation"
              class="w-full h-96 px-4 py-3 bg-slate-50 dark:bg-slate-900 border-2 rounded-xl font-mono text-sm text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              :class="
                validationState === 'valid'
                  ? 'border-emerald-500'
                  : validationState === 'invalid'
                    ? 'border-red-500'
                    : 'border-slate-300 dark:border-slate-600'
              "
              placeholder='Enter JSON here, e.g.:
{
  "product": "Amoxicillin 500mg",
  "instructions": "Take one capsule three times daily",
  "warning": "Do not take if allergic to penicillin",
  "client": "John Doe"
}'
            ></textarea>

            <!-- Validation Status -->
            <div
              v-if="validationState === 'valid'"
              class="flex items-center space-x-2 p-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg"
            >
              <svg
                class="w-5 h-5 text-emerald-600 dark:text-emerald-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span class="text-sm font-semibold text-emerald-800 dark:text-emerald-300"
                >Valid JSON</span
              >
            </div>

            <div
              v-if="validationState === 'invalid'"
              class="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
            >
              <div class="flex items-center space-x-2 mb-2">
                <svg
                  class="w-5 h-5 text-red-600 dark:text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span class="text-sm font-semibold text-red-800 dark:text-red-300"
                  >Invalid JSON</span
                >
              </div>
              <p class="text-xs text-red-700 dark:text-red-400 font-mono">{{ validationError }}</p>
            </div>
          </div>

          <!-- Quick Templates -->
          <div class="space-y-3">
            <label class="text-sm font-semibold text-slate-700 dark:text-slate-300"
              >Quick Templates</label
            >
            <div class="grid grid-cols-2 gap-2">
              <button
                v-for="template in templates"
                :key="template.name"
                @click="loadTemplate(template.data)"
                class="px-3 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors text-sm font-semibold text-left"
              >
                {{ template.name }}
              </button>
            </div>
          </div>

          <!-- Print Button -->
          <button
            @click="printLabel"
            :disabled="isPrinting || validationState === 'invalid'"
            class="w-full group flex items-center justify-center space-x-3 p-4 rounded-xl font-semibold transition-all"
            :class="
              isPrinting || validationState === 'invalid'
                ? 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl hover:scale-105'
            "
          >
            <svg
              v-if="isPrinting"
              class="animate-spin w-6 h-6"
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
            <svg
              v-else
              class="w-6 h-6 group-hover:scale-110 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
              />
            </svg>
            <span>{{ isPrinting ? 'Printing...' : 'Print Label' }}</span>
          </button>
        </div>

        <!-- Preview & Info Section -->
        <div class="space-y-6">
          <!-- JSON Preview -->
          <div
            class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 space-y-4"
          >
            <div class="flex items-center space-x-4">
              <div
                class="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg"
              >
                <svg
                  class="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              </div>
              <div>
                <h2 class="text-lg font-bold text-slate-800 dark:text-slate-100">Preview</h2>
                <p class="text-sm text-slate-500 dark:text-slate-400">Parsed JSON object</p>
              </div>
            </div>

            <div v-if="parsedJson" class="space-y-3">
              <div
                v-for="(value, key) in parsedJson"
                :key="key"
                class="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg"
              >
                <p class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-1">
                  {{ key }}
                </p>
                <p class="text-sm text-slate-800 dark:text-slate-200">{{ value }}</p>
              </div>
            </div>

            <div v-else class="text-center py-8">
              <svg
                class="w-16 h-16 mx-auto text-slate-300 dark:text-slate-600 mb-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <p class="text-slate-500 dark:text-slate-400 text-sm">No valid JSON to preview</p>
            </div>
          </div>

          <!-- Print History -->
          <div
            class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 space-y-4"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-4">
                <div
                  class="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg"
                >
                  <svg
                    class="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h2 class="text-lg font-bold text-slate-800 dark:text-slate-100">
                    Print History
                  </h2>
                  <p class="text-sm text-slate-500 dark:text-slate-400">Recent print jobs</p>
                </div>
              </div>
              <button
                v-if="printHistory.length > 0"
                @click="clearHistory"
                class="text-xs text-red-600 dark:text-red-400 hover:underline"
              >
                Clear
              </button>
            </div>

            <div v-if="printHistory.length === 0" class="text-center py-6">
              <p class="text-slate-500 dark:text-slate-400 text-sm">No print jobs yet</p>
            </div>

            <div v-else class="space-y-2 max-h-96 overflow-y-auto">
              <div
                v-for="(item, index) in printHistory"
                :key="index"
                class="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors"
              >
                <div class="flex items-center justify-between mb-2">
                  <div class="flex items-center space-x-2">
                    <svg
                      class="w-4 h-4"
                      :class="
                        item.success
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-red-600 dark:text-red-400'
                      "
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        v-if="item.success"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                      <path
                        v-else
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span
                      class="text-xs font-semibold"
                      :class="
                        item.success
                          ? 'text-emerald-800 dark:text-emerald-300'
                          : 'text-red-800 dark:text-red-300'
                      "
                    >
                      {{ item.success ? 'Success' : 'Failed' }}
                    </span>
                  </div>
                  <span class="text-xs text-slate-500 dark:text-slate-400">{{ item.time }}</span>
                </div>
                <p v-if="item.error" class="text-xs text-red-600 dark:text-red-400 font-mono mb-2">
                  {{ item.error }}
                </p>
                <button
                  @click="loadFromHistory(item.data)"
                  class="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Load JSON
                </button>
              </div>
            </div>
          </div>

          <!-- Info Card -->
          <div
            class="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl border border-blue-200 dark:border-blue-800 p-6"
          >
            <h3 class="text-sm font-bold text-blue-900 dark:text-blue-300 mb-3">💡 Tips</h3>
            <ul class="space-y-2 text-xs text-blue-800 dark:text-blue-400">
              <li class="flex items-start space-x-2">
                <svg
                  class="w-4 h-4 flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>Use the "Validate" button to check JSON syntax before printing</span>
              </li>
              <li class="flex items-start space-x-2">
                <svg
                  class="w-4 h-4 flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>Click "Format" to auto-indent and prettify your JSON</span>
              </li>
              <li class="flex items-start space-x-2">
                <svg
                  class="w-4 h-4 flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>Use templates to quickly load common label structures</span>
              </li>
              <li class="flex items-start space-x-2">
                <svg
                  class="w-4 h-4 flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>Print history is saved for this session only</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const jsonInput = ref('')
const parsedJson = ref(null)
const validationState = ref(null) // null, 'valid', 'invalid'
const validationError = ref('')
const isPrinting = ref(false)
const printHistory = ref([])

const templates = [
  {
    name: 'Basic Label',
    data: {
      product: 'Amoxicillin 500mg',
      instructions: 'Take one capsule three times daily',
      warning: 'Do not take if allergic to penicillin'
    }
  },
  {
    name: 'With Client',
    data: {
      product: 'Ibuprofen 200mg',
      instructions: 'Take 1-2 tablets every 4-6 hours',
      warning: 'Do not exceed 6 tablets in 24 hours',
      client: 'John Doe'
    }
  },
  {
    name: 'Detailed',
    data: {
      product: 'Metformin 500mg',
      instructions: 'Take twice daily with meals',
      warning: 'May cause stomach upset',
      client: 'Jane Smith',
      date: new Date().toLocaleDateString(),
      pharmacist: 'Dr. Johnson'
    }
  },
  {
    name: 'Minimal',
    data: {
      product: 'Aspirin 81mg',
      instructions: 'Take once daily'
    }
  }
]

// Watch for input changes to update preview
watch(jsonInput, (newValue) => {
  try {
    if (newValue.trim()) {
      parsedJson.value = JSON.parse(newValue)
    } else {
      parsedJson.value = null
    }
  } catch (error) {
    parsedJson.value = null
  }
})

const validateJson = () => {
  try {
    if (!jsonInput.value.trim()) {
      validationState.value = 'invalid'
      validationError.value = 'JSON input is empty'
      return
    }

    JSON.parse(jsonInput.value)
    validationState.value = 'valid'
    validationError.value = ''
  } catch (error) {
    validationState.value = 'invalid'
    validationError.value = error.message
  }
}

const formatJson = () => {
  try {
    const parsed = JSON.parse(jsonInput.value)
    jsonInput.value = JSON.stringify(parsed, null, 2)
    validationState.value = 'valid'
    validationError.value = ''
  } catch (error) {
    validationState.value = 'invalid'
    validationError.value = error.message
  }
}

const clearValidation = () => {
  validationState.value = null
  validationError.value = ''
}

const loadTemplate = (data) => {
  jsonInput.value = JSON.stringify(data, null, 2)
  validateJson()
}

const loadFromHistory = (data) => {
  jsonInput.value = JSON.stringify(data, null, 2)
  validateJson()
}

const printLabel = async () => {
  // Validate first
  validateJson()

  if (validationState.value !== 'valid') {
    return
  }

  isPrinting.value = true

  try {
    const labelData = JSON.parse(jsonInput.value)

    // Call your print API
    const result = await window.api.printerTempPrint(labelData)
    console.log(result)

    // Add to history
    printHistory.value.unshift({
      success: result.success,
      error: result.error || null,
      data: labelData,
      time: new Date().toLocaleTimeString()
    })

    // Keep only last 20 items
    if (printHistory.value.length > 20) {
      printHistory.value = printHistory.value.slice(0, 20)
    }

    if (result.success) {
      // Could show success toast here
      console.log('Print successful')
    } else {
      console.error('Print failed:', result.error)
    }
  } catch (error) {
    console.error('Print error:', error)
    printHistory.value.unshift({
      success: false,
      error: error.message,
      data: null,
      time: new Date().toLocaleTimeString()
    })
  } finally {
    isPrinting.value = false
  }
}

const clearHistory = () => {
  printHistory.value = []
}
</script>
