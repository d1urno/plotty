<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useStore } from '@/stores'
import DropdownInput from '@/components/form/DropdownInput.vue'
import { computed } from 'vue'
import useURLObjectRef from '@/composables/useURLObjectRef'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
  initialKeys: Record<string, undefined>
}>()

const customFilterModel = defineModel<{ [key: string]: string | undefined }>({ default: {} })
customFilterModel.value = props.initialKeys // Because assigning props.initialKeys directly to default in the model is not allowed

const { selectedCharacterGroup, customCharacterGroups } = storeToRefs(useStore())
const { t } = useI18n()
const customFilterURLModel = useURLObjectRef(customFilterModel)

const selectedGroup = computed(() =>
  customCharacterGroups.value.find((cc) => cc.id === selectedCharacterGroup.value.selectedGroupId)
)

const filterOptions = computed(
  () =>
    selectedGroup.value?.fields.map((field) => {
      const charValues = selectedGroup.value?.characters.reduce(
        (acc, character) => {
          const fieldValue = character[field]
          if (fieldValue && typeof fieldValue === 'string') acc.push(fieldValue)
          return acc
        },
        [t('CustomGroupFilters.selectText', { title: field })] as string[]
      )
      return { label: field, values: Array.from(new Set(charValues)) }
    }) ?? []
)

function onFilterChange(event: Event, key: string) {
  if ((event.target as HTMLSelectElement).value.startsWith(t('CustomGroupFilters.selectText')))
    customFilterURLModel.value[key] = undefined // Reset the filter
  else customFilterURLModel.value[key] = (event.target as HTMLSelectElement).value
}
</script>

<template>
  <div class="flex gap-4">
    <DropdownInput
      v-for="(filter, i) in filterOptions"
      :key="i"
      :label="filter.label"
      :show-label="false"
      mini
      :model-value="
        customFilterURLModel[filter.label] ??
        $t('CustomGroupFilters.selectText', { title: filter.label })
      "
      :options="filter.values.map((value) => ({ label: value, value }))"
      @input="onFilterChange($event, filter.label)"
    />
  </div>
</template>

<style scoped lang="postcss"></style>
