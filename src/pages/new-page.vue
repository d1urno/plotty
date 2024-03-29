<script setup lang="ts">
import { ref } from 'vue'
import useCharacterList from '@/composables/useCharacterList'
import CharacterCardList from '@/components/CharacterCardList.vue'
import CharacterCardListHorizontal from '@/components/CharacterCardListHorizontal.vue'
import { useBreakpoints } from '@vueuse/core'
import CharacterDetailsModal from '@/components/CharacterDetailsModal.vue'
import StoryForm from '@/components/StoryForm.vue'
import GroupActionsBar from '@/components/GroupActionsBar.vue'
import type { BaseCharacter } from '@/types/local'
import useCharacterForm from '@/composables/useCharacterForm'

useCharacterForm() // TODO: Remove the need to keep this in memory for the modal mutations to work

const characterModal = ref<{ visible: boolean; character: BaseCharacter }>()
const variables = ref<{
  filter?: { name?: string; gender?: string; species?: string; status?: string }
}>({})
const customVariables = ref<{ filter?: { [key: string]: string | undefined } }>({})
const isUrlFilterLoaded = ref(false)
const { characterList, fetchNext, loading, loadingNext } = useCharacterList(
  variables,
  customVariables,
  { isReady: isUrlFilterLoaded }
)

function onCardClick(character: BaseCharacter) {
  characterModal.value = { visible: true, character }
}

const breakpoints = useBreakpoints({ lg: 992 })
const lgAndLarger = breakpoints.greaterOrEqual('lg')
</script>

<template>
  <div class="flex h-full flex-col gap-2 lg:flex-row lg:gap-4">
    <StoryForm
      class="lg:order-0 order-1 flex-1 bg-blue-100 px-4 pt-4 ring-4 ring-white lg:w-[30rem] lg:flex-none lg:px-8 lg:pt-10"
    />

    <div
      class="order-0 mx-auto flex min-h-[26.5rem] w-full flex-col pt-8 lg:order-1 lg:max-w-[130rem]"
    >
      <GroupActionsBar
        v-model:filter-model="variables.filter"
        v-model:custom-filter-model="customVariables.filter"
        v-model:is-url-filter-loaded-model="isUrlFilterLoaded"
        class="mb-2 px-4 lg:pr-7"
      />

      <CharacterCardListHorizontal
        v-if="!lgAndLarger"
        :character-list="characterList"
        :loading="loading"
        :loading-next="loadingNext"
        @fetch-next="fetchNext"
        @click="onCardClick"
      />

      <CharacterCardList
        v-else
        :character-list="characterList"
        :loading="loading"
        :loading-next="loadingNext"
        @fetch-next="fetchNext"
        @click="onCardClick"
      />
    </div>

    <CharacterDetailsModal
      v-if="characterModal"
      v-model="characterModal"
      selectable-characters
      :character="characterModal.character"
    />
  </div>
</template>

<route lang="json">
{ "meta": { "weight": 3 } }
</route>
