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
import { useSettings, showSettings } from './composables/useSettings'
import { useRoute } from 'vue-router'

const route = useRoute()

const { loadSettings } = useSettings()
const { onConfirm, onCancel } = useConfirm()

const handleKeyDown = (event) => {
  if (route.name === 'LoginPage') return
  const isModKey = event.ctrlKey || event.metaKey

  // // Ctrl + J -> Go to Queue
  // if (isModKey && event.key.toLowerCase() === 'j') {
  //   event.preventDefault()
  //   goToQueue()
  // }


  // Ctrl + , -> Open Settings
  if (isModKey && event.key === ',') {
    event.preventDefault()
    showSettings.value = true
  }
}

onMounted(async () => {
  window.addEventListener('keydown', handleKeyDown)
  await loadSettings()
})
</script>

<style scoped>
html,
body,
#app {
  height: 100%;
}
</style>
