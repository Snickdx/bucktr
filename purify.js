import purifycss from "purify-css"
const purifycss = require("purify-css");

let content = "";
let css = "";
let options = {
  output: "www/build/main.css"
};
purify(content, css, options);
