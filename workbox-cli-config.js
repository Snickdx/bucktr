module.exports = {
  "globDirectory": "www\\",
  "globPatterns": [
    "**/*.{eot,scss,svg,ttf,woff,woff2,ico,png,css,map,js,html,json}"
  ],
  "swSrc": "src/sw-src.js",
  "swDest": "www/service-worker.js",
  "globIgnores": [
    "..\\workbox-cli-config.js",
    "src/sw-src.js"
  ]
};
