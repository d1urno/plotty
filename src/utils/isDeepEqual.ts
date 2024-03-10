function isObject(obj: unknown): obj is Record<string, unknown> {
  return obj !== null && typeof obj === 'object'
}

// Function to compare to objects deeply
export default function isDeepEqual<T>(a: T, b: T): boolean {
  // If both a and b are objects, we compare their keys and values
  if (isObject(a) && isObject(b)) {
    const aKeys = Object.keys(a)
    const bKeys = Object.keys(b)
    if (aKeys.length !== bKeys.length) return false
    return aKeys.every((key) => isDeepEqual(a[key], b[key]))
  }

  // If both a and b are arrays, we compare their values
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false
    return a.every((val, index) => isDeepEqual(val, b[index]))
  }

  // If a and b are not objects, we compare their values
  return a === b
}
