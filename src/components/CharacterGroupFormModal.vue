<script setup lang="ts">
import GenericModal from '@/components/GenericModal.vue'
import TextInput from '@/components/form/TextInput.vue'
import { storeToRefs } from 'pinia'
import { useStore } from '@/stores'
import { CUSTOM_CHARACTER_ID_PREFIX } from '@/constants/rules'
import type { CustomCharacterGroup } from '@/types/local'
import PlusCircleIcon from '@/components/icons/PlusCircleIcon.vue'
import XMarkIcon from '@/components/icons/XMarkIcon.vue'
import useCharacterGroupForm from '@/composables/useCharacterGroupForm'
import { onBeforeUnmount } from 'vue'

const model = defineModel<{ visible: boolean }>()

const { selectedCharacterGroup, customCharacterGroups } = storeToRefs(useStore())
const { formData: characterGroupFormData, getPayload, resetFormData } = useCharacterGroupForm()

function onUpdateKey(value: string, index: number) {
  characterGroupFormData.value.fields[index] = value
}

function onSaveNewCharacterGroup(close: () => void) {
  const payload = getPayload() as CustomCharacterGroup
  const newCharacterGroup = { ...payload, id: `${CUSTOM_CHARACTER_ID_PREFIX}${payload.id}` }
  customCharacterGroups.value = [newCharacterGroup, ...customCharacterGroups.value]
  selectedCharacterGroup.value = { selectedGroupId: newCharacterGroup.id }
  close()
}

onBeforeUnmount(() => {
  resetFormData()
})
</script>

<template>
  <GenericModal
    v-if="model"
    v-model="model.visible"
    max-width-class="max-w-2xl"
    @close="model = undefined"
  >
    <template #title>{{ $t('CharacterGroupFormModal.title') }}</template>

    <div>
      <div class="mb-4 flex flex-col gap-4">
        <div class="flex items-start gap-4">
          <div class="flex w-full flex-col gap-4">
            <TextInput
              v-model="characterGroupFormData.title"
              :label="$t('CharacterGroupFormModal.inputs.title.label')"
              autocomplete="off"
              class="flex-1"
            />
            <TextInput
              v-model="characterGroupFormData.description"
              :label="$t('CharacterGroupFormModal.inputs.description.label')"
              type="textarea"
              :placeholder="$t('CharacterGroupFormModal.inputs.description.placeholder')"
              rows="3"
            />
          </div>
        </div>
        <div class="mx-8 flex items-center justify-center gap-8">
          <hr class="flex-1" />
          {{ $t('CharacterGroupFormModal.groupAttributes.title') }}
          <hr class="flex-1" />
        </div>
        <div class="grid grid-cols-3 gap-4 rounded-md bg-green-200/30 p-4">
          <p class="col-span-3 text-xs text-green-500">
            {{ $t('CharacterGroupFormModal.groupAttributes.text1') }}
            <span class="font-bold">{{ $t('CharacterGroupFormModal.groupAttributes.text2') }}</span>
            {{ $t('CharacterGroupFormModal.groupAttributes.text3') }}
            <span class="font-bold">{{ $t('CharacterGroupFormModal.groupAttributes.text4') }}</span
            >{{ $t('CharacterGroupFormModal.groupAttributes.text5') }}
          </p>
          <div class="col-span-3">
            <button
              type="button"
              class="flex w-max items-center gap-2 rounded-md bg-green-200/50 px-2 py-1 text-xs font-semibold text-green-500 disabled:text-gray-400"
              :disabled="characterGroupFormData.fields.length >= 3"
              @click="characterGroupFormData.fields = [...characterGroupFormData.fields, '']"
            >
              <PlusCircleIcon class="h-5 w-5" />
              {{ $t('CharacterGroupFormModal.groupAttributes.buttons.addAttribute') }}
            </button>
          </div>
          <div
            v-for="(row, i) in characterGroupFormData.fields"
            :key="i"
            class="col-span-3 flex gap-x-2 gap-y-4 md:col-span-1"
          >
            <TextInput
              :model-value="row"
              :label="$t('CharacterGroupFormModal.groupAttributes.inputs.attribute.label')"
              class="w-full"
              @update:model-value="onUpdateKey($event, i)"
            />
            <button
              type="button"
              class="mt-6 text-xs font-semibold text-green-500"
              @click="
                characterGroupFormData.fields = characterGroupFormData.fields.filter(
                  (_, index) => index !== i
                )
              "
            >
              <XMarkIcon />
            </button>
          </div>
        </div>
      </div>
    </div>

    <template #footer="{ close }">
      <div class="flex justify-end gap-4">
        <button
          type="button"
          class="rounded-md bg-gray-200 px-10 py-2 font-bold text-gray-400"
          @click="close"
        >
          {{ $t('CharacterGroupFormModal.groupAttributes.buttons.cancel') }}
        </button>
        <button
          type="button"
          class="rounded-md bg-blue-500 px-10 py-2 font-bold text-white disabled:bg-gray-200 disabled:text-gray-400"
          :disabled="!characterGroupFormData.title"
          @click="onSaveNewCharacterGroup(close)"
        >
          {{ $t('CharacterGroupFormModal.groupAttributes.buttons.done') }}
        </button>
      </div>
    </template>
  </GenericModal>
</template>
