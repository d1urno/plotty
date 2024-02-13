import './assets/main.css'
import { createApp } from 'vue'
import type { AppModule } from '@/types/local'
import { routes } from 'vue-router/auto/routes'
import App from './App.vue'

const app = createApp(App)

Object.values(import.meta.glob('./plugins/*.ts', { eager: true })).map((i) =>
  (i as { install?: AppModule }).install?.({ app, routes, baseUrl: import.meta.env.BASE_URL })
)

app.mount('#app')
