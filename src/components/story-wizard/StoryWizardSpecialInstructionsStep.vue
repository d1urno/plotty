<script setup lang="ts">
import TextInput from '@/components/form/TextInput.vue'
import useStoryForm from '@/composables/useStoryForm'

const { formData: storyFormData } = useStoryForm()
</script>

<template>
  <div>
    <h1 class="text-center text-lg font-bold text-gray-800">
      {{ $t('StoryWizardSpecialInstructionsStep.title') }}
    </h1>
    <div class="mx-auto mb-12 mt-6 w-full max-w-md">
      <TextInput
        v-model="storyFormData.customInstructions"
        :label="$t('StoryWizardSpecialInstructionsStep.inputs.specialInstructions.label')"
        :show-label="false"
        type="textarea"
        :placeholder="
          $t('StoryWizardSpecialInstructionsStep.inputs.specialInstructions.placeholder')
        "
        rows="4"
        class="col-span-4 md:col-span-6"
      />
    </div>
    <p class="mx-auto mb-8 max-w-xl">{{ $t('StoryWizardSpecialInstructionsStep.text') }}</p>
  </div>
</template>

<style scoped lang="postcss"></style>
