<script setup lang="ts">
import { onMounted } from 'vue'
import AppLink from '@/components/AppLink.vue'

export interface GenericToast {
  id: string
  timestamp: number
  content: string
  type: 'success' | 'info' | 'error'
  duration?: number
  closable?: boolean
  buttons?: {
    label: string
    callbackOrLink: ((close: () => void) => void) | string
  }[]
}

let timeoutId: NodeJS.Timeout

const props = defineProps<{
  type: 'info' | 'success' | 'error'
  duration?: number
  closable?: boolean
  buttons?: {
    label: string
    callbackOrLink: ((close: () => void) => void) | string
  }[]
}>()

const emit = defineEmits<{
  close: []
}>()

function close() {
  emit('close')
  if (timeoutId) clearTimeout(timeoutId) // Clear the timeout when the toast is manually hidden
}

onMounted(() => {
  if (props.duration) timeoutId = setTimeout(close, props.duration)
})
</script>

<template>
  <div
    class="m-6 flex items-center gap-4 rounded-lg p-4 text-white"
    :class="{
      'bg-blue-500': type === 'info',
      'bg-red-500': type === 'error',
      'bg-green-500': type === 'success'
    }"
  >
    <slot :close="close" />
    <button
      v-if="closable"
      class="rounded-md border-2 border-white px-2 py-1 text-xs font-semibold text-white"
      type="button"
      @click="close"
    >
      Close
    </button>
    <template v-for="button in buttons" :key="button.label">
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
