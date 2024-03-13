<script setup lang="ts">
import GenericToast from '@/components/GenericToast.vue'
import { storeToRefs } from 'pinia'
import { useStore } from '@/stores'
import { computed } from 'vue'

const { appToasts } = storeToRefs(useStore())

const sortedGenericToasts = computed(
  () => appToasts.value && [...appToasts.value].sort((a, b) => a.timestamp - b.timestamp)
)

function onClose(toastId: string) {
  if (!appToasts.value) return
  const toastIndex = appToasts.value.findIndex((t) => t.id === toastId)
  appToasts.value.splice(toastIndex, 1)
}

function onAfterLeave() {
  // To clean up dom nodes after the transition ends
  if (appToasts.value?.length === 0) appToasts.value = undefined
}
</script>

<template>
  <div v-if="sortedGenericToasts" class="pointer-events-none fixed bottom-0 right-0 z-10">
    <transition-group name="toast-list" appear @after-leave="onAfterLeave">
      <GenericToast
        v-for="genericToast in sortedGenericToasts"
        :key="genericToast.id"
        :toast="genericToast"
        class="pointer-events-auto"
        @close="onClose(genericToast.id)"
      />
    </transition-group>
  </div>
</template>

<style scoped lang="postcss">
.toast-list-enter-active,
.toast-list-leave-active,
.toast-list-move {
  transition: 500ms cubic-bezier(0.59, 0.12, 0.34, 0.95);
  transition-property: opacity, transform;
  @apply z-10 origin-center;
}

.toast-list-enter-from {
  @apply translate-x-full scale-50 opacity-0;
}

.toast-list-enter-to {
  @apply translate-x-0 scale-100 opacity-100;
}

.toast-list-leave-from {
  @apply translate-x-0 opacity-100;
}

.toast-list-leave-to {
  @apply origin-center translate-x-full scale-50 opacity-0;
}
</style>
