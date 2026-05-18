// app.config.js — Single source of truth for Expo config (app.json removed)
// During EAS builds, GOOGLE_SERVICES_JSON env var holds the path to the uploaded secret file.
// Locally, it falls back to ./google-services.json (gitignored).

module.exports = () => ({
  name: 'QuickDoc',
  slug: 'quickdoc',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'light',
  splash: {
    image: './assets/splash-icon.png',
    resizeMode: 'contain',
    backgroundColor: '#0EA5E9',
  },
  ios: {
    supportsTablet: false,
    bundleIdentifier: 'com.ajaykumar0210.quickdoc',
  },
  android: {
    package: 'com.ajaykumar0210.quickdoc',
    googleServicesFile: process.env.GOOGLE_SERVICES_JSON ?? './google-services.json',
    adaptiveIcon: {
      backgroundColor: '#0EA5E9',
      foregroundImage: './assets/android-icon-foreground.png',
      backgroundImage: './assets/android-icon-background.png',
      monochromeImage: './assets/android-icon-monochrome.png',
    },
    predictiveBackGestureEnabled: false,
  },
  web: {
    favicon: './assets/favicon.png',
  },
  extra: {
    eas: {
      projectId: '60e8b997-22b4-45de-9053-f4812e30bf1e',
    },
  },
  owner: 'ajaykumar0210',
  plugins: [
    '@react-native-firebase/app',
    '@react-native-firebase/auth',
    'expo-font',
  ],
});
