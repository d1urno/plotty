export default function isDeepEqual<T>(a: T, b: T): boolean {
  // Function to compare to objects deeply
  function isObject(obj: unknown): obj is Record<string, unknown> {
    return obj !== null && typeof obj === 'object'
  }

  // If both a and b are objects, we compare their keys and values
  if (isObject(a) && isObject(b)) {
    const aKeys = Object.keys(a)
    const bKeys = Object.keys(b)
    if (aKeys.length !== bKeys.length) return false
    aKeys.forEach((key) => isDeepEqual(a[key], b[key]))
    return true
  }

  // If a and b are not objects, we compare their values
  return a === b
}
