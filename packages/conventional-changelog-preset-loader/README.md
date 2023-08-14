# conventional-changelog-preset-loader

[![NPM version][npm]][npm-url]
[![Node version][node]][node-url]
[![Dependencies status][deps]][deps-url]
[![Build status][build]][build-url]
[![Coverage status][coverage]][coverage-url]

[npm]: https://img.shields.io/npm/v/conventional-changelog-preset-loader.svg
[npm-url]: https://npmjs.com/package/conventional-changelog-preset-loader

[node]: https://img.shields.io/node/v/conventional-changelog-preset-loader.svg
[node-url]: https://nodejs.org

[deps]: https://img.shields.io/librariesio/release/npm/conventional-changelog-preset-loader
[deps-url]: https://libraries.io/npm/conventional-changelog-preset-loader/tree

[build]: https://img.shields.io/github/actions/workflow/status/conventional-changelog/conventional-changelog/ci.yaml?branch=master
[build-url]: https://github.com/conventional-changelog/conventional-changelog/actions

[coverage]: https://coveralls.io/repos/github/conventional-changelog/conventional-changelog/badge.svg?branch=master
[coverage-url]: https://coveralls.io/github/conventional-changelog/conventional-changelog?branch=master

Configuration preset loader for `conventional-changelog`.

## Usage

Install:

```bash
# yarn
yarn add -D conventional-changelog-preset-loader
# pnpm
pnpm add -D conventional-changelog-preset-loader
# npm
npm i -D conventional-changelog-preset-loader
```

Import `loadPreset` function from the package and use it to load the preset:

```js
const { loadPreset } = require('conventional-changelog-preset-loader')

loadPreset('angular').then((config) => {
  // do something with config object
})
```

By default it uses `import` to load preset. If you want to use `require` instead, you can create own loader with `createPresetLoader` function:

```js
const { createPresetLoader } = require('conventional-changelog-preset-loader')

const loadPreset = createPresetLoader(require)
```

## Preset package resolution

Firstly, loader will try prepend `conventional-changelog` to the preset name and load it.

For example:
- `angular` => `conventional-changelog-angular`
- `angular/preset/path` => `conventional-changelog-angular/preset/path`
- `@scope/angular` => `@scope/conventional-changelog-angular`
- `@scope/angular/preset/path` => `@scope/conventional-changelog-angular/preset/path`

If it fails, it will try to load preset using name as is.

## Preset exports

Preset package should have default export which is a async (returns `Promise`) or sync function that accepts optional `options` object and returns the config object:

```js
export default function createPreset(options) {
  return {
    // config
  }
}
```

## Preset options

To pass options to the preset, `loadPreset` function accepts object with `name` property as first argument:

```js
const { loadPreset } = require('conventional-changelog-preset-loader')

loadPreset({
  name: 'angular',
  ...presetOptions
}).then((config) => {
  // do something with config object
})
```

## License

MIT © [Steve Mao](https://github.com/stevemao)
