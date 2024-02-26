import { StoryGenre } from '@/constants/rules'

function getGenreImgBackground(genre: StoryGenre) {
  switch (genre) {
    case StoryGenre.ACTION:
      return 'bg-[url("@/assets/action.webp")]'
    case StoryGenre.FANTASY:
      return 'bg-[url("@/assets/fantasy.webp")]'
    case StoryGenre.COMEDY:
      return 'bg-[url("@/assets/comedy.webp")]'
    case StoryGenre.HISTORICAL:
      return 'bg-[url("@/assets/historical.webp")]'
    case StoryGenre.MYSTERY:
      return 'bg-[url("@/assets/mystery.webp")]'
    case StoryGenre.ROMANCE:
      return 'bg-[url("@/assets/romance.webp")]'
    case StoryGenre.ADVENTURE:
      return 'bg-[url("@/assets/adventure.webp")]'
    case StoryGenre.FUTURISTIC:
      return 'bg-[url("@/assets/futuristic.webp")]'
    case StoryGenre.SCI_FI:
      return 'bg-[url("@/assets/sci_fi.webp")]'
    case StoryGenre.DRAMA:
      return 'bg-[url("@/assets/drama.webp")]'
    default:
      return ''
  }
}

export default function getGenreImg(genre: StoryGenre, asBackground = false) {
  if (asBackground) return getGenreImgBackground(genre)
  return new URL(`/src/assets/${genre.toLowerCase()}.webp`, import.meta.url).href
}
