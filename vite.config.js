import { defineConfig } from 'vite'

export default defineConfig({
  test: {
    forceRerunTriggers: [
      'packages/*/package.json',
      '**/vitest.config.*',
      '**/vite.config.*'
    ],
    coverage: {
      reporter: ['lcovonly', 'text']
    }
  }
})
