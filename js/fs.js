BrowserFS.install(window);
BrowserFS.configure({
  fs: "LocalStorage"
}, function(){
  var fs;
  window.fs = fs = require("fs");
  return fs.writeFileSync("sample.pug", "h1 Hello World!");
});