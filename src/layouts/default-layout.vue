<script setup lang="ts">
import LogoIcon from '@/components/icons/LogoIcon.vue'
import { useBreakpoints } from '@vueuse/core'
import AppMobileMenu from '@/components/AppMobileMenu.vue'
import { useRouter } from 'vue-router'
import LinkTabs from '@/components/LinkTabs.vue'
import Pattern from '@/assets/bg-pattern.svg'
import AppLink from '@/components/AppLink.vue'
import useCharacterList from '@/composables/useCharacterList'
import useNavLinks from '@/composables/useNavLinks'
import AppLocaleSwitcher from '@/components/AppLocaleSwitcher.vue'
import useScrollPosition from '@/composables/useScrollPosition'

const router = useRouter()
const breakpoints = useBreakpoints({ lg: 992 })
const lgAndLarger = breakpoints.greaterOrEqual('lg')
const navLinks = useNavLinks()

useCharacterList(undefined, undefined, { isReady: router.currentRoute.value.path !== '/new' }) // To preload the characters

router.afterEach((to, from) => {
  if (!to.meta.weight || !from.meta.weight) return
  // eslint-disable-next-line no-param-reassign
  to.meta.transition = to.meta.weight < from.meta.weight ? 'page-slide-right' : 'page-slide-left'
})

const { root, updateScrollPosition } = useScrollPosition()
</script>

<template>
  <div class="flex h-screen flex-col">
    <nav class="relative z-10 flex-none bg-white shadow-md">
      <div class="mx-auto px-4 lg:px-8">
        <div class="relative flex h-16 items-center justify-between">
          <div class="flex flex-1 items-center justify-between lg:items-stretch lg:justify-start">
            <AppLink to="/" class="flex items-center gap-2">
              <LogoIcon class="h-16 w-16" />
              <span
                class="relative -mt-[4px] ml-2 font-bevellier text-5xl font-black text-blue-300 [text-shadow:_1px_1px_1px_rgb(21,_58,_41)]"
              >
                Plotty
              </span>
            </AppLink>

            <div
              v-if="lgAndLarger"
              class="ml-10 flex w-full items-center justify-between align-middle"
            >
              <LinkTabs :options="navLinks" class="w-[28rem]" />

              <AppLocaleSwitcher />
            </div>

            <div v-else class="ml-6 flex items-center gap-6">
              <AppLink
                to="/new"
                class="block rounded-md bg-blue-500/80 px-2 py-1 text-center text-xs font-semibold text-white ring-2 ring-blue-600 transition-colors ease-out"
              >
                {{ $t('layout.default.nav.new') }}
              </AppLink>
              <AppMobileMenu />
            </div>
          </div>
        </div>
      </div>
    </nav>

    <main class="relative flex h-[calc(100%-4rem)] overflow-hidden">
      <img
        class="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-10"
        :src="Pattern"
        alt=""
      />
      <router-view
        ref="root"
        v-slot="{ Component, route }"
        class="scrollbar-gutter absolute inset-0 w-full overflow-y-auto"
      >
        <transition
          :name="(route.meta.transition as string | undefined) || 'page-scale-fade'"
          appear
          @enter="updateScrollPosition"
        >
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
  </div>
</template>
