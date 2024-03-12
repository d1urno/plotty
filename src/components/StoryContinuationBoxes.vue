<script setup lang="ts">
import CharacterThumb from '@/components/CharacterThumb.vue'
import { StoryMode, StoryStructure } from '@/constants/rules'
import type { BaseCharacter, Story } from '@/types/local'
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useStore } from '@/stores'
import { useI18n } from 'vue-i18n'
import useModal from '@/composables/useModal'
import useCharacterListByIds from '@/composables/useCharacterListByIds'

const props = defineProps<{
  story: Story
}>()

const emit = defineEmits<{
  characterThumbClick: [character: BaseCharacter]
  applyContinuation: [{ choiceIndex?: number; customChoice?: string }]
}>()

const { chaptersLoadingData } = storeToRefs(useStore())
const { t } = useI18n()
const { showModal } = useModal()
const variables = computed(() => ({
  ids: [...props.story.mainCharacters, ...props.story.secondaryCharacters]
}))
const { characterList } = useCharacterListByIds(variables, true)

const customContinuation = ref<string>(t('StoryChapter.customContinuationText'))

const lastChapter = computed(() => props.story.chapters[props.story.chapters.length - 1])
const loadingData = computed(() => chaptersLoadingData.value.get(lastChapter.value.id))

const nextDecidingCharacter = computed(() =>
  characterList.value?.find((c) => c.name === lastChapter.value.decidingCharacterName)
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
          :disabled="loadingData?.nextChapterChoices"
          @click="onApplyContinuation(i)"
        >
          {{ choice }}
        </button>
        <button
          v-if="!loadingData?.nextChapterChoices"
          type="button"
          class="rounded bg-blue-500 p-3 font-semibold text-blue-100 shadow-md ring-2 ring-white transition hover:scale-105"
          :disabled="loadingData?.nextChapterChoices"
          @click="onWriteCustomContinuation"
        >
          {{ $t('StoryChapter.buttons.customLabel') }}
        </button>
      </transition-group>
    </div>
  </div>
</template>

<style scoped lang="postcss"></style>
