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
            'inline-flex items-center justify-center w-16 h-16 rounded-full mb-4',
            isDark ? 'bg-blue-600' : 'bg-blue-500'
          ]"
        >
          <!-- <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <polyline points="6 9 6 2 18 2 18 9"></polyline>
            <path
              d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"
            ></path>
            <rect width="12" height="8" x="6" y="14"></rect>
          </svg> -->

          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
            <!-- Gradient definitions -->
            <defs>
              <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color: #2563eb; stop-opacity: 1" />
                <stop offset="100%" style="stop-color: #1d4ed8; stop-opacity: 1" />
              </linearGradient>
              <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color: #10b981; stop-opacity: 1" />
                <stop offset="100%" style="stop-color: #059669; stop-opacity: 1" />
              </linearGradient>
            </defs>

            <!-- Rounded square background -->
            <rect width="200" height="200" rx="40" fill="url(#bgGradient)" />

            <!-- White Rx symbol -->
            <text
              x="100"
              y="135"
              font-family="Georgia, serif"
              font-size="110"
              font-weight="bold"
              fill="white"
              text-anchor="middle"
              font-style="italic"
            >
              Rx
            </text>

            <!-- Medical cross accent in top right -->
            <g transform="translate(145, 45)">
              <rect x="-2" y="0" width="4" height="20" fill="url(#accentGrad)" rx="2" />
              <rect x="-10" y="8" width="20" height="4" fill="url(#accentGrad)" rx="2" />
            </g>

            <!-- Small label tag icon in bottom right corner -->
            <g transform="translate(150, 155)">
              <path d="M 0,0 L 20,0 L 25,5 L 25,15 L 0,15 Z" fill="white" opacity="0.9" />
              <circle cx="6" cy="7.5" r="2" fill="url(#bgGradient)" />
              <line
                x1="11"
                y1="5"
                x2="20"
                y2="5"
                stroke="url(#bgGradient)"
                stroke-width="1.5"
                stroke-linecap="round"
              />
              <line
                x1="11"
                y1="10"
                x2="20"
                y2="10"
                stroke="url(#bgGradient)"
                stroke-width="1.5"
                stroke-linecap="round"
              />
            </g>
          </svg>
        </div>

        <div class="flex items-center justify-center">
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

        <!-- <h1 :class="['text-2xl font-bold mb-2', isDark ? 'text-white' : 'text-gray-900']">
          Printer Management
        </h1> -->

        <p :class="['text-sm', isDark ? 'text-gray-400' : 'text-gray-600']">
          Sign in to your account
        </p>
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
            type="text"
            :value="username"
            placeholder="Enter your username"
            :class="[
              'w-full px-4 py-3 rounded-lg border transition-colors focus:outline-none focus:ring-2',
              isDark
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500'
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500'
            ]"
            required
            @input="username = $event.target.value"
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
                isDark
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500'
              ]"
              required
              @input="password = $event.target.value"
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

              <!-- <component :is="showPassword ? EyeOff : Eye" :size="20" /> -->
            </button>
          </div>
        </div>

        <!-- Remember Me & Forgot Password -->
        <div class="flex items-center justify-between">
          <label class="flex items-center">
            <input
              type="checkbox"
              class="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span :class="['ml-2 text-sm', isDark ? 'text-gray-300' : 'text-gray-700']">
              Remember me
            </span>
          </label>

          <button
            :class="[
              'text-sm font-medium',
              isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'
            ]"
            @click="console.log('Forgot password clicked')"
          >
            Forgot password?
          </button>
        </div>

        <!-- Submit Button -->
        <button
          class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          :disabled="isLoading"
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

          <span>{{ isLoading ? 'Signing In...' : 'Sign In' }}</span>
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
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const username = ref('')
const password = ref('')
const showPassword = ref(false)
const isDark = ref(false)
const isLoading = ref(false)

onMounted(() => {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  isDark.value = prefersDark
})

const delay = (ms) => new Promise((res) => setTimeout(res, ms))

const handleSubmit = async () => {
  isLoading.value = true
  try {
    await delay(1000)

    const response = await window.api.loginUser(username.value, password.value)

    if (response?.success) {
      router.replace({ name: 'MedicationLabel' })
    }
  } catch (error) {
    console.error('Sign in error:', error)
  } finally {
    isLoading.value = false
  }
}

const handleKeyPress = (e) => {
  if (e.key === 'Enter') handleSubmit()
}
</script>
