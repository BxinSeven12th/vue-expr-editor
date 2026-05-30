import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig(({ command }) => ({
  plugins: [vue()],
  build: command === 'build'
    ? {
        lib: {
          entry: './src/index.ts',
          name: 'VueExprEditor',
          formats: ['es', 'umd'] as const,
          fileName: 'vue-expr-editor',
        },
        rollupOptions: {
          external: ['vue'],
          output: { globals: { vue: 'Vue' } },
        },
        cssCodeSplit: false,
      }
    : {},
}))
