import { ref, computed } from 'vue'

const queueCount = ref(0)

export function useQueueCount() {
  const getQueueCount = async () => {
    queueCount.value = await window.api.countQueue()
  }

  const badgeType = computed(() => {
    return queueCount.value ? 'info' : 'danger'
  })

  return {
    queueCount,
    badgeType,

    getQueueCount
  }
}
