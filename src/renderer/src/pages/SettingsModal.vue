<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="show"
        role="dialog"
        aria-modal="true"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm dark:text-white"
        @click.self="closeModal"
      >
        <div
          ref="modalRef"
          tabindex="-1"
          class="relative w-full max-w-4xl h-150 bg-white dark:bg-gray-900 rounded-lg shadow-2xl overflow-hidden"
        >
          <!-- Header -->
          <div
            class="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800"
          >
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Settings</h2>
            <button
              ref="closeBtn"
              class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-500 dark:text-gray-400 select-none"
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
                    'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left  select-none',
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
                  <!-- Shortcut Icon -->
                  <svg
                    v-if="tab.icon === 'shortcuts'"
                    class="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="2" stroke-width="2" />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M8 8h8M8 12h8M8 16h5"
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
                          'relative flex flex-1 flex-col items-center justify-center px-4 py-4 gap-3 rounded-xl border-2 transition-all duration-200 select-none group overflow-hidden',
                          currentTheme === theme
                            ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950 dark:to-blue-900/30 shadow-lg shadow-blue-500/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md'
                        ]"
                        @click="applyTheme(theme)"
                      >
                        <!-- Animated background gradient -->
                        <div
                          v-if="currentTheme === theme"
                          class="absolute inset-0 bg-gradient-to-br from-blue-400/10 to-purple-400/10 dark:from-blue-500/10 dark:to-purple-500/10 animate-pulse"
                        ></div>

                        <!-- Window Icon -->
                        <svg
                          v-if="theme === 'light'"
                          class="relative z-10 transition-transform group-hover:scale-110"
                          width="40"
                          height="40"
                          viewBox="0 0 48 48"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <!-- Window frame -->
                          <rect
                            x="6"
                            y="8"
                            width="36"
                            height="32"
                            rx="3"
                            fill="#ffffff"
                            stroke="currentColor"
                            stroke-width="2"
                          />
                          <!-- Title bar -->
                          <rect
                            x="6"
                            y="8"
                            width="36"
                            height="8"
                            rx="3"
                            fill="currentColor"
                            opacity="0.1"
                          />
                          <!-- Window controls -->
                          <circle
                            cx="11"
                            cy="12"
                            r="1.5"
                            :fill="currentTheme === theme ? '#EF4444' : '#94A3B8'"
                          />
                          <circle
                            cx="16"
                            cy="12"
                            r="1.5"
                            :fill="currentTheme === theme ? '#F59E0B' : '#94A3B8'"
                          />
                          <circle
                            cx="21"
                            cy="12"
                            r="1.5"
                            :fill="currentTheme === theme ? '#10B981' : '#94A3B8'"
                          />
                          <!-- Sun rays -->
                          <circle cx="24" cy="26" r="5" fill="#FCD34D" />
                          <line
                            x1="24"
                            y1="16"
                            x2="24"
                            y2="14"
                            stroke="#FCD34D"
                            stroke-width="2"
                            stroke-linecap="round"
                          />
                          <line
                            x1="24"
                            y1="38"
                            x2="24"
                            y2="36"
                            stroke="#FCD34D"
                            stroke-width="2"
                            stroke-linecap="round"
                          />
                          <line
                            x1="32"
                            y1="26"
                            x2="34"
                            y2="26"
                            stroke="#FCD34D"
                            stroke-width="2"
                            stroke-linecap="round"
                          />
                          <line
                            x1="14"
                            y1="26"
                            x2="16"
                            y2="26"
                            stroke="#FCD34D"
                            stroke-width="2"
                            stroke-linecap="round"
                          />
                        </svg>

                        <svg
                          v-if="theme === 'dark'"
                          class="relative z-10 transition-transform group-hover:scale-110"
                          width="40"
                          height="40"
                          viewBox="0 0 48 48"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <!-- Window frame -->
                          <rect
                            x="6"
                            y="8"
                            width="36"
                            height="32"
                            rx="3"
                            fill="#1E293B"
                            stroke="currentColor"
                            stroke-width="2"
                          />
                          <!-- Title bar -->
                          <rect
                            x="6"
                            y="8"
                            width="36"
                            height="8"
                            rx="3"
                            fill="currentColor"
                            opacity="0.2"
                          />
                          <!-- Window controls -->
                          <circle
                            cx="11"
                            cy="12"
                            r="1.5"
                            :fill="currentTheme === theme ? '#EF4444' : '#475569'"
                          />
                          <circle
                            cx="16"
                            cy="12"
                            r="1.5"
                            :fill="currentTheme === theme ? '#F59E0B' : '#475569'"
                          />
                          <circle
                            cx="21"
                            cy="12"
                            r="1.5"
                            :fill="currentTheme === theme ? '#10B981' : '#475569'"
                          />
                          <!-- Moon and stars -->
                          <path d="M20 26a6 6 0 0 0 8 0 6 6 0 1 1-8 0Z" fill="#93C5FD" />
                          <circle cx="32" cy="20" r="1" fill="#FCD34D" />
                          <circle cx="35" cy="24" r="1" fill="#FCD34D" />
                          <circle cx="34" cy="31" r="1" fill="#FCD34D" />
                        </svg>

                        <svg
                          v-if="theme === 'system'"
                          class="relative z-10 transition-transform group-hover:scale-110"
                          width="40"
                          height="40"
                          viewBox="0 0 48 48"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <!-- Split window frame -->
                          <rect
                            x="6"
                            y="8"
                            width="36"
                            height="32"
                            rx="3"
                            fill="url(#gradient-split)"
                            stroke="currentColor"
                            stroke-width="2"
                          />
                          <defs>
                            <linearGradient id="gradient-split" x1="0%" y1="0%" x2="100%" y2="0%">
                              <stop offset="50%" stop-color="#ffffff" />
                              <stop offset="50%" stop-color="#1E293B" />
                            </linearGradient>
                          </defs>
                          <!-- Title bar -->
                          <rect
                            x="6"
                            y="8"
                            width="36"
                            height="8"
                            rx="3"
                            fill="currentColor"
                            opacity="0.15"
                          />
                          <!-- Window controls -->
                          <circle
                            cx="11"
                            cy="12"
                            r="1.5"
                            :fill="currentTheme === theme ? '#EF4444' : '#64748B'"
                          />
                          <circle
                            cx="16"
                            cy="12"
                            r="1.5"
                            :fill="currentTheme === theme ? '#F59E0B' : '#64748B'"
                          />
                          <circle
                            cx="21"
                            cy="12"
                            r="1.5"
                            :fill="currentTheme === theme ? '#10B981' : '#64748B'"
                          />
                          <!-- Sun (left half) -->
                          <circle cx="17" cy="26" r="4" fill="#FCD34D" />
                          <line
                            x1="17"
                            y1="18"
                            x2="17"
                            y2="16"
                            stroke="#FCD34D"
                            stroke-width="1.5"
                            stroke-linecap="round"
                          />
                          <!-- Moon (right half) -->
                          <path d="M27 26a5 5 0 0 0 6 0 5 5 0 1 1-6 0Z" fill="#93C5FD" />
                          <circle cx="35" cy="21" r="0.8" fill="#FCD34D" />
                        </svg>

                        <!-- Label -->
                        <span
                          :class="[
                            'relative z-10 text-sm font-semibold capitalize transition-colors',
                            currentTheme === theme
                              ? 'text-blue-700 dark:text-blue-400'
                              : 'text-gray-600 dark:text-gray-400'
                          ]"
                        >
                          {{ theme }}
                        </span>

                        <!-- Active indicator -->
                        <div
                          v-if="currentTheme === theme"
                          class="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500"
                        ></div>
                      </button>
                    </div>
                    <!-- <div class="flex gap-3">
                      <button
                        v-for="theme in ['light', 'dark', 'system']"
                        :key="theme"
                        :class="[
                          'flex flex-1 px-4 py-3 gap-4 item-center rounded-lg border-2 transition-all capitalize select-none',
                          currentTheme === theme
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
                    </div> -->
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
                      :disabled="true"
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
                      :disabled="true"
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Role
                    </label>
                    <input
                      type="text"
                      class="w-full capitalize px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg outline-0 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., User"
                      :value="currentUser?.role || ''"
                      readonly
                      :disabled="true"
                    />
                  </div>
                  <div v-if="currentUser?.position">
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Position
                    </label>
                    <input
                      type="text"
                      class="w-full capitalize px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg outline-0 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Pharmacist"
                      :value="currentUser?.position || ''"
                      readonly
                      :disabled="true"
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
                      v-model="settings.facility_name"
                      type="text"
                      class="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg outline-0 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter facility name"
                      readonly
                      :disabled="true"
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Facility Contact
                    </label>
                    <input
                      v-model="settings.facility_contact"
                      type="text"
                      class="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg outline-0 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter facility phone number"
                      readonly
                      :disabled="true"
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Facility Address
                    </label>
                    <textarea
                      v-model="settings.facility_address"
                      rows="3"
                      class="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg outline-0 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter facility address"
                      readonly
                      :disabled="true"
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

                  <div class="space-y-6">
                    <div class="flex items-center justify-between">
                      <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Clear Queue on Label Print
                        </label>
                        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Clear label from queue when the label is printed
                        </p>
                      </div>
                      <button
                        :class="[
                          'relative inline-flex h-6 w-11 items-center rounded-full transition-colors select-none',
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
                        'relative inline-flex h-6 w-11 items-center rounded-full transition-colors select-none',
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

                <div class="h-90 space-y-6 overflow-auto pr-4 pl-1 pb-12 custom-scrollbar">
                  <!-- Change Password Section -->
                  <div
                    class="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700"
                  >
                    <h4 class="text-base font-semibold text-gray-900 dark:text-white mb-4">
                      Change Password
                    </h4>

                    <form @submit.prevent="handleChangePassword" class="space-y-4">
                      <!-- Current Password -->
                      <div>
                        <label
                          class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                        >
                          Current Password
                        </label>
                        <div class="relative">
                          <input
                            v-model="passwordForm.currentPassword"
                            :type="showCurrentPassword ? 'text' : 'password'"
                            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg outline-0 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter current password"
                            required
                          />
                          <button
                            type="button"
                            class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            @click="showCurrentPassword = !showCurrentPassword"
                          >
                            <svg
                              v-if="!showCurrentPassword"
                              class="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              />
                            </svg>
                            <svg
                              v-else
                              class="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>

                      <!-- New Password -->
                      <div>
                        <label
                          class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                        >
                          New Password
                        </label>
                        <div class="relative">
                          <input
                            v-model="passwordForm.newPassword"
                            :type="showNewPassword ? 'text' : 'password'"
                            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg outline-0 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter new password"
                            required
                            minlength="8"
                          />
                          <button
                            type="button"
                            class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            @click="showNewPassword = !showNewPassword"
                          >
                            <svg
                              v-if="!showNewPassword"
                              class="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              />
                            </svg>
                            <svg
                              v-else
                              class="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                              />
                            </svg>
                          </button>
                        </div>
                        <!-- Password strength indicator -->
                        <div class="mt-2">
                          <div class="flex gap-1">
                            <div
                              v-for="i in 4"
                              :key="i"
                              class="h-1 flex-1 rounded-full transition-colors"
                              :class="
                                i <= passwordStrength
                                  ? getStrengthColor(passwordStrength)
                                  : 'bg-gray-200 dark:bg-gray-600'
                              "
                            ></div>
                          </div>
                          <p class="text-xs mt-1" :class="getStrengthTextColor(passwordStrength)">
                            {{ getStrengthLabel(passwordStrength) }}
                          </p>
                        </div>
                      </div>

                      <!-- Confirm New Password -->
                      <div>
                        <label
                          class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                        >
                          Confirm New Password
                        </label>
                        <div class="relative">
                          <input
                            v-model="passwordForm.confirmPassword"
                            :type="showConfirmPassword ? 'text' : 'password'"
                            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg outline-0 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Confirm new password"
                            required
                          />
                          <button
                            type="button"
                            class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            @click="showConfirmPassword = !showConfirmPassword"
                          >
                            <svg
                              v-if="!showConfirmPassword"
                              class="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              />
                            </svg>
                            <svg
                              v-else
                              class="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                              />
                            </svg>
                          </button>
                        </div>
                        <p
                          v-if="
                            passwordForm.newPassword &&
                            passwordForm.confirmPassword &&
                            !passwordsMatch
                          "
                          class="text-xs text-red-600 dark:text-red-400 mt-1"
                        >
                          Passwords do not match
                        </p>
                      </div>

                      <!-- Error/Success Messages -->
                      <div
                        v-if="passwordChangeError"
                        class="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
                      >
                        <p class="text-sm text-red-600 dark:text-red-400">
                          {{ passwordChangeError }}
                        </p>
                      </div>

                      <div
                        v-if="passwordChangeSuccess"
                        class="p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
                      >
                        <p class="text-sm text-green-600 dark:text-green-400">
                          {{ passwordChangeSuccess }}
                        </p>
                      </div>

                      <!-- Action Buttons -->
                      <div class="flex gap-3 pt-2">
                        <button
                          type="submit"
                          :disabled="!isPasswordFormValid || isChangingPassword"
                          class="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors disabled:cursor-not-allowed"
                        >
                          {{ isChangingPassword ? 'Changing...' : 'Change Password' }}
                        </button>
                        <button
                          type="button"
                          class="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-colors"
                          @click="resetPasswordForm"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>

              <!-- Help Tab -->
              <div v-if="activeTab === 'help'">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Help & Support
                </h3>

                <div class="h-90 space-y-6 overflow-auto pr-4 pl-1 pb-12 custom-scrollbar">
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
                          Facility information is tied to your license and cannot be changed
                          directly. Please contact support for assistance.
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
                      class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors select-none"
                    >
                      Contact Support
                    </button>
                  </div>
                </div>
              </div>

              <!-- Shortcuts Tab -->
              <div v-if="activeTab === 'shortcuts'">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Shortcuts</h3>

                <div class="h-90 space-y-6 overflow-auto pr-4 pl-1 pb-12 custom-scrollbar">
                  <ShortcutSection title="Global Shortcuts" :shortcuts="globalShortcuts" />

                  <ShortcutSection title="Medication Label Page" :shortcuts="labelPageShortcuts" />

                  <ShortcutSection
                    title="Medication Label Queue Page"
                    :shortcuts="queuePageShortcuts"
                  />
                  <ShortcutSection title="Clients Page" :shortcuts="clientPageShortcuts" />
                  <ShortcutSection title="Users Page" :shortcuts="userPageShortcuts" />
                </div>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div
            class="absolute bottom-0 left-0 right-0 flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50"
          >
            <button
              class="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg font-medium transition-colors select-none"
              @click="closeModal"
            >
              Cancel
            </button>
            <button
              class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors select-none"
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
import { ref, reactive, computed, watch, nextTick, onUnmounted, toRaw, onMounted } from 'vue'
import { useSettings } from '../composables/useSettings'
import ShortcutSection from '../components/ShortcutSection.vue'

const { settings, dateTimeOptions, currentUser, currentTheme, refreshSettingsAndUser, applyTheme } =
  useSettings(true)

/* ---------------- props / emits ---------------- */

const props = defineProps({
  show: { type: Boolean, default: false },
  initialSettings: { type: Object, default: () => ({}) }
})

const emit = defineEmits(['close', 'save'])

/* ---------------- focus refs ---------------- */

const modalRef = ref(null)
const closeBtn = ref(null)
let lastFocused = null

/* ---------------- state ---------------- */

const activeTab = ref('appearance')

const tabs = [
  { id: 'appearance', label: 'Appearance', icon: 'palette' },
  { id: 'user', label: 'User Profile', icon: 'user' },
  { id: 'label', label: 'Label Settings', icon: 'tag' },
  { id: 'notifications', label: 'Notifications', icon: 'bell' },
  { id: 'privacy', label: 'Privacy', icon: 'shield' },
  { id: 'shortcuts', label: 'Shortcuts', icon: 'shortcuts' },
  { id: 'help', label: 'Help', icon: 'help' }
]

const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const showCurrentPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)
const isChangingPassword = ref(false)
const passwordChangeError = ref('')
const passwordChangeSuccess = ref('')

/* ---------------- computed properties ---------------- */

const passwordStrength = computed(() => {
  const password = passwordForm.newPassword
  if (!password) return 0

  let strength = 0

  // Length check
  if (password.length >= 8) strength++
  if (password.length >= 12) strength++

  // Complexity checks
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++
  if (/\d/.test(password)) strength++
  if (/[^a-zA-Z0-9]/.test(password)) strength++

  return Math.min(strength, 4)
})

const passwordsMatch = computed(() => {
  return passwordForm.newPassword === passwordForm.confirmPassword
})

const isPasswordFormValid = computed(() => {
  return (
    passwordForm.currentPassword && passwordForm.newPassword.length >= 8 && passwordsMatch.value
  )
})

/* ---------------- focus trap ---------------- */

function handleKeydown(e) {
  if (!props.show || !modalRef.value) return

  if (e.key === 'Escape') {
    e.preventDefault()
    closeModal()
    return
  }

  if (e.key !== 'Tab') return

  const focusables = modalRef.value.querySelectorAll(
    'button:not([disabled]), input, textarea, select, a[href], [tabindex]:not([tabindex="-1"])'
  )

  if (!focusables.length) return

  const first = focusables[0]
  const last = focusables[focusables.length - 1]

  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault()
    last.focus()
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault()
    first.focus()
  }
}

const globalShortcuts = computed(() => {
  let globs = [
    { keys: ['Esc'], action: 'Close active modals' },
    { keys: ['Ctrl', ','], action: 'Open settings' },
    { keys: ['Ctrl', 'J'], action: 'Navigate to Queue page' },
    { keys: ['Ctrl', 'D'], action: 'Navigate to Clients page' },
    { keys: ['Ctrl', 'B'], action: 'Navigate to Labels page' },
    { keys: ['Ctrl', 'L'], action: 'Logout' }
  ]
  if (['manager', 'admin'].includes(currentUser.value?.role)) {
    globs.push({ keys: ['Ctrl', 'U'], action: 'Navigate to Users page' })
  }
  if (currentUser.value?.role === 'admin') {
    globs.push({ keys: ['Ctrl', 'Shift', 'A'], action: 'Open Admin Console' })
  }
  return globs
})

const labelPageShortcuts = [
  { keys: ['Ctrl', 'K'], action: 'Focus label search input' },
  { keys: ['Ctrl', 'O'], action: 'Focus client name input' },
  { keys: ['Ctrl', 'N'], action: 'Add new label(s)' }
]

const queuePageShortcuts = [
  { keys: ['Ctrl', 'P'], action: 'Print entire queue' },
  { keys: ['Ctrl', 'I'], action: 'Clear queue' }
]

const clientPageShortcuts = [
  { keys: ['Ctrl', 'K'], action: 'Focus client details search field' },
  { keys: ['Ctrl', 'N'], action: 'Add new client' },
  { keys: ['Ctrl', '⬅'], action: 'View previous clients page in the list' },
  { keys: ['Ctrl', '➡'], action: 'View next clients page in the list' }
]

const userPageShortcuts = [
  { keys: ['Ctrl', 'K'], action: 'Focus user details search field' },
  { keys: ['Ctrl', 'N'], action: 'Add new user' },
  { keys: ['Ctrl', '⬅'], action: 'View previous users page in the list' },
  { keys: ['Ctrl', '➡'], action: 'View next users page in the list' }
]

// ---------------------------------------------------------

// Methods
const getStrengthColor = (strength) => {
  const colors = ['', 'bg-red-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500']
  return colors[strength] || ''
}

const getStrengthTextColor = (strength) => {
  const colors = [
    '',
    'text-red-600 dark:text-red-400',
    'text-yellow-600 dark:text-yellow-400',
    'text-blue-600 dark:text-blue-400',
    'text-green-600 dark:text-green-400'
  ]
  return colors[strength] || ''
}

const getStrengthLabel = (strength) => {
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong']
  return labels[strength] || ''
}

const handleChangePassword = async () => {
  passwordChangeError.value = ''
  passwordChangeSuccess.value = ''
  isChangingPassword.value = true

  try {
    const result = await window.api.changeUserPassword({
      currentPassword: passwordForm.currentPassword,
      newPassword: passwordForm.newPassword
    })

    console.log(result)

    if (result.success) {
      passwordChangeSuccess.value = 'Password changed successfully!'
      resetPasswordForm()

      // Clear success message after 3 seconds
      setTimeout(() => {
        passwordChangeSuccess.value = ''
      }, 3000)
    } else {
      passwordChangeError.value = result.error || 'Failed to change password'
    }
  } catch (error) {
    passwordChangeError.value = 'An error occurred. Please try again.'
    console.error('Password change error:', error)
  } finally {
    isChangingPassword.value = false
  }
}

const resetPasswordForm = () => {
  passwordForm.currentPassword = ''
  passwordForm.newPassword = ''
  passwordForm.confirmPassword = ''
  showCurrentPassword.value = false
  showNewPassword.value = false
  showConfirmPassword.value = false
  passwordChangeError.value = ''
}
/* ---------------- lifecycle ---------------- */

watch(
  () => props.show,
  async (open) => {
    if (open) {
      lastFocused = document.activeElement
      await nextTick()
      closeBtn.value?.focus()
      window.addEventListener('keydown', handleKeydown)
    } else {
      window.removeEventListener('keydown', handleKeydown)
      lastFocused?.focus()
    }
  }
)

watch(
  () => passwordForm.currentPassword,
  () => {
    passwordChangeError.value = ''
  }
)

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
  applyTheme(currentTheme.value)
})

/* ---------------- actions ---------------- */

const saveSettings = async () => {
  await window.api.saveSettings(toRaw({ ...settings.value }))
  closeModal()
}

const closeModal = () => {
  emit('close')
}

/* ---------------- mount ---------------- */

onMounted(async () => {
  await refreshSettingsAndUser()
  console.log(currentTheme.value)
  if (currentTheme.value) applyTheme(currentTheme.value)
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
