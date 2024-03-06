<script setup lang="ts">
import GenericCard from '@/components/GenericCard.vue'
import { StoryMode } from '@/constants/rules'
import useStoryForm from '@/composables/useStoryForm'
import useStoryFormActions from '@/composables/useStoryFormActions'
import useEnum from '@/composables/useEnum'

const { formData: storyFormData } = useStoryForm()
const { onStoryModeSelect } = useStoryFormActions()
</script>

<template>
  <div>
    <h1 class="text-center text-lg font-bold text-gray-800">
      {{ $t('StoryWizardModeStep.title') }}
    </h1>
    <div class="mx-auto mb-12 mt-6 w-full max-w-xs">
      <GenericCard
        :item="{
          id: StoryMode.DECISION_MAKING,
          title: useEnum(StoryMode).toLabel(StoryMode.DECISION_MAKING)
        }"
        :selected="storyFormData.storyMode === StoryMode.DECISION_MAKING"
        selected-color="orange"
        class="w-full"
        @click="
          onStoryModeSelect(
            storyFormData.storyMode === StoryMode.DECISION_MAKING
              ? StoryMode.NORMAL
              : StoryMode.DECISION_MAKING
          )
        "
      />
    </div>
    <p class="mx-auto mb-8 max-w-xl">
      {{ $t('StoryWizardModeStep.text1') }}<br /><br />{{ $t('StoryWizardModeStep.text2') }}
    </p>
  </div>
</template>

<style scoped lang="postcss"></style>
