import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  optimizeDeps: {
    include: ['motion-dom', 'framer-motion'],
  },
  build: {
    rolldownOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react-router') || id.includes('/react/') || id.includes('/react-dom/')) {
              return 'react-vendor';
            }
            if (id.includes('framer-motion') || id.includes('motion-dom')) {
              return 'motion-vendor';
            }
            if (id.includes('recharts') || id.includes('d3-')) {
              return 'charts-vendor';
            }
            if (id.includes('lucide-react') || id.includes('react-icons')) {
              return 'icons-vendor';
            }
          }
        },
      },
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': 'http://localhost:5000',
      '/uploads': 'http://localhost:5000',
    },
  },
});