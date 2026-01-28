<template>
  <MoreMenu :actions="actions">
    <template #trigger>
      <button
        class="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 transition-colors text-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="bi bi-three-dots-vertical w-4 h-4"
          fill="currentColor"
          viewBox="0 0 16 16"
        >
          <path
            d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0"
          />
        </svg>
      </button>
    </template>
  </MoreMenu>
</template>
<script setup>
import MoreMenu from './MoreMenu.vue'
import { useRouter } from 'vue-router'
import { useConfirm } from '../composables/useConfirm.js'
import { useAlerts } from '../composables/useAlerts.js'
import { showSettings } from '../composables/useSettings.js'
import { computed } from 'vue'

const props = defineProps({
  includes: {
    type: Array,
    default: () => ['Logout']
  }
})

const router = useRouter()
const alerts = useAlerts()
const { confirm } = useConfirm()

const handeLogout = async () => {
  await window.api.logoutUser()
  router.replace({ name: 'LoginPage' })
}

const clearQueue = async () => {
  await window.api.clearQueue()
}

const confirmClearQueue = async () => {
  if (await confirm('Clear the entire queue?')) {
    await clearQueue()
    setTimeout(() => alerts.success('Queue cleared.'), 500)
  }
}

const actions = computed(() => {
  const baseActions = [
    {
      label: 'View Labels',
      shortcut: 'Ctrl + B',
      handler: () => router.push({ name: 'MedicationLabel' })
    },
    {
      label: 'View Queue',
      shortcut: 'Ctrl + H',
      handler: () => router.push({ name: 'Clients' })
    },
    {
      label: 'Clients',
      shortcut: 'Ctrl + M',
      handler: () => router.push({ name: 'Clients' })
    },
    {
      label: 'Print Queue',
      shortcut: 'Ctrl + I',
      handler: () => console.log('first')
    },
    {
      label: 'Clear Queue',
      shortcut: 'Ctrl + L',
      handler: async () => await confirmClearQueue()
    },
    {
      label: 'Settings',
      shortcut: 'Ctrl + ,',
      handler: () => (showSettings.value = true)
    },
    {
      label: 'Logout',
      handler: async () => await handeLogout()
    }
  ]
  return baseActions.filter((action) => props.includes.includes(action.label))
})
</script>
