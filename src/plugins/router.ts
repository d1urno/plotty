import { createRouter, createWebHistory } from 'vue-router'
import type { AppModule } from '@/types/local'

export const install: AppModule = ({ app, routes, baseUrl }) => {
  const router = createRouter({
    history: createWebHistory(baseUrl),
    routes
  })

  app.use(router)
}

export default install
