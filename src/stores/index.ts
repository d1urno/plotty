import { defineStore } from 'pinia'
import { type Ref, ref } from 'vue'
import type { CustomCharacterGroup, Story } from '@/types/local'
import { useLocalStorage } from '@vueuse/core'
import type { GenericToast } from '@/components/GenericToast.vue'
import defaultStories from '@/constants/defaultStories'
import type { AppModal } from '@/components/AppModal.vue'
import { INITIAL_PRESET_GROUP_ID, PresetCharacterGroups } from '@/constants/rules'
import useURLObjectRef from '@/composables/useURLObjectRef'

// eslint-disable-next-line import/prefer-default-export
export const useStore = defineStore('store', () => {
  const appModal = ref<AppModal>()
  const appToasts = ref<GenericToast[]>()

  const isDragging = ref(false)
  const isPromptLoading = ref(false)
  const isAiLoading = ref(false)
  const isFirstTimeSettings: Ref<boolean> = useLocalStorage<boolean>('firstTimeSettings', true)
  const apiKey: Ref<string | undefined> = useLocalStorage<string | undefined>('apiKey', undefined)

  const baseSelectedCharacterGroup: Ref<{ selectedGroupId: PresetCharacterGroups | string }> =
    useLocalStorage<{ selectedGroupId: PresetCharacterGroups | string }>('selectedGroupId', {
      selectedGroupId: INITIAL_PRESET_GROUP_ID
    })

  const selectedCharacterGroup = useURLObjectRef(baseSelectedCharacterGroup, {
    defaultValues: { selectedGroupId: INITIAL_PRESET_GROUP_ID }
  })

  const stories: Ref<Story[]> = useLocalStorage<Story[]>('stories', defaultStories, {
    serializer: {
      read: (v: string) => (v ? JSON.parse(v) : null),
      write: (v: Story[]) => JSON.stringify(v)
    }
  })

  const customCharacterGroups: Ref<CustomCharacterGroup[]> = useLocalStorage<
    CustomCharacterGroup[]
  >('customCharacterGroups', [], {
    serializer: {
      read: (v: string) => (v ? JSON.parse(v) : null),
      write: (v: CustomCharacterGroup[]) => JSON.stringify(v)
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
    selectedCharacterGroup,
    customCharacterGroups
  }
})
