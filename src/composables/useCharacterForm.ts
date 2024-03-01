import { createSharedComposable } from '@vueuse/core'
import type { CharacterFormData } from '@/types/local'
import defaultCharacterFormData from '@/constants/defaultCharacterFormData'
import useFormData from '@/composables/useFormData'

function useCharacterForm() {
  return useFormData<CharacterFormData>('character', { ...defaultCharacterFormData }, {})
}

export default createSharedComposable(useCharacterForm)
