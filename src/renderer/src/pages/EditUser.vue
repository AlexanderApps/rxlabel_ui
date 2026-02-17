<template>
  <Transition
    enter-active-class="transition-opacity duration-200"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition-opacity duration-150"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="open"
      class="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-4 overflow-hidden"
      @click.self="$emit('close')"
      @wheel.prevent.stop
      @touchmove.prevent.stop
      @scroll.prevent.stop
    >
      <Transition
        enter-active-class="transition-all duration-200"
        enter-from-class="opacity-0 scale-95"
        enter-to-class="opacity-100 scale-100"
        leave-active-class="transition-all duration-150"
        leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-95"
      >
        <div
          v-if="open"
          class="bg-white dark:bg-gray-800 w-full max-w-4xl rounded-2xl shadow-2xl grid grid-rows-[auto_1fr_auto] h-[90vh] max-h-150 sm:max-h-175 lg:max-h-[85vh]"
          @wheel.stop
          @touchmove.stop
        >
          <!-- Header -->
          <div
            class="flex items-center justify-between px-6 py-5 border-b border-gray-200 dark:border-gray-700"
          >
            <div>
              <div class="flex gap-x-2 items-center">
                <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Edit User</h2>
                <div>
                  <Badge mode="info">User ID {{ props.id }}</Badge>
                </div>
              </div>
              <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Edit user details</p>
            </div>
            <button
              class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-500 dark:text-gray-400"
              @click="$emit('close')"
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
          <div class="overflow-hidden min-h-0">
            <div class="h-full overflow-y-auto custom-scrollbar">
              <div class="px-6 py-5 space-y-6">
                <!-- User Information Section -->
                <div
                  class="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-5 border-2 border-gray-200 dark:border-gray-700"
                >
                  <h3
                    class="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-4"
                  >
                    User Information
                  </h3>

                  <div class="space-y-4">
                    <!-- ID Field -->
                    <!-- <div>
                      <label
                        class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      >
                        User ID <span class="text-red-500">*</span>
                      </label>
                      <input
                        :value="props.id"
                        type="text"
                        placeholder="Enter user name"
                        class="w-full px-4 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg outline-0 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        readonly
                        :disabled="true"
                      />
                    </div> -->
                    <!-- Name Field -->
                    <div>
                      <label
                        class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      >
                        Name <span class="text-red-500">*</span>
                      </label>
                      <input
                        v-model="userData.name"
                        type="text"
                        placeholder="Enter user name"
                        class="w-full px-4 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg outline-0 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <!-- Contact Field -->
                    <!-- <div>
                      <label
                        class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      >
                        Contact <span class="text-red-500">*</span>
                      </label>
                      <input
                        v-model="userData.contact"
                        type="text"
                        placeholder="Enter contact number"
                        class="w-full px-4 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg outline-0 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div> -->

                    <!-- Email Field -->
                    <div>
                      <label
                        class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      >
                        Email <span class="text-red-500">*</span>
                      </label>
                      <input
                        v-model="userData.email"
                        type="email"
                        placeholder="Enter email address"
                        class="w-full px-4 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg outline-0 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <!-- Password Field -->
                    <!-- <div>
                      <label
                        for="password"
                        class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      >
                        Password <span class="text-red-500">*</span>
                      </label>

                      <div class="relative">
                        <input
                          id="password"
                          v-model="userData.password"
                          :type="showPassword ? 'text' : 'password'"
                          placeholder="Enter your password"
                          class="w-full px-4 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg outline-0 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                          @input="userData.password = $event.target.value"
                          @keypress="handleKeyPress"
                        />

                        <button
                          type="button"
                          class="absolute right-3 top-1/2 -translate-y-1/2 dark:text-gray-400 dark:hover:text-gray-300 text-gray-500 hover:text-gray-700"
                          @click="showPassword = !showPassword"
                        >
                          <svg
                            v-if="showPassword"
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
                            <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path>
                            <path
                              d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"
                            ></path>
                            <path
                              d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"
                            ></path>
                            <line x1="2" x2="22" y1="2" y2="22"></line>
                          </svg>
                          <svg
                            v-else
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
                            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                          </svg>


                        </button>
                      </div>
                    </div> -->

                    <!-- Role Field -->
                    <div>
                      <label
                        class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      >
                        Role
                      </label>
                      <select
                        v-model="userData.role"
                        class="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg outline-0 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option v-if="currentUser?.role === 'admin'" value="admin">Admin</option>
                        <option value="manager">Manager</option>
                        <option value="user">User</option>
                      </select>
                    </div>

                    <!-- Position Field -->
                    <div>
                      <label
                        class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      >
                        Position
                      </label>
                      <input
                        v-model="userData.position"
                        type="text"
                        placeholder="Enter position"
                        class="w-full px-4 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg outline-0 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div
            class="flex items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 rounded-b-2xl"
          >
            <div class="text-sm text-gray-500 dark:text-gray-400">
              <span v-if="!isFormValid" class="text-red-500">
                Please fill in all required fields
              </span>
            </div>

            <div class="flex gap-3">
              <button
                class="px-4 py-2 text-sm font-medium border-2 border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
                @click="handleClose"
              >
                Cancel
              </button>

              <button
                :disabled="!isFormValid"
                class="px-5 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-500/30 disabled:shadow-none"
                @click="confirmAdd"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useSettings } from '../composables/useSettings.js'
import Badge from '../components/Badge.vue'

const props = defineProps({
  open: { type: Boolean, default: false },
  id: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  role: { type: String, required: true },
  position: { type: String }
})

const emits = defineEmits(['close', 'confirm'])

const { currentUser } = useSettings()

// form state
const userData = ref({
  name: '',
  email: '',
  role: 'user',
  position: ''
})

// populate form when modal opens (EDIT MODE)
watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      userData.value = {
        name: props.name,
        email: props.email,
        role: props.role,
        position: props.position ?? ''
      }
    }
  }
)

const isFormValid = computed(() => {
  return userData.value.name.trim() !== '' && userData.value.email.trim() !== ''
})

function resetForm() {
  userData.value = {
    name: '',
    email: '',
    role: 'user',
    position: ''
  }
}

function handleClose() {
  resetForm()
  emits('close')
}

async function confirmAdd() {
  if (!isFormValid.value) return

  const result = await window.api.updateUser(
    props.id,
    userData.value.name,
    userData.value.email,
    userData.value.role,
    userData.value.position
  )

  emits('confirm', result)
  resetForm()
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e0;
  border-radius: 4px;
}

.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background: #4a5568;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #a0aec0;
}

.dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #718096;
}
</style>
