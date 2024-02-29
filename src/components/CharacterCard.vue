<script setup lang="ts" generic="T extends BaseCharacter">
import type { BaseCharacter } from '@/types/local'
import { computed } from 'vue'
import UserCircleIcon from '@/components/icons/UserCircleIcon.vue'

const props = defineProps<{
  character: T
  selected?: boolean // Not in use
  horizontal?: boolean
}>()

const emit = defineEmits<{
  click: [payload: T]
}>()

function onClick() {
  emit('click', props.character)
}

const additionalProperties = computed(() => {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const { id, created, updated, __typename, name, image, groupId, ...rest } = props.character
  return rest as Record<string, string>
})
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
        <div :class="{ 'mb-4 h-32 w-32': !horizontal, 'h-20 w-20': horizontal }">
          <!-- 👇🏼 pointer-events-none not to open the image on touch events -->
          <img
            v-if="props.character.image"
            :src="props.character.image"
            :alt="props.character.name"
            draggable="false"
            class="pointer-events-none h-full w-full rounded-full object-cover"
          />
          <UserCircleIcon
            v-else
            class="pointer-events-none h-full w-full rounded-full object-cover text-gray-500"
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
            {{ props.character.name }}
          </h2>
          <p
            v-if="Object.keys(additionalProperties)[0]"
            class="text-sm"
            :class="selected ? 'text-white' : 'text-gray-600'"
          >
            {{ additionalProperties[Object.keys(additionalProperties)[0]] }}
          </p>
        </div>
      </div>
    </button>
  </div>
</template>
