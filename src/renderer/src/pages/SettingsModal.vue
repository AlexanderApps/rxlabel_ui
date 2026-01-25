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
                  <!-- Help Icon -->
                  <svg
                    v-if="tab.icon === 'help'"
                    class="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
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
                    <select
                      v-model="settings.font_size"
                      class="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg outline-0 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="small">Small</option>
                      <option value="medium">Medium</option>
                      <option value="large">Large</option>
                    </select>
                  </div>
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
                    <input
                      type="text"
                      class="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg outline-0 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your name"
                      :value="currentUser?.name || ''"
                      readonly
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      class="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg outline-0 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="your@email.com"
                      :value="currentUser?.email || ''"
                      readonly
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Role
                    </label>
                    <input
                      type="text"
                      class="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg outline-0 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Pharmacist"
                      :value="currentUser?.role || ''"
                      readonly
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
                    <input
                      type="text"
                      class="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg outline-0 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter facility name"
                      v-model="settings.facility_name"
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Facility Contact
                    </label>
                    <input
                      type="text"
                      class="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg outline-0 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter facility phone number"
                      v-model="settings.facility_contact"
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Facility Address
                    </label>
                    <textarea
                      rows="3"
                      class="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg outline-0 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter facility address"
                      v-model="settings.facility_address"
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Date Format
                    </label>
                    <select
                      v-model="settings.date_format"
                      class="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg outline-0 focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
                    >
                      <option v-for="opt in dateTimeOptions" :key="opt.id" :value="opt.id">
                        {{ opt.label }} — ({{ opt.value }})
                      </option>
                    </select>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Queue Size
                    </label>
                    <input
                      type="number"
                      class="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg outline-0 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter queue size"
                      v-model.number="settings.queue_size"
                    />
                  </div>
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
                        settings.alert_sound ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                      ]"
                      @click="settings.alert_sound = settings.alert_sound ? 0 : 1"
                    >
                      <span
                        :class="[
                          'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                          settings.alert_sound ? 'translate-x-6' : 'translate-x-1'
                        ]"
                      />
                    </button>
                  </div>
                </div>
              </div>

              <!-- Privacy Tab -->
              <div v-if="activeTab === 'privacy'">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Privacy & Security
                </h3>

                <div class="space-y-4">
                  <p class="text-sm text-gray-600 dark:text-gray-400">
                    Privacy and security settings will be available in future updates.
                  </p>
                </div>
              </div>

              <!-- Help Tab -->
              <div v-if="activeTab === 'help'">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Help & Support
                </h3>

                <div class="space-y-6">
                  <div
                    class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4"
                  >
                    <h4 class="font-semibold text-blue-900 dark:text-blue-300 mb-2">Quick Tips</h4>
                    <ul class="space-y-2 text-sm text-blue-800 dark:text-blue-200">
                      <li class="flex items-start gap-2">
                        <svg
                          class="w-5 h-5 mt-0.5 flex-shrink-0"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clip-rule="evenodd"
                          />
                        </svg>
                        <span
                          >Use keyboard shortcuts to navigate faster through the application</span
                        >
                      </li>
                      <li class="flex items-start gap-2">
                        <svg
                          class="w-5 h-5 mt-0.5 flex-shrink-0"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clip-rule="evenodd"
                          />
                        </svg>
                        <span
                          >Enable sound alerts to get notified when labels are ready to print</span
                        >
                      </li>
                      <li class="flex items-start gap-2">
                        <svg
                          class="w-5 h-5 mt-0.5 flex-shrink-0"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clip-rule="evenodd"
                          />
                        </svg>
                        <span>Customize your date format to match your region's preferences</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 class="font-semibold text-gray-900 dark:text-white mb-3">
                      Frequently Asked Questions
                    </h4>
                    <div class="space-y-3">
                      <details class="group bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                        <summary
                          class="font-medium text-gray-900 dark:text-white cursor-pointer list-none flex items-center justify-between"
                        >
                          <span>How do I change the facility information?</span>
                          <svg
                            class="w-5 h-5 transition-transform group-open:rotate-180"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </summary>
                        <p class="mt-3 text-sm text-gray-600 dark:text-gray-400">
                          Navigate to the "Label Settings" tab and update your facility name,
                          address, and contact information. Click "Save Changes" to apply.
                        </p>
                      </details>

                      <details class="group bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                        <summary
                          class="font-medium text-gray-900 dark:text-white cursor-pointer list-none flex items-center justify-between"
                        >
                          <span>What does queue size mean?</span>
                          <svg
                            class="w-5 h-5 transition-transform group-open:rotate-180"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </summary>
                        <p class="mt-3 text-sm text-gray-600 dark:text-gray-400">
                          Queue size determines the maximum number of labels that can be queued for
                          printing at once. Adjust this based on your workflow needs.
                        </p>
                      </details>

                      <details class="group bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                        <summary
                          class="font-medium text-gray-900 dark:text-white cursor-pointer list-none flex items-center justify-between"
                        >
                          <span>Can I switch between light and dark mode?</span>
                          <svg
                            class="w-5 h-5 transition-transform group-open:rotate-180"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </summary>
                        <p class="mt-3 text-sm text-gray-600 dark:text-gray-400">
                          Yes! Go to the "Appearance" tab and select your preferred theme: Light,
                          Dark, or System (which follows your device's theme).
                        </p>
                      </details>
                    </div>
                  </div>

                  <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
                    <h4 class="font-semibold text-gray-900 dark:text-white mb-3">
                      Need More Help?
                    </h4>
                    <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      If you're experiencing issues or have questions not covered here, please
                      contact support.
                    </p>
                    <button
                      class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                    >
                      Contact Support
                    </button>
                  </div>
                </div>
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
import { ref, reactive, computed, onMounted, toRaw } from 'vue'

const currentUser = ref(null)

defineProps({
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
  { id: 'privacy', label: 'Privacy', icon: 'shield' },
  { id: 'help', label: 'Help', icon: 'help' }
]

// Initialize settings with default structure matching DB schema
const settings = reactive({
  id: null,
  facility_name: '',
  facility_address: '',
  facility_contact: '',
  queue_size: 100,
  date_format: 'dt3',
  alert_sound: 1,
  theme: 'system',
  font_size: 'medium',
  created_at: null
})

const settingsOriginal = reactive({})

// Generate date/time format options
const now = new Date()

const dateTimeOptions = computed(() => [
  // DATE ONLY FORMATS
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
  { id: 'd4', label: 'Technical', value: now.toLocaleDateString('en-CA') },
  {
    id: 'd5',
    label: 'Day & Month',
    value: new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    }).format(now)
  },

  // DATE + TIME FORMATS
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

const applyTheme = (theme) => {
  settings.theme = theme

  if (theme === 'dark') {
    document.documentElement.classList.add('dark')
  } else if (theme === 'light') {
    document.documentElement.classList.remove('dark')
  } else if (theme === 'system') {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }
}

const saveSettings = async () => {
  // Apply theme before saving
  applyTheme(settings.theme)

  await window.api.saveSettings(toRaw(settings))

  // Emit settings to parent component
  emit('save', { ...settings })
  closeModal()
}

const closeModal = () => {
  emit('close')
}

onMounted(async () => {
  // Fetch current user
  currentUser.value = await window.api.getMe()

  // Fetch settings from database
  const dbSettings = await window.api.getSettings()

  // Merge DB settings into reactive settings object
  if (dbSettings) {
    Object.assign(settings, dbSettings)
    Object.assign(settingsOriginal, dbSettings)
  }

  // Apply current theme on mount
  if (settings.theme) {
    applyTheme(settings.theme)
  }
})
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e0;
  border-radius: 3px;
}

.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background: #4a5568;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
