<script setup lang="ts">
import PlotInIcon from '@/components/icons/PlotInIcon.vue'
import { useBreakpoints } from '@vueuse/core'
import AppMobileMenu from '@/components/AppMobileMenu.vue'

const breakpoints = useBreakpoints({ lg: 992 })
const lgAndLarger = breakpoints.greaterOrEqual('lg')
</script>

<template>
  <div class="flex h-screen flex-col">
    <nav class="relative flex-none bg-white shadow-md">
      <div class="mx-auto px-4 lg:px-8">
        <div class="relative flex h-16 items-center justify-between">
          <div class="flex flex-1 items-center justify-between lg:items-stretch lg:justify-start">
            <div class="flex flex-shrink-0 items-center">
              <PlotInIcon class="h-16 w-16" />
              <span
                class="relative -mt-[4px] ml-2 font-bevellier text-5xl font-black text-blue-300 [text-shadow:_1px_1px_1px_rgb(21,_58,_41)]"
              >
                Plot in
              </span>
            </div>

            <div v-if="lgAndLarger" class="ml-10 flex items-center align-middle">
              <div class="flex space-x-4">
                <router-link
                  to="/"
                  class="rounded-md px-3 py-2 text-sm font-medium transition-transform hover:scale-110 hover:bg-blue-400 hover:text-white"
                  exact-active-class="bg-blue-600 text-white hover:scale-100"
                >
                  Home
                </router-link>
                <router-link
                  to="/stories"
                  class="rounded-md px-3 py-2 text-sm font-medium transition-transform hover:scale-110 hover:bg-blue-400 hover:text-white"
                  active-class="bg-blue-600 text-white hover:scale-100"
                >
                  Stories
                </router-link>
                <router-link
                  to="/new"
                  class="rounded-md px-3 py-2 text-sm font-medium transition-transform hover:scale-110 hover:bg-blue-400 hover:text-white"
                  active-class="bg-blue-600 text-white hover:scale-100"
                >
                  New story
                </router-link>
              </div>
            </div>

            <div v-else class="flex items-center gap-6">
              <router-link
                to="/new"
                class="rounded-md bg-blue-500/50 px-2 py-1 font-semibold text-white ring-2 ring-blue-600 transition-colors ease-out"
              >
                New story
              </router-link>
              <AppMobileMenu />
            </div>
          </div>
        </div>
      </div>
    </nav>

    <main class="flex h-[calc(100%-4rem)] justify-center overflow-y-auto">
      <router-view class="w-full" />
    </main>
  </div>
</template>
