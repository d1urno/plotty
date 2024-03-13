<script setup lang="ts">
import { onMounted } from 'vue'
import AppLink from '@/components/AppLink.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

export interface GenericToast {
  id: string
  timestamp: number
  content: string
  type: 'success' | 'info' | 'error' | 'loading'
  duration?: number
  closable?: boolean
  buttons?: {
    label: string
    callbackOrLink: ((close: () => void) => void) | string
  }[]
}

let timeoutId: NodeJS.Timeout

const props = defineProps<{
  toast: GenericToast
}>()

const emit = defineEmits<{
  close: []
}>()

function close() {
  emit('close')
  if (timeoutId) clearTimeout(timeoutId) // Clear the timeout when the toast is manually hidden
}

onMounted(() => {
  if (props.toast.duration) timeoutId = setTimeout(close, props.toast.duration)
})
</script>

<template>
  <div
    class="m-6 flex items-center gap-4 rounded-lg p-4 text-white"
    :class="{
      'bg-blue-500': toast.type === 'info' || toast.type === 'loading',
      'bg-red-500': toast.type === 'error',
      'bg-green-500': toast.type === 'success'
    }"
  >
    <LoadingSpinner v-if="toast.type === 'loading'" class="*:bg-white" />
    <p v-html="toast.content" />
    <button
      v-if="toast.closable"
      class="rounded-md border-2 border-white px-2 py-1 text-xs font-semibold text-white"
      type="button"
      @click="close"
    >
      {{ $t('GenericToast.buttons.close') }}
    </button>
    <template v-for="button in toast.buttons" :key="button.label">
      <button
        v-if="typeof button.callbackOrLink !== 'string'"
        class="rounded-md border-2 border-white px-2 py-1 text-xs font-semibold text-white"
        type="button"
        @click="button.callbackOrLink(close)"
      >
        {{ button.label }}
      </button>

      <AppLink
        v-else
        class="block rounded-md border-2 border-white px-2 py-1 text-xs font-semibold text-white"
        :to="button.callbackOrLink"
      >
        {{ button.label }}
      </AppLink>
    </template>
  </div>
</template>
