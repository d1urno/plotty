<script setup lang="ts" generic="T extends BaseCharacter[]">
import CharacterCard from '@/components/CharacterCard.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import { storeToRefs } from 'pinia'
import { useStore } from '@/stores'
import { Container, Draggable } from 'vue3-dndrop'
import { computed } from 'vue'
import useInfiniteScroll from '@/composables/useInfiniteScroll'
import useStoryForm from '@/composables/useStoryForm'
import type { BaseCharacter } from '@/types/local'

const props = defineProps<{
  characterList?: T
  loading?: boolean
  loadingNext?: boolean
}>()

const emit = defineEmits<{
  fetchNext: []
  click: [character: BaseCharacter]
}>()

const { isDragging } = storeToRefs(useStore())
const { formData: storyFormData } = useStoryForm()
const { infiniteScrollTrigger, infiniteScrollRoot } = useInfiniteScroll(() => emit('fetchNext'))

const selectedIds = computed(() => [
  ...storyFormData.value.mainCharacters,
  ...storyFormData.value.secondaryCharacters
])
const filteredCharacterList = computed(() =>
  props.characterList?.filter((character) => !selectedIds.value.includes(character.id))
)

function onCardClick(character: BaseCharacter) {
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
  <div ref="infiniteScrollRoot" class="flex h-full flex-col overflow-x-auto">
    <LoadingSpinner v-if="loading" class="m-auto" />

    <div v-else-if="!filteredCharacterList?.length" class="pt-8">
      {{ $t('CharacterCardListHorizontal.noResultsText') }}
    </div>

    <div v-else class="relative mb-2 flex">
      <Container
        class="grid grid-flow-col grid-rows-2"
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
            class="w-max"
          >
            <CharacterCard horizontal :character="character" @click="onCardClick(character)" />
          </Draggable>
        </transition-group>
        <span class="row-span-2 flex h-full w-20">
          <span ref="infiniteScrollTrigger"></span>
          <LoadingSpinner v-if="loadingNext" class="m-auto" />
        </span>
      </Container>
    </div>
  </div>
</template>
