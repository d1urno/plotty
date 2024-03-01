<script setup lang="ts">
import { RouterLink, useLink, useRouter } from 'vue-router'
import { useNetwork } from '@vueuse/core'
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

const requestIdleCallback =
  window.requestIdleCallback ||
  ((cb: (options: { didTimeout: boolean; timeRemaining: () => number }) => void) => {
    const start = Date.now()
    return setTimeout(() => {
      cb({
        didTimeout: false,
        timeRemaining: () => Math.max(0, 50 - (Date.now() - start))
      })
    }, 1)
  })

const cancelIdleCallback =
  window.cancelIdleCallback ||
  ((id: number) => {
    clearTimeout(id)
  })

const observer =
  window.IntersectionObserver &&
  new window.IntersectionObserver((entries) => {
    entries.forEach(({ intersectionRatio, target: link }) => {
      if (intersectionRatio <= 0 || !(link as { prefetch?: () => void }).prefetch) return
      ;(link as Element & { prefetch: () => void }).prefetch()
    })
  })

const props = defineProps({
  prefetch: {
    type: Boolean,
    default: true
  },
  noPrefetch: {
    type: Boolean,
    default: false
  },
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  ...RouterLink.props,
  activeClass: {
    type: String,
    default: ''
  },
  inactiveClass: {
    type: String,
    default: ''
  },
  noIcon: {
    type: Boolean,
    default: false
  }
})

const router = useRouter()

const { route } = useLink({ to: props.to, ...props })
const el = ref<Element | null>(null)
const observed = ref(false)
const handleId = ref(0)

const isExternalLink = computed(() => typeof props.to === 'string' && props.to.startsWith('http'))

function getPrefetchComponents() {
  const ref = router.resolve(props.to, route.value)
  // TODO: Remove any mapping
  const Components = ref.matched.map<any>((r) => r?.components?.default)

  return Components.filter(
    (Component) => typeof Component === 'function' && !Component.options && !Component.prefetched
  )
}

function shouldPrefetch() {
  return getPrefetchComponents().length > 0
}

function canPrefetch() {
  const { isOnline, effectiveType, saveData } = useNetwork(window)
  const hasBadConnection = !isOnline.value || effectiveType.value?.includes('2g') || saveData.value
  return !hasBadConnection
}

function prefetchLink() {
  if (!canPrefetch()) return

  observer.unobserve(el.value as Element & { prefetch?: () => void })
  const Components = getPrefetchComponents()

  Components.forEach((Component) => {
    const newComponent = Component
    const componentOrPromise = newComponent?.()
    if (componentOrPromise instanceof Promise) {
      componentOrPromise.catch(() => {
        //
      })
    }
    newComponent.prefetched = true
  })
}

function observe() {
  if (!observer) {
    return
  }
  if (shouldPrefetch()) {
    ;(el.value as Element & { prefetch?: () => void }).prefetch = prefetchLink
    observer.observe(el.value as Element & { prefetch?: () => void })
    observed.value = true
  }
}

onMounted(() => {
  if (props.prefetch && !props.noPrefetch && !isExternalLink.value) {
    handleId.value = requestIdleCallback(observe, { timeout: 2e3 })
  }
})

onBeforeUnmount(() => {
  cancelIdleCallback(handleId.value)

  if (observed.value) {
    observer.unobserve(el.value as Element & { prefetch?: () => void })
    delete (el.value as Element & { prefetch?: () => void }).prefetch
  }
})

defineOptions({ inheritAttrs: false })
</script>

<template>
  <span>
    <a v-if="isExternalLink" v-bind="$attrs" :href="to" target="_blank" rel="noopener">
      <slot />↗️
    </a>
    <router-link v-else v-slot="{ isActive, href, navigate }" :to="to" v-bind="$props" custom>
      <a
        v-bind="$attrs"
        ref="el"
        :href="href"
        :class="isActive ? activeClass : inactiveClass"
        @click.prevent
        @mousedown="navigate"
        @keydown.enter="navigate(new MouseEvent('click'))"
        @keyup.space="navigate(new MouseEvent('click'))"
      >
        <slot />
      </a>
    </router-link>
  </span>
</template>
