import { storeToRefs } from 'pinia'
import { useStore } from '@/stores'
import type { AppModal } from '@/components/AppModal.vue'

export default function useModal() {
  const { appModal } = storeToRefs(useStore())

  function showModal(modal: Omit<AppModal, 'visible'>) {
    appModal.value = { closable: true, ...modal }
  }

  return {
    showModal
  }
}
