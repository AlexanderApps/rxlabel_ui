<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-4">
        <button
          class="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          @click="$emit('back')"
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
          <h2 class="text-2xl font-bold text-slate-800 dark:text-slate-100">
            Encryption Key Management
          </h2>
          <p class="text-sm text-slate-500 dark:text-slate-400">
            View, manage, and rekey your database encryption
          </p>
        </div>
      </div>
    </div>

    <!-- Security Warning -->
    <div
      class="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-2xl border border-amber-200 dark:border-amber-800 p-6"
    >
      <div class="flex items-start space-x-4">
        <div
          class="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0"
        >
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <div class="flex-1">
          <h3 class="text-lg font-bold text-amber-900 dark:text-amber-300 mb-2">Security Notice</h3>
          <ul class="space-y-1 text-sm text-amber-800 dark:text-amber-400">
            <li class="flex items-center space-x-2">
              <svg
                class="w-4 h-4 flex-shrink-0"
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
              <span>Store encryption keys in a secure location (password manager recommended)</span>
            </li>
            <li class="flex items-center space-x-2">
              <svg
                class="w-4 h-4 flex-shrink-0"
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
              <span>Losing your encryption key means permanent data loss</span>
            </li>
            <li class="flex items-center space-x-2">
              <svg
                class="w-4 h-4 flex-shrink-0"
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
              <span
                >Rekeying creates a new backup - old backups remain with their original keys</span
              >
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Current Database -->
    <div
      class="bg-white dark:bg-slate-800 rounded-2xl border-2 border-blue-200 dark:border-blue-800 p-6"
    >
      <div class="flex items-center space-x-4 mb-6">
        <div
          class="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg"
        >
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"
            />
          </svg>
        </div>
        <div class="flex-1">
          <h3 class="text-lg font-bold text-slate-800 dark:text-slate-100">Current Database</h3>
          <p class="text-sm text-slate-500 dark:text-slate-400">Active production database</p>
        </div>
        <div
          class="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-xs font-bold"
        >
          ACTIVE
        </div>
      </div>

      <div class="space-y-4">
        <!-- Current Key Display -->
        <div class="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
          <div class="flex items-center justify-between mb-3">
            <label class="text-sm font-semibold text-slate-700 dark:text-slate-300"
              >Encryption Key</label
            >
            <div class="flex items-center space-x-2">
              <button
                class="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
                :title="showCurrentKey ? 'Hide key' : 'Show key'"
                @click="toggleCurrentKeyVisibility"
              >
                <svg
                  v-if="showCurrentKey"
                  class="w-4 h-4 text-slate-600 dark:text-slate-400"
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
                <svg
                  v-else
                  class="w-4 h-4 text-slate-600 dark:text-slate-400"
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
              </button>
              <button
                class="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
                title="Copy key"
                @click="copyKey(currentDatabase.key)"
              >
                <svg
                  class="w-4 h-4 text-slate-600 dark:text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              </button>
            </div>
          </div>
          <p
            class="font-mono text-sm text-slate-800 dark:text-slate-200 break-all select-all p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700"
          >
            {{ showCurrentKey ? currentDatabase.key : '•'.repeat(currentDatabase.key.length) }}
          </p>
        </div>

        <!-- Action Buttons -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
          <button
            class="flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all font-semibold shadow-lg hover:shadow-xl"
            @click="openRekeyModal('current')"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            <span>Rekey Database</span>
          </button>

          <button
            class="flex items-center justify-center space-x-2 px-4 py-3 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-xl hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-colors font-semibold"
            @click="downloadDatabase('current', true)"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            <span>Download Encrypted</span>
          </button>

          <button
            class="flex items-center justify-center space-x-2 px-4 py-3 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors font-semibold"
            @click="downloadDatabase('current', false)"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
            <span>Download Decrypted</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Backup Databases -->
    <div
      class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6"
    >
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center space-x-4">
          <div
            class="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg"
          >
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
              />
            </svg>
          </div>
          <div>
            <h3 class="text-lg font-bold text-slate-800 dark:text-slate-100">Backup Databases</h3>
            <p class="text-sm text-slate-500 dark:text-slate-400">
              {{ backupDatabases.length }} backup(s) found
            </p>
          </div>
        </div>
        <button
          :disabled="isRefreshing"
          class="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors text-sm font-semibold flex items-center gap-2"
          @click="refreshBackups"
        >
          <svg
            :class="{ 'animate-spin': isRefreshing }"
            class="w-4 h-4"
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
          Refresh
        </button>
      </div>

      <div v-if="backupDatabases.length === 0" class="text-center py-12">
        <svg
          class="w-16 h-16 mx-auto text-slate-300 dark:text-slate-600 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
          />
        </svg>
        <p class="text-slate-500 dark:text-slate-400">No backups found</p>
      </div>

      <div v-else class="space-y-3">
        <div
          v-for="backup in backupDatabases"
          :key="backup.id"
          class="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors"
        >
          <div class="flex items-start justify-between mb-3">
            <div class="flex-1">
              <div class="flex items-center space-x-2 mb-1">
                <h4 class="font-semibold text-slate-800 dark:text-slate-100">{{ backup.name }}</h4>
                <span
                  v-if="backup.type === 'auto'"
                  class="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded text-xs font-bold"
                >
                  AUTO
                </span>
                <span
                  v-else
                  class="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded text-xs font-bold"
                >
                  MANUAL
                </span>
              </div>
              <p class="text-xs text-slate-500 dark:text-slate-400">
                {{ backup.date }} • {{ backup.size }}
              </p>
            </div>
            <button
              class="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
              @click="toggleBackupKeyVisibility(backup.id)"
            >
              <svg
                v-if="visibleBackupKeys.includes(backup.id)"
                class="w-4 h-4 text-slate-600 dark:text-slate-400"
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
              <svg
                v-else
                class="w-4 h-4 text-slate-600 dark:text-slate-400"
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
            </button>
          </div>

          <!-- Backup Key -->
          <div class="mb-3">
            <div class="flex items-center justify-between mb-2">
              <label class="text-xs font-semibold text-slate-600 dark:text-slate-400"
                >Encryption Key</label
              >
              <button
                class="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                @click="copyKey(backup.key)"
              >
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
                Copy
              </button>
            </div>
            <p
              class="font-mono text-xs text-slate-700 dark:text-slate-300 break-all select-all p-2 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700"
            >
              {{
                visibleBackupKeys.includes(backup.id) ? backup.key : '•'.repeat(backup.key.length)
              }}
            </p>
          </div>

          <!-- Backup Actions -->
          <div class="flex flex-wrap gap-2">
            <button
              class="flex items-center gap-1.5 px-3 py-1.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors text-xs font-semibold"
              @click="openRekeyModal(backup.id)"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              <span class="hidden sm:inline">Rekey</span>
            </button>
            <button
              class="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-lg hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-colors text-xs font-semibold"
              @click="downloadDatabase(backup.id, true)"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              <span class="hidden sm:inline">Encrypted</span>
            </button>
            <button
              class="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors text-xs font-semibold"
              @click="downloadDatabase(backup.id, false)"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              <span class="hidden sm:inline">Decrypted</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Rekey Modal -->
    <div
      v-if="showRekeyModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      @click.self="closeRekeyModal"
    >
      <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-lg w-full p-6 space-y-6">
        <div class="flex items-center justify-between">
          <h3 class="text-xl font-bold text-slate-800 dark:text-slate-100">Rekey Database</h3>
          <button
            class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            @click="closeRekeyModal"
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div class="space-y-4">
          <!-- Key Generation Method -->
          <div class="space-y-3">
            <label class="text-sm font-semibold text-slate-700 dark:text-slate-300"
              >Key Generation Method</label
            >
            <div class="grid grid-cols-2 gap-3">
              <button
                class="p-4 rounded-xl border-2 transition-all"
                :class="
                  rekeyMethod === 'random'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-slate-200 dark:border-slate-700'
                "
                @click="rekeyMethod = 'random'"
              >
                <svg
                  class="w-8 h-8 mx-auto mb-2"
                  :class="
                    rekeyMethod === 'random' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'
                  "
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
                <p
                  class="text-sm font-semibold"
                  :class="
                    rekeyMethod === 'random'
                      ? 'text-blue-800 dark:text-blue-300'
                      : 'text-slate-700 dark:text-slate-300'
                  "
                >
                  Random
                </p>
                <p class="text-xs text-slate-500 dark:text-slate-400">Auto-generate</p>
              </button>
              <button
                class="p-4 rounded-xl border-2 transition-all"
                :class="
                  rekeyMethod === 'custom'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-slate-200 dark:border-slate-700'
                "
                @click="rekeyMethod = 'custom'"
              >
                <svg
                  class="w-8 h-8 mx-auto mb-2"
                  :class="
                    rekeyMethod === 'custom' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'
                  "
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                <p
                  class="text-sm font-semibold"
                  :class="
                    rekeyMethod === 'custom'
                      ? 'text-blue-800 dark:text-blue-300'
                      : 'text-slate-700 dark:text-slate-300'
                  "
                >
                  Custom
                </p>
                <p class="text-xs text-slate-500 dark:text-slate-400">Provide your own</p>
              </button>
            </div>
          </div>

          <!-- Custom Key Input -->
          <div v-if="rekeyMethod === 'custom'" class="space-y-2">
            <label class="text-sm font-semibold text-slate-700 dark:text-slate-300"
              >New Encryption Key</label
            >
            <input
              v-model="customRekeyValue"
              type="text"
              placeholder="Enter your encryption key (min 16 characters)"
              class="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
            />
            <p class="text-xs text-slate-500 dark:text-slate-400">
              Minimum 16 characters recommended for security
            </p>
          </div>

          <!-- Generated Key Preview -->
          <div
            v-else
            class="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl"
          >
            <p class="text-sm text-blue-800 dark:text-blue-300 mb-2">
              A random 32-character key will be generated:
            </p>
            <p class="font-mono text-xs text-blue-600 dark:text-blue-400">
              xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
            </p>
          </div>
        </div>

        <div class="flex justify-end space-x-3">
          <button
            class="px-6 py-3 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors font-semibold"
            @click="closeRekeyModal"
          >
            Cancel
          </button>
          <button
            :disabled="isRekeying || (rekeyMethod === 'custom' && customRekeyValue.length < 16)"
            class="px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2"
            :class="
              isRekeying || (rekeyMethod === 'custom' && customRekeyValue.length < 16)
                ? 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 shadow-lg'
            "
            @click="performRekey"
          >
            <svg
              v-if="isRekeying"
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
            {{ isRekeying ? 'Rekeying...' : 'Rekey Database' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

defineEmits(['back'])

const currentDatabase = ref({
  name: 'Current Database',
  key: 'loading...',
  size: '0 MB'
})

const backupDatabases = ref([])
const showCurrentKey = ref(false)
const visibleBackupKeys = ref([])
const isRefreshing = ref(false)

// Rekey Modal
const showRekeyModal = ref(false)
const rekeyTarget = ref(null)
const rekeyMethod = ref('random')
const customRekeyValue = ref('')
const isRekeying = ref(false)

const toggleCurrentKeyVisibility = () => {
  showCurrentKey.value = !showCurrentKey.value
}

const toggleBackupKeyVisibility = (backupId) => {
  const index = visibleBackupKeys.value.indexOf(backupId)
  if (index > -1) {
    visibleBackupKeys.value.splice(index, 1)
  } else {
    visibleBackupKeys.value.push(backupId)
  }
}

const copyKey = async (key) => {
  try {
    await navigator.clipboard.writeText(key)
    // Could add a toast notification here
  } catch (error) {
    console.error('Failed to copy key:', error)
  }
}

const refreshBackups = async () => {
  isRefreshing.value = true
  try {
    const result = await window.api.getAllDatabaseKeys()
    if (result.success) {
      currentDatabase.value = result.current
      backupDatabases.value = result.backups
    }
  } catch (error) {
    console.error('Error refreshing backups:', error)
  } finally {
    isRefreshing.value = false
  }
}

const openRekeyModal = (target) => {
  rekeyTarget.value = target
  rekeyMethod.value = 'random'
  customRekeyValue.value = ''
  showRekeyModal.value = true
}

const closeRekeyModal = () => {
  showRekeyModal.value = false
  rekeyTarget.value = null
  customRekeyValue.value = ''
}

const performRekey = async () => {
  isRekeying.value = true
  try {
    const key = rekeyMethod.value === 'random' ? null : customRekeyValue.value
    const result = await window.api.rekeyDatabase({
      target: rekeyTarget.value,
      key: key
    })

    if (result.success) {
      await refreshBackups()
      closeRekeyModal()
      // Could add success notification here
    }
  } catch (error) {
    console.error('Error rekeying database:', error)
  } finally {
    isRekeying.value = false
  }
}

const downloadDatabase = async (target, encrypted) => {
  try {
    const result = await window.api.downloadDatabaseWithKey({
      target: target,
      encrypted: encrypted
    })

    if (result.success) {
      // Success notification
      console.log('Downloaded to:', result.path)
    }
  } catch (error) {
    console.error('Error downloading database:', error)
  }
}

onMounted(async () => {
  await refreshBackups()
})
</script>
