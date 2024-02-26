<script setup lang="ts">
import DraggableItem from '@/components/DraggableItem.vue'
import { Container } from 'vue3-dndrop'
import CharacterThumb from '@/components/CharacterThumb.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import { computed, ref } from 'vue'
import useCharacterListByIds from '@/composables/useCharacterListByIds'
import type { Character } from '@/types/generated'
import { useStore } from '@/stores'
import { storeToRefs } from 'pinia'
import type { Color } from '@/functions/getColorClasses'

const props = defineProps<{
  selectedCharacterIds: string[]
  highlightedCharacterIds?: string[]
  highlightColor?: Color
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

const { isDragging } = storeToRefs(useStore())
const draggingInto = ref(false)

const variables = computed(() => ({ ids: props.selectedCharacterIds }))

// Cache only as selection queries can be grouped on a parent component query
const { characterList } = useCharacterListByIds(variables, props.cacheOnly)

const selectedCharacters = computed(() =>
  characterList.value?.filter((cd) => props.selectedCharacterIds.includes(cd.id))
)

function onDrop(data: { payload: { item: Character; from?: string } }) {
  draggingInto.value = false
  emit('drop', data.payload)
}

function onCardClick(character: Pick<Character, 'id' | 'name' | 'image' | 'species'>) {
  emit('click', character)
}

function onDragEnter() {
  draggingInto.value = true
}

function onDragLeave() {
  draggingInto.value = false
}
</script>

<template>
  <div>
    <h1 class="mb-4 hidden text-2xl font-bold lg:block">{{ label }}</h1>
    <div
      class="relative h-full min-h-[8rem] lg:h-auto"
      :class="{
        'box-content rounded border-2 border-dashed border-blue-700/65': !readonly,
        'bg-blue-300/50': draggingInto
      }"
    >
      <p class="m-2 text-left font-bold lg:hidden">{{ label }}</p>
      <div v-if="loading" class="flex h-full items-center justify-center">
        <LoadingSpinner />
      </div>

      <div
        v-else-if="!selectedCharacters?.length && !readonly"
        class="absolute inset-0 flex h-full items-center justify-center p-4 text-center text-blue-700/65"
      >
        <p class="w-48 select-none">Drag and drop characters here...</p>
      </div>

      <ul
        v-else-if="selectedCharacters?.length"
        class="relative z-10 flex flex-wrap sm:grid sm:grid-cols-2 md:grid-cols-3"
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
            <CharacterThumb
              :character="item"
              :selected="highlightedCharacterIds?.includes(item.id)"
              :selected-color="highlightColor"
              @click="onCardClick(item)"
            />
          </DraggableItem>
        </transition-group>
      </ul>
      <Container
        :group-name="selectionName"
        :should-accept-drop="() => true"
        :should-animate-drop="() => false"
        class="!absolute inset-0 h-full w-full"
        :class="{ 'z-10': isDragging }"
        orientation="horizontal"
        @drop="onDrop"
        @drag-enter="onDragEnter"
        @drag-leave="onDragLeave"
      >
        <div></div>
      </Container>
    </div>
  </div>
</template>

<style scoped lang="postcss"></style>
