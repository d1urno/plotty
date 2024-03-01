<script setup lang="ts" generic="T extends BaseCharacter">
import { computed } from 'vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import useCharacterItem from '@/composables/useCharacterItem'
import type { BaseCharacter } from '@/types/local'
import UserCircleIcon from '@/components/icons/UserCircleIcon.vue'
import FileInput from '@/components/form/FileInput.vue'
import useToast from '@/composables/useToast'
import getAdditionalEntries from '@/functions/getAdditionalEntries'
import { CUSTOM_CHARACTER_KEYS_TO_OMIT, RICK_AND_MORTY_SUB_KEYS_TO_OMIT } from '@/constants/rules'

const props = defineProps<{
  character: T
  horizontal?: boolean
  editable?: boolean
}>()

const imageModel = defineModel<string>('imageModel')

const variables = computed(() => ({ id: props.character.id }))
const { characterItem, loading } = useCharacterItem(variables)
const { showToast } = useToast()

const mergedCharacterData = computed(() => {
  if (!characterItem.value) return props.character
  return { ...props.character, ...characterItem.value }
})

function getObjectValues(obj: unknown) {
  return Object.values(obj as Record<string, unknown>)
    .map((value) => value)
    .join(', ')
}

const additionalProperties = computed(() => {
  if (!mergedCharacterData.value) return {}
  return Object.fromEntries(
    getAdditionalEntries(
      mergedCharacterData.value,
      CUSTOM_CHARACTER_KEYS_TO_OMIT,
      RICK_AND_MORTY_SUB_KEYS_TO_OMIT
    )
  )
})

function onInvalidFileDrop(message: string) {
  showToast({ content: message, type: 'error', duration: 5000, closable: true })
}
</script>

<template>
  <span v-if="!mergedCharacterData && loading"><LoadingSpinner /></span>
  <div
    v-else
    class="flex w-full flex-col items-center justify-center"
    :class="{ 'h-80': !horizontal }"
  >
    <div class="flex h-full w-full flex-col items-center justify-center">
      <div
        class="flex h-full w-full items-center justify-center p-4"
        :class="{
          'flex-col': !horizontal,
          'gap-6 text-left': horizontal
        }"
      >
        <div class="h-32 w-32" :class="{ 'flex-none': horizontal }">
          <FileInput
            v-if="editable"
            v-model="imageModel"
            crop
            label="Upload image"
            shape="circle"
            @invalid-image="onInvalidFileDrop('Invalid image format')"
            @invalid-size="onInvalidFileDrop('The image size is too big')"
          />
          <template v-else>
            <img
              v-if="mergedCharacterData?.image"
              :src="mergedCharacterData.image"
              :alt="mergedCharacterData.name"
              draggable="false"
              class="h-full w-full rounded-full object-cover"
            />
            <UserCircleIcon v-else class="h-full w-full object-cover text-gray-500" />
          </template>
        </div>
        <div
          v-if="mergedCharacterData"
          class="flex h-full flex-col justify-center"
          :class="{
            'w-full items-center': !horizontal,
            'w-40': horizontal
          }"
        >
          <h2 class="text-xl font-bold text-gray-800">
            {{ mergedCharacterData.name }}
          </h2>
          <p v-if="Object.keys(additionalProperties)[0]" class="text-sm text-gray-600">
            {{ additionalProperties[Object.keys(additionalProperties)[0]] }}
          </p>
        </div>
      </div>

      <!-- Additional details loaded after initial render -->
      <div class="flex min-h-[6rem] w-96 max-w-full justify-center lg:w-auto">
        <LoadingSpinner v-if="loading" />
        <div
          v-else-if="Object.keys(additionalProperties).length"
          class="flex flex-wrap gap-x-6 gap-y-2 px-4 pb-4"
        >
          <div v-for="(property, key) in additionalProperties" :key="key" class="text-gray-400">
            <span v-if="property && typeof property === 'object'">
              <span class="block text-sm font-semibold capitalize">{{ key }}</span>
              <span class="font-bold capitalize text-blue-500">
                {{ getObjectValues(property) }}
              </span>
            </span>
            <template v-else>
              <span class="block text-sm font-semibold capitalize">{{ key }}</span>
              <span class="font-bold capitalize text-blue-500">
                {{ property }}
              </span>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
