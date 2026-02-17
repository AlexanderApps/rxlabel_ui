<template>
  <div :class="{ dark: isDark }" class="h-screen overflow-hidden font-sans antialiased">
    <div class="flex h-full bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <!-- Sidebar -->
      <aside
        :class="[
          'sidebar-transition border-r border-slate-200 dark:border-slate-800 flex flex-col bg-white dark:bg-slate-900 shadow-xl',
          isSidebarOpen ? 'w-72' : 'w-20'
        ]"
      >
        <!-- Logo & Toggle -->
        <div
          class="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between"
        >
          <transition name="fade-slide">
            <div v-if="isSidebarOpen" class="flex items-center gap-3">
              <button
                class="w-10 h-10 bg-gradient-to-br rounded-xl flex items-center justify-center shadow-md flex-shrink-0"
                @click="toggleSidebar"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
                  <!-- Gradient definitions -->
                  <defs>
                    <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style="stop-color: #f8fafc; stop-opacity: 1" />
                      <stop offset="100%" style="stop-color: #e2e8f0; stop-opacity: 1" />
                    </linearGradient>
                    <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style="stop-color: #10b981; stop-opacity: 1" />
                      <stop offset="100%" style="stop-color: #059669; stop-opacity: 1" />
                    </linearGradient>
                    <linearGradient id="labelGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style="stop-color: #3b82f6; stop-opacity: 1" />
                      <stop offset="100%" style="stop-color: #2563eb; stop-opacity: 1" />
                    </linearGradient>
                  </defs>

                  <!-- Orange Rx symbol with formal serif font -->
                  <text
                    x="100"
                    y="130"
                    font-family="Times New Roman, Times, serif"
                    font-size="110"
                    font-weight="bold"
                    fill="#ea580c"
                    text-anchor="middle"
                  >
                    Rx
                  </text>

                  <!-- Medical cross accent in top right -->
                  <g transform="translate(145, 45)">
                    <rect x="-2" y="0" width="4" height="20" fill="url(#accentGrad)" rx="2" />
                    <rect x="-10" y="8" width="20" height="4" fill="url(#accentGrad)" rx="2" />
                  </g>

                  <!-- Larger blue label tag icon in bottom right corner -->
                  <g transform="translate(140, 145)">
                    <path d="M 0,0 L 30,0 L 37,7 L 37,23 L 0,23 Z" fill="url(#labelGrad)" />
                    <circle cx="9" cy="11.5" r="3" fill="white" />
                    <line
                      x1="17"
                      y1="7"
                      x2="30"
                      y2="7"
                      stroke="white"
                      stroke-width="2"
                      stroke-linecap="round"
                    />
                    <line
                      x1="17"
                      y1="16"
                      x2="30"
                      y2="16"
                      stroke="white"
                      stroke-width="2"
                      stroke-linecap="round"
                    />
                  </g>
                </svg>
                <!-- <svg
                  class="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2.5"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg> -->
              </button>
              <div>
                <!-- <h1 class="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                  RxLabel
                </h1> -->
                <div class="">
                  <svg class="w-30" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 120">
                    <!-- Gradient definitions -->
                    <defs>
                      <linearGradient id="orangeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color: #f97316; stop-opacity: 1" />
                        <stop offset="100%" style="stop-color: #ea580c; stop-opacity: 1" />
                      </linearGradient>
                      <linearGradient id="blueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color: #3b82f6; stop-opacity: 1" />
                        <stop offset="100%" style="stop-color: #2563eb; stop-opacity: 1" />
                      </linearGradient>
                    </defs>

                    <!-- Background transparent -->

                    <!-- "Rx" in orange -->
                    <text
                      x="20"
                      y="80"
                      font-family="Arial, sans-serif"
                      font-size="72"
                      font-weight="700"
                      fill="url(#orangeGrad)"
                      font-style="italic"
                    >
                      Rx
                    </text>

                    <!-- "Label" in blue -->
                    <text
                      x="130"
                      y="80"
                      font-family="Arial, sans-serif"
                      font-size="72"
                      font-weight="700"
                      fill="url(#blueGrad)"
                    >
                      Label
                    </text>
                  </svg>
                </div>
                <p class="text-xs text-slate-500 dark:text-slate-400 font-medium">Admin Console</p>
              </div>
            </div>
          </transition>

          <button
            @click="toggleSidebar"
            class="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle sidebar"
          >
            <svg
              class="w-5 h-5 text-slate-600 dark:text-slate-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        <!-- Navigation -->
        <nav class="flex-1 px-3 py-6 overflow-y-auto">
          <ul class="space-y-1.5">
            <li v-for="item in menuItems" :key="item.id">
              <button
                @click="currentView = item.id"
                :class="[
                  'group w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium',
                  currentView === item.id
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/30'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                ]"
              >
                <svg
                  class="w-5 h-5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    :d="item.iconPath"
                  />
                </svg>
                <transition name="fade-slide">
                  <span v-if="isSidebarOpen" class="truncate">{{ item.label }}</span>
                </transition>
              </button>
            </li>
          </ul>
        </nav>

        <!-- Bottom Section: Theme + User -->
        <div class="p-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
          <button
            @click="toggleTheme"
            class="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-sm font-medium"
          >
            <svg v-if="isDark" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
              />
            </svg>
            <svg v-else class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
            </svg>
            <transition name="fade-slide">
              <span v-if="isSidebarOpen">{{ isDark ? 'Light' : 'Dark' }} Mode</span>
            </transition>
          </button>

          <transition name="fade-slide">
            <div
              v-if="isSidebarOpen"
              class="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800"
            >
              <div
                class="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold shadow-md"
              >
                AD
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-semibold text-slate-900 dark:text-white truncate">
                  {{ currentUser.name || 'Admin User' }}
                </p>
                <p class="text-xs text-slate-500 dark:text-slate-400 truncate">
                  {{ currentUser.email }}
                </p>
              </div>
            </div>
          </transition>
        </div>
      </aside>

      <!-- Main Content -->
      <div class="flex-1 flex flex-col overflow-hidden">
        <!-- Header -->
        <header
          class="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-5 shadow-sm flex items-center justify-between"
        >
          <div>
            <h2 class="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              {{ currentMenuItem.label }}
            </h2>
            <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {{ currentMenuItem.description }}
            </p>
          </div>

          <div class="flex items-center gap-4">
            <button
              class="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors font-medium text-sm"
            >
              Export Data
            </button>
            <button
              class="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:shadow-xl hover:shadow-emerald-500/30 transition-all font-medium text-sm"
            >
              Save Changes
            </button>
            <button
              class="group relative flex items-center justify-center w-10 h-10 rounded-full border-2 border-gray-200 dark:border-gray-700 bg-gradient-to-br from-emerald-500 hover:border-green-500 dark:hover:border-green-400 hover:bg-green-50 dark:hover:bg-green-950/50 transition-all duration-200 shadow-sm hover:shadow-md hover:scale-105 active:scale-95"
              title="Go to Labels"
              @click="() => router.push({ name: 'MedicationLabel' })"
            >
              <!-- Icon -->
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                fill="currentColor"
                class="text-gray-600 dark:text-gray-400 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-200"
                viewBox="0 0 16 16"
              >
                <path
                  d="M2 1a1 1 0 0 0-1 1v4.586a1 1 0 0 0 .293.707l7 7a1 1 0 0 0 1.414 0l4.586-4.586a1 1 0 0 0 0-1.414l-7-7A1 1 0 0 0 6.586 1zm4 3.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0"
                />
              </svg>

              <!-- Tooltip (optional) -->
              <span
                class="absolute -bottom-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-gradient-to-br from-emerald-500 to-teal-600 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none"
              >
                Labels
              </span>
            </button>
          </div>
        </header>

        <!-- Content -->
        <main class="flex-1 overflow-y-auto p-6 lg:p-8 bg-slate-50/50 dark:bg-slate-950/50">
          <component :is="currentComponent" :key="currentView" />
          <!-- <transition name="fade" mode="out-in">
          </transition> -->
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, defineAsyncComponent, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useSettings } from '../composables/useSettings'
import { useAdmin, generalStats } from '../composables/useAdmin'

const router = useRouter()
const { currentUser } = useSettings()
const { getGeneralStats, getBackupSettings } = useAdmin()

const DashboardView = defineAsyncComponent(() => import('../components/admin/DashboardView.vue'))
const UsersView = defineAsyncComponent(() => import('../components/admin/UsersView.vue'))
const LabelsView = defineAsyncComponent(() => import('../components/admin/LabelsView.vue'))
const SettingsView = defineAsyncComponent(() => import('../components/admin/SettingsView.vue'))
const DatabaseView = defineAsyncComponent(() => import('../components/admin/DatabaseView.vue'))
const ReportsView = defineAsyncComponent(() => import('../components/admin/ReportsView.vue'))

const views = {
  dashboard: DashboardView,
  users: UsersView,
  labels: LabelsView,
  settings: SettingsView,
  database: DatabaseView,
  reports: ReportsView
}

const isDark = ref(false)
const isSidebarOpen = ref(true)
const currentView = ref('dashboard')

const menuItems = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    iconPath:
      'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
    description: 'Overview and quick stats'
  },
  {
    id: 'users',
    label: 'Users',
    iconPath:
      'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
    description: 'Manage user accounts and permissions'
  },
  {
    id: 'labels',
    label: 'Labels',
    iconPath:
      'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z',
    description: 'Label templates and printing'
  },
  {
    id: 'database',
    label: 'Database',
    iconPath:
      'M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4',
    description: 'Database management and backups'
  },
  {
    id: 'reports',
    label: 'Reports',
    iconPath:
      'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
    description: 'Analytics and reporting tools'
  },
  {
    id: 'settings',
    label: 'Settings',
    iconPath:
      'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z',
    description: 'System configuration and preferences'
  }
]

const currentMenuItem = computed(
  () => menuItems.find((item) => item.id === currentView.value) || menuItems[0]
)

const currentComponent = computed(() => views[currentView.value])

const toggleTheme = () => {
  isDark.value = !isDark.value
  // You can also sync with localStorage or system preference here
}

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

onMounted(async () => {
  await getGeneralStats()
  await getBackupSettings()
  console.log(generalStats.value)
})
</script>

<style scoped>
.sidebar-transition {
  transition: width 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.25s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(-12px);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Scrollbar */
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}
.dark ::-webkit-scrollbar-thumb {
  background: #475569;
}
::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
.dark ::-webkit-scrollbar-thumb:hover {
  background: #64748b;
}
</style>
