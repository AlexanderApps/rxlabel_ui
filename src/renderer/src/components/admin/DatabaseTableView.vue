<template>
  <!-- Show Import View -->
  <ImportDataView
    v-if="showImportView"
    @back="showImportView = false"
    @import-complete="handleImportComplete"
  />

  <!-- Show Export View -->
  <ExportDataView
    v-else-if="showExportView"
    @back="showExportView = false"
    @export-complete="handleExportComplete"
  />

  <!-- Main Database View -->
  <div v-else class="space-y-6">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div
        v-for="stat in dbStats"
        :key="stat.label"
        class="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700"
      >
        <div
          :class="stat.color"
          class="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg mb-4"
        >
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              :d="stat.iconPath"
            />
          </svg>
        </div>
        <h3
          class="text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-2"
        >
          {{ stat.label }}
        </h3>
        <p class="text-2xl font-bold text-slate-800 dark:text-slate-100">{{ stat.value }}</p>
      </div>
    </div>

    <div
      class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6"
    >
      <h3 class="text-lg font-bold text-slate-800 dark:text-slate-100 mb-6">Database Management</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          v-for="action in dbActions"
          :key="action.label"
          :class="action.color"
          @click="action.action"
          class="flex items-center justify-between p-5 rounded-xl font-semibold text-sm transition-all hover:shadow-lg"
        >
          <div class="flex items-center space-x-3">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                :d="action.iconPath"
              />
            </svg>
            <span>{{ action.label }}</span>
          </div>
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </div>

    <div
      class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6"
    >
      <h3 class="text-lg font-bold text-slate-800 dark:text-slate-100 mb-6">Backup History</h3>
      <div class="space-y-3">
        <div
          v-if="backups.length <= 0"
          class="flex flex-col items-center justify-center py-16 px-4"
        >
          <!-- Icon -->
          <div class="relative mb-6">
            <div
              class="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg"
            >
              <svg
                class="w-10 h-10 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                />
              </svg>
            </div>
            <!-- Decorative dots -->
            <div
              class="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full animate-pulse"
            ></div>
            <div
              class="absolute -bottom-1 -left-1 w-3 h-3 bg-purple-400 rounded-full animate-pulse delay-75"
            ></div>
          </div>

          <!-- Heading -->
          <h3 class="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">No Backups Yet</h3>

          <!-- Description -->
          <p class="text-sm text-slate-500 dark:text-slate-400 text-center max-w-sm mb-6">
            Protect your data by creating your first backup. It only takes a few seconds and gives
            you peace of mind.
          </p>

          <!-- CTA Button -->
          <button
            @click="createBackupConfirmed"
            class="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
          >
            <svg
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
            Create Your First Backup
          </button>

          <!-- Benefits list -->
          <div class="mt-8 flex flex-wrap justify-center gap-4 max-w-2xl">
            <div
              class="flex items-center gap-2 px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg"
            >
              <svg
                class="w-4 h-4 text-emerald-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
              <span class="text-xs font-medium text-slate-700 dark:text-slate-300"
                >Secure & Encrypted</span
              >
            </div>
            <div
              class="flex items-center gap-2 px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg"
            >
              <svg
                class="w-4 h-4 text-blue-500"
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
              <span class="text-xs font-medium text-slate-700 dark:text-slate-300"
                >Quick & Easy</span
              >
            </div>
            <div
              class="flex items-center gap-2 px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg"
            >
              <svg
                class="w-4 h-4 text-purple-500"
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
              <span class="text-xs font-medium text-slate-700 dark:text-slate-300"
                >Easy Restore</span
              >
            </div>
          </div>
        </div>
        <div
          v-for="backup in curBackups"
          :key="backup.id"
          class="flex items-center justify-between p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
        >
          <div class="flex items-center space-x-4">
            <div
              class="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow"
            >
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <div>
              <p class="text-sm font-semibold text-slate-800 dark:text-slate-100">
                {{ backup.name }}
              </p>
              <p class="text-xs text-slate-500 dark:text-slate-400">
                {{ backup.date }} • {{ backup.size }}
              </p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <button
              class="px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors text-xs font-bold flex items-center gap-1.5"
              title="View Key"
              @click="getBackupKey(backup.id)"
            >
              <svg
                class="w-4 h-4 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                />
              </svg>
              <span class="hidden sm:inline">View Key</span>
            </button>
            <button
              class="px-3 py-1.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-lg hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-colors text-xs font-bold flex items-center gap-1.5"
              title="Restore"
              @click="restoreBackup(backup.id)"
            >
              <svg
                class="w-4 h-4 flex-shrink-0"
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
              <span class="hidden sm:inline">Restore</span>
            </button>
            <button
              class="px-3 py-1.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors text-xs font-bold flex items-center gap-1.5"
              title="Download"
              @click="downloadBackup(backup.id)"
            >
              <svg
                class="w-4 h-4 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              <span class="hidden sm:inline">Download</span>
            </button>
            <button
              class="px-3 py-1.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors text-xs font-bold flex items-center gap-1.5"
              title="Remove"
              @click="removeBackupConfirmed(backup.id)"
            >
              <svg
                class="w-4 h-4 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              <span class="hidden sm:inline">Remove</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <BackKeyModal
    :is-open="showKeyModal"
    :encryption-key="selectedBackupKey"
    :backup-name="selectedBackupName"
    @close="showKeyModal = false"
  />
</template>
<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import BackKeyModal from './BackKeyModal.vue'
import ImportDataView from './ImportDataView.vue'
import ExportDataView from './ExportDataView.vue'
import { useAdmin, backups, lastBackupDate } from '../../composables/useAdmin'
import { useAlerts } from '../../composables/useAlerts'
import { useSettings } from '../../composables/useSettings'
import { useConfirm } from '../../composables/useConfirm'

const generalStats = ref({})
const showKeyModal = ref(false)
const showImportView = ref(false)
const showExportView = ref(false)
const selectedBackupName = ref('')
const selectedBackupKey = ref('')

const { getBackups, getLastBackupDate } = useAdmin()
const { formatDate } = useSettings()
const alerts = useAlerts()
const { confirm } = useConfirm()

const fetchGeneralStats = async () => {
  const stats = await window.api.getStats()
  console.log(await window.api.getBackups())
  console.log('General Stats:', stats)
  generalStats.value = stats
}

function timeAgo(dateInput) {
  if (!dateInput) return 'no date'

  // Force conversion to string and trim any accidental whitespace
  let cleanDate = String(dateInput).trim()

  // Fix for some DBs that use a space instead of 'T'
  // Only replaces if it matches the pattern "YYYY-MM-DD HH:mm:ss"
  if (cleanDate.includes(' ') && !cleanDate.includes('T')) {
    cleanDate = cleanDate.replace(' ', 'T')
  }

  const date = new Date(cleanDate)

  // If it's still Invalid, let's see why
  if (isNaN(date.getTime())) {
    console.error('Failed to parse date string:', dateInput)
    return 'Invalid date'
  }

  const now = new Date()
  const secondsDiff = Math.round((date - now) / 1000)

  const units = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'week', seconds: 604800 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 },
    { label: 'second', seconds: 1 }
  ]

  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })

  for (const unit of units) {
    if (Math.abs(secondsDiff) >= unit.seconds || unit.label === 'second') {
      const value = Math.round(secondsDiff / unit.seconds)
      return rtf.format(value, unit.label)
    }
  }
}

const dbStats = computed(() => {
  return [
    {
      label: 'Total Records',
      value: '45,231',
      color: 'bg-gradient-to-br from-blue-500 to-cyan-600',
      iconPath:
        'M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4'
    },
    {
      label: 'Database Size',
      value: generalStats.value?.diagnostics?.fileSize?.readable || 'Unknown',
      color: 'bg-gradient-to-br from-violet-500 to-purple-600',
      iconPath: 'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12'
    },
    {
      label: 'Last Backup',
      value: lastBackupDate.value && !'' ? timeAgo(lastBackupDate.value) : 'Unknown',
      color: 'bg-gradient-to-br from-emerald-500 to-teal-600',
      iconPath: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
    }
  ]
})

const dbActions = [
  {
    label: 'Create Backup',
    iconPath:
      'M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4',
    color: 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white',
    action: () => createBackupConfirmed()
  },
  {
    label: 'Import Data',
    iconPath: 'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4',
    color: 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200',
    action: () => (showImportView.value = true)
  },
  {
    label: 'Export Data',
    iconPath: 'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12',
    color: 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200',
    action: () => (showExportView.value = true)
  },
  {
    label: 'Optimize Database',
    iconPath: 'M13 10V3L4 14h7v7l9-11h-7z',
    color: 'bg-gradient-to-r from-amber-500 to-orange-600 text-white',
    action: () => console.log('Optimize database')
  }
]

const curBackups = computed(() => {
  // eslint-disable-next-line no-unused-vars
  return backups.value.map((backup, _) => {
    return {
      id: backup?.fileName,
      name:
        backup?.type === 'manual'
          ? `Manual Backup - ${Date.parse(backup.createdAt)}`
          : `Auto Backup - ${Date.parse(backup.createdAt)}`,
      date: formatDate(backup.createdAt, true),
      size: backup.sizeReadable
    }
  })
})

const downloadBackup = async (id) => {
  const result = await window.api.downloadBackup(id)

  if (result.success) {
    alerts.success(`Backup successfully saved to: ${result.path}`)
  } else if (result.error) {
    alerts.error(`Download failed: ${result.error}`)
  }
}

const createBackup = async () => {
  await window.api.createBackup()
  await getBackups()
}

const createBackupConfirmed = async () => {
  if (await confirm('Are you sure you want to create backup?')) {
    console.log('backup to be created')
    await createBackup()
  }
}

const getBackupKey = async (id) => {
  const result = await window.api.getBackupKey(id)
  selectedBackupKey.value = result
  selectedBackupName.value = id
  showKeyModal.value = true
  console.log(result)
}

const removeBackup = async (id) => {
  await window.api.removeBackup(id)
  await getBackups()
}

const removeBackupConfirmed = async (id) => {
  if (await confirm('Are you sure you want permanently remove this backup?')) {
    console.log('backup to be removed')
    await removeBackup(id)
  }
}

const handleImportComplete = async (result) => {
  showImportView.value = false

  if (result.success) {
    alerts.success(`Successfully imported ${result.rowsImported} rows into ${result.table}`)
    await fetchGeneralStats()
  } else {
    alerts.error(`Import failed: ${result.error}`)
  }
}

const handleExportComplete = async (result) => {
  showExportView.value = false

  if (result.success) {
    const fileWord = result.filesCreated.length === 1 ? 'file' : 'files'
    alerts.success(
      `Successfully exported ${result.totalRecords} records to ${result.filesCreated.length} ${fileWord}`
    )
  } else {
    alerts.error(`Export failed: ${result.error}`)
  }
}

onMounted(async () => {
  await fetchGeneralStats()
  await getBackups()
  await getLastBackupDate()
  console.log(lastBackupDate.value)
})

watch(showKeyModal, () => {
  if (!showKeyModal.value) {
    selectedBackupKey.value = ''
    selectedBackupName.value = ''
    console.log('selectedBackupKey', selectedBackupKey.value)
    console.log('selectedBackupName', selectedBackupName.value)
  }
})
</script>
