import './assets/main.css'
import { createApp } from 'vue'
import type { AppModule } from '@/types/local'
import { routes as defaultRoutes } from 'vue-router/auto/routes'
import { setupLayouts } from 'virtual:generated-layouts'
import App from './App.vue'

const app = createApp(App)
const routes = setupLayouts(defaultRoutes)

Object.values(import.meta.glob('./plugins/*.ts', { eager: true })).map((i) =>
  (i as { install?: AppModule }).install?.({ app, routes, baseUrl: import.meta.env.BASE_URL })
)

app.mount('#app')
