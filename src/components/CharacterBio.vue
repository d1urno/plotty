<script setup lang="ts">
import { computed } from 'vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import useCharacterItem from '@/composables/useCharacterItem'

const props = defineProps<{
  characterId: string
  horizontal?: boolean
}>()

const variables = computed(() => ({ id: props.characterId }))
const { characterItem, loading } = useCharacterItem(variables)
</script>

<template>
  <span v-if="!characterItem && loading"><LoadingSpinner /></span>
  <div
    v-else
    class="flex w-full flex-col items-center justify-center"
    :class="{ 'h-80': !horizontal }"
  >
    <div class="flex h-full w-full flex-col items-center justify-center">
      <div
        class="flex h-full w-full items-center justify-center p-4"
        :class="{
          'flex-col': !horizontal,
          'gap-6 text-left': horizontal
        }"
      >
        <div
          class="flex h-full items-center justify-center"
          :class="{ 'w-full': !horizontal, 'flex-none': horizontal }"
        >
          <img
            v-if="characterItem?.image && characterItem.name"
            :src="characterItem.image"
            :alt="characterItem.name"
            draggable="false"
            class="h-32 w-32 rounded-full object-cover"
          />
        </div>
        <div
          v-if="characterItem"
          class="flex h-full flex-col justify-center"
          :class="{
            'w-full items-center': !horizontal,
            'w-40': horizontal
          }"
        >
          <h2 class="text-xl font-bold text-gray-800">
            {{ characterItem.name }}
          </h2>
          <p class="text-sm text-gray-600">
            {{ characterItem.species }}
          </p>
        </div>
      </div>

      <!-- Additional details loaded after initial render -->
      <div class="flex min-h-[6rem] w-96 max-w-full justify-center lg:w-auto">
        <LoadingSpinner v-if="loading" />
        <div v-else-if="characterItem" class="flex flex-wrap gap-x-6 gap-y-2 px-4 pb-3">
          <div class="text-gray-400">
            <span class="block text-sm font-semibold">Gender</span>
            <span class="font-bold capitalize text-blue-500">
              {{ characterItem.gender }}
            </span>
          </div>
          <div class="text-gray-400">
            <span class="block text-sm font-semibold">Status</span>
            <span class="font-bold capitalize text-blue-500">
              {{ characterItem.status }}
            </span>
          </div>
          <div class="text-gray-400">
            <span class="block text-sm font-semibold">Location</span>
            <span class="font-bold capitalize text-blue-500">
              {{ characterItem.location?.name }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
