// dependencies
const path = require("path");
const fs = require("fs-extra");
const yaml = require("js-yaml");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const BrowserSyncPlugin = require("browser-sync-webpack-plugin");

// get yaml store config

const storeConfig = yaml.safeLoad(fs.readFileSync("../../dist/config.yml"));

// copy src folder to dist
fs.copySync(
  path.join(__dirname, "../../src"),
  path.join(__dirname, "../../dist")
);

fs.removeSync(path.join(__dirname, "../../dist/assets"));

const getJSEntries = function(assetPath, prefix) {
  // add a dash to the prefix
  prefix += prefix ? "-" : "";
  assetPath = `/..${assetPath}`;
  const container = {};
  // read all of the js files in the folder
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
  return container;
};

// setup webpack entry for js from pagescripts
const jsEntries = {
  application: path.join(__dirname, "../../src/assets/application.js"),
  ...getJSEntries(
    path.join(__dirname, "../../src/assets/js/templates"),
    "template"
  ),
  ...getJSEntries(
    path.join(__dirname, "../../src/assets/js/templates"),
    "sections"
  )
  //...config.jsEntries
};

// fs.readdirSync(__dirname + "/../../src/assets")
//   .filter(function(file) {
//     return file.indexOf(".") !== 0 && file.slice(-3) === ".js";
//   })
//   .forEach(function(file) {
//     jsEntries[file.split(".")[0]] = path.join(
//       __dirname,
//       "../../src/assets",
//       file
//     );
//   });
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
      filename: "theme.css"
    }),
    new BrowserSyncPlugin(
      // BrowserSync options
      {
        // browse to http://localhost:3000/ during development
        host: "localhost",
        port: 3000,
        // proxy the Webpack Dev Server endpoint
        // (which should be serving on http://localhost:3100/)
        // through BrowserSync
        proxy: `https://${storeConfig.development.store}/?preview_theme_id=${storeConfig.development.theme_id}`,
        browser: "google chrome",
        reloadDelay: 4000,
        snippetOptions: {
          rule: {
            match: /<\/body>/i,
            fn: function(snippet, match) {
              return snippet + match;
            }
          }
        }
      },
      // plugin options
      {
        // prevent BrowserSync from reloading the page
        // and let Webpack Dev Server take care of this
        reload: true
      }
    )
  ]
};
