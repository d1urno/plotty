<script setup lang="ts" generic="T">
import { slugify } from '@/utils'
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    label: string
    options: { label: string; value: T; icon?: string }[]
    showLabel?: boolean
  }>(),
  {
    showLabel: true
  }
)

const model = defineModel<T>()
const slugLabel = computed(() => slugify(props.label))
</script>

<template>
  <label :for="`${slugLabel}-dropdown`">
    <span v-if="showLabel" class="mb-2 block text-xs font-semibold">{{ label }}</span>
    <select
      :id="`${slugLabel}-dropdown`"
      :value="model"
      :class="{ 'text-gray-400': !model }"
      :name="`${slugLabel}-dropdown`"
      class="form-select block w-full rounded-md border-2 border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-teal-500"
      @input="model = ($event.target as HTMLSelectElement).value as typeof model"
    >
      <option
        v-for="option in options"
        :key="option.label"
        :value="option.value"
        :selected="option.value === model"
      >
        {{ option.label }}
      </option>
    </select>
  </label>
</template>

<style scoped lang="postcss"></style>
