<script setup lang="ts">
import GenericCard from '@/components/GenericCard.vue'
import { StoryGenre } from '@/constants/rules'
import useStoryForm from '@/composables/useStoryForm'
import useStoryFormActions from '@/composables/useStoryFormActions'
import getGenreImg from '@/functions/getGenreImg'
import useEnum from '@/composables/useEnum'

const { formData: storyFormData } = useStoryForm()
const { isGenreDisabled, onGenreSelect } = useStoryFormActions()
</script>

<template>
  <div>
    <h1 class="text-center text-lg font-bold text-gray-800">
      {{ $t('StoryWizardGenresStep.title') }}
    </h1>
    <div
      class="scrollbar-hidden -mx-6 mt-4 grid grid-flow-col grid-rows-2 overflow-auto px-6 py-2 md:grid md:grid-flow-row md:grid-cols-5"
    >
      <GenericCard
        v-for="genreOption in useEnum(StoryGenre).toOptions({ excludeValues: [StoryGenre.AI] })"
        :key="genreOption.value"
        :disabled="isGenreDisabled(genreOption.value)"
        :item="{
          id: genreOption.value,
          title: genreOption.label,
          img: getGenreImg(genreOption.value)
        }"
        :selected="storyFormData.storyGenres.includes(genreOption.value)"
        class="m-auto h-48 w-40 md:w-full"
        @click="onGenreSelect(genreOption.value)"
      />
    </div>
  </div>
</template>

<style scoped lang="postcss"></style>
