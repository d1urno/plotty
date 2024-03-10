<script setup lang="ts">
import CharacterThumb from '@/components/CharacterThumb.vue'
import { StoryMode, StoryStructure } from '@/constants/rules'
import type { BaseCharacter, Story } from '@/types/local'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import useModal from '@/composables/useModal'

const props = defineProps<{
  story: Story
  characterList?: BaseCharacter[]
}>()

const emit = defineEmits<{
  characterThumbClick: [character: BaseCharacter]
  applyContinuation: [{ choiceIndex?: number; customChoice?: string }]
}>()

const { t } = useI18n()
const { showModal } = useModal()

const customContinuation = ref<string>(t('StoryChapter.customContinuationText'))

const lastChapter = computed(() => props.story.chapters[props.story.chapters.length - 1])

const nextDecidingCharacter = computed(() =>
  props.characterList?.find((c) => c.name === lastChapter.value.decidingCharacterName)
)

const nextDecidingCharacterName = computed(() => lastChapter.value.decidingCharacterName)

const makesDecisionText = computed(() =>
  props.story.storyStructure !== StoryStructure.OPEN_ENDING &&
  props.story.chapters.length + 1 === props.story.totalChapters
    ? t('StoryChapter.makesLastDecisionText', { name: nextDecidingCharacterName.value })
    : t('StoryChapter.makesDecisionText', { name: nextDecidingCharacterName.value })
)

const chooseNextText = computed(() =>
  props.story.chapters.length + 1 === props.story.totalChapters
    ? t('StoryChapter.chooseEndingText')
    : t('StoryChapter.chooseContinuationText')
)

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
  <div>
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
    <div
      v-if="lastChapter.nextChapterChoices"
      class="relative grid gap-5 font-sans text-sm md:grid-cols-2"
    >
      <transition-group name="list">
        <button
          v-for="(choice, i) in lastChapter.nextChapterChoices"
          :key="i"
          type="button"
          class="rounded bg-blue-500 p-3 font-semibold text-blue-100 shadow-md ring-2 ring-white transition hover:scale-105"
          @click="onApplyContinuation(i)"
        >
          {{ choice }}
        </button>
        <button
          type="button"
          class="rounded bg-blue-500 p-3 font-semibold text-blue-100 shadow-md ring-2 ring-white transition hover:scale-105"
          @click="onWriteCustomContinuation"
        >
          {{ $t('StoryChapter.buttons.customLabel') }}
        </button>
      </transition-group>
    </div>
  </div>
</template>

<style scoped lang="postcss"></style>