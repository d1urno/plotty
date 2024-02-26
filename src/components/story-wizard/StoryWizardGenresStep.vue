<script setup lang="ts">
import GenericCard from '@/components/GenericCard.vue'
import { MAX_GENRES, StoryGenre } from '@/constants/rules'
import useStoryForm from '@/composables/useStoryForm'
import getGenreImg from '@/functions/getGenreImg'

const { formData: storyFormData } = useStoryForm()

function isGenreDisabled(genre: StoryGenre) {
  if (storyGenresModel.value?.length === MAX_GENRES && !storyGenresModel.value?.includes(genre))
    return true
  switch (genre) {
    case StoryGenre.FANTASY:
      return storyGenresModel.value?.includes(StoryGenre.SCI_FI)
    case StoryGenre.SCI_FI:
      return storyGenresModel.value?.includes(StoryGenre.FANTASY)
    case StoryGenre.HISTORICAL:
      return storyGenresModel.value?.includes(StoryGenre.FUTURISTIC)
    case StoryGenre.FUTURISTIC:
      return storyGenresModel.value?.includes(StoryGenre.HISTORICAL)
    default:
      return false
  }
}

function onGenreSelect(genre: StoryGenre) {
  if (!storyGenresModel.value) storyGenresModel.value = []
  if (storyGenresModel.value.includes(genre))
    storyGenresModel.value = storyGenresModel.value.filter((g) => g !== genre)
  else if (storyGenresModel.value.length < MAX_GENRES) storyGenresModel.value.push(genre)
}
</script>

<template>
  <div>
    <h1 class="text-center text-lg font-bold text-gray-800">
      Which of these genres describe your story?
    </h1>
    <div
      class="scrollbar-hidden -mx-6 mt-4 grid grid-flow-col grid-rows-2 overflow-auto px-6 py-2 md:grid md:grid-flow-row md:grid-cols-5"
    >
      <GenericCard
        v-for="genre in StoryGenre"
        :key="genre"
        :disabled="isGenreDisabled(genre)"
        :item="{ id: genre, title: genre, img: getGenreImg(genre) }"
        :selected="storyFormData.storyGenres.includes(genre)"
        class="m-auto h-48 w-40 md:w-full"
        @click="onGenreSelect(genre)"
      />
    </div>
  </div>
</template>

<style scoped lang="postcss"></style>
