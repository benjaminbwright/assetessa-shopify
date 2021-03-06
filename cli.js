#!/usr/bin/env node

const path = require("path");
const webpack = require("webpack");
const webpackConfig = require("./webpack.config.js");
const { createSRCScripts } = require("./lib/init");

// npx assetessa-shopify <input>
const input = process.argv[2];

// get webpack instance
const compiler = webpack(webpackConfig);

switch (input) {
  // initialize the project
  case "init":
    createSRCScripts(path.join(__dirname, "../../src/templates"));
    createSRCScripts(path.join(__dirname, "../../src/sections"));
    break;
  // build the assets
  case "build":
    console.log("Bundling assets...");
    compiler.run((err, stats) => {
      if (err) {
        console.log(err);
      }
    });
    break;
  case "watch":
    console.log("Watching for changes in asset files...");
    compiler.watch(
      {
        // Example watchOptions
        aggregateTimeout: 300,
        poll: undefined
      },
      (err, stats) => {
        // Stats Object
        // Print watch/build result here...
        console.log(stats);
      }
    );
    break;
}
