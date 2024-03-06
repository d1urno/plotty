<script setup lang="ts">
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'
import ChevronUpDownIcon from '@/components/icons/ChevronUpDownIcon.vue'
import { availableLocales, loadLanguageAsync } from '@/plugins/i18n'

const { locale } = useI18n()

const filteredLocales = computed(() => availableLocales.filter((l) => l !== locale.value))

const flags = Object.fromEntries(
  Object.entries(import.meta.glob<{ default: string }>('../../flags/*.svg', { eager: true })).map(
    ([key, value]) => [key.slice(12, 14), value.default]
  )
)

async function onSelect(code: string) {
  localStorage.setItem('language', code)
  await loadLanguageAsync(code)
}
</script>

<template>
  <div>
    <Menu v-slot="{ open }" as="div" class="relative flex">
      <MenuButton
        :class="open ? '' : 'text-opacity-90'"
        class="group inline-flex items-center rounded-md bg-gray-100 px-3 py-2 text-base font-medium transition hover:text-opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-opacity-75"
      >
        <transition
          mode="out-in"
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="scale-125 opacity-50"
          enter-to-class="scale-100 opacity-100"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="scale-100 opacity-100"
          leave-to-class="scale-125 opacity-50"
        >
          <img :key="locale" class="w-6 rounded" :src="flags[locale]" alt="" />
        </transition>
        <ChevronUpDownIcon
          :class="open ? '' : 'text-opacity-60'"
          class="ml-2 h-5 w-5 text-black transition duration-150 ease-in-out group-hover:text-opacity-80"
          aria-hidden="true"
        />
      </MenuButton>

      <transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="translate-y-1 opacity-0"
        enter-to-class="translate-y-0 opacity-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="translate-y-0 opacity-100"
        leave-to-class="translate-y-1 opacity-0"
      >
        <MenuItems
          class="absolute right-0 z-10 mt-12 flex w-max origin-top-right flex-col overflow-hidden rounded-lg bg-white p-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
        >
          <div v-for="item in filteredLocales" :key="item" class="p-1">
            <MenuItem v-slot="{ active }">
              <button
                :class="{ 'bg-gray-100': active }"
                type="button"
                class="flex w-full items-center rounded-lg px-3 py-2 transition focus:outline-none"
                @click="onSelect(item)"
              >
                <img class="w-8 rounded" :src="flags[item]" alt="" />
                <span class="ml-4 text-sm font-medium text-gray-900">
                  {{ $t(`enums.languages.${item.toLowerCase()}`) }}
                </span>
              </button>
            </MenuItem>
          </div>
        </MenuItems>
      </transition>
    </Menu>
  </div>
</template>
