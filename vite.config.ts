import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@core': path.resolve(__dirname, './src/core'),
      '@ai': path.resolve(__dirname, './src/ai'),
      '@animation': path.resolve(__dirname, './src/animation'),
      '@plugins': path.resolve(__dirname, './src/plugins'),
      '@tools': path.resolve(__dirname, './src/tools'),
      '@editor': path.resolve(__dirname, './src/editor'),
    },
  },
  optimizeDeps: {
    needsInterop: ['onnxruntime-web'],
  },
  server: {
    port: 3000,
    open: true,
    fs: {
      strict: false,
    },
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
          'onnxruntime': ['onnxruntime-web'],
        },
      },
    },
  },
  publicDir: 'public',
}); 