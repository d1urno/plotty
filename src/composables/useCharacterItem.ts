import { computed, type Ref } from 'vue'
import { useGetCharacterItemQuery } from '@/graphql/operations'
import type { GetCharacterItemQueryVariables } from '@/types/generated'

export default function useCharacterItem(
  variables: Ref<GetCharacterItemQueryVariables> | GetCharacterItemQueryVariables
) {
  const { result, loading, error } = useGetCharacterItemQuery(variables, () => ({
    returnPartialData: true
  }))
  const characterItem = computed(() => result.value?.character)

  return {
    characterItem,
    loading,
    error
  }
}

export type QueriedCharacterItem = ReturnType<typeof useCharacterItem>['characterItem']['value']
