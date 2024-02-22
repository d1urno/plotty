import type { App } from 'vue'
import type { RouteRecordRaw } from 'vue-router'
import type { QueriedCharacterItemsByIdsItem } from '@/composables/useCharacterItemsByIds'
import type {
  StoryStyle,
  StoryGenre,
  StoryLength,
  StoryMode,
  StoryStructure
} from '@/constants/rules'

export type AppModule = (context: { app: App; routes: RouteRecordRaw[]; baseUrl: string }) => void

export interface GetStoryPromptOptions {
  mainCharacters?: QueriedCharacterItemsByIdsItem[]
  secondaryCharacters?: QueriedCharacterItemsByIdsItem[]
  decisionMakers?: QueriedCharacterItemsByIdsItem[]
  specialInstructions?: string
  totalChapters: number
  storyMode: StoryMode
  storyStyle: StoryStyle
  storyLength: StoryLength
  storyStructure: StoryStructure
  storyGenres: StoryGenre[]
}

export interface GetContinuationPromptOptions {
  mainCharacters?: QueriedCharacterItemsByIdsItem[]
  secondaryCharacters?: QueriedCharacterItemsByIdsItem[]
  decisionMakers?: QueriedCharacterItemsByIdsItem[]
  story: Story
  continuationInstruction: string
}

export interface Chapter {
  id: string
  created: string
  updated?: string
  __typename?: string
  title: string
  content: string
  customInstructions?: string
  decidingCharacterName?: string
  nextChapterChoices?: string[]
  selectedChoiceIndex?: number
  customChoice?: string
}

export interface Story {
  id: string
  created: string
  updated?: string
  __typename?: string
  title: string
  mainCharacters: string[]
  secondaryCharacters: string[]
  decisionMakers: string[]
  chapters: Chapter[]
  totalChapters: number
  storyStyle: StoryStyle
  storyStructure: StoryStructure
  storyMode: StoryMode
  storyLength: StoryLength
  storyGenres: StoryGenre[]
  customInstructions: string
}

export type StoryFormData = Omit<Story, 'created' | 'updated' | 'title' | '__typename'>
