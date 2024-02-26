<script setup lang="ts">
import TextInput from '@/components/form/TextInput.vue'
import useStoryForm from '@/composables/useStoryForm'

const { formData: storyFormData } = useStoryForm()
</script>

<template>
  <div>
    <h1 class="text-center text-lg font-bold text-gray-800">
      Would you like to add any final indications?
    </h1>
    <div class="mx-auto mb-12 mt-6 w-full max-w-md">
      <TextInput
        v-model="storyFormData.customInstructions"
        label="Special instructions"
        :show-label="false"
        type="textarea"
        placeholder="Include in the story a magic tree in the middle of a forest. The story teaches a lesson about the importance of preserving the environment."
        rows="4"
        class="col-span-4 md:col-span-6"
      />
    </div>
    <p class="mx-auto mb-8 max-w-xl">
      If you have any special instructions for the AI, you can add them here. For example, you can
      specify the tone, extra characters, situations to cover, etc.
    </p>
  </div>
</template>

<style scoped lang="postcss"></style>
