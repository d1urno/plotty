import { fileURLToPath, URL } from 'node:url'
import VueRouter from 'unplugin-vue-router/vite'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { getFileBasedRouteName } from 'unplugin-vue-router'
import Layouts from 'vite-plugin-vue-layouts'
import { webfontDownload } from 'vite-plugin-webfont-dl'
import VueDevTools from 'vite-plugin-vue-devtools'
import VueI18n from '@intlify/unplugin-vue-i18n/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    VueRouter({
      // Remove Page suffix as it is only used for better file naming
      getRouteName: (routeNode) => getFileBasedRouteName(routeNode).replaceAll('-page', ''),
      extendRoute(route) {
        // eslint-disable-next-line no-param-reassign
        route.path = route.fullPath.replace('-page', '')
      }
    }),
    vue(),
    Layouts({ defaultLayout: 'default-layout' }),
    // https://github.com/intlify/bundle-tools/tree/main/packages/unplugin-vue-i18n
    VueI18n({
      runtimeOnly: true,
      compositionOnly: true,
      fullInstall: true,
      include: [fileURLToPath(new URL('./locales/**', import.meta.url))]
    }),
    webfontDownload(),
    VueDevTools()
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    port: 3000,
    host: true
  }
})
