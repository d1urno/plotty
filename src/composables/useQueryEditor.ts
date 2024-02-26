import { useRoute, useRouter } from 'vue-router'

export default function useQueryEditor<T>() {
  const route = useRoute()
  const router = useRouter()

  async function replaceQuery(
    queryObj: Partial<Record<keyof T, string | string[] | number | number[] | undefined>>
  ) {
    // Replace empty values with undefined to remove them from the URL
    const query = Object.fromEntries(
      Object.entries(queryObj).map(([key, value]) => {
        if (Array.isArray(value)) return [key, value.length ? value.join(',') : undefined]
        return [key, value !== undefined && String(value).length ? value : undefined]
      })
    )
    return router.replace({ query: { ...route.query, ...(query as Record<string, string>) } })
  }

  return {
    replaceQuery
  }
}
