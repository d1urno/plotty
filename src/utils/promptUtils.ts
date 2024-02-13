function printObject(obj: Record<string, any>, omittedFields?: string[], depth = 0) {
  let result = ''
  const indent = ' '.repeat(depth * 2) // Calculate the indentation based on the depth
  Object.keys(obj).forEach((key) => {
    if (omittedFields?.includes(key)) return
    const value = obj[key]
    if (typeof value === 'object' && value !== null) {
      result += `${indent}${key}: \n${printObject(value, omittedFields, depth + 1)}\n` // Increase the depth for nested objects
    } else {
      result += `${indent}${key}: ${value}\n`
    }
  })
  return result
}

function removeEmptyLines(input: string): string {
  // Split the input string by newline, filter out empty lines, and join back
  return input
    .split('\n\n')
    .filter((line) => line.trim() !== '') // Use trim to remove whitespace and check if the line is not empty
    .join('\n')
}

export function getLineIf(condition: boolean, line: string) {
  return `${condition ? line : ''}`
}

export function getBlock<T>(title: string, content?: string | Array<T>, omittedFields?: string[]) {
  let contentString = content
  if (Array.isArray(contentString))
    contentString = contentString.reduce(
      (acc, s) => (s instanceof Object ? `${acc}\n\n${printObject(s, omittedFields)}` : acc),
      ''
    )
  return contentString
    ? `${title}:\n
${removeEmptyLines(contentString)}\n`
    : ''
}

export function getBlockIf<T>(
  condition: boolean,
  title: string,
  content?: string | Array<T>,
  omittedFields?: string[]
) {
  if (!condition) return ''
  return getBlock(title, content, omittedFields)
}
