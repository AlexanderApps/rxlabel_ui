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
          <h2 class="text-2xl font-bold text-slate-800 dark:text-slate-100">Backup Settings</h2>
          <p class="text-sm text-slate-500 dark:text-slate-400">
            Configure automatic and manual backups
          </p>
        </div>
      </div>
    </div>

    <!-- Automatic Backup Configuration -->
    <div
      class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 space-y-6"
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
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div>
            <h3 class="text-lg font-bold text-slate-800 dark:text-slate-100">Automatic Backups</h3>
            <p class="text-sm text-slate-500 dark:text-slate-400">
              Schedule regular automatic backups
            </p>
          </div>
        </div>
        <label class="relative inline-flex items-center cursor-pointer">
          <input
            v-model="settings.auto.enabled"
            type="checkbox"
            class="sr-only peer"
            @change="saveSettings"
          />
          <div
            class="w-14 h-7 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-slate-600 peer-checked:bg-blue-600"
          ></div>
        </label>
      </div>

      <div v-if="settings.auto.enabled" class="space-y-6 pl-16 animate-fade-in">
        <!-- Backup Frequency -->
        <div class="space-y-3">
          <label class="text-sm font-semibold text-slate-700 dark:text-slate-300"
            >Backup Frequency</label
          >
          <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
            <button
              v-for="freq in frequencies"
              :key="freq.value"
              @click="selectFrequency(freq.value)"
              class="flex flex-col items-center p-4 rounded-xl border-2 transition-all"
              :class="
                settings.auto.frequency === freq.value
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
              "
            >
              <svg
                class="w-8 h-8 mb-2"
                :class="
                  settings.auto.frequency === freq.value
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-slate-400'
                "
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  :d="freq.icon"
                />
              </svg>
              <span
                class="text-sm font-semibold"
                :class="
                  settings.auto.frequency === freq.value
                    ? 'text-blue-800 dark:text-blue-300'
                    : 'text-slate-700 dark:text-slate-300'
                "
                >{{ freq.label }}</span
              >
              <span class="text-xs text-slate-500 dark:text-slate-400">{{ freq.description }}</span>
            </button>
          </div>
        </div>

        <!-- Max Auto Backups -->
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <label class="text-sm font-semibold text-slate-700 dark:text-slate-300"
              >Maximum Automatic Backups</label
            >
            <span class="text-sm font-bold text-blue-600 dark:text-blue-400">{{
              settings.auto.maxCount
            }}</span>
          </div>
          <div class="space-y-2">
            <input
              v-model.number="settings.auto.maxCount"
              type="range"
              min="1"
              max="20"
              step="1"
              @change="saveSettings"
              class="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700 accent-blue-600"
            />
            <div class="flex justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>1 backup</span>
              <span>20 backups</span>
            </div>
          </div>
          <p class="text-xs text-slate-500 dark:text-slate-400">
            Oldest backups will be automatically deleted when this limit is reached
          </p>
        </div>

        <!-- Next Scheduled Backup -->
        <div
          class="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl"
        >
          <div class="flex items-center space-x-3">
            <svg
              class="w-5 h-5 text-blue-600 dark:text-blue-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              <p class="text-sm font-semibold text-blue-800 dark:text-blue-300">
                Next Scheduled Backup
              </p>
              <p class="text-xs text-blue-600 dark:text-blue-400">{{ nextBackupTime }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Manual Backup Configuration -->
    <div
      class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 space-y-6"
    >
      <div class="flex items-center space-x-4">
        <div
          class="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg"
        >
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
            />
          </svg>
        </div>
        <div>
          <h3 class="text-lg font-bold text-slate-800 dark:text-slate-100">Manual Backups</h3>
          <p class="text-sm text-slate-500 dark:text-slate-400">
            Create backups on demand and manage retention
          </p>
        </div>
      </div>

      <div class="space-y-6">
        <!-- Max Manual Backups -->
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <label class="text-sm font-semibold text-slate-700 dark:text-slate-300"
              >Maximum Manual Backups</label
            >
            <span class="text-sm font-bold text-emerald-600 dark:text-emerald-400">{{
              settings.manual.maxCount
            }}</span>
          </div>
          <div class="space-y-2">
            <input
              v-model.number="settings.manual.maxCount"
              type="range"
              min="1"
              max="50"
              step="1"
              @change="saveSettings"
              class="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700 accent-emerald-600"
            />
            <div class="flex justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>1 backup</span>
              <span>50 backups</span>
            </div>
          </div>
          <p class="text-xs text-slate-500 dark:text-slate-400">
            Oldest manual backups will be automatically deleted when this limit is reached
          </p>
        </div>

        <!-- Current Manual Backups Count -->
        <div class="grid grid-cols-2 gap-4">
          <div class="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
            <p class="text-xs text-slate-500 dark:text-slate-400 mb-1">Current Manual Backups</p>
            <p class="text-2xl font-bold text-slate-800 dark:text-slate-100">
              {{ manualBackupCount }}
            </p>
          </div>
          <div class="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
            <p class="text-xs text-slate-500 dark:text-slate-400 mb-1">Available Slots</p>
            <p class="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {{ settings.manual.maxCount - manualBackupCount }}
            </p>
          </div>
        </div>

        <!-- Create Manual Backup Button -->
        <button
          :disabled="isCreatingBackup"
          class="w-full group flex items-center justify-center space-x-3 p-4 rounded-xl font-semibold transition-all"
          :class="
            isCreatingBackup
              ? 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700 shadow-lg hover:shadow-xl hover:scale-102'
          "
          @click="createManualBackup"
        >
          <svg
            v-if="isCreatingBackup"
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
          <svg
            v-else
            class="w-5 h-5 group-hover:rotate-90 transition-transform duration-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
          <span>{{ isCreatingBackup ? 'Creating Backup...' : 'Create Manual Backup Now' }}</span>
        </button>
      </div>
    </div>

    <!-- Storage Information -->
    <div
      class="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl border border-purple-200 dark:border-purple-800 p-6"
    >
      <div class="flex items-start space-x-4">
        <div
          class="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0"
        >
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
            />
          </svg>
        </div>
        <div class="flex-1">
          <h3 class="text-lg font-bold text-purple-800 dark:text-purple-300 mb-2">Storage Usage</h3>
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-sm text-purple-700 dark:text-purple-400">Total Backups</span>
              <span class="text-sm font-bold text-purple-800 dark:text-purple-300"
                >{{ totalBackupCount }} files</span
              >
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-purple-700 dark:text-purple-400">Total Size</span>
              <span class="text-sm font-bold text-purple-800 dark:text-purple-300">{{
                totalBackupSize
              }}</span>
            </div>
            <div class="w-full bg-purple-200 dark:bg-purple-900/50 rounded-full h-2">
              <div
                class="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full transition-all duration-500"
                :style="{ width: `${storagePercentage}%` }"
              ></div>
            </div>
            <p class="text-xs text-purple-600 dark:text-purple-400">
              {{ storagePercentage }}% of estimated storage used
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="flex justify-between">
      <button
        class="px-6 py-3 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors font-semibold"
        @click="$emit('back')"
      >
        Back
      </button>
      <button
        @click="saveSettings"
        :disabled="isSaving"
        class="px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2"
        :class="
          isSaving
            ? 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed'
            : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl'
        "
      >
        <svg
          v-if="isSaving"
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
            d="M5 13l4 4L19 7"
          />
        </svg>
        {{ isSaving ? 'Saving...' : 'Save Settings' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { backupSettings, backups } from '../../composables/useAdmin'
import { useSettings } from '../../composables/useSettings'
import { useAlerts } from '../../composables/useAlerts'
import { useConfirm } from '../../composables/useConfirm'

const emit = defineEmits(['back', 'backup-created', 'settings-saved'])

const alerts = useAlerts()
const { confirm } = useConfirm()
const frequencies = [
  {
    value: 'hourly',
    label: 'Hourly',
    description: 'Every hour',
    icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
  },
  {
    value: 'daily',
    label: 'Daily',
    description: 'Once per day',
    icon: 'M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z'
  },
  {
    value: 'weekly',
    label: 'Weekly',
    description: 'Once per week',
    icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
  },
  {
    value: 'monthly',
    label: 'Monthly',
    description: 'Once per month',
    icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
  }
]

function formatBytes(bytes, targetUnit) {
  if (!bytes || bytes === 0) return '0 B'

  const units = ['B', 'KB', 'MB', 'GB', 'TB']

  // 1. Determine the index (power of 1024)
  let i
  if (targetUnit && units.includes(targetUnit.toUpperCase())) {
    i = units.indexOf(targetUnit.toUpperCase())
  } else {
    // Fallback to your original auto-scaling logic
    i = Math.floor(Math.log(bytes) / Math.log(1024))
    // Ensure we don't exceed the bounds of our units array
    i = Math.min(i, units.length - 1)
  }

  // 2. Calculate and format
  const value = bytes / Math.pow(1024, i)
  return `${value.toFixed(2)} ${units[i]}`
}

const { formatDate } = useSettings()

const settings = ref({ ...backupSettings.value })

const isCreatingBackup = ref(false)
const isSaving = ref(false)

const manualBackupCount = computed(() => {
  return backups.value.filter((obj) => obj.type === 'manual').length
})

const autoBackupCount = computed(() => {
  return backups.value.filter((obj) => obj.type === 'auto').length
})

const totalBackupCount = computed(() => {
  return manualBackupCount.value + autoBackupCount.value
})

const totalBackupSize = computed(() => {
  const byteSize = backups.value.reduce((sum, size) => sum + size.sizeBytes, 0)
  return formatBytes(byteSize, 'MB')
})

const storagePercentage = computed(() => {
  const maxBackups = settings.value.auto.maxCount + settings.value.manual.maxCount
  const currentBackups = totalBackupCount.value
  return Math.min(Math.round((currentBackups / maxBackups) * 100), 100)
})

const nextBackupTime = computed(() => {
  if (!settings.value.auto.enabled) return 'Not scheduled'

  return formatDate(backupSettings.value.nextScheduledBackup.iso)
})

const selectFrequency = (frequency) => {
  settings.value.auto.frequency = frequency
  saveSettings()
}

const loadSettings = async () => {
  try {
    const result = await window.api.getBackupSettings()
    if (result.success) {
      settings.value = result.settings
      manualBackupCount.value = result.stats.manualCount
      autoBackupCount.value = result.stats.autoCount
      totalBackupSize.value = result.stats.totalSize
    }
  } catch (error) {
    console.error('Error loading settings:', error)
  }
}

const saveSettings = async () => {
  isSaving.value = true
  try {
    const result = await window.api.saveBackupSettings(settings.value)
    if (result.success) {
      emit('settings-saved', settings.value)
    }
  } catch (error) {
    console.error('Error saving settings:', error)
  } finally {
    setTimeout(() => {
      isSaving.value = false
    }, 500)
  }
}

const createManualBackup = async () => {
  if (await confirm('Are you sure you want to create a backup')) {
    isCreatingBackup.value = true
    try {
      const result = await window.api.createManualBackup()
      if (result) {
        manualBackupCount.value++
        alerts.success('Successfully created backup')
        emit('backup-created', result)
      }
    } catch (error) {
      alerts.error('Error creating backup')
      console.error('Error creating backup:', error)
    } finally {
      isCreatingBackup.value = false
    }
  }
}

onMounted(() => {
  loadSettings()
  console.log(settings.value)
  console.log(backups.value)
})
</script>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.3s ease-out;
}

/* Custom range slider styling */
input[type='range']::-webkit-slider-thumb {
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%);
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}

input[type='range']::-webkit-slider-thumb:hover {
  transform: scale(1.2);
}

input[type='range']::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%);
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border: none;
  transition: transform 0.2s;
}

input[type='range']::-moz-range-thumb:hover {
  transform: scale(1.2);
}
</style>
