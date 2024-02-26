import { computed, type Ref, unref, watch, shallowRef } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
// import useVuelidate from '@vuelidate/core'
import type { Maybe } from 'graphql/jsutils/Maybe'
import { cloneDeep, generateUniqueId, isDeepEqual } from '@/utils'
import useURLObjectRef from '@/composables/useURLObjectRef'

function useFormsStore<T>() {
  return defineStore('forms', {
    state: () => ({
      forms: {} as { [key: string]: T }
    })
  })()
}

type SetFormDataOptions<T> = {
  commitUpdate?: boolean
  item?: Ref<Maybe<T>> | Maybe<T>
}

/**
 * Utility type used to make string fields not nullable.
 * It's needed, for example, when binding those fields to a text input, which doesn't accept `null` as `modelValue`
 */
type WithoutNullString<T> = Required<
  T extends Record<string, Maybe<string>> ? { [Property in keyof T]: NonNullable<T[Property]> } : T
>

/**
 * Abstract common form logic using TypeGraphql, vuelidate and apollo stack, returning reactive values and handy functions
 * @param key Unique string to identify the form
 * @param defaultValues
 * @param defaultOptimisticValues
 * @param syncWithUrl Optional - Sync form data with URL query parameters
 // * @param rules Optional - Vuelidate rules object
 */
export default function useFormData<T extends Record<string, unknown>, U = T>(
  key: string,
  defaultValues: WithoutNullString<T>,
  defaultOptimisticValues: Required<Omit<U, keyof typeof defaultValues>>,
  syncWithUrl = false
  // rules?: Record<string, unknown>
) {
  const { forms } = storeToRefs(useFormsStore<WithoutNullString<T>>())
  if (!forms.value[key]) forms.value[key] = { ...defaultValues, id: generateUniqueId() }

  const formData = computed({
    get: () => forms.value[key],
    set: (val: WithoutNullString<T>) => {
      forms.value[key] = val
    }
  })

  const urlFormData = useURLObjectRef(formData)

  function getMutableFormData(): Ref<WithoutNullString<T>> {
    return syncWithUrl ? urlFormData : formData
  }

  const snapshot = shallowRef({ ...formData.value })

  // const v$ = useVuelidate(rules || {}, formData)
  const isDirty = computed(() => formData.value && !isDeepEqual(formData.value, snapshot.value))

  function commit() {
    snapshot.value = cloneDeep(formData.value)
  }

  function setFormData(input?: Partial<WithoutNullString<T>>, options?: SetFormDataOptions<U>) {
    const unrefItem = unref(options?.item)
    if (unrefItem) {
      getMutableFormData().value = {
        ...(Object.fromEntries(
          Object.entries(unrefItem).filter(([key]) => Object.keys(defaultValues).includes(key))
        ) as WithoutNullString<T>),
        ...(input ?? {})
      }
    } else getMutableFormData().value = { ...formData.value, ...(input ?? {}) }
    if (options?.commitUpdate) commit()
  }

  function watchFormItem<V extends Maybe<U>>(item: Ref<V>, callback?: (item?: V) => void) {
    watch(
      () => item.value,
      (val) => {
        setFormData(undefined, { item: val, commitUpdate: false })
        callback?.(val)
        commit()
      },
      { immediate: true }
    )
  }

  /**
   * Transform a given payload into an TypeGraphql Update input
   */
  function getTGUpdatePayload<T>() {
    return Object.fromEntries(
      Object.entries(formData.value).reduce(
        (acc, [key, value]) => {
          if (value === undefined) return acc
          return [...acc, [key, Object.fromEntries([['set', value]])]]
        },
        [] as [string, unknown][]
      )
    ) as T
  }

  /**
   * Transform a given payload into an TypeGraphql Create input
   */
  function getTGCreatePayload<T>() {
    return Object.fromEntries(
      Object.entries(formData.value).reduce(
        (acc, [key, value]) => {
          if (value === undefined) return acc
          return [...acc, [key, Array.isArray(value) ? { set: [...value] } : value]]
        },
        [] as [string, unknown][]
      )
    ) as T
  }

  function getPayload<T>() {
    return Object.fromEntries(
      Object.entries(formData.value).reduce(
        (acc, [key, value]) => {
          if (value === undefined) return acc
          return [...acc, [key, value]]
        },
        [] as [string, unknown][]
      )
    ) as T
  }

  function getOptimisticResponse(overrideWith?: Partial<U>): U {
    return {
      ...defaultOptimisticValues,
      ...formData.value,
      ...(overrideWith ?? {})
    } as U
  }

  function resetFormData() {
    getMutableFormData().value = { ...defaultValues, id: generateUniqueId() }
    // v$.value.$reset()
  }

  return {
    formData: getMutableFormData(),
    // v$,
    isDirty,
    setFormData,
    commit,
    resetFormData,
    watchFormItem,
    getTGCreatePayload,
    getTGUpdatePayload,
    getPayload,
    getOptimisticResponse
  }
}
