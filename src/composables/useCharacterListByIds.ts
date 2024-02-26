import { computed, type Ref, unref } from 'vue'
import { useGetCharacterListByIdsQuery } from '@/graphql/operations'
import type { GetCharacterListByIdsQueryVariables } from '@/types/generated'

export default function useCharacterListByIds(
  variables?:
    | Ref<GetCharacterListByIdsQueryVariables | undefined>
    | GetCharacterListByIdsQueryVariables,
  cacheOnly = false
) {
  const unrefVariables = computed(
    () =>
      ({
        ids: unref(variables)?.ids ?? []
      }) satisfies GetCharacterListByIdsQueryVariables
  )

  const { result, error, loading } = useGetCharacterListByIdsQuery(unrefVariables, () => ({
    fetchPolicy: cacheOnly ? 'cache-only' : 'cache-first',
    enabled: !!unrefVariables.value.ids.length
  }))

  const characterList = computed(() => result.value?.charactersByIds)

  return {
    characterList,
    loading,
    error
  }
}

export type QueriedCharacterListByIds = ReturnType<
  typeof useCharacterListByIds
>['characterList']['value']
