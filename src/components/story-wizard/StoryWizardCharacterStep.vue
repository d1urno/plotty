<script setup lang="ts">
import type { Character } from '@/types/generated'
import CharacterThumb from '@/components/CharacterThumb.vue'
import useCharacterListByIds from '@/composables/useCharacterListByIds'
import { computed } from 'vue'
import GenericCard from '@/components/GenericCard.vue'
import useStoryForm from '@/composables/useStoryForm'

const { formData: storyFormData } = useStoryForm()

const variables = computed(() => ({ ids: storyFormData.value.mainCharacters }))

// Cache only as selection queries can be grouped on a parent component query
const { characterList } = useCharacterListByIds(variables, true)

function onCharacterClick({ id }: { id: Character['id'] }) {
  if (storyDecisionMakersModel.value.length === 1 && storyDecisionMakersModel.value[0] === id)
    return
  const index = storyDecisionMakersModel.value.indexOf(id)
  if (index === -1) storyDecisionMakersModel.value.push(id)
  else storyDecisionMakersModel.value.splice(index, 1)
}
</script>

<template>
  <div>
    <h1 class="text-center text-lg font-bold text-gray-800">
      Who of the main characters will need to take the decisions?
    </h1>
    <div class="scrollbar-hidden mb-12 mt-6 flex flex-wrap justify-center sm:flex">
      <GenericCard
        v-for="character in characterList"
        :key="character.id"
        :selected="storyFormData.decisionMakers.includes(character.id)"
        selected-color="orange"
        :item="{ id: character.id }"
        @click="onCharacterClick(character)"
      >
        <CharacterThumb :character="character" class="!p-0" tabindex="-1" />
      </GenericCard>
    </div>
    <p class="mx-auto mb-8 max-w-xl">
      The characters you select here will be the ones that will need to take a decision at the end
      of each chapter. <br />
    </p>
  </div>
</template>

<style scoped lang="postcss"></style>
