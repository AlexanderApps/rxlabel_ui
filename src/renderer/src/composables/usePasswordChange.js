import { ref, reactive, computed } from 'vue'

export function usePasswordChange() {
  // Reactive state
  const passwordForm = reactive({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const showCurrentPassword = ref(false)
  const showNewPassword = ref(false)
  const showConfirmPassword = ref(false)
  const isChangingPassword = ref(false)
  const passwordChangeError = ref('')
  const passwordChangeSuccess = ref('')

  // Computed properties
  const passwordStrength = computed(() => {
    const password = passwordForm.newPassword
    if (!password) return 0

    let strength = 0

    // Length check
    if (password.length >= 8) strength++
    if (password.length >= 12) strength++

    // Complexity checks
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++
    if (/\d/.test(password)) strength++
    if (/[^a-zA-Z0-9]/.test(password)) strength++

    return Math.min(strength, 4)
  })

  const passwordsMatch = computed(() => {
    return passwordForm.newPassword === passwordForm.confirmPassword
  })

  const isPasswordFormValid = computed(() => {
    return (
      passwordForm.currentPassword && passwordForm.newPassword.length >= 8 && passwordsMatch.value
    )
  })

  // Methods
  const getStrengthColor = (strength) => {
    const colors = ['', 'bg-red-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500']
    return colors[strength] || ''
  }

  const getStrengthTextColor = (strength) => {
    const colors = [
      '',
      'text-red-600 dark:text-red-400',
      'text-yellow-600 dark:text-yellow-400',
      'text-blue-600 dark:text-blue-400',
      'text-green-600 dark:text-green-400'
    ]
    return colors[strength] || ''
  }

  const getStrengthLabel = (strength) => {
    const labels = ['', 'Weak', 'Fair', 'Good', 'Strong']
    return labels[strength] || ''
  }

  const handleChangePassword = async () => {
    passwordChangeError.value = ''
    passwordChangeSuccess.value = ''
    isChangingPassword.value = true

    try {
      const result = await window.electron.ipcRenderer.invoke('change-password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      })

      if (result.success) {
        passwordChangeSuccess.value = 'Password changed successfully!'
        resetPasswordForm()

        setTimeout(() => {
          passwordChangeSuccess.value = ''
        }, 3000)
      } else {
        passwordChangeError.value = result.error || 'Failed to change password'
      }
    } catch (error) {
      passwordChangeError.value = 'An error occurred. Please try again.'
      console.error('Password change error:', error)
    } finally {
      isChangingPassword.value = false
    }
  }

  const resetPasswordForm = () => {
    passwordForm.currentPassword = ''
    passwordForm.newPassword = ''
    passwordForm.confirmPassword = ''
    showCurrentPassword.value = false
    showNewPassword.value = false
    showConfirmPassword.value = false
    passwordChangeError.value = ''
  }

  return {
    // State
    passwordForm,
    showCurrentPassword,
    showNewPassword,
    showConfirmPassword,
    isChangingPassword,
    passwordChangeError,
    passwordChangeSuccess,

    // Computed
    passwordStrength,
    passwordsMatch,
    isPasswordFormValid,

    // Methods
    getStrengthColor,
    getStrengthTextColor,
    getStrengthLabel,
    handleChangePassword,
    resetPasswordForm
  }
}
