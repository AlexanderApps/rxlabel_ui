<template>
  <teleport to="body">
    <div
      v-if="show"
      class="fixed inset-0 bg-black/70 text-gray-900 dark:text-gray-100 flex items-center justify-center z-50 backdrop-blur-[1px]"
      role="dialog"
      arial-modal="true"
      @click.self="cancel"
    >
      <div
        ref="modalRef"
        tabindex="-1"
        class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-5 w-87.5"
      >
        <h3 class="text-lg font-medium mb-3">
          {{ title }}
        </h3>

        <p class="text-sm opacity-80 mb-5">
          {{ message }}
        </p>

        <div class="flex justify-end gap-2">
          <button
            ref="cancelBtn"
            class="px-3 py-1 rounded-md bg-gray-200 dark:bg-gray-700 dark:text-white text-sm"
            @click="cancel"
          >
            Cancel
          </button>

          <button
            ref="confirmBtn"
            class="px-3 py-1 rounded-md bg-blue-600 text-white text-sm"
            @click="confirm"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  </teleport>
</template>

<!-- <script setup>
const props = defineProps({
  show: Boolean,
  title: { type: String, default: 'Confirm Action' },
  message: { type: String, default: 'Are you sure you want to continue?' }
})

const emit = defineEmits(['confirm', 'cancel'])

function confirm() {
  emit('confirm')
}
function cancel() {
  emit('cancel')
}

window.addEventListener('keydown', (e) => {
  if (!props.show) return
  if (e.key === 'Escape') cancel()
  if (e.key === 'Enter') confirm()
})
</script> -->

<script setup>
import { ref, watch, onUnmounted } from 'vue'

const props = defineProps({
  show: Boolean,
  title: String,
  message: String
})

const emit = defineEmits(['confirm', 'cancel'])

const modalRef = ref(null)
const cancelBtn = ref(null)
const confirmBtn = ref(null)

let lastFocusedElement = null

function confirm() {
  emit('confirm')
}
function cancel() {
  emit('cancel')
}

function handleKeydown(e) {
  if (!props.show) return

  if (e.key === 'Escape') {
    e.preventDefault()
    cancel()
  }

  if (e.key === 'Enter') {
    const active = document.activeElement

    // Let the browser handle Enter on buttons naturally
    if (active === cancelBtn.value || active === confirmBtn.value) {
      return
    }

    // Optional: Enter confirms only if focus is on the dialog itself
    if (active === modalRef.value) {
      e.preventDefault()
      confirm()
    }
  }

  if (e.key === 'Tab') {
    e.preventDefault()

    const focusables = [cancelBtn.value, confirmBtn.value]
    const index = focusables.indexOf(document.activeElement)

    const nextIndex = e.shiftKey
      ? (index - 1 + focusables.length) % focusables.length
      : (index + 1) % focusables.length

    focusables[nextIndex].focus()
  }
}

watch(
  () => props.show,
  (open) => {
    if (open) {
      lastFocusedElement = document.activeElement
      requestAnimationFrame(() => {
        cancelBtn.value?.focus()
      })
      window.addEventListener('keydown', handleKeydown)
    } else {
      window.removeEventListener('keydown', handleKeydown)
      lastFocusedElement?.focus()
    }
  }
)

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>
