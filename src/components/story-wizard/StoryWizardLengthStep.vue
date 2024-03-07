<script setup lang="ts">
import GenericCard from '@/components/GenericCard.vue'
import { StoryLength, StoryStructure } from '@/constants/rules'
import useStoryForm from '@/composables/useStoryForm'
import useEnum from '@/composables/useEnum'

const { formData: storyFormData } = useStoryForm()
</script>

<template>
  <div>
    <h1
      v-if="
        storyFormData.storyStructure === StoryStructure.MULTI_CHAPTER ||
        storyFormData.storyStructure === StoryStructure.OPEN_ENDING
      "
      class="text-center text-lg font-bold text-gray-800"
    >
      {{ $t('StoryWizardLengthStep.chapterLengthTitle') }}
    </h1>
    <h1 v-else class="text-center text-lg font-bold text-gray-800">
      {{ $t('StoryWizardLengthStep.storyLengthTitle') }}
    </h1>
    <div class="mx-auto mb-12 mt-6 grid w-full max-w-xl lg:grid-cols-3">
      <GenericCard
        v-for="storyLength in StoryLength"
        :key="storyLength"
        :item="{
          id: storyLength,
          title: useEnum(StoryLength).toLabel(storyLength)
        }"
        :selected="storyFormData.storyLength === storyLength"
        class="w-full"
        @click="storyFormData.storyLength = storyLength"
      />
    </div>
    <p class="mx-auto mb-8 max-w-xl">{{ $t('StoryWizardLengthStep.text') }}</p>
  </div>
</template>

<style scoped lang="postcss"></style>
