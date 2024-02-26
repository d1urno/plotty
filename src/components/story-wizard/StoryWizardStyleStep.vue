<script setup lang="ts">
import GenericCard from '@/components/GenericCard.vue'
import { StoryStyle } from '@/constants/rules'

const storyStyleModel = defineModel<StoryStyle>('storyStyleModel')

function getStoryStyleText(style: StoryStyle) {
  switch (style) {
    case StoryStyle.NARRATIVE:
      return `<p class="font-normal text-left"><span class="font-bold">Narrative</span>: AI will generate a story in a narrative
              style, with a focus on the plot and characters.</p>`
    case StoryStyle.SCRIPT:
      return `<p class="font-normal text-left"><span class="font-bold">Script</span>: AI will generate a story in a script
              format, with a focus on the dialogues and actions.</p>`
    default:
      return ''
  }
}
</script>

<template>
  <div>
    <h1 class="text-center text-lg font-bold text-gray-800">
      What style would you like your story to be written in?
    </h1>
    <div class="mx-auto mb-12 mt-6 flex w-full max-w-sm flex-col gap-2">
      <GenericCard
        v-for="style in StoryStyle"
        :key="style"
        :item="{ id: style }"
        :selected="storyStyleModel === style"
        class="w-full"
        @click="storyStyleModel = style"
      >
        <p v-html="getStoryStyleText(style)"></p>
      </GenericCard>
    </div>
  </div>
</template>

<style scoped lang="postcss"></style>
