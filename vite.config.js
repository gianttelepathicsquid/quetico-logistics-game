import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      external: [
        'fsevents',
        'path',
        'crypto',
        'fs',
        'util',
        'events',
        'stream',
        'buffer',
        'querystring',
        'url',
        'http',
        'https',
        'zlib',
        'net',
        'tls',
        'assert',
        'tty',
        'os',
        'constants'
      ],
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'lucide-react']
        }
      }
    }
  }
});
