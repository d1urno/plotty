import { ref } from 'vue'
import { useRouter } from 'vue-router'

const savedPositions = {} as { [key: string]: number }
let fromPopState = false
window.addEventListener('popstate', () => {
  fromPopState = true
})

function is$El(el: HTMLElement | { $el: HTMLElement } | null): el is { $el: HTMLElement } {
  return (el as { $el: HTMLElement })?.$el !== undefined
}

/**
 * Save scroll position
 */
export default function useScrollPosition() {
  const router = useRouter()
  const root = ref<HTMLElement | { $el: HTMLElement } | null>(null)

  function setScrollPosition(newScrollTop: number) {
    if (!root.value) return
    if (is$El(root.value)) root.value.$el.scrollTop = newScrollTop
    else root.value.scrollTop = newScrollTop
  }

  router.afterEach((to, from) => {
    const scrollTop = is$El(root.value) ? root.value.$el.scrollTop : root.value?.scrollTop
    if (!from.name) return
    if (from.name === to.name) setScrollPosition(0)
    savedPositions[from.name] = scrollTop ?? 0
  })

  function updateScrollPosition() {
    // Wait a bit to let fromPopState be set. Waiting on https://github.com/vuejs/vue-router/issues/3453
    setTimeout(() => {
      if (!root.value) return
      if (!fromPopState) setScrollPosition(0)
      else if (Object.keys(savedPositions).some((key) => key === router.currentRoute.value.name)) {
        setScrollPosition(savedPositions[router.currentRoute.value.name])
      } else {
        setScrollPosition(0)
      }

      fromPopState = false
    }, 1)
  }

  return { root, updateScrollPosition }
}
