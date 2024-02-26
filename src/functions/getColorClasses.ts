export type Color =
  | 'blue'
  | 'green'
  | 'orange'
  | 'red'
  | 'yellow'
  | 'purple'
  | 'pink'
  | 'indigo'
  | 'teal'

export default function getColorClasses(color: Color) {
  let bg
  let border
  let ring
  switch (color) {
    case 'blue':
      bg = `bg-blue-500`
      border = `border-blue-500`
      ring = `ring-blue-500`
      break
    case 'green':
      bg = `bg-green-500`
      border = `border-green-500`
      ring = `ring-green-500`
      break
    case 'orange':
      bg = `bg-orange-500`
      border = `border-orange-500`
      ring = `ring-orange-500`
      break
    case 'red':
      bg = `bg-red-500`
      border = `border-red-500`
      ring = `ring-red-500`
      break
    case 'yellow':
      bg = `bg-yellow-500`
      border = `border-yellow-500`
      ring = `ring-yellow-500`
      break
    case 'purple':
      bg = `bg-purple-500`
      border = `border-purple-500`
      ring = `ring-purple-500`
      break
    case 'pink':
      bg = `bg-pink-500`
      border = `border-pink-500`
      ring = `ring-pink-500`
      break
    case 'indigo':
      bg = `bg-indigo-500`
      border = `border-indigo-500`
      ring = `ring-indigo-500`
      break
    case 'teal':
      bg = `bg-teal-500`
      border = `border-teal-500`
      ring = `ring-teal-500`
      break
    default:
      bg = `bg-blue-500`
      border = `border-blue-500`
      ring = `ring-blue-500`
      break
  }
  return { bg, border, ring }
}
