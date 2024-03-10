<script setup lang="ts">
import { useStore } from '@/stores'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import useCharacterListByIds from '@/composables/useCharacterListByIds'
import CharacterSelectionList from '@/components/CharacterSelectionList.vue'
import CharacterDetailsModal from '@/components/CharacterDetailsModal.vue'
import { useRoute } from 'vue-router'
import useContinuationAi from '@/composables/useContinuationAi'
import useModal from '@/composables/useModal'
import ApiKeyModal from '@/components/ApiKeyModal.vue'
import type { BaseCharacter, Story } from '@/types/local'
import getGenreImg from '@/functions/getGenreImg'
import StoryChapter from '@/components/StoryChapter.vue'
import GenericCard from '@/components/GenericCard.vue'
import {
  StoryAudience,
  StoryGenre,
  StoryLanguage,
  StoryLength,
  StoryMode,
  StoryStructure,
  StoryStyle
} from '@/constants/rules'
import useEnum from '@/composables/useEnum'
import useDate from '@/composables/useDate'
import getLanguageFromLocale from '@/functions/getLanguageFromLocale'
import { useI18n } from 'vue-i18n'
import StoryContinuationBoxes from '@/components/StoryContinuationBoxes.vue'
import useStoryApi from '@/composables/useStoryApi'

const route = useRoute<'/story/[storySlug]'>()
const storySlug = computed(() => route.params.storySlug)

const { locale } = useI18n()
const { stories, apiKey, chaptersLoadingData } = storeToRefs(useStore())
const { saveStory } = useStoryApi()
const storyId = computed(() => stories.value.find((s) => s.slug === storySlug.value)?.id)
const story = computed<Story | undefined>(() => stories.value.find((s) => s.id === storyId.value))

const variables = computed(
  () =>
    (story.value && { ids: [...story.value.mainCharacters, ...story.value.secondaryCharacters] }) ??
    undefined
)
const { characterList, loading } = useCharacterListByIds(variables)
const { getContinuationPrompt, generateContinuation } = useContinuationAi(storyId)
const { showModal } = useModal()

const { formattedDate } = useDate(story.value?.created)

const apiKeyModal = ref<{ visible: boolean }>()
const characterModal = ref<{ visible: boolean; character: BaseCharacter }>()

const lastChapter = computed(() => story.value?.chapters[story.value.chapters.length - 1])

const showContinuationBoxes = computed(() => {
  if (!story.value || !lastChapter.value?.nextChapterChoices?.some((c) => c.length)) return false
  return (
    story.value.storyStructure !== StoryStructure.SIMPLE &&
    (story.value.storyStructure === StoryStructure.OPEN_ENDING ||
      story.value.chapters.length < story.value.totalChapters)
  )
})

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
  saveStory(story.value)
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
  <div
    class="flex h-full flex-col overflow-y-auto bg-gradient-to-l from-teal-400/10 from-80% via-blue-500/20 to-blue-400/50 xl:from-50%"
  >
    <div
      v-if="story"
      class="container flex flex-col items-center gap-10 pb-20 pt-16 xl:flex-row xl:items-start xl:px-10"
    >
      <div
        class="xl:order-0 order-1 flex h-min max-w-xl flex-none basis-1/3 flex-col gap-10 rounded-md bg-white/50 p-4 ring-2 ring-gray-500 ring-offset-4"
      >
        <div>
          <h2 class="mb-4 text-left text-xl font-bold">{{ $t('StorySlug.mainRolesTitle') }}</h2>
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
          <h2 class="mb-4 text-left text-xl font-bold">
            {{ $t('StorySlug.secondaryRolesTitle') }}
          </h2>
          <CharacterSelectionList
            cache-only
            :loading="loading"
            :selected-character-ids="story.secondaryCharacters"
            readonly
            @click="onCardClick"
          />
        </div>

        <div>
          <h2 class="mb-4 text-left text-xl font-bold">{{ $t('StorySlug.genres.title') }}</h2>
          <ul class="grid list-inside grid-cols-3 text-lg">
            <li v-for="genre in story.storyGenres" :key="genre">
              <GenericCard
                :item="{
                  id: genre,
                  title: useEnum(StoryGenre).toLabel(genre),
                  img: getGenreImg(genre)
                }"
                class="pointer-events-none h-48"
              />
            </li>
          </ul>
        </div>

        <hr class="h-px w-full bg-gray-400" />

        <div>
          <ul class="ml-2 flex list-inside flex-wrap gap-6 text-lg">
            <li>
              <span class="block text-xs font-semibold">{{ $t('StorySlug.style.title') }}</span>
              <span class="pointer-events-none text-gray-500">
                {{ useEnum(StoryStyle).toLabel(story.storyStyle) }}
              </span>
            </li>
            <li>
              <span class="block text-xs font-semibold">{{ $t('StorySlug.structure.title') }}</span>
              <span class="pointer-events-none text-gray-500">
                {{ useEnum(StoryStructure).toLabel(story.storyStructure) }}
              </span>
            </li>
            <li>
              <span class="block text-xs font-semibold">
                {{
                  story.storyStructure !== StoryStructure.SIMPLE
                    ? $t('StorySlug.length.perChapterTitle')
                    : $t('StorySlug.length.perStoryTitle')
                }}
              </span>
              <span class="pointer-events-none text-gray-500">
                {{ useEnum(StoryLength).toLabel(story.storyLength) }}
              </span>
            </li>
            <li>
              <span class="block text-xs font-semibold">{{ $t('StorySlug.mode.title') }}</span>
              <span class="pointer-events-none text-gray-500">
                {{ useEnum(StoryMode).toLabel(story.storyMode) }}
              </span>
            </li>
            <li>
              <span class="block text-xs font-semibold">{{ $t('StorySlug.audience.title') }}</span>
              <span class="pointer-events-none text-gray-500">
                {{ useEnum(StoryAudience).toLabel(story.storyAudience) }}
              </span>
            </li>
          </ul>
        </div>

        <time class="mx-auto block text-xs text-gray-500">
          {{ $t('StorySlug.createdAt', { date: formattedDate }) }}
        </time>
      </div>

      <div class="order-0 mx-auto flex w-full flex-col px-6 xl:order-1 xl:px-10">
        <span
          v-if="story.storyLanguage !== getLanguageFromLocale(locale)"
          class="rounded-md bg-orange-50 p-6 text-orange-600 ring-2 ring-orange-400"
        >
          {{
            $t('StorySlug.noTranslationText', {
              language: useEnum(StoryLanguage).toLabel(story.storyLanguage)
            })
          }}
        </span>

        <article
          class="prose prose-lg mx-auto !w-full max-w-3xl py-6 font-garamond prose-p:font-sans xl:py-16"
        >
          <h1 class="mb-16 text-center text-blue-600">{{ story.title }}</h1>

          <!-- Need to spread chapter object, otherwise reactivity is lost when streaming 😟 -->
          <StoryChapter
            v-for="(chapter, i) in story.chapters"
            :key="chapter.id"
            :story-structure="story.storyStructure"
            :chapter="{ ...chapter }"
            :index="i + 1"
            @decision-revert="onDecisionRevert(i)"
          />

          <StoryContinuationBoxes
            v-if="showContinuationBoxes"
            :story="story"
            :character-list="characterList"
            @apply-continuation="onApplyContinuation"
            @character-thumb-click="onCardClick"
          />

          <h2
            v-else-if="!chaptersLoadingData.size"
            class="mt-10 text-center font-garamond text-3xl font-bold"
          >
            {{ $t('StoryChapter.endText') }}
          </h2>
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
