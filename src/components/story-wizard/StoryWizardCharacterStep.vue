<script setup lang="ts">
import CharacterThumb from '@/components/CharacterThumb.vue'
import useCharacterListByIds from '@/composables/useCharacterListByIds'
import { computed } from 'vue'
import GenericCard from '@/components/GenericCard.vue'
import useStoryForm from '@/composables/useStoryForm'
import useStoryFormActions from '@/composables/useStoryFormActions'

const { formData: storyFormData } = useStoryForm()
const { onDecisionMakersSelect } = useStoryFormActions()

const variables = computed(() => ({ ids: storyFormData.value.mainCharacters }))

// Cache only as selection queries can be grouped on a parent component query
const { characterList } = useCharacterListByIds(variables, true)
</script>

<template>
  <div>
    <h1 class="text-center text-lg font-bold text-gray-800">
      {{ $t('StoryWizardCharacterStep.title') }}
    </h1>
    <div class="scrollbar-hidden mb-12 mt-6 flex flex-wrap justify-center sm:flex">
      <GenericCard
        v-for="character in characterList"
        :key="character.id"
        :selected="storyFormData.decisionMakers.includes(character.id)"
        selected-color="orange"
        :item="{ id: character.id }"
        @click="onDecisionMakersSelect(character.id)"
      >
        <CharacterThumb :character="character" class="!p-0" tabindex="-1" />
      </GenericCard>
    </div>
    <p class="mx-auto mb-8 max-w-xl">{{ $t('StoryWizardCharacterStep.text') }}</p>
  </div>
</template>

<style scoped lang="postcss"></style>
