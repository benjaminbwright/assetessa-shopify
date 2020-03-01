// dependencies
const path = require("path");
const fs = require("fs-extra");

// copy src folder to dist
fs.copySync(
  path.join(__dirname, "../../src"),
  path.join(__dirname, "../../dist")
);

fs.removeSync(path.join(__dirname, "../../dist/assets"));

// setup webpack entry for js from pagescripts
const jsEntries = {
  application: path.join(__dirname, "../../src/assets/application.js")
  //...config.jsEntries
};

fs.readdirSync(__dirname + "/../../src/assets")
  .filter(function(file) {
    return file.indexOf(".") !== 0 && file.slice(-3) === ".js";
  })
  .forEach(function(file) {
    jsEntries[file.split(".")[0]] = path.join(
      __dirname,
      "../../src/assets",
      file
    );
  });
console.log(jsEntries);

// export config for webpack
module.exports = {
  // mode set to production by default
  mode: "production",
  entry: jsEntries,
  output: {
    filename: "[name].js",
    path: path.join(__dirname, "../../dist/assets")
  }
};
