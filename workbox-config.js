module.exports = {
  "globDirectory": "www/",
  "globPatterns": [
    "**/*.{eot,scss,woff,woff2,svg,ttf,png,ico,css,js,html,json}"
  ],
  "swDest": "www/service-worker.js",
  "swSrc": "src/sw-src.js",
  "globIgnores": [
    "src/sw-src.js"
  ]
};
