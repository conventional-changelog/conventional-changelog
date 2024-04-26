# git-raw-commits

[![ESM-only package][package]][package-url]
[![NPM version][npm]][npm-url]
[![Node version][node]][node-url]
[![Dependencies status][deps]][deps-url]
[![Install size][size]][size-url]
[![Build status][build]][build-url]
[![Coverage status][coverage]][coverage-url]

[package]: https://img.shields.io/badge/package-ESM--only-ffe536.svg
[package-url]: https://nodejs.org/api/esm.html

[npm]: https://img.shields.io/npm/v/git-raw-commits.svg
[npm-url]: https://npmjs.com/package/git-raw-commits

[node]: https://img.shields.io/node/v/git-raw-commits.svg
[node-url]: https://nodejs.org

[deps]: https://img.shields.io/librariesio/release/npm/git-raw-commits
[deps-url]: https://libraries.io/npm/git-raw-commits/tree

[size]: https://packagephobia.com/badge?p=git-raw-commits
[size-url]: https://packagephobia.com/result?p=git-raw-commits

[build]: https://img.shields.io/github/actions/workflow/status/conventional-changelog/conventional-changelog/tests.yaml?branch=master
[build-url]: https://github.com/conventional-changelog/conventional-changelog/actions

[coverage]: https://coveralls.io/repos/github/conventional-changelog/conventional-changelog/badge.svg?branch=master
[coverage-url]: https://coveralls.io/github/conventional-changelog/conventional-changelog?branch=master

Get raw git commits out of your repository using git-log(1).

## Install

```bash
# pnpm
pnpm add git-raw-commits
# yarn
yarn add git-raw-commits
# npm
npm i git-raw-commits
```

## CLI

```bash
# Example
git-raw-commits --from HEAD~2 --to HEAD^
# For more details
git-raw-commits --help
```

## API

For JS API see [@conventional-changelog/git-client](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/git-client).

## License

MIT © [Steve Mao](https://github.com/stevemao)
