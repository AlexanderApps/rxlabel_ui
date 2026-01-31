<template>
  <div
    class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden"
  >
    <div
      class="p-6 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between"
    >
      <div class="flex-1 max-w-md">
        <div class="relative">
          <input
            type="text"
            placeholder="Search users..."
            class="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 dark:text-slate-100"
          />
          <svg
            class="w-5 h-5 text-slate-400 absolute left-3 top-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>
      <button
        class="ml-4 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl hover:shadow-lg transition-all font-semibold text-sm flex items-center space-x-2"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
        <span>Add User</span>
      </button>
    </div>

    <div class="overflow-x-auto">
      <table class="w-full">
        <thead class="bg-slate-50 dark:bg-slate-700/50">
          <tr>
            <th
              class="px-6 py-4 text-left text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider"
            >
              User
            </th>
            <th
              class="px-6 py-4 text-left text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider"
            >
              Role
            </th>
            <th
              class="px-6 py-4 text-left text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider"
            >
              Status
            </th>
            <th
              class="px-6 py-4 text-left text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider"
            >
              Last Active
            </th>
            <th
              class="px-6 py-4 text-left text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-200 dark:divide-slate-700">
          <tr
            v-for="user in users"
            :key="user.id"
            class="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors"
          >
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center space-x-3">
                <div
                  :class="user.avatarColor"
                  class="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow"
                >
                  {{ user.initials }}
                </div>
                <div>
                  <div class="text-sm font-semibold text-slate-800 dark:text-slate-100">
                    {{ user.name }}
                  </div>
                  <div class="text-xs text-slate-500 dark:text-slate-400">{{ user.email }}</div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span :class="user.roleColor" class="px-3 py-1 rounded-full text-xs font-bold">
                {{ user.role }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span :class="user.statusColor" class="flex items-center space-x-2">
                <span class="w-2 h-2 rounded-full" :class="user.statusDot"></span>
                <span class="text-sm font-medium">{{ user.status }}</span>
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">
              {{ user.lastActive }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm">
              <div class="flex items-center space-x-2">
                <button
                  class="p-2 hover:bg-slate-100 dark:hover:bg-slate-600 rounded-lg transition-colors"
                >
                  <svg
                    class="w-4 h-4 text-slate-600 dark:text-slate-300"
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
                </button>
                <button
                  class="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  <svg
                    class="w-4 h-4 text-red-600 dark:text-red-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
const users = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@rxlabel.com',
    initials: 'JD',
    role: 'Admin',
    roleColor: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400',
    status: 'Active',
    statusColor: 'text-emerald-600 dark:text-emerald-400',
    statusDot: 'bg-emerald-500',
    lastActive: '2 min ago',
    avatarColor: 'bg-gradient-to-br from-blue-500 to-cyan-600'
  },
  {
    id: 2,
    name: 'Sarah Miller',
    email: 'sarah@rxlabel.com',
    initials: 'SM',
    role: 'Pharmacist',
    roleColor: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    status: 'Active',
    statusColor: 'text-emerald-600 dark:text-emerald-400',
    statusDot: 'bg-emerald-500',
    lastActive: '15 min ago',
    avatarColor: 'bg-gradient-to-br from-violet-500 to-purple-600'
  },
  {
    id: 3,
    name: 'Robert Johnson',
    email: 'robert@rxlabel.com',
    initials: 'RJ',
    role: 'Technician',
    roleColor: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    status: 'Active',
    statusColor: 'text-emerald-600 dark:text-emerald-400',
    statusDot: 'bg-emerald-500',
    lastActive: '1 hour ago',
    avatarColor: 'bg-gradient-to-br from-emerald-500 to-teal-600'
  },
  {
    id: 4,
    name: 'Emily White',
    email: 'emily@rxlabel.com',
    initials: 'EW',
    role: 'Pharmacist',
    roleColor: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    status: 'Offline',
    statusColor: 'text-slate-500 dark:text-slate-400',
    statusDot: 'bg-slate-400',
    lastActive: '3 hours ago',
    avatarColor: 'bg-gradient-to-br from-pink-500 to-rose-600'
  },
  {
    id: 5,
    name: 'Michael Brown',
    email: 'michael@rxlabel.com',
    initials: 'MB',
    role: 'Admin',
    roleColor: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400',
    status: 'Active',
    statusColor: 'text-emerald-600 dark:text-emerald-400',
    statusDot: 'bg-emerald-500',
    lastActive: '5 min ago',
    avatarColor: 'bg-gradient-to-br from-amber-500 to-orange-600'
  }
]
</script>
