<script setup lang="ts">
import { computed, ref } from 'vue'
import { slugify } from '@/utils'

const props = withDefaults(
  defineProps<{
    label: string
    max?: number
    min?: number
    showLabel?: boolean
  }>(),
  {
    max: 100,
    min: 0,
    showLabel: true
  }
)

const model = defineModel<number>()

const inputRef = ref<HTMLInputElement | null>(null)

const slugLabel = computed(() => slugify(props.label))

function isNumber(value?: string | number): value is number {
  return !!value && !Number.isNaN(value)
}

function isValid(value: string | number): value is number {
  return isNumber(value) && value >= props.min && value <= props.max
}

const editableModel = computed({
  get: () => String(model.value),
  set: (value: number | string) => {
    if (isValid(value)) model.value = value
  }
})

function resetInputValue(event: Event) {
  if (!inputRef.value) return
  const input = event.target as HTMLInputElement
  if (!isNumber(input.value)) inputRef.value.value = String(editableModel.value)
  else if (input.value > props.max) {
    model.value = props.max
    inputRef.value.value = String(props.max)
  } else if (input.value < props.min) {
    model.value = props.min
    inputRef.value.value = String(props.min)
  }
}
</script>

<template>
  <label class="w-20" :for="`${slugLabel}-input`">
    <span v-if="showLabel" class="mb-2 block text-xs font-semibold">{{ label }}</span>
    <input
      :id="`${slugLabel}-input`"
      ref="inputRef"
      v-model="editableModel"
      v-bind="$attrs"
      type="number"
      :max="max"
      :min="min"
      class="form-input rounded-md border-2 border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-teal-500"
      @blur="resetInputValue"
    />
  </label>
</template>

<style scoped lang="postcss"></style>
