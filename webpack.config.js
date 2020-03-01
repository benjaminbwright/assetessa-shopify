// dependencies
const path = require("path");
const fs = require("fs-extra");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

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
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"]
          }
        }
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: "../../dist/assets"
            }
          },
          {
            loader: "css-loader",
            options: {
              import: true
            }
          },
          {
            loader: "sass-loader"
          }
        ]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      path: "../../dist/assets",
      filename: "style.css"
    })
  ]
};
