<template>
  <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
    <div
      v-for="(stat, idx) in stats"
      :key="idx"
      class="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
    >
      <div class="flex items-center justify-between mb-4">
        <div
          :class="stat.color"
          class="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg"
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
        <span :class="stat.changeColor" class="text-sm font-bold">{{ stat.change }}</span>
      </div>
      <h3 class="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-1">{{ stat.value }}</h3>
      <p class="text-sm text-slate-500 dark:text-slate-400 font-medium">{{ stat.label }}</p>
    </div>
  </div>

  <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">
    <div
      class="xl:col-span-2 bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700"
    >
      <h3 class="text-lg font-bold text-slate-800 dark:text-slate-100 mb-6">Recent Activity</h3>
      <div class="space-y-4">
        <div
          v-for="activity in recentActivity"
          :key="activity.id"
          class="flex items-center space-x-4 p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
        >
          <div
            :class="activity.color"
            class="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow"
          >
            {{ activity.initial }}
          </div>
          <div class="flex-1">
            <p class="text-sm font-semibold text-slate-800 dark:text-slate-100">
              {{ activity.action }}
            </p>
            <p class="text-xs text-slate-500 dark:text-slate-400">{{ activity.time }}</p>
          </div>
          <span :class="activity.badge" class="px-3 py-1 rounded-full text-xs font-bold">
            {{ activity.status }}
          </span>
        </div>
      </div>
    </div>

    <div
      class="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700"
    >
      <h3 class="text-lg font-bold text-slate-800 dark:text-slate-100 mb-6">Quick Actions</h3>
      <div class="space-y-3">
        <button
          v-for="action in quickActions"
          :key="action.label"
          class="w-full flex items-center space-x-3 p-4 rounded-xl dark:text-white bg-slate-50 dark:bg-slate-700/50 hover:bg-gradient-to-r hover:from-emerald-500 hover:to-teal-600 hover:text-white transition-all group"
        >
          <svg
            class="w-5 h-5 group-hover:scale-110 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              :d="action.iconPath"
            />
          </svg>
          <span
            class="font-semibold text-sm text-slate-700 dark:text-slate-200 group-hover:text-white"
            >{{ action.label }}</span
          >
        </button>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed, onMounted } from 'vue'

const generalStats = ref({})

const fetchGeneralStats = async () => {
  const stats = await window.api.getStats()
  console.log('General Stats:', stats)
  generalStats.value = stats
}

const stats = computed(() => {
  return [
    {
      label: 'Total Labels',
      value: generalStats.value.labels?.toLocaleString('en-US') || '0',
      // change: '+12.5%',
      changeColor: 'text-emerald-600',
      color: 'bg-gradient-to-br from-emerald-500 to-teal-600',
      iconPath:
        'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z'
    },
    {
      label: 'Active Users',
      value: generalStats.value.users?.toLocaleString('en-US') || '0',
      // change: '+5.2%',
      changeColor: 'text-emerald-600',
      color: 'bg-gradient-to-br from-blue-500 to-cyan-600',
      iconPath:
        'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z'
    },
    {
      label: 'Clients',
      value: generalStats.value.clients?.toLocaleString('en-US') || '0',
      // change: '-3.1%',
      changeColor: 'text-amber-600',
      color: 'bg-gradient-to-br from-amber-500 to-orange-600',
      iconPath:
        'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
    },
    {
      label: 'System Health',
      value: generalStats.value.db_health?.score || 0,
      // change: '+1.2%',
      changeColor: 'text-emerald-600',
      color: 'bg-gradient-to-br from-violet-500 to-purple-600',
      iconPath:
        'M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4'
    }
  ]
})

const recentActivity = [
  {
    id: 1,
    initial: 'JD',
    action: 'John Doe created 5 new labels',
    time: '2 minutes ago',
    status: 'Completed',
    badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    color: 'bg-gradient-to-br from-blue-500 to-cyan-600'
  },
  {
    id: 2,
    initial: 'SM',
    action: 'Sarah Miller updated user permissions',
    time: '15 minutes ago',
    status: 'Completed',
    badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    color: 'bg-gradient-to-br from-violet-500 to-purple-600'
  },
  {
    id: 3,
    initial: 'RJ',
    action: 'Robert Johnson exported database',
    time: '1 hour ago',
    status: 'Processing',
    badge: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    color: 'bg-gradient-to-br from-emerald-500 to-teal-600'
  },
  {
    id: 4,
    initial: 'EW',
    action: 'Emily White modified system settings',
    time: '3 hours ago',
    status: 'Completed',
    badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    color: 'bg-gradient-to-br from-pink-500 to-rose-600'
  }
]

const quickActions = [
  {
    label: 'Create New Label',
    iconPath:
      'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z'
  },
  {
    label: 'Add User',
    iconPath:
      'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z'
  },
  {
    label: 'Generate Report',
    iconPath:
      'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
  },
  {
    label: 'Backup Database',
    iconPath:
      'M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4'
  }
]

onMounted(() => {
  fetchGeneralStats()
})
</script>
