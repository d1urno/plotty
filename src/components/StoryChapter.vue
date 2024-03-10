<script setup lang="ts">
import type { Chapter } from '@/types/local'
import VueMarkdown from 'vue-markdown-render'
import { computed } from 'vue'
import { StoryStructure } from '@/constants/rules'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
  chapter: Chapter
  storyStructure: StoryStructure
  index: number
  isPreview?: boolean
}>()

const emit = defineEmits<{
  decisionRevert: []
}>()

const { t } = useI18n()

const nextChapterChoices = computed(() => props.chapter.nextChapterChoices)

const selectedChoice = computed(() =>
  typeof props.chapter.selectedChoiceIndex === 'number'
    ? nextChapterChoices.value?.[props.chapter.selectedChoiceIndex]
    : props.chapter.customChoice
)

function getChosenChoiceTitleText() {
  return props.chapter.decidingCharacterName
    ? t('StoryChapter.hasChosenText', { name: props.chapter.decidingCharacterName })
    : t('StoryChapter.youChosenText', { name: props.chapter.decidingCharacterName })
}

function onDecisionRevert() {
  emit('decisionRevert')
}
</script>

<template>
  <section>
    <h2 v-if="storyStructure !== StoryStructure.SIMPLE && chapter.title">
      {{ $t('StoryChapter.title', { index, title: chapter.title }) }}
    </h2>

    <VueMarkdown :source="chapter.content" />

    <div v-if="selectedChoice" class="flex flex-col items-center font-sans">
      <div
        class="mx-auto mb-2 mt-10 max-w-xs rounded bg-blue-500 p-3 text-sm font-semibold text-blue-100 opacity-50 shadow-md ring-2 ring-white"
      >
        <span class="mb-3 flex items-center justify-center gap-5 text-white">
          {{ getChosenChoiceTitleText() }}
        </span>
        <span class="italic">{{ selectedChoice }}</span>
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
  </section>
</template>

<style scoped lang="postcss"></style>
