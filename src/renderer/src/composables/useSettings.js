import { ref, computed, watch } from 'vue'
import { soothingPrinterSound } from '../utils/utils.js'

export const showSettings = ref(false)

// Shared state across all components
const settings = ref({
  id: null,
  facility_name: '',
  facility_address: '',
  facility_contact: '',
  queue_size: 100,
  date_format: 'dt5',
  alert_sound: 1,
  theme: 'system',
  font_size: 'medium',
  created_at: null
})

const now = ref(new Date())

const isLoaded = ref(false)

export function useSettings() {
  // Date/Time format options
  setInterval(() => {
    now.value = new Date()
  }, 20000)

  const dateTimeOptions = computed(() => [
    // DATE ONLY FORMATS
    { id: 'd1', label: 'Short (US)', value: new Intl.DateTimeFormat('en-US').format(now.value) },
    {
      id: 'd2',
      label: 'Extended',
      value: new Intl.DateTimeFormat('en-US', { dateStyle: 'long' }).format(now.value)
    },
    {
      id: 'd3',
      label: 'Abbreviated',
      value: new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric'
      }).format(now.value)
    },
    { id: 'd4', label: 'Technical', value: now.value.toLocaleDateString('en-CA') },
    {
      id: 'd5',
      label: 'Day & Month',
      value: new Intl.DateTimeFormat('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      }).format(now.value)
    },

    // DATE + TIME FORMATS
    {
      id: 'dt1',
      label: 'Standard',
      value: new Intl.DateTimeFormat('en-US', { dateStyle: 'short', timeStyle: 'short' }).format(
        now.value
      )
    },
    {
      id: 'dt2',
      label: 'Detailed',
      value: new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(
        now.value
      )
    },
    {
      id: 'dt3',
      label: '24-Hour',
      value: new Intl.DateTimeFormat('en-GB', {
        dateStyle: 'short',
        timeStyle: 'short',
        hour12: false
      }).format(now.value)
    },
    {
      id: 'dt4',
      label: 'Compact',
      value: now.value.toLocaleString('en-US', {
        month: 'numeric',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    },
    {
      id: 'dt5',
      label: 'ISO Style',
      value: now.value.toISOString().replace('T', ' ').substring(0, 16)
    }
  ])

  // Format date based on current settings
  const formatDate = (date = Date.now(), includeTime = false) => {
    const d = date instanceof Date ? date : new Date(date)
    const formatId = settings.value.date_format || 'dt3'

    // Determine if this is a date-only or date-time format
    const isDateTime = formatId.startsWith('dt')

    // If user wants time but format is date-only, upgrade to default datetime
    const effectiveFormat = !isDateTime && includeTime ? 'dt3' : formatId

    switch (effectiveFormat) {
      // DATE ONLY FORMATS
      case 'd1':
        return new Intl.DateTimeFormat('en-US').format(d)
      case 'd2':
        return new Intl.DateTimeFormat('en-US', { dateStyle: 'long' }).format(d)
      case 'd3':
        return new Intl.DateTimeFormat('en-US', {
          month: 'short',
          day: '2-digit',
          year: 'numeric'
        }).format(d)
      case 'd4':
        return d.toLocaleDateString('en-CA') // YYYY-MM-DD
      case 'd5':
        return new Intl.DateTimeFormat('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric'
        }).format(d)

      // DATE + TIME FORMATS
      case 'dt1':
        return new Intl.DateTimeFormat('en-US', {
          dateStyle: 'short',
          timeStyle: 'short'
        }).format(d)
      case 'dt2':
        return new Intl.DateTimeFormat('en-US', {
          dateStyle: 'medium',
          timeStyle: 'short'
        }).format(d)
      case 'dt3':
        return new Intl.DateTimeFormat('en-GB', {
          dateStyle: 'short',
          timeStyle: 'short',
          hour12: false
        }).format(d)
      case 'dt4':
        return d.toLocaleString('en-US', {
          month: 'numeric',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      case 'dt5':
        return d.toISOString().replace('T', ' ').substring(0, 16)
      default:
        return d.toLocaleString()
    }
  }

  const formattedDate = computed(() => {
    return formatDate(now.value)
  })

  // Apply theme to document
  const applyTheme = (theme) => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else if (theme === 'light') {
      document.documentElement.classList.remove('dark')
    } else if (theme === 'system') {
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }
  }

  // Load settings from database
  const loadSettings = async () => {
    try {
      const dbSettings = await window.api.getSettings()
      if (dbSettings) {
        settings.value = { ...settings.value, ...dbSettings }

        // Apply theme
        if (settings.value.theme) {
          applyTheme(settings.value.theme)
        }

        isLoaded.value = true
      }
    } catch (error) {
      console.error('Failed to load settings:', error)
    }
  }

  // Save settings to database
  const saveSettings = async (newSettings) => {
    try {
      // Merge new settings
      settings.value = { ...settings.value, ...newSettings }

      // Apply theme if changed
      if (newSettings.theme) {
        applyTheme(newSettings.theme)
      }

      // Save to database
      await window.api.saveSettings(settings.value)

      return true
    } catch (error) {
      console.error('Failed to save settings:', error)
      return false
    }
  }

  // Update specific setting
  const updateSetting = async (key, value) => {
    settings.value[key] = value

    // Special handling for theme
    if (key === 'theme') {
      applyTheme(value)
    }

    // Auto-save to database
    try {
      await window.api.saveSettings(settings.value)
    } catch (error) {
      console.error('Failed to update setting:', error)
    }
  }

  // Computed properties for easy access
  const facilityInfo = computed(() => ({
    name: settings.value.facility_name,
    address: settings.value.facility_address,
    contact: settings.value.facility_contact
  }))

  const preferences = computed(() => ({
    queueSize: settings.value.queue_size,
    dateFormat: settings.value.date_format,
    alertSound: settings.value.alert_sound,
    theme: settings.value.theme,
    fontSize: settings.value.font_size
  }))

  const playSoundIfEnabled = () => {
    if (settings.value.alert_sound) {
      soothingPrinterSound()
    }
  }

  // Watch for theme changes
  watch(
    () => settings.value.theme,
    (newTheme) => {
      applyTheme(newTheme)
    }
  )

  // Listen for system theme changes
  if (typeof window !== 'undefined') {
    // eslint-disable-next-line no-unused-vars
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (settings.value.theme === 'system') {
        applyTheme('system')
      }
    })
  }

  return {
    // State
    settings,
    isLoaded,

    // Computed
    dateTimeOptions,
    formattedDate,
    facilityInfo,
    preferences,

    // Methods
    loadSettings,
    saveSettings,
    updateSetting,
    formatDate,
    applyTheme,
    playSoundIfEnabled
  }
}
