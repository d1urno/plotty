<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useStore } from '@/stores'
import DropdownInput from '@/components/form/DropdownInput.vue'
import { PresetCharacterGroups } from '@/constants/rules'

const filterURLModel = defineModel<{
  name?: string
  gender?: string
  species?: string
  status?: string
}>({ default: {} })

const { selectedCharacterGroup } = storeToRefs(useStore())

function onGenderChange(event: Event) {
  filterURLModel.value.gender = (event.target as HTMLSelectElement).value
}

function onSpeciesChange(event: Event) {
  filterURLModel.value.species = (event.target as HTMLSelectElement).value
}

function onStatusChange(event: Event) {
  filterURLModel.value.status = (event.target as HTMLSelectElement).value
}
</script>

<template>
  <div class="flex gap-4">
    <template
      v-if="selectedCharacterGroup.selectedGroupId === PresetCharacterGroups.RICK_AND_MORTY"
    >
      <DropdownInput
        label="Character gender"
        :show-label="false"
        mini
        :model-value="filterURLModel.gender"
        :options="[
          { label: $t('CustomGroupFilters.selectText', { title: 'gender' }), value: '' },
          { label: 'Male', value: 'Male' },
          { label: 'Female', value: 'Female' },
          { label: 'Unknown', value: 'unknown' },
          { label: 'Genderless', value: 'Genderless' }
        ]"
        @input="onGenderChange"
      />
      <DropdownInput
        label="Character species"
        :show-label="false"
        mini
        :model-value="filterURLModel.species"
        :options="[
          { label: $t('CustomGroupFilters.selectText', { title: 'species' }), value: '' },
          { label: 'Human', value: 'Human' },
          { label: 'Alien', value: 'Alien' },
          { label: 'Humanoid', value: 'Humanoid' },
          { label: 'Mythological Creature', value: 'Mythological Creature' },
          { label: 'Animal', value: 'Animal' },
          { label: 'Robot', value: 'Robot' },
          { label: 'Cronenberg', value: 'Cronenberg' },
          { label: 'Disease', value: 'Disease' },
          { label: 'Unknown', value: 'unknown' }
        ]"
        @input="onSpeciesChange"
      />
      <DropdownInput
        label="Character status"
        :show-label="false"
        mini
        :model-value="filterURLModel.status"
        :options="[
          { label: $t('CustomGroupFilters.selectText', { title: 'status' }), value: '' },
          { label: 'Alive', value: 'Alive' },
          { label: 'Dead', value: 'Dead' },
          { label: 'Unknown', value: 'unknown' }
        ]"
        @input="onStatusChange"
      />
    </template>
  </div>
</template>

<style scoped lang="postcss"></style>
