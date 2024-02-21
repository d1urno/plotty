<script setup lang="ts">
import type { QueriedCharacterListItem } from '@/composables/useCharacterList'
import { computed } from 'vue'
import getColorClasses, { type Color } from '@/functions/getColorClasses'

const props = withDefaults(
  defineProps<{
    character: QueriedCharacterListItem
    mini?: boolean
    selected?: boolean
    selectedColor?: Color
  }>(),
  {
    mini: false,
    selected: false,
    selectedColor: 'blue'
  }
)

const emit = defineEmits<{
  click: [payload: QueriedCharacterListItem]
}>()

const colorClasses = computed(() => getColorClasses(props.selectedColor))

function onClick() {
  emit('click', props.character)
}
</script>

<template>
  <button
    class="flex cursor-pointer flex-col items-center justify-center"
    :class="!mini ? 'p-4' : 'p-1'"
    type="button"
    @click="onClick"
  >
    <img
      :src="character.image"
      :alt="character.name"
      draggable="false"
      class="mb-1 rounded-full object-cover transition"
      :class="[
        mini ? 'h-10 w-10' : 'h-16 w-16',
        { 'ring-4': selected },
        { [colorClasses.ring]: selected }
      ]"
    />

    <h2 v-if="!mini" class="line-clamp-2 w-[6.58rem] max-w-full text-sm font-bold text-gray-800">
      {{ character.name }}
    </h2>
  </button>
</template>
