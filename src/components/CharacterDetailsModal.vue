<script setup lang="ts">
import useStore from '@/stores'
import { storeToRefs } from 'pinia'
import GenericModal from '@/components/GenericModal.vue'
import CharacterBio from '@/components/CharacterBio.vue'
import { useBreakpoints } from '@vueuse/core'
import { computed } from 'vue'
import useCharacterSelectionActions from '@/composables/useCharacterSelectionActions'
import type { QueriedCharacterListItem } from '@/composables/useCharacterList'

const props = defineProps<{
  character: QueriedCharacterListItem
  selectableCharacters?: boolean
}>()

const model = defineModel<{ visible: boolean }>()

const { storyFormData } = storeToRefs(useStore())
const { onRoleAdd, isRoleFull } = useCharacterSelectionActions()
const breakpoints = useBreakpoints({ lg: 992 })
const lgAndLarger = breakpoints.greaterOrEqual('lg')

const isMainAddDisabled = computed(
  () =>
    isRoleFull('main') ||
    storyFormData.value.secondaryCharacters.includes(props.character.id) ||
    storyFormData.value.mainCharacters.includes(props.character.id)
)

const isSecondaryAddDisabled = computed(
  () =>
    isRoleFull('secondary') ||
    storyFormData.value.mainCharacters.includes(props.character.id) ||
    storyFormData.value.secondaryCharacters.includes(props.character.id)
)

async function onAddCharacter(role: 'main' | 'secondary') {
  onRoleAdd(props.character.id, role)
  if (model.value) model.value.visible = false
}
</script>

<template>
  <GenericModal
    v-if="model"
    v-model="model.visible"
    max-width-class="max-w-xl"
    @close="model = undefined"
  >
    <template #title>
      <h1 class="text-lg font-bold">Character details</h1>
    </template>

    <div class="flex gap-6">
      <CharacterBio :horizontal="lgAndLarger" :character-id="character.id" />
    </div>

    <template #footer="{ close }">
      <div class="flex w-full flex-col justify-end gap-4 lg:flex-row">
        <button
          type="button"
          class="rounded-md bg-gray-200 px-6 py-2 font-semibold text-gray-500"
          @click="close"
        >
          Close
        </button>
        <button
          v-if="selectableCharacters"
          class="rounded-md bg-blue-500 px-6 py-2 font-bold text-white disabled:bg-gray-300"
          type="button"
          :disabled="isSecondaryAddDisabled"
          @click="onAddCharacter('secondary')"
        >
          {{ isRoleFull('secondary') ? 'Secondary roles full' : 'Add to secondary roles' }}
        </button>
        <button
          v-if="selectableCharacters"
          class="rounded-md bg-blue-500 px-6 py-2 font-bold text-white disabled:bg-gray-300"
          type="button"
          :disabled="isMainAddDisabled"
          @click="onAddCharacter('main')"
        >
          {{ isRoleFull('main') ? 'Main roles full' : 'Add to main roles' }}
        </button>
      </div>
    </template>
  </GenericModal>
</template>