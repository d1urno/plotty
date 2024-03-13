import type { Story } from '@/types/local'
import { storeToRefs } from 'pinia'
import { useStore } from '@/stores'
import { slugify } from '@/utils'
import { deleteArrayBuffer } from '@/functions/indexedDBOperations'

export default function useStoryApi() {
  const { stories } = storeToRefs(useStore())

  function saveStory(updatedStory: Story, updateSlug = true) {
    const index = stories.value.findIndex((s) => s.id === updatedStory.id)
    if (index === undefined || index === -1) stories.value.unshift({ ...updatedStory })
    else if (updateSlug) {
      // Avoid duplicated slugs
      let slug
      const occurrences = stories.value.filter((s) => s.title === updatedStory.title)
      if (occurrences.length > 1) {
        slug = slugify(`${updatedStory.title}-${occurrences.length}`)
      } else {
        slug = slugify(updatedStory.title)
      }
      stories.value.splice(index, 1, { ...updatedStory, slug })
    } else stories.value.splice(index, 1, { ...updatedStory })
  }

  async function deleteStory(storyId: string) {
    const index = stories.value.findIndex((s) => s.id === storyId)

    // Delete story title array buffer
    await deleteArrayBuffer(storyId)

    // Delete all chapters' audioBuffers
    const chapterIds = stories.value[index].chapters.map((c) => c.id)
    const promises = [...chapterIds.map((id) => deleteArrayBuffer(id))]
    await Promise.all(promises)

    if (index !== undefined && index !== -1) stories.value.splice(index, 1)
  }

  return {
    saveStory,
    deleteStory
  }
}
