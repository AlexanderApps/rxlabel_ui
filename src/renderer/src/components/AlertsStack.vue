<!-- <template>
  <div class="fixed bottom-4 right-4 flex flex-col gap-2 z-50">
    <div
      v-for="a in alerts"
      :key="a.id"
      class="px-3 py-2 rounded shadow text-white cursor-pointer transition"
      :class="typeClass(a.type)"
      @click="remove(a.id)"
    >
      {{ a.message }}
    </div>
  </div>
</template>

<script setup>
import { useAlerts } from '../composables/useAlerts.js'

const { alerts, removeAlert } = useAlerts()

const remove = (id) => removeAlert(id)

function typeClass(type) {
  switch (type) {
    case 'success':
      return 'bg-green-600'
    case 'warning':
      return 'bg-yellow-600'
    case 'error':
      return 'bg-red-600'
    default:
      return 'bg-blue-600'
  }
}
</script>

<style scoped>
div {
  pointer-events: auto;
}
</style> -->

<!--
<template>
  <div class="fixed bottom-4 right-4 flex flex-col gap-2 z-50">
    <transition-group name="toast" tag="div">
      <div
        v-for="a in alerts"
        :key="a.id"
        class="px-3 py-2 rounded shadow cursor-pointer text-white select-none transform transition-all duration-300"
        :class="typeClass(a.type)"
        @click="remove(a.id)"
      >
        {{ a.message }}
      </div>
    </transition-group>
  </div>
</template>

<script setup>
import { useAlerts } from '../composables/useAlerts.js'

const { alerts, removeAlert } = useAlerts()

const remove = (id) => removeAlert(id)

function typeClass(type) {
  switch (type) {
    case 'success':
      return 'bg-green-600'
    case 'warning':
      return 'bg-yellow-600'
    case 'error':
      return 'bg-red-600'
    default:
      return 'bg-blue-600'
  }
}
</script>

<style scoped>
/* Slide-in + fade + elastic using Tailwind-like classes */
.toast-enter-from {
  transform: translateX(100%) scale(0.9);
  opacity: 0;
}
.toast-enter-to {
  transform: translateX(0) scale(1);
  opacity: 1;
}
.toast-enter-active {
  transition: all 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275); /* elastic */
}

.toast-leave-from {
  transform: translateX(0) scale(1);
  opacity: 1;
}
.toast-leave-to {
  transform: translateX(100%) scale(0.9);
  opacity: 0;
}
.toast-leave-active {
  transition: all 0.25s ease-in;
}

.toast-error-enter-active {
  animation: shake 0.35s cubic-bezier(0.36, 0.07, 0.19, 0.97);
}

@keyframes shake {
  10%,
  90% {
    transform: translateX(-2px);
  }
  20%,
  80% {
    transform: translateX(4px);
  }
  30%,
  50%,
  70% {
    transform: translateX(-8px);
  }
  40%,
  60% {
    transform: translateX(8px);
  }
}
</style> -->

<template>
  <!-- bottom-right fixed container -->
  <div class="fixed bottom-4 right-4 flex flex-col gap-2 z-50">
    <transition-group name="toast" tag="div">
      <div
        v-for="a in alerts"
        :key="a.id"
        class="px-4 py-2 rounded shadow cursor-pointer select-none transform transition-all duration-300"
        :class="typeClass(a.type)"
        @click="remove(a.id)"
      >
        {{ a.message }}
      </div>
    </transition-group>
  </div>
</template>

<script setup>
import { useAlerts } from '../composables/useAlerts.js'

const { alerts, removeAlert } = useAlerts()

const remove = (id) => removeAlert(id)

function typeClass(type) {
  switch (type) {
    case 'success':
      return 'bg-green-100 text-green-900 dark:bg-green-900 dark:text-green-100'
    case 'warning':
      return 'bg-yellow-100 text-yellow-900 dark:bg-yellow-900 dark:text-yellow-100'
    case 'error':
      return 'bg-red-100 text-red-900 dark:bg-red-900 dark:text-red-100'
    default:
      return 'bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-blue-100'
  }
}
</script>

<style scoped>
/* Slide-in from right + fade + elastic */
.toast-enter-from {
  transform: translateX(100%) scale(0.9);
  opacity: 0;
}
.toast-enter-to {
  transform: translateX(0) scale(1);
  opacity: 1;
}
.toast-enter-active {
  transition: all 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275); /* elastic */
}

.toast-leave-from {
  transform: translateX(0) scale(1);
  opacity: 1;
}
.toast-leave-to {
  transform: translateX(100%) scale(0.9);
  opacity: 0;
}
.toast-leave-active {
  transition: all 0.25s ease-in;
}

/* Optional: small vertical gap (redundant if using flex gap-2) */
</style>
