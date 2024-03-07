<script setup lang="ts">
import TextInput from '@/components/form/TextInput.vue'
import DropdownInput from '@/components/form/DropdownInput.vue'
import useURLObjectRef from '@/composables/useURLObjectRef'
import { ENUMS_TRANSLATION_KEY, StoryStyle } from '@/constants/rules'
import useEnum from '@/composables/useEnum'

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
      :label="$t('StoryFilters.inputs.search.label')"
      :show-label="false"
      :placeholder="$t('StoryFilters.inputs.search.placeholder')"
      :debounce="300"
      class="w-full"
      @update:model-value="onSearchChange"
    />

    <DropdownInput
      :label="$t('StoryFilters.inputs.style.label')"
      :show-label="false"
      :value="filterURLModel.style"
      :options="[
        { label: $t(`${ENUMS_TRANSLATION_KEY}.StoryStyle.all`), value: '' },
        ...useEnum(StoryStyle).toOptions()
      ]"
      class="w-48"
      @input="onTypeChange"
    />
  </div>
</template>
