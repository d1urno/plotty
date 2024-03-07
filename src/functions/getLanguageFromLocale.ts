import { StoryLanguage } from '@/constants/rules'

export default function getLanguageFromLocale(locale: string) {
  switch (locale) {
    case 'es':
      return StoryLanguage.SPANISH
    case 'fr':
      return StoryLanguage.FRENCH
    case 'de':
      return StoryLanguage.GERMAN
    case 'pt':
      return StoryLanguage.PORTUGUESE
    case 'af':
      return StoryLanguage.AFRIKAANS
    default:
      return StoryLanguage.ENGLISH
  }
}
