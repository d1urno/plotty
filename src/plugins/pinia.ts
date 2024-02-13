import { createPinia } from 'pinia'
import type { AppModule } from '@/types/local'

export const install: AppModule = ({ app }) => {
  const pinia = createPinia()
  app.use(pinia)
}

export default install
