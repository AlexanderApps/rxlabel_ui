<template>
  <div class="space-y-6">
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
          v-for="backup in backups"
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
          <div class="flex items-center space-x-2">
            <button
              class="px-3 py-1.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-lg hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-colors text-xs font-bold"
            >
              Restore
            </button>
            <button
              class="px-3 py-1.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors text-xs font-bold"
            >
              Download
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
const dbStats = [
  {
    label: 'Total Records',
    value: '45,231',
    color: 'bg-gradient-to-br from-blue-500 to-cyan-600',
    iconPath:
      'M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4'
  },
  {
    label: 'Database Size',
    value: '2.3 GB',
    color: 'bg-gradient-to-br from-violet-500 to-purple-600',
    iconPath: 'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12'
  },
  {
    label: 'Last Backup',
    value: '2h ago',
    color: 'bg-gradient-to-br from-emerald-500 to-teal-600',
    iconPath: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
  }
]

const dbActions = [
  {
    label: 'Create Backup',
    iconPath:
      'M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4',
    color: 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white'
  },
  {
    label: 'Import Data',
    iconPath: 'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4',
    color: 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200'
  },
  {
    label: 'Export Data',
    iconPath: 'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12',
    color: 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200'
  },
  {
    label: 'Optimize Database',
    iconPath: 'M13 10V3L4 14h7v7l9-11h-7z',
    color: 'bg-gradient-to-r from-amber-500 to-orange-600 text-white'
  }
]

const backups = [
  { id: 1, name: 'Auto Backup - Daily', date: 'Jan 30, 2026 10:00 AM', size: '2.3 GB' },
  { id: 2, name: 'Manual Backup', date: 'Jan 29, 2026 3:45 PM', size: '2.2 GB' },
  { id: 3, name: 'Auto Backup - Daily', date: 'Jan 29, 2026 10:00 AM', size: '2.2 GB' },
  { id: 4, name: 'Weekly Backup', date: 'Jan 24, 2026 12:00 PM', size: '2.1 GB' }
]
</script>
