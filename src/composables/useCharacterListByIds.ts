import { computed, type Ref, unref } from 'vue'
import { useGetCharacterListByIdsQuery } from '@/graphql/operations'
import type { GetCharacterListByIdsQueryVariables } from '@/types/generated'
import { useStore } from '@/stores'
import { storeToRefs } from 'pinia'
import { CUSTOM_CHARACTER_ID_PREFIX } from '@/constants/rules'
import type { BaseCharacter } from '@/types/local'

export default function useCharacterListByIds(
  variables?:
    | Ref<GetCharacterListByIdsQueryVariables | undefined>
    | GetCharacterListByIdsQueryVariables,
  cacheOnly = false
) {
  const { customCharacterGroups } = storeToRefs(useStore())

  const customCharacterVariables = computed(() => {
    const ids: string[] = []
    const unrefV = unref(variables)
    if (Array.isArray(unrefV?.ids)) {
      ids.push(...unrefV.ids.filter((id) => id.startsWith(CUSTOM_CHARACTER_ID_PREFIX)))
    } else if (unrefV?.ids && unrefV.ids.startsWith(CUSTOM_CHARACTER_ID_PREFIX))
      ids.push(unrefV.ids)
    return { ids }
  })

  const rickAndMortyVariables = computed(() => {
    const ids: string[] = []
    const unrefV = unref(variables)
    if (Array.isArray(unrefV?.ids)) {
      ids.push(...unrefV.ids.filter((id) => !id.startsWith(CUSTOM_CHARACTER_ID_PREFIX)))
    } else if (unrefV?.ids && !unrefV.ids.startsWith(CUSTOM_CHARACTER_ID_PREFIX))
      ids.push(unrefV.ids)
    return { ids } satisfies GetCharacterListByIdsQueryVariables
  })

  const { result, error, loading } = useGetCharacterListByIdsQuery(rickAndMortyVariables, () => ({
    fetchPolicy: cacheOnly ? 'cache-only' : 'cache-first',
    enabled: !!rickAndMortyVariables.value.ids.length
  }))

  const rickAndMortyCharacterList = computed(() => result.value?.charactersByIds)

  const customCharacterList = computed(() => {
    const customCharacters: BaseCharacter[] = []
    customCharacterGroups.value.forEach((c) => {
      c.characters.forEach((cc) => {
        customCharacterVariables.value.ids.forEach((id) => {
          if (cc.id === id) customCharacters.push(cc)
        })
      })
    })
    return customCharacters
  })

  const characterList = computed(() => [
    ...customCharacterList.value,
    ...(rickAndMortyCharacterList.value ?? [])
  ])

  return {
    characterList,
    loading,
    error
  }
}
