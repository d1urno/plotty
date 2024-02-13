import type { App } from 'vue'
import type { RouteRecordRaw } from 'vue-router'

export type AppModule = (context: { app: App; routes: RouteRecordRaw[]; baseUrl: string }) => void
