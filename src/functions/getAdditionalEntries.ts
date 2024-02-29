function isSameObjectType<T>(obj: unknown): obj is T {
  return typeof obj === 'object' && obj !== null
}

export default function getAdditionalEntries<T extends Record<string, string | object | undefined>>(
  obj: T,
  keysToOmit: (keyof T)[] = [],
  subKeysToOmit?: (keyof T)[]
): [string, string][] {
  return Object.entries(obj).reduce(
    (acc, [key, value]) => {
      if (!keysToOmit.includes(key)) {
        if (typeof value === 'string') acc.push([key, value])
        else if (isSameObjectType<T>(value))
          acc.push(...getAdditionalEntries(value, subKeysToOmit ?? []))
      }
      return acc
    },
    [] as [string, string][]
  )
}
