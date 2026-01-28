<template>
  <div
    class="block h-71 max-w-sm border border-gray-300/60 dark:border dark:border-gray-700 rounded-lg shadow-xs dark:bg-gray-800 dark:text-gray-100"
  >
    <!-- Title -->
    <div
      class="flex w-full rounded-t-lg justify-center items-center border-b border-b-gray-300/60 dark:border-b-gray-700 text-lg font-bold relative"
    >
      <input
        v-model="label.product"
        type="text"
        class="w-full h-8 ps-1 text-center focus:outline focus:outline-blue-500/50 block"
      />
      <!-- Edit Status Badge -->
      <span
        v-if="showEditStatus && label._dirty"
        class="absolute right-2 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-yellow-500 dark:bg-yellow-400 cursor-help group"
        title="Edited"
      >
        <span
          class="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-2 py-1 text-xs font-semibold rounded bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
        >
          Edited
        </span>
      </span>
    </div>

    <!-- Directions -->
    <div>
      <div class="h-24 mb-2 border-b border-b-gray-300/60 dark:border-b-gray-700">
        <textarea
          v-model="label.instructions"
          class="w-full h-full p-2 text-lg text-wrap no-scrollbar resize-none focus:outline focus:outline-blue-500/50"
        />
      </div>

      <!-- Person Info -->
      <div class="flex h-7 gap-2 px-2">
        <div class="flex gap-1">
          <strong>Name:</strong>
          <input
            v-model="label.client"
            type="text"
            class="border border-gray-300/60 dark:border-gray-500 w-30 h-6 ps-1 focus:outline focus:outline-blue-500/50 block rounded-xs"
            :disabled="!clientEditable"
          />
        </div>
        <div class="flex gap-1">
          <strong>Disp. by:</strong>
          <!-- v-model="label.dispensedBy" -->
          <input
            :value="currentUser"
            type="text"
            class="border uppercase border-gray-300/60 dark:border-gray-500 w-20 h-6 ps-1 focus:outline focus:outline-blue-500/50 block rounded-xs"
            readonly
            :disabled="true"
          />
        </div>
      </div>

      <!-- Timestamp -->
      <div class="px-2 pb-1 text-sm">
        <strong>{{ currentDate }}</strong>
      </div>

      <!-- Warnings -->
      <div class="h-11 border-y border-y-gray-300/60 dark:border-y-gray-700">
        <textarea
          v-model="label.warning"
          class="w-full h-full text-wrap no-scrollbar px-2 text-sm resize-none focus:outline focus:outline-blue-500/50"
        />
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="flex gap-2 p-2 justify-between">
      <Button
        v-for="action in actions"
        :key="action.event"
        :color="action.color"
        :label-id="action.label"
        @click="$emit(action.event, label)"
      />
    </div>
  </div>
</template>

<!-- <script setup>
import { watch, ref } from 'vue'
import Button from './Button.vue'

const label = defineModel({ type: Object, required: true })

const client = ref('')

defineProps({
  currentDate: { type: String, required: true },
  currentUser: { type: String, required: true },
  clientName: { type: String, required: false },
  clientEditable: { type: Boolean, required: false, default: () => true },
  showEditStatus: { type: Boolean, required: false, default: () => true }
})

defineEmits(['remove', 'update', 'queue', 'print'])

const trackedKeys = ['product', 'instructions', 'warning']

// Watch for changes to tracked fields and set dirty flag
watch(
  () => {
    // Guard against undefined label value
    if (!label.value) return null

    return {
      product: label.value.product,
      instructions: label.value.instructions,
      warning: label.value.warning
    }
  },
  (newVal, oldVal) => {
    // If newVal is null (from the guard) or oldVal is missing, stop
    if (!newVal || !oldVal) return

    for (const key of trackedKeys) {
      if (newVal[key] !== oldVal[key]) {
        label.value._dirty = true
        break
      }
    }
  },
  { deep: true }
)

// Configure action buttons declaratively
const actions = [
  { label: 'Remove', event: 'remove', color: 'red' },
  { label: 'Update', event: 'update', color: 'yellow' },
  { label: 'Add To Queue', event: 'queue', color: 'green' },
  { label: 'Print', event: 'print', color: 'blue' }
]
</script> -->

<script setup>
import { watch } from 'vue'
import Button from './Button.vue'

const label = defineModel({ type: Object, required: true })

const props = defineProps({
  currentDate: { type: String, required: true },
  currentUser: { type: String, required: true },
  clientName: { type: String, required: false },
  clientEditable: { type: Boolean, required: false, default: () => true },
  showEditStatus: { type: Boolean, required: false, default: () => true }
})

defineEmits(['remove', 'update', 'queue', 'print'])

const trackedKeys = ['product', 'instructions', 'warning']

watch(
  () => props.clientName,
  (newVal) => {
    label.value.client = newVal
  },
  { immediate: true }
)

// Mark dirty when edited
watch(
  () => ({
    product: label.value?.product,
    instructions: label.value?.instructions,
    warning: label.value?.warning
  }),
  (newVal, oldVal) => {
    if (!newVal || !oldVal) return
    for (const key of trackedKeys) {
      if (newVal[key] !== oldVal[key]) {
        label.value._dirty = true
        break
      }
    }
  }
)

const actions = [
  { label: 'Remove', event: 'remove', color: 'red' },
  { label: 'Update', event: 'update', color: 'yellow' },
  { label: 'Add To Queue', event: 'queue', color: 'green' },
  { label: 'Print', event: 'print', color: 'blue' }
]
</script>
