<script setup lang="ts">
import GenericModal from '@/components/GenericModal.vue'

const model = defineModel<{ visible: boolean }>()
const apiKeyModel = defineModel<string>('apiKeyModel')
</script>

<template>
  <GenericModal v-if="model" v-model="model.visible" @close="model = undefined">
    <template #title><h1 class="text-lg font-bold">API key not found</h1></template>

    <p class="mb-6 text-gray-800">
      An OpenAI API key is required to generate stories. <br />
      Please enter a valid key, we will only store it in your browser for now.
      <br /><br />
      You can create an API key from your
      <a
        class="text-blue-500 underline"
        href="https://beta.openai.com/account/api-keys"
        target="_blank"
        rel="noopener noreferrer"
      >
        OpenAI account
      </a>
    </p>

    <label>
      <span class="text-xs font-semibold">OpenAI API key</span>
      <input
        v-model="apiKeyModel"
        placeholder="Enter key"
        class="mt-1 w-full rounded-md border-2 border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-teal-500"
        :class="{ 'border-red-500/75': !apiKeyModel }"
      />
    </label>

    <template #footer="{ close }">
      <div class="flex justify-end">
        <button
          type="button"
          class="rounded-md bg-blue-500 px-10 py-2 font-bold text-white"
          @click="close"
        >
          Ok
        </button>
      </div>
    </template>
  </GenericModal>
</template>
