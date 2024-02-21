<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import useQueryEditor from '@/composables/useQueryEditor'
import DropdownInput from '@/components/form/DropdownInput.vue'
import TextInput from '@/components/form/TextInput.vue'

const filter = defineModel<{ name?: string, gender?: string }>()

const route = useRoute()
const { replaceQuery } = useQueryEditor()

// Initialize filters from the URL parameters
onMounted(() => {
  // By setting this we also fire the initial list query only after URL params are read,
  // as the list query enabled function expects a value to be set on the filter
  const { name, gender } = route.query
  filter.value = { name: name?.toString(), gender: gender?.toString() }
})

// Watch for changes on filter and update the URL
watch(
  () => route.query,
  ({ name, gender }) => {
    filter.value = { name: name?.toString(), gender: gender?.toString() }
  }
)

function onSearchChange(value: string) {
  replaceQuery({ name: value })
}

function onGenderChange(event: Event) {
  replaceQuery({ gender: (event.target as HTMLSelectElement).value })
}
</script>

<template>
  <div v-if="filter" class="flex items-start gap-4">
    <TextInput
      :model-value="filter.name"
      label="Character search"
      :show-label="false"
      placeholder="Search for a character"
      :debounce="300"
      class="w-full"
      @update:model-value="onSearchChange"
    />

    <DropdownInput
      label="Character gender"
      :show-label="false"
      :value="filter.gender"
      :options="[
        { label: 'All genders', value: '' },
        { label: 'Male', value: 'Male' },
        { label: 'Female', value: 'Female' },
        { label: 'Unknown', value: 'unknown' },
        { label: 'Genderless', value: 'Genderless' }
      ]"
      class="w-48"
      @input="onGenderChange"
    />
  </div>
</template>
