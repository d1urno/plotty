<script setup lang="ts">
import GenericCard from '@/components/GenericCard.vue'
import { StoryLength, StoryStructure } from '@/constants/rules'

const storyLengthModel = defineModel<StoryLength>('storyLengthModel')
const storyStructureModel = defineModel<StoryStructure>('storyStructureModel')
</script>

<template>
  <div>
    <h1
      v-if="storyStructureModel === StoryStructure.MULTI_CHAPTER"
      class="text-center text-lg font-bold text-gray-800"
    >
      What will the reading time for each chapter be?
    </h1>
    <h1 v-else class="text-center text-lg font-bold text-gray-800">
      What will the reading time for the story be?
    </h1>
    <div class="mx-auto mb-12 mt-6 grid w-full max-w-xl lg:grid-cols-3">
      <GenericCard
        v-for="storyLength in StoryLength"
        :key="storyLength"
        :item="{ id: storyLength, title: storyLength }"
        :selected="storyLengthModel === storyLength"
        class="w-full"
        @click="storyLengthModel = storyLength"
      />
    </div>
    <p class="mx-auto mb-8 max-w-xl">
      AI will use an approximate amount of words to match the reading time you set.
    </p>
  </div>
</template>

<style scoped lang="postcss"></style>
