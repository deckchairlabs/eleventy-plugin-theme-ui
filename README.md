# eleventy-theme-ui-plugin (alpha)

An [11ty](https://www.11ty.dev/) plugin allowing the use of [ThemeUI](https://theme-ui.com/) within your templates.

This project was bootstrapped with [TSDX](https://github.com/jaredpalmer/tsdx).

## TODO

- Reach some kind of feature parity with the React variant of ThemeUI
- Add some tests

## Installation

```sh
yarn add eleventy-plugin-theme-ui --dev
```

## Configure

```js
const pluginThemeUI = require('eleventy-plugin-theme-ui');

// Your theme adhering to the Theme Specification https://theme-ui.com/theme-spec
const theme = {};

module.exports = function(eleventyConfig) {
  eleventyConfig.addPlugin(pluginThemeUI, {
    theme,
  });
};
```

## Usage

You can use the special `sx, css, variant` HTML attributes within any of the 11ty supported template languages.

```html
<div sx="{ padding: 3, backgroundColor: 'primary', fontSize: [1, 4] }">
  Hello world
</div>

<button variant="buttons.primary">Primary Button</button>
```

## Local Development

Below is a list of commands you will probably find useful.

### `npm start` or `yarn start`

Runs the project in development/watch mode. Your project will be rebuilt upon changes. TSDX has a special logger for you convenience. Error messages are pretty printed and formatted for compatibility with VS Code's Problems tab.

Your library will be rebuilt if you make edits.

### `npm run build` or `yarn build`

Bundles the package to the `dist` folder.
The package is optimized and bundled with Rollup into multiple formats (CommonJS, UMD, and ES Module).

### `npm test` or `yarn test`

Runs the test watcher (Jest) in an interactive mode.
By default, runs tests related to files changed since the last commit.
