# Assetessa Shopify

A simple webpack asset pipeline for Shopify themes.

## Features

- Compiles and minifies js files
- Compiles and minifies css and sass
- Live reloads the page on updates
- ES6 import syntax

## Usage

### File Structure

All of your shopify theme files must be placed inside of a `src` directory. Here is the minimum folder structur you will need:

```
root
|-- src
    |-- assets
        |-- images
            |-- image.png
        |-- application.js
        |__ application.scss
    |-- config
    |-- layout
    |-- locales
    |-- sections
    |-- snippets
    |-- templates
    |-- config.yml
|-- package.json
```

### Installation

```
npm install -D assetessa-shopify
```

### Setup

Run `npx assetessa-shopify init` which will create js files for templates and sections inside of the `src/assets/js/` directory. All js files will be output in the `dist/assetst/` directory based based on their folder name:

```
src/assets/js/templates/product.js
```

will be output as:

```
src/assets/template-product.js
```

You can reference these output files in your Shopify liquid templates.

### Commands

```
npx assetessa-shopify buid
```

Builds the `dist` folder with Webpack and places it in the root of your project and will open the preview in your browser.

```
npx assetessa-shopify watch
```

Builds the `dist` folder with Webpack and places it in the root of your project and will open the preview in your browser. It will then continue to watch your files for updates. Note: This will not watch your `.liquid` files, it will only watch any javascript webpack entries (e.g `application.js`). To see live updates reflected, you will need to run this in conjunction with Shopifies Themekit commands. Here is an example `package.json` excerpt:

```
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "webpack": "npx assetessa-shopify watch",
    "watch": "npm run theme-watch & npm run webpack",
    "theme-watch": "cd dist && theme watch",
    "theme-deploy": "cd dist && theme deploy"
  },
```

In this example, when you run `npm run watch` the theme watcher will start and webpack will crunch your assets into the `dist` and open up a browser window. The correct styles may not show up on the initial load, but when you begin making updates to the files the browser window will begin reloading with the correct styles displaying.

### Questions?

If you have any questions on the usage of the package, please contact benjamin@famousstick.com.
