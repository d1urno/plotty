<script setup lang="ts">
import GenericCard from '@/components/GenericCard.vue'
import { StoryGenre } from '@/constants/rules'
import useStoryForm from '@/composables/useStoryForm'
import useStoryFormActions from '@/composables/useStoryFormActions'
import getGenreImg from '@/functions/getGenreImg'
import { computed } from 'vue'

const { formData: storyFormData } = useStoryForm()
const { isGenreDisabled, onGenreSelect } = useStoryFormActions()

const filteredGenres = computed(() =>
  Object.values(StoryGenre).filter((genre) => genre !== StoryGenre.AI)
)
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
        v-for="genre in filteredGenres"
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
