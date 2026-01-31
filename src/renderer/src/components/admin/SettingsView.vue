<template>
  <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">
    <div class="xl:col-span-2 space-y-6">
      <div
        class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6"
      >
        <h3 class="text-lg font-bold text-slate-800 dark:text-slate-100 mb-6">General Settings</h3>
        <div class="space-y-5">
          <div
            v-for="setting in generalSettings"
            :key="setting.id"
            class="flex items-center justify-between p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
          >
            <div class="flex-1">
              <h4 class="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-1">
                {{ setting.label }}
              </h4>
              <p class="text-xs text-slate-500 dark:text-slate-400">{{ setting.description }}</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer ml-4">
              <input type="checkbox" :checked="setting.enabled" class="sr-only peer" />
              <div
                class="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 dark:peer-focus:ring-emerald-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-gradient-to-r peer-checked:from-emerald-500 peer-checked:to-teal-600"
              ></div>
            </label>
          </div>
        </div>
      </div>

      <div
        class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6"
      >
        <h3 class="text-lg font-bold text-slate-800 dark:text-slate-100 mb-6">
          Printer Configuration
        </h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2"
              >Default Printer</label
            >
            <select
              class="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 dark:text-slate-100"
            >
              <option>Zebra ZD620 (USB)</option>
              <option>Zebra ZT410 (Network)</option>
              <option>Dymo LabelWriter 450</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2"
              >Print Quality</label
            >
            <select
              class="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 dark:text-slate-100"
            >
              <option>High (600 DPI)</option>
              <option>Medium (300 DPI)</option>
              <option>Draft (150 DPI)</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <div class="space-y-6">
      <div
        class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6"
      >
        <h3 class="text-lg font-bold text-slate-800 dark:text-slate-100 mb-6">System Info</h3>
        <div class="space-y-4">
          <div v-for="info in systemInfo" :key="info.label">
            <p class="text-xs text-slate-500 dark:text-slate-400 mb-1">{{ info.label }}</p>
            <p class="text-sm font-semibold text-slate-800 dark:text-slate-100">{{ info.value }}</p>
          </div>
        </div>
      </div>

      <div class="bg-gradient-to-br from-red-500 to-rose-600 rounded-2xl p-6 text-white">
        <h3 class="text-lg font-bold mb-2">Danger Zone</h3>
        <p class="text-sm opacity-90 mb-4">Irreversible actions that affect your system</p>
        <button
          class="w-full px-4 py-2.5 bg-white/20 hover:bg-white/30 rounded-xl font-semibold text-sm transition-colors backdrop-blur"
        >
          Reset All Settings
        </button>
      </div>
    </div>
  </div>
</template>
<script setup>
const generalSettings = [
  { id: 1, label: 'Auto-Save', description: 'Automatically save changes', enabled: true },
  {
    id: 2,
    label: 'Email Notifications',
    description: 'Receive email alerts for important events',
    enabled: true
  },
  {
    id: 3,
    label: 'Sound Effects',
    description: 'Play sounds for actions and alerts',
    enabled: false
  },
  {
    id: 4,
    label: 'Compact Mode',
    description: 'Reduce spacing for more content',
    enabled: false
  },
  {
    id: 5,
    label: 'Analytics',
    description: 'Help improve RxLabel with usage data',
    enabled: true
  }
]

const systemInfo = [
  { label: 'Version', value: 'v2.5.1' },
  { label: 'Database', value: 'SQLite 3.36' },
  { label: 'Last Backup', value: '2 hours ago' },
  { label: 'Storage Used', value: '2.3 GB / 10 GB' }
]
</script>
