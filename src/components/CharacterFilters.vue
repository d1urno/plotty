<script setup lang="ts">
import DropdownInput from '@/components/form/DropdownInput.vue'
import TextInput from '@/components/form/TextInput.vue'
import useURLObjectRef from '@/composables/useURLObjectRef'

const filterModel = defineModel<{ name?: string; gender?: string }>({
  default: { name: undefined }
})
const filterURLModel = useURLObjectRef(filterModel)

function onSearchChange(value: string) {
  filterURLModel.value.name = value
}

function onGenderChange(event: Event) {
  filterURLModel.value.gender = (event.target as HTMLSelectElement).value
}
</script>

<template>
  <div class="flex items-start gap-4">
    <TextInput
      :model-value="filterURLModel.name"
      label="Character search"
      :show-label="false"
      placeholder="Search for a character"
      :debounce="300"
      class="w-full"
      @update:model-value="onSearchChange"
    />

    <DropdownInput
      label="Character gender"
      :show-label="false"
      :value="filterURLModel.gender"
      :options="[
        { label: 'All genders', value: '' },
        { label: 'Male', value: 'Male' },
        { label: 'Female', value: 'Female' },
        { label: 'Unknown', value: 'unknown' },
        { label: 'Genderless', value: 'Genderless' }
      ]"
      class="w-48"
      @input="onGenderChange"
    />
  </div>
</template>
