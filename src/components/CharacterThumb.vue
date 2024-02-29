<script setup lang="ts" generic="T extends BaseCharacter">
import { computed } from 'vue'
import getColorClasses, { type Color } from '@/functions/getColorClasses'
import type { BaseCharacter } from '@/types/local'
import UserCircleIcon from '@/components/icons/UserCircleIcon.vue'

const props = withDefaults(
  defineProps<{
    character: T
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
  click: [payload: T]
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
    <div
      :class="[
        mini ? 'h-10 w-10' : 'h-16 w-16',
        { 'ring-4': selected },
        { [colorClasses.ring]: selected }
      ]"
      class="mb-1 overflow-hidden rounded-full transition"
    >
      <img
        v-if="props.character.image"
        :src="props.character.image"
        :alt="props.character.name"
        draggable="false"
        class="h-full w-full object-cover"
      />
      <UserCircleIcon v-else class="h-full w-full object-cover text-gray-500" />
    </div>

    <h2 v-if="!mini" class="line-clamp-2 w-[6.58rem] max-w-full text-sm font-bold text-gray-800">
      {{ props.character.name }}
    </h2>
  </button>
</template>
