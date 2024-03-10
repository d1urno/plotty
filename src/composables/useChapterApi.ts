import type { Chapter, Story } from '@/types/local'
import useStoryApi from '@/composables/useStoryApi'

export default function useChapterApi() {
  const { saveStory } = useStoryApi()

  function saveChapter(updatedChapter: Chapter, story: Story) {
    const updatedStory = { ...story }
    const index = story.chapters.findIndex((c) => c.id === updatedChapter.id)
    if (index === undefined || index === -1) updatedStory.chapters.push({ ...updatedChapter })
    else updatedStory.chapters.splice(index, 1, { ...updatedChapter })

    saveStory(updatedStory)
  }

  return {
    saveChapter
  }
}
