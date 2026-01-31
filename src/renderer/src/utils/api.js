import { useAlerts } from '../composables/useAlerts'

const alerts = useAlerts()

// ui-api-wrapper.js

/**
 * Standard UI wrapper to execute IPC calls with error handling.
 * @param {Function} apiMethod - The method from window.queueAPI
 * @param {...any} args - Arguments to pass to the method
 */
export async function runQuery(apiMethod, silentErrors = false, ...args) {
  try {
    const result = await apiMethod(...args)

    // The result from our Main process wrapper: { success, data, error }
    if (result && result.success) {
      return result.data
    } else {
      // Automatic error alerting
      const errorMsg = result?.error || 'An unknown error occurred.'
      if (!silentErrors) {
        alerts.error(`⚠️ Request Failed: ${errorMsg}`)
      }
      return null
    }
  } catch (err) {
    // Catch-all for communication/serialization issues
    console.error('IPC Bridge Error:', err)
    alerts.error('Critical: Could not reach the background process.')
    return null
  }
}
