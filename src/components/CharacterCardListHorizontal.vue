<script setup lang="ts">
import CharacterCard from '@/components/CharacterCard.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import DraggableItem from '@/components/DraggableItem.vue'
import { storeToRefs } from 'pinia'
import useStore from '@/stores'
import { computed } from 'vue'
import useInfiniteScroll from '@/composables/useInfiniteScroll'
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

const { storyFormData } = storeToRefs(useStore())
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
</script>

<template>
  <div ref="infiniteScrollRoot" class="flex flex-col overflow-x-auto">
    <LoadingSpinner v-if="loading" class="mx-auto pt-8" />

    <div v-else-if="!filteredCharacterList?.length" class="pt-8">No results found...</div>

    <div v-else class="relative mb-2 flex">
      <ul class="grid grid-flow-col grid-rows-2">
        <transition-group name="list" appear>
          <DraggableItem
            v-for="character in filteredCharacterList"
            :key="character.id"
            :item="character"
            class="w-max"
          >
            <CharacterCard
              horizontal
              :character="character"
              :selected="selectedIds?.some((id) => id === character.id)"
              @click="onCardClick(character)"
            />
          </DraggableItem>
        </transition-group>
        <li class="row-span-2 h-full w-20">
          <LoadingSpinner v-if="loadingNext" class="absolute top-24 !h-0" />
        </li>
      </ul>

      <span ref="infiniteScrollTrigger"></span>
    </div>
  </div>
</template>