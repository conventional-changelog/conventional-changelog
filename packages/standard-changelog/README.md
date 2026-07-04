# standard-changelog

[![ESM-only package][package]][package-url]
[![NPM version][npm]][npm-url]
[![Node version][node]][node-url]
[![Dependencies status][deps]][deps-url]
[![Install size][size]][size-url]
[![Build status][build]][build-url]
[![Coverage status][coverage]][coverage-url]

[package]: https://img.shields.io/badge/package-ESM--only-ffe536.svg
[package-url]: https://nodejs.org/api/esm.html

[npm]: https://img.shields.io/npm/v/standard-changelog.svg
[npm-url]: https://npmjs.com/package/standard-changelog

[node]: https://img.shields.io/node/v/standard-changelog.svg
[node-url]: https://nodejs.org

[deps]: https://img.shields.io/librariesio/release/npm/standard-changelog
[deps-url]: https://libraries.io/npm/standard-changelog

[size]: https://packagephobia.com/badge?p=standard-changelog
[size-url]: https://packagephobia.com/result?p=standard-changelog

[build]: https://img.shields.io/github/actions/workflow/status/conventional-changelog/conventional-changelog/tests.yaml?branch=master
[build-url]: https://github.com/conventional-changelog/conventional-changelog/actions

[coverage]: https://coveralls.io/repos/github/conventional-changelog/conventional-changelog/badge.svg?branch=master
[coverage-url]: https://coveralls.io/github/conventional-changelog/conventional-changelog?branch=master

An opinionated approach to CHANGELOG generation using angular commit conventions.

## Install

```bash
# pnpm
pnpm add standard-changelog
# yarn
yarn add standard-changelog
# npm
npm i standard-changelog
```

## Usage

```sh
standard-changelog
```

The above generates a changelog based on commits since the last semver tag that match the pattern of a "Feature", "Fix", "Performance Improvement" or "Breaking Changes".

All available command line parameters can be listed using CLI: `standard-changelog --help`.

JS API is also available:

```js
import { StandardChangelog } from 'standard-changelog'

const generator = new StandardChangelog()
  .readPackage()

generator
  .writeStream()
  .pipe(process.stdout)
```

## Documentation

For comprehensive guides, CLI options, and API reference, visit the [documentation website](https://conventional-changelog.js.org/standard-changelog/).

## License

MIT
