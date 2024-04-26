# git-semver-tags

[![ESM-only package][package]][package-url]
[![NPM version][npm]][npm-url]
[![Node version][node]][node-url]
[![Dependencies status][deps]][deps-url]
[![Install size][size]][size-url]
[![Build status][build]][build-url]
[![Coverage status][coverage]][coverage-url]

[package]: https://img.shields.io/badge/package-ESM--only-ffe536.svg
[package-url]: https://nodejs.org/api/esm.html

[npm]: https://img.shields.io/npm/v/git-semver-tags.svg
[npm-url]: https://npmjs.com/package/git-semver-tags

[node]: https://img.shields.io/node/v/git-semver-tags.svg
[node-url]: https://nodejs.org

[deps]: https://img.shields.io/librariesio/release/npm/git-semver-tags
[deps-url]: https://libraries.io/npm/git-semver-tags/tree

[size]: https://packagephobia.com/badge?p=git-semver-tags
[size-url]: https://packagephobia.com/result?p=git-semver-tags

[build]: https://img.shields.io/github/actions/workflow/status/conventional-changelog/conventional-changelog/tests.yaml?branch=master
[build-url]: https://github.com/conventional-changelog/conventional-changelog/actions

[coverage]: https://coveralls.io/repos/github/conventional-changelog/conventional-changelog/badge.svg?branch=master
[coverage-url]: https://coveralls.io/github/conventional-changelog/conventional-changelog?branch=master

Get all git semver tags of your repository in reverse chronological order.

*Note:* since lightweight tags do not store date information, the date of a tag is the date of the commit that is tagged on. If two tags on one commit, the order is not guaranteed.

## Install

```bash
# pnpm
pnpm add git-semver-tags
# yarn
yarn add git-semver-tags
# npm
npm i git-semver-tags
```

## CLI

```bash
# Example
git-semver-tags
# Output:
# v2.0.0
# v1.0.0
# For more details
git-semver-tags --help
```

## API

For JS API see [@conventional-changelog/git-client](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/git-client).

## License

MIT © [Steve Mao](https://github.com/stevemao)
