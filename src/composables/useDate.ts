import { formatDistanceToNow, formatRelative } from 'date-fns'
import { enUS, es, fr, ptBR, de } from 'date-fns/locale'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

export default function useDate(date?: string | number | Date) {
  const { locale } = useI18n()

  function getDate() {
    if (!date) return new Date()
    return new Date(date)
  }

  const dateLocale = computed(() => {
    switch (locale.value) {
      case 'es':
        return es
      case 'pt':
        return ptBR
      case 'fr':
        return fr
      case 'de':
        return de
      default:
        return enUS
    }
  })

  const timeAgo = computed(() =>
    formatDistanceToNow(getDate(), { addSuffix: true, locale: dateLocale.value })
  )

  const formattedDate = computed(() =>
    formatRelative(getDate(), new Date(), { locale: dateLocale.value })
  )

  return {
    timeAgo,
    formattedDate
  }
}
