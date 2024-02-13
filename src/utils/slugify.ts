/**
 * Slugify a value
 */
export default function slugify(...args: (string | number)[]) {
  const value = args.join(' ')

  return value
    .normalize('NFD') // Split an accented letter in the base letter and the accent
    .replace(/[\u0300-\u036f]/g, '') // Remove all previously split accents
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9 ]/g, '') // Remove all chars not letters, numbers and spaces (to be replaced)
    .replace(/\s+/g, '-') // Separator
}
