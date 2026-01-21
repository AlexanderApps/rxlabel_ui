<template>
  <div>Settings</div>
  <button @click="goToLabel">Go to Label</button>
</template>
<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function goToLabel() {
  router.push({ name: 'MedicationLabel' })
}
</script>
