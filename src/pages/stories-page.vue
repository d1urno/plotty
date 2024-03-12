<script setup lang="ts">
import { useStore } from '@/stores'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import useCharacterListByIds from '@/composables/useCharacterListByIds'
import useModal from '@/composables/useModal'
import StoryCard from '@/components/StoryCard.vue'
import StoryFilters from '@/components/StoryFilters.vue'
import AppLink from '@/components/AppLink.vue'
import getLanguageFromLocale from '@/functions/getLanguageFromLocale'
import { useI18n } from 'vue-i18n'
import useStoryApi from '@/composables/useStoryApi'
import StoryItem from '@/components/StoryItem.vue'

const { showModal } = useModal()
const { stories } = storeToRefs(useStore())
const { deleteStory } = useStoryApi()
const { locale } = useI18n()
const lastStory = computed(
  () => stories.value.filter((s) => s.storyLanguage === getLanguageFromLocale(locale.value))[0]
)
const filter = ref({ name: '', style: '' })

const variables = computed(() => ({
  ids: Array.from(
    new Set(stories.value.flatMap((s) => [...s.mainCharacters, ...s.secondaryCharacters]))
  )
}))

const { loading } = useCharacterListByIds(variables) // To load all stories characters into one query

const filteredStories = computed(() => {
  const { name, style } = filter.value
  return stories.value.filter((s) => {
    if (s.storyLanguage !== getLanguageFromLocale(locale.value)) return false
    if (
      name &&
      !s.title
        .normalize('NFD')
        .replace(/[\u0300-\u036F]/g, '')
        .toLocaleLowerCase()
        .includes(name.toLocaleLowerCase())
    )
      return false
    return !(style && s.storyStyle !== style)
  })
})

function onDeleteStory(id: string) {
  const story = stories.value.find((s) => s.id === id)
  if (!story) return
  showModal({
    title: 'Are you sure?',
    content: `The story <b>${story.title}</b> will be deleted permanently.`,
    buttons: [
      {
        label: 'Delete',
        type: 'warning',
        callbackOrLink: (close) => {
          deleteStory(id)
          close()
        }
      }
    ]
  })
}
</script>

<template>
  <div class="flex h-full flex-col">
    <div
      class="container flex flex-col items-center gap-10 pb-20 pt-16 xl:flex-row xl:items-start xl:px-10"
    >
      <div v-if="!lastStory" class="mx-auto">
        <h2 class="mb-10 text-center text-2xl italic text-blue-500">
          {{ $t('StoriesPage.emptyText') }}
        </h2>
        <AppLink
          to="/new"
          class="block rounded-md bg-blue-500 px-10 py-3 text-center text-2xl font-bold text-white"
        >
          {{ $t('StoriesPage.emptyCta') }}
        </AppLink>
      </div>

      <template v-else>
        <div
          class="flex flex-none basis-1/3 flex-col gap-10 overflow-y-auto rounded-md bg-white p-4 ring-2 ring-gray-500 ring-offset-4 3xl:basis-1/2"
        >
          <StoryFilters v-model="filter" />
          <div v-if="!filteredStories?.length">{{ $t('StoriesPage.noResultsText') }}</div>
          <ul v-else class="grid max-h-[31rem] w-full 3xl:grid-cols-2">
            <transition-group name="list" appear>
              <AppLink
                v-for="story in filteredStories"
                :key="story.id"
                :to="`/story/${story.slug}`"
              >
                <StoryCard :story="story" :loading="loading" @delete="onDeleteStory" />
              </AppLink>
            </transition-group>
          </ul>
        </div>

        <!-- Recent story -->
        <div class="mx-auto flex flex-1 flex-col">
          <h2 class="text-center text-2xl italic text-blue-500">
            {{ $t('StoriesPage.recentStoryText') }}
          </h2>
          <StoryItem :story="lastStory" is-preview />
        </div>
      </template>
    </div>
  </div>
</template>

<route lang="json">
{ "meta": { "weight": 2 } }
</route>
