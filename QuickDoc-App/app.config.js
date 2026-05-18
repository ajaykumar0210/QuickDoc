// app.config.js — Dynamic config to support EAS secret file for google-services.json
// During EAS builds, GOOGLE_SERVICES_JSON env var holds the path to the uploaded secret file.
// Locally, it falls back to ./google-services.json (gitignored).

const baseConfig = require('./app.json');

module.exports = () => ({
  ...baseConfig.expo,
  android: {
    ...baseConfig.expo.android,
    googleServicesFile: process.env.GOOGLE_SERVICES_JSON ?? './google-services.json',
  },
});
