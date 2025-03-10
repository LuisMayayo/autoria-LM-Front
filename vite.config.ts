import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://a65be034e05f44fc4b7d6860484a1406-224601945.us-east-1.elb.amazonaws.com',
        changeOrigin: true,
        secure: false,  // 🔄 Desactiva SSL estricto si usas HTTP
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
});
