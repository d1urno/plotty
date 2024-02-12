import type { FieldPolicy } from '@apollo/client/core'
import type { Info } from '@/types/generated'

interface PaginatedResults {
  info: Info
  results: unknown[]
}

export default function getPaginationPolicy(keyArgs?: (string[] | string)[]) {
  return {
    keyArgs,
    merge(
      // eslint-disable-next-line @typescript-eslint/default-param-last
      existing = {
        results: [],
        info: { count: 0, pages: 0, next: null, prev: null }
      },
      incoming: PaginatedResults,
      { args }
    ): PaginatedResults {
      if (!incoming.info) return existing

      // Determine the offset based on the current page
      const offset = args ? (args.page - 1) * (args.count ?? 20) : 0

      // Combine the existing items with the incoming items
      const mergedResults: unknown[] = existing.results ? existing.results.slice(0) : []
      for (let i = 0; i < incoming.results.length; i += 1) {
        mergedResults[offset + i] = incoming.results[i]
      }

      // Update the pagination info
      const mergedInfo = { ...existing.info, ...incoming.info }

      // Return the merged result
      return { ...existing, results: mergedResults, info: mergedInfo }
    },
    read(existing): PaginatedResults | undefined {
      // Optionally, you can customize the read function to return a subset of items
      // based on the current page and page size, or to implement other custom
      // read behaviors.
      return existing
    }
  } satisfies FieldPolicy<PaginatedResults>
}
