BrowserFS.install window
BrowserFS.configure {fs: "LocalStorage"}, ->
  window.fs = fs = require("fs")
  fs.writeFileSync("sample.pug", "h1 Hello World!")

