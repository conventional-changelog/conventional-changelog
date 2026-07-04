# conventional-changelog-preset-loader

[![ESM-only package][package]][package-url]
[![NPM version][npm]][npm-url]
[![Node version][node]][node-url]
[![Dependencies status][deps]][deps-url]
[![Install size][size]][size-url]
[![Build status][build]][build-url]
[![Coverage status][coverage]][coverage-url]

[package]: https://img.shields.io/badge/package-ESM--only-ffe536.svg
[package-url]: https://nodejs.org/api/esm.html

[npm]: https://img.shields.io/npm/v/conventional-changelog-preset-loader.svg
[npm-url]: https://npmjs.com/package/conventional-changelog-preset-loader

[node]: https://img.shields.io/node/v/conventional-changelog-preset-loader.svg
[node-url]: https://nodejs.org

[deps]: https://img.shields.io/librariesio/release/npm/conventional-changelog-preset-loader
[deps-url]: https://libraries.io/npm/conventional-changelog-preset-loader

[size]: https://packagephobia.com/badge?p=conventional-changelog-preset-loader
[size-url]: https://packagephobia.com/result?p=conventional-changelog-preset-loader

[build]: https://img.shields.io/github/actions/workflow/status/conventional-changelog/conventional-changelog/tests.yaml?branch=master
[build-url]: https://github.com/conventional-changelog/conventional-changelog/actions

[coverage]: https://coveralls.io/repos/github/conventional-changelog/conventional-changelog/badge.svg?branch=master
[coverage-url]: https://coveralls.io/github/conventional-changelog/conventional-changelog?branch=master

Configuration preset loader for `conventional-changelog`.

## Install

```bash
# pnpm
pnpm add conventional-changelog-preset-loader
# yarn
yarn add conventional-changelog-preset-loader
# npm
npm i conventional-changelog-preset-loader
```

## Usage

```js
import { loadPreset } from 'conventional-changelog-preset-loader'

loadPreset('angular').then((config) => {
  // do something with config object
})
```

## Documentation

For preset package resolution, preset exports, and options, visit the [documentation website](https://conventional-changelog.js.org/preset-loader/).

## License

MIT © [Steve Mao](https://github.com/stevemao)
