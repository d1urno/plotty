<script setup lang="ts">
import DropdownInput from '@/components/form/DropdownInput.vue'
import useURLObjectRef from '@/composables/useURLObjectRef'
import { PresetCharacterGroups } from '@/constants/rules'
import { computed, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useStore } from '@/stores'
import TextInput from '@/components/form/TextInput.vue'
import CharacterFormModal from '@/components/CharacterFormModal.vue'
import CharacterGroupFormModal from '@/components/CharacterGroupFormModal.vue'
import MagnifyingGlassCircleIcon from '@/components/icons/MagnifyingGlassCircleIcon.vue'
import PlusCircleIcon from '@/components/icons/PlusCircleIcon.vue'
import GroupFilters from '@/components/GroupFilters.vue'
import CustomGroupFilters from '@/components/CustomGroupFilters.vue'

const filterModel = defineModel<{ name?: string; gender?: string }>('filterModel', {
  default: { name: undefined, gender: undefined, species: undefined, status: undefined } // Default values need to be specified to sync with URL
})

const customFilterModel = defineModel<{ [key: string]: string | undefined }>('customFilterModel')

const isUrlFilterLoadedModel = defineModel<boolean>('isUrlFilterLoadedModel')

const filterURLModel = useURLObjectRef(filterModel)
const { selectedCharacterGroup, customCharacterGroups } = storeToRefs(useStore())

const isSearchOpen = ref(false)
const characterFormModal = ref<{ visible: boolean }>()
const characterGroupFormModal = ref<{ visible: boolean }>()

const selectedGroup = computed(() =>
  customCharacterGroups.value.find((cc) => cc.id === selectedCharacterGroup.value.selectedGroupId)
)

const customFilterInitialEmptyKeys = computed(() =>
  selectedGroup.value?.fields.reduce(
    (acc, field) => {
      acc[field] = undefined
      return acc
    },
    {} as Record<string, undefined>
  )
)

const customCharacterGroupOptions = computed(() => [
  ...Object.values(PresetCharacterGroups).map((g) => ({ label: g, value: g })),
  ...customCharacterGroups.value.map((g) => ({ label: g.title, value: g.id }))
])

function onCreateNewCharacter() {
  characterFormModal.value = { visible: true }
}

function onCreateNewCharacterGroup() {
  characterGroupFormModal.value = { visible: true }
}

onMounted(() => {
  isUrlFilterLoadedModel.value = true
  if (filterURLModel.value.name?.length) isSearchOpen.value = true
})

function onCharacterGroupChange(event: Event) {
  const option = customCharacterGroupOptions.value.find(
    (option) => option.value === (event.target as HTMLSelectElement).value
  )
  if (!option) return
  selectedCharacterGroup.value.selectedGroupId = option.value
}

function onSearchToggle() {
  if (isSearchOpen.value) {
    filterURLModel.value.name = undefined
    isSearchOpen.value = false
  } else isSearchOpen.value = true
}
</script>

<template>
  <div class="flex flex-col gap-2">
    <div class="flex items-center gap-4">
      <DropdownInput
        :label="$t('GroupActionsBar.characterGroup.label')"
        :show-label="false"
        :model-value="selectedCharacterGroup.selectedGroupId"
        :options="customCharacterGroupOptions"
        class="w-full"
        @input="onCharacterGroupChange"
      />

      <button type="button" @click="onSearchToggle">
        <MagnifyingGlassCircleIcon class="-m-2 h-12 w-12 text-blue-500" />
      </button>
    </div>

    <TextInput
      v-if="isSearchOpen"
      v-model="filterURLModel.name"
      :show-label="false"
      focus
      autocomplete="off"
      :label="$t('GroupActionsBar.characterSearch.label')"
      :placeholder="$t('GroupActionsBar.characterSearch.placeholder')"
      :debounce="300"
    />

    <div class="scrollbar-hidden -mx-4 -my-1 flex items-center gap-4 overflow-x-auto px-4 py-1">
      <button
        type="button"
        class="flex w-max shrink-0 items-center gap-2 rounded-md bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-500"
        @click="onCreateNewCharacter"
      >
        <PlusCircleIcon class="h-4 w-4" />
        {{ $t('GroupActionsBar.newCharacter') }}
      </button>

      <button
        type="button"
        class="flex w-max shrink-0 items-center gap-2 rounded-md bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-500"
        @click="onCreateNewCharacterGroup"
      >
        <PlusCircleIcon class="h-4 w-4" />
        {{ $t('GroupActionsBar.newGroup') }}
      </button>

      <div>
        <GroupFilters v-model="filterURLModel" />
        <CustomGroupFilters
          v-if="customFilterInitialEmptyKeys"
          v-model="customFilterModel"
          :initial-keys="customFilterInitialEmptyKeys"
        />
      </div>
    </div>

    <CharacterFormModal v-if="characterFormModal" v-model="characterFormModal" />
    <CharacterGroupFormModal v-if="characterGroupFormModal" v-model="characterGroupFormModal" />
  </div>
</template>
