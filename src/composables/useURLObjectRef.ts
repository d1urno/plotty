import { onBeforeUnmount, onMounted, ref, type Ref } from 'vue'
import { useRoute } from 'vue-router'
import { syncRef, watchIgnorable, watchPausable } from '@vueuse/core'
import useQueryEditor from '@/composables/useQueryEditor'
import { isDeepEqual } from '@/utils'
import type { UpdatePayload } from 'vite'

interface Options<T extends Ref<Record<string, unknown>>> {
  // The initial values of the object properties
  defaultValues?: T['value']
}

/**
   This function takes a single argument data, which is a reactive reference (Ref) to an object.
   This object's properties are synchronized with the URL query parameters.
   And returns a reactive reference (Ref) to the same object with the synchronized properties that
   can be used as a v-model.
   The second argument is optional and is the initial values of the object properties.

   @param data - A reactive reference (Ref) to an object.
   @param options - An object with optional properties.
   @returns A reactive reference (Ref) to the same object with the synchronized properties.
 */
export default function useURLObjectRef<T extends Ref<Record<string, unknown>>>(
  data: T,
  options: Options<T> = {}
) {
  const route = useRoute()
  const { replaceQuery } = useQueryEditor<T['value']>()

  const defaultValues = options.defaultValues ?? { ...data.value }
  const updatedData = ref({ ...defaultValues }) as T // Updated data is a ref of the same type as the arg data
  const virtualData = ref({ ...defaultValues }) as T // Virtual data is a ref of the same type as the arg data

  function normalizeValue<T>(value: T) {
    return Array.isArray(value) ? value.join(',') : value
  }

  // Assign values from the URL to the data
  function getDataFromQuery(query: Record<string, unknown>, baseObj: Record<string, unknown>) {
    const updatedObj = { ...baseObj }
    Object.keys(query).forEach((key) => {
      if (!Object.prototype.hasOwnProperty.call(baseObj, key)) return
      const item = query[key]?.toString()
      if (item?.length) {
        const isArray = Array.isArray(updatedObj[key])
        if (isArray) updatedObj[key] = item.split(',')
        else if (!Number.isNaN(Number(item))) updatedObj[key] = Number(item)
        else updatedObj[key] = item
      }
    })
    return updatedObj
  }

  let ignoreVirtualDataUpdates: Function | undefined

  // Watch for changes on the route query and update the data without triggering the virtual data ref update
  const { pause: pauseQueryWatcher, resume: resumeQueryWatcher } = watchPausable(
    () => route.query,
    (query) => {
      // Filter out query parameters that are not found in the object
      const filteredQuery = Object.fromEntries(
        Object.entries(query).filter(([key]) =>
          Object.prototype.hasOwnProperty.call(data.value, key)
        )
      )
      if (!isDeepEqual(filteredQuery, defaultValues)) {
        ignoreVirtualDataUpdates?.(() => {
          // Assign values from the URL to the data
          const urlData = getDataFromQuery(query, data.value)
          updatedData.value = { ...urlData }
          virtualData.value = { ...urlData }

          // Reset values to default if not found in the URL
          Object.keys(data.value).forEach((key) => {
            if (!query[key] && virtualData.value[key] !== defaultValues[key]) {
              updatedData.value[key] = defaultValues[key]
              virtualData.value[key] = defaultValues[key]
            }
          })
        })
      }
    }
  )

  // Watch virtual model changes and update the URL query
  // TODO: If push or other array mutating methods are used to update the ref, the URL query will not be updated
  const { ignoreUpdates } = watchIgnorable(
    virtualData,
    async (newVal) => {
      const changedKeys: string[] = []
      Object.keys(newVal).forEach((key) => {
        // Normalize new value and compare with the initial value
        if (normalizeValue(newVal[key]) !== normalizeValue(data.value[key])) {
          updatedData.value[key] = newVal[key]
          changedKeys.push(key)
        }
      })

      if (!changedKeys.length) return

      const queryObj = Object.fromEntries(
        changedKeys.map((key) => {
          // Normalize value to string
          const value = normalizeValue(newVal[key])
          const initialVal = normalizeValue(defaultValues[key])

          // Remove new values that are equal to their initial value or undefined
          return value === initialVal || value === undefined ? [key] : [key, value]
        })
      )

      // We pause the query watcher, as we don't want to trigger it with this update
      pauseQueryWatcher()
      await replaceQuery(queryObj)
      resumeQueryWatcher()
    },
    { deep: true }
  )

  ignoreVirtualDataUpdates = ignoreUpdates

  // Initialize data from the URL query
  let stop: (payload: UpdatePayload) => void = () => {}
  onMounted(() => {
    // Save a snapshot of the data since syncRef will remove undefined properties from the object, we need to keep them
    const dataSnapshot = { ...data.value }
    stop = syncRef(data, updatedData)

    ignoreVirtualDataUpdates?.(() => {
      const { query } = route
      updatedData.value = getDataFromQuery(query, dataSnapshot)
      virtualData.value = { ...updatedData.value }
    })
  })

  // Stop the sync on HMR updates
  if (import.meta.hot && stop) import.meta.hot.on('vite:beforeUpdate', stop)

  // Reset the data when the component is unmounted
  onBeforeUnmount(() => {
    virtualData.value = { ...defaultValues }
    updatedData.value = { ...defaultValues }
  })

  return virtualData
}
