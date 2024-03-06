<script setup lang="ts">
import GenericModal from '@/components/GenericModal.vue'
import {
  MAX_CHAPTERS,
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
import WhoDecidesModal from '@/components/WhoDecidesModal.vue'
import { storeToRefs } from 'pinia'
import { useStore } from '@/stores'
import { ref } from 'vue'
import useStoryForm from '@/composables/useStoryForm'
import useStoryFormActions from '@/composables/useStoryFormActions'
import type { ListOption } from '@/types/local'
import useEnum from '@/composables/useEnum'

const model = defineModel<{ visible: boolean }>()

const emit = defineEmits<{
  openWizard: []
  generateStory: []
}>()

const { apiKey } = storeToRefs(useStore())
const { formData: storyFormData } = useStoryForm()
const { onStoryStructureSelect, onStoryModeSelect, onGenreSelect, isGenreDisabled } =
  useStoryFormActions()

const whoDecidesModal = ref<{ visible: boolean }>()

function onModeChange(modeOption: ListOption<StoryMode>) {
  onStoryModeSelect(modeOption.value)
  if (
    modeOption.value === StoryMode.DECISION_MAKING &&
    storyFormData.value.mainCharacters.length > 1
  )
    whoDecidesModal.value = { visible: true }
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
        <h1 class="text-lg font-bold">{{ $t('StorySettingsModal.title') }}</h1>
        <button
          class="text-sm font-bold text-blue-500 underline"
          type="button"
          @click="$emit('openWizard')"
        >
          {{ $t('StorySettingsModal.buttons.wizard') }}
        </button>
      </div>
    </template>

    <div class="grid grid-cols-4 gap-6 py-2 md:grid-cols-6">
      <SwitcherInput
        :model-value="storyFormData.storyStructure"
        :label="$t('StorySettingsModal.inputs.structure.label')"
        :options="useEnum(StoryStructure).toOptions()"
        class="col-span-4 mx-auto w-full md:col-span-3"
        @update:model-value="onStoryStructureSelect"
      />

      <SwitcherInput
        v-model="storyFormData.storyLength"
        :label="
          storyFormData.storyStructure !== StoryStructure.SIMPLE
            ? $t('StorySettingsModal.inputs.length.perChapterLabel')
            : $t('StorySettingsModal.inputs.length.label')
        "
        :options="useEnum(StoryLength).toOptions()"
        class="col-span-3 mx-auto w-full md:col-span-2"
      />

      <NumberInput
        v-if="storyFormData.storyStructure === StoryStructure.MULTI_CHAPTER"
        v-model="storyFormData.totalChapters"
        :label="$t('StorySettingsModal.inputs.chapters.label')"
        class="w-20"
        :max="MAX_CHAPTERS"
        :min="2"
      />

      <div class="col-span-4 grid grid-cols-2 gap-6">
        <DropdownInput
          v-model="storyFormData.storyStyle"
          :label="$t('StorySettingsModal.inputs.style.label')"
          class="col-span-1 w-full"
          :options="useEnum(StoryStyle).toOptions()"
        />

        <MultiSelectInput
          :model-value="useEnum(StoryGenre).toOptions(storyFormData.storyGenres)"
          :placeholder-value="StoryGenre.AI"
          :options="
            useEnum(StoryGenre).toOptions({
              excludeValues: [StoryGenre.AI],
              extraProps: (_, value) => ({ disabled: isGenreDisabled(value) })
            })
          "
          class="col-span-1 w-full"
          multiple
          :label="$t('StorySettingsModal.inputs.genres.label')"
          @update:model-value="onGenreSelect($event.map((g: ListOption<StoryGenre>) => g.value))"
        />
      </div>

      <CheckInput
        v-if="storyFormData.storyStructure !== StoryStructure.SIMPLE"
        :model-value="useEnum(StoryMode).toOption(storyFormData.storyMode)"
        :label="$t('StorySettingsModal.inputs.mode.label')"
        tag-style
        color="orange"
        class="col-span-4 mx-auto mb-1 mt-auto md:col-span-2"
        :options="[
          useEnum(StoryMode).toOption(StoryMode.NORMAL),
          useEnum(StoryMode).toOption(StoryMode.DECISION_MAKING)
        ]"
        @update:model-value="onModeChange"
      />

      <TextInput
        v-model="storyFormData.customInstructions"
        :label="$t('StorySettingsModal.inputs.customInstructions.label')"
        type="textarea"
        :placeholder="$t('StorySettingsModal.inputs.customInstructions.placeholder')"
        rows="4"
        class="col-span-4 md:col-span-6"
      />

      <TextInput
        v-model="apiKey"
        :label="$t('StorySettingsModal.inputs.apiKey.label')"
        class="col-span-4 md:col-span-6"
        type="password"
        :placeholder="$t('StorySettingsModal.inputs.apiKey.placeholder')"
        :class="{ 'border-red-500/75': !apiKey }"
      >
        <template #label>
          {{ $t('StorySettingsModal.inputs.apiKey.extendedLabel.text1') }}
          <a
            class="text-blue-500 underline"
            href="https://beta.openai.com/account/api-keys"
            target="_blank"
            rel="noopener noreferrer"
          >
            {{ $t('StorySettingsModal.inputs.apiKey.extendedLabel.text2') }}
          </a>
        </template>
      </TextInput>
    </div>

    <template #footer="{ close }">
      <div class="flex justify-end gap-4">
        <button class="rounded-md px-10 py-2 font-bold text-gray-600" type="button" @click="close">
          {{ $t('StorySettingsModal.buttons.close') }}
        </button>
        <button
          type="button"
          class="rounded-md bg-blue-500 px-7 py-2 font-bold text-white hover:bg-blue-700"
          @click="onGenerateStory(close)"
        >
          {{ $t('StorySettingsModal.buttons.cta') }}
        </button>
      </div>
    </template>

    <WhoDecidesModal v-if="whoDecidesModal" v-model="whoDecidesModal" />
  </GenericModal>
</template>
