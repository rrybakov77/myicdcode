import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ command, mode }) => ({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Split large chapter data files into separate chunks
          if (id.includes('chunks/chapter_')) {
            const match = id.match(/chapter_(\d+)/);
            if (match) return `chapter-${match[1]}`;
          }
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        }
      }
    }
  }
}))
