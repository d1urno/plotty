<script setup lang="ts">
import CharacterCard from '@/components/CharacterCard.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import { storeToRefs } from 'pinia'
import { useStore } from '@/stores'
import { computed } from 'vue'
import useInfiniteScroll from '@/composables/useInfiniteScroll'
import { Container, Draggable } from 'vue3-dndrop'
import type { QueriedCharacterList, QueriedCharacterListItem } from '@/composables/useCharacterList'

const props = defineProps<{
  characterList: QueriedCharacterList
  loading?: boolean
  loadingNext?: boolean
}>()

const emit = defineEmits<{
  fetchNext: []
  click: [character: QueriedCharacterListItem]
}>()

const { storyFormData, isDragging } = storeToRefs(useStore())
const { infiniteScrollTrigger, infiniteScrollRoot } = useInfiniteScroll(() => emit('fetchNext'))

const selectedIds = computed(() => [
  ...storyFormData.value.mainCharacters,
  ...storyFormData.value.secondaryCharacters
])
const filteredCharacterList = computed(() =>
  props.characterList?.filter((character) => !selectedIds.value.includes(character.id))
)

function onCardClick(character: QueriedCharacterListItem) {
  emit('click', character)
}

function getChildPayload(index: number) {
  return { item: filteredCharacterList.value?.[index] }
}

function onDragStart() {
  isDragging.value = true
}

function onDragEnd() {
  isDragging.value = false
}
</script>

<template>
  <div ref="infiniteScrollRoot" class="scrollbar-gutter flex h-full flex-col overflow-y-auto">
    <LoadingSpinner v-if="loading" class="mx-auto pt-8" />

    <div v-else-if="!filteredCharacterList?.length" class="pt-8">No results found...</div>

    <div v-else class="relative pb-[80px]">
      <Container
        class="grid lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-6"
        behaviour="copy"
        :drag-class="'rotate-12 transform transition'"
        :drop-class="'rotate-0'"
        :get-child-payload="getChildPayload"
        :drag-begin-delay="100"
        fire-related-events-only
        @drag-start="onDragStart"
        @drag-end="onDragEnd"
      >
        <transition-group name="list" appear>
          <Draggable
            v-for="character in filteredCharacterList"
            :key="character.id"
            :item="character"
          >
            <CharacterCard :character="character" @click="onCardClick(character)" />
          </Draggable>
        </transition-group>
      </Container>

      <span ref="infiniteScrollTrigger"></span>

      <div class="text-center">
        <LoadingSpinner
          v-if="loadingNext"
          class="!absolute !h-0 -translate-x-1/2 -translate-y-full"
        />
      </div>
    </div>
  </div>
</template>
