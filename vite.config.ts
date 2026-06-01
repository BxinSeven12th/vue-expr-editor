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
          fileName: (format) => format === 'es' ? 'vue-expr-editor.js' : 'vue-expr-editor.umd.cjs',
        },
        rollupOptions: {
          external: ['vue'],
          output: { globals: { vue: 'Vue' } },
        },
        cssCodeSplit: false,
      }
    : {},
}))
