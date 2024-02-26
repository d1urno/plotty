import { computed, ref, type Ref, unref } from 'vue'
import { useGetCharacterListQuery } from '@/graphql/operations'
import type { GetCharacterListQueryVariables } from '@/types/generated'

export default function useCharacterList(
  variables?: Ref<GetCharacterListQueryVariables | undefined> | GetCharacterListQueryVariables
) {
  const page = ref(1)
  const unrefVariables = computed(
    () =>
      ({
        ...unref(variables),
        filter: { ...unref(variables)?.filter, name: unref(variables)?.filter?.name ?? '' },
        page: page.value
      }) satisfies GetCharacterListQueryVariables
  )

  const { result, fetchMore, networkStatus, error } = useGetCharacterListQuery(
    unrefVariables,
    () => ({ enabled: !!Object.keys(unrefVariables.value.filter ?? {}).length })
  )

  const loading = computed(() => networkStatus.value === 1)
  const loadingNext = computed(() => networkStatus.value === 3)

  const characterList = computed(() => result.value?.characters.results)
  const listInfo = computed(() => result.value?.characters.info)

  function fetchNext() {
    if (!listInfo.value?.next) return
    fetchMore({ variables: { page: Number(listInfo.value.next) } })
  }

  return {
    characterList,
    listInfo,
    loading,
    loadingNext,
    error,
    fetchNext
  }
}

export type QueriedCharacterList = ReturnType<typeof useCharacterList>['characterList']['value']
export type QueriedCharacterListItem = NonNullable<QueriedCharacterList>[number]
