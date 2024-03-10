import type { Story } from '@/types/local'
import { storeToRefs } from 'pinia'
import { useStore } from '@/stores'

export default function useStoryApi() {
  const { stories } = storeToRefs(useStore())

  function saveStory(updatedStory: Story) {
    const index = stories.value.findIndex((s) => s.id === updatedStory.id)
    if (index === undefined || index === -1) stories.value.unshift({ ...updatedStory })
    else stories.value.splice(index, 1, { ...updatedStory })
  }

  function deleteStory(storyId: string) {
    const index = stories.value.findIndex((s) => s.id === storyId)
    if (index !== undefined && index !== -1) stories.value.splice(index, 1)
  }

  return {
    saveStory,
    deleteStory
  }
}
