<script setup lang="ts">
import { useStore } from '@/stores'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import useCharacterListByIds from '@/composables/useCharacterListByIds'
import useModal from '@/composables/useModal'
import StoryCard from '@/components/StoryCard.vue'
import StoryFilters from '@/components/StoryFilters.vue'
import StoryChapter from '@/components/StoryChapter.vue'
import AppLink from '@/components/AppLink.vue'

const { showModal } = useModal()
const { stories } = storeToRefs(useStore())
const lastStory = computed(() => stories.value[0])
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
    if (name && !s.title.toLowerCase().includes(name.toLowerCase())) return false
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
          stories.value = stories.value.filter((s) => s.id !== id)
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
          You don't have any stories yet...
        </h2>
        <AppLink
          to="/new"
          class="block rounded-md bg-blue-500 px-10 py-3 text-center text-2xl font-bold text-white"
        >
          Create a new story
        </AppLink>
      </div>

      <template v-else>
        <div
          class="flex basis-1/3 flex-col gap-10 overflow-y-auto rounded-md bg-white p-4 ring-2 ring-gray-500 ring-offset-4 3xl:basis-1/2"
        >
          <StoryFilters v-model="filter" />
          <div v-if="!filteredStories?.length">No results found...</div>
          <ul v-else class="grid max-h-[31rem] w-full 3xl:grid-cols-2">
            <transition-group name="list" appear>
              <AppLink v-for="story in filteredStories" :key="story.id" :to="`/story/${story.id}`">
                <StoryCard :story="story" :loading="loading" @delete="onDeleteStory" />
              </AppLink>
            </transition-group>
          </ul>
        </div>

        <div class="mx-auto flex flex-1 flex-col">
          <h2 class="mb-8 text-center text-2xl italic text-blue-500">Most recent story...</h2>
          <article class="prose prose-lg mx-auto max-w-3xl font-garamond prose-p:font-sans">
            <h1 class="mb-16 text-center text-blue-600">{{ lastStory.title }}</h1>
            <StoryChapter
              v-for="(chapter, i) in lastStory.chapters"
              :key="chapter.id"
              :story-id="lastStory.id"
              :chapter="chapter"
              :index="i + 1"
            />
          </article>
        </div>
      </template>
    </div>
  </div>
</template>

<route lang="json">
{ "meta": { "weight": 2 } }
</route>
