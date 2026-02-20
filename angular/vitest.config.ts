import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['../common/tests/**/*.test.ts']
  },
  resolve: {
    alias: {
      '@common': resolve(__dirname, '../common')
    }
  }
});
