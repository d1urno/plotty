import { computed, ref, type Ref, unref } from 'vue'
import { useGetCharacterListQuery } from '@/graphql/operations'
import type { GetCharacterListQueryVariables } from '@/types/generated'
import { storeToRefs } from 'pinia'
import { useStore } from '@/stores'
import { PresetCharacterGroups } from '@/constants/rules'
import type { CustomCharacterListVariables } from '@/composables/useCustomCharacterList'
import useCustomCharacterList from '@/composables/useCustomCharacterList'

export interface CharacterListOptions {
  isReady?: Ref<boolean>
}

export default function useCharacterList(
  variables?: Ref<GetCharacterListQueryVariables | undefined> | GetCharacterListQueryVariables,
  customVariables?:
    | Ref<Omit<CustomCharacterListVariables, 'id'> | undefined>
    | Omit<CustomCharacterListVariables, 'id'>,
  options: CharacterListOptions = {}
) {
  const { selectedCharacterGroup } = storeToRefs(useStore())

  const customListVariables = computed(() => ({
    id: selectedCharacterGroup.value.selectedGroupId,
    ...unref(customVariables),
    filter: { ...unref(customVariables)?.filter, name: unref(variables)?.filter?.name ?? '' } // As all groups share the name filter
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
        selectedCharacterGroup.value.selectedGroupId === PresetCharacterGroups.RICK_AND_MORTY &&
        unref(options.isReady)
    })
  )

  const loading = computed(() => networkStatus.value === 1)
  const loadingNext = computed(() => networkStatus.value === 3)

  const apiCharacterList = computed(() => result.value?.characters.results)
  const apiListInfo = computed(() => result.value?.characters.info)

  const characterList = computed(() => {
    switch (selectedCharacterGroup.value.selectedGroupId) {
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
