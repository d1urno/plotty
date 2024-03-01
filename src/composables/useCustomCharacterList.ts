import { computed, type Ref, unref } from 'vue'
import { storeToRefs } from 'pinia'
import { useStore } from '@/stores'

export interface CustomCharacterListVariables {
  id: string
  filter?: { [key: string]: string | undefined }
}

export default function useCustomCharacterList(
  variables?: Ref<CustomCharacterListVariables | undefined> | CustomCharacterListVariables
) {
  const { customCharacterGroups } = storeToRefs(useStore())

  const unrefVariables = computed(() => unref(variables))

  const customCharacterList = computed(() => {
    let filteredList = customCharacterGroups.value.find(
      (c) => c.id === unrefVariables.value?.id
    )?.characters

    if (!unrefVariables.value?.filter) return filteredList

    // Name search filter
    if (unrefVariables.value.filter?.name?.length) {
      filteredList = filteredList?.filter(
        (c) =>
          unrefVariables.value?.filter?.name &&
          c.name.toLocaleLowerCase().includes(unrefVariables.value.filter.name.toLocaleLowerCase())
      )
    }

    // Custom filters
    if (unrefVariables.value?.filter) {
      Object.keys(unrefVariables.value.filter).forEach((key) => {
        if (key === 'name' || !unrefVariables.value?.filter?.[key]) return
        filteredList = filteredList?.filter((c) => c[key] === unrefVariables.value?.filter?.[key])
      })
    }

    return filteredList
  })

  return {
    customCharacterList
  }
}
