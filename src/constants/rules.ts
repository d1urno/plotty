export const MAIN_ROLES_LIMIT = 3
export const SECONDARY_ROLES_LIMIT = 6
export const MAX_CHAPTERS = 30
export const MAX_GENRES = 3
export const MAX_FREE_CHAPTERS = 3

export const CUSTOM_CHARACTER_ID_PREFIX = 'custom_'
export const CUSTOM_CHARACTER_GROUP_ID = 'custom-characters'
export const CUSTOM_CHARACTER_GROUP_NAME = 'Custom Characters'

export const CUSTOM_CHARACTER_KEYS_TO_OMIT = [
  'id',
  'created',
  'updated',
  '__typename',
  'name',
  'image',
  'groupId'
]
export const RICK_AND_MORTY_SUB_KEYS_TO_OMIT = ['id', 'created', 'updated', '__typename']

export enum StoryStyle {
  NARRATIVE = 'Narrative',
  SCRIPT = 'Script'
}

export enum StoryMode {
  NORMAL = 'Normal',
  DECISION_MAKING = 'Decision Making'
}

export enum StoryStructure {
  SIMPLE = 'Simple',
  MULTI_CHAPTER = 'Multi Chapter',
  OPEN_ENDING = 'Open Ending'
}

export enum StoryLength {
  SHORT = '1 minute',
  MEDIUM = '3 minutes',
  LONG = '5 minutes'
}

export enum StoryGenre {
  FANTASY = 'Fantasy',
  SCI_FI = 'Sci_Fi',
  ROMANCE = 'Romance',
  MYSTERY = 'Mystery',
  HISTORICAL = 'Historical',
  FUTURISTIC = 'Futuristic',
  COMEDY = 'Comedy',
  ACTION = 'Action',
  ADVENTURE = 'Adventure',
  DRAMA = 'Drama',
  AI = 'Let AI decide'
}

export enum StoryLanguage {
  ENGLISH = 'English from United States',
  SPANISH = 'Spanish from Argentina',
  FRENCH = 'French from France',
  GERMAN = 'German from Germany',
  PORTUGUESE = 'Portuguese from Brazil',
  AFRIKAANS = 'Afrikaans from South Africa'
}

export enum StoryAudience {
  ALL = 'All',
  KIDS = 'Kids',
  TEENS = 'Teens',
  ADULTS = 'Adults'
}

// To have access to the translation keys in useEnum composable
export const ENUMS: Record<string, unknown> = {
  StoryStyle,
  StoryMode,
  StoryStructure,
  StoryLength,
  StoryGenre,
  StoryLanguage,
  StoryAudience
}

export const ENUMS_TRANSLATION_KEY = 'enums'

export enum PresetCharacterGroups {
  RICK_AND_MORTY = 'Rick and Morty'
}

export const INITIAL_PRESET_GROUP_ID = PresetCharacterGroups.RICK_AND_MORTY
