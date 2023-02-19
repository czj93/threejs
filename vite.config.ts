// @ts-ignore
import { resolve } from 'path'
import glsl from 'vite-plugin-glsl'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      // @ts-ignore
      "@": resolve(__dirname, 'src'), // 路径别名
    },
    extensions: ['.js', '.json', '.ts', 'glsl']
  },
  plugins: [glsl(), vue()],
})
