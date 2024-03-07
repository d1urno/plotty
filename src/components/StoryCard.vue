<script setup lang="ts">
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import CharacterThumb from '@/components/CharacterThumb.vue'
import { computed } from 'vue'
import useCharacterListByIds from '@/composables/useCharacterListByIds'
import type { Story } from '@/types/local'
import useDate from '@/composables/useDate'

const props = defineProps<{
  story: Story
  loading?: boolean
}>()

defineEmits<{
  delete: [string]
}>()

const variables = computed(() => ({
  ids: [...props.story.mainCharacters, ...props.story.secondaryCharacters]
}))
const { characterList } = useCharacterListByIds(variables, true)
const { timeAgo } = useDate(props.story.created)
</script>

<template>
  <div class="group rounded-md p-4 text-left hover:bg-blue-400 hover:text-white">
    <h2 class="line-clamp-2 font-bold">{{ story.title }}</h2>
    <time class="block text-xs">{{ timeAgo }}</time>
    <div class="mt-1 flex items-center gap-4">
      <div class="flex w-full">
        <LoadingSpinner v-if="loading" class="-mt-4 !h-16" />
        <CharacterThumb
          v-for="character in characterList"
          v-else
          :key="character.id"
          :character="character"
          class="-ml-4 first:ml-0"
          mini
        />
      </div>
      <button
        class="rounded-md bg-white px-2 py-1 text-xs text-red-600 xl:hidden xl:group-hover:block"
        type="button"
        @click.prevent="$emit('delete', story.id)"
        @mousedown.prevent
      >
        {{ $t('StoryCard.buttons.delete') }}
      </button>
    </div>
  </div>
</template>
