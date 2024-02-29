import type { BaseCharacter, CustomCharacter } from '@/types/local'
import { CUSTOM_CHARACTER_ID_PREFIX } from '@/constants/rules'

export default function isCustomCharacter(character: BaseCharacter): character is CustomCharacter {
  return character.id.startsWith(CUSTOM_CHARACTER_ID_PREFIX)
}
