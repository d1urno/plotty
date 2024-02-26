import { createSharedComposable } from '@vueuse/core'
import type { StoryFormData } from '@/types/local'
import defaultStoryFormData from '@/constants/defaultStoryFormData'
import useFormData from '@/composables/useFormData'

function useStoryForm() {
  return useFormData<StoryFormData>('story', { ...defaultStoryFormData }, {}, true)
}

export default createSharedComposable(useStoryForm)
