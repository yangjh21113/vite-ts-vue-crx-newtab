import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import { CRX_CONTENT_OUTDIR } from './globalConfig'

export default defineConfig({
  build: {
    outDir: CRX_CONTENT_OUTDIR,
    lib: {
      entry: [resolve(__dirname, 'content.html')],
      formats: ['cjs'],
      fileName: () => {
        return 'content.js'
      }
    },
    rollupOptions: {
      output: {
        assetFileNames: assetInfo => {
          return 'content.css'
        }
      }
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  server: {
    open: '/content.html'
  },
  define: {
    'process.env.NODE_ENV': null
  },
  plugins: [
    vue(),
    createSvgIconsPlugin({
      iconDirs: [resolve(__dirname, 'src/common/assets/svgs')]
    })
  ]
})
