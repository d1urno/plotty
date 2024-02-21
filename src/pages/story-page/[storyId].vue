<script setup lang="ts">
import useStore from '@/stores'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import useCharacterListByIds from '@/composables/useCharacterListByIds'
import CharacterSelectionList from '@/components/CharacterSelectionList.vue'
import CharacterDetailsModal from '@/components/CharacterDetailsModal.vue'
import VueMarkdown from 'vue-markdown-render'
import { useDateFormat } from '@vueuse/core'
import { useRoute, useRouter } from 'vue-router'
import type { QueriedCharacterListItem } from '@/composables/useCharacterList'
import useContinuationAi from '@/composables/useContinuationAi'
import useModal from '@/composables/useModal'
import ApiKeyModal from '@/components/ApiKeyModal.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import { StoryMode, StoryStructure } from '@/constants/rules'
import type { Story } from '@/types/local'
import getGenreImg from '@/functions/getGenreImg'

const router = useRouter()
const route = useRoute<'/story/[storyId]'>()
const storyId = computed(() => route.params.storyId)

const { stories, apiKey } = storeToRefs(useStore())
const story = computed(() => stories.value.find((s) => s.id === storyId.value))

const variables = computed(() =>
  story.value
    ? {
        ids: [...story.value.mainCharacters, ...story.value.secondaryCharacters]
      }
    : undefined
)
const { loading } = useCharacterListByIds(variables)
const { getContinuationPrompt, generateContinuation, isPromptLoading, isAiLoading } =
  useContinuationAi(storyId)
const { showModal } = useModal()

const customContinuation = ref<string>('Suddenly a dragon appeared...')

const bgClass = computed(() => {
  if (story.value) return getGenreImg(story.value.storyGenres[0], true)
  return ''
})

const createdDate = useDateFormat(new Date(story.value?.created ?? ''), 'HH:mm, MMMM D, YYYY').value

const apiKeyModal = ref<{ visible: boolean }>()
const characterModal = ref<{
  visible: boolean
  character: QueriedCharacterListItem
}>()

function onCardClick(character: QueriedCharacterListItem) {
  characterModal.value = { visible: true, character }
}

async function navigateToStory(continuedStory: Story) {
  if (!continuedStory) return
  await router.push({ path: `/story/${continuedStory.id}` })
}

async function onApplyContinuation(choiceIndex?: number, customChoice?: string) {
  try {
    const prompt = await getContinuationPrompt(choiceIndex, customChoice)
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
            callback: async (close, output) => {
              if (!output) return
              close()
              await generateContinuation(
                output,
                route.path,
                choiceIndex,
                customChoice,
                navigateToStory
              )
            }
          }
        ]
      })
    } else {
      await generateContinuation(prompt, route.path, choiceIndex, customChoice, navigateToStory)
    }
  } catch (error) {
    if (error instanceof Error && error.message === 'API key not found') {
      apiKeyModal.value = { visible: true }
    } else console.error(error)
  }
}

function onWriteCustomContinuation() {
  showModal({
    title: 'Write your own continuation',
    input: customContinuation.value,
    buttons: [
      {
        label: 'Submit',
        type: 'success',
        callback: async (close, output) => {
          if (!output) return
          close()
          await onApplyContinuation(undefined, output)
        }
      }
    ]
  })
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
        callback: async (close) => {
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

        <time class="block text-xs text-gray-500"> Created at {{ createdDate }} </time>
      </div>

      <div
        class="order-0 mx-auto flex max-w-3xl flex-col rounded-md bg-white/80 px-6 py-6 ring-2 ring-gray-500 ring-offset-4 xl:order-1 xl:px-10 xl:py-16"
      >
        <article class="prose prose-lg mx-auto font-garamond prose-p:font-sans">
          <h1 class="mb-16 text-center text-blue-600">{{ story.title }}</h1>
          <section v-for="(chapter, i) in story.chapters" :key="chapter.id">
            <h2 v-if="story.storyStructure !== StoryStructure.SIMPLE">
              Chapter {{ i + 1 }}: {{ chapter.title }}
            </h2>
            <VueMarkdown :source="chapter.content" />

            <div
              v-if="
                chapter.nextChapterChoices &&
                (typeof chapter.selectedChoiceIndex === 'number' ||
                  typeof chapter.customChoice === 'string')
              "
              class="flex flex-col items-center font-sans"
            >
              <div
                class="mx-auto mb-2 mt-10 max-w-xs rounded bg-blue-500 p-3 text-sm font-semibold text-blue-100 opacity-50 shadow-md ring-2 ring-white"
              >
                <span class="mb-3 block text-center text-white">You have chosen</span>
                <span v-if="typeof chapter.selectedChoiceIndex === 'number'" class="italic">
                  {{ chapter.nextChapterChoices[chapter.selectedChoiceIndex] }}
                </span>
                <span v-else class="italic">"{{ chapter.customChoice }}"</span>
              </div>
              <button class="text-xs font-semibold" type="button" @click="onDecisionRevert(i)">
                Revert this decision...
              </button>
            </div>
          </section>
        </article>

        <div
          v-if="
            story.storyStructure !== StoryStructure.SIMPLE &&
            (story.storyStructure === StoryStructure.OPEN_ENDING ||
              story.chapters.length < story.totalChapters)
          "
        >
          <h2 class="mb-4 mt-10 text-center font-garamond text-xl font-bold">
            <span v-if="story.storyMode === StoryMode.DECISION_MAKING">
              {{
                story.chapters.length + 1 === story.totalChapters
                  ? '...make a last decision'
                  : '...make a decision to continue'
              }}
            </span>
            <span v-else>
              {{
                story.chapters.length + 1 === story.totalChapters
                  ? '...choose an ending'
                  : '...choose a continuation twist'
              }}
            </span>
          </h2>
          <div class="relative grid gap-5 md:grid-cols-2">
            <button
              v-for="(choice, i) in story.chapters[story.chapters.length - 1].nextChapterChoices"
              :key="i"
              type="button"
              class="rounded bg-blue-500 p-3 font-semibold text-blue-100 shadow-md ring-2 ring-white transition hover:scale-105"
              :class="{ 'opacity-50': isPromptLoading || isAiLoading }"
              :disabled="isPromptLoading || isAiLoading"
              @click="onApplyContinuation(i)"
            >
              {{ choice }}
            </button>
            <button
              type="button"
              class="rounded bg-blue-500 p-3 font-semibold text-blue-100 shadow-md ring-2 ring-white transition hover:scale-105"
              :class="{ 'opacity-50': isPromptLoading || isAiLoading }"
              :disabled="isPromptLoading || isAiLoading"
              @click="onWriteCustomContinuation"
            >
              Write your own!
            </button>
            <div
              v-if="isPromptLoading || isAiLoading"
              class="absolute inset-0 flex items-center justify-center"
            >
              <LoadingSpinner />
            </div>
          </div>
        </div>

        <h2 v-else class="mt-10 text-center font-garamond text-3xl font-bold">The end</h2>
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
