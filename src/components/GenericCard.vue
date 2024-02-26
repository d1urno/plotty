<script setup lang="ts" generic="T extends { id: string; title?: string; img?: string }">
import CheckCircleIcon from '@/components/icons/CheckCircleIcon.vue'
import { computed } from 'vue'
import getColorClasses, { type Color } from '@/functions/getColorClasses'

const props = withDefaults(
  defineProps<{
    item: T
    selected?: boolean
    selectedColor?: Color
    disabled?: boolean
    tag?: string
  }>(),
  {
    selected: false,
    selectedColor: 'blue',
    disabled: false,
    tag: undefined
  }
)

const emit = defineEmits<{
  click: [T]
}>()

const colorClasses = computed(() => getColorClasses(props.selectedColor))

function onClick() {
  emit('click', props.item)
}
</script>

<template>
  <div class="p-2">
    <button
      class="relative box-border flex h-full w-full flex-col items-center justify-end overflow-hidden rounded-lg border shadow-md transition-all"
      :class="[
        {
          'ring-gray-300': !selected && disabled,
          'hover:scale-105': !selected && !disabled,
          'ring-4': selected
        },
        { [colorClasses.border]: selected },
        { [colorClasses.ring]: selected }
      ]"
      type="button"
      :disabled="disabled"
      @click="onClick"
    >
      <img
        v-if="props.item.img"
        :src="props.item.img"
        :alt="props.item.title"
        class="absolute h-full w-full object-cover"
        :class="{ 'grayscale filter': disabled }"
      />
      <span
        class="absolute h-full w-full transition"
        :class="!selected ? 'bg-white/20' : [colorClasses.bg, 'bg-opacity-40']"
      ></span>
      <span
        v-if="props.item.img"
        class="absolute h-20 w-full bg-gradient-to-t from-black/80 to-transparent"
      ></span>
      <span
        v-if="tag"
        class="absolute left-0 top-0 rounded-br-lg px-2 pb-px pt-0 text-sm font-semibold text-white"
        :class="colorClasses.bg"
      >
        <slot name="tag">{{ tag }}</slot>
      </span>
      <CheckCircleIcon
        v-if="selected"
        class="absolute inset-0 m-1 ml-auto h-8 w-8 rounded-full text-white"
        :class="colorClasses.bg"
        aria-hidden="true"
      />
      <span
        class="relative m-6 flex flex-col gap-4 font-semibold"
        :class="!props.item.img ? 'text-gray-900' : ' text-white'"
      >
        {{ props.item.title }}
        <slot />
      </span>
    </button>
  </div>
</template>

<style scoped lang="postcss"></style>
