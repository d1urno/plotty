import type { CharacterFormData } from '@/types/local'
import { CUSTOM_CHARACTER_GROUP_ID } from '@/constants/rules'

export default {
  id: '',
  name: '',
  image: '',
  groupId: CUSTOM_CHARACTER_GROUP_ID
} satisfies CharacterFormData
