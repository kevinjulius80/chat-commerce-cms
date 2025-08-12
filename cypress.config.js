const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
  env: {
    APP_URL: 'http://127.0.0.1:9080',
    AUTH_API_URL: 'http://localhost:8080',
    BACKEND_API_URL: 'http://localhost:8181',
  },
});
