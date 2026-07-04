# @conventional-changelog/template

[![ESM-only package][package]][package-url]
[![NPM version][npm]][npm-url]
[![Node version][node]][node-url]
[![Dependencies status][deps]][deps-url]
[![Install size][size]][size-url]
[![Build status][build]][build-url]
[![Coverage status][coverage]][coverage-url]

[package]: https://img.shields.io/badge/package-ESM--only-ffe536.svg
[package-url]: https://nodejs.org/api/esm.html

[npm]: https://img.shields.io/npm/v/@conventional-changelog/template.svg
[npm-url]: https://npmjs.com/package/@conventional-changelog/template

[node]: https://img.shields.io/node/v/@conventional-changelog/template.svg
[node-url]: https://nodejs.org

[deps]: https://img.shields.io/librariesio/release/npm/@conventional-changelog/template
[deps-url]: https://libraries.io/npm/@conventional-changelog%2Ftemplate

[size]: https://packagephobia.com/badge?p=@conventional-changelog/template
[size-url]: https://packagephobia.com/result?p=@conventional-changelog/template

[build]: https://img.shields.io/github/actions/workflow/status/conventional-changelog/conventional-changelog/tests.yaml?branch=master
[build-url]: https://github.com/conventional-changelog/conventional-changelog/actions

[coverage]: https://coveralls.io/repos/github/conventional-changelog/conventional-changelog/badge.svg?branch=master
[coverage-url]: https://coveralls.io/github/conventional-changelog/conventional-changelog?branch=master

Template utilities for conventional changelog generation.

## Install

```bash
# pnpm
pnpm add @conventional-changelog/template
# yarn
yarn add @conventional-changelog/template
# npm
npm i @conventional-changelog/template
```

## Usage

```js
import {
  heading,
  link,
  list,
  url
} from '@conventional-changelog/template'

console.log(heading(2, 'Features')) // ## Features
console.log(link('commit', url('https://github.com/example/repo', 'commit', 'abc123')))
console.log(list(['a', 'b'], item => item))
```

## Documentation

For the API reference, visit the [documentation website](https://conventional-changelog.js.org/template/).

## License

MIT © [Dan Onoshko](https://github.com/dangreen)
