<template>
  <div
    class="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white p-4 sm:p-8 relative overflow-hidden"
  >
    <!-- Animated background -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        class="absolute top-[20%] left-[10%] w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl"
      ></div>
      <div
        class="absolute bottom-[20%] right-[10%] w-96 h-96 bg-purple-600/10 rounded-full blur-3xl"
      ></div>
    </div>

    <div class="relative z-10 max-w-4xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-12 animate-fade-in-down">
        <div
          class="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/50"
        >
          <span class="text-3xl font-bold">S</span>
        </div>
        <h1
          class="text-4xl sm:text-5xl font-bold mb-3 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent font-syne"
        >
          Setup Wizard
        </h1>
        <p class="text-gray-400 text-lg">Let's get your system configured in just a few steps</p>
      </div>

      <!-- Progress Steps -->
      <div class="mb-12 animate-fade-in" style="animation-delay: 0.2s">
        <div class="relative">
          <!-- Progress Line -->
          <div class="absolute top-5 left-0 right-0 h-0.5 bg-slate-800">
            <div
              class="h-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-500 shadow-lg shadow-indigo-500/50"
              :style="{ width: progressWidth }"
            ></div>
          </div>

          <!-- Steps -->
          <div class="relative flex justify-between">
            <div
              v-for="step in steps"
              :key="step.number"
              class="flex flex-col items-center cursor-pointer transition-all duration-300"
              :class="{ 'scale-110': currentStep === step.number }"
              @click="goToStep(step.number)"
            >
              <div
                class="w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm mb-3 transition-all duration-300 border-2"
                :class="getStepClass(step.number)"
              >
                <svg
                  v-if="step.number < currentStep"
                  class="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="3"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span v-else>{{ step.number }}</span>
              </div>
              <div
                class="text-xs sm:text-sm text-center max-w-24 transition-all duration-300"
                :class="currentStep === step.number ? 'text-white font-semibold' : 'text-gray-500'"
              >
                {{ step.label }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Setup Card -->
      <div
        class="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl animate-fade-in-up"
        style="animation-delay: 0.3s"
      >
        <!-- View 1: License & Manager -->
        <transition name="fade" mode="out-in">
          <div v-if="currentStep === 1" key="step1">
            <h2 class="text-3xl font-bold mb-2">License & Manager Account</h2>
            <p class="text-gray-400 mb-8">
              Enter your software license and create the primary manager account
            </p>

            <form @submit.prevent="validateStep1" class="space-y-6">
              <!-- License -->
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">
                  Software License <span class="text-red-500">*</span>
                </label>
                <div class="flex gap-3">
                  <div class="flex-1">
                    <textarea
                      v-model="formData.license"
                      rows="4"
                      placeholder="Paste your license key here..."
                      class="w-full px-4 py-3 bg-slate-800 border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all resize-none font-mono text-sm"
                      :class="licenseValidationClass"
                      required
                      @input="resetLicenseValidation"
                    ></textarea>
                  </div>
                  <div class="flex flex-col gap-2">
                    <button
                      type="button"
                      @click="pasteFromClipboard"
                      class="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition-all flex items-center gap-2 whitespace-nowrap"
                      title="Paste from clipboard"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        />
                      </svg>
                      <span class="hidden sm:inline">Paste</span>
                    </button>
                    <button
                      type="button"
                      @click="verifyLicense"
                      :disabled="!formData.license || isVerifying"
                      class="px-4 py-2 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      :class="verifyButtonClass"
                    >
                      <svg
                        v-if="isVerifying"
                        class="w-5 h-5 animate-spin"
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
                      <svg
                        v-else-if="licenseStatus === 'valid'"
                        class="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <svg
                        v-else-if="licenseStatus === 'invalid'"
                        class="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M6 18L18 6M6 6l12 12"
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
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span class="hidden sm:inline">
                        {{
                          isVerifying
                            ? 'Verifying...'
                            : licenseStatus === 'valid'
                              ? 'Valid'
                              : licenseStatus === 'invalid'
                                ? 'Invalid'
                                : 'Verify'
                        }}
                      </span>
                    </button>
                  </div>
                </div>
                <div class="flex items-start gap-2 mt-2 text-xs" :class="licenseMessageClass">
                  <svg
                    class="w-4 h-4 flex-shrink-0 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      v-if="licenseStatus === 'valid'"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                    <path
                      v-else-if="licenseStatus === 'invalid'"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                    <path
                      v-else
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>{{ licenseMessage }}</span>
                </div>
              </div>

              <!-- Name -->
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">
                  Name <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="formData.name"
                  type="text"
                  placeholder="John"
                  class="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  required
                />
              </div>

              <!-- Email & Position -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">
                    Email Address <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="formData.email"
                    type="email"
                    placeholder="john@example.com"
                    class="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    required
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">
                    Position <span class="text-red-500">*</span>
                  </label>
                  <select
                    v-model="formData.position"
                    class="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all appearance-none cursor-pointer"
                    required
                  >
                    <option value="">Select position</option>
                    <option value="manager">Manager</option>
                    <option value="supervisor">Supervisor</option>
                    <option value="administrator">Administrator</option>
                    <option value="director">Director</option>
                  </select>
                </div>
              </div>

              <!-- Password & Confirm -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">
                    Password <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="formData.password"
                    type="password"
                    placeholder="Enter password"
                    class="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    required
                    minlength="8"
                    @input="checkPasswordStrength"
                  />
                  <!-- Password Strength -->
                  <div v-if="formData.password" class="mt-3">
                    <div class="flex gap-2 mb-2">
                      <div
                        v-for="i in 4"
                        :key="i"
                        class="h-1 flex-1 rounded-full transition-all duration-300"
                        :class="getPasswordStrengthBarClass(i)"
                      ></div>
                    </div>
                    <div class="text-xs text-gray-400">
                      Password strength:
                      <span :class="passwordStrengthColor">{{ passwordStrengthText }}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">
                    Confirm Password <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="formData.confirmPassword"
                    type="password"
                    placeholder="Confirm password"
                    class="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
              </div>

              <!-- Navigation Buttons -->
              <div class="flex justify-between pt-6 border-t border-slate-800">
                <button
                  type="button"
                  class="px-6 py-3 border-2 border-slate-700 text-gray-400 rounded-xl font-medium transition-all opacity-50 cursor-not-allowed"
                  disabled
                >
                  <div class="flex items-center gap-2">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                    Previous
                  </div>
                </button>

                <button
                  type="submit"
                  class="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-indigo-500/50 transition-all hover:-translate-y-0.5"
                >
                  <div class="flex items-center gap-2">
                    Next Step
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </button>
              </div>
            </form>
          </div>

          <!-- View 2: Facility Information -->
          <div v-else-if="currentStep === 2" key="step2">
            <h2 class="text-3xl font-bold mb-2">Facility Information</h2>
            <p class="text-gray-400 mb-8">Review your facility details linked to this license</p>

            <!-- Loading State -->
            <div v-if="isLoadingFacility" class="py-12 text-center">
              <div class="inline-flex items-center gap-3 text-gray-400">
                <svg class="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24">
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
                <span>Loading facility information...</span>
              </div>
            </div>

            <!-- Error State -->
            <div v-else-if="facilityLoadError" class="py-8">
              <div class="bg-red-500/10 border border-red-500/30 rounded-xl p-6 text-center">
                <svg
                  class="w-12 h-12 text-red-500 mx-auto mb-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p class="text-red-400 mb-4">{{ facilityLoadError }}</p>
                <button
                  type="button"
                  @click="loadFacilityData(formData.license)"
                  class="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-all"
                >
                  Retry
                </button>
              </div>
            </div>

            <!-- Facility Data Display -->
            <div v-else class="space-y-6">
              <!-- Info Banner -->
              <div class="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                <div class="flex items-start gap-3">
                  <svg
                    class="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div class="flex-1">
                    <p class="text-sm text-blue-300">
                      These details are linked to your license and cannot be modified. Please review
                      them carefully.
                    </p>
                    <p class="text-xs text-blue-400 mt-2">
                      <strong>Note:</strong> If any information appears incorrect, please contact
                      your system administrator or developer for assistance.
                    </p>
                  </div>
                </div>
              </div>

              <!-- Facility Name -->
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2"> Facility Name </label>
                <div class="relative">
                  <input
                    v-model="formData.facilityName"
                    type="text"
                    class="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-gray-300 cursor-not-allowed"
                    readonly
                  />
                  <div class="absolute right-3 top-1/2 -translate-y-1/2">
                    <svg
                      class="w-5 h-5 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <!-- Facility Contact -->
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">
                  Facility Contact
                </label>
                <div class="relative">
                  <input
                    v-model="formData.facilityContact"
                    type="text"
                    class="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-gray-300 cursor-not-allowed"
                    readonly
                  />
                  <div class="absolute right-3 top-1/2 -translate-y-1/2">
                    <svg
                      class="w-5 h-5 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <!-- Facility Address -->
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">
                  Facility Address
                </label>
                <div class="relative">
                  <textarea
                    v-model="formData.facilityAddress"
                    rows="4"
                    class="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-gray-300 resize-none cursor-not-allowed"
                    readonly
                  ></textarea>
                  <div class="absolute right-3 top-3">
                    <svg
                      class="w-5 h-5 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <!-- Navigation Buttons -->
              <div class="flex justify-between pt-6 border-t border-slate-800">
                <button
                  type="button"
                  @click="previousStep"
                  class="px-6 py-3 border-2 border-slate-700 text-gray-300 rounded-xl font-medium hover:bg-slate-800 transition-all"
                >
                  <div class="flex items-center gap-2">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                    Previous
                  </div>
                </button>

                <button
                  type="button"
                  @click="nextStep"
                  class="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-indigo-500/50 transition-all hover:-translate-y-0.5"
                >
                  <div class="flex items-center gap-2">
                    Next Step
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </button>
              </div>
            </div>
          </div>

          <!-- View 3: Defaults -->
          <div v-else-if="currentStep === 3" key="step3">
            <h2 class="text-3xl font-bold mb-2">System Defaults</h2>
            <p class="text-gray-400 mb-8">Configure default settings for your system</p>

            <form @submit.prevent="completeSetup" class="space-y-6">
              <!-- Alert Sound -->
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">
                  Alert Sound <span class="text-red-500">*</span>
                </label>
                <select
                  v-model="formData.alertSound"
                  class="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all appearance-none cursor-pointer"
                  required
                >
                  <option value="1">Yes</option>
                  <option value="0">No</option>
                </select>
                <div class="flex items-center gap-2 mt-2 text-xs text-gray-500">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                    />
                  </svg>
                  <span>Sound played for system alerts and notifications</span>
                </div>
              </div>

              <!-- Queue Size -->
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">
                  Queue Size <span class="text-red-500">*</span>
                </label>
                <select
                  v-model="formData.queueSize"
                  class="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all appearance-none cursor-pointer"
                  required
                >
                  <option value="10">10 items</option>
                  <option value="25">25 items</option>
                  <option value="50">50 items</option>
                  <option value="100">100 items</option>
                  <option value="200">200 items</option>
                </select>
                <div class="flex items-center gap-2 mt-2 text-xs text-gray-500">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M4 6h16M4 10h16M4 14h16M4 18h16"
                    />
                  </svg>
                  <span>Maximum number of items displayed in queues</span>
                </div>
              </div>

              <!-- Date Format -->
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">
                  Date Format <span class="text-red-500">*</span>
                </label>
                <select
                  v-model="formData.dateFormat"
                  class="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all appearance-none cursor-pointer"
                  required
                >
                  <option v-for="opt in dateTimeOptions" :key="opt.id" :value="opt.id">
                    {{ opt.label }} — ({{ opt.value }})
                  </option>
                </select>
                <!-- <select
                  v-model="formData.dateFormat"
                  class="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all appearance-none cursor-pointer"
                  required
                >
                  <option value="">Select date format</option>
                  <option value="MM/DD/YYYY">MM/DD/YYYY (12/31/2024)</option>
                  <option value="DD/MM/YYYY">DD/MM/YYYY (31/12/2024)</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD (2024-12-31)</option>
                  <option value="DD-MMM-YYYY">DD-MMM-YYYY (31-Dec-2024)</option>
                </select> -->
                <div class="flex items-center gap-2 mt-2 text-xs text-gray-500">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span>Date format used throughout the system</span>
                </div>
              </div>

              <!-- Navigation Buttons -->
              <div class="flex justify-between pt-6 border-t border-slate-800">
                <button
                  type="button"
                  @click="previousStep"
                  class="px-6 py-3 border-2 border-slate-700 text-gray-300 rounded-xl font-medium hover:bg-slate-800 transition-all"
                >
                  <div class="flex items-center gap-2">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                    Previous
                  </div>
                </button>

                <button
                  type="submit"
                  class="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-indigo-500/50 transition-all hover:-translate-y-0.5"
                >
                  <div class="flex items-center gap-2">
                    Complete Setup
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                </button>
              </div>
            </form>
          </div>

          <!-- Success View -->
          <div v-else-if="currentStep === 4" key="success" class="text-center py-8">
            <div
              class="w-20 h-20 mx-auto mb-6 bg-emerald-500 rounded-full flex items-center justify-center animate-scale-in"
            >
              <svg
                class="w-10 h-10 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="3"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            <h2 class="text-3xl font-bold mb-3">Setup Complete!</h2>
            <p class="text-gray-400 mb-8">
              Your system has been successfully configured and is ready to use.
            </p>

            <button
              @click="goToLogin"
              class="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-indigo-500/50 transition-all hover:-translate-y-0.5"
            >
              <div class="flex items-center gap-2">
                Go to Login
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </div>
            </button>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useSettings } from '../composables/useSettings'

const currentStep = ref(1)
const router = useRouter()
const { dateTimeOptions } = useSettings()

const steps = [
  { number: 1, label: 'License & Manager' },
  { number: 2, label: 'Facility Info' },
  { number: 3, label: 'Defaults' }
]

const formData = ref({
  // Step 1
  license: '',
  name: '',
  email: '',
  position: '',
  password: '',
  confirmPassword: '',
  // Step 2 - will be populated from backend
  facilityName: '',
  facilityContact: '',
  facilityAddress: '',
  // Step 3
  alertSound: '1',
  queueSize: '100',
  dateFormat: 'dt5'
})

const passwordStrength = ref(0)
const isVerifying = ref(false)
const licenseStatus = ref('') // 'valid', 'invalid', or ''
const isLoadingFacility = ref(false)
const facilityLoadError = ref('')

// Computed
const progressWidth = computed(() => {
  if (currentStep.value === 4) return '100%'
  return `${((currentStep.value - 1) / (steps.length - 1)) * 100}%`
})

const passwordStrengthText = computed(() => {
  const labels = ['Weak', 'Fair', 'Good', 'Strong']
  return labels[passwordStrength.value - 1] || 'Weak'
})

const passwordStrengthColor = computed(() => {
  if (passwordStrength.value <= 1) return 'text-red-500'
  if (passwordStrength.value === 2) return 'text-yellow-500'
  if (passwordStrength.value === 3) return 'text-blue-500'
  return 'text-emerald-500'
})

const licenseValidationClass = computed(() => {
  if (licenseStatus.value === 'valid') {
    return 'border-emerald-500 focus:ring-emerald-500'
  }
  if (licenseStatus.value === 'invalid') {
    return 'border-red-500 focus:ring-red-500'
  }
  return 'border-slate-700 focus:ring-indigo-500'
})

const verifyButtonClass = computed(() => {
  if (licenseStatus.value === 'valid') {
    return 'bg-emerald-500 hover:bg-emerald-600 text-white'
  }
  if (licenseStatus.value === 'invalid') {
    return 'bg-red-500 hover:bg-red-600 text-white'
  }
  return 'bg-indigo-600 hover:bg-indigo-700 text-white'
})

const licenseMessage = computed(() => {
  if (licenseStatus.value === 'valid') {
    return 'License verified successfully! This license is valid and active.'
  }
  if (licenseStatus.value === 'invalid') {
    return 'Invalid license key. Please check and try again.'
  }
  return 'Paste your license key and click Verify to validate'
})

const licenseMessageClass = computed(() => {
  if (licenseStatus.value === 'valid') return 'text-emerald-500'
  if (licenseStatus.value === 'invalid') return 'text-red-500'
  return 'text-gray-500'
})

// Methods
const getStepClass = (stepNumber) => {
  if (stepNumber < currentStep.value) {
    return 'bg-emerald-500 border-emerald-500 text-white'
  }
  if (stepNumber === currentStep.value) {
    return 'bg-gradient-to-br from-indigo-500 to-purple-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/50'
  }
  return 'bg-slate-800 border-slate-700 text-gray-500'
}

const getPasswordStrengthBarClass = (index) => {
  if (index <= passwordStrength.value) {
    if (passwordStrength.value <= 1) return 'bg-red-500'
    if (passwordStrength.value === 2) return 'bg-yellow-500'
    if (passwordStrength.value === 3) return 'bg-blue-500'
    return 'bg-emerald-500'
  }
  return 'bg-slate-700'
}

const pasteFromClipboard = async () => {
  try {
    const text = await navigator.clipboard.readText()
    formData.value.license = text.trim()
    resetLicenseValidation()
  } catch (err) {
    console.error('Failed to read clipboard:', err)
    alert('Failed to paste from clipboard. Please paste manually using Ctrl+V or Cmd+V')
  }
}

const resetLicenseValidation = () => {
  licenseStatus.value = ''
}

const verifyLicense = async () => {
  if (!formData.value.license) return

  isVerifying.value = true
  facilityLoadError.value = ''

  try {
    // Simulate API call to verify license
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Replace this with your actual license verification logic
    const licenseResponse = await window.api.verifyLicense(formData.value.license)
    const isValid = licenseResponse.valid

    if (isValid) {
      licenseStatus.value = 'valid'
      // Load facility data from backend when license is valid
      await loadFacilityData(formData.value.license)
    } else {
      licenseStatus.value = 'invalid'
      // Clear facility data if license is invalid
      clearFacilityData()
    }
  } catch (error) {
    console.error('License verification error:', error)
    licenseStatus.value = 'invalid'
    clearFacilityData()
  } finally {
    isVerifying.value = false
  }
}

const loadFacilityData = async (license) => {
  isLoadingFacility.value = true
  facilityLoadError.value = ''

  try {
    // Simulate API call to fetch facility data
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Replace this with your actual API call
    const facilityData = await fetchFacilityData(license)

    // Populate the form with facility data
    formData.value.facilityName = facilityData.name
    formData.value.facilityContact = facilityData.contact
    formData.value.facilityAddress = facilityData.address
  } catch (error) {
    console.error('Failed to load facility data:', error)
    facilityLoadError.value = 'Failed to load facility information. Please try again.'
  } finally {
    isLoadingFacility.value = false
  }
}

const fetchFacilityData = async (license) => {
  const licenseResponse = await window.api.verifyLicense(license)
  console.log(licenseResponse)

  // Mock facility data for demonstration
  return {
    name: licenseResponse.payload.facility_name,
    contact: licenseResponse.payload.facility_contact,
    address: licenseResponse.payload.facility_address
  }
}

const clearFacilityData = () => {
  formData.value.facilityName = ''
  formData.value.facilityContact = ''
  formData.value.facilityAddress = ''
}

// const checkLicenseValidity = async (license) => {
//   // Replace this with your actual API call
//   // Example: const response = await fetch('/api/verify-license', { ... })

//   // For demo purposes, we'll check if the license has minimum length
//   // In production, this should call your backend API
//   const trimmedLicense = license.trim()

//   // Simple validation: license should be at least 20 characters
//   // and contain some alphanumeric characters
//   if (trimmedLicense.length < 20) return false

//   // Check if contains alphanumeric characters
//   const hasAlphanumeric = /[a-zA-Z0-9]/.test(trimmedLicense)

//   // Simulate checking against database
//   // In real implementation: return await api.verifyLicense(license)
//   return hasAlphanumeric
// }

const checkPasswordStrength = () => {
  const password = formData.value.password
  let strength = 0

  if (password.length === 0) {
    passwordStrength.value = 0
    return
  }

  // Check length
  if (password.length >= 8) strength++
  if (password.length >= 12) strength++

  // Check for numbers
  if (/\d/.test(password)) strength++

  // Check for special characters
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++

  // Check for uppercase and lowercase
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++

  // Normalize to 1-4
  passwordStrength.value = Math.min(Math.ceil((strength * 4) / 5), 4)
}

const validateStep1 = () => {
  if (licenseStatus.value !== 'valid') {
    alert('Please verify your license before continuing!')
    return
  }

  if (formData.value.password !== formData.value.confirmPassword) {
    alert('Passwords do not match!')
    return
  }

  if (formData.value.password.length < 8) {
    alert('Password must be at least 8 characters long!')
    return
  }

  nextStep()
}

const nextStep = () => {
  if (currentStep.value < 4) {
    currentStep.value++
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const previousStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const goToStep = (stepNumber) => {
  if (stepNumber < currentStep.value) {
    currentStep.value = stepNumber
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const completeSetup = async () => {
  const setupData = {
    license: formData.value.license,
    manager: {
      name: formData.value.name,
      email: formData.value.email,
      position: formData.value.position,
      password: formData.value.password
    },
    facility: {
      name: formData.value.facilityName,
      contact: formData.value.facilityContact,
      address: formData.value.facilityAddress
    },
    defaults: {
      alert_sound: formData.value.alertSound,
      queue_size: formData.value.queueSize,
      date_format: formData.value.dateFormat
    }
  }

  console.log('Setup Data:', setupData)

  // Here you would typically send data to your backend
  await window.api.saveSetup(setupData)

  currentStep.value = 4
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const goToLogin = () => {
  // Navigate to dashboard
  console.log('Navigating to dashboard...')
  router.replace({ name: 'LoginPage' })
  // router.push('/dashboard')
}
</script>

<style scoped>
/* Animations */
@keyframes fade-in-down {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes scale-in {
  from {
    transform: scale(0);
  }
  to {
    transform: scale(1);
  }
}

.animate-fade-in-down {
  animation: fade-in-down 0.6s ease-out;
}

.animate-fade-in-up {
  animation: fade-in-up 0.6s ease-out;
  animation-fill-mode: both;
}

.animate-fade-in {
  animation: fade-in 0.6s ease-out;
  animation-fill-mode: both;
}

.animate-scale-in {
  animation: scale-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Custom select arrow styling */
select {
  background-image: url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%239ca3af' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  padding-right: 2.5rem;
}

.font-syne {
  font-family: 'Syne', sans-serif;
}
</style>
