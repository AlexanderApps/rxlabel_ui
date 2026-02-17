// import { ref, onMounted } from 'vue'

// export function useTheme() {
//   const theme = ref('system') // 'light', 'dark', or 'system'

//   // Apply theme to document
//   const applyTheme = (themeSetting) => {
//     if (themeSetting === 'dark') {
//       document.documentElement.classList.add('dark')
//       return 'dark'
//     } else if (themeSetting === 'light') {
//       document.documentElement.classList.remove('dark')
//       return 'light'
//     } else {
//       // System preference
//       const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
//       if (isDark) {
//         document.documentElement.classList.add('dark')
//       } else {
//         document.documentElement.classList.remove('dark')
//       }
//       return isDark ? 'dark' : 'light'
//     }
//   }

//   // Set theme
//   const setTheme = (newTheme) => {
//     theme.value = newTheme
//     applyTheme(newTheme)
//     // Save to storage
//     if (window.api?.saveSettings) {
//       window.api.saveSettings({ appearance: { theme: newTheme } })
//     }
//   }

//   // Listen for system theme changes
//   const setupSystemThemeListener = () => {
//     const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

//     const handleChange = (e) => {
//       if (theme.value === 'system') {
//         applyTheme('system')
//       }
//     }

//     // Modern browsers
//     if (mediaQuery.addEventListener) {
//       mediaQuery.addEventListener('change', handleChange)
//     } else {
//       // Fallback for older browsers
//       mediaQuery.addListener(handleChange)
//     }

//     return () => {
//       if (mediaQuery.removeEventListener) {
//         mediaQuery.removeEventListener('change', handleChange)
//       } else {
//         mediaQuery.removeListener(handleChange)
//       }
//     }
//   }

//   // Initialize theme on mount
//   const initializeTheme = async () => {
//     // Load saved theme from settings
//     if (window.api?.getSettings) {
//       const settings = await window.api.getSettings()
//       const savedTheme = settings?.appearance?.theme || 'system'
//       theme.value = savedTheme
//     }

//     applyTheme(theme.value)
//     setupSystemThemeListener()
//   }

//   onMounted(() => {
//     initializeTheme()
//   })

//   return {
//     theme,
//     setTheme,
//     applyTheme
//   }
// }
