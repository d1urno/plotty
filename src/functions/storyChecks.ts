import type { Chapter } from '@/types/local'
import { StoryMode, StoryStructure } from '@/constants/rules'

interface StoryChecksOptions {
  storyMode: StoryMode
  storyStructure: StoryStructure
  totalChapters: number
  chapters?: Chapter[]
}

export default function storyChecks(options: StoryChecksOptions) {
  function isOpenEnding() {
    return options.storyStructure === StoryStructure.OPEN_ENDING
  }

  function isSingleChapter() {
    return options.storyStructure === StoryStructure.SIMPLE
  }

  function isMultiChapter() {
    return options.storyStructure === StoryStructure.MULTI_CHAPTER
  }

  function isLastChapter() {
    return isMultiChapter() && options.totalChapters === (options.chapters?.length ?? 0) + 1
  }

  function isNextLastChapter() {
    return isMultiChapter() && options.totalChapters === (options.chapters?.length ?? 0) + 2
  }

  function requiresActions() {
    return (
      !isNextLastChapter() && !isLastChapter() && options.storyMode === StoryMode.DECISION_MAKING
    )
  }

  function requiresSuggestions() {
    return !requiresActions() && !isNextLastChapter() && !isLastChapter() && !isSingleChapter()
  }

  function requiresLastChapterActions() {
    return isNextLastChapter() && options.storyMode === StoryMode.DECISION_MAKING
  }

  function requiresLastChapterSuggestions() {
    return !requiresLastChapterActions() && isNextLastChapter() && !isSingleChapter()
  }

  return {
    requiresActions,
    requiresSuggestions,
    isLastChapter,
    isNextLastChapter,
    requiresLastChapterSuggestions,
    requiresLastChapterActions,
    isSingleChapter,
    isMultiChapter,
    isOpenEnding
  }
}
