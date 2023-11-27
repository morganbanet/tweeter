import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: { proxy: { '/api': 'http://localhost:5000' } },
  test: {
    environment: 'jsdom',
    setupFiles: './tests/testSetup.js',
    coverage: {
      reportsDirectory: './tests/coverage',
      reporter: ['text', 'json', 'html'],
      statements: 80,
      branches: 80,
      functions: 80,
      lines: 80,
    },
  },
});
