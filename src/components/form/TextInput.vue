<script setup lang="ts" generic="T">
import { computed } from 'vue'
import { slugify } from '@/utils'
import { useDebounceFn } from '@vueuse/core'

const props = withDefaults(
  defineProps<{
    label: string
    type?: 'text' | 'email' | 'password' | 'textarea'
    showLabel?: boolean
    debounce?: number
  }>(),
  {
    type: 'text',
    showLabel: true,
    debounce: 0
  }
)

const model = defineModel<string>()

function onInput(event: Event) {
  const target = event.target as HTMLInputElement
  model.value = target.value
}

const onInputDebounced = useDebounceFn(onInput, props.debounce)

const slugLabel = computed(() => slugify(props.label))
</script>

<template>
  <label :for="`${slugLabel}-text-input`">
    <span v-if="showLabel" class="mb-2 block text-xs font-semibold">
      <slot name="label">{{ label }}</slot>
    </span>
    <textarea
      v-if="type === 'textarea'"
      :id="`${slugLabel}-text-input`"
      :value="model"
      v-bind="$attrs"
      style="resize: none"
      class="w-full rounded-md border-2 border-gray-300 p-2 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-teal-500"
      @input="onInputDebounced"
    />
    <input
      v-else
      :id="`${slugLabel}-text-input`"
      :value="model"
      v-bind="$attrs"
      :type="type"
      class="w-full rounded-md border-2 border-gray-300 p-2 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-teal-500"
      @input="onInputDebounced"
    />
  </label>
</template>

<style scoped lang="postcss"></style>
