<script setup lang="ts">
import { MAX_CHAPTERS } from '@/constants/rules'
import NumberInput from '@/components/form/NumberInput.vue'
import useStoryForm from '@/composables/useStoryForm'

const { formData: storyFormData } = useStoryForm()
</script>

<template>
  <div>
    <h1 class="text-center text-lg font-bold text-gray-800">
      How many chapters will your story have?
    </h1>
    <div class="mb-12 mt-6 flex items-baseline justify-center gap-2 text-3xl text-gray-800">
      <NumberInput
        v-model="storyFormData.totalChapters"
        label="Chapters"
        :show-label="false"
        class="w-20 pt-1 text-center text-3xl font-semibold"
        :max="MAX_CHAPTERS"
        :min="2"
      />
      Chapters
    </div>
    <p class="mx-auto mb-8 max-w-xl">
      When generating each chapter, AI will consider the total amount of chapters your story is
      divided in, and will generate the text based on this length.
    </p>
  </div>
</template>

<style scoped lang="postcss"></style>
