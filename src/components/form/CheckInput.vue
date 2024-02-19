<script setup lang="ts" generic="T">
import { computed } from 'vue'
import { slugify } from '@/utils'
import getColorClasses, { type Color } from '@/functions/getColorClasses'

const props = withDefaults(
  defineProps<{
    label: string
    tagStyle?: boolean
    color?: Color
    options: [T, T]
  }>(),
  {
    tagStyle: false,
    color: 'blue'
  }
)

const model = defineModel<T>()

const slugLabel = computed(() => slugify(props.label))
const colorClasses = computed(() => getColorClasses(props.color))
</script>

<template>
  <label
    :for="`${slugLabel}-checkbox-input`"
    :class="[
      { 'cursor-pointer rounded-full bg-opacity-80 px-4 py-2 text-white': tagStyle },
      { [colorClasses.bg]: tagStyle }
    ]"
    class="flex items-center gap-3"
  >
    <input
      :id="`${slugLabel}-checkbox-input`"
      :checked="model === props.options[1]"
      type="checkbox"
      class="form-checkbox h-5 w-5 rounded-full border-none text-transparent"
      @input="model = ($event.target as HTMLInputElement).checked ? options[1] : options[0]"
    />
    <span class="block text-xs font-semibold" :class="{ 'text-sm': tagStyle }">{{ label }}</span>
  </label>
</template>

<style scoped lang="postcss"></style>
