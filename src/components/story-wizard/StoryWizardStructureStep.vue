<script setup lang="ts">
import GenericCard from '@/components/GenericCard.vue'
import { StoryStructure } from '@/constants/rules'
import useStoryForm from '@/composables/useStoryForm'
import useStoryFormActions from '@/composables/useStoryFormActions'
import { useI18n } from 'vue-i18n'
import useEnum from '@/composables/useEnum'

const { t } = useI18n()
const { formData: storyFormData } = useStoryForm()
const { onStoryStructureSelect } = useStoryFormActions()

function getStoryStructureText(structure: StoryStructure) {
  switch (structure) {
    case StoryStructure.SIMPLE:
      return `<p class="font-normal text-left">
      <span class="font-bold">${useEnum(StoryStructure).toLabel(StoryStructure.SIMPLE)}</span>:
      ${t('StoryWizardStructureStep.simpleStructureText')}</p>`
    case StoryStructure.MULTI_CHAPTER:
      return `<p class="font-normal text-left">
      <span class="font-bold">${useEnum(StoryStructure).toLabel(StoryStructure.MULTI_CHAPTER)}</span>:
      ${t('StoryWizardStructureStep.multiChapterStructureText')}</p>`
    case StoryStructure.OPEN_ENDING:
      return `<p class="font-normal text-left">
      <span class="font-bold">${useEnum(StoryStructure).toLabel(StoryStructure.OPEN_ENDING)}</span>:
      ${t('StoryWizardStructureStep.openEndingStructureText')}</p>`
    default:
      return ''
  }
}
</script>

<template>
  <div>
    <h1 class="text-center text-lg font-bold text-gray-800">
      {{ $t('StoryWizardStructureStep.title') }}
    </h1>
    <div class="mx-auto mb-6 mt-6 flex w-full max-w-xl flex-col gap-2">
      <GenericCard
        v-for="structure in StoryStructure"
        :key="structure"
        :item="{ id: structure }"
        :selected="storyFormData.storyStructure === structure"
        class="w-full"
        @click="onStoryStructureSelect(structure)"
      >
        <p v-html="getStoryStructureText(structure)"></p>
      </GenericCard>
    </div>
  </div>
</template>

<style scoped lang="postcss"></style>
