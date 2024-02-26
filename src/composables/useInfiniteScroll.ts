import { ref, onUnmounted, type Ref, watch } from 'vue'

export default function useInfiniteScroll(callback: () => void) {
  const infiniteScrollRoot: Ref<HTMLElement | null> = ref(null)
  const infiniteScrollTrigger: Ref<HTMLElement | null> = ref(null)
  let observer: IntersectionObserver | null = null

  function onIntersect(entries: IntersectionObserverEntry[]) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) callback()
    })
  }

  // Do not use onMounted here, because the component may be conditionally rendered
  watch(
    infiniteScrollTrigger,
    (newVal, oldVal) => {
      if (newVal) {
        observer = new IntersectionObserver(onIntersect, {
          root: infiniteScrollRoot.value,
          rootMargin: '400px',
          threshold: 1.0
        })
        observer.observe(newVal)
      } else if (observer && oldVal) {
        observer.unobserve(oldVal)
      }
    },
    { immediate: true }
  )

  onUnmounted(() => {
    if (observer && infiniteScrollTrigger.value) observer.unobserve(infiniteScrollTrigger.value)
  })

  return {
    infiniteScrollRoot,
    infiniteScrollTrigger
  }
}
