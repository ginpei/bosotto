import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/client/pages/home/index.html'),
        tl: resolve(__dirname, 'src/client/pages/tl/tl.html'),
      },
    },
  },
});
