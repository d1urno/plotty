<script setup lang="ts">
import DropZone from '@/components/DropZone.vue'
import DraggableItem from '@/components/DraggableItem.vue'
import CharacterThumb from '@/components/CharacterThumb.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import { computed } from 'vue'
import useCharacterListByIds from '@/composables/useCharacterListByIds'
import type { Character } from '@/types/generated'

const props = defineProps<{
  selectedCharacterIds: string[]
  label?: string
  loading?: boolean
  selectionName?: string
  cacheOnly?: boolean
  readonly?: boolean // For presentational purposes, although we might have to divide this component into two
}>()

const emit = defineEmits<{
  drop: [{ item: Character; from?: string }]
  click: [Pick<Character, 'id' | 'name' | 'image' | 'species'>]
}>()

const variables = computed(() => ({ ids: props.selectedCharacterIds }))

// Cache only as selection queries can be grouped on a parent component query
const { characterList } = useCharacterListByIds(variables, props.cacheOnly)

const selectedCharacters = computed(() =>
  characterList.value?.filter((cd) => props.selectedCharacterIds.includes(cd.id))
)

function onDrop(payload: { item: unknown; from?: string }) {
  emit('drop', payload as { item: Character; from?: string })
}

function onCardClick(character: Pick<Character, 'id' | 'name' | 'image' | 'species'>) {
  emit('click', character)
}
</script>

<template>
  <div>
    <h1 class="mb-4 hidden text-2xl font-bold lg:block">{{ label }}</h1>
    <DropZone
      class="relative h-full min-h-[8rem] lg:h-auto"
      :class="{
        'box-content rounded border-2 border-dashed border-blue-700/65': !readonly
      }"
      @item-dropped="onDrop"
    >
      <p class="m-2 text-left font-bold lg:hidden">{{ label }}</p>
      <div v-if="loading" class="flex h-full items-center justify-center">
        <LoadingSpinner />
      </div>

      <div
        v-else-if="!selectedCharacters?.length && !readonly"
        class="absolute inset-0 flex h-full items-center justify-center p-4 text-center text-blue-700/65"
      >
        <p class="hidden w-48 select-none lg:block">Drag and drop characters here...</p>
        <p class="w-48 select-none lg:hidden">Select your characters...</p>
      </div>

      <ul
        v-else-if="selectedCharacters?.length"
        class="flex flex-wrap sm:grid-cols-2 md:grid-cols-3"
        :class="{
          'justify-start': readonly,
          'justify-center': !readonly
        }"
      >
        <transition-group name="list" appear>
          <DraggableItem
            v-for="item in selectedCharacters"
            :key="item.id"
            :item="item"
            :from="selectionName"
            :disabled="readonly"
          >
            <CharacterThumb :character="item" @click="onCardClick(item)" />
          </DraggableItem>
        </transition-group>
      </ul>
    </DropZone>
  </div>
</template>

<style scoped lang="postcss"></style>
