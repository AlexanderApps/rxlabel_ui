<template>
  <router-view />
  <AlertsStack />
</template>

<script setup>
import AlertsStack from './components/AlertsStack.vue'
</script>

<style scoped>
  html,
body,
#app {
  height: 100%;
}
</style>
