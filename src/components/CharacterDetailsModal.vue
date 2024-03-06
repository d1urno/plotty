<script setup lang="ts" generic="T extends BaseCharacter">
import GenericModal from '@/components/GenericModal.vue'
import CharacterBio from '@/components/CharacterBio.vue'
import { useBreakpoints } from '@vueuse/core'
import { computed } from 'vue'
import useStoryFormActions from '@/composables/useStoryFormActions'
import useStoryForm from '@/composables/useStoryForm'
import type { BaseCharacter } from '@/types/local'
import CharacterActions from '@/components/CharacterActions.vue'
import isCustomCharacter from '@/functions/isCustomCharacter'

const props = defineProps<{
  character: T
  selectableCharacters?: boolean
}>()

const model = defineModel<{ visible: boolean }>()

const { formData: storyFormData } = useStoryForm()
const { onRoleAdd, isRoleFull } = useStoryFormActions()
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
    max-width-class="max-w-2xl"
    @close="model = undefined"
  >
    <template #title>
      <div class="flex justify-between">
        <h1 class="text-lg font-bold">{{ $t('CharacterDetailsModal.title') }}</h1>
        <CharacterActions v-if="isCustomCharacter(props.character)" :character="props.character" />
      </div>
    </template>

    <div class="flex gap-6">
      <CharacterBio :horizontal="lgAndLarger" :character="props.character" />
    </div>

    <template #footer="{ close }">
      <div class="flex w-full flex-col justify-end gap-4 lg:flex-row">
        <button
          type="button"
          class="rounded-md bg-gray-200 px-6 py-2 font-semibold text-gray-500"
          @click="close"
        >
          {{ $t('CharacterDetailsModal.buttons.close') }}
        </button>
        <button
          v-if="selectableCharacters"
          class="rounded-md bg-blue-500 px-6 py-2 font-bold text-white disabled:bg-gray-300"
          type="button"
          :disabled="isSecondaryAddDisabled"
          @click="onAddCharacter('secondary')"
        >
          {{
            isRoleFull('secondary')
              ? $t('CharacterDetailsModal.buttons.secondaryRoles.full')
              : $t('CharacterDetailsModal.buttons.secondaryRoles.add')
          }}
        </button>
        <button
          v-if="selectableCharacters"
          class="rounded-md bg-blue-500 px-6 py-2 font-bold text-white disabled:bg-gray-300"
          type="button"
          :disabled="isMainAddDisabled"
          @click="onAddCharacter('main')"
        >
          {{
            isRoleFull('main')
              ? $t('CharacterDetailsModal.buttons.mainRoles.full')
              : $t('CharacterDetailsModal.buttons.mainRoles.add')
          }}
        </button>
      </div>
    </template>
  </GenericModal>
</template>
