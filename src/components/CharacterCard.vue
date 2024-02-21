<script setup lang="ts">
import type { QueriedCharacterListItem } from '@/composables/useCharacterList'

const props = defineProps<{
  character: QueriedCharacterListItem
  selected?: boolean
  horizontal?: boolean
}>()

const emit = defineEmits<{
  click: [payload: QueriedCharacterListItem]
}>()

function onClick() {
  emit('click', props.character)
}
</script>

<template>
  <div
    class="flex flex-col items-center justify-center"
    :class="{
      'h-80 w-full p-4': !horizontal,
      'w-max py-2 pl-4': horizontal
    }"
  >
    <button
      class="flex h-full w-full flex-col items-center justify-center rounded-lg border border-gray-300 transition"
      type="button"
      :class="{
        'bg-blue-500': selected,
        'bg-white': !selected,
        'p-4 shadow-lg hover:scale-105': !horizontal,
        'p-2 shadow-md': horizontal
      }"
      @click="onClick"
    >
      <div
        class="flex h-full w-full items-center justify-center p-4"
        :class="{
          'flex-col': !horizontal,
          'gap-6 text-left': horizontal
        }"
      >
        <div
          class="flex h-full items-center justify-center"
          :class="{ 'mb-4 w-full': !horizontal }"
        >
          <img
            :src="character.image"
            :alt="character.name"
            draggable="false"
            class="rounded-full object-cover"
            :class="{ 'h-32 w-32': !horizontal, 'h-20 w-20': horizontal }"
          />
        </div>
        <div
          class="flex h-full flex-col justify-center"
          :class="{
            'w-full items-center': !horizontal,
            'w-40': horizontal
          }"
        >
          <h2
            class="line-clamp-2 text-xl font-bold"
            :class="selected ? 'text-white' : 'text-gray-800'"
          >
            {{ character.name }}
          </h2>
          <p class="text-sm" :class="selected ? 'text-white' : 'text-gray-600'">
            {{ character.species }}
          </p>
        </div>
      </div>
    </button>
  </div>
</template>
