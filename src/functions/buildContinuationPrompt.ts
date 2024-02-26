import type { Chapter, GetContinuationPromptOptions, Story } from '@/types/local'
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

export default function buildContinuationPrompt(options: GetContinuationPromptOptions) {
  const checks = storyChecks(options.story)

  const storyLabel =
    options.story.storyMode === StoryMode.DECISION_MAKING
      ? 'decision making story game'
      : 'fun story'

  const contextBlock = getBlock('Given this story', options.story.title)

  const genreBlock = getBlock(
    'Given these story genres selected by the user',
    options.story.storyGenres.join(', ')
  )

  const chaptersBlock = getBlock(
    'Given these story chapters',
    options.story.chapters,
    omittedFields
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

  const nextChapterBlock = getBlock(
    'Given this choice for the continuation of the story coming from user input',
    options.continuationInstruction
  )

  const userInstructionsBlock = getBlock(
    'Given these special instructions coming from the user',
    options.story.customInstructions
  )

  const structureBlock = getBlock(
    'Given this typescript definition we need as response',
    `
{
  chapter: {
    title: string
    content: string
  }
  ${getLineIf(checks.requiresActions() || checks.requiresLastChapterActions(), 'nextChapterActionDecisions: string[]')}
  ${getLineIf(checks.requiresSuggestions() || checks.requiresLastChapterSuggestions(), 'nextChapterSuggestions: string[]')}
}`
  )

  const instructionsBlock = getBlock(
    'Follow these instructions',
    `
${getLineIf(checks.isOpenEnding(), `- Create the next chapter to continue this ${storyLabel}, also formatting the content in markdown (MD) using the same text structure as in the current story, based on the chapter continuation choice the user provided`)}
${getLineIf(checks.isMultiChapter(), `- Create the chapter ${options.story.chapters.length + 1}/${options.story.totalChapters} to continue this ${storyLabel}, also formatting the content in markdown (MD) using the same structure as in the current story, based on the chapter continuation choice the user provided`)}
${getLineIf(options.story.storyStyle === StoryStyle.SCRIPT, '- This is a script so only dialogues between the characters should be included, and a minimal story context should be given at any point of the script as needed')}
${getLineIf(checks.isLastChapter(), '- This is the last chapter and needs to conclude the story')}
${getLineIf(checks.requiresSuggestions(), '- Suggest 3 situational ideas for the next chapter, that the user can select from to further continue the story')}
${getLineIf(checks.requiresLastChapterSuggestions(), '- Suggest 3 ideas for the ending, that the user can select from to finish the story')}
${getLineIf(checks.requiresActions(), '- Include 3 possible specific actions for a main character to take that the user needs to select from to further continue the story')}
${getLineIf(checks.requiresLastChapterActions(), '- Include 3 possible specific actions for a main character to take that the user needs to select from to end the story')} 
- IMPORTANT: The length of the content should be long enough to be read in ${options.story.storyLength}
- IMPORTANT: Generate a JSON response strictly respecting the provided typescript structure. Exclude any comments, explanations, or guidance in the provided JSON output`
  )

  return `${contextBlock}
${genreBlock}
${chaptersBlock}
${mainCharactersBlock}
${secondaryCharactersBlock}
${nextChapterBlock}
${userInstructionsBlock}
${structureBlock}
${instructionsBlock}`
}
