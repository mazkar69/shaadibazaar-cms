import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Increase chunk size warning limit (CKEditor alone is ~1.2MB)
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks - split large libraries
          'vendor-react': ['react', 'react-dom', 'react-router'],
          'vendor-rsuite': ['rsuite'],
          'vendor-ckeditor': ['@ckeditor/ckeditor5-build-classic', '@ckeditor/ckeditor5-react'],
          'vendor-dnd': ['@dnd-kit/core', '@dnd-kit/sortable', '@dnd-kit/utilities'],
        }
      }
    }
  }
})

