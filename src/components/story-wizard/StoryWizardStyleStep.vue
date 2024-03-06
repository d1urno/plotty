<script setup lang="ts">
import GenericCard from '@/components/GenericCard.vue'
import { StoryStyle } from '@/constants/rules'
import useStoryForm from '@/composables/useStoryForm'
import { useI18n } from 'vue-i18n'
import useEnum from '@/composables/useEnum'

const { t } = useI18n()
const { formData: storyFormData } = useStoryForm()

function getStoryStyleText(style: StoryStyle) {
  switch (style) {
    case StoryStyle.NARRATIVE:
      return `<p class="font-normal text-left">
      <span class="font-bold">${useEnum(StoryStyle).toLabel(StoryStyle.NARRATIVE)}</span>:
      ${t('StoryWizardStyleStep.narrativeStyleText')}</p>`
    case StoryStyle.SCRIPT:
      return `<p class="font-normal text-left">
      <span class="font-bold">${useEnum(StoryStyle).toLabel(StoryStyle.SCRIPT)}</span>:
      ${t('StoryWizardStyleStep.scriptStyleText')}</p>`
    default:
      return ''
  }
}
</script>

<template>
  <div>
    <h1 class="text-center text-lg font-bold text-gray-800">
      {{ $t('StoryWizardStyleStep.title') }}
    </h1>
    <div class="mx-auto mb-12 mt-6 flex w-full max-w-sm flex-col gap-2">
      <GenericCard
        v-for="style in StoryStyle"
        :key="style"
        :item="{ id: style }"
        :selected="storyFormData.storyStyle === style"
        class="w-full"
        @click="storyFormData.storyStyle = style"
      >
        <p v-html="getStoryStyleText(style)"></p>
      </GenericCard>
    </div>
  </div>
</template>

<style scoped lang="postcss"></style>
