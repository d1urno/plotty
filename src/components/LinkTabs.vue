<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const props = defineProps<{
  options: { label: string; value: string; icon?: string; bgColorClass?: string }[]
}>()

const router = useRouter()
const route = useRoute<'/story/[storyId]'>()
const optionCount = computed(() => props.options.length)
const buttonWidth = computed(() => 100 / optionCount.value)

const currentValue = computed(() => (route.params.storyId ? '/stories' : route.path))

const highlightStyle = computed(() => {
  const index = props.options.findIndex(({ value }) => value === currentValue.value)
  return {
    width: `${buttonWidth.value}%`,
    transform: `translateX(${index * 100}%)`
  }
})

function onOptionSelect(newValue: string) {
  router.push(newValue as string)
}
</script>

<template>
  <div>
    <div class="flex w-full items-center justify-between">
      <div class="relative flex h-10 w-full cursor-pointer items-center">
        <span
          class="absolute h-10 rounded-t-md transition duration-300 ease-out"
          :style="highlightStyle"
          :class="options.find((option) => option.value === currentValue)?.bgColorClass"
        >
          <span class="block h-full bg-gradient-to-b from-transparent from-35% to-white" />
        </span>

        <div
          class="absolute grid w-full"
          :style="{ gridTemplateColumns: `repeat(${optionCount}, 1fr)` }"
        >
          <router-link
            v-for="(option, index) in options"
            :key="index"
            :class="
              currentValue === option.value
                ? 'text-white'
                : 'text-gray-400 hover:scale-110 hover:text-gray-600'
            "
            :to="option.value"
            class="relative flex h-10 items-center justify-center transition-transform"
            @click="onOptionSelect(option.value)"
          >
            <div
              class="flex w-full items-center text-sm font-semibold transition duration-200 ease-in-out"
            >
              <i v-if="option.icon" class="pi mr-2" :class="option.icon"></i>
              <span class="mx-auto">{{ option.label }}</span>
            </div>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="postcss"></style>
