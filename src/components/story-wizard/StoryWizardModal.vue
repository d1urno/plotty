<script setup lang="ts">
import GenericModal from '@/components/GenericModal.vue'
import { StoryStructure } from '@/constants/rules'
import { computed, ref } from 'vue'
import { useRefHistory } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import useStore from '@/stores'
import StoryWizardGenresStep from '@/components/story-wizard/StoryWizardGenresStep.vue'
import StoryWizardStyleStep from '@/components/story-wizard/StoryWizardStyleStep.vue'
import StoryWizardStructureStep from '@/components/story-wizard/StoryWizardStructureStep.vue'
import StoryWizardChaptersStep from '@/components/story-wizard/StoryWizardChaptersStep.vue'
import StoryWizardLengthStep from '@/components/story-wizard/StoryWizardLengthStep.vue'
import StoryWizardModeStep from '@/components/story-wizard/StoryWizardModeStep.vue'
import StoryWizardSpecialInstructionsStep from '@/components/story-wizard/StoryWizardSpecialInstructionsStep.vue'

const model = defineModel<{ visible: boolean }>()

const emit = defineEmits<{
  generateStory: []
}>()

const { storyFormData } = storeToRefs(useStore())

const step = ref(1)

const { history } = useRefHistory(step, { capacity: 1 })

const transitionName = computed(() => {
  const prevStep = (history.value[1] || history.value[0]).snapshot
  if (step.value > prevStep) return 'slide-left'
  if (step.value < prevStep) return 'slide-right'
  return ''
})

const percentage = computed(() => {
  let base: number
  if (storyFormData.value.storyStructure === StoryStructure.SIMPLE) base = 5
  else if (storyFormData.value.storyStructure === StoryStructure.OPEN_ENDING) base = 6
  else if (storyFormData.value.storyStructure === StoryStructure.MULTI_CHAPTER) base = 7
  else base = 8

  return `${Math.round((step.value / base) * 100)}%`
})

function onNextStep() {
  if (step.value < 7) step.value += 1
}

function onPrevStep() {
  if (step.value > 1) step.value -= 1
}

function onGenerateStory(close: () => void) {
  close()
  emit('generateStory')
}

function getFourthStepComponent() {
  switch (storyFormData.value.storyStructure) {
    case StoryStructure.MULTI_CHAPTER:
      return StoryWizardChaptersStep
    case StoryStructure.OPEN_ENDING:
      return StoryWizardLengthStep
    default:
      return StoryWizardLengthStep
  }
}

function getFifthStepComponent() {
  switch (storyFormData.value.storyStructure) {
    case StoryStructure.MULTI_CHAPTER:
      return StoryWizardLengthStep
    case StoryStructure.OPEN_ENDING:
      return StoryWizardModeStep
    default:
      return StoryWizardSpecialInstructionsStep
  }
}

function getSixthStepComponent() {
  switch (storyFormData.value.storyStructure) {
    case StoryStructure.MULTI_CHAPTER:
      return StoryWizardModeStep
    case StoryStructure.OPEN_ENDING:
      return StoryWizardSpecialInstructionsStep
    default:
      return StoryWizardSpecialInstructionsStep
  }
}

function getSeventhStepComponent() {
  switch (storyFormData.value.storyStructure) {
    case StoryStructure.MULTI_CHAPTER:
      return StoryWizardSpecialInstructionsStep
    case StoryStructure.OPEN_ENDING:
      return StoryWizardSpecialInstructionsStep
    default:
      return StoryWizardSpecialInstructionsStep
  }
}

function getEighthStepComponent() {
  return StoryWizardSpecialInstructionsStep
}

const stepComponent = computed(() => {
  switch (step.value) {
    case 1:
      return StoryWizardGenresStep
    case 2:
      return StoryWizardStyleStep
    case 3:
      return StoryWizardStructureStep
    case 4:
      return getFourthStepComponent()
    case 5:
      return getFifthStepComponent()
    case 6:
      return getSixthStepComponent()
    case 7:
      return getSeventhStepComponent()
    case 8:
      return getEighthStepComponent()
    default:
      return ''
  }
})
</script>

<template>
  <GenericModal
    v-if="model"
    v-model="model.visible"
    max-width-class="max-w-3xl"
    @close="model = undefined"
  >
    <template #title>
      <span class="mb-6 block h-1 w-full rounded-full bg-gray-300">
        <span
          :style="{ width: percentage }"
          class="block h-full rounded-full bg-blue-500 transition-[width] duration-500 ease-out"
        ></span>
      </span>
    </template>

    <div class="flex flex-col items-center justify-center">
      <div class="w-full">
        <transition :name="transitionName" mode="out-in">
          <component
            :is="stepComponent"
            :key="step"
            v-model:story-style-model="storyFormData.storyStyle"
            v-model:story-structure-model="storyFormData.storyStructure"
            v-model:story-mode-model="storyFormData.storyMode"
            v-model:story-length-model="storyFormData.storyLength"
            v-model:story-genres-model="storyFormData.storyGenres"
            v-model:total-chapters-model="storyFormData.totalChapters"
            v-model:special-instructions-model="storyFormData.customInstructions"
          />
        </transition>
      </div>
    </div>

    <template #footer="{ close }">
      <div class="flex justify-end md:justify-center">
        <div class="md:-ml-12">
          <button class="mr-6 text-sm font-bold text-gray-500" type="button" @click="close">
            Exit
          </button>
          <button
            type="button"
            :disabled="step <= 1"
            class="rounded-l-full bg-gray-300 px-10 py-2 font-bold text-gray-800 disabled:bg-gray-200 disabled:text-gray-500"
            @click="onPrevStep"
          >
            Prev
          </button>
          <button
            v-if="stepComponent !== StoryWizardSpecialInstructionsStep"
            type="button"
            class="rounded-r-full bg-blue-500 px-10 py-2 font-bold text-white hover:bg-blue-700"
            @click="onNextStep"
          >
            Next
          </button>
          <button
            v-else
            type="button"
            class="rounded-r-full bg-blue-500 px-7 py-2 font-bold text-white hover:bg-blue-700"
            @click="onGenerateStory(close)"
          >
            Generate story
          </button>
        </div>
      </div>
    </template>
  </GenericModal>
</template>
