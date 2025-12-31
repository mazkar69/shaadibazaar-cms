import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Increase chunk size warning limit (CKEditor alone is ~1.2MB)
    chunkSizeWarningLimit: 1500,
    
  }
})

