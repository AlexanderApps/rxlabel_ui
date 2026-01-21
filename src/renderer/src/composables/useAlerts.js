import { reactive } from 'vue'

const alerts = reactive([])

function pushAlert({ message, type = 'info', timeout = 3000 }) {
  const id = Date.now() + Math.random()

  alerts.push({ id, message, type })

  if (timeout) {
    setTimeout(() => removeAlert(id), timeout)
  }

  return id
}

function removeAlert(id) {
  const index = alerts.findIndex((a) => a.id === id)
  if (index !== -1) alerts.splice(index, 1)
}

export function useAlerts() {
  return {
    alerts,
    pushAlert,
    removeAlert,
    info: (m, t) => pushAlert({ message: m, type: 'info', timeout: t }),
    success: (m, t) => pushAlert({ message: m, type: 'success', timeout: t }),
    warning: (m, t) => pushAlert({ message: m, type: 'warning', timeout: t }),
    error: (m, t) => pushAlert({ message: m, type: 'error', timeout: t })
  }
}
