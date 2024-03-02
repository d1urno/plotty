<script setup lang="ts" generic="T">
import { slugify } from '@/utils'
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    label: string
    options: { label: string; value: T; icon?: string }[]
    showLabel?: boolean
    mini?: boolean
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
      :class="{
        'text-gray-400': !model,
        'w-max rounded-full border-green-300 bg-green-100 py-1 pr-8 text-xs text-green-700 focus:border-green-300 focus:ring-teal-500':
          mini,
        'rounded-md border-gray-300 p-2 pr-10 focus:border-blue-500 focus:ring-teal-500': !mini
      }"
      :name="`${slugLabel}-dropdown`"
      class="form-select block w-full border-2 border-gray-300 focus:outline-none"
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
