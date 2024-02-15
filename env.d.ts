/// <reference types="vite/client" />

declare module 'vue3-dndrop' {
  import { DefineComponent } from 'vue'

  const Container: DefineComponent<{}, {}, any>
  const Draggable: DefineComponent<{}, {}, any>
}
