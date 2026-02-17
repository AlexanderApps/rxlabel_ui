import { ref, onMounted } from 'vue'

export const generalStats = ref({})
export const backups = ref([])
export const backupSettings = ref({})
export const lastBackupDate = ref('')
export const users = ref([])

export function useAdmin() {
  const getGeneralStats = async () => {
    generalStats.value = await window.api.getStats()
  }

  const getBackups = async () => {
    backups.value = await window.api.getBackups()
  }
  const getBackupSettings = async () => {
    backupSettings.value = await window.api.getBackupSettings()
  }

  const getUsers = async () => {
    const response = await window.api.getUsers()
    if (response.success) {
      users.value = response.data
    }
  }

  const createBackup = async () => {
    await window.api.createManualBackup()
  }

  const getLastBackupDate = async () => {
    lastBackupDate.value = await window.api.lastBackupDate()
  }

  onMounted(async () => {
    await getGeneralStats()
  })

  return {
    users,
    backups,
    generalStats,
    backupSettings,
    lastBackupDate,

    getUsers,
    getBackups,
    createBackup,
    getGeneralStats,
    getBackupSettings,
    getLastBackupDate
  }
}
