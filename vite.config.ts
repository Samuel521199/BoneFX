import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@core': path.resolve(__dirname, './src/core'),
      '@ai': path.resolve(__dirname, './src/ai'),
      '@animation': path.resolve(__dirname, './src/animation'),
      '@plugins': path.resolve(__dirname, './src/plugins'),
      '@tools': path.resolve(__dirname, './src/tools'),
      '@editor': path.resolve(__dirname, './src/editor'),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom', 'three'],
          'editor': ['@mui/material', '@mui/icons-material'],
          'animation': ['konva', 'react-konva'],
        },
      },
    },
  },
}); 