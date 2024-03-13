import type { Chapter, Story } from '@/types/local'
import useStoryApi from '@/composables/useStoryApi'
import indexedDBOperations from '@/functions/indexedDBOperations'

export default function useChapterApi() {
  const { saveStory } = useStoryApi()
  const { deleteItem } = indexedDBOperations('arrayBuffer')

  function saveChapter(updatedChapter: Chapter, story: Story) {
    const updatedStory = { ...story }
    const index = story.chapters.findIndex((c) => c.id === updatedChapter.id)
    if (index === undefined || index === -1) updatedStory.chapters.push({ ...updatedChapter })
    else updatedStory.chapters.splice(index, 1, { ...updatedChapter })

    saveStory(updatedStory)
  }

  async function deleteChapters(chapterId: string[], story: Story) {
    const updatedStory = { ...story }

    // Delete audioBuffers
    const promises = chapterId.map((id) => deleteItem(id))
    await Promise.all(promises)

    updatedStory.chapters = updatedStory.chapters.filter((c) => !chapterId.includes(c.id))
    saveStory(updatedStory)
  }

  return {
    saveChapter,
    deleteChapters
  }
}
