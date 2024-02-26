<script setup lang="ts">
import GenericCard from '@/components/GenericCard.vue'
import { StoryMode } from '@/constants/rules'
import useStoryForm from '@/composables/useStoryForm'
import useStoryFormActions from '@/composables/useStoryFormActions'

const { formData: storyFormData } = useStoryForm()
const { onStoryModeSelect } = useStoryFormActions()
</script>

<template>
  <div>
    <h1 class="text-center text-lg font-bold text-gray-800">
      Do you want to use Decision Making Mode?
    </h1>
    <div class="mx-auto mb-12 mt-6 w-full max-w-xs">
      <GenericCard
        :item="{ id: StoryMode.DECISION_MAKING, title: 'Decision Making Mode' }"
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
      By enabling Decision Making Mode, AI will indicate three possible actions at the end of each
      chapter for you to take on behalf of the main characters to continue the story. <br />
      <br />
      Unexpected twists may arise from your decisions, until the end of the story!
    </p>
  </div>
</template>

<style scoped lang="postcss"></style>
