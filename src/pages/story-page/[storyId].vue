<script setup lang="ts">
import { useStore } from '@/stores'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import useCharacterListByIds from '@/composables/useCharacterListByIds'
import CharacterSelectionList from '@/components/CharacterSelectionList.vue'
import CharacterDetailsModal from '@/components/CharacterDetailsModal.vue'
import { useDateFormat } from '@vueuse/core'
import { useRoute } from 'vue-router'
import useContinuationAi from '@/composables/useContinuationAi'
import useModal from '@/composables/useModal'
import ApiKeyModal from '@/components/ApiKeyModal.vue'
import type { BaseCharacter } from '@/types/local'
import getGenreImg from '@/functions/getGenreImg'
import StoryChapter from '@/components/StoryChapter.vue'

const route = useRoute<'/story/[storyId]'>()
const storyId = computed(() => route.params.storyId)

const { stories, apiKey } = storeToRefs(useStore())
const story = computed(() => stories.value.find((s) => s.id === storyId.value))

const variables = computed(
  () =>
    (story.value && { ids: [...story.value.mainCharacters, ...story.value.secondaryCharacters] }) ??
    undefined
)
const { characterList, loading } = useCharacterListByIds(variables)
const { getContinuationPrompt, generateContinuation, isPromptLoading, isAiLoading } =
  useContinuationAi(storyId)
const { showModal } = useModal()

const bgClass = computed(() => {
  if (story.value) return getGenreImg(story.value.storyGenres[0], true)
  return ''
})

const createdDate = useDateFormat(new Date(story.value?.created ?? ''), 'HH:mm, MMMM D, YYYY').value

const apiKeyModal = ref<{ visible: boolean }>()
const characterModal = ref<{ visible: boolean; character: BaseCharacter }>()

function onCardClick(character: BaseCharacter) {
  characterModal.value = { visible: true, character }
}

async function onApplyContinuation(args: { choiceIndex?: number; customChoice?: string }) {
  try {
    const prompt = await getContinuationPrompt(args.choiceIndex, args.customChoice)
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
            callbackOrLink: async (close, output) => {
              if (!output) return
              close()
              await generateContinuation(output, route.path, args.choiceIndex, args.customChoice)
            }
          }
        ]
      })
    } else {
      await generateContinuation(prompt, route.path, args.choiceIndex, args.customChoice)
    }
  } catch (error) {
    if (error instanceof Error && error.message === 'API key not found') {
      apiKeyModal.value = { visible: true }
    } else console.error(error)
  }
}

async function revertDecision(chapterIndex: number) {
  if (!story.value) return
  story.value.chapters[chapterIndex].selectedChoiceIndex = undefined
  story.value.chapters[chapterIndex].customChoice = undefined
  story.value.chapters = story.value.chapters.slice(0, chapterIndex + 1)
  stories.value = stories.value.map((s) => (s.id === story.value?.id ? story.value : s))
}

function onDecisionRevert(chapterIndex: number) {
  showModal({
    title: 'Revert to this decision',
    content:
      'Are you sure you want to revert back to this decision? This action will delete all chapters after this one, and cannot be undone.',
    buttons: [
      {
        label: 'Revert',
        type: 'warning',
        callbackOrLink: async (close) => {
          close()
          await revertDecision(chapterIndex)
        }
      }
    ]
  })
}
</script>

<template>
  <div class="flex h-full flex-col overflow-y-auto bg-cover bg-top" :class="bgClass">
    <div
      v-if="story"
      class="container flex flex-col items-center gap-10 pb-20 pt-16 xl:flex-row xl:items-start xl:px-10"
    >
      <div
        class="xl:order-0 order-1 flex h-min max-w-xl basis-1/3 flex-col gap-10 rounded-md bg-white/80 p-4 ring-2 ring-gray-500 ring-offset-4"
      >
        <div>
          <h2 class="mb-4 text-left text-xl font-bold">Main roles</h2>
          <CharacterSelectionList
            cache-only
            :loading="loading"
            :selected-character-ids="story.mainCharacters"
            :highlighted-character-ids="story.decisionMakers"
            highlight-color="orange"
            readonly
            @click="onCardClick"
          />
        </div>

        <div v-if="story.secondaryCharacters.length">
          <h2 class="mb-4 text-left text-xl font-bold">Secondary roles</h2>
          <CharacterSelectionList
            cache-only
            :loading="loading"
            :selected-character-ids="story.secondaryCharacters"
            readonly
            @click="onCardClick"
          />
        </div>

        <time class="block text-xs text-gray-500">Created at {{ createdDate }}</time>
      </div>

      <div
        class="order-0 mx-auto flex max-w-3xl flex-col rounded-md bg-white/80 px-6 py-6 ring-2 ring-gray-500 ring-offset-4 xl:order-1 xl:px-10 xl:py-16"
      >
        <article class="prose prose-lg mx-auto max-w-3xl font-garamond prose-p:font-sans">
          <h1 class="mb-16 text-center text-blue-600">{{ story.title }}</h1>
          <StoryChapter
            v-for="(chapter, i) in story.chapters"
            :key="chapter.id"
            :story-id="story.id"
            :chapter="chapter"
            :index="i + 1"
            :is-loading="isPromptLoading || isAiLoading"
            :character-list="characterList"
            @decision-revert="onDecisionRevert(i)"
            @apply-continuation="onApplyContinuation"
            @character-thumb-click="onCardClick"
          />
        </article>
      </div>
    </div>

    <CharacterDetailsModal
      v-if="characterModal"
      v-model="characterModal"
      :character="characterModal.character"
    />

    <ApiKeyModal v-if="apiKeyModal" v-model="apiKeyModal" v-model:api-key-model="apiKey" />
  </div>
</template>
