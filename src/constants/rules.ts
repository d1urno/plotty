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

export const PRESET_AUDIOS = {
  '0f4f7f7d-9093-47ff-8a3e-7f48f18a9088':
    'https://res.cloudinary.com/bluefields/video/upload/v1710321355/plotty/static/22f0981b-75de-492e-b9c1-173c374db9ad_ct5bno.ogg',
  '115163c1-c92b-4f32-bb60-39e850ff9133':
    'https://res.cloudinary.com/bluefields/video/upload/v1710321354/plotty/static/d0b1560d-63f3-4828-a210-f0b5db66a7cf_pmmhfw.ogg',
  '9ec6fd5e-5180-4515-9f28-ef6683c8dcd7':
    'https://res.cloudinary.com/bluefields/video/upload/v1710321354/plotty/static/e4b0ecad-0826-4d48-9be5-64f017e43340_ewr7qj.ogg',
  '100dc541-7793-4015-934a-1f75d54cb538':
    'https://res.cloudinary.com/bluefields/video/upload/v1710321354/plotty/static/6fa40f68-28ff-44ac-b8a9-bb5f69ca403d_xsl80d.ogg',
  '98c9a35f-ebdb-44da-8f40-5df9bda8f24b':
    'https://res.cloudinary.com/bluefields/video/upload/v1710321354/plotty/static/3c6cbbff-24fd-415d-b52c-982dc8045fbc_i2skxi.ogg',
  '06ded394-a717-4d66-9d6e-88ee9a18f784':
    'https://res.cloudinary.com/bluefields/video/upload/v1710321354/plotty/static/14d83187-fd9e-4c79-9e59-060fcdeac491_johqsl.ogg'
} as Record<string, string>
