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
            Database Optimization
          </h2>
          <p class="text-sm text-slate-500 dark:text-slate-400">
            Analyze and optimize your database performance
          </p>
        </div>
      </div>
    </div>

    <!-- Last Optimization Info -->
    <div
      v-if="lastOptimization"
      class="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl border border-blue-200 dark:border-blue-800 p-6"
    >
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <div
            class="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg"
          >
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div>
            <p class="text-sm font-semibold text-blue-900 dark:text-blue-300">
              Last Successful Optimization
            </p>
            <p class="text-xs text-blue-700 dark:text-blue-400">
              {{ formatDate(lastOptimization.date) }}
            </p>
          </div>
        </div>
        <div class="text-right">
          <p class="text-sm text-blue-700 dark:text-blue-400">Space Recovered</p>
          <p class="text-2xl font-bold text-blue-900 dark:text-blue-300">
            {{ lastOptimization.spaceSaved }}
          </p>
        </div>
      </div>
    </div>

    <!-- Database Health Status -->
    <div
      class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6"
    >
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center space-x-4">
          <div
            class="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg"
          >
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>
          <div>
            <h3 class="text-lg font-bold text-slate-800 dark:text-slate-100">Database Health</h3>
            <p class="text-sm text-slate-500 dark:text-slate-400">Current performance metrics</p>
          </div>
        </div>
        <button
          @click="analyzeDatabase"
          :disabled="isAnalyzing"
          class="px-4 py-2 rounded-lg font-semibold text-sm transition-all flex items-center gap-2"
          :class="
            isAnalyzing
              ? 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed'
              : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50'
          "
        >
          <svg
            v-if="isAnalyzing"
            class="animate-spin w-4 h-4"
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
          <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          {{ isAnalyzing ? 'Analyzing...' : 'Analyze Now' }}
        </button>
      </div>

      <!-- Health Metrics -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
          <div class="flex items-center justify-between mb-2">
            <p class="text-xs text-slate-500 dark:text-slate-400">Database Size</p>
            <svg
              class="w-4 h-4 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"
              />
            </svg>
          </div>
          <p class="text-2xl font-bold text-slate-800 dark:text-slate-100">
            {{ healthMetrics.size }}
          </p>
        </div>

        <div class="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
          <div class="flex items-center justify-between mb-2">
            <p class="text-xs text-slate-500 dark:text-slate-400">Fragmentation</p>
            <svg
              class="w-4 h-4 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
              />
            </svg>
          </div>
          <p class="text-2xl font-bold" :class="getFragmentationColor(healthMetrics.fragmentation)">
            {{ healthMetrics.fragmentation }}
          </p>
        </div>

        <div class="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
          <div class="flex items-center justify-between mb-2">
            <p class="text-xs text-slate-500 dark:text-slate-400">Unused Space</p>
            <svg
              class="w-4 h-4 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
          </div>
          <p class="text-2xl font-bold text-slate-800 dark:text-slate-100">
            {{ healthMetrics.unusedSpace }}
          </p>
        </div>

        <div class="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
          <div class="flex items-center justify-between mb-2">
            <p class="text-xs text-slate-500 dark:text-slate-400">Index Count</p>
            <svg
              class="w-4 h-4 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          </div>
          <p class="text-2xl font-bold text-slate-800 dark:text-slate-100">
            {{ healthMetrics.indexCount }}
          </p>
        </div>
      </div>

      <!-- Health Indicator -->
      <div class="mt-6 p-4 rounded-xl" :class="getHealthStatusClass()">
        <div class="flex items-center space-x-3">
          <svg class="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              :d="getHealthIcon()"
            />
          </svg>
          <div class="flex-1">
            <p class="font-semibold">{{ getHealthStatus().title }}</p>
            <p class="text-sm">{{ getHealthStatus().description }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Optimization Actions -->
    <div
      class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6"
    >
      <div class="flex items-center space-x-4 mb-6">
        <div
          class="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg"
        >
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
        </div>
        <div>
          <h3 class="text-lg font-bold text-slate-800 dark:text-slate-100">Optimization Options</h3>
          <p class="text-sm text-slate-500 dark:text-slate-400">Select operations to perform</p>
        </div>
      </div>

      <!-- Optimization Checklist -->
      <div class="space-y-3 mb-6">
        <label
          v-for="option in optimizationOptions"
          :key="option.id"
          class="flex items-center p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors"
        >
          <input
            v-model="selectedOptions"
            :value="option.id"
            type="checkbox"
            class="w-5 h-5 text-blue-600 bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 rounded focus:ring-2 focus:ring-blue-500"
          />
          <div class="ml-4 flex-1">
            <div class="flex items-center space-x-2">
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
                  :d="option.icon"
                />
              </svg>
              <p class="font-semibold text-slate-800 dark:text-slate-100">{{ option.label }}</p>
            </div>
            <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">{{ option.description }}</p>
          </div>
        </label>
      </div>

      <!-- Optimize Button -->
      <button
        :disabled="isOptimizing || selectedOptions.length === 0"
        class="w-full group flex items-center justify-center space-x-3 p-4 rounded-xl font-semibold transition-all"
        :class="
          isOptimizing || selectedOptions.length === 0
            ? 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed'
            : 'bg-gradient-to-r from-amber-600 to-orange-600 text-white hover:from-amber-700 hover:to-orange-700 shadow-lg hover:shadow-xl hover:scale-102'
        "
        @click="startOptimization"
      >
        <svg
          v-if="isOptimizing"
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
          class="w-6 h-6 group-hover:rotate-12 transition-transform duration-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
        <span>{{ isOptimizing ? optimizationProgress : 'Start Optimization' }}</span>
      </button>
    </div>

    <!-- Optimization Results -->
    <div
      v-if="optimizationResults"
      class="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-2xl border border-emerald-200 dark:border-emerald-800 p-6 animate-slide-up"
    >
      <div class="flex items-center space-x-4 mb-6">
        <div
          class="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg"
        >
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <div>
          <h3 class="text-lg font-bold text-emerald-900 dark:text-emerald-300">
            Optimization Complete!
          </h3>
          <p class="text-sm text-emerald-700 dark:text-emerald-400">
            {{ formatDate(optimizationResults.timestamp) }}
          </p>
        </div>
      </div>

      <!-- Results Grid -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div class="p-4 bg-white dark:bg-emerald-900/30 rounded-xl">
          <p class="text-xs text-emerald-700 dark:text-emerald-400 mb-1">Space Recovered</p>
          <p class="text-2xl font-bold text-emerald-900 dark:text-emerald-300">
            {{ optimizationResults.spaceSaved }}
          </p>
        </div>
        <div class="p-4 bg-white dark:bg-emerald-900/30 rounded-xl">
          <p class="text-xs text-emerald-700 dark:text-emerald-400 mb-1">Time Taken</p>
          <p class="text-2xl font-bold text-emerald-900 dark:text-emerald-300">
            {{ optimizationResults.duration }}s
          </p>
        </div>
        <div class="p-4 bg-white dark:bg-emerald-900/30 rounded-xl">
          <p class="text-xs text-emerald-700 dark:text-emerald-400 mb-1">Operations</p>
          <p class="text-2xl font-bold text-emerald-900 dark:text-emerald-300">
            {{ optimizationResults.operationsCount }}
          </p>
        </div>
        <div class="p-4 bg-white dark:bg-emerald-900/30 rounded-xl">
          <p class="text-xs text-emerald-700 dark:text-emerald-400 mb-1">Improvement</p>
          <p class="text-2xl font-bold text-emerald-900 dark:text-emerald-300">
            {{ optimizationResults.improvement }}%
          </p>
        </div>
      </div>

      <!-- Detailed Results -->
      <div class="space-y-2">
        <p class="text-sm font-semibold text-emerald-900 dark:text-emerald-300">
          Operations Performed:
        </p>
        <ul class="space-y-2">
          <li
            v-for="(operation, index) in optimizationResults.operations"
            :key="index"
            class="flex items-center space-x-2 text-sm text-emerald-800 dark:text-emerald-400"
          >
            <svg
              class="w-4 h-4 text-emerald-600 dark:text-emerald-500 flex-shrink-0"
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
            <span>{{ operation }}</span>
          </li>
        </ul>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="flex justify-between">
      <button
        @click="$emit('back')"
        class="px-6 py-3 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors font-semibold"
      >
        Back to Database
      </button>
      <button
        v-if="optimizationResults"
        @click="clearResults"
        class="px-6 py-3 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors font-semibold flex items-center gap-2"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
        Clear Results
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const emit = defineEmits(['back', 'optimization-complete'])

const optimizationOptions = [
  {
    id: 'vacuum',
    label: 'Vacuum Database',
    description: 'Reclaim unused space and defragment the database file',
    icon: 'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
  },
  {
    id: 'reindex',
    label: 'Rebuild Indexes',
    description: 'Recreate all indexes to improve query performance',
    icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15'
  },
  {
    id: 'analyze',
    label: 'Analyze Tables',
    description: 'Update statistics for the query optimizer',
    icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
  },
  {
    id: 'integrity',
    label: 'Check Integrity',
    description: 'Verify database integrity and detect corruption',
    icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z'
  }
]

const selectedOptions = ref(['vacuum', 'reindex', 'analyze'])
const isOptimizing = ref(false)
const isAnalyzing = ref(false)
const optimizationProgress = ref('Initializing...')
const optimizationResults = ref(null)
const lastOptimization = ref(null)

const healthMetrics = ref({
  size: '0 MB',
  fragmentation: '0%',
  unusedSpace: '0 MB',
  indexCount: 0
})

const formatDate = (dateString) => {
  if (!dateString) return 'Never'
  const date = new Date(dateString)
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getFragmentationColor = (fragmentation) => {
  const value = parseInt(fragmentation)
  if (value < 10) return 'text-emerald-600 dark:text-emerald-400'
  if (value < 30) return 'text-amber-600 dark:text-amber-400'
  return 'text-red-600 dark:text-red-400'
}

const getHealthStatusClass = () => {
  const frag = parseInt(healthMetrics.value.fragmentation)
  if (frag < 10)
    return 'bg-emerald-100 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300'
  if (frag < 30)
    return 'bg-amber-100 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-300'
  return 'bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-900 dark:text-red-300'
}

const getHealthIcon = () => {
  const frag = parseInt(healthMetrics.value.fragmentation)
  if (frag < 10) return 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
  if (frag < 30)
    return 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
  return 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z'
}

const getHealthStatus = () => {
  const frag = parseInt(healthMetrics.value.fragmentation)
  if (frag < 10) {
    return {
      title: 'Excellent Health',
      description: 'Your database is running optimally with minimal fragmentation.'
    }
  }
  if (frag < 30) {
    return {
      title: 'Good Health',
      description: 'Database is performing well. Consider optimization if performance degrades.'
    }
  }
  return {
    title: 'Needs Optimization',
    description: 'High fragmentation detected. Optimization recommended to improve performance.'
  }
}

const analyzeDatabase = async () => {
  isAnalyzing.value = true
  try {
    const result = await window.api.analyzeDatabase()
    if (result.success) {
      healthMetrics.value = result.metrics
    }
  } catch (error) {
    console.error('Error analyzing database:', error)
  } finally {
    isAnalyzing.value = false
  }
}

const startOptimization = async () => {
  isOptimizing.value = true
  optimizationResults.value = null

  try {
    const startTime = Date.now()

    // Update progress
    optimizationProgress.value = 'Starting optimization...'

    const result = await window.api.optimizeDatabase({
      operations: selectedOptions.value
    })

    if (result.success) {
      const duration = ((Date.now() - startTime) / 1000).toFixed(1)

      optimizationResults.value = {
        timestamp: new Date().toISOString(),
        spaceSaved: result.spaceSaved,
        duration: duration,
        operationsCount: selectedOptions.value.length,
        improvement: result.improvement,
        operations: result.operations
      }

      lastOptimization.value = {
        date: new Date().toISOString(),
        spaceSaved: result.spaceSaved
      }

      // Refresh health metrics
      await analyzeDatabase()

      emit('optimization-complete', optimizationResults.value)
    }
  } catch (error) {
    console.error('Error during optimization:', error)
  } finally {
    isOptimizing.value = false
    optimizationProgress.value = 'Initializing...'
  }
}

const clearResults = () => {
  optimizationResults.value = null
}

const loadLastOptimization = async () => {
  try {
    const result = await window.api.getLastOptimization()
    if (result.success && result.data) {
      lastOptimization.value = result.data
    }
  } catch (error) {
    console.error('Error loading last optimization:', error)
  }
}

onMounted(async () => {
  await loadLastOptimization()
  await analyzeDatabase()
})
</script>

<style scoped>
@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-slide-up {
  animation: slide-up 0.4s ease-out;
}
</style>
