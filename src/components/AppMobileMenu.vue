<script setup lang="ts">
import { onClickOutside, useSwipe, useFocus } from '@vueuse/core'
import { ref, watch } from 'vue'
import AppHamburger from '@/components/AppHamburger.vue'
import AppLink from '@/components/AppLink.vue'
import useNavLinks from '@/composables/useNavLinks'

const isOpen = ref(false)
const root = ref<HTMLElement | null>(null)
const { focused } = useFocus(root)
const navLinks = useNavLinks()

function afterEnter() {
  focused.value = true
}
function onClose() {
  isOpen.value = false
}
function afterLeave() {
  focused.value = false
}

onClickOutside(root, () => onClose())
const { direction } = useSwipe(root)

watch(direction, (value) => {
  if (value && value === 'left') onClose()
})
</script>

<template>
  <AppHamburger :is-active="isOpen" @toggle="isOpen = !isOpen" />
  <transition
    enter-active-class="duration-300 ease-out"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="duration-200 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <!-- TODO: close on scroll or touch-->
    <button
      v-if="isOpen"
      type="button"
      tabindex="-1"
      aria-hidden="true"
      class="fixed inset-0 z-20 h-full w-full bg-black/20"
    />
  </transition>

  <transition
    enter-active-class="transition duration-200 ease-out"
    enter-from-class="-translate-x-5 opacity-0"
    enter-to-class="translate-y-0 opacity-100"
    leave-active-class="transition duration-150 ease-in"
    leave-from-class="translate-y-0 opacity-100"
    leave-to-class="-translate-x-5 opacity-0"
    @after-enter="afterEnter"
    @after-leave="afterLeave"
  >
    <div
      v-if="isOpen"
      ref="root"
      class="absolute inset-x-0 top-24 z-20 mx-auto mt-3 w-full max-w-xs rounded-md bg-white p-2"
    >
      <div class="overscroll-contain rounded-md p-3">
        <!--        <div class="flex justify-end gap-5">-->
        <!--          <AppThemeSwitcher />-->
        <!--          <AppLocaleSwitcher />-->
        <!--        </div>-->
        <ul class="space-y-3 py-8 text-center text-lg font-medium">
          <li v-for="link in navLinks" :key="link.value">
            <AppLink
              :to="link.value"
              class="rounded-md px-2 py-1 transition-colors ease-out"
              active-class="bg-blue-600 text-white"
              @click="onClose"
            >
              {{ link.label }}
            </AppLink>
          </li>
        </ul>
      </div>
    </div>
  </transition>
</template>
