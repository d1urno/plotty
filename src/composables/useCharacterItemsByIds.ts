import { computed, type Ref, unref } from 'vue'
import type { GetCharacterItemsByIdsQueryVariables } from '@/types/generated'
import { useGetCharacterItemsByIdsLazyQuery } from '@/graphql/operations'
import { storeToRefs } from 'pinia'
import { useStore } from '@/stores'
import { CUSTOM_CHARACTER_ID_PREFIX } from '@/constants/rules'
import type { BaseCharacter } from '@/types/local'

export default function useCharacterItemsByIds(
  variables?:
    | Ref<GetCharacterItemsByIdsQueryVariables | undefined>
    | GetCharacterItemsByIdsQueryVariables
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
    return { ids } satisfies GetCharacterItemsByIdsQueryVariables
  })

  const { error, loading, load, refetch } = useGetCharacterItemsByIdsLazyQuery(
    rickAndMortyVariables,
    () => ({
      enabled: !!rickAndMortyVariables.value.ids.length
    })
  )

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

  async function fetchOrRefetch() {
    if (rickAndMortyVariables.value.ids.length) {
      const loadResult = await load()
      if (!loadResult) {
        const refetchResult = await refetch()
        return [...customCharacterList.value, ...(refetchResult?.data.charactersByIds ?? [])]
      }
      return [...customCharacterList.value, ...loadResult.charactersByIds]
    }
    return customCharacterList.value
  }

  return {
    fetchOrRefetch,
    loading,
    error
  }
}

export type QueriedCharacterItemsByIds = NonNullable<
  ReturnType<typeof useGetCharacterItemsByIdsLazyQuery>['result']['value']
>['charactersByIds']
export type QueriedCharacterItemsByIdsItem = NonNullable<QueriedCharacterItemsByIds>[number]
