<script setup lang="ts" generic="T extends string | number | boolean | object | null | undefined">
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/vue'
import { computed } from 'vue'
import { slugify } from '@/utils'
import ChevronUpDownIcon from '@/components/icons/ChevronUpDownIcon.vue'
import CheckIcon from '@/components/icons/CheckIcon.vue'
import type { ListOption } from '@/types/local'

const props = withDefaults(
  defineProps<{
    label: string
    options: (ListOption<T> & { placeholder?: boolean })[]
    multiple?: boolean
    showLabel?: boolean
    placeholderValue?: T
  }>(),
  {
    showLabel: true,
    placeholderValue: undefined
  }
)

// This type needs testing to confirm it works as expected
const model = defineModel<ListOption<T> | ListOption<T>[]>()

const slugLabel = computed(() => slugify(props.label))
const buttonLabel = computed(() => {
  if (props.multiple && Array.isArray(model.value))
    return model.value.map((item) => item.label).join(', ')
  return props.options.find((option) => option.value === model.value)?.label
})

const isPlaceholder = computed(() => {
  if (props.placeholderValue === undefined) return false
  if (Array.isArray(model.value)) return model.value[0].value === props.placeholderValue
  return model.value?.value === props.placeholderValue
})
</script>

<template>
  <label :for="`${slugLabel}-dropdown`">
    <span v-if="showLabel" class="mb-2 block text-xs font-semibold">{{ label }}</span>
    <Listbox v-model="model" :multiple="props.multiple" by="value">
      <div class="relative mt-1">
        <ListboxButton
          class="w-full cursor-default rounded-md border-2 border-gray-300 p-2 pr-10 text-left focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          <span class="block truncate" :class="{ 'text-gray-400': isPlaceholder }">
            {{ buttonLabel }}
          </span>
          <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronUpDownIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
          </span>
        </ListboxButton>

        <transition
          leave-active-class="transition duration-100 ease-in"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <ListboxOptions
            class="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm"
          >
            <ListboxOption
              v-for="item in props.options"
              v-slot="{ active, selected }"
              :key="item.label"
              :value="item"
              :disabled="item.disabled"
              as="template"
            >
              <li
                :class="[
                  active ? 'bg-blue-100 text-blue-900' : 'text-gray-900',
                  { 'opacity-50': item.disabled }
                ]"
                class="relative cursor-default select-none py-2 pl-10 pr-4"
              >
                <span :class="[selected ? 'font-medium' : 'font-normal', 'block truncate']">
                  {{ item.label }}
                </span>
                <span
                  v-if="selected"
                  class="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600"
                >
                  <CheckIcon class="h-5 w-5" aria-hidden="true" />
                </span>
              </li>
            </ListboxOption>
          </ListboxOptions>
        </transition>
      </div>
    </Listbox>
  </label>
</template>
