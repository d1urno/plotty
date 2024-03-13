import { storeToRefs } from 'pinia'
import { useStore } from '@/stores'
import type { GenericToast } from '@/components/GenericToast.vue'
import { generateUniqueId } from '@/utils'

export default function useToast() {
  const { appToasts } = storeToRefs(useStore())

  function showToast(toast: Omit<GenericToast, 'id' | 'timestamp'>) {
    const id = generateUniqueId()
    if (!appToasts.value) appToasts.value = []
    appToasts.value.push({
      id,
      timestamp: Date.now(),
      closable: false,
      duration: 3000,
      ...toast
    })
    return id
  }

  function hideToast(id: string) {
    if (!appToasts.value) return
    const toastIndex = appToasts.value.findIndex((t) => t.id === id)
    appToasts.value.splice(toastIndex, 1)
  }

  return {
    showToast,
    hideToast
  }
}
