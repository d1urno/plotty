import { defineStore } from 'pinia'
import { type Ref, ref } from 'vue'
import type { Story, StoryFormData } from '@/types/local'
import { useLocalStorage } from '@vueuse/core'
import type { GenericToast } from '@/components/GenericToast.vue'
import defaultStories from '@/constants/defaultStories'
import defaultStoryFormData from '@/constants/defaultStoryFormData'
import type { AppModal } from '@/components/AppModal.vue'

// eslint-disable-next-line import/prefer-default-export
export const useStore = defineStore('store', () => {
  const appModal = ref<AppModal>()
  const appToasts = ref<GenericToast[]>()

  const isDragging = ref(false)
  const isPromptLoading = ref(false)
  const isAiLoading = ref(false)
  const isFirstTimeSettings: Ref<boolean> = useLocalStorage<boolean>('firstTimeSettings', true)
  const apiKey: Ref<string | undefined> = useLocalStorage<string | undefined>('apiKey', undefined)
  const storyFormData = ref<StoryFormData>({ ...defaultStoryFormData })

  const stories: Ref<Story[]> = useLocalStorage<Story[]>('stories', defaultStories, {
    serializer: {
      read: (v: string) => (v ? JSON.parse(v) : null),
      write: (v: Story[]) => JSON.stringify(v)
    }
  })

  return {
    apiKey,
    stories,
    isDragging,
    isPromptLoading,
    isAiLoading,
    appModal,
    appToasts,
    isFirstTimeSettings,
    storyFormData
  }
})
