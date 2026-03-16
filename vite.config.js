import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        briefing: resolve(__dirname, 'pages/briefing.html'),
        process: resolve(__dirname, 'pages/process.html'),
        results: resolve(__dirname, 'pages/results.html'),
        survey: resolve(__dirname, 'pages/survey.html'),
        impressum: resolve(__dirname, 'pages/impressum.html'),
      }
    }
  }
})
