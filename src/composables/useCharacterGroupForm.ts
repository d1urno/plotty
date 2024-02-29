import { createSharedComposable } from '@vueuse/core'
import type { CharacterGroupFormData } from '@/types/local'
import useFormData from '@/composables/useFormData'
import defaultCharacterGroupFormData from '@/constants/defaultCharacterGroupFormData'

function useCharacterGroupForm() {
  return useFormData<CharacterGroupFormData>(
    'character-group',
    { ...defaultCharacterGroupFormData },
    {}
  )
}

export default createSharedComposable(useCharacterGroupForm)
