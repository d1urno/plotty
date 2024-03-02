<script setup lang="ts">
import LogoIcon from '@/components/icons/LogoIcon.vue'
import { useBreakpoints } from '@vueuse/core'
import AppMobileMenu from '@/components/AppMobileMenu.vue'
import { useRouter } from 'vue-router'
import LinkTabs from '@/components/LinkTabs.vue'
import AppLink from '@/components/AppLink.vue'
import useCharacterList from '@/composables/useCharacterList'

const router = useRouter()
const breakpoints = useBreakpoints({ lg: 992 })
const lgAndLarger = breakpoints.greaterOrEqual('lg')

useCharacterList(undefined, undefined, { isReady: router.currentRoute.value.path !== '/new' }) // To preload the characters

router.afterEach((to, from) => {
  if (!to.meta.weight || !from.meta.weight) return
  // eslint-disable-next-line no-param-reassign
  to.meta.transition = to.meta.weight < from.meta.weight ? 'page-slide-right' : 'page-slide-left'
})
</script>

<template>
  <div class="flex h-screen flex-col">
    <nav class="relative flex-none bg-white shadow-md">
      <div class="mx-auto px-4 lg:px-8">
        <div class="relative flex h-16 items-center justify-between">
          <div class="flex flex-1 items-center justify-between lg:items-stretch lg:justify-start">
            <div class="flex flex-shrink-0 items-center">
              <LogoIcon class="h-16 w-16" />
              <span
                class="relative -mt-[4px] ml-2 font-bevellier text-5xl font-black text-blue-300 [text-shadow:_1px_1px_1px_rgb(21,_58,_41)]"
              >
                Plotty
              </span>
            </div>

            <div v-if="lgAndLarger" class="ml-10 flex items-center align-middle">
              <LinkTabs
                :options="[
                  { label: 'Home', value: '/', bgColorClass: 'bg-blue-600/80' },
                  { label: 'Stories', value: '/stories', bgColorClass: 'bg-teal-500/80' },
                  { label: 'New story', value: '/new', bgColorClass: 'bg-orange-500' }
                ]"
                class="w-80"
              />
            </div>

            <div v-else class="flex items-center gap-6">
              <AppLink
                to="/new"
                class="rounded-md bg-blue-500/80 px-2 py-1 font-semibold text-white ring-2 ring-blue-600 transition-colors ease-out"
              >
                New story
              </AppLink>
              <AppMobileMenu />
            </div>
          </div>
        </div>
      </div>
    </nav>

    <main class="relative flex h-[calc(100%-4rem)] overflow-hidden">
      <router-view v-slot="{ Component, route }" class="absolute inset-0 w-full overflow-y-auto">
        <transition
          :name="(route.meta.transition as string | undefined) || 'page-scale-fade'"
          appear
        >
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
  </div>
</template>
