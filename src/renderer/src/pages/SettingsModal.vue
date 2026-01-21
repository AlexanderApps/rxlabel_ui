<!-- SettingsModal.vue -->
<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="show"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm dark:text-white"
        @click.self="closeModal"
      >
        <div
          class="relative w-full max-w-4xl h-150 bg-white dark:bg-gray-900 rounded-lg shadow-2xl overflow-hidden"
        >
          <!-- Header -->
          <div
            class="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800"
          >
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Settings</h2>
            <button
              class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-500 dark:text-gray-400"
              @click="closeModal"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <!-- Content -->
          <div class="flex h-[calc(100%-73px)]">
            <!-- Left Sidebar Tabs -->
            <div
              class="w-56 border-r border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 p-3 overflow-y-auto"
            >
              <nav class="space-y-1">
                <button
                  v-for="tab in tabs"
                  :key="tab.id"
                  :class="[
                    'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left',
                    activeTab === tab.id
                      ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  ]"
                  @click="activeTab = tab.id"
                >
                  <!-- Palette Icon -->
                  <svg
                    v-if="tab.icon === 'palette'"
                    class="w-5 h-5"
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
                  <!-- User Icon -->
                  <svg
                    v-if="tab.icon === 'user'"
                    class="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <!-- Tag Icon -->
                  <svg
                    v-if="tab.icon === 'tag'"
                    class="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                    />
                  </svg>
                  <!-- Bell Icon -->
                  <svg
                    v-if="tab.icon === 'bell'"
                    class="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                  <!-- Shield Icon -->
                  <svg
                    v-if="tab.icon === 'shield'"
                    class="w-5 h-5"
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
                  {{ tab.label }}
                </button>
              </nav>
            </div>

            <!-- Right Content Area -->
            <div class="flex-1 overflow-y-auto p-6">
              <!-- Appearance Tab -->
              <div v-if="activeTab === 'appearance'">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Appearance</h3>

                <div class="space-y-6">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Theme
                    </label>
                    <div class="flex gap-3">
                      <button
                        v-for="theme in ['light', 'dark', 'system']"
                        :key="theme"
                        :class="[
                          'flex flex-1 px-4 py-3 gap-4 item-center rounded-lg border-2 transition-all capitalize',
                          settings.theme === theme
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                        ]"
                        @click="applyTheme(theme)"
                      >
                        <svg
                          v-if="theme == 'light'"
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        >
                          <circle cx="12" cy="12" r="4"></circle>
                          <path d="M12 2v2"></path>
                          <path d="M12 20v2"></path>
                          <path d="m4.93 4.93 1.41 1.41"></path>
                          <path d="m17.66 17.66 1.41 1.41"></path>
                          <path d="M2 12h2"></path>
                          <path d="M20 12h2"></path>
                          <path d="m6.34 17.66-1.41 1.41"></path>
                          <path d="m19.07 4.93-1.41 1.41"></path>
                        </svg>
                        <svg
                          v-if="theme == 'dark'"
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        >
                          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
                        </svg>
                        {{ theme }}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Font Size
                    </label>
                    <!-- v-model="settings.appearance.fontSize" -->
                    <select
                      class="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg outline-0 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="small">Small</option>
                      <option value="medium">Medium</option>
                      <option value="large">Large</option>
                    </select>
                  </div>

                  <!-- <div class="flex items-center justify-between">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Compact Mode
                      </label>
                      <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Display more content in less space
                      </p>
                    </div>
                    <button
                      :class="[
                        'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                        settings.appearance.compactMode
                          ? 'bg-blue-600'
                          : 'bg-gray-200 dark:bg-gray-700'
                      ]"
                      @click="settings.appearance.compactMode = !settings.appearance.compactMode"
                    >
                      <span
                        :class="[
                          'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                          settings.appearance.compactMode ? 'translate-x-6' : 'translate-x-1'
                        ]"
                      />
                    </button>
                  </div> -->
                </div>
              </div>

              <!-- User Tab -->
              <div v-if="activeTab === 'user'">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  User Profile
                </h3>

                <div class="space-y-6">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Full Name
                    </label>
                    <!-- v-model="settings.user.name" -->
                    <input
                      type="text"
                      class="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg outline-0 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your name"
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email
                    </label>
                    <!-- v-model="settings.user.email" -->
                    <input
                      type="email"
                      class="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg outline-0 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="your@email.com"
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Role
                    </label>
                    <!-- v-model="settings.user.role" -->
                    <input
                      type="text"
                      class="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg outline-0 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Pharmacist"
                    />
                  </div>
                </div>
              </div>

              <!-- Label Tab -->
              <div v-if="activeTab === 'label'">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Label Settings
                </h3>

                <div class="h-90 space-y-6 overflow-auto pr-4 pl-1 pb-12 custom-scrollbar">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Facility Name
                    </label>
                    <!-- v-model="settings.facility_name" -->
                    <input
                      type="text"
                      class="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg outline-0 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter facility name"
                      :value="initialSettings.facility_name"
                      readonly="true"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Facility Contact
                    </label>
                    <input
                      :value="initialSettings.facility_contact"
                      type="text"
                      class="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg outline-0 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter facility phone number"
                      readonly="true"
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Facility Address
                    </label>
                    <textarea
                      :value="initialSettings.facility_address"
                      rows="3"
                      class="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg outline-0 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter facility address"
                      readonly="true"
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Date Format
                    </label>
                    <!-- v-model links the selection to your settings object -->
                    <!-- v-model="settings.appearance.dateFormat" -->
                    <select
                      :value="initialSettings.date_format"
                      class="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg outline-0 focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
                    >
                      <!-- Use a computed property or method to generate the options list -->
                      <option v-for="opt in dateTimeOptions" :key="opt.id" :value="opt.id">
                        {{ opt.label }} — ({{ opt.value }})
                      </option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Queue Size
                    </label>
                    <!-- v-model="settings.facility_name" -->
                    <input
                      type="number"
                      class="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg outline-0 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter facility name"
                      :value="initialSettings.queue_size"
                      readonly="true"
                    />
                  </div>

                  <!--
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Default Label Size
                    </label>
                    <select
                      v-model="settings.label.defaultSize"
                      class="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg outline-0 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="small">Small (2" x 3")</option>
                      <option value="medium">Medium (3" x 4")</option>
                      <option value="large">Large (4" x 6")</option>
                    </select>
                  </div> -->

                  <!-- <div class="flex items-center justify-between">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Auto-print Labels
                      </label>
                      <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Automatically print when added to queue
                      </p>
                    </div>
                    <button
                      :class="[
                        'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                        settings.label.autoPrint ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                      ]"
                      @click="settings.label.autoPrint = !settings.label.autoPrint"
                    >
                      <span
                        :class="[
                          'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                          settings.label.autoPrint ? 'translate-x-6' : 'translate-x-1'
                        ]"
                      />
                    </button>
                  </div> -->
                </div>
              </div>

              <!-- Notifications Tab -->
              <div v-if="activeTab === 'notifications'">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Notifications
                </h3>

                <div class="space-y-6">
                  <div class="flex items-center justify-between">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Enable Printing Sound
                      </label>
                      <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Play alert sounds for printing
                      </p>
                    </div>
                    <button
                      :class="[
                        'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                        initialSettings.sound ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                      ]"
                      @click="settings.sound = !settings.sound"
                    >
                      <span
                        :class="[
                          'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                          initialSettings.sound ? 'translate-x-6' : 'translate-x-1'
                        ]"
                      />
                    </button>
                  </div>

                  <!-- <div class="flex items-center justify-between">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Sound Alerts
                      </label>
                      <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Play sound for notifications
                      </p>
                    </div>
                    <button
                      :class="[
                        'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                        settings.notifications.sound
                          ? 'bg-blue-600'
                          : 'bg-gray-200 dark:bg-gray-700'
                      ]"
                      @click="settings.notifications.sound = !settings.notifications.sound"
                    >
                      <span
                        :class="[
                          'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                          settings.notifications.sound ? 'translate-x-6' : 'translate-x-1'
                        ]"
                      />
                    </button>
                  </div> -->

                  <!-- <div class="flex items-center justify-between">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Email Notifications
                      </label>
                      <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Receive notifications via email
                      </p>
                    </div>
                    <button
                      :class="[
                        'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                        settings.notifications.email
                          ? 'bg-blue-600'
                          : 'bg-gray-200 dark:bg-gray-700'
                      ]"
                      @click="settings.notifications.email = !settings.notifications.email"
                    >
                      <span
                        :class="[
                          'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                          settings.notifications.email ? 'translate-x-6' : 'translate-x-1'
                        ]"
                      />
                    </button>
                  </div> -->
                </div>
              </div>

              <!-- Privacy Tab -->
              <div v-if="activeTab === 'privacy'">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Privacy & Security
                </h3>

                <!-- <div class="space-y-6">
                  <div class="flex items-center justify-between">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Two-Factor Authentication
                      </label>
                      <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Add an extra layer of security
                      </p>
                    </div>
                    <button
                      :class="[
                        'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                        settings.privacy.twoFactor ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                      ]"
                      @click="settings.privacy.twoFactor = !settings.privacy.twoFactor"
                    >
                      <span
                        :class="[
                          'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                          settings.privacy.twoFactor ? 'translate-x-6' : 'translate-x-1'
                        ]"
                      />
                    </button>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Session Timeout
                    </label>
                    <select
                      v-model="settings.privacy.sessionTimeout"
                      class="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg outline-0 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="15">15 minutes</option>
                      <option value="30">30 minutes</option>
                      <option value="60">1 hour</option>
                      <option value="0">Never</option>
                    </select>
                  </div>

                  <div class="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button
                      class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                    >
                      Change Password
                    </button>
                  </div>
                </div> -->
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div
            class="absolute bottom-0 left-0 right-0 flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50"
          >
            <button
              class="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg font-medium transition-colors"
              @click="closeModal"
            >
              Cancel
            </button>
            <button
              class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              @click="saveSettings"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, reactive, watch, computed } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  initialSettings: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['close', 'save'])

const activeTab = ref('appearance')

const tabs = [
  { id: 'appearance', label: 'Appearance', icon: 'palette' },
  { id: 'user', label: 'User Profile', icon: 'user' },
  { id: 'label', label: 'Label Settings', icon: 'tag' },
  { id: 'notifications', label: 'Notifications', icon: 'bell' },
  { id: 'privacy', label: 'Privacy', icon: 'shield' }
]

const settings = reactive({ ...props.initialSettings })

// 2. Generate the 10 UI-friendly options (5 Date, 5 DateTime)
const now = new Date()

const dateTimeOptions = computed(() => [
  // --- 5 DATE ONLY FORMATS ---
  { id: 'd1', label: 'Short (US)', value: new Intl.DateTimeFormat('en-US').format(now) },
  {
    id: 'd2',
    label: 'Extended',
    value: new Intl.DateTimeFormat('en-US', { dateStyle: 'long' }).format(now)
  },
  {
    id: 'd3',
    label: 'Abbreviated',
    value: new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric'
    }).format(now)
  },
  { id: 'd4', label: 'Technical', value: now.toLocaleDateString('en-CA') }, // YYYY-MM-DD
  {
    id: 'd5',
    label: 'Day & Month',
    value: new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    }).format(now)
  },

  // --- 5 DATE + TIME FORMATS ---
  {
    id: 'dt1',
    label: 'Standard',
    value: new Intl.DateTimeFormat('en-US', { dateStyle: 'short', timeStyle: 'short' }).format(now)
  },
  {
    id: 'dt2',
    label: 'Detailed',
    value: new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(now)
  },
  {
    id: 'dt3',
    label: '24-Hour',
    value: new Intl.DateTimeFormat('en-GB', {
      dateStyle: 'short',
      timeStyle: 'short',
      hour12: false
    }).format(now)
  },
  {
    id: 'dt4',
    label: 'Compact',
    value: now.toLocaleString('en-US', {
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  },
  { id: 'dt5', label: 'ISO Style', value: now.toISOString().replace('T', ' ').substring(0, 16) }
])

// const settings = reactive({
//   appearance: {
//     theme: 'system',
//     fontSize: 'medium',
//     compactMode: false,
//     ...props.initialSettings.appearance
//   },
//   user: {
//     name: '',
//     email: '',
//     role: '',
//     ...props.initialSettings.user
//   },
//   label: {
//     facilityName: '',
//     facilityAddress: '',
//     defaultSize: 'medium',
//     autoPrint: false,
//     ...props.initialSettings.label
//   },
//   notifications: {
//     enabled: true,
//     sound: true,
//     email: false,
//     ...props.initialSettings.notifications
//   },
//   privacy: {
//     twoFactor: false,
//     sessionTimeout: '30',
//     ...props.initialSettings.privacy
//   }
// })

const applyTheme = (theme) => {
  if (theme === 'dark') {
    document.documentElement.classList.add('dark')
  } else if (theme === 'light') {
    document.documentElement.classList.remove('dark')
  } else if (theme === 'system') {
    // Check system preference
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }
}

watch(
  () => settings.theme,
  (newTheme) => {
    applyTheme(newTheme)
  }
)

const saveSettings = () => {
  // Apply theme before saving
  applyTheme(settings.theme)

  // Save to electron store
  window.api.saveSettings(settings)

  emit('save', settings)
  closeModal()
}

const closeModal = () => {
  emit('close')
}

// const saveSettings = () => {
//   emit('save', settings)
//   closeModal()
// }

// const watchThemeChange = (theme) => {
//   emit('theme-change', theme)
//   console.log(theme)
//   settings.appearance.theme = theme
// }
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active > div,
.modal-leave-active > div {
  transition:
    transform 0.2s ease,
    opacity 0.2s ease;
}

.modal-enter-from > div,
.modal-leave-to > div {
  transform: scale(0.95);
  opacity: 0;
}

/* .custom-scrollbar::-webkit-scrollbar {
  width: 6px;
} */

/* .custom-scrollbar::-webkit-scrollbar-track {
  background: rgb(16, 24, 40);
  border-radius: 10px;
} */

/* .custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgb(30, 41, 57);
  border-radius: 6px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(30, 41, 57, 0.6);
} */

/* custom scrollbar in light mode */
</style>
