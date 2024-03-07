<script setup lang="ts">
import AppLink from '@/components/AppLink.vue'
import StoryChapter from '@/components/StoryChapter.vue'
import defaultStories from '@/constants/defaultStories'
import { useI18n } from 'vue-i18n'
import getLanguageFromLocale from '@/functions/getLanguageFromLocale'
import { computed } from 'vue'

const { locale } = useI18n()

const exampleStory = computed(() =>
  defaultStories.find((story) => story.storyLanguage === getLanguageFromLocale(locale.value))
)
</script>

<template>
  <main
    class="relative overflow-y-auto bg-gradient-to-r from-teal-400/20 via-blue-500/20 to-blue-400/50 pb-20 text-gray-800"
  >
    <section class="mb-10 bg-gradient-to-b from-blue-600/30 from-45% pb-40 pt-20">
      <div class="container px-4 sm:px-6 lg:px-20">
        <section class="mb-20">
          <h1
            class="mb-10 rounded-md bg-white/20 p-6 text-center text-4xl font-bold !leading-tight text-white [text-shadow:_1px_1px_1px_rgb(21,_58,_41)] sm:text-5xl lg:rounded-full lg:p-10 lg:text-6xl"
          >
            {{ $t('home.header.title') }}
          </h1>
          <div class="flex flex-col items-center justify-evenly gap-10 lg:flex-row">
            <p class="max-w-xl text-lg font-semibold !leading-8 text-white sm:text-xl">
              {{ $t('home.header.subtitle') }}
            </p>
            <AppLink
              to="/new"
              class="block w-max rounded-md bg-blue-500 px-20 py-2 text-center text-2xl font-bold text-white transition hover:scale-110"
            >
              {{ $t('home.header.cta') }}
            </AppLink>
          </div>
        </section>
      </div>
    </section>
    <div class="container -mt-48 px-4 sm:px-6 lg:px-20">
      <section class="mx-auto mb-12 max-w-2xl rounded-lg bg-blue-50 p-6 shadow-lg">
        <h2 class="mb-10 text-3xl font-bold sm:text-4xl">{{ $t('home.features.title') }}</h2>
        <ul class="list-inside space-y-4 text-lg sm:text-xl">
          <li>
            <span class="font-semibold text-blue-500">
              {{ $t('home.features.items.1.title') }}.
            </span>
            {{ $t('home.features.items.1.description') }}
          </li>
          <li>
            <span class="font-semibold text-blue-500">
              {{ $t('home.features.items.2.title') }}.
            </span>
            {{ $t('home.features.items.2.description') }}
          </li>
          <li>
            <span class="font-semibold text-blue-500">
              {{ $t('home.features.items.3.title') }}.
            </span>
            {{ $t('home.features.items.3.description') }}
          </li>
        </ul>
      </section>

      <section class="mx-auto max-w-4xl py-12">
        <h2 class="mb-4 text-3xl font-bold sm:text-4xl">{{ $t('home.howItWorks.title') }}</h2>
        <p class="text-lg sm:text-xl">
          {{ $t('home.howItWorks.text') }}
        </p>
      </section>

      <section
        v-if="exampleStory"
        class="mx-auto mb-20 mt-10 flex flex-1 flex-col rounded-md py-8 md:bg-blue-50 md:px-10 md:shadow-lg"
      >
        <h2 class="mb-12 text-center text-2xl italic text-blue-500">
          {{ $t('home.exampleStory.title') }}
        </h2>
        <article class="prose-lg mx-auto max-w-3xl font-garamond prose-p:font-sans">
          <h1 class="mb-16 text-center">{{ exampleStory.title }}</h1>
          <StoryChapter
            v-for="(chapter, i) in exampleStory.chapters"
            :key="chapter.id"
            :story-id="exampleStory.id"
            :chapter="chapter"
            :index="i + 1"
          />
        </article>
      </section>

      <section class="mx-auto mb-20 max-w-2xl rounded-lg bg-blue-50 p-6 shadow-lg">
        <h2 class="mb-8 text-3xl font-bold sm:text-4xl">{{ $t('home.getStarted.title') }}</h2>
        <p class="mb-8 text-lg sm:text-xl">{{ $t('home.getStarted.text') }}</p>
        <AppLink
          to="/new"
          class="mx-auto block w-max rounded-md bg-blue-500 px-20 py-2 text-center text-xl font-bold text-white transition hover:scale-110"
        >
          {{ $t('home.getStarted.cta') }}
        </AppLink>
      </section>
    </div>
    <footer class="text-center">
      <p>© 2024 Plotty</p>
    </footer>
  </main>
</template>

<route lang="json">
{ "path": "/", "meta": { "weight": 1 } }
</route>
