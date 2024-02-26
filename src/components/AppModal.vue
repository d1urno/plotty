<script setup lang="ts">
import GenericModal from '@/components/GenericModal.vue'
import { storeToRefs } from 'pinia'
import { useStore } from '@/stores'

export interface AppModal {
  visible?: boolean
  title: string
  content?: string
  input?: string
  closable?: boolean
  maxWidthClass?: string
  buttons: {
    label: string
    type: 'success' | 'warning' | 'info'
    callback: (close: () => void, input?: string) => void
  }[]
}

const { appModal } = storeToRefs(useStore())
</script>

<template>
  <GenericModal
    v-if="appModal"
    v-model="appModal.visible"
    :max-width-class="appModal.maxWidthClass"
    @close="appModal = undefined"
  >
    <template #title><h1 class="text-lg font-bold" v-html="appModal.title"></h1></template>

    <p v-if="appModal.content" v-html="appModal.content"></p>

    <label v-if="appModal.input !== undefined" class="mt-5 block w-[40rem] max-w-full">
      <textarea
        v-model="appModal.input"
        rows="10"
        class="mt-1 w-full rounded-md border-2 border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-teal-500"
        :class="{ 'border-red-500/75': !appModal.input }"
      />
    </label>

    <template #footer="{ close }">
      <div class="flex justify-end gap-4">
        <button
          v-if="appModal.closable"
          type="button"
          class="rounded-md bg-gray-200 px-6 py-2 font-semibold text-gray-500"
          @click="close"
        >
          Close
        </button>
        <button
          v-for="button in appModal.buttons"
          :key="button.label"
          type="button"
          class="rounded-md px-10 py-2 font-bold text-white"
          :class="{
            'bg-blue-500': button.type === 'info',
            'bg-red-500': button.type === 'warning',
            'bg-blue-400': button.type === 'success'
          }"
          @click="button.callback(close, appModal.input)"
        >
          {{ button.label }}
        </button>
      </div>
    </template>
  </GenericModal>
</template>
