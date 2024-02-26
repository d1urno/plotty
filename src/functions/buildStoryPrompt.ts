import type { Chapter, GetStoryPromptOptions, Story } from '@/types/local'
import { StoryMode, StoryStyle } from '@/constants/rules'
import { getBlock, getLineIf } from '@/utils'
import storyChecks from '@/functions/storyChecks'

const omittedFields: (keyof Story)[] | (keyof Chapter)[] = [
  'id',
  'created',
  'updated',
  '__typename',
  'nextChapterChoices',
]

export default function buildStoryPrompt(options: GetStoryPromptOptions) {
  const checks = storyChecks(options)

  const storyLabel =
    options.storyMode === StoryMode.DECISION_MAKING ? 'decision making story game' : 'fun story'

  const contextBlock = getBlock(
    'Given this context',
    `A ${storyLabel} is a text that needs to be based on the user selections and specifications, and be interesting and fun for people to read.`
  )

  const genreBlock = getBlock(
    'Given these story genres selected by the user',
    options.storyGenres.join(', ')
  )

  const mainCharactersBlock = getBlock(
    'Given these main characters coming from user input',
    options.mainCharacters,
    omittedFields
  )

  const secondaryCharactersBlock = getBlock(
    'Given these secondary characters coming from user input',
    options.secondaryCharacters,
    omittedFields
  )

  const userInstructionsBlock = getBlock(
    'Given these special instructions coming from the user',
    options.specialInstructions
  )

  const structureBlock = getBlock(
    'Given this typescript definition we need as response',
    `
{
  title: string
  ${!checks.isSingleChapter() ? 'chapters: { title: string, content: string }[]' : 'content: string'}
  ${getLineIf(checks.requiresActions(), 'nextChapterActionDecisions: string[]')}
  ${getLineIf(checks.requiresSuggestions(), 'nextChapterSuggestions: string[]')}
}`
  )

  const instructionsBlock = getBlock(
    'Follow these instructions',
    `
${getLineIf(checks.isOpenEnding(), `- Create only the first chapter to start this ${storyLabel}, formatted in markdown (MD) that is super fun and humorous for people to read and it's based on the main characters and their specifications, using also the secondary characters as support`)}
${getLineIf(checks.isOpenEnding(), `- The story will have an open end, as the user will continue the story later on`)}
${getLineIf(checks.isSingleChapter(), `- Create a ${storyLabel}, formatted in markdown (MD) that is super fun and humorous for people to read and it's based on the main characters and their specifications, using also the secondary characters as support`)}
${getLineIf(checks.isMultiChapter(), `- Create only the first chapter of ${options.totalChapters} to start this ${storyLabel}, formatted in markdown (MD) that is super fun and humorous for people to read and it's based on the main characters and their specifications, using also the secondary characters as support`)}
${getLineIf(checks.isMultiChapter(), `- The complete story will have ${options.totalChapters} chapters in total, and you need to create only the first one for now, as the user will continue the story later on`)}
${getLineIf(checks.requiresActions(), `- Include 3 possible specific actions for a main character to take that the user needs to select from to further continue the story`)}
${getLineIf(checks.requiresSuggestions(), `- Suggest 3 situational ideas for the next chapter, that the user can select from to further continue the story`)}
${getLineIf(options.storyStyle === StoryStyle.NARRATIVE, '- This is a fun story to read that should be written in a narrative way, including the thoughts and feelings of the characters, and any other detailed story situations')}
${getLineIf(options.storyStyle === StoryStyle.SCRIPT, '- This is a script so only dialogues between the characters should be included to tell a story that is fun to read, and a minimal story context should be given at any point of the script as needed')}
${getLineIf(options.storyMode === StoryMode.DECISION_MAKING, '- This is a decision making story game in which the user will have to take specific decisions on behalf to one the main characters to continue the plot in radically different ways, a decision at the end of each chapter will be required to guide the story in a fun way to read and play')}
${getLineIf(!checks.isSingleChapter(), `- IMPORTANT: Do not include the title of the chapter in the content, as it's already provided in the typescript structure`)}
${getLineIf(!checks.isSingleChapter(), `- IMPORTANT: Do not include the number of the chapter in the chapter's title, we are going to display the chapter number separately`)}
- IMPORTANT: Do not include the chapter title in the suggested ideas or actions
- IMPORTANT: Separate the content with blank lines to make it easier to read
- IMPORTANT: The length of the content should be long enough to be read in ${options.storyLength}
- IMPORTANT: Generate a JSON response strictly respecting the provided typescript structure. Exclude any comments, explanations, or guidance in the provided JSON output`
  )

  return `${contextBlock}
${genreBlock}
${mainCharactersBlock}
${secondaryCharactersBlock}
${userInstructionsBlock}
${structureBlock}
${instructionsBlock}`
}