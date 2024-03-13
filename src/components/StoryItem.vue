<script setup lang="ts">
import { StoryLanguage, StoryStructure } from '@/constants/rules'
import getLanguageFromLocale from '@/functions/getLanguageFromLocale'
import StoryChapter from '@/components/StoryChapter.vue'
import StoryContinuationBoxes from '@/components/StoryContinuationBoxes.vue'
import useEnum from '@/composables/useEnum'
import type { BaseCharacter, Story } from '@/types/local'
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'
import useModal from '@/composables/useModal'
import useContinuationAi from '@/composables/useContinuationAi'
import { useRoute } from 'vue-router'
import { useStore } from '@/stores'
import { storeToRefs } from 'pinia'
import AppLink from '@/components/AppLink.vue'
import AudioPlayer from '@/components/AudioPlayer.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import useChapterApi from '@/composables/useChapterApi'

const props = defineProps<{
  story: Story
  isPreview?: boolean
}>()

const emit = defineEmits<{
  cardClick: [BaseCharacter]
  keyNotFound: []
}>()

const storyId = computed(() => props.story.id)
const route = useRoute<'/story/[storySlug]'>()
const { getContinuationPrompt, generateContinuation } = useContinuationAi(storyId)
const { chaptersLoadingData } = storeToRefs(useStore())
const { t, locale } = useI18n()
const { deleteChapters } = useChapterApi()
const { showModal } = useModal()

const nextChapterChoices = computed(
  () => props.story.chapters[props.story.chapters.length - 1].nextChapterChoices
)

const showContinuationBoxes = computed(() => {
  if (props.isPreview || !nextChapterChoices.value?.some((c) => c.length)) return false
  return (
    props.story.storyStructure !== StoryStructure.SIMPLE &&
    (props.story.storyStructure === StoryStructure.OPEN_ENDING ||
      props.story.chapters.length < props.story.totalChapters)
  )
})

const noTranslationText = computed(() =>
  t('StoryItem.noTranslationText', {
    language: useEnum(StoryLanguage).toLabel(props.story.storyLanguage)
  })
)

const showToBeContinued = computed(
  () =>
    props.isPreview &&
    props.story.storyStructure !== StoryStructure.SIMPLE &&
    props.story.chapters.length < props.story.totalChapters
)

const audioTextData = computed(() => {
  const { id, title, chapters, storyStructure } = props.story
  if (storyStructure === StoryStructure.SIMPLE) {
    return [{ id, text: `${title}. ${chapters[0].content}` }]
  }
  return [
    { id, text: `${title}.` },
    ...props.story.chapters.map((c, index) => ({
      id: c.id,
      text: `${t('StoryChapter.title', { index: index + 1, title: c.title })}. ${c.content}`
    }))
  ]
})

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
      emit('keyNotFound')
    } else console.error(error)
  }
}

async function revertDecision(chapterIndex: number) {
  const updatedStory = { ...props.story }
  // Reset the choice on the selected chapter
  updatedStory.chapters[chapterIndex].selectedChoiceIndex = undefined
  updatedStory.chapters[chapterIndex].customChoice = undefined

  // Delete all chapters after the selected chapter
  const toDeleteIds = updatedStory.chapters.slice(chapterIndex + 1).map((c) => c.id)
  await deleteChapters(toDeleteIds, updatedStory)
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
  <div>
    <span
      v-if="story.storyLanguage !== getLanguageFromLocale(locale)"
      class="mb-16 inline-block rounded-md bg-orange-50 p-6 text-orange-600 ring-2 ring-orange-400"
    >
      {{ noTranslationText }}
    </span>

    <div class="flex items-center justify-center gap-5 font-sans md:px-10 xl:-mb-8">
      <LoadingSpinner v-if="chaptersLoadingData.size" />
      <AudioPlayer
        v-else
        :label="$t('StoryItem.actions.playAudio.label')"
        :items="audioTextData"
        :lang="story.storyLanguage"
        size="large"
        class="mx-auto"
        @key-not-found="$emit('keyNotFound')"
      />
    </div>

    <article
      class="prose prose-lg mx-auto mb-6 mt-6 !w-full max-w-3xl font-garamond prose-p:font-sans xl:mb-16 xl:mt-16"
    >
      <h1 class="mb-16 text-center text-blue-600">{{ story.title }}</h1>

      <!-- Need to spread chapter object, otherwise reactivity is lost when streaming 😟 -->
      <StoryChapter
        v-for="(chapter, i) in story.chapters"
        :key="chapter.id"
        :story-structure="story.storyStructure"
        :story-language="story.storyLanguage"
        :chapter="{ ...chapter }"
        :index="i + 1"
        :is-preview="isPreview"
        @decision-revert="onDecisionRevert(i)"
        @key-not-found="$emit('keyNotFound')"
      />

      <StoryContinuationBoxes
        v-if="showContinuationBoxes"
        :story="story"
        @apply-continuation="onApplyContinuation"
        @character-thumb-click="$emit('cardClick', $event)"
      />

      <h2 v-else-if="showToBeContinued" class="mt-10 text-center font-garamond text-3xl font-bold">
        <AppLink :to="`/story/${story.slug}`" class="font-semibold text-blue-500">
          {{ $t('StoryItem.continuedText') }}
        </AppLink>
      </h2>

      <h2
        v-else-if="!chaptersLoadingData.size"
        class="mt-10 text-center font-garamond text-3xl font-bold"
      >
        {{ $t('StoryItem.endText') }}
      </h2>
    </article>
  </div>
</template>
