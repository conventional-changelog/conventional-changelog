# conventional-changelog-writer

[![ESM-only package][package]][package-url]
[![NPM version][npm]][npm-url]
[![Node version][node]][node-url]
[![Dependencies status][deps]][deps-url]
[![Install size][size]][size-url]
[![Build status][build]][build-url]
[![Coverage status][coverage]][coverage-url]

[package]: https://img.shields.io/badge/package-ESM--only-ffe536.svg
[package-url]: https://nodejs.org/api/esm.html

[npm]: https://img.shields.io/npm/v/conventional-changelog-writer.svg
[npm-url]: https://npmjs.com/package/conventional-changelog-writer

[node]: https://img.shields.io/node/v/conventional-changelog-writer.svg
[node-url]: https://nodejs.org

[deps]: https://img.shields.io/librariesio/release/npm/conventional-changelog-writer
[deps-url]: https://libraries.io/npm/conventional-changelog-writer

[size]: https://packagephobia.com/badge?p=conventional-changelog-writer
[size-url]: https://packagephobia.com/result?p=conventional-changelog-writer

[build]: https://img.shields.io/github/actions/workflow/status/conventional-changelog/conventional-changelog/tests.yaml?branch=master
[build-url]: https://github.com/conventional-changelog/conventional-changelog/actions

[coverage]: https://coveralls.io/repos/github/conventional-changelog/conventional-changelog/badge.svg?branch=master
[coverage-url]: https://coveralls.io/github/conventional-changelog/conventional-changelog?branch=master

Write logs based on conventional commits and templates.

## Install

```bash
# pnpm
pnpm add conventional-changelog-writer
# yarn
yarn add conventional-changelog-writer
# npm
npm i conventional-changelog-writer
```

## Usage

```js
import { writeChangelogString } from 'conventional-changelog-writer'

// commits parsed by conventional-commits-parser
const commits = [/* ... */]
const context = {
  version: '1.0.0',
  host: 'https://github.com',
  owner: 'conventional-changelog',
  repository: 'conventional-changelog'
}

console.log(await writeChangelogString(commits, context))
/*
## 1.0.0 (2015-05-29)

### Features

* **ng-list:** Allow custom separator ([13f3160](https://github.com/...))
...
*/
```

## Documentation

For streams and async iterables helpers, context and options reference, customization guide, and CLI usage, visit the [documentation website](https://conventional-changelog.js.org/changelog-writer/).

## License

MIT © [Steve Mao](https://github.com/stevemao)
