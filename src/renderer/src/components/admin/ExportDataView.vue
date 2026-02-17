<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-4">
        <button
          @click="$emit('back')"
          class="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
        >
          <svg
            class="w-5 h-5 text-slate-600 dark:text-slate-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <div>
          <h2 class="text-2xl font-bold text-slate-800 dark:text-slate-100">Export Data</h2>
          <p class="text-sm text-slate-500 dark:text-slate-400">
            Download your database tables in various formats
          </p>
        </div>
      </div>
    </div>

    <!-- Step Indicator -->
    <div
      class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6"
    >
      <div class="flex items-center justify-between">
        <div
          v-for="(step, index) in steps"
          :key="step.id"
          class="flex items-center"
          :class="{ 'flex-1': index < steps.length - 1 }"
        >
          <div class="flex items-center">
            <div
              class="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all"
              :class="
                currentStep > step.id
                  ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white'
                  : currentStep === step.id
                    ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
              "
            >
              <svg
                v-if="currentStep > step.id"
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
              <span v-else>{{ step.id }}</span>
            </div>
            <div class="ml-3">
              <p
                class="text-sm font-semibold"
                :class="
                  currentStep >= step.id
                    ? 'text-slate-800 dark:text-slate-100'
                    : 'text-slate-500 dark:text-slate-400'
                "
              >
                {{ step.label }}
              </p>
            </div>
          </div>
          <div
            v-if="index < steps.length - 1"
            class="flex-1 h-0.5 mx-4"
            :class="
              currentStep > step.id
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600'
                : 'bg-slate-200 dark:bg-slate-700'
            "
          ></div>
        </div>
      </div>
    </div>

    <!-- Step 1: Select Table & Format -->
    <div v-if="currentStep === 1" class="space-y-6">
      <!-- Table Selection -->
      <div
        class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 space-y-4"
      >
        <div>
          <h3 class="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-1">
            Select Tables to Export
          </h3>
          <p class="text-sm text-slate-500 dark:text-slate-400">
            Choose one or more tables to include in your export
          </p>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button
            v-for="table in availableTables"
            :key="table.name"
            @click="toggleTableSelection(table.name)"
            class="flex flex-col items-center p-4 rounded-xl border-2 transition-all"
            :class="
              selectedTables.includes(table.name)
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
            "
          >
            <div class="relative">
              <div
                class="w-12 h-12 rounded-xl flex items-center justify-center mb-2"
                :class="table.color"
              >
                <svg
                  class="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    :d="table.icon"
                  />
                </svg>
              </div>
              <div
                v-if="selectedTables.includes(table.name)"
                class="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center"
              >
                <svg
                  class="w-3 h-3 text-white"
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
              </div>
            </div>
            <span class="text-sm font-semibold text-slate-800 dark:text-slate-100">{{
              table.label
            }}</span>
            <span class="text-xs text-slate-500 dark:text-slate-400"
              >{{ table.recordCount }} records</span
            >
          </button>
        </div>

        <!-- Select All / Deselect All -->
        <div class="flex gap-2">
          <button
            @click="selectAllTables"
            class="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors text-sm font-semibold"
          >
            Select All
          </button>
          <button
            @click="deselectAllTables"
            class="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors text-sm font-semibold"
          >
            Deselect All
          </button>
        </div>
      </div>

      <!-- Format Selection -->
      <div
        class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 space-y-4"
      >
        <div>
          <h3 class="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-1">
            Export Format
          </h3>
          <p class="text-sm text-slate-500 dark:text-slate-400">
            Choose the file format for your export
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
          <button
            v-for="format in exportFormats"
            :key="format.value"
            @click="selectedFormat = format.value"
            class="flex items-center p-4 rounded-xl border-2 transition-all"
            :class="
              selectedFormat === format.value
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
            "
          >
            <div
              class="w-12 h-12 rounded-xl flex items-center justify-center mr-4"
              :class="format.color"
            >
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  :d="format.icon"
                />
              </svg>
            </div>
            <div class="flex-1 text-left">
              <p class="text-sm font-semibold text-slate-800 dark:text-slate-100">
                {{ format.label }}
              </p>
              <p class="text-xs text-slate-500 dark:text-slate-400">{{ format.description }}</p>
            </div>
            <div
              v-if="selectedFormat === format.value"
              class="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center ml-2"
            >
              <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
      </div>

      <!-- Action Buttons -->
      <div class="flex justify-end space-x-3">
        <button
          @click="$emit('back')"
          class="px-6 py-3 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors font-semibold"
        >
          Cancel
        </button>
        <button
          @click="nextStep"
          :disabled="selectedTables.length === 0"
          class="px-6 py-3 rounded-xl font-semibold transition-all"
          :class="
            selectedTables.length > 0
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl'
              : 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed'
          "
        >
          Next: Configure Options
        </button>
      </div>
    </div>

    <!-- Step 2: Configure Options -->
    <div v-if="currentStep === 2" class="space-y-6">
      <!-- Date Range Filter -->
      <div
        class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 space-y-4"
      >
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-1">
              Date Range Filter
            </h3>
            <p class="text-sm text-slate-500 dark:text-slate-400">
              Optionally filter records by creation date
            </p>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input v-model="useDateFilter" type="checkbox" class="sr-only peer" />
            <div
              class="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-blue-600"
            ></div>
          </label>
        </div>

        <div v-if="useDateFilter" class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 block"
              >From Date</label
            >
            <input
              v-model="dateFrom"
              type="date"
              class="w-full px-4 py-2 bg-white dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label class="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 block"
              >To Date</label
            >
            <input
              v-model="dateTo"
              type="date"
              class="w-full px-4 py-2 bg-white dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <!-- Export Options -->
      <div
        class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 space-y-4"
      >
        <div>
          <h3 class="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-1">
            Export Options
          </h3>
          <p class="text-sm text-slate-500 dark:text-slate-400">Customize your export settings</p>
        </div>

        <div class="space-y-3">
          <!-- Include Headers -->
          <div
            class="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl"
          >
            <div class="flex items-center space-x-3">
              <div
                class="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center"
              >
                <svg
                  class="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div>
                <p class="text-sm font-semibold text-slate-800 dark:text-slate-100">
                  Include Column Headers
                </p>
                <p class="text-xs text-slate-500 dark:text-slate-400">
                  Add column names as first row
                </p>
              </div>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input v-model="includeHeaders" type="checkbox" class="sr-only peer" />
              <div
                class="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-blue-600"
              ></div>
            </label>
          </div>

          <!-- Separate Files -->
          <div
            class="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl"
          >
            <div class="flex items-center space-x-3">
              <div
                class="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center"
              >
                <svg
                  class="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"
                  />
                </svg>
              </div>
              <div>
                <p class="text-sm font-semibold text-slate-800 dark:text-slate-100">
                  Separate Files per Table
                </p>
                <p class="text-xs text-slate-500 dark:text-slate-400">
                  Create individual files for each table
                </p>
              </div>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input v-model="separateFiles" type="checkbox" class="sr-only peer" />
              <div
                class="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-blue-600"
              ></div>
            </label>
          </div>

          <!-- Include Timestamps -->
          <div
            class="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl"
          >
            <div class="flex items-center space-x-3">
              <div
                class="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center"
              >
                <svg
                  class="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <p class="text-sm font-semibold text-slate-800 dark:text-slate-100">
                  Include Timestamps
                </p>
                <p class="text-xs text-slate-500 dark:text-slate-400">Export created_at field</p>
              </div>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input v-model="includeTimestamps" type="checkbox" class="sr-only peer" />
              <div
                class="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-blue-600"
              ></div>
            </label>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex justify-between">
        <button
          @click="prevStep"
          class="px-6 py-3 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors font-semibold"
        >
          Back
        </button>
        <button
          @click="nextStep"
          class="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
        >
          Next: Preview
        </button>
      </div>
    </div>

    <!-- Step 3: Preview & Export -->
    <div v-if="currentStep === 3" class="space-y-6">
      <!-- Export Summary -->
      <div
        class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 space-y-4"
      >
        <h3 class="text-lg font-semibold text-slate-800 dark:text-slate-100">Export Summary</h3>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div
            class="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800"
          >
            <p class="text-sm text-blue-600 dark:text-blue-400 font-semibold mb-1">Tables</p>
            <p class="text-lg font-bold text-blue-800 dark:text-blue-300">
              {{ selectedTables.length }}
            </p>
          </div>
          <div
            class="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-200 dark:border-emerald-800"
          >
            <p class="text-sm text-emerald-600 dark:text-emerald-400 font-semibold mb-1">Format</p>
            <p class="text-lg font-bold text-emerald-800 dark:text-emerald-300">
              {{ selectedFormat.toUpperCase() }}
            </p>
          </div>
          <div
            class="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-800"
          >
            <p class="text-sm text-purple-600 dark:text-purple-400 font-semibold mb-1">
              Total Records
            </p>
            <p class="text-lg font-bold text-purple-800 dark:text-purple-300">{{ totalRecords }}</p>
          </div>
          <div
            class="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800"
          >
            <p class="text-sm text-amber-600 dark:text-amber-400 font-semibold mb-1">Est. Size</p>
            <p class="text-lg font-bold text-amber-800 dark:text-amber-300">{{ estimatedSize }}</p>
          </div>
        </div>

        <!-- Selected Tables List -->
        <div class="space-y-2">
          <p class="text-sm font-semibold text-slate-700 dark:text-slate-300">Selected Tables:</p>
          <div class="flex flex-wrap gap-2">
            <div
              v-for="tableName in selectedTables"
              :key="tableName"
              class="flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-700 rounded-lg"
            >
              <div class="w-2 h-2 rounded-full" :class="getTableColor(tableName)"></div>
              <span class="text-sm font-medium text-slate-800 dark:text-slate-200">{{
                getTableLabel(tableName)
              }}</span>
            </div>
          </div>
        </div>

        <!-- Export Options Summary -->
        <div class="space-y-2">
          <p class="text-sm font-semibold text-slate-700 dark:text-slate-300">Export Options:</p>
          <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
            <div class="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
              <svg
                class="w-4 h-4"
                :class="includeHeaders ? 'text-emerald-500' : 'text-slate-400'"
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
              Column Headers
            </div>
            <div class="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
              <svg
                class="w-4 h-4"
                :class="separateFiles ? 'text-emerald-500' : 'text-slate-400'"
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
              Separate Files
            </div>
            <div class="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
              <svg
                class="w-4 h-4"
                :class="includeTimestamps ? 'text-emerald-500' : 'text-slate-400'"
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
              Timestamps
            </div>
            <div class="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
              <svg
                class="w-4 h-4"
                :class="useDateFilter ? 'text-emerald-500' : 'text-slate-400'"
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
              Date Filter
            </div>
          </div>
        </div>
      </div>

      <!-- Preview (First 5 rows of first table) -->
      <div
        class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 space-y-4"
      >
        <h3 class="text-lg font-semibold text-slate-800 dark:text-slate-100">
          Preview ({{ getTableLabel(selectedTables[0]) }})
        </h3>

        <div class="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
          <div v-if="isLoadingPreview" class="flex items-center justify-center py-12">
            <svg
              class="animate-spin w-8 h-8 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </div>
          <table v-else class="w-full">
            <thead class="bg-slate-50 dark:bg-slate-900/50">
              <tr>
                <th
                  v-for="column in previewColumns"
                  :key="column"
                  class="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider"
                >
                  {{ column }}
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-200 dark:divide-slate-700">
              <tr
                v-for="(row, index) in previewData"
                :key="index"
                class="hover:bg-slate-50 dark:hover:bg-slate-700/50"
              >
                <td
                  v-for="column in previewColumns"
                  :key="column"
                  class="px-4 py-3 text-sm text-slate-800 dark:text-slate-200"
                >
                  {{ row[column] || '-' }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="text-xs text-slate-500 dark:text-slate-400 text-center">
          Showing first 5 rows • Full export will include all {{ totalRecords }} records
        </p>
      </div>

      <!-- Action Buttons -->
      <div class="flex justify-between">
        <button
          class="px-6 py-3 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors font-semibold"
          @click="prevStep"
        >
          Back
        </button>
        <button
          :disabled="isExporting"
          class="px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2"
          :class="
            isExporting
              ? 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700 shadow-lg hover:shadow-xl'
          "
          @click="exportData"
        >
          <svg
            v-if="isExporting"
            class="animate-spin w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
            />
          </svg>
          {{ isExporting ? 'Exporting...' : 'Export Data' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, toRaw } from 'vue'
// import { generalStats, useAdmin } from '../../composables/useAdmin'

const emit = defineEmits(['back', 'export-complete'])

const steps = [
  { id: 1, label: 'Select & Format' },
  { id: 2, label: 'Configure Options' },
  { id: 3, label: 'Preview & Export' }
]

const generalStats = ref({})

const fetchGeneralStats = async () => {
  const stats = await window.api.getStats()
  console.log('General Stats:', stats)
  generalStats.value = stats
}

const availableTables = computed(() => {
  return [
    {
      name: 'labels',
      label: 'Labels',
      recordCount: generalStats.value.labels || 0,
      color: 'bg-gradient-to-br from-blue-500 to-cyan-600',
      icon: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z'
    },
    {
      name: 'clients',
      label: 'Clients',
      recordCount: generalStats.value.clients || 0,
      color: 'bg-gradient-to-br from-violet-500 to-purple-600',
      icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z'
    },
    {
      name: 'client_labels',
      label: 'Client Labels',
      recordCount: 892,
      color: 'bg-gradient-to-br from-emerald-500 to-teal-600',
      icon: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z'
    },
    {
      name: 'queue',
      label: 'Queue',
      recordCount: 234,
      color: 'bg-gradient-to-br from-amber-500 to-orange-600',
      icon: 'M4 6h16M4 10h16M4 14h16M4 18h16'
    }
  ]
})

const exportFormats = [
  {
    value: 'csv',
    label: 'CSV',
    description: 'Comma-separated values',
    color: 'bg-gradient-to-br from-emerald-500 to-teal-600',
    icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
  },
  {
    value: 'json',
    label: 'JSON',
    description: 'JavaScript Object Notation',
    color: 'bg-gradient-to-br from-blue-500 to-indigo-600',
    icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4'
  },
  {
    value: 'xlsx',
    label: 'Excel',
    description: 'Microsoft Excel format',
    color: 'bg-gradient-to-br from-green-600 to-emerald-700',
    icon: 'M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z'
  }
]

const currentStep = ref(1)
const selectedTables = ref([])
const selectedFormat = ref('csv')
const useDateFilter = ref(false)
const dateFrom = ref('')
const dateTo = ref('')
const includeHeaders = ref(true)
const separateFiles = ref(false)
const includeTimestamps = ref(true)
const isExporting = ref(false)
const isLoadingPreview = ref(false)
const previewData = ref([])
const previewColumns = ref([])

const totalRecords = computed(() => {
  return selectedTables.value.reduce((sum, tableName) => {
    const table = availableTables.value.find((t) => t.name === tableName)
    return sum + (table?.recordCount || 0)
  }, 0)
})

const estimatedSize = computed(() => {
  const bytesPerRecord =
    selectedFormat.value === 'json' ? 150 : selectedFormat.value === 'xlsx' ? 100 : 80
  const totalBytes = totalRecords.value * bytesPerRecord

  if (totalBytes < 1024) return `${totalBytes} B`
  if (totalBytes < 1024 * 1024) return `${(totalBytes / 1024).toFixed(1)} KB`
  return `${(totalBytes / (1024 * 1024)).toFixed(1)} MB`
})

const toggleTableSelection = (tableName) => {
  const index = selectedTables.value.indexOf(tableName)
  if (index === -1) {
    selectedTables.value.push(tableName)
  } else {
    selectedTables.value.splice(index, 1)
  }
}

const selectAllTables = () => {
  selectedTables.value = availableTables.value.map((t) => t.name)
}

const deselectAllTables = () => {
  selectedTables.value = []
}

const getTableLabel = (tableName) => {
  return availableTables.value.find((t) => t.name === tableName)?.label || tableName
}

const getTableColor = (tableName) => {
  const table = availableTables.value.find((t) => t.name === tableName)
  return table?.color.replace('bg-gradient-to-br', 'bg-gradient-to-r') || 'bg-slate-500'
}

const loadPreview = async () => {
  if (selectedTables.value.length === 0) return

  isLoadingPreview.value = true

  try {
    const tableName = selectedTables.value[0]
    const options = {
      table: tableName,
      limit: 5,
      includeTimestamps: includeTimestamps.value,
      dateFrom: useDateFilter.value ? dateFrom.value : null,
      dateTo: useDateFilter.value ? dateTo.value : null
    }

    const result = await window.api.getExportPreview(options)
    previewData.value = result.data
    previewColumns.value = result.columns
  } catch (error) {
    console.error('Preview error:', error)
  } finally {
    isLoadingPreview.value = false
  }
}

const nextStep = () => {
  if (currentStep.value < 3) {
    currentStep.value++
    if (currentStep.value === 3) {
      loadPreview()
    }
  }
}

const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

const exportData = async () => {
  isExporting.value = true

  try {
    const exportOptions = {
      tables: toRaw(selectedTables.value),
      format: selectedFormat.value,
      includeHeaders: includeHeaders.value,
      separateFiles: separateFiles.value,
      includeTimestamps: includeTimestamps.value,
      useDateFilter: useDateFilter.value,
      dateFrom: useDateFilter.value ? dateFrom.value : null,
      dateTo: useDateFilter.value ? dateTo.value : null
    }
    console.log(toRaw(exportOptions))

    const result = await window.api.exportData(toRaw(exportOptions))

    if (result.success) {
      emit('export-complete', {
        success: true,
        filesCreated: result.files,
        totalRecords: totalRecords.value,
        format: selectedFormat.value
      })
    } else {
      throw new Error(result.error || 'Export failed')
    }
  } catch (error) {
    console.error('Export error:', error)
    emit('export-complete', {
      success: false,
      error: error.message
    })
  } finally {
    isExporting.value = false
  }
}

// Set default date range to last 30 days
const today = new Date()
const thirtyDaysAgo = new Date(today)
thirtyDaysAgo.setDate(today.getDate() - 30)

dateTo.value = today.toISOString().split('T')[0]
dateFrom.value = thirtyDaysAgo.toISOString().split('T')[0]

// Watch for table changes to reload counts
watch(
  selectedTables,
  async () => {
    if (selectedTables.value.length > 0 && currentStep.value === 3) {
      await loadPreview()
    }
  },
  { deep: true }
)

onMounted(async () => {
  console.log(generalStats.value)
  await fetchGeneralStats()
})
</script>
