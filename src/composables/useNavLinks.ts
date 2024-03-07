import { useI18n } from 'vue-i18n'
import { computed } from 'vue'

export default function useNavLinks() {
  const { t } = useI18n()

  return computed(() => [
    {
      label: t('layout.default.nav.home'),
      value: '/',
      bgColorClass: 'bg-blue-600/80'
    },
    {
      label: t('layout.default.nav.stories'),
      value: '/stories',
      bgColorClass: 'bg-teal-500/80'
    },
    {
      label: t('layout.default.nav.new'),
      value: '/new',
      bgColorClass: 'bg-orange-500'
    }
  ])
}
