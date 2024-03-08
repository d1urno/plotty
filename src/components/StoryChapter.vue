<script setup lang="ts">
import type { BaseCharacter, Chapter } from '@/types/local'
import VueMarkdown from 'vue-markdown-render'
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useStore } from '@/stores'
import { StoryMode, StoryStructure } from '@/constants/rules'
import CharacterThumb from '@/components/CharacterThumb.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import useModal from '@/composables/useModal'
import AppLink from '@/components/AppLink.vue'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
  storyId: string
  chapter: Chapter
  index: number
  characterList?: BaseCharacter[]
  isPreview?: boolean
  isLoading?: boolean
}>()

const emit = defineEmits<{
  characterThumbClick: [character: BaseCharacter]
  decisionRevert: []
  applyContinuation: [{ choiceIndex?: number; customChoice?: string }]
}>()

const { stories } = storeToRefs(useStore())
const { t } = useI18n()
const { showModal } = useModal()

const customContinuation = ref<string>(t('StoryChapter.customContinuationText'))

const story = computed(() => stories.value.find((s) => s.id === props.storyId))

const nextDecidingCharacter = computed(() => {
  if (!story.value) return undefined
  const lastChapter = story.value.chapters[story.value.chapters.length - 1]
  return props.characterList?.find((c) => c.name === lastChapter.decidingCharacterName)
})

const nextDecidingCharacterName = computed(() => {
  const lastChapter = story.value?.chapters[story.value.chapters.length - 1]
  if (!lastChapter) return t('StoryChapter.someoneText')
  return lastChapter.decidingCharacterName
})

const makesDecisionText = computed(() => {
  if (!story.value) return ''
  return story.value.storyStructure !== StoryStructure.OPEN_ENDING &&
    story.value.chapters.length + 1 === story.value.totalChapters
    ? t('StoryChapter.makesLastDecisionText', { name: nextDecidingCharacterName.value })
    : t('StoryChapter.makesDecisionText', { name: nextDecidingCharacterName.value })
})

const chooseNextText = computed(() => {
  if (!story.value) return ''
  return story.value.chapters.length + 1 === story.value.totalChapters
    ? t('StoryChapter.chooseEndingText')
    : t('StoryChapter.chooseContinuationText')
})

const seesNextBoxes = computed(() => {
  if (!story.value) return false
  return (
    story.value.storyStructure !== StoryStructure.SIMPLE &&
    (story.value.storyStructure === StoryStructure.OPEN_ENDING ||
      story.value.chapters.length < story.value.totalChapters)
  )
})

function doesChapterHasChoices(
  chapter: Chapter
): chapter is Chapter & { nextChapterChoices: string[] } {
  return !!(
    chapter.nextChapterChoices &&
    (typeof chapter.selectedChoiceIndex === 'number' || typeof chapter.customChoice === 'string')
  )
}

const showToBeContinued = computed(() => {
  if (!story.value) return false
  return (
    props.isPreview &&
    props.index === story.value.chapters.length &&
    (doesChapterHasChoices(props.chapter) || seesNextBoxes.value)
  )
})

function getChosenChoiceTitleText() {
  return props.chapter.decidingCharacterName
    ? t('StoryChapter.hasChosenText', { name: props.chapter.decidingCharacterName })
    : t('StoryChapter.youChosenText', { name: props.chapter.decidingCharacterName })
}

function onDecisionRevert() {
  emit('decisionRevert')
}

function onApplyContinuation(choiceIndex?: number, customChoice?: string) {
  emit('applyContinuation', { choiceIndex, customChoice })
}

function onCharacterThumbClick(character: BaseCharacter) {
  emit('characterThumbClick', character)
}

function onWriteCustomContinuation() {
  showModal({
    title: t('StoryChapter.modals.writeOwnContinuation.title'),
    input: customContinuation.value,
    buttons: [
      {
        label: t('StoryChapter.modals.writeOwnContinuation.buttons.submit'),
        type: 'success',
        callbackOrLink: async (close, output) => {
          if (!output) return
          close()
          onApplyContinuation(undefined, output)
        }
      }
    ]
  })
}
</script>

<template>
  <section v-if="story">
    <h2 v-if="story.storyStructure !== StoryStructure.SIMPLE">
      {{ $t('StoryChapter.title', { index, title: chapter.title }) }}
    </h2>

    <VueMarkdown :source="chapter.content" />

    <h2 v-if="showToBeContinued" class="mt-10 text-center font-garamond text-3xl font-bold">
      <AppLink :to="`/story/${story.slug}`" class="font-semibold text-blue-500">
        {{ $t('StoryChapter.continuedText') }}
      </AppLink>
    </h2>

    <div v-else-if="doesChapterHasChoices(chapter)" class="flex flex-col items-center font-sans">
      <div
        class="mx-auto mb-2 mt-10 max-w-xs rounded bg-blue-500 p-3 text-sm font-semibold text-blue-100 opacity-50 shadow-md ring-2 ring-white"
      >
        <span class="mb-3 flex items-center justify-center gap-5 text-white">
          {{ getChosenChoiceTitleText() }}
        </span>
        <span v-if="typeof chapter.selectedChoiceIndex === 'number'" class="italic">
          {{ chapter.nextChapterChoices[chapter.selectedChoiceIndex] }}
        </span>
        <span v-else class="italic">"{{ chapter.customChoice }}"</span>
      </div>
      <button
        v-if="!isPreview"
        class="text-xs font-semibold"
        type="button"
        @click="onDecisionRevert"
      >
        {{ $t('StoryChapter.revertText') }}
      </button>
    </div>

    <div v-else-if="seesNextBoxes">
      <h2 class="mb-4 mt-10 text-center font-garamond text-xl font-bold">
        <span
          v-if="story.storyMode === StoryMode.DECISION_MAKING"
          class="flex flex-col items-center justify-center gap-2"
        >
          <CharacterThumb
            v-if="nextDecidingCharacter"
            mini
            :character="nextDecidingCharacter"
            @click="onCharacterThumbClick(nextDecidingCharacter)"
          />
          {{ makesDecisionText }}
        </span>
        <span v-else>{{ chooseNextText }}</span>
      </h2>
      <div class="relative grid gap-5 font-sans text-sm md:grid-cols-2">
        <button
          v-for="(choice, i) in story.chapters[story.chapters.length - 1].nextChapterChoices"
          :key="i"
          type="button"
          class="rounded bg-blue-500 p-3 font-semibold text-blue-100 shadow-md ring-2 ring-white transition hover:scale-105"
          :class="{ 'opacity-50': isLoading }"
          :disabled="isLoading"
          @click="onApplyContinuation(i)"
        >
          {{ choice }}
        </button>
        <button
          type="button"
          class="rounded bg-blue-500 p-3 font-semibold text-blue-100 shadow-md ring-2 ring-white transition hover:scale-105"
          :class="{ 'opacity-50': isLoading }"
          :disabled="isLoading"
          @click="onWriteCustomContinuation"
        >
          {{ $t('StoryChapter.buttons.customLabel') }}
        </button>
        <div v-if="isLoading" class="absolute inset-0 flex items-center justify-center">
          <LoadingSpinner />
        </div>
      </div>
    </div>

    <h2 v-else class="mt-10 text-center font-garamond text-3xl font-bold">
      {{ $t('StoryChapter.endText') }}
    </h2>
  </section>
</template>

<style scoped lang="postcss"></style>
