# conventional-commits-filter

[![ESM-only package][package]][package-url]
[![NPM version][npm]][npm-url]
[![Node version][node]][node-url]
[![Dependencies status][deps]][deps-url]
[![Install size][size]][size-url]
[![Build status][build]][build-url]
[![Coverage status][coverage]][coverage-url]

[package]: https://img.shields.io/badge/package-ESM--only-ffe536.svg
[package-url]: https://nodejs.org/api/esm.html

[npm]: https://img.shields.io/npm/v/conventional-commits-filter.svg
[npm-url]: https://npmjs.com/package/conventional-commits-filter

[node]: https://img.shields.io/node/v/conventional-commits-filter.svg
[node-url]: https://nodejs.org

[deps]: https://img.shields.io/librariesio/release/npm/conventional-commits-filter
[deps-url]: https://libraries.io/npm/conventional-commits-filter

[size]: https://packagephobia.com/badge?p=conventional-commits-filter
[size-url]: https://packagephobia.com/result?p=conventional-commits-filter

[build]: https://img.shields.io/github/actions/workflow/status/conventional-changelog/conventional-changelog/tests.yaml?branch=master
[build-url]: https://github.com/conventional-changelog/conventional-changelog/actions

[coverage]: https://coveralls.io/repos/github/conventional-changelog/conventional-changelog/badge.svg?branch=master
[coverage-url]: https://coveralls.io/github/conventional-changelog/conventional-changelog?branch=master

Filter out reverted commits parsed by conventional-commits-parser.

## Install

```bash
# pnpm
pnpm add conventional-commits-filter
# yarn
yarn add conventional-commits-filter
# npm
npm i conventional-commits-filter
```

## Usage

```js
import { filterRevertedCommitsSync } from 'conventional-commits-filter'

// commits parsed by conventional-commits-parser,
// where one commit reverts another
const commits = [/* ... */]

for (const commit of filterRevertedCommitsSync(commits)) {
  console.log(commit) // reverted commits are filtered out
}
```

## Documentation

For streams and async iterables helpers and API reference, visit the [documentation website](https://conventional-changelog.js.org/commits-filter/).

## License

MIT © [Steve Mao](https://github.com/stevemao)
