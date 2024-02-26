<script setup lang="ts" generic="T">
const props = defineProps<{
  item: T
  from?: string
  disabled?: boolean
}>()

function onDragStart(event: DragEvent) {
  if (!event.dataTransfer) return
  event.dataTransfer.setData('item', JSON.stringify({ item: props.item, from: props.from }))
  // eslint-disable-next-line no-param-reassign
  event.dataTransfer.effectAllowed = 'move'
}

function onDragEnd() {
  // Handle drag end event
}
</script>

<template>
  <div :draggable="!disabled" @dragstart="onDragStart" @dragend="onDragEnd">
    <slot></slot>
  </div>
</template>
