<script setup lang="ts">
import type { Chapter } from '@/types/local'
import VueMarkdown from 'vue-markdown-render'
import { computed } from 'vue'
import { StoryLanguage, StoryStructure } from '@/constants/rules'
import { useI18n } from 'vue-i18n'
import AudioPlayer from '@/components/AudioPlayer.vue'
import { useStore } from '@/stores'
import { storeToRefs } from 'pinia'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

const props = defineProps<{
  chapter: Chapter
  storyStructure: StoryStructure
  storyLanguage: StoryLanguage
  index: number
  isPreview?: boolean
}>()

const emit = defineEmits<{
  decisionRevert: []
  keyNotFound: []
}>()

const { t } = useI18n()
const { chaptersLoadingData } = storeToRefs(useStore())

const nextChapterChoices = computed(() => props.chapter.nextChapterChoices)

const selectedChoice = computed(() =>
  typeof props.chapter.selectedChoiceIndex === 'number'
    ? nextChapterChoices.value?.[props.chapter.selectedChoiceIndex]
    : props.chapter.customChoice
)

const audioTextData = computed(() => ({
  id: props.chapter.id,
  text: `${t('StoryChapter.title', { index: props.index, title: props.chapter.title })}. ${props.chapter.content}`
}))

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
  <section class="mb-20">
    <!-- Chapter actions bar -->
    <div
      v-if="storyStructure !== StoryStructure.SIMPLE"
      class="-mb-8 flex h-10 items-center justify-center gap-5 font-sans md:px-10"
    >
      <template v-if="chapter.content.length">
        <span class="h-px w-full bg-gray-400" />
        <LoadingSpinner v-if="chaptersLoadingData.size" />
        <AudioPlayer
          v-else
          :label="$t('StoryChapter.actions.playAudio.label')"
          size="small"
          :items="[audioTextData]"
          :lang="storyLanguage"
          @key-not-found="$emit('keyNotFound')"
        />
        <span class="h-px w-full bg-gray-400" />
      </template>
    </div>

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
