import { computed, type Ref, unref } from 'vue'
import { useGetCharacterItemQuery } from '@/graphql/operations'
import type { GetCharacterItemQueryVariables } from '@/types/generated'
import { CUSTOM_CHARACTER_ID_PREFIX } from '@/constants/rules'
import { useStore } from '@/stores'
import { storeToRefs } from 'pinia'

export default function useCharacterItem(
  variables: Ref<GetCharacterItemQueryVariables> | GetCharacterItemQueryVariables
) {
  const { customCharacterGroups } = storeToRefs(useStore())

  const unrefId = computed(() => unref(variables).id)
  const { result, loading, error } = useGetCharacterItemQuery(variables, () => ({
    returnPartialData: true,
    enabled: !unrefId.value.startsWith(CUSTOM_CHARACTER_ID_PREFIX)
  }))

  const customCharacterItem = computed(() => {
    if (!unrefId.value.startsWith(CUSTOM_CHARACTER_ID_PREFIX)) return undefined
    return customCharacterGroups.value
      .find((c) => c.characters.some((cc) => cc.id === unrefId.value))
      ?.characters.find((c) => c.id === unrefId.value)
  })

  const characterItem = computed(() => {
    if (unrefId.value.startsWith(CUSTOM_CHARACTER_ID_PREFIX)) return customCharacterItem.value
    return result.value?.character
  })

  return {
    characterItem,
    loading,
    error
  }
}
