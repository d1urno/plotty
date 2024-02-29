import { computed, ref, type Ref, unref } from 'vue'
import { useGetCharacterListQuery } from '@/graphql/operations'
import type { GetCharacterListQueryVariables } from '@/types/generated'
import { storeToRefs } from 'pinia'
import { useStore } from '@/stores'
import { PresetCharacterGroups } from '@/constants/rules'
import type { CustomCharacterListVariables } from '@/composables/useCustomCharacterList'
import useCustomCharacterList from '@/composables/useCustomCharacterList'

export default function useCharacterList(
  variables?: Ref<GetCharacterListQueryVariables | undefined> | GetCharacterListQueryVariables,
  customVariables?:
    | Ref<Omit<CustomCharacterListVariables, 'id'> | undefined>
    | Omit<CustomCharacterListVariables, 'id'>
) {
  const { selectedCharacterGroupId } = storeToRefs(useStore())

  const customListVariables = computed(() => ({
    id: selectedCharacterGroupId.value,
    ...unref(customVariables)
  }))
  const { customCharacterList } = useCustomCharacterList(customListVariables)

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
    () => ({
      enabled:
        selectedCharacterGroupId.value === PresetCharacterGroups.RICK_AND_MORTY &&
        !!Object.keys(unrefVariables.value.filter ?? {}).length
    })
  )

  const loading = computed(() => networkStatus.value === 1)
  const loadingNext = computed(() => networkStatus.value === 3)

  const apiCharacterList = computed(() => result.value?.characters.results)
  const apiListInfo = computed(() => result.value?.characters.info)

  const characterList = computed(() => {
    switch (selectedCharacterGroupId.value) {
      case PresetCharacterGroups.RICK_AND_MORTY:
        return apiCharacterList.value
      default:
        return customCharacterList.value
    }
  })

  function fetchNext() {
    if (!apiListInfo.value?.next) return
    fetchMore({ variables: { page: Number(apiListInfo.value.next) } })
  }

  return {
    characterList,
    apiListInfo,
    loading,
    loadingNext,
    error,
    fetchNext
  }
}
