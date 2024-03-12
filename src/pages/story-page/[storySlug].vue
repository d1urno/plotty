<script setup lang="ts">
import { useStore } from '@/stores'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import useCharacterListByIds from '@/composables/useCharacterListByIds'
import CharacterSelectionList from '@/components/CharacterSelectionList.vue'
import CharacterDetailsModal from '@/components/CharacterDetailsModal.vue'
import { useRoute } from 'vue-router'
import ApiKeyModal from '@/components/ApiKeyModal.vue'
import type { BaseCharacter, Story } from '@/types/local'
import getGenreImg from '@/functions/getGenreImg'
import GenericCard from '@/components/GenericCard.vue'
import {
  StoryAudience,
  StoryGenre,
  StoryLength,
  StoryMode,
  StoryStructure,
  StoryStyle
} from '@/constants/rules'
import useEnum from '@/composables/useEnum'
import useDate from '@/composables/useDate'
import StoryItem from '@/components/StoryItem.vue'

const route = useRoute<'/story/[storySlug]'>()
const storySlug = computed(() => route.params.storySlug)

const { stories, apiKey, chaptersLoadingData } = storeToRefs(useStore())
const storyId = computed(
  () =>
    (
      stories.value.find((s) => s.id === storySlug.value) ??
      stories.value.find((s) => s.slug === storySlug.value)
    )?.id
)
const story = computed<Story | undefined>(() => stories.value.find((s) => s.id === storyId.value))

const variables = computed(
  () =>
    (story.value && { ids: [...story.value.mainCharacters, ...story.value.secondaryCharacters] }) ??
    undefined
)
const { loading } = useCharacterListByIds(variables)
const { formattedDate } = useDate(story.value?.created)

const apiKeyModal = ref<{ visible: boolean }>()
const characterModal = ref<{ visible: boolean; character: BaseCharacter }>()

function onCardClick(character: BaseCharacter) {
  characterModal.value = { visible: true, character }
}
</script>

<template>
  <div
    class="flex h-full flex-col bg-gradient-to-l from-teal-400/10 from-80% via-blue-500/20 to-blue-400/50 xl:from-50%"
  >
    <div
      v-if="story"
      class="container flex flex-col items-center gap-10 pb-20 pt-16 xl:flex-row xl:items-start xl:px-10"
    >
      <div
        class="xl:order-0 order-1 flex h-min max-w-xl flex-none basis-1/3 flex-col gap-10 rounded-md bg-white/50 p-4 ring-2 ring-gray-500 ring-offset-4"
      >
        <div>
          <h2 class="mb-4 text-left text-xl font-bold">{{ $t('StorySlug.mainRolesTitle') }}</h2>
          <CharacterSelectionList
            cache-only
            :loading="loading"
            :selected-character-ids="story.mainCharacters"
            :highlighted-character-ids="story.decisionMakers"
            highlight-color="orange"
            readonly
            @click="onCardClick"
          />
        </div>

        <div v-if="story.secondaryCharacters.length">
          <h2 class="mb-4 text-left text-xl font-bold">
            {{ $t('StorySlug.secondaryRolesTitle') }}
          </h2>
          <CharacterSelectionList
            cache-only
            :loading="loading"
            :selected-character-ids="story.secondaryCharacters"
            readonly
            @click="onCardClick"
          />
        </div>

        <div v-if="!chaptersLoadingData.size">
          <h2 class="mb-4 text-left text-xl font-bold">{{ $t('StorySlug.genres.title') }}</h2>
          <ul class="grid list-inside grid-cols-3 text-lg">
            <li v-for="genre in story.storyGenres" :key="genre">
              <GenericCard
                :item="{
                  id: genre,
                  title: useEnum(StoryGenre).toLabel(genre),
                  img: getGenreImg(genre)
                }"
                class="pointer-events-none h-48"
              />
            </li>
          </ul>
        </div>

        <hr class="h-px w-full bg-gray-400" />

        <div>
          <ul class="ml-2 flex list-inside flex-wrap gap-6 text-lg">
            <li>
              <span class="block text-xs font-semibold">{{ $t('StorySlug.style.title') }}</span>
              <span class="pointer-events-none text-gray-500">
                {{ useEnum(StoryStyle).toLabel(story.storyStyle) }}
              </span>
            </li>
            <li>
              <span class="block text-xs font-semibold">{{ $t('StorySlug.structure.title') }}</span>
              <span class="pointer-events-none text-gray-500">
                {{ useEnum(StoryStructure).toLabel(story.storyStructure) }}
              </span>
            </li>
            <li>
              <span class="block text-xs font-semibold">
                {{
                  story.storyStructure !== StoryStructure.SIMPLE
                    ? $t('StorySlug.length.perChapterTitle')
                    : $t('StorySlug.length.perStoryTitle')
                }}
              </span>
              <span class="pointer-events-none text-gray-500">
                {{ useEnum(StoryLength).toLabel(story.storyLength) }}
              </span>
            </li>
            <li>
              <span class="block text-xs font-semibold">{{ $t('StorySlug.mode.title') }}</span>
              <span class="pointer-events-none text-gray-500">
                {{ useEnum(StoryMode).toLabel(story.storyMode) }}
              </span>
            </li>
            <li>
              <span class="block text-xs font-semibold">{{ $t('StorySlug.audience.title') }}</span>
              <span class="pointer-events-none text-gray-500">
                {{ useEnum(StoryAudience).toLabel(story.storyAudience) }}
              </span>
            </li>
          </ul>
        </div>

        <time class="mx-auto block text-xs text-gray-500">
          {{ $t('StorySlug.createdAt', { date: formattedDate }) }}
        </time>
      </div>

      <div class="order-0 mx-auto flex w-full flex-col px-6 xl:order-1 xl:px-10">
        <StoryItem
          :story="story"
          @card-click="onCardClick"
          @key-not-found="apiKeyModal = { visible: true }"
        />
      </div>
    </div>

    <CharacterDetailsModal
      v-if="characterModal"
      v-model="characterModal"
      :character="characterModal.character"
    />

    <ApiKeyModal v-if="apiKeyModal" v-model="apiKeyModal" v-model:api-key-model="apiKey" />
  </div>
</template>
