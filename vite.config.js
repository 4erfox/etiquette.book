// vite.config.js
import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  server: {
    port: 3000,
    // Прокси для API запросов
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:7778',
        changeOrigin: true,
      }
    },
    // Разрешаем доступ к файлам вне public
    fs: {
      allow: [
        // Корень проекта
        path.resolve(__dirname),
        // Папка admin
        path.resolve(__dirname, 'admin'),
        // Папка public
        path.resolve(__dirname, 'public'),
      ]
    }
  },
  // Корень для статических файлов
  root: 'public',
  // Обслуживание файлов из public
  publicDir: 'public',
  // Настройка алиасов для импортов
  resolve: {
    alias: {
      '/admin': path.resolve(__dirname, 'public', 'admin'),
    }
  },
  // Оптимизация зависимостей
  optimizeDeps: {
    exclude: ['admin-panel.js', 'bridge.js']
  }
});