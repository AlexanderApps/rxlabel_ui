<template>
  <div
    class="label-card h-58.75 bg-(--card-bg) border border-(--border-color) rounded-md shadow-[0_1px_3px_var(--border-color)] flex flex-col overflow-hidden"
    :data-card-id="labelData.id"
  >
    <div
      class="label-header h-13 font-semibold border-b border-(--border-color) text-center whitespace-nowrap overflow-hidden"
    >
      <div class="company">{{ facility }}</div>
      <div class="address text-[10px] font-medium text-center whitespace-nowrap overflow-hidden">
        {{ address }}
      </div>
      <div class="contact text-[10px] font-medium text-center whitespace-nowrap overflow-hidden">
        {{ contact }}
      </div>
    </div>

    <div
      class="label-title h-7 leading-7 text-[14px] font-semibold border-b border-(--border-color) text-center whitespace-nowrap overflow-hidden px-1.5 focus:outline-none focus:bg-black/10"
      contenteditable="true"
      @blur="handleTitleChange"
    >
      {{ labelData.product }}
    </div>

    <div
      class="label-directions h-13.75 p-[4px_8px] text-[12px] leading-[1.2] overflow-hidden text-ellipsis"
      contenteditable="true"
      @blur="handleDirectionsChange"
    >
      {{ labelData.instructions }}
    </div>

    <div class="row-two">
      <div>
        <strong>Name:</strong>
        <input type="text" name="patient" :value="clientName" @input="handlePatientChange" />
      </div>

      <div>
        <strong>Disp. by:</strong>
        <input type="text" name="user" :value="userName" @input="handleUserChange" />
      </div>
    </div>

    <div class="label-timestamp">
      {{ currentDate }}
    </div>

    <div class="label-warning" contenteditable="true" @blur="handleWarningChange">
      Avoid alcohol and keep away from children
    </div>

    <div class="button-controls">
      <button class="btn btn-sm btn-danger btn-remove" @click="$emit('remove', labelData.product)">
        Remove
      </button>
      <button class="btn btn-sm btn-warning btn-update" @click="$emit('update', labelData.product)">
        Update
      </button>
      <button
        class="btn btn-sm btn-info btn-queue"
        @click="$emit('add-to-queue', labelData.product)"
      >
        Add to Queue
      </button>
      <button class="btn btn-sm btn-primary btn-print" @click="$emit('print', labelData.product)">
        Print
      </button>
    </div>
  </div>
</template>

<script setup>
// 1. Assign defineProps to a constant to access them in functions
const props = defineProps({
  labelData: {
    type: Object,
    required: false,
    default: () => ({
      product: '',
      product_name: '',
      direction: ''
    })
  },
  facility: { type: String, default: '' },
  address: { type: String, default: '' },
  contact: { type: String, default: '' },
  clientName: { type: String, default: '' },
  userName: { type: String, default: '' },
  currentDate: { type: String, default: '' }
})

const emit = defineEmits([
  'remove',
  'update',
  'add-to-queue',
  'print',
  'title-change',
  'directions-change',
  'warning-change',
  'patient-change',
  'user-change'
])

// 2. Use props.labelData to access properties inside script logic
function handleTitleChange(event) {
  emit('title-change', {
    product: props.labelData.product,
    value: event.target.textContent
  })
}

function handleDirectionsChange(event) {
  emit('directions-change', {
    product: props.labelData.product,
    value: event.target.textContent
  })
}

function handleWarningChange(event) {
  emit('warning-change', {
    product: props.labelData.product,
    value: event.target.textContent
  })
}

function handlePatientChange(event) {
  emit('patient-change', {
    product: props.labelData.product,
    value: event.target.value
  })
}

function handleUserChange(event) {
  emit('user-change', {
    product: props.labelData.product,
    value: event.target.value
  })
}
</script>

<style scoped>
input {
  border: none;
  padding: 0;
  margin: 0;
  background-color: transparent;
  font: inherit;
}

input:focus {
  outline: none;
  box-shadow: 0 0 0 1px var(--border-color);
}

/* .label-card {
  height: 235px;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  box-shadow: 0 1px 3px var(--border-color);
  display: flex;
  flex-direction: column;
  overflow: hidden;
} */

/* .label-header {
  height: 52px;
  font-weight: 600;
  border-bottom: 1px solid var(--border-color);
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
} */

/* .address,
.contact {
  font-size: 10px;
  font-weight: 500;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
} */

/* .label-title {
  height: 28px;
  line-height: 28px;
  font-size: 14px;
  font-weight: 600;
  border-bottom: 1px solid var(--border-color);
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  padding: 0 6px;
}

.label-title:focus {
  outline: none;
  background-color: rgba(0, 0, 0, 0.08);
} */
/*
.label-directions {
  height: 55px;
  padding: 4px 8px;
  font-size: 12px;
  line-height: 1.2;
  overflow: hidden;
  text-overflow: ellipsis;
} */

.row-two {
  height: 28px;
  display: flex;
  border-bottom: 1px solid var(--border-color);
  font-size: 12px;
}

.row-two > div {
  flex: 1;
  padding: 3px 6px;
  display: flex;
  align-items: center;
  gap: 6px;
  border-right: 1px solid var(--border-color);
  white-space: nowrap;
  overflow: hidden;
}

.row-two > div:last-child {
  border-right: none;
}

.row-two strong {
  flex-shrink: 0;
}

.row-two input {
  display: inline-block;
  width: 100px;
  max-width: 100px;
  white-space: nowrap;
  overflow: hidden;
}

.label-timestamp {
  line-height: 8px;
  font-size: 10px;
  padding: 3px 8px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.label-warning {
  height: 22px;
  padding: 3px 8px;
  font-size: 11px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.button-controls {
  height: 38px;
  padding: 6px;
  display: flex;
  gap: 6px;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid var(--border-color);
  background: var(--modal-bg);
  box-sizing: border-box;
}

.button-controls .btn {
  flex: 1 1 auto;
  min-width: 0;
  padding: 6px 8px;
  font-size: 12px;
}

.button-controls .btn + .btn {
  margin-left: 6px;
}

@media print {
  .button-controls {
    display: none !important;
  }

  .label-card {
    box-shadow: none !important;
  }
}
</style>
