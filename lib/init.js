// dependencies
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  // generate empty js files in assets based on liquid files in a src directory
  createSRCScripts: function(srcPath) {
    const creationDirectory = srcPath.split("/").slice(-1)[0];
    const creationPath = path.join(
      srcPath,
      `../assets/js/${creationDirectory}`
    );
    console.log("Create Path:", creationPath);
    if (!fs.existsSync(creationPath)) {
      fs.mkdirSync(creationPath, { recursive: true });
    }
    fs.readdirSync(srcPath)
      .filter(function(file) {
        return file.indexOf(".") !== 0 && file.slice(-7) === ".liquid";
      })
      .forEach(function(file) {
        const fileName = file.split(".")[0];
        fs.writeFileSync(
          path.join(creationPath, `${fileName}.js`),
          `// ${fileName} scripts`
        );
      });
  },
  buildNewDist: function(srcPath) {
    // unix
    let distPath = srcPath.replace("src", "dist");
    // copy src folder to dist
    fs.copySync(srcPath, distPath);
    // remove the existing production assets directory
    fs.removeSync(path.join(distPath, "assets"));
  },
  // generate webpack entries based on a folder in assets/js
  getJSEntries: function(assetPath, prefix) {
    // add a dash to the prefix
    prefix += prefix ? "-" : "";
    assetPath = `/..${assetPath}`;
    const container = {};
    // read all of the js files in the folder
    if (fs.existsSync(assetPath)) {
      fs.readdirSync(assetPath)
        .filter(function(file) {
          return file.indexOf(".") !== 0 && file.slice(-3) === ".js";
        })
        .forEach(function(file) {
          const fileName = `${prefix}${file.split(".")[0]}`;
          container[fileName] = path.join(
            // __dirname,
            assetPath,
            `${file}`
          );
        });
    }

    return container;
  }
};
