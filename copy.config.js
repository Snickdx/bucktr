module.exports = {
  // overrides the default copyFonts task from node_modules/@ionic/app-scripts/config/copy.config.js
  // so that only ionicons are copied (and not roboto and noto-sans fonts)
  copyFonts: {
    src: [],
    dest: '{{WWW}}/assets/fonts'
  }
};
