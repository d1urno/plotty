<script setup lang="ts">
import GenericModal from '@/components/GenericModal.vue'
import {
  MAX_CHAPTERS,
  MAX_GENRES,
  StoryGenre,
  StoryLength,
  StoryMode,
  StoryStructure,
  StoryStyle
} from '@/constants/rules'
import SwitcherInput from '@/components/form/SwitcherInput.vue'
import DropdownInput from '@/components/form/DropdownInput.vue'
import NumberInput from '@/components/form/NumberInput.vue'
import TextInput from '@/components/form/TextInput.vue'
import CheckInput from '@/components/form/CheckInput.vue'
import MultiSelectInput from '@/components/form/MultiSelectInput.vue'
import { storeToRefs } from 'pinia'
import useStore from '@/stores'

const model = defineModel<{ visible: boolean }>()

const emit = defineEmits<{
  openWizard: []
  generateStory: []
}>()

const { storyFormData, apiKey } = storeToRefs(useStore())

function isGenreDisabled(genre: StoryGenre) {
  if (
    storyFormData.value.storyGenres.length === MAX_GENRES &&
    !storyFormData.value.storyGenres.includes(genre)
  )
    return true
  switch (genre) {
    case StoryGenre.FANTASY:
      return storyFormData.value.storyGenres.includes(StoryGenre.SCI_FI)
    case StoryGenre.SCI_FI:
      return storyFormData.value.storyGenres.includes(StoryGenre.FANTASY)
    case StoryGenre.HISTORICAL:
      return storyFormData.value.storyGenres.includes(StoryGenre.FUTURISTIC)
    case StoryGenre.FUTURISTIC:
      return storyFormData.value.storyGenres.includes(StoryGenre.HISTORICAL)
    default:
      return false
  }
}

function onStoryStructureChange(mode: StoryStructure) {
  if (mode === StoryStructure.OPEN_ENDING) storyFormData.value.totalChapters = 0
  else if (mode === StoryStructure.SIMPLE) storyFormData.value.totalChapters = 1
  else storyFormData.value.totalChapters = 3
}

function onGenerateStory(close: () => void) {
  close()
  emit('generateStory')
}
</script>

<template>
  <GenericModal
    v-if="model"
    v-model="model.visible"
    max-width-class="max-w-3xl"
    @close="model = undefined"
  >
    <template #title>
      <div class="flex items-center justify-between">
        <h1 class="text-lg font-bold">Story settings</h1>
        <button
          class="text-sm font-bold text-blue-500 underline"
          type="button"
          @click="$emit('openWizard')"
        >
          Use story wizard
        </button>
      </div>
    </template>

    <div class="grid grid-cols-4 gap-6 py-2 md:grid-cols-6">
      <SwitcherInput
        v-model="storyFormData.storyStructure"
        label="Structure"
        :options="
          Object.values(StoryStructure).map((structure) => ({ label: structure, value: structure }))
        "
        class="col-span-4 mx-auto w-full md:col-span-3"
        @update:model-value="onStoryStructureChange"
      />

      <SwitcherInput
        v-model="storyFormData.storyLength"
        :label="
          storyFormData.storyStructure !== StoryStructure.SIMPLE
            ? 'Reading time per chapter'
            : 'Reading time'
        "
        :options="Object.values(StoryLength).map((len) => ({ label: len.slice(0, 5), value: len }))"
        class="col-span-3 mx-auto w-full md:col-span-2"
      />

      <NumberInput
        v-if="storyFormData.storyStructure === StoryStructure.MULTI_CHAPTER"
        v-model="storyFormData.totalChapters"
        label="Chapters"
        class="w-20"
        :max="MAX_CHAPTERS"
        :min="2"
      />

      <div class="col-span-4 grid grid-cols-2 gap-6">
        <DropdownInput
          v-model="storyFormData.storyStyle"
          label="Style"
          class="col-span-1 w-full"
          :options="Object.values(StoryStyle).map((style) => ({ label: style, value: style }))"
        />

        <MultiSelectInput
          v-model="storyFormData.storyGenres"
          :options="
            Object.values(StoryGenre).map((genre) => ({
              label: genre,
              value: genre,
              disabled: isGenreDisabled(genre)
            }))
          "
          class="col-span-1 w-full"
          multiple
          label="Genres"
        />
      </div>

      <CheckInput
        v-if="storyFormData.storyStructure !== StoryStructure.SIMPLE"
        v-model="storyFormData.storyMode"
        label="Decision Making Mode"
        tag-style
        class="col-span-4 mx-auto mb-1 mt-auto md:col-span-2"
        :options="[StoryMode.NORMAL, StoryMode.DECISION_MAKING]"
      />

      <TextInput
        v-model="storyFormData.customInstructions"
        label="Special instructions"
        type="textarea"
        placeholder="Special instructions for the AI, e.g. tone, extra characters, situations to cover, etc."
        rows="4"
        class="col-span-4 md:col-span-6"
      />

      <TextInput
        v-model="apiKey"
        label="API Key"
        class="col-span-4 md:col-span-6"
        placeholder="Enter key"
        :class="{ 'border-red-500/75': !apiKey }"
      >
        <template #label>
          OpenAI API key, get one
          <a
            class="text-blue-500 underline"
            href="https://beta.openai.com/account/api-keys"
            target="_blank"
            rel="noopener noreferrer"
          >
            here
          </a>
        </template>
      </TextInput>
    </div>

    <template #footer="{ close }">
      <div class="flex justify-end gap-4">
        <button class="rounded-md px-10 py-2 font-bold text-gray-600" type="button" @click="close">
          Close
        </button>
        <button
          type="button"
          class="rounded-md bg-blue-500 px-7 py-2 font-bold text-white hover:bg-blue-700"
          @click="onGenerateStory(close)"
        >
          Generate story
        </button>
      </div>
    </template>
  </GenericModal>
</template>
