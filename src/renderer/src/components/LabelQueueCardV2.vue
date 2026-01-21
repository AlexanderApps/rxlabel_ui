<template>
  <div
    class="block h-71 max-w-sm border border-gray-300/60 dark:border dark:border-gray-700/60 rounded-lg shadow-xs dark:bg-gray-800 dark:text-gray-100"
  >
    <!-- Title -->
    <div
      class="flex w-full rounded-t-lg justify-center items-center border-b border-b-gray-300/60 dark:border-b-gray-700/60 text-lg font-bold"
    >
      <input
        v-model="label.product"
        type="text"
        class="w-full h-8 ps-1 text-center focus:outline focus:outline-blue-500/50 block"
      />
    </div>

    <!-- Directions -->
    <div>
      <div class="h-24 mb-2 border-b border-b-gray-300/60 dark:border-b-gray-700/60">
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
            type="text"
            class="border border-gray-300/60 dark:border-gray-500/60 w-30 h-6 ps-1 focus:outline focus:outline-blue-500/50 block rounded-xs"
            :value="clientName"
          />
        </div>
        <div class="flex gap-1">
          <strong>Disp. by:</strong>
          <input
            v-model="label.dispensedBy"
            type="text"
            class="border border-gray-300/60 dark:border-gray-500/60 w-20 h-6 ps-1 focus:outline focus:outline-blue-500/50 block rounded-xs"
          />
        </div>
      </div>

      <!-- Timestamp -->
      <div class="px-2 pb-1 text-sm">
        <strong>{{ currentDate }}</strong>
      </div>

      <!-- Warnings -->
      <div class="h-11 border-y border-y-gray-300/60 dark:border-y-gray-700/60">
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

<script setup>
import Button from './Button.vue'

const label = defineModel({ type: Object, required: true })
defineProps({
  currentDate: { type: String, required: true },
  clientName: { type: String, required: false }
})

defineEmits(['remove', 'update', 'queue', 'print'])

// Configure action buttons declaratively
const actions = [
  { label: 'Remove', event: 'remove', color: 'red' },
  // { label: 'Update', event: 'update', color: 'yellow' },
  // { label: 'Add To Queue', event: 'queue', color: 'green' },
  { label: 'Print', event: 'print', color: 'blue' }
]
</script>
