<template>
  <div class="fixed top-0 left-0 h-14 w-full shadow-sm flex items-center px-5 mb-4">
    <div class="font-bold text-lg">
      <span>Medication Label</span>
      <span class="bg-danger-soft text-fg-danger-strong text-xs font-medium px-1.5 py-0.5 rounded"
        >Queue: 5</span
      >
    </div>

    <!-- <div class="flex-none">
      <button class="btn btn-square btn-ghost">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
          class="inline-block h-5 w-5 stroke-current">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z">
          </path>
        </svg>
      </button>
    </div> -->
  </div>
  <div
    class="label-container fixed top-14 left-0 w-full h-[calc(100vh-3.5rem)] overflow-auto grid grid-cols-[repeat(auto-fill,350px)] gap-7.5 p-5 justify-center"
  >
    <LabelCard
      v-for="item in labels"
      :key="item.id"
      :label-data="item"
      :facility="settings.facility_name"
      :address="settings.facility_address"
      :contact="settings.facility_contact"
      :client-name="clientName"
      :user-name="userName"
      :current-date="curDate"
      @remove="handleRemove"
      @update="handleUpdate"
      @add-to-queue="addLabel"
      @print="handlePrint"
      @title-change="handleTitleChange"
      @directions-change="handleDirectionsChange"
      @warning-change="handleWarningChange"
      @patient-change="handlePatientChange"
      @user-change="handleUserChange"
    />
  </div>
</template>

<script setup>
import LabelCard from './components/LabelCard.vue'
import { ref, onMounted, watchEffect } from 'vue'

// 1. Define reactive state
const labels = ref([])
const search = ref('')
const settings = ref({ facility_name: '', facility_address: '' })
const clientName = ref('')
const userName = ref('')
const curDate = ref(new Date().toLocaleDateString())

// 2. Fetch Data
const fetchSettings = async () => {
  const data = await window.api.getSettings()
  if (data) settings.value = data
}

const loadLabels = async () => {
  labels.value = await window.api.getLabels(search.value)
}

// 3. Lifecycle hooks
onMounted(() => {
  fetchSettings()
  loadLabels()
})

// 4. Reactive Search
watchEffect(() => {
  loadLabels()
})

// 5. Handlers
const addLabel = async () => {
  // Example of adding a label via API
  await window.api.createLabel(
    'New Medication',
    'Follow prescribed directions',
    'Consult a healthcare professional with any questions'
  )
  await loadLabels()
}

function handleRemove(productId) {
  console.log('Remove:', productId)
}
function handleUpdate(productId) {
  console.log('Update:', productId)
}
function handlePrint(productId) {
  console.log('Print:', productId)
}
function handleTitleChange({ product, value }) {
  console.log('Title changed:', product, value)
}
function handleDirectionsChange({ product, value }) {
  console.log('Directions changed:', product, value)
}
function handleWarningChange({ product, value }) {
  console.log('Warning changed:', product, value)
}
function handlePatientChange({ product, value }) {
  console.log('Patient changed:', product, value)
}
function handleUserChange({ product, value }) {
  console.log('User changed:', product, value)
}
</script>

<style>
/* .label-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, 350px);
  gap: 30px;
  padding: 20px;
  justify-content: center;
} */
</style>
<!--
<script setup>
import LabelCard from './components/LabelCard.vue'
import { ref, onMounted, watchEffect } from 'vue'

// 1. Define reactive state
const labels = ref([])
const search = ref('')
const settings = ref({ facility_name: '', facility_address: '' })
const clientName = ref('')
const userName = ref('')
const curDate = ref(new Date().toLocaleDateString())

// 2. Fetch Data
const fetchSettings = async () => {
  const data = await window.api.getSettings()
  if (data) settings.value = data
}

const loadLabels = async () => {
  labels.value = await window.api.getLabels(search.value)
}

// 3. Lifecycle hooks
onMounted(() => {
  fetchSettings()
  loadLabels()
})

// 4. Reactive Search
watchEffect(() => {
  loadLabels()
})

// 5. Handlers
const addLabel = async () => {
  // Example of adding a label via API
  await window.api.createLabel(
    'New Medication',
    'Follow prescribed directions',
    'Consult a healthcare professional with any questions'
  )
  await loadLabels()
}

function handleAddToQueue(productId) {
  console.log('Adding to queue:', productId)
}

function handleRemove(productId) {
  console.log('Remove:', productId)
}

function handleUpdate(productId) {
  console.log('Update:', productId)
}

function handlePrint(productId) {
  console.log('Print:', productId)
}

// Event payloads from LabelCard
function handleTitleChange({ product, value }) {
  console.log('Title changed:', product, value)
}

function handleDirectionsChange({ product, value }) {
  console.log('Directions changed:', product, value)
}

function handleWarningChange({ product, value }) {
  console.log('Warning changed:', product, value)
}

function handlePatientChange({ product, value }) {
  clientName.value = value
  console.log('Patient:', value)
}

function handleUserChange({ product, value }) {
  userName.value = value
  console.log('User:', value)
}
</script> -->
