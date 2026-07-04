# conventional-changelog-conventionalcommits

[![ESM-only package][package]][package-url]
[![NPM version][npm]][npm-url]
[![Node version][node]][node-url]
[![Dependencies status][deps]][deps-url]
[![Install size][size]][size-url]
[![Build status][build]][build-url]
[![Coverage status][coverage]][coverage-url]

[package]: https://img.shields.io/badge/package-ESM--only-ffe536.svg
[package-url]: https://nodejs.org/api/esm.html

[npm]: https://img.shields.io/npm/v/conventional-changelog-conventionalcommits.svg
[npm-url]: https://npmjs.com/package/conventional-changelog-conventionalcommits

[node]: https://img.shields.io/node/v/conventional-changelog-conventionalcommits.svg
[node-url]: https://nodejs.org

[deps]: https://img.shields.io/librariesio/release/npm/conventional-changelog-conventionalcommits
[deps-url]: https://libraries.io/npm/conventional-changelog-conventionalcommits

[size]: https://packagephobia.com/badge?p=conventional-changelog-conventionalcommits
[size-url]: https://packagephobia.com/result?p=conventional-changelog-conventionalcommits

[build]: https://img.shields.io/github/actions/workflow/status/conventional-changelog/conventional-changelog/tests.yaml?branch=master
[build-url]: https://github.com/conventional-changelog/conventional-changelog/actions

[coverage]: https://coveralls.io/repos/github/conventional-changelog/conventional-changelog/badge.svg?branch=master
[coverage-url]: https://coveralls.io/github/conventional-changelog/conventional-changelog?branch=master

A concrete implementation of the specification described at [conventionalcommits.org](https://conventionalcommits.org/) for automated CHANGELOG generation and version management.

## Install

```bash
# pnpm
pnpm add -D conventional-changelog-conventionalcommits
# yarn
yarn add -D conventional-changelog-conventionalcommits
# npm
npm i -D conventional-changelog-conventionalcommits
```

## Usage

Use with [conventional-changelog](https://conventional-changelog.js.org/conventional-changelog/) by passing the preset name with `-p`:

```sh
conventional-changelog -p conventionalcommits
```

Or use it directly as a base preset to customize it:

```js
import createPreset from 'conventional-changelog-conventionalcommits'

const config = createPreset({
  issuePrefixes: ['TEST-']
})
// do something with the config
```

## Documentation

For the commit convention details and preset options, visit the [documentation website](https://conventional-changelog.js.org/presets/conventional-commits/).
