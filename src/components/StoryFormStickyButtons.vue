<script setup lang="ts">
import { StoryStyle } from '@/constants/rules'
import { computed } from 'vue'
import CogIcon from '@/components/icons/CogIcon.vue'

const props = defineProps<{
  disabled: boolean
  loading: boolean
  isAiLoading: boolean
  storyStyle: StoryStyle
}>()

const emit = defineEmits<{
  openSettings: [void]
  generateStory: [void]
}>()

const generateButtonLabel = computed(
  () =>
    `Generate ${{ [StoryStyle.NARRATIVE]: 'story', [StoryStyle.SCRIPT]: 'script' }[props.storyStyle]}`
)

function onOpenSettings() {
  emit('openSettings')
}

function onGenerateStory() {
  emit('generateStory')
}
</script>

<template>
  <div class="sticky bottom-0 z-10 mt-auto bg-gray-100 lg:mt-0">
    <div
      class="flex w-full justify-center gap-8 bg-blue-300/20 py-4 lg:flex-col lg:items-center lg:gap-2"
    >
      <button
        class="flex items-center gap-3 overflow-hidden rounded-full bg-blue-500 pr-6 text-lg font-bold text-white shadow-lg ring-2 ring-white transition-transform duration-200 ease-out disabled:bg-gray-300 lg:w-max lg:text-2xl"
        :class="{ 'hover:scale-105': !disabled && !loading && !isAiLoading }"
        type="button"
        :disabled="disabled || loading || isAiLoading"
        @click="onGenerateStory"
      >
        <button
          type="button"
          :disabled="disabled || loading || isAiLoading"
          :class="{ group: !disabled && !loading && !isAiLoading }"
          class="-mr-3 bg-black/20 py-3 pl-4 pr-3"
          @click.stop="onOpenSettings"
        >
          <CogIcon class="transition-transform group-hover:scale-125" />
        </button>
        <span class="block h-12 w-[2px] bg-white"></span>
        <span>{{ isAiLoading ? 'Generating...' : generateButtonLabel }}</span>
      </button>
    </div>
  </div>
</template>
