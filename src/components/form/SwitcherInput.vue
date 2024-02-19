<script setup lang="ts" generic="T">
import { computed } from 'vue'
import { slugify } from '@/utils'

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
const optionCount = computed(() => props.options.length)
const buttonWidth = computed(() => 100 / optionCount.value)

const highlightStyle = computed(() => {
  const index = props.options.findIndex(({ value }) => value === model.value)
  return {
    width: `${buttonWidth.value}%`,
    transform: `translateX(${index * 100}%)`
  }
})

const slugLabel = computed(() => slugify(props.label))

function onOptionSelect(newValue: T) {
  model.value = newValue
}
</script>

<template>
  <label :for="`${slugLabel}-switcher`">
    <span v-if="showLabel" class="mb-2 block text-center text-xs font-semibold">{{ label }}</span>
    <div class="flex w-full items-center justify-between rounded-full bg-white">
      <div
        class="relative flex h-11 w-full cursor-pointer items-center overflow-hidden rounded-full border-2 border-gray-300"
      >
        <span
          class="absolute h-11 bg-blue-600/80 transition-all duration-300 ease-in-out"
          :style="highlightStyle"
        ></span>

        <div
          class="absolute grid w-full"
          :style="{ gridTemplateColumns: `repeat(${optionCount}, 1fr)` }"
        >
          <button
            v-for="(option, index) in options"
            :id="`${slugLabel}-switcher-${index}`"
            :key="index"
            :class="model === option.value ? 'text-white' : 'text-gray-400'"
            type="button"
            class="relative flex h-11 items-center justify-center"
            @click="onOptionSelect(option.value)"
          >
            <div
              class="flex w-full items-center text-sm font-semibold transition-all duration-200 ease-in-out"
            >
              <i v-if="option.icon" class="pi mr-2" :class="option.icon"></i>
              <span class="mx-auto">{{ option.label }}</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  </label>
</template>

<style scoped lang="postcss"></style>
