// Dependencies
const path = require("path");
const fs = require("fs-extra");
const yaml = require("js-yaml");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const BrowserSyncPlugin = require("browser-sync-webpack-plugin");
const { getJSEntries, buildNewDist } = require("./lib/init");
const watch = require("node-watch");

// get yaml store config for constructing live reload
const storeConfig = yaml.safeLoad(
  fs.readFileSync(path.join(__dirname, "..", "..", "src", "config.yml"))
);

// build new dist folder
buildNewDist(path.join(__dirname, "..", "..", "src"));

watch(
  path.join(__dirname, "..", "..", "src"),
  { recursive: true, filter: /\.liquid$/ },
  (event, file) => {
    filePath = file.replace("src", "dist");
    fs.copySync(file, filePath);
  }
);

// setup webpack entry for js from pagescripts
const jsEntries = {
  // get template js entries
  application: path.join(
    __dirname,
    "..",
    "..",
    "src",
    "assets",
    "application.js"
  ),
  ...getJSEntries(
    path.join(__dirname, "..", "..", "src", "assets", "js", "templates"),
    "template"
  ),
  // get section js entries
  ...getJSEntries(
    path.join(__dirname, "..", "..", "src", "assets", "js", "sections"),
    "sections"
  )
  //...config.jsEntries
};

// export config for webpack
module.exports = {
  // mode set to production by default
  mode: "production",
  entry: jsEntries,
  output: {
    filename: "[name].js",
    path: path.join(__dirname, "..", "..", "dist", "assets")
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
              publicPath: path.join("..", "..", "dist", "assets")
            }
          },
          {
            loader: "css-loader",
            options: {
              import: true
            }
          },
          {
            loader: "postcss-loader",
            options: {
              sourceMap: true,
              config: {
                path: path.resolve(__dirname, "postcss.config.js")
              }
            }
          },
          {
            loader: "sass-loader"
          }
        ]
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              publicPath: path.join("..", "..", "src", "assets", "images"),
              name: "[name].[ext]"
            }
          }
        ]
      }
      // {
      //   test: /\.(liquid)$/,
      //   use: [
      //     {
      //       loader: "file-loader",
      //       options: {
      //         name: "[name].[ext]"
      //       }
      //     }
      //   ]
      // }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      path: path.join("..", "..", "dist", "assets"),
      filename: "theme.scss.liquid"
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
        // browser: "open",
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
