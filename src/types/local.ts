import type { App } from 'vue'
import type { RouteRecordRaw } from 'vue-router'
import type {
  StoryStyle,
  StoryGenre,
  StoryLength,
  StoryMode,
  StoryStructure
} from '@/constants/rules'

export type AppModule = (context: { app: App; routes: RouteRecordRaw[]; baseUrl: string }) => void

export interface GetStoryPromptOptions {
  mainCharacters?: BaseCharacter[]
  secondaryCharacters?: BaseCharacter[]
  decisionMakers?: BaseCharacter[]
  specialInstructions?: string
  totalChapters: number
  storyMode: StoryMode
  storyStyle: StoryStyle
  storyLength: StoryLength
  storyStructure: StoryStructure
  storyGenres: StoryGenre[]
}

export interface GetContinuationPromptOptions {
  mainCharacters?: BaseCharacter[]
  secondaryCharacters?: BaseCharacter[]
  decisionMakers?: BaseCharacter[]
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

export interface CustomCharacter extends Record<string, string | undefined> {
  id: string
  name: string
  image: string
  created: string
  updated: string
  groupId: string
  __typename?: string
}

export type CharacterFormData = Omit<CustomCharacter, 'created' | 'updated' | '__typename'>

export interface CustomCharacterGroup {
  id: string
  title: string
  description: string
  created: string
  updated: string
  fields: string[]
  __typename?: string
  characters: CustomCharacter[]
}

export type CharacterGroupFormData = Omit<
  CustomCharacterGroup,
  'created' | 'updated' | '__typename'
>

export interface BaseCharacter extends Record<string, string | object | undefined> {
  id: string
  name: string
  image: string
  created: string
  __typename?: string
}
