<script setup lang="ts">
import GenericCard from '@/components/GenericCard.vue'
import { StoryAudience } from '@/constants/rules'
import useStoryForm from '@/composables/useStoryForm'
import useEnum from '@/composables/useEnum'

const { formData: storyFormData } = useStoryForm()
</script>

<template>
  <div>
    <h1 class="text-center text-lg font-bold text-gray-800">
      {{ $t('StoryWizardAudienceStep.title') }}
    </h1>
    <div class="mx-auto mb-12 mt-6 grid w-full max-w-xl lg:grid-cols-2">
      <GenericCard
        v-for="storyAudience in StoryAudience"
        :key="storyAudience"
        :item="{
          id: storyAudience,
          title: useEnum(StoryAudience).toLabel(storyAudience)
        }"
        :selected="storyFormData.storyAudience === storyAudience"
        class="w-full"
        @click="storyFormData.storyAudience = storyAudience"
      />
    </div>
    <p class="mx-auto mb-8 max-w-xl">{{ $t('StoryWizardAudienceStep.text') }}</p>
  </div>
</template>

<style scoped lang="postcss"></style>
