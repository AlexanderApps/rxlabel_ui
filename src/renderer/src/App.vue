<template>
  <router-view />
  <AlertsStack />
  <ConfirmModal
    :show="modalState.show"
    :message="modalState.message"
    @confirm="onConfirm"
    @cancel="onCancel"
  />
  <SettingsModal :show="showSettings" @close="showSettings = false" />
</template>

<script setup>
import { onMounted } from 'vue'
import AlertsStack from './components/AlertsStack.vue'
import ConfirmModal from './components/ConfirmModal.vue'
import { modalState, useConfirm } from './composables/useConfirm'
import SettingsModal from './pages/SettingsModal.vue'
import { showSettings, useSettings } from './composables/useSettings'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const { currentUser, closeSettings } = useSettings()

// const { loadSettings } = useSettings()
const { onConfirm, onCancel, confirm } = useConfirm()

const handeLogout = async () => {
  await window.api.logoutUser()
  router.replace({ name: 'LoginPage' })
}

const confirmLogout = async () => {
  if (await confirm('Are you sure you want to logout?')) {
    await handeLogout()
  }
}

const handleKeyDown = async (event) => {
  // ESC → Close modal if open
  if (event.key === 'Escape' && showSettings.value) {
    event.preventDefault()
    closeSettings()
    return
  }

  if (['LoginPage', 'Setup'].includes(route.name)) return
  const isModKey = event.ctrlKey || event.metaKey

  // Ctrl + J -> Go to Queue
  if (isModKey && event.key.toLowerCase() === 'j') {
    event.preventDefault()
    router.push({ name: 'MedicationLabelQueue' })
  }

  // Ctrl + , -> Open Settings
  if (isModKey && event.key === ',') {
    event.preventDefault()
    showSettings.value = true
  }

  // Ctrl + D -> Clients
  if (isModKey && event.key.toLowerCase() === 'd') {
    event.preventDefault()
    router.push({ name: 'Clients' })
  }

  // Ctrl + B -> Medication Label
  if (isModKey && event.key.toLowerCase() === 'b') {
    event.preventDefault()
    router.push({ name: 'MedicationLabel' })
  }

  // Ctrl + U -> Users (only for admin and manager)
  if (
    isModKey &&
    event.key.toLowerCase() === 'u' &&
    (currentUser.value?.role === 'admin' || currentUser.value?.role === 'manager')
  ) {
    event.preventDefault()
    router.push({ name: 'Users' })
  }

  if (
    isModKey &&
    event.shiftKey &&
    event.key.toLowerCase() === 'a' &&
    currentUser.value?.role === 'admin'
  ) {
    event.preventDefault()
    event.stopPropagation()
    router.push({ name: 'Admin' })
    return
  }

  if (isModKey && event.key.toLowerCase() === 'l') {
    event.preventDefault()
    event.stopPropagation()
    await confirmLogout()

    return
  }
}

onMounted(async () => {
  window.addEventListener('keydown', await handleKeyDown)
  // await loadSettings()
})
</script>

<style scoped>
html,
body,
#app {
  height: 100%;
}
</style>
