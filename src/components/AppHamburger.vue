<script setup lang="ts">
import { computed } from 'vue'

defineProps<{
  isActive: boolean
}>()

const emit = defineEmits<{
  toggle: [boolean]
}>()

function toggleMenu(show: boolean) {
  emit('toggle', show)
}

const colorStyle = computed(() => ({
  '--color': '#075985'
}))
</script>

<template>
  <button
    id="hamburger"
    class="hamburger hamburger--slider relative -ml-4 -mr-1 select-none px-4 focus:outline-none lg:hidden"
    type="button"
    aria-label="Menu"
    aria-controls="navigation"
    :class="{ 'is-active': isActive }"
    @mousedown="toggleMenu(!isActive)"
    @keydown.enter="toggleMenu(!isActive)"
    @keyup.space="toggleMenu(!isActive)"
  >
    <span id="hamburger-box" class="hamburger-box">
      <span id="hamburger-inner" class="hamburger-inner" :style="colorStyle"></span>
    </span>
  </button>
</template>

<style scoped lang="postcss">
.hamburger-box {
  @apply h-10 w-10;
  display: block;
  position: relative;
}

.hamburger-inner {
  display: block;
  top: 50%;
  margin-top: 5px;
}
.hamburger-inner,
.hamburger-inner::before,
.hamburger-inner::after {
  width: 40px;
  height: 4px;
  background-color: theme('colors.blue.500');
  border-radius: 4px;
  position: absolute;
  transition-property: all;
  transition-duration: 0.5s;
  transition-timing-function: ease;
}
.hamburger-inner::before,
.hamburger-inner::after {
  content: '';
  display: block;
}
.hamburger-inner::before {
  top: -10px;
}
.hamburger-inner::after {
  bottom: -10px;
}

.hamburger--slider .hamburger-inner {
  top: 2px;
}
.hamburger--slider .hamburger-inner::before {
  top: 10px;
  transition-property: transform, opacity;
  transition-timing-function: ease;
  transition-duration: 0.15s;
}
.hamburger--slider .hamburger-inner::after {
  top: 20px;
}

.hamburger--slider.is-active .hamburger-inner {
  transform: translate3d(0, 10px, 0) rotate(45deg);
}
.hamburger--slider.is-active .hamburger-inner::before {
  transform: rotate(-45deg) translate3d(-5.71429px, -6px, 0);
  opacity: 0;
}
.hamburger--slider.is-active .hamburger-inner::after {
  transform: translate3d(0, -20px, 0) rotate(-90deg);
}
</style>
