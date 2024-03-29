<script setup lang="ts">
import CharacterSelectionList from '@/components/CharacterSelectionList.vue'
import { useStore } from '@/stores'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import ApiKeyModal from '@/components/ApiKeyModal.vue'
import StorySettingsModal from '@/components/StorySettingsModal.vue'
import StoryWizardModal from '@/components/story-wizard/StoryWizardModal.vue'
import StoryFormStickyButtons from '@/components/StoryFormStickyButtons.vue'
import useCharacterListByIds from '@/composables/useCharacterListByIds'
import useStoryFormActions from '@/composables/useStoryFormActions'
import useStoryAi from '@/composables/useStoryAi'
import useModal from '@/composables/useModal'
import useStoryForm from '@/composables/useStoryForm'
import { useI18n } from 'vue-i18n'

const { isFirstTimeSettings, apiKey } = storeToRefs(useStore())
const { onRoleDrop, onRoleRemove } = useStoryFormActions()
const { getStoryPrompt, generateStory, isPromptLoading, isAiLoading } = useStoryAi()
const { t } = useI18n()
const { showModal } = useModal()
const { formData: storyFormData } = useStoryForm()

const settingsModal = ref<{ visible: boolean }>()
const wizardModal = ref<{ visible: boolean }>()
const apiKeyModal = ref<{ visible: boolean; callback: () => void }>()

const variables = computed(() => ({
  ids: [...storyFormData.value.mainCharacters, ...storyFormData.value.secondaryCharacters]
}))

const { loading } = useCharacterListByIds(variables) // To load both selections into one query

function openWizard() {
  setTimeout(() => {
    wizardModal.value = { visible: true }
  }, 100)
}

function openFirstTimeModal() {
  isFirstTimeSettings.value = false
  showModal({
    title: `<p class="text-blue-500">${t('StoryForm.modals.settingsWelcome.title')}</p>`,
    content: `<p class="font-semibold text-gray-800 text-lg">${t('StoryForm.modals.settingsWelcome.content')}</p>`,
    maxWidthClass: 'max-w-xl',
    buttons: [
      {
        label: t('StoryForm.modals.settingsWelcome.buttons.ok'),
        type: 'success',
        callbackOrLink: (close) => {
          close()
          openWizard()
        }
      }
    ]
  })
}

function onOpenSettings() {
  if (isFirstTimeSettings.value) openFirstTimeModal()
  else settingsModal.value = { visible: true }
}

function onOpenWizard() {
  if (settingsModal.value) settingsModal.value.visible = false
  openWizard()
}

async function onGenerateStory() {
  if (isFirstTimeSettings.value) {
    openFirstTimeModal()
    return
  }

  try {
    const prompt = await getStoryPrompt()
    if (!prompt) return
    if (import.meta.env.DEV) {
      showModal({
        title: 'Story prompt',
        content: 'Edit prompt before submitting',
        maxWidthClass: 'max-w-2xl',
        input: prompt,
        buttons: [
          {
            label: 'Generate story',
            type: 'success',
            callbackOrLink: async (close, editedPrompt) => {
              if (!editedPrompt) return
              close()
              await generateStory(editedPrompt)
            }
          }
        ]
      })
    } else {
      await generateStory(prompt)
    }
  } catch (error) {
    if (error instanceof Error && error.message === 'API key not found') {
      apiKeyModal.value = { visible: true, callback: onGenerateStory }
    } else console.error(error)
  }
}
</script>

<template>
  <div class="flex flex-col gap-4 lg:gap-10 lg:overflow-y-auto">
    <div class="grid h-full grid-cols-2 gap-4 lg:h-auto lg:grid-cols-1 lg:flex-col lg:gap-10">
      <CharacterSelectionList
        :label="$t('StoryForm.mainRoles.label')"
        selection-name="main-characters"
        cache-only
        :loading="loading"
        :selected-character-ids="storyFormData.mainCharacters"
        :highlighted-character-ids="storyFormData.decisionMakers"
        highlight-color="orange"
        @drop="onRoleDrop($event, 'main')"
        @click="onRoleRemove($event.id, 'main')"
      />

      <CharacterSelectionList
        :label="$t('StoryForm.secondaryRoles.label')"
        selection-name="secondary-characters"
        cache-only
        :loading="loading"
        :selected-character-ids="storyFormData.secondaryCharacters"
        @drop="onRoleDrop($event, 'secondary')"
        @click="onRoleRemove($event.id, 'secondary')"
      />
    </div>

    <StoryFormStickyButtons
      :loading="loading"
      :is-ai-loading="isPromptLoading || isAiLoading"
      :story-style="storyFormData.storyStyle"
      :disabled="!storyFormData.mainCharacters.length || loading || isPromptLoading || isAiLoading"
      @open-settings="onOpenSettings"
      @generate-story="onGenerateStory"
    />

    <StorySettingsModal
      v-if="settingsModal"
      v-model="settingsModal"
      @generate-story="onGenerateStory"
      @open-wizard="onOpenWizard"
    />

    <StoryWizardModal v-if="wizardModal" v-model="wizardModal" @generate-story="onGenerateStory" />

    <ApiKeyModal v-if="apiKeyModal" v-model="apiKeyModal" v-model:api-key-model="apiKey" />
  </div>
</template>
