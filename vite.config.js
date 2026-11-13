import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin-allow-popups'
    },
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
        secure: false
      }
    }
  },
  build: {
    target: 'es2020',
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/') || id.includes('node_modules/react-router-dom/')) {
            return 'react-vendor';
          }
          if (id.includes('node_modules/firebase/')) {
            return 'firebase-vendor';
          }
          if (id.includes('node_modules/recharts/') || id.includes('node_modules/d3-')) {
            return 'charts-vendor';
          }
          if (id.includes('node_modules/framer-motion/')) {
            return 'motion-vendor';
          }
          if (id.includes('node_modules/html2pdf.js/')) {
            return 'html2pdf';
          }
          if (id.includes('node_modules/lucide-react/') || id.includes('node_modules/react-icons/')) {
            return 'ui-icons';
          }
        }
      }
    },
    chunkSizeWarningLimit: 1200
  }
})
