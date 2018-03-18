module.exports = {
  "globDirectory": "www/",
  "globPatterns": [
    "**/*.{eot,scss,svg,ttf,woff,woff2,png,ico,css,js,html,json}"
  ],
  "swDest": "www/service-worker.js",
  "swSrc": "src/sw-src.js",
  "globIgnores": [
    "src/sw-src.js"
  ]
};
