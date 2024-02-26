import { computed, type Ref, unref } from 'vue'
import type { GetCharacterItemsByIdsQueryVariables } from '@/types/generated'
import { useGetCharacterItemsByIdsLazyQuery } from '@/graphql/operations'

export default function useCharacterItemsByIds(
  variables?:
    | Ref<GetCharacterItemsByIdsQueryVariables | undefined>
    | GetCharacterItemsByIdsQueryVariables
) {
  const unrefVariables = computed(
    () =>
      ({
        ids: unref(variables)?.ids ?? []
      }) satisfies GetCharacterItemsByIdsQueryVariables
  )

  const { error, loading, load, refetch } = useGetCharacterItemsByIdsLazyQuery(unrefVariables)

  async function fetchOrRefetch() {
    const loadResult = await load()
    if (!loadResult) {
      const refetchResult = await refetch()
      return refetchResult?.data.charactersByIds
    }
    return loadResult.charactersByIds
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
