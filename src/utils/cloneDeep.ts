export default function cloneDeep(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(cloneDeep)
  }
  if (value !== null && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, val]) => [key, cloneDeep(val)]))
  }
  return value
}
