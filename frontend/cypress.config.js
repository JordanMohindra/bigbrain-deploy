import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    // Increase timeout for slow operations
    defaultCommandTimeout: 10000,
    // Wait longer for page loads
    pageLoadTimeout: 120000,
    // Configure retries for more stable tests
    retries: {
      runMode: 2,
      openMode: 0,
    },
    // Configure viewport size
    viewportWidth: 1280,
    viewportHeight: 720,
    // Configure screenshot and video settings
    screenshotOnRunFailure: true,
    video: true,
    videoCompression: 32,
  },
})
