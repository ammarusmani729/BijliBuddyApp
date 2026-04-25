const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Add 'cjs' to the supported extensions to fix Firebase Firestore errors in Expo
config.resolver.sourceExts.push('cjs');

module.exports = config;
