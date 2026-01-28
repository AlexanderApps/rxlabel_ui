import { reactive } from 'vue'

// shared state accessible by both the component and the composable
export const modalState = reactive({
  show: false,
  message: '',
  resolve: null
})

export const useConfirm = () => {
  const confirm = (message) => {
    return new Promise((resolve) => {
      modalState.message = message
      modalState.resolve = resolve
      modalState.show = true
    })
  }

  const onConfirm = () => {
    modalState.resolve(true)
    modalState.show = false
  }

  const onCancel = () => {
    modalState.resolve(false)
    modalState.show = false
  }

  return { confirm, onConfirm, onCancel }
}
