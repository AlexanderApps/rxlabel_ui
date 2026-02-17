<template>
  <div
    :class="[
      'min-h-screen flex items-center justify-center transition-colors duration-300',
      isDark ? 'bg-gray-900' : 'bg-gray-100'
    ]"
  >
    <!-- Theme Toggle Button -->
    <button
      :class="[
        'absolute top-6 right-6 p-2 rounded-lg transition-colors',
        isDark
          ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700'
          : 'bg-white text-gray-700 hover:bg-gray-200'
      ]"
      @click="isDark = !isDark"
    >
      <svg
        v-if="isDark"
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
        <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
      </svg>
    </button>

    <!-- Login Card -->
    <div
      :class="[
        'w-full max-w-md mx-4 p-8 rounded-2xl shadow-2xl transition-colors duration-300',
        isDark ? 'bg-gray-800' : 'bg-white'
      ]"
    >
      <!-- Logo/Header -->
      <div class="text-center mb-8">
        <div
          :class="[
            'p-1 inline-flex items-center justify-center w-18 h-18 border border-gray-200 dark:border-gray-700 rounded-full shadow-2xl mb-2'
          ]"
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
        </div>

        <div class="flex items-center justify-center text-center">
          <svg class="w-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 120">
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

        <p :class="['text-sm', isDark ? 'text-gray-400' : 'text-gray-600']">
          Sign in to your account
        </p>
      </div>

      <!-- Error Alert -->
      <div
        v-if="errorMessage"
        :class="[
          'mb-6 p-4 rounded-lg border flex items-start gap-3 animate-shake',
          isDark
            ? 'bg-red-900/20 border-red-800 text-red-300'
            : 'bg-red-50 border-red-200 text-red-800'
        ]"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="flex-shrink-0 mt-0.5"
        >
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <div class="flex-1">
          <p class="font-medium text-sm">{{ errorMessage }}</p>
          <p v-if="loginAttempts >= 3" class="text-xs mt-1 opacity-90">
            After {{ maxAttempts }} failed attempts, please contact your administrator.
          </p>
        </div>
        <button
          @click="clearError"
          :class="[
            'flex-shrink-0 hover:opacity-70 transition-opacity',
            isDark ? 'text-red-300' : 'text-red-600'
          ]"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <!-- Login Form -->
      <div class="space-y-6">
        <!-- Username Field -->
        <div>
          <label
            for="username"
            :class="['block text-sm font-medium mb-2', isDark ? 'text-gray-300' : 'text-gray-700']"
          >
            Username
          </label>

          <input
            id="username"
            ref="focusUsernameInput"
            type="text"
            :value="username"
            placeholder="Enter your username"
            :class="[
              'w-full px-4 py-3 rounded-lg border transition-colors focus:outline-none focus:ring-2',
              hasError
                ? isDark
                  ? 'bg-gray-700 border-red-500 text-white placeholder-gray-400 focus:border-red-500 focus:ring-red-500'
                  : 'bg-white border-red-300 text-gray-900 placeholder-gray-400 focus:border-red-500 focus:ring-red-500'
                : isDark
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500'
            ]"
            required
            @input="handleUsernameInput"
            @keypress="handleKeyPress"
          />
        </div>

        <!-- Password Field -->
        <div>
          <label
            for="password"
            :class="['block text-sm font-medium mb-2', isDark ? 'text-gray-300' : 'text-gray-700']"
          >
            Password
          </label>

          <div class="relative">
            <input
              id="password"
              :type="showPassword ? 'text' : 'password'"
              :value="password"
              placeholder="Enter your password"
              :class="[
                'w-full px-4 py-3 rounded-lg border transition-colors focus:outline-none focus:ring-2',
                hasError
                  ? isDark
                    ? 'bg-gray-700 border-red-500 text-white placeholder-gray-400 focus:border-red-500 focus:ring-red-500'
                    : 'bg-white border-red-300 text-gray-900 placeholder-gray-400 focus:border-red-500 focus:ring-red-500'
                  : isDark
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500'
              ]"
              required
              @input="handlePasswordInput"
              @keypress="handleKeyPress"
            />

            <button
              type="button"
              :class="[
                'absolute right-3 top-1/2 -translate-y-1/2',
                isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
              ]"
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
        </div>

        <div class="h-0.5"></div>
        <!-- Submit Button -->
        <button
          class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          :disabled="isLoading || loginAttempts >= maxAttempts"
          @click="handleSubmit"
        >
          <!-- Spinner -->
          <svg
            v-if="isLoading"
            class="animate-spin h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            ></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>

          <span>
            {{
              loginAttempts >= maxAttempts
                ? 'Account Locked'
                : isLoading
                  ? 'Signing In...'
                  : 'Sign In'
            }}
          </span>
        </button>
      </div>

      <!-- Footer -->
      <div :class="['mt-6 text-center text-sm', isDark ? 'text-gray-400' : 'text-gray-600']">
        Don't have an account?
        <button
          :class="[
            'font-medium',
            isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'
          ]"
          @click="console.log('Contact administrator clicked')"
        >
          Contact administrator
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useSettings } from '../composables/useSettings'

const router = useRouter()
const username = ref('')
const password = ref('')
const showPassword = ref(false)
const isDark = ref(false)
const isLoading = ref(false)
const errorMessage = ref('')
const loginAttempts = ref(0)
const maxAttempts = 5
const { refreshSettingsAndUser } = useSettings()
const focusUsernameInput = ref(null)

const hasError = computed(() => !!errorMessage.value)

onMounted(() => {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  isDark.value = prefersDark
  focusUsernameInput.value?.focus()
})

const delay = (ms) => new Promise((res) => setTimeout(res, ms))

const clearError = () => {
  errorMessage.value = ''
}

const handleUsernameInput = (e) => {
  username.value = e.target.value
  if (hasError.value) {
    clearError()
  }
}

const handlePasswordInput = (e) => {
  password.value = e.target.value
  if (hasError.value) {
    clearError()
  }
}

const handleSubmit = async () => {
  // Clear any previous errors
  clearError()

  // Validate inputs
  if (!username.value.trim()) {
    errorMessage.value = 'Please enter your username'
    focusUsernameInput.value?.focus()
    return
  }

  if (!password.value) {
    errorMessage.value = 'Please enter your password'
    return
  }

  // Check if account is locked
  if (loginAttempts.value >= maxAttempts) {
    errorMessage.value = 'Account temporarily locked. Please contact your administrator.'
    return
  }

  isLoading.value = true

  try {
    await delay(1000)

    const response = await window.api.loginUser(username.value, password.value)

    if (response?.success) {
      // Reset attempts on successful login
      loginAttempts.value = 0
      errorMessage.value = ''

      setTimeout(async () => {
        await refreshSettingsAndUser()
        router.replace({ name: 'MedicationLabel' })
      }, 500)
    } else {
      // Handle login failure
      loginAttempts.value++

      // Customize error message based on response or attempt count
      if (response?.message) {
        errorMessage.value = response.message
      } else if (loginAttempts.value >= maxAttempts) {
        errorMessage.value = 'Too many failed attempts. Account temporarily locked.'
      } else if (loginAttempts.value >= 3) {
        errorMessage.value = `Invalid username or password. ${maxAttempts - loginAttempts.value} attempts remaining.`
      } else {
        errorMessage.value = 'Invalid username or password. Please try again.'
      }

      // Clear password field on failed attempt
      password.value = ''
    }
  } catch (error) {
    console.error('Sign in error:', error)
    loginAttempts.value++

    // Handle different error types
    if (error.message?.includes('network') || error.message?.includes('fetch')) {
      errorMessage.value = 'Connection error. Please check your network and try again.'
    } else if (loginAttempts.value >= maxAttempts) {
      errorMessage.value = 'Too many failed attempts. Please contact your administrator.'
    } else {
      errorMessage.value = 'An error occurred. Please try again.'
    }

    // Clear password field on error
    password.value = ''
  } finally {
    isLoading.value = false
  }
}

const handleKeyPress = (e) => {
  if (e.key === 'Enter') handleSubmit()
}
</script>

<style scoped>
@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  10%,
  30%,
  50%,
  70%,
  90% {
    transform: translateX(-4px);
  }
  20%,
  40%,
  60%,
  80% {
    transform: translateX(4px);
  }
}

.animate-shake {
  animation: shake 0.5s ease-in-out;
}
</style>
