<script setup lang="ts">
import GenericModal from '@/components/GenericModal.vue'
import StoryWizardCharacterStep from '@/components/story-wizard/StoryWizardCharacterStep.vue'
import useStoryForm from '@/composables/useStoryForm'

const model = defineModel<{ visible: boolean }>()

const { formData: storyFormData } = useStoryForm()
</script>

<template>
  <GenericModal
    v-if="model"
    v-model="model.visible"
    max-width-class="max-w-2xl"
    @close="model = undefined"
  >
    <div class="flex flex-col items-center justify-center">
      <div class="w-full">
        <StoryWizardCharacterStep
          v-model:story-decision-makers-model="storyFormData.decisionMakers"
        />
      </div>
    </div>

    <template #footer="{ close }">
      <div class="flex justify-end">
        <button
          type="button"
          class="rounded-md bg-blue-500 px-10 py-2 font-bold text-white"
          @click="close"
        >
          Done
        </button>
      </div>
    </template>
  </GenericModal>
</template>
