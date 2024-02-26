<script setup lang="ts">
import GenericCard from '@/components/GenericCard.vue'
import { StoryStructure } from '@/constants/rules'

const storyStructureModel = defineModel<StoryStructure>('storyStructureModel')
const totalChaptersModel = defineModel<number>('totalChaptersModel', { default: 3 })

function getStoryStructureText(structure: StoryStructure) {
  switch (structure) {
    case StoryStructure.SIMPLE:
      return `<p class="font-normal text-left"><span class="font-bold">Simple</span>: A single chapter story, AI will generate the
              whole story at once.</p>`
    case StoryStructure.MULTI_CHAPTER:
      return `<p class="font-normal text-left"><span class="font-bold">Multi Chapter</span>: Specify a fixed number of
              chapters for your story, AI will generate the first chapter
              and suggest three distinct ideas to continue generating the next chapter until your story
              ends.</p>`
    case StoryStructure.OPEN_ENDING:
      return `<p class="font-normal text-left"><span class="font-bold">Open Ending</span>: AI will generate the first
              chapter, and suggest three ideas to continue generating the next chapter until you
              decide when to end the story.</p>`
    default:
      return ''
  }
}

function onStoryStructureChange(structure: StoryStructure) {
  storyStructureModel.value = structure
  if (structure === StoryStructure.OPEN_ENDING) totalChaptersModel.value = 0
  else if (structure === StoryStructure.SIMPLE) totalChaptersModel.value = 1
  else totalChaptersModel.value = 3
}
</script>

<template>
  <div>
    <h1 class="text-center text-lg font-bold text-gray-800">
      Choose a text structure for the story
    </h1>
    <div class="mx-auto mb-6 mt-6 flex w-full max-w-xl flex-col gap-2">
      <GenericCard
        v-for="structure in StoryStructure"
        :key="structure"
        :item="{ id: structure }"
        :selected="storyStructureModel === structure"
        class="w-full"
        @click="onStoryStructureChange(structure)"
      >
        <p v-html="getStoryStructureText(structure)"></p>
      </GenericCard>
    </div>
  </div>
</template>

<style scoped lang="postcss"></style>
