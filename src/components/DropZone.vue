<script setup lang="ts">
const emit = defineEmits<{
  itemDropped: [{ item: unknown; from?: string }]
  dragOver: [DragEvent]
}>()

function onDragOver(event: DragEvent) {
  emit('dragOver', event)
}

function onDrop(event: DragEvent) {
  const itemData = event.dataTransfer?.getData('item')
  if (itemData) {
    const { item, from } = JSON.parse(itemData)
    emit('itemDropped', { item, from })
  }
}
</script>

<template>
  <div @dragover.prevent="onDragOver" @drop.prevent="onDrop">
    <slot></slot>
  </div>
</template>
