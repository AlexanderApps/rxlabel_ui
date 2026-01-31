<template>
  <div class="space-y-6">
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      <div
        v-for="metric in metrics"
        :key="metric.label"
        class="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700"
      >
        <p
          class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-3"
        >
          {{ metric.label }}
        </p>
        <div class="flex items-end justify-between">
          <div>
            <p class="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-1">
              {{ metric.value }}
            </p>
            <p :class="metric.changeColor" class="text-sm font-bold">{{ metric.change }}</p>
          </div>
          <div
            :class="metric.color"
            class="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg"
          >
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                :d="metric.iconPath"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <div
      class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6"
    >
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-lg font-bold text-slate-800 dark:text-slate-100">Generate Reports</h3>
        <select
          class="px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 dark:text-slate-100 text-sm font-medium"
        >
          <option>Last 7 Days</option>
          <option>Last 30 Days</option>
          <option>Last 90 Days</option>
          <option>Custom Range</option>
        </select>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <div
          v-for="report in reportTypes"
          :key="report.name"
          class="border-2 border-slate-200 dark:border-slate-700 rounded-xl p-5 hover:border-emerald-500 dark:hover:border-emerald-500 transition-all hover:shadow-lg cursor-pointer group"
        >
          <div class="flex items-start justify-between mb-3">
            <div
              :class="report.color"
              class="w-10 h-10 rounded-xl flex items-center justify-center shadow group-hover:scale-110 transition-transform"
            >
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  :d="report.iconPath"
                />
              </svg>
            </div>
            <span :class="report.badge" class="px-2 py-1 rounded-lg text-xs font-bold">
              {{ report.format }}
            </span>
          </div>
          <h4 class="text-sm font-bold text-slate-800 dark:text-slate-100 mb-2">
            {{ report.name }}
          </h4>
          <p class="text-xs text-slate-500 dark:text-slate-400 mb-4">{{ report.description }}</p>
          <button
            class="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 hover:bg-gradient-to-r hover:from-emerald-500 hover:to-teal-600 text-slate-700 dark:text-slate-200 hover:text-white rounded-lg transition-all font-semibold text-xs"
          >
            Generate Report
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
const metrics = [
  {
    label: 'Labels This Month',
    value: '8,432',
    change: '+18.2%',
    changeColor: 'text-emerald-600',
    color: 'bg-gradient-to-br from-emerald-500 to-teal-600',
    iconPath:
      'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z'
  },
  {
    label: 'Avg Daily Volume',
    value: '281',
    change: '+5.3%',
    changeColor: 'text-emerald-600',
    color: 'bg-gradient-to-br from-blue-500 to-cyan-600',
    iconPath:
      'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
  },
  {
    label: 'Error Rate',
    value: '0.3%',
    change: '-0.1%',
    changeColor: 'text-emerald-600',
    color: 'bg-gradient-to-br from-violet-500 to-purple-600',
    iconPath:
      'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
  },
  {
    label: 'Peak Hour',
    value: '2-3PM',
    change: '456 labels',
    changeColor: 'text-slate-500 dark:text-slate-400',
    color: 'bg-gradient-to-br from-amber-500 to-orange-600',
    iconPath: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
  }
]

const reportTypes = [
  {
    name: 'Usage Analytics',
    description: 'Detailed usage statistics and trends',
    format: 'PDF',
    badge: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    color: 'bg-gradient-to-br from-blue-500 to-cyan-600',
    iconPath:
      'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
  },
  {
    name: 'User Activity',
    description: 'User actions and performance metrics',
    format: 'XLSX',
    badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    color: 'bg-gradient-to-br from-emerald-500 to-teal-600',
    iconPath:
      'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z'
  },
  {
    name: 'Label Production',
    description: 'Label creation and printing data',
    format: 'CSV',
    badge: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400',
    color: 'bg-gradient-to-br from-violet-500 to-purple-600',
    iconPath:
      'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z'
  },
  {
    name: 'Error Logs',
    description: 'System errors and warnings log',
    format: 'PDF',
    badge: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    color: 'bg-gradient-to-br from-amber-500 to-orange-600',
    iconPath:
      'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
  },
  {
    name: 'Inventory Report',
    description: 'Label stock and template usage',
    format: 'XLSX',
    badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    color: 'bg-gradient-to-br from-pink-500 to-rose-600',
    iconPath: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4'
  },
  {
    name: 'Compliance Audit',
    description: 'Regulatory compliance tracking',
    format: 'PDF',
    badge: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    color: 'bg-gradient-to-br from-indigo-500 to-blue-600',
    iconPath:
      'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z'
  }
]
</script>
