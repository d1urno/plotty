<script setup lang="ts">
import GenericModal from '@/components/GenericModal.vue'

const model = defineModel<{ visible: boolean; callback?: () => void }>()
const apiKeyModel = defineModel<string>('apiKeyModel')

function onOkClick(close: () => void) {
  close()
  if (model.value?.callback) model.value.callback()
}
</script>

<template>
  <GenericModal v-if="model" v-model="model.visible" @close="model = undefined">
    <template #title>
      <h1 class="text-lg font-bold">{{ $t('ApiKeyModal.title') }}</h1>
    </template>

    <p class="mb-6 text-gray-800">
      {{ $t('ApiKeyModal.text1') }}<br />
      {{ $t('ApiKeyModal.text2') }}<br /><br />
      {{ $t('ApiKeyModal.text3') }}
      <a
        class="text-blue-500 underline"
        href="https://beta.openai.com/account/api-keys"
        target="_blank"
        rel="noopener noreferrer"
      >
        {{ $t('ApiKeyModal.text4') }}
      </a>
    </p>

    <label>
      <span class="text-xs font-semibold">{{ $t('ApiKeyModal.inputs.apiKey.label') }}</span>
      <input
        v-model="apiKeyModel"
        :placeholder="$t('ApiKeyModal.inputs.apiKey.placeholder')"
        class="mt-1 w-full rounded-md border-2 border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-teal-500"
        :class="{ 'border-red-500/75': !apiKeyModel }"
      />
    </label>

    <template #footer="{ close }">
      <div class="flex justify-end">
        <button
          type="button"
          class="rounded-md bg-blue-500 px-10 py-2 font-bold text-white disabled:opacity-50"
          :disabled="!apiKeyModel"
          @click="onOkClick(close)"
        >
          {{ $t('ApiKeyModal.buttons.ok') }}
        </button>
      </div>
    </template>
  </GenericModal>
</template>
