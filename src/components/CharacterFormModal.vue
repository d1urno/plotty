<script setup lang="ts">
import GenericModal from '@/components/GenericModal.vue'
import useCharacterForm from '@/composables/useCharacterForm'
import TextInput from '@/components/form/TextInput.vue'
import { storeToRefs } from 'pinia'
import { useStore } from '@/stores'
import {
  CUSTOM_CHARACTER_GROUP_ID,
  CUSTOM_CHARACTER_GROUP_NAME,
  CUSTOM_CHARACTER_ID_PREFIX,
  CUSTOM_CHARACTER_KEYS_TO_OMIT
} from '@/constants/rules'
import type { CustomCharacter } from '@/types/local'
import PlusCircleIcon from '@/components/icons/PlusCircleIcon.vue'
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watchEffect } from 'vue'
import XMarkIcon from '@/components/icons/XMarkIcon.vue'
import CharacterBio from '@/components/CharacterBio.vue'
import DropdownInput from '@/components/form/DropdownInput.vue'
import getAdditionalEntries from '@/functions/getAdditionalEntries'
import defaultCharacterGroupFormData from '@/constants/defaultCharacterGroupFormData'

const model = defineModel<{ visible: boolean; isEditing?: boolean }>()

const { selectedCharacterGroupId, customCharacterGroups } = storeToRefs(useStore())
const { formData: characterFormData, getPayload, resetFormData } = useCharacterForm()

const infoRows = ref<[string, string][]>([])

onMounted(() => {
  // If editing, set the additional data to the infoRows form
  if (model.value?.isEditing) {
    infoRows.value = getAdditionalEntries(characterFormData.value, CUSTOM_CHARACTER_KEYS_TO_OMIT)
  }
})

const groupIdModel = ref(
  customCharacterGroups.value.some((cl) => cl.id === selectedCharacterGroupId.value)
    ? selectedCharacterGroupId.value
    : CUSTOM_CHARACTER_GROUP_ID
)

watchEffect(() => {
  // If the group changes, reset the additional data form
  infoRows.value = Object.entries(
    customCharacterGroups.value
      .find((cl) => cl.id === groupIdModel.value)
      ?.fields.reduce((acc, field) => ({ ...acc, [field]: '' }), {}) ?? {}
  )
})

const groupOptions = computed(() => [
  { label: CUSTOM_CHARACTER_GROUP_NAME, value: CUSTOM_CHARACTER_GROUP_ID },
  ...customCharacterGroups.value
    .filter((cl) => cl.id !== CUSTOM_CHARACTER_GROUP_ID)
    .map((g) => ({ label: g.title, value: g.id }))
])

const groupTitle = computed(
  () => customCharacterGroups.value.find((cc) => cc.id === selectedCharacterGroupId.value)?.title
)

const additionalData = computed(() =>
  Object.fromEntries(infoRows.value.filter((row) => row[0].length && row[1].length) ?? [])
)

function onUpdateKey(value: string, index: number) {
  infoRows.value[index][0] = value
}

function onUpdateValue(value: string, index: number) {
  infoRows.value[index][1] = value
}

function filterAdditionalData(obj: Record<string, string>) {
  return Object.fromEntries(
    Object.entries(obj).filter(([key]) => CUSTOM_CHARACTER_KEYS_TO_OMIT.includes(key))
  )
}

async function onSaveCharacter(close: () => void) {
  characterFormData.value = {
    ...filterAdditionalData(characterFormData.value as Record<string, string>),
    ...additionalData.value
  }
  let customCharacterGroup = customCharacterGroups.value.find((g) => g.id === groupIdModel.value)
  const payload = { ...getPayload() } as CustomCharacter

  if (model.value?.isEditing && customCharacterGroup) {
    // If the group changes, remove the character from the old group
    if (characterFormData.value.groupId !== groupIdModel.value) {
      const oldGroup = customCharacterGroups.value.find(
        (g) => g.id === characterFormData.value.groupId
      )
      const index = oldGroup?.characters.findIndex((c) => c.id === payload.id)
      if (index === undefined || index === -1) return
      oldGroup?.characters.splice(index, 1)

      // Add the character to the new group
      payload.groupId = groupIdModel.value
      customCharacterGroup.characters = [payload, ...customCharacterGroup.characters]

      // Close and navigate to the new group
      selectedCharacterGroupId.value = customCharacterGroup.id
      close()
      return
    }

    // If editing and the group is the same, just update the character
    const index = customCharacterGroup.characters.findIndex((c) => c.id === payload.id)
    if (index === undefined || index === -1) return
    customCharacterGroup.characters.splice(index, 1, payload)
    close()
    return
  }

  payload.id = `${CUSTOM_CHARACTER_ID_PREFIX}${payload.id}`

  // If creating a new character, create the group if it doesn't exist
  if (!customCharacterGroup) {
    payload.groupId = CUSTOM_CHARACTER_GROUP_ID
    customCharacterGroup = {
      ...defaultCharacterGroupFormData,
      id: CUSTOM_CHARACTER_GROUP_ID,
      title: CUSTOM_CHARACTER_GROUP_NAME,
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
      characters: [payload]
    }
    customCharacterGroups.value = [customCharacterGroup, ...customCharacterGroups.value]
    selectedCharacterGroupId.value = customCharacterGroup.id
  } else {
    selectedCharacterGroupId.value = customCharacterGroup.id
    // Next tick just to see the animation
    await nextTick(() => {
      if (!customCharacterGroup) return
      payload.groupId = customCharacterGroup.id
      const index = customCharacterGroups.value.findIndex((g) => g.id === groupIdModel.value)
      customCharacterGroup.updated = new Date().toISOString()
      customCharacterGroup.characters = [payload, ...customCharacterGroup.characters]
      customCharacterGroups.value.splice(index, 1, customCharacterGroup)
    })
  }
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
    max-width-class="max-w-3xl"
    @close="model = undefined"
  >
    <template #title>
      <span v-if="!model.isEditing"> Create a new character</span>
      <span v-else>Edit character</span>
    </template>

    <div>
      <div class="mb-4 flex flex-col gap-4">
        <div class="flex flex-col items-start gap-4 md:flex-row">
          <div class="flex w-full flex-col gap-4">
            <TextInput
              v-model="characterFormData.name"
              label="Character name"
              autocomplete="off"
              class="flex-1"
            />
            <DropdownInput
              v-model="groupIdModel"
              :options="groupOptions"
              label="Group"
              class="flex-1"
            />
          </div>
          <div class="mx-auto">
            <CharacterBio
              v-model:image-model="characterFormData.image"
              editable
              :character="{
                name: characterFormData.name,
                image: characterFormData.image, // TS does not recognize if spreading the formData
                created: new Date().toISOString(),
                updated: new Date().toISOString(),
                id: CUSTOM_CHARACTER_ID_PREFIX,
                ...additionalData
              }"
              class="-m-7 w-min scale-75 rounded-md bg-gray-100 md:-m-10"
              horizontal
            />
          </div>
        </div>
        <div class="mx-8 flex items-center justify-center gap-8">
          <hr class="flex-1" />
          Character attributes
          <hr class="flex-1" />
        </div>
        <div
          class="grid gap-4 rounded-md p-4 md:grid-cols-3"
          :class="{
            'bg-blue-200/30': groupIdModel === CUSTOM_CHARACTER_GROUP_ID,
            'bg-green-200/30': groupIdModel !== CUSTOM_CHARACTER_GROUP_ID
          }"
        >
          <p
            class="text-xs md:col-span-3"
            :class="{
              'text-blue-500': groupIdModel === CUSTOM_CHARACTER_GROUP_ID,
              'text-green-500': groupIdModel !== CUSTOM_CHARACTER_GROUP_ID
            }"
          >
            <template v-if="groupIdModel === CUSTOM_CHARACTER_GROUP_ID">
              Add attributes or characteristics of your character that are relevant to know as
              context for your stories, like
              <span class="font-bold">Origin</span>: <span class="font-bold">Planet Earth</span>,
              <span class="font-bold">Species</span>: <span class="font-bold">Human</span>,
              <span class="font-bold">Hobby</span>: <span class="font-bold">Likes to read</span>
            </template>

            <template v-else-if="infoRows.length">
              Complete the attributes required for
              <span class="font-semibold">{{ groupTitle }}</span> group, these will be relevant to
              know as context for your stories, and to filter your characters
            </template>

            <template v-else>
              There are no special attributes required for
              <span class="font-semibold">{{ groupTitle }}</span> group
            </template>
          </p>
          <button
            v-if="groupIdModel === CUSTOM_CHARACTER_GROUP_ID"
            type="button"
            class="col-span-3 flex w-max items-center gap-2 rounded-md bg-blue-200/50 px-2 py-1 text-xs font-semibold text-blue-500 disabled:text-gray-400"
            :disabled="infoRows.length >= 3"
            @click="infoRows = [...(infoRows ?? []), ['', '']]"
          >
            <PlusCircleIcon class="h-5 w-5" />
            Add row
          </button>
          <div
            v-for="(row, i) in infoRows"
            :key="i"
            class="flex gap-x-2 gap-y-4"
            :class="{ 'col-span-3': groupIdModel === CUSTOM_CHARACTER_GROUP_ID }"
          >
            <TextInput
              v-if="groupIdModel === CUSTOM_CHARACTER_GROUP_ID"
              :model-value="row[0]"
              label="Attribute"
              @update:model-value="onUpdateKey($event, i)"
            />
            <span v-if="groupIdModel === CUSTOM_CHARACTER_GROUP_ID" class="mt-8">:</span>
            <TextInput
              :model-value="row[1]"
              :label="`${row[0]}*`"
              class="mt-auto w-full"
              @update:model-value="onUpdateValue($event, i)"
            />
            <button
              v-if="groupIdModel === CUSTOM_CHARACTER_GROUP_ID"
              type="button"
              class="mt-6 text-xs font-semibold text-blue-500"
              @click="infoRows = infoRows.filter((_, index) => index !== i)"
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
          Cancel
        </button>
        <button
          type="button"
          class="rounded-md bg-blue-500 px-10 py-2 font-bold text-white disabled:bg-gray-200 disabled:text-gray-400"
          :disabled="!characterFormData.name || infoRows.some((row) => !row[0] || !row[1])"
          @click="onSaveCharacter(close)"
        >
          Done
        </button>
      </div>
    </template>
  </GenericModal>
</template>
