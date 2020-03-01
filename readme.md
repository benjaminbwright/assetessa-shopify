# Assetessa Shopify

A simple webpack asset pipeline for Shopify themes.

## Features

- Compiles and minifies js files
- Compiles and minifies css and sass
- Live reloads the page on updates

## Usage

### File Structure

All of your shopify theme files must be placed inside of a `src` directory.

### Installation

`npm install -D assetessa-shopify`

### Setup

Run `npx assetessa-shopify init` which will create js files for templates and sections inside of the `src/assets/js/` directory. All js files will be output in the `dist/assetst/` directory based based on their folder name (e.g. `template-product.js`). You can reference these output files in your Shopify liquid templates.

### Questions?

If you have any questions on the usage of the package, please contact benjamin@famousstick.com.
