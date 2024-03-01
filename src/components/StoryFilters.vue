<script setup lang="ts">
import TextInput from '@/components/form/TextInput.vue'
import DropdownInput from '@/components/form/DropdownInput.vue'
import useURLObjectRef from '@/composables/useURLObjectRef'

const filterModel = defineModel<{ name?: string; style?: string }>({ default: {} })
const filterURLModel = useURLObjectRef(filterModel)

function onSearchChange(value: string) {
  filterURLModel.value.name = value
}

function onTypeChange(event: Event) {
  filterURLModel.value.style = (event.target as HTMLSelectElement).value
}
</script>

<template>
  <div class="flex items-start gap-4">
    <TextInput
      :model-value="filterURLModel.name"
      label="Story search"
      :show-label="false"
      placeholder="Search for a story"
      :debounce="300"
      class="w-full"
      @update:model-value="onSearchChange"
    />

    <DropdownInput
      label="Story type"
      :show-label="false"
      :value="filterURLModel.style"
      :options="[
        { label: 'All types', value: '' },
        { label: 'Narrative', value: 'Narrative' },
        { label: 'Script', value: 'Script' }
      ]"
      class="w-48"
      @input="onTypeChange"
    />
  </div>
</template>
