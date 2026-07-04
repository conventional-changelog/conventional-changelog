# conventional-commits-parser

[![ESM-only package][package]][package-url]
[![NPM version][npm]][npm-url]
[![Node version][node]][node-url]
[![Dependencies status][deps]][deps-url]
[![Install size][size]][size-url]
[![Build status][build]][build-url]
[![Coverage status][coverage]][coverage-url]

[package]: https://img.shields.io/badge/package-ESM--only-ffe536.svg
[package-url]: https://nodejs.org/api/esm.html

[npm]: https://img.shields.io/npm/v/conventional-commits-parser.svg
[npm-url]: https://npmjs.com/package/conventional-commits-parser

[node]: https://img.shields.io/node/v/conventional-commits-parser.svg
[node-url]: https://nodejs.org

[deps]: https://img.shields.io/librariesio/release/npm/conventional-commits-parser
[deps-url]: https://libraries.io/npm/conventional-commits-parser

[size]: https://packagephobia.com/badge?p=conventional-commits-parser
[size-url]: https://packagephobia.com/result?p=conventional-commits-parser

[build]: https://img.shields.io/github/actions/workflow/status/conventional-changelog/conventional-changelog/tests.yaml?branch=master
[build-url]: https://github.com/conventional-changelog/conventional-changelog/actions

[coverage]: https://coveralls.io/repos/github/conventional-changelog/conventional-changelog/badge.svg?branch=master
[coverage-url]: https://coveralls.io/github/conventional-changelog/conventional-changelog?branch=master

Parse raw conventional commits.

## Install

```bash
# pnpm
pnpm add conventional-commits-parser
# yarn
yarn add conventional-commits-parser
# npm
npm i conventional-commits-parser
```

## Usage

```js
import { CommitParser } from 'conventional-commits-parser'

const parser = new CommitParser()
const commit = parser.parse(
  'feat(scope): broadcast $destroy event on scope destruction\nCloses #1'
)

console.log(commit)
/* {
  type: 'feat',
  scope: 'scope',
  subject: 'broadcast $destroy event on scope destruction',
  header: 'feat(scope): broadcast $destroy event on scope destruction',
  footer: 'Closes #1',
  references: [{
    action: 'Closes',
    issue: '1',
    raw: '#1',
    prefix: '#',
    ...
  }],
  ...
} */
```

## Documentation

For streams and async iterables helpers, parser options, and CLI usage, visit the [documentation website](https://conventional-changelog.js.org/commits-parser/).

## License

MIT © [Steve Mao](https://github.com/stevemao)
