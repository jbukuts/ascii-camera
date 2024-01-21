import { URL, fileURLToPath } from 'url'
import basicSsl from '@vitejs/plugin-basic-ssl'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import topLevelAwait from 'vite-plugin-top-level-await'
import wasm from 'vite-plugin-wasm'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    wasm(),
    topLevelAwait(),
    basicSsl(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,wasm}']
      },
      devOptions: {
        enabled: false
      },
      manifest: {
        name: 'My Awesome App',
        short_name: 'MyApp',
        description: 'My Awesome App description',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  base: '/ascii-camera/',
  worker: {
    format: 'es',
    plugins: () => [wasm(), topLevelAwait()]
  },
  resolve: {
    alias: {
      '@/': fileURLToPath(new URL('./src/', import.meta.url)) + '/',
      '#pinch': fileURLToPath(
        new URL(
          './node_modules/@coddicat/vue-pinch-scroll-zoom',
          import.meta.url
        )
      ),
      '#styles': fileURLToPath(new URL('./src/assets/styles', import.meta.url))
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "#styles/global" as *;\n`
      }
    }
  },
  server: {
    https: 'true',
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp'
    }
  }
})
