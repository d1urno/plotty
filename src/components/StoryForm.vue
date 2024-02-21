<script setup lang="ts">
import CharacterSelectionList from '@/components/CharacterSelectionList.vue'
import useStore from '@/stores'
import { storeToRefs } from 'pinia'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ApiKeyModal from '@/components/ApiKeyModal.vue'
import StorySettingsModal from '@/components/StorySettingsModal.vue'
import StoryFormStickyButtons from '@/components/StoryFormStickyButtons.vue'
import useCharacterListByIds from '@/composables/useCharacterListByIds'
import useCharacterSelectionActions from '@/composables/useCharacterSelectionActions'
import useStoryAi from '@/composables/useStoryAi'
import type { Story } from '@/types/local'
import useModal from '@/composables/useModal'
import defaultStoryFormData from '@/constants/defaultStoryFormData'

const route = useRoute()
const router = useRouter()
const { apiKey, storyFormData } = storeToRefs(useStore())
const { onRoleDrop, onRoleRemove } = useCharacterSelectionActions()
const { getStoryPrompt, generateStory, isPromptLoading, isAiLoading } = useStoryAi()
const { showModal } = useModal()
const settingsModal = ref<{ visible: boolean }>()
const apiKeyModal = ref<{ visible: boolean }>()

const variables = computed(() => ({
  ids: [...storyFormData.value.mainCharacters, ...storyFormData.value.secondaryCharacters]
}))

const { loading } = useCharacterListByIds(variables) // To load both selections into one query

onBeforeUnmount(() => {
  storyFormData.value = { ...defaultStoryFormData }
})

// Initialize id selections from the URL parameters
onMounted(() => {
  const { mainIds, secondaryIds } = route.query
  storyFormData.value.mainCharacters = mainIds?.toString().split(',') ?? []
  storyFormData.value.secondaryCharacters = secondaryIds?.toString().split(',') ?? []
})

// Watch for changes on id selections and update the URL
watch(
  () => route.query,
  ({ mainIds, secondaryIds }) => {
    storyFormData.value.mainCharacters = mainIds?.length ? mainIds.toString().split(',') : []
    storyFormData.value.secondaryCharacters = secondaryIds?.length
      ? secondaryIds.toString().split(',')
      : []
  }
)

function onOpenSettings() {
  settingsModal.value = { visible: true }
}

async function navigateToStory(newStory: Story) {
  if (!newStory) return
  await router.push({ path: `/story/${newStory.id}` })
}

async function onGenerateStory() {
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
            callback: async (close, editedPrompt) => {
              if (!editedPrompt) return
              close()
              await generateStory(editedPrompt, navigateToStory)
            }
          }
        ]
      })
    } else {
      await generateStory(prompt, navigateToStory)
    }
  } catch (error) {
    if (error instanceof Error && error.message === 'API key not found') {
      apiKeyModal.value = { visible: true }
    } else console.error(error)
  }
}
</script>

<template>
  <div class="flex flex-col gap-4 lg:gap-10 lg:overflow-y-auto">
    <div class="grid h-full grid-cols-2 gap-4 lg:h-auto lg:grid-cols-1 lg:flex-col lg:gap-10">
      <CharacterSelectionList
        label="Main roles"
        selection-name="main-characters"
        cache-only
        :loading="loading"
        :selected-character-ids="storyFormData.mainCharacters"
        @drop="onRoleDrop($event, 'main')"
        @click="onRoleRemove($event.id, 'main')"
      />

      <CharacterSelectionList
        label="Secondary roles"
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
    />

    <ApiKeyModal v-if="apiKeyModal" v-model="apiKeyModal" v-model:api-key-model="apiKey" />
  </div>
</template>
