<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import useQueryEditor from '@/composables/useQueryEditor'
import TextInput from '@/components/form/TextInput.vue'
import DropdownInput from '@/components/form/DropdownInput.vue'

const filter = defineModel<{ name?: string; style?: string }>()

const route = useRoute()
const { replaceQuery } = useQueryEditor()

// Initialize filters from the URL parameters
onMounted(() => {
  const { storyName, storyStyle } = route.query
  filter.value = { name: storyName?.toString(), style: storyStyle?.toString() }
})

// Watch for changes on filter and update the URL
watch(
  () => route.query,
  ({ storyName, storyStyle }) => {
    filter.value = { name: storyName?.toString(), style: storyStyle?.toString() }
  }
)

function onSearchChange(value: string) {
  replaceQuery({ storyName: value })
}

function onTypeChange(event: Event) {
  replaceQuery({ storyStyle: (event.target as HTMLSelectElement).value })
}
</script>

<template>
  <div v-if="filter" class="flex items-start gap-4">
    <TextInput
      :model-value="filter.name"
      label="Story search"
      :show-label="false"
      placeholder="Search for a story"
      :debounce="300"
      class="w-full"
      @update:model-value="onSearchChange"
    />

    <DropdownInput
      label="Story type"
      :show-label="false"
      :value="filter.style"
      :options="[
        { label: 'All types', value: '' },
        { label: 'Narrative', value: 'Narrative' },
        { label: 'Script', value: 'Script' }
      ]"
      class="w-48"
      @input="onTypeChange"
    />
  </div>
</template>
