import { StoryGenre, StoryLength, StoryMode, StoryStructure, StoryStyle } from '@/constants/rules'
import type { StoryFormData } from '@/types/local'

export default {
  id: '',
  title: '',
  mainCharacters: [] as string[],
  secondaryCharacters: [] as string[],
  totalChapters: 3,
  storyStyle: StoryStyle.NARRATIVE,
  storyStructure: StoryStructure.SIMPLE,
  storyMode: StoryMode.NORMAL,
  storyLength: StoryLength.SHORT,
  storyGenres: [StoryGenre.COMEDY],
  decisionMakers: [] as string[],
  chapters: [],
  customInstructions: ''
} as StoryFormData
