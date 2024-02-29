<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useStore } from '@/stores'
import DropdownInput from '@/components/form/DropdownInput.vue'
import { PresetCharacterGroups } from '@/constants/rules'

const filterURLModel = defineModel<{ name?: string; gender?: string }>({ default: {} })

const { selectedCharacterGroupId } = storeToRefs(useStore())

function onGenderChange(event: Event) {
  filterURLModel.value.gender = (event.target as HTMLSelectElement).value
}
</script>

<template>
  <div class="flex gap-4">
    <DropdownInput
      v-if="selectedCharacterGroupId === PresetCharacterGroups.RICK_AND_MORTY"
      label="Character gender"
      :show-label="false"
      mini
      :model-value="filterURLModel.gender"
      :options="[
        { label: 'All genders', value: '' },
        { label: 'Male', value: 'Male' },
        { label: 'Female', value: 'Female' },
        { label: 'Unknown', value: 'unknown' },
        { label: 'Genderless', value: 'Genderless' }
      ]"
      @input="onGenderChange"
    />
  </div>
</template>

<style scoped lang="postcss"></style>
