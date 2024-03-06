<script setup lang="ts" generic="T extends CustomCharacter">
import type { CustomCharacter } from '@/types/local'
import useModal from '@/composables/useModal'
import { storeToRefs } from 'pinia'
import { useStore } from '@/stores'
import { ref } from 'vue'
import useCharacterForm from '@/composables/useCharacterForm'
import CharacterFormModal from '@/components/CharacterFormModal.vue'

const props = defineProps<{
  character: T
}>()

const { customCharacterGroups } = storeToRefs(useStore())
const { formData: characterFormData } = useCharacterForm()
const { showModal } = useModal()

const characterFormModal = ref<{ visible: boolean; isEditing?: boolean }>()

function onEditCharacter() {
  characterFormData.value = { ...props.character } as { [key: string]: string }
  characterFormModal.value = { visible: true, isEditing: true }
}

function onDeleteCharacter() {
  showModal({
    title: 'Are you sure?',
    content: `The characater <b>${props.character.name}</b> will be deleted permanently.`,
    buttons: [
      {
        label: 'Delete',
        type: 'warning',
        callbackOrLink: (close) => {
          const characterList = customCharacterGroups.value.find(
            (cl) => cl.id === props.character.groupId
          )?.characters
          const index = characterList?.findIndex((c) => c.id === props.character.id)
          if (index !== undefined && index !== -1) characterList?.splice(index, 1)
          close()
        }
      }
    ]
  })
}
</script>

<template>
  <div>
    <div
      class="space-x-2 divide-x divide-gray-200 rounded-md bg-gray-100 px-2 py-1 text-xs font-semibold"
    >
      <button type="button" class="text-red-400" @click.stop="onDeleteCharacter">
        {{ $t('CharacterActions.buttons.remove') }}
      </button>
      <button type="button" class="pl-2 text-gray-400" @click.stop="onEditCharacter">
        {{ $t('CharacterActions.buttons.edit') }}
      </button>
    </div>
    <CharacterFormModal v-if="characterFormModal" v-model="characterFormModal" />
  </div>
</template>

<style scoped lang="postcss"></style>
