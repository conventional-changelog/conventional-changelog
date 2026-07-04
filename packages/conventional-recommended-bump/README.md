# conventional-recommended-bump

[![ESM-only package][package]][package-url]
[![NPM version][npm]][npm-url]
[![Node version][node]][node-url]
[![Dependencies status][deps]][deps-url]
[![Install size][size]][size-url]
[![Build status][build]][build-url]
[![Coverage status][coverage]][coverage-url]

[package]: https://img.shields.io/badge/package-ESM--only-ffe536.svg
[package-url]: https://nodejs.org/api/esm.html

[npm]: https://img.shields.io/npm/v/conventional-recommended-bump.svg
[npm-url]: https://npmjs.com/package/conventional-recommended-bump

[node]: https://img.shields.io/node/v/conventional-recommended-bump.svg
[node-url]: https://nodejs.org

[deps]: https://img.shields.io/librariesio/release/npm/conventional-recommended-bump
[deps-url]: https://libraries.io/npm/conventional-recommended-bump

[size]: https://packagephobia.com/badge?p=conventional-recommended-bump
[size-url]: https://packagephobia.com/result?p=conventional-recommended-bump

[build]: https://img.shields.io/github/actions/workflow/status/conventional-changelog/conventional-changelog/tests.yaml?branch=master
[build-url]: https://github.com/conventional-changelog/conventional-changelog/actions

[coverage]: https://coveralls.io/repos/github/conventional-changelog/conventional-changelog/badge.svg?branch=master
[coverage-url]: https://coveralls.io/github/conventional-changelog/conventional-changelog?branch=master

Get a recommended version bump based on conventional commits.

## Install

```bash
# pnpm
pnpm add conventional-recommended-bump
# yarn
yarn add conventional-recommended-bump
# npm
npm i conventional-recommended-bump
```

## Usage

```js
import { Bumper } from 'conventional-recommended-bump'

const bumper = new Bumper().loadPreset('angular')
const recommendation = await bumper.bump()

console.log(recommendation.releaseType) // 'major'
```

CLI is also available:

```sh
conventional-recommended-bump --help
```

## Documentation

For comprehensive guides, CLI options, and API reference, visit the [documentation website](https://conventional-changelog.js.org/version-bump/).

## License

MIT © [Steve Mao](https://github.com/stevemao)
